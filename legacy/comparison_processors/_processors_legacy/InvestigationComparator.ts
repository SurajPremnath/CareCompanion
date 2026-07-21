import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class InvestigationComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousInvestigations =
            this.asArray(previous.investigations);

        const currentInvestigations =
            this.asArray(current.investigations);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousInvestigations,
            currentInvestigations,
            investigation =>
                this.normalize(
                    investigation.name
                )
        );

        previousMap.forEach((investigation, key) => {

            if (currentMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "investigations",
                    "investigation",
                    investigation.name,
                    investigation,
                    undefined,
                    "removed",
                    "minor",
                    "high",
                    "Investigation removed."
                )
            );

        });

        currentMap.forEach((investigation, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "investigations",
                    "investigation",
                    investigation.name,
                    undefined,
                    investigation,
                    "added",
                    "major",
                    "high",
                    "New investigation ordered."
                )
            );

        });

        return differences;

    }

}