import { Node } from "ts-morph";

import {
    SemanticSymbolKind,
    SymbolId
} from "../models";

export class SymbolFactory {

    public static createId(
        filePath: string,
        kind: SemanticSymbolKind,
        name: string,
        parentName?: string
    ): SymbolId {

        const normalizedPath =
            SymbolFactory.normalize(filePath);

        const normalizedName =
            SymbolFactory.normalize(name);

        const normalizedKind =
            kind.toString().toLowerCase();

        const parent =
            parentName
                ? `${SymbolFactory.normalize(parentName)}::`
                : "";

        return `${normalizedPath}::${parent}${normalizedKind}::${normalizedName}`;
    }

    public static createIdFromNode(
        node: Node,
        kind: SemanticSymbolKind,
        name: string,
        parentName?: string
    ): SymbolId {

        return SymbolFactory.createId(
            node.getSourceFile().getFilePath(),
            kind,
            name,
            parentName
        );
    }

    private static normalize(
        value: string
    ): string {

        return value
            .replace(/\\/g, "/")
            .replace(/\s+/g, "")
            .trim();
    }

    private constructor() {
        // Static factory
    }

}