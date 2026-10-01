// Standalone lesson: SO, THEN & THEREFORE — yog li, thiaj li / thiaj, ces, txawm.
// Written 2026-09-28 for path unit u-so-then — the author: "we might need a path for yog li,
// thiaj and yog li ntawd, ces, txawm … they're all extremely similar but it's context based".
// Every definition, differentiation, correct and incorrect example is the author's. The
// author's summary table is the "Which one?" section.
// yog li ntawd — defined by the author 2026-09-28: the fuller yog li, a soft conclusion (was: held,
// not yet defined).
// ⚠️ yog li WAS glossed "so, therefore" (card yog-li, and the Yog lesson's "Nag los, yog li
// peb nyob tsev"). The author: yog li is a SOFT reaction ("in that case"); the strong
// therefore is thiaj li. Both places corrected.

export const soThen = {
  id: 'grammar-so-then',
  title: 'So, Then & Therefore | Yog Li, Thiaj, Ces, Txawm',
  summary: 'Four words for “so” — a soft reaction, a real therefore, a then, and a sudden so.',
  vocab: 'so-then',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-so-then-intro',
      kind: 'intro',
      title: 'Four ways to say “so”',
      body: [
        'Yog li, thiaj li, ces and txawm all translate as “so” or “then”. They are very similar, and which one fits depends on the context: how strong the link is between the two parts of the sentence.',
        // The author, 2026-09-28.
        '## Why these are different from the other joining words',
        'Words like thiab (and) or tab sis (but) each have their own clear job. These four do not: they are very close in meaning, and all of them are common. So the skill is not learning four words, it is reading the context to know which one fits. The sentence builder for this unit is hard on purpose: the other three are always in the pile.',
        '## Yog li: in that case, well then',
        'A soft reaction, or a conclusion drawn from what was just said. It is a response, not a strong logical result, and it is more conversational than thiaj li.',
        '> Koj tsis kam mus? Yog li ces kuv mus ib leeg. — You don’t want to go? In that case, I’ll go alone.',
        '> ✗ Nws pab kuv, yog li kuv ua tau. — wrong: this needs a stronger “therefore”, thiaj li.',
        // The author, 2026-09-28.
        '## Yog li ntawd: the fuller yog li',
        'Yog li ntawd means the same soft thing: in that case, if that’s so, well then. It is yog li said more completely, still a soft conclusion or reaction, not a hard therefore. The two are interchangeable.',
        '> Koj tsis kam mus? Yog li ntawd ces kuv mus ib leeg. — You don’t want to go? In that case, I’ll go alone.',
        '## Thiaj li: therefore, that’s why',
        'The real “therefore”. It shows cause and effect clearly: this happened, and that is the result.',
        '> Nws pab kuv, kuv thiaj li ua tau. — He helped me, that’s why I was able to do it.',
        '> ✗ Koj tsis kam? Thiaj li ces kuv mus ib leeg. — sounds too strong and unnatural for a soft reaction.',
        '## Thiaj: the short form',
        'Thiaj on its own means exactly the same as thiaj li, and the two are interchangeable. Thiaj li is the fuller, slightly more careful form; thiaj is the shorter one, and very common in everyday speech.',
        '> Nws pab kuv, kuv thiaj ua tau. — He helped me, that’s why I was able to do it.',
        '> Kuv tsis muaj nyiaj, kuv thiaj tsis mus. — I didn’t have money, so I didn’t go.',
        'Notice where it sits: after the second subject, right before the verb: kuv thiaj ua tau.',
        '## Ces: then, so then',
        'Ces joins things in order: this, then that. It also gives the “then” of if … then. It is not a strong therefore.',
        '> Yog koj mus ces kuv mus thiab. — If you go, then I’ll go too.',
        '> ✗ Nws pab kuv, ces kuv ua tau. — too weak: thiaj li is better here.',
        '## Txawm: so, and then (suddenly)',
        'Txawm feels like “and then” or “so”, but it carries a mild surprise, or a quick reaction. It is not pure logic like thiaj li.',
        '> Nws hais li ntawd, kuv txawm chim siab. — He said that, so I got upset.',
        '> ✗ Nws pab kuv, kuv txawm ua tau. — sounds odd: thiaj li is much better here.',
        '## Which one?',
        '> yog li / yog li ntawd — a soft reaction: “in that case…” (yog li ntawd is the fuller form)',
        '> thiaj li / thiaj — strong logic: “therefore, that’s why”',
        '> ces — a sequence: “then, so then”',
        '> txawm — sudden or unexpected: “so, and then…”',
      ],
    },
    {
      id: 'grammar-so-then-examples',
      kind: 'examples',
      title: 'In sentences',
      intro: 'Read each one aloud, and notice how strong the “so” is.',
      items: [
        { hmong: 'Koj tsis kam mus? Yog li ces kuv mus ib leeg.', english: 'You don’t want to go? In that case, I’ll go alone.', note: 'yog li — a soft reaction' },
        { hmong: 'Nws pab kuv, kuv thiaj li ua tau.', english: 'He helped me, that’s why I was able to do it.', note: 'thiaj li — therefore' },
        { hmong: 'Kuv tsis muaj nyiaj, kuv thiaj tsis mus.', english: 'I didn’t have money, so I didn’t go.', note: 'thiaj — the short form' },
        { hmong: 'Yog koj mus ces kuv mus thiab.', english: 'If you go, then I’ll go too.', note: 'ces — then' },
        { hmong: 'Nws hais li ntawd, kuv txawm chim siab.', english: 'He said that, so I got upset.', note: 'txawm — a sudden reaction' },
      ],
    },
    {
      id: 'grammar-so-then-check',
      kind: 'practice',
      title: 'Which “so”?',
      prompt: '"He helped me, that’s why I was able to do it." Which word fits: Nws pab kuv, kuv ___ ua tau.',
      options: ['thiaj li', 'yog li', 'ces', 'txawm'],
      answer: 'thiaj li',
    },
    {
      id: 'grammar-so-then-check-soft',
      kind: 'practice',
      title: 'Which “so”?',
      prompt: '"You don’t want to go? In that case, I’ll go alone." Which word fits: Koj tsis kam mus? ___ ces kuv mus ib leeg.',
      options: ['Yog li', 'Thiaj li', 'Txawm', 'Thiaj'],
      answer: 'Yog li',
    },
    {
      id: 'grammar-so-then-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
