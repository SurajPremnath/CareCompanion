import type { MedicationReviewItem } from "../types/MedicationReviewItem";

export interface MedicationReviewMapper {

  fromExtraction(
    extraction: unknown
  ): Promise<MedicationReviewItem[]>;

}