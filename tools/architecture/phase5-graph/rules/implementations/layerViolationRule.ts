import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRule } from "../contracts/graphRule";
import { GraphRuleResult } from "../contracts/graphRuleResult";

export class LayerViolationRule
    implements GraphRule {

    public evaluate(
        graph: DependencyGraph
    ): GraphRuleResult {

        const findings: Finding[] = [];

        const nodes = new Map(
            graph.nodes.map(node => [
                node.id,
                node
            ])
        );

        for (const edge of graph.edges) {

            const source = nodes.get(edge.source);

            const target = nodes.get(edge.target);

            if (
                !source ||
                !target
            ) {

                continue;

            }

            if (
                source.kind === "Repository" &&
                target.kind === "Page"
            ) {

                findings.push({

                    id:
                        `LAYER_${source.id}_${target.id}`,

                    category: "Architecture",

                    severity: "Error",

                    message:
                        `${source.name} should not depend on ${target.name}.`

                });

            }

        }

        return {

            findings

        };

    }

}