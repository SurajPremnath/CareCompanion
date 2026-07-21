/**
 * ============================================================
 * CAREVR Medication Mapper
 * ============================================================
 * Canonical mapping utilities for medication objects.
 * Pure mapping layer.
 * No database/framework dependencies.
 * ============================================================
 */

import {
  ConsultationMetadata,
  ConsultationStatus,
} from "./consultationTypes";

import {
  Medicine,
  MedicationStatus,
  MedicationTiming,
  MedicationFrequency,
  PrescriptionMedicine,
} from "./medicationTypes";

export class MedicationMapper {
  /**
   * Creates a Medicine from a partial object.
   */
  static toMedicine(data: Partial<Medicine>): Medicine {
    return {
      id: data.id,
      prescriptionMedicineId: data.prescriptionMedicineId,

      genericName: data.genericName,

      brandName: data.brandName ?? "",

      strength: data.strength,

      formulation: data.formulation,

      dose: data.dose,

instruction: data.instruction ?? {
  timing: MedicationTiming.OTHER,
  frequency: MedicationFrequency.CUSTOM,
},

      duration: data.duration,

      quantity: data.quantity,

      refillCount: data.refillCount,

      indication: data.indication,

      status: data.status ?? MedicationStatus.ACTIVE,

      startDate: data.startDate,

      endDate: data.endDate,

      isHighRisk: data.isHighRisk ?? false,

      isControlledDrug: data.isControlledDrug ?? false,

      remarks: data.remarks,
    };
  }

  /**
   * Converts medicines into prescription medicines.
   */
  static toPrescriptionMedicines(
    medicines: Medicine[]
  ): PrescriptionMedicine[] {
    return medicines.map((medicine, index) => ({
      medicine,
      sequence: index + 1,
    }));
  }

  /**
   * Clone medicine.
   */
  static cloneMedicine(
    medicine: Medicine
  ): Medicine {
    return structuredClone(medicine);
  }

  /**
   * Clone medicine list.
   */
  static cloneMedicines(
    medicines: Medicine[]
  ): Medicine[] {
    return medicines.map((m) => this.cloneMedicine(m));
  }

  /**
   * Update status.
   */
  static updateMedicineStatus(
    medicine: Medicine,
    status: MedicationStatus
  ): Medicine {
    return {
      ...medicine,
      status,
    };
  }

  /**
   * Creates Consultation metadata.
   */
  static toConsultation(
    data: Partial<ConsultationMetadata>
  ): ConsultationMetadata {
    const now = new Date().toISOString();

    return {
      consultationId: data.consultationId ?? crypto.randomUUID(),

      patientId: data.patientId ?? "",

      mode: data.mode!,

      source: data.source!,

      status: data.status ?? ConsultationStatus.DRAFT,

      consultationDate:
        data.consultationDate ?? now,

      doctor: data.doctor,

      hospitalName: data.hospitalName,

      department: data.department,

      followUpRecommended:
        data.followUpRecommended,

      followUpDate: data.followUpDate,

      remarks: data.remarks,

      createdAt: data.createdAt ?? now,

      updatedAt: data.updatedAt ?? now,
    };
  }
}