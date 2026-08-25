import {
    STRATAPARSE_SYSTEM_PROMPT,
} from "./strataparseSystemPrompt";

import {
    PRESCRIPTION_EXTRACTION_PROMPT,
} from "./prescriptionExtractionPrompt";

import {
    LAB_REPORT_EXTRACTION_PROMPT,
} from "./labReportExtractionPrompt";

import {
    DIAGNOSTIC_REPORT_EXTRACTION_PROMPT,
} from "./diagnosticReportExtractionPrompt";

import {
    DOCTOR_NOTES_EXTRACTION_PROMPT,
} from "./doctorNotesExtractionPrompt";

import {
    VITALS_EXTRACTION_PROMPT,
} from "./vitalsExtractionPrompt";

export type StrataparseConfiguration = {
    expectedOutput?: string[];
};

const DOCUMENT_EXTRACTION_PROMPTS:
    Record<string, string> = {
        PRESCRIPTION:
            PRESCRIPTION_EXTRACTION_PROMPT,

        LAB_REPORT:
            LAB_REPORT_EXTRACTION_PROMPT,

        DIAGNOSTIC_REPORT:
            DIAGNOSTIC_REPORT_EXTRACTION_PROMPT,

        DOCTOR_NOTES:
            DOCTOR_NOTES_EXTRACTION_PROMPT,

        VITALS:
            VITALS_EXTRACTION_PROMPT,
    };

/**
 * Builds the final extraction prompt for one document.
 *
 * The final prompt contains:
 *
 * 1. Universal Strataparse accuracy rules
 * 2. Document-specific extraction rules
 * 3. CareVR configuration
 *
 * This is the only prompt-composition layer.
 */
export function buildExtractionPrompt(
    documentType: string,
    configuration?:
        StrataparseConfiguration
): string {

    const documentPrompt =
        DOCUMENT_EXTRACTION_PROMPTS[
            documentType
        ];

    if (!documentPrompt) {
        throw new Error(
            `Unsupported Strataparse document type: ${documentType}`
        );
    }

    const expectedOutput =
        configuration?.expectedOutput ?? [];

    const configurationText =
        expectedOutput.length > 0
            ? expectedOutput
                .map(
                    field =>
                        `- ${field}`
                )
                .join("\n")
            : "Use the document-specific extraction scope.";

    return `
${STRATAPARSE_SYSTEM_PROMPT}

============================================================
DOCUMENT-SPECIFIC EXTRACTION
============================================================

${documentPrompt}

============================================================
CAREVR CONFIGURATION
============================================================

CareVR requested the following output:

${configurationText}

============================================================
FINAL RULE
============================================================

Return structured information supported by the source document.

Extract every relevant value requested by CareVR.

Do not invent missing information.

Do not omit a visible requested value.

Do not add unrelated information.

Accuracy and source fidelity take priority over completeness.
`;
}