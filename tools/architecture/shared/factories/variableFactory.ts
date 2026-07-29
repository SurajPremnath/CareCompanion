import {
    Scope,
    VariableDeclaration,
    VariableStatement
} from "ts-morph";

import {
    SemanticSymbolKind,
    VariableModel,
    Visibility
} from "../models";

import { SourceLocationFactory } from "./sourceLocationFactory";
import { SymbolFactory } from "./symbolFactory";

export class VariableFactory {

    public static create(
        declaration: VariableDeclaration
    ): VariableModel {

        const statement =
            declaration.getFirstAncestorByKindOrThrow(
                tsMorph.SyntaxKind.VariableStatement
            );

        const declarationList =
            statement.getDeclarationList();

        return {

            id: SymbolFactory.createIdFromNode(
                declaration,
                declarationList.isConst()
                    ? SemanticSymbolKind.Constant
                    : SemanticSymbolKind.Variable,
                declaration.getName()
            ),

            name:
                declaration.getName(),

            kind:
                declarationList.isConst()
                    ? SemanticSymbolKind.Constant
                    : SemanticSymbolKind.Variable,

            exported:
                statement.isExported(),

            visibility:
                this.getVisibility(statement),

            range:
                SourceLocationFactory.fromNode(
                    declaration
                ),

            type:
                declaration
                    .getType()
                    .getText(declaration),

            constant:
                declarationList.isConst()
        };
    }

    private static getVisibility(
        statement: VariableStatement
    ): Visibility {

        const scope =
            statement.getScope();

        switch (scope) {

            case Scope.Public:
                return Visibility.Public;

            case Scope.Protected:
                return Visibility.Protected;

            case Scope.Private:
                return Visibility.Private;

            default:
                return Visibility.Unknown;
        }
    }

    public static isConstant(
        model: VariableModel
    ): boolean {

        return model.constant;
    }

    public static isVariable(
        model: VariableModel
    ): boolean {

        return !model.constant;
    }

    public static hasExplicitType(
        declaration: VariableDeclaration
    ): boolean {

        return declaration.getTypeNode() !== undefined;
    }

    public static hasInitializer(
        declaration: VariableDeclaration
    ): boolean {

        return declaration.getInitializer() !== undefined;
    }

    public static initializerText(
        declaration: VariableDeclaration
    ): string | undefined {

        return declaration
            .getInitializer()
            ?.getText();
    }

    private constructor() {
        // Static factory only.
    }

}