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
// Every vocabulary entry by id — a definition only stores ids, and the pinned
// answer needs the pinned id's own category and example (see answerFrom).
const entryById = new Map()
for (const category of categories) {
  for (const word of category.words) {
    entryById.set(word.id, word)
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
      addDefinitions(dictionary.get(key).definitions, glosses, word)
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
        definitions: addDefinitions([], glosses, word),
      })
    }
  }
}

// ── ONE HEADWORD, NUMBERED DEFINITIONS — 2026-09-26 ──────────────────────────
//
// ⚠️ THE PROBLEM: `yog` has two vocabulary entries — "if" (conjunctions) and
// "to be" (its own deck) — and a tap glued them into "if · to be / equals", with
// "if" first only because conjunctions sits earlier in vocabulary.js. The app
// could not say which one THIS sentence means, and the author read it as wrong.
//
// So the dictionary groups a headword's entries into numbered DEFINITIONS, like
// a printed dictionary, and each definition remembers which vocabulary ids it
// came from. A story line can then PIN the one it means:
//
//   { hmong: 'Nws yog Yaj, …', english: '…', means: { yog: 'yog-to-be-is' } }
//
// ⚠️ THE CARDS ARE NOT MERGED, only the dictionary view. Decks need their own
// entries (a conjunctions quiz must never ask "yog = to be?" — the leak
// senses.js exists to stop), and the notebook and progress are keyed on entry
// ids. A definition points back at its ids, so Save still saves a real card.
//
// ⚠️ PIN BY ENTRY ID, NEVER BY NUMBER. The numbers follow category order, so a
// new entry can renumber them; an id never moves. scripts/check-sense-pins.mjs
// rejects a pin that is not one of the word's own ids.
//
// Guide: notes/2026-09-26-dictionary-headwords-and-sense-pins.md
//
// ⚠️ A PIN CAN NAME ONE SENSE OF A CARD: 'classifiers-tus@2'. Some cards carry
// several senses themselves (`tus`: people/animals · long objects · "the one"),
// and the id alone would light all three. `at[id]` is the sense's 1-based
// position in that card's senses list (allSenses order).
function addDefinitions(defs, glosses, word) {
  glosses.forEach((en, i) => {
    const same = defs.find((d) => sameMeaning(d.en, en))
    if (same) {
      if (!same.ids.includes(word.id)) { same.ids.push(word.id); same.at[word.id] = i + 1 }
      // Keep the FULLER wording of the two: "begin; start · beginning — thaum
      // pib" says more than "start; begin".
      // On a tie in items, the plain wording beats a "(pronoun: …)" wrapper.
      if (fullness(en) > fullness(same.en)) same.en = en
    } else {
      defs.push({ en, ids: [word.id], at: { [word.id]: i + 1 } })
    }
  })
  return defs
}

// ── SAME MEANING, DIFFERENT WORDING — 2026-09-26 ─────────────────────────────
// Decks were written separately, so one meaning often arrives twice: `kuv` is
// "(pronoun: I, me)" on the relatives card and "I / me" on the pronouns card;
// `pib` is "start; begin" and "begin; start · beginning; start — …". Shown as
// definitions 1 and 2, that is the "repetitive entries" the author saw.
//
// The CORE of a gloss is compared, not its full text: the part before any " — "
// explanation, with a "(verb: …)"-style wrapper and a leading "to " removed,
// split into items on ; , / ·. Same items → same meaning. One set inside the
// other → same meaning too, but only when the smaller has 2+ items, so a bare
// "one" never swallows a longer, different definition.
// Display-only: the cards themselves are untouched.
function coreItems(gloss) {
  const head = String(gloss).split(' — ')[0]
    .replace(/^\(([a-z ]+):\s*(.*)\)$/i, '$2')
    .toLowerCase()
  return new Set(head.split(/[;,/·]/).map((s) => s.trim().replace(/^to /, '').replace(/[.()]/g, '').trim()).filter(Boolean))
}
function fullness(gloss) {
  return coreItems(gloss).size * 10000 + (String(gloss).startsWith('(') ? 0 : 5000) + String(gloss).length
}
function sameMeaning(a, b) {
  if (a.toLowerCase() === b.toLowerCase()) return true
  const A = coreItems(a), B = coreItems(b)
  if (!A.size || !B.size) return false
  const [small, big] = A.size <= B.size ? [A, B] : [B, A]
  const inside = [...small].every((x) => big.has(x))
  return inside && (small.size === big.size || small.size >= 2)
}

// ── SPACED ↔ JOINED SPELLINGS — 2026-09-26 ───────────────────────────────────
// `tiamsis` is one entry (merged 2026-09-20: the spaced form is the same word),
// but stories write "tiam sis". Every multi-word headword is also reachable by
// its joined spelling, and a spaced phrase falls back to its joined one. Exact
// spellings always win — this is only consulted when they miss.
const joinedIndex = new Map()
for (const [key, entry] of dictionary) {
  if (!/\s/.test(key)) continue
  const j = key.replace(/\s+/g, '')
  if (!dictionary.has(j) && !joinedIndex.has(j)) joinedIndex.set(j, entry)
}

/** The dictionary entry for a word, trying its spaced/joined spelling too. */
function dictionaryEntry(word) {
  return dictionary.get(word)
    || joinedIndex.get(word)
    || (/\s/.test(word) ? dictionary.get(word.replace(/\s+/g, '')) : undefined)
    || null
}

/**
 * The tier-2 answer for a dictionary entry, with its numbered definitions.
 * `pin` (an entry id or ids) marks the definitions THIS sentence means; the
 * answer then takes the pinned entry's id, category and example, so Save and
 * "Open in dictionary" land on the right card, not the headword's first one.
 */
function answerFrom(entry, pin) {
  // 'classifiers-tus@2' → id + sense 2 of that card; a bare id lights every
  // definition that card contributed.
  const pins = (pin ? [].concat(pin) : []).map((p) => {
    const [id, n] = String(p).split('@')
    return { id, n: n ? Number(n) : null }
  })
  const hits = (d) => pins.some((p) => d.ids.includes(p.id) && (p.n == null || d.at?.[p.id] === p.n))
  const definitions = entry.definitions.map((d, i) => ({ ...d, n: i + 1, pinned: hits(d) }))
  const pinned = definitions.filter((d) => d.pinned)
  if (pinned.length) {
    const id = pins.map((p) => p.id).find((x) => pinned[0].ids.includes(x))
    const card = entryById.get(id)
    return {
      ...entry,
      id,
      category: card?.category || entry.category,
      example: card?.exampleSentence || entry.example,
      english: pinned.map((d) => d.en).join(' · '),
      definitions,
      pinned: true,
      source: 'dictionary',
    }
  }
  // Several senses → show them all rather than silently picking one. Order is
  // category order, which is arbitrary, so the join is deliberately neutral:
  // it presents alternatives instead of ranking them.
  // ⚠️ FROM THE FOLDED DEFINITIONS since 2026-09-27, not the raw `senses`: kuv read
  // "(pronoun: I, me) · I / me" — the same meaning twice — everywhere a one-line gloss
  // is shown (the sentence builder's "Words in this sentence", word-by-word rows).
  // Was: entry.senses && entry.senses.length > 1 ? entry.senses.join(' · ') : entry.english
  const english = definitions.length > 1
    ? definitions.map((d) => d.en).join(' · ')
    : definitions.length === 1 ? definitions[0].en : entry.english
  return { ...entry, english, definitions, source: 'dictionary' }
}

/**
 * A story-glossary answer, plus the DICTIONARY's entry for the same headword
 * when one exists — 2026-09-26 (author: "if there is a dictionary entry for a
 * glossary when tapped, the user would be able to see it, only if it exists").
 *
 * ⚠️ THE GLOSSARY STILL LEADS. The author wrote it for this text, so it stays
 * the answer; the dictionary rides along as `dictionary` and the sheet shows it
 * underneath with Save and "Open in dictionary". A glossary hit has no card id
 * of its own, so before this it could not link or save at all.
 *
 * ⚠️ ONLY THE SAME HEADWORD (spaced/joined spelling allowed). The tapped word
 * inside a glossed phrase is NOT enough — that is the tus/tus xov mistake. No
 * entry → no `dictionary` key → nothing extra shown.
 */
function withDictionary(answer) {
  const entry = dictionaryEntry(normalizeWord(answer.hmong))
  return entry ? { ...answer, dictionary: answerFrom(entry, null) } : answer
}

/**
 * The headword for a word: its numbered definitions, each with the vocabulary
 * ids it came from. For the word page ("other meanings") and the pin checker.
 * Returns null when the dictionary does not know the word.
 */
export function headwordOf(raw) {
  const entry = dictionaryEntry(normalizeWord(raw))
  return entry ? answerFrom(entry, null) : null
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
export function lookupWord(raw, story, { pin = null } = {}) {
  const word = normalizeWord(raw)
  if (!word) return null

  const glossary = story?.glossary || []

  // ── Tier 0: a PINNED sense — 2026-09-26 ─────────────────────────────────
  // The line itself says which definition it means (`means` on the sentence,
  // resolved by defineToken). That is more specific than anything else here —
  // more than the story's glossary, which speaks for the whole text — so it
  // goes first. A pin that matches none of the word's ids falls through to the
  // normal tiers rather than showing nothing; the checker reports it.
  if (pin) {
    const pinnedEntry = dictionaryEntry(word)
    if (pinnedEntry) {
      const answer = answerFrom(pinnedEntry, pin)
      if (answer.pinned) return answer
    }
  }

  // ── Tier 1: the story's glossary, exact ─────────────────────────────────
  const exact = glossary.find((g) => normalizeWord(g.hmong) === word)
  if (exact) {
    // + `dictionary` (2026-09-26): the dictionary's entry for the same word,
    // when there is one — see withDictionary().
    return withDictionary({ hmong: exact.hmong, english: exact.english, source: 'glossary' })
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
  // Was: dictionary.get(word) — now also finds spaced/joined spellings.
  const entry = dictionaryEntry(word)
  if (entry) {
    // ⚠️ A SENSE THAT IS RIGHT FOR *THIS STORY* BELONGS IN THE STORY'S OWN
    // GLOSSARY, which is tier 1 and outranks this. That is the mechanism for
    // "in this text, `rau` means to/for" — not a reordering of the dictionary.
    // For "in THIS LINE", pin it (tier 0 above). The join itself moved into
    // answerFrom(), unchanged.
    return answerFrom(entry, null)
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
    return withDictionary({ hmong: inPhrase.hmong, english: inPhrase.english, source: 'phrase' })
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
