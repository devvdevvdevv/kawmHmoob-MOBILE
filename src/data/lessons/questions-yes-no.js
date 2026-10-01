// Yes/no questions — part of the Asking Questions unit (2026-09-25).
//
// ⚠️ DRAFTED BY CLAUDE at the author's request ("a dedicated learning module for
// question words"). Every example line is TODO-VERIFY. They reuse sentences
// already in the `question-words` vocabulary set where one exists, so the
// lesson and the word bank say the same thing.
//
// ⚠️ OVERLAPS the placeholder `writing-yes-no-questions` (the withdrawn Writing
// unit, not shown in Learn). That file is unreferenced. If it is ever
// revived, merge it into this lesson instead of teaching the rule twice.
// ✅ CONFIRMED BY THE AUTHOR 2026-09-26: Hmong has no direct yes/no word — you
// answer with the verb, tsis + verb for no, and yog can signal yes. The
// 'answer with the verb' claim below is no longer just a draft. The full
// treatment is the Grammar lesson grammar-tsis-negation (tsis-negation.js).
export const questionsYesNo = {
  id: 'questions-yes-no',
  title: 'Yes or No | Puas',
  summary: 'Turn any sentence into a yes/no question — and answer it the Hmong way.',
  reference: 'grammar',
  vocab: 'question-words',
  steps: [
    {
      id: 'questions-yes-no-intro',
      kind: 'intro',
      title: 'Asking yes or no',
      body: [
        // TODO-VERIFY — all of this step.
        'English flips the words around to ask a question ("You are going" → "Are you going?"). Hmong does not move anything. It adds one word: puas, right before the verb.',
        '> Koj mus. — You are going.',
        '> Koj puas mus? — Are you going?',
        '## Answering: repeat the verb',
        'Hmong has no single word for "yes". You answer with the verb itself, and put tsis in front of it for "no".',
        '> Koj puas mus? — Mus. (Yes, I am going.) · Tsis mus. (No, I am not.)',
        '## Or not: los tsis',
        'Another way to ask is to offer both sides: the verb, los tsis, then the verb again.',
        '> Koj mus los tsis mus? — Are you going or not?',
      ],
    },
    {
      id: 'questions-yes-no-examples',
      kind: 'examples',
      title: 'Yes/no questions',
      intro: 'Read each one aloud, then say a yes and a no answer.',
      items: [
        // TODO-VERIFY
        { hmong: 'Koj puas noj mov lawm?', english: 'Have you eaten yet?', note: 'Answer: Noj lawm. / Tsis tau noj.' },
        { hmong: 'Koj puas nyiam?', english: 'Do you like it?', note: 'Answer: Nyiam. / Tsis nyiam.' },
        { hmong: 'Koj puas paub?', english: 'Do you know?', note: 'Answer: Paub. / Tsis paub.' },
        { hmong: 'Koj mus los tsis mus?', english: 'Are you going or not?', note: 'Both sides offered: verb, los tsis, verb.' },
      ],
    },
  ],
}
