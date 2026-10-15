import {

    ClinicalRisk,

    ClinicalSummarySection,

    type ClinicalSummaryItem

} from "../clinicalSummaryTypes";

export abstract class BaseClinicalSummaryProcessor {

    protected item(

        section: ClinicalSummarySection,

        risk: ClinicalRisk,

        title: string,

        summary: string,

        sourceQuestionIds: string[]

    ): ClinicalSummaryItem {

        return {

            id: crypto.randomUUID(),

            section,

            risk,

            title,

            summary,

            sourceQuestionIds

        };

    }

}