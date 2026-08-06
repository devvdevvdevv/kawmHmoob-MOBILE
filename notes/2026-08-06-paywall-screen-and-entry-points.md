# Paywall screen + entry points (2026-08-06)

Built the real paywall screen and wired the ways into it. Follows the RevenueCat
work in `SubscriptionContext` (see
`2026-08-06-revenuecat-subscriptioncontext-wiring.md`) and the
`learning/paywall-page-and-hydration-guide.md`.

## New screen: `app/paywall.jsx` (route `/paywall`)

Data half (the "hydration"): `useEffect` on mount → `Purchases.getOfferings()` →
guard `offerings.current` for null → `setPackages(current.availablePackages)`.
Fetch is wrapped in a `load()` `useCallback` so the error-state **Retry** button
re-runs the exact same fetch. Keeps the `active` flag so a late response can't
`setState` after unmount.

Three tracked states: `loading` (starts true), `error` (string|null),
`packages` ([]). Plus `pendingId` (which package is mid-purchase) and `restoring`.

Render is a 4-way branch:
- `isPro` → `<AlreadyPro/>` confirmation (no buy buttons)
- `loading` → `<ActivityIndicator/>` spinner
- `error` → `<ErrorCard/>` + Retry (`onRetry={load}`)
- else → `packages.map(pkg => <PlanRow/>)`

`PlanRow` props = **data down, action up**: `pkg` (reads `pkg.product.priceString`
— localized, shown as-is — and `pkg.packageType` → PERIOD_LABEL), `busy` (this
row's spinner text), `disabled` (any purchase in flight → lock all buttons),
`onBuy` (calls context `purchase(pkg)`). Screen owns "mid-purchase"; context owns
`isPro`.

Store-required controls (always visible when not Pro): **Restore Purchases** button
(→ context `restore()`) and **Terms / Privacy** links.

## Entry points added

- `src/components/common/PaywallGate.jsx` — "See plans" link changed
  `/account` → `/paywall`.
- `src/components/account/ProfilePage.jsx` — new **Subscription** card reading
  `isPro`: Free → "Upgrade to Pro" (→ `/paywall`); Pro → status + "Manage plan".
  Only shows for logged-in users (guest branch returns early above it).

## Still TODO before store submission

- **Legal URLs are placeholders** — `TERMS_URL` / `PRIVACY_URL` at the top of
  `paywall.jsx` point at `kawmhmoob.com/...`. Must be real, working pages or
  App/Play review rejects the app.
- **§7 account binding** — `Purchases.logIn(user.id)` not done yet; entitlements
  are still anonymous/device-scoped until then.
- Real purchases still require the production AAB on an internal track — Test Store
  (`test_` key) validates code+UX in the dev client only.

## How to view

- Web: `http://localhost:8081/paywall`, or Account tab → Upgrade to Pro.
- Dev client: Account screen → Upgrade to Pro (or deep link `kawmhmoob://paywall`).
