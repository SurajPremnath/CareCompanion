import {
    SemanticDependency,
    SemanticSymbol
} from ".";

export interface SemanticModule {

    readonly name: string;

    readonly rootDirectory: string;

    readonly symbols: readonly SemanticSymbol[];

    readonly dependencies: readonly SemanticDependency[];

}