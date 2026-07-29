import {
    SemanticSymbolKind,
    ExportDefinition
} from "../models";

export class ExportFactory {

    public static create(
        name: string,
        kind: SemanticSymbolKind,
        isDefault: boolean = false
    ): ExportDefinition {

        return {

            name,

            isDefault,

            symbolKind: kind
        };
    }

    public static createDefault(
        name: string,
        kind: SemanticSymbolKind
    ): ExportDefinition {

        return this.create(
            name,
            kind,
            true
        );
    }

    public static createNamed(
        name: string,
        kind: SemanticSymbolKind
    ): ExportDefinition {

        return this.create(
            name,
            kind,
            false
        );
    }

    public static isDefaultExport(
        definition: ExportDefinition
    ): boolean {

        return definition.isDefault;
    }

    public static isNamedExport(
        definition: ExportDefinition
    ): boolean {

        return !definition.isDefault;
    }

    private constructor() {
        // Static factory only.
    }

}