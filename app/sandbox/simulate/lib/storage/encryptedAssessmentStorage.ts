
import type {
  AssessmentAnswers,
  AssessmentRecord,
  AssessmentStatus,
  AssessmentRecommendation,
  AssessmentReportDetails,
} from "@/lib/types/assessment";

export interface EncryptedAssessmentHistoryItem {
  id: string;
  assessmentType: "SELF" | "FAMILY";
  patientId: string | null;
  score: number | null;
  rawScore: number | null;
  normalizedScore: number | null;
  status: string | null;
  recommendation: string | null;
  assessmentVersion: number;
  completedAt: string;
  recordClassification: "ENCRYPTED_V1";
  reportFormatVersion: number | null;
}

interface EncryptedAssessmentDetail {
  id: string;
  assessmentType: "SELF" | "FAMILY";
  patientId: string | null;
  score: number | null;
  rawScore: number | null;
  normalizedScore: number | null;
  status: string | null;
  recommendation: string | null;
  assessmentVersion: number;
  completedAt: string;
  recordClassification: "ENCRYPTED_V1";
  reportFormatVersion: number;
  payload: unknown;
}

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(
  value: unknown,
  fallback = 0
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function booleanValue(
  value: unknown
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true" ||
      value.toLowerCase() === "yes";
  }

  return false;
}

function stringArrayValue(
  value: unknown
): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string"
      )
    : [];
}

export function encryptedHistoryItemToAssessmentRecord(
  item: EncryptedAssessmentHistoryItem
): AssessmentRecord {
  const completedAt = new Date(item.completedAt);

  return {
    id: item.id,
    userId: "",
    patientId: item.patientId,
    assessmentType: item.assessmentType,
    assessmentDate: completedAt,
    rawScore: item.rawScore ?? item.score ?? 0,
    normalizedScore:
      item.normalizedScore ?? item.score ?? 0,
    status: (
      item.status ?? "NEEDS_ATTENTION"
    ) as AssessmentStatus,
    recommendation: (
      item.recommendation ?? "CONSULT_DOCTOR"
    ) as AssessmentRecommendation,
    answers: {
      breathing: "",
      cough: false,
      bloodInCough: false,
      fever: false,
      temperature: null,
      energy: "",
      appetite: "",
      waterIntake: "",
      pain: false,
      painAreas: [],
      walkingDifficulty: false,
      looseMotions: false,
    } satisfies AssessmentAnswers,
    assessmentVersion: item.assessmentVersion,
    dailyCareId: null,
    createdAt: completedAt,
    updatedAt: completedAt,
  };
}

/**
 * Converts the decrypted detail response into the existing
 * AssessmentRecord shape used by the report UI.
 *
 * The server must return the authorized, decrypted payload.
 * This function does not decrypt anything in the browser.
 */
export function encryptedDetailToAssessmentRecord(
  value: unknown
): AssessmentRecord | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    value.recordClassification !== "ENCRYPTED_V1" ||
    value.reportFormatVersion !== 1 ||
    !isObject(value.payload)
  ) {
    return null;
  }

  const payload = value.payload;
  const subject = isObject(payload.subject)
    ? payload.subject
    : {};
  const answerData = isObject(payload.answers)
    ? payload.answers
    : {};
  const results = isObject(payload.results)
    ? payload.results
    : {};

  const assessmentType =
    value.assessmentType === "SELF" ||
    value.assessmentType === "FAMILY"
      ? value.assessmentType
      : null;

  if (!assessmentType) {
    return null;
  }

  const patientId =
    typeof value.patientId === "string"
      ? value.patientId
      : null;

  if (
    assessmentType === "FAMILY" &&
    !patientId
  ) {
    return null;
  }

  if (
    assessmentType === "SELF" &&
    patientId !== null
  ) {
    return null;
  }

  const completedAt = new Date(
    stringValue(
      value.completedAt,
      stringValue(subject.assessmentDate)
    )
  );

  if (Number.isNaN(completedAt.getTime())) {
    return null;
  }

  const temperatureReading =
    isObject(answerData.temperature)
      ? answerData.temperature.reading
      : answerData.temperature;

  const answers = {
    breathing: stringValue(answerData.breathing),
    cough: booleanValue(answerData.cough),
    bloodInCough: booleanValue(answerData.bloodInCough),
    fever: booleanValue(answerData.fever),

    temperature:
      temperatureReading === null ||
      temperatureReading === undefined ||
      temperatureReading === ""
        ? null
        : numberValue(temperatureReading, NaN),

    temperatureUnit: isObject(answerData.temperature)
      ? stringValue(answerData.temperature.unit)
      : undefined,

    energy: stringValue(answerData.energy),
    appetite: stringValue(answerData.appetite),

    waterIntake: stringValue(answerData.waterIntake),
    waterGlasses: stringValue(answerData.waterGlasses),

    pain: booleanValue(answerData.discomfort),
    painAreas: stringArrayValue(answerData.discomfortAreas),

    walkingDifficulty: booleanValue(answerData.walking),
    walkingHelp: stringValue(answerData.walkingHelp),

    looseMotions: booleanValue(answerData.looseMotions),
    looseMotionType: stringValue(answerData.looseMotionType),
    confusion: stringValue(answerData.confusion),
  } satisfies AssessmentAnswers;

  const summaryRows = Array.isArray(results.summaryRows)
    ? results.summaryRows.flatMap((item) => {
        if (
          !isObject(item) ||
          typeof item.label !== "string" ||
          typeof item.value !== "string"
        ) {
          return [];
        }

        return [{
          label: item.label,
          value: item.value,
        }];
      })
    : [];

  const reportDetails: AssessmentReportDetails = {
    patientName: stringValue(subject.patientName) || null,
    patientAge: stringValue(subject.patientAge) || null,
    observerName: stringValue(
      isObject(payload.observer)
        ? payload.observer.name
        : null
    ) || null,
    observerRelationship: stringValue(
      isObject(payload.observer)
        ? payload.observer.relationship
        : null
    ) || null,
    observerRelationshipOther: stringValue(
      isObject(payload.observer)
        ? payload.observer.relationshipOther
        : null
    ) || null,
    observations: stringArrayValue(results.observations),
    suggestions: stringArrayValue(results.suggestions),
    summaryRows,
    wellbeingSummary: null,
  };

  const rawScore = numberValue(
    value.rawScore ?? results.rawScore,
    numberValue(value.score)
  );

  const normalizedScore = numberValue(
    value.normalizedScore ?? results.normalizedScore,
    numberValue(value.score)
  );

  const status = stringValue(
    results.status,
    stringValue(value.status, "NEEDS_ATTENTION")
  );

  const recommendation = stringValue(
    results.recommendation,
    stringValue(value.recommendation, "CONSULT_DOCTOR")
  );

  return {
    id: stringValue(value.id),
    userId: "",
    patientId,
    assessmentType,
    assessmentDate: completedAt,
    rawScore,
    normalizedScore,
    status: status as AssessmentStatus,
    recommendation:
      recommendation as AssessmentRecommendation,
    answers,
    reportDetails,
    assessmentVersion: numberValue(
      value.assessmentVersion,
      1
    ),
    dailyCareId: null,
    createdAt: completedAt,
    updatedAt: completedAt,
  };
}

interface HistoryApiResponse {
  success: boolean;
  data?: EncryptedAssessmentHistoryItem[];
  error?: string;
}

interface DetailApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
  recordClassification?: string;
}

export const encryptedAssessmentStorage = {
  async getHistory(
    type: "SELF" | "FAMILY",
    patientId?: string
  ): Promise<{
    success: boolean;
    data?: EncryptedAssessmentHistoryItem[];
    error?: string;
  }> {
    if (type === "FAMILY" && !patientId) {
      return {
        success: false,
        error: "Patient ID is required.",
      };
    }

    try {
      const params = new URLSearchParams({ type });

      if (type === "FAMILY" && patientId) {
        params.set("patientId", patientId);
      }

      const response = await fetch(
        `/api/assessments/encrypted/history?${params.toString()}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" },
        }
      );

      const result =
        (await response.json()) as HistoryApiResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        return {
          success: false,
          error:
            result.error ??
            "Unable to load encrypted assessment history.",
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch {
      return {
        success: false,
        error:
          "Unable to load encrypted assessment history.",
      };
    }
  },

  async getById(
    id: string
  ): Promise<DetailApiResponse> {
    if (!id.trim()) {
      return {
        success: false,
        error: "Assessment ID is required.",
      };
    }

    try {
      const response = await fetch(
        `/api/assessments/encrypted/${encodeURIComponent(id)}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" },
        }
      );

      const result =
        (await response.json()) as DetailApiResponse;

      if (
        !response.ok ||
        !result.success ||
        result.data === undefined ||
        result.data === null
      ) {
        const responseData = isObject(result.data)
          ? result.data
          : null;

        return {
          success: false,
          error:
            result.error ??
            "Unable to retrieve encrypted assessment.",
          status: response.status,
          recordClassification:
            typeof responseData?.recordClassification === "string"
              ? responseData.recordClassification
              : undefined,
        };
      }

      return {
        success: true,
        data: result.data,
        status: response.status,
      };
    } catch {
      return {
        success: false,
        error:
          "Unable to retrieve encrypted assessment.",
      };
    }
  },
};
