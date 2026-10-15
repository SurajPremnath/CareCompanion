-- ============================================================
-- Self Profiles
-- One Personal Health Profile per authenticated user
-- ============================================================

create table if not exists self_profiles (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    date_of_birth date,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint uq_self_profile_user
        unique(user_id)

);

---------------------------------------------------------------
-- Updated At Trigger
---------------------------------------------------------------

create trigger trg_self_profiles_updated_at
before update
on self_profiles
for each row
execute function update_updated_at_column();