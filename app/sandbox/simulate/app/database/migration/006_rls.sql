-- ==========================================================
-- CareCompanion
-- Migration : 006_rls.sql
-- Version   : 1.0
-- Purpose   : Enable Row Level Security (RLS)
-- ==========================================================

-- ==========================================================
-- Enable Row Level Security
-- ==========================================================

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.patients
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessments
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assessment_reports
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.daily_care
ENABLE ROW LEVEL SECURITY;