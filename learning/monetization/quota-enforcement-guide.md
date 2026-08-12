# Learning: enforcing daily quotas on the remaining surfaces

Speak is already wired end-to-end — this guide teaches you to repeat that pattern on
**quizzes, reading, sentence builder, and search-hear**. You do the typing; this
tells you exactly where each piece goes and flags the two surfaces that AREN'T ready.

The building blocks already exist:
- `src/hooks/useDailyQuota.js` — the counter (`consume()`, `exhausted`, `remaining`)
- `src/lib/quotaLimits.js` — the guest/free numbers + `quotaLimit(feature, isGuest)`
- `src/components/common/QuotaBadge.jsx` — the "N left today" signifier

Reference implementation to copy from: `app/speak/group/[groupId].jsx` +
`app/(tabs)/speak.jsx`.

---

## The pattern (4 steps, identical every time)

**1. Get the tier + scope.** At the top of the screen/component:
```js
const { user } = useAuth()
const { isPro } = useSubscription()
const quota = useDailyQuota('FEATURE', quotaLimit('FEATURE', user.isGuest), {
  enabled: !isPro,               // Pro = unlimited
  scope: user?.id || 'guest',    // separate counter per user → fresh on signup
})
```
`FEATURE` is the key from `quotaLimits.js` (`quiz`, `reading`, `sentence-builder`,
`search-hear`).

**2. Spend one on the action.** Call `await quota.consume()` at the moment the user
*uses* one (starts the quiz, opens the passage, plays the audio). `consume()` is a
no-op for Pro.

**3. Block when empty.** Before letting them do the action, check `quota.exhausted`
and show the wall instead.

**4. Signify.** Drop a `<QuotaBadge {...quota} label="quizzes left today" />` on the
hub so they see it coming.

That's the whole thing. The rest is per-surface specifics.

---

## FIRST: extract the wall (do this once, reuse 4×)

Right now the guest-vs-free wall lives inline in the Speak drill. You're about to
need it four more times — so pull it into one component instead of copy-pasting.
Create `src/components/common/QuotaWall.jsx` that takes the current `user` and
renders:
- **guest** → "That's today's free practice" + **Create a free account** → `/register`
- **free** → "You've used today's …" + **Go Pro** → `/paywall`

(Model it on the `quotaBlocked` branch in `app/speak/group/[groupId].jsx` — same
copy, same two `<Link><Button>` CTAs.) Then replace that inline block in the Speak
drill with `<QuotaWall />` too, so all five surfaces share one wall. This is the
DRY win — one place to tune the upgrade copy.

---

## Surface 1 — Quizzes (real, do this one)

File: `src/components/quiz/QuizEngine.jsx` (rendered by `app/quiz/[topicId].jsx`).

Notes:
- It already has TWO gates you must not disturb: `quizUnlock` (study-before-quiz)
  and `PaywallGate`. Your quota is a THIRD, independent gate.
- "One use" = **starting a quiz.** The quiz starts via `useQuizState().start` inside
  a `useEffect`. That effect (near the top) is your consume point.

Steps:
1. Add the step-1 quota block (`FEATURE = 'quiz'`).
2. In the start effect: only `start()` if not exhausted; when you do start, also
   `quota.consume()`. Guard with `!isPro` so Pro never spends.
3. Render: if `quota.exhausted && !isPro` (and it's not already `locked` by the
   study gate), show `<QuotaWall />` instead of the quiz body.
4. Badge on the quiz hub (`app/quiz/index.jsx`).

⚠️ Watch the double-consume trap: a start effect can re-run. Consume **once per
quiz run** — gate it behind the same condition that calls `start()`, and make sure
`start()` isn't already idempotently re-firing on every render.

---

## Surface 2 — Search "hear" (real, but READ THIS FIRST)

The audio comes from `AudioButton.jsx` → `useAudio().play`. **`AudioButton` is
shared everywhere** — word details, quiz feedback, reference, Speak. If you meter it
globally you'd also limit audio *inside a paid lesson*, which you don't want.

So gate it **opt-in**, only in the search context:
- Add an optional prop to `AudioButton`, e.g. `metered` (default false). When
  `metered`, its `onPress` first `await quota.consume()` and bails (shows the wall /
  a toast) if it returns false. Everywhere else stays unmetered = unchanged.
- Pass `metered` only where search renders its audio buttons (`GlobalSearch` /
  `app/search.jsx`). Feature key = `search-hear`.
- Because `consume()` returns false when empty, you don't need a full-screen wall
  here — a small "Daily limit reached — sign up / go Pro" inline message or routing
  to `/register`|`/paywall` on the blocked tap is enough.

This keeps hearing free everywhere it's part of learning, and metered only in the
dictionary/search browse — which is the intent.

---

## Surfaces 3 & 4 — Reading & Sentence Builder (NOT ready — don't wire yet)

Both are **placeholders with no real interaction**:
- `app/reading.jsx` — a "Coming soon" scaffold, no passage data.
- `app/words/sentences.jsx` — an explicit "Not built" placeholder.

There's nothing to spend a quota on yet, and gating a coming-soon page just annoys.
**Do the quota when you build the feature**, at the natural action:
- Reading → `consume()` when the user **opens a passage** (once the passages dataset
  + reader exist); block list/opening when exhausted.
- Sentence builder → `consume()` when they **start a session**; block the Start
  button when exhausted.

For now: leave a `// TODO(quota): consume 'reading' on open` (and `'sentence-builder'
on session start`) comment at the spot so future-you remembers. The limits are
already in `quotaLimits.js` waiting.

---

## Per-surface checklist

- [X] `QuotaWall` extracted; Speak drill switched to use it
- [X] Quiz: quota block + consume on start + wall + hub badge (mind double-consume)
- [ ] Search: `metered` opt-in on `AudioButton`, used only in search
- [ ] Reading: TODO comment at the future "open passage" action
- [ ] Sentence builder: TODO comment at the future "start session" action

## Testing each

- **Dev override** (Profile → Force Free/Pro) to jump between tiers fast.
- **Guest vs account**: log out to test the guest limit + "Create account" CTA; the
  per-user `scope` means the counters are independent.
- **Reset**: quotas reset at UTC date change (`dayKey`). To re-test same-day, clear
  the app's storage (or the `kawmhmoob.quota.*` keys) rather than waiting.

Related: [[2026-08-06-daily-quota-and-signifier]], and the Speak reference in
`app/speak/group/[groupId].jsx`.
