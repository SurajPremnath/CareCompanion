// lib/journey/JourneyStorage.ts

import { supabase } from "@/lib/supabase/client";

const TABLE = "journey_analysis";

export class JourneyStorage {
  static async create(
    record: Record<string, unknown>,
  ): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .insert(record);

    if (error) throw error;
  }

  static async update(
    consultationId: string,
    record: Record<string, unknown>,
  ): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update(record)
      .eq("consultation_id", consultationId);

    if (error) throw error;
  }

  static async upsert(
    consultationId: string,
    record: Record<string, unknown>,
  ): Promise<void> {
    const exists = await this.exists(
      consultationId,
    );

    if (exists) {
      await this.update(
        consultationId,
        record,
      );
      return;
    }

    await this.create(record);
  }

  static async archive(
    consultationId: string,
    reason: string,
  ): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({
        archived: true,
        archived_reason: reason,
        archived_at: new Date().toISOString(),
      })
      .eq("consultation_id", consultationId);

    if (error) throw error;
  }

  static async findByConsultationId(
    consultationId: string,
  ): Promise<Record<string, unknown> | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("consultation_id", consultationId)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  static async findByPatientId(
    patientId: string,
  ): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("patient_id", patientId)
      .eq("archived", false)
      .order("consultation_date", {
        ascending: false,
      });

    if (error) throw error;

    return data ?? [];
  }

  static async findLatestByPatientId(
    patientId: string,
  ): Promise<Record<string, unknown> | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("patient_id", patientId)
      .eq("archived", false)
      .order("consultation_date", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  static async exists(
    consultationId: string,
  ): Promise<boolean> {
    const { count, error } = await supabase
      .from(TABLE)
      .select("*", {
        head: true,
        count: "exact",
      })
      .eq("consultation_id", consultationId);

    if (error) throw error;

    return (count ?? 0) > 0;
  }

  static async delete(
    consultationId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("consultation_id", consultationId);

    if (error) throw error;
  }
}