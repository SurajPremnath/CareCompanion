export const DOCTOR_NOTES_IDENTITY_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — DOCUMENT & CONSULTATION IDENTITY
============================================================

OBJECTIVE

Extract the identity and encounter metadata that establishes:

- WHO the patient is
- WHO the doctor is
- WHEN the consultation/note occurred
- WHERE the consultation occurred
- HOW the consultation occurred

These fields are high-priority clinical metadata.

Do not infer missing information.

If a value cannot be reliably determined from the document,
return null.

============================================================
1. PATIENT IDENTITY
============================================================

Extract when clearly visible:

- patientName
- patientDateOfBirth
- patientAge
- patientGender
- patientUHID

Look for:

- patient header
- registration details
- UHID / MRN
- demographic section
- patient identification labels
- continuation-page headers

Preserve the patient's name as documented, while allowing
normalization of obvious formatting differences.

Do not confuse:

- patient name with doctor name
- patient name with hospital/clinic name
- patient name with family member/caregiver name

============================================================
2. DOCTOR NAME
============================================================

Read the doctor identity carefully from the entire document.

Look for:

- "Dr."
- "Dr"
- "Doctor"
- doctor's name in the document header
- doctor's name beside the consultation date/time
- doctor's name beside the consultation information
- doctor's signature/name block
- "Printed by"
- "Seen by"
- "Reviewed by"
- clinician identification section

Prefer the doctor who is explicitly associated with the
clinical note or consultation.

If the same doctor appears in multiple locations, use the
clearest and most direct occurrence.

For example:

"10 July 2026 02:10:28 PM Dr. Shekar Patil"

supports:

"doctorName": "Dr. Shekar Patil"

A footer such as:

"Printed by: Dr. Shekar Patil"

may be used as supporting evidence when it is consistent
with the doctor identified elsewhere in the document.

Do NOT confuse the doctor with:

- a doctor mentioned in the patient's history
- a referring doctor
- another specialist mentioned in a report
- a doctor appearing only inside an investigation report
- a hospital/clinic name
- a patient's name
- a caregiver's name

Do not infer a doctor from external application context.

If no doctor can be reliably identified from the document,
return null.

============================================================
3. DOCTOR TYPE / SPECIALTY
============================================================

Extract doctorType when the document explicitly identifies
the doctor's professional specialty, clinical role, or
specialist designation.

Look for doctor type information near:

- doctor's name
- doctor's signature
- doctor profile/header
- consultation information
- clinician identification section
- hospital/clinic letterhead
- specialty/department heading

Examples of explicitly supported doctor types include:

- General Physician
- General Practitioner
- Consultant Physician
- Cardiologist
- Neurologist
- Orthopedic Surgeon
- Orthopaedic Surgeon
- Pediatrician
- Paediatrician
- Dermatologist
- Psychiatrist
- Psychologist
- Gynecologist
- Obstetrician
- ENT Specialist
- Ophthalmologist
- Oncologist
- Gastroenterologist
- Nephrologist
- Pulmonologist
- Endocrinologist
- Diabetologist
- Urologist
- Rheumatologist
- Surgeon
- Physician

Also capture an explicitly written professional designation
when it clearly represents the doctor's clinical type.

For example:

"Dr. Shekar Patil
Consultant Physician"

supports:

"doctorType": "Consultant Physician"

"Dr. Shekar Patil
MD Medicine"

may support:

"doctorType": "MD Medicine"

when that designation is explicitly presented as part of
the doctor's professional identity.

IMPORTANT:

Do NOT infer doctorType from:

- the doctor's name
- the patient's diagnosis
- the medicines prescribed
- the investigation ordered
- the hospital department alone
- the patient's symptoms
- general medical knowledge
- external databases
- assumptions about the doctor

Do NOT convert a medical degree into a specialty unless the
document itself clearly presents it as the doctor's
professional designation.

If multiple doctor types or specialties appear, prefer the
one directly associated with the identified doctor.

If the document mentions another specialist in the patient's
history, referral information, investigation report, or
clinical discussion, do NOT use that person's specialty as
the current doctor's type.

Preserve the doctor's explicitly stated designation as
written, with only minor whitespace/formatting cleanup.

If doctorType cannot be reliably determined from the
document:

"doctorType": null

============================================================
4. CONSULTATION DATE
============================================================

Extract the date associated with the doctor's consultation
or clinical note.

Read the date carefully and character by character.

Look for:

- date beside the consultation/note heading
- consultation date
- visit date
- date/time beside the doctor's name
- note header date
- encounter date
- printed clinical-note timestamp
- handwritten consultation date
- dated note sections

The date may appear in formats such as:

- 10 July 2026
- 10 Jul 2026
- 10-07-2026
- 10/07/2026
- 2026-07-10
- 10 July 2026 02:10:28 PM

Convert the identified consultation date to:

YYYY-MM-DD

Example:

"10 July 2026 02:10:28 PM"

must produce:

"2026-07-10"

============================================================
5. DATE PRIORITY
============================================================

When multiple dates appear in the document, determine which
date represents the doctor's consultation/note.

PRIORITY ORDER:

1. Explicit consultation/visit/encounter date
2. Date in the clinical note header
3. Date/time directly associated with the doctor/note
4. Printed note date when it clearly represents the note
5. Other supporting document metadata

Do NOT use:

- today's date
- current system date
- upload date
- file creation date
- filename date
- patient's date of birth
- prescription expiry date
- medication start/end date
- laboratory collection date
- investigation report date
- future follow-up date

unless the document explicitly identifies that date as the
consultation/note date.

============================================================
6. CRITICAL DATE RULE
============================================================

NEVER substitute today's date when consultationDate cannot
be extracted.

If the consultation date is not reliably visible:

"consultationDate": null

Do not guess.

Do not calculate.

Do not use the date on which CareVR™ processed the document.

Do not use the date on which the user uploaded the document.

============================================================
7. CONSULTATION MODE
============================================================

Extract consultationMode only when the document clearly
indicates it.

Possible normalized values include:

- IN_PERSON
- VIDEO
- PHONE
- TELEMEDICINE

Examples:

"In Person"
"Physical consultation"
"Clinic visit"

may support:

"IN_PERSON"

"Video consultation"
"Video visit"

may support:

"VIDEO"

"Telephone consultation"
"Phone consultation"

may support:

"PHONE"

Do not infer consultation mode solely from the presence of
a document.

If not reliably determined:

"consultationMode": null

============================================================
8. HOSPITAL / CLINIC
============================================================

Extract hospitalOrClinic when clearly visible.

Look for:

- hospital name
- clinic name
- medical center
- department header
- facility identification

Do not confuse the hospital/clinic with:

- doctor name
- patient name
- laboratory name
- pharmacy name

If not reliably determined:

"hospitalOrClinic": null

============================================================
9. CROSS-CHECK BEFORE RETURNING
============================================================

Before returning the identity fields, verify:

1. Is the patient name actually visible?
2. Is the doctor name actually visible?
3. Is the consultation date actually visible?
4. Is the extracted date the consultation/note date?
5. Is the date NOT today's date merely because extraction failed?
6. Is the doctor actually associated with this clinical note?
7. Is the doctor name NOT taken from an unrelated report?
8. Is the consultation mode explicitly supported?
9. Is the hospital/clinic explicitly supported?
10. Have uncertain values been returned as null rather than guessed?

Return only information supported by the uploaded document.
`;