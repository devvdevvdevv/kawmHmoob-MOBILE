// Standalone lesson: ANSWERING & AGREEING — there is no word for "yes".
// Written 2026-09-27 for path unit u-answers — the author's rules:
//   • Hmong has no direct word for "yes" — AND none for "no" (author, 2026-10-21).
//     Both are carried by context and by how you answer.
//   • yog is used as "yes", usually after a question.
//   • aws indicates agreement, acknowledgement or affirmation. It is NOT a direct
//     "yes" (author, 2026-10-21) — people use it where English would say yes, but
//     what it carries is agreement, not the word.
//   • To answer a question, the answer takes the place of the question word, and the
//     answer keeps the question's word order.
// The Q/A pairs are the author's (typos fixed: "kub npe" → lub npe, "kus" → kuv,
// "datsi" → dab tsi, "phoojywg" → phooj ywg). "Aws, kuv nkag siab" is Claude's.

export const answering = {
  id: 'grammar-answering',
  title: 'Answering & Agreeing',
  // ⚠️ PLAIN TEXT ONLY. LessonCard renders this with {lesson.summary}, not rich(),
  // so markdown here shows its own asterisks on the card.
  summary: 'No direct “yes” or “no”: aws agrees, yog confirms — and answers put the reply where the question word was.',
  vocab: 'answering',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-answering-intro',
      kind: 'intro',
      title: 'There is no word for “yes”',
      body: [
        // ⚠️ "NO" WAS MISSING FROM THIS CLAIM — 2026-10-21 (author: "There are no
        // direct words for 'yes' or 'no'"). The lesson said there is no word for
        // “yes” and then taught `tsis yog` and `tsis` as “no” without ever saying
        // the same of them, which left “no” looking like the one that IS a word.
        'Hmong has no direct word for “yes”, and no direct word for “no” either. Whether an answer means yes or no is carried by the context and by how you answer — usually by saying the verb back, or by putting **"tsis"** in front of it.',

        'So nothing in this lesson is a translation of “yes” or “no”. Each piece is a way of agreeing, confirming, or denying, and the English “yes” or “no” is just the closest we can get.',
        '## **"Yog"**: yes, after a question',
        '**"Yog"** (to be) is often used as “yes”, usually as the reply to a question:',
        '> Koj puas yog Mai? — Yog. — Are you Mai? — Yes.',
        // Added 2026-09-27 (author: yog questions with an expected yog answer). Claude's, TODO-VERIFY.
        'A question asked with **"yog"** (**"puas yog"**) gets **"yog"** back. Say **"yog"** for yes, **"tsis yog"** for no, and you can repeat the whole sentence after it:',
        '> Koj puas yog Hmoob? → Yog, kuv yog Hmoob. — Are you Hmong? → Yes, I am Hmong.',
        '> Nws puas yog koj tus tij laug? → Tsis yog, nws yog kuv tus phooj ywg. — Is he your older brother? → No, he is my friend.',
        '**"Puas yog"**? at the end of a sentence means “right?” or “isn’t it?”, and **"yog"** answers it:',
        // Was: '> Koj yog Chai, puas yog? → Yog. …' — a name takes hu ua, not yog (author, 2026-09-28).
        '> Koj lub npe hu ua Chai, puas yog? → Yog. — Your name is Chai, right? → Yes.',
        // ⚠️ ITERATED 2026-10-21, the author: *"'aws' is not direct yes, it's more
        // like acknowledging / agreeing. Used to indicate agreement,
        // acknowledgement, affirmation. There are no direct words for 'yes' or
        // 'no'."* The old heading called it "the everyday yes" and only then
        // qualified it — which teaches the wrong thing first. The qualification
        // IS the lesson.
        '## **"Aws"**: agreeing, not saying yes',

        '**"Aws"** is not a direct “yes”. It is what you say to show agreement, acknowledgement, or affirmation — that you heard, that you understand, that you are fine with it. Depending on the moment, English would write it as “mm-hm”, “that’s right”, “okay”, “I see”, or “yes”.',

        '> Aws, kuv nkag siab. — Mm-hm, I understand.',

        'It is the piece of this lesson you will hear most often, which is exactly why it is worth being clear about: people reach for **"aws"** where an English speaker would say yes, but what it carries is agreement, not the word “yes”.',
        '## Answering a question: the answer goes where the question word was',
        'To answer, keep the question’s word order and put your answer exactly where the question word was:',
        '> Koj lub npe hu li cas? → Kuv lub npe hu ua Chai. — What is your name? → My name is Chai.',
        '> Nws yog leej twg? → Nws yog kuv tus phooj ywg. — Who is he? → He is my friend.',
        '> Koj ua dab tsi? → Kuv sau ntawv. — What are you doing? → I am writing.',
        '> Lawv nyob li cas? → Lawv tsis nyob zoo. — How are they? → They are not doing well.',
        '## Yes and no to a **"puas"** question',
        'For yes, say the verb back without **"puas"**. For no, put **"tsis"** where **"puas"** was:',
        '> Koj puas nkag siab? → Kuv nkag siab. — Do you understand? → I understand. (yes)',
        '> Koj puas nkag siab? → Kuv tsis nkag siab. — Do you understand? → I don’t understand. (no)',
        '## An easy way to remember',
        '> no direct “yes” or “no” → **"aws"** (agreeing), **"yog"** (after a question), or the verb said back',
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
        { hmong: 'Koj lub npe hu li cas? — Kuv lub npe hu ua Chai.', english: 'What is your name? — My name is Chai.', note: '**"li cas"** → **"ua"** Chai' },
        { hmong: 'Nws yog leej twg? — Nws yog kuv tus phooj ywg.', english: 'Who is he? — He is my friend.', note: '**"leej twg"** → **"kuv tus phooj ywg"**' },
        { hmong: 'Koj ua dab tsi? — Kuv sau ntawv.', english: 'What are you doing? — I am writing.', note: '**"dab tsi"** → **"sau ntawv"**' },
        { hmong: 'Lawv nyob li cas? — Lawv tsis nyob zoo.', english: 'How are they? — They are not doing well.' },
        { hmong: 'Koj puas nkag siab? — Kuv tsis nkag siab.', english: "Do you understand? — I don't understand.", note: 'no: **"tsis"** where **"puas"** was' },
        { hmong: 'Koj puas yog Mai? — Yog.', english: 'Are you Mai? — Yes.', note: '**"yog"** as yes' },
        { hmong: 'Aws.', english: 'Mm-hm / okay / that’s right.', note: 'agreement, acknowledgement, affirmation — not a direct “yes”' },
      ],
    },
    {
      // Added 2026-09-27 — yog questions and their yog answers. Claude's, TODO-VERIFY.
      id: 'grammar-answering-yog',
      kind: 'examples',
      title: 'Yog questions',
      intro: 'Asked with **"yog"**, answered with **"yog"**, or **"tsis yog"** for no.',
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
      options: ['**"Yog"**, **"kuv yog Hmoob"**.', '**"Tsis yog"**, **"kuv yog Hmoob"**.', '**"Aws yog Hmoob koj"**.', '**"Kuv puas yog Hmoob"**.'],
      answer: 'Yog, kuv yog Hmoob.',
    },
    {
      id: 'grammar-answering-check',
      kind: 'practice',
      title: 'Answer it',
      prompt: 'Answer "Koj ua dab tsi?" with "I am writing".',
      options: ['**"Kuv sau ntawv"**.', '**"Dab tsi kuv sau ntawv"**.', '**"Kuv ua dab tsi sau ntawv"**.', '**"Sau ntawv dab tsi"**.'],
      answer: 'Kuv sau ntawv.',
    },
    {
      id: 'grammar-answering-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
