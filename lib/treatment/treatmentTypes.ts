/* ============================================================================
 * CareVR
 * Treatment Domain
 * ----------------------------------------------------------------------------
 * File        : treatmentTypes.ts
 * Description : Core types, enums and utility definitions for the Treatment
 *               bounded context.
 * ----------------------------------------------------------------------------
 * Architecture:
 * UI
 *  ↓
 * Storage
 *  ↓
 * Repository
 *  ↓
 * Mapper
 *  ↓
 * Database
 *
 * This file MUST remain dependency free.
 * ========================================================================== */

export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type ValueOf<T> = T[keyof T];

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

export type JsonPrimitive =
  | string
  | number
  | boolean
  | null;

export type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

/* ============================================================================
 * Audit
 * ========================================================================== */

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
  VIEW = 'VIEW',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  RECONCILE = 'RECONCILE',
  CONFIRM = 'CONFIRM',
  REJECT = 'REJECT'
}

export enum AuditActorType {
  USER = 'USER',
  CAREGIVER = 'CAREGIVER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface AuditMetadata {
  readonly createdAt: ISODateTime;
  readonly createdBy: UUID;

  readonly updatedAt?: ISODateTime;
  readonly updatedBy?: UUID;

  readonly archivedAt?: ISODateTime;
  readonly archivedBy?: UUID;

  readonly version: number;

  readonly actor: AuditActorType;

  readonly correlationId?: UUID;

  readonly source?: string;
}

/* ============================================================================
 * Consultation
 * ========================================================================== */

export enum ConsultationMode {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
  PHONE = 'PHONE',
  HOME_VISIT = 'HOME_VISIT',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  PRESCRIPTION_UPLOAD = 'PRESCRIPTION_UPLOAD',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  LAB_REPORT = 'LAB_REPORT',
  MANUAL = 'MANUAL',
  OTHER = 'OTHER'
}

export enum ConsultationSource {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  OCR = 'OCR',
  AI = 'AI',
  IMPORT = 'IMPORT',
  MANUAL = 'MANUAL'
}

/* ============================================================================
 * Treatment Lifecycle
 * ========================================================================== */

export enum TreatmentStatus {
  DRAFT = 'DRAFT',

  PENDING_REVIEW = 'PENDING_REVIEW',

  ACTIVE = 'ACTIVE',

  /**
   * Temporarily stopped by clinician.
   * Can be restarted later.
   */
  DISCONTINUED = 'DISCONTINUED',

  /**
   * Treatment course finished successfully.
   */
  COMPLETED = 'COMPLETED',

  /**
   * Historical version retained for audit.
   */
  ARCHIVED = 'ARCHIVED',

  /**
   * Explicitly cancelled before completion.
   */
  CANCELLED = 'CANCELLED',

  /**
   * Replaced by a newer treatment version.
   */
  SUPERSEDED = 'SUPERSEDED'
}

export enum TreatmentOutcome {
  CONTINUE = 'CONTINUE',
  MODIFY = 'MODIFY',
  STOP = 'STOP',
  RESTART = 'RESTART',
  UNKNOWN = 'UNKNOWN'
}

export enum TreatmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TreatmentSource {
  PRESCRIPTION = 'PRESCRIPTION',
  CONSULTATION = 'CONSULTATION',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  FOLLOW_UP = 'FOLLOW_UP',
  LAB_REVIEW = 'LAB_REVIEW',
  EMERGENCY = 'EMERGENCY',
  MANUAL = 'MANUAL'
}

export enum TreatmentChangeType {
  NEW = 'NEW',
  UPDATED = 'UPDATED',
  UNCHANGED = 'UNCHANGED',
  ARCHIVED = 'ARCHIVED',
  RESTORED = 'RESTORED',
  REMOVED = 'REMOVED'
}

/* ============================================================================
 * Diagnosis
 * ========================================================================== */

export enum DiagnosisStatus {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  PROVISIONAL = 'PROVISIONAL',
  DIFFERENTIAL = 'DIFFERENTIAL',
  RULE_OUT = 'RULE_OUT'
}

/* ============================================================================
 * Follow-up
 * ========================================================================== */

export enum FollowUpStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  ADVISED = 'ADVISED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED'
}

/* ============================================================================
 * Investigation
 * ========================================================================== */

export enum InvestigationStatus {
  ADVISED = 'ADVISED',
  ORDERED = 'ORDERED',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  CANCELLED = 'CANCELLED'
}

/* ============================================================================
 * AI Confidence
 * ========================================================================== */

export enum ConfidenceLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export interface ConfidenceScore {
  readonly score: number;
  readonly level: ConfidenceLevel;
  readonly rationale?: string;
}

/* ============================================================================
 * Medicine
 * ========================================================================== */

export enum MedicineStatus {
  /**
   * Currently being taken.
   */
  ACTIVE = 'ACTIVE',

  /**
   * Temporarily paused.
   *
   * Example:
   * Stop Metformin for 3 days before surgery.
   */
  PAUSED = 'PAUSED',

  /**
   * Doctor has discontinued the medicine.
   * May be restarted in a future consultation.
   *
   * Example:
   * Stop Amlodipine until next review.
   */
  DISCONTINUED = 'DISCONTINUED',

  /**
   * Permanently stopped.
   *
   * Should never become ACTIVE again
   * within the same treatment version.
   */
  STOPPED = 'STOPPED',

  /**
   * Prescribed course completed.
   *
   * Example:
   * Antibiotic for 5 days.
   */
  COMPLETED = 'COMPLETED',

  /**
   * Take only when required.
   */
  PRN = 'PRN',

  /**
   * Imported or historical medicine
   * that is no longer clinically active.
   */
  INACTIVE = 'INACTIVE',

  /**
   * AI could not determine status.
   */
  UNKNOWN = 'UNKNOWN'
}

export enum MedicineType {
  PRESCRIPTION = 'PRESCRIPTION',
  OTC = 'OTC',
  SUPPLEMENT = 'SUPPLEMENT',
  VACCINE = 'VACCINE',
  HERBAL = 'HERBAL',
  AYURVEDIC = 'AYURVEDIC',
  HOMEOPATHIC = 'HOMEOPATHIC',
  OTHER = 'OTHER'
}

export enum MedicineForm {
  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  SYRUP = 'SYRUP',
  SUSPENSION = 'SUSPENSION',
  DROPS = 'DROPS',
  INJECTION = 'INJECTION',
  INFUSION = 'INFUSION',
  INHALER = 'INHALER',
  NEBULIZER = 'NEBULIZER',
  CREAM = 'CREAM',
  OINTMENT = 'OINTMENT',
  GEL = 'GEL',
  LOTION = 'LOTION',
  PATCH = 'PATCH',
  SPRAY = 'SPRAY',
  POWDER = 'POWDER',
  SACHET = 'SACHET',
  SOLUTION = 'SOLUTION',
  LOZENGE = 'LOZENGE',
  SUPPOSITORY = 'SUPPOSITORY',
  EYE_DROP = 'EYE_DROP',
  EAR_DROP = 'EAR_DROP',
  NASAL_DROP = 'NASAL_DROP',
  NASAL_SPRAY = 'NASAL_SPRAY',
  MOUTHWASH = 'MOUTHWASH',
  GARGLE = 'GARGLE',
  IMPLANT = 'IMPLANT',
  OTHER = 'OTHER'
}

export enum MedicineRoute {
  ORAL = 'ORAL',
  SUBLINGUAL = 'SUBLINGUAL',
  BUCCAL = 'BUCCAL',
  TOPICAL = 'TOPICAL',
  TRANSDERMAL = 'TRANSDERMAL',
  INHALATION = 'INHALATION',
  NASAL = 'NASAL',
  OPHTHALMIC = 'OPHTHALMIC',
  OTIC = 'OTIC',
  RECTAL = 'RECTAL',
  VAGINAL = 'VAGINAL',
  INTRAVENOUS = 'INTRAVENOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  INTRADERMAL = 'INTRADERMAL',
  NEBULIZATION = 'NEBULIZATION',
  OTHER = 'OTHER'
}

/* ============================================================================
 * Dosage
 * ========================================================================== */

export enum DosageUnit {
  MG = 'MG',
  MCG = 'MCG',
  G = 'G',
  KG = 'KG',

  ML = 'ML',
  L = 'L',

  IU = 'IU',
  MEQ = 'MEQ',
  MMOL = 'MMOL',

  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  PUFF = 'PUFF',
  DROP = 'DROP',
  SPRAY = 'SPRAY',
  PATCH = 'PATCH',
  SACHET = 'SACHET',
  TEASPOON = 'TEASPOON',
  TABLESPOON = 'TABLESPOON',
  UNIT = 'UNIT',

  OTHER = 'OTHER'
}

/* ============================================================================
 * Frequency
 * ========================================================================== */

export enum MedicineFrequency {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',

  EVERY_4_HOURS = 'EVERY_4_HOURS',
  EVERY_6_HOURS = 'EVERY_6_HOURS',
  EVERY_8_HOURS = 'EVERY_8_HOURS',
  EVERY_12_HOURS = 'EVERY_12_HOURS',
  EVERY_24_HOURS = 'EVERY_24_HOURS',

  WEEKLY = 'WEEKLY',
  FORTNIGHTLY = 'FORTNIGHTLY',
  MONTHLY = 'MONTHLY',

  ALTERNATE_DAYS = 'ALTERNATE_DAYS',

  AS_NEEDED = 'AS_NEEDED',

  CUSTOM = 'CUSTOM',

  UNKNOWN = 'UNKNOWN'
}

/* ============================================================================
 * Timing
 * ========================================================================== */

export enum MedicineTiming {
  EARLY_MORNING = 'EARLY_MORNING',
  MORNING = 'MORNING',
  BEFORE_BREAKFAST = 'BEFORE_BREAKFAST',
  AFTER_BREAKFAST = 'AFTER_BREAKFAST',

  BEFORE_LUNCH = 'BEFORE_LUNCH',
  AFTER_LUNCH = 'AFTER_LUNCH',

  EVENING = 'EVENING',

  BEFORE_DINNER = 'BEFORE_DINNER',
  AFTER_DINNER = 'AFTER_DINNER',

  BEDTIME = 'BEDTIME',

  BEFORE_MEALS = 'BEFORE_MEALS',
  AFTER_MEALS = 'AFTER_MEALS',
  WITH_MEALS = 'WITH_MEALS',

  EMPTY_STOMACH = 'EMPTY_STOMACH',

  ANYTIME = 'ANYTIME',

  CUSTOM = 'CUSTOM'
}

/* ============================================================================
 * PRN
 * ========================================================================== */

export enum PrnReason {
  PAIN = 'PAIN',
  FEVER = 'FEVER',
  NAUSEA = 'NAUSEA',
  VOMITING = 'VOMITING',
  BREATHLESSNESS = 'BREATHLESSNESS',
  COUGH = 'COUGH',
  ALLERGY = 'ALLERGY',
  ANXIETY = 'ANXIETY',
  INSOMNIA = 'INSOMNIA',
  CONSTIPATION = 'CONSTIPATION',
  DIARRHEA = 'DIARRHEA',
  OTHER = 'OTHER'
}

/* ============================================================================
 * Schedule
 * ========================================================================== */

export enum ScheduleType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  TAPERING = 'TAPERING',
  CYCLIC = 'CYCLIC',
  PRN = 'PRN',
  CUSTOM = 'CUSTOM'
}

/* ============================================================================
 * Instruction Types
 * ========================================================================== */

export enum MedicineInstructionType {
  BEFORE_FOOD = 'BEFORE_FOOD',
  AFTER_FOOD = 'AFTER_FOOD',
  WITH_FOOD = 'WITH_FOOD',
  EMPTY_STOMACH = 'EMPTY_STOMACH',

  SWALLOW_WHOLE = 'SWALLOW_WHOLE',
  CHEW = 'CHEW',
  DISSOLVE = 'DISSOLVE',

  SHAKE_WELL = 'SHAKE_WELL',
  REFRIGERATE = 'REFRIGERATE',
  DO_NOT_CRUSH = 'DO_NOT_CRUSH',
  DO_NOT_SKIP = 'DO_NOT_SKIP',

  COMPLETE_COURSE = 'COMPLETE_COURSE',

  AVOID_ALCOHOL = 'AVOID_ALCOHOL',
  AVOID_DRIVING = 'AVOID_DRIVING',

  TAKE_WITH_WATER = 'TAKE_WITH_WATER',
  TAKE_WITH_MILK = 'TAKE_WITH_MILK',

  MONITOR_BP = 'MONITOR_BP',
  MONITOR_SUGAR = 'MONITOR_SUGAR',

  OTHER = 'OTHER'
}

/* ============================================================================
 * Timeline
 * ========================================================================== */

export enum TimelineEventType {
  CONSULTATION_CREATED = 'CONSULTATION_CREATED',

  TREATMENT_CREATED = 'TREATMENT_CREATED',
  TREATMENT_UPDATED = 'TREATMENT_UPDATED',
  TREATMENT_ARCHIVED = 'TREATMENT_ARCHIVED',
  TREATMENT_RESTORED = 'TREATMENT_RESTORED',
  TREATMENT_COMPLETED = 'TREATMENT_COMPLETED',

  MEDICINE_STARTED = 'MEDICINE_STARTED',
  MEDICINE_STOPPED = 'MEDICINE_STOPPED',
  MEDICINE_PAUSED = 'MEDICINE_PAUSED',
  MEDICINE_RESUMED = 'MEDICINE_RESUMED',

  MEDICINE_ADDED = 'MEDICINE_ADDED',
  MEDICINE_REMOVED = 'MEDICINE_REMOVED',

  DOSE_CHANGED = 'DOSE_CHANGED',
  STRENGTH_CHANGED = 'STRENGTH_CHANGED',
  FREQUENCY_CHANGED = 'FREQUENCY_CHANGED',
  TIMING_CHANGED = 'TIMING_CHANGED',
  DURATION_CHANGED = 'DURATION_CHANGED',
  ROUTE_CHANGED = 'ROUTE_CHANGED',
  INSTRUCTION_CHANGED = 'INSTRUCTION_CHANGED',

  DIAGNOSIS_UPDATED = 'DIAGNOSIS_UPDATED',
  DOCTOR_CHANGED = 'DOCTOR_CHANGED',
  HOSPITAL_CHANGED = 'HOSPITAL_CHANGED',

  INVESTIGATION_ADDED = 'INVESTIGATION_ADDED',
  FOLLOW_UP_ADDED = 'FOLLOW_UP_ADDED',

  REMINDER_CREATED = 'REMINDER_CREATED',
  REMINDER_COMPLETED = 'REMINDER_COMPLETED',
  REMINDER_MISSED = 'REMINDER_MISSED'
}

/* ============================================================================
 * Medicine Reconciliation
 * ========================================================================== */

export enum ReconciliationStatus {
  IDENTICAL = 'IDENTICAL',
  NEW_MEDICINE = 'NEW_MEDICINE',
  REMOVED_MEDICINE = 'REMOVED_MEDICINE',
  DOSE_CHANGED = 'DOSE_CHANGED',
  STRENGTH_CHANGED = 'STRENGTH_CHANGED',
  FREQUENCY_CHANGED = 'FREQUENCY_CHANGED',
  TIMING_CHANGED = 'TIMING_CHANGED',
  DURATION_CHANGED = 'DURATION_CHANGED',
  ROUTE_CHANGED = 'ROUTE_CHANGED',
  INSTRUCTION_CHANGED = 'INSTRUCTION_CHANGED',
  POSSIBLE_DUPLICATE = 'POSSIBLE_DUPLICATE',
  BRAND_GENERIC_MATCH = 'BRAND_GENERIC_MATCH',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED'
}

export enum MedicineMatchType {
  EXACT = 'EXACT',
  BRAND_GENERIC = 'BRAND_GENERIC',
  GENERIC_BRAND = 'GENERIC_BRAND',
  FUZZY = 'FUZZY',
  SIMILAR = 'SIMILAR',
  NONE = 'NONE'
}

/* ============================================================================
 * AI Processing
 * ========================================================================== */

export enum ExtractionStatus {
  NOT_STARTED = 'NOT_STARTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW'
}

export enum ProcessingStage {
  OCR = 'OCR',
  EXTRACTION = 'EXTRACTION',
  NORMALIZATION = 'NORMALIZATION',
  RECONCILIATION = 'RECONCILIATION',
  QUESTION_GENERATION = 'QUESTION_GENERATION',
  USER_CONFIRMATION = 'USER_CONFIRMATION',
  TREATMENT_CREATION = 'TREATMENT_CREATION',
  TIMELINE_GENERATION = 'TIMELINE_GENERATION',
  PERSISTENCE = 'PERSISTENCE'
}

/* ============================================================================
 * Follow-up Question Engine
 * ========================================================================== */

export enum QuestionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum QuestionReason {
  MISSING_DURATION = 'MISSING_DURATION',
  MISSING_DOSE = 'MISSING_DOSE',
  MISSING_FREQUENCY = 'MISSING_FREQUENCY',
  MISSING_TIMING = 'MISSING_TIMING',
  MISSING_ROUTE = 'MISSING_ROUTE',
  POSSIBLE_DUPLICATE = 'POSSIBLE_DUPLICATE',
  MEDICINE_REMOVED = 'MEDICINE_REMOVED',
  MEDICINE_ADDED = 'MEDICINE_ADDED',
  DOSAGE_CHANGED = 'DOSAGE_CHANGED',
  LOW_AI_CONFIDENCE = 'LOW_AI_CONFIDENCE',
  CLINICAL_REVIEW = 'CLINICAL_REVIEW'
}

/* ============================================================================
 * Reminder Architecture
 * ========================================================================== */

export enum ReminderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  SKIPPED = 'SKIPPED',
  SNOOZED = 'SNOOZED',
  CANCELLED = 'CANCELLED'
}

export enum ReminderType {
  MEDICATION = 'MEDICATION',
  REFILL = 'REFILL',
  FOLLOW_UP = 'FOLLOW_UP',
  INVESTIGATION = 'INVESTIGATION',
  APPOINTMENT = 'APPOINTMENT'
}

/* ============================================================================
 * Adherence
 * ========================================================================== */

export enum AdherenceStatus {
  UNKNOWN = 'UNKNOWN',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NON_ADHERENT = 'NON_ADHERENT'
}

/* ============================================================================
 * Future Drug Interaction Architecture
 * ========================================================================== */

export enum InteractionSeverity {
  NONE = 'NONE',
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CONTRAINDICATED = 'CONTRAINDICATED'
}

/* ============================================================================
 * Processing Result
 * ========================================================================== */

export enum OperationResult {
  SUCCESS = 'SUCCESS',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  FAILED = 'FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  REQUIRES_USER_ACTION = 'REQUIRES_USER_ACTION'
}

/* ============================================================================
 * Performance Constants
 * ========================================================================== */

export const ACTIVE_TREATMENT_STATUSES = Object.freeze([
  TreatmentStatus.ACTIVE,
  TreatmentStatus.PENDING_REVIEW
] as const);

export const TERMINAL_TREATMENT_STATUSES = Object.freeze([
  TreatmentStatus.COMPLETED,
  TreatmentStatus.ARCHIVED,
  TreatmentStatus.CANCELLED,
  TreatmentStatus.SUPERSEDED
] as const);

export const ACTIVE_MEDICINE_STATUSES = Object.freeze([
  MedicineStatus.ACTIVE,
  MedicineStatus.PRN
] as const);

export const RECONCILIATION_CHANGE_TYPES = Object.freeze([
  ReconciliationStatus.NEW_MEDICINE,
  ReconciliationStatus.REMOVED_MEDICINE,
  ReconciliationStatus.DOSE_CHANGED,
  ReconciliationStatus.STRENGTH_CHANGED,
  ReconciliationStatus.FREQUENCY_CHANGED,
  ReconciliationStatus.TIMING_CHANGED,
  ReconciliationStatus.DURATION_CHANGED,
  ReconciliationStatus.ROUTE_CHANGED
] as const);

/* ============================================================================
 * Utility Literal Types
 * ========================================================================== */

export type ActiveTreatmentStatus =
  | TreatmentStatus.ACTIVE
  | TreatmentStatus.PENDING_REVIEW;

export type ActiveMedicineStatus =
  | MedicineStatus.ACTIVE
  | MedicineStatus.PRN;

export type TerminalTreatmentStatus =
  | TreatmentStatus.COMPLETED
  | TreatmentStatus.ARCHIVED
  | TreatmentStatus.CANCELLED
  | TreatmentStatus.SUPERSEDED;

/* ============================================================================
 * File Complete
 * ========================================================================== */