import { Finding, KnowledgeModel, Recommendation } from "../../core";
import { ArchitectureSummary } from "./architectureSummary";

export interface AnalysisResult {

    summary: ArchitectureSummary;

    knowledge: KnowledgeModel;

    findings: Finding[];

    recommendations: Recommendation[];

}