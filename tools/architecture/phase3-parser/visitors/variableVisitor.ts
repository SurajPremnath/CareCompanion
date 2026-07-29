import {
    Node,
    VariableDeclaration
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class VariableVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isVariableDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addVariable(
            node as VariableDeclaration
        );

    }

}