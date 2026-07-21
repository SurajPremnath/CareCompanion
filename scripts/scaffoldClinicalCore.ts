#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const BASE = path.join(ROOT, "lib", "core", "clinical");

type FolderDefinition = {
    folder: string;
    files: string[];
};

const MODULES: FolderDefinition[] = [
    {
        folder: "",
        files: [
            "index.ts",
            "clinicalEnums.ts",
            "clinicalConstants.ts",
            "confidence.ts",
            "metadata.ts",
            "identifiers.ts",
            "journeyContext.ts",
            "patient.ts",
            "consultation.ts",
            "prescription.ts",
            "comparison.ts",
            "reconciliation.ts",
            "treatment.ts",
            "timeline.ts",
            "governance.ts",
        ],
    },
];

let createdDirectories = 0;
let createdFiles = 0;
let skippedFiles = 0;

function ensureDirectory(directory: string) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        createdDirectories++;
        console.log(`📁 Created directory: ${path.relative(ROOT, directory)}`);
    }
}

function createTemplate(fileName: string): string {

    switch (fileName) {

        case "index.ts":
            return `// Clinical Domain Exports

export * from "./clinicalEnums";
export * from "./clinicalConstants";
export * from "./confidence";
export * from "./metadata";
export * from "./identifiers";
export * from "./journeyContext";
export * from "./patient";
export * from "./consultation";
export * from "./prescription";
export * from "./comparison";
export * from "./reconciliation";
export * from "./treatment";
export * from "./timeline";
export * from "./governance";
`;

        default:
            return `/**
 * ------------------------------------------------------------------
 * CareVR Clinical Core
 * ------------------------------------------------------------------
 * File: ${fileName}
 *
 * Purpose:
 * TODO
 *
 * NOTE:
 * Scaffold generated.
 * Business logic to be implemented later.
 * ------------------------------------------------------------------
 */

export {};
`;
    }
}

function createFile(filePath: string) {

    if (fs.existsSync(filePath)) {
        skippedFiles++;
        console.log(`⏭ Skipped: ${path.relative(ROOT, filePath)}`);
        return;
    }

    ensureDirectory(path.dirname(filePath));

    fs.writeFileSync(
        filePath,
        createTemplate(path.basename(filePath)),
        "utf8"
    );

    createdFiles++;

    console.log(`✅ Created: ${path.relative(ROOT, filePath)}`);

}

console.log("");
console.log("=================================================");
console.log("      CareVR Clinical Core Scaffold");
console.log("=================================================");
console.log("");

ensureDirectory(BASE);

for (const module of MODULES) {

    const moduleFolder = path.join(BASE, module.folder);

    ensureDirectory(moduleFolder);

    for (const file of module.files) {

        createFile(path.join(moduleFolder, file));

    }

}

console.log("");
console.log("=================================================");
console.log(" Scaffold Complete");
console.log("=================================================");
console.log(`Directories Created : ${createdDirectories}`);
console.log(`Files Created       : ${createdFiles}`);
console.log(`Files Skipped       : ${skippedFiles}`);
console.log("=================================================");
console.log("");