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
  // The Vocabulary page absorbed the quiz menu, so this help text covers both
  // halves now (study + test). See notes/2026-08-29-vocabulary-quiz-merge.
  '/vocabulary': {
    emoji: '🗂️',
    title: 'Vocabulary',
    body: [
      'Words are grouped into themes — People & Family, Nature & Food, and so on. Tap a theme to see its categories, then a category to study its words.',
      'Open any word to hear it, mark it Learning/Known, and (with Pro) save it to your notebook.',
      'Each category carries its own quiz: study half its words to unlock it, and your best score then rides on the row. Free accounts get a limited number of quizzes per day.',
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
  // KEEP — the /quiz MENU is retired, but the quiz engine still runs at
  // /quiz/<topicId>, and longest-prefix lookup means those screens land here.
  '/quiz': {
    emoji: '❓',
    title: 'Quizzes',
    body: [
      'Check what’s stuck. Vocab quizzes unlock once you’ve studied enough of that category.',
      'Free accounts get a limited number of quizzes per day. Every quiz lives on the Vocabulary page.',
    ],
  },
  '/notebook': {
    emoji: '📝',
    title: 'Notebook',
    body: [
      // 'Save words and keep your own notes as you learn.',  ← restore with the Notes tab
      'Save up to 25 words you want to remember, then study them as a flashcard deck.',
      'The notebook is part of KawmHmong Pro.',
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
  '/about': {
    emoji: '🌸',
    title: 'About',
    body: [
      'Why KawmHmong exists, and roughly how many people speak Hmong in each country.',
      'Every lesson in this app is White Hmong (Hmoob Dawb) — this page says so plainly, and says what the other dialect options do and do not change.',
    ],
  },
  '/account': {
    emoji: '👤',
    title: 'Account',
    body: 'Your profile, progress, dialect preference, and subscription. Manage or upgrade your plan here.',
  },
  '/paywall': {
    emoji: '⭐',
    title: 'KawmHmong Pro',
    // Was: '…the full reading library, your notebook, and every quiz.' — reading
    // is free (2026-09-15). Rewritten 2026-09-25 with the paywall's early-access card.
    body: [
      'Unlock every topic unit and word set, unlimited practice, pronunciation lessons, and your notebook. The grammar core and every story stay free.',
      'KawmHmong is early access, built by a single developer — new content is added as it is finished.',
    ],
  },
  // ⚠️ SEASON PASS — commented out 2026-09-23 until the server side exists.
  // Harmless to leave (nothing reaches /pass now), but kept out so the help
  // catalogue matches the app. Restore list: app/pass.jsx's header.
  // '/pass': {
  //   emoji: '🎖️',
  //   title: 'Season Pass',
  //   body: 'Earn XP to climb the season tiers and unlock rewards. Level is derived from your total XP.',
  // },
  // ⚠️ ADDED 2026-09-25. Covers /path and every unit screen under it
  // (/path/<unitId>) by longest-prefix lookup.
  //
  // ⚠️ HAND-WRITTEN FACTS THAT CAN DRIFT — update them with the code:
  //   · the step list: Tones is off (TONE_STEP_ENABLED in lib/pathProgress.js).
  //     Add a Tones line back if it is turned on.
  //   · "70%": PASS_MARK in lib/pathProgress.js. Not imported, to keep this
  //     file light: GlobalHeader loads it on every screen.
  //   · the free units: the `free` flags in data/path.js.
  //   · the free units: units 1–13, the grammar core (u-negation added 2026-09-26).
  //   · "at least 5" / "up to 10": SESSION_LENGTH / FULL_SESSION_LENGTH in
  //     lib/sentenceBuilder.js.
  '/path': {
    slides: [
      {
        emoji: '🧭',
        // Was: 'Your path' / 'The beginner course, …' — 'Paths', 2026-09-26.
        title: 'Paths',
        body: [
          'Learning paths, one unit at a time. Finish a unit to open the next one.',
          'It starts with how Hmong is built — pronouns, verbs, classifiers, joining words and questions — then moves on to topics like numbers, family and food.',
        ],
      },
      {
        emoji: '📘',
        title: 'Inside a unit',
        body: [
          'Most units open with a short introduction. “Read the full lesson” takes you to the lesson, and finishing it brings you back here.',
          'Then the steps: Flashcards to meet every word, a Quiz you pass at 70%, Sentences to put the words in order, and a short Reading.',
        ],
      },
      {
        emoji: '✅',
        title: 'Finishing a unit',
        body: [
          'A unit is done when every step is done — it then shows a trophy, and the next unit opens.',
          'A step marked “not ready yet” doesn’t hold you back: the unit completes without it.',
        ],
      },
      {
        emoji: '◆',
        title: 'Free and Pro',
        body: [
          // Was: "Greetings and You & Me are free. The units after them are part of Pro."
          // The whole grammar core went free, 2026-09-25.
          'The fundamentals are always free — every grammar unit, from Greetings and You & Me through Sentence Particles. Every step, no limits.',
          'The topic units after them — Numbers, Family, Feelings, Colors and more — are part of Pro.',
        ],
      },
    ],
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
