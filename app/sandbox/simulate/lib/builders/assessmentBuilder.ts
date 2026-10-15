import type { AssessmentDraft } from "@/lib/types/assessmentDraft";

import type {
  AssessmentAnswers,
  AssessmentInput,
  AssessmentRecommendation,
  AssessmentStatus,
} from "@/lib/types/assessment";

import type { AssessmentScore } from "@/lib/types/assessmentScore";

export class AssessmentBuilder {
  static build(
    draft: AssessmentDraft,
    score: AssessmentScore
  ): Omit<AssessmentInput, "userId"> {
    const answers: AssessmentAnswers = {
      breathing: draft.breathing,

      cough: draft.cough,

      bloodInCough: draft.bloodInCough,

      fever: draft.fever,

      temperature: draft.temperature,

      energy: draft.energy,

      appetite: draft.appetite,

      waterIntake: draft.water,

      pain: draft.discomfort,

      painAreas: draft.discomfortAreas,

      walkingDifficulty:
        draft.walking !== "easy",

      looseMotions:
        draft.looseMotions,
    };

    return {
      patientId: draft.patientId,

      assessmentType:
        draft.assessmentType,

      assessmentDate:
        new Date(),

      rawScore:
        score.rawScore,

      normalizedScore:
        score.normalizedScore,

      status:
        score.status,

      recommendation:
        score.recommendation,

      answers,

      assessmentVersion: 1,

      dailyCareId: null,
    };
  }
}