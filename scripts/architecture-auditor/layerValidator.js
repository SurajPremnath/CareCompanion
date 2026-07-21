/**
 * ============================================================
 * CAREVR Architecture Auditor
 * Layer Validator
 * ------------------------------------------------------------
 * Validates architectural rules between project layers.
 * ============================================================
 */

class LayerValidator {

    constructor(files, dependencyGraph) {

        this.files = files;
        this.graph = dependencyGraph;

        this.violations = [];

        this.statistics = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        };

    }

    analyze() {

        this.violations = [];

        for (const file of this.files) {

            this.validateFile(file);

        }

        this.calculateStatistics();

        return this;

    }

    validateFile(file) {

        const sourceLayer =
            this.getLayer(file.path);

        const dependencies =
            this.graph.getDependencies(file.path);

        for (const dependency of dependencies) {

            const targetLayer =
                this.getLayer(dependency);

            this.validateRule(

                file.path,

                sourceLayer,

                dependency,

                targetLayer

            );

        }

    }

    getLayer(file) {

        const path =
            file.replace(/\\/g, "/").toLowerCase();

        if (path.startsWith("app/"))
            return "UI";

        if (path.includes("/components/"))
            return "Component";

        if (path.includes("/storage/"))
            return "Storage";

        if (path.includes("/repository/"))
            return "Repository";

        if (path.includes("/mapper/"))
            return "Mapper";

        if (path.includes("/database/"))
            return "Database";

        if (path.includes("supabase"))
            return "Database";

        return "Other";

    }

    validateRule(
        source,
        sourceLayer,
        target,
        targetLayer
    ) {

        const allowed = {

            UI: [
                "Component",
                "Storage",
                "Other"
            ],

            Component: [
                "Storage",
                "Other"
            ],

            Storage: [
                "Repository",
                "Other"
            ],

            Repository: [
                "Mapper",
                "Database",
                "Other"
            ],

            Mapper: [
                "Database",
                "Other"
            ],

            Database: []

        };

        const valid =
            (allowed[sourceLayer] || [])
                .includes(targetLayer);

        if (valid)
            return;

        this.violations.push({

            severity: "Critical",

            source,

            sourceLayer,

            target,

            targetLayer,

            rule:

                `${sourceLayer} cannot depend on ${targetLayer}`

        });

    }

    calculateStatistics() {

        this.statistics = {

            critical: this.violations.length,

            high: 0,

            medium: 0,

            low: 0

        };

    }

    getSummary() {

        return {

            ...this.statistics,

            totalViolations:
                this.violations.length

        };

    }

    toJSON() {

        return {

            summary: this.getSummary(),

            violations: this.violations

        };

    }

    toMarkdown() {

        let md = "";

        md += "# Layer Validation\n\n";

        md += "## Summary\n\n";

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";
        md += `|Critical|${this.statistics.critical}|\n`;
        md += `|Total|${this.violations.length}|\n\n`;

        md += "---\n\n";

        for (const violation of this.violations) {

            md += `## ${violation.source}\n\n`;

            md += `Rule : ${violation.rule}\n\n`;

            md += `Target : ${violation.target}\n\n`;

            md += `Severity : ${violation.severity}\n\n`;

            md += "---\n\n";

        }

        return md;

    }

}

function buildLayerValidation(
    files,
    dependencyGraph
) {

    return new LayerValidator(
        files,
        dependencyGraph
    ).analyze();

}

module.exports = {

    LayerValidator,

    buildLayerValidation

};