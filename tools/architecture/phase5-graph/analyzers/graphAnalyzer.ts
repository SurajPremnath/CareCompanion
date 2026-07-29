import { DependencyGraph } from "../models/dependencyGraph";
import { GraphAnalysisResult } from "./graphAnalysisResult";

export interface GraphAnalyzer {

    analyze(
        graph: DependencyGraph
    ): GraphAnalysisResult;

}