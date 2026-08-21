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

Extract the date that represents the doctor's clinical
consultation, visit, encounter, prescription, or clinical note.

IMPORTANT:

Dates may appear ANYWHERE in the document.

Do NOT assume the consultation date is:

- beside the doctor's name
- at the top of the page
- the first date found
- the most recent date
- the earliest date

First identify what each date represents.

Then select the date that represents the clinical encounter.

============================================================
5. DOCUMENT TYPE AND DATE MEANING
============================================================

Before selecting consultationDate, determine what type of
document has been supplied and what each visible date
represents.

-------------------------
PRESCRIPTION / DOCTOR NOTE
-------------------------

For a prescription or doctor's note, consider dates with
these meanings as potential consultation dates:

- CONSULTATION_DATE
- VISIT_DATE
- ENCOUNTER_DATE
- PRESCRIPTION_DATE
- NOTE_DATE

Also consider an unlabeled date when its surrounding
clinical context clearly associates it with the doctor's
consultation or clinical note.

If there is only ONE plausible clinical date in a
prescription or doctor's note, use that date even if it has
no explicit label.

-------------------------
LAB REPORT
-------------------------

If the document is a laboratory report, identify laboratory
dates but do NOT treat them as consultation dates.

Laboratory dates include:

- LAB_REGISTRATION_DATE
- LAB_COLLECTION_DATE
- LAB_RECEIVED_DATE
- LAB_REPORT_DATE
- LAB_VERIFIED_DATE

These dates describe the laboratory investigation.

They must NOT become consultationDate merely because they
are the only dates visible in the document.

-------------------------
DIAGNOSTIC / TEST REPORT
-------------------------

If the document is a diagnostic or test report, identify
investigation dates but do NOT treat them as consultation
dates.

Investigation dates include:

- STUDY_DATE
- SCAN_DATE
- TEST_DATE
- EXAMINATION_DATE
- LAB_REPORT_DATE

These dates describe the diagnostic investigation.

They must NOT become consultationDate merely because they
are the only dates visible in the document.

-------------------------
OTHER DATES
-------------------------

Do not treat these as consultation dates merely because they
contain a date or year:

- PRINTED_DATE
- document generation date
- doctor qualification dates
- registration identifiers
- medication start/end dates
- follow-up dates
- dates belonging to another investigation
- dates belonging to another doctor
- historical dates

Classify them according to what they actually represent.

============================================================
6. CONSULTATION DATE SELECTION PRIORITY
============================================================

For PRESCRIPTION_OR_DOCTOR_NOTE documents, select the
consultation date using this priority:

1. Explicit CONSULTATION_DATE

2. Explicit VISIT_DATE

3. Explicit ENCOUNTER_DATE

4. Explicit PRESCRIPTION_DATE

5. NOTE_DATE when it clearly represents the current
   clinical consultation or clinical note

6. An unlabeled date clearly associated with the current
   clinical consultation or clinical note

7. If only ONE plausible clinical date remains in the
   prescription or doctor's note, use that date.

When multiple dates are present, choose the date whose
MEANING most directly represents the clinical encounter.

Examples:

Consultation Date + Printed Date
→ use Consultation Date

Visit Date + Vital Date + Printed Date
→ use Visit Date

Prescription Date + Follow-up Date
→ use Prescription Date

Visit Date + Prescription Date
→ prefer Visit Date when both refer to the same encounter

A date must NOT be selected merely because:

- it is near the doctor's name
- it is at the top of the page
- it is the first date found
- it is the latest date
- it is the earliest date
- it has the highest visual confidence

The semantic meaning and clinical context of the date
determine whether it is the consultation date.

============================================================
7. DATE READING
============================================================

After identifying which date represents the consultation,
read that date directly from the supplied document.

Read every visible digit and separator carefully.

For handwritten dates:

- inspect each digit individually
- inspect each separator individually
- do not guess unclear digits
- do not reconstruct missing digits
- do not replace a digit because another date seems more
  plausible

Normalize the selected consultation date to:

YYYY-MM-DD

If the visible date cannot be reliably read:

"consultationDate": null

============================================================
8. CRITICAL DATE RULE
============================================================

NEVER substitute today's date.

NEVER use the upload date.

NEVER use the application processing date.

NEVER use the filename date.

NEVER use a laboratory investigation date as a
consultation date.

NEVER use a diagnostic/test investigation date as a
consultation date.

NEVER infer a date that is not visibly supported by the
document.

If no reliable consultation date exists:

"consultationDate": null

============================================================
9. CONSULTATION MODE
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
10. HOSPITAL / CLINIC
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
11. CROSS-CHECK BEFORE RETURNING
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