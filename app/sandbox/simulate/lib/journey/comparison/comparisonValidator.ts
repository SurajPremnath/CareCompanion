import type { ComparisonRequest } from "./comparisonTypes";

/* ==========================================================
 * Validation Error
 * ========================================================== */

export interface ComparisonValidationError {
  field: string;
  message: string;
}

/* ==========================================================
 * Validation Result
 * ========================================================== */

export interface ComparisonValidationResult {
  valid: boolean;
  errors: ComparisonValidationError[];
}

/* ==========================================================
 * Comparison Validator
 * ========================================================== */

export class ComparisonValidator {
  validate(
    request: ComparisonRequest,
  ): ComparisonValidationResult {
    const errors: ComparisonValidationError[] = [];

    if (!request.previousConsultation) {
      errors.push({
        field: "previousConsultation",
        message: "Previous consultation is required.",
      });
    }

    if (!request.currentConsultation) {
      errors.push({
        field: "currentConsultation",
        message: "Current consultation is required.",
      });
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
      };
    }

const previousPatientId =
  request.previousConsultation.patient.uhid;

const currentPatientId =
  request.currentConsultation.patient.uhid;

    if (
      previousPatientId &&
      currentPatientId &&
      previousPatientId !== currentPatientId
    ) {
      errors.push({
        field: "patientId",
        message:
          "Both consultations must belong to the same patient.",
      });
    }

const previousDate =
  request.previousConsultation.consultation.consultationDate;

const currentDate =
  request.currentConsultation.consultation.consultationDate;

    if (
      previousDate &&
      currentDate &&
      new Date(previousDate) > new Date(currentDate)
    ) {
      errors.push({
        field: "consultationDate",
        message:
          "Current consultation cannot occur before the previous consultation.",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}