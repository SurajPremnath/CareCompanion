/**
 * Instructions Panel
 *
 * Single responsibility:
 * Extract explicit instructions/advice communicated by the
 * doctor to the patient or caregiver.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel captures ACTION/ADVICE.
 * The object being acted upon belongs to its appropriate panel.
 */

export const INSTRUCTIONS_PANEL_RULES = `
============================================================
INSTRUCTIONS PANEL
============================================================

PURPOSE
Identify explicit instructions, advice, precautions and actions
communicated by the doctor to the patient or caregiver.

This panel answers:

"What does the doctor want the patient/caregiver to do?"

This panel is responsible ONLY for instructions and advice.


============================================================
1. WHAT COUNTS AS AN INSTRUCTION
============================================================

Capture explicit advice or action communicated by the doctor.

Examples:

- Monitor blood pressure.
- Monitor pulse.
- Take adequate fluids.
- Follow a low-salt diet.
- Avoid strenuous activity.
- Use compression stockings.
- Steam inhalation twice daily.
- Gargle with warm water.
- Maintain hydration.
- Rest.
- Continue monitoring temperature.
- Keep the wound clean.
- Take medication after food.

The instruction must be explicitly documented.

Do not invent advice based on clinical knowledge.


============================================================
2. INSTRUCTION VS MEDICATION
============================================================

MedicationPanel owns the medicine.

InstructionsPanel owns the instruction associated with the medicine.

Example:

"Capmatinib 200 mg twice daily after food."

MedicationPanel:

Medicine:
"Capmatinib"

Strength:
"200 mg"

Frequency:
"twice daily"

InstructionsPanel:

"Take after food."

Do not duplicate the complete medicine prescription inside
InstructionsPanel.


============================================================
3. INSTRUCTION VS TEST ADVISED
============================================================

TestsAdvisedPanel owns the test.

InstructionsPanel may retain the surrounding action only when it is
genuinely an instruction rather than the test itself.

Example:

"Get CBC after 1 week."

TestsAdvisedPanel:
CBC
Timing:
after 1 week

InstructionsPanel:
[]

Do not create:

"Instruction: get CBC"

when the same information is already represented by
TestsAdvisedPanel.


============================================================
4. INSTRUCTION VS FOLLOW-UP
============================================================

FollowUpPlanPanel owns review/follow-up arrangements.

Example:

"Review after 2 weeks."

FollowUpPlanPanel:
"Review after 2 weeks."

InstructionsPanel:
[]

Example:

"Monitor BP daily and review after 2 weeks."

InstructionsPanel:
"Monitor BP daily."

FollowUpPlanPanel:
"Review after 2 weeks."

Keep the two concepts separate.


============================================================
5. MONITORING INSTRUCTIONS
============================================================

Capture explicit monitoring advice.

Examples:

- Monitor BP.
- Monitor pulse.
- Monitor temperature.
- Check SpO2.
- Monitor blood sugar.
- Record weight daily.
- Maintain a symptom diary.

Preserve explicit frequency or timing.

Example:

"Check BP twice daily."

Instruction:
"Check BP twice daily."


============================================================
6. DIETARY INSTRUCTIONS
============================================================

Capture explicit dietary advice.

Examples:

- Low-salt diet
- Diabetic diet
- High-protein diet
- Avoid oily foods
- Increase fluid intake
- Restrict fluids

Preserve quantities or conditions when explicitly documented.

Do not infer dietary advice from diagnosis.


============================================================
7. ACTIVITY / LIFESTYLE INSTRUCTIONS
============================================================

Capture explicit lifestyle and activity advice.

Examples:

- Avoid strenuous activity.
- Bed rest.
- Walk as tolerated.
- Avoid heavy lifting.
- Stop smoking.
- Maintain hydration.
- Sleep adequately.

Do not manufacture lifestyle advice based on disease.


============================================================
8. HOME-CARE INSTRUCTIONS
============================================================

Capture explicit home-care instructions.

Examples:

- Wound care
- Dressing instructions
- Steam inhalation
- Gargling
- Physiotherapy
- Nebulization instructions
- Positioning
- Hygiene instructions

Preserve:

- frequency
- duration
- timing
- method

when explicitly documented.


============================================================
9. PRECAUTIONS / AVOIDANCE
============================================================

Capture explicit precautions.

Examples:

- Avoid alcohol.
- Avoid driving.
- Avoid NSAIDs.
- Avoid strenuous exercise.
- Avoid exposure to infection.
- Do not stop medication without medical advice.

Do not infer precautions.


============================================================
10. CONDITIONAL INSTRUCTIONS
============================================================

Preserve explicit conditions.

Examples:

"Use inhaler if breathlessness occurs."

Instruction:
"Use inhaler if breathlessness occurs."

"Take paracetamol if temperature exceeds 100°F."

Instruction:
"Take paracetamol if temperature exceeds 100°F."

Do not remove the condition.


============================================================
11. FREQUENCY / TIMING / DURATION
============================================================

Preserve explicit timing information.

Examples:

- twice daily
- once at night
- after meals
- before breakfast
- for 5 days
- every 4 hours
- as needed

Do not invent frequency or duration.

Do not convert a vague instruction into a precise schedule.


============================================================
12. "AS NEEDED" INSTRUCTIONS
============================================================

Preserve explicit PRN / as-needed instructions.

Example:

"Paracetamol SOS for fever."

MedicationPanel:
Paracetamol
SOS

InstructionsPanel:
Only the additional instruction if one exists.

Do not create a new schedule.


============================================================
13. PATIENT / CAREGIVER ACTION
============================================================

Capture instructions directed to:

- Patient
- Caregiver
- Family member

when explicitly documented.

Do not confuse instructions directed to medical staff with
patient-facing instructions unless the document clearly intends
them for the patient/caregiver.


============================================================
14. EXAMINATION FINDINGS ARE NOT INSTRUCTIONS
============================================================

Do not convert clinical findings into instructions.

Example:

"BP 114/78."

→ VitalsPanel

Example:

"Chest clear."

→ Examination/clinical assessment context

Not:

→ InstructionsPanel


============================================================
15. DIAGNOSIS IS NOT AN INSTRUCTION
============================================================

Do not convert a diagnosis into advice.

Example:

"Metastatic NSCLC."

→ CurrentStateOfHealthPanel

Not:

→ InstructionsPanel


============================================================
16. CLINICAL HISTORY IS NOT AN INSTRUCTION
============================================================

Historical information is not an instruction.

Example:

"Received chemotherapy previously."

→ ClinicalHistoryPanel

Not:

→ InstructionsPanel


============================================================
17. RESULTS ARE NOT INSTRUCTIONS
============================================================

Investigation findings do not belong here.

Example:

"PET CT shows progression."

→ InvestigationsPanel

Not:

→ InstructionsPanel


============================================================
18. GENERAL MEDICAL KNOWLEDGE
============================================================

Do not generate instructions that are medically reasonable but
not explicitly documented.

Example:

If the document says:

"Hypertension"

Do NOT automatically create:

"Monitor BP."

Example:

If the document says:

"Pneumonia"

Do NOT automatically create:

"Drink plenty of fluids."

Only explicit instructions may be extracted.


============================================================
19. DUPLICATE INSTRUCTIONS
============================================================

Do not create duplicate instruction entries when the same instruction
appears multiple times and clearly refers to the same action.

Preserve meaningful differences in:

- frequency
- timing
- condition
- duration


============================================================
20. MULTIPLE INSTRUCTIONS
============================================================

Extract distinct instructions separately when they represent
different actions.

Example:

"Monitor BP daily, restrict salt and walk for 30 minutes."

Return:

1. Monitor BP daily.
2. Restrict salt.
3. Walk for 30 minutes.

Do not collapse unrelated actions into one vague statement.


============================================================
21. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- Application context
- Previous patient records
- Database information
- External medical knowledge
- Diagnosis inference
- Medication inference
- Investigation inference


============================================================
22. ANTI-HALLUCINATION
============================================================

NEVER:

- invent advice
- infer advice from diagnosis
- infer advice from medication
- infer advice from investigation results
- infer diet from disease
- infer monitoring from abnormal vitals
- invent timing
- invent frequency
- invent duration
- turn a diagnosis into an instruction
- turn a test result into an instruction


============================================================
23. STRICT SCOPE
============================================================

THIS PANEL MUST NOT OWN:

Patient:
- Name
- Age
- Sex
- Name Variations

Doctor:
- Doctor Name
- Doctor Type
- Doctor Designation

Hospital:
- UHID
- Hospital
- Hospital Location

Document:
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

Current State:
- Diagnosis
- Disease status
- Stage
- Clinical assessment

History:
- Previous treatment
- Previous procedures
- Previous events

Symptoms:
- Symptoms
- Complaints

Investigations:
- Investigation names
- Investigation results

Tests Advised:
- Tests ordered/advised/planned

Medication:
- Medicine name
- Strength
- Dose
- Frequency
- Duration

Follow-up:
- Review timing
- Reassessment
- Return instructions


============================================================
24. OUTPUT
============================================================

This panel contributes ONLY instructions.

Recommended structure:

{
  "instructions": [
    {
      "instruction": string,
      "timing": string | null,
      "frequency": string | null,
      "duration": string | null,
      "condition": string | null
    }
  ]
}

Use null when a qualifier is not explicitly documented.

Do not manufacture missing information.


============================================================
25. FINAL VALIDATION
============================================================

Before returning an instruction:

1. Is there an explicit instruction/advice?
2. Is the action directed to the patient/caregiver where appropriate?
3. Is it distinct from a medication itself?
4. Is it distinct from a test being advised?
5. Is it distinct from follow-up?
6. Is timing explicitly documented?
7. Is frequency explicitly documented?
8. Is duration explicitly documented?
9. Is any condition explicitly documented?
10. Has no advice been inferred from medical knowledge?
11. Has no information belonging to another panel been extracted?

When uncertain, do not guess.

END INSTRUCTIONS PANEL
`;