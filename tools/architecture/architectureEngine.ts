import { ArchitectureContext } from "./core/pipeline/architectureContext";
import { ArchitecturePipeline } from "./core/pipeline/architecturePipeline";

export class ArchitectureEngine {

    public constructor(

        private readonly pipeline: ArchitecturePipeline

    ) {}

    public async analyze(

        rootDirectory: string,

        outputDirectory: string

    ): Promise<void> {

        const context: ArchitectureContext = {

            rootDirectory,

            outputDirectory

        };

        await this.pipeline.execute(
            context
        );

    }

}