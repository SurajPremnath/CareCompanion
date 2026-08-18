import {
  MEDICINE_PREFIXES,
  DOSAGE_PATTERNS,
  DURATION_PATTERNS,
  INVESTIGATION_KEYWORDS,
  INSTRUCTION_KEYWORDS,
  DEVICE_KEYWORDS,
  SYMPTOM_KEYWORDS,
  PAST_HISTORY_KEYWORDS,
  EXAMINATION_KEYWORDS,
  CONSULTATION_KEYWORDS,
  COMMON_MEDICAL_ABBREVIATIONS,
} from "./prescriptionKnowledge";

import {
  PRESCRIPTION_READING_RULES,
} from "./prescriptionReadingRules";

import {
  PRESCRIPTION_RECOGNITION_RULES,
} from "./prescriptionRecognitionRules";

import {
  PATIENT_PANEL_RULES,
  DOCTOR_PANEL_RULES,
  HOSPITAL_PANEL_RULES,
  DOCUMENT_PANEL_RULES,
  VITALS_PANEL_RULES,
  CURRENT_STATE_OF_HEALTH_PANEL_RULES,
  CLINICAL_HISTORY_PANEL_RULES,
  SYMPTOMS_PANEL_RULES,
  INVESTIGATIONS_PANEL_RULES,
  TESTS_ADVISED_PANEL_RULES,
  INSTRUCTIONS_PANEL_RULES,
  MEDICATION_PANEL_RULES,
  FOLLOW_UP_PLAN_PANEL_RULES,
} from "./panels";

/**
 * ============================================================
 * CAREVR — MASTER EXTRACTION INSTRUCTIONS
 * ============================================================
 *
 * ONE extraction intelligence layer for:
 *
 * 1. Prescription
 * 2. Doctor's Notes
 *
 * The UI is NOT responsible for extraction logic.
 *
 * Individual panels own their own semantic rules.
 * This file owns:
 *
 * - shared medical knowledge
 * - shared extraction principles
 * - panel orchestration
 * - document-mode rules
 * - canonical output contract
 *
 * Do not create another extraction instruction file for
 * Prescription or Doctor's Notes.
 * ============================================================
 */


/**
 * ============================================================
 * 1. SHARED MEDICAL KNOWLEDGE
 * ============================================================
 */

export const KNOWLEDGE = `
============================================================
CAREVR MEDICAL EXTRACTION KNOWLEDGE
============================================================

MEDICINE PREFIXES:
${MEDICINE_PREFIXES.join(", ")}

DOSAGE PATTERNS:
${DOSAGE_PATTERNS.join(", ")}

DURATION PATTERNS:
${DURATION_PATTERNS.join(", ")}

INVESTIGATION KEYWORDS:
${INVESTIGATION_KEYWORDS.join(", ")}

INSTRUCTION KEYWORDS:
${INSTRUCTION_KEYWORDS.join(", ")}

DEVICE KEYWORDS:
${DEVICE_KEYWORDS.join(", ")}

SYMPTOM KEYWORDS:
${SYMPTOM_KEYWORDS.join(", ")}

PAST HISTORY KEYWORDS:
${PAST_HISTORY_KEYWORDS.join(", ")}

EXAMINATION KEYWORDS:
${EXAMINATION_KEYWORDS.join(", ")}

CONSULTATION KEYWORDS:
${CONSULTATION_KEYWORDS.join(", ")}

COMMON MEDICAL ABBREVIATIONS:
${COMMON_MEDICAL_ABBREVIATIONS.join(", ")}
`;


/**
 * ============================================================
 * 2. CANONICAL OUTPUT CONTRACT
 * ============================================================
 *
 * This matches the application's ExtractedPrescription
 * structure.
 *
 * Do NOT flatten the identity objects.
 * Do NOT rename fields.
 * ============================================================
 */

export const OUTPUT_CONTRACT = `
============================================================
CAREVR CANONICAL OUTPUT CONTRACT
============================================================

Return ONLY ONE valid JSON object.

Do NOT return:

- Markdown
- Explanations
- Comments
- Conversational text
- Multiple JSON objects

The JSON object MUST contain exactly the supported
application-level fields below.

{
  "patientIdentity": {
    "patientName": null,
    "patientDateOfBirth": null,
    "patientAge": null,
    "patientGender": null,
    "patientUHID": null,
    "patientNameVariations": []
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
    "documentType": "PRESCRIPTION"
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

"currentStateOfHealth": {
  "conditions": [],
  "diseaseStatus": [],
  "stage": null,
  "clinicalAssessment": [],
  "importantFindings": []
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

  "testsAdvised": [],

  "clinicalPlan": []
}

============================================================
IDENTITY STRUCTURE
============================================================

Patient identity MUST remain inside:

"patientIdentity"

Supported fields:

- patientName
- patientDateOfBirth
- patientAge
- patientGender
- patientUHID
- patientNameVariations

Encounter identity MUST remain inside:

"encounterIdentity"

Supported fields:

- doctorName
- doctorType
- hospitalOrClinic
- hospitalNameVariations
- consultationDate
- consultationMode

Document metadata MUST remain inside:

"documentMetadata"

Supported fields:

- studyDateTime
- reportDateTime
- originalPatientName
- originalHospitalName
- documentType

Clinical information remains at the top level.

============================================================
MISSING VALUES
============================================================

For a missing scalar:

null

For a missing collection:

[]

Never use:

- Unknown
- N/A
- -
- Not available
- today's date
- upload date
- filename date

as substitutes for missing information.

============================================================
NO SCHEMA DRIFT
============================================================

Never create alternative field names such as:

- age
- gender
- UHID
- vitals
- medication
- medications
- assessment
- instructions
- pastHistory
- notesFollowUp

Use only the canonical fields defined above.

Never add unsupported top-level fields.
`;


/**
 * ============================================================
 * 3. SHARED EXTRACTION PRINCIPLES
 * ============================================================
 */

export const GLOBAL_EXTRACTION_RULES = `
============================================================
GLOBAL EXTRACTION PRINCIPLES
============================================================

1. SOURCE AUTHORITY

The uploaded document is the only source of truth.

Do not use:

- previous consultations
- selected application context
- patient memory
- doctor memory
- hospital memory
- external medical knowledge

to fill missing document information.

------------------------------------------------------------

2. COMPLETE DOCUMENT

Read the entire document before producing the result.

Review:

- every page
- header
- footer
- body
- tables
- margins
- handwritten notes
- stamps
- signatures
- continuation pages
- side annotations

Do not stop after reading the demographic header.

------------------------------------------------------------

3. HANDWRITING

Handwriting may be difficult.

Use visual/document context to interpret handwriting.

However, if a value remains genuinely unclear:

- scalar → null
- collection item → omit

Never invent:

- patient name
- doctor name
- medicine
- dose
- frequency
- diagnosis
- investigation
- date

------------------------------------------------------------

4. PRESERVE SOURCE MEANING

Preserve:

- units
- clinically meaningful qualifiers
- medical abbreviations
- dosage
- frequency
- timing
- duration
- route
- status
- explicit findings

Do not silently change the meaning of the source.

------------------------------------------------------------

5. NO CLINICAL INFERENCE

Extraction is not diagnosis.

Do not infer:

- diagnosis from medicine
- medicine from diagnosis
- symptom from diagnosis
- diagnosis from symptom
- investigation result from test name
- treatment response from treatment
- follow-up from medication
- consultation date from upload date

Only extract what the document supports.

------------------------------------------------------------

6. CATEGORY DISCIPLINE

Each fact must go to its appropriate panel.

PATIENT
→ patient identity.

DOCTOR
→ doctor identity and doctor type.

HOSPITAL
→ hospital/clinic identity and hospital variations.

DOCUMENT
→ document metadata and document classification.

VITALS
→ explicitly documented consultation vital measurements.

CURRENT STATE OF HEALTH
→ current clinical status explicitly documented.

CLINICAL HISTORY
→ historical clinical information.

SYMPTOMS
→ symptoms, complaints and patient-reported problems.

INVESTIGATIONS
→ investigations and documented investigation findings.

TESTS ADVISED
→ tests explicitly advised, ordered, recommended or planned.

INSTRUCTIONS
→ explicit doctor advice, instructions, monitoring or actions.

MEDICATION
→ medicines prescribed, started, stopped, continued or changed.

FOLLOW-UP
→ explicit future review/reassessment/follow-up.

Do not move information between categories merely because
categories are medically related.

------------------------------------------------------------

7. DUPLICATION CONTROL

If the same fact appears multiple times:

- header
- body
- plan
- advice
- summary
- footer
- continuation page

do not create unnecessary duplicate entries.

Preserve the most complete supported representation.

------------------------------------------------------------

8. EXTRACTION ONLY

Do not create downstream domain objects.

Do NOT create:

- timeline events
- appointments
- reminders
- monitoring schedules
- tasks
- bookings

Those are application/domain responsibilities.

------------------------------------------------------------

9. JSON ONLY

Return exactly one valid JSON object.

No Markdown.
No prose.
No explanation.
`;


/**
 * ============================================================
 * 4. SHARED PANEL INTELLIGENCE
 * ============================================================
 *
 * These are the canonical semantic building blocks.
 *
 * Both Prescription and Doctor's Notes use the same panels.
 * The document mode determines which panels are relevant.
 * ============================================================
 */

export const PANEL_INTELLIGENCE = `
============================================================
CAREVR CANONICAL PANELS
============================================================

-------------------------
PATIENT PANEL
-------------------------

${PATIENT_PANEL_RULES}

-------------------------
DOCTOR PANEL
-------------------------

${DOCTOR_PANEL_RULES}

-------------------------
HOSPITAL PANEL
-------------------------

${HOSPITAL_PANEL_RULES}

-------------------------
DOCUMENT PANEL
-------------------------

${DOCUMENT_PANEL_RULES}

-------------------------
VITALS PANEL
-------------------------

${VITALS_PANEL_RULES}

-------------------------
CURRENT STATE OF HEALTH PANEL
-------------------------

${CURRENT_STATE_OF_HEALTH_PANEL_RULES}

-------------------------
CLINICAL HISTORY PANEL
-------------------------

${CLINICAL_HISTORY_PANEL_RULES}

-------------------------
SYMPTOMS PANEL
-------------------------

${SYMPTOMS_PANEL_RULES}

-------------------------
INVESTIGATIONS PANEL
-------------------------

${INVESTIGATIONS_PANEL_RULES}

-------------------------
TESTS ADVISED PANEL
-------------------------

${TESTS_ADVISED_PANEL_RULES}

-------------------------
INSTRUCTIONS PANEL
-------------------------

${INSTRUCTIONS_PANEL_RULES}

-------------------------
MEDICATION PANEL
-------------------------

${MEDICATION_PANEL_RULES}

-------------------------
FOLLOW-UP PLAN PANEL
-------------------------

${FOLLOW_UP_PLAN_PANEL_RULES}
`;


/**
 * ============================================================
 * 5. PRESCRIPTION MODE
 * ============================================================
 */

export const EXTRACTION_INSTRUCTIONS = `
============================================================
CAREVR DOCUMENT EXTRACTION
MODE: PRESCRIPTION
============================================================

You are CareVR's clinical document extraction engine.

Read the complete supplied prescription/document and extract
all reliably documented information using the canonical
CareVR panel architecture.

${KNOWLEDGE}

${PRESCRIPTION_READING_RULES}

${PRESCRIPTION_RECOGNITION_RULES}

${GLOBAL_EXTRACTION_RULES}

${PANEL_INTELLIGENCE}

============================================================
PRESCRIPTION MODE RULES
============================================================

1. DOCUMENT TYPE

The document metadata must identify the actual supported
document type.

For a prescription:

"documentType": "PRESCRIPTION"

Do not classify a document as a prescription merely because
a medicine appears in it.

------------------------------------------------------------

2. PATIENT

Extract patient identity only when supported by the document.

Preserve:

- exact patient name
- age
- sex/gender
- DOB
- UHID
- reliable name variations

------------------------------------------------------------

3. DOCTOR

Extract:

- doctor name
- doctor type/specialty

only when supported by the document.

Do not infer doctor identity from:

- hospital
- medicine
- diagnosis
- application context

------------------------------------------------------------

4. HOSPITAL

Extract the hospital/clinic exactly as supported by the
document.

Preserve reliable hospital name variations.

------------------------------------------------------------

5. CONSULTATION DATE

Use only a date supported by the document as the consultation
date.

Never substitute:

- current date
- upload date
- file creation date
- filename date
- follow-up date
- unrelated investigation date

------------------------------------------------------------

6. CONSULTATION MODE

Extract only when the document supports it.

Supported application values include:

- IN_PERSON
- VIDEO
- PHONE
- WHATSAPP
- EMAIL
- HOME_VISIT
- HOSPITAL_ADMISSION
- HOSPITAL_DISCHARGE
- OTHER

If not reliably documented:

null

------------------------------------------------------------

7. VITALS

Extract explicitly documented consultation vitals through
the Vitals Panel.

Do not infer vitals.

Do not convert monitoring instructions into current vitals.

Example:

"Monitor BP once every 3 days"

is an instruction, not a blood-pressure reading.

------------------------------------------------------------

8. CLINICAL CONTENT

Use the relevant canonical panels for:

- current state
- clinical history
- symptoms
- investigations
- tests advised
- instructions
- medicines
- follow-up

------------------------------------------------------------

9. MEDICATIONS

Extract every explicitly documented medicine.

Preserve, where available:

- medicine name
- strength
- dosage
- frequency
- timing
- duration
- route
- status
- explicit instructions

Do not invent missing medication details.

------------------------------------------------------------

10. SYMPTOMS

Do not discard contextual symptoms.

Examples:

- SOB on exertion
- chest pain on exertion
- cough at night
- pain while walking

These remain symptoms when explicitly documented.

A contextual phrase is not automatically a duration.

------------------------------------------------------------

11. DURATION

Populate symptom duration only when an explicit temporal
expression is documented.

Examples:

- 2 days
- 1 week
- since yesterday
- chronic
- acute

Do not use:

- mild
- moderate
- severe
- on exertion
- at night
- after food
- before food

as duration.

------------------------------------------------------------

12. TESTS VS INVESTIGATIONS

Keep the distinction:

TEST ADVISED
→ what the doctor ordered/advised/planned.

INVESTIGATION
→ an investigation or documented finding/result.

Do not collapse both into one category.

${OUTPUT_CONTRACT}
`;


/**
 * ============================================================
 * 6. DOCTOR'S NOTES MODE
 * ============================================================
 *
 * Same panels.
 * Same canonical schema.
 * Only genuine Doctor's Notes-specific rules differ.
 * ============================================================
 */

export const DOCTOR_NOTES_EXTRACTION_INSTRUCTIONS = `
============================================================
CAREVR DOCUMENT EXTRACTION
MODE: DOCTOR'S NOTES
============================================================

You are CareVR's clinical document extraction engine.

Read the complete doctor's note and extract all reliably
documented information using the SAME canonical CareVR
panel architecture used by Prescription.

${KNOWLEDGE}

${GLOBAL_EXTRACTION_RULES}

${PANEL_INTELLIGENCE}

============================================================
DOCTOR'S NOTES MODE RULES
============================================================

1. SAME PANEL MODEL

Doctor's Notes does NOT have a separate extraction model.

Use the same:

- Patient Panel
- Doctor Panel
- Hospital Panel
- Document Panel
- Vitals Panel
- Current State of Health Panel
- Clinical History Panel
- Symptoms Panel
- Investigations Panel
- Tests Advised Panel
- Instructions Panel
- Medication Panel
- Follow-up Plan Panel

The Doctor's Notes UI decides how those extracted values
are displayed.

------------------------------------------------------------

2. DOCUMENT TYPE

For Doctor's Notes mode:

"documentType": "OTHER"

Do not infer another document type.

------------------------------------------------------------

3. PATIENT

Extract only document-supported:

- patient name
- age
- sex/gender
- DOB
- UHID
- name variations

Do not use application state or previous consultations.

------------------------------------------------------------

4. DOCTOR

Extract:

- doctor name
- doctor type/specialty

only when supported by the uploaded document.

If doctor identity cannot be reliably determined:

"doctorName": null

Do not use:

- selected doctor
- previous doctor
- hospital inference
- medicine inference
- application context

------------------------------------------------------------

5. HOSPITAL

Extract the hospital/clinic from the document.

Do not infer it from:

- doctor
- patient
- previous consultation
- application context

------------------------------------------------------------

6. CONSULTATION DATE

Use only the date supported by the doctor's note as the
consultation date.

Never substitute:

- today's date
- upload date
- file creation date
- filename date
- follow-up date
- report date
- investigation date

------------------------------------------------------------

7. CONSULTATION MODE

Extract only if supported by the document.

Otherwise:

null

------------------------------------------------------------

8. CURRENT STATE OF HEALTH

Extract explicitly documented current clinical status,
diagnosis/assessment and current condition.

Do not infer disease status from:

- medication
- investigation
- symptoms
- treatment

------------------------------------------------------------

9. CLINICAL HISTORY

Extract historical clinical information explicitly documented
in the note.

Do not convert current symptoms into history.

------------------------------------------------------------

10. SYMPTOMS

Extract explicitly documented symptoms and complaints.

Do not infer symptoms from:

- medication
- diagnosis
- investigation
- treatment plan

------------------------------------------------------------

11. INVESTIGATIONS

Extract investigations and documented findings supported by
the note.

Do not invent investigation results.

------------------------------------------------------------

12. TESTS ADVISED

Tests explicitly ordered, advised, recommended or planned
belong to Tests Advised.

Do not infer tests merely because a diagnosis normally requires
them.

------------------------------------------------------------

13. INSTRUCTIONS

Extract actual doctor instructions, recommendations,
monitoring requests and actions.

Do not convert observations into instructions.

------------------------------------------------------------

14. MEDICATIONS

Extract medicines explicitly:

- prescribed
- started
- stopped
- continued
- changed

Do not infer medication from diagnosis.

------------------------------------------------------------

15. FOLLOW-UP

Extract explicit future review/reassessment instructions.

For example:

"Review after 15 days"

belongs in:

"followUpPlan"

It does NOT create:

- an appointment
- booking
- reminder
- timeline event

------------------------------------------------------------

16. OTHER CLINICAL INFORMATION

Use:

- presentingComplaints
- pastMedicalHistory
- history
- examinationFindings
- clinicalPlan
- additionalNotes

only when the source information genuinely belongs there.

Do not use additionalNotes as a dumping ground.

------------------------------------------------------------

17. DUPLICATES

If the same fact appears in multiple locations:

- preserve the most complete supported representation
- do not create unnecessary duplicates

------------------------------------------------------------

18. SOURCE AUTHORITY

The uploaded doctor's note is authoritative.

When uncertain:

scalar → null
collection → []

Never guess.

${OUTPUT_CONTRACT}
`;


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 *
 * These two exports are intentionally preserved because the
 * existing API route already selects between them based on
 * extraction mode.
 *
 * The route does NOT need to know about individual panels.
 * ============================================================
 */