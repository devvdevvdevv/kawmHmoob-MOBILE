import { categories } from '../data/vocabulary.js'

// PART-OF-SPEECH TAGS for sentence-builder chips — classifier, noun, adjective.
//
// Not a parser. It's a LOOKUP built from the vocabulary itself: the app already
// sorts words into categories, and some of those categories ARE a part of speech
// ("Classifiers", "Colors", "Common Descriptions"). The tag is a fact the data
// already knows, not a guess about grammar.
//
// A wrong label here teaches a wrong rule — and this drill is the one place a
// learner is actively looking for structure — so the tagger REFUSES more than it
// guesses. Three ways a word ends up untagged:
//
//   1. It isn't in any source category (most words: verbs, adverbs, particles).
//   2. It's a function word. `kuv` is listed under `relatives` as
//      "(pronoun: I, me)", which would otherwise make it a NOUN. Any word that
//      also appears in a grammatical category is struck out.
//   3. It's ambiguous across two tags. `siab` is "tall" in `descriptions` and
//      "liver" in the anatomy list — a homograph, so it gets no label and never
//      triggers a grammar hint.
//
// MULTI-WORD ENTRIES ARE INDEXED WHOLE. "siab zoo" (kind) and "taub hau" (head)
// are single entries, and the sentence builder now hands them over as single
// chips (see lib/sentenceBuilder), so the key is the entire phrase. A bare "hau"
// still matches nothing, which is correct — it isn't a word on its own.

const SOURCES = [
  // The distinctive closed class — tus, lub, daim — and the reason most of the
  // word-order mistakes in this drill happen.
  ['classifier', ['classifiers']],
  ['adjective', ['colors', 'descriptions', 'personality-siab']],
  [
    'noun',
    [
      'animals', 'food', 'nature',
      'family-male-perspective', 'family-female-perspective', 'relatives',
      'clothing', 'tools-household', 'household-rooms', 'buildings',
      'places', 'housing',
      'human-anatomy-face', 'human-anatomy-upper-body',
      'human-anatomy-lower-body', 'human-anatomy-internal-organs',
    ],
  ],
]

// Categories that are grammar, not vocabulary. A word appearing in ANY of these
// is never labelled, whatever else it's listed under.
const FUNCTION_WORD_SOURCES = [
  'pronouns', 'demonstratives', 'tense-markers', 'question-words',
  'conjunctions', 'discourse-particles', 'yog-to-be', 'reciprocals',
  'quantifiers', 'grammar',
]

let index = null

// Every entry in a category, single words AND phrases, normalised for lookup.
// Phrases are kept whole ("siab zoo"), never split into their parts.
function entryKeys(categoryId) {
  const cat = categories.find((c) => c.id === categoryId)
  if (!cat) return []
  return cat.words
    .map((w) => (w.hmongRPA || '').trim().toLowerCase().replace(/\s+/g, ' '))
    .filter(Boolean)
}

function buildIndex() {
  const excluded = new Set(FUNCTION_WORD_SOURCES.flatMap(entryKeys))

  // First pass: collect every tag each word could take, so homographs are visible.
  const candidates = new Map() // key → Set(tag)
  for (const [tag, categoryIds] of SOURCES) {
    for (const id of categoryIds) {
      for (const key of entryKeys(id)) {
        if (excluded.has(key)) continue
        if (!candidates.has(key)) candidates.set(key, new Set())
        candidates.get(key).add(tag)
      }
    }
  }

  // Second pass: keep only the words exactly one tag claims.
  const map = new Map()
  for (const [key, tags] of candidates) {
    if (tags.size === 1) map.set(key, [...tags][0])
  }
  return map
}

export function tagOf(token) {
  if (!index) index = buildIndex()
  return index.get(String(token || '').trim().toLowerCase()) || null
}

// Chip styling per tag. Text stays stone-900 everywhere — the tint carries the
// category, the ink carries the word, so contrast never depends on the tag.
export const POS_STYLES = {
  classifier: {
    chip: 'bg-ocean-100 border-ocean-300',
    placed: 'bg-ocean-200 border-ocean-400',
    label: 'text-ocean-700',
    name: 'Classifier',
  },
  noun: {
    chip: 'bg-cream-200 border-cream-400',
    placed: 'bg-cream-300 border-cream-500',
    label: 'text-clay-700',
    name: 'Noun',
  },
  adjective: {
    chip: 'bg-blush-100 border-blush-300',
    placed: 'bg-blush-200 border-blush-400',
    label: 'text-blush-500',
    name: 'Adjective',
  },
}

export const POS_ORDER = ['classifier', 'noun', 'adjective']
