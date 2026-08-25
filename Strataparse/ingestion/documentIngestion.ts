import { PDFDocument } from "pdf-lib";

import type {
    StrataparseRequest,
} from "../types/strataparseTypes";

import type {
    StrataparseDocument,
    StrataparseIntake,
} from "./documentTypes";

import {
    classifyStrataparseDocument,
} from "./documentClassifier";

/**
 * Converts the documents received from an integrated product
 * into the standard Strataparse intake structure.
 *
 * This stage only establishes document metadata.
 * It does not extract, analyse, interpret, or save document content.
 */
export async function createStrataparseIntake(
    request: StrataparseRequest
): Promise<StrataparseIntake> {
    const documents: StrataparseDocument[] = [];

    for (let index = 0; index < request.documents.length; index += 1) {
        const file = request.documents[index].file;

        let pageCount = 1;

        if (file.type === "application/pdf") {
            const bytes = await file.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);

            pageCount = pdf.getPageCount();
        }

const classification =
    await classifyStrataparseDocument(
        file
    );

documents.push({
    documentNumber: index + 1,
    file,
    fileName: file.name,
    fileType: file.type,
    pageCount,
    documentType:
        classification.documentType,
    readability:
        classification.readability,
});
    }

    const totalPageCount = documents.reduce(
        (total, document) => total + document.pageCount,
        0
    );

    return Object.freeze({
        integrationKey: request.integrationKey,

        configuration: Object.freeze({
            expectedOutput: Object.freeze([
                ...request.configuration.expectedOutput,
            ]),
        }),

        documents: Object.freeze(documents),

        documentCount: documents.length,
        totalPageCount,

        status: "READY_FOR_PROCESSING",
    });
}