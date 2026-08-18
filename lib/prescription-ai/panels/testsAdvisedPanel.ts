/**
 * Tests Advised Panel
 *
 * Single responsibility:
 * Extract investigations/tests/procedures that the doctor explicitly
 * advises, orders, recommends, requests or plans for the patient.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * IMPORTANT:
 * This panel does NOT extract completed investigation results.
 * That responsibility belongs to InvestigationsPanel.
 */

export const TESTS_ADVISED_PANEL_RULES = `
============================================================
TESTS ADVISED PANEL
============================================================

PURPOSE
Identify tests, investigations or procedures that the doctor
explicitly wants the patient to undergo.

This panel answers:

"What test/procedure does the doctor want done?"

This panel is prospective/advisory in nature.


============================================================
1. WHAT QUALIFIES
============================================================

Include a test/procedure when the document explicitly states that
the doctor wants it:

- Ordered
- Advised
- Recommended
- Requested
- Planned
- Scheduled
- Asked the patient to undergo
- Asked the patient to get
- Asked the patient to repeat

Examples:

"PET CT advised."

→ PET CT

"Get MRI brain."

→ MRI brain

"Repeat CBC after 1 week."

→ CBC

"NGS recommended."

→ NGS

"Plan bronchoscopy."

→ Bronchoscopy


============================================================
2. EXPLICIT ACTION IS REQUIRED
============================================================

The investigation must have an explicit future/prospective action.

Do NOT create a test advised merely because an investigation is
mentioned.

Example:

"PET CT shows liver metastases."

→ NOT TestsAdvisedPanel

Example:

"Previous PET CT showed progression."

→ NOT TestsAdvisedPanel

Example:

"PET CT advised."

→ TestsAdvisedPanel


============================================================
3. INVESTIGATION RESULT VS TEST ADVISED
============================================================

This distinction is mandatory.

Example:

"PET CT - left lung lesion with liver and bone metastases."

InvestigationsPanel:
PET CT

Result:
left lung lesion with liver and bone metastases

TestsAdvisedPanel:
[]

Example:

"Repeat PET CT advised."

InvestigationsPanel:
[]

TestsAdvisedPanel:
PET CT

Example:

"Previous PET CT showed progression. Repeat PET CT advised."

InvestigationsPanel:
PET CT
Result:
progression
Status:
Previous

TestsAdvisedPanel:
PET CT
Action:
Repeat


============================================================
4. HISTORICAL INVESTIGATIONS
============================================================

Do NOT treat historical investigations as newly advised tests.

Examples:

- Previous MRI
- Prior PET CT
- Had biopsy
- Underwent CT
- History of colonoscopy
- Biopsy performed last year

These belong to the appropriate historical/investigation context.

Only include them here if the document explicitly requests a
new/repeat investigation.


============================================================
5. EXISTING RESULTS
============================================================

A result does not mean the test was advised during the current
consultation.

Example:

"Blood test normal."

→ InvestigationsPanel

NOT:

→ TestsAdvisedPanel


============================================================
6. REPEAT TESTS
============================================================

Explicitly requested repeat testing belongs here.

Examples:

- Repeat CBC
- Repeat CT
- Repeat PET CT
- Repeat LFT
- Repeat blood work

Preserve the fact that the test is being repeated.

Example:

"Repeat CBC after 2 weeks."

test:
CBC

action:
Repeat

timing:
after 2 weeks


============================================================
7. TESTS ADVISED WITH TIMING
============================================================

Preserve explicit timing associated with the advised test.

Examples:

"Blood test after 1 week."

"PET CT next month."

"Repeat CBC in 2 weeks."

Do not invent timing.

If no timing is documented:

timing = null


============================================================
8. CONDITIONAL TESTS
============================================================

Capture conditional tests when the condition is explicitly stated.

Examples:

"Do MRI if symptoms worsen."

"Repeat CT if fever persists."

Preserve the condition.

Example:

{
  "test": "MRI",
  "condition": "if symptoms worsen"
}


============================================================
9. TESTS DEPENDENT ON FOLLOW-UP
============================================================

A test may be explicitly linked to a future review.

Example:

"Do blood tests and review after results."

TestsAdvisedPanel:
- Blood tests

FollowUpPlanPanel:
- Review after results

Do not place the complete follow-up instruction inside the test name.


============================================================
10. MULTIPLE TESTS
============================================================

Extract each distinct advised test separately.

Example:

"Get CBC, LFT and KFT before review."

Return:

- CBC
- LFT
- KFT

Do not combine them into one vague item such as:

"Blood tests"


============================================================
11. TEST GROUPS
============================================================

If the doctor explicitly uses a meaningful group name, preserve it.

Examples:

- Complete blood count
- Liver function tests
- Renal function tests
- Thyroid profile
- Cardiac workup

Do not expand a group into individual tests unless the individual
tests are explicitly documented.


============================================================
12. PROCEDURES
============================================================

Procedures can also be advised.

Examples:

- Biopsy advised
- Bronchoscopy planned
- Endoscopy recommended
- Surgery consultation requested

Only include the procedure when the doctor explicitly requests,
plans or recommends it.


============================================================
13. REFERRALS ARE NOT AUTOMATICALLY TESTS
============================================================

A referral to another doctor is not a test.

Example:

"Refer to cardiologist."

→ NOT TestsAdvisedPanel

This belongs to the appropriate instruction/follow-up context.

If a referral explicitly includes a test:

"Cardiology review with ECG."

Then:

ECG → TestsAdvisedPanel

The referral itself remains outside this panel.


============================================================
14. MEDICINES ARE NOT TESTS
============================================================

Do not extract medicines here.

Example:

"Start capmatinib and repeat CBC."

TestsAdvisedPanel:
CBC

MedicationPanel:
capmatinib


============================================================
15. SYMPTOMS ARE NOT TESTS
============================================================

Do not create a test from a symptom.

Example:

"Persistent cough."

→ SymptomsPanel

Not:

→ TestsAdvisedPanel


============================================================
16. DIAGNOSIS IS NOT A TEST
============================================================

Do not create a test from a diagnosis.

Example:

"Metastatic NSCLC."

→ CurrentStateOfHealthPanel

Not:

→ TestsAdvisedPanel


============================================================
17. TEST MENTIONED IN ANOTHER REPORT
============================================================

A supporting report may mention another test.

Do not treat that mention as a current advised test.

Example:

PET CT report:
"Previous MRI brain was normal."

→ NOT TestsAdvisedPanel

Only explicit current instructions from the relevant document
establish a test as advised.


============================================================
18. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- Application context
- Previous patient records
- Database information
- External medical knowledge
- Assumptions
- Clinical inference


============================================================
19. ANTI-HALLUCINATION
============================================================

NEVER:

- infer a test from a diagnosis
- infer a test from a medicine
- infer a test from a symptom
- infer a test from a previous result
- infer a test from a historical investigation
- infer a test from a report
- convert every investigation mention into an advised test
- invent timing
- invent conditions
- invent a repeat instruction


============================================================
20. STRICT SCOPE
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
- Historical investigations
- Previous treatments
- Previous procedures

Symptoms:
- Symptoms
- Complaints

Investigations:
- Completed investigations
- Investigation results
- Historical investigation findings

Medication:
- Medicines
- Dose
- Frequency
- Duration

Instructions:
- General doctor advice

Follow-up:
- Review plan


============================================================
21. OUTPUT
============================================================

This panel contributes ONLY advised tests/procedures.

Recommended structure:

{
  "testsAdvised": [
    {
      "test": string,
      "action": string | null,
      "timing": string | null,
      "condition": string | null
    }
  ]
}

Examples:

{
  "test": "PET CT",
  "action": "Advised",
  "timing": null,
  "condition": null
}

{
  "test": "CBC",
  "action": "Repeat",
  "timing": "after 2 weeks",
  "condition": null
}

Use null where information is not explicitly documented.


============================================================
22. FINAL VALIDATION
============================================================

Before returning a test:

1. Is there an explicit instruction/action to perform the test?
2. Is the test prospective rather than historical?
3. Is it different from an already completed investigation?
4. If repeat testing is requested, is "repeat" preserved?
5. Is timing explicitly documented?
6. Is any condition explicitly documented?
7. Has a result been kept out of this panel?
8. Has a historical investigation been kept out?
9. Has a medicine been kept out?
10. Has a diagnosis been kept out?
11. Has no test been inferred?

If there is no explicit evidence that the test is advised:

DO NOT INCLUDE IT.

END TESTS ADVISED PANEL
`;