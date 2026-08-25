/**
 * CareVRTestAuditAgent
 *
 * Audit Model Usage Contract
 *
 * Purpose:
 * Defines the evidence used to determine which AI model was
 * configured, which model actually processed each request,
 * and whether the observed model usage matched configuration.
 *
 * Scope:
 * Supports request-level, document-level, module-level and
 * overall model usage reporting.
 *
 * Important:
 * Model selection is observed, not controlled, by the Audit Agent.
 * The Audit Agent does not change, replace or reroute a model.
 *
 * Token consumption is recorded separately in AuditToken.
 * Accuracy is recorded separately in AuditAccuracy.
 */

export type ModelComplianceStatus =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "NOT_ASSESSED";

export interface AuditModel {
  /** Unique identifier for this model-usage record. */
  modelRecordId: string;

  /** Parent Audit Run identifier. */
  runId: string;

  /** AI request associated with this model usage. */
  requestId: string;

  /** Parent document identifier. */
  documentId: string;

  /** Parent page identifier, where applicable. */
  pageId: string | null;

  /** CareVR module responsible for the processing. */
  module: string;

  /** Model that the CareVR configuration expected to use. */
  expectedModel: string;

  /** Model actually observed processing the request. */
  actualModel: string;

  /** Model provider associated with the observed model. */
  provider: string;

  /** Version or deployment identifier, where available. */
  modelVersion: string | null;

  /** Whether actual model usage matched configuration. */
  complianceStatus: ModelComplianceStatus;
}