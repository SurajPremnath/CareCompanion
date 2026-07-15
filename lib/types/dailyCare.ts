// ==========================================================
// CareCompanion
// Daily Care Domain Types
// ==========================================================

export type DailyCareOverallStatus =
  | "NO_CONCERNS_REPORTED"
  | "CONCERNS_REPORTED";

export interface DailyCare {

  id: string;

  userId: string;

  patientId: string;

  /**
   * ISO timestamp when the observation was recorded.
   */
  recordedAt: string;

overallStatus:
  DailyCareOverallStatus | null;
  /**
   * Body temperature in Celsius.
   */
  temperature: number | null;

  temperatureUnit: "F" | "C";

/**
 * Weight in kilograms.
 */
weightKg: number | null;

  /**
   * Blood pressure (optional)
   */
  systolic: number | null;

  diastolic: number | null;

  /**
   * Pulse rate (beats per minute)
   */
  pulse: number | null;

  /**
   * Oxygen saturation (%)
   */
  spo2: number | null;

  /**
   * Selected symptoms.
   */
  symptoms: DailyCareSymptom[];

  /**
   * Selected pain locations.
   */
painLocations: PainLocation[];

otherSymptom?: string | null;

otherPainLocation?: string | null;

/**
 * Medicines administered.
 */
medications?: unknown[];

  notes?: string | null;

  createdAt: string;

  updatedAt: string;

}

export type DailyCareSymptom =
    | "FEVER"
    | "WEAKNESS"
    | "BODY_PAIN"
    | "COUGH"
    | "BLOOD_IN_COUGH"
    | "BREATHLESSNESS"
    | "WALKING_DIFFICULTY"
    | "LOSS_OF_APPETITE"
    | "LOOSE_MOTIONS"
    | "VOMITING"
    | "DRY_MOUTH"
    | "OTHER";

export type PainLocation =
    | "HEAD"
    | "NECK"
    | "CHEST"
    | "ABDOMEN"
    | "BACK"
    | "SHOULDER"
    | "ARM"
    | "THIGH"
    | "KNEE"
    | "CALF"
    | "FEET"
    | "OTHER";

export interface MedicationEntry {

  medicine: string;

  dose: string;

  remarks: string;

}

export interface CreateDailyCareRequest {

  patientId: string;

  recordedAt: string;

overallStatus:
  DailyCareOverallStatus | null;

  temperature: number | null;

  temperatureUnit: "F" | "C";

weightKg: number | null;

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms: DailyCareSymptom[];

otherSymptom?: string | null;

  painLocations: PainLocation[];

otherPainLocation?: string | null;

}