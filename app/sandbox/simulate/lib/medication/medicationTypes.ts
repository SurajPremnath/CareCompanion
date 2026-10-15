/**
 * ============================================================
 * CAREVR - Canonical Medication Domain
 * ============================================================
 * Shared medication models used across:
 * - Prescription
 * - Journey
 * - Treatment
 * - Timeline
 * - AI Extraction
 * ============================================================
 */

export enum MedicationStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  STOPPED = "STOPPED",
  PAUSED = "PAUSED",
  UNKNOWN = "UNKNOWN",
}

export enum MedicationTiming {
  BEFORE_BREAKFAST = "BEFORE_BREAKFAST",
  AFTER_BREAKFAST = "AFTER_BREAKFAST",

  BEFORE_LUNCH = "BEFORE_LUNCH",
  AFTER_LUNCH = "AFTER_LUNCH",

  BEFORE_DINNER = "BEFORE_DINNER",
  AFTER_DINNER = "AFTER_DINNER",

  BEDTIME = "BEDTIME",

  EMPTY_STOMACH = "EMPTY_STOMACH",

  AS_NEEDED = "AS_NEEDED",

  OTHER = "OTHER",
}

export enum MedicationFrequency {
  ONCE_DAILY = "ONCE_DAILY",
  TWICE_DAILY = "TWICE_DAILY",
  THREE_TIMES_DAILY = "THREE_TIMES_DAILY",
  FOUR_TIMES_DAILY = "FOUR_TIMES_DAILY",

  EVERY_ALTERNATE_DAY = "EVERY_ALTERNATE_DAY",

  WEEKLY = "WEEKLY",

  MONTHLY = "MONTHLY",

  AS_REQUIRED = "AS_REQUIRED",

  CUSTOM = "CUSTOM",
}

export interface MedicationDose {
  value: number;

  unit: string;
}

export interface MedicationDuration {
  value: number;

  unit:
    | "DAY"
    | "DAYS"
    | "WEEK"
    | "WEEKS"
    | "MONTH"
    | "MONTHS"
    | "CONTINUOUS"
    | "UNKNOWN";
}

export interface MedicationInstruction {
  timing: MedicationTiming;

  frequency: MedicationFrequency;

  notes?: string;
}

export interface Medicine {

  id?: string;

  prescriptionMedicineId?: string;

  genericName?: string;

  brandName: string;

/**
 * ------------------------------------------------------------
 * Legacy compatibility
 * ------------------------------------------------------------
 */

name?: string;

  strength?: string;

  formulation?: string;

  dose?: MedicationDose;

  instruction: MedicationInstruction;

frequency?: string;

timing?: string;

  duration?: MedicationDuration;

durationText?: string;

  quantity?: number;

  refillCount?: number;

  indication?: string;

  status: MedicationStatus;

  startDate?: string;

  endDate?: string;

  isHighRisk?: boolean;

  isControlledDrug?: boolean;

  remarks?: string;
}

export interface PrescriptionMedicine {

  medicine: Medicine;

  sequence: number;

  extractedText?: string;

  confidence?: number;
}

export interface MedicationSummary {

  totalMedicines: number;

  activeMedicines: number;

  stoppedMedicines: number;

  completedMedicines: number;

  highRiskMedicines: number;
}