/**
 * Investigations Panel
 *
 * Single responsibility:
 * Extract investigations, tests, scans, procedures and their
 * explicitly documented findings/results.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * IMPORTANT:
 * This panel does NOT decide whether a future test was advised.
 * That responsibility belongs exclusively to TestsAdvisedPanel.
 */

export const INVESTIGATIONS_PANEL_RULES = `
============================================================
INVESTIGATIONS PANEL
============================================================

PURPOSE
Identify investigations, diagnostic tests, scans, procedures and
their documented findings/results in the supplied medical document.

This panel answers:

"What investigation/test/procedure is documented, and what did it
show when a finding/result is explicitly available?"

This panel does NOT determine whether a test should be performed
in the future.


============================================================
1. WHAT COUNTS AS AN INVESTIGATION
============================================================

Capture explicitly documented investigations such as:

- Blood tests
- Urine tests
- Biopsy
- Histopathology
- IHC
- NGS
- PET CT
- CT
- MRI
- X-ray
- Ultrasound
- ECG
- ECHO
- Endoscopy
- Bronchoscopy
- Pulmonary function tests
- Other diagnostic tests
- Other diagnostic procedures

Use the actual investigation name documented in the source.


============================================================
2. INVESTIGATION NAME
============================================================

Extract the investigation itself separately from its result.

Example:

"PET CT shows left lung lesion with liver and bone metastases."

Investigation:
"PET CT"

Finding/result:
"left lung lesion with liver and bone metastases"

Do NOT store the entire sentence as the investigation name.


============================================================
3. DOCUMENTED RESULT / FINDING
============================================================

When an investigation has an explicitly documented finding/result,
preserve the clinically meaningful result.

Examples:

"PET CT - left lung, liver, bone mets"

Investigation:
"PET CT"

Result:
"left lung, liver, bone metastases"

Example:

"MRI brain - no metastases"

Investigation:
"MRI brain"

Result:
"no metastases"

Example:

"Biopsy: metastatic carcinoma"

Investigation:
"Biopsy"

Result:
"metastatic carcinoma"


============================================================
4. RESULT MUST NOT BECOME A NEW INVESTIGATION
============================================================

Do not turn a finding into a separate investigation.

Example:

"PET CT shows liver metastases."

Correct:

Investigation:
"PET CT"

Result:
"liver metastases"

Incorrect:

Investigation:
"PET CT"
Investigation:
"Liver metastases"


============================================================
5. MULTIPLE FINDINGS
============================================================

If one investigation has multiple explicitly documented findings,
keep them associated with the same investigation.

Example:

"PET CT shows left lung lesion, liver lesions and bone metastases."

Investigation:
"PET CT"

Result:
"left lung lesion; liver lesions; bone metastases"


============================================================
6. INVESTIGATION STATUS
============================================================

Where the document explicitly establishes a status, preserve it.

Examples:

- Completed
- Performed
- Reviewed
- Available
- Pending
- Previous
- Historical

Do not infer status from the investigation name alone.

If status is not explicit:

status = null


============================================================
7. COMPLETED / REVIEWED INVESTIGATION
============================================================

An investigation that has already been performed or whose result
is being reviewed belongs here.

Examples:

"PET CT done on 10/08/2026."

→ InvestigationsPanel

"Reviewed PET CT showing..."

→ InvestigationsPanel

Do NOT create:

TestsAdvised:
"PET CT"

unless the doctor separately and explicitly advises another/new
PET CT.


============================================================
8. HISTORICAL INVESTIGATION
============================================================

A previous investigation may be captured when it is explicitly
relevant to the supplied document.

Example:

"Previous MRI brain was normal."

Investigation:
"MRI brain"

Result:
"normal"

Status:
"Previous"

Do not represent it as a newly advised test.


============================================================
9. PENDING INVESTIGATION
============================================================

If the document explicitly states that an investigation is pending,
it may be captured with status:

"Pending"

Example:

"NGS pending."

Investigation:
"NGS"

Status:
"Pending"

Do not assume that "pending" means the doctor ordered it during
this consultation.


============================================================
10. INVESTIGATION VS TEST ADVISED
============================================================

This distinction is mandatory.

Example:

"PET CT shows left lung, liver and bone metastases."

→ InvestigationsPanel

NOT:

→ TestsAdvisedPanel


Example:

"PET CT advised."

→ TestsAdvisedPanel

NOT:

→ InvestigationsPanel


Example:

"Previous PET CT showed progression. Repeat PET CT advised."

InvestigationsPanel:
- PET CT
- Previous result: progression

TestsAdvisedPanel:
- PET CT
- advised to repeat


============================================================
11. INVESTIGATION RESULT VS DIAGNOSIS
============================================================

Do not automatically convert an investigation result into a
diagnosis.

Example:

"PET CT shows multiple liver lesions."

Investigation result:
"multiple liver lesions"

Do NOT automatically create:

Diagnosis:
"liver cancer"

unless the document explicitly states that diagnosis.


============================================================
12. INVESTIGATION RESULT VS CURRENT STATE
============================================================

Do not copy the complete investigation result into
CurrentStateOfHealthPanel.

If the doctor explicitly interprets the result clinically, the
clinical conclusion may belong to CurrentStateOfHealthPanel.

Example:

"PET CT shows progression."

Investigation:
"PET CT"

Result:
"progression"

If the doctor explicitly states:

"Disease has progressed despite treatment."

Current State:
"Disease progression"

Do not duplicate the entire investigation narrative.


============================================================
13. INVESTIGATION RESULT VS SYMPTOM
============================================================

Do not convert investigation findings into symptoms.

Example:

"CT shows pleural effusion."

Investigation:
"CT"

Result:
"pleural effusion"

Do NOT create:

Symptom:
"Pleural effusion"


============================================================
14. INVESTIGATION RESULT VS MEDICATION
============================================================

Do not infer medication from an investigation.

Example:

"NGS shows MET exon 14 skipping alteration."

Investigation:
"NGS"

Result:
"MET exon 14 skipping alteration"

Do NOT infer a medication from the finding.


============================================================
15. TEST NAMES IN MEDICAL HISTORY
============================================================

When an investigation is mentioned only as part of historical
clinical context, preserve its historical status where relevant.

Example:

"Previously underwent PET CT."

Investigation:
"PET CT"

Status:
"Previous"

Do NOT create a new advised test.


============================================================
16. REPORTS AND SUPPORTING DOCUMENTS
============================================================

If a supporting report contains an investigation and result,
capture the investigation/result represented by that document.

Do not confuse:

- Report author
- Hospital
- Doctor
- Patient
- Investigation

The investigation itself belongs here.

Document classification belongs to DocumentPanel.


============================================================
17. MULTIPLE INVESTIGATIONS
============================================================

Extract each distinct investigation separately.

Example:

"PET CT and MRI brain completed."

Return:

1. PET CT
2. MRI brain

Do not combine unrelated investigations into one string.


============================================================
18. DUPLICATES
============================================================

Do not create duplicate investigation entries when the same
investigation is repeated and clearly refers to the same event.

However, preserve genuinely separate investigations.

Example:

"Previous PET CT showed progression. Repeat PET CT now advised."

This contains:

Previous PET CT
→ InvestigationsPanel

Repeat PET CT
→ TestsAdvisedPanel


============================================================
19. DATES
============================================================

Capture an investigation date only when explicitly associated with
that investigation.

Examples:

"PET CT dated 10/08/2026."

Investigation date:
"2026-08-10"

Do not:

- use consultation date
- use report date
- use upload date
- use today's date
- invent a date


============================================================
20. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- application context
- previous database records
- external medical knowledge
- assumptions
- diagnosis inference
- medication inference


============================================================
21. ANTI-HALLUCINATION
============================================================

NEVER:

- invent an investigation
- invent an investigation result
- infer a result from the diagnosis
- infer a diagnosis from a result
- infer a test was performed because it was mentioned
- infer a test was advised because it appears in history
- convert a result into a test advised
- convert a test advised into a completed investigation
- manufacture dates
- manufacture investigation status


============================================================
22. STRICT SCOPE
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
- General historical events

Symptoms:
- Current symptoms

Tests Advised:
- Future tests explicitly ordered/advised/planned

Medication:
- Medicines
- Dose
- Frequency
- Duration

Instructions:
- Doctor's advice

Follow-up:
- Review plan


============================================================
23. OUTPUT
============================================================

This panel contributes ONLY investigation information.

Recommended structure:

{
  "investigations": [
    {
      "name": string,
      "result": string | null,
      "status": string | null,
      "date": string | null
    }
  ]
}

Use null when result, status or date is not explicitly available.

Do not invent missing information.


============================================================
24. FINAL VALIDATION
============================================================

Before returning an investigation:

1. Is it actually an investigation/test/procedure?
2. Is the investigation name separated from its result?
3. Is the result explicitly documented?
4. Is the status explicitly documented?
5. Is the date explicitly associated with the investigation?
6. Has a result been prevented from becoming an investigation name?
7. Has a completed investigation been prevented from becoming
   a test advised?
8. Has a test advised been kept out of completed investigations?
9. Has no diagnosis been inferred?
10. Has no symptom been inferred?
11. Has no medication been inferred?
12. Has information belonging to another panel been excluded?

When uncertain, return null rather than guessing.

END INVESTIGATIONS PANEL
`;