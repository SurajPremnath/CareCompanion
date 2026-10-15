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

export class DiagnosisTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(d =>
                d.category === "assessments"
            )

            .map(d => {

                const action =

                    d.changeType === "added"

                        ? TreatmentAction.START

                    : d.changeType === "removed"

                        ? TreatmentAction.COMPLETE

                    : TreatmentAction.MODIFY;

                return this.resolution(

                    TreatmentCategory.DIAGNOSIS,

                    action,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Diagnosis updated.",

                    [d.id],

                    d.recommendation

                );

            });

    }

}