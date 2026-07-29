export const ASSESSMENT_PANEL_RULES = `
------------------------------------------------------------
PANEL: DIAGNOSIS & CLINICAL ASSESSMENTS
------------------------------------------------------------

• OBJECTIVE:
Extract the clinician's diagnostic impression, assessment, differential diagnosis, rule-out conditions, and associated clinical assessments documented anywhere on the prescription.

• TARGET FIELDS:

1. "diagnosisOrAssessment"
- Return the PRIMARY diagnosis or overall clinical impression.
- Examples:
  - "Likely viral URTI"
  - "Acute Bronchitis"
  - "Community Acquired Pneumonia"

2. "clinicalAssessments"
- Return all secondary assessments, associated conditions, nutritional deficiencies, provisional diagnoses and rule-out conditions.

Examples:

[
  "Nutritional Deficiency",
  "? BPH",
  "Iron Deficiency"
]

• EXTRACTION RULES

- Scan the entire prescription including:
  - Assessment
  - Impression (Imp.)
  - Diagnosis
  - Clinical Notes
  - Plan
  - Handwritten comments
  - Continuation pages

- Preserve the doctor's clinical wording.

- Preserve uncertainty markers exactly as written.

Examples:

"? BPH"

"Likely viral URTI"

"Possible COPD"

"Suspected TB"

Do NOT convert uncertain diagnoses into confirmed diagnoses.

- Do NOT move symptoms into diagnosis.

Example:

"Tiredness"

belongs under symptoms.

NOT diagnosis.

- Do NOT move past medical history into diagnosis.

Example:

"HTN x20 yrs"

belongs under history.

NOT diagnosis.

- Multiple diagnoses may exist.

Choose the principal diagnosis for
diagnosisOrAssessment.

Place the remaining diagnoses or assessments into
clinicalAssessments.

- Return null for diagnosisOrAssessment if no diagnosis is documented.

- Return [] for clinicalAssessments when none are documented.
`;