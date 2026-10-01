// Standalone lesson: the nine Hmong personal pronouns.
//
// ⚠️ REWRITTEN 2026-09-27 (author: "rewrite the pronouns lesson so its data is better,
// remember when I asked for your differentiation, include that in the lesson").
//   • The differentiation is the AUTHOR'S table (pasted 2026-09-26 for the pronoun
//     story): One · Two (dual) · Three or more, by 1st / 2nd / 3rd person —
//       kuv  wb    peb
//       koj  neb   nej
//       nws  nkawd lawv
//   • The old lesson said "seven core pronouns", listed eight, and left out nkawd
//     (they two) entirely.
//   • "pronoun + number + leeg" (wb ob leeg, peb plaub leeg, lawv tsib leeg) is from
//     the author's pronoun story "Mus Saib Yeeb Yam" after its pronoun audit.
//   • Examples are the pronoun set's own sentences; "kuv tus aub" (my dog) is the
//     standard possessive with a classifier.
// Ids (lesson + steps) unchanged — they are progress keys.

export const pronouns = {
  id: 'foundations-pronouns',
  title: 'Pronouns',
  // Was: 'Singular, dual, and plural — Hmong marks all three.'
  summary: 'Nine pronouns: one person, two people, or three or more — Hmong counts, English doesn’t.',
  vocab: 'pronouns',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-pronouns-intro',
      kind: 'intro',
      title: 'How Hmong pronouns work',
      body: [
        'English has one word for “we”, whether it is two people or twenty. Hmong has two: one for exactly two people, one for three or more. The same is true for “you” and “they”. So Hmong has nine personal pronouns, and choosing the right one means counting the people.',
        '## The nine pronouns, three by three',
        'Read across: one person, then two people, then three or more.',
        '> I, we — kuv (one) · wb (two) · peb (three or more)',
        '> You — koj (one) · neb (two) · nej (three or more)',
        '> He / she / it, they — nws (one) · nkawd (two) · lawv (three or more)',
        'Or read down, by how many:',
        '> One person: kuv (I) · koj (you) · nws (he / she / it)',
        '> Two people: wb (we two) · neb (you two) · nkawd (they two)',
        '> Three or more: peb (we) · nej (you all) · lawv (they)',
        '## Count the people',
        'Before you choose, count how many people the word has to cover, and include yourself for “we”.',
        '> You and one friend → wb (we two)',
        '> You and two friends → peb (we, three or more)',
        '> Talking to two people → neb · to a room of people → nej',
        '> Talking about two people → nkawd · about three or more → lawv',
        'Getting wb and peb right is one of the first things native speakers notice.',
        '## Say exactly how many: pronoun + number + leeg',
        'To be precise, add the number and leeg (the classifier for people) after the pronoun:',
        '> wb ob leeg — the two of us',
        '> peb plaub leeg — the four of us',
        '> nej plaub leeg — the four of you',
        '> lawv tsib leeg — the five of them',
        '## One word for I, me and my',
        'Hmong pronouns never change form. The same word is the subject, the object and the owner; only its place in the sentence changes.',
        '> Kuv yog Hmoob. — I am Hmong.',
        '> Kuv tus aub — my dog',
        // Was: 'Nws npe hu ua Mim' — npe needs its classifier (author, 2026-09-28).
        '> Nws lub npe hu ua Mim. — Her name is Mim.',
        '## Classifiers can be pronouns too',
        'Besides these nine, a classifier can stand in for its noun: phau no is “this one” (a book), lub ntawd is “that one”. And a pronoun + classifier means “mine, yours”: kuv phau is “mine” (a book). This & That and Mine & Yours teach both.',
        '> Phau no yog kuv phau ntawv. — This one is my book.',
        '## Nws has no gender',
        'Nws is he, she and it. The sentence, or the name, tells you which.',
        // Was: 'Nws npe hu ua Mim' — npe needs its classifier (author, 2026-09-28).
        '> Nws lub npe hu ua Mim. — Her name is Mim.',
        '> Nkawd sib hlub. — The two of them love each other.',
        // Was (until 2026-09-27):
        //   'Hmong pronouns mark three numbers: singular (one person), dual (exactly two people), and plural (three or more). English collapses dual into plural — Hmong does not.',
        //   'Pronouns do not change for case. The same word is used whether the pronoun is the subject, object, or possessor. "Kuv" means "I", "me", and "my" depending on position in the sentence.',
        //   'In this lesson you will see all seven core pronouns and learn the distinction between "wb" (we two) and "peb" (we, three or more). Getting this distinction right is one of the first things native speakers notice.',
      ],
    },
    {
      id: 'foundations-pronouns-examples',
      kind: 'examples',
      // Was: 'The seven core pronouns' (it listed eight, without nkawd).
      title: 'The nine pronouns',
      intro: 'Read each one aloud, row by row: one person, two people, three or more.',
      items: [
        { hmong: 'Kuv', audio: 'grammar/pronouns/hmong-pronouns-kuv.mp3', english: 'I / me / my', note: 'One person — the speaker' },
        { hmong: 'Wb', audio: 'grammar/pronouns/hmong-pronouns-wb.mp3', english: 'We two', note: 'Two people — you and one other' },
        { hmong: 'Peb', audio: 'grammar/pronouns/hmong-pronouns-peb.mp3', english: 'We (three or more)', note: 'Three or more, including you' },
        { hmong: 'Koj', audio: 'grammar/pronouns/hmong-pronouns-koj.mp3', english: 'You', note: 'One person you are talking to' },
        { hmong: 'Neb', audio: 'grammar/pronouns/hmong-pronouns-neb.mp3', english: 'You two', note: 'Exactly two people you are talking to' },
        { hmong: 'Nej', audio: 'grammar/pronouns/hmong-pronouns-nej.mp3', english: 'You all (three or more)', note: 'Three or more people you are talking to' },
        { hmong: 'Nws', audio: 'grammar/pronouns/hmong-pronouns-nws.mp3', english: 'He / she / it', note: 'One person or thing — no gender' },
        { hmong: 'Nkawd', english: 'They two', note: 'Exactly two people you are talking about' },
        { hmong: 'Lawv', audio: 'grammar/pronouns/hmong-pronouns-lawv.mp3', english: 'They (three or more)', note: 'Three or more people you are talking about' },
      ],
    },
    {
      // Added 2026-09-27 — new id, so no existing progress key is reused.
      id: 'foundations-pronouns-counting',
      kind: 'examples',
      title: 'Counting who',
      intro: 'Pronoun + number + leeg says exactly how many people.',
      items: [
        { hmong: 'Wb ob leeg', english: 'the two of us', note: 'wb is already two — ob leeg makes it explicit' },
        { hmong: 'Neb ob leeg', english: 'the two of you' },
        { hmong: 'Nkawd ob leeg', english: 'the two of them' },
        { hmong: 'Peb plaub leeg', english: 'the four of us', note: 'peb for three or more' },
        { hmong: 'Nej plaub leeg', english: 'the four of you' },
        { hmong: 'Lawv tsib leeg', english: 'the five of them' },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-pronouns-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'You and one friend are walking together. Which pronoun would you use for "we"?',
      options: ['Kuv', 'Wb', 'Peb', 'Lawv'],
      answer: 'Wb',
    },*/
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-pronouns-quiz',
      kind: 'mini-quiz',
      title: 'Pronouns mini-quiz',
      quizId: 'grammar-pronouns',
    },*/
    {
      id: 'foundations-pronouns-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
