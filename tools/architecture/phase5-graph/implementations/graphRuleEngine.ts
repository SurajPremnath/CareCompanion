import { GraphRule } from "../contracts/graphRule";

import {
    DependencyGraph,
    Finding
} from "../models";

export class GraphRuleEngine {

    public constructor(

        private readonly rules: GraphRule[]

    ) {}

    public evaluate(
        graph: DependencyGraph
    ): Finding[] {

        const findings: Finding[] = [];

        for (const rule of this.rules) {

            findings.push(
                ...rule.evaluate(graph)
            );

        }

        return findings;

    }

}