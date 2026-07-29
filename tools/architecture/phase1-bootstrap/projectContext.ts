import { Project, TypeChecker, ts } from "ts-morph";

import { AnalyzerConfiguration } from "./config";

export interface ProjectContext {

    readonly configuration: AnalyzerConfiguration;

    readonly project: Project;

    readonly compilerOptions: ts.CompilerOptions;

    readonly typeChecker: TypeChecker;

    readonly projectName: string;

    readonly rootDirectory: string;

    readonly outputDirectory: string;

    readonly sourceRoot: string;

    readonly startedAt: Date;

}