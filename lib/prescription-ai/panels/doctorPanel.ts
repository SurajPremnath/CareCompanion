/**
 * Doctor Panel
 *
 * Single responsibility:
 * Identify doctors explicitly associated with the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT extract:
 * - Patient information
 * - Hospital information
 * - Consultation information
 * - Clinical information
 * - Medicines
 * - Investigations
 * - Instructions
 * - Follow-up
 * - Vitals
 */

export const DOCTOR_PANEL_RULES = `
============================================================
DOCTOR PANEL
============================================================

PURPOSE
Identify the doctor or doctors explicitly associated with the
supplied medical document.

This panel is responsible ONLY for:

1. Doctor Name
2. Doctor Type / Role
3. Doctor Designation when explicitly documented

============================================================
1. DOCTOR NAME
============================================================

Search the complete document for doctors explicitly identified
as medical professionals associated with the patient or document.

Look across:

- Header
- Letterhead
- Consultation section
- Doctor details
- Signature area
- Referral section
- "Referred by"
- "Consulted"
- "Consulting doctor"
- "Doctor"
- "Physician"
- "Oncologist"
- Other explicit doctor-identification fields

Capture the doctor's name as documented.

Preserve:

- Name
- Initials
- Meaningful title when part of the documented name

Examples:

"Dr. Shekar Patil"
"Dr Shekar Patil"
"Dr. K V Premnath"

Do not invent missing portions of a name.

If no doctor can be reliably identified:

doctorName = null


============================================================
2. DOCTOR TYPE / ROLE
============================================================

Identify the doctor's role ONLY when the document explicitly
establishes that relationship.

Examples:

- Consulting Doctor
- Referring Doctor
- Referral Doctor
- Treating Doctor
- Attending Doctor
- Primary Doctor
- Specialist
- Oncologist
- Physician

For Doctor's Notes, the most important distinction is:

Consulting Doctor
vs
Referral Doctor / Referred By

Do not merge these roles.

Example:

"Consulted Dr. Shekar Patil"
→ role: Consulting Doctor

"Referred by Dr. Rajesh Kumar"
→ role: Referral Doctor

If a document says:

"Referred to Dr. Shekar Patil"

this does NOT automatically mean that Dr. Shekar Patil was the
consulting doctor.

Role must follow the actual wording and context.


============================================================
3. DOCTOR DESIGNATION
============================================================

If a professional designation is explicitly documented, preserve it.

Examples:

"Sr. Consultant Medical Oncologist"
"Consultant Medical Oncologist"
"Senior Consultant"
"MD Physician"

Do not manufacture a designation from the doctor's name.

Do not infer a designation merely because a diagnosis or treatment
suggests a specialty.

Example:

If the document says:

"Dr. Shekar Patil
Sr. Consultant Medical Oncologist"

capture the documented designation.

If it only says:

"Dr. Shekar Patil"

do not generate:

"Medical Oncologist"

unless that role/designation is explicitly supported elsewhere
in the document.


============================================================
4. MULTIPLE DOCTORS
============================================================

A document may contain multiple doctors.

Each doctor must be evaluated independently.

Example:

Consulting Doctor:
Dr. Shekar Patil

Referral Doctor:
Dr. Rajesh Kumar

Return them as separate doctor records.

Do NOT:

- combine their names
- assign the same role to both
- assume the first doctor mentioned is the consulting doctor
- assume the doctor signing the document is automatically the
  consulting doctor
- treat every doctor mentioned in the document as a treating doctor


============================================================
5. DOCTORS MENTIONED IN CLINICAL HISTORY
============================================================

A doctor mentioned only as part of historical information is NOT
automatically a current consulting or referral doctor.

Example:

"Previously treated by Dr. Kumar"

This establishes that Dr. Kumar is mentioned in history.

It does NOT establish:

Consulting Doctor = Dr. Kumar

unless the current document explicitly identifies that role.


============================================================
6. DOCTORS APPEARING INSIDE SUPPORTING REPORTS
============================================================

When multiple documents are uploaded, a doctor appearing only inside
a supporting:

- pathology report
- radiology report
- laboratory report
- MRI report
- PET CT report
- test report
- other supporting document

must NOT automatically be treated as the Doctor's Notes consulting
doctor.

Only assign the doctor to the current consultation when the document
or document set explicitly supports that relationship.


============================================================
7. SPECIALTY / DESIGNATION SAFETY
============================================================

Do not infer doctor type from:

- diagnosis
- medicines prescribed
- hospital department
- treatment received
- medical terminology
- patient's disease
- the doctor's name

Example:

If the document contains:

"Capmatinib 200 mg"

do NOT infer:

Doctor Type = Oncologist

unless the document explicitly identifies the doctor as an
oncologist or equivalent.


============================================================
8. SIGNATURE SAFETY
============================================================

A signature alone may identify a doctor only when the surrounding
document clearly establishes that the signature belongs to the
doctor responsible for the consultation/document.

Do not guess an illegible signature.

If the doctor's name cannot be reliably read:

doctorName = null

Do not reconstruct an unclear handwritten name from expectation.


============================================================
9. SOURCE OF TRUTH
============================================================

Use ONLY information visibly supported by the supplied document.

Do not use:

- Application context
- Logged-in user
- Selected doctor outside the document
- Database information
- Previous uploads
- External knowledge
- Doctor directories
- Hospital assumptions


============================================================
10. STRICT SCOPE
============================================================

THIS PANEL MUST NOT EXTRACT:

Patient:
- Patient Name
- Patient Age
- Patient Sex
- Patient Name Variations

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


============================================================
11. OUTPUT FIELDS
============================================================

This panel contributes ONLY doctor-related information.

Recommended structure:

{
  "doctors": [
    {
      "name": string,
      "role": string | null,
      "designation": string | null
    }
  ]
}

If no doctor is reliably identified:

"doctors": []


============================================================
12. ANTI-HALLUCINATION
============================================================

NEVER:

- Invent a doctor name.
- Complete an illegible doctor name.
- Infer a doctor from a medicine.
- Infer a doctor from a diagnosis.
- Infer a doctor from a hospital.
- Treat a historical doctor as the current consulting doctor.
- Treat a report author as the consulting doctor without evidence.
- Treat a referred-to doctor as the consulting doctor.
- Assign a specialty that is not documented.
- Merge different doctors into one person.


============================================================
13. FINAL VALIDATION
============================================================

Before returning doctor information:

1. Is the person actually identified as a doctor?
2. Is the doctor's name supported by the document?
3. Is the role explicitly supported?
4. Is the designation explicitly supported?
5. If multiple doctors exist, are their roles kept separate?
6. Has a historical doctor been excluded from the current role?
7. Has a report-only doctor been excluded from the consultation role?
8. Has no specialty been inferred?
9. Has no information belonging to another panel been extracted?

When uncertain, prefer null or an empty list rather than guessing.

END DOCTOR PANEL
`;