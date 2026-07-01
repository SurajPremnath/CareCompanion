import { supabase } from "@/lib/supabase";

import {
  SelfDailyCareMapper,
  type SelfDailyCareRow
} from "@/lib/mappers/SelfDailyCareMapper";

import type { SelfDailyCare } from "@/lib/types/selfDailyCare";

export class SelfDailyCareRepository {

  //------------------------------------------------------------
  // Create
  //------------------------------------------------------------

  async create(
    dailyCare: Omit<
      SelfDailyCare,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<SelfDailyCare> {

    const payload =
      SelfDailyCareMapper.toInsert(
        dailyCare
      );

    const {
      data,
      error
    } = await supabase
      .from("self_daily_care")
      .insert(payload)
      .select()
      .single();

    if (error) {

      console.error(
        "Supabase Insert Error:",
        error
      );

      throw new Error(error.message);

    }

    return SelfDailyCareMapper.toDomain(
      data as SelfDailyCareRow
    );

  }

  //------------------------------------------------------------
  // Get By Id
  //------------------------------------------------------------

  async getById(
    id: string
  ): Promise<SelfDailyCare | null> {

    const {
      data,
      error
    } = await supabase
      .from("self_daily_care")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      return null;

    }

    return SelfDailyCareMapper.toDomain(
      data as SelfDailyCareRow
    );

  }

  //------------------------------------------------------------
  // User History
  //------------------------------------------------------------

  async getByUserId(
    userId: string
  ): Promise<SelfDailyCare[]> {

    const {
      data,
      error
    } = await supabase
      .from("self_daily_care")
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
      SelfDailyCareMapper.toDomain(
        row as SelfDailyCareRow
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
      .from("self_daily_care")
      .delete()
      .eq("id", id);

    if (error) {

      throw error;

    }

  }

}

export const selfDailyCareRepository =
  new SelfDailyCareRepository();