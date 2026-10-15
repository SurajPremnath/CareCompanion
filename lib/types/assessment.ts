// lib/types/assessment.ts

export type AssessmentType = "SELF" | "FAMILY";

export type AssessmentStatus =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_ATTENTION"
  | "HEALTH_CONCERN"
  | "IMMEDIATE_ATTENTION";

export type AssessmentRecommendation =
  | "CONTINUE_CURRENT_ROUTINE"
  | "MONITOR_CLOSELY"
  | "CONSULT_DOCTOR"
  | "SEEK_IMMEDIATE_MEDICAL_ATTENTION";

export interface AssessmentAnswers {
  breathing: string;
  cough: boolean;
  bloodInCough: boolean;
  fever: boolean;
  temperature: number | null;
  temperatureUnit?: string;
  energy: string;
  appetite: string;
  waterIntake: string;
  waterGlasses?: string;
  pain: boolean;
  painAreas: string[];
  walkingDifficulty: boolean;
  walkingHelp?: string;
  looseMotions: boolean;
  looseMotionType?: string;
  confusion?: string;
}

export interface AssessmentReportDetails {
  patientName: string | null;
  patientAge: string | null;
  observerName: string | null;
  observerRelationship: string | null;
  observerRelationshipOther: string | null;
  observations: string[];
  suggestions: string[];
  summaryRows: Array<{
    label: string;
    value: string;
  }>;
  wellbeingSummary: string | null;
}

export interface AssessmentInput {
  userId: string;
  patientId: string | null;

  assessmentType: AssessmentType;

  assessmentDate: Date;

  rawScore: number;
  normalizedScore: number;

  status: AssessmentStatus;

  recommendation: AssessmentRecommendation;

  answers: AssessmentAnswers;

reportDetails?: AssessmentReportDetails;

  assessmentVersion: number;

  /**
   * Optional reference to the Daily Care record captured
   * during the same encounter.
   *
   * Null means no vitals were recorded.
   */
  dailyCareId: string | null;
}

export interface AssessmentRecord extends AssessmentInput {
  id: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface AssessmentSummary {
  id: string;

  patientId: string | null;

  assessmentDate: Date;

  normalizedScore: number;

  status: AssessmentStatus;

  recommendation: AssessmentRecommendation;
}

export interface AssessmentHistoryItem {
  id: string;

  patientId: string | null;

  patientName?: string;

  assessmentDate: Date;

  normalizedScore: number;

  status: AssessmentStatus;
}