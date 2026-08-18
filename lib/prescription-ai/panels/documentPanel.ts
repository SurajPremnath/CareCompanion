/**
 * Document Panel
 *
 * Single responsibility:
 * Identify the role/type of each supplied medical document.
 *
 * Reusable by:
 * - Doctor's Notes
 * - Prescription
 * - Other clinical-document extraction workflows
 *
 * This panel MUST NOT extract clinical information.
 */

export const DOCUMENT_PANEL_RULES = `
============================================================
DOCUMENT PANEL
============================================================

PURPOSE
Identify what type or role each supplied document represents.

This panel is responsible ONLY for document classification.

============================================================
1. DOCUMENT CATEGORIES
============================================================

Use these patient-facing categories whenever applicable:

- Prescription
- Doctor's Notes
- Report
- Test Results

A document may belong to only one primary category.

Do not classify a document based only on its filename.

Classify it based on the actual visible content and structure.


============================================================
2. PRESCRIPTION
============================================================

Classify as:

"Prescription"

when the document primarily communicates medicines prescribed,
recommended, continued or changed by a doctor.

Typical evidence includes:

- Medicine names
- Strength
- Dose
- Frequency
- Duration
- Prescription instructions
- Doctor's signature
- Prescription date

Do not classify as Prescription merely because a medicine name
appears inside:

- a laboratory report
- pathology report
- discharge summary
- clinical history
- medication history


============================================================
3. DOCTOR'S NOTES
============================================================

Classify as:

"Doctor's Notes"

when the document primarily represents the doctor's clinical
communication/consultation note.

Typical evidence includes:

- Current clinical assessment
- Symptoms
- Clinical history
- Examination
- Doctor's assessment
- Clinical plan
- Instructions
- Follow-up
- Tests advised
- Medicines suggested as part of the consultation

A Doctor's Note may contain medicines and investigations.

Do not classify it as a Prescription merely because medicines are
present.


============================================================
4. REPORT
============================================================

Classify as:

"Report"

when the document primarily communicates a formal medical report
or clinical interpretation generated from an examination,
investigation or procedure.

Examples include:

- Radiology report
- Pathology report
- Histopathology report
- Specialist report
- Discharge report
- Formal clinical report

The presence of medical findings alone does not make a document a
Doctor's Note.


============================================================
5. TEST RESULTS
============================================================

Classify as:

"Test Results"

when the document primarily contains test measurements, values,
findings or results.

Examples:

- Blood test results
- Urine test results
- ECG result
- Echo result
- MRI result
- CT result
- PET CT result
- Laboratory result
- Diagnostic test result

If a formal interpretation/report is the dominant document role,
use "Report" rather than "Test Results".


============================================================
6. MULTIPLE UPLOADED DOCUMENTS
============================================================

Evaluate EACH uploaded document independently.

Example:

Upload set:

1. Doctor consultation note
2. Prescription
3. PET CT report
4. Blood test report

Possible classification:

1. Doctor's Notes
2. Prescription
3. Report
4. Test Results

Do not merge the documents into one category.

Do not allow one document's content to determine another
document's classification.


============================================================
7. DOCUMENT ROLE VS CLINICAL CONTENT
============================================================

This panel classifies the document.

It does NOT extract:

- Patient name
- Age
- Sex
- Doctor name
- Doctor role
- Hospital
- UHID
- Consultation date
- Consultation mode
- Diagnosis
- Clinical history
- Symptoms
- Investigations
- Test results
- Tests advised
- Medicines
- Instructions
- Follow-up
- Vitals

Those belong to other panels.


============================================================
8. SUPPORTING DOCUMENTS
============================================================

Supporting reports and test results must remain identifiable as
supporting documents.

Do not treat a supporting report as the doctor's consultation note.

Example:

A PET CT report uploaded alongside a Doctor's Note:

Document 1:
Doctor's Notes

Document 2:
Report / Test Results

The PET CT report must not become part of the Doctor's Note
document role merely because the doctor discusses the PET CT.


============================================================
9. FILENAME SAFETY
============================================================

Never classify based solely on filename.

Examples:

"doctor_notes.pdf"
"prescription.jpg"
"report_final.pdf"

are hints only.

The actual document content is the source of truth.

If filename and document content conflict:

prefer the actual document content.


============================================================
10. EMPTY / UNKNOWN
============================================================

If the document role cannot be determined reliably:

documentType = "OTHER"

Do not guess.


============================================================
11. OUTPUT
============================================================

This panel contributes ONLY document classification.

Recommended structure:

{
  "documents": [
    {
      "documentType":
        "PRESCRIPTION"
        | "DOCTORS_NOTES"
        | "REPORT"
        | "TEST_RESULTS"
        | "OTHER"
    }
  ]
}

Each uploaded document should have its own classification.


============================================================
12. ANTI-HALLUCINATION
============================================================

NEVER:

- classify from filename alone
- classify from application route
- classify every uploaded document as Prescription
- classify every medical report as Doctor's Notes
- classify a document based on the presence of one medicine
- classify a document based on the presence of one investigation
- use clinical interpretation to invent a document type


============================================================
13. FINAL VALIDATION
============================================================

Before returning classification:

1. Was the actual document content examined?
2. Is the primary role clear?
3. If multiple documents exist, were they classified independently?
4. Was filename treated only as supporting evidence?
5. Was clinical content kept separate from document classification?
6. Has no information belonging to another panel been extracted?

END DOCUMENT PANEL
`;