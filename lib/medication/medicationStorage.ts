/**
 * ============================================================
 * CAREVR Medication Storage
 * ============================================================
 * Storage layer for the Medication domain.
 *
 * NOTE:
 * This file intentionally contains only the contract.
 * Actual persistence (Supabase/PostgreSQL/local storage)
 * will be implemented once the medication schema is finalized.
 *
 * UI -> Repository -> Storage -> Mapper -> Database
 * ============================================================
 */

import {
  ConsultationMetadata,
} from "./consultationTypes";

import {
  Medicine,
} from "./medicationTypes";

import {
  TreatmentPlan,
} from "./treatmentTypes";

export interface MedicationStorage {
  /**
   * ============================================================
   * Consultation
   * ============================================================
   */

  saveConsultation(
    consultation: ConsultationMetadata
  ): Promise<void>;

  getConsultation(
    consultationId: string
  ): Promise<ConsultationMetadata | null>;

  getPatientConsultations(
    patientId: string
  ): Promise<ConsultationMetadata[]>;

  deleteConsultation(
    consultationId: string
  ): Promise<void>;

  /**
   * ============================================================
   * Medicines
   * ============================================================
   */

  saveMedicines(
    consultationId: string,
    medicines: Medicine[]
  ): Promise<void>;

  getMedicines(
    consultationId: string
  ): Promise<Medicine[]>;

  getPatientMedicines(
    patientId: string
  ): Promise<Medicine[]>;

  /**
   * ============================================================
   * Treatment
   * ============================================================
   */

  saveTreatment(
    treatment: TreatmentPlan
  ): Promise<void>;

  getTreatment(
    treatmentId: string
  ): Promise<TreatmentPlan | null>;

  getPatientTreatments(
    patientId: string
  ): Promise<TreatmentPlan[]>;

  deleteTreatment(
    treatmentId: string
  ): Promise<void>;
}

/**
 * ============================================================
 * Placeholder implementation.
 * Replace with MedicationSupabaseStorage when the
 * medication database schema is implemented.
 * ============================================================
 */

class MedicationStoragePlaceholder
  implements MedicationStorage
{
  private notImplemented(): never {
    throw new Error(
      "MedicationStorage has not been implemented yet."
    );
  }

  async saveConsultation(): Promise<void> {
    this.notImplemented();
  }

  async getConsultation(): Promise<ConsultationMetadata | null> {
    this.notImplemented();
  }

  async getPatientConsultations(): Promise<
    ConsultationMetadata[]
  > {
    this.notImplemented();
  }

  async deleteConsultation(): Promise<void> {
    this.notImplemented();
  }

  async saveMedicines(): Promise<void> {
    this.notImplemented();
  }

  async getMedicines(): Promise<Medicine[]> {
    this.notImplemented();
  }

  async getPatientMedicines(): Promise<Medicine[]> {
    this.notImplemented();
  }

  async saveTreatment(): Promise<void> {
    this.notImplemented();
  }

  async getTreatment(): Promise<TreatmentPlan | null> {
    this.notImplemented();
  }

  async getPatientTreatments(): Promise<
    TreatmentPlan[]
  > {
    this.notImplemented();
  }

  async deleteTreatment(): Promise<void> {
    this.notImplemented();
  }
}

export const medicationStorage: MedicationStorage =
  new MedicationStoragePlaceholder();