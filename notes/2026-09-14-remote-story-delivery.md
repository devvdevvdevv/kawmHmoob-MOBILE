# Remote story authoring and delivery — the decision

⚠️ **FUTURE IMPLEMENTATION. Nothing here is built.** Written 2026-09-14, at the
point where six more stories were about to be authored, because the shape of
the data is cheaper to choose now than to convert later.

Full reasoning, measurements and the publish-gate design live in the
thirty-third pass of `notes/2026-09-14-zong-vang-day-two.md`.

## The short version

- **The lag is local**, not network: 777 KB of JS object literals parsed at
  startup, plus `buildIndex()` running at module scope in `GlobalSearch.jsx`.
  An API does not fix it.
- **Supabase for content, FastAPI for the voice engine.** The app already
  depends on `@supabase/supabase-js` and `expo-file-system`, so remote stories
  need no new infrastructure — and RLS makes Pro gating server-side instead of
  a client flag.
- ⚠️ **Every quality gate in this project is repo-side.** Publishing must run
  `check-reading` and `check-notes` and refuse to upload on failure, or remote
  delivery becomes a way to ship Hmong nobody checked.

## Order

1. `inlineRequires` + lazy `INDEX` — fixes the lag, commits to nothing.
2. Split story metadata from story body.
3. Supabase `stories` table + `scripts/publish-story.mjs` as the gate.
4. FastAPI voice engine, separate service.

1 and 2 are worth doing even if the remote path is never built.
