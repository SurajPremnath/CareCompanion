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
   - Search the document for any calendar date representation (e.g., "5/6/26", "05-06-2026", "05/06/2026").
   - Locate dates near labels like "Date:", "Dt:", "Dated:", or adjacent to doctor signatures/stamps.
   - Parse using DD/MM/YYYY standard for medical prescriptions and output strictly in ISO format "YYYY-MM-DD".
   - If a valid consultation date is visually present on the page, it MUST be extracted.

5. ANTI-HALLUCINATION & REPEATABILITY DIRECTIVE:
   - Rely strictly on visual evidence visible on the document.
   - Never synthesize names, dates, or clinics that do not exist on the image.
   - If handwritten text is legible to a human reader, transcribe it accurately rather than returning null.
`;