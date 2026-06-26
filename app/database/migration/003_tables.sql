-- ==========================================================
-- CareCompanion
-- Migration : 003_tables.sql
-- Version   : 1.0
-- Purpose   : Create application tables
-- ==========================================================

-- ==========================================================
-- ENUM SCHEMA
-- ==========================================================

CREATE SCHEMA IF NOT EXISTS app_enum;

-- ==========================================================
-- ENUM TYPES
-- ==========================================================

CREATE TYPE app_enum.gender_type AS ENUM (
    'Male',
    'Female',
    'Other',
    'Prefer not to say'
);

CREATE TYPE app_enum.patient_status_type AS ENUM (
    'ACTIVE',
    'INACTIVE'
);

CREATE TYPE app_enum.assessment_type AS ENUM (
    'SELF',
    'FAMILY'
);

CREATE TYPE app_enum.risk_category_type AS ENUM (
    'LOW',
    'MODERATE',
    'HIGH'
);

CREATE TYPE app_enum.feeling_type AS ENUM (
    'BETTER',
    'SAME',
    'WORSE'
);

CREATE TYPE app_enum.medication_status_type AS ENUM (
    'YES',
    'PARTIAL',
    'NO'
);

-- ==========================================================
-- PROFILES
-- ==========================================================

CREATE TABLE public.profiles (

    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    email TEXT NOT NULL UNIQUE,

    full_name TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

COMMENT ON TABLE public.profiles IS
'Application user profile';

-- ==========================================================
-- PATIENTS
-- ==========================================================

CREATE TABLE public.patients (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    full_name TEXT NOT NULL,

    date_of_birth DATE,

    gender app_enum.gender_type,

    relationship TEXT,

    status app_enum.patient_status_type
        NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

COMMENT ON TABLE public.patients IS
'Patients belonging to a user';

-- ==========================================================
-- ASSESSMENTS
-- ==========================================================

CREATE TABLE public.assessments (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    patient_id UUID
        REFERENCES public.patients(id)
        ON DELETE CASCADE,

    assessment_type app_enum.assessment_type
        NOT NULL,

    responses_json JSONB NOT NULL,

    score INTEGER,

    risk_category app_enum.risk_category_type,

    assessment_version INTEGER
        NOT NULL DEFAULT 1,

    completed_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

    -- Business Rule:
    -- SELF assessments must not have a patient.
    -- FAMILY assessments must have a patient.
    CONSTRAINT chk_assessment_patient_relationship
    CHECK (
        (
            assessment_type = 'SELF'
            AND patient_id IS NULL
        )
        OR
        (
            assessment_type = 'FAMILY'
            AND patient_id IS NOT NULL
        )
    )
);

COMMENT ON TABLE public.assessments IS
'Stores Self and Family assessments';

-- ==========================================================
-- ASSESSMENT REPORTS
-- ==========================================================

CREATE TABLE public.assessment_reports (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL
        REFERENCES public.assessments(id)
        ON DELETE CASCADE,

    report_json JSONB NOT NULL,

    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

);

COMMENT ON TABLE public.assessment_reports IS
'Generated assessment reports';

-- ==========================================================
-- DAILY CARE
-- ==========================================================

CREATE TABLE public.daily_care (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    patient_id UUID NOT NULL
        REFERENCES public.patients(id)
        ON DELETE CASCADE,

    care_date DATE
        NOT NULL DEFAULT CURRENT_DATE,

    has_fever BOOLEAN
        NOT NULL DEFAULT FALSE,

    temperature NUMERIC(4,1)
        CHECK (
            temperature IS NULL
            OR temperature BETWEEN 90.0 AND 110.0
        ),

    is_on_medication BOOLEAN
        NOT NULL DEFAULT FALSE,

    medication_taken app_enum.medication_status_type,

    feeling app_enum.feeling_type,

    requires_attention BOOLEAN
        NOT NULL DEFAULT FALSE,

    notes TEXT,

    recorded_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ
        NOT NULL DEFAULT NOW()

);

COMMENT ON TABLE public.daily_care IS
'Daily caregiver check-ins';