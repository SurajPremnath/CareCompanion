export const PATIENT_PANEL_RULES = `
------------------------------------------------------------
PANEL: PATIENT & CONSULTATION (GENERALIZED INTELLIGENCE)
------------------------------------------------------------
• FULL-CANVAS DISCOVERY:
  Scan all areas of the image (top headers, margins, central body, and footer logos/stamps) without assuming a fixed layout or specific ink color.

1. PATIENT NAME & DEMOGRAPHICS:
   - Search for patient name identifiers across the entire document.
   - Look near labels like "Name:", "Pt Name:", "Patient:", "Pt.", or demographic clusters (Age/Gender/UHID).
   - Read handwritten or printed names character-by-character. Preserve exact capitalization, initials, and spacing (e.g., "MR. K.V. Premnath").
   - If no patient name is present on the page, return null. Do NOT map doctor names, clinic names, or general text into patientName.

2. DOCTOR DETAILS:
   - Search for medical provider credentials across headers, stamps, side notes, or bottom signatures.
   - Look for prefixes ("Dr.", "Prof."), degrees ("MBBS", "MD", "MRCGP"), or registration numbers ("KMC", "Reg No").
   - Extract full doctor name with title (e.g., "Dr. Swathi Rachabattula").

3. HOSPITAL / CLINIC DISCOVERY

OBJECTIVE

Identify the healthcare institution that issued this document.

This is a dedicated task and MUST be completed before returning JSON.

------------------------------------------------------------

SEARCH PASS

Perform a complete page scan looking ONLY for the healthcare institution.

Search ALL of the following locations.

✓ Top Header
✓ Bottom Footer
✓ Left Margin
✓ Right Margin
✓ Letterhead
✓ Printed Logo
✓ Watermark
✓ Rubber Stamp
✓ Footer Branding
✓ Website
✓ Email Address
✓ Address Block

Do NOT stop searching after finding the patient or doctor.

------------------------------------------------------------

WHAT TO LOOK FOR

Look for:

• Hospital Name
• Clinic Name
• Institution Brand
• Healthcare Logo
• Hospital Website
• Hospital Email
• Hospital Stamp

Examples

motherhood
www.motherhoodindia.com

↓

Motherhood

--------------------------------

Apollo Hospitals
www.apollohospitals.com

↓

Apollo Hospitals

--------------------------------

Aster CMI Hospital

↓

Aster CMI Hospital

--------------------------------

HCG
www.hcgoncology.com

↓

HCG

------------------------------------------------------------

ADDRESS RULE

If the hospital name appears inside an address block:

Motherhood
No.34 ...
Whitefield
Bangalore

Return ONLY

Motherhood

Never return:

• Address
• Landmark
• City
• PIN Code
• Phone Number
• Registration Number

------------------------------------------------------------

MULTIPLE NAMES

If multiple institution names exist,

return ONLY the institution that issued the prescription.

Ignore

• Referral hospitals
• Diagnostic centres
• Pharmacy names
• Insurance companies
• Advertisements

------------------------------------------------------------

FINAL VALIDATION

Before returning hospitalOrClinic = null

perform one FINAL hospital-only scan.

Verify:

✓ Logo
✓ Footer
✓ Website
✓ Watermark
✓ Stamp
✓ Letterhead
✓ Address Block

If any healthcare institution can be identified,

hospitalOrClinic MUST NOT be null.

------------------------------------------------------------

ANTI-HALLUCINATION

• Use only text visible on the document.
• Never invent hospital names.
• Never infer missing words.
• Return only the institution name.

4. CONSULTATION DATE:

   - Search the ENTIRE document for the consultation/prescription date.
   - Prioritize dates explicitly associated with:
     "Date:", "Dt:", "Dated:", "Consultation Date:", or the prescription header.
   - A date written near the doctor's signature/stamp may also represent the consultation date.

   - Medical prescriptions in this application use DD/MM/YYYY interpretation.
   - Output the final date strictly as ISO format:
     "YYYY-MM-DD".

   - IMPORTANT: Read the DATE DIGITS visually from the document.
     Do NOT infer, estimate, reconstruct, or substitute digits.

   - For handwritten dates, inspect EACH digit individually.
     Pay particular attention to visually similar handwritten digits such as:
     1 vs 4 vs 5 vs 7,
     0 vs 6,
     3 vs 8,
     5 vs 6.

   - If the day appears to be "05", it MUST be returned as day 05.
     Do not convert or reinterpret it as 01.

   - Before returning the date, perform a SECOND visual verification
     of the complete date against the original document.

   - The date must be internally valid:
     valid day + valid month + valid year.

   - If multiple dates are visible:
       1. Prefer the date explicitly labelled as the prescription/
          consultation date.
       2. Do NOT use patient DOB, report date, admission date,
          discharge date, investigation date, or medication date.
       3. If the consultation date cannot be determined with confidence,
          return null rather than guessing.

   - If a consultation date is clearly visible, extract it.
   - If the handwriting is genuinely ambiguous after visual verification,
     return null rather than choosing a digit by inference.

5. ANTI-HALLUCINATION & REPEATABILITY DIRECTIVE:
   - Rely strictly on visual evidence visible on the document.
   - Never synthesize names, dates, or clinics that do not exist on the image.
   - If handwritten text is legible to a human reader, transcribe it accurately rather than returning null.
`;