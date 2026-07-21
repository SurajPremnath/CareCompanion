import type {
    ClinicalQuestion
} from "../../question/questionTypes";


import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class VitalClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category === "OTHER"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.VITALS,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Latest vital parameters should be reviewed for clinical trends.",

                    [q.id]

                )

            );

    }

}