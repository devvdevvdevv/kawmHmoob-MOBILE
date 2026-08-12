# Learning: hydrating offerings & building a proper paywall page

**Do this AFTER** you've finished #6 — `purchase` and `restore` defined inside
`SubscriptionContext.jsx` and exposed on the context `value`. This guide is the
next layer up: fetching offerings safely (the "hydration" part) and turning them
into a real screen. It intentionally does **not** hand you finished code — it tells
you what to build, in what order, and where the traps are, so you write it yourself.

Everything here uses primitives already in this repo:
- routes live in `app/` (expo-router, file = URL)
- screens wrap in `TabScreen` (`src/components/TabScreen.jsx`)
- buttons come from `src/components/ui/Button.jsx`
 (`variant="primary" | "secondary"`)
- styling is NativeWind classNames with the `cream / clay / stone` tokens
- subscription state comes from `useSubscription()` in `SubscriptionContext.jsx`

---

## PART A — Hydrating offerings (the data half)

**The whole idea in one sentence:** the paywall fetches prices from the internet,
which is slow and can fail, so you track *where you are* (loading → done, or error)
and show the right thing for each. That's "hydration." It's just **3 states + 1
fetch + a 3-way render.** Everything below is detail hanging off those.

### A1. The 3 states (put these at the top of the component)

One `useState` per thing you're tracking:

```js
const [loading, setLoading]   = useState(true)   // true = still asking the store
const [error, setError]       = useState(null)   // null = nothing broke (yet)
const [packages, setPackages] = useState([])     // [] = no prices arrived yet
```

Why those starting values: on mount you're *already* fetching, so `loading` starts
`true`; nothing's failed yet, so `error` is `null`; no prices yet, so `packages` is
empty.

### A2. The 1 fetch (the mount effect — put this in `app/paywall.jsx`)

This is the exact pattern to copy. Fetch once on mount, report progress by flipping
the three states:

```js
useEffect(() => {
  let active = true                       // "screen still open?" switch
  Purchases.getOfferings()
    .then(offerings => { if (active) setPackages(offerings.current.availablePackages) })
    .catch(()        => { if (active) setError('Could not load plans') })
    .finally(()      => { if (active) setLoading(false) })
  return () => { active = false }         // screen closed → flip switch OFF
}, [])                                     // [] = run once, on mount
```

Line by line:
- `.then(...)` → prices arrived: stash them in `packages`.
- `.catch(...)` → it broke (offline, etc.): put a message in `error`.
- `.finally(...)` → *either way* we're done asking: `loading = false`.
- `active` flag → if the user closes the paywall before the fetch returns, the late
  response sees `active === false` and does nothing (no "setState on unmounted"
  warning). Same guard as the effects in `SubscriptionContext`.

### A3. The 3-way render (pick one based on state)

Once the states above exist, the screen is just:

```
if (loading)  → spinner
else if (error) → "Couldn't load plans"  + a Retry button (re-runs the fetch)
else          → render the packages (prices + buy buttons)
```

### A4. Reading `getOfferings()` — what `packages` actually contains

`getOfferings()` returns a big object. You only care about a path down into it.
Read it as a sentence, top to bottom:

> "Take the **current** offering → grab its **availablePackages** array → that's
> your list. For **each** package, show its **price** and wire its **buy button**."

In code terms, that path is:

```js
const offerings = await Purchases.getOfferings()
const current   = offerings.current              // the offering marked "current" in RC
const packages  = current.availablePackages       // ← THIS array is what you render
```

Then for **one** `pkg` in that array, the only fields you touch:

| You want to… | Use this field | Example |
|---|---|---|
| give React a list key | `pkg.identifier` | `"$rc_monthly"` |
| label the plan | `pkg.packageType` | `"MONTHLY"`, `"ANNUAL"` |
| **show the price** | `pkg.product.priceString` | `"$4.99"` — already localized, display as-is |
| the buy action | pass `pkg` itself → `purchase(pkg)` | (from your #6 action) |

So `packages` is an **array of these `pkg` objects**, and each row on screen is one
`pkg`: its `priceString` for the label, `pkg` handed to `purchase()` on tap.

### A5. Two traps (the reason for the `error`/null checks)

- **`offerings.current` can be `null`.** Happens when no offering is marked
  "current" in the RC dashboard, or (Test Store) no products attached. Reading
  `.availablePackages` off `null` crashes — so treat null like an error: show the
  "couldn't load" state, don't blow up.
- **Never hand-build the price.** Always display `pkg.product.priceString` as-is —
  it's already localized to the user's country/currency. Hard-coding `"$4.99"` is
  wrong abroad and an App Store rejection risk.

### A6. Hydration checklist (Part A is done when…)

- [x] Three `useState`s declared (`loading` starts `true`).
- [X] Mount effect fetches once, flips all three states, has the `active` guard.
- [X] `loading` true → spinner, no empty flash.
- [ ] Success → list renders from `availablePackages` using `priceString`.
- [ ] `offerings.current === null` or network fail → error state + Retry, no crash.

---

## PART B — The paywall page (the UI half)

### B1. Create the route

Add `app/paywall.jsx` (→ URL `/paywall`). Match the existing screen skeleton you
see in `app/pass.jsx` / `app/account.jsx`:
- default-export a component
- wrap the body in `<TabScreen>` so it inherits global header/tab chrome
- optional `Breadcrumbs` at the top (`Home / Kawm Hmoob Pro`) like `pass.jsx` does

Pull actions + state from the context at the top:
`const { isPro, purchase, restore } = useSubscription()`.

### B2. Point existing entry points at it

Right now `PaywallGate`'s "See plans" button links to `/account`
(`src/components/common/PaywallGate.jsx`). Once the real paywall exists, decide:
- change that `Link href="/account"` → `href="/paywall"`, and/or
- keep `/account` for managing an existing plan and send *upgrades* to `/paywall`.

Keep the same `Link … asChild` + `<Button>` pattern PaywallGate already uses — no
new navigation mechanism needed.

### B3. What the screen must contain (App Store will check these)

A subscription paywall that ships must have **all** of:

1. **Each plan's real price + billing period** — from `priceString` + `packageType`.
2. **What renews and how often** — e.g. "Billed monthly, auto-renews until
   cancelled." Say it in words near the buy button.
3. **A Buy control per package** → `onPress={() => purchase(pkg)}`.
4. **A visible Restore Purchases control** → `onPress={restore}`. Not optional —
   Apple rejects paywalls without it.
5. **Links to Terms of Use (EULA) and Privacy Policy.** Required for
   auto-renewable subscriptions. Use expo-router `Link` (internal pages) or
   `Linking.openURL` (hosted URLs).

Miss #4 or #5 and the app gets rejected at review — they are the two most common
paywall rejections.

### B4. Wiring the buy button to your #6 action

The button's job is only: call `purchase(pkg)` and reflect the outcome. Because
your #6 `purchase` already `setIsPro(...)` on success AND the context listener
fires, the screen doesn't have to manage entitlement state itself. What it DOES
own is transient UI feedback:

- a per-button `purchasing` boolean → disable the button + show a spinner while the
  store sheet is open (prevents double taps).
- on success: `isPro` flips → navigate away or show a "You're Pro" confirmation.
- on thrown error: show a message. Remember #6 already swallows `userCancelled`, so
  anything that reaches your `catch` here is a *real* failure worth surfacing.

Think of it as: **context owns "are they Pro"; the screen owns "is this button
mid-purchase."** Don't duplicate entitlement state on the screen.

### B5. Reflecting the already-Pro case

If `isPro` is already true when the screen mounts (they subscribed earlier), don't
show buy buttons. Show a "You're on Kawm Hmoob Pro" state instead — reuse the
`cream-50 / cream-200 / stone-900 / clay-600` card styling from
`PaywallGate`'s `UpgradeCard` so it matches the rest of the app.

### B6. Styling to match the app (so it doesn't look bolted on)

Reuse the existing visual language rather than inventing one:
- container cards: `rounded-md bg-cream-50 border border-cream-200 p-6`
- eyebrow label: `text-xs uppercase tracking-[3px] text-clay-600`
- headings: `font-serif text-3xl text-stone-900`
- body: `text-stone-700`
- buttons: `<Button variant="primary">` to buy, `variant="secondary">` for Restore
- if the plan list can overflow, wrap in `ScrollView` (see `app/pass.jsx`)

### B7. Paywall page checklist (Part B is done when…)

- [ ] `/paywall` route renders inside `TabScreen`.
- [ ] Each package shows localized `priceString` + a period label.
- [ ] Buy button calls `purchase(pkg)`, disables while in flight, re-enables on
      cancel/error.
- [ ] Restore button calls `restore()` and is always visible.
- [ ] Terms + Privacy links present.
- [ ] Already-Pro users see a confirmation state, not buy buttons.
- [ ] An entry point (PaywallGate / account) navigates here.

---

## Where this connects back

- Buy/restore success → your #6 actions flip `isPro` → `canAccess()` and every
  `PaywallGate` in the app unlock automatically. You do **not** touch those.
- Test the whole flow against the `test_` key in the dev client first (RC Test
  Store) — no release AAB needed for that phase. Real store purchases need the
  production AAB on an internal track — see §8 of
  `revenuecat-integration-guide.md` and the dependency/build notes.
- Related: [revenuecat-integration-guide.md] (§5 context wiring, §6 actions),
  and `notes/2026-08-06-revenuecat-subscriptioncontext-wiring.md`.
