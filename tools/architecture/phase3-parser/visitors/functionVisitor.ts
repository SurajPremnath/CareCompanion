import {
    FunctionDeclaration,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class FunctionVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isFunctionDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addFunction(
            node as FunctionDeclaration
        );

    }

}