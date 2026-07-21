import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class FollowUpComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousFollowUps =
            this.asArray(previous.followUps);

        const currentFollowUps =
            this.asArray(current.followUps);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousFollowUps,
            currentFollowUps,
            followUp =>
                this.normalize(
                    followUp.title ??
                    followUp.type ??
                    followUp.description ??
                    ""
                )
        );

        previousMap.forEach((followUp, key) => {

            if (currentMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "followUps",
                    "followUp",
                    followUp.title ??
                    followUp.type ??
                    "Follow-up",
                    followUp,
                    undefined,
                    "removed",
                    "moderate",
                    "high",
                    "Follow-up removed."
                )
            );

        });

        currentMap.forEach((followUp, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "followUps",
                    "followUp",
                    followUp.title ??
                    followUp.type ??
                    "Follow-up",
                    undefined,
                    followUp,
                    "added",
                    "major",
                    "high",
                    "New follow-up added."
                )
            );

        });

        return differences;

    }

}