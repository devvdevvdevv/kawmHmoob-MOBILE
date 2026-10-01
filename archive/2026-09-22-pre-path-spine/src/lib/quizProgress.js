// How to READ `quizScores` — the one place that knows what a score means.
//
// `quizScores` is an append-only log: every attempt at every quiz, in order. That
// shape is right for history but wrong for display, and every screen that shows a
// score was re-deriving it (and re-inventing the pass mark). This module owns both
// so they can't drift.
//
// The related rule — when a quiz UNLOCKS — lives in access.js (`quizUnlock`),
// because that one is derived from vocabProgress, not from scores.

// What counts as passing. A display threshold AND a progress rule: the green chip,
// and "have I actually got this category?" Change it here, everywhere follows.
export const QUIZ_PASS_SCORE = 80

// quizId → best (highest) accuracy. Best, not latest: retaking a quiz and doing
// worse shouldn't erase what you proved you could do.
export function bestScoresByQuiz(quizScores = []) {
  const best = {}
  for (const s of quizScores) {
    if (best[s.quizId] == null || s.accuracy > best[s.quizId]) best[s.quizId] = s.accuracy
  }
  return best
}

// Null-safe on purpose: an untaken quiz (score `null`/`undefined`) is not a fail,
// it's a blank — callers distinguish the two by checking the score itself.
export function isQuizPassed(score) {
  return score != null && score >= QUIZ_PASS_SCORE
}
