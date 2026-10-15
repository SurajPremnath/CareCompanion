-- ==========================================================
-- CareCompanion
-- Migration : 002_functions.sql
-- Version   : 1.0
-- Purpose   : Common reusable database functions
-- ==========================================================

-- ==========================================================
-- Function: set_updated_at()
--
-- Automatically updates the updated_at column whenever
-- a row is modified.
-- ==========================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


-- ==========================================================
-- Function: handle_new_user()
--
-- Automatically creates a profile whenever a new user
-- registers through Supabase Authentication.
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

    INSERT INTO public.profiles
    (
        id,
        email,
        full_name
    )
    VALUES
    (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data ->> 'full_name',
            ''
        )
    );

    RETURN NEW;

END;
$$;