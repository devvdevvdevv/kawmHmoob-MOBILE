# Connecting Google Play to RevenueCat

Reference, not a record — update it in place when the consoles move their menus,
which they do.

## ⚠️ There are TWO credentials and they go opposite directions

This is the thing that makes the task confusing:

| credential | where it comes from | where it goes |
|---|---|---|
| **Service account JSON** | Google Cloud, authorised in Play Console | **into RevenueCat**, so RC can ask Google "is this purchase real?" |
| **Public SDK key** (`goog_…`) | RevenueCat dashboard | **into this app's `.env`** |

"The subscription key from Google Play" is almost always the first one. It is a
downloaded `.json` file, not a string you paste in an editor.

## A. The service account (Google → RevenueCat)

1. **Play Console → Setup → API access.** Link or create a Google Cloud project.
2. **Google Cloud Console → IAM & Admin → Service Accounts → Create.** Name it
   something like `revenuecat`. No project roles are required.
3. On that service account: **Keys → Add key → Create new key → JSON.** The file
   downloads once. ⚠️ It is a credential — treat it like a password, never
   commit it.
4. **Google Cloud Console → APIs & Services → Library → enable "Google Play
   Android Developer API".** Skipping this fails later with a permissions error
   that does not mention the API.
5. **Play Console → Users and permissions → Invite new user.** Paste the service
   account address (`…iam.gserviceaccount.com`) and grant:
   - View app information and download bulk reports
   - View financial data, orders, and cancellation survey responses
   - Manage orders and subscriptions
6. **RevenueCat → Project settings → Apps → your Android app.** Package name
   `com.kawmhmoob.app`, then upload the JSON.

⚠️ **Google can take up to 36 hours to propagate those permissions.** RevenueCat
will show credential errors during that window and nothing is wrong. This is the
single most common "it is broken" that is not broken.

## B. The SDK key (RevenueCat → this app)

**RevenueCat → Project settings → API keys** → the **public** Google Play key,
starts with `goog_`.

```
EXPO_PUBLIC_RC_API_KEY_ANDROID=goog_…
```

`rcApiKey()` in `src/context/SubscriptionContext.jsx` prefers the per-platform
variable and falls back to `EXPO_PUBLIC_RC_API_KEY`.

⚠️ **The public key only.** A secret key in an `EXPO_PUBLIC_*` variable is
compiled into the APK and readable by anyone who unpacks it.

## C. Products, and the two strings that must match exactly

1. **Play Console → Monetize → Products → Subscriptions.** Create the
   subscription, add a **base plan**, and **activate** it.
   ⚠️ A subscription with no *active* base plan returns no offerings, and the
   paywall renders "No plans available right now" with no other clue.
2. **RevenueCat → Products** — add the Play product / base-plan ids.
3. **RevenueCat → Entitlements** — the identifier must be **exactly**:

   ```
   KawmHmoob Pro
   ```

   ⚠️ **Space, both capitals.** `src/context/SubscriptionContext.jsx` hardcodes
   it as `PRO_ENTITLEMENT`. A mismatch is not an error — `proFromInfo()` just
   returns false forever, so a real paying subscriber sees the paywall and
   nothing anywhere says why.
4. **RevenueCat → Offerings** — create the offering, attach packages, and mark
   it **current**. The paywall reads `offerings.current` and shows the same
   "No plans available" if nothing is current.
5. Package types must be in `SELLABLE_TYPES` (`app/paywall.jsx`): MONTHLY,
   ANNUAL, WEEKLY, TWO_MONTH, THREE_MONTH, SIX_MONTH. A package typed anything
   else is filtered out deliberately and will not appear.

## D. Testing

⚠️ **Purchases cannot be tested in Expo Go, and not in a dev client sideloaded
outside Play.** Billing only works in a build that came from Play, signed with
the same key — use an internal testing track.

**Play Console → Setup → License testing** — add tester accounts there so
purchases are free and renew on a compressed schedule.

## Still open

- `EXPO_PUBLIC_RC_API_KEY_IOS` is unset — see `notes/TODO.md`.
- `profiles.is_pro` is client-reported. The proper fix is a RevenueCat webhook
  into a Supabase Edge Function, which is also the point where Play's server
  notifications become worth wiring up.

---

## The 3-day free trial

⚠️ **The trial is not in this repo and must not be.** It is configured on the
store product; the app only *reads* it. `freeTrialOf()` in `app/paywall.jsx`
derives the wording from `product.introPrice`, exactly as `priceString` is read
rather than typed. Hardcoding "3 days" would keep saying it on the day the offer
is shortened, removed, or never approved — a promise of free days the store does
not honour.

### Play Console

**Monetize → Subscriptions → (your subscription) → (base plan) → Add offer.**

1. Offer type: **free trial**
2. Eligibility: **new customer acquisition** — never previously subscribed
3. Phase: **Free trial, 3 days**
4. ⚠️ **Activate the offer.** In Play's base-plan model an offer is activated
   separately from the base plan it hangs off. An inactive offer is invisible to
   the SDK and the paywall silently falls back to "Auto-renews until cancelled" —
   correct, but not what you configured.

### App Store Connect (only if iOS ships)

Subscription → **Introductory Offer** → Free trial, 3 days. Same idea, separate
approval.

### RevenueCat

Nothing to configure. It reads the offer off the product, provided that product
is the one attached to the current offering.

## ⚠️ Three things about trials that are easy to get wrong

**Not everyone is eligible.** Someone who already used it is charged
immediately, and the STORE decides that, not the app. `introPrice` describes the
offer on the product, not this person's entitlement to it. The copy therefore
says what the plan includes rather than promising the reader personally —
`checkTrialOrIntroductoryPriceEligibility()` exists if per-user accuracy is ever
worth the extra call, and it is less reliable on Android than on iOS.

**An introductory offer is not always a trial.** "First month half price" is an
`introPrice` too. `freeTrialOf()` tests `price === 0` for exactly this reason;
calling a discount "free" is a refund request with extra steps.

**The terms must appear before the button.** Both stores require the length, the
price after, and that it renews — stated up front, not in a footnote. The plan
card reads:

```
3 days free, then $7.99 · auto-renews until cancelled
[ Start 3 days free ]
```

which is also what stops the first charge feeling like an ambush.

---

## The actual configuration — as set up 2026-09-15

| thing | value | where it lives |
|---|---|---|
| Entitlement identifier | `KawmHmoob Pro` | RevenueCat → Entitlements |
| Subscription / product id | `kawmhmoob_pro` | Play Console → Subscriptions |
| Android package | `com.kawmhmoob.app` | `app.json` |
| Free trial | 3 days | an **offer** on the base plan |

✅ **Entitlement verified byte-for-byte** against `PRO_ENTITLEMENT` in
`src/context/SubscriptionContext.jsx`: 13 characters, one space (U+0020), both
capitals. This is the one string that must match, and a mismatch is silent —
`proFromInfo()` returns false forever, so a paying subscriber sees the paywall
and nothing anywhere errors.

⚠️ **The product id is NOT referenced anywhere in this repo, and should not be.**
The paywall renders whatever `getOfferings()` returns. Renaming the product in
Play breaks nothing in the code; detaching it from the current offering breaks
everything, invisibly.

### ⚠️ The package TYPE matters more than the product id

This is the trap most likely to cost an evening. `app/paywall.jsx` filters:

```js
const SELLABLE_TYPES = ['MONTHLY', 'ANNUAL', 'WEEKLY', 'TWO_MONTH', 'THREE_MONTH', 'SIX_MONTH']
```

RevenueCat lets a package be **custom**-typed with any identifier. Attach
`kawmhmoob_pro` to a custom package and it is filtered out on purpose — the
paywall then shows **"No plans available right now"** while the product,
entitlement and trial are all configured perfectly.

**Add it to the `$rc_monthly` package** (or the annual one), not a custom one.

### ⚠️ On Play, a product id alone does not identify a product

With base plans, RevenueCat identifies a Google Play product as
**`product_id:base_plan_id`** — so `kawmhmoob_pro` becomes something like
`kawmhmoob_pro:monthly` in the RevenueCat Products list. Entering the bare
product id there matches nothing, with no error.

### The order that avoids dead ends

1. Play: create subscription `kawmhmoob_pro` → add base plan → **activate it**
2. Play: add the 3-day free trial **offer** on that base plan → **activate it**
3. RevenueCat: Products → import/add `kawmhmoob_pro:<base plan>`
4. RevenueCat: Entitlements → `KawmHmoob Pro` → attach the product
5. RevenueCat: Offerings → default → add to the **Monthly** package → mark
   offering **current**
6. **eas.json `production` profile**: `EXPO_PUBLIC_RC_API_KEY_ANDROID=goog_…` (the **public** key).
   ⚠️ NOT `.env`. Corrected 2026-09-29. `.env` is local dev, which runs in Expo Go, where the SDK
   is in browser mode and rejects `goog_` with "Invalid API key. Use your Web Billing API key." `.env` keeps
   the `test_` key. Was: "`.env`: `EXPO_PUBLIC_RC_API_KEY_ANDROID=goog_…`"
7. Install from an internal testing track — billing does not work in Expo Go or
   a sideloaded dev client

⚠️ Steps 1–3 can all look correct while step 5 is missing, and the symptom is
identical to having done nothing: an empty plan list.

## Final checklist before shipping (2026-09-29)

Status, as the author reported it on 2026-09-29.
- **Done:**
  - Google Cloud service account and JSON, uploaded to RevenueCat
  - Cloud connected to Play
  - the subscription created in Play
  - the entitlement created and attached to the subscription
  - the offering set up and marked default
- **Still to do:** the real-device test (step 5).

**1. Three RevenueCat details. Each one fails silently if it's wrong.**
- The entitlement is named exactly **`KawmHmoob Pro`**, with the same capitals and space. The app
  checks that exact string (`SubscriptionContext.jsx`, `PRO_ENTITLEMENT`).
  - ⚠️ It stays `KawmHmoob Pro` even after the KawmHmong rebrand (2026-09-29). It is an id, not
    display text. Changing it here means changing the dashboard entitlement too.
- The product sits in a **package inside the offering**, not only on the entitlement. Attaching it to
  the entitlement and adding it to the offering are two separate steps.
  - ✅ Done: Monthly and Yearly packages. The paywall shows MONTHLY and ANNUAL, both in
    `SELLABLE_TYPES`.
- The offering is **Current**. RevenueCat's "Default" and "Current" are the same flag. ✅

**2. RevenueCat's paywall builder isn't used.** The app has its own paywall screen
(`app/paywall.jsx`), which reads the prices from the offering. A paywall built in the dashboard does
nothing, and does no harm either.

**3. Real-time developer notifications.** ✅ Done.
- Where: RevenueCat → the Android app's settings → Google developer notifications → Connect to
  Google, which gives a Pub/Sub topic. Paste the topic into Play Console → Monetize → Monetization
  setup.
- Without it, RevenueCat learns about cancellations and renewals late, so someone who cancelled
  keeps Pro for a while.

**4. eas.json.** ✅ Done 2026-09-29. The production profile's key was renamed
`EXPO_PUBLIC_RC_API_KEY` → `EXPO_PUBLIC_RC_API_KEY_ANDROID`. Before that, it was the fallback every
platform used, so an iOS production build would have got the Google key. The development and
preview profiles keep the shared `test_` key.

**5. Test for real.** Nothing proves the setup works until this is done.
1. In Play Console, go to Settings → License testing and add your Gmail as a tester.
2. Run `eas build -p android --profile production`, then upload the build to the **Internal
   testing** track.
3. Install the app from the Play Store link. It has to be the store install, not a sideloaded APK.
4. Open the paywall and check it shows **$7.99 a month** (and the yearly price). Buy Pro. A tester
   isn't charged, and the test subscription renews every few minutes.
5. Check that unit 8 and the Pro stories unlock.
6. In RevenueCat, open Customers and check the purchase appears with the entitlement active.
7. Uninstall, reinstall, sign in, and tap **Restore**. Pro should come back.

Once that works, the payments side is finished. The rest of shipping is the Play Store listing:
privacy policy link, Data safety form, content rating, and screenshots.

## Launch status (2026-09-29)

**Done** (the author reported each of these):
- Google Cloud service account and JSON uploaded to RevenueCat; Play connected.
- Play subscription created. RevenueCat product, entitlement (`KawmHmoob Pro`) and offering done;
  the offering is Current and has Monthly and Yearly packages.
- Real-time developer notifications (Pub/Sub) connected.
- eas.json: the production key is `EXPO_PUBLIC_RC_API_KEY_ANDROID`. `.env` is back on the `test_`
  key for local dev.
- Play Store title changed to **KawmHmong**.
- **Store listing finished.**

**Next:**
1. **Real-device purchase test.** Steps 1–7 of the checklist above: license tester, production
   build, Internal testing, buy, check the unlocks, RevenueCat Customers, Restore.
2. **Promote to Production.** A staged rollout (for example 20% first) is suggested. The first
   review of a new app can take days to a couple of weeks.

**After launch:**
- **iOS:** App Store Connect subscription, the `appl_` key in `EXPO_PUBLIC_RC_API_KEY_IOS`, an iOS
  build.
- **Content:** the TODO-VERIFY sentences (tau examples, the "How Hmong Words Work" tone wording),
  the particle examples, and the 1,020 unreviewed dictionary entries (notes/TODO.md).
