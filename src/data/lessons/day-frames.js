// Standalone lesson: DAY FRAMES — three days back to three days ahead, and the hnub words.
// Written 2026-09-27 for path unit u-day-frames (Yesterday & Tomorrow) — the author:
// "there are very specific names for day frames in Hmong … separating this from time of
// day, or day of the week", with a Beatles reference (made subtler 2026-09-28: no names). The names and glosses are the
// author's. JOINED spellings (naghmo, tagkis, nagkis, puagnraus) — the author, 2026-09-27:
// written together to show each is a word in its own right. Was: the spaced dictionary forms. Example sentences are the cards' own.

export const dayFrames = {
  id: 'grammar-day-frames',
  title: 'Yesterday & Tomorrow',
  summary: 'Hnub hnub, hnub hmos, naghmo, hnub no, tagkis, nagkis, puagnraus — Hmong names three days in each direction.',
  vocab: 'timeframes-days',
  steps: [
    {
      id: 'grammar-day-frames-intro',
      kind: 'intro',
      title: 'Three days back, three days on',
      body: [
        // Was: '… or a Beatles song, since Paul McCartney only ever sang about “Yesterday”.' — made
        // subtler 2026-09-28 (author: "less obvious and more subtle").
        'English has three everyday words for days: yesterday, today and tomorrow. Anything further away needs a phrase, like “the day before yesterday”. Nobody ever wrote a song about that one.',
        'Hmong keeps going. There is a word for each of the three days before today and each of the three days after it.',
        '## Before today',
        '> Hnub hnub — three days ago',
        '> Hnub hmos — two days ago (the day before yesterday)',
        // Was: '> Naghmo — yesterday (Paul McCartney’s word)' (2026-09-28, subtler)
        '> Naghmo — yesterday',
        '## Today',
        '> Hnub no — today',
        '## After today',
        '> Tagkis — tomorrow',
        '> Nagkis — two days from now (the day after tomorrow)',
        '> Puagnraus — three days from now',
        'These four are written as one word, not two: each is common enough to be a word in its own right. You may still see them written apart (nag hmos, tag kis, nag kis, puag nraus).',
        '## The hnub words',
        'Hnub (day) pairs with other words to name more time frames. These are about how often or which day in general, not about the time of day or the day of the week, and they depend a lot on context:',
        '> Ib hnub — one day, all day, or someday',
        '> Tas hnub — all the time (all day and all night)',
        '> Txhua hnub — every day',
        '> Hnub i — the other day',
        '> Lwm hnub — some other day',
        '## Where they go',
        'Like other time words, they usually start the sentence; the verb never changes:',
        // Was: 'Naghmo kuv mus.' — "went" takes tau (author, 2026-09-28).
        '> Naghmo kuv tau mus. — I went yesterday.',
        '> Tagkis kuv mus. — I will go tomorrow.',
        '> Kuv mus tsev txhua hnub. — I go home every day.',
      ],
    },
    {
      id: 'grammar-day-frames-examples',
      kind: 'examples',
      title: 'From three days ago to three days on',
      intro: 'In order. Read each one aloud.',
      items: [
        { hmong: 'Hnub hnub', english: 'three days ago' },
        { hmong: 'Hnub hmos', english: 'two days ago' },
        { hmong: 'Naghmo', audio: 'vocabulary/timeframes/hmong-time-nag-hmos.mp3', english: 'yesterday' },
        { hmong: 'Hnub no', english: 'today' },
        { hmong: 'Tagkis', audio: 'vocabulary/timeframes/hmong-time-tagkis.mp3', english: 'tomorrow' },
        { hmong: 'Nagkis', english: 'two days from now' },
        { hmong: 'Puagnraus', english: 'three days from now' },
      ],
    },
    {
      id: 'grammar-day-frames-hnub',
      kind: 'examples',
      title: 'The hnub words',
      intro: 'Hnub + another word. Read each one aloud.',
      items: [
        { hmong: 'Ib hnub', english: 'one day, all day, someday', note: 'very context-based' },
        { hmong: 'Tas hnub', english: 'all the time, all day and night' },
        { hmong: 'Txhua hnub', english: 'every day' },
        { hmong: 'Hnub i', english: 'the other day' },
        { hmong: 'Lwm hnub', english: 'some other day' },
      ],
    },
    {
      id: 'grammar-day-frames-check',
      kind: 'practice',
      title: 'Count the days',
      prompt: 'Today is Monday. Which word means Wednesday — two days from now?',
      options: ['Nagkis', 'Tagkis', 'Hnub hmos', 'Puagnraus'],
      answer: 'Nagkis',
    },
    {
      id: 'grammar-day-frames-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
