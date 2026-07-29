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

export interface MedicineMasterRow {
    id: string;
    medicine_code: string;
    brand_name: string;
    generic_name: string | null;
    strength: string | null;
    formulation: string | null;
    manufacturer: string | null;
    search_key: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MedicineAliasRow {
    id: string;
    medicine_id: string;
    alias: string;
    verified_count: number;
    source: "USER" | "IMPORT" | "SYSTEM";
    created_at: string;
}