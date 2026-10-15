import {
  ClinicalQuestion,
  ClinicalEvidenceReference,
  QuestionCategory,
  QuestionPriority,
  QuestionSeverity,
  QuestionStatus,
  QuestionMetadata,
  QuestionOption,
  QuestionResponseType,
  TargetAudience,
  TriggerReference,
  TimelineReference,
  TreatmentReference,
  UUID,
  QuestionGenerationContext,
} from "./QuestionTypes";

import { QuestionCreateRequest } from "./QuestionModels";

export class QuestionHelper {
  private constructor() {}

  public static createQuestion(
    id: UUID,
    request: QuestionCreateRequest
  ): ClinicalQuestion {
    const metadata: QuestionMetadata = {
      createdBy: request.source,
      generatedAt: new Date().toISOString(),
      version: 1,
      confidence: request.confidence,
      tags: Object.freeze([...(request.tags ?? [])]),
    };

    return Object.freeze({
      id,
      patientId: request.patientId,

      category: request.category,
      priority: request.priority,
      severity: request.severity ?? "NONE",
      status: "PENDING",

      title: request.title.trim(),
      question: request.question.trim(),
      clinicalReason: request.clinicalReason.trim(),

      responseType: request.responseType,
      options: Object.freeze([...(request.options ?? [])]),

      target: request.target,
      consultationMode: request.consultationMode,

      evidence: Object.freeze([...(request.evidence ?? [])]),
      triggers: Object.freeze([...(request.triggers ?? [])]),

      timeline: request.timeline,
      treatment: request.treatment,

      ruleId: request.ruleId,

      dueAt: request.dueAt,
      expiresAt: request.expiresAt,

      metadata,
    });
  }

  public static cloneQuestion(
    question: ClinicalQuestion
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      options: Object.freeze([...(question.options ?? [])]),
      evidence: Object.freeze([...question.evidence]),
      triggers: Object.freeze([...question.triggers]),
      metadata: {
        ...question.metadata,
        tags: Object.freeze([...question.metadata.tags]),
      },
    });
  }

  public static updateStatus(
    question: ClinicalQuestion,
    status: QuestionStatus
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      status,
      metadata: {
        ...question.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  public static updatePriority(
    question: ClinicalQuestion,
    priority: QuestionPriority
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      priority,
      metadata: {
        ...question.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  public static updateSeverity(
    question: ClinicalQuestion,
    severity: QuestionSeverity
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      severity,
      metadata: {
        ...question.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  public static withEvidence(
    question: ClinicalQuestion,
    evidence: readonly ClinicalEvidenceReference[]
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      evidence: Object.freeze([...evidence]),
    });
  }

  public static withTriggers(
    question: ClinicalQuestion,
    triggers: readonly TriggerReference[]
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      triggers: Object.freeze([...triggers]),
    });
  }

  public static withTimeline(
    question: ClinicalQuestion,
    timeline?: TimelineReference
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      timeline,
    });
  }

  public static withTreatment(
    question: ClinicalQuestion,
    treatment?: TreatmentReference
  ): ClinicalQuestion {
    return Object.freeze({
      ...question,
      treatment,
    });
  }

  public static hasExpired(question: ClinicalQuestion): boolean {
    if (!question.expiresAt) {
      return false;
    }

    return (
      new Date(question.expiresAt).getTime() <= Date.now()
    );
  }

  public static isPending(question: ClinicalQuestion): boolean {
    return question.status === "PENDING";
  }

  public static isAnswered(question: ClinicalQuestion): boolean {
    return question.status === "ANSWERED";
  }

  public static isCritical(question: ClinicalQuestion): boolean {
    return (
      question.priority === "CRITICAL" ||
      question.severity === "LIFE_THREATENING"
    );
  }

  public static sortByPriority(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    const priorityOrder: Record<QuestionPriority, number> = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
      INFORMATIONAL: 4,
    };

    return [...questions].sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  public static filterPending(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    return questions.filter(
      (question) => question.status === "PENDING"
    );
  }
}

export class QuestionContextHelper {
  private constructor() {}

  public static hasTimeline(
    context: QuestionGenerationContext
  ): boolean {
    return context.timelineUpdated;
  }

  public static hasTreatmentAnalysis(
    context: QuestionGenerationContext
  ): boolean {
    return context.treatmentAnalysed;
  }

  public static hasComparison(
    context: QuestionGenerationContext
  ): boolean {
    return context.comparisonCompleted;
  }

  public static hasEvidence(
    context: QuestionGenerationContext
  ): boolean {
    return context.evidence.length > 0;
  }

  public static getEvidenceCount(
    context: QuestionGenerationContext
  ): number {
    return context.evidence.length;
  }

  public static requiresClinicalClarification(
    context: QuestionGenerationContext
  ): boolean {
    return (
      context.evidence.length > 0 &&
      (!context.comparisonCompleted ||
        !context.treatmentAnalysed)
    );
  }

  public static shouldGenerateQuestions(
    context: QuestionGenerationContext
  ): boolean {
    return (
      context.timelineUpdated ||
      context.treatmentAnalysed ||
      context.comparisonCompleted ||
      context.evidence.length > 0
    );
  }

  public static containsEvidenceType(
    context: QuestionGenerationContext,
    type: ClinicalEvidenceReference["type"]
  ): boolean {
    return context.evidence.some(
      (evidence) => evidence.type === type
    );
  }

  public static getEvidenceByType(
    context: QuestionGenerationContext,
    type: ClinicalEvidenceReference["type"]
  ): readonly ClinicalEvidenceReference[] {
    return context.evidence.filter(
      (evidence) => evidence.type === type
    );
  }

  public static inferDefaultCategory(
    context: QuestionGenerationContext
  ): QuestionCategory {
    if (this.containsEvidenceType(context, "MEDICATION")) {
      return "MEDICATION_ADHERENCE";
    }

    if (this.containsEvidenceType(context, "LAB_RESULT")) {
      return "INVESTIGATION_FOLLOW_UP";
    }

    if (this.containsEvidenceType(context, "SYMPTOM")) {
      return "SYMPTOM_PROGRESSION";
    }

    if (this.containsEvidenceType(context, "PRESCRIPTION")) {
      return "PRESCRIPTION_VALIDATION";
    }

    return "MISSING_INFORMATION";
  }

  public static inferResponseType(
    category: QuestionCategory
  ): QuestionResponseType {
    switch (category) {
      case "MEDICATION_ADHERENCE":
      case "MEDICATION_TOLERANCE":
      case "ADVERSE_EFFECT":
      case "FOLLOW_UP_REMINDER":
      case "EMERGENCY_ESCALATION":
        return "YES_NO";

      case "INVESTIGATION_FOLLOW_UP":
        return "DATE";

      case "LIFESTYLE_RECOMMENDATION":
        return "MULTI_SELECT";

      default:
        return "TEXT";
    }
  }

  public static inferTargetAudience(
    category: QuestionCategory
  ): TargetAudience {
    switch (category) {
      case "CAREGIVER_CLARIFICATION":
        return "CAREGIVER";

      case "EMERGENCY_ESCALATION":
        return "BOTH";

      default:
        return "PATIENT";
    }
  }

  public static createBooleanOptions(): readonly QuestionOption[] {
    return Object.freeze([
      Object.freeze({
        id: "yes",
        label: "Yes",
        value: "YES",
        order: 1,
      }),
      Object.freeze({
        id: "no",
        label: "No",
        value: "NO",
        order: 2,
      }),
    ]);
  }

  public static deduplicateQuestions(
    questions: readonly ClinicalQuestion[]
  ): ClinicalQuestion[] {
    const seen = new Set<string>();

    return questions.filter((question) => {
      const key = [
        question.patientId,
        question.category,
        question.question.trim().toLowerCase(),
      ].join("|");

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  public static calculateAverageConfidence(
    questions: readonly ClinicalQuestion[]
  ): number {
    if (questions.length === 0) {
      return 0;
    }

    const total = questions.reduce(
      (sum, question) => sum + question.metadata.confidence,
      0
    );

    return Number((total / questions.length).toFixed(2));
  }
}