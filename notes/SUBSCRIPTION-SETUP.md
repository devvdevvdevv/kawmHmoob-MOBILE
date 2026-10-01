# Subscriptions, end to end — Play Console, RevenueCat, and this app

How KawmHmong Pro is wired, how to set it up again from nothing, how to verify
it, and every way it has silently broken so far.

**Read the trap in §2 before touching the RevenueCat dashboard.** It cost a day
and several real charges on 2026-09-30, it produces no error anywhere, and it
looks exactly like working configuration.

Companion doc: [2026-09-30-internal-testing-bugs-subscription-and-audio.md](2026-09-30-internal-testing-bugs-subscription-and-audio.md)
— the bug log this came out of, with the code-level detail.

---

## 1. The mental model

Five layers. A purchase has to survive all five, and **the app only ever reads
the last one.**

```
Play Console
  Subscription            "KawmHmong Pro"          ← ONE thing users subscribe to
    ├─ Base plan          monthly · $7.99          ← billing period + price
    └─ Base plan          yearly  · $XX.XX
         └─ Offer         7 days free              ← optional intro/trial
                    │
                    │  Play exposes each base plan as a product:
                    │  <subscriptionId>:<basePlanId>
                    ▼
RevenueCat
  App  (one per store — Play Store, App Store, AND Test Store)
    └─ Products         pro:monthly, pro:yearly    ← imported from the store
                    │
                    ▼
  Entitlement         "KawmHmoob Pro"              ← products ATTACHED to it
                    │
                    ▼
  Offering  (current) └─ $rc_monthly, $rc_annual    ← what the paywall lists
                    │
                    ▼
This app
  customerInfo.entitlements.active["KawmHmoob Pro"]  ← THE ONLY THING GATING READS
```

**The single most important sentence in this document:** the app reads
**entitlements**, never subscriptions. A customer can hold a live, paid, visible
subscription and have *no entitlement*, and nothing in the API, the dashboard or
the app will raise an error. Entitlements exist only because you attached
products to them by hand.

Where that happens in code:
[SubscriptionContext.jsx `proFromInfo`](../src/context/SubscriptionContext.jsx).

---

## 2. ⚠️ THE TRAP: Test Store products attached to the entitlement

**This was the actual root cause of the 2026-09-30 failure.** Confirmed by the
author after a day of debugging.

A RevenueCat *project* contains multiple **apps** — one per store. Alongside
Play Store and App Store there is a **Test Store**, RevenueCat's own sandbox.
**Each app has its own separate set of products, and they can have identical
names.**

The entitlement's Products list is just a list of products. Nothing in the UI
warns you that the `pro_monthly` you attached belongs to the Test Store app
rather than the Play Store app.

### What it looks like when it is wrong

Everything looks configured. And then:

| what you observe | why |
|---|---|
| Purchase completes, money is charged | Play Billing worked fine |
| The subscription appears on the customer in RevenueCat | RevenueCat recorded the Play purchase |
| **`entitlements.active` is empty** | the Play product is not attached to the entitlement — only the Test Store lookalike is |
| The app stays on Free forever | `proFromInfo` returns false, correctly |
| Restore Purchases does nothing | it restores the same purchase, which still maps to no entitlement |
| **Monthly and Yearly both show the same price** | the offering was listing Test Store products, whose prices were both 7.99 |
| No error anywhere | there is no error. Every layer did its job. |

### Why it is so easy to do

The EAS profiles hand you a different store depending on which one you built:

| profile | RC key | which RevenueCat app |
|---|---|---|
| `development` | `test_…` | **Test Store** |
| `preview` | `test_…` | **Test Store** |
| `production` | `goog_…` | **Play Store** |

— [eas.json](../eas.json)

So the natural order of events is: set up on a dev build → the only products
that exist are Test Store ones → attach those to the entitlement → it works →
ship a production build → it silently stops working, because a `goog_` build can
never match a Test Store product.

### How to check, and how to fix

RevenueCat → **Entitlements** → `KawmHmoob Pro` → the **Products** list. Every
row shows its **store**. Then:

- Any row that says **Test Store** is inert for a production build.
- You need a row per **Play Store** product — one for monthly, one for yearly.

Fix: attach the Play Store products. This is **additive** — you do not have to
detach anything to unblock production.

### Should the Test Store products be detached? No. — decided 2026-09-30

**Keep them attached.** Two reasons, and neither is inertia:

- **They are inert in production.** A `goog_` build cannot purchase or hold a
  Test Store product, so those rows can never appear in a real customer's
  entitlements. There is nothing to protect against.
- **They are the only way to test the Pro flow on a dev build.** `development`
  and `preview` use the `test_` key. Detach the Test Store products and a test
  purchase on those profiles grants nothing — you would lose paywall → purchase
  → unlock testing entirely, and could only exercise it through a real Play
  upload with real money.

⚠️ **The offering works differently, and the difference matters.** A *package*
holds **one product per app**, so `$rc_monthly` carries the Play product *and*
the Test Store product at the same time, and each build is served the one for
its own store. That is the designed cross-store setup — it does not need a
second offering, and nothing should be removed there either.

Only detach if the Test Store is being retired for good.

**It is retroactive.** RevenueCat re-evaluates existing customers, so purchases
already made get the entitlement as soon as the product is attached. **No
rebuild, no new AAB** — the app picks it up on its next `getCustomerInfo`, i.e.
the next launch.

⚠️ **Per product, not per subscription.** Monthly and yearly are two different
products and each needs its own attachment. Attaching only the yearly leaves
monthly subscribers paying for nothing.

---

## 3. Play Console: the subscription and its base plans

### Add a billing period → add a BASE PLAN, not a new subscription

Play Console → Monetise → **Subscriptions** → open the existing subscription →
**Add base plan**.

**Never create a second subscription for a second billing period.** A separate
subscription is a separate thing to subscribe to: a user could hold both at
once, and Play can only handle upgrade/downgrade *within* one subscription, so
monthly↔yearly switching breaks entirely.

Settings that matter:
- **Auto-renewing** (not prepaid) for a normal subscription.
- **Billing period** — monthly, yearly.
- **Base plan ID** — see the note below.
- **Price**, per region.
- **Activate it.** An inactive base plan is invisible to the Billing API and
  simply will not appear in the app. This is the most common "why is there only
  one plan" cause after §2.

### About base plan IDs — including ones named `test` or `default`

**Base plan IDs are immutable.** Once created, a base plan ID cannot be renamed.

**They are also not user-facing.** Users see the subscription name and the
price; they never see a base plan ID. So a base plan whose ID is `test` or
`default` is *cosmetically annoying and functionally fine*.

So: **do not create a new base plan just to rename one.** Only replace it if
something real is wrong — wrong billing period, wrong price, or it was never
activated. If you do replace it:

1. Create the new base plan, priced and activated correctly.
2. **Attach the new product to the entitlement in RevenueCat** (§2) — it is a
   new product ID, so it starts unattached.
3. Point the offering's package at the new product (§4).
4. **Deactivate** the old base plan. Deactivating stops *new* purchases;
   existing subscribers continue on it until they cancel or it expires. Expect
   to deactivate rather than delete — an activated base plan generally cannot
   be deleted.

---

## 4. RevenueCat: products, entitlement, offering

In order, because each step depends on the one before.

**1. Products.** RevenueCat → Products → add/import from the **Play Store** app
(not the Test Store app). A Play base plan arrives with the ID
`<subscriptionId>:<basePlanId>` — e.g. `pro:pro-yearly`. Monthly and yearly are
therefore *different product IDs*.

**2. Entitlement.** RevenueCat → Entitlements → `KawmHmoob Pro` → attach **both
Play Store products**. See §2 — this is the step that breaks silently.

⚠️ The entitlement's **identifier** is what the app looks up, not its display
name. Here they happen to be the same string, `KawmHmoob Pro` (verified
2026-09-30), which is why that was *not* the bug. If you ever change one, change
[SubscriptionContext.jsx `PRO_ENTITLEMENT`](../src/context/SubscriptionContext.jsx)
to match the **identifier**.

**3. Offering.** RevenueCat → Offerings → the offering marked **Current** →
add packages:
- `$rc_monthly` → the monthly Play product
- `$rc_annual` → the yearly Play product

The app reads `offerings.current` ([paywall.jsx](../app/paywall.jsx)). An
offering that is not marked Current is invisible; **no** current offering renders
"No plans available right now." — a locked app with nowhere to pay.

**4. Transfer behaviour.** RevenueCat → Project Settings → **Transfer
purchases**. See §4b — this setting decides whether Pro is account-bound, and
the two options do opposite things.

### ⚠️ The package slot is what names the plan, not the product

`PERIOD_LABEL[pkg.packageType]` produces the word on screen; `product.priceString`
produces the price. They come from **different places**, so a product in the
wrong slot yields a confident, wrong pairing rather than an error.

**This caused the "yearly is 7.99" bug on 2026-09-30.** The yearly base plan was
created and priced correctly (88), the entitlement was correct — but the
`$rc_annual` package still pointed at the **monthly product**. The app printed
"Yearly" (from the slot) above the monthly price (from the product), exactly as
written. Nothing was broken; the wiring said that.

Check slot against product whenever a price looks wrong, before suspecting
caches, propagation or the device.

### The "not backwards compatible" warning — ignore it here

Selecting a Play product in RevenueCat may warn:

> The selected product is not backwards compatible and is only supported by apps
> using the RevenueCat Android SDK v6+ … You can select a fallback product below
> that will be used instead for older SDKs

**Leave the fallback blank.** The warning is about Play's multi-base-plan model:
a compound id like `kawmhmoob_pro:yearly` only exists in Play Billing Library 5+,
and RevenueCat Android SDK **< v6** cannot parse it. The fallback exists for apps
with **old builds still in users' hands**.

This app has none. Versions as of 2026-09-30:

```
react-native-purchases    10.7.0
purchases-hybrid-common   18.29.0   → native Android SDK v8.x
```

Far past v6, and nothing older has ever shipped — the app is in internal testing.

⚠️ **Do not set a fallback "to be safe."** It is a product served *instead of*
the chosen one. Picking the monthly product as the yearly package's fallback —
the obvious-looking option in that dropdown — would re-create the slot/product
bug above, but only for some clients, which is far harder to diagnose.

---

## 4b. Making Pro account-bound — decided 2026-09-30

**The requirement:** one subscription unlocks Pro for **one KawmHmong account**.
It follows that account anywhere; it does not leak to another account on the
same phone.

### ⚠️ How to tell which mode is live, from the customer event log

Transfers announce themselves. On the RevenueCat customer page, events like:

```
Got their purchases transferred to   d8245f67-6e2c-4819-9d94-d29ad369c77c
Got their purchases transferred from d8245f67-6e2c-4819-9d94-d29ad369c77c
```

**mean the project is on "Transfer to the new App User ID".** A paired
to/from across two customers is the transfer firing — one account gained the
entitlement, the other lost it. Observed 2026-09-30, which is how we learned the
setting was not yet what this section recommends.

Under "Keep with original App User ID" those events do not appear. Instead the
second account's restore fails with `RECEIPT_ALREADY_IN_USE_ERROR`.

### The setting

RevenueCat → Project Settings → **Transfer purchases**:

| option | account B signs in on a device where A bought |
|---|---|
| Transfer to new App User ID | the entitlement **moves to B** — A silently loses Pro |
| **Keep with original App User ID** ✅ | **B gets nothing; A keeps it** |

**Use "Keep with original App User ID"** (also the RevenueCat default).

✅ **SET AND VERIFIED ON DEVICE, 2026-09-30.** Account A bought; account B signed
in on the same device and phone and had **no Pro**; A still had it on return.
That is the full proof — see the test table below for why checking A alone would
not have been.

⚠️ An earlier draft of the bug note recommended the opposite. That advice was
aimed at "Pro should survive an account switch" and is wrong for this
requirement — the two options are mutually exclusive, and this is the one that
matches what the app promises on the paywall.

### What this does NOT break

Pro still follows the account across **reinstalls and new devices**. The
entitlement is bound to the App User ID — the Supabase user id — and
`Purchases.logIn(user.id)` fetches it from RevenueCat's servers on any device.
Transfer behaviour only governs *collisions* between different accounts sharing
one store account.

### What makes it actually hold

Account-binding only works if a purchase is never made while anonymous, because
an anonymous purchase binds to a device-local id that no account owns. Two
things enforce that, both already in place:

- the paywall refuses to sell to a guest (`mustSignUp`,
  [paywall.jsx](../app/paywall.jsx));
- the binding effect waits for `authLoading` before touching RevenueCat, which
  closed the cold-start window where `user` was still `guestUser` and a
  `logOut()` minted a fresh anonymous id
  ([SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx)).

### The collision, and what the user is told

When account B tries to restore a purchase owned by A, RevenueCat raises
`RECEIPT_ALREADY_IN_USE_ERROR` (7) or
`RECEIPT_IN_USE_BY_OTHER_SUBSCRIBER_ERROR` (13). **That is the feature working**,
not a bug.

`describePurchaseError` names both and says *"This subscription belongs to
another account"*. Before 2026-09-30 restore reported every failure as a
connection problem, which sent a person hitting a deliberate account boundary
round a loop that could never succeed.

`describePurchaseError` also takes `{ context: 'restore' }` now, so only the
money-mentioning wording branches — a failed restore no longer promises
"nothing was charged", a sentence about a purchase that nobody thought restoring
might make.

### Does transfer mode let one purchase unlock many accounts?

**No — but it does let one purchase wander between them, one at a time.**

Worth being precise, because the worry ("users will create multiple accounts and
add subscriptions to those") has a different answer in each mode:

| | Transfer to new | Keep with original |
|---|---|---|
| Can two accounts hold Pro at once? | **No** — it moves, it does not copy | **No** |
| Can a user move Pro to a new account they made? | **Yes**, freely | **No** |
| Is Pro pinned to the buyer? | No | **Yes** |

So neither mode allows *stacking*. Transfer mode is not a revenue leak so much
as an absence of binding — and binding is what was asked for, which is why the
recommendation is Keep-with-original.

### Naming the account that owns the subscription — added 2026-09-30

**The problem with a generic "no subscription found".** Pro is bound to the
account that bought it, so the commonest reason a restore finds nothing is that
the person is signed in as the wrong KawmHmong account. Saying that generically
leaves them to work out *which* account — and usually they cannot, which makes
the message a dead end.

**⚠️ RevenueCat will not tell us whose it is.** `RECEIPT_ALREADY_IN_USE_ERROR`
deliberately does not return the owning App User ID: doing so would hand one
user another user's identity to anyone who tapped Restore. **So the store cannot
answer this, and no amount of error handling will make it.**

**What we can do instead: a device-local breadcrumb.** `KEY_LAST_PRO_ACCOUNT` in
`SubscriptionContext` records `{ id, name }` whenever a signed-in account
genuinely holds Pro on this device. When a restore later finds nothing *and* the
remembered account is a different one, the message names it:

> **Pro belongs to another account**
> Pro was last active on this device for “Devan”. Subscriptions belong to the
> account that bought them — sign in as that account to use it.

Shown on both `paywall.jsx` and `subscription.jsx`; falls back to the generic
wording when there is nothing to name.

**Four deliberate constraints on that key**

| | why |
|---|---|
| **Device-scoped** — no userId suffix, unlike `KEY_PREFIX` | it must be readable by a *different* account than the one that wrote it, or it cannot answer the question it exists for |
| Written from **`realPro`**, never `isPro` | `isPro` is true for everyone while `MONETIZATION_ENABLED` is false and absorbs the dev override — either would record a non-subscriber and then show their name to the next person |
| **Name only, never the email** | this string is shown to a *different account on a shared phone*. A display name is already public on leaderboards; an email is not, and the message reads fine without it |
| Suppressed when it names the **current** user | otherwise it implies their own subscription is somewhere they cannot reach |

**What it covers:** one person, one phone, two accounts — the case actually
being reported.
**What it does not:** a subscription bought on another device, or after a
reinstall. Nothing local remembers those, so the UI degrades to the generic
wording rather than implying certainty it does not have.

### ⚠️ How to test this — and the test that proves nothing

The obvious sequence — **A buys → sign out → sign in as B → back to A** — gives an
**identical result under both settings**:

| | what happened | A at the end |
|---|---|---|
| Keep with original | the entitlement never left A | has Pro ✅ |
| Transfer to new | it moved to B, then back to A | has Pro ✅ |

Same observation, opposite mechanisms. **Only one step separates them:**

> **While signed in as B — did B have Pro?**
>
> B **free** → "Keep with original" is live. Correct.
> B **Pro** → transfers are still on; the entitlement is hopping between accounts.

Checking A twice proves nothing. **Check B once.**

### Cancelling is not revoking — expect access to continue

Cancelling in Google Play means *do not renew*, not *revoke now*. Afterwards
`isActive` stays **true**, `willRenew` becomes **false**, and `expirationDate` is
when access actually ends.

So a subscription still working right after a cancel is **correct**.
`/subscription` should say *"Cancelled — you keep Pro until &lt;date&gt;"* rather
than "Renews automatically". **If it still claims it renews, that is the bug —
not the continued access.**

Cancelling also works from **any** app account on the device, because Play only
knows the **Google** account. Which KawmHmong account is signed in at the time is
irrelevant to the cancellation.

### Testing a free trial

`periodType === 'TRIAL'` drives the trial badge. Cancelling during a trial
normally ends access at trial end with no charge, so the date shown is the
trial's end rather than a paid period's.

⚠️ **A trial is once per product per Google account.** Once consumed it cannot be
re-tested on that account — it needs a different Google account. On a
licence-tester clock the trial compresses along with everything else.

### ⚠️ The Play limit you cannot code around

**One Google account can hold only one active subscription to a given product.**

So two KawmHmong accounts sharing one phone and one Google account **cannot both
subscribe**. The second gets `PRODUCT_ALREADY_PURCHASED_ERROR`, and the only
real answer is a different Google account. This is a store constraint, not an
app decision — worth knowing before it arrives as a support question.

### If it ever needs to be enforced server-side

Gating currently trusts the client: `isPro` is resolved in the app from the
RevenueCat SDK, and `profiles.is_pro` is written as a **report for the admin
dashboard only** — gating never reads it
([SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx) says so at
the write site). A patched build could set it. The proper fix is a RevenueCat
**webhook** writing the entitlement server-side, which would also make Pro
readable without the SDK. Not needed while the only cost is a wrong dashboard
number.

---

## 5. The verification checklist

Run top to bottom. Every line is a thing that has silently failed at least once.

**Play Console**
- [ ] One subscription, with a base plan per billing period
- [ ] Every base plan is **Activated**
- [ ] Prices are right per base plan (a copied base plan keeps the source price)
- [ ] Testers' Google accounts are on **Setup → License testing** (§7)

**RevenueCat**
- [ ] Products exist under the **Play Store** app
- [ ] Entitlement `KawmHmoob Pro` lists **every Play Store product** — check the
      store column on each row (§2)
- [ ] The offering is marked **Current**
- [ ] It has `$rc_monthly` and `$rc_annual`, each pointing at the right product
      (a package holds one product **per app**, so Play and Test Store products
      coexist in the same package — that is correct, not a mistake)
- [ ] Transfer purchases = **Keep with original App User ID** (§4b)

**The build**
- [ ] Built with `--profile production` (a `goog_` key, and the
      `com.kawmhmoob.app` package — see §8)
- [ ] Installed **from Play**, not sideloaded

**On device** (§6)
- [ ] `[rc] key prefix` logs `goog_`
- [ ] `[rc] all entitlements` includes `KawmHmoob Pro`
- [ ] The paywall lists two plans at two different prices
- [ ] Buying unlocks Pro without an app restart
- [ ] Force-quit → relaunch → still Pro
- [ ] Sign out → Pro off; sign back in → Pro on
- [ ] Restore Purchases on a fresh install grants Pro

---

## 6. Verifying from the app

The logs are in [SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx)
and are **deliberately permanent** — they answer the two questions that cost the
most time.

```
[rc] key prefix goog_
[rc] all entitlements ["KawmHmoob Pro"]
[rc] active ["KawmHmoob Pro"]
```

How to read them:

| output | meaning |
|---|---|
| `key prefix test_` | Test Store build. Real Play billing is not being exercised at all. §8. |
| `key prefix goog_` | real Play Billing |
| `all: []` | no entitlement reached this customer — **§2**, the product is not attached |
| `all: ["KawmHmoob Pro"]`, `active: []` | wired correctly; this subscription is expired or lapsed (§7 — test subs expire fast) |
| both populated | working |

There is also a `__DEV__` warning in `proFromInfo` that fires whenever the
entitlement is missing from `all`, naming what RevenueCat *does* know about. It
exists precisely because the §2 failure is otherwise silent.

Also worth reading on the RevenueCat customer page:
- **App User ID** — a Supabase UUID means account binding worked;
  `$RCAnonymousID:…` means the purchase never bound to an account.
- **Store** — "Play Store" vs "Test Store" tells you which build made the
  purchase.

---

## 7. Testing without paying

**Being on the internal testing track does not make purchases free.** Two
separate lists:

| list | where | controls |
|---|---|---|
| Internal testing track | Release → Testing → Internal testing | who can **install** |
| **License testing** | **Setup → License testing** | whose purchases are **test purchases** |

A tester on the track but not on the license-testing list goes through the real
purchase flow with a real card and **is charged**. This happened on 2026-09-30.
Check Play order history / Play Console → Orders and refund anything real.

Add the **Google account signed in to the Play Store on the device** — which is
not necessarily the KawmHmong account email.

Once licensed, test subscriptions are free and run on an **accelerated clock**:
a monthly subscription renews every few minutes and auto-cancels after roughly
six renewals. Consequences:
- An expired test subscription restores as *inactive* — correctly. That looks
  exactly like "restore is broken."
- **Re-buy immediately before testing restore.** Never test restore against
  yesterday's purchase.

---

## 8. What needs a new build, and what does not

The rule: **baked in at build time, or fetched at runtime?**

| change | new AAB? |
|---|---|
| Attach a product to the entitlement | **No** — retroactive, next launch |
| Add a base plan / change a price | **No** |
| Add or edit an offering or package | **No** — offerings are fetched at runtime |
| Transfer-purchases setting | **No** |
| Add license testers | **No** |
| Any code change | **Yes** |
| Moving from a `test_` key to real billing | **Yes** — the key is compiled in |

Because of that first row, **most subscription fixes cost zero builds.** Reach
for the dashboard before the build queue.

### Why only `production` can do real billing

| profile | package | RC key | real billing? |
|---|---|---|---|
| `development` | **`com.kawmhmoob.app.dev`** | `test_…` | **No** — wrong package *and* Test Store |
| `preview` | `com.kawmhmoob.app` | `test_…` | **No** — right package, Test Store |
| `production` | `com.kawmhmoob.app` | `goog_…` | **Yes** |

[app.config.js](../app.config.js) rewrites `android.package` to
`com.kawmhmoob.app.dev` whenever `APP_VARIANT=development`, and only the
`development` profile sets it ([eas.json](../eas.json)). Play Billing is bound to
the package name, so a dev build is a **different app Play has never heard of**.

```
eas build  --profile production --platform android
eas submit --profile production --platform android
```

`autoIncrement: true` handles the version code.

⚠️ **Install from Play, not by sideloading.** Play Billing verifies the app came
from Play and is signed with the Play app-signing key. Upload to the internal
testing track and install via the opt-in link.

⚠️ **iOS is not set up.** `EXPO_PUBLIC_RC_API_KEY_IOS` is unset, so the
production profile is Android-only until an `appl_` key is added.

---

## 8b. When a dashboard change does not show up in the app

Dashboard changes are runtime-fetched (§8), but "runtime" is not "instantly".
Work through these **in order** — the first two cost nothing and rule out the
expensive ones.

1. **Check the value in Play Console itself.** If the yearly base plan is priced
   7.99 there, the app is reporting the truth. A base plan **copied** from
   another one keeps the source price, which is the most common cause by far.
2. **Log what the store actually returned** — in `load()` in `paywall.jsx`:
   ```js
   console.log('[rc] offering', current.availablePackages.map(p => ({
     type: p.packageType, product: p.product.identifier, price: p.product.priceString,
   })))
   ```
   This separates *wrong product in the slot* from *right product, wrong price*
   in one read. Neither is a cache problem.
3. **Propagation.** Play's Billing API can lag the console by hours after a price
   or base-plan change. Nothing on the device speeds this up.
4. **Offering cache.** The SDK caches offerings locally with a short TTL.
   Force-quit, wait ~10 minutes, reopen. **Still wrong after that means it was
   never the cache** — stop here and go back to step 1.
5. **Clear app data, or reinstall.** The blunt instrument, and only worth it if
   step 4 is genuinely suspected.

⚠️ **On 2026-09-30 the answer was step 2, not step 3, 4 or 5.** The yearly base
plan was priced correctly (88) in Play Console, so step 1 passed — and the
package slot turned out to hold the monthly product (§4). Fixed on the next
launch with **no rebuild and no reinstall**. Steps 3–5 would all have "failed to
fix it" while looking plausible, which is exactly why they are last.

⚠️ **A reinstall does NOT lose a subscription.** The entitlement lives on
RevenueCat's servers bound to the App User ID; signing back in retrieves it —
that is the whole point of the account binding in §4b. Two conditions:

- **reinstall FROM PLAY**, not a sideloaded APK — Play Billing checks the
  install source;
- the user is signed out afterwards, so they need their credentials. A **guest's**
  progress is local and would be lost; a signed-in account's is not.

---

## 9. Failure catalogue

Symptom → cause → fix. Ordered by how often each has actually happened here.

| symptom | cause | fix |
|---|---|---|
| Purchase succeeds, app stays Free. Subscription visible in RevenueCat, `all: []` | **Test Store products attached to the entitlement instead of Play Store ones** — the 2026-09-30 root cause | §2. Attach the Play products. No rebuild. |
| Monthly and yearly show the same price | **the `$rc_annual` package points at the MONTHLY product** — the label comes from the slot, the price from the product (§4) | §4. The 2026-09-30 cause. |
| …still the same price after that | the offering is listing Test Store products (§2), or a copied base plan kept the source price | §2, then §3 |
| Only one plan appears | the second base plan is not **activated**, or has no offering package | §3, §4 |
| A price change does not show up in the app | Play Console propagation (hours), or the offering cache (short TTL) | §8b — check the Play Console price FIRST; reinstalling fixes neither |
| "No plans available right now." | no offering marked **Current** | §4 |
| "Could not load plans." on first open, works on retry | `configure()` losing the race to a screen's own effect | **fixed in code** 2026-09-30 — module-scope `ensureConfigured()` |
| Restore does nothing, no error | nothing to restore, or §2; and restore used to be unable to report failure | **fixed in code**; then §2, §7 |
| Pro appears then disappears | a stale `logIn` overwriting a fresh purchase | **fixed in code** — `bindSeq` guard |
| Pro lost after sign out / switch | purchase bound to an anonymous App User ID; transfer behaviour | §4b, and the auth-gated binding fix |
| Account B inherits A's Pro on a shared phone | transfer set to "Transfer to new App User ID" | §4b — switch to "Keep with original" |
| "This subscription belongs to another account" | **working as designed** — receipt owned by a different KawmHmong account | §4b. Sign in as that account. |
| "Pro belongs to another account — last active for X" | restore found nothing, and this device remembers a different account holding Pro | §4b. Sign in as X. |
| "The store could not complete this purchase" | `PURCHASE_INVALID_ERROR` (4) — a **developer/config error**, NOT a declined card. Usually a stale cached product after a base-plan change | §9c |
| "This plan is not available" | `PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR` (5) — the store will not sell this product | §9c |
| Second account on one phone cannot subscribe | Play allows one active subscription per product **per Google account** | §4b — needs a different Google account; not fixable in code |
| Testers charged real money | on the track but not on **License testing** | §7 |
| Confetti fired but the app stayed Free | the paywall celebrated the call resolving, not the entitlement | **fixed in code** — `purchase()` returns the entitlement |
| Entitlement lookup always false | `PRO_ENTITLEMENT` set to the display name instead of the identifier | §4. *Not* the 2026-09-30 bug — both strings matched here. |

---

## 9b. The subscription screen — `app/subscription.jsx`, added 2026-09-30

**Why it exists.** "Manage subscription" in ProfilePage used to call
`manageSubscription()` and throw the user straight out to Google Play. That
answers *"how do I cancel"* and nothing else — not which plan, not when it
renews, not whether it renews at all, and above all **not which account holds
it**, which is the question this app most needs to answer now that Pro is
account-bound.

ProfilePage now links to `/subscription`; the Play hand-off lives one step
further in, after the user can see what they are managing.

**What it shows**

| | source |
|---|---|
| Which account holds Pro — **first on the page** | `useAuth()` |
| Plan (Monthly / Yearly) | `productPlanIdentifier`, falling back to `productIdentifier` |
| Active / Cancelled / Payment problem, with the end date | `willRenew`, `expirationDate`, `billingIssueDetectedAt` |
| Free trial badge | `periodType === 'TRIAL'` |
| Sandbox badge | `isSandbox` |
| Manage or cancel in Google Play | `managementURL` via `manageSubscription()` |
| Refresh status, Restore purchases | new `refresh()`, existing `restore()` |

**Three things it gets right that are easy to get wrong**

- **`isActive` and `willRenew` are independent.** Someone who cancelled still
  has Pro until the period ends. Saying "cancelled" without "until the 14th"
  reads as though access is already gone; saying "renews on the 14th" is worse —
  a promise of a charge that will not happen, so they never re-subscribe.
- **A billing issue is not a cancellation.** The card failed and the store is
  retrying. That person needs to fix a card, not buy again.
- **`isPro` can be true with no entitlement.** `MONETIZATION_ENABLED` off makes
  everyone Pro, and so does the dev override; neither invents a RevenueCat
  subscription. The screen says so plainly rather than rendering an empty card.

**It refreshes on focus.** A subscription cancelled in the Play UI, or renewed
while the app was closed, can be minutes stale — the customerInfo listener only
fires when RevenueCat notices. Someone who just cancelled in Play and came
straight back would otherwise read a confident, stale "Renews automatically".

**Context changes that made it possible** — `SubscriptionContext` now exposes
`entitlement` (the full `PurchasesEntitlementInfo`), `managementURL`, and
`refresh()`. Internally, `PRO_ENTITLEMENT` and `proFromInfo` moved to **module
scope** (neither reads component state, and keeping them in the body made
`applyInfo` an unstable dependency the effects could not honestly declare), and
every path that previously called `setRcPro(proFromInfo(info))` now calls one
`applyInfo(info)` — so the boolean and the detail cannot drift apart. The failure
that prevents: a screen confidently reporting a renewal date for a subscription
that had already lapsed.

---

## 9c. ⚠️ "Payment declined" usually is not — `PURCHASE_INVALID_ERROR`

**Corrected 2026-09-30, after it misdiagnosed a real failure.**

`describePurchaseError` used to map `PURCHASE_INVALID_ERROR` to *"The payment was
declined · Check the card on file in your store account"*. Two faults:

1. **`PAYMENT_DECLINED` is not a RevenueCat error code.** The branch read
   `is('PURCHASE_INVALID_ERROR') || is('PAYMENT_DECLINED')`, and the enum
   (`PURCHASES_ERROR_CODE`) has no such member — that half never matched
   anything.
2. **`PURCHASE_INVALID_ERROR` (4) does not mean a card was refused.** On Android
   it is the billing layer's **developer error**: the purchase *request* was
   rejected. Causes are configuration, not payment —
   - a **stale cached product** after a base plan or offering change,
   - a base plan deactivated or edited underneath the app,
   - the app not installed from Play, or signed with the wrong key,
   - the product not available to that account or region.

Telling that person to check their card sends them to fix something that is not
broken, while the real cause sits in the dashboard or in a cached offering.

**Now:** *"The store could not complete this purchase — this is usually a problem
with the plan itself rather than your payment. Close the app completely and
reopen it, then try again."* `PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR` (5) got
its own branch for the same reason.

**If you hit it:** force-quit and reopen first — that drops the cached offering,
which is the commonest cause right after changing products. Then re-check the
offering's package→product wiring (§4).

⚠️ **A genuine decline does not reach this function.** On Play it arrives as
`STORE_PROBLEM_ERROR`, or the sheet is simply cancelled.

### The lesson: translate the code, but never discard it

Every branch here turns an error code into plain English for the reader — which
means the code itself reached nobody who could act on it. The screen said
"declined" and nothing anywhere said "4", so the diagnosis went to payment
methods instead of product config.

`describePurchaseError` now logs the raw `code` and `readableErrorCode` in
`__DEV__` before returning the fallback. **A user-facing message is a
translation, not a replacement — keep the original somewhere.**

---

## 10. What the code actually reads

The contract, so a dashboard change and a code change are never confused.

| file | responsibility |
|---|---|
| [SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx) | configures RevenueCat at module load; binds the RC identity to the Supabase user; resolves `isPro` from `entitlements.active[PRO_ENTITLEMENT]`; owns `purchase` / `restore` / `manageSubscription` |
| [paywall.jsx](../app/paywall.jsx) | reads `offerings.current`, filters to `SELLABLE_TYPES`, renders `packageType` + `product.priceString` **verbatim from the store** |
| [launch.js](../src/lib/launch.js) | `MONETIZATION_ENABLED` — false makes everyone Pro and hides every wall |

Three rules that follow from this:

1. **The price is never in the repo.** `priceString` comes from the store,
   already localised and already in the right currency. If the price on screen
   is wrong, the store is wrong.
2. **The plan list is never in the repo.** The paywall renders whatever the
   current offering contains. If a plan is missing or duplicated, the offering
   is missing or duplicated.
3. **The label and the price come from DIFFERENT PLACES, so they can disagree.**
   The word on screen is `PERIOD_LABEL[pkg.packageType]` — from the **package
   slot**. The number beside it is `pkg.product.priceString` — from the
   **product**. Nothing checks that the two describe the same billing period,
   because nothing can: both values are valid, they are simply about different
   things.

So: **a wrong price or a wrong plan list is always a dashboard bug, never a code
bug.** That one inference would have saved most of 2026-09-30.

And rule 3 is the sharper version, because it explains the shape of the failure
rather than just its location:

> **A product in the wrong slot produces a confident, wrong pairing — never an
> error.**

That is why the 2026-09-30 symptom read as a *pricing* bug when it was a
*wiring* bug. "Yearly · $7.99" was not the app failing to find the right price;
it was the app correctly reporting a slot that said yearly and a product that was
monthly. There is no state in which this mismatch announces itself, so it has to
be checked deliberately: **read slot and product together, and confirm they
describe the same period, before suspecting anything on the device.**

### Where that lands in practice

The same reasoning retires the whole "is it cached / should I reinstall" branch
in §8b for this class of bug. On 2026-09-30 the answer turned out to be neither
cache nor propagation nor the device — repointing `$rc_annual` at
`kawmhmoob_pro:yearly` fixed it on the next launch, **with no rebuild and no
reinstall**. §8b's ordering exists to reach that conclusion cheaply: check the
value in the dashboard, then check what the store actually returned, and only
then consider the device.
