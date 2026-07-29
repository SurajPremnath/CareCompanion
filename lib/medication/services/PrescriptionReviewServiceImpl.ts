import {
  PrescriptionReviewRequest,
  PrescriptionReviewService,
} from "./PrescriptionReviewService";


import { MedicationReviewResult } from "../types/MedicationReviewResult";

/**
 * ============================================================
 * CAREVR
 * Prescription Review Service
 * ============================================================
 *
 * Responsibilities
 * ----------------
 * - Creates pipeline context
 * - Executes review pipeline
 * - Returns final review result
 *
 * It DOES NOT:
 * - perform OCR
 * - resolve medicines
 * - perform review logic
 * - build timeline
 * - access database directly
 *
 * All business logic belongs inside pipeline stages.
 * ============================================================
 */
export class PrescriptionReviewServiceImpl
  implements PrescriptionReviewService
{

async process(
    request: PrescriptionReviewRequest
): Promise<MedicationReviewResult> {

    throw new Error(
        "PrescriptionReviewServiceImpl is being migrated to the new medication review architecture."
    );

}

}