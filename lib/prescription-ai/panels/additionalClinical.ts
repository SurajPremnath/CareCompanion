export const DOCTOR_NOTES_ADDITIONAL_CLINICAL_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — ADDITIONAL CLINICAL INFORMATION
============================================================

OBJECTIVE

Extract additional clinical information that is explicitly
documented in the doctor's note but does not belong primarily
to the dedicated identity, symptom, investigation, medication,
assessment, instruction, or follow-up categories.

This module covers:

- presentingComplaints
- pastMedicalHistory
- examinationFindings
- additionalNotes

Use the existing Doctor's Notes output contract.

============================================================
1. PRESENTING COMPLAINTS
============================================================

Extract the patient's explicitly documented presenting complaints.

Examples:

- "Cough for 3 days"
- "Shortness of breath on exertion"
- "Pain in right lower limb"
- "Fever and weakness"

Preserve clinically meaningful qualifiers such as:

- duration
- severity
- frequency
- location
- laterality
- triggers
- timing

Do not invent complaints from:

- diagnosis
- medication
- investigation
- treatment plan
- general medical knowledge

Do not duplicate an identical item unnecessarily in both
presentingComplaints and symptoms.

If the information is clearly a symptom, symptoms remains the
primary clinical category.

Use presentingComplaints when the document explicitly identifies
the information as the patient's presenting complaint, chief
complaint, or reason for consultation.

If no presenting complaint is documented:

"presentingComplaints": []

============================================================
2. PAST MEDICAL HISTORY
============================================================

Extract medical conditions or relevant clinical history that the
doctor explicitly documents as past or known history.

Examples:

- "History of hypertension"
- "Known diabetes mellitus"
- "Past history of tuberculosis"
- "Previous stroke"
- "History of coronary artery disease"

Preserve the wording and relevant qualifiers.

Do NOT infer past medical history from:

- current medications
- current symptoms
- current diagnosis
- investigations
- family history
- standard medical assumptions

Do not convert a current diagnosis into past medical history
unless the document explicitly presents it as historical.

If no past medical history is documented:

"pastMedicalHistory": []

============================================================
3. EXAMINATION FINDINGS
============================================================

Extract explicit physical examination or clinical examination
findings documented by the doctor.

Examples:

- "Bilateral lower-limb edema"
- "Chest clear on auscultation"
- "Tenderness over right knee"
- "No respiratory distress"

Preserve clinically meaningful findings and qualifiers.

Do not invent examination findings from:

- diagnosis
- symptoms
- medication
- investigations
- general medical knowledge

Do not convert vital signs into examination findings.

In Doctor's Notes mode, consultation vitals remain governed by
the dedicated vitals override.

If no examination findings are documented:

"examinationFindings": []

============================================================
4. ADDITIONAL NOTES
============================================================

Extract clinically relevant information that is explicitly
documented but does not fit appropriately into the dedicated
Doctor's Notes categories.

Examples may include:

- important contextual clinical notes
- relevant administrative-clinical observations
- documented contextual information
- other clinically meaningful narrative details

Do not use additionalNotes as a dumping ground.

Do NOT place information into additionalNotes merely because
another category is difficult to determine.

Prefer the dedicated category whenever the information clearly
belongs there.

Do not add:

- inferred diagnoses
- inferred symptoms
- inferred treatment
- invented recommendations
- today's date
- application metadata
- user assumptions

If no appropriate additional clinical information is documented:

"additionalNotes": []

============================================================
5. CATEGORY PRIORITY
============================================================

When information could fit multiple categories, use this priority:

1. Identity
2. Symptoms
3. Investigations
4. Medications
5. Assessment / Diagnosis
6. Doctor Instructions
7. Follow-up
8. Presenting Complaints
9. Past Medical History
10. Examination Findings
11. Additional Notes

Do not create unnecessary duplicates across categories.

============================================================
6. SOURCE FIDELITY
============================================================

Extract only information supported by the uploaded doctor's note.

Do not infer missing information.

Do not use:

- current application state
- previous consultations
- patient profile data
- external medical knowledge
- today's date
- filename information

When information is uncertain or unreadable:

- use null for an uncertain scalar value
- use an empty array when no reliable item can be extracted

Do not guess.

============================================================
7. COMPLETE DOCUMENT REVIEW
============================================================

Check the entire document for these fields, including:

- consultation header
- chief complaint
- history
- examination
- assessment
- plan
- handwritten notes
- margins
- footers
- continuation pages

Do not stop after reading only the main assessment or plan.

============================================================
8. DUPLICATE CONTROL
============================================================

Avoid duplicate entries caused by repeated information.

If the same information appears in multiple places, preserve the
most complete and clinically appropriate representation.

Do not create duplicate records simply because the information
appears in:

- header
- history
- assessment
- plan
- summary
- continuation page

============================================================
9. FINAL CHECK
============================================================

Before returning the result, verify:

- presentingComplaints are explicitly documented complaints
- pastMedicalHistory is explicitly historical
- examinationFindings are explicitly documented findings
- additionalNotes contain only clinically relevant information
  that does not belong in a more specific category
- no information has been invented
- no unnecessary duplicates have been created

Return only the final JSON through the overall Doctor's Notes
output contract.
`;