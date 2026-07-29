import {
    ImportDeclaration
} from "ts-morph";

import {
    ImportDefinition
} from "../models";

export class ImportFactory {

    public static create(
        declaration: ImportDeclaration
    ): ImportDefinition {

        return {

            moduleSpecifier:
                declaration.getModuleSpecifierValue(),

            isTypeOnly:
                declaration.isTypeOnly(),

            defaultImport:
                declaration
                    .getDefaultImport()
                    ?.getText(),

            namespaceImport:
                declaration
                    .getNamespaceImport()
                    ?.getText(),

            namedImports:
                declaration
                    .getNamedImports()
                    .map(importSpecifier =>
                        importSpecifier.getName()
                    ),

            resolvedFile:
                declaration
                    .getModuleSpecifierSourceFile()
                    ?.getFilePath()
        };
    }

    public static isRelativeImport(
        definition: ImportDefinition
    ): boolean {

        return (
            definition.moduleSpecifier.startsWith("./") ||
            definition.moduleSpecifier.startsWith("../")
        );
    }

    public static isPackageImport(
        definition: ImportDefinition
    ): boolean {

        return !this.isRelativeImport(
            definition
        );
    }

    public static hasNamedImports(
        definition: ImportDefinition
    ): boolean {

        return definition.namedImports.length > 0;
    }

    public static hasDefaultImport(
        definition: ImportDefinition
    ): boolean {

        return definition.defaultImport !== undefined;
    }

    public static hasNamespaceImport(
        definition: ImportDefinition
    ): boolean {

        return definition.namespaceImport !== undefined;
    }

    public static importsEntireModule(
        definition: ImportDefinition
    ): boolean {

        return (
            definition.namespaceImport !== undefined
        );
    }

    private constructor() {
        // Static factory only.
    }

}