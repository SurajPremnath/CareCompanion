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
  _assessment: AssessmentInput
): Promise<AssessmentRecord> {
  throw new Error(
    "New assessments must be saved through the encrypted server-side assessment API."
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
  (data as AssessmentRow[]).filter(
    (row) => row.record_classification !== "ENCRYPTED_V1"
  )
);

  }

  //------------------------------------------------------------
  // Get User Assessments
  //------------------------------------------------------------


async getByUserId(userId: string): Promise<AssessmentRecord[]> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const historicalRows = (data as AssessmentRow[]).filter(
    (row) => row.record_classification !== "ENCRYPTED_V1"
  );

  return AssessmentMapper.toDomainList(historicalRows);
}


  //------------------------------------------------------------
  // Update
  //------------------------------------------------------------

async update(
  id: string,
  assessment: AssessmentInput
): Promise<AssessmentRecord> {
  const { data: existing, error: lookupError } = await supabase
    .from("assessments")
    .select("id, record_classification")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) {
    throw new Error(
      `Unable to verify assessment before update: ${lookupError.message}`
    );
  }

  if (!existing) {
    throw new Error("Assessment not found or access denied.");
  }

  if (existing.record_classification === "ENCRYPTED_V1") {
    throw new Error(
      "Encrypted assessments cannot be updated through the legacy repository."
    );
  }

  const payload = AssessmentMapper.toInsert(assessment);

  const { data, error } = await supabase
    .from("assessments")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return AssessmentMapper.toDomain(data as AssessmentRow);
}

  //------------------------------------------------------------
  // Delete
  //------------------------------------------------------------

async delete(
  id: string
): Promise<void> {
  const { data: existing, error: lookupError } = await supabase
    .from("assessments")
    .select("id, record_classification")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) {
    throw new Error(
      `Unable to verify assessment before deletion: ${lookupError.message}`
    );
  }

  if (!existing) {
    throw new Error("Assessment not found or access denied.");
  }

  if (existing.record_classification === "ENCRYPTED_V1") {
    throw new Error(
      "Encrypted assessments cannot be deleted through the legacy repository."
    );
  }

  const { error } = await supabase
    .from("assessments")
    .delete()
    .eq("id", id)
    .neq("record_classification", "ENCRYPTED_V1");

  if (error) {
    throw new Error(error.message);
  }
}

}

export const assessmentRepository =
  new AssessmentRepository();