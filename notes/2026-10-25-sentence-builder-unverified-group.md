# Sentence builder — the AI drafts come back, separated; Mixed review to the top — 2026-10-25

## What the author asked

"whatever happened to the other sentences within sentence builder … now its only limited
to 10?" → explained: 10 is the per-session draw (the author's own 2026-09-27 ruling), and
the pool was 462 verified sentences. The large missing chunk was **854 AI-written examples**
held out by `INCLUDE_UNREVIEWED_AI = false`, plus 110 duplicates, 97 under 3 words, 55 over 9.

Then: "bring them back, but i will verify them … still 'seperate' the unverified ones for
now". And mid-turn: "move the mixed review button to the top, not at the bottom".

## What changed

**`src/lib/sentenceBuilder.js`**
- `INCLUDE_UNREVIEWED_AI` **stays false** — so no draft reaches a topic group, a grammar
  drill, a path unit's Sentences step, or mixed review. Lessons and progress only ever
  drill verified Hmong.
- New group id **`UNVERIFIED = 'unverified'`** and `unverifiedExercises()`: every
  `source: 'ai'` example, same dedupe + 3–9 word window, never a sentence a human entry
  already uses, path-only sets excluded. **752** playable (94 for a free learner — same
  `freeOnly` narrowing as a topic group, so the paywall is intact).
- Each draft's `categoryTitle` is `"<set> (unverified draft)"`, which the session screen
  already prints under every sentence — so the learner is told each time.
- `exercisesInGroup` and `sentenceGroupTitle` know the new id. The session screen needed
  no change.

**`app/words/sentences/index.jsx`**
- **Mixed review moved to the top** (right under the header, above Up next). Block
  unchanged; a comment marks the old spot.
- **"Unverified sentences"** section added LAST on the screen: one muted row (`eye` icon,
  cream-100 like the Later rows, not a featured card) with the count, linking to
  `/words/sentences/unverified`. Shown only when the pool fills a session.

## How verifying works now
Check a sentence → delete its `source: 'ai'` in `vocabulary.js`. It leaves the Unverified
group and joins its real set, path unit and mixed review automatically. No list to keep.

## Verified
- Verified pool unchanged by this edit; unverified 752; a 10-sentence session builds.
- Lint clean on the hub, the lib and the session screen.
