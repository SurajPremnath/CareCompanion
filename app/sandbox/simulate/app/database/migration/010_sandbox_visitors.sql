BEGIN;

-- ============================================================
-- CareVR Public Simulation Sandbox
-- Isolated visitor, session, and abuse-control schema
-- No dependency on production auth.users or patient records
-- ============================================================

create table public.sandbox_visitors (
    id uuid primary key default gen_random_uuid(),

    full_name text not null
        check (char_length(trim(full_name)) between 1 and 100),

    email_normalized text not null
        check (
            char_length(email_normalized) between 3 and 254
            and email_normalized = lower(trim(email_normalized))
        ),

    created_at timestamptz not null default now(),

    wishlist_opt_in_at timestamptz,

    wishlist_opt_out_at timestamptz,

    constraint uq_sandbox_visitors_email
        unique (email_normalized),

    constraint ck_sandbox_wishlist_opt_out
        check (
            wishlist_opt_out_at is null
            or wishlist_opt_in_at is not null
        )
);

create table public.sandbox_sessions (
    id uuid primary key default gen_random_uuid(),

    visitor_id uuid not null
        references public.sandbox_visitors(id)
        on delete cascade,

    -- SHA-256 hex digest only; never store the raw cookie token.
    token_hash text not null
        check (token_hash ~ '^[0-9a-f]{64}$'),

    created_at timestamptz not null default now(),

    expires_at timestamptz not null,

    revoked_at timestamptz,

    last_seen_at timestamptz,

    constraint uq_sandbox_sessions_token_hash
        unique (token_hash),

    constraint ck_sandbox_sessions_expiry
        check (expires_at > created_at)
);

create index idx_sandbox_sessions_visitor
    on public.sandbox_sessions (visitor_id);

create index idx_sandbox_sessions_expiry
    on public.sandbox_sessions (expires_at);

create table public.sandbox_rate_limits (
    -- HMAC-derived key hash; do not store raw IP addresses or emails.
    key_hash text primary key
        check (key_hash ~ '^[0-9a-f]{64}$'),

    window_started_at timestamptz not null default now(),

    request_count integer not null default 0
        check (request_count >= 0)
);

-- Atomically count attempts in a fixed window.
-- The caller must derive key_hash using a server-only HMAC secret.
create or replace function public.consume_sandbox_rate_limit(
    p_key_hash text,
    p_limit integer,
    p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $function$
declare
    v_count integer;
begin
    if p_key_hash is null
       or p_key_hash !~ '^[0-9a-f]{64}$'
       or p_limit is null
       or p_limit < 1
       or p_limit > 10000
       or p_window_seconds is null
       or p_window_seconds < 1
       or p_window_seconds > 86400 then
        raise exception 'Invalid Sandbox rate-limit parameters';
    end if;

    insert into public.sandbox_rate_limits (
        key_hash,
        window_started_at,
        request_count
    )
    values (
        p_key_hash,
        now(),
        1
    )
    on conflict (key_hash) do update
    set
        window_started_at = case
            when public.sandbox_rate_limits.window_started_at
                 + make_interval(secs => p_window_seconds) <= now()
            then now()
            else public.sandbox_rate_limits.window_started_at
        end,
        request_count = case
            when public.sandbox_rate_limits.window_started_at
                 + make_interval(secs => p_window_seconds) <= now()
            then 1
            else public.sandbox_rate_limits.request_count + 1
        end
    returning request_count into v_count;

    return v_count <= p_limit;
end;
$function$;

-- Browser roles receive no direct access to Sandbox records.
alter table public.sandbox_visitors enable row level security;
alter table public.sandbox_sessions enable row level security;
alter table public.sandbox_rate_limits enable row level security;

revoke all on table public.sandbox_visitors
    from public, anon, authenticated;

revoke all on table public.sandbox_sessions
    from public, anon, authenticated;

revoke all on table public.sandbox_rate_limits
    from public, anon, authenticated;

-- Explicit backend privileges; browser roles remain denied.
grant select, insert, update
    on table public.sandbox_visitors to service_role;

grant select, insert, update
    on table public.sandbox_sessions to service_role;
-- The rate-limit function is callable only by the server's service role.
revoke all on function public.consume_sandbox_rate_limit(text, integer, integer)
    from public, anon, authenticated;

grant execute on function public.consume_sandbox_rate_limit(text, integer, integer)
    to service_role;

COMMIT;
