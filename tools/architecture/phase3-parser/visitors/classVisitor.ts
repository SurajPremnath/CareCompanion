import {
    ClassDeclaration,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class ClassVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isClassDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addClass(
            node as ClassDeclaration
        );

    }

}