import type { Patient } from "@/lib/patient";
import type { DailyCare } from "@/lib/dailyCare";

import type {
  CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

import type {
  ResolvedConsultation,
} from "../consultation/consultationTypes";

/* ==========================================================
 * Journey Metadata
 * ========================================================== */

export interface JourneyMetadata {

  patientId: string;

  firstConsultationDate?: string;

  latestConsultationDate?: string;

  activeTreatment: boolean;

  totalConsultations: number;

  totalPrescriptions: number;

  totalDailyCareEntries: number;

  createdAt: string;

  updatedAt: string;
}

/* ==========================================================
 * Journey Statistics
 * ========================================================== */

export interface JourneyStatistics {

  activeMedicationCount: number;

  stoppedMedicationCount: number;

  diagnosisCount: number;

  consultationCount: number;

  prescriptionCount: number;

  timelineEventCount: number;
}

/* ==========================================================
 * Journey Aggregate
 * ========================================================== */

export interface JourneyModel {

  patient: Patient;

  consultations: ResolvedConsultation[];

  prescriptions: CompletePrescriptionRecord[];

  dailyCare: DailyCare[];

  assessments: unknown[];

  metadata: JourneyMetadata;

  statistics: JourneyStatistics;
}