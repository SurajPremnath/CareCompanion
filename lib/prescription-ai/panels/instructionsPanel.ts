export const INSTRUCTIONS_PANEL_RULES = `
------------------------------------------------------------
PANEL: DOCTOR INSTRUCTIONS
------------------------------------------------------------

• OBJECTIVE:
Extract all patient advice, home care instructions, administration instructions, lifestyle advice, preparation instructions and clinician recommendations documented on the prescription.

• TARGET ARRAY:
- "doctorInstructions": Flat array of instruction strings.

Examples:

[
  "Steam inhalation (Easibreathe capsules)",
  "Betadine gargle",
  "Mix in 1/2 litre warm water",
  "Take before breakfast",
  "Take after food",
  "Drink plenty of fluids",
  "Rest adequately"
]

• EXTRACTION RULES:

- Scan the entire prescription including:
  - Advice
  - Instructions
  - Plan
  - Handwritten notes
  - Marginal notes
  - Continuation pages

- Preserve the doctor's wording whenever possible.

- Preserve preparation instructions.

Example:

"Mix in 1/2 litre warm water"

- Preserve administration instructions.

Examples:

"Steam inhalation"

"Betadine gargle"

"Take before breakfast"

"Take after food"

- Preserve lifestyle recommendations.

Examples:

"Rest"

"Increase fluid intake"

"Low salt diet"

- Do NOT extract medicines.

- Do NOT extract investigations.

- Do NOT extract diagnoses.

- Do NOT duplicate medicine directions already captured inside a medicine object.

Example:

If "Before breakfast" is already captured as the medicine timing,
do NOT repeat it here.

However, ALWAYS include standalone doctor advice, home-care advice, lifestyle advice, monitoring advice and follow-up recommendations, even when they are written beside a medicine.

Examples:

✔ Drink plenty of fluids
✔ Rest adequately
✔ Steam inhalation
✔ Betadine gargle
✔ Warm saline gargle
✔ Mix in 1/2 litre warm water
✔ Review after 5 days
✔ Return if symptoms worsen

Only exclude information already captured as structured medicine properties:
- dose
- frequency
- timing
- duration

Everything else should be extracted into "doctorInstructions".

- Return [] if no doctor instructions are documented.
`;