import type { ComparisonDifference } from "../../comparison/comparisonTypes";

import {
    TreatmentPriority,
    type TreatmentResolution
} from "../treatmentTypes";

export class TreatmentHelper {

    static priorityFromSeverity(
        severity: ComparisonDifference["severity"]
    ): TreatmentPriority {

        switch (severity) {

            case "critical":
                return TreatmentPriority.CRITICAL;

            case "major":
                return TreatmentPriority.HIGH;

            case "moderate":
                return TreatmentPriority.MEDIUM;

            default:
                return TreatmentPriority.LOW;

        }

    }

    static sort(
        resolutions: TreatmentResolution[]
    ): TreatmentResolution[] {

        const order = {

            critical: 4,

            high: 3,

            medium: 2,

            low: 1

        };

        return [...resolutions].sort(
            (a, b) =>
                order[b.priority] -
                order[a.priority]
        );

    }

    static countPriority(

        resolutions: TreatmentResolution[],

        priority: TreatmentPriority

    ): number {

        return resolutions.filter(
            r => r.priority === priority
        ).length;

    }

}