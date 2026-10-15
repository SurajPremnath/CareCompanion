import {
  ClinicalQuestion,
  QuestionAnswer,
  QuestionCategory,
  QuestionCondition,
  QuestionEngineConfiguration,
  QuestionGenerationContext,
  QuestionPriority,
  QuestionRule,
  QuestionSearchCriteria,
  QuestionStatus,
} from "./QuestionTypes";

import {
  QuestionAnswerRequest,
  QuestionCreateRequest,
  QuestionUpdateRequest,
} from "./QuestionModels";

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export class QuestionValidator {
  private constructor() {}

  private static result(
    errors: string[]
  ): ValidationResult {
    return {
      valid: errors.length === 0,
      errors: Object.freeze(errors),
    };
  }

  public static validateCreate(
    request: QuestionCreateRequest
  ): ValidationResult {
    const errors: string[] = [];

    if (!request.patientId.trim()) {
      errors.push("Patient id is required.");
    }

    if (!request.title.trim()) {
      errors.push("Question title is required.");
    }

    if (!request.question.trim()) {
      errors.push("Question text is required.");
    }

    if (!request.clinicalReason.trim()) {
      errors.push("Clinical reason is required.");
    }

    if (request.confidence < 0 || request.confidence > 1) {
      errors.push("Confidence must be between 0 and 1.");
    }

    return {
  valid: errors.length === 0,
  errors: Object.freeze(errors),
};
  }

  public static validateUpdate(
    request: QuestionUpdateRequest
  ): ValidationResult {
    const errors: string[] = [];

    if (!request.id.trim()) {
      errors.push("Question id is required.");
    }

    return QuestionValidator.result(errors);
  }

  public static validateAnswer(
    request: QuestionAnswerRequest
  ): ValidationResult {
    const errors: string[] = [];

    if (!request.questionId.trim()) {
      errors.push("Question id is required.");
    }

    if (!request.patientId.trim()) {
      errors.push("Patient id is required.");
    }

    if (
      request.answer === undefined ||
      request.answer === null
    ) {
      errors.push("Answer is required.");
    }

    return QuestionValidator.result(errors);
  }

  public static validateQuestion(
    question: ClinicalQuestion
  ): ValidationResult {
    const errors: string[] = [];

    if (!question.id.trim()) {
      errors.push("Question id is missing.");
    }

    if (!question.patientId.trim()) {
      errors.push("Patient id is missing.");
    }

    if (!question.question.trim()) {
      errors.push("Question text is empty.");
    }

    if (!question.title.trim()) {
      errors.push("Question title is empty.");
    }

    if (question.metadata.confidence < 0) {
      errors.push("Invalid confidence.");
    }

    return QuestionValidator.result(errors);
  }

  public static validateContext(
    context: QuestionGenerationContext
  ): ValidationResult {
    const errors: string[] = [];

    if (!context.patientId.trim()) {
      errors.push("Patient id is required.");
    }

    if (!context.trigger) {
      errors.push("Trigger is required.");
    }

    return QuestionValidator.result(errors);
  }

  public static validateRule(
    rule: QuestionRule
  ): ValidationResult {
    const errors: string[] = [];

    if (!rule.id.trim()) {
      errors.push("Rule id is required.");
    }

    if (!rule.name.trim()) {
      errors.push("Rule name is required.");
    }

    if (rule.conditions.length === 0) {
      errors.push(
        "Rule should contain at least one condition."
      );
    }

    return QuestionValidator.result(errors);
  }

  public static validateSearchCriteria(
    criteria: QuestionSearchCriteria
  ): ValidationResult {
    const errors: string[] = [];

    if (!criteria.patientId.trim()) {
      errors.push("Patient id is required.");
    }

    return QuestionValidator.result(errors);
  }
}
export class QuestionRuleValidator {
  private constructor() {}

  public static evaluateConditions(
    conditions: readonly QuestionCondition[],
    data: Record<string, unknown>
  ): boolean {
    return conditions.every((condition) =>
      this.evaluateCondition(condition, data)
    );
  }

  public static evaluateCondition(
    condition: QuestionCondition,
    data: Record<string, unknown>
  ): boolean {
    const actual = data[condition.field];
    const expected = condition.value;

    switch (condition.operator) {
      case "EQUALS":
        return actual === expected;

      case "NOT_EQUALS":
        return actual !== expected;

      case "GREATER_THAN":
        return Number(actual) > Number(expected);

      case "LESS_THAN":
        return Number(actual) < Number(expected);

      case "GREATER_OR_EQUAL":
        return Number(actual) >= Number(expected);

      case "LESS_OR_EQUAL":
        return Number(actual) <= Number(expected);

      case "CONTAINS":
        return Array.isArray(actual)
          ? actual.includes(expected)
          : String(actual).includes(String(expected));

      case "NOT_CONTAINS":
        return Array.isArray(actual)
          ? !actual.includes(expected)
          : !String(actual).includes(String(expected));

      case "EXISTS":
        return actual !== undefined && actual !== null;

      case "NOT_EXISTS":
        return actual === undefined || actual === null;

      case "IN":
        return Array.isArray(expected)
          ? expected.includes(actual)
          : false;

      case "NOT_IN":
        return Array.isArray(expected)
          ? !expected.includes(actual)
          : true;

      default:
        return false;
    }
  }
}

export class QuestionConfigurationValidator {
  private constructor() {}

  public static validate(
    configuration: QuestionEngineConfiguration
  ): ValidationResult {
    const errors: string[] = [];

    if (
      configuration.minimumConfidence < 0 ||
      configuration.minimumConfidence > 1
    ) {
      errors.push(
        "Minimum confidence must be between 0 and 1."
      );
    }

    if (configuration.maximumQuestionsPerEvaluation <= 0) {
      errors.push(
        "Maximum questions per evaluation must be greater than zero."
      );
    }

    return {
      valid: errors.length === 0,
      errors: Object.freeze(errors),
    };
  }
}

export class QuestionStateValidator {
  private constructor() {}

  public static canAnswer(
    status: QuestionStatus
  ): boolean {
    return status === "PENDING" || status === "ASKED";
  }

  public static canDismiss(
    status: QuestionStatus
  ): boolean {
    return status === "PENDING" || status === "ASKED";
  }

  public static canExpire(
    status: QuestionStatus
  ): boolean {
    return (
      status !== "ANSWERED" &&
      status !== "DISMISSED" &&
      status !== "CANCELLED"
    );
  }

  public static canTransition(
    from: QuestionStatus,
    to: QuestionStatus
  ): boolean {
    const transitions: Record<
      QuestionStatus,
      readonly QuestionStatus[]
    > = {
      PENDING: ["ASKED", "ANSWERED", "DISMISSED", "EXPIRED", "CANCELLED"],
      ASKED: ["ANSWERED", "DISMISSED", "EXPIRED", "CANCELLED"],
      ANSWERED: [],
      DISMISSED: [],
      SKIPPED: ["ASKED"],
      EXPIRED: [],
      CANCELLED: [],
    };

    return transitions[from].includes(to);
  }
}
