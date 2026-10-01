import { categories } from '../data/vocabulary.js'
import { allSenses } from './senses.js'

// WORD LOOKUP — "what does this word mean?", answered from what the app already
// knows.
//
// Used by the reader: long-press a Hmong word in a story and this decides what
// the definition modal shows.
//
// ⚠️ THREE TIERS, IN THIS ORDER, AND THE ORDER IS THE DESIGN:
//
//   1. The story's own glossary, exact match      — the author wrote it FOR this text
//   2. The general vocabulary, exact match        — the dictionary
//   3. A glossary PHRASE containing the word      — 'zos' finds 'lub zos'
//   4. A DICTIONARY compound containing the word  — 'kis' finds 'tag kis'
//
// ⚠️ 2 AND 3 SWAPPED ON 2026-09-13. An EXACT match must beat a PARTIAL one; see
// the note at tier 2 for the "every tus means tus xov" bug this fixes.
//
// Tier 2 exists because glossaries hold phrases and taps hit single words. The
// story glosses 'lub zos' and 'poj niam zoo nkauj'; a learner tapping 'zos' or
// 'nkauj' should not be told there is no entry when the author glossed exactly
// that thing one level up.
//
// ⚠️ Coverage is partial and always will be. Of the 23 distinct words in the
// first story, 16 are in the vocabulary. The honest answer for the rest is "no
// entry yet" — not a guess, and not silence.

/**
 * Strip a token down to something matchable.
 *
 * ⚠️ Punctuation is the whole reason this exists. The text contains
 * 'zos.' and '"Koj' — raw, neither matches anything. Tone markers are the FINAL
 * CONSONANT in Hmong RPA (nyob zoo, ua tsaug) and carry meaning, so they must
 * never be stripped: only edge punctuation and quotes come off.
 */
export function normalizeWord(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/^[^\p{L}]+/u, '')   // leading quotes, brackets, dashes
    .replace(/[^\p{L}]+$/u, '')   // trailing commas, stops, question marks
    .trim()
}

// Build the dictionary index ONCE at module load, not per lookup. 524 words
// scanned on every long-press would be wasteful; a Map is a direct hit.
const dictionary = new Map()
for (const category of categories) {
  for (const word of category.words) {
    const key = normalizeWord(word.hmongRPA)
    // ⚠️ EVERY SENSE IS KEPT — 2026-09-13. "First writer wins" used to mean the
    // other senses were DISCARDED, and which one survived was decided by the
    // order categories happen to sit in this file.
    //
    // `rau` is the case that exposed it: it has an entry in `wear-verbs` ("to
    // put on footwear") and another in `numbers` ("six"). wear-verbs is earlier,
    // so a learner tapping `rau` in "muab rau kuv" was told it means putting on
    // shoes. Not a wrong definition — a wrong SENSE, chosen by array position.
    //
    // The first entry still wins for identity (`id`, `category`, `example`) so
    // the notebook keeps saving the same word it always did; the rest are
    // collected in `senses` and shown together.
    // ⚠️ THE READER WANTS EVERY SENSE, the flashcard wants only its own. An
    // entry that crosses domains carries a tagged `senses` array; `english` on
    // that entry is deliberately the narrower, in-category gloss. Reading only
    // `english` here would therefore LOSE the out-of-domain senses from the
    // tap — the exact opposite of the flashcard bug, and much harder to see.
    // See src/lib/senses.js.
    const glosses = allSenses(word)

    if (key && dictionary.has(key)) {
      // ⚠️ DEDUPE ON THE TEXT. Two entries can legitimately exist in
      // different categories and say the same thing — `tub` is "son" twice —
      // and joining those gives "son · son", which reads as a bug.
      const senses = dictionary.get(key).senses
      for (const g of glosses) if (!senses.includes(g)) senses.push(g)
    } else if (key) {
      dictionary.set(key, {
        // ⚠️ THE VOCABULARY ID — and ONLY tier 3 entries have one. The notebook
        // keys on it (NotebookContext.saveWord) and resolves it back through
        // vocabulary.js, silently DROPPING ids it cannot find. A glossary or
        // phrase entry has no id, so it must never offer a Save: the word would
        // look saved and then simply not be in the notebook.
        id: word.id,
        hmong: word.hmongRPA,
        english: word.english,
        category: word.category,
        example: word.exampleSentence || null,
        senses: [...glosses],
      })
    }
  }
}

// ── PART-OF-A-COMPOUND INDEX ────────────────────────────────────────────────
//
// ⚠️ THE PROBLEM IT SOLVES: Hmong is full of two-word compounds, and a tap lands
// on ONE of the two. `kis` means nothing alone — "tag kis" means morning — so a
// learner tapping `kis` got "no entry for this word yet" while the dictionary
// sat there holding "tag kis".
//
// This maps every WORD of a multi-word entry back to that entry, so the tap can
// find the compound it belongs to.
//
// ⚠️ WHOLE TOKENS, NEVER SUBSTRINGS. The entry is split on whitespace and each
// piece indexed exactly. A substring match would have `ua` hitting "nkauj" and
// `si` hitting "sim", which is how this kind of fallback usually goes wrong.
//
// ⚠️ IT RANKS BELOW EVERY EXACT MATCH, and that ordering is what makes it safe.
// `li` has its own entry, so tapping `li` never reaches this index and never
// gets dragged into "li cas?". Only a word that NOTHING can define on its own
// gets here — which is exactly the set this is for.
//
// ⚠️ A TOKEN CAN BELONG TO SEVERAL COMPOUNDS. They are all collected and shown,
// for the same reason the senses are: picking one by index order is an accident
// pretending to be a decision.
const insideCompound = new Map()
for (const [key, entry] of dictionary) {
  const parts = key.split(/\s+/)
  if (parts.length < 2) continue // single words are already exact-matchable
  for (const part of parts) {
    if (!part || dictionary.has(part)) continue // an exact entry always wins
    if (!insideCompound.has(part)) insideCompound.set(part, [])
    insideCompound.get(part).push(entry)
  }
}

/** How many words the dictionary can define. For an honest count in the UI. */
export const DICTIONARY_SIZE = dictionary.size

/**
 * Look one word up.
 *
 * @param  {string} raw    the tapped token, punctuation and all
 * @param  {object} story  the story being read — its glossary is checked first
 * @returns {{hmong, english, source, id?, category?, example?} | null}
 *           `id` is present ONLY on a tier-3 (dictionary) hit — it is what the
 *           notebook can save. Tiers 1 and 2 are story text, not vocabulary.
 */
export function lookupWord(raw, story) {
  const word = normalizeWord(raw)
  if (!word) return null

  const glossary = story?.glossary || []

  // ── Tier 1: the story's glossary, exact ─────────────────────────────────
  const exact = glossary.find((g) => normalizeWord(g.hmong) === word)
  if (exact) {
    return { hmong: exact.hmong, english: exact.english, source: 'glossary' }
  }

  // ── Tier 2: the general vocabulary ──────────────────────────────────────
  //
  // ⚠️ THIS USED TO BE TIER 3, BELOW THE PHRASE FALLBACK — reordered 2026-09-13,
  // and the old order was the bug behind "every tus means tus xov".
  //
  // A phrase match is a PARTIAL match: the tapped word merely appears inside a
  // glossed phrase. A dictionary hit is an EXACT match for the word itself. The
  // partial one was winning, so in a story that glosses "tus xov" (thread),
  // tapping the classifier `tus` answered "string, thread, cord" — and tapping
  // `lub` answered "lock", because the story glosses "lub xauv".
  //
  // Those are the most common words on the page, so the reader was most
  // confidently wrong about the words a learner presses most.
  //
  // An exact match beating a partial one is the general rule; the phrase
  // fallback below is still valuable, but only when nothing knows the word
  // itself.
  const entry = dictionary.get(word)
  if (entry) {
    // Several senses → show them all rather than silently picking one. Order is
    // category order, which is arbitrary, so the join is deliberately neutral:
    // it presents alternatives instead of ranking them.
    //
    // ⚠️ A SENSE THAT IS RIGHT FOR *THIS STORY* BELONGS IN THE STORY'S OWN
    // GLOSSARY, which is tier 1 and outranks this. That is the mechanism for
    // "in this text, `rau` means to/for" — not a reordering of the dictionary.
    const english = entry.senses && entry.senses.length > 1
      ? entry.senses.join(' · ')
      : entry.english
    return { ...entry, english, source: 'dictionary' }
  }

  // ── Tier 3: a glossary phrase CONTAINING this word ──────────────────────
  // Split each phrase into its own words and look for the tapped one, rather
  // than a substring test — 'ua' must not match inside 'nkauj', and
  // .includes() on the raw string would do exactly that.
  //
  // Last resort: nothing knows this word on its own, but the author glossed a
  // phrase it sits in. "zos" finding "lub zos" is a real answer; it only became
  // a problem when it outranked the dictionary.
  const inPhrase = glossary.find((g) =>
    String(g.hmong).split(/\s+/).map(normalizeWord).includes(word)
  )
  if (inPhrase) {
    return { hmong: inPhrase.hmong, english: inPhrase.english, source: 'phrase' }
  }

  // ── Tier 4: a DICTIONARY compound containing this word ──────────────────
  //
  // The same idea as tier 3, but against the whole dictionary rather than one
  // story's glossary — so "kis" finds "tag kis" in every text, not only in a
  // story whose author happened to gloss it.
  //
  // ⚠️ THE ANSWER IS THE COMPOUND, AND IT SAYS SO. `hmong` is set to the
  // compound, not to the tapped word, so the sheet shows "tag kis — morning"
  // rather than pretending `kis` means morning on its own. That distinction is
  // the entire point: the learner needs to see that the word they pressed is
  // half of something.
  //
  // ⚠️ NO `id`. These carry no vocabulary id deliberately — saving "kis" to the
  // notebook would save a fragment. The notebook already refuses entries
  // without an id (see the note where the dictionary is built).
  const compounds = insideCompound.get(word)
  if (compounds && compounds.length > 0) {
    // ⚠️ SHORTEST COMPOUND FIRST, and it is a real heuristic rather than a
    // tidy-up: the shortest is almost always the BASE the others are built on.
    // `kis` sits in "tag kis", "tag kis no" and "nag kis"; the word a learner
    // needs is "tag kis" (morning), and the other two are that plus something.
    // Showing all three as two parallel lists made the reader do the pairing.
    const ranked = [...compounds].sort(
      (a, b) => normalizeWord(a.hmong).split(/\s+/).length - normalizeWord(b.hmong).split(/\s+/).length
    )
    const [primary, ...rest] = ranked

    // The others are named but not glossed — enough to show the word turns up
    // elsewhere, without turning one definition into a paragraph.
    const also = rest.length > 0 ? ` (also in: ${rest.map((c) => c.hmong).join(', ')})` : ''

    return {
      // ⚠️ THE COMPOUND, NOT THE TAPPED WORD. The sheet must read "tag kis —
      // morning", never "kis — morning": the learner has to see that what they
      // pressed is half of something.
      hmong: primary.hmong,
      english: `${primary.english}${also}`,
      source: 'compound',
    }
  }

  // Nothing. The caller shows "no entry yet" — an honest miss beats a guess.
  return null
}
