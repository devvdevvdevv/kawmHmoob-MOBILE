import { lookupWord, normalizeWord } from './wordLookup.js'

// DEFINE A TAPPED WORD — what the definition sheet shows for one word in one line.
//
// ⚠️ EXTRACTED 2026-09-25 from the story reader's `define()`
// (app/reading/story/[storyId]/index.jsx), so the path's Reading step can use
// the SAME lookup. It was React state glued to one screen; it is now a pure
// function both screens call. Every comment below came with it — each records a
// real bug. Guide: notes/2026-09-25-GUIDE-path-reading-tap-to-define.md
//
// PURE: no React, no state. The caller stores the result.

/**
 * THE one split of a line into words and separators. The renderer
 * (TappableLine) and the lookup below MUST use the same one, or the token index
 * the renderer hands in points at a different word here. The capture group keeps
 * the separators, so odd indices are whitespace or a dash.
 */
export const TOKEN_SPLIT = /(\s+|[—–])/

/** Whitespace AND dashes are separators, not words — never pressable. */
export function isSeparator(token) {
  return /^(\s+|[—–])$/.test(token)
}

/**
 * @param {object} args
 * @param {string} args.token       the word as it appears (punctuation and all)
 * @param {string} [args.lineHmong] the whole line it sits in
 * @param {number} [args.tokenIndex] its index in `lineHmong.split(TOKEN_SPLIT)`
 * @param {object|null} [args.story] a story (its glossary is checked first), or
 *   null — the path reading has no glossary, so the dictionary answers.
 * @returns {{ entry: object|null, parts: Array|null }}
 *   `entry` null means "no entry yet" — the sheet still opens.
 */
export function defineToken({ token, lineHmong = '', tokenIndex = -1, story = null, means = null }) {
  // ── THE LINE'S OWN PIN — 2026-09-26 ───────────────────────────────────
  // `means` is the sentence's map of word → vocabulary id(s), e.g.
  // { yog: 'yog-to-be-is' }. A word that appears twice with two meanings is
  // pinned per occurrence: { 'yog#1': 'conjunctions-if-short', 'yog#2': … }.
  // A pinned word skips the phrase match below — the author has said what
  // this word means here, and that beats any guess from its neighbours.
  // See the ONE HEADWORD note in src/lib/wordLookup.js.
  const pin = pinFor(means, token, lineHmong, tokenIndex)
  if (pin) {
    const pinned = lookupWord(token, story, { pin })
    if (pinned?.pinned) return { entry: pinned, parts: null }
  }

  // ── TIER 0: THE PHRASE THE TAPPED WORD IS STANDING IN ─────────────────
  //
  // `hnub tim` is one phrase meaning "the date". Tapping `hnub` answered
  // "day" — a true fact about the word and the wrong answer about the page,
  // because the reader is looking at a date, not at a day.
  //
  // ⚠️ THIS IS NOT THE `tus xov` BUG RETURNING. That was tier 3 answering a
  // word with ANY glossary phrase CONTAINING it, from anywhere in the story —
  // `tus` got "thread" because the letters `tus` sit inside "tus xov". This
  // matches on POSITION: the words either side of the tap must be the
  // phrase's own words, in order, in that line. `tus` in "nws lub xov"
  // matches nothing; `tus` in "tus kas" matches, because it is standing in it.
  //
  // ⚠️ AND IT NEVER HIDES THE WORD'S OWN MEANING — a phrase hit always
  // renders the word-by-word breakdown underneath. That is the condition
  // that makes preferring the phrase safe; without it this is the old bug
  // with better aim.
  let entry = null
  if (lineHmong && tokenIndex >= 0) {
    // The same split the renderer used, so the indices line up exactly.
    const toks = lineHmong.split(TOKEN_SPLIT)
    const wordAt = []
    let n = 0
    toks.forEach((t, i) => {
      if (!t || isSeparator(t)) { wordAt[i] = -1; return }
      wordAt[i] = n++
    })
    const words = toks.filter((t) => t && !isSeparator(t))
    const here = wordAt[tokenIndex]
    // Longest first, so the author's long legal terms win over their heads.
    outer:
    for (let len = Math.min(6, words.length); len >= 2 && here >= 0; len--) {
      for (let start = Math.max(0, here - len + 1); start <= here; start++) {
        if (start + len > words.length) continue
        const phrase = words.slice(start, start + len).map(normalizeWord).filter(Boolean).join(' ')
        if (!phrase) continue
        const hit = lookupWord(phrase, story)
        // ⚠️ THE EQUALITY TEST IS THE WHOLE GUARD. lookupWord will happily
        // answer a phrase with a LONGER phrase containing it, and accepting
        // that puts us back where tus/tus xov started. Only an entry whose
        // own headword IS this exact phrase counts.
        // The comparison ignores spaces (2026-09-26), so "tiam sis" in the text
        // may land on the joined entry `tiamsis` — the same word, spelled solid.
        // Was: normalizeWord(hit.hmong) === phrase
        if (hit && normalizeWord(hit.hmong).replace(/\s+/g, '') === phrase.replace(/\s+/g, '')) { entry = hit; break outer }
      }
    }
  }
  if (!entry) entry = lookupWord(token, story)

  // If the answer is a PHRASE, break it into its words. Otherwise the sheet
  // names the phrase and never says what the tapped word contributes:
  // tapping `hnub` answered "hnub tim — the date" and left `hnub` itself
  // (day) and `tim` (at, over at) unreachable without tapping elsewhere.
  //
  // ⚠️ COMPUTED HERE, NOT IN THE SHEET. Resolving the parts needs `story`,
  // because tier 1 is the story's own glossary, and the sheet is a pure
  // renderer that never receives it.
  let parts = null
  if (entry?.hmong && /\s/.test(entry.hmong.trim())) {
    parts = entry.hmong.trim().split(/\s+/).map((w) => {
      const sub = lookupWord(w, story)
      // ⚠️ DROP A PART THAT RESOLVES BACK TO THE PHRASE. Tier 3 answers a
      // word with "a glossary phrase containing it", so `hnub` inside
      // "hnub tim" would list "hnub tim" as its own definition — the
      // phrase explaining itself, once per word.
      if (!sub || sub.hmong === entry.hmong) return { hmong: w, english: null }
      return { hmong: w, english: sub.english }
    })
    // Nothing is gained if not one part could be defined.
    if (!parts.some((x) => x.english)) parts = null
  }
  return { entry, parts }
}

/**
 * The vocabulary id(s) this line pins for the tapped word, or null.
 * `word#n` (the n-th time the word appears in the line, from 1) beats a plain
 * `word` key, so one sentence can use `yog` twice with two meanings.
 */
export function pinFor(means, token, lineHmong = '', tokenIndex = -1) {
  if (!means) return null
  const w = normalizeWord(token)
  if (!w) return null
  if (lineHmong && tokenIndex >= 0) {
    const toks = lineHmong.split(TOKEN_SPLIT)
    let occurrence = 0
    for (let i = 0; i <= tokenIndex && i < toks.length; i++) {
      if (toks[i] && !isSeparator(toks[i]) && normalizeWord(toks[i]) === w) occurrence++
    }
    if (means[`${w}#${occurrence}`]) return means[`${w}#${occurrence}`]
  }
  return means[w] || null
}
