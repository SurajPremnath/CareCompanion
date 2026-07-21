import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class AssessmentComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousAssessments =
            this.asArray(previous.assessments);

        const currentAssessments =
            this.asArray(current.assessments);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousAssessments,
            currentAssessments,
            assessment =>
                this.normalize(
                    assessment.name
                )
        );

        previousMap.forEach((assessment, key) => {

            if (currentMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "assessments",
                    "assessment",
                    assessment.name,
                    assessment,
                    undefined,
                    "removed",
                    "minor",
                    "high",
                    "Assessment removed."
                )
            );

        });

        currentMap.forEach((assessment, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "assessments",
                    "assessment",
                    assessment.name,
                    undefined,
                    assessment,
                    "added",
                    "major",
                    "high",
                    "New assessment recorded."
                )
            );

        });

        return differences;

    }

}