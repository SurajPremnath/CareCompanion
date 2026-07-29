import {
    EnumDeclaration,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class EnumVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isEnumDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addEnum(
            node as EnumDeclaration
        );

    }

}