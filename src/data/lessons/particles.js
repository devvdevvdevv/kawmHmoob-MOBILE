// Standalone lesson: sentence particles — for path unit u-particles (Sentence Particles).
//
// ⚠️⚠️ NOT WIRED IN. NOTHING IMPORTS THIS FILE. 2026-10-15.
// Written on a wrong premise — `placeholder-particles` DOES exist, in
// lessons/placeholders.js, and is already wired. ⚠️ OF THE FIVE UNWIRED DRAFTS THIS IS
// THE ONE LEAST WORTH ADOPTING: the live placeholder covers the same ground with fewer
// claims, and particles are tone of voice, where guessing is most expensive.
// TO ADOPT: take over the live ids so progress survives, comment out
// `particlesPlaceholder` there, import this instead. TO DROP: delete this file.
//
// ⚠️ THIS IS THE LESSON IN THIS BATCH WITH THE WEAKEST FOOTING, and the comment is here
// so nobody mistakes it for settled teaching. Particles are the hardest thing in the set
// to write honestly: they carry TONE OF VOICE, not meaning, and the category's glosses
// are themselves hedged ("soft insistence, friendly urging", "softens the sentence").
// Only two of the nine entries have a reviewed sentence (`thiab` and `xwb`); the other
// seven are `source: 'ai'`.
//
// So this lesson deliberately teaches LESS than it could:
//   • it groups the particles by what they do, using the category's own glosses;
//   • it says plainly that a particle is tone of voice and that the safest way to learn
//     one is to hear it used;
//   • it does NOT invent register rules (who may say `mog` to whom, whether `nawb` is
//     rude from a younger speaker) — those are exactly the things that need a speaker.
//
// Built on the one settled thing here: `thiab` at the END of a sentence means "also,
// too", which is a different job from `thiab` meaning "and" between two things — and
// that contrast IS reviewed content, from the entry's own sentence.
//
// TODO-VERIFY before the placeholder flag comes off, and this list is the real work:
//   · every particle's register — who says it, to whom, and when it would be wrong;
//   · the seven `[ai]` sentences;
//   · whether `os`, `mog` and `nawb` overlap enough that a beginner should meet only one.

export const particles = {
  id: 'grammar-particles',
  title: 'Sentence Particles | Lus Qhuab',
  summary: 'Nawb, os, lov, ne, xwb — the small words at the end that carry tone of voice.',
  vocab: 'discourse-particles',
  placeholder: true,
  steps: [
    {
      id: 'grammar-particles-intro',
      kind: 'intro',
      title: 'The small words at the end',
      body: [
        'Hmong puts small words at the END of a sentence to soften it, to ask for agreement, or to limit what was said. They are everywhere in real speech and almost absent from textbooks.',
        '## They carry tone of voice, not meaning',
        'A particle rarely changes WHAT you said. It changes how it lands — warmer, gentler, more insistent, more final. English does this with intonation, or with a tag like “…right?” or “…you know”.',
        '> Koj noj mov lov? — Have you eaten? (softened)',
        '> Koj tos kuv os. — Wait for me. (polite, gentle)',
        'Because of that, a particle is best learned by hearing it, not by reading a gloss. Take the glosses below as a starting point, and listen for these words whenever you hear Hmong spoken.',
        '## Asking for agreement',
        '> yom — right? isn’t it? (seeking soft agreement)',
        '> Koj twb noj mov lawm yom? — You’ve already eaten, right?',
        '> nawb — friendly insistence, a nudge',
        '> Koj yuav tuaj, nawb? — You’ll come, won’t you?',
        '## Softening',
        '> os — softens the sentence, polite',
        '> mog — a gentle softener, often affectionate',
        '> Koj yog kuv tus phooj ywg mog. — You are my friend.',
        '## Changing the subject, or coming back to it',
        '> ne — and what about…? (contrast or follow-up)',
        '> Koj niam ne? — And your mother?',
        '## Two that do change the meaning',
        'These two are not just tone of voice, and they are the ones to learn first.',
        '> Kuv nyiam koj thiab. — I like you too.',
        'At the end of a sentence, **thiab** means “also, too”. In the middle it means “and” — the same word doing a different job depending on where it sits.',
        '> Kuv noj mov xwb. — I only ate rice.',
        '**Xwb** means “only, just”, and it limits what you said.',
        '## An easy way to remember',
        '> particle at the END of the sentence',
        '> yom / nawb → asking you to agree',
        '> os / mog → softer, politer',
        '> ne → and what about…?',
        '> thiab → also, too · xwb → only, just',
      ],
    },
    {
      id: 'grammar-particles-examples',
      kind: 'examples',
      title: 'The particles',
      intro: 'Read each sentence aloud and listen to how the last word changes it.',
      // Hmong and glosses from the `discourse-particles` category. ⚠️ Only the last two
      // sentences are reviewed; the rest are the entries' AI-written examples.
      items: [
        { hmong: 'Koj yuav tuaj, nawb?', english: 'You’ll come, won’t you?', note: 'nawb: friendly insistence' },
        { hmong: 'Koj twb noj mov lawm yom?', english: 'You’ve already eaten, right?', note: 'yom: seeking agreement' },
        { hmong: 'Koj tos kuv os.', english: 'Wait for me.', note: 'os: polite, gentle' },
        { hmong: 'Koj noj mov lov?', english: 'Have you eaten?', note: 'lov: softens a question' },
        { hmong: 'Koj niam ne?', english: 'And your mother?', note: 'ne: and what about…?' },
        { hmong: 'Koj yog kuv tus phooj ywg mog.', english: 'You are my friend.', note: 'mog: affectionate softener' },
        { hmong: 'Kuv nyiam koj thiab.', english: 'I like you too.', note: 'thiab at the end: also, too' },
        { hmong: 'Kuv noj mov xwb.', english: 'I only ate rice.', note: 'xwb: only, just' },
      ],
    },
    {
      id: 'grammar-particles-quiz',
      kind: 'quiz',
      title: 'Learn the particles',
    },
  ],
}
