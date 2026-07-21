import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class HistoryComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousHistory =
            this.asArray(previous.history);

        const currentHistory =
            this.asArray(current.history);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousHistory,
            currentHistory,
            history =>
                `${history.category}:${this.normalize(history.value)}`
        );

        previousMap.forEach((history, key) => {

            if (currentMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "history",
                    history.category,
                    history.category,
                    history,
                    undefined,
                    "removed",
                    "minor",
                    "high",
                    "History item removed."
                )
            );

        });

        currentMap.forEach((history, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "history",
                    history.category,
                    history.category,
                    undefined,
                    history,
                    "added",
                    "major",
                    "high",
                    "New history recorded."
                )
            );

        });

        return differences;

    }

}