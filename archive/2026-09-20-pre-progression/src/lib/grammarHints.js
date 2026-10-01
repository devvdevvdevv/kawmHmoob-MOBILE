import { tagOf } from './partsOfSpeech.js'

// WHY THE ANSWER WAS WRONG — the two word-order rules an English speaker breaks
// first, detected from what the learner actually built.
//
// A hint fires only when BOTH are true:
//   1. the answer puts word A before word B, and
//   2. the learner put B before A.
//
// That second condition is what keeps this honest. It isn't "you used an
// adjective, here's the adjective rule" — it's "you moved this specific
// adjective in front of this specific noun, which is the English order". The
// answer itself is the ground truth, so the hint can't contradict the sentence.
//
// Rules are checked in order; the first match wins. One hint at a time — a wall
// of grammar after a wrong answer is how people stop reading grammar.

const RULES = [
  {
    id: 'classifier-before-noun',
    before: 'classifier',
    after: 'noun',
    title: 'Classifiers come before the noun',
    // Filled with the learner's own words by `describe` below.
    body: (a, b) =>
      `A classifier introduces its noun, so it sits in FRONT of it: “${a} ${b}”, never “${b} ${a}”. ` +
      `Hmong marks almost every counted noun this way — the classifier tells you what KIND of thing is coming ` +
      `(tus for people and animals, lub for round or bulky objects, daim for flat ones).`,
    lessonHref: '/learn/grammar/foundations-noun-classifiers',
    lessonLabel: 'Noun classifiers lesson',
  },
  {
    id: 'adjective-after-noun',
    before: 'noun',
    after: 'adjective',
    title: 'Describing words come after the noun',
    body: (a, b) =>
      `English puts the describing word first — “${b} ${a}”. Hmong puts it LAST: “${a} ${b}”, ` +
      `literally “${a}, ${b}”. The noun is named first, then described. ` +
      `The same order holds for a whole string of them, so the describing words pile up at the END of the phrase.`,
    lessonHref: '/learn/grammar/grammar-adjectives',
    lessonLabel: 'Adjectives lesson',
  },
]

// Index of the first chip whose text matches, or -1. First occurrence is fine:
// the pairs we compare are a tagged word and a DIFFERENT tagged word, so a
// repeated token can't make the two indices collide.
function positionIn(list, text) {
  return list.findIndex((c) => c.text.toLowerCase() === text.toLowerCase())
}

export function grammarHint(placed, exercise) {
  if (!placed?.length || !exercise?.tokens?.length) return null
  const tokens = exercise.tokens

  for (const rule of RULES) {
    for (let i = 0; i < tokens.length; i++) {
      if (tagOf(tokens[i]) !== rule.before) continue

      for (let j = i + 1; j < tokens.length; j++) {
        if (tagOf(tokens[j]) !== rule.after) continue

        // The answer says tokens[i] then tokens[j]. What did they build?
        const posA = positionIn(placed, tokens[i])
        const posB = positionIn(placed, tokens[j])
        if (posA === -1 || posB === -1) continue
        if (posB < posA) {
          return {
            id: rule.id,
            title: rule.title,
            body: rule.body(tokens[i], tokens[j]),
            lessonHref: rule.lessonHref,
            lessonLabel: rule.lessonLabel,
            words: [tokens[i], tokens[j]],
          }
        }
      }
    }
  }
  return null
}
