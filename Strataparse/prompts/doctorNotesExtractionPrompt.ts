/**
 * Doctor-notes-specific extraction instructions.
 */
export const DOCTOR_NOTES_EXTRACTION_PROMPT = `
DOCTOR NOTES EXTRACTION

Extract information explicitly documented in the doctor's notes.

Extract, when available and requested:

- consultation date
- doctor name
- hospital or clinic
- consultation mode
- symptoms
- observations
- diagnosis
- doctor's assessment
- medicines
- dosage
- frequency
- tests advised
- investigations advised
- monitoring instructions
- explicit instructions
- follow-up plan
- additional clinical notes

DIAGNOSIS
=========

Extract the diagnosis only when documented.

Do not infer a diagnosis from symptoms, medicines or test results.

DOCTOR ASSESSMENT
=================

Preserve the doctor's documented assessment.

Do not replace the doctor's assessment with independent medical
interpretation.

MEDICINES
=========

Extract medicines and their associated dosage, frequency,
timing and duration when explicitly present.

TESTS AND INVESTIGATIONS
========================

Extract tests or investigations explicitly advised or requested.

Do not confuse:

- a requested test
with
- a test result
or
- a diagnostic finding.

INSTRUCTIONS
============

Extract explicit doctor instructions faithfully.

Do not invent instructions.

MULTI-PAGE NOTES
================

Preserve relevant information from every page.
`;