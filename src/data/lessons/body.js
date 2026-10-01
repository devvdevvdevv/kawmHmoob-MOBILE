// Standalone lesson: BODY & HEALTH — body parts, their classifiers, and "it hurts".
// Written 2026-09-28 for path unit u-body (Body & Health). Examples are the body cards' own
// ("Kuv lub taub hau mob", "Kuv caj npab mob me ntsis"…). The classifiers follow the
// classifiers set (txhais: one of a pair). "Kuv mob taub hau" (I have a headache) is Claude's —
// TODO-VERIFY with the author which of the two word orders is more natural.

export const body = {
  placeholder: true,  // 2026-09-28 — Claude's draft, not yet the author's lesson
  id: 'grammar-body',
  title: 'Body & Health | Kuv Mob …',
  summary: 'The body, the classifier each part takes, and how to say where it hurts.',
  vocab: 'human-anatomy-face',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-body-intro',
      kind: 'intro',
      title: 'Where does it hurt?',
      body: [
        'Mob means sick, or to hurt. Put it after the body part and you can say where it hurts:',
        '> Kuv lub taub hau mob. — My head hurts.',
        '> Kuv caj npab mob me ntsis. — My arm hurts a little.',
        '> Kuv plab mob tom qab noj ntau. — My stomach hurts after eating a lot.',
        'You will also hear mob before the body part, as the name of the pain:',
        '> Kuv mob taub hau. — I have a headache.',
        '## Body parts take classifiers',
        'Like any noun, a body part can take a classifier, especially when you point to one:',
        '> lub — for the head, the eyes, the ears, the nose, the mouth: kuv lub qhov muag, my eye',
        '> txhais — ONE of a pair: ib txhais tes, one hand; ib txhais ceg, one leg',
        '> cov — for a group: cov plaub hau, hair; cov hniav, teeth',
        '## At the doctor',
        'Health words from Nouns by Purpose come back here: kws kho mob, a doctor; tsev kho mob, a hospital.',
        '> Kuv mus tsev kho mob. — I am going to the hospital.',
        '## An easy way to remember',
        '> (my) body part + mob → it hurts: Kuv lub taub hau mob',
        '> one of a pair → txhais: ib txhais tes',
      ],
    },
    {
      id: 'grammar-body-examples',
      kind: 'examples',
      title: 'It hurts',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Kuv lub taub hau mob.', english: 'My head hurts.' },
        { hmong: 'Kuv lub qhov muag mob.', english: 'My eye hurts.' },
        { hmong: 'Kuv caj npab mob me ntsis.', english: 'My arm hurts a little.' },
        { hmong: 'Kuv nrob qaum mob tom qab zaum ntev.', english: 'My back hurts after sitting a long time.' },
        { hmong: 'Kuv ko taw mob thaum taug kev.', english: 'My foot hurts when I walk.' },
        { hmong: 'Ib txhais tes', english: 'one hand', note: 'txhais — one of a pair' },
        { hmong: 'Cov hniav', english: 'the teeth', note: 'cov — a group' },
      ],
    },
    {
      id: 'grammar-body-check',
      kind: 'practice',
      title: 'Which classifier?',
      prompt: 'One hand is "ib ___ tes".',
      options: ['txhais', 'lub', 'tus', 'daim'],
      answer: 'txhais',
    },
    {
      id: 'grammar-body-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
