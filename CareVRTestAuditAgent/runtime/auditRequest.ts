/**
 * CareVRTestAuditAgent
 *
 * Audit request evidence.
 *
 * Represents one observed intelligence/API request.
 *
 * IMPORTANT:
 *
 * The audit agent:
 * - does not create production requests
 * - does not send production requests
 * - does not retry production requests
 * - does not control production processing
 *
 * It only records evidence supplied by the observed
 * intelligence flow.
 */

export type AuditRequestStatus =
    | "STARTED"
    | "COMPLETED"
    | "FAILED";


export interface AuditRequest {

    requestId:
        string;

    runId:
        string;

    documentNumber?:
        number;

    pageNumber?:
        number;

    modelTier?:
        string;

    modelName?:
        string;

    provider?:
        string;

    status:
        AuditRequestStatus;

    startedAt:
        number;

    completedAt?:
        number;

    durationMs?:
        number;

    inputTokens?:
        number;

    outputTokens?:
        number;

    totalTokens?:
        number;

    error?:
        string;
}


/**
 * Creates an audit record for an observed request.
 *
 * The request must already exist in the production
 * intelligence flow. This function only creates the
 * corresponding audit evidence record.
 */
export function startAuditRequest(
    input: {
        requestId:
            string;

        runId:
            string;

        documentNumber?:
            number;

        pageNumber?:
            number;

        modelTier?:
            string;

        modelName?:
            string;

        provider?:
            string;

        startedAt:
            number;
    }
):
    AuditRequest {

    validateRequiredIdentifier(
        input.requestId,
        "requestId"
    );

    validateRequiredIdentifier(
        input.runId,
        "runId"
    );

    validateTimestamp(
        input.startedAt,
        "startedAt"
    );

    validateOptionalPositiveInteger(
        input.documentNumber,
        "documentNumber"
    );

    validateOptionalPositiveInteger(
        input.pageNumber,
        "pageNumber"
    );

    return {

        requestId:
            input.requestId,

        runId:
            input.runId,

        documentNumber:
            input.documentNumber,

        pageNumber:
            input.pageNumber,

        modelTier:
            input.modelTier,

        modelName:
            input.modelName,

        provider:
            input.provider,

        status:
            "STARTED",

        startedAt:
            input.startedAt,
    };
}


/**
 * Marks an observed request as completed.
 *
 * Duration is calculated from the observed timestamps.
 *
 * Token values remain optional because the production
 * provider may not expose usage information.
 */
export function completeAuditRequest(
    request:
        AuditRequest,
    input: {
        completedAt:
            number;

        inputTokens?:
            number;

        outputTokens?:
            number;

        totalTokens?:
            number;
    }
):
    AuditRequest {

    validateTimestamp(
        input.completedAt,
        "completedAt"
    );

    if (
        input.completedAt <
        request.startedAt
    ) {
        throw new Error(
            "completedAt cannot be earlier than startedAt."
        );
    }

    validateOptionalTokenCount(
        input.inputTokens,
        "inputTokens"
    );

    validateOptionalTokenCount(
        input.outputTokens,
        "outputTokens"
    );

    validateOptionalTokenCount(
        input.totalTokens,
        "totalTokens"
    );

    const durationMs =
        input.completedAt -
        request.startedAt;

    const totalTokens =
        input.totalTokens ??
        calculateObservedTotalTokens(
            input.inputTokens,
            input.outputTokens
        );

    return {

        ...request,

        status:
            "COMPLETED",

        completedAt:
            input.completedAt,

        durationMs,

        inputTokens:
            input.inputTokens,

        outputTokens:
            input.outputTokens,

        totalTokens,
    };
}


/**
 * Marks an observed request as failed.
 *
 * Failure evidence is recorded without changing the
 * underlying production request.
 */
export function failAuditRequest(
    request:
        AuditRequest,
    input: {
        completedAt:
            number;

        error:
            string;
    }
):
    AuditRequest {

    validateTimestamp(
        input.completedAt,
        "completedAt"
    );

    if (
        input.completedAt <
        request.startedAt
    ) {
        throw new Error(
            "completedAt cannot be earlier than startedAt."
        );
    }

    if (
        !input.error.trim()
    ) {
        throw new Error(
            "A failed audit request must contain an error."
        );
    }

    const durationMs =
        input.completedAt -
        request.startedAt;

    return {

        ...request,

        status:
            "FAILED",

        completedAt:
            input.completedAt,

        durationMs,

        error:
            input.error,
    };
}


/**
 * Calculates total tokens only from observed input and
 * output token values.
 *
 * If neither value is available, total usage remains
 * undefined rather than being represented as invented data.
 */
function calculateObservedTotalTokens(
    inputTokens:
        number |
        undefined,
    outputTokens:
        number |
        undefined
):
    number |
    undefined {

    if (
        inputTokens ===
        undefined &&
        outputTokens ===
        undefined
    ) {
        return undefined;
    }

    return (
        (inputTokens ?? 0) +
        (outputTokens ?? 0)
    );
}


/**
 * Validates required string identifiers.
 */
function validateRequiredIdentifier(
    value:
        string,
    field:
        string
):
    void {

    if (
        !value.trim()
    ) {
        throw new Error(
            `${field} is required.`
        );
    }
}


/**
 * Validates timestamps represented as milliseconds
 * since the Unix epoch.
 */
function validateTimestamp(
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
            `${field} must be a finite non-negative timestamp.`
        );
    }
}


/**
 * Validates optional document/page identifiers.
 */
function validateOptionalPositiveInteger(
    value:
        number |
        undefined,
    field:
        string
):
    void {

    if (
        value ===
        undefined
    ) {
        return;
    }

    if (
        !Number.isInteger(
            value
        ) ||
        value < 1
    ) {
        throw new Error(
            `${field} must be a positive integer.`
        );
    }
}


/**
 * Validates optional token usage.
 */
function validateOptionalTokenCount(
    value:
        number |
        undefined,
    field:
        string
):
    void {

    if (
        value ===
        undefined
    ) {
        return;
    }

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