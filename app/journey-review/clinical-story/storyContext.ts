export interface ClinicalStoryContext {

    startDate: string;

    endDate: string;

}


export function getClinicalStoryContext()
: ClinicalStoryContext {


    const startDate =
        "2026-07-10";


    const endDate =
        new Date()
            .toISOString()
            .split("T")[0];


    return {

        startDate,

        endDate

    };

}