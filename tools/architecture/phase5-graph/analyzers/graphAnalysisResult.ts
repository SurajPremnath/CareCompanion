import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphMetrics } from "./graphMetrics";

export interface GraphAnalysisResult {

    readonly graph: DependencyGraph;

    readonly metrics: GraphMetrics;

    readonly findings: readonly Finding[];

}