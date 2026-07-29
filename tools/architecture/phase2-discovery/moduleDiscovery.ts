import path from "node:path";

import {
    DiscoveredFile,
    DiscoveredModule
} from "./projectScanner";

export class ModuleDiscovery {

    public discover(
        files: readonly DiscoveredFile[]
    ): readonly DiscoveredModule[] {

        const modules =
            new Map<string, Set<string>>();

        for (const file of files) {

            const moduleName =
                this.resolveModuleName(file);

            if (
                !modules.has(moduleName)
            ) {

                modules.set(
                    moduleName,
                    new Set<string>()
                );

            }

            modules
                .get(moduleName)!
                .add(file.absolutePath);

        }

        return [...modules.entries()]
            .map(([name, moduleFiles]) => ({

                name,

                rootDirectory:
                    this.resolveRootDirectory(
                        [...moduleFiles]
                    ),

                files:
                    [...moduleFiles]
                        .sort()

            }))
            .sort((a, b) =>
                a.name.localeCompare(
                    b.name
                )
            );

    }

    private resolveModuleName(
        file: DiscoveredFile
    ): string {

        if (
            file.module &&
            file.module !== "root"
        ) {

            return file.module;

        }

        const segments =
            file.relativePath
                .split(/[\\/]/)
                .filter(Boolean);

        if (segments.length === 0) {

            return "root";

        }

        return segments[0];

    }

    private resolveRootDirectory(
        files: readonly string[]
    ): string {

        if (files.length === 0) {

            return "";

        }

        return path.dirname(
            files[0]
        );

    }

}