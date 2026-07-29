import { GraphEdge } from "./graphEdge";
import { GraphNode } from "./graphNode";

export interface DependencyGraph {

    readonly nodes: readonly GraphNode[];

    readonly edges: readonly GraphEdge[];

}