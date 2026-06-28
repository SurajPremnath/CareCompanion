import { supabase } from "@/lib/supabase";

import {
  DailyCareMapper,
  type DailyCareRow
} from "@/lib/mappers/DailyCareMapper";

import type { DailyCare } from "@/lib/types/dailyCare";

export class DailyCareRepository {

  //------------------------------------------------------------
  // Create
  //------------------------------------------------------------

  async create(
    dailyCare: Omit<
      DailyCare,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<DailyCare> {

    const payload =
      DailyCareMapper.toInsert(
        dailyCare
      );

    const {
      data,
      error
    } = await supabase
      .from("daily_care")
      .insert(payload)
      .select()
      .single();


if (error) {

  console.error("Supabase Insert Error:", error);

  throw new Error(error.message);

}

    return DailyCareMapper.toDomain(
      data as DailyCareRow
    );

  }

  //------------------------------------------------------------
  // Get By Id
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<DailyCare | null> {

    const {
      data,
      error
    } = await supabase
      .from("daily_care")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      return null;

    }

    return DailyCareMapper.toDomain(
      data as DailyCareRow
    );

  }

  //------------------------------------------------------------
  // Get Patient Readings
  //------------------------------------------------------------

  async getByPatientId(
    patientId: string
  ): Promise<DailyCare[]> {

    const {
      data,
      error
    } = await supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .order(
        "recorded_at",
        {
          ascending: false
        }
      );

    if (error || !data) {

      return [];

    }

    return data.map(row =>
      DailyCareMapper.toDomain(
        row as DailyCareRow
      )
    );

  }

  //------------------------------------------------------------
  // Get User Readings
  //------------------------------------------------------------

  async getByUserId(
    userId: string
  ): Promise<DailyCare[]> {

    const {
      data,
      error
    } = await supabase
      .from("daily_care")
      .select("*")
      .eq("user_id", userId)
      .order(
        "recorded_at",
        {
          ascending: false
        }
      );

    if (error || !data) {

      return [];

    }

    return data.map(row =>
      DailyCareMapper.toDomain(
        row as DailyCareRow
      )
    );

  }

  //------------------------------------------------------------
  // Delete
  //------------------------------------------------------------

  async delete(
    id: string
  ): Promise<void> {

    const {
      error
    } = await supabase
      .from("daily_care")
      .delete()
      .eq("id", id);

    if (error) {

      throw error;

    }

  }

}

export const dailyCareRepository =
  new DailyCareRepository();