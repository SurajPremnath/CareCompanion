import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";
import { ReportSection } from "./reportSection";

export class TocSection
    implements ReportSection {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h2("Contents");

        builder.bullets([

            "Project Summary",

            "Metrics",

            "Modules",

            "Files",

            "Dependencies",

            "Findings",

            "Recommendations"

        ]);

    }

}