import type {
    ComparisonDifference
} from "../../comparison/comparisonTypes";

import {
    TreatmentAction,
    TreatmentCategory
} from "../treatmentTypes";

import { TreatmentHelper } from "../utils/TreatmentHelper";

import { BaseTreatmentProcessor } from "../BaseTreatmentProcessor";
import type { TreatmentProcessor } from "../TreatmentProcessor";

export class VitalTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d => d.category === "vitals"
            )

            .map(d =>
                this.resolution(

                    TreatmentCategory.VITAL,

                    TreatmentAction.MONITOR,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Vital changed.",

                    [d.id],

                    d.recommendation

                )
            );

    }

}