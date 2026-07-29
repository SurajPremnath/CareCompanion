import { writeFileSync } from "fs";
import { join } from "path";

import { ReportGenerator } from "../contracts/reportGenerator";
import { ReportContext } from "../models";
import { MarkdownBuilder } from "../builders/markdownBuilder";

export class ValidationReportGenerator
    implements ReportGenerator {

    public async generate(
        context: ReportContext
    ): Promise<void> {

        const markdown = new MarkdownBuilder()

            .h1("Validation Report")

            .table(
                ["Category", "Count"],
                [
                    ["Passed", String(context.validation.summary.passed)],
                    ["Warnings", String(context.validation.summary.warnings)],
                    ["Errors", String(context.validation.summary.errors)]
                ]
            )

            .h2("Findings")

            .bullets(

                context.validation.findings.map(

                    finding =>
                        `[${finding.severity}] ${finding.title}`

                )

            )

            .build();

        writeFileSync(

            join(
                context.outputDirectory,
                "VALIDATION_REPORT.md"
            ),

            markdown

        );

    }

}