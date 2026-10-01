// Standalone lesson: NYOB — to be somewhere, or to be in a condition right now.
// Written 2026-09-28 for path unit u-nyob — the author: "separate nyob and yog paths, two
// separate concepts, but maintain that to be is similar between them including hu ua".
// The nyob content MOVED here from the Yog lesson (yog-to-be.js), where it was written
// 2026-09-27 from the author's notes: nyob is for a CONDITION — physical location, a physical
// state (hot, cold, sick: "kuv nyob kub", never "kuv kub"), and emotions, where the adjective
// alone is most common and nyob is implied ("kuv zoo siab" = "kuv nyob zoo siab").
// The "Three ways to say to be" frame is shared, word for word, by the Yog, Hu Ua and Nyob
// lessons. "Kuv tsis nyob tsev" and "Koj puas nyob tsev?" are Claude's — TODO-VERIFY.

export const nyob = {
  id: 'grammar-nyob',
  title: 'Nyob | To Be: Where & How',
  summary: 'Nyob for where something is, and how it is right now — the “to be” of place and condition.',
  vocab: 'yog-to-be',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-nyob-intro',
      kind: 'intro',
      title: 'To be somewhere, to be some way',
      body: [
        '## Three ways to say “to be”',
        'English uses “is, am, are” for all of these. Hmong splits them, and each has its own lesson:',
        '> yog — what something IS (Kuv yog Hmoob — I am Hmong)',
        '> hu ua — what something is CALLED (Kuv lub npe hu ua Chai — My name is Chai)',
        '> nyob — WHERE something is, or HOW it is right now (Kuv nyob hauv tsev — I am at home)',
        'All three are the same English “to be”. The question is which kind of being you mean. This lesson is nyob.',
        '## Nyob: stay, live, be',
        'Nyob literally means to stay or to live. It is the “to be” for a condition: where you are, or how you are at the moment. Yog is lasting, what something is; nyob is more temporary.',
        '## Where: nyob + a place',
        '> Kuv nyob hauv tsev. — I am at home.',
        '> Nws nyob tom khw. — She is at the market.',
        'Because nyob also means to live, the same sentence can say where someone lives. Context tells you which:',
        '> Kuv nyob hauv lub nroog no. — I live in this city.',
        '## How, right now: a physical state',
        'Hot, cold, sick: for these, always use nyob.',
        '> Kuv nyob kub. — I am hot. (never “Kuv kub”)',
        '## How, right now: a feeling',
        'For an emotion, the describing word on its own is the most common, and nyob is understood. Both are right, depending on context:',
        '> Kuv zoo siab. = Kuv nyob zoo siab. — I am happy.',
        '> Kuv nyuaj siab. = Kuv nyob nyuaj siab. — I am sad.',
        '## Asking how someone is',
        '> Koj nyob li cas? — How are you doing?',
        '> Kuv nyob zoo. — I am well.',
        '## Not, and asking: tsis nyob, puas nyob',
        '> Kuv tsis nyob tsev. — I am not home.',
        '> Koj puas nyob tsev? — Are you home?',
        '## Yog or nyob?',
        '> ✗ Kuv yog hauv tsev. → ✓ Kuv nyob hauv tsev. (a place takes nyob)',
        '> ✗ Kuv kub. → ✓ Kuv nyob kub. (a physical state takes nyob)',
        '> Kuv yog Hmoob. — what I am, so yog',
        '## An easy way to remember',
        '> what it IS → yog',
        '> what it is CALLED → hu ua',
        '> where it is, or how it is right now → nyob',
      ],
    },
    {
      id: 'grammar-nyob-examples',
      kind: 'examples',
      title: 'Using "nyob"',
      intro: 'Read each sentence aloud.',
      items: [
        { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.', note: 'where' },
        { hmong: 'Nws nyob tom khw.', english: 'She is at the market.', note: 'where' },
        { hmong: 'Kuv nyob kub.', english: 'I am hot.', note: 'a physical state — always nyob' },
        { hmong: 'Kuv zoo siab.', english: 'I am happy.', note: 'a feeling — nyob understood' },
        { hmong: 'Koj nyob li cas?', english: 'How are you doing?', note: 'how you are' },
        { hmong: 'Kuv tsis nyob tsev.', english: 'I am not home.', note: 'tsis nyob — not' },
      ],
    },
    {
      id: 'grammar-nyob-check',
      kind: 'practice',
      title: 'Yog or nyob?',
      prompt: 'How do you say "I am at home"?',
      options: ['Kuv nyob hauv tsev.', 'Kuv yog hauv tsev.', 'Kuv hu ua tsev.', 'Kuv tsev.'],
      answer: 'Kuv nyob hauv tsev.',
    },
    {
      id: 'grammar-nyob-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
