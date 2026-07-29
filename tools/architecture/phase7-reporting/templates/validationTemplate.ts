import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";

import { MarkdownTemplate } from "./markdownTemplate";

import {
    MetricsSection,
    FindingSection
} from "../sections";

export class ValidationTemplate
    extends MarkdownTemplate {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h1("Validation Report");

        new MetricsSection()
            .build(builder, context);

        new FindingSection()
            .build(builder, context);

    }

}