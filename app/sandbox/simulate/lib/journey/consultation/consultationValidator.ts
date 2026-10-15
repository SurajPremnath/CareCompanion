import type { ConsultationRecord } from "@/lib/medication";

import {
  ConsultationResolutionRequest,
  ConsultationValidationResult,
  ValidationIssue,
} from "./consultationTypes";

export class ConsultationValidator {
  validate(
    request: ConsultationResolutionRequest
  ): ConsultationValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    if (!request) {
      errors.push({
        field: "request",
        code: "REQUEST_MISSING",
        message: "Consultation request is required.",
        severity: "error",
      });

      return {
        valid: false,
        errors,
        warnings,
      };
    }

    this.validateConsultation(
      request.consultation,
      warnings,
      errors
    );

    this.validateContext(
      request,
      warnings,
      errors
    );

    this.validateExistingConsultations(
      request.existingConsultations,
      errors
    );

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateConsultation(
    consultation: ConsultationRecord | undefined,
    warnings: ValidationIssue[],
    errors: ValidationIssue[]
  ): void {
    if (!consultation) {
      errors.push({
        field: "consultation",
        code: "CONSULTATION_MISSING",
        message: "Consultation record is missing.",
        severity: "error",
      });
      return;
    }

    const data = consultation as any;

    if (!data.consultationDate) {
      warnings.push({
        field: "consultationDate",
        code: "DATE_MISSING",
        message: "Consultation date is missing.",
        severity: "warning",
      });
    }

    if (!data.doctorName) {
      warnings.push({
        field: "doctorName",
        code: "DOCTOR_MISSING",
        message: "Doctor name is missing.",
        severity: "warning",
      });
    }

    if (!data.hospitalName) {
      warnings.push({
        field: "hospitalName",
        code: "HOSPITAL_MISSING",
        message: "Hospital name is missing.",
        severity: "warning",
      });
    }
  }

  private validateContext(
    request: ConsultationResolutionRequest,
    warnings: ValidationIssue[],
    errors: ValidationIssue[]
  ): void {
    if (!request.context) {
      errors.push({
        field: "context",
        code: "CONTEXT_MISSING",
        message: "Context is required.",
        severity: "error",
      });
      return;
    }

    if (!request.context.patientId) {
      errors.push({
        field: "patientId",
        code: "PATIENT_MISSING",
        message: "Patient ID is required.",
        severity: "error",
      });
    }

    if (!request.context.source) {
      warnings.push({
        field: "source",
        code: "SOURCE_MISSING",
        message: "Source is missing.",
        severity: "warning",
      });
    }
  }

  private validateExistingConsultations(
    consultations: ConsultationRecord[] | undefined,
    errors: ValidationIssue[]
  ): void {
    if (!consultations) {
      errors.push({
        field: "existingConsultations",
        code: "COLLECTION_MISSING",
        message: "Existing consultations are required.",
        severity: "error",
      });
      return;
    }

    if (!Array.isArray(consultations)) {
      errors.push({
        field: "existingConsultations",
        code: "INVALID_COLLECTION",
        message: "Existing consultations must be an array.",
        severity: "error",
      });
    }
  }
}