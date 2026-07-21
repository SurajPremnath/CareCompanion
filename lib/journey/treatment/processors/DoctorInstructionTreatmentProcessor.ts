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

export class DoctorInstructionTreatmentProcessor
    extends BaseTreatmentProcessor
    implements TreatmentProcessor {

    process(
        differences: ComparisonDifference[]
    ) {

        return differences

            .filter(
                d =>
                    d.category ===
                    "doctorInstructions"
            )

            .map(d =>
                this.resolution(

                    TreatmentCategory.DOCTOR_INSTRUCTION,

                    TreatmentAction.REVIEW,

                    TreatmentHelper.priorityFromSeverity(
                        d.severity
                    ),

                    d.label,

                    d.reason ??
                        "Doctor instruction updated.",

                    [d.id],

                    d.recommendation

                )
            );

    }

}