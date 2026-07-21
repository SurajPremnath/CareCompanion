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

export class FollowUpTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d => d.category === "followUps"
            )

            .map(d =>
                this.resolution(

                    TreatmentCategory.FOLLOW_UP,

                    TreatmentAction.REVIEW,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Follow-up updated.",

                    [d.id],

                    d.recommendation

                )
            );

    }

}