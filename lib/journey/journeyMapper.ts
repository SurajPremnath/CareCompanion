// lib/journey/JourneyMapper.ts

import {
  JourneyAnalysisResult,
} from "./journeyAnalysisModels";

export class JourneyMapper {
  static toPersistence(
    analysis: JourneyAnalysisResult,
  ): Record<string, unknown> {
    return {
      patient_id: analysis.context.patientId,

      consultation_id:
        analysis.context.consultationContext?.consultationId,

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

      questions:
        record.questions as JourneyAnalysisResult["questions"],

      clinicalSummary:
        record.clinical_summary as JourneyAnalysisResult["clinicalSummary"],

      confidence:
        record.confidence as JourneyAnalysisResult["confidence"],

      readyToPersist:
        Boolean(record.ready_to_persist),

      requiresReview:
        Boolean(record.requires_review),

      actions:
        (record.actions as string[]) ?? [],
    };
  }
}