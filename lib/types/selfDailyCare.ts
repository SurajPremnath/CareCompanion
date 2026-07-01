// ==========================================================
// CareVR
// Self Daily Care Domain Types
// ==========================================================

export interface SelfDailyCare {

  id: string;

  userId: string;

  /**
   * ISO timestamp when the observation was recorded.
   */
  recordedAt: string;

  /**
   * Body temperature.
   */
  temperature: number | null;

  temperatureUnit: "F" | "C";

  /**
   * Blood Pressure
   */
  systolic: number | null;

  diastolic: number | null;

  /**
   * Pulse
   */
  pulse: number | null;

  /**
   * Oxygen Saturation
   */
  spo2: number | null;

  /**
   * Symptoms
   */
  symptoms: SelfDailyCareSymptom[];

  otherSymptom?: string | null;

  /**
   * Pain Locations
   */
  painLocations: SelfPainLocation[];

  otherPainLocation?: string | null;

  /**
   * Medicines
   */
  medications?: unknown[];

  /**
   * Notes
   */
  notes?: string | null;

  createdAt: string;

  updatedAt: string;

}

export type SelfDailyCareSymptom =
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

export type SelfPainLocation =
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

export interface SelfMedicationEntry {

  medicine: string;

  dose: string;

  remarks: string;

}

export interface CreateSelfDailyCareRequest {

  recordedAt: string;

  temperature: number | null;

  temperatureUnit: "F" | "C";

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms: SelfDailyCareSymptom[];

  otherSymptom?: string | null;

  painLocations: SelfPainLocation[];

  otherPainLocation?: string | null;

  medications?: SelfMedicationEntry[];

  notes?: string | null;

}