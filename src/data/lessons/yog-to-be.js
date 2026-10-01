// Standalone lesson: YOG, NYOB and MUAJ — the Hmong ways of saying "to be".
//
// ⚠️ REWRITTEN 2026-09-27 for path unit u-yog (To Be: Yog & Nyob). Built from the
// author's own notes, which override the GPT pass where they differ:
//   • yog describes the ESSENCE of something — what it is, a lasting state ("yog is
//     permanent, nyob is more temporary"). "Lub no yog lub tsev."
//   • nyob is for a CONDITION: physical location, a physical state (hot, cold, sick —
//     "kuv nyob kub", never "kuv kub"), and emotions — where the adjective alone is
//     most common and nyob is implied ("kuv zoo siab" = "kuv nyob zoo siab"), context-based.
//   • hu ua (what something is CALLED) has its own lesson and unit: grammar-hu-ua.
// From the GPT pass (reviewed against the app's rules): muaj for age and having,
// tsis yog / puas yog / yog lawm, yog li (so), yog tias (if), the common mistakes.
// Recorded audio items kept. Ids (lesson + steps) unchanged — progress keys.
// ⚠️ SPLIT 2026-09-28 (author: "separate nyob and yog paths … but maintain that to be is
// similar between them including hu ua"). The Nyob section MOVED to lessons/nyob.js
// (path unit u-nyob); a pointer and the yog-or-nyob contrasts stay here. The opening frame
// "Three ways to say to be" is shared word for word by the Yog, Hu Ua and Nyob lessons.

export const yogToBe = {
  id: 'foundations-yog-to-be',
  // Was: 'Yog — To Be'
  // Was: 'Yog & Nyob — To Be' (until the 2026-09-28 split)
  title: 'Yog | To Be: What Something Is',
  // Was: 'Yog for what something is, nyob for where and how it is, muaj for age — three words for one English "to be".'
  summary: 'Yog for what something is — its essence — and muaj for age. Hu ua and nyob are the other two ways to say “to be”.',
  vocab: 'yog-to-be',
  steps: [
    {
      id: 'foundations-yog-to-be-intro',
      kind: 'intro',
      title: 'Three ways to say "to be"',
      body: [
        // Was the first line of a 5-line list (yog, nyob, hu ua, muaj); replaced 2026-09-28 by the shared frame.
        // 'English uses one verb, “to be”, for everything: I am Hmong, I am at home, I am hot, I am twenty. Hmong splits that job between different words, and choosing the right one depends on what kind of “being” you mean.',
        // '> yog — what something IS: its essence, a lasting state',
        // '> nyob — where something is, or its condition right now',
        // '> hu ua — what something is CALLED (its own lesson: Names)',
        // '> muaj — for age and for having',
        // 2026-09-28 (author): each explained part ends with a pointer to the upcoming lesson that covers it more.
        '## Three ways to say “to be”',
        'English uses “is, am, are” for all of these. Hmong splits them, and each has its own lesson:',
        '> yog — what something IS (Kuv yog Hmoob — I am Hmong)',
        '> hu ua — what something is CALLED (Kuv lub npe hu ua Chai — My name is Chai)',
        '> nyob — WHERE something is, or HOW it is right now (Kuv nyob hauv tsev — I am at home)',
        'All three are the same English “to be”. The question is which kind of being you mean. This lesson is yog.',
        'Age is a fourth case: it takes muaj (have), not yog. See below.',
        'More on this later: hu ua and nyob each get their own lesson next, To Be Called: Hu Ua and To Be: Nyob.',
        // The author, 2026-09-27: yog can mean if, is, are — by context.
        '## What yog can mean: is, am, are — or if',
        'Yog is one word with more than one job, and only the context tells you which:',
        '> is · am · are — Kuv yog Hmoob. (I am Hmong) · Peb yog Hmoob. (We are Hmong) · Lub no yog lub tsev. (This is the house)',
        // The author, 2026-09-28: yog hais tias is the usual "if" — easier to tell apart from yog "to be"; the two are interchangeable, but yog hais tias is the more literal if. Was: 
        // '> if — at the start of a clause: Yog koj xav. (If you want.) · Yog tias nag los … (If it rains …)',
        '> if — at the start of a clause: Yog hais tias nag los … (If it rains …) · Yog koj xav. (If you want.)',
        'For if, people usually say yog hais tias. It makes it easy to tell apart from yog meaning “is”. Yog on its own (or yog tias) works too and means the same, but yog hais tias is the more literal if.',
        'Hmong has no separate words for is, am and are: yog covers all three, whoever the subject is.',
        'More on this later: yog as if comes back in Joining Words.',
        '## Yog: what something is',
        'Yog describes the essence of something, not a passing condition. It links one noun to another noun: who or what something is.',
        '> Kuv yog Hmoob. — I am Hmong.',
        '> Lub no yog lub tsev. — This is the house.',
        '> Nws yog kws kho mob. — He is a doctor.',
        '> Tus pojniam yog ib tus neeg zoo. — The woman is a good person.',
        'More on this later: yog with this and that, and with mine and yours, in This & That and Mine & Yours.',
        // REWRITTEN 2026-09-28 (author): the "never yog before a describing word" rule came from
        // the GPT pass. The author: noun + adjective (neeg zoo) describes a noun directly; yog
        // describes it through a statement (koj yog ib tug neeg zoo, tsev yog loj). Both mean the
        // same thing but differ in grammar and emphasis. Linguists' terms: attributive vs
        // predicative. The ambiguity point (lub tsev loj = "the big house" or "the house is
        // big") is Claude's framing of why yog helps. Was:
        // '## Never before a describing word',
        // 'A describing word works as a verb on its own, so there is no yog in front of it:',
        // '> Nws zoo heev. — He is very good. (not “Nws yog zoo”)',
        // ⚠️ NO YOG BEFORE A DESCRIBING WORD — the author, 2026-09-28 (emphatic): Nws zoo heev ✓, Nws yog zoo heev ✗. This reverses the same-day "through yog" softening. Was:
        // '## Describing a noun: directly, or through yog',
        // 'There are two ways to describe a noun. They mean the same thing, but they differ in grammar and in emphasis.',
        // '## Directly: noun + describing word',
        // 'The describing word goes right after the noun and becomes part of what you call it:',
        // '> neeg zoo — a good person (literally “person good”)',
        // '> tsev loj — a big house',
        // '## Through yog: a statement about the noun',
        // 'With yog, you make a statement about the noun instead: you say what it is like. This puts more weight on the description.',
        // '> Koj yog ib tug neeg zoo. — You are a good person.',
        // '> Tsev yog loj. — The house is big.',
        // 'In the first, yog links you to “a good person”: the direct form sits inside the statement. In the second, yog says it straight: the house IS big.',
        // '## Why yog helps',
        // 'A describing word can also work as a verb by itself, so lub tsev loj alone can be “the big house” or “the house is big”, and context decides. Adding yog makes it clearly a statement.',
        // '> neeg zoo → Koj yog ib tug neeg zoo. — a good person → You are a good person.',
        // '> tsev loj → Tsev yog loj. — a big house → The house is big.',
        '## Describing someone: no yog before the describing word',
        'When you describe someone or something directly with a describing word, you do NOT use yog. The describing word works as the verb by itself:',
        '> Nws zoo heev. — He is very good. ✓',
        '> ✗ Nws yog zoo heev. — awkward: people will understand you, but it is not right.',
        'More on this later: describing words get their own lesson, Describing Words.',
        '## Yog + a noun that carries the description',
        'Yog only comes in when there is a NOUN after it. The describing word then sits inside that noun, right after it:',
        '> neeg zoo — a good person (noun + describing word)',
        '> Koj yog ib tug neeg zoo. — You are a good person. (yog + a good person)',
        // The author's formula, 2026-09-28.
        'The full shape, with the optional parts in brackets, added when the context needs them:',
        '> subject + yog + (quantifier) + noun + (describing word) + (intensifier, like heev)',
        'A quantifier brings its classifier with it: ib tug.',
        '> Nws yog ib tug neeg. — He is a person.',
        '> Nws yog ib tug neeg zoo. — He is a good person.',
        '> Nws yog ib tug neeg zoo heev. — He is a very good person.',
        'So there are two correct ways to say much the same thing, with different grammar:',
        '> Nws zoo heev. — He is very good. (the describing word is the verb)',
        '> Nws yog ib tug neeg zoo. — He is a good person. (yog links him to a noun)',
        'More on this later: nouns with their describing words in Describing Words and Common Describing Words.',
        // MOVED 2026-09-28 to lessons/nyob.js (path unit u-nyob). TO RESTORE: uncomment.
        // '## Nyob: where, and how right now',
        // 'Nyob literally means to stay or to live. It is the “to be” for a condition: where you are, or how you are at the moment.',
        // 'Location:',
        // '> Kuv nyob hauv tsev. — I am at home.',
        // 'A physical state — hot, cold, sick. For these, always use nyob:',
        // '> Kuv nyob kub. — I am hot. (never “Kuv kub”)',
        // 'An emotion. Here the describing word on its own is the most common, and nyob is understood; both are right, depending on context:',
        // '> Kuv zoo siab. = Kuv nyob zoo siab. — I am happy.',
        // '> Kuv nyuaj siab. = Kuv nyob nyuaj siab. — I am sad.',
        // 'And the everyday greeting:',
        // '> Koj nyob li cas? — How are you doing?',
        '## Nyob: where, and how right now',
        // Reworded 2026-09-28 (author: describe the state so it isn't confused with describing
        // words — "a bit but not so much"). Was:
        // 'Where something is, or how it is at the moment (hot, cold, sick, a feeling), takes nyob, not yog. Nyob has its own lesson:',
        // '> Kuv nyob hauv tsev. — I am at home. · Kuv nyob kub. — I am hot.',
        'Nyob is for where someone is, and for the state they are in right now: something that comes and goes, like being hot, cold or sick.',
        '> Kuv nyob hauv tsev. — I am at home. (where)',
        '> Kuv nyob kub. — I am hot. (a state, right now)',
        'A describing word is different: it says what someone is like, as in Nws zoo heev, he is very good. A state is how you are at the moment; a describing word is what you are like.',
        'More on this later: To Be: Nyob, the next lessons along.',
        '## Muaj: age and having',
        'Age is something you have, so it takes muaj (have), not yog:',
        '> Kuv muaj neesnkaum xyoo. — I am twenty years old.',
        '> Kuv muaj ib tus aub. — I have a dog.',
        'More on this later: saying your age, with numbers and xyoo, in the Numbers lesson.',
        '## No, and asking: tsis yog, puas yog',
        '> Nws tsis yog kws kho mob. — He is not a doctor.',
        '> Koj puas yog Mai? — Are you Mai?',
        '> Yog. — Yes. · Tsis yog. — No. · Yog lawm. — That’s right.',
        'More on this later: tsis in Not & Don’t, puas in Questions, and answering with yog in Answering & Agreeing.',
        '## Yog in other jobs',
        // Was: 'Yog also opens two very common phrases, …' — los yog added 2026-09-28 (author).
        'Yog also appears in very common phrases where it does not mean “to be” at all:',
        // Was (yog li is a SOFT reaction, not a therefore — author, 2026-09-28):
        // '> Nag los, yog li peb nyob tsev. — It is raining, so we stay home. (yog li = so)',
        '> Koj tsis kam mus? Yog li ces kuv mus ib leeg. — You don’t want to go? In that case, I’ll go alone. (yog li = in that case)',
        // The author, 2026-09-28: yog hais tias is the usual "if" — easier to tell apart from yog "to be"; the two are interchangeable, but yog hais tias is the more literal if. Was: 
        // '> Yog tias nag los, peb nyob tsev. — If it rains, we stay home. (yog tias = if)',
        '> Yog hais tias nag los, peb nyob tsev. — If it rains, we stay home. (yog hais tias = if; yog tias works too)',
        '> Koj puas xav haus dej los yog kas fes? — Do you want to drink water or coffee? (los yog = or)',
        'Los yog means or. Do not mix it up with los on its own (to come; to fall, as in nag los, it is raining) followed by a yog that starts the next part: in Nag los, yog li … the two words belong to different halves of the sentence.',
        'More on this later: yog hais tias and los yog in Joining Words; yog li, and how it differs from thiaj li, ces and txawm, in So, Then & Therefore.',
        '## Common mistakes',
        // Removed 2026-09-28 — yog before a describing word is a statement with emphasis, not a
        // mistake (author). Was:
        // '> ✗ Kuv yog zoo. → ✓ Kuv zoo. (no yog before a describing word)',
        // Restored 2026-09-28 (author: NO yog before a describing word).
        '> ✗ Nws yog zoo heev. → ✓ Nws zoo heev. (no yog before a describing word)',
        '> ✗ Kuv yog hauv tsev. → ✓ Kuv nyob hauv tsev. (a place takes nyob)',
        '> ✗ Kuv kub. → ✓ Kuv nyob kub. (a physical state takes nyob)',
        '> ✗ Kuv yog neesnkaum xyoo. → ✓ Kuv muaj neesnkaum xyoo. (age takes muaj)',
        '## An easy way to remember',
        '> what it IS → yog (is, am, are) · for if, say yog hais tias (yog alone also works) · or → los yog',
        '> what it is CALLED → hu ua',
        '> where it is, or how it is right now → nyob',
        '> how old, or what you have → muaj',
      ],
    },
    {
      id: 'foundations-yog-to-be-examples',
      kind: 'examples',
      title: 'Using "yog"',
      intro: 'Read each sentence aloud.',
      items: [
        { hmong: 'Kuv yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', english: 'I am', note: '"Kuv yog Hmoob" = I am Hmong.' },
        { hmong: 'Koj yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', english: 'You are', note: 'Pairs naturally with "puas" questions: "Koj puas yog…?" (Are you…?)' },
        { hmong: 'Nws yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', english: 'He / she is', note: 'One pronoun covers he, she, and it.' },
        { hmong: 'Tsis yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', english: 'is not / no', note: '"Tsis" is the general negator — it works on other verbs too.' },
        { hmong: 'Puas yog?', audio: 'grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3', english: 'Is it? / Right?', note: 'Tacked on at the end of a sentence it works like "…right?"' },
      ],
    },
    {
      // Added 2026-09-27 — new id, so no existing progress key is reused.
      id: 'foundations-yog-to-be-which',
      kind: 'examples',
      title: 'Yog, nyob or muaj?',
      intro: 'Each sentence picks the right “to be”. Read them aloud.',
      items: [
        { hmong: 'Lub no yog lub tsev.', english: 'This is the house.', note: 'yog — what it is' },
        // Added 2026-09-28 — direct vs through yog (author).
        { hmong: 'Neeg zoo', english: 'a good person', note: 'direct — noun + describing word' },
        { hmong: 'Koj yog ib tug neeg zoo.', english: 'You are a good person.', note: 'yog + a noun (neeg zoo)' },
        // Removed 2026-09-28 (author: no yog before a describing word). Was: { hmong: 'Tsev yog loj.', english: 'The house is big.', note: 'through yog — with emphasis' },
        { hmong: 'Nws zoo heev.', english: 'He is very good.', note: 'no yog before a describing word' },
        { hmong: 'Nws yog kws kho mob.', english: 'He is a doctor.', note: 'yog — what he is' },
        { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.', note: 'nyob — where' },
        { hmong: 'Kuv nyob kub.', english: 'I am hot.', note: 'nyob — a physical state' },
        { hmong: 'Kuv zoo siab.', english: 'I am happy.', note: 'an emotion — nyob understood' },
        { hmong: 'Koj nyob li cas?', english: 'How are you doing?', note: 'nyob — how you are' },
        { hmong: 'Kuv muaj neesnkaum xyoo.', english: 'I am twenty years old.', note: 'muaj — age' },
        { hmong: 'Nws tsis yog kws kho mob.', english: 'He is not a doctor.', note: 'tsis yog — is not' },
      ],
    },
    {
      id: 'foundations-yog-to-be-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}

// ── THE PREVIOUS VERSION (until 2026-09-27), kept for reference ───────────────
// // Standalone lesson: "yog" — the Hmong verb "to be".
// // Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// // instructions/audio-files.md. Follows the lesson model in ../lessons.js.
// 
// export const yogToBe = {
//   id: 'foundations-yog-to-be',
//   title: 'Yog — To Be',
//   summary: 'How "yog" links a noun to what it is, and when you can leave it out.',
//   vocab: 'yog-to-be',
//   steps: [
//     {
//       id: 'foundations-yog-to-be-intro',
//       kind: 'intro',
//       title: 'How "yog" works',
//       body: [
//         '"Yog" is the Hmong verb "to be". Learn it as "equals," not as English "to be" everywhere — it links one noun to another, and it is generally NOT used before an adjective.',
//         '> Kuv yog Hmoob. — I am Hmong.',
//         'That works because both sides are nouns: "kuv" (I) equals "Hmoob" (Hmong). For being somewhere, Hmong reaches for a different word entirely — "nyob", not "yog":',
//         '> Kuv nyob hauv tsev. — I am at home.',
//         'And adjectives stand on their own, with no "to be" at all — see the Adjectives lesson for that half of the rule.',
// 
//         '## One word, several jobs',
//         '"Yog" is one of the most context-dependent words in Hmong. Depending on where it sits, it can carry the sense of "is", "are", or "if":',
//         '> Lub no yog lub tsev. — This is the house.',
//         '> Peb yog Hmoob. — We are Hmong.',
//         '> Tus pojniam yog ib tus neeg zoo. — The woman is a good person.',
//         '> Yog koj xav. — If you want.',
//         'The first three describe what something IS — its essence, not a temporary condition. The last uses the same word to open a condition instead. Only context tells them apart.',
// 
//         'This is genuinely one of the harder words to get a feel for, precisely because it does so much work. The Readings unit is the fastest way to absorb the pattern — seeing "yog" used naturally, again and again, teaches the context better than a rule can.',
//       ],
//     },
//     {
//       id: 'foundations-yog-to-be-examples',
//       kind: 'examples',
//       title: 'Using "yog"',
//       intro: 'Read each sentence aloud.',
//       items: [
//         { hmong: 'Kuv yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', english: 'I am', note: '"Kuv yog Hmoob" = I am Hmong.' },
//         { hmong: 'Koj yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', english: 'You are', note: 'Pairs naturally with "puas" questions: "Koj puas yog…?" (Are you…?)' },
//         { hmong: 'Nws yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', english: 'He / she is', note: 'One pronoun covers he, she, and it.' },
//         { hmong: 'Tsis yog', audio: 'grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', english: 'is not / no', note: '"Tsis" is the general negator — it works on other verbs too.' },
//         { hmong: 'Puas yog?', audio: 'grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3', english: 'Is it? / Right?', note: 'Tacked on at the end of a sentence it works like "…right?"' },
//       ],
//     },
//     // quick-check removed — the lesson now hands off to the word bank (notes/37)
//     /*{
//       id: 'foundations-yog-to-be-practice',
//       kind: 'practice',
//       title: 'Quick check',
//       prompt: 'How do you say "is not"?',
//       options: ['Tsis yog', 'Puas yog', 'Kuv yog', 'Nws yog'],
//       answer: 'Tsis yog',
//     },*/
//     {
//       id: 'foundations-yog-to-be-quiz',
//       kind: 'quiz',
//       title: 'Learn the words',
//     },
//   ],
// }
