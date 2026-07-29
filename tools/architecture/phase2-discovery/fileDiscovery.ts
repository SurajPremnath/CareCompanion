import path from "node:path";

import { AnalyzerConfiguration } from "../phase1-bootstrap/config";

export class FileDiscovery {

    public discover(
        files: readonly string[],
        configuration: AnalyzerConfiguration
    ): readonly string[] {

        return files.filter(file =>

            this.isSupportedFile(
                file,
                configuration
            )

        );

    }

    private isSupportedFile(
        file: string,
        configuration: AnalyzerConfiguration
    ): boolean {

        const extension =

            path.extname(file);

        if (

            !configuration.supportedExtensions.includes(
                extension
            )

        ) {

            return false;

        }

        const fileName =

            path.basename(file);

        //
        // Ignore declaration files
        //

        if (
            fileName.endsWith(".d.ts")
        ) {

            return false;

        }

        //
        // Ignore generated source maps
        //

        if (
            fileName.endsWith(".map")
        ) {

            return false;

        }

        return true;

    }

}