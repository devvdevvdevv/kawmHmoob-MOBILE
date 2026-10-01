// Standalone lesson: QUANTIFIERS — some, a few, many, few, every, all.
// Written 2026-09-27 for path unit u-quantity (Some, Many, All), which had no Learn
// lesson — the author: "add the path for quantifiers: ib co, tej txhia, ob peb, ntau,
// coob, tsawg, qee, tej, txhua, tagnrho".
//
// ⚠️ REWRITTEN 2026-09-28 — THE AUTHOR'S RULE: quantifiers describe an amount of things and
// can be used in place of numbers; when they are, they PRECEDE the classifier. The only
// ones in the list that do not precede a classifier are ib co and tej txhia.
// This replaces Claude's 2026-09-27 reading of the card examples ("most go before the noun;
// coob and tsawg FOLLOW it, like describing words"). SETTLED 2026-09-28 (author): both are
// right — after the noun (neeg coob, menyuam coob) is very common in everyday speech; before
// the classifier (coob tus menyuam) is more precise when counting. "Coob tus neeg" / "tsawg
// tus neeg" confirmed natural. The full sentences are Claude's — TODO-VERIFY. The previous intro is kept,
// commented, at the bottom of this file.

export const quantifiers = {
  id: 'grammar-quantifiers',
  title: 'Some, Many, All',
  summary: 'Ib co, ob peb, ntau, coob, txhua, tag nrho — amounts, in the place of a number.',
  vocab: 'quantifiers',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-quantifiers-intro',
      kind: 'intro',
      title: 'How many, how much',
      body: [
        'Quantifiers describe an amount of things: some, a few, many, few, every, all. They tell you how much or how many without giving an exact number.',
        '## They take the place of a number',
        'A quantifier can be used where a number would go. And just like a number, it comes BEFORE the classifier: quantifier + classifier + noun.',
        '> Peb tus neeg — three people (a number)',
        '> Ntau tus neeg — many people (a quantifier, in the same place)',
        '> Ob peb tus phooj ywg — a few friends',
        '> Txhua tus neeg — every person, everyone',
        '> Tag nrho cov neeg — all the people',
        '## The two exceptions: ib co and tej txhia',
        'Only two quantifiers do not come before a classifier. Ib co and tej txhia go straight in front of the noun:',
        '> Ib co dej — some water',
        '> Ib co neeg — some people',
        '> Tej txhia neeg — some people (certain ones)',
        '## What each one means',
        '> ib co — some, an amount that is not counted: ib co dej, some water',
        '> tej txhia — some, certain ones picked out from the rest: tej txhia neeg',
        '> ob peb — a few (literally “two-three”): ob peb tus phooj ywg',
        '> ntau — many, much, a lot: ntau phau ntawv, many books',
        '> coob — many, for people and animals: coob tus neeg',
        '> tsawg — few, little: tsawg tus neeg',
        '> qee — some, certain: qee tus neeg',
        '> tej — some: tej lub tsev, some houses',
        '> txhua — every, each: txhua tus neeg',
        '> txhua txhia — every single one (stronger): txhua txhia tus',
        '> tag nrho — all, the whole: tag nrho cov neeg',
        '## Many: ntau or coob?',
        'Both mean many. Ntau is for things and amounts; coob is for people and animals.',
        '> Ntau phau ntawv — many books',
        '> Coob tus neeg — many people',
        // Reworded 2026-09-28 (author: after the noun is very common; before the classifier is more precise).
        'Coob and tsawg also follow a noun on their own, like describing words, and in everyday speech this is very common: Neeg coob, many people. Hnub no neeg coob heev, there are very many people today. Before the classifier (coob tus neeg) is more precise, for counting.',
        '## An easy way to remember',
        '> quantifier + classifier + noun → ntau tus neeg, just like peb tus neeg',
        '> no classifier → ib co and tej txhia only: ib co dej, tej txhia neeg',
        '> many → ntau for things, coob for people and animals',
      ],
    },
    {
      id: 'grammar-quantifiers-examples',
      kind: 'examples',
      title: 'The quantifiers',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Ib co dej', english: 'some water', note: 'ib co: no classifier' },
        { hmong: 'Tej txhia neeg', english: 'some people (certain ones)', note: 'tej txhia: no classifier' },
        { hmong: 'Ob peb tus', english: 'a few', note: 'literally "two-three" — before the classifier' },
        { hmong: 'Ntau tus neeg', english: 'many people', note: 'ntau before the classifier, like a number' },
        { hmong: 'Ntau dej', english: 'a lot of water', note: 'ntau: many, much — things' },
        { hmong: 'Coob tus neeg', english: 'many people', note: 'coob: many — people, animals' },
        { hmong: 'Tsawg tus neeg', english: 'few people', note: 'tsawg: few, little' },
        { hmong: 'Qee tus neeg', english: 'some people, certain people' },
        { hmong: 'Tej lub', english: 'some (things)' },
        { hmong: 'Txhua tus', english: 'every one, everyone' },
        { hmong: 'Tag nrho cov neeg', english: 'all the people' },
      ],
    },
    {
      id: 'grammar-quantifiers-sentences',
      kind: 'examples',
      title: 'In sentences',
      intro: 'Read each one aloud.',
      items: [
        // TODO-VERIFY — Claude's sentences.
        { hmong: 'Kuv muaj ib co nyiaj.', english: 'I have some money.' },
        { hmong: 'Kuv muaj ob peb tus phooj ywg.', english: 'I have a few friends.' },
        { hmong: 'Kuv muaj ntau phau ntawv.', english: 'I have many books.' },
        { hmong: 'Hnub no neeg coob heev.', english: 'There are very many people today.' },
        { hmong: 'Qee tus neeg tsis tuaj.', english: 'Some people did not come.' },
        { hmong: 'Txhua tus neeg zoo siab.', english: 'Everyone is happy.' },
        { hmong: 'Tag nrho cov neeg tuaj lawm.', english: 'All the people have come.' },
      ],
    },
    {
      // Added 2026-09-28 with the author's rule.
      id: 'grammar-quantifiers-check',
      kind: 'practice',
      title: 'Which one?',
      prompt: 'Which quantifier does NOT come before a classifier?',
      options: ['Ib co', 'Ntau', 'Qee', 'Txhua'],
      answer: 'Ib co',
    },
    {
      id: 'grammar-quantifiers-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}

// ── THE PREVIOUS INTRO + EXAMPLES (2026-09-27, until the author's rule 2026-09-28) ──
//       body: [
//         'Quantifiers say how many or how much: some, a few, many, few, every, all. In Hmong the main thing to learn is where each one sits.',
//         '## Most come BEFORE the noun',
//         'Like a number, these go in front, and the noun keeps its classifier:',
//         '> Ib co dej — some water',
//         '> Ob peb tus — a few (people or animals) — literally “two-three”',
//         '> Qee tus neeg — some people, certain people',
//         '> Txhua tus — every one, everyone',
//         '> Tag nrho cov neeg — all the people',
//         '## Coob and tsawg come AFTER, like describing words',
//         'Coob (many) and tsawg (few, little) work like adjectives: the noun first, then the word.',
//         '> Neeg coob. — Many people. (literally “people many”)',
//         '> Neeg tsawg. — Few people.',
//         '## Many: ntau or coob?',
//         'Both mean many. Ntau is for things and amounts; coob is specifically for people and animals.',
//         '> Ntau dej — a lot of water',
//         '> Neeg coob — many people',
//         '## Some: four words',
//         '> ib co — some, in general: ib co dej',
//         '> tej — some: tej lub',
//         '> qee — some, certain: qee tus neeg',
//         '> tej txhia — some, “certain ones” — picking some out from the rest: tej txhia neeg',
//         '## Every and all',
//         '> txhua — every, each: txhua tus',
//         '> txhua txhia — every single one (stronger): txhua txhia tus',
//         '> tag nrho — all, the whole: tag nrho cov neeg',
//         '## An easy way to remember',
//         '> before the noun → ib co, tej, qee, tej txhia, ob peb, ntau, txhua, tag nrho',
//         '> after the noun → coob, tsawg',
//         '> many → ntau for things, coob for people and animals',
//       ],
//   examples (changed items): { hmong: 'Neeg coob', english: 'many people', note: 'coob: many — people, animals; after the noun' },
//                             { hmong: 'Neeg tsawg', english: 'few people', note: 'tsawg: few, little; after the noun' },
