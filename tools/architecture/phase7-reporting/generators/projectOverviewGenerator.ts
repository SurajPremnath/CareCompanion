import { join } from "path";

import { ReportGenerator } from "../contracts";
import { ReportContext } from "../models";

import {
    ReportBuilder
} from "../builders";

import {
    ProjectOverviewTemplate
} from "../templates";

import {
    MarkdownWriter
} from "../writers";

export class ProjectOverviewGenerator
    implements ReportGenerator {

    public constructor(

        private readonly builder: ReportBuilder,

        private readonly writer: MarkdownWriter

    ) {}

    public async generate(
        context: ReportContext
    ): Promise<void> {

        const markdown =
            this.builder.build(

                new ProjectOverviewTemplate(),

                context

            );

        this.writer.write(

            join(

                context.outputDirectory,

                "PROJECT_OVERVIEW.md"

            ),

            markdown

        );

    }

}