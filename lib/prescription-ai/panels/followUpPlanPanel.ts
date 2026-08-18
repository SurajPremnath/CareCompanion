/**
 * Follow-Up Plan Panel
 *
 * Single responsibility:
 * Extract explicitly documented follow-up, review and reassessment
 * plans from the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel captures what happens NEXT.
 */

export const FOLLOW_UP_PLAN_PANEL_RULES = `
============================================================
FOLLOW-UP PLAN PANEL
============================================================

PURPOSE
Identify explicit follow-up, review, reassessment and return plans
documented by the doctor.

This panel answers:

"What is the planned next clinical interaction or reassessment?"

This panel is responsible ONLY for follow-up planning.


============================================================
1. WHAT COUNTS AS FOLLOW-UP
============================================================

Capture explicit instructions concerning a future review,
reassessment or return to care.

Examples:

- Review after 2 weeks.
- Follow up in 1 month.
- Return after PET CT.
- Review with oncology after NGS results.
- Come back in 7 days.
- Follow up as needed.
- Review after completion of treatment.
- Reassess after blood results.


============================================================
2. REVIEW TIMING
============================================================

Capture explicitly documented timing.

Examples:

- after 1 week
- in 2 weeks
- in 1 month
- next month
- after 3 cycles
- after test results
- on 20/08/2026

Do not calculate dates.

Do not convert vague timing into an exact date.

Example:

"Review in 2 weeks."

Do not calculate the calendar date.


============================================================
3. EXACT FOLLOW-UP DATE
============================================================

If an exact future review date is explicitly documented, preserve it.

Example:

"Review on 25/08/2026."

Follow-up date:
"25/08/2026"

Do not confuse:

- document date
- prescription date
- report date
- admission date
- discharge date

with the follow-up date.


============================================================
4. FOLLOW-UP TRIGGER / CONDITION
============================================================

Capture explicit conditions that determine when follow-up should
occur.

Examples:

- Review after PET CT.
- Review after NGS results.
- Follow up after blood tests.
- Return if symptoms worsen.
- Review after completion of chemotherapy.

Preserve the condition exactly enough to retain its clinical meaning.


============================================================
5. TEST RESULT DEPENDENCY
============================================================

When follow-up depends on an investigation result, separate the
follow-up from the test itself.

Example:

"Do CBC and review after results."

TestsAdvisedPanel:
CBC

FollowUpPlanPanel:
Review after results

Do not place "CBC" as the follow-up itself.


============================================================
6. MEDICATION DEPENDENCY
============================================================

When follow-up depends on medication treatment:

Example:

"Continue medication and review after 2 weeks."

MedicationPanel:
Continue medication

FollowUpPlanPanel:
Review after 2 weeks

Do not duplicate the medication prescription.


============================================================
7. FOLLOW-UP VS GENERAL INSTRUCTION
============================================================

General advice is not automatically follow-up.

Example:

"Monitor BP daily."

→ InstructionsPanel

Example:

"Review BP after 2 weeks."

→ FollowUpPlanPanel


============================================================
8. FOLLOW-UP VS TEST ADVISED
============================================================

A test is not itself a follow-up plan.

Example:

"PET CT advised."

→ TestsAdvisedPanel

Example:

"Review after PET CT."

→ FollowUpPlanPanel

Example:

"PET CT advised and review after results."

TestsAdvisedPanel:
PET CT

FollowUpPlanPanel:
Review after results


============================================================
9. FOLLOW-UP VS CURRENT ASSESSMENT
============================================================

Current clinical status does not belong here.

Example:

"Disease is currently stable."

→ CurrentStateOfHealthPanel

Example:

"Review in 4 weeks."

→ FollowUpPlanPanel


============================================================
10. ROUTINE FOLLOW-UP
============================================================

Capture routine planned review when explicitly documented.

Examples:

- Routine review in 3 months.
- Follow up next month.
- Review after next cycle.
- Return for follow-up.


============================================================
11. CONDITIONAL RETURN / SAFETY-NETTING
============================================================

Capture explicit return instructions that establish a future clinical
contact condition.

Examples:

- Return if fever persists.
- Come back if breathlessness worsens.
- Review earlier if symptoms worsen.
- Return immediately if bleeding occurs.

These belong here when they explicitly establish a return/review
condition.

Do not infer emergency advice that is not documented.


============================================================
12. "AS NEEDED" FOLLOW-UP
============================================================

Preserve explicit PRN follow-up.

Examples:

- Follow up as needed.
- Review PRN.
- Return if required.

Do not convert this into a specific time period.


============================================================
13. MULTIPLE FOLLOW-UP PLANS
============================================================

If the document contains multiple distinct future plans, preserve
each meaningful plan separately.

Example:

"Review after PET CT. Routine oncology review in 4 weeks."

Return:

1. Review after PET CT.
2. Routine oncology review in 4 weeks.

Do not collapse distinct follow-up plans.


============================================================
14. MULTIPLE DOCTORS
============================================================

If a follow-up explicitly specifies a doctor or specialty, preserve
that relationship.

Example:

"Follow up with Dr. Kumar in 2 weeks."

Follow-up:

Doctor:
Dr. Kumar

Timing:
2 weeks

Do not infer that Dr. Kumar is the consulting doctor unless the
DoctorPanel independently establishes that role.


============================================================
15. FOLLOW-UP LOCATION
============================================================

If the document explicitly specifies where the follow-up should
occur, preserve it.

Example:

"Review at oncology clinic after NGS."

Follow-up location:
oncology clinic

Do not infer a location from the hospital name.


============================================================
16. FOLLOW-UP AFTER PROCEDURE / TREATMENT
============================================================

Capture explicit follow-up linked to treatment or procedure.

Examples:

- Review after chemotherapy.
- Review after surgery.
- Follow up after biopsy.
- Reassess after radiation.

Do not infer a follow-up merely because a treatment normally requires
one.


============================================================
17. HISTORICAL FOLLOW-UP
============================================================

Do not extract a follow-up that already occurred as a current future
plan.

Example:

"Patient was reviewed 2 weeks ago."

This is historical information.

It does NOT create:

Follow-up:
"Review in 2 weeks"


============================================================
18. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- Application context
- Previous records
- Database information
- External medical knowledge
- Standard clinical practice
- Inferred appointment schedules


============================================================
19. ANTI-HALLUCINATION
============================================================

NEVER:

- invent a follow-up date
- calculate a future date
- infer routine follow-up
- infer follow-up from medication duration
- infer follow-up from test timing
- infer a doctor for follow-up unless explicitly documented
- infer a location
- turn a test into a follow-up
- turn an instruction into a follow-up
- turn historical review into future follow-up


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

Clinical History:
- Previous events
- Previous treatments
- Previous reviews

Symptoms:
- Current symptoms

Investigations:
- Investigation names
- Investigation results

Tests Advised:
- Tests ordered/advised/planned

Medication:
- Medicines
- Dose
- Frequency
- Duration

Instructions:
- General patient instructions
- Lifestyle advice
- Monitoring instructions


============================================================
21. OUTPUT
============================================================

This panel contributes ONLY follow-up information.

Recommended structure:

{
  "followUpPlan": [
    {
      "action": string,
      "timing": string | null,
      "date": string | null,
      "condition": string | null,
      "doctor": string | null,
      "location": string | null
    }
  ]
}

Use null where information is not explicitly documented.

Do not manufacture missing fields.


============================================================
22. FINAL VALIDATION
============================================================

Before returning a follow-up item:

1. Is there an explicit future review/reassessment/return plan?
2. Is the timing explicitly documented?
3. Is the date explicitly documented?
4. Is any trigger or condition explicit?
5. Is the doctor explicitly identified for the follow-up?
6. Is the location explicitly documented?
7. Has a test been kept in TestsAdvisedPanel?
8. Has a medicine been kept in MedicationPanel?
9. Has general advice been kept in InstructionsPanel?
10. Has historical follow-up been excluded?
11. Has no date been calculated?
12. Has no follow-up been inferred?

When uncertain, do not guess.

END FOLLOW-UP PLAN PANEL
`;