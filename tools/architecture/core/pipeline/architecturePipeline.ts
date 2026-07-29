import { ArchitectureContext } from "./architectureContext";

export interface ArchitecturePipeline {
    execute(
        context: ArchitectureContext
    ): Promise<void>;
}