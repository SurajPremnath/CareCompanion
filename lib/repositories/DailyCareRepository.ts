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
// Get Latest Available Snapshot
//------------------------------------------------------------

async getLatestSnapshotByPatientId(
  patientId: string
): Promise<{
  latest: DailyCare | null;
  bloodPressure: DailyCare | null;
  spo2: DailyCare | null;
  pulse: DailyCare | null;
  temperature: DailyCare | null;
}> {

  const [
    latestResult,
    bloodPressureResult,
    spo2Result,
    pulseResult,
    temperatureResult
  ] = await Promise.all([

    supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .order(
        "recorded_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle(),

    supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .not(
        "systolic",
        "is",
        null
      )
      .not(
        "diastolic",
        "is",
        null
      )
      .order(
        "recorded_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle(),

    supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .not(
        "spo2",
        "is",
        null
      )
      .order(
        "recorded_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle(),

    supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .not(
        "pulse",
        "is",
        null
      )
      .order(
        "recorded_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle(),

    supabase
      .from("daily_care")
      .select("*")
      .eq("patient_id", patientId)
      .not(
        "temperature",
        "is",
        null
      )
      .order(
        "recorded_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle()

  ]);

  return {
    latest:
      latestResult.data
        ? DailyCareMapper.toDomain(
            latestResult.data as DailyCareRow
          )
        : null,

    bloodPressure:
      bloodPressureResult.data
        ? DailyCareMapper.toDomain(
            bloodPressureResult.data as DailyCareRow
          )
        : null,

    spo2:
      spo2Result.data
        ? DailyCareMapper.toDomain(
            spo2Result.data as DailyCareRow
          )
        : null,

    pulse:
      pulseResult.data
        ? DailyCareMapper.toDomain(
            pulseResult.data as DailyCareRow
          )
        : null,

    temperature:
      temperatureResult.data
        ? DailyCareMapper.toDomain(
            temperatureResult.data as DailyCareRow
          )
        : null
  };

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