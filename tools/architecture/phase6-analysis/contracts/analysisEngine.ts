import { GraphAnalysisResult } from "../../phase5-graph";
import { AnalysisResult } from "../models";

export interface AnalysisEngine {

    analyze(
        graph: GraphAnalysisResult
    ): AnalysisResult;

}