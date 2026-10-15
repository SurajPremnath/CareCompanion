// lib/journey/journeyValidation.ts

import type {
  JourneyAnalysisResult,
  JourneyAnswer,
  JourneyQuestion,
} from "./journeyAnalysisModels";

import type {
  JourneyContext,
} from "./journeyModels";

/**
 * ============================================================
 * Journey Validation
 * ============================================================
 */

export class JourneyValidation {
  static validateContext(context: JourneyContext): string[] {
    const errors: string[] = [];

    if (!context.patientId.trim()) {
      errors.push("Patient ID is required.");
    }

if (!context.consultationId?.trim()) {
  errors.push("Consultation ID is required.");
}

  if (
  !context.currentConsultationDate ||
  (
    typeof context.currentConsultationDate === "string" &&
    !context.currentConsultationDate.trim()
  )
) {
  errors.push("Current consultation date is required.");
}

    return errors;
  }

  static validateQuestions(
    questions: JourneyQuestion[],
    answers: JourneyAnswer[],
  ): string[] {
    const errors: string[] = [];

    const answerMap = new Map(
      answers.map(answer => [answer.questionId, answer]),
    );

    for (const question of questions) {
      if (!question.required) {
        continue;
      }

      const answer = answerMap.get(question.id);

      if (!answer) {
        errors.push(`Missing answer for "${question.title}".`);
        continue;
      }

      if (Array.isArray(answer.value)) {
        if (answer.value.length === 0) {
          errors.push(`Question "${question.title}" cannot be empty.`);
        }
      } else if (!String(answer.value).trim()) {
        errors.push(`Question "${question.title}" cannot be empty.`);
      }
    }

    return errors;
  }

  static validateAnalysis(
    analysis: JourneyAnalysisResult,
  ): string[] {
    const errors: string[] = [];

    if (!analysis.context) {
      errors.push("Journey context is missing.");
    }

    if (!analysis.summary) {
      errors.push("Journey summary is missing.");
    }

    if (!analysis.timeline) {
      errors.push("Timeline is missing.");
    }

    if (
      analysis.confidence < 0 ||
      analysis.confidence > 100
    ) {
      errors.push("Confidence must be between 0 and 100.");
    }

    return errors;
  }

  static isValid(
    analysis: JourneyAnalysisResult,
  ): boolean {
    return this.validateAnalysis(analysis).length === 0;
  }

  static throwIfInvalid(
    analysis: JourneyAnalysisResult,
  ): void {
    const errors = this.validateAnalysis(analysis);

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }
}