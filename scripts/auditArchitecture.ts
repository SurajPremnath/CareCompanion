#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "architecture");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "architecture-audit.md");

const IGNORE = new Set([
    ".git",
    ".next",
    "node_modules",
    ".vercel",
    "dist",
    "build",
    "coverage",
    "architecture"
]);

const EXTENSIONS = new Set([
    ".ts",
    ".tsx"
]);

interface AuditResult {

    file: string;

    folder: string;

    lines: number;

    empty: boolean;

    imports: number;

    exports: number;

    interfaces: number;

    classes: number;

    enums: number;

    functions: number;

    todos: number;

    fixmes: number;

    status: string;

    responsibility: string;

}

const results: AuditResult[] = [];

function scan(folder: string) {

    const entries = fs.readdirSync(folder, {
        withFileTypes: true
    });

    for (const entry of entries) {

        const full = path.join(folder, entry.name);

        if (entry.isDirectory()) {

            if (IGNORE.has(entry.name))
                continue;

            scan(full);
            continue;
        }

        if (!EXTENSIONS.has(path.extname(entry.name)))
            continue;

        analyse(full);

    }

}

function count(regex: RegExp, text: string) {

    return [...text.matchAll(regex)].length;

}

function determineStatus(
    empty: boolean,
    lines: number,
    imports: number,
    exports: number
) {

    if (empty)
        return "EMPTY";

    if (lines < 20)
        return "MINIMAL";

    if (imports === 0 && exports === 0)
        return "ISOLATED";

    return "ACTIVE";

}

function determineResponsibility(file: string) {

    const lower = file.toLowerCase();

    if (lower.includes("storage"))
        return "Storage Layer";

    if (lower.includes("repository"))
        return "Repository Layer";

    if (lower.includes("mapper"))
        return "Mapper";

    if (lower.includes("builder"))
        return "Builder";

    if (lower.includes("validator"))
        return "Validation";

    if (lower.includes("engine"))
        return "Business Engine";

    if (lower.includes("service"))
        return "Service";

    if (lower.includes("route"))
        return "API Endpoint";

    if (lower.includes("page"))
        return "Page";

    if (lower.includes("provider"))
        return "Provider";

    if (lower.includes("context"))
        return "Context";

    if (lower.includes("type"))
        return "Domain Types";

    if (lower.includes("model"))
        return "Model";

    return "General";

}

function analyse(file: string) {

    const text = fs.readFileSync(file, "utf8");

    const lines = text.split(/\r?\n/);

    const imports = count(/^import /gm, text);

    const exports = count(/^export /gm, text);

    const interfaces = count(/\binterface\b/g, text);

    const classes = count(/\bclass\b/g, text);

    const enums = count(/\benum\b/g, text);

    const functions =
        count(/\bfunction\b/g, text) +
        count(/=>/g, text);

    const todos = count(/TODO/gi, text);

    const fixmes = count(/FIXME/gi, text);

    const empty = text.trim().length === 0;

    results.push({

        file: path.relative(ROOT, file),

        folder: path.relative(ROOT, path.dirname(file)),

        lines: lines.length,

        empty,

        imports,

        exports,

        interfaces,

        classes,

        enums,

        functions,

        todos,

        fixmes,

        status: determineStatus(
            empty,
            lines.length,
            imports,
            exports
        ),

        responsibility: determineResponsibility(file)

    });

}

scan(ROOT);

if (!fs.existsSync(OUTPUT_DIR))
    fs.mkdirSync(OUTPUT_DIR);

let md = "# CareVR Architecture Audit\n\n";

md += `Generated : ${new Date().toLocaleString()}\n\n`;

md += `Files : ${results.length}\n\n`;

const grouped = new Map<string, AuditResult[]>();

for (const item of results) {

    if (!grouped.has(item.folder))
        grouped.set(item.folder, []);

    grouped.get(item.folder)!.push(item);

}

const folders = [...grouped.keys()].sort();

for (const folder of folders) {

    const files = grouped.get(folder)!;

    md += "---\n\n";

    md += `# ${folder}\n\n`;

    md += `Files : ${files.length}\n\n`;

    md += "|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|\n";
    md += "|---|---|---|---:|---:|---:|---:|\n";

    files.sort((a,b)=>a.file.localeCompare(b.file));

    for (const f of files) {

        md += `|${path.basename(f.file)}|${f.status}|${f.responsibility}|${f.lines}|${f.interfaces}|${f.classes}|${f.functions}|\n`;

    }

    md += "\n";

}

md += "---\n\n";

md += "# Empty Files\n\n";

results
.filter(x=>x.empty)
.forEach(x=>{

    md += `- ${x.file}\n`;

});

md += "\n---\n\n";

md += "# Files Larger Than 1000 LOC\n\n";

results
.filter(x=>x.lines>1000)
.sort((a,b)=>b.lines-a.lines)
.forEach(x=>{

    md += `- ${x.file} (${x.lines} LOC)\n`;

});

md += "\n---\n\n";

md += "# TODO / FIXME\n\n";

results
.filter(x=>x.todos>0 || x.fixmes>0)
.forEach(x=>{

    md += `- ${x.file} (TODO:${x.todos}, FIXME:${x.fixmes})\n`;

});

fs.writeFileSync(OUTPUT_FILE, md);

console.log("");
console.log("========================================");
console.log(" CAREVR ARCHITECTURE AUDIT COMPLETE");
console.log("========================================");
console.log("");
console.log(`Files Audited : ${results.length}`);
console.log(`Report        : architecture/architecture-audit.md`);
console.log("");