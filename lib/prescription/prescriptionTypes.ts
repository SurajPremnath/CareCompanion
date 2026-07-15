//------------------------------------------------------------
// Prescription Context
//------------------------------------------------------------

export type PrescriptionRecordContext =
    | "SELF"
    | "FAMILY";


//------------------------------------------------------------
// Consultation Mode
//------------------------------------------------------------

export type PrescriptionConsultationMode =
    | "IN_PERSON"
    | "VIDEO"
    | "PHONE"
    | "WHATSAPP"
    | "EMAIL"
    | "HOME_VISIT"
    | "HOSPITAL_ADMISSION"
    | "HOSPITAL_DISCHARGE"
    | "OTHER";


//------------------------------------------------------------
// Prescription Medicine Input
//------------------------------------------------------------

export interface PrescriptionMedicineInput {

    medicineName: string;

    strength: string | null;

    form: string | null;

    dose: string | null;

    frequency: string | null;

    timings: string[];

    duration: string | null;

    instructions: string | null;

    displayOrder: number;

}


//------------------------------------------------------------
// Prescription Vital Input
//------------------------------------------------------------

export interface PrescriptionVitalInput {

    weight: string | null;

    height: string | null;

    bmi: string | null;

    bloodPressure: string | null;

    pulse: string | null;

    respiratoryRate: string | null;

    spo2: string | null;

    temperature: string | null;

}

//------------------------------------------------------------
// Prescription Symptom Input
//------------------------------------------------------------

export interface PrescriptionSymptomInput {

    symptom: string;

    duration: string | null;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription History Input
//------------------------------------------------------------

export interface PrescriptionHistoryInput {

    category: string;

    value: string;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription Assessment Input
//------------------------------------------------------------

export interface PrescriptionAssessmentInput {

    assessmentType:

        | "DIAGNOSIS"

        | "CLINICAL_ASSESSMENT"

        | "EXAMINATION_FINDING"

        | "PLAN";

    value: string;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription Investigation Input
//------------------------------------------------------------

export interface PrescriptionInvestigationInput {

    investigation: string;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription Instruction Input
//------------------------------------------------------------

export interface PrescriptionInstructionInput {

    instruction: string;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription Note Input
//------------------------------------------------------------

export interface PrescriptionNoteInput {

    note: string;

    displayOrder: number;

}

//------------------------------------------------------------
// Prescription Save Input
//------------------------------------------------------------

export interface PrescriptionSaveInput {

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext:
        PrescriptionRecordContext;

    doctorName: string | null;

    consultationDate: string | null;

    consultationMode:
        PrescriptionConsultationMode | null;

    hospitalOrClinic: string | null;

    diagnosisOrAssessment: string | null;

vitals:
    PrescriptionVitalInput | null;

symptoms:
    PrescriptionSymptomInput[];

history:
    PrescriptionHistoryInput[];

assessments:
    PrescriptionAssessmentInput[];

investigations:
    PrescriptionInvestigationInput[];

instructions:
    PrescriptionInstructionInput[];

notes:
    PrescriptionNoteInput[];

additionalNotes: string | null;

medicines:
    PrescriptionMedicineInput[];

}


//------------------------------------------------------------
// Prescription Record
//------------------------------------------------------------

export interface PrescriptionRecord {

    id: string;

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext:
        PrescriptionRecordContext;

    doctorName: string | null;

    consultationDate: string | null;

    consultationMode:
        PrescriptionConsultationMode | null;

    hospitalOrClinic: string | null;

    diagnosisOrAssessment: string | null;

    additionalNotes: string | null;

    reviewedAt: string;

    createdAt: string;

    updatedAt: string;

}


//------------------------------------------------------------
// Prescription Medicine Record
//------------------------------------------------------------

export interface PrescriptionMedicineRecord {

    id: string;

    prescriptionId: string;

    medicineName: string;

    strength: string | null;

    form: string | null;

    dose: string | null;

    frequency: string | null;

    timings: string[];

    duration: string | null;

    instructions: string | null;

    displayOrder: number;

    createdAt: string;

    updatedAt: string;

}


//------------------------------------------------------------
// Complete Prescription Record
//------------------------------------------------------------

export interface CompletePrescriptionRecord {

    prescription:
        PrescriptionRecord;

    medicines:
        PrescriptionMedicineRecord[];

}