
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const patientId = url.searchParams.get("patientId");

    if (type !== "SELF" && type !== "FAMILY") {
      return NextResponse.json(
        { success: false, error: "Invalid assessment type." },
        { status: 400 }
      );
    }

    const { data: accesses, error: accessError } = await supabase
      .from("carevr_access")
      .select("family_id, patient_id, access_type, access_status")
      .eq("user_id", user.id)
      .eq("access_status", "ACTIVE");

    if (accessError) throw accessError;

    const activeAccesses = accesses ?? [];

    let query = supabase
      .from("assessments")
      .select(
        "id, user_id, patient_id, assessment_type, score, raw_score, normalized_score, risk_category, recommendation, assessment_version, completed_at, record_classification, report_format_version"
      )
      .eq("assessment_type", type)
      .eq("record_classification", "ENCRYPTED_V1")
      .order("completed_at", { ascending: false });

    if (type === "SELF") {
      const hasPrimaryAccess = activeAccesses.some(
        (access) => access.access_type === "PRIMARY"
      );

      if (!hasPrimaryAccess) {
        return NextResponse.json(
          { success: false, error: "Assessment access denied." },
          { status: 403 }
        );
      }

      query = query.eq("user_id", user.id).is("patient_id", null);
    } else {
      if (!patientId) {
        return NextResponse.json(
          { success: false, error: "Patient ID is required." },
          { status: 400 }
        );
      }

      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select("id, family_id, status")
        .eq("id", patientId)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (patientError) throw patientError;

      if (!patient?.family_id) {
        return NextResponse.json(
          { success: false, error: "Patient not found or access denied." },
          { status: 403 }
        );
      }

      const authorized = activeAccesses.some((access) => {
        if (access.family_id !== patient.family_id) return false;

        if (access.access_type === "PRIMARY") {
          return access.patient_id === null;
        }

        if (
          access.access_type === "SECONDARY_FAMILY_MEMBER" ||
          access.access_type === "CARETAKER"
        ) {
          return (
            access.patient_id === null ||
            access.patient_id === patientId
          );
        }

        return false;
      });

      if (!authorized) {
        return NextResponse.json(
          { success: false, error: "Assessment access denied." },
          { status: 403 }
        );
      }

      query = query.eq("patient_id", patientId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: (data ?? []).map((row) => ({
        id: row.id,
        assessmentType: row.assessment_type,
        patientId: row.patient_id,
        score: row.score,
        rawScore: row.raw_score,
        normalizedScore: row.normalized_score,
        status: row.risk_category,
        recommendation: row.recommendation,
        assessmentVersion: row.assessment_version,
        completedAt: row.completed_at,
        recordClassification: row.record_classification,
        reportFormatVersion: row.report_format_version,
      })),
    });
  } catch (error) {
    console.error("Encrypted assessment history failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load encrypted assessment history.",
      },
      { status: 500 }
    );
  }
}
