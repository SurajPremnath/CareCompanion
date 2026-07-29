import { statSync } from "fs";

import {
    ExportArtifact
} from "../models";

export class ExportArtifactBuilder {

    public build(
        path: string
    ): ExportArtifact {

        const stat = statSync(path);

        return {

            name: path.split(/[\\/]/).pop()!,

            path,

            size: stat.size

        };

    }

}