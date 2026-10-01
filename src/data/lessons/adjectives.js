// Standalone lesson: describing words (adjectives) in Hmong.
//
// ⚠️ REWRITTEN 2026-09-27 for path unit u-adjectives (Describing Words); still also the
// intro of Colors & Describing. The old placeholder scaffold is kept, commented, at
// the bottom of this file.
//   • THE AUTHOR'S RULE: the noun comes first and the adjective after it — neeg zoo is
//     literally "person good", a good person — with no exceptions in normal use. An
//     adjective in front is rare and changes the meaning substantially, into a title:
//     "tus laus neeg" (the elder) vs "neeg laus" (an old person).
//   • The rest from the GPT pass, checked against the app's rules (tus dev → tus aub):
//     no yog before an adjective; classifier + noun + adjective + demonstrative; heev /
//     kawg / kawg nkaus / tiag tiag; dhau (too); dua / tshaj (more / most); doubling;
//     feelings with siab; tsis / puas before the adjective; common mistakes.
//   • A person's physical state takes nyob ("kuv nyob kub", the author) — pointed to the
//     Yog & Nyob lesson.
// vocab: the new `adjective-grammar` pattern set (was `descriptions`).

export const adjectives = {
  id: 'grammar-adjectives',
  title: 'Adjectives | Describing Words',
  // Softened 2026-09-28 (author: yog before a describing word = a statement with emphasis). Was: 'Noun first, then the adjective — neeg zoo, a good person — and no yog in front of it.'
  // Was (same day): 'Noun first, then the adjective — neeg zoo, a good person. Add yog to make it a statement: tsev yog loj.'
  summary: 'Noun first, then the adjective — neeg zoo, a good person — and no yog in front of it.',
  vocab: 'adjective-grammar',
  steps: [
    {
      id: 'grammar-adjectives-intro',
      kind: 'intro',
      title: 'Describing things',
      body: [
        'Adjectives are the describing words: big, small, new, old, good, bad. They work differently in Hmong than in English in two big ways, and both are worth learning before the words themselves.',
        '## Noun first, then the adjective',
        'In Hmong the noun always comes first and the adjective after it. Word for word, “neeg zoo” is “person good”, and it means a good person.',
        '> neeg zoo — a good person (literally “person good”)',
        '> tsev loj — a big house',
        '> Nws yog tus neeg hluas. — He is a young person.',
        'Very rarely, an adjective comes before the noun, and when it does the meaning changes a lot: it becomes a title.',
        '> Kuv niamtais yog tus laus neeg. — My grandmother is the elder. (a title)',
        '> tus neeg laus — an old person (just a description)',
        // Softened 2026-09-28 (author: yog before a describing word = a statement with emphasis). Was: 
        // '## The adjective is the verb: no yog',
        // 'A describing word works as a verb on its own. There is no yog (“is”) in front of it.',
        '## The adjective is the verb: no yog',  // "no yog" restored 2026-09-28 (author)
        'A describing word works as a verb on its own. There is no yog (“is”) in front of it: Nws zoo heev, never Nws yog zoo heev.',
        '> Hnub no kub heev. — It is very hot today. (literally “today hot very”)',
        '> Lub tsev no loj. — This house is big.',
        '> Tus aub ntawd me. — That dog is small.',
        // Added 2026-09-28 (author).
        // ⚠️ NO YOG BEFORE A DESCRIBING WORD — the author, 2026-09-28 (emphatic): Nws zoo heev ✓, Nws yog zoo heev ✗. This reverses the same-day "through yog" softening. Was:
        // 'You can also say it through yog: Tsev yog loj, the house is big. It means the same, but as a statement, with more emphasis on the description. Koj yog ib tug neeg zoo, you are a good person. See the Yog lesson.',
        'Yog only comes in with a noun after it, and the describing word then sits inside that noun: Koj yog ib tug neeg zoo, you are a good person. See the Yog lesson.',
        // Was: ' … See Yog & Nyob.' — the lessons split 2026-09-28.
        'For how a PERSON feels physically (hot, cold, sick), use nyob: Kuv nyob kub, I am hot. See the Nyob lesson.',
        '## In a full phrase: classifier + noun + adjective + no',
        'The pointing word (no, ko, ntawd) still comes last, after the adjective:',
        '> lub tsev loj no — this big house',
        '> tus aub me ntawd — that small dog',
        '> Kuv nyiam lub tsheb tshiab no. — I like this new car.',
        '## Stronger: heev, kawg, tiag tiag',
        'These all go AFTER the adjective. Heev is “very”, kawg is “extremely”, kawg nkaus is stronger still, and tiag tiag is “really, truly”.',
        '> Lub tsev no loj heev. — This house is very big.',
        '> Lub tsev no loj kawg. — This house is extremely big.',
        '> Nws zoo tiag tiag. — It is really good.',
        '## Too: dhau',
        'Dhau after an adjective means too, more than you want. Heev only makes it stronger; dhau says it is too much.',
        '> Kas fes kub dhau. — The coffee is too hot.',
        '> Lub hnab no hnyav dhau. — This bag is too heavy.',
        '## More and most: dua, tshaj',
        '> Tus noog no loj dua. — This bird is bigger.',
        '> Tus noog no loj dua tus ntawd. — This bird is bigger than that one.',
        '> Tus noog no loj tshaj. — This bird is the biggest.',
        '## Doubled for extra strength',
        'Some adjectives can be said twice to make them stronger, but not every adjective does this:',
        '> Lub paj no liab liab. — This flower is very red.',
        '## Feelings with siab',
        'Many feeling words are built with siab (heart, literally the liver). Watch the order: it changes the meaning.',
        '> zoo siab — happy · nyuaj siab — sad, troubled · chim siab — upset, angry',
        '> Kuv zoo siab heev. — I am very happy.',
        '> siab zoo — kind, good-hearted (siab first!)',
        '## Not, and asking',
        'Tsis (not) and puas (the yes/no question word) go right before the adjective:',
        '> Lub tsev no tsis loj. — This house is not big.',
        '> Hnub no puas kub? — Is it hot today?',
        '## Common mistakes',
        // Softened 2026-09-28 (author: yog before a describing word = a statement with emphasis). Was: 
        // '> ✗ Hnub no yog kub heev. → ✓ Hnub no kub heev. (no yog)',
        // Restored 2026-09-28 (author).
        '> ✗ Hnub no yog kub heev. → ✓ Hnub no kub heev. (no yog)',
        '> ✗ lub tsev no heev loj → ✓ lub tsev loj heev no (adjective, then heev, then no)',
        '> ✗ Tus noog no loj tshaj dua. → ✓ Tus noog no loj tshaj. (tshaj is already “most”)',
        '## An easy way to remember',
        '> noun + adjective → neeg zoo, a good person',
        '> classifier + noun + adjective + no → lub tsev loj no, this big house',
        '> adjective + heev / kawg / tiag tiag → very / extremely / really',
        '> adjective + dhau → too',
        '> adjective + dua / tshaj → more / most',
        '> tsis / puas + adjective → not / is it…?',
      ],
    },
    {
      id: 'grammar-adjectives-examples',
      kind: 'examples',
      title: 'Opposites',
      intro: 'Many describing words come in pairs. Read each one aloud.',
      items: [
        { hmong: 'Loj · Me', english: 'big · small' },
        { hmong: 'Zoo · Phem', english: 'good · bad' },
        { hmong: 'Tshiab · Qub', english: 'new · old (things)' },
        { hmong: 'Hluas · Laus', english: 'young · old (people)' },
        { hmong: 'Kub · Txias', english: 'hot · cool' },
        { hmong: 'Ntev · Luv', english: 'long · short' },
      ],
    },
    {
      // New step id (2026-09-27) — no existing progress key is reused.
      id: 'grammar-adjectives-sentences',
      kind: 'examples',
      title: 'Describing in sentences',
      intro: 'Noun first, then the describing word. Read them aloud.',
      items: [
        { hmong: 'Nws yog tus neeg hluas.', english: 'He is a young person.', note: 'noun + adjective' },
        { hmong: 'Lub tsev no loj heev.', english: 'This house is very big.', note: 'heev after the adjective' },
        { hmong: 'Kuv nyiam lub tsheb tshiab no.', english: 'I like this new car.', note: 'classifier + noun + adjective + no' },
        { hmong: 'Kas fes kub dhau.', english: 'The coffee is too hot.', note: 'dhau: too' },
        { hmong: 'Tus noog no loj tshaj.', english: 'This bird is the biggest.', note: 'tshaj: most' },
        { hmong: 'Kuv zoo siab heev.', english: 'I am very happy.', note: 'a feeling with siab' },
        { hmong: 'Lub tsev no tsis loj.', english: 'This house is not big.', note: 'tsis before the adjective' },
        { hmong: 'Kuv niamtais yog tus laus neeg.', english: 'My grandmother is the elder.', note: 'adjective first: a title' },
      ],
    },
    {
      id: 'grammar-adjectives-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}

// ── THE PREVIOUS VERSION (until 2026-09-27), kept for reference ───────────────
// // Standalone lesson: describing words in Hmong.
// //
// // PLACEHOLDER SCAFFOLD. Structure and word set are real; the teaching prose is
// // a first pass and every example item is pulled straight from the
// // `descriptions` vocabulary category (same Hmong, same glosses — nothing
// // authored here). Audio is pending.
// //
// // SCOPE: this lesson maps to the `descriptions` category only. Colors and the
// // "siab" personality expressions are also adjectives but live in their own
// // categories, and a lesson can only declare one `vocab:`. They want their own
// // lessons — see notes/61.
// //
// // Everything a native speaker should check is marked TODO-VERIFY.
// 
// export const adjectives = {
//   id: 'grammar-adjectives',
//   title: 'Adjectives | Cov Lus Piav Qhia',  // TODO-VERIFY: "Cov Lus Piav Qhia" as the term for adjectives
//   summary: 'Describing words — big, small, good, bad — and why Hmong needs no "to be" in front of them.',
//   vocab: 'descriptions',
//   steps: [
//     {
//       id: 'grammar-adjectives-intro',
//       kind: 'intro',
//       title: 'Describing things',
//       body: [
//         'Adjectives are the words that describe — big, small, new, old, good, bad. Hmong puts them in two places English does not expect, so the grammar is worth a minute before the vocabulary.',
// 
//         '## No "to be" in front of them',
//         'This is the rule from the "yog" lesson, seen from the other side. "Yog" links a noun to another noun, and it is NOT used before an adjective. The adjective simply follows the thing it describes, and that is the whole sentence:',
//         '> Tsev no loj. — This house is big.',
//         '> Me nyuam no me. — This child is small.',
//         '> Nws siab heev. — He is very tall.',
//         'Look at the first one word by word: "tsev" (house), "no" (this), "loj" (big). There is no word for "is" anywhere in it. That absence is the rule — and it trips up English speakers constantly, because the sentence feels unfinished without it.',
//         'The third adds "heev" (very), which sits AFTER the adjective, not before it.',
// 
//         '## They follow the noun',
//         'Where English puts the adjective first ("the new house"), Hmong puts it last. With a classifier in front, the order runs classifier → noun → adjective:',
//         '> Lub tsev tshiab. — The new house.',
//         '> Lub tsev qub. — The old house.',
//         '> Tus neeg phem. — The bad person.',
//         '"Lub" and "tus" are the classifiers from the classifiers lesson — the adjective goes on the far end, after the thing it describes.',
// 
//         '## Pairs worth learning together',
//         'A lot of this set is opposites, and they are far easier to hold in pairs than one at a time:',
//         '> loj / me — big / small',
//         '> tshiab / qub — new / old',
//         '> zoo / phem — good / bad',
//         '> ntev / luv — long / short',
//         '> nquag / tub nkeeg — diligent / lazy',
// 
//         '## Two words for "many"',
//         '"Ntau" and "coob" both gloss as "many", but they are not interchangeable — "coob" is for animate things, "ntau" for everything else:',
//         '> Dej ntau. — There is a lot of water.',
//         '> Neeg coob. — Many people.',
//         'Water takes "ntau", people take "coob". Using the wrong one is a common beginner tell.', // TODO-VERIFY: whether animacy is the exact rule, or something narrower
//         'The same care applies to "luv" and "qib taub", which both gloss as "short".', // TODO-VERIFY: difference between luv and qib taub
// 
//         '## Describing people',
//         '"Zoo" (good) combines to describe appearance, and the pair is gendered:',
//         '> Nws zoo nkauj. — She is pretty.',
//         '> Nws zoo nraug. — He is handsome.',
//         'Note that "nws" covers he, she, and it — so the adjective, not the pronoun, is what tells you who is being described.',
// 
//         'Study the full set in the word bank, then come back for the quiz.',
//       ],
//     },
//     {
//       id: 'grammar-adjectives-examples',
//       kind: 'examples',
//       title: 'Common describing words',
//       intro: 'A sample of the set, mostly in opposite pairs. Read each aloud.',
//       // Hmong + glosses copied verbatim from the `descriptions` category.
//       items: [
//         { hmong: 'loj', audio: 'grammar/adjectives/hmong-common-adjectives-loj.mp3', english: 'big, large, older', note: 'Also used for age — an older sibling is the "big" one.' }, // TODO-VERIFY: "loj" for seniority
//         { hmong: 'me', audio: 'grammar/adjectives/hmong-common-adjectives-me.mp3', english: 'small, young', note: 'The opposite of "loj", and likewise used for age.' },
//         { hmong: 'zoo', audio: 'grammar/adjectives/hmong-common-adjectives-zoo.mp3', english: 'good', note: 'Very common — it is the "zoo" in "nyob zoo" and "zoo nkauj".' },
//         { hmong: 'phem', audio: 'grammar/adjectives/hmong-common-adjectives-phem.mp3', english: 'bad', note: 'The opposite of "zoo". Appears in "siab phem" (mean).' },
//         { hmong: 'tshiab', audio: 'grammar/adjectives/hmong-common-adjectives-tshiab.mp3', english: 'new', note: '' },
//         { hmong: 'qub', audio: 'grammar/adjectives/hmong-common-adjectives-qub.mp3', english: 'old', note: 'Of things, not of people.' }, // TODO-VERIFY: whether "qub" is things-only
//         { hmong: 'ntau', audio: 'grammar/adjectives/hmong-common-adjectives-ntau.mp3', english: 'many (objects)', note: 'For inanimate things. Use "coob" for people and animals.' },
//         { hmong: 'coob', audio: 'grammar/adjectives/hmong-common-adjectives-coob.mp3', english: 'many (animate)', note: 'For people and animals only.' },
//         { hmong: 'zoo nkauj', audio: 'grammar/adjectives/hmong-common-adjectives-zoo-nkauj.mp3', english: 'pretty', note: 'Literally "good" + "nkauj" — said of women.' }, // TODO-VERIFY: gendered use of zoo nkauj vs zoo nraug
//         { hmong: 'zoo nraug', audio: 'grammar/adjectives/hmong-common-adjectives-zoo-nraug.mp3', english: 'handsome', note: 'The counterpart of "zoo nkauj" — said of men.' },
//       ],
//     },
//     {
//       id: 'grammar-adjectives-quiz',
//       kind: 'quiz',
//       title: 'Learn the words',
//     },
//   ],
// }
