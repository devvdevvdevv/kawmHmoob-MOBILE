// Lesson 08 practice — write a reducer (a pure state machine) from scratch.
// Run:  node js-ts-course/practice/p08-reducer.mjs
import { check, assert, run, todo } from './check.mjs'

// A FLASHCARD SESSION. The machine:
//
//            start                 flip                 grade (not last)
//   idle ──────────► front ─────────────► back ─────────────────────► front (next card)
//                                           │
//                                           │ grade (last card)
//                                           ▼
//                                        finished ──── reset ───► idle
//
// State:
//   status   'idle' | 'front' | 'back' | 'finished'
//   cards    the cards for this session (array of { id, hmong, english })
//   index    which card is showing
//   known    array of card ids graded "knew it"
//   unknown  array of card ids graded "didn't know"
//
// Actions:
//   { type: 'start', cards }        → status 'front', index 0, fresh known/unknown
//                                     (if `cards` is EMPTY → go straight to 'finished')
//   { type: 'flip' }                → front → back. In any other status: no change.
//   { type: 'grade', knew }         → only allowed from 'back' (otherwise: no change).
//                                     Push the current card's id into known or unknown.
//                                     Then the next card on its 'front', or 'finished' after the last card.
//   { type: 'reset' }               → back to `initial`
//   anything else                   → no change (return the SAME state object)
//
// Rules: never mutate `state`. Return a new object for every real change.

export const initial = { status: 'idle', cards: [], index: 0, known: [], unknown: [] }

export function flashcardReducer(state, action) {
  return todo('flashcardReducer')
}

// A derived value, not state (Lesson 07 §2): the card on screen, or null.
export function currentCard(state) {
  return todo('currentCard')
}

// ─────────────────────────── checks (don't edit) ────────────────────────────
const deepFreeze = (o) => { Object.values(o).forEach((v) => v && typeof v === 'object' && deepFreeze(v)); return Object.freeze(o) }
const cards = deepFreeze([
  { id: 'animals-dog', hmong: 'aub', english: 'dog' },
  { id: 'animals-cat', hmong: 'miv', english: 'cat' },
])
const play = (...actions) => actions.reduce((s, a) => deepFreeze(flashcardReducer(s, a)), deepFreeze({ ...initial }))

check('start', () => {
  const s = play({ type: 'start', cards })
  assert.equal(s.status, 'front')
  assert.equal(s.index, 0)
  assert.deepEqual(s.known, [])
  assert.equal(currentCard(s)?.hmong, 'aub')
})
check('start with no cards → finished', () => {
  assert.equal(play({ type: 'start', cards: [] }).status, 'finished')
})
check('flip', () => {
  assert.equal(play({ type: 'start', cards }, { type: 'flip' }).status, 'back')
})
check('grade moves to the next card', () => {
  const s = play({ type: 'start', cards }, { type: 'flip' }, { type: 'grade', knew: true })
  assert.equal(s.status, 'front')
  assert.equal(s.index, 1)
  assert.deepEqual(s.known, ['animals-dog'])
  assert.equal(currentCard(s)?.hmong, 'miv')
})
check('grading the last card finishes', () => {
  const s = play({ type: 'start', cards }, { type: 'flip' }, { type: 'grade', knew: true },
    { type: 'flip' }, { type: 'grade', knew: false })
  assert.equal(s.status, 'finished')
  assert.deepEqual(s.known, ['animals-dog'])
  assert.deepEqual(s.unknown, ['animals-cat'])
  assert.equal(currentCard(s), null, 'no card on screen once finished')
})
check('illegal moves change nothing', () => {
  const front = play({ type: 'start', cards })
  assert.equal(flashcardReducer(front, { type: 'grade', knew: true }), front, "can't grade before flipping")
  const back = play({ type: 'start', cards }, { type: 'flip' })
  assert.equal(flashcardReducer(back, { type: 'flip' }), back, 'flipping the back does nothing')
  assert.equal(flashcardReducer(back, { type: 'dance' }), back, 'unknown action → same state')
})
check('a new start clears the old session', () => {
  const s = play({ type: 'start', cards }, { type: 'flip' }, { type: 'grade', knew: true }, { type: 'start', cards })
  assert.deepEqual(s.known, [])
  assert.equal(s.index, 0)
})
check('reset', () => {
  const s = play({ type: 'start', cards }, { type: 'reset' })
  assert.deepEqual(s, initial)
  assert.equal(currentCard(s), null)
})

run('Lesson 08 — reducers')
