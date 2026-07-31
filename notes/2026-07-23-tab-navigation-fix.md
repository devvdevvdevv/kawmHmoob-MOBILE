# Bottom tab bar wasn't showing — route collisions + name mismatches (2026-07-23)

> **SUPERSEDED later the same day.** Everything below fixed the *route
> collisions* and got the bar drawing on the 5 tab screens — that part still
> holds and is worth reading. But the `<Tabs>`-navigator approach it describes
> was then **replaced by a global persistent nav bar**, because the bar has to
> appear on *every* page (a learn lesson, account, quiz…), not just the 5 tabs.
> Jump to **"Pivot: global persistent nav bar"** at the bottom for the current
> architecture. Where the two conflict, the Pivot section wins.

## Short version

The tab bar "didn't appear" because the screen you were looking at was **not
inside the tab navigator at all**. Two different files both claimed the URL `/`,
and the one that won (`app/index.jsx`) lives *outside* `app/(tabs)/`, so it
rendered with no tab bar wrapped around it. On top of that, the tab bar's own
config listed tabs (`speak`, `words`) that pointed at files which didn't exist,
while the file that *did* exist (`vocabulary.jsx`) was never registered.

Nothing was subtly broken in the styling. The navigation **tree** was wrong.

---

## How Expo Router decides what to render (the mental model)

Expo Router is **file-based**: the folder structure under `app/` *is* the route
table. There is no central "routes" list you edit — the files are the list.

Three rules explain everything that went wrong here:

1. **A file's path = its URL.** `app/learn.jsx` → `/learn`.
   `app/vocabulary/[categoryId]/index.jsx` → `/vocabulary/:categoryId`.

2. **A folder in parentheses is a "group" and adds NOTHING to the URL.**
   `(tabs)` is a group. So `app/(tabs)/index.jsx` → `/` (the `(tabs)` part is
   invisible in the URL). Groups exist purely to *attach a layout* to the files
   inside them — here, the tab bar — without changing their URLs.

3. **`_layout.jsx` wraps every file beside and below it.** `app/(tabs)/_layout.jsx`
   renders `<Tabs>`, so *every screen inside `(tabs)/` gets the tab bar*. A file
   outside that folder gets whatever the parent layout provides — which, for
   `app/index.jsx`, was just `<Slot/>` with **no tab bar**.

Put 1 + 2 together and the bug is obvious:

```
app/index.jsx          -> URL "/"   (NO tab bar — parent is the root layout)
app/(tabs)/index.jsx   -> URL "/"   (HAS tab bar — parent is the Tabs layout)
```

**Two files, same URL.** Expo Router can only render one. It picked the
tab-less one, so the tab bar was nowhere to be seen. This is a silent-ish
conflict: it warns in the browser/Metro console but still "works," which is why
it's so confusing.

---

## Every collision that existed (all now removed)

The web→React-Native port had been half-done twice: once as flat root routes,
once as tabs. Both sets survived, colliding on four URLs.

| URL | File A (kept) | File B (deleted) |
|---|---|---|
| `/` | `app/(tabs)/index.jsx` | `app/index.jsx` |
| `/learn` | `app/(tabs)/learn.jsx` | `app/learn/index.jsx` |
| `/vocabulary` | `app/(tabs)/vocabulary.jsx` | `app/vocabulary/index.jsx` |
| `/alphabet` | `app/alphabet/index.jsx` (redirect) | `app/(tabs)/alphabet.jsx` |

Rule of thumb used: **the five top-level tabs own their URLs inside `(tabs)/`.**
Everything else (alphabet, course, account, notebook, quiz, …) is a *detail*
screen and lives at the root, stacking on top of the tabs. `alphabet` is a
detail screen (it belongs under Reference), so the tab copy was the wrong one to
keep.

Deleted duplicates were **identical** to the kept versions (`learn`,
`vocabulary`) or plain redirects (`alphabet`) — no unique content was lost. The
nested detail routes under those folders (`app/learn/[unitId]/[lessonId].jsx`,
`app/vocabulary/[categoryId]/…`) do NOT collide and were left untouched.

---

## The second bug: the tab bar's config didn't match its files

`app/(tabs)/_layout.jsx` has three lists that must agree, and they didn't:

| Source | Before | Problem |
|---|---|---|
| `SECTIONS` (what the bar draws) | index, learn, speak, **vocabulary**, reference | — |
| `<Tabs.Screen>` (what's registered) | index, learn, speak, **words**, reference | `words` has no file; `vocabulary` never registered |
| Files on disk | index, learn, ~~—~~, vocabulary, reference | no `speak.jsx`, no `words.jsx`; stray `alphabet.jsx` |

So: tapping "Speak" or "Words" hit a phantom route, and `vocabulary.jsx` was an
orphan. **The invariant to remember:**

> For every tab, three things must share the exact same name — the id in
> `SECTIONS`, the `name` on `<Tabs.Screen>`, and the filename in `(tabs)/`.

Fixed by making all three `index / learn / speak / vocabulary / reference`,
creating a real `speak.jsx` placeholder (a registered tab with no file crashes
the navigator), and deleting the stray `alphabet.jsx`.

---

## The third bug: highlight-by-index, ad content hidden behind the bar

Two smaller correctness fixes in the same file:

- **`active` was read from `state.index` (a raw number).** Expo Router orders
  `state.routes` by file discovery, which isn't guaranteed to match `SECTIONS`
  order — so the highlight could drift onto the wrong tab. Now it matches by
  **route name**: `SECTIONS.findIndex(s => s.id === state.routes[state.index].name)`.

- **The tab bar is `position: absolute`**, so it floats over content instead of
  pushing it up. Screens that returned a bare `<View>` (learn, reference) had
  their last rows hidden behind the bar and their first rows under the notch.
  Fixed with a shared `src/components/TabScreen.jsx` wrapper (SafeArea top +
  ScrollView + bottom padding that clears the bar). The bar's own bottom padding
  now comes from `useSafeAreaInsets()` instead of a hard-coded `34`.

---

## Root layout: `<Slot/>` → `<Stack>`

`app/_layout.jsx` rendered `<Slot/>` (render exactly one matched route, no
stack). Changed to a `<Stack>` whose first screen is `(tabs)`. Now the tab bar
is the "home base," and detail screens (account, alphabet, …) **push on top**
with a real back stack instead of replacing everything.

```
Root Stack
 ├─ (tabs)              ← the whole tab bar UI, initial screen
 │   ├─ index (Home)
 │   ├─ learn
 │   ├─ speak
 │   ├─ vocabulary
 │   └─ reference
 ├─ account            ← pushes over the tabs (full screen)
 ├─ alphabet/…
 ├─ course/…
 └─ … every other root file
```

---

## How to add a new tab correctly (the recipe)

1. Create the screen file: `app/(tabs)/history.jsx`, default-export a component,
   wrap its body in `<TabScreen>`.
2. Register it: add `<Tabs.Screen name="history" />` in `app/(tabs)/_layout.jsx`.
3. Draw it: add `{ id: 'history', label: 'History', icon: SomeIcon, … }` to
   `SECTIONS`.
4. The three names (`history`) must be **byte-for-byte identical**.
5. Never create a second file that resolves to the same URL as the tab. Detail
   screens go at the **root** (`app/history/[id].jsx` is fine — different URL),
   not a second `app/history.jsx`.

## How to add a detail screen (not a tab)

Just drop it at the root: `app/streak.jsx` → `/streak`. Link to it from anywhere
(`<Link href="/streak">`). It automatically pushes over the tabs as a full page.
Do **not** put it in `(tabs)/` unless you want it to have a tab button.

---

## Files changed

| File | Change |
|---|---|
| `app/index.jsx` | **deleted** — collided with `(tabs)/index.jsx` on `/` |
| `app/learn/index.jsx` | **deleted** — collided with `(tabs)/learn.jsx` |
| `app/vocabulary/index.jsx` | **deleted** — collided with `(tabs)/vocabulary.jsx` |
| `app/(tabs)/alphabet.jsx` | **deleted** — stray tab; `/alphabet` lives at root |
| `app/(tabs)/speak.jsx` | **created** — real placeholder for the Speak tab |
| `src/components/TabScreen.jsx` | **created** — SafeArea + scroll + tab-bar clearance |
| `app/(tabs)/_layout.jsx` | fixed `<Tabs.Screen>` list; active-by-name; safe-area insets |
| `app/(tabs)/index.jsx` | replaced test stub with the real Home, wrapped in `TabScreen` |
| `app/(tabs)/learn.jsx` | wrapped in `TabScreen` |
| `app/(tabs)/vocabulary.jsx` | wrapped `VocabCategoryGrid` in `TabScreen` |
| `app/(tabs)/reference.jsx` | rebuilt (was an empty `View` imported from `react-native-web`, broken on native) |
| `app/_layout.jsx` | `<Slot/>` → `<Stack>` hosting `(tabs)` |

## How to verify

Bundle all three platforms and confirm the route tree is clean:

```bash
npx expo start --clear --port 8201
# each should return 200:
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8201/node_modules/expo-router/entry.bundle?platform=web&dev=true"
# repeat platform=ios, platform=android
# each tab route should render:
for r in / /learn /speak /vocabulary /reference; do
  curl -s -o /dev/null -w "$r %{http_code}\n" "http://localhost:8201$r"; done
```

Last verified 2026-07-23: all three platform bundles 200, all five tab routes
200, **zero route-collision warnings** in the Metro log. Confirmed the app
*builds and web-renders*; not yet exercised on a device/simulator, so visually
confirming the bar draws + tab-switching + safe-area on a real device is still
worth a manual pass.

---

# Pivot: global persistent nav bar (2026-07-23, later)

## Why the `<Tabs>` approach wasn't enough

Expo Router's `<Tabs>` navigator only renders its bar for screens **inside**
`(tabs)/`. So the moment you opened a *detail* screen — a learn lesson
(`/learn/:unit/:lesson`), account, quiz — the bar vanished and you were stuck
with no way back to another section. But the original web app puts **one**
`<PrimaryNav>` inside a single `<Layout>` that wraps *every* route (see
`src/App.jsx` there: login, register, account, lessons — all nested in
`<Layout>`). The bar is meant to be on the whole app, always.

Two symptoms, one root cause: the web `<Layout>` (which supplies both the
persistent bar **and** the page background/spacing) was never ported — its RN
equivalent had been commented out. So we lost the always-on bar *and* the
consistent background at the same time.

## The new model — one shell, mirroring web `<Layout>`

The bar is no longer a navigator. It's a plain component rendered **once** by
the root layout, as a sibling of the `<Stack>`, so it floats over whatever
screen is showing:

```
app/_layout.jsx
 └─ <View bg-blush-200>        ← single page background, painted once
      ├─ <Stack>               ← the screens (contentStyle: transparent)
      └─ <GlobalTabBar />      ← floats over EVERY screen, always visible
```

- **`src/components/GlobalTabBar.jsx`** (new) reads the current route with
  `usePathname()` and decides which tab is lit via per-section **`match(p)`**
  functions — exactly like the web `PrimaryNav`. So `/learn/anything` keeps
  **Learn** lit, and `/quiz`, `/notebook`, `/review`, `/search` all keep
  **Vocabulary** lit. Tapping calls `router.navigate(to)` (which *reuses* an
  existing screen instead of pushing a duplicate).
- It hides itself on full-screen flows via `HIDE_ON = ['/login', '/register',
  '/onboarding']`.
- `position: absolute`, so it still floats — screens clear it with bottom
  padding. `TAB_BAR_HEIGHT` is exported from `GlobalTabBar.jsx`; `TabScreen`
  imports it and pads `TAB_BAR_HEIGHT + safe-area-inset + 24`.

## What this changes about the old notes above

- **`app/(tabs)/_layout.jsx` is DELETED.** There is no `<Tabs>` navigator
  anymore. The `(tabs)/` folder is now just a plain route group with no layout —
  its 5 files (`index/learn/speak/vocabulary/reference`) render as ordinary
  Stack screens under the root, URLs unchanged (`/`, `/learn`, …).
- The "three lists must agree" invariant and the "how to add a tab" recipe are
  **obsolete**. There's now **one** list: `SECTIONS` in `GlobalTabBar.jsx`.
  To change tabs, edit that array — no `<Tabs.Screen>` registration, no filename
  coupling. A tab just needs a route its `to` points at.
- The route-collision cleanup (the table of deleted duplicates) still stands —
  those files stay deleted.

## Background + spacing

- Root layout paints `bg-blush-200` once (`#B0E0E6`, the powder-blue the RN home
  stub already used — chosen over adding the web's seafoam/teal). `Stack`
  `contentStyle` is transparent so it shows through on every screen.
- `TabScreen.jsx` now also centers content in a `max-w-2xl` column and pads
  `px-5 / py-6`, mirroring the web `<main>`'s centered max-width + rhythm.
- The **learn lesson** screen (`app/learn/[unitId]/[lessonId].jsx`) had **no
  ScrollView at all** — long lessons couldn't scroll and sat under the bar. Now
  wrapped in `<TabScreen>` (inside its `PaywallGate`).

## Still to do (incremental)

Other detail screens (account, quiz, notebook, alphabet, course, settings,
search) now show the global bar but aren't yet wrapped in `TabScreen`, so tall
ones can still slide their last rows under the bar. Wrap each in `<TabScreen>`
as you touch them — same one-line pattern as the lesson screen.

## How to verify (updated)

```bash
npx expo start --clear --port 8203
# bundles (each 200): platform=web / ios / android
# routes incl. detail screens (each 200):
for r in / /learn /speak /vocabulary /reference /account /quiz; do
  curl -s -o /dev/null -w "$r %{http_code}\n" "http://localhost:8203$r"; done
```

Last verified 2026-07-23 (pivot): all three platform bundles 200; `/`, `/learn`,
`/speak`, `/vocabulary`, `/reference`, `/account`, `/quiz` all 200; zero errors
in the Metro log. Web-render/bundle confirmed; **still worth a device pass** to
eyeball the bar floating over a lesson + the active-section highlight.

## Related

See `notes/2026-07-22-boot-fix.md` for the dependency pins that let it build at
all. Same rule applies: **do not run `npm audit fix --force`.**
