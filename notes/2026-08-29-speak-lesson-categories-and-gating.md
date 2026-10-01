# Conversations restructured for 200+ lessons: categories, global numbering, free-through-3

**2026-08-29** · `src/data/speakLessons.js`, `app/speak/category/[categoryId].jsx`,
`app/(tabs)/speak.jsx`

Follows [[2026-08-29-speak-hub-tabs-and-grammar]], which introduced tabs. This
makes Conversations survive the content plan.

---

## What changed and why

> "conversations / guided lessons will be it's own thing. Put phrase drills
> someplace else, add a fourth. Also, there will be like 200+ guided
> conversations, each grouped by category, and labeled in chronological order."

Three consequences, and the third is the architectural one:

1. **Conversations holds guided lessons and nothing else.** Phrase drills were
   sharing the tab; mixing two kinds of thing is what made the flagship hard to
   find in the first place.
2. **A fourth tab** — `Phrases` — is now the drills' home.
3. **A flat list cannot hold 200 lessons.** The tab lists CATEGORIES; a category
   opens `/speak/category/[categoryId]` for its lessons. Categories are the
   shelf; that route is the shelf's contents.

Tabs are now: **Conversations · Phrases · Grammar · Tones & Words**

---

## The numbering rule

Lesson numbers are **global and continuous**, not per-category:

```
Greetings          Lesson 1   Greetings
                   Lesson 2   Farewells
                   Lesson 3   Thanks & Sorry
Asking the price   Lesson 4   Asking how much?      ← 4, not 1
                   Lesson 5   …
```

The number answers *"how far into the course am I?"* — so it must not restart.

⚠️ **There is deliberately no `number` field in the data.** It is computed from
array position when the categories are flattened:

```js
export const speakLessons = speakCategories
  .flatMap((cat) => cat.lessons.map((l) => ({ ...l, categoryId: cat.id, … })))
  .map((lesson, i) => ({ ...lesson, number: i + 1 }))
```

A hand-written number and an array position **will** drift — someone inserts a
lesson and renumbering thirty entries by hand is a guaranteed bug. Deriving it
makes that impossible.

> **Order is the contract.** Reordering the array renumbers the course, which is
> correct. `number` is a position, never an identity — use `id` for identity,
> always.

---

## Gating: free through lesson 3

`free` lives on the **category**, and lessons inherit it:

```js
{ id: 'cat-greetings', free: true, lessons: [greetings, farewells, politeness] }
```

```js
free: Boolean(cat.free),
tier: cat.free ? undefined : 'pro',
```

⚠️ **Gating is DERIVED, never hand-written on a lesson.** These two fields are
overwritten rather than merged, because a lesson carrying its own `free`/`tier`
would silently disagree with its category — and the disagreement would only show
up as a learner hitting a paywall they should not have.

### Why the flag is on the category, not a `FREE_THROUGH = 3` constant

The request was phrased two ways — *"only the greetings would be free"* and
*"locked after lesson 3."* Those coincide **today**, because Greetings is
lessons 1–3.

They stop coinciding the moment a fourth greetings lesson is written. A hardcoded
`3` would silently paywall it; a category flag keeps it free. The category flag
encodes the *intent* ("greetings is the hook"), the constant encodes a
coincidence.

`FREE_LESSON_COUNT` is derived from the flag for UI copy — currently 3, and it
stays honest on its own.

---

## Verified against the FUTURE state, not just today

One category exists, so none of the interesting behaviour — numbering crossing a
boundary, lesson 4 locking — is exercised by the current data. Testing only
today's state would prove nothing about the thing just built.

So a second category was added **to a throwaway copy** of the file and the whole
model re-checked:

```
FREE 👋 Greetings
   Lesson  1  Greetings          free=true   tier=—
   Lesson  2  Farewells          free=true   tier=—
   Lesson  3  Thanks & Sorry     free=true   tier=—
PRO  💰 Asking the price
   Lesson  4  Asking how much?   free=false  tier=pro
   Lesson  5  Too expensive      free=false  tier=pro

FREE_LESSON_COUNT : 3
numbering across categories : 1,2,3,4,5
lesson 4 locked? true
next after lesson 3 crosses category? "Asking how much?"
```

Real file untouched (`grep -c cat-price` → 0).

> **When you build for a scale you do not have yet, simulate the scale.** The
> current data cannot fail the way the design is meant to prevent.

---

## Adding a category is now a data-only change

```js
{
  id: 'cat-price',
  title: 'Asking the price',
  blurb: '…',
  emoji: '💰',
  // no `free` → every lesson inside is tier:'pro'
  lessons: [askingHowMuch, tooExpensive],
}
```

Numbering, gating, progress, the hub card, the category screen and the finish
modal's "next lesson" all follow. **No screen hardcodes a category or lesson id.**

---

## Verification

- Babel parse — `speakLessons.js`, `speak.jsx`, `[categoryId].jsx`
- `check-undefined-refs.mjs` — clean
- `check-lesson-audio.mjs` — all paths resolve
- `pronunciation-selftest.mjs` — ALL PASS
- Runtime: 1 category, 3 lessons, `FREE_LESSON_COUNT` 3; `getNextLesson` chains
  1→2→3→end
- Future-state simulation above

**Not verified on a device:** tab switching, entering a category, and the
paywall actually appearing on a `tier: 'pro'` lesson — no such lesson exists yet
to tap.

---

## Open

**The daily-phrase card is above the tabs** and pulls from `allPhrases()` (the
38 group phrases), not from lessons. That still reads correctly, but at 200
lessons a "lesson of the day" may be the better hook. Not changed — flagging it.

**Category ordering is array order.** Fine for a handful; at 20+ categories a
curriculum probably wants explicit prerequisites rather than "whatever order the
array is in." Worth revisiting before the list gets long.

---

## Exercises

### 1. Add a category with no code
Add `cat-price` with two placeholder lessons. Check the hub card, the category
screen, the numbering, and the lock.

*If you edited any `.jsx`, the derivation is not doing its job.*

### 2. Break the numbering on purpose
Add `number: 99` to a lesson object.

*Does it win, or does the derived value? Trace why — then explain why the data
having a `number` field at all would be a bug.*

### 3. Move the free hook
Move `free: true` from Greetings to a second category.

*What does `FREE_LESSON_COUNT` become? Is the copy still true? This is why the
count is derived rather than typed.*

### 4. Judgement (no code)
200 lessons across maybe 20 categories, in a fixed array order.

*Does a learner need to do category 3 before category 4? If yes, array order is
not enough — sketch what a prerequisite would look like, and what it would do to
the "click to enter" hub.*
