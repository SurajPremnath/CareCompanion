/**
 * CareVRTestAuditAgent
 *
 * Audit cost calculation.
 *
 * Calculates observed model/API cost from:
 * - observed token usage
 * - explicitly supplied model pricing
 *
 * IMPORTANT:
 *
 * The audit agent:
 * - does not select a model
 * - does not select pricing
 * - does not modify production processing
 * - does not estimate unavailable usage
 *
 * Pricing must be explicitly supplied by the caller.
 */

export interface AuditModelPricing {

    model:
        string;

    inputCostPer1K:
        number;

    outputCostPer1K:
        number;

    currency?:
        string;
}


export interface AuditCost {

    inputCost:
        number;

    outputCost:
        number;

    totalCost:
        number;

    currency:
        string;
}


/**
 * Creates a zero-cost summary.
 */
export function createAuditCost(
    currency:
        string = "USD"
):
    AuditCost {

    return {

        inputCost:
            0,

        outputCost:
            0,

        totalCost:
            0,

        currency,
    };
}


/**
 * Calculates the observed cost of one request.
 *
 * Token values come from observed usage.
 * Pricing comes from the explicitly supplied pricing record.
 */
export function calculateAuditRequestCost(
    input: {
        inputTokens:
            number;

        outputTokens:
            number;

        pricing:
            AuditModelPricing;
    }
):
    AuditCost {

    validateTokenCount(
        input.inputTokens,
        "inputTokens"
    );

    validateTokenCount(
        input.outputTokens,
        "outputTokens"
    );

    validatePricing(
        input.pricing
    );

    const inputCost =
        (
            input.inputTokens /
            1000
        ) *
        input.pricing.inputCostPer1K;

    const outputCost =
        (
            input.outputTokens /
            1000
        ) *
        input.pricing.outputCostPer1K;

    const currency =
        input.pricing.currency ??
        "USD";

    return {

        inputCost:
            roundCost(
                inputCost
            ),

        outputCost:
            roundCost(
                outputCost
            ),

        totalCost:
            roundCost(
                inputCost +
                outputCost
            ),

        currency,
    };
}


/**
 * Adds two audit cost summaries.
 *
 * Both summaries must use the same currency.
 */
export function mergeAuditCost(
    current:
        AuditCost,
    additional:
        AuditCost
):
    AuditCost {

    if (
        current.currency !==
        additional.currency
    ) {
        throw new Error(
            "Cannot merge audit costs with different currencies."
        );
    }

    return {

        inputCost:
            roundCost(
                current.inputCost +
                additional.inputCost
            ),

        outputCost:
            roundCost(
                current.outputCost +
                additional.outputCost
            ),

        totalCost:
            roundCost(
                current.totalCost +
                additional.totalCost
            ),

        currency:
            current.currency,
    };
}


/**
 * Validates observed token usage.
 *
 * Invalid token counts are rejected rather than silently
 * producing misleading financial telemetry.
 */
function validateTokenCount(
    value:
        number,
    field:
        string
):
    void {

    if (
        !Number.isFinite(
            value
        ) ||
        value < 0
    ) {
        throw new Error(
            `${field} must be a finite non-negative number.`
        );
    }
}


/**
 * Validates explicitly supplied model pricing.
 */
function validatePricing(
    pricing:
        AuditModelPricing
):
    void {

    if (
        !pricing.model.trim()
    ) {
        throw new Error(
            "Audit model pricing must identify a model."
        );
    }

    if (
        !Number.isFinite(
            pricing.inputCostPer1K
        ) ||
        pricing.inputCostPer1K < 0
    ) {
        throw new Error(
            "inputCostPer1K must be a finite non-negative number."
        );
    }

    if (
        !Number.isFinite(
            pricing.outputCostPer1K
        ) ||
        pricing.outputCostPer1K < 0
    ) {
        throw new Error(
            "outputCostPer1K must be a finite non-negative number."
        );
    }
}


/**
 * Keeps financial telemetry at six decimal places.
 */
function roundCost(
    value:
        number
):
    number {

    return Number(
        value.toFixed(
            6
        )
    );
}