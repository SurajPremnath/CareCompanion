import { existsSync, constants as FsConstants } from "node:fs";
import { mkdir, access } from "node:fs/promises";

import { Project } from "ts-morph";

import {
    AnalyzerConfiguration,
    analyzerConfiguration
} from "./config";

import { ProjectContext } from "./projectContext";

import { BootstrapError } from "../shared/errors/bootstrapError";
import { ProjectFactory } from "../shared/factories/projectFactory";

export class Bootstrapper {

    private readonly projectFactory: ProjectFactory;

    constructor(
        private readonly configuration: AnalyzerConfiguration = analyzerConfiguration,
        projectFactory?: ProjectFactory
    ) {
        this.projectFactory =
            projectFactory ??
            new ProjectFactory();
    }

    public async bootstrap(): Promise<ProjectContext> {

        this.validateConfiguration();

        await this.ensureOutputDirectory();

        const project =
            this.projectFactory.createProject(
                this.configuration
            );

        return this.createContext(project);
    }

    private createContext(
        project: Project
    ): ProjectContext {

        return {
            configuration: this.configuration,
            project,
            compilerOptions: project.getCompilerOptions(),
            typeChecker: project.getTypeChecker(),
            sourceRoot: this.configuration.rootDirectory,
            outputDirectory: this.configuration.outputDirectory,
            projectName: this.configuration.projectName,
            startedAt: new Date()
        };
    }

    private validateConfiguration(): void {

        if (!this.configuration.rootDirectory) {
            throw BootstrapError.configuration(
                "rootDirectory is not configured."
            );
        }

        if (!this.configuration.outputDirectory) {
            throw BootstrapError.configuration(
                "outputDirectory is not configured."
            );
        }

        if (!this.configuration.tsConfigPath) {
            throw BootstrapError.configuration(
                "tsConfigPath is not configured."
            );
        }
    }

    private async ensureOutputDirectory(): Promise<void> {

        try {

            if (!existsSync(this.configuration.outputDirectory)) {

                await mkdir(
                    this.configuration.outputDirectory,
                    {
                        recursive: true
                    }
                );
            }

            await access(
                this.configuration.outputDirectory,
                FsConstants.W_OK
            );

        } catch (error) {

            throw BootstrapError.filesystem(
                `Unable to prepare output directory '${this.configuration.outputDirectory}'.`,
                error
            );
        }
    }
}