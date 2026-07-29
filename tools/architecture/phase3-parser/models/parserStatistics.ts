export interface ParserStatistics {

    readonly totalFiles: number;

    readonly parsedFiles: number;

    readonly skippedFiles: number;

    readonly totalNodesVisited: number;

    readonly parseErrors: number;

    readonly startedAt: Date;

    readonly completedAt: Date;

    readonly durationInMilliseconds: number;

}