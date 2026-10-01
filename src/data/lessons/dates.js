// Standalone lesson: WRITING DATES in Hmong.
// Written 2026-09-27 for path unit u-dates (Writing Dates) — the author: "we need to add
// writing dates … its own path. Western-influenced dates list the month first, Asian-
// influenced dates list the month second; either way is acceptable, but we focus on
// west." The author's labels ("the classifiers for dates"): hnub tim = date, hnub = day,
// xyoo = year. The author's example: month → hnub tim → xyoo, "Jan 2 2026".
// (The author's first example read "Lub rau ib hlis ntuj …"; the author confirmed 2026-09-27
// that "rau" was a typo — January is "Lub ib hlis ntuj".) Other dates are built on the same
// pattern by Claude — TODO-VERIFY.

export const dates = {
  id: 'grammar-dates',
  title: 'Writing Dates',
  summary: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau — January 2, 2026.',
  vocab: 'dates',
  steps: [
    {
      id: 'grammar-dates-intro',
      kind: 'intro',
      title: 'How a Hmong date is written',
      body: [
        'A Hmong date is built from three labels, and each one goes IN FRONT of its number, the way a classifier goes in front of its noun:',
        '> lub … hlis ntuj — the month: lub ib hlis ntuj, January (month one)',
        '> hnub tim — the date, the day of the month: hnub tim ob, the 2nd',
        '> xyoo — the year: xyoo ob txhiab neesnkaum rau, 2026',
        '## Western order: month, day, year',
        'This is the order the app uses, like an American date: the month first, then the day, then the year.',
        '> Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau. — January 2, 2026',
        '> Lub xya hlis ntuj hnub tim plaub. — July 4',
        '> Lub kaum ob hlis ntuj hnub tim neesnkaum tsib. — December 25',
        '## Asian order: day, month, year — also correct',
        'Asian-influenced dates put the day first and the month second. Either order is acceptable; just use one consistently.',
        '> Hnub tim ob, lub ib hlis ntuj, xyoo ob txhiab neesnkaum rau. — 2 January 2026',
        '## Asking the date',
        'Put pes tsawg where the number would go, as always:',
        '> Hnub no yog hnub tim pes tsawg? — What is the date today?',
        '> Hnub no yog lub tsib hlis ntuj hnub tim kaum. — Today is May 10.',
        '## Birthdays: hnub yug',
        '> Kuv hnub yug yog lub peb hlis ntuj hnub tim kaum tsib. — My birthday is March 15.',
        '## An easy way to remember',
        '> month → lub + number + hlis ntuj',
        '> day → hnub tim + number',
        '> year → xyoo + number',
        '> Western order → month, day, year · Asian order → day, month, year',
      ],
    },
    {
      id: 'grammar-dates-examples',
      kind: 'examples',
      title: 'Dates, written out',
      intro: 'Month, then hnub tim, then xyoo. Read each one aloud.',
      items: [
        { hmong: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau', english: 'January 2, 2026' },
        { hmong: 'Lub peb hlis ntuj hnub tim kaum tsib', english: 'March 15' },
        { hmong: 'Lub xya hlis ntuj hnub tim plaub', english: 'July 4' },
        { hmong: 'Lub cuaj hlis ntuj hnub tim ib', english: 'September 1' },
        { hmong: 'Lub kaum ob hlis ntuj hnub tim neesnkaum tsib', english: 'December 25' },
        { hmong: 'Xyoo ob txhiab neesnkaum rau', english: 'the year 2026' },
        { hmong: 'Hnub tim ob, lub ib hlis ntuj', english: '2 January (Asian order)', note: 'day first — also correct' },
      ],
    },
    {
      id: 'grammar-dates-check-1',
      kind: 'practice',
      title: 'Write the date',
      prompt: 'How do you write "January 2, 2026" (Western order)?',
      options: [
        'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau',
        'Xyoo ob txhiab neesnkaum rau, hnub tim ob, lub ib hlis ntuj',
        'Lub ob hlis ntuj hnub tim ib, xyoo ob txhiab neesnkaum rau',
        'Hnub tim ib, lub ob hlis ntuj, xyoo ob txhiab neesnkaum rau',
      ],
      answer: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau',
    },
    {
      id: 'grammar-dates-check-2',
      kind: 'practice',
      title: 'Read the date',
      prompt: 'What does "Lub xya hlis ntuj hnub tim plaub" mean?',
      options: ['July 4', 'April 7', 'July 14', 'June 4'],
      answer: 'July 4',
    },
    {
      id: 'grammar-dates-check-3',
      kind: 'practice',
      title: 'The labels',
      prompt: 'Which label goes in front of the year?',
      options: ['xyoo', 'hnub tim', 'hnub', 'lub … hlis ntuj'],
      answer: 'xyoo',
    },
    {
      id: 'grammar-dates-check-4',
      kind: 'practice',
      title: 'Ask the date',
      prompt: 'How do you ask "What is the date today?"',
      options: [
        'Hnub no yog hnub tim pes tsawg?',
        'Pes tsawg hnub tim yog hnub no?',
        'Hnub no pes tsawg xyoo?',
        'Hnub tim no yog pes tsawg hnub?',
      ],
      answer: 'Hnub no yog hnub tim pes tsawg?',
    },
    {
      id: 'grammar-dates-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
