import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRule } from "../contracts/graphRule";
import { GraphRuleResult } from "../contracts/graphRuleResult";

export class CircularDependencyRule
    implements GraphRule {

    public evaluate(
        graph: DependencyGraph
    ): GraphRuleResult {

        const adjacency = new Map<string, string[]>();

        for (const node of graph.nodes) {

            adjacency.set(node.id, []);

        }

        for (const edge of graph.edges) {

            adjacency
                .get(edge.source)
                ?.push(edge.target);

        }

        const findings: Finding[] = [];

        const visited = new Set<string>();

        const stack = new Set<string>();

        const dfs = (
            node: string
        ): void => {

            if (stack.has(node)) {

                findings.push({

                    id: `CYCLE_${node}`,

                    category: "Graph",

                    severity: "Error",

                    message:
                        `Circular dependency detected involving '${node}'.`

                });

                return;

            }

            if (visited.has(node)) {

                return;

            }

            visited.add(node);

            stack.add(node);

            for (const child of adjacency.get(node) ?? []) {

                dfs(child);

            }

            stack.delete(node);

        };

        for (const node of graph.nodes) {

            dfs(node.id);

        }

        return {

            findings

        };

    }

}