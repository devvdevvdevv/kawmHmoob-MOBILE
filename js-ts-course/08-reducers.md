# 08 — Reducers: state machines

When a piece of state has several fields that change **together**, and the
screen moves through **distinct phases**, a pile of `useState`s turns into a
tangle. A **reducer** puts every possible change in one pure function, which
you can read top to bottom and test without React.

Your `learning/feature-logic/quiz-engine-explained.md` shows the reducer in its
full context. This lesson is about the *technique*.

---

## 1. Start from your code

`src/hooks/useQuizState.js`, the whole file:

```js
const initial = {
  status: 'idle',
  questions: [], currentIndex: 0, answers: [],
  score: 0, streak: 0, bestStreak: 0,
  startedAt: null, finishedAt: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...initial, status: 'active', questions: action.questions, startedAt: Date.now() }
    case 'answer': {
      const { isCorrect, selected } = action
      const newStreak = isCorrect ? state.streak + 1 : 0
      return {
        ...state,
        answers: [...state.answers, { questionIndex: state.currentIndex, selected,
          correct: state.questions[state.currentIndex].answer, isCorrect }],
        score: state.score + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      }
    }
    case 'next':
      if (state.currentIndex + 1 >= state.questions.length) {
        return { ...state, status: 'finished', finishedAt: Date.now() }
      }
      return { ...state, currentIndex: state.currentIndex + 1 }
    case 'review': return { ...state, status: 'reviewing' }
    case 'reset':  return initial
    default:       return state
  }
}

export function useQuizState() {
  const [state, dispatch] = useReducer(reducer, initial)
  const start = useCallback((questions) => dispatch({ type: 'start', questions }), [])
  const answer = useCallback((selected, isCorrect) => dispatch({ type: 'answer', selected, isCorrect }), [])
  // …next, review, reset
  return { state, start, answer, next, review, reset }
}
```

---

## 2. The idea

```
   (current state, action)  ──►  reducer  ──►  new state
```

- **State**: one object holding everything.
- **Action**: a plain object describing *what happened*:
  `{ type: 'answer', selected: 'aub', isCorrect: true }`.
- **Reducer**: a **pure function** (Lesson 02 §5) that takes both and returns the next state.
  No storage, no timers, no navigation. (`Date.now()` is a small, tolerated exception.)
- **`dispatch(action)`**: how a component says "this happened". React runs the reducer and re-renders.

It's called a reducer for the same reason as `.reduce` (Lesson 03): if you
wrote down every action of a quiz, `actions.reduce(reducer, initial)` would
give you the final state.

---

## 3. Why not just `useState`?

Picture the `'answer'` case with separate state:

```js
setAnswers([...answers, { … }])
setScore(score + (isCorrect ? 1 : 0))
setStreak(isCorrect ? streak + 1 : 0)
setBestStreak(Math.max(bestStreak, isCorrect ? streak + 1 : 0))   // must repeat the streak logic
```

Four setters that **must** stay in sync, each reading possibly-stale values,
and logic duplicated across lines. With a reducer, "an answer happened" is
**one** event producing **one** consistent new state.

**Reach for `useReducer` when:**
- several values change together in response to one event, or
- the next state depends on the current state in non-trivial ways, or
- the thing has **phases** (`idle → active → finished → reviewing`).

For a single toggle or a text field, `useState` is still right.

---

## 4. Thinking in states: the `status` field

`status` makes the quiz an explicit **state machine**:

```
          start                next (last q)          review
  idle ─────────► active ───────────────────► finished ───────► reviewing
                   │  ▲                          │
                   └──┘ answer / next            │ reset
                                                 ▼
                                                idle
```

The screen then renders **by status**, which is far clearer than juggling
booleans like `isStarted && !isFinished && !isReviewing`:

```jsx
if (state.status === 'idle') return <StartScreen />
if (state.status === 'finished') return <Results />
```

> 🧠 **Booleans multiply, statuses don't.** Three booleans = 8 combinations,
> most of them impossible ("finished but not started"?). One `status` string
> with 4 values = exactly 4 states, all real. When you catch yourself adding a
> third boolean, switch to a status. Your
> `learning/ui-patterns/logout-confirm-success-modal-lesson.md` and
> `send-status-and-result-screens.md` both use this move.

---

## 5. Anatomy of a good reducer

1. **Every case returns a new object.** `{ ...state, … }`, never `state.score++`.
2. **`default: return state`.** An unknown action changes nothing. (In
   TypeScript, Lesson 12, you'll make unknown actions a *compile* error instead.)
3. **Braces around a case that declares variables**: `case 'answer': { const … }`.
   Without them, `const` names leak between cases.
4. **`reset` returns `initial` directly.** It's safe because `initial` is never
   mutated, and it's the strongest argument for why it must never be.
5. **Actions describe what happened, not how to change state.**
   `{ type: 'answer', isCorrect }` ✅ vs `{ type: 'setScore', score: 5 }` ❌.
   The reducer owns the rules; components just report events.

### The wrapper functions

`useQuizState` doesn't hand components `dispatch`. It hands out named functions
(`start`, `answer`, `next`). Components write `answer(choice, ok)` instead of
building action objects, and the action shapes stay private to one file.
`useCallback(…, [])` keeps them stable (Lesson 07 §5). `dispatch` itself never
changes, so the deps can be empty.

---

## Practice

```bash
node js-ts-course/practice/p08-reducer.mjs
```

You'll write a reducer for a **flashcard session**, a new machine, not a copy
of the quiz. Because a reducer is pure, the practice file tests it with no React
at all, by feeding it actions. That's one of the main benefits.

After it's all ✅: in your playground, wire it up with
`const [state, dispatch] = useReducer(flashcardReducer, initial)` (copy your
reducer into the playground file) and build a tiny UI for it: a card,
"Flip", "I knew it", "Didn't know", and a results screen.

---

## You can now…

- [ ] explain state / action / reducer / dispatch in one sentence each
- [ ] say when `useReducer` beats several `useState`s
- [ ] draw a state machine for a feature as boxes and arrows
- [ ] explain why one `status` field beats several booleans
- [ ] write a reducer that never mutates and ignores unknown actions
