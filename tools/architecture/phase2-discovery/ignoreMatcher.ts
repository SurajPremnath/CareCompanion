import { Dirent } from "node:fs";
import path from "node:path";

export class IgnoreMatcher {

    private static readonly ignoredDirectories =
        new Set<string>([

            "node_modules",

            ".git",

            ".next",

            ".turbo",

            ".vercel",

            "dist",

            "build",

            "coverage",

            ".idea",

            ".vscode",

            ".cache",

            "out"

        ]);

    private static readonly ignoredExtensions =
        new Set<string>([

            ".map",

            ".log"

        ]);

    public shouldIgnore(
        relativePath: string,
        entry: Dirent
    ): boolean {

        if (
            entry.name.startsWith(".") &&
            entry.name !== ".env"
        ) {

            return true;

        }

        if (
            entry.isDirectory()
        ) {

            return this.isIgnoredDirectory(
                entry.name
            );

        }

        return this.isIgnoredFile(
            relativePath,
            entry.name
        );

    }

    private isIgnoredDirectory(
        directory: string
    ): boolean {

        return IgnoreMatcher
            .ignoredDirectories
            .has(directory);

    }

    private isIgnoredFile(
        relativePath: string,
        fileName: string
    ): boolean {

        const extension =
            path.extname(
                fileName
            );

        if (

            IgnoreMatcher
                .ignoredExtensions
                .has(extension)

        ) {

            return true;

        }

        if (
            fileName.endsWith(".d.ts")
        ) {

            return true;

        }

        if (
            fileName.endsWith(".min.js")
        ) {

            return true;

        }

        if (
            relativePath.includes(
                "__snapshots__"
            )
        ) {

            return true;

        }

        if (
            relativePath.includes(
                "__generated__"
            )
        ) {

            return true;

        }

        return false;

    }

}