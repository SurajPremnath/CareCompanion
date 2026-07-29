import { KnowledgeModel } from "../../core";
import { Finding } from "../../core";

export interface ValidationRule {

    evaluate(
        knowledge: KnowledgeModel
    ): Finding[];

}