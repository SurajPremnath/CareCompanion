import {
  SelfDailyCare
} from "@/lib/types/selfDailyCare";

//------------------------------------------------------------
// Database Row
//------------------------------------------------------------

export interface SelfDailyCareRow {

  id: string;

  user_id: string;

recorded_at: string;

overall_status:
  | "NO_CONCERNS_REPORTED"
  | "CONCERNS_REPORTED"
  | null;

temperature: number | null;

  temperature_unit: "F" | "C";

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms: string[];

  other_symptom: string | null;

  pain_locations: string[];

  other_pain_location: string | null;

  medications: unknown[];

  notes: string | null;

  created_at: string;

  updated_at: string;

}

//------------------------------------------------------------
// Mapper
//------------------------------------------------------------

export class SelfDailyCareMapper {

  //----------------------------------------------------------
  // Database → Domain
  //----------------------------------------------------------

  static toDomain(
    row: SelfDailyCareRow
  ): SelfDailyCare {

    return {

      id: row.id,

      userId: row.user_id,

      recordedAt: row.recorded_at,

overallStatus:
  row.overall_status,

temperature: row.temperature,

      temperatureUnit: row.temperature_unit,

      systolic: row.systolic,

      diastolic: row.diastolic,

      pulse: row.pulse,

      spo2: row.spo2,

      symptoms: row.symptoms as SelfDailyCare["symptoms"],

      otherSymptom: row.other_symptom,

      painLocations:
        row.pain_locations as SelfDailyCare["painLocations"],

      otherPainLocation:
        row.other_pain_location,

      medications:
        row.medications,

      notes: row.notes,

      createdAt: row.created_at,

      updatedAt: row.updated_at

    };

  }

  //----------------------------------------------------------
  // Domain → Insert
  //----------------------------------------------------------

  static toInsert(
    dailyCare: Omit<
      SelfDailyCare,
      "id" | "createdAt" | "updatedAt"
    >
  ) {

    return {

      user_id: dailyCare.userId,

      recorded_at: dailyCare.recordedAt,

overall_status:
  dailyCare.overallStatus,

temperature: dailyCare.temperature,

      temperature_unit: dailyCare.temperatureUnit,

      systolic: dailyCare.systolic,

      diastolic: dailyCare.diastolic,

      pulse: dailyCare.pulse,

      spo2: dailyCare.spo2,

      symptoms: dailyCare.symptoms,

      other_symptom:
        dailyCare.otherSymptom,

      pain_locations:
        dailyCare.painLocations,

      other_pain_location:
        dailyCare.otherPainLocation,

      medications:
        dailyCare.medications ?? [],

      notes:
        dailyCare.notes

    };

  }

}