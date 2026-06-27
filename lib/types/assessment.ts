export type AssessmentType = "SELF" | "FAMILY";

export type RiskCategory =
  | "LOW"
  | "MODERATE"
  | "HIGH";

export interface Assessment {

  id: string;

  userId: string;

  patientId: string | null;

  assessmentType: AssessmentType;

  responses: Record<string, unknown>;

  score: number;

  riskCategory: RiskCategory;

  assessmentVersion: number;

  completedAt: string;

  createdAt: string;

  updatedAt: string;
}