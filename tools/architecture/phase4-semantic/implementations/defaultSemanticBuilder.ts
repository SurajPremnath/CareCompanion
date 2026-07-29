import { ParserArtifacts } from "../../phase3-parser";

import { SemanticBuilder } from "../contracts";

import {
    SemanticDependency,
    SemanticModule,
    SemanticProject,
    SemanticSymbol
} from "../models";

import {
    DependencyResolver,
    ModuleResolver,
    SymbolResolver
} from "../resolvers";

export class DefaultSemanticBuilder
    implements SemanticBuilder {

constructor(
    private readonly symbolResolver: SymbolResolver,
    private readonly dependencyResolver: DependencyResolver,
    private readonly moduleResolver: ModuleResolver
) {}

    public build(
        artifacts: ParserArtifacts
    ): SemanticProject {

const symbols =
    this.symbolResolver.resolve(
        artifacts
    );

const dependencies =
    this.dependencyResolver.resolve(
        symbols
    );

const modules =
    this.moduleResolver.resolve(
        symbols,
        dependencies
    );

        return {

            name:
                artifacts.sourceFiles[0]
                    ?.getBaseName() ?? "Project",

            rootDirectory:
                artifacts.sourceFiles[0]
                    ?.getDirectoryPath() ?? "",

            modules,

            symbols,

            dependencies

        };

    }

}