import { ModuleResolver } from "../resolvers";

import {
    SemanticDependency,
    SemanticModule,
    SemanticSymbol
} from "../models";

export class DefaultModuleResolver
    implements ModuleResolver {

    public resolve(
        symbols: readonly SemanticSymbol[],
        dependencies: readonly SemanticDependency[]
    ): readonly SemanticModule[] {

        const moduleMap =
            new Map<string, SemanticModule>();

        for (const symbol of symbols) {

            let module =
                moduleMap.get(symbol.module);

            if (!module) {

                module = {

                    name:
                        this.getModuleName(
                            symbol.module
                        ),

                    rootDirectory:
                        symbol.module,

                    symbols: [],

                    dependencies: []

                };

                moduleMap.set(
                    symbol.module,
                    module
                );

            }

            (module.symbols as SemanticSymbol[])
                .push(symbol);

        }

        for (const dependency of dependencies) {

            const module =
                moduleMap.get(dependency.source);

            if (!module) {
                continue;
            }

            (module.dependencies as SemanticDependency[])
                .push(dependency);

        }

        return [...moduleMap.values()];

    }

    private getModuleName(
        directory: string
    ): string {

        const parts =
            directory.split(/[\\/]/);

        return parts.length === 0
            ? directory
            : parts[parts.length - 1];

    }

}