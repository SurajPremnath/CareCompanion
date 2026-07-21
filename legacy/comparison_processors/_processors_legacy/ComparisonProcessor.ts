import type { ConsultationRecord } from "@/lib/medication";
import type { ComparisonDifference } from "../comparisonTypes";

export interface ComparisonProcessor {
    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[];
}