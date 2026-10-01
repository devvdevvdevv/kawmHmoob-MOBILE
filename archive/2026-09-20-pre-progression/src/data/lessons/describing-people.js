// Standalone lesson: describing PEOPLE — an adjective attached straight to the
// noun, versus the same adjective routed through "yog".
//
// ── WHY THIS LESSON EXISTS ─────────────────────────────────────────────────
//
// The two halves were already taught, on opposite sides of the unit:
//
//   yog-to-be.js     "yog" links noun to noun, and carries ESSENCE
//                    — it even ships the example `Tus pojniam yog ib tus neeg zoo.`
//   adjectives.js    an adjective follows its noun and needs no "to be" at all
//
// What neither does is put the two constructions side by side and say WHICH ONE
// TO REACH FOR. A learner who has read both still writes
// `tus poj niam yog ib tus neeg zoo siab` when they mean `tus poj niam zoo siab`,
// because English ("she is a happy person") licenses the long way round and
// nothing here has told them it is the wrong register.
//
// ⚠️ THE CORE RULE IS THE USER'S, GIVEN 2026-09-16, and is the reason this
// lesson was written:
//
//   > `tus poj niam zoo siab` is the more accurate term when describing
//   > something directly, rather than `tus poj niam yog ib tus neeg zoo siab`,
//   > which is used when describing a concept.
//
// Everything below is either that rule, or a gloss copied verbatim from
// src/data/vocabulary.js. Anything I extrapolated is marked TODO-VERIFY — I do
// not speak Hmong, and this lesson teaches a distinction subtle enough that a
// confident wrong sentence would be worse than no lesson.
//
// ⚠️ AUDIO DELIBERATELY OMITTED. Most `personality-siab` entries carry
// `audioFile: null`, and a path that does not resolve is a SILENT no-op rather
// than an error (the lesson-audio checker exists for exactly this). Add `audio`
// per item once real recordings exist, and let scripts/check-lesson-audio.mjs
// assert them.

export const describingPeople = {
  id: 'grammar-describing-people',
  title: 'Describing People | Piav Txog Neeg',  // TODO-VERIFY: "Piav Txog Neeg" as a natural heading for this
  summary: 'Attach the describing word straight to the person — and know when "yog" is the wrong tool.',
  vocab: 'personality-siab',
  steps: [
    {
      id: 'grammar-describing-people-intro',
      kind: 'intro',
      title: 'Two ways to say it, one that sounds right',
      body: [
        'You already know both pieces: an adjective follows the noun it describes, and "yog" links one noun to another. This lesson is about choosing between them — because English lets you say it either way, and Hmong does not.',

        '## The short way is the normal way',
        'To describe a person directly, put the describing word straight onto them. Classifier → noun → adjective, and nothing in between:',
        '> Tus poj niam zoo siab. — The woman is happy.',
        '> Tus txiv neej siab dav. — The man is generous.',
        'There is no word for "is" in either sentence, and there does not need to be. "Tus" is the classifier for a person, "poj niam" is the noun, and "zoo siab" lands on the end. That is a complete, natural thing to say.',

        '## The long way says something different',
        'You can route the same adjective through "yog", but it changes what you are doing:',
        '> Tus poj niam yog ib tus neeg zoo siab. — The woman is a happy person.',
        'Read that literally: the woman EQUALS one person who is happy. You have stopped describing her and started sorting her into a category — "a happy person" as a kind of person. It is grammatical, and it is what you want when you genuinely mean the category. It is not what you want when you simply mean she is happy.',

        '## The difference in one line',
        '> Direct description → attach the adjective. **Tus poj niam zoo siab.**',
        '> Naming a category → use yog. **Tus poj niam yog ib tus neeg zoo siab.**',
        'English blurs these — "she is happy" and "she is a happy person" feel like the same sentence with different emphasis. In Hmong the second is a heavier construction and reaching for it by default is one of the clearest signs of an English speaker writing Hmong.',

        '## Why "yog" pulls that way',
        'This is the "yog" rule doing exactly what it always does. "Yog" equates two NOUNS — so to use it at all, the adjective has to be wrapped up into a noun phrase first ("ib tus neeg zoo siab", one happy person). That wrapping is the extra weight you can hear. When there is no noun on the right-hand side, there is no job for "yog".',

        '## Describing with the liver',
        'Hmong locates character and feeling in the liver — "siab" — where English uses the heart. Most of the words for describing a person are built from it:',
        '> siab dav — considerate, generous (lit. "wide liver")',
        '> siab nqaim — selfish, inconsiderate (lit. "narrow liver")',
        '> siab phem — mean, cruel (lit. "bad liver")',
        '> zoo siab — glad, happy (lit. "good liver")',
        'They attach like any other adjective: **Tus me nyuam siab dav.** — The child is generous.',  // TODO-VERIFY: this exact sentence

        '## Watch which side "siab" sits on',
        'Some of these put "siab" first and some put it second, and the two orders are not interchangeable — compare "siab phem" (mean) with "zoo siab" (happy). Learn each expression as one unit rather than assembling it from its parts.',  // TODO-VERIFY: whether a general rule governs the order, or it is simply lexical per expression

        'Study the full set in the word bank, then come back for the quiz.',
      ],
    },
    {
      id: 'grammar-describing-people-examples',
      kind: 'examples',
      title: 'The same person, described two ways',
      intro: 'The short form first, then the "yog" form it is usually mistaken for. Read each pair aloud and listen for the extra weight in the second.',
      items: [
        {
          hmong: 'Tus poj niam zoo siab.',
          english: 'The woman is happy.',
          note: 'The direct description — the one to reach for by default.',
        },
        {
          hmong: 'Tus poj niam yog ib tus neeg zoo siab.',
          english: 'The woman is a happy person.',
          note: 'Grammatical, but it sorts her into a category rather than describing her. Use it when you mean the category.',
        },
        {
          hmong: 'Tus txiv neej siab dav.',
          english: 'The man is generous.',
          note: '"Siab dav" — literally "wide liver". Attaches straight to the noun, like any adjective.',  // TODO-VERIFY: this exact sentence
        },
        {
          hmong: 'Tus me nyuam siab phem.',
          english: 'The child is mean.',
          note: 'Same shape again: classifier → noun → describing word.',  // TODO-VERIFY: this exact sentence
        },
        {
          hmong: 'Nws zoo siab.',
          english: 'He/she is happy.',
          note: '"Nws" covers he, she and it, and needs no classifier — the pattern survives without one.',
        },
      ],
    },
    {
      id: 'grammar-describing-people-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
