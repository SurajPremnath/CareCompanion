import type {
    QuestionPriority
} from "../../question/QuestionTypes";

import {
    ClinicalRisk,
    type ClinicalSummaryItem
} from "../clinicalSummaryTypes";

export class ClinicalSummaryHelper {

    static riskFromPriority(
        priority: QuestionPriority
    ): ClinicalRisk {

        switch (priority) {

            case "CRITICAL":
                return ClinicalRisk.CRITICAL;

            case "HIGH":
                return ClinicalRisk.HIGH;

            case "MEDIUM":
                return ClinicalRisk.MEDIUM;

            default:
                return ClinicalRisk.LOW;

        }

    }

    static sort(
        items: ClinicalSummaryItem[]
    ): ClinicalSummaryItem[] {

        const order = {

            critical: 4,

            high: 3,

            medium: 2,

            low: 1

        };

        return [...items].sort(

            (a, b) =>

                order[b.risk] -
                order[a.risk]

        );

    }

    static count(

        items: ClinicalSummaryItem[],

        risk: ClinicalRisk

    ): number {

        return items.filter(

            item => item.risk === risk

        ).length;

    }

    static unique(

        items: ClinicalSummaryItem[]

    ): ClinicalSummaryItem[] {

        const seen = new Set<string>();

        return items.filter(item => {

            const key =

                `${item.section}|${item.title}|${item.summary}`

                    .toLowerCase();

            if (seen.has(key)) {

                return false;

            }

            seen.add(key);

            return true;

        });

    }

    static buildOverview(

        items: ClinicalSummaryItem[]

    ): string {

        if (items.length === 0) {

            return "No significant clinical changes detected.";

        }

        const critical = this.count(
            items,
            ClinicalRisk.CRITICAL
        );

        const high = this.count(
            items,
            ClinicalRisk.HIGH
        );

        if (critical > 0) {

            return `${critical} critical clinical finding(s) require immediate attention.`;

        }

        if (high > 0) {

            return `${high} high priority clinical finding(s) require review.`;

        }

        return "Clinical changes detected. Continue monitoring patient progress.";

    }

}