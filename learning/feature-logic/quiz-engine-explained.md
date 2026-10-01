# Learning: how the quiz engine works, end to end

One quiz screen runs **every** quiz in the app — the 77 vocabulary quizzes, the four
drills (Tone Markers, Tone Drill, Pronouns, Greetings), and the beginner path's unit
quizzes. This doc explains the whole machine well enough that you could rebuild it.

It replaces [notes/2026-08-08-quizengine-how-it-works.md](../../notes/2026-08-08-quizengine-how-it-works.md)
and folds in everything that changed after it was written: the direction setting, the
status filter, "every quiz asks every word", path unit quizzes, and the daily
allowance. Line numbers below were checked against the current files on 2026-09-22.

---

## 0. The one-minute version

You tap a quiz. The id in the URL (`vocab-animals`, `tone-drill`, `path-u-greetings`)
is the only input. From that id the app looks up two things — **settings** and
**words** — turns the words into questions, then shows one of six screens depending
on what's true about you and the quiz.

Think of a vending machine:

- **Coins in** → `topicId` from the route
- **The wiring** → config + dataset + preferences + a state machine
- **What drops out** → a question card, a lock screen, a paywall, a "come back
  tomorrow" wall, or a results screen

The single most useful idea in the whole file:

> **QuizEngine owns almost no logic of its own.** It is a coordinator. The real
> decisions live in its neighbours, each of which does exactly one job.

| File | Its one job |
|---|---|
| [src/data/quizzes.js](../../src/data/quizzes.js) | The **menu and the pantry**. `getQuizConfig(id)` = this quiz's settings. `getQuizDataset(id)` = its raw rows, always `{ prompt, answer, id?, audio?, blurb? }`. |
| [src/lib/quizPrefs.js](../../src/lib/quizPrefs.js) | The **learner's standing choices**: direction, length, which words. Persisted on the device. |
| `buildQuestions()` (inside QuizEngine) | The **factory**. Rows in, playable questions with options out. |
| [src/hooks/useQuizState.js](../../src/hooks/useQuizState.js) | The **scoreboard**. Where you are, what you answered, score, streak. |
| [src/lib/access.js](../../src/lib/access.js) | The **study bouncer**. `quizUnlock()` — have you studied enough to be let in? |
| [src/hooks/useDailyQuota.js](../../src/hooks/useDailyQuota.js) | The **turnstile**. Two quizzes a day on the free tier. |
| [src/context/ProgressContext.jsx](../../src/context/ProgressContext.jsx) | The **filing cabinet**. `recordQuizScore()` saves the finished attempt. |
| `QuizResults`, `PaywallGate`, `QuotaWall`, `ConfirmModal` | Screens it hands off to. |

---

## 1. From an id to a pile of rows

### The config — what kind of quiz is this?

[`getQuizConfig(id)`](../../src/data/quizzes.js#L124) looks the id up in the
`quizzes` array, and if it isn't there, tries to build a path unit quiz:

```js
export function getQuizConfig(id) {
  return quizzes.find((q) => q.id === id) || pathQuizConfig(id)
}
```

A config is small: `{ id, title, description, questionTypes, category, reversible,
questionCount, tier? }`.

Two of those fields carry real rules, and both are **properties of the data, not
preferences**:

- **`reversible`** — can this quiz be asked backwards? `vocab-*` can (Hmong word ↔
  English gloss, both are real questions). `tone-drill` cannot, and that is the
  case to remember: dozens of words have the tone "Low", so reversed, the prompt
  "Low" would have dozens of correct answers. **A many-to-one dataset can only be
  asked in the many→one direction.**
- **`tier`** — `'pro'` puts the quiz behind `PaywallGate`. Path unit quizzes get
  theirs from the unit's own `free` flag ([quizzes.js:147](../../src/data/quizzes.js#L147)),
  so a Pro unit's quiz is still walled if you paste its URL directly.

**`questionCount` is never typed by hand.** It's derived where the list is built:

```js
export const quizzes = QUIZ_DEFS.map((q) => ({
  ...q,
  questionCount: getQuizDataset(q.id).length,
}))
```

Every quiz asks everything it has. Before this, a 31-word category was tested with a
10-question sample, so two thirds of it never came up and 100% meant "I know 10 of
these 31". Deriving the number also means adding a word to a category grows its quiz
with no second place to update. (Background: [2026-08-29-quizzes-ask-every-word](../../notes/2026-08-29-quizzes-ask-every-word.md).)

### The dataset — the actual rows

[`getQuizDataset(id)`](../../src/data/quizzes.js#L174) is a big dispatcher, and its
whole discipline is that **every branch returns the same shape**:

```js
{ id?, prompt, answer, audio?, blurb? }
```

- `path-*` → the unit's words, via `unitWords(getUnit(...))`
- `vocab-*` → that category's words
- `alphabet-tones`, `tone-drill`, `grammar-pronouns`, `everyday-greetings` → a
  `switch` that adapts each data source
- anything else → `[]`

That one-shape rule is why later features were cheap. Reversing a quiz is swapping two
fields. Filtering by word status only works because vocab and path rows carry the
word's own `id`, which is the key into `vocabProgress`.

---

## 2. The learner's preferences

[`useQuizPrefs()`](../../src/lib/quizPrefs.js#L115) reads one stored object:

```js
export const DEFAULT_PREFS = {
  direction: HMONG_TO_ENGLISH,   // or english-hmong
  questionCount: 'all',          // or 10 / 20 / 30
  questionType: 'quiz-default',  // ⚠️ commented out of the UI, see §7
  statusFilter: 'all',           // or learning / known / new
  cardOrder: 'chronological',    // flashcards, not quizzes
}
```

Three things in this file are worth stealing for any settings feature you write:

**One object, not a key per setting.** Every consumer wants several at once. One
object = one async read, one `ready` flag, one write.

**`ready` is load-bearing.** The read is async. Without it, the quiz would build its
questions from the defaults before your stored settings arrived, and the settings
would appear to do nothing on the first quiz after each app launch. That's why the
auto-start effect waits on `prefsReady`.

**`normalize()` distrusts what it loads.** A stored blob outlives the build that
wrote it. Anything that isn't a currently-offered value is dropped back to the
default, so a removed option can't come back as a value nothing can render.

Two pure helpers live here too, next to the options they describe:

- [`applyStatusFilter`](../../src/lib/quizPrefs.js#L155) — **refuses to return an
  empty set**. "Only Known" before you've marked anything known would make a quiz
  with no questions, which reads as a broken screen. It falls back to the full set
  and reports `fellBack: true` so the UI can say why.
- [`resolveCount`](../../src/lib/quizPrefs.js#L163) — `'all'` means everything;
  a number means `Math.min(preference, available)`, because you can't ask 10
  questions from 6 words.

---

## 3. Rows → questions (plain JavaScript, no React)

`shuffle` and `buildQuestions` sit at the top of the file, outside the component. No
hooks, no state — you could paste them into a blank `.js` file and run them. That's
deliberate, and it's the part worth copying in your own features: **keep the
transformation pure, and let React only decide when to call it.**

### `shuffle(arr)` — [QuizEngine.jsx:40-47](../../src/components/quiz/QuizEngine.jsx#L40-L47)

Fisher–Yates. Walk backwards, swap each slot with a random earlier one. It copies
first (`arr.slice()`), so it never mutates the dataset it was handed — that dataset
comes from your data modules and is reused everywhere.

### `buildQuestions(config, dataset, prefs)` — [QuizEngine.jsx:49-100](../../src/components/quiz/QuizEngine.jsx#L49-L100)

Read it as four steps.

**1. How many, and which.**
```js
const count = resolveCount(prefs.questionCount, dataset.length)
const pool = shuffle(dataset).slice(0, count)
```

**2. Each question's type.**
```js
const type = types[i % types.length]
```
The `%` makes it *cycle*. With `['multiple-choice', 'matching']` you'd get MC,
matching, MC, matching… Every live quiz declares only `['multiple-choice']`, so today
it always lands on index 0.

**3. The wrong answers ("distractors") — the cleverest bit.**
```js
const alsoCorrect = new Set(
  dataset.filter((d) => d.prompt === item.prompt).map((d) => d.answer)
)
const distinctWrong = [...new Set(dataset.map((d) => d.answer))].filter(
  (a) => !alsoCorrect.has(a)
)
const distractors = shuffle(distinctWrong).slice(0, 3)
const options = shuffle([item.answer, ...distractors])
```

Two separate bugs are being prevented here, and each came from a real report:

- **The `Set` around every answer** kills *duplicate options*. In Tone Drill, ~30
  words map to 8 tones, so picking 3 random wrong **items** produced options like
  `["Low", "Low", "High", "Rising"]`. Deduping the answer **strings** guarantees four
  distinct options. ([2026-08-04-quiz-distinct-options](../../notes/2026-08-04-quiz-distinct-options.md))
- **`alsoCorrect`** kills *two right answers*. Two rows can share a **prompt**:
  English "because" maps to both `vim` and `vim hais tias`. Asked in reverse, a plain
  `a !== item.answer` check would happily offer both and mark one wrong. Rare (8
  glosses in 476) and silently unfair — and only possible once quizzes could be
  reversed. ([2026-08-29-quiz-direction-setting](../../notes/2026-08-29-quiz-direction-setting.md))

**4. Matching questions** take 4 pairs and force the current item to be one of them
(`if (!pairs.find(...)) pairs[0] = item`), so the question is always about a word you
actually drew.

---

## 4. Inside the component: the order of operations

This is the part the old note predates most, and the **order matters**:

```js
const config  = getQuizConfig(topicId)                       // line 105
const { prefs, ready: prefsReady } = useQuizPrefs()          // line 110
const statusOf = useMemo(...)                                // line 118 — vocab-only
const { dataset, filterFellBack } = useMemo(() => {          // line 126
  const raw = getQuizDataset(topicId)
  const { dataset: filtered, fellBack } = applyStatusFilter(raw, prefs.statusFilter, statusOf)
  return { dataset: orientDataset(filtered, prefs.direction, config), filterFellBack: fellBack }
}, [...])
const unlock   = quizUnlock(topicId, vocabProgress)          // line 155
const questions = useMemo(() => buildQuestions(config, dataset, prefs), [...])  // line 174
```

**Filter *before* you flip.** The status lookup keys off the item's word id, not off
which side is showing. Doing it the other way round happens to work today only
because `orientDataset` preserves `id` — the comment at line 123 says so, and that's
the kind of ordering assumption worth writing down rather than rediscovering.

`statusOf` returns `null` for anything that isn't a `vocab-` quiz, which makes the
filter a no-op for the drills. A feature that only applies to some data should
disable itself by returning `null`, not by making every caller remember to check.

---

## 5. The render ladder — the order *is* the business logic

After the hooks there's a run of early returns. Each one means "if this is true,
nothing below matters":

| # | Condition | Line | What shows |
|---|---|---|---|
| 1 | `!config` | [248](../../src/components/quiz/QuizEngine.jsx#L248) | "Quiz not found." — an unknown id |
| 2 | `dataset.length === 0` | [257](../../src/components/quiz/QuizEngine.jsx#L257) | "No data available yet." — config exists, data doesn't |
| 3 | `locked` | [269](../../src/components/quiz/QuizEngine.jsx#L269) | 🔒 Study the words first, with a progress bar |
| 4 | `quota.exhausted` | [309](../../src/components/quiz/QuizEngine.jsx#L309) | `<QuotaWall />` — today's two are spent |
| 5 | `finished` / `reviewing` | [322](../../src/components/quiz/QuizEngine.jsx#L322) | `<QuizResults>` |
| 6 | otherwise | [347](../../src/components/quiz/QuizEngine.jsx#L347) | the live question card |

Screens 5 and 6 are both wrapped in `<PaywallGate tier={config.tier}>`, which is a
**seventh** gate sitting across them rather than in the ladder.

### Four independent gates, and why they don't collapse into one

This is the design idea most worth taking away:

| Gate | Axis it measures | Where it's decided |
|---|---|---|
| Study lock | have you *learned* these words? | `quizUnlock()` in access.js |
| Daily allowance | have you used today's free practice? | `useDailyQuota` |
| Paywall | have you *paid*? | `PaywallGate` + `config.tier` |
| Guest limits | do you have an *account*? | `GUEST_GATING_ENABLED` (currently off) |

They're different questions, so they're different code. Any of them can apply at
once, and none of them knows about the others.

**The study lock is real enforcement, not decoration.** `locked = unlock.gated &&
!unlock.unlocked` ([line 179](../../src/components/quiz/QuizEngine.jsx#L179)). The
Vocabulary page already swaps a locked quiz's row for a "study N more" line — but a
list is only a *suggestion*, and a deep link to `/quiz/vocab-animals` walks straight
past it. This guard is the wall.

Its rule, from [access.js:67](../../src/lib/access.js#L67): only `vocab-*` quizzes are
gated (the drills have no word set to study), and a category unlocks at **half its
words studied** (`QUIZ_UNLOCK_RATIO = 0.5`, rounded up). "Studied" is **derived** — a
word gets an entry in `vocabProgress` the moment you mark it Learning or Known — so
the gate cannot drift out of sync with your progress. No new state was invented for
it.

### The daily allowance skips the path

```js
const quota = useDailyQuota('quiz', quotaLimit('quiz', user.isGuest),
  { enabled: !isPro && !pathUnitId, scope: user?.id || 'guest' })
```

Free tier gets 2 quizzes a day — but **not on a path unit quiz**. The allowance meters
the open library; a free unit that burned the day's two quizzes would stall the free
course partway through its own lesson. `PaywallGate` still applies, so a Pro unit is
still Pro.

How the quota itself works (see [learning/monetization/quota-enforcement-guide.md](../monetization/quota-enforcement-guide.md)):
store `{ date, count }` per user+feature; if the stored date isn't today, the count
reads as 0. **The date is the reset** — no cron, no timer.

### Where "back" goes

[Lines 186-207](../../src/components/quiz/QuizEngine.jsx#L186-L207) compute one
`backTo`, one `backLabel` and the breadcrumbs from the id's prefix:

- `path-<unitId>` → `/path/<unitId>`, "Back to the unit" — the unit screen holds its
  other four steps
- `vocab-<catId>` → `/vocabulary/<catId>`, "Back to the words" — where you go to fix
  a bad score
- anything else → `/vocabulary`

There's no "back to Quizzes" because the quiz menu was retired when Vocabulary
absorbed it.

---

## 6. The state machine, and one tap end to end

### `useQuizState` — [src/hooks/useQuizState.js](../../src/hooks/useQuizState.js)

A `useReducer`. If reducers feel abstract: it's a box holding an object, and the only
way to change it is to send a named message. The reducer is the rulebook.

State: `{ status, questions, currentIndex, answers[], score, streak, bestStreak,
startedAt, finishedAt }`.

```
idle ──start()──► active ──next() past the last question──► finished ──review()──► reviewing
  ▲                                                                                    │
  └──────────────────────────────── reset() ◄─────────────────────────────────────────┘
```

- **`start`** wipes to `initial`, stores the questions, stamps `startedAt`. The
  questions are **frozen into state here** — this is why changing a setting mid-quiz
  can't affect the run you're looking at.
- **`answer`** appends to `answers[]`, `+1` to score if correct, and
  `streak = isCorrect ? state.streak + 1 : 0` — wrong resets to zero, while
  `bestStreak` keeps the high-water mark with `Math.max`. It deliberately does **not**
  advance the question; that's `next`'s job, and that split is what lets the feedback
  banner sit on screen.
- **`next`** is the only place a quiz ends.
- **`review`** just flips status — the answers were recorded all along.
- **`reset`** goes back to `initial`, which re-arms the auto-start effect.

### One tap, all the way through

1. `MultipleChoice` calls `onPick(opt)` — [line 400](../../src/components/quiz/QuizEngine.jsx#L400)
2. `if (feedback) return` — the **double-tap guard**. Feedback set means this question
   is already answered; bail so it can't score twice.
3. `const isCorrect = opt === q.answer` — a plain string compare
4. `answer(opt, isCorrect)` → the reducer records it
5. `setFeedback('correct' | 'incorrect')` → the green/red banner renders
6. The options **freeze**: `showResult` disables every `Pressable`, the right answer
   goes green, the rest dim. You always see the answer, even when you were right.
7. **Next** → `setFeedback(null); next()`. Both matter — clearing feedback is what
   re-enables tapping.
8. On the last question that same button reads "Finish" (computed from
   `currentIndex + 1 >= questions.length`) and `next()` flips status to `finished`.

**Why is `feedback` local `useState` instead of reducer state?** Because it's about
the *screen*, not the *quiz*. The reducer holds what happened (durable, gets saved);
`feedback` is "is a banner showing right now". Same for `elapsed`, `showQuitConfirm`,
`savedThisRun`. Generalise it: **durable facts → reducer; what's on screen right
now → `useState`.**

### The three effects

**1. Auto-start** — [line 215](../../src/components/quiz/QuizEngine.jsx#L215)
```js
if (config && !locked && prefsReady && questions.length > 0 &&
    state.status === 'idle' && !quota.exhausted && quota.ready) {
  start(questions)
  quota.consume()
}
```
Seven conditions, each one a bug that would otherwise happen: no config, a gated quiz
building questions anyway, defaults used before prefs load, an empty deck, an infinite
loop, spending an allowance you don't have, and acting before the async quota read
lands. `status === 'idle'` is the one that stops it looping — the moment it fires,
status is `active` and the condition is false. It's also why **Retry** works:
`reset()` → `idle` → this effect deals a fresh hand.

**2. The timer** — [line 223](../../src/components/quiz/QuizEngine.jsx#L223). A
`setInterval` that recomputes `elapsed` from `Date.now() - state.startedAt`, so a
dropped tick can't make the clock drift. It runs only while `active`, and
`return () => clearInterval(id)` kills it on unmount. **Forgetting that return line is
the classic React Native leak.**

**3. Save once** — [line 232](../../src/components/quiz/QuizEngine.jsx#L232). On
`finished`, compute accuracy and call `recordQuizScore()` (which appends to
`quizScores`, adds XP, ticks the streak). `savedThisRun` is the **idempotency latch**:
effects re-run on any re-render, and without it one quiz could file several times.
Retry clears the latch so the next attempt saves too.

This is also what the beginner path reads: a path unit's quiz step counts as done at
**70%**, computed from `quizScores` — nothing writes a "step complete" flag that could
disagree with reality.

### The two question components

**`MultipleChoice`** ([line 463](../../src/components/quiz/QuizEngine.jsx#L463)) is
stateless. Every "does it turn green" decision is derived at render time from
`feedback` + `opt === question.answer`. Nothing to keep in sync.

**`Matching`** ([line 493](../../src/components/quiz/QuizEngine.jsx#L493)) owns state,
because it's a multi-step interaction: `leftSel` (which Hmong word is selected) and
`pairs` (the matches so far). Tap left, then tap right. Two details worth stealing:

```js
if (Object.keys(nextPairs).length === lefts.length) {
  const allCorrect = question.pairs.every((p) => nextPairs[p.prompt] === p.answer)
  onComplete(allCorrect)
}
```
It grades only when every left item is matched, all-or-nothing — and it checks
`nextPairs`, the fresh object, **not** `pairs`. Reading `pairs` there would use the
pre-update value and be off by one match, because state updates aren't visible until
the next render.

The right-hand column is shuffled in a `useMemo` keyed on `question`, so it doesn't
re-randomise on every tap, but does re-shuffle on a new question.

---

## 7. Things that are deliberately switched off

Three features are commented out rather than deleted, and each teaches something:

**Matching, as a setting.** The engine has always supported it, but no quiz has ever
declared it, so the mode has never really run. It was commented out in **two** places
that must be restored together — the control in `QuizSettingsSheet.jsx` and the
`types` override in `buildQuestions` ([lines 51-63](../../src/components/quiz/QuizEngine.jsx#L51-L63)).
Why both? **The preference is persisted.** Hiding only the control would strand
anyone who had already chosen "Matching only" in an untested mode with no way back.
Ignoring the stored value returns every quiz to its own declared types.

**The ⚙ inside a running quiz** ([lines 362-393](../../src/components/quiz/QuizEngine.jsx#L362-L393)).
It was wedged among the ⏱/🔥/★ chips, which wrap on a phone, so it was invisible —
and by the time a quiz is running, its questions are already built, so nothing it
changed applied to the run you were looking at. The gear that matters lives on the
vocabulary category page, above the quiz button.

**`settingNotes`** ([lines 143-154](../../src/components/quiz/QuizEngine.jsx#L143-L154))
is currently unused, and kept anyway because it's the *logic*, not the widget: it's
the list of reasons a setting silently does nothing on this quiz ("this quiz can only
be asked one way", "no words match that filter yet"). Told next to the control that
didn't behave, not as a toast you'd miss.

---

## 8. Things worth knowing before you change it

Both bugs the August note flagged are **fixed**: the quota hook is now called properly
inside the component ([line 213](../../src/components/quiz/QuizEngine.jsx#L213)), and
`dataset` has its own `useMemo`, so the `questions` memo is real.

What's still live:

- **Retry spends another quiz from the daily allowance.** `onRetry` calls `reset()` →
  status is `idle` → the auto-start effect fires → `quota.consume()` again. Defensible
  (a retry is another sitting) but it's a decision, not an accident — if you want a
  free retry, the effect needs to know the difference between a first deal and a redeal.
- **Quitting can do the same.** `confirmQuit` calls `reset()` *then* navigates, so the
  effect can re-deal in the frame before navigation lands.
- **Matching answers record as the literal string `'matching'`**
  (`answer('matching', isCorrect)`), so the review screen can't show what you picked
  for those. Moot while matching is off.
- **`getQuizDataset(topicId)` runs before the `!config` guard**, and it does
  `id.startsWith(...)`. A missing route param would throw rather than show the
  friendly "Quiz not found."
- **`elapsed` freezes at the finish** and is handed to `QuizResults` as the final
  time. Retry explicitly zeroes it.
- **Quiz ids are progress keys.** They live in users' saved `quizScores`. Renaming an
  id orphans every score filed under the old one — which is why the retired alphabet
  quizzes are commented out in `quizzes.js` with their ids intact.

---

## 9. Prove you understand it

Trace these without running the app. Answers at the bottom.

1. A category has 6 words and your Length setting is "20 questions". How many
   questions do you get?
2. You answer Q1 right, Q2 wrong, Q3 right. What are `score`, `streak`, `bestStreak`?
3. You set "Only Known" on a category where you've marked nothing Known. What happens,
   and where is that decided?
4. You delete `if (feedback) return` from `onPick`. What breaks?
5. You delete `savedThisRun`. What breaks?
6. Why can `tone-drill` not be asked English → Hmong, and what in the data tells you?
7. A free learner opens `/quiz/path-u-greetings` twice in one day after using both
   library quizzes. Do they get in? Why?
8. Where would a "skip this question" button dispatch to?

<details>
<summary>Answers</summary>

1. **6** — `resolveCount` takes `Math.min(20, 6)`.
2. `score: 2`, `streak: 1`, `bestStreak: 1`.
3. The filter **falls back to all words** and sets `fellBack: true`, in
   `applyStatusFilter` — an empty quiz reads as a broken screen.
4. Rapid taps score the same question several times.
5. Duplicate rows in `quizScores` and duplicate XP for one attempt.
6. It's **many-to-one** — dozens of words share each tone, so reversed there'd be no
   single right answer. `reversible: false` on its config records that.
7. **Yes** — a path quiz passes `enabled: !isPro && !pathUnitId` to the quota, so the
   allowance is skipped entirely for unit quizzes. Greetings is a free unit, so the
   paywall doesn't stop them either.
8. `next()` — but you'd also want an `answers[]` entry, or accuracy silently ignores
   skips.

</details>

---

## Related reading

- [2026-08-04-quiz-study-gate](../../notes/2026-08-04-quiz-study-gate.md) — why the lock exists and how it was tuned
- [2026-08-04-quiz-distinct-options](../../notes/2026-08-04-quiz-distinct-options.md) — the duplicate-options bug
- [2026-08-29-quiz-direction-setting](../../notes/2026-08-29-quiz-direction-setting.md) — `reversible` and the ambiguity guard
- [2026-08-29-quizzes-ask-every-word](../../notes/2026-08-29-quizzes-ask-every-word.md) — the derived `questionCount`
- [2026-08-29-quiz-settings-sheet-flashcard-fixes](../../notes/2026-08-29-quiz-settings-sheet-flashcard-fixes.md) — the ⚙ sheet and why question type is off
- [2026-08-29-vocabulary-quiz-merge](../../notes/2026-08-29-vocabulary-quiz-merge.md) — where the quiz menu went
- [learning/monetization/quota-enforcement-guide.md](../monetization/quota-enforcement-guide.md) — the daily allowance in full
- [learning/reading/02-comprehension-quiz-guide.md](../reading/02-comprehension-quiz-guide.md) — the story quizzes, a separate engine
