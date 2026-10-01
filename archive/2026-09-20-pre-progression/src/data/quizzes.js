import { consonants, doubleConsonants, vowels, tones, grammar } from './reference.js'
import { speakGroups } from './speak.js'
import { toneDrillWords } from './toneDrill.js'

import {categories} from './vocabulary.js'

// Quiz shape: { id, title, description, questionCount, questionTypes, category, tier? }
// Optional `tier: 'free' | 'pro'` gates the quiz behind the paywall. Default 'free'.
// See notes/14-paywall-and-supabase.md.



export const vocabQuizzes = categories.map((cat) => ({
  id: `vocab-${cat.id}`,
  title: cat.title,
  description: cat.description,
  questionTypes: ['multiple-choice'],
  category: 'Vocabulary',
  // Hmong word ↔ English gloss — both directions are a real question, so this
  // quiz honours the Settings direction preference. See `reversible` below.
  reversible: true,
}))


// `questionCount` is NOT written here — it's derived below from each quiz's own
// dataset, so a quiz always asks every item it has.
const QUIZ_DEFS = [
  ...vocabQuizzes,

  // COMMENTED OUT — the consonant and vowel quizzes are superseded by the
  // Speak drills, which test the same letters by SAYING them rather than by
  // picking a sound description off a list. A letter's sound is a production
  // skill; multiple choice can't test it (same reasoning as notes/50, notes/60).
  //
  // Tone Markers stays: identifying which marker carries which tone is genuinely
  // recognition, so multiple choice fits it.
  //
  // Commented, NOT deleted — restore if the drills don't cover this. Note the
  // ids are progress keys: anyone who took these keeps their scores in
  // `quizScores`, they just won't see the quiz listed. See notes/65.
  // {
  //   id: 'alphabet-consonants',
  //   title: 'Consonants',
  //   description: 'Match Hmong consonants to their sounds.',
  //   questionCount: 10,
  //   questionTypes: ['multiple-choice'],
  //   category: 'Alphabet',
  // },
  // {
  //   id: 'alphabet-double-consonants',
  //   title: "Double Consonants",
  //   description: "Match Hmong consonant to their sounds",
  //   questionCount: 10,
  //   questionTypes: ['multiple-choice'],
  //   category: 'Alphabet'
  // },
  // {
  //   id: 'alphabet-vowels',
  //   title: 'Vowels',
  //   description: 'Recognize Hmong vowels by sound.',
  //   questionCount: 10,
  //   questionTypes: ['multiple-choice'],
  //   category: 'Alphabet',
  // },
  {
    id: 'alphabet-tones',
    title: 'Tone Markers',
    description: 'Identify the 8 Hmong tone markers.',
    questionTypes: ['multiple-choice'],
    category: 'Alphabet',
    // Marker ↔ tone name, one-to-one both ways.
    reversible: true,
  },
  {
    id: 'tone-drill',
    title: 'Tone Drill',
    description: 'Identify the tone of each Hmong word — uniquely valuable for tonal-language listening practice.',
    questionTypes: ['multiple-choice'],
    category: 'Tones',
    // ⚠️ NOT reversible, and this is not an oversight. Reversed, the prompt
    // becomes a tone name ("Low") and DOZENS of words answer it correctly — the
    // question would have no single right answer. Many-to-one datasets can only
    // be asked in the many→one direction.
    reversible: false,
  },
  {
    id: 'grammar-pronouns',
    title: 'Pronouns',
    description: 'Translate Hmong pronouns.',
    // MATCHING DISABLED — multiple-choice only for now.
    // questionTypes: ['multiple-choice', 'matching'],
    questionTypes: ['multiple-choice'],
    category: 'Grammar',
    reversible: true,
  },
  {
    id: 'everyday-greetings',
    title: 'Greetings',
    description: 'Common Hmong greetings.',
    questionTypes: ['multiple-choice'],
    category: 'Speak',
    reversible: true,
  },
]

// EVERY QUIZ ASKS EVERYTHING IT HAS. `questionCount` is derived from the quiz's
// own dataset instead of being written by hand, so:
//
//   • a vocab quiz covers the whole category — a 31-word category was being
//     tested with a 10-question sample, so two thirds of it never came up;
//   • adding words to a category grows its quiz automatically, with no second
//     place to remember to update;
//   • a hand-typed count can't drift below (or above) the data again.
//
// getQuizDataset is a hoisted function declaration, so calling it here — above
// its definition — is fine; the data it reads comes from ES imports, which are
// evaluated before this module body runs.
export const quizzes = QUIZ_DEFS.map((q) => ({
  ...q,
  questionCount: getQuizDataset(q.id).length,
}))

export function getQuizConfig(id) {
  return quizzes.find((q) => q.id === id)

}

/**
 * Apply the learner's direction preference to a dataset.
 *
 * Every adapter below returns the same `{ prompt, answer }` shape, which is what
 * makes this a one-line feature: reversing a quiz is swapping those two fields.
 * `audio` and `blurb` ride along untouched — they describe the ITEM, not a side
 * of it.
 *
 * A quiz without `reversible: true` is returned unchanged, whatever the
 * preference says. Direction is a property of the DATA (is the mapping
 * one-to-one?), not of what the learner would like — see tone-drill above.
 *
 * @param {Array<{prompt:string, answer:string}>} dataset
 * @param {string} direction  ENGLISH_TO_HMONG reverses; anything else doesn't
 * @param {{reversible?: boolean}} config  the quiz definition
 */
export function orientDataset(dataset, direction, config) {
  if (direction !== 'english-hmong' || !config?.reversible) return dataset
  return dataset.map((d) => ({ ...d, prompt: d.answer, answer: d.prompt }))
}


export function getQuizDataset(id) {

  if (id.startsWith('vocab-')){
    const catId = id.slice(6);
    const cat = categories.find((c) => c.id == catId)
    return cat ? cat.words.map((item) => ({
      // The WORD's id, carried through so a quiz can look the word up in
      // vocabProgress — that's what lets the settings sheet filter a quiz down
      // to only Learning or only Known. Survives orientDataset, which swaps
      // prompt/answer and leaves everything else alone.
      id: item.id,
      prompt: item.hmongRPA,
      answer: item.english,
      audio: item.audioFile,   // bare filename — resolveSrc prepends AUDIO_BASE
    })) :
    []

  }

  switch (id) {
    // Each adapter also passes `audio` so the quiz can play the sound it's
    // asking about, and optionally `blurb` — a transcript line shown under the
    // prompt. See notes/48.
    case 'alphabet-consonants':
      // Only sound-bearing entries — triples/quads with a blank sound would
      // make questions with empty answers (see notes/43).
      return consonants
        .filter((c) => c.sound)
        .map((c) => ({ prompt: c.letter, answer: c.sound, audio: c.audio }))
    case 'alphabet-vowels':
      return vowels.map((v) => ({ prompt: v.letter, answer: v.sound, audio: v.audio }))
    case 'alphabet-tones':
      return tones.map((t) => ({
        prompt: t.marker || '(no marker)',
        answer: t.name,
        audio: t.audio,
        blurb: t.example2,   // the tone's Hmong name — what the recording says
      }))
    case 'tone-drill':
      return toneDrillWords.map((w) => ({ prompt: w.word, answer: w.tone }))
    case 'grammar-pronouns': {
      const group = grammar.find((g) => g.title === 'Pronouns')
      return group ? group.items.map((i) => ({ prompt: i.hmong, answer: i.english })) : []
    }
    // Sourced from Speak now — the old course "everyday" lists moved there
    // when /course dissolved. Quiz id kept: it's in users' saved quizScores.
    case 'everyday-greetings': {
      const group = speakGroups.find((g) => g.id === 'speak-greetings')
      return group ? group.phrases.map((p) => ({ prompt: p.hmong, answer: p.english })) : []
    }




    default:
      return []
  }
}
