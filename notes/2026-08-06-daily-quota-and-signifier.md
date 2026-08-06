# Daily free-tier quota + signifier (2026-08-06)

Foundation for the free-tier daily limits (Speak/quizzes/reading/etc.). Built the
shared mechanism + the "N left today" badge. NOTE: only the Speak SIGNIFIER is
wired so far — enforcement (consume + block) across the other surfaces is still TODO.

## Pieces

- **`src/hooks/useDailyQuota.js`** — `useDailyQuota(name, limit, { enabled })`.
  Stores `{ date, count }` per named quota in AsyncStorage (via `lib/storage.js`);
  when the stored date != today (`dayKey()` from `lib/daily.js`) the count resets —
  the date IS the reset, no cron. `consume()` returns false once the day's limit is
  hit. `enabled: false` (Pro) = unlimited + stores nothing.
  ⚠️ LOCAL storage = clock-gameable. Fine for guest/free v1. If it must be honest
  across devices, move to a Supabase Edge Function (not FastAPI — see
  [2026-08-06-future-fastapi-audio-service]).
- **`src/components/common/QuotaBadge.jsx`** — the signifier. Feed it the hook's
  return; renders "N of L left" / "Daily limit reached", and nothing when disabled
  (Pro) or still loading.

## Wired so far

- Speak hub (`app/(tabs)/speak.jsx`): `useDailyQuota('speak', 3, { enabled: !isPro })`,
  badge in the Lessons header. Signifier only — the drill does NOT yet call
  `consume()` or block at 0.

## Planned limits (enforcement pass still TODO)

| Feature | key / limit | "one use" = | tones exempt |
|---|---|---|---|
| Speak | `speak` / 3 | a non-`free` phrase practice | yes (`group.free`) |
| Quizzes | `quiz` / 3 | starting a quiz | — |
| Reading | `reading` / 1 | opening a reading | — |
| Sentence builder | `sentence-builder` / 1 | starting a session | — |
| Search hear audio | `search-hear` / 3 | playing a word's audio | — |

Open decision: applies to ALL free users (`enabled: !isPro`, current assumption) or
guests only. Notes/notebook is a HARD Pro lock, not a quota — see
[2026-08-06-notebook-pro-lock].
