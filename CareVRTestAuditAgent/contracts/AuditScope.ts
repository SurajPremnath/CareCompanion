/**
 * CareVRTestAuditAgent
 *
 * Audit Scope Contract
 *
 * Purpose:
 * Defines the evidence used to determine whether an AI-enabled
 * processing request remained within the configured CareVR scope.
 *
 * Scope:
 * Measures required information, returned information, missing
 * information and information returned outside the configured scope.
 *
 * Important:
 * The Audit Agent observes and records scope compliance.
 * It does not modify the AI request or result.
 *
 * Scope compliance is measured against the configured requirement.
 * It must not be inferred solely from token usage.
 */

export type ScopeComplianceStatus =
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NON_COMPLIANT"
  | "NOT_ASSESSED";

export interface AuditScope {
  /** Unique identifier for this scope assessment. */
  scopeId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** Document being evaluated. */
  documentId: string;

  /** Page being evaluated, where applicable. */
  pageId: string | null;

  /** AI request associated with this scope assessment. */
  requestId: string | null;

  /** CareVR module being evaluated. */
  module: string;

  /**
   * Identifier/version of the configuration defining the
   * information that the AI was required to extract.
   */
  configurationId: string;

  /** Number of information elements required by the configuration. */
  requiredItemCount: number;

  /** Number of required information elements successfully returned. */
  returnedRequiredItemCount: number;

  /** Number of required information elements that were missing. */
  missingRequiredItemCount: number;

  /**
   * Number of information elements returned by the AI that were
   * outside the configured extraction requirement.
   */
  unexpectedItemCount: number;

  /** Final scope-compliance classification. */
  status: ScopeComplianceStatus;

  /**
   * Optional quantitative compliance percentage.
   * The calculation method will be defined by the audit configuration.
   */
  compliancePercentage: number | null;

  /**
   * Reference to the configured extraction requirement.
   */
  configurationReference: string;

  /**
   * Reference to the actual information returned by the AI.
   */
  actualResultReference: string;

  /** Explanation of missing or unexpected information, if applicable. */
  assessmentNotes: string | null;
}