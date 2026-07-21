import type {
    ComparisonDifference
} from "../comparison/comparisonTypes";

import type {
    TreatmentResolution
} from "./treatmentTypes";

export interface TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ): TreatmentResolution[];

}