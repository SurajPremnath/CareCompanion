import type { ConsultationRecord } from "@/lib/medication";

/* ==========================================================
 * Validation
 * ========================================================== */

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  field: string;
  code: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ConsultationValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/* ==========================================================
 * Resolution
 * ========================================================== */

export type ConsultationMatchConfidence =
  | "high"
  | "medium"
  | "low";

export type ConsultationStatus =
  | "new"
  | "follow-up"
  | "duplicate"
  | "updated";

export interface ConsultationMatch {
  consultationId: string;
  score: number;
  confidence: ConsultationMatchConfidence;
  reasons: string[];
}

export interface ConsultationContext {
  patientId: string;
  userId?: string;
  source: string;
  uploadedAt: Date;
  modeOfConsultation?: string;
}

export interface ConsultationResolutionRequest {
  consultation: ConsultationRecord;
  existingConsultations: ConsultationRecord[];
  context: ConsultationContext;
}

export interface ConsultationResolutionResult {
  consultation: ConsultationRecord;
  status: ConsultationStatus;
  matchedConsultation?: ConsultationMatch;
  confidence: ConsultationMatchConfidence;
  reasons: string[];
}

/* ==========================================================
 * Journey Model
 * ========================================================== */

export interface ResolvedConsultation {
  consultation: ConsultationRecord;
  status: ConsultationStatus;
  previousConsultationId?: string;
  confidence?: ConsultationMatchConfidence;
}

/* ==========================================================
 * Engine Result
 * ========================================================== */

export interface ConsultationEngineResult {
  success: boolean;
  result?: ConsultationResolutionResult;
  errors: string[];
}