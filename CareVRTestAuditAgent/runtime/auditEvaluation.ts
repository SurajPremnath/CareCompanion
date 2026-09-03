/**
 * CareVRTestAuditAgent
 *
 * Audit evaluation.
 *
 * Converts explicitly supplied test-evaluation evidence into a
 * structured audit evaluation.
 *
 * IMPORTANT:
 *
 * The Audit Agent does not invent ground truth.
 * Expected values must come from the configured test expectation.
 *
 * The Audit Agent does not modify production results.
 *
 * Accuracy is calculated only when explicit comparison evidence
 * is supplied.
 */

import type {
    AuditAccuracyComparison,
    AuditAccuracyMiss,
} from "../contracts/AuditAccuracy";


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

    /**
     * Explicit accuracy comparison evidence.
     *
     * This is the evidence behind the accuracy score.
     */
    accuracyComparisons:
        AuditAccuracyComparison[];

    /**
     * Actual extraction misses identified by the comparison evidence.
     */
    accuracyMisses:
        AuditAccuracyMiss[];

    /**
     * Number of expected items evaluated for accuracy.
     */
    accuracyEvaluatedItems:
        number;

    /**
     * Number of correctly extracted expected items.
     */
    accuracyCorrectItems:
        number;

    /**
     * Number of missed expected items.
     */
    accuracyMissedItems:
        number;

    /**
     * Number of incorrectly extracted expected items.
     */
    accuracyIncorrectItems:
        number;
}


/**
 * Creates an unevaluated evaluation record.
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

        accuracyComparisons:
            [],

        accuracyMisses:
            [],

        accuracyEvaluatedItems:
            0,

        accuracyCorrectItems:
            0,

        accuracyMissedItems:
            0,

        accuracyIncorrectItems:
            0,
    };
}


/**
 * Records explicitly supplied evaluation evidence.
 *
 * Accuracy is calculated from the supplied comparison evidence.
 *
 * The Audit Agent does not determine what should have been
 * extracted. It only records the expected-vs-actual evidence
 * supplied by the test evaluation boundary.
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

        accuracyComparisons?:
            AuditAccuracyComparison[];
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

    const comparisons =
        [
            ...(input.accuracyComparisons ?? []),
        ];

    validateComparisons(
        comparisons
    );

    const derivedAccuracy =
        deriveAccuracyEvidence(
            comparisons
        );

    /*
     * Explicit comparison evidence is authoritative.
     *
     * If comparison evidence exists, calculate the accuracy
     * percentage from that evidence rather than trusting an
     * independently supplied percentage.
     */
    const accuracyScore =
        comparisons.length > 0
            ? derivedAccuracy.accuracyPercentage
            : input.accuracyScore;

    const accuracyStatus =
        comparisons.length > 0
            ? getAuditEvaluationStatus(
                derivedAccuracy.accuracyPercentage
            )
            : (
                input.accuracyStatus ??
                "NOT_EVALUATED"
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

        accuracyScore,

        completenessScore:
            input.completenessScore,

        accuracyStatus,

        completenessStatus:
            input.completenessStatus ??
            "NOT_EVALUATED",

        notes,

        evaluatedAt,

        accuracyComparisons:
            comparisons,

        accuracyMisses:
            derivedAccuracy.misses,

        accuracyEvaluatedItems:
            derivedAccuracy.evaluatedItems,

        accuracyCorrectItems:
            derivedAccuracy.correctItems,

        accuracyMissedItems:
            derivedAccuracy.missedItems,

        accuracyIncorrectItems:
            derivedAccuracy.incorrectItems,
    };
}


/**
 * Derives quantitative accuracy only from explicit comparison
 * evidence.
 *
 * Accuracy is:
 *
 *     correctly extracted expected items
 *     -------------------------------- × 100
 *             evaluated expected items
 *
 * No expected item is created here.
 */
function deriveAccuracyEvidence(
    comparisons:
        AuditAccuracyComparison[]
) {

    const evaluatedItems =
        comparisons.length;

    const correctItems =
        comparisons.filter(
            comparison =>
                comparison.result ===
                "CORRECT"
        ).length;

    const missedItems =
        comparisons.filter(
            comparison =>
                comparison.result ===
                "MISSED"
        ).length;

    const incorrectItems =
        comparisons.filter(
            comparison =>
                comparison.result ===
                "INCORRECT"
        ).length;

    const misses =
        comparisons
            .filter(
                comparison =>
                    comparison.result ===
                        "MISSED" ||
                    comparison.result ===
                        "INCORRECT"
            )
            .map(
                comparison => ({
                    itemId:
                        comparison.itemId,

                    field:
                        comparison.field,

                    expected:
                        comparison.expected,

                    actual:
                        comparison.actual,

                    reason:
                        comparison.notes ??
                        (
                            comparison.result ===
                            "MISSED"
                                ? "Expected item was not correctly extracted."
                                : "Actual extracted value did not match the expected value."
                        ),
                })
            );

    const accuracyPercentage =
        evaluatedItems === 0
            ? 0
            : Number(
                (
                    correctItems /
                    evaluatedItems *
                    100
                ).toFixed(2)
            );

    return {

        evaluatedItems,

        correctItems,

        missedItems,

        incorrectItems,

        misses,

        accuracyPercentage,
    };
}


/**
 * Calculates an evaluation status from a score.
 *
 * Default thresholds:
 *
 * 90-100  -> PASS
 * 75-89   -> REVIEW
 * below 75 -> FAIL
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


function validateComparisons(
    comparisons:
        AuditAccuracyComparison[]
):
    void {

    const itemIds =
        new Set<string>();

    for (
        const comparison
        of comparisons
    ) {

        if (
            !comparison.itemId.trim()
        ) {
            throw new Error(
                "Every accuracy comparison requires an itemId."
            );
        }

        if (
            !comparison.field.trim()
        ) {
            throw new Error(
                "Every accuracy comparison requires a field."
            );
        }

        if (
            itemIds.has(
                comparison.itemId
            )
        ) {
            throw new Error(
                `Duplicate accuracy comparison itemId: ${comparison.itemId}`
            );
        }

        itemIds.add(
            comparison.itemId
        );
    }
}


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

/**
 * Builds explicit accuracy comparison evidence between:
 *
 *     approved benchmark expectation
 *              +
 *     actual observed CareVR extraction
 *
 * and returns one comparison for every expected leaf value.
 *
 * IMPORTANT:
 *
 * The expected object must come from an approved test
 * expectation. This function never derives expected values
 * from the actual result.
 *
 * Arrays are compared by their canonical JSON representation
 * after recursively normalising object key order.
 *
 * This function does not modify the actual production result.
 */
export function buildAuditAccuracyComparisons(
    expected:
        unknown,
    actual:
        unknown
):
    AuditAccuracyComparison[] {

    const comparisons:
        AuditAccuracyComparison[] = [];

    compareExpectedValue(
        expected,
        actual,
        "$",
        comparisons
    );

    return comparisons;
}


/**
 * Recursively compares expected evidence with actual evidence.
 *
 * Every expected leaf becomes one independently auditable
 * comparison.
 */
function compareExpectedValue(
    expected:
        unknown,
    actual:
        unknown,
    path:
        string,
    comparisons:
        AuditAccuracyComparison[]
):
    void {

    /*
     * Objects are compared field-by-field so the Founder can
     * see exactly which clinical field was correct, missed,
     * or incorrect.
     */
    if (
        isRecord(expected)
    ) {

        const actualRecord =
            isRecord(actual)
                ? actual
                : {};

        for (
            const key
            of Object.keys(expected)
        ) {

            const expectedValue =
                expected[key];

            const actualValue =
                actualRecord[key];

            compareExpectedValue(
                expectedValue,
                actualValue,
                `${path}.${key}`,
                comparisons
            );
        }

        return;
    }

    /*
     * Arrays are treated as expected clinical items.
     *
     * Matching is performed by canonical value rather than
     * array position because clinical lists may legitimately
     * be returned in a different order.
     */
    if (
        Array.isArray(expected)
    ) {

        const actualArray =
            Array.isArray(actual)
                ? actual
                : [];

        const unmatchedActual =
            [
                ...actualArray,
            ];

        for (
            let index = 0;
            index < expected.length;
            index += 1
        ) {

            const expectedItem =
                expected[index];

            const expectedCanonical =
                canonicaliseValue(
                    expectedItem
                );

            const actualIndex =
                unmatchedActual.findIndex(
                    candidate =>
                        canonicaliseValue(
                            candidate
                        ) ===
                        expectedCanonical
                );

            if (
                actualIndex >= 0
            ) {

                const actualItem =
                    unmatchedActual[
                        actualIndex
                    ];

                unmatchedActual.splice(
                    actualIndex,
                    1
                );

                /*
                 * An exact item match is one correct expected
                 * item. We retain the actual value in the evidence.
                 */
                comparisons.push({
                    itemId:
                        `${path}[${index}]`,

                    field:
                        path,

                    expected:
                        expectedItem,

                    actual:
                        actualItem,

                    result:
                        "CORRECT",
                });

                continue;
            }

            /*
             * No equivalent actual item exists.
             * This is an actual extraction miss.
             */
            comparisons.push({
                itemId:
                    `${path}[${index}]`,

                field:
                    path,

                expected:
                    expectedItem,

                actual:
                    null,

                result:
                    "MISSED",

                notes:
                    "Expected benchmark item was not present in the actual CareVR result.",
            });
        }

        return;
    }

    /*
     * Primitive/null values are compared directly.
     *
     * Missing values are represented by undefined and are
     * therefore distinguishable from an expected null.
     */
    const matches =
        valuesEqual(
            expected,
            actual
        );

    comparisons.push({
        itemId:
            path,

        field:
            path,

        expected,

        actual:
            actual === undefined
                ? null
                : actual,

        result:
            matches
                ? "CORRECT"
                : "INCORRECT",

        ...(matches
            ? {}
            : {
                notes:
                    actual === undefined
                        ? "Expected value was not returned by the actual CareVR result."
                        : "Actual extracted value does not match the approved benchmark expectation.",
            }),
    });
}


/**
 * Compares primitive benchmark values without changing
 * their representation.
 */
function valuesEqual(
    expected:
        unknown,
    actual:
        unknown
):
    boolean {

    if (
        expected ===
        actual
    ) {
        return true;
    }

    /*
     * Treat an absent actual field and an explicit expected
     * null as equivalent absence.
     *
     * The benchmark uses null for fields that are not present.
     */
    if (
        expected ===
            null &&
        actual ===
            undefined
    ) {
        return true;
    }

    return false;
}


/**
 * Produces a deterministic representation for array-item
 * comparison without mutating either object.
 */
function canonicaliseValue(
    value:
        unknown
):
    string {

    if (
        Array.isArray(value)
    ) {
        return `[${value
            .map(
                item =>
                    canonicaliseValue(
                        item
                    )
            )
            .join(",")}]`;
    }

    if (
        isRecord(value)
    ) {

        return `{${Object.keys(value)
            .sort()
            .map(
                key =>
                    `${JSON.stringify(key)}:${canonicaliseValue(
                        value[key]
                    )}`
            )
            .join(",")}}`;
    }

    return JSON.stringify(
        value
    );
}


/**
 * Runtime object guard used by the comparison boundary.
 */
function isRecord(
    value:
        unknown
):
    value is Record<string, unknown> {

    return (
        typeof value ===
            "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}