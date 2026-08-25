/**
 * CareVRTestAuditAgent
 *
 * Audit usage aggregation.
 *
 * Aggregates usage evidence supplied by observed requests.
 *
 * IMPORTANT:
 *
 * This module:
 * - does not invoke models
 * - does not estimate token usage
 * - does not modify production requests
 * - does not control production processing
 *
 * Token values are included only when they are supplied
 * by observed request evidence.
 */

export type AuditUsageRequestStatus =
    | "STARTED"
    | "COMPLETED"
    | "FAILED";


export interface AuditUsage {

    requestCount:
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
}


/**
 * Creates an empty usage summary.
 */
export function createAuditUsage():
    AuditUsage {

    return {
        requestCount:
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
    };
}


/**
 * Records usage from one observed request.
 *
 * Token values are accepted only when supplied as
 * finite, non-negative numbers.
 *
 * If totalTokens is not supplied, it is derived from
 * the supplied input/output token values.
 */
export function recordAuditUsage(
    usage:
        AuditUsage,
    input: {
        status:
            AuditUsageRequestStatus;

        inputTokens?:
            number;

        outputTokens?:
            number;

        totalTokens?:
            number;
    }
):
    AuditUsage {

    const inputTokens =
        normalizeTokenValue(
            input.inputTokens
        );

    const outputTokens =
        normalizeTokenValue(
            input.outputTokens
        );

    const suppliedTotalTokens =
        normalizeTokenValue(
            input.totalTokens
        );

    const totalTokens =
        input.totalTokens !==
        undefined
            ? suppliedTotalTokens
            : (
                inputTokens +
                outputTokens
            );

    return {

        requestCount:
            usage.requestCount +
            1,

        completedRequests:
            usage.completedRequests +
            (
                input.status ===
                "COMPLETED"
                    ? 1
                    : 0
            ),

        failedRequests:
            usage.failedRequests +
            (
                input.status ===
                "FAILED"
                    ? 1
                    : 0
            ),

        inputTokens:
            usage.inputTokens +
            inputTokens,

        outputTokens:
            usage.outputTokens +
            outputTokens,

        totalTokens:
            usage.totalTokens +
            totalTokens,
    };
}


/**
 * Merges two independently collected usage summaries.
 *
 * This performs aggregation only; it does not recalculate
 * or reinterpret the underlying usage evidence.
 */
export function mergeAuditUsage(
    current:
        AuditUsage,
    additional:
        AuditUsage
):
    AuditUsage {

    return {

        requestCount:
            current.requestCount +
            additional.requestCount,

        completedRequests:
            current.completedRequests +
            additional.completedRequests,

        failedRequests:
            current.failedRequests +
            additional.failedRequests,

        inputTokens:
            current.inputTokens +
            additional.inputTokens,

        outputTokens:
            current.outputTokens +
            additional.outputTokens,

        totalTokens:
            current.totalTokens +
            additional.totalTokens,
    };
}


/**
 * Normalizes an optional token value.
 *
 * Missing, invalid, negative, or non-finite values are
 * treated as unavailable usage rather than invented data.
 */
function normalizeTokenValue(
    value:
        number |
        undefined
):
    number {

    if (
        value ===
        undefined
    ) {
        return 0;
    }

    if (
        !Number.isFinite(
            value
        )
    ) {
        return 0;
    }

    if (
        value <
        0
    ) {
        return 0;
    }

    return value;
}