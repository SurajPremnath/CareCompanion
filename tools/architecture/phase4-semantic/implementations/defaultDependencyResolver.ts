import { DependencyResolver } from "../resolvers";

import {
    SemanticDependency,
    SemanticSymbol
} from "../models";

export class DefaultDependencyResolver
    implements DependencyResolver {

    public resolve(
        symbols: readonly SemanticSymbol[]
    ): readonly SemanticDependency[] {

        const dependencies: SemanticDependency[] = [];

        const symbolLookup =
            new Map<string, SemanticSymbol>();

        for (const symbol of symbols) {

            symbolLookup.set(
                symbol.qualifiedName,
                symbol
            );

        }

        for (const symbol of symbols) {

            if (!symbolLookup.has(symbol.qualifiedName)) {
                continue;
            }

            dependencies.push({

                source: symbol.module,

                target: symbol.file,

                type: "contains"

            });

        }

        return dependencies;

    }

}