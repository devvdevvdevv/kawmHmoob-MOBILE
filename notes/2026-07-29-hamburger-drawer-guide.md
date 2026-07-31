# Building a left slide-in drawer (hamburger menu) — a guide (2026-07-29)

Goal: move user identity/status + utility links out of the header into a drawer
that slides in from the left, triggered by a ☰ in a slimmed header. This is a
teaching guide — the drawer is being hand-built, not generated.

## 1. IA — decide what each surface owns

| Surface | Owns |
|---|---|
| **Header** (slimmed) | ☰ hamburger (left) → opens drawer. Optional title/logo. |
| **Drawer** (new) | Identity + status (level, XP, streak, `@username` / Guest), and the utility links (Pass, Leaderboard, Search, Settings, Account, theme toggle). |
| **Tab bar** (unchanged) | Primary sections (Home/Learn/Speak/Vocabulary/Reference). |

Drawer = "who am I / my stuff." Tab bar = "where do I go." Don't overlap them.

## 2. Approach: custom overlay, NOT the navigator Drawer

Expo Router has a `<Drawer>` layout (`@react-navigation/drawer`), but this app's
shell is *custom root overlays* (`GlobalHeader` + `GlobalTabBar` are siblings of
`<Stack>`, not navigators). Using the navigator Drawer means restructuring routing
again (same fight as the old `<Tabs>`). Instead build a **custom drawer overlay**
just like `GlobalTabBar`: one component rendered at the root that animates itself.
Open/closed is ephemeral UI state → a **context**, not the router.

## 3. Architecture (4 pieces)

```
DrawerContext.jsx  → { open, openDrawer, closeDrawer, toggle }   (model: ThemeContext.jsx)
DrawerHost.jsx     → backdrop + sliding panel + contents         (model: GlobalTabBar.jsx)
GlobalHeader.jsx   → add ☰ Pressable → toggle(); move utility icons INTO the drawer
app/_layout.jsx    → <DrawerProvider> around everything; <DrawerHost/> as a Stack sibling (render LAST, highest zIndex)
```

## 4. Mechanics

**Context** — copy `ThemeContext`'s shape. Do NOT persist open state (it's
ephemeral — no storage import). Return `{ open, openDrawer, closeDrawer, toggle }`
from a single `useMemo`.

**Overlay** — `DrawerHost` is `position:absolute` fill, `zIndex` above the
header/tab bar (they're 30 → use ~50). Two children: a **backdrop** (dim, tap to
close) and a **panel** pinned left (`width ≈ 82%`, cap ~340, full height).

**Slide animation** (the one tricky part) — one `Animated.Value` 0→1 drives both:
```js
const translateX     = anim.interpolate({ inputRange:[0,1], outputRange:[-PANEL_W, 0] })
const backdropOpacity= anim.interpolate({ inputRange:[0,1], outputRange:[0, 0.45] })
```
Mount/unmount timing is the gotcha — mount immediately on open, but unmount only
AFTER the close animation finishes:
```js
const [mounted, setMounted] = useState(open)
useEffect(() => {
  if (open) setMounted(true)
  Animated.timing(anim, { toValue: open ? 1 : 0, duration: 240, useNativeDriver: true })
    .start(({ finished }) => { if (finished && !open) setMounted(false) })
}, [open])
if (!mounted) return null
```
`useNativeDriver:true` is fine because only `transform`/`opacity` animate.

**Closing paths** — (1) tap backdrop → `closeDrawer`; (2) tap a drawer link →
navigate AND `closeDrawer`; (3) Android hardware back while open:
```js
useEffect(() => {
  if (!open) return
  const sub = BackHandler.addEventListener('hardwareBackPress', () => { closeDrawer(); return true })
  return () => sub.remove()
}, [open])
```

**Safe area / theming / scroll** — panel top-pads `useSafeAreaInsets().top`, uses
themed classNames (`bg-cream-50`, `text-stone-900`), wraps contents in a
`ScrollView`.

**Contents** — from existing contexts: `useAuth()` (`user.isGuest`,
`user.username`), `useProgress()` (`xp`, `streakData`, `levelFromPoints(xp)`).
Nav rows use **`router.navigate(to)` on `Pressable`s** — NOT `<Link asChild>` with
a `style` array (that's the react-native-web CSSStyleDeclaration crash).

**Header change** — `GlobalHeader` gets `const { toggle } = useDrawer()`; its left
becomes a ☰ `Pressable onPress={toggle}`. Remove the icons that moved to the drawer.

## 5. Gotchas

- **Import from `'react-native'`**, never `'react-native-web'` (web-only; breaks on device).
- **zIndex/order**: render `<DrawerHost/>` last, highest zIndex, so it covers header + tab bar.
- **pointerEvents when closed**: `if (!mounted) return null` prevents a lingering full-screen overlay from silently eating every tap.
- **useNativeDriver** animates only `transform`/`opacity` — never width/left (that's why it's `translateX`).
- **GestureHandlerRootView**: only for the optional swipe gesture; the app root must be wrapped in it (expo-router doesn't always add it). Not needed for tap-driven.

## 6. Optional: swipe to open/close

After tap works, add `Gesture.Pan()` (gesture-handler) driving a reanimated
`useSharedValue` instead of `Animated`. It's a rewrite of the animation core — do
it last.

## 7. Build order

1. `DrawerContext` + wrap `_layout` in `<DrawerProvider>`; prove `open` flips with a temp button.
2. `DrawerHost` with NO animation — `open ? <fullscreen panel> : null`; backdrop closes it.
3. Add the slide animation + mount/unmount timing.
4. Add the Android back handler.
5. Fill the panel (user info + utility rows: navigate + close).
6. Slim the header to ☰; remove moved icons.
7. (Later) swipe gesture; (later) the "make everything bigger" pass.

## Models to crib from in this repo
- `src/context/ThemeContext.jsx` — context shape.
- `src/components/GlobalTabBar.jsx` — root overlay, themed tokens, `router.navigate`.
- `src/components/common/Confetti.jsx`, `src/components/vocabulary/Flashcard.jsx` — the `Animated` value/interpolate/`useNativeDriver` pattern.
- `app/_layout.jsx` — where the sibling overlay + provider go.

## DrawerContext — bugs found & fixed (2026-07-29)

The first `DrawerContext.jsx` draft had a handful of issues worth remembering
(all now fixed). Final correct shape lives in
`src/components/Drawer/DrawerContext.jsx`; the API is
`{ open, openDrawer, closeDrawer, toggle }`.

| Bug | Symptom | Fix |
|---|---|---|
| `const DrawContext` but used `DrawerContext` | `DrawerContext` undefined → ReferenceError on import | rename the const to `DrawerContext` |
| `useMemo` not imported | ReferenceError | import it (and drop unused `useCallback`/`useEffect`) |
| `useMemo((...) => …)` | **syntax error** — `(...)` isn't valid arrow params | `useMemo(() => …)` |
| `const [value] = useMemo(...)` | `value` is `undefined` (array-destructured an object) | `const value = useMemo(...)` |
| `setOpen(o => t0)` | `t0` undefined → toggle NaNs/throws | `setOpen(o => !o)` |
| `import … from '../lib/storage.js'` | wrong path + unnecessary | removed — drawer open state is **ephemeral**, don't persist it |

Lesson: a context is a tiny file, but a single typo (`t0`, `(...)`, a name
mismatch) breaks the whole import — check it compiles in isolation before wiring
`DrawerHost`/the provider on top of it.

---

# DrawerHost logic explained — general, width, and (mainly) the animation

## A. Everything is a function of `open` (state-determined)

`DrawerHost` reads `open` from `useDrawer()`. `open` is the *only* real input —
the component's whole job is: "given `open`, show the drawer open, closed, or
mid-transition." When `open` flips (someone calls `toggle`/`closeDrawer`), React
re-renders `DrawerHost`, and everything downstream (mount, animation direction)
reacts to the new value. You never manually "move" the panel; you flip a boolean
and the render + animation logic derive the rest. That's the mental model for the
non-animation parts — pure `open → UI`.

## B. The width (`PANEL_W`)

```js
const { width } = useWindowDimensions()
const PANEL_W = Math.min(width * 0.82, 340)
```
- `useWindowDimensions()` gives the live screen width and **re-runs on rotation /
  resize** (unlike the old `Dimensions.get()` snapshot — the exact bug that broke
  the tab bar early on).
- `width * 0.82` = the panel takes ~82% of the screen, leaving a strip of backdrop
  on the right so it reads as "over" the page, not "replacing" it.
- `Math.min(…, 340)` caps it so on a tablet the panel doesn't become absurdly
  wide. PANEL_W then feeds BOTH the panel's `width` and the slide distance
  (`translateX` from `-PANEL_W`), so the panel always starts exactly fully
  off-screen regardless of device.

## C. The animation — the part to actually understand

### C1. Why not just use React state / setState?
You *could* animate by storing an `x` in state and `setX` every frame. Don't — it
re-renders the whole component ~60×/second and stutters whenever JS is busy.
`Animated` exists to **animate WITHOUT re-rendering**: the value lives outside
React, and special `Animated.View`s subscribe to it and update their native style
props directly. Flip that mental switch first: *the animation is not React state.*

### C2. `Animated.Value` — a number that lives outside the render
```js
const anim = useRef(new Animated.Value(0)).current
```
- An `Animated.Value` is a mutable, subscribable number. You don't read it in
  render; you *drive* it (`Animated.timing(...).start()`) and *bind* it to styles.
- `useRef(...).current` gives you **one** instance that persists across every
  re-render (a bare `new Animated.Value(0)` in the body would make a fresh one
  each render and reset the animation). `useRef` = "keep this exact object."
- Start it at `0`. Treat the value as **normalized progress**: `0` = fully closed,
  `1` = fully open. Nothing about pixels or opacity yet — just an abstract 0→1.

### C3. `interpolate` — one driver → many synchronized motions
```js
const translateX      = anim.interpolate({ inputRange: [0, 1], outputRange: [-PANEL_W, 0] })
const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] })
```
- `interpolate` maps the 0→1 progress onto a real range (a linear remap / lerp).
  When `anim` is `0`, `translateX` is `-PANEL_W` (panel fully left, off-screen) and
  `backdropOpacity` is `0` (invisible). When `anim` is `1`, `translateX` is `0`
  (panel in place) and opacity is `0.45` (dim). At `0.5` it's exactly halfway on
  both — they move **together** because they share one driver.
- This is the payoff of the single value: you animate ONE thing and get the panel
  sliding *and* the backdrop fading, perfectly in sync, for free.
- You then bind these to `Animated.View`s:
  `transform: [{ translateX }]` on the panel, `opacity: backdropOpacity` on the
  backdrop. A plain `<View>` can't take animated values — it must be
  `<Animated.View>`.

### C4. `Animated.timing(...).start()` — actually running it
```js
Animated.timing(anim, { toValue: open ? 1 : 0, duration: 240, useNativeDriver: true })
  .start(({ finished }) => { if (finished && !open) setMounted(false) })
```
- `Animated.timing(value, config)` builds an animation that eases `value` from its
  CURRENT position to `toValue` over `duration` ms. `toValue` is `1` when opening,
  `0` when closing — so the same code animates both directions; direction is just
  which target you pass.
- `.start(cb)` kicks it off. `cb` fires when it ends with `{ finished: true }` (or
  `false` if interrupted, e.g. you re-opened mid-close). That callback is where the
  unmount happens (see D).
- `duration: 240` — ~a quarter second, the usual drawer feel. Tune to taste.

### C5. `useNativeDriver: true` — and why the panel uses `translateX`, not `left`
- With `useNativeDriver: true`, the animation is shipped to the **native/UI
  thread** once and runs there, so it stays 60fps even if the JS thread is busy
  (rendering a list, etc.). This is why RN animations feel smooth.
- The catch: the native driver can ONLY animate `transform` and `opacity` — NOT
  layout props (`width`, `left`, `top`, `height`, `margin`). So you slide the panel
  with `transform: translateX` (a transform), never by animating `left`. Same
  reason the backdrop uses `opacity` (allowed) rather than animating a background.
- If you ever animate a layout prop, you must drop to `useNativeDriver: false`
  (JS-thread, can jank) — avoid it for the drawer.

## D. The mount/unmount lifecycle — why it's not just `open ? … : null`

```js
const [mounted, setMounted] = useState(open)
useEffect(() => {
  if (open) setMounted(true)                         // 1. opening: mount NOW, then animate in
  Animated.timing(anim, { toValue: open ? 1 : 0, duration: 240, useNativeDriver: true })
    .start(({ finished }) => { if (finished && !open) setMounted(false) })  // 2. closing: unmount AFTER the slide-out
}, [open])
if (!mounted) return null                            // 3. closed = render nothing
```

The tension: you want the drawer to render **nothing** when closed (a leftover
full-screen overlay would silently eat every tap — a bug you've hit), *but* you
also want to SEE the close animation. If you did `open ? <panel/> : null`, closing
would make the panel vanish instantly — no slide-out.

The fix is a second boolean, `mounted`, decoupled from `open`:
- **Opening**: `open` true → `setMounted(true)` immediately (panel enters the tree
  at progress 0, off-screen) → then `timing → 1` slides it in.
- **Closing**: `open` false → panel is STILL mounted → `timing → 0` slides it out →
  when that animation's callback reports `finished && !open`, *now* `setMounted(false)`
  → `return null` → gone. Unmount trails the animation instead of racing it.
- `useEffect([open])` is the trigger: it runs the correct animation every time
  `open` changes. `if (!mounted) return null` is the guard that keeps the closed
  state inert.

## E. The whole flow, end to end

1. `toggle()` sets `open = true` (context) → `DrawerHost` re-renders.
2. `useEffect` sees `open` → `setMounted(true)` (panel mounts at progress 0,
   off-screen left, backdrop transparent) → `timing(anim → 1)`.
3. On the native thread: `translateX` eases `-PANEL_W → 0` (slide in) and
   `backdropOpacity` `0 → 0.45` (dim in), together, ~240ms.
4. Tap backdrop (or Android back, or a nav row) → `closeDrawer()` → `open = false`
   → re-render → `useEffect` → `timing(anim → 0)`.
5. Panel slides out + backdrop fades; on `finished` the callback `setMounted(false)`
   → `return null`. Screen is clean, nothing intercepts touches.

Mental model in one line: **`open` is the intent; `anim` (0→1) is the visible
progress; `mounted` keeps the panel alive just long enough to animate out.**

---

# The nav rows (the drawer's links)

## Where `go` lives + the currying

`go` closes over `router` and `closeDrawer`, so it's defined **inside** the
component (not module scope):

```js
const go = (to) => () => { router.navigate(to); closeDrawer() }
```

`go('/settings')` RETURNS a handler `() => {…}`, which is exactly what `onPress`
wants → `onPress={go('/settings')}`. Traps:
- `onPress={go}` ❌ — press calls `go(event)`, returns a fn, navigates nowhere.
- `onPress={() => go('/settings')}` ❌ — calls `go('/settings')`, gets the handler
  back, and THROWS IT AWAY without calling it → no navigation. Use `go('/settings')`.

## nativeDriver has NOTHING to do with the rows

The rows are plain `<Pressable>`s — no `Animated`, no driver. They slide in only
because they're **children of the panel's `Animated.View`** and inherit its
`translateX`. You animate ONE thing (the panel); its contents ride along.
`useNativeDriver: true` belongs solely in the panel/backdrop `Animated.timing`
config. Never wrap individual rows in `Animated.View`.

## Themed via className

Row colors are NativeWind classes so they follow light/dark/neon (same tokens as
the rest of the app) — no inline hex:
- `text-stone-900` (label), `active:bg-cream-100` (themed press feedback —
  NativeWind supports `active:` on `Pressable`).
- SVG icons can't take a className stroke; pass them a themed color value via the
  `tok(theme, '--c-stone-800')` pattern from `GlobalTabBar`/the header.

## Structure — a data-driven row list (relevant pages)

Keep the destinations as a static array at module scope, then map. This is the
shape to build toward (icons omitted — drop your SVG icons in the marked slot):

```jsx
// module scope — static, so it lives outside the component
const NAV = [
  { to: '/account',     label: 'Account' },
  { to: '/pass',        label: 'Season Pass' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/search',      label: 'Search' },
  { to: '/notebook',    label: 'Notebook' },
  { to: '/settings',    label: 'Settings' },
]

// inside DrawerHost's panel <ScrollView> — an identity block sits ABOVE this:
<View className="gap-1 mt-4">
  {NAV.map((item) => (
    <Pressable
      key={item.to}
      onPress={go(item.to)}
      className="flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-cream-100"
    >
      {/* <Icon color={tok(theme, '--c-stone-800')} /> */}
      <Text className="text-base text-stone-900">{item.label}</Text>
    </Pressable>
  ))}

  {/* Theme toggle — SPECIAL row: it cycles the theme, it doesn't navigate.
      theme + cycle come from useTheme(); no go(), no close (your call). */}
  <Pressable onPress={cycle} className="flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-cream-100">
    <Text className="text-base text-stone-900">Theme: {theme}</Text>
  </Pressable>
</View>
```

Two row *kinds* to notice: **navigation** rows (`go(to)` — navigate + close) and
**action** rows like the theme toggle (`cycle` — do a thing, stay put). The
identity block above the list (`level`, `streak`, `@username` from
`useAuth`/`useProgress`) is display-only, not a Pressable.

## Active-route highlighting — how it works (NOT added yet)

To light up the row for the screen you're on, bring in the route string and
compare it per row:

```js
import { usePathname } from 'expo-router'
const pathname = usePathname()               // e.g. '/settings' or '/vocabulary/animals'
// per row:
const active = pathname === item.to || pathname.startsWith(item.to + '/')
```

Then swap classes when `active`:
```jsx
<Text className={active ? 'text-base text-clay-600 font-semibold' : 'text-base text-stone-900'}>
```

Points to understand:
- **Why `startsWith(item.to + '/')`, not bare `startsWith(item.to)`** — bare
  prefix makes `/settings` also match `/settings-foo`, and `/` match everything.
  The `+ '/'` (plus the exact `=== item.to`) matches the page AND its sub-routes
  only. This is the same idea as `GlobalTabBar`'s `match()` functions, just
  per-row instead of one-winner.
- Each row decides **independently** (no `findIndex`) because a flat link list has
  no "one active section" rule — multiple could theoretically match, which is fine
  for a menu.
- It's cheap and re-runs automatically: `usePathname()` re-renders `DrawerHost` on
  navigation, so the highlight updates itself. Add it once the rows render; it's
  purely cosmetic and safe to layer on last.

### Applying it to the Pressable row (the mechanics)

- **Compute it INSIDE the `.map()`** — which means the callback must use a **block
  body** (`{ … return (…) }`), not an implicit return (`(item) => (…)`). Parens
  give you nowhere to declare `active`:
  ```jsx
  {NAV.map((item) => {
    const active = pathname === item.to || pathname.startsWith(item.to + '/')
    return ( <Pressable …/> )
  })}
  ```
  Do NOT also compute a single `active` at component scope — `item` doesn't exist
  there; it's per-row only.
- **Feed `active` into class strings** (NativeWind reads the final string, so
  template-literal conditionals are fine):
  ```jsx
  <Text className={`text-base ${active ? 'text-clay-600 font-semibold' : 'text-stone-900'}`}>
  ```
- **Row background — the conflict to avoid:** when active, use a steady tint and
  DROP the press feedback, or the two "actives" fight:
  ```jsx
  className={`… ${active ? 'bg-clay-600/10' : 'active:bg-cream-100'}`}
  ```
  (`active:bg-…` is the *press* state; `bg-clay-600/10` is the *route* state.)
- **SVG icons take a color value, not a class** — drive them the same way:
  `<Icon color={tok(theme, active ? '--c-clay-600' : '--c-stone-800')} />`. `tok` is
  the `rgb(var(--c-*))` helper (see `GlobalTabBar`); it isn't exported, so copy the
  2-liner or read `THEME_TOKENS[theme]` directly, and get `theme` from `useTheme()`.

### `useDrawer()` returns an OBJECT, not an array

`useDrawer()` → `{ open, openDrawer, closeDrawer, toggle }`. Destructure with
braces: `const { open, closeDrawer } = useDrawer()`. Array form
(`const [open, closeDrawer] = useDrawer()`) silently yields `undefined`s — a
common slip when muscle-memory expects the `useState` tuple shape.

## DrawerHost.jsx — bugs found & fixed (2026-07-29)

The first `DrawerHost` draft had these (all fixed). The pathname logic itself was
correct; the bugs were in the surrounding scaffolding.

| # | Bug | Fix |
|---|---|---|
| 1 | `useRef`/`useState`/`useEffect` used but not imported | `import { useEffect, useRef, useState } from 'react'` |
| 2 | `const [open, closeDrawer] = useDrawer()` (array) | object destructure `{ open, closeDrawer }` (context returns an object) |
| 3 | `const [mounted, unmounted] = useState(open)` but code calls `setMounted` | rename setter to `setMounted` |
| 4 | `useEffect(() => { … ,[open]})` — deps array *inside* the body | close the callback first: `}, [open])` |
| 5 | `interpolate({input: …, outputRange:[-Panwl_W,0]})` | `inputRange`, and `-PANEL_W` (typo `Panwl_W` was undefined) |
| 6 | stray `const active = … item.to …` at component scope (`item` undefined) | delete it — `active` is computed per-row inside `.map()` |
| 7 | backdrop was `<Animated.View onPress>` with no bg/opacity | `Animated.View` with `{ backgroundColor:'#000', opacity: backdropOpacity }` + a child `<Pressable absoluteFill onPress={closeDrawer}/>` (View has no onPress) |
| 8 | panel missing `width`/`left`/`top`/`bottom` | add `top:0, bottom:0, left:0, width: PANEL_W` (translateX needs a real box to move) |
| 9 | theme-toggle row used `cycle`/`theme` (undefined) | `const { theme, cycle } = useTheme()` |
| 10 | `classname="…"` (lowercase) | `className` — React ignores `classname`, so no styling |
| 11 | `if (!mounted) return null` sat **above** the `BackHandler` `useEffect` + `usePathname()` | move the early return **below every hook** — a conditional return before hooks calls them inconsistently between renders = Rules-of-Hooks violation |

**#11 is the subtle one — the early-return + hooks trap.** The mount/unmount
pattern *wants* an `if (!mounted) return null`, but it must come AFTER every hook
in the component. Any hook placed below a conditional `return` runs only on some
renders → React throws "rendered fewer/more hooks than expected." Rule: all
hooks at the top, every conditional `return` after them.

Recurring theme: the *logic* was sound; the failures were **imports**, **object
vs array destructure**, and **JSX prop names** (`className`, View-has-no-`onPress`).
Check those three first when an RN component "runs but does nothing."

## Hamburger in GlobalHeader (2026-07-29)

`GlobalHeader` opens the drawer. The whole wiring is three lines:
- **Import** (correct relative path — `GlobalHeader.jsx` is in `src/components/`,
  `DrawerContext.jsx` is in `src/components/Drawer/`):
  `import { useDrawer } from './Drawer/DrawerContext.jsx'` — `./` = this folder,
  then into `Drawer/`.
- **Grab the action INSIDE the component** (with the other hooks):
  `const { toggle } = useDrawer()`.
- **Render a ☰ button** on the left that calls it:
  `<IconBtn onPress={toggle}><MenuIcon color={ink} /></IconBtn>`, where `MenuIcon`
  is a 3-line SVG (`<Path d="M4 6h16M4 12h16M4 18h16" />`), same style as the other
  header icons, colored with the themed `ink`.

The header's utility icons move INTO the drawer. Final header layout (2026-07-29):
- **Left cluster:** ☰ hamburger + `LevelBadge` + `StreakBadge`.
- **Right cluster:** just the **theme toggle** — `<IconBtn onPress={cycle}><ThemeIcon
  color={ink} /></IconBtn>`, where `ThemeIcon = theme==='neon' ? SparkIcon :
  theme==='dark' ? MoonIcon : SunIcon`. Kept in the header (not moved to the
  drawer) as a deliberate quick-access exception — one tap cycles
  light→dark→neon without opening the drawer.
- Pass / Leaderboard / Search / Settings / Account moved to the drawer's nav list;
  their `IconBtn`s were removed from the header's right cluster. (Leftover
  `nav`/`on`/`accent` locals and the unused icon components are harmless — kept in
  case icons are re-added.)

### Two gotchas hit here (both instructive)
- **Relative import counting** — `'../components/Drawer/…'` from a file already in
  `src/components/` doubles the folder → `src/components/components/Drawer/`. Count
  `../` from the importing file: same folder is `./`, not `../components`.
- **Hooks must run INSIDE a component/hook.** `const { toggle } = useDrawer()` at
  the top level of the file (module scope) is an **"Invalid hook call"** crash —
  hooks aren't plain functions; React tracks them per-render, which only exists
  inside a component. It has to sit next to the other `useX()` calls in
  `GlobalHeader()`.

## Wiring into `app/_layout.jsx` — the provider tree + `ThemedShell`

The provider tree in `RootLayout`:

```
<SafeAreaProvider>
  <ThemeProvider>
    <AuthProvider><SubscriptionProvider><ProgressProvider>
      <DrawerProvider>          ← added here (any ancestor of ThemedShell works)
        <NotebookProvider>
          <ThemedShell />       ← renders the View + Stack + GlobalHeader + GlobalTabBar + DrawerHost
        </NotebookProvider>
      </DrawerProvider>
    </ProgressProvider></SubscriptionProvider></AuthProvider>
  </ThemeProvider>
</SafeAreaProvider>
```

**Why there's a `ThemedShell` at all (the key idea).** A component **cannot
consume a context that it itself renders the Provider for** — the Provider is a
child in its JSX, so its own render runs *before/above* that Provider. `RootLayout`
renders `<ThemeProvider>`, so `RootLayout` can't call `useTheme()`. The shell is
split into a **separate child component**, `ThemedShell`, precisely so it sits
*below* all the providers and can call `useTheme()` (to apply `THEME_VARS` /
`THEME_BG` / the StatusBar style). Same pattern you'd use for any "read all the
contexts and render the app frame" component.

**Where `DrawerProvider` goes.** The only rule: it must be an **ancestor of
`ThemedShell`**, because the two `useDrawer()` consumers — `GlobalHeader` (the ☰)
and `DrawerHost` — are both rendered *inside* `ThemedShell`. Its exact position
among the other providers is free, because `DrawerProvider` is just a `useState`
that consumes no other context. Wrapping `NotebookProvider` + `ThemedShell` (or
just `<ThemedShell/>` alone) are equally valid.

**Where `DrawerHost` goes.** Inside `ThemedShell`, as a sibling of `GlobalTabBar`,
rendered **LAST** so it layers on top:
```jsx
<GlobalHeader />
<GlobalTabBar />
<DrawerHost />        // import at top; last = on top (+ its panel sets zIndex 50)
```

**The one rule that ties it together:** a context *consumer* must be a *descendant*
of its *provider*. That's why the shell is a child component (to consume
`useTheme`), and why both drawer consumers live inside `ThemedShell` (to consume
`useDrawer`) — so `DrawerProvider` wrapping `ThemedShell` covers both.

## Gotcha: the panel background must be INLINE, not `className`

First run: the drawer opened correctly (backdrop + slide + rows), but the panel
was **transparent** — the dimmed home content showed through it. Cause:
**`className="bg-cream-50"` on an `Animated.View` doesn't apply.** NativeWind's
className interop isn't reliable on `Animated.View` (same reason `Flashcard` styles
its animated faces with inline tokens).

Fix — set the panel background inline from a theme token (keeps it themed):
```jsx
import { THEME_TOKENS } from '../../lib/themes.js'
// in the panel's style object:
backgroundColor: `rgb(${THEME_TOKENS[theme]['--c-cream-50']})`,
```
Rule of thumb: **on `Animated.View`, style with inline values, not `className`.**
Plain (non-animated) `<View>`/`<Text>` inside the panel can still use `className`
normally — it's only the animated wrapper that needs inline.

(Aside: `backdropOpacity` output `0.85` is a very dark scrim; `0.4–0.55` reads more
like a standard drawer — aesthetic choice.)

**Applied 2026-07-29** in `DrawerHost.jsx`: added `import { THEME_TOKENS } from
'../../lib/themes.js'`, removed `className="bg-cream-50"` from the panel, and set
`backgroundColor: \`rgb(${THEME_TOKENS[theme]['--c-cream-50']})\`` in the panel's
inline `style`. Verified: the panel now renders as a solid cream sheet with
dark-on-cream rows.

### Follow-up found in the same screenshot: first row hidden under the header

The panel is `top: 0` with `paddingTop: insets.top + 12`, but `GlobalHeader` is a
64px absolute bar sitting over that strip — so the **first NAV row ("Account") is
hidden behind the header**. Fix (not yet applied — left to the author): clear the
header height in the panel's top padding:
```js
import { HEADER_CONTENT_HEIGHT } from '../GlobalHeader.jsx'
paddingTop: insets.top + HEADER_CONTENT_HEIGHT + 12,
```
(`HEADER_CONTENT_HEIGHT` is already exported from `GlobalHeader`.) Alternative
design: let the panel slide *over* the header (cover it) — a different UX choice;
as built, the header stays visible so the panel should start beneath it.

**Both applied 2026-07-29:** the `paddingTop` now uses
`insets.top + HEADER_CONTENT_HEIGHT + 12` (import `HEADER_CONTENT_HEIGHT` from
`../GlobalHeader.jsx`), so the first row/account block clears the header.

## Account / identity block (2026-07-29)

Added at the top of the panel `ScrollView`, above the nav rows. Reads from the
existing contexts:
- `const { user } = useAuth()` — `user.isGuest`, `user.username`, `user.displayName`.
- `const { xp, streakData } = useProgress()`; `const lv = levelFromPoints(xp || 0)`.
- `initial = (user.displayName || user.username || 'G')[0].toUpperCase()`.

Renders a clay avatar circle with the initial, the name (`Guest` / `@username`),
and a subline: guests see "Tap to create an account"; signed-in users see
`Lv N · 🔥 streak · XP`. The whole block is a `Pressable` → `go('/account')`
(navigate + close). Below it, a `h-px bg-cream-200` divider separates it from the
nav list.

## The "text invisible on black in light theme" report = the transparent-panel bug

Reported as a separate symptom, but it's the **same** issue as the panel
background gotcha above. Before the inline-bg fix, the panel was transparent, so
the rows' `text-stone-900` sat on the `#000` backdrop:
- **light theme**: stone-900 is DARK → dark-on-black → invisible.
- **dark theme**: stone-900 inverts to near-white → visible on black.
That theme-dependent disappearance is the tell. The inline `backgroundColor`
(cream panel) fixes it — text sits on cream, readable in every theme. Lesson: when
text vanishes *in one theme only*, suspect a **non-themed** surface (a literal
`#000`/`#fff`) under themed text, not the text color itself.

## Drawer panel didn't scroll — the `<ScrollView>` needed `flex: 1` (2026-07-29)

Symptom: with the account block + all nav rows + theme toggle, the bottom rows
("Settings", theme toggle) **clipped off the panel with no way to scroll to them.**

Cause: the panel `<ScrollView>` had **no `flex: 1`**. A `ScrollView` only scrolls
when it has a **bounded height**; without `flex: 1` it sizes to its *content*
height instead, grows past the panel, and just overflows off-screen (no scroll).
The panel `Animated.View` DOES have a bounded height (`position:'absolute', top:0,
bottom:0`), so giving the ScrollView `flex: 1` makes it fill that bounded box and
scroll when content exceeds it.

Fix:
```jsx
<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
```
- `style={{ flex: 1 }}` — bound it to the panel height ⇒ it scrolls.
- `contentContainerStyle` `paddingBottom` — clears the home-indicator so the last
  row isn't flush against the bottom.

General rule: **a `ScrollView` needs a height-bounded parent (or its own `flex:1`)
to scroll.** "Doesn't scroll" almost always = missing/unbounded height, not a
content problem.

**Hide the scroll bar (2026-07-29):** added `showsVerticalScrollIndicator={false}`
to the panel `ScrollView` so no scroll indicator shows — it still scrolls, just
without the visible bar. (Matches how `TabScreen`'s ScrollView is set up.) Final:
```jsx
<ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
  showsVerticalScrollIndicator={false}
>
```
