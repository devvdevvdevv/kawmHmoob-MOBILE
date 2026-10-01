// Import each Lesson from its own file. Each of these files exports ONE Lesson
// — not a Unit. The Unit is composed below.
import { pronouns } from './lessons/pronouns'
import { singularConsonants } from './lessons/singular-consonants'
import { dualConsonants } from './lessons/dual-consonants'
import { tripleConsonants } from './lessons/triple-consonants'
import { quadrupleConsonants } from './lessons/quadruple-consonants'
import { hmongWordStructure } from './lessons/hmong-word-structure'
import { SingleVowels } from './lessons/vowels'
import { DoubleVowels } from './lessons/double-vowels'
import { Tones } from './lessons/tones'
import { sibReciprocals } from './lessons/sib-reciprocals'
import { greetingsFarewells } from './lessons/greetings-farewells'
import { actionVerbs } from './lessons/action-verbs'
import { nounClassifiers } from './lessons/noun-classifiers'
import { pronounsDemonstratives } from './lessons/pronouns-demonstratives'
import { possessivePronouns } from './lessons/possessive-pronouns'
import { yogToBe } from './lessons/yog-to-be'
import { huUa } from './lessons/hu-ua'
import { quantifiers } from './lessons/quantifiers'
import { adjectives } from './lessons/adjectives'
import { describingPeople } from './lessons/describing-people'
import { conjunctions } from './lessons/conjunctions'
// ⚠️ WRITING UNIT — ALL PLACEHOLDERS, scaffolded 2026-09-16. Structure only, no
// teaching content in any of them; each file's header says what it should cover
// and whether it overlaps a lesson that already exists. See the unit below.
import { writingSentenceOrder } from './lessons/writing-sentence-order'
import { writingPronouns } from './lessons/writing-pronouns'
import { writingTsisTxhob } from './lessons/writing-tsis-txhob'
import { writingYesNoQuestions } from './lessons/writing-yes-no-questions'
import { writingQuestionWords } from './lessons/writing-question-words'
import { writingNegation } from './lessons/writing-negation'
import { writingPossessionFamily } from './lessons/writing-possession-family'
import { writingVerbPatterns } from './lessons/writing-verb-patterns'
import { writingTimeAspect } from './lessons/writing-time-aspect'
import { writingConnectors } from './lessons/writing-connectors'
import { writingDiscourseParticles } from './lessons/writing-discourse-particles'
import { questionWords } from './lessons/question-words'
import { questionsYesNo } from './lessons/questions-yes-no'
import { questionsWhich } from './lessons/questions-which'
// Conversational starters migrated from the retired /course "Everyday" tab.
import { politeness } from './lessons/politeness'
import { introductions } from './lessons/introductions'
import { dailyLife } from './lessons/daily-life'
import { tenseMarkers } from './lessons/tense-markers'
import { tsisNegation } from './lessons/tsis-negation'
import { tauLesson } from './lessons/tau'
import { numbers } from './lessons/numbers'
import { howMuch } from './lessons/how-much'
import { time } from './lessons/time'
import { timeExplained } from './lessons/time-explained'
import { calendar } from './lessons/calendar'
import { dates } from './lessons/dates'
import { rau } from './lessons/rau'
import { answering } from './lessons/answering'
import { dayFrames } from './lessons/day-frames'
import { sentenceStructure } from './lessons/sentence-structure'
import { nounPurpose } from './lessons/noun-purpose'
import { nyob } from './lessons/nyob'
import { soThen } from './lessons/so-then'
import { wearing } from './lessons/wearing'
import { body } from './lessons/body'
import { locationPlaceholder, particlesPlaceholder, familyPlaceholder, foodPlaceholder, siabPlaceholder, commonNounsPlaceholder } from './lessons/placeholders'
// ⚠️ THE LEARN MODULE'S READINGS ARE RETIRED — 2026-09-13. Commented out, not
// deleted; the three lesson files are untouched on disk.
//
// WHY: the reading MODULE (app/reading/, src/data/stories.js) replaced them.
// That has a library, per-word lookup, a glossary sheet, a comprehension quiz
// and a bookmark; these were three prose steps inside a Learn unit, from before
// any of it existed. Two reading experiences is one more than the app wants.
//
// They were already invisible: app/(tabs)/learn.jsx filtered the unit out of
// release builds and app/learn/[unitId]/index.jsx redirected the route, both
// behind __DEV__. This removes the thing rather than continuing to hide it.
//
// TO RESTORE: uncomment these three imports, the `readings` unit below, and its
// entry in `units`. The lesson files never went anywhere.
// import { readingMim } from './lessons/reading-mim'
// import { readingGarden } from './lessons/reading-garden'
// import { readingSchool } from './lessons/reading-school'
// import {vowels} from './lessons/vowels'

// Structured lesson model: Units → Lessons → Steps.
//
// A Unit is a chapter (e.g. "Foundations"). It contains many Lessons.
// A Lesson is one learnable thing (e.g. "Pronouns"). It contains many Steps.
// A Step is one screen the user sees (intro, examples, quiz, reading…).
//
// Step kinds:
//   - 'intro'      { title, body: string[] }
//   - 'examples'   { title, intro?, items: [{ hmong, english, note?, audio? }] }
//                  (consonant lessons use { hmong, hmongExample, englishSound }
//                   instead; the renderer falls through — see notes/28)
//                  When the lesson has `vocab`, this step also shows the "Study
//                  the words" button that unlocks the quiz step.
//   - 'quiz'       { title? }  — requires `vocab` on the lesson. The lesson's
//                  final step: the vocab-<vocab> quiz, LOCKED until the learner
//                  has studied (study → then test). See notes/37.
//   - 'letters'    { title, intro?, items: [{ letter, sound?, audio? }] }
//                  The letter tile grid — renders the SAME <LetterGrid> the
//                  Reference page uses. For consonants/vowels. See notes/47.
//   - 'tones'      { title, intro?, items: [{ marker, name, description, example2, audio }] }
//                  The tone rows — the SAME <ToneRows> as Reference. See notes/47.
//                  (Do NOT push letters/tones through 'examples' — that layout
//                   is for word lists and mangles them.)
//   - 'reading'    { title, level, intro?, hmong, english, glossary: [{hmong, english}] }
//                  Translation stays hidden until the learner asks — see notes/34.
//   - 'practice'   { title, prompt, options: string[], answer }
//                  Only readings still use this (comprehension check). Vocab
//                  lessons' old quick-checks are commented out — see notes/37.
//   - 'mini-quiz'  { title, quizId }  — links out to an existing quiz.
//   - 'speak-drill' { title, familyId, blurb? }
//                  Hands off to a Speak word-family drill (/speak/family/:id).
//                  The alphabet lessons end on this instead of a mini-quiz —
//                  you can't prove you can SAY a consonant by clicking a
//                  multiple-choice option. See notes/50.
//
// Optional `tier: 'free' | 'pro'` on a Unit or Lesson gates content behind the
// paywall. Lesson tier overrides unit tier. Both default to 'free'.
//
// Optional `reference: '<tab>'` on a Lesson links it to its cheat sheet in the
// Reference section (e.g. 'grammar'). The lesson player renders a "Cheat sheet"
// link; the table links back with "Learn this". Two doors, same knowledge —
// see notes/34.
//
// Optional `vocab: '<categoryId>'` on a Lesson names the vocabulary category it
// teaches (an id from src/data/vocabulary.js). It drives the study→quiz flow:
// the examples step gets a "Study the words" button (→ the word bank), and the
// final `quiz` step stays locked until the learner studies. The lesson explains;
// Words drills; the quiz tests. Don't re-list the words inside the lesson —
// that's the redundancy this removes. See notes/37.
//
// IDs must be globally unique across the app — they're used as progress keys.
//
// ──────────────────────────────────────────────────────────────────────────
// To add a new lesson:
//   1. Create src/data/lessons/<slug>.js exporting one Lesson object.
//   2. Import it at the top of this file.
//   3. Add it to the unit's `lessons` array below.
// ──────────────────────────────────────────────────────────────────────────

// UNIT LAYOUT — see notes/46.
//
// FOUNDATIONS = the alphabet. A Hmong word is consonant + vowel + tone, so
// Foundations teaches that formula and then each of its three pieces. That's
// what a beginner needs before anything else, and it's the unit's whole job.
//
// Everything that is NOT alphabet work lives in its own unit — grammar first.
// That's what keeps Foundations from becoming the dumping ground it was (it
// held all 14 lessons, grammar included).
//
// Order inside Foundations follows the formula: structure → consonants →
// vowels → tones. Tones sits last because it's the hardest and builds on the
// other two; expect it to grow several contrast lessons.

// A unit may declare `groups` instead of a flat `lessons` array. Groups are a
// DISPLAY concept — headed sections inside one unit — so a long unit reads as
// a curriculum instead of a wall of cards. `lessons` is derived from them (see
// withLessons below), so progress, routing, and the Learn hub are unchanged.
const foundations = {
  id: 'foundations',
  title: 'Foundations',
  description:
    'Start here. How a Hmong word is built — consonant + vowel + tone — and each piece in turn.',
  groups: [
    {
      id: 'word-structure',
      title: 'How Hmong Words Work',
      blurb: 'The formula everything else builds on.',
      lessons: [hmongWordStructure],
    },
    {
      id: 'consonants',
      title: 'Consonants',
      blurb: 'Cov tsiaj ntawv — the sound a word starts with.',
      lessons: [singularConsonants, dualConsonants, tripleConsonants, quadrupleConsonants],
    },
    {
      id: 'vowels',
      title: 'Vowels',
      blurb: 'Cov tab — the middle of the syllable.',
      lessons: [SingleVowels, DoubleVowels],
    },
    {
      id: 'tones',
      title: 'Tones',
      blurb: 'Cov cim — the pitch that changes meaning. The hardest piece.',
      lessons: [
        Tones,
        // Add contrast lessons here: high vs high-falling, the breathy -g,
        // the creaky -m, minimal-pair drills. One idea per lesson.
      ],
    },
  ],
}

// The Grammar unit — how words COMBINE. Not alphabet work, so not Foundations.
//
// ⚠️ GROUPED 2026-09-16, was a flat array of ten. Ten unlabelled cards is the
// "wall of cards" `groups` was added to Foundations to fix (see the comment
// above it) — and grammar had the worse version of the problem, because the
// three PRONOUN lessons sat at positions 1, 6 and 7 with unrelated material
// between them. Nothing about the data shape changed: withLessons() still
// derives the flat `lessons` array below, so routing, progress keys and the
// Learn hub are untouched. The unit screen already renders `groups` when a unit
// declares them — no UI work was needed.
//
// The ORDER inside is a dependency chain, not a filing system:
//   who you are talking about → what they are doing → naming and describing
//   them → joining it into longer sentences.
const grammarUnit = {
  id: 'grammar',
  title: 'Grammar',
  description: 'Pronouns, verbs, tense markers, and classifiers — how Hmong sentences hold together.',
  groups: [
    {
      id: 'people-and-pointing',
      title: 'Who You Are Talking About',
      blurb: 'Pronouns, pointing words, and whose thing it is.',
      // These three were scattered across the old flat list. They are one
      // subject and belong together.
      lessons: [pronouns, pronounsDemonstratives, possessivePronouns],
    },
    {
      id: 'actions-and-time',
      title: 'Actions and Time',
      blurb: 'What happens, and when it happened.',
      // tsisNegation added 2026-09-26: negation sits in the same pre-verb slot as
      // the tense markers, so it follows them. Was: [actionVerbs, tenseMarkers]
      // tauLesson added 2026-09-26 — tau is a tense marker first, and tsis tau
      // (Not & Don’t) builds on it. Was: [actionVerbs, tenseMarkers, tsisNegation]
      // answering added 2026-09-27 (path unit u-answers) — right after negation: the
      // answer to a puas question is the verb, or tsis + the verb.
      // sentenceStructure added 2026-09-28 (path unit u-sentence-structure), right after Action Verbs.
      lessons: [actionVerbs, sentenceStructure, tenseMarkers, tauLesson, tsisNegation, answering],
    },
    {
      id: 'naming-and-describing',
      title: 'Naming and Describing',
      blurb: 'Classifiers, "yog", and the words that describe.',
      // ⚠️ THE ORDER IN HERE IS LOAD-BEARING. Classifiers first because both
      // describing lessons use one ("tus poj niam…"). Then yog, then adjectives
      // — the old flat list had a comment insisting those two stay adjacent,
      // since "no 'to be' before an adjective" is one rule seen from both
      // sides, and it is preserved here. describingPeople sits last because it
      // is the two of them put against each other.
      // huUa added 2026-09-27 (path unit u-hu-ua) — names come right after yog.
      // Was: [nounClassifiers, yogToBe, adjectives, describingPeople]
      // quantifiers added 2026-09-27 (path unit Some, Many, All).
      // nounPurpose added 2026-09-28 (path unit u-noun-purpose) — right after classifiers,
      // because the classifier stays in front: lub rooj noj mov.
      // nyob added 2026-09-28 — split from the Yog lesson; the three "to be" lessons in a row.
      lessons: [nounClassifiers, nounPurpose, yogToBe, huUa, nyob, adjectives, quantifiers, describingPeople],
    },
    {
      // ⚠️ THE GROUP ID IS KEPT ('asking-and-joining') — only the title changed.
      // Question Words moved to its own unit, Asking Questions (2026-09-25).
      id: 'asking-and-joining',
      // Was: title 'Asking and Joining', blurb 'Questions, and stitching two
      // clauses into one.', lessons [questionWords, conjunctions].
      title: 'Joining Sentences',
      blurb: 'Stitching two clauses into one.',
      // Conjunctions last — joining two clauses only matters once you can build
      // one, so it depends on everything above it.
      // rau added 2026-09-27 (path unit u-rau) — rau (to, for) is the joining word
      // learners meet most. Was: [conjunctions]
      // soThen added 2026-09-28 (path unit u-so-then). Was: [conjunctions, rau]
      lessons: [conjunctions, rau, soThen],
    },
  ],
}

// ⚠️ THE WRITING UNIT — EVERY LESSON IS A PLACEHOLDER (2026-09-16).
//
// Requested as "grammar modules for writing text": grammar aimed at PRODUCING
// Hmong, where the Grammar unit explains how the language works. Scaffolded so
// the running order can be judged before any Hmong is authored — nothing here
// has teaching content, and every lesson carries `placeholder: true`.
//
// ⚠️ SEVEN OF THE ELEVEN OVERLAP A LESSON THAT ALREADY EXISTS, and each such
// file names its counterpart in its header. That overlap is NOT resolved. Before
// writing any of them, decide per lesson:
//
//   • narrow it to the writing-specific angle the header suggests, OR
//   • delete the placeholder and extend the existing lesson instead
//
// Shipping both would leave two lessons teaching one rule, free to drift apart.
// The four with NO existing counterpart — sentence order, tsis/tsis txhob,
// yes/no questions, discourse particles — are the ones that are pure gain, and
// are the sensible place to start.
//
// ⚠️ This unit is NOT in `units` below yet, so it does not render. Add it once
// at least the first lessons are real; a unit of eleven "not written yet" cards
// is worse than no unit. Tier it if it ships as Pro.
// eslint-disable-next-line no-unused-vars -- kept for the one-line restore above
const writingUnit = {
  id: 'writing',
  title: 'Writing',
  description: 'Putting Hmong together on the page — word order, questions, negation, and the small words that carry tone.',
  placeholder: true,
  groups: [
    {
      id: 'writing-the-frame',
      title: 'The Frame',
      blurb: 'The order words go in, and who the sentence is about.',
      lessons: [writingSentenceOrder, writingPronouns],
    },
    {
      id: 'writing-asking-and-denying',
      title: 'Asking and Denying',
      blurb: 'Questions, and saying something is not so.',
      // tsis/tsis txhob first: it owns the two core particles, and both the
      // broader negation lesson and the question lessons lean on them.
      lessons: [writingTsisTxhob, writingNegation, writingYesNoQuestions, writingQuestionWords],
    },
    {
      id: 'writing-people-actions-time',
      title: 'People, Actions and Time',
      blurb: 'Whose it is, what happened, and when.',
      lessons: [writingPossessionFamily, writingVerbPatterns, writingTimeAspect],
    },
    {
      id: 'writing-joining-up',
      title: 'Joining It Up',
      blurb: 'Sentence to sentence, and the particles that set the tone.',
      // Discourse particles last — the highest native-speaker dependency in the
      // unit, and the least useful before everything above it is solid.
      lessons: [writingConnectors, writingDiscourseParticles],
    },
  ],
}

// The Conversational unit. Everyday vocabulary and phrases.
const conversational = {
  id: 'conversational',
  title: 'Conversational',
  description: 'Everyday words and phrases — greetings, reciprocals, and more.',
  lessons: [
    greetingsFarewells,
    politeness,
    introductions,
    dailyLife,
    sibReciprocals,
    body,     // Body & Health, 2026-09-28 — placeholder lesson
    wearing,  // Clothes & Wearing, 2026-09-28 — placeholder lesson
    // Placeholder lessons for the path units that had none (2026-09-28) — lessons/placeholders.js.
    locationPlaceholder, particlesPlaceholder, familyPlaceholder, foodPlaceholder, siabPlaceholder,
    commonNounsPlaceholder,  // 2026-09-28 — Common Nouns had borrowed the Classifiers lesson
    // Drop new Conversational lessons here, in the order you want them shown.
  ],
}

// ── ASKING QUESTIONS — a dedicated unit, 2026-09-25 ─────────────────────────
// The author: "create a dedicated learning module for question words".
//
// ⚠️ `grammar-question-words` MOVED HERE FROM THE GRAMMAR UNIT, and it keeps its
// id. Progress keys on lesson and step ids, not on the unit, so anyone who
// finished it still has it finished. Only its URL changed, to
// /learn/questions/grammar-question-words. The Reference tab's "Learn this" and
// the path's intro link both follow it: reference.js names the new unit, and
// pathIntro.js finds a lesson's unit by searching, not by a stored id.
//
// The order is the three patterns the first lesson introduces: the words, then
// yes/no with puas, then "which" with a classifier.
const askingQuestions = {
  id: 'questions',
  title: 'Asking Questions',
  description: 'What, who, where, when, why — yes/no questions with puas, and "which one" with twg.',
  lessons: [
    questionWords,   // the words, and where they sit
    questionsYesNo,  // puas, answering with the verb, los tsis
    questionsWhich,  // twg after a classifier: lub twg, tus twg, qhov twg
  ],
}

// The Numbers & Time unit. Counting, prices, and telling time.
const numbersAndTime = {
  id: 'numbers-and-time',
  title: 'Numbers & Time',
  description: 'Counting, asking how much, and telling time in Hmong.',
  lessons: [
    numbers,
    howMuch,
    // ⚠️ DAYS FIRST, then the clock — 2026-09-26 (author: separate telling the time
    // from days / time of day; "make time of day come before telling the time"). A
    // clock time ends with the part of the day (sawv ntxov / tsaus ntuj), so that comes
    // first. Was: timeExplained, time — the clock first, as "the useful skill".
    time,
    dayFrames,  // Yesterday & Tomorrow, 2026-09-27 — split out of Time of Day
    calendar,  // Days & Months, 2026-09-27 — after the days, before the clock
    dates,  // Writing Dates, 2026-09-27
    timeExplained,
    // Drop new Numbers & Time lessons here, in the order you want them shown.
  ],
}

// ⚠️ RETIRED 2026-09-13 — see the note on the imports above.
//
// The Readings unit. Connected prose — the only place words appear in context.
// Ordered by difficulty (the `level` on each reading step).
// const readings = {
//   id: 'readings',
//   title: 'Readings',
//   description: 'Short passages to read for meaning. Hmong first, translation only when you ask.',
//   lessons: [
//     readingMim,
//     readingGarden,
//     readingSchool,
//     // Drop new readings here, easiest first.
//   ],
// }

// `units` is the top-level export consumed by the Learn page and the lesson
// player. Add additional units here as you build them — same pattern: import
// the lessons, declare the unit, list it.
// Normalize a unit so EVERY unit has a flat `lessons` array, whether it was
// declared with `groups` or not. This is the compatibility seam: all existing
// code (progress, getLesson, the Learn hub, allStepIds) keeps reading
// `unit.lessons` and never has to know about groups.
function withLessons(unit) {
  if (!unit.groups) return unit
  return { ...unit, lessons: unit.groups.flatMap((g) => g.lessons) }
}

export const units = [
  foundations,     // the alphabet: word structure → consonants → vowels → tones
  grammarUnit,     // how words combine
  askingQuestions, // what / who / which / yes-no — dedicated unit, 2026-09-25
  conversational,
  numbersAndTime,
  // readings,   ← retired 2026-09-13, see the note on the imports above
  // ⚠️ writingUnit — BUILT AND WITHDRAWN THE SAME DAY (2026-09-16), because it
  // answered the wrong question. The topic list behind it (sentence order,
  // tsis/tsis txhob, yes-no questions, negation, connectors, discourse
  // particles…) was meant as DRILLS IN THE SENTENCE BUILDER, not as a unit of
  // Learn lessons. Those topics now live as the "By grammar" axis on
  // /words/sentences — see GRAMMAR_PATTERNS in src/lib/sentenceBuilder.js,
  // which covers eight of them today and has four more waiting on content.
  //
  // The eleven placeholder files are KEPT (src/data/lessons/writing-*.js) and
  // still imported above. They cost nothing while unreferenced here, and their
  // headers hold the per-topic research — including which seven overlap an
  // existing lesson. If a writing-specific LESSON is ever actually wanted, that
  // work is done and this is a one-line restore.
  // writingUnit,
].map(withLessons)

// ──────────────────────────────────────────────────────────────────────────
// Helpers — pure read-only functions over the data above.
// Consumers (Lesson.jsx, Learn.jsx) call these instead of poking the data
// directly. That way, the data shape can change without touching every page.
// ──────────────────────────────────────────────────────────────────────────

// Resolve a Unit by its id. Returns null if not found.
export function getUnit(unitId) {
  return units.find((u) => u.id === unitId) || null
}

// Resolve a Lesson by its (unitId, lessonId) pair. Two-step lookup because
// lessons live inside units.
export function getLesson(unitId, lessonId) {
  const unit = getUnit(unitId)
  if (!unit) return null
  return unit.lessons.find((l) => l.id === lessonId) || null
}

/**
 * The lesson to go BACK to from a word set, or null — 2026-09-27 (author: "if a user
 * accesses a vocab dataset from a lesson, when they go back they go back to the
 * lesson").
 *
 * The lesson's "Study the N words" button opens its set with
 * `?fromLesson=<unitId>:<lessonId>` (and passes the lesson's own `?fromUnit` along,
 * so returning restores the lesson's path context too).
 *
 * ⚠️ HONOURED ONLY IF THAT LESSON'S WORD SET IS THIS SET — the same "relevant
 * source" guard as groupReturn / pathReturnUnit / storyReturn. A split part counts
 * (`animals-2` belongs to a lesson whose vocab is `animals`). Anything else → null →
 * the set's normal Vocabulary trail.
 *
 * Returns { unit, lesson, href, query } — `href` is the lesson's URL, `query` is what
 * child links (the set's words) carry forward.
 */
export function lessonReturn(fromLesson, categoryId, fromUnit) {
  if (!fromLesson || !categoryId) return null
  const [unitId, lessonId] = String(fromLesson).split(':')
  const unit = getUnit(unitId)
  const lesson = unit ? getLesson(unitId, lessonId) : null
  if (!lesson?.vocab) return null
  const base = String(categoryId).replace(/-\d+$/, '')  // split part → its set (see senses.js baseCategory)
  if (lesson.vocab !== categoryId && lesson.vocab !== base) return null
  const unitQuery = fromUnit ? `fromUnit=${encodeURIComponent(String(fromUnit))}` : ''
  return {
    unit,
    lesson,
    href: `/learn/${unit.id}/${lesson.id}${unitQuery ? `?${unitQuery}` : ''}`,
    query: `fromLesson=${unit.id}:${lesson.id}${unitQuery ? `&${unitQuery}` : ''}`,
  }
}

// Return just the array of step ids for a lesson. Used to compare against the
// user's completedSteps when computing per-lesson progress.
export function allStepIds(lesson) {
  return lesson.steps.map((s) => s.id)
}

// Compute progress numbers for a single lesson, given the user's completedSteps.
// Returns { done, total, ratio, complete } — used to render the progress bar
// and "✓ Done" badge on the Learn page.
export function lessonProgress(lesson, completedSteps) {
  const ids = allStepIds(lesson)
  if (ids.length === 0) return { done: 0, total: 0, ratio: 0, complete: true }
  const done = ids.filter((id) => completedSteps.includes(id)).length
  return { done, total: ids.length, ratio: done / ids.length, complete: done === ids.length }
}
