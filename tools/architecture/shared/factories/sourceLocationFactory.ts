import {
    Node,
    SourceFile
} from "ts-morph";

import {
    SourceLocation
} from "../models";

export class SourceLocationFactory {

    public static fromNode(
        node: Node
    ): SourceLocation {

        const sourceFile = node.getSourceFile();

        const start = node.getStartLinePos();
        const end = node.getEnd();

        const startLocation =
            sourceFile.getLineAndColumnAtPos(start);

        const endLocation =
            sourceFile.getLineAndColumnAtPos(end);

        return {

            filePath: sourceFile.getFilePath(),

            start: {

                line: startLocation.line,

                column: startLocation.column,

                position: start
            },

            end: {

                line: endLocation.line,

                column: endLocation.column,

                position: end
            }
        };
    }

    public static fromSourceFile(
        sourceFile: SourceFile
    ): SourceLocation {

        const end = sourceFile.getEnd();

        const endLocation =
            sourceFile.getLineAndColumnAtPos(end);

        return {

            filePath: sourceFile.getFilePath(),

            start: {

                line: 1,

                column: 1,

                position: 0
            },

            end: {

                line: endLocation.line,

                column: endLocation.column,

                position: end
            }
        };
    }

    private constructor() {
        // Static factory only.
    }
}