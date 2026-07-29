import {
    InterfaceDeclaration
} from "ts-morph";

import {
    InterfaceModel,
    MethodSignatureModel,
    PropertySignatureModel,
    SemanticSymbolKind,
    Visibility
} from "../models";

import { SymbolFactory } from "./symbolFactory";
import { SourceLocationFactory } from "./sourceLocationFactory";

export class InterfaceFactory {

    public static create(
        declaration: InterfaceDeclaration,
        methods: readonly MethodSignatureModel[],
        properties: readonly PropertySignatureModel[]
    ): InterfaceModel {

        return {

            id: SymbolFactory.createIdFromNode(
                declaration,
                SemanticSymbolKind.Interface,
                declaration.getName()
            ),

            name:
                declaration.getName(),

            kind:
                SemanticSymbolKind.Interface,

            exported:
                declaration.isExported(),

            visibility:
                Visibility.Public,

            range:
                SourceLocationFactory.fromNode(
                    declaration
                ),

            extends:
                declaration
                    .getExtends()
                    .map(type => type.getText()),

            methods,

            properties
        };
    }

    public static hasBaseInterfaces(
        model: InterfaceModel
    ): boolean {

        return model.extends.length > 0;
    }

    public static hasMethods(
        model: InterfaceModel
    ): boolean {

        return model.methods.length > 0;
    }

    public static hasProperties(
        model: InterfaceModel
    ): boolean {

        return model.properties.length > 0;
    }

    private constructor() {
        // Static factory only.
    }

}