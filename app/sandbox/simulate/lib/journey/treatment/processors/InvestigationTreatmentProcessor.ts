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

export class InvestigationTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d => d.category === "investigations"
            )

            .map(d => {

                const action =
                    d.changeType === "added"
                        ? TreatmentAction.START
                        : d.changeType === "removed"
                        ? TreatmentAction.COMPLETE
                        : TreatmentAction.MODIFY;

                return this.resolution(

                    TreatmentCategory.INVESTIGATION,

                    action,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Investigation updated.",

                    [d.id],

                    d.recommendation

                );

            });

    }

}