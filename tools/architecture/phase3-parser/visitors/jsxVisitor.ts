import {
    JsxElement,
    JsxSelfClosingElement,
    Node
} from "ts-morph";

import { ParserCollector } from "../models";

import { BaseVisitor } from "./baseVisitor";

export class JsxVisitor extends BaseVisitor {

    public override canVisit(
        node: Node
    ): boolean {

        return (

            Node.isJsxElement(node)

            ||

            Node.isJsxSelfClosingElement(node)

        );

    }

    public override visit(
        node: Node,
        collector: ParserCollector
    ): void {

        collector.addJsxElement(

            node as JsxElement | JsxSelfClosingElement

        );

    }

}