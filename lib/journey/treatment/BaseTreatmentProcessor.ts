import {
    TreatmentAction,
    TreatmentCategory,
    TreatmentPriority,
    type TreatmentResolution
} from "./treatmentTypes";

export abstract class BaseTreatmentProcessor {

    protected resolution(

        category: TreatmentCategory,

        action: TreatmentAction,

        priority: TreatmentPriority,

        title: string,

        description: string,

        sourceDifferenceIds: string[],

        recommendation?: string

    ): TreatmentResolution {

        return {

            id: crypto.randomUUID(),

            category,

            action,

            priority,

            title,

            description,

            sourceDifferenceIds,

            recommendation

        };

    }

}