import type { MedicationReviewResult } from "../types/MedicationReviewResult";

export interface PrescriptionReviewRequest {

  patientId: string;

  prescriptionId?: string;

  consultationId?: string;

  source:

    | "IMAGE"

    | "PDF"

    | "VOICE"

    | "MANUAL";

  payload: unknown;

}

export interface PrescriptionReviewService {

  process(

      request: PrescriptionReviewRequest

  ): Promise<MedicationReviewResult>;

}