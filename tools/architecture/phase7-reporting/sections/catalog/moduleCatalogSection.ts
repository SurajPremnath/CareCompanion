import { ReportContext } from "../../contracts";
import { CatalogSection } from "./catalogSection";

export class ModuleCatalogSection
    extends CatalogSection<void> {

    protected title(): string {

        return "Modules";

    }

    protected headers(): readonly string[] {

        return [
            "Module",
            "Path",
            "Files"
        ];

    }

    protected rows(
        context: ReportContext
    ): readonly (readonly string[])[] {

        return context.model.modules.map(module => [

            module.name,

            module.path,

            module.files.length.toString()

        ]);

    }

}