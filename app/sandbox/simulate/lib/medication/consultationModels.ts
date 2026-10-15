import type { ConsultationMetadata } from "./consultationTypes";
import type { Medicine } from "./medicationTypes";

/**
 * ============================================================
 * CAREVR Canonical Consultation
 * ============================================================
 */

export interface Consultation {

    metadata: ConsultationMetadata;

    patient: ConsultationPatient;

    consultation: ConsultationDetails;

    vitals: ConsultationVitals;

    complaints: ConsultationComplaint[];

    history: ConsultationHistory[];

    assessments: ConsultationAssessment[];

    investigations: ConsultationInvestigation[];

    medicines: Medicine[];

    doctorInstructions: ConsultationDoctorInstruction[];

    followUps: ConsultationFollowUp[];

    diagnosis?: string;

    notes?: string;

    attachments?: string[];

    rawExtraction?: unknown;
}

/**
 * ============================================================
 * Patient
 * ============================================================
 */

export interface ConsultationPatient {
    uhid?: string;
    patientName?: string;
    age?: string;
    gender?: string;
}

/**
 * ============================================================
 * Consultation Details
 * ============================================================
 */

export interface ConsultationDetails {
    consultationDate?: Date;
    consultationMode?: string;

    doctorName?: string;
    hospitalName?: string;
}

/**
 * ============================================================
 * Vitals
 * ============================================================
 */

export interface ConsultationVitals {
    temperature?: string;
    bloodPressure?: string;
    pulse?: string;
    spo2?: string;
    respiratoryRate?: string;
    weight?: string;
}

/**
 * ============================================================
 * Complaint
 * ============================================================
 */

export interface ConsultationComplaint {
    complaint: string;
    duration?: string;
}

/**
 * ============================================================
 * History
 * ============================================================
 */

export interface ConsultationHistory {
    category: string;
    value: string;
}

/**
 * ============================================================
 * Assessment
 * ============================================================
 */

export interface ConsultationAssessment {
    name: string;
}

/**
 * ============================================================
 * Investigation
 * ============================================================
 */

export interface ConsultationInvestigation {
    name: string;
}

/**
 * ============================================================
 * Doctor Instruction
 * ============================================================
 */

export interface ConsultationDoctorInstruction {
    instruction: string;
}

/**
 * ============================================================
 * Follow Up
 * ============================================================
 */

export interface ConsultationFollowUp {
    followUp?: string;

    title?: string;

    type?: string;

    description?: string;
}

/**
 * Temporary compatibility alias.
 * Existing Journey code still refers to ConsultationRecord.
 * Once Journey is fully migrated, this alias can be removed.
 */
export type ConsultationRecord = Consultation;