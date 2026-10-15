/**
 * ============================================================
 * CAREVR - Canonical Treatment Domain
 * ============================================================
 * Represents a patient's treatment plan and progress.
 * Shared by:
 * - Journey
 * - Treatment
 * - Medication Management
 * ============================================================
 */

import type { Medicine } from "./medicationTypes";

export enum TreatmentStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  DISCONTINUED = "DISCONTINUED",
  FAILED = "FAILED",
  UNKNOWN = "UNKNOWN",
}

export enum TreatmentResponse {
  IMPROVING = "IMPROVING",
  STABLE = "STABLE",
  WORSENING = "WORSENING",
  COMPLETED = "COMPLETED",
  UNKNOWN = "UNKNOWN",
}

export enum TreatmentChangeType {
  STARTED = "STARTED",
  STOPPED = "STOPPED",
  MODIFIED = "MODIFIED",
  DOSAGE_CHANGED = "DOSAGE_CHANGED",
  FREQUENCY_CHANGED = "FREQUENCY_CHANGED",
  REPLACED = "REPLACED",
  CONTINUED = "CONTINUED",
}

export interface TreatmentPlan {

  treatmentId: string;

  patientId: string;

  consultationId: string;

  title?: string;

  diagnosis?: string;

  medicines: Medicine[];

  status: TreatmentStatus;

  response?: TreatmentResponse;

  startDate: string;

  expectedEndDate?: string;

  actualEndDate?: string;

  treatingDoctor?: string;

  hospital?: string;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}

export interface TreatmentChange {

  id: string;

  treatmentId: string;

  medicineName?: string;

  changeType: TreatmentChangeType;

  previousValue?: string;

  currentValue?: string;

  reason?: string;

  effectiveDate: string;

  remarks?: string;
}

export interface ActiveTreatment {

  patientId: string;

  activePlans: TreatmentPlan[];

  activeMedicines: Medicine[];

  totalActiveMedicines: number;

  lastUpdated: string;
}