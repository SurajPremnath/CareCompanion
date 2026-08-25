/**
 * Strataparse configuration contract.
 *
 * These are the only four configuration dimensions owned by the
 * portable intelligence layer. Product identity is deliberately excluded.
 */
export interface StrataparseConfiguration {
    /** Industry in which the intelligence layer is deployed. */
    readonly industry: string;

    /** Business or operational domain within the industry. */
    readonly domain: string;

    /** Input forms expected by the configured use case. */
    readonly expectedInput: readonly string[];

    /** Result(s) expected from the configured use case. */
    readonly expectedOutput: readonly string[];
}
