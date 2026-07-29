import { CatalogSection } from "./catalogSection";
import { ReportContext } from "../../models";

export class ClassCatalogSection
    extends CatalogSection<string> {

    protected title(): string {

        return "Classes";

    }

    protected items(
        context: ReportContext
    ): string[] {

        return context.knowledge.symbols

            .filter(s => s.kind === "Class")

            .map(s => s.name);

    }

}