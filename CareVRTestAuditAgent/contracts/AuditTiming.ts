/**
 * CareVRTestAuditAgent
 *
 * Audit Timing Contract
 *
 * Purpose:
 * Defines timing evidence for the complete CareVR AI processing
 * lifecycle.
 *
 * Scope:
 * Captures timing at request, page, document, module and complete
 * audit-run levels, including the user-visible UI completion point.
 *
 * Important:
 * Timing is measured from observed system events.
 * The Audit Agent does not introduce artificial delays or control
 * the processing flow.
 *
 * All duration values are stored in milliseconds.
 */

export interface AuditTiming {
  /** Unique identifier for this timing record. */
  timingId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** Module associated with the timing record. */
  module: string;

  /** Document identifier, where applicable. */
  documentId: string | null;

  /** Page identifier, where applicable. */
  pageId: string | null;

  /** Request identifier, where applicable. */
  requestId: string | null;

  /**
   * Time when the relevant processing activity began.
   *
   * For a run this represents the beginning of the test.
   * For a document this represents document processing start.
   * For a page this represents page processing start.
   * For a request this represents request transmission.
   */
  startedAt: string;

  /**
   * Time when the relevant processing activity completed.
   */
  completedAt: string | null;

  /** Total elapsed time for this specific activity. */
  durationMs: number | null;

  /**
   * Time when the first successfully processed result was
   * observed on the CareVR UI.
   *
   * Normally populated at Audit Run level.
   */
  firstUiResultAt: string | null;

  /**
   * Time when the final completed result was observed on
   * the CareVR UI.
   *
   * Normally populated at Audit Run level.
   */
  finalUiDisplayedAt: string | null;

  /**
   * Upload-to-first-result duration.
   *
   * Normally populated at Audit Run level.
   */
  uploadToFirstResultMs: number | null;

  /**
   * Upload-to-final-UI duration.
   *
   * Normally populated at Audit Run level.
   */
  uploadToFinalUiMs: number | null;
}