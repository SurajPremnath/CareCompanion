// lib/repositories/assessmentRepository.ts

import { supabase } from "@/lib/supabase";

import {
  AssessmentMapper,
  type AssessmentRow,
} from "@/lib/mappers/assessmentMapper";

import type {
  AssessmentInput,
  AssessmentRecord,
} from "@/lib/types/assessment";

export class AssessmentRepository {

  //------------------------------------------------------------
  // Create
  //------------------------------------------------------------

  async create(
    assessment: AssessmentInput
  ): Promise<AssessmentRecord> {

    const payload =
      AssessmentMapper.toInsert(
        assessment
      );

    const {
      data,
      error,
    } = await supabase
      .from("assessments")
      .insert(payload)
      .select()
      .single();

    if (error) {

      console.error(
        "Supabase Insert Error:",
        error
      );

      throw new Error(
        error.message
      );

    }

    return AssessmentMapper.toDomain(
      data as AssessmentRow
    );

  }

  //------------------------------------------------------------
  // Get By Id
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<
    AssessmentRecord | null
  > {

    const {
      data,
      error,
    } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      return null;

    }

    return AssessmentMapper.toDomain(
      data as AssessmentRow
    );

  }

  //------------------------------------------------------------
  // Get Patient Assessments
  //------------------------------------------------------------

  async getByPatientId(
    patientId: string
  ): Promise<
    AssessmentRecord[]
  > {

    const {
      data,
      error,
    } = await supabase
      .from("assessments")
      .select("*")
      .eq(
        "patient_id",
        patientId
      )
      .order(
        "completed_at",
        {
          ascending: false,
        }
      );

    if (
      error ||
      !data
    ) {

      return [];

    }

    return AssessmentMapper.toDomainList(
      data as AssessmentRow[]
    );

  }

  //------------------------------------------------------------
  // Get User Assessments
  //------------------------------------------------------------

  async getByUserId(
    userId: string
  ): Promise<AssessmentRecord[]> {

    const {
      data,
      error,
    } = await supabase
      .from("assessments")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "completed_at",
        {
          ascending: false,
        }
      );

    if (
      error ||
      !data
    ) {

      return [];

    }

    return AssessmentMapper.toDomainList(
      data as AssessmentRow[]
    );

  }

  //------------------------------------------------------------
  // Update
  //------------------------------------------------------------

  async update(
    id: string,
    assessment: AssessmentInput
  ): Promise<AssessmentRecord> {

    const payload =
      AssessmentMapper.toInsert(
        assessment
      );

    const {
      data,
      error,
    } = await supabase
      .from("assessments")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {

      console.error(
        "Supabase Update Error:",
        error
      );

      throw new Error(
        error.message
      );

    }

    return AssessmentMapper.toDomain(
      data as AssessmentRow
    );

  }

  //------------------------------------------------------------
  // Delete
  //------------------------------------------------------------

  async delete(
    id: string
  ): Promise<void> {

    const {
      error,
    } = await supabase
      .from("assessments")
      .delete()
      .eq("id", id);

    if (error) {

      console.error(
        "Supabase Delete Error:",
        error
      );

      throw new Error(
        error.message
      );

    }

  }

}

export const assessmentRepository =
  new AssessmentRepository();