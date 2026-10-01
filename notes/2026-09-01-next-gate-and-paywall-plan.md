# NEXT UP: turning the gate + paywall on — a plan, not an implementation (2026-09-01)

Devan is coding this. This note is the map: what already exists, what the one switch
does, what has to be true before it is flipped, and the traps that are specific to
this codebase.

**Nothing here has been built.** Every file named already exists and already works —
the machinery has been sitting behind a flag since 2026-08-06.

---

## 1. The whole thing is one line

`src/lib/launch.js`:

```js
export const MONETIZATION_ENABLED = false
```

`SubscriptionContext` reads it and does this:

```js
const isPro = MONETIZATION_ENABLED ? derivedPro : true
```

**Everyone is Pro right now.** Not "the paywall is hidden" — `isPro` is literally
`true` for every user, which means:

- every `PaywallGate tier="pro"` passes through,
- every `useDailyQuota(..., { enabled: !isPro })` is disabled, so no quota is
  counted at all,
- the upgrade UI in ProfilePage is hidden behind `MONETIZATION_ENABLED &&`.

Flipping to `true` switches all three on **at once, for everybody**. There is no
partial rollout in the current design. That is the single most important thing to
understand before touching it.

---

## 2. What is already gated (inventory)

### Hard Pro walls — `PaywallGate tier="pro"`

| surface | file |
|---|---|
| Notebook (whole screen) | `app/notebook/[tab].jsx` |
| Learn lesson | `app/learn/[unitId]/[lessonId].jsx` |
| Speak phrase / category / lesson | `app/speak/[phraseId].jsx`, `speak/category/[categoryId].jsx`, `speak/lesson/[lessonId].jsx` |
| Quiz (per-quiz `tier`) | `src/components/quiz/QuizEngine.jsx` |

`canAccess(contentTier, userTier)` is the whole rule: `'free'` always passes,
anything else requires `'pro'`. **There is no middle tier** — if a "free account
gets more than a guest" tier is ever wanted, that function is where it has to
change, not the call sites.

### Daily quotas — the guest → free → pro ladder

`src/lib/quotaLimits.js`:

```js
speak: { guest: 1, free: 3 }
quiz:  { guest: 1, free: 3 }
reading: { guest: 1, free: 2 }
'sentence-builder': { guest: 1, free: 3 }
'search-hear': { guest: 1, free: 3 }
```

Wired in: speak tab, speak group, speak lesson, sentence builder, QuizEngine,
QuizMenu, VocabCategoryGrid. Commented out in `app/reading.jsx` (the feature is a
placeholder, so its quota is too).

Two ladders exist on purpose: guests get a taste → sign up; free accounts get a
daily allowance → go Pro.

---

## 3. Pre-flight — what must be TRUE before flipping the flag

This is the real checklist. Most of it is not code.

### Store / billing

- [ ] Real products created in Play Console **and** App Store Connect.
- [ ] RevenueCat offerings mapped to them; the production `goog_` / `appl_` keys
      wired. See [2026-08-12-revenuecat-prod-key-wired-monetization-still-off] and
      [2026-08-29-revenuecat-audit-and-ios-key].
- [ ] ~~Price is **$12.99/month** (decided 2026-08-30).~~ **Superseded: $7.99/month
      is the starting price** (revised 2026-09-12, confirmed by the author
      2026-09-25 as "the start for now"). It lives in the store and RevenueCat
      dashboards — **not** in this repo. Do not hardcode it.
- [ ] **Restore Purchases** works on a real device. `restore` exists in
      SubscriptionContext; it has to be reachable in the UI and actually tested —
      both stores reject builds without it.

### Legal — an actual submission blocker

`app/paywall.jsx` still carries:

```js
// TODO: point these at your real hosted legal pages before submitting to the
```

Terms and Privacy must be **publicly hosted URLs** before review. This is the kind
of thing that costs a rejection cycle.

### Honesty about what is being sold

Flipping this puts a price on the app as it stands today. Three things are
currently untrue or unfinished, and each is worth a deliberate decision:

- **35 `TODO-VERIFY` grammar claims** in `src/data/lessons/`. Charging for
  unverified language content is a different proposition from giving it away.
- **64% of vocabulary has no audio** (339 of 527 `audioFile: null`). If Pro is sold
  on pronunciation, that gap is the product.
- **Speak content is placeholder Hmong** per the warning in `src/lib/launch.js`
  under `SPEAK_ENABLED = true` — and Speak is one of the Pro-walled surfaces.

None of these block the code. They decide whether the code *should* ship.

---

## 4. Traps specific to this codebase

**Existing users lose things they had.** Everyone has been Pro since v1. The day the
flag flips, an existing user's notebook goes behind a wall and their quizzes start
counting down from 3. That reads as the app taking something away, not as a launch.
Decide the grandfathering story before flipping, not after the reviews.

**Quota scope and identity.** Every `useDailyQuota` call passes
`scope: user?.id || 'guest'`. Check what happens across sign-up: a guest who burns
their 1 free quiz and then creates an account should get the free allowance, not
inherit a spent guest counter — and must not be able to farm resets by signing out.

**The notebook cap is client-side.** `NOTEBOOK_WORD_LIMIT = 15` lives in
`NotebookContext` and is enforced in the app only. If Pro's pitch is "unlimited
saved words", the limit is trivially bypassed and the cap is a UX affordance, not a
paid boundary. See [2026-08-28-notebook-cap-study-and-notes-hidden].

**Saved words still do not sync.** The copy was corrected on 2026-08-29 to stop
claiming they do ([2026-08-29-audit-fixes-error-boundary-lint-sync-copy]). If Pro is
marketed as cross-device, that has to be built first — `NotebookContext` has zero
Supabase references, unlike `ProgressContext`.

**The dev Pro override.** ProfilePage exposes Force Free/Pro under
`__DEV__ && MONETIZATION_ENABLED`. It is correctly gated — just confirm it is
invisible in a release build once the flag is on.

**`isPro` is the only source of truth.** `tier` is derived from it, so the two can
never disagree. Do not add a second path to "is this user paying"; extend
`SubscriptionContext` instead.

---

## 5. Suggested order

1. Decide the grandfathering story. It shapes everything else.
2. Host the legal pages, fix the `app/paywall.jsx` TODO.
3. Store products + RevenueCat offerings; verify Restore on device.
4. Walk the gating inventory above and confirm each wall is where you want it —
   with the flag still `false`, using the ProfilePage dev override to preview Free.
5. Flip `MONETIZATION_ENABLED` last, and test guest → free → pro end to end,
   including sign-up mid-quota.

Step 4 is the cheap one people skip: the dev override lets you see the entire
paid experience without touching the flag or the stores.

---

Related: [2026-08-06-paywall-screen-and-entry-points],
[2026-08-06-daily-quota-and-signifier],
[2026-08-06-v1-launch-flags-speak-locked-monetization-off],
[2026-08-06-revenuecat-subscriptioncontext-wiring],
[2026-08-06-revenuecat-account-binding],
[2026-08-06-v1-paywall-verified-milestone],
[2026-08-29-revenuecat-audit-and-ios-key],
and the build-it-yourself guide `learning/monetization/quota-enforcement-guide.md`.
