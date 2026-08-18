/**
 * Hospital Panel
 *
 * Single responsibility:
 * Identify the healthcare institution and patient identifier
 * explicitly documented in the supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 */

export const HOSPITAL_PANEL_RULES = `
============================================================
HOSPITAL PANEL
============================================================

PURPOSE
Identify the healthcare institution and institutional patient
identifier explicitly documented in the supplied document.

This panel is responsible ONLY for:

1. UHID
2. Hospital / Clinic
3. Hospital Location

============================================================
1. UHID
============================================================

Extract the patient's UHID / hospital patient identifier only when
explicitly documented.

Look for labels such as:

- UHID
- UHID No
- UHID Number
- Patient ID
- Hospital ID
- MRN
- Medical Record Number
- Registration Number

Preserve the identifier exactly as documented.

Do not:

- invent missing characters
- confuse UHID with phone number
- confuse UHID with insurance number
- confuse UHID with doctor registration number
- confuse UHID with report number
- infer UHID from another document

If multiple identifiers are present, identify the one explicitly
associated with the patient/hospital record.

If UHID cannot be reliably identified:

uhid = null


============================================================
2. HOSPITAL / CLINIC
============================================================

Identify the healthcare institution that issued or is responsible
for the relevant medical document.

Search the complete document, including:

- Letterhead
- Header
- Footer
- Logo
- Watermark
- Stamp
- Address block
- Website
- Email
- Registration information

Look for:

- Hospital
- Clinic
- Medical Centre
- Healthcare institution
- Hospital brand

Preserve the institution name as documented.

Example:

"Apollo Hospitals"

Return:

hospital = "Apollo Hospitals"


============================================================
3. MULTIPLE INSTITUTIONS
============================================================

A document may contain multiple healthcare institutions.

Examples:

- Current hospital
- Referral hospital
- Previous hospital
- Diagnostic centre
- Laboratory
- Imaging centre
- Cancer centre

Do NOT automatically treat every institution mentioned as the
current hospital.

Prefer the institution explicitly associated with the document
being interpreted.

If a supporting report belongs to another institution, do not replace
the primary institution with that supporting institution.

If the document set contains multiple distinct institutions and the
primary institution cannot be established reliably:

hospital = null


============================================================
4. HOSPITAL LOCATION
============================================================

Extract the hospital's documented location when explicitly available.

Location may include:

- City
- Area
- Branch
- State
- Country

Examples:

"Bangalore"

"Whitefield, Bangalore"

"Koramangala, Bengaluru"

Preserve meaningful location information as documented.

Do not invent a location from:

- hospital name
- website domain
- doctor address
- patient address
- external knowledge

If only the hospital name is visible and location is not documented:

hospitalLocation = null


============================================================
5. ADDRESS HANDLING
============================================================

An address may contain:

- Hospital name
- Building number
- Street
- Area
- City
- State
- PIN
- Telephone number

Do not place the complete address into hospitalLocation.

Extract only the meaningful healthcare-institution location.

Example:

"Motherhood
No. 34, Whitefield Main Road
Whitefield
Bangalore - 560066"

Hospital:

"Motherhood"

Hospital Location:

"Whitefield, Bangalore"

Do not return:

"No. 34, Whitefield Main Road, Bangalore - 560066"

unless the application's internal contract explicitly requires a
complete address.


============================================================
6. DIAGNOSTIC CENTRES / LABORATORIES
============================================================

A diagnostic centre or laboratory may appear in a supporting report.

Do not automatically classify it as the hospital.

Example:

Doctor's Note:
"Apollo Hospitals"

Supporting pathology report:
"ABC Diagnostics"

Hospital:

"Apollo Hospitals"

Do not replace the hospital with "ABC Diagnostics" merely because
the diagnostic report is uploaded.


============================================================
7. REFERRAL INSTITUTIONS
============================================================

If the document says:

"Referred from XYZ Hospital"

do not automatically set:

hospital = "XYZ Hospital"

unless XYZ Hospital is clearly the institution issuing the current
document.

Distinguish:

- Current issuing institution
- Previous institution
- Referral institution
- Supporting diagnostic institution


============================================================
8. SOURCE OF TRUTH
============================================================

Use ONLY information visibly supported by the supplied document.

Do not use:

- Application context
- User location
- Selected patient information
- Database information
- Previous documents
- External hospital directories
- Web searches
- Assumptions based on hospital brand


============================================================
9. ANTI-HALLUCINATION
============================================================

NEVER:

- Invent a hospital name.
- Infer a hospital from the doctor's name.
- Infer a hospital from the patient's location.
- Infer a hospital from the website domain alone.
- Infer hospital location from external knowledge.
- Treat a referral hospital as the current hospital.
- Treat a diagnostic centre as the hospital without evidence.
- Treat a doctor's address as hospital location.
- Manufacture a UHID.
- Convert another identifier into a UHID without evidence.


============================================================
10. STRICT SCOPE
============================================================

THIS PANEL MUST NOT EXTRACT:

Patient:
- Patient Name
- Patient Age
- Patient Sex
- Patient Name Variations

Doctor:
- Doctor Name
- Doctor Type
- Doctor Designation

Encounter:
- Consultation Date
- Consultation Mode

Documents:
- Document Type

Clinical:
- Current State of Health
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

This panel contributes ONLY:

{
  "uhid": string | null,
  "hospital": string | null,
  "hospitalLocation": string | null
}


============================================================
12. FINAL VALIDATION
============================================================

Before returning hospital information:

1. Is the institution actually supported by the document?
2. Is it the relevant issuing/current institution?
3. Has a referral institution been excluded where appropriate?
4. Has a diagnostic centre been kept separate where appropriate?
5. Is the location explicitly documented?
6. Is the UHID explicitly identifiable?
7. Has no patient, doctor or clinical information been extracted?
8. Has nothing been inferred from external knowledge?

When uncertain, return null rather than guessing.

END HOSPITAL PANEL
`;