import type { MedicationReviewItem } from "./MedicationReviewItem";

export interface MedicationReviewResult {

    medicines: MedicationReviewItem[];

    warnings: string[];

    reviewRequired: boolean;

    totalMedicines: number;

    autoVerified: number;

    userReviewRequired: number;

}