import { readdirSync } from "fs";
import { join } from "path";

import { ExportEngine } from "../contracts";

import {
    ExportArtifactBuilder
} from "../builders";

import {
    ExportResult
} from "../models";

import {
    AnalysisResult
} from "../../phase6-analysis";

export class DefaultExportEngine
    implements ExportEngine {

    public constructor(

        private readonly artifactBuilder:
            ExportArtifactBuilder

    ) {}

    public async export(

        analysis: AnalysisResult,

        outputDirectory: string

    ): Promise<ExportResult> {

        const artifacts = readdirSync(

            outputDirectory

        ).map(file =>

            this.artifactBuilder.build(

                join(outputDirectory, file)

            )

        );

        return {

            artifacts

        };

    }

}