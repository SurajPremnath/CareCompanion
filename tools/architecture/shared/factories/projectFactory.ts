import { existsSync } from "node:fs";

import { Project, ts } from "ts-morph";

import { AnalyzerConfiguration } from "../../phase1-bootstrap/config";
import { BootstrapError } from "../errors/bootstrapError";

export class ProjectFactory {

    public createProject(
        configuration: AnalyzerConfiguration
    ): Project {

        this.validateConfiguration(
            configuration
        );

        try {

            return new Project({

                tsConfigFilePath:
                    configuration.tsConfigPath,

                skipAddingFilesFromTsConfig: false,

                skipFileDependencyResolution: false,

                manipulationSettings: {

                    indentationText:
                        ts.IndentStyle.Smart

                }

            });

        }
        catch (error) {

            throw BootstrapError.project(

                "Unable to initialize ts-morph project.",

                error

            );

        }

    }

    private validateConfiguration(
        configuration: AnalyzerConfiguration
    ): void {

        if (
            !configuration.tsConfigPath
        ) {

            throw BootstrapError.configuration(

                "tsConfigPath is missing."

            );

        }

        if (
            !existsSync(
                configuration.tsConfigPath
            )
        ) {

            throw BootstrapError.tsConfig(

                `tsconfig not found: ${configuration.tsConfigPath}`

            );

        }

        if (
            !configuration.rootDirectory
        ) {

            throw BootstrapError.configuration(

                "rootDirectory is missing."

            );

        }

        if (
            !configuration.outputDirectory
        ) {

            throw BootstrapError.configuration(

                "outputDirectory is missing."

            );

        }

    }

}