/**
 * Clinical History Panel
 *
 * Single responsibility:
 * Extract clinically relevant historical information explicitly
 * documented in the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT determine current clinical state.
 */

export const CLINICAL_HISTORY_PANEL_RULES = `
============================================================
CLINICAL HISTORY PANEL
============================================================

PURPOSE
Extract clinically relevant HISTORY explicitly documented in the
supplied medical document.

This panel answers:

"What important things happened BEFORE or form the patient's
established medical history?"

This panel is responsible ONLY for historical information.


============================================================
1. WHAT BELONGS TO CLINICAL HISTORY
============================================================

Capture relevant historical information such as:

- Previous diagnoses
- Previous illnesses
- Previous cancer history
- Previous chemotherapy
- Previous radiotherapy
- Previous surgery
- Previous procedures
- Previous hospitalisations
- Previous significant medical events
- Relevant chronic medical history
- Previous treatment history
- Important prior investigations when explicitly presented as history
- Previous response to treatment when documented as history


============================================================
2. HISTORICAL DIAGNOSES
============================================================

Capture a diagnosis as history when the document explicitly
presents it as previous, known, past or established history.

Examples:

"History of hypertension."

→ Clinical History:
"Hypertension"

"Past history of diabetes."

→ Clinical History:
"Diabetes"


Do not automatically classify every diagnosis as historical.

If the document presents a condition as current:

"Patient has metastatic NSCLC."

→ CurrentStateOfHealthPanel


============================================================
3. PREVIOUS TREATMENT
============================================================

Capture previous treatments when explicitly documented.

Examples:

- Received chemotherapy
- Completed 4 cycles of chemotherapy
- Previously treated with radiation
- Underwent surgery
- Received immunotherapy
- Previous targeted therapy

Preserve meaningful treatment details when documented.

Example:

"Received 4 cycles of carboplatin/pemetrexed."

→ Clinical History:
"Received 4 cycles of carboplatin/pemetrexed."

Do not convert historical treatment into a current medication.


============================================================
4. PREVIOUS CHEMOTHERAPY
============================================================

Chemotherapy history is particularly important.

Capture:

- Previous chemotherapy
- Number of cycles
- Regimen
- Approximate treatment period when explicitly documented
- Completion status when explicitly documented

Example:

"Completed 6 cycles of chemotherapy in 2025."

→ Clinical History:
"Completed 6 cycles of chemotherapy in 2025."

Do NOT create:

Medication:
"Chemotherapy"

Do NOT create:

Medication Suggested:
"6 cycles"


============================================================
5. PREVIOUS PROCEDURES / SURGERIES
============================================================

Capture procedures or surgeries when they are explicitly presented
as historical events.

Examples:

- "Underwent lobectomy in 2024."
- "Status post biopsy."
- "Previous stent placement."

Preserve the clinically meaningful procedure and relevant date/year
when documented.


============================================================
6. PREVIOUS HOSPITALISATIONS
============================================================

Capture previous hospitalisation only when clinically relevant and
explicitly documented.

Example:

"Admitted in March 2025 for pneumonia."

→ Clinical History:
"Hospitalised for pneumonia in March 2025."


============================================================
7. HISTORICAL INVESTIGATIONS
============================================================

An investigation may appear as part of history.

Example:

"Previous PET CT showed..."

This belongs in Clinical History when the document is using the
investigation as a historical event.

However, do NOT copy the complete investigation result into
Clinical History.

The detailed investigation/result belongs to InvestigationsPanel
when it is relevant to the current document.


============================================================
8. HISTORICAL MEDICATIONS
============================================================

A medicine mentioned as previously used does NOT automatically
belong in the current MedicationPanel.

Examples:

"Previously received osimertinib."

→ Clinical History

"Was on capmatinib previously."

→ Clinical History

"Continue capmatinib."

→ MedicationPanel

"Start capmatinib 200 mg twice daily."

→ MedicationPanel


============================================================
9. TEMPORAL LANGUAGE
============================================================

Pay attention to explicit historical indicators:

- past history
- history of
- previously
- prior
- earlier
- former
- underwent
- received
- completed
- status post
- previously treated
- had
- was diagnosed with
- treated in
- admitted in
- operated in

Temporal language must be interpreted in context.

Do not assume every sentence containing "had" is historical.


============================================================
10. CURRENT VS HISTORICAL
============================================================

This distinction is mandatory.

Example:

"Patient was diagnosed with lung cancer in 2024."

→ Clinical History

"Patient currently has metastatic lung cancer."

→ CurrentStateOfHealthPanel

Example:

"Previously received chemotherapy and now has progressive disease."

Clinical History:
"Previously received chemotherapy."

Current State:
"Progressive disease."


============================================================
11. HISTORICAL SYMPTOMS
============================================================

Do not automatically copy old symptoms into the current SymptomsPanel.

Example:

"Had cough for several weeks last year."

→ Clinical History

"Currently has cough for 2 weeks."

→ SymptomsPanel


============================================================
12. HISTORICAL DOCTORS
============================================================

A doctor mentioned as part of history is NOT automatically a current
consulting or referral doctor.

Example:

"Previously treated by Dr. Kumar."

→ This may remain part of Clinical History.

It must NOT automatically populate:

Consulting Doctor = Dr. Kumar


============================================================
13. HISTORICAL HOSPITALS
============================================================

A previous hospital mentioned in history is not automatically the
current hospital.

Example:

"Previously treated at XYZ Hospital."

→ Clinical History

Do NOT set:

Hospital = XYZ Hospital

unless the current document identifies XYZ Hospital as the current
issuing/relevant institution.


============================================================
14. CLINICAL RELEVANCE
============================================================

Do not copy every historical sentence.

Prioritise history that helps explain:

- current diagnosis
- current treatment
- current disease status
- previous treatment response
- major procedures
- important chronic conditions
- important previous events

Avoid irrelevant personal or administrative history.


============================================================
15. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- previous application data
- database information
- other patient records
- external knowledge
- assumptions based on current medication
- assumptions based on diagnosis


============================================================
16. ANTI-HALLUCINATION
============================================================

NEVER:

- invent historical events
- invent treatment dates
- invent treatment cycles
- infer previous treatment from current treatment
- infer previous diagnosis from current diagnosis
- convert current information into history
- convert historical medication into current medication
- convert a historical doctor into a consulting doctor
- convert a historical hospital into the current hospital


============================================================
17. STRICT SCOPE
============================================================

THIS PANEL MUST NOT OWN:

Patient identity:
- Name
- Age
- Sex
- Name Variations

Doctor identity:
- Doctor Name
- Doctor Type
- Doctor Designation

Hospital identity:
- UHID
- Hospital
- Hospital Location

Document classification:
- Document Type

Vitals:
- Weight
- Height
- BMI
- BP
- Pulse
- Respiratory Rate
- SpO2
- Temperature

Current state:
- Current diagnosis
- Current disease status
- Current staging
- Current clinical assessment

Current symptoms:
- Current complaints
- Current symptom duration/severity

Investigations:
- Current investigation results
- Detailed investigation findings

Tests advised:
- Tests ordered/advised/planned

Medication:
- Current medication
- Newly suggested medication
- Dose/frequency/duration of current prescription

Instructions:
- Doctor's advice

Follow-up:
- Review plan
- Follow-up date/instructions


============================================================
18. OUTPUT
============================================================

This panel contributes ONLY:

{
  "clinicalHistory": []
}

Each item should contain only a clinically meaningful historical
event or fact.

Recommended conceptual structure:

{
  "event": string,
  "date": string | null,
  "details": string | null
}

Do not invent dates.

If no meaningful clinical history is documented:

clinicalHistory = []


============================================================
19. FINAL VALIDATION
============================================================

Before returning history:

1. Is this information genuinely historical?
2. Is the historical status explicitly supported?
3. Is the event clinically relevant?
4. Has current information remained in the current-state panel?
5. Have current symptoms remained in SymptomsPanel?
6. Have current medicines remained in MedicationPanel?
7. Have current investigations remained in InvestigationsPanel?
8. Have historical doctors remained separate from DoctorPanel?
9. Have historical hospitals remained separate from HospitalPanel?
10. Have dates been extracted only when explicitly documented?
11. Has nothing been inferred?

When uncertain whether information is current or historical,
do not guess. Prefer the classification explicitly supported
by the document.

END CLINICAL HISTORY PANEL
`;