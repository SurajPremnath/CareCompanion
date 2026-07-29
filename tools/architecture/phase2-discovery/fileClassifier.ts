import path from "node:path";

import {
    DiscoveredFile
} from "./projectScanner";

export class FileClassifier {

    public classify(
        absolutePath: string
    ): DiscoveredFile {

        const normalizedPath =
            absolutePath.replace(
                /\\/g,
                "/"
            );

        const extension =
            path.extname(
                normalizedPath
            );

        const fileName =
            path.basename(
                normalizedPath
            );

        const module =
            this.detectModule(
                normalizedPath
            );

        return {

            absolutePath:

                normalizedPath,

            relativePath:

                normalizedPath,

            extension,

            module,

            isSourceFile:
                this.isSourceFile(
                    fileName
                ),

            isTestFile:
                this.isTestFile(
                    fileName
                ),

            isDeclarationFile:
                this.isDeclarationFile(
                    fileName
                )

        };

    }

    private detectModule(
        file: string
    ): string {

        const segments =
            file.split("/");

        const srcIndex =
            segments.indexOf("src");

        if (

            srcIndex >= 0 &&
            srcIndex + 1 < segments.length

        ) {

            return segments[
                srcIndex + 1
            ];

        }

        return "root";

    }

    private isSourceFile(
        file: string
    ): boolean {

        return (

            file.endsWith(".ts") ||

            file.endsWith(".tsx")

        ) &&

        !this.isDeclarationFile(
            file
        );

    }

    private isTestFile(
        file: string
    ): boolean {

        return (

            file.endsWith(".test.ts") ||

            file.endsWith(".test.tsx") ||

            file.endsWith(".spec.ts") ||

            file.endsWith(".spec.tsx")

        );

    }

    private isDeclarationFile(
        file: string
    ): boolean {

        return file.endsWith(
            ".d.ts"
        );

    }

}