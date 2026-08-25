/**
 * CareVRTestAuditAgent
 *
 * Audit Cost Contract
 *
 * Purpose:
 * Defines the cost evidence associated with actual AI usage.
 *
 * Scope:
 * Records model-specific pricing references and the calculated
 * cost associated with actual observed token consumption.
 *
 * Important:
 * Token usage itself is recorded in AuditToken.
 * This contract connects actual usage to the pricing configuration
 * applicable to the observed model.
 *
 * Cost is an analytical measurement.
 * It does not make or imply a commercial decision.
 */

export type CostStatus =
  | "CALCULATED"
  | "PRICING_UNAVAILABLE"
  | "NOT_ASSESSED";

export interface AuditCost {
  /** Unique identifier for this cost record. */
  costRecordId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** AI request associated with this cost record. */
  requestId: string;

  /** Parent document identifier. */
  documentId: string;

  /** Parent page identifier, where applicable. */
  pageId: string | null;

  /** CareVR module responsible for the processing. */
  module: string;

  /** Model responsible for the actual token consumption. */
  model: string;

  /** Currency used for the calculated cost. */
  currency: string;

  /** Pricing configuration identifier/version used for calculation. */
  pricingConfigId: string;

  /** Input token count used for this cost calculation. */
  inputTokens: number;

  /** Output token count used for this cost calculation. */
  outputTokens: number;

  /** Total token count used for this cost calculation. */
  totalTokens: number;

  /** Cost attributable to input tokens. */
  inputCost: number;

  /** Cost attributable to output tokens. */
  outputCost: number;

  /** Total calculated cost for this request. */
  totalCost: number;

  /** Whether the cost was successfully calculated from pricing data. */
  status: CostStatus;
}