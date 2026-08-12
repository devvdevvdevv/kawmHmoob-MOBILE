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

## Multi-slide modal (one slide at a time + Back/Next)

- **`src/components/common/PageInfoModal.jsx`** — renders ONE slide at a time;
  multiple slides = dots + Back/Next; single slide = just "Got it". Colors inlined
  from theme tokens (theme vars don't cascade into a native `<Modal>`, and the
  shared `<Button>` is unreliable there — same rule as InfoModal).
- Header normalizes single-page info to `[pageInfo]`, so both cases use this one
  component. (The old single-notice `InfoModal` is still used for onboarding ribbons
  elsewhere — unchanged.)

### ⚠️ Why NOT a horizontal-swipe pager (native bug we hit)

First version used a horizontal `<ScrollView pagingEnabled>` for touch-swipe. On the
DEV BUILD (native) the footer buttons vanished — no "Got it", nothing. Cause: **a
horizontal ScrollView grows to fill its parent's height on native**, so it ate all
the card's vertical space and pushed the footer past the card's `overflow:hidden`
edge → clipped/invisible. Web flexbox sized it to content, so it looked fine there —
a web-vs-native divergence.

Fix: dropped the horizontal ScrollView. Now it mirrors the InfoModal layout —
a VERTICAL ScrollView for the slide body + a footer sibling with `marginTop`.
Navigation is Back/Next + dots instead of touch-swipe. If real swipe is wanted
later, use `react-native-gesture-handler` (already a dep), NOT a raw ScrollView.

### ⚠️⚠️ The REAL root cause (round 2): flexShrink default differs web vs native

Even after the vertical rewrite, buttons were STILL invisible on the dev build but
fine on web. Cause: **`flexShrink` defaults to `1` on web (CSS) but `0` in React
Native / Yoga.** In a `maxHeight` modal card (column) holding a `<ScrollView>` +
footer, with flexShrink 0 the ScrollView refuses to give up height, so it fills the
card and shoves the footer off the bottom edge → invisible. Web's default of 1 let
the ScrollView shrink, so the footer fit — which is why it only broke on mobile.

**Fix: `style={{ flexShrink: 1 }}` on the ScrollView** (+ `flexShrink: 0` on the
footer). Applied to BOTH `PageInfoModal` and `InfoModal` (same structure, same bug).

RULE (write this on your heart): **any RN modal with a scroll body + a footer in a
maxHeight card MUST put `flexShrink: 1` on the scroll body, or the footer vanishes
on device.** This is the #1 "works on web, broken on the build" modal trap.

## Hub pages use slides (real sub-sections, not generic copy)

- `/words` → 5 slides: Words overview / Word practice (SRS) / Quizzes / Reading /
  Sentence builder (matches the actual `/words` drill tiles).
- `/reference` → 4 slides: Reference / Consonants & Vowels / Tones / Search (Search
  called out as the key tab).
Copy also reinforces the free/Pro model (tones free, notebook = Pro, per-day limits).
