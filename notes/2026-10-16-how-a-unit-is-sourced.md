# How a unit is sourced — the chain, and a spike to watch it run (2026-10-16)

The author, while opening `path.js` to plan a path rewrite: *"where is the paths located
— I cant find them actually"*, then *"give example how unit is sourced, so i can see"*.
This note is the answer, kept because the same questions will come back.

## The two files, and which one a rewrite edits

⚠️ **`path.js` holds the RECIPE. `vocabulary.js` holds the CONTENT.** There are no words in
`path.js`:

```js
// src/data/path.js:690 — the recipe
{ id: 'u-colors', title: 'Colors', categories: ['colors'], limit: UNIT_WORD_CAP }

// src/data/vocabulary.js:4320 — the content
{ id: 'colors', title: 'Colors', words: [ { id:'colors-red', hmongRPA:'liab', … } ] }
```

So **a path rewrite edits recipes, not words**: which categories, which order, what is
free, which lesson. `vocabulary.js` is touched only when a *word* is wrong.

## The chain, tap to render

```
PathList.jsx     <Link href={`/path/${unit.id}`}>      → /path/u-colors
expo-router      matches app/path/[unitId]/index.jsx, CAPTURES "u-colors"
the screen       const { unitId } = useLocalSearchParams()
path.js          getUnit('u-colors')            → the unit object   (a .find())
path.js          unit.categories                → ['colors']        (pointers)
vocabulary.js    getCategory('colors').words    → the 15 words
render           unit.title, the steps, the words
```

⚠️ **ONLY A STRING CROSSES BETWEEN SCREENS.** The object is never passed; it is looked up
again on the other side. Hence: a unit id is simultaneously **the link, the lookup key and
the progress key** — which is the real reason §8 of the guide says ids are forever.

It is a **round trip**: `path.js (u-colors) → URL → params → path.js (u-colors)`.

## The router vs the screen, and who captures the URL

Asked directly — *"router is the screen right?"*, then *"what captures the url, the
router?"* — so it is written down.

| | what it is | where it lives |
|---|---|---|
| **the router** | expo-router: reads the URL, picks the file, hands over the params | `app/_layout.jsx` (the `<Stack>`) **and the folder layout itself** |
| **the screen** | your component: renders UI from the params it was given | `app/path/[unitId]/index.jsx` |

The router is the switchboard; the screen is the room. The router does three jobs —
**capture, match, pass** — and the screen only consumes.

```
1. something sets the URL     a <Link> tap, router.push, a deep link, or app launch
2. THE ROUTER captures it     compares "/path/u-colors" against the route tree built
                              from app/, finds app/path/[unitId]/index.jsx, pulls the
                              bracket segment out → { unitId: 'u-colors' }
3. the router renders it      inside the <Stack> in app/_layout.jsx
4. YOUR SCREEN asks           useLocalSearchParams()
```

⚠️ **YOU NEVER CALL THE ROUTER, AND THERE IS NO ROUTE TABLE TO WRITE.** The folder
structure IS the configuration: `app/path/[unitId]/index.jsx` on disk *is* the route
`/path/:unitId`. Metro builds that tree at build time, which is why adding a file adds a
route — and why renaming a folder changes a URL.

**The only four places a screen touches the router at all:**

```js
useLocalSearchParams()   // "what did you capture for me?"
<Link href="…">          // "take me there"
useRouter().push("…")    // same, imperatively
<Redirect href="…">      // "not here, go there"
```

Everything else in these screens — `getUnit`, `getCategory`, `unitWords` — is our own
data code with nothing to do with routing.

⚠️ **ON NATIVE THERE IS NO ADDRESS BAR: the "URL" is internal navigation state.** Tapping
a `<Link>` types nothing anywhere; the router updates its own state and the path string is
just how that state is addressed. Real URLs only arrive from outside — a deep link
(`kawmhmoob://path/u-colors`) or the web build. This is the same fact that made the demo
spike unreachable (below).

Underneath, expo-router is a layer over **React Navigation**, generating the navigator
config by hand-writing none of it. Worth knowing only because error messages sometimes
name it.

## Questions the author asked, with the answers worth keeping

**Does `useLocalSearchParams` search the filename?** No — nothing is searched. The
**filename decides the KEY** (`[unitId]` → `params.unitId`), the **URL decides the VALUE**.
By the time the component runs the router has already matched and filled the bag.

**How do you know it is already parsed?** Because the screen only renders *since* the URL
matched — no match means `+not-found.jsx` instead. There is no "params loading" state.
What is NOT guaranteed:

| | guaranteed? |
|---|---|
| the parse | ✅ always done before your code runs |
| a **bracket** param's presence | ✅ or the route would not have matched |
| a **query** param (`?unit=`) | ❌ may legitimately be absent |
| the **lookup** succeeding | ❌ anyone can type `/path/u-banana` |

That is why path screens open with `if (!unit) return <Redirect href="/path" />`, while
`app/words/typing.jsx` treats its `?unit=` as optional.

**Would it be like this for every square bracket?** Yes — 25 bracket routes, one
mechanism. What varies is only what the string looks up: `getUnit`, `getLesson`,
`toneBySlug`, `vowelByLetter`, `getPhrase`… and three variations:

- **nested brackets = two blanks** (`learn/[unitId]/[lessonId]` → two lookups);
- **sometimes nothing is looked up** — `[tab]` in `notebook/[tab]` is a UI switch, the
  string IS the answer;
- **a scoped id** — `words/sentences/[groupId]` strips a `path-` prefix first.

⚠️ `app/comprehension/[comp].jsx` is the counter-example: a declared blank that is never
read and never looked up, which is why that page does nothing.

**To serve many pages from one bracket file, do you need many files?** No — **one screen
file + one data array with many entries**. 41 unit objects → 41 pages. A 42nd object is a
42nd page with no new file and no route registration. Another *file* is only needed for a
different SHAPE of page (`flashcards.jsx`, `reading.jsx` sit beside `index.jsx` because
they are different screens for the same unit).

## The spike: `/path/<unit>/demo`

`app/path/[unitId]/demo.jsx`, 126 lines, six numbered boxes — one per hop — printing the
real values, then twelve unit buttons that re-run all six with a different string. Hop 6
reads `useProgress()`, so it is live in the other sense too: mark a word anywhere and the
count changes.

⚠️ **IT WAS UNREACHABLE WHEN FIRST HANDED OVER.** It was described as "open
/path/u-colors/demo" — and **a native app has no address bar.** A dev page with no link in
is a dev page that does not exist. It is now the first entry in `TOOLS` in `app/dev.jsx`
(Settings → 🛠️ Open dev tools → 🧭 How a unit is sourced), behind `AdminGate`.
`/_sitemap` is the other way into any route.

⚠️ `/path/demo` (without a unit) reads as `unitId = "demo"`, so `getUnit` returns null and
it redirects to `/path` — the guard working, not a bug.

**TO DELETE:** remove `app/path/[unitId]/demo.jsx` and its `TOOLS` entry. Nothing else
references it.

### It caught a real bug being written

`useProgress()` sat BELOW the `if (!unit) return <Redirect/>` guard, and
`react-hooks/rules-of-hooks` rejected it: hooks are matched by **call order**, so a hook
after a conditional return runs on some renders and not others, and the next render reads
the wrong state. Every hook now sits above the guard, with a comment saying why — the same
rule the typing drill already follows for its memoised tray.

## Also settled in passing

- `.map()` returns **one result per element**, same length in and out.
  `unitWords` uses **`flatMap`** instead, because each category hands back a *list* —
  `map` would give `[[10],[6],[4]]`, `flatMap` gives one 20-word deck.
- `.filter(Boolean)` after `getCategory` exists because a **typo'd category id returns
  `undefined`, not an error** — it silently produces a shorter unit. `check-path.mjs` is
  what actually reports it.
- `id` is a poor parameter name in a codebase with unit, category, word and lesson ids;
  `catId` reads better and is the convention to prefer.

## Where this lives permanently

`learning/feature-logic/path-spine-explained.md` §2 — the recipe/content split and the
full chain were added there (2026-10-16) so they are in the guide, not only in a note.
That guide was also rewritten the same day: its first version described a 10-unit path
with the first two free, which was three weeks stale.
