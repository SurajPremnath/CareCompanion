import { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { BootstrapError } from "../shared/errors/bootstrapError";
import { IgnoreMatcher } from "./ignoreMatcher";

export class DirectoryWalker {

    public async walk(
        rootDirectory: string,
        ignoreMatcher: IgnoreMatcher
    ): Promise<readonly string[]> {

        const files: string[] = [];

        await this.walkDirectory(

            rootDirectory,

            rootDirectory,

            ignoreMatcher,

            files

        );

        return files;

    }

    private async walkDirectory(
        rootDirectory: string,
        currentDirectory: string,
        ignoreMatcher: IgnoreMatcher,
        files: string[]
    ): Promise<void> {

        let entries: Dirent[];

        try {

            entries = await readdir(

                currentDirectory,

                {
                    withFileTypes: true
                }

            );

        }
        catch (error) {

            throw BootstrapError.filesystem(

                `Unable to read directory '${currentDirectory}'.`,

                error

            );

        }

        for (const entry of entries) {

            const absolutePath =

                path.join(
                    currentDirectory,
                    entry.name
                );

            const relativePath =

                path.relative(
                    rootDirectory,
                    absolutePath
                );

            if (

                ignoreMatcher.shouldIgnore(
                    relativePath,
                    entry
                )

            ) {

                continue;

            }

            if (
                entry.isDirectory()
            ) {

                await this.walkDirectory(

                    rootDirectory,

                    absolutePath,

                    ignoreMatcher,

                    files

                );

                continue;

            }

            if (
                entry.isFile()
            ) {

                files.push(
                    absolutePath
                );

            }

        }

    }

}