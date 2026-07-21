import {
  ClinicalQuestion,
  QuestionAnswer,
  QuestionSearchCriteria,
  UUID,
} from "./QuestionTypes";

import {
  QuestionAnswerRequest,
  QuestionCreateRequest,
  QuestionListResult,
  QuestionRepositoryResult,
  QuestionSearchRequest,
  QuestionUpdateRequest,
} from "./QuestionModels";

import { QuestionStorage } from "./QuestionStorage";
import { QuestionBuilder } from "./QuestionBuilder";

export class QuestionRepository {
  public constructor(
    private readonly storage: QuestionStorage,
    private readonly builder: QuestionBuilder = new QuestionBuilder()
  ) {}

  public async create(
    request: QuestionCreateRequest
  ): Promise<QuestionRepositoryResult> {
    const question = this.builder.build(request);

    await this.storage.create(question);

    return {
      success: true,
      question,
    };
  }

  public async update(
    request: QuestionUpdateRequest
  ): Promise<QuestionRepositoryResult> {
    const existing = await this.storage.getById(request.id);

    if (!existing) {
      return {
        success: false,
        error: "Question not found.",
      };
    }

    const updated: ClinicalQuestion = Object.freeze({
      ...existing,
      ...request,
      metadata: {
        ...existing.metadata,
        ...request.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    await this.storage.update(updated);

    return {
      success: true,
      question: updated,
    };
  }

  public async delete(
    questionId: UUID
  ): Promise<boolean> {
    return this.storage.delete(questionId);
  }

  public async getById(
    questionId: UUID
  ): Promise<ClinicalQuestion | null> {
    return this.storage.getById(questionId);
  }

  public async getByPatient(
    patientId: UUID
  ): Promise<readonly ClinicalQuestion[]> {
    return this.storage.getByPatient(patientId);
  }

  public async answer(
    request: QuestionAnswerRequest
  ): Promise<QuestionRepositoryResult> {
    const question = await this.storage.getById(
      request.questionId
    );

    if (!question) {
      return {
        success: false,
        error: "Question not found.",
      };
    }

    const answer: QuestionAnswer = {
      ...request,
      answeredAt:
        request.answeredAt ??
        new Date().toISOString(),
    };

    await this.storage.saveAnswer(answer);

    const updated: ClinicalQuestion = Object.freeze({
      ...question,
      status: "ANSWERED",
      metadata: {
        ...question.metadata,
        updatedAt: answer.answeredAt,
      },
    });

    await this.storage.update(updated);

    return {
      success: true,
      question: updated,
    };
  }

  public async dismiss(
    questionId: UUID
  ): Promise<QuestionRepositoryResult> {
    const question =
      await this.storage.getById(questionId);

    if (!question) {
      return {
        success: false,
        error: "Question not found.",
      };
    }

    const updated: ClinicalQuestion = Object.freeze({
      ...question,
      status: "DISMISSED",
      metadata: {
        ...question.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    await this.storage.update(updated);

    return {
      success: true,
      question: updated,
    };
  }

  public async search(
    request: QuestionSearchRequest
  ): Promise<QuestionListResult> {
    const questions = await this.storage.search(
      request.criteria
    );

    const offset = request.offset ?? 0;
    const limit = request.limit ?? questions.length;

    const items = questions.slice(
      offset,
      offset + limit
    );

    return {
      items,
      total: questions.length,
    };
  }

  public async exists(
    questionId: UUID
  ): Promise<boolean> {
    const question = await this.storage.getById(
      questionId
    );

    return question !== null;
  }

  public async countByPatient(
    patientId: UUID
  ): Promise<number> {
    const questions =
      await this.storage.getByPatient(patientId);

    return questions.length;
  }

  public async getPendingByPatient(
    patientId: UUID
  ): Promise<readonly ClinicalQuestion[]> {
    const questions =
      await this.storage.getByPatient(patientId);

    return questions.filter(
      (question) =>
        question.status === "PENDING" ||
        question.status === "ASKED"
    );
  }

  public async getAnsweredByPatient(
    patientId: UUID
  ): Promise<readonly ClinicalQuestion[]> {
    const questions =
      await this.storage.getByPatient(patientId);

    return questions.filter(
      (question) =>
        question.status === "ANSWERED"
    );
  }

  public async searchByCriteria(
    criteria: QuestionSearchCriteria
  ): Promise<readonly ClinicalQuestion[]> {
    return this.storage.search(criteria);
  }

  public async saveAll(
    questions: readonly ClinicalQuestion[]
  ): Promise<void> {
    for (const question of questions) {
      const existing = await this.storage.getById(
        question.id
      );

      if (existing) {
        await this.storage.update(question);
      } else {
        await this.storage.create(question);
      }
    }
  }

  public async deleteByPatient(
    patientId: UUID
  ): Promise<number> {
    const questions =
      await this.storage.getByPatient(patientId);

    for (const question of questions) {
      await this.storage.delete(question.id);
    }

    return questions.length;
  }

  public async getLatestQuestion(
    patientId: UUID
  ): Promise<ClinicalQuestion | null> {
    const questions =
      await this.storage.getByPatient(patientId);

    if (questions.length === 0) {
      return null;
    }

    return [...questions].sort(
      (a, b) =>
        new Date(
          b.metadata.generatedAt
        ).getTime() -
        new Date(
          a.metadata.generatedAt
        ).getTime()
    )[0];
  }
}