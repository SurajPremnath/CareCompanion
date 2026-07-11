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
    | "HOME_VISIT"
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

    additionalInstructions: string | null;

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

    additionalInstructions: string | null;

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