export class MarkdownBuilder {

    private readonly lines: string[] = [];

    public h1(text: string): this {

        this.lines.push(`# ${text}`);
        this.lines.push("");

        return this;

    }

    public h2(text: string): this {

        this.lines.push(`## ${text}`);
        this.lines.push("");

        return this;

    }

    public paragraph(text: string): this {

        this.lines.push(text);
        this.lines.push("");

        return this;

    }

    public bullets(values: string[]): this {

        values.forEach(value => this.lines.push(`- ${value}`));

        this.lines.push("");

        return this;

    }

    public table(
        headers: string[],
        rows: string[][]
    ): this {

        this.lines.push(`| ${headers.join(" | ")} |`);
        this.lines.push(`| ${headers.map(() => "---").join(" | ")} |`);

        rows.forEach(row =>
            this.lines.push(`| ${row.join(" | ")} |`)
        );

        this.lines.push("");

        return this;

    }

    public code(
        language: string,
        code: string
    ): this {

        this.lines.push("```" + language);
        this.lines.push(code);
        this.lines.push("```");
        this.lines.push("");

        return this;

    }

    public line(): this {

        this.lines.push("---");
        this.lines.push("");

        return this;

    }

    public build(): string {

        return this.lines.join("\n");

    }

}