
/**
 * A document identified by Strataparse during intake.
 *
 * This contains document metadata and the document category
 * identified during the first intelligence step.
 *
 * No information extraction or clinical interpretation happens
 * at this stage.
 */

import type {
    StrataparseDocumentReadability,
} from "./documentClassifier";

export interface StrataparseDocument {
    readonly documentNumber: number;
    readonly file: File;
    readonly fileName: string;
    readonly fileType: string;
    readonly pageCount: number;
    readonly documentType: StrataparseDocumentType;
    readonly readability: StrataparseDocumentReadability;
}

/**
 * Document categories currently understood by Strataparse.
 *
 * This is intentionally limited to document identification.
 * Extraction and interpretation are handled later.
 */
export type StrataparseDocumentType =
    | "PRESCRIPTION"
    | "DOCTOR_NOTES"
    | "LAB_REPORT"
    | "DIAGNOSTIC_REPORT"
    | "VITALS"
    | "OTHER";


/**
 * Internal intake created by Strataparse after analysing
 * the incoming product request.
 */
export interface StrataparseIntake {
    readonly integrationKey: string;

    readonly configuration: {
        readonly expectedOutput: readonly string[];
    };

    readonly documents: readonly StrataparseDocument[];

    readonly documentCount: number;
    readonly totalPageCount: number;

    readonly status: "READY_FOR_PROCESSING";
}

/**
 * Internal intake created by Strataparse after analysing
 * the incoming product request.
 *
 * This becomes the standard input to the Strataparse
 * processing engine.
 */
export interface StrataparseIntake {
    readonly integrationKey: string;

    readonly configuration: {
        readonly expectedOutput: readonly string[];
    };

    readonly documents: readonly StrataparseDocument[];

    readonly documentCount: number;
    readonly totalPageCount: number;

    readonly status: "READY_FOR_PROCESSING";
}