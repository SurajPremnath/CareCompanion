/**
 * Medication Panel
 *
 * Single responsibility:
 * Extract medicines and explicitly documented prescription details.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel identifies the medication.
 * It does NOT determine diagnosis, clinical rationale, or follow-up.
 */

export const MEDICATION_PANEL_RULES = `
============================================================
MEDICATION PANEL
============================================================

PURPOSE
Identify medicines explicitly documented in the supplied medical
document and extract only the medication-related information
actually supported by the source.

This panel answers:

"What medicine is documented, and what was explicitly prescribed,
recommended, continued, changed or stopped?"

============================================================
1. MEDICATION NAME
============================================================

Extract the medicine name exactly as documented.

Capture:

- Brand name
- Generic name
- Combination medicine
- Formulation when clinically relevant

Examples:

"Rahika"
"Capmatinib"
"Metformin 500 mg"
"Paracetamol"
"Amoxicillin-Clavulanate"

Do not invent a generic/brand equivalent.

If both brand and generic names are explicitly documented, preserve
both.

Do not use external drug databases to resolve an unclear name.


============================================================
2. STRENGTH
============================================================

Extract explicitly documented strength.

Examples:

- 200 mg
- 500 mg
- 40 mg
- 5 mg/mL

Do not infer strength from:

- medicine name
- usual dosage
- previous prescription
- external drug knowledge

If strength is not documented:

strength = null


============================================================
3. DOSE
============================================================

Extract the explicitly documented amount to be taken per administration.

Examples:

- 1 tablet
- 2 tablets
- 5 mL
- 1 capsule
- ½ tablet

Do not convert dosage into a different form unless explicitly
required by the source.

Do not infer tablet/capsule count from frequency.


============================================================
4. FREQUENCY
============================================================

Extract the explicitly documented frequency.

Examples:

- Once daily
- Twice daily
- Three times daily
- OD
- BD
- TDS
- QID
- Weekly
- Every 8 hours

Normalize only unambiguous standard abbreviations where the meaning
is certain.

Examples:

OD → Once daily
BD → Twice daily
TDS → Three times daily
QID → Four times daily

If ambiguous:

frequency = null

Do not infer frequency from the medicine or strength.


============================================================
5. TIMING
============================================================

Capture explicit timing instructions associated with the medicine.

Examples:

- Before breakfast
- After food
- At bedtime
- In the morning
- At night
- With meals
- Before meals

Do not invent timing from common prescribing practice.

If no timing is documented:

timing = null


============================================================
6. ROUTE
============================================================

Capture route only when explicitly documented.

Examples:

- Oral
- IV
- IM
- SC
- Topical
- Inhaled
- Sublingual

Do not infer route from formulation alone unless the route is
unambiguous and explicitly represented by the document.


============================================================
7. DURATION
============================================================

Capture explicitly documented treatment duration.

Examples:

- 5 days
- 7 days
- 2 weeks
- 1 month
- Until review
- Continue indefinitely

Do not infer duration from the quantity supplied.

Example:

"10 tablets"

does NOT mean:

"10 days"


============================================================
8. MEDICATION ACTION / STATUS
============================================================

Capture the explicit medication action when documented.

Supported concepts include:

- Start
- Initiate
- Continue
- Maintain
- Stop
- Discontinue
- Hold
- Resume
- Restart
- Increase
- Decrease
- Change
- Replace
- Switch
- Reduce
- Escalate

Example:

"Continue capmatinib 200 mg BD."

Action:
"Continue"


Example:

"Stop amlodipine."

Action:
"Stop"


Example:

"Increase metformin to 500 mg BD."

Action:
"Increase"


Do not infer action from the mere presence of a medicine.


============================================================
9. PRN / SOS
============================================================

Preserve explicit as-needed instructions.

Examples:

- SOS
- PRN
- As needed
- When required

Example:

"Paracetamol 650 mg SOS."

Frequency/action:
"As needed"

Do not invent a maximum daily frequency unless explicitly documented.


============================================================
10. MEDICATION-SPECIFIC INSTRUCTIONS
============================================================

Capture instructions that directly modify how the medicine should
be taken when explicitly documented.

Examples:

- Take after food
- Take before breakfast
- Take at bedtime
- Take with water
- Shake well before use
- Apply to affected area
- Use inhaler after meals

The medicine itself belongs here.

General lifestyle or medical advice belongs to InstructionsPanel.


============================================================
11. CURRENT MEDICATION VS HISTORICAL MEDICATION
============================================================

This distinction is mandatory.

Current prescription:

"Continue capmatinib 200 mg twice daily."

→ MedicationPanel

Historical:

"Previously received capmatinib."

→ ClinicalHistoryPanel

Historical:

"Was on metformin previously."

→ ClinicalHistoryPanel

Current:

"Start metformin 500 mg once daily."

→ MedicationPanel


============================================================
12. MEDICATION MENTIONED IN CLINICAL HISTORY
============================================================

A medicine mentioned as part of previous treatment is NOT a current
prescription.

Example:

"Previously treated with osimertinib."

Do not create:

Medication:
osimertinib

unless the document separately establishes it as current.


============================================================
13. MEDICATION IN INVESTIGATION REPORTS
============================================================

A medicine appearing in a supporting report does not automatically
represent a current prescription.

Example:

"Current medications include..."

If the report clearly presents a medication list as current, it may
be extracted.

Otherwise do not assume that a medicine mentioned in a report is
currently prescribed.


============================================================
14. MEDICATION VS DIAGNOSIS
============================================================

Do not infer diagnosis from medication.

Example:

"Capmatinib 200 mg BD."

Do NOT create:

Diagnosis:
"MET-positive lung cancer"

unless explicitly documented elsewhere.


============================================================
15. MEDICATION VS INSTRUCTION
============================================================

Keep medication facts separate from general instructions.

Example:

"Capmatinib 200 mg twice daily after food."

MedicationPanel:

Medicine:
Capmatinib

Strength:
200 mg

Frequency:
twice daily

Timing:
after food

InstructionsPanel should NOT duplicate the complete prescription.

If there is an additional instruction:

"Do not crush the tablet."

MedicationPanel:
medicine-specific instruction

InstructionsPanel:
may capture it only if the final orchestration contract
specifically requires patient-facing instruction duplication.

Avoid unnecessary duplication.


============================================================
16. MEDICATION VS FOLLOW-UP
============================================================

Do not extract follow-up into MedicationPanel.

Example:

"Continue capmatinib and review after 2 weeks."

MedicationPanel:
Continue capmatinib

FollowUpPlanPanel:
Review after 2 weeks


============================================================
17. DOSE CHANGES
============================================================

If the document explicitly changes the dose, preserve the new dose
and the action.

Example:

"Increase capmatinib to 400 mg daily."

Medication:
Capmatinib

Dose:
400 mg daily

Action:
Increase

Do not retain an old dose as the current dose unless the document
explicitly says both are relevant.


============================================================
18. STOP / HOLD MEDICATION
============================================================

If the doctor explicitly stops or holds a medicine, capture it.

Example:

"Hold aspirin."

Medication:
Aspirin

Action:
Hold

Do not treat a stopped/held medicine as an active medication.


============================================================
19. CONTINUE MEDICATION
============================================================

"Continue" is clinically meaningful.

Example:

"Continue current medications."

Do not invent the individual medicines if they are not identified.

Example:

"Continue capmatinib and metformin."

Capture both separately.


============================================================
20. MULTIPLE MEDICINES
============================================================

Extract each distinct medicine separately.

Example:

"Capmatinib 200 mg BD and paracetamol 650 mg SOS."

Return:

1. Capmatinib
2. Paracetamol

Do not combine them into one medication record.


============================================================
21. COMBINATION MEDICINES
============================================================

If the document explicitly identifies a combination medicine, preserve
the combination as documented.

Example:

"Amoxicillin + clavulanic acid 625 mg."

Do not split into separate medicines unless the source itself
clearly treats them separately.


============================================================
22. AMBIGUOUS HANDWRITING
============================================================

Medication names are high-risk for transcription errors.

If handwriting is genuinely unclear:

- do not guess from diagnosis
- do not guess from surrounding medicines
- do not guess from common prescribing patterns
- do not use external drug knowledge to complete the name

Return the uncertain field as null or flag it for validation according
to the output contract.

Never silently substitute a clinically plausible medicine.


============================================================
23. MEDICATION RECONCILIATION SAFETY
============================================================

If multiple documents contain the same medicine:

Do not automatically merge them.

Determine whether the document explicitly indicates:

- current
- previous
- stopped
- changed
- continued

If the documents represent different consultations, preserve the
document-specific medication information for the orchestrator to
reconcile.

This panel extracts evidence.
It does NOT decide cross-consultation medication history.


============================================================
24. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- application context
- database medication list
- previous patient records
- external drug databases
- standard dosing knowledge
- diagnosis-based inference
- age-based inference
- weight-based inference


============================================================
25. ANTI-HALLUCINATION
============================================================

NEVER:

- invent a medicine
- invent strength
- invent dose
- invent frequency
- invent timing
- invent route
- invent duration
- infer a medicine from diagnosis
- infer a medicine from symptoms
- infer a medicine from investigation results
- convert historical medication into current medication
- treat a stopped medicine as active
- assume "continue current medications" identifies specific medicines
- complete illegible handwriting using clinical expectation


============================================================
26. STRICT SCOPE
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
- Previous medication unless explicitly relevant to reconciliation

Symptoms:
- Current symptoms

Investigations:
- Investigation names
- Investigation results

Tests Advised:
- Tests ordered/advised/planned

Instructions:
- General medical advice
- Lifestyle advice
- Monitoring advice not specific to a medicine

Follow-up:
- Review plan
- Return instructions


============================================================
27. OUTPUT
============================================================

This panel contributes ONLY medication information.

Recommended structure:

{
  "medications": [
    {
      "name": string,
      "genericName": string | null,
      "brandName": string | null,
      "strength": string | null,
      "dose": string | null,
      "frequency": string | null,
      "timing": string | null,
      "route": string | null,
      "duration": string | null,
      "action": string | null,
      "instruction": string | null
    }
  ]
}

Use null for information that is not explicitly documented.

Do not manufacture missing fields.


============================================================
28. FINAL VALIDATION
============================================================

Before returning each medication:

1. Is the medicine explicitly documented?
2. Is it current, newly started, continued, changed, stopped or
   otherwise explicitly actioned?
3. Is the medicine name actually readable?
4. Is strength explicitly documented?
5. Is dose explicitly documented?
6. Is frequency explicitly documented?
7. Is timing explicitly documented?
8. Is route explicitly documented?
9. Is duration explicitly documented?
10. Is action explicitly documented?
11. Is it historical rather than current?
12. Has no medication been inferred?
13. Has no diagnosis been inferred?
14. Has no general instruction been incorrectly placed here?
15. Has no follow-up been placed here?

When uncertain, return null rather than guessing.

END MEDICATION PANEL
`;