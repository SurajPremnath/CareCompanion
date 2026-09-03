/**
 * CareVRTestAuditAgent
 *
 * Audit runtime coordinator.
 *
 * Coordinates the independent audit lifecycle.
 *
 * IMPORTANT:
 *
 * The coordinator does not control production processing.
 * It does not invoke models.
 * It does not modify prompts.
 * It does not alter extraction results.
 *
 * It only coordinates evidence observed or explicitly
 * supplied to the audit system.
 */

import {
    createAuditRun,
    completeAuditRun,
    failAuditRun,
    interruptAuditRun,
    type AuditRunState,
} from "./auditRun";

import {
    saveAuditRun,
} from "./auditStore";

import {
    createAuditResultEvidence,
    markAuditResultRendered,
    type AuditResultEvidence,
} from "./auditResult";

import {
    createAuditUsage,
    type AuditUsage,
} from "./auditUsage";

import {
    createAuditCost,
    calculateAuditRequestCost,
    mergeAuditCost,
    type AuditCost,
    type AuditModelPricing,
} from "./auditCost";

import {
    aggregateAuditRun,
    type AuditAggregation,
} from "./auditAggregator";

import {
    analyzeAuditRun,
    type AuditAnalysis,
} from "./auditAnalysis";

import {
    createAuditReport,
    type AuditReport,
} from "./auditReport";

import {
    saveAuditReport,
} from "./auditReportStorage";

import {
    getStrataparseAuditEvents,
} from "./auditObserver";

import type {
    AuditRequest,
} from "./auditRequest";

import type {
    AuditEvaluation,
} from "./auditEvaluation";


export interface AuditCoordinator {

    run:
        AuditRunState;

    productId:
        string;

    ruleId:
        string;

    pricing:
        AuditModelPricing;

    result:
        AuditResultEvidence;

    usage:
        AuditUsage;

    cost:
        AuditCost;

    requests:
        AuditRequest[];

    evaluations:
        AuditEvaluation[];

    totalPages:
        number;

    /**
     * Actual document inventory supplied by CareVR when
     * the user starts the audit run.
     *
     * This is input evidence only.
     *
     * The Audit Agent records the documents that were
     * actually submitted. It does not modify, inspect,
     * control, or alter Strataparse processing.
     */
    documentInventory:
        Array<{
            documentNumber:
                number;

            fileName:
                string;

            fileType:
                string;
        }>;

    /**
     * Preserves document-level page evidence observed by the
     * passive Audit Agent.
     *
     * This evidence is observational only. It is used to
     * produce Founder-level Test Coverage and does not
     * control or modify CareVR or Strataparse.
     */
documentCoverage:
    Array<{
        documentNumber:
            number;

        documentType:
            string;

        fileType:
            string;

        readability:
            string;

        pageCount:
            number;
    }>;

pageExecution:
    Array<{
        documentNumber:
            number;

        pageNumber:
            number;

        started:
            boolean;

        completed:
            boolean;
    }>;

observedEventKeys:
    string[];

    aggregation?:
        AuditAggregation;

    analysis?:
        AuditAnalysis;

    report?:
        AuditReport;
}


/**
 * Starts an independent audit run.
 *
 * No production processing is started here.
 * The function only creates the audit state required
 * to observe a run.
 */
export async function startAuditCoordinator(
    input: {
        runId:
            string;

        module:
            string;

                documentCount:
            number;

        productId:
            string;

        ruleId:
            string;

        pricing:
            AuditModelPricing;

        /**
         * Actual documents submitted by CareVR at the
         * beginning of the audit run.
         */
        documentInventory:
            Array<{
                documentNumber:
                    number;

                fileName:
                    string;

                fileType:
                    string;
            }>;
    }
):
    Promise<AuditCoordinator> {

    const run =
        createAuditRun(
            input
        );


    const coordinator:
        AuditCoordinator = {

        run,

        productId:
            input.productId,

        ruleId:
            input.ruleId,

        pricing:
            input.pricing,


        result:
            createAuditResultEvidence(
                input.runId
            ),

        usage:
            createAuditUsage(),

        cost:
            createAuditCost(
                input.pricing.currency ??
                "USD"
            ),

        requests:
            [],

        evaluations:
            [],

        totalPages:
            0,

        documentInventory:
            input.documentInventory.map(
                document => ({
                    ...document,
                })
            ),

documentCoverage:
    [],

pageExecution:
    [],

observedEventKeys:
    [],

    };

    saveAuditRun(
        run
    );

    return coordinator;
}


/**
 * Synchronises the coordinator with observations collected
 * by the passive audit observer.
 *
 * This function reads audit events only.
 * It does not control or modify the production flow.
 *
 * Synchronisation is incremental and idempotent:
 * an observer event that has already been incorporated into
 * this coordinator is ignored on subsequent synchronisations.
 */
export function syncAuditCoordinatorObservations(
    coordinator:
        AuditCoordinator
):
    AuditCoordinator {

    const events =
        getStrataparseAuditEvents(
            coordinator.run.runId
        );

    let cost =
    {
        ...coordinator.cost,
    };

    let usage =
        {
            ...coordinator.usage,
        };

    const requests =
        [
            ...coordinator.requests,
        ];

    let totalPages =
        coordinator.totalPages;

    const documentCoverage =
        [
            ...coordinator.documentCoverage,
        ];

const pageExecution =
    coordinator.pageExecution.map(
        page => ({
            ...page,
        })
    );

    const observedEventKeys =
        new Set(
            coordinator.observedEventKeys
        );

    for (
        const event
        of events
    ) {

        const eventKey =
            createAuditObservationKey(
                event
            );

        /*
         * The passive observer may return the complete event
         * history for a run. Do not process an event that has
         * already been incorporated into this coordinator.
         */
        if (
            observedEventKeys.has(
                eventKey
            )
        ) {

            continue;
        }

        observedEventKeys.add(
            eventKey
        );

if (
    event.type ===
    "DOCUMENT_STARTED"
) {

    totalPages +=
        event.pageCount;

    /*
     * Preserve the actual document-level evidence observed
     * by the passive Audit Agent.
     *
     * The Audit Agent records the document metadata already
     * available at the Strataparse observation boundary.
     *
     * This does not classify, modify, or control the document.
     */
    documentCoverage.push({
        documentNumber:
            event.documentNumber,

        documentType:
            event.documentType,

        fileType:
            event.fileType,

        readability:
            event.readability,

        pageCount:
            event.pageCount,
    });
}

if (
    event.type ===
    "PAGE_STARTED"
) {

    /*
     * Preserve the actual PAGE_STARTED observation.
     *
     * This records only what the passive Audit Agent
     * observed. It does not start, stop, retry, route,
     * or otherwise control Strataparse execution.
     */
    const existingPage =
        pageExecution.find(
            page =>
                page.documentNumber ===
                    event.documentNumber &&
                page.pageNumber ===
                    event.pageNumber
        );

    if (
        existingPage
    ) {

        existingPage.started =
            true;

    } else {

        pageExecution.push({

            documentNumber:
                event.documentNumber,

            pageNumber:
                event.pageNumber,

            started:
                true,

            completed:
                false,
        });
    }
}

if (
    event.type ===
    "PAGE_COMPLETED"
) {

            /*
             * Preserve the actual PAGE_COMPLETED observation.
             *
             * Completion is recorded independently from request
             * accounting because page execution state is a separate
             * Founder-level coverage signal.
             *
             * If PAGE_STARTED was observed earlier, preserve that
             * start evidence. If it was not observed, do not invent it.
             */
            const existingPage =
                pageExecution.find(
                    page =>
                        page.documentNumber ===
                            event.documentNumber &&
                        page.pageNumber ===
                            event.pageNumber
                );

            if (
                existingPage
            ) {

                existingPage.completed =
                    true;

            } else {

                pageExecution.push({

                    documentNumber:
                        event.documentNumber,

                    pageNumber:
                        event.pageNumber,

                    started:
                        false,

                    completed:
                        true,
                });
            }

            usage =
                {
                    ...usage,

                    requestCount:
                        usage.requestCount +
                        1,

                    completedRequests:
                        usage.completedRequests +
                        1,

                    inputTokens:
                        usage.inputTokens +
                        (
                            event.inputTokens ??
                            0
                        ),

                    outputTokens:
                        usage.outputTokens +
                        (
                            event.outputTokens ??
                            0
                        ),

                    totalTokens:
                        usage.totalTokens +
                        (
                            event.totalTokens ??
                            (
                                (event.inputTokens ?? 0) +
                                (event.outputTokens ?? 0)
                            )
                        ),
                };

            /*
             * Calculate cost only when the observed
             * PAGE_COMPLETED event contains token usage.
             *
             * No token usage means no invented cost.
             */
            if (
                typeof event.inputTokens ===
                    "number" &&
                typeof event.outputTokens ===
                    "number"
            ) {

                const requestCost =
                    calculateAuditRequestCost({

                        inputTokens:
                            event.inputTokens,

                        outputTokens:
                            event.outputTokens,

                        pricing:
                            coordinator.pricing,
                    });

                cost =
                    mergeAuditCost(
                        cost,
                        requestCost
                    );
            }

            requests.push({

                requestId:
                    `${event.runId}-doc-${event.documentNumber}-page-${event.pageNumber}`,

                runId:
                    event.runId,

                documentNumber:
                    event.documentNumber,

                pageNumber:
                    event.pageNumber,

modelTier:
    event.modelTier,

modelName:
    event.model,

status:
    "COMPLETED",

                startedAt:
                    event.timestamp -
                    (
                        event.durationMs ??
                        0
                    ),

                completedAt:
                    event.timestamp,

                durationMs:
                    event.durationMs,

                inputTokens:
                    event.inputTokens,

                outputTokens:
                    event.outputTokens,

                totalTokens:
                    event.totalTokens,
            });
        }

        if (
            event.type ===
            "PROCESSING_FAILED"
        ) {

            usage =
                {
                    ...usage,

                    requestCount:
                        usage.requestCount +
                        1,

                    failedRequests:
                        usage.failedRequests +
                        1,
                };

            requests.push({

                requestId:
                    `${event.runId}-failed-${event.documentNumber ?? "unknown"}-${event.pageNumber ?? "unknown"}-${event.timestamp}`,

                runId:
                    event.runId,

                documentNumber:
                    event.documentNumber,

                pageNumber:
                    event.pageNumber,

                status:
                    "FAILED",

                startedAt:
                    event.timestamp,

                completedAt:
                    event.timestamp,

                durationMs:
                    0,

                error:
                    event.error,
            });
        }
    }

    /*
     * Preserve already supplied evaluation evidence.
     * The coordinator never invents an evaluation merely
     * because processing completed.
     */
    return {

        ...coordinator,

        usage,

        cost,

        requests,

totalPages,

documentCoverage,

pageExecution,

observedEventKeys:
    Array.from(
        observedEventKeys
    ),
    };
}


/**
 * Creates a deterministic identity for an observed audit event.
 *
 * StrataparseAuditEvent is a discriminated union and not every
 * event type contains documentNumber or pageNumber. The key
 * therefore uses only fields guaranteed to exist on every event.
 *
 * Event-specific fields are included only where available.
 */
function createAuditObservationKey(
    event:
        ReturnType<
            typeof getStrataparseAuditEvents
        >[number]
):
    string {

    const documentNumber =
        "documentNumber" in event
            ? event.documentNumber ?? "unknown"
            : "unknown";

    const pageNumber =
        "pageNumber" in event
            ? event.pageNumber ?? "unknown"
            : "unknown";

    return [
        event.type,
        event.runId,
        documentNumber,
        pageNumber,
        event.timestamp,
    ].join(
        "|"
    );
}


/**
 * Adds externally supplied evaluation evidence to the
 * current audit run.
 *
 * The coordinator stores the evidence but does not
 * determine whether the production result is correct.
 */
export function recordAuditCoordinatorEvaluation(
    coordinator:
        AuditCoordinator,
    evaluation:
        AuditEvaluation
):
    AuditCoordinator {

    return {

        ...coordinator,

        evaluations:
            [
                ...coordinator.evaluations,
                evaluation,
            ],
    };
}


/**
 * Marks the observed result as rendered.
 *
 * Rendering is the lifecycle boundary required before
 * the audit run can be considered complete.
 */
export function markAuditCoordinatorRendered(
    coordinator:
        AuditCoordinator,
    timestamp:
        number
):
    AuditCoordinator {

    return {

        ...coordinator,

        result:
            markAuditResultRendered(
                coordinator.result,
                timestamp
            ),
    };
}


/**
 * Completes the audit and creates the final report.
 *
 * This should only be called after the relevant result
 * has actually been rendered.
 */
export async function completeAuditCoordinator(
    coordinator:
        AuditCoordinator
):
    Promise<AuditCoordinator> {

console.log(
    "[AUDIT COMPLETION DEBUG] 01 - Completing audit run",
    {
        runId:
            coordinator.run.runId,
    }
);

const completedRun =
    completeAuditRun(
        coordinator.run
    );

console.log(
    "[AUDIT COMPLETION DEBUG] 02 - Audit run completed",
    {
        runId:
            completedRun.runId,
        status:
            completedRun.status,
    }
);

console.log(
    "[AUDIT COMPLETION DEBUG] 03 - Entering aggregation",
    {
        runId:
            completedRun.runId,
        requests:
            coordinator.requests.length,
        documentCoverage:
            coordinator.documentCoverage.length,
        evaluations:
            coordinator.evaluations.length,
    }
);

const aggregation =
    aggregateAuditRun({

        run:
            completedRun,

        requests:
            coordinator.requests,

        usage:
            coordinator.usage,

        cost:
            coordinator.cost,

        result:
            coordinator.result,

        evaluations:
            coordinator.evaluations,

        totalPages:
            coordinator.totalPages,

        documentCoverage:
            coordinator.documentCoverage,

        pageExecution:
            coordinator.pageExecution,
    });

console.log(
    "[AUDIT COMPLETION DEBUG] 04 - Aggregation returned",
    {
        runId:
            completedRun.runId,
        requests:
            aggregation.requests.length,
        documents:
            aggregation.documentSummary.totalDocuments,
        pages:
            aggregation.documentSummary.totalPages,
    }
);

console.log(
    "[AUDIT COMPLETION DEBUG] 05 - Entering analysis",
    {
        runId:
            completedRun.runId,
    }
);

const analysis =
    analyzeAuditRun(
        aggregation
    );

console.log(
    "[AUDIT COMPLETION DEBUG] 06 - Analysis returned",
    {
        runId:
            completedRun.runId,
        status:
            analysis.overallStatus,
        findings:
            analysis.findings.length,
    }
);

console.log(
    "[AUDIT COMPLETION DEBUG] 07 - Entering report creation",
    {
        runId:
            completedRun.runId,
    }
);

const report =
    createAuditReport({

        reportId:
            `${completedRun.runId}-report`,

        aggregation,

        analysis,
    });

console.log(
    "[AUDIT COMPLETION DEBUG] 08 - Report created",
    {
        runId:
            completedRun.runId,
        reportId:
            report.reportId,
        status:
            report.status,
    }
);

console.log(
    "[AUDIT COMPLETION DEBUG] 09 - Saving in-memory audit state",
    {
        runId:
            completedRun.runId,
    }
);

saveAuditRun(
    completedRun
);

console.log(
    "[AUDIT COMPLETION DEBUG] 10 - Saving in-memory audit report",
    {
        runId:
            completedRun.runId,
        reportId:
            report.reportId,
    }
);

saveAuditReport(
    report
);

console.log(
    "[AUDIT COMPLETION DEBUG] 11 - Completion storage finished",
    {
        runId:
            completedRun.runId,
    }
);


    return {

        ...coordinator,

        run:
            completedRun,

        aggregation,

        analysis,

        report,
    };
}


/**
 * Marks an audit run as failed.
 *
 * This changes only the audit state.
 */
export function failAuditCoordinator(
    coordinator:
        AuditCoordinator
):
    AuditCoordinator {

    const failedRun =
        failAuditRun(
            coordinator.run
        );

    saveAuditRun(
        failedRun
    );

    return {

        ...coordinator,

        run:
            failedRun,
    };
}


/**
 * Marks an audit run as interrupted.
 *
 * Interruption is distinct from a processing failure.
 */
export function interruptAuditCoordinator(
    coordinator:
        AuditCoordinator
):
    AuditCoordinator {

    const interruptedRun =
        interruptAuditRun(
            coordinator.run
        );

    saveAuditRun(
        interruptedRun
    );

    return {

        ...coordinator,

        run:
            interruptedRun,
    };
}