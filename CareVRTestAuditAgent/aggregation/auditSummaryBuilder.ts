/**
 * CareVR Test Audit Agent
 *
 * Builds the Founder-level summary for one complete audit run.
 *
 * IMPORTANT:
 *
 * This module is observational and analytical only.
 * It does not control CareVR processing.
 * It does not invoke AI models.
 * It does not modify prompts, extraction results, or production state.
 *
 * The builder converts the independently collected audit evidence
 * into the compact summary model consumed by the Audit Summary UI.
 */

import type {
    AuditRunState,
} from "../runtime/auditRun";

import type {
    AuditRequest,
} from "../runtime/auditRequest";

import type {
    AuditUsage,
} from "../runtime/auditUsage";

import type {
    AuditCost,
} from "../runtime/auditCost";

import type {
    AuditResultEvidence,
} from "../runtime/auditResult";

import type {
    AuditEvaluation,
} from "../runtime/auditEvaluation";


export interface AuditSummary {

    runId:
        string;

    module:
        string;

    status:
        AuditRunState["status"];

    durationMs:
        number;

    documents:
        number;

    completedDocuments:
        number;

    failedDocuments:
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

    /*
     * Founder-level derived usage metric.
     *
     * Calculated from the actual aggregated total token
     * usage divided by the actual number of audit requests.
     *
     * This is observational only and does not affect
     * Strataparse processing or model routing.
     */
    averageTokensPerRequest:
        number;

    totalCost:
        number;

    requestCompletionRate:
        number;

    documentCompletionRate:
        number;

    accuracy:
        number;

    completeness:
        number;

    accuracyStatus:
        AuditSummaryStatus;

    completenessStatus:
        AuditSummaryStatus;

    totalPages:
        number;

    singlePageDocuments:
        number;

    multiPageDocuments:
        number;

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

    failedEvaluations:
        number;
}


export type AuditSummaryStatus =
    | "NOT_EVALUATED"
    | "PASS"
    | "REVIEW"
    | "FAIL";


export interface AuditSummaryBuildInput {

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


/**
 * Builds the Founder-level summary from independently
 * collected audit evidence.
 */
export function buildAuditSummary(
    input:
        AuditSummaryBuildInput
):
    AuditSummary {

    const requests =
        input.requests;

    const completedRequests =
        requests.filter(
            request =>
                request.status ===
                "COMPLETED"
        ).length;

    const failedRequests =
        requests.filter(
            request =>
                request.status ===
                "FAILED"
        ).length;

    const inputTokens =
        getUsageNumber(
            input.usage,
            "inputTokens"
        );

    const outputTokens =
        getUsageNumber(
            input.usage,
            "outputTokens"
        );

    const totalTokens =
        getUsageNumber(
            input.usage,
            "totalTokens"
        );

/*
 * Derive average token usage per audit request from
 * the already aggregated observational usage values.
 *
 * Zero requests must never produce NaN or Infinity.
 */
const averageTokensPerRequest =
    requests.length > 0
        ? Number(
            (
                totalTokens /
                requests.length
            ).toFixed(2)
        )
        : 0;

    const totalCost =
        getCostNumber(
            input.cost
        );

    const evaluations =
        input.evaluations;

/*
 * Accuracy is now derived from explicit expected-vs-actual
 * comparison evidence.
 *
 * Do not average independently supplied document percentages.
 * That can produce a misleading result when documents contain
 * different numbers of evaluated items.
 */
const accuracyEvaluatedItems =
    evaluations.reduce(
        (
            total,
            evaluation
        ) =>
            total +
            evaluation.accuracyEvaluatedItems,
        0
    );

const accuracyCorrectItems =
    evaluations.reduce(
        (
            total,
            evaluation
        ) =>
            total +
            evaluation.accuracyCorrectItems,
        0
    );

const accuracy =
    accuracyEvaluatedItems > 0
        ? Number(
            (
                accuracyCorrectItems /
                accuracyEvaluatedItems *
                100
            ).toFixed(2)
        )
        : 0;

const accuracyMisses =
    evaluations.flatMap(
        evaluation =>
            evaluation.accuracyMisses
    );

const accuracyEvaluated =
    accuracyEvaluatedItems > 0;

/*
 * Completeness is derived only from explicitly supplied
 * completeness scores recorded by the Audit Agent.
 *
 * Evaluations without a completeness score are excluded.
 * No completeness value is invented for an unevaluated document.
 */
const completenessValues =
    evaluations
        .map(
            evaluation =>
                evaluation.completenessScore
        )
        .filter(
            (
                score
            ): score is number =>
                typeof score ===
                "number"
        );

const completeness =
    calculateAverage(
        completenessValues
    );

    /*
     * Page coverage is derived only from document-level
     * observations collected by the passive Audit Agent.
     *
     * No page classification is inferred from document type
     * and no coverage value is hardcoded.
     */
    const documentCoverage =
        input.documentCoverage ??
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

    return {

        runId:
            input.run.runId,

        module:
            input.run.module,

        status:
            input.run.status,

        durationMs:
            calculateDuration(
                input.run.startedAt,
                input.run.endedAt
            ),

        documents:
            input.run.documentCount,

        completedDocuments:
            input.run.completedDocuments,

        failedDocuments:
            input.run.failedDocuments,

        requests:
            requests.length,

        completedRequests,

        failedRequests,

        inputTokens,

        outputTokens,

        totalTokens,

        averageTokensPerRequest,

        totalCost,

        requestCompletionRate:
            calculateRate(
                completedRequests,
                requests.length
            ),

        documentCompletionRate:
            calculateRate(
                input.run.completedDocuments,
                input.run.documentCount
            ),

        accuracy,

        completeness,

accuracyStatus:
    accuracyEvaluated
        ? calculateEvaluationStatus(
            [
                accuracy,
            ]
        )
        : "NOT_EVALUATED",

        completenessStatus:
            calculateEvaluationStatus(
                completenessValues
            ),

        totalPages:
            input.totalPages ??
            0,

        singlePageDocuments,

        multiPageDocuments,


        pageExecution:
            (input.pageExecution ?? []).map(
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

        failedEvaluations:
            evaluations.filter(
                evaluation =>
                    evaluation.accuracyStatus ===
                    "FAIL" ||
                    evaluation.completenessStatus ===
                    "FAIL"
            ).length,
    };
}


/**
 * Compatibility overload.
 *
 * Allows existing callers that only have AuditRunState
 * to continue compiling while the full audit pipeline
 * is being connected.
 *
 * New production callers should use the full
 * AuditSummaryBuildInput form.
 */
export function buildAuditSummaryFromRun(
    run:
        AuditRunState
):
    AuditSummary {

    return {

        runId:
            run.runId,

        module:
            run.module,

        status:
            run.status,

        durationMs:
            calculateDuration(
                run.startedAt,
                run.endedAt
            ),

        documents:
            run.documentCount,

        completedDocuments:
            run.completedDocuments,

        failedDocuments:
            run.failedDocuments,

        requests:
            run.requestCount,

        completedRequests:
            run.completedRequests,

        failedRequests:
            run.failedRequests,

        inputTokens:
            run.inputTokens,

        outputTokens:
            run.outputTokens,

        totalTokens:
            run.totalTokens,

        /*
         * Compatibility path uses the persisted run-level
         * request and token totals to expose the same
         * Founder-level derived metric.
         */
        averageTokensPerRequest:
            run.requestCount > 0
                ? Number(
                    (
                        run.totalTokens /
                        run.requestCount
                    ).toFixed(2)
                )
                : 0,

        totalCost:
            Number(
                run.totalCost.toFixed(6)
            ),

        requestCompletionRate:
            calculateRate(
                run.completedRequests,
                run.requestCount
            ),

        documentCompletionRate:
            calculateRate(
                run.completedDocuments,
                run.documentCount
            ),

        accuracy:
            0,

        completeness:
            0,

        accuracyStatus:
            "NOT_EVALUATED",

        completenessStatus:
            "NOT_EVALUATED",

        totalPages:
            0,

        singlePageDocuments:
            0,

        multiPageDocuments:
            0,

        pageExecution:
            [],

        failedEvaluations:
            0,
    };
}


/**
 * Reads a numeric usage field without assuming
 * a particular internal implementation.
 */
function getUsageNumber(
    usage:
        AuditUsage,
    field:
        "inputTokens" |
        "outputTokens" |
        "totalTokens"
):
    number {

    const value =
        (
            usage as
            unknown as
            Record<string, unknown>
        )[field];

    return typeof value ===
        "number"
        ? value
        : 0;
}


/**
 * Reads the calculated audit cost.
 */
function getCostNumber(
    cost:
        AuditCost
):
    number {

    const value =
        (
            cost as
            unknown as
            Record<string, unknown>
        ).totalCost;

    return typeof value ===
        "number"
        ? Number(
            value.toFixed(6)
        )
        : 0;
}


/**
 * Calculates a percentage rate.
 */
function calculateRate(
    completed:
        number,
    total:
        number
):
    number {

    if (
        total <=
        0
    ) {
        return 0;
    }

    return Number(
        (
            completed /
            total *
            100
        ).toFixed(2)
    );
}


/**
 * Calculates total audit-run duration.
 */
function calculateDuration(
    startedAt:
        string,
    endedAt?:
        string
):
    number {

    if (
        !endedAt
    ) {
        return 0;
    }

    const started =
        Date.parse(
            startedAt
        );

    const ended =
        Date.parse(
            endedAt
        );

    if (
        !Number.isFinite(
            started
        ) ||
        !Number.isFinite(
            ended
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        ended -
        started
    );
}


/**
 * Calculates an average score.
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

    return Number(
        (
            total /
            values.length
        ).toFixed(2)
    );
}


/**
 * Determines whether an evaluation category
 * has enough evidence to produce a status.
 */
function calculateEvaluationStatus(
    values:
        number[]
):
    AuditSummaryStatus {

    if (
        values.length ===
        0
    ) {
        return "NOT_EVALUATED";
    }

    const average =
        calculateAverage(
            values
        );

    if (
        average >=
        90
    ) {
        return "PASS";
    }

    if (
        average >=
        75
    ) {
        return "REVIEW";
    }

    return "FAIL";
}