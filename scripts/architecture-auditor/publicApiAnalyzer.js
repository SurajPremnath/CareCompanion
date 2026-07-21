/**
 * ============================================================
 * CAREVR Architecture Auditor
 * Public API Analyzer
 * ------------------------------------------------------------
 * Analyses exported project APIs and identifies:
 *  - Public APIs
 *  - Dead exports
 *  - Internal-only modules
 *  - Medication Management APIs
 * ============================================================
 */

class PublicApiAnalyzer {

    constructor(files, dependencyGraph) {

        this.files = files;

        this.graph = dependencyGraph;

        this.modules = [];

        this.statistics = {

            totalModules: 0,

            publicModules: 0,

            internalModules: 0,

            deadModules: 0,

            medicationModules: 0

        };

    }

    analyze() {

        this.modules = [];

        for (const file of this.files) {

            this.modules.push(

                this.analyzeModule(file)

            );

        }

        this.calculateStatistics();

        return this;

    }

analyzeModule(file) {

    const dependencies =
        this.graph.getDependencies(file.path);

    const dependents =
        this.graph.getDependents(file.path);

    const analysis =
        file.analysis || {};

    const exports =
        analysis.exports || [];

    const isMedication =
        this.isMedicationModule(file.path);

    const isFrameworkEntry =
        this.isFrameworkEntry(file.path);

    const path =
        file.path.toLowerCase();

    const isBarrel =
        path.endsWith("/index.ts") ||
        path.endsWith("\\index.ts");

    const isTypes =
        /types?\.ts$/.test(path);

    const isModel =
        /models?\.ts$/.test(path);

    const isConstants =
        /constants?\.ts$/.test(path);

    const isUtility =
        /utils?\.ts$/.test(path);

    const isValidation =
        path.includes("validator") ||
        path.includes("validation");

    const hasExports =
        exports.length > 0;

    const isPublic =
        isFrameworkEntry ||
        dependents.length > 0;

    const isDead =
        !isFrameworkEntry &&
        !isBarrel &&
        !isTypes &&
        !isModel &&
        !isConstants &&
        !isUtility &&
        !isValidation &&
        hasExports &&
        dependents.length === 0;

    return {

        file: file.path,

        exports,

        dependencyCount: dependencies.length,

        dependentCount: dependents.length,

        isFrameworkEntry,

        isPublic,

        isDead,

        isMedication,

        isBarrel,

        hasExports,

        dependencies,

        dependents

    };

}

    isMedicationModule(file) {

        const value =
            file.toLowerCase();

        return (

            value.includes("medication") ||

            value.includes("medicine") ||

            value.includes("prescription") ||

            value.includes("consultation") ||

            value.includes("dosage") ||

            value.includes("frequency") ||

            value.includes("duration") ||

            value.includes("timing")

        );

    }

isFrameworkEntry(file) {

    const value =
        file.replace(/\\/g, "/").toLowerCase();

    return (

        value === "middleware.ts" ||

        value === "instrumentation.ts" ||

        value.endsWith("/page.tsx") ||

        value.endsWith("/layout.tsx") ||

        value.endsWith("/loading.tsx") ||

        value.endsWith("/error.tsx") ||

        value.endsWith("/not-found.tsx") ||

        value.includes("/app/api/") &&
        value.endsWith("/route.ts")

    );

}


    calculateStatistics() {

        this.statistics = {

            totalModules: this.modules.length,

            publicModules: 0,

            internalModules: 0,

            deadModules: 0,

            medicationModules: 0

        };

        for (const module of this.modules) {

            if (module.isPublic)
                this.statistics.publicModules++;
            else
                this.statistics.internalModules++;

            if (module.isDead)
                this.statistics.deadModules++;

            if (module.isMedication)
                this.statistics.medicationModules++;

        }

    }
    /**
     * ------------------------------------------------------------
     * Get Public Modules
     * ------------------------------------------------------------
     */

    getPublicModules() {

        return this.modules.filter(module => module.isPublic);

    }

    /**
     * ------------------------------------------------------------
     * Get Internal Modules
     * ------------------------------------------------------------
     */

    getInternalModules() {

        return this.modules.filter(module => !module.isPublic);

    }

    /**
     * ------------------------------------------------------------
     * Get Dead Modules
     * ------------------------------------------------------------
     */

    getDeadModules() {

        return this.modules.filter(module => module.isDead);

    }

    /**
     * ------------------------------------------------------------
     * Get Medication Modules
     * ------------------------------------------------------------
     */

    getMedicationModules() {

        return this.modules.filter(module => module.isMedication);

    }

    /**
     * ------------------------------------------------------------
     * Get Module
     * ------------------------------------------------------------
     */

    getModule(file) {

        return this.modules.find(module => module.file === file);

    }

    /**
     * ------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------
     */

    validate() {

        const issues = [];

        for (const module of this.modules) {

            if (
                module.isMedication &&
                module.isDead
            ) {

                issues.push({

                    type: "DeadMedicationModule",

                    file: module.file

                });

            }

            if (
                module.isMedication &&
                module.exports.length === 0
            ) {

                issues.push({

                    type: "MedicationModuleWithoutExports",

                    file: module.file

                });

            }

        }

        return issues;

    }

    /**
     * ------------------------------------------------------------
     * Summary
     * ------------------------------------------------------------
     */

    getSummary() {

        return {

            ...this.statistics,

            validationIssues:
                this.validate().length

        };

    }

    /**
     * ------------------------------------------------------------
     * JSON Export
     * ------------------------------------------------------------
     */

    toJSON() {

        return {

            summary: this.getSummary(),

            modules: this.modules,

            validation: this.validate()

        };

    }

    /**
     * ------------------------------------------------------------
     * Markdown Export
     * ------------------------------------------------------------
     */

    toMarkdown() {

        let md = "";

        md += "# Public API Analysis\n\n";

        md += "## Summary\n\n";

        const summary = this.getSummary();

        md += "|Metric|Value|\n";
        md += "|------|----:|\n";
        md += `|Modules|${summary.totalModules}|\n`;
        md += `|Public|${summary.publicModules}|\n`;
        md += `|Internal|${summary.internalModules}|\n`;
        md += `|Dead|${summary.deadModules}|\n`;
        md += `|Medication|${summary.medicationModules}|\n`;
        md += `|Validation Issues|${summary.validationIssues}|\n\n`;

        md += "---\n\n";

        for (const module of this.modules) {

            md += `## ${module.file}\n\n`;

            md += `**Public:** ${module.isPublic}\n\n`;

            md += `**Dead:** ${module.isDead}\n\n`;

            md += `**Medication:** ${module.isMedication}\n\n`;

            md += `Dependencies : ${module.dependencyCount}\n\n`;

            md += `Dependents : ${module.dependentCount}\n\n`;

            if (module.dependencies.length) {

                md += "**Dependencies**\n\n";

                module.dependencies.forEach(dep => {

                    md += `- ${dep}\n`;

                });

                md += "\n";

            }

            if (module.dependents.length) {

                md += "**Dependents**\n\n";

                module.dependents.forEach(dep => {

                    md += `- ${dep}\n`;

                });

                md += "\n";

            }

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

        console.log("       PUBLIC API ANALYZER");

        console.log("======================================");

        console.log("");

        console.log("Modules             :", summary.totalModules);

        console.log("Public              :", summary.publicModules);

        console.log("Internal            :", summary.internalModules);

        console.log("Dead                :", summary.deadModules);

        console.log("Medication          :", summary.medicationModules);

        console.log("Validation Issues   :", summary.validationIssues);

        console.log("");

    }

}

/**
 * ============================================================
 * Factory
 * ============================================================
 */

function buildPublicApiAnalysis(files, dependencyGraph) {

    const analyzer = new PublicApiAnalyzer(

        files,

        dependencyGraph

    );

    return analyzer.analyze();

}

module.exports = {

    PublicApiAnalyzer,

    buildPublicApiAnalysis

};