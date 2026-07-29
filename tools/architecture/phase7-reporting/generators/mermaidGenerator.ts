import { writeFileSync } from "fs";
import { join } from "path";

import { ReportGenerator } from "../contracts/reportGenerator";
import { ReportContext } from "../models";

export class MermaidGenerator
    implements ReportGenerator {

    public async generate(
        context: ReportContext
    ): Promise<void> {

        const lines: string[] = [];

        lines.push("graph TD");

        context.knowledge.dependencies.forEach(dependency => {

            lines.push(
                `"${dependency.source}" --> "${dependency.target}"`
            );

        });

        writeFileSync(

            join(
                context.outputDirectory,
                "DEPENDENCY_GRAPH.mmd"
            ),

            lines.join("\n")

        );

    }

}