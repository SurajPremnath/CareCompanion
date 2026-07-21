import type {
    ClinicalQuestion
} from "../../question/QuestionTypes";


import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class DiagnosisClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category === "DIAGNOSIS_CLARIFICATION"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.DIAGNOSIS,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Diagnosis requires ongoing clinical review.",

                    [q.id]

                )

            );

    }

}