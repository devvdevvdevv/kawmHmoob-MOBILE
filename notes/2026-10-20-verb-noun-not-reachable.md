# A lesson that existed, parsed, and still could not be reached — 2026-10-20

Author: *"how come verb-noun not being added"*. Three separate faults stacked on
one new lesson, and **two of them were silent**.

## 1. A markdown fence at the top of the file

`src/data/lessons/verb-noun.js` began with ` ```js ` and ended with ` ``` ` —
pasted in with the code. The reason this is worth a note: **`node --check`
passes.** Three backticks are an empty template literal followed by the start of
another one, so the whole file parses as a pair of template strings and
`export const verbNouns` is swallowed into one of them. The file is valid
JavaScript that exports nothing.

Importing it is what shows the problem:

```
TypeError: "" is not a function      ← the tagged-template call
```

**If a new data file "parses fine" but the app cannot see it, import it, do not
just `--check` it.**

## 2. A broken import, hand-added

`src/data/lessons.js` line 65 held:

```js
import {verbNoun} from './lessons/verb-noun',   // ← trailing comma; and the name is wrong
```

Two faults in one line: the trailing comma is a **parse error in lessons.js**,
and the name is `verbNoun` where the file exports `verbNouns`. A parse error
there takes down the entire data module, so **nothing in the app updates** — the
bundler keeps serving the last good build. Removed, and replaced with a correct
import plus a place in the `actions-and-time` unit, right after Action Verbs.

`path.js` was never wrong: `u-verb-noun` has pointed at
`introLesson: 'foundations-verb-nouns'` since 2026-09-28.

## 3. ⚠️ `check-path.mjs` passed the whole time

The introLesson assertion added on 2026-10-19 asked *"does some lesson file
contain this id?"* — and one did. It never asked whether the lesson was
**reachable**, so a lesson on disk that `lessons.js` does not import looked
healthy while the unit quietly showed no introduction. That is the same silent
loss the 2026-10-19 check was written to catch, one level further out.

It now requires both halves: the export is **imported** AND **placed in some
`lessons: [...]` array**. An import on its own leaves the lesson just as
unreachable.

Verified by removing `verbNouns` from the array: the check reports
`u-verb-noun: introLesson 'foundations-verb-nouns' exists on disk but 'verbNouns'
is not imported AND placed …`, and goes quiet when it is put back.

### Two false positives it threw first, both worth keeping in mind

- **One file can hold several lessons.** `placeholders.js` exports six, and
  taking the file's first export name attributed all six ids to
  `locationPlaceholder` — five lessons "unregistered". The owner of an id is the
  LAST `export const` declared above it.
- **Comments glue names together.** Every `lessons: [...]` here is annotated one
  entry per line (`dates,  // Writing Dates, 2026-09-27`), and a comment
  containing a comma welds the next name onto its tail, so `timeExplained`
  read as unregistered when it sits right there. Strip comments, then read names.

With both fixed the script is back to the 9 pre-existing unit-wiring problems —
one of which, `u-verb-noun lists word "misc-kawm-ntawv", which is not in its
categories`, belongs to this very unit and is still open.
