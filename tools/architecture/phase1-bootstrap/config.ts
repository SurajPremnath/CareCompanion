import path from "node:path";

export interface AnalyzerConfiguration {

    readonly projectName: string;

    readonly rootDirectory: string;

    readonly sourceDirectory: string;

    readonly outputDirectory: string;

    readonly tsConfigPath: string;

    readonly includePatterns: readonly string[];

    readonly excludePatterns: readonly string[];

    readonly supportedExtensions: readonly string[];

    readonly followSymlinks: boolean;

    readonly ignoreNodeModules: boolean;

    readonly ignoreDist: boolean;

    readonly ignoreCoverage: boolean;

    readonly ignoreBuild: boolean;

}

const rootDirectory =
    process.cwd();

export const analyzerConfiguration: AnalyzerConfiguration = {

    projectName:

        path.basename(
            rootDirectory
        ),

    rootDirectory,

    sourceDirectory:

        path.join(
            rootDirectory,
            "src"
        ),

    outputDirectory:

        path.join(
            rootDirectory,
            "architecture-output"
        ),

    tsConfigPath:

        path.join(
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

Object.freeze(
    analyzerConfiguration
);