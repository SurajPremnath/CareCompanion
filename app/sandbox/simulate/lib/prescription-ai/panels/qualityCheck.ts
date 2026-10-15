export const DOCTOR_NOTES_QUALITY_CHECK = `
============================================================
DOCTOR'S NOTES — FINAL QUALITY CHECK
============================================================

Before returning the final JSON, perform a silent internal
quality check against the uploaded document.

Do not return the quality-check reasoning.
Return only the final JSON required by the output contract.

============================================================
1. DOCUMENT COMPLETENESS
============================================================

Confirm that the entire uploaded document has been reviewed.

Check:

- all pages
- headers
- footers
- tables
- handwritten content
- signatures
- marginal notes
- continuation pages

Do not finalize based only on the first page or the most
prominent section.

============================================================
2. PATIENT IDENTITY CHECK
============================================================

Verify that:

- patientName is supported by the document
- patientDateOfBirth is supported if present
- patientAge is supported if present
- patientGender is supported if present
- patientUHID is supported if present

Do not infer missing demographic information.

============================================================
3. DOCTOR IDENTITY CHECK
============================================================

Verify that doctorName is actually supported by the document.

Look again at:

- document header
- consultation information
- doctor identification
- signature/name block
- "Printed by"
- footer

If the doctor name is not reliably supported:

"doctorName": null

Do NOT substitute:

- today's selected doctor
- previous doctor
- user-entered context
- a doctor mentioned in unrelated history

============================================================
4. CONSULTATION DATE CHECK
============================================================

This is a HIGH-PRIORITY validation.

Verify that consultationDate:

- is explicitly supported by the document
- represents the consultation/note date
- is in YYYY-MM-DD format
- is not today's date merely because extraction failed

Compare the extracted date against the visible date/time associated
with the clinical note.

If the document says:

"10 July 2026"

the result must be:

"2026-07-10"

NOT:

"2026-08-16"

unless 16 August 2026 is actually documented as the consultation
date.

If the date cannot be reliably determined:

"consultationDate": null

============================================================
5. DOCTOR + DATE CROSS-CHECK
============================================================

When the document presents doctor and date together, verify that
both values correspond to the same clinical encounter.

For example:

"10 July 2026 02:10:28 PM Dr. Shekar Patil"

should produce:

doctorName:
"Dr. Shekar Patil"

consultationDate:
"2026-07-10"

Do not separate a doctor from an unrelated date elsewhere in
the document.

============================================================
6. CLINICAL CONTENT CHECK
============================================================

Verify that extracted:

- symptoms
- investigations
- medications
- assessment
- doctor instructions
- follow-up

are actually documented.

Do not infer clinical content from general medical knowledge.

============================================================
7. MEDICATION CHECK
============================================================

For every extracted medication, verify:

- medicine name is documented
- strength is documented before returning it
- dose is documented before returning it
- frequency is documented before returning it
- duration is documented before returning it

Do not invent missing medication details.

Do not merge different strengths or different instructions.

============================================================
8. INVESTIGATION CHECK
============================================================

Verify that every investigation is actually documented.

Preserve the most specific documented name.

For example:

"Endo bronchial biopsy"

should not be reduced unnecessarily to:

"Biopsy"

when the specific wording is available.

============================================================
9. INSTRUCTION CHECK
============================================================

Verify that doctorInstructions represent actual instructions.

Preserve:

- monitoring frequency
- timing
- conditions
- follow-up context

For example:

"Monitor BP and pulse once in 3 days"

must retain:

- BP
- pulse
- once in 3 days

============================================================
10. FOLLOW-UP CHECK
============================================================

Verify that follow-up information represents an explicitly
documented future review or reassessment.

Preserve:

- interval
- calendar date
- investigation dependency
- treatment dependency
- specialist dependency

Do not invent an appointment.

============================================================
11. DUPLICATE CHECK
============================================================

Remove unnecessary duplicate entries.

The same clinical statement may appear in multiple sections.

Do not create multiple entries merely because the same information
appears in:

- header
- plan
- advice
- summary
- footer
- continuation pages

============================================================
12. CROSS-CATEGORY CHECK
============================================================

Verify that information is assigned to the appropriate category.

Examples:

- symptom → symptoms
- test/procedure → investigations
- medicine → medications
- diagnosis → assessment
- instruction → doctorInstructions
- future review → followUp

Do not duplicate the same fact across categories unless the
different representations preserve genuinely different clinical
meaning.

============================================================
13. NO CURRENT-DATE FALLBACK
============================================================

FINAL RULE:

If consultationDate was not reliably extracted from the document,
return null.

NEVER use today's date as a fallback.

The application must be allowed to ask the user for confirmation
rather than silently creating an incorrect clinical record.

============================================================
14. FINAL JSON CHECK
============================================================

Before returning:

- Confirm valid JSON.
- Confirm schema compliance.
- Confirm no unsupported fields.
- Confirm no Markdown.
- Confirm no explanatory text.
- Confirm null values are used for uncertain scalar fields.
- Confirm empty arrays are used for empty collections.
- Confirm consultationDate is correct.
- Confirm doctorName is correct.

Return ONLY the final JSON.
`;