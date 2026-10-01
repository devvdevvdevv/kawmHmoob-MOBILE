// WHICH VOCABULARY SETS ARE FREE — one list, read by every surface that opens
// a set: the category screen, a word's screen, the theme/search rows, the
// generated `vocab-<id>` quizzes, and the sentence builder.
//
// ⚠️ THE AUTHOR'S RULING, 2026-09-25: the essentials are free, everything else
// is Pro. "greetings, pronouns, classifiers, vocab, and adjectives".
//   • "vocab" was read as VERBS — the fourth member of the grammar core the
//     path now leads with (notes/2026-09-25-interrogatives-and-grammar-first-path.md).
//   • "adjectives" is `descriptions` — the set the Adjectives lesson teaches
//     (grammar-adjectives has `vocab: 'descriptions'`).
// Change either reading here and every surface follows.
//
// ⚠️ PLAIN JS, NO IMPORTS. quizzes.js and sentenceBuilder.js load this, and both
// are loaded by plain-Node check scripts.
//
// ⚠️ WHAT THIS DOES NOT LOCK — on purpose:
//   • A single WORD's page (app/vocabulary/[categoryId]/[wordId].jsx) — free
//     since 2026-09-26: definitions are free, study decks are Pro.
//   • The reader's long-press lookup (lib/wordLookup.js) reads vocabulary.js
//     directly. Locking it would make every story unreadable for free users.
//   • The beginner path. A path unit has its own `free` flag (path.js) and its
//     own screens; a free unit stays fully usable even where it borrows a
//     locked category (Greetings uses politeness + introductions).
//   • Learn lessons' prose. Only a lesson's generated vocab quiz is gated.
//
// ⚠️ WIDENED 2026-09-25, same day — the author: "NO PAYWALL for PRONOUNS or the
// basics … we need the fundamentals to always be free." The first list left
// `yog-to-be` locked inside the free You & Me unit, and conjunctions and
// question-words locked behind their own grammar lessons' quizzes. The rule
// now: the whole GRAMMAR CORE and the greeting basics are free, always.
// Was: greetings, pronouns, classifiers, verbs, descriptions.
// ⚠️ SUPERSEDED 2026-09-28 — the author: "ensure the paywall is on the majority of the vocab" and
// "users MUST be pro in order to continue down the paths". This was the "fundamentals always free"
// list (the whole grammar core). Kept as the record; TO RESTORE, export this one as FREE_CATEGORY_IDS.
const FREE_CATEGORY_IDS_BEFORE = new Set([
  // Greeting basics — the first exchange.
  'greetings',
  'politeness',
  'introductions',
  // The grammar core: the whole `grammar-words` theme, plus conjunctions.
  'pronouns',
  'yog-to-be',
  'demonstratives',
  'classifiers',
  'verbs',
  'tense-markers',
  'question-words',
  'conjunctions',
  'reciprocals',
  'grammar',
  // Added 2026-09-25 with path units 9, 10 and 12 — grammar, so never Pro.
  'locations-prepositions',
  'quantifiers',
  'discourse-particles',
  // Added 2026-09-26 — Bisang (1993) measure/group words; grammar, so free.
  'measure-words',
  // Added 2026-09-26 with path unit u-negation — grammar, so free.
  'negation',
  // Added 2026-09-27 with path unit u-possession — grammar, so free.
  'possession',
  // Added 2026-09-27 with path units u-hu-ua and u-adjectives — grammar, so free.
  'names',
  'adjective-grammar',
  // Added 2026-09-27 with u-answers and u-rau — grammar, so free.
  'answering',
  'rau-uses',
  // Added 2026-09-28 with u-noun-purpose — grammar, so free.
  'noun-purpose',
  // Added 2026-09-28 with u-so-then — grammar, so free.
  'so-then',
  // Added 2026-09-28 with u-common-nouns — it sits in the free core, right after Classifiers.
  'common-nouns',
  // Added 2026-09-28 — Bisang's full classifier inventory, a grammar reference set.
  'classifier-inventory',
  // Added 2026-09-26 with path unit u-tau — grammar, so free.
  'tau-uses',
  'tau-examples',  // the u-tau examples set, 2026-09-26
  // Adjectives.
  'descriptions',
])

// The free sets now match the free PATH: the first seven units (path.js FREE_PATH_UNITS) — Greetings
// (greetings, politeness, introductions), You & Me (pronouns), Classifiers, Common Nouns. Every other
// set is Pro, so the Words tab cannot be a way round the paid path.
export const FREE_CATEGORY_IDS = new Set([
  'greetings',
  'politeness',
  'introductions',
  'pronouns',
  'classifiers',
  'common-nouns',
  // Units 5–7 free too (author: "make the first 7 free", 2026-09-28): Core Verbs, How a Sentence
  // Is Built, Verb + Noun (its pairs are in verbs).
  'verbs',
  'sentence-structure',

  // ── ALWAYS FREE, named individually by the author 2026-09-30 ──────────────
  //
  // ⚠️ THESE BREAK THE "FIRST SEVEN UNITS" RULE ABOVE, deliberately. The 09-28
  // list was derived from path position; this one is not derived from anything
  // — it is an explicit set the author picked by name. So it cannot be
  // recomputed from `order`, and anyone tidying this file by "just using the
  // path order" would silently re-lock every line below.
  //
  // Listed with the titles the author used, because the ids do not resemble
  // them and the next person to check this will be reading a screen, not an id.
  'conjunctions',          // High-Frequency Conjunctions
  'descriptions',          // Common Descriptions
  'family-male-perspective',   // Tsev Neeg — Family (Male Speaker)
  'family-female-perspective', // Tsev Neeg — Family (Female Speaker)
  'numbers',               // Numbers
  'timeframes-days',       // Days & Frequency
  'food',                  // Food
  'animals',               // Animals 1
  'clothing',              // Clothing 1
  'human-anatomy-face',    // Head & Face
  'household-rooms',       // Hauv Lub Tsev — Rooms of the House
  'countries',             // Countries 1
])

// ⚠️ TSEV NEEG IS TWO SETS, and the author named it once. Family is split by
// SPEAKER PERSPECTIVE — the male-speaker and female-speaker sets are the same
// lesson taught from two sides, and Hmong kinship terms genuinely differ
// between them. Freeing only one would hand half the learners a locked set for
// the relationship words they actually use, so both are free.
//
// `relatives` (Cov Txheeb Ze — Relatives & Extended Family) is a DIFFERENT and
// much larger set, and was not named. It stays Pro.
//
// ⚠️ "Animals 1", "Clothing 1" and "Countries 1" are the FIRST set of a split
// series — `animals-2`/`animals-3`, `clothing-2`, `countries-2`/`countries-3`
// all exist and stay Pro. That matches the titles the author gave, which carry
// the "1" explicitly.
void FREE_CATEGORY_IDS_BEFORE

export function isCategoryFree(categoryId) {
  return FREE_CATEGORY_IDS.has(categoryId)
}

/** Can this learner open this set? */
export function canOpenCategory(categoryId, isPro) {
  return Boolean(isPro) || isCategoryFree(categoryId)
}
