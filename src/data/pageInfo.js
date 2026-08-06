// Per-page help content shown by the header "i" button (see GlobalHeader).
//
// Keyed by route path. Lookup is longest-PREFIX-wins, so a nested route like
// /speak/group/speak-tones falls back to the /speak entry unless it has its own.
// To add help for a new page, add one entry here — nothing else to wire.
//
// `body` is a string or string[] (each item = a paragraph), matching InfoModal.

export const PAGE_INFO = {
  '/': {
    emoji: '🏠',
    title: 'Home',
    body: [
      'Your daily hub — today’s word and phrase, your streak, and quick links into every section.',
      'Tap “Say this today” to jump straight into a pronunciation practice.',
    ],
  },
  '/learn': {
    emoji: '📚',
    title: 'Learn',
    body: [
      'Structured lessons that teach vocabulary and grammar in teaching order.',
      'Finish a lesson’s study step to unlock its quiz — testing words you haven’t seen is guessing, not learning.',
    ],
  },
  '/vocabulary': {
    emoji: '🗂️',
    title: 'Vocabulary',
    body: [
      'Browse words by category. Open any word to hear it, mark it Learning/Known, and (with Pro) save it to your notebook.',
    ],
  },
  '/reference': {
    slides: [
      {
        emoji: '📖',
        title: 'Reference',
        body: 'Letters, tones, and grammar at a glance — or search it all. Swipe to see what each tab does.',
      },
      {
        emoji: '🔤',
        title: 'Consonants & Vowels',
        body: 'The building blocks of Hmong RPA, grouped from single letters up to the trickier clusters. Tap any letter to hear it.',
      },
      {
        emoji: '🎵',
        title: 'Tones',
        body: 'Hmong has eight tones, and tone changes meaning. Each row shows the tone marker, an example, and its pitch — the same tones you drill in Speak.',
      },
      {
        emoji: '🔍',
        title: 'Search',
        body: [
          'The most useful tab: search every word, letter, and phrase in one place.',
          'Tap a result’s speaker to hear it. Free accounts can hear a limited number of pronunciations per day.',
        ],
      },
    ],
  },
  '/speak': {
    emoji: '🎤',
    title: 'Speak',
    body: [
      'Pronunciation practice: listen to a native recording, record your own voice, and compare your pitch against the native curve.',
      'The Eight Tones lesson is always free. Free accounts get a set number of other practices per day — the badge shows how many are left.',
    ],
  },
  '/quiz': {
    emoji: '❓',
    title: 'Quizzes',
    body: [
      'Check what’s stuck. Vocab quizzes unlock once you’ve studied enough of that category.',
      'Free accounts get a limited number of quizzes per day.',
    ],
  },
  '/notebook': {
    emoji: '📝',
    title: 'Notebook',
    body: [
      'Save words and keep your own notes as you learn.',
      'The notebook is part of Kawm Hmoob Pro.',
    ],
  },
  '/reading': {
    emoji: '📄',
    title: 'Reading',
    body: 'Short readings that put vocabulary in context. Free accounts can open a limited number per day.',
  },
  '/search': {
    emoji: '🔍',
    title: 'Search',
    body: [
      'Find any word fast. Tap the speaker to hear it pronounced.',
      'Free accounts can hear a limited number of pronunciations per day.',
    ],
  },
  '/words': {
    slides: [
      {
        emoji: '🧠',
        title: 'Words',
        body: [
          'Your vocabulary home. Today’s session pulls the words due for review, spaced so they come back right before you’d forget.',
          'Swipe to see the other ways to drill.',
        ],
      },
      {
        emoji: '🔁',
        title: 'Word practice',
        body: 'The daily session — spaced-repetition reps of reviews due plus a few new words. Short and game-like; a few minutes a day is the whole idea.',
      },
      {
        emoji: '⚡',
        title: 'Quizzes',
        body: [
          'Multiple-choice drills by topic. A vocab quiz unlocks once you’ve studied enough of that category.',
          'Free accounts get a limited number of quizzes per day.',
        ],
      },
      {
        emoji: '📖',
        title: 'Reading & comprehension',
        body: [
          'Longer passages that put vocabulary in context, with questions to test understanding.',
          'Free accounts can open a limited number of readings per day.',
        ],
      },
      {
        emoji: '🧩',
        title: 'Sentence builder',
        body: [
          'Assemble sentences from parts to learn word order and grammar.',
          'Free accounts get a limited number of builder sessions per day.',
        ],
      },
    ],
  },
  '/alphabet': {
    emoji: '🔤',
    title: 'Alphabet',
    body: 'The Hmong RPA alphabet — consonants, vowels, and the tone markers, with audio for each.',
  },
  '/account': {
    emoji: '👤',
    title: 'Account',
    body: 'Your profile, progress, dialect preference, and subscription. Manage or upgrade your plan here.',
  },
  '/paywall': {
    emoji: '⭐',
    title: 'Kawm Hmoob Pro',
    body: 'Unlock unlimited pronunciation practice, the full reading library, your notebook, and every quiz.',
  },
  '/pass': {
    emoji: '🎖️',
    title: 'Season Pass',
    body: 'Earn XP to climb the season tiers and unlock rewards. Level is derived from your total XP.',
  },
  '/leaderboard': {
    emoji: '🏆',
    title: 'Leaderboard',
    body: 'See how your XP stacks up against other learners this season.',
  },
}

// Longest-prefix match so nested routes inherit their section’s help.
export function getPageInfo(pathname) {
  if (!pathname) return null
  let bestKey = null
  for (const key of Object.keys(PAGE_INFO)) {
    const match = key === '/' ? pathname === '/' : pathname.startsWith(key)
    if (match && (!bestKey || key.length > bestKey.length)) bestKey = key
  }
  return bestKey ? PAGE_INFO[bestKey] : null
}
