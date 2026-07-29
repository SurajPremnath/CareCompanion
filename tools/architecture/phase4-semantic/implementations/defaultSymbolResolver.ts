import { Node } from "ts-morph";

import { ParserArtifacts } from "../../phase3-parser";

import {
    SemanticKind,
    SemanticSymbol
} from "../models";

import { SymbolResolver } from "../resolvers";

import { ArchitectureClassifier } from "./architectureClassifier";

export class DefaultSymbolResolver
    implements SymbolResolver {

    constructor(
        private readonly classifier: ArchitectureClassifier
    ) {}


    public resolve(
        artifacts: ParserArtifacts
    ): readonly SemanticSymbol[] {

        const symbols: SemanticSymbol[] = [];

        symbols.push(
            ...this.fromNodes(
                artifacts.classes,
                SemanticKind.Class
            )
        );

        symbols.push(
            ...this.fromNodes(
                artifacts.interfaces,
                SemanticKind.Interface
            )
        );

        symbols.push(
            ...this.fromNodes(
                artifacts.functions,
                SemanticKind.Function
            )
        );

        symbols.push(
            ...this.fromNodes(
                artifacts.enums,
                SemanticKind.Enum
            )
        );

        symbols.push(
            ...this.fromNodes(
                artifacts.typeAliases,
                SemanticKind.TypeAlias
            )
        );

        symbols.push(
            ...this.fromNodes(
                artifacts.variables,
                SemanticKind.Variable
            )
        );

        return symbols;

    }

    private fromNodes<T extends Node>(
        nodes: readonly T[],
        kind: SemanticKind
    ): SemanticSymbol[] {

        return nodes.map(node => ({

            id: node.getSymbol()?.getEscapedName() ??
                node.getKindName(),

            name:
                ("getName" in node &&
                 typeof (node as any).getName === "function")
                    ? ((node as any).getName() ?? "")
                    : "",

            qualifiedName:
                node.getSourceFile().getFilePath(),

kind: this.resolveKind(
    node,
    kind
),

            module:
                node.getSourceFile().getDirectoryPath(),

            file:
                node.getSourceFile().getFilePath(),

            exported:
                node.isExported?.() ?? false

        }));

    }

private resolveKind(
    node: Node,
    fallback: SemanticKind
): SemanticKind {

    const classification =
        this.classifier.classify(

            node.getSourceFile().getFilePath(),

            "getName" in node &&
            typeof (node as any).getName === "function"
                ? ((node as any).getName() ?? "")
                : ""

        );

    switch (classification) {

        case "Repository":
            return SemanticKind.Repository;

        case "Service":
            return SemanticKind.Service;

        case "Controller":
            return SemanticKind.Controller;

        case "Storage":
            return SemanticKind.Storage;

        case "Mapper":
            return SemanticKind.Mapper;

        case "Hook":
            return SemanticKind.Hook;

        case "Component":
            return SemanticKind.Component;

        case "Page":
            return SemanticKind.Page;

        case "Api":
            return SemanticKind.Api;

        case "Engine":
            return SemanticKind.Engine;

        default:
            return fallback;

    }

}

}