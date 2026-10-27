// Lesson 01 practice — values, truthiness, ?? / || / ?.
// Run:  node js-ts-course/practice/p01-values.mjs
//
// Replace each `todo(...)` with your own code. Don't edit the checks at the bottom.
import { check, assert, run, todo } from './check.mjs'

// ── Exercise 1: predict, don't run ──────────────────────────────────────────
// Fill in true or false for each: is the value TRUTHY?
// Answer from memory first. The checks will tell you which ones you missed.
const predictions = {
  zero: false,                       // 0
  emptyString: false,                // ''
  stringZero: true,                 // '0'
  emptyArray: true,                 // []
  emptyObject: true,                // {}
  nullValue: false,                  // null
  negativeOne: true,                // -1
  stringFalse: true,                // 'false'
}
// ↑ Replace every `undefined` with true or false.

// ── Exercise 2: the guest id ────────────────────────────────────────────────
// Return the user's id, or 'guest' if there is no user or the user has no id.
// Must not crash when `user` is null or undefined. One line.
// Hint: Lesson 01 §5, the NotebookContext line.
function userIdOf(user) {
  return user?.id || 'guest'

}

// ── Exercise 3: the 0 trap ──────────────────────────────────────────────────
// Return `score`, or the text 'not taken' if the score is null/undefined.
// A score of 0 is a REAL score and must come back as 0.
function scoreLabel(score) {
  return score ?? 'not taken'
}

// ── Exercise 4: the quota key ───────────────────────────────────────────────
// Rebuild storageKey from useDailyQuota.js WITHOUT looking at it.
//   quotaKey('abc', 'quiz') → 'kawmhmoob.quota.abc.quiz'
//   quotaKey('', 'speak')   → 'kawmhmoob.quota.global.speak'
// Use a template string.
function quotaKey(scope, name) {
  return `kawmhmoob.quota.${scope || 'global'}.${name}`
}

// ── Exercise 5: is it missing? ──────────────────────────────────────────────
// Return true ONLY for null and undefined. 0, '', false must return false.
// Hint: the one sanctioned `==` from §6.
function isMissing(x) {

  if (x === null || x === undefined) {
    return true
  }
  return false
}

// ── Exercise 6: is the notebook empty? ──────────────────────────────────────
// savedWords is an object like { 'animals-dog': {...}, 'food-rice': {...} }.
// Return true when it has no keys. (Remember: {} is truthy, so `!savedWords` won't work.)
function isNotebookEmpty(savedWords) {
  return Object.keys(savedWords).length === 0
}

// ─────────────────────────── checks (don't edit) ────────────────────────────
check('1. truthiness predictions', () => {
  const truth = { zero: false, emptyString: false, stringZero: true, emptyArray: true,
    emptyObject: true, nullValue: false, negativeOne: true, stringFalse: true }
  const wrong = Object.keys(truth).filter((k) => predictions[k] !== truth[k])
  assert.deepEqual(wrong, [], `these predictions are wrong or missing: ${wrong.join(', ')}`)
})
check('2. userIdOf', () => {
  assert.equal(userIdOf({ id: 'abc' }), 'abc')
  assert.equal(userIdOf(null), 'guest')
  assert.equal(userIdOf(undefined), 'guest')
  assert.equal(userIdOf({}), 'guest')
})
check('3. scoreLabel keeps 0', () => {
  assert.equal(scoreLabel(80), 80)
  assert.equal(scoreLabel(0), 0, '0 is a real score — did you use || instead of ??')
  assert.equal(scoreLabel(null), 'not taken')
  assert.equal(scoreLabel(undefined), 'not taken')
})
check('4. quotaKey', () => {
  assert.equal(quotaKey('abc', 'quiz'), 'kawmhmoob.quota.abc.quiz')
  assert.equal(quotaKey('', 'speak'), 'kawmhmoob.quota.global.speak')
})
check('5. isMissing', () => {
  assert.equal(isMissing(null), true)
  assert.equal(isMissing(undefined), true)
  for (const v of [0, '', false, NaN, [], {}]) assert.equal(isMissing(v), false, `isMissing(${JSON.stringify(v)}) should be false`)
})
check('6. isNotebookEmpty', () => {
  assert.equal(isNotebookEmpty({}), true)
  assert.equal(isNotebookEmpty({ 'animals-dog': { note: '' } }), false)
})

run('Lesson 01 — values')
