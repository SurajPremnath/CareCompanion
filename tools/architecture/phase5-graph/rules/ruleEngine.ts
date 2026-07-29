import { Finding } from "../../core";
import { DependencyGraph } from "./models/dependencyGraph";
import { GraphRule } from "./rules/contracts/graphRule";

export class GraphRuleEngine {

    public constructor(
        private readonly rules: readonly GraphRule[]
    ) {}

    public evaluate(
        graph: DependencyGraph
    ): readonly Finding[] {

        const findings: Finding[] = [];

        for (const rule of this.rules) {

            findings.push(
                ...rule.evaluate(graph).findings
            );

        }

        return findings;

    }

}