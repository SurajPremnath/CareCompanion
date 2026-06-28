// lib/types/assessmentScore.ts

import type {
  AssessmentRecommendation,
  AssessmentStatus,
} from "@/lib/types/assessment";

/**
 * Result produced by the Assessment Scoring Engine.
 *
 * This object is consumed by the AssessmentBuilder to
 * construct an AssessmentInput ready for persistence.
 */
export interface AssessmentScore {
  /**
   * Raw questionnaire score.
   * Range: 0–18
   */
  rawScore: number;

  /**
   * Normalized score.
   * Range: 0–20
   */
  normalizedScore: number;

  /**
   * Overall assessment status.
   */
  status: AssessmentStatus;

  /**
   * Recommended next action.
   */
  recommendation: AssessmentRecommendation;
}