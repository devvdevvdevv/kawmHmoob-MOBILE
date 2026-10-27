// Standalone lesson: colours — for path unit u-colors (Colors).
//
// ⚠️ PLACEHOLDER (`placeholder: true`), written 2026-10-15 because the unit had NO
// introLesson at all: it used to borrow `grammar-adjectives`, which belongs to units 20
// and 21, and that borrowing was removed when Colors was separated from Describing.
//
// Built only from settled rules and reviewed content, per the playbook:
//   • NOUN THEN ADJECTIVE, and a colour IS the verb — no yog. Settled 2026-09-28 and
//     taught in grammar-adjectives; this lesson applies it to colours and points there
//     rather than re-teaching it.
//   • `kob` vs `xim` — the author's ruling, 2026-10-14: both mean "colour", `kob` is the
//     NATIVE word, `xim` is a loanword (Thai/Lao, Chinese). The colour NAMES carry
//     neither word in front of them.
//   • A colour named after a thing is correct on its own — the author, 2026-10-15:
//     nqaij is peach, nyiaj is silver, kub is gold, kas fes is brown.
//   • Every Hmong line below is copied from the `colors` category's own entries and
//     their example sentences (the reviewed ones, not the `source: 'ai'` ones).
//
// TODO-VERIFY before the placeholder flag comes off:
//   · "Koj nyiam kob dab tsi?" as the natural way to ask someone's favourite colour —
//     the category's own sentence uses `xim` (Koj nyiam xim dab tsi?), so the kob form is
//     this file's extrapolation from the ruling and nothing more.
//   · whether a bare colour needs a classifier in "Tsho no liab" (the entry's sentence
//     has none; `Lub paj no daj` does).

export const colors = {
  id: 'grammar-colors',
  title: 'Colors | Cov Kob',
  summary: 'Liab, dub, dawb — the colour names, and how a colour works as the verb.',
  vocab: 'colors',
  placeholder: true,
  steps: [
    {
      id: 'grammar-colors-intro',
      kind: 'intro',
      title: 'Naming colours',
      body: [
        'Colours are describing words, so everything the Describing Words lesson taught applies here: the noun comes first, and the colour is already the verb.',
        '## The colour comes after the thing',
        'Word for word, “tsho dub” is “shirt black” — a black shirt. English puts the colour first; Hmong puts it last.',
        '> tsho dub — a black shirt',
        '> lub paj daj — a yellow flower',
        '## A colour needs no yog',
        'To say something IS a colour, you put nothing between them. There is no word for “is”.',
        '> Tsho no liab. — This shirt is red.',
        '> Tsho no dawb. — This shirt is white.',
        '> Lub paj no daj. — This flower is yellow.',
        'Saying “Tsho no yog liab” is the mistake an English speaker makes first. The colour is doing the work of the verb already.',
        '## Two words for “colour” itself',
        'Hmong has two, and they mean the same thing. **Kob** is the native Hmong word — it also covers a shade, or a group of something. **Xim** came in from Thai, Lao and Chinese.',
        '> kob liab — the colour red',
        '> Koj nyiam xim dab tsi? — What colour do you like?',
        'Neither word goes in front of a colour name when you are simply describing something. A shirt is “tsho liab”, not “tsho kob liab”.',
        '## Some colours are named after a thing',
        'This is normal and correct: the word for the thing IS the word for the colour.',
        '> nqaij — peach (the word also means meat)',
        '> kub — gold (the word also means hot)',
        '> nyiaj — silver (the word also means money)',
        '> kas fes — brown (the word also means coffee)',
        'Context tells you which is meant. “Tsho kas fes” is a brown shirt, not a coffee shirt.',
        '## An easy way to remember',
        '> noun + colour → tsho dub, a black shirt',
        '> noun + no + colour → Tsho no dub, this shirt is black (a whole sentence)',
        '> no yog before a colour, ever',
      ],
    },
    {
      id: 'grammar-colors-examples',
      kind: 'examples',
      title: 'The colours',
      intro: 'Read each one aloud. These are the colour names on their own.',
      // Hmong and glosses copied verbatim from the `colors` category.
      items: [
        { hmong: 'Liab', english: 'red' },
        { hmong: 'Xiav', english: 'blue' },
        { hmong: 'Ntsuab', english: 'green' },
        { hmong: 'Daj', english: 'yellow' },
        { hmong: 'Dub', english: 'black' },
        { hmong: 'Dawb', english: 'white' },
        { hmong: 'Kas fes', english: 'brown', note: 'The word for coffee.' },
        { hmong: 'Kub', english: 'gold', note: 'The word for hot.' },
        { hmong: 'Nyiaj', english: 'silver', note: 'The word for money.' },
        { hmong: 'Nqaij', english: 'peach', note: 'The word for meat.' },
      ],
    },
    {
      id: 'grammar-colors-sentences',
      kind: 'examples',
      title: 'Colours in sentences',
      intro: 'The thing first, then the colour. Nothing in between.',
      // Every sentence is the reviewed `exampleSentence` of its own entry.
      items: [
        { hmong: 'Tsho no liab.', english: 'This shirt is red.', note: 'no yog' },
        { hmong: 'Tsho no dub.', english: 'This shirt is black.' },
        { hmong: 'Tsho no dawb.', english: 'This shirt is white.' },
        { hmong: 'Lub paj no daj.', english: 'This flower is yellow.', note: 'lub, the flower’s classifier' },
        { hmong: 'Ntsuab zoo nkauj.', english: 'Green is beautiful.' },
        { hmong: 'Av no kas fes.', english: 'This soil is brown.' },
      ],
    },
    {
      id: 'grammar-colors-quiz',
      kind: 'quiz',
      title: 'Learn the colours',
    },
  ],
}
