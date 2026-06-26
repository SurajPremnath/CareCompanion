-- ==========================================================
-- CareCompanion
-- Migration : 001_initial_schema.sql
-- Version   : 1.0
-- Purpose   : Initial Production Database Schema
-- ==========================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- PROFILES
-- ==========================================================

CREATE TABLE public.profiles (

    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT,

    email TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- ==========================================================
-- PATIENTS
-- ==========================================================

CREATE TABLE public.patients (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,

    date_of_birth DATE,

    gender TEXT CHECK (
        gender IN (
            'Male',
            'Female',
            'Other',
            'Prefer not to say'
        )
    ),

    relationship TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_patients_user
ON public.patients(user_id);

-- ==========================================================
-- ASSESSMENTS
-- ==========================================================

CREATE TABLE public.assessments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,

    assessment_type TEXT NOT NULL
    CHECK (
        assessment_type IN (
            'SELF',
            'FAMILY'
        )
    ),

    responses_json JSONB NOT NULL,

    score INTEGER,

    risk_level TEXT,

    completed_at TIMESTAMPTZ DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_assessments_patient
ON public.assessments(patient_id);

-- ==========================================================
-- REPORTS
-- ==========================================================

CREATE TABLE public.reports (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL
        REFERENCES public.assessments(id)
        ON DELETE CASCADE,

    report_json JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_reports_assessment
ON public.reports(assessment_id);

-- ==========================================================
-- DAILY CARE
-- ==========================================================

CREATE TABLE public.daily_care (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL
        REFERENCES public.patients(id)
        ON DELETE CASCADE,

    has_fever BOOLEAN,

    temperature NUMERIC(4,1),

    has_prescribed_medicines BOOLEAN NOT NULL DEFAULT FALSE,

    medicine_taken_status TEXT
    CHECK (
        medicine_taken_status IN (
            'YES',
            'PARTIAL',
            'NO'
        )
    ),

    feeling TEXT
    CHECK (
        feeling IN (
            'BETTER',
            'SAME',
            'WORSE'
        )
    ),

    notes TEXT,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_dailycare_patient
ON public.daily_care(patient_id);

-- ==========================================================
-- ROW LEVEL SECURITY
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_care ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- PROFILES
-- ==========================================================

CREATE POLICY "Users can manage own profile"
ON public.profiles
FOR ALL
USING (auth.uid() = id);

-- ==========================================================
-- PATIENTS
-- ==========================================================

CREATE POLICY "Users manage own patients"
ON public.patients
FOR ALL
USING (auth.uid() = user_id);

-- ==========================================================
-- ASSESSMENTS
-- ==========================================================

CREATE POLICY "Users manage own assessments"
ON public.assessments
FOR ALL
USING (

    EXISTS (

        SELECT 1

        FROM public.patients p

        WHERE p.id = patient_id

        AND p.user_id = auth.uid()

    )

);

-- ==========================================================
-- REPORTS
-- ==========================================================

CREATE POLICY "Users manage own reports"
ON public.reports
FOR ALL
USING (

    EXISTS (

        SELECT 1

        FROM public.assessments a

        JOIN public.patients p

            ON p.id = a.patient_id

        WHERE a.id = assessment_id

        AND p.user_id = auth.uid()

    )

);

-- ==========================================================
-- DAILY CARE
-- ==========================================================

CREATE POLICY "Users manage own daily care"
ON public.daily_care
FOR ALL
USING (

    EXISTS (

        SELECT 1

        FROM public.patients p

        WHERE p.id = patient_id

        AND p.user_id = auth.uid()

    )

);