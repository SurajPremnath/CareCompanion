import {
    ClassDeclaration,
    EnumDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    SourceFile,
    TypeAliasDeclaration,
    VariableDeclaration
} from "ts-morph";

import { ParsedFile } from "./parsedFile";
import { ParserError } from "./parserError";
import { ParserStatistics } from "./parserStatistics";

export interface ParserArtifacts {

    readonly sourceFiles: readonly SourceFile[];

    readonly classes: readonly ClassDeclaration[];

    readonly interfaces: readonly InterfaceDeclaration[];

    readonly functions: readonly FunctionDeclaration[];

    readonly enums: readonly EnumDeclaration[];

    readonly typeAliases: readonly TypeAliasDeclaration[];

    readonly variables: readonly VariableDeclaration[];

}

export interface ParserResult {

    readonly files: readonly ParsedFile[];

    readonly artifacts: ParserArtifacts;

    readonly statistics: ParserStatistics;

    readonly errors: readonly ParserError[];

    readonly success: boolean;

}