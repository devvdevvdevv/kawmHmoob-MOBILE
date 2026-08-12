# Launch prep: account features, readings gate, quiz UI, eas env (2026-08-06)

Batch of changes getting v1 ready for the Play Store (free release; Speak + monetization
already gated off — see [2026-08-06-v1-launch-flags-speak-locked-monetization-off]).

## Account features (ProfilePage + AuthContext)

- **Change username** — inline edit in the profile header (tap "Edit username").
  Strips spaces as you type, validates non-empty, calls `updateProfile({ username })`.
  Maps the DB unique-index violation to "That username is taken."
  - **Rate-limited to once every 14 days** (`USERNAME_COOLDOWN_DAYS`). The last-change
    timestamp is stored **locally** per user (`kawmhmoob.username.lastChanged.<uid>`,
    via `lib/storage`); when in cooldown the Edit link is replaced by "Change again in
    Nd". ⚠️ Local = per-device, so a reinstall/clear resets it. For a hard,
    unbypassable gate later, add a `username_changed_at` column to `profiles` and check
    it server-side (or reject in an RPC).
- **Delete-account button restyled** — was a bare red text link; now a bounded
  "Danger zone" card (red-tinted) with an explanation + a bordered button carrying a
  new `trash` icon (added to `Icon.jsx`).
- **Delete account** — `AuthContext.deleteAccount()` (new) calls a Supabase **RPC
  `delete_user`**, then signs out → guest. UI: a "Danger zone" card → a dedicated
  **`DeleteAccountModal`** that requires **typing your exact username to confirm**
  (Delete button disabled until it matches) → `router.replace('/')`. The modal uses
  safe-area padding, no statusBarTranslucent, and static styles (the button-visibility
  rules).
  ⚠️ **YOU MUST CREATE THE RPC in Supabase or Delete will error.** SQL (in the
  `deleteAccount` comment too):
  ```sql
  create or replace function public.delete_user() returns void
  language sql security definer set search_path = '' as $$
    delete from auth.users where id = auth.uid();
  $$;
  grant execute on function public.delete_user() to authenticated;
  ```
  `profiles`/`progress` cascade via their FK to `auth.users`. **Play REQUIRES account
  deletion for apps with accounts** — this is a submission requirement, not optional.
- **Log out confirm → success modal** — "Log out?" `ConfirmModal` → "Logged out"
  `InfoModal` → the actual `logout()` + `router.replace('/')` runs on the success
  modal's dismiss (LAST), so the guest re-render doesn't unmount the modal mid-show
  (the gotcha from `learning/ui-patterns/logout-confirm-success-modal-lesson.md`).

## Username: no spaces (register)
`RegisterForm` username field strips spaces on input (`v.replace(/\s/g, '')`). Same
strip on the profile edit. (Matches the DB's case-insensitive unique username index.)

## Readings hidden for non-dev (chose "Both")
Every reading surface is now `__DEV__`-only (visible in dev builds, hidden in release):
- Learn hub — `units.filter(u => __DEV__ || u.id !== 'readings')`.
- Home → Explore — filters out the `/learn/readings` item.
- Words hub — the "Reading & comprehension" tile wrapped in `{__DEV__ && …}`.
- Search — readings only indexed `if (__DEV__)` in `GlobalSearch.buildIndex`.
- Deep-link guards: `app/reading.jsx` and `app/learn/[unitId]/index.jsx` (readings)
  `<Redirect>` away when `!__DEV__`.

## Dictionary: hide audio path for non-dev
`WordDetail` "Audio file" debug field wrapped in `{__DEV__ && …}`. No admin/role system
exists, so `__DEV__` is the gate (hidden in release for everyone).

## Quiz page UI
`QuizMenu`: cards redesigned to the icon-chip language — `zap`/`lock` chip →
title + 1-line desc + question count → best-score pill or chevron. Added an overall
progress bar under the heading. New `lock` icon in `Icon.jsx`. Replaced 🔒/📖/✓ emoji.

## Season Pass data — more realistic, still placeholder
`data/battlepass.js`: rebalanced so most rewards are **deliverable in-app** (streak
freezes, XP boosts, themes, badges, bonus quiz/word/reading packs) and only ~4
partner **coupons** remain (invented brands, clearly flagged placeholder). Copy made
concrete. Still honest: no real partnerships.

## eas.json — env now bundles into builds
Added `env` to all profiles. `production` = Supabase URL + anon key only (RC excluded →
built app stays mock/free). `development`/`preview` also carry the RC test key. These
are `EXPO_PUBLIC_` (ship in the bundle anyway; anon key is publishable) so committing
is safe. Fixes the "built app has no keys" trap.

## Still to do for the actual submission
- Create the `delete_user` RPC in Supabase (above) — Delete won't work without it.
- Privacy policy URL + Play Data-safety form (accounts = required).
- Store listing assets; production AAB.
