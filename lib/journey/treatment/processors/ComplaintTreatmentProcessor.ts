import type {
    ComparisonDifference
} from "../../comparison/comparisonTypes";

import {
    TreatmentAction,
    TreatmentCategory
} from "../treatmentTypes";

import { TreatmentHelper } from "../utils/TreatmentHelper";

import { BaseTreatmentProcessor } from "./BaseTreatmentProcessor";
import type { TreatmentProcessor } from "./TreatmentProcessor";

export class ComplaintTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d => d.category === "complaints"
            )

            .map(d =>
                this.resolution(

                    TreatmentCategory.COMPLAINT,

                    TreatmentAction.MONITOR,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Complaint updated.",

                    [d.id],

                    d.recommendation

                )
            );

    }

}