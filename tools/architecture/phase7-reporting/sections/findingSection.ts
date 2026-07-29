import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";
import { ReportSection } from "./reportSection";

export class FindingSection
    implements ReportSection {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h2("Findings");

        builder.bullets(

            context.findings.map(f =>

                `[${f.severity}] ${f.title}`

            )

        );

    }

}