-- ==========================================================
-- CareCompanion
-- Migration : 008_enum_permissions.sql
-- Purpose   : Grant access to enum schema and enum types
-- ==========================================================

-- Allow application roles to reference enum types
GRANT USAGE ON SCHEMA app_enum TO authenticated;
GRANT USAGE ON SCHEMA app_enum TO anon;

-- Grant usage on all existing enum types
GRANT USAGE ON TYPE app_enum.gender_type TO authenticated;
GRANT USAGE ON TYPE app_enum.gender_type TO anon;

GRANT USAGE ON TYPE app_enum.patient_status_type TO authenticated;
GRANT USAGE ON TYPE app_enum.patient_status_type TO anon;

GRANT USAGE ON TYPE app_enum.assessment_type TO authenticated;
GRANT USAGE ON TYPE app_enum.assessment_type TO anon;

GRANT USAGE ON TYPE app_enum.risk_category_type TO authenticated;
GRANT USAGE ON TYPE app_enum.risk_category_type TO anon;

GRANT USAGE ON TYPE app_enum.feeling_type TO authenticated;
GRANT USAGE ON TYPE app_enum.feeling_type TO anon;

GRANT USAGE ON TYPE app_enum.medication_status_type TO authenticated;
GRANT USAGE ON TYPE app_enum.medication_status_type TO anon;