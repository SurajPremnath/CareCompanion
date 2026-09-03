/**
 * CareVRTestAuditAgent
 *
 * PASSIVE AUDIT OBSERVER
 *
 * This module observes Strataparse execution.
 *
 * IMPORTANT:
 *
 * - It never controls Strataparse.
 * - It never changes model routing.
 * - It never changes prompts.
 * - It never changes extraction results.
 * - It never blocks document processing.
 * - Audit failures must never become Strataparse failures.
 *
 * Strataparse remains the production intelligence engine.
 * This module is only its observer.
 */

export type StrataparseAuditEvent =
    | {
        type:
            "RUN_STARTED";

        runId:
            string;

        timestamp:
            number;
    }
    | {
        type:
            "DOCUMENT_STARTED";

        runId:
            string;

        documentNumber:
            number;

        pageCount:
            number;

        documentType:
            string;

        fileType:
            string;

        readability:
            string;

        timestamp:
            number;
    }
    | {
        type:
            "PAGE_STARTED";

        runId:
            string;

        documentNumber:
            number;

        pageNumber:
            number;

        modelTier:
            string;

        timestamp:
            number;
    }
    | {
        type:
            "PAGE_COMPLETED";

        runId:
            string;

        documentNumber:
            number;

        pageNumber:
            number;

modelTier:
    string;

/*
 * Actual GPT model identifier already resolved and used
 * by Strataparse for this page.
 */
model:
    string;

inputTokens?:
    number;

        outputTokens?:
            number;

        totalTokens?:
            number;

        durationMs?:
            number;

        timestamp:
            number;
    }
    | {
        type:
            "DOCUMENT_COMPLETED";

        runId:
            string;

        documentNumber:
            number;

        durationMs?:
            number;

        timestamp:
            number;
    }
    | {
        type:
            "RUN_COMPLETED";

        runId:
            string;

        documentCount:
            number;

        totalPageCount:
            number;

        durationMs?:
            number;

        timestamp:
            number;
    }
    | {
        type:
            "RESULT_RENDERED";

        runId:
            string;

        documentCount:
            number;

        timestamp:
            number;
    }
| {
    type:
        "CONFIGURATION_CAPTURED";

    runId:
        string;

    configuration:
        Record<string, unknown>;

    timestamp:
        number;
    }
| {
    type:
        "EVALUATION_RECORDED";

    runId:
        string;

    documentNumber?:
        number;

    accuracyScore?:
        number;

    completenessScore?:
        number;

    accuracyStatus?:
        "NOT_EVALUATED" |
        "PASS" |
        "REVIEW" |
        "FAIL";

    completenessStatus?:
        "NOT_EVALUATED" |
        "PASS" |
        "REVIEW" |
        "FAIL";

    notes?:
        string[];

    timestamp:
        number;
}
    | {
        type:
            "PROMPT_CAPTURED";

        runId:
            string;

        prompt:
            string;

        timestamp:
            number;
    }
    | {
        type:
            "PROCESSING_FAILED";

        runId:
            string;

        documentNumber?:
            number;

        pageNumber?:
            number;

        error:
            string;

        timestamp:
            number;

};

/**
 * In-memory observation store.
 *
 * This is intentionally independent of Strataparse.
 *
 * The observer records evidence; it does not participate
 * in the production processing path.
 */
const auditEvents =
    new Map<
        string,
        StrataparseAuditEvent[]
    >();


/**
 * Sends an observation to the audit layer.
 *
 * This function intentionally returns immediately.
 *
 * Strataparse must NEVER await the audit system.
 *
 * The event is queued independently so audit recording
 * cannot block or alter production processing.
 */
export function observeStrataparse(
    event:
        StrataparseAuditEvent
): void {

    queueMicrotask(
        () => {

            try {

                recordAuditEvent(
                    event
                );

            } catch (
                error
            ) {

                /*
                 * Audit failures must never become
                 * Strataparse failures.
                 */
                console.error(
                    "CAERV TEST AUDIT OBSERVER ERROR:",
                    error
                );
            }

        }
    );
}


/**
 * Records one observation.
 *
 * This function is deliberately isolated from the
 * Strataparse execution path.
 */
function recordAuditEvent(
    event:
        StrataparseAuditEvent
): void {

    try {

        const existingEvents =
            auditEvents.get(
                event.runId
            ) ?? [];

        const enrichedEvent =
            enrichTiming(
                event
            );

        existingEvents.push(
            enrichedEvent
        );

        auditEvents.set(
            event.runId,
            existingEvents
        );

    } catch (
        error
    ) {

        /*
         * Audit failures are intentionally swallowed here.
         *
         * The Audit Agent must never become a reason for
         * Strataparse processing to fail.
         */
        console.error(
            "CAERV TEST AUDIT RECORDING ERROR:",
            error
        );
    }
}


function enrichTiming(
    event:
        StrataparseAuditEvent
):
    StrataparseAuditEvent {

    const events =
        auditEvents.get(
            event.runId
        ) ?? [];

    if (
        event.type === "PAGE_COMPLETED"
    ) {

        const started =
            [...events]
                .reverse()
                .find(
                    previous =>
                        previous.type === "PAGE_STARTED" &&
                        previous.documentNumber === event.documentNumber &&
                        previous.pageNumber === event.pageNumber
                );

        if (started) {

            return {
                ...event,

                durationMs:
                    Math.max(
                        0,
                        event.timestamp -
                        started.timestamp
                    ),
            };
        }
    }

    if (
        event.type === "DOCUMENT_COMPLETED"
    ) {

        const started =
            [...events]
                .reverse()
                .find(
                    previous =>
                        previous.type === "DOCUMENT_STARTED" &&
                        previous.documentNumber === event.documentNumber
                );

        if (started) {

            return {
                ...event,

                durationMs:
                    Math.max(
                        0,
                        event.timestamp -
                        started.timestamp
                    ),
            };
        }
    }

    return event;
}

/**
 * Returns all observations collected for a run.
 *
 * A copy is returned so callers cannot mutate the
 * observer's internal state.
 */
export function getStrataparseAuditEvents(
    runId:
        string
): StrataparseAuditEvent[] {

    return [
        ...(
            auditEvents.get(
                runId
            ) ?? []
        ),
    ];
}


/**
 * Removes a completed run from the in-memory observer.
 *
 * This is useful after the audit data has been persisted
 * or aggregated.
 */
export function clearStrataparseAuditEvents(
    runId:
        string
): void {

    auditEvents.delete(
        runId
    );
}