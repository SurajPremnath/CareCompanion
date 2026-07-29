import { ParserArtifacts } from "../../phase3-parser/models";
import { SemanticProject } from "../models";

export interface SemanticBuilder {

    build(
        artifacts: ParserArtifacts
    ): SemanticProject;

}