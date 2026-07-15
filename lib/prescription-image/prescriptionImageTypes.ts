//------------------------------------------------------------
// Consultation Mode
//------------------------------------------------------------

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


//------------------------------------------------------------
// Prescription Medicine
//------------------------------------------------------------

export interface ExtractedPrescriptionMedicine {

  name: string;

  strength: string | null;

  form: string | null;

  dose: string | null;

  frequency: string | null;

  timings: string[];

  duration: string | null;

  instructions: string | null;

}

//------------------------------------------------------------
// Consultation Understanding
//------------------------------------------------------------

export interface ExtractedConsultationVital {

  weight: string | null;

  height: string | null;

  bmi: string | null;

  bloodPressure: string | null;

  pulse: string | null;

  respiratoryRate: string | null;

  spo2: string | null;

  temperature: string | null;

}

export interface ExtractedComplaint {

  complaint: string;

  duration: string | null;

}

export type HistoryCategory =
  | "MEDICAL"
  | "SURGICAL"
  | "MEDICATION"
  | "ALLERGY"
  | "LIFESTYLE"
  | "SOCIAL"
  | "OTHER";

export interface ExtractedHistory {

  category: HistoryCategory;

  value: string;

}

export interface ExtractedExaminationFinding {

    finding: string;

}

//------------------------------------------------------------
// Extracted Prescription
//------------------------------------------------------------

export type MedicalDocumentType =
  | "PRESCRIPTION"
  | "DISCHARGE_SUMMARY"
  | "ADMISSION_NOTE"
  | "LAB_REPORT"
  | "MRI"
  | "CT"
  | "PET_CT"
  | "HISTOPATHOLOGY"
  | "IHC"
  | "NGS"
  | "ECHO"
  | "ECG"
  | "OTHER";


export interface ExtractedPrescription {

    patientName: string | null;

patientAge: string | null;

patientGender: string | null;

patientUHID: string | null;

    patientDateOfBirth: string | null;

    doctorName: string | null;

    consultationDate: string | null;

    consultationMode: ConsultationMode | null;

    consultationVitals: ExtractedConsultationVital | null;

    hospitalOrClinic: string | null;

    diagnosisOrAssessment: string | null;

clinicalAssessments: string[];

//------------------------------------------------------------
// Clinical Understanding
//------------------------------------------------------------

symptoms: string[];

presentingComplaints: ExtractedComplaint[];

pastMedicalHistory: string[];

history: ExtractedHistory[];

examinationFindings: ExtractedExaminationFinding[];

doctorInstructions: string[];

followUpPlan: string[];

    medicines: ExtractedPrescriptionMedicine[];

    additionalNotes: string[];

    // New fields (Phase 1)

    documentType: MedicalDocumentType;

    investigations: string[];

clinicalPlan: string[];

}

//------------------------------------------------------------
// Prescription Image Processing Result
//------------------------------------------------------------

export interface PrescriptionImageProcessingResult {

  success: boolean;

  data?: ExtractedPrescription;

  error?: string;

}