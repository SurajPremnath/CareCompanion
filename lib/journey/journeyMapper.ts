// lib/journey/JourneyMapper.ts

import type {
  JourneyAnalysisResult,
  JourneyAction,
} from "./journeyAnalysisModels";

export class JourneyMapper {
  static toPersistence(
    analysis: JourneyAnalysisResult,
  ): Record<string, unknown> {
    return {
      patient_id: analysis.context.patientId,

consultation_id:
  analysis.context.consultationId,

      consultation_date:
        analysis.context.currentConsultationDate,

      confidence: analysis.confidence,

      ready_to_persist:
        analysis.readyToPersist,

      requires_review:
        analysis.requiresReview,

      actions: analysis.actions,

      comparison: analysis.comparison,

      treatment: analysis.treatment,

      timeline: analysis.timeline,

      questions: analysis.questions,

      clinical_summary:
        analysis.clinicalSummary,

      context: analysis.context,

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString(),
    };
  }

  static fromPersistence(
    record: Record<string, unknown>,
  ): JourneyAnalysisResult {
return {
  context:
    record.context as JourneyAnalysisResult["context"],

  comparison:
    record.comparison as JourneyAnalysisResult["comparison"],

  treatment:
    record.treatment as JourneyAnalysisResult["treatment"],

  timeline:
    record.timeline as JourneyAnalysisResult["timeline"],

  questionResult:
    record.question_result as JourneyAnalysisResult["questionResult"],

  clinicalSummary:
    record.clinical_summary as JourneyAnalysisResult["clinicalSummary"],

  // ---------- Flattened Read Model ----------

  summary:
    record.summary as JourneyAnalysisResult["summary"],

  detectedChanges:
    (record.detected_changes as JourneyAnalysisResult["detectedChanges"]) ?? [],

  questions:
    (record.questions as JourneyAnalysisResult["questions"]) ?? [],

  treatmentDecision:
    record.treatment_decision as JourneyAnalysisResult["treatmentDecision"],

  activeTreatment:
    record.active_treatment as JourneyAnalysisResult["activeTreatment"],

  timelineEvents:
    (record.timeline_events as JourneyAnalysisResult["timelineEvents"]) ?? [],

  // ---------- Review ----------

  confidence:
    Number(record.confidence ?? 0),

  confidenceLevel:
    record.confidence_level as JourneyAnalysisResult["confidenceLevel"],

  status:
    record.status as JourneyAnalysisResult["status"],

  readyToPersist:
    Boolean(record.ready_to_persist),

  requiresReview:
    Boolean(record.requires_review),

  actions:
    (record.actions as JourneyAnalysisResult["actions"]) ?? [],
};
  }
}