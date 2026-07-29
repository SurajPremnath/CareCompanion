import { MarkdownBuilder } from "../builders/markdownBuilder";
import { ReportContext } from "../contracts";
import { ReportSection } from "./reportSection";

export class ProjectSummarySection
    implements ReportSection {

    public build(
        builder: MarkdownBuilder,
        context: ReportContext
    ): void {

        builder
            .h2("Project Summary")
            .bullets([
                `Name: ${context.model.project.name}`,
                `Framework: ${context.model.project.framework}`,
                `Language: ${context.model.project.language}`,
                `Database: ${context.model.project.database ?? "N/A"}`,
                `Modules: ${context.model.modules.length}`,
                `Files: ${context.model.metrics.fileCount}`
            ]);

    }

}