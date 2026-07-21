#!/usr/bin/env tsx

/**
 * ------------------------------------------------------------
 * CAREVR
 * CAREVR Domain Scaffold Generator
 *
 * Creates ONLY missing folders/files.
 * Existing files are NEVER overwritten.
 *
 * Future:
 *  - Auto barrel exports
 *  - Template registry
 *  - Domain generators
 * ------------------------------------------------------------
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const BASE = path.join(ROOT, "lib", "journey");

interface ModuleDefinition {
    folder: string;
    description: string;
    files: string[];
}

const MODULES: ModuleDefinition[] = [

    {
        folder: "classification",
        description: "Clinical classification",
        files: [
            "index.ts",
            "journeyClassificationEngine.ts",
            "consultationClassifier.ts",
            "classificationTypes.ts",
            "classificationRules.ts",
            "classificationMapper.ts",
            "classificationRepository.ts",
            "classificationStorage.ts",
            "classificationValidator.ts",
            "models/classificationModel.ts",
        ],
    },

    {
        folder: "consultation",
        description: "Consultation Resolution",
        files: [
            "index.ts",
            "consultationEngine.ts",
            "consultationResolver.ts",
            "consultationTypes.ts",
            "consultationMapper.ts",
            "consultationValidator.ts",
            "models/consultationModel.ts",
        ],
    },

    {
        folder: "comparison",
        description: "Prescription Comparison",
        files: [
            "index.ts",
            "comparisonEngine.ts",
            "prescriptionComparator.ts",
            "comparisonTypes.ts",
            "comparisonMapper.ts",
            "comparisonValidator.ts",
            "models/comparisonModel.ts",
        ],
    },

    {
        folder: "scenarios",
        description: "Scenario Detection",
        files: [
            "index.ts",
            "scenarioEngine.ts",
            "scenarioResolver.ts",
            "scenarioRegistry.ts",
            "scenarioTypes.ts",
            "scenarioRules.ts",
            "scenarioValidator.ts",
            "models/scenarioModel.ts",
        ],
    },

    {
        folder: "questions",
        description: "Adaptive Questions",
        files: [
            "index.ts",
            "questionEngine.ts",
            "questionResolver.ts",
            "questionRegistry.ts",
            "questionTypes.ts",
            "questionValidator.ts",
            "models/questionModel.ts",
        ],
    },

    {
        folder: "treatment",
        description: "Treatment Decision",
        files: [
            "index.ts",
            "treatmentDecisionEngine.ts",
            "treatmentDecisionRules.ts",
            "treatmentDecisionTypes.ts",
            "treatmentDecisionMapper.ts",
            "treatmentDecisionRepository.ts",
            "treatmentDecisionStorage.ts",
            "treatmentDecisionValidator.ts",
            "models/treatmentDecisionModel.ts",
        ],
    },

    {
        folder: "activeTreatment",
        description: "Active Treatment Lifecycle",
        files: [
            "index.ts",
            "lifecycleEngine.ts",
            "lifecycleRules.ts",
            "lifecycleTypes.ts",
            "lifecycleMapper.ts",
            "lifecycleRepository.ts",
            "lifecycleStorage.ts",
            "lifecycleValidator.ts",
            "models/lifecycleModel.ts",
        ],
    },

    {
        folder: "timeline",
        description: "Timeline Builder",
        files: [
            "index.ts",
            "timelineEventGenerator.ts",
            "timelineEventBuilder.ts",
            "timelineEventRules.ts",
            "timelineEventTypes.ts",
            "timelineEventRepository.ts",
            "timelineEventStorage.ts",
            "timelineEventValidator.ts",
            "models/timelineEventModel.ts",
        ],
    },

    {
        folder: "governance",
        description: "Journey Governance",
        files: [
            "index.ts",
            "governanceEngine.ts",
            "governanceRules.ts",
            "governanceTypes.ts",
            "governanceRepository.ts",
            "governanceStorage.ts",
            "governanceValidator.ts",
            "models/governanceModel.ts",
        ],
    },

    {
        folder: "context",
        description: "Journey Context",
        files: [
            "index.ts",
            "journeyContext.ts",
            "journeyContextBuilder.ts",
            "journeyContextValidator.ts",
        ],
    },

    {
        folder: "shared",
        description: "Shared Utilities",
        files: [
            "index.ts",
            "journeyConfidence.ts",
            "journeyConstants.ts",
            "journeyHelpers.ts",
            "journeyErrors.ts",
        ],
    },

    {
        folder: "engine",
        description: "Journey Orchestrator",
        files: [
            "index.ts",
            "journeyEngine.ts",
        ],
    },

];

// ------------------------------------------------------------
// Statistics
// ------------------------------------------------------------

const stats = {
    directoriesCreated: 0,
    filesCreated: 0,
    filesSkipped: 0,
    errors: 0,
};

// ------------------------------------------------------------
// Logging
// ------------------------------------------------------------

function logSection(title: string) {

    console.log("");
    console.log("==================================================");
    console.log(` ${title}`);
    console.log("==================================================");
    console.log("");

}

function logSuccess(message: string) {

    console.log(`✅ ${message}`);

}

function logSkip(message: string) {

    console.log(`⏭ ${message}`);

}

function logError(message: string) {

    console.log(`❌ ${message}`);

}

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

function ensureDirectory(directory: string): void {

    if (fs.existsSync(directory)) {
        return;
    }

    fs.mkdirSync(directory, {
        recursive: true,
    });

    stats.directoriesCreated++;

    logSuccess(
        `Directory : ${path.relative(ROOT, directory)}`
    );

}

// ------------------------------------------------------------

function fileExists(filePath: string): boolean {

    return fs.existsSync(filePath);

}

// ------------------------------------------------------------

function writeFile(filePath: string, contents: string): void {

    ensureDirectory(path.dirname(filePath));

    fs.writeFileSync(
        filePath,
        contents,
        "utf8"
    );

}

// ------------------------------------------------------------

function createFile(filePath: string): void {

    if (fileExists(filePath)) {

        stats.filesSkipped++;

        logSkip(
            path.relative(ROOT, filePath)
        );

        return;

    }

    try {

        writeFile(
            filePath,
            createTemplate(
                path.basename(filePath)
            )
        );

        stats.filesCreated++;

        logSuccess(
            path.relative(ROOT, filePath)
        );

    }

    catch (error) {

        stats.errors++;

        logError(
            path.relative(ROOT, filePath)
        );

        console.error(error);

    }

}

// ------------------------------------------------------------

function getEntityName(fileName: string): string {

    return fileName
        .replace(".ts", "")
        .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (_, c) => c.toUpperCase());

}

// ------------------------------------------------------------

function getHeader(
    entity: string,
    type: string
): string {

    return `/**
 * ------------------------------------------------------------
 * CAREVR
 * Auto Generated
 *
 * Entity : ${entity}
 * Type   : ${type}
 *
 * Generated by scaffoldDomain.ts
 * ------------------------------------------------------------
 */

`;

}

// ------------------------------------------------------------
// Template Registry
// ------------------------------------------------------------

type TemplateGenerator = (entity: string) => string;

const TEMPLATE_REGISTRY: Record<string, TemplateGenerator> = {

    Engine: engineTemplate,
    Resolver: resolverTemplate,
    Repository: repositoryTemplate,
    Storage: storageTemplate,
    Mapper: mapperTemplate,
    Validator: validatorTemplate,
    Builder: builderTemplate,
    Registry: registryTemplate,
    Rules: rulesTemplate,
    Types: typesTemplate,
    Model: modelTemplate,
    Context: contextTemplate,
    Classifier: classifierTemplate,

};

// ------------------------------------------------------------

function createTemplate(fileName: string): string {

    if (fileName === "index.ts") {
        return barrelTemplate();
    }

    const entity = getEntityName(fileName);

    for (const suffix of Object.keys(TEMPLATE_REGISTRY)) {

        if (fileName.endsWith(`${suffix}.ts`)) {
            return TEMPLATE_REGISTRY[suffix](entity);
        }

    }

    return defaultTemplate(entity);

}

// ------------------------------------------------------------
// Templates
// ------------------------------------------------------------

function barrelTemplate(): string {

    return `/**
 * CAREVR Barrel Export
 */

`;

}

function defaultTemplate(entity: string): string {

    return `${getHeader(entity, "Default")}export {};\n`;

}

function engineTemplate(entity: string): string {

    return `${getHeader(entity, "Engine")}
export class ${entity} {

    public execute(): void {

        // TODO

    }

}
`;

}

function resolverTemplate(entity: string): string {

    return `${getHeader(entity, "Resolver")}
export class ${entity} {

    public resolve(): void {

        // TODO

    }

}
`;

}

function mapperTemplate(entity: string): string {

    return `${getHeader(entity, "Mapper")}
export class ${entity} {

    public map(): void {

        // TODO

    }

}
`;

}

function validatorTemplate(entity: string): string {

    return `${getHeader(entity, "Validator")}
export class ${entity} {

    public validate(): boolean {

        return true;

    }

}
`;

}

function repositoryTemplate(entity: string): string {

    return `${getHeader(entity, "Repository")}
export class ${entity} {

}
`;

}

function storageTemplate(entity: string): string {

    return `${getHeader(entity, "Storage")}
export class ${entity} {

}
`;

}

function builderTemplate(entity: string): string {

    return `${getHeader(entity, "Builder")}
export class ${entity} {

    public build(): void {

    }

}
`;

}

function registryTemplate(entity: string): string {

    return `${getHeader(entity, "Registry")}
export class ${entity} {

}
`;

}

function classifierTemplate(entity: string): string {

    return `${getHeader(entity, "Classifier")}
export class ${entity} {

    public classify(): void {

    }

}
`;

}

function rulesTemplate(entity: string): string {

    return `${getHeader(entity, "Rules")}
export const ${entity} = {

};
`;

}

function typesTemplate(entity: string): string {

    return `${getHeader(entity, "Types")}
export enum ${entity} {

}
`;

}

function contextTemplate(entity: string): string {

    return `${getHeader(entity, "Context")}
export interface ${entity} {

}
`;

}

function modelTemplate(entity: string): string {

    return `${getHeader(entity, "Model")}
export interface ${entity} {

}
`;
}

// ------------------------------------------------------------
// Scaffold Module
// ------------------------------------------------------------

function scaffoldModule(module: ModuleDefinition): void {

    logSection(module.folder.toUpperCase());

    const moduleDirectory = path.join(
        BASE,
        module.folder
    );

    ensureDirectory(moduleDirectory);

    console.log(`📦 ${module.description}`);
    console.log("");

    for (const file of module.files) {

        createFile(
            path.join(
                moduleDirectory,
                file
            )
        );

    }

}

// ------------------------------------------------------------
// Scaffold All Modules
// ------------------------------------------------------------

function scaffold(): void {

    logSection("CAREVR JOURNEY SCAFFOLD");

    ensureDirectory(BASE);

    for (const module of MODULES) {

        scaffoldModule(module);

    }

    printSummary();

}

// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------

function printSummary(): void {

    console.log("");
    console.log("==================================================");
    console.log(" Scaffold Summary");
    console.log("==================================================");
    console.log("");

    console.table({

        DirectoriesCreated: stats.directoriesCreated,

        FilesCreated: stats.filesCreated,

        FilesSkipped: stats.filesSkipped,

        Errors: stats.errors,

        Modules: MODULES.length,

    });

    console.log("");

    if (stats.errors === 0) {

        console.log("🎉 Scaffold completed successfully.");

    } else {

        console.log("⚠ Scaffold completed with errors.");

    }

    console.log("");

}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

scaffold();