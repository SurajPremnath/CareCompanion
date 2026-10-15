/**
 * ============================================================
 * CAREVR
 * Medication Audit
 * ============================================================
 * Immutable audit metadata.
 * ============================================================
 */

export interface MedicationAudit {

  createdAt: string;

  createdBy?: string;

  reviewedAt?: string;

  reviewedBy?: string;

  updatedAt?: string;

}