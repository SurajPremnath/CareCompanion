import type {
  DailyCare,
  DailyCareSymptom,
  PainLocation
} from "@/lib/types/dailyCare";

export interface DailyCareRow {

  id: string;

  user_id: string;

  patient_id: string;

recorded_at: string;

overall_status:
  "NO_CONCERNS_REPORTED"
  | "CONCERNS_REPORTED"
  | null;

temperature: number | null;

  temperature_unit: "F" | "C";

weight_kg: number | null;

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms: string[];

other_symptom: string | null;

  pain_locations: string[];

other_pain_location: string | null;

  created_at: string;

  updated_at: string;

}

export class DailyCareMapper {

  //------------------------------------------------------------
  // Database Row -> Domain Model
  //------------------------------------------------------------

  static toDomain(
    row: DailyCareRow
  ): DailyCare {

    return {

      id: row.id,

      userId: row.user_id,

      patientId: row.patient_id,

recordedAt: row.recorded_at,

overallStatus:
  row.overall_status,

temperature: row.temperature,

      temperatureUnit: row.temperature_unit,

weightKg: row.weight_kg,

      systolic: row.systolic,

      diastolic: row.diastolic,

      pulse: row.pulse,

      spo2: row.spo2,

      symptoms:
        row.symptoms as DailyCareSymptom[],

otherSymptom:
  row.other_symptom,

      painLocations:
        row.pain_locations as PainLocation[],

otherPainLocation:
  row.other_pain_location,

      createdAt: row.created_at,

      updatedAt: row.updated_at

    };

  }

  //------------------------------------------------------------
  // Domain Model -> Database Insert
  //------------------------------------------------------------

  static toInsert(
    dailyCare: Omit<
      DailyCare,
      "id" | "createdAt" | "updatedAt"
    >
  ) {

    return {

      user_id: dailyCare.userId,

      patient_id: dailyCare.patientId,

      recorded_at: dailyCare.recordedAt,

overall_status:
  dailyCare.overallStatus,

temperature: dailyCare.temperature,

      temperature_unit: dailyCare.temperatureUnit,

weight_kg: dailyCare.weightKg,

      systolic: dailyCare.systolic,

      diastolic: dailyCare.diastolic,

      pulse: dailyCare.pulse,

      spo2: dailyCare.spo2,

      symptoms: dailyCare.symptoms,

other_symptom:
  dailyCare.otherSymptom ?? null,

      pain_locations: dailyCare.painLocations,

other_pain_location:
  dailyCare.otherPainLocation ?? null

    };

  }

}