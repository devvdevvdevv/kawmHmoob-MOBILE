// ── SENSES BY CONTEXT ───────────────────────────────────────────────────────
//
// ⚠️ THE BUG THIS EXISTS FOR: a flashcard renders `word.english` verbatim. When
// a reviewed, multi-sense gloss was written onto a topical entry, the card
// started teaching meanings its category never promised — `txiv` on a FAMILY
// card read "father · husband · man · fruit". Correct as a dictionary line,
// wrong as a question about family.
//
// The reader tap wants every sense. The flashcard wants only the ones its deck
// is about. Both read the same entry, so the entry has to carry the difference.
//
//   english   what a card in THIS entry's own category shows. Always present.
//   senses    OPTIONAL. The full picture, each sense tagged with the domain it
//             belongs to. Only needed where a word crosses domains.
//
// An entry with no `senses` behaves exactly as it always has, which is why this
// could be added without touching 700+ untouched words.
//
//   { hmongRPA: 'txiv', category: 'family-male-perspective',
//     english: 'father · husband',
//     senses: [
//       { en: 'father',  context: 'family' },
//       { en: 'husband', context: 'family' },
//       { en: 'fruit',   context: 'food', note: 'in fruit names, "txiv lws suav"' },
//     ] }

// Several categories share one domain. The two family perspectives are the
// clearest case: `txiv` is father in both, so a sense tagged `family` has to
// show on a card from either. Anything unlisted is its own domain, which is
// the common case and needs no entry here.
const DOMAIN = {
  'family-male-perspective': 'family',
  'family-female-perspective': 'family',
  relatives: 'family',
  'human-anatomy-face': 'body',
  'human-anatomy-upper-body': 'body',
  'human-anatomy-lower-body': 'body',
  'human-anatomy-internal-organs': 'body',
  // ⚠️ THE FUNCTION-WORD CATEGORIES ARE **NOT** LUMPED INTO ONE 'grammar'
  // DOMAIN, though the first draft of this file did exactly that. They are
  // different decks asking different questions: a classifier card and a
  // conjunction card are no more interchangeable than a food card and a family
  // card. Merging them would have let `pob`'s sentence-final-particle sense
  // show on a CLASSIFIER card — the same leak this file exists to stop,
  // reintroduced one level up. Each stays its own domain by falling through.
  timeframes: 'time',
  'timeframes-days': 'time',
  'time-context': 'time',
  calendar: 'time',
  months: 'time',
  'days-of-week': 'time',
  'misc-phrases': 'reading',
  misc: 'reading',
  // ⚠️ THE READING GROUPS ARE ONE DOMAIN, NOT THIRTEEN — 2026-09-20. `misc` was
  // a single 300-word pile; it is now split by subject so it can be browsed. The
  // split is for READING, not for decks: a word tagged 'reading' must show on a
  // long-press from any of them, so they all map to the same domain. Give one of
  // them its own domain and its senses stop reaching the others.
  'reading-law': 'reading',
  'reading-body': 'reading',
  'reading-mind': 'reading',
  'reading-emotion': 'reading',
  'reading-speech': 'reading',
  'reading-motion': 'reading',
  'reading-people': 'reading',
  'reading-place': 'reading',
  'reading-time': 'reading',
  'reading-quantity': 'reading',
  'reading-work': 'reading',
  'reading-qualities': 'reading',
  'reading-general': 'reading',
}

/** The domain a category belongs to. Unlisted categories are their own domain. */
export function domainOf(categoryId) {
  return DOMAIN[categoryId] || categoryId
}

function render(sense) {
  return sense.note ? `${sense.en} — ${sense.note}` : sense.en
}

/**
 * The senses of `word` that belong in `domain`, as display strings.
 *
 * ⚠️ WHEN NOTHING MATCHES, FALL BACK TO `english` — never to the full sense
 * list. Falling back to everything would quietly re-create the leak this file
 * exists to stop, and it would do it precisely on the mis-tagged entries where
 * it is hardest to notice. `english` is by definition correct for this entry's
 * own category, so it is the safe floor.
 */
export function sensesFor(word, domain) {
  if (!Array.isArray(word.senses) || word.senses.length === 0) return [word.english]
  const inDomain = word.senses.filter((s) => s.context === domain)
  return inDomain.length ? inDomain.map(render) : [word.english]
}

/** Every sense a word has, ignoring domain — what a reader tap wants. */
export function allSenses(word) {
  if (!Array.isArray(word.senses) || word.senses.length === 0) return [word.english]
  return word.senses.map(render)
}

/** `sensesFor`, joined the way the app writes multiple senses everywhere else. */
export function glossFor(word, domain) {
  return sensesFor(word, domain).join(' · ')
}
