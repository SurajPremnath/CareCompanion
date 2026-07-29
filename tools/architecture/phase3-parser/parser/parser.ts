import {
    Project,
    SourceFile
} from "ts-morph";

import {
    Parser as ParserContract
} from "../contracts";

import {
    ParserCollector,
    ParserContext,
    ParserError,
    ParserResult,
    ParserStatistics,
    ParsedFile
} from "../models";

import {
    AstWalker
} from "../astWalker";

import {
    VisitorRegistry
} from "../visitors/visitorRegistry";

export class TsMorphParser
    implements ParserContract {

    private readonly walker: AstWalker;

    constructor(
        registry?: VisitorRegistry
    ) {

        this.walker =

            new AstWalker(
                registry
            );

    }

    public parse(
        context: ParserContext
    ): ParserResult {

        const collector =
            new ParserCollector();

        const parsedFiles: ParsedFile[] = [];

        const errors: ParserError[] = [];

        const startedAt =
            new Date();

        for (const discoveredFile of context.discovery.files) {

            try {

                const sourceFile =

                    this.loadSourceFile(

                        context.project.project,

                        discoveredFile.absolutePath

                    );

                if (!sourceFile) {

                    errors.push({

                        filePath:
                            discoveredFile.absolutePath,

                        message:
                            "Source file could not be loaded.",

                        recoverable: true

                    });

                    continue;

                }

                collector.addSourceFile(
                    sourceFile
                );

                this.walker.walk(
                    sourceFile,
                    collector
                );

                parsedFiles.push({

                    sourceFile,

                    discoveredFile

                });

            }
            catch (error) {

                errors.push({

                    filePath:
                        discoveredFile.absolutePath,

                    message:
                        "Unexpected parser failure.",

                    error,

                    recoverable: true

                });

            }

        }

        const completedAt =
            new Date();

        const statistics: ParserStatistics = {

            totalFiles:
                context.discovery.files.length,

            parsedFiles:
                parsedFiles.length,

            skippedFiles:
                context.discovery.files.length
                -
                parsedFiles.length,

            totalNodesVisited:
                collector.getNodeCount(),

            parseErrors:
                errors.length,

            startedAt,

            completedAt,

            durationInMilliseconds:

                completedAt.getTime()

                -

                startedAt.getTime()

        };

        return {

            files:
                parsedFiles,

            artifacts:
                collector.buildArtifacts(),

            statistics,

            errors,

            success:
                errors.every(
                    error => error.recoverable
                )

        };

    }

    private loadSourceFile(
        project: Project,
        filePath: string
    ): SourceFile | undefined {

        return (

            project.getSourceFile(filePath)

            ??

            project.addSourceFileAtPathIfExists(
                filePath
            )

        );

    }

}