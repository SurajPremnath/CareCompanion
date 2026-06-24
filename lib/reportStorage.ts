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

export const hasAssessmentBeenSaved =
  (): boolean => {
    return (
      localStorage.getItem(
        SAVED_FLAG_KEY
      ) === "true"
    );
  };

export const markAssessmentSaved =
  () => {
    localStorage.setItem(
      SAVED_FLAG_KEY,
      "true"
    );
  };

export const clearAssessmentSavedFlag =
  () => {
    localStorage.removeItem(
      SAVED_FLAG_KEY
    );
  };