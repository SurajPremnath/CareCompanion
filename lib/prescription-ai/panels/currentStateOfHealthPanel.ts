/**
 * Current State of Health Panel
 *
 * Single responsibility:
 * Extract the clinically meaningful current state of the patient
 * explicitly communicated by the doctor/document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 */

export const CURRENT_STATE_OF_HEALTH_PANEL_RULES = `
============================================================
CURRENT STATE OF HEALTH PANEL
============================================================

PURPOSE
Identify the patient's current clinical state as explicitly
communicated in the supplied medical document.

This panel answers:

"What is the patient's current clinical condition according
to the doctor/document?"

This panel is responsible ONLY for current clinical assessment.

============================================================
1. CURRENT DIAGNOSIS / CONDITION
============================================================

Extract diagnoses or conditions explicitly documented as current.

Examples:

- Non-small cell lung cancer
- Pneumonia
- Hypertension
- Diabetes mellitus
- Metastatic disease

Preserve the clinically meaningful diagnosis as documented.

Do not:

- infer a diagnosis from medication
- infer a diagnosis from symptoms alone
- infer a diagnosis from an investigation result alone
- infer a diagnosis from a doctor's specialty
- convert a historical diagnosis into a current diagnosis without
  supporting context


============================================================
2. CURRENT DISEASE STATUS
============================================================

Capture an explicitly documented description of the current disease
state when clinically meaningful.

Examples:

- Stable disease
- Progressive disease
- Recurrent disease
- Metastatic disease
- In remission
- Active disease
- Newly diagnosed
- Controlled
- Uncontrolled

Only use a status when it is explicitly supported.

Do not manufacture disease status from:

- medication choice
- treatment intensity
- investigation result
- symptom severity


============================================================
3. STAGE
============================================================

Capture staging ONLY when explicitly documented.

Examples:

- Stage III
- Stage IIIB
- Stage IV
- T3N2M0

Do not calculate or infer stage.

Do not derive stage from:

- metastases
- TNM components unless the document itself explicitly provides
  the stage
- treatment
- imaging findings

If staging is not explicitly documented:

stage = null


============================================================
4. CURRENT CLINICAL ASSESSMENT
============================================================

Capture the doctor's explicit clinical assessment that materially
explains the patient's current state.

Examples:

- "Disease appears stable."
- "Likely progression despite current treatment."
- "Patient clinically improving."
- "Persistent respiratory symptoms."
- "Current condition remains concerning."

Preserve meaning without inventing additional conclusions.

Do not turn every sentence from the document into an assessment.


============================================================
5. IMPORTANT CURRENT FINDINGS
============================================================

A clinically important finding may be included when the doctor
explicitly uses it to describe the current state.

Examples:

- persistent hypoxia
- significant edema
- clinically stable
- persistent fever
- worsening breathlessness

The finding must be:

1. explicitly documented, and
2. relevant to the current clinical state.

Do not copy every examination finding into this panel.


============================================================
6. INVESTIGATION RESULTS
============================================================

Do NOT automatically copy investigation results into Current State
of Health.

Example:

"PET CT shows left lung lesion with liver and bone metastases."

Do not blindly reproduce the entire PET CT report here.

If the doctor explicitly uses the finding as part of the current
clinical assessment, capture the resulting clinical state.

Example:

"PET CT confirms metastatic progression."

Current State of Health:
"Metastatic progression"

The detailed investigation/result belongs to InvestigationsPanel.


============================================================
7. SYMPTOMS
============================================================

Do not duplicate the complete symptoms list here.

Example:

"Patient has cough and breathlessness."

SymptomsPanel:
- cough
- breathlessness

CurrentStateOfHealthPanel:

Only include them if the doctor explicitly uses them to describe
the current clinical condition.

Example:

"Persistent breathlessness despite treatment."

Current State:
"Persistent breathlessness despite treatment."

Do not simply copy:

"cough, breathlessness"


============================================================
8. CLINICAL HISTORY
============================================================

Historical information does NOT belong here unless the doctor
explicitly presents it as part of the current state.

Example:

"Received chemotherapy last year."

→ Clinical History

Example:

"Previously treated with chemotherapy and now has progressive
disease."

→ "progressive disease" may belong here
→ previous chemotherapy belongs to Clinical History


============================================================
9. MEDICATIONS
============================================================

Do not extract medicines into this panel.

Example:

"Continue capmatinib."

MedicationPanel:
"Capmatinib"

InstructionsPanel:
"Continue capmatinib."

CurrentStateOfHealthPanel:
Nothing, unless the doctor explicitly links the medication to a
current clinical assessment.


============================================================
10. TESTS ADVISED
============================================================

Tests that the doctor wants the patient to undergo do NOT belong
here.

Example:

"PET CT advised."

→ TestsAdvisedPanel

Do not convert the advised test into a current diagnosis or
clinical state.


============================================================
11. MULTIPLE DIAGNOSES
============================================================

If multiple current diagnoses are explicitly documented, preserve
each meaningful diagnosis separately.

Do not merge unrelated conditions.

Do not rank diagnoses unless the document explicitly identifies
a primary/main diagnosis.


============================================================
12. CURRENT VS HISTORICAL
============================================================

This distinction is mandatory.

Current:

"Known metastatic NSCLC with progressive disease."

→ Current State of Health

Historical:

"Previously treated with chemotherapy."

→ Clinical History

Historical with current relevance:

"Previously treated with chemotherapy, now with recurrent disease."

→ Clinical History:
"Previously treated with chemotherapy."

→ Current State:
"Recurrent disease."


============================================================
13. NEGATIVE FINDINGS
============================================================

Capture a negative finding only when it is clinically meaningful to
the current assessment.

Example:

"No evidence of active infection."

This may belong to Current State of Health if explicitly presented
as part of the doctor's assessment.

Do not extract routine negative findings merely because they appear
in an examination.


============================================================
14. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- application context
- previous patient records
- external medical knowledge
- inferred diagnoses
- inferred staging
- medication-based diagnosis inference
- investigation-based diagnosis inference
  unless the doctor explicitly establishes the diagnosis/assessment


============================================================
15. ANTI-HALLUCINATION
============================================================

NEVER:

- infer diagnosis from medicine
- infer diagnosis from symptoms
- infer stage from imaging
- infer disease status from treatment
- infer progression from a single result
- infer remission because treatment has ended
- manufacture clinical conclusions
- convert historical disease into current disease
- copy an entire investigation report into current assessment
- copy the entire symptom list into current assessment


============================================================
16. STRICT SCOPE
============================================================

THIS PANEL MUST NOT OWN:

Patient identity:
- Patient Name
- Age
- Sex
- Name Variations

Doctor identity:
- Doctor Name
- Doctor Type
- Doctor Designation

Hospital:
- UHID
- Hospital
- Hospital Location

Documents:
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

History:
- Detailed historical events
- Previous treatments
- Previous procedures

Symptoms:
- Complete symptom list

Investigations:
- Investigation names
- Detailed investigation results

Tests:
- Tests advised / ordered

Medication:
- Medicine names
- Dose
- Frequency
- Duration

Instructions:
- Doctor's advice

Follow-up:
- Review date
- Follow-up instructions


============================================================
17. OUTPUT
============================================================

This panel contributes ONLY current clinical state.

Recommended structure:

{
  "currentStateOfHealth": {
    "conditions": [],
    "diseaseStatus": [],
    "stage": null,
    "clinicalAssessment": [],
    "importantFindings": []
  }
}

Use:

[] for no documented items.

null for unavailable scalar information such as stage.

Do not populate fields with inferred information.


============================================================
18. FINAL VALIDATION
============================================================

Before returning the current state:

1. Is the condition explicitly documented?
2. Is it current rather than historical?
3. Is disease status explicitly documented?
4. Is stage explicitly documented?
5. Has stage been inferred from findings?
6. Have investigation details remained in InvestigationsPanel?
7. Have symptoms remained in SymptomsPanel?
8. Has history remained in ClinicalHistoryPanel?
9. Have medicines remained in MedicationPanel?
10. Have instructions remained in InstructionsPanel?
11. Has no clinical conclusion been manufactured?

When uncertain, exclude the information rather than guessing.

END CURRENT STATE OF HEALTH PANEL
`;