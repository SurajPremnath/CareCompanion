import {
    Node,
    SourceFile
} from "ts-morph";

import {
    Visitor,
    Walker
} from "./contracts";

import {
    ParserCollector
} from "./models";

import {
    VisitorRegistry
} from "./visitors/visitorRegistry";

export class AstWalker
    implements Walker {

    private readonly visitors: readonly Visitor[];

    constructor(
        registry?: VisitorRegistry
    ) {

        this.visitors =

            registry?.getVisitors()

            ??

            new VisitorRegistry().getVisitors();

    }

    public walk(
        sourceFile: SourceFile,
        collector: ParserCollector
    ): void {

        this.walkNode(
            sourceFile,
            collector
        );

    }

    public walkFile(
        sourceFile: SourceFile,
        collector: ParserCollector
    ): void {

        this.walk(
            sourceFile,
            collector
        );

    }

    public walkNode(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addNode(node);

        for (const visitor of this.visitors) {

            if (!visitor.canVisit(node)) {

                continue;

            }

            visitor.visit(
                node,
                collector
            );

        }

        node.forEachChild(child =>

            this.walkNode(
                child,
                collector
            )

        );

    }

}