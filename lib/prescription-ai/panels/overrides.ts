export const DOCTOR_NOTES_OVERRIDES = `
============================================================
DOCTOR'S NOTES — EXTRACTION OVERRIDES
============================================================

These rules take precedence whenever information could reasonably
belong to more than one clinical category.

============================================================
1. VITALS EXTRACTION
============================================================

Doctor's Notes MUST extract consultation vitals when
current vital signs are explicitly documented in the
uploaded doctor's note.

Extract only values that are actually present in the
document.

Supported fields:

- weight
- height
- bmi
- bloodPressure
- pulse
- respiratoryRate
- spo2
- temperature

IMPORTANT:

A current measured value is a consultation vital.

Examples:

"BP 114/75"
"P 115/min"
"SpO2 95%"
"T 35.4 C"
"Wt 72.2 kg"

These MUST be extracted into consultationVitals.

Do NOT infer a vital value from:

- doctor instructions
- symptoms
- diagnosis
- medication
- previous records
- clinical knowledge

For example:

"Monitor BP and pulse once in 3 days"

is NOT a current consultation vital.

It belongs in:

"doctorInstructions"

If a vital is not explicitly documented:

return null for that field.

If handwriting is uncertain, do NOT invent a value.

============================================================
2. DOCUMENT TYPE OVERRIDE
============================================================

For Doctor's Notes mode:

"documentType": "OTHER"

Do not infer another document type.

============================================================
3. DO NOT CREATE CLINICAL EVENTS
============================================================

Extraction records what the document says.

Do NOT create:

- clinical events
- timeline entries
- reminders
- appointments
- monitoring schedules
- tasks

Those belong to downstream application/domain logic.

============================================================
4. DO NOT CREATE APPOINTMENTS
============================================================

A statement such as:

"Review after 15 days"

is a follow-up instruction.

It does NOT automatically become an appointment.

Do not invent:

- appointment date
- appointment time
- location
- provider
- booking information

============================================================
5. DO NOT INVENT DOCTOR IDENTITY
============================================================

Doctor identity must be supported by the uploaded document.

Do not use:

- currently selected doctor
- previous consultation doctor
- doctor from another uploaded document
- doctor inferred from medication
- doctor inferred from hospital
- external application context

If the document does not reliably identify the doctor:

"doctorName": null

============================================================
6. DO NOT SUBSTITUTE TODAY'S DATE
============================================================

If the consultation date cannot be reliably extracted:

"consultationDate": null

NEVER use today's date as a fallback.

NEVER use:

- upload date
- file creation date
- filename date
- processing date

unless the document itself explicitly identifies that date as
the consultation date.

============================================================
7. DATE CATEGORY BOUNDARY
============================================================

Do not confuse consultationDate with:

- patientDateOfBirth
- laboratory date
- specimen collection date
- investigation date
- report date
- print date
- medication start date
- medication end date
- follow-up date

Only use a date as consultationDate when the document context
supports that interpretation.

============================================================
8. PATIENT DEMOGRAPHIC BOUNDARY
============================================================

Do not infer:

- age
- DOB
- gender
- UHID
- address

from:

- medications
- diagnosis
- symptoms
- hospital name
- general medical knowledge

Use only document-supported information.

============================================================
9. MEDICATION BOUNDARY
============================================================

Medication information belongs in:

"medicines"

Do not convert medication information into:

- diagnosis
- symptom
- investigation
- doctor identity
- follow-up

Do not invent medication details.

============================================================
10. INVESTIGATION BOUNDARY
============================================================

Investigation information belongs in:

"investigations"

Do not infer:

- diagnosis
- disease status
- treatment response
- investigation result

unless explicitly documented.

============================================================
11. SYMPTOM BOUNDARY
============================================================

Symptoms must be explicitly documented.

Do not infer symptoms from:

- medication
- diagnosis
- investigation
- treatment plan

============================================================
12. ASSESSMENT BOUNDARY
============================================================

Diagnosis or clinical assessment must be explicitly documented.

Do not infer a diagnosis from:

- symptoms
- medication
- investigations
- treatment
- general medical knowledge

============================================================
13. INSTRUCTION BOUNDARY
============================================================

Doctor instructions must represent an actual instruction,
recommendation, monitoring request, or action documented by
the doctor.

Do not turn clinical observations into instructions.

Example:

"BP is elevated"

does not automatically become:

"Monitor BP"

unless monitoring was actually instructed.

============================================================
14. FOLLOW-UP BOUNDARY
============================================================

Follow-up must represent an explicitly documented future
review, reassessment, or return instruction.

Do not infer follow-up merely because:

- medication was started
- an investigation was ordered
- treatment was changed
- a condition normally requires review

============================================================
15. ADDITIONAL CLINICAL INFORMATION
============================================================

Use:

- presentingComplaints
- pastMedicalHistory
- examinationFindings
- additionalNotes

only when the information genuinely belongs there.

Do not use additionalNotes as a fallback for information that
clearly belongs in another category.

============================================================
16. DUPLICATE CONTROL
============================================================

Avoid unnecessary duplication.

If the same information appears in:

- header
- body
- plan
- advice
- summary
- footer
- continuation page

do not create multiple identical entries.

Preserve the most complete clinically meaningful representation.

============================================================
17. SOURCE AUTHORITY
============================================================

The uploaded doctor's note is the authoritative source.

Do not use external information to fill missing values.

When uncertain:

- scalar → null
- collection → []

Do not guess.
`;