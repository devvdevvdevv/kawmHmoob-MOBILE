# The path spine — built (2026-09-22)

The progressive-unlock course from `notes/2026-09-20-progressive-unlock-design.md`,
now on screen. The author's brief: categories unlock progressively, each is a
complete mini-lesson (flashcards → quiz → tone → sentences → reading), the first
two are free, finishing one unlocks the next and gives levelling progress, and
there is a clear beginner path.

Teaching guide: `learning/feature-logic/path-spine-explained.md`. Next-step
plan (path inside the Learn tab): `learning/feature-logic/path-into-learn-guide.md`.

Rollback point: `archive/2026-09-22-pre-path-spine/` (README says how).

## ⚠️ First: `src/data/path.js` already existed, and I overwrote it

An 18 KB data file from a 09-20 session was already there — curated verb list,
20-word cap, derived readiness, `livePath()`, `isUnitUnlocked()`. The write tool
said "updated" rather than "created"; I checked, found it in the snapshot taken
minutes earlier, and **restored it byte-identical** before building anything.
Everything below is built ON that file, not instead of it.

The lesson for anyone scripting against this repo: **check a path exists before
writing to it.** The snapshot is the only reason nothing was lost.

## What the learner sees

| where | what |
|---|---|
| **Home** | a **Continue** card first, above everything — one tap into the next step of the next unfinished unit |
| **/path** | every live unit, in order: number, title, one pip per step, locked / open / Pro / done |
| **/path/‹unit›** | the five steps, each done / go / not ready yet; the reward banner when finished |

## The five steps — each reuses the app's own screen

| step | screen | done when |
|---|---|---|
| Flashcards | `/path/‹unit›/flashcards` (new, wraps `Flashcard`) | every unit word has a `vocabProgress` status |
| Quiz | `/quiz/path-‹unit›` → `QuizEngine` | a score of **70%+** |
| Tones | `/words/typing?unit=‹unit›` → the typing drill | a session finished |
| Sentences | `/words/sentences/path-‹unit›` → the sentence builder | a session finished |
| Reading | `/path/‹unit›/reading` (new) | read to the end |

**Tones is the typing drill, not recording.** It grades the tone off the
spelling (typing `zos` for `zoo` is named as a tone error), so it works with no
audio — which is what `path.js` had already planned for step 3 while recording
is paused. **Reading is assembled from the unit's own example sentences**, not
an authored story.

## ⚠️ The decisions that matter

**Completion and unlocking are DERIVED, never stored.** `src/lib/pathProgress.js`
works out whether each step is done from records the app already keeps —
`vocabProgress`, `quizScores`, `completedSteps`. Studying a unit's words in the
Vocabulary tab counts. There is no "unit complete" flag that could disagree
with reality.

**The reward is recorded once, and only as a reward.** Finishing a unit calls
`markLessonComplete('path:‹unit›')`: +10 XP and a streak tick, idempotent.
Nothing reads it back to decide what is unlocked, so a missed or double reward
can never lock or open anything. Step completions add +2 XP each, through the
same existing `markStepComplete`.

**A step without content is SKIPPED, not blocking.** Daily Life has one
human-written sentence, so its sentence step shows "not ready yet" and the unit
completes on four steps. A dead step would be a bug report; a skipped one
appears on its own when the content is written.

**'locked' beats 'pro'.** A free learner sees unit 3 as locked-by-progress
until they finish unit 2, and only then as Pro. Showing a price on a unit they
cannot reach yet asks for money before the free units have made their case.

**Path screens skip the daily allowance — for FREE units only.** The allowance
meters the open library; a free unit that burned the day's quizzes would stall
the free course mid-lesson. But only free units: `/words/sentences/path-u-verbs`
opened by URL by a free learner meters normally, or it would be unlimited free
practice on a Pro unit. Pro units' quizzes are also behind `PaywallGate`.

**Flashcards are NOT the category deck.** `/vocabulary/‹id›` spends the
vocabulary allowance (3 categories/day) and Greetings bundles three categories,
so a free learner would exhaust the day on the free unit's first step. It also
shows the whole category where a unit is a curated slice.

## ⚠️ A conflict I had created, and fixed

On 09-21 the sentence export stopped asking for sentences on **phrases** (the
author's ruling: a phrase is its own example). `path.js`'s readiness test was
never told, and still required every word to have a sentence — so **Greetings
could never go live, nor You & Me**, and a free learner's first unit would have
been Numbers, behind the paywall. Nothing in the course would have been free.

Fixed by putting the rule in ONE place — `isPhraseEntry()` / `hasExample()` in
`src/data/path.js` — which the export now imports instead of keeping its own
copy. The export's hand-copied list of unit categories now reads `path.js` too.

Phrases also became **sentence-builder exercises** in their own unit ("koj lub
npe hu li cas?" as a scramble) and **reading lines**, so Greetings has all five
steps.

## State of the path today

```
live now   Greetings · You & Me · Numbers · Family · Classifiers · Colours ·
           Core Verbs · Time & Days · Daily Life          (9 of 10)
not live   Food & Drinks — 1 sentence short
free       Greetings, You & Me
```

Every live unit has all five steps except Daily Life (sentences skipped).
`node scripts/check-path.mjs` still passes.

## Changed files

- `src/lib/pathProgress.js` — **new**. The derivations; plain JS, importable by
  Node check scripts (takes `hasPro` as a boolean rather than importing a .jsx).
  Step availability is cached per unit: uncached, one render did the whole
  app's sentence tokenising ~100 times (24 ms first, 0.8 ms after).
- `src/components/path/PathList.jsx`, `ContinueCard.jsx` — **new**.
- `app/path/index.jsx`, `app/path/[unitId]/index.jsx`, `flashcards.jsx`,
  `reading.jsx` — **new**.
- `src/data/path.js` — phrase rule; stale "not built" comments updated.
- `src/data/quizzes.js` — `path-‹unit›` quizzes built on demand, deliberately
  NOT in the public `quizzes` list (it feeds the Vocabulary page's counts).
- `src/components/quiz/QuizEngine.jsx` — path quizzes return to their unit.
- `src/lib/sentenceBuilder.js` — `path-‹unit›` groups, phrases included.
- `src/lib/typingDrill.js` — `typingExercisesFor(ids)`; the loop factored into
  a shared builder. **Verified output-identical**: 919 exercises, same order.
- `app/words/typing.jsx`, `app/words/sentences/[groupId].jsx` — `unit` scoping,
  step completion, back-to-unit links.
- `app/(tabs)/index.jsx` — Continue card first; "Beginner path" in Explore.
- `scripts/export-sentences-needed.mjs` — reads the phrase rule and units from
  `path.js`.

Lint: clean on every new file; the changed files carry only warnings/errors
that were already there (verified against the snapshot).

## ⚠️ Not verified

**Nobody has looked at these screens on a device.** Verified by lint, by a Node
walk-through of a learner finishing units (unlock order, 60% quiz failing and
90% passing, the Pro wall, the Continue target), and by reading. Run it and
walk Greetings end to end before trusting it.

## Still open

- **The sentence builder uses only human-written sentences**, so in most units
  that step drills few sentences. Reviewing AI sentences (delete `source: 'ai'`)
  or flipping `INCLUDE_UNREVIEWED_AI` fills it.
- **Food & Drinks** goes live with one more sentence.
- `u-food`, `u-numbers`, `u-time` are capped by `limit` (first 20 in data
  order) — `path.js` explains why a hand-picked `words: [...]` list is the real
  answer, as Core Verbs has.
- Real audio-based tone practice (`PronounceStep`) can replace the typing drill
  for units with clips; the typing drill stays for the rest.
- Guests: the path is open to them like the rest of the app while
  `GUEST_GATING_ENABLED` is off.
