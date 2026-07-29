export const TESTS_PANEL_RULES = `
------------------------------------------------------------
PANEL: INVESTIGATIONS / TESTS
------------------------------------------------------------

• OBJECTIVE:
Extract all laboratory investigations, pathology tests, microbiology tests, imaging studies, procedures and diagnostic investigations ordered during the consultation.

• TARGET ARRAY:
- "investigations": Flat array of investigation strings.

Examples:

[
  "Blood CRP",
  "CBC",
  "PSA",
  "HbA1c",
  "Chest X-Ray",
  "Ultrasound Abdomen & Pelvis",
  "CT Chest",
  "PET CT"
]

• EXTRACTION RULES:

- Scan the entire prescription including:
  - Investigations
  - Plan
  - Advice
  - Follow-up
  - Handwritten notes
  - Continuation pages
  - Marginal notes

- Preserve the doctor's wording.

- Preserve common medical abbreviations.
  Examples:
  - CBC
  - CRP
  - ESR
  - HbA1c
  - PSA
  - LFT
  - KFT

- Do NOT include medicines.

- Do NOT include diagnoses.

- Do NOT include clinical instructions.

- Return each investigation only once.

- Return [] if no investigations are documented.
`;