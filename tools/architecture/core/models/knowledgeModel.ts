import {
    DependencyGraph
} from "../../phase5-graph";

import {
    SemanticDependency,
    SemanticModule,
    SemanticProject,
    SemanticSymbol
} from "../../phase4-semantic";

export interface KnowledgeProject {

    name: string;

    framework: string;

    language: string;

    database?: string;

}

export interface KnowledgeMetrics {

    moduleCount: number;

    fileCount: number;

    classCount: number;

    functionCount: number;

    componentCount: number;

    dependencyCount: number;

}

export interface KnowledgeFile {

    path: string;

    module: string;

    type: string;

}

export interface KnowledgeModel {

    project: KnowledgeProject;

    modules: SemanticModule[];

    symbols: SemanticSymbol[];

    dependencies: SemanticDependency[];

    files: KnowledgeFile[];

    graph: DependencyGraph;

    metrics: KnowledgeMetrics;

}