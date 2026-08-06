# Subscription: manage/cancel + dev Pro override (2026-08-06)

Extends `SubscriptionContext` with a way to cancel (store-compliant) and a
testing-only Pro toggle. Also folds in two bug fixes from the initial #6 wiring.

## Cancel = store management (apps can't cancel in-code)

- `manageSubscription()` calls `Purchases.showManageSubscriptions()` → opens the OS
  subscription screen (the only store-compliant way to cancel). No-ops gracefully
  when RC isn't configured.
- The Pro card in `ProfilePage` button is now **"Manage subscription"** → this.

## Dev override (beats the real source of truth)

- `devProOverride` state: `null` = follow real truth; `true`/`false` = force isPro.
  Derivation is now:
  `realPro = rcConfigured ? rcPro : sub.tier==='pro'`;
  `isPro = devProOverride !== null ? devProOverride : realPro`.
  So it flips isPro even with the `test_` key set (plain `mockDowngrade` can't,
  because RC is the source of truth when configured).
- `devSetPro(v)` exposed; a `__DEV__`-only panel in `ProfilePage` renders
  Force Pro / Force Free / Clear. Both surface via the context `value`.

## Bug fixes rolled in (from the earlier #6 pass)

- `purchase` / `restore` were calling `setIsPro` (doesn't exist) → now `setRcPro`.
- `restore` had `await Purchases.restorePurchases` (missing `()`), storing the
  function → now `restorePurchases()`.

Related: [2026-08-06-paywall-screen-and-entry-points],
[2026-08-06-revenuecat-subscriptioncontext-wiring].
