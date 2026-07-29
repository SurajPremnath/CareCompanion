import {
    SemanticDependency,
    SemanticModule,
    SemanticSymbol
} from "../models";

export interface ModuleResolver {

    resolve(
        symbols: readonly SemanticSymbol[],
        dependencies: readonly SemanticDependency[]
    ): readonly SemanticModule[];

}