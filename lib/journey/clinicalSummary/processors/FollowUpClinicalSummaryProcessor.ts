import type {
    ClinicalQuestion
} from "../../question/QuestionTypes";

import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class FollowUpClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category === "FOLLOW_UP_REMINDER"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.FOLLOW_UP,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Scheduled follow-up should be completed as advised.",

                    [q.id]

                )

            );

    }

}