import type {
    ClinicalQuestion
} from "../../question/QuestionTypes";

import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class SymptomClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category === "SYMPTOM_PROGRESSION"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.SYMPTOMS,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Symptoms require continued monitoring for progression or improvement.",

                    [q.id]

                )

            );

    }

}