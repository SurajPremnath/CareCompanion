// lib/mappers/assessmentMapper.ts

import {
  AssessmentAnswers,
  AssessmentInput,
  AssessmentRecord,
  AssessmentRecommendation,
  AssessmentStatus,
  AssessmentType,
} from "@/lib/types/assessment";

export interface AssessmentRow {
  id: string;

  user_id: string;
  patient_id: string | null;

  assessment_type: AssessmentType;

  responses_json: AssessmentAnswers;

  score: number | null;

  raw_score: number | null;

  risk_category: AssessmentStatus | null;

  recommendation: AssessmentRecommendation | null;

  assessment_version: number;

  daily_care_id: string | null;

  completed_at: string;

  created_at: string;

  updated_at: string;
}

export class AssessmentMapper {
  /**
   * Maps a domain object into a database row.
   * Used for INSERT and UPDATE operations.
   */
  static toInsert(
    assessment: AssessmentInput
  ): Omit<
    AssessmentRow,
    "id" | "created_at" | "updated_at"
  > {
    return {
      user_id: assessment.userId,

      patient_id: assessment.patientId,

      assessment_type: assessment.assessmentType,

      responses_json: assessment.answers,

      score: assessment.normalizedScore,

      raw_score: assessment.rawScore,

      risk_category: assessment.status,

      recommendation: assessment.recommendation,

      assessment_version: assessment.assessmentVersion,

      daily_care_id: assessment.dailyCareId,

      completed_at: assessment.assessmentDate.toISOString(),
    };
  }

  /**
   * Maps a database row into the domain model.
   */
  static toDomain(row: AssessmentRow): AssessmentRecord {
    return {
      id: row.id,

      userId: row.user_id,

      patientId: row.patient_id,

      assessmentType: row.assessment_type,

      assessmentDate: new Date(row.completed_at),

      rawScore: row.raw_score ?? 0,

      normalizedScore: row.score ?? 0,

      status:
        row.risk_category ??
        "GOOD",

      recommendation:
        row.recommendation ??
        "MONITOR_CLOSELY",

      assessmentVersion: row.assessment_version,

      answers: row.responses_json,

      dailyCareId: row.daily_care_id,

      createdAt: new Date(row.created_at),

      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Maps multiple database rows.
   */
  static toDomainList(
    rows: AssessmentRow[]
  ): AssessmentRecord[] {
    return rows.map((row) =>
      AssessmentMapper.toDomain(row)
    );
  }
}