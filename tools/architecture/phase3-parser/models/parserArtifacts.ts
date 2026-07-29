import {
    CallExpression,
    ClassDeclaration,
    EnumDeclaration,
    ExportDeclaration,
    FunctionDeclaration,
    ImportDeclaration,
    InterfaceDeclaration,
    JsxElement,
    JsxSelfClosingElement,
    NewExpression,
    SourceFile,
    TypeAliasDeclaration,
    VariableDeclaration
} from "ts-morph";

export interface ParserArtifacts {

    readonly sourceFiles: readonly SourceFile[];

    readonly imports: readonly ImportDeclaration[];

    readonly exports: readonly ExportDeclaration[];

    readonly classes: readonly ClassDeclaration[];

    readonly interfaces: readonly InterfaceDeclaration[];

    readonly functions: readonly FunctionDeclaration[];

    readonly variables: readonly VariableDeclaration[];

    readonly enums: readonly EnumDeclaration[];

    readonly typeAliases: readonly TypeAliasDeclaration[];

    readonly callExpressions: readonly CallExpression[];

    readonly reactHooks: readonly CallExpression[];

    readonly objectCreations: readonly NewExpression[];

    readonly jsxElements: readonly (
        JsxElement |
        JsxSelfClosingElement
    )[];

}