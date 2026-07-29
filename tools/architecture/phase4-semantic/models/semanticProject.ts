import {
    SemanticDependency,
    SemanticModule,
    SemanticSymbol
} from ".";

export interface SemanticProject {

    readonly name: string;

    readonly rootDirectory: string;

    readonly modules: readonly SemanticModule[];

    readonly symbols: readonly SemanticSymbol[];

    readonly dependencies: readonly SemanticDependency[];

}