export interface ParserError {

    readonly filePath: string;

    readonly message: string;

    readonly error?: unknown;

    readonly recoverable: boolean;

}