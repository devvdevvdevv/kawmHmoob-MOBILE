// CHANGELOG — what has changed in KawmHmong, for the person using it.
//
// ⚠️ WRITTEN FOR A LEARNER, NOT FOR THE AUTHOR. notes/ is the engineering record: 221
// dated notes, every bug and every ruling. This file is the handful of those a learner
// would notice, in their words. If an entry only means something to someone who has read
// the code, it does not belong here.
//
// ⚠️ IT IS ALSO A PROMISE ABOUT THE APP'S HONESTY, so two rules:
//   · Nothing here may claim every word or clip was made by a person. AI-written example
//     sentences ship before a speaker has reviewed them (2026-09-21), which is why the
//     paywall and About had those claims removed. A changelog is the easiest place for
//     one to creep back in.
//   · No dates for things that have not happened. "Coming soon" ages badly in a store
//     listing and is the one sentence a reviewer will hold you to.
//
// ⚠️ GROUPED BY WHAT SHIPPED, NOT BY VERSION NUMBER, because the app has had one version
// number (1.0.0) since 2026-09-30 while the content has grown every week since. The
// `version` field is only set where a real release exists.
//
// To add an entry: put it at the TOP of the newest period's `items`. `kind` is 'new',
// 'better' or 'fixed' — three is enough, and a fourth would need a fourth colour.

export const CHANGELOG = [
  {
    id: 'oct-2026',
    period: 'October 2026',
    // No version: this is what has landed since 1.0 went out, still in development.
    note: 'In development — these are in the app you are using, not yet in a store release.',
    items: [
      {
        kind: 'new',
        title: 'A tone-shift key, and a unit that teaches it',
        body:
          'Some words change tone depending on the tone before them. There is now a written key for when that happens, and a unit that teaches it straight after Muaj, early enough to be useful rather than as a footnote.',
      },
      {
        kind: 'new',
        title: 'A second speaker, and a switch between voices',
        body:
          'The double consonants are now recorded by a second speaker as well, and there is a male / female switch for which voice you hear. Where a clip exists in only one voice, the app plays the one it has rather than going silent.',
      },
      {
        kind: 'new',
        title: 'Muaj — the fourth way to say "to be"',
        body:
          'Yog, Hu ua and Nyob were already taught. Muaj joins them, every "to be" lesson now points at it where it belongs, and the four are capitalised the way they are written.',
      },
      {
        kind: 'better',
        title: 'Family terms sit together, and the set labels say what they are',
        body:
          'The male-speaker and female-speaker family terms are on one page instead of two, relatives moved below them, and the groups are no longer labelled "primary" and "secondary" — they say what they actually hold.',
      },
      {
        kind: 'better',
        title: 'Lessons read like pages, not like one long block',
        body:
          'Long lesson introductions now carry headings, and the Hmong inside them is bold, so you can find the part you came back for instead of reading from the top each time.',
      },
      {
        kind: 'better',
        title: 'Verb definitions start with "to"',
        body:
          'A verb card used to read "eat" where a noun card read "food", and nothing told you which was which. Verbs now read "to eat", "to go", "to study".',
      },
      {
        kind: 'better',
        title: 'Compound words are written joined',
        body:
          'Phoojywg, tabtom, xibfwb, pojniam, txivneej, naghmo and tagkis are single words, and the app now spells them that way throughout. Phrases that really are two words stay spaced.',
      },
      {
        kind: 'better',
        title: 'The reading words are grouped by subject',
        body:
          'The dictionary sets behind the stories had drifted: run was filed under Feeling, month under Speaking, work under Places. Over a hundred words moved to the set they belong in, and the catch-all "General" set is less than half the size it was.',
      },
      {
        kind: 'better',
        title: 'Tense markers and tense patterns are separate sets',
        body:
          'One set held both the words that mark tense (tab tom, yuav, tau, tseem, lawm) and the patterns they build. They are two sets now, so a deck asks you one kind of question at a time.',
      },
      {
        kind: 'better',
        title: 'Home shows what you are up to next',
        body:
          'Your next course units sit directly under Today, above Explore, and the cards across the app carry a line saying what the page is for before you open it.',
      },
      {
        kind: 'better',
        title: 'The sentence builder leads with mixed review',
        body:
          'Mixed review moved to the top, and the drills built from sentences a speaker has not checked yet are kept in their own group rather than mixed in with the rest.',
      },
      {
        kind: 'fixed',
        title: 'Lessons that existed but could not be opened',
        body:
          'Several written lessons were unreachable — they loaded, they were correct, and no screen linked to them. They are reachable now, and there is a check that fails when a new one is not.',
      },
      {
        kind: 'fixed',
        title: 'Example sentences that taught a different word',
        body:
          'The card for ruam (foolish) was illustrated by a sentence where ruam meant a step, and a story question could be answered by picking the longest option without reading any Hmong. Both are corrected.',
      },
      {
        kind: 'new',
        title: 'Every vowel, in all eight tones — with audio',
        body:
          'A page for each tone showing it on all 13 vowels, a page for each vowel showing it in all 8 tones, and a grid of the whole set. 104 new recordings, so you can hear ab, aj, av, a, as, ag, am, ad rather than read them.',
      },
      {
        kind: 'new',
        title: 'Consonants and vowels got their own sections in Speak',
        body:
          'The alphabet drills were one list with the vowels buried under the quadruple consonants. They are two sections now, and every letter is capitalised the way RPA writes it.',
      },
      {
        kind: 'better',
        title: 'The sentence builder follows the course',
        body:
          'It used to offer 27 drills at once. Now it shows the sets you have unlocked by finishing a unit, the one to do next, and a mixed review drawn only from what you have learned.',
      },
      {
        kind: 'better',
        title: 'Tone scoring says it is experimental',
        body:
          'The score now carries a line saying it is a rough guide and the curve is the real feedback — because the scoring has not been calibrated against human judgement yet.',
      },
      {
        kind: 'better',
        title: 'The course is 45 units',
        body:
          'Colours were separated from describing words, every unit carries its Hmong name, and the grammar core — the first seven units — is free.',
      },
      {
        kind: 'better',
        title: 'The dictionary gives each meaning its own entry',
        body:
          'A word that means several things (rau, tau, tom qab) now has one card per meaning in the right set, instead of one card trying to say all of them.',
      },
      {
        kind: 'fixed',
        title: 'Audio no longer dies until you restart',
        body:
          'Playing many clips in a row could silence the app until it was restarted. The app now keeps one player and sets up the audio session at launch.',
      },
      {
        kind: 'fixed',
        title: 'Lesson questions no longer mark themselves wrong',
        body:
          'Moving to the next question in a lesson carried the previous answer with it, so the new question opened already marked incorrect.',
      },
      {
        kind: 'fixed',
        title: 'Taps that did nothing',
        body:
          'On the vowel pages, the tone rows and the other-vowel tiles looked tappable and were not.',
      },
      {
        kind: 'better',
        title: 'Season pass price lowered to $7.99',
        body: 'Down from $9.99.',
      },
    ],
  },

  {
    id: 'v1',
    period: 'September 2026',
    version: '1.0',
    note: 'The first release.',
    items: [
      {
        kind: 'new',
        title: 'The Paths — a course that unlocks as you go',
        body:
          'Units in a fixed order, each one a lesson to read plus five drills: flashcards, a quiz, tones, sentences and a short reading. Finish a unit and the next opens.',
      },
      {
        kind: 'new',
        title: 'Spell it out — a tone drill that needs no microphone',
        body:
          'Read the English, build the Hmong from letters and a tone. It grades the tone off the spelling, so typing zos for zoo is named as a tone mistake rather than a typo.',
      },
      {
        kind: 'new',
        title: 'The reading library',
        body:
          'Short stories with the English one tap away, any word tappable for its meaning, a glossary sheet, and a comprehension quiz at the end.',
      },
      {
        kind: 'new',
        title: 'The sentence builder',
        body:
          'Read the English, tap the Hmong words back into order — with decoy words that do not belong, and a grammar note when you get one wrong.',
      },
      {
        kind: 'new',
        title: 'Speak — record yourself and compare',
        body:
          'Hear a native recording, record your own, play them back to back, and see your pitch against the reference curve.',
      },
      {
        kind: 'new',
        title: 'A dictionary of about 2,000 words',
        body:
          'Searchable, grouped into sets, with example sentences, and a notebook you can save words into.',
      },
      {
        kind: 'new',
        title: 'KawmHmong Pro',
        body:
          'The grammar core, the alphabet, the tones and the first stories stay free. Pro opens the rest of the course and the full drills.',
      },
      {
        kind: 'new',
        title: 'About, Privacy and a contact form',
        body:
          'Why the app exists, what it stores, and a way to tell me when something is wrong — with an honest "sent" rather than a hopeful one.',
      },
    ],
  },

  {
    id: 'aug-2026',
    period: 'August 2026',
    note: 'Getting it ready to release.',
    items: [
      {
        kind: 'new',
        title: 'The Speak module',
        body:
          'A/B compare, a lesson engine, and tone scoring — including real PCM recording on Android, which took three attempts and a different audio library.',
      },
      {
        kind: 'new',
        title: 'Quizzes that know what you have studied',
        body:
          'A quiz asks every word in a set rather than a capped ten, you can choose Hmong→English or the reverse, and a set has to be studied before it can be quizzed.',
      },
      {
        kind: 'new',
        title: 'Vocabulary and Quizzes became one page',
        body: 'Two doors to the same words became one: study a set, then test it.',
      },
      {
        kind: 'new',
        title: 'The notebook',
        body: 'Save up to 15 words and study them as their own deck.',
      },
      {
        kind: 'new',
        title: 'Subscriptions, a paywall, and a daily free allowance',
        body:
          'Wired through RevenueCat, with a free allowance each day so the app is usable without paying.',
      },
      {
        kind: 'new',
        title: 'Leaderboard, onboarding and a season pass',
        body: 'Weekly standings, a first-run tour, and tiers to work through.',
      },
      {
        kind: 'better',
        title: 'Upgraded to Expo SDK 54',
        body: 'From SDK 51 — three majors, for the newer audio and build tooling.',
      },
    ],
  },

  {
    id: 'jul-2026',
    period: 'July 2026',
    note: 'The app itself.',
    items: [
      {
        kind: 'new',
        title: 'KawmHmong became a real app',
        body:
          'Ported from the web version into React Native: the tab bar and app shell, light, dark and neon themes, and the whole design system rebuilt for a phone.',
      },
      {
        kind: 'new',
        title: 'The curriculum and the audio came in',
        body:
          'Lessons, word sets and 315 audio clips — bundled into the app, so everything that plays works with no connection.',
      },
      {
        kind: 'new',
        title: 'Flashcards, Reference and the Words hub',
        body:
          'Cards that flip and remember what you know, the alphabet and grammar tables on one tabbed page, and a hub for everything about words.',
      },
      {
        kind: 'better',
        title: 'An accessibility pass over every core page',
        body: 'Tap targets, contrast, and labels on controls that only showed an icon.',
      },
    ],
  },
]

/** Every entry, flattened — for a count or a search index. */
export function allChangelogItems() {
  return CHANGELOG.flatMap((period) => period.items.map((item) => ({ ...item, period: period.period })))
}

/** The newest period's label, for "last updated" lines. */
export function latestPeriod() {
  return CHANGELOG[0]?.period || ''
}
