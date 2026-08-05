# 2026-08-04 — Quiz study-gate (can't quiz words you haven't studied)

**Request:** "if the user hasn't studied the words, then they can't take the quiz."

## The rule

Only **vocab quizzes** (`vocab-<catId>`) are gated — alphabet/tone/grammar
quizzes have no word set to study, so they stay open. A vocab quiz unlocks once
**half** the category's words have been studied
(`QUIZ_UNLOCK_RATIO = 0.5`, ceil).

"Studied" is *derived*, not new state: a word gets an entry in `vocabProgress`
the moment it's marked Learning/Known on a flashcard. So the gate can't drift out
of sync with progress.

This logic already existed in [src/lib/access.js](../src/lib/access.js) as
`quizUnlock(quizId, vocabProgress)` — ported earlier from the web app but never
wired into the RN engine. It returns
`{ gated, unlocked, studied, needed, remaining, category }`.

## What was already done vs. what I added

- **Already wired:** the quiz menu ([src/components/quiz/QuizMenu.jsx](../src/components/quiz/QuizMenu.jsx))
  showed a "🔒 Study first" card that links to the word bank instead of the quiz.
- **The hole:** the menu is only a suggestion. A direct link/deep-link to
  `/quiz/vocab-animals` walked **straight past** it — the engine never checked.
- **The fix** ([src/components/quiz/QuizEngine.jsx](../src/components/quiz/QuizEngine.jsx)):
  the engine now calls `quizUnlock(topicId, vocabProgress)` and, when
  `gated && !unlocked`, renders a **locked screen** instead of the quiz. This is
  the real enforcement point.

## The locked screen

Ported from the web app's version, in RN idiom (app cream/clay palette):
- Lock glyph, "Study the words first" heading, explanation naming the category.
- A **progress bar** (`studied / needed`) with "X of Y studied · Z to go" so the
  learner sees how close they are.
- Primary button → `/vocabulary/<catId>` (the word bank), plus a "Back to
  Quizzes" link.

Also guarded the auto-start effect so a gated quiz never calls `start()` — no
questions get built until it's actually unlocked.

## Tuning

Change the threshold in one place: `QUIZ_UNLOCK_RATIO` in `src/lib/access.js`
(e.g. `1` = must study every word, `0.25` = a quarter). Verified with a clean
`npx expo export --platform web`.
