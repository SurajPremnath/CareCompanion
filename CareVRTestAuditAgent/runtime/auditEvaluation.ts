/**
 * CareVRTestAuditAgent
 *
 * Audit evaluation.
 *
 * Records supplied evaluation evidence for observed
 * intelligence results.
 *
 * IMPORTANT:
 *
 * The audit agent does not:
 * - invent ground truth
 * - modify production results
 * - silently declare accuracy
 * - silently declare completeness
 *
 * Evaluation status must come from supplied evidence
 * or from an explicitly defined score threshold.
 */

export type AuditEvaluationStatus =
    | "NOT_EVALUATED"
    | "PASS"
    | "REVIEW"
    | "FAIL";


export interface AuditEvaluation {

    runId:
        string;

    documentNumber?:
        number;

    accuracyScore?:
        number;

    completenessScore?:
        number;

    accuracyStatus:
        AuditEvaluationStatus;

    completenessStatus:
        AuditEvaluationStatus;

    notes:
        string[];

    evaluatedAt:
        number;
}


/**
 * Creates an unevaluated evaluation record.
 *
 * This explicitly distinguishes "not evaluated" from
 * "evaluated and passed".
 */
export function createAuditEvaluation(
    input: {
        runId:
            string;

        documentNumber?:
            number;
    }
):
    AuditEvaluation {

    validateRunId(
        input.runId
    );

    validateOptionalDocumentNumber(
        input.documentNumber
    );

    return {

        runId:
            input.runId,

        documentNumber:
            input.documentNumber,

        accuracyStatus:
            "NOT_EVALUATED",

        completenessStatus:
            "NOT_EVALUATED",

        notes:
            [],

        evaluatedAt:
            Date.now(),
    };
}


/**
 * Records externally supplied evaluation evidence.
 *
 * Scores must be between 0 and 100.
 *
 * The audit agent does not determine accuracy or
 * completeness without supplied evaluation evidence.
 */
export function recordAuditEvaluation(
    input: {
        runId:
            string;

        documentNumber?:
            number;

        accuracyScore?:
            number;

        completenessScore?:
            number;

        accuracyStatus?:
            AuditEvaluationStatus;

        completenessStatus?:
            AuditEvaluationStatus;

        notes?:
            string[];

        evaluatedAt?:
            number;
    }
):
    AuditEvaluation {

    validateRunId(
        input.runId
    );

    validateOptionalDocumentNumber(
        input.documentNumber
    );

    validateOptionalScore(
        input.accuracyScore,
        "accuracyScore"
    );

    validateOptionalScore(
        input.completenessScore,
        "completenessScore"
    );

    const evaluatedAt =
        input.evaluatedAt ??
        Date.now();

    validateTimestamp(
        evaluatedAt
    );

    const notes =
        [
            ...(input.notes ?? []),
        ];

    return {

        runId:
            input.runId,

        documentNumber:
            input.documentNumber,

        accuracyScore:
            input.accuracyScore,

        completenessScore:
            input.completenessScore,

        accuracyStatus:
            input.accuracyStatus ??
            "NOT_EVALUATED",

        completenessStatus:
            input.completenessStatus ??
            "NOT_EVALUATED",

        notes,

        evaluatedAt,
    };
}


/**
 * Calculates an evaluation status from a score.
 *
 * Default thresholds:
 *
 * 90-100  → PASS
 * 75-89   → REVIEW
 * below 75 → FAIL
 *
 * Thresholds are explicitly supplied or use the default
 * audit acceptance policy.
 */
export function getAuditEvaluationStatus(
    score:
        number,
    thresholds: {
        pass:
            number;

        review:
            number;
    } = {
        pass:
            90,

        review:
            75,
    }
):
    AuditEvaluationStatus {

    validateScore(
        score,
        "score"
    );

    validateThresholds(
        thresholds
    );

    if (
        score >=
        thresholds.pass
    ) {
        return "PASS";
    }

    if (
        score >=
        thresholds.review
    ) {
        return "REVIEW";
    }

    return "FAIL";
}


/**
 * Evaluates a supplied accuracy score.
 *
 * This does not generate the score.
 */
export function evaluateAccuracyScore(
    score:
        number,
    thresholds?: {
        pass:
            number;

        review:
            number;
    }
):
    AuditEvaluationStatus {

    return getAuditEvaluationStatus(
        score,
        thresholds
    );
}


/**
 * Evaluates a supplied completeness score.
 *
 * This does not generate the score.
 */
export function evaluateCompletenessScore(
    score:
        number,
    thresholds?: {
        pass:
            number;

        review:
            number;
    }
):
    AuditEvaluationStatus {

    return getAuditEvaluationStatus(
        score,
        thresholds
    );
}


/**
 * Validates an optional score.
 */
function validateOptionalScore(
    score:
        number |
        undefined,
    field:
        string
):
    void {

    if (
        score ===
        undefined
    ) {
        return;
    }

    validateScore(
        score,
        field
    );
}


/**
 * Validates a score between 0 and 100.
 */
function validateScore(
    score:
        number,
    field:
        string
):
    void {

    if (
        !Number.isFinite(
            score
        ) ||
        score < 0 ||
        score > 100
    ) {
        throw new Error(
            `${field} must be a number between 0 and 100.`
        );
    }
}


/**
 * Validates evaluation thresholds.
 */
function validateThresholds(
    thresholds: {
        pass:
            number;

        review:
            number;
    }
):
    void {

    validateScore(
        thresholds.pass,
        "pass threshold"
    );

    validateScore(
        thresholds.review,
        "review threshold"
    );

    if (
        thresholds.review >=
        thresholds.pass
    ) {
        throw new Error(
            "Review threshold must be lower than pass threshold."
        );
    }
}


/**
 * Validates a run identifier.
 */
function validateRunId(
    runId:
        string
):
    void {

    if (
        !runId.trim()
    ) {
        throw new Error(
            "runId is required."
        );
    }
}


/**
 * Validates an optional document number.
 */
function validateOptionalDocumentNumber(
    documentNumber:
        number |
        undefined
):
    void {

    if (
        documentNumber ===
        undefined
    ) {
        return;
    }

    if (
        !Number.isInteger(
            documentNumber
        ) ||
        documentNumber < 1
    ) {
        throw new Error(
            "documentNumber must be a positive integer."
        );
    }
}


/**
 * Validates an audit timestamp.
 */
function validateTimestamp(
    timestamp:
        number
):
    void {

    if (
        !Number.isFinite(
            timestamp
        ) ||
        timestamp < 0
    ) {
        throw new Error(
            "evaluatedAt must be a finite non-negative timestamp."
        );
    }
}