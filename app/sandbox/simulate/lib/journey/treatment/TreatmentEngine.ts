import type {
    ComparisonDifference
} from "../comparison/comparisonTypes";

import {
    TreatmentPriority,
    TreatmentStatus,
    type TreatmentEngineResult,
    type TreatmentResolution,
    type TreatmentResult,
    type TreatmentSummary
} from "./treatmentTypes";

import { TreatmentValidator } from "./treatmentValidator";
import { TreatmentHelper } from "./utils/TreatmentHelper";

import type { TreatmentProcessor } from "./TreatmentProcessor";

import { DiagnosisTreatmentProcessor } from "./processors/DiagnosisTreatmentProcessor";
import { ComplaintTreatmentProcessor } from "./processors/ComplaintTreatmentProcessor";
import { VitalTreatmentProcessor } from "./processors/VitalTreatmentProcessor";
import { InvestigationTreatmentProcessor } from "./processors/InvestigationTreatmentProcessor";
import { AssessmentTreatmentProcessor } from "./processors/AssessmentTreatmentProcessor";
import { DoctorInstructionTreatmentProcessor } from "./processors/DoctorInstructionTreatmentProcessor";
import { FollowUpTreatmentProcessor } from "./processors/FollowUpTreatmentProcessor";

export class TreatmentEngine {

    private readonly processors: TreatmentProcessor[] = [

        new DiagnosisTreatmentProcessor(),

        new ComplaintTreatmentProcessor(),

        new VitalTreatmentProcessor(),

        new InvestigationTreatmentProcessor(),

        new AssessmentTreatmentProcessor(),

        new DoctorInstructionTreatmentProcessor(),

        new FollowUpTreatmentProcessor()

    ];

    resolve(

        differences: ComparisonDifference[]

    ): TreatmentEngineResult {

        const validation =
            TreatmentValidator.validate(
                differences
            );

        if (!validation.valid) {

            return {

                status: TreatmentStatus.FAILED,

                errors: validation.errors

            };

        }

        const resolutions =
            this.executeProcessors(
                differences
            );

        const result: TreatmentResult = {

            resolutions,

            summary:
                this.buildSummary(
                    resolutions
                ),

            warnings: [],

            errors: []

        };

        return {

            status: TreatmentStatus.SUCCESS,

            result,

            errors: []

        };

    }

    private executeProcessors(

        differences: ComparisonDifference[]

    ): TreatmentResolution[] {

        const resolutions:
            TreatmentResolution[] = [];

        for (const processor of this.processors) {

            resolutions.push(

                ...processor.process(
                    differences
                )

            );

        }

        return TreatmentHelper.sort(
            resolutions
        );

    }

    private buildSummary(

        resolutions: TreatmentResolution[]

    ): TreatmentSummary {

        return {

            totalResolutions:
                resolutions.length,

            critical:
                TreatmentHelper.countPriority(
                    resolutions,
                    TreatmentPriority.CRITICAL
                ),

            high:
                TreatmentHelper.countPriority(
                    resolutions,
                    TreatmentPriority.HIGH
                ),

            medium:
                TreatmentHelper.countPriority(
                    resolutions,
                    TreatmentPriority.MEDIUM
                ),

            low:
                TreatmentHelper.countPriority(
                    resolutions,
                    TreatmentPriority.LOW
                )

        };

    }

}