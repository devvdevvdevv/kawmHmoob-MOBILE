# Reading, Part 1 — the library

**You write the code.** This gives you the shape, the order, the reasoning and
the traps. Nothing here is meant to be pasted.

What we are building, in one picture:

```
Reading                          ← the library (a shelf of genres)
  ├── Horror        4 stories
  ├── Folk tales    6 stories
  └── Everyday      3 stories
        └── Nkauj Ntsuab         ← a story
              read it  →  comprehension quiz  →  score
```

A Kindle library, in Hmong, with a quiz at the end of each story.

Part 2 (`02-comprehension-quiz-guide.md`) covers the quiz. This part gets you a
browsable library with a readable story in it.

---

## Before any code: three decisions

Getting these wrong costs a rewrite. Getting them right makes the UI almost
fall out on its own.

### Decision 1 — a story is DATA, not a screen

The temptation is to build a screen per story. Do not. A story is an object in
a data file; ONE screen renders any of them.

You already have this pattern working twice:

- `src/data/speakLessons.js` → `app/speak/category/[categoryId].jsx`
- `src/data/vocabulary.js` → `app/vocabulary/[categoryId]/index.jsx`

Adding a story should be a data change and **nothing else**. If writing story #7
means touching a `.jsx` file, the shape is wrong.

### Decision 2 — genre and level are different axes

A story is "Horror" AND "Intermediate". Those are not the same kind of fact:

- **genre** = what it is about → how you BROWSE
- **level** = how hard it is → how you FILTER

If you fold them together (`horror-intermediate`) you can never ask "show me
everything at my level" without string-parsing. Keep them separate fields.

### Decision 3 — derive everything you can

⚠️ **This is the most important idea in the whole guide, and the one this
codebase has been bitten by.**

Do NOT store a genre list. Do NOT store a story count. Do NOT store a story's
position. Compute them from the stories array.

A stored count and a real count drift the moment someone adds a story. A
computed one cannot be wrong.

You have a live example: `speakLessons.js` computes `lesson.number` from array
position and deliberately has no `number` field, because a hand-written number
and an array position WILL disagree eventually.

---

## Phase 1 — the data shape

Make `src/data/reading.js`. Start with ONE story, fully filled in. Not three
half-stories — one real one. You cannot tell whether a shape works until you
have filled every field once.

Sketch of the fields you need. Do not copy it; decide each one and write your
own:

```
id          stable, unique, never displayed        'story-nkauj-ntsuab'
title       Hmong title                            'Nkauj Ntsuab'
english     the title in English                   'Green Maiden'
genre       one of your genre ids                  'folk'
level       'beginner' | 'intermediate' | 'advanced'
minutes     rough read time                        4
blurb       one sentence, no spoilers
paragraphs  [{ hmong, english }]                   the story itself
glossary    [{ hmong, english }]                   the words worth pre-teaching
questions   [...]                                  ← Part 2 fills this
```

### Why `paragraphs`, not one big string

Two reasons, and both bite later if you use a string:

1. **You want line-by-line English.** A learner reads a Hmong paragraph, then
   reveals its translation. With one blob you can only reveal the whole thing.
2. **`\n` in a string is not a paragraph.** It renders as a line break with no
   spacing, and you cannot attach anything to it — no tap target, no per-
   paragraph reveal, no audio later.

An array of objects gives every paragraph an identity. That is what lets you do
anything per-paragraph, ever.

### Why `id` must never be displayed

`id` is identity; `title` is a label. The moment you render an id, you can no
longer rename it without changing what users see — and you will want to rename
one. Look at `speakLessons.js`: `id` for identity, `number` for position, and
they are never confused.

### ⚠️ The trap you have already hit once

Look at `src/data/reference.js`: `consonantGroups` and `vowelGroups` BOTH use
the ids `'single'` and `'double'`. Ids are only unique **within the array that
holds them.**

So: make story ids unique across the WHOLE file, not per genre. Prefix them
(`story-`) and never reuse a slug. If you ever key something by `story.id`
alone — progress, a route, a quiz score — a collision is a silently wrong
lookup, not an error.

### Checkpoint

Write one story. Then, in Node:

```
node -e "const {stories}=require('./src/data/reading.js');console.log(stories.length, stories[0].title)"
```

If that fails, fix it before writing a second story. A data file that does not
load is the cheapest bug you will ever have.

---

## Phase 2 — genres, derived

You need a genre list for the library. Do not type one.

### The concept: turning a list into groups

This is the single most useful array operation in app work, and it is worth
understanding rather than memorising.

You have a flat list:

```
[ {genre:'horror'}, {genre:'folk'}, {genre:'horror'} ]
```

You want:

```
{ horror: [ …2 stories… ], folk: [ …1 story… ] }
```

The move is: **start with an empty container, walk the list once, and put each
item into the right bucket — creating the bucket if it does not exist yet.**

```js
const byGenre = {}
for (const s of stories) {
  if (!byGenre[s.genre]) byGenre[s.genre] = []   // create on first sight
  byGenre[s.genre].push(s)
}
```

That is it. `reduce` does the same thing in one expression, and you should learn
it, but write the loop first — you cannot debug a `reduce` you do not already
understand as a loop.

> **The pattern has a name you have already used:** create-on-first-write. It is
> the same shape as `learning/concepts/stored-null-guard-pattern.md`.

### Genre needs a label and an order

`'folk'` is an id. "Folk tales" is a label. And object key order is not a
curriculum order.

So you DO hand-write one small thing — the genre metadata:

```
GENRES = [
  { id: 'folk',     title: 'Folk tales', blurb: '…' },
  { id: 'horror',   title: 'Horror',     blurb: '…' },
  …
]
```

Order comes from this array. Membership comes from the stories. Those are
different questions, and only one of them is safe to hand-write.

⚠️ **Then make a genre with no stories disappear.** A shelf labelled "Horror ·
0 stories" is worse than no shelf. Filter the genre list by whether any story
claims it — that is one `.some()` call, and it means writing a story is still
the only thing you ever do to make content appear.

### Checkpoint

Log your genres with counts. Add a story in a new genre; confirm the shelf
appears with no code change. Delete it; confirm the shelf vanishes.

*If you had to edit a `.jsx` file for either, go back to Decision 3.*

---

## Phase 3 — the library screen

Route: `app/reading/index.jsx`.

Render one card per genre. You already have this exact screen twice — read
`app/(tabs)/speak.jsx` (`CategoryCard`) and `src/components/vocabulary/
VocabCategoryGrid.jsx` (`GroupCard`) before writing yours.

Each card: title, blurb, story count, progress, and a tap into the genre.

### Level filtering

Add `SegmentedTabs` (`src/components/common/SegmentedTabs.jsx`) across the top:
**All · Beginner · Intermediate · Advanced**.

⚠️ Read that component's header before using it. It is full-bleed and cancels
`TabScreen`'s gutter with a negative margin, and the reason is written down: a
rail rendered normally is boxed inside the padded column and CLIPS as soon as
the pills exceed the width.

Filtering changes what the genre cards COUNT, not just what they show. "Horror ·
4 stories" while filtered to Beginner is a lie if only one of them is beginner.
Decide deliberately: either the count follows the filter, or the filter is not
allowed on this screen.

### State vs derived, again

```js
const [level, setLevel] = useState('all')          // STATE — the user chose it
const visible = level === 'all'                     // DERIVED — computed from it
  ? stories
  : stories.filter((s) => s.level === level)
```

`level` is state because nothing else knows it. `visible` is NOT state — it is a
function of `level` and `stories`. Putting it in `useState` means two sources of
truth and a `useEffect` to keep them in sync, which is the bug factory.

> **Rule: if you can compute it during render, do not store it.**

---

## Phase 4 — the genre screen

Route: `app/reading/[genreId].jsx`.

`useLocalSearchParams()` gives you `genreId`. Look up the genre, filter the
stories, render a row each. Read `app/speak/category/[categoryId].jsx` — it is
the same screen with different nouns.

Two things it must handle, both of which the Speak version does:

**A bad id.** Someone deep-links `/reading/nonsense`. Show "Genre not found"
and a way back — do not let it crash or render an empty page with no
explanation.

**Locked stories.** Same shape as Speak: derive `tier` from the genre or the
story, route a locked row to `/paywall` rather than into the story, and grey it
with the lock in the LEADING slot so the state reads before the title.

---

## Phase 5 — the reader

Route: `app/reading/story/[storyId].jsx`.

The reading experience itself. Suggested order to build it:

1. **Title, level, minutes.** Static. Get it on screen.
2. **Paragraphs, Hmong only.** Map over `paragraphs`. Generous line height and
   font size — this is the one screen someone stares at for four minutes.
3. **Per-paragraph English reveal.** Tap a paragraph to show its translation.
4. **Glossary**, collapsed by default.
5. **"Take the quiz" at the end** → Part 2.

### The state question for reveals

You need "which paragraphs are revealed". Three options, and the choice teaches
something:

- `useState(0)` — an index. Only works if reveals are sequential. They are not.
- `useState([])` — an array of indices. Works, but every check is `.includes()`,
  which is a scan.
- `useState({})` — an object keyed by index. `revealed[i]` is a direct lookup.

For a handful of paragraphs all three are fine. The object is the one that stays
correct as it grows, and it is the shape the rest of this app uses for exactly
this (`vocabProgress`, `completedSteps`).

⚠️ **Never mutate it.** `revealed[i] = true` then `setRevealed(revealed)` does
nothing — React compares the reference, sees the same object, and skips the
render. You must create a NEW object:

```js
setRevealed((r) => ({ ...r, [i]: true }))
```

This is the single most common React bug there is. If a tap "does nothing",
suspect this first.

### A reveal-all

One button. Someone re-reading a story they know does not want to tap fourteen
paragraphs.

---

## What to build next

Part 2 covers the comprehension quiz, scoring, progress and gating. But before
you go there, make sure of this:

**Adding a story is a data change and nothing else.** Write story #2 in a new
genre at a new level. If the library, the shelf, the count, the filter and the
reader all pick it up without you opening a `.jsx` file, Part 1 worked.

If you had to touch a screen, find out why and fix it now — it will only get
more expensive once the quiz is reading the same data.

---

## Exercises

### 1. Break the derivation on purpose
Hand-write `count: 4` on a genre, render THAT instead of the computed one, then
add a fifth story.

*Nothing errors. The number is just wrong. How long before a user notices, and
what does that tell you about which bugs tests actually catch?*

### 2. Cause the id collision
Give two stories in different genres the same id. Open one, then the other.

*What does `stories.find(s => s.id === id)` return? Which one, and why that one?
Now write the check that would have caught it.*

### 3. Reproduce the mutation bug
Reveal a paragraph with `revealed[i] = true; setRevealed(revealed)`.

*Nothing happens. Add a `console.log` in render to prove the component never
re-rendered. Then fix it with a spread and watch it work.*

### 4. Judgement (no code)
Level filtering changes genre counts.

*Should "Horror · 4 stories" become "Horror · 1 story" when filtered to
Beginner, or should the filter only apply inside a genre? Argue both, then
pick — and write your reason where the next person will find it.*
