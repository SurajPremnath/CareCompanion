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
    type AuditCost,
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
export function startAuditCoordinator(
    input: {
        runId:
            string;

        module:
            string;

        documentCount:
            number;
    }
):
    AuditCoordinator {

    const run =
        createAuditRun(
            input
        );

    const coordinator:
        AuditCoordinator = {

        run,

        result:
            createAuditResultEvidence(
                input.runId
            ),

        usage:
            createAuditUsage(),

        cost:
            createAuditCost(),

        requests:
            [],

        evaluations:
            [],

        totalPages:
            0,
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

    let usage =
        createAuditUsage();

    const requests =
        [
            ...coordinator.requests,
        ];

    let totalPages =
        coordinator.totalPages;

    for (
        const event
        of events
    ) {

        if (
            event.type ===
            "DOCUMENT_STARTED"
        ) {

            totalPages +=
                event.pageCount;
        }

        if (
            event.type ===
            "PAGE_COMPLETED"
        ) {

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

        requests,

        totalPages,
    };
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
export function completeAuditCoordinator(
    coordinator:
        AuditCoordinator
):
    AuditCoordinator {

    const completedRun =
        completeAuditRun(
            coordinator.run
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
        });

    const analysis =
        analyzeAuditRun(
            aggregation
        );

    const report =
        createAuditReport({

            reportId:
                `${completedRun.runId}-report`,

            aggregation,

            analysis,
        });

    saveAuditRun(
        completedRun
    );

    saveAuditReport(
        report
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