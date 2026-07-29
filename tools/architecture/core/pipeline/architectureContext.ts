export interface ArchitectureContext {
    configuration: ArchitectureConfiguration;

    files?: string[];
    modules?: string[];

    parserArtifacts?: ParserResult;

    semanticProject?: SemanticProject;

    graph?: GraphAnalysisResult;

    analysis?: AnalysisResult;

    validation?: ValidationResult;

    exportResult?: ExportResult;
}

export interface ArchitectureConfiguration {
    rootDirectory: string;
    outputDirectory: string;
}