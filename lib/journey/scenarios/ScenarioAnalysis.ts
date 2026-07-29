import {
  ScenarioCategory,
  ScenarioDetectedChange,
  ScenarioQuestion,
} from "./ScenarioTypes";

export class ScenarioAnalysis {

  categories: ScenarioCategory[] = [];

  detectedChanges: ScenarioDetectedChange[] = [];

  clarificationRequired = false;

  questions: ScenarioQuestion[] = [];

}