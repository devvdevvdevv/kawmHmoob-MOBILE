import { tones } from '../data/reference.js'

// Which tone each syllable of an RPA phrase carries — read straight off the
// spelling, not written by hand.
//
// In RPA the tone IS the final letter of the syllable: b j v s g m d. A syllable
// ending in anything else (a vowel) is the mid tone, which has no marker. That
// is the whole rule, and it is the same table the Reference tab teaches, so this
// module resolves against `tones` in reference.js rather than restating it —
// change a tone's name there and every phrase here follows.
//
// WHY THIS EXISTS: the Speak step used to show a hand-written `tip` string per
// phrase ("Both syllables carry a high, even tone — keep them level…"). Prose
// like that has to be authored for every phrase, can't be verified, and says the
// same thing the spelling already says. A derived breakdown is true by
// construction and covers every phrase, including ones added tomorrow.

const BY_MARKER = Object.fromEntries(tones.map((t) => [t.marker, t]))

// Tone letters, longest-first is irrelevant here (all are single chars), but the
// set must not include any vowel: b j v s g m d are consonants in RPA, so a
// final vowel always falls through to the mid tone.
const TONE_LETTERS = new Set(['b', 'j', 'v', 's', 'g', 'm', 'd'])

/**
 * The tone of one RPA syllable.
 * @returns {{marker: string, name: string}} — marker '' means the unmarked mid tone.
 */
export function toneOfSyllable(syllable) {
  const clean = String(syllable || '').replace(/[^A-Za-z]/g, '')
  if (!clean) return null
  const last = clean[clean.length - 1].toLowerCase()
  const marker = TONE_LETTERS.has(last) ? last : ''
  const tone = BY_MARKER[marker] || BY_MARKER['']
  return tone ? { marker, name: tone.name } : null
}

/**
 * Break a phrase into syllables with their tones. RPA writes every syllable as
 * its own whitespace-separated word, so splitting on spaces IS syllabification —
 * no dictionary needed.
 *
 * @returns {Array<{text: string, marker: string, name: string}>}
 */
export function syllableTones(phrase) {
  return String(phrase || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => {
      const tone = toneOfSyllable(text)
      return tone ? { text, ...tone } : null
    })
    .filter(Boolean)
}
