# 2026-08-04 — Supabase fixes + forced onboarding gate + onboarding restyle

Four related changes: two Supabase crashes fixed, plus onboarding is now
mandatory for new accounts and restyled to the app's color scheme.

## 1. `ReferenceError: window is not defined` (web export)

**Symptom:** `npx expo export --platform web` (and any static prerender) crashed
in `AsyncStorage.getValue → SupabaseAuthClient._initialize`.

**Cause:** the web build uses `output: "static"`, so screens are prerendered in
**Node**, where `window`/`localStorage` don't exist. Our Supabase client was
handed `@react-native-async-storage/async-storage` as its auth storage adapter,
and AsyncStorage touches `window` on load → crash during prerender.

**Fix** ([src/lib/supabase.js](../src/lib/supabase.js)): only use AsyncStorage on
native. On web, leave `storage` undefined and let supabase-js pick its own adapter
(localStorage in a real browser, in-memory no-op during SSR/prerender).

```js
import { Platform } from 'react-native'
// ...
storage: Platform.OS === 'web' ? undefined : AsyncStorage,
```

Verified: `npx expo export --platform web` now completes and emits `index.html`.

## 2. `duplicate key value violates unique constraint "profiles_pkey"` (signup)

**Symptom:** creating a new account crashed *before* the username could be set.

**Cause:** the DB has a `handle_new_user()` trigger (SECURITY DEFINER) that
**already inserts** the `profiles` row on signup, from `raw_user_meta_data`. Our
`register()` was *also* doing a plain `.insert()` of the same row → primary-key
collision.

**Fix** ([src/context/AuthContext.jsx](../src/context/AuthContext.jsx)
`register`):
- Pass the profile fields as **signup metadata** (`options.data`) so the trigger
  populates the row atomically (username, display_name, dialect_preference).
- Only write from the client with **`.upsert(..., { onConflict: 'id' })`** — and
  only when a session already exists (RLS needs `auth.uid() === id`). If email
  confirmation is on there's no session yet, so we return
  `{ pendingConfirmation: true }` and let the trigger's row stand.

Net: no more double-insert; the username/display name land reliably.

## 3. Forced onboarding gate (unskippable except via Skip/Save)

**Requirement:** a new account must land on `/onboarding`; they can't wander off
until they either fill it in or explicitly Skip.

**Mechanism:** the `profiles.onboarded_at` column (null = never onboarded) is the
source of truth. `rowToUser` already maps it to `user.onboardedAt`, and
onboarding's `finish()` stamps `onboardedAt: new Date().toISOString()` on both
Save and Skip.

**New `OnboardingGate`** ([app/_layout.jsx](../app/_layout.jsx)), rendered inside
`ThemedShell`:

```jsx
function OnboardingGate() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() || ''
  useEffect(() => {
    if (loading || !user || user.isGuest || user.onboardedAt) return
    const exempt = ['/onboarding', '/login', '/register']
    if (exempt.some((r) => pathname.startsWith(r))) return
    router.replace('/onboarding')
  }, [user, loading, pathname, router])
  return null
}
```

- Guests are exempt (they have no profile to fill).
- Any navigation away from `/onboarding` by an un-onboarded user redirects right
  back → effectively unskippable.
- `login`/`register` are exempt so auth flows aren't hijacked mid-way.
- Because it keys on `onboardedAt`, logging out and back in with an un-onboarded
  account correctly re-forces onboarding (the earlier bug where onboarding didn't
  reappear).

## 4. Onboarding UI restyled to the app palette

[app/onboarding.jsx](../app/onboarding.jsx):
- Dropped the `bg-gradient-to-b from-stone-100 to-cream-50` wrapper and the
  **nested `ScrollView`** — `TabScreen` already scrolls, so nesting caused a
  double scroll. Removed the now-unused `ScrollView` import.
- Card: `rounded-2xl bg-white/90 shadow-sm border border-cream-200` →
  `rounded-lg bg-cream-50 border-2 border-cream-200 p-6` (matches the app's cream
  surface + bold-border look).
- Inactive `Pill`: `bg-white` → `bg-cream-100`.
- `TextInput`: `border` → `border-2`; dropped `shadow-sm` and `focus:*` (web-only
  no-ops in RN).

## Note on `.upsert` vs the trigger

The trigger is the primary writer at signup; the client upsert is a
belt-and-suspenders update for the session case. If you ever change the profile
columns, update **both** the SQL trigger (`instructions/supabase-schema.sql`) and
`register()`/`updateProfile()`.
