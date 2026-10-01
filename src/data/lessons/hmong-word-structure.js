// Standalone lesson: how a Hmong word is built.
// This is the ANCHOR lesson of Foundations — the one idea every other alphabet
// unit (Consonants / Vowels / Tones) hangs off. Teach the formula first, then
// send the learner to each piece.
//
// ⚠️ REWRITTEN 2026-09-28 (author: "rewrite it so it's a much better explanation"). Drafted by GPT
// from a prompt carrying the author's rules, reviewed by Claude:
//   · dog is aub (no dev); aub is also the example of a word with NO starting consonant;
//   · no "aa" (Green Hmong); White Hmong only;
//   · the tone names are the app's own (src/data/reference.js `tones`, with their Hmong names),
//     so the lesson and the Reference tab say the same thing — GPT had called b "high-rising";
//   · one practice distractor changed ("au + b" was also a correct split of aub).
// Step ids kept (intro / examples / next), so progress carries over; new steps have new ids.
// The previous version is kept, commented, at the bottom of this file. TODO-VERIFY: tone wording.

export const hmongWordStructure = {
  id: 'foundations-word-structure',
  title: 'How Hmong Words Work',
  summary: 'Every Hmong syllable opens into three pieces: consonant + vowel + tone.',
  steps: [
    {
      id: 'foundations-word-structure-intro',
      kind: 'intro',
      title: 'Consonant + Vowel + Tone = Word',
      body: [
        '## 1. Every syllable has three pieces',
        'A Hmong syllable is built from a consonant, a vowel and a tone. Think of three slots: beginning + middle + ending.',
        '> tsev — house · ts + e + v',
        '> noj — eat · n + o + j',
        '## 2. A long-looking syllable is still three pieces',
        'Some consonants and vowels are written with several letters, but those letters make ONE sound together. Don’t count letters; find the three pieces.',
        '> nplooj — leaf · npl + oo + j',
        '> ntxhais — girl, daughter · ntxh + ai + s',
        '## 3. The last letter is the tone, not a sound',
        'When a syllable ends in a tone letter, that letter tells you HOW to say it. It is not an extra sound: in pob, you do not say a “b”.',
        '> pob — ball · p + o + b',
        '> pom — see · p + o + m',
        '## 4. No tone letter means the mid tone',
        'Not every syllable ends in a tone letter. With none, it takes the mid tone, and it is still a complete word.',
        '> po — spleen · p + o + (no letter = mid)',
        '> zoo — good · z + oo + (no letter = mid)',
        '## 5. Some words have no starting consonant',
        'A syllable can begin straight away with its vowel, leaving the first slot empty.',
        '> aub — dog · (none) + au + b',
        '> ua — do, make · (none) + ua + (mid)',
        '## 6. Tones change meaning',
        'Keep the same consonant and vowel, change only the tone, and you get a different word. That is why the last letter matters so much.',
        '> pob — ball · poj — female · pov — throw · pom — see',
        'Once you can spot the three pieces, you can work out how to say a word you have never seen before.',
      ],
    },
    {
      // New id (2026-09-28) — the tone table.
      id: 'foundations-word-structure-tones',
      kind: 'examples',
      title: 'The eight tones',
      intro: 'Seven tone letters and one without a letter. Same p + o, eight different words.',
      items: [
        { hmong: 'pob', english: 'ball', note: 'b — High (Cim Siab): start high and stay there' },
        { hmong: 'poj', english: 'female', note: 'j — High-falling (Cim Ntuj): start high and fall' },
        { hmong: 'pov', english: 'throw', note: 'v — Rising (Cim Kuv): start in the middle and rise' },
        { hmong: 'po', english: 'spleen', note: 'no letter — Mid (Cim Ua): stay in the middle' },
        { hmong: 'pos', english: 'thorn', note: 's — Low (Cim Mus): stay low and level' },
        { hmong: 'pog', english: 'grandmother', note: 'g — Mid-falling with air (Cim Neeg): a breathy voice, falling' },
        { hmong: 'pom', english: 'see', note: 'm — Low-falling (Cim Niam): low, falling, a little tight' },
        { hmong: 'tod', english: 'over there', note: 'd — Low-rising (Cim Tod): low and rising, heard at the end of a phrase' },
      ],
    },
    {
      id: 'foundations-word-structure-examples',
      kind: 'examples',
      title: 'Break it down',
      intro: 'Find the consonant, the vowel and the tone, then say the word.',
      items: [
        { hmong: 'Kuv', english: 'I, me', note: 'k + u + v' },
        { hmong: 'Koj', english: 'you', note: 'k + o + j' },
        { hmong: 'Nws', english: 'he, she, it', note: 'n + w + s' },
        { hmong: 'Aub', english: 'dog', note: '(none) + au + b' },
        { hmong: 'Tsev', english: 'house', note: 'ts + e + v' },
        { hmong: 'Noj', english: 'eat', note: 'n + o + j' },
        { hmong: 'Zoo', english: 'good', note: 'z + oo + (mid)' },
        { hmong: 'Nplooj', english: 'leaf', note: 'npl + oo + j' },
        { hmong: 'Ntxhais', english: 'girl, daughter', note: 'ntxh + ai + s' },
        { hmong: 'Hnub', english: 'day, sun', note: 'hn + u + b' },
      ],
    },
    {
      id: 'foundations-word-structure-check-tone',
      kind: 'practice',
      title: 'Find the tone',
      prompt: 'What is the tone letter in "tsev"?',
      options: ['ts', 'e', 'v', 'There is no tone letter'],
      answer: 'v',
    },
    {
      id: 'foundations-word-structure-check-pieces',
      kind: 'practice',
      title: 'Count the pieces',
      prompt: 'How many pieces are in "ntxhais"?',
      options: ['2', '3', '6', '7'],
      answer: '3',
    },
    {
      id: 'foundations-word-structure-check-aub',
      kind: 'practice',
      title: 'Break it down',
      prompt: 'How does "aub" break down?',
      // Was option 'au + b' — also a correct split, so it could not be a wrong answer (2026-09-28).
      options: ['a + u + b', '(none) + au + b', 'a + ub + (none)', 'aub + (none) + (none)'],
      answer: '(none) + au + b',
    },
    {
      id: 'foundations-word-structure-check-mid',
      kind: 'practice',
      title: 'No tone letter',
      prompt: 'What does it mean when a syllable has no tone letter at the end?',
      options: ['The word has no tone', 'The last vowel becomes a consonant', 'It takes the mid tone', 'It is said silently'],
      answer: 'It takes the mid tone',
    },
    {
      id: 'foundations-word-structure-next',
      kind: 'intro',
      title: 'Where to go next',
      body: [
        'Now that you can see the three pieces, the next lessons teach each one on its own:',
        'CONSONANTS — how a syllable starts. Single, double, triple and even four-letter consonants, and each one is ONE sound.',
        'VOWELS — the middle. Single vowels (a, e, i, o, u, w) and double vowels (ai, au, aw, ee, ia, oi, oo, ua): two letters, one sound.',
        'TONES — the ending. Eight of them, and they change what a word means. This is the piece that takes the most practice.',
        'Once you know those, you can look at any new White Hmong syllable and work out how to say it.',
      ],
    },
  ],
}

// ── THE PREVIOUS VERSION (until 2026-09-28), kept for reference ─────────────────
// export const hmongWordStructure = {
//   id: 'foundations-word-structure',
//   title: 'How Hmong Words Work',
//   summary: 'Every Hmong word is consonant + vowel + tone. Learn the formula first.',
//   steps: [
//     { id: 'foundations-word-structure-intro', kind: 'intro', title: 'Consonant + Vowel + Tone = Word', body: [
//         'Hmong writing is remarkably regular. Almost every syllable is built from exactly three pieces, always in the same order: a consonant, then a vowel, then a tone.',
//         'Take "nplooj" (leaf). It looks long, but it is only three pieces:',
//         '> Nplooj — Npl (consonant) + oo (vowel) + j (tone)',
//         'Not six letters — three parts. "Npl" is ONE consonant, "oo" is ONE vowel, and "j" is the tone.',
//         'The tone is written as the final letter, and that letter is never pronounced as a sound. In "pob", you do not say a "b" at the end — the "b" tells you the pitch is high.',
//         'This is why Hmong looks harder to read than it is. Once you can spot the three pieces, you can pronounce a word you have never seen before — and that is the whole goal of the next three units.',
//         'One exception worth knowing: the mid tone has no letter at all. A syllable that ends in a vowel, like "po", is still a complete word — it just carries the mid tone.',
//     ] },
//     { id: 'foundations-word-structure-examples', kind: 'examples', title: 'Breaking words apart', intro: 'Same three pieces every time. Read the breakdown, then say the word.', items: [
//         { hmong: 'Nplooj', english: 'leaf', note: 'Npl (consonant) + oo (vowel) + j (tone)' },
//         { hmong: 'Pob', english: 'ball', note: 'P (consonant) + o (vowel) + b (tone)' },
//         { hmong: 'Po', english: 'spleen', note: 'P + o + (no tone letter = mid tone)' },
//         { hmong: 'Dev', english: 'dog', note: 'D (consonant) + e (vowel) + v (tone)' },   // dog is aub (author)
//         { hmong: 'Tsev', english: 'house', note: 'Ts (consonant) + e (vowel) + v (tone)' },
//         { hmong: 'Hmoob', english: 'Hmong', note: 'Hm (consonant) + oo (vowel) + b (tone)' },
//     ] },
//     { id: 'foundations-word-structure-next', kind: 'intro', title: 'Where to go next', body: [
//         'Now that you know the formula, learn each piece on its own:',
//         'CONSONANTS — the sound a word starts with. Hmong has single, double, triple, and even four-letter consonants, and each spells ONE sound.',
//         'VOWELS — the middle. Single vowels (a, e, i, o, u, w) and double vowels (ai, oo, ua…) that are two letters but one sound.',
//         'TONES — the pitch, written as that final letter. Eight of them, and they change what a word means. This is the piece that takes the most practice.',
//     ] },
//   ],
// }
