export type StrataparseModelTier =
    | "SOL"
    | "LUNA"
    | "TERRA";

export function resolveStrataparseModel(
    tier: StrataparseModelTier
): string {

    const model =
        tier === "SOL"
            ? process.env.STRATAPARSE_MODEL_SOL
            : tier === "LUNA"
                ? process.env.STRATAPARSE_MODEL_LUNA
                : process.env.STRATAPARSE_MODEL_TERRA;

    if (!model) {
        throw new Error(
            `Strataparse model is not configured for tier: ${tier}`
        );
    }

    return model;
}