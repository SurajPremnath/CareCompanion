/**
 * CareVRTestAuditAgent
 *
 * Audit run aggregation.
 *
 * Combines independently observed audit evidence into one
 * complete audit-run snapshot.
 *
 * IMPORTANT:
 *
 * This module is observational and analytical only.
 *
 * It does not:
 * - control CareVR processing
 * - invoke AI models
 * - modify prompts
 * - modify extraction results
 * - retry production requests
 * - alter patient data
 *
 * Audit evidence collected during the run is treated as the
 * source of truth wherever detailed evidence is available.
 */

import type {
    AuditRunState,
} from "./auditRun";

import type {
    AuditResultEvidence,
} from "./auditResult";

import type {
    AuditRequest,
} from "./auditRequest";

import type {
    AuditUsage,
} from "./auditUsage";

import type {
    AuditCost,
} from "./auditCost";

import type {
    AuditEvaluation,
} from "./auditEvaluation";


export interface AuditAggregation {

    run:
        AuditRunState;

    requests:
        AuditRequest[];

    usage:
        AuditUsage;

    cost:
        AuditCost;

    result:
        AuditResultEvidence;

    evaluations:
        AuditEvaluation[];

    documentSummary:
        AuditDocumentSummary;

    timing:
        AuditTimingSummary;
}


export interface AuditDocumentSummary {

    totalDocuments:
        number;

    completedDocuments:
        number;

    failedDocuments:
        number;

    totalPages:
        number;

    documentTypes:
        Record<string, number>;
}


export interface AuditTimingSummary {

    totalDurationMs:
        number;

    averageRequestDurationMs:
        number;

    longestRequestDurationMs:
        number;

    shortestRequestDurationMs:
        number;
}


/**
 * Aggregates all independently collected evidence
 * belonging to one audit run.
 */
export function aggregateAuditRun(
    input: {
        run:
            AuditRunState;

        requests:
            AuditRequest[];

        usage:
            AuditUsage;

        cost:
            AuditCost;

        result:
            AuditResultEvidence;

        evaluations:
            AuditEvaluation[];

        totalPages?:
            number;
    }
):
    AuditAggregation {

    /*
     * Request evidence is the authoritative source for
     * request completion/failure statistics.
     */
    const completedRequestCount =
        input.requests.filter(
            request =>
                request.status ===
                "COMPLETED"
        ).length;

    const failedRequestCount =
        input.requests.filter(
            request =>
                request.status ===
                "FAILED"
        ).length;

    /*
     * Preserve all request evidence while preventing
     * accidental mutation by downstream consumers.
     */
    const requests =
        input.requests.map(
            request => ({
                ...request,
            })
        );

    /*
     * Request duration evidence is calculated only from
     * requests that actually supplied a duration.
     */
    const requestDurations =
        input.requests
            .map(
                request =>
                    request.durationMs
            )
            .filter(
                (
                    duration
                ): duration is number =>
                    typeof duration ===
                    "number" &&
                    Number.isFinite(
                        duration
                    ) &&
                    duration >=
                    0
            );

    /*
     * Document type distribution is derived from the
     * actual result evidence rather than inferred from
     * the run counters.
     */
    const documentTypes:
        Record<string, number> = {};

    for (
        const document
        of input.result.documents
    ) {

        const documentType =
            document.documentType ??
            "UNKNOWN";

        documentTypes[
            documentType
        ] =
            (
                documentTypes[
                    documentType
                ] ??
                0
            ) + 1;
    }

    /*
     * The result evidence is copied so the aggregated
     * snapshot cannot mutate the original observation.
     */
    const result:
        AuditResultEvidence = {

        ...input.result,

        documents:
            input.result.documents.map(
                document => ({
                    ...document,

                    result: {
                        ...document.result,
                    },
                })
            ),
    };

    /*
     * Evaluations are copied because the final report,
     * Founder Analysis and Summary may consume them
     * independently.
     */
    const evaluations =
        input.evaluations.map(
            evaluation => ({

                ...evaluation,

                notes:
                    [
                        ...evaluation.notes,
                    ],
            })
        );

    /*
     * Preserve the complete run state, while synchronising
     * request counters with the detailed request evidence.
     *
     * This prevents the summary from reporting one number
     * while the detailed request evidence contains another.
     */
    const run:
        AuditRunState = {

        ...input.run,

        requestCount:
            input.requests.length,

        completedRequests:
            completedRequestCount,

        failedRequests:
            failedRequestCount,

        metadata: {
            ...input.run.metadata,
        },
    };

    return {

        run,

        requests,

        usage: {
            ...input.usage,
        },

        cost: {
            ...input.cost,
        },

        result,

        evaluations,

        documentSummary: {

            totalDocuments:
                run.documentCount,

            completedDocuments:
                run.completedDocuments,

            failedDocuments:
                run.failedDocuments,

            totalPages:
                input.totalPages ??
                0,

            documentTypes,
        },

        timing: {

            totalDurationMs:
                calculateRunDuration(
                    run
                ),

            averageRequestDurationMs:
                calculateAverage(
                    requestDurations
                ),

            longestRequestDurationMs:
                requestDurations.length >
                0
                    ? Math.max(
                        ...requestDurations
                    )
                    : 0,

            shortestRequestDurationMs:
                requestDurations.length >
                0
                    ? Math.min(
                        ...requestDurations
                    )
                    : 0,
        },
    };
}


/**
 * Calculates total audit-run duration.
 */
function calculateRunDuration(
    run:
        AuditRunState
):
    number {

    if (
        !run.endedAt
    ) {
        return 0;
    }

    const startedAt =
        Date.parse(
            run.startedAt
        );

    const endedAt =
        Date.parse(
            run.endedAt
        );

    if (
        !Number.isFinite(
            startedAt
        ) ||
        !Number.isFinite(
            endedAt
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        endedAt -
        startedAt
    );
}


/**
 * Calculates the average of supplied durations.
 */
function calculateAverage(
    values:
        number[]
):
    number {

    if (
        values.length ===
        0
    ) {
        return 0;
    }

    const total =
        values.reduce(
            (
                sum,
                value
            ) =>
                sum +
                value,
            0
        );

    return (
        total /
        values.length
    );
}