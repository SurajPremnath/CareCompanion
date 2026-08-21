import type {
  PatientInformationSource,
} from "@/lib/prescription/prescriptionTypes";


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

export type MedicineMatchStatus =
    | "FOUND"
    | "NOT_FOUND"
    | "SUGGESTIONS";

export type ReviewStatus = 
    | "REVIEW" 
    | "VERIFIED"
    | "EXCLUDED";

export interface SuggestedMedicine {

  id: string;

  brandName: string;

  genericName: string | null;

  strength: string | null;

  formulation: string | null;

}

//------------------------------------------------------------
// Prescription Medicine
//------------------------------------------------------------

export interface ExtractedPrescriptionMedicine {

    name: string;

    ocrMedicineName?: string;

    strength: string | null;

    form: string | null;

    dose: string | null;

    frequency: string | null;

    timings: string[];

    duration: string | null;

    instructions: string | null;

    reviewStatus?: ReviewStatus;

    matchStatus?: MedicineMatchStatus;

    resolvedMedicineId?: string;

    resolvedMedicineName?: string;

    /*
    What caregiver typed while correcting OCR.
    Used for audit.
    */

    userUpdatedMedicineName?: string;

    suggestedMedicines?: SuggestedMedicine[];
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

export interface ExtractedSymptom {

  symptom: string;

  duration: string | null;

  severity: string | null;

  qualifiers: string | null;

}

export interface ExtractedComplaint {

  complaint: string;

  duration: string | null;

  severity: string | null;

  qualifiers: string | null;

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

export interface ExtractedTestAdvised {

    test: string;

    action: string | null;

    timing: string | null;

    condition: string | null;

}

//------------------------------------------------------------
// Extracted Prescription
//------------------------------------------------------------

export type MedicalDocumentType =
    | "PRESCRIPTION"
    | "DOCTOR_NOTES"
    | "OTHER"
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
    | "ECG";


//------------------------------------------------------------
// Patient Identity
//------------------------------------------------------------

export interface ExtractedPatientIdentity {

  patientName: string | null;

  patientDateOfBirth: string | null;

  patientAge: string | null;

  patientGender: string | null;

  patientUHID: string | null;

  patientNameVariations: string[];

  //----------------------------------------------------------
  // Demographic Extraction Provenance
  //----------------------------------------------------------

  ageFlag: boolean;

  sexFlag: boolean;

  ageSource:
    PatientInformationSource | null;

  sexSource:
    PatientInformationSource | null;
}


//------------------------------------------------------------
// Encounter Identity
//------------------------------------------------------------

export interface ExtractedEncounterIdentity {

  doctorName: string | null;

  doctorType: string | null;

  hospitalOrClinic: string | null;

  hospitalNameVariations: string[];

  consultationDate: string | null;

  consultationMode: ConsultationMode | null;
}


//------------------------------------------------------------
// Document Metadata
//------------------------------------------------------------

export interface ExtractedDocumentMetadata {

  studyDateTime: string | null;

  reportDateTime: string | null;

  originalPatientName: string | null;

  originalHospitalName: string | null;

  documentType: MedicalDocumentType;
}

//------------------------------------------------------------
// Extracted Prescription / Clinical Document
//------------------------------------------------------------

export interface ExtractedCurrentStateOfHealth {

  conditions:
    string[];

  diseaseStatus:
    string[];

  stage:
    string | null;

  clinicalAssessment:
    string[];

  importantFindings:
    string[];
}

export interface ExtractedPrescription {

  patientIdentity:
    ExtractedPatientIdentity;

  encounterIdentity:
    ExtractedEncounterIdentity;

  documentMetadata:
    ExtractedDocumentMetadata;

  consultationVitals:
    ExtractedConsultationVital | null;

  currentStateOfHealth:
    ExtractedCurrentStateOfHealth;

  diagnosisOrAssessment:
    string | null;

  clinicalAssessments:
    string[];

  symptoms:
    ExtractedSymptom[];

  presentingComplaints:
    ExtractedComplaint[];

  pastMedicalHistory:
    string[];

  history:
    ExtractedHistory[];

  examinationFindings:
    ExtractedExaminationFinding[];

  doctorInstructions:
    string[];

  followUpPlan:
    string[];

  medicines:
    ExtractedPrescriptionMedicine[];

  additionalNotes:
    string[];

  investigations:
    string[];

  testsAdvised:
    ExtractedTestAdvised[];

  clinicalPlan:
    string[];
}

//------------------------------------------------------------
// Prescription Image Processing Result
//------------------------------------------------------------

export interface PrescriptionImageProcessingResult {

  success: boolean;

  data?: ExtractedPrescription;

  error?: string;

}