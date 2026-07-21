import type {
    ClinicalQuestion
} from "../../question/QuestionTypes";

import {
    ClinicalSummarySection
} from "../clinicalSummaryTypes";

import { ClinicalSummaryHelper } from "../utils/ClinicalSummaryHelper";

import { BaseClinicalSummaryProcessor } from "./BaseClinicalSummaryProcessor";
import type { ClinicalSummaryProcessor } from "./ClinicalSummaryProcessor";

export class MedicationClinicalSummaryProcessor
    extends BaseClinicalSummaryProcessor
    implements ClinicalSummaryProcessor {

    process(
        questions: ClinicalQuestion[]
    ) {

        return questions

            .filter(

                q =>
                    q.category ===
                    "MEDICATION_TOLERANCE"

            )

            .map(q =>

                this.item(

                    ClinicalSummarySection.MEDICATION,

                    ClinicalSummaryHelper.riskFromPriority(
                        q.priority
                    ),

                    q.title,

                    "Medication adherence requires confirmation.",

                    [q.id]

                )

            );

    }

}