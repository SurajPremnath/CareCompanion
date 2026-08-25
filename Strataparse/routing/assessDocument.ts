import type {
    StrataparseDocumentReadability,
} from "../ingestion/documentClassifier";

type AssessDocumentInput = {
    readability:
        StrataparseDocumentReadability;

    pageCount:
        number;
};


type DocumentAssessment = {
    readability:
        StrataparseDocumentReadability;

    multiPage:
        boolean;

    modelTier:
        StrataparseModelTier;
};


export type StrataparseModelTier =
    | "SOL"
    | "LUNA"
    | "TERRA";


/**
 * Determines the processing tier for one document.
 *
 * Routing rules:
 *
 * 1. Messy / handwritten / difficult-to-read documents use SOL.
 * 2. Clean / straightforward documents use LUNA.
 * 3. Uncertain readability uses TERRA as the fallback tier.
 *
 * Page count is retained as document metadata but does not
 * override the readability-based model routing decision.
 *
 * This function does not perform extraction and does not know
 * the actual OpenAI model name. The model name is resolved later
 * from the Strataparse environment configuration.
 */
export function assessDocument(
    input: AssessDocumentInput
): DocumentAssessment {

    const multiPage =
        input.pageCount > 1;

    let modelTier:
        StrataparseModelTier;

    if (
        input.readability === "MESSY"
    ) {

        modelTier =
            "SOL";

    } else if (
        input.readability === "CLEAN"
    ) {

        modelTier =
            "LUNA";

    } else {

        modelTier =
            "TERRA";
    }

    return {
        readability:
            input.readability,

        multiPage,

        modelTier,
    };
}