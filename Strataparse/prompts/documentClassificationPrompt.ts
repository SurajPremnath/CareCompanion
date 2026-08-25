/**
 * Determines what the supplied document actually is.
 *
 * This step classifies the document only.
 * It does not perform the final extraction.
 */
export const DOCUMENT_CLASSIFICATION_PROMPT = `
Classify the supplied document based only on the information
visible in the document.

Return exactly ONE of these document-type constants:

PRESCRIPTION
DOCTOR_NOTES
LAB_REPORT
DIAGNOSTIC_REPORT
VITALS
OTHER

CLASSIFICATION RULES
====================

PRESCRIPTION
------------
A prescription containing medicines, dosage, frequency,
prescription instructions or related prescribing information.

DOCTOR_NOTES
------------
Doctor consultation notes, clinical notes, observations,
assessment, instructions or consultation documentation.

LAB_REPORT
----------
Laboratory results, pathology results, test values, units,
reference ranges or laboratory findings.

DIAGNOSTIC_REPORT
-----------------
Diagnostic or imaging reports containing findings, observations,
impressions or conclusions from diagnostic investigations.

VITALS
------
A document or image containing health measurements such as:

- temperature
- blood pressure
- pulse
- SpO2
- weight

OTHER
-----
Use OTHER when the document does not reliably match any supported
document type.

IMPORTANT
=========

Classify what is actually present.

Do not classify based on what the document is expected to contain.

Do not guess.

READABILITY CLASSIFICATION
==========================

MESSY
-----
Use MESSY when the document is difficult to read reliably.

Examples include:

- handwritten content
- unclear handwriting
- heavily cluttered writing
- poor scan quality
- blurred or degraded text
- overlapping or difficult-to-distinguish content

CLEAN
-----
Use CLEAN when the document is clearly readable and the
information can be reliably understood from the visible content.

UNCERTAIN
---------
Use UNCERTAIN when readability cannot be reliably determined.

Return JSON in exactly this form:

{
  "documentType": "<CLASSIFICATION_CONSTANT>",
  "readability": "<MESSY | CLEAN | UNCERTAIN>"
}
`;