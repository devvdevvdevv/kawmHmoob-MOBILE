# Sentence builder scoring, and the Words hub reordered (2026-09-12)

Two changes made on 2026-09-12, written up on 09-14. The code comments carry the
same date, so a `grep` for "2026-09-12" in
`src/lib/sentenceBuilder.js` / `app/words/index.jsx` lands on the reasoning
below.

The results-screen UI that *displays* all of this was rebuilt two days later —
see [2026-09-14-dark-mode-letters-and-results-ui].

---

## 1. Points and word accuracy

The drill already had `score` — "N of M sentences", pass/fail. Two additive
stats now sit on top of it, both in `src/lib/sentenceBuilder.js`.

### `wordAccuracy(placed, exercise)` — partial credit

Counts how many chips landed in their correct slot, independent of whether the
sentence as a whole was right. A learner who gets 4 of 5 words home now sees
that, instead of a flat "wrong" that erases the difference between *one word
swapped* and *totally scrambled*.

Feeds two places: an inline "3 of 5 words in the right spot" under a wrong
answer, and a session-wide percentage on the results screen.

> ⚠️ **It is position-based, and `isSentenceCorrect` is not.** That function
> compares the built STRING, deliberately — when a sentence repeats a word,
> putting the two identical chips in the other order still reads correctly (see
> the 2026-08-29 note). But that same swap means each chip's own slot doesn't
> match, so a position-based count would call a fully correct sentence
> "4 of 5 words". `wordAccuracy` therefore feeds **only** the stat and the hint,
> never the pass/fail — so the contradiction can never surface on screen.

Safe to index `placed[i]` directly: Check is only enabled once every slot is
filled, so `placed.length === tokens.length` always holds at call time.

### `pointsForExercise(exercise)` — difficulty-scaled

```
POINTS_BASE            = 10   // a MIN_TOKENS (3-chip) sentence
POINTS_PER_EXTRA_TOKEN =  2   // per chip beyond that
```

So 3 chips = 10pts, 9 chips (the longest in the pool) = 22pts. Points are
deliberately **not** a re-skin of `score` — if every correct answer were worth
the same, the number would carry no information `score` doesn't already have.
Scaling by chip count makes it track the difficulty of what was actually done.

### `PERFECT_BONUS = 20`

One-time, on a session where every sentence was right. Roughly double a single
sentence's base — the same ratio `lib/leveling.js` already uses between
`quiz-complete` (5) and `quiz-perfect` (10) — so "perfect" reads as a real bonus
rather than a rounding error.

Awarded in `next()` at the transition to the results phase, guarded by
`score === session.length`, which is the identical test the results screen uses
for `perfect`/confetti. Safe to read `score` non-functionally there: `check()`
ran and flushed on a previous interaction, so the value is current.

### ⚠️ Session-scoped on purpose — NOT wired to global XP

Nothing here writes to `ProgressContext`. That holds the boundary the original
build set ("Deliberately not in v1: no XP or progress writes" — the 2026-08-29
note); a score lives and dies with the session.

Worth knowing if that's ever revisited: the app currently has **two disconnected
economies**.

| | what it is | wired up? |
|---|---|---|
| `ProgressContext.xp` | one counter, bumped by flat deltas inside `markLessonComplete` (+10), `markStepComplete` (+2), `recordQuizScore` (+5), `setVocabStatus` (+1) | ✅ this is the real one |
| `lib/leveling.js` | `POINT_SOURCES` by named source, `capped`/`DAILY_CAP`, level curve | ❌ only `pass.jsx` reads it, to *display* the table |

`quiz-complete` and `quiz-perfect` are defined in `POINT_SOURCES` and called
from nowhere. So routing sentence-builder points into "the economy" is not a
one-liner — it would mean picking which of the two is real, and `DAILY_CAP`
needs per-day earned tracking that no existing path implements. That's a
project, not a follow-up, which is why this stayed local.

### Confetti

Already existed and was already correct — `perfect = score === session.length`.
With the default `SESSION_LENGTH` that IS "5 correct", but comparing against
`session.length` keeps it truthful when a group has fewer than 5 exercises
(`buildSentenceSession` uses `.slice`, so a short session is possible). Left
alone.

---

## 2. Words hub reordered, Reading library locked

`app/words/index.jsx` tiles, top to bottom:

```
Vocabulary & quizzes
Reading library        ← isAdmin(user) only
Sentence builder
Notebook
Tone drill
```

### The lock

`isAdmin(user)` from `src/lib/admin.js` — the same check `LessonScroll.jsx` uses
for its admin bypass. Chosen over `__DEV__` so a real device signed into an admin
account still sees it, not just a dev build.

**Why:** `src/data/stories.js` still carries the
`⚠️ PLACEHOLDER STORIES — NOT SHIPPABLE CONTENT` banner on everything except
`story-zaj-dab-neeg-thawj`. The tile was unhidden on 2026-09-08 when that first
story shipped; it's a doorway into mostly-unfinished content until the rest are
real.

### ⚠️ This is the doorway, not the destination

`AdminGate.jsx`'s own comment states the rule this breaks:

> guard the destination, not the doorway

The `/reading` routes have **no** gate. Home, `GlobalSearch` and onboarding's
`WelcomeTour` all still link there, so a non-admin can still reach the module —
this only stops a Words-hub visitor wandering in. Gating the routes themselves
(the `AdminGate` wrapper, as `reading/legacy.jsx` already does) is the actual
enforcement, and is **not done**. Flagged and left to decide.

Not a regression risk for anyone mid-story: the reader has its own back control
in its fixed toolbar, so losing this tile removes forward-discovery only.

Related: [2026-08-29-sentence-builder-barebones],
[2026-08-29-sentence-builder-groups-and-surface],
[2026-08-10-dev-tools-route-and-admin-gate],
[2026-09-08-reading-module-visual-system].
