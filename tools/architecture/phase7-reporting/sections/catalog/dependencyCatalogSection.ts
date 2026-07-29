import { CatalogSection } from "./catalogSection";
import { ReportContext } from "../../models";

export class DependencyCatalogSection
    extends CatalogSection<string> {

    protected title(): string {

        return "Dependencies";

    }

    protected items(
        context: ReportContext
    ): string[] {

        return context.knowledge.dependencies.map(

            d => `${d.source} → ${d.target}`

        );

    }

}