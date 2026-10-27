// Lesson 11 practice — your first types.
//   node js-ts-course/practice/p11-types.mts      ← do the functions WORK?
//   npx tsc -p js-ts-course/practice              ← are the TYPES right?
//
// You're done when node shows all ✅ AND tsc prints nothing.
//
// Lines under `// @ts-expect-error` are code that SHOULD be rejected. If your
// type lets them through, tsc says "Unused '@ts-expect-error' directive".
// Lines WITHOUT that comment must compile cleanly.
// ⚠️ Don't edit or delete the @ts-expect-error lines. Fix your TYPES instead.
import { check, assert, run, todo } from './check.mjs'

// ── Exercise 1: the Word type ───────────────────────────────────────────────
// Replace `any` with an object type describing one vocabulary word:
//   id, hmongRPA, english          strings, required
//   tags                           an array of strings, required
//   audioFile                      required, but may be null
//   exampleSentence                OPTIONAL; when present: { hmong: string; english: string }
type Word = any

const dog: Word = { id: 'animals-dog', hmongRPA: 'aub', english: 'dog', tags: ['pet'], audioFile: null }
const rice: Word = { id: 'food-rice', hmongRPA: 'mov', english: 'rice; food', tags: [], audioFile: 'mov.mp3',
  exampleSentence: { hmong: 'Kuv noj mov.', english: 'I eat rice.' } }
// @ts-expect-error — hmongRPA is missing
const noHmong: Word = { id: 'x', english: 'x', tags: [], audioFile: null }
// @ts-expect-error — audioFile must be a string or null, not a number
const badAudio: Word = { id: 'x', hmongRPA: 'x', english: 'x', tags: [], audioFile: 5 }
// @ts-expect-error — tags must be an array of strings
const badTags: Word = { id: 'x', hmongRPA: 'x', english: 'x', tags: 'pet', audioFile: null }

// ── Exercise 2: a union of literals ─────────────────────────────────────────
// The four Button variants from Button.jsx: primary, secondary, ghost, danger.
type ButtonVariant = any

const v1: ButtonVariant = 'ghost'
// @ts-expect-error — a typo must not compile
const v2: ButtonVariant = 'primay'

// ── Exercise 3: annotate a function ─────────────────────────────────────────
// Add parameter types AND a return type, then write the body.
//   levelLabel(12, false) → 'Level 12'
//   levelLabel(50, true)  → 'Level 50 · MAX'
function levelLabel(level, maxed) {
  return todo('levelLabel')
}
function _typeOnly3() {   // never called; exists only for tsc to read
  // @ts-expect-error — level must be a number
  levelLabel('12', false)
}

// ── Exercise 4: narrowing ───────────────────────────────────────────────────
// Return the Hmong for the word with this id, or '?' if there's no such word.
// Use .find — then NARROW the `Word | undefined` it gives you (Lesson 11 §6).
function hmongOf(words: Word[], id: string): string {
  return todo('hmongOf')
}

// ── Exercise 5: props type ──────────────────────────────────────────────────
// Describe the props of a simplified Button:
//   label     string, required
//   onPress   a function taking nothing and returning nothing, OPTIONAL
//   variant   your ButtonVariant, OPTIONAL
//   disabled  boolean, OPTIONAL
type ButtonProps = any

const ok1: ButtonProps = { label: 'Save' }
const ok2: ButtonProps = { label: 'Delete', variant: 'danger', onPress: () => {}, disabled: true }
// @ts-expect-error — label is required
const noLabel: ButtonProps = { variant: 'ghost' }
// @ts-expect-error — onPress must be a function
const badPress: ButtonProps = { label: 'Go', onPress: 'goHome' }

// ── Exercise 6: unknown from storage ────────────────────────────────────────
// Data read from storage is `unknown`. Return it as a number when it's a finite number,
// OR a string holding a finite number ('80' → 80). Anything else → null.
// Hints: typeof, Number(), Number.isFinite(). Don't use `any`.
function readScore(raw: unknown): number | null {
  return todo('readScore')
}

// ─────────────────────────── runtime checks (don't edit) ────────────────────
check('3. levelLabel', () => {
  assert.equal(levelLabel(12, false), 'Level 12')
  assert.equal(levelLabel(50, true), 'Level 50 · MAX')
})
check('4. hmongOf', () => {
  assert.equal(hmongOf([dog, rice], 'food-rice'), 'mov')
  assert.equal(hmongOf([dog, rice], 'nope'), '?')
})
check('6. readScore', () => {
  assert.equal(readScore(80), 80)
  assert.equal(readScore('80'), 80)
  assert.equal(readScore(0), 0)
  for (const bad of [null, undefined, 'abc', '', {}, NaN, Infinity, true]) {
    assert.equal(readScore(bad), null, `readScore(${String(bad)}) should be null`)
  }
})
check('types: run `npx tsc -p js-ts-course/practice` too', () => {})

run('Lesson 11 — TypeScript I')

// (keeps "declared but never used" quiet — these exist only to be type-checked)
void [noHmong, badAudio, badTags, v1, v2, ok1, ok2, noLabel, badPress, _typeOnly3]
