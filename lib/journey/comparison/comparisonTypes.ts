import type { ConsultationRecord } from "@/lib/medication";

/* ==========================================================
 * Comparison Categories
 * ========================================================== */

export type ComparisonCategory =
  | "patient"
  | "consultation"
  | "vitals"
  | "complaints"
  | "history"
  | "assessments"
  | "investigations"
  | "medicines"
  | "doctorInstructions"
  | "followUps";

/* ==========================================================
 * Change Type
 * ========================================================== */

export type ChangeType =
  | "added"
  | "removed"
  | "modified"
  | "unchanged";

/* ==========================================================
 * Change Severity
 * ========================================================== */

export type ChangeSeverity =
  | "critical"
  | "major"
  | "moderate"
  | "minor"
  | "informational";

/* ==========================================================
 * Clinical Impact
 * ========================================================== */

export type ClinicalImpact =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

/* ==========================================================
 * Comparison Confidence
 * ========================================================== */

export type ComparisonConfidence =
  | "high"
  | "medium"
  | "low";

/* ==========================================================
 * Resolution Status
 * ========================================================== */

export type ResolutionStatus =
  | "PENDING"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "FAILED";

/* ==========================================================
 * Comparison Difference
 * ========================================================== */

export interface ComparisonDifference {
  id: string;

  category: ComparisonCategory;

  field: string;

  label: string;

  previousValue?: unknown;

  currentValue?: unknown;

  changeType: ChangeType;

  severity: ChangeSeverity;

  clinicalImpact: ClinicalImpact;

  confidence: ComparisonConfidence;

  reason?: string;

  recommendation?: string;
}

/* ==========================================================
 * Timeline Event Candidate
 * ========================================================== */

export interface TimelineEventCandidate {
  id: string;

  eventType: string;

  title: string;

  description: string;

  occurredAt?: Date;

  priority: ClinicalImpact;
}

/* ==========================================================
 * Follow-up Question Candidate
 * ========================================================== */

export interface QuestionCandidate {
  id: string;

  question: string;

  reason: string;

  required: boolean;

  priority: ClinicalImpact;

  relatedField?: string;
}

/* ==========================================================
 * Clinical Flag
 * ========================================================== */

export interface ClinicalFlag {
  code: string;

  title: string;

  description: string;

  impact: ClinicalImpact;
}

/* ==========================================================
 * Comparison Summary
 * ========================================================== */

export interface ComparisonSummary {
  totalDifferences: number;

  added: number;

  removed: number;

  modified: number;

  unchanged: number;

  criticalChanges: number;

  majorChanges: number;

  timelineEvents: number;

  questionsGenerated: number;

  clinicalFlags: number;
}

/* ==========================================================
 * Comparison Metadata
 * ========================================================== */

export interface ComparisonMetadata {
  comparedAt: Date;

  processingTimeMs: number;

  engineVersion: string;
}

/* ==========================================================
 * Comparison Request
 * ========================================================== */

export interface ComparisonRequest {
  previousConsultation: ConsultationRecord;

  currentConsultation: ConsultationRecord;
}

/* ==========================================================
 * Comparison Result
 * ========================================================== */

export interface ComparisonResult {
  differences: ComparisonDifference[];

  timelineEvents: TimelineEventCandidate[];

  questionCandidates: QuestionCandidate[];

  clinicalFlags: ClinicalFlag[];

  summary: ComparisonSummary;

  metadata: ComparisonMetadata;

  warnings: string[];

  errors: string[];
}

/* ==========================================================
 * Comparison Engine Result
 * ========================================================== */

export interface ComparisonEngineResult {
  success: boolean;

  status: ResolutionStatus;

  result?: ComparisonResult;

  errors: string[];
}