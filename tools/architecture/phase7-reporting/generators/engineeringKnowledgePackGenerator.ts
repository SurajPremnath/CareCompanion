import { writeFileSync } from "fs";
import { join } from "path";

import { ReportGenerator } from "../contracts/reportGenerator";
import { ReportContext } from "../models";
import { MarkdownBuilder } from "../builders/markdownBuilder";

export class EngineeringKnowledgePackGenerator
    implements ReportGenerator {

    public async generate(
        context: ReportContext
    ): Promise<void> {

        const markdown = new MarkdownBuilder()

            .h1("Engineering Knowledge Pack")

            .h2("Modules")

            .bullets(
                context.knowledge.modules.map(
                    module => module.name
                )
            )

            .h2("Architecture Findings")

            .bullets(
                context.findings.map(
                    finding => `${finding.severity} • ${finding.title}`
                )
            )

            .h2("Recommendations")

            .bullets(
                context.recommendations.map(
                    recommendation => recommendation.title
                )
            )

            .build();

        writeFileSync(
            join(
                context.outputDirectory,
                "ENGINEERING_KNOWLEDGE_PACK.md"
            ),
            markdown
        );

    }

}