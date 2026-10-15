export type AssessmentRecord = {
  id: string;

  patientName: string;
  patientAge: string;

  assessmentType: string;

  score: number;
  status: string;

  observerName: string;

  assessmentDate: string;

  createdAt: string;

  // Trend Analysis Fields
  energy: string;
  appetite: string;
  walking: string;
};

const STORAGE_KEY = "assessmentHistory";

const SAVED_FLAG_KEY =
  "currentAssessmentSaved";

export const saveAssessment = (
  record: AssessmentRecord
) => {
  const existing =
    getAssessmentHistory();

  existing.unshift(record);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing)
  );
};

export const getAssessmentHistory =
  (): AssessmentRecord[] => {
    try {
      return JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "[]"
      );
    } catch {
      return [];
    }
  };

export const getPatientHistory = (
  patientName: string
): AssessmentRecord[] => {
  return getAssessmentHistory().filter(
    (record) =>
      record.patientName ===
      patientName
  );
};

export const getLatestPatientAssessment =
  (
    patientName: string
  ): AssessmentRecord | null => {
    const history =
      getPatientHistory(patientName);

    return history.length > 0
      ? history[0]
      : null;
  };

const LEGACY_SAVED_FLAG_KEY =
  "currentAssessmentSaved";

const ASSESSMENT_ATTEMPT_KEY =
  "currentAssessmentAttemptId";

export const beginAssessmentAttempt = (): string => {
  const attemptId = crypto.randomUUID();

  localStorage.removeItem(LEGACY_SAVED_FLAG_KEY);

  localStorage.setItem(
    ASSESSMENT_ATTEMPT_KEY,
    attemptId
  );

  return attemptId;
};

export const hasAssessmentBeenSaved = (): boolean => {
  const attemptId = localStorage.getItem(
    ASSESSMENT_ATTEMPT_KEY
  );

  if (!attemptId) return false;

  return (
    localStorage.getItem(
      `assessmentSaved:${attemptId}`
    ) === "true"
  );
};

export const markAssessmentSaved = (): void => {
  const attemptId = localStorage.getItem(ASSESSMENT_ATTEMPT_KEY);

  if (attemptId) {
    localStorage.setItem(`assessmentSaved:${attemptId}`, "true");
  }

  localStorage.removeItem(LEGACY_SAVED_FLAG_KEY);
};

export const clearAssessmentSavedFlag = (): void => {
  localStorage.removeItem(LEGACY_SAVED_FLAG_KEY);
  localStorage.removeItem(ASSESSMENT_ATTEMPT_KEY);
};