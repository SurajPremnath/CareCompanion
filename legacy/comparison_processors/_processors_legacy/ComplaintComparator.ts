import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class ComplaintComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousComplaints =
            this.asArray(previous.complaints);

        const currentComplaints =
            this.asArray(current.complaints);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousComplaints,
            currentComplaints,
            complaint =>
                this.normalize(
                    typeof complaint === "string"
                        ? complaint
                        : complaint.complaint
                )
        );

        previousMap.forEach((previousComplaint, key) => {

            const currentComplaint =
                currentMap.get(key);

            if (!currentComplaint) {

                differences.push(
                    this.difference(
                        "complaints",
                        "complaint",
                        typeof previousComplaint === "string"
                            ? previousComplaint
                            : previousComplaint.complaint,
                        previousComplaint,
                        undefined,
                        "removed",
                        "moderate",
                        "high",
                        "Complaint no longer reported."
                    )
                );

                return;
            }

            if (
                !this.same(
                    previousComplaint.duration,
                    currentComplaint.duration
                )
            ) {

                differences.push(
                    this.difference(
                        "complaints",
                        "duration",
                        previousComplaint.complaint,
                        previousComplaint.duration,
                        currentComplaint.duration,
                        "modified",
                        "major",
                        "high",
                        "Complaint duration changed."
                    )
                );

            }

        });

        currentMap.forEach(currentComplaint => {

            const key = this.normalize(
                typeof currentComplaint === "string"
                    ? currentComplaint
                    : currentComplaint.complaint
            );

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "complaints",
                    "complaint",
                    typeof currentComplaint === "string"
                        ? currentComplaint
                        : currentComplaint.complaint,
                    undefined,
                    currentComplaint,
                    "added",
                    "moderate",
                    "high",
                    "New complaint reported."
                )
            );

        });

        return differences;

    }

}