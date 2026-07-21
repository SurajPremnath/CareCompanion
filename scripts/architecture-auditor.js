#!/usr/bin/env node

/**
 * ============================================================
 * CAREVR ARCHITECTURE AUDITOR
 * Production Orchestrator
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const { parseTypeScriptFile } = require("./architecture-auditor/parser");
const { buildSymbolIndex } = require("./architecture-auditor/symbolIndexer");
const { buildDependencyGraph } = require("./architecture-auditor/dependencyGraph");
const { buildDuplicateReport } = require("./architecture-auditor/duplicateDetector");
const { buildPublicApiAnalysis } = require("./architecture-auditor/publicApiAnalyzer");
const { buildReports } = require("./architecture-auditor/reportWriter");

const {
    buildLayerValidation
} = require("./architecture-auditor/layerValidator");

class ArchitectureAuditor {

    constructor(root = process.cwd()) {

        this.root = root;

        this.outputDirectory = path.join(
            root,
            "architecture-report"
        );

        this.configuration = {

            ignoreDirectories: [

                ".git",
                ".next",
                ".vercel",
                ".turbo",
                "coverage",
                "dist",
                "build",
                "node_modules"

            ],

            sourceExtensions: [

                ".ts",
                ".tsx",
                ".js",
                ".jsx"

            ]

        };

        this.project = {

            files: [],

            directories: [],

            summary: {

                scannedFiles: 0,

                sourceFiles: 0,

                ignoredDirectories: 0

            }

        };

        this.analysis = {};

    }

    /**
     * ============================================================
     * Runner
     * ============================================================
     */

    run() {

        const start = Date.now();

        this.banner();

        this.ensureOutputDirectory();

        console.log("Scanning project...");

        this.discover(this.root);

        console.log(
            `Found ${this.project.summary.sourceFiles} source files`
        );

        console.log("");

        console.log("Parsing source...");

        this.parseFiles();

        console.log("Building Symbol Index...");

        this.analysis.symbolIndex =

            buildSymbolIndex(

                this.project.files

            );

        console.log("Building Dependency Graph...");

this.analysis.dependencyGraph =

    buildDependencyGraph(

        this.root,
        this.project.files

    );

        console.log("Running Duplicate Analysis...");

        this.analysis.duplicateDetector =

            buildDuplicateReport(

                this.analysis.symbolIndex

            );

        console.log("Running Public API Analysis...");

        this.analysis.publicApi =

            buildPublicApiAnalysis(

                this.project.files,

                this.analysis.dependencyGraph

            );

console.log("Running Layer Validation...");

this.analysis.layerValidation =
    buildLayerValidation(
        this.project.files,
        this.analysis.dependencyGraph
    );

        console.log("Generating Reports...");

        buildReports(

            this.outputDirectory,

            this.analysis

        );

        const elapsed =

            Date.now() - start;

        this.printSummary(

            elapsed

        );

    }

    /**
     * ============================================================
     * Banner
     * ============================================================
     */

    banner() {

        console.clear();

        console.log("");

        console.log("==========================================================");

        console.log("          CAREVR ARCHITECTURE AUDITOR");

        console.log("==========================================================");

        console.log("");

    }

    /**
     * ============================================================
     * Output
     * ============================================================
     */

    ensureOutputDirectory() {

        if (

            !fs.existsSync(

                this.outputDirectory

            )

        ) {

            fs.mkdirSync(

                this.outputDirectory,

                {

                    recursive: true

                }

            );

        }

    }

    /**
     * ============================================================
     * Project Discovery
     * ============================================================
     */

    discover(directory) {

        const entries =

            fs.readdirSync(

                directory,

                {

                    withFileTypes: true

                }

            );

        for (const entry of entries) {

            const absolute =

                path.join(

                    directory,

                    entry.name

                );

            const relative =

                path.relative(

                    this.root,

                    absolute

                );

            if (entry.isDirectory()) {

                if (

                    this.configuration.ignoreDirectories.includes(

                        entry.name

                    )

                ) {

                    this.project.summary.ignoredDirectories++;

                    continue;

                }

                this.project.directories.push(

                    relative

                );

                this.discover(

                    absolute

                );

                continue;

            }

            this.project.summary.scannedFiles++;

            const extension =

                path.extname(

                    entry.name

                );

            if (

                !this.configuration.sourceExtensions.includes(

                    extension

                )

            ) {

                continue;

            }

            this.project.summary.sourceFiles++;

            this.project.files.push({

                name: entry.name,

                path: relative,

                absolutePath: absolute,

                extension,

                size: fs.statSync(absolute).size

            });

        }

    }

    /**
     * ============================================================
     * Parsing
     * ============================================================
     */

    parseFiles() {

        for (const file of this.project.files) {

            try {

                const source =

                    fs.readFileSync(

                        file.absolutePath,

                        "utf8"

                    );

                file.analysis =

                    parseTypeScriptFile(

                        file.absolutePath,

                        source

                    );

            } catch (error) {

                file.analysis = {

                    imports: [],

                    exports: [],

                    reExports: [],

                    variables: [],

                    functions: [],

                    classes: [],

                    interfaces: [],

                    types: [],

                    enums: [],

                    parseError: error.message

                };

console.error(`\nFailed: ${file.path}`);
console.error(error);

            }

        }

    }
    /**
     * ============================================================
     * Validation
     * ============================================================
     */

    validateProject() {

        const issues = [];

        const parseErrors = this.project.files.filter(

            file => file.analysis?.parseError

        );

        if (parseErrors.length) {

            issues.push({

                type: "ParseErrors",

                count: parseErrors.length,

                files: parseErrors.map(file => file.path)

            });

        }

        return issues;

    }

    /**
     * ============================================================
     * Console Summary
     * ============================================================
     */

    printSummary(elapsed) {

        const graph =
            this.analysis.dependencyGraph.getSummary();

        const symbols =
            this.analysis.symbolIndex.getSummary();

        const duplicates =
            this.analysis.duplicateDetector.getSummary();

const api =
    this.analysis.publicApi.getSummary();

const layers =
    this.analysis.layerValidation.getSummary();

const validation =
    this.validateProject();

        console.log("");

        console.log("==========================================================");

        console.log("                 AUDIT COMPLETE");

        console.log("==========================================================");

        console.log("");

        console.log("PROJECT");

        console.log("------------------------------------------");

        console.log(
            "Directories           :",
            this.project.directories.length
        );

        console.log(
            "Source Files          :",
            this.project.summary.sourceFiles
        );

        console.log(
            "Ignored Directories   :",
            this.project.summary.ignoredDirectories
        );

        console.log("");

        console.log("DEPENDENCIES");

        console.log("------------------------------------------");

        console.log(
            "Nodes                 :",
            graph.totalNodes
        );

        console.log(
            "Edges                 :",
            graph.totalEdges
        );

        console.log(
            "Missing Dependencies  :",
            graph.missingDependencies
        );

        console.log("");

        console.log("SYMBOLS");

        console.log("------------------------------------------");

        console.log(
            "Total Symbols         :",
            symbols.totalSymbols
        );

        console.log(
            "Exported              :",
            symbols.exportedSymbols
        );

        console.log(
            "Services              :",
            symbols.services
        );

        console.log(
            "Repositories          :",
            symbols.repositories
        );

        console.log(
            "Storage               :",
            symbols.storage
        );

        console.log(
            "Medication Symbols    :",
            symbols.medicationSymbols
        );

        console.log("");

        console.log("DUPLICATES");

        console.log("------------------------------------------");

        console.log(
            "Total                 :",
            duplicates.totalDuplicates
        );

        console.log(
            "Critical              :",
            duplicates.critical
        );

        console.log(
            "High                  :",
            duplicates.high
        );

        console.log(
            "Medium                :",
            duplicates.medium
        );

        console.log(
            "Low                   :",
            duplicates.low
        );

        console.log("");

        console.log("PUBLIC API");

        console.log("------------------------------------------");

        console.log(
            "Public Modules        :",
            api.publicModules
        );

        console.log(
            "Internal Modules      :",
            api.internalModules
        );

        console.log(
            "Dead Modules          :",
            api.deadModules
        );

        console.log(
            "Medication Modules    :",
            api.medicationModules
        );

console.log(
    "Layer Violations      :",
    layers.totalViolations
);

        console.log("");

        if (validation.length) {

            console.log("VALIDATION");

            console.log("------------------------------------------");

            validation.forEach(issue => {

                console.log(

                    `${issue.type}: ${issue.count}`

                );

            });

            console.log("");

        }

        console.log("Output");

        console.log("------------------------------------------");

        console.log(this.outputDirectory);

        console.log("");

        console.log(
            `Completed in ${elapsed} ms`
        );

        console.log("");

    }

}

/**
 * ============================================================
 * Main
 * ============================================================
 */

function main() {

    try {

        const auditor =

            new ArchitectureAuditor();

        auditor.run();

    } catch (error) {

        console.error("");

        console.error("Architecture Auditor Failed");

        console.error("");

        console.error(error);

        console.error("");

        process.exit(1);

    }

}

if (require.main === module) {

    main();

}

module.exports = {

    ArchitectureAuditor

};