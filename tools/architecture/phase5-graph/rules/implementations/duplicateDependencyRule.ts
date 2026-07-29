import { Finding } from "../../core";
import { DependencyGraph } from "../models/dependencyGraph";
import { GraphRule } from "../contracts/graphRule";
import { GraphRuleResult } from "../contracts/graphRuleResult";

export class DuplicateDependencyRule
    implements GraphRule {

    public evaluate(
        graph: DependencyGraph
    ): GraphRuleResult {

        const findings: Finding[] = [];
        const seen = new Set<string>();

        for (const edge of graph.edges) {

            const key =
                `${edge.source}->${edge.target}:${edge.type}`;

            if (seen.has(key)) {

                findings.push({

                    id: `DUPLICATE_${key}`,

                    category: "Graph",

                    severity: "Warning",

                    message:
                        `Duplicate dependency '${key}'.`

                });

                continue;

            }

            seen.add(key);

        }

        return {

            findings

        };

    }

}