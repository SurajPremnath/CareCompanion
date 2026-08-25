/**
 * Strataparse logical model roles.
 *
 * These names are intentionally independent of the actual OpenAI
 * model identifiers.
 *
 * SOL   = difficult / handwritten extraction
 * LUNA  = straightforward extraction
 * TERRA = accuracy escalation
 *
 * The underlying OpenAI model can therefore be upgraded later
 * without changing Strataparse application logic.
 */

export type StrataparseModel =
    | "SOL"
    | "LUNA"
    | "TERRA";

/**
 * Resolves the actual OpenAI model configured for a Strataparse
 * logical model role.
 *
 * The actual OpenAI model identifier must never be hardcoded here.
 */
export function resolveStrataparseModel(
    model: StrataparseModel
): string {

    switch (model) {

        case "SOL":
            return requireModelConfiguration(
                "STRATAPARSE_MODEL_SOL"
            );

        case "LUNA":
            return requireModelConfiguration(
                "STRATAPARSE_MODEL_LUNA"
            );

        case "TERRA":
            return requireModelConfiguration(
                "STRATAPARSE_MODEL_TERRA"
            );
    }
}

/**
 * Ensures every logical model has an explicit server-side
 * configuration.
 */
function requireModelConfiguration(
    environmentVariable:
        | "STRATAPARSE_MODEL_SOL"
        | "STRATAPARSE_MODEL_LUNA"
        | "STRATAPARSE_MODEL_TERRA"
): string {

    const model =
        process.env[environmentVariable];

    if (
        !model ||
        !model.trim()
    ) {
        throw new Error(
            `Missing Strataparse model configuration: ${environmentVariable}`
        );
    }

    return model;
}