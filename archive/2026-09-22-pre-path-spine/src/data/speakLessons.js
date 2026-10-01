// SPEAK LESSONS — the real, shipping lesson scripts.
//
// A lesson is a SCRIPT of TYPED steps, rendered by LessonScroll.jsx as a
// chat-style reveal: steps appear one at a time but STAY ON SCREEN, stacking
// downward. Adding a lesson = adding data here. No new screens.
//
// ── AUDIO STATUS (2026-09-12) ───────────────────────────────────────────────
//
//   greetings  ✅ 100% — every step plays a native speaker
//   farewells  ✅ 100%
//   politeness ✅ 100%
//
// Verify with: node scripts/check-lesson-audio.mjs
//
// ⚠️ THE CLIPS NOW COME FROM TWO PLACES, and the difference matters when you
// add a step:
//
//   1. The web app's reference tables — grammar/, vocabulary/, conversations/.
//      Recorded for a table of words, borrowed by these lessons. A clip here
//      says the word correctly but with the delivery of a reference recording,
//      and some are glossed for a different sense than the lesson wants (see
//      the note on `ntau` below).
//   2. assets/audio/lessons/ — recorded FOR these lessons (2026-09-11/12),
//      which is why the component words exist at all. A reference table has no
//      reason to hold "Tsis muaj teeb meem"; a lesson teaching it does.
//
// ⚠️ GROUP 2 IS .wav, NOT .mp3. They arrive as raw studio takes and there is no
// converter on the authoring machine, so generate-audio-map.js bundles both
// extensions. They are ~10x the size of the equivalent mp3 — converting them
// and re-running that script changes nothing but these paths, and is the
// cheapest bundle win available. See notes/2026-09-12-lesson-audio-wired.md.
//
// ⚠️ WHAT THIS MEANS: audio works OFFLINE. resolveAudioSrc() returns the local
// require()'d asset, and EXPO_PUBLIC_AUDIO_BASE_URL is only a fallback for
// paths that are NOT bundled. Do not "fix" this by adding a host.
//
// Hmong spellings, English glosses and tone tips below are taken VERBATIM from
// the web app's own data (src/data/speak.js, lessons/greetings-farewells.js).
// Nothing here was newly authored or guessed from a filename.
//
// SPEECH IS SEPARATE FROM VOCAB (decision 2026-08-20): this file imports nothing
// from src/data/vocabulary.js and never should.

// ── Step types ──────────────────────────────────────────────────────────────
//   { type: 'intro',    title, body: [...], emoji?, duration? }
//   { type: 'hear',     hmong, english, audio }   ← meet it
//   { type: 'say',      hmong, english, audio }   ← imitate it (Hmong VISIBLE)
//   { type: 'recall',   hmong, english, audio }   ← produce it (Hmong HIDDEN)
//   { type: 'listen',   hmong, english, audio }   ← what does it MEAN?
//   { type: 'dialogue', turns: [{ speaker, hmong, english, audio, record? }] }
//
//   ('word' is DISABLED — it duplicated the `say` card. See LessonSteps.jsx.)

// ── THE LESSON SHAPE ────────────────────────────────────────────────────────
//
// Per SET of related words (2 words → 1 phrase):
//
//   hear   word 1          meet it
//   say    word 1          imitate it, Hmong on screen
//   hear   word 2
//   say    word 2
//   ──────────────────────────────────────────────────────────────
//   recall word 1          "How do you say 'hello'?"  — Hmong HIDDEN
//   recall word 2
//   recall the phrase      the two words combined
//
// Then the next set, for the next sentence.
//
// WHY THIS ORDER: imitation (`say`) and production (`recall`) are different
// skills, and only the second is what speaking demands. Showing the Hmong the
// whole time teaches reading aloud. The recall block is where the lesson
// actually tests whether anything stuck — which is why it comes AFTER both
// words, not immediately after each one. A gap between meeting a word and being
// asked for it is what makes the retrieval real.
//
// TARGET: 2-3 sets per lesson, 12-18 steps, 5-10 minutes.

// ── Audio paths ─────────────────────────────────────────────────────────────
// Named so a step reads as language, not as a file path. Every one of these is
// verified present in src/lib/audioMap.js — a typo here is a silent no-op, not
// an error, so `scripts/check-lesson-audio.mjs` asserts them.
const A = {
  // grammar/conversations/greetings-and-farewells
  nyobZoo: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-nyob-zoo.mp3',
  // The SAME WORDS as "hello" — said by the person LEAVING, to those who stay.
  // A separate recording, hence -2.
  nyobZooStay: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-nyob-zoo-2.mp3',
  kojPuasNyobZoo: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-koj-puas-nyob-zoo.mp3',
  kuvNyobZoo: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-kuv-nyob-zoo.mp3',
  uaTsaug: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-ua-tsaug.mp3',
  sibNtsibDua: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-sib-ntsib-dua.mp3',
  musZoo: '/assets/audio/grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-mus-zoo.mp3',

  // grammar/pronouns — the building blocks the phrases decompose into
  kuv: '/assets/audio/grammar/pronouns/hmong-pronouns-kuv.mp3',
  koj: '/assets/audio/grammar/pronouns/hmong-pronouns-koj.mp3',

  // ⚠️ REUSED ACROSS SENSES. This clip is glossed 'many (objects)' in the web
  // app's adjectives set, not as the adverbial 'a lot' of "Ua tsaug ntau."
  // Same word, same pronunciation — which is all a speaking drill needs — but
  // if a native speaker ever flags the delivery as wrong for this context,
  // this is the line to cut.
  ntau: '/assets/audio/grammar/adjectives/hmong-common-adjectives-ntau.mp3',

  // ── lessons/ — takes recorded FOR these lessons (2026-09-12) ──────────────
  //
  // These are the first clips in the app that live under assets/audio/lessons/
  // rather than in a topic folder, and the reason is worth knowing: everything
  // above was recorded for the web app's reference tables and borrowed by these
  // lessons. These were recorded for the lesson itself, which is why the words
  // and the phrase they build are all present — a reference table has no reason
  // to hold "Tsis muaj teeb meem", but a lesson teaching it does.
  //
  // ⚠️ .wav, NOT .mp3 — and every other clip in the bundle is .mp3. They arrive
  // as raw studio takes and there is no converter on the authoring machine, so
  // generate-audio-map.js now bundles both extensions. They are ~10x the size of
  // an equivalent .mp3; converting them and re-running that script is the
  // cheapest bundle win available, and changes nothing but these paths.
  kojNyobZoo: '/assets/audio/lessons/greetings/koj-nyob-zoo.wav',
  zooSiab: '/assets/audio/lessons/greetings/zoo-siab.wav',
  ntsib: '/assets/audio/lessons/greetings/ntsib.wav',
  zooSiabNtsibKoj: '/assets/audio/lessons/greetings/zoo-siab-ntsib-koj.wav',

  // farewells
  saib: '/assets/audio/lessons/farewells/saib.wav',
  xyuas: '/assets/audio/lessons/farewells/xyuas.wav',
  saibXyuas: '/assets/audio/lessons/farewells/saib-xyuas.wav',
  pom: '/assets/audio/lessons/farewells/pom.wav',
  sai: '/assets/audio/lessons/farewells/sai.wav',
  pomKojSaiSaiNo: '/assets/audio/lessons/farewells/pom-koj-sai-sai-no.wav',

  // politeness
  uaTsaugNtau: '/assets/audio/lessons/politeness/ua-tsaug-ntau.wav',
  thov: '/assets/audio/lessons/politeness/thov.wav',
  txim: '/assets/audio/lessons/politeness/txim.wav',
  thovTxim: '/assets/audio/lessons/politeness/thov-txim.wav',
  tsis: '/assets/audio/lessons/politeness/tsis.wav',
  liCas: '/assets/audio/lessons/politeness/li-cas.wav',
  tsisUaLiCas: '/assets/audio/lessons/politeness/tsis-ua-li-cas.wav',
  txausSiab: '/assets/audio/lessons/politeness/txaus-siab.wav',
  heev: '/assets/audio/lessons/politeness/heev.wav',
  kuvTxausSiabHeev: '/assets/audio/lessons/politeness/kuv-txaus-siab-heev.wav',
  muaj: '/assets/audio/lessons/politeness/muaj.wav',
  teebMeem: '/assets/audio/lessons/politeness/teeb-meem.wav',
  tsisMuajTeebMeem: '/assets/audio/lessons/politeness/tsis-muaj-teeb-meem.wav',

  // price-how-much — recorded 2026-09-12
  kim: '/assets/audio/lessons/price-how-much/kim.wav',
  npaum: '/assets/audio/lessons/price-how-much/npaum.wav',
  kimNpaumLiCas: '/assets/audio/lessons/price-how-much/kim-npaum-li-cas.wav',
  pesTsawg: '/assets/audio/lessons/price-how-much/pes-tsawg.wav',
  yogPesTsawg: '/assets/audio/lessons/price-how-much/yog-pes-tsawg.wav',
  nqi: '/assets/audio/lessons/price-how-much/nqi.wav',
  nqiPesTsawg: '/assets/audio/lessons/price-how-much/nqi-pes-tsawg.wav',
  tusNqiYogLiCas: '/assets/audio/lessons/price-how-much/tus-nqi-yog-li-cas.wav',
  qhovNo: '/assets/audio/lessons/price-how-much/qhov-no.wav',
  qhovNoYogPesTsawg: '/assets/audio/lessons/price-how-much/qhov-no-yog-pes-tsawg.wav',

  // price-too-much — recorded 2026-09-12
  nyiaj: '/assets/audio/lessons/price-too-much/nyiaj.wav',
  tsawg: '/assets/audio/lessons/price-too-much/tsawg.wav',
  // ⚠️ THE FILE WAS NAMED "KuvMuajTsawgXwb" — no `nyiaj`. The lesson teaches
  // "Kuv muaj nyiaj tsawg xwb." (I only have a little MONEY). Either the take
  // drops the word or the filename is shorthand, and only a listener can say.
  // Wired to the lesson's sentence; if the clip really omits `nyiaj`, the
  // sentence is what should change, not this path.
  kuvMuajNyiajTsawgXwb: '/assets/audio/lessons/price-too-much/kuv-muaj-nyiaj-tsawg-xwb.wav',
  puas: '/assets/audio/lessons/price-too-much/puas.wav',
  luvNqi: '/assets/audio/lessons/price-too-much/luv-nqi.wav',
  kojPuasMuajLuvNqi: '/assets/audio/lessons/price-too-much/koj-puas-muaj-luv-nqi.wav',
  pheejYig: '/assets/audio/lessons/price-too-much/pheej-yig.wav',
  kojPuasUaPheejYigDuaTau: '/assets/audio/lessons/price-too-much/koj-puas-ua-pheej-yig-dua-tau.wav',
  qhovNoKimHeev: '/assets/audio/lessons/price-too-much/qhov-no-kim-heev.wav',
  txoNqi: '/assets/audio/lessons/price-too-much/txo-nqi.wav',
  yogKojTxoNqiKuvYuav: '/assets/audio/lessons/price-too-much/yog-koj-txo-nqi-kuv-yuav.wav',

  // price-numbers — recorded 2026-09-12
  duasLas: '/assets/audio/lessons/price-numbers/duas-las.wav',
  xees: '/assets/audio/lessons/price-numbers/xees.wav',
  muag: '/assets/audio/lessons/price-numbers/muag.wav',
  txais: '/assets/audio/lessons/price-numbers/txais.wav',
  tshev: '/assets/audio/lessons/price-numbers/tshev.wav',
  // ⚠️ THE FILENAME SAID "Duaslaux", the word file says "Duaslas", and the
  // lesson teaches "duas las". Three spellings of the same thing inside one
  // recording session. Wired to the lesson's wording; a listener has to settle
  // which is right, and the whole `duas las / tsib caum / xees` set is already
  // flagged as unverified in this lesson's header.
  kuvMuajIbPuasDuasLasThiabTsibCaumXees: '/assets/audio/lessons/price-numbers/kuv-muaj-ib-puas-duas-las-thiab-tsib-caum-xees.wav',
  kuvMuajNyiajNtauDua: '/assets/audio/lessons/price-numbers/kuv-muaj-nyiaj-ntau-dua.wav',
  kuvMuagYamNoRauTsibDuasLas: '/assets/audio/lessons/price-numbers/kuv-muag-yam-no-rau-tsib-duas-las.wav',
  kuvTsisMuajNyiaj: '/assets/audio/lessons/price-numbers/kuv-tsis-muaj-nyiaj.wav',
  kojPuasTxaisTshevLosYogNyiajNawb: '/assets/audio/lessons/price-numbers/koj-puas-txais-tshev-los-yog-nyiaj-nawb.wav',
}

// ════════════════════════════════════════════════════════════════════════════
// GREETINGS — 100% real audio.
//
// REWRITTEN 2026-08-29. The previous script taught a name exchange
// ("Koj lub npe hu li cas?" / "Kuv lub npe hu ua Ntxawg") which had NO
// recordings for any step. It is preserved commented-out at the bottom of this
// file — restore it once those clips exist.
//
// This version teaches the greeting exchange the recordings actually cover, in
// the same proven shape. Every step plays a native speaker.
//
// The morphology genuinely decomposes, which is why the build steps work here
// and are not a gimmick:
//
//     nyob zoo              "live well"        → the greeting
//     koj  + puas nyob zoo  "are YOU well?"    → the question
//     kuv  +      nyob zoo  "I am well"        → the answer
//
// Learning `koj` and `kuv` first means the two sentences are assembled by the
// learner rather than memorised whole.
// ════════════════════════════════════════════════════════════════════════════
const greetings = {
  id: 'speak-lesson-greetings',
  title: 'Greetings',
  blurb: 'Say hello, ask how someone is, and answer.',
  emoji: '👋',
  free: true, // the first lesson is the hook — never gated
  steps: [
    // ── Welcome (first lesson only) ─────────────────────────────────────────
    {
      id: 'speak-lesson-greetings-welcome',
      type: 'intro',
      emoji: '🌸',
      title: 'Welcome to Kawm Hmoob',
      body: [
        'This is your first speaking lesson.',
        'You will hear a native speaker, say it yourself, then be asked for it from memory.',
        'Nothing to pass, nothing to fail.',
      ],
      duration: '5–10 minutes',
    },
    {
      id: 'speak-lesson-greetings-topic',
      type: 'intro',
      emoji: '👋',
      title: 'Saying hello',
      body: [
        'Three phrases: greet someone, ask how they are, and answer.',
        'You will meet the small words first, then build the sentences from them.',
      ],
    },

    // ══ SET 1 — the greeting ═══════════════════════════════════════════════
    {
      id: 'speak-lesson-greetings-hear-1',
      type: 'hear',
      hmong: 'Nyob zoo',
      english: 'Hello',
      audio: A.nyobZoo,
    },
    {
      id: 'speak-lesson-greetings-say-1',
      type: 'say',
      hmong: 'Nyob zoo',
      english: 'Hello',
      audio: A.nyobZoo,
    },

    // ══ SET 2 — asking after someone ═══════════════════════════════════════
    // `koj` first, so the question is assembled rather than swallowed whole.
    {
      id: 'speak-lesson-greetings-hear-2',
      type: 'hear',
      hmong: 'Koj',
      english: 'you / your',
      audio: A.koj,
    },
    {
      id: 'speak-lesson-greetings-say-2',
      type: 'say',
      hmong: 'Koj',
      english: 'you / your',
      audio: A.koj,
    },
    // ⚠️ ADDED 2026-09-12, and it sits HERE on purpose: it is `koj` plus the
    // greeting from SET 1, and adding `puas` to it is what makes the question
    // in the next pair. Teaching the statement before the question means the
    // learner assembles three phrases out of two words instead of memorising
    // each one whole.
    //
    // ⚠️ VERIFY THE GLOSS. The take arrived named "KojNojZoo.wav" — noj is "to
    // eat" — and was confirmed as a typo for nyob, but nobody fluent has
    // listened to it since it was recorded.
    {
      id: 'speak-lesson-greetings-hear-koj-nyob-zoo',
      type: 'hear',
      hmong: 'Koj nyob zoo',
      english: 'You are well / hello to you',
      audio: A.kojNyobZoo,
    },
    {
      id: 'speak-lesson-greetings-say-koj-nyob-zoo',
      type: 'say',
      hmong: 'Koj nyob zoo',
      english: 'You are well / hello to you',
      audio: A.kojNyobZoo,
    },
    {
      id: 'speak-lesson-greetings-hear-3',
      type: 'hear',
      hmong: 'Koj puas nyob zoo?',
      english: 'How are you?',
      audio: A.kojPuasNyobZoo,
    },
    {
      id: 'speak-lesson-greetings-say-3',
      type: 'say',
      hmong: 'Koj puas nyob zoo?',
      english: 'How are you?',
      audio: A.kojPuasNyobZoo,
    },


    // ══ SET 2b — nice to meet you ══════════════════════════════════════════
    // `koj` is already taught in SET 2 above, so the only new pieces are
    // "zoo siab" and "ntsib" — the phrase assembles from what is already known.
    //
    // ✅ RECORDED 2026-09-12. This set was the last silent block in the lesson
    // — `zoo siab`, `ntsib` and the phrase they build — and with it Greetings
    // reaches 100% native audio like the other two.
    //
    // "Zoo siab" is literally "good liver". The liver is where Hmong puts
    // feeling, the way English uses the heart, and this is the same pattern as
    // "txaus siab" in Thanks & Sorry — worth noticing the second time it shows
    // up rather than learning each phrase as an unrelated idiom. The app has a
    // whole `personality-siab` vocabulary category built on it.
    {
      id: 'speak-lesson-greetings-meet-hear-1',
      type: 'hear',
      hmong: 'Zoo siab',
      english: 'glad, happy',
      audio: A.zooSiab,
    },
    {
      id: 'speak-lesson-greetings-meet-say-1',
      type: 'say',
      hmong: 'Zoo siab',
      english: 'glad, happy',
      audio: A.zooSiab,
    },
    {
      id: 'speak-lesson-greetings-meet-hear-2',
      type: 'hear',
      hmong: 'ntsib',
      english: 'to meet',
      audio: A.ntsib,
    },
    {
      id: 'speak-lesson-greetings-meet-say-2',
      type: 'say',
      hmong: 'ntsib',
      english: 'to meet',
      audio: A.ntsib,
    },
    // The whole phrase, once both halves have been said alone.
    {
      id: 'speak-lesson-greetings-meet-hear-3',
      type: 'hear',
      hmong: 'Zoo siab ntsib koj',
      english: 'Nice to meet you',
      audio: A.zooSiabNtsibKoj,
    },
    {
      id: 'speak-lesson-greetings-meet-say-3',
      type: 'say',
      hmong: 'Zoo siab ntsib koj',
      english: 'Nice to meet you',
      audio: A.zooSiabNtsibKoj,
    },

    // ── Build: one piece at a time ──────────────────────────────────────────
    {
      id: 'speak-lesson-greetings-build-1',
      type: 'recall',
      hmong: 'Koj',
      english: 'you / your',
      audio: A.koj,
    },
    {
      id: 'speak-lesson-greetings-build-2',
      type: 'recall',
      hmong: 'Koj puas nyob zoo?',
      english: 'How are you?',
      audio: A.kojPuasNyobZoo,
    },
    // DOUBLE CHECK — 'Nyob zoo' returns as production, not imitation.
    {
      id: 'speak-lesson-greetings-recall-1-again',
      type: 'recall',
      hmong: 'Nyob zoo',
      english: 'Hello',
      audio: A.nyobZoo,
    },

    // ── COMPREHENSION — hear it, know what it means ─────────────────────────
    {
      id: 'speak-lesson-greetings-listen-1',
      type: 'listen',
      hmong: 'Koj puas nyob zoo?',
      english: 'How are you?',
      audio: A.kojPuasNyobZoo,
    },

    // ══ SET 3 — answering ══════════════════════════════════════════════════
    {
      id: 'speak-lesson-greetings-hear-4',
      type: 'hear',
      hmong: 'Kuv',
      english: 'I / me / my',
      audio: A.kuv,
    },
    {
      id: 'speak-lesson-greetings-say-4',
      type: 'say',
      hmong: 'Kuv',
      english: 'I / me / my',
      audio: A.kuv,
    },
    {
      id: 'speak-lesson-greetings-hear-5',
      type: 'hear',
      hmong: 'Kuv nyob zoo',
      english: 'I am well',
      audio: A.kuvNyobZoo,
    },
    {
      id: 'speak-lesson-greetings-say-5',
      type: 'say',
      hmong: 'Kuv nyob zoo',
      english: 'I am well',
      audio: A.kuvNyobZoo,
    },

    // ── Build ───────────────────────────────────────────────────────────────
    {
      id: 'speak-lesson-greetings-build-3',
      type: 'recall',
      hmong: 'Kuv',
      english: 'I / me / my',
      audio: A.kuv,
    },
    {
      id: 'speak-lesson-greetings-build-4',
      type: 'recall',
      hmong: 'Kuv nyob zoo',
      english: 'I am well',
      audio: A.kuvNyobZoo,
    },


    // ── CLOSING DIALOGUE — COMMENTED OUT 2026-08-29 ─────────────────────
    // Removed at request: every lesson ended with the same replay of lines
    // already produced in the recall block, so it read as padding rather
    // than a payoff.
    //
    // The `dialogue` step TYPE is untouched — DialogueStep.jsx still renders
    // it and LessonSteps still dispatches it. Only these three instances are
    // switched off, so uncommenting a block is all it takes to bring one back.
    // // ── Put it all together ─────────────────────────────────────────────────
    // // Every turn is a phrase with its OWN recording. Turns are kept atomic for
    // // exactly that reason — 'Nyob zoo! Koj puas nyob zoo?' as one turn would
    // // have no clip and would silently play nothing.
    // {
      // id: 'speak-lesson-greetings-dialogue',
      // type: 'dialogue',
      // turns: [
        // {
          // speaker: 'A',
          // hmong: 'Nyob zoo',
          // english: 'Hello',
          // audio: A.nyobZoo,
        // },
        // {
          // speaker: 'B',
          // hmong: 'Nyob zoo',
          // english: 'Hello',
          // audio: A.nyobZoo,
          // record: true,
        // },
        // {
          // speaker: 'A',
          // hmong: 'Koj puas nyob zoo?',
          // english: 'How are you?',
          // audio: A.kojPuasNyobZoo,
        // },
        // {
          // speaker: 'B',
          // hmong: 'Kuv nyob zoo',
          // english: 'I am well',
          // audio: A.kuvNyobZoo,
          // record: true,
        // },
      // ],
    // },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// FAREWELLS — 100% real audio. NEW 2026-08-29.
//
// Exists because the recordings cover a genuine teaching point that no other
// lesson had room for: Hmong picks the farewell by WHO IS LEAVING.
//
//     Mus zoo    "go well"    → said TO the person leaving
//     Nyob zoo   "stay well"  → said BY the person leaving, to those who stay
//
// The second is the same two words as "hello", which is exactly the kind of
// thing a learner will get wrong forever unless it is taught deliberately. The
// dialogue at the end demonstrates the pair in one exchange.
// ════════════════════════════════════════════════════════════════════════════
const farewells = {
  id: 'speak-lesson-farewells',
  title: 'Farewells',
  blurb: 'Say goodbye — and pick the right one.',
  emoji: '🌾',
  steps: [
    {
      id: 'speak-lesson-farewells-topic',
      type: 'intro',
      emoji: '🌾',
      title: 'Saying goodbye',
      body: [
        'Hmong chooses the farewell based on who is leaving.',
        'You will learn both sides, then use them in one exchange.',
      ],
      duration: '5 minutes',
    },

    // ══ SET 1 — the neutral farewell ═══════════════════════════════════════
    {
      id: 'speak-lesson-farewells-hear-1',
      type: 'hear',
      hmong: 'Sib ntsib dua',
      english: 'See you again',
      audio: A.sibNtsibDua,
    },
    {
      id: 'speak-lesson-farewells-say-1',
      type: 'say',
      hmong: 'Sib ntsib dua',
      english: 'See you again',
      audio: A.sibNtsibDua,
    },

    // ══ SET 2 — the pair that depends on who leaves ════════════════════════
    {
      id: 'speak-lesson-farewells-hear-2',
      type: 'hear',
      hmong: 'Mus zoo',
      english: 'Go well (to the one leaving)',
      audio: A.musZoo,
    },
    {
      id: 'speak-lesson-farewells-say-2',
      type: 'say',
      hmong: 'Mus zoo',
      english: 'Go well (to the one leaving)',
      audio: A.musZoo,
    },
    {
      id: 'speak-lesson-farewells-hear-3',
      type: 'hear',
      hmong: 'Nyob zoo',
      english: 'Stay well (said by the one leaving)',
      audio: A.nyobZooStay,
    },
    {
      id: 'speak-lesson-farewells-say-3',
      type: 'say',
      hmong: 'Nyob zoo',
      english: 'Stay well (said by the one leaving)',
      audio: A.nyobZooStay,
    },

    // "Take care" — added to whichever farewell you just used, not instead of
    // one.
    //
    // ⚠️ NOW TAUGHT IN PIECES — 2026-09-12. It was taught WHOLE, under this
    // note: "it is a set phrase, and 'xyuas' is not something anyone says on
    // its own." That is still true of the language, and it is why the phrase
    // step follows immediately rather than being left for the recall block.
    // What changed is that both halves were recorded deliberately for this
    // lesson, and hearing them alone once is the difference between four
    // syllables of noise and two words you can hear inside the phrase.
    //
    // ⚠️ THESE ARE NOT action-verbs/hmong-action-verbs-saib.mp3. That clip is
    // the verb "to look" standing alone, recorded for a different set, and
    // using it here would play the right word with the wrong delivery.
    {
      id: 'speak-lesson-farewells-hear-saib',
      type: 'hear',
      hmong: 'Saib',
      english: 'to look / to watch',
      audio: A.saib,
    },
    {
      id: 'speak-lesson-farewells-say-saib',
      type: 'say',
      hmong: 'Saib',
      english: 'to look / to watch',
      audio: A.saib,
    },
    {
      id: 'speak-lesson-farewells-hear-xyuas',
      type: 'hear',
      hmong: 'Xyuas',
      english: 'to check on / to look after',
      audio: A.xyuas,
    },
    {
      id: 'speak-lesson-farewells-say-xyuas',
      type: 'say',
      hmong: 'Xyuas',
      english: 'to check on / to look after',
      audio: A.xyuas,
    },
    // The two together — the phrase they were pulled out of.
    {
      id: 'speak-lesson-farewells-hear-4',
      type: 'hear',
      hmong: 'Saib xyuas',
      english: 'Take care',
      audio: A.saibXyuas,
    },
    {
      id: 'speak-lesson-farewells-say-4',
      type: 'say',
      hmong: 'Saib xyuas',
      english: 'Take care',
      audio: A.saibXyuas,
    },

    // ── Recall block ────────────────────────────────────────────────────────
    {
      id: 'speak-lesson-farewells-recall-1',
      type: 'recall',
      hmong: 'Sib ntsib dua',
      english: 'See you again',
      audio: A.sibNtsibDua,
    },
    {
      id: 'speak-lesson-farewells-recall-2',
      type: 'recall',
      hmong: 'Mus zoo',
      english: 'Go well (to the one leaving)',
      audio: A.musZoo,
    },
    {
      id: 'speak-lesson-farewells-recall-3',
      type: 'recall',
      hmong: 'Nyob zoo',
      english: 'Stay well (said by the one leaving)',
      audio: A.nyobZooStay,
    },
    {
      id: 'speak-lesson-farewells-recall-4',
      type: 'recall',
      hmong: 'Saib xyuas',
      english: 'Take care',
      audio: A.saibXyuas,
    },

    // ── COMPREHENSION ───────────────────────────────────────────────────────
    {
      id: 'speak-lesson-farewells-listen-1',
      type: 'listen',
      hmong: 'Mus zoo',
      english: 'Go well (to the one leaving)',
      audio: A.musZoo,
    },

    // DOUBLE CHECK
    {
      id: 'speak-lesson-farewells-recall-1-again',
      type: 'recall',
      hmong: 'Sib ntsib dua',
      english: 'See you again',
      audio: A.sibNtsibDua,
    },

    // ══ SET 3 — see you soon ═══════════════════════════════════════════════
    //
    // ⚠️ ADDED 2026-09-12 — AND THIS IS THE SPLIT POINT.
    //
    // This lesson is now past the 12-18 step target at the top of the file.
    // Everything from this comment to the end of the recall block below is one
    // self-contained set: nothing above it depends on anything in it, and it
    // introduces only `pom` and `sai`. To split, move these steps into a new
    // lesson object ("Farewells 2") and register it in `lessons` — no step
    // here needs rewriting, because `koj` comes from the Greetings lesson
    // rather than from anything above.
    //
    // ⚠️ "sai sai" is the doubled form. Repeating the adverb intensifies it —
    // "soon" becomes "very soon" — which is a pattern worth meeting once, and
    // is why `sai` is taught alone first.
    {
      id: 'speak-lesson-farewells-hear-pom',
      type: 'hear',
      hmong: 'Pom',
      english: 'to see',
      audio: A.pom,
    },
    {
      id: 'speak-lesson-farewells-say-pom',
      type: 'say',
      hmong: 'Pom',
      english: 'to see',
      audio: A.pom,
    },
    {
      id: 'speak-lesson-farewells-hear-sai',
      type: 'hear',
      hmong: 'Sai',
      english: 'fast / soon',
      audio: A.sai,
    },
    {
      id: 'speak-lesson-farewells-say-sai',
      type: 'say',
      hmong: 'Sai',
      english: 'fast / soon',
      audio: A.sai,
    },
    {
      id: 'speak-lesson-farewells-hear-pom-koj-sai-sai-no',
      type: 'hear',
      hmong: 'Pom koj sai sai no',
      english: 'See you soon',
      audio: A.pomKojSaiSaiNo,
    },
    {
      id: 'speak-lesson-farewells-say-pom-koj-sai-sai-no',
      type: 'say',
      hmong: 'Pom koj sai sai no',
      english: 'See you soon',
      audio: A.pomKojSaiSaiNo,
    },

    // ── Recall block for SET 3 ──────────────────────────────────────────────
    {
      id: 'speak-lesson-farewells-recall-pom',
      type: 'recall',
      hmong: 'Pom',
      english: 'to see',
      audio: A.pom,
    },
    {
      id: 'speak-lesson-farewells-recall-sai',
      type: 'recall',
      hmong: 'Sai',
      english: 'fast / soon',
      audio: A.sai,
    },
    {
      id: 'speak-lesson-farewells-recall-pom-koj-sai-sai-no',
      type: 'recall',
      hmong: 'Pom koj sai sai no',
      english: 'See you soon',
      audio: A.pomKojSaiSaiNo,
    },

    // ── CLOSING DIALOGUE — COMMENTED OUT 2026-08-29 ─────────────────────
    // Removed at request: every lesson ended with the same replay of lines
    // already produced in the recall block, so it read as padding rather
    // than a payoff.
    //
    // The `dialogue` step TYPE is untouched — DialogueStep.jsx still renders
    // it and LessonSteps still dispatches it. Only these three instances are
    // switched off, so uncommenting a block is all it takes to bring one back.
    // // ── Put it all together ─────────────────────────────────────────────────
    // // B is the one leaving, so B says 'Nyob zoo' (stay well) and A says
    // // 'Mus zoo' (go well). The whole lesson is in these four turns.
    // {
      // id: 'speak-lesson-farewells-dialogue',
      // type: 'dialogue',
      // turns: [
        // {
          // speaker: 'A',
          // hmong: 'Sib ntsib dua',
          // english: 'See you again',
          // audio: A.sibNtsibDua,
        // },
        // {
          // speaker: 'B',
          // hmong: 'Sib ntsib dua',
          // english: 'See you again',
          // audio: A.sibNtsibDua,
          // record: true,
        // },
        // {
          // speaker: 'A',
          // hmong: 'Mus zoo',
          // english: 'Go well — A stays, B is leaving',
          // audio: A.musZoo,
        // },
        // {
          // speaker: 'B',
          // hmong: 'Nyob zoo',
          // english: 'Stay well — B is the one leaving',
          // audio: A.nyobZooStay,
          // record: true,
        // },
      // ],
    // },
  ],
}

const politeness = {
  id: 'speak-lesson-politeness',
  // ⚠️ PRO, INSIDE A FREE CATEGORY — 2026-09-12. Greetings and Farewells are the
  // hook; this is the first thing you pay for, so the free tier ends on a
  // cliffhanger rather than at a category boundary.
  //
  // ⚠️ `pro` CAN ONLY EVER RESTRICT, NEVER GRANT. The derivation below reads
  // `cat.free && !lesson.pro`, so this flag cannot accidentally unlock a lesson
  // in a paid category — which is exactly the "a lesson silently disagrees with
  // its category" failure the comment on speakLessons warns about. One
  // direction is safe; the other is how content leaks out from behind a paywall.
  pro: true,
  title: 'Thanks & Sorry',
  blurb: 'Thank someone, apologise, and answer politely.',
  emoji: '🙏',
  steps: [
    {
      id: 'speak-lesson-politeness-topic',
      type: 'intro',
      emoji: '🙏',
      title: 'Thanks and sorry',
      body: [
        'Four short phrases you will use every day.',
        'All two or three syllables — good tone practice.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — thanks ═════════════════════════════════════════════════════
    {
      id: 'speak-lesson-politeness-hear-1',
      type: 'hear',
      hmong: 'Ua tsaug',
      english: 'thank you',
      audio: A.uaTsaug,
    },
    {
      id: 'speak-lesson-politeness-say-1',
      type: 'say',
      hmong: 'Ua tsaug',
      english: 'thank you',
      audio: A.uaTsaug,
    },
    {
      id: 'speak-lesson-politeness-hear-2',
      type: 'hear',
      hmong: 'ntau',
      english: 'a lot / very much',
      audio: A.ntau,
    },
    {
      id: 'speak-lesson-politeness-say-2',
      type: 'say',
      hmong: 'ntau',
      english: 'a lot / very much',
      audio: A.ntau,
    },

    {
      id: 'speak-lesson-politeness-recall-1',
      type: 'recall',
      hmong: 'Ua tsaug',
      english: 'thank you',
      audio: A.uaTsaug,
    },
    {
      id: 'speak-lesson-politeness-recall-2',
      type: 'recall',
      hmong: 'ntau',
      english: 'a lot / very much',
      audio: A.ntau,
    },
    {
      id: 'speak-lesson-politeness-recall-phrase-1',
      type: 'recall',
      hmong: 'Ua tsaug ntau.',
      english: 'Thank you very much.',
      audio: A.uaTsaugNtau,
    },

    // ══ SET 2 — sorry + you're welcome ═════════════════════════════════════
    //
    // ⚠️ BOTH PHRASES NOW DECOMPOSE — 2026-09-12. They were taught whole
    // because nothing was recorded below phrase level; the words were recorded
    // for this lesson on 2026-09-11, so each phrase is now met as its pieces
    // first. "Thov" on its own is also the word for "please", which is worth a
    // step of its own rather than being buried inside an apology.
    {
      id: 'speak-lesson-politeness-hear-thov',
      type: 'hear',
      hmong: 'Thov',
      english: 'to ask / please',
      audio: A.thov,
    },
    {
      id: 'speak-lesson-politeness-say-thov',
      type: 'say',
      hmong: 'Thov',
      english: 'to ask / please',
      audio: A.thov,
    },
    {
      id: 'speak-lesson-politeness-hear-txim',
      type: 'hear',
      hmong: 'Txim',
      english: 'fault / punishment',
      audio: A.txim,
    },
    {
      id: 'speak-lesson-politeness-say-txim',
      type: 'say',
      hmong: 'Txim',
      english: 'fault / punishment',
      audio: A.txim,
    },
    // The two together: literally "I ask for the fault" — asking to be held at
    // fault is how Hmong apologises.
    {
      id: 'speak-lesson-politeness-hear-3',
      type: 'hear',
      hmong: 'Thov txim',
      english: 'sorry / excuse me',
      audio: A.thovTxim,
    },
    {
      id: 'speak-lesson-politeness-say-3',
      type: 'say',
      hmong: 'Thov txim',
      english: 'sorry / excuse me',
      audio: A.thovTxim,
    },
    // ⚠️ `ua` IS NOT TAUGHT HERE. It is the general verb "to do / to make" and
    // it already has a clip (grammar/action-verbs), but a fourth word step puts
    // six steps between the set opening and the phrase arriving. The two words
    // carrying the meaning are `tsis` (not) and `li cas` (how / in what way) —
    // literally "not done in any way", which is the whole idiom.
    {
      id: 'speak-lesson-politeness-hear-tsis',
      type: 'hear',
      hmong: 'Tsis',
      english: 'not (the general negator)',
      audio: A.tsis,
    },
    {
      id: 'speak-lesson-politeness-say-tsis',
      type: 'say',
      hmong: 'Tsis',
      english: 'not (the general negator)',
      audio: A.tsis,
    },
    {
      id: 'speak-lesson-politeness-hear-li-cas',
      type: 'hear',
      hmong: 'Li cas',
      english: 'how / in what way',
      audio: A.liCas,
    },
    {
      id: 'speak-lesson-politeness-say-li-cas',
      type: 'say',
      hmong: 'Li cas',
      english: 'how / in what way',
      audio: A.liCas,
    },
    {
      id: 'speak-lesson-politeness-hear-4',
      type: 'hear',
      hmong: 'Tsis ua li cas',
      english: "it's nothing / you're welcome",
      audio: A.tsisUaLiCas,
    },
    {
      id: 'speak-lesson-politeness-say-4',
      type: 'say',
      hmong: 'Tsis ua li cas',
      english: "it's nothing / you're welcome",
      audio: A.tsisUaLiCas,
    },

    {
      id: 'speak-lesson-politeness-recall-3',
      type: 'recall',
      hmong: 'Thov txim',
      english: 'sorry / excuse me',
      audio: A.thovTxim,
    },
    {
      id: 'speak-lesson-politeness-recall-4',
      type: 'recall',
      hmong: 'Tsis ua li cas',
      english: "it's nothing / you're welcome",
      audio: A.tsisUaLiCas,
    },
    // COMPREHENSION — hear it, know what it means
    {
      id: 'speak-lesson-politeness-listen-1',
      type: 'listen',
      hmong: 'Tsis ua li cas',
      english: "it's nothing / you're welcome",
      audio: A.tsisUaLiCas,
    },

    // Recall reaching back to SET 1 — the double-check, now as production
    // rather than imitation.
    {
      id: 'speak-lesson-politeness-recall-phrase-2',
      type: 'recall',
      hmong: 'Ua tsaug ntau.',
      english: 'Thank you very much.',
      audio: A.uaTsaugNtau,
    },

    // ══ SET 3 — saying you are pleased ═════════════════════════════════════
    // Built the same way as SET 1: teach the two pieces, recall them, then
    // produce the whole sentence. `kuv` is not taught here — it comes from the
    // Greetings lesson (SET 3), which is why the phrase only introduces two
    // new pieces rather than three.
    //
    // "Txaus siab" is another SIAB expression, like "zoo siab" in Greetings:
    // literally "enough liver", idiomatically content or satisfied. Worth
    // knowing the app has a whole `personality-siab` vocabulary category built
    // on this pattern.
    //
    // ⚠️ RECORDED 2026-09-12 — AND THE FIRST TAKES WERE OF THE WRONG WORD.
    // They said "txuas siab" (txuas = to connect), not "txaus siab". The two
    // differ by one vowel and mean unrelated things, which is exactly the kind
    // of error that ships: every structural check passes, the clip plays, and
    // only someone who speaks Hmong hears it.
    //
    // The correct takes are the ones wired below. The mis-takes were NOT
    // bundled — they are still in Hmong-Language-Dataset/Lessons/Apologies as
    // "Txuas Siab.wav" and "KuvTxausSiabHeev.wav"'s predecessor
    // "KuvTxuasSiabHeev.wav". The word `txuas` is real and now has a
    // dictionary entry (src/data/vocabulary.js, verbs-connect) carrying the
    // usable half of that session.
    {
      id: 'speak-lesson-politeness-hear-5',
      type: 'hear',
      hmong: 'txaus siab',
      english: 'pleased / content',
      audio: A.txausSiab,
    },
    {
      id: 'speak-lesson-politeness-say-5',
      type: 'say',
      hmong: 'txaus siab',
      english: 'pleased / content',
      audio: A.txausSiab,
    },
    {
      id: 'speak-lesson-politeness-hear-6',
      type: 'hear',
      hmong: 'heev',
      english: 'very',
      audio: A.heev,
    },
    {
      id: 'speak-lesson-politeness-say-6',
      type: 'say',
      hmong: 'heev',
      english: 'very',
      audio: A.heev,
    },

    {
      id: 'speak-lesson-politeness-recall-5',
      type: 'recall',
      hmong: 'txaus siab',
      english: 'pleased / content',
      audio: A.txausSiab,
    },
    {
      id: 'speak-lesson-politeness-recall-6',
      type: 'recall',
      hmong: 'heev',
      english: 'very',
      audio: A.heev,
    },
    // The whole sentence, produced from memory — the payoff for the set.
    {
      id: 'speak-lesson-politeness-recall-phrase-3',
      type: 'recall',
      hmong: 'Kuv txaus siab heev.',
      english: 'I am very pleased.',
      audio: A.kuvTxausSiabHeev,
    },

    // ══ SET 4 — no problem ═════════════════════════════════════════════════
    //
    // ⚠️ ADDED 2026-09-12 — AND THIS IS THE SPLIT POINT.
    //
    // This lesson is well past the 12-18 step target stated at the top of the
    // file. Everything from this comment to the end of this lesson's steps is
    // one self-contained set. To split it out, move these steps into a new
    // lesson ("Thanks & Sorry 2") and register it in `lessons`. The only thing
    // it depends on is `tsis`, taught in SET 2 — repeat that one pair in the
    // new lesson and nothing else needs touching.
    //
    // "Tsis muaj teeb meem" is the fuller answer to thanks or an apology than
    // "Tsis ua li cas": literally "there is no problem", built from `muaj`
    // (to have / there is) negated by the `tsis` already learned.
    {
      id: 'speak-lesson-politeness-hear-muaj',
      type: 'hear',
      hmong: 'Muaj',
      english: 'to have / there is',
      audio: A.muaj,
    },
    {
      id: 'speak-lesson-politeness-say-muaj',
      type: 'say',
      hmong: 'Muaj',
      english: 'to have / there is',
      audio: A.muaj,
    },
    {
      id: 'speak-lesson-politeness-hear-teeb-meem',
      type: 'hear',
      hmong: 'Teeb meem',
      english: 'problem / trouble',
      audio: A.teebMeem,
    },
    {
      id: 'speak-lesson-politeness-say-teeb-meem',
      type: 'say',
      hmong: 'Teeb meem',
      english: 'problem / trouble',
      audio: A.teebMeem,
    },
    {
      id: 'speak-lesson-politeness-hear-tsis-muaj-teeb-meem',
      type: 'hear',
      hmong: 'Tsis muaj teeb meem',
      english: 'No problem',
      audio: A.tsisMuajTeebMeem,
    },
    {
      id: 'speak-lesson-politeness-say-tsis-muaj-teeb-meem',
      type: 'say',
      hmong: 'Tsis muaj teeb meem',
      english: 'No problem',
      audio: A.tsisMuajTeebMeem,
    },

    // ── Recall block for SET 4 ──────────────────────────────────────────────
    {
      id: 'speak-lesson-politeness-recall-muaj',
      type: 'recall',
      hmong: 'Muaj',
      english: 'to have / there is',
      audio: A.muaj,
    },
    {
      id: 'speak-lesson-politeness-recall-teeb-meem',
      type: 'recall',
      hmong: 'Teeb meem',
      english: 'problem / trouble',
      audio: A.teebMeem,
    },
    {
      id: 'speak-lesson-politeness-recall-tsis-muaj-teeb-meem',
      type: 'recall',
      hmong: 'Tsis muaj teeb meem',
      english: 'No problem',
      audio: A.tsisMuajTeebMeem,
    },


    // ── CLOSING DIALOGUE — COMMENTED OUT 2026-08-29 ─────────────────────
    // Removed at request: every lesson ended with the same replay of lines
    // already produced in the recall block, so it read as padding rather
    // than a payoff.
    //
    // The `dialogue` step TYPE is untouched — DialogueStep.jsx still renders
    // it and LessonSteps still dispatches it. Only these three instances are
    // switched off, so uncommenting a block is all it takes to bring one back.
    // {
      // id: 'speak-lesson-politeness-dialogue',
      // type: 'dialogue',
      // turns: [
        // {
          // speaker: 'A',
          // hmong: 'Nov yog koj phau ntawv.',
          // english: 'Here is your book.',
          // audio: '',
        // },
        // {
          // speaker: 'B',
          // hmong: 'Ua tsaug ntau!',
          // english: 'Thank you very much!',
          // audio: '',
          // record: true,
        // },
        // {
          // speaker: 'A',
          // hmong: 'Tsis ua li cas.',
          // english: "It's nothing.",
          // audio: '',
        // },
      // ],
    // },
  ],
}


// ════════════════════════════════════════════════════════════════════════════
// ARCHIVED 2026-08-29 — the ORIGINAL greetings script (the name exchange).
//
// Replaced because every one of its steps had `audio: ''` — there are no
// recordings for "lub npe", "hu li cas", "Kuv lub npe hu ua Ntxawg" or
// "Zoo siab tau ntsib koj". It is a good lesson with nothing to play.
//
// TO RESTORE: record those four, add them to assets/audio/ + audioMap.js,
// then swap this block back in for the `greetings` const above. The step
// shape is unchanged, so nothing else needs touching.
// ════════════════════════════════════════════════════════════════════════════
// const greetings = {
//   id: 'speak-lesson-greetings',
//   title: 'Greetings',
//   blurb: 'Greet someone and give your name.',
//   emoji: '👋',
//   free: true, // the first lesson is the hook — never gated
//   steps: [
//     // ── Welcome (first lesson only) ─────────────────────────────────────────
//     {
//       id: 'speak-lesson-greetings-welcome',
//       type: 'intro',
//       emoji: '🌸',
//       title: 'Welcome to Kawm Hmoob',
//       body: [
//         'This is your first speaking lesson.',
//         'You will hear a native speaker, say it yourself, then be asked for it from memory.',
//         'Nothing to pass, nothing to fail.',
//       ],
//       duration: '5–10 minutes',
//     },
//     {
//       id: 'speak-lesson-greetings-topic',
//       type: 'intro',
//       emoji: '👋',
//       title: 'Saying hello',
//       body: ['Two words, then the sentence they build — one piece at a time.'],
//     },
//
//     // ══ SET 1 — hello ══════════════════════════════════════════════════════
//     {
//       id: 'speak-lesson-greetings-hear-1',
//       type: 'hear',
//       hmong: 'Nyob zoo',
//       english: 'hello',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-say-1',
//       type: 'say',
//       hmong: 'Nyob zoo',
//       english: 'hello',
//       audio: '',
//     },
//
//     // ══ SET 2 — the pieces of "my name is…" ════════════════════════════════
//     {
//       id: 'speak-lesson-greetings-hear-2',
//       type: 'hear',
//       hmong: 'kuv',
//       english: 'I / my',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-say-2',
//       type: 'say',
//       hmong: 'kuv',
//       english: 'I / my',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-hear-3',
//       type: 'hear',
//       hmong: 'lub npe',
//       english: 'name',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-say-3',
//       type: 'say',
//       hmong: 'lub npe',
//       english: 'name',
//       audio: '',
//     },
//
//     // ══ THE BUILD ═══════════════════════════════════════════════════════════
//     // ⚠️ THIS IS THE PATTERN THAT MATTERS. Each recall adds ONE piece to the
//     // thing you just said, so the sentence assembles under you:
//     //
//     //     kuv  →  kuv lub npe  →  kuv lub npe hu ua Ntxawg
//     //
//     // Going straight from two words to the full sentence is where learners fall
//     // off — the jump is too big and nothing bridges it. Three small steps cost
//     // nothing but data and each one is a phrase you could actually say.
//     {
//       id: 'speak-lesson-greetings-build-1',
//       type: 'recall',
//       hmong: 'kuv',
//       english: 'I / my',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-build-2',
//       type: 'recall',
//       hmong: 'kuv lub npe',
//       english: 'my name',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-build-3',
//       type: 'recall',
//       hmong: 'Kuv lub npe hu ua Ntxawg.',
//       english: 'My name is Ntxawg.',
//       audio: '',
//     },
//
//     // DOUBLE CHECK — set 1 returns, now as production rather than imitation
//     {
//       id: 'speak-lesson-greetings-recall-1-again',
//       type: 'recall',
//       hmong: 'Nyob zoo',
//       english: 'hello',
//       audio: '',
//     },
//
//     // ══ SET 3 — asking their name, built the same way ═══════════════════════
//     {
//       id: 'speak-lesson-greetings-hear-4',
//       type: 'hear',
//       hmong: 'koj',
//       english: 'you / your',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-say-4',
//       type: 'say',
//       hmong: 'koj',
//       english: 'you / your',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-hear-5',
//       type: 'hear',
//       hmong: 'hu li cas',
//       english: 'is called what',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-say-5',
//       type: 'say',
//       hmong: 'hu li cas',
//       english: 'is called what',
//       audio: '',
//     },
//
//     // THE BUILD, again — koj → koj lub npe → the whole question
//     {
//       id: 'speak-lesson-greetings-build-4',
//       type: 'recall',
//       hmong: 'koj',
//       english: 'you / your',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-build-5',
//       type: 'recall',
//       hmong: 'koj lub npe',
//       english: 'your name',
//       audio: '',
//     },
//     {
//       id: 'speak-lesson-greetings-build-6',
//       type: 'recall',
//       hmong: 'Koj lub npe hu li cas?',
//       english: 'What is your name?',
//       audio: '',
//     },
//
//     // ── COMPREHENSION — the other direction ─────────────────────────────────
//     // Every step so far has been English → Hmong. This one plays the Hmong and
//     // asks what it MEANS. A learner who only ever produces can say a phrase but
//     // not recognise it when it is said TO them.
//     {
//       id: 'speak-lesson-greetings-listen-1',
//       type: 'listen',
//       hmong: 'Koj lub npe hu li cas?',
//       english: 'What is your name?',
//       audio: '',
//     },
//
//     // DOUBLE CHECK — the first full sentence returns
//     {
//       id: 'speak-lesson-greetings-build-3-again',
//       type: 'recall',
//       hmong: 'Kuv lub npe hu ua Ntxawg.',
//       english: 'My name is Ntxawg.',
//       audio: '',
//     },
//
//     // ── Put it all together ─────────────────────────────────────────────────
//     {
//       id: 'speak-lesson-greetings-dialogue',
//       type: 'dialogue',
//       turns: [
//         {
//           speaker: 'A',
//           hmong: 'Nyob zoo! Koj lub npe hu li cas?',
//           english: 'Hello! What is your name?',
//           audio: '',
//         },
//         {
//           speaker: 'B',
//           hmong: 'Kuv lub npe hu ua Ntxawg.',
//           english: 'My name is Ntxawg.',
//           audio: '',
//           record: true,
//         },
//         {
//           speaker: 'A',
//           hmong: 'Zoo siab tau ntsib koj.',
//           english: 'Good to meet you.',
//           audio: '',
//         },
//       ],
//     },
//   ],
// }


// ════════════════════════════════════════════════════════════════════════════
// ║  LESSON SKELETONS — 18 lessons, written 2026-09-12                       ║
// ════════════════════════════════════════════════════════════════════════════
//
// These replace the `ph()` placeholder shells. They are REAL STRUCTURE with NO
// AUDIO: every step carries the author's own Hmong, a draft English gloss, and
// `audio: ''`.
//
// ⚠️ WHY THEY ARE WORTH SHIPPING BEFORE THE RECORDINGS EXIST. A `ph()` shell
// said "this lesson has not been written yet" and told you nothing about what to
// record. These do: `node scripts/audio-todo.mjs --write` now emits the exact
// clip list, deduped by phrase, with the path each file should land at. The
// checklist IS the recording script for the next session.
//
// ⚠️ NOTHING HERE HAS BEEN READ BY A FLUENT SPEAKER. The Hmong is the author's
// list copied verbatim; the English is drafted from the word annotations beside
// it. Three lessons carry specific spelling questions in their headers. Treat
// every gloss as provisional until reviewed — see
// notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ THE STEP SHAPE IS THE HOUSE ONE, ONE NOTCH SHORT. Each set teaches its new
// words (hear → say), then the phrase they build (hear → say), and the lesson
// closes with a recall block over the phrases. The three finished lessons also
// recall each WORD; doing that here would push several of these past 50 steps,
// so it is deliberately left for the pass that splits them.
// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// ASKING HOW MUCH? — SKELETON, written 2026-09-12.
//
// ✅ FULLY RECORDED 2026-09-12 — the first skeleton to get its audio, and the
// first Pro-locked lesson that can actually be practised: a clip to imitate on
// every step, and a reference for the tone scorer to compare a take against.
//
// ⚠️ THE ENGLISH IS STILL A DRAFT. Recording a lesson does not review it. The
// Hmong is the author's list verbatim and the glosses were written from the word
// annotations beside it — a clip proves the words were said, not that the
// translation under them is right.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// SPELLING NORMALISED: 'Licas' → 'li cas' and 'Pestawg' → 'pes tsawg',
// both on the authority of vocabulary.js, which already carries
// 'kim npaum li cas?' and 'yog pes tsawg?'.
//
// ⚠️ 26 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const priceHowMuch = {
  id: 'speak-lesson-price-how-much',
  title: 'Asking how much?',
  blurb: 'Nqi pes tsawg — the question you will use in every market.',
  emoji: '💰',
  steps: [
    {
      id: 'speak-lesson-price-how-much-topic',
      type: 'intro',
      emoji: '💰',
      title: 'Asking how much?',
      body: [
        'Five ways to ask a price.',
        'Meet the words first, then the question they build.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — How expensive is it? ══════════════════════════════
    {
      id: 'speak-lesson-price-how-much-hear-kim',
      type: 'hear',
      hmong: 'Kim',
      english: 'expensive',
      audio: A.kim,
    },
    {
      id: 'speak-lesson-price-how-much-say-kim',
      type: 'say',
      hmong: 'Kim',
      english: 'expensive',
      audio: A.kim,
    },
    {
      id: 'speak-lesson-price-how-much-hear-npaum',
      type: 'hear',
      hmong: 'Npaum',
      english: 'as much as / to what extent',
      audio: A.npaum,
    },
    {
      id: 'speak-lesson-price-how-much-say-npaum',
      type: 'say',
      hmong: 'Npaum',
      english: 'as much as / to what extent',
      audio: A.npaum,
    },
    {
      id: 'speak-lesson-price-how-much-hear-kim-npaum-li-cas',
      type: 'hear',
      hmong: 'Kim npaum li cas?',
      english: 'How expensive is it?',
      audio: A.kimNpaumLiCas,
    },
    {
      id: 'speak-lesson-price-how-much-say-kim-npaum-li-cas',
      type: 'say',
      hmong: 'Kim npaum li cas?',
      english: 'How expensive is it?',
      audio: A.kimNpaumLiCas,
    },

    // ══ SET 2 — How much is it? ══════════════════════════════
    {
      id: 'speak-lesson-price-how-much-hear-pes-tsawg',
      type: 'hear',
      hmong: 'Pes tsawg',
      english: 'how much / how many',
      audio: A.pesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-say-pes-tsawg',
      type: 'say',
      hmong: 'Pes tsawg',
      english: 'how much / how many',
      audio: A.pesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-hear-yog-pes-tsawg',
      type: 'hear',
      hmong: 'Yog pes tsawg?',
      english: 'How much is it?',
      audio: A.yogPesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-say-yog-pes-tsawg',
      type: 'say',
      hmong: 'Yog pes tsawg?',
      english: 'How much is it?',
      audio: A.yogPesTsawg,
    },

    // ══ SET 3 — What is the price? ══════════════════════════════
    {
      id: 'speak-lesson-price-how-much-hear-nqi',
      type: 'hear',
      hmong: 'Nqi',
      english: 'price',
      audio: A.nqi,
    },
    {
      id: 'speak-lesson-price-how-much-say-nqi',
      type: 'say',
      hmong: 'Nqi',
      english: 'price',
      audio: A.nqi,
    },
    {
      id: 'speak-lesson-price-how-much-hear-nqi-pes-tsawg',
      type: 'hear',
      hmong: 'Nqi pes tsawg?',
      english: 'What is the price?',
      audio: A.nqiPesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-say-nqi-pes-tsawg',
      type: 'say',
      hmong: 'Nqi pes tsawg?',
      english: 'What is the price?',
      audio: A.nqiPesTsawg,
    },

    // ══ SET 4 — What is the price? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-price-how-much-hear-tus-nqi-yog-li-cas',
      type: 'hear',
      hmong: 'Tus nqi yog li cas?',
      english: 'What is the price?',
      audio: A.tusNqiYogLiCas,
    },
    {
      id: 'speak-lesson-price-how-much-say-tus-nqi-yog-li-cas',
      type: 'say',
      hmong: 'Tus nqi yog li cas?',
      english: 'What is the price?',
      audio: A.tusNqiYogLiCas,
    },

    // ══ SET 5 — How much is this? ══════════════════════════════
    {
      id: 'speak-lesson-price-how-much-hear-qhov-no',
      type: 'hear',
      hmong: 'Qhov no',
      english: 'this one',
      audio: A.qhovNo,
    },
    {
      id: 'speak-lesson-price-how-much-say-qhov-no',
      type: 'say',
      hmong: 'Qhov no',
      english: 'this one',
      audio: A.qhovNo,
    },
    {
      id: 'speak-lesson-price-how-much-hear-qhov-no-yog-pes-tsawg',
      type: 'hear',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: A.qhovNoYogPesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-say-qhov-no-yog-pes-tsawg',
      type: 'say',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: A.qhovNoYogPesTsawg,
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-price-how-much-recall-kim-npaum-li-cas',
      type: 'recall',
      hmong: 'Kim npaum li cas?',
      english: 'How expensive is it?',
      audio: A.kimNpaumLiCas,
    },
    {
      id: 'speak-lesson-price-how-much-recall-yog-pes-tsawg',
      type: 'recall',
      hmong: 'Yog pes tsawg?',
      english: 'How much is it?',
      audio: A.yogPesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-recall-nqi-pes-tsawg',
      type: 'recall',
      hmong: 'Nqi pes tsawg?',
      english: 'What is the price?',
      audio: A.nqiPesTsawg,
    },
    {
      id: 'speak-lesson-price-how-much-recall-tus-nqi-yog-li-cas',
      type: 'recall',
      hmong: 'Tus nqi yog li cas?',
      english: 'What is the price?',
      audio: A.tusNqiYogLiCas,
    },
    {
      id: 'speak-lesson-price-how-much-recall-qhov-no-yog-pes-tsawg',
      type: 'recall',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: A.qhovNoYogPesTsawg,
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// THAT IS TOO EXPENSIVE — SKELETON, written 2026-09-12.
//
// ✅ FULLY RECORDED 2026-09-12 — the first skeleton to get its audio, and the
// first Pro-locked lesson that can actually be practised: a clip to imitate on
// every step, and a reference for the tone scorer to compare a take against.
//
// ⚠️ THE ENGLISH IS STILL A DRAFT. Recording a lesson does not review it. The
// Hmong is the author's list verbatim and the glosses were written from the word
// annotations beside it — a clip proves the words were said, not that the
// translation under them is right.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 28 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const priceTooMuch = {
  id: 'speak-lesson-price-too-much',
  title: 'That is too expensive',
  blurb: 'Push back politely, and counter.',
  emoji: '💸',
  steps: [
    {
      id: 'speak-lesson-price-too-much-topic',
      type: 'intro',
      emoji: '💸',
      title: 'That is too expensive',
      body: [
        'Saying no to a price without saying no to the seller.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I only have a little money. ══════════════════════════════
    {
      id: 'speak-lesson-price-too-much-hear-nyiaj',
      type: 'hear',
      hmong: 'Nyiaj',
      english: 'money',
      audio: A.nyiaj,
    },
    {
      id: 'speak-lesson-price-too-much-say-nyiaj',
      type: 'say',
      hmong: 'Nyiaj',
      english: 'money',
      audio: A.nyiaj,
    },
    {
      id: 'speak-lesson-price-too-much-hear-tsawg',
      type: 'hear',
      hmong: 'Tsawg',
      english: 'few / little',
      audio: A.tsawg,
    },
    {
      id: 'speak-lesson-price-too-much-say-tsawg',
      type: 'say',
      hmong: 'Tsawg',
      english: 'few / little',
      audio: A.tsawg,
    },
    {
      id: 'speak-lesson-price-too-much-hear-kuv-muaj-nyiaj-tsawg-xwb',
      type: 'hear',
      hmong: 'Kuv muaj nyiaj tsawg xwb.',
      english: 'I only have a little money.',
      audio: A.kuvMuajNyiajTsawgXwb,
    },
    {
      id: 'speak-lesson-price-too-much-say-kuv-muaj-nyiaj-tsawg-xwb',
      type: 'say',
      hmong: 'Kuv muaj nyiaj tsawg xwb.',
      english: 'I only have a little money.',
      audio: A.kuvMuajNyiajTsawgXwb,
    },

    // ══ SET 2 — Do you have a discount? ══════════════════════════════
    {
      id: 'speak-lesson-price-too-much-hear-puas',
      type: 'hear',
      hmong: 'Puas',
      english: 'question marker — makes a sentence a yes/no question',
      audio: A.puas,
    },
    {
      id: 'speak-lesson-price-too-much-say-puas',
      type: 'say',
      hmong: 'Puas',
      english: 'question marker — makes a sentence a yes/no question',
      audio: A.puas,
    },
    {
      id: 'speak-lesson-price-too-much-hear-luv-nqi',
      type: 'hear',
      hmong: 'Luv nqi',
      english: 'discount',
      audio: A.luvNqi,
    },
    {
      id: 'speak-lesson-price-too-much-say-luv-nqi',
      type: 'say',
      hmong: 'Luv nqi',
      english: 'discount',
      audio: A.luvNqi,
    },
    {
      id: 'speak-lesson-price-too-much-hear-koj-puas-muaj-luv-nqi',
      type: 'hear',
      hmong: 'Koj puas muaj luv nqi?',
      english: 'Do you have a discount?',
      audio: A.kojPuasMuajLuvNqi,
    },
    {
      id: 'speak-lesson-price-too-much-say-koj-puas-muaj-luv-nqi',
      type: 'say',
      hmong: 'Koj puas muaj luv nqi?',
      english: 'Do you have a discount?',
      audio: A.kojPuasMuajLuvNqi,
    },

    // ══ SET 3 — Could you make it cheaper? ══════════════════════════════
    {
      id: 'speak-lesson-price-too-much-hear-pheej-yig',
      type: 'hear',
      hmong: 'Pheej yig',
      english: 'cheap',
      audio: A.pheejYig,
    },
    {
      id: 'speak-lesson-price-too-much-say-pheej-yig',
      type: 'say',
      hmong: 'Pheej yig',
      english: 'cheap',
      audio: A.pheejYig,
    },
    {
      id: 'speak-lesson-price-too-much-hear-koj-puas-ua-pheej-yig-dua-tau',
      type: 'hear',
      hmong: 'Koj puas ua pheej yig dua tau?',
      english: 'Could you make it cheaper?',
      audio: A.kojPuasUaPheejYigDuaTau,
    },
    {
      id: 'speak-lesson-price-too-much-say-koj-puas-ua-pheej-yig-dua-tau',
      type: 'say',
      hmong: 'Koj puas ua pheej yig dua tau?',
      english: 'Could you make it cheaper?',
      audio: A.kojPuasUaPheejYigDuaTau,
    },

    // ══ SET 4 — This is very expensive. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-price-too-much-hear-qhov-no-kim-heev',
      type: 'hear',
      hmong: 'Qhov no kim heev.',
      english: 'This is very expensive.',
      audio: A.qhovNoKimHeev,
    },
    {
      id: 'speak-lesson-price-too-much-say-qhov-no-kim-heev',
      type: 'say',
      hmong: 'Qhov no kim heev.',
      english: 'This is very expensive.',
      audio: A.qhovNoKimHeev,
    },

    // ══ SET 5 — If you lower the price, I will buy it. ══════════════════════════════
    {
      id: 'speak-lesson-price-too-much-hear-txo-nqi',
      type: 'hear',
      hmong: 'Txo nqi',
      english: 'to lower the price',
      audio: A.txoNqi,
    },
    {
      id: 'speak-lesson-price-too-much-say-txo-nqi',
      type: 'say',
      hmong: 'Txo nqi',
      english: 'to lower the price',
      audio: A.txoNqi,
    },
    {
      id: 'speak-lesson-price-too-much-hear-yog-koj-txo-nqi-kuv-yuav',
      type: 'hear',
      hmong: 'Yog koj txo nqi, kuv yuav.',
      english: 'If you lower the price, I will buy it.',
      audio: A.yogKojTxoNqiKuvYuav,
    },
    {
      id: 'speak-lesson-price-too-much-say-yog-koj-txo-nqi-kuv-yuav',
      type: 'say',
      hmong: 'Yog koj txo nqi, kuv yuav.',
      english: 'If you lower the price, I will buy it.',
      audio: A.yogKojTxoNqiKuvYuav,
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-price-too-much-recall-kuv-muaj-nyiaj-tsawg-xwb',
      type: 'recall',
      hmong: 'Kuv muaj nyiaj tsawg xwb.',
      english: 'I only have a little money.',
      audio: A.kuvMuajNyiajTsawgXwb,
    },
    {
      id: 'speak-lesson-price-too-much-recall-koj-puas-muaj-luv-nqi',
      type: 'recall',
      hmong: 'Koj puas muaj luv nqi?',
      english: 'Do you have a discount?',
      audio: A.kojPuasMuajLuvNqi,
    },
    {
      id: 'speak-lesson-price-too-much-recall-koj-puas-ua-pheej-yig-dua-tau',
      type: 'recall',
      hmong: 'Koj puas ua pheej yig dua tau?',
      english: 'Could you make it cheaper?',
      audio: A.kojPuasUaPheejYigDuaTau,
    },
    {
      id: 'speak-lesson-price-too-much-recall-qhov-no-kim-heev',
      type: 'recall',
      hmong: 'Qhov no kim heev.',
      english: 'This is very expensive.',
      audio: A.qhovNoKimHeev,
    },
    {
      id: 'speak-lesson-price-too-much-recall-yog-koj-txo-nqi-kuv-yuav',
      type: 'recall',
      hmong: 'Yog koj txo nqi, kuv yuav.',
      english: 'If you lower the price, I will buy it.',
      audio: A.yogKojTxoNqiKuvYuav,
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// NUMBERS AND MONEY — SKELETON, written 2026-09-12.
//
// ✅ FULLY RECORDED 2026-09-12 — and with it `cat-price` is the first COMPLETE
// category in the course: three lessons, every step playing a native speaker.
//
// ⚠️ THE ENGLISH IS STILL A DRAFT, and this lesson carries more spelling risk
// than any other — see the four unverified spellings noted below. A clip proves
// the words were said; it does not settle how they are written.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// ⚠️ FOUR SPELLINGS TO CONFIRM, all kept exactly as written because
// vocabulary.js has no precedent for any of them: 'duas las' (dollars),
// 'tsib caum' (fifty), 'xees' (cents), and 'nyiaj nawb' — which may be
// intended as 'nyiaj ntsuab' (cash). Do not normalise them by guess.
//
// ⚠️ 26 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const priceNumbers = {
  id: 'speak-lesson-price-numbers',
  title: 'Numbers and money',
  blurb: 'Counting up to the price you actually pay.',
  emoji: '🪙',
  steps: [
    {
      id: 'speak-lesson-price-numbers-topic',
      type: 'intro',
      emoji: '🪙',
      title: 'Numbers and money',
      body: [
        'Dollars, cents, and saying what you have.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I have one hundred dollars and fifty cents. ══════════════════════════════
    {
      id: 'speak-lesson-price-numbers-hear-duas-las',
      type: 'hear',
      hmong: 'Duas las',
      english: 'dollars',
      audio: A.duasLas,
    },
    {
      id: 'speak-lesson-price-numbers-say-duas-las',
      type: 'say',
      hmong: 'Duas las',
      english: 'dollars',
      audio: A.duasLas,
    },
    {
      id: 'speak-lesson-price-numbers-hear-xees',
      type: 'hear',
      hmong: 'Xees',
      english: 'cents',
      audio: A.xees,
    },
    {
      id: 'speak-lesson-price-numbers-say-xees',
      type: 'say',
      hmong: 'Xees',
      english: 'cents',
      audio: A.xees,
    },
    {
      id: 'speak-lesson-price-numbers-hear-kuv-muaj-ib-puas-duas-las-thiab-tsib-caum-xees',
      type: 'hear',
      hmong: 'Kuv muaj ib puas duas las thiab tsib caum xees.',
      english: 'I have one hundred dollars and fifty cents.',
      audio: A.kuvMuajIbPuasDuasLasThiabTsibCaumXees,
    },
    {
      id: 'speak-lesson-price-numbers-say-kuv-muaj-ib-puas-duas-las-thiab-tsib-caum-xees',
      type: 'say',
      hmong: 'Kuv muaj ib puas duas las thiab tsib caum xees.',
      english: 'I have one hundred dollars and fifty cents.',
      audio: A.kuvMuajIbPuasDuasLasThiabTsibCaumXees,
    },

    // ══ SET 2 — I have more money. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-price-numbers-hear-kuv-muaj-nyiaj-ntau-dua',
      type: 'hear',
      hmong: 'Kuv muaj nyiaj ntau dua.',
      english: 'I have more money.',
      audio: A.kuvMuajNyiajNtauDua,
    },
    {
      id: 'speak-lesson-price-numbers-say-kuv-muaj-nyiaj-ntau-dua',
      type: 'say',
      hmong: 'Kuv muaj nyiaj ntau dua.',
      english: 'I have more money.',
      audio: A.kuvMuajNyiajNtauDua,
    },

    // ══ SET 3 — I sell this for five dollars. ══════════════════════════════
    {
      id: 'speak-lesson-price-numbers-hear-muag',
      type: 'hear',
      hmong: 'Muag',
      english: 'to sell',
      audio: A.muag,
    },
    {
      id: 'speak-lesson-price-numbers-say-muag',
      type: 'say',
      hmong: 'Muag',
      english: 'to sell',
      audio: A.muag,
    },
    {
      id: 'speak-lesson-price-numbers-hear-kuv-muag-yam-no-rau-tsib-duas-las',
      type: 'hear',
      hmong: 'Kuv muag yam no rau tsib duas las.',
      english: 'I sell this for five dollars.',
      audio: A.kuvMuagYamNoRauTsibDuasLas,
    },
    {
      id: 'speak-lesson-price-numbers-say-kuv-muag-yam-no-rau-tsib-duas-las',
      type: 'say',
      hmong: 'Kuv muag yam no rau tsib duas las.',
      english: 'I sell this for five dollars.',
      audio: A.kuvMuagYamNoRauTsibDuasLas,
    },

    // ══ SET 4 — I have no money. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-price-numbers-hear-kuv-tsis-muaj-nyiaj',
      type: 'hear',
      hmong: 'Kuv tsis muaj nyiaj.',
      english: 'I have no money.',
      audio: A.kuvTsisMuajNyiaj,
    },
    {
      id: 'speak-lesson-price-numbers-say-kuv-tsis-muaj-nyiaj',
      type: 'say',
      hmong: 'Kuv tsis muaj nyiaj.',
      english: 'I have no money.',
      audio: A.kuvTsisMuajNyiaj,
    },

    // ══ SET 5 — Do you accept check or cash? ══════════════════════════════
    {
      id: 'speak-lesson-price-numbers-hear-txais',
      type: 'hear',
      hmong: 'Txais',
      english: 'to accept / receive',
      audio: A.txais,
    },
    {
      id: 'speak-lesson-price-numbers-say-txais',
      type: 'say',
      hmong: 'Txais',
      english: 'to accept / receive',
      audio: A.txais,
    },
    {
      id: 'speak-lesson-price-numbers-hear-tshev',
      type: 'hear',
      hmong: 'Tshev',
      english: 'check (payment)',
      audio: A.tshev,
    },
    {
      id: 'speak-lesson-price-numbers-say-tshev',
      type: 'say',
      hmong: 'Tshev',
      english: 'check (payment)',
      audio: A.tshev,
    },
    {
      id: 'speak-lesson-price-numbers-hear-koj-puas-txais-tshev-los-yog-nyiaj-nawb',
      type: 'hear',
      hmong: 'Koj puas txais tshev los yog nyiaj nawb?',
      english: 'Do you accept check or cash?',
      audio: A.kojPuasTxaisTshevLosYogNyiajNawb,
    },
    {
      id: 'speak-lesson-price-numbers-say-koj-puas-txais-tshev-los-yog-nyiaj-nawb',
      type: 'say',
      hmong: 'Koj puas txais tshev los yog nyiaj nawb?',
      english: 'Do you accept check or cash?',
      audio: A.kojPuasTxaisTshevLosYogNyiajNawb,
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-price-numbers-recall-kuv-muaj-ib-puas-duas-las-thiab-tsib-caum-xees',
      type: 'recall',
      hmong: 'Kuv muaj ib puas duas las thiab tsib caum xees.',
      english: 'I have one hundred dollars and fifty cents.',
      audio: A.kuvMuajIbPuasDuasLasThiabTsibCaumXees,
    },
    {
      id: 'speak-lesson-price-numbers-recall-kuv-muaj-nyiaj-ntau-dua',
      type: 'recall',
      hmong: 'Kuv muaj nyiaj ntau dua.',
      english: 'I have more money.',
      audio: A.kuvMuajNyiajNtauDua,
    },
    {
      id: 'speak-lesson-price-numbers-recall-kuv-muag-yam-no-rau-tsib-duas-las',
      type: 'recall',
      hmong: 'Kuv muag yam no rau tsib duas las.',
      english: 'I sell this for five dollars.',
      audio: A.kuvMuagYamNoRauTsibDuasLas,
    },
    {
      id: 'speak-lesson-price-numbers-recall-kuv-tsis-muaj-nyiaj',
      type: 'recall',
      hmong: 'Kuv tsis muaj nyiaj.',
      english: 'I have no money.',
      audio: A.kuvTsisMuajNyiaj,
    },
    {
      id: 'speak-lesson-price-numbers-recall-koj-puas-txais-tshev-los-yog-nyiaj-nawb',
      type: 'recall',
      hmong: 'Koj puas txais tshev los yog nyiaj nawb?',
      english: 'Do you accept check or cash?',
      audio: A.kojPuasTxaisTshevLosYogNyiajNawb,
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// FAMILY MEMBERS — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// SPELLING NORMALISED: 'yawgtxiv' → 'yawg txiv' (spacing only).
// ⚠️ CONFIRM THE PAIRS: 'yawg txiv / niam tais' and 'yawg / pog' are
// taught here as two grandparent pairs. Hmong kinship marks WHICH side
// of the family, and the two sentences are otherwise identical — if the
// distinction is maternal vs paternal, the English must say so or the
// second sentence reads as a duplicate.
//
// ⚠️ 37 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const familyMembers = {
  id: 'speak-lesson-family-members',
  title: 'Family members',
  blurb: 'Parents, grandparents, siblings — and saying you love them.',
  emoji: '👨‍👩‍👧',
  steps: [
    {
      id: 'speak-lesson-family-members-topic',
      type: 'intro',
      emoji: '👨‍👩‍👧',
      title: 'Family members',
      body: [
        'The people in a Hmong household, and how to talk about them.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I love my family very much. ══════════════════════════════
    {
      id: 'speak-lesson-family-members-hear-tsev-neeg',
      type: 'hear',
      hmong: 'Tsev neeg',
      english: 'family',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-tsev-neeg',
      type: 'say',
      hmong: 'Tsev neeg',
      english: 'family',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-hlub',
      type: 'hear',
      hmong: 'Hlub',
      english: 'to love',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-hlub',
      type: 'say',
      hmong: 'Hlub',
      english: 'to love',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-kuv-hlub-kuv-tsev-neeg-heev',
      type: 'hear',
      hmong: 'Kuv hlub kuv tsev neeg heev.',
      english: 'I love my family very much.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-kuv-hlub-kuv-tsev-neeg-heev',
      type: 'say',
      hmong: 'Kuv hlub kuv tsev neeg heev.',
      english: 'I love my family very much.',
      audio: '',
    },

    // ══ SET 2 — My parents and I talk a lot. ══════════════════════════════
    {
      id: 'speak-lesson-family-members-hear-niam-txiv',
      type: 'hear',
      hmong: 'Niam txiv',
      english: 'parents',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-niam-txiv',
      type: 'say',
      hmong: 'Niam txiv',
      english: 'parents',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-kuv-thiab-kuv-niam-txiv-sib-tham-ntau',
      type: 'hear',
      hmong: 'Kuv thiab kuv niam txiv sib tham ntau.',
      english: 'My parents and I talk a lot.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-kuv-thiab-kuv-niam-txiv-sib-tham-ntau',
      type: 'say',
      hmong: 'Kuv thiab kuv niam txiv sib tham ntau.',
      english: 'My parents and I talk a lot.',
      audio: '',
    },

    // ══ SET 3 — I have a great many relatives. ══════════════════════════════
    {
      id: 'speak-lesson-family-members-hear-cov-txheeb-ze',
      type: 'hear',
      hmong: 'Cov txheeb ze',
      english: 'relatives',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-cov-txheeb-ze',
      type: 'say',
      hmong: 'Cov txheeb ze',
      english: 'relatives',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-coob',
      type: 'hear',
      hmong: 'Coob',
      english: 'many (of people)',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-coob',
      type: 'say',
      hmong: 'Coob',
      english: 'many (of people)',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-kuv-muaj-cov-txheeb-ze-coob-heev',
      type: 'hear',
      hmong: 'Kuv muaj cov txheeb ze coob heev.',
      english: 'I have a great many relatives.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-kuv-muaj-cov-txheeb-ze-coob-heev',
      type: 'say',
      hmong: 'Kuv muaj cov txheeb ze coob heev.',
      english: 'I have a great many relatives.',
      audio: '',
    },

    // ══ SET 4 — My grandfather and grandmother teach me many stories. ══════════════════════════════
    {
      id: 'speak-lesson-family-members-hear-yawg-txiv',
      type: 'hear',
      hmong: 'Yawg txiv',
      english: 'grandfather',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-yawg-txiv',
      type: 'say',
      hmong: 'Yawg txiv',
      english: 'grandfather',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-niam-tais',
      type: 'hear',
      hmong: 'Niam tais',
      english: 'grandmother',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-niam-tais',
      type: 'say',
      hmong: 'Niam tais',
      english: 'grandmother',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-zaj-dab-neeg',
      type: 'hear',
      hmong: 'Zaj dab neeg',
      english: 'story',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-zaj-dab-neeg',
      type: 'say',
      hmong: 'Zaj dab neeg',
      english: 'story',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-kuv-yawg-txiv-thiab-kuv-niam-tais-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'hear',
      hmong: 'Kuv yawg txiv thiab kuv niam tais qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-kuv-yawg-txiv-thiab-kuv-niam-tais-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'say',
      hmong: 'Kuv yawg txiv thiab kuv niam tais qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },

    // ══ SET 5 — My grandfather and grandmother teach me many stories. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-family-members-hear-kuv-yawg-thiab-kuv-pog-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'hear',
      hmong: 'Kuv yawg thiab kuv pog qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-kuv-yawg-thiab-kuv-pog-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'say',
      hmong: 'Kuv yawg thiab kuv pog qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },

    // ══ SET 6 — The little girl has many siblings. ══════════════════════════════
    {
      id: 'speak-lesson-family-members-hear-tus-me-ntxhais',
      type: 'hear',
      hmong: 'Tus me ntxhais',
      english: 'the little girl',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-tus-me-ntxhais',
      type: 'say',
      hmong: 'Tus me ntxhais',
      english: 'the little girl',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-hear-tus-me-ntxhais-muaj-nus-muag-coob-coob',
      type: 'hear',
      hmong: 'Tus me ntxhais muaj nus muag coob coob.',
      english: 'The little girl has many siblings.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-say-tus-me-ntxhais-muaj-nus-muag-coob-coob',
      type: 'say',
      hmong: 'Tus me ntxhais muaj nus muag coob coob.',
      english: 'The little girl has many siblings.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-family-members-recall-kuv-hlub-kuv-tsev-neeg-heev',
      type: 'recall',
      hmong: 'Kuv hlub kuv tsev neeg heev.',
      english: 'I love my family very much.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-recall-kuv-thiab-kuv-niam-txiv-sib-tham-ntau',
      type: 'recall',
      hmong: 'Kuv thiab kuv niam txiv sib tham ntau.',
      english: 'My parents and I talk a lot.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-recall-kuv-muaj-cov-txheeb-ze-coob-heev',
      type: 'recall',
      hmong: 'Kuv muaj cov txheeb ze coob heev.',
      english: 'I have a great many relatives.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-recall-kuv-yawg-txiv-thiab-kuv-niam-tais-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'recall',
      hmong: 'Kuv yawg txiv thiab kuv niam tais qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-recall-kuv-yawg-thiab-kuv-pog-qhia-kuv-ntau-zaj-dab-neeg',
      type: 'recall',
      hmong: 'Kuv yawg thiab kuv pog qhia kuv ntau zaj dab neeg.',
      english: 'My grandfather and grandmother teach me many stories.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-members-recall-tus-me-ntxhais-muaj-nus-muag-coob-coob',
      type: 'recall',
      hmong: 'Tus me ntxhais muaj nus muag coob coob.',
      english: 'The little girl has many siblings.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// ASKING ABOUT FAMILY — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 23 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const familyYours = {
  id: 'speak-lesson-family-yours',
  title: 'Asking about family',
  blurb: 'Who do you live with? How many siblings?',
  emoji: '🏡',
  steps: [
    {
      id: 'speak-lesson-family-yours-topic',
      type: 'intro',
      emoji: '🏡',
      title: 'Asking about family',
      body: [
        'Asking after someone else’s family — the questions, not the answers.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — How many people live in your family? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-family-yours-hear-muaj-pes-tsawg-tus-neeg-nyob-hauv-koj-tsev-neeg',
      type: 'hear',
      hmong: 'Muaj pes tsawg tus neeg nyob hauv koj tsev neeg?',
      english: 'How many people live in your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-muaj-pes-tsawg-tus-neeg-nyob-hauv-koj-tsev-neeg',
      type: 'say',
      hmong: 'Muaj pes tsawg tus neeg nyob hauv koj tsev neeg?',
      english: 'How many people live in your family?',
      audio: '',
    },

    // ══ SET 2 — How many people are in your family? ══════════════════════════════
    {
      id: 'speak-lesson-family-yours-hear-leej',
      type: 'hear',
      hmong: 'Leej',
      english: 'classifier for people',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-leej',
      type: 'say',
      hmong: 'Leej',
      english: 'classifier for people',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-hear-koj-tsev-neeg-muaj-pes-tsawg-leej',
      type: 'hear',
      hmong: 'Koj tsev neeg muaj pes tsawg leej?',
      english: 'How many people are in your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-koj-tsev-neeg-muaj-pes-tsawg-leej',
      type: 'say',
      hmong: 'Koj tsev neeg muaj pes tsawg leej?',
      english: 'How many people are in your family?',
      audio: '',
    },

    // ══ SET 3 — How many siblings do you have? ══════════════════════════════
    {
      id: 'speak-lesson-family-yours-hear-nus-muag',
      type: 'hear',
      hmong: 'Nus muag',
      english: 'siblings',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-nus-muag',
      type: 'say',
      hmong: 'Nus muag',
      english: 'siblings',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-hear-koj-muaj-pes-tsawg-tus-nus-muag',
      type: 'hear',
      hmong: 'Koj muaj pes tsawg tus nus muag?',
      english: 'How many siblings do you have?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-koj-muaj-pes-tsawg-tus-nus-muag',
      type: 'say',
      hmong: 'Koj muaj pes tsawg tus nus muag?',
      english: 'How many siblings do you have?',
      audio: '',
    },

    // ══ SET 4 — I have two siblings in my family. ══════════════════════════════
    // The author wrote '(number)' here — a slot. Filled with 'ob' (two) so the step is sayable; swap for whatever number the recording uses.
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-family-yours-hear-kuv-muaj-ob-tus-nus-muag-hauv-kuv-tsev-neeg',
      type: 'hear',
      hmong: 'Kuv muaj ob tus nus muag hauv kuv tsev neeg.',
      english: 'I have two siblings in my family.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-kuv-muaj-ob-tus-nus-muag-hauv-kuv-tsev-neeg',
      type: 'say',
      hmong: 'Kuv muaj ob tus nus muag hauv kuv tsev neeg.',
      english: 'I have two siblings in my family.',
      audio: '',
    },

    // ══ SET 5 — Do you live with your family? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-family-yours-hear-koj-puas-nyob-nrog-koj-tsev-neeg',
      type: 'hear',
      hmong: 'Koj puas nyob nrog koj tsev neeg?',
      english: 'Do you live with your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-koj-puas-nyob-nrog-koj-tsev-neeg',
      type: 'say',
      hmong: 'Koj puas nyob nrog koj tsev neeg?',
      english: 'Do you live with your family?',
      audio: '',
    },

    // ══ SET 6 — How is your family? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-family-yours-hear-koj-tsev-neeg-nyob-li-cas',
      type: 'hear',
      hmong: 'Koj tsev neeg nyob li cas?',
      english: 'How is your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-say-koj-tsev-neeg-nyob-li-cas',
      type: 'say',
      hmong: 'Koj tsev neeg nyob li cas?',
      english: 'How is your family?',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-family-yours-recall-muaj-pes-tsawg-tus-neeg-nyob-hauv-koj-tsev-neeg',
      type: 'recall',
      hmong: 'Muaj pes tsawg tus neeg nyob hauv koj tsev neeg?',
      english: 'How many people live in your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-recall-koj-tsev-neeg-muaj-pes-tsawg-leej',
      type: 'recall',
      hmong: 'Koj tsev neeg muaj pes tsawg leej?',
      english: 'How many people are in your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-recall-koj-muaj-pes-tsawg-tus-nus-muag',
      type: 'recall',
      hmong: 'Koj muaj pes tsawg tus nus muag?',
      english: 'How many siblings do you have?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-recall-kuv-muaj-ob-tus-nus-muag-hauv-kuv-tsev-neeg',
      type: 'recall',
      hmong: 'Kuv muaj ob tus nus muag hauv kuv tsev neeg.',
      english: 'I have two siblings in my family.',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-recall-koj-puas-nyob-nrog-koj-tsev-neeg',
      type: 'recall',
      hmong: 'Koj puas nyob nrog koj tsev neeg?',
      english: 'Do you live with your family?',
      audio: '',
    },
    {
      id: 'speak-lesson-family-yours-recall-koj-tsev-neeg-nyob-li-cas',
      type: 'recall',
      hmong: 'Koj tsev neeg nyob li cas?',
      english: 'How is your family?',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// I AM HUNGRY — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// SPELLING NORMALISED: 'tsaib plab' → 'tshaib plab', on the authority of
// vocabulary.js, which carries 'kuv tshaib plab'.
//
// ⚠️ 26 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const foodHungry = {
  id: 'speak-lesson-food-hungry',
  title: 'I am hungry',
  blurb: 'Say you are hungry, thirsty, or ready to eat.',
  emoji: '🍚',
  steps: [
    {
      id: 'speak-lesson-food-hungry-topic',
      type: 'intro',
      emoji: '🍚',
      title: 'I am hungry',
      body: [
        'The sentences that start a meal.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I am hungry. ══════════════════════════════
    {
      id: 'speak-lesson-food-hungry-hear-tshaib-plab',
      type: 'hear',
      hmong: 'Tshaib plab',
      english: 'to be hungry',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-tshaib-plab',
      type: 'say',
      hmong: 'Tshaib plab',
      english: 'to be hungry',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-hear-kuv-tshaib-plab',
      type: 'hear',
      hmong: 'Kuv tshaib plab.',
      english: 'I am hungry.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-kuv-tshaib-plab',
      type: 'say',
      hmong: 'Kuv tshaib plab.',
      english: 'I am hungry.',
      audio: '',
    },

    // ══ SET 2 — I am thirsty. ══════════════════════════════
    {
      id: 'speak-lesson-food-hungry-hear-nqhis',
      type: 'hear',
      hmong: 'Nqhis',
      english: 'to be thirsty',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-nqhis',
      type: 'say',
      hmong: 'Nqhis',
      english: 'to be thirsty',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-hear-kuv-nqhis-dej',
      type: 'hear',
      hmong: 'Kuv nqhis dej.',
      english: 'I am thirsty.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-kuv-nqhis-dej',
      type: 'say',
      hmong: 'Kuv nqhis dej.',
      english: 'I am thirsty.',
      audio: '',
    },

    // ══ SET 3 — Is there anything to eat? ══════════════════════════════
    {
      id: 'speak-lesson-food-hungry-hear-dab-tsi',
      type: 'hear',
      hmong: 'Dab tsi',
      english: 'what / anything',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-dab-tsi',
      type: 'say',
      hmong: 'Dab tsi',
      english: 'what / anything',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-hear-puas-muaj-dab-tsi-noj',
      type: 'hear',
      hmong: 'Puas muaj dab tsi noj?',
      english: 'Is there anything to eat?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-puas-muaj-dab-tsi-noj',
      type: 'say',
      hmong: 'Puas muaj dab tsi noj?',
      english: 'Is there anything to eat?',
      audio: '',
    },

    // ══ SET 4 — Have you eaten? ══════════════════════════════
    {
      id: 'speak-lesson-food-hungry-hear-lawm',
      type: 'hear',
      hmong: 'Lawm',
      english: 'already (sentence-final completion marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-lawm',
      type: 'say',
      hmong: 'Lawm',
      english: 'already (sentence-final completion marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-hear-koj-puas-noj-mov-lawm',
      type: 'hear',
      hmong: 'Koj puas noj mov lawm?',
      english: 'Have you eaten?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-koj-puas-noj-mov-lawm',
      type: 'say',
      hmong: 'Koj puas noj mov lawm?',
      english: 'Have you eaten?',
      audio: '',
    },

    // ══ SET 5 — Come and eat. ══════════════════════════════
    {
      id: 'speak-lesson-food-hungry-hear-los',
      type: 'hear',
      hmong: 'Los',
      english: 'to come',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-los',
      type: 'say',
      hmong: 'Los',
      english: 'to come',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-hear-los-noj-mov',
      type: 'hear',
      hmong: 'Los noj mov.',
      english: 'Come and eat.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-say-los-noj-mov',
      type: 'say',
      hmong: 'Los noj mov.',
      english: 'Come and eat.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-food-hungry-recall-kuv-tshaib-plab',
      type: 'recall',
      hmong: 'Kuv tshaib plab.',
      english: 'I am hungry.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-recall-kuv-nqhis-dej',
      type: 'recall',
      hmong: 'Kuv nqhis dej.',
      english: 'I am thirsty.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-recall-puas-muaj-dab-tsi-noj',
      type: 'recall',
      hmong: 'Puas muaj dab tsi noj?',
      english: 'Is there anything to eat?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-recall-koj-puas-noj-mov-lawm',
      type: 'recall',
      hmong: 'Koj puas noj mov lawm?',
      english: 'Have you eaten?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-hungry-recall-los-noj-mov',
      type: 'recall',
      hmong: 'Los noj mov.',
      english: 'Come and eat.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// ORDERING FOOD — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// ⚠️ ELEVEN PHRASES, THE LONGEST IN THE COURSE. Four of them are the same
// request in polite vs question form ('Thov muab…' / 'Koj puas muab…'),
// which is a real distinction worth teaching but does not need eleven
// steps to make. This is the first lesson to split.
//
// ⚠️ 40 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const foodOrdering = {
  id: 'speak-lesson-food-ordering',
  title: 'Ordering food',
  blurb: 'Order by number, ask for what you want, and check the price.',
  emoji: '📋',
  steps: [
    {
      id: 'speak-lesson-food-ordering-topic',
      type: 'intro',
      emoji: '📋',
      title: 'Ordering food',
      body: [
        'Ordering from a menu — by number, and by pointing.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — Please give me number one. ══════════════════════════════
    {
      id: 'speak-lesson-food-ordering-hear-muab',
      type: 'hear',
      hmong: 'Muab',
      english: 'to give',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-muab',
      type: 'say',
      hmong: 'Muab',
      english: 'to give',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-hear-tus-lej-ib',
      type: 'hear',
      hmong: 'Tus lej ib',
      english: 'number one',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-tus-lej-ib',
      type: 'say',
      hmong: 'Tus lej ib',
      english: 'number one',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-hear-thov-muab-tus-lej-ib-rau-kuv',
      type: 'hear',
      hmong: 'Thov muab tus lej ib rau kuv.',
      english: 'Please give me number one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-thov-muab-tus-lej-ib-rau-kuv',
      type: 'say',
      hmong: 'Thov muab tus lej ib rau kuv.',
      english: 'Please give me number one.',
      audio: '',
    },

    // ══ SET 2 — Could you give me number one? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-koj-puas-muab-tus-lej-ib-rau-kuv',
      type: 'hear',
      hmong: 'Koj puas muab tus lej ib rau kuv?',
      english: 'Could you give me number one?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-koj-puas-muab-tus-lej-ib-rau-kuv',
      type: 'say',
      hmong: 'Koj puas muab tus lej ib rau kuv?',
      english: 'Could you give me number one?',
      audio: '',
    },

    // ══ SET 3 — Please give me numbers one, two and three. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-thov-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'hear',
      hmong: 'Thov muab tus lej ib, ob, thiab peb rau kuv.',
      english: 'Please give me numbers one, two and three.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-thov-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'say',
      hmong: 'Thov muab tus lej ib, ob, thiab peb rau kuv.',
      english: 'Please give me numbers one, two and three.',
      audio: '',
    },

    // ══ SET 4 — Could you give me numbers one, two and three? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-koj-puas-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'hear',
      hmong: 'Koj puas muab tus lej ib, ob, thiab peb rau kuv?',
      english: 'Could you give me numbers one, two and three?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-koj-puas-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'say',
      hmong: 'Koj puas muab tus lej ib, ob, thiab peb rau kuv?',
      english: 'Could you give me numbers one, two and three?',
      audio: '',
    },

    // ══ SET 5 — I want this one. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-kuv-xav-tau-qhov-no',
      type: 'hear',
      hmong: 'Kuv xav tau qhov no.',
      english: 'I want this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-kuv-xav-tau-qhov-no',
      type: 'say',
      hmong: 'Kuv xav tau qhov no.',
      english: 'I want this one.',
      audio: '',
    },

    // ══ SET 6 — I will eat this one. ══════════════════════════════
    {
      id: 'speak-lesson-food-ordering-hear-yuav',
      type: 'hear',
      hmong: 'Yuav',
      english: 'will / to take (future marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-yuav',
      type: 'say',
      hmong: 'Yuav',
      english: 'will / to take (future marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-hear-kuv-yuav-noj-qhov-no',
      type: 'hear',
      hmong: 'Kuv yuav noj qhov no.',
      english: 'I will eat this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-kuv-yuav-noj-qhov-no',
      type: 'say',
      hmong: 'Kuv yuav noj qhov no.',
      english: 'I will eat this one.',
      audio: '',
    },

    // ══ SET 7 — Please give me this one. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-thov-muab-qhov-no-rau-kuv',
      type: 'hear',
      hmong: 'Thov muab qhov no rau kuv.',
      english: 'Please give me this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-thov-muab-qhov-no-rau-kuv',
      type: 'say',
      hmong: 'Thov muab qhov no rau kuv.',
      english: 'Please give me this one.',
      audio: '',
    },

    // ══ SET 8 — How much is this? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-qhov-no-yog-pes-tsawg',
      type: 'hear',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-qhov-no-yog-pes-tsawg',
      type: 'say',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: '',
    },

    // ══ SET 9 — I want water to drink. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-kuv-xav-tau-dej-haus',
      type: 'hear',
      hmong: 'Kuv xav tau dej haus.',
      english: 'I want water to drink.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-kuv-xav-tau-dej-haus',
      type: 'say',
      hmong: 'Kuv xav tau dej haus.',
      english: 'I want water to drink.',
      audio: '',
    },

    // ══ SET 10 — I want rice to eat. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-kuv-xav-tau-mov-noj',
      type: 'hear',
      hmong: 'Kuv xav tau mov noj.',
      english: 'I want rice to eat.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-kuv-xav-tau-mov-noj',
      type: 'say',
      hmong: 'Kuv xav tau mov noj.',
      english: 'I want rice to eat.',
      audio: '',
    },

    // ══ SET 11 — I want one. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-ordering-hear-kuv-xav-tau-ib-qho',
      type: 'hear',
      hmong: 'Kuv xav tau ib qho.',
      english: 'I want one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-say-kuv-xav-tau-ib-qho',
      type: 'say',
      hmong: 'Kuv xav tau ib qho.',
      english: 'I want one.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-food-ordering-recall-thov-muab-tus-lej-ib-rau-kuv',
      type: 'recall',
      hmong: 'Thov muab tus lej ib rau kuv.',
      english: 'Please give me number one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-koj-puas-muab-tus-lej-ib-rau-kuv',
      type: 'recall',
      hmong: 'Koj puas muab tus lej ib rau kuv?',
      english: 'Could you give me number one?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-thov-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'recall',
      hmong: 'Thov muab tus lej ib, ob, thiab peb rau kuv.',
      english: 'Please give me numbers one, two and three.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-koj-puas-muab-tus-lej-ib-ob-thiab-peb-rau-kuv',
      type: 'recall',
      hmong: 'Koj puas muab tus lej ib, ob, thiab peb rau kuv?',
      english: 'Could you give me numbers one, two and three?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-kuv-xav-tau-qhov-no',
      type: 'recall',
      hmong: 'Kuv xav tau qhov no.',
      english: 'I want this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-kuv-yuav-noj-qhov-no',
      type: 'recall',
      hmong: 'Kuv yuav noj qhov no.',
      english: 'I will eat this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-thov-muab-qhov-no-rau-kuv',
      type: 'recall',
      hmong: 'Thov muab qhov no rau kuv.',
      english: 'Please give me this one.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-qhov-no-yog-pes-tsawg',
      type: 'recall',
      hmong: 'Qhov no yog pes tsawg?',
      english: 'How much is this?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-kuv-xav-tau-dej-haus',
      type: 'recall',
      hmong: 'Kuv xav tau dej haus.',
      english: 'I want water to drink.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-kuv-xav-tau-mov-noj',
      type: 'recall',
      hmong: 'Kuv xav tau mov noj.',
      english: 'I want rice to eat.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-ordering-recall-kuv-xav-tau-ib-qho',
      type: 'recall',
      hmong: 'Kuv xav tau ib qho.',
      english: 'I want one.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// FOOD AND DISHES — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// ⚠️ THREE THINGS TO CONFIRM. 'Kuv xav Nqaij qaib nrog mov' was written
// without 'tau'; it is emitted as 'Kuv xav tau nqaij qaib nrog mov' to
// match the other 'xav tau' sentences — revert if that was deliberate.
// 'qe yob' (boiled egg?) has no precedent in vocabulary.js and is kept
// verbatim. 'mob kib' was read as 'mov kib' (fried rice), since 'mov' is
// rice and 'mob' is pain.
//
// ⚠️ 31 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const foodFoodstuff = {
  id: 'speak-lesson-food-foodstuff',
  title: 'Food and dishes',
  blurb: 'Chicken, sausage, eggs, chilli — ordering the actual dish.',
  emoji: '🍜',
  steps: [
    {
      id: 'speak-lesson-food-foodstuff-topic',
      type: 'intro',
      emoji: '🍜',
      title: 'Food and dishes',
      body: [
        'The food itself, and asking for it with rice.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I want chicken with rice. ══════════════════════════════
    {
      id: 'speak-lesson-food-foodstuff-hear-nqaij-qaib',
      type: 'hear',
      hmong: 'Nqaij qaib',
      english: 'chicken',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-nqaij-qaib',
      type: 'say',
      hmong: 'Nqaij qaib',
      english: 'chicken',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-nrog',
      type: 'hear',
      hmong: 'Nrog',
      english: 'with',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-nrog',
      type: 'say',
      hmong: 'Nrog',
      english: 'with',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-kuv-xav-tau-nqaij-qaib-nrog-mov',
      type: 'hear',
      hmong: 'Kuv xav tau nqaij qaib nrog mov.',
      english: 'I want chicken with rice.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-kuv-xav-tau-nqaij-qaib-nrog-mov',
      type: 'say',
      hmong: 'Kuv xav tau nqaij qaib nrog mov.',
      english: 'I want chicken with rice.',
      audio: '',
    },

    // ══ SET 2 — Sausage with rice. ══════════════════════════════
    {
      id: 'speak-lesson-food-foodstuff-hear-hnyuv-ntxwm',
      type: 'hear',
      hmong: 'Hnyuv ntxwm',
      english: 'Hmong sausage',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-hnyuv-ntxwm',
      type: 'say',
      hmong: 'Hnyuv ntxwm',
      english: 'Hmong sausage',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-hnyuv-ntxwm-nrog-mov',
      type: 'hear',
      hmong: 'Hnyuv ntxwm nrog mov.',
      english: 'Sausage with rice.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-hnyuv-ntxwm-nrog-mov',
      type: 'say',
      hmong: 'Hnyuv ntxwm nrog mov.',
      english: 'Sausage with rice.',
      audio: '',
    },

    // ══ SET 3 — Two boiled eggs. ══════════════════════════════
    {
      id: 'speak-lesson-food-foodstuff-hear-qe-yob',
      type: 'hear',
      hmong: 'Qe yob',
      english: 'boiled egg',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-qe-yob',
      type: 'say',
      hmong: 'Qe yob',
      english: 'boiled egg',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-ob-lub-qe-yob',
      type: 'hear',
      hmong: 'Ob lub qe yob.',
      english: 'Two boiled eggs.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-ob-lub-qe-yob',
      type: 'say',
      hmong: 'Ob lub qe yob.',
      english: 'Two boiled eggs.',
      audio: '',
    },

    // ══ SET 4 — Do we have chilli sauce? ══════════════════════════════
    {
      id: 'speak-lesson-food-foodstuff-hear-kua-txob',
      type: 'hear',
      hmong: 'Kua txob',
      english: 'chilli sauce',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-kua-txob',
      type: 'say',
      hmong: 'Kua txob',
      english: 'chilli sauce',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-peb-puas-muaj-kua-txob',
      type: 'hear',
      hmong: 'Peb puas muaj kua txob?',
      english: 'Do we have chilli sauce?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-peb-puas-muaj-kua-txob',
      type: 'say',
      hmong: 'Peb puas muaj kua txob?',
      english: 'Do we have chilli sauce?',
      audio: '',
    },

    // ══ SET 5 — Is there chilli sauce? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-foodstuff-hear-puas-muaj-kua-txob',
      type: 'hear',
      hmong: 'Puas muaj kua txob?',
      english: 'Is there chilli sauce?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-puas-muaj-kua-txob',
      type: 'say',
      hmong: 'Puas muaj kua txob?',
      english: 'Is there chilli sauce?',
      audio: '',
    },

    // ══ SET 6 — I like fried rice very much. ══════════════════════════════
    {
      id: 'speak-lesson-food-foodstuff-hear-mov-kib',
      type: 'hear',
      hmong: 'Mov kib',
      english: 'fried rice',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-mov-kib',
      type: 'say',
      hmong: 'Mov kib',
      english: 'fried rice',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-hear-kuv-nyiam-noj-mov-kib-heev',
      type: 'hear',
      hmong: 'Kuv nyiam noj mov kib heev.',
      english: 'I like fried rice very much.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-say-kuv-nyiam-noj-mov-kib-heev',
      type: 'say',
      hmong: 'Kuv nyiam noj mov kib heev.',
      english: 'I like fried rice very much.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-food-foodstuff-recall-kuv-xav-tau-nqaij-qaib-nrog-mov',
      type: 'recall',
      hmong: 'Kuv xav tau nqaij qaib nrog mov.',
      english: 'I want chicken with rice.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-recall-hnyuv-ntxwm-nrog-mov',
      type: 'recall',
      hmong: 'Hnyuv ntxwm nrog mov.',
      english: 'Sausage with rice.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-recall-ob-lub-qe-yob',
      type: 'recall',
      hmong: 'Ob lub qe yob.',
      english: 'Two boiled eggs.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-recall-peb-puas-muaj-kua-txob',
      type: 'recall',
      hmong: 'Peb puas muaj kua txob?',
      english: 'Do we have chilli sauce?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-recall-puas-muaj-kua-txob',
      type: 'recall',
      hmong: 'Puas muaj kua txob?',
      english: 'Is there chilli sauce?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-foodstuff-recall-kuv-nyiam-noj-mov-kib-heev',
      type: 'recall',
      hmong: 'Kuv nyiam noj mov kib heev.',
      english: 'I like fried rice very much.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// OFFERING AND ACCEPTING — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 25 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const foodOffer = {
  id: 'speak-lesson-food-offer',
  title: 'Offering and accepting',
  blurb: 'Noj mov — the offer that starts every meal.',
  emoji: '🥣',
  steps: [
    {
      id: 'speak-lesson-food-offer-topic',
      type: 'intro',
      emoji: '🥣',
      title: 'Offering and accepting',
      body: [
        'Offering, declining, and asking what someone wants.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — Do you want anything? ══════════════════════════════
    {
      id: 'speak-lesson-food-offer-hear-tsis',
      type: 'hear',
      hmong: 'Tsis',
      english: 'not (the general negator)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-tsis',
      type: 'say',
      hmong: 'Tsis',
      english: 'not (the general negator)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-hear-koj-puas-xav-tau-dab-tsi',
      type: 'hear',
      hmong: 'Koj puas xav tau dab tsi?',
      english: 'Do you want anything?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-koj-puas-xav-tau-dab-tsi',
      type: 'say',
      hmong: 'Koj puas xav tau dab tsi?',
      english: 'Do you want anything?',
      audio: '',
    },

    // ══ SET 2 — I do not want anything. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-offer-hear-kuv-tsis-xav-tau-dab-tsi',
      type: 'hear',
      hmong: 'Kuv tsis xav tau dab tsi.',
      english: 'I do not want anything.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-kuv-tsis-xav-tau-dab-tsi',
      type: 'say',
      hmong: 'Kuv tsis xav tau dab tsi.',
      english: 'I do not want anything.',
      audio: '',
    },

    // ══ SET 3 — How can I help you? ══════════════════════════════
    {
      id: 'speak-lesson-food-offer-hear-pab',
      type: 'hear',
      hmong: 'Pab',
      english: 'to help',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-pab',
      type: 'say',
      hmong: 'Pab',
      english: 'to help',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-hear-kev-pab',
      type: 'hear',
      hmong: 'Kev pab',
      english: 'help / assistance',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-kev-pab',
      type: 'say',
      hmong: 'Kev pab',
      english: 'help / assistance',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-hear-kuv-pab-tau-koj-li-cas',
      type: 'hear',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-kuv-pab-tau-koj-li-cas',
      type: 'say',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },

    // ══ SET 4 — Yes, I would like some help. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-offer-hear-xav-tau-kuv-xav-tau-kev-pab',
      type: 'hear',
      hmong: 'Xav tau, kuv xav tau kev pab.',
      english: 'Yes, I would like some help.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-xav-tau-kuv-xav-tau-kev-pab',
      type: 'say',
      hmong: 'Xav tau, kuv xav tau kev pab.',
      english: 'Yes, I would like some help.',
      audio: '',
    },

    // ══ SET 5 — Would you like to eat anything? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-offer-hear-koj-puas-xav-noj-dab-tsi',
      type: 'hear',
      hmong: 'Koj puas xav noj dab tsi?',
      english: 'Would you like to eat anything?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-koj-puas-xav-noj-dab-tsi',
      type: 'say',
      hmong: 'Koj puas xav noj dab tsi?',
      english: 'Would you like to eat anything?',
      audio: '',
    },

    // ══ SET 6 — Would you like to drink anything? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-offer-hear-koj-puas-xav-haus-dab-tsi',
      type: 'hear',
      hmong: 'Koj puas xav haus dab tsi?',
      english: 'Would you like to drink anything?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-say-koj-puas-xav-haus-dab-tsi',
      type: 'say',
      hmong: 'Koj puas xav haus dab tsi?',
      english: 'Would you like to drink anything?',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-food-offer-recall-koj-puas-xav-tau-dab-tsi',
      type: 'recall',
      hmong: 'Koj puas xav tau dab tsi?',
      english: 'Do you want anything?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-recall-kuv-tsis-xav-tau-dab-tsi',
      type: 'recall',
      hmong: 'Kuv tsis xav tau dab tsi.',
      english: 'I do not want anything.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-recall-kuv-pab-tau-koj-li-cas',
      type: 'recall',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-recall-xav-tau-kuv-xav-tau-kev-pab',
      type: 'recall',
      hmong: 'Xav tau, kuv xav tau kev pab.',
      english: 'Yes, I would like some help.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-recall-koj-puas-xav-noj-dab-tsi',
      type: 'recall',
      hmong: 'Koj puas xav noj dab tsi?',
      english: 'Would you like to eat anything?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-offer-recall-koj-puas-xav-haus-dab-tsi',
      type: 'recall',
      hmong: 'Koj puas xav haus dab tsi?',
      english: 'Would you like to drink anything?',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// OFFERING HELP — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 24 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const foodHelp = {
  id: 'speak-lesson-food-help',
  title: 'Offering help',
  blurb: 'Offer a hand, and ask whether one is wanted.',
  emoji: '🤝',
  steps: [
    {
      id: 'speak-lesson-food-help-topic',
      type: 'intro',
      emoji: '🤝',
      title: 'Offering help',
      body: [
        'Five ways to offer help — and one to ask for it.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I will help you. ══════════════════════════════
    {
      id: 'speak-lesson-food-help-hear-yuav',
      type: 'hear',
      hmong: 'Yuav',
      english: 'will (future marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-yuav',
      type: 'say',
      hmong: 'Yuav',
      english: 'will (future marker)',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-hear-kuv-yuav-pab-koj',
      type: 'hear',
      hmong: 'Kuv yuav pab koj.',
      english: 'I will help you.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-kuv-yuav-pab-koj',
      type: 'say',
      hmong: 'Kuv yuav pab koj.',
      english: 'I will help you.',
      audio: '',
    },

    // ══ SET 2 — Do you want my help? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-food-help-hear-koj-puas-xav-tau-kuv-kev-pab',
      type: 'hear',
      hmong: 'Koj puas xav tau kuv kev pab?',
      english: 'Do you want my help?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-koj-puas-xav-tau-kuv-kev-pab',
      type: 'say',
      hmong: 'Koj puas xav tau kuv kev pab?',
      english: 'Do you want my help?',
      audio: '',
    },

    // ══ SET 3 — How can I help you? ══════════════════════════════
    {
      id: 'speak-lesson-food-help-hear-li-cas',
      type: 'hear',
      hmong: 'Li cas',
      english: 'how / in what way',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-li-cas',
      type: 'say',
      hmong: 'Li cas',
      english: 'how / in what way',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-hear-kuv-pab-tau-koj-li-cas',
      type: 'hear',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-kuv-pab-tau-koj-li-cas',
      type: 'say',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },

    // ══ SET 4 — Let me help you. ══════════════════════════════
    {
      id: 'speak-lesson-food-help-hear-cia',
      type: 'hear',
      hmong: 'Cia',
      english: 'let / allow',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-cia',
      type: 'say',
      hmong: 'Cia',
      english: 'let / allow',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-hear-cia-kuv-pab-koj',
      type: 'hear',
      hmong: 'Cia kuv pab koj.',
      english: 'Let me help you.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-cia-kuv-pab-koj',
      type: 'say',
      hmong: 'Cia kuv pab koj.',
      english: 'Let me help you.',
      audio: '',
    },

    // ══ SET 5 — Can I help you? ══════════════════════════════
    {
      id: 'speak-lesson-food-help-hear-tau',
      type: 'hear',
      hmong: 'Tau',
      english: 'can / to be able',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-tau',
      type: 'say',
      hmong: 'Tau',
      english: 'can / to be able',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-hear-kuv-puas-pab-tau-koj',
      type: 'hear',
      hmong: 'Kuv puas pab tau koj?',
      english: 'Can I help you?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-say-kuv-puas-pab-tau-koj',
      type: 'say',
      hmong: 'Kuv puas pab tau koj?',
      english: 'Can I help you?',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-food-help-recall-kuv-yuav-pab-koj',
      type: 'recall',
      hmong: 'Kuv yuav pab koj.',
      english: 'I will help you.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-recall-koj-puas-xav-tau-kuv-kev-pab',
      type: 'recall',
      hmong: 'Koj puas xav tau kuv kev pab?',
      english: 'Do you want my help?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-recall-kuv-pab-tau-koj-li-cas',
      type: 'recall',
      hmong: 'Kuv pab tau koj li cas?',
      english: 'How can I help you?',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-recall-cia-kuv-pab-koj',
      type: 'recall',
      hmong: 'Cia kuv pab koj.',
      english: 'Let me help you.',
      audio: '',
    },
    {
      id: 'speak-lesson-food-help-recall-kuv-puas-pab-tau-koj',
      type: 'recall',
      hmong: 'Kuv puas pab tau koj?',
      english: 'Can I help you?',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// I DO NOT SPEAK HMONG WELL — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 28 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const understandingHmong = {
  id: 'speak-lesson-understanding-hmong',
  title: 'I do not speak Hmong well',
  blurb: 'The sentences that keep a conversation going when you are lost.',
  emoji: '🗣️',
  steps: [
    {
      id: 'speak-lesson-understanding-hmong-topic',
      type: 'intro',
      emoji: '🗣️',
      title: 'I do not speak Hmong well',
      body: [
        'Saying you did not follow — without ending the conversation.',
        'These five are the most useful sentences a beginner owns.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I do not know Hmong. ══════════════════════════════
    {
      id: 'speak-lesson-understanding-hmong-hear-paub',
      type: 'hear',
      hmong: 'Paub',
      english: 'to know',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-paub',
      type: 'say',
      hmong: 'Paub',
      english: 'to know',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-lus-hmoob',
      type: 'hear',
      hmong: 'Lus Hmoob',
      english: 'the Hmong language',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-lus-hmoob',
      type: 'say',
      hmong: 'Lus Hmoob',
      english: 'the Hmong language',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-kuv-tsis-paub-lus-hmoob',
      type: 'hear',
      hmong: 'Kuv tsis paub lus Hmoob.',
      english: 'I do not know Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-kuv-tsis-paub-lus-hmoob',
      type: 'say',
      hmong: 'Kuv tsis paub lus Hmoob.',
      english: 'I do not know Hmong.',
      audio: '',
    },

    // ══ SET 2 — I cannot speak Hmong. ══════════════════════════════
    {
      id: 'speak-lesson-understanding-hmong-hear-txawj',
      type: 'hear',
      hmong: 'Txawj',
      english: 'to be able / to know how',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-txawj',
      type: 'say',
      hmong: 'Txawj',
      english: 'to be able / to know how',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-kuv-tsis-txawj-hais-lus-hmoob',
      type: 'hear',
      hmong: 'Kuv tsis txawj hais lus Hmoob.',
      english: 'I cannot speak Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-kuv-tsis-txawj-hais-lus-hmoob',
      type: 'say',
      hmong: 'Kuv tsis txawj hais lus Hmoob.',
      english: 'I cannot speak Hmong.',
      audio: '',
    },

    // ══ SET 3 — I only speak a little Hmong. ══════════════════════════════
    // 'tsuas … xwb' is a frame, not a word: it wraps what follows to mean 'only'. Taught through the sentence rather than as a step.
    {
      id: 'speak-lesson-understanding-hmong-hear-me-ntsis',
      type: 'hear',
      hmong: 'Me ntsis',
      english: 'a little',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-me-ntsis',
      type: 'say',
      hmong: 'Me ntsis',
      english: 'a little',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-kuv-tsuas-hais-lus-hmoob-me-ntsis-xwb',
      type: 'hear',
      hmong: 'Kuv tsuas hais lus Hmoob me ntsis xwb.',
      english: 'I only speak a little Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-kuv-tsuas-hais-lus-hmoob-me-ntsis-xwb',
      type: 'say',
      hmong: 'Kuv tsuas hais lus Hmoob me ntsis xwb.',
      english: 'I only speak a little Hmong.',
      audio: '',
    },

    // ══ SET 4 — I do not understand Hmong well. ══════════════════════════════
    {
      id: 'speak-lesson-understanding-hmong-hear-nkag-siab',
      type: 'hear',
      hmong: 'Nkag siab',
      english: 'to understand',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-nkag-siab',
      type: 'say',
      hmong: 'Nkag siab',
      english: 'to understand',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-kuv-tsis-nkag-siab-lus-hmoob-zoo',
      type: 'hear',
      hmong: 'Kuv tsis nkag siab lus Hmoob zoo.',
      english: 'I do not understand Hmong well.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-kuv-tsis-nkag-siab-lus-hmoob-zoo',
      type: 'say',
      hmong: 'Kuv tsis nkag siab lus Hmoob zoo.',
      english: 'I do not understand Hmong well.',
      audio: '',
    },

    // ══ SET 5 — I do not understand what you are saying. ══════════════════════════════
    {
      id: 'speak-lesson-understanding-hmong-hear-to-taub',
      type: 'hear',
      hmong: 'To taub',
      english: 'to comprehend / to catch what was said',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-to-taub',
      type: 'say',
      hmong: 'To taub',
      english: 'to comprehend / to catch what was said',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-hear-kuv-tsis-to-taub-koj-hais-dab-tsi',
      type: 'hear',
      hmong: 'Kuv tsis to taub koj hais dab tsi.',
      english: 'I do not understand what you are saying.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-say-kuv-tsis-to-taub-koj-hais-dab-tsi',
      type: 'say',
      hmong: 'Kuv tsis to taub koj hais dab tsi.',
      english: 'I do not understand what you are saying.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-understanding-hmong-recall-kuv-tsis-paub-lus-hmoob',
      type: 'recall',
      hmong: 'Kuv tsis paub lus Hmoob.',
      english: 'I do not know Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-recall-kuv-tsis-txawj-hais-lus-hmoob',
      type: 'recall',
      hmong: 'Kuv tsis txawj hais lus Hmoob.',
      english: 'I cannot speak Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-recall-kuv-tsuas-hais-lus-hmoob-me-ntsis-xwb',
      type: 'recall',
      hmong: 'Kuv tsuas hais lus Hmoob me ntsis xwb.',
      english: 'I only speak a little Hmong.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-recall-kuv-tsis-nkag-siab-lus-hmoob-zoo',
      type: 'recall',
      hmong: 'Kuv tsis nkag siab lus Hmoob zoo.',
      english: 'I do not understand Hmong well.',
      audio: '',
    },
    {
      id: 'speak-lesson-understanding-hmong-recall-kuv-tsis-to-taub-koj-hais-dab-tsi',
      type: 'recall',
      hmong: 'Kuv tsis to taub koj hais dab tsi.',
      english: 'I do not understand what you are saying.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// EVERYDAY SHORT PHRASES — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 20 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayShort1 = {
  id: 'speak-lesson-everyday-short-1',
  title: 'Everyday short phrases',
  blurb: 'Five two-word replies you will use constantly.',
  emoji: '💬',
  steps: [
    {
      id: 'speak-lesson-everyday-short-1-topic',
      type: 'intro',
      emoji: '💬',
      title: 'Everyday short phrases',
      body: [
        'Short enough to say without thinking — which is the point.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — Very good ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-1-hear-zoo-heev',
      type: 'hear',
      hmong: 'Zoo heev',
      english: 'Very good',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-zoo-heev',
      type: 'say',
      hmong: 'Zoo heev',
      english: 'Very good',
      audio: '',
    },

    // ══ SET 2 — Pleased with ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-1-hear-txaus',
      type: 'hear',
      hmong: 'Txaus',
      english: 'enough',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-txaus',
      type: 'say',
      hmong: 'Txaus',
      english: 'enough',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-hear-txaus-siab-rau',
      type: 'hear',
      hmong: 'Txaus siab rau',
      english: 'Pleased with',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-txaus-siab-rau',
      type: 'say',
      hmong: 'Txaus siab rau',
      english: 'Pleased with',
      audio: '',
    },

    // ══ SET 3 — Happy for you ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-1-hear-nrog-koj-zoo-siab',
      type: 'hear',
      hmong: 'Nrog koj zoo siab',
      english: 'Happy for you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-nrog-koj-zoo-siab',
      type: 'say',
      hmong: 'Nrog koj zoo siab',
      english: 'Happy for you',
      audio: '',
    },

    // ══ SET 4 — Well done ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-1-hear-ua',
      type: 'hear',
      hmong: 'Ua',
      english: 'to do / to make',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-ua',
      type: 'say',
      hmong: 'Ua',
      english: 'to do / to make',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-hear-ua-tau-zoo',
      type: 'hear',
      hmong: 'Ua tau zoo',
      english: 'Well done',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-ua-tau-zoo',
      type: 'say',
      hmong: 'Ua tau zoo',
      english: 'Well done',
      audio: '',
    },

    // ══ SET 5 — I know ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-1-hear-kuv-paub',
      type: 'hear',
      hmong: 'Kuv paub',
      english: 'I know',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-say-kuv-paub',
      type: 'say',
      hmong: 'Kuv paub',
      english: 'I know',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-short-1-recall-zoo-heev',
      type: 'recall',
      hmong: 'Zoo heev',
      english: 'Very good',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-recall-txaus-siab-rau',
      type: 'recall',
      hmong: 'Txaus siab rau',
      english: 'Pleased with',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-recall-nrog-koj-zoo-siab',
      type: 'recall',
      hmong: 'Nrog koj zoo siab',
      english: 'Happy for you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-recall-ua-tau-zoo',
      type: 'recall',
      hmong: 'Ua tau zoo',
      english: 'Well done',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-1-recall-kuv-paub',
      type: 'recall',
      hmong: 'Kuv paub',
      english: 'I know',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// HAPPENING RIGHT NOW — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// ⚠️ CONFIRM THE FIRST SENTENCE. 'Kuv tab tom ua kuv tsev kawm ntawv'
// reads literally as 'I am doing my school' — the intent is probably
// schoolwork, which may need a different noun.
//
// ⚠️ 26 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayCurrently = {
  id: 'speak-lesson-everyday-currently',
  title: 'Happening right now',
  blurb: 'Tab tom — the word that makes a verb continuous.',
  emoji: '⏳',
  steps: [
    {
      id: 'speak-lesson-everyday-currently-topic',
      type: 'intro',
      emoji: '⏳',
      title: 'Happening right now',
      body: [
        'One small word in front of a verb turns it into "-ing".',
        'Hmong verbs never change form; this does the work instead.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I am doing my schoolwork. ══════════════════════════════
    {
      id: 'speak-lesson-everyday-currently-hear-tab-tom',
      type: 'hear',
      hmong: 'Tab tom',
      english: 'currently (-ing)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-tab-tom',
      type: 'say',
      hmong: 'Tab tom',
      english: 'currently (-ing)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-hear-tsev-kawm-ntawv',
      type: 'hear',
      hmong: 'Tsev kawm ntawv',
      english: 'school',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-tsev-kawm-ntawv',
      type: 'say',
      hmong: 'Tsev kawm ntawv',
      english: 'school',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-hear-kuv-tab-tom-ua-kuv-tsev-kawm-ntawv',
      type: 'hear',
      hmong: 'Kuv tab tom ua kuv tsev kawm ntawv.',
      english: 'I am doing my schoolwork.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-kuv-tab-tom-ua-kuv-tsev-kawm-ntawv',
      type: 'say',
      hmong: 'Kuv tab tom ua kuv tsev kawm ntawv.',
      english: 'I am doing my schoolwork.',
      audio: '',
    },

    // ══ SET 2 — He is going to the market. ══════════════════════════════
    {
      id: 'speak-lesson-everyday-currently-hear-tom-khw',
      type: 'hear',
      hmong: 'Tom khw',
      english: 'at the market',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-tom-khw',
      type: 'say',
      hmong: 'Tom khw',
      english: 'at the market',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-hear-nws-tab-tom-mus-tom-khw',
      type: 'hear',
      hmong: 'Nws tab tom mus tom khw.',
      english: 'He is going to the market.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-nws-tab-tom-mus-tom-khw',
      type: 'say',
      hmong: 'Nws tab tom mus tom khw.',
      english: 'He is going to the market.',
      audio: '',
    },

    // ══ SET 3 — She is cooking. ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-currently-hear-nws-tab-tom-ua-noj',
      type: 'hear',
      hmong: 'Nws tab tom ua noj.',
      english: 'She is cooking.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-nws-tab-tom-ua-noj',
      type: 'say',
      hmong: 'Nws tab tom ua noj.',
      english: 'She is cooking.',
      audio: '',
    },

    // ══ SET 4 — We are talking. ══════════════════════════════
    {
      id: 'speak-lesson-everyday-currently-hear-sib-tham',
      type: 'hear',
      hmong: 'Sib tham',
      english: 'to talk with each other',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-sib-tham',
      type: 'say',
      hmong: 'Sib tham',
      english: 'to talk with each other',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-hear-peb-tab-tom-sib-tham',
      type: 'hear',
      hmong: 'Peb tab tom sib tham.',
      english: 'We are talking.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-peb-tab-tom-sib-tham',
      type: 'say',
      hmong: 'Peb tab tom sib tham.',
      english: 'We are talking.',
      audio: '',
    },

    // ══ SET 5 — I am waiting for you. ══════════════════════════════
    {
      id: 'speak-lesson-everyday-currently-hear-tos',
      type: 'hear',
      hmong: 'Tos',
      english: 'to wait',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-tos',
      type: 'say',
      hmong: 'Tos',
      english: 'to wait',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-hear-kuv-tab-tom-tos-koj',
      type: 'hear',
      hmong: 'Kuv tab tom tos koj.',
      english: 'I am waiting for you.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-say-kuv-tab-tom-tos-koj',
      type: 'say',
      hmong: 'Kuv tab tom tos koj.',
      english: 'I am waiting for you.',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-currently-recall-kuv-tab-tom-ua-kuv-tsev-kawm-ntawv',
      type: 'recall',
      hmong: 'Kuv tab tom ua kuv tsev kawm ntawv.',
      english: 'I am doing my schoolwork.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-recall-nws-tab-tom-mus-tom-khw',
      type: 'recall',
      hmong: 'Nws tab tom mus tom khw.',
      english: 'He is going to the market.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-recall-nws-tab-tom-ua-noj',
      type: 'recall',
      hmong: 'Nws tab tom ua noj.',
      english: 'She is cooking.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-recall-peb-tab-tom-sib-tham',
      type: 'recall',
      hmong: 'Peb tab tom sib tham.',
      english: 'We are talking.',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-currently-recall-kuv-tab-tom-tos-koj',
      type: 'recall',
      hmong: 'Kuv tab tom tos koj.',
      english: 'I am waiting for you.',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// YES AND NO — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 18 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayYesNo = {
  id: 'speak-lesson-everyday-yes-no',
  title: 'Yes and no',
  blurb: 'Agreeing, refusing, and saying what you want.',
  emoji: '✅',
  steps: [
    {
      id: 'speak-lesson-everyday-yes-no-topic',
      type: 'intro',
      emoji: '✅',
      title: 'Yes and no',
      body: [
        'Hmong has no bare "yes" — you answer with the verb.',
        'That is why every sentence here is built from one.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — No / that is not right ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-yes-no-hear-tsis-yog',
      type: 'hear',
      hmong: 'Tsis yog',
      english: 'No / that is not right',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-tsis-yog',
      type: 'say',
      hmong: 'Tsis yog',
      english: 'No / that is not right',
      audio: '',
    },

    // ══ SET 2 — I will not do it ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-yes-no-hear-kuv-tsis-ua',
      type: 'hear',
      hmong: 'Kuv tsis ua',
      english: 'I will not do it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-kuv-tsis-ua',
      type: 'say',
      hmong: 'Kuv tsis ua',
      english: 'I will not do it',
      audio: '',
    },

    // ══ SET 3 — I want it ══════════════════════════════
    {
      id: 'speak-lesson-everyday-yes-no-hear-xav',
      type: 'hear',
      hmong: 'Xav',
      english: 'to want / to think',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-xav',
      type: 'say',
      hmong: 'Xav',
      english: 'to want / to think',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-hear-kuv-xav-tau',
      type: 'hear',
      hmong: 'Kuv xav tau',
      english: 'I want it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-kuv-xav-tau',
      type: 'say',
      hmong: 'Kuv xav tau',
      english: 'I want it',
      audio: '',
    },

    // ══ SET 4 — I do not want to do it ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-yes-no-hear-kuv-tsis-xav-ua',
      type: 'hear',
      hmong: 'Kuv tsis xav ua',
      english: 'I do not want to do it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-kuv-tsis-xav-ua',
      type: 'say',
      hmong: 'Kuv tsis xav ua',
      english: 'I do not want to do it',
      audio: '',
    },

    // ══ SET 5 — I will do it ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-yes-no-hear-kuv-ua',
      type: 'hear',
      hmong: 'Kuv ua',
      english: 'I will do it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-say-kuv-ua',
      type: 'say',
      hmong: 'Kuv ua',
      english: 'I will do it',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-yes-no-recall-tsis-yog',
      type: 'recall',
      hmong: 'Tsis yog',
      english: 'No / that is not right',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-recall-kuv-tsis-ua',
      type: 'recall',
      hmong: 'Kuv tsis ua',
      english: 'I will not do it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-recall-kuv-xav-tau',
      type: 'recall',
      hmong: 'Kuv xav tau',
      english: 'I want it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-recall-kuv-tsis-xav-ua',
      type: 'recall',
      hmong: 'Kuv tsis xav ua',
      english: 'I do not want to do it',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-yes-no-recall-kuv-ua',
      type: 'recall',
      hmong: 'Kuv ua',
      english: 'I will do it',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// LOVE AND LIKING — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 26 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayRomance = {
  id: 'speak-lesson-everyday-romance',
  title: 'Love and liking',
  blurb: 'Nyiam, hlub, nco — like, love, and miss.',
  emoji: '💗',
  steps: [
    {
      id: 'speak-lesson-everyday-romance-topic',
      type: 'intro',
      emoji: '💗',
      title: 'Love and liking',
      body: [
        'Hmong separates liking from loving more sharply than English does.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — I like you ══════════════════════════════
    {
      id: 'speak-lesson-everyday-romance-hear-nyiam',
      type: 'hear',
      hmong: 'Nyiam',
      english: 'to like',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-nyiam',
      type: 'say',
      hmong: 'Nyiam',
      english: 'to like',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-hear-kuv-nyiam-koj',
      type: 'hear',
      hmong: 'Kuv nyiam koj',
      english: 'I like you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kuv-nyiam-koj',
      type: 'say',
      hmong: 'Kuv nyiam koj',
      english: 'I like you',
      audio: '',
    },

    // ══ SET 2 — I love you ══════════════════════════════
    {
      id: 'speak-lesson-everyday-romance-hear-hlub',
      type: 'hear',
      hmong: 'Hlub',
      english: 'to love',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-hlub',
      type: 'say',
      hmong: 'Hlub',
      english: 'to love',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-hear-kuv-hlub-koj',
      type: 'hear',
      hmong: 'Kuv hlub koj',
      english: 'I love you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kuv-hlub-koj',
      type: 'say',
      hmong: 'Kuv hlub koj',
      english: 'I love you',
      audio: '',
    },

    // ══ SET 3 — I am in love ══════════════════════════════
    {
      id: 'speak-lesson-everyday-romance-hear-kev-hlub',
      type: 'hear',
      hmong: 'Kev hlub',
      english: 'love (the thing itself)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kev-hlub',
      type: 'say',
      hmong: 'Kev hlub',
      english: 'love (the thing itself)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-hear-kuv-nyob-hauv-kev-hlub',
      type: 'hear',
      hmong: 'Kuv nyob hauv kev hlub',
      english: 'I am in love',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kuv-nyob-hauv-kev-hlub',
      type: 'say',
      hmong: 'Kuv nyob hauv kev hlub',
      english: 'I am in love',
      audio: '',
    },

    // ══ SET 4 — I am yours ══════════════════════════════
    {
      id: 'speak-lesson-everyday-romance-hear-li',
      type: 'hear',
      hmong: 'Li',
      english: 'belonging to',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-li',
      type: 'say',
      hmong: 'Li',
      english: 'belonging to',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-hear-kuv-yog-koj-li',
      type: 'hear',
      hmong: 'Kuv yog koj li',
      english: 'I am yours',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kuv-yog-koj-li',
      type: 'say',
      hmong: 'Kuv yog koj li',
      english: 'I am yours',
      audio: '',
    },

    // ══ SET 5 — I miss you very much ══════════════════════════════
    {
      id: 'speak-lesson-everyday-romance-hear-nco',
      type: 'hear',
      hmong: 'Nco',
      english: 'to miss / to remember',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-nco',
      type: 'say',
      hmong: 'Nco',
      english: 'to miss / to remember',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-hear-kuv-nco-koj-ntau-ntau',
      type: 'hear',
      hmong: 'Kuv nco koj ntau ntau',
      english: 'I miss you very much',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-say-kuv-nco-koj-ntau-ntau',
      type: 'say',
      hmong: 'Kuv nco koj ntau ntau',
      english: 'I miss you very much',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-romance-recall-kuv-nyiam-koj',
      type: 'recall',
      hmong: 'Kuv nyiam koj',
      english: 'I like you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-recall-kuv-hlub-koj',
      type: 'recall',
      hmong: 'Kuv hlub koj',
      english: 'I love you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-recall-kuv-nyob-hauv-kev-hlub',
      type: 'recall',
      hmong: 'Kuv nyob hauv kev hlub',
      english: 'I am in love',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-recall-kuv-yog-koj-li',
      type: 'recall',
      hmong: 'Kuv yog koj li',
      english: 'I am yours',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-romance-recall-kuv-nco-koj-ntau-ntau',
      type: 'recall',
      hmong: 'Kuv nco koj ntau ntau',
      english: 'I miss you very much',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// EVERYDAY SHORT PHRASES 2 — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 24 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayShort2 = {
  id: 'speak-lesson-everyday-short-2',
  title: 'Everyday short phrases 2',
  blurb: 'Reacting — that is scary, that is too much.',
  emoji: '💭',
  steps: [
    {
      id: 'speak-lesson-everyday-short-2-topic',
      type: 'intro',
      emoji: '💭',
      title: 'Everyday short phrases 2',
      body: [
        'Qhov ntawd — "that" — plus one adjective, five times over.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — Hello to you ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-2-hear-koj-nyob-zoo',
      type: 'hear',
      hmong: 'Koj nyob zoo',
      english: 'Hello to you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-koj-nyob-zoo',
      type: 'say',
      hmong: 'Koj nyob zoo',
      english: 'Hello to you',
      audio: '',
    },

    // ══ SET 2 — That is frightening ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-2-hear-qhov-ntawd',
      type: 'hear',
      hmong: 'Qhov ntawd',
      english: 'that one',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-qhov-ntawd',
      type: 'say',
      hmong: 'Qhov ntawd',
      english: 'that one',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-hear-ntshai',
      type: 'hear',
      hmong: 'Ntshai',
      english: 'to fear',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-ntshai',
      type: 'say',
      hmong: 'Ntshai',
      english: 'to fear',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-hear-qhov-ntawd-txaus-ntshai',
      type: 'hear',
      hmong: 'Qhov ntawd txaus ntshai',
      english: 'That is frightening',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-qhov-ntawd-txaus-ntshai',
      type: 'say',
      hmong: 'Qhov ntawd txaus ntshai',
      english: 'That is frightening',
      audio: '',
    },

    // ══ SET 3 — That is very bad ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-2-hear-phem',
      type: 'hear',
      hmong: 'Phem',
      english: 'bad / wicked',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-phem',
      type: 'say',
      hmong: 'Phem',
      english: 'bad / wicked',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-hear-qhov-ntawd-phem-heev',
      type: 'hear',
      hmong: 'Qhov ntawd phem heev',
      english: 'That is very bad',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-qhov-ntawd-phem-heev',
      type: 'say',
      hmong: 'Qhov ntawd phem heev',
      english: 'That is very bad',
      audio: '',
    },

    // ══ SET 4 — That is too much ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-2-hear-dhau',
      type: 'hear',
      hmong: 'Dhau',
      english: 'past / beyond (too)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-dhau',
      type: 'say',
      hmong: 'Dhau',
      english: 'past / beyond (too)',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-hear-qhov-ntawd-ntau-dhau-lawm',
      type: 'hear',
      hmong: 'Qhov ntawd ntau dhau lawm',
      english: 'That is too much',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-qhov-ntawd-ntau-dhau-lawm',
      type: 'say',
      hmong: 'Qhov ntawd ntau dhau lawm',
      english: 'That is too much',
      audio: '',
    },

    // ══ SET 5 — See you ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-2-hear-pom-koj',
      type: 'hear',
      hmong: 'Pom koj',
      english: 'See you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-say-pom-koj',
      type: 'say',
      hmong: 'Pom koj',
      english: 'See you',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-short-2-recall-koj-nyob-zoo',
      type: 'recall',
      hmong: 'Koj nyob zoo',
      english: 'Hello to you',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-recall-qhov-ntawd-txaus-ntshai',
      type: 'recall',
      hmong: 'Qhov ntawd txaus ntshai',
      english: 'That is frightening',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-recall-qhov-ntawd-phem-heev',
      type: 'recall',
      hmong: 'Qhov ntawd phem heev',
      english: 'That is very bad',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-recall-qhov-ntawd-ntau-dhau-lawm',
      type: 'recall',
      hmong: 'Qhov ntawd ntau dhau lawm',
      english: 'That is too much',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-2-recall-pom-koj',
      type: 'recall',
      hmong: 'Pom koj',
      english: 'See you',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// EVERYDAY SHORT PHRASES 3 — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
// SPELLING NORMALISED: 'Hmoob zoo' → 'Hmoov zoo'. 'Hmoob' is the people
// and the language; 'hmoov' is luck, and 'good luck' needs the second.
// ⚠️ CONFIRM 'Koj puas yog dawb' — 'dawb' is white, so this may be asking
// whether someone is White Hmong (Hmoob Dawb) rather than anything about
// colour. The gloss below assumes the dialect reading.
//
// ⚠️ 27 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const everydayShort3 = {
  id: 'speak-lesson-everyday-short-3',
  title: 'Everyday short phrases 3',
  blurb: 'Good idea, good luck, and what now?',
  emoji: '🍀',
  steps: [
    {
      id: 'speak-lesson-everyday-short-3-topic',
      type: 'intro',
      emoji: '🍀',
      title: 'Everyday short phrases 3',
      body: [
        'Five more short replies, and one question you will ask often.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — What is to be done? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-3-hear-yuav-ua-li-cas',
      type: 'hear',
      hmong: 'Yuav ua li cas',
      english: 'What is to be done?',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-yuav-ua-li-cas',
      type: 'say',
      hmong: 'Yuav ua li cas',
      english: 'What is to be done?',
      audio: '',
    },

    // ══ SET 2 — Are you White Hmong? ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-3-hear-dawb',
      type: 'hear',
      hmong: 'Dawb',
      english: 'white',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-dawb',
      type: 'say',
      hmong: 'Dawb',
      english: 'white',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-hear-koj-puas-yog-dawb',
      type: 'hear',
      hmong: 'Koj puas yog dawb?',
      english: 'Are you White Hmong?',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-koj-puas-yog-dawb',
      type: 'say',
      hmong: 'Koj puas yog dawb?',
      english: 'Are you White Hmong?',
      audio: '',
    },

    // ══ SET 3 — Get well soon ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-everyday-short-3-hear-tau-zoo-sai-sai',
      type: 'hear',
      hmong: 'Tau zoo sai sai',
      english: 'Get well soon',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-tau-zoo-sai-sai',
      type: 'say',
      hmong: 'Tau zoo sai sai',
      english: 'Get well soon',
      audio: '',
    },

    // ══ SET 4 — I cannot stop ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-3-hear-nres',
      type: 'hear',
      hmong: 'Nres',
      english: 'to stop',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-nres',
      type: 'say',
      hmong: 'Nres',
      english: 'to stop',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-hear-kuv-nres-tsis-tau',
      type: 'hear',
      hmong: 'Kuv nres tsis tau',
      english: 'I cannot stop',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-kuv-nres-tsis-tau',
      type: 'say',
      hmong: 'Kuv nres tsis tau',
      english: 'I cannot stop',
      audio: '',
    },

    // ══ SET 5 — Good idea ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-3-hear-tswv-yim',
      type: 'hear',
      hmong: 'Tswv yim',
      english: 'idea / plan',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-tswv-yim',
      type: 'say',
      hmong: 'Tswv yim',
      english: 'idea / plan',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-hear-tswv-yim-zoo',
      type: 'hear',
      hmong: 'Tswv yim zoo',
      english: 'Good idea',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-tswv-yim-zoo',
      type: 'say',
      hmong: 'Tswv yim zoo',
      english: 'Good idea',
      audio: '',
    },

    // ══ SET 6 — Good luck ══════════════════════════════
    {
      id: 'speak-lesson-everyday-short-3-hear-hmoov',
      type: 'hear',
      hmong: 'Hmoov',
      english: 'luck / fortune',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-hmoov',
      type: 'say',
      hmong: 'Hmoov',
      english: 'luck / fortune',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-hear-hmoov-zoo',
      type: 'hear',
      hmong: 'Hmoov zoo',
      english: 'Good luck',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-say-hmoov-zoo',
      type: 'say',
      hmong: 'Hmoov zoo',
      english: 'Good luck',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-everyday-short-3-recall-yuav-ua-li-cas',
      type: 'recall',
      hmong: 'Yuav ua li cas',
      english: 'What is to be done?',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-recall-koj-puas-yog-dawb',
      type: 'recall',
      hmong: 'Koj puas yog dawb?',
      english: 'Are you White Hmong?',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-recall-tau-zoo-sai-sai',
      type: 'recall',
      hmong: 'Tau zoo sai sai',
      english: 'Get well soon',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-recall-kuv-nres-tsis-tau',
      type: 'recall',
      hmong: 'Kuv nres tsis tau',
      english: 'I cannot stop',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-recall-tswv-yim-zoo',
      type: 'recall',
      hmong: 'Tswv yim zoo',
      english: 'Good idea',
      audio: '',
    },
    {
      id: 'speak-lesson-everyday-short-3-recall-hmoov-zoo',
      type: 'recall',
      hmong: 'Hmoov zoo',
      english: 'Good luck',
      audio: '',
    },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// WHO? — SKELETON, written 2026-09-12.
//
// ⚠️ NO AUDIO. Every step is `audio: ''`, which renders the play button
// disabled ("No recording available") rather than failing silently. Run
// `node scripts/audio-todo.mjs --write` — this lesson's clips are now on that
// checklist, deduped, with the path each file should land at.
//
// ⚠️ THE HMONG IS THE AUTHOR'S OWN LIST, COPIED VERBATIM. The English is a
// DRAFT written from the word annotations beside it — not by a fluent
// speaker, and not from a recording. Every gloss in this lesson needs review
// before it is unlocked. See notes/2026-09-12-speak-lesson-skeletons.md.
//
// ⚠️ 27 STEPS — the file's target is 12-18. Each SET below is
// self-contained, so the split is a cut between two sets. Left whole rather
// than guessing where the author wants the seam.
// ════════════════════════════════════════════════════════════════════════════
const questionsWho = {
  id: 'speak-lesson-questions-who',
  title: 'Who?',
  blurb: 'Leej twg — asking who, six ways.',
  emoji: '❓',
  steps: [
    {
      id: 'speak-lesson-questions-who-topic',
      type: 'intro',
      emoji: '❓',
      title: 'Who?',
      body: [
        'Question words in Hmong often sit at the END of the sentence.',
        'Notice where "leej twg" lands in each one.',
      ],
      duration: '5–10 minutes',
    },

    // ══ SET 1 — Who is asking? ══════════════════════════════
    // The author left this as a template ('Leej twg …. nug?'). Emitted as the simplest complete question it can make.
    {
      id: 'speak-lesson-questions-who-hear-leej-twg',
      type: 'hear',
      hmong: 'Leej twg',
      english: 'who',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-leej-twg',
      type: 'say',
      hmong: 'Leej twg',
      english: 'who',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-hear-nug',
      type: 'hear',
      hmong: 'Nug',
      english: 'to ask',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-nug',
      type: 'say',
      hmong: 'Nug',
      english: 'to ask',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-hear-leej-twg-nug',
      type: 'hear',
      hmong: 'Leej twg nug?',
      english: 'Who is asking?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-leej-twg-nug',
      type: 'say',
      hmong: 'Leej twg nug?',
      english: 'Who is asking?',
      audio: '',
    },

    // ══ SET 2 — Who is next? ══════════════════════════════
    {
      id: 'speak-lesson-questions-who-hear-tom-ntej',
      type: 'hear',
      hmong: 'Tom ntej',
      english: 'next / ahead',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-tom-ntej',
      type: 'say',
      hmong: 'Tom ntej',
      english: 'next / ahead',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-hear-leej-twg-yog-tus-tom-ntej',
      type: 'hear',
      hmong: 'Leej twg yog tus tom ntej?',
      english: 'Who is next?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-leej-twg-yog-tus-tom-ntej',
      type: 'say',
      hmong: 'Leej twg yog tus tom ntej?',
      english: 'Who is next?',
      audio: '',
    },

    // ══ SET 3 — Who is he? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-questions-who-hear-nws-yog-leej-twg',
      type: 'hear',
      hmong: 'Nws yog leej twg?',
      english: 'Who is he?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-nws-yog-leej-twg',
      type: 'say',
      hmong: 'Nws yog leej twg?',
      english: 'Who is he?',
      audio: '',
    },

    // ══ SET 4 — Who is that man? ══════════════════════════════
    {
      id: 'speak-lesson-questions-who-hear-txiv-neej',
      type: 'hear',
      hmong: 'Txiv neej',
      english: 'man',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-txiv-neej',
      type: 'say',
      hmong: 'Txiv neej',
      english: 'man',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-hear-tus-txiv-neej-ntawd-yog-leej-twg',
      type: 'hear',
      hmong: 'Tus txiv neej ntawd yog leej twg?',
      english: 'Who is that man?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-tus-txiv-neej-ntawd-yog-leej-twg',
      type: 'say',
      hmong: 'Tus txiv neej ntawd yog leej twg?',
      english: 'Who is that man?',
      audio: '',
    },

    // ══ SET 5 — Who did it? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-questions-who-hear-leej-twg-ua-nws',
      type: 'hear',
      hmong: 'Leej twg ua nws?',
      english: 'Who did it?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-leej-twg-ua-nws',
      type: 'say',
      hmong: 'Leej twg ua nws?',
      english: 'Who did it?',
      audio: '',
    },

    // ══ SET 6 — Who are you? ══════════════════════════════
    // No new words — built entirely from pieces taught above.
    {
      id: 'speak-lesson-questions-who-hear-koj-yog-leej-twg',
      type: 'hear',
      hmong: 'Koj yog leej twg?',
      english: 'Who are you?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-say-koj-yog-leej-twg',
      type: 'say',
      hmong: 'Koj yog leej twg?',
      english: 'Who are you?',
      audio: '',
    },

    // ── Recall block ────────────────────────────────────────────────────────
    // ⚠️ PHRASES ONLY, and this is a deliberate shortfall. The three finished
    // lessons recall each WORD before the phrase it builds; doing that here
    // would put this lesson past 50 steps. Expanding the recall block is the
    // next pass, once the author has cut these into lesson-sized pieces.
    {
      id: 'speak-lesson-questions-who-recall-leej-twg-nug',
      type: 'recall',
      hmong: 'Leej twg nug?',
      english: 'Who is asking?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-recall-leej-twg-yog-tus-tom-ntej',
      type: 'recall',
      hmong: 'Leej twg yog tus tom ntej?',
      english: 'Who is next?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-recall-nws-yog-leej-twg',
      type: 'recall',
      hmong: 'Nws yog leej twg?',
      english: 'Who is he?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-recall-tus-txiv-neej-ntawd-yog-leej-twg',
      type: 'recall',
      hmong: 'Tus txiv neej ntawd yog leej twg?',
      english: 'Who is that man?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-recall-leej-twg-ua-nws',
      type: 'recall',
      hmong: 'Leej twg ua nws?',
      english: 'Who did it?',
      audio: '',
    },
    {
      id: 'speak-lesson-questions-who-recall-koj-yog-leej-twg',
      type: 'recall',
      hmong: 'Koj yog leej twg?',
      english: 'Who are you?',
      audio: '',
    },
  ],
}

// ⚠️ PLACEHOLDER LESSON FACTORY — remove when the real lessons land.
//
// A lesson shell with one intro step: enough for lessonProgress() and the
// category screen to render honestly, and deliberately NOT enough to look
// finished. No audio, so it cannot be mistaken for real content and it does not
// register in scripts/check-lesson-audio.mjs coverage.
// ⚠️ RETIRED 2026-09-12 — every category now holds real lesson structure, so
// nothing calls this. Commented out rather than deleted: the next batch of
// planned-but-unwritten lessons will want it again, and an unused function is
// an eslint warning that someone eventually "fixes" by deleting.
//
// function ph(id, title, blurb) {
//   return {
//     id: `speak-lesson-${id}`,
//     title,
//     blurb,
//     emoji: '🔒',
//     steps: [
//       {
//         id: `speak-lesson-${id}-placeholder`,
//         type: 'intro',
//         title,
//         body: ['This lesson has not been written yet.'],
//       },
//     ],
//   }
// }

// ── CATEGORIES ──────────────────────────────────────────────────────────────
// Lessons are grouped into CATEGORIES and numbered CONTINUOUSLY across the whole
// course — Lesson 1..N, not 1..n restarting per category:
//
//   Greetings           Lesson 1   Greetings
//                       Lesson 2   Farewells
//                       Lesson 3   Thanks & Sorry
//   Asking the price    Lesson 4   Asking how much?
//                       Lesson 5   …
//
// Built for ~200 lessons. The Conversations tab lists CATEGORIES; tapping one
// enters /speak/category/[categoryId] for its lesson list. A flat list of 200
// cards is not a screen anyone can use.
//
// ⚠️ ORDER IS THE CONTRACT. A lesson's number is its position in this array once
// flattened. There is deliberately NO `number` field to keep in sync — a hand-
// written number and an array position WILL drift. Reordering renumbers, which
// is correct: the number means "how far into the course", not identity.
// Use `id` for identity, always.
export const speakCategories = [
  {
    id: 'cat-greetings',
    title: 'Greetings',
    blurb: 'Say hello, ask how someone is, and part well.',
    emoji: '👋',
    // ⚠️ THE FREE HOOK. Every lesson in a `free` category is exempt from BOTH
    // the Pro lock and the daily quota. Today that is lessons 1–3 — which is
    // what "free through lesson 3" means — but the flag lives on the CATEGORY,
    // so adding a fourth greetings lesson keeps it free automatically rather
    // than silently falling off a hardcoded cliff.
    free: true,
    lessons: [greetings, farewells, politeness],
  },

  // ⚠️ SKELETONS FROM HERE DOWN — 2026-09-12. Real structure, real Hmong, NO
  // audio and unreviewed English. They were `ph()` shells until this date.
  //
  // No `free` flag on any category below, so every lesson derives tier:'pro'
  // and is locked for a non-Pro account. Toggle with Account → dev → Force Free
  // / Force Pro.
  //
  // ⚠️ THE LOCK IS DOING REAL WORK RIGHT NOW. These lessons cannot be practised
  // — no clip means no model to imitate and nothing to score against — so a
  // paying subscriber must not reach them in this state. Either they stay
  // locked until recorded, or `MONETIZATION_ENABLED` stays false. See the
  // "seven stub lessons behind the Pro lock" item in notes/TODO.md, which this
  // changes from seven stubs to eighteen skeletons.
  {
    id: 'cat-price',
    title: 'Asking the price',
    blurb: 'Shop, ask how much, and talk numbers.',
    emoji: '💰',
    lessons: [priceHowMuch, priceTooMuch, priceNumbers],
  },
  {
    id: 'cat-family',
    title: 'Family',
    blurb: 'Introduce your family, and ask who someone lives with.',
    emoji: '👨‍👩‍👧',
    lessons: [familyMembers, familyYours],
  },
  {
    id: 'cat-food',
    title: 'Food & eating',
    blurb: 'Order, offer, accept, and say what you like.',
    emoji: '🍚',
    lessons: [foodHungry, foodOrdering, foodFoodstuff, foodOffer, foodHelp],
  },
  {
    id: 'cat-understanding',
    title: 'Understanding Hmong',
    blurb: 'What to say when you did not follow.',
    emoji: '🗣️',
    lessons: [understandingHmong],
  },
  {
    id: 'cat-everyday',
    title: 'Everyday phrases',
    blurb: 'Short replies, what is happening now, yes and no.',
    emoji: '💬',
    lessons: [
      everydayShort1,
      everydayCurrently,
      everydayYesNo,
      everydayRomance,
      everydayShort2,
      everydayShort3,
    ],
  },
  {
    id: 'cat-questions',
    title: 'Questions',
    blurb: 'Asking who — and where the question word goes.',
    emoji: '❓',
    lessons: [questionsWho],
  },
]

/**
 * Every lesson, flattened in course order, each stamped with:
 *
 *   number      1-based position across the WHOLE course
 *   categoryId  the category it belongs to
 *   free        inherited from the category
 *   tier        'pro' for anything outside a free category
 *
 * ⚠️ GATING IS DERIVED, never hand-written on a lesson. A lesson carrying its
 * own `free`/`tier` would silently disagree with its category — so these two
 * fields are overwritten here on purpose, not merged.
 */
export const speakLessons = speakCategories
  .flatMap((cat) =>
    cat.lessons.map((lesson) => {
      // A lesson is free only if its category is free AND it has not opted out.
      // See the note on `pro` in the politeness lesson: the override restricts,
      // it never grants.
      const free = Boolean(cat.free) && !lesson.pro
      return {
        ...lesson,
        categoryId: cat.id,
        free,
        tier: free ? undefined : 'pro',
      }
    })
  )
  .map((lesson, i) => ({ ...lesson, number: i + 1, ready: lessonIsReady(lesson) }))

/**
 * Is this lesson finished enough to put in front of a learner?
 *
 * ⚠️ DERIVED FROM THE AUDIO, NOT A HAND-SET FLAG. A `ready: true` field would be
 * one more thing to forget: the 18 skeletons written on 2026-09-12 are complete
 * in every way except the recordings, so the recordings are the honest test.
 * Wire the last clip and the lesson appears; there is no second step to miss.
 *
 * ⚠️ INTRO STEPS ARE EXEMPT. An intro card is text by design and has no `audio`
 * field — requiring one would mark every lesson in the course unready forever.
 *
 * A lesson with NO steps is not ready either, which `.every()` would call true:
 * hence the length check.
 */
function lessonIsReady(lesson) {
  const steps = lesson.steps || []
  if (steps.length === 0) return false
  return steps.every((s) => s.type === 'intro' || Boolean(s.audio))
}

/** How many lessons are free, for copy like "first N free". Derived, not typed. */
export const FREE_LESSON_COUNT = speakLessons.filter((l) => l.free).length

export function getSpeakCategory(id) {
  return speakCategories.find((c) => c.id === id) || null
}

/** A category's lessons, already numbered and gated. */
/**
 * The lessons in a category — READY ONES ONLY unless asked otherwise.
 *
 * ⚠️ THE DEFAULT IS THE SAFE ONE ON PURPOSE. Every caller that forgets to think
 * about this gets the learner-facing answer; only a caller that deliberately
 * passes `includeUnready` sees the silent ones. The reverse default would have
 * shipped a silent lesson the first time somebody added a screen.
 *
 * This also makes `categoryProgress` count what the learner can actually see —
 * a category reading "0/5" when two of the five are invisible is a lie about how
 * much is left.
 */
export function categoryLessons(categoryId, { includeUnready = false } = {}) {
  return speakLessons.filter(
    (l) => l.categoryId === categoryId && (includeUnready || l.ready)
  )
}

/**
 * Categories worth showing. A category whose lessons are all unrecorded is an
 * empty room — it renders a card, opens, and shows nothing.
 */
export function visibleSpeakCategories({ includeUnready = false } = {}) {
  if (includeUnready) return speakCategories
  return speakCategories.filter((c) => categoryLessons(c.id).length > 0)
}

/** Progress across a whole category, for its card on the Conversations tab. */
export function categoryProgress(categoryId, completedSteps = []) {
  const lessons = categoryLessons(categoryId)
  const total = lessons.length
  const done = lessons.filter((l) => {
    const p = lessonProgress(l, completedSteps)
    return p.total > 0 && p.done === p.total
  }).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

/** The lesson AFTER this one, for the finish modal. null at the end of the list. */
export function getNextLesson(id) {
  const i = speakLessons.findIndex((l) => l.id === id)
  if (i < 0) return null
  // ⚠️ SKIPS UNREADY LESSONS. This feeds the "lesson complete" modal, which
  // pushes straight into whatever it returns — so without the filter, finishing
  // the last recorded lesson would drop the learner into a silent one, which is
  // the single worst place to send somebody who just did well.
  return speakLessons.slice(i + 1).find((l) => l.ready) || null
}

export function getSpeakLesson(id) {
  return speakLessons.find((l) => l.id === id) || null
}

/** How many of a lesson's steps are in completedSteps. For the list screen. */
export function lessonProgress(lesson, completedSteps = []) {
  const total = lesson?.steps?.length || 0
  if (!total) return { done: 0, total: 0, pct: 0 }
  const done = lesson.steps.filter((s) => completedSteps.includes(s.id)).length
  return { done, total, pct: Math.round((done / total) * 100) }
}
