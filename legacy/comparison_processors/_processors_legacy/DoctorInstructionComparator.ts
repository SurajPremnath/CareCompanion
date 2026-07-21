import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class DoctorInstructionComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousInstructions =
            this.asArray(previous.doctorInstructions);

        const currentInstructions =
            this.asArray(current.doctorInstructions);

        const {
            previousMap,
            currentMap
        } = this.compareCollection(
            previousInstructions,
            currentInstructions,
            instruction =>
                this.normalize(
                    instruction.instruction
                )
        );

        previousMap.forEach((instruction, key) => {

            if (currentMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "doctorInstructions",
                    "instruction",
                    instruction.instruction,
                    instruction,
                    undefined,
                    "removed",
                    "minor",
                    "high",
                    "Doctor instruction removed."
                )
            );

        });

        currentMap.forEach((instruction, key) => {

            if (previousMap.has(key)) {
                return;
            }

            differences.push(
                this.difference(
                    "doctorInstructions",
                    "instruction",
                    instruction.instruction,
                    undefined,
                    instruction,
                    "added",
                    "major",
                    "high",
                    "New doctor instruction."
                )
            );

        });

        return differences;

    }

}