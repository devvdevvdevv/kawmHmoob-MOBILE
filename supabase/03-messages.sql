-- ════════════════════════════════════════════════════════════════════════════
-- MESSAGES — what people send from the Contact screen
-- Added 2026-09-22. Safe to re-run.
-- ════════════════════════════════════════════════════════════════════════════
--
-- WHY A TABLE AT ALL. /contact was a mailto link, which cannot report whether
-- anything was sent: `Linking.openURL` resolves when the MAIL APP OPENS, and
-- what happens after that is in another app. A screen saying "sent!" on that
-- basis would be lying. An insert either lands or errors, so the app can say
-- which — see src/lib/sendMessage.js.
--
-- The mailto path is kept as the FALLBACK for when this insert fails, so a
-- typed message is never lost.

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- Null for a guest. `on delete set null` rather than cascade: a deleted
  -- account should not delete the bug report it filed.
  user_id     uuid references auth.users(id) on delete set null,
  -- How to reply. A guest can type one; a signed-in account's own address is
  -- prefilled by the app. Optional, because "a word sounds wrong" needs no reply.
  reply_to    text,
  topic       text not null,
  body        text not null,
  -- Client-reported context, so a bug report says which build it came from.
  app_version text,
  platform    text,
  -- Worked through, or still to read. Only an admin can change it.
  handled     boolean not null default false,

  -- ⚠️ THE LIMITS ARE IN THE DATABASE, NOT ONLY IN THE FORM. The app validates
  -- too (better message, no round trip), but an insert can be made by anything
  -- holding the anon key, which ships inside the APK.
  constraint messages_body_len     check (char_length(body) between 10 and 4000),
  constraint messages_reply_to_len check (reply_to is null or char_length(reply_to) <= 200),
  constraint messages_topic_ok     check (topic in ('bug', 'word', 'idea', 'account', 'hello'))
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

alter table public.messages enable row level security;

-- ── who may write ───────────────────────────────────────────────────────────
--
-- ⚠️ ANON CAN INSERT, ON PURPOSE. Most people using the app have never made an
-- account (guest progress never reaches Supabase at all — see 02-admin.sql), and
-- a contact form that requires signing up is a contact form nobody uses.
--
-- ⚠️ WHICH MAKES THIS THE APP'S ONLY PUBLICLY WRITABLE TABLE, so it is also the
-- only one that can be spammed with the shipped anon key. What limits the damage
-- today: the length and topic constraints above, and an in-app cooldown. Neither
-- stops a determined script.
-- TO HARDEN when it matters: move the write behind an Edge Function that checks
-- a per-IP rate limit and a CAPTCHA, then drop this policy. Do that before
-- anything automatic (an email notification, a webhook) reads the table, so a
-- flood costs nothing but rows.
drop policy if exists "anyone may send a message" on public.messages;
create policy "anyone may send a message"
  on public.messages for insert
  to anon, authenticated
  with check (
    -- A signed-in sender may only file as themselves; a guest files as null.
    user_id is null or user_id = auth.uid()
  );

-- ── who may read ────────────────────────────────────────────────────────────
--
-- Nobody but an admin — not even the sender. Reading back your own message
-- needs a way to prove which one is yours, and an inbox in the app is not what
-- this is for.
--
-- ⚠️ `public.is_admin()` is the real gate (02-admin.sql). ADMIN_EMAILS in
-- src/lib/admin.js only hides menu items.
drop policy if exists "admins read messages" on public.messages;
create policy "admins read messages"
  on public.messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update messages" on public.messages;
create policy "admins update messages"
  on public.messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── reading the inbox ───────────────────────────────────────────────────────
-- A view so the sender's account is named without joining by hand. Definer
-- rights (see 02-admin.sql for why `security_invoker` fails on auth.users),
-- which makes `where public.is_admin()` the only guard — do not delete it.
drop view if exists public.admin_messages cascade;

create view public.admin_messages as
  select
    m.id,
    m.created_at,
    m.topic,
    m.body,
    m.handled,
    coalesce(m.reply_to, p.email, '')  as reply_to,
    p.username,
    m.app_version,
    m.platform
  from public.messages m
  left join public.profiles p on p.id = m.user_id
  where public.is_admin();

comment on view public.admin_messages is
  'The contact inbox. Returns nothing unless auth.uid() is in public.admins.';

revoke all on public.admin_messages from anon;
grant select on public.admin_messages to authenticated;

-- ── check ───────────────────────────────────────────────────────────────────
--   select * from public.admin_messages order by created_at desc;
--   select count(*) from public.messages where not handled;
--
-- ⚠️ NOTHING TELLS YOU A MESSAGE ARRIVED. There is no email notification and no
-- admin screen yet: the app can now say "sent", and the rows sit here until
-- someone looks. Check the table, or the unhandled count above, on a schedule
-- you will actually keep.
