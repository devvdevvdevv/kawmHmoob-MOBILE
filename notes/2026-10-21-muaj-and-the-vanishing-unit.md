# Muaj, the fourth "to be" — and the unit that vanished — 2026-10-21

Two unrelated pieces of work that happened to land together, plus a hazard worth
knowing about.

## 1. The fourth "to be"

Author: *"we are going to be adding a muaj lesson for to be, add a placeholder,
next please for each to be lesson reflect the new muaj definition, and reference
to the new lesson when it shows, additionally, please capitalize the to be,
'Yog' 'Hu ua' etc."*

### `placeholder-muaj`

`muajPlaceholder` in [placeholders.js](../src/data/lessons/placeholders.js) —
**To Be: Muaj | Have, There Is & Age**, `placeholder: true` so it carries the
orange badge. Registered in `lessons.js` directly after `nyob`, so the four sit
together.

**⚠️ EVERY SENTENCE IN IT IS ALREADY IN THE APP**, which is the contract that
file states at the top: a placeholder is built only from reviewed material. The
three uses and their examples come from the author's own "Muaj" section in
`yog-to-be.js`; the age rule (`muaj <number> xyoo`) and the
`muaj` + `nyob` pattern (`Muaj peb leej neeg nyob hauv lub tsev`) are settled
rulings. No new Hmong was written for it.

**⚠️ WHAT THE FULL LESSON STILL OWES:** whether a THING being somewhere takes
`nyob` the way a person does (`Muaj zaub nyob hauv lub tawb`?) is **not**
settled — the 2026-09-28 ruling covers people only. The placeholder avoids the
question; a full lesson cannot.

### The shared list was teaching an incomplete set

`hu-ua.js` and `nyob.js` both carried the same four lines — *"English uses "is,
am, are" for all of these. Hmong splits them, and each has its own lesson"* —
followed by **three** patterns and the sentence *"All three are the same English
'to be'."* `muaj` was the fourth all along: `yog-to-be.js` has taught it as one
of four since it was written. So two of the three lessons were presenting the
set as closed, and short.

Now four lines in all three, "All four", and each lesson names the other three by
title — **To Be: Yog**, **To Be Called: Hu Ua**, **To Be: Nyob**, **To Be:
Muaj** — so every pointer has something to answer it.

### Capitalisation, without wrecking the example sentences

The author asked for `“Yog”`, `“Hu ua”`, `“Nyob”`, `“Muaj”`. **⚠️ The rule only
fires when the quotes hold the word ALONE** (optionally with a trailing `.` or
`,`). That matters because these lessons quote Hmong SENTENCES in the same
curly quotes: `“**Koj yog ib tug neeg zoo**,”` has to keep its lowercase `yog`,
and a looser pattern would have capitalised it mid-sentence.

## 2. ⚠️ The Verb + Noun unit disappeared from /path, and it was a readiness filter

The author: *"dude the path is not there anymore why did you remove it"*. Nothing
had been removed. `path.js` still held the unit, `getUnit` returned it,
`unitWords` resolved 19 cards — and it was **not on the Paths screen**.

`/path` renders `livePath()`, not `path`:

```js
livePath() → pathReadiness().filter(r => r.ready)
unitReadiness(unit) → sentenceReady = words.length > 0 && needExample === 0
```

**One card without an `exampleSentence` takes the whole unit off the screen.**
Ten verb + noun cards had been added for the lesson and six of them had no
sentence yet, so `needExample` was 7 and the unit was filtered out. It looks
exactly like a deleted page.

**The lesson for next time:** after adding words to a unit, check
`unitReadiness(...).ready` — or just run `node scripts/check-path.mjs` — and do
not trust `unitWords()` returning the cards, because it will, right up until the
screen hides the unit. The rule is now written above the `words` array in
`u-verb-noun` so the next person meets it there.

The unit is back, with 17 → 16 cards (`saib TV` commented out at the author's
request). The six sentence-less cards got sentences on the author's **own
template** from `verb-noun.js` (`Kuv <phrase>.`), marked `source: 'ai'` and
`unreviewed`, because the alternative was leaving the unit off the path.
`Kuv tham lus.` is the one most worth a speaker's eye.

## 3. ⚠️ An editor save dropped a registration — twice

`lessons.js` lost its `verbNouns` import and array entry **again** on 2026-10-21
at 09:50, from an editor buffer that predated the 2026-10-20 fix. The symptom is
the one from
[yesterday's note](2026-10-20-verb-noun-not-reachable.md): the lesson exists, the
unit points at it, and the app cannot reach it.

It was caught only because `check-path.mjs` now asserts that an `introLesson` is
**imported AND placed in a `lessons: [...]` array** — the assertion added
yesterday for exactly this. Worth saying plainly: **close and reopen a file in
the editor before editing it after a session of scripted changes**, or a stale
buffer will quietly undo them.
