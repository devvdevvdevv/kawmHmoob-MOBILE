# The sentence builder stops offering everything at once (2026-10-19)

*"need to make sentence builder more organized and less janky"* — and when asked which
specific jank, the real brief: *"everything is disorganized, the ui- i do not like it.
Importantly, I want this to be duolingo style, so users cannot have everything at once,
gotta progress to move forward."*

Rollback: `archive/2026-10-19-pre-sentence-builder-duolingo/` (its README says how).

## ⚠️ The question I asked first, and why

The first move was a jank hunt, not a redesign — four specific candidates (a status row
that reflowed mid-drill, an endlessly pulsing badge, a seven-block feedback panel, chips
moving). That was the wrong frame, and the author corrected it.

**Asking was still right.** The memory rule from the reverted Paths redesign (2026-09-25)
is that a vague "make the UI better" means fix the specific irritant, never restructure a
working layout. This brief turned out to be a genuine restructure WITH a named model —
but that only became clear because the question got asked. The cost of asking was one
message; the cost of guessing was a revert last time.

**The second question was the one that mattered**: where should the gating live? The app
already unlocks 41 path units positionally. The author chose **reuse the path**, which is
why this screen stores no progress of its own.

## What the hub was

**27 drills, every one unlocked**, in two swappable axes:

| axis | groups | biggest |
|---|---|---|
| By grammar | 17 | `gp-pronouns`, **277 exercises** |
| By topic | 10 | `grammar-words`, 204 |

…plus a "Mixed practice" hero over **all 437 sentences in the app**. Every door open on
arrival, and no answer to "what should I do now?".

## What it is

```
Up next                 the first unit whose sentences are not done → links to the UNIT
Yours to practise       one row per COMPLETED unit with a sentence set
Mixed review            scoped to those units only
Later                   the next three, locked, naming what opens them
```

⚠️ **UNLOCKED = THE UNIT IS COMPLETE**, derived every render from `pathProgress`
(`isUnitComplete`) and `stepAvailability(unit).sentences`. **Nothing is stored.** A second
progression system would be a second thing to keep in sync and the first to drift — the
path already derives completion from `vocabProgress`, `quizScores` and `completedSteps`.

⚠️ **UP NEXT LINKS TO THE UNIT, NOT INTO THE DRILL.** Sentences are step 4 of a unit;
arriving there having skipped the flashcards and the quiz is how a drill feels impossible
rather than hard.

⚠️ **LOCKED SETS ARE SHOWN, NOT HIDDEN**, each naming the unit that opens it. A wall with
no reason reads as a bug; a wall with a reason reads as a next step. Three, so the shape of
what is coming is visible without the screen becoming a menu again.

## ⚠️ Mixed review had to be scoped, or the rework was cosmetic

The old Mixed card shuffled **every** sentence in the app. Left as it was, a learner on
unit 4 would still be served unit 31's grammar — the old screen wearing a new label.

New in `src/lib/sentenceBuilder.js`:

```js
export const UNLOCKED_MIXED = 'unlocked'
export function exercisesForUnits(unitIds = [])   // pools path-<id>, dedupes by ex.id
// exercisesInGroup: if (groupId === UNLOCKED_MIXED) return exercisesForUnits(unitIds)
```

⚠️ **THE UNIT IDS COME FROM THE CALLER.** `sentenceBuilder.js` is data — it knows what
exercises exist, never what a learner has finished. The hub derives the list and passes it
in the URL (`/words/sentences/unlocked?units=u-greetings,u-pronouns`), which the drill
screen reads into `unitIds` and threads through `exercisesInGroup` and
`buildSentenceSession`. Same data/progress split as every other surface.

Measured with three units complete: **38 sentences in the pool, against 437 app-wide.**
An empty scope returns **0, not everything** — deliberately, so a missing param shows an
empty drill rather than silently restoring the old behaviour.

### ⚠️ A bug caught before it shipped

`groupOpenFor('unlocked', false)` returned **false**, which would have shown a free learner
**the Pro upgrade wall on a review of their own completed units.** Two reasons it was
wrong: the content was already gated on the way in, and the fallback count asks
`exercisesInGroup('unlocked', { freeOnly: true })`, which with no `unitIds` is an empty
pool that reads as "too little content". `UNLOCKED_MIXED` is now explicitly always open,
with the reasoning in the code.

## The drill screen

| | before | after |
|---|---|---|
| status row | **five items** on one wrapped line — `Sentence 3 of 5 · 2 correct · 1/3 misses · 40 pts · [2 left today]` | `3 / 5` left; misses + quota badge right; progress bar under |
| Continue | after **seven** stacked blocks — often below the fold, and off-screen entirely on a wrong answer with a grammar hint | **directly under the answer**; source line, grammar rule and word breakdown moved below it |
| the (i) badge | `Animated.loop` with no end — still blinking while you read the answer | 3 iterations, then it settles |

⚠️ **THE WRAP POINT USED TO MOVE AS THE NUMBERS GREW** (9→10 correct, 40→100 pts), so the
header visibly rearranged itself between sentences. That was the "janky" part that was
real rather than taste.

⚠️ **`score` AND `points` LEFT THE MID-DRILL HEADER, NOT THE APP.** The results card
already ends every session with Sentences / Word accuracy / Points as its three stats. A
number you cannot act on mid-drill is clutter in the one place the learner needs to read a
sentence.

⚠️ **THE QUOTA BADGE STAYED MID-DRILL ON PURPOSE** — a deliberate 2026-09-12 decision
("seeing '1 left today' while playing is what makes the cap legible instead of a surprise
at the start of the next session"). It only moved to the end of its row.

Nothing in the feedback panel was removed; the reading order still works — read the
answer, continue, or stay and look at why.

## Nothing was deleted

- The **27 groups still exist and still work** — `sentenceGroups()`, `grammarGroups()`,
  `groupOpenFor()` and `MIXED` are untouched in the lib, and `/words/sentences/gp-pronouns`
  resolves if typed. They are no longer advertised.
- The **old two-axis screen is preserved whole** in a comment at the foot of
  `app/words/sentences/index.jsx`, with a note on where it belongs if it returns.
- Both files are in the archive verbatim (189 and 796 lines).

## Verified

- Simulated a learner with three units complete: 3 unlocked, up next = Common Nouns,
  review pool 38, empty scope 0.
- A real scoped session builds: 5 sentences, all from the two named units.
- `groupOpenFor('unlocked', free)` → true; `groupOpenFor('gp-pronouns', free)` unchanged.
- Lint clean on all three files; `check-undefined-refs` 299 files clean; `check-scoring`
  behaviour checks pass.

## ⚠️ Not verified, and one real loss

**Nobody has used this on a device.** The thing to judge is whether "Up next → go to the
unit" feels like progress or like being sent away.

**The grammar drills are now unreachable from the UI** — 17 of them, up to 277 exercises,
and the one question the new screen cannot answer ("drill me on negation"). That is a
genuine regression in capability, accepted for now because the brief was explicitly about
not showing everything. ⚠️ **If they come back, they belong BELOW the unlocked list as an
"advanced" section, not as the screen itself** — the comment in the file says so too.

## Still open

- Device pass on the gated hub.
- Decide the grammar drills' fate: advanced section, path-unit mapping, or left as
  typed-URL only.
- The hub shows at most 3 locked units; with 41 live there is no "see the whole path" link
  on this screen yet (the path tab has one).
