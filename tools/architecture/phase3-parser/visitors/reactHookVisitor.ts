import {
    CallExpression,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class ReactHookVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        if (!Node.isCallExpression(node)) {

            return false;

        }

        const expression =
            node.getExpression();

        return (

            Node.isIdentifier(expression)

            &&

            expression
                .getText()
                .startsWith("use")

        );

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addReactHook(
    node as CallExpression
);

    }

}