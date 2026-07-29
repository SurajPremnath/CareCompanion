import { AnalysisEngine } from "../contracts/analysisEngine";

import {
    AnalysisResult,
    ArchitectureSummary
} from "../models";

import {
    DependencyGraph,
    GraphAnalysisResult
} from "../../phase5-graph";

import {
    KnowledgeModel,
    ModuleKnowledge,
    FileKnowledge,
    SymbolKnowledge,
    DependencyKnowledge
} from "../../core";

export class DefaultAnalysisEngine
    implements AnalysisEngine {

    public analyze(
        graphResult: GraphAnalysisResult
    ): AnalysisResult {

        const graph = graphResult.graph;

const modules = this.buildModules(graph);

const files = this.buildFiles(graph);

const symbols = this.buildSymbols(graph);

const dependencies = this.buildDependencies(graph);


        const knowledge: KnowledgeModel = {

            project: {

    name: "CareVR",

    framework: "Next.js",

    language: "TypeScript",

    database: "Supabase"

},

            modules,

files,

symbols,

dependencies,

metrics: {

    moduleCount: modules.length,

    fileCount: files.length,

    classCount: symbols.filter(
        s => s.kind === "class"
    ).length,

    functionCount: symbols.filter(
        s => s.kind === "function"
    ).length,

    componentCount: symbols.filter(
        s =>
            s.kind === "component" ||
            s.kind === "react-component"
    ).length,

    dependencyCount: dependencies.length

},

            findings: graphResult.findings,

            recommendations: []

        };

        const summary: ArchitectureSummary = {

            moduleCount: knowledge.modules.length,

            fileCount: knowledge.files.length,

            dependencyCount: knowledge.dependencies.length,

            findingCount: knowledge.findings.length,

            recommendationCount: knowledge.recommendations.length

        };

        return {

            summary,

            knowledge,

            findings: knowledge.findings,

            recommendations: knowledge.recommendations

        };

    }

    private buildModules(
        graph: DependencyGraph
    ): ModuleKnowledge[] {

        const map = new Map<string, ModuleKnowledge>();

        for (const node of graph.nodes) {

            if (!map.has(node.module)) {

                map.set(node.module, {

                    name: node.module,

                    files: []

                });

            }

            map.get(node.module)!.files.push(node.path);

        }

        return [...map.values()];

    }

    private buildFiles(
        graph: DependencyGraph
    ): FileKnowledge[] {

        const map = new Map<string, FileKnowledge>();

        for (const node of graph.nodes) {

            if (map.has(node.path)) {

                continue;

            }

            map.set(node.path, {

                path: node.path,

                module: node.module,

                symbols: []

            });

        }

        return [...map.values()];

    }

    private buildSymbols(
        graph: DependencyGraph
    ): SymbolKnowledge[] {

        return graph.nodes.map(node => ({

            id: node.id,

            name: node.name,

            kind: node.kind,

            module: node.module,

            path: node.path

        }));

    }

    private buildDependencies(
        graph: DependencyGraph
    ): DependencyKnowledge[] {

        return graph.edges.map(edge => ({

            source: edge.source,

            target: edge.target,

            type: edge.type

        }));

    }

}