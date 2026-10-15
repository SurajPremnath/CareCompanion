-- ==========================================================
-- CareCompanion
-- Migration : 007_policies.sql
-- Version   : 1.0
-- Purpose   : Row Level Security Policies
-- ==========================================================

-- ==========================================================
-- PROFILES
-- Users can manage only their own profile
-- ==========================================================

CREATE POLICY profile_owner_policy
ON public.profiles
FOR ALL
TO authenticated
USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
);

-- ==========================================================
-- PATIENTS
-- Users can manage only their own patients
-- ==========================================================

CREATE POLICY patient_owner_policy
ON public.patients
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- ==========================================================
-- ASSESSMENTS
-- Users can manage only their own assessments
-- ==========================================================

CREATE POLICY assessment_owner_policy
ON public.assessments
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- ==========================================================
-- DAILY CARE
-- Users can manage only their own daily care entries
-- ==========================================================

CREATE POLICY daily_care_owner_policy
ON public.daily_care
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- ==========================================================
-- ASSESSMENT REPORTS
-- Ownership inherited through assessment
-- ==========================================================

CREATE POLICY assessment_report_owner_policy
ON public.assessment_reports
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.assessments a
        WHERE a.id = assessment_reports.assessment_id
        AND a.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.assessments a
        WHERE a.id = assessment_reports.assessment_id
        AND a.user_id = auth.uid()
    )
);