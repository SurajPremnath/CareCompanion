import {
  JourneyAnalysisResult,
} from "../journeyAnalysisModels";

import {
  JourneyReviewModel,
} from "../view-models";

import {
  mapJourneySummary,
} from "./summaryMapper";

import {
  mapQuestions,
} from "./questionMapper";

import {
  mapTimelineEvents,
} from "./timelineMapper";

import {
  mapTreatmentDecision,
  mapActiveTreatment,
} from "./treatmentMapper";

function mapJourneyContext(
  context: JourneyAnalysisResult["context"],
) {
  return {
    patientId: context.patientId,

    currentConsultationDate:
      context.currentConsultationDate,

    previousConsultationDate:
      context.previousConsultationDate,

    consultationContext:
      context.consultationContext,

    consultationSource:
      context.consultationSource,

    hasPreviousConsultation:
      context.hasPreviousConsultation,

    isEmergency:
      context.isEmergency,
  };
}

export function mapJourneyReview(
  analysis: JourneyAnalysisResult,
): JourneyReviewModel {
  return {
context: mapJourneyContext(
  analysis.context,
),

    summary: mapJourneySummary(
      analysis.clinicalSummary.summary,
    ),

    detectedChanges:
      analysis.comparison.changes,

    questions: mapQuestions(
      analysis.questionResult.questions,
    ),

    treatmentDecision:
      mapTreatmentDecision(
        analysis.treatment,
      ),

    activeTreatment:
      mapActiveTreatment(
        analysis.treatment,
      ),

    timelineEvents:
      mapTimelineEvents(
        analysis.timeline.events,
      ),

    confidence:
      typeof analysis.confidence === "number"
        ? analysis.confidence
        : 100,

    status: analysis.status,

    readyToPersist:
      analysis.readyToPersist,

    requiresReview:
      analysis.requiresReview,

    actions:
      analysis.actions,
  };
}