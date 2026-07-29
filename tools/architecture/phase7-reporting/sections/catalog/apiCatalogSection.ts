import { CatalogSection } from "./catalogSection";
import { ReportContext } from "../../models";

export class ApiCatalogSection
    extends CatalogSection<string> {

    protected title(): string {

        return "APIs";

    }

    protected items(
        context: ReportContext
    ): string[] {

        return context.knowledge.symbols

            .filter(s => s.kind === "Api")

            .map(s => s.name);

    }

}