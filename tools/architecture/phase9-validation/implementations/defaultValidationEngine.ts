import { ValidationEngine } from "../contracts/validationEngine";
import { ValidationResult } from "../models";

import { KnowledgeModel } from "../../core";

import { ValidationRuleEngine } from "./validationRuleEngine";

export class DefaultValidationEngine
    implements ValidationEngine {

    public constructor(

        private readonly ruleEngine: ValidationRuleEngine

    ) {}

    public validate(
        knowledge: KnowledgeModel
    ): ValidationResult {

        const findings =
            this.ruleEngine.evaluate(knowledge);

        const errors =
            findings.filter(f => f.severity === "Error").length;

        const warnings =
            findings.filter(f => f.severity === "Warning").length;

        return {

            passed: errors === 0,

            findings,

            summary: {

                passed:
                    findings.length - errors - warnings,

                warnings,

                errors

            }

        };

    }

}