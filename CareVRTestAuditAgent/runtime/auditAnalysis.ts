/**
 * CareVRTestAuditAgent
 *
 * Audit analysis.
 *
 * Converts aggregated audit evidence into structured findings
 * and an overall Founder-level assessment.
 *
 * IMPORTANT:
 *
 * This module:
 * - analyses observed audit evidence only
 * - does not modify CareVR
 * - does not invoke production AI
 * - does not create ground truth
 * - does not claim clinical accuracy without supplied evidence
 *
 * Individual evaluation status:
 *     PASS / REVIEW / FAIL / NOT_EVALUATED
 *
 * Overall Founder status:
 *     HEALTHY / REVIEW / CRITICAL / NOT_EVALUATED
 */

import type {
    AuditAggregation,
} from "./auditAggregator";

import type {
    AuditEvaluationStatus,
} from "./auditEvaluation";


export type AuditFindingSeverity =
    | "INFO"
    | "WARNING"
    | "CRITICAL";


export type AuditFindingCategory =
    | "COMPLETION"
    | "PERFORMANCE"
    | "TOKEN_USAGE"
    | "COST"
    | "ACCURACY"
    | "COMPLETENESS"
    | "RENDERING"
    | "FAILURE";


export interface AuditFinding {

    category:
        AuditFindingCategory;

    severity:
        AuditFindingSeverity;

    title:
        string;

    description:
        string;

    documentNumber?:
        number;

    value?:
        number |
        string;

    recommendation?:
        string;
}


export interface AuditAnalysis {

    overallStatus:
        "HEALTHY" |
        "REVIEW" |
        "CRITICAL" |
        "NOT_EVALUATED";

    executiveSummary:
        string;

    findings:
        AuditFinding[];

    evaluatedDocuments:
        number;

    passedDocuments:
        number;

    reviewDocuments:
        number;

    failedDocuments:
        number;

    averageAccuracyScore?:
        number;

    averageCompletenessScore?:
        number;

financial:
    AuditFinancialAnalysis;

}



export interface AuditFinancialAnalysis {

    originalBalance:
        number;

    usageCost:
        number;

    currentRunningBalance:
        number;

    currency:
        string;
}


/**
 * Analyses one completed audit aggregation.
 */
export function analyzeAuditRun(
    aggregation:
        AuditAggregation
):
    AuditAnalysis {

    const evaluations =
        aggregation.evaluations;

    const evaluatedEvaluations =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus !==
                    "NOT_EVALUATED" ||
                evaluation.completenessStatus !==
                    "NOT_EVALUATED"
        );

    const evaluatedDocuments =
        evaluatedEvaluations.length;

    const passedDocuments =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus === "PASS" &&
                evaluation.completenessStatus === "PASS"
        ).length;

    const reviewDocuments =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus === "REVIEW" ||
                evaluation.completenessStatus === "REVIEW"
        ).length;

    const failedDocuments =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus === "FAIL" ||
                evaluation.completenessStatus === "FAIL"
        ).length;

    const averageAccuracyScore =
        calculateAverageScore(
            evaluations.map(
                evaluation =>
                    evaluation.accuracyScore
            )
        );

    const averageCompletenessScore =
        calculateAverageScore(
            evaluations.map(
                evaluation =>
                    evaluation.completenessScore
            )
        );

    const accuracyStatus =
        deriveAggregateEvaluationStatus(
            evaluations.map(
                evaluation =>
                    evaluation.accuracyStatus
            )
        );

    const completenessStatus =
        deriveAggregateEvaluationStatus(
            evaluations.map(
                evaluation =>
                    evaluation.completenessStatus
            )
        );

    const overallStatus =
        getFounderStatus(
            accuracyStatus,
            completenessStatus,
            aggregation.run.failedDocuments,
            aggregation.usage.failedRequests
        );

    const findings =
        buildFindings(
            aggregation,
            accuracyStatus,
            completenessStatus,
            evaluatedDocuments,
            failedDocuments
        );

const originalBalance =
    9.50;

const usageCost =
    aggregation.cost.totalCost;

const currentRunningBalance =
    Math.max(
        0,
        originalBalance -
        usageCost
    );

const financial:
    AuditFinancialAnalysis = {

    originalBalance,

    usageCost,

    currentRunningBalance,

    currency:
        aggregation.cost.currency,
};


    return {

        overallStatus,

        executiveSummary:
            buildExecutiveSummary(
                aggregation,
                overallStatus,
                evaluatedDocuments,
                passedDocuments,
                reviewDocuments,
                failedDocuments
            ),

        findings,

        evaluatedDocuments,

        passedDocuments,

        reviewDocuments,

        failedDocuments,

        ...(averageAccuracyScore !== undefined
            ? {
                averageAccuracyScore,
            }
            : {}),

        ...(averageCompletenessScore !== undefined
            ? {
                averageCompletenessScore,
            }
            : {}),

financial,

    };
}


/**
 * Determines the aggregate status of one evaluation dimension.
 *
 * FAIL takes precedence over REVIEW.
 * REVIEW takes precedence over PASS.
 */
function deriveAggregateEvaluationStatus(
    statuses:
        AuditEvaluationStatus[]
):
    AuditEvaluationStatus {

    if (
        statuses.length === 0
    ) {
        return "NOT_EVALUATED";
    }

    if (
        statuses.some(
            status =>
                status === "FAIL"
        )
    ) {
        return "FAIL";
    }

    if (
        statuses.some(
            status =>
                status === "REVIEW"
        )
    ) {
        return "REVIEW";
    }

    if (
        statuses.every(
            status =>
                status === "PASS"
        )
    ) {
        return "PASS";
    }

    return "NOT_EVALUATED";
}


/**
 * Converts individual evaluation status into the
 * Founder-level audit status vocabulary.
 */
function getFounderStatus(
    accuracyStatus:
        AuditEvaluationStatus,

    completenessStatus:
        AuditEvaluationStatus,

    failedDocuments:
        number,

    failedRequests:
        number
):
    AuditAnalysis["overallStatus"] {

    if (
        failedDocuments > 0 ||
        failedRequests > 0 ||
        accuracyStatus === "FAIL" ||
        completenessStatus === "FAIL"
    ) {
        return "CRITICAL";
    }

    if (
        accuracyStatus === "REVIEW" ||
        completenessStatus === "REVIEW"
    ) {
        return "REVIEW";
    }

    if (
        accuracyStatus === "PASS" &&
        completenessStatus === "PASS"
    ) {
        return "HEALTHY";
    }

    return "NOT_EVALUATED";
}


/**
 * Builds findings from directly observable audit evidence.
 */
function buildFindings(
    aggregation:
        AuditAggregation,

    accuracyStatus:
        AuditEvaluationStatus,

    completenessStatus:
        AuditEvaluationStatus,

    evaluatedDocuments:
        number,

    failedEvaluations:
        number
):
    AuditFinding[] {

    const findings:
        AuditFinding[] = [];

    if (
        aggregation.run.failedDocuments >
        0
    ) {

        findings.push({

            category:
                "FAILURE",

            severity:
                "CRITICAL",

            title:
                "Document processing failures detected",

            description:
                `${aggregation.run.failedDocuments} document(s) failed during the audit run.`,

            value:
                aggregation.run.failedDocuments,

            recommendation:
                "Review the failed document processing events and identify the failure boundary.",
        });
    }

    if (
        aggregation.usage.failedRequests >
        0
    ) {

        findings.push({

            category:
                "FAILURE",

            severity:
                "CRITICAL",

            title:
                "Intelligence request failures detected",

            description:
                `${aggregation.usage.failedRequests} intelligence request(s) failed during the audit run.`,

            value:
                aggregation.usage.failedRequests,

            recommendation:
                "Review the associated request evidence and failure reasons.",
        });
    }

    if (
        accuracyStatus ===
        "REVIEW"
    ) {

        findings.push({

            category:
                "ACCURACY",

            severity:
                "WARNING",

            title:
                "Accuracy requires review",

            description:
                "Observed accuracy evaluation evidence contains one or more items requiring review.",

            recommendation:
                "Review the underlying evaluation evidence before treating the audit as fully accurate.",
        });
    }

    if (
        accuracyStatus ===
        "FAIL"
    ) {

        findings.push({

            category:
                "ACCURACY",

            severity:
                "CRITICAL",

            title:
                "Accuracy evaluation failed",

            description:
                "Observed accuracy evaluation evidence contains one or more failed evaluations.",

            recommendation:
                "Inspect the affected document results and supplied evaluation evidence.",
        });
    }

    if (
        completenessStatus ===
        "REVIEW"
    ) {

        findings.push({

            category:
                "COMPLETENESS",

            severity:
                "WARNING",

            title:
                "Completeness requires review",

            description:
                "Observed completeness evaluation evidence contains one or more items requiring review.",

            recommendation:
                "Review the underlying document extraction evidence.",
        });
    }

    if (
        completenessStatus ===
        "FAIL"
    ) {

        findings.push({

            category:
                "COMPLETENESS",

            severity:
                "CRITICAL",

            title:
                "Completeness evaluation failed",

            description:
                "Observed completeness evaluation evidence contains one or more failed evaluations.",

            recommendation:
                "Inspect the affected document results and identify missing information.",
        });
    }

    if (
        evaluatedDocuments ===
        0
    ) {

        findings.push({

            category:
                "COMPLETENESS",

            severity:
                "INFO",

            title:
                "No evaluation evidence supplied",

            description:
                "The audit run contains no completed accuracy or completeness evaluation evidence.",

            recommendation:
                "Supply evaluation evidence before making claims about extraction accuracy or completeness.",
        });
    }

    if (
        failedEvaluations >
        0 &&
        !findings.some(
            finding =>
                finding.category ===
                "ACCURACY" &&
                finding.severity ===
                "CRITICAL"
        )
    ) {

        findings.push({

            category:
                "COMPLETENESS",

            severity:
                "CRITICAL",

            title:
                "Evaluation failures detected",

            description:
                `${failedEvaluations} evaluated document(s) contain failed evaluation criteria.`,

            value:
                failedEvaluations,

            recommendation:
                "Review the affected evaluation records.",
        });
    }

    return findings;
}


/**
 * Builds a concise Founder-facing summary.
 */
function buildExecutiveSummary(
    aggregation:
        AuditAggregation,

    overallStatus:
        AuditAnalysis["overallStatus"],

    evaluatedDocuments:
        number,

    passedDocuments:
        number,

    reviewDocuments:
        number,

    failedDocuments:
        number
):
    string {

    const totalDocuments =
        aggregation.documentSummary.totalDocuments;

    const failedRequests =
        aggregation.usage.failedRequests;

    switch (
        overallStatus
    ) {

        case "HEALTHY":

            return (
                `Audit completed successfully across ` +
                `${totalDocuments} document(s). ` +
                `${passedDocuments} evaluated document(s) passed ` +
                `the available accuracy and completeness checks.`
            );

        case "REVIEW":

            return (
                `Audit completed with items requiring review. ` +
                `${reviewDocuments} evaluated document(s) require review ` +
                `out of ${evaluatedDocuments} evaluated document(s).`
            );

        case "CRITICAL":

            return (
                `Audit identified critical issues. ` +
                `${failedDocuments} evaluated document(s) failed ` +
                `and ${failedRequests} intelligence request(s) failed.`
            );

        case "NOT_EVALUATED":
        default:

            return (
                `Audit completed, but sufficient evaluation evidence ` +
                `was not supplied to determine overall accuracy or completeness.`
            );
    }
}


/**
 * Calculates the arithmetic mean of supplied scores.
 *
 * Undefined scores are excluded.
 */
function calculateAverageScore(
    scores:
        Array<number | undefined>
):
    number | undefined {

    const validScores =
        scores.filter(
            (
                score
            ): score is number =>
                score !== undefined &&
                Number.isFinite(score)
        );

    if (
        validScores.length ===
        0
    ) {
        return undefined;
    }

    const total =
        validScores.reduce(
            (
                sum,
                score
            ) =>
                sum + score,
            0
        );

    return Number(
        (
            total /
            validScores.length
        ).toFixed(2)
    );
}