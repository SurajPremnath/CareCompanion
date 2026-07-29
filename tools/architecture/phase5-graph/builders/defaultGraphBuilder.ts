import { KnowledgeModel } from "../../core";
import { GraphBuilder } from "../contracts/graphBuilder";
import { DependencyGraph } from "../models/dependencyGraph";

export class DefaultGraphBuilder
    implements GraphBuilder {

    public build(
        model: KnowledgeModel
    ): DependencyGraph {

        return {

            nodes: model.project.files.map(file => ({

                id: file.path,

                name: file.path.split("/").pop() ?? file.path,

                kind: file.type,

                module: file.module,

                path: file.path

            })),

            edges: model.project.dependencies.map(dependency => ({

                source: dependency.source,

                target: dependency.target,

                type: dependency.type

            }))

        };

    }

}