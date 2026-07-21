import type {
    ClinicalQuestion
} from "../../question/questionTypes";

import type {

    ClinicalSummaryItem

} from "../clinicalSummaryTypes";

export interface ClinicalSummaryProcessor {

    process(

        questions: ClinicalQuestion[]

    ): ClinicalSummaryItem[];

}