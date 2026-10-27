
// Standalone lesson: MUAJ — having, existence, and age.
//
// ⚠️ NO LONGER A PLACEHOLDER — 2026-10-24, the author: "For the muaj lesson please remove
// the placeholder informaiton, so that it reflects an acccurate lesson."
//
// It had `placeholder: true` and two paragraphs in the intro telling the learner the
// lesson was unfinished. Neither was a fair description of what is here: fifteen
// author-written sentences, eight practice questions with the author's own answer key,
// and the three uses of `muaj` spelled out. The pending piece is ONE unruled pattern —
// whether a thing (as opposed to a person) somewhere takes `nyob` — and the lesson now
// handles that by not teaching it, rather than by teaching it and apologising.
//
// ⚠️ WHAT "PLACEHOLDER" MEANT HERE, so nobody re-adds the flag: it was set because of that
// single open question, not because the content is thin. The question is recorded at the
// point it would be answered, in the intro body.
//
// Existing lesson and step IDs are preserved.

export const muaj = {
  id: 'grammar-muaj',
  title: 'To Be: Muaj | Have, There Is & Age',
  summary: 'Muaj means have, can introduce something that exists, and is used to state age. Its uses differ from yog, nyob, and hu ua.',
  vocab: 'yog-to-be',  // the set the muaj pattern cards live in — same as yog-to-be.js and nyob.js
  steps: [
    {
      id: 'grammar-muaj-intro',
      kind: 'intro',
      title: 'Muaj: Having, existence, and age',
      body: [
        '**“Muaj” has three useful patterns in this lesson:** having something, saying something exists, and stating age. English translates these patterns in different ways, so learn them separately.',

        '## 1. Having something',
        '> Kuv muaj ib tug aub. — I have a dog.',
        'Here, **“muaj”** means “have.” It tells you what someone has.',

        '## 2. Saying something exists',
        '> Thaum ub, muaj ib tug tsov. — Once upon a time, there was a tiger.',
        'Here, **“muaj”** introduces something that existed: in English, “there was.”',

        'When the sentence is about people being in a place, **“muaj”** introduces the people and **“nyob”** tells where they are. Both words do their own job:',
        '> Muaj peb leej neeg nyob hauv lub tsev. — There are three people in the house.',
        // ⚠️ THE OBJECTS CASE IS DELIBERATELY NOT TAUGHT, and this is the reason the
        // lesson stops here rather than hedging in front of the learner.
        // The `nyob` rule is settled for PEOPLE (author, 2026-09-28: "Muaj peb leej neeg
        // NYOB hauv lub tsev"). Whether a THING somewhere takes `nyob` the same way is
        // unruled, so the lesson says nothing about it — a lesson that teaches a pattern
        // and then disclaims it has taught the learner to distrust it.
        // Was, user-facing: 'This example shows people in a location. How to express that
        // an object is located somewhere still needs a verified example, so this
        // placeholder does not set a rule for objects.'
        // TO EXTEND: once the author rules on objects, add the example here and a line to
        // the side-by-side section below.

        '## 3. Stating age',
        'Hmong uses **“muaj”**, not **“yog”**, to state age. The word **“xyoo”** means “year.”',
        '> Kuv muaj neesnkaum xyoo. — I am twenty years old. (Literally: “I have twenty years.”)',
        '> ✗ Kuv yog neesnkaum xyoo. → ✓ Kuv muaj neesnkaum xyoo.',
        'When listing people’s ages, keep the Hmong age pattern with **“muaj”** for each person, even when English does not repeat “is.”',

        '## The four patterns side by side',
        '> **“Yog”** — what someone or something IS: Kuv yog Hmoob. — I am Hmong.',
        '> **“Hu ua”** — what someone is CALLED: Kuv lub npe hu ua Chai. — My name is Chai.',
        '> **“Nyob”** — where someone or something is: Kuv nyob hauv tsev. — I am at home.',
        '> **“Muaj”** — having, existence, and age: Kuv muaj ib tug aub. — I have a dog.',

        'These are four different patterns, not four interchangeable translations of English “to be.” **“Yog”** identifies what something is; **“hu ua”** says what it is called; **“nyob”** gives location; and **“muaj”** expresses having, existence, or age.',
        // ⚠️ THE CLOSING "this is still a placeholder" PARAGRAPH IS GONE — 2026-10-24, the
        // author: "remove the placeholder informaiton, so that it reflects an acccurate
        // lesson". It told the learner the lesson was unfinished, which is a note to the
        // author wearing a learner's clothes. What is unfinished is recorded in comments
        // (see the objects case above), where it belongs.
        // Was: 'This is still a placeholder. The full lesson needs a confirmed example and
        // explanation for objects being located somewhere before that part can be taught
        // confidently.'
      ],
    },
    // ── ⚠️ AUTHOR-SUPPLIED, IMPORTED 2026-10-21 ───────────────────────────────
    //
    // Fifteen sentences and eight questions the author brought in, English kept
    // as written. Two changes, both required by rulings already in force, and
    // nothing else touched:
    //
    //   me nyuam   → menyuam     the joined-compound ruling of 2026-10-20
    //   nees nkaum → neesnkaum   ("combine the words that are supposed to be
    //                             combined, phoojywg, tabtom, xibfwb etc")
    // The dictionary backs both: `menyuam` is its only spelling, and the author
    // wrote `neesnkaum` joined in yog-to-be.js.
    //
    // ⚠️ `daus las` (dollars, #12) IS NOT IN THE DICTIONARY in any spelling. It
    // is kept exactly as the author wrote it and flagged rather than guessed at —
    // a loan word's spelling is the author's call.
    //
    // ⚠️ #15 IS THE ONE OPEN QUESTION IN THIS LESSON. `Muaj peb leej neeg nyob
    // hauv lub tsev` is settled for PEOPLE (ruling, 2026-09-28); whether a THING
    // somewhere takes `nyob` the same way is not.
    // The flag it used to justify is gone (2026-10-24): the lesson teaches the settled
    // people pattern and says nothing about objects, so there is nothing here for a
    // learner to distrust. Was: "…which is why the author kept `placeholder: true` on
    // this lesson."
    {
      id: 'grammar-muaj-sentences',
      kind: 'examples',
      title: 'Muaj in full sentences',
      intro:
        'Read each sentence aloud and name which job **"muaj"** is doing: having something, saying something exists, or giving an age.',
      items: [
        { hmong: 'Kuv muaj ib tug aub.', english: 'I have a dog.', note: 'Having something.' },
        { hmong: 'Kuv muaj ob tug menyuam.', english: 'I have two children.', note: 'Having something. The classifier **"tug"** comes with the number.' },
        { hmong: 'Kuv niam muaj ob tug ntxhais xwb.', english: 'My mother has only two daughters.', note: 'Having something. **"Xwb"** at the end means only.' },
        { hmong: 'Kuv niam muaj peb tug tub xwb.', english: 'My mother has only three sons.', note: 'Having something.' },
        { hmong: 'Koj niam muaj pes tsawg tus menyuam?', english: 'How many children does your mother have?', note: 'Asking about having. **"Muaj pes tsawg"** asks how many.' },
        { hmong: 'Koj niam muaj pes tsawg tus ntxhais?', english: 'How many daughters does your mother have?', note: 'Asking about having.' },
        { hmong: 'Koj niam muaj pes tsawg tus tub?', english: 'How many sons does your mother have?', note: 'Asking about having.' },
        { hmong: 'Kuv tsis muaj.', english: 'I do not have any.', note: 'Not having. **"Tsis"** goes before the verb, and the thing itself can be left out when the context is clear.' },
        { hmong: 'Koj muaj pes tsawg xyoo lawm?', english: 'How old are you?', note: 'Asking age — literally, how many years do you have.' },
        { hmong: 'Kuv muaj plaub caug xyoo.', english: 'I am forty years old.', note: 'Age.' },
        { hmong: 'Kuv muaj neesnkaum xyoo.', english: 'I am twenty years old.', note: 'Age. Never **"yog"** for an age.' },
        { hmong: 'Kuv muaj neesnkaum daus las.', english: 'I have twenty dollars.', note: 'Having something — the same shape as an age, with money instead of years.' },
        { hmong: 'Kuv muaj haujlwm ntau.', english: 'I have a lot of work.', note: 'Having something, where English might reach for a different verb.' },
        { hmong: 'Thaum ub, muaj ib tug tsov.', english: 'Once upon a time, there was a tiger.', note: 'Existence. **"Muaj"** opens the sentence: there was.' },
        { hmong: 'Muaj peb leej neeg nyob hauv lub tsev.', english: 'There are three people in the house.', note: 'Existence and location together: **"muaj"** says they exist, **"nyob"** says where they are. Both words do their own job.' },
      ],
    },

    // ⚠️ A MULTI-QUESTION `practice` STEP — the shape pronouns.js introduced and
    // PracticeStep reads (app/learn/[unitId]/[lessonId].jsx): `body` holds the
    // instructions, `questions[]` the items. `situation` carries the question and
    // `sentence` the line in large type — the Hmong under discussion, or the
    // English to be matched where the question asks for a translation.
    //
    // The author's answer key: 1-B, 2-C, 3-B, 4-C, 5-A, 6-A, 7-D, 8-B. Each
    // `answer` below is that option spelled out, since the renderer matches on
    // the choice text rather than a letter.
    {
      id: 'grammar-muaj-practice',
      kind: 'practice',
      title: 'Which job is muaj doing?',
      body: [
        'Eight questions on the three uses. Read the line, then pick the answer.',
        'If you get one wrong, the explanation names which of the three jobs the sentence was doing.',
      ],
      questions: [
        {
          id: 'muaj-q1',
          situation: 'What does **"muaj"** mean in this sentence?',
          sentence: 'Kuv muaj ib tug aub.',
          choices: ['To be called', 'To have', 'To live somewhere', 'To be a certain kind of person'],
          answer: 'To have',
          translation: 'I have a dog.',
          explanation: '**"Muaj"** is the having word. **"Hu ua"** is being called, **"nyob"** is living somewhere, and **"yog"** is being a certain kind of person.',
        },
        {
          id: 'muaj-q2',
          situation: 'Which sentence means this?',
          sentence: '“I am twenty years old.”',
          choices: ['Kuv yog neesnkaum xyoo.', 'Kuv nyob neesnkaum xyoo.', 'Kuv muaj neesnkaum xyoo.', 'Kuv hu ua neesnkaum xyoo.'],
          answer: 'Kuv muaj neesnkaum xyoo.',
          translation: 'Kuv muaj neesnkaum xyoo.',
          explanation: 'An age is something you HAVE in Hmong, so it takes **"muaj"** with **"xyoo"** — never **"yog"**.',
        },
        {
          id: 'muaj-q3',
          situation: 'What does this sentence mean?',
          sentence: 'Thaum ub, muaj ib tug tsov.',
          choices: ['I have a tiger.', 'Once upon a time, there was a tiger.', 'The tiger is at home.', 'The tiger has a name.'],
          answer: 'Once upon a time, there was a tiger.',
          translation: 'Once upon a time, there was a tiger.',
          explanation: 'Here **"muaj"** says that something EXISTS. **"Thaum ub"** sets it in the past, the way “once upon a time” does.',
        },
        {
          id: 'muaj-q4',
          situation: 'What is this question asking?',
          sentence: 'Koj muaj pes tsawg xyoo lawm?',
          choices: ['Where do you live?', 'What is your name?', 'How old are you?', 'How many children do you have?'],
          answer: 'How old are you?',
          translation: 'How old are you?',
          explanation: 'Literally, how many years do you have. **"Muaj pes tsawg"** asks how many, and **"xyoo"** makes it years.',
        },
        {
          id: 'muaj-q5',
          situation: 'Choose the best translation.',
          sentence: 'Kuv niam muaj ob tug ntxhais xwb.',
          choices: ['My mother has only two daughters.', 'My mother is two years old.', 'My mother lives with two daughters.', 'My mother is called two daughters.'],
          answer: 'My mother has only two daughters.',
          translation: 'My mother has only two daughters.',
          explanation: '**"Muaj"** is having, and **"xwb"** at the end means only.',
        },
        {
          id: 'muaj-q6',
          situation: 'In a conversation about children, what can this mean?',
          sentence: 'Kuv tsis muaj.',
          choices: ['I do not have any.', 'I am not at home.', 'My name is not known.', 'I am twenty years old.'],
          answer: 'I do not have any.',
          translation: 'I do not have any.',
          explanation: '**"Tsis"** goes before the verb to make it negative, and the thing itself can be left out when everyone already knows what is being talked about.',
        },
        {
          id: 'muaj-q7',
          situation: 'Which word gives the location?',
          sentence: 'Muaj peb leej neeg nyob hauv lub tsev.',
          choices: ['muaj', 'peb', 'neeg', 'nyob'],
          answer: 'nyob',
          translation: 'There are three people in the house.',
          explanation: '**"Muaj"** says the people exist; **"nyob"** is what places them. Both words are needed — this is the one pattern where two of the "to be" words work together.',
        },
        {
          id: 'muaj-q8',
          situation: 'Which group best describes the uses of **"muaj"** in this lesson?',
          sentence: 'muaj',
          choices: ['Identity, name, and location', 'Having, existence, and age', 'Location and movement', 'Names and descriptions'],
          answer: 'Having, existence, and age',
          explanation: 'Identity is **"yog"**, a name is **"hu ua"**, and location is **"nyob"**. **"Muaj"** covers having, existence, and age.',
        },
      ],
    },

    {
      id: 'grammar-muaj-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};
