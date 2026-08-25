/**
 * CareVRTestAuditAgent
 *
 * Audit result evidence.
 *
 * Represents the production result as observed by the
 * independent audit agent.
 *
 * IMPORTANT:
 *
 * This module:
 * - records observed result evidence
 * - does not generate extraction results
 * - does not modify production results
 * - does not evaluate clinical correctness
 * - does not invoke AI models
 * - does not control production processing
 *
 * The audit agent observes what actually happened.
 */

export interface AuditDocumentResult {

    documentNumber:
        number;

    documentType?:
        string;

    result:
        Record<string, unknown>;

    rendered:
        boolean;

    renderedAt?:
        number;
}


export interface AuditResultEvidence {

    runId:
        string;

    documents:
        AuditDocumentResult[];

    rendered:
        boolean;

    renderedAt?:
        number;
}


/**
 * Creates an empty result-evidence container
 * for a new audit run.
 */
export function createAuditResultEvidence(
    runId:
        string
):
    AuditResultEvidence {

    if (
        !runId.trim()
    ) {
        throw new Error(
            "runId is required."
        );
    }

    return {

        runId,

        documents: [],

        rendered:
            false,
    };
}


/**
 * Records one observed document result.
 *
 * The result is copied into the audit evidence so that
 * later audit aggregation operates on a stable snapshot.
 *
 * The audit agent does not alter the supplied result.
 */
export function recordAuditDocumentResult(
    evidence:
        AuditResultEvidence,

    document:
        AuditDocumentResult
):
    AuditResultEvidence {

    return {

        ...evidence,

        documents: [
            ...evidence.documents,

            {
                ...document,

                result:
                    {
                        ...document.result,
                    },
            },
        ],
    };
}


/**
 * Marks the observed production result as rendered.
 *
 * Rendering is an important audit boundary because the
 * audit should distinguish:
 *
 * extracted
 *     from
 * actually presented to the user.
 */
export function markAuditResultRendered(
    evidence:
        AuditResultEvidence,

    timestamp:
        number
):
    AuditResultEvidence {

    if (
        !Number.isFinite(
            timestamp
        ) ||
        timestamp < 0
    ) {
        throw new Error(
            "timestamp must be a finite non-negative number."
        );
    }

    return {

        ...evidence,

        rendered:
            true,

        renderedAt:
            timestamp,
    };
}