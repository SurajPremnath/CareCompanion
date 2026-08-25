/**
 * Document classifications understood by Strataparse.
 *
 * IMAGE is used for Record Health vital-reading images.
 * The remaining classifications are primarily used by Care Journey.
 */
export type StrataparseDocumentClassification =
    | "IMAGE"
    | "PRESCRIPTION"
    | "DOCTOR_NOTES"
    | "LAB_REPORT"
    | "DIAGNOSTIC_REPORT"
    | "OTHER";

export type StrataparseClassificationResult = {
    classification:
        StrataparseDocumentClassification;
};