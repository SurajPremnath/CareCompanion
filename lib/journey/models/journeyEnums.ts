/**
 * CareVR Journey Engine
 * -----------------------------------------
 * Canonical Journey Enumerations
 *
 * This file defines every enum used throughout the
 * Journey subsystem.
 *
 * Rules:
 * - No business logic
 * - No dependencies
 * - Stable domain definitions only
 */

export enum JourneyNodeType {
  Patient = "PATIENT",

  Consultation = "CONSULTATION",

  Prescription = "PRESCRIPTION",

  Medication = "MEDICATION",

  Diagnosis = "DIAGNOSIS",

  Symptom = "SYMPTOM",

  Assessment = "ASSESSMENT",

  Vital = "VITAL",

  Laboratory = "LABORATORY",

  Procedure = "PROCEDURE",

  ClinicalEvent = "CLINICAL_EVENT",

  Timeline = "TIMELINE",

  Treatment = "TREATMENT",

  Recommendation = "RECOMMENDATION",

  Alert = "ALERT",

  Question = "QUESTION",

  Observation = "OBSERVATION"
}

export enum JourneyEdgeType {
  PreviousConsultation = "PREVIOUS_CONSULTATION",

  FollowUp = "FOLLOW_UP",

  Prescribed = "PRESCRIBED",

  ContinuesMedication = "CONTINUES_MEDICATION",

  StopsMedication = "STOPS_MEDICATION",

  ReplacesMedication = "REPLACES_MEDICATION",

  DosageChanged = "DOSAGE_CHANGED",

  DiagnosisConfirmed = "DIAGNOSIS_CONFIRMED",

  DiagnosisModified = "DIAGNOSIS_MODIFIED",

  DiagnosisRemoved = "DIAGNOSIS_REMOVED",

  SymptomImproved = "SYMPTOM_IMPROVED",

  SymptomWorsened = "SYMPTOM_WORSENED",

  RelatedTo = "RELATED_TO",

  DerivedFrom = "DERIVED_FROM",

  GeneratedFrom = "GENERATED_FROM"
}

export enum JourneyEventType {
  Consultation = "CONSULTATION",

  PrescriptionUploaded = "PRESCRIPTION_UPLOADED",

  MedicationStarted = "MEDICATION_STARTED",

  MedicationStopped = "MEDICATION_STOPPED",

  MedicationChanged = "MEDICATION_CHANGED",

  DiagnosisAdded = "DIAGNOSIS_ADDED",

  DiagnosisUpdated = "DIAGNOSIS_UPDATED",

  DiagnosisRemoved = "DIAGNOSIS_REMOVED",

  AssessmentCompleted = "ASSESSMENT_COMPLETED",

  DailyHealthRecorded = "DAILY_HEALTH_RECORDED",

  LaboratoryResult = "LAB_RESULT",

  ProcedurePerformed = "PROCEDURE",

  HospitalAdmission = "HOSPITAL_ADMISSION",

  HospitalDischarge = "HOSPITAL_DISCHARGE",

  ClinicalAlert = "CLINICAL_ALERT",

  RecommendationGenerated = "RECOMMENDATION"
}

export enum ConsultationMode {
  Physical = "PHYSICAL",

  Video = "VIDEO",

  Telephone = "TELEPHONE",

  WhatsApp = "WHATSAPP",

  Email = "EMAIL",

  HomeVisit = "HOME_VISIT",

  Emergency = "EMERGENCY",

  Unknown = "UNKNOWN"
}

export enum ConsultationType {
  Initial = "INITIAL",

  FollowUp = "FOLLOW_UP",

  Review = "REVIEW",

  Emergency = "EMERGENCY",

  SecondOpinion = "SECOND_OPINION",

  Procedure = "PROCEDURE",

  Admission = "ADMISSION",

  Discharge = "DISCHARGE"
}

export enum MedicationAction {
  New = "NEW",

  Continue = "CONTINUE",

  Stop = "STOP",

  Restart = "RESTART",

  Replace = "REPLACE",

  IncreaseDose = "INCREASE_DOSE",

  ReduceDose = "REDUCE_DOSE",

  Unknown = "UNKNOWN"
}

export enum MedicationFrequency {
  OnceDaily = "OD",

  TwiceDaily = "BD",

  ThreeTimesDaily = "TDS",

  FourTimesDaily = "QDS",

  Weekly = "WEEKLY",

  Monthly = "MONTHLY",

  AsNeeded = "SOS",

  Custom = "CUSTOM"
}

export enum MedicationTiming {
  BeforeFood = "BEFORE_FOOD",

  AfterFood = "AFTER_FOOD",

  WithFood = "WITH_FOOD",

  Morning = "MORNING",

  Afternoon = "AFTERNOON",

  Evening = "EVENING",

  Night = "NIGHT",

  Bedtime = "BEDTIME",

  Custom = "CUSTOM"
}

export enum JourneyStatus {
  Draft = "DRAFT",

  Active = "ACTIVE",

  Completed = "COMPLETED",

  Archived = "ARCHIVED"
}

export enum ClinicalSeverity {
  None = "NONE",

  Mild = "MILD",

  Moderate = "MODERATE",

  Severe = "SEVERE",

  Critical = "CRITICAL"
}

export enum ConfidenceLevel {
  Low = "LOW",

  Medium = "MEDIUM",

  High = "HIGH",

  Confirmed = "CONFIRMED"
}

export enum SourceType {
  Prescription = "PRESCRIPTION",

  Consultation = "CONSULTATION",

  PatientInput = "PATIENT_INPUT",

  Voice = "VOICE",

  OCR = "OCR",

  Assessment = "ASSESSMENT",

  DailyCare = "DAILY_CARE",

  Laboratory = "LABORATORY",

  Manual = "MANUAL",

  AI = "AI"
}

export enum TimelineDirection {
  Past = "PAST",

  Present = "PRESENT",

  Future = "FUTURE"
}

export enum ComparisonOutcome {
  Identical = "IDENTICAL",

  Similar = "SIMILAR",

  Modified = "MODIFIED",

  Added = "ADDED",

  Removed = "REMOVED",

  Conflict = "CONFLICT"
}

export enum TreatmentStatus {
  Active = "ACTIVE",

  Completed = "COMPLETED",

  Suspended = "SUSPENDED",

  Discontinued = "DISCONTINUED",

  Planned = "PLANNED"
}

export enum JourneyQuestionType {
  Clarification = "CLARIFICATION",

  MissingInformation = "MISSING_INFORMATION",

  MedicationVerification = "MEDICATION_VERIFICATION",

  SymptomFollowUp = "SYMPTOM_FOLLOW_UP",

  TimelineVerification = "TIMELINE_VERIFICATION",

  ClinicalConfirmation = "CLINICAL_CONFIRMATION"
}

export enum GovernanceDecision {
  Accepted = "ACCEPTED",

  RequiresReview = "REQUIRES_REVIEW",

  Rejected = "REJECTED"
}