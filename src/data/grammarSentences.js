// GRAMMAR DRILL SENTENCES — ⚠️ PLACEHOLDERS, UNREVIEWED. Added 2026-09-16.
//
// Machine-generated (ChatGPT) to unlock the sentence builder's starved grammar
// drills — negation, question words, yes/no, commands, joining clauses,
// discourse particles — until a speaker writes real ones. Generated from the
// prompt that asked for sentences hitting 2+ patterns each.
//
// ── WHY A FILE OF ITS OWN, NOT `exampleSentence` ON VOCABULARY WORDS ────────
//
// The builder's own design says "no new content file" — exercises derive from
// vocabulary so the drill only asks about sentences the app already teaches.
// These deliberately break that rule, for one reason: `exampleSentence` is not
// private to the drill. It also renders on the Flashcard, on WordDetail, and
// feeds tier 3 of the reader's long-press lookup (src/lib/wordLookup.js).
// Attaching unreviewed Hmong to word entries would publish it on three screens
// a learner treats as the dictionary.
//
// Kept here, they reach the sentence builder ONLY (Mixed practice + the grammar
// drills — never a topic group), and the whole batch is one import away from
// gone. That is the right shape for content nobody has checked.
//
// ⚠️ WHEN A SPEAKER REVIEWS ONE: move it onto the matching vocabulary word as a
// real `exampleSentence` and delete it here. Do not mark it reviewed in place —
// a reviewed sentence belongs with the vocabulary, where the rest of the app
// can use it.
//
// ── FIELDS ──────────────────────────────────────────────────────────────────
//   id          unique across ALL exercises — it seeds chip ids, so a collision
//               would make two chips answer to one key
//   word        the word the sentence is drilling; shown as "teaches …" in the
//               feedback panel after the learner answers
//   confidence  the GENERATOR'S self-rating. It is not verification — a model's
//               HIGH on a language it cannot hear is a guess. Every row here is
//               unreviewed regardless of this value.
//   review      set where a problem is visible from the text alone. Read these
//               first; they are the rows most likely to be wrong.

export const grammarSentences = [
  // ── Negation (tsis) ──────────────────────────────────────────────────────
  { id: 'gs-001', hmong: 'Kuv tsis xav mus tagkis.', english: "I don't want to go tomorrow.", word: 'tsis', confidence: 'HIGH' },
  { id: 'gs-002', hmong: 'Nws tsis nyob hauv tsev.', english: "He/She isn't at home.", word: 'nyob', confidence: 'HIGH' },
  { id: 'gs-003', hmong: 'Kuv tsis noj nqaij.', english: "I don't eat meat.", word: 'nqaij', confidence: 'HIGH' },
  { id: 'gs-004', hmong: 'Kuv tsis tau noj mov.', english: "I haven't eaten yet.", word: 'tsis tau', confidence: 'HIGH' },

  // ── Question words ───────────────────────────────────────────────────────
  { id: 'gs-005', hmong: 'Koj xav noj dab tsi?', english: 'What do you want to eat?', word: 'dab tsi', confidence: 'HIGH' },
  { id: 'gs-006', hmong: 'Leej twg yog koj txiv?', english: 'Who is your father?', word: 'leej twg', confidence: 'HIGH' },
  { id: 'gs-007', hmong: 'Koj nyob qhov twg?', english: 'Where do you live?', word: 'qhov twg', confidence: 'HIGH' },
  { id: 'gs-008', hmong: 'Thaum twg koj mus?', english: 'When are you going?', word: 'thaum twg', confidence: 'HIGH' },
  { id: 'gs-009', hmong: 'Vim li cas koj tsis mus?', english: "Why aren't you going?", word: 'vim li cas', confidence: 'HIGH' },

  // ── Yes/no questions (puas) ──────────────────────────────────────────────
  { id: 'gs-010', hmong: 'Koj puas xav mus?', english: 'Do you want to go?', word: 'puas', confidence: 'HIGH' },
  { id: 'gs-011', hmong: 'Koj puas nyob hauv tsev?', english: 'Are you at home?', word: 'puas', confidence: 'HIGH' },
  { id: 'gs-012', hmong: 'Nws puas yog koj tij laug?', english: 'Is he your older brother?', word: 'tij laug', confidence: 'HIGH' },
  { id: 'gs-013', hmong: 'Koj puas tau noj mov?', english: 'Have you eaten?', word: 'puas', confidence: 'HIGH' },
  { id: 'gs-014', hmong: 'Peb puas mus tagkis?', english: 'Are we going tomorrow?', word: 'tagkis', confidence: 'HIGH' },

  // ── Joining clauses ──────────────────────────────────────────────────────
  {
    id: 'gs-015', hmong: 'Kuv mus thiab koj mus.', english: 'I go and you go.', word: 'thiab', confidence: 'HIGH',
    review: 'Reads like a translated English drill. Check whether a speaker would join two clauses with "thiab" this way at all.',
  },
  { id: 'gs-016', hmong: 'Kuv xav mus, tab sis kuv tsis tau.', english: "I want to go, but I can't yet.", word: 'tab sis', confidence: 'HIGH' },
  { id: 'gs-017', hmong: 'Kuv tsis mus vim hais tias kuv mob.', english: "I don't go because I'm sick.", word: 'vim hais tias', confidence: 'HIGH' },
  {
    id: 'gs-018', hmong: 'Koj haus dej los sis noj mov?', english: 'Will you drink water or eat?', word: 'los sis', confidence: 'HIGH',
    review: 'Generator tagged this yes/no, but it has no "puas" and is an either/or question. The yes/no drill will NOT count it.',
  },
  {
    id: 'gs-019', hmong: 'Yog tias nag, peb tsis mus.', english: "If it rains, we won't go.", word: 'yog tias', confidence: 'HIGH',
    review: '"To rain" is usually "los nag", not bare "nag" — the verb may be missing. Also: "yog tias" (if) is NOT the copula "yog".',
  },

  // ── Negative commands (tsis txhob — ALWAYS this order) ───────────────────
  { id: 'gs-020', hmong: 'Tsis txhob mus ntawd.', english: "Don't go there.", word: 'tsis txhob', confidence: 'HIGH' },
  { id: 'gs-021', hmong: 'Tsis txhob noj ntau.', english: "Don't eat too much.", word: 'tsis txhob', confidence: 'HIGH' },
  { id: 'gs-022', hmong: 'Tsis txhob hais li ntawd.', english: "Don't say that.", word: 'tsis txhob', confidence: 'HIGH' },
  { id: 'gs-023', hmong: 'Tsis txhob khiav hauv tsev.', english: "Don't run in the house.", word: 'khiav', confidence: 'HIGH' },
  { id: 'gs-024', hmong: 'Tsis txhob mus tagkis.', english: "Don't go tomorrow.", word: 'tsis txhob', confidence: 'HIGH' },
  { id: 'gs-025', hmong: 'Tsis txhob hais dag nawb.', english: "Don't lie, okay?", word: 'hais dag', confidence: 'HIGH' },

  // ── Discourse particles — ⚠️ THE LEAST TRUSTWORTHY SECTION ───────────────
  // Particles carry tone and attitude, which is precisely what a model cannot
  // hear. Expect most of this block to be replaced by a speaker.
  { id: 'gs-026', hmong: 'Kuv nyob ntawm no os.', english: "I'm here.", word: 'os', confidence: 'HIGH' },
  { id: 'gs-027', hmong: 'Kuv paub lawm mas.', english: 'I know already.', word: 'mas', confidence: 'HIGH' },
  { id: 'gs-028', hmong: 'Koj nyob qhov twg nav?', english: 'Where are you, then?', word: 'nav', confidence: 'MEDIUM' },
  { id: 'gs-029', hmong: 'Koj tuaj lawm lauj!', english: 'You came already!', word: 'lauj', confidence: 'MEDIUM' },
  {
    id: 'gs-030', hmong: 'Koj hais tiag?', english: 'Are you serious?', word: 'tiag', confidence: 'MEDIUM',
    review: 'Tagged yes/no by the generator, but there is no "puas" — the yes/no drill will not count it.',
  },
  { id: 'gs-031', hmong: 'Nco ntsoov nawb.', english: 'Remember, okay?', word: 'nawb', confidence: 'HIGH' },
  {
    id: 'gs-032', hmong: 'Tos kuv maj.', english: 'Wait for me, please.', word: 'maj', confidence: 'MEDIUM',
    review: '"maj" also means "to hurry". Check it is really a softening particle here and not "wait for me, hurry".',
  },

  // ── Yog (to be) ──────────────────────────────────────────────────────────
  { id: 'gs-033', hmong: 'Nws yog kuv niam.', english: 'She is my mother.', word: 'niam', confidence: 'HIGH' },
  {
    id: 'gs-034', hmong: 'Qhov no yog kuv tsev.', english: 'This is my house.', word: 'yog', confidence: 'HIGH',
    review: 'Tagged location by the generator, but it contains no location word — the location drill will not count it.',
  },
  { id: 'gs-035', hmong: 'Hnub no yog hnub zoo.', english: 'Today is a good day.', word: 'hnub no', confidence: 'HIGH' },

  // ── Wanting, aspect, time, location ──────────────────────────────────────
  { id: 'gs-036', hmong: 'Kuv xav nyob hauv tsev.', english: 'I want to stay at home.', word: 'xav', confidence: 'HIGH' },
  { id: 'gs-037', hmong: 'Kuv yuav mus tagkis.', english: 'I will go tomorrow.', word: 'yuav', confidence: 'HIGH' },
  {
    id: 'gs-038', hmong: 'Kuv tau mus tsev lawm.', english: 'I have gone home already.', word: 'lawm', confidence: 'HIGH',
    review: 'Tagged location by the generator, but "mus tsev" has no location word — the location drill will not count it.',
  },
  { id: 'gs-039', hmong: 'Hnub no kuv nyob ntawm tsev.', english: "Today I'm at home.", word: 'ntawm', confidence: 'HIGH' },

  // ── Family ───────────────────────────────────────────────────────────────
  {
    id: 'gs-040', hmong: 'Kuv niam thiab kuv txiv tuaj.', english: 'My mother and father came.', word: 'thiab', confidence: 'HIGH',
    review: '"thiab" joins two NOUNS here, not two clauses — it will count toward "Joining Clauses" without demonstrating one.',
  },
]
