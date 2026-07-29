import {
    NewExpression,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class ObjectCreationVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isNewExpression(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addObjectCreation(
            node as NewExpression
        );

    }

}