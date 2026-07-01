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