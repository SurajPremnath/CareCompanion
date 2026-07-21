import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export interface DuplicateSymbol {
  name: string;
  kind: string;
  occurrences: SymbolOccurrence[];
}

export interface SymbolOccurrence {
  file: string;
  line: number;
}

export interface AnalysisResult {
  symbol: string;
  kind: string;

  similarity: number;

  decision:
    | "KEEP"
    | "MERGE"
    | "RENAME"
    | "DELETE"
    | "MOVE"
    | "REFACTOR"
    | "MANUAL_REVIEW";

  confidence: number;

  reason: string;

  occurrences: SymbolOccurrence[];
}

export function analyseDuplicates(
  duplicates: DuplicateSymbol[]
): AnalysisResult[] {
  return duplicates.map(analyse);
}

function analyse(item: DuplicateSymbol): AnalysisResult {
  const declarations = item.occurrences.map(loadDeclaration);

  const similarity = calculateSimilarity(
    item.kind,
    declarations
  );

  const decision = classify(
    item,
    similarity
  );

  return {
    symbol: item.name,
    kind: item.kind,
    similarity,
    decision: decision.decision,
    confidence: decision.confidence,
    reason: decision.reason,
    occurrences: item.occurrences,
  };
}

function loadDeclaration(
  occurrence: SymbolOccurrence
): ts.Node | undefined {
  const file = path.resolve(process.cwd(), occurrence.file);

  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

  let result: ts.Node | undefined;

  source.forEachChild((node) => {
    const line =
      source.getLineAndCharacterOfPosition(node.getStart()).line +
      1;

    if (line === occurrence.line) {
      result = node;
    }
  });

  return result;
}

function calculateSimilarity(
  kind: string,
  nodes: (ts.Node | undefined)[]
): number {
  if (nodes.length < 2) {
    return 100;
  }

  switch (kind) {
    case "enum":
      return enumSimilarity(nodes);

    case "interface":
      return interfaceSimilarity(nodes);

    case "type":
      return typeSimilarity(nodes);

    case "class":
      return classSimilarity(nodes);

    case "function":
      return functionSimilarity(nodes);

    default:
      return 0;
  }
}

function enumSimilarity(
  nodes: (ts.Node | undefined)[]
): number {
  const first = nodes[0] as ts.EnumDeclaration;

  if (!first) return 0;

  const base = new Set(
    first.members.map((m) => m.name.getText())
  );

  let total = 0;

  for (const n of nodes.slice(1)) {
    if (!n) continue;

    const other = new Set(
      (n as ts.EnumDeclaration).members.map((m) =>
        m.name.getText()
      )
    );

    let same = 0;

    base.forEach((x) => {
      if (other.has(x)) same++;
    });

    total += (same / Math.max(base.size, other.size)) * 100;
  }

  return Math.round(total / (nodes.length - 1));
}

function interfaceSimilarity(
  nodes: (ts.Node | undefined)[]
): number {
  const first = nodes[0] as ts.InterfaceDeclaration;

  if (!first) return 0;

  const base = new Set(
    first.members.map((m) => m.name?.getText())
  );

  let total = 0;

  for (const n of nodes.slice(1)) {
    if (!n) continue;

    const other = new Set(
      (n as ts.InterfaceDeclaration).members.map((m) =>
        m.name?.getText()
      )
    );

    let same = 0;

    base.forEach((x) => {
      if (other.has(x)) same++;
    });

    total += (same / Math.max(base.size, other.size)) * 100;
  }

  return Math.round(total / (nodes.length - 1));
}

function classSimilarity(
  nodes: (ts.Node | undefined)[]
): number {
  const first = nodes[0] as ts.ClassDeclaration;

  if (!first) return 0;

  const base = new Set(
    first.members.map((m) => m.name?.getText())
  );

  let total = 0;

  for (const n of nodes.slice(1)) {
    if (!n) continue;

    const other = new Set(
      (n as ts.ClassDeclaration).members.map((m) =>
        m.name?.getText()
      )
    );

    let same = 0;

    base.forEach((x) => {
      if (other.has(x)) same++;
    });

    total += (same / Math.max(base.size, other.size)) * 100;
  }

  return Math.round(total / (nodes.length - 1));
}

function functionSimilarity(
  nodes: (ts.Node | undefined)[]
): number {
  const first = nodes[0] as ts.FunctionDeclaration;

  if (!first) return 0;

  const paramCount = first.parameters.length;

  let total = 0;

  for (const n of nodes.slice(1)) {
    if (!n) continue;

    const other = n as ts.FunctionDeclaration;

    const diff = Math.abs(
      paramCount - other.parameters.length
    );

    total +=
      ((paramCount - diff) / Math.max(paramCount, other.parameters.length, 1)) *
      100;
  }

  return Math.round(total / (nodes.length - 1));
}

function typeSimilarity(
  nodes: (ts.Node | undefined)[]
): number {
  return 50;
}

function classify(
  item: DuplicateSymbol,
  similarity: number
) {
  if (
    item.kind === "class" &&
    ["Engine", "Repository", "Storage", "Validator", "Mapper", "Model"].includes(item.name)
  ) {
    return {
      decision: "KEEP",
      confidence: 99,
      reason: "Generic framework naming.",
    };
  }

  if (similarity >= 95) {
    return {
      decision: "MERGE",
      confidence: 98,
      reason: "Nearly identical definitions.",
    };
  }

  if (similarity >= 70) {
    return {
      decision: "REFACTOR",
      confidence: 90,
      reason: "High overlap detected.",
    };
  }

  if (similarity >= 30) {
    return {
      decision: "MANUAL_REVIEW",
      confidence: 75,
      reason: "Related but structurally different.",
    };
  }

  return {
    decision: "KEEP",
    confidence: 95,
    reason: "Different responsibilities.",
  };
}