import { SourceFile } from "ts-morph";

import { ParserCollector } from "../models";

export interface Walker {

    walk(
        sourceFile: SourceFile,
        collector: ParserCollector
    ): void;

}