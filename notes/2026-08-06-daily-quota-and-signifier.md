# Daily free-tier quota + signifier (2026-08-06)

Free-tier daily limits (Speak/quizzes/reading/etc.) as a 3-rung LADDER, with a
signifier badge. Speak is now ENFORCED end-to-end; the other four surfaces still
need the same wiring.

## The ladder (guest < free < Pro)

- **guest** → smallest allowance (a taste) → incentive: **create an account**
- **free account** → larger daily allowance → incentive: **go Pro**
- **Pro** → unlimited (quota `enabled: false`)

Numbers live in ONE place: **`src/lib/quotaLimits.js`** (`QUOTA_LIMITS` +
`quotaLimit(feature, isGuest)`). Current: speak 1/3, quiz 1/3, reading 1/1,
sentence-builder 1/1, search-hear 1/3 (guest/free).

## Pieces

- **`src/hooks/useDailyQuota.js`** — `useDailyQuota(name, limit, { enabled, scope })`.
  Stores `{ date, count }` at `kawmhmoob.quota.<scope>.<name>`; date != today resets
  (the date IS the reset, no cron). `consume()` returns false when the limit is hit.
  **`scope`** namespaces the counter by user id (`user?.id || 'guest'`) — so a guest
  and an account keep SEPARATE counters, and **signing up hands the user a fresh,
  larger allowance** (the create-account incentive).
  ⚠️ LOCAL storage = clock-gameable. Fine for v1. If it must be honest across
  devices, move to a Supabase Edge Function (NOT FastAPI — see
  [2026-08-06-future-fastapi-audio-service]).
- **`src/components/common/QuotaBadge.jsx`** — the signifier. "N of L left" /
  "Daily limit reached"; renders nothing when disabled (Pro) or loading.

## Enforced: Speak (the reference implementation)

- Hub (`app/(tabs)/speak.jsx`) — badge with `quotaLimit('speak', user.isGuest)` +
  `scope: user?.id || 'guest'`.
- Drill (`app/speak/group/[groupId].jsx`) — `quotaApplies = !group.free && !isPro`.
  `handleDone` calls `consume()` (no-op for Pro / the free tones lesson). When
  `speakQuota.exhausted`, the recorder is replaced by a wall whose CTA is
  **guest → Create a free account (/register)**, **free → Go Pro (/paywall)**.
- Tones stay free: `toneSpeakGroup.free === true` makes `quotaApplies` false, so
  tones never consume and never block. See [2026-08-06-speak-module-ui-restructure].

## Enforced: Quizzes (2nd surface, done)

- `QuizMenu.jsx` (hub) — read-only `useDailyQuota('quiz', …)` + `<QuotaBadge>` in the
  heading (top-right of the title row). No consume here.
- `QuizEngine.jsx` (the quiz) — same quota; the START effect gates on
  `!quota.exhausted && quota.ready` and calls `quota.consume()` when `start()` runs
  (both inside the `if {}`; deps include `quota.ready, quota.exhausted`). A new
  early-return `if (quota.exhausted) return <QuotaWall/>` sits AFTER the study-gate
  block. One consume per quiz (the `state.status === 'idle'` guard prevents re-runs).
- Reusable `src/components/common/QuotaWall.jsx` — guest → /register, free → /paywall.

## Remaining — BLOCKED on the feature existing (not gateable yet)

Reading and Sentence Builder are still **placeholders** (no passage to open, no
session to start), and Search results are text **links** with no inline audio — so
there's no real action to meter. Enforcement is STAGED, not skipped:

| Feature | key | Status |
|---|---|---|
| Reading | `reading` | `TODO(quota)` comment in `app/reading.jsx` — wire when passages exist |
| Sentence builder | `sentence-builder` | `TODO(quota)` in `app/words/sentences.jsx` — wire when built |
| Search hear audio | `search-hear` | Deferred — no inline audio in results + "keep hearing free" (the magnet). Revisit only if search adds audio. |

When built, each is the same pattern: `useDailyQuota(key, quotaLimit(key,
user.isGuest), { enabled: !isPro, scope })`, `consume()` on the action (gate on
`quota.ready`), `<QuotaWall/>` when `exhausted`. Notes/notebook is a HARD Pro lock,
not a quota — see [2026-08-06-notebook-pro-lock].
