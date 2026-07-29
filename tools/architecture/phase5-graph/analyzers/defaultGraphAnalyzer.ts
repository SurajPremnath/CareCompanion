import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRuleEngine } from "../ruleEngine";
import { GraphAnalysisResult } from "./graphAnalysisResult";
import { GraphAnalyzer } from "./graphAnalyzer";

export class DefaultGraphAnalyzer
    implements GraphAnalyzer {

    public constructor(
        private readonly ruleEngine: GraphRuleEngine
    ) {}

    public analyze(
        graph: DependencyGraph
    ): GraphAnalysisResult {

        const connected = new Set<string>();

        for (const edge of graph.edges) {

            connected.add(edge.source);
            connected.add(edge.target);

        }

        const findings: readonly Finding[] =
            this.ruleEngine.evaluate(graph);

        return {

            graph,

            metrics: {

                nodeCount: graph.nodes.length,

                edgeCount: graph.edges.length,

                isolatedNodeCount: graph.nodes.filter(
                    node => !connected.has(node.id)
                ).length

            },

            findings

        };

    }

}