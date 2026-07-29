/**
 * ============================================================
 * CAREVR
 * Medication Review Item
 * ============================================================
 * Aggregate object used by Prescription Review UI.
 * ============================================================
 */

import type { ExtractedPrescriptionMedicine } from "@/lib/prescription-image/prescriptionImageTypes";
import type { MedicationExtraction } from "./MedicationExtraction";
import type { ResolverTrace } from "./ResolverTrace";
import type { MedicationReview } from "./MedicationReview";
import type { MedicationAudit } from "./MedicationAudit";

export interface MedicationReviewItem {

  medicine: ExtractedPrescriptionMedicine;

  extraction: MedicationExtraction;

  resolver: ResolverTrace;

  review: MedicationReview;

  audit: MedicationAudit;

}