# 2026-08-08 — How QuizEngine works (walkthrough for me)

A read-along explainer for [src/components/quiz/QuizEngine.jsx](../src/components/quiz/QuizEngine.jsx).
Not a change log — this is the "what is this file actually doing" note.

---

## The one-sentence version

`QuizEngine` is **one screen that renders five different things**, and which one
you see is decided by a chain of `if` statements. Everything else in the file is
either (a) turning raw word data into questions, or (b) tracking where you are in
the quiz.

Think of it like a vending machine:

- **Coins in** → the route param `topicId` (e.g. `vocab-animals`)
- **The machine's wiring** → config + dataset + a state machine
- **What drops out** → a question card, a locked screen, or a results screen

---

## The cast (who does what)

| File | Its one job |
|---|---|
| [src/data/quizzes.js](../src/data/quizzes.js) | The **menu**. `getQuizConfig(id)` = the quiz's settings (title, how many questions, tier). `getQuizDataset(id)` = the raw material, always normalized to `{ prompt, answer, audio? }`. |
| `buildQuestions()` (in this file) | The **factory**. Turns raw `{prompt, answer}` rows into playable questions with options. |
| [src/hooks/useQuizState.js](../src/hooks/useQuizState.js) | The **scoreboard**. Where you are, what you answered, score, streak. |
| [src/lib/access.js](../src/lib/access.js) | The **bouncer**. `quizUnlock()` — have you studied enough to be allowed in? |
| [src/context/ProgressContext.jsx](../src/context/ProgressContext.jsx) | The **filing cabinet**. `recordQuizScore()` saves the finished attempt. |
| `QuizResults`, `PaywallGate`, `ConfirmModal` | Screens/wrappers it hands off to. |

Key idea: **QuizEngine owns almost no logic of its own.** It's a coordinator. The
interesting logic lives in those neighbours.

---

## Part 1 — Turning words into questions (no React here)

`shuffle()` and `buildQuestions()` at the top of the file are **plain functions**.
No hooks, no state. You could copy them into a blank JS file and run them. That's
deliberate — it makes them easy to reason about and test.

### `shuffle(arr)` — [QuizEngine.jsx:26-33](../src/components/quiz/QuizEngine.jsx#L26-L33)

Fisher–Yates shuffle. Walk backwards from the end; at each spot, swap with a
random earlier spot. It copies first (`arr.slice()`) so it **never mutates the
original dataset** — important, because the dataset comes from your data modules
and gets reused.

### `buildQuestions(config, dataset)` — [QuizEngine.jsx:35-62](../src/components/quiz/QuizEngine.jsx#L35-L62)

Read it as four steps:

**1. Pick the questions.**
```js
const count = Math.min(config.questionCount, dataset.length)
const pool = shuffle(dataset).slice(0, count)
```
Shuffle everything, take the first N. `Math.min` guards the case where a category
has fewer words than `questionCount` asks for — you can't make 10 questions from
6 words.

**2. Decide each question's type.**
```js
const type = types[i % types.length]
```
The `% ` (modulo) makes it **cycle**. With `['multiple-choice', 'matching']` you
get MC, matching, MC, matching… With just `['multiple-choice']` (which is what
every live quiz uses today — matching is commented out in `quizzes.js`) it always
lands on index 0.

**3. Build the wrong answers ("distractors").** This is the cleverest bit:
```js
const distinctWrong = [...new Set(dataset.map((d) => d.answer))].filter((a) => a !== item.answer)
const distractors = shuffle(distinctWrong).slice(0, 3)
const options = shuffle([item.answer, ...distractors])
```
Line by line:
- `dataset.map(d => d.answer)` → every answer in the whole dataset
- `new Set(...)` → **throw away duplicates**
- `[...set]` → back to an array
- `.filter(a => a !== item.answer)` → remove the correct one, so it can't appear twice
- take 3, add the correct answer back, shuffle so the answer isn't always last

Why the `Set` matters (the comment in the code says this too): in **tone-drill**,
dozens of words map to only 8 tones. Without dedup you'd get options like
`["Low", "Low", "High", "Rising"]` — which looks broken and is sometimes
unanswerable. The `Set` guarantees 4 *distinct* options.

**4. Matching questions** grab 4 pairs and force the current item to be one of
them (`if (!pairs.find(...)) pairs[0] = item`), so the question is always about a
word you actually drew.

---

## Part 2 — The state machine (`useQuizState`)

This is a `useReducer`. If reducers feel abstract: it's a box holding an object,
and the **only** way to change it is to send it a named message ("start",
"answer", "next"). The reducer is the rulebook for what each message does.

State shape: `{ status, questions, currentIndex, answers[], score, streak, bestStreak, startedAt, finishedAt }`.

`status` is the important one. Four values, and they move in one direction:

```
idle ──start()──► active ──next() past last question──► finished ──review()──► reviewing
  ▲                                                                                │
  └──────────────────────── reset() ◄─────────────────────────────────────────────┘
```

What each message does ([useQuizState.js:15-55](../src/hooks/useQuizState.js#L15-L55)):

- **`start`** — wipes back to `initial`, stores the question list, stamps `startedAt: Date.now()`
- **`answer`** — appends to `answers[]`, `score + 1` if correct, and the streak line:
  ```js
  const newStreak = isCorrect ? state.streak + 1 : 0
  ```
  Correct = +1, wrong = **back to zero**. `bestStreak` uses `Math.max` so it
  remembers the high-water mark even after you break the streak. Note `answer`
  does **not** advance the question — that's `next`'s job. That split is what
  lets the feedback banner sit on screen before you move on.
- **`next`** — the only place the quiz ends:
  ```js
  if (state.currentIndex + 1 >= state.questions.length) return { ...state, status: 'finished' }
  ```
- **`review`** — just flips status; the answers were already recorded
- **`reset`** — back to `initial`

---

## Part 3 — The render ladder (order is the logic)

Inside the component, after the hooks, there's a run of early `return`s. **The
order is the business logic** — each one is "if this is true, nothing below
matters":

1. **`!config`** → "Quiz not found." (bad/unknown `topicId`)
2. **`dataset.length === 0`** → "No data available yet." (config exists, data doesn't)
3. **`locked`** → the 🔒 study-first screen
4. **`status === 'finished' \|\| 'reviewing'`** → `<QuizResults>`
5. **otherwise** → the live question card

Two things worth internalizing here:

**The lock is real enforcement, not decoration.** `locked = unlock.gated && !unlock.unlocked`
([QuizEngine.jsx:79](../src/components/quiz/QuizEngine.jsx#L79)). The quiz menu
already hides locked quizzes, but a menu is only a *suggestion* — deep-linking to
`/quiz/vocab-animals` walks straight past it. This guard is the wall. (Background:
[2026-08-04-quiz-study-gate](2026-08-04-quiz-study-gate.md).)

**Two separate gates, stacked.** `locked` is the *study* gate (free, earned by
studying). `PaywallGate` is the *money* gate (`config.tier`). They're independent
axes and both can apply.

---

## Part 4 — One tap, end to end

The most useful thing to hold in your head. You tap an answer in a
multiple-choice question:

1. `MultipleChoice` calls `onPick(opt)` — [QuizEngine.jsx:236-241](../src/components/quiz/QuizEngine.jsx#L236-L241)
2. `if (feedback) return` — **the double-tap guard.** Feedback being set means
   this question is already answered; bail out so you can't score it twice.
3. `const isCorrect = opt === q.answer` — a plain string compare
4. `answer(opt, isCorrect)` → reducer records it, updates score + streak
5. `setFeedback('correct' | 'incorrect')` → the green/red banner renders
6. The options **freeze**: `showResult` is true, so every `Pressable` gets
   `disabled`, the right answer turns green, the rest dim to `opacity-60`.
   You always see the correct answer, even when you got it right.
7. You tap **Next** → `setFeedback(null); next()` — clear the banner *and* advance.
   Both are needed; clearing feedback is what re-enables tapping.
8. On the last question that same button reads "Finish" (the label is computed:
   `currentIndex + 1 >= questions.length`), and `next()` flips status to
   `finished` instead of advancing.

### Why is `feedback` local state instead of living in the reducer?

Because it's **about the screen, not the quiz**. The reducer holds the record of
what happened (permanent, gets saved). `feedback` is "is the banner currently
showing" — throwaway UI state. Same reasoning for `elapsed`, `showQuitConfirm`,
and `savedThisRun`. Good instinct to generalize: *durable facts → reducer;
"what's on screen right now" → `useState`.*

---

## Part 5 — The three effects

**1. Auto-start** — [QuizEngine.jsx:81-83](../src/components/quiz/QuizEngine.jsx#L81-L83)
```js
if (config && !locked && questions.length > 0 && state.status === 'idle') start(questions)
```
Four conditions, all necessary. `status === 'idle'` is what stops it looping
forever — the moment it fires, status becomes `active` and the condition is
false. It's also why **Retry works**: `onRetry` calls `reset()` → status is
`idle` again → this effect fires and deals a fresh hand.

**2. The timer** — [QuizEngine.jsx:85-92](../src/components/quiz/QuizEngine.jsx#L85-L92)
A `setInterval` that recomputes `elapsed` from `Date.now() - state.startedAt`
every second. Note it derives from a timestamp rather than doing `elapsed + 1` —
so a dropped tick can't make the clock drift. It only runs while `active`, and
the `return () => clearInterval(id)` cleanup kills it when the quiz ends or you
navigate away. **Forgetting that return line is the classic RN memory leak.**

**3. Save-once** — [QuizEngine.jsx:94-108](../src/components/quiz/QuizEngine.jsx#L94-L108)
When status hits `finished`, compute accuracy and call `recordQuizScore()`
(which appends to `quizScores`, adds +5 XP, and bumps the daily streak).
`savedThisRun` is the **idempotency latch** — effects can re-run on any
re-render, and without the latch a single quiz could be filed several times.
Retry resets the latch to `false`, which is why the next attempt saves too.

---

## Part 6 — The two question components

**`MultipleChoice`** is stateless — it renders what it's given and reports taps
upward. All the "does it turn green" logic is derived at render time from
`feedback` + `opt === question.answer`. Nothing to keep in sync.

**`Matching`** *does* own state, because it has a multi-step interaction:
- `leftSel` — which Hmong word is currently selected
- `pairs` — the `{ hmongWord: englishMeaning }` matches made so far

The interaction is **tap left, then tap right**. `handleRight` bails immediately
if nothing is selected (`if (!leftSel || feedback) return`), otherwise records the
pair and clears the selection. Then the completion check:
```js
if (Object.keys(nextPairs).length === lefts.length) {
  const allCorrect = question.pairs.every((p) => nextPairs[p.prompt] === p.answer)
  onComplete(allCorrect)
}
```
It grades only when **every** left item has been matched, and it's all-or-nothing
— one wrong pair fails the whole question. Note it checks `nextPairs`, the fresh
object, not `pairs` — reading `pairs` there would use the pre-update value and be
off by one match. (Classic `useState` gotcha: state updates aren't visible until
the next render.)

The right column is shuffled in a `useMemo` keyed on `question`, so it doesn't
re-randomize on every tap — but the memo is on the whole `question` object, so a
new question does re-shuffle. That's the behavior you want.

---

## Part 7 — Things worth knowing (including one live bug)

### 🔴 Lines 17–22 will crash this screen

```js
const quota = useDailyQuota('FEATURE', quotaLimit('FEATURE', user.isGuest), { ... })
```

This sits at **module top level**, outside the component. Three separate problems:

1. `useDailyQuota` and `quotaLimit` are **never imported** in this file → a
   `ReferenceError` the instant the module is imported. The quiz screen won't render at all.
2. `user` and `isPro` don't exist in this scope either.
3. Even with imports fixed, **hooks can't be called outside a component** —
   that's the Rules of Hooks.

It looks like a paste of the TODO recipe from
[2026-08-06-daily-quota-and-signifier](2026-08-06-daily-quota-and-signifier.md#L51)
(note the literal `'FEATURE'` placeholders, and that note lists Quizzes as
not-yet-wired). To actually wire it: import the hook + `quotaLimit`, move the call
*inside* `QuizEngine` alongside the other hooks, get `user`/`isPro` from the auth
and subscription contexts, swap `'FEATURE'` → `'quiz'`, and call `consume()` when
a quiz starts. Until then, delete the block.

### `useMemo` on line 77 isn't actually memoizing
```js
const dataset = getQuizDataset(topicId)                       // line 68 — runs every render
const questions = useMemo(() => buildQuestions(config, dataset), [config, dataset])
```
`getQuizDataset` ends in `.map(...)`, which returns a **brand-new array every
call**. New array = new identity = the dependency "changed" = the memo recomputes.
So `buildQuestions` (shuffle + `Set` construction) runs on **every single
render**. It's not visibly broken — the questions the quiz actually uses are the
ones frozen into reducer state by `start()` — but the memo is doing nothing.
Wrapping `dataset` in its own `useMemo(() => getQuizDataset(topicId), [topicId])`
would make both memos real.

### Small stuff
- **Matching answers record as the literal string `'matching'`** (`answer('matching', isCorrect)`),
  so the review screen can't show what you actually picked for those. Moot today —
  matching is disabled in `quizzes.js`.
- **Quit** calls `reset()` *then* navigates. Since `reset()` returns status to
  `idle`, the auto-start effect can briefly re-deal a quiz in the frame before
  navigation lands. Harmless, but it's why quit-then-return feels instant.
- **`getQuizDataset(topicId)` runs before the `!config` guard**, and it does
  `id.startsWith(...)` — a missing route param would throw rather than show the
  friendly "Quiz not found."
- **`elapsed` freezes at the finish** (the interval stops) and gets handed to
  `QuizResults` as the final time. Retry explicitly zeroes it.

---

## If you want to prove you understand it

Trace these without running the app:

1. A category has 6 words but `questionCount: 10`. How many questions? *(6 — the `Math.min`.)*
2. You get Q1 right, Q2 wrong, Q3 right. What are `score`, `streak`, `bestStreak`? *(2, 1, 1.)*
3. You delete `if (feedback) return` from `onPick`. What breaks? *(Rapid taps score the same question multiple times.)*
4. You delete `savedThisRun`. What breaks? *(Duplicate rows in `quizScores`, duplicate XP.)*
5. Where would a "skip this question" button dispatch to? *(`next()` — but you'd want an `answers[]` entry too, or accuracy math silently ignores skips.)*
