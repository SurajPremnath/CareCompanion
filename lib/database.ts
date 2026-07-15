/**
 * Database row types.
 *
 * These interfaces mirror the PostgreSQL schema.
 * They are used only inside repositories and mappers.
 */

export interface PatientRow {
  id: string;
  user_id: string;

  full_name: string;

  date_of_birth: string | null;

  gender: "Male" | "Female" | "Other" | "Prefer not to say" | null;

  relationship: string | null;

  status: "ACTIVE" | "INACTIVE";

  created_at: string;

  updated_at: string;
}

export interface SelfProfileRow {

  id: string;

  user_id: string;

  date_of_birth: string | null;

is_completed: boolean;

  created_at: string;

  updated_at: string;

}

export interface ClinicalEventRow {
  id: string;

  user_id: string;

  patient_id: string | null;

  event_type: string;

  source_table: string;

  source_id: string;

  event_date: string;

  title: string;

  summary: string | null;

  created_at: string;
}