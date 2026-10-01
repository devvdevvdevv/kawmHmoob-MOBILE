-- ════════════════════════════════════════════════════════════════════════════
-- STORIES — remote authoring and delivery
-- Written 2026-09-15. Run top to bottom in the Supabase SQL editor.
-- Design and reasoning: notes/2026-09-14-remote-story-delivery.md
-- ════════════════════════════════════════════════════════════════════════════
--
-- WHY SUPABASE AND NOT FASTAPI: this project already depends on
-- @supabase/supabase-js (auth, profiles, progress, leaderboard) and
-- expo-file-system. Remote stories therefore need no new infrastructure and no
-- server to keep alive on a read-only path.
--
-- ⚠️ THIS IS NOT A FIX FOR THE STARTUP LAG. That is 777 KB of JS object
-- literals parsed at launch plus buildIndex() running at module scope — all
-- local. Fetching JSON does not remove parsing, it moves it. See the
-- inlineRequires / lazy-INDEX item in notes/TODO.md.
--
-- ⚠️ THE APP MUST KEEP WORKING OFFLINE. The bundled stories are the floor;
-- this table only ever adds to or replaces what shipped. A device that never
-- reaches the network must behave exactly as it does today.

-- ── the table ───────────────────────────────────────────────────────────────

create table if not exists public.stories (
  -- Matches the in-app id exactly ('story-zong-vang'), so a row and a bundled
  -- story are the same identity and the client can merge them by key.
  id               text primary key,

  -- ⚠️ BUMP THIS ON EVERY PUBLISH. The client compares versions to decide what
  -- to download; forget it and readers keep a stale copy forever with no error
  -- anywhere. The publish script bumps it rather than trusting a human to.
  version          integer     not null default 1,

  status           text        not null default 'draft'
                     check (status in ('draft', 'published', 'archived')),

  -- ⚠️ THE FORWARD-COMPATIBILITY LATCH. A payload using a field an older build
  -- cannot render would otherwise crash or silently show a broken story, and
  -- there is no way to reach an installed app to fix it. Clients SKIP any row
  -- whose min_app_version is above their own. Semver-ish text, compared by the
  -- client, because that is where the app version is known.
  min_app_version  text        not null default '1.0.0',

  -- Manifest columns. Denormalised OUT of payload on purpose: the library
  -- screen needs only these, and they are a few hundred bytes for the whole
  -- library where the payloads are tens of KB each.
  title            text        not null,
  english          text,
  blurb            text,
  genre            text        not null,
  level            text,
  minutes          integer,

  -- Reading is free to everyone as of 2026-09-15 (see src/data/stories.js), so
  -- nothing reads this yet. It exists so that gating later is a policy change
  -- and not a migration.
  tier             text        not null default 'free'
                     check (tier in ('free', 'pro')),

  -- paragraphs, glossary, questions, warning, cover — the whole story object.
  payload          jsonb       not null,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.stories is
  'Reading stories. Bundled copies in src/data/stories.js are the offline floor; rows here add to or replace them.';
comment on column public.stories.version is
  'Bump on every publish. The client downloads only when this is higher than its cached copy.';
comment on column public.stories.min_app_version is
  'Clients skip rows above their own version. The only protection against shipping a payload an installed build cannot render.';

-- ── updated_at, maintained by the database ──────────────────────────────────
--
-- ⚠️ NOT SET BY THE CLIENT. A publish script that forgets it, or a clock that
-- is wrong, produces rows that sort incorrectly forever. The database has the
-- only clock that is always right here.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stories_touch_updated_at on public.stories;
create trigger stories_touch_updated_at
  before update on public.stories
  for each row execute function public.touch_updated_at();

-- ── indexes ─────────────────────────────────────────────────────────────────
-- The manifest query is the only hot path: published rows, by genre.
create index if not exists stories_published_idx
  on public.stories (status, genre) where status = 'published';

-- ── row level security ──────────────────────────────────────────────────────
--
-- ⚠️ THERE IS NO CLIENT WRITE POLICY, AND THAT IS DELIBERATE. Publishing runs
-- from scripts/publish-story.mjs with the SERVICE ROLE key, which bypasses RLS
-- entirely. That key must live in your shell/CI environment and must NEVER
-- appear in the app bundle or in an EXPO_PUBLIC_* variable — anything prefixed
-- EXPO_PUBLIC_ is compiled into the APK and readable by anyone who unpacks it.
--
-- So: the app can read published stories and can do nothing else. There is no
-- write path to abuse because there is no write policy at all.

alter table public.stories enable row level security;

drop policy if exists "published stories are readable by anyone" on public.stories;
create policy "published stories are readable by anyone"
  on public.stories
  for select
  to anon, authenticated
  using (status = 'published');

-- TO GATE READING BY TIER AGAIN (reading is free as of 2026-09-15):
-- replace the policy above with the two below, and give profiles an `is_pro`
-- column fed by your RevenueCat webhook. Doing it here rather than in the
-- client is the point — a client-side flag ships inside the APK.
--
--   create policy "free stories are readable by anyone"
--     on public.stories for select to anon, authenticated
--     using (status = 'published' and tier = 'free');
--
--   create policy "pro stories need an entitlement"
--     on public.stories for select to authenticated
--     using (
--       status = 'published' and tier = 'pro'
--       and exists (
--         select 1 from public.profiles p
--         where p.id = auth.uid() and p.is_pro = true
--       )
--     );

-- ── the manifest ────────────────────────────────────────────────────────────
--
-- What the app fetches on launch: every published story WITHOUT its payload.
-- A few hundred bytes for the whole library, so it is cheap enough to check
-- every cold start. The client then downloads only the rows whose version is
-- higher than its cached copy.
--
-- ⚠️ security_invoker = true. Without it the view runs as its OWNER and
-- silently bypasses the RLS above — the single most common way a Postgres view
-- turns a locked table into a public one.

create or replace view public.story_manifest
with (security_invoker = true)
as
  select id, version, min_app_version, title, english, blurb,
         genre, level, minutes, tier, updated_at
  from public.stories
  where status = 'published';

comment on view public.story_manifest is
  'Published stories without payloads — what the client fetches to decide what to download.';

-- ── how the client uses it ──────────────────────────────────────────────────
--
--   1. supabase.from('story_manifest').select('*')
--   2. drop rows whose min_app_version is above this build
--   3. for each row where version > cached version (or nothing is cached):
--        supabase.from('stories').select('payload').eq('id', id).single()
--        write it into expo-file-system
--   4. render: cached file if present, else the bundled copy
--
-- ⚠️ STEP 4 IS THE OFFLINE GUARANTEE. Cache first, bundle second, network
-- never on the render path. A story must never wait on a request to appear.
