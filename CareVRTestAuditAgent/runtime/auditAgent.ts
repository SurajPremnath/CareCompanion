/**
 * CareVRTestAuditAgent
 *
 * PASSIVE AUDIT AGENT
 *
 * Manages one independent audit run.
 *
 * The agent observes Strataparse through the existing
 * observeStrataparse() boundary.
 *
 * It never controls, modifies, retries, blocks, or
 * interrupts Strataparse processing.
 */

import {
    createAuditRun,
    completeAuditRun,
    failAuditRun,
    interruptAuditRun,
    recordAuditTokens,
    recordAuditCost,
    recordAuditFailure,
} from "./auditRun";

import type {
    AuditRunState,
} from "./auditRun";

import {
    observeStrataparse,
    getStrataparseAuditEvents,
    clearStrataparseAuditEvents,
} from "./auditObserver";

import {
    saveAuditRun,
    getStoredAuditRun,
    clearStoredAuditRun,
} from "./auditStore";


export interface AuditAgent {

    run:
        AuditRunState;

    active:
        boolean;
}


export interface AuditSnapshot {

    run:
        AuditRunState;

    events:
        ReturnType<
            typeof getStrataparseAuditEvents
        >;
}

/**
 * Starts an independent audit run.
 *
 * This does NOT start Strataparse.
 * The production flow remains responsible for starting
 * document processing.
 */
export function startAuditAgent(
    input: {
        runId: string;
        module: string;
        documentCount: number;
    }
): AuditAgent {

    const run =
        createAuditRun(
            input
        );

saveAuditRun(
    run
);

    /*
     * Inform the passive observer that an audit run exists.
     */
    observeStrataparse({
        type:
            "RUN_STARTED",

        runId:
            input.runId,

        timestamp:
            Date.now(),
    });

    return {
        run,
        active:
            true,
    };
}


/**
 * Sends an existing Strataparse audit event to the
 * passive observer.
 *
 * The production processing path does not wait for this.
 */
export function recordAuditEvent(
    event:
        Parameters<
            typeof observeStrataparse
        >[0]
): void {

    observeStrataparse(
        event
    );
}

/**
 * Marks the independent audit run as successfully completed.
 *
 * This does not complete or control Strataparse.
 * It only closes the audit record.
 */
export function completeAuditAgent(
    agent:
        AuditAgent
): AuditAgent {

    const updatedRun =
        completeAuditRun(
            agent.run
        );

    saveAuditRun(
        updatedRun
    );

    return {
        ...agent,

        active:
            false,

        run:
            updatedRun,
    };
}

export function recordAuditTokensUsed(
    agent: AuditAgent,
    inputTokens: number = 0,
    outputTokens: number = 0
): AuditAgent {

    const updatedRun =
        recordAuditTokens(
            agent.run,
            inputTokens,
            outputTokens
        );

    saveAuditRun(
        updatedRun
    );

    return {
        ...agent,

        run:
            updatedRun,
    };
}

export function recordAuditCostUsed(
    agent: AuditAgent,
    cost: number = 0
): AuditAgent {

    const updatedRun =
        recordAuditCost(
            agent.run,
            cost
        );

    saveAuditRun(
        updatedRun
    );

    return {
        ...agent,

        run:
            updatedRun,
    };
}

/**
 * Records an observed failure against the independent
 * audit run.
 *
 * This does not fail Care Journey processing.
 */
export function recordAuditFailureObserved(
    agent: AuditAgent
): AuditAgent {

    const updatedRun =
        recordAuditFailure(
            agent.run
        );

    saveAuditRun(
        updatedRun
    );

    return {
        ...agent,

        run:
            updatedRun,
    };
}

/**
 * Returns the current audit state.
 */
export function getAuditRun(
    agent:
        AuditAgent
): AuditRunState {

    return agent.run;
}

/**
 * Returns the latest persisted state of an audit run.
 *
 * This reads only from the independent audit store.
 * It does not interact with or influence CareVR processing.
 */
export function getPersistedAuditRun(
    runId:
        string
): AuditRunState | undefined {

    return getStoredAuditRun(
        runId
    );
}

/**
 * Completes an independent audit run.
 *
 * This changes only the audit state.
 * It does not start, stop, wait for, or modify
 * CareVR or Strataparse processing.
 */
export function completePersistedAuditRun(
    runId:
        string
):
    AuditRunState | undefined {

    const run =
        getPersistedAuditRun(
            runId
        );

    if (!run) {
        return undefined;
    }

    const completedRun =
        completeAuditRun(
            run
        );

    saveAuditRun(
        completedRun
    );

    return completedRun;
}

/**
 * Returns the complete independent audit snapshot.
 *
 * This combines the persisted audit run state with the
 * observations collected for that run.
 *
 * It is read-only and does not influence CareVR processing.
 */
export function getAuditSnapshot(
    runId:
        string
):
    AuditSnapshot | undefined {

    const run =
        getPersistedAuditRun(
            runId
        );

    if (!run) {
        return undefined;
    }

    return {
        run,

        events:
            getStrataparseAuditEvents(
                runId
            ),
    };
}

/**
 * Clears all runtime data belonging to one audit run.
 *
 * This removes only independent audit data.
 * It does not affect CareVR or Strataparse processing.
 */
export function clearAuditRun(
    runId:
        string
): void {

    clearStoredAuditRun(
        runId
    );

    clearStrataparseAuditEvents(
        runId
    );
}