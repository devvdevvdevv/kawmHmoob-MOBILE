# Reading, Part 2 — the comprehension quiz

Part 1 got you a browsable library and a readable story. This is the part that
checks whether the story was **understood** rather than just looked at.

**You write the code.** Read `src/components/quiz/QuizEngine.jsx` alongside this
— it already solves most of these problems, and the comments in it explain
several decisions this guide only names.

---

## The one design question

A comprehension quiz is not a vocabulary quiz, and the difference decides
everything else.

| | vocabulary quiz | comprehension quiz |
|---|---|---|
| questions come from | a word deck, generated | the story, hand-written |
| a wrong answer means | you don't know the word | you didn't follow the story |
| can be auto-generated | yes | **no** |

`QuizEngine` builds questions from a dataset at runtime (`buildQuestions`).
Yours cannot. "What did the mother plant?" only exists because you wrote it.

⚠️ **So the questions live in the story object**, next to the paragraphs they
test. Not in a separate file keyed by story id — that is two files to keep in
sync, and they will drift the first time you rename a story.

---

## Phase 1 — the question shape

Add to each story:

```
questions: [
  {
    id       'q-nkauj-1'        stable, unique WITHIN the story
    prompt   'Where did she go?'
    options  ['To the river', 'To the market', …]
    answer   'To the river'     ← the option TEXT, not an index
    because  'Paragraph 2 says…'  optional, shown after answering
  },
]
```

### Why `answer` is text, not an index

If `answer: 0` and you later reorder the options, the answer silently becomes
wrong. Nothing errors. The quiz just starts marking the right answer wrong.

Matching on text survives reordering. It costs you a string comparison and buys
you an entire class of bug you never have.

⚠️ **Then verify it.** `answer` must be one of `options`. A typo — a trailing
space, a different dash — makes a question that is impossible to get right, and
it looks like a hard question rather than a broken one. Write a check script
(see the end of this guide); do not rely on noticing.

### `because` is the actual teaching

A score tells someone they were wrong. `because` tells them where to look. It is
optional in the shape and non-optional in spirit — the difference between a test
and a lesson.

---

## Phase 2 — the quiz as a state machine

A quiz has exactly three states, and naming them prevents most quiz bugs:

```
idle  ──start──▶  active  ──last question──▶  done
  ▲                                            │
  └──────────────── retake ────────────────────┘
```

Everything you render is a function of which state you are in. `QuizEngine`
does this with `state.status`, and it is worth copying the idea even if you
write your own.

The bug this prevents: booleans that can disagree. `isStarted` + `isFinished`
has four combinations and only three are legal — and the illegal one
(`started && finished` both false after a retake) is the one you will hit.

> **One `status` string beats two booleans, every time. Illegal states should be
> unrepresentable.**

### What you need in state

```
status      'idle' | 'active' | 'done'
questions   the frozen, shuffled list for THIS run
index       which question
picked      what they chose for the current question (null = unanswered)
score       running count
```

`picked` being `null` versus a value is what separates "answering" from
"looking at the feedback" — you do not need a fourth status for that.

---

## Phase 3 — freeze the questions at start

⚠️ **This is the trap that makes quizzes feel broken.**

If you shuffle inside render, the options reorder on **every re-render** — every
tap, every state change. The user reaches for "To the river" and it moves.

```js
// ✗ WRONG — new order every render
const shuffled = shuffle(question.options)

// ✓ RIGHT — built once, when the run starts
const [questions, setQuestions] = useState([])
const start = () => {
  setQuestions(story.questions.map((q) => ({ ...q, options: shuffle(q.options) })))
  setStatus('active')
}
```

`QuizEngine` has a comment about exactly this — that a settings change mid-run
does not apply, "questions are already built". Same principle: **a run is
immutable once it starts.**

### On `shuffle`

Write it, don't reach for a library. The correct one is Fisher–Yates:

```js
function shuffle(arr) {
  const a = [...arr]                       // copy — never shuffle the source
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]           // swap
  }
  return a
}
```

⚠️ `[...arr]` is not decoration. Shuffling in place mutates `story.questions`
— your DATA — so the second time you open that story the options are already
scrambled and the "original" order is gone for the rest of the session.

`arr.sort(() => Math.random() - 0.5)` is the popular wrong answer. It is not a
uniform shuffle and some orders are far likelier than others. It also mutates.

---

## Phase 4 — answering

On pick:

1. If `picked` is not null, ignore it — they already answered. Without this,
   double-tapping scores twice.
2. Set `picked`.
3. If correct, increment score.
4. Show feedback: right/wrong, the correct answer, and `because`.
5. "Next" advances and resets `picked` to `null`.

### Score from state, not from a recount

Increment once, at pick time. Do not recompute by walking the answers at the
end — that means storing every answer, and the two numbers can disagree.

If you DO want a review screen listing every question, then store the answers
and derive the score from them. **One source, either way.** What you must not
have is a stored score AND a stored answer list that are separately maintained.

---

## Phase 5 — the result

Show: score, out of, a sentence, and two ways out (retake / back to the genre).

⚠️ **Say something true about the score.** "3/5" is data, not feedback. Bands
work here for the same reason they work in Speak (`scoreBand` in
`src/lib/pronounceScore.js`): a number invites optimisation, a band invites
another read.

Something like: all correct → "You followed the whole story." Most → "Close —
worth a re-read." Few → "Try reading it again with the English revealed."

That last one is the useful case. A comprehension quiz someone fails should
point back at the story, not just at a number.

---

## Phase 6 — progress and gating

Both already exist. Do not invent either.

### Progress

`useProgress()` — the same hook Speak and Vocabulary use. Record completion
keyed by something stable, and derive the library's progress bars from it. That
is how a genre card knows "2 of 4 read" with no extra bookkeeping.

⚠️ Key on the STORY id, not on position. Positions renumber when you insert a
story; ids do not.

### Quota

`useDailyQuota('reading', quotaLimit('reading', user.isGuest), { enabled: !isPro, … })`
— the limit already exists in `src/lib/quotaLimits.js`, and `app/reading.jsx`
(now legacy, admin-gated) has a `TODO(quota)` block sketching this.

**Consume on START, once.** Not per question — that charges five uses for one
quiz. Not on finish — that makes quitting halfway free. Check `quota.ready`
before consuming, and render `<QuotaWall />` when exhausted.

### Pro gating

`PaywallGate` for the destination, and a locked row that routes to `/paywall`
rather than into the story. Guard the destination, not just the doorway — a deep
link walks past a hidden card. `AdminGate` says exactly this in its header, and
the same logic applies.

---

## Phase 7 — the check script

You now have data that can be wrong in ways nothing catches at runtime. Write
`scripts/check-reading.mjs`, modelled on `scripts/check-lesson-audio.mjs`.

Assert, for every story:

- `answer` is present in `options` ← the one that matters most
- ids are unique across ALL stories, not per genre
- every `genre` matches a real genre id
- `level` is one of the allowed values
- at least one question, at least two options
- no duplicate options within a question

Exit non-zero. Then it joins the four scripts already in the set.

> **The rule this codebase keeps relearning: a data error that renders fine is
> invisible until someone complains.** An unanswerable question looks exactly
> like a hard one.

---

## Order to build in

1. One story, fully filled in, with 3 questions
2. `check-reading.mjs` — before the UI, so bad data cannot accumulate
3. Library screen (genres)
4. Genre screen (stories)
5. Reader
6. Quiz
7. Progress
8. Quota + Pro gating

⚠️ Notice the check script is **second**, not last. Writing it before the UI
means every story you author afterwards is validated as you go, instead of
finding twelve broken ones the day before launch.

---

## Exercises

### 1. Feel the shuffle bug
Shuffle inside render. Tap an option.

*Watch them jump. Now explain why it happens on every tap and not only on
mount — what causes the re-render?*

### 2. Break the answer
Change `answer` to a string that is not in `options` — even just a trailing
space.

*The question becomes unanswerable. Nothing errors. How is that different from
a hard question, from the user's side? Now write the assertion.*

### 3. Mutate the source
Shuffle without copying, then leave the story and come back.

*The options are still scrambled. Explain which object you actually modified,
and why leaving the screen did not undo it.*

### 4. Two booleans
Model the quiz with `isStarted` and `isFinished` instead of one `status`.

*Enumerate all four combinations. Which is illegal? Now retake a quiz and see if
you can reach it.*

### 5. Judgement (no code)
Questions live inside the story object.

*What breaks if you move them to a separate `readingQuestions.js` keyed by story
id? What do you gain? At what number of stories does that trade flip?*
