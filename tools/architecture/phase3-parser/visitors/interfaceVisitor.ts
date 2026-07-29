import {
    InterfaceDeclaration,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class InterfaceVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isInterfaceDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addInterface(
            node as InterfaceDeclaration
        );

    }

}