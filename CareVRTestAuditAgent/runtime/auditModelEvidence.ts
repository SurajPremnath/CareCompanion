/**
 * CareVRTestAuditAgent
 *
 * Founder-facing model evidence.
 *
 * This module observes and evaluates already-recorded evidence.
 *
 * IMPORTANT:
 *
 * - It does not perform production model routing.
 * - It does not invoke AI.
 * - It does not modify Strataparse.
 * - It does not change prompts.
 * - It does not change extraction.
 *
 * The expected routing tier is a static audit reference derived
 * from the documented Strataparse routing rule:
 *
 *     MESSY     -> SOL
 *     CLEAN     -> LUNA
 *     UNCERTAIN -> TERRA
 *
 * The observed tier and actual model always come from audit
 * evidence collected from the production execution.
 *
 * Therefore:
 *
 *     expectedTier
 *          vs
 *     observedTier
 *
 * is an audit comparison, not a routing operation.
 */

import type {
    AuditDocumentCoverage,
    AuditAggregation,
} from "./auditAggregator";


export type AuditModelComparisonStatus =
    | "YES"
    | "NO"
    | "NOT_DETERMINABLE";


export interface AuditModelEvidence {

    documentNumber:
        number;

    documentType:
        string;

    readability:
        string;

    pageCount:
        number;

    /*
     * Expected routing tier derived from the documented
     * Strataparse routing rule.
     */
    expectedTier:
        string;

    /*
     * Logical tier(s) actually observed during processing.
     */
    modelTiers:
        string[];

    /*
     * Actual model identifier(s) observed during processing.
     */
    actualModels:
        string[];

    /*
     * Explicit comparison between expected and observed routing.
     */
    rightModelUsed:
        AuditModelComparisonStatus;

    /*
     * Indicates whether an observed model change can be
     * attributed to the documented readability/difficulty
     * routing relationship.
     */
    difficultyBasedModelChange:
        AuditModelComparisonStatus;

    /*
     * Raw observed model transitions.
     *
     * These remain evidence only. The Audit Agent does not
     * reinterpret the production routing decision.
     */
    modelChanges:
        Array<{
            fromTier:
                string;

            toTier:
                string;

            fromModel:
                string;

            toModel:
                string;

            pageNumber:
                number;
        }>;
}


/**
 * Returns the expected routing tier for audit comparison.
 *
 * This is NOT the production routing function.
 *
 * The Audit Agent uses this small immutable reference only
 * to compare observed evidence against the documented rule.
 */
function getExpectedTier(
    readability:
        string
):
    string {

    switch (
        readability
    ) {

        case "MESSY":
            return "SOL";

        case "CLEAN":
            return "LUNA";

        case "UNCERTAIN":
            return "TERRA";

        default:
            return "UNKNOWN";
    }
}


/**
 * Builds Founder-facing model evidence entirely from
 * already observed audit records.
 *
 * No production routing is repeated.
 * No production model is selected here.
 */
export function buildAuditModelEvidence(
    aggregation:
        AuditAggregation
):
    AuditModelEvidence[] {

    return aggregation.documentCoverage.map(
        document => {

            const documentRequests =
                aggregation.requests
                    .filter(
                        request =>
                            request.documentNumber ===
                            document.documentNumber
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            (
                                first.pageNumber ??
                                0
                            ) -
                            (
                                second.pageNumber ??
                                0
                            )
                    );

            const expectedTier =
                getExpectedTier(
                    document.readability
                );

            const modelTiers =
                Array.from(
                    new Set(
                        documentRequests
                            .map(
                                request =>
                                    request.modelTier
                            )
                            .filter(
                                (
                                    tier
                                ): tier is string =>
                                    Boolean(
                                        tier
                                    )
                            )
                    )
                );

            const actualModels =
                Array.from(
                    new Set(
                        documentRequests
                            .map(
                                request =>
                                    request.modelName
                            )
                            .filter(
                                (
                                    model
                                ): model is string =>
                                    Boolean(
                                        model
                                    )
                            )
                    )
                );

            const modelChanges:
                AuditModelEvidence["modelChanges"] =
                    [];

            for (
                let index = 1;
                index < documentRequests.length;
                index += 1
            ) {

                const previous =
                    documentRequests[
                        index - 1
                    ];

                const current =
                    documentRequests[
                        index
                    ];

                const previousTier =
                    previous.modelTier ??
                    "UNKNOWN";

                const currentTier =
                    current.modelTier ??
                    "UNKNOWN";

                const previousModel =
                    previous.modelName ??
                    "UNKNOWN";

                const currentModel =
                    current.modelName ??
                    "UNKNOWN";

                if (
                    previousTier !==
                        currentTier ||
                    previousModel !==
                        currentModel
                ) {

                    modelChanges.push({

                        fromTier:
                            previousTier,

                        toTier:
                            currentTier,

                        fromModel:
                            previousModel,

                        toModel:
                            currentModel,

                        pageNumber:
                            current.pageNumber ??
                            0,
                    });
                }
            }

            /*
             * A document can only be declared as having used
             * the right model when there is one observed tier
             * and it matches the expected tier.
             *
             * Missing or ambiguous observations remain
             * NOT_DETERMINABLE rather than being converted
             * into a YES or NO.
             */
            let rightModelUsed:
                AuditModelComparisonStatus =
                    "NOT_DETERMINABLE";

            if (
                modelTiers.length ===
                1 &&
                expectedTier !==
                "UNKNOWN"
            ) {

                rightModelUsed =
                    modelTiers[0] ===
                    expectedTier
                        ? "YES"
                        : "NO";
            }

            /*
             * Difficulty-based model change is only declared
             * when an observed change moves away from the
             * expected tier associated with the document's
             * observed readability.
             *
             * A mere model change is therefore not automatically
             * labelled as difficulty-driven.
             */
            let difficultyBasedModelChange:
                AuditModelComparisonStatus =
                    "NOT_DETERMINABLE";

            if (
                modelChanges.length ===
                0
            ) {

                difficultyBasedModelChange =
                    "NO";

            } else if (
                expectedTier !==
                "UNKNOWN"
            ) {

                const hasExpectedTierChange =
                    modelChanges.some(
                        change =>
                            change.toTier ===
                            expectedTier
                    );

                const hasDifficultyRelatedChange =
                    modelChanges.some(
                        change =>
                            change.fromTier !==
                            expectedTier &&
                            change.toTier ===
                            expectedTier
                    );

                if (
                    hasDifficultyRelatedChange ||
                    hasExpectedTierChange
                ) {

                    difficultyBasedModelChange =
                        "YES";

                } else {

                    difficultyBasedModelChange =
                        "NOT_DETERMINABLE";
                }
            }

            return {

                documentNumber:
                    document.documentNumber,

                documentType:
                    document.documentType,

                readability:
                    document.readability,

                pageCount:
                    document.pageCount,

                expectedTier,

                modelTiers,

                actualModels,

                rightModelUsed,

                difficultyBasedModelChange,

                modelChanges,
            };
        }
    );
}