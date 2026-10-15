import type {
    ClinicalQuestion
} from "../../question/QuestionTypes";

import type {

    ClinicalSummaryItem

} from "../clinicalSummaryTypes";

export interface ClinicalSummaryProcessor {

    process(

        questions: ClinicalQuestion[]

    ): ClinicalSummaryItem[];

}