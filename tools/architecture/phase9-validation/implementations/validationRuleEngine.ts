import { KnowledgeModel } from "../../core";
import { Finding } from "../../core";

import { ValidationRule } from "../contracts/validationRule";

export class ValidationRuleEngine {

    public constructor(

        private readonly rules: ValidationRule[]

    ) {}

    public evaluate(
        knowledge: KnowledgeModel
    ): Finding[] {

        const findings: Finding[] = [];

        for (const rule of this.rules) {

            findings.push(
                ...rule.evaluate(knowledge)
            );

        }

        return findings;

    }

}