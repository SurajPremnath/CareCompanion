import { MarkdownBuilder } from "../builders/markdownBuilder";
import { ReportContext } from "../contracts";

export interface ReportSection {

    build(
        builder: MarkdownBuilder,
        context: ReportContext
    ): void;

}