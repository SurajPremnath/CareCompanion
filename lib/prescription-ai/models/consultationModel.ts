export type ConsultationMode =
    | "IN_PERSON"
    | "VIDEO"
    | "PHONE"
    | "WHATSAPP"
    | "EMAIL"
    | "HOME_VISIT"
    | "HOSPITAL_ADMISSION"
    | "HOSPITAL_DISCHARGE"
    | "OTHER";

export interface PatientInfo {
    patientName: string | null;
    age: string | null;
    gender: string | null;
    uhid: string | null;
}

export interface ConsultationInfo {
    doctorName: string | null;
    hospitalName: string | null;
    consultationDate: string | null;
    consultationMode: ConsultationMode | null;
}

export interface ConsultationVitals {
    weight: string | null;
    height: string | null;
    bmi: string | null;
    bloodPressure: string | null;
    pulse: string | null;
    respiratoryRate: string | null;
    spo2: string | null;
    temperature: string | null;
}

export interface Complaint {
    complaint: string;
    duration: string | null;
}

export type HistoryCategory =
    | "MEDICAL"
    | "SURGICAL"
    | "MEDICATION"
    | "ALLERGY"
    | "SOCIAL"
    | "LIFESTYLE"
    | "OTHER";

export interface History {
    category: HistoryCategory;
    value: string;
}

export interface Assessment {
    assessment: string;
}

export interface Investigation {
    investigation: string;
}

export interface Medicine {
    name: string;
    strength: string | null;
    form: string | null;
    dose: string | null;
    frequency: string | null;
    duration: string | null;
    administrationTiming: string | null;
    instructions: string | null;
}

export interface DoctorInstruction {
    instruction: string;
}

export interface FollowUp {
    followUp: string;
}

export interface ConsultationRecord {
    patient: PatientInfo;
    consultation: ConsultationInfo;
    vitals: ConsultationVitals;
    complaints: Complaint[];
    history: History[];
    assessments: Assessment[];
    investigations: Investigation[];
    medicines: Medicine[];
    doctorInstructions: DoctorInstruction[];
    followUps: FollowUp[];
    additionalNotes: string | null;
}