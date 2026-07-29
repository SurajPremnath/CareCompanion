import {
    Node,
    SourceFile
} from "ts-morph";

import { BaseVisitor } from "./baseVisitor";

export class FileVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return Node.isSourceFile(node);

    }

    public override visit(
        node: Node
    ): void {

        this.visitSourceFile(
            node as SourceFile
        );

    }

    private visitSourceFile(
        sourceFile: SourceFile
    ): void {

        //
        // Phase 3:
        // Parser only.
        //
        // Semantic extraction happens
        // in Phase 4.
        //

        sourceFile.getFilePath();

    }

}