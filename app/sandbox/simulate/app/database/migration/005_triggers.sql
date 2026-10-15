-- ==========================================================
-- CareCompanion
-- Migration : 005_triggers.sql
-- Version   : 1.0
-- Purpose   : Database triggers
-- ==========================================================

-- ==========================================================
-- PROFILES
-- Automatically update updated_at
-- ==========================================================

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ==========================================================
-- PATIENTS
-- Automatically update updated_at
-- ==========================================================

CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE
ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ==========================================================
-- ASSESSMENTS
-- Automatically update updated_at
-- ==========================================================

CREATE TRIGGER trg_assessments_updated_at
BEFORE UPDATE
ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ==========================================================
-- DAILY CARE
-- Automatically update updated_at
-- ==========================================================

CREATE TRIGGER trg_daily_care_updated_at
BEFORE UPDATE
ON public.daily_care
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ==========================================================
-- AUTHENTICATION
-- Automatically create profile after signup
-- ==========================================================

CREATE TRIGGER trg_auth_user_created
AFTER INSERT
ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();