// Lesson 12 practice — generics, discriminated unions, Record / keyof typeof, utility types.
//   node js-ts-course/practice/p12-generics.mts
//   npx tsc -p js-ts-course/practice
// Done = all ✅ from node AND no output from tsc.
// ⚠️ Don't edit the @ts-expect-error lines or the checks. Fix your code/types.
import { check, assert, run, todo } from './check.mjs'

// ── Exercise 1: a generic ───────────────────────────────────────────────────
// Return the first item of the array, or undefined if it's empty.
// Make it generic, so first([1, 2]) is typed `number | undefined` and
// first(['aub']) is typed `string | undefined`.
function first(items: any[]): any {
  return todo('first')
}
function _typeOnly1() {
  const n: number | undefined = first([1, 2])
  // @ts-expect-error — first(numbers) must not be assignable to string
  const s: string | undefined = first([1, 2])
  void [n, s]
}

// ── Exercise 2: generic loadJSON ────────────────────────────────────────────
// Same behaviour as Lesson 05 (fallback when missing or broken), now generic:
// the return type must follow `fallback`'s type.
const disk = new Map<string, string>([['xp', '120'], ['broken', '{nope']])
async function loadJSON(key: string, fallback: any): Promise<any> {
  return todo('loadJSON')
}
async function _typeOnly2() {
  const xp: number = await loadJSON('xp', 0)
  // @ts-expect-error — the fallback is a number, so the result is a number, not a string
  const wrong: string = await loadJSON('xp', 0)
  void [xp, wrong]
}

// ── Exercise 3: a lookup table with `satisfies` + keyof typeof ──────────────
// 1. Write the type PointRule = { points: number; capped: boolean }.
// 2. Add `satisfies Record<string, PointRule>` to POINT_SOURCES.
// 3. Define PointSource by DERIVING it from the object's keys (don't list them by hand).
// 4. Write pointsFor(source) so it only accepts real sources.
type PointRule = any
const POINT_SOURCES = {
  'lesson-step': { points: 2, capped: true },
  'quiz-complete': { points: 5, capped: true },
  'speak-attempt': { points: 4, capped: false },
}
type PointSource = any
function pointsFor(source: PointSource): number {
  return todo('pointsFor')
}
function _typeOnly3() {
  // @ts-expect-error — a typo'd source must not compile
  pointsFor('quiz-complte')
  const bad = {
    // @ts-expect-error — with `satisfies`, a value of the wrong shape is caught
    'x': { points: 'five', capped: true },
  } satisfies Record<string, PointRule>
  void bad
}

// ── Exercise 4: utility types ───────────────────────────────────────────────
type Note = { id: string; title: string; body: string; updatedAt: string }
// Write NotePatch: every field of Note EXCEPT id, all optional. Use Omit + Partial.
type NotePatch = any
// Apply the patch, return a NEW note, and set updatedAt to `now`.
function updateNote(note: Note, patch: NotePatch, now: string): Note {
  return todo('updateNote')
}
function _typeOnly4(n: Note) {
  updateNote(n, { title: 'Tones' }, 'now')
  // @ts-expect-error — the id must never be patchable
  updateNote(n, { id: 'hijack' }, 'now')
}

// ── Exercise 5: a typed reducer (your Lesson 08 machine) ────────────────────
type Card = { id: string; hmong: string; english: string }
type FlashState = {
  status: 'idle' | 'front' | 'back' | 'finished'
  cards: Card[]
  index: number
  known: string[]
  unknown: string[]
}
// Write FlashAction as a DISCRIMINATED UNION of:
//   start (with cards), flip, grade (with knew: boolean), reset
type FlashAction = any

const initial: FlashState = { status: 'idle', cards: [], index: 0, known: [], unknown: [] }

// Port your Lesson 08 reducer here, typed. Its `default` case must contain the
// exhaustive check from Lesson 12 §2:   const unhandled: never = action
function reducer(state: FlashState, action: FlashAction): FlashState {
  return todo('typed reducer')
}
function _typeOnly5(s: FlashState) {
  reducer(s, { type: 'grade', knew: true })
  // @ts-expect-error — typo'd action type
  reducer(s, { type: 'flp' })
  // @ts-expect-error — grade without `knew`
  reducer(s, { type: 'grade' })
}

// ─────────────────────────── runtime checks (don't edit) ────────────────────
check('1. first', () => {
  assert.equal(first([7, 8]), 7)
  assert.equal(first([]), undefined)
})
check('2. loadJSON<T>', async () => {
  assert.equal(await loadJSON('xp', 0), 120)
  assert.equal(await loadJSON('missing', 5), 5)
  assert.deepEqual(await loadJSON('broken', { ok: false }), { ok: false })
})
check('3. pointsFor', () => {
  assert.equal(pointsFor('quiz-complete'), 5)
  assert.equal(pointsFor('speak-attempt'), 4)
})
check('4. updateNote', () => {
  const n: Note = { id: 'n1', title: 'Tone', body: '', updatedAt: 'old' }
  const next = updateNote(n, { title: 'Tones' }, 'new')
  assert.deepEqual(next, { id: 'n1', title: 'Tones', body: '', updatedAt: 'new' })
  assert.equal(n.title, 'Tone', 'never mutate the input')
})
check('5. typed reducer', () => {
  const cards = [{ id: 'a', hmong: 'aub', english: 'dog' }]
  let s = reducer(initial, { type: 'start', cards })
  s = reducer(s, { type: 'flip' })
  s = reducer(s, { type: 'grade', knew: true })
  assert.equal(s.status, 'finished')
  assert.deepEqual(s.known, ['a'])
  assert.deepEqual(reducer(s, { type: 'reset' }), initial)
})
check('types: run `npx tsc -p js-ts-course/practice` too', () => {})

run('Lesson 12 — TypeScript II')
void [_typeOnly1, _typeOnly2, _typeOnly3, _typeOnly4, _typeOnly5]
