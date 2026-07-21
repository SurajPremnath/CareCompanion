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
import { JourneyConfidence } from "./journeyTypes";

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

      questions: params.questions,

      clinicalSummary: params.clinicalSummary,

      confidence,

      readyToPersist: !requiresReview,

      requiresReview,

      actions: this.buildActions(
        params.comparison,
        params.questions,
        requiresReview,
      ),
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
}