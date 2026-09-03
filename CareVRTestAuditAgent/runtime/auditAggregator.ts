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

import {
    createAuditUsage,
    recordAuditUsage,
    type AuditUsage,
} from "./auditUsage";

import type {
    AuditCost,
} from "./auditCost";

import type {
    AuditEvaluation,
} from "./auditEvaluation";

import type {
    AuditAccuracyMiss,
} from "../contracts/AuditAccuracy";


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

    /**
     * Aggregated accuracy evidence across all evaluated documents.
     *
     * These values are derived only from explicit accuracy
     * comparison evidence supplied to the Audit Agent.
     */
    accuracy:
        AuditAccuracyAggregation;

    documentCoverage:
        AuditDocumentCoverage[];

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

    modelSummary:
        AuditModelSummary[];

    documentSummary:
        AuditDocumentSummary;

    timing:
        AuditTimingSummary;
}


export interface AuditAccuracyAggregation {

    evaluatedItems:
        number;

    correctItems:
        number;

    missedItems:
        number;

    incorrectItems:
        number;

    accuracyPercentage:
        number |
        undefined;

    misses:
        AuditAccuracyMiss[];
}


export interface AuditModelSummary {

    modelTier:
        string;

    modelName:
        string;

    documents:
        number;

    requests:
        number;

    completedRequests:
        number;

    failedRequests:
        number;

    inputTokens:
        number;

    outputTokens:
        number;

    totalTokens:
        number;

    totalTimeMs:
        number;
}


export interface AuditDocumentCoverage {

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

    singlePageDocuments:
        number;

    multiPageDocuments:
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

        documentCoverage?:
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

        pageExecution?:
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
 * Model usage is derived from the already observed request
 * evidence. Strataparse model routing is not repeated here.
 *
 * The Audit Agent records which logical tier and actual model
 * were observed for each request and aggregates those observations
 * for Founder-level reporting.
 */
const modelSummaryMap =
    new Map<
        string,
        AuditModelSummary
    >();

for (
    const request
    of requests
) {

    const modelTier =
        request.modelTier ??
        "UNKNOWN";

    const modelName =
        request.modelName ??
        "UNKNOWN";

    const key =
        `${modelTier}::${modelName}`;

    const existing =
        modelSummaryMap.get(
            key
        );

    const summary =
        existing ??
        {
            modelTier,

            modelName,

            documents:
                0,

            requests:
                0,

            completedRequests:
                0,

            failedRequests:
                0,

            inputTokens:
                0,

            outputTokens:
                0,

            totalTokens:
                0,

            totalTimeMs:
                0,
        };

    summary.requests += 1;

    if (
        request.status ===
        "COMPLETED"
    ) {
        summary.completedRequests += 1;
    }

    if (
        request.status ===
        "FAILED"
    ) {
        summary.failedRequests += 1;
    }

    if (
        typeof request.inputTokens ===
        "number"
    ) {
        summary.inputTokens +=
            request.inputTokens;
    }

    if (
        typeof request.outputTokens ===
        "number"
    ) {
        summary.outputTokens +=
            request.outputTokens;
    }

    if (
        typeof request.totalTokens ===
        "number"
    ) {
        summary.totalTokens +=
            request.totalTokens;
    }

    if (
        typeof request.durationMs ===
        "number"
    ) {
        summary.totalTimeMs +=
            request.durationMs;
    }

    modelSummaryMap.set(
        key,
        summary
    );
}

const modelSummary =
    Array.from(
        modelSummaryMap.values()
    );

const modelDocumentSets =
    new Map<
        string,
        Set<number>
    >();

for (
    const request
    of requests
) {

    if (
        request.documentNumber ===
        undefined
    ) {
        continue;
    }

    const modelTier =
        request.modelTier ??
        "UNKNOWN";

    const modelName =
        request.modelName ??
        "UNKNOWN";

    const key =
        `${modelTier}::${modelName}`;

    const documents =
        modelDocumentSets.get(
            key
        ) ??
        new Set<number>();

    documents.add(
        request.documentNumber
    );

    modelDocumentSets.set(
        key,
        documents
    );
}

for (
    const summary
    of modelSummary
) {

    const key =
        `${summary.modelTier}::${summary.modelName}`;

    summary.documents =
        modelDocumentSets.get(
            key
        )?.size ??
        0;
}

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
     * Single-page and multi-page coverage is derived only
     * from document-level page-count evidence observed by
     * the passive Audit Agent.
     *
     * No coverage value is inferred or hardcoded here.
     */
    const documentCoverage =
        input.documentCoverage ??
        [];

const pageExecution =
    input.pageExecution ??
    [];

    const singlePageDocuments =
        documentCoverage.filter(
            document =>
                document.pageCount ===
                1
        ).length;

    const multiPageDocuments =
        documentCoverage.filter(
            document =>
                document.pageCount >
                1
        ).length;

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

    /*
     * Accuracy is aggregated only from explicit comparison
     * evidence already recorded by the Audit Agent.
     *
     * No expected result is created here.
     * No production result is modified here.
     */
    const accuracyEvidence =
        evaluations.reduce(
            (
                totals,
                evaluation
            ) => {

                totals.evaluatedItems +=
                    evaluation.accuracyEvaluatedItems;

                totals.correctItems +=
                    evaluation.accuracyCorrectItems;

                totals.missedItems +=
                    evaluation.accuracyMissedItems;

                totals.incorrectItems +=
                    evaluation.accuracyIncorrectItems;

                totals.misses.push(
                    ...evaluation.accuracyMisses
                );

                return totals;
            },
            {
                evaluatedItems:
                    0,

                correctItems:
                    0,

                missedItems:
                    0,

                incorrectItems:
                    0,

                misses:
                    [] as AuditAccuracyMiss[],
            }
        );

    const accuracyPercentage =
        accuracyEvidence.evaluatedItems > 0
            ? Number(
                (
                    accuracyEvidence.correctItems /
                    accuracyEvidence.evaluatedItems *
                    100
                ).toFixed(2)
            )
            : undefined;



    return {

        run,

        requests,

        usage:
            requests.reduce(
                (
                    usage,
                    request
                ) =>
                    recordAuditUsage(
                        usage,
                        {
                            status:
                                request.status ===
                                "COMPLETED"
                                    ? "COMPLETED"
                                    : "FAILED",

                            inputTokens:
                                request.inputTokens,

                            outputTokens:
                                request.outputTokens,

                            totalTokens:
                                request.totalTokens,
                        }
                    ),
                createAuditUsage()
            ),

        cost: {
            ...input.cost,
        },

        result,

        evaluations,

    accuracy: {

        evaluatedItems:
            accuracyEvidence.evaluatedItems,

        correctItems:
            accuracyEvidence.correctItems,

        missedItems:
            accuracyEvidence.missedItems,

        incorrectItems:
            accuracyEvidence.incorrectItems,

        accuracyPercentage,

        misses:
            accuracyEvidence.misses,
    },


modelSummary,

documentCoverage:
    documentCoverage.map(
        document => ({
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
        })
    ),

pageExecution:
    pageExecution.map(
        page => ({
            documentNumber:
                page.documentNumber,

            pageNumber:
                page.pageNumber,

            started:
                page.started,

            completed:
                page.completed,
        })
    ),

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

            singlePageDocuments:
                singlePageDocuments,

            multiPageDocuments:
                multiPageDocuments,

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