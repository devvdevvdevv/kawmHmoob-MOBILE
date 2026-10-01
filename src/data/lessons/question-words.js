// Question Words — simple starter lesson (content migrated from the old /course
// grammar tab). Intentionally minimal; refine later.
//
// ⚠️ EXPANDED 2026-09-25 into the interrogatives module: `vocab` links it to
// the `question-words` deck (study handoff + the generated vocab-question-words
// quiz), and the intro now teaches the three patterns, not just the list. It is
// the introLesson of the Questions path unit (u-questions).
// Everything new is marked TODO-VERIFY — drafted by Claude, not a speaker.
// Pattern 4 (pes tsawg BEFORE the noun) is the AUTHOR'S rule, 2026-09-26 — not TODO-VERIFY.
export const questionWords = {
  id: 'grammar-question-words',
  title: 'Question Words',
  summary: 'What, who, which, when, why, how — and the three ways Hmong asks.',
  reference: 'grammar',
  vocab: 'question-words',
  steps: [
    {
      id: 'grammar-question-words-intro',
      kind: 'intro',
      title: 'Asking questions in Hmong',
      body: [
        'Question words let you ask what, who, where, when, why, and how. In Hmong they often sit at the END of the sentence rather than the start.',
        '> Koj mus qhov twg? — Where are you going? (literally "You go where?")',
        // TODO-VERIFY — the three patterns below, and every example in them.
        // Plain text only: IntroBody knows '## ' and '> ', nothing else.
        'There are four patterns to know.',  // was three — pes tsawg added 2026-09-26
        '## 1. The question word takes the answer’s place',
        'Say the sentence as if you knew, then put the question word where the unknown part goes.',
        '> Koj noj dab tsi? — What are you eating? (literally "You eat what?")',
        '## 2. Yes/no: puas before the verb',
        'Put puas right before the verb. Nothing else moves.',
        '> Koj puas noj mov lawm? — Have you eaten yet?',
        '## 3. "Which" needs a classifier',
        // The author, 2026-09-27: twg joins whichever classifier fits the noun — not always lub.
        'Twg is added to the classifier of the noun you are asking about, the same slot a number sits in. The classifier changes with the noun: tus twg for a friend, leej twg for people, qhov twg for a place, lub twg only for a noun that takes lub.',
        '> Koj tus phooj ywg yog tus twg? — Which one is your friend? · Nkawd yog leej twg? — Who are those two?',
        '> Koj nyiam lub twg? — Which one do you like? · Tus aub twg yog koj li? — Which dog is yours?',
        // The author's rule, 2026-09-26.
        '## 4. Pes tsawg goes BEFORE the noun',
        'Pes tsawg (how much, how many) is not like the other question words. It does not wait for the end of the sentence. It takes the place of a number, so it comes right after the verb and before the noun: verb + pes tsawg + noun.',
        '> Koj muaj pes tsawg xyoo? — How old are you? (literally "You have how-many years?")',
        '> ✗ Koj muaj xyoo pes tsawg? — not like the other question words.',
        'If the noun needs a classifier, the classifier follows pes tsawg, just as it follows a number:',
        '> Koj muaj pes tsawg tus menyuam? — How many children do you have?',
        'Pes tsawg is mostly for asking how much of something there is: a count, a price, an age. What exactly you are asking about depends mostly on context. At the market, Yog pes tsawg? on its own means How much is it?',
        // The author's rules, 2026-09-27 — what each question word asks, and the two that
        // can open a question. Not TODO-VERIFY.
        '## What each one asks',
        '> Puas — a yes/no question: “is it…?”, “do you…?”',
        '> Twg — which (added to a classifier: tus twg, lub twg)',
        '> Li cas — how: asks for an explanation, or how something is. What it means depends on context.',
        // The author, 2026-09-28.
        '> Zoo li cas — how something is, or what it looks like: Koj lub tsev zoo li cas? — What does your house look like?',
        '> Dab tsi — what',
        '> Vim li cas — why',
        '## Only two can start a question',
        'Most question words sit where the answer would go, so they come late in the sentence. Vim li cas and puas are the only two that can come first:',
        '> Vim li cas koj ua ntawd? — Why did you do that?',
        '> Puas zoo? — Is it good?',
        '## Puas: always right before the verb or adjective',
        'Puas goes directly before the verb or adjective it asks about. Anything before it, like the subject, stays in front:',
        '> puas + verb/adjective → a direct question, to confirm: Puas zoo? — Is it good?',
        '> subject + puas + verb/adjective → a more open question, still to confirm: Koj puas nyob zoo? — Are you well?',
        'To answer, see Answering & Agreeing: the answer goes where the question word was.',
        'Learn the words first — the word order becomes natural with practice.',
      ],
    },
    {
      // Added 2026-09-27 with the author's "only two can start a question" rule.
      id: 'grammar-question-words-check',
      kind: 'practice',
      title: 'Which one can come first?',
      prompt: 'Which question word can start a question?',
      options: ['Vim li cas', 'Dab tsi', 'Leej twg', 'Pes tsawg'],
      answer: 'Vim li cas',
    },
    {
      id: 'grammar-question-words-examples',
      kind: 'examples',
      title: 'Common question words',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Dab tsi?', english: 'What?' },
        { hmong: 'Leej twg?', english: 'Who?' },
        { hmong: 'Qhov twg?', english: 'Where?' },
        { hmong: 'Thaum twg?', english: 'When?' },
        { hmong: 'Vim li cas?', english: 'Why?' },
        { hmong: 'Li cas?', english: 'How?' },
        // Added 2026-09-25 — TODO-VERIFY.
        { hmong: 'Twg?', english: 'Which?', note: 'Added to the classifier of the noun you ask about: tus twg, leej twg, qhov twg, lub twg…' },
        { hmong: 'Pes tsawg?', english: 'How many? How much?', note: 'Before the noun, where a number would go: Koj muaj pes tsawg xyoo?' },
        { hmong: 'Ua cas?', english: 'Why? How come?' },
        // Was english 'How is it? What is it like?' — the author, 2026-09-28: zoo li cas asks how something is or looks.
        { hmong: 'Zoo li cas?', english: 'What does it look like? How is it?', note: 'Koj lub tsev zoo li cas? — What does your house look like?' },
        { hmong: 'Puas …?', english: '(yes/no question)', note: 'Goes right before the verb: Koj puas mus?' },
        // The author's examples, 2026-09-27.
        { hmong: 'Puas zoo?', english: 'Is it good?', note: 'puas can open a question' },
        { hmong: 'Vim li cas koj ua ntawd?', english: 'Why did you do that?', note: 'vim li cas can open a question' },
        { hmong: '… los tsis …?', english: '… or not?', note: 'Koj mus los tsis mus? — Are you going or not?' },
      ],
    },
    {
      id: 'grammar-question-words-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
