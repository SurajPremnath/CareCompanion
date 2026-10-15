export const DOCTOR_NOTES_OUTPUT_CONTRACT = `
============================================================
DOCTOR'S NOTES — OUTPUT CONTRACT
============================================================

Return ONLY ONE valid JSON object.

The existing Doctor's Notes / ExtractedPrescription contract is
authoritative.

Do not invent a new schema.
Do not rename fields.
Do not add unsupported top-level fields.

============================================================
1. REQUIRED TOP-LEVEL STRUCTURE
============================================================

The JSON object MUST contain exactly these application-level fields:

{
  "patientIdentity": {
    "patientName": null,
    "patientDateOfBirth": null,
    "patientAge": null,
    "patientGender": null,
    "patientUHID": null,
    "patientNameVariations": [],
    "ageFlag": false,
    "sexFlag": false,
    "ageSource": null,
    "sexSource": null
  },

  "encounterIdentity": {
    "doctorName": null,
    "doctorType": null,
    "hospitalOrClinic": null,
    "hospitalNameVariations": [],
    "consultationDate": null,
    "consultationMode": null
  },

  "documentMetadata": {
    "studyDateTime": null,
    "reportDateTime": null,
    "originalPatientName": null,
    "originalHospitalName": null,
    "documentType": "OTHER"
  },

  "consultationVitals": {
    "weight": null,
    "height": null,
    "bmi": null,
    "bloodPressure": null,
    "pulse": null,
    "respiratoryRate": null,
    "spo2": null,
    "temperature": null
  },

  "diagnosisOrAssessment": null,
  "clinicalAssessments": [],
  "symptoms": [],
  "presentingComplaints": [],
  "pastMedicalHistory": [],
  "history": [],
  "examinationFindings": [],
  "doctorInstructions": [],
  "followUpPlan": [],
  "medicines": [],
  "additionalNotes": [],
  "investigations": [],
  "clinicalPlan": []
}

============================================================
2. PATIENT IDENTITY
============================================================

Use the existing patientIdentity object.

Supported fields:

- patientName
- patientDateOfBirth
- patientAge
- patientGender
- patientUHID
- patientNameVariations
- ageFlag
- sexFlag
- ageSource
- sexSource

Use only information supported by the uploaded document.

If a scalar value cannot be reliably determined, return null.

patientNameVariations MUST be an array. Return [] when there are no
reliable variants.

ageFlag and sexFlag MUST be boolean values. Use false when there is no
reliable demographic conflict/flag to report.

Do not invent patient identity.

============================================================
3. ENCOUNTER IDENTITY
============================================================

Use the existing encounterIdentity object.

Supported fields:

- doctorName
- doctorType
- hospitalOrClinic
- hospitalNameVariations
- consultationDate
- consultationMode

doctorName MUST contain only a doctor identity supported by the
uploaded document.

If the doctor cannot be reliably identified:

"doctorName": null

Do not use application state, a previous consultation, the upload
user, or any external context as a fallback.

============================================================
4. CONSULTATION DATE
============================================================

consultationDate MUST be stored as:

YYYY-MM-DD

Example:

"10 July 2026"

must become:

"2026-07-10"

If the consultation date cannot be reliably extracted:

"consultationDate": null

NEVER substitute:

- the current date
- the upload date
- the file creation date
- the filename date
- a follow-up date
- an unrelated investigation/report date

The consultation date must come from the doctor's note/document
evidence.

============================================================
5. CONSULTATION MODE
============================================================

Use the existing machine-readable enum when supported by the document:

"IN_PERSON"
"VIDEO"
"PHONE"
"WHATSAPP"
"EMAIL"
"HOME_VISIT"
"HOSPITAL_ADMISSION"
"HOSPITAL_DISCHARGE"
"OTHER"

If the consultation mode cannot be reliably determined, return null.

============================================================
6. DOCUMENT METADATA
============================================================

Use the existing documentMetadata object.

Supported fields:

- studyDateTime
- reportDateTime
- originalPatientName
- originalHospitalName
- documentType

For Doctor's Notes mode:

"documentType": "OTHER"

Do not use document metadata as a substitute for consultationDate.

Do not confuse report/study dates with the consultation date unless
the document explicitly supports that interpretation.

============================================================
7. DIAGNOSIS / ASSESSMENT
============================================================

Use the existing fields exactly:

"diagnosisOrAssessment": null
"clinicalAssessments": []

"diagnosisOrAssessment" is a string or null.
"clinicalAssessments" is an array of strings.

Do not infer a diagnosis from symptoms, medicines, investigations,
treatment plans or general medical knowledge.

Only capture what the doctor actually documented.

============================================================
8. SYMPTOMS AND PRESENTING COMPLAINTS
============================================================

Use:

"symptoms": []
"presentingComplaints": []

Symptoms are strings.

Presenting complaints MUST use the existing complaint structure:

{
  "complaint": "...",
  "duration": null
}

Extract only information explicitly supported by the document.

Preserve clinically meaningful qualifiers and durations.

Do not infer symptoms from medicines, tests or diagnoses.

============================================================
9. HISTORY
============================================================

Use:

"pastMedicalHistory": []
"history": []

history items MUST use the existing structure:

{
  "category": "MEDICAL",
  "value": "..."
}

Allowed history categories are:

"MEDICAL"
"SURGICAL"
"MEDICATION"
"ALLERGY"
"LIFESTYLE"
"SOCIAL"
"OTHER"

Only include information supported by the doctor's note.

============================================================
10. EXAMINATION FINDINGS
============================================================

Use:

"examinationFindings": []

Each item MUST use the existing structure:

{
  "finding": "..."
}

Do not infer examination findings.

============================================================
11. MEDICATIONS
============================================================

Use:

"medicines": []

Each medicine MUST follow the existing ExtractedPrescriptionMedicine
structure.

Required fields:

- name
- strength
- form
- dose
- frequency
- timings
- duration
- instructions

Use [] for timings when none are documented.

Optional application fields may be included only when actually
supported by the existing schema and the processing pipeline.

Do not invent dose, frequency, duration, route, or medication status.

============================================================
12. INVESTIGATIONS
============================================================

Use:

"investigations": []

Extract investigations, tests, procedures, pathology studies,
imaging studies, molecular studies, and their documented findings
when they are explicitly present in the doctor's note.

An investigation may be:

- ordered
- advised
- recommended
- planned
- requested
- completed
- performed
- reviewed
- reported
- documented with a result or finding

IMPORTANT:

If an investigation has a documented result or finding, preserve
the investigation and its result together as ONE investigation
entry.

Examples:

"PET CT scan - left lung, liver, bone mets"

"Biopsy - NSCLC, poorly differentiated carcinoma"

"IHC - adenocarcinoma"

"PDL1 - 80% positive"

"MRI Brain - no mets"

"NGS - MET positive, MDM2 amplification +, MSI - low, TMB - low,
FGFR4 - amplification +"

Do NOT reduce:

"PET CT scan - left lung, liver, bone mets"

to only:

"PET CT scan"

The clinically meaningful finding must not be discarded.

Do NOT move an investigation result into
"clinicalAssessments" merely because the result is clinically
important.

The investigation and its documented finding belong in:

"investigations": []

when the finding is part of the investigation/report statement.

Preserve clinically meaningful qualifiers exactly as supported by
the document, including:

- positive
- negative
- no mets
- low
- high
- amplification
- mutation
- percentage values
- pathology findings
- imaging findings
- molecular findings

Do not invent or interpret investigation results.

Do not infer a result from:

- diagnosis
- symptoms
- medicines
- treatment plan
- general medical knowledge

If an investigation is mentioned without a result:

preserve the investigation name alone.

If a result is explicitly documented without a clearly identifiable
investigation:

place the information in the most appropriate existing clinical
field rather than inventing an investigation name.

Do not duplicate the same investigation in multiple fields.

Do not convert diagnoses into investigations.

Do not convert investigations into diagnoses.

The distinction is:

Diagnosis / Assessment:
What condition or clinical assessment the doctor documented.

Investigation:
What test, procedure, pathology, imaging or molecular study was
performed, ordered, reviewed or documented, together with its
documented finding when available.

============================================================
13. DOCTOR INSTRUCTIONS
============================================================

Use:

"doctorInstructions": []

Extract explicit recommendations, monitoring instructions, advice,
home-care guidance, preparation instructions and actions the doctor
expects the patient/caregiver/family to perform.

Preserve clinically meaningful:

- frequency
- duration
- timing
- conditions
- monitoring parameters

Do not convert symptoms, diagnoses, history or investigations into
doctor instructions.

============================================================
14. FOLLOW-UP
============================================================

Use:

"followUpPlan": []

Capture explicit future review, reassessment or return instructions.

Do not invent an appointment.
Do not invent a follow-up date.
Preserve explicitly documented timing or dependencies.

============================================================
15. ADDITIONAL CLINICAL INFORMATION
============================================================

Use the existing fields:

"additionalNotes": []
"clinicalPlan": []

Preserve clinically useful information that belongs in these existing
application fields.

Do not create new top-level fields.

============================================================
16. MULTI-IMAGE / MULTI-PAGE DOCUMENT
============================================================

When multiple images or pages are uploaded for the same Doctor's Notes
submission:

- Treat them as one document set.
- Read ALL uploaded pages before producing the result.
- Combine information across pages into one coherent extraction.
- Do not stop after the first page.
- Do not create unnecessary duplicate entries.
- Preserve the most complete wording when the same instruction appears
  repeatedly.
- Extract doctorName and consultationDate from document evidence.
- If they cannot be reliably determined, return null rather than
  guessing.

============================================================
17. HANDWRITING
============================================================

Doctor's notes may contain difficult handwriting.

Use surrounding clinical context only when the reading remains
reasonably supported.

If handwriting is genuinely unclear:

- return null for an uncertain scalar value
- omit the uncertain item from an array

Do not fabricate a medicine, dose, test, doctor name or instruction.

============================================================
18. NO HALLUCINATION
============================================================

Never invent:

- patient details
- doctor details
- hospital details
- symptoms
- diagnoses
- medicines
- dosage
- frequency
- duration
- investigations
- monitoring instructions
- follow-up dates

If information is not present or cannot be reliably read, return null
or [] as appropriate.

============================================================
19. NO ADDITIONAL TOP-LEVEL FIELDS
============================================================

Do not create additional top-level fields such as:

- vitals
- doctor
- date
- tests
- medications
- notes
- complaints
- diagnosis
- assessment
- followUp
- metadata
- confidence
- source

unless they already exist in the authoritative ExtractedPrescription
schema.

============================================================
20. JSON FORMAT
============================================================

Return valid JSON only.

Do NOT return:

- Markdown
- code fences
- explanations
- comments
- headings
- reasoning
- conversational text

The first character must be:

{

The final character must be:

}

============================================================
21. FINAL CONTRACT CHECK
============================================================

Before returning the JSON, verify:

- patientIdentity is present.
- encounterIdentity is present.
- documentMetadata is present.
- consultationVitals is present with all values null.
- diagnosisOrAssessment is a string or null.
- All expected arrays are present.
- presentingComplaints use complaint/duration objects.
- history items use category/value objects.
- examinationFindings use finding objects.
- medicines follow the existing medicine structure.
- doctorName is document-supported or null.
- consultationDate is YYYY-MM-DD or null.
- documentType is exactly "OTHER".
- No unsupported top-level fields were added.
- No information was invented.
- The response is valid JSON only.
`;