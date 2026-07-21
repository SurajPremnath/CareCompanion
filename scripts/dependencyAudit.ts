#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const OUTPUT_DIR = path.join(ROOT, "architecture");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "dependency-audit.md");

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
    ".tsx",
    ".js",
    ".jsx"
]);

interface SourceFile {

    path: string;

    imports: string[];

}

const files: SourceFile[] = [];

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

function analyse(file: string) {

    const text = fs.readFileSync(file, "utf8");

    const imports = [...text.matchAll(/import\s+.*?from\s+["'](.+?)["']/g)]
        .map(x => x[1]);

    files.push({

        path: path.relative(ROOT, file),

        imports

    });

}

scan(ROOT);

const usedBy = new Map<string,string[]>();

for(const file of files){

    usedBy.set(file.path,[]);

}

function resolveImport(
    importer:string,
    imp:string
){

    if(!imp.startsWith("."))
        return null;

    const base = path.dirname(path.join(ROOT, importer));

    const candidate = path.normalize(
        path.join(base,imp)
    );

    const possible = [

        candidate+".ts",
        candidate+".tsx",
        path.join(candidate,"index.ts"),
        path.join(candidate,"index.tsx")

    ];

    for(const p of possible){

        const rel = path.relative(ROOT,p);

        if(usedBy.has(rel))
            return rel;

    }

    return null;

}

for(const file of files){

    for(const imp of file.imports){

        const resolved = resolveImport(
            file.path,
            imp
        );

        if(!resolved)
            continue;

        usedBy.get(resolved)!.push(file.path);

    }

}

if(!fs.existsSync(OUTPUT_DIR))
    fs.mkdirSync(OUTPUT_DIR);

let md = "# Dependency Audit\n\n";

md += `Generated : ${new Date().toLocaleString()}\n\n`;

md += "|File|Imported By|Status|\n";
md += "|---|---:|---|\n";

const sorted=[...usedBy.entries()]
.sort((a,b)=>a[0].localeCompare(b[0]));

for(const [file,users] of sorted){

    let status="";

    if(users.length===0)
        status="ORPHAN";

    else if(users.length<3)
        status="LOW";

    else if(users.length<10)
        status="MEDIUM";

    else
        status="CORE";

    md+=`|${file}|${users.length}|${status}|\n`;

}

md+="\n---\n\n";

md+="# Orphan Files\n\n";

sorted
.filter(x=>x[1].length===0)
.forEach(x=>{

    md+=`- ${x[0]}\n`;

});

md+="\n---\n\n";

md+="# Core Files (10+ Imports)\n\n";

sorted
.filter(x=>x[1].length>=10)
.sort((a,b)=>b[1].length-a[1].length)
.forEach(x=>{

    md+=`- ${x[0]} (${x[1].length})\n`;

});

md+="\n---\n\n";

md+="# Detailed References\n\n";

for(const [file,users] of sorted){

    md+=`## ${file}\n\n`;

    md+=`Imported By : ${users.length}\n\n`;

    if(users.length){

        users
        .sort()
        .forEach(u=>{

            md+=`- ${u}\n`;

        });

    }

    md+="\n";

}

fs.writeFileSync(
    OUTPUT_FILE,
    md
);

console.log("");
console.log("=========================================");
console.log(" DEPENDENCY AUDIT COMPLETE");
console.log("=========================================");
console.log("");
console.log(`Files : ${files.length}`);
console.log("");
console.log(`Report : architecture/dependency-audit.md`);
console.log("");