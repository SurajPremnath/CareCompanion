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

export class AssessmentTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d => d.category === "assessments"
            )

            .map(d =>
                this.resolution(

                    TreatmentCategory.ASSESSMENT,

                    TreatmentAction.REVIEW,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Assessment updated.",

                    [d.id],

                    d.recommendation

                )
            );

    }

}