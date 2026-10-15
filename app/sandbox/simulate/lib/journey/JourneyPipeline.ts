import type {
  JourneyPipelineResult,
} from "./JourneyPipelineModels";

import { ComparisonEngine } from "./comparison";
import { ScenarioRegistry } from "./scenarios";

import type {
  ComparisonRequest,
  ComparisonEngineResult,
} from "./comparison";

import type { ScenarioAnalysis } from "./scenarios";

export class JourneyPipeline {
  constructor(
    private readonly comparisonEngine = new ComparisonEngine(),
    private readonly scenarioEngine =
      ScenarioRegistry.getEngine(),
  ) {}

  execute(
    request: ComparisonRequest,
  ): JourneyPipelineResult {
    // ----------------------------------
    // Step 1
    // Compare Prescriptions
    // ----------------------------------

    const comparison =
      this.comparisonEngine.execute(request);

    if (
      !comparison.success ||
      !comparison.result
    ) {
      return {
        success: false,
        status: "FAILED",
        comparison,
        errors:
          comparison.errors ?? [],
      };
    }

    // ----------------------------------
    // Step 2
    // Analyze Scenario
    // ----------------------------------

    const scenario =
      this.scenarioEngine.execute(
        comparison.result,
      );

    // ----------------------------------
    // Future Steps
    // ----------------------------------

    /*
        Clarification Engine

        Treatment Engine

        Timeline Engine

        Clinical Summary Engine

        Journey Analysis Engine

        Repository
    */

    return {
      success: true,
      status: "SUCCESS",

      comparison,

      scenario,

      errors: [],
    };
  }
}