/**
 * ============================================================
 * CAREVR Architecture Auditor
 * Duplicate Detector
 * ------------------------------------------------------------
 * Uses SymbolIndexer to identify duplicate symbols across
 * the project.
 * ============================================================
 */

class DuplicateDetector {

    constructor(symbolIndex) {

        this.symbolIndex = symbolIndex;

        this.duplicates = [];

        this.statistics = {

            totalDuplicates: 0,

            critical: 0,

            high: 0,

            medium: 0,

            low: 0

        };

    }

    analyze() {

        this.duplicates = [];

const duplicateNames =
    this.symbolIndex.getDuplicateNames();

const duplicateQualifiedNames =
    this.symbolIndex.getDuplicateQualifiedNames();

const duplicates = [

    ...duplicateNames.map(item => ({

        type: "DuplicateName",

        name: item.name,

        count: item.count,

        symbols: item.symbols

    })),

    ...duplicateQualifiedNames.map(item => ({

        type: "DuplicateQualifiedName",

        name: item.qualifiedName,

        count: item.count,

        symbols: item.symbols

    }))

];

for (const duplicate of duplicates) {

if (!this.isArchitecturalDuplicate(duplicate)) {
    continue;
}

const analysis =
    this.analyzeDuplicate(duplicate);

if (analysis) {

    this.duplicates.push(
        analysis
    );

}

}

        this.calculateStatistics();

        return this;

    }

isArchitecturalDuplicate(duplicate) {

    const symbols = duplicate.symbols || [];

    if (symbols.length === 0) {
        return false;
    }

    const architecturalKinds = new Set([

        "Class",
        "Interface",
        "TypeAlias",
        "Enum",

        "FunctionDeclaration",

        "Repository",
        "Storage",
        "Service",
        "Mapper",
        "Validator",

        "Model",
        "Controller",

        "Export"

    ]);

    return symbols.some(symbol => {

        if (symbol.exported === true)
            return true;

        if (
            symbol.kind &&
            architecturalKinds.has(symbol.kind)
        )
            return true;

        return false;

    });

}

analyzeDuplicate(duplicate) {

const ignored = new Set([

    "router",
    "loading",
    "saving",
    "error",
    "errors",
    "data",
    "result",
    "results",
    "item",
    "index",
    "i",
    "key",
    "props",
    "children",
    "t",
    "value",
    "values",
    "setValue",
    "setValues",
    "setLoading",
    "setSaving"

]);

if (ignored.has(duplicate.name))
    return null;

    const symbols = duplicate.symbols || [];

    const files = [
        ...new Set(
            symbols
                .map(s => s.file)
                .filter(Boolean)
        )
    ];

    const kinds = [
        ...new Set(
            symbols
                .map(s => s.kind)
                .filter(Boolean)
        )
    ];

    const severity = this.calculateSeverity(files.length);

    return {

        type: duplicate.type,

        name: duplicate.name,

        kind: kinds.join(", "),

        count: duplicate.count,

        files,

        symbols,

        severity,

        recommendation: {
            canonical: files[0] || null,
            action:
                "Consolidate duplicate symbol into a single canonical implementation."
        }

    };

}

calculateSeverity(fileCount) {

    if (fileCount >= 5) return "Critical";
    if (fileCount >= 3) return "High";
    if (fileCount >= 2) return "Medium";

    return "Low";

}

    buildRecommendation(
        duplicate,
        files
    ) {

        return {

            canonical: files[0],

            action:
                "Consolidate duplicate symbol into a single canonical definition."

        };

    }
    /**
     * ------------------------------------------------------------
     * Get all duplicates
     * ------------------------------------------------------------
     */

    getDuplicates() {

        return this.duplicates;

    }

    /**
     * ------------------------------------------------------------
     * Filter by Severity
     * ------------------------------------------------------------
     */

    getBySeverity(severity) {

        return this.duplicates.filter(item =>
            item.severity === severity
        );

    }

    /**
     * ------------------------------------------------------------
     * Filter by Symbol Kind
     * ------------------------------------------------------------
     */

    getByKind(kind) {

        return this.duplicates.filter(item =>
            item.kind === kind
        );

    }

    /**
     * ------------------------------------------------------------
     * Medication Related Duplicates
     * ------------------------------------------------------------
     */

    getMedicationDuplicates() {

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

        return this.duplicates.filter(item => {

            const name =
                item.name.toLowerCase();

            return keywords.some(keyword =>
                name.includes(keyword)
            );

        });

    }

    /**
     * ------------------------------------------------------------
     * Calculate Statistics
     * ------------------------------------------------------------
     */

    calculateStatistics() {

        this.statistics = {

            totalDuplicates: this.duplicates.length,

            critical: 0,

            high: 0,

            medium: 0,

            low: 0

        };

        for (const duplicate of this.duplicates) {

            switch (duplicate.severity) {

                case "Critical":

                    this.statistics.critical++;
                    break;

                case "High":

                    this.statistics.high++;
                    break;

                case "Medium":

                    this.statistics.medium++;
                    break;

                case "Low":

                    this.statistics.low++;
                    break;

            }

        }

    }

    /**
     * ------------------------------------------------------------
     * Summary
     * ------------------------------------------------------------
     */

    getSummary() {

        return {

            ...this.statistics,

            medicationDuplicates:
                this.getMedicationDuplicates().length

        };

    }

    /**
     * ------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------
     */

    validate() {

        const issues = [];

        for (const duplicate of this.duplicates) {

            if (duplicate.severity === "Critical") {

                issues.push({

                    type: "CriticalDuplicate",

                    symbol: duplicate.name,

                    files: duplicate.files

                });

            }

        }

        return issues;

    }
    /**
     * ------------------------------------------------------------
     * Export JSON
     * ------------------------------------------------------------
     */

    toJSON() {

        return {

            summary: this.getSummary(),

            duplicates: this.duplicates,

            validation: this.validate()

        };

    }

    /**
     * ------------------------------------------------------------
     * Generate Markdown Report
     * ------------------------------------------------------------
     */

    toMarkdown() {

        let md = "";

        md += "# Duplicate Symbols Report\n\n";

        md += "## Summary\n\n";

        const summary = this.getSummary();

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";
        md += `|Total|${summary.totalDuplicates}|\n`;
        md += `|Critical|${summary.critical}|\n`;
        md += `|High|${summary.high}|\n`;
        md += `|Medium|${summary.medium}|\n`;
        md += `|Low|${summary.low}|\n`;
        md += `|Medication Related|${summary.medicationDuplicates}|\n\n`;

        md += "---\n\n";

        for (const duplicate of this.duplicates) {

            md += `## ${duplicate.name}\n\n`;

            md += `**Kind:** ${duplicate.kind}\n\n`;

            md += `**Severity:** ${duplicate.severity}\n\n`;

            md += "**Files**\n\n";

            duplicate.files.forEach(file => {

                md += `- ${file}\n`;

            });

            md += "\n";

            md += "**Recommendation**\n\n";

            md += `Canonical: ${duplicate.recommendation.canonical}\n\n`;

            md += `${duplicate.recommendation.action}\n\n`;

            md += "---\n\n";

        }

        return md;

    }

    /**
     * ------------------------------------------------------------
     * Console Summary
     * ------------------------------------------------------------
     */

    printSummary() {

        const summary = this.getSummary();

        console.log("");

        console.log("======================================");

        console.log("     DUPLICATE DETECTOR SUMMARY");

        console.log("======================================");

        console.log("");

        console.log("Total Duplicates :", summary.totalDuplicates);

        console.log("Critical         :", summary.critical);

        console.log("High             :", summary.high);

        console.log("Medium           :", summary.medium);

        console.log("Low              :", summary.low);

        console.log("");

        console.log("Medication Related :", summary.medicationDuplicates);

        console.log("");

    }

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function buildDuplicateReport(symbolIndex) {

    const detector = new DuplicateDetector(symbolIndex);

    return detector.analyze();

}

module.exports = {

    DuplicateDetector,

    buildDuplicateReport

};