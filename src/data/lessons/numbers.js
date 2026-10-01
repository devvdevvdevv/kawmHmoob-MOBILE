// Standalone lesson: Hmong numbers.
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const numbers = {
  id: 'numbers-counting',
  title: 'Numbers',
  summary: 'Counting in Hmong, from one upward.',
  vocab: 'numbers',
  reference: 'grammar',
  steps: [
    {
      id: 'numbers-counting-intro',
      kind: 'intro',
      title: 'Counting in Hmong',
      // ⚠️ EXPANDED 2026-09-27 (author: "update the counting in Hmong lesson so it has
      // more data"). Everything is built from the Numbers set's own spellings (tens
      // written solid: neesnkaum, pebcaug…; ib puas, txhiab, vam, plhom) and its example
      // phrases. The caug/caum split is read straight off those spellings. Ordinals
      // (thib) come from the `time-thib` card — TODO-VERIFY. Age follows the house rule
      // "muaj <number> xyoo". Was only: teens + a tone warning.
      body: [
        'Hmong numbers are regular and quick to learn. Once you know one through ten, every larger number is built from the same words, like building blocks.',
        '## Eleven to nineteen: kaum + the number',
        'Say ten, then the extra:',
        '> Kaum ib — eleven (ten-one)',
        '> Kaum ob — twelve (ten-two)',
        '> Kaum tsib — fifteen · Kaum cuaj — nineteen',
        '## The tens: the number + caug or caum',
        'Twenty is its own word, neesnkaum. From thirty up, say the number and then caug or caum (“ten”). Which one depends on the number before it: after peb, plaub and tsib, which all end in -b, it is caug. After rau, xya, yim and cuaj it is caum.',
        '> Neesnkaum — 20',
        '> Pebcaug — 30 · Plaubcaug — 40 · Tsibcaug — 50',
        '> Raucaum — 60 · Xyacaum — 70 · Yimcaum — 80 · Cuajcaum — 90',
        '## Any number up to 99: the ten, then the one',
        '> Neesnkaum ib — 21',
        '> Pebcaug tsib — 35',
        '> Cuajcaum cuaj — 99',
        '## Hundreds, thousands and more',
        'The big numbers work the same way: the count first, then the size word.',
        '> Ib puas — 100 · Ob puas — 200',
        '> Ib puas tsibcaug — 150 (a hundred, fifty)',
        '> Ib txhiab — 1,000 · Ob txhiab — 2,000',
        '> Ib vam — 10,000 · Ib plhom — 1,000,000',
        // The author, 2026-09-27: "include xyoo, year comes before number when stating a
        // specific year." Was: 'A year is read the same way:' + '> Ob txhiab neesnkaum rau — 2026'
        '## A year: xyoo comes FIRST',
        'To name a specific year, say xyoo (year) first, then the number, read the same way as any big number:',
        '> Xyoo ob txhiab neesnkaum rau — the year 2026',
        'Compare counting years, where the number comes first, like any count:',
        '> Neesnkaum xyoo — twenty years',
        '## Counting things: number + classifier + noun',
        'A number almost never stands straight before a noun. The noun’s classifier goes in between, just as it does after “this” or “that”.',
        '> Ib tus aub — one dog',
        '> Ob tus miv — two cats',
        '> Tsib phau ntawv — five books (phau, for books)',
        '> Cuaj lub rooj — nine tables (lub, for round or solid things)',
        'Ib also does the job of English “a / an”: ib tus aub can mean one dog or a dog.',
        '## Age, price and the clock',
        '> Kuv muaj neesnkaum xyoo. — I am twenty (years old). Age always takes muaj.',
        '> Yim teev. — Eight o’clock.',
        'To ask for a number, put pes tsawg where the number would go: Koj muaj pes tsawg xyoo? (How old are you?) · Yog pes tsawg? (How much is it?)',
        '## First, second, third: thib + the number',  // TODO-VERIFY — from the time-thib card
        '> Thib ib — first · Thib ob — second · Thib peb — third',
        '## Watch the look-alikes',
        'Several numbers are spelled exactly like other everyday words, so context and tone matter:',
        '> Peb — three, and also we · Plaub — four, and also hair / fur',
        '> Rau — six, and also to / for · Puas — hundred, and also the yes/no question word',
        'Say them aloud: the tone letter at the end of each word is part of the number.',
        // Was (until 2026-09-27):
        //   'Hmong numbers are regular and quick to learn. Once you know one through ten, larger numbers build on the same words.',
        //   'Teens stack ten plus the unit:',
        //   '> Kaum ib — eleven (ten-one)',
        //   '> Kaum ob — twelve (ten-two)',
        //   'Watch the tones closely — several numbers differ from other everyday words only by their tone letter, so saying them aloud matters more than reading them.',
      ],
    },
    {
      id: 'numbers-counting-examples',
      kind: 'examples',
      title: 'One through ten',
      intro: 'Read each number aloud.',
      items: [
        { hmong: 'Ib', audio: 'vocabulary/numbers/hmong-numbers-ib.mp3', english: 'one', note: 'Final -b marks the high tone.' },
        { hmong: 'Ob', audio: 'vocabulary/numbers/hmong-numbers-ob.mp3', english: 'two', note: 'Also a high tone (-b).' },
        { hmong: 'Peb', audio: 'vocabulary/numbers/hmong-numbers-peb.mp3', english: 'three', note: 'The same word as "we / us" — context tells them apart.' },
        { hmong: 'Plaub', audio: 'vocabulary/numbers/hmong-numbers-plaub.mp3', english: 'four', note: 'Also means "hair / fur" — another reason tones and context matter.' },
        { hmong: 'Tsib', audio: 'vocabulary/numbers/hmong-numbers-tsib.mp3', english: 'five', note: 'The "ts" is one consonant sound.' },
        { hmong: 'Rau', audio: 'vocabulary/numbers/hmong-numbers-rau.mp3', english: 'six', note: 'Also appears as "to / for" in other sentences — context separates them.' },
        { hmong: 'Xya', audio: 'vocabulary/numbers/hmong-numbers-xya.mp3', english: 'seven', note: 'RPA "x" sounds like English "s" in "see".' },
        { hmong: 'Yim', audio: 'vocabulary/numbers/hmong-numbers-yim.mp3', english: 'eight', note: 'Bare final (no tone letter) = the mid tone.' },
        { hmong: 'Cuaj', audio: 'vocabulary/numbers/hmong-numbers-cuaj.mp3', english: 'nine', note: 'Final -j marks the high-falling tone.' },
        { hmong: 'Kaum', audio: 'vocabulary/numbers/hmong-numbers-kaum.mp3', english: 'ten', note: 'Builds the teens: "kaum ib" = eleven.' },
        // Tens written SOLID, matching both the word bank and the recordings —
        // this lesson was the only place they were spaced.
        { hmong: 'Neesnkaum', audio: 'vocabulary/numbers/hmong-numbers-neesnkaum.mp3', english: 'twenty', note: 'Builds the twenties: "Neesnkaum ib" = twenty-one.' },
        { hmong: 'Pebcaug', audio: 'vocabulary/numbers/hmong-numbers-pebcaug.mp3', english: 'thirty', note: 'Builds the thirties: "Pebcaug ib" = thirty-one.' },
        { hmong: 'Plaubcaug', audio: 'vocabulary/numbers/hmong-numbers-plaubcaug.mp3', english: 'forty', note: 'Builds the forties: "Plaubcaug ib" = forty-one.' },
        { hmong: 'Tsibcaug', audio: 'vocabulary/numbers/hmong-numbers-tsibcaug.mp3', english: 'fifty', note: 'Builds the fifties: "Tsibcaug ib" = fifty-one.' },
        { hmong: 'Raucaum', audio: 'vocabulary/numbers/hmong-numbers-raucaum.mp3', english: 'sixty', note: 'Builds the sixties: "Raucaum ib" = sixty-one.' },
        { hmong: 'Xyacaum', audio: 'vocabulary/numbers/hmong-numbers-xyacaum.mp3', english: 'seventy', note: 'Builds the seventies: "Xyacaum ib" = seventy-one.' },
        { hmong: 'Yimcaum', audio: 'vocabulary/numbers/hmong-numbers-yimcaum.mp3', english: 'eighty', note: 'Builds the eighties: "Yimcaum ib" = eighty-one.' },
        { hmong: 'Cuajcaum', audio: 'vocabulary/numbers/hmong-numbers-cuajcaum.mp3', english: 'ninety', note: 'Builds the nineties: "Cuajcaum ib" = ninety-one.' },
        { hmong: 'Ib puas', audio: 'vocabulary/numbers/hmong-numbers-ib-puas.mp3', english: 'one hundred', note: '100' },
        { hmong: 'Puas', audio: 'vocabulary/numbers/hmong-numbers-puas.mp3', english: 'hundred', note: 'Used after a number to form hundreds (e.g. "Ob puas" = 200).' },
        { hmong: 'Txhiab', audio: 'vocabulary/numbers/hmong-numbers-txhiab.mp3', english: 'thousand', note: 'Used after a number to form thousands (e.g. "Ib txhiab" = 1,000).' },
        { hmong: 'Vam', audio: 'vocabulary/numbers/hmong-numbers-vam.mp3', english: 'ten thousand', note: 'Used after a number to form ten thousands (e.g. "Ib vam" = 10,000).' },
        { hmong: 'Plhom', audio: 'vocabulary/numbers/hmong-numbers-plhom.mp3', english: 'million', note: 'Used after a number to form millions (e.g. "Ib Plhom" = 1,000,000).' },
      ],
    },
    // Added 2026-09-27 — building bigger numbers, and using them. A new step id, so no
    // existing progress key is reused.
    {
      id: 'numbers-counting-building',
      kind: 'examples',
      title: 'Building bigger numbers',
      intro: 'Each one is built from the words above. Read them aloud.',
      items: [
        { hmong: 'Kaum ib', english: '11', note: 'ten + one' },
        { hmong: 'Kaum tsib', english: '15', note: 'ten + five' },
        { hmong: 'Neesnkaum ib', english: '21', note: 'twenty + one' },
        { hmong: 'Pebcaug tsib', english: '35', note: 'caug after peb (it ends in -b)' },
        { hmong: 'Raucaum xya', english: '67', note: 'caum after rau' },
        { hmong: 'Cuajcaum cuaj', english: '99' },
        { hmong: 'Ib puas tsibcaug', english: '150', note: 'a hundred, fifty' },
        { hmong: 'Xyoo ob txhiab neesnkaum rau', english: 'the year 2026', note: 'xyoo (year) comes BEFORE the number' },  // was 'Ob txhiab neesnkaum rau' — 2026 (author: include xyoo), 2026-09-27
        { hmong: 'Neesnkaum xyoo', english: 'twenty years', note: 'a count: the number comes first' },
        { hmong: 'Peb tus menyuam', english: 'three children', note: 'number + classifier + noun' },
        { hmong: 'Kuv muaj neesnkaum xyoo.', english: 'I am twenty years old.', note: 'age takes muaj' },
        { hmong: 'Thib ib', english: 'first', note: 'thib + a number' },  // TODO-VERIFY
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'numbers-counting-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'What is the Hmong word for "five"?',
      options: ['Tsib', 'Plaub', 'Rau', 'Cuaj'],
      answer: 'Tsib',
    },*/
    {
      id: 'numbers-counting-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
