// "Which one?" — twg with a classifier. Part of the Asking Questions unit
// (2026-09-25).
//
// ⚠️ DRAFTED BY CLAUDE at the author's request. Every example line is
// TODO-VERIFY. They reuse sentences already in the `question-words` vocabulary
// set (lub twg, tus twg, hnub twg, qhov twg) so the lesson and the word bank
// agree.
//
// This is where questions meet classifiers: "which" is never a bare twg in a
// sentence. That is the reason the Questions path unit sits right after
// Classifiers (see u-questions in src/data/path.js).
export const questionsWhich = {
  id: 'questions-which',
  title: 'Which One? | Twg',
  summary: 'Asking "which" — twg takes the same classifier a number would.',
  reference: 'grammar',
  vocab: 'question-words',
  steps: [
    {
      id: 'questions-which-intro',
      kind: 'intro',
      title: 'Which one?',
      body: [
        // The author's rule, 2026-09-27 — lub twg is NOT the one right answer.
        '## Important: twg joins the classifier of the noun you are asking about',
        'Twg (which) is never a fixed phrase like “lub twg”. It is added to whichever classifier fits the noun you are asking about, so the classifier changes with the context:',
        '> Koj tus phooj ywg yog tus twg? — Which one is your friend? (a friend takes tus)',
        '> Nkawd yog leej twg? — Who are those two? (people: leej)',
        '> Cov khoom nyob qhov twg? — Where are the things? (a place: qhov)',
        'So lub twg is right only for a noun that takes lub. Find the noun’s classifier first, then add twg.',
        // TODO-VERIFY — the rest of this step.
        'Twg means "which", but it almost never stands alone. It follows a classifier, the same slot a number sits in: ib lub (one [thing]) → lub twg (which [thing]).',
        '## Things that take lub: lub twg',
        '> Koj nyiam lub twg? — Which one do you like?',
        '## People and animals that take tus: tus twg',
        'Put the noun between the classifier and twg to say which one you mean.',
        '> Tus aub twg yog koj li? — Which dog is yours?',
        '## Places and days',
        'The same pattern gives you "where" and "which day".',
        '> Koj nyob qhov twg? — Where are you? (literally "which place")',
        '> Koj yuav tuaj hnub twg? — Which day will you come?',
      ],
    },
    {
      id: 'questions-which-examples',
      kind: 'examples',
      title: 'Which, where, which day',
      intro: 'Notice the classifier or noun in front of twg every time.',
      items: [
        // TODO-VERIFY
        { hmong: 'Lub twg?', english: 'Which one? (a thing)', note: 'lub — objects' },
        { hmong: 'Tus twg?', english: 'Which one? (a person or animal)', note: 'tus — people, animals' },
        { hmong: 'Qhov twg?', english: 'Where? (which place)' },
        { hmong: 'Hnub twg?', english: 'Which day?' },
        { hmong: 'Leej twg?', english: 'Who? (which person)', note: 'leej — the respectful classifier for people' },
      ],
    },
  ],
}
