import { KnowledgeModel } from "../../core";
import { ValidationResult } from "../models";

export interface ValidationEngine {

    validate(
        knowledge: KnowledgeModel
    ): ValidationResult;

}