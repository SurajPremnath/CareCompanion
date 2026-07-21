/**
 * ============================================================
 * CAREVR Architecture Auditor
 * Symbol Indexer v2
 * ============================================================
 */

class SymbolIndexer {

    constructor() {

        this.symbols = [];

        this.byId = new Map();

        this.byName = new Map();

        this.byQualifiedName = new Map();

        this.byFile = new Map();

        this.byKind = new Map();

        this.byExport = {

            exported: [],

            internal: []

        };

        this.byDecorator = new Map();

        this.byParent = new Map();

        this.relationships = [];

        this.statistics = {};

        this.nextId = 1;

    }

    /**
     * ============================================================
     * Build
     * ============================================================
     */

    build(files) {

        this.reset();

        for (const file of files) {

            this.indexFile(file);

        }

        this.calculateStatistics();

        return this;

    }

    reset() {

        this.symbols = [];

        this.byId.clear();

        this.byName.clear();

        this.byQualifiedName.clear();

        this.byFile.clear();

        this.byKind.clear();

        this.byDecorator.clear();

        this.byParent.clear();

        this.byExport.exported = [];

        this.byExport.internal = [];

        this.relationships = [];

        this.statistics = {};

        this.nextId = 1;

    }

    /**
     * ============================================================
     * File Indexing
     * ============================================================
     */

    indexFile(file) {

        if (!file.analysis)
            return;

        const analysis = file.analysis;

        this.indexCollection(

            file,

            analysis.variables,

            null

        );

        this.indexCollection(

            file,

            analysis.functions,

            null

        );

        this.indexCollection(

            file,

            analysis.types,

            null

        );

        this.indexCollection(

            file,

            analysis.enums,

            null

        );

        this.indexCollection(

            file,

            analysis.interfaces,

            null

        );

        this.indexClasses(

            file,

            analysis.classes || []

        );

    }

    /**
     * ============================================================
     * Generic Collection
     * ============================================================
     */

    indexCollection(

        file,

        collection = [],

        parent

    ) {

        for (const symbol of collection) {

            this.register(

                file,

                symbol,

                parent

            );

        }

    }

    /**
     * ============================================================
     * Class Indexing
     * ============================================================
     */

    indexClasses(

        file,

        classes

    ) {

        for (const cls of classes) {

            const classId = this.register(

                file,

                cls,

                null

            );

            this.indexCollection(

                file,

                cls.constructors,

                classId

            );

            this.indexCollection(

                file,

                cls.properties,

                classId

            );

            this.indexCollection(

                file,

                cls.methods,

                classId

            );

        }

    }

    /**
     * ============================================================
     * Register Symbol
     * ============================================================
     */

    register(

        file,

        symbol,

        parent

    ) {

        if (!symbol || !symbol.name)
            return null;

        const id = this.nextId++;

        const parentSymbol =
            parent
                ? this.byId.get(parent)
                : null;

        const qualifiedName =
            parentSymbol
                ? `${parentSymbol.qualifiedName}.${symbol.name}`
                : symbol.name;

        const indexed = {

            id,

            name: symbol.name,

            qualifiedName,

            kind: symbol.kind,

            file: file.path,

            parent,

            exported:
                symbol.exported || false,

            defaultExport:
                symbol.defaultExport || false,

            async:
                symbol.async || false,

            generic:
                symbol.generic || false,

            abstract:
                symbol.abstract || false,

            readonly:
                symbol.readonly || false,

            static:
                symbol.static || false,

            decorators:
                symbol.decorators || [],

            location:
                symbol.location || null,

            metadata: symbol

        };

        this.symbols.push(indexed);

        this.byId.set(

            id,

            indexed

        );

        this.addToMap(

            this.byName,

            indexed.name,

            indexed

        );

        this.addToMap(

            this.byQualifiedName,

            indexed.qualifiedName,

            indexed

        );

        this.addToMap(

            this.byFile,

            indexed.file,

            indexed

        );

        this.addToMap(

            this.byKind,

            indexed.kind,

            indexed

        );

        if (indexed.exported)

            this.byExport.exported.push(indexed);

        else

            this.byExport.internal.push(indexed);

        for (const decorator of indexed.decorators) {

            this.addToMap(

                this.byDecorator,

                decorator,

                indexed

            );

        }

        if (parent) {

            this.addToMap(

                this.byParent,

                parent,

                indexed

            );

            this.relationships.push({

                parent,

                child: id,

                type: "contains"

            });

        }

        return id;

    }

    /**
     * ============================================================
     * Utility
     * ============================================================
     */

    addToMap(

        map,

        key,

        value

    ) {

        if (!key)
            return;

        if (!map.has(key))

            map.set(

                key,

                []

            );

        map.get(key).push(value);

    }
    /**
     * ============================================================
     * Interface Indexing
     * ============================================================
     */

    indexInterfaces(
        file,
        interfaces
    ) {

        for (const iface of interfaces) {

            const interfaceId = this.register(
                file,
                iface,
                null
            );

            this.indexInterfaceProperties(
                file,
                iface.properties || [],
                interfaceId
            );

            this.indexInterfaceMethods(
                file,
                iface.methods || [],
                interfaceId
            );

        }

    }

    indexInterfaceProperties(
        file,
        properties,
        parentId
    ) {

        for (const property of properties) {

            this.register(

                file,

                {

                    ...property,

                    kind: "interfaceProperty"

                },

                parentId

            );

        }

    }

    indexInterfaceMethods(
        file,
        methods,
        parentId
    ) {

        for (const method of methods) {

            this.register(

                file,

                {

                    ...method,

                    kind: "interfaceMethod"

                },

                parentId

            );

        }

    }

    /**
     * ============================================================
     * Update File Indexing
     * ============================================================
     */

    indexFile(file) {

        if (!file.analysis)
            return;

        const analysis = file.analysis;

        this.indexCollection(
            file,
            analysis.variables || [],
            null
        );

        this.indexCollection(
            file,
            analysis.functions || [],
            null
        );

        this.indexCollection(
            file,
            analysis.types || [],
            null
        );

        this.indexCollection(
            file,
            analysis.enums || [],
            null
        );

        this.indexInterfaces(
            file,
            analysis.interfaces || []
        );

        this.indexClasses(
            file,
            analysis.classes || []
        );

    }

    /**
     * ============================================================
     * Relationship APIs
     * ============================================================
     */

    getChildren(parentId) {

        return this.byParent.get(parentId) || [];

    }

    getParent(symbolId) {

        const symbol =
            this.byId.get(symbolId);

        if (!symbol || !symbol.parent)
            return null;

        return this.byId.get(symbol.parent);

    }

    getRelationshipGraph() {

        return this.relationships;

    }

    /**
     * ============================================================
     * Recursive Traversal
     * ============================================================
     */

    walkChildren(
        parentId,
        callback
    ) {

        const children =
            this.getChildren(parentId);

        for (const child of children) {

            callback(child);

            this.walkChildren(
                child.id,
                callback
            );

        }

    }

    /**
     * ============================================================
     * Root Symbols
     * ============================================================
     */

    getRootSymbols() {

        return this.symbols.filter(
            symbol => symbol.parent === null
        );

    }

    /**
     * ============================================================
     * Leaf Symbols
     * ============================================================
     */

    getLeafSymbols() {

        return this.symbols.filter(symbol => {

            return this.getChildren(
                symbol.id
            ).length === 0;

        });

    }

    /**
     * ============================================================
     * Qualified Lookup
     * ============================================================
     */

    getByQualifiedName(
        qualifiedName
    ) {

        return this.byQualifiedName.get(
            qualifiedName
        ) || [];

    }
    /**
     * ============================================================
     * Lookup APIs
     * ============================================================
     */

    getSymbol(id) {

        return this.byId.get(id) || null;

    }

    getByName(name) {

        return this.byName.get(name) || [];

    }

    getByKind(kind) {

        return this.byKind.get(kind) || [];

    }

    getByFile(file) {

        return this.byFile.get(file) || [];

    }

    getExportedSymbols() {

        return this.byExport.exported;

    }

    getInternalSymbols() {

        return this.byExport.internal;

    }

    getByDecorator(decorator) {

        return this.byDecorator.get(decorator) || [];

    }

    /**
     * ============================================================
     * Duplicate Detection Helpers
     * ============================================================
     */

    getDuplicateNames() {

        return Array.from(this.byName.entries())

            .filter(([_, symbols]) => symbols.length > 1)

            .map(([name, symbols]) => ({

                name,

                count: symbols.length,

                symbols

            }));

    }

    getDuplicateQualifiedNames() {

        return Array.from(this.byQualifiedName.entries())

            .filter(([_, symbols]) => symbols.length > 1)

            .map(([qualifiedName, symbols]) => ({

                qualifiedName,

                count: symbols.length,

                symbols

            }));

    }

    /**
     * ============================================================
     * File Relationships
     * ============================================================
     */

    getFileHierarchy(file) {

        return {

            file,

            symbols:

                this.getByFile(file)

        };

    }

    /**
     * ============================================================
     * Ownership Hierarchy
     * ============================================================
     */

    getOwnershipTree(rootId) {

        const build = id => {

            const symbol =
                this.getSymbol(id);

            if (!symbol)
                return null;

            return {

                ...symbol,

                children:

                    this.getChildren(id)

                        .map(child =>

                            build(child.id)

                        )

            };

        };

        return build(rootId);

    }

    /**
     * ============================================================
     * Relationship Validation
     * ============================================================
     */

    validateRelationships() {

        const issues = [];

        for (const relation of this.relationships) {

            if (!this.byId.has(relation.parent)) {

                issues.push({

                    type: "MissingParent",

                    relationship: relation

                });

            }

            if (!this.byId.has(relation.child)) {

                issues.push({

                    type: "MissingChild",

                    relationship: relation

                });

            }

        }

        return issues;

    }

    /**
     * ============================================================
     * Orphan Detection
     * ============================================================
     */

    getOrphanSymbols() {

        return this.symbols.filter(symbol => {

            if (symbol.parent !== null)
                return false;

            return this.getChildren(symbol.id).length === 0;

        });

    }

    /**
     * ============================================================
     * Medication Helpers
     * ============================================================
     */

    getMedicationSymbols() {

        const keywords = [

            "medication",
            "medicine",
            "prescription",
            "consultation",
            "dosage",
            "frequency",
            "duration",
            "timing",
            "drug"

        ];

        return this.symbols.filter(symbol => {

            const value =
                symbol.qualifiedName.toLowerCase();

            return keywords.some(keyword =>

                value.includes(keyword)

            );

        });

    }

    /**
     * ============================================================
     * Repository Helpers
     * ============================================================
     */

    getRepositories() {

        return this.symbols.filter(symbol =>

            symbol.kind === "class" &&

            symbol.name.endsWith("Repository")

        );

    }

    /**
     * ============================================================
     * Service Helpers
     * ============================================================
     */

    getServices() {

        return this.symbols.filter(symbol =>

            symbol.kind === "class" &&

            symbol.name.endsWith("Service")

        );

    }

    /**
     * ============================================================
     * Storage Helpers
     * ============================================================
     */

    getStorageClasses() {

        return this.symbols.filter(symbol =>

            symbol.kind === "class" &&

            symbol.name.endsWith("Storage")

        );

    }
    /**
     * ============================================================
     * Statistics
     * ============================================================
     */

    calculateStatistics() {

        this.statistics = {

            totalSymbols:
                this.symbols.length,

            exportedSymbols:
                this.byExport.exported.length,

            internalSymbols:
                this.byExport.internal.length,

            rootSymbols:
                this.getRootSymbols().length,

            leafSymbols:
                this.getLeafSymbols().length,

            orphanSymbols:
                this.getOrphanSymbols().length,

            duplicateNames:
                this.getDuplicateNames().length,

            duplicateQualifiedNames:
                this.getDuplicateQualifiedNames().length,

            services:
                this.getServices().length,

            repositories:
                this.getRepositories().length,

            storage:
                this.getStorageClasses().length,

            medicationSymbols:
                this.getMedicationSymbols().length,

            decorators:
                this.byDecorator.size,

            files:
                this.byFile.size,

            relationships:
                this.relationships.length

        };

    }

    /**
     * ============================================================
     * Architecture Health
     * ============================================================
     */

    getArchitectureHealth() {

        let score = 100;

        score -= this.statistics.duplicateNames * 2;

        score -= this.statistics.orphanSymbols;

        score -= this.statistics.duplicateQualifiedNames * 3;

        if (score < 0)
            score = 0;

        return {

            score,

            rating:

                score >= 90 ? "Excellent" :

                score >= 75 ? "Good" :

                score >= 60 ? "Fair" :

                score >= 40 ? "Poor" :

                "Critical"

        };

    }

    /**
     * ============================================================
     * Summary
     * ============================================================
     */

    getSummary() {

        return {

            ...this.statistics,

            architecture:

                this.getArchitectureHealth()

        };

    }

    /**
     * ============================================================
     * Validation
     * ============================================================
     */

    validate() {

        const issues = [];

        issues.push(

            ...this.validateRelationships()

        );

        for (const duplicate of this.getDuplicateQualifiedNames()) {

            issues.push({

                type: "DuplicateQualifiedName",

                qualifiedName:
                    duplicate.qualifiedName,

                count:
                    duplicate.count

            });

        }

        return issues;

    }

    /**
     * ============================================================
     * JSON
     * ============================================================
     */

    toJSON() {

        return {

            summary:

                this.getSummary(),

            symbols:

                this.symbols,

            relationships:

                this.relationships,

            validation:

                this.validate()

        };

    }

    /**
     * ============================================================
     * Markdown
     * ============================================================
     */

    toMarkdown() {

        const summary =
            this.getSummary();

        let md = "";

        md += "# Symbol Index\n\n";

        md += "## Summary\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        Object.entries(summary)

            .forEach(([key, value]) => {

                if (typeof value !== "object") {

                    md += `|${key}|${value}|\n`;

                }

            });

        md += "\n";

        md += "## Architecture Health\n\n";

        md += `Score : ${summary.architecture.score}\n\n`;

        md += `Rating : ${summary.architecture.rating}\n\n`;

        md += "---\n\n";

        for (const symbol of this.getRootSymbols()) {

            md += `## ${symbol.qualifiedName}\n\n`;

            md += `Kind : ${symbol.kind}\n\n`;

            md += `Exported : ${symbol.exported}\n\n`;

            const children =
                this.getChildren(symbol.id);

            if (children.length) {

                md += "**Members**\n\n";

                for (const child of children) {

                    md += `- ${child.kind}: ${child.name}\n`;

                }

                md += "\n";

            }

        }

        return md;

    }

    /**
     * ============================================================
     * Console
     * ============================================================
     */

    printSummary() {

        const summary =
            this.getSummary();

        console.log("");

        console.log("=======================================");

        console.log("          SYMBOL INDEX V2");

        console.log("=======================================");

        console.log("");

        console.log("Symbols              :", summary.totalSymbols);

        console.log("Exported             :", summary.exportedSymbols);

        console.log("Internal             :", summary.internalSymbols);

        console.log("Services             :", summary.services);

        console.log("Repositories         :", summary.repositories);

        console.log("Storage              :", summary.storage);

        console.log("Medication           :", summary.medicationSymbols);

        console.log("Relationships        :", summary.relationships);

        console.log("Duplicates           :", summary.duplicateNames);

        console.log("Architecture Score   :", summary.architecture.score);

        console.log("Architecture Rating  :", summary.architecture.rating);

        console.log("");

    }

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function buildSymbolIndex(files) {

    const index = new SymbolIndexer();

    return index.build(files);

}

module.exports = {

    SymbolIndexer,

    buildSymbolIndex

};