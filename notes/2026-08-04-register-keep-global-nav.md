# Keep global nav on the Register page (2026-08-04)

## Change

The global header and bottom tab bar were hidden on `/register` via a `HIDE_ON`
list. Removed `/register` from that list in both:
- `src/components/GlobalHeader.jsx` → `HIDE_ON = ['/login', '/onboarding']`
- `src/components/GlobalTabBar.jsx` → `HIDE_ON = ['/login', '/onboarding']`

So the header + tab bar now stay visible on the register page (a user can still
navigate the app while creating an account). `/login` and `/onboarding` remain
full-screen (still hidden).

## No layout fix needed

`app/register.jsx` already wraps its content in `TabScreen`, which pads for both the
header (top) and the floating tab bar (bottom) — so the form clears the now-visible
nav with no overlap.

## Left intentionally unchanged

`WelcomeTour`'s own `HIDE_ON` still includes `/register` — we don't want the
first-run tour popping over the sign-up form; only the header/tab-bar nav returns.
