export const DOCTOR_NOTES_FOLLOW_UP_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — FOLLOW-UP
============================================================

OBJECTIVE

Extract explicit follow-up, review, return-visit, and reassessment
instructions documented by the doctor.

TARGET STRUCTURE:

Use the follow-up structure defined by the overall Doctor's Notes
output contract.

============================================================
1. WHAT TO EXTRACT
============================================================

Look throughout the complete document for:

- Follow-up instructions
- Review instructions
- Return-visit instructions
- Reassessment instructions
- Follow-up timing
- Follow-up after investigations
- Follow-up after treatment
- Follow-up with a specific specialist
- Follow-up at a specified interval

Scan:

- Plan
- Advice
- Instructions
- Assessment
- Clinical narrative
- Handwritten notes
- Marginal notes
- Continuation pages

Examples:

- "Review after 15 days"
- "Review after 15 days with blood test"
- "Follow up in 2 weeks"
- "Return after MRI"
- "Review after investigations"
- "Follow up with oncology"

============================================================
2. PRESERVE THE COMPLETE INSTRUCTION
============================================================

Preserve clinically meaningful details.

For example:

"Review after 15 days with blood test"

should retain both:

- timing: 15 days
- condition/context: blood test

Do not reduce it to:

"Review"

or:

"15 days"

when the additional information is explicitly documented.

============================================================
3. FOLLOW-UP TIMING
============================================================

Extract timing only when explicitly documented.

Examples:

- "after 15 days"
- "in 2 weeks"
- "next month"
- "after 3 months"

Do not convert an approximate expression into an exact calendar
date unless the document itself provides that date.

For example:

"after 15 days"

does not automatically become a calendar date during extraction.

============================================================
4. SPECIFIC FOLLOW-UP DATE
============================================================

If the doctor explicitly documents a calendar date for follow-up,
preserve that date.

Examples:

- "Review on 25 July 2026"
- "Follow up on 01/08/2026"

Do not confuse the follow-up date with:

- consultation date
- document date
- prescription date
- investigation date
- medication start date

============================================================
5. FOLLOW-UP WITH INVESTIGATIONS
============================================================

When follow-up is tied to an investigation, preserve the
relationship.

Example:

"Review after 15 days with blood test"

should retain:

- follow-up timing
- associated investigation

The investigation itself belongs to the investigation extraction
module, but the follow-up instruction should preserve the
relationship between the review and the investigation.

============================================================
6. FOLLOW-UP WITH TREATMENT
============================================================

If the doctor specifies follow-up after or during treatment,
preserve that context.

Examples:

- "Review after starting medication"
- "Review after completion of treatment"
- "Follow up after 2 cycles"

Do not infer treatment schedules that are not documented.

============================================================
7. FOLLOW-UP VS GENERAL INSTRUCTION
============================================================

Only place an item in follow-up when it actually describes a
future review, reassessment, return visit, or follow-up action.

Examples that belong in follow-up:

- "Review after 15 days"
- "Follow up in 2 weeks"

Examples that do NOT belong in follow-up:

- "Monitor BP"
- "Wear stockings"
- "Take medication after food"

Those belong to doctor instructions or medication instructions.

============================================================
8. DUPLICATES
============================================================

Avoid duplicate follow-up entries when the same instruction is
repeated in multiple sections.

If the same follow-up appears in both:

- Plan
- Advice
- Follow-up section

return it once, preserving the most complete wording.

============================================================
9. SOURCE FIDELITY
============================================================

Use only follow-up information explicitly supported by the
uploaded doctor's note.

Do not infer:

- follow-up date
- follow-up interval
- appointment schedule
- investigation timing
- treatment timing

If the doctor did not specify it, do not invent it.

============================================================
10. EMPTY RESULT
============================================================

If no follow-up information is documented, return the appropriate
empty follow-up structure required by the overall Doctor's Notes
output contract.

Return the final follow-up data through the overall JSON contract.
`;