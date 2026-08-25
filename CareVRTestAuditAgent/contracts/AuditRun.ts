/**
 * CareVRTestAuditAgent
 *
 * Audit Run Contract
 *
 * Purpose:
 * Defines the lifecycle-level record for one complete Audit Agent run.
 *
 * Scope:
 * This contract records the execution boundary only.
 * Document, page, request, token, accuracy and other detailed
 * audit evidence will be defined in separate contracts.
 *
 * Important:
 * This contract does not control CareVR or Strataparse.
 * It only records what happened during the audit run.
 */

export type AuditRunStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "INTERRUPTED"
  | "FAILED";

export type AuditTerminationReason =
  | "NORMAL_COMPLETION"
  | "USER_LOGGED_OUT"
  | "BROWSER_CLOSED"
  | "SESSION_INTERRUPTED"
  | "SYSTEM_ERROR"
  | "UNKNOWN";

export interface AuditRun {
  /** Unique identifier for this audit run. */
  runId: string;

  /** CareVR module(s) involved in this audit run. */
  modules: string[];

  /** When the audit run started. */
  startedAt: string;

  /** When the audit run finished, if it has finished. */
  completedAt: string | null;

  /** Total elapsed audit-run duration in milliseconds. */
  totalDurationMs: number | null;

  /** Current lifecycle state of the audit run. */
  status: AuditRunStatus;

  /** Number of documents received by CareVR for this run. */
  documentsUploaded: number;

  /** Number of documents that reached completed processing/display state. */
  documentsCompleted: number;

  /** Number of AI requests observed by the Audit Agent. */
  requestsSent: number;

  /** Number of observed AI requests that reached a terminal response state. */
  requestsCompleted: number;

  /** Whether CareVR displayed the completed results to the user. */
  finalUiDisplayed: boolean;

  /** When the final completed UI state was observed. */
  finalUiDisplayedAt: string | null;

  /** Whether the Audit Agent itself completed its observation lifecycle. */
  auditAgentCompleted: boolean;

  /** Reason the audit run reached its terminal state. */
  terminationReason: AuditTerminationReason | null;
}