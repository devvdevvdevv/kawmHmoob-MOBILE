# 2026-08-06 — RevenueCat wiring in SubscriptionContext (Steps 1-4)

Wired the RevenueCat SDK into `src/context/SubscriptionContext.jsx` against the
**Test Store** (`test_` key — no App Store/Play setup needed yet, runs in the dev
client). User implemented most of this themselves, taught step by step.
[[prefers-teaching-then-self-implements]]

## The mental model (what this accomplishes)
Replace the *source of truth* for `isPro` — from a local mock flag to
RevenueCat's answer — WITHOUT changing any consumer. `canAccess` / `PaywallGate`
still just read `tier`/`isPro`; they never learn where the answer comes from.
That clean swap is the whole point of having the context in place first.

## The flow, in order

1. **Configure the SDK (gated on the key).** Read `process.env.EXPO_PUBLIC_RC_TEST_KEY`;
   `if (!key) return` (no key → stay on the mock, no crash). Then, key present:
   `if (__DEV__) Purchases.setLogLevel(VERBOSE)` and `Purchases.configure({ apiKey: key })`.
   (One Test-Store key serves both platforms; swap to `Platform.select` when the
   real `goog_`/`appl_` keys differ.)

2. **Read the entitlement + keep it live.** In the SAME effect, after configure:
   - `Purchases.getCustomerInfo().then(info => setRcPro(proFromInfo(info)))` — the
     one-time read (RC docs' `try/catch` → our `.then/.catch`).
   - `addCustomerInfoUpdateListener(listener)` — auto-updates `rcPro` on
     purchase/renew/expire.
   - `return () => removeCustomerInfoUpdateListener(listener)` — cleanup on unmount.
   - Helper: `proFromInfo(info)` = `typeof info?.entitlements?.active?.[PRO_ENTITLEMENT] !== 'undefined'`,
     where `PRO_ENTITLEMENT = 'KawmHmoob Pro'` (must match the RC dashboard EXACTLY).

3. **Pick the source of truth.** `const rcConfigured = Boolean(key)`;
   `const isPro = rcConfigured ? rcPro : sub.tier === 'pro'`.
   RC when it's on; mock when it's off. `tier` is DERIVED from `isPro`
   (`tier: isPro ? 'pro' : 'free'`) so the two can never disagree.

4. **Expose it in `value`.** `{ tier, expiresAt, isPro, mockUpgrade, mockDowngrade }`.

## ⚠️ What is NOT done yet (next steps — guide §6-7)
- **`purchase(pkg)`** and **`restore()`** actions — NOT in the value yet. These
  come with the paywall (`getOfferings()` → `purchasePackage()`). Apple *requires*
  a visible Restore button.
- **Paywall screen** built from `getOfferings()`.
- **`Purchases.logIn(user.id)`** to bind entitlements to the Supabase account.
- Real store setup (Play Console products, internal track) — deferred; Test Store
  covers integration testing for now. See the guide's §1.5 + §8.

## Expected behavior right now
With the test key set, `isPro` comes from RevenueCat. No Test-Store purchase has
been made, so `KawmHmoob Pro` is inactive → `rcPro`/`isPro` = false (correct).
`mockUpgrade` no longer flips `isPro` while RC is configured — RC is the authority.

## Gotchas hit
- `.env` changes load at **startup only** — restart Metro (`-c`) after editing.
- Validation export failed with **"No space left on device"** (disk full, not a
  code bug) — clear disk space; it also affects Metro cache + EAS builds.
