// lib/journey/journeyTypes.ts

/**
 * ============================================================
 * CAREVR Journey Intelligence
 * ------------------------------------------------------------
 * Foundation enums used across the Journey Engine.
 *
 * Principles
 * ----------
 * • Generic (not healthcare specific)
 * • Reusable
 * • Extensible
 * • Strongly typed
 * • No business rules
 * ============================================================
 */

/* ============================================================
 * Overall Journey Classification
 * ============================================================ */

export enum JourneyStatus {
  NOT_STARTED = "NOT_STARTED",

  PENDING = "PENDING",

  IN_PROGRESS = "IN_PROGRESS",

  IN_REVIEW = "IN_REVIEW",

  COMPLETED = "COMPLETED",

  REVIEW_REQUIRED = "REVIEW_REQUIRED",

  FAILED = "FAILED",

  CANCELLED = "CANCELLED",
}

export enum JourneyType {
    SINGLE_PROVIDER = "SINGLE_PROVIDER",
    MULTI_PROVIDER = "MULTI_PROVIDER",
    REFERRAL = "REFERRAL",
    SECOND_OPINION = "SECOND_OPINION",
    HOSPITAL_TRANSFER = "HOSPITAL_TRANSFER",
    EMERGENCY_INTERRUPTION = "EMERGENCY_INTERRUPTION",
    TELE_TO_PHYSICAL = "TELE_TO_PHYSICAL",
    HOME_CARE = "HOME_CARE",
    CHRONIC_CARE = "CHRONIC_CARE",
    SURGICAL_CARE = "SURGICAL_CARE",
    UNKNOWN = "UNKNOWN"
}

export enum JourneyActionType {
  SAVE = "SAVE",

  EXPORT = "EXPORT",

  SHARE = "SHARE",

  GENERATE_REPORT = "GENERATE_REPORT",
}

export enum JourneyChangeType {
  DOCTOR_CHANGED = "DOCTOR_CHANGED",

  HOSPITAL_CHANGED = "HOSPITAL_CHANGED",

  MEDICINE_ADDED = "MEDICINE_ADDED",

  MEDICINE_REMOVED = "MEDICINE_REMOVED",

  MEDICINE_DOSE_CHANGED = "MEDICINE_DOSE_CHANGED",

  MEDICINE_DURATION_CHANGED = "MEDICINE_DURATION_CHANGED",

  MEDICINE_FREQUENCY_CHANGED = "MEDICINE_FREQUENCY_CHANGED",

  INVESTIGATION_ADDED = "INVESTIGATION_ADDED",

  DIAGNOSIS_CHANGED = "DIAGNOSIS_CHANGED",

  PROCEDURE_ADDED = "PROCEDURE_ADDED",

  PROCEDURE_REMOVED = "PROCEDURE_REMOVED",

  OTHER = "OTHER",
}

export enum TreatmentStatus {
  ACTIVE = "ACTIVE",

  COMPLETED = "COMPLETED",

  PAUSED = "PAUSED",

  STOPPED = "STOPPED",
}

export enum TreatmentDecisionStatus {
  UNCHANGED = "UNCHANGED",

  UPDATED = "UPDATED",
  
  NEW = "NEW",

  DISCONTINUED = "DISCONTINUED",
}


export enum MedicineStatus {
  NEW = "NEW",

  CONTINUED = "CONTINUED",

  MODIFIED = "MODIFIED",

  STOPPED = "STOPPED",
}

export enum RecommendationPriority {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",
}

export enum SeverityLevel {
  LOW = "LOW",

  MEDIUM = "MEDIUM",

  HIGH = "HIGH",
}

export enum TimelineEventType {
  CONSULTATION = "CONSULTATION",

  MEDICATION = "MEDICATION",

  PROCEDURE = "PROCEDURE",

  INVESTIGATION = "INVESTIGATION",

  FOLLOW_UP = "FOLLOW_UP",

  NOTE = "NOTE",

  OTHER = "OTHER",
}

export enum QuestionType {
  TEXT = "TEXT",

  TEXTAREA = "TEXTAREA",

  NUMBER = "NUMBER",

  DATE = "DATE",

  BOOLEAN = "BOOLEAN",

  SINGLE_SELECT = "SINGLE_SELECT",

  MULTI_SELECT = "MULTI_SELECT",
}


/* ============================================================
 * Journey Nodes
 * ============================================================ */

export enum JourneyNodeType {
    PATIENT = "PATIENT",

    DOCTOR = "DOCTOR",
    SPECIALIST = "SPECIALIST",

    CLINIC = "CLINIC",
    HOSPITAL = "HOSPITAL",

    LABORATORY = "LABORATORY",
    PHARMACY = "PHARMACY",

    HOME = "HOME",

    VIDEO = "VIDEO",
    TELEPHONE = "TELEPHONE",

    EMERGENCY = "EMERGENCY",

    SURGERY = "SURGERY",

    FOLLOW_UP = "FOLLOW_UP",

    OTHER = "OTHER"
}

/* ============================================================
 * Journey Events
 * ============================================================ */

export enum JourneyEventType {
    CONSULTATION = "CONSULTATION",

    REFERRAL = "REFERRAL",

    ADMISSION = "ADMISSION",

    DISCHARGE = "DISCHARGE",

    INVESTIGATION = "INVESTIGATION",

    PROCEDURE = "PROCEDURE",

    FOLLOW_UP = "FOLLOW_UP",

    THERAPY = "THERAPY",

    HOME_VISIT = "HOME_VISIT",

    NOTE = "NOTE",

    OTHER = "OTHER"
}

/* ============================================================
 * Journey Transition
 * ============================================================ */

export enum JourneyTransitionType {
    START = "START",

    CONTINUE = "CONTINUE",

    REFER = "REFER",

    TRANSFER = "TRANSFER",

    RETURN = "RETURN",

    ESCALATE = "ESCALATE",

    DEESCALATE = "DEESCALATE",

    COMPLETE = "COMPLETE",

    INTERRUPT = "INTERRUPT",

    UNKNOWN = "UNKNOWN"
}

/* ============================================================
 * Learning Status
 * ============================================================ */

export enum JourneyLearningStatus {
    NEW = "NEW",

    LEARNING = "LEARNING",

    VERIFIED = "VERIFIED",

    STANDARD = "STANDARD",

    DEPRECATED = "DEPRECATED"
}

/* ============================================================
 * Pattern Confidence
 * ============================================================ */

export enum JourneyConfidence {
    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERIFIED = "VERIFIED"
}

/* ============================================================
 * Provider Type
 * ============================================================ */

export enum ProviderType {
    FAMILY_DOCTOR = "FAMILY_DOCTOR",

    GENERAL_PHYSICIAN = "GENERAL_PHYSICIAN",

    SPECIALIST = "SPECIALIST",

    SUPER_SPECIALIST = "SUPER_SPECIALIST",

    HOSPITAL = "HOSPITAL",

    CLINIC = "CLINIC",

    LABORATORY = "LABORATORY",

    PHARMACY = "PHARMACY",

    HOMECARE = "HOMECARE",

    OTHER = "OTHER"
}

/* ============================================================
 * Consultation Mode
 * ============================================================ */

export enum ConsultationMode {
    IN_PERSON = "IN_PERSON",

    VIDEO = "VIDEO",

    TELEPHONE = "TELEPHONE",

    HOME_VISIT = "HOME_VISIT",

    WHATSAPP = "WHATSAPP",

    EMAIL = "EMAIL",

    OTHER = "OTHER"
}

export enum ConsultationType {
  IN_PERSON = "IN_PERSON",
  VIDEO = "VIDEO",
  TELEPHONE = "TELEPHONE",
  HOME_VISIT = "HOME_VISIT",
  EMERGENCY = "EMERGENCY",
  FOLLOW_UP = "FOLLOW_UP",
  OTHER = "OTHER",
}

/* ============================================================
 * Consultation Source
 * ============================================================ */

export enum ConsultationSource {
    PRESCRIPTION_UPLOAD = "PRESCRIPTION_UPLOAD",

    DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",

    LAB_REPORT = "LAB_REPORT",

    IMAGE = "IMAGE",

    PDF = "PDF",

    VOICE = "VOICE",

    VIDEO = "VIDEO",

    EMAIL = "EMAIL",

    WHATSAPP = "WHATSAPP",

    MANUAL_ENTRY = "MANUAL_ENTRY",

    API = "API",

    OTHER = "OTHER"
}