import { ReportContext } from "../models";
import { MarkdownBuilder } from "./markdownBuilder";
import { MarkdownTemplate } from "../templates";

export class ReportBuilder {

    public build(

        template: MarkdownTemplate,

        context: ReportContext

    ): string {

        const builder = new MarkdownBuilder();

        template.build(builder, context);

        return builder.build();

    }

}