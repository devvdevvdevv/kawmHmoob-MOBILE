# Onboarding + progressive disclosure (first-run tour, one-time notices) (2026-08-04)

Goal: make a 20-page app digestible for a first-time user, and stop persistent
warning ribbons/banners from eating space on every visit. Strategy = **teach once,
up front; then get out of the way.**

## New building blocks

### `src/lib/useOnce.js` — "show this once" flags
`const { seen, ready, markSeen } = useOnce('some-id')`. Persists a
`{ [id]: true }` blob in AsyncStorage, keyed per **install** (not per user — a
guest signing in shouldn't replay onboarding), cached in memory so many hooks share
one read. `ready` gates rendering so a one-time modal doesn't FLASH before we've
read storage. `resetOnceFlags()` wipes them (for testing / a future "replay intro").

### `src/components/common/InfoModal.jsx` — one-time notice
A themed single-notice dialog (emoji + title + paragraph(s) + a "Got it" button,
optional secondary action). Colors inline from theme tokens (NativeWind text-* is
unreliable here). This is the **ribbon replacement**.

### `src/components/onboarding/WelcomeTour.jsx` — first-run tour
A multi-step modal, mounted globally in `_layout` (over every screen). Steps are
data: 👋 welcome → 🧩 the fundamental (word = consonant+vowel+tone) → a step each
for 📖 Learn / 🎤 Speak / 🃏 Words / 🔡 Reference → ☰ Home & menu → (guests only)
✨ create a free account. Back / Next / Skip + progress dots; "Start learning" on
the last step. Uses `useOnce('welcome-tour')`, suppressed on /login /register
/onboarding routes. The account step folds the old GuestBanner nudge into the tour.

## Conversions

- **Speak `BetaRibbon` → one-time `InfoModal`** (`app/(tabs)/speak.jsx`): the
  "tone scoring is experimental" note was a persistent ribbon atop the page; now it
  shows once on first visit (`useOnce('speak-beta')`), then never takes space again.
- **Home `GuestBanner` removed** (`app/(tabs)/index.jsx`): the account nudge now
  lives in the tour's guest step + the drawer's always-there account block, so the
  space-eating banner is gone.
- **Left as-is:** `app/tone-eval.jsx`'s BetaRibbon — that page is an honest
  placeholder and the ribbon IS its content, not chrome atop real content.

## Why this reads as "more digestible"
- One guided pass explains the map (fundamentals + what each tab does) instead of
  dropping the user into 20 pages cold.
- Warnings surface once, contextually, then disappear — no permanent banners.
- Nothing repeats (per-install `useOnce`), and nothing flashes (the `ready` gate).

## Tour button styling — the white-button saga (resolved)

The tour's primary "Next →" button kept rendering **white/invisible on the cream
card**. Two real causes stacked:

1. **RN `<Modal>` is a separate native root** — the theme CSS variables set on the
   app root do NOT cascade into it, so NativeWind's `bg-clay-600` class produced no
   background. (Fixed the shared `Button` to set bg/border/text INLINE from tokens —
   see [[nativewind-text-color-inline]].)
2. **Stale bundle on the shared `Button`** — even after fixing `Button.jsx`, Metro
   kept serving a cached copy (shared modules imported everywhere are the ones HMR
   misses), so the fix "didn't show".

**Final resolution:** the tour buttons no longer use the shared `Button` at all.
They're **raw inline `Pressable`s in `WelcomeTour.jsx`** with the brown set directly
(`backgroundColor: primaryBg` = `rgb(--c-clay-600)`, computed in-file like the
progress dots). Because the fix lives in the same file the author is editing, it
reloads normally — no dependency on the cache-prone shared component. Next → is now
a big `flex:1` brown bar; Back is outlined; the account row has a brown
"Create free account".

Lesson: for a button that MUST render correctly inside a modal on first try, inline
the styles in-place rather than routing through a shared, cache-prone component.

## ⚠️ TESTING MODE is ON (revert before shipping)

`src/lib/useOnce.js` has `const TESTING = true`. While true, flags are NOT persisted
to storage — the tour + one-time notices **reappear on every fresh launch** (they
still dismiss for the current session). This is intentional for now so they're easy
to see during development. **Set `TESTING = false` before release** to make them
truly one-time again. Buttons in the tour/InfoModal were also bumped to `size="lg"`
for prominence.

## Extending it
- Any new "explain this once" moment: `const x = useOnce('my-id')` +
  `<InfoModal visible={x.ready && !x.seen} … onPrimary={x.markSeen} />`.
- A "Replay the intro" settings row: call `resetOnceFlags()` (or just clear
  `welcome-tour`) and the tour returns on next launch.

## Verify
`expo start -c` on a fresh install (or after `resetOnceFlags()`): the tour appears
first; stepping through / Skip dismisses it for good. Visit Speak → the beta notice
pops once. Home no longer shows the guest banner. Reopen the app → nothing repeats.
