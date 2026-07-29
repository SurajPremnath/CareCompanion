import { Node } from "ts-morph";

import { ParserCollector } from "../models";

export interface Visitor {

    canVisit(
        node: Node
    ): boolean;

    visit(
        node: Node,
        collector: ParserCollector
    ): void;

}