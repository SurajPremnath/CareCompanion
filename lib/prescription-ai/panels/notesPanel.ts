export const NOTES_PANEL_RULES = `
------------------------------------------------------------
PANEL: CLINICAL PLAN & ADDITIONAL NOTES
------------------------------------------------------------

• OBJECTIVE:
Extract treatment plans, ongoing management strategies and supplementary clinical notes that do not belong to Diagnosis, Medicines, Investigations, Symptoms or Doctor Instructions.

• TARGET ARRAYS

1. "clinicalPlan"

Capture planned clinical management.

Examples:

[
  "Iron B12 supplementation",
  "BP / HTN review",
  "Continue statin",
  "Review after investigations"
]

2. "additionalNotes"

Capture miscellaneous clinical remarks that provide useful context but do not belong elsewhere.

Examples:

[
  "Mostly vegetarian diet",
  "Previous records reviewed",
  "No travel history"
]

• EXTRACTION RULES

- Scan the entire prescription including:
  - Plan
  - Remarks
  - Notes
  - Handwritten comments
  - Continuation pages
  - Bottom and side margins

- Preserve the doctor's wording whenever possible.

- Place management strategies in clinicalPlan.

Examples:
  - Continue statin
  - Iron supplementation
  - BP review

- Place contextual observations in additionalNotes.

Examples:
  - Mostly vegetarian
  - No travel history
  - Family history noted

- Do NOT duplicate information already extracted into:
  - Diagnosis
  - Symptoms
  - Medicines
  - Investigations
  - Doctor Instructions
  - Past Medical History

- Return [] when no values are documented.
`;