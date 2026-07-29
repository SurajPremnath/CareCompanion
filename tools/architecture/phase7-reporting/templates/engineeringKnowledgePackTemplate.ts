import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";

import { MarkdownTemplate } from "./markdownTemplate";

import {
    TocSection,
    MetricsSection,
    FindingSection,
    RecommendationSection
} from "../sections";

import {
    ModuleCatalogSection,
    FileCatalogSection,
    ClassCatalogSection,
    DependencyCatalogSection
} from "../sections/catalog";

export class EngineeringKnowledgePackTemplate
    extends MarkdownTemplate {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h1("Engineering Knowledge Pack");

        new TocSection()
            .build(builder, context);

        new MetricsSection()
            .build(builder, context);

        new ModuleCatalogSection()
            .build(builder, context);

        new FileCatalogSection()
            .build(builder, context);

        new ClassCatalogSection()
            .build(builder, context);

        new DependencyCatalogSection()
            .build(builder, context);

        new FindingSection()
            .build(builder, context);

        new RecommendationSection()
            .build(builder, context);

    }

}