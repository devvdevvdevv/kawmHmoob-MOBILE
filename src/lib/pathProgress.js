// PATH PROGRESS — where a learner is in the beginner path, derived.
//
// src/data/path.js says what the course IS (units, order, readiness). This file
// says where one learner stands in it. It stores nothing of its own:
//
//   flashcards  done when every word in the unit has a vocabProgress status —
//               the same status Flashcard.jsx already writes. Studying those
//               words anywhere in the app counts; there is no second record.
//   quiz        done when the unit's quiz (`path-<unitId>`) scored PASS_MARK+.
//               QuizEngine already records every score.
//   tone        done when a typing-drill session is finished for the unit.
//   sentences   done when a sentence-builder session is finished for the unit.
//   reading     done when the unit's mini-reading is read to the end.
//
// The last three write a step id through ProgressContext.markStepComplete, which
// already persists (guest storage or Supabase), awards XP and keeps the streak.
//
// ⚠️ COMPLETION IS DERIVED, AND SO IS UNLOCKING. A unit counts as complete when
// all of its AVAILABLE steps are done — computed from the data above every time,
// never from a stored flag that could disagree with it. The XP reward for
// finishing a unit is recorded separately (markLessonComplete on `path:<id>`),
// and only as a reward: nothing reads it back to decide what is unlocked.
//
// ⚠️ A STEP WITHOUT CONTENT IS SKIPPED, NOT BLOCKING. The sentence builder only
// uses human-written sentences (INCLUDE_UNREVIEWED_AI in lib/sentenceBuilder.js),
// so a unit whose sentences are mostly AI-written may not have enough to run
// that step yet. It shows as "not ready", and the unit completes without it — a
// unit with four working steps is a unit; a unit with a dead step is a bug report.

import { livePath, isUnitUnlocked, getUnit, unitWords, unitExampleWords, isPhraseEntry } from '../data/path.js'
import { exercisesInGroup, SESSION_LENGTH } from './sentenceBuilder.js'
import { typingExercisesFor } from './typingDrill.js'
import { bestScoresByQuiz } from './quizProgress.js'

/** A quiz is passed at this accuracy, in percent. */
export const PASS_MARK = 70

const ALL_STEPS = [
  { key: 'flashcards', title: 'Flashcards', icon: 'layers', blurb: 'Meet every word, both directions.' },
  { key: 'quiz', title: 'Quiz', icon: 'zap', blurb: `Score ${PASS_MARK}% or more.` },
  // ⚠️ OUT OF THE PATH ENTIRELY — 2026-09-23. See TONE_STEP_ENABLED below.
  { key: 'tone', title: 'Tones', icon: 'music', blurb: 'Spell each word — the tone is in the last letter.' },
  { key: 'sentences', title: 'Sentences', icon: 'layers', blurb: 'Put the words in order.' },
  { key: 'reading', title: 'Reading', icon: 'bookOpen', blurb: 'The unit’s words, in running text.' },
]

// ⚠️ THE TONES STEP IS OUT OF THE PATH FOR EVERYONE — 2026-09-23, because the
// typing drill behind it is unfinished. Nothing was deleted: the step is still
// in ALL_STEPS above, its availability is still computed, its completion is
// still read and written, and `/words/typing` is untouched — the standalone
// drill at /words is a different door and still open to everyone.
//
// ⚠️ IT WAS DEV-ONLY FIRST, AND THAT WAS NOT ENOUGH. The first version read
// `typeof __DEV__ === 'undefined' ? true : __DEV__`, which hid the step from
// release builds but left it in `expo start` — where the course is actually
// being walked, so it still looked like a required fifth step. Now it is off
// unconditionally: nobody, dev included, is asked to do it.
//
// ⚠️ FILTERING THE EXPORTED LIST IS THE WHOLE CHANGE, and it is deliberate:
// every consumer derives from STEPS, so one filter hides the row on the unit
// screen (app/path/[unitId]/index.jsx), drops the pip (PathList.jsx), takes it
// out of what "complete" requires (isUnitComplete) and stops Continue pointing
// at it (continueTarget). Hiding it in the UI alone would have left every unit
// permanently incomplete — the step would be required but unreachable.
//
// ⚠️ RESTORING IT RE-LOCKS UNITS FOR EXISTING LEARNERS. Completion is derived,
// so a learner who finished a unit on four steps while this was off becomes
// incomplete again the moment Tones counts — and because unlocking reads
// completed units, the unit AFTER it re-locks too. Their XP reward is not taken
// back (markLessonComplete is idempotent and nothing reads it back), but the
// path visibly moves backwards. If that is unacceptable when the drill is
// finished, restore it for NEW units only, or accept the reset knowingly.
//
// TO RESTORE: flip this to `true` (or delete the constant and the filter, and
// export ALL_STEPS as STEPS). Nothing else in the file changes.
//
// The dev-only version, kept because it is the right shape for showing the step
// to yourself again once the drill is worth walking through:
// export const TONE_STEP_ENABLED = typeof __DEV__ === 'undefined' ? true : __DEV__
export const TONE_STEP_ENABLED = false

export const STEPS = ALL_STEPS.filter((s) => s.key !== 'tone' || TONE_STEP_ENABLED)

// ── Ids ─────────────────────────────────────────────────────────────────────
// All stable, all derived from the unit id. Changing any of these strands saved
// progress — the same rule path.js states for the unit ids themselves.
export const pathQuizId = (unitId) => `path-${unitId}`
export const pathGroupId = (unitId) => `path-${unitId}`
export const stepId = (unitId, step) => `path:${unitId}:${step}`
export const unitLessonId = (unitId) => `path:${unitId}`

/** The unit a `path-<unitId>` quiz or sentence-group id belongs to, or null. */
export function unitFromPathId(id) {
  const s = String(id || '')
  return s.startsWith('path-') ? getUnit(s.slice('path-'.length)) : null
}

// ── What each step has to work with ────────────────────────────────────────

/** The unit's usable reading lines: example sentences, plus phrases as lines. */
export function readingLines(unit) {
  const seen = new Set()
  const lines = []
  // unitExampleWords (2026-09-26): a pattern unit (u-tau) reads its real-word examples.
  // Was: unitWords(unit)
  for (const w of unitExampleWords(unit)) {
    const ex = w.exampleSentence
    // A phrase with no sentence of its own IS the line — the author's ruling
    // that a phrase is its own example (see isPhraseEntry in data/path.js).
    const line = ex?.hmong
      ? { id: w.id, hmong: ex.hmong, english: ex.english, ai: ex.source === 'ai' }
      : isPhraseEntry(w)
        ? { id: w.id, hmong: w.hmongRPA, english: w.english, ai: false }
        : null
    if (!line) continue
    const key = line.hmong.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    lines.push(line)
  }
  // Human-written first: if the reading is ever capped, it keeps those.
  return lines.sort((a, b) => Number(a.ai) - Number(b.ai))
}

/**
 * Which steps this unit's content can run. `false` = skipped, not blocking.
 *
 * Minimums are set where the drill stops making sense: a four-option quiz needs
 * four words; a "session" of one sentence or one reading line is not practice.
 */
export function stepAvailability(unit) {
  // ⚠️ CACHED PER UNIT, because it is expensive and cannot change while the app
  // runs. The sentences check tokenises every example sentence in the app, and
  // unitStatus() asks for every unit's completion — which asks for every unit's
  // availability — so uncached, one render of the path did that work ~100 times.
  // The content is bundled data: a new sentence only arrives with a new build.
  if (availabilityCache.has(unit.id)) return availabilityCache.get(unit.id)
  const words = unitWords(unit)
  const avail = {
    flashcards: words.length > 0,
    quiz: words.length >= 4,
    tone: typingExercisesFor(words.map((w) => w.id)).length >= 3,
    // Was >= 3. At least a full session now (author, 2026-09-25) — the path's
    // sentence list tops itself up to SESSION_LENGTH, see pathUnitExercises.
    sentences: exercisesInGroup(pathGroupId(unit.id)).length >= SESSION_LENGTH,
    reading: readingLines(unit).length >= 3,
  }
  availabilityCache.set(unit.id, avail)
  return avail
}
const availabilityCache = new Map()

// ── What this learner has done ─────────────────────────────────────────────

/**
 * @param unit
 * @param progress  the ProgressContext value (vocabProgress, quizScores, completedSteps)
 */
export function stepsDone(unit, progress) {
  const words = unitWords(unit)
  const vocab = progress?.vocabProgress || {}
  const steps = progress?.completedSteps || []
  const best = bestScoresByQuiz(progress?.quizScores || [])[pathQuizId(unit.id)]
  return {
    flashcards: words.length > 0 && words.every((w) => vocab[w.id]),
    quiz: best != null && best >= PASS_MARK,
    tone: steps.includes(stepId(unit.id, 'tone')),
    sentences: steps.includes(stepId(unit.id, 'sentences')),
    reading: steps.includes(stepId(unit.id, 'reading')),
  }
}

/** Studied words / total, for the flashcard step's progress line. */
export function flashcardCount(unit, progress) {
  const words = unitWords(unit)
  const vocab = progress?.vocabProgress || {}
  return { studied: words.filter((w) => vocab[w.id]).length, total: words.length }
}

/** All AVAILABLE steps done. A unit with no available steps is never complete. */
export function isUnitComplete(unit, progress) {
  const avail = stepAvailability(unit)
  const done = stepsDone(unit, progress)
  const required = STEPS.map((s) => s.key).filter((k) => avail[k])
  return required.length > 0 && required.every((k) => done[k])
}

/** Ids of every live unit this learner has completed — derived, never stored. */
export function completedUnitIds(progress) {
  return livePath().filter((u) => isUnitComplete(u, progress)).map((u) => u.id)
}

/**
 * One unit's state, in the order a learner meets the walls:
 *
 *   'complete'   every available step done
 *   'locked'     the unit before it is not complete yet
 *   'pro'        reachable, but past the free units and this learner is not Pro
 *   'available'  open — go
 *
 * ⚠️ 'locked' BEATS 'pro'. A free learner sees unit 3 as locked-by-progress
 * until they finish unit 2, and only THEN as needing Pro. Showing a price on a
 * unit they cannot reach yet is asking for money before the free units have
 * made their case.
 */
//
// `hasPro` is useSubscription().isPro — already true for everyone when
// MONETIZATION_ENABLED is off, so the path follows the app's one paywall switch.
// A plain boolean rather than canAccess() from SubscriptionContext.jsx so this
// file stays importable by plain-Node check scripts (a .jsx import is not).
//
// ⚠️ `{ admin }` — 2026-09-25, the author: "admin has access to the paths at all
// times (for debugging)". An admin (lib/admin.js isAdmin) sees every unit as
// 'available': no progress lock, no Pro wall. Completion is still REAL — a
// finished unit still reads 'complete' — so an admin testing a unit sees the
// same ticks a learner would. Optional and defaulting to false, so every
// existing caller and the plain-Node check scripts are unchanged.
// ⚠️ UI ACCESS, NOT SECURITY — the admin list ships in the bundle (see admin.js).
// It opens screens; it grants no data.
export function unitStatus(unit, progress, hasPro, { admin = false } = {}) {
  if (isUnitComplete(unit, progress)) return 'complete'
  if (admin) return 'available'
  if (!isUnitUnlocked(unit.id, completedUnitIds(progress))) return 'locked'
  if (!unit.free && !hasPro) return 'pro'
  return 'available'
}

/** May this learner open this unit's steps? (Complete units stay open.) */
export function canEnterUnit(unit, progress, hasPro, { admin = false } = {}) {
  if (admin) return true
  const s = unitStatus(unit, progress, hasPro)
  if (s === 'complete') return Boolean(unit.free || hasPro)
  return s === 'available'
}

/**
 * What the unit's status WOULD be for a non-admin — so the unit screen can say
 * "normally locked / Pro" while an admin is walking past the gate.
 */
export function lockedForLearner(unit, progress, hasPro) {
  const s = unitStatus(unit, progress, hasPro)
  return s === 'locked' || s === 'pro' ? s : null
}

/**
 * The "Continue" target: the first live unit not yet complete, and its first
 * available step not yet done. Null when the whole live path is complete.
 */
export function continueTarget(progress, hasPro, opts = {}) {
  for (const unit of livePath()) {
    // `opts.admin` passes through — see unitStatus. (2026-09-25)
    const status = unitStatus(unit, progress, hasPro, opts)
    if (status === 'complete') continue
    const avail = stepAvailability(unit)
    const done = stepsDone(unit, progress)
    const step = STEPS.find((s) => avail[s.key] && !done[s.key]) || null
    return { unit, status, step }
  }
  return null
}

/** Where a step lives. Quiz and drills reuse the app's own screens. */
export function stepHref(unitId, step) {
  switch (step) {
    case 'flashcards': return `/path/${unitId}/flashcards`
    case 'quiz': return `/quiz/${pathQuizId(unitId)}`
    case 'tone': return `/words/typing?unit=${unitId}`
    case 'sentences': return `/words/sentences/${pathGroupId(unitId)}`
    case 'reading': return `/path/${unitId}/reading`
    default: return `/path/${unitId}`
  }
}
