// Standalone lesson: TONE SHIFTS — trigger shifts, numerical.
//
// ⚠️ AUTHORED FROM THE AUTHOR'S OWN MATERIAL. Two deliveries:
//   2026-10-25 (first)  the taxonomy, the numerical triggers, four classifier examples,
//                       the tens, and the "why it is called numerical" explanation.
//   2026-10-25 (second) THE KEY: the trigger tones named, the tones that never shift, all
//                       five shifting patterns with two examples each, the quick
//                       reference, the non-numerical compounds, and the closing caveat.
//
// The `id`, `title`, `vocab` and the Hmong heading ("Sib Suab Zauv") are the author's
// own, from the skeleton they started. They are progress keys — do not rename them.
//
// ⚠️ THE CAVEATS IN HERE ARE TEACHING CONTENT, NOT HEDGES TO TRIM. "thawj zaug",
// "poob deg", "nab qa" and "ib ce" are established expressions, and the author marked
// each one as such: the shift is real in that compound and does not generalise to every
// word with that tone. Stripping those notes would turn five documented patterns into
// five rules a learner would over-apply. The same goes for the closing paragraph.
//
// ⚠️ THE TONE NAMES ARE THE APP'S OWN. The author writes Cim Siab (-b), Cim Ntuj (-j),
// Cim Neeg (-g), Cim Tod (-d); those are exactly the `example2` values in
// src/data/reference.js, so the lesson and the Reference tab agree by construction.
// Where the author's English description is better than reference.js's ("breathy falling"
// vs "Mid-Falling with Air"), the author's is used alongside the letter.
//
// ⚠️ STILL `placeholder: true` — the author's framing. Three of the four shift categories
// (Rootword, Final position, Expression) are not written yet, and the flag is what marks
// this as one quarter of the subject. The numerical quarter itself is now complete.

export const toneShiftsGuidelinesNumerical = {
  id: 'tone-shifts-guidelines-numerical',
  placeholder: true,
  title: 'Tone Shifts Guidelines (Numerical)',
  summary: 'A word ending in -b or -j changes the tone of the word straight after it: tus becomes tug, daim becomes daig, lo becomes los.',
  vocab: 'grammar-tone-shifts-guidelines-numerical',
  steps: [
    {
      id: 'tone-shifts-guidelines-numerical-intro',
      kind: 'intro',
      title: 'Tone Shifts Guidelines Introduction',
      body: [
        '# Sib Suab Zauv - Tone Shifts Guidelines (Numerical)',

        'Tone shifts may not apply to every speaker, or to every generation, but they are worth understanding regardless. You will hear them, and you will see them written.',

        '## The four kinds of tone shift',

        'Hmong tone shifts fall into two groups, and each group has two types.',

        '**Trigger shifts** — something next to the word causes the change:',

        '> Numerical — a number causes it. This lesson.',
        '> Rootword — a root word causes it.',

        '**Variation shifts** — the change comes from where the word sits, or how it is said:',

        '> Final position — the word is at the end.',
        '> Expression — the way it is expressed.',

        'This lesson is the first one: **trigger shifts, numerical**.',

        '## Why it is called numerical',

        'The name comes from the relationship between numbers and the words that follow them. It is called a numerical shift because that is where the shift mostly appears: in words that come after a number.',

        'Numerical expressions are the most common place learners meet Hmong tone shifts, especially when a number comes before a classifier — **ib tug**, **ob daig**. That is why they are usually taught as numerical tone shifts.',

        'The pattern is broader than that, though. Any word ending in **-b** or **-j** can trigger a shift, including in established compounds and expressions. The shift depends on the words and their grammatical relationship, so it does not happen automatically every time.',

        '## The key is understanding the tone triggers, then identifying the tone shifts',

        'Two things to learn, in this order. First understand which tones trigger a shift. Then learn to identify the shift in the word that follows.',

        '### The two trigger tones',

        'Only two tones trigger a shift:',

        '> **Cim Siab** (-b) — the high tone',
        '> **Cim Ntuj** (-j) — the high-falling tone',

        '**The trigger tone must come first, and the shifting word must follow directly after it.** That order is the grammatical relationship between them — break the order and there is no shift.',

        'The trigger also keeps its own tone. It is the word AFTER it that changes.',

        '### The tones that never shift',

        'Three tones are never the ones that change:',

        '> **Cim Siab** (-b) — the high tone',
        '> **Cim Neeg** (-g) — the mid breathy tone',
        '> **Cim Tod** (-d) — the low-rising tone',

        'Everything else can shift: **-s**, **-m**, **-j**, **-v**, and the mid tone with no letter at all.',

        '### The triggers you meet first: the numbers',

        'The numbers **1 to 5** and **9** all end in a trigger tone, which is why they shift the classifier, noun or verb that follows them directly.',

        // ⚠️ ONE PAIR PER LINE — the author's ruling, 2026-10-25: "what I want is everything
        // seperate … because right now everything is stuck within one description." These
        // six were written as two ` · `-joined lines in the first draft of this lesson.
        '> ib — one (-b)',
        '> ob — two (-b)',
        '> peb — three (-b)',
        '> plaub — four (-b)',
        '> tsib — five (-b)',
        '> cuaj — nine (-j)',

        'So the thing to memorise is not a list of numbers — it is the two tones. These six are simply the ones you will meet first.',

        '## The shift inside the numbers themselves',

        'You can see this happening inside the tens. A ten is built from a digit plus **caum**, and whether it stays **caum** or becomes **caug** depends entirely on the digit in front of it.',

        'After a digit ending in **-b**, it shifts:',

        '> pebcaug — thirty (peb + caug)',
        '> plaubcaug — forty (plaub + caug)',
        '> tsibcaug — fifty (tsib + caug)',

        'After a digit with no trigger tone, it does not:',

        '> raucaum — sixty (rau + caum)',
        '> xyacaum — seventy (xya + caum)',
        '> yimcaum — eighty (yim + caum)',

        'Twenty behaves the same way — **nees** carries **-s**, which is not a trigger, so nothing shifts:',

        '> neesnkaum — twenty',

        'This is the clearest proof that the pattern is real. Nobody chose these spellings one at a time: thirty, forty and fifty shift because of the tone sitting in front, and sixty, seventy and eighty do not.',

        // ⚠️ NINETY IS A REAL COUNTER-EXAMPLE, AND IT IS NAMED ON PURPOSE.
        //
        // The rule predicts `cuajcaug`: `cuaj` carries -j, which IS a trigger, and -m is a
        // shifting tone (pattern 2). The dictionary has `cuajcaum` (numbers-90) — and it has
        // a RECORDING, `vocabulary/numbers/hmong-numbers-cuajcaum.mp3`, which is the part
        // that settles it. A spelling can be a typo; a spoken clip of the author saying
        // `cuajcaum` cannot be.
        //
        // So this is not an error in the data and not an error in the rule — it is exactly
        // the author's own closing caveat happening inside the tens: "not every -b or -j
        // word will trigger one". Leaving it out would be worse than naming it, because a
        // learner who has just been taught that -j triggers will count to ninety on their
        // own and conclude the lesson is wrong.
        //
        // ⚠️ DO NOT "FIX" numbers-90 TO `cuajcaug` to make this section tidier.
        'Ninety is the interesting one. **Cuaj** carries **-j**, so the rule predicts a shift — and yet ninety is **cuajcaum**, not cuajcaug:',

        '> cuajcaum — ninety (cuaj + caum, with no shift)',

        'That is not a mistake in the rule. It is the first example of something worth knowing now rather than later: a trigger tone makes a shift **possible**, not compulsory. Some words simply do not take it.',

        '---',

        '## The five shifting patterns',

        'This is the key. What a word shifts TO depends on the tone it started from.',

        '### 1. -s → -g',

        '> tus → tug',
        '> Tus dais no loj. — This bear is big.',
        '> Kuv pom ib tug dais. — I see a bear.',

        'Trigger: **ib** (-b). Original: **tus** (-s, low). Shifted: **tug** (-g, breathy falling).',

        '> tais → taig',
        '> Lub tais no loj. — This bowl is big.',
        '> Kuv noj ib taig mov. — I eat a bowlful of rice.',

        'Trigger: **ib** (-b). Original: **tais** (-s, low). Shifted: **taig** (-g, breathy falling).',

        '### 2. -m → -g',

        '> daim → daig',
        '> Daim ntawv no dawb. — This sheet of paper is white.',
        '> Kuv muaj ob daig ntawv. — I have two sheets of paper.',

        'Trigger: **ob** (-b). Original: **daim** (-m, low-falling and creaky). Shifted: **daig** (-g, breathy falling).',

        '> zaum → zaug',
        '> Zaum no kuv mus. — This time, I am going.',
        '> Nov yog thawj zaug kuv tuaj ntawm no. — This is my first time coming here.',

        'Trigger: **thawj** (-j). Original: **zaum** (-m). Shifted: **zaug** (-g). Note that **thawj zaug** is an established expression meaning "first time", rather than a general counting pattern.',

        '### 3. -j → -g',

        '> leej → leeg',
        '> Muaj rau leej nyob ntawm no. — There are six people here.',
        '> Muaj ob leeg nyob ntawm no. — There are two people here.',

        'Trigger: **ob** (-b). Original: **leej** (-j, high-falling). Shifted: **leeg** (-g, breathy falling).',

        '> dej → deg',
        '> Kuv haus dej. — I drink water.',
        '> Nws poob deg. — He or she drowned.',

        'Trigger: **poob** (-b). Original: **dej** (-j). Shifted: **deg** (-g). **Poob deg** is an established expression meaning "to drown" — the shift happens in this compound, and its meaning differs from the unshifted **poob dej**, "fall into water".',

        '### 4. No tone → -s',

        '> lo → los',
        '> Lo lus no txhais li cas? — What does this word mean?',
        '> Kuv hais ib los lus. — I say one word.',

        'Trigger: **ib** (-b). Original: **lo** (mid, no letter). Shifted: **los** (-s, low).',

        '> hmo → hmos',
        '> Hmo no kuv nyob hauv tsev. — Tonight, I am staying home.',
        '> Kuv nyob ntawm no ib hmos. — I stay here for one night.',

        'Trigger: **ib** (-b). Original: **hmo** (mid). Shifted: **hmos** (-s, low).',

        '### 5. -v → no tone',

        '> qav → qa',
        '> Kuv pom tus qav. — I see the frog.',
        '> Kuv pom ib tug nab qa. — I see a lizard.',

        'Trigger: **nab** (-b). Original: **qav** (-v, rising). Shifted: **qa** (mid, no letter). **Nab qa** is an established compound meaning "lizard" — this is not a general rule for changing every **-v** word after a **-b**.',

        '> cev → ce',
        '> Kuv lub cev mob. — My body hurts.',
        '> Kuv mob ib ce. — I ache all over.',

        'Trigger: **ib** (-b). Original: **cev** (-v, rising). Shifted: **ce** (mid). Here **ib ce** means "the whole body", or all over the body.',

        '## Quick reference',

        // ⚠️ THE EXAMPLE GOES IN THE PARENTHESES, NOT AFTER A SECOND DASH.
        // parseExample() in IntroBody.jsx splits on the FIRST ' — ' only and reads a
        // trailing '(…)' as the note — so this form renders as a three-part stack
        // (pattern / what it sounds like / the example), while a second ' — ' would
        // leave the example buried in the English line.
        '> -s → -g — low becomes breathy falling (tus → tug)',
        '> -m → -g — low-falling and creaky becomes breathy falling (daim → daig)',
        '> -j → -g — high-falling becomes breathy falling (leej → leeg)',
        '> no tone → -s — mid becomes low (lo → los)',
        '> -v → no tone — rising becomes mid (cev → ce)',

        '## Beyond numbers',

        'Numbers are the common case, but the same two trigger tones work in established compounds and expressions:',

        '> poob dej → poob deg — to fall into water → to drown',
        '> Kuv poob dej. — I fell into the water.',
        '> Nws poob deg. — He or she drowned.',

        'Trigger: **poob** (-b) shifts **dej** (-j) to **deg** (-g).',

        '> thawj zaum → thawj zaug — first time',

        'Trigger: **thawj** (-j) shifts **zaum** (-m) to **zaug** (-g).',

        'These second examples are established expressions rather than freely applicable rules.',

        '## The teaching point',

        '**The trigger keeps its own tone. The word that follows is the one that shifts.** These patterns are documented in White Hmong, but not every word changes automatically — some shifts happen only in specific counting constructions or established expressions.',

        // ⚠️ THE AUTHOR'S CLOSING PARAGRAPH, and the most important one in the lesson for a
        // learner who is about to go and listen to real speech. Do not trim it for length.
        'Tone shifts will not happen in every phrase, and not every **-b** or **-j** word will trigger one — it depends on the speaker or the writer, and it is usually there to reinforce clarity. Some sentences simply will not have them, because the person speaking did not use them. But when the shifts do occur, you now know what causes them, and why the word changed.',
      ],
    },

    // ⚠️ ALL TEN PAIRS FROM THE KEY, in the author's own sentences, one on screen at a
    // time. The intro explains the five patterns; this step drills recognising them.
    {
      id: 'tone-shifts-guidelines-numerical-examples',
      kind: 'examples',
      title: 'The shift, pair by pair',
      intro: 'The plain form, then the form after a trigger. Read both aloud — the difference is the last letter.',
      items: [
        { hmong: 'Tus dais no loj.', english: 'This bear is big.', note: 'No trigger: tus keeps its -s.' },
        { hmong: 'Kuv pom ib tug dais.', english: 'I see a bear.', note: '-s → -g. ib triggers it: tus → tug.' },
        { hmong: 'Lub tais no loj.', english: 'This bowl is big.', note: 'Plain form: tais.' },
        { hmong: 'Kuv noj ib taig mov.', english: 'I eat a bowlful of rice.', note: '-s → -g. tais → taig.' },
        { hmong: 'Daim ntawv no dawb.', english: 'This sheet of paper is white.', note: 'Plain form: daim.' },
        { hmong: 'Kuv muaj ob daig ntawv.', english: 'I have two sheets of paper.', note: '-m → -g. ob triggers it: daim → daig.' },
        { hmong: 'Zaum no kuv mus.', english: 'This time, I am going.', note: 'Plain form: zaum.' },
        { hmong: 'Nov yog thawj zaug kuv tuaj ntawm no.', english: 'This is my first time coming here.', note: '-m → -g after thawj (-j). An established expression: thawj zaug, "first time".' },
        { hmong: 'Muaj rau leej nyob ntawm no.', english: 'There are six people here.', note: 'rau is not a trigger, so leej keeps its -j.' },
        { hmong: 'Muaj ob leeg nyob ntawm no.', english: 'There are two people here.', note: '-j → -g. ob triggers it: leej → leeg.' },
        { hmong: 'Kuv haus dej.', english: 'I drink water.', note: 'Plain form: dej.' },
        { hmong: 'Nws poob deg.', english: 'He or she drowned.', note: '-j → -g after poob (-b). poob deg means to drown — poob dej is to fall into water.' },
        { hmong: 'Lo lus no txhais li cas?', english: 'What does this word mean?', note: 'Plain form: lo, the mid tone.' },
        { hmong: 'Kuv hais ib los lus.', english: 'I say one word.', note: 'No tone → -s. lo → los.' },
        { hmong: 'Hmo no kuv nyob hauv tsev.', english: 'Tonight, I am staying home.', note: 'Plain form: hmo.' },
        { hmong: 'Kuv nyob ntawm no ib hmos.', english: 'I stay here for one night.', note: 'No tone → -s. hmo → hmos.' },
        { hmong: 'Kuv pom tus qav.', english: 'I see the frog.', note: 'Plain form: qav.' },
        { hmong: 'Kuv pom ib tug nab qa.', english: 'I see a lizard.', note: '-v → no tone. nab qa is an established compound for lizard.' },
        { hmong: 'Kuv lub cev mob.', english: 'My body hurts.', note: 'Plain form: cev.' },
        { hmong: 'Kuv mob ib ce.', english: 'I ache all over.', note: '-v → no tone. ib ce means the whole body.' },
      ],
    },

    // ⚠️ EVERY QUESTION IS ANSWERABLE FROM THE AUTHOR'S KEY — nothing here tests a pattern
    // they have not stated, and nothing tests the three unwritten shift categories.
    {
      id: 'tone-shifts-guidelines-numerical-practice',
      kind: 'practice',
      title: 'Find the trigger, name the shift',
      body: [
        'Six questions on the triggers and the five patterns. Each one is answered somewhere in the lesson above.',
      ],
      questions: [
        {
          id: 'tone-shift-num-q1',
          situation: 'Which word is the trigger in this sentence?',
          sentence: 'Kuv pom ib tug dais.',
          choices: ['ib', 'tug', 'dais', 'pom'],
          answer: 'ib',
          translation: 'I see a bear.',
          explanation: '**Ib** carries **-b** (Cim Siab) and sits directly in front of the classifier. That is what shifts **tus** to **tug**.',
        },
        {
          id: 'tone-shift-num-q2',
          situation: 'Which two tones trigger a shift?',
          sentence: 'The trigger tones',
          choices: ['-b and -j', '-s and -m', '-g and -d', 'every tone'],
          answer: '-b and -j',
          explanation: 'Cim Siab (-b), the high tone, and Cim Ntuj (-j), the high-falling tone. Those two, and no others.',
        },
        {
          id: 'tone-shift-num-q3',
          situation: 'Which form belongs after ob?',
          sentence: 'Kuv muaj ob ___ ntawv.',
          choices: ['daim', 'daig', 'daiv', 'dais'],
          answer: 'daig',
          translation: 'I have two sheets of paper.',
          explanation: '**Ob** ends in **-b**, and **-m** shifts to **-g**: **daim** becomes **daig**.',
        },
        {
          id: 'tone-shift-num-q4',
          situation: 'What does a word with no tone letter shift to?',
          sentence: 'Kuv hais ib ___ lus.',
          choices: ['los', 'lo', 'log', 'lov'],
          answer: 'los',
          translation: 'I say one word.',
          explanation: 'The mid tone shifts to **-s**, the low tone. **Lo** becomes **los**.',
        },
        {
          id: 'tone-shift-num-q5',
          situation: 'Which tone does -v shift to?',
          sentence: 'cev → ___',
          choices: ['no tone at all', '-g', '-s', '-j'],
          answer: 'no tone at all',
          explanation: '**-v** loses its letter and becomes the mid tone: **cev** becomes **ce**. It is the only pattern that removes a letter rather than changing one.',
        },
        {
          id: 'tone-shift-num-q6',
          situation: 'Which of these tones never shifts?',
          sentence: 'The tones that stay put',
          choices: ['-g, the mid breathy tone', '-s, the low tone', '-m, the low-falling tone', '-v, the rising tone'],
          answer: '-g, the mid breathy tone',
          explanation: 'Three tones never change: Cim Siab (-b), Cim Neeg (-g) and Cim Tod (-d). The other four shifts all END at **-g**, which is part of why it does not move.',
        },
      ],
    },

    {
      id: 'tone-shifts-guidelines-numerical-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
