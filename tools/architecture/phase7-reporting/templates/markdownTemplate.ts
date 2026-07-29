import { MarkdownBuilder } from "../builders";
import { ReportContext } from "../models";

export abstract class MarkdownTemplate {

    public abstract build(

        builder: MarkdownBuilder,

        context: ReportContext

    ): void;

}