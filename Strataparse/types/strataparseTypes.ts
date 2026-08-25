/**
 * Universal request received by Strataparse from an integrated product.
 *
 * The product supplies its registered integration identity,
 * its saved extraction/display configuration, and the documents
 * supplied by the user.
 */
export interface StrataparseRequest {
    readonly integrationKey: string;
    readonly integrationKeyActive: boolean;

    readonly configuration: StrataparseRequestConfiguration;

    readonly documents: readonly StrataparseDocumentInput[];
}

export interface StrataparseRequestConfiguration {
    readonly expectedOutput: readonly string[];
}

export interface StrataparseDocumentInput {
    readonly file: File;
}