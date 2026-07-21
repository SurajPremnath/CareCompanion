import fs from "node:fs";
import path from "node:path";
import { DecisionResult } from "./decisionEngine";

export interface ValidationIssue {
  severity: "ERROR" | "WARNING";
  message: string;
  symbol?: string;
  file?: string;
}

export interface ValidationResult {
  passed: boolean;
  errors: number;
  warnings: number;
  issues: ValidationIssue[];
}

export function validateAudit(
  decisions: DecisionResult[],
  root: string
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateCanonical(decisions, issues);
  validateFiles(decisions, root, issues);
  validateDuplicates(decisions, issues);
  validateConfidence(decisions, issues);

  const errors = issues.filter(
    (x) => x.severity === "ERROR"
  ).length;

  const warnings = issues.filter(
    (x) => x.severity === "WARNING"
  ).length;

  return {
    passed: errors === 0,
    errors,
    warnings,
    issues,
  };
}

export function writeValidationReport(
  result: ValidationResult,
  outputDir = "reports"
) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  const lines: string[] = [];

  lines.push("# Validation Report");
  lines.push("");

  lines.push(
    `Status: ${result.passed ? "✅ PASSED" : "❌ FAILED"}`
  );

  lines.push("");

  lines.push(`Errors   : ${result.errors}`);
  lines.push(`Warnings : ${result.warnings}`);

  lines.push("");

  if (result.issues.length === 0) {
    lines.push("No validation issues detected.");
  }

  for (const issue of result.issues) {
    lines.push(
      `## ${issue.severity}`
    );

    lines.push(issue.message);

    if (issue.symbol) {
      lines.push(`Symbol : ${issue.symbol}`);
    }

    if (issue.file) {
      lines.push(`File   : ${normalize(issue.file)}`);
    }

    lines.push("");
  }

  fs.writeFileSync(
    path.join(outputDir, "validation.md"),
    lines.join("\n")
  );
}

function validateCanonical(
  decisions: DecisionResult[],
  issues: ValidationIssue[]
) {
  for (const d of decisions) {
    if (
      d.decision !== "KEEP" &&
      d.decision !== "MANUAL_REVIEW" &&
      !d.canonical
    ) {
      issues.push({
        severity: "ERROR",
        symbol: d.symbol,
        message:
          "Decision requires canonical file but none selected.",
      });
    }
  }
}

function validateFiles(
  decisions: DecisionResult[],
  root: string,
  issues: ValidationIssue[]
) {
  for (const d of decisions) {
    if (!d.canonical) continue;

    const file = path.resolve(root, d.canonical);

    if (!fs.existsSync(file)) {
      issues.push({
        severity: "ERROR",
        symbol: d.symbol,
        file: d.canonical,
        message: "Canonical file does not exist.",
      });
    }
  }
}

function validateDuplicates(
  decisions: DecisionResult[],
  issues: ValidationIssue[]
) {
  const seen = new Set<string>();

  for (const d of decisions) {
    const key = `${d.symbol}:${d.kind}`;

    if (seen.has(key)) {
      issues.push({
        severity: "WARNING",
        symbol: d.symbol,
        message:
          "Duplicate decision detected for symbol.",
      });
    }

    seen.add(key);
  }
}

function validateConfidence(
  decisions: DecisionResult[],
  issues: ValidationIssue[]
) {
  for (const d of decisions) {
    if (d.confidence < 70) {
      issues.push({
        severity: "WARNING",
        symbol: d.symbol,
        message:
          "Low confidence decision. Manual verification recommended.",
      });
    }
  }
}

function normalize(file: string) {
  return file.replace(/\\/g, "/");
}