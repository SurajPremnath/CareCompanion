import {
    DependencyGraph
} from "../../phase5-graph";

import {
    SemanticProject
} from "../../phase4-semantic";

import {
    KnowledgeFile,
    KnowledgeMetrics,
    KnowledgeModel
} from "../../core";

export class DefaultKnowledgeModelBuilder {

    public build(

        semantic: SemanticProject,

        graph: DependencyGraph

    ): KnowledgeModel {

        const files: KnowledgeFile[] =
            graph.nodes.map(node => ({

                path: node.path,

                module: node.module,

                type: node.kind

            }));

        const metrics: KnowledgeMetrics = {

            fileCount: files.length,

            moduleCount: semantic.modules.length,

            symbolCount: semantic.symbols.length,

            dependencyCount: semantic.dependencies.length

        };

        return {

            project: {

                name: semantic.name,

                framework: "Next.js",

                language: "TypeScript",

                database: "Supabase"

            },

            modules: semantic.modules,

            symbols: semantic.symbols,

            dependencies: semantic.dependencies,

            files,

            graph,

            metrics

        };

    }

}