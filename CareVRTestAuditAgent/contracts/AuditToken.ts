/**
 * CareVRTestAuditAgent
 *
 * Audit Token Contract
 *
 * Purpose:
 * Defines token consumption observed for an individual AI request.
 *
 * Scope:
 * Captures input, output and total token usage together with the
 * model responsible for the consumption.
 *
 * This record is the source for:
 * - Request-level token reporting
 * - Model-level token reporting
 * - Module-level token reporting
 * - Document-level token reporting
 * - Overall token summary
 * - Token efficiency analysis
 *
 * Important:
 * Token values are observed from the AI response/usage metadata.
 * The Audit Agent does not estimate or modify token usage.
 */

export interface AuditToken {
  /** Unique identifier for this token record. */
  tokenRecordId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** AI request associated with this token usage. */
  requestId: string;

  /** Parent document identifier. */
  documentId: string;

  /** Parent page identifier, where applicable. */
  pageId: string | null;

  /** CareVR module responsible for the processing. */
  module: string;

  /** Model that consumed these tokens. */
  model: string;

  /** Tokens consumed by the input/request. */
  inputTokens: number;

  /** Tokens generated in the AI response. */
  outputTokens: number;

  /** Total tokens consumed by this request. */
  totalTokens: number;
}