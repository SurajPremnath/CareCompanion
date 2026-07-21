import type {
    ClinicalQuestion
} from "../../question/questionTypes";


import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class InvestigationClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category ===
                    "INVESTIGATION_FOLLOW_UP"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.INVESTIGATIONS,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Pending or completed investigations should be clinically correlated.",

                    [q.id]

                )

            );

    }

}