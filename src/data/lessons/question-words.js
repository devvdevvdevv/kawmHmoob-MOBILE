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
        // ── ⚠️ REWRITTEN 2026-10-21 ───────────────────────────────────────────
        //
        // Author: *"rewrite the questions lesson so it makes sense and adds qhov
        // twg to its explanations."*
        //
        // WHAT DID NOT MAKE SENSE: the lesson opened with "question words often
        // sit at the END of the sentence" and then contradicted that three times
        // — pattern 4 (`pes tsawg` comes before the noun), "Only two can start a
        // question", and `puas`, which always sits mid-sentence. A learner met a
        // rule and three exceptions without ever being told the rule BEHIND it.
        //
        // ⚠️ THE RULE BEHIND IT IS THE AUTHOR'S OWN PATTERN 1: the question word
        // stands where the ANSWER would stand. Landing late is a CONSEQUENCE of
        // that, not a separate rule. Said once, up front, the old "four
        // patterns" become what they actually are: the `twg` family, one word
        // that genuinely breaks the rule (`pes tsawg`), and the two that may
        // open a sentence.
        //
        // ⚠️ `qhov twg` IS NOW PART OF THE EXPLANATION, not an aside. It is
        // `twg` + the place classifier `qhov`, which is why it sits inside the
        // `twg` section — the author's own sentence makes the point: "Twg means
        // which, while qhov helps form the expression referring to the place."
        // Their paragraphs are kept word for word.
        //
        // ⚠️ NO NEW HMONG. Every Hmong sentence below already appeared in this
        // lesson (intro or examples step). The author's rulings are intact:
        // pes tsawg before the noun (2026-09-26), only `vim li cas` and `puas`
        // may open a question (2026-09-27), `twg` joins whichever classifier
        // fits the noun (2026-09-27), `zoo li cas` asks how something is or
        // looks (2026-09-28). Claude-drafted lines keep TODO-VERIFY.
        //
        // Was, in order: the "sit at the END" opener · "There are four patterns
        // to know" · ## 1 takes the answer's place · ## 2 yes/no puas · ## 3
        // which needs a classifier · ## 4 pes tsawg before the noun · ## qhov twg
        // · ## What each one asks · ## Only two can start a question · ## Puas:
        // always right before the verb or adjective.
        'A question in Hmong is usually the sentence you would say if you knew the answer, with the question word standing where the answer would go. Nothing moves to the front.',

        '> Koj noj dab tsi? — What are you eating? (literally “You eat what?”)',

        '> Nkawd yog leej twg? — Who are those two?',

        'That one idea explains most of what follows — and it is why question words usually land late in a Hmong sentence. The answer would have been there too.',

        // TODO-VERIFY — the twg family as a set, and the examples in it.
        '## Asking which: **“twg”** joins a classifier',

        '**“Twg”** means which, and it does not stand on its own. It attaches to the classifier of the thing you are asking about, filling the same slot a number would. The classifier changes with the noun:',

        '> **“tus twg”** — which one, of a person or an animal',

        '> **“leej twg”** — who, of people',

        '> **“lub twg”** — which one, of a noun that takes **“lub”**',

        '> **“qhov twg”** — which place: where',

        '> Koj tus phooj ywg yog tus twg? — Which one is your friend?',

        '> Koj nyiam lub twg? — Which one do you like?',

        '> Tus aub twg yog koj li? — Which dog is yours?',

        // ⚠️ THE AUTHOR'S PARAGRAPHS, WORD FOR WORD (2026-10-21). Only the Hmong
        // was bolded and quoted, to match the rest of the rewritten lesson.
        '### **“Qhov twg”** — where? / which place?',

        '**“Qhov twg”** asks which place or location. In a question about where someone is going or where something is, it commonly appears after the verb or at the end of the phrase.',

        '> Koj mus qhov twg? — Where are you going?',

        '> Peb mus qhov twg? — Where are we going?',

        '> Koj nyob qhov twg? — Where are you?',

        'Learn **“qhov twg”** as a phrase for asking about a place. **“Twg”** means “which,” while **“qhov”** helps form the expression referring to the place being asked about.',

        // The author's rule, 2026-09-26 — NOT TODO-VERIFY.
        '## The one that breaks the rule: **“pes tsawg”**',

        '**“Pes tsawg”** (how much, how many) is not like the other question words. It does not wait for the end of the sentence. It takes the place of a number, so it comes right after the verb and before the noun: verb + **“pes tsawg”** + noun.',

        '> Koj muaj pes tsawg xyoo? — How old are you? (literally “You have how-many years?”)',

        '> ✗ Koj muaj xyoo pes tsawg? — not like the other question words.',

        'If the noun needs a classifier, the classifier follows **“pes tsawg”**, just as it follows a number:',

        '> Koj muaj pes tsawg tus menyuam? — How many children do you have?',

        '**“Pes tsawg”** is mostly for asking how much of something there is: a count, a price, an age. What exactly you are asking about depends mostly on context. At the market, **“Yog pes tsawg?”** on its own means How much is it?',

        // The author's rules, 2026-09-27 — the puas slot, and the two that may
        // open a question. Both sections used to sit AFTER the summary list,
        // which is why puas was explained in three separate places.
        '## Yes-or-no questions: **“puas”** before the verb',

        '**“Puas”** makes a question you answer yes or no. It goes directly before the verb or adjective it asks about, and nothing else moves — anything in front of it, like the subject, stays in front:',

        '> **“puas”** + verb or adjective → a direct question, to confirm: Puas zoo? — Is it good?',

        '> subject + **“puas”** + verb or adjective → a more open question, still to confirm: Koj puas nyob zoo? — Are you well?',

        '> Koj puas noj mov lawm? — Have you eaten yet?',

        'There is also the “or not” frame, which asks the same thing by offering both halves:',

        '> Koj mus los tsis mus? — Are you going or not?',

        '## The two that can come first',

        'Because a question word sits where the answer would go, most of them come late. **“Vim li cas”** and **“puas”** are the only two that can come first:',

        '> Vim li cas koj ua ntawd? — Why did you do that?',

        '> Puas zoo? — Is it good?',

        // The summary list MOVED TO THE END — it was in the middle, between the
        // patterns and the two rules that qualify them, so the lesson read as a
        // glossary interrupting an explanation. `qhov twg` and `thaum twg` are
        // added to it; both were already taught in the examples step.
        '## What each one asks',

        '> **“Dab tsi”** — what',

        '> **“Leej twg”** — who',

        '> **“Qhov twg”** — where, which place',

        '> **“Twg”** — which, added to a classifier: tus twg, lub twg',

        '> **“Thaum twg”** — when',

        '> **“Vim li cas”** — why',

        '> **“Li cas”** — how: asks for an explanation, or how something is. What it means depends on context.',

        // The author, 2026-09-28.
        '> **“Zoo li cas”** — how something is, or what it looks like: Koj lub tsev zoo li cas? — What does your house look like?',

        '> **“Pes tsawg”** — how much, how many — and it goes before the noun',

        '> **“Puas”** — a yes-or-no question: “is it…?”, “do you…?”',

        'To answer one of these, see **Answering & Agreeing**: the answer goes where the question word was.',

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
