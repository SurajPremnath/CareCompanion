import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";

import { MarkdownTemplate } from "./markdownTemplate";

import {
    ProjectSummarySection,
    MetricsSection,
    RecommendationSection
} from "../sections";

export class TechnicalCharterTemplate
    extends MarkdownTemplate {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h1("Technical Charter");

        new ProjectSummarySection()
            .build(builder, context);

        new MetricsSection()
            .build(builder, context);

        new RecommendationSection()
            .build(builder, context);

    }

}