import { getCategory } from './vocabulary.js'

// THE CURRICULUM SPINE — the ordered beginner path.
//
// Designed in notes/2026-09-20-progressive-unlock-design.md, built
// 2026-09-20. This file is the DATA half only: the units, their order, and the
// derivations that say which ones the content can currently support. The
// screens it was designed for (a Home tab with one Continue card, a unit screen
// with five steps) are NOT built — see "What this file is not" below.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ A UNIT IS NOT A CATEGORY. This is the one architectural decision here, and
// everything else follows from it. A unit REFERENCES one to three categories;
// categories are never locked. Four reasons, all from the design note:
//
//   1. 77 categories is not a path. Many are tiny — `introductions` has 4
//      words, `daily-life` 4, `politeness` 6. A four-word "lesson" cannot carry
//      five steps. Units bundle them without touching vocabulary.js again.
//
//   2. vocabulary.js stays a DICTIONARY. Its 1,351 words serve the reader's
//      long-press, the sentence builder and the Reference tab, all of which
//      need everything visible. A `locked: true` in there would mean the data
//      layer had opinions about curriculum, and Reference would have to fight
//      them.
//
//   3. The pattern already exists twice. CATEGORY_THEMES in vocabulary.js
//      references category ids for display only; `units` in lessons.js wraps
//      lessons into groups. This is the same move.
//
//   4. Reordering stays cheap. Changing `order` reorders the course. Changing a
//      category id would strand saved progress.
//
// ⚠️ PROGRESS MUST KEY ON `unitId`, NEVER ON A CATEGORY ID. This project merges
// and splits categories often (see the "waiting room" note on `misc` in
// vocabulary.js). Keying progress on a category means the next split resets
// somebody's course. The unit ids below are therefore permanent: rename a
// title freely, never an id.
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️ EVERY UNIT CAPS AT 20 WORDS. A unit is a curated slice of a category, not
// the whole of it. Measured 2026-09-20: four of the ten units are over the cap
// (numbers 23, food 38, verbs 28, time 26), and `food` at 38 is not a lesson,
// it is a wordlist. The overflow stays in the category for the Reference tab.
export const UNIT_WORD_CAP = 20

/**
 * The path, in TEACHING order — what a learner is shown.
 *
 * ⚠️ TEACHING ORDER IS NOT BUILD ORDER, and the gap is the whole content plan.
 * Measured 2026-09-20: Greetings is where every language course starts and is
 * the LEAST ready unit here (19 of 20 sentences missing), while Numbers and
 * Classifiers are 100% ready today. So build in readiness order — 3, 5, 8 →
 * 2, 7, 4 → 1, 9 → 6, 10 — and present in this order. `livePath()` below is
 * what makes that possible: a unit appears when its content can carry it, and
 * the learner only ever sees units 1→10.
 *
 * FIELDS
 *   id          permanent; progress keys on it. Never rename.
 *   title       display only; rename freely.
 *   order       teaching position. Changing this reorders the course safely.
 *   categories  1–3 category ids from vocabulary.js. Validated by
 *               scripts/check-path.mjs — a typo here would silently produce a
 *               shorter unit, never an error.
 *   limit       trim to this many words. See the ⚠️ on limit vs words below.
 *   words       explicit word ids, in teaching order. BEATS `limit`.
 *   free        outside the paywall.
 *   blurb       one line, shown on the path row.
 *   why         why the unit sits at this position — kept in the data because
 *               the ordering argument is the part that gets lost first.
 */
export const path = [
  {
    id: 'u-greetings',
    title: 'Greetings',
    order: 1,
    categories: ['greetings', 'politeness', 'introductions'],
    free: true,
    blurb: 'Nyob zoo, ua tsaug — your first real exchange.',
    why: 'First conversation. Free, so it sets the tone for the whole app.',
  },
  {
    id: 'u-pronouns',
    title: 'You & Me',
    order: 2,
    categories: ['pronouns', 'yog-to-be'],
    free: true,
    blurb: 'Kuv yog… — the first complete sentence.',
    // Hmong marks a DUAL (wb, neb, nkawd — exactly two), which English has no
    // word for. Meeting it in unit 2 rather than discovering it later is the
    // reason this unit sits above Family: unit 4 is the payoff for this one.
    why: 'The first full sentence, and the dual pronouns surprise English speakers early.',
  },
  {
    id: 'u-numbers',
    title: 'Numbers',
    order: 3,
    categories: ['numbers'],
    limit: UNIT_WORD_CAP, // 23 words in the category
    blurb: 'Counting, age, and price.',
    why: 'Age, price, quantity. 100% content-ready as of 2026-09-20 — build first.',
  },
  {
    id: 'u-family',
    title: 'Family',
    order: 4,
    categories: ['family-male-perspective'],
    // ⚠️ ONE PERSPECTIVE ONLY. The vocabulary splits family terms by the
    // speaker's gender (family-male-perspective / family-female-perspective)
    // because Hmong kinship genuinely does. That split is a SECOND PASS, not a
    // beginner's problem — teaching both here doubles the unit and teaches the
    // exception before the rule.
    blurb: 'Niam, txiv, kwv tij — and whose they are.',
    why: 'Culturally central, and the payoff for unit 2’s pronouns.',
  },
  {
    id: 'u-classifiers',
    title: 'Classifiers',
    order: 5,
    categories: ['classifiers'],
    blurb: 'Tus, lub, daim — the word that has to come first.',
    why: 'The grammatical spine. Must land before nouns pile up. 100% ready.',
  },
  {
    id: 'u-food',
    title: 'Food & Drinks',
    order: 6,
    categories: ['food', 'drinks'],
    limit: UNIT_WORD_CAP, // 38 words in the categories — the worst overflow
    blurb: 'Mov, dej, noj, haus — eating and drinking.',
    why: 'High utility, and `mov` carries real culture. ⚠️ The single largest content hole.',
  },
  {
    id: 'u-colors',
    title: 'Colors & Describing',
    order: 7,
    categories: ['colors'],
    blurb: 'Your first adjectives — and where they sit.',
    why: 'Teaches noun-then-adjective order, which is backwards from English.',
  },
  {
    id: 'u-verbs',
    title: 'Core Verbs',
    order: 8,
    categories: ['verbs'],
    blurb: 'Noj, haus, mus, los — doing things.',
    why: 'Unlocks real sentences. The first unit curated by hand — see below.',
    // ⚠️ THE FIRST CURATED UNIT, AND THE WORKED EXAMPLE OF WHY `limit` IS NOT
    // GOOD ENOUGH. Measured 2026-09-20: `verbs` holds 28 words, 23 of which
    // have an example sentence, and `limit: 20` took the first 20 IN DATA
    // ORDER — which threw away 7 words that were ready and kept 4 that were
    // not, landing the unit at 16/20.
    //
    // ⚠️ AND THE GREEDY FIX IS WORSE THAN THE PROBLEM. Picking the 20 words
    // that already HAVE sentences would score 20/20 and ship this unit today
    // for free — but the 23 ready words do not include `muaj` (to have) or
    // `los` (to come), while they do include `nthuav` (to flip a page) and
    // `piav` (to explain). A beginner's eighth unit that teaches "flip a page"
    // and not "have" is a worse unit that happens to pass a readiness check.
    // Readiness is a measure of the CONTENT, never a curriculum argument.
    //
    // So this list is chosen on utility — can a beginner say something true
    // with it — and it leaves exactly two sentences to write (`los`, `muaj`).
    // Both already sit in the top tier of the sentence workbench, because the
    // same signals that rank them there rank them here.
    //
    // The eight verbs not listed (txuas, ntsib, xyuas, piav, nthuav, cia, tso,
    // ntsia) are NOT deleted — they stay in the `verbs` category for the
    // Reference tab and the reader's long-press, which is the whole point of a
    // unit being a curated slice rather than the category itself.
    words: [
      'verbs-eat',    'verbs-drink',  'verbs-go',     'verbs-come',   'verbs-make',
      'verbs-have',   'verbs-see',    'verbs-watch',  'verbs-say',    'verbs-tell',
      'verbs-ask',    'verbs-answer', 'verbs-learn',  'verbs-read',   'verbs-write',
      'verbs-talk',   'verbs-sit',    'verbs-stand',  'verbs-open',   'verbs-close',
    ],
  },
  {
    id: 'u-time',
    title: 'Time & Days',
    order: 9,
    categories: ['timeframes', 'days-of-week'],
    limit: UNIT_WORD_CAP, // 26 words in the categories
    blurb: 'Hnub no, tag kis — saying when.',
    why: 'Turns sentences into plans.',
  },
  {
    id: 'u-daily',
    title: 'Daily Life',
    order: 10,
    categories: ['daily-life', 'chores'],
    blurb: 'The routine that ties it together.',
    why: 'Uses every earlier unit at once.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ `limit` vs `words` — READ THIS BEFORE TRUSTING A CAPPED UNIT.
//
// `limit` takes the first N words IN DATA ORDER. Data order is not frequency
// order and nobody has ever curated it, so a capped unit today is a PLACEHOLDER
// that happens to contain 20 real words, not the 20 best ones. `u-food` is the
// clearest case: 38 words trimmed to the first 20, chosen by nothing.
//
// `words: [...]` is the real answer — explicit ids, in teaching order — and it
// beats `limit` wherever it is present. Curating those four lists is a content
// task, not a code one.
//
// ⚠️ WHY THE CAP IS NOT "PREFER THE WORDS THAT HAVE EXAMPLE SENTENCES", which
// is the obvious clever version: unit membership would then CHANGE as sentences
// get written, so a learner's "18 of 20 mastered" could silently become
// "18 of 23", and a word they had finished could drop out of the unit it was
// learned in. Deterministic beats clever for anything a learner's progress is
// measured against.
// ─────────────────────────────────────────────────────────────────────────────

/** Every word in a unit, capped and in teaching order. */
export function unitWords(unit) {
  if (!unit) return []

  const pool = (unit.categories || []).flatMap((id) => getCategory(id)?.words || [])

  // An explicit list wins, and it is looked up against the POOL rather than the
  // whole vocabulary — an id listed here that is not in the unit's own
  // categories is a mistake, and dropping it silently is what check-path.mjs
  // exists to catch.
  if (unit.words) {
    const byId = new Map(pool.map((w) => [w.id, w]))
    return unit.words.map((id) => byId.get(id)).filter(Boolean)
  }

  return typeof unit.limit === 'number' ? pool.slice(0, unit.limit) : pool
}

export function getUnit(unitId) {
  return path.find((u) => u.id === unitId) || null
}

/** The path in teaching order. Data order is already teaching order; this
 *  sorts anyway so an edit to `order` alone is enough to reorder the course. */
export function orderedPath() {
  return [...path].sort((a, b) => a.order - b.order)
}

// ─────────────────────────────────────────────────────────────────────────────
// READINESS — which units the content can actually carry.
//
// ⚠️ DERIVED, NEVER STORED. There is no `ready: true` to maintain in the data
// above. A unit becomes ready the moment enough example sentences exist, with
// no edit to this file — which is the entire point, because the content is
// being written right now and a hand-kept flag would be wrong within a week.
// This is the same contract sentenceGroups() holds in lib/sentenceBuilder.js.
//
// WHAT EACH FIELD POWERS, from the five-step unit in the design note:
//
//   exampleSentence → step 2 (quiz distractors)
//                   → step 4 (sentence builder)
//                   → step 5 (the mini-reading, assembled from these very
//                     sentences — NOT an authored story)
//   audioFile       → step 3 (tone practice: record and score)
//
// ⚠️ ONE SENTENCE POWERS THREE OF THE FIVE STEPS. Writing 20 sentences for a
// unit completes steps 2, 4 and 5 at once. That is why `ready` below is defined
// on sentences alone and why the content plan is "sentences first".
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️ AUDIO IS OUT OF THE READINESS TEST — a deliberate call on 2026-09-20, when
// recording was paused. It was never a majority: measured that day, 120 of the
// path's 218 words had a clip and two whole units (Family, Food) had none.
//
// Step 3 does NOT become an empty slot, because tone can be taught without
// sound: src/lib/typingDrill.js grades the tone off the SPELLING — writing
// `zos` for `zoo` is reported as a Low-vs-Mid tone error by name — and it runs
// on 917 words today with no recording at all. Step 3 is that drill until
// clips exist.
//
// TO RE-ARM AUDIO: add `&& r.needAudio === 0` to `ready` below. `withAudio` and
// `needAudio` are still measured and reported precisely so that day is a
// one-line change rather than an archaeology exercise.
const AUDIO_COUNTS_TOWARD_READY = false

/**
 * What one unit's content can support.
 *
 * @returns {{
 *   unit, words, withExample, withAudio, needExample, needAudio,
 *   sentenceReady: boolean, audioReady: boolean, ready: boolean, pct: number
 * }}
 */
export function unitReadiness(unit) {
  const words = unitWords(unit)
  const withExample = words.filter((w) => w.exampleSentence?.hmong).length
  const withAudio = words.filter((w) => w.audioFile).length
  const needExample = words.length - withExample
  const needAudio = words.length - withAudio

  // ⚠️ AN EMPTY UNIT IS NOT A READY UNIT. Without this, a unit whose category
  // ids were all typos would report 0 words, 0 missing, and pass as ready —
  // the failure mode is a unit that ships teaching nothing.
  const sentenceReady = words.length > 0 && needExample === 0
  const audioReady = words.length > 0 && needAudio === 0

  return {
    unit,
    words,
    withExample,
    withAudio,
    needExample,
    needAudio,
    sentenceReady,
    audioReady,
    ready: sentenceReady && (AUDIO_COUNTS_TOWARD_READY ? audioReady : true),
    pct: words.length ? Math.round((100 * withExample) / words.length) : 0,
  }
}

/** Readiness for every unit, in teaching order. */
export function pathReadiness() {
  return orderedPath().map(unitReadiness)
}

/**
 * The units a learner can actually be shown — ready ones, in TEACHING order.
 *
 * "Ship in readiness order, present in teaching order" is this function. As of
 * 2026-09-20 it returns two units (Numbers and Classifiers); the learner sees
 * them as units 3 and 5 of a visible ten, not as a two-unit app.
 *
 * ⚠️ THE PATH GROWS AS SENTENCES ARE WRITTEN, which means a unit can appear
 * BETWEEN two a learner has already finished. That is safe only because
 * unlocking is positional over this list and progress keys on `unitId`: a newly
 * inserted unit is simply an unlocked unit they have not done, never a reset.
 */
export function livePath() {
  return pathReadiness().filter((r) => r.ready).map((r) => r.unit)
}

/**
 * Is this unit open?
 *
 * ⚠️ POSITIONAL, NOT COUNTED — the same model lib/access.js already uses for
 * guest limits, and for the same reason recorded there: nothing is stored,
 * nothing is spent, and revisiting a finished unit is always free.
 *
 * The first live unit is always open. After that a unit opens when the one
 * before it in `livePath()` is complete.
 */
export function isUnitUnlocked(unitId, completedUnitIds = []) {
  const live = livePath()
  const i = live.findIndex((u) => u.id === unitId)
  if (i < 0) return false        // not ready yet — not in the path at all
  if (i === 0) return true
  return completedUnitIds.includes(live[i - 1].id)
}

/** The unit to put on a "Continue" card: the first live unit not yet done. */
export function nextUnit(completedUnitIds = []) {
  return livePath().find((u) => !completedUnitIds.includes(u.id)) || null
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE IS NOT — so the next person does not go looking.
//
// · There is no Home tab, no unit screen and no five-step player. Those are
//   designed in the note and not built. This file is what they would read.
// · Nothing here gates the Reference tab, the reader or the sentence builder,
//   and nothing should. Reference stays fully open on all 77 categories —
//   "it is what makes the reader usable and the app's most honest asset".
// · `free` is declared but enforced nowhere yet. Wiring it belongs with
//   PaywallGate, next to the existing lesson/phrase tiers in lib/access.js.
// · Progress is not stored here. When the unit screen exists it writes
//   completed unit ids into ProgressContext; every function above takes that
//   list as an argument instead, so this file stays pure data + derivations.
// ─────────────────────────────────────────────────────────────────────────────
