import { Node } from "ts-morph";

import { Visitor } from "../contracts";
import { ParserCollector } from "../models";

export abstract class BaseVisitor
    implements Visitor {

    public abstract canVisit(
        node: Node
    ): boolean;

    public abstract visit(
        node: Node,
        collector: ParserCollector
    ): void;

}