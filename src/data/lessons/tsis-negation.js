// Standalone lesson: TSIS — no, not, and don't. Written 2026-09-26.
//
// ⚠️ THE CORE CLAIMS ARE THE AUTHOR'S, stated 2026-09-26, not Claude's:
//   • Hmong has no direct word for "yes" or "no".
//   • tsis means "not" / "don't"; to say no, tsis goes before the verb the
//     situation calls for — tsis ua, tsis xav, tsis yog… depending on context.
//   • yog can be used to signal "yes".
// That also CONFIRMS the claim the Questions unit's "Yes or No" lesson
// (questions-yes-no.js) was drafted on — "answer with the verb".
//
// EXAMPLES: reused from sentences already in vocabulary.js wherever possible
// (the negation set's human ones, "Koj puas yog Hmoob?" from numbers-puas).
// The few Claude drafted to show an exchange are marked TODO-VERIFY.
//
// Supersedes the unshipped placeholders writing-tsis-txhob.js and
// writing-negation.js (withdrawn Writing unit) — merge into THIS lesson if
// either is ever revived. Word bank: the `negation` set (vocab below), which
// also backs path unit u-negation — this lesson is that unit's introduction.
export const tsisNegation = {
  id: 'grammar-tsis-negation',
  title: 'Tsis | No, Not & Don’t',
  summary: 'Hmong has no word for “yes” or “no” — you answer with the verb, and tsis makes it “not”.',
  vocab: 'negation',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-tsis-negation-intro',
      kind: 'intro',
      title: 'There is no word for “no”',
      body: [
        // The author's framing, 2026-09-26.
        'In Hmong there is no direct word for “yes” or for “no”. Instead, you answer with the verb — and to make it negative you put tsis in front of it. Tsis means “not” or “don’t”.',
        '## Saying no: tsis + the verb',
        'Which verb you use depends on what you are saying no to. The answer to “do you want…?” is “don’t want”; the answer to “is it…?” is “isn’t”.',
        '> Tsis ua. — No. (I won’t do it.)',
        '> Tsis xav. — No. (I don’t want to.)',
        '> Tsis yog. — No. (It isn’t / that’s not right.)',
        '## Saying yes: yog, or repeat the verb',
        'Yog can be used to say “yes” — especially to “is it…?” questions. You can also simply repeat the verb from the question, without tsis.',
        // "Koj puas yog Hmoob?" is attested in the app (numbers-puas). The two
        // answers are TODO-VERIFY (drafted to show the exchange).
        '> Koj puas yog Hmoob? — Are you Hmong?',
        '> Yog. — Yes. · Tsis yog. — No.',
        '## Where tsis goes: right before the verb',
        '> Kuv tsis muaj nyiaj. — I don’t have money.',
        '> Kuv tsis mus vim hais tias kuv nyuaj siab. — I do not go because I am sad.',
        '## Don’t: tsis txhob',
        'To tell someone not to do something, use tsis txhob before the verb. It is always tsis txhob — never txhob tsis.',
        '> Tsis txhob mus ze tus tsov ntawd. — Do not go near that tiger.',
      ],
    },
    {
      id: 'grammar-tsis-negation-examples',
      kind: 'examples',
      title: 'Ways to say no — and yes',
      intro: 'Each “no” borrows the verb it answers. Read them aloud.',
      items: [
        { hmong: 'Tsis yog.', english: 'No — it isn’t.', note: 'The everyday “no” to an “is it…?” question.' },
        { hmong: 'Tsis ua.', english: 'No — I won’t (do it).' },
        { hmong: 'Tsis xav.', english: 'No — I don’t want to.' },
        { hmong: 'Tsis muaj.', english: 'No — there isn’t / I don’t have any.' },
        { hmong: 'Tsis paub.', english: 'No — I don’t know.' },
        { hmong: 'Tsis tau.', english: 'Not yet.', note: 'On its own, a reply to a question asking whether something is done: not yet. Before a verb it also means not yet. After a verb it means can’t, unable: mus tsis tau.' },  // english was 'Not yet / I can’t.' (author: tsis tau by itself means not yet), 2026-09-26  // was 'After a verb: can’t.' — tsis always comes first (author, 2026-09-26)
        { hmong: 'Yog.', english: 'Yes — it is.', note: 'Or repeat the question’s verb: Xav. (Yes, I want to.)' },
        { hmong: 'Tsis txhob!', english: 'Don’t!', note: 'Always tsis txhob, never txhob tsis.' },
      ],
    },
    {
      id: 'grammar-tsis-negation-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
