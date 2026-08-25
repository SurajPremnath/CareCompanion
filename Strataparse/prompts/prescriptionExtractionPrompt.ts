/**
 * Prescription-specific extraction instructions.
 */
export const PRESCRIPTION_EXTRACTION_PROMPT = `
PRESCRIPTION EXTRACTION

Extract information explicitly present in the prescription.

Extract, when available and requested:

- medicine name
- medicine strength
- dosage
- frequency
- timing
- duration
- quantity
- route
- prescription date
- doctor name
- hospital or clinic
- diagnosis
- doctor assessment
- explicit instructions
- follow-up instructions

MEDICINES
=========

Every medicine visible in the source must be preserved.

For every medicine, keep its associated dosage, frequency,
timing and duration together where the source provides them.

Do not infer a dosage or frequency.

Do not infer a medicine name from a partially readable word.

If handwriting is unclear, extract only what can be reliably read.

DIAGNOSIS / ASSESSMENT
======================

Extract diagnosis or doctor's assessment only when explicitly
documented.

Never infer a diagnosis from the medicines prescribed.

INSTRUCTIONS
============

Extract explicit instructions from the prescription.

Do not create instructions from general medical knowledge.

MULTI-PAGE PRESCRIPTIONS
========================

Preserve information from every page.

Do not overwrite information from an earlier page.

If the same medicine appears more than once, preserve the source
information rather than silently removing it.
`;