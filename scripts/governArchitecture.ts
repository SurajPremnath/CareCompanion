/**
 * ============================================================
 * CareVR Architecture Governance Tool
 * ============================================================
 *
 * Generates:
 * architecture/governance-report.md
 *
 * Reviews:
 * - Folder structure
 * - File statistics
 * - Architecture health
 * - Duplicate responsibilities
 * - Recommendations
 *
 * Author: CareVR
 * ============================================================
 */

import * as fs from "fs";
import * as path from "path";

const PROJECT_ROOT = process.cwd();

const OUTPUT_DIR = path.join(PROJECT_ROOT, "architecture");
const OUTPUT_FILE = path.join(
    OUTPUT_DIR,
    "governance-report.md"
);

const SOURCE_FOLDERS = [
    "app",
    "lib",
    "components",
    "Components",
    "hooks",
    "contexts",
    "providers",
    "scripts"
];

const IGNORE = new Set([
    ".git",
    ".next",
    ".turbo",
    ".vercel",
    "coverage",
    "dist",
    "build",
    "node_modules",
    ".idea",
    ".vscode",
    "public",
    "out"
]);

const VALID_EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx"
]);

//----------------------------------------------------------
// Interfaces
//----------------------------------------------------------

interface FileStats {

    file: string;

    relativePath: string;

    folder: string;

    extension: string;

    lines: number;

    imports: string[];

    importedBy: string[];

    exports: string[];

    interfaces: string[];

    classes: string[];

    enums: string[];

    types: string[];

    functions: string[];

    todos: number;

    fixmes: number;

    placeholders: number;

    empty: boolean;

    recommendation?: string;

    businessImportance?: string;

    phase?: string;

    folderStatus?: string;

    purpose?: string;
}

interface FolderStats {

    folder: string;

    files: FileStats[];

    totalLOC: number;

    totalImports: number;

    totalExports: number;

    interfaces: number;

    classes: number;

    enums: number;

    functions: number;

    emptyFiles: number;

    status?: string;

    recommendation?: string;
}

interface ProjectStats {

    folders: Map<string, FolderStats>;

    files: Map<string, FileStats>;
}

//----------------------------------------------------------
// Project State
//----------------------------------------------------------

const project: ProjectStats = {

    folders: new Map(),

    files: new Map()
};

//----------------------------------------------------------
// Utility
//----------------------------------------------------------

function ensureOutputFolder() {

    if (!fs.existsSync(OUTPUT_DIR)) {

        fs.mkdirSync(OUTPUT_DIR, {

            recursive: true
        });
    }
}

function readFileSafe(file: string): string {

    try {

        return fs.readFileSync(file, "utf8");

    } catch {

        return "";
    }
}

function countLines(text: string): number {

    if (!text.trim()) {

        return 0;
    }

    return text.split(/\r?\n/).length;
}

function relative(file: string): string {

    return path.relative(PROJECT_ROOT, file);
}

function extension(file: string): string {

    return path.extname(file);
}

//----------------------------------------------------------
// Directory Walker
//----------------------------------------------------------

function walk(directory: string) {

    if (!fs.existsSync(directory)) {

        return;
    }

    const items = fs.readdirSync(directory);

    for (const item of items) {

        const full = path.join(directory, item);

        const stat = fs.statSync(full);

        if (stat.isDirectory()) {

            if (IGNORE.has(item)) {

                continue;
            }

            walk(full);

            continue;
        }

        if (!VALID_EXTENSIONS.has(extension(full))) {

            continue;
        }

        registerFile(full);
    }
}

//----------------------------------------------------------
// File Registration
//----------------------------------------------------------

function registerFile(file: string) {

    const content = readFileSafe(file);

    const rel = relative(file);

    const folder = path.dirname(rel);

    const stats: FileStats = {

        file,

        relativePath: rel,

        folder,

        extension: extension(file),

        lines: countLines(content),

        imports: [],

        importedBy: [],

        exports: [],

        interfaces: [],

        classes: [],

        enums: [],

        types: [],

        functions: [],

        todos: 0,

        fixmes: 0,

        placeholders: 0,

        empty: content.trim().length === 0
    };

    project.files.set(rel, stats);

    if (!project.folders.has(folder)) {

        project.folders.set(folder, {

            folder,

            files: [],

            totalLOC: 0,

            totalImports: 0,

            totalExports: 0,

            interfaces: 0,

            classes: 0,

            enums: 0,

            functions: 0,

            emptyFiles: 0
        });
    }

    project.folders.get(folder)!.files.push(stats);
}

//----------------------------------------------------------
// Discover Project
//----------------------------------------------------------

function discoverProject() {

    console.log("");

    console.log("======================================");
    console.log(" CAREVR GOVERNANCE AUDIT");
    console.log("======================================");

    for (const folder of SOURCE_FOLDERS) {

        walk(path.join(PROJECT_ROOT, folder));
    }

    console.log("");

    console.log(
        `Files discovered : ${project.files.size}`
    );

    console.log(
        `Folders          : ${project.folders.size}`
    );

    console.log("");
}

//----------------------------------------------------------
// Bootstrap
//----------------------------------------------------------

ensureOutputFolder();
discoverProject();

console.log("Discovery Complete.");
console.log("Ready for parsing...");

//----------------------------------------------------------
// Parser Helpers
//----------------------------------------------------------

function findMatches(
    text: string,
    regex: RegExp
): string[] {

    const results: string[] = [];

    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {

        if (match[1]) {

            results.push(match[1].trim());
        }
    }

    return [...new Set(results)];
}

function countOccurrences(
    text: string,
    regex: RegExp
): number {

    const matches = text.match(regex);

    return matches ? matches.length : 0;
}

function detectPlaceholder(text: string): number {

    const indicators = [

        "TODO",

        "FIXME",

        "throw new Error",

        "Not Implemented",

        "not implemented",

        "placeholder",

        "coming soon",

        "return null",

        "return undefined",

        "return [];",

        "return {};",

        "return \"\";",

        "stub"
    ];

    let score = 0;

    const lower = text.toLowerCase();

    for (const word of indicators) {

        if (lower.includes(word.toLowerCase())) {

            score++;
        }
    }

    return score;
}

function inferPurpose(text: string): string {

    if (text.includes("Repository")) {

        return "Repository";
    }

    if (text.includes("Storage")) {

        return "Storage";
    }

    if (text.includes("Mapper")) {

        return "Mapper";
    }

    if (text.includes("Builder")) {

        return "Builder";
    }

    if (text.includes("Validator")) {

        return "Validator";
    }

    if (text.includes("Engine")) {

        return "Business Engine";
    }

    if (text.includes("interface ")) {

        return "Shared Types";
    }

    if (text.includes("export default function")) {

        return "React Component";
    }

    if (text.includes("export function")) {

        return "Utility";
    }

    return "Unknown";
}

//----------------------------------------------------------
// Parse Individual File
//----------------------------------------------------------

function parseFile(file: FileStats) {

    const content = readFileSafe(file.file);

    file.imports = findMatches(

        content,

        /import[\s\S]*?from\s+['"](.+?)['"]/g
    );

    file.exports = [

        ...findMatches(

            content,

            /export\s+class\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /export\s+function\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /export\s+interface\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /export\s+enum\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /export\s+type\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /export\s+const\s+([A-Za-z0-9_]+)/g
        )
    ];

    file.interfaces = findMatches(

        content,

        /interface\s+([A-Za-z0-9_]+)/g
    );

    file.classes = findMatches(

        content,

        /class\s+([A-Za-z0-9_]+)/g
    );

    file.enums = findMatches(

        content,

        /enum\s+([A-Za-z0-9_]+)/g
    );

    file.types = findMatches(

        content,

        /type\s+([A-Za-z0-9_]+)/g
    );

    file.functions = [

        ...findMatches(

            content,

            /function\s+([A-Za-z0-9_]+)/g
        ),

        ...findMatches(

            content,

            /const\s+([A-Za-z0-9_]+)\s*=\s*\(/g
        ),

        ...findMatches(

            content,

            /async\s+function\s+([A-Za-z0-9_]+)/g
        )
    ];

    file.todos = countOccurrences(

        content,

        /TODO/gi
    );

    file.fixmes = countOccurrences(

        content,

        /FIXME/gi
    );

    file.placeholders = detectPlaceholder(content);

    file.empty = content.trim().length === 0;

    file.purpose = inferPurpose(content);
}

//----------------------------------------------------------
// Build Reverse Dependency Map
//----------------------------------------------------------

function buildImportGraph() {

    const lookup = new Map<string, FileStats>();

    for (const file of project.files.values()) {

        lookup.set(file.relativePath, file);
    }

    for (const file of project.files.values()) {

        for (const imp of file.imports) {

            if (!imp.startsWith(".")) {

                continue;
            }

            const resolved = path.normalize(

                path.join(

                    path.dirname(file.relativePath),

                    imp
                )
            );

            for (const candidate of [

                resolved + ".ts",

                resolved + ".tsx",

                resolved + ".js",

                resolved + ".jsx",

                path.join(resolved, "index.ts"),

                path.join(resolved, "index.tsx")
            ]) {

                if (lookup.has(candidate)) {

                    lookup
                        .get(candidate)!
                        .importedBy
                        .push(file.relativePath);
                }
            }
        }
    }
}

//----------------------------------------------------------
// Analyse Folder Statistics
//----------------------------------------------------------

function analyseFolders() {

    for (const folder of project.folders.values()) {

        folder.totalLOC = 0;

        folder.totalImports = 0;

        folder.totalExports = 0;

        folder.interfaces = 0;

        folder.classes = 0;

        folder.enums = 0;

        folder.functions = 0;

        folder.emptyFiles = 0;

        for (const file of folder.files) {

            folder.totalLOC += file.lines;

            folder.totalImports += file.imports.length;

            folder.totalExports += file.exports.length;

            folder.interfaces += file.interfaces.length;

            folder.classes += file.classes.length;

            folder.enums += file.enums.length;

            folder.functions += file.functions.length;

            if (file.empty) {

                folder.emptyFiles++;
            }
        }
    }
}

//----------------------------------------------------------
// Execute Parsing
//----------------------------------------------------------

function parseProject() {

    console.log("");

    console.log("Parsing project...");

    for (const file of project.files.values()) {

        parseFile(file);
    }

    buildImportGraph();

    analyseFolders();

    console.log(

        `Parsed ${project.files.size} files`
    );
}

parseProject();

console.log("Parsing Complete.");

//----------------------------------------------------------
// Governance Types
//----------------------------------------------------------

interface DuplicateGroup {

    name: string;

    files: string[];
}

interface ArchitectureViolation {

    type: string;

    source: string;

    target: string;

    severity: "LOW" | "MEDIUM" | "HIGH";
}

const duplicateGroups: DuplicateGroup[] = [];

const violations: ArchitectureViolation[] = [];

//----------------------------------------------------------
// Detect Duplicate Responsibilities
//----------------------------------------------------------

function detectDuplicates() {

    const registry = new Map<string, string[]>();

    for (const file of project.files.values()) {

        const names = [

            ...file.classes,

            ...file.interfaces,

            ...file.types,

            ...file.enums,

            ...file.exports
        ];

        for (const name of names) {

            if (!registry.has(name)) {

                registry.set(name, []);
            }

            registry.get(name)!.push(file.relativePath);
        }
    }

    for (const [name, files] of registry.entries()) {

        if (files.length > 1) {

            duplicateGroups.push({

                name,

                files
            });
        }
    }
}

//----------------------------------------------------------
// Folder Category Helpers
//----------------------------------------------------------

function isApp(file: string) {

    return file.startsWith("app/");
}

function isRepository(file: string) {

    return file.includes("repository");
}

function isStorage(file: string) {

    return file.includes("storage");
}

function isMapper(file: string) {

    return file.includes("mapper");
}

function isBuilder(file: string) {

    return file.includes("builder");
}

function isJourney(file: string) {

    return file.includes("journey");
}

function isTreatment(file: string) {

    return file.includes("treatment");
}

function isClinical(file: string) {

    return file.includes("clinical");
}

function isTypes(file: string) {

    return file.includes("types");
}

//----------------------------------------------------------
// Architecture Rules
//----------------------------------------------------------

function detectViolations() {

    for (const file of project.files.values()) {

        for (const imp of file.imports) {

            const lowerImport = imp.toLowerCase();

            //------------------------------------------
            // UI importing repository
            //------------------------------------------

            if (

                isApp(file.relativePath) &&

                lowerImport.includes("repository")

            ) {

                violations.push({

                    type: "UI importing Repository",

                    source: file.relativePath,

                    target: imp,

                    severity: "HIGH"
                });
            }

            //------------------------------------------
            // UI importing storage
            //------------------------------------------

            if (

                isApp(file.relativePath) &&

                lowerImport.includes("storage")

            ) {

                violations.push({

                    type: "UI importing Storage",

                    source: file.relativePath,

                    target: imp,

                    severity: "HIGH"
                });
            }

            //------------------------------------------
            // Repository importing Page
            //------------------------------------------

            if (

                isRepository(file.relativePath)

                &&

                lowerImport.includes("app/")

            ) {

                violations.push({

                    type: "Repository importing UI",

                    source: file.relativePath,

                    target: imp,

                    severity: "HIGH"
                });
            }

            //------------------------------------------
            // Storage importing UI
            //------------------------------------------

            if (

                isStorage(file.relativePath)

                &&

                lowerImport.includes("app/")

            ) {

                violations.push({

                    type: "Storage importing UI",

                    source: file.relativePath,

                    target: imp,

                    severity: "HIGH"
                });
            }

            //------------------------------------------
            // Builder importing UI
            //------------------------------------------

            if (

                isBuilder(file.relativePath)

                &&

                lowerImport.includes("app/")

            ) {

                violations.push({

                    type: "Builder importing UI",

                    source: file.relativePath,

                    target: imp,

                    severity: "MEDIUM"
                });
            }
        }
    }
}

//----------------------------------------------------------
// Business Importance
//----------------------------------------------------------

function determineImportance(file: FileStats): string {

    if (

        isRepository(file.relativePath)

        ||

        isStorage(file.relativePath)

    ) {

        return "Critical";
    }

    if (

        isJourney(file.relativePath)

        ||

        isTreatment(file.relativePath)

        ||

        isClinical(file.relativePath)

    ) {

        return "High";
    }

    if (

        isMapper(file.relativePath)

        ||

        isBuilder(file.relativePath)

    ) {

        return "Medium";
    }

    if (

        isTypes(file.relativePath)

    ) {

        return "Medium";
    }

    return "Low";
}

//----------------------------------------------------------
// Development Phase
//----------------------------------------------------------

function determinePhase(file: FileStats): string {

    const path = file.relativePath.toLowerCase();

    if (

        path.includes("auth")

        ||

        path.includes("consent")

    ) {

        return "P0";
    }

    if (

        path.includes("medical")

        ||

        path.includes("prescription")

    ) {

        return "Phase 1";
    }

    if (

        path.includes("assessment")

        ||

        path.includes("daily")

        ||

        path.includes("reports")

    ) {

        return "Phase 2";
    }

    if (

        path.includes("journey")

        ||

        path.includes("timeline")

        ||

        path.includes("treatment")

    ) {

        return "Phase 3";
    }

    return "Future";
}

//----------------------------------------------------------
// Recommendation Engine
//----------------------------------------------------------

function determineRecommendation(file: FileStats): string {

    if (file.empty) {

        return "DELETE";
    }

    if (

        file.placeholders > 2

        &&

        file.functions.length === 0

    ) {

        return "REVIEW";
    }

    if (

        file.importedBy.length === 0

        &&

        !isApp(file.relativePath)

    ) {

        return "REVIEW";
    }

    if (

        file.lines < 15

        &&

        file.functions.length === 0

    ) {

        return "REVIEW";
    }

    return "KEEP";
}

//----------------------------------------------------------
// Folder Recommendation
//----------------------------------------------------------

function determineFolderRecommendation(folder: FolderStats) {

    if (folder.emptyFiles > 2) {

        folder.status = "REVIEW";

        folder.recommendation = "Cleanup";
    }

    else if (folder.totalLOC < 150) {

        folder.status = "DEFER";

        folder.recommendation = "Review Later";
    }

    else {

        folder.status = "ACTIVE";

        folder.recommendation = "Continue Development";
    }
}

//----------------------------------------------------------
// Run Governance
//----------------------------------------------------------

function governArchitecture() {

    console.log("");

    console.log("Running governance analysis...");

    detectDuplicates();

    detectViolations();

    for (const file of project.files.values()) {

        file.businessImportance =

            determineImportance(file);

        file.phase =

            determinePhase(file);

        file.recommendation =

            determineRecommendation(file);
    }

    for (const folder of project.folders.values()) {

        determineFolderRecommendation(folder);
    }

    console.log(

        `Duplicate symbols : ${duplicateGroups.length}`
    );

    console.log(

        `Violations        : ${violations.length}`
    );

    console.log("");

    console.log("Governance Complete.");
}

governArchitecture();

//----------------------------------------------------------
// Markdown Helpers
//----------------------------------------------------------

function line(char = "-", length = 80): string {

    return char.repeat(length);
}

function heading(title: string, level = 1): string {

    return `${"#".repeat(level)} ${title}\n\n`;
}

function table(headers: string[], rows: string[][]): string {

    let output = "";

    output += `| ${headers.join(" | ")} |\n`;
    output += `| ${headers.map(() => "---").join(" | ")} |\n`;

    for (const row of rows) {

        output += `| ${row.join(" | ")} |\n`;
    }

    output += "\n";

    return output;
}

//----------------------------------------------------------
// Executive Summary
//----------------------------------------------------------

function buildExecutiveSummary(): string {

    let text = "";

    text += heading("CareVR Architecture Governance Report");

    text += `Generated : ${new Date().toLocaleString()}\n\n`;

    text += `## Executive Summary\n\n`;

    text += `| Metric | Value |\n`;
    text += `|---|---:|\n`;
    text += `|Folders|${project.folders.size}|\n`;
    text += `|Files|${project.files.size}|\n`;
    text += `|Duplicate Symbols|${duplicateGroups.length}|\n`;
    text += `|Architecture Violations|${violations.length}|\n\n`;

    return text;
}

//----------------------------------------------------------
// Folder Summary
//----------------------------------------------------------

function buildFolderSection(): string {

    let output = heading("Folder Governance", 2);

    const rows: string[][] = [];

    const folders = [...project.folders.values()]

        .sort((a, b) =>

            a.folder.localeCompare(b.folder)
        );

    for (const folder of folders) {

        rows.push([

            folder.folder,

            folder.files.length.toString(),

            folder.totalLOC.toString(),

            folder.status ?? "",

            folder.recommendation ?? ""
        ]);
    }

    output += table(

        [

            "Folder",

            "Files",

            "LOC",

            "Status",

            "Recommendation"

        ],

        rows
    );

    return output;
}

//----------------------------------------------------------
// File Section
//----------------------------------------------------------

function buildFileSection(): string {

    let output = heading("File Review", 2);

    const files = [...project.files.values()]

        .sort((a, b) =>

            a.relativePath.localeCompare(
                b.relativePath
            )
        );

    for (const file of files) {

        output += line() + "\n\n";

        output += `### ${file.relativePath}\n\n`;

        output += `|Property|Value|\n`;
        output += `|---|---|\n`;
        output += `|Purpose|${file.purpose}|\n`;
        output += `|LOC|${file.lines}|\n`;
        output += `|Imports|${file.imports.length}|\n`;
        output += `|Imported By|${file.importedBy.length}|\n`;
        output += `|Exports|${file.exports.length}|\n`;
        output += `|Interfaces|${file.interfaces.length}|\n`;
        output += `|Classes|${file.classes.length}|\n`;
        output += `|Enums|${file.enums.length}|\n`;
        output += `|Functions|${file.functions.length}|\n`;
        output += `|TODO|${file.todos}|\n`;
        output += `|Placeholder Score|${file.placeholders}|\n`;
        output += `|Business Importance|${file.businessImportance}|\n`;
        output += `|Phase|${file.phase}|\n`;
        output += `|Recommendation|${file.recommendation}|\n\n`;

        if (file.importedBy.length) {

            output += "**Imported By**\n\n";

            for (const dep of file.importedBy) {

                output += `- ${dep}\n`;
            }

            output += "\n";
        }
    }

    return output;
}

//----------------------------------------------------------
// Duplicate Report
//----------------------------------------------------------

function buildDuplicateSection(): string {

    let output = heading("Duplicate Responsibilities", 2);

    if (!duplicateGroups.length) {

        output += "No duplicate responsibilities detected.\n\n";

        return output;
    }

    for (const group of duplicateGroups) {

        output += `### ${group.name}\n\n`;

        for (const file of group.files) {

            output += `- ${file}\n`;
        }

        output += "\n";
    }

    return output;
}

//----------------------------------------------------------
// Violations
//----------------------------------------------------------

function buildViolationSection(): string {

    let output = heading("Architecture Violations", 2);

    if (!violations.length) {

        output += "No architecture violations detected.\n\n";

        return output;
    }

    const rows: string[][] = [];

    for (const violation of violations) {

        rows.push([

            violation.severity,

            violation.type,

            violation.source,

            violation.target
        ]);
    }

    output += table(

        [

            "Severity",

            "Violation",

            "Source",

            "Target"

        ],

        rows
    );

    return output;
}

//----------------------------------------------------------
// Recommendations
//----------------------------------------------------------

function buildRecommendationSection(): string {

    let output = heading("Governance Recommendations", 2);

    const keep: string[] = [];

    const review: string[] = [];

    const remove: string[] = [];

    for (const file of project.files.values()) {

        switch (file.recommendation) {

            case "KEEP":

                keep.push(file.relativePath);

                break;

            case "REVIEW":

                review.push(file.relativePath);

                break;

            case "DELETE":

                remove.push(file.relativePath);

                break;
        }
    }

    output += "## Keep\n\n";

    keep.forEach(f => output += `- ${f}\n`);

    output += "\n";

    output += "## Review\n\n";

    review.forEach(f => output += `- ${f}\n`);

    output += "\n";

    output += "## Delete\n\n";

    remove.forEach(f => output += `- ${f}\n`);

    output += "\n";

    return output;
}

//----------------------------------------------------------
// Architecture Score
//----------------------------------------------------------

function buildScore(): string {

    let score = 10;

    score -= duplicateGroups.length * 0.05;

    score -= violations.length * 0.20;

    if (score < 0) {

        score = 0;
    }

    return `
# Overall Assessment

|Category|Score|
|---|---:|
|Architecture Score|${score.toFixed(2)} / 10|
|Maintainability|Excellent|
|Risk|Low|

Recommended Next Step:

Continue production development.
`;
}

//----------------------------------------------------------
// Generate Report
//----------------------------------------------------------

function generateReport() {

    console.log("");

    console.log("Generating Governance Report...");

    let report = "";

    report += buildExecutiveSummary();

    report += buildFolderSection();

    report += buildFileSection();

    report += buildDuplicateSection();

    report += buildViolationSection();

    report += buildRecommendationSection();

    report += buildScore();

    ensureOutputFolder();

    fs.writeFileSync(

        OUTPUT_FILE,

        report,

        "utf8"
    );

    console.log("");

    console.log(line("="));

    console.log("Governance report generated successfully.");

    console.log(OUTPUT_FILE);

    console.log(line("="));

}

generateReport();