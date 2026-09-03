/**
 * CareVRTestAuditAgent
 *
 * Audit Accuracy Contract
 *
 * Purpose:
 * Defines the evidence and assessment associated with the accuracy
 * of information returned by an AI-enabled CareVR processing flow.
 *
 * Scope:
 * Captures:
 *
 * - what was expected
 * - what was actually returned
 * - what was displayed
 * - how many expected items were evaluated
 * - how many were correct
 * - how many were missed
 * - how many were incorrect
 * - the resulting defensible accuracy percentage
 *
 * IMPORTANT:
 *
 * The Audit Agent does not invent expected values.
 * The expected evidence must come from the configured test expectation.
 *
 * The Audit Agent does not modify the production result.
 *
 * Accuracy evidence is supplied by the test/evaluation boundary and
 * preserved for Founder-level inspection.
 */

export type AccuracyStatus =
    | "ACCURATE"
    | "PARTIALLY_ACCURATE"
    | "INACCURATE"
    | "NOT_ASSESSED";


/**
 * One concrete accuracy comparison.
 *
 * This is the evidence behind an accuracy assessment.
 *
 * A comparison is supplied by the evaluation boundary.
 * The Audit Agent does not invent the expected value.
 */
export interface AuditAccuracyComparison {

    /** Identifier of the expected item being evaluated. */
    itemId:
        string;

    /** Human-readable field/item name. */
    field:
        string;

    /** Expected value from the configured test expectation. */
    expected:
        unknown;

    /** Actual value observed from the production result. */
    actual:
        unknown;

    /** Whether the expected item was correctly extracted. */
    result:
        "CORRECT" |
        "MISSED" |
        "INCORRECT";

    /** Optional explanation of the comparison outcome. */
    notes?:
        string;
}


/**
 * One actual extraction miss.
 *
 * A miss exists only when the supplied expected evidence identifies
 * an expected item that was not correctly present in the actual result.
 */
export interface AuditAccuracyMiss {

    /** Identifier of the expected item that was missed. */
    itemId:
        string;

    /** Human-readable field/item name. */
    field:
        string;

    /** Expected value that should have been present. */
    expected:
        unknown;

    /** Actual value observed, if any. */
    actual:
        unknown;

    /** Why the item is considered a miss. */
    reason:
        string;
}


export interface AuditAccuracy {

    /** Unique identifier for this accuracy assessment. */
    accuracyId:
        string;

    /** Parent Audit Run identifier. */
    runId:
        string;

    /** Document being evaluated. */
    documentId:
        string;

    /** Page being evaluated, where applicable. */
    pageId:
        string |
        null;

    /** AI request associated with the evaluated result, where applicable. */
    requestId:
        string |
        null;

    /** CareVR module being evaluated. */
    module:
        string;

    /**
     * Identifier/version of the test configuration that defines
     * what information was expected from the processing.
     */
    expectedConfigurationId:
        string;

    /**
     * Reference to the expected result used for the accuracy assessment.
     */
    expectedResultReference:
        string;

    /**
     * Reference to the actual result returned by the AI-enabled
     * processing flow.
     */
    actualResultReference:
        string;

    /**
     * Reference to the result observed on the CareVR UI.
     */
    displayedResultReference:
        string |
        null;

    /** Individual expected-vs-actual comparison evidence. */
    comparisons:
        AuditAccuracyComparison[];

    /** Actual extraction misses identified by the comparison evidence. */
    misses:
        AuditAccuracyMiss[];

    /** Number of expected items evaluated. */
    evaluatedItems:
        number;

    /** Number of correctly extracted expected items. */
    correctItems:
        number;

    /** Number of expected items that were missed. */
    missedItems:
        number;

    /** Number of expected items that were extracted incorrectly. */
    incorrectItems:
        number;

    /** Final accuracy classification for this assessment. */
    status:
        AccuracyStatus;

    /**
     * Defensible accuracy percentage calculated from the supplied
     * comparison evidence.
     */
    accuracyPercentage:
        number |
        null;

    /**
     * Human-readable explanation of the observed difference,
     * if any.
     */
    assessmentNotes:
        string |
        null;

    /**
     * Indicates whether the result was successfully displayed
     * to the user before the accuracy assessment was completed.
     */
    resultDisplayed:
        boolean;
}