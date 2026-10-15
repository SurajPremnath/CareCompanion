// ==========================================================
// CareVR
// Clinical Summary Types
// ==========================================================

export type ClinicalSeverity =
  | "normal"
  | "attention"
  | "warning"
  | "critical";

export interface ClinicalFinding {

  category: string;

  severity: ClinicalSeverity;

  title: string;

  description: string;

}

export interface ClinicalRecommendation {

  priority: ClinicalSeverity;

  description: string;

}

export interface ClinicalSummary {

  overallAssessment: string;

  normalFindings: ClinicalFinding[];

  attentionFindings: ClinicalFinding[];

  missingFindings: ClinicalFinding[];

  recommendations: ClinicalRecommendation[];

}

// ==========================================================
// Shared Clinical Summary Input
// ==========================================================

export interface ClinicalSummaryInput {

  temperature: number | null;

  temperatureUnit: "F" | "C";

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms: string[];

  painLocations: string[];

  notes?: string | null;

}