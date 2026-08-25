/**
 * CareVRTestAuditAgent
 *
 * Audit Request Contract
 *
 * Purpose:
 * Defines the audit record for every AI request observed during
 * an Audit Run.
 *
 * Scope:
 * Captures request identity, model usage, prompt/configuration
 * reference, lifecycle timing and completion state.
 *
 * Token usage is recorded separately in the token contract.
 * Accuracy and scope evaluation are recorded separately.
 *
 * Important:
 * This contract observes the request.
 * It does not create, modify, retry, stop or control the request.
 */

export type AuditRequestStatus =
  | "SENT"
  | "RECEIVED"
  | "FAILED"
  | "TIMEOUT"
  | "INTERRUPTED";

export interface AuditRequest {
  /** Unique identifier for this AI request. */
  requestId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** Parent document identifier. */
  documentId: string;

  /** Parent page identifier, where applicable. */
  pageId: string | null;

  /** CareVR module that initiated the processing. */
  module: string;

  /** Model that the configuration expected to be used. */
  expectedModel: string;

  /** Model actually observed for this request. */
  actualModel: string;

  /** Identifier/version of the prompt or extraction configuration used. */
  promptConfigId: string;

  /** When the request was sent. */
  requestStartedAt: string;

  /** When the response was received. */
  responseReceivedAt: string | null;

  /** Request-to-response duration in milliseconds. */
  durationMs: number | null;

  /** Current lifecycle state of the request. */
  status: AuditRequestStatus;

  /** Whether a response was successfully received. */
  responseReceived: boolean;

  /** Whether the resulting information was observed in the CareVR UI. */
  resultDisplayed: boolean;

  /** When the resulting information was observed in the UI. */
  resultDisplayedAt: string | null;
}