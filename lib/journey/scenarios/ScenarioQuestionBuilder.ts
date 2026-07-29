import {
  ScenarioAnalysis,
} from "./ScenarioAnalysis";

import {
  ScenarioCategory,
} from "./ScenarioTypes";

export class ScenarioQuestionBuilder {

  build(
    analysis: ScenarioAnalysis,
  ): void {

    for (const category of analysis.categories) {

      switch (category) {

        case ScenarioCategory.CONSULTATION_CHANGE:

          analysis.questions.push({
            id: crypto.randomUUID(),
            category,
            question:
              "We noticed your consultation changed. Can you tell us why?",
            options: [
              "Referral",
              "Second Opinion",
              "Doctor Changed",
              "Hospital Changed",
              "Emergency",
              "Other",
            ],
          });

          break;

        case ScenarioCategory.MEDICATION_CHANGE:

          analysis.questions.push({
            id: crypto.randomUUID(),
            category,
            question:
              "We noticed your medication changed. What was the reason?",
            options: [
              "Completed",
              "Disease Progression",
              "Side Effects",
              "Cost",
              "Availability",
              "Other",
            ],
          });

          break;

        case ScenarioCategory.DIAGNOSIS_CHANGE:

          analysis.questions.push({
            id: crypto.randomUUID(),
            category,
            question:
              "Did your doctor explain why the diagnosis changed?",
            options: [
              "Yes",
              "No",
              "Not Sure",
            ],
          });

          break;

        case ScenarioCategory.INVESTIGATION_CHANGE:

          analysis.questions.push({
            id: crypto.randomUUID(),
            category,
            question:
              "Why was this investigation advised?",
            options: [
              "Routine Follow-up",
              "New Symptoms",
              "Disease Progression",
              "Other",
            ],
          });

          break;

      }

    }

  }

}