# RevenueCat production key wired; monetization stays OFF for v1 (2026-08-12)

Got a real Google Play RevenueCat key (`goog_…`). Wired it up, but kept the paywall
gated off for the v1 free launch (Speak + readings are hidden, so Pro has no headline
value yet — flip when Speak ships).

## What changed
- **Env var unified → `EXPO_PUBLIC_RC_API_KEY`** (was `EXPO_PUBLIC_RC_TEST_KEY`).
  - `SubscriptionContext.jsx` reads `EXPO_PUBLIC_RC_API_KEY` in all 3 spots (configure
    gate, account-binding gate, `rcConfigured`).
  - `eas.json`: production = `goog_…` (real Play Billing); development/preview = the
    `test_…` key (RC Test Store, easy simulated purchases).
- **Fixed an eas.json syntax error** — the pasted key had a trailing comma (invalid
  JSON → would've failed the build).

## Current state
- `MONETIZATION_ENABLED = false` (unchanged) → `isPro` forced true, paywall hidden,
  quotas off. So the goog_ key is CONFIGURED and READY but nothing user-facing uses it.
- To go live later: flip `MONETIZATION_ENABLED = true` (one line in `src/lib/launch.js`).

## Before flipping monetization on (later)
- Google Play **subscription products must be ACTIVE** in Play Console (else
  `getOfferings()` returns nothing → "No plans available").
- **Upload the Google service-account JSON to RevenueCat** (RC dashboard → Android app
  → Play Store credentials) — without it RC can't validate Google purchases, so
  entitlements won't grant even with the right key.
- Test real purchases on a **release AAB on an internal track** (NOT the dev client —
  Play Billing only talks to a recognized, track-distributed build).
- Ideally enable Speak first so Pro has real value.

## Service-account JSON (also needed for eas submit)
Created in Play Console → API access → service account, key downloaded from Google
Cloud Console. Used by (1) RevenueCat (above) and (2) `eas submit`
(`submit.production.android.serviceAccountKeyPath`). **Keep it OUT of git** (gitignore
it) — it's a secret, unlike the EXPO_PUBLIC_ keys.

Related: [2026-08-06-v1-launch-flags-speak-locked-monetization-off],
[2026-08-06-revenuecat-subscriptioncontext-wiring].
