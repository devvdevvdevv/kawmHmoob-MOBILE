import { categories } from '../data/vocabulary.js'
import { consonants, vowels, tones } from '../data/reference.js'
import { toneOfSyllable } from './hmongTone.js'

// TYPING DRILL — read the English, SPELL the Hmong from a constrained set.
//
// The fourth of the five challenge types in
// notes/2026-09-16-writing-unit-and-challenge-todo.md, and the one picked first
// because it is the only one that is specifically about HMONG rather than about
// quizzing in general.
//
// ⚠️ WHY A CONSTRAINED SET AND NOT A KEYBOARD — this is the whole argument for
// the feature, so it is written down rather than assumed:
//
//   In RPA the tone IS the final consonant. A learner who types `zos` when they
//   meant `zoo` has not made a typo — they have said a different tone, and
//   therefore a different word (`zos` is a village). On a phone keyboard that
//   mistake is invisible: it looks like a slipped finger, autocorrect may even
//   "fix" it, and nothing ever tells them a tone was the thing they got wrong.
//
//   So the answer is built in three named steps per syllable —
//   CONSONANT → VOWEL → TONE — and the grader reports a wrong final consonant
//   as a TONE error, by the tone's name, using the same `tones` table the
//   Reference tab teaches from (via lib/hmongTone.js). Nothing here restates a
//   tone name; change one in reference.js and this module follows.
//
// ⚠️ THE LETTERS ARE CONSTRAINED; THE TONES NEVER ARE. The consonant and vowel
// trays offer the right answer plus a handful of confusable decoys, because
// picking `nts` out of `nt`/`ntx`/`nth` is a real exercise. The tone row always
// shows ALL EIGHT. Narrowing it would hand over the answer to the one question
// the drill exists to ask.

// ── The inventories ─────────────────────────────────────────────────────────
//
// Derived from reference.js, not listed here, for the same reason the tone
// names are: the alphabet module and this drill must agree about what a Hmong
// consonant is, and two hand-kept lists drift.
//
// ⚠️ FOUR ONSETS ADDED BY HAND, and they are not decoration. `consonants` in
// reference.js is missing `nk`, `ml`, `dl` and `nr`, which all appear in its
// OWN `doubleConsonants` list further down the same file — so the two lists
// there already disagree. Adding them here rather than to `consonants` keeps
// this change out of the Reference tab's rendered alphabet, which is a
// content decision, not a parser one. Without them `nkauj`, `mloog` and
// `nrog` fall out of the pool.
// TO FIX PROPERLY: reconcile `consonants` and `doubleConsonants` in
// reference.js and delete this array.
const MISSING_FROM_REFERENCE = ['nk', 'ml', 'dl', 'nr']

// Longest-first, and that ordering is load-bearing: `nts` must be tried before
// `nt`, or "ntses" parses as nt + <not a vowel> and drops out of the pool.
export const ONSETS = [...new Set([...consonants.map((c) => c.letter), ...MISSING_FROM_REFERENCE])]
  .map((l) => l.toLowerCase())
  .sort((a, b) => b.length - a.length)

export const NUCLEI = [...new Set(vowels.map((v) => v.letter.toLowerCase()))]
  .sort((a, b) => b.length - a.length)

// The tone row, in the order the Reference tab lists them — b j v (mid) s g m d
// — so a learner meets the eight tones in one order everywhere in the app.
// `marker: ''` is the mid tone, which has no letter; it is a real choice here,
// not an absence, which is exactly the thing the unmarked tone needs taught.
export const TONE_ROW = tones.map((t) => ({ marker: t.marker, name: t.name }))

const TONE_LETTERS = new Set(TONE_ROW.map((t) => t.marker).filter(Boolean))
const TONE_NAME = Object.fromEntries(TONE_ROW.map((t) => [t.marker, t.name]))

/** A tone's name, for either a marker letter or '' (mid). */
export function toneName(marker) {
  return TONE_NAME[marker || ''] || 'Mid'
}

// ── Parsing one syllable ────────────────────────────────────────────────────
/**
 * Split an RPA syllable into onset + nucleus + tone.
 *
 * Returns null when it does not parse, and the CALLER DROPS THE WORD. That is
 * deliberate: a syllable this cannot split is one the three-step tray cannot
 * ask for, and guessing at it would put a wrong spelling in a spelling drill.
 *
 * ⚠️ A FINAL TONE LETTER IS ONLY A TONE WHEN WHAT PRECEDES IT IS A VOWEL.
 * Checking the last letter alone is not enough — it would read the `m` of a
 * syllable that genuinely ends in a consonant as a tone. Requiring the head to
 * end in a known nucleus is what makes the rule safe.
 *
 * @returns {{onset: string, nucleus: string, tone: string}|null}
 */
export function parseSyllable(syllable) {
  let s = String(syllable || '').toLowerCase().replace(/[^a-z]/g, '')
  if (!s) return null

  let tone = ''
  const last = s.slice(-1)
  if (TONE_LETTERS.has(last) && s.length > 1) {
    const head = s.slice(0, -1)
    if (NUCLEI.some((n) => head.endsWith(n))) {
      tone = last
      s = head
    }
  }

  // The onset is the longest consonant that leaves a WHOLE nucleus behind —
  // testing the remainder is what stops `ts` being taken out of "tsov" as `t`
  // + "sov". An empty onset is a legitimate answer ("os", "ib", "aub"), so the
  // fallback is '' rather than a failure.
  const onset = ONSETS.find((o) => s.startsWith(o) && NUCLEI.includes(s.slice(o.length))) ?? ''
  const nucleus = s.slice(onset.length)
  if (!NUCLEI.includes(nucleus)) return null

  return { onset, nucleus, tone }
}

/** Put a parsed syllable back together. Tolerates half-built ones — see
 *  picksToSyllables(), where an unanswered part is `undefined`. */
export function spellSyllable(p) {
  return `${p?.onset ?? ''}${p?.nucleus ?? ''}${p?.tone ?? ''}`
}

// ── The pool ────────────────────────────────────────────────────────────────
//
// ⚠️ ONE AND TWO SYLLABLES ONLY. Measured against the vocabulary on 2026-09-20:
// 1351 entries, of which 621 are one syllable and 508 are two — so the cap
// keeps 1129 and costs 222, nearly all of them long compounds. Past two
// syllables the drill is six-plus taps of tray-swapping for one word, which
// stops being a tone exercise and becomes data entry.
const MAX_SYLLABLES = 2

// ⚠️ 47 OF THOSE 1129 STILL DROP OUT, and the reason is worth keeping: they are
// compounds written SOLID — `tiamsis`, `lossis`, `xibfwb`, `menyuam`,
// `neesnkaum` — plus the loanword place names (`Meskas`, `Fabkis`, `Askiv`).
// A solid compound is more than one syllable however it is spaced, so the
// parser cannot split it and the drill will not ask for it. Both groups are
// poor tone-drill material anyway; the count is here so a future change to the
// parser can be measured against it rather than guessed at.

// ── Turning a dictionary entry into a PROMPT ────────────────────────────────
//
// `english` in the vocabulary is a full entry, not a prompt. It carries several
// senses, bracketed notes, and — the part that matters — worked examples in
// HMONG: "to drive — \"tsav tsheb\"", "proof, evidence — \"neeg ua pov thawj\",
// a witness".
//
// ⚠️ 38 OF 967 PROMPTS CONTAINED THEIR OWN ANSWER before this existed. The
// drill was printing the Hmong word above the trays and then asking the learner
// to spell it. Splitting on `·` and `;` alone was not enough, because the
// examples hang off an em dash or a colon.
//
// firstSense() is the shared half: strip a wholly-parenthesised entry, cut at
// the first sense separator, tidy the edges. The word INDEX uses it too, so the
// gloss a prompt is built from and the gloss an alternative answer is looked up
// by are the same string by construction — see isAlternativeAnswer().
function firstSense(english) {
  let p = String(english || '').trim()
  // "(classifier for books & bound documents)" is one sense wearing brackets,
  // not a note — unwrap it BEFORE cutting, or the cut leaves a dangling "(".
  if (/^\(.*\)$/.test(p)) p = p.slice(1, -1)
  p = p.split(/[·;:=]|—|–/)[0]
  p = p.replace(/^["“\s]+/, '').replace(/["”\s]+$/, '').replace(/[.,]+$/, '').trim()
  // A cut can still orphan a bracket ("(classifier for flat objects: paper…"
  // → "(classifier for flat objects"). Unbalanced means the brackets no longer
  // mean anything, so they go.
  const open = (p.match(/\(/g) || []).length
  const close = (p.match(/\)/g) || []).length
  if (open !== close) p = p.replace(/[()]/g, '').trim()
  return p
}

/**
 * The prompt for one entry, or null when it cannot be one.
 *
 * ⚠️ THE LAST CHECK IS THE POINT: a prompt whose letters contain the answer's
 * letters is rejected outright, whatever route it took to get there. It is a
 * blunt test — it also drops "like" for `li` — but 41 lost exercises out of 967
 * is a cheap price for never printing the answer above the question.
 */
function promptFor(english, hmong) {
  const p = firstSense(english)
  if (!p) return null
  // A surviving quote mark means a Hmong example outran the cut.
  if (/["“”]/.test(p)) return null
  // Longer than this is a dictionary entry, not a prompt, and it wraps the
  // prompt card into a paragraph.
  if (p.length < 2 || p.length > 48) return null
  // "bound word — not used alone: tab sis = but" cuts down to "bound word",
  // which describes the ENTRY and names no meaning to translate.
  if (/^bound word/i.test(p)) return null
  if (lettersOnly(p).includes(lettersOnly(hmong))) return null
  return p
}

const lettersOnly = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '')

// Every prompt the drill can ask, in data order.
//
// ⚠️ DEDUPED BY ENGLISH, NOT ONLY BY THE HMONG. Deduping the Hmong alone still
// lets two exercises share a PROMPT — "father" is `txiv` five times over in the
// vocabulary — and a session that asks the same English twice with a different
// expected answer each time reads as a bug. First entry to claim a gloss keeps
// it.
export function allTypingExercises() {
  const out = []
  const seenWord = new Set()
  const seenGloss = new Set()

  for (const cat of categories) {
    for (const word of cat.words) {
      const rpa = (word.hmongRPA || '').trim()
      const english = (word.english || '').trim()
      if (!rpa || !english) continue

      const syllables = rpa.split(/\s+/).filter(Boolean)
      if (syllables.length < 1 || syllables.length > MAX_SYLLABLES) continue

      const parsed = syllables.map(parseSyllable)
      if (parsed.some((p) => !p)) continue

      const key = rpa.toLowerCase()
      if (seenWord.has(key)) continue

      // The PROMPT is the first sense only, and never one that gives the answer
      // away — see promptFor(). Many entries carry a whole dictionary gloss
      // ("thing; kind; type; matter · anything; something · without; lacking"),
      // and showing all of it asks the learner to read an entry before they can
      // start spelling. The full `english` is kept on the exercise and shown in
      // the reveal, where it is context rather than an obstacle.
      const prompt = promptFor(english, rpa)
      if (!prompt) continue
      const gloss = prompt.toLowerCase()
      if (seenGloss.has(gloss)) continue

      seenWord.add(key)
      seenGloss.add(gloss)
      out.push({
        id: word.id,
        hmong: rpa,
        prompt,
        english,
        syllables: parsed,
        categoryTitle: cat.title,
        categoryId: cat.id,
      })
    }
  }
  return out
}

// ── The "you spelled a different real word" index ───────────────────────────
//
// ⚠️ THIS IS THE POINT OF THE WHOLE FEATURE, so it is worth saying plainly what
// it buys. 133 one-syllable skeletons in the vocabulary carry more than one
// tone — `miv` cat / `mis` milk, `nab` snake / `nas` mouse, `pob` ball /
// `pom` see / `pog` grandmother. When a learner picks the wrong tone they very
// often have not written nonsense, they have written ANOTHER WORD THE APP HAS
// ALREADY TAUGHT THEM. Saying so ("`mis` is a word of its own — milk") turns a
// wrong answer into the single most useful thing a tone drill can show.
//
// Built lazily and kept, the same way sentenceBuilder.js keeps its phrase index.
let wordIndex = null

// ⚠️ PUNCTUATION STRIPPED FROM THE KEY, NOT FROM THE WORD. Seven vocabulary
// entries carry their question mark in the spelling — "pes tsawg?", "dab tsi?",
// "leej twg?" — and what the learner builds out of the trays never has one,
// because the trays hold letters. Keying the index on the raw spelling meant
// those seven could never be recognised as real words. The entry itself keeps
// its punctuation, which is what the reveal shows.
const indexKey = (rpa) => String(rpa || '').toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim()

function buildWordIndex() {
  const byWord = new Map() // 'miv' → { english }
  const byGloss = new Map() // 'cat'  → Set of rpa
  for (const cat of categories) {
    for (const w of cat.words) {
      const rpa = indexKey(w.hmongRPA)
      const english = (w.english || '').trim()
      if (!rpa || !english) continue
      if (!byWord.has(rpa)) byWord.set(rpa, { english })
      // ⚠️ THE SAME firstSense() THE PROMPT IS BUILT FROM. These two must agree
      // or isAlternativeAnswer() silently stops matching: the prompt would read
      // "sister" while the index filed `viv ncaus` under "sisters / female
      // siblings & cousins", and a correct second answer would be marked wrong.
      const gloss = firstSense(english).toLowerCase()
      if (!gloss) continue
      if (!byGloss.has(gloss)) byGloss.set(gloss, new Set())
      byGloss.get(gloss).add(rpa)
    }
  }
  return { byWord, byGloss }
}

/** The vocabulary entry for an exact RPA spelling, or null. */
export function lookupWord(rpa) {
  if (!wordIndex) wordIndex = buildWordIndex()
  return wordIndex.byWord.get(indexKey(rpa)) || null
}

/**
 * Is this spelling ALSO a right answer to the prompt?
 *
 * ⚠️ English→Hmong is not one-to-one and pretending otherwise would mark true
 * answers wrong. "sister" is `muam` from a man and `viv ncaus` from a woman;
 * both are in the vocabulary, and only one of them can be the exercise's
 * target. A spelling that is a real word carrying the SAME first-sense gloss as
 * the prompt is accepted, and the reveal says which one was expected.
 */
function isAlternativeAnswer(spelling, prompt) {
  if (!wordIndex) wordIndex = buildWordIndex()
  const set = wordIndex.byGloss.get(String(prompt || '').trim().toLowerCase())
  return Boolean(set && set.has(indexKey(spelling)))
}

// ── The trays ───────────────────────────────────────────────────────────────
//
// A tray is the right answer plus DECOYS THAT ARE PLAUSIBLE. Random decoys make
// the step a formality: offered `nts` against `f`, `y` and `hl`, nobody is
// learning to tell the clusters apart. Offered it against `nt`, `ntx`, `nth`
// and `ts`, the step IS the lesson the Triple Consonants lesson teaches.
//
// Similarity is measured on the spelling — shared prefix, shared suffix, length
// — because that is exactly what makes two RPA clusters easy to confuse on the
// page. Nothing phonetic is claimed here.
const TRAY_SIZE = 6

function similarity(a, b) {
  let prefix = 0
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++
  let suffix = 0
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) suffix++
  return prefix * 2 + suffix - Math.abs(a.length - b.length)
}

function trayFor(correct, inventory, size = TRAY_SIZE) {
  const decoys = inventory
    .filter((x) => x !== correct)
    .map((x) => ({ x, score: similarity(correct, x) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, size - 1)
    .map((d) => d.x)
  return [correct, ...decoys]
}

/**
 * The chips for one step of one syllable.
 *
 * ⚠️ THE EMPTY ONSET IS A CHIP, NOT A MISSING CHIP. "os", "ib" and "aub" begin
 * with their vowel, and a tray with no way to say "no consonant here" would
 * make those words unanswerable. It is offered on EVERY syllable, not only the
 * ones that need it — offering it only when it is correct would announce the
 * answer.
 */
export function trayForStep(syllable, step) {
  if (step === 'onset') {
    // The empty onset TAKES ONE OF THE SIX SLOTS rather than adding a seventh.
    // A consonant tray one chip longer than the vowel tray makes the rows jump
    // height as the drill steps through them, and the extra decoy buys nothing.
    const rideAlong = syllable.onset === '' ? [] : ['']
    return shuffle([...trayFor(syllable.onset, ONSETS, TRAY_SIZE - rideAlong.length), ...rideAlong])
  }
  if (step === 'nucleus') return shuffle(trayFor(syllable.nucleus, NUCLEI))
  // All eight, always, in the Reference tab's order — never shuffled, so the
  // tone row is in the same place every time and picking one becomes muscle
  // memory rather than a fresh search. See the header for why it is never cut
  // down to a plausible few.
  return TONE_ROW.map((t) => t.marker)
}

export function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ── A session ───────────────────────────────────────────────────────────────
//
// Five, matching the sentence builder — this is a drill, not a test, and the
// two live one tile apart on the Words hub, so they should be the same length.
export const SESSION_LENGTH = 5

// The three steps of a syllable, in the order they are spelled and in the order
// the tray asks for them.
export const STEPS = ['onset', 'nucleus', 'tone']

export function buildTypingSession(count = SESSION_LENGTH) {
  return shuffle(allTypingExercises()).slice(0, count)
}

/**
 * The answer being built, as a flat list of picks.
 *
 * ⚠️ FLAT, NOT NESTED, AND THAT IS WHY UNDO IS ONE LINE. Every syllable takes
 * exactly three picks — consonant, vowel, tone, with '' a legal value for the
 * first and the last — so pick number `i` belongs to syllable `i / 3` at step
 * `i % 3`, and undoing is popping the array. A nested {onset, nucleus, tone}
 * draft would need its own rules for "undo the tone of the syllable before
 * this one".
 */
// ⚠️ UNPICKED STAYS `undefined` — it must NOT be defaulted to ''. An empty
// string is a real answer here twice over (the word starts with its vowel; the
// tone is mid), so a slot that has been ANSWERED with "nothing" and a slot that
// has not been answered yet are different states that both spell as nothing.
// Collapsing them showed every empty slot as an already-chosen "none".
// spellSyllable() does the coercion instead, where it is safe.
export function picksToSyllables(picks) {
  const out = []
  for (let i = 0; i < picks.length; i += 3) {
    out.push({ onset: picks[i], nucleus: picks[i + 1], tone: picks[i + 2] })
  }
  return out
}

export function currentStep(picks) {
  return STEPS[picks.length % 3]
}

export function spellPicks(picks) {
  return picksToSyllables(picks).map(spellSyllable).join(' ')
}

export function isComplete(picks, exercise) {
  return picks.length === exercise.syllables.length * 3
}

// ── Grading ─────────────────────────────────────────────────────────────────
/**
 * What kind of wrong this is — the reason the drill exists.
 *
 * `status` is one of:
 *   'correct'     — the target, exactly
 *   'alternative' — a different real word that also answers the prompt
 *   'tone'        — every consonant and vowel right, at least one tone wrong
 *   'spelling'    — a consonant or a vowel is wrong
 *
 * ⚠️ 'tone' IS A SEPARATE STATUS FROM 'spelling' ON PURPOSE. Both are wrong
 * answers and both are scored as wrong; the distinction is what the learner is
 * told afterwards. Collapsing them would put this drill back where a keyboard
 * already is.
 *
 * `syllables` carries a per-syllable verdict so the screen can mark the one bad
 * tone in a two-syllable word instead of reddening the whole thing.
 */
export function diagnose(picks, exercise) {
  const built = picksToSyllables(picks)
  const spelling = spellPicks(picks)
  const target = exercise.syllables

  const syllables = target.map((want, i) => {
    const got = built[i] || { onset: '', nucleus: '', tone: '' }
    const lettersOk = got.onset === want.onset && got.nucleus === want.nucleus
    return {
      want: spellSyllable(want),
      got: spellSyllable(got),
      onsetOk: got.onset === want.onset,
      nucleusOk: got.nucleus === want.nucleus,
      toneOk: got.tone === want.tone,
      lettersOk,
      // Named tones, for the feedback line. The target's name is read off the
      // whole syllable with hmongTone.toneOfSyllable — the same function the
      // Speak module uses — so the two surfaces can never disagree about what
      // tone a word carries.
      wroteTone: { marker: got.tone, name: toneName(got.tone) },
      wantedTone: toneOfSyllable(spellSyllable(want)) || { marker: want.tone, name: toneName(want.tone) },
    }
  })

  const allLetters = syllables.every((s) => s.lettersOk)
  const allTones = syllables.every((s) => s.toneOk)

  let status
  if (allLetters && allTones) status = 'correct'
  else if (isAlternativeAnswer(spelling, exercise.prompt)) status = 'alternative'
  else if (allLetters) status = 'tone'
  else status = 'spelling'

  return {
    status,
    spelling,
    syllables,
    // Only when it is wrong, and only when it is a DIFFERENT word: telling
    // someone who spelled `miv` correctly that `miv` means cat is noise.
    alsoAWord:
      status === 'correct' || status === 'alternative'
        ? null
        : (() => {
            const hit = lookupWord(spelling)
            return hit ? { spelling, english: hit.english } : null
          })(),
    // Partial credit, the same idea as wordAccuracy() in sentenceBuilder.js: a
    // two-syllable word with one syllable perfect is not the same as one with
    // neither, and a flat "wrong" erases that.
    correctSyllables: syllables.filter((s) => s.lettersOk && s.toneOk).length,
    totalSyllables: syllables.length,
  }
}

export function isPass(status) {
  return status === 'correct' || status === 'alternative'
}

// ── Scoring ─────────────────────────────────────────────────────────────────
//
// ⚠️ SESSION-SCOPED, DELIBERATELY — the same boundary the sentence builder
// holds (see the note at PERFECT_BONUS in sentenceBuilder.js). The app already
// has two disconnected XP economies (`ProgressContext.xp` and lib/leveling.js);
// notes/2026-09-16-writing-unit-and-challenge-todo.md lists "where does scoring
// go" as a decision to make BEFORE adding a sixth scoring surface. Until that
// decision is made, this one stays local and honest rather than guessing which
// economy to write to.
const POINTS_BASE = 10
const POINTS_PER_EXTRA_SYLLABLE = 6

export function pointsForExercise(exercise) {
  const extra = Math.max(0, exercise.syllables.length - 1)
  return POINTS_BASE + extra * POINTS_PER_EXTRA_SYLLABLE
}

export const PERFECT_BONUS = 20
