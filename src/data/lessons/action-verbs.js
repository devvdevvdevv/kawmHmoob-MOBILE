// Standalone lesson: common Hmong action verbs.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.
//
// ⚠️ REWRITTEN 2026-09-27 (author: "need a better lesson explanation for action verbs,
// because that explanation is more suited for time verb placement; verbs need to be
// more general"). The old intro was mostly yuav / lawm — Time Markers material. Now it
// is about VERBS: word order, no conjugation (one line, pointing on to Time Markers),
// verbs that bring their own object, commands, verbs in a row, describing words that
// act as verbs, and where tsis / puas go. Examples are the Verbs set's own sentences
// (Kuv pom koj, Kuv mus tsev, Kuv nyeem ntawv, Qhib lub rooj…), "Hnub no kub heev"
// (the heev card), "Kuv zoo siab" (the pronoun story) and "Kuv mus xyuas kuv pog"
// (the xyuas card — an AI example, so TODO-VERIFY). Ids unchanged (progress keys).

export const actionVerbs = {
  id: 'foundations-action-verbs',
  title: 'Action Verbs',
  // Was: 'Everyday Hmong verbs for the things people do.'
  summary: 'Everyday verbs, and how a Hmong sentence is built around them.',
  vocab: 'verbs',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-action-verbs-intro',
      kind: 'intro',
      title: 'How Hmong verbs work',
      body: [
        'A verb names what someone does: eat, go, see, read, talk. In Hmong the verb is the heart of the sentence, and it is refreshingly simple to use.',
        '## Word order: who, then the verb, then what',
        'A basic sentence runs like English: the doer, the verb, then the thing it happens to.',
        '> Kuv pom koj. — I see you.',
        '> Kuv nug koj. — I ask you.',
        '> Kuv tham nrog koj. — I talk with you.',
        'A place goes straight after a verb of motion, with no word for “to”:',
        '> Kuv mus tsev. — I go home. (literally “I go home”, no “to”)',
        '## A verb never changes',
        'Noj is noj whoever eats and whenever they eat: there is no eats, ate or eating. I eat, she eats, they ate are all the same verb. Time is shown by other words; the Time Markers lesson teaches them.',
        // The author, 2026-09-27: action verbs can stand alone, but are almost always said
        // with a given noun; together they name the activity itself. Was a shorter
        // "Many verbs bring their own object" with four examples.
        '## Verb + its everyday noun',
        'An action verb can be used by itself, but in everyday Hmong it is almost always said together with a noun. The pair names the activity itself, and it is the normal way to say, or explain, what someone is doing. English often uses the verb alone for the same thing.',
        '> Taug kev — to walk. (taug = to walk along, kev = road: literally “walk the road”)',
        '> Noj mov — to eat, to have a meal. (noj = eat, mov = food)',
        '> Nyeem ntawv — to read. (nyeem = read, ntawv = writing)',
        '> Sau ntawv — to write. (sau = write, ntawv = writing)',
        '> Kawm ntawv — to study, to go to school. (kawm = learn, ntawv = writing)',
        '> Mloog lus — to listen; to do as you are told. (mloog = listen, lus = words)',
        '> Hais lus — to speak. (hais = say, lus = words)',
        'So “Kuv nyeem ntawv” is simply “I am reading”: you do not need to say what you read. Learn these seven as pairs; they are some of the most common phrases in the language.',
        // Added 2026-09-28 — the other direction has its own unit, Nouns by Purpose.
        'It works the other way too: a verb after a NOUN says what the thing is for. Lub rooj noj mov is a dining table, tsev kawm ntawv a school. That is its own lesson, Nouns by Purpose.',
        '## A command is just the verb',
        'Leave out the doer and the verb becomes an instruction:',
        '> Qhib lub rooj. — Open the door.',
        '> Kaw lub rooj. — Close the door.',
        '## Two verbs in a row',
        'Hmong happily puts verbs side by side, with no word between them. Mus (go) and los (come) often lead:',
        '> Kuv mus xyuas kuv pog. — I go (and) check on my grandmother.',
        '> Kuv mus saib yeeb yam. — I go (and) watch a movie.',
        '## Describing words act like verbs',
        // Softened 2026-09-28 (author: yog before a describing word = a statement with emphasis). Was: 
        // 'Words like hot, happy or big work as verbs themselves, so there is no “is” in front of them. Yog (to be) is not used before a describing word.',
        // ⚠️ NO YOG BEFORE A DESCRIBING WORD — the author, 2026-09-28 (emphatic): Nws zoo heev ✓, Nws yog zoo heev ✗. This reverses the same-day "through yog" softening. Was:
        // 'Words like hot, happy or big work as verbs themselves, so they do not need an “is” in front of them. Yog can be added to make it a statement with more emphasis: Tsev yog loj, the house is big.',
        'Words like hot, happy or big work as verbs themselves, so there is no “is” in front of them. Yog (to be) is not used before a describing word: Nws zoo heev, not Nws yog zoo heev.',
        '> Hnub no kub heev. — It is very hot today. (literally “today hot very”)',
        '> Kuv zoo siab. — I am happy.',
        '## Not, and asking: right before the verb',
        'Tsis (not) and puas (the yes/no question word) both go directly before the verb:',
        '> Kuv tsis mus. — I am not going.',
        '> Koj puas mus? — Are you going?',
        'Learn the verbs below, and you can already build real sentences with the pronouns you know.',
        // Was (until 2026-09-27):
        //   'Action verbs name the things people do — eat, go, see, work. Hmong verbs do not change form for tense or person; the same word is used regardless of who does it or when.',
        //   'To place an action in time, Hmong adds small marker words instead of changing the verb:',
        //   '> Kuv yuav noj. — I will eat. ("yuav" points to the future)',
        //   '> Kuv noj lawm. — I have eaten. ("lawm" at the end shows it is done)',
        //   'You will meet these markers properly in the Tense Markers lesson — for now, focus on learning the verbs themselves.',
      ],
    },
    {
      id: 'foundations-action-verbs-examples',
      kind: 'examples',
      title: 'Common action verbs',
      intro: 'Read each verb aloud.',
      items: [
        { hmong: 'Noj', audio: 'grammar/action-verbs/hmong-action-verbs-noj.mp3', english: 'to eat', note: '"Noj mov" — literally "eat rice" — is the everyday way to say "have a meal."' },
        { hmong: 'Haus', audio: 'grammar/action-verbs/hmong-action-verbs-haus.mp3', english: 'to drink', note: '"Haus dej" = drink water. The final -s marks a low tone.' },
        { hmong: 'Mus', audio: 'grammar/action-verbs/hmong-action-verbs-mus.mp3', english: 'to go', note: 'Motion away from the speaker.' },
        { hmong: 'Los', audio: 'grammar/action-verbs/hmong-action-verbs-los.mp3', english: 'to come', note: 'Motion toward the speaker — the natural pair of "mus."' },
        { hmong: 'Pom', audio: 'grammar/action-verbs/hmong-action-verbs-pom.mp3', english: 'to see', note: 'To see or catch sight of something.' },
        { hmong: 'Ua', audio: 'grammar/action-verbs/hmong-action-verbs-ua.mp3', english: 'to do / make', note: 'The all-purpose verb — it appears in many set phrases, like "ua tsaug" (thank you).' },
        { hmong: 'Hais', audio: 'grammar/action-verbs/hmong-action-verbs-hais.mp3', english: 'to say / speak', note: '"Hais lus" = to speak (literally "say words").' },
        // Added 2026-09-27 — more everyday verbs from the Verbs set.
        { hmong: 'Nyeem', english: 'to read', note: '"Nyeem ntawv" = to read (literally "read writing").' },
        { hmong: 'Sau', english: 'to write', note: '"Sau ntawv" = to write.' },
        { hmong: 'Kawm', english: 'to learn / study', note: '"Kawm lus Hmoob" = study Hmong.' },
        { hmong: 'Saib', english: 'to look at / watch' },
        { hmong: 'Tham', english: 'to talk', note: '"Tham nrog koj" = talk with you.' },
        { hmong: 'Nug', english: 'to ask' },
        { hmong: 'Zaum', english: 'to sit' },
      ],
    },
    {
      // Added 2026-09-27 — new id, so no existing progress key is reused.
      id: 'foundations-action-verbs-sentences',
      kind: 'examples',
      title: 'Verbs in sentences',
      intro: 'Doer, verb, then what it happens to. Read each one aloud.',
      items: [
        { hmong: 'Kuv pom koj.', english: 'I see you.', note: 'doer + verb + object' },
        { hmong: 'Kuv mus tsev.', english: 'I go home.', note: 'no word for "to"' },
        { hmong: 'Kuv kawm lus Hmoob.', english: 'I study Hmong.' },
        { hmong: 'Kuv tham nrog koj.', english: 'I talk with you.', note: 'nrog = with' },
        { hmong: 'Qhib lub rooj.', english: 'Open the door.', note: 'a command: just the verb' },
        { hmong: 'Kuv mus xyuas kuv pog.', english: 'I go check on my grandmother.', note: 'two verbs in a row' },  // TODO-VERIFY (AI example on the xyuas card)
        { hmong: 'Hnub no kub heev.', english: 'It is very hot today.', note: 'kub (hot) is the verb — no "is"' },
        { hmong: 'Kuv tsis mus.', english: 'I am not going.', note: 'tsis right before the verb' },
      ],
    },
    {
      // Added 2026-09-27 — the author's seven verb + noun pairs. New id.
      id: 'foundations-action-verbs-pairs',
      kind: 'examples',
      title: 'Verb + noun pairs',
      intro: 'The verb, then its everyday noun. Together they name the activity.',
      items: [
        { hmong: 'Taug kev', english: 'to walk', note: 'taug (walk along) + kev (road)' },
        { hmong: 'Noj mov', english: 'to eat, to have a meal', note: 'noj (eat) + mov (food)' },
        { hmong: 'Nyeem ntawv', english: 'to read', note: 'nyeem (read) + ntawv (writing)' },
        { hmong: 'Sau ntawv', english: 'to write', note: 'sau (write) + ntawv (writing)' },
        { hmong: 'Kawm ntawv', english: 'to study, to go to school', note: 'kawm (learn) + ntawv (writing)' },
        { hmong: 'Mloog lus', english: 'to listen; to do as you are told', note: 'mloog (listen) + lus (words)' },
        { hmong: 'Hais lus', english: 'to speak', note: 'hais (say) + lus (words)' },
      ],
    },
    {
      id: 'foundations-action-verbs-quiz',
      kind: 'quiz',
      title: 'Quiz',
    },
  ],
}
