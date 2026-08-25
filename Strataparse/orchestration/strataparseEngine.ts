import type {
    StrataparseRequest,
} from "../types/strataparseTypes";

import type {
    StrataparseIntake,
} from "../ingestion/documentTypes";

import {
    createStrataparseIntake,
} from "../ingestion/documentIngestion";

/**
 * Universal entry point into Strataparse.
 *
 * Every integrated product enters the intelligence engine
 * through this request.
 *
 * This stage validates the request and creates the internal
 * Strataparse intake. It does not perform extraction.
 */
export async function StrataparseAnalyse(
    request: StrataparseRequest
): Promise<StrataparseIntake> {
    if (!request.integrationKey.trim()) {
        throw new Error(
            "Strataparse requires an integration key."
        );
    }

    if (!request.integrationKeyActive) {
        throw new Error(
            "Strataparse integration is inactive."
        );
    }

    if (!request.configuration.expectedOutput.length) {
        throw new Error(
            "Strataparse requires configuration details."
        );
    }

    if (request.documents.length === 0) {
        throw new Error(
            "Strataparse requires at least one document."
        );
    }

    if (request.documents.length > 5) {
        throw new Error(
            "Strataparse accepts a maximum of 5 documents."
        );
    }

    /*
     * --------------------------------------------------------
     * PER-DOCUMENT FILE SIZE VALIDATION
     * --------------------------------------------------------
     *
     * Strataparse accepts a maximum of 5 MB per document.
     *
     * This validation happens before ingestion, page counting,
     * classification, or any future AI processing.
     *
     * 5 MB = 5 × 1024 × 1024 bytes.
     */
    const MAX_FILE_SIZE_BYTES =
        5 * 1024 * 1024;

    for (
        let index = 0;
        index < request.documents.length;
        index += 1
    ) {
        const file =
            request.documents[index].file;

        if (
            file.size >
            MAX_FILE_SIZE_BYTES
        ) {
            throw new Error(
                `Strataparse document ${index + 1} ` +
                `"${file.name}" exceeds the maximum ` +
                `file size of 5 MB.`
            );
        }
    }


    return createStrataparseIntake(request);
}