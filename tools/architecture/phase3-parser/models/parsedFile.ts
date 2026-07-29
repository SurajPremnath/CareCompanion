import { SourceFile } from "ts-morph";

import {
    DiscoveredFile
} from "../../phase2-discovery";

export interface ParsedFile {

    readonly sourceFile: SourceFile;

    readonly discoveredFile: DiscoveredFile;

}