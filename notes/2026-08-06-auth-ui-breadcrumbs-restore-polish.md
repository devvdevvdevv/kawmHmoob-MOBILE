# Auth UI (eye + confirm), mobile breadcrumbs, restore button (2026-08-06)

A batch of UI polish + a leaderboard lesson. Builds on the icon/hierarchy system
([2026-08-06 icon rollout] via `src/components/ui/Icon.jsx`).

## Password fields: eye toggle + confirm

- **Shared `src/components/ui/PasswordField.jsx`** — password input with a show/hide
  **eye** toggle. **Self-manages its own `show` state** (callers pass only
  value/onChange + optional `hint`), eye sits inside the border via a flex row (no
  absolute positioning), spreads `...rest` for extra TextInput props, and has an
  `accessibilityLabel`. Optional `hint` shows a validation message and turns the
  border red.
- **RegisterForm** — added a **Confirm Password** field with LIVE match validation:
  red border + "Passwords don't match" as you type, Create button disabled on
  mismatch, and a hard guard in `submit()` before calling `register`. Uses the shared
  `PasswordField`.
- **LoginForm** — uses the shared `PasswordField` too (eye toggle on login).
- Both forms wired; `PasswordField` is the single source for password inputs.
- Icons added to `Icon.jsx`: `eye`, `eyeOff`, `arrowLeft`.

⚠️ Styling uses `className` / static objects only — NOT function styles (see
[2026-08-06-nativewind-drops-function-style-invisible-buttons]).

## Breadcrumbs — redesigned for mobile

`src/components/common/Breadcrumbs.jsx`: was a cramped underlined text trail
(desktop-y). Now a **tappable back PILL that names its destination** (`← Words`,
rounded, real touch target, `active:` state) + a subtle chevron (`›`) trail beneath
for context (muted, no underlines, current page bold). Uses the shared `Icon`
(`arrowLeft`), dropped the old inline SVG + `useTheme` plumbing.

## Restore Purchases button

`app/paywall.jsx`: changed from `variant="ghost"` (outlined) to
`variant="secondary" size="lg"` — filled `stone-900`, rounded, in-scheme, and
hierarchically secondary to the clay Buy buttons. (Swap to `variant="primary"` if a
clay/brand fill is wanted instead.)

## Leaderboard lesson (separate, not yet built)

Wrote `learning/supabase-leaderboard-lesson.md` — step-by-step for the user to build
themselves. Key insight: XP already syncs to the `progress` table, so the board is
mostly a read-only Supabase VIEW joining `profiles` + `progress` exposing only
username + xp (NEVER email). Still TODO by the user.
