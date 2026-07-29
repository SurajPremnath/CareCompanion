/**
 * ============================================================
 * CAREVR
 * Medication Review
 * ============================================================
 * Represents caregiver validation of AI extracted medicine.
 * ============================================================
 */

export type MedicationReviewStatus =
  | "AUTO_VERIFIED"
  | "USER_CONFIRMED"
  | "USER_CORRECTED";

export type MedicationCorrectionReason =
  | "HANDWRITING"
  | "WRONG_MATCH"
  | "NOT_IN_DATABASE"
  | "DOCTOR_UPDATED"
  | "OTHER";

export interface MedicationReview {

  reviewRequired: boolean;

  status: MedicationReviewStatus;

  correctedMedicineId?: string;

  correctedMedicineName?: string;

  correctionReason?: MedicationCorrectionReason;

  correctionRemarks?: string;

}