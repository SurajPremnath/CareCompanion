export const DOCTOR_NOTES_MEDICATION_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — MEDICATIONS
============================================================

OBJECTIVE

Extract medicines that are explicitly documented in the doctor's
note, especially medicines that are newly prescribed, continued,
stopped, changed, or specifically discussed by the doctor.

The medication extraction must preserve clinically meaningful
details without inventing missing information.

TARGET ARRAY / OBJECT:

Use the medication structure defined by the overall Doctor's Notes
output contract.

============================================================
1. WHAT TO EXTRACT
============================================================

Look throughout the complete document for:

- Prescription / medication sections
- Plan
- Treatment plan
- New medicines
- Continued medicines
- Changed medicines
- Stopped medicines
- Medicines mentioned in handwritten notes
- Medicines mentioned in marginal notes
- Medicines mentioned on continuation pages

Examples:

- "Tab Capmatinib 200mg 1-0-1 daily"
- "Continue statin"
- "Stop aspirin"
- "Increase dose"
- "Start antibiotics"

============================================================
2. PRESERVE THE DOCUMENTED MEDICATION
============================================================

Preserve the medicine name as documented.

Capture when explicitly available:

- medicineName
- strength
- dosage
- frequency
- route
- duration
- timing
- status
- instructions

Do not invent any missing medication information.

For example:

"Tab Capmatinib 200mg 1-0-1 daily"

should preserve:

- medicine name: Capmatinib
- strength: 200 mg
- dosing pattern: 1-0-1
- frequency/instruction: daily

Do not convert an undocumented detail into a presumed value.

============================================================
3. MEDICATION STATUS
============================================================

When the document clearly indicates medication status, preserve it.

Examples:

- "Start Capmatinib" → newly prescribed
- "Continue Capmatinib" → continued
- "Stop Capmatinib" → stopped
- "Increase Capmatinib to 200 mg" → dose changed
- "Reduce dose" → dose changed

Do not infer status merely because a medicine appears in the
document.

============================================================
4. DO NOT INVENT DOSING
============================================================

Do not infer:

- frequency
- dose
- duration
- route
- timing

from standard medical knowledge.

If the document says:

"Capmatinib 200mg"

do not automatically create:

"twice daily"

unless the document explicitly supports it.

============================================================
5. MEDICATION VS DOCTOR INSTRUCTION
============================================================

Medication-specific administration instructions may be retained
inside the medication object.

Examples:

- "Take after food"
- "Take before breakfast"
- "At bedtime"

Do not unnecessarily duplicate these as standalone doctor
instructions when they apply only to the medicine.

However, if the doctor gives a broader patient instruction that
extends beyond the medication itself, preserve that instruction
through the Doctor Instructions module.

============================================================
6. MEDICATION VS INVESTIGATION
============================================================

Do not extract investigations as medicines.

Examples:

- PET CT
- MRI Brain
- Blood test
- Biopsy
- IHC
- PDL1
- NGS

are investigations.

============================================================
7. MEDICATION VS DIAGNOSIS
============================================================

Do not extract diagnoses as medicines.

Examples:

- Hypertension
- Diabetes
- COPD
- Metastatic disease

are clinical conditions, not medications.

============================================================
8. BRAND AND GENERIC NAMES
============================================================

Preserve the documented medicine name.

If both brand and generic names are explicitly documented,
preserve both where supported by the output contract.

Do not infer a generic equivalent from a brand name.

Do not infer a brand from a generic name.

============================================================
9. DUPLICATES
============================================================

If the same medicine appears multiple times, consolidate only
when the entries clearly refer to the same medication.

Do not accidentally merge two different strengths or dosing
instructions.

For example:

"Capmatinib 200 mg"

and:

"Capmatinib 400 mg"

must not be silently merged into one medication.

============================================================
10. SOURCE FIDELITY
============================================================

Use only medication information explicitly supported by the
uploaded doctor's note.

Do not infer a medication because it is commonly used for:

- a diagnosis
- a symptom
- an investigation result
- a clinical condition

If the medicine is not documented, do not add it.

============================================================
11. EMPTY RESULT
============================================================

If no medication is documented:

return the appropriate empty medication structure required by
the overall Doctor's Notes output contract.

Do not create a medication merely because the document discusses
a treatment plan.

Return the final medication data through the overall JSON contract.
`;