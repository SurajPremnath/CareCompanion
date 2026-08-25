/**
 * CareVRTestAuditAgent
 *
 * Audit Completeness Contract
 *
 * Purpose:
 * Defines the evidence used to determine whether every item
 * submitted during an Audit Run completed the expected processing
 * lifecycle and reached the CareVR UI.
 *
 * Scope:
 * Tracks documents, pages and AI requests from receipt through
 * terminal processing and final UI display.
 *
 * Important:
 * Completeness does not mean accuracy.
 * It only establishes whether the expected processing lifecycle
 * was completed.
 *
 * The Audit Agent observes completion state.
 * It does not retry, block or control processing.
 */

export type CompletenessStatus =
  | "COMPLETE"
  | "PARTIALLY_COMPLETE"
  | "INCOMPLETE"
  | "INTERRUPTED"
  | "NOT_ASSESSED";

export interface AuditCompleteness {
  /** Unique identifier for this completeness assessment. */
  completenessId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** CareVR module being assessed. */
  module: string;

  /** Number of documents uploaded for the audit run. */
  documentsUploaded: number;

  /** Number of documents received by the processing workflow. */
  documentsReceived: number;

  /** Number of documents that entered processing. */
  documentsProcessed: number;

  /** Number of documents that reached a completed processing state. */
  documentsCompleted: number;

  /** Number of documents whose completed result was displayed in the UI. */
  documentsDisplayed: number;

  /** Number of documents that failed processing. */
  documentsFailed: number;

  /** Number of documents interrupted before completion. */
  documentsInterrupted: number;

  /** Number of pages expected across all uploaded documents. */
  pagesExpected: number;

  /** Number of pages that completed processing. */
  pagesCompleted: number;

  /** Number of AI requests observed for the run. */
  requestsSent: number;

  /** Number of AI requests that reached a terminal response state. */
  requestsCompleted: number;

  /** Number of requests that remained active when processing ended. */
  requestsStillActive: number;

  /** Number of requests that failed or timed out. */
  requestsFailed: number;

  /** Whether all expected processing completed successfully. */
  status: CompletenessStatus;

  /** Percentage of expected processing completed. */
  completionPercentage: number | null;

  /** Whether CareVR displayed the final completed UI state. */
  finalUiDisplayed: boolean;

  /** When the final completed UI state was observed. */
  finalUiDisplayedAt: string | null;

  /** Explanation of any missing, failed or interrupted processing. */
  assessmentNotes: string | null;
}