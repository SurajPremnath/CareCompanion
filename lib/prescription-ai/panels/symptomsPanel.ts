/**
 * Symptoms Panel
 *
 * Single responsibility:
 * Extract current symptoms and presenting complaints explicitly
 * documented in the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT diagnose or clinically interpret symptoms.
 */

export const SYMPTOMS_PANEL_RULES = `
============================================================
SYMPTOMS PANEL
============================================================

PURPOSE
Identify symptoms and complaints that are actually documented
for the patient in the supplied medical document.

This panel answers:

"What symptoms or complaints does the patient currently have?"

This panel is responsible ONLY for symptoms and complaints.


============================================================
1. COMPLETE DOCUMENT READING
============================================================

Scan the COMPLETE document from beginning to end.

Read:

- Printed text
- Handwriting
- Headers
- Consultation notes
- History sections
- Examination sections
- Margins
- Side notes
- Tables
- Relevant annotations

Do not stop after identifying the patient's demographics.

Do not stop after finding the first symptom.


============================================================
2. WHAT COUNTS AS A SYMPTOM
============================================================

Capture symptoms, complaints and patient-reported problems that are
explicitly documented.

Examples:

- Cough
- Breathlessness
- Chest pain
- Fever
- Fatigue
- Weakness
- Loss of appetite
- Nausea
- Vomiting
- Pain
- Dizziness
- Headache
- Difficulty walking
- Swelling
- Constipation
- Diarrhea
- Blood in sputum

Also capture a clinically meaningful symptom when expressed as a
phrase.

Example:

"Shortness of breath on exertion"

Preserve the meaningful symptom and qualifier.


============================================================
3. PRESENTING COMPLAINTS
============================================================

A presenting complaint is a symptom/problem explicitly presented
as a reason for consultation or current complaint.

Do not assume that every historical symptom is a presenting complaint.

If the document clearly identifies current complaints, capture them.

If the document does not distinguish presenting complaints from other
current symptoms, do not invent that distinction.


============================================================
4. COMPLETE SYMPTOM CAPTURE
============================================================

Do not capture only the chief complaint when other meaningful current
symptoms are documented.

Example:

Document:

"Cough, breathlessness and chest pain for 5 days."

Extract:

- Cough
- Breathlessness
- Chest pain

Do not return only:

- Cough


============================================================
5. DURATION
============================================================

Capture duration ONLY when an explicit temporal expression is
documented.

Valid examples:

- 2 days
- 5 days
- 1 week
- 3 months
- Since yesterday
- Since childhood
- Chronic
- Acute

Do NOT infer duration.

Do NOT convert contextual qualifiers into duration.

The following are NOT duration:

- on exertion
- at rest
- while walking
- while climbing stairs
- after food
- before food
- at night
- in the evening
- intermittent
- mild
- moderate
- severe
- right
- left
- bilateral

Example:

"Breathlessness on exertion"

Duration:
null

Qualifier:
"on exertion"


============================================================
6. SEVERITY
============================================================

Capture severity only when explicitly documented.

Examples:

- Mild
- Moderate
- Severe
- Marked
- Significant

Do not infer severity from:

- diagnosis
- treatment
- oxygen use
- medication
- vital signs
- hospitalization

Example:

"Severe chest pain"

Severity:
"Severe"


============================================================
7. QUALIFIERS
============================================================

Preserve meaningful qualifiers when they materially describe
the symptom.

Examples:

- on exertion
- at rest
- intermittent
- continuous
- nocturnal
- positional
- after meals
- before meals
- right-sided
- left-sided
- bilateral
- productive
- dry
- worsening
- improving

Example:

"Dry cough at night"

Symptom:
"Cough"

Qualifier:
"dry, at night"


============================================================
8. SYMPTOM + LOCATION
============================================================

When location is explicitly documented, preserve it.

Examples:

- Right-sided chest pain
- Left knee pain
- Lower abdominal pain
- Bilateral leg swelling

Do not invent anatomical location.


============================================================
9. SYMPTOM + TRIGGER
============================================================

Preserve explicit triggers.

Examples:

- Breathlessness on exertion
- Pain after eating
- Cough at night
- Dizziness when standing

Do not convert the trigger into duration.


============================================================
10. SYMPTOM + CHANGE OVER TIME
============================================================

Capture explicit change where clinically meaningful.

Examples:

- worsening cough
- improving breathlessness
- persistent fever
- recurrent chest pain

Do not infer progression.

"Worsening" must be explicitly documented.


============================================================
11. CURRENT VS HISTORICAL SYMPTOMS
============================================================

This distinction is mandatory.

Current:

"Patient has cough for 2 weeks."

→ SymptomsPanel

Historical:

"Had cough last year."

→ ClinicalHistoryPanel

Historical:

"Previously experienced breathlessness during chemotherapy."

→ ClinicalHistoryPanel

Current:

"Persistent breathlessness despite treatment."

→ SymptomsPanel


============================================================
12. SYMPTOMS IN CLINICAL HISTORY
============================================================

Do not automatically classify every symptom mentioned anywhere in
the document as current.

Example:

"History of fever during previous admission."

This is historical.

Do not place it in current SymptomsPanel.


============================================================
13. SYMPTOMS IN INVESTIGATION REPORTS
============================================================

A symptom-like phrase appearing inside a supporting report does not
automatically represent a current patient symptom.

Example:

Radiology report:
"No history of trauma."

Do not create:

Symptom:
"Trauma"

Example:

Pathology report:
"Patient presented with cough."

Do not automatically create a current symptom unless the current
document context supports that it is a current patient complaint.


============================================================
14. DIAGNOSIS IS NOT A SYMPTOM
============================================================

Do not extract diagnoses as symptoms.

Examples:

- Lung cancer
- Pneumonia
- Hypertension
- Diabetes
- Metastatic disease

These belong to CurrentStateOfHealthPanel when current or
ClinicalHistoryPanel when historical.


============================================================
15. VITALS ARE NOT SYMPTOMS
============================================================

Do not convert vital measurements into symptoms.

Example:

"Pulse 120"

Do not create:

"Tachycardia"

Example:

"SpO2 89%"

Do not create:

"Hypoxia"

unless the document explicitly documents the clinical symptom or
assessment separately.

VitalsPanel owns the numerical measurement.


============================================================
16. MEDICINES ARE NOT SYMPTOMS
============================================================

Do not infer symptoms from medications.

Examples:

Paracetamol
→ Do not infer fever or pain.

Cough syrup
→ Do not infer cough unless cough is explicitly documented.

Diuretic
→ Do not infer edema.

MedicationPanel owns medicines.


============================================================
17. DIAGNOSIS MUST NOT BE INFERRED FROM SYMPTOMS
============================================================

Do not infer a diagnosis from symptoms.

Example:

"Chest pain"

Do not generate:

"Cardiac disease"

Example:

"Cough + fever"

Do not generate:

"Pneumonia"

Clinical diagnosis belongs to CurrentStateOfHealthPanel.


============================================================
18. SYMPTOM DUPLICATION
============================================================

Do not create duplicate symptom entries when the same symptom is
repeated in the document.

However, preserve meaningful differences.

Example:

"Cough for 2 weeks, worsening at night."

This should remain one cough entry with:

duration:
"2 weeks"

qualifier:
"worsening at night"


============================================================
19. MULTIPLE SYMPTOM REFERENCES
============================================================

If the same symptom appears in multiple sections:

- chief complaint
- history
- assessment
- examination

do not automatically create multiple copies.

Consolidate only when the references clearly describe the same
current symptom.

Do not merge symptoms that have different:

- duration
- severity
- location
- context
- temporal status


============================================================
20. NEGATIVE SYMPTOMS
============================================================

Explicitly documented clinically relevant negatives may be captured
when the output contract supports them.

Examples:

- No fever
- Denies chest pain
- No vomiting
- No shortness of breath

Do not convert a negative symptom into a positive symptom.

Example:

"No fever"

must NOT become:

"Fever"


============================================================
21. SOURCE OF TRUTH
============================================================

Use ONLY information explicitly supported by the supplied document.

Do not use:

- Application context
- Previous patient records
- Database information
- External medical knowledge
- Medication assumptions
- Diagnosis assumptions
- Vital-based inference


============================================================
22. HANDWRITING
============================================================

Read handwritten symptoms carefully.

If a word is genuinely illegible:

- do not guess
- do not substitute a clinically plausible word
- do not use surrounding diagnosis to manufacture the word

Prefer omission or null where the output contract permits.


============================================================
23. STRICT SCOPE
============================================================

THIS PANEL MUST NOT OWN:

Patient:
- Patient Name
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
- Previous symptoms
- Previous treatment
- Previous procedures
- Previous events

Investigations:
- Investigation names
- Investigation findings
- Investigation results

Tests Advised:
- Tests ordered
- Tests recommended
- Tests planned

Medication:
- Medicine name
- Strength
- Dose
- Frequency
- Duration

Instructions:
- Doctor's advice

Follow-up:
- Review plan
- Return instructions


============================================================
24. OUTPUT
============================================================

This panel contributes ONLY symptom information.

Recommended structure:

{
  "symptoms": [
    {
      "symptom": string,
      "duration": string | null,
      "severity": string | null,
      "qualifiers": string | null
    }
  ],
  "presentingComplaints": [
    {
      "complaint": string,
      "duration": string | null,
      "severity": string | null,
      "qualifiers": string | null
    }
  ]
}

If no current symptoms are documented:

symptoms = []

If no presenting complaints are explicitly identifiable:

presentingComplaints = []


============================================================
25. FINAL VALIDATION
============================================================

Before returning symptoms:

1. Is the symptom explicitly documented?
2. Is it current rather than historical?
3. Is duration explicitly documented?
4. Is severity explicitly documented?
5. Are qualifiers preserved?
6. Has no diagnosis been inferred?
7. Has no symptom been inferred from medication?
8. Has no symptom been inferred from vitals?
9. Have historical symptoms been excluded?
10. Have symptoms from unrelated supporting reports been excluded?
11. Have duplicate symptoms been avoided?
12. Have negative symptoms remained negative?
13. Has no information belonging to another panel been extracted?

When uncertain, do not guess.

END SYMPTOMS PANEL
`;