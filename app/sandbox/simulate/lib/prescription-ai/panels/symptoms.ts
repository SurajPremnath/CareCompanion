export const DOCTOR_NOTES_SYMPTOM_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — SYMPTOMS & COMPLAINTS
============================================================

OBJECTIVE

Extract symptoms, complaints, reported problems, and clinically
relevant patient-reported concerns that are explicitly documented
in the doctor's note.

TARGET ARRAY:

"symptoms": string[]

============================================================
1. WHAT TO EXTRACT
============================================================

Extract symptoms explicitly documented by the patient or clinician.

Look throughout the complete document, including:

- Chief complaint
- Presenting complaints
- History of present illness
- Symptoms section
- Review of symptoms
- Doctor's narrative
- Assessment narrative when it explicitly describes symptoms
- Handwritten notes
- Marginal notes
- Continuation pages

Examples:

- "Shortness of breath"
- "Cough"
- "Chest pain"
- "Fatigue"
- "Swelling of lower limbs"
- "Loss of appetite"

============================================================
2. PRESERVE THE DOCUMENTED MEANING
============================================================

Preserve the doctor's wording whenever reasonably possible.

Do not unnecessarily normalize a symptom into a medical diagnosis.

For example:

"Breathlessness on exertion"

should remain:

"Breathlessness on exertion"

rather than being converted to:

"Dyspnea"

unless the document itself uses "dyspnea".

Preserve clinically relevant qualifiers such as:

- severity
- duration
- frequency
- location
- triggers
- timing
- associated symptoms

Example:

"Chest pain for 3 days"

should not become simply:

"Chest pain"

when the duration is explicitly documented and clinically relevant.

============================================================
3. DO NOT INFER SYMPTOMS
============================================================

Do not infer symptoms from:

- Diagnosis
- Medication
- Investigation
- Treatment plan
- Doctor instructions
- Medical history
- Disease name

For example:

If the document says:

"Hypertension"

do NOT automatically create:

"Headache"

"Dizziness"

or any other symptom unless explicitly documented.

If a medicine commonly treats a symptom, do not infer that
symptom from the medicine.

============================================================
4. DIFFERENTIATE SYMPTOMS FROM DIAGNOSIS
============================================================

A diagnosis is not automatically a symptom.

Examples:

"Diabetes mellitus"
"Hypertension"
"COPD"
"Metastatic disease"

are diagnoses/clinical conditions, not symptoms.

Do not place them in the symptoms array unless the document
explicitly presents the term as a patient-reported complaint,
which is uncommon and must be supported by the document context.

============================================================
5. DIFFERENTIATE SYMPTOMS FROM INVESTIGATIONS
============================================================

Investigation names are not symptoms.

Do not extract:

- MRI
- CT scan
- PET CT
- Blood test
- Biopsy
- NGS

as symptoms.

These belong to the investigation extraction module.

============================================================
6. DIFFERENTIATE SYMPTOMS FROM DOCTOR INSTRUCTIONS
============================================================

Instructions are not symptoms.

For example:

"Monitor BP and pulse"

is an instruction, not a symptom.

"Review after 15 days"

is a follow-up instruction, not a symptom.

============================================================
7. DUPLICATES
============================================================

If the same symptom appears repeatedly in the document,
return it only once unless the repeated occurrence contains
meaningful additional clinical detail.

Do not create duplicate symptom entries from:

- header + body repetition
- copied history
- continuation pages
- repeated summaries

============================================================
8. SOURCE FIDELITY
============================================================

Use only information explicitly supported by the uploaded
doctor's note.

Do not invent:

- symptom severity
- symptom duration
- symptom frequency
- symptom location
- associated symptoms
- negative symptoms

Do not assume a symptom merely because it would be medically
expected.

============================================================
9. EMPTY RESULT
============================================================

If no symptoms or complaints are explicitly documented:

"symptoms": []

Return the final array through the overall JSON contract.
`;