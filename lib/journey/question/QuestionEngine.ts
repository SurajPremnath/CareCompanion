import {
  ClinicalQuestion,
  QuestionEngineConfiguration,
  QuestionEvaluationResult,
  QuestionGenerationContext,
  QuestionRule,
} from "./questionTypes";

import {
  QuestionCreateRequest,
  QuestionEvaluationRequest,
} from "./questionModels";

import { QuestionBuilder } from "./QuestionBuilder";
import {
  QuestionConfigurationValidator,
  QuestionValidator,
} from "./questionValidator";

export class QuestionEngine {
  private readonly builder: QuestionBuilder;
  private readonly configuration: QuestionEngineConfiguration;

  public constructor(
    configuration: QuestionEngineConfiguration
  ) {
    const validation =
      QuestionConfigurationValidator.validate(
        configuration
      );

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    this.configuration = Object.freeze({
      ...configuration,
    });

    this.builder = new QuestionBuilder();
  }

  public getConfiguration(): QuestionEngineConfiguration {
    return this.configuration;
  }

  public createQuestion(
    request: QuestionCreateRequest
  ): ClinicalQuestion {
    return this.builder.build(request);
  }

  public evaluate(
    context: QuestionGenerationContext,
    rules: readonly QuestionRule[]
  ): QuestionEvaluationResult {
    const validation =
      QuestionValidator.validateContext(context);

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    const result = this.builder.buildEvaluation({
      context,
      rules,
    });

    return this.applyConfiguration(result);
  }

  public evaluateRequest(
    request: QuestionEvaluationRequest
  ): QuestionEvaluationResult {
    return this.evaluate(
      request.context,
      request.rules
    );
  }

  public shouldGenerateQuestions(
    context: QuestionGenerationContext
  ): boolean {
    if (!context.timelineUpdated &&
        !context.treatmentAnalysed &&
        !context.comparisonCompleted &&
        context.evidence.length === 0) {
      return false;
    }

    return true;
  }

  public filterQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    return questions.filter(
      (question) =>
        question.metadata.confidence >=
        this.configuration.minimumConfidence
    );
  }

  public sortQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    return [...questions].sort((a, b) => {
      const order = {
        CRITICAL: 0,
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
        INFORMATIONAL: 4,
      };

      return order[a.priority] - order[b.priority];
    });
  }
}

  private applyConfiguration(
    result: QuestionEvaluationResult
  ): QuestionEvaluationResult {
    let questions = this.filterQuestions(result.questions);

    questions = this.sortQuestions(questions);

    if (
      questions.length >
      this.configuration.maximumQuestionsPerEvaluation
    ) {
      questions = questions.slice(
        0,
        this.configuration.maximumQuestionsPerEvaluation
      );
    }

    const confidence =
      questions.length === 0
        ? 0
        : Number(
            (
              questions.reduce(
                (sum, question) =>
                  sum + question.metadata.confidence,
                0
              ) / questions.length
            ).toFixed(2)
          );

    return Object.freeze({
      shouldAsk: questions.length > 0,
      confidence,
      questions: Object.freeze(questions),
      generatedAt: result.generatedAt,
      reasoning: Object.freeze([...result.reasoning]),
    });
  }

  public mergeQuestions(
    existing: readonly ClinicalQuestion[],
    generated: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    const map = new Map<string, ClinicalQuestion>();

    for (const question of existing) {
      map.set(question.id, question);
    }

    for (const question of generated) {
      if (!this.configuration.enableDeduplication) {
        map.set(`${question.id}-${Math.random()}`, question);
        continue;
      }

      const duplicate = [...map.values()].find(
        (item) =>
          item.patientId === question.patientId &&
          item.category === question.category &&
          item.question.trim().toLowerCase() ===
            question.question.trim().toLowerCase()
      );

      if (!duplicate) {
        map.set(question.id, question);
      }
    }

    return this.sortQuestions([...map.values()]);
  }

  public getPendingQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    return questions.filter(
      (question) =>
        question.status === "PENDING" ||
        question.status === "ASKED"
    );
  }

  public getCriticalQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    return questions.filter(
      (question) =>
        question.priority === "CRITICAL"
    );
  }

  public getExpiredQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    const now = Date.now();

    return questions.filter((question) => {
      if (!question.expiresAt) {
        return false;
      }

      return (
        new Date(question.expiresAt).getTime() <= now
      );
    });
  }

  public getQuestionCount(
    questions: readonly ClinicalQuestion[]
  ): number {
    return questions.length;
  }
}