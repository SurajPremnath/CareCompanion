import { ReportContext } from "../../contracts";
import { CatalogSection } from "./catalogSection";

export class FileCatalogSection
    extends CatalogSection<void> {

    protected title(): string {

        return "Files";

    }

    protected headers(): readonly string[] {

        return [
            "File",
            "Module",
            "Type"
        ];

    }

    protected rows(
        context: ReportContext
    ): readonly (readonly string[])[] {

        return context.model.project.files.map(file => [

            file.path,

            file.module,

            file.type

        ]);

    }

}