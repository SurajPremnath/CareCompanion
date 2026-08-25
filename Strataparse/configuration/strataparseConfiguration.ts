import type {
    StrataparseConfiguration,
} from "./strataparseConfigurationTypes";

/**
 * Creates the immutable configuration consumed by Strataparse.
 *
 * Product-specific decisions remain outside Strataparse.
 * A product supplies these four values and the engine uses them
 * to determine the required processing and result.
 */
export function createStrataparseConfiguration(
    configuration: StrataparseConfiguration
): StrataparseConfiguration {
    const industry = configuration.industry.trim();
    const domain = configuration.domain.trim();

    const expectedInput = configuration.expectedInput
        .map(value => value.trim())
        .filter(Boolean);

    const expectedOutput = configuration.expectedOutput
        .map(value => value.trim())
        .filter(Boolean);

    if (!industry) {
        throw new Error(
            "Strataparse configuration requires an industry."
        );
    }

    if (!domain) {
        throw new Error(
            "Strataparse configuration requires a domain."
        );
    }

    if (expectedInput.length === 0) {
        throw new Error(
            "Strataparse configuration requires at least one expected input."
        );
    }

    if (expectedOutput.length === 0) {
        throw new Error(
            "Strataparse configuration requires at least one expected output."
        );
    }

    return Object.freeze({
        industry,
        domain,
        expectedInput: Object.freeze(expectedInput),
        expectedOutput: Object.freeze(expectedOutput),
    });
}
