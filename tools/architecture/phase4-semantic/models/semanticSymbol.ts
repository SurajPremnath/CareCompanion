import { SemanticKind } from "./semanticKind";

export interface SemanticSymbol {

    readonly id: string;

    readonly name: string;

    readonly qualifiedName: string;

    readonly kind: SemanticKind;

    readonly module: string;

    readonly file: string;

    readonly exported: boolean;

}