# Learning: integrating RevenueCat (subscriptions / the paywall)

Your app already has the *shape* of subscriptions — `SubscriptionContext` exposes
`{ tier, isPro }`, `PaywallGate` gates Pro content, and `canAccess()` checks tiers.
But `isPro` is driven by `mockUpgrade()` writing to local storage. This lesson
replaces that mock with **real purchases via RevenueCat**, and teaches the moving
parts so you can wire it yourself.

---

## 0. The single most important gotcha: NO Expo Go

`react-native-purchases` is a **native module**. It does NOT run in Expo Go. The
moment you add it you must switch to a **development build**:

```bash
npx expo install react-native-purchases
npx expo prebuild            # generates native ios/ android/ projects (or use CNG)
# then a dev build:
eas build --profile development --platfor
m ios   # (needs an Expo/EAS account)
# or local: npx expo run:ios / npx expo run:android
```

You'll install that dev build on a device/simulator and run `npx expo start
--dev-client` instead of Expo Go. Everything else (JS, hot reload) works the same.
Budget for this — it's the biggest workflow change in the whole task.

---

## 1. The mental model (three layers)

```
App Store Connect / Google Play  →  the ACTUAL products + prices + money
        RevenueCat dashboard      →  maps products → "entitlements" (e.g. "pro")
        react-native-purchases    →  SDK: fetch offerings, buy, check entitlement
```

- **Product** = a specific SKU in Apple/Google (e.g. `kawmhmoob_pro_monthly`).
- **Entitlement** = the *access level* your app cares about (`pro`). One entitlement
  can be unlocked by many products (monthly, yearly, lifetime).
- Your app asks RevenueCat one question: **"does this user have the `pro`
  entitlement active?"** — never "which product did they buy?"

That maps cleanly onto your existing `isPro` — you're just changing where the
answer comes from.

---

## 1.5. FASTEST START: the RevenueCat Test Store (skip §2/§3 at first)

New RC projects come with a built-in **Test Store** — a virtual store that lets
you test your integration with **NO App Store Connect / Play Console setup at
all**. Its API key is prefixed **`test_...`** (not `goog_`/`appl_`). If that's the
only key you see, it's because you haven't added a real Google/Apple app yet —
that's expected, not a bug.

What it does:
- `getOfferings()` returns **test products** you define in the RC dashboard.
- `purchasePackage()` runs a **simulated** purchase (no real money, no store
  account), and the `pro` entitlement flips just like production.
- Because it goes through RevenueCat's servers, NOT native Play Billing/StoreKit,
  it should run **right in the Expo dev client** — no release AAB, no internal
  testing track, no license tester needed for this phase.

What it does NOT do: exercise real Play Billing/StoreKit, real receipts, or real
money. It validates your **code + UX**, not the actual store transaction.

**Recommended flow:** wire and validate the ENTIRE integration
(`SubscriptionContext`, paywall UI, buy button, entitlement flip) against the
`test_` key in the dev client first. Only then do the real store setup below
(§2/§3) and the release-AAB/internal-track testing (§8) for actual purchases —
that's when you add the Google/Apple apps to RC and get the `goog_`/`appl_` keys.

For now: `EXPO_PUBLIC_RC_ANDROID_KEY=test_...` (point the android slot at the test
key).

---

## 2. Store setup (the slow, out-of-code part — defer via §1.5 while learning)

1. **App Store Connect** (iOS): create the app, then create **auto-renewable
   subscription** products (a subscription group + e.g. monthly/yearly). Fill in
   pricing, localizations, and — required before they'll load — accept the paid-apps
   agreement and add banking/tax info.
2. **Google Play Console** (Android): create subscription products similarly.
3. Note each product id — you'll reference them in RevenueCat.

(You can build the whole flow against RevenueCat's sandbox before products are
"Ready to Submit", but they must at least exist.)

---

## 3. RevenueCat dashboard

1. Create a project → add your iOS app (bundle id `com.kawmhmoob.app`) and Android
   app (`com.kawmhmoob.app`). Upload the App Store **In-App Purchase key** / Play
   **service account** so RC can validate receipts.
2. **Entitlements** → create one called **`pro`**.
3. **Products** → add your store product ids; attach each to the `pro` entitlement.
4. **Offerings** → create a `default` offering with packages (Monthly, Annual…)
   pointing at those products. Offerings are what you *display*; entitlements are
   what you *check*.
5. **API keys** (Project settings → API keys): grab the **public** SDK keys — one
   for Apple, one for Google.

---

## 4. Configure the SDK (once, at startup)

Put the keys in env (`EXPO_PUBLIC_RC_IOS_KEY`, `EXPO_PUBLIC_RC_ANDROID_KEY`) and
configure Purchases as early as possible — a good spot is inside
`SubscriptionProvider` on mount:

```js
import Purchases from 'react-native-purchases'
import { Platform } from 'react-native'

Purchases.configure({
  apiKey: Platform.select({
    ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
    android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
  }),
  appUserID: null, // let RC generate an anonymous id; see §7 for linking to Supabase
})
```

Guard it so it no-ops when keys are missing (mirror `isSupabaseConfigured()`), so
the app still runs in guest/dev mode without RC configured.

---

## 5. Rewire `SubscriptionContext` (the core change)

Replace the mock/local-storage source of truth with RevenueCat's `CustomerInfo`.
The shape you expose (`{ tier, isPro }`) does NOT change — every consumer
(`PaywallGate`, `canAccess`) keeps working untouched. That's the win of having the
context already in place.

The pattern:

```js
// 1. Read entitlements into isPro:
function proFromInfo(info) {
  return Boolean(info?.entitlements?.active?.['pro'])
}

// 2. On mount: get current + subscribe to updates
useEffect(() => {
  let active = true
  Purchases.getCustomerInfo()
    .then((info) => { if (active) setIsPro(proFromInfo(info)) })
    .catch(() => {})
  const listener = (info) => setIsPro(proFromInfo(info))
  Purchases.addCustomerInfoUpdateListener(listener)   // fires on purchase/renew/expire
  return () => { active = false; Purchases.removeCustomerInfoUpdateListener(listener) }
}, [])

// 3. Derive tier from isPro
const value = useMemo(() => ({
  tier: isPro ? 'pro' : 'free',
  isPro,
  purchase,          // see below — replaces mockUpgrade
  restore,           // NEW: App Store requires a "Restore Purchases" button
}), [isPro, purchase, restore])
```

**Keep `canAccess()` and `PaywallGate` exactly as they are** — they only read
`tier`/`isPro`.

---

## 6. The purchase + restore actions

```js
// Buy a package (from an offering you fetched with Purchases.getOfferings())
const purchase = useCallback(async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    setIsPro(proFromInfo(customerInfo))
  } catch (e) {
    if (!e.userCancelled) throw e   // userCancelled is normal — swallow it
  }
}, [])

// Apple REQUIRES a visible "Restore Purchases" control, or they reject the app.
const restore = useCallback(async () => {
  const info = await Purchases.restorePurchases()
  setIsPro(proFromInfo(info))
}, [])
```

Your paywall screen fetches offerings and renders the packages:
```js
const offerings = await Purchases.getOfferings()
const pkgs = offerings.current?.availablePackages ?? []
// render pkg.product.priceString, pkg.packageType; on tap → purchase(pkg)
```

`PaywallGate` currently gates content; add a real paywall screen it routes to,
built from these packages, with a **Restore** button and links to Terms/Privacy
(App Store requirement).

---

## 7. Linking purchases to the Supabase user (do this)

By default RC uses an anonymous `appUserID`. To keep Pro tied to the *account*
(so it follows them across devices/reinstalls), log the RC user in with the
Supabase user id:

```js
// when auth state becomes a real user:
await Purchases.logIn(user.id)     // Supabase uid
// on logout:
await Purchases.logOut()
```

Do this in an effect that watches `useAuth().user` inside `SubscriptionProvider`.
Now entitlements are attached to the account, not just the device.

---

## 8. Testing

- **iOS**: create a **Sandbox tester** in App Store Connect; sign into it on the
  device (Settings → App Store → Sandbox). Purchases are free and renew fast
  (a "month" is minutes) so you can watch expiry flip `isPro` back.
- **Android**: add license testers in Play Console; upload a build to a testing
  track.
- RevenueCat's **dashboard → Customer history** shows every sandbox event — the
  fastest way to confirm the entitlement flipped.

### ⚠️ Which build tests purchases? (the part everyone gets wrong)

**A real purchase CANNOT be tested on the dev-client build.** Two separate builds
do two separate jobs:

| Job | Build | EAS profile |
|---|---|---|
| Daily JS/code iteration (Metro hot reload) | dev client (debug APK) | `development` |
| Actually clicking **Buy** | release **AAB**, upload-key signed | `production` |

Why the dev client can't buy: it's **debug-signed**, and Google Play Billing only
talks to an app Play **recognizes** — i.e. signed with your **upload key** (Play
App Signing) **and** distributed through a Play **track**. A debug APK fails both.
(iOS StoreKit is similar: sandbox purchases need a real device + a build Apple
recognizes, not the simulator.)

**"Internal testing track" ≠ "final public launch."** This is the confusing part:
the build you upload to internal testing must be **release-*type*** (AAB,
upload-key signed), but it is **NOT** your public release. Internal testing exists
exactly so you can iterate **release-signed** builds privately — upload as many as
you want, only your added **license testers** see them, nothing goes public. The
same AAB later promotes internal → closed → production when you truly launch.

**Android purchase-test loop:**
1. `eas build --profile production --platform android` → produces the AAB.
2. Upload that AAB to the **internal testing** track (Play Console).
3. Add your Google account as a **license tester** (Play Console → Setup → License
   testing) AND a tester on the internal track.
4. Install the app **from the Play internal-testing link** (not sideloaded).
5. Buy. Watch it flip in RevenueCat → Customer history.

You only rebuild that AAB when native/config changes — **JS-only tweaks still
iterate in the dev client.** Note: the `preview` profile (`buildType: apk`,
`distribution: internal`) is for handing someone a direct-install APK, NOT a Play
track upload — use `production` for Billing testing.

---

## Build order (do it in this sequence)
1. Store products exist (App Store Connect / Play).
2. RC dashboard: `pro` entitlement, products, `default` offering, API keys.
3. `expo install react-native-purchases` → **dev build** (no more Expo Go).
4. Configure SDK at startup (guarded by key presence).
5. Rewire `SubscriptionContext`: `isPro` from `CustomerInfo`, add `purchase` +
   `restore`; keep `tier`/`canAccess`/`PaywallGate` unchanged.
6. Build a paywall screen from offerings + a Restore button.
7. `Purchases.logIn(user.id)` to bind to the Supabase account.
8. Test in sandbox; watch the entitlement in the RC dashboard.

**Keep the mock** behind the config guard for local dev in Expo Go — when RC isn't
configured, fall back to `mockUpgrade` so you can still exercise Pro UI without a
dev build.
