# Theming (light/dark/neon), header redesign, flashcard flip (2026-07-25)

Three JS-feature/parity items in one pass. The big one is **theming**; the header
redesign and flashcard flip build on it.

---

## 1. Theming — light / dark / neon (the token engine)

The web app has three themes driven by CSS variables that flip on `<html>`; the
palette is defined once and every `bg-cream-50` / `text-stone-900` restyles. RN
had none of this (light-only, static hex). NativeWind v4 supports the SAME model
via `vars()`, so this is a faithful port.

**How it works now:**

1. **`tailwind.config.js`** — colors changed from static hex to
   `rgb(var(--c-NAME) / <alpha-value>)` (a `v()` helper), exactly like the web
   config. Themed families: `cream, clay, blush, seafoam, ocean, stone, success,
   danger`. Screens also use `emerald`/`red`/`orange` by literal name (quiz
   right/wrong, flashcard, practice, streak, BetaRibbon). These are ALSO themed
   now (see the colors-execution fix below): `emerald` aliases `success`, `red`
   aliases `danger`, and `orange` got its own themed 200/900 tokens — so every
   color inverts in dark/neon.

2. **`src/lib/themes.js`** — AUTO-GENERATED from the web `index.css` (a node
   script parsed the `:root` / `.dark` / `[data-theme='neon']` blocks → 50 tokens
   each) to avoid hand-transcribing ~150 values. Exports:
   - `THEME_TOKENS` — `{ light, dark, neon }` of raw `"R G B"` triplets.
   - `THEME_VARS` — each wrapped in NativeWind `vars()` (apply as a style).
   - `THEME_BG` — the seafoam-300 page bg as a concrete `rgb()` per theme, for
     places that need a raw color (Stack contentStyle, splash).
   Re-generate from `index.css` if the web palette changes.

3. **`src/context/ThemeContext.jsx`** — the RN equivalent of the web `useTheme`.
   Holds `theme` (`'light'|'dark'|'neon'`), `cycle()`, `setTheme()`; persists to
   AsyncStorage (`kawmhmoob.theme`) via `storage.js`; restores on mount. `useTheme()`
   hook.

4. **`app/_layout.jsx`** — wraps everything in `<ThemeProvider>`, and the shell
   (`ThemedShell`) applies `style={THEME_VARS[theme]}` on the root View. That's
   the RN equivalent of setting CSS vars on `<html>`: NativeWind cascades the vars
   down the tree, so every className color below restyles. Also sets the Stack
   `contentStyle` bg to `THEME_BG[theme]` (react-navigation paints its own grey
   otherwise) and the `StatusBar` style (`dark` content on light, `light` on
   dark/neon).

5. **`GlobalTabBar` + `GlobalHeader`** made theme-driven: backgrounds/borders via
   themed classNames (`bg-cream-50`, `bg-ocean-200`, `border-cream-200`), text via
   `text-stone-*`. The tab bar's active-indicator accent and icon stroke colors
   now resolve from `THEME_TOKENS[theme]` (a `tok(theme, '--c-x')` helper) instead
   of the old hardcoded light/dark hex map — so they work for all three themes,
   including neon.

**Verified (web):** light renders unchanged (no regression); flipping the default
to dark showed the full inverted palette (charcoal surfaces, warm-white text,
brighter clay), and the toggle glyph switched ☀️→🌙. Neon uses the identical
`THEME_VARS` swap with its own values — verified by mechanism, not screenshotted.

**Test gotcha:** to screenshot a non-light theme you must change BOTH the
`useState('light')` default AND the `loadJSON(KEY, 'light')` fallback — the mount
effect loads the persisted value (fallback light) and would otherwise override the
default. (Both reverted to `light` after testing.)

---

## 2. Header redesign (`GlobalHeader`)

Rebuilt to be theme-aware and to address "make it more better":

- **Crisp SVG line icons** (2026-07-27 refinement) — the emoji were swapped for
  the web Navbar's exact monochrome line icons, ported path-for-path with
  `react-native-svg`: theme toggle (Sun/Moon/Spark by theme), Tiers (season pass),
  Trophy (leaderboard), Search, Settings, Person (account). Grouped by thin
  **dividers** like the web. This is what makes it read as "in tune" with the
  original rather than casual.
- **Theme-aware icon colors** — stroke color is `tok(theme, '--c-stone-800')`
  (inactive) / `'--c-clay-600'` (active route), so icons restyle with the theme.
- **Two-tone wordmark** — "Kawm" (ink) + "Hmoob" (clay), Nunito, → Home. (The
  web's actual logo is a wide ~6:1 two-tone SVG whose light-blue half is
  low-contrast on the light `ocean-200` header — so the wordmark is kept instead;
  the SVG could be recolored + swapped in later.)
- All nav is `router.navigate()` on `Pressable`s, never `<Link>` — see the
  `<Link>` + style-array crash gotcha in `2026-07-25-global-tab-architecture.md`.

Note: the cluster is dense (2 badges + 6 icons + wordmark). On the react-native-web
PREVIEW the rightmost icons clip (the standing RNW crop artifact); they fit under
Yoga on a device, same as the web's own mobile header. If a real phone shows them
tight, drop one (leaderboard is reachable from the pass page).

---

## 3. Flashcard 3D flip (`vocabulary/Flashcard.jsx`)

Was an instant `useState` swap; now a real 3D flip like the web:
- Two stacked `Animated.View` faces, each rotated about Y (`rotateY`
  `0°→180°` front, `180°→360°` back) with `backfaceVisibility: 'hidden'`, driven by
  one `Animated.spring` (`useNativeDriver`). A `perspective: 1000` transform gives
  it depth.
- The card face visuals (bg/border) use **theme tokens inline**
  (`THEME_TOKENS[theme]`) rather than className — NativeWind on `Animated.View` is
  less certain, and inline tokens keep the faces themed reliably. Inner text still
  uses themed classNames.

---

## 4. Colors-execution fix (follow-up)

After the theming landed, two color bugs showed up:

1. **Dropped clay shades.** The var config only kept `clay-500/600/700` (the web's
   set), but `WordDetail`'s "saved" badge used `clay-100/300/800` — now undefined,
   so the badge lost its colors. Fixed by switching that badge to themed opacity
   shades (`bg-clay-600/15 border-clay-600/40 text-clay-700`).

2. **Feedback colors didn't invert in dark/neon.** `emerald`/`red`/`orange` were
   left static, so on a dark card the "Mark Known" button glared bright mint, the
   streak pill bright orange, etc. Fixed by making them themed:
   - `emerald` → aliases the themed `success` tokens; `red` → aliases `danger`
     (config-level `v('success-*')` / `v('danger-*')`). The 100/800 shades they use
     but success/danger lack map to the nearest step.
   - `orange` → new themed `--c-orange-200/900` tokens added to all three themes in
     `themes.js` (the web only used orange as literals, so these are hand-set:
     light = warm/pale, dark & neon = deep surface + pale text, matching the invert
     pattern).

   Verified in dark: "Mark Known" is now a deep green, the streak pill a deep amber;
   light is unchanged (success-200 ≈ the old emerald mint). Nothing in the code
   changed — the `emerald-*`/`red-*`/`orange-*` classNames just resolve to themed
   vars now.

---

## Verify

```bash
npx expo start --clear --port 8220
# bundle 200, no theme/header/flashcard resolution errors.
# Home (light) unchanged; tap ☀️/🌙/✨ in the header to cycle themes — whole app
# restyles and the choice persists. Flip a flashcard (Review/Words session) — 3D flip.
```

Last verified 2026-07-25: web bundle 200; light no regression; dark flip confirmed
by screenshot; default reverted to light. Device/Expo Go pass still recommended
(true confirmation of neon, the flip animation, and header icon fit).

## Watch out
- Re-generate `themes.js` from `index.css` if the web palette changes; don't hand-edit values.
- `emerald`/`red`/`orange` ARE themed now (alias success/danger + orange tokens) — don't revert them to static hex.
- Don't run `npm audit fix --force`.
