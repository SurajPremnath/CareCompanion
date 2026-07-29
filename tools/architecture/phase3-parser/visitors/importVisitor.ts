import {
    ImportDeclaration,
    Node
} from "ts-morph";

import { BaseVisitor } from "./baseVisitor";

export class ImportVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isImportDeclaration(
            node
        );

    }

    public override visit(
        node: Node
    ): void {

        this.visitImport(

            node as ImportDeclaration

        );

    }

    private visitImport(
        declaration: ImportDeclaration
    ): void {

        //
        // Parser responsibility:
        // recognize import nodes only.
        //

        declaration.getModuleSpecifierValue();

    }

}