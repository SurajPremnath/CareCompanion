export interface EncryptedAssessmentReportPayload {
  schemaVersion: 1;

  subject: {
    assessmentType: "SELF" | "FAMILY";
    patientId: string | null;
    patientName: string | null;
    patientAge: string | null;
    assessmentDate: string;
  };

  observer: {
    name: string | null;
    relationship: string | null;
    relationshipOther: string | null;
  };

  answers: {
    breathing: string | null;
    cough: string | null;
    bloodInCough: string | null;
    fever: string | null;
    temperature: {
      reading: string | null;
      unit: string;
    };
    energy: string | null;
    appetite: string | null;
    waterIntake: string | null;
    waterGlasses: string | null;
    discomfort: string | null;
    discomfortAreas: unknown[];
    walking: string | null;
    walkingHelp: string | null;
    looseMotions: string | null;
    looseMotionType: string | null;
    confusion: string | null;
  };

  results: {
    rawScore: number;
    normalizedScore: number;
    status: string;
    recommendation: string;
    observations: string[];
    suggestions: string[];
    summaryRows: unknown[];
  };
}

export interface EncryptedAssessmentReport {
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
  reportFormatVersion: 1;
  payload: EncryptedAssessmentReportPayload;
}