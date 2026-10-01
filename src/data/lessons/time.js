// Standalone lesson: DAYS and TIME OF DAY in Hmong.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.
//
// ⚠️ REWRITTEN 2026-09-26 — the author: separate telling the time from days /
// time of day, "two different concepts, but they are related", with days FIRST.
// This lesson is now days only: parts of the day, which day, days of the week, how
// often, and where a time word goes. Clock time (teev, feeb) is the next lesson,
// time-explained.js (Telling the Time). It is the intro of path unit u-time
// (Days & Time of Day); u-clock follows it.
//
// The old version taught "teev" here too and pointed at Time Explained for "the
// full pattern" — see the commented original at the bottom.
// Examples are the app's own cards (timeframes, timeframes-days, days-of-week) and
// this lesson's original items. Claims beyond them are marked TODO-VERIFY.

export const time = {
  id: 'numbers-time',  // id unchanged — step progress is keyed on it
  // Was 'Days & Time of Day' — the day frames and the days of the week have their own units (2026-09-27).
  title: 'Time of Day',
  // Was: title 'Time Vocabulary', summary 'Words for telling time and parts of the day.'
  summary: 'Sawv ntxov, tav su, tsaus ntuj — the parts of the day, and a.m. and p.m.',
  vocab: 'timeframes',
  steps: [
    {
      id: 'numbers-time-intro',
      kind: 'intro',
      title: 'Days and the time of day',
      body: [
        'Hmong talks about time in several ways, and this app teaches each on its own: the part of the day (this lesson), which day it is (Yesterday & Tomorrow), the days of the week and months (Days & Months), and the clock (Telling the Time).',
        'They are related: a clock time ends with the part of the day you learn here, so learn these first.',
        '## Parts of the day',
        'Everyday Hmong often marks time by the part of the day rather than the clock.',
        '> Sawv ntxov — morning (literally “rise early”); after a clock time it means a.m.',
        '> Tav su — noon, midday · Tav su dua — afternoon (“past noon”)',
        '> Tsaus ntuj — evening, night (literally “the sky darkens”); after a clock time it means p.m. · Hmo ntuj — nighttime',
        'Yav in front means “the period of”: yav sawv ntxov, in the morning.',
        '> Yav sawv ntxov. — In the morning. · Yav tsaus ntuj. — In the evening.',
        // Moved 2026-09-27: which day → Yesterday & Tomorrow (day-frames.js); the days of the week →
        // Days & Months (calendar.js); how often → Yesterday & Tomorrow. Kept here, commented:
        // '## Which day',
        // '> Hnub no — today · Nag hmos — yesterday · Tag kis — tomorrow',
        // 'Tag kis can also mean morning; the sentence tells you which.',  // TODO-VERIFY: tag kis = morning vs tomorrow by context (the card says "also: morning")
        // '## The days of the week: hnub + a number',
        // 'The days are counted: hnub (day) + a number, starting with Monday.',
        // '> Hnub ib — Monday · Hnub ob — Tuesday · Hnub peb — Wednesday … Hnub xya — Sunday',
        // '> Hnub no yog hnub ib. — Today is Monday.',
        // '## How often',
        // '> Txhua hnub — every day · Lwm hnub — some other day · Hnub i — the other day',
        '## Where the time word goes',
        'A day or time-of-day word usually comes at the START of the sentence, or at the END for how often. The verb never changes.',
        '> Hnub no kuv mus. — I am going today.',
        // Was: 'Naghmo kuv mus.' — "went" takes tau (author, 2026-09-28).
        '> Naghmo kuv tau mus. — I went yesterday.',
        '> Tagkis kuv mus. — I will go tomorrow.',
        '> Kuv mus tsev txhua hnub. — I go home every day.',
        // Was: 'Notice that the same “kuv mus” is past, present or future: the time word does the work. …' (2026-09-28, "went" takes tau)
        'Notice that mus itself never changes: the time word does the work, with a small marker like tau for something already done. (Time Markers teaches those small words.)',
        // The author, 2026-09-27: thaum always sets the time.
        '## Thaum: when, during',
        'Thaum is the word that sets WHEN something happens. Put it in front of a time or an event, and it means when, during, or at:',
        '> Chai mus yos hav zoov thaum tsaus ntuj. — Chai goes hunting in the evening.',
        '> Thaum sawv ntxov, kuv haus dej. — In the morning, I drink water.',
        '> Thaum twg? — When?',
      ],
    },
    {
      id: 'numbers-time-examples',
      kind: 'examples',
      // Was: 'Times of day' — with Teev (o'clock) among them; teev moved to Telling the Time.
      title: 'Parts of the day',  // was 'Parts of the day, and which day' (2026-09-27)
      intro: 'Read each word aloud.',
      items: [
        { hmong: 'Sawv ntxov', audio: 'vocabulary/timeframes/hmong-time-sawv-ntxov.mp3', english: 'morning', note: 'Literally "rise early."' },
        { hmong: 'Tav su', audio: 'vocabulary/timeframes/hmong-time-tavsu.mp3', english: 'noon / midday', note: 'Midday — the time of the midday meal.' }, // TODO-VERIFY: literal sense of "tav su"
        { hmong: 'Tav su dua', audio: 'vocabulary/timeframes/hmong-time-tavsu-dua.mp3', english: 'afternoon', note: '"Dua" = past — after midday has gone by.' },
        { hmong: 'Tsaus ntuj', audio: 'vocabulary/timeframes/hmong-time-tsaus-ntuj.mp3', english: 'evening / night', note: 'Literally "the sky darkens." Often preceded by "yav" (the period of).' },
        { hmong: 'Hmo ntuj', english: 'nighttime' },  // added 2026-09-27
        { hmong: 'Ib tag hmos', english: 'midnight' },  // added 2026-09-27
        // { hmong: 'Hnub no', english: 'today' },
        // { hmong: 'Nag hmos', audio: 'vocabulary/timeframes/hmong-time-nag-hmos.mp3', english: 'last night / yesterday', note: 'Context decides between "yesterday" and "last night."' }, // TODO-VERIFY: primary sense of "nag hmos"
        // { hmong: 'Tag kis', audio: 'vocabulary/timeframes/hmong-time-tagkis.mp3', english: 'tomorrow', note: 'Also written together as "tagkis."' },
        // { hmong: 'Hnub ib', english: 'Monday', note: 'hnub + a number: hnub ob Tuesday … hnub xya Sunday.' },
        // { hmong: 'Txhua hnub', english: 'every day' },
        // Removed 2026-09-26 — the clock belongs to Telling the Time (time-explained.js):
        // { hmong: 'Teev', audio: 'vocabulary/timeframes/hmong-time-teev.mp3', english: "o'clock / hour", note: 'Pairs with numbers: "ib teev" = one o\'clock / one hour.' },
      ],
    },
    {
      id: 'numbers-time-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}

// ── The original intro (until 2026-09-26), kept for reference ──────────────
//   title 'Talking about time'
//   'This lesson covers the words for parts of the day and how to tell the time in Hmong. It builds directly on the numbers lesson — see "Time Explained" for the full pattern of assembling a spoken clock time.',
//   'Everyday Hmong often marks time by the part of the day — morning, midday, dark — rather than the clock. For clock time, "teev" (hour) does the work with a number in front:',
//   '> Ob teev. — Two o\'clock.',
