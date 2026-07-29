import {
    Node,
    TypeAliasDeclaration
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class TypeAliasVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isTypeAliasDeclaration(node);

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addTypeAlias(
            node as TypeAliasDeclaration
        );

    }

}