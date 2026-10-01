# Quizzes ask every word — the 10-question cap is gone (2026-08-29)

## Why

`vocabQuizzes` was built with `questionCount: Math.min(10, cat.words.length)`. Half
the categories are bigger than that, so a 31-word category was assessed with a
10-question sample: **two thirds of the words never came up**, and a 100% score
meant "I know 10 of these 31".

## The change

`questionCount` is no longer written by hand anywhere. It's derived from each
quiz's own dataset, once, where the list is built:

```js
const QUIZ_DEFS = [ ...vocabQuizzes, /* drills */ ]

export const quizzes = QUIZ_DEFS.map((q) => ({
  ...q,
  questionCount: getQuizDataset(q.id).length,
}))
```

So a quiz always asks everything it has, adding words to a category grows its quiz
automatically, and there is no second number to keep in sync.

`getQuizDataset` is a hoisted function declaration, so calling it above its own
definition is fine — the data it reads comes from ES imports, which are evaluated
before the module body runs.

## What actually changed, in numbers

| | before | after |
|---|---|---|
| Vocab quizzes capped below their word count | 23 of 46 | 0 |
| Total vocab questions | 345 | **523** (every word in the app) |
| Longest quiz | 10 | 31 (Relatives & Extended Family) |
| `tone-drill` | 12 of 30 | **30** |
| `grammar-pronouns` | 7 of 9 | **9** |
| `alphabet-tones`, `everyday-greetings` | 8, 5 | unchanged (already asked everything) |

The two drills that grew were capped by the same kind of hand-typed number, so the
derivation swept them up. **If Tone Drill was deliberately a short 12-question
warm-up, that's the one to revisit** — it's now a 30-question sitting.

## Knock-on fix: the "Quizzes taken" denominator

An empty category still generates a quiz, which now has **0 questions** and can't
be sat. It was being counted in the `X of Y` progress on the Vocabulary index,
making the target unreachable. The index now counts only takeable quizzes:

```js
const takeable = quizzes.filter((q) => q.questionCount > 0)
const takenCount = takeable.filter((q) => bestByQuiz[q.id] != null).length
```

Counting *from* that list also stops a leftover score for a retired quiz (the
commented-out consonant/vowel ones) from crediting the total.

## Still true

- `buildQuestions` shuffles the dataset and takes `count` items, so with
  `count === dataset.length` every word appears exactly once, in random order.
- Its `Math.min(config.questionCount, dataset.length)` is now a no-op, kept as a
  guard.
- Small categories (2–3 words) still produce fewer than 4 options — distractors are
  distinct answers drawn from the same category, and there simply aren't more.

## Worth watching

A 31-question multiple-choice run is a long sitting, and the daily quota spends the
same single credit whether the quiz is 5 questions or 31. If long quizzes start
feeling like a slog, the fix isn't a cap — it's sections or a "continue where you
left off", so coverage doesn't get traded away again.
