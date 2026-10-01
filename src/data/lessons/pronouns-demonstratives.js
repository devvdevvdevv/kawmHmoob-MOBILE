// Standalone lesson: Hmong demonstratives (this / that / these / those).
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.
//
// ⚠️ REWRITTEN 2026-09-27 (author: add qhov no — pasted explanation — "also make
// demonstratives better too"). The intro of path unit u-this-that.
//   • qhov no / qhov ntawd standing alone, and qhov + noun + no: from the author's paste.
//     HELD: its "qhov tsev no = this house" — the app's classifier for a house is lub
//     (lub tsev no, this lesson's own example); asked the author.
//   • "daim pib ko", "koj lub rooj no", "txog qhov ntawd": the author's pronoun story.
//   • cov + noun + no for "these" — cov is the plural classifier (Classifiers unit);
//     TODO-VERIFY as a demonstrative pattern.
//   • The ko / ntawd split keeps its TODO-VERIFY from 2026-07-16.
// Ids (lesson + steps) unchanged — they are progress keys.

export const pronounsDemonstratives = {
  id: 'foundations-pronouns-demonstratives',
  // Was: 'Pronouns & Demonstratives' — the lesson is about the pointing words only.
  title: 'This & That',
  summary: 'No, ko, ntawd — this, that, here, there, and qhov no for "this one".',
  vocab: 'demonstratives',
  steps: [
    {
      id: 'foundations-pronouns-demonstratives-intro',
      kind: 'intro',
      title: 'How demonstratives work',
      body: [
        'Demonstratives are the pointing words: this, that, these, those, here, there.',
        '## They come LAST',
        'In English “this” comes first. In Hmong the pointing word comes at the end, after the classifier and the noun:',
        '> Lub tsev no. — This house. (literally “house this”)',
        '> Tus aub no. — This dog.',
        'So the full pattern is classifier + noun + pointing word. The classifier is not optional: “tsev no” alone sounds unfinished.',
        // The author's definitions, 2026-09-27 (they replace the TODO-VERIFY ko/ntawd split).
        '## Three distances',
        'No, ko and ntawd say where the thing is, measured from yourself or from another person:',
        '> Tus aub no. — This dog. (right here: you are focusing on it directly)',
        '> Tus aub ko. — That dog. (near, or right next to, something or someone)',
        '> Tus aub ntawd. — That dog. (there, over there, at a distance)',
        '> Daim pib ko puas yog koj daim pib? — Is that ticket (the one by you) your ticket?',
        '## Classifiers as pronouns: this one, that one',
        'A classifier works like an article for its noun. It can also take the place of the noun itself: put it straight before no, ko or ntawd and it becomes a pronoun, this one or that one. The classifier still tells you what kind of thing it is.',
        '> Phau ntawv no yog kuv phau ntawv. — This book is my book.',
        '> Phau no yog kuv phau ntawv. — This one is my book.',
        '> Cov khoom ko zoo heev. — Those things are very good.',
        '> Cov ko zoo heev. — Those ones are very good.',
        '> Lub paj ntawd yog nws lub paj. — That flower is his / her flower.',
        '> Lub ntawd yog nws lub paj. — That one is his / her flower.',
        '> Tus ntawd yog leej twg? — Who is that (one)?',
        '## Qhov no: “this one”, “this thing”',
        'Qhov no can stand by itself when the noun is understood from context. It means this, this one, or this thing:',
        '> Kuv xav tau qhov no. — I want this one.',
        '> Qhov no zoo. — This one is good.',
        'Qhov ntawd is the same for that: that one, that matter.',
        '> Yaj, vim li cas koj ho nug wb txog qhov ntawd? — Yaj, why did you ask us about that?',
        'Qhov can also take a noun, as the classifier for places and matters: qhov + noun + no.',
        '> Qhov chaw no — this place',
        '> Qhov teeb meem no — this problem',
        'Don’t think of qhov as always meaning “thing”. Its exact role depends on what follows it: with no noun it stands for the thing itself; with a noun it is that noun’s classifier.',
        '## These and those: cov',
        'Cov is the classifier for a group, so cov + noun + no means these:',  // TODO-VERIFY
        '> Cov menyuam no. — These children.',
        '## Here and there',
        'Ntawm means “at”, so ntawm no is here (“at this”) and ntawm ntawd is there (“at that”):',
        '> Koj zaum ntawm koj lub rooj no. — Sit in your seat here.',
        '> Nws nyob ntawm ntawd tos peb. — He is there, waiting for us.',
        '## An easy way to remember',
        '> classifier + noun + no / ko / ntawd → this / that [noun]',
        '> classifier + no / ko / ntawd → this one / that one (the classifier stands in for the noun)',
        '> qhov no / qhov ntawd → this / that (one, thing, matter)',
        '> qhov + noun + no → this [place / matter]',
        '> ntawm no / ntawm ntawd → here / there',
        // Was (until 2026-09-27):
        //   'Demonstratives are the pointing words: this, that, these, those. In Hmong they usually follow the noun (and its classifier) rather than coming before it:',
        //   '> Lub tsev no. — This house. (literally "house this")',
        //   'Hmong also cares about where the thing is relative to the listener — "no" (near me), "ko" (near you), "ntawd" (over there / that one).',
      ],
    },
    {
      id: 'foundations-pronouns-demonstratives-examples',
      kind: 'examples',
      title: 'Common demonstratives',
      intro: 'Read each pointing word aloud.',
      items: [
        { hmong: 'No', audio: 'grammar/common-demonstratives/hmong-demonstratives-no.mp3', english: 'this', note: 'Right here, the one in focus: "lub tsev no", this house.' },
        { hmong: 'Ntawd', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawd.mp3', english: 'that', note: 'There, over there, at a distance.' },
        { hmong: 'Ko', audio: 'grammar/common-demonstratives/hmong-demonstratives-ko.mp3', english: 'that', note: 'Near, or right next to, something or someone.' },  // the author's definition, 2026-09-27
        { hmong: 'Ntawm no', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-no.mp3', english: 'here', note: 'Literally "at this (place)."' },
        { hmong: 'Ntawm ntawd', audio: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-ntawd.mp3', english: 'there', note: 'Literally "at that (place)."' },
        // Added 2026-09-27.
        { hmong: 'Qhov no', english: 'this, this one, this thing', note: 'Stands alone when the noun is understood.' },
        { hmong: 'Qhov ntawd', english: 'that, that one, that matter' },
      ],
    },
    {
      // Added 2026-09-27 — new id, so no existing progress key is reused.
      id: 'foundations-pronouns-demonstratives-patterns',
      kind: 'examples',
      title: 'Putting them together',
      intro: 'Classifier, noun, then the pointing word. Read each one aloud.',
      items: [
        { hmong: 'Lub tsev no', english: 'this house', note: 'lub + tsev + no' },
        { hmong: 'Tus aub no', english: 'this dog' },
        { hmong: 'Daim pib ko', english: 'that ticket (by you)', note: 'ko: near the listener' },
        { hmong: 'Tus ntawd', english: 'that one', note: 'the noun is understood' },
        { hmong: 'Phau no yog kuv phau ntawv.', english: 'This one is my book.', note: 'phau stands in for phau ntawv' },
        { hmong: 'Cov ko zoo heev.', english: 'Those ones are very good.' },
        { hmong: 'Lub ntawd yog nws lub paj.', english: 'That one is his / her flower.' },
        { hmong: 'Kuv xav tau qhov no.', english: 'I want this one.' },
        { hmong: 'Qhov no zoo.', english: 'This one is good.' },
        { hmong: 'Qhov chaw no', english: 'this place', note: 'qhov + noun + no' },
        { hmong: 'Qhov teeb meem no', english: 'this problem' },
        { hmong: 'Cov menyuam no', english: 'these children', note: 'cov for a group' },  // TODO-VERIFY
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-pronouns-demonstratives-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which word means "this"?',
      options: ['No', 'Ntawd', 'Ko', 'Ntawm ntawd'],
      answer: 'No',
    },*/
    {
      id: 'foundations-pronouns-demonstratives-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
