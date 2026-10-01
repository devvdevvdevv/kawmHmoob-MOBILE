# Progressive unlock — design (2026-09-20)

> **BUILT 2026-09-22** — see [2026-09-22-path-spine](2026-09-22-path-spine.md) for what was
> built, what changed from this design, and what is still open.

A beginner path with locked units, each unit a complete five-step mini-lesson.
Written against what the content can actually support today, not against an
ideal. Snapshot of the pre-change tree: `archive/2026-09-20-pre-progression/`.

---

## 0. The finding that reorders everything

The five-step flow needs two fields most words do not have. **Tone practice needs
`audioFile`. Sentence building needs `exampleSentence`.** So "is this category
ready" is not a matter of word count — it is those two numbers.

Measured across a pedagogically-ordered first ten units:

| unit | words | has ex. | has audio | needs ex. | needs audio |
|---|---|---|---|---|---|
| 1 Greetings & Politeness | 20 | 1 | 16 | **19** | 4 |
| 2 You & Me (pronouns) | 16 | 8 | 14 | 8 | 2 |
| 3 Numbers | 23 | 23 | 23 | **0** | **0** |
| 4 Family | 14 | 10 | 0 | 4 | 14 |
| 5 Classifiers | 20 | 20 | 20 | **0** | **0** |
| 6 Food & Drinks | 38 | 2 | 0 | **36** | **38** |
| 7 Colors | 17 | 14 | 0 | 3 | 17 |
| 8 Core Verbs | 28 | 23 | 28 | 5 | **0** |
| 9 Time & Days | 26 | 12 | 19 | 14 | 7 |
| 10 Daily Life & Chores | 16 | 0 | 0 | **16** | 16 |
| **total** | **218** | **113** | **120** | **105** | **98** |

> ⚠️ **The obvious teaching order is almost the inverse of the content order.**
> Greetings is where every language course starts and it is the *least* ready
> unit here — 19 of 20 sentences missing. Numbers and Classifiers are the most
> ready and both are 100% complete right now. Food & Drinks, which feels like an
> easy early win, is the single largest hole in the project: 36 sentences and 38
> recordings.

Two consequences, and they are the whole plan:

1. **Ship the path in readiness order, present it in teaching order.** Build and
   release units 3, 5 and 8 first — they are nearly free — while filling in 1 and
   2. The learner never sees the difference; they see units 1→10.
2. **105 sentences and 98 clips is the actual project.** Not the unlock logic,
   which is a day's work. Plan around the content number, because that is the one
   that does not compress.

---

## 1. ⚠️ The one architectural decision: a unit is not a category

Do **not** lock categories. Lock **units**, where a unit references one to three
categories.

```js
// src/data/path.js  — NEW, the curriculum spine
export const path = [
  { id: 'u-greetings', title: 'Greetings', order: 1,
    categories: ['greetings', 'politeness', 'introductions'], free: true },
  { id: 'u-pronouns',  title: 'You & Me',  order: 2,
    categories: ['pronouns', 'yog-to-be'], free: true },
  { id: 'u-numbers',   title: 'Numbers',   order: 3,
    categories: ['numbers'] },
  // …
]
```

Why this and not category-level locking:

- **77 categories is not a path.** Many are tiny — `introductions` has 4 words,
  `daily-life` 4, `politeness` 6. A 4-word "lesson" cannot carry five steps. Units
  let you bundle them without touching `vocabulary.js` again.
- **`vocabulary.js` stays a dictionary.** It is 1,351 words serving the reader's
  long-press, the sentence builder, and the reference tab — all of which need
  *everything* visible. Putting `locked: true` in there would mean the data layer
  had opinions about curriculum, and the reference tab would have to fight them.
- **You already have this pattern twice.** `CATEGORY_THEMES` in `vocabulary.js`
  references category ids for display only; `units` in `lessons.js` wraps lessons
  into groups. `path.js` is the same move, and `lib/access.js` already gates
  positionally off `units[]` — so the gating code largely exists.
- **Reordering stays cheap.** Changing `order` reorders the course. Changing a
  category id would strand saved progress.

Progress keys off `unitId`, never off category. That way merging or splitting a
category later (which this project does often) does not reset anyone.

---

## 2. Recommended order, first 10 units

Pedagogical order — what to *show*. Rationale is utility-first: can the learner
say something true about themselves by the end of the unit?

| # | unit | categories | words | why here |
|---|---|---|---|---|
| 1 | **Greetings** | `greetings` `politeness` `introductions` | 20 | First real conversation. `nyob zoo`, `ua tsaug`. Free. |
| 2 | **You & Me** | `pronouns` `yog-to-be` | 16 | `kuv yog…` — the first full sentence. Hmong's dual (`wb`, `nkawd`) surprises English speakers early. Free. |
| 3 | **Numbers** | `numbers` | 23 | Age, price, quantity. **100% content-ready.** |
| 4 | **Family** | `family-male-perspective` | 14 | Culturally central, and the payoff for unit 2's pronouns. ⚠️ Teach ONE perspective here; the male/female split is a second pass, not a beginner's problem. |
| 5 | **Classifiers** | `classifiers` | 20 | The grammatical spine — `tus`, `lub`, `daim`. Must land before nouns pile up. **100% ready.** |
| 6 | **Food & Drinks** | `food` `drinks` | 38 → trim to 20 | High utility, and `mov` carries real culture. ⚠️ Biggest content hole. |
| 7 | **Colors & Describing** | `colors` | 17 | First adjectives; teaches noun-then-adjective order. |
| 8 | **Core Verbs** | `verbs` | 28 → 20 | `noj`, `haus`, `mus`, `los`. Unlocks real sentences. Nearly ready. |
| 9 | **Time & Days** | `timeframes` `days-of-week` | 26 → 20 | "When" — turns sentences into plans. |
| 10 | **Daily Life** | `daily-life` `chores` | 16 | Ties everything together in routine. |

**Build order, which is different:** 3, 5, 8 (nearly free) → 2, 7, 4 → 1, 9 → 6, 10.

Ship units 1 and 2 *first to users* regardless, since they are free and set the
tone — just budget the 27 sentences they need before launch.

> ⚠️ **Cap every unit at 20 words.** Units 6, 8, 9 are over; trim to the 20 most
> frequent and leave the rest in the category for the reference tab. A unit is a
> curated slice of a category, not the whole of it — which is another reason the
> unit needs its own `words: [...]` override or a `limit`.

---

## 3. Information architecture

```
HOME  (replaces the current tab as the default landing)
├── Continue — one card, the current unit, its next incomplete step
├── The Path — vertical list of units, locked/unlocked/complete
│     each row: number · title · 5 step pips · words mastered n/20
├── Daily practice — one card, mixed review of ALREADY-LEARNED words
└── Level & season strip (existing leveling.js / battlepass.js)

UNIT SCREEN  (the mini-lesson, 5 steps, sequential)
├── 1 Flashcards      — 20 words, both directions
├── 2 Quiz            — multiple choice, distractors from the SAME unit
├── 3 Tone practice   — record & score (toneScore.js, pronounceScore.js)
├── 4 Sentence build  — chips, from this unit's exampleSentences
├── 5 Mini-reading    — 6–10 lines assembled from those same sentences
└── Unit complete → XP, next unit unlocked

PRACTICE HUB  (free-play, no locks, only learned words)
├── Flashcard review   — spaced, across all completed units
├── Tone drill         — existing toneDrill.js
├── Sentence builder   — existing, scoped to learned words
└── Weak words         — lowest-scoring words, any unit

REFERENCE  (unchanged — stays fully open, all 77 categories)
└── The dictionary. ⚠️ Never gate this. It is what makes the reader usable
    and it is the app's most honest asset.

READING  (unchanged — the 4 real stories, separate from unit mini-readings)
```

### Why Home replaces the current entry point

The complaint is "everything is available at once." That is an IA symptom: five
tabs of equal weight, each a pile. One **Continue** card and one ordered path is
the fix — the answer to "what do I do now" has to be a single tap, and everything
else moves one level down.

Keep the tabs, but demote them: Home · Path · Practice · Reference.

### ⚠️ Step 5 is not an authored story

**There are 4 stories in the whole app.** Do not plan a story per unit — that is
10+ authored Hmong texts, which is the thing this repo's notes repeatedly warn
against doing blind.

Instead: **assemble the mini-reading from the unit's own 20 example sentences.**
Order them, add a title, and render them in the existing reader with long-press
lookup. It is a "text" only in the loosest sense — 8 sentences about food — and
it is genuinely useful, because it is the first time the learner sees the unit's
words in running prose.

This is the highest-leverage decision in the whole plan:

> **One example sentence powers steps 2, 4 and 5.** It is a quiz distractor
> source, the sentence-builder exercise, and a line of the mini-reading. Writing
> 20 sentences for a unit completes three of five steps. That collapses the 105
> missing sentences from "a content chore" into "the content plan."

Keep the 4 real stories where they are, as a separate Reading section, unlocked
by finishing units rather than built into them.

---

## 4. Free vs paid

Map onto the three tiers that already exist (`lib/access.js` guest gating,
`AccountGate`, `PaywallGate`) rather than inventing a fourth axis.

| tier | gets |
|---|---|
| **Guest** (no account) | Unit 1, all five steps. Reference tab. No progress saved. |
| **Free account** | Units 1–2 complete, progress synced, leveling, **Practice Hub over learned words forever**. |
| **Pro** ($7.99/mo) | Units 3+ as they unlock, the 4 stories, tone history/analytics. |

Three rules that matter more than the tier lines:

1. **Gate whole units, never steps inside a unit.** A unit that stops at step 3
   reads as broken, not as finite. A locked unit with a price on it reads as a
   product. Same content withheld, completely different feeling.
2. **Never gate the Reference tab or the reader's long-press.** 1,351 words is the
   asset that makes someone trust the app. Giving it away is the marketing.
3. **The Practice Hub must stay free and unlimited over learned words.** Without
   it, a free user finishes unit 2 and the app is over — they churn instead of
   converting. With it they keep opening the app, keep levelling, and keep seeing
   the locked path. That is where conversion comes from.

> ⚠️ **Two free units is thin, and the number is worth reconsidering.** 36 words
> is about 15 minutes. A learner has not yet felt the method work, so the first
> paywall lands before the product has proved anything — and units 3 and 5 are
> your *most polished* content, which argues for showing them. Recommend: units
> 1–3 free, first paywall at unit 4. Costs one unit of content and moves the wall
> past the first real "I can say something" moment. Your call — the architecture
> is the same either way, it is one flag in `path.js`.

**Do not put unlocking behind payment and effort simultaneously.** If a unit needs
completion of the previous one *and* a subscription, the unlock stops feeling
earned. Pick one gate per unit: units 1–3 earned, 4+ purchased-then-earned.

---

## 5. Making 20 words feel substantial

The five-step flow already turns 20 words into roughly 100 interactions. The risk
is not too little content — it is that the 100 interactions feel like the same
thing five times. Six things that add depth without adding words:

**1. Vary the direction, not the word list.** Each step should ask a different
question about the same 20 words:

```
Flashcards   HM → EN  then  EN → HM
Quiz         audio → meaning        (a different retrieval path)
Tone         produce the word aloud (production, not recognition)
Sentence     the word in a slot     (syntax, not meaning)
Reading      the word in prose      (comprehension in context)
```
Five genuinely different cognitive demands. That is what makes 20 words feel like
a lesson rather than a list.

**2. Per-word mastery, not per-unit completion.** Track each word as
seen → practiced → mastered. `20 words · 14 mastered` is a far richer surface than
a unit checkmark, and it gives the Practice Hub something to target. You already
have `quizProgress.js` and `readingProgress.js` to model it on.

**3. Interleave backwards.** Every unit's quiz draws ~20% of its distractors from
*previous* units. Costs nothing, makes old words keep earning, and is the single
cheapest way to make the course feel cumulative instead of segmented.

**4. Let tone practice be the endless one.** `toneScore.js` and `pronounceScore.js`
already give a numeric score per attempt. A score the learner can push from 72 to
90 is infinitely replayable content you have already built. Surface a personal
best per word.

**5. A unit test that mixes all five modes.** 10 questions, drawn randomly across
the modes, at the end. It reframes the five steps as *practice for* something,
which retroactively makes them feel purposeful.

**6. Do not pad with more words.** The instinct when a unit feels thin is to push
it to 30 words. That makes it longer, not deeper, and it doubles the sentence and
audio debt. 20 words done five ways beats 40 words done twice — and with 105
sentences already outstanding, the cheap move is depth.

---

## 6. Sequencing for one developer

Build in this order. Each stage ships something usable.

**Stage 1 — the spine, no content work (≈1 day).**
`src/data/path.js` with 10 units. `src/lib/pathProgress.js` — unit state,
completion, unlock. Home screen with Continue + the path list. Units 3, 5, 8 are
playable end-to-end immediately because their content is already there. Everything
else shows as locked. **You will have a real progressive course on day one.**

**Stage 2 — the unit screen (≈2 days).** The 5-step container. Reuse the existing
flashcard, quiz, tone and sentence-builder components; do not rewrite them, wrap
them and pass a word list.

⚠️ **Make the tone step skip itself when the unit has <50% audio coverage**, rather
than showing a broken step. `resolveAudioSrc` already returns null silently, so a
missing clip is a no-op — lean on that. A unit with 4 of 5 steps is a fine unit; a
unit with a dead step is a bug report.

**Stage 3 — mini-readings (≈half a day).** Generate step 5 from each unit's
example sentences. No new content, no new authoring.

**Stage 4 — the content grind (the real work).** 105 sentences, 98 clips. Do it
**one unit at a time, sentences before audio**, because sentences unlock three
steps and audio unlocks one. Order: unit 2 (8 sentences) → 7 (3) → 8 (5) → 4 (4)
→ 1 (19) → 9 (14) → 10 (16) → 6 (36).

Front-loading the cheap units means units 2, 4, 7 and 8 all go live for the cost
of 20 sentences total.

**Stage 5 — Practice Hub, then the paywall.** Ship the wall last. You want the
free experience good enough that a wall is disappointing rather than expected.

### What not to build
- **No new vocabulary.** 1,351 words with 23% example coverage is already lopsided;
  breadth was measured as a non-constraint on 2026-09-16 and nothing has changed.
- **No SRS scheduler yet.** "Weak words first" in the Practice Hub gets 80% of the
  benefit for 5% of the work. Revisit once there is retention data.
- **No per-unit authored stories.** See §3.
- **No streaks before the path works.** A streak on a course with three playable
  units punishes the learner for your content gap.

---

## 7. The risk to name out loud

This restructure makes the content gap **visible**. Right now 77 unlocked
categories hide the fact that most have no sentences and no audio — a learner
browsing finds something everywhere. A locked linear path with five steps per unit
turns every gap into a closed door with a number on it.

That is the right trade: it is what makes the app feel like a course. But it means
**the path cannot ship wider than the content is deep.** Launch with 5 solid units
rather than 10 thin ones, and add units as the sentences land.

Related: [2026-09-16-vocab-depth-not-breadth-and-grammar-grouped] (the measurement
this plan is built on), [2026-09-20-vocab-batch-import] (the current data state).

---

# Appendix — vocabulary browser visual pass (same day)

Done before the progression work, because the browser is what the path will be
built on top of and it was reading as one long cream column.

## What changed

**`src/lib/vocabAccent.js`** (new) — six accents, one hue per theme, drawn from
tokens verified to exist in all three themes (light, dark, neon). A token missing
from one theme renders invisible rather than erroring, so that check came first.

**⚠️ The card system is untouched, and that is the constraint that shaped this.**
The app's rule is cream-50 cards on a seafoam ground, with the reading module as
the single sanctioned exception. Tinting the cards would have created twelve more
exceptions. So colour lands on exactly two things:

- the 64pt icon medallion — big enough to identify, too small to compete
- the progress fill — which was `clay-600` on every bar in the app

Same card recipe, same ground, same type ladder. What changed is that "Nature &
Food" and "Grammar & Function Words" no longer look like the same card.

**The emoji is back on theme cards, differently.** It was removed on 2026-08-29 as
a strip of three borrowed from a theme's categories, which read as clutter — three
marks identifying nothing in particular. The fix was not "no image", it was "one
image": each theme now carries its own `emoji` in `CATEGORY_THEMES`, shown in an
accent medallion, matching the anatomy of the category rows one level down.

**A stat band** replaced the grey sentence under the title. "1,351 words in 77
categories" was the most impressive fact about this app set in its least
impressive typeface; it is now three cards.

**`ProgressBar` gained an optional `fill`.** Defaults to `bg-clay-600`, so the 8
other call sites in the app are unchanged.

## ⚠️ One hue per PAGE, not per category

A per-category colour was the obvious move and it looked like a bag of skittles:
13 rows in 6 hues reads as noise, not as information. Every category inherits its
**theme's** hue instead, so a group page holds together as a set and confirms the
card you tapped to get there. Verified: no two adjacent themes share a hue.

## ⚠️ Two traps in this codebase, both live here

1. **NativeWind compiles classes by scanning source files.** A class built at
   runtime — `` `bg-${hue}-200` `` — is never compiled and renders as nothing, silently.
   Every class in `vocabAccent.js` is written out as a literal string for that
   reason, and there is a check in the file's header comment saying not to
   refactor them. An assertion run after the change confirmed all 18 accent
   classes appear as literals in the source.
2. **A `style` prop as a FUNCTION makes a Pressable invisible on native.** None
   was introduced; grep confirms zero in the touched files.

## What was deliberately not done

- **No 2-column tile grid.** It was the first idea and it loses the row's second
  tap target — the quiz chip on the right-hand end. Prettier, less useful.
- **No progress rings.** Needs SVG and buys little over a bar plus a percentage.
- **No per-category hues.** See above.

## Verification

```
npx eslint (6 touched files)        → clean
accents resolve for all 12 themes  → yes, 0 adjacent clashes
all 18 accent classes are literals → yes
ProgressBar call sites without fill → 8, all still clay-600
RowIcon without accent (drills)    → falls back to the original cream/clay
check-vocabulary.mjs               → still passes
```
