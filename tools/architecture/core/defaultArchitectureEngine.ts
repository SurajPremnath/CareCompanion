import { ArchitectureEngine } from "./architectureEngine";
import { ArchitecturePipeline } from "./pipeline";
import {
    ArchitectureConfiguration,
    ArchitectureContext
} from "./pipeline";

import path from "node:path";

export class DefaultArchitectureEngine
    implements ArchitectureEngine {

    constructor(
        private readonly pipeline: ArchitecturePipeline
    ) {}

    public async analyze(): Promise<void> {

const rootDirectory = process.cwd();

const configuration: ArchitectureConfiguration = {

    projectName: path.basename(rootDirectory),

    rootDirectory,

    sourceDirectory: path.join(
        rootDirectory,
        "src"
    ),

    outputDirectory: path.join(
        rootDirectory,
        "architecture-output"
    ),

    tsConfigPath: path.join(
        rootDirectory,
        "tsconfig.json"
    ),

    includePatterns: [
        "**/*.ts",
        "**/*.tsx"
    ],

    excludePatterns: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/coverage/**",
        "**/build/**"
    ],

    supportedExtensions: [
        ".ts",
        ".tsx"
    ],

    followSymlinks: false,

    ignoreNodeModules: true,

    ignoreDist: true,

    ignoreCoverage: true,

    ignoreBuild: true

};

        const context: ArchitectureContext = {
            configuration
        };

        await this.pipeline.execute(context);

    }
}