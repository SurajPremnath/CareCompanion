/**
 * ============================================================
 * CAREVR ARCHITECTURE AUDITOR
 * Dependency Graph Builder
 * ------------------------------------------------------------
 * Responsibilities
 *  - Build directed dependency graph
 *  - Resolve relative imports
 *  - Resolve barrel exports (index.ts)
 *  - Detect missing modules
 *  - Calculate dependency metrics
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx"
];

class DependencyGraph {

    constructor(rootDirectory) {

        this.rootDirectory = rootDirectory;

        this.nodes = new Map();

        this.edges = new Map();

        this.reverseEdges = new Map();

        this.missingModules = [];

        this.externalModules = new Set();

        this.statistics = {

            totalNodes: 0,

            totalEdges: 0,

            internalDependencies: 0,

            externalDependencies: 0,

            missingDependencies: 0

        };

    }

normalize(filePath) {

    return filePath.replace(/\\/g, "/");

}

    initialize(files) {

        for (const file of files) {

const filePath = this.normalize(file.path);

this.nodes.set(filePath, {

    path: filePath,

    extension: file.extension,

    analysis: file.analysis,

    dependencies: [],

    dependents: [],

    exists: true

});

this.edges.set(filePath, []);

this.reverseEdges.set(filePath, []);

        }

        this.statistics.totalNodes = this.nodes.size;

    }

    build(files) {

        this.initialize(files);

        for (const file of files) {

            this.processFile(file);

        }

        this.buildReverseGraph();

        this.calculateStatistics();

        return this;

    }

    processFile(file) {

        if (!file.analysis)
            return;

        if (!file.analysis.imports)
            return;

        const dependencies = [];

        for (const imported of file.analysis.imports) {

            const resolved = this.resolveImport(

                file.path,

                imported.module

            );

            if (!resolved) {

                this.externalModules.add(imported.module);

                continue;

            }

            dependencies.push(resolved);

        }

        this.edges.set(
    this.normalize(file.path),
    dependencies.map(d => this.normalize(d))
);

    }
    /**
     * ------------------------------------------------------------
     * Resolve an import to an internal project file.
     *
     * Returns:
     *  - relative project path if found
     *  - null if external package
     * ------------------------------------------------------------
     */
    resolveImport(currentFile, importedModule) {

        // External package
        if (
            !importedModule.startsWith("./") &&
            !importedModule.startsWith("../")
        ) {
            return null;
        }

        const currentDirectory = path.dirname(
            path.join(this.rootDirectory, currentFile)
        );

        const target = path.resolve(
            currentDirectory,
            importedModule
        );

        const resolved = this.resolveFile(target);

        if (!resolved) {

            this.missingModules.push({

                source: currentFile,

                import: importedModule,

                resolvedPath: target

            });

            return null;
        }

return this.normalize(

    path.relative(
        this.rootDirectory,
        resolved
    )

);

    }

    /**
     * ------------------------------------------------------------
     * Resolve a physical source file.
     *
     * Handles:
     *      module.ts
     *      module.tsx
     *      module.js
     *      module.jsx
     *      module/index.ts
     *      module/index.tsx
     * ------------------------------------------------------------
     */

    resolveFile(basePath) {

        if (fs.existsSync(basePath)) {

            const stat = fs.statSync(basePath);

            if (stat.isFile()) {

                return basePath;

            }

        }

        for (const extension of SUPPORTED_EXTENSIONS) {

            const candidate = basePath + extension;

            if (fs.existsSync(candidate)) {

                return candidate;

            }

        }

        for (const extension of SUPPORTED_EXTENSIONS) {

            const candidate = path.join(

                basePath,

                "index" + extension

            );

            if (fs.existsSync(candidate)) {

                return candidate;

            }

        }

        return null;

    }

    /**
     * ------------------------------------------------------------
     * Build reverse dependency graph.
     *
     * A -> B
     *
     * becomes
     *
     * B <- A
     * ------------------------------------------------------------
     */

    buildReverseGraph() {

        for (const [file, dependencies] of this.edges.entries()) {

            for (const dependency of dependencies) {

                if (!this.reverseEdges.has(dependency)) {

                    this.reverseEdges.set(

                        dependency,

                        []

                    );

                }

                this.reverseEdges
                    .get(dependency)
                    .push(file);

            }

        }

    }

    /**
     * ------------------------------------------------------------
     * Calculate graph statistics.
     * ------------------------------------------------------------
     */

    calculateStatistics() {

        let totalEdges = 0;

        for (const dependencies of this.edges.values()) {

            totalEdges += dependencies.length;

        }

        this.statistics.totalEdges = totalEdges;

        this.statistics.internalDependencies =
            totalEdges;

        this.statistics.externalDependencies =
            this.externalModules.size;

        this.statistics.missingDependencies =
            this.missingModules.length;

    }
    /**
     * ------------------------------------------------------------
     * Get dependencies of a file.
     * ------------------------------------------------------------
     */

getDependencies(file) {

    return this.edges.get(
        this.normalize(file)
    ) || [];

}

getDependents(file) {

    return this.reverseEdges.get(
        this.normalize(file)
    ) || [];

}
    /**
     * ------------------------------------------------------------
     * Files with no incoming references.
     * ------------------------------------------------------------
     */

    getRootNodes() {

        const roots = [];

        for (const node of this.nodes.keys()) {

            const incoming =
                this.reverseEdges.get(node) || [];

            if (incoming.length === 0) {

                roots.push(node);

            }

        }

        return roots.sort();

    }

    /**
     * ------------------------------------------------------------
     * Files that do not depend on any other internal file.
     * ------------------------------------------------------------
     */

    getLeafNodes() {

        const leaves = [];

        for (const node of this.nodes.keys()) {

            const outgoing =
                this.edges.get(node) || [];

            if (outgoing.length === 0) {

                leaves.push(node);

            }

        }

        return leaves.sort();

    }

    /**
     * ------------------------------------------------------------
     * Files that are completely isolated.
     * ------------------------------------------------------------
     */

    getOrphanNodes() {

        const orphans = [];

        for (const node of this.nodes.keys()) {

            const incoming =
                this.reverseEdges.get(node) || [];

            const outgoing =
                this.edges.get(node) || [];

            if (
                incoming.length === 0 &&
                outgoing.length === 0
            ) {

                orphans.push(node);

            }

        }

        return orphans.sort();

    }

    /**
     * ------------------------------------------------------------
     * Top coupled modules.
     * ------------------------------------------------------------
     */

    getHighlyCoupledModules(limit = 25) {

        const modules = [];

        for (const node of this.nodes.keys()) {

            const incoming =
                (this.reverseEdges.get(node) || []).length;

            const outgoing =
                (this.edges.get(node) || []).length;

            modules.push({

                file: node,

                incoming,

                outgoing,

                total: incoming + outgoing

            });

        }

        modules.sort(

            (a, b) => b.total - a.total

        );

        return modules.slice(0, limit);

    }

    /**
     * ------------------------------------------------------------
     * Export graph.
     * ------------------------------------------------------------
     */

    toJSON() {

        return {

            statistics: this.statistics,

            nodes: Array.from(this.nodes.keys()),

            edges: Object.fromEntries(this.edges),

            reverseEdges:
                Object.fromEntries(this.reverseEdges),

            missingModules: this.missingModules,

            externalModules:
                Array.from(this.externalModules)

        };

    }

    /**
     * ------------------------------------------------------------
     * Validate graph consistency.
     * ------------------------------------------------------------
     */

    validate() {

        const issues = [];

        for (const [file, dependencies] of this.edges.entries()) {

            for (const dependency of dependencies) {

                if (!this.nodes.has(dependency)) {

                    issues.push({

                        type: "MissingNode",

                        source: file,

                        dependency

                    });

                }

            }

        }

        return issues;

    }


toMarkdown() {

    let md = "# Dependency Graph\n\n";

    md += "## Summary\n\n";

    md += "|Metric|Value|\n";
    md += "|------|----:|\n";

    md += `|Nodes|${this.statistics.totalNodes}|\n`;
    md += `|Edges|${this.statistics.totalEdges}|\n`;
    md += `|Internal|${this.statistics.internalDependencies}|\n`;
    md += `|External|${this.statistics.externalDependencies}|\n`;
    md += `|Missing|${this.statistics.missingDependencies}|\n\n`;

    md += "## Root Nodes\n\n";

    for (const node of this.getRootNodes()) {
        md += `- ${node}\n`;
    }

    md += "\n## Leaf Nodes\n\n";

    for (const node of this.getLeafNodes()) {
        md += `- ${node}\n`;
    }

    md += "\n## Missing Modules\n\n";

    for (const item of this.missingModules) {
        md += `- ${item.source} -> ${item.import}\n`;
    }

    return md;

}

    /**
     * ------------------------------------------------------------
     * Print summary.
     * ------------------------------------------------------------
     */

    printSummary() {

        console.log("");

        console.log("Dependency Graph");

        console.log("------------------------------");

        console.log(
            "Nodes:",
            this.statistics.totalNodes
        );

        console.log(
            "Edges:",
            this.statistics.totalEdges
        );

        console.log(
            "Internal:",
            this.statistics.internalDependencies
        );

        console.log(
            "External:",
            this.statistics.externalDependencies
        );

        console.log(
            "Missing:",
            this.statistics.missingDependencies
        );

        console.log("");

    }

getSummary() {

    return {
        ...this.statistics
    };

}

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function buildDependencyGraph(rootDirectory, files) {

    const graph = new DependencyGraph(rootDirectory);

    return graph.build(files);

}


module.exports = {

    DependencyGraph,

    buildDependencyGraph

};