-- ════════════════════════════════════════════════════════════════════════════
-- ADMIN — who has signed up, and are they paying
-- Rewritten 2026-09-15: simpler than the first version, and the first version
-- was also broken. Safe to run over it — everything drops first.
-- ════════════════════════════════════════════════════════════════════════════
--
-- ⚠️ THIS IS THE FIRST ADMIN SURFACE THAT EXPOSES DATA. src/lib/admin.js says:
--
--     "THIS IS UI HIDING, NOT SECURITY … If an admin screen ever performs a
--      privileged ACTION, the check must move server-side."
--
-- ADMIN_EMAILS ships inside the APK. So the enforcement is `public.is_admin()`
-- here, and `AdminGate` stays what it always was: a way to hide a menu item.

-- ── who is an admin ─────────────────────────────────────────────────────────

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies: the client can neither read nor write this. Only the service
-- role and the security-definer function below can see it.

-- ⚠️ `set search_path = ''` is not optional. Without it a caller can put their
-- own schema ahead of public and have this read THEIR `admins` table.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ⚠️ RUN THIS OR EVERY VIEW BELOW RETURNS ZERO ROWS AND LOOKS BROKEN.
-- RLS returns an empty set, never a permission error, so "not an admin" and
-- "no users yet" are indistinguishable from the app.
--
-- Seed every admin account in one statement. `in (...)` rather than one insert
-- per person, and `on conflict do nothing` so re-running it is safe:
--
--   insert into public.admins (user_id, note)
--   select id, email from auth.users
--   where email in (
--     'devanlee2nd@gmail.com',
--     'tomatohater777@gmail.com',
--     'techkage@proton.me'
--   )
--   on conflict (user_id) do nothing;
--
-- ⚠️ THIS INSERTS NOTHING, SILENTLY, IF THE ADDRESS DOES NOT MATCH EXACTLY —
-- a different case, a Gmail dot, or signing up with a provider that stored a
-- different address. `select count(*) from public.admins;` afterwards, or seed
-- by uid instead: /admin-users prints the current session's uid and a ready
-- statement when it finds you are not an admin.
--
-- These three are the same list as ADMIN_EMAILS in src/lib/admin.js. ⚠️ They
-- are NOT kept in sync by anything — that list hides menu items, this table
-- grants data access, and they are allowed to differ. Someone removed from the
-- app list still reads every user's email until deleted here.

-- ── is this account pro? ────────────────────────────────────────────────────
--
-- ⚠️ NOTHING IN SUPABASE KNEW THIS BEFORE 2026-09-15. Pro lives in RevenueCat
-- and in the app's memory; the profiles row was never told. So the dashboard
-- could not answer "how many people are paying", which is the main question it
-- exists to answer.
--
-- This column is written BY THE APP when it resolves the entitlement.
--
-- ⚠️ IT IS CLIENT-REPORTED, SO IT IS A REPORT, NOT A SOURCE OF TRUTH. A patched
-- build could write `true`. That is fine for counting subscribers on a
-- dashboard and NEVER acceptable for unlocking anything — gating stays with
-- RevenueCat. The real fix, when it is worth the work, is a RevenueCat webhook
-- into an Edge Function that writes this column server-side; then flip the
-- policy below to deny client writes.
alter table public.profiles add column if not exists is_pro boolean not null default false;
alter table public.profiles add column if not exists pro_checked_at timestamptz;

comment on column public.profiles.is_pro is
  'Client-reported RevenueCat entitlement. For dashboard counts only — never gate on this.';

-- ── the view ────────────────────────────────────────────────────────────────
--
-- ⚠️ DEFINER RIGHTS — **NOT** `security_invoker = true`, which is what the
-- first version used and why it failed with:
--
--     ERROR: permission denied for table users
--
-- An invoker-rights view runs as the CALLER, and `authenticated` cannot read
-- `auth.users`. The opposite rule applies to `story_manifest` in
-- 01-stories.sql, which MUST respect RLS on public.stories.
--
-- ⚠️ WHICH MAKES `where public.is_admin()` THE ONLY GUARD ON THIS VIEW.
-- Definer rights mean RLS no longer filters anything. Delete that line and this
-- is a public dump of every user's email. `auth.uid()` still resolves inside a
-- definer view — it reads the request JWT — so the gate works.
--
-- ⚠️ DROPPED, NOT REPLACED. `create or replace view` does not clear a reloption
-- that is already set, so a view created with security_invoker=true would keep
-- it and fail again.
drop view if exists public.admin_signups_daily cascade;
drop view if exists public.admin_totals cascade;
drop view if exists public.admin_user_progress cascade;
drop view if exists public.admin_users cascade;

create view public.admin_users as
  select
    p.id,
    p.email,
    p.username,
    p.display_name,
    coalesce(p.is_pro, false)                as is_pro,
    u.created_at                             as joined_at,
    u.last_sign_in_at,
    -- One number, not a progress report: enough to tell an account that is used
    -- from one that was made and abandoned.
    coalesce((pr.data -> 'xp')::int, 0)      as xp
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.progress pr on pr.user_id = p.id
  where public.is_admin();

comment on view public.admin_users is
  'One row per signed-in user. Returns nothing unless auth.uid() is in public.admins.';

-- ── the totals ──────────────────────────────────────────────────────────────
--
-- ⚠️ SIGNED-IN USERS ONLY, AND THAT IS NOT A LIMITATION TO PAPER OVER. Guest
-- progress lives in device storage as 'kawmhmoob.progress.guest' and never
-- reaches Supabase. Quoting total_users as "users" overstates nothing and
-- understates everyone who never made an account.
create view public.admin_totals as
  select
    count(*)                                                            as total_users,
    count(*) filter (where is_pro)                                      as pro_users,
    count(*) filter (where not is_pro)                                  as free_users,
    count(*) filter (where last_sign_in_at > now() - interval '7 days') as active_7d,
    count(*) filter (where last_sign_in_at > now() - interval '30 days') as active_30d,
    count(*) filter (where joined_at > now() - interval '7 days')       as new_7d,
    count(*) filter (where xp > 0)                                      as ever_practised
  from public.admin_users;

-- ── why is my dashboard empty? ──────────────────────────────────────────────
--
-- The one call that tells the two failure modes apart, because the views
-- cannot: an empty result and "you are not an admin" look identical.
create or replace function public.admin_whoami()
returns table (uid uuid, is_admin boolean, total_profiles bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select
    auth.uid(),
    public.is_admin(),
    (select count(*) from public.profiles);
$$;

comment on function public.admin_whoami is
  'Diagnostic. is_admin false → seed public.admins. true with total_profiles 0 → nobody has signed up.';

-- ── grants ──────────────────────────────────────────────────────────────────
-- Belt and braces: is_admin() already returns false for anon, but these views
-- run with definer rights and ignore RLS, so be explicit about who may ask.
revoke all on public.admin_users  from anon;
revoke all on public.admin_totals from anon;
grant select on public.admin_users  to authenticated;
grant select on public.admin_totals to authenticated;
grant execute on function public.admin_whoami() to authenticated;

-- ── check ───────────────────────────────────────────────────────────────────
--   select * from public.admin_whoami();
--   select * from public.admin_totals;
--   select * from public.admin_users order by joined_at desc;
