import type {
    ClinicalQuestion
} from "../question/questionTypes";

export interface ClinicalSummaryValidationResult {

    valid: boolean;

    errors: string[];

}

export class ClinicalSummaryValidator {

    static validate(

        questions: ClinicalQuestion[]

    ): ClinicalSummaryValidationResult {

        const errors: string[] = [];

        if (!questions) {

            errors.push(
                "Generated questions missing."
            );

        }

        if (

            questions &&
            !Array.isArray(questions)

        ) {

            errors.push(
                "Generated questions must be an array."
            );

        }

        return {

            valid: errors.length === 0,

            errors

        };

    }

}