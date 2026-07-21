// lib/journey/JourneyAnalysisEngine.ts

import {
  ClinicalSummaryResult,
  ComparisonResult,
  JourneyAnalysisResult,
  QuestionResult,
  TimelineResult,
  TreatmentDecision,
} from "./journeyAnalysisModels";

import { JourneyContext } from "./journeyModels";

import {
  JourneyActionType,
  JourneyConfidence,
  JourneyStatus,
} from "./journeyTypes";

export class JourneyAnalysisEngine {
  static build(params: {
    context: JourneyContext;
    comparison: ComparisonResult;
    treatment: TreatmentDecision;
    timeline: TimelineResult;
    questions: QuestionResult;
    clinicalSummary: ClinicalSummaryResult;
  }): JourneyAnalysisResult {
    const confidence = this.calculateConfidence(
      params.comparison,
      params.treatment,
      params.timeline,
    );

const requiresReview = this.requiresReview(
  params.comparison,
  confidence,
);

return {
  context: params.context,

  comparison: params.comparison,

  treatment: params.treatment,

  timeline: params.timeline,

  questionResult: params.questions,

  clinicalSummary: params.clinicalSummary,

  summary: params.clinicalSummary.summary,

  detectedChanges: params.comparison.changes,

  questions: params.questions.questions,

  treatmentDecision: params.treatment,

  activeTreatment: params.treatment.activeTreatment,

  timelineEvents: params.timeline.events,

  confidence: this.toConfidenceScore(confidence),

  confidenceLevel: confidence,

  status: requiresReview
    ? JourneyStatus.REVIEW_REQUIRED
    : JourneyStatus.COMPLETED,

  readyToPersist: !requiresReview,

  requiresReview,

actions: this.buildActions(
  params.comparison,
  params.questions,
  requiresReview,
).map((action, index) => ({
  id: `action-${index + 1}`,
  type: action as JourneyActionType,
  title: action.replace(/_/g, " "),
  completed: false,
})),
};
  }

  private static calculateConfidence(
    comparison: ComparisonResult,
    treatment: TreatmentDecision,
    timeline: TimelineResult,
  ): JourneyConfidence {
    let score = 0;

    if (!comparison.hasChanges) score += 40;

    score += Math.min(
      comparison.confidence,
      30,
    );

    if (
      treatment.activeTreatment.medicines.length > 0
    ) {
      score += 15;
    }

    if (
      timeline.events.length > 0
    ) {
      score += 15;
    }

    if (score >= 90) {
      return JourneyConfidence.VERIFIED;
    }

    if (score >= 75) {
      return JourneyConfidence.HIGH;
    }

    if (score >= 50) {
      return JourneyConfidence.MEDIUM;
    }

    return JourneyConfidence.LOW;
  }

  private static requiresReview(
    comparison: ComparisonResult,
    confidence: JourneyConfidence,
  ): boolean {
    if (confidence === JourneyConfidence.LOW) {
      return true;
    }

    return comparison.changes.some(
      change =>
        change.severity === "HIGH",
    );
  }

  private static buildActions(
    comparison: ComparisonResult,
    questions: QuestionResult,
    requiresReview: boolean,
  ): string[] {
    const actions: string[] = [];

    if (comparison.hasChanges) {
      actions.push("COMPARE");
    }

    if (questions.questions.length > 0) {
      actions.push("ASK_QUESTIONS");
    }

    if (requiresReview) {
      actions.push("REVIEW");
    }

    actions.push("SAVE");

    return actions;
  }

private static toConfidenceScore(
  confidence: JourneyConfidence,
): number {
  switch (confidence) {
    case JourneyConfidence.VERIFIED:
      return 100;

    case JourneyConfidence.HIGH:
      return 80;

    case JourneyConfidence.MEDIUM:
      return 60;

    case JourneyConfidence.LOW:
    default:
      return 40;
  }
}


}