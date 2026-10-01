import { categories, categoryGroups, PATH_ONLY_CATEGORIES } from '../data/vocabulary.js'
import { getUnit, unitExampleWords, isPhraseEntry } from '../data/path.js'
// ⚠️ UNREVIEWED PLACEHOLDERS — see the header of that file for why they live
// apart from vocabulary. To remove the whole batch: delete this import and the
// loop that reads it in allSentenceExercises().
import { grammarSentences } from '../data/grammarSentences.js'
import { PATH_SENTENCES } from '../data/pathSentences.js'  // 2026-09-28 — per-unit extras, see pathUnitExercises
import { isCategoryFree } from './vocabAccess.js'

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
//
// ⚠️ SINCE 2026-09-25 THIS IS THE FREE TASTE, NOT THE SESSION. The author's
// ruling: 5 is too short to count as finishing anything. Pro learners (and
// anyone inside a FREE path unit) get FULL_SESSION_LENGTH instead, and only a
// full session completes a path unit's Sentences step. Free learners keep 5,
// keep spending the daily quota, and meet the paywall on the results screen.
// See app/words/sentences/[groupId].jsx.
export const SESSION_LENGTH = 5

// A "complete" session: the group's whole set, capped. 20 matches
// UNIT_WORD_CAP in path.js, so a path unit's session covers every sentence the
// unit has; the cap only bites on the big theme groups and Mixed (900+), where
// "all of them" would be an afternoon, not a session.
// ⚠️ 10 SINCE 2026-09-27 — the author: "for the sentence builder there is going to be
// 10 sentences to build". Was 20. Path units now use it too (they were fixed at 5).
// A group with fewer than 10 plays all it has.
export const FULL_SESSION_LENGTH = 10

// ⚠️ THE FAIL RULE — 2026-09-26 (author: "if they fail more than two it's a
// fail"). One try per sentence; the THIRD wrong sentence ends the session as a
// fail. A failed session never completes a path unit's Sentences step. Applies
// to every session (taste, full, path, grammar drills).
export const MAX_MISSES = 2

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
const KEEP_WHOLE_CATEGORIES = new Set(['months', 'days-of-week', 'dates', 'calendar'])
const KEEP_WHOLE = new Set(['conjunction', 'complementizer', 'quantifier', 'locative', 'negation', 'question', 'adjective', 'siab-expression', 'grammar', 'particle', 'aspect', 'tense', 'adverb', 'greeting', 'politeness', 'courtesy', 'farewell', 'introduction', 'demonstrative', 'interjection', 'color'])

function buildPhraseIndex() {
  // firstWord → phrases starting with it, longest first so "vim hais tias" beats
  // a hypothetical "vim hais".
  const byFirst = new Map()
  for (const cat of categories) {
    for (const w of cat.words) {
      // ⚠️ A CONSTRUCTION IS NOT ONE WORD — 2026-09-26. The tau set's cards
      // ("tau noj", "noj tau", "tau nyiaj"…) are PATTERNS, tagged 'construction'.
      // Indexed here they became single chips in every sentence in the app —
      // "Kuv tau noj mov" drilled as [Kuv] [tau noj] [mov] — so the learner never
      // placed tau, which is the one thing the tau unit teaches. They still
      // exist for lookup (a tap on tau in "tau noj" shows the pattern).
      if ((w.tags || []).includes('construction')) continue
      const parts = (w.hmongRPA || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
      if (parts.length < 2) continue
      // ⚠️ TAU IS ALWAYS ITS OWN CHIP — 2026-09-26 (author: "make it harder,
      // separate all taus, do not combine the taus, so for example tsis tau").
      // `tsis tau` (Not & Don't) was still a dictionary phrase, so "Kuv noj tsis
      // tau" drilled as [Kuv] [noj] [tsis tau]. Where tau goes IS the lesson —
      // tsis tau + verb (not yet) vs verb + tsis tau (can't) — so no chip may
      // carry it. Any multi-word entry containing tau is skipped here.
      if (parts.includes('tau')) continue
      // ⚠️ VERBS AND NOUNS ARE BROKEN INTO WORDS — 2026-09-28 (author: "for sentence builder make
      // it so that in action verbs / nouns everything is broken, so tsev kawm ntawv for example, is
      // not one word"). Only GRAMMAR stays one chip: joining words (vim hais tias), quantifiers
      // (ib co), location words (hauv qab), negation (tsis txhob), question words, describing and
      // feeling words (siab ntev), time markers (tab tom), adverbs, set courtesy phrases. Decided by
      // tag, because noun/verb tagging is inconsistent (kawm ntawv is tagged 'phrase', body parts
      // 'anatomy'): anything without a KEEP_WHOLE tag is split.
      // Month and day NAMES (lub ib hlis ntuj, hnub ib) and date labels (hnub tim) stay whole: each
      // names one thing, like "January", and split they pushed Writing Dates past MAX_TOKENS.
      if (!(w.tags || []).some((t) => KEEP_WHOLE.has(t)) && !KEEP_WHOLE_CATEGORIES.has(w.category)) continue
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
// ⚠️ A PHRASE NEVER CROSSES PUNCTUATION — 2026-09-28 (author: "the app is confusing nag los
// with los yog"). "Nag los, yog li …" stripped its comma and then matched the dictionary's
// "los yog" (or) across it: one chip [los yog] from two different clauses. `breaks[j]` is
// true when raw word j ended in punctuation; a phrase may not run past such a word.
function phraseLengthAt(raw, i, breaks = []) {
  if (!phrases) phrases = buildPhraseIndex()
  const candidates = phrases.get(raw[i].toLowerCase())
  if (!candidates) return 0
  for (const parts of candidates) {
    if (i + parts.length > raw.length) continue
    let hit = true
    for (let k = 0; k < parts.length; k++) {
      if (raw[i + k].toLowerCase() !== parts[k]) { hit = false; break }
      if (k < parts.length - 1 && breaks[i + k]) { hit = false; break }
    }
    if (hit) return parts.length
  }
  return 0
}

export function tokenizeSentence(hmong) {
  // Was: const raw = hmong.trim().split(/\s+/).map(stripPunctuation).filter(Boolean)
  const words = hmong.trim().split(/\s+/)
    .map((w) => ({ text: stripPunctuation(w), brk: /[.,!?;:]["')\]]*$/.test(w) }))
    .filter((w) => w.text)
  const raw = words.map((w) => w.text)
  const breaks = words.map((w) => w.brk)
  const out = []
  for (let i = 0; i < raw.length; ) {
    // OVERLAP — 2026-09-28: in "nag los yog li" both [los yog] (or) and [yog li] (in that case)
    // match, and taking the first left a stray [li]. When this phrase's LAST word also starts a
    // phrase that runs further, the later phrase wins and this word stands alone.
    let len = phraseLengthAt(raw, i, breaks)
    if (len > 1 && !breaks[i + len - 2] && phraseLengthAt(raw, i + len - 1, breaks) > 1) len = 1
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

// ⚠️ MASTER SWITCH — AI-written example sentences in the builder.
//
// Sentences tagged `exampleSentence.source === 'ai'` are LLM output that no
// speaker has checked yet. They appear everywhere else (flashcards, the reader),
// but the builder is the one place a mistake gets DRILLED: it scrambles the
// sentence into chips and marks the learner right only for reproducing it.
// That already happened once with a human sentence — `animals-tiger` shipped
// "Txhob tsis…" with the particles reversed, and the builder taught that order.
//
// To review one: check it, then delete its `source: 'ai'`. To let all of them in
// regardless, flip this to true. This is the ONE line to change.
export const INCLUDE_UNREVIEWED_AI = false

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
      // AI-written and not yet checked by a speaker — see the switch below.
      if (ex.source === 'ai' && !INCLUDE_UNREVIEWED_AI) continue
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
    // Added 2026-09-26 with path unit u-tau — "sentence builder with all tau".
    // gp-aspect mixes tau with lawm; this one is every tau sentence, all senses.
    id: 'gp-tau',
    title: 'Tau — Did, Got & Can',
    blurb: 'Tau before the verb, after it, before a noun — every sentence with tau.',
    any: ['tau'],
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
    blurb: 'Hnub no, tagkis, thaum — placing it in time.',
    any: ['hnub', 'tagkis', 'tag kis', 'naghmo', 'nag hmo', 'nim no', 'thaum', 'xyoo', 'hli', 'teev', 'sij hawm'],
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
// ── PATH UNITS — `path-<unitId>` ────────────────────────────────────────────
// A beginner-path unit drills its OWN words (src/data/path.js), not a theme.
//
// ⚠️ PHRASES COUNT AS EXERCISES HERE. "koj puas nyob zoo?" has no example
// sentence and never will — the author's ruling is that a phrase is its own
// example — so the Greetings unit would have no sentence step at all without
// this. The phrase itself becomes the scramble, exactly as long as it has
// enough words to be one.
//
// Unreviewed AI sentences stay out, as everywhere in the builder: this goes
// through allSentenceExercises(), which applies INCLUDE_UNREVIEWED_AI.
function pathUnitExercises(unitId) {
  const unit = getUnit(unitId)
  if (!unit) return []
  // unitExampleWords (2026-09-26): a pattern unit (u-tau) drills its real-word
  // examples, not its "tau + verb" cards. Was: unitWords(unit)
  const words = unitExampleWords(unit)
  const ids = new Set(words.map((w) => w.id))
  const out = allSentenceExercises().filter((ex) => ids.has(ex.id))
  const seen = new Set(out.map((ex) => ex.hmong.trim().toLowerCase()))

  // ⚠️ SHARED SENTENCES — 2026-09-26. allSentenceExercises() dedupes by sentence
  // text, and the FIRST entry in data order claims it. A unit whose words reuse a
  // sentence another entry owns lost it: u-negation's "Tsis txhob mus ze tus tsov
  // ntawd." is claimed by animals-tiger, so the filter above never saw it and the
  // unit fell short of a session. So a unit's own words' HUMAN examples are added
  // here directly when the dedupe hid them — same range and AI rules as above.
  for (const w of words) {
    const ex = w.exampleSentence
    if (!ex?.hmong || !ex?.english) continue
    if (ex.source === 'ai' && !INCLUDE_UNREVIEWED_AI) continue
    const key = ex.hmong.trim().toLowerCase()
    if (seen.has(key)) continue
    const tokens = tokenizeSentence(ex.hmong)
    if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
    seen.add(key)
    out.push({
      id: w.id,
      hmong: ex.hmong,
      english: ex.english,
      tokens,
      word: w.hmongRPA,
      categoryTitle: categories.find((c) => c.id === w.category)?.title || unit.title,
      categoryId: w.category,
    })
  }
  for (const w of words) {
    if (w.exampleSentence?.hmong || !isPhraseEntry(w)) continue
    const tokens = tokenizeSentence(w.hmongRPA)
    if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
    const key = w.hmongRPA.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      id: w.id,
      hmong: w.hmongRPA,
      english: w.english,
      tokens,
      word: w.hmongRPA,
      categoryTitle: categories.find((c) => c.id === w.category)?.title || unit.title,
      categoryId: w.category,
    })
  }

  // ── TOP-UP TO A FULL SESSION — the author's ruling, 2026-09-25 ─────────────
  // "We need at least 5 sentences in each sentence builder." Four live units
  // could not reach SESSION_LENGTH on human-written sentences alone — You & Me
  // 4, Time & Days 3, Daily Life 1, Questions 0 — because their words' examples
  // are AI-drafted and INCLUDE_UNREVIEWED_AI keeps those out.
  //
  // So a path unit that is SHORT is topped up from its OWN words' AI examples,
  // only as many as it takes to reach SESSION_LENGTH, and never past it. Human
  // sentences always come first, and a unit that already has 5 gets none.
  //
  // ⚠️ SCOPED TO PATH UNITS ON PURPOSE. The open theme/grammar drills keep the
  // human-only rule: a short one there is simply hidden, which costs nothing. A
  // short path unit loses its Sentences step, which is the thing being fixed.
  // Each topped-up exercise carries `unreviewed: true`; reviewing its sentence
  // (deleting `source: 'ai'`) turns it into an ordinary exercise.
  //
  // ⚠️ `moreExamples` — 2026-09-25. An optional array of extra sentences on a
  // vocabulary entry, for words whose ONE exampleSentence is a human-written
  // fragment too short to drill ("Ib co dej." — 2 chips). The importer never
  // overwrites an exampleSentence, and it shouldn't: the fragment is a good
  // flashcard example. So longer sentences go here instead. They are read ONLY
  // by this top-up — flashcards, the reader and the open drills ignore them —
  // and they are all `source: 'ai'` until a speaker checks them. First user:
  // the quantifiers (u-quantity), from _incoming/sentences-batch-10-quantifiers.json.
  // sentencesMustInclude (2026-09-28) applied BEFORE the top-up, so the top-up fills a
  // filtered unit with sentences that pass the filter too, not ones removed afterwards.
  const must = unit.sentencesMustInclude
  if (must) for (let k = out.length - 1; k >= 0; k--) if (!sentenceHasWord(out[k].tokens, must)) out.splice(k, 1)
  // Was: SESSION_LENGTH (5). Raised to FULL_SESSION_LENGTH, 2026-09-28 (author: at least 7
  // sentences per unit) — a unit's unreviewed card sentences can now fill a full session.
  if (out.length < FULL_SESSION_LENGTH) {
    for (const w of words) {
      if (out.length >= FULL_SESSION_LENGTH) break
      // Was: the loop read only w.exampleSentence (when source === 'ai').
      const candidates = [
        ...(w.exampleSentence?.source === 'ai' ? [w.exampleSentence] : []),
        ...(Array.isArray(w.moreExamples) ? w.moreExamples : []),
      ]
      for (const ex of candidates) {
        if (out.length >= FULL_SESSION_LENGTH) break
        if (!ex?.hmong || !ex?.english) continue
        const tokens = tokenizeSentence(ex.hmong)
        if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
        if (must && !sentenceHasWord(tokens, must)) continue
        const key = ex.hmong.trim().toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        out.push({
          id: w.id,
          hmong: ex.hmong,
          english: ex.english,
          tokens,
          word: w.hmongRPA,
          categoryTitle: categories.find((c) => c.id === w.category)?.title || unit.title,
          categoryId: w.category,
          unreviewed: true,
        })
      }
    }
  }

  // ⚠️ PATH SENTENCES — 2026-09-28 (author: "every thing has at least 7 moderately difficult
  // sentences in the path"). Written for each unit (data/pathSentences.js), reviewed against the
  // author's rules, all unreviewed by a speaker. They come AFTER the unit's own sentences and
  // fill it up to a full session; the same length, duplicate and must-include rules apply.
  const extra = PATH_SENTENCES[unitId] || []
  for (let k = 0; k < extra.length && out.length < FULL_SESSION_LENGTH; k++) {
    const ps = extra[k]
    const tokens = tokenizeSentence(ps.hmong)
    if (tokens.length < MIN_TOKENS || tokens.length > MAX_TOKENS) continue
    if (must && !sentenceHasWord(tokens, must)) continue
    const key = ps.hmong.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({
      id: `ps-${unitId}-${k}`,
      hmong: ps.hmong,
      english: ps.english,
      tokens,
      word: ps.word,
      categoryTitle: unit.title,
      categoryId: null,
      unreviewed: true,
    })
  }
  return out
}

//
// ⚠️ `freeOnly` — PRO SETS, 2026-09-25. For a free learner every group is cut
// down to sentences whose word sits in a FREE set (lib/vocabAccess.js), so the
// builder can't be a way round the vocabulary lock. The grammar placeholder
// sentences belong to no set, so they drop out too. Path groups ignore it: a
// path unit has its own `free` flag and its own rules.
//
// ⚠️ GRAMMAR DRILLS ARE ALWAYS FREE, WHOLE — same day, the author: "we need the
// fundamentals to always be free". A grammar drill (gp-*) teaches a PATTERN —
// yog, negation, questions, commands — and it was being cut below a session by
// the vocabulary lock, because its sentences come from topic sets. So `freeOnly`
// only narrows the Mixed pool and the TOPIC groups; the "By grammar" tab is free
// with every sentence. Was: the filter applied to every non-path group.
// ⚠️ sentencesMustInclude — 2026-09-28 (author: the Yog unit's builder must "only have words with
// yog in it"). A path unit may name words its every sentence must contain as a CHIP WORD
// ("yog" matches the chips yog, yog li, los yog, puas yog…, never a substring like yog in
// yuav). Anything else its cards carry (muaj for age) still teaches, but is not drilled here.
export function sentenceHasWord(tokens, words) {
  return tokens.some((t) => t.toLowerCase().split(' ').some((w) => words.includes(w)))
}

export function exercisesInGroup(groupId, { freeOnly = false } = {}) {
  if (String(groupId || '').startsWith('path-')) {
    const unitId = groupId.slice('path-'.length)
    const must = getUnit(unitId)?.sentencesMustInclude
    const all = pathUnitExercises(unitId)
    return must ? all.filter((ex) => sentenceHasWord(ex.tokens, must)) : all
  }
  const list = groupExercises(groupId)
  if (isGrammarGroup(groupId)) return list
  return freeOnly ? list.filter((ex) => isCategoryFree(ex.categoryId)) : list
}

// Was the whole body of exercisesInGroup before `freeOnly` (2026-09-25).
function groupExercises(groupId) {
  // Path-only sets (Common Nouns) stay in their path unit — never the mixed or grammar drills.
  // 2026-09-28. Was: const all = allSentenceExercises()
  const all = allSentenceExercises().filter((ex) => !PATH_ONLY_CATEGORIES.has(ex.categoryId))
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

/**
 * A FUNDAMENTALS drill — free with no strings (2026-09-25, "the fundamentals
 * always free"): every grammar drill, and any topic group made ONLY of free
 * sets (today: grammar-words, everyday). The session screen gives these a full
 * session, no See Pro, and no daily allowance, exactly like a free path unit.
 */
//
// ⚠️ OFF — 2026-09-28 (author: "ensure paywall is on the sentences too, with the daily limits intact").
// Grammar drills and all-free groups were unlimited for everyone. Now nothing outside the four free
// path units is exempt: a free learner gets the taste (SESSION_LENGTH), the daily allowance and
// See Pro, like every other group. TO RESTORE: return the old body (kept below).
//   if (isGrammarGroup(groupId)) return true
//   const g = categoryGroups.find((x) => x.id === groupId)
//   return Boolean(g && g.items.length && g.items.every((c) => isCategoryFree(c.id)))
export function isFundamentalsGroup(groupId) {
  void groupId
  return false
}

/**
 * Can this learner drill this group? Pro: always. A path group: the path's own
 * rules decide (unitStatus / quota). Free, anywhere else: only if the FREE
 * sentences in it can fill a session — the same "never loop inside a session"
 * rule sentenceGroups() applies. Otherwise the group is Pro.
 */
export function groupOpenFor(groupId, isPro) {
  if (isPro || String(groupId || '').startsWith('path-')) return true
  return exercisesInGroup(groupId, { freeOnly: true }).length >= SESSION_LENGTH
}

export function sentenceGroupTitle(groupId) {
  if (!groupId || groupId === MIXED) return 'Mixed practice'
  if (String(groupId).startsWith('path-')) return getUnit(groupId.slice('path-'.length))?.title || 'Sentence builder'
  if (isGrammarGroup(groupId)) {
    return GRAMMAR_PATTERNS.find((p) => p.id === groupId)?.title || 'Sentence builder'
  }
  return categoryGroups.find((g) => g.id === groupId)?.title || 'Sentence builder'
}

// One session's worth. `tokens` carry an index-based id because 9 sentences
// repeat a word ("Cov Luav ntawd ntxuas ntxiv peb cov qoob loo!") — chips must be
// distinct objects or removing one would remove its twin.
// `opts` passes through to exercisesInGroup — `{ freeOnly }` for a free learner (2026-09-25).
// ⚠️ DECOYS — 2026-09-28 (author: the So, Then & Therefore builder must be "difficult so users
// struggle"). For the groups below, every sentence also gets the OTHER words of its set as
// extra chips that do not belong, so the learner has to read the context to choose. A word
// already in the sentence is never a decoy, and neither is its interchangeable twin (thiaj /
// thiaj li), which would be a right answer marked wrong. Only the chips change: the answer,
// isSentenceCorrect and wordAccuracy all still read `tokens`. The screen stops placing chips
// once every slot is full, so a decoy can only ever take a real word's place.
// yog li ntawd added 2026-09-28 — the fuller yog li, so the two are twins.
const SO_THEN_WORDS = ['yog li', 'yog li ntawd', 'thiaj li', 'thiaj', 'ces', 'txawm']
const DECOY_TWINS = { thiaj: 'thiaj li', 'thiaj li': 'thiaj', 'yog li': 'yog li ntawd', 'yog li ntawd': 'yog li' }
export const DECOY_WORDS = { 'path-u-so-then': SO_THEN_WORDS, 'so-then': SO_THEN_WORDS }
export function decoysFor(tokens, groupId) {
  const pool = DECOY_WORDS[groupId]
  if (!pool) return []
  const have = new Set(tokens.map((t) => t.toLowerCase()))
  return pool.filter((w) => !have.has(w) && !have.has(DECOY_TWINS[w]))
}

export function buildSentenceSession(count = SESSION_LENGTH, groupId = MIXED, opts = {}) {
  return shuffle(exercisesInGroup(groupId, opts))
    .slice(0, count)
    .map((ex) => {
      const decoys = decoysFor(ex.tokens, groupId)
      return {
        ...ex,
        hasDecoys: decoys.length > 0,
        // Was: chips: shuffle(ex.tokens.map((text, i) => ({ id: `${ex.id}-${i}`, text }))),
        chips: shuffle([
          ...ex.tokens.map((text, i) => ({ id: `${ex.id}-${i}`, text })),
          ...decoys.map((text, i) => ({ id: `${ex.id}-decoy-${i}`, text })),
        ]),
      }
    })
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
