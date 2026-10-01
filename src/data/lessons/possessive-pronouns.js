// Standalone lesson: possession in Hmong — my, mine, and li.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.
//
// ⚠️ REWRITTEN 2026-09-27 — the author: possession "should be its own lesson and path".
// Every rule and example below is the AUTHOR'S (typos in the message fixed: "kus" →
// kuv). The intro of path unit u-possession ("Mine & Yours"); word bank = the new
// `possession` set.
//   • Classifiers act as articles ("the") for their nouns.
//   • li is the general possessive indicator: pronoun + li = mine, yours… It can take
//     the place of classifier + noun, and it is not tied to any one noun.
//   • A classifier directly after the pronoun, with NO noun, is a possessive pronoun:
//     kuv phau = mine (a book). The classifier must be the right one for the noun.
//   • If the noun still follows (kuv phau ntawv), it is an ordinary possessive sentence
//     and there is no possessive pronoun. That long way is what is most commonly
//     written; the possessive indicators simplify, and are used (mostly in the first
//     person) depending on context.
// Ids (lesson + steps) unchanged — they are progress keys. vocab was 'pronouns'.

export const possessivePronouns = {
  id: 'foundations-possessive-pronouns',
  // Was: 'Possessive Pronouns' / 'How to say my, your, his, her, and our in Hmong.'
  title: 'Mine & Yours',
  summary: 'Kuv phau ntawv (my book), kuv phau (mine), kuv li (mine) — three ways to say whose it is.',
  vocab: 'possession',
  steps: [
    {
      id: 'foundations-possessive-pronouns-intro',
      kind: 'intro',
      title: 'How possession works',
      body: [
        'Hmong has no separate words for my, your or mine. The plain pronoun does the work, together with a classifier or the word li.',
        '## Classifiers work like “the”',
        'A classifier goes with its noun the way “the” goes with an English noun:',
        '> Phau ntawv — the book · Tus miv — the cat · Lub paj — the flower',
        '## My [noun]: pronoun + classifier + noun',
        'Put the owner in front: pronoun, then the classifier and the noun. The classifier matches the thing owned, not the owner.',
        '> Kuv phau ntawv — my book',
        '> Kuv tus miv — my cat',
        '> Nws lub paj — his / her / its flower',
        '## Mine: pronoun + li',
        'Li is the general possessive word. Pronoun + li means mine, yours, his… and it takes the place of the classifier and the noun. It is not tied to any one noun, so it fits anything.',
        '> Phau ntawv yog kuv li. — The book is mine.',
        '> kuv li — mine · koj li — yours · nws li — his / hers · peb li — ours',
        '## Mine, with the classifier: pronoun + classifier',
        'You can also say mine with the noun’s own classifier: when a classifier comes straight after the pronoun, with no noun after it, the classifier stands in for the noun. It must be the right classifier for that noun.',
        '> Phau ntawv yog kuv phau. — The book is mine.',
        'Li works for anything; the classifier also tells you what kind of thing it is.',
        '## The long way: keep the noun',
        'If the noun still follows the classifier, it is simply a sentence about whose it is. There is no possessive pronoun in it. This long way is what you will see written most often; kuv li and kuv phau are the shortcuts, used depending on the context.',
        '> Phau no yog kuv phau ntawv. — This one is my book. (“This book is mine.”)',
        '> Tus ntawd yog kuv tus miv. — That one is my cat.',
        '> Cov no yog kuv cov khoom. — These are my things.',
        '> Lub ntawd yog nws lub paj. — That one is his / her flower.',
        '## An easy way to remember',
        '> pronoun + classifier + noun → my [noun] (kuv phau ntawv)',
        '> pronoun + classifier → mine (kuv phau: a book)',
        '> pronoun + li → mine, for anything (kuv li)',
        '> classifier + noun → the [noun] (phau ntawv)',
        // Was (until 2026-09-27):
        //   'Hmong does not have separate possessive words like English "my" or "your". The plain pronoun is used, and possession is shown by word order instead.',
        //   'The everyday pattern is pronoun + classifier + noun:',
        //   '> Kuv lub tsev. — My house.',
        //   '> Koj tus aub. — Your dog.',
        //   'The classifier matches the noun being owned, not the owner — so it is "lub" for the house no matter whose house it is.',
      ],
    },
    {
      id: 'foundations-possessive-pronouns-examples',
      kind: 'examples',
      title: 'Three ways to say whose it is',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Kuv phau ntawv', english: 'my book', note: 'pronoun + classifier + noun' },
        { hmong: 'Kuv phau', english: 'mine (a book)', note: 'pronoun + classifier: the classifier stands in for the noun' },
        { hmong: 'Kuv li', english: 'mine', note: 'pronoun + li: for anything' },
        { hmong: 'Koj li', english: 'yours' },
        { hmong: 'Nws li', english: 'his / hers / its' },
        { hmong: 'Koj tus aub', english: 'your dog', note: 'the classifier matches the dog, not the owner' },
        { hmong: 'Lawv lub tsev', english: 'their house' },
        // Was (until 2026-09-27): Kuv / Koj / Nws / Peb / Lawv as "my / your / his / our / their",
        // with the recorded pronoun audio.
      ],
    },
    {
      // Added 2026-09-27 — the author's example sentences. New id.
      id: 'foundations-possessive-pronouns-sentences',
      kind: 'examples',
      title: 'In sentences',
      intro: 'The same book three ways, then the long way with other things.',
      items: [
        { hmong: 'Phau ntawv yog kuv li.', english: 'The book is mine.', note: 'li' },
        { hmong: 'Phau ntawv yog kuv phau.', english: 'The book is mine.', note: 'the classifier phau' },
        { hmong: 'Phau no yog kuv phau ntawv.', english: 'This one is my book.', note: 'the long way' },
        { hmong: 'Tus ntawd yog kuv tus miv.', english: 'That one is my cat.' },
        { hmong: 'Cov no yog kuv cov khoom.', english: 'These are my things.' },
        { hmong: 'Lub ntawd yog nws lub paj.', english: 'That one is his / her flower.' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-possessive-pronouns-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which word means "their"?',
      options: ['Lawv', 'Peb', 'Koj', 'Nws'],
      answer: 'Lawv',
    },*/
    {
      id: 'foundations-possessive-pronouns-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
