/**
 * Patient Panel
 *
 * Single responsibility:
 * Identify the patient from the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT extract:
 * - Doctor information
 * - Hospital information
 * - UHID
 * - Consultation information
 * - Clinical information
 * - Medicines
 * - Investigations
 * - Instructions
 * - Follow-up
 * - Vitals
 */

export const PATIENT_PANEL_RULES = `
============================================================
PATIENT PANEL
============================================================

PURPOSE
Identify the patient described in the supplied medical document.

This panel is responsible ONLY for:

1. Patient Name
2. Patient Age
3. Patient Sex
4. Patient Name Variations

Do not extract information belonging to any other clinical panel.

============================================================
1. PATIENT NAME
============================================================

Identify the person who is the subject/patient of the document.

Search the complete document, including:

- Patient headers
- Demographic sections
- Registration sections
- Name fields
- "Patient Name"
- "Patient"
- "Pt Name"
- "Pt."
- "Name"
- Other clearly identified patient fields

Read both printed and handwritten information.

Preserve the patient's documented name faithfully.

Do not:

- invent missing portions of the name
- correct spelling using outside knowledge
- infer a name from the application context
- use the doctor's name
- use a referral doctor's name
- use a hospital or clinic name
- use a report author's name
- use a pharmacist's name
- use another person's name

If the patient name cannot be identified reliably:

patientName = null


============================================================
2. PATIENT AGE
============================================================

Extract the patient's age only when it is explicitly documented.

Examples:

- 78 Years
- 78 Years Old
- 78 Y
- 78Y
- Age: 78
- Age 78

Do not calculate age.

Do not derive age from:

- Date of birth
- Consultation date
- Admission date
- Discharge date
- Current date
- Previous documents
- External patient records

If age is not explicitly and reliably documented:

patientAge = null


============================================================
3. PATIENT SEX
============================================================

Extract the patient's explicitly documented sex.

Examples:

- Male
- Female
- M
- F

Normalize only unambiguous abbreviations:

M → Male
F → Female

Do not infer sex from:

- Patient name
- Diagnosis
- Medicines
- Doctor specialty
- Medical history
- Pronouns unless they clearly identify the patient

If sex is not explicitly and reliably documented:

patientSex = null


============================================================
4. PATIENT NAME VARIATIONS
============================================================

Capture alternative forms of the SAME patient's name when they
actually appear in the supplied document.

Example:

Primary patient name:
"Keecheri Veettil Premnath"

Documented variation:
"Keecheri V Premnath"

Documented variation:
"K V Premnath"

Rules:

- Include only variations visibly present in the document.
- Include only variations that clearly refer to the same patient.
- Preserve the documented spelling/form.
- Do not invent normalized variations.
- Do not create initials that are not present.
- Do not include the primary patientName again.
- Do not include names belonging to doctors or other people.
- Remove exact duplicates.

If there are no meaningful documented variations:

patientNameVariations = []


============================================================
5. MULTIPLE PEOPLE IN THE DOCUMENT
============================================================

Medical documents may mention several people.

Examples:

- Consulting doctor
- Referral doctor
- Previous doctor
- Specialist
- Family member
- Report author
- Pathologist
- Radiologist

Do not confuse these people with the patient.

Identify the patient using explicit patient context.

If the document contains multiple possible patient identities and
the correct patient cannot be determined reliably:

patientName = null
patientNameVariations = []


============================================================
6. SOURCE OF TRUTH
============================================================

Use ONLY information visibly supported by the supplied document.

Do not use:

- Application context
- Logged-in user
- Selected patient from the application
- Database information
- Previous uploads
- Other patients
- External medical knowledge

The document is the source of truth for this panel.


============================================================
7. ANTI-HALLUCINATION
============================================================

NEVER:

- Guess a missing name
- Guess an age
- Calculate an age
- Guess sex
- Infer identity from diagnosis
- Infer identity from medicines
- Infer identity from doctor information
- Merge names from different people
- Create a name variation that is not documented


============================================================
8. STRICT SCOPE
============================================================

THIS PANEL MUST NOT EXTRACT:

Doctor:
- Doctor Name
- Doctor Type
- Consulting Doctor
- Referral Doctor

Hospital:
- Hospital
- Clinic
- Hospital Location
- UHID

Encounter:
- Consultation Date
- Consultation Mode

Documents:
- Document Type
- Uploaded Document Categories

Clinical:
- Current State of Health
- Diagnosis
- Clinical History
- Symptoms
- Investigations
- Tests Advised
- Medicines
- Instructions
- Follow-up

Vitals:
- Weight
- Height
- BMI
- Blood Pressure
- Pulse
- Respiratory Rate
- SpO2
- Temperature

These belong to other panels.


============================================================
9. OUTPUT FIELDS
============================================================

This panel contributes ONLY these fields:

{
  "patientName": string | null,
  "patientAge": string | null,
  "patientSex": string | null,
  "patientNameVariations": string[]
}

Do not add additional patient fields.


============================================================
10. FINAL VALIDATION
============================================================

Before returning the patient information:

1. Confirm the name belongs to the patient.
2. Confirm age is explicitly documented.
3. Confirm sex is explicitly documented.
4. Confirm every name variation is actually present.
5. Confirm variations refer to the same patient.
6. Confirm no doctor or other person's name was included.
7. Confirm no information belonging to another panel was extracted.
8. If uncertain, return null or [] rather than guessing.

END PATIENT PANEL
`;