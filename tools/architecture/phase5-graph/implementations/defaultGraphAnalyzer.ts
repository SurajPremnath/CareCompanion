import { GraphAnalyzer } from "../contracts/graphAnalyzer";

import {
    DependencyGraph,
    GraphAnalysisResult
} from "../models";

import { GraphRuleEngine } from "./graphRuleEngine";

export class DefaultGraphAnalyzer
    implements GraphAnalyzer {

    public constructor(

        private readonly ruleEngine: GraphRuleEngine

    ) {}

    public analyze(
        graph: DependencyGraph
    ): GraphAnalysisResult {

        const findings =
            this.ruleEngine.evaluate(graph);

        const connected = new Set<string>();

        for (const edge of graph.edges) {

            connected.add(edge.source);
            connected.add(edge.target);

        }

        return {

            graph,

            metrics: {

                nodeCount: graph.nodes.length,

                edgeCount: graph.edges.length,

                isolatedNodeCount:
                    graph.nodes.filter(
                        n => !connected.has(n.id)
                    ).length

            },

            findings

        };

    }

}