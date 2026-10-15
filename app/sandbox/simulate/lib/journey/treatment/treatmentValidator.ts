import type {
    ComparisonDifference
} from "../comparison/comparisonTypes";

export interface TreatmentValidationResult {

    valid: boolean;

    errors: string[];

}

export class TreatmentValidator {

    static validate(

        differences: ComparisonDifference[]

    ): TreatmentValidationResult {

        const errors: string[] = [];

        if (!differences) {

            errors.push(
                "Comparison differences missing."
            );

        }

        if (
            differences &&
            !Array.isArray(differences)
        ) {

            errors.push(
                "Comparison differences must be an array."
            );

        }

        return {

            valid: errors.length === 0,

            errors

        };

    }

}