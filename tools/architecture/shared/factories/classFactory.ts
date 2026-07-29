import {
    ClassDeclaration,
    Scope
} from "ts-morph";

import {
    ClassModel,
    ConstructorModel,
    DecoratorModel,
    MethodModel,
    PropertyModel,
    SemanticSymbolKind,
    Visibility
} from "../models";

import { SymbolFactory } from "./symbolFactory";
import { SourceLocationFactory } from "./sourceLocationFactory";

export class ClassFactory {

    public static create(
        declaration: ClassDeclaration,
        constructors: readonly ConstructorModel[],
        methods: readonly MethodModel[],
        properties: readonly PropertyModel[],
        decorators: readonly DecoratorModel[]
    ): ClassModel {

        return {

            id: SymbolFactory.createIdFromNode(
                declaration,
                SemanticSymbolKind.Class,
                declaration.getNameOrThrow()
            ),

            name:
                declaration.getNameOrThrow(),

            kind:
                SemanticSymbolKind.Class,

            exported:
                declaration.isExported(),

            visibility:
                this.getVisibility(declaration),

            range:
                SourceLocationFactory.fromNode(
                    declaration
                ),

            constructors,

            methods,

            properties,

            extends:
                declaration
                    .getExtends()
                    ?.getExpression()
                    .getText(),

            implements:
                declaration
                    .getImplements()
                    .map(i => i.getExpression().getText()),

            decorators
        };
    }

    private static getVisibility(
        declaration: ClassDeclaration
    ): Visibility {

        const scope =
            declaration.getScope();

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

    public static isAbstract(
        declaration: ClassDeclaration
    ): boolean {

        return declaration.isAbstract();
    }

    public static hasBaseClass(
        model: ClassModel
    ): boolean {

        return model.extends !== undefined;
    }

    public static implementsInterfaces(
        model: ClassModel
    ): boolean {

        return model.implements.length > 0;
    }

    public static hasDecorators(
        model: ClassModel
    ): boolean {

        return model.decorators.length > 0;
    }

    public static hasMethods(
        model: ClassModel
    ): boolean {

        return model.methods.length > 0;
    }

    public static hasProperties(
        model: ClassModel
    ): boolean {

        return model.properties.length > 0;
    }

    public static hasConstructors(
        model: ClassModel
    ): boolean {

        return model.constructors.length > 0;
    }

    private constructor() {
        // Static factory only.
    }

}