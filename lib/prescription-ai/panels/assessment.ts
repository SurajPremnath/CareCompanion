export const DOCTOR_NOTES_ASSESSMENT_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — ASSESSMENT / CLINICAL IMPRESSION
============================================================

OBJECTIVE

Extract diagnoses, assessments, clinical impressions, and
conditions explicitly documented by the doctor.

Do not infer a diagnosis from symptoms, medicines,
investigations, or general medical knowledge.

The assessment must reflect what the doctor actually documented.

TARGET STRUCTURE:

Use the assessment / diagnosis structure defined by the overall
Doctor's Notes output contract.

============================================================
1. WHAT TO EXTRACT
============================================================

Look throughout the complete document for:

- Diagnosis
- Assessment
- Clinical impression
- Impression
- Problem list
- Working diagnosis
- Confirmed diagnosis
- Known medical conditions explicitly documented
- Doctor's narrative containing an explicit diagnosis

Also inspect:

- handwritten notes
- marginal notes
- continuation pages
- plan sections when they explicitly state a diagnosis

============================================================
2. PRESERVE THE DOCTOR'S MEANING
============================================================

Preserve the diagnosis as documented whenever reasonably possible.

Do not unnecessarily simplify a specific diagnosis into a broad
category.

For example:

"Metastatic lung adenocarcinoma"

should not automatically become:

"Lung cancer"

if the more specific diagnosis is explicitly documented.

Preserve clinically meaningful qualifiers such as:

- stage
- laterality
- anatomical site
- subtype
- severity
- chronicity
- confirmed / suspected status

when explicitly documented.

============================================================
3. DO NOT INFER DIAGNOSES
============================================================

Do NOT infer a diagnosis from:

- symptoms
- medicines
- investigations
- laboratory results
- imaging findings
- treatment plans
- risk factors
- age
- clinical context alone

For example:

"Capmatinib 200 mg"

does not by itself establish a diagnosis.

Likewise:

"PET CT"

does not establish the reason for the investigation.

Only extract a diagnosis when the document supports it.

============================================================
4. CONFIRMED VS SUSPECTED
============================================================

Preserve uncertainty when the doctor documents it.

Examples:

"Suspected pneumonia"

must not become:

"Pneumonia"

"Rule out recurrence"

must not become:

"Recurrence"

"Possible infection"

must retain its uncertain meaning.

Do not convert a differential diagnosis into a confirmed diagnosis.

============================================================
5. DIAGNOSIS VS SYMPTOM
============================================================

Symptoms belong to the symptoms extraction module.

Examples:

- cough
- breathlessness
- fatigue
- chest pain

must not automatically become diagnoses.

If the doctor explicitly documents both a symptom and a diagnosis,
preserve them in their appropriate fields.

============================================================
6. DIAGNOSIS VS INVESTIGATION
============================================================

Investigations are not diagnoses.

Examples:

- PET CT
- MRI Brain
- Biopsy
- IHC
- PDL1
- NGS
- Blood test

must not be placed into the diagnosis/assessment field merely
because they are clinically relevant.

============================================================
7. DIAGNOSIS VS PLAN
============================================================

Treatment plans and management instructions are not diagnoses.

Examples:

"Continue treatment"

"Review after 15 days"

"Monitor BP"

are instructions or clinical plans, not diagnoses.

============================================================
8. DUPLICATES
============================================================

If the same diagnosis appears multiple times, avoid duplicate
entries unless the later occurrence contains meaningful additional
specificity.

Do not create separate diagnoses merely because the same diagnosis
appears in:

- header
- assessment
- plan
- clinical narrative
- continuation page

============================================================
9. SOURCE FIDELITY
============================================================

Use only diagnoses and clinical assessments explicitly supported
by the uploaded doctor's note.

Do not use external medical knowledge to complete an incomplete
diagnosis.

Do not invent:

- stage
- subtype
- severity
- laterality
- disease status
- prognosis

unless explicitly documented.

============================================================
10. EMPTY RESULT
============================================================

If no explicit diagnosis or clinical assessment is documented,
return the appropriate empty assessment structure required by the
overall Doctor's Notes output contract.

Return the final assessment data through the overall JSON contract.
`;