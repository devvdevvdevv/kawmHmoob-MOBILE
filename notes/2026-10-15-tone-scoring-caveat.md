# "Tone scoring is experimental" — attached to the score itself (2026-10-15)

The brief: *"need to add a message that tone scoring is still experimental and
may not be accurate."*

## ⚠️ The message already existed. It was in the wrong place

`app/(tabs)/speak.jsx` shows an `InfoModal` titled **"Tone scoring is
experimental"** on a learner's first visit to Speak, through
`useOnce('speak-beta')`. It says the right thing — and then it is gone forever.

So the app disclosed this **once, on day one**, and said nothing on day twelve
when somebody records a take and reads `71/100`. The number is the thing people
believe, and it was carrying no caveat at all. There is also a `BetaRibbon`
component for exactly this job, used nowhere near the scorer.

The fix is not more words, it is **the words next to the number, every time.**

## What changed

| file | change |
|---|---|
| `src/lib/pronounceScore.js` | **new** `SCORE_CAVEAT` constant, beside `scoreBand()` |
| `src/components/speak/PronounceStep.jsx` | one line under the score |
| `src/components/speak/LessonSteps.jsx` | the same line, in `cream-200` for the dark step |

> Tone scoring is experimental and may not be accurate — trust the curve more
> than the number.

**⚠️ TWO SCREENS SHOW A SCORE, SO THE STRING LIVES IN ONE PLACE.**
`PronounceStep` serves phrase practice, group practice and word-family practice;
`LessonSteps` is the Speak lesson runner. They each render
`scoreBand(result.score)` and `result.score/100` in their own markup. One
exported constant, imported twice — the alternative is two copies of a
disclaimer, and the copy that drifts is the honest one.

## ⚠️ Why the caveat is TRUE, which is the part worth keeping

Not legal cover. The module's own comments already say it:

- **`scoreBand()`'s thresholds were never calibrated.** Its comment: *"THESE
  THRESHOLDS ARE NOT CALIBRATED. No reference contours exist yet
  (src/data/contours.json is {}), so nothing here has been checked against human
  judgement."*
- **There is nothing to score against for most clips.** `contours.json` is empty,
  which is why `no-reference` is one of the `REASON_TEXT` cases.
- The band is shown before the number for the same reason this caveat exists:
  *"A learner shown '71' cannot tell whether that is good."*

This also matches what the app promises on `/about`: pronunciation feedback has
to be right or absent, never confident and wrong. A score with no caveat was the
third thing — confident and unverified.

## Decisions

**One quiet line, not a ribbon.** `BetaRibbon` is an orange block. On every take
it would either shout or be tuned out, and it has to sit under a number without
drowning it. 10px, muted, centred, under the score.

**Only when there IS a score.** The `result.score == null` branch already
explains itself through `REASON_TEXT` ("the native clip plays, but its pitch map
hasn't been generated yet"). Adding "may not be accurate" to "could not score
that" is noise.

**The first-visit modal stays.** It explains the mechanism at length, which a
10px line cannot. They do different jobs; the modal introduces, the line reminds.

## Not verified

Not seen on a device. The thing to look at is the dark variant in the lesson
runner — `cream-200` at 10px on the dark step is the lowest-contrast text either
screen now has, and if it is hard to read there, the caveat is not doing its job.
`SCORE_CAVEAT` is one string in one file, so the wording and the two class lists
are the only things to tune.

Lint: clean on `pronounceScore.js` and `PronounceStep.jsx`. `LessonSteps.jsx`
carries 3 pre-existing unescaped-entity errors and 1 unused-import warning at
lines 3, 64 and 471 — verified identical against the committed version, none of
them from this change.

## Still open

- **Calibrate `scoreBand()`.** The caveat is honest, and it is also a standing
  admission. Generating real contours (`contours.json`) is what lets it be
  removed — see `learning/pronunciation/f0-and-tone-scoring-guide.md`.
- `app/tone-eval.jsx` (the admin eval tool) shows raw scores with no caveat. Left
  alone deliberately: its whole purpose is reading uncalibrated numbers.
