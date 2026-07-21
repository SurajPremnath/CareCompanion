#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const OUTPUT = path.join(ROOT, "architecture");

const OUTPUT_FILE = path.join(
    OUTPUT,
    "project-discovery.md"
);

const IGNORE = new Set([
    ".git",
    ".next",
    "node_modules",
    ".vercel",
    "coverage",
    "dist",
    "build",
]);

const EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
]);

interface FileInfo {

    path: string;

    lines: number;

    size: number;

    imports: string[];

    exports: string[];

    interfaces: string[];

    classes: string[];

    enums: string[];

    functions: string[];

    empty: boolean;

}

const files: FileInfo[] = [];

function scan(folder: string) {

    const entries = fs.readdirSync(folder, {
        withFileTypes: true,
    });

    for (const entry of entries) {

        const full = path.join(folder, entry.name);

        if (entry.isDirectory()) {

            if (IGNORE.has(entry.name)) continue;

            scan(full);

            continue;

        }

        if (!EXTENSIONS.has(path.extname(entry.name))) continue;

        analyse(full);

    }

}

function extract(regex: RegExp, text: string) {

    return [...text.matchAll(regex)].map(x => x[1]);

}

function analyse(file: string) {

    const text = fs.readFileSync(file, "utf8");

    const lines = text.split(/\r?\n/);

    files.push({

        path: path.relative(ROOT, file),

        size: Buffer.byteLength(text),

        lines: lines.length,

        imports: extract(/import\s+.*?from\s+["'](.+?)["']/g, text),

        exports: extract(/export\s+(?:class|interface|enum|function|const|type)\s+([A-Za-z0-9_]+)/g, text),

        interfaces: extract(/interface\s+([A-Za-z0-9_]+)/g, text),

        classes: extract(/class\s+([A-Za-z0-9_]+)/g, text),

        enums: extract(/enum\s+([A-Za-z0-9_]+)/g, text),

        functions: extract(/function\s+([A-Za-z0-9_]+)/g, text),

        empty: text.trim().length === 0,

    });

}

scan(ROOT);

if (!fs.existsSync(OUTPUT)) {

    fs.mkdirSync(OUTPUT);

}

let report = "";

report += "# CareVR Project Discovery\n\n";

report += `Generated: ${new Date().toLocaleString()}\n\n`;

report += `Total Files: ${files.length}\n\n`;

for (const file of files.sort((a, b) => a.path.localeCompare(b.path))) {

    report += "---\n\n";

    report += `## ${file.path}\n\n`;

    report += `Lines : ${file.lines}\n`;

    report += `Size  : ${file.size} bytes\n`;

    report += `Empty : ${file.empty ? "YES" : "NO"}\n\n`;

    if (file.imports.length) {

        report += "### Imports\n";

        file.imports.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

    if (file.exports.length) {

        report += "### Exports\n";

        file.exports.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

    if (file.interfaces.length) {

        report += "### Interfaces\n";

        file.interfaces.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

    if (file.classes.length) {

        report += "### Classes\n";

        file.classes.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

    if (file.enums.length) {

        report += "### Enums\n";

        file.enums.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

    if (file.functions.length) {

        report += "### Functions\n";

        file.functions.forEach(x => report += `- ${x}\n`);

        report += "\n";

    }

}

fs.writeFileSync(OUTPUT_FILE, report);

console.log("");
console.log("======================================");
console.log(" CareVR Project Discovery Complete");
console.log("======================================");
console.log("");
console.log(`Files Analysed : ${files.length}`);
console.log("");
console.log(`Report : ${path.relative(ROOT, OUTPUT_FILE)}`);
console.log("");