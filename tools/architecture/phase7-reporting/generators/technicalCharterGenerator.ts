import { writeFileSync } from "fs";
import { join } from "path";

import { ReportGenerator } from "../contracts/reportGenerator";
import { ReportContext } from "../models";
import { MarkdownBuilder } from "../builders/markdownBuilder";

export class TechnicalCharterGenerator
    implements ReportGenerator {

    public async generate(
        context: ReportContext
    ): Promise<void> {

        const markdown = new MarkdownBuilder()

            .h1("Technical Charter")

            .paragraph(
                "This document summarizes the current architecture of the project."
            )

            .table(
                ["Metric", "Value"],
                [
                    ["Modules", String(context.knowledge.modules.length)],
                    ["Files", String(context.knowledge.files.length)],
                    ["Dependencies", String(context.knowledge.dependencies.length)],
                    ["Validation Passed", String(context.validation.passed)]
                ]
            )

            .build();

        writeFileSync(
            join(
                context.outputDirectory,
                "TECHNICAL_CHARTER.md"
            ),
            markdown
        );

    }

}