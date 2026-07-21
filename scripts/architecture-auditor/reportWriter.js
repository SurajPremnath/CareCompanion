/**
 * ============================================================
 * CAREVR Architecture Auditor
 * Report Writer
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

class ReportWriter {

    constructor(outputDirectory) {

        this.outputDirectory = outputDirectory;

    }

    ensureDirectory() {

        if (!fs.existsSync(this.outputDirectory)) {

            fs.mkdirSync(
                this.outputDirectory,
                { recursive: true }
            );

        }

    }

writeAll({

    dependencyGraph,

    symbolIndex,

    duplicateDetector,

    publicApi,

    layerValidation

}) {

        this.ensureDirectory();

        this.writeSummary(

            dependencyGraph,

            symbolIndex,

            duplicateDetector,

            publicApi

        );

        this.writeDependencyGraph(

            dependencyGraph

        );

        this.writeDuplicateReport(

            duplicateDetector

        );

        this.writePublicApi(

            publicApi

        );

        this.writeMedicationReport(

            dependencyGraph,

            duplicateDetector,

            publicApi

        );

this.writeLayerValidation(

    layerValidation

);

    }

    writeFile(

        filename,

        content

    ) {

        fs.writeFileSync(

            path.join(

                this.outputDirectory,

                filename

            ),

            content

        );

    }

    writeSummary(

        dependencyGraph,

        symbolIndex,

        duplicateDetector,

        publicApi

    ) {

        const graph =
            dependencyGraph.statistics;

        const symbols =
            symbolIndex.getSummary();

        const duplicates =
            duplicateDetector.getSummary();

        const api =
            publicApi.getSummary();

        let md = "";

        md += "# CAREVR Architecture Audit\n\n";

        md += "Generated : ";

        md += new Date().toISOString();

        md += "\n\n";

        md += "---\n\n";

        md += "## Project\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        md += `|Nodes|${graph.totalNodes}|\n`;
        md += `|Edges|${graph.totalEdges}|\n`;
        md += `|Internal Dependencies|${graph.internalDependencies}|\n`;
        md += `|External Dependencies|${graph.externalDependencies}|\n`;
        md += `|Missing Dependencies|${graph.missingDependencies}|\n`;

        md += "\n";

        md += "## Symbols\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        md += `|Unique Symbols|${symbols.totalSymbols}|\n`;
        md += `|Duplicate Symbols|${symbols.duplicateNames}|\n`;

        md += "\n";

        md += "## Duplicates\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        md += `|Critical|${duplicates.critical}|\n`;
        md += `|High|${duplicates.high}|\n`;
        md += `|Medium|${duplicates.medium}|\n`;
        md += `|Low|${duplicates.low}|\n`;

        md += "\n";

        md += "## APIs\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        md += `|Public Modules|${api.publicModules}|\n`;
        md += `|Dead Modules|${api.deadModules}|\n`;
        md += `|Medication Modules|${api.medicationModules}|\n`;

        this.writeFile(

            "00-summary.md",

            md

        );

    }
    writeDependencyGraph(
        dependencyGraph
    ) {

        this.writeFile(
            "01-dependency-graph.md",
            dependencyGraph.toMarkdown()
        );

    }

    writeDuplicateReport(
        duplicateDetector
    ) {

        this.writeFile(
            "02-duplicate-symbols.md",
            duplicateDetector.toMarkdown()
        );

    }

    writePublicApi(
        publicApi
    ) {

        this.writeFile(
            "03-public-api.md",
            publicApi.toMarkdown()
        );

    }

    writeMedicationReport(
        dependencyGraph,
        duplicateDetector,
        publicApi
    ) {

        const medicationModules =
            publicApi.getMedicationModules();

        const medicationDuplicates =
            duplicateDetector.getMedicationDuplicates();

        let md = "";

        md += "# Medication Management Audit\n\n";

        md += "Generated: ";

        md += new Date().toISOString();

        md += "\n\n";

        md += "---\n\n";

        md += "## Executive Summary\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";

        md += `|Medication Modules|${medicationModules.length}|\n`;
        md += `|Duplicate Symbols|${medicationDuplicates.length}|\n`;

        md += "\n";

        md += "---\n\n";

        md += "## Medication Modules\n\n";

        if (!medicationModules.length) {

            md += "_No medication modules detected._\n\n";

        } else {

            for (const module of medicationModules) {

                md += `### ${module.file}\n\n`;

                md += `Public : ${module.isPublic}\n\n`;

                md += `Dead : ${module.isDead}\n\n`;

                md += `Dependencies : ${module.dependencyCount}\n\n`;

                md += `Dependents : ${module.dependentCount}\n\n`;

                if (module.exports.length) {

                    md += "**Exports**\n\n";

                    for (const exp of module.exports) {

                        if (typeof exp === "string") {

                            md += `- ${exp}\n`;

                        } else if (exp?.name) {

                            md += `- ${exp.name}\n`;

                        }

                    }

                    md += "\n";

                }

                if (module.dependencies.length) {

                    md += "**Dependencies**\n\n";

                    module.dependencies.forEach(dep => {

                        md += `- ${dep}\n`;

                    });

                    md += "\n";

                }

                if (module.dependents.length) {

                    md += "**Used By**\n\n";

                    module.dependents.forEach(dep => {

                        md += `- ${dep}\n`;

                    });

                    md += "\n";

                }

                md += "---\n\n";

            }

        }

        md += "## Duplicate Medication Symbols\n\n";

        if (!medicationDuplicates.length) {

            md += "_No duplicate medication symbols detected._\n";

        } else {

            for (const duplicate of medicationDuplicates) {

                md += `### ${duplicate.name}\n\n`;

                md += `Severity : ${duplicate.severity}\n\n`;

                md += "**Files**\n\n";

                duplicate.files.forEach(file => {

                    md += `- ${file}\n`;

                });

                md += "\n";

                md += "**Recommendation**\n\n";

                md += `${duplicate.recommendation.action}\n\n`;

                md += "---\n\n";

            }

        }

        md += "## Initial Recommendations\n\n";

        md += "- Consolidate duplicate medication models.\n";
        md += "- Eliminate dead medication modules.\n";
        md += "- Introduce a single canonical Medication Service.\n";
        md += "- Ensure repository and storage follow the UI → Storage → Repository architecture.\n";
        md += "- Validate Timeline integration before refactoring.\n";
        md += "- Avoid introducing parallel medication workflows.\n";

        this.writeFile(
            "04-medication-management.md",
            md
        );

    }

writeLayerValidation(
    layerValidation
) {

    this.writeFile(

        "05-layer-validation.md",

        layerValidation.toMarkdown()

    );

}

writeJSON({

    dependencyGraph,

    symbolIndex,

    duplicateDetector,

    publicApi,

    layerValidation

}) {

        const report = {

            generatedAt: new Date().toISOString(),

            dependencyGraph: dependencyGraph.toJSON(),

            symbols: symbolIndex.toJSON(),

            duplicates: duplicateDetector.toJSON(),

publicApi: publicApi.toJSON(),

layerValidation:
    layerValidation.toJSON()

        };

        this.writeFile(

            "architecture-report.json",

            JSON.stringify(report, null, 2)

        );

    }

writeArchitectureSnapshot({

    dependencyGraph,

    symbolIndex,

    duplicateDetector,

    publicApi,

    layerValidation

}) {

        const snapshot = {

            generatedAt: new Date().toISOString(),

            project: {

                nodes: dependencyGraph.statistics.totalNodes,

                edges: dependencyGraph.statistics.totalEdges,

                internalDependencies:
                    dependencyGraph.statistics.internalDependencies,

                externalDependencies:
                    dependencyGraph.statistics.externalDependencies,

                missingDependencies:
                    dependencyGraph.statistics.missingDependencies

            },

            symbols: symbolIndex.getSummary(),

            duplicates: duplicateDetector.getSummary(),

            api: publicApi.getSummary(),

architecture: layerValidation.getSummary()

        };

        this.writeFile(

            "architecture-snapshot.json",

            JSON.stringify(snapshot, null, 2)

        );

    }

printSummary({

    dependencyGraph,

    symbolIndex,

    duplicateDetector,

    publicApi,

    layerValidation

}) {

        console.log("");

        console.log("========================================");

        console.log("      CAREVR ARCHITECTURE AUDITOR");

        console.log("========================================");

        console.log("");

        console.log("Nodes                  :", dependencyGraph.statistics.totalNodes);

        console.log("Edges                  :", dependencyGraph.statistics.totalEdges);

        console.log("Unique Symbols         :", symbolIndex.getSummary().totalSymbols);

        console.log("Duplicate Symbols      :", duplicateDetector.getSummary().totalDuplicates);

        console.log("Public Modules         :", publicApi.getSummary().publicModules);

        console.log("Dead Modules           :", publicApi.getSummary().deadModules);

        console.log("Medication Modules     :", publicApi.getSummary().medicationModules);

console.log(
    "Layer Violations     :",
    layerValidation
        .getSummary()
        .totalViolations
);

        console.log("");

        console.log("Reports written to:");

        console.log(this.outputDirectory);

        console.log("");

    }

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function buildReports(

    outputDirectory,

    analysis

) {

    const writer = new ReportWriter(

        outputDirectory

    );

    writer.writeAll(analysis);

    writer.writeJSON(analysis);

    writer.writeArchitectureSnapshot(analysis);

    writer.printSummary(analysis);

    return writer;

}

module.exports = {

    ReportWriter,

    buildReports

};