/**
 * CareVR Test Audit Agent
 *
 * Maintains the state of one audit run.
 *
 * The audit run is passive. It records observations and
 * never controls or interrupts CareVR or Strataparse.
 */

export type AuditRunStatus =
    | "ACTIVE"
    | "COMPLETED"
    | "FAILED"
    | "INTERRUPTED";

export interface AuditRunState {
    runId: string;
    module: string;
    status: AuditRunStatus;
    startedAt: string;
    endedAt?: string;

    documentCount: number;
    completedDocuments: number;
    failedDocuments: number;

    requestCount: number;
    completedRequests: number;
    failedRequests: number;

    inputTokens: number;
    outputTokens: number;
    totalTokens: number;

    totalCost: number;

    metadata: Record<string, unknown>;
}

export function createAuditRun(
    input: {
        runId: string;
        module: string;
        documentCount: number;
    }
): AuditRunState {

    return {
        runId: input.runId,
        module: input.module,
        status: "ACTIVE",
        startedAt: new Date().toISOString(),

        documentCount: input.documentCount,
        completedDocuments: 0,
        failedDocuments: 0,

        requestCount: 0,
        completedRequests: 0,
        failedRequests: 0,

        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,

        totalCost: 0,

        metadata: {},
    };
}

export function completeAuditRun(
    run: AuditRunState
): AuditRunState {

    return {
        ...run,
        status: "COMPLETED",
        endedAt: new Date().toISOString(),
    };
}

export function failAuditRun(
    run: AuditRunState
): AuditRunState {

    return {
        ...run,
        status: "FAILED",
        endedAt: new Date().toISOString(),
    };
}


export function interruptAuditRun(
    run: AuditRunState
): AuditRunState {

    return {
        ...run,
        status: "INTERRUPTED",
        endedAt: new Date().toISOString(),
    };
}

export function recordAuditTokens(
    run: AuditRunState,
    inputTokens: number = 0,
    outputTokens: number = 0
): AuditRunState {

    const totalTokens =
        inputTokens + outputTokens;

    return {
        ...run,

        inputTokens:
            run.inputTokens + inputTokens,

        outputTokens:
            run.outputTokens + outputTokens,

        totalTokens:
            run.totalTokens + totalTokens,
    };
}

export function recordAuditCost(
    run: AuditRunState,
    cost: number = 0
): AuditRunState {

    return {
        ...run,

        totalCost:
            run.totalCost + cost,
    };
}

/**
 * Records an observed processing failure against the
 * independent audit run.
 *
 * This changes only the audit record.
 * It never throws the original error and never controls
 * the Care Journey processing flow.
 */
export function recordAuditFailure(
    run: AuditRunState
): AuditRunState {

    return {
        ...run,

        failedRequests:
            run.failedRequests + 1,
    };
}