import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class VitalComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousVitals =
            previous.vitals;

        const currentVitals =
            current.vitals;

        const fields = [

            {
                field: "temperature",
                label: "Temperature"
            },

            {
                field: "bloodPressure",
                label: "Blood Pressure"
            },

            {
                field: "pulse",
                label: "Pulse"
            },

            {
                field: "spo2",
                label: "SpO₂"
            },

            {
                field: "respiratoryRate",
                label: "Respiratory Rate"
            },

            {
                field: "weight",
                label: "Weight"
            }

        ] as const;

        for (const item of fields) {

            const previousValue =
                previousVitals[item.field];

            const currentValue =
                currentVitals[item.field];

            if (
                this.equals(
                    previousValue,
                    currentValue
                )
            ) {
                continue;
            }

            differences.push(
                this.difference(
                    "vitals",
                    item.field,
                    item.label,
                    previousValue,
                    currentValue,
                    "modified",
                    "major",
                    "high",
                    `${item.label} changed.`
                )
            );

        }

        return differences;

    }

}