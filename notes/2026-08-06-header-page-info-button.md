# Header "i" page-info button + swipeable modal (2026-08-06)

Every screen gets an info ("i") button in the top-right of the global header that
opens page-specific help. Separate from the one-time onboarding `InfoModal` notices
(useOnce ribbons) — this is on-demand, button-triggered.

## How it works (no per-page wiring)

- **Registry** — `src/data/pageInfo.js`: route → `{ emoji, title, body }` OR
  `{ slides: [...] }`. `getPageInfo(pathname)` does longest-PREFIX-wins, so nested
  routes inherit their section (`/speak/group/...` → `/speak`). Adding help for a
  page = one registry entry.
- **Header** — `GlobalHeader.jsx` reads `usePathname()`, looks up the info, renders
  the `InfoIcon` button (hidden when a page has no entry) + the modal. Because the
  header renders once globally, this covers every screen with zero per-page code.

## Swipeable multi-slide modal

- **`src/components/common/PageInfoModal.jsx`** — one slide = a plain notice;
  multiple slides = a horizontally swipeable pager with dots + Back/Next (works by
  touch AND on web without swipe). An always-visible "×" in the top-right corner
  closes from any slide (plus onRequestClose for Android-back/web-Esc). Colors
  inlined from theme tokens (same reason as
  `InfoModal` — theme vars don't cascade into a native `<Modal>`). Slide width is
  seeded from `Dimensions` then corrected via onLayout to avoid a first-frame flash.
- Header normalizes single-page info to `[pageInfo]`, so both cases use this one
  component. (The old single-notice `InfoModal` is still used for onboarding ribbons
  elsewhere — unchanged.)

## Hub pages use slides (real sub-sections, not generic copy)

- `/words` → 5 slides: Words overview / Word practice (SRS) / Quizzes / Reading /
  Sentence builder (matches the actual `/words` drill tiles).
- `/reference` → 4 slides: Reference / Consonants & Vowels / Tones / Search (Search
  called out as the key tab).
Copy also reinforces the free/Pro model (tones free, notebook = Pro, per-day limits).
