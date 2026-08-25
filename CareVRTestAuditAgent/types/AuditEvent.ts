/**
 * CareVRTestAuditAgent
 *
 * Audit Event Contract
 *
 * Purpose:
 * Defines the small set of runtime observations emitted by
 * CareVR / Strataparse for the parallel Audit Agent.
 *
 * Important:
 * These events are observations only.
 * The Audit Agent must never control, retry, reroute or block
 * the product processing flow.
 */

export type AuditEvent =
    | AuditRunStartedEvent
    | AuditDocumentReceivedEvent
    | AuditDocumentProcessingStartedEvent
    | AuditPageStartedEvent
    | AuditRequestSentEvent
    | AuditRequestCompletedEvent
    | AuditRequestFailedEvent
    | AuditPageCompletedEvent
    | AuditDocumentCompletedEvent
    | AuditDocumentFailedEvent
    | AuditUiResultDisplayedEvent
    | AuditRunCompletedEvent;

export interface AuditRunStartedEvent {
    type: "RUN_STARTED";

    runId: string;

    module: string;

    startedAt: string;

    documentCount: number;
}

export interface AuditDocumentReceivedEvent {
    type: "DOCUMENT_RECEIVED";

    runId: string;

    documentId: string;

    module: string;

    fileName: string;

    documentType:
        | "SINGLE_PAGE"
        | "MULTI_PAGE"
        | "IMAGE";

    pageCount: number;

    receivedAt: string;
}

export interface AuditDocumentProcessingStartedEvent {
    type: "DOCUMENT_PROCESSING_STARTED";

    runId: string;

    documentId: string;

    module: string;

    startedAt: string;
}

export interface AuditPageStartedEvent {
    type: "PAGE_STARTED";

    runId: string;

    documentId: string;

    pageId: string;

    pageNumber: number;

    startedAt: string;
}

export interface AuditRequestSentEvent {
    type: "REQUEST_SENT";

    runId: string;

    requestId: string;

    documentId: string;

    pageId: string | null;

    module: string;

    expectedModel: string;

    actualModel: string;

    promptConfigId: string;

    requestStartedAt: string;
}

export interface AuditRequestCompletedEvent {
    type: "REQUEST_COMPLETED";

    runId: string;

    requestId: string;

    documentId: string;

    pageId: string | null;

    module: string;

    actualModel: string;

    responseReceivedAt: string;

    durationMs: number;

    inputTokens: number;

    outputTokens: number;

    totalTokens: number;
}

export interface AuditRequestFailedEvent {
    type: "REQUEST_FAILED";

    runId: string;

    requestId: string;

    documentId: string;

    pageId: string | null;

    module: string;

    actualModel: string;

    responseReceivedAt: string | null;

    durationMs: number | null;

    status:
        | "FAILED"
        | "TIMEOUT"
        | "INTERRUPTED";
}

export interface AuditPageCompletedEvent {
    type: "PAGE_COMPLETED";

    runId: string;

    documentId: string;

    pageId: string;

    pageNumber: number;

    completedAt: string;

    durationMs: number;

    requestCount: number;

    appendedToDocumentResult: boolean;
}

export interface AuditDocumentCompletedEvent {
    type: "DOCUMENT_COMPLETED";

    runId: string;

    documentId: string;

    completedAt: string;

    totalDurationMs: number;

    uiDisplayed: boolean;

    uiDisplayedAt: string | null;
}

export interface AuditDocumentFailedEvent {
    type: "DOCUMENT_FAILED";

    runId: string;

    documentId: string;

    completedAt: string;

    totalDurationMs: number | null;
}

export interface AuditUiResultDisplayedEvent {
    type: "UI_RESULT_DISPLAYED";

    runId: string;

    documentId: string;

    displayedAt: string;
}

export interface AuditRunCompletedEvent {
    type: "RUN_COMPLETED";

    runId: string;

    completedAt: string;

    totalDurationMs: number;

    finalUiDisplayed: boolean;

    finalUiDisplayedAt: string | null;
}