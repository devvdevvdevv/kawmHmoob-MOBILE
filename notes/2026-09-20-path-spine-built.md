# The curriculum spine, built (2026-09-20)

`src/data/path.js` + `scripts/check-path.mjs`. This is the DATA half of
[2026-09-20-progressive-unlock-design] — the units, their order, and the
derivations that say which ones the content can carry. **The screens are not
built** and were not attempted; see "Scope" at the bottom.

Same day as the design note, which is why this one is short: the argument is
there, and repeating it here would mean two copies to keep true. What follows is
only what BUILDING it changed or discovered.

---

## What was built

| file | what it is |
|---|---|
| `src/data/path.js` | the ten units, `unitWords`, `unitReadiness`, `pathReadiness`, `livePath`, `isUnitUnlocked`, `nextUnit` |
| `scripts/check-path.mjs` | validates the spine and prints the readiness table |

The design's core decision is carried through unchanged: **a unit references
categories, categories are never locked**, and progress keys on `unitId`.

## The design note reproduced exactly

Every number in the design's table came back identical when computed from the
live data — 218 words across the ten units, 113 with an example sentence, 120
with audio. All ten category ids resolve, and **no word appears in two units**.
That was worth checking before building on it, and it means the plan can be
trusted.

## ⚠️ Three findings that only appeared once it was code

### 1. The 20-word cap is worth 25 sentences

The design says cap every unit at 20. Applying it drops the path from 218 words
to **183**, and the content bill from 105 sentences to **78**. A quarter of the
remaining work disappears by deciding a unit is a curated slice rather than a
whole category — which is not obvious from the design, where the cap reads as a
UX rule about lesson length.

### 2. `limit` silently threw away the ready words — the `u-verbs` case

`limit: 20` takes the first 20 **in data order**, and data order is not utility
order. Measured on `verbs`: the category holds 28 words, 23 of which already
have an example sentence, and the uncurated cap produced a **16/20** unit —
it discarded 7 ready words and kept 4 unready ones (`txuas` to connect, `xyuas`
to check on).

### 3. ⚠️ And the obvious fix is worse than the bug

Picking the 20 words that already have sentences scores **20/20 and ships the
unit today for free.** It was tempting and it is wrong: the 23 ready verbs do
not include `muaj` (to have) or `los` (to come), and they do include `nthuav`
(to flip a page) and `piav` (to explain).

> A beginner's eighth unit that teaches "flip a page" but not "have" is a worse
> unit that happens to pass a readiness check.

**Readiness measures the content. It is never a curriculum argument.** So
`u-verbs` got a hand-curated `words: [...]` chosen on utility, which leaves it
at 18/20 — two sentences away, and both of them (`los`, `muaj`) already sit in
the top tier of the sentence workbench, because the same signals rank them
there.

This is also why `unitWords()` does NOT automatically prefer words that have
sentences, which was the other tempting shortcut: unit membership would then
change as content is written, so a learner's "18 of 20 mastered" could silently
become "18 of 23", and a word they had finished could drop out of the unit it
was learned in. Deterministic beats clever for anything progress is measured
against.

## Where the path stands today

```
   #  unit                words   ex   audio   needs
     1  Greetings            20    1     16   19 sentences
     2  You & Me             16    8     14   8 sentences
  ✅ 3  Numbers              20   20     20   —
     4  Family               14   10      0   4 sentences
  ✅ 5  Classifiers          20   20     20   —
     6  Food & Drinks        20    2      0   18 sentences
     7  Colors & Describing  17   14      0   3 sentences
     8  Core Verbs           20   18     20   2 sentences
     9  Time & Days          20   12     19   8 sentences
    10  Daily Life           16    0      0   16 sentences

  183 words across 10 units · 105 have an example sentence
  78 sentences from a complete path
  live now: Numbers, Classifiers
  closest to ready: Core Verbs — 2 sentences away
```

**Two sentences make it three units.** Then Colors (3) and Family (4). Run
`node scripts/check-path.mjs` after every batch — the last two lines are the
whole point of the script while authoring.

## ⚠️ Audio is out of the readiness test

Recording was paused on 2026-09-20. It was never a majority anyway: 120 of the
path's 218 words had a clip, and two whole units (Family, Food) had none.

**Step 3 of the five-step unit is tone practice, and it does not become an empty
slot.** `src/lib/typingDrill.js` grades tone off the SPELLING — writing `zos`
for `zoo` is reported as a Low-vs-Mid tone error by name — and runs on 917 words
today with no recording. Step 3 is that drill until clips exist. See
[2026-09-20-tone-aware-typing-drill].

`withAudio` and `needAudio` are still measured and reported precisely so
re-arming is one line: `AUDIO_COUNTS_TOWARD_READY = true` in `path.js`.

## Scope — what was deliberately NOT built

- **No Home tab, no unit screen, no five-step player.** The design replaces the
  app's entry point, which is a separate decision and a much larger change. This
  file is what those screens would read.
- **`free` is declared, enforced nowhere.** Wiring it belongs beside the
  existing lesson/phrase tiers in `lib/access.js`.
- **No progress storage.** Every function takes `completedUnitIds` as an
  argument, so `path.js` stays pure data + derivations and the unit screen owns
  the writing.
- **Nothing gates Reference, the reader or the sentence builder**, and nothing
  should — Reference stays open on all 77 categories.
- **`u-food` (38→20) and `u-time` (26→20) still use `limit`.** Curating those
  is a content call: which 20 foods, and the design notes `mov` carries real
  culture. `u-numbers` keeps `limit` too, but harmlessly — data order there is
  counting order and all 23 are ready.

---

## Status

- `path.js` and `check-path.mjs` written; `check-path` passes
- `u-verbs` curated by hand; the other three capped units still uncurated
- unreferenced by any screen — this is a spine, not a feature

Related: [2026-09-20-progressive-unlock-design],
[2026-09-20-tone-aware-typing-drill],
[2026-09-16-vocab-depth-not-breadth-and-grammar-grouped].
