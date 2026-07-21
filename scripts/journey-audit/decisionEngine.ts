import { AnalysisResult } from "./symbolAnalyzer";
import {
  ResponsibilityResult,
  Responsibility,
} from "./responsibilityAnalyzer";

export type FinalDecision =
  | "KEEP"
  | "MERGE"
  | "RENAME"
  | "MOVE"
  | "DELETE"
  | "REFACTOR"
  | "MANUAL_REVIEW";

export interface DecisionResult {
  symbol: string;
  kind: string;

  decision: FinalDecision;

  confidence: number;

  canonical?: string;

  reason: string;

  occurrences: string[];
}

export function buildDecisions(
  analyses: AnalysisResult[],
  responsibilities: ResponsibilityResult[]
): DecisionResult[] {
  return analyses.map((a) =>
    decide(
      a,
      responsibilities.filter((r) =>
        a.occurrences.some((o) => normalize(o.file) === normalize(r.file))
      )
    )
  );
}

function decide(
  analysis: AnalysisResult,
  owners: ResponsibilityResult[]
): DecisionResult {
  const responsibilities = owners.map((x) => x.responsibility);

  const canonical = chooseCanonical(
    analysis,
    owners
  );

  if (genericInfrastructure(analysis.symbol)) {
    return output(
      analysis,
      "KEEP",
      100,
      canonical,
      "Generic infrastructure naming."
    );
  }

  if (
    allSame(responsibilities) &&
    analysis.similarity >= 95
  ) {
    return output(
      analysis,
      "MERGE",
      99,
      canonical,
      "Identical responsibility and structure."
    );
  }

  if (
    differentResponsibilities(responsibilities) &&
    analysis.similarity < 40
  ) {
    return output(
      analysis,
      "KEEP",
      98,
      canonical,
      "Different architectural responsibilities."
    );
  }

  if (
    differentResponsibilities(responsibilities) &&
    analysis.similarity >= 40
  ) {
    return output(
      analysis,
      "RENAME",
      95,
      canonical,
      "Name collision across architectural layers."
    );
  }

  if (
    analysis.similarity >= 70 &&
    analysis.similarity < 95
  ) {
    return output(
      analysis,
      "REFACTOR",
      90,
      canonical,
      "High structural overlap."
    );
  }

  return output(
    analysis,
    "MANUAL_REVIEW",
    75,
    canonical,
    "Unable to classify automatically."
  );
}

function output(
  analysis: AnalysisResult,
  decision: FinalDecision,
  confidence: number,
  canonical: string | undefined,
  reason: string
): DecisionResult {
  return {
    symbol: analysis.symbol,
    kind: analysis.kind,
    decision,
    confidence,
    canonical,
    reason,
    occurrences: analysis.occurrences.map(
      (x) => x.file
    ),
  };
}

function chooseCanonical(
  analysis: AnalysisResult,
  owners: ResponsibilityResult[]
): string | undefined {
  if (owners.length === 0) return undefined;

  const priority: Responsibility[] = [
    "Domain Model",
    "Aggregate Model",
    "Graph Model",
    "Runtime Engine",
    "Business Engine",
    "Analysis Model",
    "Repository",
    "Storage",
    "Mapper",
    "Validator",
    "Processor",
    "Factory",
    "DTO",
    "Unknown",
  ];

  owners.sort(
    (a, b) =>
      priority.indexOf(a.responsibility) -
      priority.indexOf(b.responsibility)
  );

  return owners[0].file;
}

function normalize(file: string) {
  return file.replace(/\\/g, "/").toLowerCase();
}

function allSame(values: Responsibility[]) {
  return new Set(values).size === 1;
}

function differentResponsibilities(
  values: Responsibility[]
) {
  return new Set(values).size > 1;
}

function genericInfrastructure(
  symbol: string
) {
  return [
    "Engine",
    "Repository",
    "Storage",
    "Mapper",
    "Validator",
    "Model",
  ].includes(symbol);
}