/**
 * CareVRTestAuditAgent
 *
 * Audit Accuracy Contract
 *
 * Purpose:
 * Defines the evidence and assessment associated with the accuracy
 * of information returned by an AI-enabled CareVR processing flow.
 *
 * Scope:
 * Captures what was expected, what was returned, what was displayed,
 * and the resulting accuracy assessment.
 *
 * Important:
 * The Audit Agent does not modify the AI result.
 * It observes and records the result for testing and analysis.
 *
 * Accuracy is measured against the configured test expectation.
 * The Audit Agent must not silently substitute its own interpretation
 * of what the expected result should have been.
 */

export type AccuracyStatus =
  | "ACCURATE"
  | "PARTIALLY_ACCURATE"
  | "INACCURATE"
  | "NOT_ASSESSED";

export interface AuditAccuracy {
  /** Unique identifier for this accuracy assessment. */
  accuracyId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** Document being evaluated. */
  documentId: string;

  /** Page being evaluated, where applicable. */
  pageId: string | null;

  /** AI request associated with the evaluated result, where applicable. */
  requestId: string | null;

  /** CareVR module being evaluated. */
  module: string;

  /**
   * Identifier/version of the test configuration that defines
   * what information was expected from the processing.
   */
  expectedConfigurationId: string;

  /**
   * Reference to the expected result used for the accuracy assessment.
   * This may point to a controlled test expectation rather than
   * duplicating the complete expected payload in the audit record.
   */
  expectedResultReference: string;

  /**
   * Reference to the actual result returned by the AI-enabled
   * processing flow.
   */
  actualResultReference: string;

  /**
   * Reference to the result observed on the CareVR UI.
   */
  displayedResultReference: string | null;

  /** Final accuracy classification for this assessment. */
  status: AccuracyStatus;

  /**
   * Accuracy percentage for this assessment where a quantitative
   * scoring method has been configured.
   */
  accuracyPercentage: number | null;

  /**
   * Human-readable explanation of the observed difference,
   * if any.
   */
  assessmentNotes: string | null;

  /**
   * Indicates whether the result was successfully displayed
   * to the user before the accuracy assessment was completed.
   */
  resultDisplayed: boolean;
}