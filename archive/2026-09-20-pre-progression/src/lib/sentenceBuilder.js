import { categories, categoryGroups } from '../data/vocabulary.js'
// ⚠️ UNREVIEWED PLACEHOLDERS — see the header of that file for why they live
// apart from vocabulary. To remove the whole batch: delete this import and the
// loop that reads it in allSentenceExercises().
import { grammarSentences } from '../data/grammarSentences.js'

// SENTENCE BUILDER exercises, derived from the vocabulary — no new content file.
//
// 306 of the 523 words already carry an `exampleSentence` ({ hmong, english }),
// written by the same hand that wrote the words. Reusing them means the builder
// only ever asks about sentences the app has already taught, and it grows on its
// own every time a word gets an example.
//
// The exercise: show the English, hand back the Hmong words shuffled, rebuild the
// sentence.

// Sentences shorter than 3 words rebuild themselves; past 9 the tray wraps into a
// wall of chips on a phone and it stops being a language exercise. 243 of the 306
// land in this window.
export const MIN_TOKENS = 3
export const MAX_TOKENS = 9

// Default sentences per session. Short on purpose — this is a drill, not a test.
export const SESSION_LENGTH = 5

// Punctuation is scaffolding for the reader, not part of the word order, so it's
// stripped from the chips: nobody should have to place a comma to be told they
// built the sentence correctly. The unstripped sentence is kept for the answer
// reveal.
function stripPunctuation(token) {
  return token.replace(/^[¿¡"'([]+|[.,!?;:"')\]]+$/g, '')
}

// MULTI-WORD ENTRIES ARE ONE WORD. Splitting on spaces is wrong for Hmong:
// "vim hais tias" (because) is a single conjunction the vocabulary lists as ONE
// entry, and the "siab" (liver) expressions — "siab zoo" kind, "siab ntev"
// patient — are single adjectives. Handing a learner three chips reading "vim",
// "hais", "tias" teaches them to think of it as three words, which is the
// opposite of what this drill is for.
//
// 272 of the 523 vocabulary entries are multi-word, so this is the common case,
// not an edge case. The phrase list IS the vocabulary — nothing is hardcoded here.
let phrases = null

function buildPhraseIndex() {
  // firstWord → phrases starting with it, longest first so "vim hais tias" beats
  // a hypothetical "vim hais".
  const byFirst = new Map()
  for (const cat of categories) {
    for (const w of cat.words) {
      const parts = (w.hmongRPA || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
      if (parts.length < 2) continue
      const key = parts[0]
      if (!byFirst.has(key)) byFirst.set(key, [])
      const list = byFirst.get(key)
      if (!list.some((p) => p.join(' ') === parts.join(' '))) list.push(parts)
    }
  }
  for (const list of byFirst.values()) list.sort((a, b) => b.length - a.length)
  return byFirst
}

// How many words of `raw` starting at `i` form a known phrase (0 if none).
function phraseLengthAt(raw, i) {
  if (!phrases) phrases = buildPhraseIndex()
  const candidates = phrases.get(raw[i].toLowerCase())
  if (!candidates) return 0
  for (const parts of candidates) {
    if (i + parts.length > raw.length) continue
    let hit = true
    for (let k = 0; k < parts.length; k++) {
      if (raw[i + k].toLowerCase() !== parts[k]) { hit = false; break }
    }
    if (hit) return parts.length
  }
  return 0
}

export function tokenizeSentence(hmong) {
  const raw = hmong.trim().split(/\s+/).map(stripPunctuation).filter(Boolean)
  const out = []
  for (let i = 0; i < raw.length; ) {
    const len = phraseLengthAt(raw, i)
    if (len > 1) {
      out.push(raw.slice(i, i + len).join(' ')) // one chip, e.g. "vim hais tias"
      i += len
    } else {
      out.push(raw[i])
      i += 1
    }
  }
  return out
}

export function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Every usable exercise in the app, in data order.
//
// Deduped by sentence: 13 sentences are attached to more than one entry — the
// male- and female-perspective family lists share "Kuv leej txiv." and a dozen
// like it — and drawing the same sentence twice in one five-question session
// would look broken. First entry to claim a sentence keeps it.
export function allSentenceExercises() {
  const out = []
  const seen = new Set()
  for (const cat of categories) {
    for (const word of cat.words) {
      const ex = word.exampleSentence
      if (!ex?.hmong || !ex?.english) continue
      const key = ex.hmong.trim().toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      const tokens = tokenizeSentence(ex.hmong)
      if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
      out.push({
        id: word.id,
        hmong: ex.hmong,
        english: ex.english,
        tokens,
        // What the sentence was teaching — shown as a hint chip, and the reason
        // the exercise exists at all.
        word: word.hmongRPA,
        categoryTitle: cat.title,
        categoryId: cat.id,
      })
    }
  }

  // ── Then the placeholder grammar sentences ───────────────────────────────
  // AFTER the vocabulary loop on purpose, and sharing its `seen` set: if a
  // speaker-written example and a placeholder are the same sentence, the real
  // one is kept and the placeholder silently drops out.
  //
  // `categoryId` matches no vocabulary category, so these never land in a
  // topic group — only in Mixed practice and the grammar drills, which is the
  // job they were written for.
  for (const s of grammarSentences) {
    const key = s.hmong.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const tokens = tokenizeSentence(s.hmong)
    if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
    out.push({
      id: s.id,
      hmong: s.hmong,
      english: s.english,
      tokens,
      word: s.word,
      categoryTitle: 'Grammar practice (unreviewed)',
      categoryId: 'grammar-placeholder',
      placeholder: true,
    })
  }
  return out
}

// ── GROUPS ──────────────────────────────────────────────────────────────────
//
// The builder was one undifferentiated pile: shuffle everything, take 5. That is
// a fine dojo and it stays, but it cannot answer "drill me on classifiers".
//
// Groups are DERIVED from the vocabulary theme groups, not hand-written here,
// so a group appears the moment its words gain example sentences and disappears
// when they do not. No list to keep in sync.
//
// ⚠️ A group is only offered when it can fill a whole session. Fewer than
// SESSION_LENGTH exercises means the same sentences repeat inside one sitting,
// which reads as a bug. Hiding it is more honest than shipping a card that
// immediately loops.
export const MIXED = 'mixed'

export function sentenceGroups() {
  const byCategory = {}
  for (const g of categoryGroups) for (const c of g.items) byCategory[c.id] = g

  const counts = new Map()
  for (const ex of allSentenceExercises()) {
    const g = byCategory[ex.categoryId]
    if (!g) continue
    const entry = counts.get(g.id) || { id: g.id, title: g.title, blurb: g.blurb, count: 0 }
    entry.count++
    counts.set(g.id, entry)
  }

  return [...counts.values()]
    .filter((g) => g.count >= SESSION_LENGTH)
    .sort((a, b) => b.count - a.count)
}

// ── GRAMMAR DRILLS — the second axis ────────────────────────────────────────
//
// The groups above answer "drill me on food words". They cannot answer "drill me
// on negation", because they bucket by the vocabulary THEME a sentence came
// from, and a theme is not a grammar point.
//
// ⚠️ THE KEY REALISATION: a grammar drill needs NO new content. Whether a
// sentence demonstrates negation is readable from the sentence ITSELF — it
// contains "tsis". Same for "puas" (yes/no), "yog", a classifier, an aspect
// marker. So these groups are derived from the text, exactly the way the theme
// groups are derived from the category, and they cost nothing to add.
//
// This answers the judgement question left open in
// notes/2026-08-29-sentence-builder-groups-and-surface.md ("would a second axis
// be better — theme AND type? What would it cost in data that does not exist
// yet?"). Measured answer: eight patterns clear the threshold on today's data,
// and the cost is zero new sentences.
//
// ⚠️ IDS ARE PREFIXED `gp-` AND THAT IS NOT DECORATION. The theme groups
// already include one called `grammar-words`, so the obvious name for a grammar
// group is taken — and a bare id colliding across two group KINDS is the exact
// bug recorded for consonantGroups/vowelGroups in reference.js, where both use
// 'single'/'double' and lookups land silently in the wrong section. One
// namespace per kind keeps that impossible.
//
// ⚠️ A PATTERN IS A HINT, NOT A PARSE. Matching on words is shallow: it finds
// sentences that CONTAIN the marker, which is what a drill needs, but it cannot
// tell you the sentence is *about* that grammar. `not` exists for the cases
// where the shallow read is outright wrong — see `gp-yesno`.
const GRAMMAR_PATTERNS = [
  {
    id: 'gp-classifiers',
    title: 'Classifiers',
    blurb: 'Tus, lub, cov — the word that has to come before the noun.',
    // ⚠️ 'ib' IS NOT A CLASSIFIER — it is the number one. It was in this list
    // briefly and inflated the count by ~23; it lives in gp-numbers now. The
    // two co-occur constantly ("ib tus neeg"), which is exactly why the mistake
    // is easy and why the drill would have taught the wrong label.
    any: ['tus', 'lub', 'cov', 'daim', 'txoj', 'rab', 'lub'],
  },
  {
    id: 'gp-pronouns',
    title: 'Pronouns',
    blurb: 'Kuv, koj, nws — and the dual forms English has no word for.',
    any: ['kuv', 'koj', 'nws', 'peb', 'nej', 'lawv', 'wb', 'neb'],
  },
  {
    id: 'gp-direction',
    title: 'Coming and Going',
    blurb: 'Mus, tuaj, los — direction is part of the verb in Hmong.',
    any: ['mus', 'tuaj', 'los'],
  },
  {
    id: 'gp-location',
    title: 'Where Things Are',
    blurb: 'Nyob, hauv, ntawm — saying where, without "to be".',
    any: ['nyob', 'hauv', 'ntawm', 'saum'],
  },
  {
    id: 'gp-aspect',
    title: 'Finished, and Not Yet',
    blurb: 'Lawm and tau — Hmong marks whether it is done, not when.',
    any: ['lawm', 'tau'],
  },
  {
    id: 'gp-yog',
    title: 'Yog — To Be',
    blurb: 'The word that links two nouns, and never precedes an adjective.',
    any: ['yog'],
  },
  {
    id: 'gp-wanting',
    title: 'Wanting and Will',
    blurb: 'Xav and yuav — intending, wanting, and what happens next.',
    any: ['xav', 'yuav'],
  },
  {
    id: 'gp-negation',
    title: 'Negation',
    blurb: 'Tsis — saying something is not so.',
    any: ['tsis'],
    // Commands belong to gp-commands, not here. "Tsis txhob mus" is not a
    // statement being negated, it is an order being given — drilling the two
    // together would blur exactly the distinction each drill exists to teach.
    //
    // Enforced by COMPOUNDS (which consumes `tsis txhob`), NOT by a
    // `not: ['tsis txhob']` here. That list was the first fix, and it rejected
    // any sentence containing a command even when it also held a plain `tsis`.
  },
  {
    id: 'gp-numbers',
    title: 'Numbers and Counting',
    blurb: 'Ib, ob, plaub — and the classifier that has to follow.',
    // ⚠️ NO `peb`, AND IT IS NOT AN OVERSIGHT. `peb` is both "three" and the
    // pronoun "we" — a true homograph, not a compound, so COMPOUNDS cannot
    // separate them. In real sentences the pronoun wins by a wide margin
    // ("Peb puas mus tag kis?" is "are WE going"), so matching it here filed
    // pronoun sentences under numbers. `peb` still reaches gp-pronouns, where
    // it is almost always right.
    //
    // ⚠️ NO `rau` EITHER — same homograph problem: "six", but far more often
    // "to, for". It was briefly kept here on the claim that no sentence showed
    // it misfiring; checking found "Kuv muab rau koj." (I give it TO you) filed
    // under numbers. Removed on the evidence, not the assumption.
    any: ['ib', 'ob', 'plaub', 'tsib', 'xya', 'yim', 'cuaj', 'kaum', 'pes tsawg'],
  },
  {
    id: 'gp-family',
    title: 'Family and Whose It Is',
    blurb: 'Niam, txiv, kwv tij — the nouns possession is used with most.',
    any: [
      'niam', 'txiv', 'tub', 'ntxhais', 'kwv', 'tij', 'muam', 'pog', 'yawg',
      'phauj', 'dab laug', 'nus', 'tsev neeg', 'niam tais', 'yawm txiv', 'tij laug',
    ],
  },
  {
    id: 'gp-time',
    title: 'When It Happens',
    blurb: 'Hnub no, tag kis, thaum — placing it in time.',
    any: ['hnub', 'tag kis', 'tagkis', 'nag hmo', 'nim no', 'thaum', 'xyoo', 'hli', 'teev', 'sij hawm'],
  },
  // ── Below the threshold on today's data, and deliberately still listed ──
  // sentenceGroups() hides anything under SESSION_LENGTH, so these cost nothing
  // now and appear ON THEIR OWN the moment enough example sentences exist —
  // the same "derived, never hand-listed" contract the theme groups have. They
  // are the honest record of which grammar drills the CONTENT cannot yet
  // support, which is a content to-do, not a code one.
  {
    id: 'gp-yesno',
    title: 'Yes/No Questions',
    blurb: 'Puas — turning a statement into a question.',
    any: ['puas'],
    // ⚠️ "ib puas" is ONE HUNDRED, not the question particle. Without handling
    // the drill would teach "Ib puas tus neeg." (a hundred people) as a yes/no
    // question. Handled by COMPOUNDS, which consumes `ib puas` — no longer a
    // `not` list here, which would have thrown out "Koj puas xav tau ib puas?"
    // (do you want a hundred?) despite its real question particle.
  },
  {
    id: 'gp-questions',
    title: 'Question Words',
    blurb: 'Who, what, where, when — and where they sit in the sentence.',
    any: ['dab tsi', 'leej twg', 'qhov twg', 'thaum twg', 'ua cas', 'vim li cas', 'pes tsawg', 'li cas'],
  },
  {
    id: 'gp-commands',
    title: 'Do Not',
    blurb: 'Tsis txhob — a command, not a statement.',
    // ⚠️ THE PHRASE ONLY, NEVER BARE `txhob`. Two separate reasons, both found
    // the hard way on 2026-09-16:
    //
    //   1. The order is fixed: it is ALWAYS `tsis txhob`, never `txhob tsis`.
    //      Matching the bare particle would have let a reversed sentence into
    //      the drill as if it were correct — and there WAS one in the
    //      vocabulary ("Txhob tsis mus ze tus tsov ntawd"), now corrected.
    //   2. `txhob txwm` is a DIFFERENT WORD — "intentional, deliberate". It
    //      appears all over the Zong Vang story ("kev tua neeg txhob txwm",
    //      first-degree intentional homicide) and has nothing to do with
    //      negative commands. Bare `txhob` would drag every one of those in.
    any: ['tsis txhob'],
  },
  {
    id: 'gp-connectors',
    title: 'Joining Clauses',
    blurb: 'Thiab, tab sis, vim hais tias — two ideas in one sentence.',
    any: ['thiab', 'tab sis', 'vim hais tias', 'los sis', 'yog tias'],
  },
  {
    id: 'gp-particles',
    title: 'Discourse Particles',
    blurb: 'Os, mas, nav — the small words that carry tone.',
    // ⚠️ ONE matching sentence today, and the hardest of these to grow: a
    // particle is near-impossible to gloss from a dictionary, so the example
    // sentences that would fill this drill need a speaker to write. The word
    // list here is a first guess and wants checking too.
    any: ['os', 'mas', 'nav', 'lauj', 'tiag', 'nawb', 'maj'],
  },
]

// ── COMPOUNDS: words that are also PARTS of other words ─────────────────────
//
// ⚠️ THE STRUCTURAL FIX, after the same bug was hand-patched three times.
// Hmong builds function words out of other words, so a whole-word match can
// still land on the wrong word:
//
//   los sis       "or"                 — not `los`, "to come"      (direction)
//   yog tias      "if"                 — not `yog`, "to be"        (yog)
//   ib puas       "one hundred"        — not `puas`, the question  (yes/no)
//   tsis txhob    "do not" (a command) — not plain negation `tsis` (negation)
//   txhob txwm    "intentional"        — not a command at all      (commands)
//   tab sis       "but"
//   vim hais tias "because"
//
// Each was first fixed with a per-pattern `not: [...]` list, and that has a
// real defect: `not` rejects the WHOLE sentence. "Kuv tsis mus, tsis txhob
// hais" contains a genuine plain `tsis` and would have been thrown out of the
// negation drill for also containing a command.
//
// So a compound CONSUMES its words instead: single-word terms are checked
// against what is left once every compound is taken out, while phrase terms
// still see the full sentence. `los sis` stops counting as "come" without
// hiding anything else in the sentence, and the connectors pattern still finds
// `los sis` itself. Found by reading the matches line by line against real
// sentences — see notes/2026-09-16-sentence-builder-grammar-axis.md.
//
// Add to this list, not to a pattern's `not`, when the next one turns up.
const COMPOUNDS = [
  'vim hais tias', // longest first — see the greedy loop below
  'los sis',
  'yog tias',
  'ib puas',
  'tsis txhob',
  'txhob txwm',
  'tab sis',
].map((c) => c.split(' '))

/** True when the sentence shows this pattern. Whole words only — never substrings. */
function matchesPattern(hmong, pattern) {
  const w = String(hmong).toLowerCase().split(/[\s—–]+/)
    .map((x) => x.replace(/^[^\p{L}]+/u, '').replace(/[^\p{L}]+$/u, ''))
    .filter(Boolean)
  const joined = ` ${w.join(' ')} `

  // Every word NOT inside a compound. Greedy and longest-first, so
  // "vim hais tias" is taken whole before any shorter compound could split it.
  const loose = []
  for (let i = 0; i < w.length; ) {
    const c = COMPOUNDS.find((parts) => parts.every((p, k) => w[i + k] === p))
    if (c) i += c.length
    else loose.push(w[i++])
  }

  // A phrase is checked against the joined string (padded, so it still matches
  // only on word boundaries); a single word against the LOOSE words. `.includes`
  // on the RAW sentence would match inside other words — the same trap
  // wordLookup documents for its tier-2 phrase search.
  const present = (t) => (t.includes(' ') ? joined.includes(` ${t} `) : loose.includes(t))
  if (pattern.not && pattern.not.some(present)) return false
  return pattern.any.some(present)
}

export function isGrammarGroup(groupId) {
  return typeof groupId === 'string' && groupId.startsWith('gp-')
}

/**
 * The grammar drills worth offering, largest first.
 *
 * ⚠️ Same >= SESSION_LENGTH rule as the theme groups, for the same reason: a
 * group that cannot fill one sitting repeats sentences inside it, which reads
 * as a bug rather than as a short drill.
 */
export function grammarGroups() {
  const all = allSentenceExercises()
  return GRAMMAR_PATTERNS
    .map((p) => ({
      id: p.id,
      title: p.title,
      blurb: p.blurb,
      count: all.filter((ex) => matchesPattern(ex.hmong, p)).length,
    }))
    .filter((g) => g.count >= SESSION_LENGTH)
    .sort((a, b) => b.count - a.count)
}

/** Exercises in one group — theme, grammar pattern, or everything for the dojo. */
export function exercisesInGroup(groupId) {
  const all = allSentenceExercises()
  if (!groupId || groupId === MIXED) return all

  if (isGrammarGroup(groupId)) {
    const pattern = GRAMMAR_PATTERNS.find((p) => p.id === groupId)
    if (!pattern) return []
    return all.filter((ex) => matchesPattern(ex.hmong, pattern))
  }

  const inGroup = new Set()
  for (const g of categoryGroups) {
    if (g.id !== groupId) continue
    for (const c of g.items) inGroup.add(c.id)
  }
  return all.filter((ex) => inGroup.has(ex.categoryId))
}

export function sentenceGroupTitle(groupId) {
  if (!groupId || groupId === MIXED) return 'Mixed practice'
  if (isGrammarGroup(groupId)) {
    return GRAMMAR_PATTERNS.find((p) => p.id === groupId)?.title || 'Sentence builder'
  }
  return categoryGroups.find((g) => g.id === groupId)?.title || 'Sentence builder'
}

// One session's worth. `tokens` carry an index-based id because 9 sentences
// repeat a word ("Cov Luav ntawd ntxuas ntxiv peb cov qoob loo!") — chips must be
// distinct objects or removing one would remove its twin.
export function buildSentenceSession(count = SESSION_LENGTH, groupId = MIXED) {
  return shuffle(exercisesInGroup(groupId))
    .slice(0, count)
    .map((ex) => ({
      ...ex,
      chips: shuffle(ex.tokens.map((text, i) => ({ id: `${ex.id}-${i}`, text }))),
    }))
}

// Compare as a STRING, not chip-by-chip: when a sentence repeats a word, putting
// the two identical chips in the other order still reads correctly, and marking
// that wrong would be a bug the learner can't see.
export function isSentenceCorrect(placed, exercise) {
  const built = placed.map((c) => c.text).join(' ').toLowerCase()
  return built === exercise.tokens.join(' ').toLowerCase()
}

// ── Scoring ─────────────────────────────────────────────────────────────────
//
// How many PLACED CHIPS land in their correct slot, independent of whether the
// whole sentence is right. This is partial credit: a learner who gets 4 of 5
// words home still sees that, instead of a flat "wrong" that erases the
// difference between "one word swapped" and "totally scrambled".
//
// ⚠️ Position-based, not value-based. `isSentenceCorrect` compares the built
// STRING because a repeated word in the other valid slot still reads correctly
// — but that same swap means each chip's own slot doesn't match, so counting
// this would call a fully correct sentence "wrong per-word". This function
// only feeds the aggregate stat and the "N of M words" hint, never the actual
// pass/fail, so that mismatch never surfaces as a contradiction on screen.
//
// Only called once Check is enabled, which requires every slot filled — so
// `placed.length` always equals `exercise.tokens.length` here.
export function wordAccuracy(placed, exercise) {
  const total = exercise.tokens.length
  let correct = 0
  for (let i = 0; i < total; i++) {
    if ((placed[i]?.text || '').toLowerCase() === exercise.tokens[i].toLowerCase()) correct++
  }
  return { correct, total }
}

// Points for ONE correctly built sentence. Harder builds are worth more — a
// 9-chip sentence finished correctly isn't scored the same as a 3-chip warm-up
// — so the reward tracks the actual difficulty of what was just done.
//
// MIN_TOKENS (the easiest sentence in the pool) earns POINTS_BASE; every chip
// past that adds POINTS_PER_EXTRA_TOKEN.
const POINTS_BASE = 10
const POINTS_PER_EXTRA_TOKEN = 2
export function pointsForExercise(exercise) {
  const extra = Math.max(0, exercise.tokens.length - MIN_TOKENS)
  return POINTS_BASE + extra * POINTS_PER_EXTRA_TOKEN
}

// Clean-sweep bonus, awarded once at the end of a session where every sentence
// was built correctly. Roughly double a single sentence's base reward — the
// same ratio `lib/leveling.js` uses between `quiz-complete` (5) and
// `quiz-perfect` (10) — so "perfect" reads as a real bonus, not a rounding
// error.
//
// ⚠️ SESSION-SCOPED, LIKE `score`. Points here are not written to the global
// XP economy in `ProgressContext` — see notes/2026-08-29-sentence-builder-
// barebones.md ("Deliberately not in v1: no XP or progress writes"). This
// keeps that same boundary: a fun, honest session score, not a second XP
// pipeline running alongside the app's real one.
export const PERFECT_BONUS = 20
