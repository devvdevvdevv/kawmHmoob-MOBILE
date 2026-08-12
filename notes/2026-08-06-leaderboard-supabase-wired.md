# Leaderboard wired to Supabase (2026-08-06)

`app/leaderboard.jsx` now reads real rankings from a Supabase VIEW instead of the
`buildBoard` placeholder. Built from `learning/supabase-leaderboard-lesson.md`.

## Backend
- Supabase **`leaderboard` VIEW** already created (per the lesson): joins `profiles`
  + `progress`, exposes only `id, username, display_name, (data->>'xp')::int as xp`
  — NO email — `left join` so new accounts appear at 0. `grant select ... to
  authenticated`. XP was already synced by `ProgressContext`, so this is read-only.

## Screen
- **One canonical row shape** everywhere: `{ id, rank, name, points, isYou }`. Both
  the real fetch and the placeholder map into it, so the render is single/uniform.
- **Hydration states:** `rows` / `loading` / `error`. Fetch in a `load()` useCallback
  (so the error-state **Retry** re-runs it); `useEffect(() => load(), [load])` with
  an `active` unmount guard.
- **Source split:** `usingPlaceholder = !isSupabaseConfigured() || user.isGuest`.
  Placeholder → `buildBoard` mapped to the shape (guests/dev). Real → the view query
  `.select('id, username, display_name, xp').order('xp',{ascending:false}).limit(50)`,
  `isYou = r.id === user.id`, rank = array index + 1.
- **Disclaimer** ("sample standings — sign in…") shows ONLY for the placeholder board;
  removed the old "everyone is placeholder" lie for real data.

## Decisions made (reconciling old placeholder → real view)
- **Dropped `clips`** (voice clips per row) — not in the view. Removed the per-row
  line + the last-week "clips" bit.
- **Removed the Season/This-week toggle** — no weekly-points bucket exists. Season
  only for now.
- **Per-row `Lv`** kept, computed `levelFromPoints(r.points).level`.
- Fixed the WIP bugs: missing `useEffect` import, duplicate `const rows` (state vs
  buildBoard = redeclaration error), `supabse` typo import, empty `setRows()`, and the
  render still reading old fields (`clips`, `seasonPoints`, `r[key]`).

## Still placeholder / TODO
- Last-week winner card (static record).
- Weekly board (needs a weekly-points engine).
- Not live — reflects the last synced `progress`; realtime is a later nice-to-have.

Related: [2026-08-06 leaderboard lesson], `learning/supabase-setup-guide.md`.
