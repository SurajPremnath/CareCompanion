//------------------------------------------------------------
// Consultation Mode
//------------------------------------------------------------

export type ConsultationMode =
  | "IN_PERSON"
  | "VIDEO"
  | "PHONE"
  | "HOME_VISIT"
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
// Extracted Prescription
//------------------------------------------------------------

export interface ExtractedPrescription {

  patientName: string | null;

  patientDateOfBirth: string | null;

  doctorName: string | null;

  consultationDate: string | null;

  consultationMode: ConsultationMode | null;

  hospitalOrClinic: string | null;

  diagnosisOrAssessment: string | null;

  medicines: ExtractedPrescriptionMedicine[];

  additionalInstructions: string | null;

}


//------------------------------------------------------------
// Prescription Image Processing Result
//------------------------------------------------------------

export interface PrescriptionImageProcessingResult {

  success: boolean;

  data?: ExtractedPrescription;

  error?: string;

}