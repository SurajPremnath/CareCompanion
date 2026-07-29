import {
    TypeAliasDeclaration
} from "ts-morph";

import {
    SemanticSymbolKind,
    TypeAliasModel,
    Visibility
} from "../models";

import { SourceLocationFactory } from "./sourceLocationFactory";
import { SymbolFactory } from "./symbolFactory";

export class TypeAliasFactory {

    public static create(
        declaration: TypeAliasDeclaration
    ): TypeAliasModel {

        return {

            id: SymbolFactory.createIdFromNode(
                declaration,
                SemanticSymbolKind.TypeAlias,
                declaration.getName()
            ),

            name:
                declaration.getName(),

            kind:
                SemanticSymbolKind.TypeAlias,

            exported:
                declaration.isExported(),

            visibility:
                Visibility.Public,

            range:
                SourceLocationFactory.fromNode(
                    declaration
                ),

            typeText:
                declaration
                    .getTypeNodeOrThrow()
                    .getText()
        };
    }

    public static isUnion(
        model: TypeAliasModel
    ): boolean {

        return model.typeText.includes("|");
    }

    public static isIntersection(
        model: TypeAliasModel
    ): boolean {

        return model.typeText.includes("&");
    }

    public static isMappedType(
        model: TypeAliasModel
    ): boolean {

        return (
            model.typeText.includes("[") &&
            model.typeText.includes("]")
        );
    }

    public static isConditionalType(
        model: TypeAliasModel
    ): boolean {

        return (
            model.typeText.includes("extends") &&
            model.typeText.includes("?")
        );
    }

    public static isFunctionType(
        model: TypeAliasModel
    ): boolean {

        return model.typeText.includes("=>");
    }

    public static isPrimitiveAlias(
        model: TypeAliasModel
    ): boolean {

        return [

            "string",
            "number",
            "boolean",
            "bigint",
            "symbol",
            "unknown",
            "any",
            "never",
            "void",
            "null",
            "undefined"

        ].includes(
            model.typeText.trim()
        );
    }

    private constructor() {
        // Static factory only.
    }

}