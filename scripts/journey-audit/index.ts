import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

import {
  analyseDuplicates,
  DuplicateSymbol,
} from "./symbolAnalyzer";

import {
  analyseDependencies,
} from "./dependencyAnalyzer";

import {
  analyseResponsibilities,
} from "./responsibilityAnalyzer";

import {
  buildDecisions,
} from "./decisionEngine";

import {
  generateReports,
} from "./reportGenerator";

import {
  updateCanonical,
} from "./canonicalUpdater";

import {
  validateAudit,
  writeValidationReport,
} from "./validator";

interface SymbolOccurrence {
  file: string;
  line: number;
}

interface SymbolInfo {
  name: string;
  kind: string;
  occurrences: SymbolOccurrence[];
}

const ROOT = path.resolve("lib/journey");
const REPORT_DIR = path.resolve("reports");

main();

function main() {
  console.log("");
  console.log("========================================");
  console.log("Journey Architecture Audit");
  console.log("========================================");
  console.log("");

  const symbols = scan(ROOT);

  const duplicates = buildDuplicates(symbols);

  console.log(`Files scanned        : ${countFiles(ROOT)}`);
  console.log(`Exported symbols     : ${symbols.length}`);
  console.log(`Duplicate symbols    : ${duplicates.length}`);

  console.log("");

  console.log("Analysing symbols...");
  const symbolAnalysis = analyseDuplicates(duplicates);

  console.log("Analysing dependencies...");
  const dependencyReport = analyseDependencies(ROOT);

  console.log("Analysing responsibilities...");
  const responsibilities =
    analyseResponsibilities(ROOT);

  console.log("Building decisions...");
  const decisions = buildDecisions(
    symbolAnalysis,
    responsibilities
  );

  console.log("Generating reports...");
  generateReports(decisions, REPORT_DIR);

  console.log("Updating JourneyCanonical...");
  updateCanonical(decisions, {
    outputDir: REPORT_DIR,
  });

  console.log("Writing dependency report...");
  writeDependencyReport(dependencyReport);

  console.log("Running validation...");
  const validation = validateAudit(
    decisions,
    process.cwd()
  );

  writeValidationReport(validation, REPORT_DIR);

  console.log("");

  console.log("========================================");

  console.log(
    validation.passed
      ? "Audit completed successfully."
      : "Audit completed with validation errors."
  );

  console.log("========================================");

  console.log("");

  console.log(`Reports : ${REPORT_DIR}`);

  console.log("");
}

function scan(root: string): SymbolInfo[] {
  const files = getFiles(root);

  const symbols: SymbolInfo[] = [];

  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true
    );

    source.forEachChild((node) => {
      if (!isExported(node)) return;

      let name = "";
      let kind = "";

      if (ts.isInterfaceDeclaration(node)) {
        name = node.name.text;
        kind = "interface";
      }

      else if (ts.isEnumDeclaration(node)) {
        name = node.name.text;
        kind = "enum";
      }

      else if (ts.isTypeAliasDeclaration(node)) {
        name = node.name.text;
        kind = "type";
      }

      else if (ts.isClassDeclaration(node) && node.name) {
        name = node.name.text;
        kind = "class";
      }

      else if (
        ts.isFunctionDeclaration(node) &&
        node.name
      ) {
        name = node.name.text;
        kind = "function";
      }

      if (!name) return;

      const line =
        source.getLineAndCharacterOfPosition(
          node.getStart()
        ).line + 1;

      symbols.push({
        name,
        kind,
        occurrences: [
          {
            file: path.relative(
              process.cwd(),
              file
            ),
            line,
          },
        ],
      });
    });
  }

  return symbols;
}

function buildDuplicates(
  symbols: SymbolInfo[]
): DuplicateSymbol[] {
  const grouped = new Map<string, SymbolInfo[]>();

  for (const symbol of symbols) {
    const key = `${symbol.kind}:${symbol.name}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(symbol);
  }

  return [...grouped.values()]
    .filter((x) => x.length > 1)
    .map((group) => ({
      name: group[0].name,
      kind: group[0].kind,
      occurrences: group.flatMap(
        (x) => x.occurrences
      ),
    }));
}

function isExported(node: ts.Node) {
  if (!ts.canHaveModifiers(node)) return false;

  const modifiers = ts.getModifiers(node);

  return (
    modifiers?.some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword
    ) ?? false
  );
}

function getFiles(root: string): string[] {
  const files: string[] = [];

  walk(root);

  return files;

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, {
      withFileTypes: true,
    })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts")
      ) {
        files.push(full);
      }
    }
  }
}

function countFiles(root: string) {
  return getFiles(root).length;
}

function writeDependencyReport(
  report: ReturnType<typeof analyseDependencies>
) {
  const lines: string[] = [];

  lines.push("# Dependency Report");
  lines.push("");

  lines.push(
    `Files: ${report.nodes.length}`
  );

  lines.push(
    `Circular Dependencies: ${report.circular.length}`
  );

  lines.push(
    `Orphan Files: ${report.orphans.length}`
  );

  lines.push("");

  if (report.circular.length) {
    lines.push("## Circular");

    lines.push("");

    for (const cycle of report.circular) {
      lines.push(
        "- " +
          cycle
            .map((x) =>
              path.relative(process.cwd(), x)
            )
            .join(" -> ")
      );
    }

    lines.push("");
  }

  if (report.orphans.length) {
    lines.push("## Orphan Files");

    lines.push("");

    for (const file of report.orphans) {
      lines.push(
        "- " +
          path.relative(process.cwd(), file)
      );
    }
  }

  fs.mkdirSync(REPORT_DIR, {
    recursive: true,
  });

  fs.writeFileSync(
    path.join(
      REPORT_DIR,
      "dependency-report.md"
    ),
    lines.join("\n")
  );
}