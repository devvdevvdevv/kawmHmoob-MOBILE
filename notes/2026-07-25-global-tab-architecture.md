# The global tab bar & app shell — how it works, end to end (2026-07-25)

This is the deep-dive companion to `2026-07-23-tab-navigation-fix.md` (the
history of *why* we pivoted) and `2026-07-25-full-webapp-port.md` (the pages).
This file explains the **shell** — the background + the one persistent bottom
nav that every screen shares — meticulously, so the next person can change it
without re-deriving it.

---

## 1. The problem it solves

Two complaints, one root cause:

1. *"I can't get to the tabs from inside a lesson."*
2. *"The CSS and spacing are wrong."*

The web app wrapped **every** route in a single `<Layout>` that supplied both
the persistent bottom nav (`<PrimaryNav>`) and the page background/spacing. The
RN port had that `Layout` commented out, and instead used Expo Router's
`<Tabs>` navigator. `<Tabs>` only draws its bar for the screens **inside** the
`(tabs)/` folder — so the moment you opened a lesson (`/learn/:unit/:lesson`),
account, quiz, etc., the bar disappeared and there was no way back. And with no
`<Layout>`, there was no shared background or spacing either.

So both problems are the same missing piece: **a shell that wraps the whole
app.** We rebuilt it as thrxxxxxxee cooperating files.

---

## 2. The mental model: a SHELL, not a navigator

The key idea: the bar is **not** part of any navigator. It's a plain component
the root layout renders **as a sibling of the `<Stack>`**, floating on top of
whatever screen is showing.

```
app/_layout.jsx  (the shell)
└─ <View bg=#B0E0E6>            ← one page background, painted once
     ├─ <Stack>                ← the screens (contentStyle also #B0E0E6)
     ├─ <GlobalHeader />       ← status/identity bar, floats at TOP
     └─ <GlobalTabBar />       ← primary section nav, floats at BOTTOM
```

**Two nav surfaces, mirroring the web app** (Navbar + PrimaryNav): the bottom
bar is primary section navigation (Home/Learn/Speak/Vocabulary/Reference); the
top header is identity + status + utilities (level, streak, pass, leaderboard,
search, settings, account). Both are absolute overlays (see §8).

Because the bar lives *outside* the Stack, it never unmounts when you push a new
screen. The Stack swaps screens underneath it; the bar just stays there and
re-reads the current URL to decide which tab is lit.

Contrast with Expo Router `<Tabs>`: there, the bar is *owned* by a tab navigator
and only exists for that navigator's direct children. That's exactly the
limitation we removed by **deleting `app/(tabs)/_layout.jsx`** — with no `<Tabs>`
layout, the five main screens became ordinary Stack screens (URLs unchanged),
and the bar became global.

The three files and their jobs:

| File | Job |
|---|---|
| `app/_layout.jsx` | The shell: paints the background, hosts the `<Stack>`, renders `<GlobalTabBar/>` once. |
| `src/components/GlobalTabBar.jsx` | The bar itself: which tab is lit, what a tap does, how it's drawn. |
| `src/components/TabScreen.jsx` | Per-screen wrapper: scroll + safe-area + bottom padding so content clears the floating bar. |

Data flow is one-directional and stateless: the **URL** is the single source of
truth. `GlobalTabBar` reads it with `usePathname()`; tapping a tab calls
`router.navigate()`, which changes the URL; the change re-renders the bar, which
re-computes the active tab. There is no local "selected tab" state to keep in
sync — the URL *is* the state.

---

## 3. `GlobalTabBar.jsx`, piece by piece

### 3a. The section config (the one thing you edit)

```js
const SECTIONS = [
  { id:'home',       to:'/',           label:'Home',       icon:HomeIcon,     ind:'stone',     match:(p)=> p === '/' },
  { id:'learn',      to:'/learn',      label:'Learn',      icon:BookIcon,     ind:'seafoam',   match:(p)=> p.startsWith('/learn') },
  { id:'speak',      to:'/speak',      label:'Speak',      icon:MicIcon,      ind:'clay',      match:(p)=> p.startsWith('/speak') },
  { id:'vocabulary', to:'/vocabulary', label:'Vocabulary', icon:CardsIcon,    ind:'blush',     match:(p)=> ['/vocabulary','/words','/quiz','/notebook','/review','/search'].some(r=>p.startsWith(r)) },
  { id:'reference',  to:'/reference',  label:'Reference',  icon:AlphabetIcon, ind:'creamTint', match:(p)=> ['/reference','/alphabet','/course'].some(r=>p.startsWith(r)) },
]
```

Each section has:

- **`to`** — where a tap navigates. This is a *route*, nothing more; the tab
  doesn't need to "own" a folder.
- **`match(pathname)`** — the important one. It decides when this tab stays
  **lit**, independent of where `to` points. This is what keeps the right tab
  highlighted on detail pages: a URL like `/learn/foundations/greetings` still
  makes **Learn** light up because `p.startsWith('/learn')` is true; `/quiz`
  and `/notebook` light up **Vocabulary** because they're in its match list.
  This mirrors the web `PrimaryNav`'s `match()` functions exactly — every page
  in the app belongs to a section.
- **`label`, `icon`** — what's drawn.
- **`ind`** — a token name (`stone`/`seafoam`/`clay`/`blush`/`creamTint`) for
  the little accent bar under the active tab. Resolved through `TOKENS` +
  `getColor()` so it's theme-aware (see 3d).

### 3b. Which tab is active

```js
const active = SECTIONS.findIndex((s) => s.match(pathname))
```

`findIndex` returns the **first** section whose `match` is true, or `-1` if none
match. Two consequences to remember:

- **Order matters.** If two sections' match functions could both be true for a
  URL, the earlier one wins. Keep matches mutually exclusive (they currently
  are) or order them most-specific-first.
- **`-1` is a valid state.** On a route no section claims (e.g. `/account`,
  `/settings`, `/pass`), `active === -1`: all tabs render inactive and the
  accent indicator is hidden (`opacity: 0`). That's intentional — those pages
  genuinely don't belong to a section, so nothing should look selected.

Note `home` uses `p === '/'` (exact), not `startsWith('/')` — otherwise Home
would match *every* URL and always win the `findIndex`.

### 3c. What a tap does

```js
onPress={() => router.navigate(s.to)}
```

`router.navigate()` (not `.push()`) is deliberate. `navigate` **reuses an
existing screen** already in the history instead of pushing a duplicate on top.
So bouncing Home → Learn → Home doesn't stack three screens; it behaves like a
tab switch. `push` would grow the stack forever.

### 3d. Theming & tokens

`useColorScheme()` gives `'light' | 'dark'`. `TOKENS` holds the two palettes;
`getColor(token, scheme)` maps an `ind` name to the actual hex for the current
theme. Active label text is `stone.900` (near-black / near-white); inactive is
`stone.700` (muted). Only the *accent indicator* uses the section color —
active **text** stays ink in both themes. That's a deliberate carry-over from
the web app: some accents (seafoam) fail contrast on the light background, so
**color marks the place, weight marks the state** (active label is `fontWeight
600`, inactive `500`).

The glass background is a translucent cream in light / translucent charcoal in
dark, so a hint of the page shows through.

### 3e. The active indicator (percentage-based)

```js
const tabPct = 100 / SECTIONS.length          // 20% for 5 tabs
// ...
<View style={[styles.indicator, {
  width: `${tabPct}%`,
  left:  `${(active >= 0 ? active : 0) * tabPct}%`,
  opacity: active >= 0 ? 1 : 0,
  backgroundColor: active >= 0 ? getColor(SECTIONS[active].ind, scheme).ind : 'transparent',
}]} />
```

The little accent bar sits in a 2px-tall track above the tab row and is
positioned by **percentage**, not pixels. Why: the tab row is a flexbox where
each `tabItem` is `flex: 1`, so each tab is exactly `1/5` of the width at *any*
screen size. A percentage `left`/`width` lines the indicator up with the active
tab automatically — no measuring, no `Dimensions`.

> Historical note: this used to compute `TAB_WIDTH = Dimensions.get('window').width / 5`
> **at module load**. On web that captured the wrong width (before layout), so
> the bar and indicator were sized wrong and the last tab got cut off. The
> percentage approach removed the dependency on any measured width entirely.

### 3f. Positioning, safe-area, and hiding

- **Floating:** `styles.tabBarContainer` is `position:'absolute'; bottom/left/
  right:0; zIndex:30`. It overlays content rather than taking layout space —
  which is *why* screens need bottom padding (see §4).
- **Safe area:** `paddingBottom: Math.max(insets.bottom, 8)` from
  `useSafeAreaInsets()` keeps the labels above the iPhone home indicator / Android
  gesture bar, with an 8px floor on devices that report 0.
- **Hidden on full-screen flows:** `HIDE_ON = ['/login','/register','/onboarding']`
  → `if (HIDE_ON.some(r => pathname.startsWith(r))) return null`. Those screens
  are meant to be distraction-free, so the bar renders nothing there.

### 3g. Icons

The five icons are inline `react-native-svg` components taking `{ filled, color }`.
`filled` (true only for the active tab) toggles a subtle fill on the glyph;
`color` is the active/inactive text color, so the icon and its label always
match. Kept inline (no icon library) so the bar is self-contained.

---

## 4. `TabScreen.jsx` — clearing the floating bar

Because the bar is `position:'absolute'`, it sits *on top of* page content. A
screen that ran its content to the bottom would have its last rows hidden behind
the bar. `TabScreen` is the shared wrapper that prevents that and also gives
every screen the same rhythm the web `<main>` had:

- a vertical `ScrollView` — so long screens scroll (many detail screens had
  **no** scroll before and were simply cut off).
- **top** clearance: `paddingTop = HEADER_CONTENT_HEIGHT + insets.top + 16` —
  clears the floating header AND the status bar/notch (so there's no separate
  `SafeAreaView` top edge; the padding already includes the inset).
- **bottom** clearance: `paddingBottom = TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 24`
  — clears the floating tab bar and the home indicator.
- `HEADER_CONTENT_HEIGHT` (52) and `TAB_BAR_HEIGHT` (62) are **exported by their
  components**, so these numbers never drift.
- content centered in a `maxWidth: 672` column (via the container's
  `alignItems:'center'`, not a self-width child — see the RNW note below).

**The contract:** any screen that should sit under the shared nav renders its
body inside `<TabScreen>`. Every content screen now does — the five tabs, the
lesson/unit/speak/words pages, and the detail screens (account, settings,
search, review, notebook, alphabet, course, quiz, vocabulary, login, register),
wrapped either at the route file (thin re-exports) or by swapping the outer
`<View>` for `<TabScreen>`.

---

## 5. `app/_layout.jsx` — the shell that ties it together

```jsx
<View style={{ flex:1, backgroundColor:'#B0E0E6', overflow:'hidden' }}>
  <Stack screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: '#B0E0E6' },  // see note
    animation: 'fade',
  }} />
  <GlobalHeader />   {/* absolute top overlay */}
  <GlobalTabBar />   {/* absolute bottom overlay */}
</View>
```

Two subtleties worth their own callouts:

- **Why `contentStyle` is `#B0E0E6` and not `transparent`.** react-navigation
  ships a default theme whose background is grey (`rgb(242,242,242)`). That grey
  card sits *on top of* the parent `<View>`, so a transparent `contentStyle`
  just reveals the grey — that was the "background is wrong" bug. Painting the
  screen background color directly on `contentStyle` wins. (We also set it on the
  outer `<View>` as a belt-and-suspenders base layer.)
- **`GlobalTabBar`/`GlobalHeader` are siblings of `<Stack>`, inside the
  providers.** They must be under the navigation context (so
  `usePathname`/`useRouter` work) but outside the Stack (so they don't belong to
  any screen). Rendering them right after the `<Stack>` in the same `<View>`
  satisfies both.

---

## 5b. `GlobalHeader.jsx` — the top status bar

The top counterpart to the tab bar, and the second of the two nav surfaces.
Where the bottom bar answers "which section am I in," the header answers "who am
I and what's my status," and holds the utility links. It mirrors the web
`Navbar.jsx`.

- **Layout:** an absolute overlay at `top:0` (symmetric with the tab bar at
  `bottom:0`), `zIndex:30`. Its container pads `paddingTop: insets.top` so its
  content sits below the status bar/notch; the bar itself is
  `HEADER_CONTENT_HEIGHT` (52) tall.
- **Contents:** left = brand ("Kawm Hmoob") → Home. Right cluster =
  `LevelBadge` (a clay "Lv N" pill — the one status number that's also a LINK,
  to `/pass`) + `StreakBadge` (🔥) + icon links 🏆 `/leaderboard`, 🔍 `/search`,
  ⚙️ `/settings`, and account (`👤` for guests, `@username` otherwise) → `/account`.
  The active utility gets a stone-800 pill, matching the web. (`XPBadge` is
  intentionally left off the header — like the web it would crowd the phone
  width; XP still shows on Home / the pass.)
- **Color:** `ocean-200` (`rgba(158,197,206,.96)`), a step DEEPER than the
  seafoam-300 page — a lighter bar would read as a gap, not a header (a lesson
  the web learned; see its Navbar comment).
- **New `LevelBadge`:** RN had `XPBadge`/`StreakBadge` but no `LevelBadge`. Added
  one that derives the level from `xp` via `levelFromPoints` (RN has no separate
  season-points bucket yet — same substitution as Leaderboard/BattlePass).
- **Hidden on** the same full-screen flows as the tab bar
  (`/login`, `/register`, `/onboarding`).
- Exports `HEADER_CONTENT_HEIGHT` so `TabScreen` can pad the top by exactly the
  right amount — the same contract the tab bar uses for the bottom.

Note the old `src/components/Navbar.jsx` (a stale two-row port that duplicated
section links) is NOT used — `GlobalHeader` replaces it.

---

## 6. How to change it (recipes)

- **Add a tab:** add one entry to `SECTIONS` with a `to`, a `match`, a `label`,
  an `icon`, and an `ind` token. That's it — no navigator registration, no
  folder. Make sure a screen exists at `to`. Keep `match` from overlapping other
  sections.
- **Remove / reorder tabs:** edit the array. The indicator auto-resizes
  (`100 / SECTIONS.length`) and re-positions; nothing else to touch.
- **Change what keeps a tab lit** (e.g. make `/pass` light up Vocabulary): add
  `'/pass'` to that section's `match` list.
- **Hide the bar on another route:** add its prefix to `HIDE_ON`.
- **Recolor an accent:** change the `ind` token on the section, or the hex in
  `TOKENS` (both light and dark).
- **Change the bar height / clearance:** edit `TAB_BAR_HEIGHT` — `TabScreen`
  reads it, so clearance stays in sync automatically.

---

## 7. Gotchas / caveats

- **`findIndex` = first match wins.** Overlapping `match` functions silently
  resolve to whichever section is earlier in the array.
- **`active === -1` is normal** on section-less pages; the indicator hides
  itself, all tabs read inactive. Don't "fix" it to force a highlight.
- **`router.navigate`, not `push`** — using `push` from the bar would stack
  duplicate screens.
- **react-native-web preview cropping.** In the browser preview, narrow widths
  can crop content on the right — a react-native-web ScrollView/flex artifact,
  not a device bug (Yoga wraps/shrinks correctly on a real phone). Confirm final
  layout on device / Expo Go, not just web screenshots.
- **Don't pass a `style` ARRAY through `<Link asChild>` on web.** expo-router's
  `<Link>` routes the child through a radix `Slot` + NativeWind `CssInterop`
  wrapper; on web a `style={[a, cond && b]}` array (esp. one containing a
  `false`) reaches react-dom unflattened and throws *"Failed to set an indexed
  property [0] on CSSStyleDeclaration"* — a full red-screen crash, not a warning.
  This bit `GlobalHeader`'s icon buttons. Fixes: navigate with
  `router.navigate(to)` on a plain `Pressable` (what the header + tab bar do
  now), or use `className` instead of a `style` array on the asChild child (what
  `LevelBadge` and the other `<Link asChild><Pressable>` sites do). The crash is
  web-only — native has no CSSStyleDeclaration — but it breaks the web preview
  entirely, so avoid the pattern.
