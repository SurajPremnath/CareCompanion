import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";
import { ReportSection } from "./reportSection";

export class RecommendationSection
    implements ReportSection {

    public build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void {

        builder.h2("Recommendations");

        builder.bullets(

            context.recommendations.map(r =>

                r.title

            )

        );

    }

}