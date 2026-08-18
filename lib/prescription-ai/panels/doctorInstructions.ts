export const DOCTOR_NOTES_INSTRUCTION_EXTRACTION = `
============================================================
DOCTOR'S NOTES — DOCTOR INSTRUCTIONS
============================================================

OBJECTIVE

Extract explicit instructions, recommendations, advice,
home-care guidance, monitoring instructions, preparation
instructions, and clinician recommendations documented by
the doctor.

TARGET ARRAY:

"doctorInstructions": string[]

============================================================
1. WHAT TO EXTRACT
============================================================

Extract instructions found anywhere in the document, including:

- Advice
- Instructions
- Plan
- Recommendations
- Monitoring instructions
- Home-care instructions
- Lifestyle recommendations
- Preparation instructions
- Follow-through instructions
- Clinician recommendations
- Handwritten instructions
- Marginal instructions
- Instructions on continuation pages

Preserve the doctor's wording whenever reasonably possible.

Examples:

- "Stockings to lower limbs"
- "Monitor BP and pulse once in 3 days"
- "Review after 15 days with blood test"
- "Drink plenty of fluids"
- "Rest adequately"
- "Low salt diet"

============================================================
2. MONITORING INSTRUCTIONS
============================================================

Explicit monitoring instructions MUST be preserved.

Examples:

- "Monitor BP daily"
- "Monitor BP and pulse once in 3 days"
- "Check blood sugar before breakfast"
- "Monitor temperature"

Do not convert a monitoring instruction into a diagnosis.

Do not invent a monitoring schedule.

Preserve the frequency specified by the doctor.

============================================================
3. FOLLOW-UP INSTRUCTIONS
============================================================

If the doctor explicitly instructs the patient to return,
review, or follow up, preserve that instruction.

Examples:

- "Review after 15 days"
- "Follow up after blood test"
- "Review after investigations"
- "Come back in 2 weeks"

Do not invent a follow-up date when only a duration is
documented.

Preserve the original meaning.

============================================================
4. PRESERVE CLINICAL DETAIL
============================================================

Do not shorten an instruction in a way that changes its meaning.

For example:

"Monitor BP and pulse once in 3 days"

must not become:

"Monitor BP"

The frequency and monitored parameters are clinically relevant.

Similarly:

"Review after 15 days with blood test"

must not become:

"Review"

============================================================
5. DO NOT EXTRACT OTHER CATEGORIES
============================================================

Do NOT extract:

- Diagnoses
- Symptoms
- Investigations as standalone test entries
- Medication names as standalone medicine entries
- Patient demographics
- Doctor identity
- Consultation date
- Vital signs

These belong to their respective extraction modules.

============================================================
6. MEDICATION INSTRUCTION DUPLICATION
============================================================

If medication administration instructions are already represented
inside a medication object, do not unnecessarily duplicate them
as standalone doctor instructions.

Examples:

If a medication object already contains:

"Take after food"

do not create another standalone instruction:

"Take after food"

unless the doctor explicitly gives it as a broader patient
instruction applying beyond that medication.

============================================================
7. INVESTIGATION INSTRUCTION DUPLICATION
============================================================

If the doctor says:

"Blood test after 15 days"

preserve the complete clinical instruction when it represents
follow-up or timing.

Do not reduce it to only:

"Blood test"

when the timing is clinically meaningful.

The investigation itself belongs to the investigation extraction
module, while the instruction preserves the doctor's intended
action and timing.

============================================================
8. MULTIPLE INSTRUCTIONS
============================================================

Return each distinct instruction as a separate array item.

Example:

[
  "Stockings to lower limbs",
  "Monitor BP and pulse once in 3 days",
  "Review after 15 days with blood test"
]

Do not merge unrelated instructions into one long string.

Do not create duplicate entries when the same instruction appears
multiple times.

============================================================
9. SOURCE FIDELITY
============================================================

Use only information documented in the uploaded doctor's note.

Do not infer:

- treatment goals
- monitoring frequency
- follow-up timing
- lifestyle recommendations
- clinical rationale

If the doctor did not document it, do not add it.

============================================================
10. EMPTY RESULT
============================================================

If no doctor instructions are documented:

"doctorInstructions": []

Return the final array only through the overall JSON contract.
`;