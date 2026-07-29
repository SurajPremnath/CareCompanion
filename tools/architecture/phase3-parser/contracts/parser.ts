import { ParserContext, ParserResult } from "../models";

export interface Parser {

    parse(
        context: ParserContext
    ): ParserResult;

}