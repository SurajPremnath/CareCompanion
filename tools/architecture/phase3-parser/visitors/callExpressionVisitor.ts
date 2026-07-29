import {
    CallExpression,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class CallExpressionVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isCallExpression(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addCallExpression(
            node as CallExpression
        );

    }

}