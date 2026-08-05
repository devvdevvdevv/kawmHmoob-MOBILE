# 2026-08-04 — "Not authenticated" uncaught rejections (guest-safety)

## Symptom
On certain pages: `ERROR Uncaught (in promise) Error: Not authenticated`, from
`updateProfile` and `logout` in `src/context/AuthContext.jsx`.

## Cause
- `updateProfile` did `if (!uid) throw new Error('Not authenticated')`. It's
  called by fire-and-forget UI handlers with no `.catch()`:
  - `app/settings.jsx` shows the **Dialect Picker to EVERYONE** — the guest guard
    only wraps the Account buttons, not the Picker. A guest changing the dialect
    → `updateProfile({dialectPreference})` → no session → throw → uncaught.
  - `src/components/account/ProfilePage.jsx` dialect Picker (only reachable when
    logged in, but a session can still expire mid-use → same throw).
- `logout` awaited `supabase.auth.signOut()` with no guard; signOut can reject
  when there's no session/offline → uncaught "Not authenticated"-style reject.

## Fix (src/context/AuthContext.jsx)
- **`logout`** now wraps `signOut()` in `try/catch` and always `setUser(guestUser)`.
  Logging out must always succeed and land at guest, regardless of signOut errors.
- **`updateProfile`** no longer throws when there's no session. Instead it applies
  the user-facing fields (username, displayName, email, dialectPreference) to
  LOCAL state only and returns. So a guest's dialect choice reflects in the UI for
  the session; server-only fields (onboardedAt, age, …) simply don't persist
  without an account. No uncaught rejection either way.

Validated with `npx expo export --platform web` (clean). Self-healing: a
logged-in user whose session expired gets a local update instead of a red crash.

## Follow-up worth considering (not done)
- `settings.jsx`: for guests, the dialect change is now in-memory only and lost on
  relaunch (guests have no persisted profile). If guest dialect should survive
  restarts, persist it via `storage.js` like guest progress. Low priority.
