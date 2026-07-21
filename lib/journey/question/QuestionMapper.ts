import {
  ClinicalQuestion,
  QuestionAnswer,
} from "./questionTypes";

export class QuestionMapper {
  public toPersistence(
    question: ClinicalQuestion
  ): Record<string, unknown> {
    return {
      id: question.id,
      patient_id: question.patientId,

      category: question.category,
      priority: question.priority,
      severity: question.severity,
      status: question.status,

      title: question.title,
      question: question.question,
      clinical_reason: question.clinicalReason,

      response_type: question.responseType,
      options: question.options ?? [],

      target: question.target,
      consultation_mode:
        question.consultationMode ?? null,

      evidence: question.evidence,
      triggers: question.triggers,

      timeline: question.timeline ?? null,
      treatment: question.treatment ?? null,

      rule_id: question.ruleId ?? null,

      due_at: question.dueAt ?? null,
      expires_at: question.expiresAt ?? null,

      metadata: question.metadata,

      generated_at:
        question.metadata.generatedAt,
      updated_at:
        question.metadata.updatedAt ?? null,
    };
  }

  public fromPersistence(
    record: Record<string, any>
  ): ClinicalQuestion {
    return Object.freeze({
      id: record.id,
      patientId: record.patient_id,

      category: record.category,
      priority: record.priority,
      severity: record.severity,
      status: record.status,

      title: record.title,
      question: record.question,
      clinicalReason: record.clinical_reason,

      responseType: record.response_type,
      options: Object.freeze(
        record.options ?? []
      ),

      target: record.target,
      consultationMode:
        record.consultation_mode ?? undefined,

      evidence: Object.freeze(
        record.evidence ?? []
      ),

      triggers: Object.freeze(
        record.triggers ?? []
      ),

      timeline: record.timeline ?? undefined,
      treatment: record.treatment ?? undefined,

      ruleId: record.rule_id ?? undefined,

      dueAt: record.due_at ?? undefined,
      expiresAt:
        record.expires_at ?? undefined,

      metadata: Object.freeze(record.metadata),
    });
  }

  public answerToPersistence(
    answer: QuestionAnswer
  ): Record<string, unknown> {
    return {
      question_id: answer.questionId,
      patient_id: answer.patientId,
      answered_by: answer.answeredBy,
      answer: answer.answer,
      notes: answer.notes ?? null,
      answered_at: answer.answeredAt,
    };
  }
}
  public answerFromPersistence(
    record: Record<string, unknown>
  ): QuestionAnswer {
    return Object.freeze({
      questionId: String(record.question_id),
      patientId: String(record.patient_id),

      answeredBy: record.answered_by as QuestionAnswer["answeredBy"],

      answer:
        (record.answer as QuestionAnswer["answer"]) ?? null,

      notes:
        record.notes !== null &&
        record.notes !== undefined
          ? String(record.notes)
          : undefined,

      answeredAt: String(record.answered_at),
    });
  }

  public toPersistenceMany(
    questions: readonly ClinicalQuestion[]
  ): Record<string, unknown>[] {
    return questions.map((question) =>
      this.toPersistence(question)
    );
  }

  public fromPersistenceMany(
    records: readonly Record<string, unknown>[]
  ): ClinicalQuestion[] {
    return records.map((record) =>
      this.fromPersistence(
        record as Record<string, any>
      )
    );
  }

  public answerToPersistenceMany(
    answers: readonly QuestionAnswer[]
  ): Record<string, unknown>[] {
    return answers.map((answer) =>
      this.answerToPersistence(answer)
    );
  }

  public answerFromPersistenceMany(
    records: readonly Record<string, unknown>[]
  ): QuestionAnswer[] {
    return records.map((record) =>
      this.answerFromPersistence(record)
    );
  }

  public clone(
    question: ClinicalQuestion
  ): ClinicalQuestion {
    return this.fromPersistence(
      this.toPersistence(question) as Record<
        string,
        any
      >
    );
  }

  public cloneAnswer(
    answer: QuestionAnswer
  ): QuestionAnswer {
    return this.answerFromPersistence(
      this.answerToPersistence(answer)
    );
  }
}