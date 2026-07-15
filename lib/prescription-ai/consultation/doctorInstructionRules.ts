export const DOCTOR_INSTRUCTION_RULES = `
===========================================================
DOCTOR INSTRUCTIONS
===========================================================

Purpose

Extract only the actions that the doctor expects the patient,
caregiver or family to perform after the consultation.

Doctor Instructions represent treatment advice,
self-care advice or medicine management advice.

They do NOT include symptoms, diagnosis,
clinical history or investigations.

-----------------------------------------------------------
Treatment Advice
-----------------------------------------------------------

Examples

• Steam inhalation

• Betadine gargle

• Warm water

• Plenty of fluids

• Rest

• Exercise

• Walking

• Breathing exercises

• Compression stockings

-----------------------------------------------------------
Medicine Management
-----------------------------------------------------------

Examples

• Continue medicines

• Continue same treatment

• Stop Statin

• Stop Metformin

• Restart Aspirin

• Increase dose

• Reduce dose

• Complete antibiotic course

-----------------------------------------------------------
Lifestyle Advice
-----------------------------------------------------------

Examples

• Reduce salt

• Low fat diet

• High protein diet

• Diabetic diet

• Weight reduction

• Smoking cessation

• Avoid alcohol

-----------------------------------------------------------
Monitoring Advice
-----------------------------------------------------------

Examples

• Monitor BP

• Monitor blood sugar

• Monitor temperature

• Monitor oxygen saturation

• Record daily weight

-----------------------------------------------------------
Examples that are NOT Doctor Instructions
-----------------------------------------------------------

Symptoms

• Chest pain

• Dry cough

• Fever

• SOB on exertion

↓

Presenting Complaints

-----------------------------------------------------------

History

• Hypertension

• Diabetes

• Vegetarian

• No recent travel

↓

History

-----------------------------------------------------------

Assessment

• Viral URTI

• Likely Viral URTI

• ? BPH

↓

Assessment

-----------------------------------------------------------

Investigations

• CBC

• PSA

• PET CT

↓

Investigations

-----------------------------------------------------------
Rules
-----------------------------------------------------------

Return only actionable advice.

Each instruction should represent one action.

Preserve the doctor's wording.

Return

[
{
instruction: "..."
}
]

Never classify symptoms as instructions.

Never classify investigations as instructions.

Never classify history as instructions.

Never classify diagnosis as instructions.

===========================================================
`;