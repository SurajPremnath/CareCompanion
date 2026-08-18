export const DOCTOR_NOTES_INVESTIGATION_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — INVESTIGATIONS
============================================================

OBJECTIVE

Extract investigations, diagnostic tests, laboratory tests,
imaging studies, pathology procedures, and other investigations
that are explicitly documented in the doctor's note.

TARGET ARRAY:

"investigations": string[]

============================================================
1. WHAT TO EXTRACT
============================================================

Extract investigations that the doctor:

- ordered
- advised
- requested
- recommended
- reviewed
- referred for
- documented as pending
- documented as required for follow-up

Scan the complete document, including:

- Investigation section
- Plan
- Assessment
- Doctor's instructions
- Clinical narrative
- Handwritten notes
- Marginal notes
- Continuation pages

Examples:

- "Blood test"
- "PET CT"
- "MRI Brain"
- "Biopsy"
- "Endo bronchial biopsy"
- "LN core biopsy"
- "IHC"
- "PDL1"
- "NGS"

============================================================
2. PRESERVE SPECIFICITY
============================================================

Preserve the investigation as specifically documented.

Do not unnecessarily generalize.

For example:

"Endo bronchial biopsy"

should remain:

"Endo bronchial biopsy"

rather than:

"Biopsy"

when the more specific wording is available.

Likewise:

"MRI Brain"

should remain:

"MRI Brain"

rather than:

"MRI"

============================================================
3. INVESTIGATION VS RESULT
============================================================

Extract the investigation itself, not an invented interpretation
of its result.

If the document contains:

"MRI Brain - normal"

the investigation is:

"MRI Brain"

Do not create a diagnosis such as:

"No brain abnormality"

unless that is explicitly documented elsewhere and belongs to
the assessment/diagnosis extraction.

============================================================
4. INVESTIGATION VS INSTRUCTION
============================================================

Preserve clinically meaningful instructions associated with an
investigation when required by the overall extraction model.

For example:

"Review after 15 days with blood test"

contains:

- investigation: "Blood test"
- doctor instruction/follow-up: "Review after 15 days with blood test"

Do not lose the timing or clinical instruction merely because
the investigation itself is extracted separately.

The investigation array should remain focused on the test or
procedure.

============================================================
5. INVESTIGATION VS MEDICATION
============================================================

Do not extract medication names as investigations.

For example:

"Tab Capmatinib 200mg"

is a medication, not an investigation.

============================================================
6. INVESTIGATION VS DIAGNOSIS
============================================================

Do not extract diagnoses as investigations.

For example:

"Metastatic lung cancer"

is not an investigation.

However, a diagnostic procedure such as:

"Biopsy"

is an investigation.

============================================================
7. DUPLICATES
============================================================

If the same investigation appears multiple times in the document,
return it once unless different occurrences contain meaningful
additional specificity.

Do not duplicate investigations merely because they appear in:

- Plan
- Instructions
- Summary
- Follow-up section
- Continuation page

============================================================
8. SOURCE FIDELITY
============================================================

Use only investigations explicitly documented in the uploaded
doctor's note.

Do not infer tests based on:

- diagnosis
- medication
- standard clinical practice
- symptoms
- age
- disease type

For example, do not add a CT scan merely because the diagnosis
would commonly require one.

============================================================
9. PENDING / FUTURE INVESTIGATIONS
============================================================

If an investigation is explicitly documented as planned,
pending, advised, or required for follow-up, include it.

Do not invent a date or schedule if none is documented.

============================================================
10. EMPTY RESULT
============================================================

If no investigations are documented:

"investigations": []

Return the final array through the overall JSON contract.
`;