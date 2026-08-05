# Quiz options could duplicate (tone-drill looked "messed up") (2026-08-04)

## Symptom
The tone-drill quiz's answer choices looked wrong — e.g. the same tone appeared
twice among the options.

## Cause
`buildQuestions` in `src/components/quiz/QuizEngine.jsx` built distractors from
whole dataset ITEMS:
```js
const distractors = shuffle(dataset.filter((d) => d.answer !== item.answer)).slice(0, 3)
const options = shuffle([item, ...distractors]).map((d) => d.answer)
```
When many items share the same answer, the 3 random distractor ITEMS can carry the
SAME answer as each other → duplicate option strings. Tone-drill is the worst case:
~29 words map to only 8 tones, so duplicates were almost guaranteed. The correct
answer was still present/correct — but the duplicated wrong options read as broken.

(The tone data itself is fine — tones are derived from each word's final RPA letter
in `toneDrill.js`, which is correct.)

## Fix
Build distractors from DISTINCT wrong answer strings:
```js
const distinctWrong = [...new Set(dataset.map((d) => d.answer))].filter((a) => a !== item.answer)
const distractors = shuffle(distinctWrong).slice(0, 3)
const options = shuffle([item.answer, ...distractors])
```
Options are now unique strings, correct answer included exactly once. Applies to
ALL multiple-choice quizzes (vocab, alphabet, grammar, tone-drill), not just tone.

## Verify
Tone Drill (Words → Tone drill): each question's 4 options are distinct tones, one
of them the correct one; no repeats.
