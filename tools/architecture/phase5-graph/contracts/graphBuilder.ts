import {
    DependencyGraph
} from "../models";

import {
    SemanticProject
} from "../../phase4-semantic";

export interface GraphBuilder {

    build(
        semantic: SemanticProject
    ): DependencyGraph;

}