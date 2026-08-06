# 2026-08-05 — Hardening uncaught promise rejections (async error handling)

Found in the pre-RevenueCat audit: several Supabase async calls were
"fire-and-forget" (called but never awaited/caught), so a network/RLS failure
became an **unhandled promise rejection** → red-box in dev. Same class as the
earlier "Not authenticated" bug. Hardened before adding RevenueCat's async.

## The concept
An `async` function returns a Promise that either **resolves** or **rejects**
(something `throw`ew inside). Every rejection needs a handler — `try/catch`
around an `await`, or `.catch()` on the promise. If a rejection has no handler,
JS raises an "unhandled promise rejection" and RN's LogBox red-boxes it.
"Fire-and-forget" = calling async without awaiting or `.catch()` → the trap.

Decision rule for the catch block: is the error **critical** (surface it) or
**best-effort** (log + continue)? Don't reflexively swallow — a silent catch
hides real bugs.

## The three fixes (all in this app)
1. **`updateProfile` fire-and-forget** — `src/components/account/ProfilePage.jsx`
   (dialect Picker) and `app/settings.jsx` (dialect Picker). The `onChange`
   returned the promise into the void. Added `.catch((e) => console.warn(...))`.
   Best-effort: a failed dialect save can be retried, so warn + continue.
2. **`saveProgress` in the debounced save effect** — `src/context/ProgressContext.jsx`.
   The `setTimeout(() => saveProgress(...), 500)` callback ignored the promise.
   Wrapped: `saveProgress(...).catch((e) => console.warn('[progress] save failed', e))`.
   Best-effort: a dropped save retries on the next state change.
3. **`loadProgress` `.then` with no `.catch`** — `src/context/ProgressContext.jsx`
   hydrate effect. Added a `.catch` that logs AND calls `setHydrated(true)`.
   The subtle part: if load fails and you DON'T set hydrated, the app hangs on
   "loading" forever and the save effect (which bails on `!hydrated`) never runs
   → silent no-persist. State falls back to `initialState`, which is fine.
   **Failing gracefully = leaving the app usable, not just not-crashing.**

## Mental model (reuse this for RevenueCat)
- Awaited async → `try/catch`. Chained → end with `.catch()`. Fire-and-forget →
  still needs `.catch()`.
- `Purchases.purchasePackage()` / `getOfferings()` / `restorePurchases()` are all
  async and CAN reject (esp. `userCancelled` on purchase — swallow that one, it's
  normal; rethrow real errors). Apply the same discipline.

Implemented by the user (taught, then self-authored). Verified by reading the
edits; hot-reloaded on the live dev server.
