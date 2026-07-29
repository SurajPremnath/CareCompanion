import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRuleResult } from "./graphRuleResult";

export interface GraphRule {

    evaluate(
        graph: DependencyGraph
    ): GraphRuleResult;

}