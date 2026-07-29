import { Project } from "ts-morph";

import { DiscoveredFile } from "../phase2-discovery";

import { ParserArtifacts } from "./models";
import { ParserEngine } from "./parserEngine";

import { TsMorphParser } from "./parser/parser";

export class DefaultParserEngine
    implements ParserEngine {

    public async parse(
        files: readonly DiscoveredFile[]
    ): Promise<ParserArtifacts> {

        const parser = new TsMorphParser();

        const project = new Project({
            tsConfigFilePath: "tsconfig.json"
        });

        const result = parser.parse({

            project: {
                project
            },

            discovery: {
                files,
                modules: []
            }

        });

        return result.artifacts;

    }

}