# RevenueCat account binding (§7) (2026-08-06)

Ties the RevenueCat identity to the Supabase user so Pro follows the ACCOUNT, not
the device. Added as a second effect in `SubscriptionProvider`
(`src/context/SubscriptionContext.jsx`), watching `useAuth().user`.

## What it does

- **Real account** (`user && !user.isGuest`) → `Purchases.logIn(user.id)`. RC merges
  any anonymous purchases onto the identified user, so Pro bought as a guest
  survives signup and follows them across devices/reinstalls.
- **Guest / signed out** → `Purchases.logOut()` back to anonymous — but only when
  currently identified (see gotcha 3).
- After either, re-derive `isPro` from the returned CustomerInfo.

Shape: an async `bind()` inside the effect, `try/catch` + `console.warn`, an
`active` unmount guard, deps `[user]`.

## The gotchas (why the naive version is buggy)

1. **Re-derive isPro after binding.** logIn can change entitlements (the merge), so
   `setRcPro(proFromInfo(customerInfo))` after it — don't fire-and-forget. The
   update listener also catches it eventually, but inline = instant, no wrong-UI
   flicker.
2. **Different return shapes:** `logIn` → `{ customerInfo, created }` (wrapped);
   `logOut` → `customerInfo` (bare). Can't destructure `{ customerInfo }` from both.
3. **logOut THROWS if already anonymous** (`LogOutWithAnonymousUserError`). A fresh
   guest is already anonymous, so guard: `if (!(await Purchases.isAnonymous()))`.
   Only log out on a real identified→guest transition.
4. **`rcConfigured` TDZ trap:** the outer `const rcConfigured` is declared BELOW this
   effect. Using it in the effect BODY is fine (runs post-render), but putting it in
   the DEPS ARRAY crashes (deps are evaluated during render, before the const
   exists). So the effect reads `process.env.EXPO_PUBLIC_RC_TEST_KEY` directly.
5. **Ordering:** the configure effect (defined first, `[]`) runs before this one on
   mount, so `configure()` precedes `logIn()`. Don't logIn inside the configure
   effect.

## Why re-derive isPro when the listener already exists (the analogy)

Inline `customerInfo` = you ASKED a question (logIn/logOut) and RC ANSWERED you
directly — the result is in your hand NOW; throwing it away to wait would be silly.
The listener = a DOORBELL for surprises you didn't cause (renewal overnight, expiry,
a purchase on another device) — unpredictable timing.

Two reasons the listener alone isn't enough:
- **Timing:** it fires a beat later → a flicker where the UI still says "not Pro"
  right after signup/merge.
- **No guarantee:** logIn is an IDENTITY change, not strictly a "customer info
  updated" event — the listener may not fire for it at all.

So: inline check makes "right now" correct; listener keeps it correct forever after.
Belt AND suspenders.

## Must verify

`user.id` MUST be the stable Supabase **UUID**, not email/username — a changing
appUserID orphans purchases.

Related: [2026-08-06-subscription-manage-and-dev-override],
[2026-08-06-paywall-screen-and-entry-points], and the ladder in
[2026-08-06-daily-quota-and-signifier] (guest→account is a transition point for BOTH
RC identity and the daily quota counter).
