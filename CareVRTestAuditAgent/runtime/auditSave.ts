/**
 * CareVRTestAuditAgent
 *
 * Audit database persistence boundary.
 *
 * This module persists completed/partial audit evidence to the
 * Founder Audit database tables.
 *
 * IMPORTANT:
 *
 * This module:
 * - does not observe Strataparse
 * - does not calculate usage
 * - does not calculate cost
 * - does not evaluate results
 * - does not modify production processing
 *
 * It receives an already aggregated audit snapshot and persists
 * that evidence to:
 *
 *   founder_audit_summary
 *   founder_audit_details
 *
 * The existing public.audit_logs table remains the general
 * application/system action log and is intentionally separate.
 */

import {
    supabaseAdmin,
} from "../../lib/supabaseAdmin";

import type {
    AuditAggregation,
} from "./auditAggregator";

import type {
    StrataparseAuditEvent,
} from "./auditObserver";

import {
    buildAuditModelEvidence,
} from "./auditModelEvidence";

export interface AuditSaveInput {

    aggregation:
        AuditAggregation;

    productId:
        string;

    ruleId:
        string;

    ruleSnapshot?:
        string;

    auditStatusReason?:
        string;

    auditCompletedBy?:
        string;
}


export interface AuditSaveResult {

    runId:
        string;

    summarySaved:
        boolean;

    detailsSaved:
        number;
}


/**
 * Saves one audit aggregation to the Founder Audit database.
 *
 * The summary is written first because founder_audit_details
 * references founder_audit_summary through run_id.
 *
 * Detailed audit evidence is then written independently as
 * individual evidence records.
 */
export async function saveAudit(
    input:
        AuditSaveInput
):
    Promise<AuditSaveResult> {

    validateSaveInput(
        input
    );

    const aggregation =
        input.aggregation;

    const run =
        aggregation.run;

    /*
     * Persist the founder-facing run summary.
     *
     * The aggregation is the source of truth for the numerical
     * audit summary. Values are not recalculated here.
     */
    const summaryPayload = {

        run_id:
            run.runId,

        product_id:
            input.productId,

        rule_id:
            input.ruleId,

        run_date:
            getRunDate(
                run.startedAt
            ),

        run_started_at:
            run.startedAt,

        run_ended_at:
            run.endedAt ?? null,

        audit_status:
            run.status,

        audit_status_reason:
            input.auditStatusReason ??
            null,

        audit_completed_by:
            input.auditCompletedBy ??
            null,

        audit_completed_at:
            run.status ===
            "COMPLETED"
                ? (
                    run.endedAt ??
                    null
                )
                : null,

        document_count:
            aggregation
                .documentSummary
                .totalDocuments,

        completed_documents:
            aggregation
                .documentSummary
                .completedDocuments,

        failed_documents:
            aggregation
                .documentSummary
                .failedDocuments,

        total_pages:
            aggregation
                .documentSummary
                .totalPages,

        request_count:
            aggregation
                .usage
                .requestCount,

        completed_requests:
            aggregation
                .usage
                .completedRequests,

        failed_requests:
            aggregation
                .usage
                .failedRequests,

        input_tokens:
            aggregation
                .usage
                .inputTokens,

        output_tokens:
            aggregation
                .usage
                .outputTokens,

        total_tokens:
            aggregation
                .usage
                .totalTokens,

        total_cost:
            aggregation
                .cost
                .totalCost,

        currency:
            aggregation
                .cost
                .currency,

        rule_snapshot:
            input.ruleSnapshot ??
            null,

metadata: {

    ...run.metadata,

    documentTypes:
        {
            ...aggregation
                .documentSummary
                .documentTypes,
        },

    timing:
        {
            ...aggregation
                .timing,
        },

    modelSummary:
        aggregation
            .modelSummary
            .map(
                model => ({
                    ...model,
                })
            ),

    /*
     * Preserve the observed document -> difficulty ->
     * model evidence for Founder-level independent review.
     *
     * This does not calculate expected routing.
     */
    modelEvidence:
        buildAuditModelEvidence(
            aggregation
        ),

    /*
     * Preserve the explicitly evaluated expected-vs-actual
     * accuracy evidence for Founder-level review.
     *
     * Accuracy has already been calculated by the Audit Agent.
     * The persistence boundary only stores that evidence.
     */
    accuracy:
        {
            evaluatedItems:
                aggregation.accuracy.evaluatedItems,

            correctItems:
                aggregation.accuracy.correctItems,

            missedItems:
                aggregation.accuracy.missedItems,

            incorrectItems:
                aggregation.accuracy.incorrectItems,

            accuracyPercentage:
                aggregation.accuracy.accuracyPercentage,

            misses:
                aggregation.accuracy.misses,
        },
    },

};

    const {
        error:
            summaryError,
    } =
        await supabaseAdmin
            .from(
                "founder_audit_summary"
            )
            .upsert(
                summaryPayload,
                {
                    onConflict:
                        "run_id",
                }
            );

    if (
        summaryError
    ) {

        throw new Error(
            `Failed to save audit summary: ${summaryError.message}`
        );
    }

    /*
     * Persist detailed request evidence.
     *
     * Request evidence is kept separately from the summary so
     * later reporting can analyse:
     *
     *   Run -> Model -> Module -> Request
     *
     * without changing the summary structure.
     */
    const requestDetails =
        aggregation.requests.map(
            request =>
                createRequestDetail(
                    run.runId,
                    request
                )
        );

    /*
     * Persist the actual document inventory observed during
     * the audit run.
     *
     * This is evidence only. The Audit Agent does not classify
     * or modify the document; it records the classification
     * already observed from Strataparse.
     */
const documentDetails =
    aggregation.documentCoverage.map(
        document => ({
            run_id:
                run.runId,

            event_type:
                "DOCUMENT_INVENTORY",

            event_timestamp:
                run.startedAt,

            model:
                null,

            module:
                run.module,

            request_id:
                null,

            document_number:
                document.documentNumber,

            page_number:
                null,

            status:
                null,

            duration_ms:
                null,

            input_tokens:
                null,

            output_tokens:
                null,

            total_tokens:
                null,

            cost:
                null,

            currency:
                aggregation.cost.currency,

            evidence: {
                document: {
                    documentNumber:
                        document.documentNumber,

                    documentType:
                        document.documentType,

                    fileType:
                        document.fileType,

                    readability:
                        document.readability,

                    pageCount:
                        document.pageCount,
                },
            },
        })
    );


    /*
     * Persist observed page execution evidence.
     *
     * This records the actual PAGE_STARTED / PAGE_COMPLETED
     * state observed by the passive Audit Agent.
     *
     * It does not infer execution, retry processing, or alter
     * the production flow.
     */
    const pageExecutionDetails =
        aggregation.pageExecution.map(
            page => ({

                run_id:
                    run.runId,

                event_type:
                    "PAGE_EXECUTION",

                event_timestamp:
                    run.startedAt,

                model:
                    null,

                module:
                    run.module,

                request_id:
                    null,

                document_number:
                    page.documentNumber,

                page_number:
                    page.pageNumber,

                status:
                    page.completed
                        ? "COMPLETED"
                        : page.started
                            ? "STARTED"
                            : null,

                duration_ms:
                    null,

                input_tokens:
                    null,

                output_tokens:
                    null,

                total_tokens:
                    null,

                cost:
                    null,

                currency:
                    aggregation.cost.currency,

                evidence: {

                    pageExecution: {

                        documentNumber:
                            page.documentNumber,

                        pageNumber:
                            page.pageNumber,

                        started:
                            page.started,

                        completed:
                            page.completed,
                    },
                },
            })
        );


    /*
     * Persist observed Strataparse events when they are available
     * in the audit snapshot metadata.
     *
     * This is intentionally optional because the aggregator's
     * current contract does not directly contain observer events.
     */
    const eventDetails =
        getEventDetailsFromMetadata(
            run.runId,
            run.metadata
        );

const details = [
    ...requestDetails,
    ...documentDetails,
    ...pageExecutionDetails,
    ...eventDetails,
];

    if (
        details.length ===
        0
    ) {

        return {

            runId:
                run.runId,

            summarySaved:
                true,

            detailsSaved:
                0,
        };
    }

    const {
        error:
            detailsError,
    } =
        await supabaseAdmin
            .from(
                "founder_audit_details"
            )
            .insert(
                details
            );

    if (
        detailsError
    ) {

        throw new Error(
            `Failed to save audit details: ${detailsError.message}`
        );
    }

    return {

        runId:
            run.runId,

        summarySaved:
            true,

        detailsSaved:
            details.length,
    };
}


/**
 * Converts one request observation into the flexible
 * founder_audit_details evidence format.
 */
/**
 * Converts one observed request into the flexible
 * founder_audit_details evidence format.
 *
 * Model tier and actual model name are preserved as
 * observed evidence. They are never recalculated here.
 *
 * This is the persistence boundary for Founder visibility
 * of model selection and actual model usage.
 */
function createRequestDetail(
    runId:
        string,
    request:
        AuditAggregation["requests"][number]
) {

    return {

        run_id:
            runId,

        event_type:
            "REQUEST",

        event_timestamp:
            request.startedAt ??
            null,

        /*
         * Preserve the actual model name already observed
         * by the Audit Agent.
         */
        model:
            request.modelName ??
            null,

        request_id:
            request.requestId ??
            null,

        document_number:
            request.documentNumber ??
            null,

        page_number:
            request.pageNumber ??
            null,

        status:
            request.status,

        duration_ms:
            request.durationMs ??
            null,

        input_tokens:
            request.inputTokens ??
            null,

        output_tokens:
            request.outputTokens ??
            null,

        total_tokens:
            request.totalTokens ??
            null,

        cost:
            null,

        currency:
            null,

        evidence: {

            request: {
                ...request,
            },

            /*
             * These fields are observational evidence only.
             *
             * modelTier represents the routing decision observed
             * by the Audit Agent.
             *
             * modelName represents the actual model that was
             * observed being used.
             */
            modelSelection: {

                modelTier:
                    request.modelTier ??
                    null,

                actualModel:
                    request.modelName ??
                    null,

        provider:
            request.provider ??
            null,
            },
        },
    };
}


/**
 * Allows observer events to be persisted when they have already
 * been attached to the run metadata by the calling layer.
 *
 * The persistence layer does not reach into the observer itself.
 * This preserves the observer -> aggregator -> persistence
 * separation.
 */
function getEventDetailsFromMetadata(
    runId:
        string,
    metadata:
        Record<string, unknown>
) {

    const rawEvents =
        metadata[
            "auditEvents"
        ];

    if (
        !Array.isArray(
            rawEvents
        )
    ) {
        return [];
    }

    return rawEvents
        .filter(
            (
                event
            ): event is StrataparseAuditEvent =>
                isAuditEvent(
                    event
                )
        )
        .map(
            event =>
                createEventDetail(
                    runId,
                    event
                )
        );
}


/**
 * Converts one observed Strataparse event into a database
 * detail record.
 */
function createEventDetail(
    runId:
        string,
    event:
        StrataparseAuditEvent
) {

    return {

        run_id:
            runId,

        event_type:
            event.type,

        event_timestamp:
            new Date(
                event.timestamp
            ).toISOString(),

model:
    "model" in event
        ? event.model
        : null,

        module:
            null,

        request_id:
            null,

        document_number:
            "documentNumber" in event
                ? event.documentNumber
                : null,

        page_number:
            "pageNumber" in event
                ? event.pageNumber
                : null,

        status:
            getEventStatus(
                event
            ),

        duration_ms:
            "durationMs" in event
                ? (
                    event.durationMs ??
                    null
                )
                : null,

        input_tokens:
            "inputTokens" in event
                ? (
                    event.inputTokens ??
                    null
                )
                : null,

        output_tokens:
            "outputTokens" in event
                ? (
                    event.outputTokens ??
                    null
                )
                : null,

        total_tokens:
            "totalTokens" in event
                ? (
                    event.totalTokens ??
                    null
                )
                : null,

        cost:
            null,

        currency:
            null,

        evidence: {
            event: {
                ...event,
            },
        },
    };
}


/**
 * Basic runtime validation before anything is written.
 */
function validateSaveInput(
    input:
        AuditSaveInput
):
    void {

    if (
        !input.productId.trim()
    ) {

        throw new Error(
            "productId is required."
        );
    }

    if (
        !input.ruleId.trim()
    ) {

        throw new Error(
            "ruleId is required."
        );
    }

    if (
        !input.aggregation.run.runId.trim()
    ) {

        throw new Error(
            "runId is required."
        );
    }
}


/**
 * Returns the calendar date associated with the audit run.
 */
function getRunDate(
    startedAt:
        string
):
    string {

    const timestamp =
        Date.parse(
            startedAt
        );

    if (
        !Number.isFinite(
            timestamp
        )
    ) {

        throw new Error(
            "Audit run startedAt is invalid."
        );
    }

    return new Date(
        timestamp
    )
        .toISOString()
        .slice(
            0,
            10
        );
}


/**
 * Extracts a useful status from an observed event.
 */
function getEventStatus(
    event:
        StrataparseAuditEvent
):
    string |
    null {

    if (
        event.type ===
        "PROCESSING_FAILED"
    ) {

        return "FAILED";
    }

    if (
        event.type ===
        "PAGE_COMPLETED" ||
        event.type ===
        "DOCUMENT_COMPLETED" ||
        event.type ===
        "RUN_COMPLETED" ||
        event.type ===
        "RESULT_RENDERED"
    ) {

        return "COMPLETED";
    }

    if (
        event.type ===
        "RUN_STARTED" ||
        event.type ===
        "DOCUMENT_STARTED" ||
        event.type ===
        "PAGE_STARTED"
    ) {

        return "STARTED";
    }

    return null;
}


/**
 * Performs a lightweight structural check before treating
 * arbitrary metadata as an observed audit event.
 */
function isAuditEvent(
    value:
        unknown
):
    value is StrataparseAuditEvent {

    if (
        typeof value !==
        "object" ||
        value === null
    ) {

        return false;
    }

    const event =
        value as {
            type?:
                unknown;

            runId?:
                unknown;

            timestamp?:
                unknown;
        };

    return (
        typeof event.type ===
        "string" &&
        typeof event.runId ===
        "string" &&
        typeof event.timestamp ===
        "number"
    );
}