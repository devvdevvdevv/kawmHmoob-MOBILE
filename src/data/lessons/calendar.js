// Standalone lesson: the days of the week and the months of the year.
// Written 2026-09-27 for path unit u-calendar (Days & Months) — the author: "add a path
// for days of the week, and months of the year".
//
// Built from the app's own cards (days-of-week, months, calendar): a day is hnub + a
// number, a month is lub + a number + hlis ntuj. The year rule is the author's (xyoo
// comes first); thaum is the author's (it sets when). Month examples are the cards'
// AI examples — TODO-VERIFY.
// ✅ SETTLED 2026-09-27 — the author: hlis for every month (the cards had "hli" for Sep–Dec;
// fixed). Was: OPEN QUESTION — the month cards spell September–December with "hli"
// (lub cuaj hlis ntuj) and January–August with "hlis" (lub yim hlis ntuj); the short
// forms say "Cuaj Hlis". This lesson uses "hlis" throughout the rule, and quotes the
// cards as they are.

export const calendar = {
  id: 'grammar-calendar',
  title: 'Days & Months',
  summary: 'Hnub ib, lub ib hlis ntuj — Hmong counts its days and its months.',
  vocab: 'days-of-week',
  steps: [
    {
      id: 'grammar-calendar-intro',
      kind: 'intro',
      title: 'Counting the days and the months',
      body: [
        'English gives every day and every month its own name. Hmong counts them instead, so once you know the numbers you already know most of the calendar.',
        '## The days of the week: hnub + a number',
        'Hnub means day. Add a number, starting with Monday as day one:',
        '> Hnub ib — Monday (day one) · Hnub ob — Tuesday · Hnub peb — Wednesday',
        '> Hnub plaub — Thursday · Hnub tsib — Friday · Hnub rau — Saturday · Hnub xya — Sunday',
        '> Hnub no yog hnub ib. — Today is Monday.',
        '## The months: lub + a number + hlis ntuj',
        'Hlis is month. Count the months from January, with lub in front and ntuj after:',
        '> Lub ib hlis ntuj — January (the first month)',
        '> Lub tsib hlis ntuj — May (the fifth month)',
        '> Lub kaum ob hlis ntuj — December (the twelfth month)',
        'In everyday speech the short form drops lub and ntuj:',
        '> Peb Hlis — March · Cuaj Hlis — September',
        '## When: thaum',
        'Thaum sets when something happens. Put it in front of the day or the month:',
        '> Kuv pib kawm ntawv thaum Cuaj Hlis. — I start school in September.',  // TODO-VERIFY (card AI example)
        '## The year: xyoo comes first',
        '> Xyoo ob txhiab neesnkaum rau — the year 2026',
        '## The date: hnub tim',
        '> Hnub tim twg yog koj hnub yug? — What date is your birthday?',  // TODO-VERIFY (card AI example)
        '## An easy way to remember',
        '> a day → hnub + number (hnub ib = Monday)',
        '> a month → lub + number + hlis ntuj (lub ib hlis ntuj = January)',
        '> a year → xyoo + number (xyoo ob txhiab neesnkaum rau)',
        '> when → thaum + the day or month',
      ],
    },
    {
      id: 'grammar-calendar-days',
      kind: 'examples',
      title: 'The days of the week',
      intro: 'Day one is Monday. Read each one aloud.',
      items: [
        { hmong: 'Hnub ib', english: 'Monday' },
        { hmong: 'Hnub ob', english: 'Tuesday' },
        { hmong: 'Hnub peb', english: 'Wednesday' },
        { hmong: 'Hnub plaub', english: 'Thursday' },
        { hmong: 'Hnub tsib', english: 'Friday' },
        { hmong: 'Hnub rau', english: 'Saturday' },
        { hmong: 'Hnub xya', english: 'Sunday' },
      ],
    },
    {
      id: 'grammar-calendar-months',
      kind: 'examples',
      title: 'The months of the year',
      intro: 'Month one is January. Read each one aloud.',
      items: [
        { hmong: 'Lub ib hlis ntuj', english: 'January' },
        { hmong: 'Lub ob hlis ntuj', english: 'February' },
        { hmong: 'Lub peb hlis ntuj', english: 'March', note: 'short form: Peb Hlis' },
        { hmong: 'Lub plaub hlis ntuj', english: 'April' },
        { hmong: 'Lub tsib hlis ntuj', english: 'May' },
        { hmong: 'Lub rau hlis ntuj', english: 'June' },
        { hmong: 'Lub xya hlis ntuj', english: 'July' },
        { hmong: 'Lub yim hlis ntuj', english: 'August' },
        { hmong: 'Lub cuaj hlis ntuj', english: 'September', note: 'short form: Cuaj Hlis' },
        { hmong: 'Lub kaum hlis ntuj', english: 'October' },
        { hmong: 'Lub kaum ib hlis ntuj', english: 'November' },
        { hmong: 'Lub kaum ob hlis ntuj', english: 'December' },
      ],
    },
    {
      id: 'grammar-calendar-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
