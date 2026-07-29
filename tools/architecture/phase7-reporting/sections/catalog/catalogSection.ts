import { MarkdownBuilder } from "../../builders/markdownBuilder";
import { ReportContext } from "../../contracts";
import { ReportSection } from "../reportSection";

export abstract class CatalogSection<T>
    implements ReportSection {

    protected abstract title(): string;

    protected abstract headers(): readonly string[];

    protected abstract rows(
        context: ReportContext
    ): readonly (readonly string[])[];

    public build(
        builder: MarkdownBuilder,
        context: ReportContext
    ): void {

        builder
            .h2(this.title())
            .table(
                this.headers(),
                this.rows(context)
            );

    }

}