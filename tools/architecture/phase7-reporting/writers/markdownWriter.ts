import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

export class MarkdownWriter {

    public write(
        filePath: string,
        content: string
    ): void {

        mkdirSync(
            dirname(filePath),
            { recursive: true }
        );

        writeFileSync(
            filePath,
            content,
            "utf8"
        );

    }

}