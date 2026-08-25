/**
 * CareVRTestAuditAgent
 *
 * Audit Page Contract
 *
 * Purpose:
 * Defines the audit record for an individual page belonging
 * to an uploaded document.
 *
 * Scope:
 * Used primarily to audit multi-page document processing.
 * A single-page document will have one page record.
 *
 * Important:
 * A page is NOT an independent uploaded document.
 * It remains associated with its parent AuditDocument.
 */

export type AuditPageStatus =
  | "RECEIVED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "INTERRUPTED";

export interface AuditPage {
  /** Unique identifier for this page within the audit run. */
  pageId: string;

  /** Parent document identifier. */
  documentId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** One-based page number within the source document. */
  pageNumber: number;

  /** Current page processing state. */
  status: AuditPageStatus;

  /** When the page became available for processing. */
  startedAt: string | null;

  /** When processing of the page completed. */
  completedAt: string | null;

  /** Total elapsed processing time for this page in milliseconds. */
  durationMs: number | null;

  /** Number of AI requests observed for this page. */
  requestCount: number;

  /** Whether the page's extracted result was successfully appended
   * to the document's cumulative result. */
  appendedToDocumentResult: boolean;
}