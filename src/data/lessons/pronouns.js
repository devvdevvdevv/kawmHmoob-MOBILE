
// Standalone lesson: the nine Hmong personal pronouns.

export const pronouns = {
  id: 'foundations-pronouns',
  title: 'Pronouns',
  summary:
    'Learn the nine Hmong pronouns and how to use them based on who is speaking and how many people are involved.',
  vocab: 'pronouns',
  reference: 'grammar',

  steps: [
    {
      id: 'foundations-pronouns-intro',
      kind: 'intro',
      title: 'How Hmong pronouns work',

      // ⚠️ BROKEN UP — 2026-10-20 (author: "can you break this up so its easier
      // for users to digest"). It was three paragraphs of four or five clauses
      // each, carrying five separate ideas, and on a phone that is a wall. The
      // WORDS are the author's; only the packaging changed: one idea per
      // paragraph, the contrast as its own `>` line, the count on its own.
      //
      // ⚠️ "we" STAYS IN PLAIN QUOTES, not the **""** markup. That markup means
      // "this is Hmong" everywhere else in the lesson, and `we` is the English
      // word being compared against — bolding it would say the opposite of what
      // the sentence is for.
      body: [
        'In Hmong, pronouns are used to indicate who is speaking, who is being spoken to, or who is being talked about.',

        'But they are also used to identify how many people are involved.',

        'This is one of the main grammar structural differences between Hmong and English.',

        'In English, we use "we" whether we are talking about two people or a group of two or more people in general.',

        'In Hmong, you need to pay attention to how many people are included within the context of the sentence.',

        'The same applies when talking to a group or talking about other people.',

        'There are nine personal pronouns to learn.',

        'They are grouped by how many people they refer to: one person, exactly two people, or three or more people.',

        '## One person',

        {
          hmong: 'kuv',
          english: 'I, me, my',
          note: 'The person speaking.'
        },
        {
          hmong: 'koj',
          english: 'you',
          note: 'The one person being spoken to.'
        },
        {
          hmong: 'nws',
          english: 'he, she, it, him, her',
          note: 'One person or thing being talked about.'
        },

        '## Exactly two people',

        {
          hmong: 'wb',
          english: 'we two, us two',
          note: 'The speaker and exactly one other person.'
        },
        {
          hmong: 'neb',
          english: 'you two',
          note: 'The two people being spoken to.'
        },
        {
          hmong: 'nkawd',
          english: 'they two, the two of them',
          note: 'Two people being talked about.'
        },

        '## Three or more',

        {
          hmong: 'peb',
          english: 'we, us',
          note: 'Three or more people, including the speaker.'
        },
        {
          hmong: 'nej',
          english: 'you all',
          note: 'Three or more people being spoken to.'
        },
        {
          hmong: 'lawv',
          english: 'they, them',
          note: 'Three or more people being talked about.'
        },

        '## Understanding the difference between the pronouns',

        'The easiest way to learn these pronouns is to think about three things: who is speaking, who they are speaking to, and who they are talking about.',

        'First person refers to the speaker. **"Kuv"** refers to one speaker, **"wb"** refers to the speaker and one other person, and **"peb"** refers to the speaker and at least two other people.',

        'Second person refers to the person or people being spoken to. **"Koj"** is used for one person, **"neb"** for exactly two people, and **"nej"** for three or more people.',

        'Third person refers to someone being talked about. **"Nws"** refers to one person or thing, **"nkawd"** refers to two people, and **"lawv"** refers to three or more people.',

        'Remember that the number of people matters, but so does their role in the conversation. **"Wb"** and **"neb"** both refer to EXACTLY two people, but **"wb"** includes the speaker, while **"neb"** refers to the two people being spoken to.',

        '## Count the people',

        'Before choosing a pronoun, count how many people it needs to include. When you use a pronoun meaning "we," remember to count yourself as part of the group.',

        '> You and one friend → **"wb"** (we two)',

        '> You and two friends → **"peb"** (we, three people)',

        '> You and three friends → **"peb"** (we, four people)',

        '> Talking to two people → **"neb"**',

        '> Talking to a group of people → **"nej"**',

        '> Talking about two people → **"nkawd"**',

        '> Talking about three or more people → **"lawv"**',

        '## Why **"wb"** and **"peb"** are different',

        'One of the most important differences to remember is **"wb"** versus **"peb"**. Both can mean "we," but they do not refer to the same number of people.',

        'Use **"wb"** when you are talking about yourself and exactly one other person. There are two people altogether.',

        'Use **"peb"** when you are talking about yourself and at least two other people. There are three or more people altogether.',

        'For example, if you and your sibling are going to the store, you would use "wb" when referring to the two of you. If you, your sibling, and your cousin are going together, you would use "peb" when referring to all three of you.',

        'When choosing between these pronouns, count everyone included in "we," including yourself. Do not count only the people you are talking to.',

        'Getting "wb" and "peb" right is an important part of learning Hmong pronouns. Practice using them in everyday conversations until the difference becomes natural.',

        '## Say exactly how many: pronoun + number + **"leeg"**',

        'Sometimes you may want to be more specific about how many people are involved. You can use a pronoun with a number and **"leeg"** to express the exact number of people.',

        '> Wb ob leeg — the two of us',

        '> Neb ob leeg — the two of you',

        '> Nkawd ob leeg — the two of them',

        '> Peb plaub leeg — the four of us',

        '> Nej plaub leeg — the four of you',

        '> Lawv tsib leeg — the five of them',

        'In these examples, "leeg is used when counting people. The pronoun tells you who the group refers to, while the number tells you the size of the group.',

        'Notice that "peb" can refer to three or more people, not just three. That is why **"peb plaub leeg"** can refer to four people, including the speaker.',

        'Learn these combinations as complete phrases first. As you become more comfortable, practice using them in longer sentences.',

        '## One word for I, me, and my',

        'Hmong pronouns do not change form in the same way English pronouns do. The same pronoun can have different English translations depending on how it is used in a sentence.',

        '> Kuv yog Hmoob. — I am Hmong.',

        '> Kuv tus aub. — My dog.',

        '> Nws lub npe hu ua Mim. — Her name is Mim.',

        'In the first example, **"kuv"** means "I." In the second, **"kuv"** identifies whose dog is being discussed, so it means "my." In the third, **"nws"** refers to the person whose name is being given.',

        'You may notice a classifier between the pronoun and the noun. In **"kuv"** tus aub, tus is used with aub (dog). In **"nws"** lub npe, lub is used with npe (name).',

        'The important thing to remember is that the pronoun itself does not change to match English forms such as "I," "me," or "my." Its meaning depends on how it is used.',

        '## Classifiers can be used to refer to things',

        'Hmong also uses classifiers to refer to things without repeating the noun, especially when the object is already understood from the conversation.',

        'For example, phau no can mean "this one" when the thing being discussed is a book. Lub ntawd can mean "that one" when the appropriate classifier and context are understood.',

        'A pronoun can also appear with a classifier to show ownership. For example, **"kuv"** phau can mean "mine" when the object being discussed is a book or something classified with phau.',

        '> Phau no yog kuv phau ntawv. — This one is my book.',

        'The classifier depends on the type of noun being discussed. Learn which classifiers go with common nouns instead of assuming that one classifier works for everything.',

        '## **"Nws"** has no grammatical gender',

        '**"Nws"** can refer to a man, a woman, or a thing. Unlike English, the pronoun itself does not tell you whether the person is male or female. The name or the rest of the conversation usually makes that clear.',

        '> Nws lub npe hu ua Mim. — Her name is Mim.',

        '> Nkawd sib hlub. — The two of them love each other.',

        'In the second example, **"nkawd"** refers to two people. The word sib helps express a reciprocal relationship in this sentence: the action involves the two people in relation to each other.',

        '## Practice identifying the right pronoun',

        'Imagine that you are talking with your friends or family. Choose the pronoun based on who is included in the situation.',

        '- You are talking about yourself: **"kuv"**.',

        '- You and one friend are doing something together: **"wb"**.',

        '- You and two friends are doing something together: **"peb"**.',

        '- You are speaking directly to one person: **"koj"**.',

        '- You are speaking directly to two people: **"neb"**.',

        '- You are speaking directly to a group of five people: **"nej"**.',

        '- You are talking about one person who is not part of the conversation: **"nws"**.',

        '- You are talking about two people who are not part of the conversation: **"nkawd"**.',

        '- You are talking about a group of people who are not part of the conversation: **"lawv"**.',

        'These examples help you recognize the pattern. Once you understand it, practice making your own sentences with each pronoun. Try using names, family members, and everyday activities to make the examples easier to remember.',

        // ── Possession — author batch, 2026-10-20 ────────────────────────────
        //
        // ⚠️ THE AUTHOR'S PASTE OPENED WITH THE MULTIPLE-MEANINGS PARAGRAPH
        // ("kuv can mean I, me, or my; nws can mean he, she, him…"), and that
        // ground is already covered twice above — "One word for I, me, and my"
        // and "Nws has no grammatical gender". Repeating it here would have the
        // lesson make the same point three times, so only the NEW material was
        // added: the nine possessive forms, the examples, and the closing
        // reminder. Say the word if the paste should go in verbatim instead.
        '## Showing ownership',

        'Pronouns can also show ownership or possession. In Hmong, the pronoun usually comes before the person or thing that belongs to someone.',

        { hmong: 'kuv', english: 'my / mine' },
        { hmong: 'koj', english: 'your / yours' },
        { hmong: 'nws', english: 'his / hers' },
        { hmong: 'wb', english: 'our / ours', note: 'two people, including the speaker' },
        { hmong: 'neb', english: 'your / yours', note: 'two people' },
        { hmong: 'nkawd', english: 'their / theirs', note: 'two people' },
        { hmong: 'peb', english: 'our / ours', note: 'three or more people, including the speaker' },
        { hmong: 'nej', english: 'your / yours', note: 'three or more people' },
        { hmong: 'lawv', english: 'their / theirs', note: 'three or more people' },

        'Examples:',

        { hmong: 'Kuv niam', english: 'my mother' },
        { hmong: 'Koj phau ntawv', english: 'your book' },
        { hmong: 'Nws lub npe', english: 'his or her name' },
        { hmong: 'Wb lub tsev', english: 'our house', note: 'two people' },
        { hmong: 'Lawv lub tsheb', english: 'their car' },

        'Remember: look at the whole sentence to understand whether a pronoun refers to a person, a group, or ownership.',

        // ⚠️ A POINTER, NOT A LINK. `IntroBody` renders strings and example
        // objects; it has no link entry type, so this names the unit instead of
        // navigating to it. Mine & Yours is unit 12 of the path
        // (`u-possession`), and its own intro lesson is
        // `foundations-possessive-pronouns` — the deeper treatment, including
        // the classifier that sits between the pronoun and the noun.
        //
        // TO MAKE IT TAPPABLE: give IntroBody a `{ link, label }` entry type and
        // render it as an expo-router <Link>. Worth doing once more than one
        // lesson wants to cross-reference another.
        'Possession has its own unit later in the path — Mine & Yours — where this goes further: whose it is, the classifier in the middle, and how to say "mine" without naming the thing.',
      ],
    },

    {
      id: 'foundations-pronouns-examples',
      kind: 'examples',
      title: 'The nine pronouns',
      intro:
        'Read each one aloud. Pay attention to who is speaking, who is being spoken to, and how many people are involved.',

      items: [
        {
          hmong: 'Kuv',
          audio: 'grammar/pronouns/hmong-pronouns-kuv.mp3',
          english: 'I / me / my',
          note: 'One person — the speaker.'
        },
        {
          hmong: 'Wb',
          audio: 'grammar/pronouns/hmong-pronouns-wb.mp3',
          english: 'We two / us two',
          note: 'Exactly two people, including the speaker.'
        },
        {
          hmong: 'Peb',
          audio: 'grammar/pronouns/hmong-pronouns-peb.mp3',
          english: 'We / us',
          note: 'Three or more people, including the speaker.'
        },
        {
          hmong: 'Koj',
          audio: 'grammar/pronouns/hmong-pronouns-koj.mp3',
          english: 'You',
          note: 'One person being spoken to.'
        },
        {
          hmong: 'Neb',
          audio: 'grammar/pronouns/hmong-pronouns-neb.mp3',
          english: 'You two',
          note: 'Exactly two people being spoken to.'
        },
        {
          hmong: 'Nej',
          audio: 'grammar/pronouns/hmong-pronouns-nej.mp3',
          english: 'You all',
          note: 'Three or more people being spoken to.'
        },
        {
          hmong: 'Nws',
          audio: 'grammar/pronouns/hmong-pronouns-nws.mp3',
          english: 'He / she / it',
          note: 'One person or thing being talked about.'
        },
        {
          hmong: 'Nkawd',
          english: 'They two',
          note: 'Exactly two people being talked about.'
        },
        {
          hmong: 'Lawv',
          audio: 'grammar/pronouns/hmong-pronouns-lawv.mp3',
          english: 'They / them',
          note: 'Three or more people being talked about.'
        },
      ],
    },

    {
      id: 'foundations-pronouns-counting',
      kind: 'examples',
      title: 'Counting who',
      intro: 'A pronoun can be followed by a number and **"leeg"** to specify how many people are in a group.',

      items: [
        {
          hmong: 'Wb ob leeg',
          english: 'The two of us',
          note: '**"Wb"** already refers to two people. Ob **"leeg"** makes the number explicit.'
        },
        {
          hmong: 'Neb ob leeg',
          english: 'The two of you',
          note: 'Refers to the two people being spoken to.'
        },
        {
          hmong: 'Nkawd ob leeg',
          english: 'The two of them',
          note: 'Refers to the two people being talked about.'
        },
        {
          hmong: 'Peb plaub leeg',
          english: 'The four of us',
          note: '**"Peb"** includes the speaker and refers to three or more people.'
        },
        {
          hmong: 'Nej plaub leeg',
          english: 'The four of you',
          note: 'Refers to four people being spoken to.'
        },
        {
          hmong: 'Lawv tsib leeg',
          english: 'The five of them',
          note: 'Refers to five people being talked about.'
        },
      ],
    },

    // ── Sentences in context — author batch, 2026-10-20 ───────────────────────
    //
    // Fifteen full sentences, the author's, imported VERBATIM. Placed after the
    // counting examples and BEFORE the drill on purpose: read the pronouns at
    // work, then choose them under pressure.
    //
    // ⚠️ `tabtom` IS WRITTEN JOINED HERE, and the dictionary spells it SPACED —
    // `tab tom` in three entries (time-context ×2, tense-markers). Left exactly
    // as the author wrote it, because their Hmong is not Claude's to normalise,
    // but the two spellings now disagree inside one app: a learner meets
    // `tabtom` in this lesson and `tab tom` on the card. Worth one ruling, then
    // one find-and-replace in whichever direction loses.
    //
    // ⚠️ SENTENCES 11 AND 12 USE THE ENGLISH WORD "homework". The author's
    // choice; flagged only because there is no Hmong entry for it in the
    // dictionary, so the reader's long-press will find nothing there.
    //
    // ⚠️ TODO-VERIFY — not reviewed by a fluent speaker, same as the drill below.
    {
      id: 'foundations-pronouns-sentences',
      kind: 'examples',
      title: 'Pronouns in full sentences',
      intro: 'Read each sentence aloud. Notice how many people each pronoun covers, and whether the speaker is inside that group.',
      items: [
        { hmong: 'Kuv thiab kuv tus nus yuav mus tom khw.', english: 'My younger brother and I are going to the store.' },
        { hmong: 'Kuv, Maiv, thiab Ntxawm tabtom ua noj ua ke.', english: 'Maiv, Ntxawm, and I are cooking together.' },
        { hmong: 'Koj tabtom tham nrog ob tug phooj ywg txog lawv txoj kev npaj.', english: 'You are talking with two friends about their plans.' },
        { hmong: 'Koj pom peb tug menyuam tabtom ua si nraum zoov. Koj qhia koj niam txog lawv.', english: 'You see three children playing outside. You tell your mom about them.' },
        { hmong: 'Kuv tus tij laug thiab kuv tus muam tseem tsis tau los txog.', english: 'My older brother and my younger sister have not arrived yet.' },
        { hmong: 'Koj thiab koj tus muam tabtom tham nrog koj niam. Koj niam nug neb tias neb puas tau noj mov lawm.', english: 'You and your sister are talking with your mom. Your mom asks whether you two have eaten yet.' },
        { hmong: 'Kuv nrog kuv tus phooj ywg mus kawm ntawv txhua hnub.', english: 'My friend and I go to school together every day.' },
        { hmong: 'Kuv, koj, thiab peb tug phooj ywg yuav mus noj mov ua ke.', english: 'You, three of our friends, and I are going to eat together.' },
        { hmong: 'Koj tus kwv nug koj tias koj puas xav mus ncaws pob.', english: 'Your younger brother asks whether you want to play soccer.' },
        { hmong: 'Kuv tus phooj ywg thiab nws tus muam mus tom khw lawm. Kuv qhia kuv niam txog nkawd.', english: 'My friend and their sister have gone to the store. I tell my mom about the two of them.' },
        { hmong: 'Koj tabtom tham nrog plaub tug phooj ywg txog lawv cov homework.', english: 'You are talking with four friends about their homework.' },
        { hmong: 'Kuv tus tij laug hais tias nws yuav pab kuv ua homework.', english: 'My older brother says he will help me with my homework.' },
        { hmong: 'Kuv thiab kuv ob tug muam yuav mus xyuas peb pog tag kis.', english: 'My two sisters and I are going to visit our grandmother tomorrow.' },
        { hmong: 'Koj pom koj niam thiab koj txiv nyob hauv tsev. Koj nug nkawd seb nkawd puas npaj txhij lawm.', english: 'You see your mom and dad at home. You ask them whether they are ready.' },
        { hmong: 'Kuv tus phooj ywg qhia kuv tias nws thiab nws ob tug kwv yuav tuaj xyuas kuv.', english: 'My friend tells me that they and their two younger siblings are coming to visit me.' },
      ],
    },

    // ── ⚠️ A MULTI-QUESTION `practice` STEP — the first in the app, 2026-10-20
    //
    // Author-written. Every situation, sentence, choice list, translation and
    // explanation below is theirs, imported verbatim.
    //
    // ⚠️ THIS SHAPE IS NEW. Every other `practice` step in the lesson data is ONE
    // question: `{ prompt, options, answer }`. This one carries `body` (the
    // instructions) and `questions[]`. PracticeStep in
    // app/learn/[unitId]/[lessonId].jsx branches on `step.questions` and renders
    // the multi-question flow; without that branch it would read `step.options`
    // and crash on undefined.
    //
    // ⚠️ THE RULE THE QUESTIONS ENCODE, in the author's words: "The correct
    // pronoun must come from the SITUATION, not from a fixed English
    // translation." 'you two' is `**"neb"**` when speaking TO the pair and `**"nkawd"**`
    // when speaking ABOUT them; 'we' is `**"wb"**` for two and `**"peb"**` for three or
    // more. Questions 3/9 and 5/11 are deliberate near-duplicates that turn on
    // exactly that difference — do not "tidy" them into one.
    //
    // ⚠️ TODO-VERIFY — the author's own instruction: "Have a fluent Hmong speaker
    // review the full sentences before publishing, especially natural phrasing
    // and word order." Not reviewed yet.
    {
      id: 'foundations-pronouns-situation-practice',
      kind: 'practice',
      title: 'Choose the right pronoun',
      body: [
        'Read each situation carefully before choosing an answer. Think about who is speaking, who is being spoken to, and how many people are involved.',
        'In English, we use “we” for both two people and a larger group. Hmong makes this distinction with different pronouns. The same goes for “you” and “they.”',
        'Some questions may look similar, but the situation changes the correct answer.',
      ],
      questions: [
        {
          id: 'pronoun-situation-1',
          situation: 'You and your older brother are getting ready to leave. You tell him that the two of you are going to the market.',
          sentence: '___ mus tom khw.',
          choices: ['Kuv', 'Wb', 'Peb', 'Neb'],
          answer: 'Wb',
          translation: 'We are going to the market.',
          explanation: '**"Wb"** means you and one other person, including the speaker.',
        },
        {
          id: 'pronoun-situation-2',
          situation: 'You, your cousin, and your younger sister are going to eat together. You tell someone about your plans.',
          sentence: '___ yuav mus noj mov ua ke.',
          choices: ['Wb', 'Peb', 'Nej', 'Lawv'],
          answer: 'Peb',
          translation: 'We are going to eat together.',
          explanation: 'There are three people in the group, and you are one of them. Use **"peb"**.',
        },
        {
          id: 'pronoun-situation-3',
          situation: 'You are talking directly to two cousins. You want to know if both of them are going home now.',
          sentence: '___ puas yuav mus tsev tam sim no?',
          choices: ['Wb', 'Neb', 'Nej', 'Nkawd'],
          answer: 'Neb',
          translation: 'Are you two going home now?',
          explanation: 'You are speaking directly to exactly two people. Use **"neb"**.',
        },
        {
          id: 'pronoun-situation-4',
          situation: 'You are talking to four classmates and asking whether they will help clean the classroom.',
          sentence: '___ puas yuav pab tu chav kawm?',
          choices: ['Neb', 'Lawv', 'Nej', 'Peb'],
          answer: 'Nej',
          translation: 'Will you all help clean the classroom?',
          explanation: 'You are speaking directly to three or more people. Use **"nej"**.',
        },
        {
          id: 'pronoun-situation-5',
          situation: 'Two of your friends went home early. You are telling another friend about them. You were not part of their group.',
          sentence: '___ mus tsev lawm.',
          choices: ['Wb', 'Neb', 'Nkawd', 'Lawv'],
          answer: 'Nkawd',
          translation: 'Those two have gone home.',
          explanation: 'You are talking about exactly two other people, not including yourself.',
        },
        {
          id: 'pronoun-situation-6',
          situation: 'Three cousins are playing outside. You are inside the house telling your mom about them.',
          sentence: '___ tab tom ua si nraum zoov.',
          choices: ['Peb', 'Nej', 'Nkawd', 'Lawv'],
          answer: 'Lawv',
          translation: 'They are playing outside.',
          explanation: 'You are talking about three or more people, and you are not part of that group.',
        },
        {
          id: 'pronoun-situation-7',
          situation: 'You and your friend are planning to study together tonight. You are talking to your friend about the two of you.',
          sentence: '___ yuav kawm ntawv ua ke hmo no.',
          choices: ['Wb', 'Peb', 'Neb', 'Nkawd'],
          answer: 'Wb',
          translation: 'We will study together tonight.',
          explanation: 'The group includes you and one other person: two people total.',
        },
        {
          id: 'pronoun-situation-8',
          situation: 'You, your friend, and two other classmates are planning to study together. You tell another person about the group.',
          sentence: '___ yuav kawm ntawv ua ke hmo no.',
          choices: ['Wb', 'Peb', 'Nej', 'Lawv'],
          answer: 'Peb',
          translation: 'We will study together tonight.',
          explanation: 'There are four people, including you. Use **"peb"**, not **"wb"**.',
        },
        {
          id: 'pronoun-situation-9',
          situation: 'You are talking to two friends. You ask whether the two of them have eaten yet.',
          sentence: '___ puas tau noj mov?',
          choices: ['Neb', 'Nej', 'Nkawd', 'Lawv'],
          answer: 'Neb',
          translation: 'Have you two eaten yet?',
          explanation: 'The question is directed at two people. Use **"neb"**, not **"nkawd"**, because you are speaking to them.',
        },
        {
          id: 'pronoun-situation-10',
          situation: 'Your parents are talking about you and your younger brother. They ask whether both of you are ready to leave.',
          sentence: '___ puas npaj txhij lawm?',
          choices: ['Wb', 'Neb', 'Nkawd', 'Lawv'],
          answer: 'Neb',
          translation: 'Are you two ready?',
          explanation: 'The parents are speaking directly to two people: you and your younger brother. From their perspective, use **"neb"**.',
        },
        {
          id: 'pronoun-situation-11',
          situation: 'You and your sister are talking about your parents. Neither of you is included in the group being discussed.',
          sentence: '___ tseem nyob tom tsev.',
          choices: ['Wb', 'Peb', 'Nkawd', 'Lawv'],
          answer: 'Nkawd',
          translation: 'The two of them are still at home.',
          explanation: 'Your parents are exactly two people, and you are talking about them rather than speaking to them.',
        },
        {
          id: 'pronoun-situation-12',
          situation: 'You are talking to your friend about a group of five people who are waiting outside. Neither you nor your friend is in that group.',
          sentence: '___ tseem tos nraum zoov.',
          choices: ['Peb', 'Nej', 'Nkawd', 'Lawv'],
          answer: 'Lawv',
          translation: 'They are still waiting outside.',
          explanation: 'The group has three or more people and does not include the speaker. Use **"lawv"**.',
        },
      ],
    },

    {
      id: 'foundations-pronouns-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};
