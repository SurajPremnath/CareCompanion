
import {
  type ClinicalFlag,
  type ComparisonDifference,
  type ComparisonEngineResult,
  type ComparisonRequest,
  type ComparisonResult,
  type QuestionCandidate,
  type TimelineEventCandidate,
} from "./comparisonTypes";
import { ComparisonValidator } from "./comparisonValidator";

/* ==========================================================
 * Comparison Engine
 * ========================================================== */

import { PrescriptionComparator } from "./prescriptionComparator";

export class ComparisonEngine {
  constructor(
  private readonly validator = new ComparisonValidator(),
  private readonly comparator = new PrescriptionComparator(),
) {}

  execute(
    request: ComparisonRequest,
  ): ComparisonEngineResult {
    const startedAt = Date.now();

    const validation = this.validator.validate(request);

    if (!validation.valid) {
      return {
        success: false,
        status: "FAILED",
        errors: validation.errors.map((x) => x.message),
      };
    }

const comparison =
  this.comparator.compare(request);

const differences =
  comparison.differences;

    const timelineEvents =
      this.buildTimelineEvents(differences);

    const questionCandidates =
      this.buildQuestionCandidates(differences);

    const clinicalFlags =
      this.buildClinicalFlags(differences);

    const result: ComparisonResult = {
      differences,

      timelineEvents,

      questionCandidates,

      clinicalFlags,

      summary: {
        totalDifferences: differences.length,

        added: differences.filter(
          x => x.changeType === "added",
        ).length,

        removed: differences.filter(
          x => x.changeType === "removed",
        ).length,

        modified: differences.filter(
          x => x.changeType === "modified",
        ).length,

        unchanged: differences.filter(
          x => x.changeType === "unchanged",
        ).length,

        criticalChanges: differences.filter(
          x => x.severity === "critical",
        ).length,

        majorChanges: differences.filter(
          x => x.severity === "major",
        ).length,

        timelineEvents: timelineEvents.length,

        questionsGenerated:
          questionCandidates.length,

        clinicalFlags:
          clinicalFlags.length,
      },

      metadata: {
        comparedAt: new Date(),
        processingTimeMs:
          Date.now() - startedAt,
        engineVersion: "1.0.0",
      },

      warnings: [],

      errors: [],
    };

    return {
      success: true,
      status: "SUCCESS",
      result,
      errors: [],
    };
  }

  /* ========================================================
   * Timeline
   * ======================================================== */

  private buildTimelineEvents(
    differences: ComparisonDifference[],
  ): TimelineEventCandidate[] {
    return differences.map(diff => ({
      id: crypto.randomUUID(),

      eventType: diff.category,

      title: `${diff.label} ${diff.changeType}`,

      description:
        diff.reason ??
        `${diff.label} was ${diff.changeType}.`,

      priority: diff.clinicalImpact,
    }));
  }

  /* ========================================================
   * Questions
   * ======================================================== */

  private buildQuestionCandidates(
    differences: ComparisonDifference[],
  ): QuestionCandidate[] {
    return differences
      .filter(
        diff =>
          diff.changeType === "added" ||
          diff.changeType === "modified",
      )
      .map(diff => ({
        id: crypto.randomUUID(),

        question: `Please verify the change in ${diff.label}.`,

        reason:
          "Detected during consultation comparison.",

        required:
          diff.clinicalImpact === "HIGH" ||
          diff.clinicalImpact === "CRITICAL",

        priority: diff.clinicalImpact,

        relatedField: diff.field,
      }));
  }

  /* ========================================================
   * Clinical Flags
   * ======================================================== */

  private buildClinicalFlags(
    differences: ComparisonDifference[],
  ): ClinicalFlag[] {
    return differences
      .filter(
        diff =>
          diff.clinicalImpact === "HIGH" ||
          diff.clinicalImpact === "CRITICAL",
      )
      .map(diff => ({
        code: diff.field.toUpperCase(),

        title: diff.label,

        description:
          diff.reason ??
          `${diff.label} requires clinical review.`,

        impact: diff.clinicalImpact,
      }));
  }
}