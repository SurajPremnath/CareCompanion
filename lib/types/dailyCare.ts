export type MedicationStatus =
  | "YES"
  | "PARTIAL"
  | "NO";

export type Feeling =
  | "BETTER"
  | "SAME"
  | "WORSE";

export interface DailyCare {

  id: string;

  userId: string;

  patientId: string;

  careDate: string;

  hasFever: boolean;

  temperature: number | null;

  isOnMedication: boolean;

  medicationTaken: MedicationStatus | null;

  feeling: Feeling | null;

  requiresAttention: boolean;

  notes: string | null;

  recordedAt: string;

  createdAt: string;

  updatedAt: string;
}