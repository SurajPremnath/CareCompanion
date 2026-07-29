import { ParserArtifacts } from "../../phase3-parser/models";
import { SemanticSymbol } from "../models";

export interface SymbolResolver {

    resolve(
        artifacts: ParserArtifacts
    ): readonly SemanticSymbol[];

}