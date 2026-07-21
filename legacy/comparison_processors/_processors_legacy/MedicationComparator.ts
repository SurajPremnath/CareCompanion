import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class MedicationComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousMedicines =
            this.asArray(previous.medicines);

        const currentMedicines =
            this.asArray(current.medicines);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousMedicines,
            currentMedicines,
            medicine =>
                this.normalize(
                    medicine.name ??
                    medicine.brandName ??
                    ""
                )
        );

        previousMap.forEach((previousMedicine, key) => {

            const currentMedicine =
                currentMap.get(key);

            if (!currentMedicine) {

                differences.push(
                    this.difference(
                        "medicines",
                        "medicine",
                        previousMedicine.name ??
                        previousMedicine.brandName,
                        previousMedicine,
                        undefined,
                        "removed",
                        "major",
                        "high",
                        "Medicine discontinued."
                    )
                );

                return;
            }

            this.compareMedicineField(
                differences,
                previousMedicine.name ??
                    previousMedicine.brandName,
                "dose",
                "Dose",
                previousMedicine.dose,
                currentMedicine.dose
            );

            this.compareMedicineField(
                differences,
                previousMedicine.name ??
                    previousMedicine.brandName,
                "frequency",
                "Frequency",
                previousMedicine.frequency,
                currentMedicine.frequency
            );

            this.compareMedicineField(
                differences,
                previousMedicine.name ??
                    previousMedicine.brandName,
                "duration",
                "Duration",
                previousMedicine.duration,
                currentMedicine.duration
            );

            this.compareMedicineField(
                differences,
                previousMedicine.name ??
                    previousMedicine.brandName,
                "timing",
                "Timing",
                previousMedicine.timing,
                currentMedicine.timing
            );

        });

        currentMap.forEach((currentMedicine, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "medicines",
                    "medicine",
                    currentMedicine.name ??
                        currentMedicine.brandName,
                    undefined,
                    currentMedicine,
                    "added",
                    "major",
                    "high",
                    "New medicine prescribed."
                )
            );

        });

        return differences;

    }

    private compareMedicineField(
        differences: ComparisonDifference[],
        medicineName: string,
        field: string,
        label: string,
        previousValue: unknown,
        currentValue: unknown
    ): void {

        if (
            this.equals(
                previousValue,
                currentValue
            )
        ) {
            return;
        }

        differences.push(
            this.difference(
                "medicines",
                field,
                `${medicineName} - ${label}`,
                previousValue,
                currentValue,
                "modified",
                "major",
                "high",
                `${label} changed.`
            )
        );

    }

}