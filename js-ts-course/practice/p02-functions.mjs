// Lesson 02 practice — functions, defaults, destructuring, closures.
// Run:  node js-ts-course/practice/p02-functions.mjs
//
// EIGHTEEN exercises, three per topic, in the order the lesson teaches them:
//
//   A. shapes          declaration · block arrow · short arrow · returning an object
//   B. parameters      defaults · destructuring · options object · ...rest
//   C. return          one value, a big one · guard clauses
//   D. purity          return new data, never mutate the argument
//   E. functions as values   taking and returning functions
//   F. closures        a function that remembers its own private state
//
// They get harder inside each group. Several rebuild something that really runs
// in this app — the comment says which file, so you can read the real one AFTER
// you have written yours. Reading it first turns the exercise into typing.
import { check, assert, run, todo } from './check.mjs'

// Same constants as src/lib/leveling.js.
const MAX_LEVEL = 50
const BASE = 100
const GROWTH = 12

// ════════════════════════════════════════════════════════════════════════════
// A. SHAPES — the same idea written three ways
// ════════════════════════════════════════════════════════════════════════════

// ── A1: clamp ───────────────────────────────────────────────────────────────
// Keep n between min and max.  clamp(5, 1, 10) → 5,  clamp(-3, 1, 10) → 1,  clamp(99, 1, 10) → 10
// Write it as a SHORT arrow (no braces, no `return`), using Math.min / Math.max.
const clamp = (n, min, max) => todo('clamp')

// ── A2: toneOf ──────────────────────────────────────────────────────────────
// The tone of a Hmong word is its FINAL letter, when that letter is a tone
// marker. 'zoo' has no marker → the mid tone.  (Real one: src/data/toneDrill.js)
//
// Return an OBJECT: { word, tone }   e.g. toneOf('zoo') → { word: 'zoo', tone: 'mid' }
//                                         toneOf('zos') → { word: 'zos', tone: 'low' }
//
// ⚠️ Write it as a SHORT arrow that returns an object — which is the one place
// arrows need a wrapper: `(w) => ({ … })`. Without the parens, JS reads `{` as
// a function body and you return undefined.
const TONES = { b: 'high', j: 'high-falling', v: 'rising', s: 'low', g: 'breathy', m: 'creaky', d: 'low-rising' }
const toneOf = (word) => todo('toneOf')

// ── A3: compose2 ────────────────────────────────────────────────────────────
// Return a NEW function that runs g first, then f on its result.
//   const shout = compose2((s) => s + '!', (s) => s.toUpperCase())
//   shout('aub') → 'AUB!'
// Write it with NO braces and NO `return` anywhere: an arrow returning an arrow.
const compose2 = (f, g) => todo('compose2')

// ════════════════════════════════════════════════════════════════════════════
// B. PARAMETERS — defaults, destructuring, options, rest
// ════════════════════════════════════════════════════════════════════════════

// ── B1: buttonClasses ───────────────────────────────────────────────────────
// Rebuild the class-string logic of src/components/ui/Button.jsx, simplified.
// Takes ONE options object: { variant, size, disabled }, all optional, and
// calling buttonClasses() with NO argument must also work.
//   defaults: variant 'primary', size 'md', disabled false
//   an unknown variant/size falls back to primary/md
// Returns `${SIZES[size]} ${VARIANTS[variant]}` plus ' opacity-50' when disabled.
const VARIANTS = { primary: 'bg-clay-600', ghost: 'border' }
const SIZES = { sm: 'px-4', md: 'px-5' }
function buttonClasses(/* destructure here, with defaults, and = {} */) {
  return todo('buttonClasses')
}

// ── B2: sensesFor ───────────────────────────────────────────────────────────
// The real one is src/lib/senses.js, and it is the rule that stops a family
// flashcard teaching that `txiv` means fruit.
//
// DESTRUCTURE THE WORD IN THE PARAMETER LIST — `{ english, senses = [] }` —
// then return the glosses belonging to `domain`, as an array of strings:
//   a sense is { en, context, note? };  with a note, the string is `${en} — ${note}`
//
// ⚠️ THE RULE THAT MATTERS: when NO sense matches the domain, fall back to
// [english] — never to the whole list. Falling back to everything is the bug the
// real file exists to prevent.
function sensesFor({ /* destructure */ }, domain) {
  return todo('sensesFor')
}

// ── B3: resolvePrefs ────────────────────────────────────────────────────────
// Merge a partial preferences object over the defaults (src/lib/quizPrefs.js).
//   resolvePrefs({ questionCount: 10 })
//     → { direction: 'hmong-english', questionCount: 10, statusFilter: 'all' }
//   resolvePrefs() → all three defaults
//
// ⚠️ THE TRAP, and the whole point of this exercise: a default fires only when
// the key is `undefined`. A stored blob can hold `null`, and `null` must NOT win
// — it is not a choice the learner made. Make the defaults apply to `null` too,
// WITHOUT breaking a legitimately falsy value (statusFilter: '' stays '').
const DEFAULT_PREFS = { direction: 'hmong-english', questionCount: 'all', statusFilter: 'all' }
function resolvePrefs(stored) {
  return todo('resolvePrefs')
}

// ════════════════════════════════════════════════════════════════════════════
// C. RETURN — one value, but it can be a big one · guard clauses
// ════════════════════════════════════════════════════════════════════════════

// ── C1: totalForLevel ───────────────────────────────────────────────────────
// Total points needed to REACH `level`. Level 1 costs 0.
// Going from level N to N+1 costs  BASE + (N - 1) * GROWTH.
//   level 1 → 0,  level 2 → 100,  level 3 → 100 + 112 = 212
// Levels below 1 count as 1; levels above MAX_LEVEL count as MAX_LEVEL. (Use your clamp!)
function totalForLevel(level) {
  return todo('totalForLevel')
}

// ── C2: levelFromPoints ─────────────────────────────────────────────────────
// Return an OBJECT: { level, into, needed, maxed }
//   level  — the highest level whose totalForLevel(level) <= points
//   into   — points earned past the start of that level
//   needed — how many points this level spans (next level's total − this level's total);
//            at MAX_LEVEL it's 0
//   maxed  — true at MAX_LEVEL
// `points` defaults to 0; negative points count as 0.
// Use the property shorthand ({ level } instead of { level: level }).
function levelFromPoints(points) {
  return todo('levelFromPoints')
}

// ── C3: quizUnlock ──────────────────────────────────────────────────────────
// The study-before-quiz gate, from src/lib/access.js. THIS IS A GUARD-CLAUSE
// EXERCISE: three cases leave early, and only the fourth does arithmetic.
//
//   quizId not starting 'vocab-'  → { gated: false, unlocked: true }   (nothing to study)
//   no such category, or it has no words → the same
//   otherwise → { gated: true, unlocked, studied, needed, remaining }
//     studied   how many of the category's words have an entry in vocabProgress
//     needed    HALF the category, rounded UP
//     unlocked  studied >= needed
//     remaining never below 0
//
// Write the early returns FIRST, then the body. If you find yourself nesting
// `if` three deep, you are not using guards.
const RATIO = 0.5
function quizUnlock(quizId, vocabProgress = {}, categories = {}) {
  return todo('quizUnlock')
}

// ════════════════════════════════════════════════════════════════════════════
// D. PURITY — return new data, never touch the argument
// ════════════════════════════════════════════════════════════════════════════

// ── D1: sortedByBest ────────────────────────────────────────────────────────
// Given [{ id, accuracy }], return a NEW array sorted by accuracy, highest first.
// ⚠️ .sort() mutates. The checks assert the input array is untouched, so copy first.
function sortedByBest(scores) {
  return todo('sortedByBest')
}

// ── D2: answerQuestion ──────────────────────────────────────────────────────
// One step of the quiz scoreboard (the `answer` case in src/hooks/useQuizState.js).
// Given state { score, streak, bestStreak } and whether the answer was correct,
// return a NEW state object:
//   correct → score + 1, streak + 1
//   wrong   → score unchanged, streak back to 0
//   bestStreak is the high-water mark — it never goes down
// ⚠️ PURE: the old state object must still hold its original numbers afterwards.
function answerQuestion(state, isCorrect) {
  return todo('answerQuestion')
}

// ── D3: applyStatusFilter ───────────────────────────────────────────────────
// From src/lib/quizPrefs.js. Narrow a dataset to the items matching a status.
// Return { dataset, fellBack }.
//   filter 'all', or no statusOf function → the dataset unchanged, fellBack false
//   otherwise keep items where statusOf(item) === filter
//
// ⚠️ IT MUST REFUSE TO RETURN AN EMPTY SET. "Only Known" before anything is known
// would make a quiz with no questions, which reads as a broken screen — so when
// the filter matches nothing, hand back the FULL dataset with fellBack: true.
function applyStatusFilter(dataset, filter, statusOf) {
  return todo('applyStatusFilter')
}

// ════════════════════════════════════════════════════════════════════════════
// E. FUNCTIONS AS VALUES — take one, return one
// ════════════════════════════════════════════════════════════════════════════

// ── E1: applyTwice ──────────────────────────────────────────────────────────
// Call `fn` on `x`, then call `fn` again on the result.
//   applyTwice((n) => n + 3, 1) → 7
function applyTwice(fn, x) {
  return todo('applyTwice')
}

// ── E2: onceOnly ────────────────────────────────────────────────────────────
// Return a wrapped function that calls `fn` the FIRST time only. Every later
// call returns the first result without running `fn` again.
//
// This is the `savedThisRun` latch in QuizEngine.jsx, generalised: an effect can
// re-run on any render, and without a latch one finished quiz gets filed twice.
function onceOnly(fn) {
  return todo('onceOnly')
}

// ── E3: memoize ─────────────────────────────────────────────────────────────
// Return a wrapped version of `fn` that remembers results by its FIRST argument,
// so a repeat call does no work. Your wrapper must also report how many times
// the real `fn` actually ran: expose it as `wrapped.calls`.
//   const slow = (n) => n * 2
//   const fast = memoize(slow)
//   fast(21); fast(21)   → 42 both times, fast.calls === 1
// ⚠️ A result of `undefined` must still count as cached — so "is it in the cache?"
// cannot be `if (cache[key])`.
function memoize(fn) {
  return todo('memoize')
}

// ════════════════════════════════════════════════════════════════════════════
// F. CLOSURES — private state that survives between calls
// ════════════════════════════════════════════════════════════════════════════

// ── F1: makeIdMaker ─────────────────────────────────────────────────────────
// makeIdMaker('note') returns a FUNCTION. Each call of that function returns
// 'note-1', 'note-2', 'note-3'… Two id makers must count separately.
function makeIdMaker(prefix) {
  return todo('makeIdMaker')
}

// ── F2: makeStore ───────────────────────────────────────────────────────────
// The shape behind src/hooks/useAudio.js: one value, many watchers.
// Return { get, set, subscribe } where
//   get()            → the current value
//   set(next)        → store it AND call every subscriber (no arguments)
//   subscribe(fn)    → register fn, and RETURN a function that unsubscribes it
// ⚠️ `set` to the SAME value must not notify anyone — a re-render for nothing is
// the bug this guard prevents.
function makeStore(initial) {
  return todo('makeStore')
}

// ── F3: makeSpeaker ─────────────────────────────────────────────────────────
// src/lib/audioOwner.js, which is what finally fixed the app's dying audio.
// ONE claim exists at a time. Return { claim, release, held }:
//   claim(token, onRelease)  if someone ELSE holds it, call THEIR onRelease first,
//                            then record this token as the holder
//   release(token)           give it up, but ONLY if this token still holds it
//                            (a late release from a preempted owner must not
//                             clear the claim belonging to whoever replaced it)
//   held()                   true while anyone holds it
// ⚠️ Re-claiming with the SAME token must not call your own onRelease — that
// would stop the clip you just started.
function makeSpeaker() {
  return todo('makeSpeaker')
}

// ─────────────────────────── checks (don't edit) ────────────────────────────

check('A1. clamp', () => {
  assert.equal(clamp(5, 1, 10), 5)
  assert.equal(clamp(-3, 1, 10), 1)
  assert.equal(clamp(99, 1, 10), 10)
})
check('A2. toneOf', () => {
  assert.deepEqual(toneOf('zoo'), { word: 'zoo', tone: 'mid' })
  assert.deepEqual(toneOf('zos'), { word: 'zos', tone: 'low' })
  assert.deepEqual(toneOf('niam'), { word: 'niam', tone: 'creaky' })
  assert.deepEqual(toneOf('koj'), { word: 'koj', tone: 'high-falling' })
})
check('A3. compose2', () => {
  const shout = compose2((s) => s + '!', (s) => s.toUpperCase())
  assert.equal(shout('aub'), 'AUB!')
  const addThenDouble = compose2((n) => n * 2, (n) => n + 1)
  assert.equal(addThenDouble(4), 10, 'g runs first')
})

check('B1. buttonClasses', () => {
  assert.equal(buttonClasses(), 'px-5 bg-clay-600')
  assert.equal(buttonClasses({ size: 'sm', variant: 'ghost' }), 'px-4 border')
  assert.equal(buttonClasses({ disabled: true }), 'px-5 bg-clay-600 opacity-50')
  assert.equal(buttonClasses({ variant: 'nope', size: 'huge' }), 'px-5 bg-clay-600')
})
check('B2. sensesFor', () => {
  const siab = {
    english: 'tall; high',
    senses: [
      { en: 'the liver', context: 'personality' },
      { en: 'chest', context: 'reading', note: 'in "lub hauv siab"' },
      { en: 'tall; high', context: 'descriptions' },
    ],
  }
  assert.deepEqual(sensesFor(siab, 'descriptions'), ['tall; high'])
  assert.deepEqual(sensesFor(siab, 'reading'), ['chest — in "lub hauv siab"'], 'a note joins with an em dash')
  assert.deepEqual(sensesFor(siab, 'food'), ['tall; high'], 'no match → [english], NEVER the whole list')
  assert.deepEqual(sensesFor({ english: 'water' }, 'food'), ['water'], 'no senses at all → [english]')
})
check('B3. resolvePrefs', () => {
  assert.deepEqual(resolvePrefs(), DEFAULT_PREFS, 'no argument → every default')
  assert.deepEqual(resolvePrefs({ questionCount: 10 }), { ...DEFAULT_PREFS, questionCount: 10 })
  assert.deepEqual(resolvePrefs({ direction: null }), DEFAULT_PREFS, 'null is not a choice — default wins')
  assert.deepEqual(resolvePrefs({ statusFilter: '' }), { ...DEFAULT_PREFS, statusFilter: '' }, "'' IS a value — keep it")
})

check('C1. totalForLevel', () => {
  assert.equal(totalForLevel(1), 0)
  assert.equal(totalForLevel(2), 100)
  assert.equal(totalForLevel(3), 212)
  assert.equal(totalForLevel(0), 0, 'levels below 1 count as 1')
  assert.equal(totalForLevel(51), totalForLevel(50), 'levels above 50 count as 50')
  assert.equal(totalForLevel(50), 19012)
})
check('C2. levelFromPoints', () => {
  assert.deepEqual(levelFromPoints(0), { level: 1, into: 0, needed: 100, maxed: false })
  assert.deepEqual(levelFromPoints(150), { level: 2, into: 50, needed: 112, maxed: false })
  assert.deepEqual(levelFromPoints(212), { level: 3, into: 0, needed: 124, maxed: false })
  assert.deepEqual(levelFromPoints(), { level: 1, into: 0, needed: 100, maxed: false }, 'no argument → 0 points')
  assert.deepEqual(levelFromPoints(-40), { level: 1, into: 0, needed: 100, maxed: false })
  assert.deepEqual(levelFromPoints(999999), { level: 50, into: 999999 - 19012, needed: 0, maxed: true })
})
check('C3. quizUnlock', () => {
  const cats = { animals: { words: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }, empty: { words: [] } }
  assert.deepEqual(quizUnlock('tone-drill', {}, cats), { gated: false, unlocked: true })
  assert.deepEqual(quizUnlock('vocab-nope', {}, cats), { gated: false, unlocked: true }, 'unknown category')
  assert.deepEqual(quizUnlock('vocab-empty', {}, cats), { gated: false, unlocked: true }, 'nothing to study')
  assert.deepEqual(
    quizUnlock('vocab-animals', { a: 'known' }, cats),
    { gated: true, unlocked: false, studied: 1, needed: 2, remaining: 1 },
  )
  assert.deepEqual(
    quizUnlock('vocab-animals', { a: 'known', b: 'learning' }, cats),
    { gated: true, unlocked: true, studied: 2, needed: 2, remaining: 0 },
  )
})

check('D1. sortedByBest', () => {
  const input = [{ id: 'a', accuracy: 70 }, { id: 'b', accuracy: 95 }, { id: 'c', accuracy: 80 }]
  assert.deepEqual(sortedByBest(input).map((s) => s.id), ['b', 'c', 'a'])
  assert.deepEqual(input.map((s) => s.id), ['a', 'b', 'c'], 'the argument must NOT be reordered')
})
check('D2. answerQuestion', () => {
  const start = { score: 2, streak: 2, bestStreak: 5 }
  assert.deepEqual(answerQuestion(start, true), { score: 3, streak: 3, bestStreak: 5 })
  assert.deepEqual(answerQuestion(start, false), { score: 2, streak: 0, bestStreak: 5 })
  assert.deepEqual(answerQuestion({ score: 0, streak: 5, bestStreak: 5 }, true).bestStreak, 6, 'a new high counts')
  assert.deepEqual(start, { score: 2, streak: 2, bestStreak: 5 }, 'the old state is untouched')
})
check('D3. applyStatusFilter', () => {
  const data = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const statusOf = (item) => ({ a: 'known', b: 'learning', c: 'learning' })[item.id]
  assert.deepEqual(applyStatusFilter(data, 'all', statusOf), { dataset: data, fellBack: false })
  assert.deepEqual(applyStatusFilter(data, 'learning', null), { dataset: data, fellBack: false }, 'no statusOf → no-op')
  assert.deepEqual(
    applyStatusFilter(data, 'learning', statusOf),
    { dataset: [{ id: 'b' }, { id: 'c' }], fellBack: false },
  )
  assert.deepEqual(
    applyStatusFilter(data, 'new', statusOf),
    { dataset: data, fellBack: true },
    'nothing matched → the whole set, and SAY so',
  )
})

check('E1. applyTwice', () => {
  assert.equal(applyTwice((n) => n + 3, 1), 7)
  assert.equal(applyTwice((s) => s + '!', 'aub'), 'aub!!')
})
check('E2. onceOnly', () => {
  let ran = 0
  const save = onceOnly((n) => { ran++; return n * 10 })
  assert.equal(save(4), 40)
  assert.equal(save(9), 40, 'later calls return the FIRST result')
  assert.equal(ran, 1, 'the wrapped function ran once')
})
check('E3. memoize', () => {
  const double = memoize((n) => n * 2)
  assert.equal(double(21), 42)
  assert.equal(double(21), 42)
  assert.equal(double.calls, 1, 'a repeat argument does no work')
  assert.equal(double(5), 10)
  assert.equal(double.calls, 2)
  const nothing = memoize(() => undefined)
  nothing('x'); nothing('x')
  assert.equal(nothing.calls, 1, 'undefined is a real cached result')
})

check('F1. makeIdMaker', () => {
  const note = makeIdMaker('note')
  const word = makeIdMaker('word')
  assert.equal(note(), 'note-1')
  assert.equal(note(), 'note-2')
  assert.equal(word(), 'word-1', 'each maker needs its OWN counter')
  assert.equal(note(), 'note-3')
})
check('F2. makeStore', () => {
  const store = makeStore(null)
  let seen = 0
  const off = store.subscribe(() => { seen++ })
  assert.equal(store.get(), null)
  store.set('verbs-eat')
  assert.equal(store.get(), 'verbs-eat')
  assert.equal(seen, 1)
  store.set('verbs-eat')
  assert.equal(seen, 1, 'the same value must not notify')
  off()
  store.set('verbs-go')
  assert.equal(seen, 1, 'unsubscribed means unsubscribed')
  assert.equal(store.get(), 'verbs-go')
})
check('F3. makeSpeaker', () => {
  const sp = makeSpeaker()
  const log = []
  const a = {}, b = {}
  assert.equal(sp.held(), false)
  sp.claim(a, () => log.push('a released'))
  assert.equal(sp.held(), true)
  sp.claim(a, () => log.push('a released again'))
  assert.deepEqual(log, [], 're-claiming with the same token releases nothing')
  sp.claim(b, () => log.push('b released'))
  assert.deepEqual(log, ['a released again'], 'a new owner releases the previous one')
  sp.release(a)
  assert.equal(sp.held(), true, "a's late release must not clear b's claim")
  sp.release(b)
  assert.equal(sp.held(), false)
})

run('Lesson 02 — functions')
