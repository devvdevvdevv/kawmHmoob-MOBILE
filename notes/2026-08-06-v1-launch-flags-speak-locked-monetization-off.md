# v1 launch flags: Speak "coming soon" + monetization off (2026-08-06)

Prepping the FIRST Play Store submission — usable free app now, features/billing in
later updates. Two launch flags gate the not-ready parts. Flip them ON later.

## The flags — `src/lib/launch.js` (new)

```js
export const SPEAK_ENABLED = false        // Speak scoring not built → "coming soon"
export const MONETIZATION_ENABLED = false // no real Play Billing → everyone free
```
Single source of truth; each is a one-line switch to reverse when ready.

## MONETIZATION_ENABLED = false → free app, no paywall

- **`SubscriptionContext`**: `isPro = MONETIZATION_ENABLED ? derivedPro : true`. So with
  monetization off, **everyone is Pro** → this cascades correctly:
  - all daily quotas disabled (`enabled: !isPro` → false) → NO "Go Pro" walls,
  - `PaywallGate` passes through (canAccess true),
  - notebook + all Pro content unlocked.
- **`ProfilePage`**: the Subscription card AND the `__DEV__` Pro-override panel are
  wrapped in `{MONETIZATION_ENABLED && …}` → hidden. No "Upgrade to Pro" button that
  can't complete a purchase.
- The `/paywall` route still exists but nothing links to it. RC never gets called in
  prod (no entry points + configure effect is gated by the env key).

Why this matters: shipping a live "Upgrade" button on the RevenueCat **Test Store**
(which can't charge real money) is a Play rejection/refund risk. This avoids it.

## SPEAK_ENABLED = false → Speak section shows "coming soon"

- **New `src/components/speak/SpeakComingSoon.jsx`** — the honest placeholder screen.
- **`app/(tabs)/speak.jsx`** (hub): `if (!SPEAK_ENABLED) return <SpeakComingSoon />` at
  the top (flag is a module constant, so hook order stays stable).
- **Drill routes** (`app/speak/[phraseId].jsx`, `speak/group/[groupId].jsx`,
  `speak/family/[familyId].jsx`): `if (!SPEAK_ENABLED) return <Redirect href="/speak" />`
  — deep-link safety so nobody reaches the half-built recorder.
- **`app/(tabs)/index.jsx`** (Home): the "Phrase of the day" card (links into a drill)
  is hidden with `{SPEAK_ENABLED && phrase && …}`. The Speak *door* is kept on purpose
  → taps land on the coming-soon screen (the teaser, per the launch decision).

## To re-enable later (one flag each)

- Speak done → `SPEAK_ENABLED = true`.
- Real Play products + production `goog_` RC key set up → `MONETIZATION_ENABLED = true`.
No other code changes needed; everything reads the flags.

## Still required for the actual submission (NOT code)

- **Privacy policy URL** + Play **Data safety** form (the app collects accounts via
  Supabase) — required even for a free app.
- Store listing: screenshots, feature graphic, content rating, description.
- Production **AAB** via EAS, and **EAS env/secrets** for the Supabase keys (the built
  app needs `EXPO_PUBLIC_SUPABASE_*` — `.env.local` is NOT bundled by EAS).
- Since monetization is off, you do NOT need Play Billing/products for THIS release.

Verified: all 9 touched files compile. Related: [2026-08-06-daily-quota-and-signifier],
[2026-08-06-paywall-screen-and-entry-points], `learning/pronunciation/`.
