import { supabase } from "@/lib/supabase";

import type { ClinicalEventRow } from "@/lib/database";

import {
  ClinicalEvent,
  CreateClinicalEventRequest,
} from "@/lib/types/clinicalEvent";

import { ClinicalEventMapper } from "@/lib/mappers/clinicalEventMapper";

export class ClinicalEventRepository {

//------------------------------------------------------------
// Create Clinical Event
//------------------------------------------------------------

static async create(
  event: CreateClinicalEventRequest
): Promise<void> {

  const { error } = await supabase
    .from("clinical_events")
    .insert(
      ClinicalEventMapper.toInsert(event)
    );

  if (error) {
    throw new Error(error.message);
  }

}

  //------------------------------------------------------------
  // Get Event By Id
  //------------------------------------------------------------

  static async getById(
    id: string
  ): Promise<ClinicalEvent | null> {

    const { data, error } = await supabase
      .from("clinical_events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return ClinicalEventMapper.toDomain(
      data as ClinicalEventRow
    );

  }

  //------------------------------------------------------------
  // Get Patient Timeline
  //------------------------------------------------------------

  static async getByPatient(
    patientId: string
  ): Promise<ClinicalEvent[]> {

    const { data, error } = await supabase
      .from("clinical_events")
      .select("*")
      .eq("patient_id", patientId)
      .order("event_date", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      row =>
        ClinicalEventMapper.toDomain(
          row as ClinicalEventRow
        )
    );

  }

}