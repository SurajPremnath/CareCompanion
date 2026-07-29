import {
    ExportDeclaration,
    Node
} from "ts-morph";

import { BaseVisitor } from "./baseVisitor";

export class ExportVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isExportDeclaration(
            node
        );

    }

    public override visit(
        node: Node
    ): void {

        this.visitExport(

            node as ExportDeclaration

        );

    }

    private visitExport(
        declaration: ExportDeclaration
    ): void {

        //
        // Parser responsibility:
        // recognize export nodes.
        //

        declaration.getModuleSpecifierValue();

    }

}