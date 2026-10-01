// Speak section data — phrases for pronunciation practice.
//
// Schema (one group → many phrases):
//   {
//     id, title, description,
//     phrases: [{
//       id,        REQUIRED — globally unique, namespaced `speak-…`; used
//                  as-is as the progress key in completedSteps
//       hmong,     REQUIRED — the phrase in RPA
//       english,   REQUIRED
//       audio,     '' when no native recording exists yet, otherwise an
//                  absolute path like '/assets/audio/nyob-zoo.mp3'
//       tip,       optional — a short pronunciation/tone pointer
//       tier,      optional — 'pro' gates the phrase behind the paywall
//     }]
//   }
//
// Edit by hand like every other file in src/data/. When a real recording
// lands, fill in `audio` — the Speak UI upgrades itself (Listen + A/B
// compare appear automatically).

import { tones } from './reference.js'

// ── Tones — the first fully-scoreable Speak group ───────────────────────────
// Derived from reference.js so the audio paths can never drift from the tone
// table. Every entry has a real recording (t.audio), so this group is where
// record→score actually works end to end. See notes/62.
//
// `hmong` is the tone's demonstration word from `example2` (e.g. "Cim Siab") —
// NOT "po…", per the recordings. ⚠️ VERIFY each `hmong` string against what the
// clip actually says; Claude can't hear audio, so this is best-effort from the
// data and you may need to trim "Cim " or adjust a word.
const toneSpeakGroup = {
  id: 'speak-tones',
  category: 'tones',
  title: 'The Eight Tones',
  // `free: true` — the tones are the foundational hook and are ALWAYS free:
  // never Pro-locked, and EXEMPT from the daily speak-practice quota. Every
  // quota/lock check must skip a group with this flag.
  free: true,
  description:
    'Hear each tone, say it back, and watch your pitch against the native curve.',
  phrases: tones.map((t) => ({
    id: `speak-tone-${t.marker || 'mid'}`,
    hmong: t.example2, // demonstration word for this tone — verify vs recording
    english: `${t.name} tone`,
    audio: t.audio,
    tip: t.description,
  })),
}

export const speakGroups = [
  toneSpeakGroup,
  {
    id: 'speak-greetings',
    category: 'phrases',
    title: 'Greetings',
    description: 'The phrases you will say most. Get these tones right first.',
    // All five wired to the greetings-and-farewells recordings, so they
    // record + score end to end. See notes/62.
    phrases: [
      {
        id: 'speak-nyob-zoo',
        hmong: 'Nyob zoo',
        english: 'Hello',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-nyob-zoo.mp3',
        tip: 'Both syllables carry a high, even tone — keep them level, don’t let "zoo" fall.',
      },
      {
        id: 'speak-koj-puas-nyob-zoo',
        hmong: 'Koj puas nyob zoo?',
        english: 'How are you?',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-koj-puas-nyob-zoo.mp3',
        tip: 'The "-j" in "Koj" is a falling tone: start high, drop.',
      },
      {
        id: 'speak-kuv-nyob-zoo',
        hmong: 'Kuv nyob zoo',
        english: 'I am well',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-kuv-nyob-zoo.mp3',
        tip: '"Kuv" ends in -v: a mid-rising tone, like asking a tiny question.',
      },
      {
        id: 'speak-sib-ntsib-dua',
        hmong: 'Sib ntsib dua',
        english: 'See you again',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-sib-ntsib-dua.mp3',
        tip: 'The -b endings are high tones; keep the pitch up on both.',
      },
      {
        id: 'speak-mus-zoo',
        hmong: 'Mus zoo',
        english: 'Go well (to the one leaving)',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-mus-zoo.mp3',
        tip: '"Mus" ends in -s: a low tone. Start low, stay low, then lift into "zoo".',
      },
    ],
  },
  {
    id: 'speak-politeness',
    category: 'phrases',
    title: 'Politeness',
    description: 'Thank you, sorry, please — small words, big goodwill.',
    phrases: [
      {
        id: 'speak-ua-tsaug',
        hmong: 'Ua tsaug',
        english: 'Thank you',
        audio: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-ua-tsaug.mp3',
        tip: '"Tsaug" ends in -g: a breathy low falling tone.',
      },
      // ✅ RESTORED 2026-09-12 — these three were commented out for want of a
      // clip. The Thanks & Sorry lesson recordings cover all three, so they are
      // back with the same ids and tips they were archived with.
      //
      // ⚠️ THE CLIPS LIVE UNDER lessons/, NOT phrases/. notes/audio-todo.md
      // asks for `assets/audio/phrases/thov-txim.mp3` because that is where it
      // expects drill audio; the takes were made for the lesson and there is no
      // reason to hold a second copy. If a drill-specific reading is ever
      // recorded, point these at it — nothing else needs to change.
      //
      // ⚠️ .wav, not .mp3 — see the note in src/data/speakLessons.js.
      {
        id: 'speak-thov-txim',
        hmong: 'Thov txim',
        english: 'Sorry / excuse me',
        audio: '/assets/audio/lessons/politeness/thov-txim.wav',
        tip: '"Thov" rises (-v); "txim" stays level. Mind the aspirated "Th".',
      },
      {
        id: 'speak-tsis-ua-li-cas',
        hmong: 'Tsis ua li cas',
        english: "You're welcome / no worries",
        audio: '/assets/audio/lessons/politeness/tsis-ua-li-cas.wav',
        tip: 'Four quick syllables — keep the rhythm even rather than rushing the middle.',
      },
      {
        id: 'speak-thov',
        hmong: 'Thov',
        english: 'Please',
        audio: '/assets/audio/lessons/politeness/thov.wav',
        tip: 'The "Th" is aspirated — a puff of air, not the English "th" in "the".',
      },
    ],
  },
  // COMMENTED OUT — no recordings for any of these phrases yet. The Speak page
  // should only show items that can actually be recorded + scored. Restore the
  // whole group when audio lands; do NOT delete. See notes/62.
  // {
  //   id: 'speak-daily-life',
  //   title: 'Daily Life',
  //   description: 'The small things people actually say to each other every day.',
  //   phrases: [
  //     {
  //       id: 'speak-koj-noj-mov-tau',
  //       hmong: 'Koj noj mov tau?',
  //       english: 'Have you eaten?',
  //       audio: '',
  //       tip: 'A greeting as much as a question — asking after someone\'s meal is asking after them.',
  //     },
  //     {
  //       id: 'speak-kuv-tshaib-plab',
  //       hmong: 'Kuv tshaib plab',
  //       english: "I'm hungry",
  //       audio: '',
  //       tip: 'Literally "my stomach is hungry" — the body part carries the feeling.',
  //     },
  //     {
  //       id: 'speak-kuv-nqhis-dej',
  //       hmong: 'Kuv nqhis dej',
  //       english: "I'm thirsty",
  //       audio: '',
  //       tip: 'Literally "I thirst water." The "nqh" is one sound — hum it through the nose.',
  //     },
  //     {
  //       id: 'speak-kuv-tsaug-zog',
  //       hmong: 'Kuv tsaug zog',
  //       english: "I'm tired / sleepy",
  //       audio: '',
  //       tip: 'Don\'t confuse "tsaug zog" (sleepy) with "ua tsaug" (thank you).',
  //     },
  //   ],
  // },
  // {
  //   id: 'speak-introductions',
  //   title: 'Introductions',
  //   description: 'Names, ages, where you live — your first real conversation.',
  //   phrases: [
  //     {
  //       id: 'speak-koj-lub-npe',
  //       hmong: 'Koj lub npe hu li cas?',
  //       english: 'What is your name?',
  //       audio: '',
  //       tip: 'The "np" in "npe" is prenasalized — a quick "n" melting into "p".',
  //       tier: 'pro',
  //     },
  //     {
  //       id: 'speak-kuv-lub-npe',
  //       hmong: 'Kuv lub npe hu ua…',
  //       english: 'My name is…',
  //       audio: '',
  //       tip: 'Practice sliding your own name onto the end without dropping the tone of "ua".',
  //       tier: 'pro',
  //     },
  //     {
  //       id: 'speak-koj-nyob-qhov-twg',
  //       hmong: 'Koj nyob qhov twg?',
  //       english: 'Where do you live?',
  //       audio: '',
  //       tip: '"Qhov" starts deep in the throat — an aspirated q, further back than English k.',
  //       tier: 'pro',
  //     },
  //   ],
  // },
  // ══ GRAMMAR ═══════════════════════════════════════════════════════════════
  // Added 2026-08-29 to give the Grammar tab real content instead of an empty
  // shell. Every clip was ALREADY bundled (src/lib/audioMap.js) — the mobile app
  // simply had no data referencing the grammar folders.
  //
  // Hmong + English + notes are taken VERBATIM from the web app's own data
  // (KawmHmoob/src/data). Nothing here was authored or guessed.
  //
  // Same shape as every other group, so `/speak/group/[groupId]` drills these
  // with ZERO new screens.
  {
    id: 'speak-grammar-pronouns',
    category: 'grammar',
    title: 'Pronouns',
    // FREE — 2026-09-28 (author: "make pronoun speak practice free"). Pronouns are unit 2 of the
    // free path, and the home "Phrase of the day" now draws from this group. `free` also exempts
    // it from the daily speak quota, like the tones. TO RE-LOCK: remove this line.
    free: true,
    description: 'Hmong marks ONE, TWO, and THREE-OR-MORE — a distinction English lost.',
    phrases: [
      { id: 'speak-pron-kuv', hmong: 'Kuv', english: 'I / me / my', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-kuv.mp3', tip: 'Singular.' },
      { id: 'speak-pron-koj', hmong: 'Koj', english: 'you', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-koj.mp3', tip: 'Singular.' },
      { id: 'speak-pron-nws', hmong: 'Nws', english: 'he / she / it', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-nws.mp3', tip: 'Singular, no gender — one word covers all three.' },
      { id: 'speak-pron-wb', hmong: 'Wb', english: 'we two (you and I)', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-wb.mp3', tip: 'Dual — exactly two people, including the speaker.' },
      { id: 'speak-pron-neb', hmong: 'Neb', english: 'you two', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-neb.mp3', tip: 'Dual — exactly two listeners.' },
      { id: 'speak-pron-peb', hmong: 'Peb', english: 'we (three or more)', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-peb.mp3', tip: 'Also the number three — context separates them.' },
      { id: 'speak-pron-nej', hmong: 'Nej', english: 'you (three or more)', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-nej.mp3', tip: 'Plural.' },
      { id: 'speak-pron-lawv', hmong: 'Lawv', english: 'they', audio: '/assets/audio/grammar/pronouns/hmong-pronouns-lawv.mp3', tip: 'Plural. "Lawv lub tsev" = their house.' },
    ],
  },
  {
    id: 'speak-grammar-yog',
    category: 'grammar',
    title: 'Yog — to be',
    description: 'One verb for am / is / are — plus negation and questions.',
    phrases: [
      { id: 'speak-yog-base', hmong: 'Yog', english: 'is / to be', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-yog.mp3', tip: 'The bare verb — no conjugation to learn.' },
      { id: 'speak-yog-kuv', hmong: 'Kuv yog', english: 'I am', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', tip: '"Kuv yog Hmoob" = I am Hmong.' },
      { id: 'speak-yog-koj', hmong: 'Koj yog', english: 'you are', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', tip: 'Pairs with "puas" questions: "Koj puas yog…?"' },
      { id: 'speak-yog-nws', hmong: 'Nws yog', english: 'he / she is', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', tip: 'One pronoun covers he, she and it.' },
      { id: 'speak-yog-tsis', hmong: 'Tsis yog', english: 'is not / no', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', tip: '"Tsis" is the general negator — it works on other verbs too.' },
      { id: 'speak-yog-puas', hmong: 'Puas yog?', english: 'Is it? / Right?', audio: '/assets/audio/grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3', tip: 'Tacked on the end, it works like "…right?"' },
    ],
  },
  {
    id: 'speak-grammar-tense',
    category: 'grammar',
    title: 'Tense markers',
    description: 'Verbs never change form. A small word does the work.',
    phrases: [
      { id: 'speak-tense-tabtom', hmong: 'tab tom', english: 'currently (-ing)', audio: '/assets/audio/grammar/tense-markers/hmong-tense-markers-tabtom.mp3', tip: 'Before the verb: "Kuv tab tom noj" — I am eating.' },
      { id: 'speak-tense-yuav', hmong: 'yuav', english: 'will (future)', audio: '/assets/audio/grammar/tense-markers/hmong-tense-markers-yuav.mp3', tip: 'Before the verb: "Kuv yuav noj" — I will eat.' },
      { id: 'speak-tense-tau', hmong: 'tau', english: 'did, have done (attained, completed)', audio: '/assets/audio/grammar/tense-markers/hmong-tense-markers-tau.mp3', tip: 'Before the verb: "Kuv tau noj" — I have eaten.' },
      { id: 'speak-tense-tseem', hmong: 'tseem', english: 'still', audio: '/assets/audio/grammar/tense-markers/hmong-tense-markers-tseem.mp3', tip: 'Before the verb: "Kuv tseem noj" — I am still eating.' },
      { id: 'speak-tense-lawm', hmong: 'lawm', english: 'completed (sentence-final)', audio: '/assets/audio/grammar/tense-markers/hmong-tense-markers-lawm.mp3', tip: '⚠️ Goes at the END: "Kuv noj lawm" — I ate already.' },
    ],
  },
  {
    id: 'speak-grammar-demonstratives',
    category: 'grammar',
    title: 'This & that',
    description: 'They follow the noun — the opposite of English.',
    phrases: [
      { id: 'speak-dem-no', hmong: 'No', english: 'this', audio: '/assets/audio/grammar/common-demonstratives/hmong-demonstratives-no.mp3', tip: '"Lub tsev no" = this house — it FOLLOWS the noun.' },
      { id: 'speak-dem-ntawd', hmong: 'Ntawd', english: 'that', audio: '/assets/audio/grammar/common-demonstratives/hmong-demonstratives-ntawd.mp3', tip: 'That one, over there — away from the speaker.' },
      { id: 'speak-dem-ko', hmong: 'Ko', english: 'that (near listener)', audio: '/assets/audio/grammar/common-demonstratives/hmong-demonstratives-ko.mp3', tip: 'Specifically near the person you are talking to.' },
      { id: 'speak-dem-ntawm-no', hmong: 'Ntawm no', english: 'here', audio: '/assets/audio/grammar/common-demonstratives/hmong-demonstratives-ntawm-no.mp3', tip: 'Literally "at this (place)."' },
      { id: 'speak-dem-ntawm-ntawd', hmong: 'Ntawm ntawd', english: 'there', audio: '/assets/audio/grammar/common-demonstratives/hmong-demonstratives-ntawm-ntawd.mp3', tip: 'Literally "at that (place)."' },
    ],
  },
]

// ── Helpers — pure lookups over the data above ──────────────────────────────

export function allPhrases() {
  return speakGroups.flatMap((g) => g.phrases)
}

export function getPhrase(phraseId) {
  return allPhrases().find((p) => p.id === phraseId) || null
}

// ⚠️ PHRASES AND GRAMMAR ARE PRO — 2026-09-28 (author: "lock phrases and grammar speak behind
// paywall"). A phrase is free only when its GROUP is free (the tones). Was: each phrase's own
// `tier`, so a free-tier phrase inside a phrase or grammar group stayed open.
export function phraseTier(phraseId) {
  const group = speakGroups.find((g) => g.phrases.some((p) => p.id === phraseId))
  return group && group.free ? 'free' : 'pro'
}

// A whole module (group) by id — for the module drill screen.
export function getSpeakGroup(groupId) {
  return speakGroups.find((g) => g.id === groupId) || null
}

// Neighbors in display order, for prev/next navigation on the practice screen.
export function adjacentPhrases(phraseId) {
  const list = allPhrases()
  const i = list.findIndex((p) => p.id === phraseId)
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  }
}

// The progress key stored in ProgressContext.completedSteps for a phrase.
// Phrase ids already carry the `speak-` namespace, so the key is the id
// itself — this wrapper exists so every consumer derives it the same way.
export function speakStepId(phraseId) {
  return phraseId
}
