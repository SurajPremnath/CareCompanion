/**
 * CareVRTestAuditAgent
 *
 * Independent audit run storage.
 *
 * This store belongs exclusively to the test audit agent.
 * It never participates in CareVR or Strataparse processing.
 */

import type {
    AuditRunState,
} from "./auditRun";


const auditRuns =
    new Map<
        string,
        AuditRunState
    >();


/**
 * Stores the latest state of an audit run.
 *
 * The audit agent owns this state independently.
 */
export function saveAuditRun(
    run:
        AuditRunState
): void {

    auditRuns.set(
        run.runId,
        {
            ...run,

            metadata: {
                ...run.metadata,
            },
        }
    );
}


/**
 * Returns the stored audit run.
 *
 * A copy is returned so callers cannot mutate
 * the internal audit store.
 */
export function getStoredAuditRun(
    runId:
        string
):
    AuditRunState | undefined {

    const run =
        auditRuns.get(
            runId
        );

    if (!run) {
        return undefined;
    }

    return {
        ...run,

        metadata: {
            ...run.metadata,
        },
    };
}


/**
 * Removes an audit run from the independent store.
 */
export function clearStoredAuditRun(
    runId:
        string
): void {

    auditRuns.delete(
        runId
    );
}