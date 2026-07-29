import {
    KnowledgeModel,
    Finding,
    Recommendation
} from "../../core";

import { ValidationResult } from "../../phase9-validation";

export interface ReportContext {

    knowledge: KnowledgeModel;

    validation: ValidationResult;

    findings: Finding[];

    recommendations: Recommendation[];

    outputDirectory: string;

}