-- ==========================================================
-- CareCompanion
-- Migration : 004_indexes.sql
-- Version   : 1.0
-- Purpose   : Performance indexes and unique constraints
-- ==========================================================

-- ==========================================================
-- PATIENTS
-- ==========================================================

CREATE INDEX idx_patients_user
ON public.patients(user_id);

CREATE INDEX idx_patients_status
ON public.patients(status);

-- ==========================================================
-- ASSESSMENTS
-- ==========================================================

CREATE INDEX idx_assessments_user
ON public.assessments(user_id);

CREATE INDEX idx_assessments_patient
ON public.assessments(patient_id);

CREATE INDEX idx_assessments_type
ON public.assessments(assessment_type);

CREATE INDEX idx_assessments_completed
ON public.assessments(completed_at DESC);

CREATE INDEX idx_assessments_patient_completed
ON public.assessments(
    patient_id,
    completed_at DESC
);

CREATE INDEX idx_assessments_self
ON public.assessments(
    user_id,
    assessment_type
);

-- ==========================================================
-- REPORTS
-- ==========================================================

CREATE INDEX idx_reports_assessment
ON public.assessment_reports(assessment_id);

CREATE UNIQUE INDEX uq_reports_assessment
ON public.assessment_reports(assessment_id);

-- ==========================================================
-- DAILY CARE
-- ==========================================================

CREATE INDEX idx_dailycare_patient
ON public.daily_care(patient_id);

CREATE INDEX idx_dailycare_date
ON public.daily_care(care_date DESC);

CREATE INDEX idx_dailycare_patient_date
ON public.daily_care(
    patient_id,
    care_date DESC
);

CREATE INDEX idx_dailycare_user
ON public.daily_care(user_id);

-- ==========================================================
-- BUSINESS RULES
-- ==========================================================

-- One Daily Care entry per patient per day

CREATE UNIQUE INDEX uq_dailycare_patient_date
ON public.daily_care(
    patient_id,
    care_date
);

