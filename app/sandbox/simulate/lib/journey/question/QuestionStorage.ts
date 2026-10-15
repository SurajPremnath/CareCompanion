import { SupabaseClient } from "@supabase/supabase-js";

import {
  ClinicalQuestion,
  QuestionAnswer,
  QuestionSearchCriteria,
  UUID,
} from "./QuestionTypes";

import { QuestionMapper } from "./QuestionMapper";

export class QuestionStorage {
  private readonly tableName = "clinical_questions";
  private readonly answerTableName = "clinical_question_answers";

  public constructor(
    private readonly supabase: SupabaseClient,
    private readonly mapper: QuestionMapper = new QuestionMapper()
  ) {}

  public async create(
    question: ClinicalQuestion
  ): Promise<void> {
    const entity = this.mapper.toPersistence(question);

    const { error } = await this.supabase
      .from(this.tableName)
      .insert(entity);

    if (error) {
      throw error;
    }
  }

  public async update(
    question: ClinicalQuestion
  ): Promise<void> {
    const entity = this.mapper.toPersistence(question);

    const { error } = await this.supabase
      .from(this.tableName)
      .update(entity)
      .eq("id", question.id);

    if (error) {
      throw error;
    }
  }

  public async getById(
    questionId: UUID
  ): Promise<ClinicalQuestion | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", questionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      throw error;
    }

    return this.mapper.fromPersistence(data);
  }

  public async getByPatient(
    patientId: UUID
  ): Promise<readonly ClinicalQuestion[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("patient_id", patientId)
      .order("generated_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data.map((item) =>
      this.mapper.fromPersistence(item)
    );
  }

  public async delete(
    questionId: UUID
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", questionId);

    if (error) {
      throw error;
    }

    return true;
  }

  public async saveAnswer(
    answer: QuestionAnswer
  ): Promise<void> {
    const { error } = await this.supabase
      .from(this.answerTableName)
      .insert(
        this.mapper.answerToPersistence(answer)
      );

    if (error) {
      throw error;
    }
  }

  public async search(
    criteria: QuestionSearchCriteria
  ): Promise<readonly ClinicalQuestion[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("patient_id", criteria.patientId);

    if (criteria.status) {
      query = query.eq("status", criteria.status);
    }

    if (criteria.category) {
      query = query.eq("category", criteria.category);
    }

    if (criteria.priority) {
      query = query.eq("priority", criteria.priority);
    }

    const { data, error } = await query.order(
      "generated_at",
      {
        ascending: false,
      }
    );

    if (error) {
      throw error;
    }

    return (data ?? []).map((record) =>
      this.mapper.fromPersistence(record)
    );
  }

  public async getAnswers(
    questionId: UUID
  ): Promise<readonly QuestionAnswer[]> {
    const { data, error } = await this.supabase
      .from(this.answerTableName)
      .select("*")
      .eq("question_id", questionId)
      .order("answered_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return (data ?? []).map((record) =>
      this.mapper.answerFromPersistence(record)
    );
  }

  public async getLatestAnswer(
    questionId: UUID
  ): Promise<QuestionAnswer | null> {
    const answers = await this.getAnswers(
      questionId
    );

    return answers.length > 0
      ? answers[0]
      : null;
  }

  public async exists(
    questionId: UUID
  ): Promise<boolean> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select("id", {
        head: true,
        count: "exact",
      })
      .eq("id", questionId);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }

  public async deleteByPatient(
    patientId: UUID
  ): Promise<number> {
    const questions = await this.getByPatient(
      patientId
    );

    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("patient_id", patientId);

    if (error) {
      throw error;
    }

    return questions.length;
  }

  public async countByPatient(
    patientId: UUID
  ): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select("id", {
        head: true,
        count: "exact",
      })
      .eq("patient_id", patientId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  }
}