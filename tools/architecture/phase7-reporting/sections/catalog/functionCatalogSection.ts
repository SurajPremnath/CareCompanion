import { CatalogSection } from "./catalogSection";
import { ReportContext } from "../../models";

export class FunctionCatalogSection
    extends CatalogSection<string> {

    protected title(): string {

        return "Functions";

    }

    protected items(
        context: ReportContext
    ): string[] {

        return context.knowledge.symbols

            .filter(s => s.kind === "Function")

            .map(s => s.name);

    }

}