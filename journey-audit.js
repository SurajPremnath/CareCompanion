const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "lib", "journey");

const files = [];

function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            walk(full);
        } else if (item.endsWith(".ts")) {
            files.push(full);
        }
    }
}

walk(ROOT);

console.log("\n======================================");
console.log("CAREVR JOURNEY AUDIT");
console.log("======================================");

const exportsMap = {};
const imports = [];
const filenames = {};

for (const file of files) {

    const text = fs.readFileSync(file, "utf8");

    const exportRegex =
        /export\s+(?:interface|type|enum|class|const|function)\s+([A-Za-z0-9_]+)/g;

    let m;

    while ((m = exportRegex.exec(text)) !== null) {

        const name = m[1];

        if (!exportsMap[name])
            exportsMap[name] = [];

        exportsMap[name].push(file);
    }

    const importRegex =
        /from\s+["'](.+?)["']/g;

    while ((m = importRegex.exec(text)) !== null) {

        imports.push({
            file,
            importPath: m[1]
        });
    }

    const lower = path.basename(file).toLowerCase();

    if (!filenames[lower])
        filenames[lower] = [];

    filenames[lower].push(file);
}

console.log("\nDUPLICATE EXPORTS");
console.log("------------------------------");

let found = false;

for (const k in exportsMap) {

    if (exportsMap[k].length > 1) {

        found = true;

        console.log("\n" + k);

        exportsMap[k].forEach(f =>
            console.log("   " + f));
    }
}

if (!found)
    console.log("None");

console.log("\nFILE NAME CASE ISSUES");
console.log("------------------------------");

found = false;

for (const k in filenames) {

    if (filenames[k].length > 1) {

        found = true;

        filenames[k].forEach(f =>
            console.log(f));
    }
}

if (!found)
    console.log("None");

console.log("\nJOURNEY CONTEXT DEFINITIONS");
console.log("------------------------------");

for (const file of files) {

    const text = fs.readFileSync(file, "utf8");

    if (text.includes("interface JourneyContext")) {

        console.log(file);
    }
}

console.log("\nBARREL FILES");
console.log("------------------------------");

for (const file of files) {

    if (path.basename(file) === "index.ts") {

        console.log("\n" + file);

        const text = fs.readFileSync(file, "utf8");

        text.split(/\r?\n/)
            .filter(l => l.includes("export *"))
            .forEach(l => console.log("   " + l.trim()));
    }
}

console.log("\nIMPORT CASE CHECK");
console.log("------------------------------");

for (const imp of imports) {

    if (!imp.importPath.startsWith(".")) continue;

    let target =
        path.resolve(
            path.dirname(imp.file),
            imp.importPath + ".ts"
        );

    if (!fs.existsSync(target))
        continue;

    const actual =
        path.basename(target);

    const typed =
        path.basename(
            imp.importPath + ".ts"
        );

    if (actual !== typed) {

        console.log("\n" + imp.file);
        console.log("typed : " + typed);
        console.log("actual: " + actual);
    }
}

console.log("\nPOSSIBLE ORPHAN FILES");
console.log("------------------------------");

for (const file of files) {

    const base =
        path.basename(file, ".ts");

    let count = 0;

    for (const other of files) {

        if (other === file)
            continue;

        const txt =
            fs.readFileSync(other, "utf8");

        if (txt.includes(base))
            count++;
    }

    if (count === 0) {

        console.log(file);
    }
}

console.log("\n======================================");
console.log("AUDIT COMPLETE");
console.log("======================================");