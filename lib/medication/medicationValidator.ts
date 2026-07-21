/**
 * ============================================================
 * CAREVR Medication Validator
 * ============================================================
 * Canonical validation utilities for medication management.
 * Pure business logic.
 * No database or framework dependencies.
 * ============================================================
 */

import {
  ConsultationMetadata,
  ConsultationMode,
} from "./consultationTypes";

import {
  Medicine,
  MedicationDuration,
  MedicationInstruction,
} from "./medicationTypes";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class MedicationValidator {
  /**
   * ------------------------------------------------------------
   * Consultation
   * ------------------------------------------------------------
   */
  static validateConsultation(
    consultation: ConsultationMetadata
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!consultation.consultationId.trim()) {
      errors.push("Consultation ID is required.");
    }

    if (!consultation.patientId.trim()) {
      errors.push("Patient ID is required.");
    }

    if (!consultation.consultationDate) {
      errors.push("Consultation date is required.");
    }

    if (consultation.mode === ConsultationMode.UNKNOWN) {
      warnings.push("Consultation mode is unknown.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * ------------------------------------------------------------
   * Medicine
   * ------------------------------------------------------------
   */
  static validateMedicine(
    medicine: Medicine
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!medicine.brandName.trim()) {
      errors.push("Medicine name is required.");
    }

    if (!medicine.instruction) {
      errors.push("Medication instruction is required.");
    } else {
      const instructionValidation =
        this.validateInstruction(medicine.instruction);

      errors.push(...instructionValidation.errors);
      warnings.push(...instructionValidation.warnings);
    }

    if (medicine.duration) {
      const durationValidation =
        this.validateDuration(medicine.duration);

      errors.push(...durationValidation.errors);
      warnings.push(...durationValidation.warnings);
    }

    if (
      medicine.quantity !== undefined &&
      medicine.quantity < 0
    ) {
      errors.push("Quantity cannot be negative.");
    }

    if (
      medicine.refillCount !== undefined &&
      medicine.refillCount < 0
    ) {
      errors.push("Refill count cannot be negative.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * ------------------------------------------------------------
   * Medication Instruction
   * ------------------------------------------------------------
   */
  static validateInstruction(
    instruction: MedicationInstruction
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!instruction.frequency) {
      errors.push("Medication frequency is required.");
    }

    if (!instruction.timing) {
      warnings.push("Medication timing not specified.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * ------------------------------------------------------------
   * Medication Duration
   * ------------------------------------------------------------
   */
  static validateDuration(
    duration: MedicationDuration
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (duration.unit !== "CONTINUOUS") {
      if (duration.value <= 0) {
        errors.push("Duration must be greater than zero.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * ------------------------------------------------------------
   * Collection
   * ------------------------------------------------------------
   */
  static validateMedicines(
    medicines: Medicine[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (medicines.length === 0) {
      warnings.push("No medicines found.");
    }

    medicines.forEach((medicine, index) => {
      const result = this.validateMedicine(medicine);

      result.errors.forEach((error) =>
        errors.push(`Medicine ${index + 1}: ${error}`)
      );

      result.warnings.forEach((warning) =>
        warnings.push(`Medicine ${index + 1}: ${warning}`)
      );
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}