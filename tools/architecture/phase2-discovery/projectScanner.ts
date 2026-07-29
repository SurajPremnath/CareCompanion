import { AnalyzerConfiguration } from "../phase1-bootstrap/config";

import { DirectoryWalker } from "./directoryWalker";
import { FileDiscovery } from "./fileDiscovery";
import { FileClassifier } from "./fileClassifier";
import { IgnoreMatcher } from "./ignoreMatcher";
import { ModuleDiscovery } from "./moduleDiscovery";

export interface DiscoveredProject {

    readonly files: readonly DiscoveredFile[];

    readonly modules: readonly DiscoveredModule[];

}

export interface DiscoveredFile {

    readonly absolutePath: string;

    readonly relativePath: string;

    readonly extension: string;

    readonly module: string;

    readonly isSourceFile: boolean;

    readonly isTestFile: boolean;

    readonly isDeclarationFile: boolean;

}

export interface DiscoveredModule {

    readonly name: string;

    readonly rootDirectory: string;

    readonly files: readonly string[];

}

export class ProjectScanner {

    private readonly directoryWalker =
        new DirectoryWalker();

    private readonly ignoreMatcher =
        new IgnoreMatcher();

    private readonly fileDiscovery =
        new FileDiscovery();

    private readonly fileClassifier =
        new FileClassifier();

    private readonly moduleDiscovery =
        new ModuleDiscovery();

    constructor(
        private readonly configuration: AnalyzerConfiguration
    ) {}

    public async scan(): Promise<DiscoveredProject> {

        //
        // Walk project directories
        //

        const entries =
            await this.directoryWalker.walk(

                this.configuration.rootDirectory,

                this.ignoreMatcher

            );

        //
        // Discover supported source files
        //

        const discoveredFiles =
            this.fileDiscovery.discover(

                entries,

                this.configuration

            );

        //
        // Enrich with metadata
        //

        const classifiedFiles =
            discoveredFiles.map(file =>

                this.fileClassifier.classify(
                    file
                )

            );

        //
        // Discover logical modules
        //

        const modules =
            this.moduleDiscovery.discover(

                classifiedFiles

            );

        return {

            files: classifiedFiles,

            modules

        };

    }

}