import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { decryptValue } from "@/lib/security/encryption/encryptionService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Assessment ID is required." },
        { status: 400 }
      );
    }

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

    const { data: assessment, error: assessmentError } =
      await supabase
        .from("assessments")
        .select(
          "id, user_id, patient_id, assessment_type, score, raw_score, normalized_score, risk_category, recommendation, assessment_version, completed_at, report_payload_ciphertext, report_format_version, record_classification"
        )
        .eq("id", id)
        .maybeSingle();

    if (assessmentError) {
      throw assessmentError;
    }

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: "Assessment not found." },
        { status: 404 }
      );
    }

    if (assessment.record_classification === "HISTORICAL") {
      return NextResponse.json(
        {
          success: false,
          error: "Historical assessment. Use the legacy report retrieval path.",
          data: {
            recordClassification: "HISTORICAL",
            reportFormatVersion: assessment.report_format_version,
          },
        },
        { status: 409 }
      );
    }

    if (
      assessment.record_classification !== "ENCRYPTED_V1" ||
      assessment.report_format_version !== 1 ||
      !assessment.report_payload_ciphertext
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment classification or encryption format is invalid.",
          data: {
            recordClassification: assessment.record_classification,
            reportFormatVersion: assessment.report_format_version,
          },
        },
        { status: 409 }
      );
    }

    const { data: accesses, error: accessError } =
      await supabase
        .from("carevr_access")
        .select(
          "family_id, patient_id, access_type, access_status"
        )
        .eq("user_id", user.id)
        .eq("access_status", "ACTIVE");

    if (accessError) {
      throw accessError;
    }

    const activeAccesses = accesses ?? [];

    let authorized = false;

    if (
      assessment.assessment_type === "SELF" &&
      assessment.user_id === user.id
    ) {
      authorized = activeAccesses.some(
        (access) => access.access_type === "PRIMARY"
      );
    }

    if (
      assessment.assessment_type === "FAMILY" &&
      assessment.patient_id
    ) {
      const { data: patient, error: patientError } =
        await supabase
          .from("patients")
          .select("id, family_id, status")
          .eq("id", assessment.patient_id)
          .eq("status", "ACTIVE")
          .maybeSingle();

      if (patientError) {
        throw patientError;
      }

      if (patient?.family_id) {
        authorized = activeAccesses.some((access) => {
          if (access.family_id !== patient.family_id) {
            return false;
          }

          if (access.access_type === "PRIMARY") {
            return access.patient_id === null;
          }

          if (
            access.access_type === "SECONDARY_FAMILY_MEMBER" ||
            access.access_type === "CARETAKER"
          ) {
            return (
              access.patient_id === null ||
              access.patient_id === assessment.patient_id
            );
          }

          return false;
        });
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Assessment access denied." },
        { status: 403 }
      );
    }

    const plaintext = decryptValue(
      assessment.report_payload_ciphertext
    );

    const payload: unknown = JSON.parse(plaintext);

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      throw new Error("Invalid encrypted assessment payload.");
    }

    return NextResponse.json({
      success: true,
      data: {
        id: assessment.id,
        assessmentType: assessment.assessment_type,
        patientId: assessment.patient_id,
        score: assessment.score,
        rawScore: assessment.raw_score,
        normalizedScore: assessment.normalized_score,
        status: assessment.risk_category,
        recommendation: assessment.recommendation,
        assessmentVersion: assessment.assessment_version,
        completedAt: assessment.completed_at,
        recordClassification: assessment.record_classification,
        reportFormatVersion: assessment.report_format_version,
        payload,
      },
    });
  } catch (error) {
    console.error("Encrypted assessment retrieval failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve the encrypted assessment.",
      },
      { status: 500 }
    );
  }
}