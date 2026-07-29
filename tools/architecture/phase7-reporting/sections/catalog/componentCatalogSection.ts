import { CatalogSection } from "./catalogSection";
import { ReportContext } from "../../models";

export class ComponentCatalogSection
    extends CatalogSection<string> {

    protected title(): string {

        return "Components";

    }

    protected items(
        context: ReportContext
    ): string[] {

        return context.knowledge.symbols

            .filter(s => s.kind === "Component")

            .map(s => s.name);

    }

}