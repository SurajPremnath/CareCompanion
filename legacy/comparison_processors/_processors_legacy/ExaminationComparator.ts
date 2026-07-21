import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class ExaminationComparator
    extends BaseComparator
    implements ComparisonProcessor {

    compare(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        const differences: ComparisonDifference[] = [];

        const previousExamination =
            previous.examination;

        const currentExamination =
            current.examination;

        if (
            this.equals(
                previousExamination,
                currentExamination
            )
        ) {
            return differences;
        }

        differences.push(
            this.difference(
                "examination",
                "clinicalExamination",
                "Clinical Examination",
                previousExamination,
                currentExamination,
                "modified",
                "major",
                "high",
                "Clinical examination changed."
            )
        );

        return differences;

    }

}