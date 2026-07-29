import { MarkdownBuilder } from "../builders/markdownBuilder";
import { ReportContext } from "../contracts";
import { ReportSection } from "./reportSection";

export class MetricsSection
    implements ReportSection {

    public build(
        builder: MarkdownBuilder,
        context: ReportContext
    ): void {

        builder
            .h2("Metrics")
            .table(
                ["Metric", "Value"],
                [
                    ["Modules", context.model.metrics.moduleCount.toString()],
                    ["Files", context.model.metrics.fileCount.toString()],
                    ["Classes", context.model.metrics.classCount.toString()],
                    ["Functions", context.model.metrics.functionCount.toString()],
                    ["Components", context.model.metrics.componentCount.toString()],
                    ["Dependencies", context.model.metrics.dependencyCount.toString()]
                ]
            );

    }

}