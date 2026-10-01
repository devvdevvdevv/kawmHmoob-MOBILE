import { useCallback, useEffect, useState } from 'react'
import { loadJSON, saveJSON } from './storage.js'

// STUDY + QUIZ PREFERENCES — how a quiz asks, and how a study deck is ordered.
//
// (The file is named quizPrefs because that is where it started; it now also
// holds the flashcard deck order, which is the same kind of thing: a durable
// choice about how practice behaves, made once and remembered.)
//
// ── Why one stored object rather than a key per setting ──────────────────────
// Every consumer wants several of these at once, and each key would be its own
// async read with its own `ready` flag to race. One object = one read, one
// ready, one write. The cost is that an unknown key from an older build has to
// be tolerated on load, which `normalize()` below does anyway.
//
// ── Why device-local and not the synced progress row ─────────────────────────
// These are study preferences, not progress. They do not belong in the row that
// carries XP and the SRS schedule, and losing them on reinstall costs nothing.
const KEY = 'kawmhmoob.quiz.prefs'

// ── Direction ───────────────────────────────────────────────────────────────
export const HMONG_TO_ENGLISH = 'hmong-english'
export const ENGLISH_TO_HMONG = 'english-hmong'

export const DIRECTION_OPTIONS = [
  { value: HMONG_TO_ENGLISH, label: 'Hmong → English' },
  { value: ENGLISH_TO_HMONG, label: 'English → Hmong' },
]

// ── How many questions ──────────────────────────────────────────────────────
// 'all' is the default and the historical behaviour: every quiz asks everything
// it has (see the comment above `quizzes` in src/data/quizzes.js — a 31-word
// category used to be sampled at 10, so two thirds never came up). The shorter
// options exist because "every item" is the right default, not the right
// answer for someone with five minutes.
export const COUNT_OPTIONS = [
  { value: 'all', label: 'Everything in the set' },
  { value: 10, label: '10 questions' },
  { value: 20, label: '20 questions' },
  { value: 30, label: '30 questions' },
]

// ── Question type ───────────────────────────────────────────────────────────
// The engine has always supported both; `matching` was simply never switched on
// (every quiz def lists `['multiple-choice']`). This preference is the switch.
//
// 'quiz-default' means "whatever the quiz itself declares in questionTypes",
// which keeps a quiz free to specify a mix without this setting overriding it.
export const TYPE_OPTIONS = [
  { value: 'quiz-default', label: "The quiz's own mix" },
  { value: 'multiple-choice', label: 'Multiple choice only' },
  { value: 'matching', label: 'Matching only' },
]

// ── Which words to include ──────────────────────────────────────────────────
// Filters a VOCAB quiz by what you've marked each word (vocabProgress). Other
// quizzes have no per-item status, so they ignore this — see applyStatusFilter.
export const FILTER_OPTIONS = [
  { value: 'all', label: 'All words' },
  { value: 'learning', label: 'Only Learning' },
  { value: 'known', label: 'Only Known' },
  { value: 'new', label: 'Only untouched' },
]

// ── Flashcard deck order (study mode) ───────────────────────────────────────
// Chronological is the default because a category is AUTHORED in an order —
// related words sit together, and simple ones come first. Shuffling is what you
// want on the second pass, once order itself has become a memory crutch: people
// learn the sequence rather than the words.
export const ORDER_OPTIONS = [
  { value: 'chronological', label: 'Category order' },
  { value: 'random', label: 'Shuffled' },
]

export const DEFAULT_PREFS = {
  direction: HMONG_TO_ENGLISH,
  questionCount: 'all',
  questionType: 'quiz-default',
  statusFilter: 'all',
  cardOrder: 'chronological',
}

const ALLOWED = {
  direction: DIRECTION_OPTIONS,
  questionCount: COUNT_OPTIONS,
  questionType: TYPE_OPTIONS,
  statusFilter: FILTER_OPTIONS,
  cardOrder: ORDER_OPTIONS,
}

/**
 * Drop anything that isn't a value we currently offer.
 *
 * A stored blob outlives the build that wrote it: an option removed in a later
 * version would otherwise come back as a value nothing knows how to render, and
 * the setting would look stuck. Unknown keys fall back to the default silently.
 */
function normalize(stored) {
  const out = { ...DEFAULT_PREFS }
  if (!stored || typeof stored !== 'object') return out
  for (const [key, options] of Object.entries(ALLOWED)) {
    if (options.some((o) => o.value === stored[key])) out[key] = stored[key]
  }
  return out
}

/**
 * Read/write the stored study + quiz preferences.
 *
 * `ready` is not optional for callers that build something from these. The read
 * is async; a quiz that builds its questions before the preferences arrive
 * would silently use the defaults, and the settings would appear to do nothing
 * on the first quiz after launch.
 */
export function useQuizPrefs() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadJSON(KEY, null).then((stored) => {
      if (!active) return
      setPrefs(normalize(stored))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  const setPref = useCallback((key, value) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value }
      saveJSON(KEY, next).catch((e) => console.warn('[quiz] could not save prefs', e))
      return next
    })
  }, [])

  return { prefs, setPref, ready }
}

// ── Pure helpers, so the rules live next to the options that describe them ──

/**
 * Reduce a dataset to the words matching a status filter.
 *
 * `statusOf` maps an item to 'new' | 'learning' | 'known'; a quiz whose items
 * have no status passes null and the dataset comes back untouched.
 *
 * ⚠️ Refuses to return an EMPTY set. Filtering to "only Known" before you have
 * marked anything known would otherwise produce a quiz with no questions, which
 * reads as a broken screen rather than as an empty filter. Falling back to the
 * full set keeps the quiz playable; the settings sheet says what happened.
 */
export function applyStatusFilter(dataset, filter, statusOf) {
  if (filter === 'all' || !statusOf) return { dataset, fellBack: false }
  const filtered = dataset.filter((item) => statusOf(item) === filter)
  if (filtered.length === 0) return { dataset, fellBack: true }
  return { dataset: filtered, fellBack: false }
}

/** How many questions to ask, given the preference and what's available. */
export function resolveCount(preference, available) {
  if (preference === 'all' || typeof preference !== 'number') return available
  return Math.min(preference, available)
}
