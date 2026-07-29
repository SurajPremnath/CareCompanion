import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";

import { MarkdownTemplate } from "./markdownTemplate";

import {
    ProjectSummarySection,
    MetricsSection
} from "../sections";

export class ProjectOverviewTemplate
    extends MarkdownTemplate {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h1("Project Overview");

        new ProjectSummarySection()
            .build(builder, context);

        new MetricsSection()
            .build(builder, context);

    }

}