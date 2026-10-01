// Standalone lesson: ANSWERING & AGREEING — there is no word for "yes".
// Written 2026-09-27 for path unit u-answers — the author's rules:
//   • Hmong has no literal word for "yes"; yes is decided by context.
//   • yog is used as "yes", usually after a question.
//   • aws is a conversational interjection for affirmation, acknowledgement or agreement
//     ("yes", "that's correct") — the de facto yes, because it shows understanding,
//     acknowledgement or permission, depending on context. Still not a literal "yes".
//   • To answer a question, the answer takes the place of the question word, and the
//     answer keeps the question's word order.
// The Q/A pairs are the author's (typos fixed: "kub npe" → lub npe, "kus" → kuv,
// "datsi" → dab tsi, "phoojywg" → phooj ywg). "Aws, kuv nkag siab" is Claude's.

export const answering = {
  id: 'grammar-answering',
  title: 'Answering & Agreeing',
  summary: 'No word for “yes”: aws, yog — and answers that put the reply where the question word was.',
  vocab: 'answering',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-answering-intro',
      kind: 'intro',
      title: 'There is no word for “yes”',
      body: [
        'Hmong has no literal word for “yes”. Whether an answer means yes is decided by the context, and by how you answer.',
        '## Yog: yes, after a question',
        'Yog (to be) is often used as “yes”, usually as the reply to a question:',
        '> Koj puas yog Mai? — Yog. — Are you Mai? — Yes.',
        // Added 2026-09-27 (author: yog questions with an expected yog answer). Claude's, TODO-VERIFY.
        'A question asked with yog (puas yog) gets yog back. Say yog for yes, tsis yog for no, and you can repeat the whole sentence after it:',
        '> Koj puas yog Hmoob? → Yog, kuv yog Hmoob. — Are you Hmong? → Yes, I am Hmong.',
        '> Nws puas yog koj tus tij laug? → Tsis yog, nws yog kuv tus phooj ywg. — Is he your older brother? → No, he is my friend.',
        'Puas yog? at the end of a sentence means “right?” or “isn’t it?”, and yog answers it:',
        // Was: '> Koj yog Chai, puas yog? → Yog. …' — a name takes hu ua, not yog (author, 2026-09-28).
        '> Koj lub npe hu ua Chai, puas yog? → Yog. — Your name is Chai, right? → Yes.',
        '## Aws: the everyday yes',
        'Aws is a conversational word you say to agree, to show you understand, to acknowledge, or to allow something: “yes”, “mm-hm”, “that’s right”, “okay”. It is the everyday yes, even though it is not a word for “yes” as such.',
        '> Aws, kuv nkag siab. — Yes, I understand.',
        '## Answering a question: the answer goes where the question word was',
        'To answer, keep the question’s word order and put your answer exactly where the question word was:',
        '> Koj lub npe hu li cas? → Kuv lub npe hu ua Chai. — What is your name? → My name is Chai.',
        '> Nws yog leej twg? → Nws yog kuv tus phooj ywg. — Who is he? → He is my friend.',
        '> Koj ua dab tsi? → Kuv sau ntawv. — What are you doing? → I am writing.',
        '> Lawv nyob li cas? → Lawv tsis nyob zoo. — How are they? → They are not doing well.',
        '## Yes and no to a puas question',
        'For yes, say the verb back without puas. For no, put tsis where puas was:',
        '> Koj puas nkag siab? → Kuv nkag siab. — Do you understand? → I understand. (yes)',
        '> Koj puas nkag siab? → Kuv tsis nkag siab. — Do you understand? → I don’t understand. (no)',
        '## An easy way to remember',
        '> no literal “yes” → aws (agreeing), yog (after a question), or the verb said back',
        '> answering → same word order, answer in the question word’s place',
        '> no → tsis where puas was',
      ],
    },
    {
      id: 'grammar-answering-examples',
      kind: 'examples',
      title: 'Question and answer',
      intro: 'The answer keeps the question’s shape. Read each pair aloud.',
      items: [
        { hmong: 'Koj lub npe hu li cas? — Kuv lub npe hu ua Chai.', english: 'What is your name? — My name is Chai.', note: 'li cas → ua Chai' },
        { hmong: 'Nws yog leej twg? — Nws yog kuv tus phooj ywg.', english: 'Who is he? — He is my friend.', note: 'leej twg → kuv tus phooj ywg' },
        { hmong: 'Koj ua dab tsi? — Kuv sau ntawv.', english: 'What are you doing? — I am writing.', note: 'dab tsi → sau ntawv' },
        { hmong: 'Lawv nyob li cas? — Lawv tsis nyob zoo.', english: 'How are they? — They are not doing well.' },
        { hmong: 'Koj puas nkag siab? — Kuv tsis nkag siab.', english: "Do you understand? — I don't understand.", note: 'no: tsis where puas was' },
        { hmong: 'Koj puas yog Mai? — Yog.', english: 'Are you Mai? — Yes.', note: 'yog as yes' },
        { hmong: 'Aws.', english: 'Yes / mm-hm / okay.', note: 'agreeing, acknowledging' },
      ],
    },
    {
      // Added 2026-09-27 — yog questions and their yog answers. Claude's, TODO-VERIFY.
      id: 'grammar-answering-yog',
      kind: 'examples',
      title: 'Yog questions',
      intro: 'Asked with yog, answered with yog, or tsis yog for no.',
      items: [
        { hmong: 'Koj puas yog Mai? — Yog, kuv yog Mai.', english: 'Are you Mai? — Yes, I am Mai.' },
        { hmong: 'Koj puas yog Hmoob? — Yog, kuv yog Hmoob.', english: 'Are you Hmong? — Yes, I am Hmong.' },
        { hmong: 'Lub tsev no puas yog koj li? — Yog, lub tsev no yog kuv li.', english: 'Is this house yours? — Yes, this house is mine.' },
        { hmong: 'Nws puas yog koj tus tij laug? — Tsis yog, nws yog kuv tus phooj ywg.', english: 'Is he your older brother? — No, he is my friend.' },
        // Was: { hmong: 'Koj yog Chai, puas yog? — Yog.', … } — a name takes hu ua (author, 2026-09-28).
        { hmong: 'Koj lub npe hu ua Chai, puas yog? — Yog.', english: 'Your name is Chai, right? — Yes.' },
      ],
    },
    {
      id: 'grammar-answering-yog-check',
      kind: 'practice',
      title: 'Say yes',
      prompt: 'Answer "Koj puas yog Hmoob?" with yes.',
      options: ['Yog, kuv yog Hmoob.', 'Tsis yog, kuv yog Hmoob.', 'Aws yog Hmoob koj.', 'Kuv puas yog Hmoob.'],
      answer: 'Yog, kuv yog Hmoob.',
    },
    {
      id: 'grammar-answering-check',
      kind: 'practice',
      title: 'Answer it',
      prompt: 'Answer "Koj ua dab tsi?" with "I am writing".',
      options: ['Kuv sau ntawv.', 'Dab tsi kuv sau ntawv.', 'Kuv ua dab tsi sau ntawv.', 'Sau ntawv dab tsi.'],
      answer: 'Kuv sau ntawv.',
    },
    {
      id: 'grammar-answering-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
