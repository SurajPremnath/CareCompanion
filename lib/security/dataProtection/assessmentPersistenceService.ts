import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  decryptValue,
  encryptValue,
} from "@/lib/security/encryption/encryptionService";

type AssessmentCareMode = "SELF" | "FAMILY";

type AssessmentStatus =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_ATTENTION"
  | "HEALTH_CONCERN"
  | "IMMEDIATE_ATTENTION";

type AssessmentRecommendation =
  | "CONTINUE_CURRENT_ROUTINE"
  | "MONITOR_CLOSELY"
  | "CONSULT_DOCTOR"
  | "SEEK_IMMEDIATE_MEDICAL_ATTENTION";

interface EncryptedAssessmentRequest {
  assessmentType: AssessmentCareMode;
  patientId: string | null;
  assessmentDate: string;
  rawScore: number;
  normalizedScore: number;
  status: AssessmentStatus;
  recommendation: AssessmentRecommendation;
  assessmentVersion: number;
  dailyCareId: string | null;
  payload: Record<string, unknown>;
}

const VALID_STATUSES: AssessmentStatus[] = [
  "EXCELLENT",
  "GOOD",
  "NEEDS_ATTENTION",
  "HEALTH_CONCERN",
  "IMMEDIATE_ATTENTION",
];

const VALID_RECOMMENDATIONS: AssessmentRecommendation[] = [
  "CONTINUE_CURRENT_ROUTINE",
  "MONITOR_CLOSELY",
  "CONSULT_DOCTOR",
  "SEEK_IMMEDIATE_MEDICAL_ATTENTION",
];

export async function saveEncryptedAssessment(
  request: EncryptedAssessmentRequest
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  if (
    !request ||
    !["SELF", "FAMILY"].includes(request.assessmentType)
  ) {
    throw new Error("Invalid assessment type.");
  }

  if (
    request.assessmentType === "SELF" &&
    request.patientId !== null
  ) {
    throw new Error("SELF assessments must not include a patient.");
  }

  if (
    request.assessmentType === "FAMILY" &&
    (
      typeof request.patientId !== "string" ||
      !request.patientId.trim()
    )
  ) {
    throw new Error("A patient is required for FAMILY assessments.");
  }

  if (
    !request.payload ||
    typeof request.payload !== "object" ||
    Array.isArray(request.payload)
  ) {
    throw new Error("A valid assessment payload is required.");
  }

  if (
    !Number.isFinite(request.rawScore) ||
    !Number.isFinite(request.normalizedScore) ||
    request.rawScore < 0 ||
    request.normalizedScore < 0 ||
    request.normalizedScore > 20
  ) {
    throw new Error("Invalid assessment scores.");
  }

  if (
    !VALID_STATUSES.includes(request.status) ||
    !VALID_RECOMMENDATIONS.includes(request.recommendation)
  ) {
    throw new Error("Invalid assessment result.");
  }

  if (
    !Number.isInteger(request.assessmentVersion) ||
    request.assessmentVersion < 1
  ) {
    throw new Error("Invalid assessment version.");
  }

  const assessmentDate = new Date(request.assessmentDate);

  if (Number.isNaN(assessmentDate.getTime())) {
    throw new Error("Invalid assessment date.");
  }

  const { data: accesses, error: accessError } = await supabase
    .from("carevr_access")
    .select(
      "id, family_id, patient_id, access_type, access_status"
    )
    .eq("user_id", user.id)
    .eq("access_status", "ACTIVE");

  if (accessError) throw accessError;

  const activeAccesses = accesses ?? [];

  if (request.assessmentType === "SELF") {
    const hasPrimaryAccess = activeAccesses.some(
      (access) => access.access_type === "PRIMARY"
    );

    if (!hasPrimaryAccess) {
      throw new Error(
        "Active PRIMARY access is required for a SELF assessment."
      );
    }
  } else {
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, family_id, status")
      .eq("id", request.patientId!)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (patientError) throw patientError;

    if (!patient?.family_id) {
      throw new Error(
        "The selected active patient could not be verified."
      );
    }

    const hasPatientAccess = activeAccesses.some((access) => {
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
          access.patient_id === request.patientId
        );
      }

      return false;
    });

    if (!hasPatientAccess) {
      throw new Error(
        "You are not authorized to assess this patient."
      );
    }
  }

  const payloadJson = JSON.stringify(request.payload);

  if (!payloadJson) {
    throw new Error("Unable to serialize the assessment payload.");
  }

  const ciphertext = encryptValue(payloadJson);

  if (decryptValue(ciphertext) !== payloadJson) {
    throw new Error("Assessment encryption verification failed.");
  }

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      patient_id: request.patientId,
      assessment_type: request.assessmentType,
      responses_json: {},
      score: request.normalizedScore,
      raw_score: request.rawScore,
      normalized_score: request.normalizedScore,
      risk_category: request.status,
      recommendation: request.recommendation,
      assessment_version: request.assessmentVersion,
      daily_care_id: request.dailyCareId,
      completed_at: assessmentDate.toISOString(),
      report_payload_ciphertext: ciphertext,
      report_format_version: 1,
      record_classification: "ENCRYPTED_V1",
    })
    .select(
      "id, user_id, patient_id, assessment_type, score, raw_score, normalized_score, risk_category, recommendation, assessment_version, completed_at, report_format_version, record_classification"
    )
    .single();

  if (error) throw error;

  if (
    !data ||
    data.record_classification !== "ENCRYPTED_V1" ||
    data.report_format_version !== 1
  ) {
    throw new Error(
      "The database did not confirm the encrypted assessment format."
    );
  }

  return data;
}