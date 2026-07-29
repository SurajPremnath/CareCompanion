import { ScenarioAnalyzer } from "./ScenarioAnalyzer";
import { ScenarioEngine } from "./ScenarioEngine";
import { ScenarioQuestionBuilder } from "./ScenarioQuestionBuilder";
import { ScenarioRules } from "./ScenarioRules";

export class ScenarioRegistry {

  private static rules = new ScenarioRules();

  private static analyzer =
    new ScenarioAnalyzer(
      ScenarioRegistry.rules,
    );

  private static questionBuilder =
    new ScenarioQuestionBuilder();

  private static engine =
    new ScenarioEngine(
      ScenarioRegistry.analyzer,
      ScenarioRegistry.questionBuilder,
    );

  static getEngine(): ScenarioEngine {
    return this.engine;
  }

}