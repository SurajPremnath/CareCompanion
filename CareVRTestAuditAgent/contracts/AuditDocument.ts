/**
 * CareVRTestAuditAgent
 *
 * Audit Document Contract
 *
 * Purpose:
 * Defines the audit record for each document submitted during
 * an Audit Run.
 *
 * Scope:
 * Records document-level execution, timing, processing status
 * and UI completion evidence.
 *
 * Page-level, request-level, token-level, accuracy and scope
 * evidence are maintained separately.
 */

export type AuditDocumentType =
  | "SINGLE_PAGE"
  | "MULTI_PAGE"
  | "IMAGE";

export type AuditDocumentStatus =
  | "RECEIVED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "INTERRUPTED";

export interface AuditDocument {
  /** Unique identifier for this document within the audit run. */
  documentId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** CareVR module that submitted the document. */
  module: string;

  /** Original document/file name where available. */
  fileName: string;

  /** Classified document type. */
  documentType: AuditDocumentType;

  /** Number of pages identified for the document. */
  pageCount: number;

  /** Current document processing state. */
  status: AuditDocumentStatus;

  /** When the document was received by the Audit Agent. */
  receivedAt: string;

  /** When processing of the document started. */
  processingStartedAt: string | null;

  /** When document processing completed. */
  completedAt: string | null;

  /** Total document processing duration in milliseconds. */
  totalDurationMs: number | null;

  /** Whether the completed result was observed on the CareVR UI. */
  uiDisplayed: boolean;

  /** When the completed result was observed on the CareVR UI. */
  uiDisplayedAt: string | null;
}