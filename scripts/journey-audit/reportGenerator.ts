import fs from "node:fs";
import path from "node:path";
import { DecisionResult } from "./decisionEngine";

export function generateReports(
  decisions: DecisionResult[],
  outputDir = "reports"
) {
  fs.mkdirSync(outputDir, { recursive: true });

  writeCategory(
    outputDir,
    "merge-candidates.md",
    "MERGE",
    decisions
  );

  writeCategory(
    outputDir,
    "rename-candidates.md",
    "RENAME",
    decisions
  );

  writeCategory(
    outputDir,
    "refactor-candidates.md",
    "REFACTOR",
    decisions
  );

  writeCategory(
    outputDir,
    "keep-candidates.md",
    "KEEP",
    decisions
  );

  writeCategory(
    outputDir,
    "manual-review.md",
    "MANUAL_REVIEW",
    decisions
  );

  writeSummary(outputDir, decisions);

  fs.writeFileSync(
    path.join(outputDir, "journey-audit.json"),
    JSON.stringify(decisions, null, 2)
  );
}

function writeCategory(
  outputDir: string,
  fileName: string,
  category: DecisionResult["decision"],
  decisions: DecisionResult[]
) {
  const rows = decisions.filter(
    (x) => x.decision === category
  );

  const lines: string[] = [];

  lines.push(`# ${category}`);
  lines.push("");

  if (!rows.length) {
    lines.push("No entries.");
  }

  for (const row of rows) {
    lines.push(`## ${row.symbol}`);
    lines.push("");

    lines.push(`- Kind: ${row.kind}`);
    lines.push(`- Decision: ${row.decision}`);
    lines.push(`- Confidence: ${row.confidence}%`);

    if (row.canonical) {
      lines.push(`- Canonical: ${normalize(row.canonical)}`);
    }

    lines.push(`- Reason: ${row.reason}`);

    lines.push("");
    lines.push("Occurrences:");

    for (const file of row.occurrences) {
      lines.push(`- ${normalize(file)}`);
    }

    lines.push("");
  }

  fs.writeFileSync(
    path.join(outputDir, fileName),
    lines.join("\n")
  );
}

function writeSummary(
  outputDir: string,
  decisions: DecisionResult[]
) {
  const counts = new Map<string, number>();

  for (const d of decisions) {
    counts.set(
      d.decision,
      (counts.get(d.decision) ?? 0) + 1
    );
  }

  const md: string[] = [];

  md.push("# Journey Audit Summary");
  md.push("");

  md.push("| Decision | Count |");
  md.push("|----------|------:|");

  for (const [k, v] of counts.entries()) {
    md.push(`| ${k} | ${v} |`);
  }

  md.push("");
  md.push(`Total Symbols: ${decisions.length}`);
  md.push("");

  md.push("## Canonical Files");
  md.push("");

  const canonicals = Array.from(
    new Set(
      decisions
        .map((x) => x.canonical)
        .filter(Boolean)
    )
  );

  for (const file of canonicals) {
    md.push(`- ${normalize(file!)}`);
  }

  fs.writeFileSync(
    path.join(outputDir, "audit-summary.md"),
    md.join("\n")
  );
}

function normalize(file: string) {
  return file.replace(/\\/g, "/");
}