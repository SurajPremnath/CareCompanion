import { MarkdownBuilder } from "../builders";
import { ReportSection } from "./reportSection";

export class TableSection
    implements ReportSection {

    public constructor(

        private readonly title: string,

        private readonly headers: string[],

        private readonly rows: string[][]

    ) {}

    public build(
        builder: MarkdownBuilder
    ): void {

        builder.h2(this.title);

        builder.table(

            this.headers,

            this.rows

        );

    }

}