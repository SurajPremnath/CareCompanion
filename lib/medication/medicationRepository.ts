/**
 * ============================================================
 * CAREVR Medication Repository
 * ============================================================
 * Repository for Medication domain persistence.
 * Acts as the single access layer between Storage and UI.
 * No UI/business logic belongs here.
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

import { medicationStorage } from "./medicationStorage";

export class MedicationRepository {
  /**
   * ============================================================
   * Consultation
   * ============================================================
   */

  async saveConsultation(
    consultation: ConsultationMetadata
  ): Promise<void> {
    await medicationStorage.saveConsultation(
      consultation
    );
  }

  async getConsultation(
    consultationId: string
  ): Promise<ConsultationMetadata | null> {
    return medicationStorage.getConsultation(
      consultationId
    );
  }

  async getPatientConsultations(
    patientId: string
  ): Promise<ConsultationMetadata[]> {
    return medicationStorage.getPatientConsultations(
      patientId
    );
  }

  /**
   * ============================================================
   * Medicines
   * ============================================================
   */

  async saveMedicines(
    consultationId: string,
    medicines: Medicine[]
  ): Promise<void> {
    await medicationStorage.saveMedicines(
      consultationId,
      medicines
    );
  }

  async getMedicines(
    consultationId: string
  ): Promise<Medicine[]> {
    return medicationStorage.getMedicines(
      consultationId
    );
  }

  async getPatientMedicines(
    patientId: string
  ): Promise<Medicine[]> {
    return medicationStorage.getPatientMedicines(
      patientId
    );
  }

  /**
   * ============================================================
   * Treatment Plans
   * ============================================================
   */

  async saveTreatment(
    treatment: TreatmentPlan
  ): Promise<void> {
    await medicationStorage.saveTreatment(
      treatment
    );
  }

  async getTreatment(
    treatmentId: string
  ): Promise<TreatmentPlan | null> {
    return medicationStorage.getTreatment(
      treatmentId
    );
  }

  async getPatientTreatments(
    patientId: string
  ): Promise<TreatmentPlan[]> {
    return medicationStorage.getPatientTreatments(
      patientId
    );
  }

  /**
   * ============================================================
   * Delete
   * ============================================================
   */

  async deleteConsultation(
    consultationId: string
  ): Promise<void> {
    await medicationStorage.deleteConsultation(
      consultationId
    );
  }

  async deleteTreatment(
    treatmentId: string
  ): Promise<void> {
    await medicationStorage.deleteTreatment(
      treatmentId
    );
  }
}

export const medicationRepository =
  new MedicationRepository();