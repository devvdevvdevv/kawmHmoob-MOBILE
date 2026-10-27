import { vowels, vowelGroups, tones } from '../data/reference.js'

// VOWEL × TONE, DERIVED — 2026-10-14.
//
// Hmong writes the tone as a letter at the END of the syllable, so a vowel and a
// tone marker make a written form mechanically: `a` + `b` = `ab`. Everything here
// is that one rule applied to reference.js — no syllable is authored, and adding
// a vowel or recording a tone changes these lists with no edit.
//
// ⚠️ A FORM IS A SPELLING, NOT A WORD. `ab` is legal Hmong orthography; whether
// anyone says it is a different question this file does not answer. Every screen
// built on it says so in the UI, because a table reads as a vocabulary list
// unless it tells you otherwise.
//
// Used by the per-tone page (app/tone/[marker].jsx), the per-vowel page
// (app/vowel/[letter].jsx) and the dev-only full grid
// (components/reference/VowelToneGrid.jsx).

// ⚠️ THE MID TONE HAS NO MARKER, AND A URL CANNOT HOLD AN EMPTY SEGMENT.
// `/tone/` is not a route, so the mid tone travels as the slug 'mid'. Keep the
// slug OUT of display: what a learner sees is the marker, or '—' when there is
// none.
export const MID_SLUG = 'mid'

/** The url-safe id for a tone: its marker, or 'mid'. */
export function toneSlug(tone) {
  return tone.marker || MID_SLUG
}

/** The tone a slug refers to, or null. */
export function toneBySlug(slug) {
  if (!slug) return null
  const wanted = String(slug)
  return tones.find((t) => toneSlug(t) === wanted) || null
}

/** The vowel a letter refers to, or null. */
export function vowelByLetter(letter) {
  if (!letter) return null
  const wanted = String(letter).toLowerCase()
  return vowels.find((v) => v.letter.toLowerCase() === wanted) || null
}

/**
 * One tone across every vowel, grouped the way reference.js groups vowels
 * (single / double) so the page reads as a table rather than a list of 13.
 *
 * Returns [{ id, title, blurb, forms: [{ vowel, syllable, vowelSound, audio }] }]
 *
 * ⚠️ `audio` IS THE VOWEL'S OWN CLIP, and it is here so a caller can offer the
 * vowel sound — never as the syllable's recording. There are no vowel+tone
 * recordings (13 × 8 = 104 clips that do not exist).
 */
export function vowelsForTone(tone) {
  if (!tone) return []
  return vowelGroups.map((g) => ({
    id: g.id,
    title: g.title,
    blurb: g.blurb,
    forms: g.items.map((v) => ({
      vowel: v.letter,
      syllable: v.letter + tone.marker,
      vowelSound: v.sound || '',
      audio: v.audio || '',
    })),
  }))
}

/**
 * One vowel across all eight tones, in the order reference.js lists them —
 * which is the order the Tones page and every lesson use. Changing it here would
 * make this page disagree with the rest of the app.
 *
 * Returns [{ tone, syllable, marker, name, description, example, audio }]
 * where `audio` is the TONE's reference clip (the `po` series), not the syllable.
 */
export function tonesForVowel(vowel) {
  if (!vowel) return []
  return tones.map((t) => ({
    tone: t,
    syllable: vowel.letter + t.marker,
    marker: t.marker,
    name: t.name,
    description: t.description || '',
    example: t.example || '',
    audio: t.audio || '',
  }))
}

/** Every vowel, for the index of per-vowel pages. */
export function allVowels() {
  return vowels
}

/** Every tone, for the index of per-tone pages. */
export function allTones() {
  return tones
}
