# Supabase: the stories table, and the first admin surface that exposes data

Written 2026-09-15. The SQL is in `supabase/01-stories.sql` and
`supabase/02-admin.sql` — run top to bottom in the Supabase SQL editor.
Design reasoning for the stories half: `notes/2026-09-14-remote-story-delivery.md`.

## Stories

⚠️ **This is not a fix for the startup lag.** That is 777 KB of JS object
literals parsed at launch plus `buildIndex()` at module scope — all local.
Fetching JSON does not remove parsing, it moves it. The lag fix is still
`inlineRequires` + a lazy INDEX, and it is independent of this.

What this IS for: **authoring a story and shipping it without an app release.**

| decision | why |
|---|---|
| `version`, bumped on publish | the client downloads only when it climbs. Forget it and readers keep a stale copy forever, with no error anywhere |
| `min_app_version` | the only protection against a payload an installed build cannot render. There is no way to reach an installed app to fix that |
| manifest columns denormalised out of `payload` | the library screen needs title/genre/level — a few hundred bytes for the whole library instead of tens of KB per story |
| `updated_at` set by a trigger | not by the publish script. A wrong clock or a forgotten field sorts rows wrongly forever |
| `tier` column, unused | reading is free as of today, so nothing reads it. It exists so gating later is a policy change, not a migration |

### ⚠️ There is no client write policy, on purpose

Publishing runs with the **service role key**, which bypasses RLS entirely. That
key lives in the shell/CI and must never appear in the bundle or in any
`EXPO_PUBLIC_*` variable — anything with that prefix is compiled into the APK
and readable by anyone who unpacks it. So the app can read published stories and
do nothing else: there is no write path to abuse because there is no write
policy at all.

### ⚠️ `security_invoker = true` on the manifest view

Without it a Postgres view runs as its **owner** and silently bypasses the RLS
on the table under it. That is the most common way a locked table becomes a
public one, and it fails open — no error, just data.

### The offline guarantee

```
render: cached file → else bundled copy → network NEVER on the render path
```

Bundled stories stay the floor. A device that never reaches the network behaves
exactly as it does today.

## Admin — and the line src/lib/admin.js drew

`src/lib/admin.js` has always said it plainly:

> *"THIS IS UI HIDING, NOT SECURITY … If an admin screen ever performs a
> privileged ACTION, the check must move server-side."*

**Reading every user's progress is that action**, so this is the first surface
where that promise had to be kept. `ADMIN_EMAILS` ships inside the APK; a
patched build walks past `AdminGate` in a second.

So enforcement lives in Postgres:

- `public.admins` — a table, so revoking someone is a DELETE and not an app
  release. **No RLS policies at all**, so the client can neither read nor write
  it.
- `public.is_admin()` — `security definer`, so it can read that table when the
  caller cannot.
- ⚠️ **`set search_path = ''` is not optional.** Without it a caller can put
  their own schema ahead of `public` and have the function consult *their*
  `admins` table. Everything inside is fully qualified.

Every admin view calls `is_admin()`, so a bypassed client gate still returns
nothing.

### What the views had to do that columns could not

⚠️ **Progress is one jsonb blob.** `ProgressContext` saves the whole state
object into `progress.data`, so there is nothing to aggregate — the counting
happens in SQL with `jsonb_array_length` and `jsonb_object_keys`.

⚠️ **Every count is coalesced.** `jsonb_array_length(null)` is null, not 0, so
one user who has done nothing turns a `SUM` null and empties the whole
dashboard.

⚠️ **Guest progress is not in here and cannot be.** It lives in device storage
under `kawmhmoob.progress.guest` and never reaches Supabase. These numbers are
signed-in users only — the screen says so, because otherwise it is a number you
would go on to quote at somebody.

### The screen

`app/admin-users.jsx`, listed in `/dev`. Follows `app/dev.jsx`'s convention: a
hardcoded dark console palette that never consults the theme, so it stays
legible in light/dark/neon and never looks like a shipped page.

⚠️ **It distinguishes "no rows" from "not an admin", because RLS cannot.** A
non-admin gets an empty set, not a permission error — so "nobody has signed up"
and "you are not in `public.admins`" render identically unless the screen says
which is which. It shows the seed SQL when the count is zero.

## Reading is back in the Words hub

The tile existed but was behind `isAdmin(user)`, hidden 2026-09-12 because most
stories were placeholders. Both halves of that reason are now gone, checked
against the data rather than assumed:

```
live stories: 3 · carrying placeholder: true → 0
all three shelves free
```

The unfinished stories are inside the block comment in `stories.js`, so they are
not exported at all. Gate removed; the original comment is kept above the tile
because it records what to re-check if placeholder stories are ever exported
again.

## Not fixed, and not mine

`app/words/index.jsx:63` has a pre-existing `react/no-unescaped-entities` error
(`you'd` in prose). It is one of the 47 lint errors already in the tree and is
unrelated to any of this — left alone rather than folded into an unrelated
change.

---

## Moving the payloads across — the procedure

```
node scripts/export-stories.mjs                  # bodies → supabase/payloads/*.json
node scripts/publish-story.mjs --all --dry       # runs the sweep, uploads nothing
node scripts/publish-story.mjs --all             # needs SUPABASE_SERVICE_ROLE_KEY
```

### The number that decides the design

```
id                          body      metadata
story-ntxawm-lub-xauv        5.6 KB     259 B
story-tus-miv-tus-nas        4.9 KB     253 B
story-zong-vang             84.0 KB     373 B
total                       94.4 KB     885 B
```

**The library screen needs 885 bytes and currently parses all 94 KB** (178 KB as
JS source, since object literals cost more to evaluate than JSON does to parse).
That ratio is the whole argument, and it is why the export splits `payload` from
the manifest columns rather than uploading the story object whole.

### ⚠️ Supabase alone does NOT make it faster

Said once already and worth repeating because the request came back: a fetched
payload still has to be parsed, and the parse is the cost. What actually helps:

1. **The library stops loading bodies at all.** After the split it reads 885
   bytes of metadata instead of evaluating 178 KB of story source. This is the
   real win and it works with or without the network.
2. `inlineRequires` + a lazy `INDEX` — still the biggest single change, still
   unrelated to Supabase.
3. Remote delivery buys **shipping a story without an app release**. That is a
   publishing win, not a performance one, and it is worth having on its own.

### The fallback stays the floor

`src/data/stories.js` is untouched by the export — it is a one-way dump, not a
sync. Render order is:

```
cached file (expo-file-system) → bundled copy → network NEVER on the render path
```

A device that never reaches the network behaves exactly as it does today.

### ⚠️ The version is read from the server, not the file

`publish-story.mjs` fetches the current version and increments it. A re-publish
that reuses a number leaves every reader on the old copy **with no error
anywhere** — the client only downloads when the number climbs.

### ⚠️ The gate is the point of the script

It runs `check-reading`, `check-notes`, `check-vocabulary` and
`check-undefined-refs` and refuses to upload on failure. **There is deliberately
no `--force`.** Proven by drifting one gloss to "ten-ish":

```
  ✅ check-reading
  ✅ check-notes
  ❌ check-vocabulary FAILED — nothing was uploaded.
```

Every quality gate in this project is repo-side. Without this, remote delivery
is just a faster way to ship Hmong nobody checked — and `choj` shipped as *the
Wisconsin Constitution* through four green checks.

### Still to build: the client

`src/lib/storyStore.js` — manifest fetch, `min_app_version` filter, payload
download into `expo-file-system`, and a `getStory(id)` that resolves
cache → bundle. Until that exists the upload is inert, which is a safe place to
stop: nothing in the app reads these rows yet.

---

## ⚠️ `permission denied for table users` — a bug in the SQL above

Reported by the author within minutes of running `02-admin.sql`. **My error**,
and the fix is not obvious from the message.

All three admin views were written `with (security_invoker = true)`. That makes
a view run **as the caller**. The views join `auth.users`, which only the
`postgres` role may read — so the moment a real user selects from one, Postgres
refuses.

### The rule is not "always use security_invoker"

It is the opposite of itself depending on what the view is for, and I applied
one rule to both files:

| view | must | rights |
|---|---|---|
| `story_manifest` | **respect** RLS on `public.stories` | `security_invoker = true` |
| `admin_*` | **deliberately see past** RLS on profiles/progress, because an admin is meant to see everyone | definer (the default) |

An invoker-rights view that reads `auth.users` can never work for a normal
caller. A definer-rights view that forgets its `where` clause is a public data
leak. Both files now say which they are and why.

⚠️ **`where public.is_admin()` is now the ONLY thing guarding those views.**
Definer rights mean RLS no longer filters anything. That line is not decoration.
`auth.uid()` still resolves inside a definer view — it reads the request JWT,
not the session role — so the gate works as intended.

### ⚠️ `create or replace view` does NOT clear an existing reloption

The trap that would have eaten the next attempt: re-running a corrected file
over a view created with `security_invoker = true` **leaves that option set**.
The file now drops all three (cascade, since two are built on the first) before
creating them.

### Verified state after `01-stories.sql`

```
stories table          ✅ exists, returns []
story_manifest view    ✅ exists, returns []
admins table           ✅ exists, RLS returns nothing — correct
admin_* views          ❌ exist but throw, pending the re-run
```

## ⚠️ New-style API keys: `apikey` only, never `Bearer`

This project's `EXPO_PUBLIC_SUPABASE_ANON_KEY` is one of Supabase's newer
`sb_publishable_…` keys, not a legacy JWT. Sent as `Authorization: Bearer` it is
rejected as **"Invalid API key"**, which reads exactly like a bad key and sent
me looking for a rotated credential that was never wrong.

```
auth/v1/health   no key   401 "No API key found in request"
auth/v1/health   apikey   200          ← the key is fine
rest/v1/         apikey   401 "Secret API key required"   ← the OpenAPI root
                                          needs a SECRET key; not a problem
rest/v1/stories  apikey   200 []        ← the table is there
```

`supabase-js` gets this right on its own; only hand-rolled `fetch` probes need
to care.
