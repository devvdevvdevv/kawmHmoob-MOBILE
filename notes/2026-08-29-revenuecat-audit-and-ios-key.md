# RevenueCat audit — and the iOS key that would have shipped wrong

**2026-08-29** · `src/context/SubscriptionContext.jsx`, `eas.json`

Follows [[2026-08-06-revenuecat-subscriptioncontext-wiring]] and
[[2026-08-06-subscription-manage-and-dev-override]]. Asked to confirm the
membership check and RevenueCat plumbing were in place. They largely were —
this records what was verified, and the two gaps that were not.

---

## Verified present

| | |
|---|---|
| `react-native-purchases` | `^10.6.0` |
| Configure | gated on key presence — no key, no crash, mock takes over |
| Entitlement | `getCustomerInfo()` on mount **plus** `addCustomerInfoUpdateListener`, with `removeCustomerInfoUpdateListener` cleanup |
| Account binding | `logIn(user.id)` for real accounts, `logOut()` for guests |
| Purchase | swallows `userCancelled`, rethrows real errors |
| Restore | present |
| Cancel | `showManageSubscriptions()` |
| Paywall | `getOfferings()` → `availablePackages`, localized `priceString`, per-package pending state, error + empty states |
| Gating | `canAccess` + `PaywallGate` across learn, notebook, speak, quiz |
| Provider | mounted in `app/_layout.jsx` |

Two details worth calling out as *correct*, because they are the usual misses:

- **`logOut()` is guarded by `isAnonymous()`.** RevenueCat throws if you log out
  an already-anonymous user, so the naive version crashes on every guest.
- **Cancellation opens the OS screen rather than attempting it in-app.** Apple
  and Google own cancellation; there is no API to do it, and store review
  rejects apps that pretend otherwise.

---

## ⚠️ Gap 1 — iOS production would have used an Android key

`eas.json`:

```
development   test_…   Test Store, both platforms
preview       test_…   Test Store, both platforms
production    goog_…   ANDROID ONLY
```

and `configure()` used that one value everywhere:

```js
const key = process.env.EXPO_PUBLIC_RC_API_KEY
Purchases.configure({ apiKey: key })
```

RevenueCat issues a **different key per store** — `appl_…` for App Store,
`goog_…` for Play. A single `test_…` key serves both, which is why dev and
preview get away with it.

An iOS production build would therefore have configured RevenueCat with an
Android key. **No crash, no error, no log** — just an entitlement that never
appears, and a paying customer sitting on Free with no way to tell why.

The existing comment had already predicted this:

> *"One Test-Store key serves both platforms. When the real goog_/appl_ keys
> differ, swap to: `apiKey: Platform.select({ ios: …, android: … })`."*

It was never done. `Platform` was imported and referenced **only inside that
comment** — the import was dead, which is itself the tell.

> **A comment describing the fix is not the fix.** This one was accurate,
> prominent, and load-bearing, and it still shipped un-acted-on for three weeks.

### Now

```js
function rcApiKey() {
  const perPlatform = Platform.select({
    ios: process.env.EXPO_PUBLIC_RC_API_KEY_IOS,
    android: process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID,
    default: undefined,
  })
  return perPlatform || process.env.EXPO_PUBLIC_RC_API_KEY || ''
}
```

Platform-specific wins, shared key is the fallback — so test and preview builds
are byte-identical in behaviour. All seven env reads now route through it,
including `rcConfigured`, which could otherwise disagree with what `configure()`
actually used.

⚠️ **`EXPO_PUBLIC_RC_API_KEY_IOS` IS STILL NOT SET.** The scaffolding is ready;
the key is not. Add the `appl_` key to the production profile in `eas.json`
before any App Store submission. Until then iOS production still falls back to
the `goog_` key — the bug is *prepared for*, not *gone*.

---

## ⚠️ Gap 2 — purchase/restore called the native module unguarded

Both went straight to `Purchases.*` with no configuration check. The paywall
route is reachable regardless of whether a key exists, so a keyless build turned
"there is nothing to sell here" into a native throw.

Both now fail with a readable message; `manageSubscription` no-ops instead of
throwing into its own catch.

---

## Cannot be verified from code

**`PRO_ENTITLEMENT = "KawmHmoob Pro"` must match the RevenueCat dashboard
identifier exactly** — spacing and capitalisation included.

```js
function proFromInfo(info) {
  return Boolean(info?.entitlements?.active?.[PRO_ENTITLEMENT])
}
```

If that string is wrong, this returns `false` forever. No error, no warning, no
log. A paying customer stays locked out and the app looks like it is working.

**This is the highest-consequence unverifiable line in the file** — it is a
string literal matched against a remote console, and nothing in the repo can
check it. Confirm it in the dashboard, and consider logging the active
entitlement keys in `__DEV__` so a mismatch is at least visible during testing.

---

## Blocking all of it

`MONETIZATION_ENABLED = false` in `src/lib/launch.js`:

```js
const isPro = MONETIZATION_ENABLED ? derivedPro : true
```

`isPro` is hardcoded `true`. Nothing is gated, no paywall renders, quotas are
off, and the `__DEV__` Pro-override panel in ProfilePage is hidden behind the
same flag — which is why the dev subscription toggle appeared to vanish.

None of the plumbing above can be exercised until that flips.

---

## Verification

- Babel parse — `SubscriptionContext.jsx`
- `check-undefined-refs.mjs` — clean
- All seven env reads route through `rcApiKey()`

**Nothing here is verified against a live RevenueCat account.** Configuration
correctness, entitlement naming, and the purchase flow are all runtime facts
this audit can only reason about.
