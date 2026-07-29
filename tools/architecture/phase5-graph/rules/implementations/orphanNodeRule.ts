import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRule } from "../rules/contracts/graphRule";
import { GraphRuleResult } from "../rules/contracts/graphRuleResult";

export class OrphanNodeRule
    implements GraphRule {

    public evaluate(
        graph: DependencyGraph
    ): GraphRuleResult {

        const connected = new Set<string>();

        for (const edge of graph.edges) {

            connected.add(edge.source);
            connected.add(edge.target);

        }

        const findings: Finding[] = graph.nodes
            .filter(node => !connected.has(node.id))
            .map(node => ({
                id: `ORPHAN_${node.id}`,
                category: "Graph",
                severity: "Warning",
                message: `${node.name} has no dependencies.`
            }));

        return {
            findings
        };

    }

}