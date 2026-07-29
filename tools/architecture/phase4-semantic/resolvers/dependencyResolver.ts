import {
    SemanticDependency,
    SemanticSymbol
} from "../models";

export interface DependencyResolver {

    resolve(
        symbols: readonly SemanticSymbol[]
    ): readonly SemanticDependency[];

}