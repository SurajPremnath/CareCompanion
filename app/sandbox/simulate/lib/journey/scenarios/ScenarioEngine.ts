import type { ComparisonResult } from "../comparison";

import { ScenarioAnalysis } from "./ScenarioAnalysis";
import { ScenarioAnalyzer } from "./ScenarioAnalyzer";
import { ScenarioQuestionBuilder } from "./ScenarioQuestionBuilder";

export class ScenarioEngine {

  constructor(
    private readonly analyzer: ScenarioAnalyzer,
    private readonly questionBuilder: ScenarioQuestionBuilder,
  ) {}

  execute(
    comparison: ComparisonResult,
  ): ScenarioAnalysis {

    const analysis =
      this.analyzer.analyze(comparison);

    if (analysis.clarificationRequired) {
      this.questionBuilder.build(analysis);
    }

    return analysis;

  }

}