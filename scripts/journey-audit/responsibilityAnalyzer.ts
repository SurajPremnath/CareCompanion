import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export type Responsibility =
  | "Runtime Engine"
  | "Business Engine"
  | "Aggregate Model"
  | "Graph Model"
  | "Analysis Model"
  | "Domain Model"
  | "Repository"
  | "Storage"
  | "Mapper"
  | "Validator"
  | "Processor"
  | "Factory"
  | "DTO"
  | "Unknown";

export interface ResponsibilityResult {
  file: string;
  responsibility: Responsibility;
  confidence: number;
  reasons: string[];
}

export function analyseResponsibilities(
  root: string
): ResponsibilityResult[] {
  return getFiles(root).map(analyseFile);
}

function analyseFile(file: string): ResponsibilityResult {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

  const imports: string[] = [];
  const exports: string[] = [];

  source.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      imports.push(
        node.moduleSpecifier.getText().replace(/['"]/g, "")
      );
    }

    if (
      ts.isInterfaceDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isFunctionDeclaration(node)
    ) {
      const modifiers = ts.canHaveModifiers(node)
        ? ts.getModifiers(node)
        : undefined;

      const exported =
        modifiers?.some(
          (m) => m.kind === ts.SyntaxKind.ExportKeyword
        ) ?? false;

      if (!exported) return;

      const name =
        "name" in node && node.name
          ? node.name.getText()
          : "";

      if (name) {
        exports.push(name);
      }
    }
  });

  return classify(file, imports, exports);
}

function classify(
  file: string,
  imports: string[],
  exports: string[]
): ResponsibilityResult {
  const fileName = path.basename(file).toLowerCase();

  const folder = path.dirname(file).toLowerCase();

  const reasons: string[] = [];

  function result(
    responsibility: Responsibility,
    confidence: number
  ): ResponsibilityResult {
    return {
      file,
      responsibility,
      confidence,
      reasons,
    };
  }

  if (fileName.includes("repository")) {
    reasons.push("Filename contains Repository");
    return result("Repository", 100);
  }

  if (fileName.includes("storage")) {
    reasons.push("Filename contains Storage");
    return result("Storage", 100);
  }

  if (fileName.includes("mapper")) {
    reasons.push("Filename contains Mapper");
    return result("Mapper", 100);
  }

  if (fileName.includes("validator")) {
    reasons.push("Filename contains Validator");
    return result("Validator", 100);
  }

  if (fileName.includes("engine")) {
    if (folder.includes("engine")) {
      reasons.push("Located in engine folder");
      return result("Runtime Engine", 98);
    }

    reasons.push("Filename contains Engine");
    return result("Business Engine", 96);
  }

  if (fileName.includes("processor")) {
    reasons.push("Filename contains Processor");
    return result("Processor", 98);
  }

  if (fileName.includes("factory")) {
    reasons.push("Filename contains Factory");
    return result("Factory", 98);
  }

  if (
    folder.includes("models") ||
    fileName.includes("model")
  ) {
    const joined = exports.join(" ");

    if (
      joined.includes("JourneyModel") ||
      joined.includes("JourneyMetadata") ||
      joined.includes("JourneyStatistics")
    ) {
      reasons.push("Contains aggregate model exports");
      return result("Aggregate Model", 95);
    }

    reasons.push("Located under models");
    return result("Domain Model", 92);
  }

  if (fileName.includes("analysis")) {
    reasons.push("Analysis model");
    return result("Analysis Model", 95);
  }

  if (
    exports.some((e) => e.includes("Node")) &&
    exports.some((e) => e.includes("Transition"))
  ) {
    reasons.push("Contains graph structures");
    return result("Graph Model", 90);
  }

  if (
    imports.some((x) => x.includes("dto")) ||
    exports.some((x) => x.endsWith("DTO"))
  ) {
    reasons.push("DTO naming detected");
    return result("DTO", 90);
  }

  reasons.push("Unable to determine responsibility");

  return result("Unknown", 25);
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