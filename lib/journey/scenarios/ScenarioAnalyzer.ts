import type { ComparisonResult } from "../comparison";

import { ScenarioAnalysis } from "./ScenarioAnalysis";
import { ScenarioRules } from "./ScenarioRules";
import {
  ScenarioCategory,
} from "./ScenarioTypes";

export class ScenarioAnalyzer {

  constructor(
    private readonly rules = new ScenarioRules(),
  ) {}

  analyze(
    comparison: ComparisonResult,
  ): ScenarioAnalysis {

    const analysis = new ScenarioAnalysis();

    for (const difference of comparison.differences) {

      switch (difference.category) {

        case "consultation":

          this.addCategory(
            analysis,
            ScenarioCategory.CONSULTATION_CHANGE,
            this.rules.consultationChanged(),
          );

          break;

        case "medicines":

          this.addCategory(
            analysis,
            ScenarioCategory.MEDICATION_CHANGE,
            this.rules.medicationChanged(),
          );

          break;

        case "investigations":

          this.addCategory(
            analysis,
            ScenarioCategory.INVESTIGATION_CHANGE,
            this.rules.investigationChanged(),
          );

          break;

        case "assessments":

          this.addCategory(
            analysis,
            ScenarioCategory.ASSESSMENT_CHANGE,
            this.rules.assessmentChanged(),
          );

          break;

        case "history":

          this.addCategory(
            analysis,
            ScenarioCategory.HISTORY_CHANGE,
            this.rules.historyChanged(),
          );

          break;

      }

    }

    analysis.clarificationRequired =
      analysis.detectedChanges.length > 0;

    return analysis;

  }

  private addCategory(
    analysis: ScenarioAnalysis,
    category: ScenarioCategory,
    change: ReturnType<ScenarioRules["consultationChanged"]>,
  ): void {

    if (!analysis.categories.includes(category)) {
      analysis.categories.push(category);
    }

    analysis.detectedChanges.push(change);

  }

}