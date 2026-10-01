// SPEAK LAB — experimental lesson script format. NOT wired into the real Speak
// module; nothing here is imported by app/(tabs)/speak.jsx or src/data/speak.js.
// Safe to break.
//
// THE IDEA: a lesson is a SCRIPT — an ordered list of TYPED steps. The screen is
// a switch on step.type. Adding an interaction later = one new type + one new
// branch; the stepper never changes. 20 lessons become 20 pieces of DATA rather
// than 20 screens.
//
// ⚠️⚠️ THE HMONG BELOW IS PLACEHOLDER. It was written to exercise the flow, NOT
// by a native speaker. Do not ship a single line of it without verification.
// See the content quality pipeline in notes/2026-08-18-content-implementation-plan.md.
//
// SPEECH IS SEPARATE FROM VOCAB (decision 2026-08-20): this file imports nothing
// from src/data/vocabulary.js and never will. Speak teaches SITUATIONS; Words
// teaches ITEMS. A word appearing in both places is written down twice, and that
// duplication is cheaper than an abstraction that fits neither.

// ── Step types ──────────────────────────────────────────────────────────────
//
//   { type: 'hear',  hmong, english, audio }
//       Listen to the whole phrase before it means anything.
//
//   { type: 'word',  hmong, english, audio, note? }
//       Meet ONE word. `note` is an optional usage/tone hint.
//
//   { type: 'say',   hmong, english, audio }
//       Record, play back, A/B compare, self-assess. No gating.
//
//   { type: 'dialogue', turns: [{ speaker, hmong, english, audio, record? }] }
//       The closing exchange. `record: true` marks the learner's turn.
//
// `audio` uses the SAME convention as speak.js: '' when no recording exists yet.
// Every step needs a unique `id` — it is the progress key (see markStepComplete).

// ── The "double check" authoring rule ───────────────────────────────────────
//
// Any phrase worth learning appears TWICE, at least 4 steps apart. The runner
// needs no knowledge of this — the SPACING does the work, and spacing is a
// property of the script, not the code. Repeats reuse the same text but get
// their own step id (…-again) so progress counts them separately.

export const LAB_LESSON = {
  id: 'lab-greetings',
  title: 'Greetings (lab)',
  description: 'Say hello and give your name. Placeholder Hmong — unverified.',
  steps: [
    // 0. Orient before any Hmong appears. No audio, no interaction — a learner
    //    who just opened the app should not be asked to do anything yet.
    {
      id: 'lab-greetings-intro',
      type: 'intro',
      emoji: '🌸',
      title: 'Welcome to KawmHmong',
      body: [
        'This is your first speaking lesson.',
        'Hear a native speaker, learn each word, then say it and compare.',
      ],
      duration: '5–10 minutes',
    },

    // 1. Hear the target whole, before any breakdown.
    {
      id: 'lab-greetings-hear',
      type: 'hear',
      hmong: 'Nyob zoo, kuv lub npe hu ua Ntxawg.',
      english: 'Hello, my name is Ntxawg.',
      audio: '',
    },

    // 2-3. Meet a word, then say it.
    // ── word step DISABLED 2026-08-24 (redundant with the say step ──
    // {
    // id: 'lab-greetings-word-nyobzoo',
    // type: 'word',
    // hmong: 'nyob zoo',
    // english: 'hello',
    // audio: '',
    // note: 'The everyday greeting. Two syllables, both level.',
    // },
    {
      id: 'lab-greetings-say-nyobzoo',
      type: 'say',
      hmong: 'nyob zoo',
      english: 'hello',
      audio: '',
    },

    // 4-5. Another word, same pattern.
    // ── word step DISABLED 2026-08-24 (redundant with the say step ──
    // {
    // id: 'lab-greetings-word-kuv',
    // type: 'word',
    // hmong: 'kuv',
    // english: 'I / my',
    // audio: '',
    // },
    {
      id: 'lab-greetings-say-kuv',
      type: 'say',
      hmong: 'kuv',
      english: 'I / my',
      audio: '',
    },

    // 6-7. Third word.
    // ── word step DISABLED 2026-08-24 (redundant with the say step ──
    // {
    // id: 'lab-greetings-word-npe',
    // type: 'word',
    // hmong: 'npe',
    // english: 'name',
    // audio: '',
    // },
    {
      id: 'lab-greetings-say-npe',
      type: 'say',
      hmong: 'npe',
      english: 'name',
      audio: '',
    },

    // 8. DOUBLE CHECK — 'nyob zoo' returns, 5 steps after its first appearance.
    {
      id: 'lab-greetings-say-nyobzoo-again',
      type: 'say',
      hmong: 'nyob zoo',
      english: 'hello',
      audio: '',
    },

    // 9. The full sentence — straight from words to the whole phrase. No
    //    intermediate 'build' step: for everyday speech that matches how people
    //    actually learn a greeting.
    {
      id: 'lab-greetings-say-full',
      type: 'say',
      hmong: 'Kuv lub npe hu ua Ntxawg.',
      english: 'My name is Ntxawg.',
      audio: '',
    },

    // 10. Dialogue — everything used at once. App plays speaker A, the learner
    //     records speaker B. Closest thing to a real conversation, and it reuses
    //     the `say` machinery almost unchanged.
    {
      id: 'lab-greetings-dialogue',
      type: 'dialogue',
      turns: [
        {
          speaker: 'A',
          hmong: 'Nyob zoo! Koj lub npe hu li cas?',
          english: 'Hello! What is your name?',
          audio: '',
        },
        {
          speaker: 'B',
          hmong: 'Kuv lub npe hu ua Ntxawg.',
          english: 'My name is Ntxawg.',
          audio: '',
          record: true, // ← the learner's turn
        },
      ],
    },
  ],
}

/** Every lesson in the lab. One today; the runner already takes a lesson prop. */
export const LAB_LESSONS = [LAB_LESSON]

export function getLabLesson(id) {
  return LAB_LESSONS.find((l) => l.id === id) || null
}
