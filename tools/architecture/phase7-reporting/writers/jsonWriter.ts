import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

export class JsonWriter {

    public write(
        filePath: string,
        object: unknown
    ): void {

        mkdirSync(
            dirname(filePath),
            { recursive: true }
        );

        writeFileSync(

            filePath,

            JSON.stringify(
                object,
                null,
                2
            ),

            "utf8"

        );

    }

}