import type {
  ComparisonEngineResult,
  ComparisonRequest,
} from "./comparison";

import type {
  ScenarioAnalysis,
} from "./scenarios";

export interface JourneyPipelineRequest
  extends ComparisonRequest {}

export interface JourneyPipelineResult {
  success: boolean;

  status:
    | "SUCCESS"
    | "FAILED";

  comparison?: ComparisonEngineResult;

  scenario?: ScenarioAnalysis;

  errors: string[];
}