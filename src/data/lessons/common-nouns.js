// Standalone lesson: everyday nouns — for path unit u-common-nouns (Common Nouns).
//
// ⚠️⚠️ NOT WIRED IN. NOTHING IMPORTS THIS FILE. 2026-10-15.
// Written on a wrong premise: a scan for units with no lesson read only the FIRST `id:`
// in each lesson file, and lessons/placeholders.js holds SIX — so
// `placeholder-common-nouns` looked missing when it exists and is already wired.
// Kept as an upgrade: the live one is intro + quiz, this adds the classifier of every
// noun, the `nyob` rule and two examples steps.
// TO ADOPT: take over the live ids (`placeholder-common-nouns`, …) so no progress
// strands, comment out `commonNounsPlaceholder` there, import this instead.
// TO DROP: delete this file; nothing references it.
//
// Built only from settled rules and the unit's own entries:
//   • EVERY NOUN HAS A CLASSIFIER, and the `common-nouns` entries carry theirs in the
//     gloss ("person — leej or tus: ib leej neeg"). The classifier lesson
//     (foundations-noun-classifiers) teaches the system; this lesson applies it to the
//     nouns a beginner needs first and points there.
//   • A PERSON OR THING BEING SOMEWHERE TAKES `nyob` — the author's ruling, 2026-09-28:
//     "Muaj peb leej neeg NYOB hauv lub tsev", not "Muaj peb leej neeg hauv lub tsev".
//   • `aub` is the word for dog and is never flagged — the author, settled.
//
// ⚠️ The example sentences in this category are `source: 'ai'` (unreviewed). They are
// used here because they are the unit's own content and they follow the settled rules
// above, but they are the reason this lesson keeps `placeholder: true`.
//
// TODO-VERIFY before the placeholder flag comes off:
//   · every sentence in the examples steps, by a fluent speaker;
//   · whether `leej` or `tus` is the more natural classifier for `neeg` in each sentence
//     (the entry lists both).

export const commonNouns = {
  id: 'conversational-common-nouns',
  title: 'Common Nouns | Cov Npe',
  summary: 'The things around you — neeg, tsev, tsheb — and the classifier each one takes.',
  vocab: 'common-nouns',
  placeholder: true,
  steps: [
    {
      id: 'conversational-common-nouns-intro',
      kind: 'intro',
      title: 'The things around you',
      body: [
        'These are the nouns you reach for every day: people, a house, a car, a book. Each one comes with a classifier, and learning the two together is far easier than learning the noun now and the classifier later.',
        '## A noun comes with its classifier',
        'You cannot count a Hmong noun on its own. The classifier sits between the number and the noun, and which one you use depends on the noun.',
        '> ib tus aub — one dog',
        '> ob tus menyuam — two children',
        '> ib lub tsev — one house',
        '> ib phau ntawv — one book',
        'People take **leej** or **tus**. Round or solid things take **lub**. Books take **phau**. A household takes **yim**. The Classifiers lesson covers the full system.',
        '## Saying something is somewhere: nyob',
        'When you say a person or thing is located somewhere, **nyob** does that work. It is easy to leave out, and leaving it out is wrong.',
        '> Muaj peb leej neeg nyob hauv lub tsev. — There are three people in the house.',
        '> Peb lub tsev nyob ze tom khw. — Our house is near the market.',
        'Hauv is “inside”, ze is “near”, and nyob is what makes it a statement about where something is.',
        '## Whose it is',
        'The owner goes at the front, before the classifier.',
        '> kuv tus aub — my dog',
        '> kuv txiv lub tsheb — my father’s car',
        '## An easy way to remember',
        '> number + classifier + noun → ob tus menyuam, two children',
        '> owner + classifier + noun → kuv tus aub, my dog',
        '> … nyob hauv … → where it is',
      ],
    },
    {
      id: 'conversational-common-nouns-examples',
      kind: 'examples',
      title: 'Nouns and their classifiers',
      intro: 'Each noun with the classifier it takes. Read them aloud as a pair.',
      // Hmong and glosses from the `common-nouns` category.
      items: [
        { hmong: 'Neeg', english: 'person', note: 'leej or tus: ib leej neeg' },
        { hmong: 'Menyuam', english: 'child', note: 'tus: ob tus menyuam' },
        { hmong: 'Aub', english: 'dog', note: 'tus: ib tus aub' },
        { hmong: 'Tsev', english: 'house, home', note: 'lub: ib lub tsev' },
        { hmong: 'Tsheb', english: 'car, vehicle', note: 'lub: ib lub tsheb' },
        { hmong: 'Rooj', english: 'table; door', note: 'lub: ib lub rooj' },
        { hmong: 'Phau ntawv', english: 'book', note: 'phau: ib phau ntawv' },
        { hmong: 'Yim neeg', english: 'household', note: 'yim: ib yim neeg' },
      ],
    },
    {
      id: 'conversational-common-nouns-sentences',
      kind: 'examples',
      title: 'In sentences',
      intro: 'Watch for nyob whenever the sentence says where something is.',
      items: [
        { hmong: 'Muaj peb leej neeg nyob hauv lub tsev.', english: 'There are three people in the house.', note: 'nyob: being somewhere' },
        { hmong: 'Kuv muaj ob tus menyuam.', english: 'I have two children.', note: 'number + tus + noun' },
        { hmong: 'Kuv tus aub nyiam noj nqaij.', english: 'My dog likes to eat meat.', note: 'owner + tus + noun' },
        { hmong: 'Peb lub tsev nyob ze tom khw.', english: 'Our house is near the market.' },
        { hmong: 'Kuv txiv muaj ib lub tsheb tshiab.', english: 'My father has a new car.', note: 'the colour or quality comes last' },
        { hmong: 'Kuv nyeem ib phau ntawv txhua hnub.', english: 'I read a book every day.' },
      ],
    },
    {
      id: 'conversational-common-nouns-quiz',
      kind: 'quiz',
      title: 'Learn the nouns',
    },
  ],
}
