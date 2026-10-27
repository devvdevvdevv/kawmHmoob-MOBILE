// Lesson 03 practice — array methods, lookup objects, immutable updates.
// Run:  node js-ts-course/practice/p03-arrays-objects.mjs
//
// RULE FOR THIS FILE: no `for` loops in exercises 1–6. Use the array methods.
// (Loops are fine in real code. Here the point is to learn the methods.)
import { check, assert, run, todo } from './check.mjs'

// A tiny copy of src/data/vocabulary.js — same shape, fewer words.
const categories = [
  {
    id: 'animals',
    title: 'Animals',
    words: [
      { id: 'animals-dog', hmongRPA: 'aub', english: 'dog', tags: ['mammal', 'pet'] },
      { id: 'animals-cat', hmongRPA: 'miv', english: 'cat', tags: ['mammal', 'pet'] },
      { id: 'animals-chicken', hmongRPA: 'qaib', english: 'chicken', tags: ['bird', 'farm'] },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    words: [
      { id: 'food-rice', hmongRPA: 'mov', english: 'rice; food', tags: ['staple'] },
      { id: 'food-water', hmongRPA: 'dej', english: 'water', tags: ['drink'] },
    ],
  },
  { id: 'empty', title: 'Coming soon', words: [] },
]

// ── 1. map ─ every Hmong word in one category, in order ─────────────────────
//   hmongWords(categories[0]) → ['aub', 'miv', 'qaib']
const hmongWords = (category) => todo('hmongWords')

// ── 2. filter ─ words in a category that have a given tag ───────────────────
//   wordsTagged(categories[0], 'pet') → the dog and cat objects
const wordsTagged = (category, tag) => todo('wordsTagged')

// ── 3. find across everything ─ the word object with this id, or undefined ──
// Hint: flatMap all words into one array first, then find.
const findWord = (id) => todo('findWord')

// ── 4. reduce ─ total number of words across all categories ─────────────────
const totalWords = () => todo('totalWords')

// ── 5. the quiz gate (from lib/access.js) ───────────────────────────────────
// vocabProgress is an object keyed by word id: { 'animals-dog': 'known', … }
// Return { studied, needed, unlocked }:
//   studied  — how many of the category's words have an entry in vocabProgress
//   needed   — Math.ceil(words.length * 0.5)
//   unlocked — studied >= needed
const quizGate = (category, vocabProgress) => todo('quizGate')

// ── 6. some / every ─────────────────────────────────────────────────────────
// hasEmptyCategory() → true if ANY category has zero words
// allWordsHaveIds()  → true if EVERY word in every category has an id that starts with its category id + '-'
const hasEmptyCategory = () => todo('hasEmptyCategory')
const allWordsHaveIds = () => todo('allWordsHaveIds')

// ── 7–9. The notebook, as PURE functions ────────────────────────────────────
// state looks like: { savedWords: { [wordId]: { note } }, notes: [ { id, title } ] }
// Each function returns a NEW state. NEVER change `state` or anything inside it.
// The checks freeze the input, so any mutation will throw.

// 7. Add wordId → { note } to savedWords.
const saveWord = (state, wordId, note = '') => todo('saveWord')

// 8. Remove wordId from savedWords. (Copy first, then delete from the copy.)
const unsaveWord = (state, wordId) => todo('unsaveWord')

// 9. Change the title of the note with this id; leave every other note as it is.
const renameNote = (state, id, title) => todo('renameNote')

// ─────────────────────────── checks (don't edit) ────────────────────────────
const deepFreeze = (o) => { Object.values(o).forEach((v) => v && typeof v === 'object' && deepFreeze(v)); return Object.freeze(o) }
const baseState = () => deepFreeze({
  savedWords: { 'animals-dog': { note: 'aub!' } },
  notes: [{ id: 'n1', title: 'Tones' }, { id: 'n2', title: 'Classifiers' }],
})

check('1. hmongWords (map)', () => {
  assert.deepEqual(hmongWords(categories[0]), ['aub', 'miv', 'qaib'])
  assert.deepEqual(hmongWords(categories[2]), [])
})
check('2. wordsTagged (filter)', () => {
  assert.deepEqual(wordsTagged(categories[0], 'pet').map((w) => w.id), ['animals-dog', 'animals-cat'])
  assert.deepEqual(wordsTagged(categories[1], 'pet'), [])
})
check('3. findWord (flatMap + find)', () => {
  assert.equal(findWord('food-water')?.hmongRPA, 'dej')
  assert.equal(findWord('nope'), undefined)
})
check('4. totalWords (reduce)', () => {
  assert.equal(totalWords(), 5)
})
check('5. quizGate', () => {
  assert.deepEqual(quizGate(categories[0], { 'animals-dog': 'known' }), { studied: 1, needed: 2, unlocked: false })
  assert.deepEqual(quizGate(categories[0], { 'animals-dog': 'known', 'animals-cat': 'learning', 'food-rice': 'known' }),
    { studied: 2, needed: 2, unlocked: true })
})
check('6. some / every', () => {
  assert.equal(hasEmptyCategory(), true)
  assert.equal(allWordsHaveIds(), true)
})
check('7. saveWord (immutable)', () => {
  const s = baseState()
  const next = saveWord(s, 'food-rice', 'also means food')
  assert.deepEqual(next.savedWords['food-rice'], { note: 'also means food' })
  assert.deepEqual(next.savedWords['animals-dog'], { note: 'aub!' }, 'kept the old word')
  assert.equal(next.notes, s.notes, 'notes untouched — same reference is fine')
  assert.notEqual(next, s, 'must be a NEW state object')
  assert.deepEqual(saveWord(s, 'x').savedWords.x, { note: '' }, 'note defaults to empty')
})
check('8. unsaveWord (immutable)', () => {
  const s = baseState()
  const next = unsaveWord(s, 'animals-dog')
  assert.deepEqual(next.savedWords, {})
  assert.ok(s.savedWords['animals-dog'], 'the ORIGINAL state must still have it')
})
check('9. renameNote (immutable)', () => {
  const s = baseState()
  const next = renameNote(s, 'n2', 'Classifiers (lub, tus, txoj)')
  assert.deepEqual(next.notes.map((n) => n.title), ['Tones', 'Classifiers (lub, tus, txoj)'])
  assert.equal(next.notes[0], s.notes[0], 'unchanged notes keep their reference')
  assert.equal(s.notes[1].title, 'Classifiers', 'original untouched')
})

run('Lesson 03 — arrays & objects')
