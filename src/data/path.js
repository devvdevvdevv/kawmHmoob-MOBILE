import { getCategory } from './vocabulary.js'

// THE CURRICULUM SPINE — the ordered beginner path.
//
// Designed in notes/2026-09-20-progressive-unlock-design.md, built
// 2026-09-20. This file is the DATA half only: the units, their order, and the
// derivations that say which ones the content can currently support. The
// screens (Home's Continue card, /path, /path/<unitId>) were built 2026-09-22 —
// see "What this file is not" below.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ A UNIT IS NOT A CATEGORY. This is the one architectural decision here, and
// everything else follows from it. A unit REFERENCES one to three categories;
// categories are never locked. Four reasons, all from the design note:
//
//   1. 77 categories is not a path. Many are tiny — `introductions` has 4
//      words, `daily-life` 4, `politeness` 6. A four-word "lesson" cannot carry
//      five steps. Units bundle them without touching vocabulary.js again.
//
//   2. vocabulary.js stays a DICTIONARY. Its 1,351 words serve the reader's
//      long-press, the sentence builder and the Reference tab, all of which
//      need everything visible. A `locked: true` in there would mean the data
//      layer had opinions about curriculum, and Reference would have to fight
//      them.
//
//   3. The pattern already exists twice. CATEGORY_THEMES in vocabulary.js
//      references category ids for display only; `units` in lessons.js wraps
//      lessons into groups. This is the same move.
//
//   4. Reordering stays cheap. Changing `order` reorders the course. Changing a
//      category id would strand saved progress.
//
// ⚠️ PROGRESS MUST KEY ON `unitId`, NEVER ON A CATEGORY ID. This project merges
// and splits categories often (see the "waiting room" note on `misc` in
// vocabulary.js). Keying progress on a category means the next split resets
// somebody's course. The unit ids below are therefore permanent: rename a
// title freely, never an id.
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️ EVERY UNIT CAPS AT 20 WORDS. A unit is a curated slice of a category, not
// the whole of it. Measured 2026-09-20: four of the ten units are over the cap
// (numbers 23, food 38, verbs 28, time 26), and `food` at 38 is not a lesson,
// it is a wordlist. The overflow stays in the category for the Reference tab.
export const UNIT_WORD_CAP = 20

/**
 * The path, in TEACHING order — what a learner is shown.
 *
 * ⚠️ TEACHING ORDER IS NOT BUILD ORDER, and the gap is the whole content plan.
 * Measured 2026-09-20: Greetings is where every language course starts and is
 * the LEAST ready unit here (19 of 20 sentences missing), while Numbers and
 * Classifiers are 100% ready today. So build in readiness order — 3, 5, 8 →
 * 2, 7, 4 → 1, 9 → 6, 10 — and present in this order. `livePath()` below is
 * what makes that possible: a unit appears when its content can carry it, and
 * the learner only ever sees units 1→10.
 *
 * FIELDS
 *   id          permanent; progress keys on it. Never rename.
 *   title       display only; rename freely.
 *   hmongTitle  the unit's name in Hmong, shown above the English on every path
 *               surface (2026-09-23). Display only, like `title`.
 *               ⚠️ ONLY EVER A NAME ALREADY ATTESTED IN THIS REPO, with a comment
 *               saying where it came from. A curriculum's unit names are the most
 *               visible Hmong in the app, and an invented one teaches itself to
 *               every learner who reads it — this is the same rule the 687
 *               unreviewed glosses exist to enforce (notes/TODO.md).
 *               ⚠️ NOT DERIVED FROM THE WORDS. "Colors" is not `xim`: a natural
 *               heading needs the classifier or plural a bare entry does not
 *               carry, and building one from a word IS authoring Hmong.
 *               ⚠️ A UNIT WITHOUT ONE RENDERS ENGLISH ALONE — no placeholder text
 *               for learners. Dev builds mark the gap; see PathList.jsx.
 *               Sources used so far: vocabulary.js category titles, which carry
 *               Hmong for a handful of categories ('Tsev Neeg — Family (Male
 *               Speaker)'). Lesson titles like 'Adjectives | Cov Lus Piav Qhia'
 *               are NOT usable — they carry their own TODO-VERIFY.
 *   order       teaching position. Changing this reorders the course safely.
 *   categories  1–3 category ids from vocabulary.js. Validated by
 *               scripts/check-path.mjs — a typo here would silently produce a
 *               shorter unit, never an error.
 *   limit       trim to this many words. See the ⚠️ on limit vs words below.
 *   words       explicit word ids, in teaching order. BEATS `limit`.
 *   free        outside the paywall.
 *   learnUnit   which Learn-tab unit teaches this material, so the Learn hub can
 *               show the unit beside the lessons that explain it (2026-09-23).
 *               ⚠️ A PLAIN STRING ON PURPOSE — path.js must never import
 *               lessons.js: this file is loaded by plain-Node check scripts, and
 *               lessons.js pulls in .jsx. An id that matches no Learn unit is
 *               simply not shown there, never an error. Omit it when no Learn
 *               unit genuinely teaches the unit (Family and Food have no lesson);
 *               those units still appear in full on /path.
 *   introLesson the Learn LESSON whose `intro` step introduces this subject. The
 *               unit screen shows it above the first step (2026-09-23), so a
 *               learner reads what the words are before drilling them.
 *               ⚠️ A LESSON ID, HAND-PICKED, and a string for the same reason as
 *               learnUnit. It is NOT derived from `categories`: a lesson's
 *               `vocab` field matches only some of them (grammar-adjectives is
 *               `vocab: 'descriptions'` yet introduces Colors & Describing), and
 *               derivation would find one of three for Greetings.
 *               ⚠️ NOT EVERY UNIT HAS ONE — Family and Food have no lesson that
 *               introduces them, so their unit screen simply starts at
 *               Flashcards. An id matching no lesson is treated the same way.
 *               ⚠️ DO NOT "FIX" AN ID THAT LOOKS WRONG. `foundations-pronouns`
 *               lives in the Grammar unit despite its name; ids are progress
 *               keys, and renaming one wipes that lesson's progress for everyone.
 *   blurb       one line, shown on the path row.
 *   why         why the unit sits at this position — kept in the data because
 *               the ordering argument is the part that gets lost first.
 */
//
// ⚠️ GRAMMAR FIRST — the author's ruling, 2026-09-25. Classifiers, pronouns,
// verbs and conjunctions are the primary sets the path pushes, so they run
// straight after Greetings: 1 Greetings · 2 You & Me · 3 Core Verbs ·
// 4 Classifiers · 5 Joining Words · 6 Questions, then the topic units.
// Pronoun + verb is the first sentence ("Kuv noj"), classifiers give it nouns,
// conjunctions join two, and questions reuse all four (lub twg needs a
// classifier). Greetings stays first: it is tiny, free, and a first exchange.
//
// ⚠️ `free` WAS NOT MOVED. It is still Greetings + You & Me, so a free learner's
// wall is now in front of Core Verbs rather than Numbers. That is a pricing
// decision, deliberately left to the author.
//
// Safe for anyone mid-course: unlocking is positional and progress keys on
// unitId, so a finished unit stays finished wherever it now sits.
export const path = [
  {
    id: 'u-greetings',
    title: 'Greetings',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: the greeting itself — vocabulary 'nyob zoo'. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Nyob Zoo',
    order: 1,
    learnUnit: 'conversational',  // Greetings & Farewells, Politeness, Introductions
    introLesson: 'vocab-greetings-farewells',  // "Saying hello and goodbye"
    categories: ['greetings', 'politeness', 'introductions'],
    free: true,
    blurb: 'Nyob zoo, ua tsaug — your first real exchange.',
    why: 'First conversation. Free, so it sets the tone for the whole app.',
  },
  {
    id: 'u-pronouns',
    title: 'You & Me',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: 'you and me' — vocabulary 'koj', 'thiab', 'kuv'. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Koj thiab Kuv',
    order: 2,
    learnUnit: 'grammar',  // Pronouns, Demonstratives, Possessives, Yog — To Be
    introLesson: 'foundations-pronouns',  // "How Hmong pronouns work"
    // 'yog-to-be' moved to its own unit, u-yog (2026-09-27). Was: ['pronouns', 'yog-to-be']
    categories: ['pronouns'],
    free: true,
    blurb: 'Kuv yog… — the first complete sentence.',
    // Hmong marks a DUAL (wb, neb, nkawd — exactly two), which English has no
    // word for. Meeting it in unit 2 rather than discovering it later is the
    // reason this unit sits above Family: Family is the payoff for this one.
    // (Was "unit 4 is the payoff" — Family moved to 8 in the 2026-09-25 reorder.)
    why: 'The first full sentence, and the dual pronouns surprise English speakers early.',
  },
  {
    id: 'u-yog',
    // Was 'To Be: Yog & Nyob' / 'Yog thiab Nyob' — nyob split out to u-nyob, 2026-09-28.
    title: 'To Be: Yog',
    hmongTitle: 'Yog',
    order: 8,  // was 7 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "need a path for … yog … I can't believe we didn't have
    // it"). Right after You & Me: kuv yog, koj yog… The author's frame: yog = what
    // something IS (essence, lasting); nyob = where it is, or its condition right now.
    learnUnit: 'grammar',
    introLesson: 'foundations-yog-to-be',
    categories: ['yog-to-be'],
    // The yog cards only (2026-09-28); the nyob ones are u-nyob's. Same set, split by list.
    words: [
      'yog-to-be-is', 'yog-to-be-i-am', 'yog-to-be-you-are', 'yog-to-be-he-she-is',
      'yog-to-be-is-not', 'yog-to-be-question', 'yog-pattern-essence', 'yog-pattern-describe', 'yog-pattern-muaj-age',
      // 'yog-li' moved to u-so-then, 2026-09-28.
      'yog-tias', 'yog-lawm',
      'yog-los-yog',  // or — 2026-09-28 (author: add los yog to yog, stated as "or")
    ],
    // The builder drills only sentences with yog in them (author, 2026-09-28). See
    // sentencesMustInclude in sentenceBuilder.js.
    sentencesMustInclude: ['yog'],
    free: true,
    // Was: 'Kuv yog Hmoob, kuv nyob hauv tsev — what you are, and where and how you are.'
    blurb: 'Kuv yog Hmoob — what something is. The first of three ways to say “to be”.',
    why: 'English has one "to be"; Hmong splits it three ways: yog for what something is, hu ua for what it is called, nyob for where and how it is.',
  },
  {
    id: 'u-hu-ua',
    // Was 'Names: Hu Ua' — retitled 2026-09-28 to sit beside To Be: Yog and To Be: Nyob.
    title: 'To Be Called: Hu Ua',
    hmongTitle: 'Hu Ua',
    order: 9,  // was 8 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: a path for hu ua). Right after Yog: a clan name takes
    // yog (kuv lub xeem yog Vaj), a given name takes hu ua (kuv lub npe hu ua Chai).
    learnUnit: 'grammar',
    introLesson: 'grammar-hu-ua',
    categories: ['names'],
    free: true,
    blurb: 'Kuv lub npe hu ua Chai — your name, your clan name, and what things are called.',
    why: 'Names are introduced with hu ua, clan names with yog — a cultural distinction as much as a grammatical one.',
  },
  {
    id: 'u-nyob',
    title: 'To Be: Nyob',
    hmongTitle: 'Nyob',
    order: 10,  // was 9 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author: "separate nyob and yog paths, two separate concepts, but
    // maintain that to be is similar between them including hu ua"). Yog → Hu Ua → Nyob:
    // the three "to be" units sit together, and each lesson opens with the same frame.
    learnUnit: 'grammar',
    introLesson: 'grammar-nyob',
    categories: ['yog-to-be'],
    words: [
      'yog-to-be-located', 'yog-pattern-nyob-place', 'yog-pattern-nyob-state', 'yog-pattern-feeling',
      'yog-nyob-li-cas',
    ],
    free: true,
    blurb: 'Kuv nyob hauv tsev, kuv nyob kub — where you are, and how you are right now.',
    why: 'The third way to say “to be”: yog is what something is, nyob is where it is or how it is at the moment.',
  },
  {
    id: 'u-numbers',
    title: 'Numbers',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: ⚠️ 'lej' (number) is NOT in vocabulary.js — the least certain name here. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Cov Lej',
    order: 28,  // was 27 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'numbers-and-time',  // Numbers, How Much?
    introLesson: 'numbers-counting',  // "Counting in Hmong"
    categories: ['numbers'],
    limit: UNIT_WORD_CAP, // 23 words in the category
    blurb: 'Counting, age, and price.',
    why: 'Age, price, quantity. 100% content-ready as of 2026-09-20 — build first.',
  },
  {
    id: 'u-money',
    title: 'How Much? & Money',
    hmongTitle: 'Pes Tsawg?',  // the unit's own question word
    order: 29,  // was 28 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "a path for asking how much and money words"). Right after
    // Numbers: a price is a number. The Money set had no unit until now.
    learnUnit: 'numbers-and-time',
    introLesson: 'numbers-how-much',
    categories: ['money'],
    blurb: 'Yog pes tsawg? Kim npaum li cas? — prices, dollars, cheap and expensive.',
    why: 'The question you will use in every market, and the words around it.',
  },
  {
    id: 'u-family',
    title: 'Family',
    // The one unit with a Hmong name already attested in this repo: the two
    // family categories are titled 'Tsev Neeg — Family (Male Speaker)' and
    // '… (Female Speaker)' in vocabulary.js. Copied, not composed.
    hmongTitle: 'Tsev Neeg',
    order: 30,  // was 29 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    introLesson: 'placeholder-family',  // PLACEHOLDER lesson, 2026-09-28 — lessons/placeholders.js
    categories: ['family-male-perspective'],
    // ⚠️ ONE PERSPECTIVE ONLY. The vocabulary splits family terms by the
    // speaker's gender (family-male-perspective / family-female-perspective)
    // because Hmong kinship genuinely does. That split is a SECOND PASS, not a
    // beginner's problem — teaching both here doubles the unit and teaches the
    // exception before the rule.
    blurb: 'Niam, txiv, kwv tij — and whose they are.',
    why: 'Culturally central, and the payoff for unit 2’s pronouns.',
  },
  {
    id: 'u-classifiers',
    title: 'Classifiers',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: the unit's own blurb — three attested classifiers, no invented grammar term. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Tus, Lub, Daim',
    order: 3,  // was 8 — fundamentals first (author), 2026-09-28
    learnUnit: 'grammar',  // Noun Classifiers
    introLesson: 'foundations-noun-classifiers',  // "How noun classifiers work"
    categories: ['classifiers'],
    // ⚠️ FREE — the author's ruling, 2026-09-25: "the fundamentals always free".
    // The whole grammar core (units 1–6) sits in front of the paywall.
    free: true,
    blurb: 'Tus, lub, daim — the word that has to come first.',
    why: 'The grammatical spine. Must land before nouns pile up. 100% ready.',
  },
  {
    id: 'u-common-nouns',
    title: 'Common Nouns',
    hmongTitle: 'Neeg, Tsev, Ntawv',
    order: 4,
    // Added 2026-09-28 (author: "build common nouns … aim so that it aims for specific classifiers
    // … in the example sentence include the classifier"). Right after Classifiers: the same
    // classifiers, now with everyday nouns. Its own (placeholder) lesson since 2026-09-28 —
    // was introLesson: 'foundations-noun-classifiers', which Classifiers also opens with.
    learnUnit: 'conversational',
    introLesson: 'placeholder-common-nouns',
    categories: ['common-nouns'],
    free: true,
    blurb: 'Ib leej neeg, ib lub tsev, ib pob zeb — everyday nouns and the classifier each one takes.',
    why: 'Classifiers only make sense with nouns to count. Each word here is chosen for its classifier.',
  },
  {
    id: 'u-noun-purpose',
    title: 'Nouns by Purpose',
    hmongTitle: 'Phau Ntawv Nyeem',
    order: 24,  // was 23 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author: given verbs after a noun say what it is for — phau ntawv nyeem,
    // phau ntawv kawm, lub rooj noj mov; buildings and occupations use it most). After
    // Classifiers, because the classifier stays in front (lub rooj noj mov, rab riam txiav nqaij).
    learnUnit: 'grammar',
    introLesson: 'grammar-noun-purpose',
    // The extra categories only let the explicit list reach the borrowed cards (rooj noj
    // mov, the three tsev, chav pw, kws kho mob, kws txiav txim) — the unit is the list.
    categories: ['noun-purpose', 'buildings', 'household-rooms'],  // rooj noj mov, kws kho mob, kws txiav txim moved INTO noun-purpose
    words: [
      'np-pattern', 'np-phau-ntawv-nyeem', 'np-phau-ntawv-kawm', 'np-riam-txiav-zaub', 'np-riam-txiav-nqaij',
      'phr-rooj-noj-mov', 'np-rooj-sau-ntawv',
      'bld-tsev-noj-mov', 'bld-tsev-kho-mob', 'bld-tsev-kawm-ntawv',
      'rooms-chav-pw', 'np-chav-ua-noj', 'np-chav-da-dej', 'np-dej-haus', 'np-txaj-pw',
      'phr-kws-kho-mob', 'np-kws-qhia-ntawv', 'phr-tus-kws-txiav-txim', 'np-tsav-tsheb',
    ],
    free: true,
    blurb: 'Phau ntawv nyeem, phau ntawv kawm — a verb after the noun says which one.',
    why: 'How Hmong names buildings, jobs and tools: tsev kho mob is a hospital, kws kho mob a doctor.',
  },
  {
    // ⚠️ ADDED 2026-09-25 — the author's ruling that the grammar core
    // (pronouns, verbs, classifiers, conjunctions) is what the path pushes
    // first. `conjunctions` is 100% sentence-ready, fully recorded and reviewed.
    id: 'u-conjunctions',
    title: 'Joining Words',
    // From the Learn lesson's own title, 'Conjunctions | Cov Lus Txuas' — which
    // carries a TODO-VERIFY there, so this does too.
    hmongTitle: 'Cov Lus Txuas',
    order: 13,  // was 12 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'grammar',  // Question Words, Conjunctions
    introLesson: 'grammar-conjunctions',  // "Conjunctions | Cov Lus Txuas"
    categories: ['conjunctions'],
    // ⚠️ FREE — the author's ruling, 2026-09-25: "the fundamentals always free".
    // The whole grammar core (units 1–6) sits in front of the paywall.
    free: true,
    blurb: 'Thiab, tiamsis, vim, yog — from one clause to two.',
    // why was '… Right after Classifiers, …' — sorted by relevancy 2026-09-28.
    why: 'Turns single sentences into real speech. After Classifiers, This & That and Mine & Yours, so the clauses it joins already have nouns in them.',
    // Curated 20 of 24, beginner utility first. Left in the category for
    // Reference: ib tsam, tsis tas li ntawd, cia (a verb, "to let"), hos.
    words: [
      'conjunctions-and',         'conjunctions-with',          'conjunctions-but',
      'conjunctions-or',          'conjunctions-or-short',      'conjunctions-because-short',
      'conjunctions-because',     'conjunctions-then',          'conjunctions-if-short',
      'conjunctions-if',          'conjunctions-so-that',       'conjunctions-that-quotative',
      'conjunctions-that-short',  'conjunctions-that-relative', 'conjunctions-to-for',
      'conjunctions-about',       'conjunctions-to-see-if',     'conjunctions-maybe',
      'conjunctions-only',        'conjunctions-even-though',
    ],
  },
  {
    id: 'u-rau',
    title: 'Rau: Six, To, Put & Wear',  // was 'Rau: Six, To & Wear' (2026-09-27)
    hmongTitle: 'Rau',
    order: 14,  // was 13 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "rau is like the most common Hmong conjunction … move this path
    // closer to the top"). Right after Joining Words, where rau (to, for) first appears.
    learnUnit: 'grammar',
    introLesson: 'grammar-rau',
    categories: ['rau-uses'],
    free: true,
    // Was: 'Six, to / for, or putting on shoes — one word, three meanings.' (2026-09-27)
    blurb: 'Six, to / for, put / apply, toward, and putting on shoes — one word, read by context.',
    why: 'The most common small word learners confuse. Its place in the sentence, and the context, tell you which rau it is.',
  },
  {
    id: 'u-so-then',
    title: 'So, Then & Therefore',
    hmongTitle: 'Yog Li, Thiaj Li, Ces',
    order: 25,  // was 24 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author: a path for yog li, thiaj, ces, txawm — "extremely similar but
    // context based"; "different from the other conjunctions"). Right behind Joining Words and
    // Rau. ⚠️ Its sentence builder hands out the OTHER so-words as decoy chips (DECOY_WORDS in
    // sentenceBuilder.js) — the author asked for it to be hard.
    learnUnit: 'grammar',
    introLesson: 'grammar-so-then',
    categories: ['so-then'],
    free: true,
    blurb: 'Yog li, thiaj li, ces, txawm — four ways to say “so”, and how to pick the right one.',
    why: 'They all translate as “so”. Only the context — a soft reaction, a real therefore, a then, a sudden so — tells you which.',
  },
  {
    // ⚠️ ADDED 2026-09-25 — the interrogatives module. See the block comment on
    // the new entries in the `question-words` category.
    id: 'u-questions',
    title: 'Questions',
    // 'lus nug' (a question) is attested in story-kev-hloov-pauv-lub-xeev-siab,
    // ¶4: "Txoj lus nug no…". 'Cov' makes it plural, as with 'Cov Xim'.
    hmongTitle: 'Cov Lus Nug',
    order: 15,  // was 14 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Was 'grammar' — the Asking Questions Learn unit exists now (2026-09-25),
    // so the Learn hub shows this path unit beside its own lessons.
    learnUnit: 'questions',
    introLesson: 'grammar-question-words',  // "Asking questions in Hmong"
    categories: ['question-words'],
    // ⚠️ FREE — the author's ruling, 2026-09-25: "the fundamentals always free".
    // The whole grammar core (units 1–6) sits in front of the paywall.
    free: true,
    blurb: 'Dab tsi, leej twg, lub twg, puas — asking anything.',
    why: 'After Classifiers on purpose: "which one" is lub twg / tus twg, so it needs the classifier already learned.',
  },

  // ══ MORE GRAMMAR CORE — units 7–12, added 2026-09-25 ════════════════════════
  // The author: "add some more paths … relevant to core Hmong grammar,
  // functionality or relevant Hmong speak." Each is built from a vocabulary set
  // where EVERY word already has an example sentence, so each goes live at once.
  //
  // ⚠️ APPENDED AFTER QUESTIONS, NOT WOVEN INTO 1–6. Unlocking is positional, so
  // a unit inserted between two a learner has finished makes them go back for
  // it. Placed here, nobody's progress through 1–6 changes; the topic units
  // simply move down.
  //
  // ⚠️ ALL FREE — grammar is never Pro (the "fundamentals always free" ruling).
  // Their sets were added to FREE_CATEGORY_IDS in lib/vocabAccess.js to match.
  //
  // ⚠️ hmongTitle: each is built only from the unit's own headwords (the
  // 'Tus, Lub, Daim' pattern), or a title already attested in the repo — never
  // a composed grammar term.
  {
    id: 'u-tense',
    // Was: 'Time Markers & Not' — tsis moved to its own unit, u-negation (2026-09-26).
    title: 'Time Markers',
    hmongTitle: 'Tau, Yuav, Lawm',  // three of the unit's own headwords
    order: 16,  // was 15 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'grammar',  // Actions and Time
    introLesson: 'foundations-tense-markers',
    // + 'time-context' (2026-09-26): mam li, tab tom yuav, nyuam qhuav — markers the
    // rewritten lesson teaches. Was: ['tense-markers', 'grammar']
    categories: ['tense-markers', 'grammar', 'time-context'],
    free: true,
    // Was: '…lawm, tsis — when it happens, and when it doesn’t.', then
    // 'Tab tom, yuav, tau, lawm, tseem — when it happens.' (until 2026-09-26)
    blurb: 'Tab tom, yuav, mam li, tau, lawm, tseem — right now, later, done, still.',
    why: 'Hmong verbs never change form; these small words carry all the time. Negation follows in its own unit, u-negation.',
    // Curated: `grammar-still` (tseem) is left out — it duplicates
    // `tense-markers-still`, and the same word twice in one deck would look
    // like a bug.
    words: [
      // In the lesson's order: now → later → about to → done → already → just → still.
      'tense-markers-progressive', 'tense-markers-future', 'time-context-mam-li',
      'time-context-tabtom-yuav',  'tense-markers-past',   'tense-markers-completed',
      'grammar-already',           'time-context-nyuam-qhuav', 'tense-markers-still',
      // Tense patterns, 2026-09-28 (author) — past, present, future, one card per form.
      'tense-pattern-naghmo', 'tense-pattern-tau-verb', 'tense-pattern-past-continuous',
      'tense-pattern-present', 'tense-pattern-twb-lawm', 'tense-pattern-tab-tom',
      'tense-pattern-tagkis', 'tense-pattern-yuav', 'tense-pattern-mam-li', 'tense-pattern-tab-tom-yuav',
      // 'grammar-not' (tsis) — moved to u-negation 2026-09-26, so it is not taught twice.
      // 'grammar-very' (heev, "very") — REMOVED 2026-09-26 (author: the unit had
      // "intensifiers that are not supposed to be there"). heev describes; it marks no
      // time. It stays in the dictionary and the `grammar` set.
    ],
  },
  {
    id: 'u-tau',
    title: 'Did, Got & Can',
    hmongTitle: 'Tau',  // the unit's one word
    order: 17,  // was 16 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-26 (author: tau "is one of the most common words"). Right after
    // Time Markers, where tau first appears, and before Not & Don’t, which uses
    // tsis tau. Lesson: grammar-tau (src/data/lessons/tau.js).
    learnUnit: 'grammar',
    introLesson: 'grammar-tau',
    categories: ['tau-uses'],  // the PATTERN cards: flashcards + quiz
    // Reading + sentence builder use the 14 real-word examples instead (unitExampleWords).
    exampleSets: ['tau-examples'],
    // ⚠️ FREE — grammar core (memory: fundamentals always free).
    free: true,
    blurb: 'Tau — did, got, can, and for how long. Where it sits changes what it means.',
    why: 'The most common small word in the language, and the one word order changes most: tau noj is ate, noj tau is was able to eat.',
    // ⚠️ ONLY ITS OWN SET. The base card `tau` (tense-markers-past, in Time Markers)
    // and `tsis tau` (neg-tsis-tau, in Not & Don’t) were listed here too, and
    // check-path rejects a word in two units — it double-counts progress ("I already
    // learned this"). They stay in their own units; the lesson still teaches both.
    // Was: categories ['tau-uses', 'tense-markers', 'negation'] + a words list
    // starting 'tense-markers-past' and ending 'neg-tsis-tau'.
  },
  {
    // ⚠️ ADDED 2026-09-26 — the author: "ADD ANOTHER path specifically for the
    // tsis, don't". Placed right after Time Markers: negation sits in the same
    // pre-verb slot, so it is the natural next step. Free — grammar (the
    // fundamentals-always-free ruling). Backed by the `negation` set, whose
    // examples are all sentences already in vocabulary.js (5 human-written).
    // Was: no introLesson (the Writing placeholders are unshipped). Now it has
    // grammar-tsis-negation, written 2026-09-26 on the author's own framing.
    id: 'u-negation',
    title: 'Not & Don’t',
    hmongTitle: 'Tsis thiab Tsis Txhob',  // the unit's own headwords + 'thiab'
    order: 18,  // was 17 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // The Learn lesson written for this unit, 2026-09-26 — its intro shows on the
    // unit screen, and "Read the full lesson" returns here (?fromUnit).
    learnUnit: 'grammar',
    introLesson: 'grammar-tsis-negation',
    categories: ['negation'],
    free: true,
    blurb: 'Tsis, tsis txhob — no, not, and don’t.',
    why: 'Just after Time Markers: tsis sits in the same slot before the verb. And the rule every learner trips on — it is always tsis txhob, never txhob tsis.',
  },
  {
    id: 'u-answers',
    title: 'Answering & Agreeing',
    hmongTitle: 'Aws thiab Yog',
    order: 19,  // was 18 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "directly after the tsis and tsis txhob, and then the
    // interrogatives path, we need affirmation"). No literal yes: yog, aws, and answers that
    // put the reply where the question word was.
    learnUnit: 'grammar',
    introLesson: 'grammar-answering',
    categories: ['answering'],
    free: true,
    blurb: 'Aws, yog — and answering in the question\'s own words.',
    why: 'Hmong has no word for yes: you answer by putting your answer where the question word was.',
  },
  {
    id: 'u-this-that',
    title: 'This & That',
    hmongTitle: 'No, Ntawd, Ko',  // the unit's own three headwords
    order: 11,  // was 10 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'grammar',  // Who You Are Talking About
    introLesson: 'foundations-pronouns-demonstratives',
    categories: ['demonstratives'],
    free: true,
    blurb: 'No, ntawd, ko — this, that, and that over there.',
    // why was 'Right after Classifiers and Questions: …' — sorted by relevancy 2026-09-28.
    why: 'After Classifiers: "tus aub no" (this dog) is classifier + noun + demonstrative.',
  },
  {
    id: 'u-possession',
    title: 'Mine & Yours',
    hmongTitle: 'Kuv Li',  // the unit's own headwords (kuv + li — the author's "kuv li")
    order: 12,  // was 11 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: possession "should be its own lesson and path"). Right
    // after This & That, which teaches a classifier standing in for its noun — the
    // same move that makes kuv phau (mine) work. Lesson: foundations-possessive-pronouns.
    learnUnit: 'grammar',
    introLesson: 'foundations-possessive-pronouns',
    categories: ['possession'],
    // ⚠️ FREE — grammar core (memory: fundamentals always free).
    free: true,
    blurb: 'Kuv li, kuv phau, kuv phau ntawv — mine, and my book.',
    why: 'Possession is classifiers again: kuv phau ntawv (my book), kuv phau (mine), and li for any noun (kuv li).',
  },
  {
    id: 'u-adjectives',
    title: 'Describing Words',
    hmongTitle: 'Neeg Zoo',  // the author's own example (a good person — noun + adjective)
    order: 20,  // was 19 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "need a path for adjectives, this one is important"). After
    // This & That and Mine & Yours: a full noun phrase is classifier + noun + adjective +
    // demonstrative, so those come first. Pattern cards: noun + adjective, very / too /
    // more / most, feelings with siab.
    learnUnit: 'grammar',
    introLesson: 'grammar-adjectives',
    categories: ['adjective-grammar'],
    free: true,
    blurb: 'Neeg zoo — noun first, then the adjective; and very, too, more, most.',
    why: 'Hmong adjectives follow the noun and act as verbs — no yog. Backwards from English, and everywhere.',
  },
  {
    id: 'u-adjective-words',
    title: 'Common Describing Words',
    hmongTitle: 'Loj, Me, Zoo, Phem',
    order: 21,  // was 20 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "great job on the flashcards, but also introduce the most
    // common adjectives flashcards too"). The `descriptions` set had no unit.
    learnUnit: 'grammar',
    introLesson: 'grammar-adjectives',
    categories: ['descriptions'],
    words: [
      'descriptions-big', 'descriptions-small', 'descriptions-good', 'descriptions-bad',
      'descriptions-new', 'descriptions-old', 'descriptions-tall', 'descriptions-long',
      'descriptions-short-objects', 'descriptions-short', 'descriptions-fast', 'descriptions-overweight',
      'descriptions-skinny', 'descriptions-pretty', 'descriptions-handsome', 'descriptions-cheap',
      'descriptions-wet', 'descriptions-not-lazy', 'descriptions-lazy', 'descriptions-loveable',
    ],
    free: true,
    blurb: 'Loj, me, zoo, phem, tshiab, qub — the describing words you will use every day.',
    why: 'The patterns from Describing Words, now with the everyday adjectives to put in them.',
  },
  {
    id: 'u-location',
    title: 'Where Things Are',
    hmongTitle: 'Hauv thiab Nraum',  // 'hauv' + 'thiab' + 'nraum', all attested
    order: 22,  // was 21 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // No Learn lesson teaches locations yet, so no learnUnit / introLesson —
    // the unit starts at Flashcards, like Family.
    // Was: categories: ['locations-prepositions'] (all 20, no list). 2026-09-28 (author: pem, nram,
    // nqes): an explicit list — + nram and nqes (reading-motion), − ntej (repeats ua ntej and shares
    // pem's sentence) and dhau (to pass, a motion verb). Both stay in the dictionary.
    introLesson: 'placeholder-location',  // PLACEHOLDER lesson, 2026-09-28 — lessons/placeholders.js
    categories: ['locations-prepositions', 'reading-motion'],
    words: [
      'locprep-sab-laug', 'locprep-sab-xis', 'locprep-qaum-teb', 'locprep-qab-teb',
      'locprep-sab-hnub-tuaj', 'locprep-sab-hnub-poob', 'locprep-hauv', 'locprep-saum-toj',
      'locprep-hauv-qab', 'locprep-ib-sab', 'locprep-nruab-nrab', 'locprep-ua-ntej',
      'locprep-nram-qab', 'locprep-deb', 'locprep-ze', 'locprep-ntawm',
      'locprep-nraum', 'locprep-pem', 'locprep-nram', 'misc-nqes',
    ],
    free: true,
    blurb: 'Hauv, nraum, saum toj, hauv qab — in, out, on, under.',
    why: 'Location words are how Hmong says where anything is; the directions (sab laug, sab xis) ride along.',
  },
  {
    id: 'u-quantity',
    title: 'Some, Many, All',
    hmongTitle: 'Ntau thiab Tsawg',  // 'many and few' — 'ntau', 'thiab', 'tsawg'
    order: 23,  // was 22 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // A Learn lesson at last (2026-09-27, the author: "add the path for quantifiers").
    learnUnit: 'grammar',
    introLesson: 'grammar-quantifiers',
    categories: ['quantifiers'],
    free: true,
    blurb: 'Ib co, ntau, coob, txhua, tag nrho — how much of something.',
    why: 'Before Numbers: vague amounts first, exact ones next. Every quantifier here has a human-written sentence.',
  },
  {
    id: 'u-sib',
    title: 'Each Other',
    // The Learn lesson's own title is 'Sib — Reciprocals'. Copied, not composed.
    hmongTitle: 'Sib',
    order: 26,  // was 25 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'conversational',
    introLesson: 'vocab-sib-reciprocals',
    categories: ['reciprocals'],
    free: true,
    blurb: 'Sib hlub, sib pab, sib tham — doing it to each other.',
    why: 'One prefix turns any verb into "each other" — cheap to learn, heard constantly.',
  },
  {
    id: 'u-particles',
    title: 'Sentence Particles',
    hmongTitle: 'Os, Nawb, Ne',  // three of the unit's own headwords
    order: 27,  // was 26 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // No Learn lesson: `writing-discourse-particles` is an unshipped placeholder.
    introLesson: 'placeholder-particles',  // PLACEHOLDER lesson, 2026-09-28 — lessons/placeholders.js
    categories: ['discourse-particles'],
    // Explicit list, 2026-09-28: the particles that have example sentences. The author's preferred
    // list added na, ntag, aws, pob, sas, lauj, oj, sob, li to the set — add each here once it has one.
    words: [
      'discourse-nawb', 'discourse-yom', 'discourse-os', 'discourse-lov', 'discourse-ne',
      'discourse-mog', 'discourse-thiab', 'discourse-xwb', 'discourse-mas',
    ],
    free: true,
    blurb: 'Os, nawb, ne, lov — the small words that make Hmong sound natural.',
    why: 'Real Hmong speech is full of these; without them a learner sounds like a textbook. ⚠️ All six examples are AI-drafted — review first.',
  },
  {
    // ⚠️ PRO — a topic, not grammar: the Hmong way of naming feelings and
    // character with `siab`. Sits after Family (feelings about people).
    id: 'u-siab',
    title: 'Feelings & Character',
    // 'lub siab' is attested — reading-body in vocabulary.js.
    hmongTitle: 'Lub Siab',
    order: 39,  // was 38 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Was: categories: ['personality-siab'] (all 15, no list). 2026-09-28 (author: "add new words to
    // path flashcards, placeholder for now"): + the hate words (reading-emotion) and vam, to hope
    // (verbs), as an explicit list — kev ntxub ntxaug stays dictionary-only (the 20 cap).
    introLesson: 'placeholder-siab',  // PLACEHOLDER lesson, 2026-09-28 — lessons/placeholders.js
    categories: ['personality-siab', 'reading-emotion', 'verbs'],
    words: [
      'personality-siab-zoo-siab', 'personality-siab-txaus', 'personality-siab-nyuaj', 'personality-siab-ntev',
      'personality-siab-luv', 'personality-siab-zoo', 'personality-siab-phem', 'personality-siab-loj',
      'personality-siab-me', 'personality-siab-dav', 'personality-siab-nqaim', 'personality-siab-dawb',
      'personality-siab-dub', 'personality-siab-ceev', 'personality-siab-hnyav', 'emo-ntxub',
      'emo-kev-ntxub', 'emo-ntxub-ntxaug', 'emo-nciab', 'verbs-vam',
    ],
    blurb: 'Zoo siab, siab ntev, nyuaj siab — feelings live in the siab.',
    why: 'Hmong puts feeling and character in the siab (liver/heart); 15 everyday expressions built on one word.',
  },
  {
    id: 'u-food',
    title: 'Food & Drinks',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: 'eat and drink' — vocabulary 'noj', 'thiab', 'haus'. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Noj thiab Haus',
    order: 31,  // was 30 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    introLesson: 'placeholder-food',  // PLACEHOLDER lesson, 2026-09-28 — lessons/placeholders.js
    categories: ['food', 'drinks'],
    limit: UNIT_WORD_CAP, // 38 words in the categories — the worst overflow
    blurb: 'Mov, dej, noj, haus — eating and drinking.',
    why: 'High utility, and `mov` carries real culture. ⚠️ The single largest content hole.',
  },
  {
    id: 'u-colors',
    title: 'Colors & Describing',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: 'cov' + 'xim' — the plural this file says a bare 'xim' lacks. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Cov Xim',
    order: 40,  // was 39 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'grammar',  // Adjectives, Describing People
    introLesson: 'grammar-adjectives',  // "Describing things"
    categories: ['colors'],
    blurb: 'Your first adjectives — and where they sit.',
    why: 'Teaches noun-then-adjective order, which is backwards from English.',
  },
  {
    id: 'u-wearing',
    title: 'Clothes & Wearing',
    hmongTitle: 'Hnav, Rau, Looj',
    order: 41,  // was 40 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author picked it): the verb for "wear" depends on the item — hnav, rau,
    // looj, coj, sia — like a classifier depends on the noun. After Colors (lub tsho liab).
    // Pro. Lesson is a PLACEHOLDER (Claude's draft).
    learnUnit: 'conversational',
    introLesson: 'grammar-wearing',
    categories: ['wear-verbs', 'clothing', 'clothing-2'],
    words: [
      'wear-verbs-hnav', 'wear-verbs-rau', 'wear-verbs-looj', 'wear-verbs-coj', 'wear-verbs-sia',
      'clothing-tsho', 'clothing-ris-ntev', 'clothing-ris-luv', 'clothing-ris-ntaub-tsuj', 'clothing-khau',
      'clothing-khau-luj-siab', 'clothing-khau-hlau', 'clothing-kaus-mom', 'clothing-hnab-looj-tes', 'clothing-siv-tawv',
      'clothing-phuam', 'clothing-tsom-iav', 'clothing-saw-caj-dab', 'clothing-nplhaib', 'clothing-saw-npab',
    ],
    blurb: 'Hnav tsho, rau khau, looj kaus mom — the verb for “wear” changes with what you wear.',
    why: 'English says wear for everything; Hmong picks the verb by the item. It builds on Rau.',
  },
  {
    id: 'u-verbs',
    title: 'Core Verbs',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: ⚠️ the usual textbook term for verbs; its parts are attested, the phrase is not. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Cov Lus Qhia Ua',
    order: 6,  // was 5 — sentence unit to #5 (author), 2026-09-28
    learnUnit: 'grammar',  // Action Verbs, Tense Markers
    introLesson: 'foundations-action-verbs',  // "How Hmong action verbs work"
    categories: ['verbs'],
    // ⚠️ FREE — the author's ruling, 2026-09-25: "the fundamentals always free".
    // The whole grammar core (units 1–6) sits in front of the paywall.
    free: true,
    blurb: 'Noj, haus, mus, los — doing things.',
    why: 'Unlocks real sentences. The first unit curated by hand — see below.',
    // ⚠️ THE FIRST CURATED UNIT, AND THE WORKED EXAMPLE OF WHY `limit` IS NOT
    // GOOD ENOUGH. Measured 2026-09-20: `verbs` holds 28 words, 23 of which
    // have an example sentence, and `limit: 20` took the first 20 IN DATA
    // ORDER — which threw away 7 words that were ready and kept 4 that were
    // not, landing the unit at 16/20.
    //
    // ⚠️ AND THE GREEDY FIX IS WORSE THAN THE PROBLEM. Picking the 20 words
    // that already HAVE sentences would score 20/20 and ship this unit today
    // for free — but the 23 ready words do not include `muaj` (to have) or
    // `los` (to come), while they do include `nthuav` (to flip a page) and
    // `piav` (to explain). A beginner's third unit (eighth before the 2026-09-25 reorder) that teaches "flip a page"
    // and not "have" is a worse unit that happens to pass a readiness check.
    // Readiness is a measure of the CONTENT, never a curriculum argument.
    //
    // So this list is chosen on utility — can a beginner say something true
    // with it — and it leaves exactly two sentences to write (`los`, `muaj`).
    // Both already sit in the top tier of the sentence workbench, because the
    // same signals that rank them there rank them here.
    //
    // The eight verbs not listed (txuas, ntsib, xyuas, piav, nthuav, cia, tso,
    // ntsia) are NOT deleted — they stay in the `verbs` category for the
    // Reference tab and the reader's long-press, which is the whole point of a
    // unit being a curated slice rather than the category itself.
    words: [
      'verbs-eat',    'verbs-drink',  'verbs-go',     'verbs-come',   'verbs-make',
      'verbs-have',   'verbs-see',    'verbs-watch',  'verbs-say',    'verbs-tell',
      'verbs-ask',    'verbs-answer', 'verbs-learn',  'verbs-read',   'verbs-write',
      'verbs-talk',   'verbs-sit',    'verbs-stand',  'verbs-open',   'verbs-close',
    ],
  },
  {
    id: 'u-sentence-structure',
    title: 'How a Sentence Is Built',
    hmongTitle: 'Kuv Noj Mov',
    order: 5,  // was 6 — sentence unit to #5 (author), 2026-09-28
    // Added 2026-09-28 (author: "create a path for learning how sentences are built … this is
    // important … keep it simple beginner friendly"). After Core Verbs: by then a learner has
    // pronouns, classifiers, nouns and verbs. Pro (past the first four units).
    learnUnit: 'grammar',
    introLesson: 'grammar-sentence-structure',
    categories: ['sentence-structure'],
    free: true,  // overridden by FREE_PATH_UNITS (position decides), kept for the record
    blurb: 'Kuv noj mov — subject, verb, object, then time and place.',
    why: 'Every sentence after this one uses the same order. The verb never changes; the pieces move around it.',
  },
  {
    id: 'u-verb-noun',
    title: 'Verb + Noun',
    hmongTitle: 'Noj Mov, Nyeem Ntawv',
    order: 7,  // was 6 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author: "the action verbs in verbs, we might need to separate that and
    // include it in its own path"). The seven everyday verb + noun pairs from the Action Verbs
    // lesson — none of them were in a unit (Core Verbs' 20 are the single verbs).
    learnUnit: 'grammar',
    introLesson: 'foundations-action-verbs',
    // The extra categories only let the explicit list reach taug kev and kawm ntawv.
    categories: ['verbs', 'vehicles-travel', 'reading-motion'],
    words: [
      'vehicle-taug-kev', 'verbs-noj-mov', 'verbs-nyeem-ntawv', 'verbs-sau-ntawv',
      'misc-kawm-ntawv', 'verbs-mloog-lus', 'verbs-hais-lus',
    ],
    free: true,
    blurb: 'Noj mov, nyeem ntawv, hais lus — the verb and the noun it almost always brings.',
    why: 'Hmong rarely says a bare verb: the pair names the activity, and is the everyday way to say it.',
  },
  {
    id: 'u-time',  // id kept (progress is keyed on it) — this is now the DAYS unit
    // Was 'Days & Time of Day' — the day frames are their own unit now (2026-09-27).
    title: 'Time of Day',
    hmongTitle: 'Hnub',  // the unit's own headword (day)
    order: 32,  // was 31 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'numbers-and-time',
    introLesson: 'numbers-time',  // the days lesson (time.js), rewritten 2026-09-26
    categories: ['timeframes', 'timeframes-days'],  // 'days-of-week' → u-calendar, 2026-09-27
    // Parts of the day → which day → the days of the week (20, the cap).
    words: [
      // Time of day only (2026-09-27). The day frames (nag hmos, tag kis, hnub no…) moved to
      // u-day-frames. Was: + 'timeframes-day', 'timeframes-today', 'time-naghmo', 'time-tagkis',
      //   'timeframes-everyday', 'timeframes-some-other-day', then 'time-nagkis',
      //   'timeframes-one-day', 'timeframes-the-other-day'.
      'time-sawv-ntxov', 'time-tavsu', 'time-tavsu-dua', 'time-tsaus-ntuj',
      'time-nruab-hnub', 'time-hmo-ntuj', 'time-tagkis-no',
      // The days of the week moved to u-calendar (Days & Months), 2026-09-27. Was:
      //   'days-of-week-monday' … 'days-of-week-sunday'
      'time-ib-tag-hmo', 'time-ib-hmos',
    ],
    blurb: 'Sawv ntxov, hnub no, tagkis — the part of the day, and which day.',
    why: 'Comes before Telling the Time: the part of the day (sawv ntxov, tsaus ntuj) is also how a clock time says a.m. and p.m.',
    // ⚠️ SPLIT 2026-09-26 (author): this unit was "Time & Days" and mixed the clock
    // (teev, feeb, via `timeframes`, intro lesson time-explained) with days. The clock
    // is now u-clock, right after this one. Was:
    // {
    // id: 'u-time',
    // title: 'Time & Days',
    // // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // // Source: vocabulary 'sij hawm' (spaced, as the dictionary spells it), 'thiab', 'hnub'. Confirm with a fluent speaker; delete this line to go back to English-only.
    // hmongTitle: 'Sij Hawm thiab Hnub',
    // order: 19,  // was 18 — u-tau inserted at 8, 2026-09-26
    // learnUnit: 'numbers-and-time',  // Time, Time Explained
    // introLesson: 'time-explained',  // "Telling the time"
    // categories: ['timeframes', 'days-of-week'],
    // limit: UNIT_WORD_CAP, // 26 words in the categories
    // blurb: 'Hnub no, tag kis — saying when.',
    // why: 'Turns sentences into plans.',
    // },
  },
  {
    id: 'u-day-frames',
    title: 'Yesterday & Tomorrow',
    hmongTitle: 'Naghmo thiab Tagkis',
    order: 33,  // was 32 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "there are very specific names for day frames in Hmong" —
    // separated from time of day and from the days of the week). Hnub hnub … puag nraus,
    // and the hnub words.
    learnUnit: 'numbers-and-time',
    introLesson: 'grammar-day-frames',
    categories: ['timeframes', 'timeframes-days'],
    words: [
      'time-hnub-hnub', 'time-hnub-hmos', 'time-naghmo', 'timeframes-today',
      'time-tagkis', 'time-nagkis', 'time-puagnraus',
      'timeframes-day', 'timeframes-one-day', 'timeframes-all-the-time', 'timeframes-everyday',
      'timeframes-the-other-day', 'timeframes-some-other-day',
    ],
    blurb: 'Hnub hnub, hnub hmos, naghmo, hnub no, tagkis, nagkis, puagnraus — three days back to three days on.',
    why: 'English stops at yesterday and tomorrow; Hmong names the days on either side.',
  },
  {
    id: 'u-calendar',
    title: 'Days & Months',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-27 — two attested headwords + thiab.
    hmongTitle: 'Hnub thiab Hlis',
    order: 34,  // was 33 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: "a path for days of the week, and months of the year").
    // After Days & Time of Day, which it took the week from. Lesson: grammar-calendar.
    learnUnit: 'numbers-and-time',
    introLesson: 'grammar-calendar',
    categories: ['days-of-week', 'months', 'calendar'],
    words: [
      'days-of-week-monday', 'days-of-week-tuesday', 'days-of-week-wednesday', 'days-of-week-thursday',
      'days-of-week-friday', 'days-of-week-saturday', 'days-of-week-sunday',
      'months-january', 'months-february', 'months-march', 'months-april', 'months-may', 'months-june',
      'months-july', 'months-august', 'months-september', 'months-october', 'months-november', 'months-december',
      'calendar-date',
    ],
    blurb: 'Hnub ib, lub ib hlis ntuj — the days of the week and the months, both counted.',
    why: 'Both are counted: a day is hnub + a number, a month is lub + a number + hlis ntuj.',
  },
  {
    id: 'u-dates',
    title: 'Writing Dates',
    hmongTitle: 'Hnub Tim',  // the unit's own headword (date)
    order: 35,  // was 34 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-27 (author: writing dates "should be its own path"). Right after Days &
    // Months, whose day and month words it puts together. Western order is the focus.
    learnUnit: 'numbers-and-time',
    introLesson: 'grammar-dates',
    categories: ['dates'],
    blurb: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau — January 2, 2026.',
    why: 'Month, day and year each take a label in front of the number: lub … hlis ntuj, hnub tim, xyoo.',
  },
  {
    id: 'u-clock',
    title: 'Telling the Time',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-26 — two attested headwords + 'thiab', like 'Hauv thiab Nraum'.
    hmongTitle: 'Teev thiab Feeb',
    order: 36,  // was 35 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'numbers-and-time',
    introLesson: 'time-explained',  // the author's clock lesson
    categories: ['clock-time'],
    blurb: 'Ob teev pebcaug — the hour, teev, the minutes, and a.m. or p.m. at the end.',
    why: 'After Days & Time of Day: a clock time ends with the part of the day that unit teaches.',
  },
  {
    id: 'u-daily',
    title: 'Daily Life',
    // ⚠️ DRAFTED BY CLAUDE 2026-09-25 at the author's request — NOT attested.
    // Source: 'everyday life' — 'neej' and 'txhua hnub' are attested; 'lub neej' as a unit is not. Confirm with a fluent speaker; delete this line to go back to English-only.
    hmongTitle: 'Lub Neej Txhua Hnub',
    order: 37,  // was 36 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    learnUnit: 'conversational',  // Daily Life
    introLesson: 'conversational-daily-life',  // "Everyday phrases"
    categories: ['daily-life', 'chores'],
    blurb: 'The routine that ties it together.',
    why: 'Uses every earlier unit at once.',
  },
  {
    id: 'u-body',
    title: 'Body & Health',
    hmongTitle: 'Lub Cev',
    order: 38,  // was 37 — u-sentence-structure inserted after Core Verbs, 2026-09-28
    // Added 2026-09-28 (author picked it): the body parts, their classifiers (lub, txhais, cov), and
    // "it hurts" with mob. Pro, like the other topics. Lesson is a PLACEHOLDER (Claude's draft).
    learnUnit: 'conversational',
    introLesson: 'grammar-body',
    categories: ['human-anatomy-face', 'human-anatomy-upper-body', 'human-anatomy-lower-body'],
    words: [
      'human-anatomy-face-head', 'human-anatomy-face-hair', 'human-anatomy-face-face', 'human-anatomy-face-eye',
      'human-anatomy-face-ear', 'human-anatomy-face-nose', 'human-anatomy-face-mouth', 'human-anatomy-face-teeth',
      'human-anatomy-face-neck', 'body-lub-caj-pas', 'human-anatomy-upper-body-shoulder', 'human-anatomy-upper-body-arm',
      'human-anatomy-upper-body-hand', 'human-anatomy-upper-body-finger', 'human-anatomy-upper-body-back', 'human-anatomy-lower-body-belly',
      'human-anatomy-lower-body-knee', 'human-anatomy-lower-body-leg', 'human-anatomy-lower-body-foot', 'human-anatomy-lower-body-toe',
    ],
    blurb: 'Taub hau, tes, ko taw — the body, and how to say where it hurts.',
    why: 'What you need at the doctor: Kuv lub taub hau mob. It reuses txhais (one of a pair) from Classifiers.',
  },
]

// ⚠️ PRO PAST THE FIRST FOUR UNITS — 2026-09-28 (author: "users MUST be pro in order to continue
// down the paths"). Every screen reads `unit.free` (unitStatus, quizzes, typing, the sentence
// builder), so it is decided HERE, once, by position: the first FREE_PATH_UNITS units are free and
// every unit after them is Pro, whatever its own `free:` line says. The per-unit `free: true` lines
// stay as the record of the earlier "fundamentals always free" rule, copied to `freeBefore`.
// TO RESTORE that rule: delete this loop.
// Was 4 (same day) — the author: "make the first 7 free then" (2026-09-28).
export const FREE_PATH_UNITS = 7
for (const u of path) {
  u.freeBefore = u.free === true
  u.free = u.order <= FREE_PATH_UNITS
}

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ `limit` vs `words` — READ THIS BEFORE TRUSTING A CAPPED UNIT.
//
// `limit` takes the first N words IN DATA ORDER. Data order is not frequency
// order and nobody has ever curated it, so a capped unit today is a PLACEHOLDER
// that happens to contain 20 real words, not the 20 best ones. `u-food` is the
// clearest case: 38 words trimmed to the first 20, chosen by nothing.
//
// `words: [...]` is the real answer — explicit ids, in teaching order — and it
// beats `limit` wherever it is present. Curating those four lists is a content
// task, not a code one.
//
// ⚠️ WHY THE CAP IS NOT "PREFER THE WORDS THAT HAVE EXAMPLE SENTENCES", which
// is the obvious clever version: unit membership would then CHANGE as sentences
// get written, so a learner's "18 of 20 mastered" could silently become
// "18 of 23", and a word they had finished could drop out of the unit it was
// learned in. Deterministic beats clever for anything a learner's progress is
// measured against.
// ─────────────────────────────────────────────────────────────────────────────

/** Every word in a unit, capped and in teaching order. */
export function unitWords(unit) {
  if (!unit) return []

  const pool = (unit.categories || []).flatMap((id) => getCategory(id)?.words || [])

  // An explicit list wins, and it is looked up against the POOL rather than the
  // whole vocabulary — an id listed here that is not in the unit's own
  // categories is a mistake, and dropping it silently is what check-path.mjs
  // exists to catch.
  if (unit.words) {
    const byId = new Map(pool.map((w) => [w.id, w]))
    return unit.words.map((id) => byId.get(id)).filter(Boolean)
  }

  return typeof unit.limit === 'number' ? pool.slice(0, unit.limit) : pool
}

/**
 * The words whose SENTENCES a unit reads and drills — its Reading step and its
 * sentence builder. Normally the same as unitWords(). A unit whose flashcards
 * are abstract PATTERNS ("tau + verb") names the real-word examples that show
 * those patterns in `exampleSets` (u-tau, 2026-09-26): the cards teach the rule,
 * the reading and the builder practise it with the same words.
 */
export function unitExampleWords(unit) {
  if (!unit) return []
  if (!unit.exampleSets) return unitWords(unit)
  return unit.exampleSets.flatMap((id) => getCategory(id)?.words || [])
}

export function getUnit(unitId) {
  return path.find((u) => u.id === unitId) || null
}

/** The path in teaching order. Data order is already teaching order; this
 *  sorts anyway so an edit to `order` alone is enough to reorder the course. */
export function orderedPath() {
  return [...path].sort((a, b) => a.order - b.order)
}

// ─────────────────────────────────────────────────────────────────────────────
// READINESS — which units the content can actually carry.
//
// ⚠️ DERIVED, NEVER STORED. There is no `ready: true` to maintain in the data
// above. A unit becomes ready the moment enough example sentences exist, with
// no edit to this file — which is the entire point, because the content is
// being written right now and a hand-kept flag would be wrong within a week.
// This is the same contract sentenceGroups() holds in lib/sentenceBuilder.js.
//
// WHAT EACH FIELD POWERS, from the five-step unit in the design note:
//
//   exampleSentence → step 2 (quiz distractors)
//                   → step 4 (sentence builder)
//                   → step 5 (the mini-reading, assembled from these very
//                     sentences — NOT an authored story)
//   audioFile       → step 3 (tone practice: record and score)
//
// ⚠️ ONE SENTENCE POWERS THREE OF THE FIVE STEPS. Writing 20 sentences for a
// unit completes steps 2, 4 and 5 at once. That is why `ready` below is defined
// on sentences alone and why the content plan is "sentences first".
// ─────────────────────────────────────────────────────────────────────────────

// ⚠️ AUDIO IS OUT OF THE READINESS TEST — a deliberate call on 2026-09-20, when
// recording was paused. It was never a majority: measured that day, 120 of the
// path's 218 words had a clip and two whole units (Family, Food) had none.
//
// Step 3 does NOT become an empty slot, because tone can be taught without
// sound: src/lib/typingDrill.js grades the tone off the SPELLING — writing
// `zos` for `zoo` is reported as a Low-vs-Mid tone error by name — and it runs
// on 917 words today with no recording at all. Step 3 is that drill until
// clips exist.
//
// TO RE-ARM AUDIO: add `&& r.needAudio === 0` to `ready` below. `withAudio` and
// `needAudio` are still measured and reported precisely so that day is a
// one-line change rather than an archaeology exercise.
const AUDIO_COUNTS_TOWARD_READY = false

// ⚠️ A PHRASE IS ITS OWN EXAMPLE SENTENCE — the author's ruling, 2026-09-21.
// "koj puas nyob zoo?" is a complete utterance; asking for a sentence that
// CONTAINS it asks for a worse version of the thing already there. The sentence
// export stopped listing phrases that day — and this file was never told, so
// `ready` kept demanding a sentence no one would ever write. Greetings could
// NEVER go live, and neither could the other free unit, which left a free
// learner's first unit behind the paywall. One rule, defined once, read by both
// (scripts/export-sentences-needed.mjs imports it from here).
//
// A phrase is something you can say on its own: the conversational decks, and
// any headword ending in "?" that is not a bare question word — "qhov twg?"
// still needs a sentence to show how it is used.
export const PHRASE_CATEGORIES = new Set(['greetings', 'politeness', 'introductions', 'daily-life'])

export function isPhraseEntry(word) {
  const head = String(word?.hmongRPA || '').trim()
  return PHRASE_CATEGORIES.has(word?.category) || (/\?$/.test(head) && word?.category !== 'question-words')
}

/** Does this word carry an example — a sentence, or by being a phrase itself? */
export function hasExample(word) {
  return Boolean(word?.exampleSentence?.hmong) || isPhraseEntry(word)
}

/**
 * What one unit's content can support.
 *
 * @returns {{
 *   unit, words, withExample, withAudio, needExample, needAudio,
 *   sentenceReady: boolean, audioReady: boolean, ready: boolean, pct: number
 * }}
 */
export function unitReadiness(unit) {
  const words = unitWords(unit)
  const withExample = words.filter(hasExample).length
  const withAudio = words.filter((w) => w.audioFile).length
  const needExample = words.length - withExample
  const needAudio = words.length - withAudio

  // ⚠️ AN EMPTY UNIT IS NOT A READY UNIT. Without this, a unit whose category
  // ids were all typos would report 0 words, 0 missing, and pass as ready —
  // the failure mode is a unit that ships teaching nothing.
  const sentenceReady = words.length > 0 && needExample === 0
  const audioReady = words.length > 0 && needAudio === 0

  return {
    unit,
    words,
    withExample,
    withAudio,
    needExample,
    needAudio,
    sentenceReady,
    audioReady,
    ready: sentenceReady && (AUDIO_COUNTS_TOWARD_READY ? audioReady : true),
    pct: words.length ? Math.round((100 * withExample) / words.length) : 0,
  }
}

/** Readiness for every unit, in teaching order. */
export function pathReadiness() {
  return orderedPath().map(unitReadiness)
}

/**
 * The units a learner can actually be shown — ready ones, in TEACHING order.
 *
 * "Ship in readiness order, present in teaching order" is this function. As of
 * 2026-09-20 it returns two units (Numbers and Classifiers); the learner sees
 * them as units 3 and 5 of a visible ten, not as a two-unit app.
 *
 * ⚠️ THE PATH GROWS AS SENTENCES ARE WRITTEN, which means a unit can appear
 * BETWEEN two a learner has already finished. That is safe only because
 * unlocking is positional over this list and progress keys on `unitId`: a newly
 * inserted unit is simply an unlocked unit they have not done, never a reset.
 */
export function livePath() {
  return pathReadiness().filter((r) => r.ready).map((r) => r.unit)
}

/**
 * The live path units a Learn-tab chapter teaches, in teaching order.
 *
 * Used by the Learn hub to sit each unit beside the lessons that explain it
 * (2026-09-23). Reads the `learnUnit` string on each unit — see the field list
 * at the top for why it is a string and not an import.
 *
 * ⚠️ LIVE UNITS ONLY, because it filters `livePath()`. A unit that is not ready
 * yet must not appear in Learn either, or the Learn hub would advertise a door
 * that /path deliberately hides.
 */
export function unitsForLearnUnit(learnUnitId) {
  if (!learnUnitId) return []
  return livePath().filter((u) => u.learnUnit === learnUnitId)
}

/**
 * Is this unit open?
 *
 * ⚠️ POSITIONAL, NOT COUNTED — the same model lib/access.js already uses for
 * guest limits, and for the same reason recorded there: nothing is stored,
 * nothing is spent, and revisiting a finished unit is always free.
 *
 * The first ALWAYS_OPEN_UNITS live units are always open. After that a unit opens when the
 * one before it in `livePath()` is complete.
 *
 * ⚠️ 2026-09-28 (author: "lock the paths, keep the first four paths unlocked"). Was: only the
 * first unit (`if (i === 0) return true`). Admins still see every unit open (unitStatus).
 */
export const ALWAYS_OPEN_UNITS = 4
export function isUnitUnlocked(unitId, completedUnitIds = []) {
  const live = livePath()
  const i = live.findIndex((u) => u.id === unitId)
  if (i < 0) return false        // not ready yet — not in the path at all
  if (i < ALWAYS_OPEN_UNITS) return true
  return completedUnitIds.includes(live[i - 1].id)
}

/** The unit to put on a "Continue" card: the first live unit not yet done. */
export function nextUnit(completedUnitIds = []) {
  return livePath().find((u) => !completedUnitIds.includes(u.id)) || null
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE IS NOT — so the next person does not go looking.
//
// · The SCREENS are built as of 2026-09-22 — see notes/2026-09-22-path-spine.md.
//   /path (the list), /path/<unitId> (the five steps), Home's Continue card.
//   The progress logic they share is src/lib/pathProgress.js.
// · Nothing here gates the Reference tab, the reader or the sentence builder,
//   and nothing should.
//   ⚠️ SUPERSEDED IN PART 2026-09-25: the author put every vocabulary SET
//   except greetings, pronouns, classifiers, verbs and descriptions behind Pro
//   (src/lib/vocabAccess.js) — set screens, word screens, their quizzes and
//   the sentence builder's groups. The READER'S long-press lookup still reads
//   every category, so stories stay readable. That gating lives in
//   vocabAccess.js, not here. Was: "Reference stays fully open on all 77
//   categories — it is what makes the reader usable and the app's most
//   honest asset."
// · `free` is enforced in lib/pathProgress.js (unitStatus → 'pro') and, for a
//   unit's quiz opened by URL, by PaywallGate via the quiz config's `tier`.
// · Progress is not stored here. Completion is DERIVED from the step records in
//   ProgressContext (lib/pathProgress.js); every function above takes the list
//   of completed unit ids as an argument, so this file stays pure data.
// ─────────────────────────────────────────────────────────────────────────────
