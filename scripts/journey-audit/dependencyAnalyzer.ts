import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export interface DependencyNode {
  file: string;
  imports: string[];
  importedBy: string[];
  isOrphan: boolean;
}

export interface DependencyReport {
  nodes: DependencyNode[];
  circular: string[][];
  orphans: string[];
}

export function analyseDependencies(root: string): DependencyReport {
  const files = getFiles(root);

  const graph = new Map<string, Set<string>>();

  for (const file of files) {
    graph.set(file, new Set(getImports(file)));
  }

  const importedBy = new Map<string, Set<string>>();

  for (const file of files) {
    importedBy.set(file, new Set());
  }

  for (const [file, deps] of graph.entries()) {
    for (const dep of deps) {
      if (importedBy.has(dep)) {
        importedBy.get(dep)!.add(file);
      }
    }
  }

  const nodes: DependencyNode[] = [];

  for (const file of files) {
    nodes.push({
      file,
      imports: [...graph.get(file)!],
      importedBy: [...importedBy.get(file)!],
      isOrphan:
        importedBy.get(file)!.size === 0 &&
        !file.endsWith("index.ts"),
    });
  }

  return {
    nodes,
    circular: detectCircular(graph),
    orphans: nodes
      .filter((x) => x.isOrphan)
      .map((x) => x.file),
  };
}

function getFiles(root: string): string[] {
  const list: string[] = [];

  walk(root);

  return list;

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts")
      ) {
        list.push(full);
      }
    }
  }
}

function getImports(file: string): string[] {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

  const imports: string[] = [];

  source.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) return;

    const spec = node.moduleSpecifier.getText().replace(/['"]/g, "");

    if (!spec.startsWith(".")) return;

    const resolved = resolveImport(file, spec);

    if (resolved) {
      imports.push(resolved);
    }
  });

  return imports;
}

function resolveImport(
  from: string,
  relative: string
): string | undefined {
  const base = path.resolve(path.dirname(from), relative);

  const candidates = [
    `${base}.ts`,
    path.join(base, "index.ts"),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      return file;
    }
  }

  return undefined;
}

function detectCircular(
  graph: Map<string, Set<string>>
): string[][] {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(file: string, pathStack: string[]) {
    visited.add(file);
    stack.add(file);

    for (const dep of graph.get(file) ?? []) {
      if (!graph.has(dep)) continue;

      if (!visited.has(dep)) {
        dfs(dep, [...pathStack, dep]);
      } else if (stack.has(dep)) {
        cycles.push([...pathStack, dep]);
      }
    }

    stack.delete(file);
  }

  for (const file of graph.keys()) {
    if (!visited.has(file)) {
      dfs(file, [file]);
    }
  }

  return cycles;
}