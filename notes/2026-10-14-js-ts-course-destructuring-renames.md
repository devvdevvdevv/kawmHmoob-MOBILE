# JS/TS course: destructuring renames, and why big codebases use them (2026-10-14)

A Lesson 02 session on destructuring with a rename (`{ english: gloss }`): what
the `:` actually does, the mistakes made on the way, and the reason a large
codebase like this one renames so often. Follows on from
[2026-10-08-js-ts-course-lesson-01-session].

## What `{ key: newName }` does

```js
const word = { english: 'liver' }
const { english: gloss } = word
//      ──┬───   ──┬──
//   the KEY to   the NEW variable
//   look up      you get
```

> **Look up the key `english` in the object, and store its value in a new
> variable called `gloss`.**

- `english` is a **key**, not a variable. Nothing in the object is renamed:
  `word.english` is still `'liver'`.
- `gloss` holds the **value** (`'liver'`), not the word `'gloss'`.
- `english` alone is now a ReferenceError (`english is not defined`), because no variable
  by that name was made.
- Text values need quotes: `{ english: liver }` is a ReferenceError; `{ english: 'liver' }` is a string.

**Mistakes made on the way:** predicted `console.log(english)` → `'gloss'` (it's a
ReferenceError, and `gloss` holds `'liver'`); called `null` "an acceptable object"
(it's a deliberately set value, not an object; a default only fills in `undefined`).

## The general idea: renaming makes a label distinct

> **In a large codebase, a rename gives a piece of information a label that is
> specific to the file it's used in, so it can't be confused with something similar.**

A hook or a library is used by many files, so it can only name its values
**generally**: `theme`, `prefs`, `data`, `error`, `width`. It doesn't know who's
asking. Each file then picks a **specific** label that says what the value means *there*.
The value never changes, only the label does.

### The analogy: a name tag

The hook hands out a name tag that just says **"Theme"**. In a small room that's
enough: there's only one theme. In a big room full of themes and colours (the
1,200-line story reader, with genre cover colours, reading preferences and text
sizes), a tag that just says "Theme" gets mixed up. So you write **"Reader's
theme"** on it.

```js
const { theme: readerTheme } = useTheme()        // app/reading/story/[storyId]/index.jsx:315

genreCoverColor(genre?.cover, theme)         // ❓ which "theme"? app mode? genre? reading prefs?
genreCoverColor(genre?.cover, readerTheme)   // ✅ answers it at the line you're reading
```

The specific name answers "where did this come from, and what is it?" **at the
line where it's used**, without scrolling 600 lines up to find out.

## The three reasons to rename (all real lines in this app)

| Reason | Example |
|---|---|
| **1. A collision:** two values would have the same name, which is an error | `app/settings.jsx:30-31`: `useQuizPrefs()` and `useReadingPrefs()` both return `prefs`/`setPref`, so the second becomes `readingPrefs`/`setReadingPref`. `AuthContext.jsx`: every Supabase call returns `{ data, error }`, giving `sessData`, `profileError`. |
| **2. A clearer, more specific label** (the name tag) | `useTheme()`'s `theme` becomes `readerTheme`, `quizTheme`, `genreTheme`; `useWindowDimensions()`'s `width` becomes `screen` (`reading/index.jsx:321`) |
| **3. The plain name is needed for something else** | `app/words/typing.jsx:97`: `unit` from the URL becomes `unitParam` (just text), which keeps the meaning clear for `pathUnit` (the real unit object) |

> **Rule of thumb:** keep the original name when it's clear and unique in the file.
> Rename when it would clash, or when a more specific label says more.

## After destructuring: copied or shared?

> **A number, string or boolean is a photo: your own copy, frozen at that
> moment. An array or object is an address: one shared thing, reachable by two names.**

Shown with the shape of a learner's progress (the same kind of data
`ProgressContext` holds). Every printed value below was checked in Node:

```js
const progress = { xp: 120, completedSteps: ['path:greetings'] }
const { xp, completedSteps } = progress

// Later, the learner earns XP and finishes another unit:
progress.xp = 150
progress.completedSteps.push('path:numbers')

xp                                        // 120  📸 a photo: still the old value
progress.xp                               // 150
completedSteps                            // ['path:greetings', 'path:numbers']  🏠 same house: it changed too
completedSteps === progress.completedSteps   // true: one array, two names
```

**Why it matters in a real app:**

- **The photo can go stale.** A screen that destructured `xp` once and kept it
  around would show 120 after the learner reached 150. That's why React screens
  read fresh values on every render (from props, state or context) instead of
  stashing an old copy.
- **The address can surprise you.** Code that "only" had `completedSteps` can
  change the progress everyone else sees, just by `.push`ing to it. That's why the app
  never `.push`es onto state: it builds a **new** array (`[...steps, id]`), so
  nobody's copy changes behind their back (Lesson 03 §5).

| The value is… | Destructuring gives you | The source changes inside later |
|---|---|---|
| number, string, boolean | a **photo**: its own copy | your variable keeps the old value |
| array, object | the **address**: the same one, shared | you see the change through both names |

### The interpretation that was checked (3 of 4 right)

Using `const example = { poop: 5 }` and `const { poop = 4 } = example`:

1. ✅ *"The destructured variable is kept; changing it doesn't affect the source."* Right
   (with `let`; a `const` variable can't be re-assigned at all).
2. ✅ *"Changing the source doesn't change the destructured variable."* Right for
   numbers/strings/booleans; **not** for arrays/objects (the address case above).
3. ✅ *"`poop` is 5, not the default 4."* Right: the key existed, so the default was ignored.
4. ❌ *"After `example = { poop: 52 }`, `poop` is still 4?"* Two slips: `example` is
   `const`, so that line throws `Assignment to constant variable` (`example.poop = 52`
   is the allowed version); and `poop` stays **5**, because the `4` never applied.

Lesson 02 fact 3 was also rewritten the same day ("Numbers get copied. Arrays and
objects get shared."), because the original paragraph was hard to follow.

## Files changed

- `js-ts-course/02-functions.md`: new sections "Renaming: what `:` really does"
  and "Why would you ever rename?" (with the name-tag analogy); the "Try it" exercise
  fixed to start without `audioFile` so the default is actually visible first, plus
  the first-attempt record. Fact 3 ("copies the value, not a live link") rewritten as
  "Numbers get copied. Arrays and objects get shared.", with examples and a table.

Related: [2026-10-08-js-ts-course-lesson-01-session], [2026-10-04-js-ts-course-and-routing-drills]
