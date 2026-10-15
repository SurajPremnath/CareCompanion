export const DOCTOR_NOTES_DOCUMENT_HANDLING_INSTRUCTIONS = `
============================================================
DOCTOR'S NOTES — DOCUMENT HANDLING & READING
============================================================

OBJECTIVE

Read the entire uploaded doctor's note carefully before producing
the structured extraction.

The document may contain printed text, handwriting, headers,
footers, stamps, tables, continuation pages, marginal notes,
or multiple pages.

Do not rely only on the first visible paragraph or the most
prominent section.

============================================================
1. READ THE COMPLETE DOCUMENT
============================================================

Process all available pages and document content.

Review:

- first page
- continuation pages
- headers
- footers
- margins
- tables
- signatures
- handwritten annotations
- stamps
- printed metadata
- page-specific clinical sections

Do not stop extraction after finding the main diagnosis or plan.

Important metadata such as the doctor name and consultation date
may appear in the header or footer rather than in the main body.

============================================================
2. HEADER READING
============================================================

Pay particular attention to the document header.

Headers may contain:

- patient name
- patient identifier
- consultation date
- consultation time
- doctor name
- hospital/clinic
- department
- consultation type

Read header text carefully and preserve the relationship between
date/time and doctor identity.

For example, a header containing:

"10 July 2026 02:10:28 PM Dr. Shekar Patil"

is strong evidence for:

- consultation date: 2026-07-10
- doctor name: Dr. Shekar Patil

============================================================
3. FOOTER READING
============================================================

Do not ignore footer information.

Footers may contain:

- doctor name
- printed-by information
- print date/time
- hospital information
- page numbers
- document metadata

A footer may provide supporting evidence for doctor identity or
document date.

For example:

"Printed by: Dr. Shekar Patil"

supports the doctor identity when consistent with the rest of
the document.

Do not treat a print timestamp as the consultation date unless
the document clearly establishes that relationship.

============================================================
4. HANDWRITTEN CONTENT
============================================================

Read handwritten clinical content when legible.

Handwritten content may contain:

- symptoms
- instructions
- investigations
- medication changes
- follow-up instructions
- dates
- signatures
- annotations

Do not invent or reconstruct illegible handwriting.

If handwriting cannot be reliably read:

return null or omit the unsupported information according to
the overall output contract.

============================================================
5. TABLES AND STRUCTURED AREAS
============================================================

Read information contained inside:

- tables
- medication grids
- investigation lists
- structured patient headers
- appointment blocks
- clinical forms

Do not assume information outside the main narrative is
unimportant.

============================================================
6. MULTI-PAGE DOCUMENTS
============================================================

Treat all pages as belonging to the same document unless the
document clearly indicates otherwise.

Maintain context across continuation pages.

Do not duplicate information merely because it is repeated in a
page header.

If a later page contains more specific information, preserve the
more specific information.

============================================================
7. DOCUMENT STRUCTURE
============================================================

Use section headings to understand context.

Possible sections include:

- Patient Details
- Chief Complaint
- History
- Examination
- Assessment
- Diagnosis
- Investigations
- Plan
- Advice
- Prescription
- Follow-up

Section placement helps determine the meaning of extracted text.

Do not rely on section headings alone; interpret the actual
content.

============================================================
8. DATE READING
============================================================

Dates require special care.

When reading a date:

- inspect all digits
- inspect the month name where present
- distinguish day from month
- distinguish consultation date from other dates
- preserve the actual year
- do not substitute today's date

For example:

"10 July 2026"

must be interpreted as:

2026-07-10

not:

2026-08-16

even if CareVR™ is processing the document on 16 August 2026.

============================================================
9. DOCTOR NAME READING
============================================================

Doctor names also require special care.

Look across:

- header
- doctor information section
- signature area
- printed-by field
- footer

When multiple occurrences identify the same doctor, use the
repeated evidence to increase confidence.

Do not select a doctor name merely because it appears somewhere
in the patient's history or an attached investigation report.

============================================================
10. DOCUMENT FIDELITY
============================================================

The uploaded document is the authoritative source for extraction.

Do not fill gaps using:

- today's date
- filename information
- upload metadata
- user profile information
- unrelated prior conversations
- general medical knowledge
- assumptions about the patient
- assumptions about the doctor

If the document does not support a value, return null or the
appropriate empty structure.

============================================================
11. CONFLICTING INFORMATION
============================================================

If different parts of the document appear to contain conflicting
information:

1. Prefer information explicitly associated with the clinical
   encounter.
2. Prefer repeated consistent evidence.
3. Prefer clearly labelled clinical fields.
4. Do not silently invent a resolution.
5. Preserve uncertainty when the conflict cannot be reliably
   resolved.

============================================================
12. FINAL DOCUMENT REVIEW
============================================================

Before returning the extraction, mentally review the entire
document again for:

- patient identity
- doctor identity
- consultation date
- consultation mode
- investigations
- symptoms
- assessment
- medications
- instructions
- follow-up

Do not finalize the extraction based on a partial reading of the
document.
`;