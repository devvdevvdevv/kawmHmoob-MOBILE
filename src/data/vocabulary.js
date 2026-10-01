// Vocabulary data — edit this file to add new words.
// Schema documented in instructions/adding-vocabulary.md
//
// ── ⚠️ GLOSS PUNCTUATION IS LOAD-BEARING. ';' AND ' · ' ARE NOT THE SAME ────
//
//   ';'     separates SYNONYMS of ONE sense.   'loj' → 'big; large'
//   ' · '   separates DISTINCT SENSES.         'plaub' → 'four · hair'
//
// The difference is not cosmetic: check-vocabulary.mjs splits on ' · ' to find
// entries whose flashcard would teach a meaning its deck never asked about, and
// an entry with more than one sense needs a tagged `senses` array (lib/senses.js)
// so the card can take only its own domain's. A ';' stack needs nothing, because
// it IS one answer, spelled several ways.
//
// So: 'he; she; it' on a pronouns card is CORRECT and always has been.
// 'four · hair' on a numbers card is the bug the checker exists to catch.
//
// ⚠️ THIS WAS UNWRITTEN UNTIL 2026-09-20 AND IT COST A DAY. A 472-word import
// arrived using ';' throughout — correctly, matching the 103 entries across 21
// categories that already did. It was read as 142 hidden multi-sense leaks and
// written up as a defect needing 142 rewrites. Nothing was wrong. The only
// actual fault was that the rule lived in the data and nowhere else, so the two
// separators looked interchangeable to anyone who had not noticed that ' · '
// appears in `misc` and `misc-phrases` and nowhere else in 1,393 entries.
//
// If you reach for a separator and are unsure: would a flashcard in THIS
// category accept both halves as the right answer? Yes → ';'. No → ' · ', and
// write the `senses` array.

// ⚠️ RAW, NOT EXPORTED — 2026-09-25. This is every category as authored. The
// exported `categories` (after the array) is this list with the big sets SPLIT
// into numbered parts — see SET_SPLITS at the foot of the array. Add words here
// exactly as before; which part a word lands in is decided there.
// Was: export const categories = [
const RAW_CATEGORIES = [
  {
    id: 'animals',
    title: 'Animals',
    description: 'Common animal names.',
    emoji: '🐾',
    words: [

        {
        id: 'animals-animals',
        hmongRPA: 'tsiaj',
        english: 'animals',
        category: 'animals',
        tags: ['mammal', 'pet'],
        audioFile: null,
        exampleSentence: { hmong: 'Nov yog cov tsiaj.', english: 'These are the animals' },
      },
      {
        // ⚠️ DOG IS `aub` IN THIS APP — the user's ruling, 2026-09-21. `dev` was
        // removed from every teaching sentence that day. Do not reintroduce it,
        // and do not accept it from an LLM batch.
        // Why (author, 2026-09-27): dev and aub mean the same thing. Which one is used is
        // regional; some regions say either, and in the US both work. Too minor to teach.
        // GPT calls dev "White Hmong" and aub "Green". Ignore that; aub stays.
        id: 'animals-dog',
        hmongRPA: 'aub',
        english: 'dog',
        category: 'animals',
        tags: ['mammal', 'pet'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus aub hu ua Pearl.', english: 'My dog is named Pearl.' },
      },
      {
        id: 'animals-cat',
        hmongRPA: 'miv',
        english: 'cat',
        category: 'animals',
        tags: ['mammal', 'pet'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus miv noj nas.', english: 'The cat eats mice.' },
      },
      {
        id: 'animals-chicken',
        hmongRPA: 'qaib',
        english: 'chicken',
        category: 'animals',
        tags: ['bird', 'farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pom ib tus qaib.', english: 'I see a chicken.', source: 'ai' },
      },

      {
        id: 'animals-fish',
        hmongRPA: 'ntses',
        english: 'fish',
        category: 'animals',
        tags: ['mammal', 'pet'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv muaj ib tus ntses hu ua Ponyo.', english: 'I have a fish named Ponyo.' },
      },

      {
        id: 'animals-tiger',
        hmongRPA: 'tsov',
        english: 'tiger',
        category: 'animals',
        tags: ['mammal'],
        audioFile: null,
        // ⚠️ CORRECTED 2026-09-16. Was 'Txhob tsis mus ze tus tsov ntawd.' —
        // the two particles were the wrong way round. It is ALWAYS `tsis txhob`
        // for a negative command; `txhob tsis` is never right.
        // This one mattered more than a typo: the sentence is live in the
        // sentence builder, so the drill was handing out scrambled chips whose
        // "correct" answer taught the reversed order.
        exampleSentence: { hmong: 'Tsis txhob mus ze tus tsov ntawd.', english: 'Do not go near that tiger.' },
      },

      {
        id: 'animals-duck',
        hmongRPA: 'os',
        english: 'Duck',
        category: 'animals',
        tags: ['birds'],
        audioFile: null,
        exampleSentence: { hmong: 'Tagkis, wb yuav mus khiav ib co os.', english: 'Tommorrow, we will look for ducks' },
      },
      {
        id: 'animals-pig',
        hmongRPA: 'npua',
        english: 'pig',
        category: 'animals',
        tags: ['mammal', 'farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pom ib tus npua.', english: 'I see a pig.', source: 'ai' },
      },
      {
        id: 'animals-bird',
        hmongRPA: 'noog',
        english: 'bird',
        category: 'animals',
        tags: ['birds'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam thaum cov noog hu nkauj.', english: 'I like when the birds sing.' },

      },

      {
        id: 'animals-cow',
        hmongRPA: 'nyuj',
        english: 'cow',
        category: 'animals',
        tags: ['mammals, farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus nyuj ntawd yuav yog ib lub steak zoo heev', english: 'That cow will become a very good steak.' },

      },

      {
        id: 'animals-horse',
        hmongRPA: 'nees',
        english: 'horse',
        category: 'animals',
        tags: ['mammals, farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv xav muaj ib tus nees kom kuv muaj peev xwm caij xws li Arthur Morgan los ntawm Red Dead Redemption 2.', english: 'I want a horse, so that I have the ability to ride, like Arthur Morgan from Red Dead Redemption 2.' },

      },

      {
        id: 'animals-snake',
        hmongRPA: 'nab',
        english: 'Snake',
        category: 'animals',
        tags: ['reptiles'],
        audioFile: null,
        exampleSentence: { hmong: 'Lawv ntshai heev ntawm tus nab.',
          english: 'Theyre very afraid of the snake.' },

      },

      {
        id: 'animals-frog',
        hmongRPA: 'qav',
        english: 'frog',
        category: 'animals',
        tags: ['amphibians', 'reviewed'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus qav ntawd ntxim hlub heev. ',
          english: 'That very cute frog.' },

      },

      {
        id: 'animals-ox',
        hmongRPA: 'twm',
        english: 'Ox',
        category: 'animals',
        tags: ['mammals'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tsis nyiam tus twm vim nws ua rau kuv ntshai heev.',
          english: 'I dont like the Ox because it makes me very scared.' },

      },

      {
        id: 'animals-sheep',
        hmongRPA: 'yaj',
        english: 'Sheep',
        category: 'animals',
        tags: ['Mammals', 'Farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yuav tua tus Yaj kom peb yuav muaj yam noj. ',
          english: 'I will kill the sheep so that we will have something to eat' },

      },

      {
        id: 'animals-rabbits',
        hmongRPA: 'luav',
        english: 'Rabbits',
        category: 'animals',
        tags: ['Mammals'],
        audioFile: null,
        exampleSentence: { hmong: 'Cov Luav ntawd ntxuas ntxiv peb cov qoob loo! ',
          english: 'Those Rabbits keep eating our crops!' },

      },

      {
        id: 'animals-bees',
        hmongRPA: 'muv',
        english: 'Bee',
        category: 'animals',
        tags: ['Insects'],
        audioFile: null,
        exampleSentence: { hmong: 'TSIS COV MUV! ',
          english: 'NOT THE BEES!' },

      },

        {
        id: 'animals-butterfly',
        hmongRPA: 'npauj npaim',
        english: 'Butterfly',
        category: 'animals',
        tags: ['Insects'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam saib cov Npauj Npaim, vim lawv nkauj heev.',
          english: 'I like watching the Butterflies, because theyre very pretty.' },

      },

      // ── Batch added 2026-09-20 ────────────────────────────────────────────
      // Arrived as its own `animals` category; merged in here because the id
      // already existed and every entry already carried `category: 'animals'`.
      // All `unreviewed` and all `audioFile: null` — see
      // notes/2026-09-20-vocab-batch-import.md.
      { id: 'animal-tsiaj', hmongRPA: 'tsiaj', english: 'animal', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam saib tsiaj.', english: 'I like watching animals.', source: 'ai' } },
      { id: 'animal-liab-tsab-tws', hmongRPA: 'liab tsab tws', english: 'ape', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus liab tsab tws.', english: 'I see an ape.', source: 'ai' } },
      { id: 'animal-dais', hmongRPA: 'dais', english: 'bear', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus dais.', english: 'I see a bear.', source: 'ai' } },
      { id: 'animal-phaw-nyuj', hmongRPA: 'phaw nyuj', english: 'bull', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus phaw nyuj.', english: 'I see a bull.', source: 'ai' } },
      // Was english: 'deer' — senses added 2026-09-30 (author: the general word, specifically the sambar deer;
      // also rot / decay, a blacksmith's bellows, ruin). The flashcard (animals) still shows only the deer.
      { id: 'animal-lwj', hmongRPA: 'lwj', english: 'deer — the general word; specifically the sambar deer, native to Southeast Asia and Laos', senses: [{ en: 'deer — the general word; specifically the sambar deer, native to Southeast Asia and Laos', context: 'animals' }, { en: 'to rot, decay; rotten, spoiled — of food, wood, anything gone bad; intensified "lwj ntsuav", "lwj nthwb"', context: 'reading' }, { en: 'a blacksmith\'s bellows (classifier lub; also "foob xab") — "lub tsev lwj hlau", a forge', context: 'reading' }, { en: 'ruined, corrupt, reckless — "ua lwj ua liam", to make a mess of things; "tebchaws lwj", a ruined country; "neeg lwj", a rotten person', context: 'reading' }], category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus lwj.', english: 'I see a deer.', source: 'ai' } },
      { id: 'animal-dais-nauv-xaum', hmongRPA: 'dais nauv xaum', english: 'dinosaur', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus dais nauv xaum hauv phau ntawv.', english: 'There is a dinosaur in the book.', source: 'ai' } },
      { id: 'animal-ntxhw', hmongRPA: 'ntxhw', english: 'elephant', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib tus ntxhw nyob hauv lub vaj tsiaj.', english: 'An elephant lives at the zoo.', source: 'ai' } },
      { id: 'animal-tshis', hmongRPA: 'tshis', english: 'goat', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pog muaj ib tus tshis.', english: 'My grandmother has a goat.', source: 'ai' } },
      // ⚠️ COMMENTED OUT 2026-09-20, NOT DELETED. The headword embeds the English
      // word "gorilla", so a flashcard asks the learner to recall "gorilla" and rewards
      // them for answering "gorilla". RESTORE by replacing the English token with the
      // real Hmong headword — the entry is otherwise complete and correctly tagged.
      // { id: 'animal-liab-gorilla', hmongRPA: 'liab gorilla', english: 'gorilla', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null },
      { id: 'animal-tsov-ntxhuav', hmongRPA: 'tsov ntxhuav', english: 'lion', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tsov ntxhuav pw hauv qhov ntxoov ntxoo.', english: 'The lion sleeps in the shade.', source: 'ai' } },
      { id: 'animal-nab-qa', hmongRPA: 'nab qa', english: 'lizard', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nab qa saum phab ntsa.', english: 'There is a lizard on the wall.', source: 'ai' } },
      { id: 'animal-tsiaj-yug-me-nyuam-noj-mis', hmongRPA: 'tsiaj yug me nyuam noj mis', english: 'mammal', category: 'animals', tags: ['noun','animals','science','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tsiaj yug me nyuam noj mis no loj heev.', english: 'This mammal is very large.', source: 'ai' } },
      { id: 'animal-liab', hmongRPA: 'liab', english: 'monkey', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus liab nce saum tsob ntoo.', english: 'The monkey climbs the tree.', source: 'ai' } },
      { id: 'animal-nas-tsaug', hmongRPA: 'nas tsaug', english: 'mouse', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas tsaug nyob hauv tsev.', english: 'There is a mouse in the house.', source: 'ai' } },  // Was: 'Muaj ib tus nas tsaug hauv tsev.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'animal-ntses-ntxhuav-loj', hmongRPA: 'ntses ntxhuav loj', english: 'octopus', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntses ntxhuav loj nyob hauv hiav txwv.', english: 'The octopus lives in the ocean.', source: 'ai' } },
      // ⚠️ COMMENTED OUT 2026-09-20, NOT DELETED. The headword embeds the English
      // word "orca", so a flashcard asks the learner to recall "orca" and rewards
      // them for answering "orca". RESTORE by replacing the English token with the
      // real Hmong headword — the entry is otherwise complete and correctly tagged.
      // { id: 'animal-ntses-orca', hmongRPA: 'ntses orca', english: 'orca', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null },
      { id: 'animal-noog-liaj', hmongRPA: 'noog liaj', english: 'owl', category: 'animals', tags: ['noun','bird','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus noog liaj ya thaum hmo ntuj.', english: 'The owl flies at night.', source: 'ai' } },
      { id: 'animal-aub-puv-pij', hmongRPA: 'aub puv pij', english: 'puppy', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus aub puv pij no ntxim hlub.', english: 'This puppy is adorable.', source: 'ai' } },
      { id: 'animal-qaib-cog', hmongRPA: 'qaib cog', english: 'rooster', category: 'animals', tags: ['noun','bird','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus qaib cog sawv thaum sawv ntxov.', english: 'The rooster wakes up in the morning.', source: 'ai' } },
      { id: 'animal-ntses-xab-lam', hmongRPA: 'ntses xab lam', english: 'shark', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntses xab lam ua luam dej ceev heev.', english: 'The shark swims very fast.', source: 'ai' } },
      { id: 'animal-ntses-pas-thus', hmongRPA: 'ntses pas thus', english: 'tuna', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv yuav ib tus ntses pas thus.', english: 'My father bought a tuna.', source: 'ai' } },
      // ⚠️ COMMENTED OUT 2026-09-20, NOT DELETED. The headword embeds the English
      // word "salmon", so a flashcard asks the learner to recall "salmon" and rewards
      // them for answering "salmon". RESTORE by replacing the English token with the
      // real Hmong headword — the entry is otherwise complete and correctly tagged.
      // { id: 'animal-ntses-salmon', hmongRPA: 'ntses salmon', english: 'salmon', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null },
      { id: 'animal-ntses-pas-vas', hmongRPA: 'ntses pas vas', english: 'whale', category: 'animals', tags: ['noun','sea-animal','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntses pas vas loj heev.', english: 'The whale is very large.', source: 'ai' } },
      { id: 'animal-yaj-yuam', hmongRPA: 'yaj yuam', english: 'peacock', category: 'animals', tags: ['noun','bird','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus yaj yuam muaj plaub zoo nkauj.', english: 'The peacock has beautiful feathers.', source: 'ai' } },
      { id: 'animal-ntsuam', hmongRPA: 'ntsuam', english: 'ant', category: 'animals', tags: ['noun','insect','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus ntsuam saum rooj.', english: 'There is an ant on the table.', source: 'ai' } },
      { id: 'animal-kheb', hmongRPA: 'kheb', english: 'alligator', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kheb nyob hauv dej.', english: 'The alligator is in the water.', source: 'ai' } },
      { id: 'animal-ntseeb', hmongRPA: 'ntseeb', english: 'wasp', category: 'animals', tags: ['noun','insect','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus ntseeb nyob saum ru tsev.', english: 'There is a wasp on the roof.', source: 'ai' } },
      { id: 'animal-yoov', hmongRPA: 'yoov', english: 'fly', category: 'animals', tags: ['noun','insect','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus yoov ya ncig saum rooj.', english: 'The fly circles above the table.', source: 'ai' } },
      { id: 'animal-nas-ncuav', hmongRPA: 'nas ncuav', english: 'squirrel', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus nas ncuav nce saum tsob ntoo.', english: 'The squirrel climbs the tree.', source: 'ai' } },
      { id: 'animal-nas-tsuag', hmongRPA: 'nas tsuag', english: 'rat', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas tsuag nyob hauv tsev.', english: 'There is a rat in the house.', source: 'ai' } },  // Was: 'Muaj ib tus nas tsuag hauv tsev.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'animal-cua-nab', hmongRPA: 'cua nab', english: 'worm; earthworm', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus cua nab nyob hauv av.', english: 'The earthworm lives in the soil.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      // Classifier removed from the headword 2026-09-21 (was `tus kas`) — the author's
      // ruling: animal decks teach the NAME. ⚠️ needs-review: this deck now has two
      // words for goat, `kas` and `tshis` (animal-tshis). One may be regional or wrong.
      { id: 'misc-tus-kas', hmongRPA: 'kas', english: 'goat', category: 'animals', tags: ['noun', 'animals', 'needs-review'], audioFile: null },
      { id: 'misc-nas', hmongRPA: 'nas', english: 'mouse, rat', category: 'animals', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas nyob hauv chav ua mov.', english: 'There is a mouse in the kitchen.', source: 'ai' } },  // Was: 'Muaj ib tus nas hauv chav ua mov.' — a being somewhere takes nyob (author, 2026-09-28)
      // ⚠️ REDUNDANT, commented out 2026-09-21. With the classifier removed this is just
      // `luav`, which `animals-rabbits` already teaches. The gloss was a story artifact.
      // { id: 'misc-tus-luav', hmongRPA: 'tus luav', english: 'the rabbit', category: 'animals', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-nplai', hmongRPA: 'nplai', english: 'scales (fish)', category: 'animals', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    description: 'Foods and dishes.',
    emoji: '🍚',
    words: [
      {
        id: 'food-rice',
        hmongRPA: 'mov',
        english: 'cooked rice',
        senses: [{ en: 'cooked rice', context: 'food' }, { en: 'food in general, when the point is the meal rather than the grain — “noj mov” is to eat, not specifically to eat rice', context: 'reading' }],
        category: 'food',
        tags: ['staple', 'reviewed'],
        audioFile: null,
        // ⚠️ This entry's own example was already the second sense: "Koj noj mov
        // tau?" is glossed "Have you eaten?", not "have you eaten rice?" — the
        // evidence sat here the whole time while the headword said only rice.
        exampleSentence: { hmong: 'Koj noj mov tau?', english: 'Have you eaten?' },
      },
      {
        // Added alongside the 'mov' = food correction: this is the unambiguous
        // general term, and the app already used it inside 'lub khw muas zaub
        // mov' (the grocery store) without ever defining it.
        // ⚠️ 'unreviewed' on purpose — inferred, not confirmed by a speaker.
        id: 'food-zaub-mov',
        hmongRPA: 'zaub mov',
        english: 'food; groceries — literally “vegetables and rice”, the usual way to say food in general',
        category: 'food',
        tags: ['staple', 'unreviewed'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub khw muas zaub mov.', english: 'The grocery store.' },
      },
      {
        id: 'food-water',
        hmongRPA: 'dej',
        english: 'water',
        category: 'food',
        tags: ['drink'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv haus dej txhua hnub.', english: 'I drink water every day.', source: 'ai' },
      },
      {
        id: 'food-meat',
        hmongRPA: 'nqaij',
        english: 'meat',
        category: 'food',
        tags: ['protein'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam noj nqaij.', english: 'I like eating meat.', source: 'ai' },
      },
      // ── Split out of `food-drinks` on 2026-09-20 ──
      { id: 'food-qhaub-cij', hmongRPA: 'qhaub cij', english: 'bread', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj qhaub cij thaum sawv ntxov.', english: 'I eat bread in the morning.', source: 'ai' } },
      { id: 'food-pluas-tshais', hmongRPA: 'pluas tshais', english: 'breakfast', category: 'food', tags: ['noun','meal','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj pluas tshais thaum sawv ntxov.', english: 'I eat breakfast in the morning.', source: 'ai' } },
      { id: 'food-pluas-hmo', hmongRPA: 'pluas hmo', english: 'dinner', category: 'food', tags: ['noun','meal','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj pluas hmo ua ke.', english: 'We eat dinner together.', source: 'ai' } },
      { id: 'food-hmoov', hmongRPA: 'hmoov', english: 'flour; powder', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav hmoov ua mov.', english: 'I will buy flour to make food.', source: 'ai' } },
      { id: 'food-ntses', hmongRPA: 'ntses', english: 'fish', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj ntses.', english: 'I like eating fish.', source: 'ai' } },
      { id: 'food-mov', hmongRPA: 'mov', english: 'cooked rice; food', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov thaum tav su.', english: 'I eat food at noon.', source: 'ai' } },
      { id: 'food-khoom-noj', hmongRPA: 'khoom noj', english: 'food', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj khoom noj hauv tsev.', english: 'There is food in the house.', source: 'ai' } },
      { id: 'food-zib-ntab', hmongRPA: 'zib ntab', english: 'honey', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab zib ntab rau tshuaj yej.', english: 'I put honey in tea.', source: 'ai' } },
      { id: 'food-pluas-su', hmongRPA: 'pluas su', english: 'lunch', category: 'food', tags: ['noun','meal','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj pluas su ua ke.', english: 'We eat lunch together.', source: 'ai' } },
      { id: 'food-pluas-tav-su', hmongRPA: 'pluas tav su', english: 'lunch — the "tav su" (midday) meal', category: 'food', tags: ['noun','meal','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj pluas tav su ua ke.', english: 'We eat lunch together.', source: 'ai' } },
      // ⚠️ REDUNDANT, commented out 2026-09-21. Exact duplicate of `food-meat` — same deck,
      // same headword, same gloss — created when `food-drinks` was merged into `food`.
      // { id: 'food-nqaij', hmongRPA: 'nqaij', english: 'meat', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null },
      { id: 'food-kua-ntswv', hmongRPA: 'kua ntswv', english: 'sauce', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab kua ntswv rau mov.', english: 'I put sauce on the food.', source: 'ai' } },
      { id: 'food-kua-hau', hmongRPA: 'kua hau', english: 'soup — literally "hau" (boiled) liquid', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj kua hau kub.', english: 'I like eating hot soup.', source: 'ai' } },
      // ⚠️ needs-review. Probably a typo for `roj zaub`: this app glosses `nroj` as WEED
      // (bot-nroj, misc-nroj), and oil is `roj`. Same class as `plab jlaub` for `plab hlaub`.
      // Was hmongRPA 'nroj zaub' (nroj = weeds, grass) — vegetable oil is roj zaub (roj = oil).
      // GPT fact-check 2026-09-27, high confidence. Id kept so progress survives.
      { id: 'food-nroj-zaub', hmongRPA: 'roj zaub', english: 'vegetable oil', category: 'food', tags: ['noun','food','unreviewed','needs-review'], audioFile: null, exampleSentence: { hmong: 'Kuv siv roj zaub ua noj.', english: 'I use vegetable oil for cooking.', source: 'ai' } },
      { id: 'food-kua-qaub', hmongRPA: 'kua qaub', english: 'vinegar', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab kua qaub rau zaub.', english: 'I put vinegar on the vegetables.', source: 'ai' } },
      { id: 'food-txiv-ntoo-thiab-zaub', hmongRPA: 'txiv ntoo thiab zaub', english: 'fruits and vegetables', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj txiv ntoo thiab zaub.', english: 'I eat fruits and vegetables.', source: 'ai' } },
      { id: 'food-cov-qhob-noom', hmongRPA: 'cov qhob noom', english: 'candy', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam nyiam cov qhob noom.', english: 'The children like candy.', source: 'ai' } },
      { id: 'food-khoom-txom-ncauj', hmongRPA: 'khoom txom ncauj', english: 'snack', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nqa khoom txom ncauj mus kawm.', english: 'I bring a snack to class.', source: 'ai' } },
      { id: 'food-tshuaj-yej', hmongRPA: 'tshuaj yej', english: 'tea', category: 'food', tags: ['noun','drink','food','unreviewed','needs-review'], audioFile: null },
      { id: 'food-xam-lav', hmongRPA: 'xam lav', english: 'salad', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj xam lav.', english: 'I like eating salad.', source: 'ai' } },
      { id: 'food-ib-pluas-mov', hmongRPA: 'ib pluas mov', english: 'meal', category: 'food', tags: ['noun','meal','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj ib pluas mov.', english: 'I eat a meal.', source: 'ai' } },
      { id: 'food-kua-dias', hmongRPA: 'kua dias', english: 'soup', category: 'food', tags: ['noun','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj kua dias.', english: 'I like eating soup.', source: 'ai' } },
    ],
  },
  // {
  //   id: 'tsevneeg',
  //   title: 'Family / Tsev Neeg',
  //   description: 'Family members.',
  //   emoji: '👨‍👩‍👧',
  //   words: [
  //     {
  //       id: 'family-mother',
  //       hmongRPA: 'niam',
  //       english: 'mother',
  //       whiteHmong: 'niam',
  //       greenHmong: 'naam',
  //       category: 'family',
  //       tags: ['parent'],
  //       audioFile: null,
  //       exampleSentence: { hmong: 'Kuv niam ua mov.', english: 'My mother cooks rice.' },
  //     },
  //     {
  //       id: 'family-father',
  //       hmongRPA: 'txiv',
  //       english: 'father',
  //       category: 'family',
  //       tags: ['parent'],
  //       audioFile: null,
  //     },
  //     {
  //       id: 'family-sibling',
  //       hmongRPA: 'kwv tij',
  //       english: 'siblings / brothers',
  //       category: 'family',
  //       tags: ['relative'],
  //       audioFile: null,
  //     },
  //   ],
  // },

  {
    id: 'family-male-perspective',
    title: 'Tsev Neeg — Family (Male Speaker)',
    description: 'Kinship terms as used by a male speaker. Sibling words differ by the speaker\'s gender in Hmong.',
    emoji: '👨',
    words: [
      // ---- Siblings (gender-specific to a MALE speaker) ----
      {
        id: 'family-m-tijlaug',
        hmongRPA: 'tij laug',
        english: 'older brother (man\'s)',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus tij laug.', english: 'My older brother.' },
      },
      {
        id: 'family-m-kwv',
        hmongRPA: 'kwv',
        english: 'younger brother (man\'s)',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus kwv.', english: 'My younger brother.' },
      },
      {
        id: 'family-m-muam',
        hmongRPA: 'muam',
        english: 'sister (a man\'s sister)',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus muam.', english: 'My sister.' },
        // note: a male calls his sister 'muam'. He does NOT use 'nus' or 'viv ncaus'.
      },
      {
        id: 'family-m-kwvtij',
        hmongRPA: 'kwv tij',
        english: 'brothers / male patrilineal kin',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'sibling', 'clan'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb yog kwv tij.', english: 'We are brothers/kin.' },
        // note: collective term for a man's brothers and clan relatives. Culturally central for males.
      },
      // ---- Parents (same for any speaker) ----
      {
        id: 'family-m-txiv',
        hmongRPA: 'txiv',
        // ⚠️ `english` is the FAMILY gloss only — this is what the flashcard
        // shows. The fruit sense is real but belongs to `food`, and a family
        // card that teaches it is testing something it never asked about.
        // The reader tap still gets everything, via `senses`. See lib/senses.js.
        english: 'father',
        senses: [
          { en: 'father', context: 'family' },
          { en: 'husband', context: 'reading' },
          { en: 'man; adult male', context: 'reading', note: 'in "txiv neej"' },
          { en: 'fruit', context: 'food', note: 'in fruit names, e.g. "txiv lws suav"' },
        ],
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'parent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv leej txiv.', english: 'My father.' },
      },
      {
        id: 'family-m-niam',
        hmongRPA: 'niam',
        english: 'mother',
        senses: [{ en: 'mother', context: 'family' }, { en: 'female / woman element in kinship, gender, and animal compounds', context: 'reading' }],
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'parent', 'reviewed'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv leej niam.', english: 'My mother.' },
      },
      {
        id: 'family-m-niamtxiv',
        hmongRPA: 'niam txiv',
        english: 'parents',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'parent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam txiv.', english: 'My parents.' },
      },
      // ---- Spouse & children (same for any speaker) ----
      {
        id: 'family-m-pojniam',
        hmongRPA: 'poj niam',
        english: 'wife',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'spouse'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus poj niam.', english: 'My wife.' },
      },
      {
        id: 'family-m-tub',
        hmongRPA: 'tub',
        // ⚠️ "tub ceev xwm = police officer" is a true compound and a useless
        // answer on a FAMILY card. Kept for the reader, tagged out of the deck.
        english: 'son; boy',
        senses: [
          { en: 'son; boy', context: 'family' },
          { en: 'male-person / role element in compounds', context: 'reading' },
          { en: 'tub hluas = young man', context: 'reading' },
          { en: 'tub ceev xwm = police officer; police', context: 'reading' },
        ],
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'child', 'reviewed'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus tub.', english: 'My son.' },
      },
      {
        id: 'family-m-ntxhais',
        hmongRPA: 'ntxhais',
        english: 'daughter',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'child'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus ntxhais.', english: 'My daughter.' },
      },
      // ---- Grandparents (same for any speaker; differ by SIDE of family) ----
      {
        id: 'family-m-yawg',
        hmongRPA: 'yawg',
        english: 'paternal grandfather',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawg nyob tom zos.', english: 'My paternal grandfather lives in the village.', source: 'ai' },
      },
      {
        id: 'family-m-pog',
        hmongRPA: 'pog',
        english: 'paternal grandmother',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pog nyob tom zos.', english: 'My paternal grandmother lives in the village.', source: 'ai' },
      },
      {
        id: 'family-m-yawm-txiv',
        hmongRPA: 'yawm txiv',
        english: 'maternal grandfather',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawm txiv nyiam nuv ntses.', english: 'My maternal grandfather likes fishing.', source: 'ai' },
      },
      {
        id: 'family-m-niam-tais',
        hmongRPA: 'niam tais',
        english: 'maternal grandmother',
        category: 'family-male-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam tais nyob tom zos.', english: 'My maternal grandmother lives in the village.', source: 'ai' },
      },
    ],
  },
  {
    id: 'family-female-perspective',
    title: 'Tsev Neeg — Family (Female Speaker)',
    description: 'Kinship terms as used by a female speaker. The sibling words differ from a male speaker\'s.',
    emoji: '👩',
    words: [
      // ---- Siblings (gender-specific to a FEMALE speaker) ----
      {
        id: 'family-f-nus',
        hmongRPA: 'nus',
        english: 'brother (a woman\'s brother)',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus nus.', english: 'My brother.' },
        // note: a female calls her brother 'nus' regardless of his age. She does NOT use 'tij laug' or 'kwv' for her own brother.
      },
      {
        id: 'family-f-niam-laus',
        hmongRPA: 'niam laus',
        english: 'older sister',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus niam laus.', english: 'My older sister.' },
        // note: also 'niam hlob' regionally. Verify which your curriculum uses.
      },
      {
        id: 'family-f-niam-hluas',
        hmongRPA: 'niam hluas',
        english: 'younger sister',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        // note: 'niam hluas' has a separate "younger wife" sense in other contexts; here it is the sibling meaning.
        exampleSentence: { hmong: 'Kuv niam hluas nyob tom tsev.', english: 'My younger sister is at home.', source: 'ai' },
      },
      {
        id: 'family-f-vivncaus',
        hmongRPA: 'viv ncaus',
        english: 'sisters / female siblings & cousins (collective)',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        // note: relational/collective term used among females, parallel to a man's 'kwv tij'.
        exampleSentence: { hmong: 'Kuv viv ncaus nyob ua ke.', english: 'My sisters live together.', source: 'ai' },
      },
      // ---- Parents (same for any speaker) ----
      {
        id: 'family-f-txiv',
        hmongRPA: 'txiv',
        english: 'father',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'parent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv leej txiv.', english: 'My father.' },
      },
      {
        id: 'family-f-niam',
        // ⚠️ NOT A DUPLICATE OF family-m-niam, though an applier treated it as
        // one and commented this line out — which left a live entry with no
        // headword, rendering as "undefined" on the female-perspective deck.
        // The two perspectives teach the same word from different sides and
        // both decks need their own card. Duplicate senses are already handled
        // where they should be: wordLookup dedupes on the text when merging.
        hmongRPA: 'niam',
        english: 'mother',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'parent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv leej niam.', english: 'My mother.' },
      },
      {
        id: 'family-f-niamtxiv',
        hmongRPA: 'niam txiv',
        english: 'parents',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'parent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam txiv.', english: 'My parents.' },
      },
      // ---- Spouse & children (same for any speaker) ----
      {
        id: 'family-f-txiv-husband',
        hmongRPA: 'txiv',
        english: 'husband',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'spouse'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus txiv.', english: 'My husband.' },
        // note: 'tus txiv' in spousal context = husband; 'leej txiv' = father. Classifier + context disambiguate.
      },
      {
        id: 'family-f-tub',
        // ⚠️ Same as family-f-niam above: restored after an applier commented
        // out the headword line of a multi-line entry, thinking it was
        // suppressing a whole duplicate.
        hmongRPA: 'tub',
        // ⚠️ Worded identically to family-m-tub on purpose. The merge dedupes on
        // exact text, so "son" beside "son; boy" is not caught and the reader
        // tap ends "…police officer · son".
        english: 'son; boy',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'child'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus tub.', english: 'My son.' },
      },
      {
        id: 'family-f-ntxhais',
        hmongRPA: 'ntxhais',
        english: 'daughter',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'child'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus ntxhais.', english: 'My daughter.' },
      },
      // ---- Grandparents (same for any speaker; differ by SIDE of family) ----
      {
        id: 'family-f-yawg',
        hmongRPA: 'yawg',
        english: 'paternal grandfather',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawg nyiam cog ntoo.', english: 'My paternal grandfather likes planting trees.', source: 'ai' },
      },
      {
        id: 'family-f-pog',
        hmongRPA: 'pog',
        english: 'paternal grandmother',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pog nyiam ua mov.', english: 'My grandmother enjoys cooking.', source: 'ai' },
      },
      {
        id: 'family-f-yawm-txiv',
        hmongRPA: 'yawm txiv',
        english: 'maternal grandfather',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawm txiv nyiam nuv ntses.', english: 'My maternal grandfather likes fishing.', source: 'ai' },
      },
      {
        id: 'family-f-niam-tais',
        hmongRPA: 'niam tais',
        english: 'maternal grandmother',
        category: 'family-female-perspective',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam tais nyob tom zos.', english: 'My maternal grandmother lives in the village.', source: 'ai' },
      },
    ],
  },
  // relatives

  {
    id: 'relatives',
    title: 'Cov Txheeb Ze — Relatives & Extended Family',
    description: 'Extended Hmong kinship: terms encode side of family, relative age, and blood vs. marriage ties.',
    emoji: '👪',
    words: [
      {
        id: 'relatives-txheeb-ze',
        hmongRPA: 'cov txheeb ze',
        english: 'relatives; kin',
        category: 'relatives',
        tags: ['noun', 'family', 'collective'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb cov txheeb ze.', english: 'Our relatives.' },
      },
      {
        id: 'relatives-kwvtij',
        hmongRPA: 'cov kwv tij',
        english: 'paternal family / patrilineal clan relatives',
        category: 'relatives',
        tags: ['noun', 'family', 'paternal', 'collective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv cov kwv tij nyob deb.', english: "My father's relatives live far away.", source: 'ai' },
      },
      {
        id: 'relatives-neejtsa',
        hmongRPA: 'cov neej tsa',
        english: 'maternal relatives; wife\'s/mother\'s side',
        category: 'relatives',
        tags: ['noun', 'family', 'maternal', 'collective'],
        audioFile: null,
        // note: 'neej tsa' often refers specifically to relatives by marriage on the maternal/wife's side. Verify the exact scope your curriculum intends.
        exampleSentence: { hmong: 'Peb mus xyuas cov neej tsa.', english: 'We are visiting our maternal relatives.', source: 'ai' },
      },
      {
        id: 'relatives-yawg-koob',
        hmongRPA: 'yawg koob',
        english: 'great-grandfather',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawg koob laus heev.', english: 'My great-grandfather is very old.', source: 'ai' },
      },
      {
        id: 'relatives-pog-koob',
        hmongRPA: 'pog koob',
        english: 'great-grandmother',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pog koob nyob pem roob.', english: 'My great-grandmother lives in the mountains.', source: 'ai' },
      },
      {
        id: 'relatives-yawg',
        hmongRPA: 'yawg',
        english: 'paternal grandfather',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent', 'paternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawg nyiam cog zaub.', english: 'My grandfather likes growing vegetables.', source: 'ai' },
      },
      {
        id: 'relatives-pog',
        hmongRPA: 'pog',
        english: 'paternal grandmother',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent', 'paternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv pog ua mov qab heev.', english: 'My grandmother makes delicious food.', source: 'ai' },
      },
      {
        id: 'relatives-yawm-txiv',
        hmongRPA: 'yawm txiv',
        english: 'maternal grandfather',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent', 'maternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yawm txiv qhia kuv ua noj.', english: 'My maternal grandfather teaches me to cook.', source: 'ai' },
      },
      {
        id: 'relatives-niam-tais',
        hmongRPA: 'niam tais',
        english: 'maternal grandmother',
        category: 'relatives',
        tags: ['noun', 'family', 'grandparent', 'maternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Niam tais hu kuv tuaj noj mov.', english: 'Grandmother calls me over for a meal.', source: 'ai' },
      },
      {
        id: 'relatives-txiv-hlob',
        hmongRPA: 'txiv hlob',
        english: 'father\'s older brother (paternal uncle)',
        category: 'relatives',
        tags: ['noun', 'family', 'uncle', 'paternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv txiv hlob.', english: 'My (paternal) older uncle.' },
        // note: source listed 'Hlob' and 'Txiv (Txiv Hlob)' separately; 'txiv hlob' = father's older brother. 'hlob' alone just means "big/eldest." Consolidated.
      },
      {
        id: 'relatives-txiv-ntxawm',
        hmongRPA: 'txiv ntxawm',
        english: 'father\'s younger brother (paternal uncle)',
        category: 'relatives',
        tags: ['noun', 'family', 'uncle', 'paternal'],
        audioFile: null,
        // note: source 'Txiv Ntxawm'; sometimes 'txiv ntxawg' regionally. Verify.
        exampleSentence: { hmong: 'Kuv txiv ntxawm ua liaj ua teb.', english: 'My paternal uncle farms.', source: 'ai' },
      },
      {
        id: 'relatives-phauj',
        hmongRPA: 'phauj',
        english: 'father\'s sister (paternal aunt)',
        category: 'relatives',
        tags: ['noun', 'family', 'aunt', 'paternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus phauj.', english: 'My (paternal) aunt.' },
      },
      {
        id: 'relatives-dablaug',
        hmongRPA: 'dab laug',
        english: 'mother\'s brother (maternal uncle)',
        category: 'relatives',
        tags: ['noun', 'family', 'uncle', 'maternal'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tus dab laug.', english: 'My (maternal) uncle.' },
      },
      {
        id: 'relatives-tais',
        hmongRPA: 'tais',
        english: 'mother\'s sister (maternal aunt)',
        category: 'relatives',
        tags: ['noun', 'family', 'aunt', 'maternal'],
        audioFile: null,
        // note: 'mother's sister' is widely 'niam tais' / 'niam hluas' / 'niam laus' depending on her age relative to one's mother. 'tais' alone as "aunt" — verify; it may be a shortening.
        exampleSentence: { hmong: 'Kuv tais nyob hauv nroog.', english: 'My maternal aunt lives in the city.', source: 'ai' },
      },
      {
        id: 'relatives-niam-hlob',
        hmongRPA: 'niam hlob',
        english: 'wife of father\'s older brother (paternal aunt by marriage)',
        category: 'relatives',
        tags: ['noun', 'family', 'aunt', 'paternal', 'by-marriage'],
        audioFile: null,
        // note: 'niam hlob' also commonly = "older sister" (female perspective) and "father's older brother's wife." Two senses; context disambiguates. Worth a usage note for learners.
        exampleSentence: { hmong: 'Kuv niam hlob nyiam xaws khaub ncaws.', english: 'My paternal aunt likes sewing clothes.', source: 'ai' },
      },
      {
        id: 'relatives-niam-ntxawm',
        hmongRPA: 'niam ntxawm',
        english: 'wife of father\'s younger brother (paternal aunt by marriage)',
        category: 'relatives',
        tags: ['noun', 'family', 'aunt', 'paternal', 'by-marriage'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam ntxawm muaj ib lub vaj.', english: 'My aunt has a garden.', source: 'ai' },
      },
      {
        id: 'relatives-yawg-laus',
        hmongRPA: 'yawg laus',
        english: 'husband of father\'s sister (paternal aunt\'s husband)',
        category: 'relatives',
        tags: ['noun', 'family', 'uncle', 'paternal', 'by-marriage'],
        audioFile: null,
        // note: regional variation exists for paternal aunt's husband; some communities use 'yawm yij'. Verify against your source community.
        exampleSentence: { hmong: 'Kuv yawg laus nyiam nuv ntses.', english: "My aunt's husband enjoys fishing.", source: 'ai' },
      },
      {
        id: 'relatives-niam-dablaug',
        hmongRPA: 'niam dab laug',
        english: 'wife of mother\'s brother (maternal uncle\'s wife)',
        category: 'relatives',
        tags: ['noun', 'family', 'aunt', 'maternal', 'by-marriage'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam dab laug ua zaub mov.', english: "My maternal uncle's wife cooks food.", source: 'ai' },
      },
      {
        id: 'relatives-yawm-yij',
        hmongRPA: 'yawm yij',
        english: 'husband of mother\'s sister (maternal aunt\'s husband)',
        category: 'relatives',
        tags: ['noun', 'family', 'uncle', 'maternal', 'by-marriage'],
        audioFile: null,
        // note: source listed BOTH 'Yawm Txiv (Tais)' and 'Yawm Yij' as maternal aunt's husband, and 'Yawm Yij' also as "sister's husband." These overlap/conflict. 'yawm yij' = husband of mother's sister is the form I can verify; the "sister's husband" sense needs review.
        exampleSentence: { hmong: 'Kuv yawm yij nyiam ua teb.', english: "My aunt's husband likes farming.", source: 'ai' },
      },
      // ---- Sibling terms (perspective-dependent) ----
      {
        id: 'relatives-tijlaug',
        hmongRPA: 'tij laug',
        english: 'older brother (male speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tij laug pab kuv kawm.', english: 'My older brother helps me study.', source: 'ai' },
      },
      {
        id: 'relatives-kwv',
        hmongRPA: 'kwv',
        english: 'younger brother (male speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv kwv nyiam ncaws pob.', english: 'My younger brother likes playing soccer.', source: 'ai' },
      },
      {
        id: 'relatives-muam',
        hmongRPA: 'muam',
        english: 'sister (male speaker\'s sister)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv muam kawm ntawv zoo.', english: 'My sister does well in school.', source: 'ai' },
      },
      {
        id: 'relatives-nus',
        hmongRPA: 'nus',
        english: 'brother (female speaker\'s brother, any age)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        // note: source glossed 'nus' as "younger brother (female perspective)." 'nus' is AGE-NEUTRAL — a woman's brother regardless of age. Corrected.
        exampleSentence: { hmong: 'Kuv nus hu kuv naghmo.', english: 'My brother called me yesterday.', source: 'ai' },
      },
      {
        id: 'relatives-kwvlaug',
        hmongRPA: 'kwv laug',
        english: 'older brother (female speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        // note: source gives 'kwv laug' = older brother (female perspective), which sits awkwardly beside age-neutral 'nus'. I cannot confidently confirm this contrast. FLAG for fluent-speaker review before teaching.
        exampleSentence: { hmong: 'Kuv kwv laug ua haujlwm hauv nroog.', english: 'My older brother works in the city.', source: 'ai' },
      },
      {
        id: 'relatives-niam-laus',
        hmongRPA: 'niam laus',
        english: 'older sister (female speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam laus nyiam nyeem ntawv.', english: 'My older sister likes reading.', source: 'ai' },
      },
      {
        id: 'relatives-niam-hluas',
        hmongRPA: 'niam hluas',
        english: 'younger sister (female speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'sibling'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam hluas tseem kawm ntawv.', english: 'My younger sister is still in school.', source: 'ai' },
      },
      // ---- In-law / sibling's spouse terms ----
      {
        id: 'relatives-txiv-laus',
        hmongRPA: 'txiv laus',
        english: 'older sister\'s husband',
        category: 'relatives',
        tags: ['noun', 'family', 'in-law', 'by-marriage'],
        audioFile: null,
        // note: 'txiv laus' for older sister's husband — verify; 'yawm yij' / 'phauj txiv'-type forms vary by region and by speaker's relation.
        exampleSentence: { hmong: 'Kuv txiv laus ua haujlwm txhua hnub.', english: "My older sister's husband works every day.", source: 'ai' },
      },
      {
        id: 'relatives-niam-tij',
        hmongRPA: 'niam tij',
        english: 'older brother\'s wife (sister-in-law)',
        category: 'relatives',
        tags: ['noun', 'family', 'in-law', 'by-marriage'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam tij ua mov qab heev.', english: 'My sister-in-law makes great food.', source: 'ai' },
      },
      {
        id: 'relatives-tij-nyab',
        hmongRPA: 'tij nyab',
        english: 'brother\'s wife (female speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'in-law', 'by-marriage'],
        audioFile: null,
        // note: source 'Tis nyab'; corrected to 'tij nyab'. 'nyab' = daughter-in-law/wife-of. Verify the perspective gloss.
        exampleSentence: { hmong: 'Kuv tij nyab muaj ob tus menyuam.', english: "My brother's wife has two children.", source: 'ai' },
      },
      {
        id: 'relatives-niam-ntxawm-sil',
        hmongRPA: 'niam ntxawm',
        english: 'brother\'s wife (male speaker)',
        category: 'relatives',
        tags: ['noun', 'family', 'in-law', 'by-marriage'],
        audioFile: null,
        // note: source 'Niam Ntaxwm'; corrected spelling to 'niam ntxawm'. NOTE this collides with the paternal "wife of father's younger brother" entry above — same surface form, different relation. Distinct id used. Verify both senses.
        exampleSentence: { hmong: 'Kuv niam ntxawm nyob ze peb.', english: 'My sister-in-law lives near us.', source: 'ai' },
      },
      {
        id: 'relatives-kuv',
        hmongRPA: 'kuv',
        english: '(pronoun: I, me)',
        category: 'relatives',
        tags: ['pronoun'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' },
        // note: 'kuv' is the 1st-person pronoun, included in your source presumably as the "ego" anchor of the kinship chart. Tagged pronoun, not a kinship noun.
      },
    ],
  },

  {
    id: 'nature',
    title: 'Nature',
    description: 'Nature and the outdoors.',
    emoji: '🌿',
    words: [
      // ── Split out of `geography-nature-weather` on 2026-09-20 ──
      // This category existed with ZERO words until now. It is the natural
      // home for the `nat-*` set, so the split filled it instead of adding a
      // near-twin beside it.
      { id: 'nat-huab-cua', hmongRPA: 'huab cua', english: 'air; weather', category: 'nature', tags: ['noun','nature','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Huab cua hnub no zoo heev.', english: 'The weather is beautiful today.', source: 'ai' } },
      { id: 'nat-kev-tsaus-ntuj', hmongRPA: 'kev tsaus ntuj', english: 'darkness', category: 'nature', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb ntshai kev tsaus ntuj heev.', english: 'We are very afraid of darkness.', source: 'ai' } },
      { id: 'nat-suab-ncha', hmongRPA: 'suab ncha', english: 'echo', category: 'nature', tags: ['noun','nature','sound','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Suab ncha rov los ntawm roob.', english: 'An echo comes back from the mountain.', source: 'ai' } },
      { id: 'nat-zog-hluav-taws-xob', hmongRPA: 'zog hluav taws xob', english: 'energy; electricity', category: 'nature', tags: ['noun','nature','science','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb siv zog hluav taws xob txhua hnub.', english: 'We use electricity every day.', source: 'ai' } },
      { id: 'nat-kev-kub', hmongRPA: 'kev kub', english: 'heat; temperature', category: 'nature', tags: ['noun','nature','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev kub hauv tsev siab heev.', english: 'The heat inside the house is intense.', source: 'ai' } },
      { id: 'nat-dej-khov', hmongRPA: 'dej khov', english: 'ice', category: 'nature', tags: ['noun','nature','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab dej khov rau hauv khob.', english: 'I put ice into the cup.', source: 'ai' } },
      { id: 'nat-duab-ci', hmongRPA: 'duab ci', english: 'light; brightness', category: 'nature', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub hnub muaj duab ci heev.', english: 'The sunlight is very bright.', source: 'ai' } },
      { id: 'nat-suab', hmongRPA: 'suab', english: 'sound; noise', category: 'nature', tags: ['noun','nature','sound','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hnov ib lub suab txawv.', english: 'I hear a strange sound.', source: 'ai' } },
      { id: 'nat-nrov', hmongRPA: 'nrov', english: 'loud', category: 'nature', tags: ['adjective','sound','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb no nrov heev.', english: 'This car is very loud.', source: 'ai' } },
      { id: 'nat-kev-ceev', hmongRPA: 'kev ceev', english: 'speed', category: 'nature', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb no muaj kev ceev siab.', english: 'This car has a high speed.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-zoov-nuj-txeeg', hmongRPA: 'zoov nuj txeeg', english: 'jungle; forest', category: 'nature', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-qab-ntug', hmongRPA: 'qab ntug', english: 'the horizon', category: 'nature', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-plua-plav', hmongRPA: 'plua plav', english: 'dust', category: 'nature', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nplaim', hmongRPA: 'nplaim', english: 'flame; surface of water (waves)', category: 'nature', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },
  // {
  //   id: 'household',
  //   title: 'Household',
  //   description: 'Items around the home.',
  //   emoji: '🏠',
  //   words: [
  //     {
  //       id: 'household-house',
  //       hmongRPA: 'tsev',
  //       english: 'house / home',
  //       category: 'household',
  //       tags: ['structure'],
  //       audioFile: null,
  //     },
  //   ],
  // },
  {
    id: 'classifiers',
    // Was title 'Classifiers', description 'Hmong Classifiers' — 2026-09-28 (author: these are the
    // PRIMARY classifiers, the ones in everyday speech and reading; classifier-inventory holds the rest).
    title: 'Primary Classifiers',
    description: 'The classifiers of everyday speech and reading — tus, lub, daim, rab, txoj and more.',
    emoji: '🏷️',
    words: [
      {
        id: 'classifiers-tus',
        hmongRPA: 'tus',
        // ⚠️ SENSE REMOVED 2026-09-30, author's ruling: `tus` is for PEOPLE,
        // ANIMALS AND LIVING THINGS. It is NOT the classifier for long, narrow
        // things — that is `txoj`. The removed sense read:
        //   { en: 'classifier for long, narrow or individually identified
        //     objects', context: 'reading' }
        // Left in, it taught learners `tus kev` for a road, which contradicts
        // the txoj kev ruling elsewhere in this file. Restore only if the
        // author reverses this.
        english: 'classifier for people, animals, and living things',
        senses: [{ en: 'classifier for people, animals, and living things', context: 'classifiers' }, { en: 'the one; that individual — used pronominally when the noun is known', context: 'reading' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-tus.mp3',
        exampleSentence: { hmong: 'Kuv muaj ib tus aub.', english: 'I have one dog.' },
      },
      {
        id: 'classifiers-lub',
        hmongRPA: 'lub',
        english: 'classifier for round, solid, enclosed or general whole objects',
        senses: [{ en: 'classifier for round, solid, enclosed or general whole objects', context: 'classifiers' }, { en: 'the; that particular — makes a singular noun phrase definite in context', context: 'reading' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-lub.mp3',
        exampleSentence: { hmong: 'Ib lub tsev.', english: 'One house.' },
      },
      {
        id: 'classifiers-phau',
        hmongRPA: 'phau',
        english: '(classifier for books & bound documents)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-phau.mp3',
        exampleSentence: { hmong: 'Ib phau ntawv.', english: 'One book.' },
      },
      {
        id: 'classifiers-zaj',
        hmongRPA: 'zaj',
        english: '(classifier for songs, stories, speeches & dragon-like figures)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-zaj.mp3',
        exampleSentence: { hmong: 'Ib zaj dab neeg.', english: 'One story.' },
      },
      {
        id: 'classifiers-txoj',
        hmongRPA: 'txoj',
        english: 'classifier for roads, paths, lines, rivers, rules, lives and long flexible things',
        senses: [{ en: 'classifier for roads, paths, lines, rivers, rules, lives and long flexible things', context: 'classifiers' }, { en: 'classifier for an abstract course, rule or life — "txoj cai", the law', context: 'reading' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-txoj.mp3',
        exampleSentence: { hmong: 'Ib txoj kev.', english: 'One road.' },
      },
      {
        id: 'classifiers-rab',
        hmongRPA: 'rab',
        english: '(classifier for tools, weapons & long rigid implements)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-rab.mp3',
        exampleSentence: { hmong: 'Ib rab riam.', english: 'One knife.' },
      },
      {
        id: 'classifiers-hnab',
        hmongRPA: 'hnab',
        english: '(classifier for bags & sacks)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-hnab.mp3',
        exampleSentence: { hmong: 'Ib hnab nplej.', english: 'One bag of rice.' },
      },
      {
        id: 'classifiers-daim',
        hmongRPA: 'daim',
        english: '(classifier for flat objects: paper, cloth, mats, maps, land)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-daim.mp3',
        exampleSentence: { hmong: 'Ib daim ntawv.', english: 'One sheet of paper.' },
      },
      {
        id: 'classifiers-khob',
        hmongRPA: 'khob',
        english: '(classifier for cups/glasses of liquid)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-khob.mp3',
        exampleSentence: { hmong: 'Ib khob dej.', english: 'One cup of water.' },
      },
      {
        id: 'classifiers-nplooj',
        hmongRPA: 'nplooj',
        english: '(classifier for leaves & pages)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-nplooj.mp3',
        exampleSentence: { hmong: 'Ib nplooj ntawv.', english: 'One page.' },
      },
      {
        id: 'classifiers-nkawm',
        hmongRPA: 'nkawm',
        english: '(classifier for pairs: shoes, chopsticks, married couples)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-nkawm.mp3',
        exampleSentence: { hmong: 'Ib nkawm khau.', english: 'One pair of shoes.' },
      },
      {
        id: 'classifiers-pob',
        hmongRPA: 'pob',
        english: 'classifier for small round or lump-like objects',
        senses: [{ en: 'ball; round lump; rounded object', context: 'reading' }, { en: 'classifier for small round or lump-like objects', context: 'classifiers' }, { en: 'right?; is that so?', context: 'grammar' }],
        category: 'classifiers',
        tags: ['classifier', 'reviewed'],
        audioFile: 'grammar/classifiers/hmong-classifiers-pob.mp3',
        exampleSentence: { hmong: 'Ib pob zeb.', english: 'One stone.' },
      },
      {
        id: 'classifiers-txhais',
        hmongRPA: 'txhais',
        english: 'classifier for ONE of a paired body part — a hand, arm, leg, eye, ear',
        senses: [{ en: 'classifier for ONE of a paired body part — a hand, arm, leg, eye, ear', context: 'classifiers' }, { en: 'translate; interpret', context: 'verbs' }, { en: 'mean; explain — "txhais li cas?", what does it mean?', context: 'verbs' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-txhais.mp3',
        exampleSentence: { hmong: 'Ib txhais tes.', english: 'One hand.' },
      },
      {
        id: 'classifiers-thooj',
        hmongRPA: 'thooj',
        english: '(classifier for chunks, blocks, slabs & segments)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-thooj.mp3',
        exampleSentence: { hmong: 'Ib thooj nqaij.', english: 'One chunk of meat.' },
      },
      {
        id: 'classifiers-fab',
        hmongRPA: 'fab',
        english: '(classifier for sides, sections, divisions & directions)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-fab.mp3',
        exampleSentence: { hmong: 'Ib fab.', english: 'One side/section.' },
      },
      {
        id: 'classifiers-leej',
        hmongRPA: 'leej',
        // ⚠️ PEOPLE ONLY — author's ruling 2026-09-30. Unlike `tus`, which also
        // covers animals and other living things, `leej` is reserved for
        // people. Said explicitly here because the previous wording
        // ('classifier for people; respectful individual classifier') left the
        // boundary to inference, and a learner reading the two entries
        // side by side had nothing telling them the sets differ.
        // ⚠️ `english` AND senses[0] MUST BE THE SAME STRING — scripts/check-vocabulary.mjs
        // enforces it, because `category` decides both the card's context tag
        // and which sense shows. A mismatch fails silently in two places.
        english: 'classifier used only for people — never for animals or objects',
        senses: [{ en: 'classifier used only for people — never for animals or objects', context: 'classifiers' }, { en: 'leej twg = who', context: 'question-words' }],
        category: 'classifiers',
        tags: ['classifier', 'reviewed'],
        audioFile: 'grammar/classifiers/hmong-classifiers-leej.mp3',
        exampleSentence: { hmong: 'Ib leej neeg.', english: 'One person.' },
      },
      {
        id: 'classifiers-tsob',
        hmongRPA: 'tsob',
        english: '(classifier for plants, trees & clumps of vegetation)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-tsob.mp3',
        exampleSentence: { hmong: 'Ib tsob ntoo.', english: 'One tree.' },
      },
      {
        id: 'classifiers-theem',
        hmongRPA: 'theem',
        english: 'step; level; stage; tier',
        senses: [{ en: 'step; level; stage; tier', context: 'classifiers' }, { en: 'floor; story of a building', context: 'reading' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-theem.mp3',
        exampleSentence: { hmong: 'Ib theem tsev.', english: 'One floor of a building.' },
      },
      {
        id: 'classifiers-yim',
        hmongRPA: 'yim',
        english: '(classifier for households / families)',
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-yim.mp3',
        exampleSentence: { hmong: 'Ib yim neeg.', english: 'One household.' },
      },
      {
        id: 'classifiers-cov',
        hmongRPA: 'cov',
        english: 'plural marker; the group of',
        senses: [{ en: 'plural marker; the group of', context: 'classifiers' }, { en: 'those; these — for a contextually identifiable group', context: 'reading' }],
        category: 'classifiers',
        tags: ['classifier'],
        audioFile: 'grammar/classifiers/hmong-classifiers-cov.mp3',
        exampleSentence: { hmong: 'Cov menyuam.', english: 'The children.' },
      },

    ]
  },
  {
    id: 'wear-verbs',
    title: 'Verbs: To Wear',
    description: 'Hmong selects a different "wear" verb based on where the item sits on the body.',
    emoji: '👕',
    words: [
      {
        id: 'wear-verbs-hnav',
        hmongRPA: 'hnav',
        english: '(verb: to wear general clothing — shirts, pants, dresses)',
        category: 'wear-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws hnav lub tsho.', english: 'She wears the shirt.' },
      },
      {
        id: 'wear-verbs-rau',
        hmongRPA: 'rau',
        english: '(verb: to put on footwear — shoes, socks)',
        category: 'wear-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Rau khau.', english: 'Put on shoes.' },
      },
      {
        id: 'wear-verbs-sia',
        hmongRPA: 'sia',
        english: '(verb: to wear/fasten belts & straps)',
        category: 'wear-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Sia siv tawv.', english: 'Fasten the leather belt.' },
      },
      {
        id: 'wear-verbs-coj',
        hmongRPA: 'coj',
        english: '(verb: to wear/carry accessories & jewelry)',
        category: 'wear-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Coj saw caj dab.', english: 'Wear a necklace.' },
      },
      {
        id: 'wear-verbs-looj',
        hmongRPA: 'looj',
        english: '(verb: to put on by covering — hats, gloves)',
        category: 'wear-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Looj lub kaus mom.', english: 'Put on the hat.' },
        // note: source #4 listed 'ntoo' for wearing hats, but 'ntoo' = wood/tree. 'looj' (to cover/put over) is the verb I can verify for head/hand coverings. Please have a fluent speaker confirm before this goes live.
      },
    ],
  },
  {
    // ── COMMON NOUNS — 2026-09-28, path unit u-common-nouns. The author: everyday nouns (people,
    // family, home, objects, food) chosen to show SPECIFIC classifiers, each example sentence
    // using its classifier. Every pairing is the classifiers set's own; the sentences are
    // Claude's (source: 'ai', TODO-VERIFY). phau/daim ntawv are two cards on purpose: same noun,
    // the classifier changes what it is (a book vs a sheet of paper). 2026-09-28 (cohesion pass):
    // headwords were 'ntawv (phau)' / 'ntawv (daim)'; every gloss now reads meaning — classifier: ib ….
    id: 'common-nouns',
    title: 'Common Nouns',
    description: 'Everyday nouns, each with the classifier it takes — ib leej neeg, ib lub tsev, ib pob zeb.',
    emoji: '🏠',
    words: [
      { id: 'cn-neeg', hmongRPA: 'neeg', english: 'person — leej or tus: ib leej neeg', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj peb leej neeg nyob hauv lub tsev.', english: 'There are three people in the house.', source: 'ai' } },  // Was: 'Muaj peb leej neeg hauv lub tsev.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'cn-menyuam', hmongRPA: 'menyuam', english: 'child — tus: ob tus menyuam', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ob tus menyuam.', english: 'I have two children.', source: 'ai' } },
      { id: 'cn-aub', hmongRPA: 'aub', english: 'dog — tus: ib tus aub', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus aub nyiam noj nqaij.', english: 'My dog likes to eat meat.', source: 'ai' } },
      { id: 'cn-yim-neeg', hmongRPA: 'yim neeg', english: 'household — yim: ib yim neeg', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib yim neeg nyob hauv lub tsev no.', english: 'One household lives in this house.', source: 'ai' } },
      { id: 'cn-tsev', hmongRPA: 'tsev', english: 'house, home — lub: ib lub tsev', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb lub tsev nyob ze tom khw.', english: 'Our house is near the market.', source: 'ai' } },
      { id: 'cn-tsheb', hmongRPA: 'tsheb', english: 'car, vehicle — lub: ib lub tsheb', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv muaj ib lub tsheb tshiab.', english: 'My father has a new car.', source: 'ai' } },
      { id: 'cn-rooj', hmongRPA: 'rooj', english: 'table; door — lub: ib lub rooj', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muab phau ntawv rau saum lub rooj.', english: 'Put the book on the table.', source: 'ai' } },
      { id: 'cn-phau-ntawv', hmongRPA: 'phau ntawv', english: 'book — phau: ib phau ntawv', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyeem ib phau ntawv txhua hnub.', english: 'I read a book every day.', source: 'ai' } },
      { id: 'cn-daim-ntawv', hmongRPA: 'daim ntawv', english: 'sheet of paper — daim: ib daim ntawv', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib daim ntawv dawb.', english: 'I have a white sheet of paper.', source: 'ai' } },
      { id: 'cn-nplooj-ntawv', hmongRPA: 'nplooj ntawv', english: 'page — nplooj: ib nplooj ntawv', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov nyeem nplooj ntawv no rau kuv.', english: 'Please read this page to me.', source: 'ai' } },
      { id: 'cn-riam', hmongRPA: 'riam', english: 'knife — rab: ib rab riam', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Rab riam no ntse heev.', english: 'This knife is very sharp.', source: 'ai' } },
      { id: 'cn-kev', hmongRPA: 'kev', english: 'road, path — txoj: ib txoj kev', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txoj kev no ntev heev.', english: 'This road is very long.', source: 'ai' } },
      { id: 'cn-ntoo', hmongRPA: 'ntoo', english: 'tree — tsob: ib tsob ntoo', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tsob ntoo loj ze peb lub tsev.', english: 'There is a big tree near our house.', source: 'ai' } },
      { id: 'cn-zeb', hmongRPA: 'zeb', english: 'stone, rock — pob: ib pob zeb', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muab ib pob zeb rau kuv.', english: 'He gave me a stone.', source: 'ai' } },
      { id: 'cn-tes', hmongRPA: 'tes', english: 'hand — txhais (one of a pair): ib txhais tes', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txhais tes mob.', english: 'My hand hurts.', source: 'ai' } },
      { id: 'cn-khau', hmongRPA: 'khau', english: 'shoes — nkawm (a pair): ib nkawm khau', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib nkawm khau tshiab.', english: 'I have a new pair of shoes.', source: 'ai' } },
      { id: 'cn-dej', hmongRPA: 'dej', english: 'water — khob (a cup of): ib khob dej', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus ib khob dej.', english: 'I drink a cup of water.', source: 'ai' } },
      { id: 'cn-nplej', hmongRPA: 'nplej', english: 'rice, uncooked — hnab (a bag of): ib hnab nplej', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam yuav ib hnab nplej.', english: 'Mom buys a bag of rice.', source: 'ai' } },
      { id: 'cn-nqaij', hmongRPA: 'nqaij', english: 'meat — thooj (a chunk of): ib thooj nqaij', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muab ib thooj nqaij rau tus aub.', english: 'Give a chunk of meat to the dog.', source: 'ai' } },
      { id: 'cn-dab-neeg', hmongRPA: 'dab neeg', english: 'story — zaj: ib zaj dab neeg', category: 'common-nouns', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Pog hais ib zaj dab neeg rau peb.', english: 'Grandma tells us a story.', source: 'ai' } },
    ],
  },
  {
    // ── HOW A SENTENCE IS BUILT — 2026-09-28, path unit u-sentence-structure. Pattern cards, one
    // per building block. GPT-drafted from the author's rules, reviewed by Claude. TODO-VERIFY.
    id: 'sentence-structure',
    title: 'How a Sentence Is Built',
    description: 'Word order, one piece at a time: subject, verb, object, time, place.',
    emoji: '🧱',
    words: [
      { id: 'ss-sv', hmongRPA: 'subject + verb', english: 'a simple sentence: someone doing something', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mus.', english: 'He goes.' } },
      { id: 'ss-svo', hmongRPA: 'subject + verb + object', english: 'the basic word order: the thing acted on comes after the verb', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nyeem ntawv.', english: 'He reads.' } },
      { id: 'ss-noun-adj', hmongRPA: 'noun + describing word', english: 'a describing word comes after the noun', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev loj.', english: 'The house is big.' } },
      { id: 'ss-num-cls-noun', hmongRPA: 'number + classifier + noun', english: 'a number comes before the classifier and the noun', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib lub tsev.', english: 'I have one house.' } },
      { id: 'ss-pron-cls-noun', hmongRPA: 'pronoun + classifier + noun', english: 'my, your — the pronoun comes before the classifier and the noun', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus aub pw.', english: 'My dog sleeps.' } },
      { id: 'ss-time-first', hmongRPA: 'time + subject + verb', english: 'a time word usually comes first', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Naghmo kuv tau mus.', english: 'Yesterday I went.' } },  // Was: 'Naghmo kuv mus.' — "went" takes tau (author, 2026-09-28).
      { id: 'ss-tense-marker', hmongRPA: 'time + subject + marker + verb', english: 'a tense marker such as yuav goes right before the verb', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tagkis kuv yuav mus.', english: 'Tomorrow I will go.' } },
      { id: 'ss-tsis', hmongRPA: 'subject + tsis + verb', english: 'tsis goes right before the verb to say not', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis noj mov.', english: 'I don’t eat.' } },
      { id: 'ss-puas', hmongRPA: 'subject + puas + verb', english: 'puas goes right before the verb for a yes/no question', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas noj mov?', english: 'Do you eat?' } },
      { id: 'ss-question-word', hmongRPA: 'subject + verb + question word', english: 'the question word goes where the answer would be', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj noj dab tsi?', english: 'What do you eat?' } },
      { id: 'ss-place', hmongRPA: 'subject + verb + object + place', english: 'the place comes at the end', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov hauv tsev.', english: 'I eat at home.' } },
      { id: 'ss-nyob-place', hmongRPA: 'nyob + hauv / ntawm + place', english: 'to be somewhere: nyob with hauv or ntawm', category: 'sentence-structure', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.' } },
    ],
  },
  // Clothing

  {
    id: 'clothing',
    description: "A comprehensive list of words related to clothing in Hmong",
    title: "Hmong Clothing Words",
    emoji: "👗",
    words: [

      {
        id: 'clothing-tsho',
        hmongRPA: 'tsho',
        english: 'shirt / top',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsho ntawd zoo nkauj.', english: 'That shirt is pretty.' },
      },
      {
        id: 'clothing-ris-ntev',
        hmongRPA: 'ris ntev',
        english: 'pants / trousers',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub ris ntev.', english: 'The (long) pants.' },
        // note: source spelled 'rib'; corrected to 'ris' (pants).
      },
      {
        id: 'clothing-ris-luv',
        hmongRPA: 'ris luv',
        english: 'shorts',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub ris luv.', english: 'The shorts.' },
      },
      {
        id: 'clothing-khau',
        hmongRPA: 'khau',
        english: 'shoe(s)',
        category: 'clothing',
        tags: ['noun', 'clothing', 'footwear'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib nkawm khau.', english: 'A pair of shoes.' },
        // note: source spelled 'kau'; corrected to 'khau'.
      },
      {
        id: 'clothing-khau-luj-siab',
        hmongRPA: 'khau luj siab',
        english: 'slippers',
        category: 'clothing',
        tags: ['noun', 'clothing', 'footwear'],
        audioFile: null,
        // note: source had 'Luj Siab' alone; the footwear sense normally appears with 'khau'. Verify the exact local form.
        exampleSentence: { hmong: 'Kuv tso khau luj siab ntawm qhov rooj.', english: 'I leave my slippers by the door.', source: 'ai' },
      },
      {
        id: 'clothing-khau-hlau',
        hmongRPA: 'khau hlau',
        english: 'boots',
        category: 'clothing',
        tags: ['noun', 'clothing', 'footwear'],
        audioFile: null,
        // note: source wrote 'Txhais Khau' (= a shoe, classifier + noun) for "boots," which is just "shoe." Encoded 'khau hlau' (lit. iron/hard shoe) as the commonly attested word for boots; verify regional usage.
        /* was 'Kuv hnav khau hlau…' — footwear takes rau (author) */ exampleSentence: { hmong: 'Kuv rau khau hlau thaum los nag.', english: 'I wear boots when it rains.', source: 'ai' },
      },
      {
        id: 'clothing-khau-ntaub',
        hmongRPA: 'khau ntaub',
        english: 'sneakers / cloth shoes',
        category: 'clothing',
        tags: ['noun', 'clothing', 'footwear'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib nkawm khau ntaub.', english: 'A pair of sneakers.' },
      },
      {
        id: 'clothing-hlua-khau',
        hmongRPA: 'hlua khau',
        english: 'shoelace',
        category: 'clothing',
        tags: ['noun', 'clothing', 'footwear'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv khi hlua khau kom ruaj.', english: 'I tie the shoelace tightly.', source: 'ai' },
      },
      {
        id: 'clothing-siv-tawv',
        hmongRPA: 'siv tawv',
        english: 'belt (leather)',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Txoj siv tawv.', english: 'The leather belt.' },
      },
      {
        id: 'clothing-phuam',
        hmongRPA: 'phuam',
        english: 'scarf',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Txoj phuam.', english: 'The scarf.' },
      },
      {
        id: 'clothing-hnab-nra',
        hmongRPA: 'hnab nra',
        english: 'backpack',
        category: 'clothing',
        tags: ['noun', 'accessory'],
        audioFile: null,
        // note: source had just 'lub hnab' (= bag). Added 'nra' (load/pack) to specify backpack; verify local preference, as 'hnab nra qaum' is also used.
        exampleSentence: { hmong: 'Kuv nqa hnab nra mus kawm ntawv.', english: 'I carry my backpack to school.', source: 'ai' },
      },
      {
        id: 'clothing-kaus-mom',
        hmongRPA: 'kaus mom',
        english: 'hat',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub kaus mom.', english: 'The hat.' },
        // note: source spelled 'Kausmom'; standard spacing is 'kaus mom'.
      },
      {
        id: 'clothing-tsom-iav',
        hmongRPA: 'tsom iav',
        english: 'glasses / spectacles',
        category: 'clothing',
        tags: ['noun', 'accessory'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsom iav.', english: 'The glasses.' },
        // note: source had just 'iav' (= glass/mirror). Eyeglasses are normally 'tsom iav'. Verify.
      },
      {
        id: 'clothing-saw-caj-dab',
        hmongRPA: 'saw caj dab',
        english: 'necklace',
        category: 'clothing',
        tags: ['noun', 'jewelry'],
        audioFile: null,
        // note: source entry "Txoj Saw & Txwm Qhwv Ntsej" was garbled. Encoded 'saw caj dab' (neck chain/necklace) as the clearest attested form; verify.
        /* was 'Nws hnav saw caj dab…' — jewelry takes coj (2026-09-28) */ exampleSentence: { hmong: 'Nws coj saw caj dab zoo nkauj.', english: 'She wears a beautiful necklace.', source: 'ai' },
      },
      {
        id: 'clothing-nplhaib',
        hmongRPA: 'nplhaib',
        english: 'ring',
        category: 'clothing',
        tags: ['noun', 'jewelry'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib lub nplhaib.', english: 'One ring.' },
      },
      {
        id: 'clothing-saw-npab',
        hmongRPA: 'saw npab',
        english: 'bracelet',
        category: 'clothing',
        tags: ['noun', 'jewelry'],
        audioFile: null,
        // note: source 'Kaujtoog Npab' refers to an arm ring/bangle; 'saw npab' (arm chain) is the more general "bracelet." Verify which your curriculum wants.
        exampleSentence: { hmong: 'Kuv nyiam saw npab no heev.', english: 'I really like this bracelet.', source: 'ai' },
      },
      {
        id: 'clothing-ntsej-tsho',
        hmongRPA: 'ntsej tsho',
        english: 'collar (of a shirt)',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub ntsej tsho no qias lawm.', english: 'This shirt collar is dirty.', source: 'ai' },
      },
      {
        id: 'clothing-tsho-tes-luv',
        hmongRPA: 'tsho tes luv',
        english: 'short-sleeve shirt',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsho tes luv.', english: 'The short-sleeve shirt.' },
        // note: source wrote 'Tes Lev'; corrected to 'tes luv' (short sleeve).
      },
      {
        id: 'clothing-tsho-tes-ntev',
        hmongRPA: 'tsho tes ntev',
        english: 'long-sleeve shirt',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsho tes ntev.', english: 'The long-sleeve shirt.' },
      },
      {
        id: 'clothing-hnab-tsho',
        hmongRPA: 'hnab tsho',
        english: 'shirt pocket',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        // note: source 'Hnab Tshos'; corrected to 'hnab tsho'.
        exampleSentence: { hmong: 'Kuv muab nyiaj tso rau hauv hnab tsho.', english: 'I put money in my shirt pocket.', source: 'ai' },
      },
      {
        id: 'clothing-hnab-ris',
        hmongRPA: 'hnab ris',
        english: 'pants pocket',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv khaws xov tooj hauv hnab ris.', english: 'I keep my phone in my pants pocket.', source: 'ai' },
      },
      {
        id: 'clothing-khawm',
        hmongRPA: 'khawm',
        english: 'button',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib lub khawm ntawm kuv lub tsho poob lawm.', english: 'A button fell off my shirt.', source: 'ai' },
      },
      {
        id: 'clothing-ris-ntaub-tsuj',
        hmongRPA: 'ris ntaub tsuj',
        english: 'jeans',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        // note: source "Rib Ntaub Txhav" appeared garbled. Encoded 'ris ntaub tsuj' (denim/coarse-cloth pants) as a plausible corrected form, but I am NOT confident in this one — flag for fluent-speaker review.
        exampleSentence: { hmong: 'Kuv hnav ris ntaub tsuj mus ua haujlwm.', english: 'I wear jeans to work.', source: 'ai' },
      },
      {
        id: 'clothing-ris-xoob',
        hmongRPA: 'ris hauv',
        english: 'underwear',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        // note: source 'Ris Xoob' (= loose pants). Underwear is usually 'ris hauv' (inner pants). Corrected; verify.
        exampleSentence: { hmong: 'Kuv hnav ris hauv txhua hnub.', english: 'I wear underwear every day.', source: 'ai' },
      },
      {
        id: 'clothing-kaus',
        hmongRPA: 'kaus',
        english: 'umbrella',
        category: 'clothing',
        tags: ['noun', 'accessory'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib lub kaus.', english: 'One umbrella.' },
      },
      {
        id: 'clothing-hnab-looj-tes',
        hmongRPA: 'hnab looj tes',
        english: 'gloves / mittens',
        category: 'clothing',
        tags: ['noun', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Looj hnab looj tes.', english: 'Put on gloves.' },
        // note: source 'Hnab Looj Tres'; corrected 'tres'→'tes' (hand).
      },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
      { id: 'wbs-thom-khwm', hmongRPA: 'thom khwm', english: 'a sock; a stocking', category: 'clothing', tags: ['noun', 'reviewed'], audioFile: null },
      { id: 'wbs-nrhoob', hmongRPA: 'nrhoob', english: 'a leg warmer', category: 'clothing', tags: ['noun', 'reviewed'], audioFile: null },

    ]

  },

  {
    id: 'clothing-verbs',
    title: 'Verbs: Dressing & Fabric Actions',
    description: 'Action words used when dressing or describing fabric.',
    emoji: '🧵',
    words: [
      {
        id: 'clothing-verbs-tshooj',
        hmongRPA: 'tshooj',
        english: '(verb/classifier: to layer; a layer)',
        category: 'clothing-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        // note: 'tshooj' is more commonly the classifier for layers/stories ('ib tshooj' = one layer/floor). The verb "to layer clothing" usage from your source is plausible but verify.
        exampleSentence: { hmong: 'Kuv tshooj khaub ncaws thaum no.', english: 'I layer my clothes when it is cold.', source: 'ai' },
      },
      {
        id: 'clothing-verbs-vas',
        hmongRPA: 'vas',
        english: '(verb: to wrap / drape)',
        category: 'clothing-verbs',
        tags: ['verb', 'clothing'],
        audioFile: null,
        // note: 'to wrap' is more typically 'qhwv' in White Hmong. 'vas' I cannot confidently verify as "to wrap" — flag for review.
        exampleSentence: { hmong: 'Nws vas daim ntaub rau saum xub pwg.', english: 'She drapes the cloth over her shoulder.', source: 'ai' },
      },
      {
        id: 'clothing-verbs-txaij',
        hmongRPA: 'txaij',
        english: 'striped / patterned',
        category: 'clothing-verbs',
        tags: ['adjective', 'clothing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsho txaij.', english: 'The striped shirt.' },
      },
    ],
  },

  // Personalities

  {
    id: 'personality-siab',
    title: 'Personality: The "Siab" (Liver) Expressions',
    description: 'Hmong describes character and emotion through the liver (siab), where English uses "heart."',
    emoji: '🫀',
    words: [
      // ⚠️ ADDED 2026-09-12, both taught in the Speak lessons and recorded for
      // them — "zoo siab" in Greetings, "txaus siab" in Thanks & Sorry.
      //
      // ⚠️⚠️ WORD ORDER FLIPS THE MEANING, AND THE COLLISION IS ALREADY IN THIS
      // CATEGORY: `zoo siab` (glad) vs `siab zoo` (kind), two entries apart.
      // Same two syllables, reversed, different word. This is the single most
      // likely pair in the file to be "corrected" into a duplicate by someone
      // tidying up — do not merge them, and do not let a quiz draw both as
      // options for the same prompt.
      {
        id: 'personality-siab-zoo-siab',
        hmongRPA: 'zoo siab',
        english: 'glad, happy (lit. "good liver")',
        category: 'personality-siab',
        tags: ['adjective', 'emotion', 'siab-expression'],
        audioFile: 'lessons/greetings/zoo-siab.wav',
        exampleSentence: { hmong: 'Kuv zoo siab uas koj tuaj.', english: 'I am happy that you came.', source: 'ai' },
      },
      {
        id: 'personality-siab-txaus',
        hmongRPA: 'txaus siab',
        english: 'pleased, content (lit. "enough liver")',
        category: 'personality-siab',
        tags: ['adjective', 'emotion', 'siab-expression'],
        audioFile: 'lessons/politeness/txaus-siab.wav',
        // ⚠️ NOT `txuas siab`. The first take of this said txuas (to connect)
        // and had to be re-recorded — see notes/2026-09-12-lesson-audio-wired.md.
        exampleSentence: { hmong: 'Nws txaus siab rau nws txoj haujlwm.', english: 'She is satisfied with her work.', source: 'ai' },
      },
      // ⚠️ ADDED 2026-08-30 — PLEASE CONFIRM THE GLOSS.
      // Not invented: the phrase and its meaning were already in this file, inside
      // the example sentence on `conjunctions` → "Kuv tsis mus vim hais tias kuv
      // nyuaj siab." / "I do not go because I am sad." It had no entry of its own,
      // so the sentence builder was splitting it into "nyuaj" + "siab" — two chips
      // for one adjective. Note the word order runs the other way from its
      // neighbours here (X + siab, not siab + X).
      {
        id: 'personality-siab-nyuaj',
        hmongRPA: 'nyuaj siab',
        english: 'sad, troubled (lit. "difficult liver")',
        category: 'personality-siab',
        tags: ['adjective', 'emotion', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tsis mus vim hais tias kuv nyuaj siab.', english: 'I do not go because I am sad.' },
      },
      {
        id: 'personality-siab-ntev',
        hmongRPA: 'siab ntev',
        english: 'patient (lit. "long liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws yog ib tus neeg siab ntev.', english: 'He is a patient person.' },
      },
      {
        id: 'personality-siab-luv',
        hmongRPA: 'siab luv',
        english: 'impatient (lit. "short liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Txhob siab luv.', english: 'Don\'t be impatient.' },
      },
      {
        id: 'personality-siab-zoo',
        hmongRPA: 'siab zoo',
        english: 'kind, nice (lit. "good liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab zoo heev.', english: 'She is very kind.' },
      },
      {
        id: 'personality-siab-phem',
        hmongRPA: 'siab phem',
        english: 'mean, cruel (lit. "bad liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus txiv neej ntawd siab phem heev.', english: 'That man is very cruel.', source: 'ai' },
      },
      {
        id: 'personality-siab-loj',
        hmongRPA: 'siab loj',
        english: 'brave; big-hearted (lit. "big liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws muaj siab loj.', english: 'He is brave.' },
        // note: source spelled this 'Siam loj'; corrected to 'siab loj' to match the set.
      },
      {
        id: 'personality-siab-me',
        hmongRPA: 'siab me',
        english: 'cowardly; petty (lit. "little liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab me thaum ntsib teeb meem.', english: 'He becomes timid when problems arise.', source: 'ai' },
      },
      {
        id: 'personality-siab-dav',
        hmongRPA: 'siab dav',
        english: 'considerate, generous (lit. "wide liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab dav thiab nyiam pab lwm tus.', english: 'She is generous and likes helping others.', source: 'ai' },
      },
      {
        id: 'personality-siab-nqaim',
        hmongRPA: 'siab nqaim',
        english: 'selfish, inconsiderate (lit. "narrow liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab nqaim heev rau lwm tus.', english: 'He is very inconsiderate toward others.', source: 'ai' },
      },
      {
        id: 'personality-siab-dawb',
        hmongRPA: 'siab dawb',
        english: 'pure-hearted, good (lit. "white liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab dawb siab zoo.', english: 'She is pure and good-hearted.' },
      },
      {
        id: 'personality-siab-dub',
        hmongRPA: 'siab dub',
        english: 'malicious, black-hearted (lit. "black liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus neeg ntawd siab dub heev.', english: 'That person is very malicious.', source: 'ai' },
      },
      {
        id: 'personality-siab-ceev',
        hmongRPA: 'siab ceev',
        english: 'quick-tempered, hot-headed (lit. "fast liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        exampleSentence: { hmong: 'Nws siab ceev heev.', english: 'He is very quick-tempered.' },
      },
      {
        id: 'personality-siab-hnyav',
        hmongRPA: 'siab hnyav',
        english: 'slow, sluggish (lit. "heavy liver")',
        category: 'personality-siab',
        tags: ['adjective', 'personality', 'siab-expression'],
        audioFile: null,
        // note: 'siab hnyav' can also carry the sense of "heavy-hearted / burdened." Your source's "slow poke" is one reading; you may want a second entry or a usage note for the emotional sense.
        exampleSentence: { hmong: 'Nws siab hnyav tsis xav pib ua haujlwm.', english: 'He is sluggish and does not want to start working.', source: 'ai' },
      },
    ],
  },

  // Locations and Prepositions

  {
    id: 'locations-prepositions',
    title: 'Locations & Prepositions',
    description: 'Hmong directional and locative words for space, position, and the compass.',
    emoji: '🧭',
    words: [
      {
        // The SPATIAL `tom qab` — added 2026-09-30, author's ruling. Its
        // sibling is `time-context-tom-qab` ("after"), which carries the
        // temporal sense. Two entries rather than one with senses[], matching
        // how `rau` is split across wear-verbs / conjunctions / numbers.
        //
        // ⚠️ WHY THE SPLIT MATTERS: a learner with only the temporal gloss
        // reads "tom qab lub tsev" as "after the house". Same written form,
        // unrelated meaning, taught in a different lesson.
        id: 'locprep-tom-qab',
        hmongRPA: 'tom qab',
        english: 'back; behind',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Tom qab lub tsev.', english: 'Behind the house.' },
      },
      {
        id: 'locprep-sab-laug',
        hmongRPA: 'sab laug',
        english: 'the left (side)',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Sab laug.', english: 'On the left.' },
      },
      {
        id: 'locprep-sab-xis',
        hmongRPA: 'sab xis',
        english: 'the right (side)',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Sab xis.', english: 'On the right.' },
      },
      {
        id: 'locprep-qaum-teb',
        hmongRPA: 'qaum teb',
        english: 'north',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'compass'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tsev nyob qaum teb.', english: 'My house is in the north.', source: 'ai' },
      },
      {
        id: 'locprep-qab-teb',
        hmongRPA: 'qab teb',
        english: 'south',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'compass'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv niam nyob qab teb.', english: 'My mother lives in the south.', source: 'ai' },
      },
      {
        id: 'locprep-sab-hnub-tuaj',
        hmongRPA: 'sab hnub tuaj',
        english: 'east (lit. "where the sun comes")',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'compass'],
        audioFile: null,
        // note: literal sense "sun-rising side" is a nice teaching point — Hmong compass terms are sun-based.
        exampleSentence: { hmong: 'Lub hnub tawm sab hnub tuaj.', english: 'The sun rises in the east.', source: 'ai' },
      },
      {
        id: 'locprep-sab-hnub-poob',
        hmongRPA: 'sab hnub poob',
        english: 'west (lit. "where the sun falls")',
        category: 'locations-prepositions',
        tags: ['noun', 'direction', 'compass'],
        audioFile: null,
        // note: also 'sab hnub npoob' / 'sab hnub tuag' in some dialects. Verify preferred form.
        exampleSentence: { hmong: 'Lub hnub poob sab hnub poob.', english: 'The sun sets in the west.', source: 'ai' },
      },
      {
        id: 'locprep-hauv',
        hmongRPA: 'hauv',
        english: 'inside; in',
        senses: [{ en: 'inside; in', context: 'locations-prepositions' }, { en: 'during; in — of a time period', context: 'reading' }, { en: 'among; within — of a group', context: 'reading' }],
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Hauv tsev.', english: 'Inside the house.' },
      },
      {
        id: 'locprep-saum-toj',
        hmongRPA: 'saum toj',
        english: 'on top, above, on',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Saum toj.', english: 'Up on top / on the hill.' },
        // note: 'saum' = on/above; 'saum toj' leans toward "up on a height/hill." Plain "on top of X" is often just 'saum X' (e.g. 'saum rooj' = on the table).
      },
      {
        id: 'locprep-hauv-qab',
        hmongRPA: 'hauv qab',
        english: 'under, beneath, below',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Hauv qab rooj.', english: 'Under the table.' },
      },
      {
        id: 'locprep-ib-sab',
        hmongRPA: 'ib sab',
        english: 'beside, next to; one side',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        // note: 'ib sab' literally "one side." "Next to" is often 'ib sab ntawm' or 'ntawm ib sab'. Verify the phrasing you want to teach.
        exampleSentence: { hmong: 'Kuv zaum ib sab ntawm nws.', english: 'I sit beside him.', source: 'ai' },
      },
      {
        id: 'locprep-nruab-nrab',
        hmongRPA: 'nruab nrab',
        english: 'middle, center',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Nruab nrab.', english: 'In the middle.' },
      },
      {
        id: 'locprep-ua-ntej',
        hmongRPA: 'ua ntej',
        english: 'in front, ahead; before',
        category: 'locations-prepositions',
        tags: ['locative', 'location', 'temporal'],
        audioFile: null,
        exampleSentence: { hmong: 'Ua ntej.', english: 'In front / first.' },
        // note: source had 'Hau ntej'; standard is 'ua ntej'. Also carries the TEMPORAL sense "before/first," not only spatial. Worth flagging both senses for learners.
      },
      {
        id: 'locprep-nram-qab',
        hmongRPA: 'nram qab',
        english: 'in back, behind',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        // note: 'qab' = back/behind/under depending on pairing. 'nram qab' uses the directional 'nram' (down/yonder). Tom qab is also common for "behind/after."
        exampleSentence: { hmong: 'Tus aub nyob nram qab tsev.', english: 'The dog is behind the house.', source: 'ai' },
      },
      {
        id: 'locprep-deb',
        hmongRPA: 'deb',
        english: 'far',
        category: 'locations-prepositions',
        tags: ['adjective', 'distance'],
        audioFile: null,
        exampleSentence: { hmong: 'Nyob deb.', english: 'It is far.' },
      },
      {
        id: 'locprep-ze',
        hmongRPA: 'ze',
        english: 'near, close',
        category: 'locations-prepositions',
        tags: ['adjective', 'distance'],
        audioFile: null,
        exampleSentence: { hmong: 'Nyob ze.', english: 'It is near.' },
      },
      {
        id: 'locprep-dhau',
        hmongRPA: 'dhau',
        english: '(verb: to pass, go past; past/beyond)',
        category: 'locations-prepositions',
        tags: ['verb', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Hla dhau.', english: 'Cross over/past.' },
        // note: 'dhau' is primarily a verb "to pass/exceed," also used for "past/beyond." Tagged verb, not preposition.
      },
      {
        id: 'locprep-ntawm',
        hmongRPA: 'ntawm',
        english: 'at; by; near',
        senses: [{ en: 'at; by; near', context: 'locations-prepositions' }, { en: 'of; from — source, possession, association', context: 'reading' }, { en: 'the one at; the one belonging to', context: 'reading' }],
        category: 'locations-prepositions',
        tags: ['preposition', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Ntawm lub rooj.', english: 'At the table.' },
      },
      {
        id: 'locprep-nraum',
        hmongRPA: 'nraum',
        english: 'outside',
        category: 'locations-prepositions',
        tags: ['locative', 'location'],
        audioFile: null,
        exampleSentence: { hmong: 'Nraum zoov.', english: 'Outside / outdoors.' },
        // note: source listed 'Nraum / Nraud'; standard is 'nraum'. 'nraum zoov' = outside/outdoors is the common phrase.
      },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'locprep-pem', hmongRPA: 'pem', english: 'up, uphill, above — up there; "pem hauv ntej", up front',  /* was 'up there, up ahead — …' (author, 2026-09-28) */ category: 'locations-prepositions', tags: ['preposition', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum yeeb yam pib, kuv ntsia pem hauv ntej thiab kuv mloog zaj yeeb yam.', english: 'When the movie started, I looked forward and listened to the movie.' }, examples: [{ hmong: 'Nws lub tsev nyob pem roob.', english: 'His house is up on the mountain.' }] },
      // Added 2026-09-28 (author): nram, down / downhill / below — pem's opposite. Example is Claude's.
      { id: 'locprep-nram', hmongRPA: 'nram', english: 'down, downhill, below — down there', category: 'locations-prepositions', tags: ['preposition', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb lub zos nyob nram hav.', english: 'Our village is down in the valley.', source: 'ai' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'locprep-ntej', hmongRPA: 'ntej', english: 'front, ahead; before — "hauv ntej", in front; "ua ntej", before, first', category: 'locations-prepositions', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum yeeb yam pib, kuv ntsia pem hauv ntej thiab kuv mloog zaj yeeb yam.', english: 'When the movie started, I looked forward and listened to the movie.' } },
    ],
  },

  // Tools Hmoob Cov Cuabyeej

  {
    id: 'tools-household',
    title: 'Hmoob Cov Cuab Yeej — Tools & Household Items',
    description: 'Everyday Hmong tools, cookware, and household objects, with their characteristic classifiers.',
    emoji: '🧹',
    words: [
      // The author, 2026-09-30 — the set's own title word; it was not in the dictionary.
      { id: 'tools-cov-cuab-yeej', hmongRPA: 'cov cuab yeej', english: 'tools, equipment, instruments, weapons — the general phrase for objects of use; which one depends on context',  /* 'weapons' made explicit 2026-09-30 (author) */ category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
      { id: 'tools-cuab', hmongRPA: 'cuab', english: 'belongings, equipment, household items — "cov cuab yeej", tools, equipment, instruments, weapons; "cuab yeej tsov rog", weapons specifically', category: 'tools-household', tags: ['noun', 'household', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of four cuab entries (the rau / tom qab pattern)
      {
        id: 'tools-hlau',
        hmongRPA: 'hlau',
        english: 'hoe',
        category: 'tools-household',
        tags: ['noun', 'tool', 'farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib rab hlau.', english: 'One hoe.' },
        // note: 'hlau' also means "iron/metal"; the hoe sense rides on the classifier 'rab'. Context disambiguates.
      },
      {
        id: 'tools-riam',
        hmongRPA: 'riam',
        english: 'knife',
        category: 'tools-household',
        tags: ['noun', 'tool', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib rab riam.', english: 'One knife.' },
      },
      {
        id: 'tools-khais',
        hmongRPA: 'khais',
        english: 'soil tiller / mattock',
        category: 'tools-household',
        tags: ['noun', 'tool', 'farm'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib rab khais.', english: 'One mattock.' },
      },
      {
        id: 'tools-khaubrhuab',
        hmongRPA: 'khaub ruab',
        english: 'broom',
        category: 'tools-household',
        tags: ['noun', 'tool', 'cleaning'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus khaub ruab.', english: 'The broom.' },
        // note: source 'Khaubrhuab'; likely 'khaub ruab'. Spelling/tone uncertain — FLAG for verification.
      },
      {
        id: 'tools-cilaug',
        hmongRPA: 'ci laug',
        english: 'dustpan',
        category: 'tools-household',
        tags: ['noun', 'tool', 'cleaning'],
        audioFile: null,
        // note: source 'Cilaug'; exact RPA spelling/tone uncertain — FLAG for verification.
        exampleSentence: { hmong: 'Kuv siv ci laug khaws plua plav.', english: 'I use a dustpan to collect dirt.', source: 'ai' },
      },
      {
        id: 'tools-nyias',
        hmongRPA: 'nyias',
        english: 'baby carrier (cloth)',
        category: 'tools-household',
        tags: ['noun', 'textile', 'childcare'],
        audioFile: null,
        exampleSentence: { hmong: 'Daim nyias.', english: 'The baby carrier.' },
        // note: the embroidered Hmong baby carrier is culturally significant; you may want a richer cultural note here.
      },
      {
        id: 'tools-laujkaub',
        hmongRPA: 'lauj kaub',
        english: 'cooking pot',
        category: 'tools-household',
        tags: ['noun', 'cookware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub lauj kaub.', english: 'The pot.' },
      },
      {
        id: 'tools-yias',
        hmongRPA: 'yias',
        english: 'pan / wok',
        category: 'tools-household',
        tags: ['noun', 'cookware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub yias.', english: 'The pan.' },
      },
      {
        id: 'tools-phiab',
        hmongRPA: 'phiab',
        english: 'large bowl / basin',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub phiab.', english: 'The large bowl.' },
      },
      {
        id: 'tools-phaj',
        hmongRPA: 'phaj',
        english: 'plate',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub phaj.', english: 'The plate.' },
      },
      {
        id: 'tools-diav',
        hmongRPA: 'diav',
        english: 'spoon',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Rab diav.', english: 'The spoon.' },
      },
      {
        id: 'tools-rawg',
        hmongRPA: 'rawg',
        english: 'fork',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Rab rawg.', english: 'The fork.' },
        // note: source glossed 'rawg' as "fork / chopsticks." 'rawg' = fork. Chopsticks are 'ntiv' / 'maum ntiv'. Recommend a separate entry for chopsticks rather than conflating.
      },
      {
        id: 'tools-khob',
        hmongRPA: 'khob',
        english: 'cup',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub khob.', english: 'The cup.' },
      },
      {
        id: 'tools-laugcam',
        hmongRPA: 'laug cam',
        english: 'cutting board',
        category: 'tools-household',
        tags: ['noun', 'kitchen'],
        audioFile: null,
        // note: source 'Laug Cam'; spelling/tone uncertain — FLAG for verification.
        exampleSentence: { hmong: 'Kuv txiav nqaij saum laug cam.', english: 'I cut meat on the cutting board.', source: 'ai' },
      },
      {
        id: 'tools-tshob',
        hmongRPA: 'tshob',
        english: 'dipper / ladle',
        category: 'tools-household',
        tags: ['noun', 'cookware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tshob.', english: 'The dipper.' },
        // note: source 'Tshob'; ladle/dipper is also 'diav tshos' / 'tshob' regionally. Verify.
      },
      {
        id: 'tools-tog',
        hmongRPA: 'rooj tog',
        english: 'stool',
        category: 'tools-household',
        tags: ['noun', 'furniture'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub rooj tog.', english: 'The stool.' },
        // note: source 'Tog'; a stool/seat is commonly 'rooj tog' or just 'tog'. Verify the bare form vs compound.
      },
      {
        id: 'tools-lev',
        hmongRPA: 'lev',
        english: 'mat (sleeping/sitting)',
        category: 'tools-household',
        tags: ['noun', 'textile', 'furniture'],
        audioFile: null,
        exampleSentence: { hmong: 'Daim lev.', english: 'The mat.' },
      },
      {
        id: 'tools-pam',
        hmongRPA: 'pam',
        english: 'blanket',
        category: 'tools-household',
        tags: ['noun', 'textile', 'bedding'],
        audioFile: null,
        exampleSentence: { hmong: 'Daim pam.', english: 'The blanket.' },
      },
      {
        id: 'tools-hau-ncoo',
        hmongRPA: 'hauv ncoo',
        english: 'pillow',
        category: 'tools-household',
        tags: ['noun', 'bedding'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub hauv ncoo.', english: 'The pillow.' },
        // note: source 'Hau Ncoo'; standard is 'hauv ncoo'. Corrected.
      },
      {
        id: 'tools-tais',
        hmongRPA: 'tais',
        english: 'bowl',
        category: 'tools-household',
        tags: ['noun', 'tableware', 'kitchen'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tais.', english: 'The bowl.' },
        // note: 'tais' = bowl here; distinct from 'tais' (maternal aunt) and 'niam tais' (grandmother) — homograph worth noting so learners don't confuse them.
      },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-lub-xauv', hmongRPA: 'lub xauv', english: 'lock', category: 'tools-household', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv muab lub xauv kaw qhov rooj.', english: 'I use the lock to secure the door.', source: 'ai' } },
      { id: 'gen-vijtsam', hmongRPA: 'vijtsam', english: 'tent screen; mosquito net', category: 'tools-household', tags: ['noun','home','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pw hauv vijtsam hmo no.', english: 'We sleep under a mosquito net tonight.', source: 'ai' } },
      { id: 'misc-thawv', hmongRPA: 'thawv', english: 'box, chest', category: 'tools-household', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv muab khaub ncaws tso rau hauv thawv.', english: 'I put clothes into the chest.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-vij-tsam', hmongRPA: 'vij tsam', english: 'tent screen; mosquito net', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nplauv', hmongRPA: 'nplauv', english: 'a scrubbing brush', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxiab', hmongRPA: 'ntxiab', english: 'a trap', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxaij', hmongRPA: 'ntxaij', english: 'a screen', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nqaj', hmongRPA: 'nqaj', english: 'a beam', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nthee', hmongRPA: 'nthee', english: 'the attic', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-thee', hmongRPA: 'thee', english: 'charcoal', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ncaig', hmongRPA: 'ncaig', english: 'hot, burning charcoal', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nkhawb', hmongRPA: 'nkhawb', english: 'soot', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-hluav', hmongRPA: 'hluav', english: 'burnt matter', category: 'tools-household', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },

  // Household Rooms
  {
    id: 'household-rooms',
    title: 'Hauv Lub Tsev — Rooms of the House',
    description: 'Hmong room names, mostly built from "chav" (room) plus the activity done there.',
    emoji: '🚪',
    words: [
      {
        id: 'rooms-chav-pw',
        hmongRPA: 'chav pw',
        english: 'bedroom (lit. "room for sleeping")',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv chav pw.', english: 'My bedroom.' },
        // note: 'chav' (room) + 'pw' (to sleep/lie down). Also 'chav txaj' (room with a bed). Both attested.
      },
      {
        id: 'rooms-chav-dej',
        hmongRPA: 'chav dej',
        english: 'bathroom (lit. "water room")',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        exampleSentence: { hmong: 'Chav dej nyob qhov twg?', english: 'Where is the bathroom?' },
        // note: 'chav dej' (water room) is the polite everyday term. 'chav da dej' = specifically a room for bathing.
      },
      {
        id: 'rooms-chav-ntxhua-khaubncaws',
        hmongRPA: 'chav ntxhua khaub ncaws',
        english: 'laundry room (lit. "room for washing clothes")',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        // note: parallels 'cav ntxhua khaub ncaws' (washing machine) from the appliance set — same 'ntxhua khaub ncaws' core. Good cross-reference for learners.
        exampleSentence: { hmong: 'Kuv ntxhua khaub ncaws hauv chav ntxhua khaub ncaws.', english: 'I wash clothes in the laundry room.', source: 'ai' },
      },
      {
        id: 'rooms-chav-nyob',
        hmongRPA: 'chav nyob',
        english: 'living room (lit. "room for being/staying")',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb zaum hauv chav nyob.', english: 'We sit in the living room.' },
      },
      {
        id: 'rooms-chav-noj',
        hmongRPA: 'chav noj',
        english: 'kitchen / dining room (lit. "room for eating")',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        exampleSentence: { hmong: 'Chav noj mov.', english: 'The dining/eating room.' },
        // note: 'chav noj' / 'chav noj mov' leans "dining room." A kitchen for cooking is often 'chav ua noj' / 'chav ua mov' (room for making food). Worth distinguishing the two for learners.
      },
      {
        id: 'rooms-qabdaus',
        hmongRPA: 'qab daus',
        english: 'basement',
        category: 'household-rooms',
        tags: ['noun', 'house', 'room'],
        audioFile: null,
        // note: source 'Qabdaus'; likely 'qab daus' / 'qab tsev' (under the house). Spelling/tone of 'daus' uncertain — FLAG for verification.
        exampleSentence: { hmong: 'Peb khaws khoom hauv qab daus.', english: 'We store things in the basement.', source: 'ai' },
      },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-qhov-rais', hmongRPA: 'qhov rais', english: 'window', category: 'household-rooms', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv qhib qhov rais thaum sawv ntxov.', english: 'I open the window in the morning.', source: 'ai' } },
      { id: 'misc-qhov-rooj', hmongRPA: 'qhov rooj', english: 'door', category: 'household-rooms', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov kaw qhov rooj kom zoo.', english: 'Please close the door properly.', source: 'ai' } },
      { id: 'misc-phab-ntsa', hmongRPA: 'phab ntsa', english: 'a wall', category: 'household-rooms', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib daim duab ntawm phab ntsa.', english: 'There is a picture on the wall.', source: 'ai' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rooms-chav', hmongRPA: 'chav', english: 'a room — "chav tos", a waiting room; "chav saib yeeb yam", the movie room', category: 'household-rooms', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum wb mus hauv chav tos, kuv pom ib tug txiv neej zaum tom qab lub rooj muag daim pib.', english: 'When we two went into the waiting area, I saw a man sitting behind the ticket counter.' } },
    ],
  },
  // Buildsings and Dwellings:

  {
    id: 'buildings',
    title: 'Buildings & Dwellings',
    description: 'Hmong words for homes and structures, including many modern loanwords.',
    emoji: '🏘️',
    words: [
      {
        id: 'buildings-tsev-asphavmeem',
        hmongRPA: 'tsev asphavmeem',
        english: 'apartment',
        category: 'buildings',
        tags: ['noun', 'dwelling', 'loanword'],
        audioFile: null,
        // note: loanword from English "apartment." Spelling not standardized; also written 'aspham meem', 'asphasmeem', etc. FLAG — pick one form for your platform and note it's a loan.
        exampleSentence: { hmong: 'Kuv nyob hauv ib lub tsev asphavmeem.', english: 'I live in an apartment.', source: 'ai' },
      },
      {
        id: 'buildings-tsev-kheej',
        hmongRPA: 'tsev kheej',
        english: 'house (single-family / one\'s own home)',
        category: 'buildings',
        tags: ['noun', 'dwelling'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb lub tsev kheej.', english: 'Our own house.' },
        // note: 'kheej' here carries the sense of "own/single." Verify; 'tsev' alone is the basic word for house.
      },
      {
        id: 'buildings-tsev-duplex',
        hmongRPA: 'tsev dusplhej',
        english: 'duplex',
        category: 'buildings',
        tags: ['noun', 'dwelling', 'loanword'],
        audioFile: null,
        // note: loanword "duplex." Source gave three spellings (Dusplhev/Dusplhaj/Dusples) — none standardized. FLAG; choose one canonical form.
        exampleSentence: { hmong: 'Kuv tus phooj ywg nyob hauv tsev dusplhej.', english: 'My friend lives in a duplex.', source: 'ai' },
      },
      {
        id: 'buildings-tsev-rhuavlawj',
        hmongRPA: 'tsev rhuav lawj',
        english: 'trailer home / manufactured home',
        category: 'buildings',
        tags: ['noun', 'dwelling'],
        audioFile: null,
        // note: 'rhuav lawj' spelling/tone uncertain to me. FLAG for verification.
        exampleSentence: { hmong: 'Lawv nyob hauv ib lub tsev rhuav lawj.', english: 'They live in a manufactured home.', source: 'ai' },
      },
      {
        id: 'buildings-tsev-pheebsuab',
        hmongRPA: 'tsev pheeb suab',
        english: 'shack / shed / lean-to',
        category: 'buildings',
        tags: ['noun', 'dwelling', 'structure'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsev pheeb suab.', english: 'The shack.' },
        // note: 'tsev pheeb suab' is a well-attested term for a temporary/makeshift shelter. Spacing 'pheeb suab'.
      },
      {
        id: 'buildings-ntsa-lajkab',
        hmongRPA: 'ntsa laj kab',
        english: 'fence',
        category: 'buildings',
        tags: ['noun', 'structure'],
        audioFile: null,
        exampleSentence: { hmong: 'Daim ntsa laj kab.', english: 'The fence.' },
        // note: 'laj kab' = fence/barrier; 'ntsa' adds the wall/upright sense. Both 'laj kab' alone and 'ntsa laj kab' are used.
      },
      {
        id: 'buildings-vaj',
        hmongRPA: 'vaj',
        english: 'garden',
        category: 'buildings',
        tags: ['noun', 'outdoor'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub vaj.', english: 'The garden.' },
        // note: 'vaj' = garden/cultivated plot; appears in 'vaj tse' (home/property) and 'ua vaj ua tsev' (to make a home). Core word.
      },
      {
        id: 'buildings-qab-vaj',
        hmongRPA: 'qab vaj tsib taug',
        english: 'yard',
        category: 'buildings',
        tags: ['noun', 'outdoor'],
        audioFile: null,
        // note: source 'Qab Vag Tsib Taug'; likely 'qab vaj' (the yard/area around the home) with 'tsib taug' a descriptor. This phrase is uncertain to me — FLAG. 'qab vaj qab tsev' = the home grounds is a common set phrase.
        exampleSentence: { hmong: 'Cov menyuam ua si hauv qab vaj tsib taug.', english: 'The children play in the yard.', source: 'ai' },
      },
      {
        id: 'buildings-garage',
        hmongRPA: 'nkaslas',
        english: 'garage',
        category: 'buildings',
        tags: ['noun', 'structure', 'loanword'],
        audioFile: null,
        // note: loanword from English "garage." Source variants 'nkaslas / nkajkaj'. FLAG — pick one. Some also use 'tsev rau tsheb' (house for the car), a native compound worth offering as an alternative.
        exampleSentence: { hmong: 'Kuv lub tsheb nyob hauv nkaslas.', english: 'My car is in the garage.', source: 'ai' },
      },
      {
        id: 'buildings-momkaum',
        hmongRPA: 'momkaum',
        english: 'porch',
        category: 'buildings',
        tags: ['noun', 'structure'],
        audioFile: null,
        // note: spelling/tone uncertain. FLAG for verification.
        exampleSentence: { hmong: 'Peb zaum ua si ntawm momkaum.', english: 'We sit and relax on the porch.', source: 'ai' },
      },
      {
        id: 'buildings-xauj',
        hmongRPA: 'xauj',
        english: '(verb: to rent / lease)',
        category: 'buildings',
        tags: ['verb', 'dwelling'],
        audioFile: null,
        exampleSentence: { hmong: 'Xauj tsev.', english: 'To rent a house.' },
      },
      {
        id: 'buildings-yuav',
        hmongRPA: 'yuav',
        english: '(verb: to buy)',
        category: 'buildings',
        tags: ['verb'],
        audioFile: null,
        exampleSentence: { hmong: 'Yuav tsev.', english: 'To buy a house.' },
        // note: 'yuav' = to buy. Source also glossed "own," but ownership is usually 'muaj' (to have). Also note 'yuav' is a major homograph — it's the future/irrealis marker ("will/going to"). Big teaching point: 'yuav noj' = will eat vs 'yuav mov' = buy rice. Context and following word disambiguate.
      },
      {
        id: 'buildings-xab',
        hmongRPA: 'xab',
        english: 'floor / level / story',
        category: 'buildings',
        tags: ['noun', 'structure', 'loanword'],
        audioFile: null,
        // note: 'xab' for floor/level — possibly a loan. Native option is 'theem' (the level/tier classifier from your classifiers set) — 'theem ib' = first floor. Consider cross-linking to 'theem'. FLAG spelling.
        exampleSentence: { hmong: 'Kuv chav nyob rau thawj xab.', english: 'My room is on the first floor.', source: 'ai' },
      },
      // ── Split out of `buildings-places` on 2026-09-20 ──
      { id: 'bld-chav-tsev-nyob', hmongRPA: 'chav tsev nyob', english: 'apartment', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws xauj ib chav tsev nyob.', english: 'She rents an apartment.', source: 'ai' } },
      { id: 'bld-tuam-tsev-ua-chav-nyob', hmongRPA: 'tuam tsev ua chav nyob', english: 'apartment block', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub tuam tsev ua chav nyob tshiab.', english: 'There is a new apartment block.', source: 'ai' } },
      { id: 'bld-chav-ua-yeeb-yam', hmongRPA: 'chav ua yeeb yam', english: 'art gallery', category: 'buildings', tags: ['noun','buildings','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus saib duab hauv chav ua yeeb yam.', english: 'We go see paintings at the art gallery.', source: 'ai' } },
      { id: 'bld-tsev-cia-nyiaj', hmongRPA: 'tsev cia nyiaj', english: 'bank', category: 'buildings', tags: ['noun','buildings','business','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tsev cia nyiaj hnub no.', english: 'I am going to the bank today.', source: 'ai' } },
      { id: 'bld-tsev-haus-dej-haus-cawv', hmongRPA: 'tsev haus dej haus cawv', english: 'bar', category: 'buildings', tags: ['noun','buildings','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv sib ntsib ntawm tsev haus dej haus cawv.', english: 'They meet at the bar.', source: 'ai' } },
      { id: 'bld-tsev-liaj', hmongRPA: 'tsev liaj', english: 'barn', category: 'buildings', tags: ['noun','buildings','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tsiaj nyob hauv tsev liaj.', english: 'The animals are in the barn.', source: 'ai' } },
      { id: 'bld-khw-muag-ntawv', hmongRPA: 'khw muag ntawv', english: 'bookstore', category: 'buildings', tags: ['noun','buildings','shopping','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav phau ntawv tom khw muag ntawv.', english: 'I buy books at the bookstore.', source: 'ai' } },
      { id: 'bld-tuam-tsev', hmongRPA: 'tuam tsev', english: 'building', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tuam tsev no loj heev.', english: 'This building is very large.', source: 'ai' } },
      { id: 'bld-tsev-noj-haus', hmongRPA: 'tsev noj haus', english: 'cafe; restaurant', category: 'buildings', tags: ['noun','buildings','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj su tom tsev noj haus.', english: 'We have lunch at the restaurant.', source: 'ai' } },
      { id: 'bld-tsev-twv-txiaj', hmongRPA: 'tsev twv txiaj', english: 'casino', category: 'buildings', tags: ['noun','buildings','entertainment','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv tsis mus rau tsev twv txiaj.', english: 'They do not go to the casino.', source: 'ai' } },
      { id: 'bld-khw-muag-khoom-noj', hmongRPA: 'khw muag khoom noj', english: 'cafeteria', category: 'buildings', tags: ['noun','buildings','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj mov hauv khw muag khoom noj.', english: 'We eat in the cafeteria.', source: 'ai' } },
      { id: 'bld-tsev-teev-ntuj', hmongRPA: 'tsev teev ntuj', english: 'church', category: 'buildings', tags: ['noun','buildings','religion','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus tsev teev ntuj txhua hnub xya.', english: 'They go to church every Sunday.', source: 'ai' } },
      { id: 'bld-tsev-so', hmongRPA: 'tsev so', english: 'condominium; lodging', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb nyob hauv ib lub tsev so.', english: 'We are staying in a condominium.', source: 'ai' } },
      { id: 'bld-chaw-so', hmongRPA: 'chaw so', english: 'dormitory; resting place', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tub ntxhais kawm nyob hauv chaw so.', english: 'The students stay in the dormitory.', source: 'ai' } },
      { id: 'bld-tsev-sawv-cev-rau-tsoom-fwv-lwm-lub-teb-chaws', hmongRPA: 'tsev sawv cev rau tsoom fwv lwm lub teb chaws', english: 'embassy', category: 'buildings', tags: ['noun','buildings','government','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mus rau tsev sawv cev rau tsoom fwv lwm lub teb chaws.', english: 'She goes to the foreign embassy.', source: 'ai' } },
      { id: 'bld-tsev-tsim-khoom', hmongRPA: 'tsev tsim khoom', english: 'factory', category: 'buildings', tags: ['noun','buildings','work','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv ua haujlwm hauv tsev tsim khoom.', english: 'My father works in a factory.', source: 'ai' } },
      { id: 'bld-chaw-ua-hauj-lwm-tua-hluav-taws', hmongRPA: 'chaw ua hauj lwm tua hluav taws', english: 'fire station', category: 'buildings', tags: ['noun','buildings','emergency','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub chaw ua hauj lwm tua hluav taws nyob ze no.', english: 'The fire station is nearby.', source: 'ai' } },
      { id: 'bld-tsev-iav', hmongRPA: 'tsev iav', english: 'greenhouse', category: 'buildings', tags: ['noun','buildings','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam cog zaub hauv tsev iav.', english: 'Mom grows vegetables in the greenhouse.', source: 'ai' } },
      { id: 'bld-tsev-xyaum-ib-ce', hmongRPA: 'tsev xyaum ib ce', english: 'gym', category: 'buildings', tags: ['noun','buildings','fitness','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tsev xyaum ib ce yav tsaus ntuj.', english: 'I go to the gym in the evening.', source: 'ai' } },
      { id: 'bld-tsev-kho-mob', hmongRPA: 'tsev kho mob', english: 'hospital', category: 'buildings', tags: ['noun','buildings','health','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mus tsev kho mob naghmo.', english: 'She went to the hospital yesterday.', source: 'ai' } },
      { id: 'bld-tsev-nyeem-ntawv', hmongRPA: 'tsev nyeem ntawv', english: 'library — literally the "nyeem" (reading) house', category: 'buildings', tags: ['noun','buildings','education','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyeem ntawv hauv tsev nyeem ntawv.', english: 'I read at the library.', source: 'ai' } },
      { id: 'bld-khw-muag-khoom', hmongRPA: 'khw muag khoom', english: 'market; store', category: 'buildings', tags: ['noun','buildings','shopping','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav zaub tom khw muag khoom.', english: 'We buy vegetables at the store.', source: 'ai' } },
      { id: 'bld-tsev-niam-plig', hmongRPA: 'tsev niam plig', english: 'monastery', category: 'buildings', tags: ['noun','buildings','religion','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus xyuas tsev niam plig.', english: 'They visit the monastery.', source: 'ai' } },
      { id: 'bld-tsev-teev-hawm', hmongRPA: 'tsev teev hawm', english: 'mosque; house of worship', category: 'buildings', tags: ['noun','buildings','religion','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub tsev teev hawm nyob ntawd.', english: 'There is a place of worship there.', source: 'ai' } },
      { id: 'bld-tsev-huab-tais', hmongRPA: 'tsev huab tais', english: 'palace', category: 'buildings', tags: ['noun','buildings','government','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev huab tais loj thiab zoo nkauj.', english: 'The palace is large and beautiful.', source: 'ai' } },
      { id: 'bld-tsev-tub-ceev-xwm', hmongRPA: 'tsev tub ceev xwm', english: 'police station', category: 'buildings', tags: ['noun','buildings','law','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom tsev tub ceev xwm nyob tom hauv ntej.', english: 'I see the police station up ahead.', source: 'ai' } },
      { id: 'bld-tsev-xa-ntawv', hmongRPA: 'tsev xa ntawv', english: 'post office', category: 'buildings', tags: ['noun','buildings','government','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tsev xa ntawv xa ib tsab ntawv.', english: 'I go to the post office to mail a letter.', source: 'ai' } },
      { id: 'bld-tsev-noj-mov', hmongRPA: 'tsev noj mov', english: 'restaurant', category: 'buildings', tags: ['noun','buildings','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb ntsib peb cov phooj ywg tom tsev noj mov.', english: 'We meet our friends at the restaurant.', source: 'ai' } },
      { id: 'bld-khw', hmongRPA: 'khw', english: 'shop; store', category: 'buildings', tags: ['noun','buildings','shopping','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus khw yuav khaub ncaws.', english: 'I go to the store to buy clothes.', source: 'ai' } },
      { id: 'bld-khw-loj-muag-khoom', hmongRPA: 'khw loj muag khoom', english: 'shopping mall', category: 'buildings', tags: ['noun','buildings','shopping','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus khw loj muag khoom hnub rau.', english: 'We go to the shopping mall on Saturday.', source: 'ai' } },
      { id: 'bld-tsev-tshoom-ntuj', hmongRPA: 'tsev tshoom ntuj', english: 'skyscraper', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev tshoom ntuj siab heev.', english: 'The skyscraper is extremely tall.', source: 'ai' } },
      // ⚠️ `nkauj` means song / young woman. Stable is almost certainly `nkuaj`,
      // the same headword the jail entry below carries. Left as supplied —
      // flagged in notes/2026-09-20-vocab-batch-import.md.
      // Headword corrected 2026-09-20: supplied as `nkauj` (song, young woman).
      // A stable is `nkuaj` — the same word `bld-nkuaj` below carries for "jail".
      { id: 'bld-nkauj', hmongRPA: 'nkuaj', english: 'stable', category: 'buildings', tags: ['noun','buildings','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov nees nyob hauv nkuaj.', english: 'The horses are in the stable.', source: 'ai' } },
      { id: 'bld-tshav-ncaws-pob', hmongRPA: 'tshav ncaws pob', english: 'stadium; sports field; soccer field; playground', category: 'buildings', tags: ['noun','buildings','sports','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam ua si hauv tshav ncaws pob.', english: 'The children play on the sports field.', source: 'ai' } },
      { id: 'bld-tsev-hauj-sam', hmongRPA: 'tsev hauj sam', english: 'Buddhist temple', category: 'buildings', tags: ['noun','buildings','religion','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub tsev hauj sam saum roob.', english: 'There is a Buddhist temple on the mountain.', source: 'ai' } },
      { id: 'bld-tsev-laus', hmongRPA: 'tsev laus', english: 'tent', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pw hauv ib lub tsev laus.', english: 'We sleep in a tent.', source: 'ai' } },
      // Replaced 2026-09-26 (author): "tsev ntsia yeeb yam" — the wording used in the story
      // "Mus Saib Yeeb Yam" — is the more faithful, literal term. Restore by uncommenting
      // the old line and pointing SET_SPLITS (buildings, part 2) back at 'bld-lub-tsev-yeeb-yaj-duab'.
      // { id: 'bld-lub-tsev-yeeb-yaj-duab', hmongRPA: 'lub tsev yeeb yaj duab', english: 'movie theater', category: 'buildings', tags: ['noun','buildings','entertainment','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus saib yeeb yaj duab hauv lub tsev yeeb yaj duab.', english: 'We watch a movie at the theater.', source: 'ai' } },
      { id: 'bld-lub-tsev-ntsia-yeeb-yam', hmongRPA: 'lub tsev ntsia yeeb yam', english: 'movie theater, cinema — literally "the building for watching shows"', category: 'buildings', tags: ['noun','buildings','entertainment'], audioFile: null, exampleSentence: { hmong: 'Hnub no, kuv thiab kuv cov phooj ywg yuav mus saib yeeb yam hauv tsev ntsia yeeb yam.', english: 'Today, my friends and I are going to watch a movie at the movie theater.' } },
      { id: 'bld-lub-pej-thuam', hmongRPA: 'lub pej thuam', english: 'tower', category: 'buildings', tags: ['noun','buildings','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub pej thuam pom deb heev.', english: 'The tower can be seen from far away.', source: 'ai' } },
      { id: 'bld-tsev-rau-khoom', hmongRPA: 'tsev rau khoom', english: 'warehouse', category: 'buildings', tags: ['noun','buildings','work','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv khaws khoom ntau hauv tsev rau khoom.', english: 'They store many things in the warehouse.', source: 'ai' } },
      { id: 'bld-tsev-kawm-ntawv', hmongRPA: 'tsev kawm ntawv', english: 'school', category: 'buildings', tags: ['noun','buildings','education','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cov menyuam mus tsev kawm ntawv thaum sawv ntxov.', english: 'My children go to school in the morning.', source: 'ai' } },
      { id: 'bld-tsev-qiv-ntawv', hmongRPA: 'tsev qiv ntawv', english: 'library — literally the borrowing house', category: 'buildings', tags: ['noun','buildings','education','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws qiv phau ntawv ntawm tsev qiv ntawv.', english: 'She borrows a book from the library.', source: 'ai' } },
    ],
  },

  // Money:

  {
    id: 'money',
    title: 'Money & Shopping',
    description: 'Hmong words and phrases for prices, currency, buying, and selling.',
    emoji: '💰',
    words: [
      // Added 2026-09-27 (author: kos is NOT "bill" — a bill is daim nqi or daim ntawv them
      // nyiaj). Example sentences are Claude's, TODO-VERIFY.
      { id: 'money-daim-nqi', hmongRPA: 'daim nqi', english: 'a bill (to pay) — daim + nqi, price', category: 'money', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav tsum them daim nqi.', english: 'I have to pay the bill.' } },
      { id: 'money-daim-ntawv-them-nyiaj', hmongRPA: 'daim ntawv them nyiaj', english: 'a bill, an invoice (literally "the paper for paying money")', category: 'money', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Daim ntawv them nyiaj nyob saum rooj.', english: 'The bill is on the table.' } },
      {
        id: 'money-kim-npaum-licas',
        hmongRPA: 'kim npaum li cas?',
        english: 'How much does it cost? (lit. "expensive how much?")',
        category: 'money',
        tags: ['phrase', 'question', 'shopping'],
        audioFile: 'vocabulary/money/hmong-how-much/how-much-kim-npaum-licas.mp3',
        exampleSentence: { hmong: 'Lub no kim npaum li cas?', english: 'How much is this one?' },
        // note: source 'licas'; standard spacing 'li cas'. Built on 'kim' (expensive) + 'npaum li cas' (how much/to what extent).
      },
      {
        id: 'money-pestsawg',
        hmongRPA: 'pes tsawg?',
        // Was: english: 'How much? / How many?' — the position rule added 2026-09-26, worded
        // as question-words-how-many so the dictionary shows one definition.
        english: 'how much / how many? — goes BEFORE the noun, where a number would go (verb + pes tsawg + noun)',
        category: 'money',
        tags: ['phrase', 'question', 'shopping'],
        audioFile: 'vocabulary/money/hmong-how-much/how-much-pestsawg.mp3',
        exampleSentence: { hmong: 'Yog pes tsawg?', english: 'How much is it?' },
        // note: source 'pestsawg'; standard spacing 'pes tsawg'. This is the general "how many/how much" question word, not money-specific. 'yog pes tsawg' = "is how much."
      },
      {
        id: 'money-duaslas',
        hmongRPA: 'duas las',
        english: 'dollar',
        category: 'money',
        tags: ['noun', 'currency', 'loanword'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-duaslas.mp3',
        exampleSentence: { hmong: 'Tsib duas las.', english: 'Five dollars.' },
        // note: loanword from English "dollar." Spelling not standardized ('duas las', 'das las'). FLAG — choose a canonical form.
      },
      {
        id: 'money-xees',
        hmongRPA: 'xees',
        english: 'cent',
        category: 'money',
        tags: ['noun', 'currency', 'loanword'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-xees.mp3',
        // note: loanword from English "cent(s)." Verify spelling.
        exampleSentence: { hmong: 'Kuv muaj tsib xees xwb.', english: 'I only have five cents.', source: 'ai' },
      },
      {
        id: 'money-kim',
        hmongRPA: 'kim',
        english: 'expensive',
        category: 'money',
        tags: ['adjective', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-kim.mp3',
        // Was 'Heev kim.' — heev goes AFTER the adjective (the author's rule), 2026-09-27.
        exampleSentence: { hmong: 'Kim heev.', english: 'Very expensive.' },
      },
      {
        id: 'money-pheejyig',
        hmongRPA: 'pheej yig',
        english: 'cheap, inexpensive',
        category: 'money',
        tags: ['adjective', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-pheejyig.mp3',
        exampleSentence: { hmong: 'Lub no pheej yig.', english: 'This one is cheap.' },
      },
      {
        id: 'money-yuav',
        hmongRPA: 'yuav',
        english: '(verb: to buy)',
        category: 'money',
        tags: ['verb', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-yuav.mp3',
        exampleSentence: { hmong: 'Kuv yuav lub no.', english: 'I\'ll buy this one.' },
        // note: homograph with the future marker 'yuav' (will/going to). Appears in both your buildings and money sets — good recurring teaching point.
      },
      {
        id: 'money-thim',
        hmongRPA: 'thim',
        english: '(verb: to return, give back; refund)',
        category: 'money',
        tags: ['verb', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-thim.mp3',
        exampleSentence: { hmong: 'Thim rov qab.', english: 'Return it back.' },
        // note: 'thim' = to return/back up/refund. 'thim nyiaj' = refund money.
      },
      {
        id: 'money-muag',
        hmongRPA: 'muag',
        english: 'sell',
        senses: [{ en: 'sell', context: 'money' }, { en: 'be for sale; be sold', context: 'reading' }],
        category: 'money',
        tags: ['verb', 'shopping', 'reviewed'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-muag.mp3',
        exampleSentence: { hmong: 'Muag khoom.', english: 'To sell goods.' },
        // note: homograph — 'muag' also = "face" and "blind/blurry." Tone is the same; context disambiguates. Worth a learner note.
      },
      {
        id: 'money-tus-nqi',
        // 2026-09-26 (author): the classifier is ATTACHED — "tus nqi", the way the
        // id, the example and the note below already said. A noun is learned with
        // its classifier (the Classifiers lesson's "Important" rule); Bisang 1993
        // lists it as "tus nqe (the price)". Id kept — progress keys on it.
        // Was: hmongRPA: 'nqi'. A tap on a bare "nqi" still resolves through the
        // compound tier (tus nqi / txo nqi / lov nqi / nqi pes tsawg?).
        hmongRPA: 'tus nqi',
        english: 'the price; cost; fee',
        category: 'money',
        tags: ['noun', 'shopping'],
        audioFile: null,
        // Was 'Tus nqi yog tsawg?' — the author: pes tsawg (2026-09-27).
        exampleSentence: { hmong: 'Tus nqi yog pes tsawg?', english: 'What is the price?' },
        // note: 'nqi' = price/cost/debt. Takes classifier 'tus'. Also 'nqi' = debt to repay.
      },
      {
        id: 'money-txo-nqi',
        hmongRPA: 'txo nqi',
        english: 'discount; to lower the price',
        category: 'money',
        tags: ['noun', 'verb', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-txo-nqi.mp3',
        exampleSentence: { hmong: 'Txo nqi lawm.', english: 'The price was lowered.' },
        // note: 'txo' (to lower/reduce) + 'nqi' (price). Functions as a verb phrase as well as a noun.
      },
      {
        id: 'money-lov-nqi',
        hmongRPA: 'lov nqi',
        english: 'sale; price reduction',
        category: 'money',
        tags: ['noun', 'shopping'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-lov-nqi.mp3',
        // note: 'lov nqi' — 'lov' (to break) + 'nqi' (price), "broken/slashed price." Spelling/usage uncertain to me vs the more common 'txo nqi'. FLAG for verification.
        exampleSentence: { hmong: 'Lub tsho no lov nqi hnub no.', english: 'This shirt is on sale today.', source: 'ai' },
      },
      {
        id: 'money-nyiaj',
        hmongRPA: 'nyiaj',
        english: 'money; silver',
        category: 'money',
        tags: ['noun', 'currency'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-nyiaj.mp3',
        exampleSentence: { hmong: 'Kuv tsis muaj nyiaj.', english: 'I don\'t have money.' },
        // note: 'nyiaj' = money AND silver (the metal) — the link reflects silver's historic role as currency/wealth in Hmong culture. Nice cultural teaching point.
      },
      {
        id: 'money-tshev',
        hmongRPA: 'tshev',
        english: 'check (payment)',
        category: 'money',
        tags: ['noun', 'currency', 'loanword'],
        audioFile: 'vocabulary/money/hmong-money/hmong-money-tshev.mp3',
        // note: loanword from English "check." Verify spelling 'tshev'.
        exampleSentence: { hmong: 'Kuv sau ib daim tshev them nqi.', english: 'I write a check to pay the bill.', source: 'ai' },
      },
      // The four price questions the how-much lesson teaches. They were in the
      // lesson only, so the word bank drilled a set the learner hadn't seen
      // (notes/56). Glosses are the lesson's own.
      { id: 'money-how-much-is-it', hmongRPA: 'yog pes tsawg?', english: 'how much is it?', category: 'money', tags: ['question', 'phrase'], audioFile: 'vocabulary/money/hmong-how-much/how-much-yog-pestsawg.mp3', exampleSentence: { hmong: 'Lub hnab no yog pes tsawg?', english: 'How much is this bag?', source: 'ai' } },
      { id: 'money-how-many-are-there', hmongRPA: 'muaj pes tsawg?', english: 'how many are there?', category: 'money', tags: ['question', 'phrase'], audioFile: 'vocabulary/money/hmong-how-much/how-much-muaj-pestsawg.mp3', exampleSentence: { hmong: 'Hauv lub thawv muaj pes tsawg?', english: 'How many are in the box?', source: 'ai' } },
      { id: 'money-how-many-want', hmongRPA: 'koj xav tau pes tsawg?', english: 'how many do you want?', category: 'money', tags: ['question', 'phrase'], audioFile: 'vocabulary/money/hmong-how-much/how-much-koj-xav-tau-pestsawg.mp3', exampleSentence: { hmong: 'Koj xav tau pes tsawg?', english: 'How many do you want?', source: 'ai' } },
      { id: 'money-what-price', hmongRPA: 'nqi pes tsawg?', english: 'what is the price?', category: 'money', tags: ['question', 'phrase'], audioFile: 'vocabulary/money/hmong-how-much/how-much-nqi-pestsawg.mp3', exampleSentence: { hmong: 'Lub tsho no nqi pes tsawg?', english: 'What is the price of this shirt?', source: 'ai' } },
    ],
  },

  // Timeframes:

  {
    id: 'timeframes',
    title: 'Timeframes & Time of Day',
    // Was: '…parts of the day, telling time, and relative days…' — clock time moved to
    // `clock-time` (Telling the Time) on 2026-09-26.
    description: 'Hmong words for parts of the day and relative days (past and future). Clock time is its own set: Telling the Time.',
    emoji: '🕐',
    words: [
      {
        id: 'time-ib-tag-hmo',
        // 'hmos', not 'hmo' — aligned to the recording, and to this file's own
        // pattern: 'ib hmos' / 'hnub hmos' already take the -s, and 'hmo ntuj'
        // drops it before a following word. This entry was the outlier. The ID
        // is unchanged, since ids are progress keys.
        hmongRPA: 'ib tag hmos',
        english: 'midnight',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-ib-tag-hmos.mp3',
        exampleSentence: { hmong: 'Ib tag hmos.', english: 'Midnight.' },
        // note: 'ib tag hmo' = lit. "one-half night" = midnight. Contrast with 'ib hmos' below — similar look, different meaning.
      },
      {
        id: 'time-ib-hmos',
        hmongRPA: 'ib hmos',
        english: 'one night / all night long',
        category: 'timeframes',
        tags: ['noun', 'time', 'duration'],
        audioFile: 'vocabulary/timeframes/hmong-time-ib-hmos.mp3',
        exampleSentence: { hmong: 'Pw ib hmos.', english: 'Sleep one whole night.' },
      },
      {
        id: 'time-tavsu',
        hmongRPA: 'tav su',
        english: 'noon, midday',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-tavsu.mp3',
        exampleSentence: { hmong: 'Tav su lawm.', english: 'It\'s noon now.' },
        // Added 2026-09-27 — Time of Day needs five sentences to drill. Claude's, TODO-VERIFY.
        moreExamples: [{ hmong: 'Peb noj mov thaum tav su.', english: 'We eat at noon.', source: 'ai' }],
        // note: source 'Tavsu'; standard spacing 'tav su'. 'su' relates to the midday rest/meal.
      },
      {
        id: 'time-tavsu-dua',
        hmongRPA: 'tav su dua',
        english: 'afternoon (lit. "past noon")',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-tavsu-dua.mp3',
        // note: 'dua' (past/over) marks it as after midday. Also 'yav tav su' / 'yav tom qab tav su' for afternoon. Verify preferred form.
        exampleSentence: { hmong: 'Peb sib ntsib tav su dua.', english: 'We meet in the afternoon.', source: 'ai' },
      },
      {
        id: 'time-sawv-ntxov',
        hmongRPA: 'sawv ntxov',
        english: 'morning; a.m.',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-sawv-ntxov.mp3',
        exampleSentence: { hmong: 'Yav sawv ntxov.', english: 'In the morning.' },
        // Added 2026-09-27 — Time of Day needs five sentences to drill. Claude's, TODO-VERIFY.
        moreExamples: [{ hmong: 'Kuv haus kas fes thaum sawv ntxov.', english: 'I drink coffee in the morning.', source: 'ai' }],
        // note: 'sawv ntxov' = lit. "rise early." Common full form 'yav sawv ntxov.'
      },
      {
        id: 'time-tsaus-ntuj',
        hmongRPA: 'tsaus ntuj',
        english: 'night, evening; p.m. (lit. "dark sky")',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-tsaus-ntuj.mp3',
        exampleSentence: { hmong: 'Yav tsaus ntuj.', english: 'In the evening.' },
        // Added 2026-09-27 — Time of Day needs five sentences to drill. Claude's, TODO-VERIFY.
        moreExamples: [{ hmong: 'Peb noj mov thaum tsaus ntuj.', english: 'We eat in the evening.', source: 'ai' }],
        // The author, 2026-09-27: night is the literal meaning. Night, evening and p.m. are all
        // correct, depending on context: with a clock time it's p.m.
        examples: [
          { hmong: 'Kaum teev tsaus ntuj', english: '10 p.m. (with a clock time)' },
          { hmong: 'Tam sim no yog tsaus ntuj.', english: "Right now it's night." },
        ],
      },
      {
        id: 'time-nruab-hnub',
        hmongRPA: 'nruab hnub',
        english: 'daytime',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-nruab-hnub.mp3',
        // note: 'nruab' (midst/middle) + 'hnub' (day/sun). Parallels 'nruab nrab' (middle) from your locatives set.
        exampleSentence: { hmong: 'Kuv tsis pw nruab hnub.', english: 'I do not sleep during the day.', source: 'ai' },
        // Added 2026-09-27 — Time of Day needs five sentences to drill. Claude's, TODO-VERIFY.
        moreExamples: [{ hmong: 'Nws ua haujlwm thaum nruab hnub.', english: 'She works during the day.', source: 'ai' }],
      },
      {
        id: 'time-hmo-ntuj',
        hmongRPA: 'hmo ntuj',
        english: 'nighttime',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-hmo-ntuj.mp3',
        exampleSentence: { hmong: 'Hmo ntuj tsaus.', english: 'The night is dark.' },
        // Added 2026-09-27 — Time of Day needs five sentences to drill. Claude's, TODO-VERIFY.
        moreExamples: [{ hmong: 'Kuv nyeem ntawv thaum hmo ntuj.', english: 'I read at night.', source: 'ai' }],
      },
      {
        id: 'time-tagkis-no',
        hmongRPA: 'tagkis no',  // was hmongRPA: 'tag kis no' — joined, author 2026-09-27
        english: 'this morning',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-tagkis-no.mp3',
        // note: 'tag kis' = morning OR tomorrow; 'no' (this) pins it to "this morning." See 'tag kis' (tomorrow) below — same word, context-dependent. KEY teaching point.
        exampleSentence: { hmong: 'Tagkis no kuv mus ua haujlwm.', english: 'This morning I go to work.', source: 'ai' },
      },
      {
        id: 'time-ib-pliag',
        hmongRPA: 'ib pliag',
        english: 'in a moment, later, shortly',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-ib-pliag.mp3',
        exampleSentence: { hmong: 'Ib pliag ntxiv.', english: 'In a little while.' },
        // note: source 'Ib pliag / tsam'; 'ib pliag' and 'ib tsam' both = "a short while / in a moment." Could split into two entries.
      },
      // ---- Relative days: PAST ----
      {
        id: 'time-hnub-hnub',
        hmongRPA: 'hnub hnub',
        english: 'three days ago',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-hnub-hnub.mp3',
        // note: 'hnub hnub' as "3 days ago" is uncertain to me — 'hnub hnub' often means "every day / daily." The day-offset sense needs verification. FLAG.
        exampleSentence: { hmong: 'Hnub hnub kuv nyob tsev.', english: 'Three days ago, I stayed home.', source: 'ai' },
      },
      {
        id: 'time-hnub-hmos',
        hmongRPA: 'hnub hmos',
        english: 'two days ago',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-hnub-hmos.mp3',
        // note: 'hnub hmos' for "2 days ago" — uncertain; verify against the full day-offset series. FLAG.
        exampleSentence: { hmong: 'Hnub hmos kuv muaj haujlwm.', english: 'I had work two days ago.', source: 'ai' },
      },
      {
        id: 'time-naghmo',
        // 'hmos', not 'hmo' — see 'ib tag hmos' above. Matches the recording
        // and this file's own -s pattern. ID unchanged (progress key).
        hmongRPA: 'naghmo',  // was hmongRPA: 'nag hmos' — joined, author 2026-09-27
        english: 'yesterday',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-nag-hmos.mp3',
        // Was: 'Naghmo kuv mus.' — "went" takes tau (author, 2026-09-28).
        exampleSentence: { hmong: 'Naghmo kuv tau mus.', english: 'I went yesterday.' },
        // note: source 'Naghmo'; standard spacing 'nag hmo'. Lit. "last night" but used for "yesterday."
      },
      // ---- Relative days: FUTURE ----
      {
        id: 'time-tagkis',
        hmongRPA: 'tagkis',  // was hmongRPA: 'tag kis' — joined, author 2026-09-27
        english: 'tomorrow (also: morning)',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-tagkis.mp3',
        exampleSentence: { hmong: 'Tagkis kuv mus.', english: 'I\'ll go tomorrow.' },
        // note: same word as the 'morning' sense in 'tag kis no'. Tomorrow vs morning is context-dependent — the single most important ambiguity in this set.
      },
      {
        id: 'time-nagkis',
        hmongRPA: 'nagkis',  // was hmongRPA: 'nag kis' — joined, author 2026-09-27
        english: 'the day after tomorrow (two days from now)',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-nagkis.mp3',
        // note: 'nag kis' as "2 days later" — verify; the past/future day-offset series varies and I'm not fully confident here. FLAG.
        exampleSentence: { hmong: 'Nagkis, wb mam li mus tom khw.', english: 'Two days from now, we will go to the store.', source: 'ai' },
      },
      {
        id: 'time-puagnraus',
        hmongRPA: 'puagnraus',  // was hmongRPA: 'puag nraus' — joined, author 2026-09-27
        english: 'three days from now',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-puag-nraus.mp3',
        // note: 'puag nraus' for "3 days later" — uncertain spelling and offset. FLAG for verification.
        exampleSentence: { hmong: 'Puagnraus kuv mus tom khw.', english: 'Three days from now I will go to the market.', source: 'ai' },
      },
    ],
  },

  {
    // ── TELLING THE TIME — 2026-09-26 (author: separate telling the time from days /
    // time of day — "too different, two different concepts"). The three clock words
    // moved here from `timeframes` (ids unchanged, so progress and saved words carry
    // over), plus PATTERN cards for how a clock time is built. Every pattern example is
    // the author's own line from the Time Explained lesson (time-explained.js), spelled
    // as they wrote it (pebcaug, plaubcaum, neesnkaum, tamsim nov). Backs path unit u-clock.
    id: 'clock-time',
    title: 'Telling the Time',
    description: 'Clock time: the hour, teev, the minutes, and morning or evening at the end.',
    emoji: '⏰',
    words: [
      {
        id: 'time-teev',
        hmongRPA: 'teev',
        english: 'hour; o\'clock',
        category: 'clock-time',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-teev.mp3',
        exampleSentence: { hmong: 'Tsib teev.', english: 'Five o\'clock.' },
        // note: 'teev' = hour/o'clock AND "to weigh." Homograph; context disambiguates.
      },
      {
        id: 'time-feeb',
        hmongRPA: 'feeb',
        english: 'minute',
        category: 'clock-time',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-feeb.mp3',
        exampleSentence: { hmong: 'Kaum feeb.', english: 'Ten minutes.' },
      },
      {
        id: 'time-teevsij',
        hmongRPA: 'teev sij',
        english: 'clock; watch',
        category: 'clock-time',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-teev-sij.mp3',
        // note: also in your furniture set ('lub teev sij' = clock). Cross-reference.
        // Was the AI example 'Txhua feeb, kuv ntsia lub teev sij ntawd.' — replaced 2026-09-26 by the
        // author's own line from the Time Explained lesson (spelling as they wrote it).
        exampleSentence: { hmong: 'Koj lub teevsij yog pestsawg teev?', english: 'What time does your clock say?' },
      },
      { id: 'clock-what-time', hmongRPA: 'yog pes tsawg teev lawm?', english: 'what time is it?', category: 'clock-time', tags: ['question', 'time', 'clock', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog pes tsawg teev lawm?', english: 'What time is it?' } },  // the Time Explained lesson's own title question
      { id: 'clock-pattern-number-teev', hmongRPA: 'number + teev', english: 'o\'clock — the hour\'s number, then teev', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tamsim nov yog plaub teev.', english: 'Right now it is 4 o\'clock.' }, examples: [{ hmong: 'ob teev', english: 'two o\'clock' }, { hmong: 'plaub teev', english: 'four o\'clock' }, { hmong: 'tsib teev', english: 'five o\'clock' }] },
      { id: 'clock-pattern-hour-minutes', hmongRPA: 'hour + teev + minutes', english: 'a clock time — the hour first, then teev, then the minutes', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ob teev pebcaug.', english: '2:30' }, examples: [{ hmong: 'ob teev pebcaug', english: '2:30' }] },
      { id: 'clock-pattern-teev-mus', hmongRPA: 'hour + teev mus + minutes', english: 'the same clock time with mus slipped in — less common, same meaning', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ob teev mus pebcaug.', english: '2:30' }, examples: [{ hmong: 'ob teev mus pebcaug', english: '2:30' }] },
      { id: 'clock-pattern-thiab-feeb', hmongRPA: 'hour + teev thiab + minutes + feeb', english: 'an exact time — with thiab (and), feeb (minutes) becomes required', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb teev thiab plaubcaum rau feeb.', english: '3:46 — three hours and forty-six minutes' }, examples: [{ hmong: 'peb teev thiab plaubcaum rau feeb', english: '3:46' }] },
      { id: 'clock-pattern-am-pm', hmongRPA: 'time + sawv ntxov / tsaus ntuj', english: 'a.m. / p.m. — sawv ntxov is a.m., tsaus ntuj is p.m.; they go at the END of the time', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Rau teev pebcaug sawv ntxov.', english: '6:30 a.m.' }, examples: [{ hmong: '… sawv ntxov', english: 'a.m. (morning)' }, { hmong: '… tsaus ntuj', english: 'p.m. (evening, night)' }, { hmong: 'tsib teev neesnkaum tsib tsaus ntuj', english: '5:25 p.m.' }] },
      { id: 'clock-pattern-duration', hmongRPA: 'tau + number + teev', english: 'for … hours — teev as a length of time, not the clock', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sau ntawv tau ob teev.', english: 'I wrote for 2 hours.' }, examples: [{ hmong: 'tau ob teev', english: 'for two hours' }] },
      // thaum — the author, 2026-09-27: "the preposition word that sets the location of time,
      // during and when". The author wrote "thaum tsib tsuas ntuj"; written here as the full
      // clock form "thaum tsib teev tsaus ntuj" (5 p.m.) — confirm.
      { id: 'clock-pattern-thaum', hmongRPA: 'thaum + time', english: 'when, during, at — thaum sets the time of an action', category: 'clock-time', tags: ['time', 'clock', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Chai mus yos hav zoov thaum tsib teev tsaus ntuj.', english: 'Chai goes hunting at 5 p.m.' }, examples: [{ hmong: 'thaum tsib teev tsaus ntuj', english: 'at 5 p.m.' }, { hmong: 'thaum sawv ntxov', english: 'in the morning' }, { hmong: 'thaum hmo ntuj', english: 'at night' }] },
    ],
  },

  // Quantifiers

  {
    id: 'quantifiers',
    title: 'Quantifiers',
    description: 'Hmong words for amount, including animate/inanimate distinctions and classifier interactions.',
    emoji: '🔢',
    words: [
      {
        id: 'quant-ib-co',
        hmongRPA: 'ib co',
        english: 'some (general)',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Ib co dej.', english: 'Some water.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Kuv muaj ib co nyiaj.', english: 'I have some money.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Kuv muaj ib co kua txob.', english: 'I have some peppers.', source: 'ai' },
          // { hmong: 'Niam yuav ib co nqaij.', english: 'Mom will buy some meat.', source: 'ai' },
        // ],
        // note: 'ib co' = a portion/some, general. 'co' relates to 'cov' (the plural classifier from your classifiers set).
      },
      {
        id: 'quant-tej-txhia',
        hmongRPA: 'tej txhia',
        english: 'some (specifying/contrasting — "certain ones")',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Tej txhia neeg.', english: 'Some (certain) people.' },
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Tej txhia tus menyuam nyiam mis.', english: 'Some children like milk.', source: 'ai' },
          // { hmong: 'Tej txhia lub tsev muaj aub.', english: 'Some houses have dogs.', source: 'ai' },
        // ],
        // note: per your source — differentiating "some," i.e. some-but-not-others. Contrasts with the general 'ib co'.
      },
      {
        id: 'quant-ob-peb',
        hmongRPA: 'ob peb',
        english: 'a few (lit. "two-three")',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Ob peb tus.', english: 'A few (people/animals).' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Kuv muaj ob peb tus phooj ywg.', english: 'I have a few friends.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Kuv muaj ob peb tus phooj ywg.', english: 'I have a few friends.', source: 'ai' },
        // ],
        // note: literally "two three" = a small indefinite number, roughly "a couple / a few." Same numeral-pairing strategy as English "two or three."
      },
      {
        id: 'quant-ntau',
        hmongRPA: 'ntau',
        english: 'many, much, a lot (esp. for things/uncountables)',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Ntau dej.', english: 'A lot of water.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Kuv muaj ntau phau ntawv.', english: 'I have many books.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Kuv muaj ntau tus phooj ywg.', english: 'I have many friends.', source: 'ai' },
        // ],
        // note: CORRECTED — source glossed 'ntau' as "a few," but 'ntau' means MANY/MUCH (large quantity). The animate/inanimate split your source noted is real: 'ntau' for things/amounts, 'coob' for people/animals. Mislabeling this would seriously mislead learners.
      },
      {
        id: 'quant-coob',
        hmongRPA: 'coob',
        english: 'many (specifically for animate nouns: people, animals)',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Neeg coob.', english: 'Many people.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Hnub no neeg coob heev.', english: 'There are very many people today.', source: 'ai' }],
        // note: 'coob' = numerous, used for animate beings. You would NOT say 'dej coob' for "much water" — that takes 'ntau'. This animate/inanimate split is a key teaching point.
      },
      {
        id: 'quant-tsawg',
        hmongRPA: 'tsawg',
        english: 'few, little (a small amount)',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Neeg tsawg.', english: 'Few people.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Hnub no neeg tsawg.', english: 'There are few people today.', source: 'ai' }],
        // note: 'tsawg' = few/little, the opposite of both 'ntau' and 'coob'. Also the question word "how many" (e.g. 'muaj pes tsawg' = how many).
      },
      {
        id: 'quant-qee',
        hmongRPA: 'qee',
        english: 'some, certain',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Qee tus neeg.', english: 'Certain people / some people.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Qee tus neeg tsis tuaj.', english: 'Some people did not come.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Qee tus menyuam noj mov.', english: 'Some children eat food.', source: 'ai' },
          // { hmong: 'Qee lub tsev muaj aub.', english: 'Some houses have dogs.', source: 'ai' },
        // ],
        // note: per your source — 'qee' precedes a classifier (e.g. 'qee tus', 'qee lub'). Means "some/certain (of a set)."
      },
      {
        id: 'quant-tej',
        hmongRPA: 'tej',
        english: 'some',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Tej lub.', english: 'Some (items).' },
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Tej tus menyuam nyiam ua si.', english: 'Some children like to play.', source: 'ai' },
        // ],
        // note: per your source — 'tej' derives from 'tej txhia' by dropping 'txhia'; this lets it quantify both singular and plural nouns flexibly. Good advanced note.
      },
      {
        id: 'quant-txhua',
        hmongRPA: 'txhua',
        english: 'every; each',
        senses: [{ en: 'every; each', context: 'quantifiers' }, { en: 'all', context: 'reading' }],
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Txhua tus.', english: 'Everyone / each one.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Txhua tus neeg zoo siab.', english: 'Everyone is happy.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Txhua hnub kuv mus kawm.', english: 'I go to school every day.', source: 'ai' },
          // { hmong: 'Txhua tus menyuam noj mov.', english: 'Every child eats food.', source: 'ai' },
        // ],
        // note: per your source — when followed by 'txhia' ('txhua txhia') it intensifies to "every single." 'txhua hnub' = every day.
      },
      {
        id: 'quant-txhua-txhia',
        hmongRPA: 'txhua txhia',
        english: 'every single (intensified)',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Txhua txhia tus.', english: 'Every single one.' },
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Txhua txhia tus menyuam tuaj.', english: 'Every single child came.', source: 'ai' },
          // { hmong: 'Txhua txhia lub tsev muaj neeg.', english: 'Every single house has people.', source: 'ai' },
        // ],
        // note: the intensified pairing your source describes. Added as its own entry since learners will meet it as a fixed phrase.
      },
      {
        id: 'quant-tagnrho',
        hmongRPA: 'tag nrho',
        english: 'all, the whole, entirely',
        category: 'quantifiers',
        tags: ['quantifier'],
        audioFile: null,
        exampleSentence: { hmong: 'Tag nrho cov neeg.', english: 'All the people.' },
        // Full sentence for the path's builder — Claude's, TODO-VERIFY (2026-09-27; the author asked for the quantifiers path).
        moreExamples: [{ hmong: 'Tag nrho cov neeg tuaj lawm.', english: 'All the people have come.', source: 'ai' }],
        // ⚠️ PULLED 2026-09-25 (author): Perplexity batch withdrawn — a new batch from another model, verified by a native speaker, will replace it. RESTORE by uncommenting.
        // moreExamples: [
          // { hmong: 'Tag nrho cov menyuam noj mov.', english: 'All the children eat food.', source: 'ai' },
          // { hmong: 'Tag nrho lub tsev ntxuav lawm.', english: 'The whole house has been washed.', source: 'ai' },
        // ],
        // note: source 'Tasnrho / Tagnrho'; standard is 'tag nrho'. Means "all / the entirety."
      },
    ],
  },
  // ⚠️ COMMENTED OUT 2026-09-30 (author: "comment out bisang1993 too") — Measure & Group Words, from Bisang (1993).
  // TO RESTORE: uncomment, and re-add the id to the grammar-words theme. Words the author's word list
  // also has were re-added from that list into regular categories the same day.
  // {
  //   // ── MEASURE & GROUP WORDS — added 2026-09-26 from Bisang (1993),
  //   // "Classifiers, Quantifiers and Class Nouns in Hmong", Studies in Language
  //   // 17(1):1–51, Appendix I §2 (the author's downloaded copy). Bisang's
  //   // "quantifiers": words that measure or group (a flock, a strand, a kind)
  //   // rather than classify one thing — one step less grammaticalized than lub/tus
  //   // on his continuum (noun → class noun → quantifier → classifier).
  //   //
  //   // ⚠️ EVERY EXAMPLE IS THE PAPER'S OWN, verbatim (it cites Mottin 1978 and
  //   // Bertrais-Charrier 1979) — `source: 'bisang-1993'`, NOT 'ai', so the
  //   // sentence builder may use them. Glosses follow the paper's English.
  //   // Words already in the classifiers set (nkawm, tsob, thooj, phau, yim, pob…)
  //   // are not repeated here. Grammar, so FREE (lib/vocabAccess.js).
  //   id: 'measure-words',
  //   title: 'Measure & Group Words',
  //   description: 'A flock, a strand, a kind, a shower of rain — how Hmong measures and groups things.',
  //   emoji: '📏',
  //   words: [
  //     { id: 'measure-pab', hmongRPA: 'pab', english: 'group, flock, herd — of people or animals', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib pab neeg', english: 'a group of people', source: 'bisang-1993' } },
  //     { id: 'measure-hom', hmongRPA: 'hom', english: 'kind, sort, species', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib hom noog', english: 'a species of bird', source: 'bisang-1993' } },
  //     { id: 'measure-yam', hmongRPA: 'yam', english: 'kind, sort; a thing', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib yam tshiab.', english: 'I see something new.', source: 'bisang-1993' } },
  //     { id: 'measure-thaj', hmongRPA: 'thaj', english: 'a patch, a plot — of land or of a crop', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib thaj av', english: 'a plot of land', source: 'bisang-1993' } },
  //     { id: 'measure-qais', hmongRPA: 'qais', english: 'a strand, a lock — of hair', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib qais plaub hau', english: 'a lock of hair', source: 'bisang-1993' } },
  //     { id: 'measure-kauj', hmongRPA: 'kauj', english: 'a coil, a ring', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib kauj hlua', english: 'a coil of rope', source: 'bisang-1993' } },
  //     { id: 'measure-lo', hmongRPA: 'lo', english: 'a mouthful — and with lus, a word', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib lo lus', english: 'a word', source: 'bisang-1993' } },
  //     { id: 'measure-xub', hmongRPA: 'xub', english: 'a nest, a swarm, a colony — of insects or small animals', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib xub muv', english: 'a swarm of bees', source: 'bisang-1993' } },
  //     { id: 'measure-zag', hmongRPA: 'zag', english: 'a brood, a litter; an age group', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib zag npua', english: 'a litter of pigs', source: 'bisang-1993' } },
  //     { id: 'measure-kob', hmongRPA: 'kob', english: 'a shower — of rain', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib kob nag', english: 'a shower of rain', source: 'bisang-1993' } },
  //     { id: 'measure-nthwv', hmongRPA: 'nthwv', english: 'a gust — of wind; a trip', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib nthwv cua', english: 'a gust of wind', source: 'bisang-1993' } },
  //     { id: 'measure-tauv', hmongRPA: 'tauv', english: 'a clump, a cluster, a tuft', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib tauv plaub hau', english: 'a tuft of hair', source: 'bisang-1993' } },
  //     { id: 'measure-phaum', hmongRPA: 'phaum', english: 'an age group; things of the same season', category: 'measure-words', tags: ['measure-word', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'Nws yog kuv phaum.', english: 'He is the same age as I am.', source: 'bisang-1993' } },
  //   ],
  // },
  // ⚠️ COMMENTED OUT 2026-09-30 (author: "comment out bisang1993 too") — Other Classifiers & Measures, from Bisang (1993).
  // TO RESTORE: uncomment, and re-add the id to the grammar-words theme. Words the author's word list
  // also has were re-added from that list into regular categories the same day.
  // {
  //   // ── ALL CLASSIFIERS & MEASURES — 2026-09-28. The author pasted Bisang’s (1993) full inventory;
  //   // each entry checked against the local PDF (Appendix I). Only words missing from the
  //   // `classifiers` and `measure-words` sets. Bisang’s hierarchy: nouns → class nouns →
  //   // quantifiers → intrinsic quantifiers → classifiers. His 7 principal classifiers: lub, tus,
  //   // leej, rab, txoj, daim, txhais; 4 restricted: thooj, qhov, zaj, tsab. Reference set — not a
  //   // path unit. Spellings as Bisang heads them (twv / rev; his examples also write tw / re).
  //   id: 'classifier-inventory',
  //   // Was 'All Classifiers & Measures' (2026-09-28, same day) — the author: the others, separate from the primary set.
  //   title: 'Other Classifiers & Measures',
  //   description: 'The rest of Bisang’s (1993) inventory: less common classifiers, quantifiers, collectives and measures.',
  //   emoji: '🧮',
  //   words: [
  //     // RESTRICTED CLASSIFIER
  //     { id: 'inv-tsab', hmongRPA: 'tsab', english: 'classifier for messages and letters — one of Bisang’s four restricted classifiers', category: 'classifier-inventory', tags: ['classifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib tsab ntawv', english: 'a letter', source: 'bisang-1993' } },
  //     // INTRINSIC QUANTIFIERS
  //     { id: 'inv-tawb', hmongRPA: 'tawb', english: 'a passing — of feces, urine or spittle', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib tawb zis', english: 'a passing of urine', source: 'bisang-1993' } },
  //     { id: 'inv-qhoo', hmongRPA: 'qhoo', english: 'a bundle, a packet — of bundled or packed things', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib qhoo xyoob', english: 'a bundle of bamboo', source: 'bisang-1993' } },
  //     { id: 'inv-vuag', hmongRPA: 'vuag', english: 'a burst, a gust — of rain or wind', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib vuag nag', english: 'a cloudburst', source: 'bisang-1993' } },
  //     { id: 'inv-twv', hmongRPA: 'twv', english: 'a whirl, a mass — of water, rain or cloud (like tauv)', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib twv nag', english: 'a shower of rain', source: 'bisang-1993' } },
  //     { id: 'inv-kuam', hmongRPA: 'kuam', english: 'a hand — of bananas', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib kuam txiv', english: 'a hand of bananas', source: 'bisang-1993' } },
  //     { id: 'inv-thij', hmongRPA: 'thij', english: 'a hand — of bananas (like kuam)', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib thij txiv', english: 'a hand of bananas', source: 'bisang-1993' } },
  //     { id: 'inv-rev', hmongRPA: 'rev', english: 'a stem, a head — of flowers, leaves, fruit or grain', category: 'classifier-inventory', tags: ['intrinsic-quantifier', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib rev paj ntoos', english: 'a stem of flowers', source: 'bisang-1993' } },
  //     // COLLECTIVES
  //     { id: 'inv-ntwg', hmongRPA: 'ntwg', english: 'a string — of fish or meat carried together', category: 'classifier-inventory', tags: ['collective', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib ntwg ntses', english: 'a string of fish', source: 'bisang-1993' } },
  //     { id: 'inv-phiaj', hmongRPA: 'phiaj', english: 'a set, a line — carried on a string; a row', category: 'classifier-inventory', tags: ['collective', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib phiaj xauv', english: 'a set of neck rings', source: 'bisang-1993' } },
  //     // MEASURES — length
  //     { id: 'inv-ntiv', hmongRPA: 'ntiv', english: 'a finger’s width (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-xib', hmongRPA: 'xib', english: 'a palm’s width (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-taus', hmongRPA: 'taus', english: 'a fist’s width (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-noos', hmongRPA: 'noos', english: 'a span from the thumb to the first finger (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-dos', hmongRPA: 'dos', english: 'a span from the thumb to the middle finger (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-tshim', hmongRPA: 'tshim', english: 'a cubit — elbow to fingertip (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-daj', hmongRPA: 'daj', english: 'an arm span — fingertip to fingertip (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-pas', hmongRPA: 'pas', english: 'a measuring rod (measure)', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-ncua-hneev', hmongRPA: 'ncua hneev', english: 'a crossbow’s range — about 50 m', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-ncua-phom', hmongRPA: 'ncua phom', english: 'a gun’s range — about 250 m', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-teev-kev', hmongRPA: 'teev kev', english: 'an hour’s walk', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-hnub-ke', hmongRPA: 'hnub ke', english: 'a day’s walk', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-xi', hmongRPA: 'xi', english: 'a centimeter', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-mev', hmongRPA: 'mev', english: 'a meter', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-lav', hmongRPA: 'lav', english: 'a kilometer', category: 'classifier-inventory', tags: ['measure-length', 'bisang-1993'], audioFile: null },
  //     // MEASURES — weight
  //     { id: 'inv-nqas', hmongRPA: 'nqas', english: 'a gram (about 1 g)', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-khis', hmongRPA: 'khis', english: 'about 100 g', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-kis-laus', hmongRPA: 'kis laus', english: 'a kilogram (about 1 kg)', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-meem', hmongRPA: 'meem', english: 'about 12 kg', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-tab', hmongRPA: 'tab', english: 'about 120 kg', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-txiaj', hmongRPA: 'txiaj', english: 'a traditional weight for opium and powders — about 3.8 g', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-las', hmongRPA: 'las', english: 'a traditional weight for opium and powders — about 38 g', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-choj', hmongRPA: 'choj', english: 'a traditional weight for opium and powders — about 380 g (also daim)', category: 'classifier-inventory', tags: ['measure-weight', 'bisang-1993'], audioFile: null },
  //     // MEASURES — capacity
  //     { id: 'inv-hwj', hmongRPA: 'hwj', english: 'a bottle, a bottleful', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-thoob', hmongRPA: 'thoob', english: 'a bucket, a bucketful (also pib)', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib thoob dej', english: 'a bucket of water', source: 'bisang-1993' } },
  //     { id: 'inv-tsib-jug', hmongRPA: 'tsib', english: 'a jug, a jugful (measure) — also the number five', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-ntim', hmongRPA: 'ntim', english: 'a small rice bowl, a bowlful', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-phaj', hmongRPA: 'phaj', english: 'a plate, a plateful', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-txawm', hmongRPA: 'txawm', english: 'a batch, a brew — of liquor (also txaum)', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null },
  //     { id: 'inv-kab', hmongRPA: 'kab', english: 'a pipeful — of opium', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib kab yeeb', english: 'a pipeful of opium', source: 'bisang-1993' } },
  //     { id: 'inv-khawv', hmongRPA: 'khawv', english: 'a mouthful', category: 'classifier-inventory', tags: ['measure-capacity', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib khawv mov', english: 'a mouthful of rice', source: 'bisang-1993' } },
  //     // MEASURES — area
  //     { id: 'inv-plas', hmongRPA: 'plas', english: 'a wide expanse — of land or slope', category: 'classifier-inventory', tags: ['measure-area', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib plas teb', english: 'a large field', source: 'bisang-1993' } },
  //     // MEASURES — time
  //     { id: 'inv-pliag', hmongRPA: 'pliag', english: 'a second; a moment', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib pliag', english: 'one second', source: 'bisang-1993' } },
  //     { id: 'inv-fiab', hmongRPA: 'fiab', english: 'a minute; also a small weight (about 0.38 g) for opium and powders', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib fiab', english: 'one minute', source: 'bisang-1993' } },
  //     { id: 'inv-tees', hmongRPA: 'tees', english: 'an hour (also tees tsoob)', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib tees', english: 'one hour', source: 'bisang-1993' } },
  //     { id: 'inv-chim', hmongRPA: 'chim', english: 'a while — up to an hour', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib chim', english: 'a while', source: 'bisang-1993' } },
  //     { id: 'inv-tsam', hmongRPA: 'tsam', english: 'a while — more than an hour', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib tsam', english: 'a longer while', source: 'bisang-1993' } },
  //     { id: 'inv-ntus', hmongRPA: 'ntus', english: 'a period of time — about two to three months', category: 'classifier-inventory', tags: ['measure-time', 'bisang-1993'], audioFile: null, exampleSentence: { hmong: 'ib ntus', english: 'a period of time', source: 'bisang-1993' } },
  //   ],
  // },
  {
    // ── NOT & DON'T — added 2026-09-26 (the author: "ADD ANOTHER path
    // specifically for the tsis, don't"). Backs path unit u-negation.
    //
    // ⚠️ NO NEW HMONG. Every example is a sentence already in this file, reused:
    // five are human-written (incl. the author-corrected 'Tsis txhob mus ze tus
    // tsov ntawd' from animals-tiger), three are the AI drafts they came with and
    // keep source: 'ai'. The same words exist elsewhere (tsis in `grammar`,
    // tsis yog in yog-to-be); lookup merges their senses.
    //
    // ⚠️ THE RULE THIS SET EXISTS TO TEACH: a negative command is ALWAYS
    // 'tsis txhob', never 'txhob tsis' (author ruling 2026-09-16). Grammar, so FREE.
    id: 'negation',
    title: 'Not & Don\'t',
    description: 'Tsis and tsis txhob — saying no, not, and don\'t.',
    emoji: '🚫',
    words: [
      { id: 'neg-tsis', hmongRPA: 'tsis', english: 'not — goes right before the verb', category: 'negation', tags: ['negation', 'grammar'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis mus vim hais tias kuv nyuaj siab.', english: 'I do not go because I am sad.' } },
      { id: 'neg-tsis-txhob', hmongRPA: 'tsis txhob', english: 'don\'t — a command or a warning. Always tsis txhob, never txhob tsis', category: 'negation', tags: ['negation', 'grammar'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob mus ze tus tsov ntawd.', english: 'Do not go near that tiger.' } },
      { id: 'neg-thov-tsis-txhob', hmongRPA: 'thov tsis txhob', english: 'please don\'t', category: 'negation', tags: ['negation', 'grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov tsis txhob chwv lub qhov txhab ntawd.', english: 'Please do not touch that wound.', source: 'ai' } },
      { id: 'neg-tsis-muaj', hmongRPA: 'tsis muaj', english: 'don\'t have; there isn\'t, there aren\'t', category: 'negation', tags: ['negation', 'grammar'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis muaj nyiaj.', english: 'I don\'t have money.' } },
      { id: 'neg-tsis-yog', hmongRPA: 'tsis yog', english: 'is not; no, that\'s not it', category: 'negation', tags: ['negation', 'grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tsis yog kuv tus kwv.', english: 'He is not my younger brother.', source: 'ai' } },
      { id: 'neg-tsis-tau', hmongRPA: 'tsis tau', english: 'not yet, didn\'t — before a verb; can\'t, unable — after a verb (nrhiav tsis tau, can\'t find)', category: 'negation', tags: ['negation', 'grammar'], audioFile: null, exampleSentence: { hmong: 'Kuv xav tiamsis tsis tau.', english: 'I want to, but I can’t.' } },
      { id: 'neg-tsis-paub', hmongRPA: 'tsis paub', english: 'don\'t know', category: 'negation', tags: ['negation', 'grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis paub lo lus ntawd.', english: 'I do not know that word.', source: 'ai' } },
      { id: 'neg-tsis-nyiam', hmongRPA: 'tsis nyiam', english: 'don\'t like', category: 'negation', tags: ['negation', 'grammar'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis nyiam tus twm vim nws ua rau kuv ntshai heev.', english: 'I don\'t like the ox because it makes me very scared.' } },
    ],
  },
  {
    // ── ANSWERING & AGREEING — 2026-09-27, path unit u-answers. The author: Hmong has no
    // literal word for "yes"; yog is used as yes, usually after a question; aws is the
    // conversational "yes" — affirmation, acknowledgement, agreement, permission. To answer
    // a question, the answer takes the place of the question word, in the question's own
    // word order. Q/A pairs are the author's; 'Aws, kuv nkag siab' is Claude's.
    id: 'answering',
    title: 'Answering & Agreeing',
    description: 'Aws, yog — and answering by putting the answer where the question word was.',
    emoji: '🙋',
    words: [
      // Rewritten 2026-09-30 at the author's request: concise and neutral. Was
      // 'yes, mm-hm, okay — agreeing, acknowledging, or allowing; the everyday
      // "yes", though not a literal one' — "mm-hm" reads as a transcription of
      // a sound rather than a definition, and the hedge at the end told a
      // learner what the word is NOT before telling them what it is.
      { id: 'ans-aws', hmongRPA: 'aws', english: 'yes; okay — used to agree or acknowledge', category: 'answering', tags: ['interjection', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Aws, kuv nkag siab.', english: 'Yes, I understand.' } },
      { id: 'ans-yog-yes', hmongRPA: 'yog', english: 'yes — that is so; usually as the answer to a question', category: 'answering', tags: ['answer', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas yog Mai? Yog.', english: 'Are you Mai? Yes.' } },
      // Added 2026-09-27 (author: yog questions with an expected yog answer). Claude's sentences, TODO-VERIFY.
      // Chai example: was 'Koj yog Chai, puas yog?' — a name takes hu ua (author, 2026-09-28).
      { id: 'ans-pattern-puas-yog', hmongRPA: 'puas yog …? → yog / tsis yog', english: 'a yog question is answered with yog — yog is yes, tsis yog is no', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog, kuv yog Hmoob.', english: 'Yes, I am Hmong.' }, examples: [{ hmong: 'Koj puas yog Mai? → Yog, kuv yog Mai.', english: 'Are you Mai? → Yes, I am Mai.' }, { hmong: 'Koj puas yog Hmoob? → Yog, kuv yog Hmoob.', english: 'Are you Hmong? → Yes, I am Hmong.' }, { hmong: 'Lub tsev no puas yog koj li? → Yog, lub tsev no yog kuv li.', english: 'Is this house yours? → Yes, this house is mine.' }, { hmong: 'Nws puas yog koj tus tij laug? → Tsis yog, nws yog kuv tus phooj ywg.', english: 'Is he your older brother? → No, he is my friend.' }, { hmong: 'Koj lub npe hu ua Chai, puas yog? → Yog.', english: 'Your name is Chai, right? → Yes.' }] },
      { id: 'ans-nkag-siab', hmongRPA: 'nkag siab', english: 'to understand', category: 'answering', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas nkag siab?', english: 'Do you understand?' } },
      { id: 'ans-pattern-fill', hmongRPA: 'the answer in the question word\'s place', english: 'answer in the question\'s own word order — the answer goes where the question word was', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub npe hu ua Chai.', english: 'My name is Chai.' }, examples: [{ hmong: 'Koj lub npe hu li cas? → Kuv lub npe hu ua Chai.', english: 'li cas → ua Chai' }, { hmong: 'Nws yog leej twg? → Nws yog kuv tus phooj ywg.', english: 'leej twg → kuv tus phooj ywg' }, { hmong: 'Koj ua dab tsi? → Kuv sau ntawv.', english: 'dab tsi → sau ntawv' }] },
      { id: 'ans-pattern-puas-yes', hmongRPA: 'puas + verb? → verb', english: 'yes — say the verb back, without puas', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nkag siab.', english: 'I understand.' }, examples: [{ hmong: 'Koj puas nkag siab? → Kuv nkag siab.', english: 'yes' }] },
      { id: 'ans-pattern-puas-no', hmongRPA: 'puas + verb? → tsis + verb', english: 'no — tsis takes the place of puas', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis nkag siab.', english: 'I don\'t understand.' }, examples: [{ hmong: 'Koj puas nkag siab? → Kuv tsis nkag siab.', english: 'no' }] },
      { id: 'ans-pattern-li-cas', hmongRPA: 'li cas? → how it is', english: 'answering li cas — say how, in its place', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv tsis nyob zoo.', english: 'They are not doing well.' }, examples: [{ hmong: 'Lawv nyob li cas? → Lawv tsis nyob zoo.', english: 'nyob li cas → tsis nyob zoo' }] },
      { id: 'ans-pattern-leej-twg', hmongRPA: 'leej twg? → the person', english: 'answering who — the person goes where leej twg was', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog kuv tus phooj ywg.', english: 'He is my friend.' } },
      { id: 'ans-pattern-dab-tsi', hmongRPA: 'dab tsi? → the thing', english: 'answering what — the thing or action goes where dab tsi was', category: 'answering', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sau ntawv.', english: 'I am writing.' } },
    ],
  },
  {
    // ── TAU PATTERNS — 2026-09-26, the author: "for the flashcards do noun + tau,
    // tau + noun, tau + verb, verb + tau, with the explanations … but reuse those
    // words you used in the reading and sentence builder". One card per PATTERN; the
    // back explains it with the same words the unit's examples use (tau noj / noj
    // tau, tau nyiaj…). These are path unit u-tau's flashcards and quiz.
    // ✅ SETTLED 2026-09-27 (GPT fact-check): there is no "noun + tau" rule to teach — a
    // noun before tau is read from the whole clause. The four patterns stay four.
    // Was: "noun + tau" is NOT here yet — asked the author what it should teach.
    // Tagged `construction`: the sentence builder never makes a chip of these.
    // ⚠️ ONE VERB, ONE NOUN — 2026-09-26 (author). Every card's example uses noj
    // (eat) and mov (food), so only tau's position changes card to card: tau noj ·
    // noj tau · tau mov · tau ib teev lawm · puas tau noj · tau noj lawm · tsis tau
    // noj · noj tsis tau. "In real words" leads with the noj form, then others.
    // ⚠️ CARD vs DICTIONARY — 2026-09-26 (author): the flashcard shows ONLY the
    // short meaning + ONE example sentence (exampleSentence, its usual spot). The
    // example WORDS live in `examples` and show only on the word page ("In real
    // words"). exampleSentence is also required: a path unit is only live when every
    // card has one (pathReadiness).
    id: 'tau-uses',
    title: 'Tau — Did, Got & Can',
    description: 'Where tau sits changes what it means: before the verb, after it, before a noun, with a timeframe.',
    emoji: '🔀',
    words: [
      { id: 'tau-pattern-tau-verb', hmongRPA: 'tau + verb', english: 'the action is attained or reached — it was achieved or came about; English often says it in the past: did, have done',  /* was 'the action is attained — it happened; in a past context, did, have done' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */ category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau noj mov.', english: 'I have eaten.' }, examples: [{ hmong: 'tau noj', english: 'ate, have eaten' }, { hmong: 'tau mus', english: 'went' }, { hmong: 'tau ntsib', english: 'got to meet' }] },
      { id: 'tau-pattern-verb-tau', hmongRPA: 'verb + tau', english: 'can, be able to — the action is possible or within someone’s ability; in context, was able to, managed to',  /* was 'can, be able to — in a past context, was able to; with some verbs, managed to' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */ category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj tau.', english: 'I can eat.' }, examples: [{ hmong: 'noj tau', english: 'can eat' }, { hmong: 'mus tau', english: 'can go' }, { hmong: 'ua tau', english: 'can do it' }, { hmong: 'kawm tau', english: 'can learn (only with context: managed to learn it)' }  /* was english: 'learned it (successfully): the accomplishment reading' — 2026-09-29 */] },
      // SUCCESS as its own card — 2026-09-29 (author: "verb + tau add one more flashcard for the successful
      // definition, we need to highlight this is extremely context based"). The example carries its context:
      // bare verb + tau reads as can. ⚠️ Claude's Hmong — TODO-VERIFY.
      { id: 'tau-pattern-verb-tau-success', hmongRPA: 'verb + tau (in context)', english: 'managed to — rare, needs context',  /* was 'managed to, succeeded in — ⚠ EXTREMELY context-based and rare: …' — shortened 2026-09-29 (author: succinct, fits the flashcard) */ category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj tau tag.', english: 'I managed to eat all of it.' } },  // Was: 'Naghmo, txawm nws nyuaj heev los kuv ua tau.' — noj, for consistency (author 2026-09-29)
      { id: 'tau-pattern-tau-noun', hmongRPA: 'tau + noun', english: 'got, received', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau mov noj.', english: 'I got food to eat.' }, examples: [{ hmong: 'tau mov', english: 'got food' }, { hmong: 'tau nyiaj', english: 'got money' }, { hmong: 'tau khoom plig', english: 'received a gift' }] },
      { id: 'tau-pattern-tau-time-lawm', hmongRPA: 'tau + timeframe + lawm', english: 'for a timeframe, up to now — the timeframe goes between tau and lawm', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov tau ib teev lawm.', english: 'I have been eating for an hour now.' }, examples: [{ hmong: 'tau ib teev lawm', english: 'for an hour now' }, { hmong: 'tau peb hnub lawm', english: 'for three days now' }, { hmong: 'tau ib hlis lawm', english: 'for a month now' }] },
      { id: 'tau-pattern-puas-tau-verb', hmongRPA: 'puas tau + verb', english: 'asks whether the verb has been completed — did you…? have you…yet?', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas tau noj mov?', english: 'Have you eaten yet?' }, examples: [{ hmong: 'puas tau noj', english: 'have you eaten yet?' }] },
      // Added 2026-09-26 (author: "make sure every tau is in"): tau … lawm, and the two
      // tsis tau patterns (Not & Don't teaches the word tsis tau; these teach where it
      // sits). "Can't" is verb + tsis tau (Kuv mus tsis tau) — confirmed by the author's GPT review.
      { id: 'tau-pattern-tau-verb-lawm', hmongRPA: 'tau + verb + lawm', english: 'done already — it happened, and it shows now', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau noj mov lawm.', english: 'I have already eaten.' }, examples: [{ hmong: 'tau noj lawm', english: 'have already eaten' }, { hmong: 'tau mus tsev lawm', english: 'has gone home already' }] },
      { id: 'tau-pattern-tsis-tau-verb', hmongRPA: 'tsis tau + verb', english: 'not yet, haven\'t, not completed — in a past context, didn\'t', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis tau noj mov.', english: 'I haven\'t eaten yet.' }, examples: [{ hmong: 'tsis tau noj', english: 'haven\'t eaten yet' }, { hmong: 'tsis tau los', english: 'hasn\'t come yet' }, { hmong: 'tsis tau mus', english: 'haven\'t gone yet' }] },
      { id: 'tau-pattern-verb-tsis-tau', hmongRPA: 'verb + tsis tau', english: 'can\'t, unable to — tsis tau after the verb says you are unable to do it; the object comes after', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj tsis tau.', english: 'I can\'t eat.' }, examples: [{ hmong: 'noj tsis tau', english: 'can\'t eat' }, { hmong: 'mus tsis tau', english: 'can\'t go' }, { hmong: 'nqa tsis tau', english: 'can\'t carry it' }, { hmong: 'nrhiav tsis tau lwm txoj kev', english: 'can\'t find another way' }] },  // verb + tsis tau is the standard "can't" (author's GPT review, 2026-09-26); briefly tsis + verb + tau the same day
      // Added 2026-09-26 (author: tsis tau "a distinct entity … additional flashcard"): the
      // short answer to a puas tau question. Appended, so nothing renumbers.
      { id: 'tau-pattern-tsis-tau-answer', hmongRPA: 'puas tau …? → tsis tau', english: 'not yet — tsis tau on its own is a reply, typically to a question asking whether something is completed', category: 'tau-uses', tags: ['grammar', 'tau', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas tau noj mov? Tsis tau.', english: 'Have you eaten yet? Not yet.' }, examples: [{ hmong: 'Tsis tau.', english: 'Not yet.' }, { hmong: 'Tau lawm.', english: 'Yes, already. (the other answer: tau + lawm)' }] },
    ],
  },
  {
    // ── TAU — added 2026-09-26 (author: "create a lesson dedicated for tau, then a
    // specific path, with flashcards and quiz … because tau is one of the most
    // common words"). Each card is a tau CONSTRUCTION, so the flashcards drill word
    // order: "tau noj" (ate) against "noj tau" (was able to eat). Rules and examples
    // are from the author's three pastes (notes/2026-09-26-tau-senses.md); glosses
    // are Claude's wording, so every card is tagged unreviewed. "nag hmos" is the
    // app's spelling (the paste wrote "nag hmo"). Grammar, so FREE. Backs path unit
    // u-tau and the lesson grammar-tau (src/data/lessons/tau.js).
    // ⚠️ RENAMED 2026-09-26 from `tau-uses` — the author: flashcards should be the
    // PATTERNS (tau + verb, verb + tau…), reusing these words. So these 14 are now
    // the unit's EXAMPLES: they feed its Reading step and sentence builder (path.js
    // `exampleSets`) and the dictionary, not its flashcards. Ids were tau-uses-*
    // (never shipped, so no saved progress was keyed on them).
    id: 'tau-examples',
    title: 'Tau — Examples',
    description: 'The tau patterns in real words: tau noj and noj tau, tau nyiaj, tau peb hnub lawm…',
    emoji: '🔁',
    words: [
      { id: 'tau-ex-tau-noj', hmongRPA: 'tau noj', english: 'ate, have eaten (tau before the verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau noj mov.', english: 'I have eaten.' } },
      { id: 'tau-ex-noj-tau', hmongRPA: 'noj tau', english: 'can eat, be able to eat; in context, managed to eat it (tau after the verb) — compare tau noj, ate',  /* was 'can eat; or, ate it successfully …' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */  /* was 'can eat, be able to eat (tau after the verb)' — author 2026-09-29 */ category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj tau.', english: 'I can eat.' } },
      { id: 'tau-ex-tau-mus', hmongRPA: 'tau mus', english: 'went, have gone (tau before the verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tau mus tsev.', english: 'He went home.' } },
      { id: 'tau-ex-mus-tau', hmongRPA: 'mus tau', english: 'can go, be able to go (tau after the verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tau.', english: 'I can go.' } },
      { id: 'tau-ex-ua-tau', hmongRPA: 'ua tau', english: 'can do it, be able to do it (tau after the verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ua tau.', english: 'I can do it.' } },
      { id: 'tau-ex-kawm-tau', hmongRPA: 'kawm tau', english: 'able to learn it; in context, learned it successfully (verb + tau)',  /* was 'learned it successfully (verb + tau: the result — the action completed)' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */  /* was 'learned it successfully (verb + tau: the accomplishment reading)' — reworded 2026-09-29 (author: "successful completion") */ category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tom qab kawm ib xyoo, nws kawm tau lus Hmoob.', english: 'After studying for a year, he managed to learn Hmong.' } },  // Was: { hmong: 'Nws kawm tau.', english: 'He learned it successfully.' } — bare, it reads "he can learn" (author 2026-09-29)
      { id: 'tau-ex-pom-tau', hmongRPA: 'pom tau', english: 'can see it, be able to see (tau after the verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom tau.', english: 'I can see it.' } },
      { id: 'tau-ex-tau-nyiaj', hmongRPA: 'tau nyiaj', english: 'got money, received money (tau before a noun)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau nyiaj.', english: 'I got money.' } },
      { id: 'tau-ex-tau-khoom-plig', hmongRPA: 'tau khoom plig', english: 'received a gift (tau before a noun)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tau khoom plig.', english: 'He received a gift.' } },
      { id: 'tau-ex-tau-haujlwm', hmongRPA: 'tau haujlwm', english: 'got a job (tau before a noun) — with the classifier: "tau ib txoj haujlwm"', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau ib txoj haujlwm.', english: 'I got a job.' } },
      { id: 'tau-ex-tau-ntsib', hmongRPA: 'tau ntsib', english: 'got to meet, had the chance to meet', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau ntsib nws naghmo.', english: 'I got to meet him yesterday.' } },
      { id: 'tau-ex-tau-peb-hnub-lawm', hmongRPA: 'tau peb hnub lawm', english: 'for three days now (tau + timeframe + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob ntawm no tau peb hnub lawm.', english: 'I have been here for three days.' } },
      { id: 'tau-ex-tau-ib-hlis-lawm', hmongRPA: 'tau ib hlis lawm', english: 'for a month now (tau + timeframe + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nyob ntawm no tau ib hlis lawm.', english: 'He has been living here for a month.' } },
      { id: 'tau-ex-puas-tau', hmongRPA: 'puas tau', english: 'asks whether the verb has been completed — did you…? have you…yet? (puas tau + verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas tau noj mov?', english: 'Have you eaten?' } },
      // Added 2026-09-26 — one example set per new pattern ("make sure every tau is in").
      // "Kuv tau mus tsev lawm" / "Kuv tsis tau noj mov" are the HIGH-confidence gs-038 /
      // gs-004; "Kuv kawm Hmoob tau peb xyoo lawm" is from the author's paste; "Kuv mus
      // tsis tau" is Claude's.
      { id: 'tau-ex-tau-peb-xyoos-lawm', hmongRPA: 'tau peb xyoo lawm', english: 'for three years now (tau + timeframe + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kawm Hmoob tau peb xyoo lawm.', english: 'I have studied Hmong for three years.' } },
      { id: 'tau-ex-tau-mus-tsev-lawm', hmongRPA: 'tau mus tsev lawm', english: 'has gone home already (tau + verb + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau mus tsev lawm.', english: 'I have gone home already.' } },
      { id: 'tau-ex-tsis-tau-noj', hmongRPA: 'tsis tau noj', english: 'haven\'t eaten yet (tsis tau + verb: not completed)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis tau noj mov.', english: 'I haven\'t eaten yet.' } },
      { id: 'tau-ex-mus-tsis-tau', hmongRPA: 'mus tsis tau', english: 'can\'t go, unable to go (verb + tsis tau)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tsis tau.', english: 'I can\'t go.' } },  // verb + tsis tau is the standard "can't" (author's GPT review, 2026-09-26); briefly tsis + verb + tau the same day
      // Added 2026-09-26 with the noj / mov rewrite of the pattern cards, so the reading
      // and the builder practise the same verb and noun the flashcards use. All four
      // sentences are Claude's — check them.
      { id: 'tau-ex-tau-mov-noj', hmongRPA: 'tau mov noj', english: 'got food to eat (tau + noun)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau mov noj.', english: 'I got food to eat.' } },
      { id: 'tau-ex-tau-ib-teev-lawm', hmongRPA: 'tau ib teev lawm', english: 'for an hour now (tau + timeframe + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov tau ib teev lawm.', english: 'I have been eating for an hour now.' } },
      { id: 'tau-ex-tau-noj-mov-lawm', hmongRPA: 'tau noj mov lawm', english: 'have already eaten (tau + verb + lawm)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau noj mov lawm.', english: 'I have already eaten.' } },
      { id: 'tau-ex-noj-tsis-tau', hmongRPA: 'noj tsis tau', english: 'can\'t eat, unable to eat (verb + tsis tau)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj tsis tau.', english: 'I can\'t eat.' } },  // verb + tsis tau is the standard "can't" (author's GPT review, 2026-09-26); briefly tsis + verb + tau the same day
      // Added 2026-09-26 — more tsis tau sentences ("keep it a distinct entity"). All three
      // are Claude's — check them.
      { id: 'tau-ex-tsis-tau-los', hmongRPA: 'tsis tau los', english: 'hasn\'t come yet (tsis tau + verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tsis tau los.', english: 'He hasn\'t come yet.' } },
      { id: 'tau-ex-tsis-tau-mus', hmongRPA: 'tsis tau mus', english: 'haven\'t gone yet (tsis tau + verb)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis tau mus.', english: 'I haven\'t gone yet.' } },
      { id: 'tau-ex-nqa-tsis-tau', hmongRPA: 'nqa tsis tau', english: 'can\'t carry it, unable to carry it (verb + tsis tau)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nqa tsis tau.', english: 'I can\'t carry it.' } },  // verb + tsis tau is the standard "can't" (author's GPT review, 2026-09-26); briefly tsis + verb + tau the same day
      // The object comes AFTER tsis tau — from the author's GPT review, 2026-09-26.
      { id: 'tau-ex-nrhiav-tsis-tau', hmongRPA: 'nrhiav tsis tau', english: 'can\'t find, unable to find (verb + tsis tau + object)', category: 'tau-examples', tags: ['grammar', 'tau', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nrhiav tsis tau lwm txoj kev.', english: 'I can\'t find another way.' } },
    ],
  },
  {
    // ── WILLING, PERMISSION & PROMISES — added 2026-09-26 from a batch the author
    // pasted (_incoming/vocab-batch-2026-09-26-will.json: 20 rows).
    //   · 9 rows already existed (kam, txaus, zoo siab, ceeb toom, lees, txwv, yuam,
    //     zam txim, haub) — NOT duplicated; an example was attached only where the
    //     existing entry had none.
    //   · 'ntxim siab' (glossed 'decide') was imported AS 'txiav txim siab' — its own
    //     example uses that phrase. 'ntxim siab' itself is held for the author.
    //   · 'faj seeb' is HELD — not in the dictionary; 'be careful' is 'ceev faj' here.
    //   · khib's example fixed: 'Txhob khib…' → 'Tsis txhob khib…' (always tsis txhob).
    // ⚠️ The batch reads as model output: every gloss is 'unreviewed' and every
    // example source: 'ai' until a native speaker checks it (the author's plan).
    // Vocabulary, not grammar → a Pro topic set (vocabAccess.js).
    id: 'will-permission',
    title: 'Willing, Permission & Promises',
    description: 'Wanting, agreeing, allowing, forbidding, promising — the verbs of choice.',
    emoji: '🤝',
    words: [
      { id: 'will-yeem', hmongRPA: 'yeem', english: 'willing; voluntary; consent — Agreeing freely or acting by choice', category: 'will-permission', tags: ['adjective', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yeem pab.', english: 'I am willing to help.', source: 'ai' } },
      { id: 'will-ntshaw', hmongRPA: 'ntshaw', english: 'long for; yearn for; strongly desire — Stronger and more emotional than xav (\'want\')', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntshaw mus tsev.', english: 'I long to go home.', source: 'ai' } },
      { id: 'will-cog-lus', hmongRPA: 'cog lus', english: 'promise; make a commitment — Literally \'hold/grasp words\'; used for promises', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws cog lus tias nws yuav los.', english: 'He/she promised that they would come.', source: 'ai' } },
      { id: 'will-tso-cai', hmongRPA: 'tso cai', english: 'permit; authorize; give permission — Used for permission, rights, or official approval', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv tso cai rau kuv mus.', english: 'They gave me permission to go.', source: 'ai' } },
      { id: 'will-ntxias', hmongRPA: 'ntxias', english: 'persuade; coax; entice — Can be neutral, affectionate, or manipulative depending on context', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws ntxias kuv mus.', english: 'He/she persuaded me to go.', source: 'ai' } },
      { id: 'will-txiav-txim-siab', hmongRPA: 'txiav txim siab', english: 'decide; make up one\'s mind — Often used for a firm or consequential decision', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiav txim siab mus.', english: 'I decided to go.', source: 'ai' } },
      { id: 'will-khwv', hmongRPA: 'khwv', english: 'work hard; labor; earn a living — More than simply \'do work\'; often suggests sustained effort', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws khwv nyiaj txhua hnub.', english: 'He/she works to earn money every day.', source: 'ai' } },
      { id: 'will-kub-siab', hmongRPA: 'kub siab', english: 'be enthusiastic; determined; eager — Literally \'hot heart\'; strong motivation or effort', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws kub siab kawm.', english: 'He/she is eager to study.', source: 'ai' } },
      { id: 'will-tiv-taus', hmongRPA: 'tiv taus', english: 'withstand; endure; tolerate — Ability to bear pain, stress, weather, or pressure', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tiv tsis taus lawm.', english: 'I cannot endure it anymore.', source: 'ai' } },
      { id: 'will-khib', hmongRPA: 'khib', english: 'be jealous; envy — Can describe envy or possessive jealousy', category: 'will-permission', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob khib lwm tus.', english: 'Do not envy others.', source: 'ai' } },
    ],
  },

  // Places

  {
    id: 'places',
    title: 'Places',
    description: 'Cities, states, and geographic locations.',
    emoji: '🏙️',
    words: [
      {
        id: 'places-city',
        hmongRPA: 'lub nroog',
        english: 'city',
        category: 'places',
        tags: ['noun', 'location', 'urban'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyob lub nroog.', english: 'I live in the city.' },
      },
      {
        id: 'places-state',
        hmongRPA: 'lub xeev',
        english: 'state',
        category: 'places',
        tags: ['noun', 'location', 'political'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub xeev no loj.', english: 'This state is big.' },
      },
      // ── Split out of `buildings-places` on 2026-09-20 ──
      { id: 'bld-teb', hmongRPA: 'teb', english: 'farm; field', category: 'places', tags: ['noun','agriculture','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv mus ua teb txhua hnub.', english: 'My father farms every day.', source: 'ai' } },
      { id: 'bld-daim-teb', hmongRPA: 'daim teb', english: 'a field — with "daim", the classifier for flat things', category: 'places', tags: ['noun','agriculture','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pog muaj ib daim teb loj.', english: 'My grandmother has a large field.', source: 'ai' } },
      { id: 'bld-tuam-txhab-nyiaj', hmongRPA: 'tuam txhab nyiaj', english: 'bank; financial institution', category: 'places', tags: ['noun','business','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus tuam txhab nyiaj qhib ib lub txhab nyiaj.', english: 'I go to the bank to open an account.', source: 'ai' } },
      { id: 'bld-tsev-kaw-neeg', hmongRPA: 'tsev kaw neeg', english: 'prison; jail', category: 'places', tags: ['noun','law','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus neeg ntawd raug kaw hauv tsev kaw neeg.', english: 'That person is locked up in prison.', source: 'ai' } },
      { id: 'bld-nkuaj', hmongRPA: 'nkuaj', english: 'jail', category: 'places', tags: ['noun','law','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tub ceev xwm coj nws mus nkuaj.', english: 'The police took him to jail.', source: 'ai' } },
      { id: 'bld-qhov-taub-me', hmongRPA: 'qhov taub me', english: 'small jail; local jail', category: 'places', tags: ['noun','law','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib qhov taub me nyob ze lub zos.', english: 'There is a small local jail near the village.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'phr-chaw-nres-tsheb', hmongRPA: 'chaw nres tsheb', english: 'a parking place, a car park', category: 'places', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nrhiav chaw nres tsheb ze khw.', english: 'I look for a parking spot near the store.', source: 'ai' } },
      { id: 'misc-choj', hmongRPA: 'choj', english: 'bridge (noun)', category: 'places', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Peb hla tus choj thaum sawv ntxov.', english: 'We cross the bridge in the morning.', source: 'ai' } },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    description: 'Words for homes, moving, and real estate.',
    emoji: '🏠',
    words: [
      {
        id: 'housing-move',
        hmongRPA: 'tsiv',
        english: 'to move (relocate)',
        category: 'housing',
        tags: ['verb', 'relocation'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yuav tsiv tsev.', english: 'I will move house.' },
      },
      {
        id: 'housing-look-for',
        hmongRPA: 'nrhiav',
        english: 'to look for / search',
        category: 'housing',
        tags: ['verb'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nrhiav tsev xuaj.', english: 'I look for a rental.' },
      },
      {
        id: 'housing-rental',
        hmongRPA: 'tsev xuaj',
        english: 'rental (house)',
        category: 'housing',
        tags: ['noun', 'housing'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyob tsev xuaj.', english: 'I live in a rental.' },
      },
      // TODO: verify 'tsev yuav' as 'mortgaged' — may mean 'house for sale' or 'house to buy'
      {
        id: 'housing-mortgaged',
        hmongRPA: 'tsev yuav',
        english: 'mortgaged house',
        category: 'housing',
        tags: ['noun', 'housing'],
        audioFile: null,
        exampleSentence: { hmong: 'Lawv yuav ib lub tsev yuav tshiab.', english: 'They bought a house with a mortgage.', source: 'ai' },
      },
    ],
  },
  {
    id: 'grammar',
    title: 'Grammar',
    description: 'Common adverbs and aspect markers.',
    emoji: '📝',
    words: [
      {
        // ⚠️ ADDED 2026-09-12 from the Thanks & Sorry lesson. `tsis` is the
        // general negator and already appears INSIDE entries elsewhere —
        // "tsis yog" (yog-to-be) and "tsis ua li cas" (politeness) — but had no
        // entry of its own, so the sentence builder was splitting those into
        // chips it could not label.
        id: 'grammar-not',
        hmongRPA: 'tsis',
        english: 'not; do not; does not',
        senses: [{ en: 'not; do not; does not', context: 'grammar' }, { en: 'not any; no — in "tsis muaj" and similar', context: 'reading' }],
        category: 'grammar',
        tags: ['adverb', 'negation'],
        audioFile: 'lessons/politeness/tsis.wav',
        exampleSentence: { hmong: 'Kuv tsis paub lo lus ntawd.', english: 'I do not know that word.', source: 'ai' },
      },
      {
        // ⚠️ FOLLOWS what it intensifies: "zoo heev" = very good, not "heev
        // zoo". Compare `ntau` in quantifiers, which is about amount — heev is
        // about degree.
        id: 'grammar-very',
        hmongRPA: 'heev',
        english: 'very (intensifier)',
        category: 'grammar',
        tags: ['adverb', 'degree'],
        audioFile: 'lessons/politeness/heev.wav',
        exampleSentence: { hmong: 'Hnub no kub heev.', english: 'It is very hot today.', source: 'ai' },
      },
      {
        id: 'grammar-still',
        hmongRPA: 'tseem',
        english: 'still — the action has not stopped yet',  // was 'still, currently' (currently is tab tom's job), 2026-09-26
        category: 'grammar',
        tags: ['adverb', 'aspect'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tseem nrhiav.', english: 'I am still looking.' },
      },
      {
        id: 'grammar-already',
        hmongRPA: 'twb ... lawm',
        // Was: english: '(aspect marker: have already)' — reworded 2026-09-26.
        english: 'already — twb before the verb, lawm at the end',
        category: 'grammar',
        tags: ['particle', 'aspect', 'grammar'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv twb mus lawm.', english: 'I have already gone.' },
      },
    ],
  },

  {
    id: 'months',
    title: 'Months',
    description: 'Months of the year in Hmong.',
    emoji: '📅',
    words: [
      {
        id: 'months-january',
        hmongRPA: 'lub ib hlis ntuj',
        english: 'January',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub ib hlis ntuj no txias heev.', english: 'This January is very cold.', source: 'ai' },
      },
      {
        id: 'months-february',
        hmongRPA: 'lub ob hlis ntuj',
        english: 'February',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub ob hlis ntuj kuv mus ncig.', english: 'I travel in February.', source: 'ai' },
      },
      {
        id: 'months-march',
        hmongRPA: 'lub peb hlis ntuj',
        english: 'March',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub peb hlis ntuj huab cua sov dua.', english: 'The weather gets warmer in March.', source: 'ai' },
      },
      {
        id: 'months-april',
        hmongRPA: 'lub plaub hlis ntuj',
        english: 'April',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub plaub hlis ntuj muaj nag ntau.', english: 'There is a lot of rain in April.', source: 'ai' },
      },
      {
        id: 'months-may',
        hmongRPA: 'lub tsib hlis ntuj',
        english: 'May',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub tsib hlis ntuj kuv cog zaub.', english: 'I plant vegetables in May.', source: 'ai' },
      },
      {
        id: 'months-june',
        hmongRPA: 'lub rau hlis ntuj',
        english: 'June',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub rau hlis ntuj hnub ntev heev.', english: 'The days are very long in June.', source: 'ai' },
      },
      {
        id: 'months-july',
        hmongRPA: 'lub xya hlis ntuj',
        english: 'July',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Lub xya hlis ntuj peb mus xyuas tsev neeg.', english: 'We visit family in July.', source: 'ai' },
      },
      {
        id: 'months-august',
        hmongRPA: 'lub yim hlis ntuj',
        english: 'August',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv yug rau lub yim hlis ntuj.', english: 'I was born in August.', source: 'ai' },
      },
      {
        id: 'months-september',
        hmongRPA: 'lub cuaj hlis ntuj',
        english: 'September',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Cov menyuam pib kawm ntawv lub cuaj hlis ntuj.', english: 'The children start school in September.', source: 'ai' },
      },
      {
        id: 'months-october',
        hmongRPA: 'lub kaum hlis ntuj',
        english: 'October',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Huab cua txias thaum lub kaum hlis ntuj.', english: 'The weather gets cold in October.', source: 'ai' },
      },
      {
        id: 'months-november',
        hmongRPA: 'lub kaum ib hlis ntuj',
        english: 'November',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb yuav mus xyuas pog lub kaum ib hlis ntuj.', english: 'We will visit Grandma in November.', source: 'ai' },
      },
      {
        id: 'months-december',
        hmongRPA: 'lub kaum ob hlis ntuj',
        english: 'December',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb tsev neeg sib sau ua ke lub kaum ob hlis ntuj.', english: 'Our family gathers together in December.', source: 'ai' },
      },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'phr-cuaj-hlis', hmongRPA: 'Cuaj Hlis', english: 'September, short form of "lub cuaj hlis ntuj"', category: 'months', tags: ['time', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pib kawm ntawv thaum Cuaj Hlis.', english: 'I start school in September.', source: 'ai' } },
      { id: 'phr-peb-hlis', hmongRPA: 'Peb Hlis', english: 'March, short form of "lub peb hlis ntuj"', category: 'months', tags: ['time', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Huab cua sov dua thaum Peb Hlis.', english: 'The weather gets warmer in March.', source: 'ai' } },
    ],
  },
  {
    id: 'days-of-week',
    title: 'Days of the Week',
    description: 'Days of the week in Hmong.',
    emoji: '📆',
    words: [
      {
        id: 'days-of-week-monday',
        hmongRPA: 'hnub ib',
        english: 'Monday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub no yog hnub ib.', english: 'Today is Monday.' },
      },
      {
        id: 'days-of-week-tuesday',
        hmongRPA: 'hnub ob',
        english: 'Tuesday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub ob kuv mus ua haujlwm.', english: 'On Tuesday I go to work.', source: 'ai' },
      },
      {
        id: 'days-of-week-wednesday',
        hmongRPA: 'hnub peb',
        english: 'Wednesday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub peb kuv kawm lus Hmoob.', english: 'On Wednesday I study Hmong.', source: 'ai' },
      },
      {
        id: 'days-of-week-thursday',
        hmongRPA: 'hnub plaub',
        english: 'Thursday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub plaub kuv nyob tsev.', english: 'On Thursday I stay home.', source: 'ai' },
      },
      {
        id: 'days-of-week-friday',
        hmongRPA: 'hnub tsib',
        english: 'Friday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub tsib peb mus noj mov.', english: 'On Friday we go out to eat.', source: 'ai' },
      },
      {
        id: 'days-of-week-saturday',
        hmongRPA: 'hnub rau',
        english: 'Saturday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub rau kuv ntxuav tsev.', english: 'On Saturday I clean the house.', source: 'ai' },
      },
      {
        id: 'days-of-week-sunday',
        hmongRPA: 'hnub xya',
        english: 'Sunday',
        category: 'days-of-week',
        tags: ['noun', 'time', 'day-of-week'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub xya peb mus tsev teev ntuj.', english: 'On Sunday we go to church.', source: 'ai' },
      },
    ],
  },
  {
    id: 'calendar',
    title: 'Calendar Terms',
    description: 'Basic calendar and date vocabulary.',
    emoji: '🗓️',
    words: [
      {
        id: 'calendar-date',
        hmongRPA: 'hnub tim',
        english: 'date',
        category: 'calendar',
        tags: ['noun', 'time', 'calendar'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub tim twg yog koj hnub yug?', english: 'What date is your birthday?', source: 'ai' },
      },
      {
        id: 'calendar-day',
        hmongRPA: 'hnub',
        english: 'day',
        category: 'calendar',
        tags: ['noun', 'time', 'calendar'],
        audioFile: null,
        exampleSentence: { hmong: 'Hnub no huab cua zoo heev.', english: 'The weather is very nice today.', source: 'ai' },
      },
      {
        id: 'calendar-year',
        hmongRPA: 'xyoo',
        english: 'year',
        senses: [{ en: 'year', context: 'time' }, { en: 'years old — after a number', context: 'reading' }],
        category: 'calendar',
        tags: ['noun', 'time', 'calendar'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv kawm lus Hmoob tau ob xyoo.', english: 'I have studied Hmong for two years.', source: 'ai' },
      },
    ],
  },
  {
    // ── WRITING DATES — 2026-09-27, path unit u-dates. The author: hnub tim (date), hnub
    // (day) and xyoo (year) are the "classifiers" for dates; Western order (month, day,
    // year) is the focus, Asian order (day first) is also acceptable. Dates other than the
    // author's "Jan 2 2026" are Claude's, built on the same pattern.
    id: 'dates',
    title: 'Writing Dates',
    description: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau — month, day, year.',
    emoji: '📅',
    words: [
      { id: 'date-pattern-hnub-tim', hmongRPA: 'hnub tim + number', english: 'the day of the month — hnub tim ob, the 2nd', category: 'dates', tags: ['time', 'date', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no yog hnub tim ob.', english: 'Today is the 2nd.' } },
      { id: 'date-pattern-xyoo', hmongRPA: 'xyoo + number', english: 'the year — xyoo comes first', category: 'dates', tags: ['time', 'date', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xyoo ob txhiab neesnkaum rau.', english: 'The year 2026.' } },
      { id: 'date-pattern-western', hmongRPA: 'month + hnub tim + xyoo', english: 'a full date, Western order — month, day, year', category: 'dates', tags: ['time', 'date', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ib hlis ntuj hnub tim ob, xyoo ob txhiab neesnkaum rau.', english: 'January 2, 2026.' }, examples: [{ hmong: 'lub ib hlis ntuj hnub tim ob', english: 'January 2' }, { hmong: 'lub xya hlis ntuj hnub tim plaub', english: 'July 4' }, { hmong: 'lub kaum ob hlis ntuj hnub tim neesnkaum tsib', english: 'December 25' }] },
      { id: 'date-pattern-asian', hmongRPA: 'hnub tim + month + xyoo', english: 'a full date, Asian order — day first; also correct', category: 'dates', tags: ['time', 'date', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub tim ob, lub ib hlis ntuj, xyoo ob txhiab neesnkaum rau.', english: '2 January 2026.' } },
      { id: 'date-question', hmongRPA: 'hnub tim pes tsawg?', english: 'what date? — pes tsawg where the number goes', category: 'dates', tags: ['question', 'date', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no yog hnub tim pes tsawg?', english: 'What is the date today?' } },
      { id: 'date-hnub-yug', hmongRPA: 'hnub yug', english: 'a birthday — literally "birth day"', category: 'dates', tags: ['noun', 'date', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hnub yug yog lub peb hlis ntuj hnub tim kaum tsib.', english: 'My birthday is March 15.' } },
      { id: 'date-today-is', hmongRPA: 'hnub no yog …', english: 'today is … — for the date or the day', category: 'dates', tags: ['phrase', 'date', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no yog lub tsib hlis ntuj hnub tim kaum.', english: 'Today is May 10.' } },
    ],
  },

  // HIgh frequency Verbs

  {
    id: 'verbs',
    title: 'High-Frequency Verbs',
    description: 'Common action and perception verbs for everyday conversation.',
    emoji: '💬',
    words: [
      {
        // ⚠️ ADDED 2026-09-12, AND IT CAME FROM A MIS-TAKE. This clip was
        // recorded for the Thanks & Sorry lesson's "Kuv txaus siab heev",
        // where the take said `txuas` (to connect) rather than `txaus`
        // (enough / satisfied) — one vowel apart, unrelated meanings. The
        // phrase was re-recorded correctly and the bad takes were left out of
        // the bundle. This word, though, is real and correctly said, so it is
        // kept here where the reader's long-press lookup and search can reach
        // it instead of being thrown away.
        //
        // ⚠️ NO exampleSentence ON PURPOSE — one has not been written by anyone
        // who speaks Hmong, and inventing one is how wrong prose gets into a
        // language app. Add it when the next batch is reviewed.
        //
        // ⚠️ .wav, not .mp3 — see the note in src/data/speakLessons.js.
        id: 'verbs-connect',
        hmongRPA: 'txuas',
        english: 'to connect, join, attach',
        category: 'verbs',
        tags: ['verb', 'action'],
        audioFile: 'vocabulary/verbs/txuas.wav',
        exampleSentence: { hmong: 'Kuv txuas ob txoj hlua.', english: 'I connect the two ropes.', source: 'ai' },
      },
      // ⚠️ ADDED 2026-09-12 — the component words from the Speak lessons.
      // They were taught and recorded but had no dictionary entry, so the
      // reader's long-press lookup missed them and they could not be drilled or
      // quizzed. Same gap, same fix as the action-verbs batch above (notes/56).
      // Glosses are the lesson's own text; no exampleSentence, because writing
      // one means authoring Hmong nobody fluent has checked.
      {
        id: 'verbs-meet',
        hmongRPA: 'ntsib',
        english: 'meet; encounter',
        senses: [{ en: 'meet; encounter', context: 'verbs' }, { en: 'face; confront', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'social', 'reviewed'],
        audioFile: 'lessons/greetings/ntsib.wav',
        exampleSentence: { hmong: 'Peb ntsib nws hnub no.', english: 'We meet him/her today.', source: 'ai' },
      },
      {
        id: 'verbs-check-on',
        hmongRPA: 'xyuas',
        english: 'to check on, to look after',
        category: 'verbs',
        tags: ['verb', 'care'],
        audioFile: 'lessons/farewells/xyuas.wav',
        // ⚠️ CONFIRM THE GLOSS — written from the lesson, not from a fluent
        // listener. It is the second half of "saib xyuas" (take care) and is
        // rarely said alone.
        exampleSentence: { hmong: 'Kuv mus xyuas kuv pog.', english: 'I go check on my grandmother.', source: 'ai' },
      },
      {
        id: 'verbs-have',
        hmongRPA: 'muaj',
        english: 'have; possess',
        senses: [{ en: 'have; possess', context: 'verbs' }, { en: 'there is; there are', context: 'reading' }, { en: 'have the opportunity, right or ability to — "muaj cai", to have the right', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'existence'],
        audioFile: 'lessons/politeness/muaj.wav',
        exampleSentence: { hmong: 'Kuv tsis muaj koj cov khoom.', english: "I don't have your things.", source: 'ai' },
      },
      {
        id: 'verbs-read',
        hmongRPA: 'nyeem',
        english: 'to read',
        category: 'verbs',
        tags: ['verb', 'literacy', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-nyeem.mp3',
        exampleSentence: { hmong: 'Kuv nyeem ntawv.', english: 'I read.' },
      },
      {
        id: 'verbs-write',
        hmongRPA: 'sau',
        english: 'to write',
        category: 'verbs',
        tags: ['verb', 'literacy', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-sau.mp3',
        exampleSentence: { hmong: 'Kuv sau ntawv.', english: 'I write.' },
      },
      {
        id: 'verbs-learn',
        hmongRPA: 'kawm',
        english: 'to learn, study, practice',
        category: 'verbs',
        tags: ['verb', 'education'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-kawm.mp3',
        exampleSentence: { hmong: 'Kuv kawm lus Hmoob.', english: 'I study Hmong.' },
      },
      {
        id: 'verbs-say',
        hmongRPA: 'hais',
        english: 'say; speak; tell',
        senses: [{ en: 'say; speak; tell', context: 'verbs' }, { en: 'state; explain; report', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-hais.mp3',
        exampleSentence: { hmong: 'Kuv hais lus.', english: 'I speak.' },
      },
      {
        id: 'verbs-tell',
        hmongRPA: 'qhia',
        english: 'tell; inform',
        senses: [{ en: 'tell; inform', context: 'verbs' }, { en: 'teach', context: 'reading' }, { en: 'show; point out', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'communication', 'education'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-qhia.mp3',
        exampleSentence: { hmong: 'Koj qhia kuv.', english: 'You teach me.' },
      },
      {
        id: 'verbs-ask',
        hmongRPA: 'nug',
        english: 'to ask',
        category: 'verbs',
        tags: ['verb', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-nug.mp3',
        exampleSentence: { hmong: 'Kuv nug koj.', english: 'I ask you.' },
      },
      {
        id: 'verbs-answer',
        hmongRPA: 'teb',
        english: 'answer; reply',
        senses: [{ en: 'answer; reply', context: 'verbs' }, { en: 'respond; react', context: 'reading' }, { en: 'land; country, as in Teb Chaws Asmeskas', context: 'places' }],
        category: 'verbs',
        tags: ['verb', 'communication', 'reviewed'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-teb.mp3',
        exampleSentence: { hmong: 'Kuv teb nws.', english: 'I answer her.' },
      },
      {
        id: 'verbs-explain',
        hmongRPA: 'piav',
        english: 'explain',
        senses: [{ en: 'explain', context: 'verbs' }, { en: 'describe; narrate', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-piav.mp3',
        exampleSentence: { hmong: 'Kuv piav dab neeg.', english: 'I tell a story.' },
      },
      {
      // The extra senses of `zaum` used to sit here. Moved into `misc` on
      // 2026-09-15: a deck is built from its array, so parking them here put
      // "perhaps, maybe" on a VERBS card. wordLookup merges on hmongRPA across
      // every category, so position never mattered to the merge.
        id: 'verbs-sit',
        hmongRPA: 'zaum',
        english: 'to sit',
        category: 'verbs',
        tags: ['verb', 'posture', 'motion'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-zaum.mp3',
        exampleSentence: { hmong: 'Kuv zaum no.', english: 'I sit here.' },
      },
      // ── SECOND AND THIRD SENSES OF `zaum` ────────────────────────────────
      // Same hmongRPA as verbs-sit above, so wordLookup MERGES these onto that
      // headword rather than creating rivals. verbs-sit keeps identity: the id
      // the notebook saves, the audio file, the example.
      {
        id: 'verbs-stand',
        hmongRPA: 'sawv',
        english: 'stand',
        senses: [{ en: 'stand', context: 'verbs' }, { en: 'get up; rise', context: 'reading' }, { en: 'wake up', context: 'reading' }, { en: 'arise; rise, including the sun rising', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'posture', 'motion', 'reviewed'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-sawv.mp3',
        exampleSentence: { hmong: 'Kuv sawv lawm.', english: 'I got up.' },
      },
      {
        id: 'verbs-open',
        hmongRPA: 'qhib',
        english: 'to open',
        category: 'verbs',
        tags: ['verb', 'motion', 'action'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-qhib.mp3',
        exampleSentence: { hmong: 'Qhib lub rooj.', english: 'Open the door.' },
      },
      {
        id: 'verbs-close',
        hmongRPA: 'kaw',
        english: 'close; shut',
        senses: [{ en: 'close; shut', context: 'verbs' }, { en: 'closed; not open', context: 'reading' }, { en: 'confine; imprison', context: 'reading' }, { en: 'raug kaw = be imprisoned', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'motion', 'action', 'reviewed'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-kaw.mp3',
        exampleSentence: { hmong: 'Kaw lub rooj.', english: 'Close the door.' },
      },
      {
        id: 'verbs-flip',
        hmongRPA: 'nthuav',
        english: 'to flip a page, unfold',
        category: 'verbs',
        tags: ['verb', 'motion', 'action'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-nthuav.mp3',
        exampleSentence: { hmong: 'Nthuav nplooj ntawv.', english: 'Flip the page.' },
      },
      {
        id: 'verbs-go',
        hmongRPA: 'mus',
        english: 'go',
        senses: [{ en: 'go', context: 'verbs' }, { en: 'leave; depart', context: 'reading' }, { en: 'go on; proceed — in serial-verb and directional use', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'motion'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-mus.mp3',
        exampleSentence: { hmong: 'Kuv mus tsev.', english: 'I go home.' },
      },
      {
        id: 'verbs-talk',
        hmongRPA: 'tham',
        english: 'to talk',
        category: 'verbs',
        tags: ['verb', 'communication'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-tham.mp3',
        exampleSentence: { hmong: 'Kuv tham nrog koj.', english: 'I talk with you.' },
      },
      {
        id: 'verbs-let',
        hmongRPA: 'cia',
        english: 'to let, allow',
        category: 'verbs',
        tags: ['verb', 'auxiliary'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-cia.mp3',
        exampleSentence: { hmong: 'Kuv cia nws.', english: 'I let him.' },
      },
      {
        id: 'verbs-release',
        hmongRPA: 'tso',
        english: 'release; let go',
        senses: [{ en: 'put; place; set down', context: 'reading' }, { en: 'let; allow', context: 'reading' }, { en: 'release; let go', context: 'verbs' }, { en: 'leave behind; abandon', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'motion', 'action'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-tso.mp3',
        exampleSentence: { hmong: 'Kuv tso nws.', english: 'I release it.' },
      },
      {
        id: 'verbs-see',
        hmongRPA: 'pom',
        english: 'see',
        senses: [{ en: 'see', context: 'verbs' }, { en: 'find; discover', context: 'reading' }, { en: 'consider; regard; judge — "pom tias", to think that', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'perception'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-pom.mp3',
        exampleSentence: { hmong: 'Kuv pom koj.', english: 'I see you.' },
      },
      {
        id: 'verbs-look',
        hmongRPA: 'ntsia',
        english: 'to look at',
        category: 'verbs',
        tags: ['verb', 'perception'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-ntsia.mp3',
        exampleSentence: { hmong: 'Kuv ntsia nws.', english: 'I look at him.' },
      },
      {
        id: 'verbs-watch',
        hmongRPA: 'saib',
        english: 'look at; watch',
        senses: [{ en: 'look at; watch', context: 'verbs' }, { en: 'examine; inspect', context: 'reading' }, { en: 'care for; look after', context: 'reading' }, { en: 'consider; regard', context: 'reading' }],
        category: 'verbs',
        tags: ['verb', 'perception', 'reviewed'],
        audioFile: 'grammar/action-verbs/hmong-action-verbs-saib.mp3',
        exampleSentence: { hmong: 'Kuv saib nws.', english: 'I watch it.' },
      },
      // Taught in the action-verbs lesson but previously absent here, so they
      // could not be drilled or quizzed (notes/56). Glosses and example
      // sentences are the lesson's own text, not newly authored.
      { id: 'verbs-eat', hmongRPA: 'noj', english: 'to eat', category: 'verbs', tags: ['verb'], audioFile: 'grammar/action-verbs/hmong-action-verbs-noj.mp3', exampleSentence: { hmong: 'Noj mov.', english: 'Eat rice / have a meal.' } },
      { id: 'verbs-drink', hmongRPA: 'haus', english: 'to drink', category: 'verbs', tags: ['verb'], audioFile: 'grammar/action-verbs/hmong-action-verbs-haus.mp3', exampleSentence: { hmong: 'Haus dej.', english: 'Drink water.' } },
      { id: 'verbs-come', hmongRPA: 'los', english: 'come', senses: [{ en: 'come', context: 'verbs' }, { en: 'also; even; too — in certain patterns', context: 'grammar' }], category: 'verbs', tags: ['verb', 'motion', 'reviewed'], audioFile: 'grammar/action-verbs/hmong-action-verbs-los.mp3', exampleSentence: { hmong: 'Thaum nws los, kuv mus.', english: 'When he/she comes, I go.', source: 'ai' } },
      { id: 'verbs-make', hmongRPA: 'ua', english: 'do; make', senses: [{ en: 'do; make', context: 'verbs' }, { en: 'become; act as; serve as', context: 'reading' }, { en: 'cause; make happen — "ua rau", to cause', context: 'reading' }], category: 'verbs', tags: ['verb', 'reviewed'], audioFile: 'grammar/action-verbs/hmong-action-verbs-ua.mp3', exampleSentence: { hmong: 'Ua tsaug.', english: 'Thank you (literally "do thanks").' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'verbs-like', hmongRPA: 'nyiam', english: 'to like; to love', category: 'verbs', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Mai teb kuv tias, “Yog, kuv nyiam nws.”', english: 'Mai answered me, “Yes, I like it.”' } },
      // ── VERB + ITS EVERYDAY NOUN — 2026-09-27 (author: action verbs "are almost always
      // accompanied with given nouns"; together they name the activity — taug kev is
      // literally walking). The ones not yet in the dictionary; kawm ntawv and taug kev
      // already were. Tagged construction so the sentence builder keeps two chips.
      // Added 2026-09-28 (author: add "vam", hope). Also numbers-vam (ten thousand) — the dictionary
      // lists both as numbered meanings. Example is Claude's, TODO-VERIFY.
      { id: 'verbs-vam', hmongRPA: 'vam', english: 'to hope — vam tias, to hope that', category: 'verbs', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv vam tias nws yuav tuaj.', english: 'I hope he will come.', source: 'ai' } },
      { id: 'verbs-noj-mov', hmongRPA: 'noj mov', english: 'to eat, to have a meal (noj = eat + mov = food)', category: 'verbs', tags: ['verb', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov.', english: 'I eat. / I am having a meal.' } },
      { id: 'verbs-nyeem-ntawv', hmongRPA: 'nyeem ntawv', english: 'to read (nyeem = read + ntawv = writing)', category: 'verbs', tags: ['verb', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyeem ntawv.', english: 'I read.' } },
      { id: 'verbs-sau-ntawv', hmongRPA: 'sau ntawv', english: 'to write (sau = write + ntawv = writing)', category: 'verbs', tags: ['verb', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sau ntawv.', english: 'I write.' } },
      { id: 'verbs-mloog-lus', hmongRPA: 'mloog lus', english: 'to listen; to do as you are told (mloog = listen + lus = words)', category: 'verbs', tags: ['verb', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mloog lus.', english: 'I listen. / I do as I am told.' } },
      { id: 'verbs-hais-lus', hmongRPA: 'hais lus', english: 'to speak, to talk (hais = say + lus = words)', category: 'verbs', tags: ['verb', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hais lus.', english: 'I speak.' } },
    ],
  },
  {
    // ── NOUNS BY PURPOSE — 2026-09-28, path unit u-noun-purpose. The author: a noun takes a
    // "given verb" after it that says what it is for — phau ntawv (book) → phau ntawv nyeem
    // (novel), phau ntawv kawm (textbook). Used to tell apart nouns sharing one root; often
    // implied when the context is clear. Buildings and occupations use it most. The author's
    // examples: the two books, lub rooj noj mov, the two knives ("ram riab txim zaum / nqaij" →
    // rab riam txiav zaub / nqaij). Every other card and every example sentence is Claude's
    // (source: 'ai'), TODO-VERIFY. The unit also borrows tsev noj mov / kho mob / kawm ntawv,
    // chav pw, rooj noj mov, kws kho mob and tus kws txiav txim from their own sets.
    id: 'noun-purpose',
    title: 'Nouns by Purpose',
    description: 'Book, textbook, novel — a verb after the noun says what it is for.',
    emoji: '🏷️',
    words: [
      { id: 'np-pattern', hmongRPA: 'noun + verb (what it is for)', english: 'the verb after a noun says what the thing is used for — used to tell apart things that share a root', category: 'noun-purpose', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib phau ntawv kawm.', english: 'I have a textbook.', source: 'ai' } },
      { id: 'np-phau-ntawv-nyeem', hmongRPA: 'phau ntawv nyeem', english: 'a novel, a book for reading (book + read)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yuav ib phau ntawv nyeem tshiab.', english: 'She bought a new novel.', source: 'ai' } },
      { id: 'np-phau-ntawv-kawm', hmongRPA: 'phau ntawv kawm', english: 'a textbook (book + study)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv phau ntawv kawm nyob hauv kuv lub hnab.', english: 'My textbook is in my bag.', source: 'ai' } },
      { id: 'np-riam-txiav-zaub', hmongRPA: 'riam txiav zaub', english: 'a vegetable knife (knife + cut vegetables) — rab riam txiav zaub', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muab rab riam txiav zaub rau kuv.', english: 'Give me the vegetable knife.', source: 'ai' } },
      { id: 'np-riam-txiav-nqaij', hmongRPA: 'riam txiav nqaij', english: 'a meat knife (knife + cut meat) — rab riam txiav nqaij', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Rab riam txiav nqaij ntse heev.', english: 'The meat knife is very sharp.', source: 'ai' } },
      { id: 'np-rooj-sau-ntawv', hmongRPA: 'rooj sau ntawv', english: 'a writing desk (table + write) — lub rooj sau ntawv', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub rooj sau ntawv nyob hauv kuv chav pw.', english: 'My desk is in my bedroom.', source: 'ai' } },
      { id: 'np-chav-ua-noj', hmongRPA: 'chav ua noj', english: 'a kitchen (room + cook)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam nyob hauv chav ua noj.', english: 'Mom is in the kitchen.', source: 'ai' } },
      { id: 'np-chav-da-dej', hmongRPA: 'chav da dej', english: 'a bathroom (room + bathe)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Chav da dej nyob qhov twg?', english: 'Where is the bathroom?', source: 'ai' } },
      { id: 'np-dej-haus', hmongRPA: 'dej haus', english: 'drinking water (water + drink)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas muaj dej haus?', english: 'Do you have drinking water?', source: 'ai' } },
      { id: 'np-txaj-pw', hmongRPA: 'txaj pw', english: 'a bed (bed + sleep) — lub txaj pw', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub txaj pw loj heev.', english: 'My bed is very big.', source: 'ai' } },
      { id: 'np-kws-qhia-ntawv', hmongRPA: 'kws qhia ntawv', english: 'a teacher (expert + teach)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv niam yog kws qhia ntawv.', english: 'My mother is a teacher.', source: 'ai' } },
      { id: 'np-tsav-tsheb', hmongRPA: 'tus tsav tsheb', english: 'a driver (person + drive a vehicle)', category: 'noun-purpose', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tsav tsheb tos peb.', english: 'The driver is waiting for us.', source: 'ai' } },
      // category was 'tools-household' — moved 2026-09-28 into noun-purpose (Nouns by Purpose; a unit takes at most 3 sets).
      { id: 'phr-rooj-noj-mov', hmongRPA: 'rooj noj mov', english: 'a dining table', category: 'noun-purpose', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb zaum ntawm rooj noj mov.', english: 'We sit at the dining table.', source: 'ai' } },
      // category was 'reading-body' — moved 2026-09-28 into noun-purpose (Nouns by Purpose; a unit takes at most 3 sets).
      { id: 'phr-kws-kho-mob', hmongRPA: 'kws kho mob', english: 'a doctor', category: 'noun-purpose', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kws kho mob saib kuv hnub no.', english: 'The doctor examined me today.', source: 'ai' } },
      // category was 'reading-law' — moved 2026-09-28 into noun-purpose (Nouns by Purpose; a unit takes at most 3 sets).
      { id: 'phr-tus-kws-txiav-txim', hmongRPA: 'tus kws txiav txim', english: 'a judge', category: 'noun-purpose', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws txiav txim mloog rooj plaub.', english: 'The judge hears the case.', source: 'ai' } },
    ],
  },

  {
    id: 'colors',
    title: 'Colors',
    description: 'Common color names in Hmong.',
    emoji: '🎨',
    words: [
      {
        id: 'colors-red',
        hmongRPA: 'kob liab',
        english: 'red',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Tsho no liab.', english: 'This shirt is red.' },
      },
      {
        id: 'colors-blue',
        hmongRPA: 'kob xiav',
        english: 'blue',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kob xiav zoo.', english: 'Blue is nice.' },
      },
      {
        id: 'colors-green',
        hmongRPA: 'kob ntsuab',
        english: 'green',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Ntsuab zoo nkauj.', english: 'Green is beautiful.' },
      },
      {
        id: 'colors-yellow',
        hmongRPA: 'kob daj',
        english: 'yellow',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Paj no daj.', english: 'This flower is yellow.' },
      },
      {
        id: 'colors-black',
        hmongRPA: 'kob dub',
        english: 'black',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Tsho no dub.', english: 'This shirt is black.' },
      },
      {
        id: 'colors-white',
        hmongRPA: 'kob dawb',
        english: 'white',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Tsho no dawb.', english: 'This shirt is white.' },
      },
      {
        id: 'colors-brown',
        hmongRPA: 'kob kas fes',
        english: 'brown',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Av no kas fes.', english: 'This dirt is brown.' },
      },
      {
        id: 'colors-pink',
        hmongRPA: 'kob liab dawb muag',
        english: 'pink',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam kob liab dawb muag.', english: 'I like pink.' },
      },
      {
        id: 'colors-orange',
        hmongRPA: 'kob txiv kab ntxwv',
        english: 'orange',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam kob txiv kab ntxwv.', english: 'I like orange.' },
      },
      {
        id: 'colors-purple',
        hmongRPA: 'kob paj yeeb',
        english: 'purple',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv nyiam kob paj yeeb.', english: 'I like purple.' },
      },
      {
        id: 'colors-gold',
        hmongRPA: 'kob kub',
        english: 'gold',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kub zoo nkauj.', english: 'Gold is beautiful.' },
      },
      {
        id: 'colors-gray',
        hmongRPA: 'kob txho',
        english: 'gray',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kob txho zoo.', english: 'Gray is nice.' },
      },
      {
        id: 'colors-silver',
        hmongRPA: 'kob nyiaj',
        english: 'silver',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Nyiaj zoo nkauj.', english: 'Silver is beautiful.' },
      },
      {
        id: 'colors-peach',
        hmongRPA: 'kob nqaij',
        english: 'peach',
        category: 'colors',
        tags: ['color', 'adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Kob nqaij zoo.', english: 'Peach is nice.' },
      },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-xim', hmongRPA: 'xim', english: 'colour', category: 'colors', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Koj nyiam xim dab tsi?', english: 'What colour do you like?', source: 'ai' } },
      { id: 'misc-daj', hmongRPA: 'daj', english: 'yellow', category: 'colors', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Lub paj no daj.', english: 'This flower is yellow.', source: 'ai' } },
      { id: 'misc-liab', hmongRPA: 'liab', english: 'red', category: 'colors', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb no liab.', english: 'This car is red.', source: 'ai' } },
    ],
  },

  {
    id: 'descriptions',
    title: 'Common Descriptions',
    description: 'High-frequency adjectives for describing people, things, and qualities.',
    emoji: '✨',
    words: [
      {
        // ⚠️ ADDED 2026-09-12 from the Farewells lesson, where it is taught
        // before "Pom koj sai sai no" (see you soon). Doubling it — "sai sai" —
        // intensifies it, which is a general Hmong pattern worth knowing.
        id: 'descriptions-fast',
        hmongRPA: 'sai',
        english: 'fast, quick, soon',
        category: 'descriptions',
        tags: ['adjective', 'speed', 'time'],
        audioFile: 'lessons/farewells/sai.wav',
        exampleSentence: { hmong: 'Tus menyuam no khiav sai heev.', english: 'This child runs very fast.', source: 'ai' },
      },
      {
        id: 'descriptions-big',
        hmongRPA: 'loj',
        english: 'big; large',
        senses: [{ en: 'big; large', context: 'descriptions' }, { en: 'older; grown-up; adult', context: 'reading' }, { en: 'important; major', context: 'reading' }],
        category: 'descriptions',
        tags: ['adjective', 'size', 'age'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-loj.mp3',
        exampleSentence: { hmong: 'Tsev no loj.', english: 'This house is big.' },
      },
      {
        id: 'descriptions-overweight',
        hmongRPA: 'rog',
        english: 'overweight',
        category: 'descriptions',
        tags: ['adjective', 'body'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-rog.mp3',
        exampleSentence: { hmong: 'Tus aub ntawd rog heev.', english: 'That dog is very overweight.', source: 'ai' },
      },
      {
        id: 'descriptions-small',
        hmongRPA: 'me',
        english: 'small, young',
        category: 'descriptions',
        tags: ['adjective', 'size', 'age'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-me.mp3',
        exampleSentence: { hmong: 'Me nyuam no me.', english: 'This child is small.' },
      },
      {
        id: 'descriptions-skinny',
        hmongRPA: 'yuag',
        english: 'skinny',
        category: 'descriptions',
        tags: ['adjective', 'body'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-yuag.mp3',
        exampleSentence: { hmong: 'Tus miv no yuag heev.', english: 'This cat is very skinny.', source: 'ai' },
      },
      {
        id: 'descriptions-many-objects',
        hmongRPA: 'ntau',
        english: 'many (objects)',
        category: 'descriptions',
        tags: ['adjective', 'quantity'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-ntau.mp3',
        exampleSentence: { hmong: 'Dej ntau.', english: 'There is a lot of water.' },
      },
      {
        id: 'descriptions-talkative',
        hmongRPA: 'kheev tham',
        english: 'talkative',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-kheev-tham.mp3',
        exampleSentence: { hmong: 'Kuv tus muam kheev tham.', english: 'My sister is talkative.', source: 'ai' },
      },
      {
        id: 'descriptions-few',
        hmongRPA: 'tsawg',
        english: 'a little, few',
        category: 'descriptions',
        tags: ['adjective', 'quantity'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-tsawg.mp3',
        exampleSentence: { hmong: 'Neeg tsawg.', english: 'Few people.' },
      },
      {
        id: 'descriptions-smiley',
        hmongRPA: 'kheev luag',
        english: 'smiley',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-kheev-luag.mp3',
        exampleSentence: { hmong: 'Koj kheev luag nyob vim li cas?', english: 'Why are you smiley?', source: 'ai' },
      },
      {
        id: 'descriptions-tall',
        hmongRPA: 'siab',
        english: 'tall; high',
        senses: [{ en: 'heart; inner self; mind; feelings', context: 'personality-siab' }, { en: 'chest — in "lub hauv siab"', context: 'body' }, { en: 'intention; willingness; emotional state', context: 'personality-siab' }, { en: 'tall; high', context: 'descriptions' }],
        category: 'descriptions',
        tags: ['adjective', 'size', 'body'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-siab.mp3',
        exampleSentence: { hmong: 'Nws siab heev.', english: 'He is very tall.' },
      },
      {
        id: 'descriptions-good',
        hmongRPA: 'zoo',
        english: 'good; well; fine',
        senses: [{ en: 'good; well; fine', context: 'descriptions' }, { en: 'beautiful; nice', context: 'reading' }, { en: 'properly; well — adverbial', context: 'reading' }, { en: 'okay; all right — as a response', context: 'reading' }],
        category: 'descriptions',
        tags: ['adjective', 'quality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-zoo.mp3',
        exampleSentence: { hmong: 'Zoo heev.', english: 'Very good.' },
      },
      {
        id: 'descriptions-new',
        hmongRPA: 'tshiab',
        english: 'new',
        category: 'descriptions',
        tags: ['adjective', 'age'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-tshiab.mp3',
        exampleSentence: { hmong: 'Lub tsev tshiab.', english: 'The new house.' },
      },
      {
        id: 'descriptions-bad',
        hmongRPA: 'phem',
        english: 'bad; evil; harmful',
        senses: [{ en: 'bad; evil; harmful', context: 'descriptions' }, { en: 'severe; serious', context: 'reading' }],
        category: 'descriptions',
        tags: ['adjective', 'quality', 'reviewed'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-phem.mp3',
        exampleSentence: { hmong: 'Tus neeg phem.', english: 'The bad person.' },
      },
      {
        id: 'descriptions-old',
        hmongRPA: 'qub',
        english: 'old',
        category: 'descriptions',
        tags: ['adjective', 'age'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-qub.mp3',
        exampleSentence: { hmong: 'Lub tsev qub.', english: 'The old house.' },
      },
      {
        id: 'descriptions-not-lazy',
        hmongRPA: 'nquag',
        english: 'not lazy, diligent',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-nquag.mp3',
        exampleSentence: { hmong: 'Kuv tus tub nquag kawm ntawv.', english: 'My son studies diligently.', source: 'ai' },
      },
      {
        id: 'descriptions-cheap',
        hmongRPA: 'pheej yig',
        english: 'cheap',
        category: 'descriptions',
        tags: ['adjective', 'price'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-pheej-yig.mp3',
        exampleSentence: { hmong: 'Nqi pheej yig.', english: 'The price is cheap.' },
      },
      {
        id: 'descriptions-lazy',
        hmongRPA: 'tub nkeeg',
        english: 'lazy',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-tub-nkeeg.mp3',
        exampleSentence: { hmong: 'Kuv tus nus tub nkeeg heev.', english: 'My brother is very lazy.', source: 'ai' },
      },
      {
        id: 'descriptions-pretty',
        hmongRPA: 'zoo nkauj',
        english: 'pretty',
        category: 'descriptions',
        tags: ['adjective', 'appearance'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-zoo-nkauj.mp3',
        exampleSentence: { hmong: 'Nws zoo nkauj.', english: 'She is pretty.' },
      },
      {
        id: 'descriptions-long',
        hmongRPA: 'ntev',
        english: 'long',
        category: 'descriptions',
        tags: ['adjective', 'size'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-ntev.mp3',
        exampleSentence: { hmong: 'Txoj hlaub ntev.', english: 'The pipe is long.' },
      },
      {
        id: 'descriptions-handsome',
        hmongRPA: 'zoo nraug',
        english: 'handsome',
        category: 'descriptions',
        tags: ['adjective', 'appearance'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-zoo-nraug.mp3',
        exampleSentence: { hmong: 'Nws zoo nraug.', english: 'He is handsome.' },
      },
      {
        id: 'descriptions-short-objects',
        hmongRPA: 'luv',
        english: 'short (objects)',
        category: 'descriptions',
        tags: ['adjective', 'size'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-luv.mp3',
        exampleSentence: { hmong: 'Lub tsho no luv dhau.', english: 'This shirt is too short.', source: 'ai' },
      },
      {
        id: 'descriptions-short',
        hmongRPA: 'qib taub',
        english: 'short',
        category: 'descriptions',
        tags: ['adjective', 'size', 'body'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-qib-taub.mp3',
        exampleSentence: { hmong: 'Tus menyuam no qib taub heev.', english: 'This child is very short.', source: 'ai' },
      },
      {
        id: 'descriptions-loveable',
        hmongRPA: 'ntxim hlub',
        english: 'loveable',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-ntxim-hlub.mp3',
        exampleSentence: { hmong: 'Tus menyuam mos no ntxim hlub heev.', english: 'This baby is very lovable.', source: 'ai' },
      },
      {
        id: 'descriptions-many-animate',
        hmongRPA: 'coob',
        english: 'many (animate)',
        category: 'descriptions',
        tags: ['adjective', 'quantity'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-coob.mp3',
        exampleSentence: { hmong: 'Neeg coob.', english: 'Many people.' },
      },
      {
        id: 'descriptions-mature',
        hmongRPA: 'paub taub',
        english: 'mature',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-paub-taub.mp3',
        exampleSentence: { hmong: 'Nws tseem hluas tiamsis paub taub.', english: 'She is young but mature.', source: 'ai' },
      },
      {
        id: 'descriptions-well-mannered',
        hmongRPA: 'paub cai',
        english: 'well-mannered',
        category: 'descriptions',
        tags: ['adjective', 'personality'],
        audioFile: 'grammar/adjectives/hmong-common-adjectives-paub-cai.mp3',
        exampleSentence: { hmong: 'Tus tub no paub cai heev.', english: 'This boy is very well-mannered.', source: 'ai' },
      },
      {
        // Added 2026-09-21 from the author, word and sentence both — so no
        // `source: 'ai'`, and it goes straight into the sentence builder.
        // Opposite: `qhuav` (dry), in the weather deck.
        id: 'descriptions-wet',
        hmongRPA: 'ntub',
        english: 'wet',
        category: 'descriptions',
        tags: ['adjective'],
        audioFile: null,
        exampleSentence: { hmong: 'Koj cov khaub ncaws ntub tas lawm.', english: 'Your clothes are all wet.' },
      },
    ],
  },

{
id: 'discourse-particles',
title: 'Discourse Particles',
description: 'Sentence-final particles that indicate mood, stress, and question formation.',
emoji: '💬',
words: [
{
id: 'discourse-nawb',
hmongRPA: 'nawb',
// Was: '(confirming in a suggestive tone)' — the author's particle list, 2026-09-28.
english: '(soft insistence, friendly urging — common in thanks and goodbyes)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj yuav tuaj, nawb?', english: 'You will come, okay?', source: 'ai' },
},
{
id: 'discourse-yom',
hmongRPA: 'yom',
// Was: '(turns statements into confirming questions)' — the author's preferred list, 2026-09-28.
english: '(soft agreement-seeking: “right?”, “isn’t it?”)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj twb noj mov lawm yom?', english: 'You already ate, right?', source: 'ai' },
},
{
id: 'discourse-os',
hmongRPA: 'os',
// Was: '(softens tone, no meaning change)' — the author's particle list, 2026-09-28.
english: '(softens the sentence — polite, friendly; very frequent in greetings and statements)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj tos kuv os.', english: 'Please wait for me.', source: 'ai' },
// Added 2026-09-28 (author): the soft hello is just Nyob zoo os; Kuv nyob zoo os from the author's particle list.
examples: [{ hmong: 'Nyob zoo os.', english: 'Hello. (softly)' }, { hmong: 'Kuv nyob zoo os.', english: 'I am fine. (softer, friendlier)' }],
},
{
id: 'discourse-lov',
hmongRPA: 'lov',
// Was: '(turns a statement into a question)' — the author's particle list, 2026-09-28.
english: '(softens a question or statement — yes/no questions, invitations)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj noj mov lov?', english: 'Are you eating?', source: 'ai' },
},
{
id: 'discourse-ne',
hmongRPA: 'ne',
// Was: '(asks about the preceding subject)' — the author's particle list, 2026-09-28.
english: '(contrast or follow-up: “and what about…?”, “as for…”)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj niam ne?', english: 'What about your mother?', source: 'ai' },
examples: [{ hmong: 'Koj ne?', english: 'And you? / What about you?' }],  // the author's particle list, 2026-09-28
},
{
id: 'discourse-mog',
hmongRPA: 'mog',
// Was: '(segment marker in personal relationships)' — the author's preferred list, 2026-09-28.
english: '(soft request softener — often with nawb)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj yog kuv tus phooj ywg mog.', english: 'You are my friend, you know.', source: 'ai' },
},
// ── Added 2026-09-28 from the author: thiab at the END of a sentence (the author's own note),
// and xwb / mas as particles (in the dictionary already, but not in this set).
{ id: 'discourse-thiab', hmongRPA: 'thiab (at the end)', english: 'also, too — at the END of a sentence; it can also leave something unsaid, so the sentence feels less final', category: 'discourse-particles', tags: ['particle', 'discourse', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam koj thiab.', english: 'I like you too.' }, examples: [{ hmong: 'Nws tuaj thiab.', english: 'He came too.' }] },
{ id: 'discourse-xwb', hmongRPA: 'xwb', english: '(only, just — limits the statement; very frequent)', category: 'discourse-particles', tags: ['particle', 'discourse', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov xwb.', english: 'I just ate. (that’s all)' } },
{ id: 'discourse-mas', hmongRPA: 'mas', english: '(topic marker or soft comment: “as for…”, “then…”; can also close with feeling)', category: 'discourse-particles', tags: ['particle', 'discourse', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ua li kuv hais mas.', english: 'Do as I say.', source: 'ai' } },
// ── The author's PREFERRED particle list, 2026-09-28 — glosses and spellings theirs. No examples
// yet (asked): these are in the set and the dictionary, not yet in the u-particles unit.
{ id: 'discourse-na', hmongRPA: 'na', english: '(mild emphasis, seeking confirmation: “you know”) — use na, not nab / naj / nav / nas', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-ntag', hmongRPA: 'ntag', english: '(strong emphasis: “exactly”, “indeed”) — preferred over ntad', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
// Rewritten 2026-09-30 with ans-aws, same reasoning. Was '(soft agreement:
// “oh”, “yes”, “I see”) — preferred over as'. The spelling note is kept: it is
// a real orthographic point, not a hedge about meaning.
{ id: 'discourse-aws', hmongRPA: 'aws', english: 'yes; I see — a soft agreement or acknowledgement (spelled aws, not as)', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-pob', hmongRPA: 'pob', english: '(uncertainty: “maybe”, “I guess”)', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-sas', hmongRPA: 'sas', english: '(mild emphasis, soft insistence) — preferred over sad', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-lauj', hmongRPA: 'lauj', english: '(mild exclamation)', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-oj', hmongRPA: 'oj', english: '(calling attention, mild surprise) — preferred; ov and og are variants', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-sob', hmongRPA: 'sob', english: '(mild urging) — preferred over soj', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
{ id: 'discourse-li', hmongRPA: 'li', english: '(emphatic particle)', category: 'discourse-particles', tags: ['particle', 'discourse'], audioFile: null },
],
},

{
id: 'conjunctions',
title: 'High-Frequency Conjunctions',
description: 'Common conjunctions, connectives, and subordinating particles for forming complex sentences.',
emoji: '🔗',
words: [
{
id: 'conjunctions-then',
hmongRPA: 'ces',
english: 'then; and then',
senses: [{ en: 'then; and then', context: 'conjunctions' }, { en: 'so; in that case', context: 'reading' }],
category: 'conjunctions',
tags: ['conjunction', 'sequence'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-ces.mp3',
exampleSentence: { hmong: 'Kuv mus ces koj tuaj.', english: 'I go then you come.' },
},
{
id: 'conjunctions-and',
hmongRPA: 'thiab',
english: 'and — joining nouns, phrases or clauses',
senses: [{ en: 'and — joining nouns, phrases or clauses', context: 'conjunctions' }, { en: 'also; too; as well', context: 'reading' }, { en: 'inclusive additive in a request: "Cia kuv mus thiab os", please let me go too', context: 'reading' }],
category: 'conjunctions',
tags: ['conjunction', 'coordination'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-thiab.mp3',
// Example was 'Kuv thiab koj.' — the Hmong order follows the English: koj thiab kuv = you and I; kuv thiab koj = me and you (author, 2026-09-28).
exampleSentence: { hmong: 'Koj thiab kuv.', english: 'You and I.' },
},
{
id: 'conjunctions-with',
hmongRPA: 'nrog',
english: 'with — accompaniment',
senses: [{ en: 'with — accompaniment', context: 'conjunctions' }, { en: 'and; together with', context: 'reading' }, { en: 'using; by means of', context: 'reading' }],
category: 'conjunctions',
tags: ['preposition', 'comitative'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-nrog.mp3',
exampleSentence: { hmong: 'Kuv mus nrog nws.', english: 'I go with him.' },
},
{
id: 'conjunctions-but',
hmongRPA: 'tiamsis',
// "however" merged from the commented-out `phr-tiam-sis` on 2026-09-20.
english: 'but; however',
category: 'conjunctions',
tags: ['conjunction', 'contrast'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-tiamsis.mp3',
exampleSentence: { hmong: 'Kuv xav tiamsis tsis tau.', english: 'I want but cannot.' },
},
{
id: 'conjunctions-just-in-case',
hmongRPA: 'ib tsam',
english: 'just in case, or else',
category: 'conjunctions',
tags: ['conjunction', 'condition'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-ib-tsam.mp3',
exampleSentence: { hmong: 'Nqa lub kaus, ib tsam yuav los nag.', english: 'Take an umbrella, in case it rains.', source: 'ai' },
},
{
id: 'conjunctions-because',
hmongRPA: 'vim hais tias',
english: 'because',
category: 'conjunctions',
tags: ['conjunction', 'causation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-vim-hais-tias.mp3',
exampleSentence: { hmong: 'Kuv tsis mus vim hais tias kuv nyuaj siab.', english: 'I do not go because I am sad.' },
},
{
id: 'conjunctions-because-short',
hmongRPA: 'vim',
english: 'because; due to',
senses: [{ en: 'because; due to', context: 'conjunctions' }, { en: 'why — only in "vim li cas"', context: 'reading' }],
category: 'conjunctions',
tags: ['conjunction', 'causation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-vim.mp3',
exampleSentence: { hmong: 'Kuv nyob hauv tsev vim nag los.', english: 'I stay home because it is raining.', source: 'ai' },
},
{
id: 'conjunctions-or',
hmongRPA: 'los yog',
english: 'or',
category: 'conjunctions',
tags: ['conjunction', 'alternation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-los-yog.mp3',
exampleSentence: { hmong: 'Koj nyiam los yog kuv nyiam.', english: 'You like or I like.' },
},
{
id: 'conjunctions-or-short',
hmongRPA: 'lossis',
english: 'or',
category: 'conjunctions',
tags: ['conjunction', 'alternation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-lossis.mp3',
exampleSentence: { hmong: 'Koj xav haus dej lossis kua txiv?', english: 'Do you want water or juice?', source: 'ai' },
},
{
id: 'conjunctions-also',
hmongRPA: 'tsis tas li ntawd',
english: 'also, in addition to that',
category: 'conjunctions',
tags: ['conjunction', 'addition'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-tsis-tas-li-ntawd.mp3',
exampleSentence: { hmong: 'Nws kawm ntawv, tsis tas li ntawd nws ua haujlwm.', english: 'She studies, and in addition, she works.', source: 'ai' },
},
{
id: 'conjunctions-even-though',
hmongRPA: 'txawm ... los',
english: 'even though, although',
category: 'conjunctions',
tags: ['conjunction', 'concession'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-txawm-los.mp3',
exampleSentence: { hmong: 'Txawm nag los, peb tseem mus.', english: 'Even though it rains, we still go.', source: 'ai' },
},
{
id: 'conjunctions-let',
hmongRPA: 'cia',
english: 'to let',
category: 'conjunctions',
tags: ['verb', 'causative'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-cia.mp3',
exampleSentence: { hmong: 'Cia kuv hais.', english: 'Let me speak.' },
},
{
id: 'conjunctions-that-quotative',
hmongRPA: 'hais tias',
english: '(complementizer: that)',
category: 'conjunctions',
tags: ['complementizer', 'quotation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-hais-tias.mp3',
exampleSentence: { hmong: 'Nws hais tias nws paub.', english: 'He said that he knows.' },
},
{
id: 'conjunctions-that-short',
hmongRPA: 'tias',
english: 'that — complementizer after say, know, think, believe',
senses: [{ en: 'that — complementizer after say, know, think, believe', context: 'conjunctions' }, { en: 'that; which — linking a noun or statement to more information', context: 'reading' }],
category: 'conjunctions',
tags: ['complementizer', 'quotation'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-tias.mp3',
exampleSentence: { hmong: 'Kuv paub tias nws nyob tom tsev.', english: 'I know that she is at home.', source: 'ai' },
},
{
id: 'conjunctions-that-relative',
hmongRPA: 'uas',
english: 'that; which; who — relative-clause marker',
senses: [{ en: 'that; which; who — relative-clause marker', context: 'conjunctions' }, { en: 'that — linking a noun or clause to more information', context: 'reading' }],
category: 'conjunctions',
tags: ['relative marker', 'subordinator'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-uas.mp3',
exampleSentence: { hmong: 'Tus neeg uas kuv pom.', english: 'The person that I saw.' },
},
{
id: 'conjunctions-about',
hmongRPA: 'txog',
english: 'about; concerning — the topic of speech or thought',
senses: [{ en: 'about; concerning — the topic of speech or thought', context: 'conjunctions' }, { en: 'reach; arrive at', context: 'verbs' }, { en: 'until; up to; as far as', context: 'reading' }],
category: 'conjunctions',
tags: ['preposition', 'topic'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-txog.mp3',
exampleSentence: { hmong: 'Kuv hais txog koj.', english: 'I speak about you.' },
},
{
id: 'conjunctions-so-that',
hmongRPA: 'kom',
english: 'so that; in order that',
senses: [{ en: 'so that; in order that', context: 'conjunctions' }, { en: 'tell; direct someone to do something', context: 'verbs' }, { en: 'clause linker for a request, command, desired outcome, or result', context: 'reading' }],
category: 'conjunctions',
tags: ['conjunction', 'purpose', 'reviewed'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-kom.mp3',
exampleSentence: { hmong: 'Koj mus kom kuv paub.', english: 'You go so that I know.' },
},
{
id: 'conjunctions-if',
hmongRPA: 'yog hais tias',
// The author, 2026-09-28: yog hais tias is the usual "if" — easier to tell apart from yog "to be"; the two are interchangeable, but yog hais tias is the more literal if. Was: 'if'
english: 'if — the usual way to say it; clearer than yog alone',
category: 'conjunctions',
tags: ['conjunction', 'condition'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-yog-hais-tias.mp3',
exampleSentence: { hmong: 'Yog hais tias nag los, peb nyob tsev.', english: 'If it rains, we will stay home.', source: 'ai' },
},
{
id: 'conjunctions-if-short',
hmongRPA: 'yog',
english: 'if',
category: 'conjunctions',
tags: ['conjunction', 'condition'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-yog.mp3',
exampleSentence: { hmong: 'Yog koj mus ces kuv tuaj.', english: 'If you go then I come.' },
},
{
id: 'conjunctions-maybe',
hmongRPA: 'ntshe',
english: 'maybe',
category: 'conjunctions',
tags: ['adverb', 'modality'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-ntshe.mp3',
exampleSentence: { hmong: 'Ntshe koj paub.', english: 'Maybe you know.' },
},
{
id: 'conjunctions-only',
hmongRPA: 'tsuas ... xwb',
english: 'only',
category: 'conjunctions',
tags: ['adverb', 'restrictive'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-tsuas-xwb.mp3',
exampleSentence: { hmong: 'Kuv tsuas haus dej xwb.', english: 'I only drink water.', source: 'ai' },
},
{
id: 'conjunctions-to-for',
hmongRPA: 'rau',
english: 'to, for',
category: 'conjunctions',
tags: ['preposition', 'dative'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-rau.mp3',
exampleSentence: { hmong: 'Kuv muab rau koj.', english: 'I give to you.' },
},
{
id: 'conjunctions-whereas',
hmongRPA: 'hos',
english: 'whereas',
category: 'conjunctions',
tags: ['conjunction', 'contrast'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-hos.mp3',
exampleSentence: { hmong: 'Kuv nyiam tshuaj yej, hos nws nyiam kas fes.', english: 'I like tea, whereas she likes coffee.', source: 'ai' },
},
{
id: 'conjunctions-to-see-if',
hmongRPA: 'seb',
english: 'to see if',
category: 'conjunctions',
tags: ['conjunction', 'determination'],
audioFile: 'grammar/conjunctions/hmong-conjunctions-seb.mp3',
exampleSentence: { hmong: 'Kuv mus seb nws nyob.', english: 'I go to see if he is home.' },
},
],
},

{
id: 'timeframes-days',
title: 'Days & Frequency',
description: 'Day words built on "hnub" — today, everyday, the other day.',
emoji: '🕐',
words: [
{
id: 'timeframes-day',
hmongRPA: 'hnub',
english: 'day, sun',
category: 'timeframes-days',
tags: ['noun', 'time'],
audioFile: null,
exampleSentence: { hmong: 'Hnub ci sov.', english: 'The sun shines warm.' },
},
{
id: 'timeframes-today',
hmongRPA: 'hnub no',
english: 'today',
category: 'timeframes-days',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Hnub no kuv mus.', english: 'Today I go.' },
},
{
id: 'timeframes-one-day',
hmongRPA: 'ib hnub',
english: 'one day, all day, someday',
category: 'timeframes-days',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Ib hnub kuv yuav mus.', english: 'Someday I will go.' },
},
{
id: 'timeframes-all-the-time',
hmongRPA: 'tas hnub',
english: 'all the time, all day and all night',
category: 'timeframes-days',
tags: ['noun', 'time', 'duration'],
audioFile: null,
exampleSentence: { hmong: 'Nws ua haujlwm tas hnub.', english: 'She works all day.', source: 'ai' },
},
{
id: 'timeframes-everyday',
hmongRPA: 'txhua hnub',
english: 'everyday',
category: 'timeframes-days',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Kuv mus tsev txhua hnub.', english: 'I go home everyday.' },
},
{
id: 'timeframes-the-other-day',
hmongRPA: 'hnub i',
english: 'the other day',
category: 'timeframes-days',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Hnub i kuv pom nws.', english: 'The other day I saw him.' },
},
{
id: 'timeframes-some-other-day',
hmongRPA: 'lwm hnub',
english: 'some other day',
category: 'timeframes-days',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Lwm hnub kuv tuaj.', english: 'Some other day I will come.' },
},
],
},

{
id: 'time-context',
title: 'Time Context',
description: 'Tense markers and time-context particles for indicating when actions occur.',
emoji: '⏳',
words: [
{
id: 'time-context-tau',
hmongRPA: 'tau',
// Was: english: '(past tense marker: completion)' — reworded 2026-09-26 to match
// tense-markers-past sense 1, so the dictionary shows ONE "have done" definition.
english: 'attained, reached: the action came about (tau before the verb) — an aspect marker, often translated did, have done — "Kuv tau mus", I went',  /* was 'did, have done: the action is attained (tau before the verb) — …' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tau mus.', english: 'I went.' },
},
{
id: 'time-context-twb-lawm',
hmongRPA: 'twb ... lawm',
// Was: english: '(present perfect marker)' — reworded 2026-09-26 (time markers, one style).
english: 'already — twb before the verb, lawm at the end',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv twb mus lawm.', english: 'I have already gone.' },
},
{
id: 'time-context-tabtom-present',
hmongRPA: 'tab tom',
// Was: english: '(present continuous marker)' — matched to tense-markers-progressive, 2026-09-26.
english: 'right now, currently — the action is happening at this moment (am / is / are …-ing)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tab tom noj mov.', english: 'I am eating rice.' },
},
// Moved BELOW the present card 2026-09-26: definitions are numbered in data order,
// and the author wants tab tom taught as happening right now first.
{
id: 'time-context-tabtom-past',
hmongRPA: 'tab tom',
// Was: english: '(past continuous marker: currently)' — reworded 2026-09-26 (time markers, one style).
english: 'was …-ing — only with a past time word or context; its everyday meaning is right now',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tab tom hais.', english: 'I was speaking.' },
},
{
id: 'time-context-tagkis',
hmongRPA: 'tagkis',  // was hmongRPA: 'tag kis' — joined, author 2026-09-27
english: 'tomorrow',
category: 'time-context',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Tagkis kuv mus.', english: 'Tomorrow I will go.' },
},
{
id: 'time-context-yuav',
hmongRPA: 'yuav',
// Was: english: '(future tense marker: going to)' — reworded 2026-09-26 (time markers, one style).
english: 'going to, will — the everyday future',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv yuav mus.', english: 'I am going to go.' },
},
{
id: 'time-context-mam-li',
hmongRPA: 'mam li',
// Was: english: '(future tense marker: will)' — reworded 2026-09-26 (time markers, one style).
// Was: english: 'will — later, or then (once something else has happened)' — the author, 2026-09-28.
english: 'will — for sure: planned, determined, actually going to happen (firmer than yuav)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv mam li mus.', english: 'I will go.' },
},
{
id: 'time-context-tabtom-yuav',
hmongRPA: 'tab tom yuav',
// Was: english: '(future progressive marker: about to)' — reworded 2026-09-26 (time markers, one style).
// Was: english: 'about to — right on the edge of doing it' — the author, 2026-09-28.
english: 'about to — the future progressive: right on the edge of doing it',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tab tom yuav mus.', english: 'I am about to go.' },
},
{
id: 'time-context-tas-los-no',
hmongRPA: 'tas los no',
english: 'the past one, the one before',
category: 'time-context',
tags: ['phrase', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Kuv nyiam zaj nkauj tas los no.', english: 'I liked the previous song.', source: 'ai' },
},
{
id: 'time-context-ua-ntej',
hmongRPA: 'ua ntej',
english: 'before, first',
category: 'time-context',
tags: ['adverb', 'time', 'sequence'],
audioFile: null,
exampleSentence: { hmong: 'Ua ntej kuv mus.', english: 'Before I go.' },
},
{
id: 'time-context-tom-qab',
hmongRPA: 'tom qab',
// ⚠️ THE TIME SENSE ONLY. The spatial sense (back / behind) is its OWN entry —
// `locprep-tom-qab` in locations-prepositions — following the `rau` pattern:
// distinct but connected entries, each in the category where it is actually
// taught, rather than one entry carrying a senses[] list.
//
// Rejected 2026-09-30: a single entry with senses[], which rendered as
// "Also means • after … • back; behind …". That reads as one word with a
// footnote. These are two uses a learner meets in two different lessons, and
// `rau` (wear-verbs-rau / conjunctions-to-for / numbers-6) already establishes
// how this codebase says that.
english: 'after',
category: 'time-context',
tags: ['adverb', 'time', 'sequence'],
audioFile: null,
exampleSentence: { hmong: 'Tom qab kuv mus.', english: 'After I go.' },
},
{
id: 'time-context-ntxov',
hmongRPA: 'ntxov',
english: 'early',
senses: [{ en: 'early', context: 'time' }, { en: 'morning or early-day element, as in tagkis ntxov = tomorrow morning', context: 'reading' }],
category: 'time-context',
tags: ['adverb', 'time', 'reviewed'],
audioFile: null,
exampleSentence: { hmong: 'Kuv sawv ntxov.', english: 'I wake up early.' },
},
{
id: 'time-context-lig',
hmongRPA: 'lig',
english: 'late',
category: 'time-context',
tags: ['adverb', 'time'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tuaj lig.', english: 'I come late.' },
},
{
id: 'time-context-nyuam-qhuav',
hmongRPA: 'nyuam qhuav',
english: 'just, recently',
category: 'time-context',
tags: ['adverb', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Kuv nyuam qhuav tuaj.', english: 'I just came.' },
},
],
},

  // ── Grammar-concept categories ────────────────────────────────────────────
  // Added 2026-07-17. These hold the words the FOUNDATIONS lessons teach.
  // They existed only as inline `examples` items inside lesson files, which
  // meant they could never be drilled, scheduled by the SRS, or quizzed —
  // and every lesson about a grammar concept had nowhere to hand off to.
  // Now each has a real category, so `vocab: '<id>'` on the lesson works and
  // `vocab-<id>` quizzes auto-generate. See notes/38.
  {
    id: 'pronouns',
    title: 'Pronouns',
    description: 'I, you, he/she — including the dual forms Hmong has and English lacks.',
    emoji: '👤',
    words: [
      { id: 'pronouns-i', hmongRPA: 'kuv', english: 'I / me', category: 'pronouns', tags: ['pronoun', 'singular'], audioFile: 'grammar/pronouns/hmong-pronouns-kuv.mp3', exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      { id: 'pronouns-you', hmongRPA: 'koj', english: 'you, one person', senses: [{ en: 'you, one person', context: 'pronouns' }, { en: 'your; yours', context: 'reading' }], category: 'pronouns', tags: ['pronoun', 'singular', 'reviewed'], audioFile: 'grammar/pronouns/hmong-pronouns-koj.mp3', exampleSentence: { hmong: 'Koj puas nyob zoo?', english: 'How are you?' } },
      // ⚠️ FIXED 2026-09-25 (author): "Nws hu ua Mim" → "Nws npe hu ua Mim" — the name needs npe.
      { id: 'pronouns-he-she', hmongRPA: 'nws', english: 'he; she; it', category: 'pronouns', tags: ['pronoun', 'singular', 'reviewed'], audioFile: 'grammar/pronouns/hmong-pronouns-nws.mp3', exampleSentence: { hmong: 'Nws lub npe hu ua Mim.', english: 'Her name is Mim.' } },
      { id: 'pronouns-we-two', hmongRPA: 'wb', english: 'we two (you and I)', category: 'pronouns', tags: ['pronoun', 'dual'], audioFile: 'grammar/pronouns/hmong-pronouns-wb.mp3', exampleSentence: { hmong: 'Wb mus tom khw ua ke.', english: 'The two of us go to the market together.', source: 'ai' } },
      { id: 'pronouns-you-two', hmongRPA: 'neb', english: 'you two', category: 'pronouns', tags: ['pronoun', 'dual'], audioFile: 'grammar/pronouns/hmong-pronouns-neb.mp3', exampleSentence: { hmong: 'Neb tsev nyob qhov twg?', english: 'Where is the house of you two?', source: 'ai' } },
      { id: 'pronouns-they-two', hmongRPA: 'nkawd', english: 'they two; the two of them', senses: [{ en: 'they two; the two of them', context: 'pronouns' }, { en: 'their two; belonging to the two of them', context: 'reading' }], category: 'pronouns', tags: ['pronoun', 'dual', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nkawd sib hlub.', english: 'The two of them love each other.' } },
      { id: 'pronouns-we', hmongRPA: 'peb', english: 'we (three or more)', category: 'pronouns', tags: ['pronoun', 'plural'], audioFile: 'grammar/pronouns/hmong-pronouns-peb.mp3', exampleSentence: { hmong: 'Peb mus noj mov ua ke.', english: 'We go eat together.', source: 'ai' } },
      { id: 'pronouns-you-plural', hmongRPA: 'nej', english: 'you (three or more)', category: 'pronouns', tags: ['pronoun', 'plural'], audioFile: 'grammar/pronouns/hmong-pronouns-nej.mp3', exampleSentence: { hmong: 'Nej cov khoom nyob qhov twg?', english: 'Where are your things?', source: 'ai' } },
      { id: 'pronouns-they', hmongRPA: 'lawv', english: 'they; them', senses: [{ en: 'they; them', context: 'pronouns' }, { en: 'their; theirs', context: 'reading' }], category: 'pronouns', tags: ['pronoun', 'plural', 'reviewed'], audioFile: 'grammar/pronouns/hmong-pronouns-lawv.mp3', exampleSentence: { hmong: 'Lawv mus lawm.', english: 'They went.' } },
    ],
  },
  {
    // ── RAU — 2026-09-27, path unit u-rau. The author: rau is a homonym — six, to / for,
    // and to wear / put on footwear (shoes, socks, slippers) — decided by context. Verb +
    // rau + noun + verb means "for someone to do something"; the second rau is implied and
    // not said: "Kuv sau ntawv rau koj nyeem". Examples: the author's, the author's pronoun
    // story (muab … rau koj), the Joining Words card (Kuv muab rau koj); 'Kuv muaj rau tus
    // aub' and 'Kuv rau khau' are Claude's.
    id: 'rau-uses',
    title: 'Rau: Six, To & Wear',
    description: 'One word, three meanings: six, to / for, and putting on shoes.',
    emoji: '🔀',
    words: [
      { id: 'rau-pattern-to', hmongRPA: 'verb + rau + person', english: 'to, for — giving or doing something to or for someone', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab kuv daim pib rau koj.', english: 'I give my ticket to you.' }, examples: [{ hmong: 'muab rau koj', english: 'give (it) to you' }, { hmong: 'hais rau kuv', english: 'tell (it) to me' }] },
      { id: 'rau-pattern-for-to', hmongRPA: 'verb + rau + person + verb', english: 'for someone to do something — the second rau is left out', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sau ntawv rau koj nyeem.', english: 'I am writing for you to read.' }, examples: [{ hmong: 'sau ntawv rau koj nyeem', english: 'write for you to read (literally "write paper for you read")' }] },
      { id: 'rau-pattern-give-me', hmongRPA: 'muab rau kuv', english: 'give (it) to me', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muab rau kuv.', english: 'Give it to me.' } },
      { id: 'rau-pattern-six', hmongRPA: 'rau + classifier + noun (six)', english: 'six — as a number, rau comes before the classifier', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj rau tus aub.', english: 'I have six dogs.' }, examples: [{ hmong: 'rau hnub', english: 'six days' }, { hmong: 'rau tus aub', english: 'six dogs' }] },
      // Was english: 'to put on, to wear — only for the feet: shoes, socks, slippers'. "Only"
      // dropped 2026-09-27: rau also means put / apply (below); for clothing it's the feet.
      { id: 'rau-pattern-wear', hmongRPA: 'rau + footwear', english: 'to put on, to wear — for clothing, the verb for the feet: shoes, socks, slippers', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv rau khau.', english: 'I put on shoes.' }, examples: [{ hmong: 'rau khau', english: 'put on shoes' }] },
      // Added 2026-09-27 (author): rau as put / apply and toward / in / on / at — context-based.
      // Examples are the author's ("Nws rau tsuaj" → tshuaj, medicine). 'Nws nyob hauv tsev' is
      // Claude's, TODO-VERIFY.
      { id: 'rau-pattern-apply', hmongRPA: 'rau + a thing (put, apply)', english: 'to put, to place, to apply — context-based', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws rau tshuaj.', english: 'He applies medicine.' }, examples: [{ hmong: 'rau tshuaj', english: 'apply medicine' }] },
      { id: 'rau-pattern-put-on', hmongRPA: 'muab … rau + place', english: 'to put something in a place — on, in', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muab phau ntawv rau saum rooj.', english: 'Put the book on the table.' } },
      { id: 'rau-pattern-toward', hmongRPA: 'verb + rau + place', english: 'to, toward, into — context-based; uncommon for going places, and often left out', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus rau tsev kawm ntawv.', english: 'They go to school.' }, examples: [{ hmong: 'Lawv mus tsev kawm ntawv.', english: 'They go to school. (rau left out; still implied)' }, { hmong: 'Taug kev rau hauv nroog.', english: 'Walk to the city.' }] },
      { id: 'rau-pattern-at', hmongRPA: 'nyob rau + place', english: 'at, in — possible, but ntawm (at) or hauv (in) is more usual', category: 'rau-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nyob rau tsev.', english: 'It is at / in the house.' }, examples: [{ hmong: 'Nws nyob hauv tsev.', english: 'It is in the house. (more usual)' }] },
    ],
  },
  {
    // ── TXHAIS — 2026-09-30 (author: "make the secondary txhais translation its own dictionary
    // category that can be accessed, like how rau is done"). txhais is first a classifier (one of a
    // pair: ib txhais tes); its SECONDARY sense is translate / mean. The classifier card stays in
    // Classifiers; this set gathers the translation side. ⚠️ Examples are Claude's — TODO-VERIFY.
    id: 'txhais-uses',
    title: 'Txhais: Translate & Mean',
    description: 'One word, two jobs: the classifier for one of a pair, and translate / mean.',
    emoji: '💬',
    words: [
      { id: 'txhais-pattern-translate', hmongRPA: 'txhais (translate)', english: 'to translate, to interpret', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov txhais lo lus no rau kuv.', english: 'Please translate this word for me.' } },
      { id: 'txhais-pattern-txhais-lus', hmongRPA: 'txhais lus', english: 'to translate a language; to interpret', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txhais lus rau nws pog.', english: 'She interprets for her grandmother.' } },
      { id: 'txhais-pattern-kev-txhais-lus', hmongRPA: 'kev txhais lus', english: 'translation, interpreting — kev turns the verb into a noun', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev txhais lus nyuaj heev.', english: 'Translation is very hard.' } },
      { id: 'txhais-pattern-tus-txhais-lus', hmongRPA: 'tus txhais lus', english: 'a translator, an interpreter', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv niam yog ib tus txhais lus.', english: 'My mother is an interpreter.' } },
      { id: 'txhais-pattern-li-cas', hmongRPA: 'txhais li cas?', english: 'what does it mean? — asking for a meaning', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lo lus no txhais li cas?', english: 'What does this word mean?' } },
      { id: 'txhais-pattern-tau-tias', hmongRPA: 'txhais tau tias', english: 'it means that…', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: '“Zoo heev” txhais tau tias very good.', english: '“Zoo heev” means very good.' } },
      { id: 'txhais-pattern-classifier', hmongRPA: 'txhais + paired body part', english: 'the OTHER txhais — the classifier for one of a pair: a hand, arm, leg', category: 'txhais-uses', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib txhais tes.', english: 'One hand.' } },
    ],
  },
  // ⚠️ COMMENTED OUT 2026-09-30, the same day it was made (author: "don't create a separate study for it,
  // make it like tom qab or rau"). cuab is now four same-headword entries in their own categories.
  // {
  //   // ── CUAB — 2026-09-30, the author's four senses, separated "like rau is". Glosses and examples are
  //   // the author's. cov cuab yeej (tools-household) and cuab yeej tsov rog (weapons) keep their own cards.
  //   id: 'cuab-uses',
  //   title: 'Cuab: Belongings, Traps, Households & Posing',
  //   description: 'One word, four meanings — belongings, a trap, a household, and pretending.',
  //   emoji: '🪤',
  //   words: [
  //     { id: 'cuab-belongings', hmongRPA: 'cuab (belongings)', english: 'belongings, equipment, household items — see also "cov cuab yeej", tools, equipment, instruments, weapons; "cuab yeej tsov rog", weapons specifically', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-trap', hmongRPA: 'cuab (trap)', english: 'to trap, to snare — setting up a trap, or the trap itself, especially for catching animals', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-quav-qaib', hmongRPA: 'cuab quav qaib', english: 'to set up a bird trap', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-ntses', hmongRPA: 'cuab ntses', english: 'to trap or catch fish', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-household', hmongRPA: 'cuab (household)', english: 'a family line or household (noun) — in a cultural or clan context, a specific household, extended family unit or generational line', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-tsav', hmongRPA: 'cuab tsav', english: 'the head of a household; a family-line leader', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-ib-cuab-tsev', hmongRPA: 'ib cuab tsev', english: 'an entire household', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-pose', hmongRPA: 'cuab (pose)', english: 'to mimic, to pose (verb) — to position oneself or pretend, as in deception: pretending to be something one is not', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //     { id: 'cuab-boast', hmongRPA: 'cuab (boast)', english: 'to boast, to boast falsely; to show off; to pretend to be high status', category: 'cuab-uses', tags: ['grammar', 'pattern', 'reviewed'], audioFile: null },
  //   ],
  // },
  {
    // ── INTENSIFIERS — 2026-09-30, the author's list, split like the classifiers: the everyday ones
    // here, the specialised ones in Uncommon Intensifiers. Most FOLLOW what they strengthen (zoo heev).
    // Some headwords also live in other sets (heev in Grammar, tiag tiag / kawg nkaus in Describing
    // Words); these are this set's own cards.
    id: 'intensifiers',
    title: 'Common Intensifiers',
    description: 'Heev, tiag, kawg and friends — the words that make a meaning stronger, plus saying it twice.',
    emoji: '🔥',
    words: [
      { id: 'int-heev', hmongRPA: 'heev', english: 'very, very much', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zoo heev.', english: 'He/she is very good.' } },
      { id: 'int-tiag', hmongRPA: 'tiag', english: 'really, truly', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mob tiag.', english: 'I really hurt.' } },
      { id: 'int-tiag-tiag', hmongRPA: 'tiag tiag', english: 'really (stronger)', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zoo tiag tiag.', english: 'He/she is really good.' } },
      { id: 'int-kawg', hmongRPA: 'kawg', english: 'extremely, to the extreme', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Zoo kawg.', english: 'Extremely good.' } },
      { id: 'int-kawg-nkaus', hmongRPA: 'kawg nkaus', english: 'completely, absolutely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Zoo kawg nkaus.', english: 'Absolutely perfect.' } },
      { id: 'int-ua-luaj', hmongRPA: 'ua luaj', english: 'so, very much, extremely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Loj ua luaj.', english: 'So big.' } },
      { id: 'int-nkaus', hmongRPA: 'nkaus', english: 'completely, exactly, absolutely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Puv nkaus.', english: 'Completely full.' } },
      { id: 'int-li', hmongRPA: 'li', english: 'at all (negative); absolutely (positive) — "Zoo kawg li", absolutely great', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis paub li.', english: 'Don’t know at all.' } },
      { id: 'int-tas-nrho', hmongRPA: 'tas nrho', english: 'entirely, completely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Noj tas nrho.', english: 'Ate everything completely.' } },
      { id: 'int-tas-zog', hmongRPA: 'tas zog', english: 'with all your strength; non-stop; completely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Dhia tas zog.', english: 'Jump with all your might.' } },
      { id: 'int-kiag', hmongRPA: 'kiag', english: 'completely, at all; decisively, straight — "Hais kiag", say it straight', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis noj kiag.', english: 'Don’t eat at all.' } },
      { id: 'int-cia-li', hmongRPA: 'cia li', english: 'really; unexpectedly', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cia li zoo.', english: 'It really became good.' } },
      { id: 'int-zuj-zus', hmongRPA: 'zuj zus', english: 'gradually, bit by bit', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Loj zuj zus.', english: 'Growing gradually.' } },
      { id: 'int-hlo', hmongRPA: 'hlo', english: 'completely, abruptly, at all — also "hlo li": "Tsis kam hlo li", absolutely not willing', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Sawv hlo.', english: 'Stood right up.' } },
      { id: 'int-dheev', hmongRPA: 'dheev', english: 'suddenly — of the mind or perception', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nco dheev.', english: 'Suddenly remembered.' } },
      { id: 'int-nraim', hmongRPA: 'nraim', english: 'strictly, fixedly, steadily', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ncaj nraim.', english: 'Perfectly straight.' } },
      { id: 'int-ntsoov', hmongRPA: 'ntsoov', english: 'fixedly, intensely', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ntsia ntsoov.', english: 'Stare fixedly.' } },
      { id: 'int-ntsuav', hmongRPA: 'ntsuav', english: 'strengthens something bad, painful or negative', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txom nyem ntsuav.', english: 'Extremely poor, miserable.' } },
      { id: 'int-ntxhias', hmongRPA: 'ntxhias', english: 'forcefully, decidedly, really', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Vam meej ntxhias.', english: 'Prosper really well.' } },
      { id: 'int-ntau', hmongRPA: 'ntau', english: 'a lot, very much', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nyiam ntau.', english: 'Like a lot.' } },
      // ── REDUPLICATION — say the word twice to strengthen it (the author's paste). Very common in
      // speech, often more emotional than heev or kawg, and it combines: "zoo tiag tiag kawg".
      { id: 'int-pattern-reduplication', hmongRPA: 'word + word (reduplication)', english: 'say it twice to make it stronger — very + the meaning, or extra feeling', category: 'intensifiers', tags: ['intensifier', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws khiav nrawm nrawm.', english: 'He runs very fast.' } },
      { id: 'int-redup-no-no', hmongRPA: 'no no', english: 'very cold (no, cold, said twice)', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no no no.', english: 'Today is very cold.' } },
      { id: 'int-redup-nrawm-nrawm', hmongRPA: 'nrawm nrawm', english: 'very fast (nrawm, fast, said twice)', category: 'intensifiers', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws khiav nrawm nrawm.', english: 'He runs very fast.' } },
      // HELD — asked the author, not added: the paste gives "sab sab = exhausted" and "tsuag tsuag =
      // hurry up!", but the dictionary has sab = side and tsuag = pale / bland. Likely GPT errors.
      // { id: 'int-redup-sab-sab', hmongRPA: 'sab sab', english: 'exhausted' … },
      // { id: 'int-redup-tsuag-tsuag', hmongRPA: 'tsuag tsuag', english: 'hurry up!' … },
    ],
  },
  {
    // ── UNCOMMON INTENSIFIERS — 2026-09-30, the author's list. Restricted: many only follow certain
    // verbs (poob nthav, ploj ntais, tawg rhe).
    id: 'intensifiers-uncommon',
    title: 'Uncommon Intensifiers',
    description: 'Specialised intensifiers — many only work after certain verbs.',
    emoji: '✨',
    words: [
      { id: 'int-rare-lug', hmongRPA: 'lug', english: 'freely, clearly, abundantly; burning hot', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kaj siab lug.', english: 'Completely at peace.' } },
      { id: 'int-rare-nkoos', hmongRPA: 'nkoos', english: 'stooped, curled, low', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Laus nkoos.', english: 'Old and stooped over.' } },
      { id: 'int-rare-nplawg-ntia', hmongRPA: 'nplawg ntia', english: 'all together, as a crowd', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Los nplawg ntia.', english: 'Came out all together.' } },
      { id: 'int-rare-nrees', hmongRPA: 'nrees', english: 'firmly, solidly, tightly', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ruaj nrees.', english: 'Firm and solid.' } },
      { id: 'int-rare-nruj-nris', hmongRPA: 'nruj nris', english: 'nodding, the head bobbing', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsaug zog nruj nris.', english: 'Falling asleep, nodding.' } },
      { id: 'int-rare-nrho', hmongRPA: 'nrho', english: 'completely, utterly — often of separation', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tu nrho.', english: 'Completely cut off, stopped.' } },
      { id: 'int-rare-ntais', hmongRPA: 'ntais', english: 'disappearing completely; exceedingly', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ploj ntais.', english: 'Completely disappeared.' } },
      { id: 'int-rare-nthav', hmongRPA: 'nthav', english: 'suddenly — of a fall', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Poob nthav.', english: 'Suddenly fell.' } },
      { id: 'int-rare-nthawv-nthav', hmongRPA: 'nthawv nthav', english: 'a sudden change for the worse', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hloov nthawv nthav.', english: 'Suddenly changed (badly).' } },
      { id: 'int-rare-pawg-lug', hmongRPA: 'pawg lug', english: 'in a group, piled together', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nyob pawg lug.', english: 'Sitting in a group.' } },
      { id: 'int-rare-plaws', hmongRPA: 'plaws', english: 'suddenly, bursting out', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tawm plaws.', english: 'Suddenly came out.' } },
      { id: 'int-rare-pluj-plaws', hmongRPA: 'pluj plaws', english: 'vanishing suddenly', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ploj pluj plaws.', english: 'Suddenly vanished.' } },
      { id: 'int-rare-plhuav', hmongRPA: 'plhuav', english: 'completely — of falling', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Poob plhuav.', english: 'Fell completely.' } },
      { id: 'int-rare-qees', hmongRPA: 'qees', english: 'constantly, continuously — also "quj qees"', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ua qees.', english: 'Keep doing it continuously.' } },
      { id: 'int-rare-rawv', hmongRPA: 'rawv', english: 'tightly, holding firmly', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nqa rawv.', english: 'Hold tightly.' } },
      { id: 'int-rare-rhe', hmongRPA: 'rhe', english: 'completely — torn or broken', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tawg rhe.', english: 'Completely broken.' } },
      { id: 'int-rare-tawg-ntho', hmongRPA: 'tawg ntho', english: 'suddenly bursting, exploding', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tawg ntho.', english: 'Suddenly burst.' } },
      { id: 'int-rare-zoj', hmongRPA: 'zoj', english: 'carefully, thoroughly', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xav zoj.', english: 'Think carefully.' } },
      { id: 'int-rare-zom-zaws', hmongRPA: 'zom zaws', english: 'all together, in a mass', category: 'intensifiers-uncommon', tags: ['intensifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Los zom zaws.', english: 'Came in a big group.' } },
    ],
  },
  {
    // ── SO, THEN & THEREFORE — 2026-09-28, path unit u-so-then. The author: yog li, thiaj li /
    // thiaj, ces and txawm are all "so / then", extremely similar, context-based. Definitions and
    // every sentence are the author's. NOT tagged `construction`: each word must be ONE chip in
    // the builder, where the others are handed out as decoys (sentenceBuilder.js, DECOY_WORDS).
    // yog li ntawd — named by the author, not yet defined — is not here; asked.
    id: 'so-then',
    title: 'So, Then & Therefore',
    description: 'Yog li, thiaj li, ces, txawm — four ways to say “so”, told apart by context.',
    emoji: '➡️',
    words: [
      // MOVED 2026-09-28 from the yog-to-be set (u-yog), and redefined (author: yog li is a SOFT
      // reaction, not the strong therefore — that is thiaj li). Was:
      // { id: 'yog-li', hmongRPA: 'yog li', english: 'so, therefore', category: 'yog-to-be', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nag los, yog li peb nyob tsev.', english: 'It is raining, so we stay home.' } },
      { id: 'yog-li', hmongRPA: 'yog li', english: 'in that case, well then, so — a soft reaction to what was just said', category: 'so-then', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj tsis kam? Yog li ces kuv mus ib leeg.', english: 'You won’t? In that case, I’ll go alone.' }, examples: [{ hmong: 'Koj tsis kam mus? Yog li ces kuv mus ib leeg.', english: 'You don’t want to go? In that case, I’ll go alone.' }] },  // builder sentence shortened to 9 chips (the author's own "Koj tsis kam?" opener); the full sentence is in examples
      // Added 2026-09-28 (author): the fuller yog li — a soft conclusion or reaction. Builder sentence
      // shortened to 9 chips with the author's own "Koj tsis kam?" opener; the full one is in examples.
      { id: 'st-yog-li-ntawd', hmongRPA: 'yog li ntawd', english: 'in that case, if that’s so, well then, so — softly; a soft conclusion or reaction, the fuller yog li', category: 'so-then', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj tsis kam? Yog li ntawd ces kuv mus ib leeg.', english: 'You won’t? In that case, I’ll go alone.' }, examples: [{ hmong: 'Koj tsis kam mus? Yog li ntawd ces kuv mus ib leeg.', english: 'You don’t want to go? In that case, I’ll go alone.' }] },
      { id: 'st-thiaj-li', hmongRPA: 'thiaj li', english: 'therefore, that’s why, as a result — a clear cause and effect; the fuller form of thiaj', category: 'so-then', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws pab kuv, kuv thiaj li ua tau.', english: 'He helped me, that’s why I was able to do it.' } },
      { id: 'st-thiaj', hmongRPA: 'thiaj', english: 'therefore, that’s why, so — the short, everyday form of thiaj li', category: 'so-then', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis muaj nyiaj, kuv thiaj tsis mus.', english: 'I didn’t have money, so I didn’t go.' }, moreExamples: [{ hmong: 'Nws pab kuv, kuv thiaj ua tau.', english: 'He helped me, that’s why I was able to do it.' }] },
      { id: 'st-yog-ces', hmongRPA: 'yog … ces', english: 'if … then — ces joins things in order; not a strong therefore', category: 'so-then', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog koj mus ces kuv mus thiab.', english: 'If you go, then I’ll go too.' } },
      { id: 'st-txawm', hmongRPA: 'txawm', english: 'so, and then — with a mild surprise, or a quick reaction', category: 'so-then', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws hais li ntawd, kuv txawm chim siab.', english: 'He said that, so I got upset.' } },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    description: 'One through ten — the base every larger number builds on.',
    emoji: '🔢',
words: [
      { id: 'numbers-1', hmongRPA: 'ib', english: 'one', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-ib.mp3', exampleSentence: { hmong: 'Ib tus aub.', english: 'One dog.' } },
      { id: 'numbers-2', hmongRPA: 'ob', english: 'two', senses: [{ en: 'two', context: 'numbers' }, { en: 'both; the two — "nkawd ob leeg"', context: 'reading' }], category: 'numbers', tags: ['number', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-ob.mp3', exampleSentence: { hmong: 'Ob tus miv.', english: 'Two cats.' } },
      { id: 'numbers-3', hmongRPA: 'peb', english: 'three', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-peb.mp3', exampleSentence: { hmong: 'Peb tus menyuam.', english: 'Three children.' } },
      { id: 'numbers-4', hmongRPA: 'plaub', english: 'four', senses: [{ en: 'four', context: 'numbers' }, { en: 'hair', context: 'body', note: 'especially "plaub hau"' }], category: 'numbers', tags: ['number', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-plaub.mp3', exampleSentence: { hmong: 'Plaub tus noog.', english: 'Four birds.' } },
      { id: 'numbers-5', hmongRPA: 'tsib', english: 'five', category: 'numbers', tags: ['number', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-tsib.mp3', exampleSentence: { hmong: 'Tsib phau ntawv.', english: 'Five books.' } },
      { id: 'numbers-6', hmongRPA: 'rau', english: 'six', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-rau.mp3', exampleSentence: { hmong: 'Rau hnub.', english: 'Six days.' } },
      { id: 'numbers-7', hmongRPA: 'xya', english: 'seven', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-xya.mp3', exampleSentence: { hmong: 'Xya lub hlis.', english: 'Seven months.' } },
      { id: 'numbers-8', hmongRPA: 'yim', english: 'eight', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-yim.mp3', exampleSentence: { hmong: 'Yim teev.', english: 'Eight o\'clock.' } },
      { id: 'numbers-9', hmongRPA: 'cuaj', english: 'nine', category: 'numbers', tags: ['number', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-cuaj.mp3', exampleSentence: { hmong: 'Cuaj lub rooj.', english: 'Nine tables.' } },
      { id: 'numbers-10', hmongRPA: 'kaum', english: 'ten', senses: [{ en: 'ten', context: 'numbers' }, { en: 'forms the teens: “kaum peb” thirteen, “kaum plaub” fourteen', context: 'reading' }, { en: '⚠ not “nkaum”, which means to hide', context: 'reading' }], category: 'numbers', tags: ['number', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-kaum.mp3', exampleSentence: { hmong: 'Kaum ib.', english: 'Eleven.' } },

      // Compounds, from the commented-out `phr-nees-nkaum` and respelled solid:
      // "neesnkaum plaub" = twenty-four, "neesnkaum cuaj" = twenty-nine.
      { id: 'numbers-20', hmongRPA: 'neesnkaum', english: 'twenty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-neesnkaum.mp3', exampleSentence: { hmong: 'Neesnkaum xyoo.', english: 'Twenty years.' } },
      { id: 'numbers-30', hmongRPA: 'pebcaug', english: 'thirty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-pebcaug.mp3', exampleSentence: { hmong: 'Pebcaug hnub.', english: 'Thirty days.' } },
      { id: 'numbers-40', hmongRPA: 'plaubcaug', english: 'forty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-plaubcaug.mp3', exampleSentence: { hmong: 'Plaubcaug feeb.', english: 'Forty minutes.' } },
      { id: 'numbers-50', hmongRPA: 'tsibcaug', english: 'fifty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-tsibcaug.mp3', exampleSentence: { hmong: 'Tsibcaug mais.', english: 'Fifty miles.' } },
      { id: 'numbers-60', hmongRPA: 'raucaum', english: 'sixty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-raucaum.mp3', exampleSentence: { hmong: 'Raucaum tus tub.', english: 'Sixty students.' } },
      { id: 'numbers-70', hmongRPA: 'xyacaum', english: 'seventy', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-xyacaum.mp3', exampleSentence: { hmong: 'Xyacaum las.', english: 'Seventy dollars.' } },
      { id: 'numbers-80', hmongRPA: 'yimcaum', english: 'eighty', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-yimcaum.mp3', exampleSentence: { hmong: 'Yimcaum kg.', english: 'Eighty kilograms.' } },
      { id: 'numbers-90', hmongRPA: 'cuajcaum', english: 'ninety', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-cuajcaum.mp3', exampleSentence: { hmong: 'Cuajcaum feem.', english: 'Ninety percent.' } },

      { id: 'numbers-100', hmongRPA: 'ib puas', english: 'one hundred', category: 'numbers', tags: ['number'], audioFile: 'vocabulary/numbers/hmong-numbers-ib-puas.mp3', exampleSentence: { hmong: 'Ib puas tus neeg.', english: 'One hundred people.' } },
      { id: 'numbers-puas', hmongRPA: 'puas', english: 'hundred', senses: [{ en: 'hundred', context: 'numbers' }, { en: 'yes/no question marker', context: 'grammar', note: 'before the verb: "Koj puas yog Hmoob?"' }, { en: 'whether', context: 'grammar', note: 'in an embedded question' }], category: 'numbers', tags: ['number', 'multiplier', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-puas.mp3', exampleSentence: { hmong: 'Ob puas.', english: 'Two hundred.' } },
      { id: 'numbers-txhiab', hmongRPA: 'txhiab', english: 'thousand', category: 'numbers', tags: ['number', 'multiplier', 'reviewed'], audioFile: 'vocabulary/numbers/hmong-numbers-txhiab.mp3', exampleSentence: { hmong: 'Ib txhiab.', english: 'One thousand.' } },
      { id: 'numbers-vam', hmongRPA: 'vam', english: 'ten thousand', category: 'numbers', tags: ['number', 'multiplier'], audioFile: 'vocabulary/numbers/hmong-numbers-vam.mp3', exampleSentence: { hmong: 'Ib vam.', english: 'Ten thousand.' } },
      { id: 'numbers-plhom', hmongRPA: 'plhom', english: 'million', category: 'numbers', tags: ['number', 'multiplier'], audioFile: 'vocabulary/numbers/hmong-numbers-plhom.mp3', exampleSentence: { hmong: 'Ib plhom.', english: 'One million.' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'numbers-tus-lej', hmongRPA: 'tus lej', english: 'a number — with its classifier, like "tus nqi": "tus lej rooj zaum", the seat number', category: 'numbers', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv saib daim pib ntawd, thiab kuv pom tus lej 13 ntawm nws.', english: 'I looked at that ticket, and I saw the number 13 on it.' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'numbers-lej', hmongRPA: 'lej', english: 'number; math — "tus lej", a number; "kawm lej", to study math', category: 'numbers', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv saib daim pib ntawd, thiab kuv pom tus lej 13 ntawm nws.', english: 'I looked at that ticket, and I saw the number 13 on it.' } },
    ],
  },
  {
    id: 'tense-markers',
    title: 'Tense Markers',
    description: 'The small words that place a verb in time — Hmong never conjugates.',
    emoji: '⏳',
    words: [
      // english was 'currently (-ing)' — reworded 2026-09-26 (author: tab tom means currently
      // doing something, present — "I am eating"). time-context-tabtom-present matches it word
      // for word, so the dictionary shows ONE "right now" definition.
      { id: 'tense-markers-progressive', hmongRPA: 'tab tom', english: 'right now, currently — the action is happening at this moment (am / is / are …-ing)', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tabtom.mp3', exampleSentence: { hmong: 'Kuv tab tom noj.', english: 'I am eating.' } },
      { id: 'tense-markers-future', hmongRPA: 'yuav', english: 'going to, will — the softer future, and the most common',  /* was 'going to, will — the everyday future' (2026-09-26); the author's nuance 2026-09-28 */ category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-yuav.mp3', exampleSentence: { hmong: 'Kuv yuav noj.', english: 'I will eat.' } },
      // ⚠️ TAU REWRITTEN 2026-09-26 (author: "update tau", with a pasted explanation).
      // One card, every sense. `english` stays the in-deck gloss (a Tense Markers card
      // asks about completion only); the other senses are tagged 'reading', so they show
      // on a tap and on the word page but never leak onto this deck's flashcards
      // (src/lib/senses.js). Pin a sense in a story with 'tense-markers-past@n'.
      // ✅ SETTLED 2026-09-27 — NOT a sense (GPT fact-check, high): preverbal tau marks
      // attainment, not obligation. "You must go" = Koj yuav tsum mus (yuav tau in some usage).
      // Do not restore. The original hold:
      // ⚠️ HELD: "6. must / need to — Koj tau mus" from the same paste. The source
      // itself hedged it ("in some contexts, with the right construction"), and "must" is
      // normally "yuav tsum". RESTORE as a sense only after a native speaker confirms:
      //   { en: 'must, have to — in some constructions: "Koj tau mus"', context: 'reading' },
      // Was:
      // { id: 'tense-markers-past', hmongRPA: 'tau', english: 'already (past completed)', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tau.mp3', exampleSentence: { hmong: 'Kuv tau noj.', english: 'I have eaten.' } },
      { id: 'tense-markers-past', hmongRPA: 'tau', english: 'attained, reached: the action came about (tau before the verb) — an aspect marker, often translated did, have done — "Kuv tau mus", I went',  /* was 'did, have done: the action is attained (tau before the verb) — …' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual) */ category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tau.mp3', exampleSentence: { hmong: 'Kuv tau noj.', english: 'I have eaten.' },
        senses: [
          { en: 'attained, reached: the action came about (tau before the verb) — an aspect marker, often translated did, have done', context: 'tense-markers', note: '"Kuv tau mus", I went' },  // was en: 'did, have done: the action is attained (tau before the verb)' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
          { en: 'to get, to receive', context: 'reading', note: '"Kuv tau nyiaj", I got money' },
          // ⚠️ REMOVED 2026-09-26 — WRONG (author's third paste): "tau + verb" is
          // completed ("Kuv tau mus" = I went); "can / managed to" is "verb + tau",
          // which is the last sense below. This came from the first paste's table.
          // ⚠️ Removing it RENUMBERED the senses after it: @4 → @3 etc. The one pin
          // that used @4 (movie story) was moved to @3. check-sense-pins cannot see
          // a pin that still "exists" but now names a different sense — grep for
          // 'tense-markers-past@' before removing another sense.
          // { en: 'can, be able to', context: 'reading', note: 'BEFORE the verb: "Kuv tau mus", I can go (the same words can also mean "I went")' },
          { en: 'for a timeframe (with lawm)', context: 'reading', note: '"Kuv nyob ntawm no tau peb hnub lawm", I have been here for three days' },
          { en: 'to get to, to have the chance to', context: 'reading', note: '"Kuv tau ntsib nws naghmo", I got to meet him yesterday' },
    // Sense 6 added 2026-09-26 from the author's second paste. APPENDED, not
    // inserted, so existing pins (@1…@5) keep their numbers. ⚠️ Worded so the
    // dictionary does NOT fold it into another "can" gloss: sameMeaning
    // would merge a gloss whose items contain {can, be able to}.
    { en: 'can, be able to (tau after the verb)', context: 'reading', note: '"Kuv mus tau", I can go; in a past context, I was able to go' },
    // Sense 6, appended 2026-09-26 (fact-check): V + tau also has a separate
    // ACCOMPLISHMENT reading besides the modal one. Appended, so pins keep their numbers.
    { en: 'managed to, succeeded in (after some verbs) — rare, extremely context-based', context: 'reading', note: '"Naghmo, txawm nws nyuaj heev los kuv ua tau", yesterday, even though it was very hard, I managed to do it — only with context like this; bare "Kuv ua tau" is I can do it' },  // was note: '"Kuv ua tau", I managed to do it — …' (context added 2026-09-29, author: bare verb + tau reads as can)  /* 'rare, extremely context-based' added 2026-09-29 (author) */  // was note: '"Kuv noj tau", I ate it successfully …' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)  // Was note: '"Nws kawm tau", he learned it successfully' (author 2026-09-29: use Kuv noj tau)
        ] },
      { id: 'tense-markers-still', hmongRPA: 'tseem', english: 'still — the action has not stopped yet',  /* was 'still', 2026-09-26 */ category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tseem.mp3', exampleSentence: { hmong: 'Kuv tseem noj.', english: 'I am still eating.' } },
      { id: 'tense-markers-completed', hmongRPA: 'lawm', english: 'already; now — marks a change or newly relevant state', senses: [{ en: 'already; now — marks a change or newly relevant state', context: 'tense-markers' }, { en: 'finished; completed', context: 'reading' }], category: 'tense-markers', tags: ['particle', 'aspect', 'reviewed'], audioFile: 'grammar/tense-markers/hmong-tense-markers-lawm.mp3', exampleSentence: { hmong: 'Kuv noj lawm.', english: 'I ate already.' } },
      // ── TENSE PATTERNS — 2026-09-28, the author: "write the flashcards with everything verb
      // wise like tagkis + sentence, yuav + verb". One card per tense form, all with noj mov.
      // Sentences are the author's, except the past-continuous ending (Claude's, source 'ai').
      { id: 'tense-pattern-naghmo', hmongRPA: 'naghmo + sentence', english: 'past — yesterday sets the time; the verb stays plain', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Naghmo, kuv noj mov ntawm tsev.', english: 'Yesterday, I ate at home.' } },
      { id: 'tense-pattern-tau-verb', hmongRPA: 'tau + verb (past)', english: 'past — completed; often not needed, and used to set up more of the story', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tau noj ntawm tsev.', english: 'I ate at home.' } },
      { id: 'tense-pattern-past-continuous', hmongRPA: 'thaum + tab tom + verb', english: 'past continuous — was …-ing; a time word puts tab tom in the past', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Naghmo thaum kuv tab tom noj mov, kuv niam hu xov tooj tuaj.', english: 'Yesterday, while I was eating, my mom called.', source: 'ai' } },
      { id: 'tense-pattern-present', hmongRPA: 'subject + verb', english: 'present — a plain verb', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj mov.', english: 'I eat.' } },
      { id: 'tense-pattern-twb-lawm', hmongRPA: 'twb + verb + lawm', english: 'present perfect — already: whether you have done it or not', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv twb noj mov lawm.', english: 'I already ate.' } },
      { id: 'tense-pattern-tab-tom', hmongRPA: 'tab tom + verb', english: 'present continuous — am / is / are …-ing, currently', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tab tom noj mov.', english: 'I am eating.' } },
      { id: 'tense-pattern-tagkis', hmongRPA: 'tagkis + sentence', english: 'future — tomorrow sets the time; the verb stays plain', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tagkis, kuv noj mov.', english: 'Tomorrow I eat.' } },
      { id: 'tense-pattern-yuav', hmongRPA: 'yuav + verb', english: 'future — going to, will; the softer, most common future', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav noj mov.', english: 'I am going to eat.' } },
      { id: 'tense-pattern-mam-li', hmongRPA: 'mam li + verb', english: 'future — will, for sure: planned, determined, actually going to happen', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mam li noj mov.', english: 'I will eat.' } },
      { id: 'tense-pattern-tab-tom-yuav', hmongRPA: 'tab tom yuav + verb', english: 'future progressive — about to', category: 'tense-markers', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tab tom yuav noj mov.', english: 'I am about to eat.' } },
    ],
  },
  {
    id: 'demonstratives',
    title: 'Demonstratives',
    description: 'This, that, here, there — the pointing words. They follow the noun.',
    emoji: '👉',
    words: [
      { id: 'demonstratives-this', hmongRPA: 'no', english: 'this; these — right here, the one in focus', senses: [{ en: 'this; these — right here, the one in focus', context: 'demonstratives' }, { en: 'here; now; this point', context: 'reading' }], category: 'demonstratives', tags: ['demonstrative', 'reviewed'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-no.mp3', exampleSentence: { hmong: 'Lub tsev no.', english: 'This house.' } },
      { id: 'demonstratives-that', hmongRPA: 'ntawd', english: 'that; those — over there, at a distance', senses: [{ en: 'that; those — over there, at a distance', context: 'demonstratives' }, { en: 'that one; the aforementioned one', context: 'reading' }], category: 'demonstratives', tags: ['demonstrative', 'reviewed'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawd.mp3', exampleSentence: { hmong: 'Tus ntawd yog leej twg?', english: 'Who is that?', source: 'ai' } },
      { id: 'demonstratives-that-near-you', hmongRPA: 'ko', english: 'that; those — near or next to something or someone', category: 'demonstratives', tags: ['demonstrative'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ko.mp3', exampleSentence: { hmong: 'Koj muab phau ntawv ko rau kuv.', english: 'Give me that book near you.', source: 'ai' } }, // TODO-VERIFY: "ko" vs "ntawd" nuance
      { id: 'demonstratives-here', hmongRPA: 'ntawm no', english: 'here', category: 'demonstratives', tags: ['demonstrative', 'location'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-no.mp3', exampleSentence: { hmong: 'Koj nyob ntawm no puas tau?', english: 'Can you stay here?', source: 'ai' } },
      { id: 'demonstratives-there', hmongRPA: 'ntawm ntawd', english: 'there', category: 'demonstratives', tags: ['demonstrative', 'location'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-ntawd.mp3', exampleSentence: { hmong: 'Nws nyob ntawm ntawd tos peb.', english: 'He is there waiting for us.', source: 'ai' } },
      // ── Added 2026-09-27 (author: qhov no "can be used by itself when the noun is
      // understood from context" — pasted explanation). qhov is in the dictionary as
      // place / thing / matter. ⚠️ HELD from the paste: "qhov tsev no = this house" —
      // the app's classifier for a house is lub (lub tsev no); asked the author.
      { id: 'dem-qhov-no', hmongRPA: 'qhov no', english: 'this, this one, this thing — when the noun is understood', category: 'demonstratives', tags: ['demonstrative', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xav tau qhov no.', english: 'I want this one.' }, examples: [{ hmong: 'Qhov no zoo.', english: 'This one is good.' }, { hmong: 'Kuv xav tau qhov no.', english: 'I want this one.' }] },
      { id: 'dem-qhov-ntawd', hmongRPA: 'qhov ntawd', english: 'that, that one, that matter — when the noun is understood', category: 'demonstratives', tags: ['demonstrative', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yaj, vim li cas koj ho nug wb txog qhov ntawd?', english: 'Yaj, why did you ask us about that?' } },
      { id: 'dem-pattern-classifier-noun-no', hmongRPA: 'classifier + noun + no', english: 'this [noun] — the classifier first, the pointing word last', category: 'demonstratives', tags: ['demonstrative', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no.', english: 'This house.' }, examples: [{ hmong: 'lub tsev no', english: 'this house' }, { hmong: 'tus aub no', english: 'this dog' }, { hmong: 'daim pib ko', english: 'that ticket (by you)' }] },
      { id: 'dem-pattern-qhov-noun-no', hmongRPA: 'qhov + noun + no', english: 'this [place / matter] — qhov as the classifier for places and matters', category: 'demonstratives', tags: ['demonstrative', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no zoo.', english: 'This one is good.' }, examples: [{ hmong: 'qhov chaw no', english: 'this place' }, { hmong: 'qhov teeb meem no', english: 'this problem' }] },
      // Classifiers as pronouns — 2026-09-27, the author: a classifier "can take the place of
      // the noun itself and precede a demonstrative, becoming a pronoun". Their examples.
      { id: 'dem-pattern-classifier-no', hmongRPA: 'classifier + no / ko / ntawd', english: 'this one / that one — the classifier stands in for the noun', category: 'demonstratives', tags: ['demonstrative', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau no yog kuv phau ntawv.', english: 'This one is my book.' }, examples: [{ hmong: 'phau no', english: 'this one (a book)' }, { hmong: 'lub ntawd', english: 'that one (a flower, over there)' }, { hmong: 'cov ko', english: 'those ones (near someone)' }] },
    ],
  },
  {
    // ── POSSESSION — 2026-09-27, the author's rules and examples ("this should be its own
    // lesson and path"): li is the general possessive (pronoun + li = mine, for any noun);
    // pronoun + classifier with no noun is a possessive pronoun (kuv phau = mine); keep
    // the noun and it is an ordinary possessive (kuv phau ntawv = my book) — the long way,
    // which is what is most commonly written. Classifiers also work like "the". Backs path
    // unit u-possession and the lesson foundations-possessive-pronouns.
    id: 'possession',
    title: 'Mine & Yours',
    description: 'Kuv li, kuv phau, kuv phau ntawv — saying whose it is.',
    emoji: '🤲',
    words: [
      { id: 'poss-li', hmongRPA: 'li', english: 'possessive: mine, yours, his… — pronoun + li, for any noun', category: 'possession', tags: ['possession', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv yog kuv li.', english: 'The book is mine.' } },
      { id: 'poss-pattern-pronoun-li', hmongRPA: 'pronoun + li', english: 'mine, yours, his… — li stands in for classifier + noun; it fits any noun', category: 'possession', tags: ['possession', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv yog kuv li.', english: 'The book is mine.' }, examples: [{ hmong: 'kuv li', english: 'mine' }, { hmong: 'koj li', english: 'yours' }, { hmong: 'nws li', english: 'his / hers / its' }, { hmong: 'peb li', english: 'ours' }] },
      { id: 'poss-pattern-pronoun-classifier', hmongRPA: 'pronoun + classifier', english: 'mine, yours… — the noun\'s own classifier stands in for the noun', category: 'possession', tags: ['possession', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv yog kuv phau.', english: 'The book is mine.' }, examples: [{ hmong: 'kuv phau', english: 'mine (a book)' }, { hmong: 'kuv tus', english: 'mine (an animal, a person)' }, { hmong: 'kuv lub', english: 'mine (a round or solid thing)' }] },
      { id: 'poss-pattern-pronoun-classifier-noun', hmongRPA: 'pronoun + classifier + noun', english: 'my [noun] — the long way, and the most common in writing', category: 'possession', tags: ['possession', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau no yog kuv phau ntawv.', english: 'This one is my book.' }, examples: [{ hmong: 'kuv phau ntawv', english: 'my book' }, { hmong: 'kuv tus miv', english: 'my cat' }, { hmong: 'nws lub paj', english: 'his / her flower' }] },
      { id: 'poss-pattern-classifier-the', hmongRPA: 'classifier + noun', english: 'the [noun] — a classifier works like "the"', category: 'possession', tags: ['possession', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv no yog kuv phau ntawv.', english: 'This book is my book.' }, examples: [{ hmong: 'phau ntawv', english: 'the book' }, { hmong: 'tus miv', english: 'the cat' }, { hmong: 'lub paj', english: 'the flower' }] },
      { id: 'poss-kuv-tus-miv', hmongRPA: 'kuv tus miv', english: 'my cat (pronoun + classifier + noun)', category: 'possession', tags: ['possession', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntawd yog kuv tus miv.', english: 'That one is my cat.' } },
      { id: 'poss-kuv-cov-khoom', hmongRPA: 'kuv cov khoom', english: 'my things (cov for a group)', category: 'possession', tags: ['possession', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov no yog kuv cov khoom.', english: 'These are my things.' } },
      { id: 'poss-nws-lub-paj', hmongRPA: 'nws lub paj', english: 'his / her / its flower', category: 'possession', tags: ['possession', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntawd yog nws lub paj.', english: 'That one is his flower.' } },
    ],
  },
  {
    // ── DESCRIBING WORDS — 2026-09-27, path unit u-adjectives. The author: in Hmong the
    // noun comes first and the adjective after it (neeg zoo, a good person); an adjective
    // in front is rare and turns it into a title (tus laus neeg, the elder, vs neeg laus,
    // an old person). The rest from the GPT pass (tus dev → tus aub). Pattern cards.
    id: 'adjective-grammar',
    title: 'Describing Words',
    description: 'Noun first, then the adjective — and very, too, more, most.',
    emoji: '🎨',
    words: [
      { id: 'adj-pattern-noun-adj', hmongRPA: 'noun + adjective', english: 'the adjective comes AFTER the noun — neeg zoo, a good person', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog tus neeg hluas.', english: 'He is a young person.' }, examples: [{ hmong: 'neeg zoo', english: 'a good person' }, { hmong: 'tsev loj', english: 'a big house' }, { hmong: 'neeg hluas', english: 'a young person' }] },
      { id: 'adj-pattern-adj-noun-title', hmongRPA: 'adjective + noun (a title)', english: 'rare — the adjective first turns it into a title', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv niamtais yog tus laus neeg.', english: 'My grandmother is the elder.' }, examples: [{ hmong: 'tus laus neeg', english: 'the elder (a title)' }, { hmong: 'tus neeg laus', english: 'an old person' }] },
      { id: 'adj-pattern-no-yog', hmongRPA: 'noun + adjective, no yog', english: 'the adjective is the verb itself — no yog in front'  /* restored 2026-09-28 (author); was briefly 'no yog needed' */, category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no loj.', english: 'This house is big.' }, examples: [{ hmong: 'Hnub no kub heev.', english: 'It is very hot today.' }, { hmong: 'Tus aub ntawd me.', english: 'That dog is small.' }] },
      { id: 'adj-pattern-full-phrase', hmongRPA: 'classifier + noun + adjective + no', english: 'this big house — the pointing word still comes last', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam lub tsheb tshiab no.', english: 'I like this new car.' }, examples: [{ hmong: 'lub tsev loj no', english: 'this big house' }, { hmong: 'tus aub me ntawd', english: 'that small dog' }, { hmong: 'phau ntawv tshiab no', english: 'this new book' }] },
      { id: 'adj-pattern-heev', hmongRPA: 'adjective + heev', english: 'very — heev comes after the adjective', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no loj heev.', english: 'This house is very big.' } },
      { id: 'adj-pattern-kawg', hmongRPA: 'adjective + kawg / kawg nkaus', english: 'extremely — kawg nkaus is stronger still', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no loj kawg.', english: 'This house is extremely big.' }, examples: [{ hmong: 'loj kawg', english: 'extremely big' }, { hmong: 'loj kawg nkaus', english: 'as big as can be' }] },
      { id: 'adj-pattern-tiag', hmongRPA: 'adjective + tiag tiag', english: 'really, truly', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zoo tiag tiag.', english: 'It is really good.' } },
      { id: 'adj-pattern-dhau', hmongRPA: 'adjective + dhau', english: 'too — more than is wanted', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kas fes kub dhau.', english: 'The coffee is too hot.' }, examples: [{ hmong: 'kub dhau', english: 'too hot' }, { hmong: 'hnyav dhau', english: 'too heavy' }, { hmong: 'nrov dhau', english: 'too loud' }] },
      { id: 'adj-pattern-dua', hmongRPA: 'adjective + dua', english: 'more, -er — and "than" with what follows', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus noog no loj dua tus ntawd.', english: 'This bird is bigger than that one.' }, examples: [{ hmong: 'loj dua', english: 'bigger' }, { hmong: 'zoo dua', english: 'better' }] },
      { id: 'adj-pattern-tshaj', hmongRPA: 'adjective + tshaj', english: 'most, -est', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus noog no loj tshaj.', english: 'This bird is the biggest.' } },
      { id: 'adj-pattern-double', hmongRPA: 'adjective doubled', english: 'extra strong — liab liab, very red (not every adjective)', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub paj no liab liab.', english: 'This flower is very red.' } },
      { id: 'adj-pattern-tsis', hmongRPA: 'tsis + adjective', english: 'not — tsis goes right before the adjective', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no tsis loj.', english: 'This house is not big.' } },
      { id: 'adj-pattern-puas', hmongRPA: 'puas + adjective', english: 'is it…? — puas goes right before the adjective', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no puas kub?', english: 'Is it hot today?' } },
      { id: 'adj-pattern-siab', hmongRPA: 'adjective + siab (a feeling)', english: 'feelings built on siab (heart) — and siab zoo means kind', category: 'adjective-grammar', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv zoo siab heev.', english: 'I am very happy.' }, examples: [{ hmong: 'zoo siab', english: 'happy' }, { hmong: 'nyuaj siab', english: 'sad, troubled' }, { hmong: 'chim siab', english: 'upset, angry' }, { hmong: 'siab zoo', english: 'kind (the order changes it)' }] },
      { id: 'adj-tiag-tiag', hmongRPA: 'tiag tiag', english: 'really, truly — after the adjective', category: 'adjective-grammar', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zoo tiag tiag.', english: 'It is really good.' } },
      { id: 'adj-kawg-nkaus', hmongRPA: 'kawg nkaus', english: 'extremely, as … as can be — after the adjective', category: 'adjective-grammar', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev no loj kawg nkaus.', english: 'This house is as big as can be.' } },
    ],
  },
  {
    id: 'reciprocals',
    title: 'Sib — Reciprocals',
    description: 'Verbs made mutual with "sib" — things people do to each other.',
    emoji: '🤝',
    words: [
      { id: 'reciprocals-love', hmongRPA: 'sib hlub', english: 'to love each other', category: 'reciprocals', tags: ['verb', 'reciprocal'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-hlub.mp3', exampleSentence: { hmong: 'Nkawd sib hlub.', english: 'The two of them love each other.' } },
      { id: 'reciprocals-help', hmongRPA: 'sib pab', english: 'to help each other', category: 'reciprocals', tags: ['verb', 'reciprocal'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-pab.mp3', exampleSentence: { hmong: 'Peb yuav tsum sib pab.', english: 'We should help each other.', source: 'ai' } },
      { id: 'reciprocals-fight', hmongRPA: 'sib ntaus', english: 'to fight each other', category: 'reciprocals', tags: ['verb', 'reciprocal'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-ntaus.mp3', exampleSentence: { hmong: 'Ob tus tub sib ntaus ntawm tsev kawm ntawv.', english: 'Two boys fight each other at school.', source: 'ai' } },
      { id: 'reciprocals-talk', hmongRPA: 'sib tham', english: 'to talk with each other', category: 'reciprocals', tags: ['verb', 'reciprocal'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-tham.mp3', exampleSentence: { hmong: 'Peb zaum sib tham tom qab noj mov.', english: 'We sit and talk with each other after eating.', source: 'ai' } },
      { id: 'reciprocals-see', hmongRPA: 'sib pom', english: 'to see each other', category: 'reciprocals', tags: ['verb', 'reciprocal'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-pom.mp3', exampleSentence: { hmong: 'Peb sib pom txhua hnub tom haujlwm.', english: 'We see each other every day at work.', source: 'ai' } },
      { id: 'reciprocals-meet-again', hmongRPA: 'sib ntsib dua', english: 'to meet again (goodbye)', category: 'reciprocals', tags: ['verb', 'reciprocal', 'greeting'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-ntsib-dua.mp3', exampleSentence: { hmong: 'Peb yuav sib ntsib dua tagkis.', english: 'We will meet again tomorrow.', source: 'ai' } },
    ],
  },
  {
    id: 'greetings',
    title: 'Greetings & Farewells',
    description: 'Hello, goodbye, thank you, and asking how someone is.',
    emoji: '👋',
    words: [
      // Promoted out of the greetings-farewells LESSON, where these lived only
      // as `examples` items — so they had recordings but could never be drilled
      // or quizzed (the gap in notes/56). Glosses and notes are the lesson's
      // own, verbatim; nothing here was newly authored.
      // ONE entry, not two, even though the lesson lists "Nyob zoo" twice. The
      // same string with two glosses would put two correct answers in the same
      // quiz — the duplicate-answer bug from notes/51. The lesson teaches the
      // dual sense; the word bank drills the word.
      { id: 'greetings-hello', hmongRPA: 'nyob zoo', english: 'hello / stay well', category: 'greetings', tags: ['greeting', 'farewell', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-nyob-zoo.mp3', exampleSentence: { hmong: 'Nyob zoo, koj puas nyob zoo?', english: 'Hello, how are you?' } },
      { id: 'greetings-how-are-you', hmongRPA: 'koj puas nyob zoo?', english: 'how are you?', category: 'greetings', tags: ['greeting', 'question', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-koj-puas-nyob-zoo.mp3' },
      { id: 'greetings-i-am-well', hmongRPA: 'kuv nyob zoo', english: 'I am well', category: 'greetings', tags: ['greeting', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-kuv-nyob-zoo.mp3' },
      { id: 'greetings-thank-you', hmongRPA: 'ua tsaug', english: 'thank you', category: 'greetings', tags: ['courtesy', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-ua-tsaug.mp3' },
      { id: 'greetings-goodbye', hmongRPA: 'sib ntsib dua', english: 'see you again / goodbye', category: 'greetings', tags: ['farewell', 'phrase', 'reciprocal'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-sib-ntsib-dua.mp3' },
      { id: 'greetings-go-well', hmongRPA: 'mus zoo', english: 'go well (said to the one leaving)', category: 'greetings', tags: ['farewell', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-mus-zoo.mp3' },
      // ⚠️ ADDED 2026-09-12 — the four phrases the Speak lessons gained when
      // their recordings landed. Same principle as the block above: a phrase
      // that is taught and recorded should be drillable, not lesson-only.
      { id: 'greetings-nice-to-meet-you', hmongRPA: 'zoo siab ntsib koj', english: 'nice to meet you', category: 'greetings', tags: ['greeting', 'phrase'], audioFile: 'lessons/greetings/zoo-siab-ntsib-koj.wav' },
      { id: 'greetings-you-are-well', hmongRPA: 'koj nyob zoo', english: 'you are well / hello to you', category: 'greetings', tags: ['greeting', 'phrase'], audioFile: 'lessons/greetings/koj-nyob-zoo.wav' },
      { id: 'greetings-take-care', hmongRPA: 'saib xyuas', english: 'take care', category: 'greetings', tags: ['farewell', 'phrase'], audioFile: 'lessons/farewells/saib-xyuas.wav' },
      { id: 'greetings-see-you-soon', hmongRPA: 'pom koj sai sai no', english: 'see you soon', category: 'greetings', tags: ['farewell', 'phrase'], audioFile: 'lessons/farewells/pom-koj-sai-sai-no.wav' },
    ],
  },
  {
    id: 'yog-to-be',
    title: 'Yog — To Be',
    description: 'Linking one noun to another. Not used before adjectives.',
    emoji: '🟰',
    words: [
      { id: 'yog-to-be-is', hmongRPA: 'yog', english: 'is, am, are — what something is; at the start of a clause it means if',  /* was 'to be / equals' — the author: yog can mean if, is, are by context, 2026-09-27 */ category: 'yog-to-be', tags: ['verb', 'copula'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-yog.mp3', exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      // The three conjugated forms the lesson actually teaches. They were only
      // in the lesson's `examples` step, so the word bank drilled a set the
      // learner had never been shown — see notes/56.
      { id: 'yog-to-be-i-am', hmongRPA: 'kuv yog', english: 'I am', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      { id: 'yog-to-be-you-are', hmongRPA: 'koj yog', english: 'you are', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', exampleSentence: { hmong: 'Koj yog kuv tus phooj ywg.', english: 'You are my friend.', source: 'ai' } },
      { id: 'yog-to-be-he-she-is', hmongRPA: 'nws yog', english: 'he / she is', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', exampleSentence: { hmong: 'Nws yog kuv tus muam.', english: 'She is my sister.', source: 'ai' } },
      { id: 'yog-to-be-is-not', hmongRPA: 'tsis yog', english: 'is not / no', category: 'yog-to-be', tags: ['verb', 'copula', 'negation'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', exampleSentence: { hmong: 'Nws tsis yog kuv tus kwv.', english: 'He is not my younger brother.', source: 'ai' } },
      { id: 'yog-to-be-question', hmongRPA: 'puas yog?', english: 'is it? / right?', category: 'yog-to-be', tags: ['verb', 'copula', 'question'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3' },
      // moreExamples added 2026-09-28 — u-nyob needs five sentences to drill. From the Nyob lesson; Claude's, TODO-VERIFY.
      { id: 'yog-to-be-located', hmongRPA: 'nyob', english: 'be located; live; stay', senses: [{ en: 'be located; live; stay', context: 'yog-to-be' }, { en: 'remain; continue to be', context: 'reading' }, { en: 'be alive — in "ua neej nyob"', context: 'reading' }], category: 'yog-to-be', tags: ['verb', 'location', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.' }, moreExamples: [{ hmong: 'Kuv nyob hauv lub nroog no.', english: 'I live in this city.', source: 'ai' }, { hmong: 'Nws nyob tom khw.', english: 'She is at the market.', source: 'ai' }] },
      // ── Added 2026-09-27 for path unit u-yog (To Be: Yog & Nyob). The author: yog is
      // the essence (a lasting state), nyob the condition — location, a physical state
      // ("kuv nyob kub", never "kuv kub"), and optionally emotions ("kuv zoo siab" =
      // "kuv nyob zoo siab"). Age and having take muaj.
      { id: 'yog-pattern-essence', hmongRPA: 'noun + yog + noun', english: 'what something IS — its essence, a lasting state', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub no yog lub tsev.', english: 'This is the house.' }, examples: [{ hmong: 'kuv yog Hmoob', english: 'I am Hmong' }, { hmong: 'lub no yog lub tsev', english: 'this is the house' }] },
      // Added 2026-09-28 (author): describing through yog vs directly. Same meaning, different
      // grammar and emphasis. The author's examples.
      // Rewritten 2026-09-28 (author: NO yog before a describing word). Was:
      // { id: 'yog-pattern-describe', hmongRPA: 'noun + yog + describing word', english: 'a statement about the noun — the same meaning as noun + describing word, with more emphasis', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsev yog loj.', english: 'The house is big.' }, examples: [{ hmong: 'tsev loj', english: 'a big house (direct)' }, { hmong: 'Koj yog ib tug neeg zoo.', english: 'You are a good person.' }, { hmong: 'neeg zoo', english: 'a good person (direct)' }] },
      { id: 'yog-pattern-describe', hmongRPA: 'subject + yog + (quantifier) + noun + (describing word) + (heev)', english: 'describing through yog — yog links to a noun that carries the describing word; never yog + the describing word alone',  /* hmongRPA was 'yog + noun + describing word' — the author's full formula, 2026-09-28 */ category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj yog ib tug neeg zoo.', english: 'You are a good person.' }, examples: [{ hmong: 'Nws yog ib tug neeg zoo heev.', english: 'He is a very good person.' }, { hmong: 'Nws zoo heev.', english: 'He is very good. (no yog)' }, { hmong: 'neeg zoo', english: 'a good person' }] },
      // moreExamples added 2026-09-28 — u-nyob needs five sentences to drill. From the Nyob lesson; Claude's, TODO-VERIFY.
      { id: 'yog-pattern-nyob-place', hmongRPA: 'nyob + place', english: 'to be somewhere — location', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.' }, moreExamples: [{ hmong: 'Koj puas nyob tsev?', english: 'Are you home?', source: 'ai' }, { hmong: 'Kuv tsis nyob tsev.', english: 'I am not home.', source: 'ai' }] },
      { id: 'yog-pattern-nyob-state', hmongRPA: 'nyob + physical state', english: 'a condition right now (hot, cold, sick) — always with nyob', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob kub.', english: 'I am hot.' }, examples: [{ hmong: 'kuv nyob kub', english: 'I am hot' }] },
      { id: 'yog-pattern-feeling', hmongRPA: 'feeling, nyob optional', english: 'an emotion — the adjective alone is most common; nyob can be added', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv zoo siab.', english: 'I am happy.' }, examples: [{ hmong: 'kuv zoo siab', english: 'I am happy' }, { hmong: 'kuv nyob zoo siab', english: 'I am happy (with nyob)' }, { hmong: 'kuv nyuaj siab', english: 'I am sad' }] },
      // moreExamples added 2026-09-28 — u-nyob needs five sentences to drill. From the Nyob lesson; Claude's, TODO-VERIFY.
      { id: 'yog-nyob-li-cas', hmongRPA: 'koj nyob li cas?', english: 'how are you doing?', category: 'yog-to-be', tags: ['phrase', 'greeting', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj nyob li cas?', english: 'How are you doing?' }, moreExamples: [{ hmong: 'Kuv nyob zoo.', english: 'I am well.', source: 'ai' }] },
      { id: 'yog-pattern-muaj-age', hmongRPA: 'muaj + number + xyoo', english: 'age — muaj (have), not yog', category: 'yog-to-be', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj neesnkaum xyoo.', english: 'I am twenty years old.' } },
      /* was english 'if — yog opening a condition, not "to be"' (author, 2026-09-28) */ { id: 'yog-tias', hmongRPA: 'yog tias', english: 'if — yog opening a condition; yog hais tias is the usual, clearer form', category: 'yog-to-be', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog tias nag los, peb nyob tsev.', english: 'If it rains, we stay home.' } },
      { id: 'yog-lawm', hmongRPA: 'yog lawm', english: 'that\'s right', category: 'yog-to-be', tags: ['grammar', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog lawm, koj hais yog.', english: 'That\'s right, you are correct.' } },
      // Added 2026-09-28 (author: "add los yog to yog, and explicitly state it as or"). The same
      // word as conjunctions' 'los yog' card (Joining Words), here beside yog's other jobs.
      { id: 'yog-los-yog', hmongRPA: 'los yog', english: 'or', category: 'yog-to-be', tags: ['conjunction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas xav haus dej los yog kas fes?', english: 'Do you want to drink water or coffee?', source: 'ai' } },
    ],
  },
  {
    // ── NAMES: HU UA — 2026-09-27, path unit u-hu-ua. The author: hu ua = "called /
    // said as"; a name is a title a person is given. A clan name is born into and is
    // spiritually and culturally significant, so it is introduced differently:
    // "Kuv lub npe hu ua Chai. Kuv lub xeem yog Vaj." Names use (lub) npe hu ua (the
    // author corrected "nws hu ua Mim" → "nws npe hu ua Mim"). The two name questions
    // stay on the introductions cards (Greetings unit) — no card in two units.
    id: 'names',
    title: 'Names: Hu Ua',
    description: 'Kuv lub npe hu ua … — your name, your clan name, and what things are called.',
    emoji: '🏷️',
    words: [
      // english was 'to be called, to be named — literally called as' (author, 2026-09-28: hu ua is for the answer; asking takes hu alone)
      { id: 'names-hu-ua', hmongRPA: 'hu ua', english: 'to be called, to be named — literally \'called as\'; for the answer, not the question', category: 'names', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub npe hu ua Chai.', english: 'My name is Chai.' } },
      { id: 'names-lub-npe', hmongRPA: 'lub npe', english: 'a name — the name a person is given (npe, with its classifier lub)', category: 'names', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj lub npe hu li cas?', english: 'What is your name?' } },
      { id: 'names-xeem', hmongRPA: 'xeem', english: 'clan name, surname — the clan a person is born into', category: 'names', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub xeem yog Vaj.', english: 'My clan name is Vang.' } },
      // english was 'what is it called? what is the name?' (author, 2026-09-28: asking takes hu alone)
      { id: 'names-hu-li-cas', hmongRPA: 'hu li cas?', english: 'what is it called? what is the name? — asking takes hu alone, never hu ua', category: 'names', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no hu li cas?', english: 'What is this called?' }, examples: [{ hmong: 'Qhov no hu li cas?', english: 'What is this called?' }, { hmong: 'Hu ua ib phau ntawv.', english: 'It is called a book.' }] },
      { id: 'names-pattern-hu-ua-name', hmongRPA: 'hu + someone + ua + name', english: 'to call someone something', category: 'names', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb hu nws ua Mai.', english: 'We call her Mai.' } },
      { id: 'names-pattern-npe-xeem', hmongRPA: 'npe hu ua … · xeem yog …', english: 'a given name takes hu ua; a clan name takes yog — introduced differently', category: 'names', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub npe hu ua Chai. Kuv lub xeem yog Vaj.', english: 'My name is Chai. My clan name is Vang.' } },
      { id: 'names-hu-xov-tooj', hmongRPA: 'hu xov tooj', english: 'to phone someone — hu on its own is "to call"', category: 'names', tags: ['grammar', 'pattern', 'construction', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hu nws hauv xov tooj.', english: 'I call him on the phone.' } },
    ],
  },
  // ── Function-word & phrase sections, promoted to their own vocab categories so
  // they're browsable AND searchable (mirrors the retired /course grammar+everyday
  // content). Audio pending. See notes/2026-08-04-phrase-vocab-sections.
  {
    id: 'question-words',
    title: 'Question Words',
    description: 'The words that turn a sentence into a question — often at the END in Hmong.',
    emoji: '❓',
    words: [
      { id: 'question-words-what', hmongRPA: 'dab tsi?', english: 'what?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj tab tom ua dab tsi?', english: 'What are you doing?', source: 'ai' } },
      { id: 'question-words-who', hmongRPA: 'leej twg?', english: 'who?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Tus neeg ntawd yog leej twg?', english: 'Who is that person?', source: 'ai' } },
      { id: 'question-words-where', hmongRPA: 'qhov twg?', english: 'where?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj nyob qhov twg?', english: 'Where are you?', source: 'ai' } },
      { id: 'question-words-when', hmongRPA: 'thaum twg?', english: 'when?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj yuav tuaj thaum twg?', english: 'When will you come?', source: 'ai' } },
      { id: 'question-words-why', hmongRPA: 'vim li cas?', english: 'why?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj tsis tuaj vim li cas?', english: 'Why did you not come?', source: 'ai' } },
      // ⚠️ AUDIO WIRED 2026-09-12. The clip is the bare "li cas" recorded for
      // "Tsis ua li cas" in the Thanks & Sorry lesson — the same word, said
      // without the question intonation this entry's "?" implies. Good enough
      // to hear the word; re-point it if a question-form take is ever made.
      { id: 'question-words-how', hmongRPA: 'li cas?', english: 'how?', category: 'question-words', tags: ['question', 'phrase'], audioFile: 'lessons/politeness/li-cas.wav', exampleSentence: { hmong: 'Qhov no hais li cas?', english: 'How do you say this?', source: 'ai' } },
      // english + example rewritten 2026-09-26 (author: pes tsawg comes BEFORE the noun). The
      // old example 'Koj muaj menyuam pes tsawg?' put it after the noun — the wrong order.
      // The fix follows the recorded Speak lessons ('Koj muaj pes tsawg tus nus muag?'):
      // pes tsawg + classifier + noun, the way a number is used.
      { id: 'question-words-how-many', hmongRPA: 'pes tsawg?', english: 'how much / how many? — goes BEFORE the noun, where a number would go (verb + pes tsawg + noun)', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj muaj pes tsawg tus menyuam?', english: 'How many children do you have?', source: 'ai' } },

      // ── INTERROGATIVES MODULE, 2026-09-25 ───────────────────────────────────
      // Added at the author's request so the Questions unit (u-questions in
      // path.js) teaches the whole system, not six words: `twg` on its own and
      // with the classifier it needs, the yes/no marker `puas`, and the other
      // everyday question forms.
      //
      // ⚠️ `twg` IS THE CLASSIFIER PAYOFF. "Which one" is never a bare `twg` in
      // a sentence — it takes the noun's classifier: `lub twg` for things,
      // `tus twg` for people and animals. That is why this unit sits right after
      // Classifiers in the path.
      //
      // ⚠️ ALL 'unreviewed', ALL `source: 'ai'` — the glosses and every example
      // were drafted by Claude. The builder skips them until a speaker removes
      // the `source` (INCLUDE_UNREVIEWED_AI in lib/sentenceBuilder.js).
      { id: 'question-words-which', hmongRPA: 'twg?', english: 'which? — added to the classifier of the noun you ask about: tus twg, leej twg, qhov twg, lub twg…',  /* was …"lub twg", "tus twg" — the author, 2026-09-27 */ category: 'question-words', tags: ['question', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj nyiam lub twg?', english: 'Which one do you like?', source: 'ai' } },
      { id: 'question-words-which-thing', hmongRPA: 'lub twg?', english: 'which one? — for things (classifier lub)', category: 'question-words', tags: ['question', 'classifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj lub tsev yog lub twg?', english: 'Which one is your house?', source: 'ai' } },
      { id: 'question-words-which-animate', hmongRPA: 'tus twg?', english: 'which one? — for people and animals (classifier tus)', category: 'question-words', tags: ['question', 'classifier', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus aub twg yog koj li?', english: 'Which dog is yours?', source: 'ai' } },
      { id: 'question-words-which-day', hmongRPA: 'hnub twg?', english: 'which day?', category: 'question-words', tags: ['question', 'time', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj yuav tuaj hnub twg?', english: 'Which day will you come?', source: 'ai' } },
      { id: 'question-words-yes-no', hmongRPA: 'puas', english: 'yes/no question marker — goes right before the verb', category: 'question-words', tags: ['question', 'particle', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj puas noj mov lawm?', english: 'Have you eaten yet?', source: 'ai' } },
      { id: 'question-words-or-not', hmongRPA: 'los tsis', english: 'or not — an either/or question: "mus los tsis mus?"', category: 'question-words', tags: ['question', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj mus los tsis mus?', english: 'Are you going or not?', source: 'ai' } },
      { id: 'question-words-how-come', hmongRPA: 'ua cas?', english: 'why? how come?', category: 'question-words', tags: ['question', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ua cas koj tsis tuaj?', english: "Why didn't you come?", source: 'ai' } },
      // 2026-09-28 (author): zoo li cas is THE question for how something is or looks — what it looks like. Was english: 'how is it? what is it like?'. The looks-like example is Claude's, TODO-VERIFY.
      { id: 'question-words-how-is-it', hmongRPA: 'zoo li cas?', english: 'what does it look like? how is it? — asking how something is, or how it looks', category: 'question-words', tags: ['question', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj nyob zoo li cas?', english: 'How are you doing?', source: 'ai' }, examples: [{ hmong: 'Koj lub tsev zoo li cas?', english: 'What does your house look like?' }] },
      { id: 'question-words-how-much-degree', hmongRPA: 'npaum li cas?', english: 'how much? to what degree? — "kim npaum li cas?", how expensive?', category: 'question-words', tags: ['question', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsho no kim npaum li cas?', english: 'How expensive is this shirt?', source: 'ai' } },
    ],
  },
  {
    id: 'politeness',
    title: 'Politeness',
    description: 'Thank you, sorry, please — everyday courtesies.',
    emoji: '🙏',
    words: [
      // ⚠️ AUDIO WIRED 2026-09-12. All four were `audioFile: null` — the
      // recordings existed for the Speak lessons and nothing pointed the word
      // bank at them, so these were silent in every drill and quiz.
      { id: 'politeness-thank-you', hmongRPA: 'ua tsaug', english: 'thank you', category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'grammar/conversations/greetings-and-farewells/hmonggreetingsandfarewells-ua-tsaug.mp3' },
      { id: 'politeness-sorry', hmongRPA: 'thov txim', english: 'sorry / excuse me', category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'lessons/politeness/thov-txim.wav' },
      { id: 'politeness-please', hmongRPA: 'thov', english: 'please', category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'lessons/politeness/thov.wav', exampleSentence: { hmong: 'Thov pab kuv os.', english: 'Please help me.', source: 'ai' } },
      { id: 'politeness-youre-welcome', hmongRPA: 'tsis ua li cas', english: "you're welcome / no worries", category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'lessons/politeness/tsis-ua-li-cas.wav' },
      // ⚠️ ADDED 2026-09-12 — the two phrases the lesson gained.
      //
      // ⚠️ `txim` AND `teeb meem` WERE HERE AND WERE MOVED OUT the same day,
      // to `misc` at the foot of this file. Both are plain nouns — "fault" and
      // "problem" — and neither is a courtesy. They looked like courtesies only
      // because "thov txim" and "tsis muaj teeb meem" are the phrases a learner
      // meets them in, and that is a fact about those phrases, not about the
      // words. A category has to describe its words, not the company they keep.
      { id: 'politeness-no-problem', hmongRPA: 'tsis muaj teeb meem', english: 'no problem', category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'lessons/politeness/tsis-muaj-teeb-meem.wav' },
      { id: 'politeness-thanks-a-lot', hmongRPA: 'ua tsaug ntau', english: 'thank you very much', category: 'politeness', tags: ['courtesy', 'phrase'], audioFile: 'lessons/politeness/ua-tsaug-ntau.wav' },
    ],
  },
  {
    id: 'introductions',
    title: 'Introductions',
    description: "Ask someone's name, say yours, and the basics.",
    emoji: '🤝',
    words: [
      { id: 'introductions-your-name', hmongRPA: 'koj lub npe hu li cas?', english: 'what is your name?', category: 'introductions', tags: ['introduction', 'question', 'phrase'], audioFile: null },
      { id: 'introductions-my-name', hmongRPA: 'kuv lub npe hu ua…', english: 'my name is…', category: 'introductions', tags: ['introduction', 'phrase'], audioFile: null },
      { id: 'introductions-where-live', hmongRPA: 'koj nyob qhov twg?', english: 'where do you live?', category: 'introductions', tags: ['introduction', 'question', 'phrase'], audioFile: null },
      { id: 'introductions-how-old', hmongRPA: 'koj muaj pes tsawg xyoo?', english: 'how old are you?', category: 'introductions', tags: ['introduction', 'question', 'phrase'], audioFile: null },
    ],
  },
  {
    id: 'daily-life',
    title: 'Daily Life',
    description: 'Everyday things you say — hungry, thirsty, tired.',
    emoji: '🌤️',
    words: [
      { id: 'daily-life-eaten', hmongRPA: 'koj noj mov tau?', english: 'have you eaten?', category: 'daily-life', tags: ['daily', 'question', 'phrase'], audioFile: null },
      { id: 'daily-life-hungry', hmongRPA: 'kuv tshaib plab', english: "I'm hungry", category: 'daily-life', tags: ['daily', 'phrase'], audioFile: null },
      { id: 'daily-life-thirsty', hmongRPA: 'kuv nqhis dej', english: "I'm thirsty", category: 'daily-life', tags: ['daily', 'phrase'], audioFile: null },
      { id: 'daily-life-tired', hmongRPA: 'kuv tsaug zog', english: "I'm tired / sleepy", category: 'daily-life', tags: ['daily', 'phrase'], audioFile: null },
    ],
  },

  // New Words
  //
  // ⚠️ NEEDS NATIVE REVIEW — the exampleSentence lines below were drafted, not
  // sourced. Verify wording and classifiers before this ships. See the content
  // quality pipeline in notes/2026-08-18-content-implementation-plan.md.
{
  id: "human-anatomy-face",
  title: "Head & Face",
  description: "Parts of the head and face. Several are compounds: qhov ('opening') and plaub ('hair') each build three of these.",
  emoji: "👤",
  words: [
    { id: "human-anatomy-face-head", hmongRPA: "taub hau", english: "head", category: "human-anatomy-face", tags: ["anatomy", "body", "head"], audioFile: null, exampleSentence: { hmong: 'Kuv lub taub hau mob.', english: 'My head hurts.' } },
    { id: "human-anatomy-face-hair", hmongRPA: "plaub hau", english: "hair", category: "human-anatomy-face", tags: ["anatomy", "body", "head", "plaub-compound"], audioFile: null, exampleSentence: { hmong: 'Nws cov plaub hau ntev.', english: 'Her hair is long.' } },
    { id: "human-anatomy-face-forehead", hmongRPA: "hauv pliaj", english: "forehead", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Kuv lub hauv pliaj mob.', english: 'My forehead hurts.' } },
    { id: "human-anatomy-face-face", hmongRPA: "ntsej muag", english: "face", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "compound"], audioFile: null, exampleSentence: { hmong: 'Nws lub ntsej muag zoo nkauj.', english: 'Her face is beautiful.' } },
    { id: "human-anatomy-face-eye", hmongRPA: "qhov muag", english: "eye", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "qhov-compound"], audioFile: null, exampleSentence: { hmong: 'Kuv lub qhov muag mob.', english: 'My eye hurts.' } },
    // NOTE: 'plaub muag' covers BOTH eyebrow and eyelash. Kept as ONE entry with a
    // single primary gloss so quizzes have one right answer — splitting it would
    // create two entries with the same hmongRPA, which is worse. Confirm with a
    // native speaker whether eyelash has a distinct form (e.g. 'plaub qhov muag').
    { id: "human-anatomy-face-eyebrow", hmongRPA: "plaub muag", english: "eyebrow", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "plaub-compound", "needs-review"], audioFile: null, exampleSentence: { hmong: 'Nws cov plaub muag dub.', english: 'Her eyebrows are black.' } },
    { id: "human-anatomy-face-ear", hmongRPA: "pob ntseg", english: "ear", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Kuv lub pob ntseg mob.', english: 'My ear hurts.' } },
    { id: "human-anatomy-face-nose", hmongRPA: "qhov ntswg", english: "nose", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "qhov-compound"], audioFile: null, exampleSentence: { hmong: 'Kuv lub qhov ntswg mob.', english: 'My nose hurts.' } },
    { id: "human-anatomy-face-cheek", hmongRPA: "plhu", english: "cheek", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Nws lub plhu liab.', english: 'Her cheek is red.' } },
    { id: "human-anatomy-face-mouth", hmongRPA: "qhov ncauj", english: "mouth", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "qhov-compound"], audioFile: null, exampleSentence: { hmong: 'Qhib koj lub qhov ncauj.', english: 'Open your mouth.' } },
    { id: "human-anatomy-face-lip", hmongRPA: "di ncauj", english: "lip", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Nws di ncauj liab.', english: 'Her lips are red.' } },
    { id: "human-anatomy-face-tongue", hmongRPA: "nplaig", english: "tongue", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Kuv nplaig mob.', english: 'My tongue hurts.' } },
    { id: "human-anatomy-face-teeth", hmongRPA: "hniav", english: "teeth", category: "human-anatomy-face", tags: ["anatomy", "body", "face"], audioFile: null, exampleSentence: { hmong: 'Kuv cov hniav dawb.', english: 'My teeth are white.' } },
    { id: "human-anatomy-face-chin", hmongRPA: "puab tsaig", english: "chin", category: "human-anatomy-face", tags: ["anatomy", "body", "face", "needs-review"], audioFile: null, exampleSentence: { hmong: 'Kuv lub puab tsaig mob.', english: 'My chin hurts.' } },
    { id: "human-anatomy-face-neck", hmongRPA: "caj dab", english: "neck", category: "human-anatomy-face", tags: ["anatomy", "body", "head"], audioFile: null, exampleSentence: { hmong: 'Kuv lub caj dab mob.', english: 'My neck hurts.' } },
      // ── Routed out of `body-health` on 2026-09-20 ──
      { id: 'body-ntsiab-muag', hmongRPA: 'ntsiab muag', english: 'pupil', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muaj ntsiab muag dub.', english: 'She has dark pupils.', source: 'ai' } },
      { id: 'body-dim-muag', hmongRPA: 'dim muag', english: 'eyelid', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv dim muag o thaum sawv ntxov.', english: 'My eyelid is swollen in the morning.', source: 'ai' } },
      { id: 'body-kauj-tsaim', hmongRPA: 'kauj tsaim', english: 'jaw', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub kauj tsaim mob thaum noj mov.', english: 'My jaw hurts when I eat.', source: 'ai' } },
      { id: 'body-hniav-txab', hmongRPA: 'hniav txab', english: 'wisdom tooth', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hniav txab tab tom loj tuaj.', english: 'My wisdom tooth is growing in.', source: 'ai' } },
      { id: 'body-pos-hniav', hmongRPA: 'pos hniav', english: 'gums', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pos hniav los ntshav me ntsis.', english: 'My gums bleed a little.', source: 'ai' } },
      // ⚠️ needs-review. Glossed "nostril", but `human-anatomy-face` has had
      // `qhov ntswg` = "nose" since the beginning, and it is consistent with its two
      // siblings there: `qhov muag` = eye, `qhov ncauj` = mouth. In those compounds
      // `qhov` does NOT mean the hole is the referent. So "nose" is likely right and
      // this entry is the odd one out — but both readings are attested. Kept, tagged.
      { id: 'body-qhov-ntswg', hmongRPA: 'qhov ntswg', english: 'nostril', category: 'human-anatomy-face', tags: ['noun','body','unreviewed','needs-review'], audioFile: null },
      { id: 'body-lub-caj-pas', hmongRPA: 'lub caj pas', english: 'throat', category: 'human-anatomy-face', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv lub caj pas mob hnub no.', english: 'My throat hurts today.', source: 'ai' } },
      { id: 'gen-kab-lia', hmongRPA: 'kab lia', english: 'dimple', category: 'human-anatomy-face', tags: ['noun','everyday','unreviewed'], audioFile: null,
        // "dimple" and "mealworm" are not synonyms, so ';' was the wrong separator
        // in the source: a FACE card glossed "dimple; mealworm" answers both.
        senses: [
          { en: 'dimple', context: 'body' },
          { en: 'mealworm', context: 'reading', note: 'unrelated sense; needs a speaker to confirm' },
        ], exampleSentence: { hmong: 'Nws muaj kab lia ntawm ob sab plhu.', english: 'She has dimples on both cheeks.', source: 'ai' } },
  ],
},

{
  id: "human-anatomy-upper-body",
  title: "Human Anatomy Upper Body",
  description: "Hmong words for Human Anatomy for the Upper Body",
  emoji: "💪",
  words: [
    { id: "human-anatomy-upper-body-shoulder", hmongRPA: "xub pwg", english: "shoulder", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv xub pwg mob tom qab nqa khoom.', english: 'My shoulder hurts after carrying things.', source: 'ai' } },
    { id: "human-anatomy-upper-body-arm", hmongRPA: "caj npab", english: "arm", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv caj npab mob me ntsis.', english: 'My arm hurts a little.', source: 'ai' } },
    { id: "human-anatomy-upper-body-elbow", hmongRPA: "luj tshib", english: "elbow", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv luj tshib raug mob thaum ua si.', english: 'My elbow was injured while playing.', source: 'ai' } },
    { id: "human-anatomy-upper-body-hand", hmongRPA: "tes", english: "hand", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv ntxuav tes ua ntej noj mov.', english: 'I wash my hands before eating.', source: 'ai' } },
    { id: "human-anatomy-upper-body-finger", hmongRPA: "ntiv tes", english: "finger", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv txiav kuv ntiv tes me ntsis.', english: 'I cut my finger a little.', source: 'ai' } },
    { id: "human-anatomy-upper-body-thumb", hmongRPA: "ntiv tes xoo", english: "thumb", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv ntiv tes xoo mob heev.', english: 'My thumb hurts a lot.', source: 'ai' } },
    { id: "human-anatomy-upper-body-chest", hmongRPA: "hauv siab", english: "chest", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv hauv siab mob thaum kuv khiav.', english: 'My chest hurts when I run.', source: 'ai' } },
    { id: "human-anatomy-upper-body-breast", hmongRPA: "mis", english: "breast", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Tus menyuam haus mis ntawm nws niam.', english: 'The baby breastfeeds from its mother.', source: 'ai' } },
    { id: "human-anatomy-upper-body-nipple", hmongRPA: "txiv mis", english: "nipple", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Tus menyuam mos muaj txiv mis me.', english: 'The baby has small nipples.', source: 'ai' } },
    { id: "human-anatomy-upper-body-back", hmongRPA: "nrob qaum", english: "back", category: "human-anatomy-upper-body", tags: ["anatomy", "body", "upper"], audioFile: null, exampleSentence: { hmong: 'Kuv nrob qaum mob tom qab zaum ntev.', english: 'My back hurts after sitting for a long time.', source: 'ai' } },
      // ── Routed out of `body-health` on 2026-09-20 ──
      { id: 'body-quav-npab', hmongRPA: 'quav npab', english: 'bend of the arm; inner elbow', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv quav npab mob thaum kuv txav.', english: 'The bend of my arm hurts when I move.', source: 'ai' } },
      { id: 'body-dab-teg', hmongRPA: 'dab teg', english: 'wrist', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv dab teg mob tom qab ntaus pob.', english: 'My wrist hurts after playing ball.', source: 'ai' } },
      { id: 'body-sab-npab-nqia', hmongRPA: 'sab npab nqia', english: 'forearm', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sab npab nqia mob tom qab nqa khoom.', english: 'My forearm hurts after carrying things.', source: 'ai' } },
      { id: 'body-sab-npab-ntug', hmongRPA: 'sab npab ntug', english: 'biceps', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv sab npab ntug muaj nqaij khov.', english: 'My biceps are firm.', source: 'ai' } },
      { id: 'body-tus-txha-caj-qaum', hmongRPA: 'tus txha caj qaum', english: 'spine', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus txha caj qaum mob heev.', english: 'My spine hurts a lot.', source: 'ai' } },
      { id: 'gen-taubteg', hmongRPA: 'taubteg', english: 'fingerprint; fingertips', category: 'human-anatomy-upper-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cov taubteg nyob ntawm daim iav.', english: 'My fingerprints are on the glass.', source: 'ai' } },
  ],
},

{
  id: "human-anatomy-lower-body",
  title: "Human Anatomy Lower Body",
  description: "Hmong words for Human Anatomy for the Lower Body",
  emoji: "🦵",
  words: [
    { id: "human-anatomy-lower-body-belly", hmongRPA: "plab", english: "belly / stomach", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv plab mob tom qab noj ntau.', english: 'My stomach hurts after eating too much.', source: 'ai' } },
    { id: "human-anatomy-lower-body-navel", hmongRPA: "ntaws", english: "navel / belly button", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Tus menyuam muaj ntaws me me.', english: 'The baby has a small belly button.', source: 'ai' } },
    { id: "human-anatomy-lower-body-hip", hmongRPA: "ntsag", english: "hip", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv ntsag mob tom qab taug kev ntev.', english: 'My hip hurts after walking a long distance.', source: 'ai' } },
    { id: "human-anatomy-lower-body-thigh", hmongRPA: "ncej puab", english: "thigh", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv ncej puab mob tom qab khiav.', english: 'My thigh hurts after running.', source: 'ai' } },
    { id: "human-anatomy-lower-body-knee", hmongRPA: "hauv caug", english: "knee", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv hauv caug mob thaum nce ntaiv.', english: 'My knee hurts when climbing stairs.', source: 'ai' } },
    { id: "human-anatomy-lower-body-shin", hmongRPA: "caj hlaub", english: "shin / lower leg", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv caj hlaub mob tom qab taug kev.', english: 'My shin hurts after walking.', source: 'ai' } },
    { id: "human-anatomy-lower-body-calf", hmongRPA: "plab hlaub", english: "calf", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv plab hlaub mob tom qab khiav.', english: 'My calf hurts after running.', source: 'ai' } },
    { id: "human-anatomy-lower-body-leg", hmongRPA: "ceg", english: "leg", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv ceg mob tom qab ua si.', english: 'My leg hurts after playing.', source: 'ai' } },
    { id: "human-anatomy-lower-body-ankle", hmongRPA: "pob taws", english: "ankle", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv pob taws o me ntsis.', english: 'My ankle is a little swollen.', source: 'ai' } },
    { id: "human-anatomy-lower-body-foot", hmongRPA: "ko taw", english: "foot", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv ko taw mob thaum taug kev.', english: 'My foot hurts when I walk.', source: 'ai' } },
    { id: "human-anatomy-lower-body-toe", hmongRPA: "ntiv taw", english: "toe", category: "human-anatomy-lower-body", tags: ["anatomy", "body", "lower"], audioFile: null, exampleSentence: { hmong: 'Kuv ntiv taw raug mob lawm.', english: 'My toe is injured.', source: 'ai' } },
      // ── Routed out of `body-health` on 2026-09-20 ──
      { id: 'body-duav', hmongRPA: 'duav', english: 'waist', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv duav mob tom qab nqa khoom.', english: 'My waist hurts after carrying things.', source: 'ai' } },
      { id: 'body-chaw-mos', hmongRPA: 'chaw mos', english: 'genitals', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob tshuaj xyuas chaw mos.', english: 'The doctor examines the genitals.', source: 'ai' } },
      // ⚠️ needs-review. A SECOND headword for navel, beside `ntaws` in this
      // same category. Both may be real (regional, or whole-vs-part); one may be
      // wrong. Kept as supplied — deleting either would pick a winner silently.
      { id: 'body-puj-ntaws', hmongRPA: 'puj ntaws', english: 'belly button; navel', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed','needs-review'], audioFile: null },
      // ⚠️ needs-review. A SECOND headword for ankle, beside `pob taws` in this
      // same category. Both may be real (regional, or whole-vs-part); one may be
      // wrong. Kept as supplied — deleting either would pick a winner silently.
      { id: 'body-dab-taw', hmongRPA: 'dab taw', english: 'ankle', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed','needs-review'], audioFile: null },
      // ⚠️ needs-review. A SECOND headword for thigh, beside `ncej puab` in this
      // same category. Both may be real (regional, or whole-vs-part); one may be
      // wrong. Kept as supplied — deleting either would pick a winner silently.
      { id: 'body-sab-ncej-puab', hmongRPA: 'sab ncej puab', english: 'thigh', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed','needs-review'], audioFile: null },
      // ⚠️ needs-review. A SECOND headword for shin, beside `caj hlaub` in this
      // same category. Both may be real (regional, or whole-vs-part); one may be
      // wrong. Kept as supplied — deleting either would pick a winner silently.
      { id: 'body-sab-kavhlaub', hmongRPA: 'sab kavhlaub', english: 'shin', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed','needs-review'], audioFile: null },
      { id: 'body-qhov-raws', hmongRPA: 'qhov raws', english: 'bend behind the knee', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv qhov raws mob thaum kuv zaum.', english: 'The bend behind my knee hurts when I sit.', source: 'ai' } },
      { id: 'body-ncej-qab', hmongRPA: 'ncej qab', english: 'back of the thigh; hamstring', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ncej qab mob tom qab khiav.', english: 'My hamstring hurts after running.', source: 'ai' } },
      { id: 'body-xib-taws', hmongRPA: 'xib taws', english: 'heel', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xib taws mob thaum taug kev.', english: 'My heel hurts when I walk.', source: 'ai' } },
      { id: 'body-qab-xib-taws', hmongRPA: 'qab xib taws', english: 'sole of the foot', category: 'human-anatomy-lower-body', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv qab xib taws mob heev.', english: 'The sole of my foot hurts a lot.', source: 'ai' } },
  ],
},

{
  id: "human-anatomy-internal-organs",
  title: "Human Anatomy Internal Organs",
  description: "Hmong words for Human Anatomy for the Internal Organs",
  emoji: "🫀",
  words: [
    { id: "human-anatomy-internal-organs-heart", hmongRPA: "plawv", english: "heart", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv plawv dhia ceev thaum khiav.', english: 'My heart beats fast when I run.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-liver", hmongRPA: "siab", english: "liver", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv siab ua haujlwm zoo.', english: 'My liver is working well.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-lung", hmongRPA: "ntsws", english: "lung", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv ntsws xav tau huab cua huv.', english: 'My lungs need clean air.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-kidney", hmongRPA: "raum", english: "kidney", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob kuaj kuv raum.', english: 'The doctor examines my kidneys.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-stomach", hmongRPA: "plab", english: "stomach", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv plab mob vim kuv noj ntau dhau lawm.', english: 'My stomach hurts because I ate too much.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-intestine", hmongRPA: "hnyuv", english: "intestine", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv hnyuv tsis xis nyob hnub no.', english: 'My intestines do not feel well today.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-gallbladder", hmongRPA: "tsib", english: "gall bladder", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob kuaj kuv tsib.', english: 'The doctor examines my gallbladder.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-brain", hmongRPA: "hlwb", english: "brain", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv hlwb xav tau sijhawm so.', english: 'My brain needs time to rest.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-blood", hmongRPA: "ntshav", english: "blood", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv ntshav tawm me ntsis.', english: 'I am bleeding a little.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-bone", hmongRPA: "pob txha", english: "bone", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv pob txha tsis muaj zog.', english: 'My bones are not strong.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-skin", hmongRPA: "tawv nqaij", english: "skin", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv tawv nqaij qhuav thaum caij ntuj no.', english: 'My skin is dry in winter.', source: 'ai' } },
    { id: "human-anatomy-internal-organs-rib", hmongRPA: "tav", english: "rib", category: "human-anatomy-internal-organs", tags: ["anatomy", "body", "organ"], audioFile: null, exampleSentence: { hmong: 'Kuv tav mob thaum ua pa tob.', english: 'My rib hurts when I breathe deeply.', source: 'ai' } },
  ],
},

  // ── MISCELLANEOUS — the holding pen ──────────────────────────────────────
  //
  // ⚠️ ADDED 2026-09-12. For words that are REAL and RECORDED but have no
  // honest home in any category yet.
  //
  // Both alternatives were worse. Forcing a word into a category it does not
  // belong to teaches a wrong grouping and quietly corrupts any drill built on
  // that category — a "Politeness" quiz asking for "fault" is not a politeness
  // quiz. Leaving the word out of this file entirely makes it invisible to the
  // reader's long-press lookup, to search, and to every quiz, which is the
  // exact gap that put the lesson words here in the first place.
  //
  // ⚠️ DELIBERATELY NOT IN CATEGORY_THEMES below, so it falls into the "More"
  // group at the bottom of the browser: reachable, never featured.
  //
  // ⚠️ THIS IS A WAITING ROOM, NOT A CATEGORY. Moving a word OUT is the point.
  // When several entries here turn out to share a theme, that is the signal to
  // make the real category and move them together.
  //
  // ⚠️ RENAMING A WORD'S id IS ONLY FREE UNTIL SOMEBODY STUDIES IT.
  // vocabProgress and the SRS schedule key on the word id, so moving a word out
  // of here after release orphans that learner's history for it. Move things
  // out early, or accept that the id keeps its `misc-` prefix forever.
  {
    // ⚠️ DELIBERATELY NOT IN CATEGORY_THEMES below, so it falls into the "More"
    // bucket beside `misc` — the same choice, for the same reason: it is a
    // holding area, not a theme anyone browses on purpose.
    //
    // ⚠️ WHY A SEPARATE CATEGORY FROM `misc` AT ALL. These are all MULTI-WORD,
    // and that is a real difference to the lookup: a phrase can only be reached
    // by tier 0 (standing in it), tier 3 (a glossary phrase containing the tap)
    // or an exact search. Keeping them apart makes "how much of the app is
    // phrases" answerable, and makes the review pass a single list rather than a
    // filter over 300 words.
    //
    // ⚠️ EVERY ENTRY IS 'unreviewed'. The english is Claude's, rewritten from
    // story glossaries for general use — the story versions said things like
    // "here, concrete", which is right in a passage and wrong in a dictionary.
    // Counted in notes/TODO.md.
    id: 'misc-phrases',
    title: 'Miscellaneous Phrases',
    description: 'Everyday multi-word phrases with no category yet — mostly harvested from the readings. They work everywhere: lookup, search, drills.',
    emoji: '🧩',
    words: [

      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as `gen-pejxeem`
      // (`pejxeem`, solid). Its sense "the public" was merged into that entry.
      // { id: 'phr-pej-xeem', hmongRPA: 'pej xeem', english: 'the public; citizens', category: 'misc-phrases', tags: ['noun','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as `conjunctions-but`,
      // which is `tiamsis` — solid, and with recorded audio. `tiam sis` is the same
      // word with a space in it, not a second word. Its extra sense "however" was
      // merged into that entry. RESTORE only if the spaced form is ever shown to be
      // a genuinely separate word.
      // { id: 'phr-tiam-sis', hmongRPA: 'tiam sis', english: 'but, however', category: 'misc-phrases', tags: ['conjunction','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as `conjunctions-or-short`
      // (`lossis`, solid, with recorded audio). Spacing only.
      // { id: 'phr-los-sis', hmongRPA: 'los sis', english: 'or', category: 'misc-phrases', tags: ['conjunction','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `seasons-time` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'phr-yuav-tsum', hmongRPA: 'yuav tsum', english: 'must, have to', category: 'misc-phrases', tags: ['particle','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `directions` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'phr-ncaj-qha', hmongRPA: 'ncaj qha', english: 'directly, straight', category: 'misc-phrases', tags: ['adverb','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as `numbers-20`
      // (`neesnkaum`, solid, with recorded audio). Its compound examples were moved
      // into a comment on that entry, respelled solid.
      // { id: 'phr-nees-nkaum', hmongRPA: 'nees nkaum', english: 'twenty — "nees nkaum plaub" twenty-four, "nees nkaum cuaj" twenty-nine', category: 'misc-phrases', tags: ['number','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `agriculture-foodstuffs` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'phr-txiv-lws-suav', hmongRPA: 'txiv lws suav', english: 'a tomato', category: 'misc-phrases', tags: ['noun','food','reading','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `family-m-muam` and `relatives-muam` both teach `muam`, and with the speaker-relative detail this copy lacks.
      // { id: 'phr-tus-muam', hmongRPA: 'tus muam', english: 'a sister', category: 'misc-phrases', tags: ['noun','family','reading','unreviewed'], audioFile: null },
    ],
  },
  {
    id: 'misc',
    title: 'Miscellaneous Vocabulary',
    description: 'Words and phrases with no category yet — including the ones the readings use. They work everywhere: lookup, search, drills.',
    emoji: '📦',
    words: [

      // ── From "Ntxawm Lub Xauv", 2026-09-12 ────────────────────────────
      // superseded by the chim review (the entry above now carries every sense).
      // Restore by uncommenting if that review is ever reversed:
      // {id: 'misc-chim', hmongRPA: 'chim', english: 'a period of time, or a moment. Often used to express a short duration or an instant', category: 'misc', tags: ['noun', 'reading', 'needs-source-review'], audioFile: null, exampleSentence: 'Kuv tsis xav tos ntev, kuv tsuas xav tos ib chim xwb. — I don’t want to wait long, I just want to wait a moment.', },

      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `body-health` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-hnov', hmongRPA: 'hnov', english: 'to hear', category: 'misc', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the word is "tag kis" (morning, tomorrow)
      // { id: 'misc-kis', hmongRPA: 'kis', english: 'in "tag kis", morning or tomorrow', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the phrase is "ib laim muag" (the blink of an eye)
      // { id: 'misc-laim', hmongRPA: 'laim', english: 'a blink or flash; in "ib laim muag", the blink of an eye', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the word is "maj mam" (slowly)
      // { id: 'misc-maj', hmongRPA: 'maj', english: 'slow; in "maj mam", slowly', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ a CHARACTER in "Ntxawm Lub Xauv", not vocabulary
      // { id: 'misc-nkaub', hmongRPA: 'nkaub', english: 'Nkaub — a personal name', category: 'misc', tags: ['name', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ a CHARACTER in "Ntxawm Lub Xauv", not vocabulary
      // { id: 'misc-ntxawm', hmongRPA: 'ntxawm', english: 'Ntxawm — a personal name', category: 'misc', tags: ['name', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `botany` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-nyom', hmongRPA: 'nyom', english: 'grass', category: 'misc', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the word is "ua si" (to play)
      // { id: 'misc-si', hmongRPA: 'si', english: 'in "ua si", to play', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the words are "tiam sis" / "tab sis" (but)
      // { id: 'misc-sis', hmongRPA: 'sis', english: 'in "tiam sis" / "tab sis", but', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `nature` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-suab', hmongRPA: 'suab', english: 'sound, voice', category: 'misc', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the words are "tab tom" (currently) and "tab sis" (but)
      // { id: 'misc-tab', hmongRPA: 'tab', english: 'in "tab tom", currently; in "tab sis", but', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ fragment — the word is "dab tsi" (what)
      // { id: 'misc-tsi', hmongRPA: 'tsi', english: 'in "dab tsi", what', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `agriculture-foodstuffs` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-zaub', hmongRPA: 'zaub', english: 'vegetables', category: 'misc', tags: ['name', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `phr-pob-zeb` already has this as `pob zeb` — `pob` is the classifier for round things and is the normal way to say a rock.
      // { id: 'misc-zeb', hmongRPA: 'zeb', english: 'stone, rock', category: 'misc', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },

      // ── From "Tus Miv", 2026-09-13 ────────────────────────────────────

      // ── From the readings, 2026-09-12 ──────────────────────────────────

      // ⚠️ REDUNDANT, commented out 2026-09-20. Its gloss was the more precise of
      // the two and has been merged into `chore-ua-mov`, which now carries both readings.
      // { id: 'misc-ua-mov', hmongRPA: 'ua mov', english: 'to cook rice', category: 'misc', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Its gloss was the more precise of
      // the two and has been merged into `vehicle-taug-kev`, which now carries both readings.
      // { id: 'misc-taug-kev', hmongRPA: 'taug kev', english: 'to walk; to travel on foot', category: 'misc', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      // ── PROMOTED FROM story-zong-vang, 2026-09-14 ─────────────────────────
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `housing` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-nrhiav', hmongRPA: 'nrhiav', english: 'to look for, to search for', category: 'misc', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },

      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `human-anatomy-face` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-ntsej-muag', hmongRPA: 'ntsej muag', english: 'face', category: 'misc', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `body-health` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-dab-teg', hmongRPA: 'dab teg', english: 'wrist', category: 'misc', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `human-anatomy-upper-body` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-xub-pwg', hmongRPA: 'xub pwg', english: 'shoulder', category: 'misc', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `human-anatomy-lower-body` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-pob-taws', hmongRPA: 'pob taws', english: 'ankle', category: 'misc', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null },

      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `calendar` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-hnub-tim', hmongRPA: 'hnub tim', english: 'the date, the day of the month', category: 'misc', tags: ['noun', 'time', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `vehicle-lub-tsheb-kauj-vab` teaches this with its classifier.
      // { id: 'misc-tsheb-kauj-vab', hmongRPA: 'tsheb kauj vab', english: 'bicycle', category: 'misc', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `war-conflict` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-phom', hmongRPA: 'phom', english: 'a gun', category: 'misc', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `drinks` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-cawv', hmongRPA: 'cawv', english: 'alcohol, liquor', category: 'misc', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },

      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `quantifiers` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-coob', hmongRPA: 'coob', english: 'many — used of people, where "ntau" is used of things', category: 'misc', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null },

      // ── SECOND SENSES ─────────────────────────────────────────────────────
      // superseded by the kaw review (the entry above now carries every sense).
      // Restore by uncommenting if that review is ever reversed:
      // { id: 'misc-sense-kaw', hmongRPA: 'kaw', english: 'to imprison, to confine — "raug kaw", to be jailed', category: 'misc', tags: ['sense', 'verb', 'reading', 'unreviewed'], audioFile: null },

      // ── COUNTRIES AND PLACES ──────────────────────────────────────────────
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `countries` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-nyab-laj', hmongRPA: 'Nyab Laj', english: 'Vietnam', category: 'misc', tags: ['country', 'place'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as `country-fabkis`
      // (`Fabkis`, solid), which also carries the nationality sense.
      // { id: 'misc-fab-kis', hmongRPA: 'Fab Kis', english: 'France', category: 'misc', tags: ['country', 'place'], audioFile: null },
      // ── MOVED OUT OF THE TOPICAL DECKS — 2026-09-15 ──────────────────────

      // ── HARVESTED FROM THE READINGS, 2026-09-14 ──────────────────────────
      // ⚠️ REDUNDANT, commented out 2026-09-20. `vehicle-lub-tsheb` now carries both readings — its broader "vehicle" sense was merged there first.
      // { id: 'misc-tsheb', hmongRPA: 'tsheb', english: 'vehicle; car', category: 'misc', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `nature` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-nrov', hmongRPA: 'nrov', english: 'loud', category: 'misc', tags: ['adjective','reading','unreviewed'], audioFile: null },
      // ⚠️ fragment — the word is "to taub" (to understand)
      // { id: 'misc-to', hmongRPA: 'to', english: 'a hole; in "to taub", to understand', category: 'misc', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Same word as
      // `country-teb-chaws-meskas`. Note the spacing runs the OTHER way here:
      // `teb chaws` ("country") is two words — `teb` land + `chaws` place, and both
      // are separate entries — so `Teb Chaws Meskas` is the correct spelling and
      // `Tebchaws Meskas` is the variant. Solid is not always right; the rule is
      // whether the parts are words.
      // ⚠️ SUPERSEDED 2026-09-26 BY THE AUTHOR: 'Tebchaws' is written JOINED and
      // CAPITALISED — one of the words where the parts combine. The paragraph above
      // is kept as history; the rule is the author's, not the parts-are-words test.
      // { id: 'misc-tebchaws-meskas', hmongRPA: 'Tebchaws Meskas', english: 'the United States of America', category: 'misc', tags: ['country', 'place', 'reading'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `botany` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-noob', hmongRPA: 'noob', english: 'seed', category: 'misc', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `botany` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-av', hmongRPA: 'av', english: 'ground, earth', category: 'misc', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `animals-tiger` teaches `tsov`. This copy is a story-text artifact — the gloss is literally "the tiger".
      // { id: 'misc-tus-tsov', hmongRPA: 'tus tsov', english: 'the tiger', category: 'misc', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. Already taught in `relatives` with
      // the same meaning, so this copy only showed the reader the definition twice.
      // RESTORE if it turns out to carry a sense that entry does not.
      // { id: 'misc-pog-koob', hmongRPA: 'pog koob', english: 'great-grandmother', category: 'misc', tags: ['phrase', 'reading'], audioFile: null },
    ],
  },

  // ── Batch added 2026-09-20 ──────────────────────────────────────────────
  // Nine categories imported in one batch. Every entry is `unreviewed`, has
  // `audioFile: null` and no `exampleSentence` — see
  // notes/2026-09-20-vocab-batch-import.md for what that costs and the
  // per-entry problems found while importing.
  {
    id: 'agriculture-foodstuffs',
    title: 'Agriculture & Foodstuffs',
    description: 'Fruits, vegetables, crops, garden vocabulary, and food-growing terms.',
    emoji: '🌾',
    words: [
      { id: 'ag-txiv-es-pauj', hmongRPA: 'txiv es pauj', english: 'apple', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj ib lub txiv es pauj.', english: 'I eat an apple.', source: 'ai' } },
      { id: 'ag-txiv-tsawb', hmongRPA: 'txiv tsawb', english: 'banana', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj ib lub txiv tsawb thaum sawv ntxov.', english: 'I eat a banana in the morning.', source: 'ai' } },
      // ⚠️ COMMENTED OUT 2026-09-20, NOT DELETED. The headword embeds the English
      // word "barley", so a flashcard asks the learner to recall "barley" and rewards
      // them for answering "barley". RESTORE by replacing the English token with the
      // real Hmong headword — the entry is otherwise complete and correctly tagged.
      // { id: 'ag-nplej-barley', hmongRPA: 'nplej barley', english: 'barley', category: 'agriculture-foodstuffs', tags: ['noun','grain','agriculture','unreviewed'], audioFile: null },
      { id: 'ag-noob-taum-lag', hmongRPA: 'noob taum lag', english: 'bean', category: 'agriculture-foodstuffs', tags: ['noun','legume','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb cog noob taum lag hauv vaj.', english: 'We plant beans in the garden.', source: 'ai' } },
      { id: 'ag-txiv-npaws-lij', hmongRPA: 'txiv npaws lij', english: 'berries', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam nyiam noj txiv npaws lij.', english: 'The children like eating berries.', source: 'ai' } },
      // ⚠️ COMMENTED OUT 2026-09-20, NOT DELETED. The headword embeds the English
      // word "cereals", so a flashcard asks the learner to recall "cereals" and rewards
      // them for answering "cereals". RESTORE by replacing the English token with the
      // real Hmong headword — the entry is otherwise complete and correctly tagged.
      // { id: 'ag-noob-cereals', hmongRPA: 'noob cereals', english: 'cereals', category: 'agriculture-foodstuffs', tags: ['noun','grain','agriculture','unreviewed'], audioFile: null },
      { id: 'ag-txiv-hmab-txiv-ntoo', hmongRPA: 'txiv hmab txiv ntoo', english: 'fruit; fruits', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj txiv hmab txiv ntoo txhua hnub.', english: 'I eat fruit every day.', source: 'ai' } },
      { id: 'ag-vaj-loog', hmongRPA: 'vaj loog', english: 'garden; enclosed property', category: 'agriculture-foodstuffs', tags: ['noun','garden','agriculture','unreviewed'], audioFile: null,
        // "kingdom" is a real sense and a wrong ANSWER on an agriculture card.
        senses: [
          { en: 'garden; enclosed property', context: 'agriculture-foodstuffs' },
          { en: 'kingdom', context: 'reading', note: 'of a realm or domain' },
        ], exampleSentence: { hmong: 'Peb cog zaub hauv vaj loog.', english: 'We grow vegetables in the garden.', source: 'ai' } },
      { id: 'ag-lub-qij', hmongRPA: 'lub qij', english: 'garlic', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab lub qij tso rau hauv kua zaub.', english: 'I put garlic in the soup.', source: 'ai' } },
      { id: 'ag-txiv-as-ngoos', hmongRPA: 'txiv as ngoos', english: 'grapes', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov txiv as ngoos no qab heev.', english: 'These grapes are very tasty.', source: 'ai' } },
      { id: 'ag-quav-nyab', hmongRPA: 'quav nyab', english: 'hay', category: 'agriculture-foodstuffs', tags: ['noun','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus nees noj quav nyab txhua hnub.', english: 'The horse eats hay every day.', source: 'ai' } },
      { id: 'ag-txiv-maj-naus-ntev', hmongRPA: 'txiv maj naus ntev', english: 'lemon', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyem txiv maj naus ntev rau hauv dej.', english: 'I squeeze lemon into the water.', source: 'ai' } },
      { id: 'ag-txiv-maj-naus-pob-taub', hmongRPA: 'txiv maj naus pob taub', english: 'lime', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv siv txiv maj naus pob taub ua kua txiv.', english: 'I use lime to make juice.', source: 'ai' } },
      { id: 'ag-pob-kws', hmongRPA: 'pob kws', english: 'corn', category: 'agriculture-foodstuffs', tags: ['noun','grain','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ci pob kws rau noj hmo.', english: 'I roast corn for dinner.', source: 'ai' } },
      { id: 'ag-dib-txaij', hmongRPA: 'dib txaij', english: 'melon', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb cog dib txaij hauv vaj.', english: 'We grow melons in the garden.', source: 'ai' } },
      { id: 'ag-nceb', hmongRPA: 'nceb', english: 'mushroom', category: 'agriculture-foodstuffs', tags: ['noun','food','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv khaws nceb tom hav zoov.', english: 'I gather mushrooms in the forest.', source: 'ai' } },
      { id: 'ag-txiv-plhaub-tawv', hmongRPA: 'txiv plhaub tawv', english: 'nuts', category: 'agriculture-foodstuffs', tags: ['noun','food','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj txiv plhaub tawv ua khoom txom ncauj.', english: 'I eat nuts as a snack.', source: 'ai' } },
      { id: 'ag-dos-loj', hmongRPA: 'dos loj', english: 'large onion', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiav ib lub dos loj.', english: 'I cut a large onion.', source: 'ai' } },
      { id: 'ag-txiv-kab-ntxwv', hmongRPA: 'txiv kab ntxwv', english: 'orange', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus kua txiv kab ntxwv thaum sawv ntxov.', english: 'I drink orange juice in the morning.', source: 'ai' } },
      { id: 'ag-qos-yaj-ywm', hmongRPA: 'qos yaj ywm', english: 'potato', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hau qos yaj ywm rau noj hmo.', english: 'I boil potatoes for dinner.', source: 'ai' } },
      { id: 'ag-txhuv', hmongRPA: 'txhuv', english: 'uncooked rice; rice grains', category: 'agriculture-foodstuffs', tags: ['noun','grain','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb ntxuav txhuv ua ntej ua mov.', english: 'We wash rice grains before cooking.', source: 'ai' } },
      { id: 'ag-quav-ntsuas', hmongRPA: 'quav ntsuas', english: 'sorghum', category: 'agriculture-foodstuffs', tags: ['noun','grain','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb cog quav ntsuas rau noj.', english: 'We grow sorghum for food.', source: 'ai' } },
      { id: 'ag-taum-pauv', hmongRPA: 'taum pauv', english: 'soybean', category: 'agriculture-foodstuffs', tags: ['noun','legume','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv siv taum pauv ua zaub mov.', english: 'I use soybeans to make food.', source: 'ai' } },
      { id: 'ag-khoom-rau-nqaij', hmongRPA: 'khoom rau nqaij', english: 'spices; seasonings for meat', category: 'agriculture-foodstuffs', tags: ['noun','seasoning','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab khoom rau nqaij ua ntej kib.', english: 'I add seasonings to the meat before frying it.', source: 'ai' } },
      { id: 'ag-piam-thaj', hmongRPA: 'piam thaj', english: 'sugar', category: 'agriculture-foodstuffs', tags: ['noun','food','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab piam thaj rau hauv tshuaj yej.', english: 'I put sugar in the tea.', source: 'ai' } },
      { id: 'ag-txiv-lws-suav', hmongRPA: 'txiv lws suav', english: 'tomato', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam txiav txiv lws suav tso rau hauv cov zaub xam lav.', english: 'Mom cuts tomatoes into the salad.', source: 'ai' } },
      { id: 'ag-zaub', hmongRPA: 'zaub', english: 'vegetable; vegetables', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav zaub tshiab tom khw los ua noj hmo no.', english: 'We buy fresh vegetables from the store to cook tonight.', source: 'ai' } },
      { id: 'ag-nplej-ntxhuav-kws', hmongRPA: 'nplej ntxhuav kws', english: 'wheat', category: 'agriculture-foodstuffs', tags: ['noun','grain','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhaub cij no ua los ntawm nplej ntxhuav kws.', english: 'This bread is made from wheat.', source: 'ai' } },
      { id: 'ag-zaub-ntsuab', hmongRPA: 'zaub ntsuab', english: 'baby bok choy; green vegetables', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam kib zaub ntsuab nrog qij rau noj hmo.', english: 'Mom stir-fries baby bok choy with garlic for dinner.', source: 'ai' } },
      { id: 'ag-zaub-qhwv', hmongRPA: 'zaub qhwv', english: 'cabbage', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab zaub qhwv txiav nyias nyias rau hauv cov kua zaub.', english: 'I put thinly sliced cabbage in the soup.', source: 'ai' } },
      { id: 'ag-taub', hmongRPA: 'taub', english: 'pumpkin; squash', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws hau taub ua kua zaub qab heev.', english: 'They boil squash into a very tasty soup.', source: 'ai' } },
      { id: 'ag-zaub-txhwv', hmongRPA: 'zaub txhwv', english: 'cilantro', category: 'agriculture-foodstuffs', tags: ['noun','herb','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov muab zaub txhwv me ntsis rau saum lub tais pho.', english: 'Please put a little cilantro on top of the bowl of pho.', source: 'ai' } },
      { id: 'ag-taub-taj', hmongRPA: 'taub taj', english: 'chayote', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam muab taub taj kib nrog nqaij npuas.', english: 'Mom stir-fries chayote with pork.', source: 'ai' } },
      { id: 'ag-tauj-dub', hmongRPA: 'tauj dub', english: 'lemongrass', category: 'agriculture-foodstuffs', tags: ['noun','herb','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muab tauj dub tso rau hauv cov kua zaub qaib.', english: 'They put lemongrass in the chicken soup.', source: 'ai' } },
      { id: 'ag-nplooj-maj-naus', hmongRPA: 'nplooj maj naus', english: 'lime leaves', category: 'agriculture-foodstuffs', tags: ['noun','herb','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam tso nplooj maj naus rau hauv cov kua zaub kom tsw qab.', english: 'Mom puts lime leaves in the soup so it smells fragrant.', source: 'ai' } },
      { id: 'ag-kua-txob', hmongRPA: 'kua txob', english: 'pepper; chili pepper', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','spice','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj kua txob nrog nqaij ci.', english: 'I like to eat chili peppers with grilled meat.', source: 'ai' } },
      { id: 'ag-dib-ntsuab', hmongRPA: 'dib ntsuab', english: 'cucumber', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv noj dib ntsuab nrog kua txob thiab ntsev.', english: 'I eat cucumber with chili pepper and salt.', source: 'ai' } },
      { id: 'ag-kua-txob-loj', hmongRPA: 'kua txob loj', english: 'large pepper; bell pepper', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','spice','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam txiav kua txob loj tso rau hauv cov zaub kib.', english: 'Mom cuts bell pepper into the stir-fried vegetables.', source: 'ai' } },
      { id: 'ag-dos', hmongRPA: 'dos', english: 'green onion; shallot', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txiav dos rau saum cov kua zaub.', english: 'They chop green onions onto the soup.', source: 'ai' } },
      { id: 'ag-pum-hub', hmongRPA: 'pum hub', english: 'mint leaves', category: 'agriculture-foodstuffs', tags: ['noun','herb','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntxiv pum hub rau hauv kuv lub tais zaub xam lav.', english: 'I add mint leaves to my salad bowl.', source: 'ai' } },
      { id: 'ag-zaub-txig-ntses', hmongRPA: 'zaub txig ntses', english: 'basil', category: 'agriculture-foodstuffs', tags: ['noun','herb','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam muab zaub txig ntses tso rau hauv cov nqaij kib.', english: 'Mom puts basil into the stir-fried meat.', source: 'ai' } },
      { id: 'ag-kaus-taum', hmongRPA: 'kaus taum', english: 'bean sprouts', category: 'agriculture-foodstuffs', tags: ['noun','vegetable','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab kaus taum rau hauv kuv lub tais pho.', english: 'I put bean sprouts in my bowl of pho.', source: 'ai' } },
      { id: 'ag-duaj', hmongRPA: 'duaj', english: 'peach', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus me nyuam noj ib lub duaj thaum tav su.', english: 'The child eats a peach in the afternoon.', source: 'ai' } },
      { id: 'ag-txiv', hmongRPA: 'txiv', english: 'classifier for fruits', category: 'agriculture-foodstuffs', tags: ['classifier','fruit','grammar','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav peb txiv txiv lws suav tom khw.', english: 'I buy three tomatoes at the store.', source: 'ai' } },
      { id: 'ag-moj-mib', hmongRPA: 'moj mib', english: 'jackfruit', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav moj mib siav tom khw.', english: 'We buy ripe jackfruit at the market.', source: 'ai' } },
      { id: 'ag-plab-nyug', hmongRPA: 'plab nyug', english: 'durian', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qee leej nyiam noj plab nyug, tab sis qee leej tsis nyiam nws tsw.', english: 'Some people like to eat durian, but others do not like its smell.', source: 'ai' } },
      { id: 'ag-moj-phaub', hmongRPA: 'moj phaub', english: 'coconut', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws haus dej moj phaub thaum huab cua kub.', english: 'They drink coconut water when the weather is hot.', source: 'ai' } },
      { id: 'ag-pub-luj', hmongRPA: 'pub luj', english: 'pineapple', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiav pub luj ua tej daim rau tsev neeg noj.', english: 'I cut pineapple into pieces for the family to eat.', source: 'ai' } },
      { id: 'ag-lwm-tsib', hmongRPA: 'lwm tsib', english: 'lychee', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov lwm tsib no qab zib thiab txias heev.', english: 'These lychees are very sweet and cool.', source: 'ai' } },
      { id: 'ag-txiv-cuab-thoj', hmongRPA: 'txiv cuab thoj', english: 'guava', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws noj txiv cuab thoj tshiab tom qab noj su.', english: 'They eat fresh guava after lunch.', source: 'ai' } },
      { id: 'ag-nkaus-taw', hmongRPA: 'nkaus taw', english: 'mango', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj nkaus taw siav thaum lub caij ntuj sov.', english: 'I like to eat ripe mangoes in summer.', source: 'ai' } },
      { id: 'ag-tob-ntoos', hmongRPA: 'tob ntoos', english: 'papaya', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam ua zaub xam lav tob ntoos rau noj hmo.', english: 'Mom makes papaya salad for dinner.', source: 'ai' } },
      { id: 'ag-dib-liab', hmongRPA: 'dib liab', english: 'watermelon', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj dib liab txias txias tom qab ua si sab nraum zoov.', english: 'We eat cold watermelon after playing outside.', source: 'ai' } },
      { id: 'ag-dib-pag-do-hau', hmongRPA: 'dib pag do hau', english: 'honeydew melon', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub dib pag do hau no qab zib heev.', english: 'This honeydew melon is very sweet.', source: 'ai' } },
      { id: 'ag-dib-pag', hmongRPA: 'dib pag', english: 'cantaloupe', category: 'agriculture-foodstuffs', tags: ['noun','fruit','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab dib pag tso rau hauv lub tub yees kom txias.', english: 'I put the cantaloupe in the refrigerator to chill.', source: 'ai' } },
      { id: 'ag-tev', hmongRPA: 'tev', english: 'to peel', category: 'agriculture-foodstuffs', tags: ['verb','food-prep','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov tev daim tawv ntawm cov qos yaj ywm ua ntej hau.', english: 'Please peel the potatoes before boiling them.', source: 'ai' } },
      { id: 'ag-chais', hmongRPA: 'chais', english: 'to shave; to slice thinly', category: 'agriculture-foodstuffs', tags: ['verb','food-prep','agriculture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws chais cov nqaij nyias nyias rau hauv lub lauj kaub.', english: 'They slice the meat thinly into the pan.', source: 'ai' } },
      { id: 'ag-daus', hmongRPA: 'daus', english: 'to scoop', category: 'agriculture-foodstuffs', tags: ['verb','food-prep','agriculture','unreviewed','needs-review'], audioFile: null },
      { id: 'ag-kaus', hmongRPA: 'kaus', english: 'to scoop', category: 'agriculture-foodstuffs', tags: ['verb','food-prep','agriculture','unreviewed','needs-review'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `bot-noob` teaches `noob` = seed, and botany is the better home for it. Both arrived in the same import.
      // { id: 'ag-lub-noob', hmongRPA: 'lub noob', english: 'seed', category: 'agriculture-foodstuffs', tags: ['noun','plant','agriculture','unreviewed'], audioFile: null },
      { id: 'ag-qab-zib', hmongRPA: 'qab zib', english: 'sweet', category: 'agriculture-foodstuffs', tags: ['adjective','taste','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nkaus taw siav qab zib heev.', english: 'Ripe mango is very sweet.', source: 'ai' } },
      { id: 'ag-qaub', hmongRPA: 'qaub', english: 'sour', category: 'agriculture-foodstuffs', tags: ['adjective','taste','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txiv maj naus pob taub no qaub heev, ces kuv ntxiv piam thaj me ntsis.', english: 'This lime is very sour, so I add a little sugar.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-nplej', hmongRPA: 'nplej', english: 'rice (still on the plant)', category: 'agriculture-foodstuffs', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov nplej hauv teb tab tom daj lawm.', english: 'The rice in the field is turning golden.', source: 'ai' } },
      { id: 'misc-paj-kws', hmongRPA: 'paj kws', english: 'corn', category: 'agriculture-foodstuffs', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Peb ci paj kws noj thaum tsev neeg sib sau ua ke.', english: 'We grill corn when the family gets together.', source: 'ai' } },
    ],
  },
  {
    id: 'cooking',
    title: 'Cooking',
    description: 'Food preparation, cooking methods, seasonings, and sauces.',
    emoji: '🍳',
    words: [
      { id: 'cook-hlais', hmongRPA: 'hlais', english: 'to cut; to slice', category: 'cooking', tags: ['verb','food-prep','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hlais cov dos ua ntej pib ua noj.', english: 'I slice the onions before starting to cook.', source: 'ai' } },
      { id: 'cook-suam', hmongRPA: 'suam', english: 'to mince', category: 'cooking', tags: ['verb','food-prep','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam suam cov nqaij npuas kom zoo ua ntej kib.', english: 'Mom minces the pork well before frying it.', source: 'ai' } },
      { id: 'cook-txhoov', hmongRPA: 'txhoov', english: 'to chop', category: 'cooking', tags: ['verb','food-prep','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txhoov cov zaub rau hauv lub tais.', english: 'They chop the vegetables into a bowl.', source: 'ai' } },
      { id: 'cook-tsuav', hmongRPA: 'tsuav', english: 'to chop finely', category: 'cooking', tags: ['verb','food-prep','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsuav qij kom me me tso rau hauv cov nqaij kib.', english: 'I finely chop garlic to put in the stir-fried meat.', source: 'ai' } },
      { id: 'cook-zom', hmongRPA: 'zom', english: 'to grind', category: 'cooking', tags: ['verb','food-prep','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zom kua txob nrog qij ua kua liab.', english: 'They grind chili peppers with garlic to make chili sauce.', source: 'ai' } },
      { id: 'cook-hau', hmongRPA: 'hau', english: 'to boil', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam hau qe rau peb noj tshais.', english: 'Mom boils eggs for our breakfast.', source: 'ai' } },
      { id: 'cook-kib', hmongRPA: 'kib', english: 'to deep-fry; to stir-fry', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb kib nqaij qaib rau noj hmo no.', english: 'We fry chicken for dinner tonight.', source: 'ai' } },
      { id: 'cook-nthua', hmongRPA: 'nthua', english: 'to pan-fry', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nthua cov ntses hauv lub lauj kaub kub.', english: 'They pan-fry the fish in a hot pan.', source: 'ai' } },
      { id: 'cook-cub', hmongRPA: 'cub', english: 'to steam', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam cub mov rau tsev neeg noj.', english: 'Mom steams rice for the family to eat.', source: 'ai' } },
      { id: 'cook-ci', hmongRPA: 'ci', english: 'to bake; to broil', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb ci nqaij qaib rau tom qab tsev.', english: 'We grill chicken in the backyard.', source: 'ai' } },
      { id: 'cook-qhwv', hmongRPA: 'qhwv', english: 'to wrap', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam qhwv cov nqaij rau hauv nplooj tsawb ua ntej cub.', english: 'Mom wraps the meat in banana leaves before steaming it.', source: 'ai' } },
      { id: 'cook-kauv', hmongRPA: 'kauv', english: 'to roll', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws kauv daim nplooj zaub nrog nqaij rau hauv.', english: 'They roll the vegetable leaf with meat inside.', source: 'ai' } },
      { id: 'cook-pleev', hmongRPA: 'pleev', english: 'to spread', category: 'cooking', tags: ['verb','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pleev kua ntswv rau saum qhaub cij.', english: 'I spread sauce on the bread.', source: 'ai' } },
      { id: 'cook-ntsev', hmongRPA: 'ntsev', english: 'salt', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov muab ntsev me ntsis rau hauv cov kua zaub.', english: 'Please put a little salt in the soup.', source: 'ai' } },
      { id: 'cook-piam-thaj', hmongRPA: 'piam thaj', english: 'sugar', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab piam thaj me ntsis rau hauv kuv lub khob tshuaj yej.', english: 'I put a little sugar in my cup of tea.', source: 'ai' } },
      { id: 'cook-piam-nuas', hmongRPA: 'piam nuas', english: 'MSG; monosodium glutamate', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muab piam nuas me ntsis rau hauv cov kua zaub kom qab dua.', english: 'They add a little MSG to the soup to make it more flavorful.', source: 'ai' } },
      { id: 'cook-nab-pas', hmongRPA: 'nab pas', english: 'fish sauce', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam ntxiv nab pas me ntsis rau hauv cov kua zaub kom qab dua.', english: 'Mom adds a little fish sauce to the soup to make it more flavorful.', source: 'ai' } },
      { id: 'cook-fwj-txob', hmongRPA: 'fwj txob', english: 'black pepper', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nphoo fwj txob rau saum lub qe kib.', english: 'I sprinkle black pepper over the fried egg.', source: 'ai' } },
      { id: 'cook-kua-dub', hmongRPA: 'kua dub', english: 'soy sauce', category: 'cooking', tags: ['noun','sauce','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muab kua dub rau cov nqaij qaib.', english: 'They put soy sauce on the chicken.', source: 'ai' } },
      { id: 'cook-kua-liab', hmongRPA: 'kua liab', english: 'chili sauce', category: 'cooking', tags: ['noun','sauce','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam noj nqaij nrog kua liab me ntsis.', english: 'I like to eat meat with a little chili sauce.', source: 'ai' } },
      { id: 'cook-kua-txob', hmongRPA: 'kua txob', english: 'chili pepper', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txiav kua txob tso rau hauv zaub kib.', english: 'They cut chili peppers into the stir-fried vegetables.', source: 'ai' } },
      { id: 'cook-qhiav', hmongRPA: 'qhiav', english: 'ginger', category: 'cooking', tags: ['noun','seasoning','cooking','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Niam muab qhiav tso rau hauv cov kua zaub qaib.', english: 'Mom puts ginger in the chicken soup.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-qha', hmongRPA: 'qha', english: 'to dry meat by hanging near fire', category: 'cooking', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-npo', hmongRPA: 'npo', english: 'to filter out, to hold in', category: 'cooking', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tshau', hmongRPA: 'tshau', english: 'to drill; to filter', category: 'cooking', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-txauj', hmongRPA: 'txauj', english: 'a slice', category: 'cooking', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-phuas', hmongRPA: 'phuas', english: 'pulp; curds; bits in liquid', category: 'cooking', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-tshais', hmongRPA: 'tshais', english: 'breakfast', category: 'cooking', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxhib', hmongRPA: 'ntxhib', english: 'rice with shell on; (adjective) rough, coarse', category: 'cooking', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'arts-culture',
    title: 'Arts & Culture',
    description: 'Creative work, visual arts, literature, and cultural vocabulary.',
    emoji: '🎨',
    words: [
      // ⚠️ needs-review. Probably a typo for `kos vaj tse`: `koj` is "you", and `kos` (draw,
      // design) is what an AI batch reached for — "tus kws kos vaj tse", architect. Same class
      // as `plab jlaub` for `plab hlaub`.
      { id: 'art-koj-vaj-tse', hmongRPA: 'koj vaj tse', english: 'architecture', category: 'arts-culture', tags: ['noun','arts','unreviewed','needs-review'], audioFile: null },
      { id: 'art-kos-duab', hmongRPA: 'kos duab', english: 'art; painting; to draw', category: 'arts-culture', tags: ['noun','verb','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus me nyuam ntawd nyiam kos duab tsiaj hauv nws phau ntawv.', english: 'That child likes to draw animals in their notebook.', source: 'ai' } },
      { id: 'art-yeeb-yaj-duab-kas-tsoos', hmongRPA: 'yeeb yaj duab kas tsoos', english: 'comics', category: 'arts-culture', tags: ['noun','arts','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus kwv nyeem yeeb yaj duab kas tsoos txhua hmo.', english: 'My younger brother reads comics every night.', source: 'ai' } },
      { id: 'art-duab-kos', hmongRPA: 'duab kos', english: 'drawing', category: 'arts-culture', tags: ['noun','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws daim duab kos ntawm lub roob zoo nkauj heev.', english: 'Their drawing of the mountain is very beautiful.', source: 'ai' } },
      { id: 'art-dab-neeg', hmongRPA: 'dab neeg', english: 'fiction; story', category: 'arts-culture', tags: ['noun','arts','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws sau ntawv tsim ib zaj dab neeg txog ib tus tub hluas taug txuj kev.', english: 'The writer created a fictional story about a young man on an adventure.', source: 'ai' } },
      { id: 'art-kev-yees-duab-zoo-nkauj', hmongRPA: 'kev yees duab zoo nkauj', english: 'beautiful photography', category: 'arts-culture', tags: ['noun','arts','photography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws kev yees duab zoo nkauj qhia tau lub hnub poob saum roob.', english: 'Their beautiful photography shows the sunset over the mountains.', source: 'ai' } },
      { id: 'art-kos-duab-phab-ntsa', hmongRPA: 'kos duab phab ntsa', english: 'graffiti; wall art', category: 'arts-culture', tags: ['noun','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tub ntxhais hluas kos duab phab ntsa muaj xim ci ntsa iab.', english: 'The young people made bright, colorful wall art.', source: 'ai' } },
      { id: 'art-kev-sau-ntawv-qhia', hmongRPA: 'kev sau ntawv qhia', english: 'explanatory writing; instructional writing', category: 'arts-culture', tags: ['noun','arts','writing','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv no muaj kev sau ntawv qhia txog kev cog zaub.', english: 'This book contains instructional writing about growing vegetables.', source: 'ai' } },
      { id: 'art-kev-kos-duab-txiaj-zoo-nkauj', hmongRPA: 'kev kos duab txiaj zoo nkauj', english: 'mosaic art', category: 'arts-culture', tags: ['noun','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev teev ntuj muaj kev kos duab txiaj zoo nkauj rau ntawm phab ntsa.', english: 'The church has beautiful mosaic art on the wall.', source: 'ai' } },
      { id: 'art-lus-paj-huam', hmongRPA: 'lus paj huam', english: 'poetry', category: 'arts-culture', tags: ['noun','arts','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws sau lus paj huam hais txog lub caij nplooj ntoos hlav.', english: 'They write poetry about spring.', source: 'ai' } },
      { id: 'art-duab-puab', hmongRPA: 'duab puab', english: 'sculpture', category: 'arts-culture', tags: ['noun','arts','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pom ib daim duab puab pob zeb nyob hauv lub vaj.', english: 'We saw a stone sculpture in the garden.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-xov-xwm', hmongRPA: 'xov xwm', english: 'news', category: 'arts-culture', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv saib xov xwm thaum sawv ntxov ua ntej kuv mus ua haujlwm.', english: 'I watch the news in the morning before I go to work.', source: 'ai' } },
      { id: 'misc-keeb-kwm', hmongRPA: 'keeb kwm', english: 'history', category: 'arts-culture', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb kawm keeb kwm Hmoob hauv chav kawm.', english: 'We study Hmong history in class.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-mlom', hmongRPA: 'mlom', english: 'a statue for worshipping', category: 'arts-culture', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ntos', hmongRPA: 'ntos', english: 'to weave', category: 'arts-culture', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nrhia', hmongRPA: 'nrhia', english: 'the triangle shape of embroidery', category: 'arts-culture', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nrhau', hmongRPA: 'nrhau', english: 'to fill in the space with triangle shape', category: 'arts-culture', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nkaj', hmongRPA: 'nkaj', english: 'indigo', category: 'arts-culture', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-sam-thiaj', hmongRPA: 'sam thiaj', english: 'a stage', category: 'arts-culture', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxees', hmongRPA: 'ntxees', english: 'loops, rounds', category: 'arts-culture', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'botany',
    title: 'Botany',
    description: 'Plant parts, trees, soil, and basic botanical vocabulary.',
    emoji: '🌿',
    words: [
      { id: 'bot-ceg-ntoo', hmongRPA: 'ceg ntoo', english: 'branch', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus noog zaum saum ib ceg ntoo.', english: 'The bird sits on a tree branch.', source: 'ai' } },
      // id realigned to the headword 2026-09-20 (was `bot-tauv-nroj`).
      { id: 'bot-tauj-nroj', hmongRPA: 'tauj nroj', english: 'bush', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tsob tauj nroj loj nyob ze lub laj kab.', english: 'There is a large bush near the fence.', source: 'ai' } },
      { id: 'bot-paj', hmongRPA: 'paj', english: 'flower', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov paj hauv lub vaj tab tom tawg zoo nkauj.', english: 'The flowers in the garden are blooming beautifully.', source: 'ai' } },
      { id: 'bot-nyom', hmongRPA: 'nyom', english: 'grass', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov me nyuam ua si saum cov nyom ntsuab.', english: 'The children play on the green grass.', source: 'ai' } },
      { id: 'bot-tshuaj-ntsuab', hmongRPA: 'tshuaj ntsuab', english: 'herbs; herbal medicine; traditional plant medicine', category: 'botany', tags: ['noun','plants','medicine','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yawg siv tshuaj ntsuab los pab daws nws qhov mob khaub thuas.', english: 'Grandfather uses herbal medicine to help relieve his cold.', source: 'ai' } },
      { id: 'bot-daim-nplooj', hmongRPA: 'daim nplooj', english: 'leaf', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib daim nplooj poob los rau hauv dej.', english: 'A leaf fell into the water.', source: 'ai' } },
      { id: 'bot-yub-nroj-tsuag', hmongRPA: 'yub nroj tsuag', english: 'plant', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yub nroj tsuag tshiab rau hauv lub vaj.', english: 'We plant new plants in the garden.', source: 'ai' } },
      { id: 'bot-noob', hmongRPA: 'noob', english: 'seed', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cog noob zaub rau hauv av ntub.', english: 'I plant vegetable seeds in moist soil.', source: 'ai' } },
      { id: 'bot-av', hmongRPA: 'av', english: 'soil; dirt; earth', category: 'botany', tags: ['noun','plants','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov av hauv lub vaj no zoo rau cog zaub.', english: 'The soil in this garden is good for growing vegetables.', source: 'ai' } },
      { id: 'bot-tsob-ntoo', hmongRPA: 'tsob ntoo', english: 'tree', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsob ntoo ntawd muab duab ntxoov ntxoo rau peb.', english: 'That tree gives us shade.', source: 'ai' } },
      { id: 'bot-nroj', hmongRPA: 'nroj', english: 'weed', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv rho cov nroj tawm hauv lub vaj zaub.', english: 'I pull the weeds out of the vegetable garden.', source: 'ai' } },
      { id: 'bot-hmab', hmongRPA: 'hmab', english: 'vine', category: 'botany', tags: ['noun','plants','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov hmab taub nce raws lub laj kab.', english: 'The squash vines climb along the fence.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-ntxhuab', hmongRPA: 'ntxhuab', english: 'moss, water weed, seaweed', category: 'botany', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-hlav', hmongRPA: 'hlav', english: 'to grow (plants)', category: 'botany', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nthab', hmongRPA: 'nthab', english: 'to put forth roots', category: 'botany', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntheeb', hmongRPA: 'ntheeb', english: 'to sprout shoots or buds', category: 'botany', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nthe', hmongRPA: 'nthe', english: 'to weed (gardens, farms)', category: 'botany', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxhuav', hmongRPA: 'ntxhuav', english: 'corn silk; hair-like items', category: 'botany', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'war-conflict',
    title: 'War & Conflict',
    description: 'War, violence, military, and conflict-related vocabulary.',
    emoji: '🕊️',
    words: [
      // ⚠️ needs-review. `rog` is also "overweight" in `descriptions`. Left as "war"
      // here because the deck asks about war; `tsov rog` below is the usual full form.
      // Confirmed by the author 2026-09-30: rog is war / battle / conflict, but mostly a COMPOUND part (tua rog, tub rog,
      // yeej rog, thim rog …); the literal word for war is tsov rog. Was: english: 'war', tags: [..., 'unreviewed', 'needs-review'].
      { id: 'war-rog', hmongRPA: 'rog', english: 'war, battle, conflict — mostly inside compounds (tua rog, tub rog); the literal word for war is tsov rog', category: 'war-conflict', tags: ['noun','war','reviewed'], audioFile: null },
      { id: 'war-tawm-tsam', hmongRPA: 'tawm tsam', english: 'to attack; to oppose', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov pejxeem tawm tsam txoj cai tshiab ntawd.', english: 'The people oppose that new law.', source: 'ai' } },
      { id: 'war-sib-tawm-tsam', hmongRPA: 'sib tawm tsam', english: 'to battle each other; battle', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ob pab tub rog sib tawm tsam ze ntawm lub nroog.', english: 'The two armies battle each other near the city.', source: 'ai' } },
      { id: 'war-npoos', hmongRPA: 'npoos', english: 'bomb', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg khiav mus nkaum thaum lawv hnov npoos tawg.', english: 'People ran for shelter when they heard a bomb explode.', source: 'ai' } },
      { id: 'war-phom', hmongRPA: 'phom', english: 'gun; firearm', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tub ceev xwm nqa phom raws li txoj cai thiab kev cob qhia.', english: 'Police carry firearms according to law and training.', source: 'ai' } },
      { id: 'war-kaus-mom', hmongRPA: 'kaus mom', english: 'helmet', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus caij maus taus hnav kaus mom kom nyab xeeb.', english: 'The motorcycle rider wears a helmet for safety.', source: 'ai' } },
      { id: 'war-tseb-tua-nrog', hmongRPA: 'tseb tua nrog', english: 'invasion', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov pejxeem ntshai tsam muaj kev tseb tua nrog los ntawm lwm lub teb chaws.', english: 'The people fear an invasion from another country.', source: 'ai' } },
      { id: 'war-caws-foob-pob', hmongRPA: 'caws foob pob', english: 'land mine', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaj chaw ntawd muaj caws foob pob, ces tsis txhob taug kev mus ntawd.', english: 'That area has land mines, so do not walk there.', source: 'ai' } },
      { id: 'war-kev-thaj-yeeb', hmongRPA: 'kev thaj yeeb', english: 'peace; peacetime', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txhua tus xav kom muaj kev thaj yeeb hauv lawv lub zej zog.', english: 'Everyone wants peace in their community.', source: 'ai' } },
      { id: 'war-tawm-khiav', hmongRPA: 'tawm khiav', english: 'to retreat; flee', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg nyob hauv zos tau tawm khiav thaum muaj kev sib ntaus.', english: 'The villagers fled when fighting began.', source: 'ai' } },
      { id: 'war-tsov-rog', hmongRPA: 'tsov rog', english: 'war — the literal word for war', category: 'war-conflict', tags: ['noun','war','reviewed'],  /* was 'war; warfare — the usual full form', unreviewed — confirmed by the author 2026-09-30 */ audioFile: null, exampleSentence: { hmong: 'Tsov rog ua rau ntau tsev neeg tau khiav tawm lawv lub zos.', english: 'War caused many families to flee their villages.', source: 'ai' } },
      { id: 'war-kev-tsov-rog', hmongRPA: 'kev tsov rog', english: 'war, warfare — the abstract noun (kev + tsov rog)', category: 'war-conflict', tags: ['noun','war','reviewed'], audioFile: null },  // the author, 2026-09-30
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-xib-xub', hmongRPA: 'xib xub', english: 'arrow', category: 'war-conflict', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Tus neeg tua hneev tua ib rab xib xub rau ntawm lub hom phiaj.', english: 'The archer shot an arrow at the target.', source: 'ai' } },
      // ── Added 2026-09-30 — the author's list: military words and fighting verbs.
      { id: 'war-tub-rog', hmongRPA: 'tub rog', english: 'soldier; warrior; infantry; also the rank of private',  /* 'private' added 2026-09-30 (author) */ category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-thawj-tub-rog', hmongRPA: 'thawj tub rog', english: 'general; military commander — the highest rank',  /* the author's ranks list, 2026-09-30 */ category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-phauj-rog', hmongRPA: 'phauj rog', english: 'army; military force (general)', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-yeeb-ncuab', hmongRPA: 'yeeb ncuab', english: 'enemy; opposition', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tua', hmongRPA: 'tua', english: 'to fire something; to shoot', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },  // author: "add an additional definition" — also misc-tua
      { id: 'war-tshum-rom', hmongRPA: 'tshum rom', english: 'to attack; to charge into battle', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tua-rog', hmongRPA: 'tua rog', english: 'to fight in a war', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'war-yeej-rog', hmongRPA: 'yeej rog', english: 'to win a war', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'war-thim-rog', hmongRPA: 'thim rog', english: 'to retreat', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'war-sib-ntaus', hmongRPA: 'sib ntaus', english: 'to fight each other (general)', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },  // also in Reciprocals (reciprocals-fight)
      { id: 'war-sib-tua', hmongRPA: 'sib tua', english: 'to fight to the death; to kill each other', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — the author's list: combat.
      { id: 'war-tshum', hmongRPA: 'tshum', english: 'to charge; to assault (combat)', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'war-vov', hmongRPA: 'vov', english: 'to take cover; to hide and ambush', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },  // the everyday sense (cover something) is misc-vov
      { id: 'war-tiv-thaiv', hmongRPA: 'tiv thaiv', english: 'to defend; to parry', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },  // also misc-tiv-thaiv (reading)
      { id: 'war-tsoo', hmongRPA: 'tsoo', english: 'to clash; to encounter the enemy in battle; to collide in battle', category: 'war-conflict', tags: ['verb', 'war', 'reviewed'], audioFile: null },  // also misc-tsoo (reading)
      { id: 'war-neeg-sib-taus', hmongRPA: 'neeg sib taus', english: 'a combatant, a fighter — when not referring to a soldier or military member directly', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },  // spelled as the author gave it ("sib taus", not "sib ntaus") — asked, see TODO
      { id: 'war-kev-sib-ntaus', hmongRPA: 'kev sib ntaus', english: 'combat', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-kev-sib-tua', hmongRPA: 'kev sib tua', english: 'armed combat; war', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-kev-dag-nyob', hmongRPA: 'kev dag nyob', english: 'propaganda', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      // ── Military ranks, highest first (the author, 2026-09-30). thawj tub rog (general) and tub rog
      // (soldier; now also private) were added earlier the same day.
      { id: 'war-tswv-tsoom', hmongRPA: 'tswv tsoom', english: 'commander (general) — a higher rank', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tswv-tsev-phom-ntev', hmongRPA: 'tswv tsev phom ntev', english: 'colonel', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tswv-tsev-rog', hmongRPA: 'tswv tsev rog', english: 'major (rank)', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tswv-rog-hluas', hmongRPA: 'tswv rog hluas', english: 'lieutenant', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tswv-pab', hmongRPA: 'tswv pab', english: 'sergeant', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-thawj-tub', hmongRPA: 'thawj tub', english: 'corporal', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'war-tsoom-rog', hmongRPA: 'tsoom rog', english: 'platoon; company', category: 'war-conflict', tags: ['noun', 'war', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── WEAPONS — 2026-09-30, the author's list (split from War & Conflict so neither set is a
    // wall). ⚠️ Homonyms, as the author gave them: "kuv" here is spear (also the pronoun I);
    // "hais" here is to stab (also to say). Asked the author to confirm both — see notes/TODO.md.
    id: 'weapons',
    title: 'Weapons',
    description: 'Bows, blades and guns — and what you do with them.',
    emoji: '🏹',
    words: [
      { id: 'wpn-hneev', hmongRPA: 'hneev', english: 'bow (weapon)', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hneev-tshuam', hmongRPA: 'hneev tshuam', english: 'crossbow', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-ntaub-hneev', hmongRPA: 'ntaub hneev', english: 'bowstring', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-xub-hneev', hmongRPA: 'xub hneev', english: 'arrow', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hmuv-txhais', hmongRPA: 'hmuv txhais', english: 'ranged weapon', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-riam-hlob', hmongRPA: 'riam hlob', english: 'sword', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-riam-rhais', hmongRPA: 'riam rhais', english: 'dagger; switchblade; combat knife; stabbing knife', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-riam-txiav', hmongRPA: 'riam txiav', english: 'cleaver; cutting knife', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-txuas', hmongRPA: 'txuas', english: 'sickle', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-tuam-tsuam', hmongRPA: 'tuam tsuam', english: 'battle axe', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-cuab-yeej-tsov-rog', hmongRPA: 'cuab yeej tsov rog', english: 'weapons, specifically', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — cf. cov cuab yeej (tools-household)
      { id: 'wpn-kuv', hmongRPA: 'kuv', english: 'spear', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-maum-nphoo', hmongRPA: 'maum nphoo', english: 'slingshot', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-phom-luv', hmongRPA: 'phom luv', english: 'handgun', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-phom-ntev', hmongRPA: 'phom ntev', english: 'rifle; shotgun; long gun', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-phom-hluav-taws', hmongRPA: 'phom hluav taws', english: 'automatic rifle; machine gun; automatic firearm', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-phom-cua', hmongRPA: 'phom cua', english: 'air gun; air rifle — can also mean airsoft', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hnub-riam', hmongRPA: 'hnub riam', english: 'knife sheath; scabbard', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-mos-txwv', hmongRPA: 'mos txwv', english: 'bullet; ammunition (general)', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-bav-hneev', hmongRPA: 'bav hneev', english: 'to draw or cock a bow', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-txiav', hmongRPA: 'txiav', english: 'to cut', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hais', hmongRPA: 'hais', english: 'to stab', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — the author's second list: blunt weapons and hitting.
      { id: 'wpn-chiav', hmongRPA: 'chiav', english: 'club; heavy stick weapon; bludgeoning weapon', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-tsum-chiav', hmongRPA: 'tsum chiav', english: 'large wooden club; bludgeoning weapon', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hlob', hmongRPA: 'hlob', english: 'cane; a stick used as a weapon — also qws', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-qws', hmongRPA: 'qws', english: 'cane; a stick used as a weapon — also hlob', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-rhaub', hmongRPA: 'rhaub', english: 'mallet; heavy hammer', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-rhom', hmongRPA: 'rhom', english: 'sledgehammer; heavy hammer', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-ntaus', hmongRPA: 'ntaus', english: 'to hit, strike, or beat', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-rhaub-tsoo', hmongRPA: 'rhaub tsoo', english: 'to smash or bash with a heavy object', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — the author's list: explosives, fire and smoke.
      { id: 'wpn-tshuaj-phom', hmongRPA: 'tshuaj phom', english: 'gunpowder; smokeless powder; explosive powder', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-laib-miv', hmongRPA: 'laib miv', english: 'bomb; grenade; dynamite; explosive device', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },  // cf. war-npoos (npoos, bomb) in War & Conflict
      { id: 'wpn-pob-rhaub', hmongRPA: 'pob rhaub', english: 'landmine', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },  // cf. war-caws-foob-pob (caws foob pob, land mine) in War & Conflict
      { id: 'wpn-tshuav-taws', hmongRPA: 'tshuav taws', english: 'fireworks; firecrackers — the general, non-combat term; also the fire sparks of a detonation', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-ntsaj', hmongRPA: 'ntsaj', english: 'to explode, to detonate (intransitive)', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-tso-laib-miv', hmongRPA: 'tso laib miv', english: 'to drop a bomb; to detonate', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-phas', hmongRPA: 'phas', english: 'to blast, to blow up', category: 'weapons', tags: ['verb', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-ntsoog', hmongRPA: 'ntsoog', english: 'shattered; blown into pieces', category: 'weapons', tags: ['adjective', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-hluav-taws', hmongRPA: 'hluav taws', english: 'fire; blaze', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      { id: 'wpn-ua-pa-taws', hmongRPA: 'ua pa taws', english: 'a smoke cloud (general)', category: 'weapons', tags: ['noun', 'war', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-hmuv', hmongRPA: 'hmuv', english: 'a spear', category: 'weapons', tags: ['noun', 'reviewed'], audioFile: null },
    ],
  },
  // ⚠️ COMMENTED OUT 2026-09-30 (author: "keep the original categories but comment them out — put relevant
  // words in relevant spots"). Every word NOT already in the dictionary now lives in the category that
  // fits its meaning; words that already existed were left alone ("can't have multiple of the same").
  // TO RESTORE: uncomment, and remove the "from the author's word list" cards from their new homes.
  // {
  //   // ── WORDS BY SOUND — 2026-09-30, the author's word list (_incoming/author-word-list-2026-09-30.json).
  //   // 12 groups of ~20, each built on a set of starting consonants, as the list itself is grouped.
  //   id: 'words-by-sound-klmn',
  //   title: 'Words by Sound 1: K, L, M, N',
  //   description: 'Words starting with K, L, M, N.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-kab-lia', hmongRPA: 'kab lia', english: 'a dimple; a mealworm', category: 'words-by-sound-klmn', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Kablia
  //     { id: 'wbs-kawj', hmongRPA: 'kawj', english: 'to start', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-kob-huam', hmongRPA: 'kob huam', english: 'to be in a poor state; “flat broke”', category: 'words-by-sound-klmn', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Kobhuam
  //     { id: 'wbs-kwv-yees', hmongRPA: 'kwv yees', english: 'to estimate; (adjective) approximately', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Kwvyees
  //     { id: 'wbs-keeb', hmongRPA: 'keeb', english: 'the origin, starting point', category: 'words-by-sound-klmn', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-laj-muam', hmongRPA: 'laj muam', english: 'to side glance; (adjective) to be cross-eyed', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Lajmuam
  //     { id: 'wbs-las-mees', hmongRPA: 'las mees', english: 'to ignore, not respond', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Lasmees
  //     { id: 'wbs-lauj-vaub', hmongRPA: 'lauj vaub', english: 'to be messy; to be in knots, tangled', category: 'words-by-sound-klmn', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Laujvaub
  //     { id: 'wbs-lees', hmongRPA: 'lees', english: 'to confess, admit', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-looj-hlias', hmongRPA: 'looj hlias', english: 'to doze off', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Loojhlias
  //     { id: 'wbs-mab', hmongRPA: 'mab', english: 'non-Hmong people', category: 'words-by-sound-klmn', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-maub', hmongRPA: 'maub', english: 'to go or do without seeing', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-meej-pem', hmongRPA: 'meej pem', english: 'to be clear, understandable', category: 'words-by-sound-klmn', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Meejpem
  //     { id: 'wbs-meem-txom', hmongRPA: 'meem txom', english: 'to be uncomfortable', category: 'words-by-sound-klmn', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Meemtxom
  //     { id: 'wbs-moj-zeej', hmongRPA: 'moj zeej', english: 'a scarecrow; statues in general', category: 'words-by-sound-klmn', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Mojzeej
  //     { id: 'wbs-noo', hmongRPA: 'noo', english: 'to be damp', category: 'words-by-sound-klmn', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nuv', hmongRPA: 'nuv', english: 'to bow; to fish', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nuam-yaj', hmongRPA: 'nuam yaj', english: 'to sight-see', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Nuamyaj
  //     { id: 'wbs-nim-no', hmongRPA: 'nim no', english: 'now-a-days', category: 'words-by-sound-klmn', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nog', hmongRPA: 'nog', english: 'to strap on to something', category: 'words-by-sound-klmn', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-pqrs',
  //   title: 'Words by Sound 2: P, Q, R, S',
  //   description: 'Words starting with P, Q, R, S.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-pauj', hmongRPA: 'pauj', english: 'to revenge; to payback', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-peem', hmongRPA: 'peem', english: 'to endure', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pej-xeem', hmongRPA: 'pej xeem', english: 'citizens, people', category: 'words-by-sound-pqrs', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Pejxeem
  //     { id: 'wbs-piam-sij', hmongRPA: 'piam sij', english: 'to be ruined, broken', category: 'words-by-sound-pqrs', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Piamsij
  //     { id: 'wbs-puab', hmongRPA: 'puab', english: 'to make by molding', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qab-ntug', hmongRPA: 'qab ntug', english: 'the horizon', category: 'words-by-sound-pqrs', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Qabntug
  //     { id: 'wbs-qaim-hli', hmongRPA: 'qaim hli', english: 'to have moonlight', category: 'words-by-sound-pqrs', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qaug-quav', hmongRPA: 'qaug quav', english: 'to be “addicted” to something', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qee', hmongRPA: 'qee', english: 'to reduce; to save; (noun) some', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qauv', hmongRPA: 'qauv', english: 'pattern; role model', category: 'words-by-sound-pqrs', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ras', hmongRPA: 'ras', english: 'to recall, remember', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rauv', hmongRPA: 'rauv', english: 'to burn (firewood)', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-raus', hmongRPA: 'raus', english: 'to dip in/into; to participate', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rawm', hmongRPA: 'rawm', english: 'to be in a rush', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rais', hmongRPA: 'rais', english: 'to become', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-sab-laj', hmongRPA: 'sab laj', english: 'to brainstorm, discuss, plan', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Sablaj
  //     { id: 'wbs-sam-thiaj', hmongRPA: 'sam thiaj', english: 'a stage', category: 'words-by-sound-pqrs', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Samthiaj
  //     { id: 'wbs-sawb-lawj', hmongRPA: 'sawb lawj', english: 'to take everything', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Sawblawj
  //     { id: 'wbs-sawv-cev', hmongRPA: 'sawv cev', english: 'to represent; on behalf of', category: 'words-by-sound-pqrs', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-suab-puam', hmongRPA: 'suab puam', english: 'desert/barren area, mostly near bodies of water', category: 'words-by-sound-pqrs', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-tvxyz',
  //   title: 'Words by Sound 3: T, V, X, Y, Z',
  //   description: 'Words starting with T, V, X, Y, Z.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-tab-kaum', hmongRPA: 'tab kaum', english: 'to interrupt; to annoy', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Tabkaum
  //     { id: 'wbs-tauv-pem', hmongRPA: 'tauv pem', english: 'to visit/hang out with friends & family', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-taub-teg', hmongRPA: 'taub teg', english: 'fingerprint; fingertips', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Taubteg
  //     { id: 'wbs-tem-toob', hmongRPA: 'tem toob', english: 'to be forgetful; not aware', category: 'words-by-sound-tvxyz', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Temtoob
  //     { id: 'wbs-taug-xaiv', hmongRPA: 'taug xaiv', english: 'to gossip; gossip', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-vaj-huam', hmongRPA: 'vaj huam', english: 'human rights', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Vajhuam
  //     { id: 'wbs-vaj-loog', hmongRPA: 'vaj loog', english: 'kingdom, fenced in large property', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Vajloog
  //     { id: 'wbs-vam-meej', hmongRPA: 'vam meej', english: 'prosperous; affluent; successful', category: 'words-by-sound-tvxyz', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Vammeej
  //     { id: 'wbs-vij-tsam', hmongRPA: 'vij tsam', english: 'tent screen; mosquito net', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Vijtsam
  //     { id: 'wbs-vuab-tsuab', hmongRPA: 'vuab tsuab', english: 'dirty, filthy', category: 'words-by-sound-tvxyz', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Vuabtsuab
  //     { id: 'wbs-xawb', hmongRPA: 'xawb', english: 'to search for; to look through', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-xeeb-ceem', hmongRPA: 'xeeb ceem', english: 'personality', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Xeebceem
  //     { id: 'wbs-xij-peem', hmongRPA: 'xij peem', english: 'to not stress about it', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Xijpeem
  //     { id: 'wbs-xab-nag-kis', hmongRPA: 'xab nag kis', english: 'the days ahead; days to come', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Xabnagkis
  //     { id: 'wbs-yaj-ceeb', hmongRPA: 'yaj ceeb', english: 'life on earth', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Yajceeb
  //     { id: 'wbs-yais', hmongRPA: 'yais', english: 'to distribute, pass out', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-yaj-sab', hmongRPA: 'yaj sab', english: 'location on mountains, highlands', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Yajsab
  //     { id: 'wbs-zab', hmongRPA: 'zab', english: 'to lie; (noun) a liar', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-zes', hmongRPA: 'zes', english: 'to bother; to light a fire, ignite', category: 'words-by-sound-tvxyz', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-zoov-nuj-txeeg', hmongRPA: 'zoov nuj txeeg', english: 'jungle; forest', category: 'words-by-sound-tvxyz', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Zoov nujtxeeg
  //   ],
  // },
  // {
  //   id: 'words-by-sound-ch-nc-dh',
  //   title: 'Words by Sound 4: Ch, Nc, Dh',
  //   description: 'Words starting with Ch, Nc, Dh.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-chaws', hmongRPA: 'chaws', english: 'to thread (a needle); to duck under, pull back', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-cheem', hmongRPA: 'cheem', english: 'to halt, stop; (preposition) while, during', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-chua', hmongRPA: 'chua', english: 'to snatch away fast', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-chom', hmongRPA: 'chom', english: 'to be sticking out', category: 'words-by-sound-ch-nc-dh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-cheeb-tsam', hmongRPA: 'cheeb tsam', english: 'location, place; county', category: 'words-by-sound-ch-nc-dh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Cheebtsam
  //     { id: 'wbs-chiv', hmongRPA: 'chiv', english: 'fertilizer; beginning, start; Origin; (verb) to toast, to pour a drink', category: 'words-by-sound-ch-nc-dh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-chwv', hmongRPA: 'chwv', english: 'to touch with any part of the body', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncab', hmongRPA: 'ncab', english: 'to stretch', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncauj-ncab', hmongRPA: 'ncauj ncab', english: 'to be overly talkative', category: 'words-by-sound-ch-nc-dh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncawg', hmongRPA: 'ncawg', english: 'to have a close relationship with, be used to, familiar with', category: 'words-by-sound-ch-nc-dh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncia', hmongRPA: 'ncia', english: 'to sob; to gasp; to struggle for air', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncaim', hmongRPA: 'ncaim', english: 'to leave; to separate', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncua', hmongRPA: 'ncua', english: 'to pause; (adjective) far, distant', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncav', hmongRPA: 'ncav', english: 'to reach for', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncaig', hmongRPA: 'ncaig', english: 'hot, burning charcoal', category: 'words-by-sound-ch-nc-dh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-dheev', hmongRPA: 'dheev', english: 'suddenly, instantly', category: 'words-by-sound-ch-nc-dh', tags: ['expression', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-dhuav', hmongRPA: 'dhuav', english: 'to be tired of, sick of', category: 'words-by-sound-ch-nc-dh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-dhas', hmongRPA: 'dhas', english: 'to separate using thumb (corn kernel)', category: 'words-by-sound-ch-nc-dh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-dhau', hmongRPA: 'dhau', english: 'pass a point, (adjective) more, a lot, etc.', category: 'words-by-sound-ch-nc-dh', tags: ['preposition', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-dhos', hmongRPA: 'dhos', english: 'together, fit', category: 'words-by-sound-ch-nc-dh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-kh-nk-hl-hm-ml',
  //   title: 'Words by Sound 5: Kh, Nk, Hl, Hm, Ml',
  //   description: 'Words starting with Kh, Nk, Hl, Hm, Ml.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-khab-seeb', hmongRPA: 'khab seeb', english: 'to be spacious, roomy', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Khabseeb
  //     { id: 'wbs-khaum', hmongRPA: 'khaum', english: 'to be cursed for doing bad deeds', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-khuam-kev', hmongRPA: 'khuam kev', english: 'to be in the way, to be underfoot', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-kheev', hmongRPA: 'kheev', english: 'to allow', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-khav-theeb', hmongRPA: 'khav theeb', english: 'to show off', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Khavtheeb
  //     { id: 'wbs-khub', hmongRPA: 'khub', english: 'a pair; (adjective) to be stained; (verb) to stain', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-kheej', hmongRPA: 'kheej', english: 'whole', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkim', hmongRPA: 'nkim', english: 'to waste', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkos', hmongRPA: 'nkos', english: 'to be slippery, muddy/wet, gooey', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkaj', hmongRPA: 'nkaj', english: 'indigo', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkauj-xwb', hmongRPA: 'nkauj xwb', english: 'unmarried girls', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hluav', hmongRPA: 'hluav', english: 'burnt matter', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hlav', hmongRPA: 'hlav', english: 'to grow (plants)', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hla', hmongRPA: 'hla', english: 'to cross or step over; to skip over', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hmab', hmongRPA: 'hmab', english: 'a vine', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hmuv', hmongRPA: 'hmuv', english: 'a spear', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hmoov', hmongRPA: 'hmoov', english: 'luck', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-mlom', hmongRPA: 'mlom', english: 'a statue for worshipping', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-mluas', hmongRPA: 'mluas', english: 'to be depressed or sad looking', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-mluav', hmongRPA: 'mluav', english: 'to be dented; (noun) a dent', category: 'words-by-sound-kh-nk-hl-hm-ml', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-hn-ph-np-pl',
  //   title: 'Words by Sound 6: Hn, Ph, Np, Pl',
  //   description: 'Words starting with Hn, Ph, Np, Pl.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-hneev', hmongRPA: 'hneev', english: 'hunting bow; foot/hand print', category: 'words-by-sound-hn-ph-np-pl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hnub-qab-nram-ntsis', hmongRPA: 'hnub qab nram ntsis', english: 'in the future; someday later on', category: 'words-by-sound-hn-ph-np-pl', tags: ['preposition', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phaum', hmongRPA: 'phaum', english: 'a generation, a group of the same season or period', category: 'words-by-sound-hn-ph-np-pl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pheeb', hmongRPA: 'pheeb', english: 'to lean against/on', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pheej', hmongRPA: 'pheej', english: 'to keep/continue an action', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phuas', hmongRPA: 'phuas', english: 'pulp; curds; bits in liquid', category: 'words-by-sound-hn-ph-np-pl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phim', hmongRPA: 'phim', english: 'to be similar/match', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phov', hmongRPA: 'phov', english: 'to make a ruckus, make noise; to torch off hair, fur, etc.', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phoom', hmongRPA: 'phoom', english: 'to bump into, run into', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npub', hmongRPA: 'npub', english: 'to be dull, blunt', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npo', hmongRPA: 'npo', english: 'to filter out, to hold in', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npam', hmongRPA: 'npam', english: 'to be cursed', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npuaj', hmongRPA: 'npuaj', english: 'to hit with the palm', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npuab', hmongRPA: 'npuab', english: 'right up against, right next to', category: 'words-by-sound-hn-ph-np-pl', tags: ['preposition', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-plua-plav', hmongRPA: 'plua plav', english: 'dust', category: 'words-by-sound-hn-ph-np-pl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pluas', hmongRPA: 'pluas', english: 'to be tart, (noun) classifier for meals', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-plau', hmongRPA: 'plau', english: 'to run away', category: 'words-by-sound-hn-ph-np-pl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pluav', hmongRPA: 'pluav', english: 'to be flattened', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-pluam', hmongRPA: 'pluam', english: 'to pop, such as water balloon', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-plees', hmongRPA: 'plees', english: 'to be silly', category: 'words-by-sound-hn-ph-np-pl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-qh-nq-rh-nr',
  //   title: 'Words by Sound 7: Qh, Nq, Rh, Nr',
  //   description: 'Words starting with Qh, Nq, Rh, Nr.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-qhua', hmongRPA: 'qhua', english: 'a guest', category: 'words-by-sound-qh-nq-rh-nr', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qha', hmongRPA: 'qha', english: 'to dry meat by hanging near fire', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qhuab-qhia', hmongRPA: 'qhuab qhia', english: 'to teach, to lecture', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qhau', hmongRPA: 'qhau', english: 'to pull down; to wrestle down', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-qhuas', hmongRPA: 'qhuas', english: 'to praise', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqag', hmongRPA: 'nqag', english: 'a team, group based on common grounds', category: 'words-by-sound-qh-nq-rh-nr', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqawm', hmongRPA: 'nqawm', english: 'to be healed (wounds)', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nquam', hmongRPA: 'nquam', english: 'to row', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqaj', hmongRPA: 'nqaj', english: 'a beam', category: 'words-by-sound-qh-nq-rh-nr', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqaim', hmongRPA: 'nqaim', english: 'to be narrow', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rhais', hmongRPA: 'rhais', english: 'to pin, to step; (noun) a pin', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rhawv', hmongRPA: 'rhawv', english: 'to create, make; a bathtub; large cement or stone pot', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rhiab', hmongRPA: 'rhiab', english: 'to be ticklish; to be grossed out by', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-rhuav', hmongRPA: 'rhuav', english: 'to take apart, destroy; to ruin, humiliate', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nrawm', hmongRPA: 'nrawm', english: 'to be fast; to be quick', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nro', hmongRPA: 'nro', english: 'to be murky', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nroo', hmongRPA: 'nroo', english: 'to complain; to rumble (thunder)', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nrug', hmongRPA: 'nrug', english: 'to be apart; to be far', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nruj', hmongRPA: 'nruj', english: 'to be strict; to be tight', category: 'words-by-sound-qh-nq-rh-nr', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nruab', hmongRPA: 'nruab', english: 'to put in/on; to insert', category: 'words-by-sound-qh-nq-rh-nr', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-th-nt-ts-tx-xy',
  //   title: 'Words by Sound 8: Th, Nt, Ts, Tx, Xy',
  //   description: 'Words starting with Th, Nt, Ts, Tx, Xy.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-thawm', hmongRPA: 'thawm', english: 'to be soaked through; (verb) to soak', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-thee', hmongRPA: 'thee', english: 'charcoal', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-theej', hmongRPA: 'theej', english: 'to replace; to exchange', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-thim', hmongRPA: 'thim', english: 'to return an item; to step back, withdraw; to fade (shade)', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-thom-khwm', hmongRPA: 'thom khwm', english: 'a sock; a stocking', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },  // the list: Thomkhwm
  //     { id: 'wbs-thiaj', hmongRPA: 'thiaj', english: 'to carry, move items; (adverb) therefore', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nta', hmongRPA: 'nta', english: 'to switch on; to pay for a wedding; to open up (umbrella); (noun) pole for carrying buckets of water', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntaug', hmongRPA: 'ntaug', english: 'to stomp; (adjective) smooth, silky', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntiab', hmongRPA: 'ntiab', english: 'to force out; evict; expel', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntos', hmongRPA: 'ntos', english: 'to weave', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tsau', hmongRPA: 'tsau', english: 'to soak; (adjective) to be full', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tsaug', hmongRPA: 'tsaug', english: 'to rinse; to thank (adjective) to be numb', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tsawm', hmongRPA: 'tsawm', english: 'to scold', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tseb', hmongRPA: 'tseb', english: 'to scatter; distribute', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txauj', hmongRPA: 'txauj', english: 'a slice', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txaws', hmongRPA: 'txaws', english: 'to splash', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txej', hmongRPA: 'txej', english: 'to spill', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-xyeej', hmongRPA: 'xyeej', english: 'to be available; (verb) to not be agreeable to', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-xyu', hmongRPA: 'xyu', english: 'to sigh', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-xyeeb', hmongRPA: 'xyeeb', english: 'to brush aside, cast away/aside', category: 'words-by-sound-th-nt-ts-tx-xy', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-ny-nch-nkh-hml-nph-npl',
  //   title: 'Words by Sound 9: Ny, Nch, Nkh, Hml, Nph, Npl',
  //   description: 'Words starting with Ny, Nch, Nkh, Hml, Nph, Npl.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-nyas', hmongRPA: 'nyas', english: 'to stalk; to track or follow behind', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nyo', hmongRPA: 'nyo', english: 'to lower one’s head downward', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nyog', hmongRPA: 'nyog', english: 'worthy', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nyoo', hmongRPA: 'nyoo', english: 'to give up', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nyooj', hmongRPA: 'nyooj', english: 'to groan', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nchias', hmongRPA: 'nchias', english: 'to tiptoe (ua nchias)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ncha', hmongRPA: 'ncha', english: 'echo; (adjective) loud', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nchav', hmongRPA: 'nchav', english: 'rough, forceful', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkhib', hmongRPA: 'nkhib', english: 'corner section of (branch, toes, etc.)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkhawb', hmongRPA: 'nkhawb', english: 'soot', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nkham', hmongRPA: 'nkham', english: 'to walk on hands & feet (ua nkham)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hmlos', hmongRPA: 'hmlos', english: 'to be dented', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nphau', hmongRPA: 'nphau', english: 'to flip over; to flip over (waves)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nphob', hmongRPA: 'nphob', english: 'to be faded', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nphoo', hmongRPA: 'nphoo', english: 'to sprinkle on', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nphav', hmongRPA: 'nphav', english: 'to bump into', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nplaim', hmongRPA: 'nplaim', english: 'flame; surface of water (waves)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nplai', hmongRPA: 'nplai', english: 'scales (fish)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-npleem', hmongRPA: 'npleem', english: 'to slip (fall)', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nplauv', hmongRPA: 'nplauv', english: 'a scrubbing brush', category: 'words-by-sound-ny-nch-nkh-hml-nph-npl', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-ph-nqh-nrh-nth',
  //   title: 'Words by Sound 10: Ph, Nqh, Nrh, Nth',
  //   description: 'Words starting with Ph, Nqh, Nrh, Nth.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-phaws', hmongRPA: 'phaws', english: 'dandruff; (expression) quickly', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phis', hmongRPA: 'phis', english: 'to shed', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phom-moj', hmongRPA: 'phom moj', english: 'to be mischievous; overly playful', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },  // the list: Phommoj
  //     // (Phov: "to torch off hair, fur, etc." merged into the earlier phov card — the list gives it twice)
  //     { id: 'wbs-phaub', hmongRPA: 'phaub', english: 'the cover or shell', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-phws', hmongRPA: 'phws', english: 'to gently touch or stroke', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqha', hmongRPA: 'nqha', english: 'to be empty; cleared of trees', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqhuab', hmongRPA: 'nqhuab', english: 'to dry up (body of water)', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nqhis', hmongRPA: 'nqhis', english: 'to crave for', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nrhoob', hmongRPA: 'nrhoob', english: 'a leg warmer', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nrhia', hmongRPA: 'nrhia', english: 'the triangle shape of embroidery', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nrhau', hmongRPA: 'nrhau', english: 'to fill in the space with triangle shape', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthab', hmongRPA: 'nthab', english: 'to put forth roots', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthee', hmongRPA: 'nthee', english: 'the attic', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthua', hmongRPA: 'nthua', english: 'to pan fry', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthe', hmongRPA: 'nthe', english: 'to weed (gardens, farms)', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthaw', hmongRPA: 'nthaw', english: 'to shout', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntheeb', hmongRPA: 'ntheeb', english: 'to sprout shoots or buds', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthos', hmongRPA: 'nthos', english: 'to walk limply (ceg ntheeb)', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-nthwv', hmongRPA: 'nthwv', english: 'to snatch away; (classifier) classifier for a gust of wind', category: 'words-by-sound-ph-nqh-nrh-nth', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-tsh-nts-txh',
  //   title: 'Words by Sound 11: Tsh, Nts, Txh',
  //   description: 'Words starting with Tsh, Nts, Txh.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-tshob', hmongRPA: 'tshob', english: 'a dipper; (verb) to scold, lecture', category: 'words-by-sound-tsh-nts-txh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshuam', hmongRPA: 'tshuam', english: 'intersection; (verb) to intersect', category: 'words-by-sound-tsh-nts-txh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshee', hmongRPA: 'tshee', english: 'to shake, shiver', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshiav', hmongRPA: 'tshiav', english: 'to scrape, to polish, to rub', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshais', hmongRPA: 'tshais', english: 'breakfast', category: 'words-by-sound-tsh-nts-txh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tsham', hmongRPA: 'tsham', english: 'to visit and chat', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshau', hmongRPA: 'tshau', english: 'to drill; to filter', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshawb-fawb', hmongRPA: 'tshawb fawb', english: 'to research, examine, search', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },  // the list: Tshawbfawb
  //     { id: 'wbs-tshom', hmongRPA: 'tshom', english: 'to dig, plow', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-tshua', hmongRPA: 'tshua', english: 'to miss or think of dearly', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsaub', hmongRPA: 'ntsaub', english: 'to dive down; to come together', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsiab', hmongRPA: 'ntsiab', english: 'to grab or claw at', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsa', hmongRPA: 'ntsa', english: 'to glow', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsauv', hmongRPA: 'ntsauv', english: 'to crowd around', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntswj', hmongRPA: 'ntswj', english: 'to twist', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsos', hmongRPA: 'ntsos', english: 'hiccups; (verb) to hiccup (ua ntsos)', category: 'words-by-sound-tsh-nts-txh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntsawm', hmongRPA: 'ntsawm', english: 'to slam', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txham', hmongRPA: 'txham', english: 'to sneeze, to choke on something', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txhib', hmongRPA: 'txhib', english: 'to rush someone; to chop firewood', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-txhaub', hmongRPA: 'txhaub', english: 'to instigate, incite', category: 'words-by-sound-tsh-nts-txh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },
  // {
  //   id: 'words-by-sound-ntx-hny-ntsh-ntxh',
  //   title: 'Words by Sound 12: Ntx, Hny, Ntsh, Ntxh',
  //   description: 'Words starting with Ntx, Hny, Ntsh, Ntxh.',
  //   emoji: '🔉',
  //   words: [
  //     { id: 'wbs-ntxaum', hmongRPA: 'ntxaum', english: 'to soak through', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxees', hmongRPA: 'ntxees', english: 'loops, rounds', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxuaj', hmongRPA: 'ntxuaj', english: 'to fan, to flap (wings)', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxiab', hmongRPA: 'ntxiab', english: 'a trap', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxi', hmongRPA: 'ntxi', english: 'to open just a little', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxaij', hmongRPA: 'ntxaij', english: 'a screen', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxuag', hmongRPA: 'ntxuag', english: 'with, along with', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['preposition', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hnyos', hmongRPA: 'hnyos', english: 'to taunt, to ridicule, to criticize', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-hnya', hmongRPA: 'hnya', english: 'to frown, to squint', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntshaus', hmongRPA: 'ntshaus', english: 'to look sad or frightened', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntshe', hmongRPA: 'ntshe', english: 'perhaps, maybe', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adverb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntshoo', hmongRPA: 'ntshoo', english: 'to be noisy, to be boisterous', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntshiab', hmongRPA: 'ntshiab', english: 'to be crystal clear, clean, to be empty', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhi', hmongRPA: 'ntxhi', english: 'to whisper', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhab', hmongRPA: 'ntxhab', english: 'steep', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhov', hmongRPA: 'ntxhov', english: 'messy, tangled', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhuab', hmongRPA: 'ntxhuab', english: 'moss, water weed, seaweed', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhuav', hmongRPA: 'ntxhuav', english: 'corn silk; hair-like items', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['verb', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhib', hmongRPA: 'ntxhib', english: 'rice with shell on; (adjective) rough, coarse', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['noun', 'word-list', 'reviewed'], audioFile: null },
  //     { id: 'wbs-ntxhee', hmongRPA: 'ntxhee', english: 'soft and smooth, flowy', category: 'words-by-sound-ntx-hny-ntsh-ntxh', tags: ['adjective', 'word-list', 'reviewed'], audioFile: null },
  //   ],
  // },

  // ── Batch two, 2026-09-20 ───────────────────────────────────────────────
  // The tail of the same dataset, merged from _incoming/hmong_vocab_dataset.ts
  // after the chat paste truncated. Same caveats as batch one: every entry is
  // `unreviewed`, with no audio and no exampleSentence.
  // See notes/2026-09-20-vocab-batch-import.md.
  {
    id: 'seasons-time',
    title: 'Seasons & Time',
    description: 'Seasons, time expressions, ordinal numbers, and basic phrases.',
    emoji: '🗓️',
    words: [
      { id: 'time-cov-caij-nyoog', hmongRPA: 'cov caij nyoog', english: 'seasons; periods of time', category: 'seasons-time', tags: ['noun','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyiam cov caij nyoog hauv Xeev Minnesota.', english: 'I like the seasons in Minnesota.', source: 'ai' } },
      { id: 'time-lub-caij-ntuj-tshiab', hmongRPA: 'lub caij ntuj tshiab', english: 'spring', category: 'seasons-time', tags: ['noun','season','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj tshiab, cov paj pib tawg thiab huab cua sov zuj zus.', english: 'In spring, flowers begin to bloom and the weather gradually gets warmer.', source: 'ai' } },
      { id: 'time-lub-caij-ntuj-sov', hmongRPA: 'lub caij ntuj sov', english: 'summer', category: 'seasons-time', tags: ['noun','season','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj sov peb nyiam mus ua si tom pas dej.', english: 'In summer, we like to go to the lake.', source: 'ai' } },
      { id: 'time-lub-caij-ntuj-tsaug', hmongRPA: 'lub caij ntuj tsaug', english: 'autumn; fall', category: 'seasons-time', tags: ['noun','season','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj tsaug, cov nplooj hloov xim thiab poob los.', english: 'In autumn, the leaves change color and fall.', source: 'ai' } },
      { id: 'time-lub-caij-ntuj-no', hmongRPA: 'lub caij ntuj no', english: 'winter', category: 'seasons-time', tags: ['noun','season','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj no hauv Xeev Minnesota muaj daus ntau.', english: 'Winter in Minnesota has a lot of snow.', source: 'ai' } },
      { id: 'time-thib', hmongRPA: 'thib', english: 'ordinal number marker', category: 'seasons-time', tags: ['grammar','numbers','time','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tau qhov chaw thib ib hauv kev sib tw.', english: 'They got first place in the competition.', source: 'ai' } },
      // 2026-09-28 (author): zoo li cas is THE question for how something is or looks — what it looks like. Was english: 'how is it?; what is it like?; in what way?'
      { id: 'time-zoo-li-cas', hmongRPA: 'zoo li cas', english: 'what does it look like?; how is it?; what is it like?; in what way?', category: 'seasons-time', tags: ['phrase','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj xav tias zaj yeeb yaj duab ntawd zoo li cas?', english: 'What do you think the movie is like?', source: 'ai' } },
      { id: 'time-xum', hmongRPA: 'xum', english: 'would rather', category: 'seasons-time', tags: ['verb','grammar','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xum nyob tsev dua li tawm mus thaum nag los.', english: 'I would rather stay home than go out when it is raining.', source: 'ai' } },
      { id: 'time-yuav-tsum', hmongRPA: 'yuav tsum', english: 'must; have to', category: 'seasons-time', tags: ['verb','grammar','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj yuav tsum kawm kom tiav ua ntej koj mus ua si.', english: 'You must finish studying before you go play.', source: 'ai' } },
    ],
  },
  {
    // ⚠️ RETITLED 2026-09-20. This arrived as "Body & Health" holding 42 entries,
    // 30 of which were body PARTS that duplicated or belonged beside the four
    // `human-anatomy-*` categories. Those were routed there. What is left is what
    // the name now says: sense and action verbs, plus health. Do not add parts here.
    id: 'body-health',
    title: 'Senses, Actions & Health',
    description: 'Breathing, hearing, touching — what the body DOES, plus health terms. The parts themselves live in the four anatomy categories.',
    emoji: '🫀',
    words: [
      { id: 'body-ua-pa', hmongRPA: 'ua pa', english: 'to breathe', category: 'body-health', tags: ['verb','health','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws ua pa tob tob kom nws tus kheej nqig.', english: 'They breathe deeply to calm themselves.', source: 'ai' } },
      { id: 'body-hnoos', hmongRPA: 'hnoos', english: 'to cough', category: 'body-health', tags: ['verb','health','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws hnoos ntau heev vim nws mob khaub thuas.', english: 'He is coughing a lot because he has a cold.', source: 'ai' } },
      { id: 'body-hnov-tau', hmongRPA: 'hnov tau', english: 'to feel', category: 'body-health', tags: ['verb','senses','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hnov tau mob hauv kuv xub pwg.', english: 'I feel pain in my shoulder.', source: 'ai' } },
      { id: 'body-mloog', hmongRPA: 'mloog', english: 'to listen', category: 'body-health', tags: ['verb','senses','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov mloog tus kws kho mob cov lus qhia.', english: "Please listen to the doctor's instructions.", source: 'ai' } },
      { id: 'body-hnov', hmongRPA: 'hnov', english: 'to hear', category: 'body-health', tags: ['verb','senses','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hnov suab nag los rau saum ru tsev.', english: 'I hear rain falling on the roof.', source: 'ai' } },
      { id: 'body-khawb', hmongRPA: 'khawb', english: 'to scratch', category: 'body-health', tags: ['verb','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob khawb qhov txhab ntawd vim nws yuav mob ntxiv.', english: 'Do not scratch that wound because it may hurt more.', source: 'ai' } },
      { id: 'body-tshee', hmongRPA: 'tshee', english: 'to shake; to shiver', category: 'body-health', tags: ['verb','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tshee vim huab cua txias heev.', english: 'They are shivering because the weather is very cold.', source: 'ai' } },
      { id: 'body-tsw-qab', hmongRPA: 'tsw qab', english: 'to smell; fragrant smell', category: 'body-health', tags: ['verb','noun','senses','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov zaub kib tsw qab thoob plaws hauv tsev.', english: 'The stir-fried vegetables smell delicious throughout the house.', source: 'ai' } },
      { id: 'body-chwv', hmongRPA: 'chwv', english: 'to touch', category: 'body-health', tags: ['verb','senses','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov tsis txhob chwv lub qhov txhab ntawd.', english: 'Please do not touch that wound.', source: 'ai' } },
      { id: 'body-rua-lo', hmongRPA: 'rua lo', english: 'to yawn', category: 'body-health', tags: ['verb','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv rua lo ntau zaus vim kuv pw tsis txaus.', english: 'I yawn many times because I did not get enough sleep.', source: 'ai' } },
      { id: 'body-lub-cev', hmongRPA: 'lub cev', english: 'body', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev tawm dag zog pab kom lub cev muaj zog.', english: 'Exercise helps keep the body strong.', source: 'ai' } },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-upper-body-chest` already teaches `hauv siab`. Both arrived in the same import.
      // { id: 'body-lub-hauv-siab', hmongRPA: 'lub hauv siab', english: 'chest', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-lower-body` already teaches `hauv caug` = knee, same headword.
      // { id: 'body-hauv-caug', hmongRPA: 'hauv caug', english: 'knee', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-lower-body` teaches `ntiv taw` = toe. This is the same word with the plural marker `cov` in front, which `classifiers` teaches on its own.
      // { id: 'body-cov-ntiv-taw', hmongRPA: 'cov ntiv taw', english: 'toes', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-upper-body` already teaches `luj tshib` = elbow, same headword.
      // { id: 'body-luj-tshib', hmongRPA: 'luj tshib', english: 'elbow', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. TYPO. `human-anatomy-lower-body` teaches calf as `plab hlaub`; this arrived as `plab jlaub`. `j` for `h` — the same class of slip as the spacing duplicates, and not a variant spelling. RESTORE only if `jlaub` is real.
      // { id: 'body-plab-jlaub', hmongRPA: 'plab jlaub', english: 'calf', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-face` already teaches `puab tsaig` = chin, same headword.
      // { id: 'body-puab-tsaig', hmongRPA: 'puab tsaig', english: 'chin', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ⚠️ REDUNDANT, commented out 2026-09-20. `human-anatomy-face` already teaches `nplaig` = tongue, same headword.
      // { id: 'body-nplaig', hmongRPA: 'nplaig', english: 'tongue', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'gen-hiav', hmongRPA: 'hiav', english: 'age spots; dark spots; burn injuries', category: 'body-health', tags: ['noun','body','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muaj ib qho hiav dub me me ntawm nws txhais tes.', english: 'They have a small dark spot on their hand.', source: 'ai' } },
      // ── Added 2026-09-30 — the author's list: injuries.
      { id: 'body-txhab', hmongRPA: 'txhab', english: 'a physical wound or cut', category: 'body-health', tags: ['noun', 'body', 'reviewed'], audioFile: null },
      { id: 'body-lab', hmongRPA: 'lab', english: 'a bruise — also doog', category: 'body-health', tags: ['noun', 'body', 'reviewed'], audioFile: null },
      { id: 'body-doog', hmongRPA: 'doog', english: 'a bruise — also lab', category: 'body-health', tags: ['noun', 'body', 'reviewed'], audioFile: null },
      { id: 'body-ntaiv', hmongRPA: 'ntaiv', english: 'a scar — left from an injury', category: 'body-health', tags: ['noun', 'body', 'reviewed'], audioFile: null },
      { id: 'body-thoj', hmongRPA: 'thoj', english: 'loose stool, diarrhea', category: 'body-health', tags: ['noun', 'body', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of two thoj entries (the rau / tom qab pattern)
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-ncia', hmongRPA: 'ncia', english: 'to sob; to gasp; to struggle for air', category: 'body-health', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-txham', hmongRPA: 'txham', english: 'to sneeze, to choke on something', category: 'body-health', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntsos', hmongRPA: 'ntsos', english: 'hiccups; (verb) to hiccup (ua ntsos)', category: 'body-health', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nyooj', hmongRPA: 'nyooj', english: 'to groan', category: 'body-health', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phis', hmongRPA: 'phis', english: 'to shed', category: 'body-health', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phaws', hmongRPA: 'phaws', english: 'dandruff; (expression) quickly', category: 'body-health', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-taub-teg', hmongRPA: 'taub teg', english: 'fingerprint; fingertips', category: 'body-health', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nqawm', hmongRPA: 'nqawm', english: 'to be healed (wounds)', category: 'body-health', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-hnya', hmongRPA: 'hnya', english: 'to frown, to squint', category: 'body-health', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'vehicles-travel',
    title: 'Vehicles & Travel',
    description: 'Transportation, vehicles, and travel actions.',
    emoji: '🚗',
    words: [
      { id: 'vehicle-lub-maus-taus', hmongRPA: 'lub maus taus', english: 'motorcycle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws caij lub maus taus mus ua haujlwm txhua tagkis.', english: 'They ride a motorcycle to work every morning.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-kauj-vab', hmongRPA: 'lub tsheb kauj vab', english: 'bicycle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntxhais caij lub tsheb kauj vab mus kawm ntawv.', english: 'The girl rides a bicycle to school.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb', hmongRPA: 'lub tsheb', english: 'car; vehicle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb tsav lub tsheb mus tom khw.', english: 'We drive the car to the store.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-nqaj-hlau', hmongRPA: 'lub tsheb nqaj hlau', english: 'train', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb nqaj hlau tuaj txog ntawm qhov chaw nres tsheb raws sijhawm.', english: 'The train arrived at the station on time.', source: 'ai' } },
      { id: 'vehicle-lub-dav-hlau', hmongRPA: 'lub dav hlau', english: 'airplane; plane', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub dav hlau yuav tsaws rau Lub Nroog Minneapolis yav tav su.', english: 'The airplane will land in Minneapolis in the afternoon.', source: 'ai' } },
      { id: 'vehicle-lub-npav', hmongRPA: 'lub npav', english: 'bus', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv caij lub npav mus hauv nroog thaum sawv ntxov.', english: 'I take the bus into the city in the morning.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-ntiav', hmongRPA: 'lub tsheb ntiav', english: 'taxi', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb hu lub tsheb ntiav thaum peb tsis muaj tsheb.', english: 'We call a taxi when we do not have a car.', source: 'ai' } },
      { id: 'vehicle-taug-kev', hmongRPA: 'taug kev', english: 'to walk; to travel on foot', category: 'vehicles-travel', tags: ['verb','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv taug kev mus tom khw vim nws nyob ze kuv tsev.', english: 'I walk to the store because it is close to my house.', source: 'ai' } },
      { id: 'vehicle-khiav', hmongRPA: 'khiav', english: 'to run', category: 'vehicles-travel', tags: ['verb','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws khiav ncig lub pas dej txhua tagkis.', english: 'They run around the lake every morning.', source: 'ai' } },
      { id: 'vehicle-lub-nkoj', hmongRPA: 'lub nkoj', english: 'boat; ship', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb caij lub nkoj hla lub pas dej thaum ntuj sov.', english: 'We take a boat across the lake in summer.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-tsav', hmongRPA: 'tsav', english: 'to drive — "tsav tsheb"', category: 'vehicles-travel', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kawm tsav tsheb nrog kuv txiv.', english: 'I am learning to drive with my father.', source: 'ai' } },
    ],
  },
  {
    id: 'general-vocabulary',
    title: 'General Vocabulary',
    description: 'Everyday words, concepts, actions, descriptions, and useful expressions.',
    emoji: '🧩',
    words: [
    ],
  },

  {
    id: 'countries',
    title: 'Countries',
    description: 'Country and place names.',
    emoji: '🌍',
    words: [
      // ── Split out of `countries-nationalities` on 2026-09-20 ──
      // 2026-09-26: TEBCHAWS on its own (author: "tebchaw is the classifier for countries").
      // ⚠️ SPELLING — the author's ruling, same day: 'Tebchaws', JOINED and CAPITALISED
      // ("one of those words where we can combine"). Was hmongRPA 'teb chaws' (spaced,
      // per the 09-20 note above, now superseded). It goes before a country's name the
      // way a classifier goes before a noun.
      { id: 'country-teb-chaws', hmongRPA: 'Tebchaws', english: 'country, nation — said before a country’s name, like a classifier: "Tebchaws Nplog", the country of Laos', category: 'countries', tags: ['noun', 'country', 'classifier-like'], audioFile: null, exampleSentence: { hmong: 'Lawv mus ncig Tebchaws Iyi.', english: 'They traveled around Egypt.', source: 'ai' } },
      { id: 'country-meskas', hmongRPA: 'Meskas', english: 'United States; America', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats "Meskas" (country-meskas) once the prefix is gone. RESTORE by uncommenting.
      // { id: 'country-teb-chaws-meskas', hmongRPA: 'Teb Chaws Meskas', english: 'the United States', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Fabkis' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Fabkis', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-fabkis', hmongRPA: 'Fabkis', english: 'France', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nplog', hmongRPA: 'Nplog', english: 'Laos', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsev neeg tuaj Nplog teb.', english: 'My family came from Laos.', source: 'ai' } },
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats "Nplog" (country-nplog) once the prefix is gone. RESTORE by uncommenting.
      // { id: 'country-teb-chaws-nplog', hmongRPA: 'Teb Chaws Nplog', english: 'Laos', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Thaib' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Thaib', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-thaib', hmongRPA: 'Thaib', english: 'Thailand', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus ncig Thaib teb.', english: 'I want to travel around Thailand.', source: 'ai' } },
      // 'Suav' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Suav', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-suav', hmongRPA: 'Suav', english: 'China', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv tau mus Suav teb.', english: 'My father went to China.', source: 'ai' } },
      // 'Nyab Laj' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Nyab Laj', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-nyab-laj', hmongRPA: 'Nyab Laj', english: 'Vietnam', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Qhab Meem' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Qhab Meem', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-qhab-meem', hmongRPA: 'Qhab Meem', english: 'Cambodia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-mias-mas', hmongRPA: 'Mias Mas', english: 'Myanmar; Burma', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // ⚠️ needs-review. Glossed "Myanmar; Burma", identical to `country-mias-mas`
      // above. `Pem` normally means "over there, yonder", so one of the two is doing
      // something else. Kept as supplied until a speaker rules.
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats Myanmar (Mias Mas) — a second name for the same country. RESTORE by uncommenting.
      // { id: 'country-pem', hmongRPA: 'Pem', english: 'Myanmar; Burma', category: 'countries', tags: ['noun','country','geography','unreviewed','needs-review'], audioFile: null },
      // 'Nyij Pooj' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Nyij Pooj', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-nyij-pooj', hmongRPA: 'Nyij Pooj', english: 'Japan', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Kaus Lim' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Kaus Lim', below.
      // 2026-09-26: "Teb Chaws" prefix removed (author) — the name alone; teb chaws is its own entry. Id kept.
      { id: 'country-teb-chaws-kaus-lim', hmongRPA: 'Kaus Lim', english: 'Korea', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-kaus-lim-qaum-teb', hmongRPA: 'Kaus Lim Qaum Teb', english: 'North Korea', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-kaus-lim-qab-teb', hmongRPA: 'Kaus Lim Qab Teb', english: 'South Korea', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-lav-xias', hmongRPA: 'Lav Xias', english: 'Russia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-yelemees', hmongRPA: 'Yelemees', english: 'Germany', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Askiv' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Askiv (no Teb Chaws form recorded)', below.
      { id: 'country-kas-nas-das', hmongRPA: 'Kas Nas Das', english: 'Canada', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-austalaslias', hmongRPA: 'Austalaslias', english: 'Australia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nyu-xis-las', hmongRPA: 'Nyu Xis Las', english: 'New Zealand', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-is-nrias', hmongRPA: 'Is Nrias', english: 'India', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-pas-kis-taas', hmongRPA: 'Pas Kis Taas', english: 'Pakistan', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nplas-des', hmongRPA: 'Nplas Des', english: 'Bangladesh', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nes-npas', hmongRPA: 'Nes Npas', english: 'Nepal', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-is-do-nes-xias', hmongRPA: 'Is Do Nes Xias', english: 'Indonesia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-filiv-pees', hmongRPA: 'Filiv Pees', english: 'Philippines', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-mas-lis-xias', hmongRPA: 'Mas Lis Xias', english: 'Malaysia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-xis-nka-puv', hmongRPA: 'Xis Nka Puv', english: 'Singapore', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-mes-kas-kos', hmongRPA: 'Mes Kas Kos', english: 'Mexico', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nplas-xis', hmongRPA: 'Nplas Xis', english: 'Brazil', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-aas-xes-tias-nas', hmongRPA: 'Aas Xes Tias Nas', english: 'Argentina', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-itaus-liv', hmongRPA: 'Itaus Liv', english: 'Italy', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-xip-pees', hmongRPA: 'Xip Pees', english: 'Spain', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-pov-tu-kees', hmongRPA: 'Pov Tu Kees', english: 'Portugal', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-hoo-las', hmongRPA: 'Hoo Las', english: 'Netherlands; Holland', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-xuv-xis', hmongRPA: 'Xuv Xis', english: 'Switzerland', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-xus-vis-dees', hmongRPA: 'Xus Vis Dees', english: 'Sweden', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-naw-vees', hmongRPA: 'Naw Vees', english: 'Norway', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-fiv-las', hmongRPA: 'Fiv Las', english: 'Finland', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus xyuas Fiv Las.', english: 'I want to visit Finland.', source: 'ai' } },
      { id: 'country-poo-las', hmongRPA: 'Poo Las', english: 'Poland', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus phooj ywg nyob Poo Las.', english: 'My friend lives in Poland.', source: 'ai' } },
      { id: 'country-yus-khees', hmongRPA: 'Yus Khees', english: 'Ukraine', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xav kawm txog Yus Khees.', english: 'I want to learn about Ukraine.', source: 'ai' } },
      { id: 'country-iyi', hmongRPA: 'Iyi', english: 'Egypt', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus ncig teb chaws Iyi.', english: 'They traveled around Egypt.', source: 'ai' } },
      { id: 'country-afas-kas-qab-teb', hmongRPA: 'Afas Kas Qab Teb', english: 'South Africa', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws xav mus rau Afas Kas Qab Teb.', english: 'She wants to go to South Africa.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      // ── 'X teb' — the OTHER way to name a country, and attested ──────────
      // ⚠️ These three are NOT duplicates of the 'Teb Chaws X' entries above,
      // but they WERE glossed identically, so the deck asked "what is China?"
      // twice with two different right answers. Glosses now say which is which.
      //
      // ⚠️ WORTH KNOWING WHICH TO TRUST: these carry 'reading' tags and misc-
      // ids because they were harvested from real stories. Every 'Teb Chaws X'
      // entry above is machine-written and 'unreviewed'. If only one form
      // should be taught, the attested one is the safer default.
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats Nplog — its example moved to country-nplog. RESTORE by uncommenting.
      // { id: 'misc-nplog-teb', hmongRPA: 'Nplog teb', english: 'Laos — the short form; cf. "Teb Chaws Nplog"', category: 'countries', tags: ['country', 'place', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv tsev neeg tuaj Nplog teb.', english: 'My family came from Laos.', source: 'ai' } },
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats Thaib — its example moved to the Thaib entry. RESTORE by uncommenting.
      // { id: 'misc-thaib-teb', hmongRPA: 'Thaib teb', english: 'Thailand — the short form; cf. "Teb Chaws Thaib"', category: 'countries', tags: ['country', 'place', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus ncig Thaib teb.', english: 'I want to travel around Thailand.', source: 'ai' } },
      // ⚠️ REPEAT, commented out 2026-09-26 (author: "comment out the repeating ones") — repeats Suav — its example moved to the Suav entry. RESTORE by uncommenting.
      // { id: 'misc-suav-teb', hmongRPA: 'Suav teb', english: 'China — the short form; cf. "Teb Chaws Suav"', category: 'countries', tags: ['country', 'place'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv tau mus Suav teb.', english: 'My father went to China.', source: 'ai' } },
    ],
  },
  {
    id: 'ethnicities',
    title: 'Ethnicities & Peoples',
    description: 'Terms for peoples and ethnic groups.',
    emoji: '🧑‍🤝‍🧑',
    words: [
      // ── Split out of `countries-nationalities` on 2026-09-20 ──
      // ── Moved out of `countries` 2026-09-21 ────────────────────────────────
      // ⚠️ THESE NAME PEOPLE, NOT PLACES, and were filed the wrong way round.
      // "Suav" is Chinese (the people and the language); the COUNTRY is
      // "Teb Chaws Suav" — literally "the country of the Suav". Both used to
      // sit in `countries` glossed identically as "China", so the deck taught
      // a country name that is really an ethnonym AND carried a duplicate.
      //
      // The country sense is kept as a `senses` entry so the reader's
      // long-press still answers "China" on a tap — see src/lib/senses.js.
      // A flashcard now shows the sense its own deck is about, which is the
      // whole reason that file exists.
      { id: 'country-suav', hmongRPA: 'Suav', english: 'Chinese — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Chinese', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'China', context: 'countries', note: 'naming the country outright is "Teb Chaws Suav"' },
        ], exampleSentence: { hmong: 'Kuv kawm lus Suav txhua hnub.', english: 'I study Chinese every day.', source: 'ai' } },
      { id: 'country-fabkis', hmongRPA: 'Fabkis', english: 'French — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'French', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'France', context: 'countries', note: 'naming the country outright is "Teb Chaws Fabkis"' },
        ], exampleSentence: { hmong: 'Nws kawm lus Fabkis hauv tsev kawm.', english: 'She studies French at school.', source: 'ai' } },
      { id: 'country-thaib', hmongRPA: 'Thaib', english: 'Thai — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Thai', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'Thailand', context: 'countries', note: 'naming the country outright is "Teb Chaws Thaib"' },
        ], exampleSentence: { hmong: 'Kuv muaj ib tus phooj ywg Thaib.', english: 'I have a Thai friend.', source: 'ai' } },
      { id: 'country-nyab-laj', hmongRPA: 'Nyab Laj', english: 'Vietnamese — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Vietnamese', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'Vietnam', context: 'countries', note: 'naming the country outright is "Teb Chaws Nyab Laj"' },
        ], exampleSentence: { hmong: 'Nws paub lus Nyab Laj zoo.', english: 'She knows Vietnamese well.', source: 'ai' } },
      { id: 'country-qhab-meem', hmongRPA: 'Qhab Meem', english: 'Cambodian — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Cambodian', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'Cambodia', context: 'countries', note: 'naming the country outright is "Teb Chaws Qhab Meem"' },
        ], exampleSentence: { hmong: 'Kuv tus phooj ywg yog Qhab Meem.', english: 'My friend is Cambodian.', source: 'ai' } },
      { id: 'country-nyij-pooj', hmongRPA: 'Nyij Pooj', english: 'Japanese — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Japanese', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'Japan', context: 'countries', note: 'naming the country outright is "Teb Chaws Nyij Pooj"' },
        ], exampleSentence: { hmong: 'Nws kawm lus Nyij Pooj.', english: 'He studies Japanese.', source: 'ai' } },
      { id: 'country-kaus-lim', hmongRPA: 'Kaus Lim', english: 'Korean — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'Korean', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'Korea', context: 'countries', note: 'naming the country outright is "Teb Chaws Kaus Lim"' },
        ], exampleSentence: { hmong: 'Kuv nyiam mloog lus Kaus Lim.', english: 'I enjoy listening to Korean.', source: 'ai' } },
      { id: 'country-askiv', hmongRPA: 'Askiv', english: 'English — the people, and the language', category: 'ethnicities', tags: ['noun','ethnicity','nationality','unreviewed'], audioFile: null,
        senses: [
          { en: 'English', context: 'ethnicities', note: 'the people, and the language' },
          { en: 'United Kingdom; England', context: 'countries', note: 'the country; no "Teb Chaws" form is recorded here' },
        ], exampleSentence: { hmong: 'Kuv kawm lus Askiv hauv tsev.', english: 'I study English at home.', source: 'ai' } },

      // ── Already here ───────────────────────────────────────────────────────
      // 2026-09-26: capitalised (author: "the ethnicities we need to capitalize them too") — a proper noun, like the country names.
      { id: 'eth-khej-dub', hmongRPA: 'Khej Dub', english: 'African; Black person', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib tus phooj ywg Khej Dub.', english: 'I have a Black friend.', source: 'ai' } },
      // 2026-09-26: capitalised (author: "the ethnicities we need to capitalize them too") — a proper noun, like the country names.
      { id: 'eth-qhab', hmongRPA: 'Qhab', english: 'Native American', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog ib tus Qhab.', english: 'He is Native American.', source: 'ai' } },
      // 2026-09-26: capitalised (author: "the ethnicities we need to capitalize them too") — a proper noun, like the country names.
      { id: 'eth-mev', hmongRPA: 'Mev', english: 'Mexican; Hispanic; Latino', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus neeg nyob ze yog Mev.', english: 'My neighbor is Mexican.', source: 'ai' } },
      // Added 2026-09-26 — a course reading tapped this word and got "no entry".
      { id: 'eth-hmoob', hmongRPA: 'Hmoob', english: 'Hmong — the people and the language', category: 'ethnicities', tags: ['noun', 'ethnicity', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      // 2026-09-26 — the author: 'meskas, it also means white people, white general'. The COUNTRY
      // sense (United States) stays in countries (country-meskas); this is the PEOPLE sense.
      // Lookup merges the two. Example drafted in the pattern of the entries above (source: 'ai').
      { id: 'eth-meskas', hmongRPA: 'Meskas', english: 'American; a white person — white people in general', category: 'ethnicities', tags: ['noun', 'ethnicity', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus phooj ywg yog Meskas.', english: 'My friend is American.', source: 'ai' } },
      // ⚠️ REPLACED 2026-09-28 by geo-exsias (author: "by asian, I was talking about Exsias"). Claude's
      // guess, kept for reference. RESTORE by uncommenting.
      // { id: 'eth-neeg-asias', hmongRPA: 'neeg Asias', english: 'Asian — an Asian person, Asian people (also neeg Es Xias)', category: 'ethnicities', tags: ['noun', 'ethnicity', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hmoob yog neeg Asias.', english: 'Hmong people are Asian.', source: 'ai' }, examples: [{ hmong: 'Nws yog ib tug neeg Asias.', english: 'He is Asian.' }] },
    ],
  },
  {
    id: 'geography',
    title: 'Geography',
    description: 'Landforms, water, and features of the map.',
    emoji: '🗺️',
    words: [
      // ── CONTINENTS — 2026-09-28, the author's list (ntiaj teb, the world, is misc-ntiaj-teb).
      /* was hmongRPA 'tebchaws loj' — the author, 2026-09-28: spaced; Tebchaws is joined only in a fixed place name (Tebchaws Nplog) */ { id: 'geo-tebchaws-loj', hmongRPA: 'teb chaws loj', english: 'continent; a large land', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ntiaj teb muaj xya lub teb chaws loj.', english: 'The world has seven continents.', source: 'ai' } },
      { id: 'geo-asias', hmongRPA: 'Asias', english: 'Asia — also written Es Xias; for Asian (the continent and the people), see Exsias'  /* was 'Asia — also written Es Xias' (author: Asian, 2026-09-28) */, category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tebchaws Nplog nyob hauv Asias.', english: 'Laos is in Asia.', source: 'ai' }, examples: [{ hmong: 'zaub mov Asias', english: 'Asian food' }] },
      // Added 2026-09-28 (author: "by asian, I was talking about Exsias"): Asian — the continent
      // and the people. Examples are Claude's.
      { id: 'geo-exsias', hmongRPA: 'Exsias', english: 'Asian; Asia — the continent and its people (neeg Exsias, Asian people)', category: 'geography', tags: ['noun', 'geography', 'ethnicity', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hmoob yog neeg Exsias.', english: 'Hmong people are Asian.', source: 'ai' }, examples: [{ hmong: 'Tebchaws Nplog nyob hauv Exsias.', english: 'Laos is in Asia.' }, { hmong: 'zaub mov Exsias', english: 'Asian food' }] },
      { id: 'geo-amelika', hmongRPA: 'Amelika', english: 'the Americas — for the United States, say Meskas', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Amelika muaj ob lub teb chaws loj.', english: 'The Americas are two continents.', source: 'ai' } },
      { id: 'geo-amelika-qaum-teb', hmongRPA: 'Amelika Qaum Teb', english: 'North America', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tebchaws Meskas nyob hauv Amelika Qaum Teb.', english: 'The United States is in North America.', source: 'ai' } },
      { id: 'geo-amelika-qab-teb', hmongRPA: 'Amelika Qab Teb', english: 'South America', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mus ncig Amelika Qab Teb.', english: 'He traveled around South America.', source: 'ai' } },
      { id: 'geo-yawp', hmongRPA: 'Yawp', english: 'Europe', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tus phooj ywg nyob hauv Yawp.', english: 'Her friend lives in Europe.', source: 'ai' } },
      { id: 'geo-afivkas', hmongRPA: 'Afivkas', english: 'Africa', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ntxhw nyob hauv Afivkas.', english: 'There are elephants in Africa.', source: 'ai' } },
      { id: 'geo-australia', hmongRPA: 'Australia', english: 'Australia', category: 'geography', tags: ['noun', 'geography', 'place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Australia yog ib lub teb chaws loj.', english: 'Australia is a continent.', source: 'ai' } },
      // ── Split out of `geography-nature-weather` on 2026-09-20 ──
      { id: 'geo-cheeb-tsam', hmongRPA: 'cheeb tsam', english: 'bay; region; area; county', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cheeb tsam no muaj neeg coob heev.', english: 'This region has many people.', source: 'ai' } },
      { id: 'geo-ntug-hiav-txwv', hmongRPA: 'ntug hiav txwv', english: 'beach; seashore', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb taug kev ntawm ntug hiav txwv.', english: 'We walked along the beach.', source: 'ai' } },
      { id: 'geo-kwj-deg', hmongRPA: 'kwj deg', english: 'canal; stream', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib kwj deg hla lub zos.', english: 'A stream runs through the village.', source: 'ai' } },
      { id: 'geo-dej-huv', hmongRPA: 'dej huv', english: 'fresh water; clean water', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav tsum haus dej huv.', english: 'We should drink clean water.', source: 'ai' } },
      { id: 'geo-phab-ntug-dej-loj', hmongRPA: 'phab ntug dej loj', english: 'gulf', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub zos nyob ze phab ntug dej loj.', english: 'The village is near the gulf.', source: 'ai' } },
      { id: 'geo-pas-dej', hmongRPA: 'pas dej', english: 'gulf; lake', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam ua si ze pas dej.', english: 'The children play near the lake.', source: 'ai' } },
      { id: 'geo-hiav-txwv', hmongRPA: 'hiav txwv', english: 'ocean; sea', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pom hiav txwv deb heev.', english: 'We can see the ocean far away.', source: 'ai' } },
      { id: 'geo-tus-dej', hmongRPA: 'tus dej', english: 'river', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus dej nyob ze.', english: 'There is a river nearby.', source: 'ai' } },
      { id: 'geo-chaw-lim-dej', hmongRPA: 'chaw lim dej', english: 'wetland; marsh; swamp', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj noog ntau nyob hauv chaw lim dej.', english: 'Many birds live in the wetland.', source: 'ai' } },  // Was: 'Muaj noog ntau hauv chaw lim dej.' — a being somewhere takes nyob (author, 2026-09-28)
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-toj', hmongRPA: 'toj', english: 'hill', category: 'geography', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Peb nce toj txhua tagkis.', english: 'We climb the hill every morning.', source: 'ai' } },
      { id: 'misc-hav-zoov', hmongRPA: 'hav zoov', english: 'forest', category: 'geography', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj tsiaj ntau nyob hauv hav zoov.', english: 'There are many animals in the forest.', source: 'ai' } },  // Was: 'Muaj tsiaj ntau hauv hav zoov.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'gen-zoov-nujtxeeg', hmongRPA: 'zoov nujtxeeg', english: 'jungle; forest', category: 'geography', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv taug kev hauv zoov nujtxeeg.', english: 'They walked through the jungle.', source: 'ai' } },
      { id: 'gen-suab-puam', hmongRPA: 'suab puam', english: 'desert; barren area', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Suab puam no qhuav heev.', english: 'This desert is very dry.', source: 'ai' } },
      { id: 'gen-qabntug', hmongRPA: 'qabntug', english: 'horizon', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub hnub poob dhau qabntug.', english: 'The sun sets beyond the horizon.', source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-yaj-sab', hmongRPA: 'yaj sab', english: 'location on mountains, highlands', category: 'geography', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nqhuab', hmongRPA: 'nqhuab', english: 'to dry up (body of water)', category: 'geography', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nqha', hmongRPA: 'nqha', english: 'to be empty; cleared of trees', category: 'geography', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxhab', hmongRPA: 'ntxhab', english: 'steep', category: 'geography', tags: ['adjective', 'reviewed'], audioFile: null },
    ],
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'Weather, the sky, and what it is doing outside.',
    emoji: '🌦️',
    words: [
      // ── Split out of `geography-nature-weather` on 2026-09-20 ──
      { id: 'weather-huab', hmongRPA: 'huab', english: 'cloud', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub huab loj saum ntuj.', english: 'There is a large cloud overhead.', source: 'ai' } },
      { id: 'weather-pog-huab', hmongRPA: 'pog huab', english: 'fog', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tagkis no muaj pog huab heev.', english: 'There is heavy fog this morning.', source: 'ai' } },
      { id: 'weather-lawg', hmongRPA: 'lawg', english: 'hail', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Naghmo muaj lawg poob ntau.', english: 'There was a lot of hail last night.', source: 'ai' } },
      { id: 'weather-foo-kev-kub', hmongRPA: 'foo kev kub', english: 'heat wave', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Foo kev kub kav tau ob peb hnub.', english: 'The heat wave lasted several days.', source: 'ai' } },
      { id: 'weather-cua-dej-khov', hmongRPA: 'cua dej khov', english: 'ice storm', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cua dej khov ua rau txoj kev nplua.', english: 'The ice storm made the road slippery.', source: 'ai' } },
      { id: 'weather-xob-laim', hmongRPA: 'xob laim', english: 'lightning', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xob laim ci saum ntuj tsaus.', english: 'Lightning flashed across the dark sky.', source: 'ai' } },
      { id: 'weather-los-nag', hmongRPA: 'los nag', english: 'to rain; rain', category: 'weather', tags: ['verb','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no yuav los nag.', english: 'It is going to rain today.', source: 'ai' } },
      { id: 'weather-los-daus', hmongRPA: 'los daus', english: 'to snow; snow', category: 'weather', tags: ['verb','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj no yuav los daus.', english: 'It will snow in winter.', source: 'ai' } },
      { id: 'weather-cua-hlob', hmongRPA: 'cua hlob', english: 'storm; strong wind', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cua hlob ua rau ntoo co heev.', english: 'The strong wind shook the trees.', source: 'ai' } },
      { id: 'weather-xob-nroo', hmongRPA: 'xob nroo', english: 'thunder', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xob nroo nrov heev hmo no.', english: 'The thunder is very loud tonight.', source: 'ai' } },
      { id: 'weather-xob-laim-xob-nroo', hmongRPA: 'xob laim xob nroo', english: 'thunderstorm', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xob laim xob nroo pib tsaus ntuj.', english: 'The thunderstorm began at night.', source: 'ai' } },
      { id: 'weather-cua-khaub-zeeg', hmongRPA: 'cua khaub zeeg', english: 'tornado', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cua khaub zeeg ua rau tsev puas.', english: 'The tornado damaged houses.', source: 'ai' } },
      { id: 'weather-tshav-ntuj', hmongRPA: 'tshav ntuj', english: 'sunny; sunshine', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no tshav ntuj zoo nkauj heev.', english: 'The sunshine is beautiful today.', source: 'ai' } },
      { id: 'weather-tuaj-cua', hmongRPA: 'tuaj cua', english: 'windy', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no tuaj cua heev.', english: 'It is very windy today.', source: 'ai' } },
      { id: 'weather-txias', hmongRPA: 'txias', english: 'cool', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tagkis no huab cua txias.', english: 'The weather is cool this morning.', source: 'ai' } },
      { id: 'weather-kub', hmongRPA: 'kub', english: 'hot', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua kub heev.', english: 'The weather is very hot today.', source: 'ai' } },
      { id: 'weather-vaum', hmongRPA: 'vaum', english: 'humid', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua vaum heev.', english: 'The weather is very humid today.', source: 'ai' } },
      { id: 'weather-nplaum', hmongRPA: 'nplaum', english: 'sticky', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Huab cua kub thiab nplaum heev.', english: 'The hot air feels very sticky.', source: 'ai' } },
      { id: 'weather-sov', hmongRPA: 'sov', english: 'warm', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua sov heev.', english: 'The weather is very warm today.', source: 'ai' } },
      { id: 'weather-pos-huab', hmongRPA: 'pos huab', english: 'cloudy; foggy', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tagkis no pos huab heev.', english: 'It is very cloudy this morning.', source: 'ai' } },
      { id: 'weather-no', hmongRPA: 'no', english: 'cold', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hmo no huab cua no heev.', english: 'The weather is very cold tonight.', source: 'ai' } },
      { id: 'weather-qhuav', hmongRPA: 'qhuav', english: 'dry', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub caij ntuj no huab cua qhuav.', english: 'The air is dry in winter.', source: 'ai' } },
    ],
  },
  {
    id: 'chores',
    title: 'Chores',
    description: 'Household tasks and routine work.',
    emoji: '🧹',
    words: [
      // ── Split out of `chores-directions` on 2026-09-20 ──
      { id: 'chore-cheb', hmongRPA: 'cheb', english: 'to sweep', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cheb hauv tsev txhua hnub.', english: 'I sweep the house every day.', source: 'ai' } },
      { id: 'chore-cheb-plua-plav', hmongRPA: 'cheb plua plav', english: 'to dust', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cheb plua plav txhua hnub.', english: 'I dust every day.', source: 'ai' } },
      // ⚠️ needs-review. Glossed "to spray", but `txuag` more usually means to save / be
      // thrifty (`txuag nyiaj`, save money). Kept as supplied until a speaker rules.
      { id: 'chore-txuag', hmongRPA: 'txuag', english: 'to spray', category: 'chores', tags: ['verb','chores','unreviewed','needs-review'], audioFile: null, exampleSentence: { hmong: 'Kuv txuag tshuaj rau nroj.', english: 'I spray chemicals on the weeds.', source: 'ai' } },
      { id: 'chore-so', hmongRPA: 'so', english: 'to wipe', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv so lub rooj.', english: 'I wipe the table.', source: 'ai' } },
      { id: 'chore-txhuam', hmongRPA: 'txhuam', english: 'to scrub', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txhuam lub dab da dej.', english: 'I scrub the bathtub.', source: 'ai' } },
      { id: 'chore-yaug', hmongRPA: 'yaug', english: 'to rinse', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yaug tais diav.', english: 'I rinse the dishes.', source: 'ai' } },
      { id: 'chore-zov-menyuam', hmongRPA: 'zov menyuam', english: 'to babysit', category: 'chores', tags: ['verb','chores','family','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv zov menyuam hmo no.', english: 'I babysit tonight.', source: 'ai' } },
      { id: 'chore-them-nuj-nqis', hmongRPA: 'them nuj nqis', english: 'to pay bills', category: 'chores', tags: ['verb','chores','money','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv them nuj nqis txhua hli.', english: 'I pay the bills every month.', source: 'ai' } },
      { id: 'chore-kaus-daus', hmongRPA: 'kaus daus', english: 'to shovel snow', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kaus daus thaum sawv ntxov.', english: 'I shovel snow in the morning.', source: 'ai' } },
      { id: 'chore-kaus-nplooj', hmongRPA: 'kaus nplooj', english: 'to rake leaves', category: 'chores', tags: ['verb','chores','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kaus nplooj tom vaj.', english: 'I rake leaves in the yard.', source: 'ai' } },
      { id: 'chore-ua-mov', hmongRPA: 'ua mov', english: 'to cook; to cook rice', category: 'chores', tags: ['verb','chores','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ua mov rau tsev neeg.', english: 'I cook food for the family.', source: 'ai' } },
      { id: 'chore-ntsaig-tais-diav', hmongRPA: 'ntsaig tais diav', english: 'to clear the table', category: 'chores', tags: ['verb','chores','food','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntsaig tais diav tom qab noj mov.', english: 'I clear the table after eating.', source: 'ai' } },
    ],
  },
  {
    id: 'directions',
    title: 'Directions',
    description: 'Giving and following directions.',
    emoji: '🧭',
    words: [
      // ── Split out of `chores-directions` on 2026-09-20 ──
      { id: 'dir-lem', hmongRPA: 'lem', english: 'to turn', category: 'directions', tags: ['verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj lem sab laug ntawm no.', english: 'Turn left here.', source: 'ai' } },
      { id: 'dir-ncaj-qha', hmongRPA: 'ncaj qha', english: 'straight', category: 'directions', tags: ['adjective','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Mus ncaj qha txog lub teeb.', english: 'Go straight to the light.', source: 'ai' } },
      { id: 'dir-dhau', hmongRPA: 'dhau', english: 'past; to pass', category: 'directions', tags: ['preposition','verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Mus dhau lub khw ces lem.', english: 'Pass the store, then turn.', source: 'ai' } },
      { id: 'dir-nres', hmongRPA: 'nres', english: 'stop', category: 'directions', tags: ['verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nres ntawm lub teeb liab.', english: 'Stop at the red light.', source: 'ai' } },
      { id: 'dir-pib', hmongRPA: 'pib', english: 'start; begin', category: 'directions', tags: ['verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Pib taug kev ntawm no.', english: 'Start walking from here.', source: 'ai' } },
      { id: 'dir-tawm', hmongRPA: 'tawm', english: 'exit; go out', category: 'directions', tags: ['verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tawm ntawm lub qhov rooj no.', english: 'Exit through this door.', source: 'ai' } },
      { id: 'dir-nkag', hmongRPA: 'nkag', english: 'enter; go in', category: 'directions', tags: ['verb','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nkag ntawm lub qhov rooj loj.', english: 'Enter through the main door.', source: 'ai' } },
      { id: 'dir-kev-tshuam', hmongRPA: 'kev tshuam', english: 'intersection', category: 'directions', tags: ['noun','directions','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb ntsib ntawm kev tshuam ntawd.', english: 'We will meet at that intersection.', source: 'ai' } },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    description: 'Beverages, hot and cold.',
    emoji: '🥤',
    words: [
      // ── Split out of `food-drinks` on 2026-09-20 ──
      { id: 'drink-cawv', hmongRPA: 'cawv', english: 'alcohol', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis haus cawv.', english: 'I do not drink alcohol.', source: 'ai' } },
      { id: 'drink-npias', hmongRPA: 'npias', english: 'beer', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis haus npias.', english: 'I do not drink beer.', source: 'ai' } },
      { id: 'drink-lub-hwj', hmongRPA: 'lub hwj', english: 'bottle', category: 'drinks', tags: ['noun','container','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub hwj dej.', english: 'There is one bottle of water.', source: 'ai' } },
      { id: 'drink-dej-caw', hmongRPA: 'dej caw', english: 'cocktail', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws haus dej caw.', english: 'He drinks a cocktail.', source: 'ai' } },
      { id: 'drink-kas-fes', hmongRPA: 'kas fes', english: 'coffee', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus kas fes txhua tagkis.', english: 'I drink coffee every morning.', source: 'ai' } },
      { id: 'drink-maj-tshuaj-ntsuab', hmongRPA: 'maj tshuaj ntsuab', english: 'herbal tea', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus maj tshuaj ntsuab.', english: 'I drink herbal tea.', source: 'ai' } },
      { id: 'drink-kua-txiv-ntoo', hmongRPA: 'kua txiv ntoo', english: 'juice', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus kua txiv ntoo.', english: 'I drink fruit juice.', source: 'ai' } },
      { id: 'drink-mis', hmongRPA: 'mis', english: 'milk', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam haus mis.', english: 'The child drinks milk.', source: 'ai' } },
      { id: 'drink-dej-qab-zib', hmongRPA: 'dej qab zib', english: 'soft drink; soda', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis haus dej qab zib.', english: 'I do not drink soda.', source: 'ai' } },
      { id: 'drink-maj', hmongRPA: 'maj', english: 'tea', category: 'drinks', tags: ['noun','drink','unreviewed','needs-review'], audioFile: null },
      { id: 'drink-dej', hmongRPA: 'dej', english: 'water', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus dej txhua hnub.', english: 'I drink water every day.', source: 'ai' } },
      { id: 'drink-vais', hmongRPA: 'vais', english: 'wine', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws haus vais thaum noj hmo.', english: 'He drinks wine at dinner.', source: 'ai' } },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-law',
    title: 'Law & Courts',
    description: 'Police, courts, crime and justice — the vocabulary the legal stories run on.',
    emoji: '⚖️',
    words: [
      { id: 'phr-tub-ceev-xwm', hmongRPA: 'tub ceev xwm', english: 'police; a police officer', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib tus tub ceev xwm tuaj lawm.', english: 'A police officer has arrived.', source: 'ai' } },
      { id: 'phr-kws-lij-choj', hmongRPA: 'kws lij choj', english: 'a lawyer, an attorney', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kws lij choj pab nws hauv tsev hais plaub.', english: 'The lawyer helps him in court.', source: 'ai' } },
      { id: 'phr-rooj-plaub', hmongRPA: 'rooj plaub', english: 'a legal case; a trial', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Rooj plaub yuav pib tagkis.', english: 'The trial will begin tomorrow.', source: 'ai' } },
      { id: 'phr-tsev-hais-plaub', hmongRPA: 'tsev hais plaub', english: 'a court, a courthouse', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus rau tsev hais plaub.', english: 'They went to the courthouse.', source: 'ai' } },
      { id: 'phr-txiav-txim', hmongRPA: 'txiav txim', english: 'to decide, to judge; to pass sentence', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws txiav txim yuav txiav txim.', english: 'The judge will decide.', source: 'ai' } },
      { id: 'phr-raug-foob', hmongRPA: 'raug foob', english: 'to be charged; to be sued', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws raug foob vim ua txhaum cai.', english: 'He was charged with breaking the law.', source: 'ai' } },
      { id: 'phr-raug-ntes', hmongRPA: 'raug ntes', english: 'to be arrested, to be caught', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tub sab raug ntes naghmo.', english: 'The thief was arrested last night.', source: 'ai' } },
      { id: 'phr-pov-thawj', hmongRPA: 'pov thawj', english: 'proof, evidence — "neeg ua pov thawj", a witness', category: 'reading-law', tags: ['noun', 'law', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tub ceev xwm nrhiav pov thawj ntxiv.', english: 'The police are looking for more evidence.', source: 'ai' } },
      { id: 'phr-tim-khawv', hmongRPA: 'tim khawv', english: 'testimony; a witness', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tim khawv hais qhov nws pom.', english: 'The witness described what was seen.', source: 'ai' } },
      { id: 'phr-yuam-cev', hmongRPA: 'yuam cev', english: 'to rape; to force oneself on someone', category: 'reading-law', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txoj cai txwv tsis pub yuam cev.', english: 'The law forbids sexual assault.', source: 'ai' } },
      {
        // Both moved out of `politeness` the same day they were added there:
        // the nouns inside "thov txim" (ask + fault) and "tsis muaj teeb meem"
        // (there is no problem). Neither is a courtesy on its own.
        id: 'misc-txim',
        hmongRPA: 'txim',
        english: 'fault; blame · offense; wrongdoing; crime · punishment; penalty; sentence',
        category: 'reading-law',
        tags: ['noun'],
        audioFile: 'lessons/politeness/txim.wav',
        exampleSentence: { hmong: 'Nws lees tias yog nws qhov txim.', english: 'He admits that it was his fault.', source: 'ai' },
      },
      { id: 'misc-xwb', hmongRPA: 'xwb', english: 'only; just; merely (restrictive particle) · that’s all; no more than that (sentence-final particle)', category: 'reading-law', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv paub qhov no xwb.', english: 'I only know this.', source: 'ai' } },
      { id: 'misc-ntes', hmongRPA: 'ntes', english: 'to catch, to arrest', category: 'reading-law', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tub ceev xwm ntes tus neeg ntawd.', english: 'The police arrested that person.', source: 'ai' } },
      { id: 'misc-txwv', hmongRPA: 'txwv', english: 'to forbid, to prevent', category: 'reading-law', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txoj cai txwv kev haus luam yeeb.', english: 'The law forbids smoking.', source: 'ai' } },
      { id: 'misc-zam-txim', hmongRPA: 'zam txim', english: 'to forgive, to pardon', category: 'reading-law', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txiav txim siab zam txim rau nws.', english: 'She decided to forgive him.', source: 'ai' } },
      { id: 'misc-ncaj-ncees', hmongRPA: 'ncaj ncees', english: 'justice; righteous, fair', category: 'reading-law', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb txhua tus xav tau kev ncaj ncees.', english: 'We all want justice.', source: 'ai' } },
      // Each of these words already has an entry above. These add the meaning
      // the reading module kept needing and the dictionary could not give —
      // found by auditing every word tap in story-zong-vang, where each one
      // was answering confidently and wrongly.
      //
      // ⚠️ THE hmongRPA MUST MATCH THE EXISTING ENTRY EXACTLY or this silently
      // creates a separate headword instead of a second sense.
      { id: 'misc-sense-thov', hmongRPA: 'thov', english: 'to plead, to beg, to ask for — "thov kom lawv tso nws mus", begged them to let him go', category: 'reading-law', tags: ['sense', 'verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws thov kom lawv zam txim.', english: 'He pleaded for their forgiveness.', source: 'ai' } },
      { id: 'misc-pov', hmongRPA: 'pov', english: 'throw; toss (transitive verb) · pov thawj = proof; evidence (compound noun) · neeg ua pov thawj = witness (compound noun) — ⚠ proof/evidence is not a standalone core sense of pov', category: 'reading-law', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam pov pob rau nws txiv.', english: 'The child throws a ball to his father.', source: 'ai' } },
      { id: 'rv-rooj', hmongRPA: 'rooj', english: 'table (noun) · rooj plaub = legal case; lawsuit; trial (compound noun)', category: 'reading-law', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib lub rooj nyob hauv chav.', english: 'There is a table in the room.', source: 'ai' } },
      { id: 'misc-tuag', hmongRPA: 'tuag', english: 'die · dead · extinguished; no longer functioning — "lub teeb tuag lawm", the light has gone out', category: 'reading-law', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lub teeb tuag lawm.', english: 'The light has gone out.', source: 'ai' } },
      { id: 'misc-raug', hmongRPA: 'raug', english: 'undergo; experience; be affected by — usually something unwanted or imposed on the subject: "raug ntes" arrested, "raug foob" charged, "raug kaw" imprisoned, "raug mob" injured', category: 'reading-law', tags: ['verb', 'grammar', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nws raug mob thaum ua haujlwm.', english: 'He was injured while working.', source: 'ai' } },
      { id: 'misc-foob', hmongRPA: 'foob', english: 'accuse; charge · sue; bring a legal case against · be charged; be sued — in "raug foob"', category: 'reading-law', tags: ['verb', 'law', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv foob nws hauv tsev hais plaub.', english: 'They sued him in court.', source: 'ai' } },
      { id: 'misc-txiav', hmongRPA: 'txiav', english: 'cut; slice; sever · decide; determine — in "txiav txim" · judge; rule on a case — legal, in "txiav txim"', category: 'reading-law', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiav zaub rau noj hmo.', english: 'I cut vegetables for dinner.', source: 'ai' } },
      { id: 'misc-cai', hmongRPA: 'cai', english: 'right; entitlement; permission (noun) · law; rule; regulation (noun) · correct; proper; legitimate (adjective / stative predicate) · muaj cai = have the right; be allowed to (verb construction) · txoj cai = law; rule; right (compound noun) · kev cai = custom; tradition (compound noun)', category: 'reading-law', tags: ['noun', 'law', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj cai xaiv qhov no.', english: 'I have the right to choose this.', source: 'ai' } },
      { id: 'misc-hnyav', hmongRPA: 'hnyav', english: 'heavy · severe; serious — of injury, illness or punishment · hard; forcefully — adverbial', category: 'reading-law', tags: ['adjective', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lub txim no hnyav heev.', english: 'This punishment is very severe.', source: 'ai' } },
      { id: 'misc-txhaum', hmongRPA: 'txhaum', english: 'wrong; incorrect · make a mistake; be mistaken · violate; break a law or rule · guilty; at fault', category: 'reading-law', tags: ['adjective', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txhaum txoj cai ntawd.', english: 'He violated that law.', source: 'ai' } },
      { id: 'misc-xwm', hmongRPA: 'xwm', english: 'xwm txheej = event; incident; situation (compound noun) · peev xwm = ability; capability (compound noun) · tub ceev xwm = police; police officer (compound noun) — ⚠ do not teach police or ability as standalone meanings of xwm', category: 'reading-law', tags: ['bound', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-ceev', hmongRPA: 'ceev', english: 'bound word here: "tub ceev xwm", police', category: 'reading-law', tags: ['bound','reading','unreviewed'], audioFile: null },
      { id: 'gen-vajhuam', hmongRPA: 'vajhuam', english: 'human rights', category: 'reading-law', tags: ['noun','law','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav tsum hwm vajhuam.', english: 'We should respect human rights.', source: 'ai' } },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-tsoom-fwv', hmongRPA: 'tsoom fwv', english: 'government', category: 'reading-law', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.', english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.' } },
      { id: 'phr-kev-cai-lij-choj', hmongRPA: 'kev cai lij choj', english: 'law; legal rules and regulations', category: 'reading-law', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.', english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-tswj', hmongRPA: 'tswj', english: 'to govern, to control, to manage', category: 'reading-law', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.', english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.' } },
      // 2026-09-26: example replaced — it was the Zong Vang line about a threat of sexual
      // assault (the 'shortest story line' rule picked it), a bad flashcard for 'to force'.
      // Now the will-permission batch's line. Was: hmong 'tias nws yuav yuam cev thiab tua Amanda G.;'
      { id: 'rw-yuam', hmongRPA: 'yuam', english: 'to force, to compel', category: 'reading-law', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob yuam kuv.', english: 'Do not force me.', source: 'ai' } },
      { id: 'rw-tswv', hmongRPA: 'tswv', english: 'authority, boss, leader · owner, master; lord — "tswv cuab", a member', category: 'reading-law', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ninham yog ib tug tswv cuab ntawm Menominee Indian Tribe, thiab nws hais tias nws nyuam qhuav muaj kev txaus siab tshiab rau Native American kev ntseeg.', english: 'Ninham, a member of the Menominee Indian Tribe, claimed to have a newfound interest in Native American spirituality.' } },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-body',
    title: 'Body, Life & Death',
    description: 'The body, illness and healing, and being born, alive or dead.',
    emoji: '🫁',
    words: [
      { id: 'phr-hauv-paus', hmongRPA: 'hauv paus', english: 'the base, the foot of something', category: 'reading-body', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zaum ntawm hauv paus ntoo.', english: 'He sat at the base of the tree.', source: 'ai' } },
      { id: 'phr-mob-siab', hmongRPA: 'mob siab', english: 'grief; to be heartsick', category: 'reading-body', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mob siab tom qab poob nws txiv.', english: 'She grieved after losing her father.', source: 'ai' } },
      { id: 'phr-rov-qab', hmongRPA: 'rov qab', english: 'back; to return, to go back', category: 'reading-body', tags: ['adverb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav rov qab los tagkis.', english: 'We will come back tomorrow.', source: 'ai' } },
      { id: 'misc-muab', hmongRPA: 'muab', english: 'give; hand over · put; place · use; take — introducing the tool or object of an action', category: 'reading-body', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muab phau ntawv rau nws.', english: 'I give the book to her.', source: 'ai' } },
      // ══════════════════════════════════════════════════════════════════
      // ⚠️⚠️ DRAFT GLOSSES — WRITTEN BY CLAUDE, NOT CHECKED BY ANYONE FLUENT.
      // Added 2026-09-13 at the author's request, to be reviewed and corrected.
      // ══════════════════════════════════════════════════════════════════
      //
      // These are the 64 words that appear in the two stories and had NO gloss
      // anywhere in the app — not in a story glossary, not in a Speak lesson.
      // Every definition below is my best attempt from context and general
      // knowledge of White Hmong. **Some of them are wrong.** They exist so the
      // reader stops saying "no entry for this word yet" on half the words on
      // the page, and so there is something concrete to correct.
      //
      // ⚠️ THIS IS THE EXACT THING THE REST OF THIS FILE AVOIDS. Everywhere else,
      // a gloss came from the author or from the web app's own data. These did
      // not. They are marked so they can never be mistaken for reviewed
      // content:
      //
      //     tags: ['draft', 'unreviewed', 'reading']
      //
      // ⚠️ TO REVIEW: `grep "'draft'" src/data/vocabulary.js`. Correct the
      // english, then DELETE 'draft' and 'unreviewed' from that entry's tags.
      // The tag going away is the record that a person looked at it.
      //
      // ⚠️ TEN OF THESE ARE ALREADY COMMENTED OUT — 2026-09-13, and for a reason
      // that is not "the translation was wrong".
      //
      // EIGHT WERE FRAGMENTS. `kis`, `sis`, `tsi`, `si`, `tab`, `to`, `maj`,
      // `laim` — every one of their glosses began by admitting the word has no
      // meaning alone: "in \"tag kis\", morning". `kis` does not mean morning;
      // TAG KIS means morning. An entry like that is the Hmong equivalent of
      // defining "kempt" because "unkempt" exists.
      //
      // The damage is not a wrong definition, it is a wrong LESSON: a learner
      // who presses `si` and gets an answer has just been taught that Hmong can
      // be looked up one syllable at a time, which is the opposite of true in a
      // language built on two-word compounds.
      //
      // ⚠️ THE REAL FIX FOR THESE IS THE TIER-3 LOOKUP CHANGE (see notes/TODO).
      // Pressing `si` should surface `ua si` — the thing that actually means
      // something — not a fragment and not silence. Restore these only if that
      // change never happens AND somebody fluent says the standalone entry is
      // genuinely useful.
      //
      // TWO WERE CHARACTERS. `ntxawm` and `nkaub` are the girl and her brother
      // in "Ntxawm Lub Xauv". A name in the dictionary is not merely untidy:
      // vocabulary.js feeds the QUIZZES, the flashcard decks and the SRS
      // scheduler, so a learner could be drilled on "what does Ntxawm mean?" and
      // have it scheduled for spaced repetition. They now live in that story's
      // own glossary instead, where a long-press still answers and nothing else
      // can reach them.
      //
      // `zaub` stayed, as "vegetables" — a real word that happens to also be the
      // great-grandmother's name. `dab` and `tsuag` stayed too, reworded to lead
      // with the sense they carry alone.
      //
      // ⚠️ THREE KINDS OF ENTRY ARE FLAGGED IN THEIR OWN TAGS:
      //   'bound' — I believe this word mostly appears inside a compound, so the
      //             gloss describes the compound rather than the word alone.
      //             These are the most likely to be wrong as standalone entries,
      //             and the best candidates for deleting outright.
      //   'name'  — looks like a personal name in these stories (Ntxawm, Nkaub,
      //             Zaub), not vocabulary. A dictionary entry for a character's
      //             name may not belong here at all.
      //
      // ⚠️ NOT A SUBSTITUTE FOR THE REAL FIX. Nineteen further words are missing
      // only because lookupWord's tier 3 matches a single token against whole
      // entries, so "kas" never finds "tus kas". That is a code change, not a
      // vocabulary one, and it would cost nothing in accuracy.
      { id: 'misc-dab', hmongRPA: 'dab', english: 'spirit; ghost; supernatural being (noun) · dab tsi = what; anything (compound interrogative expression) — ⚠ “what” is not a standalone sense of dab', category: 'reading-body', tags: ['bound', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv hais tias muaj dab nyob hauv tsev.', english: 'They say there is a ghost in the house.', source: 'ai' } },  // Was: 'Lawv hais tias muaj dab hauv tsev.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'misc-pw', hmongRPA: 'pw', english: 'to sleep, to lie down', category: 'reading-body', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv pw ntxov txhua hmo.', english: 'I go to bed early every night.', source: 'ai' } },
      { id: 'misc-taug', hmongRPA: 'taug', english: 'to walk along; in "taug kev", to travel on foot', category: 'reading-body', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Peb taug kev mus tom khw.', english: 'We walk to the market.', source: 'ai' } },
      { id: 'misc-lub-siab', hmongRPA: 'lub siab', english: 'inner intention, desire, resolve — literally the heart or liver', category: 'reading-body', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv lub siab xav kawm ntxiv.', english: 'I am determined to keep learning.', source: 'ai' } },
      { id: 'misc-tso-siab', hmongRPA: 'tso siab', english: 'to trust; to put one\'s heart at ease', category: 'reading-body', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tso siab rau kuv tus phooj ywg.', english: 'I trust my friend.', source: 'ai' } },
      { id: 'misc-nraub-qaum', hmongRPA: 'nraub qaum', english: 'back (of the body)', category: 'reading-body', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nraub qaum mob heev.', english: 'My back hurts badly.', source: 'ai' } },
      { id: 'misc-hlab-ntsha', hmongRPA: 'hlab ntsha', english: 'blood vessel; pulse', category: 'reading-body', tags: ['noun', 'body', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob kuaj kuv hlab ntsha.', english: 'The doctor checked my pulse.', source: 'ai' } },
      { id: 'misc-ntiaj-teb', hmongRPA: 'ntiaj teb', english: 'the world, the earth', category: 'reading-body', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb txhua tus nyob hauv ntiaj teb.', english: 'We all live on Earth.', source: 'ai' } },
      { id: 'misc-ntsuj-plig', hmongRPA: 'ntsuj plig', english: 'spirit, soul', category: 'reading-body', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv ntseeg tias ntsuj plig tseem nyob.', english: 'They believe the soul remains.', source: 'ai' } },
      { id: 'misc-ntuj', hmongRPA: 'ntuj', english: 'sky (noun) · heaven; upper spiritual realm (noun) · hmo ntuj = night (compound noun) · tsaus ntuj = evening; nighttime; darkness (compound time expression)', category: 'reading-body', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Huab dawb nyob saum ntuj.', english: 'White clouds are in the sky.', source: 'ai' } },
      { id: 'misc-mob', hmongRPA: 'mob', english: 'sick; ill · pain; illness; injury · hurt; be painful', category: 'reading-body', tags: ['verb', 'noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mob taub hau hnub no.', english: 'I have a headache today.', source: 'ai' } },
      // Single words the dictionary had never reached, found by auditing which
      // taps in a real text returned nothing. Multi-word phrases went to the
      // new `misc-phrases` category instead.
      //
      // ⚠️ Rewritten for a dictionary: a story gloss may say "here, concrete";
      // a dictionary has no "here". Where a word only lives inside a compound
      // the entry NAMES the compound rather than inventing a bare meaning.
      { id: 'misc-yoj', hmongRPA: 'yoj', english: 'to swing, to sway back and forth', category: 'reading-body', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam yoj ntawm lub rooj zaum.', english: 'The child swings on the chair.', source: 'ai' } },
      { id: 'misc-dhia', hmongRPA: 'dhia', english: 'to jump; to dance — and of a pulse or a heart, to beat.', category: 'reading-body', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam nyiam dhia ua si.', english: 'The child likes to jump while playing.', source: 'ai' } },
      { id: 'misc-kho', hmongRPA: 'kho', english: 'repair; fix · treat; heal · improve; revise; amend', category: 'reading-body', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kws kho mob kho kuv txhais tes.', english: 'The doctor treated my hand.', source: 'ai' } },
      { id: 'misc-neej', hmongRPA: 'neej', english: 'life · livelihood; way of living · entire lifetime — in "tas sim neej"', category: 'reading-body', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav saib xyuas peb lub neej.', english: 'We should take care of our lives.', source: 'ai' } },
      { id: 'misc-cev', hmongRPA: 'cev', english: 'body (noun) · physical self; bodily form (noun) · hand over; pass something, as in cev tes (transitive verb)', category: 'reading-body', tags: ['noun', 'body', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cev tseem mob tom qab poob.', english: 'My body still hurts after the fall.', source: 'ai' } },
      { id: 'misc-rov', hmongRPA: 'rov', english: 'back; again — returning to a previous place or state · again; once more · restore; revive — "sawv rov los", stood up again', category: 'reading-body', tags: ['particle', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nws rov los tsev yav tsaus ntuj.', english: 'He came back home in the evening.', source: 'ai' } },
      { id: 'misc-ho', hmongRPA: 'ho', english: 'emphatic in a question — "ua cas koj ho…", why on earth did you…', category: 'reading-body', tags: ['particle','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ua cas koj ho tsis tuaj?', english: "Why didn't you come?", source: 'ai' } },
      { id: 'gen-sia', hmongRPA: 'sia', english: 'life', category: 'reading-body', tags: ['noun','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txhua tus muaj sia thiab muaj kev cia siab.', english: 'Everyone is alive and has hope.', source: 'ai' } },
      { id: 'gen-tuag', hmongRPA: 'tuag', english: 'dead; to die', category: 'reading-body', tags: ['adjective','verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus noog me tuag lawm.', english: 'The little bird has died.', source: 'ai' } },
      { id: 'gen-ceeb-laj', hmongRPA: 'ceeb laj', english: 'sick and tired of something; exhausting', category: 'reading-body', tags: ['adjective','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ceeb laj ua haujlwm txhua hnub.', english: 'I am exhausted from working every day.', source: 'ai' } },
      { id: 'gen-dab-ntub', hmongRPA: 'dab ntub', english: 'sleep; alternative term', category: 'reading-body', tags: ['noun','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam dab ntub ntxov txhua hmo.', english: 'The child sleeps early every night.', source: 'ai' } },
      { id: 'gen-fab-seeb', hmongRPA: 'fab seeb', english: 'reincarnation', category: 'reading-body', tags: ['noun','culture','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv ntseeg txog fab seeb.', english: 'They believe in reincarnation.', source: 'ai' } },
      { id: 'gen-laj-muam', hmongRPA: 'laj muag', english: 'to side-glance; cross-eyed', category: 'reading-body', tags: ['verb','adjective','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws laj muag thaum saib ib sab.', english: 'He looks sideways with crossed eyes.', source: 'ai' } },
      { id: 'gen-looj-hlias', hmongRPA: 'looj hlias', english: 'to doze off', category: 'reading-body', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv looj hlias thaum zaum tos.', english: 'I dozed off while waiting.', source: 'ai' } },
      { id: 'gen-pauj', hmongRPA: 'pauj', english: 'to take revenge; to pay back', category: 'reading-body', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tsis xav pauj rau nws.', english: 'He does not want revenge.', source: 'ai' } },
      { id: 'gen-sablaj', hmongRPA: 'sablaj', english: 'to brainstorm; to discuss; to plan', category: 'reading-body', tags: ['verb','work','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb sablaj ua ntej pib haujlwm.', english: 'We discuss before starting work.', source: 'ai' } },
      { id: 'gen-yajceeb', hmongRPA: 'yajceeb', english: 'life on earth', category: 'reading-body', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav saib xyuas yajceeb kom zoo.', english: 'We should care for life on earth.', source: 'ai' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-yug', hmongRPA: 'yug', english: 'to give birth; to be born · to raise (animals)', category: 'reading-body', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog qhov tshwm sim los ntawm kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.', english: 'They are the result of a combination of what a person is born with and what that person encounters and learns during life.' } },
      // Added 2026-09-26 — a course reading tapped this word and got "no entry".
      { id: 'rw-da-dej', hmongRPA: 'da dej', english: 'to bathe, to take a bath or shower — "dab da dej", a bathtub', category: 'reading-body', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txhuam lub dab da dej.', english: 'I scrub the bathtub.' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-loj-hlob', hmongRPA: 'loj hlob', english: 'to grow up, grow big — physical growth and/or maturity', category: 'reading-body', tags: ['reading', 'unreviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-mind',
    title: 'Thinking & Knowing',
    description: 'Thought, memory, intention and judgement.',
    emoji: '🧠',
    words: [
      { id: 'phr-nco-txog', hmongRPA: 'nco txog', english: 'to remember, to think of', category: 'reading-mind', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nco txog kuv pog txhua hnub.', english: 'I think of my grandmother every day.', source: 'ai' } },
      { id: 'phr-kwv-yees', hmongRPA: 'kwv yees', english: 'to estimate, to reckon — "kwv yees li", about or roughly', category: 'reading-mind', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kwv yees tias nws muaj peb caug xyoo.', english: 'I estimate that he is thirty years old.', source: 'ai' } },
      { id: 'misc-taub', hmongRPA: 'taub', english: 'squash, gourd; separately, in "to taub", to understand', category: 'reading-mind', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Peb cog taub hauv vaj.', english: 'We grow squash in the garden.', source: 'ai' } },
      { id: 'misc-ua-ib-siab', hmongRPA: 'ua ib siab', english: "to make up one's mind; to steel oneself", category: 'reading-mind', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv ua ib siab pib dua tshiab.', english: 'I made up my mind to start again.', source: 'ai' } },
      { id: 'misc-paub-li-mas', hmongRPA: 'paub li mas', english: '"I should have known" — an expression of realisation or regret', category: 'reading-mind', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Paub li mas, kuv yuav tsum tau nug.', english: 'I should have known to ask.', source: 'ai' } },
      { id: 'misc-nco', hmongRPA: 'nco', english: 'to miss, to remember', category: 'reading-mind', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nco kuv tsev neeg heev.', english: 'I miss my family very much.', source: 'ai' } },
      { id: 'misc-paub', hmongRPA: 'paub', english: 'know; be aware of · know how to; understand · recognise; find out', category: 'reading-mind', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv paub yuav ua li cas.', english: 'I know how to do it.', source: 'ai' } },
      { id: 'misc-xav', hmongRPA: 'xav', english: 'want; wish · think; believe; suppose · miss; long for', category: 'reading-mind', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xav kawm lus Hmoob ntxiv.', english: 'I want to learn more Hmong.', source: 'ai' } },
      { id: 'misc-nco-qab', hmongRPA: 'nco qab', english: 'to remember', category: 'reading-mind', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nco qab koj lub npe.', english: 'I remember your name.', source: 'ai' } },
      { id: 'misc-ntseeg', hmongRPA: 'ntseeg', english: 'believe; trust (verb) · txoj kev ntseeg = faith; religion; belief (compound noun)', category: 'reading-mind', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntseeg kuv tus phooj ywg.', english: 'I trust my friend.', source: 'ai' } },
      { id: 'misc-ua-txuj', hmongRPA: 'ua txuj', english: 'to pretend, to put on an act', category: 'reading-mind', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws ua txuj tias nws tsis paub.', english: "She pretended that she didn't know.", source: 'ai' } },
      { id: 'misc-tseeb', hmongRPA: 'tseeb', english: 'true, certain — "paub tseeb", to know for certain', category: 'reading-mind', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv paub tseeb tias nws yuav tuaj.', english: 'I know for certain that he will come.', source: 'ai' } },
      { id: 'misc-txawj', hmongRPA: 'txawj', english: 'to know how to, to be able to', category: 'reading-mind', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws txawj ua zaub mov qab.', english: 'She knows how to cook delicious food.', source: 'ai' } },
      { id: 'misc-cim', hmongRPA: 'cim', english: 'a mark, a sign, an emblem — and to memorise, to fix in mind: "cim tseg".', category: 'reading-mind', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv cim nws lub npe tseg.', english: 'I memorized his name.', source: 'ai' } },
      { id: 'gen-cim-xeeb', hmongRPA: 'cim xeeb', english: 'mind; memory', category: 'reading-mind', tags: ['noun','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws lub cim xeeb zoo heev.', english: 'Her memory is very good.', source: 'ai' } },
      { id: 'gen-kwv-yees', hmongRPA: 'kwv yees', english: 'to estimate; approximately', category: 'reading-mind', tags: ['verb','adjective','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kwv yees li kaum feeb.', english: 'I estimate about ten minutes.', source: 'ai' } },
      { id: 'gen-keeb', hmongRPA: 'keeb', english: 'origin; starting point', category: 'reading-mind', tags: ['noun','everyday','unreviewed'], audioFile: null },
      { id: 'gen-meej-pem', hmongRPA: 'meej pem', english: 'clear; understandable', category: 'reading-mind', tags: ['adjective','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws piav meej pem heev.', english: 'She explains things very clearly.', source: 'ai' } },
      { id: 'gen-qauv', hmongRPA: 'qauv', english: 'pattern; role model', category: 'reading-mind', tags: ['noun','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog ib qho qauv zoo.', english: 'She is a good role model.', source: 'ai' } },
      { id: 'gen-ras', hmongRPA: 'ras', english: 'to recall; to remember', category: 'reading-mind', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ras tsis tau nws lub npe.', english: 'I cannot recall his name.', source: 'ai' } },
      { id: 'gen-temtoob', hmongRPA: 'temtoob', english: 'forgetful; unaware', category: 'reading-mind', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-lub-xeev-siab', hmongRPA: 'lub xeev siab', english: 'state of mind; psychological or emotional state', category: 'reading-mind', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov uas ua rau qhov no tseem ceeb tshaj yog thaum peb los xam txog seb kev hloov pauv lub xeev siab cuam tshuam li cas rau kev tsim kho lub zej zog.', english: 'What makes this especially important is considering how changes in psychological state affect the development of communities.' } },
      { id: 'phr-txoj-kev-xav', hmongRPA: 'txoj kev xav', english: 'thought; a way of thinking; beliefs', category: 'reading-mind', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.', english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.' } },
      { id: 'phr-kev-tawm-tswv-yim', hmongRPA: 'kev tawm tswv yim', english: 'forming and expressing one’s own views', category: 'reading-mind', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.', english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.' } },
      { id: 'phr-rov-xav-dua', hmongRPA: 'rov xav dua', english: 'to reconsider; to think again', category: 'reading-mind', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tiamsis, yog tias feem ntau ntawm tib neeg txoj kev coj ua yog raug txiav txim los ntawm yam nws yug los nrog, ces cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab los ntawm lawv tus kheej lub xeev siab.', english: 'However, if most human behavior is determined by what a person is born with, then community leaders must reconsider their approach to helping people who suffer difficulties because of their own psychological state.' } },
      { id: 'phr-to-taub', hmongRPA: 'to taub', english: 'to understand; to see through', category: 'reading-mind', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus nas twb to taub tus miv lub siab tas.', english: 'The mouse already understands the cat\'s intentions.' } },
      { id: 'phr-hwm', hmongRPA: 'hwm', english: 'to respect; to honor', category: 'reading-mind', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai uas peb yuav tsum coj mus rau yav pem suab.', english: 'Therefore, respecting and caring for the environment is part of our cultural heritage that we must carry forward into the future.' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-xyaum', hmongRPA: 'xyaum', english: 'to practice, rehearse, learn by doing · to imitate; to follow, obey (customs, rules, laws)', category: 'reading-mind', tags: ['reading', 'unreviewed'], audioFile: null },
      { id: 'misc-to-2', hmongRPA: 'to', english: 'having a hole, pierced — "to qhov"; "to ntshua", broken through · open, permitted — "to kev ua", all right to do; "tsis to kev ua", not permitted · to understand, in compounds — "to taub" (= nkag siab), "to siab"; "tsis to ntsej", can\'t understand · silent, still; ineffective (of medicine); sometimes deep', category: 'reading-mind', tags: ['reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub hnab to qhov.', english: 'The sack has a hole in it.' } },
      // Added 2026-09-30 (the author). A homonym of yim, eight (numbers-8).
      { id: 'misc-yim', hmongRPA: 'yim', english: 'the mind, thoughts, intentions, a state of being — an abstract root, used mostly in compound words', category: 'reading-mind', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-tem-toob', hmongRPA: 'tem toob', english: 'to be forgetful; not aware', category: 'reading-mind', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-sab-laj', hmongRPA: 'sab laj', english: 'to brainstorm, discuss, plan', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tshawb-fawb', hmongRPA: 'tshawb fawb', english: 'to research, examine, search', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-xij-peem', hmongRPA: 'xij peem', english: 'to not stress about it', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-xeeb-ceem', hmongRPA: 'xeeb ceem', english: 'personality', category: 'reading-mind', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-phim', hmongRPA: 'phim', english: 'to be similar/match', category: 'reading-mind', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-tshua', hmongRPA: 'tshua', english: 'to miss or think of dearly', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-dhuav', hmongRPA: 'dhuav', english: 'to be tired of, sick of', category: 'reading-mind', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nyoo', hmongRPA: 'nyoo', english: 'to give up', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nqhis', hmongRPA: 'nqhis', english: 'to crave for', category: 'reading-mind', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-emotion',
    title: 'Feeling',
    description: 'Emotion and mood, including the `siab` expressions that carry most of it.',
    emoji: '💛',
    words: [
      // ── HATE — 2026-09-28, the author's definitions. ntxub is the most common way to say
      // "hate"; ntxub ntxaug is hate aimed at a GROUP (discrimination, prejudice); nciab is being
      // repulsed or put off — sometimes said for hate, but it is strong distaste, not malice.
      { id: 'emo-ntxub', hmongRPA: 'ntxub', english: 'to hate, detest, loathe — a specific person, action or thing; the most common word for hate', category: 'reading-emotion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntxub koj.', english: 'I hate you.' } },
      { id: 'emo-kev-ntxub', hmongRPA: 'kev ntxub', english: 'hatred, animosity', category: 'reading-emotion', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev ntxub tsis pab leej twg.', english: 'Hatred helps no one.', source: 'ai' } },
      { id: 'emo-ntxub-ntxaug', hmongRPA: 'ntxub ntxaug', english: 'to discriminate against, show prejudice toward, despise — a group of people', category: 'reading-emotion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tub rog Nplog tseem ntxub ntxaug cov Hmoob uas nyob hauv hav zoov.', english: 'The Laotian armed forces still hate the Hmong people living in the jungle.', source: 'ai' } },
      { id: 'emo-kev-ntxub-ntxaug', hmongRPA: 'kev ntxub ntxaug', english: 'discrimination, prejudice', category: 'reading-emotion', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev ntxub ntxaug tsis zoo.', english: 'Discrimination is wrong.', source: 'ai' } },
      { id: 'emo-nciab', hmongRPA: 'nciab', english: 'to be sickened by, repulsed by, averse to — strong distaste, a physical or emotional recoil; sometimes used for hate, by context, but not malicious anger', category: 'reading-emotion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nciab cov nqaij no.', english: 'This meat puts me off.', source: 'ai' } },
      {id: 'phr-chim', hmongRPA: 'chim', english: 'anger; be angry (noun / stative verb) · inner feeling; disposition in compounds (noun)', category: 'reading-emotion', tags: ['verb', 'reading', 'unreviewed', 'needs-source-review'], audioFile: null, exampleSentence: { hmong: 'Kuv chim thaum hnov cov lus ntawd.', english: 'I got angry when I heard those words.', source: 'ai' } },
      {id: 'phr-chim-siab', hmongRPA: 'chim siab', english: 'to be angry, to be upset; bitter, wrathful, resentful, hateful', category: 'reading-emotion', tags: ['adjective','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws chim siab vim raug thuam.', english: 'She was upset because she was mocked.', source: 'ai' } },
      { id: 'phr-lom-zem', hmongRPA: 'lom zem', english: 'fun, funny, enjoyable', category: 'reading-emotion', tags: ['adjective','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no peb lom zem heev.', english: 'We had a lot of fun today.', source: 'ai' } },
      // The author's own glossary for the story they wrote, plus the two single
      // words the Speak lessons already gloss. NOT tagged `unreviewed`: that tag
      // means nobody fluent has checked the gloss, and here somebody fluent
      // wrote it.
      { id: 'misc-npau-taws', hmongRPA: 'npau taws', english: 'anger, angry; metaphorical description of "boiling over" like fire or hot liquid, leading to anger or emotional instability · provocation (in certain circumstances)', category: 'reading-emotion', tags: ['reading'], audioFile: null, exampleSentence: { hmong: 'Nws npau taws thaum hnov xov ntawd.', english: 'He became angry when he heard that news.', source: 'ai' } },
      { id: 'misc-kaj', hmongRPA: 'kaj', english: 'bright, light; in "kaj siab", content', category: 'reading-emotion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Lub hnub kaj heev hnub no.', english: 'The sun is very bright today.', source: 'ai' } },
      { id: 'misc-tu', hmongRPA: 'tu', english: 'to care for, look after, maintain, tend · to stop, break off, cease (by context) · in "tu siab", sad',  /* was 'to care for; to break off, to cease; in "tu siab", sad' — 2026-09-30 */ category: 'reading-emotion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Nws tu siab tom qab hnov xov ntawd.', english: 'She was sad after hearing that news.', source: 'ai' } },
      { id: 'misc-luab-lim', hmongRPA: 'luab lim', english: 'to tease, to mock, to make fun of', category: 'reading-emotion', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob luab lim koj tus phooj ywg.', english: 'Do not make fun of your friend.', source: 'ai' } },
      { id: 'misc-hlub', hmongRPA: 'hlub', english: 'to love', category: 'reading-emotion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hlub kuv tsev neeg heev.', english: 'I love my family very much.', source: 'ai' } },
      { id: 'misc-khiav', hmongRPA: 'khiav', english: 'run · operate; function — of a machine or process · flee; escape', category: 'reading-emotion', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam khiav mus tom tsev.', english: 'The child ran home.', source: 'ai' } },
      { id: 'misc-ntshai', hmongRPA: 'ntshai', english: 'fear; be afraid · frightening; scary — in "txaus ntshai"', category: 'reading-emotion', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntshai thaum tsaus ntuj.', english: 'I am afraid at night.', source: 'ai' } },
      { id: 'gen-dai-siab', hmongRPA: 'dai siab', english: 'to miss dearly', category: 'reading-emotion', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv dai siab kuv niam thaum nws mus lawm.', english: 'I miss my mother dearly when she is away.', source: 'ai' } },
      { id: 'gen-peem', hmongRPA: 'peem', english: 'to endure', category: 'reading-emotion', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws peem dhau lub sijhawm nyuaj.', english: 'She endured the difficult period.', source: 'ai' } },
      { id: 'gen-xijpeem', hmongRPA: 'xijpeem', english: 'do not stress about it', category: 'reading-emotion', tags: ['phrase','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xijpeem, peb yuav nrhiav kev daws.', english: "Don't stress; we will find a solution.", source: 'ai' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-mluas', hmongRPA: 'mluas', english: 'to be depressed or sad looking', category: 'reading-emotion', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntshaus', hmongRPA: 'ntshaus', english: 'to look sad or frightened', category: 'reading-emotion', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-rhiab', hmongRPA: 'rhiab', english: 'to be ticklish; to be grossed out by', category: 'reading-emotion', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-khaum', hmongRPA: 'khaum', english: 'to be cursed for doing bad deeds', category: 'reading-emotion', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-npam', hmongRPA: 'npam', english: 'to be cursed', category: 'reading-emotion', tags: ['adjective', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-speech',
    title: 'Speaking & Telling',
    description: 'Saying, asking, answering and arguing.',
    emoji: '🗣️',
    words: [
      { id: 'phr-sib-cav', hmongRPA: 'sib cav', english: 'to argue, to contend', category: 'reading-speech', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ob tus kwv tij sib cav txog nyiaj.', english: 'The two brothers argued about money.', source: 'ai' } },
      { id: 'phr-lo-lus', hmongRPA: 'lo lus', english: 'a word; a remark or a question', category: 'reading-speech', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsis nkag siab lo lus no.', english: 'I do not understand this word.', source: 'ai' } },
      { id: 'phr-hu-npe', hmongRPA: 'hu npe', english: 'to be named, to be called', category: 'reading-speech', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam hu npe hu ua Nplooj.', english: 'The child is named Nplooj.', source: 'ai' } },
      { id: 'misc-xuav-kauv', hmongRPA: 'xuav kauv', english: 'to whistle; a whistling or hissing sound', category: 'reading-speech', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Nws xuav kauv thaum taug kev.', english: 'He whistles while walking.', source: 'ai' } },
      { id: 'misc-li', hmongRPA: 'li', english: 'like; as — comparison or manner · according to; in the manner of — "ua li kuv hais", do as I say · so; then; in that way — discourse use, "ua li"', category: 'reading-speech', tags: ['particle', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Ua li kuv hais mas.', english: 'Do as I say.', source: 'ai' } },
      { id: 'misc-lub-suab', hmongRPA: 'lub suab', english: 'a voice; a sound', category: 'reading-speech', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hnov nws lub suab sab nraud.', english: 'I hear her voice outside.', source: 'ai' } },
      { id: 'misc-qw', hmongRPA: 'qw', english: 'to shout, to scream', category: 'reading-speech', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob qw hauv tsev.', english: 'Do not shout in the house.', source: 'ai' } },
      { id: 'misc-thuam', hmongRPA: 'thuam', english: 'to taunt, to mock, to insult', category: 'reading-speech', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob thuam lwm tus neeg.', english: 'Do not insult other people.', source: 'ai' } },
      { id: 'misc-lees', hmongRPA: 'lees', english: 'admit; acknowledge; concede (transitive verb) · accept; receive (transitive verb) · take responsibility for (verb construction) · lees txais = accept; receive (compound verb)', category: 'reading-speech', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nws lees tias nws ua yuam kev.', english: 'She admits that she made a mistake.', source: 'ai' } },
      { id: 'misc-kam', hmongRPA: 'kam', english: 'to be willing; to agree to', category: 'reading-speech', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kam pab koj hnub no.', english: 'I am willing to help you today.', source: 'ai' } },
      { id: 'rv-tab', hmongRPA: 'tab', english: 'bound word — not used alone: tab sis = but; however (conjunction) · tab tom = currently doing; in the process of doing (progressive aspect construction)', category: 'reading-speech', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'rv-twg', hmongRPA: 'twg', english: 'which; what; where; who, depending on construction (interrogative word) · qhov twg = where; which place (interrogative compound) · thaum twg = when (interrogative compound) · leej twg = who (interrogative compound)', category: 'reading-speech', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Koj xav mus qhov twg?', english: 'Where do you want to go?', source: 'ai' } },
      { id: 'rv-tsi', hmongRPA: 'tsi', english: 'what (interrogative word) · anything; something in indefinite or negative constructions (indefinite interrogative element) · dab tsi = what; anything (compound interrogative phrase) · yam dab tsi = anything; something (compound noun phrase)', category: 'reading-speech', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Koj xav noj tsi?', english: 'What do you want to eat?', source: 'ai' } },
      { id: 'rv-cas', hmongRPA: 'cas', english: 'how; why; what kind of, depending on construction (interrogative word) · vim li cas = why (compound interrogative expression) · kim npaum li cas = how expensive; how much (compound question expression)', category: 'reading-speech', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Vim li cas koj tsis tuaj?', english: "Why didn't you come?", source: 'ai' } },
      { id: 'rv-phooj', hmongRPA: 'phooj', english: 'bound word — not used alone: phooj ywg = friend (compound noun)', category: 'reading-speech', tags: ['reading', 'needs-source-review'], audioFile: null },
      { id: 'rv-ywg', hmongRPA: 'ywg', english: 'bound word — not used alone: phooj ywg = friend (compound noun)', category: 'reading-speech', tags: ['reading', 'needs-source-review'], audioFile: null },
      { id: 'rv-cav', hmongRPA: 'cav', english: 'argue; dispute; contend (verb) · claim; maintain; assert (verb)', category: 'reading-speech', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv cav txog qhov teeb meem no.', english: 'They argued about this issue.', source: 'ai' } },
      {
        id: 'misc-sense-zaum-maybe',
        hmongRPA: 'zaum',
        english: 'perhaps, maybe — only with a word in front of it, most often "tej zaum". Never "maybe" on its own.',
        category: 'reading-speech',
        tags: ['sense', 'particle', 'unreviewed'],
        audioFile: null,
      },
      { id: 'misc-cog', hmongRPA: 'cog', english: 'to plant — and to make a promise: "cog lus".', category: 'reading-speech', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb cog pob kws hauv vaj.', english: 'We plant corn in the garden.', source: 'ai' } },
      { id: 'misc-hu', hmongRPA: 'hu', english: 'to call, to summon — and to sing: "hu nkauj". Also "hu ua", called or named.', category: 'reading-speech', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hu kuv tus phooj ywg tuaj.', english: 'I called my friend to come.', source: 'ai' } },
      { id: 'misc-hlis', hmongRPA: 'hlis', english: 'month (noun) · month-name element (proper-name element) · Peb Hlis = March (proper noun) · Cuaj Hlis = September (proper noun)', category: 'reading-speech', tags: ['noun', 'time', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Ib hlis muaj ntau hnub.', english: 'A month has many days.', source: 'ai' } },
      { id: 'misc-npe', hmongRPA: 'npe', english: 'a name', category: 'reading-speech', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj lub npe hu li cas?', english: 'What is your name?', source: 'ai' } },
      { id: 'misc-lus', hmongRPA: 'lus', english: 'word · speech; words; statement · language', category: 'reading-speech', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kawm lus Hmoob txhua hnub.', english: 'I study the Hmong language every day.', source: 'ai' } },
      { id: 'misc-laj', hmongRPA: 'laj', english: 'bound word: "laj thawj", a reason — not used alone', category: 'reading-speech', tags: ['bound','reading','unreviewed'], audioFile: null },
      { id: 'misc-ntaub', hmongRPA: 'ntaub', english: 'bound word here: "ntaub ntawv", documents or records', category: 'reading-speech', tags: ['bound','reading','unreviewed'], audioFile: null },
      { id: 'misc-kheej', hmongRPA: 'kheej', english: 'bound word: "tus kheej", oneself — not used alone', category: 'reading-speech', tags: ['bound','reading','unreviewed'], audioFile: null },
      { id: 'misc-txwm', hmongRPA: 'txwm', english: 'bound word — not used alone: txhob txwm = deliberately; intentionally; on purpose (compound adverb)', category: 'reading-speech', tags: ['bound', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-caug', hmongRPA: 'caug', english: 'bound word in numbers: "-ty", as in "tsib caug" fifty', category: 'reading-speech', tags: ['number','bound','reading','unreviewed'], audioFile: null },
      { id: 'misc-sib', hmongRPA: 'sib', english: 'each other; one another (reciprocal marker) · mutual action marker placed before a verb (verbal prefix / grammatical marker) · sib ntaus = fight each other (reciprocal verb) · sib cav = argue with each other (reciprocal verb)', category: 'reading-speech', tags: ['particle', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Ob tus menyuam sib cav tsis tu.', english: 'The two children keep arguing with each other.', source: 'ai' } },
      { id: 'gen-ceeb-toom', hmongRPA: 'ceeb toom', english: 'to warn; to notify', category: 'reading-speech', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ceeb toom nws ua ntej tawm mus.', english: 'I warned him before leaving.', source: 'ai' } },
      { id: 'gen-lees', hmongRPA: 'lees', english: 'to confess; to admit', category: 'reading-speech', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws lees tias nws ua txhaum.', english: 'He admits that he did wrong.', source: 'ai' } },
      { id: 'gen-taug-xaiv', hmongRPA: 'taug xaiv', english: 'to gossip; gossip', category: 'reading-speech', tags: ['verb','noun','social','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv nyiam taug xaiv txog lwm tus.', english: 'They like gossiping about other people.', source: 'ai' } },
      { id: 'gen-zab', hmongRPA: 'zab', english: 'to lie; liar', category: 'reading-speech', tags: ['verb','noun','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob zab rau kuv.', english: 'Do not lie to me.', source: 'ai' } },
      // ── HARVESTED FROM A WORD-BY-WORD STORY SCAN, 2026-09-25 ─────────────
      { id: 'phr-xws-li', hmongRPA: 'xws li', english: 'such as; for example; like', category: 'reading-speech', tags: ['conjunction', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.', english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-seev', hmongRPA: 'seev', english: 'to hum; to sigh, moan; to long for, be homesick · to investigate, inquire into · to hold a long, drawn-out note in singing or speech · "seev cev", to dance', category: 'reading-speech', tags: ['reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ntxhis', hmongRPA: 'ntxhis', english: 'to whisper; to speak quietly in the heart or mind — "lub siab ntxhi chiv", to turn something over quietly in one\'s heart (also spelled ntxhi; varies by dialect)', category: 'reading-speech', tags: ['reading', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-qhuab-qhia', hmongRPA: 'qhuab qhia', english: 'to teach, to lecture', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-qhuas', hmongRPA: 'qhuas', english: 'to praise', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nroo', hmongRPA: 'nroo', english: 'to complain; to rumble (thunder)', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tsawm', hmongRPA: 'tsawm', english: 'to scold', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-hnyos', hmongRPA: 'hnyos', english: 'to taunt, to ridicule, to criticize', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nthaw', hmongRPA: 'nthaw', english: 'to shout', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tsham', hmongRPA: 'tsham', english: 'to visit and chat', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncha', hmongRPA: 'ncha', english: 'echo; (adjective) loud', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncauj-ncab', hmongRPA: 'ncauj ncab', english: 'to be overly talkative', category: 'reading-speech', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntshoo', hmongRPA: 'ntshoo', english: 'to be noisy, to be boisterous', category: 'reading-speech', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-txhaub', hmongRPA: 'txhaub', english: 'to instigate, incite', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-xyu', hmongRPA: 'xyu', english: 'to sigh', category: 'reading-speech', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-motion',
    title: 'Moving & Handling',
    description: 'Going, coming, and moving things about.',
    emoji: '🚶',
    words: [
      { id: 'misc-dua', hmongRPA: 'dua', english: 'again; another time · more; additional · pass; go past · than — comparative marker', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav sim dua tagkis.', english: 'I will try again tomorrow.', source: 'ai' } },
      { id: 'misc-poob', hmongRPA: 'poob', english: 'fall; drop · lose; misplace · fail; be defeated', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv poob kuv tus yuam sij lawm.', english: 'I lost my key.', source: 'ai' } },
      { id: 'misc-puag', hmongRPA: 'puag', english: 'to hug, to hold; also far over, away', category: 'reading-motion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Niam puag tus menyuam pw.', english: 'Mother holds the sleeping child.', source: 'ai' } },
      { id: 'misc-tawm', hmongRPA: 'tawm', english: 'go out; come out; exit · leave; depart · appear; come out; be released', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Peb tawm hauv tsev thaum sawv ntxov.', english: 'We leave the house in the morning.', source: 'ai' } },
      { id: 'misc-tua', hmongRPA: 'tua', english: 'kill; slaughter an animal (transitive verb) · shoot; fire something — a gun, a bow, an arrow (transitive verb) · fight — "tua rog", to fight in a war; "sib tua", to fight to the death, to kill each other · turn off; put out, extinguish — a light, a fire: "tua teeb", "tua hluav taws" (transitive verb) · beat; strike an instrument (transitive verb)',  /* completed 2026-09-30 (author: "make sure it has everything") — + slaughter, arrow, tua rog / sib tua (author), tua teeb / tua hluav taws. The story glossary (stories.js) carries the same text. */ category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tua lub teeb ua ntej pw.', english: 'I turn off the light before sleeping.', source: 'ai' } },
      { id: 'misc-tuaj', hmongRPA: 'tuaj', english: 'come (motion verb) · arrive (motion verb) · come to be; arise (directional / resultative verb element)', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus phooj ywg tuaj xyuas kuv.', english: 'My friend came to visit me.', source: 'ai' } },
      //
      // Every word below appears in a story and had NO dictionary entry, so
      // long-pressing it in the reader returned "no entry for this word yet".
      // Coverage was 62 of 118 distinct story tokens (53%); these close the
      // half of the gap that could be closed HONESTLY.
      //
      // ⚠️ NOTHING HERE WAS TRANSLATED BY ME. Every gloss is copied from data
      // the app already holds — the story's own glossary (written by the author
      // for that text) or a single-word step in a Speak lesson. A token with no
      // such source is NOT here: 44 of them remain undefined, and inventing a
      // meaning for them is precisely the failure this module keeps guarding
      // against.
      //
      // ⚠️ TAGGED `unreviewed`, AND THAT TAG IS THE POINT. Nine of the ten
      // stories are placeholder Hmong awaiting a native review, so these
      // glosses inherit that status — they are as good as their source and no
      // better. `grep "'unreviewed'"` is the sweep list when a fluent speaker
      // is available.
      //
      // ⚠️ WORD vs PHRASE IS MECHANICAL, NOT A JUDGEMENT CALL: one token is a
      // word, two or more is a phrase. "teeb meem" moved down for that reason
      // even though it behaves as a single noun. A rule anyone can apply beats
      // a taxonomy that needs the author present.
      { id: 'misc-caum', hmongRPA: 'caum', english: 'chase; pursue · follow after', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus aub caum tus miv hauv vaj.', english: 'The dog chased the cat in the yard.', source: 'ai' } },
      // Example added 2026-09-28 for u-verb-noun. Claude's, TODO-VERIFY.
      { id: 'misc-kawm-ntawv', hmongRPA: 'kawm ntawv', english: 'to study; to go to school', category: 'reading-motion', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kawm ntawv txhua hnub.', english: 'I study every day.', source: 'ai' } },
      { id: 'misc-khiav-ceev', hmongRPA: 'khiav ceev', english: 'to run fast', category: 'reading-motion', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-thawb', hmongRPA: 'thawb', english: 'push; shove (transitive verb) · promote; urge forward (transitive verb)', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-rub', hmongRPA: 'rub', english: 'to pull, to draw toward oneself', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tuav', hmongRPA: 'tuav', english: 'hold; grip (transitive verb) · keep; maintain (transitive verb) · support; uphold; hold firmly (transitive verb)', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-nias', hmongRPA: 'nias', english: 'to press down on', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-vij', hmongRPA: 'vij', english: 'to surround, to hem in', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-dim', hmongRPA: 'dim', english: 'escape; get free (verb) · be safe; survive (resultative verb) · free; released (stative / resultative verb)', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-txeeb', hmongRPA: 'txeeb', english: 'to snatch, to grab away', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-thauj', hmongRPA: 'thauj', english: 'to carry, to transport', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-nce', hmongRPA: 'nce', english: 'to go up, to climb', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      /* english was 'to descend, to go down' (author, 2026-09-28) */ { id: 'misc-nqes', hmongRPA: 'nqes', english: 'to go down, to descend — going downhill', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb nqes roob mus tsev.', english: 'We go down the mountain to go home.', source: 'ai' } },
      { id: 'misc-ntog', hmongRPA: 'ntog', english: 'to fall over, to land', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-kauj-ruam', hmongRPA: 'kauj ruam', english: 'a step', category: 'reading-motion', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'rv-txheej', hmongRPA: 'txheej', english: 'event; incident; occurrence (noun) · time; occasion; instance (noun) · layer; arrangement; sequence (noun) — ⚠ cross-reference xwm txheej / txheej xwm (compound nouns)', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null },
      // These carry `category: 'reading-motion'` and always did, but they physically sat
      // inside the `verbs` and `numbers` arrays, so they rendered as cards in
      // those decks: `ib` taught "a, an" on a NUMBERS card. Ids unchanged, so
      // no saved progress moved with them.
      {
        id: 'misc-sense-zaum-time',
        hmongRPA: 'zaum',
        english: 'a time, an occasion, a turn — the classifier for counting occurrences: "ib zaum" once, "ob zaum" twice, "zaum kawg" the last time',
        category: 'reading-motion',
        tags: ['sense', 'classifier', 'noun', 'unreviewed'],
        audioFile: null,
      },
      { id: 'misc-tshaj', hmongRPA: 'tshaj', english: 'pass; go past · exceed; be more than · than — comparative · most, -est, with "plaws"', category: 'reading-motion', tags: ['verb', 'grammar', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-ya', hmongRPA: 'ya', english: 'to fly', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tawg', hmongRPA: 'tawg', english: 'to break, to crack, to burst — and of a flower, to bloom: "paj tawg".', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-nqis', hmongRPA: 'nqis', english: 'to go down, to descend — and to invest: "nqis peev".', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tig', hmongRPA: 'tig', english: 'to turn, to turn around — and to turn something over.', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-txav', hmongRPA: 'txav', english: 'to move, to shift closer', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-cuag', hmongRPA: 'cuag', english: 'to reach, to catch up to — "caum cuag", to catch up with', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tsa', hmongRPA: 'tsa', english: 'to raise, to lift up', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-ntaus', hmongRPA: 'ntaus', english: 'hit; strike; punch · fight — in "sib ntaus" · play by striking — a drum or an instrument treated as struck · type; enter text — "ntaus ntawv"', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-tsuam', hmongRPA: 'tsuam', english: 'to press down on, to pin', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-caij', hmongRPA: 'caij', english: 'to ride — and a season or period of time: "caij ntuj no", winter.', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-xa', hmongRPA: 'xa', english: 'to send, to dispatch — and to see someone off, to escort.', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-nqa', hmongRPA: 'nqa', english: 'to carry — and to bring, to fetch.', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-hla', hmongRPA: 'hla', english: 'cross; go across · pass over; go beyond · skip; omit', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-kav', hmongRPA: 'kav', english: 'to last, to run for — and to govern, to rule over.', category: 'reading-motion', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-txaus', hmongRPA: 'txaus', english: 'enough; sufficient · reach; arrive at · enough to cause — resultative, as in "txaus ntshai"', category: 'reading-motion', tags: ['adjective', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no txaus lawm.', english: 'This is enough.', source: 'ai' } },
      { id: 'gen-dauv', hmongRPA: 'dauv', english: 'to hang; to dip down; to look down upon; to sham', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-fee', hmongRPA: 'fee', english: 'to turn aside; to look aside; to ignore', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-maub', hmongRPA: 'maub', english: 'to go or act without seeing', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-raus', hmongRPA: 'raus', english: 'to dip into; to participate', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-rawm', hmongRPA: 'rawm', english: 'to be in a rush', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-tauv-pem', hmongRPA: 'tauv pem', english: 'to visit; to hang out with friends and family', category: 'reading-motion', tags: ['verb','social','unreviewed'], audioFile: null },
      { id: 'gen-xabnagkis', hmongRPA: 'xabnagkis', english: 'days ahead; days to come', category: 'reading-motion', tags: ['noun','time','unreviewed'], audioFile: null },
      { id: 'gen-yais', hmongRPA: 'yais', english: 'to distribute; to pass out', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-thaiv', hmongRPA: 'thaiv', english: 'to block, to shield — "tiv thaiv", to protect, to defend', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Omer thiab Richard txav mus ze Zong, thaiv kev nws txoj kev caij tsheb kauj vab, thiab pib thuam nws.', english: 'Omer and Richard moved in close to Zong, blocked the way he was riding, and began taunting him.' } },
      { id: 'rw-tiv', hmongRPA: 'tiv', english: 'to resist, to withstand — "tiv thaiv", to protect, to defend', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li ntawd, txhua tus neeg muaj lub luag haujlwm los tiv thaiv ib puag ncig rau peb cov tub ki xeeb ntxwv.', english: 'Therefore, every person has a responsibility to protect the environment for our future generations and descendants.' } },
      { id: 'rw-zam', hmongRPA: 'zam', english: 'to avoid, to dodge; to excuse — "zam txim", to forgive', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws hais tias tag nrho qhov no “ua rau lub siab mob heev,” thiab hais tias, “Kuv niam kuv txiv yuav tsa muag saib Vajtswv thiab thov nws zam txim rau nws tsev neeg thiab rau Richard.”', english: 'He said the experience had been “so emotional,” and said, “My parents will look towards God and they will ask him to forgive his family and Richard.”' } },
      { id: 'rw-ncig', hmongRPA: 'ncig', english: 'to go around, to travel around — "ib puag ncig", surroundings', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb haiv neeg Hmoob suav daws tau nyob ze rau ib puag ncig los ntev lawm.', english: 'All of us Hmong people have lived close to nature for a long time.' } },
      { id: 'rw-ploj', hmongRPA: 'ploj', english: 'to disappear, to vanish, to be lost', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov kws tshawb fawb tau ceeb toom tias yog peb tsis hloov peb txoj kev coj ua sai sai, ntau hom tsiaj txhu yuav ploj ntais mus ib txhis.', english: 'Researchers have warned that if we do not change our ways quickly, many species of animals will disappear forever.' } },
      { id: 'rw-cais', hmongRPA: 'cais', english: 'to separate, to set apart', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tom qab Jeffrey thiab Amanda qhia txog qhov xwm txheej, Lub Nroog Green Bay tub ceev xwm thiaj ntes Richard thiab Omer, thiab nkawd raug coj mus hais plaub sib cais ib yam li neeg laus rau kev tua Zong Vang—kev tua neeg txhob txwm thawj theem.', english: 'After Jeffrey and Amanda reported the incident, both Richard and Omer were arrested by the Green Bay police and were both tried separately as adults for the first-degree murder of Zong Vang.' } },
      { id: 'rw-xyaw', hmongRPA: 'xyaw', english: 'to mix, to blend — "sib xyaw", a mixture', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog qhov tshwm sim los ntawm kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.', english: 'They are the result of a combination of what a person is born with and what that person encounters and learns during life.' } },
      { id: 'rw-raws', hmongRPA: 'raws', english: 'along; to follow — "raws li", according to', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Raws li Richard tus kheej cov lus, Zong “ya hla phab ntsa mus xwb.”', english: 'In Richard’s own words, Zong “just sailed out over the wall.”' } },
      { id: 'rw-tshwm', hmongRPA: 'tshwm', english: 'to appear, to emerge — "tshwm sim", to happen', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lo lus nug uas tseem ua rau ntau tus xav txog rooj plaub no yog: vim li cas ho tshwm sim li no?', english: 'The question that still makes many people think about this case is: why did it happen at all?' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-nrug', hmongRPA: 'nrug', english: 'to be apart — "sib nrug", separated from each other', category: 'reading-motion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws qhia wb tias, “Kuv xav kom lawv tsis txhob sib nrug thaum yeeb yam pib.”', english: 'He explained to the two of us, “I do not want them to be separated when the movie starts.”' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-nyob-twj-ywm', hmongRPA: 'nyob twj ywm', english: 'to be quiet, to fall silent', category: 'reading-motion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum yeeb yam yuav pib, lawv tsib leeg nyob twj ywm, thiab lawv kuj saib yeeb yam.', english: 'When the movie was about to start, the five of them went quiet, and they watched the movie too.' } },
      // Added 2026-09-27 — the hunting words in the author's thaum example.
      { id: 'rw-yos-hav-zoov', hmongRPA: 'yos hav zoov', english: 'to go hunting (in the forest)', category: 'reading-motion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Chai mus yos hav zoov thaum tsib teev tsaus ntuj.', english: 'Chai goes hunting at 5 p.m.' } },
      { id: 'rw-tua-tsiaj', hmongRPA: 'tua tsiaj', english: 'to hunt, to kill animals', category: 'reading-motion', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Chai mus tua tsiaj thaum tsib teev tsaus ntuj.', english: 'Chai goes hunting at 5 p.m.' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-chaws', hmongRPA: 'chaws', english: 'to thread (a needle); to duck under, pull back', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-chua', hmongRPA: 'chua', english: 'to snatch away fast', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncab', hmongRPA: 'ncab', english: 'to stretch', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncav', hmongRPA: 'ncav', english: 'to reach for', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncaim', hmongRPA: 'ncaim', english: 'to leave; to separate', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phoom', hmongRPA: 'phoom', english: 'to bump into, run into', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nphav', hmongRPA: 'nphav', english: 'to bump into', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-npuaj', hmongRPA: 'npuaj', english: 'to hit with the palm', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-plau', hmongRPA: 'plau', english: 'to run away', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-qhau', hmongRPA: 'qhau', english: 'to pull down; to wrestle down', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntiab', hmongRPA: 'ntiab', english: 'to force out; evict; expel', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nyas', hmongRPA: 'nyas', english: 'to stalk; to track or follow behind', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntsaub', hmongRPA: 'ntsaub', english: 'to dive down; to come together', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntsiab', hmongRPA: 'ntsiab', english: 'to grab or claw at', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntsauv', hmongRPA: 'ntsauv', english: 'to crowd around', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntswj', hmongRPA: 'ntswj', english: 'to twist', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntsawm', hmongRPA: 'ntsawm', english: 'to slam', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxuaj', hmongRPA: 'ntxuaj', english: 'to fan, to flap (wings)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxi', hmongRPA: 'ntxi', english: 'to open just a little', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-xyeeb', hmongRPA: 'xyeeb', english: 'to brush aside, cast away/aside', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-theej', hmongRPA: 'theej', english: 'to replace; to exchange', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nruab', hmongRPA: 'nruab', english: 'to put in/on; to insert', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntaug', hmongRPA: 'ntaug', english: 'to stomp; (adjective) smooth, silky', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-npleem', hmongRPA: 'npleem', english: 'to slip (fall)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nphau', hmongRPA: 'nphau', english: 'to flip over; to flip over (waves)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nphoo', hmongRPA: 'nphoo', english: 'to sprinkle on', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tseb', hmongRPA: 'tseb', english: 'to scatter; distribute', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-txaws', hmongRPA: 'txaws', english: 'to splash', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-txej', hmongRPA: 'txej', english: 'to spill', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phws', hmongRPA: 'phws', english: 'to gently touch or stroke', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tshiav', hmongRPA: 'tshiav', english: 'to scrape, to polish, to rub', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-pheeb', hmongRPA: 'pheeb', english: 'to lean against/on', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nchias', hmongRPA: 'nchias', english: 'to tiptoe (ua nchias)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nkham', hmongRPA: 'nkham', english: 'to walk on hands & feet (ua nkham)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nyo', hmongRPA: 'nyo', english: 'to lower one’s head downward', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-txhib', hmongRPA: 'txhib', english: 'to rush someone; to chop firewood', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-dhas', hmongRPA: 'dhas', english: 'to separate using thumb (corn kernel)', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-rhuav', hmongRPA: 'rhuav', english: 'to take apart, destroy; to ruin, humiliate', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-rhais', hmongRPA: 'rhais', english: 'to pin, to step; (noun) a pin', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nta', hmongRPA: 'nta', english: 'to switch on; to pay for a wedding; to open up (umbrella); (noun) pole for carrying buckets of water', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-sawb-lawj', hmongRPA: 'sawb lawj', english: 'to take everything', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nquam', hmongRPA: 'nquam', english: 'to row', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },
      { id: 'wbs-nthwv', hmongRPA: 'nthwv', english: 'to snatch away; (classifier) classifier for a gust of wind', category: 'reading-motion', tags: ['verb', 'reviewed'], audioFile: null },  // re-added 2026-09-30 when the Bisang set holding it was commented out
      { id: 'misc-vov', hmongRPA: 'vov', english: 'to cover something — like covering with a blanket', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30; the war sense (take cover, ambush) is war-vov
      { id: 'motion-thoj', hmongRPA: 'thoj', english: 'to escape, to flee', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of two thoj entries (the rau / tom qab pattern)
      { id: 'motion-cuab', hmongRPA: 'cuab', english: 'to trap, to snare — setting up a trap, or the trap itself, especially for catching animals: "cuab quav qaib", to set up a bird trap; "cuab ntses", to trap or catch fish', category: 'reading-motion', tags: ['verb', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of four cuab entries (the rau / tom qab pattern)
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-people',
    title: 'People & Society',
    description: 'Persons, kinship as the stories use it, and groups of people.',
    emoji: '👥',
    words: [
      { id: 'phr-zej-tsoom', hmongRPA: 'zej tsoom', english: 'society; the public at large', category: 'reading-people', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-tswv-cuab', hmongRPA: 'tswv cuab', english: 'a member of a family or a group', category: 'reading-people', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-pab-hluas', hmongRPA: 'pab hluas', english: 'a group of young people — “pab” here is a group, not “to help”', category: 'reading-people', tags: ['noun','reading','unreviewed'], audioFile: null },
      // ⚠️ SECOND SENSE — same hmongRPA, so wordLookup merges it rather than
      // creating a rival headword. Without this, "pab hluas" reads as "helping
      // young people".
      { id: 'misc-sense-pab', hmongRPA: 'pab', english: 'a group, a band — the classifier for a group of people or animals: "pab hluas", a group of young people', category: 'reading-people', tags: ['sense', 'classifier', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-kev', hmongRPA: 'kev', english: 'road; path; route; way · way; method; manner · abstract-concept marker, forming nouns from verbs and qualities', category: 'reading-people', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-leeg', hmongRPA: 'leeg', english: 'classifier for people — "ob leeg", both of them · person; individual — "ib leeg", alone · muscle; tendon; sinew', category: 'reading-people', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-luag', hmongRPA: 'luag', english: 'to laugh; also others, other people', category: 'reading-people', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-tug', hmongRPA: 'tug', english: 'classifier for people and animals — a form used in some writing traditions. ⚠️ NOT simply a misspelling of "tus": preserve whichever form the source uses.', category: 'reading-people', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-xibfwb', hmongRPA: 'xibfwb', english: 'teacher', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tug-tub-hluas', hmongRPA: 'tug tub hluas', english: 'young man', category: 'reading-people', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-poj-niam-zoo-nkauj', hmongRPA: 'poj niam zoo nkauj', english: 'beautiful woman', category: 'reading-people', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus poj niam zoo nkauj.', english: 'I saw a beautiful woman.', source: 'ai' } },
      { id: 'misc-tsev-neeg', hmongRPA: 'tsev neeg', english: 'family', category: 'reading-people', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tsev neeg nyob ze ntawm no.', english: 'My family lives nearby.', source: 'ai' } },
      { id: 'misc-tsib-leeg', hmongRPA: 'tsib leeg', english: 'five people', category: 'reading-people', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj tsib leeg tuaj noj mov.', english: 'Five people came to eat.', source: 'ai' } },
      { id: 'misc-hem', hmongRPA: 'hem', english: 'threaten (transitive verb) · menace; threaten to happen (verb)', category: 'reading-people', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus aub hem kuv thaum tsaus ntuj.', english: 'The dog threatened me at night.', source: 'ai' } },
      { id: 'misc-poj-niam', hmongRPA: 'poj niam', english: 'a woman', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ib tus poj niam tab tom taug kev.', english: 'A woman is walking.', source: 'ai' } },
      { id: 'misc-txiv-neej', hmongRPA: 'txiv neej', english: 'a man', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus txiv neej nyob ntawd.', english: 'There is a man over there.', source: 'ai' } },
      { id: 'misc-phooj-ywg', hmongRPA: 'phooj ywg', english: 'friend, friends', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus phooj ywg tuaj xyuas kuv.', english: 'My friend came to visit me.', source: 'ai' } },
      { id: 'misc-zej-zog', hmongRPA: 'zej zog', english: 'community, neighbourhood', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pab zej zog tu lub tsev.', english: 'Our community helped clean the house.', source: 'ai' } },
      { id: 'rv-zej', hmongRPA: 'zej', english: 'community; neighborhood; village area (noun) · zej zog = community; society; neighborhood (compound noun)', category: 'reading-people', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg hauv zej sib pab.', english: 'People in the community help each other.', source: 'ai' } },
      { id: 'misc-sense-ib', hmongRPA: 'ib', english: 'a, an — Hmong has no separate indefinite article, so "ib" does this job too: "ib tug txiv neej" is A man, "ib lub hnab" is A bag. Almost always followed by a classifier.', category: 'reading-people', tags: ['sense', 'grammar', 'particle', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus neeg nyob ntawd.', english: 'There is a person over there.', source: 'ai' } },
      { id: 'misc-hluas', hmongRPA: 'hluas', english: 'young · youth; young people, collectively · a young man, in "tub hluas"', category: 'reading-people', tags: ['adjective', 'noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tub hluas nyiam ncaws pob.', english: 'The young man likes playing soccer.', source: 'ai' } },
      { id: 'misc-neeg', hmongRPA: 'neeg', english: 'person; human being · people — collectively', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj neeg coob nyob hauv lub khw.', english: 'There are many people in the store.', source: 'ai' } },  // Was: 'Muaj neeg coob hauv lub khw.' — a being somewhere takes nyob (author, 2026-09-28)
      { id: 'misc-menyuam', hmongRPA: 'menyuam', english: 'child; baby; offspring (noun) · children; young people (collective noun) · menyuam yaus = children; young ones (compound noun)', category: 'reading-people', tags: ['noun', 'family', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam ua si tom tsev.', english: 'The children are playing at home.', source: 'ai' } },
      { id: 'misc-kws', hmongRPA: 'kws', english: 'expert; skilled person; specialist · professional practitioner — in compounds', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob pab nws.', english: 'The doctor helped him.', source: 'ai' } },
      { id: 'misc-yaus', hmongRPA: 'yaus', english: 'young; small; immature (adjective) · menyuam yaus = children; young ones (compound noun)', category: 'reading-people', tags: ['bound', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam yaus ua si nraum zoov.', english: 'The young children play outside.', source: 'ai' } },
      { id: 'gen-mab', hmongRPA: 'mab', english: 'non-Hmong person; non-Hmong people', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus mab nyob ze peb.', english: 'A non-Hmong person lives near us.', source: 'ai' } },
      { id: 'gen-pejxeem', hmongRPA: 'pejxeem', english: 'citizens; the public; people', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Pejxeem tuaj sib tham ntawm no.', english: 'The public came to discuss things here.', source: 'ai' } },
      { id: 'gen-xeebceem', hmongRPA: 'xeebceem', english: 'personality', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muaj xeebceem zoo heev.', english: 'She has a very good personality.', source: 'ai' } },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-kws-tshawb-fawb', hmongRPA: 'kws tshawb fawb', english: 'a researcher; a scientist', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov kws tshawb fawb tau ceeb toom tias yog peb tsis hloov peb txoj kev coj ua sai sai, ntau hom tsiaj txhu yuav ploj ntais mus ib txhis.', english: 'Researchers have warned that if we do not change our ways quickly, many species of animals will disappear forever.' } },
      { id: 'phr-tub-ki-xeeb-ntxwv', hmongRPA: 'tub ki xeeb ntxwv', english: 'descendants; future generations', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li ntawd, txhua tus neeg muaj lub luag haujlwm los tiv thaiv ib puag ncig rau peb cov tub ki xeeb ntxwv.', english: 'Therefore, every person has a responsibility to protect the environment for our future generations and descendants.' } },
      { id: 'phr-kab-lis-kev-cai', hmongRPA: 'kab lis kev cai', english: 'culture; customs; tradition — the Hmong traditional ways: rituals, beliefs, and the proper ways of living and behaving (also written kab li kev cai)',  /* was 'culture; customs; tradition' — 2026-09-30 */ category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai uas peb yuav tsum coj mus rau yav pem suab.', english: 'Therefore, respecting and caring for the environment is part of our cultural heritage that we must carry forward into the future.' } },
      { id: 'phr-kws-txawj-ntse', hmongRPA: 'kws txawj ntse', english: 'intellectuals; learned people', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no tau ua rau cov kws txawj ntse sib cav hnyav tias puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.', english: 'This has led intellectuals to debate intensely whether a person’s thoughts and behavior are things they can choose, or whether they are determined by things beyond their ability to control.' } },
      { id: 'phr-thawj-coj', hmongRPA: 'thawj coj', english: 'a leader; a person in charge', category: 'reading-people', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tiamsis, yog tias feem ntau ntawm tib neeg txoj kev coj ua yog raug txiav txim los ntawm yam nws yug los nrog, ces cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab los ntawm lawv tus kheej lub xeev siab.', english: 'However, if most human behavior is determined by what a person is born with, then community leaders must reconsider their approach to helping people who suffer difficulties because of their own psychological state.' } },
      { id: 'phr-suav-daws', hmongRPA: 'suav daws', english: 'everyone; all of us; everybody together', category: 'reading-people', tags: ['pronoun', 'reading', 'unreviewed'], audioFile: null },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-yus', hmongRPA: 'yus', english: 'oneself; one\'s own — the reflexive pronoun', category: 'reading-people', tags: ['reading', 'unreviewed'], audioFile: null },
      { id: 'misc-khub', hmongRPA: 'khub', english: 'a partner, companion; a pair — "tus khub", "lub khub"; often a spouse or partner', category: 'reading-people', tags: ['reading', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — the author's list: authority and the divine.
      { id: 'misc-vaj-tswv', hmongRPA: 'vaj tswv', english: 'God, the Lord (Christian)', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-tswv-ntuj', hmongRPA: 'tswv ntuj', english: 'the sky deity, the lord of the sky; god', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-nom-tswv', hmongRPA: 'nom tswv', english: 'the government; the authorities; officials', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-pej-xeem', hmongRPA: 'pej xeem', english: 'citizens, people', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-vaj-huam', hmongRPA: 'vaj huam', english: 'human rights', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-qhua', hmongRPA: 'qhua', english: 'a guest', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nkauj-xwb', hmongRPA: 'nkauj xwb', english: 'unmarried girls', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nqag', hmongRPA: 'nqag', english: 'a team, group based on common grounds', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-khav-theeb', hmongRPA: 'khav theeb', english: 'to show off', category: 'reading-people', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-plees', hmongRPA: 'plees', english: 'to be silly', category: 'reading-people', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-phom-moj', hmongRPA: 'phom moj', english: 'to be mischievous; overly playful', category: 'reading-people', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-yaj-ceeb', hmongRPA: 'yaj ceeb', english: 'life on earth', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },
      { id: 'wbs-phaum', hmongRPA: 'phaum', english: 'a generation, a group of the same season or period', category: 'reading-people', tags: ['noun', 'reviewed'], audioFile: null },  // re-added 2026-09-30 when the Bisang set holding it was commented out
      { id: 'people-cuab', hmongRPA: 'cuab', english: 'a family line or household — in a cultural or clan context, a specific household, extended family unit or generational line: "cuab tsav", the head of a household, a family-line leader; "ib cuab tsev", an entire household', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of four cuab entries (the rau / tom qab pattern)
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-place',
    title: 'Places & Position',
    description: 'Where things are — villages, roads, and the words that locate them.',
    emoji: '📍',
    words: [
      { id: 'phr-npoo-av', hmongRPA: 'npoo av', english: 'ground level — "saum npoo av", above the ground', category: 'reading-place', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub pob nyob saum npoo av.', english: 'The ball is above ground level.', source: 'ai' } },
      { id: 'misc-hoob', hmongRPA: 'hoob', english: 'room', category: 'reading-place', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Muaj ob lub hoob hauv tsev.', english: 'There are two rooms in the house.', source: 'ai' } },
      { id: 'misc-kawg', hmongRPA: 'kawg', english: 'end; last (noun / adjective) · finish; end (verb) · ultimate; topmost (adjective) · very; extremely, as an intensifier following an adjective (intensifier)', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus txog qhov kawg lawm.', english: 'We have reached the end.', source: 'ai' } },
      { id: 'misc-qab', hmongRPA: 'qab', english: 'under; below; beneath · behind; at the rear of · delicious; tasty', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus miv nkaum qab lub rooj.', english: 'The cat hides under the table.', source: 'ai' } },
      { id: 'misc-sab', hmongRPA: 'sab', english: 'side', category: 'reading-place', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Nws sawv ntawm sab qhov rooj.', english: 'She is standing beside the door.', source: 'ai' } },
      { id: 'misc-tom', hmongRPA: 'tom', english: 'at; over at; located at (locative marker / preposition) · bite (transitive verb) · tom qab = after; later; behind (compound preposition / temporal expression) · separately (adverb)', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob tom tsev hnub no.', english: 'I am at home today.', source: 'ai' } },
      { id: 'misc-tsev', hmongRPA: 'tsev', english: 'house; home · building; institution; establishment — in compounds', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob hauv tsev txhua hmo.', english: 'I stay home every night.', source: 'ai' } },
      { id: 'misc-lub-zos', hmongRPA: 'lub zos', english: 'village', category: 'reading-place', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub zos no nyob ze roob.', english: 'This village is near the mountain.', source: 'ai' } },
      { id: 'misc-txoj-kev', hmongRPA: 'txoj kev', english: 'the road', category: 'reading-place', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txoj kev no mus rau lub zos.', english: 'This road goes to the village.', source: 'ai' } },
      { id: 'misc-lub-tsev-qub', hmongRPA: 'lub tsev qub', english: 'the old house', category: 'reading-place', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev qub nyob tom ntug zos.', english: 'The old house is at the village edge.', source: 'ai' } },
      { id: 'misc-ntug-zos', hmongRPA: 'ntug zos', english: 'the edge of the village', category: 'reading-place', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb nyob ntawm ntug zos.', english: 'We are at the edge of the village.', source: 'ai' } },
      { id: 'misc-khw', hmongRPA: 'khw', english: 'a market, a store — "lub khw muas zaub mov", the grocery store', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv mus lub khw yuav zaub mov.', english: 'I go to the store to buy food.', source: 'ai' } },
      { id: 'misc-dej', hmongRPA: 'dej', english: 'water; a river', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb nyob ze tus dej loj.', english: 'We live near the big river.', source: 'ai' } },
      // ⚠️ THE DICTIONARY HAD NO COUNTRIES AT ALL, which is a strange gap in an
      // app for a diaspora language — the three that matter most to Hmong
      // readers are the three in this story's own paragraph about why the Vang
      // family left. Only names I can attest are here; a guessed transliteration
      // of a country name is worse than its absence.
      { id: 'misc-teb-chaws', hmongRPA: 'teb chaws', english: 'a country, a nation — preferred spelling Tebchaws, joined (author, 2026-09-26); this spaced form stays so older text still resolves', category: 'reading-place', tags: ['noun', 'place'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus txawv teb chaws.', english: 'I want to travel abroad.', source: 'ai' } },
      { id: 'misc-haujlwm', hmongRPA: 'haujlwm', english: 'work; job; employment (noun) · task; duty; responsibility (noun) · activity; operation; undertaking (noun)', category: 'reading-place', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj haujlwm ntau hnub no.', english: 'I have a lot of work today.', source: 'ai' } },
      { id: 'rv-ntsa', hmongRPA: 'ntsa', english: 'wall (noun) · cliff; steep wall-like surface (noun) — ⚠ phab ntsa = wall (compound noun)', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ntsa siab nyob ntawm no.', english: 'There is a high wall here.', source: 'ai' } },
      { id: 'rv-phab', hmongRPA: 'phab', english: 'side (noun) · wall, especially in phab ntsa (compound-noun element) · party; side; faction (noun)', category: 'reading-place', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nws sawv ntawm phab tsev.', english: 'He is standing beside the house.', source: 'ai' } },
      { id: 'misc-saum', hmongRPA: 'saum', english: 'on; on top of · above; over · upper; top — "saum toj", on top', category: 'reading-place', tags: ['preposition', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Phau ntawv nyob saum rooj.', english: 'The book is on the table.', source: 'ai' } },
      { id: 'misc-nroog', hmongRPA: 'nroog', english: 'a city — "Lub Nroog Green Bay"', category: 'reading-place', tags: ['noun', 'place', 'reading'], audioFile: null, exampleSentence: { hmong: 'Lub nroog no muaj neeg coob.', english: 'This city has many people.', source: 'ai' } },
      { id: 'misc-khaws', hmongRPA: 'khaws', english: 'to keep, to save up — and to pick something up off the ground.', category: 'reading-place', tags: ['verb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv khaws nyiaj cia txhua hli.', english: 'I save money every month.', source: 'ai' } },
      { id: 'misc-ntug', hmongRPA: 'ntug', english: 'the edge, the rim', category: 'reading-place', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zaum ntawm ntug txaj.', english: 'She sits on the edge of the bed.', source: 'ai' } },
      { id: 'misc-chaw', hmongRPA: 'chaw', english: 'place; location; space · place for; site for — in compounds · opportunity; occasion', category: 'reading-place', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov chaw no zoo nkauj heev.', english: 'This place is very beautiful.', source: 'ai' } },
      { id: 'misc-qhov', hmongRPA: 'qhov', english: 'place; spot; point · thing; matter; aspect · nominalizer — turns a clause into a thing, event or matter', category: 'reading-place', tags: ['classifier', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no yog kuv qhov chaw.', english: 'This is my place.', source: 'ai' } },
      { id: 'misc-qho', hmongRPA: 'qho', english: 'classifier for things, places and abstract items', category: 'reading-place', tags: ['classifier','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib qho chaw nyob ntawd.', english: 'There is a place over there.', source: 'ai' } },
      { id: 'gen-yajsab', hmongRPA: 'yajsab', english: 'mountain or highland location', category: 'reading-place', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus nyob saum yajsab.', english: 'We are going to the highlands.', source: 'ai' } },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-ib-puag-ncig', hmongRPA: 'ib puag ncig', english: 'the environment; surroundings', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb haiv neeg Hmoob suav daws tau nyob ze rau ib puag ncig los ntev lawm.', english: 'All of us Hmong people have lived close to nature for a long time.' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-cua', hmongRPA: 'cua', english: 'wind; air — "huab cua", weather, climate', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev hloov pauv ntawm huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.', english: 'Changes in the weather will make storms grow larger and more severe.' } },
      { id: 'rw-nag', hmongRPA: 'nag', english: 'rain — "los nag", it is raining', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev hloov pauv ntawm huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.', english: 'Changes in the weather will make storms grow larger and more severe.' } },
      { id: 'rw-hav', hmongRPA: 'hav', english: 'valley, hollow — "hav zoov", forest', category: 'reading-place', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.', english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-npuab', hmongRPA: 'npuab', english: 'right up against, right next to', category: 'reading-place', tags: ['preposition', 'reviewed'], audioFile: null },
    { id: 'wbs-tshuam', hmongRPA: 'tshuam', english: 'intersection; (verb) to intersect', category: 'reading-place', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nkhib', hmongRPA: 'nkhib', english: 'corner section of (branch, toes, etc.)', category: 'reading-place', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-nqaim', hmongRPA: 'nqaim', english: 'to be narrow', category: 'reading-place', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-khab-seeb', hmongRPA: 'khab seeb', english: 'to be spacious, roomy', category: 'reading-place', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-khuam-kev', hmongRPA: 'khuam kev', english: 'to be in the way, to be underfoot', category: 'reading-place', tags: ['adjective', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-time',
    title: 'Time & Sequence',
    description: 'When something happened, and in what order.',
    emoji: '⏳',
    words: [
      { id: 'phr-ua-ke', hmongRPA: 'ua ke', english: 'together, at the same time', category: 'reading-time', tags: ['adverb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb noj mov ua ke txhua hmo.', english: 'We eat together every evening.', source: 'ai' } },
      { id: 'phr-niaj-hnub', hmongRPA: 'niaj hnub', english: 'every day; these days — "niaj hnub no", to this day', category: 'reading-time', tags: ['adverb','time','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kawm ntawv niaj hnub.', english: 'I study every day.', source: 'ai' } },
      { id: 'phr-ib-nyuag-ntu', hmongRPA: 'ib nyuag ntu', english: 'a short while, a little stretch of time', category: 'reading-time', tags: ['noun','time','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tos kuv ib nyuag ntu xwb.', english: 'Wait for me a short while.', source: 'ai' } },
      { id: 'phr-ib-ntus', hmongRPA: 'ib ntus', english: 'for a time, for a while', category: 'reading-time', tags: ['noun','time','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nyob ntawm no ib ntus.', english: 'She stayed here for a while.', source: 'ai' } },
      { id: 'phr-vib-nas-this', hmongRPA: 'vib nas this', english: 'a second — from the English "minute second"', category: 'reading-time', tags: ['noun','time','reading','unreviewed'], audioFile: null },
      { id: 'misc-hmo', hmongRPA: 'hmo', english: 'night', category: 'reading-time', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv nyeem ntawv txhua hmo.', english: 'I read every night.', source: 'ai' } },
      { id: 'misc-kuj', hmongRPA: 'kuj', english: 'also; too · still; nevertheless', category: 'reading-time', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kuj xav mus nrog nej.', english: 'I also want to go with you.', source: 'ai' } },
      { id: 'misc-mam', hmongRPA: 'mam', english: 'then, afterwards', category: 'reading-time', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-thaum', hmongRPA: 'thaum', english: 'when — introducing a time clause · time; occasion', category: 'reading-time', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-tiam', hmongRPA: 'tiam', english: 'generation; era', category: 'reading-time', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-twb', hmongRPA: 'twb', english: 'already (aspectual adverb) · indeed; in fact; as expected (discourse adverb)', category: 'reading-time', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-txawm', hmongRPA: 'txawm', english: 'then; thereupon · even; even though; although', category: 'reading-time', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-tib-sij-huam', hmongRPA: 'tib sij huam', english: 'in an instant; all at once; suddenly', category: 'reading-time', tags: ['phrase', 'reading'], audioFile: null },
      { id: 'misc-xaus', hmongRPA: 'xaus', english: 'to end, to conclude', category: 'reading-time', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-pib', hmongRPA: 'pib', english: 'begin; start · beginning; start — "thaum pib", at the beginning', category: 'reading-time', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-sij-hawm', hmongRPA: 'sij hawm', english: 'time — "muaj sij hawm", to have time', category: 'reading-time', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'rv-tsaus', hmongRPA: 'tsaus', english: 'dark; darkness (adjective / stative verb) · tsaus ntuj = evening; nighttime; darkness (compound time expression)', category: 'reading-time', tags: ['reading', 'reviewed'], audioFile: null },
      {
        id: 'misc-ib-zaum',
        hmongRPA: 'ib zaum',
        english: 'once, one time',
        category: 'reading-time',
        tags: ['phrase', 'number'],
        audioFile: null,
      },
      { id: 'misc-yav', hmongRPA: 'yav', english: 'a period of time — "yav tsaus ntuj" the evening, "yav tom ntej" the future.', category: 'reading-time', tags: ['noun','time','reading','unreviewed'], audioFile: null },
      { id: 'misc-xyoos', hmongRPA: 'xyoo', english: 'year · years old — after a number, to state age', category: 'reading-time', tags: ['noun', 'time', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-thawj', hmongRPA: 'thawj', english: 'first — before all others in time, sequence or rank · main; principal; chief · reason; cause — ONLY as part of "laj thawj"', category: 'reading-time', tags: ['bound', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-txij', hmongRPA: 'txij', english: 'from, since — "txij thaum", ever since', category: 'reading-time', tags: ['particle','reading','unreviewed'], audioFile: null },
      { id: 'misc-thiaj', hmongRPA: 'thiaj', english: 'therefore; so; thus · only then; then finally', category: 'reading-time', tags: ['particle', 'reading', 'reviewed'], audioFile: null },
      { id: 'gen-kawj', hmongRPA: 'kawj', english: 'to start', category: 'reading-time', tags: ['verb','everyday','unreviewed'], audioFile: null },
      // Was 'nowadays' — corrected 2026-09-30, author's ruling. `nim no` points
      // at THIS MOMENT, not at the present era; "nowadays" is a different span
      // of time and would mislead a learner reaching for "right now".
      { id: 'gen-nim-no', hmongRPA: 'nim no', english: 'right now; currently', category: 'reading-time', tags: ['noun','time','unreviewed'], audioFile: null },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-yav-pem-suab', hmongRPA: 'yav pem suab', english: 'the future; the time ahead', category: 'reading-time', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai uas peb yuav tsum coj mus rau yav pem suab.', english: 'Therefore, respecting and caring for the environment is part of our cultural heritage that we must carry forward into the future.' } },
      { id: 'phr-xyoo-pua', hmongRPA: 'xyoo pua', english: 'century — "xyoo pua 19", the 19th century', category: 'reading-time', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.', english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-zaus', hmongRPA: 'zaus', english: 'a time, an occasion — "lwm zaus", another time', category: 'reading-time', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hais rau peb tias, “Yog li, peb plaub leeg mam rov qab tuaj ua ke lwm zaus.”', english: 'I said to all four of us, “Then the four of us can come back together another time.”' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-tam-sim-no', hmongRPA: 'tam sim no', english: 'right now, now', category: 'reading-time', tags: ['adverb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Fong teb kuv tias, “Yog, wb mus tam sim no.”', english: 'Fong answered me, “Yes, the two of us will go now.”' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-chiv', hmongRPA: 'chiv', english: 'to begin, start, originate — "chiv keeb" / "chiv thawj", the beginning; "chiv ua", to begin to do; "chiv kiag hais", began to say · manure, fertilizer (classifier cov)', category: 'reading-time', tags: ['reading', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-xab-nag-kis', hmongRPA: 'xab nag kis', english: 'the days ahead; days to come', category: 'reading-time', tags: ['noun', 'reviewed'], audioFile: null },
    { id: 'wbs-hnub-qab-nram-ntsis', hmongRPA: 'hnub qab nram ntsis', english: 'in the future; someday later on', category: 'reading-time', tags: ['preposition', 'reviewed'], audioFile: null },
    { id: 'wbs-cheem', hmongRPA: 'cheem', english: 'to halt, stop; (preposition) while, during', category: 'reading-time', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ncua', hmongRPA: 'ncua', english: 'to pause; (adjective) far, distant', category: 'reading-time', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-pheej', hmongRPA: 'pheej', english: 'to keep/continue an action', category: 'reading-time', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-quantity',
    title: 'Amount & Degree',
    description: 'How much, how many, and how completely.',
    emoji: '🔢',
    words: [
      { id: 'phr-sib-cais', hmongRPA: 'sib cais', english: 'separately; apart from each other', category: 'reading-quantity', tags: ['adverb','reading','unreviewed'], audioFile: null },
      { id: 'phr-me-ntsis', hmongRPA: 'me ntsis', english: 'a little, slightly', category: 'reading-quantity', tags: ['adverb','reading','unreviewed'], audioFile: null },
      { id: 'phr-feem-ntau', hmongRPA: 'feem ntau', english: 'mostly, usually, for the most part', category: 'reading-quantity', tags: ['adverb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tag', hmongRPA: 'tag', english: 'finished, all, completely', category: 'reading-quantity', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-tas', hmongRPA: 'tas', english: 'finished, all gone, completely', category: 'reading-quantity', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-tiag', hmongRPA: 'tiag', english: 'really, truly', category: 'reading-quantity', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-tsuas', hmongRPA: 'tsuas', english: 'only, merely', category: 'reading-quantity', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      {
        // The one item from the Thanks & Sorry lesson with no home: a whole
        // SENTENCE, not a word or a set phrase. It is here rather than in
        // `politeness` because saying "I am very pleased" is not a courtesy
        // formula the way "thank you" is — and rather than nowhere, because the
        // recording exists and the lesson teaches it.
        id: 'misc-kuv-txaus-siab-heev',
        hmongRPA: 'kuv txaus siab heev',
        english: 'I am very pleased',
        category: 'reading-quantity',
        tags: ['phrase', 'sentence'],
        audioFile: 'lessons/politeness/kuv-txaus-siab-heev.wav',
      },
      { id: 'misc-noj-kom-tsau', hmongRPA: 'noj kom tsau', english: 'eat until full', category: 'reading-quantity', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ib-txhia', hmongRPA: 'ib txhia', english: 'some, some of them', category: 'reading-quantity', tags: ['particle', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ntxiv', hmongRPA: 'ntxiv', english: 'more; additional · further; furthermore; in addition', category: 'reading-quantity', tags: ['particle', 'reading', 'reviewed', 'needs-source-review'], audioFile: null },
      { id: 'misc-tshaj-plaws', hmongRPA: 'tshaj plaws', english: 'the most, -est — "hnyav tshaj plaws", the heaviest', category: 'reading-quantity', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-sense-nees', hmongRPA: 'nees', english: 'twenty — only in "nees nkaum"', category: 'reading-quantity', tags: ['sense', 'number', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-nkaum', hmongRPA: 'nkaum', english: 'hide; conceal oneself (verb) · be hidden (stative verb) · nees nkaum = twenty (compound numeral) — ⚠ distinct from kaum = ten (numeral)', category: 'reading-quantity', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'rv-txhia', hmongRPA: 'txhia', english: 'some; various; different (indefinite determiner) · distributive or variety element in expressions such as txhua txhia (grammatical element)', category: 'reading-quantity', tags: ['reading', 'needs-source-review'], audioFile: null },
      { id: 'gen-hauj-sim', hmongRPA: 'hauj sim', english: 'a little; somewhat; so-so', category: 'reading-quantity', tags: ['adjective','adverb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-haj-yam', hmongRPA: 'haj yam', english: 'even more or less', category: 'reading-quantity', tags: ['adverb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-qee', hmongRPA: 'qee', english: 'to reduce; to save; some', category: 'reading-quantity', tags: ['verb','noun','everyday','unreviewed'], audioFile: null },
      // Added 2026-09-26 — a course reading tapped this word and got "no entry".
      { id: 'rw-mais', hmongRPA: 'mais', english: 'mile, miles', category: 'reading-quantity', tags: ['noun', 'measure', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsibcaug mais.', english: 'Fifty miles.' } },
      // Added 2026-09-26 — a course reading tapped this word and got "no entry".
      { id: 'rw-kg', hmongRPA: 'kg', english: 'kilogram, kilograms (written as in English)', category: 'reading-quantity', tags: ['noun', 'measure', 'loan', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yimcaum kg.', english: 'Eighty kilograms.' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-ib-nrab', hmongRPA: 'ib nrab', english: 'half; halfway — "mus txog ib nrab", about halfway through', category: 'reading-quantity', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum zaj yeeb yam mus txog ib nrab, kuv saib Fong thiab nug nws tias, “Koj puas tseem xav zaum ntawm no?”', english: 'When the movie was about halfway through, I looked at Fong and asked him, “Do you still want to sit here?”' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-sawv-daws', hmongRPA: 'sawv daws', english: 'everyone, everybody', category: 'reading-quantity', tags: ['pronoun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hais rau sawv daws tias, “Yog li, peb plaub leeg mam rov qab tuaj ua ke lwm zaus.”', english: 'I said to everyone, “Then the four of us can come back together another time.”' } },
      // Added 2026-09-26 — no entry of its own; found in the author's story "Mus Saib Yeeb Yam", whose line is the example.
      { id: 'rw-nrab', hmongRPA: 'nrab', english: 'middle; half — "ib nrab", half, halfway (the middle point); "nruab nrab", in the middle', category: 'reading-quantity', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaum zaj yeeb yam mus txog ib nrab, kuv saib Fong thiab nug nws tias, “Koj puas tseem xav zaum ntawm no?”', english: 'When the movie was about halfway through, I looked at Fong and asked him, “Do you still want to sit here?”' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-qib', hmongRPA: 'qib', english: 'level, rank, grade, stage — a school grade, a level of ability', category: 'reading-quantity', tags: ['reading', 'unreviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-work',
    title: 'Work & Money',
    description: 'Jobs, trade, and paying for things.',
    emoji: '💼',
    words: [
      {id: 'phr-txoj-haujlwm', hmongRPA: 'txoj kev hauj lwm', english: 'a job, a task, a duty', category: 'reading-work', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'misc-pab', hmongRPA: 'pab', english: 'to help', category: 'reading-work', tags: ['verb', 'reading'], audioFile: null },
      { id: 'misc-siv', hmongRPA: 'siv', english: 'to use', category: 'reading-work', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-npaj', hmongRPA: 'npaj', english: 'to prepare, to plan', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-koom', hmongRPA: 'koom', english: 'join; participate (verb) · together; combined; shared (adjective / adverb) · be involved; be a party to (verb) · koom tes = cooperate; work together (compound verb) · koom nrog = join with; participate with (compound verb)', category: 'reading-work', tags: ['verb', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-them', hmongRPA: 'them', english: 'to pay — and to repay or settle a debt.', category: 'reading-work', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tshuav', hmongRPA: 'tshuav', english: 'to remain, to be left over — and to owe: "tshuav nqi".', category: 'reading-work', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-muas', hmongRPA: 'muas', english: 'to buy', category: 'reading-work', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'gen-lag-luam', hmongRPA: 'lag luam', english: 'business; trade', category: 'reading-work', tags: ['noun','business','unreviewed'], audioFile: null },
      { id: 'gen-hawm', hmongRPA: 'hawm', english: 'to worship; to pay respect', category: 'reading-work', tags: ['verb','culture','unreviewed'], audioFile: null },
      { id: 'gen-sawv-cev', hmongRPA: 'sawv cev', english: 'to represent; on behalf of', category: 'reading-work', tags: ['verb','everyday','unreviewed'], audioFile: null },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-kev-tswj-xyuas', hmongRPA: 'kev tswj xyuas', english: 'management; care; protection; stewardship', category: 'reading-work', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev Tswj Xyuas Ib Puag Ncig Thiab Lub Luag Haujlwm Ntawm Tib Neeg', english: 'Environmental Protection and Human Responsibility' } },
      { id: 'phr-lub-luag-haujlwm', hmongRPA: 'lub luag haujlwm', english: 'responsibility; duty; obligation', category: 'reading-work', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li ntawd, txhua tus neeg muaj lub luag haujlwm los tiv thaiv ib puag ncig rau peb cov tub ki xeeb ntxwv.', english: 'Therefore, every person has a responsibility to protect the environment for our future generations and descendants.' } },
      { id: 'phr-tsim-kho', hmongRPA: 'tsim kho', english: 'to build; to develop; to improve', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum tib neeg pib tsim kho vaj tse thiab cog qoob loo ntau zog, ib puag ncig tau raug kev puas tsuaj ntau heev.', english: 'Ever since people began building and farming more intensively, the environment has suffered a great deal of damage.' } },
      { id: 'phr-cog-qoob-loo', hmongRPA: 'cog qoob loo', english: 'to farm; to plant crops', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum tib neeg pib tsim kho vaj tse thiab cog qoob loo ntau zog, ib puag ncig tau raug kev puas tsuaj ntau heev.', english: 'Ever since people began building and farming more intensively, the environment has suffered a great deal of damage.' } },
      { id: 'phr-koom-haum-lag-luam', hmongRPA: 'koom haum lag luam', english: 'a business; a company; a corporation', category: 'reading-work', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.', english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-tsim', hmongRPA: 'tsim', english: 'to create, to build, to form · "tsim txom" = to oppress, to abuse', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tsim nyog tau rov los tsev nyab xeeb.', english: 'He deserved to come home safely.' } },
      { id: 'rw-tshawb', hmongRPA: 'tshawb', english: 'to search, to look into, to investigate', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov kws tshawb fawb tau ceeb toom tias yog peb tsis hloov peb txoj kev coj ua sai sai, ntau hom tsiaj txhu yuav ploj ntais mus ib txhis.', english: 'Researchers have warned that if we do not change our ways quickly, many species of animals will disappear forever.' } },
      { id: 'rw-kuaj', hmongRPA: 'kuaj', english: 'to examine, to check, to test', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev kuaj tus tuag lub cev qhia tias Zong raug tsoo hnyav rau nws lub taub hau thiab nws lub cev, thiab tuag los ntawm craniocerebral trauma vim nws poob saum qhov siab los.', english: 'An autopsy revealed that Zong suffered a blunt impact to his head and trunk and died from craniocerebral trauma due to a fall from height.' } },
      { id: 'rw-xam', hmongRPA: 'xam', english: 'to calculate, to reckon; to consider', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov uas ua rau qhov no tseem ceeb tshaj yog thaum peb los xam txog seb kev hloov pauv lub xeev siab cuam tshuam li cas rau kev tsim kho lub zej zog.', english: 'What makes this especially important is considering how changes in psychological state affect the development of communities.' } },
      { id: 'rw-pauv', hmongRPA: 'pauv', english: 'to exchange, to trade, to swap', category: 'reading-work', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev hloov pauv ntawm huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.', english: 'Changes in the weather will make storms grow larger and more severe.' } },
      // Added 2026-09-30 — the author's dictionary batch (Heimbach-based paste; loj hlob is the author's own gloss).
      { id: 'misc-nuj-nqis', hmongRPA: 'nuj nqis', english: 'value, worth, importance; cost, price — something valued highly (also nuj nqe)', category: 'reading-work', tags: ['reading', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-tshom', hmongRPA: 'tshom', english: 'to dig, plow', category: 'reading-work', tags: ['verb', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-qualities',
    title: 'Qualities',
    description: 'Adjectives the stories lean on, good and bad.',
    emoji: '🔶',
    words: [
      { id: 'phr-txhob-txwm', hmongRPA: 'txhob txwm', english: 'deliberate, on purpose, intentional', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-nyab-xeeb', hmongRPA: 'nyab xeeb', english: 'safe; safety', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-tseem-ceeb', hmongRPA: 'tseem ceeb', english: 'important, principal', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-khov-kho', hmongRPA: 'khov kho', english: 'solid, sturdy, strong', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-nyaum', hmongRPA: 'nyaum', english: 'fierce, brutal, cruel', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-puas-tsuaj', hmongRPA: 'puas tsuaj', english: 'destroyed, ruined, wrecked', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-txawv-txav', hmongRPA: 'txawv txav', english: 'unusual, out of the ordinary', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'phr-tshwj-xeeb', hmongRPA: 'tshwj xeeb', english: 'special; especially — "tshwj xeeb tshaj yog", especially', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'misc-kiag', hmongRPA: 'kiag', english: 'right away, immediately — an emphatic particle', category: 'reading-qualities', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-tsuag', hmongRPA: 'tsuag', english: 'pale, faint, bland; in "nroj tsuag", plants or vegetation', category: 'reading-qualities', tags: ['bound', 'draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-xis', hmongRPA: 'xis', english: 'comfortable, pleasant; in "xis siab", pleased', category: 'reading-qualities', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-thaum-ub', hmongRPA: 'thaum ub', english: 'long ago', category: 'reading-qualities', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tsim-txom', hmongRPA: 'tsim txom', english: 'to torture; to mistreat cruelly', category: 'reading-qualities', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ib-yam-li', hmongRPA: 'ib yam li', english: 'the same as, just like', category: 'reading-qualities', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-hloov', hmongRPA: 'hloov', english: 'to change — and to replace, to swap one thing for another.', category: 'reading-qualities', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-zog', hmongRPA: 'zog', english: 'strength; force; power · strong; vigorous · intensely; strongly — adverbial', category: 'reading-qualities', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-ruaj', hmongRPA: 'ruaj', english: 'firm, secure, steady — and lasting, permanent: "ruaj khov".', category: 'reading-qualities', tags: ['adjective','reading','unreviewed'], audioFile: null },
      { id: 'misc-tib', hmongRPA: 'tib', english: 'same; one and the same (adjective / determiner) · tib neeg = human being; humanity (compound noun) · tib txoj = the same one; same route/rule depending on the following noun (determiner phrase)', category: 'reading-qualities', tags: ['particle', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-txhob', hmongRPA: 'txhob', english: 'do not; don’t (prohibitive negative particle) · txhob txwm = deliberately; intentionally; on purpose (compound adverb)', category: 'reading-qualities', tags: ['particle', 'bound', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-yam', hmongRPA: 'yam', english: 'thing; kind; type; matter · anything; something — "yam twg", "yam dab tsi" · without; lacking — in "yam tsis muaj"', category: 'reading-qualities', tags: ['classifier', 'reading', 'reviewed'], audioFile: null },
      { id: 'gen-suab-ncha-famous', hmongRPA: 'suab ncha', english: 'famous', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-huv', hmongRPA: 'huv', english: 'clean', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-lo-phem', hmongRPA: 'lo phem', english: 'dirty', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-feem-cuam', hmongRPA: 'feem cuam', english: 'undecided; unsure; inconclusive', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-kob-huam', hmongRPA: 'kob huam', english: 'in a poor state; flat broke', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-lauj-vaub', hmongRPA: 'lauj vaub', english: 'messy; tangled; in knots', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-noo', hmongRPA: 'noo', english: 'damp', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-piamsij', hmongRPA: 'piamsij', english: 'ruined; broken', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-vammeej', hmongRPA: 'vammeej', english: 'prosperous; affluent; successful', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-vuabtsuab', hmongRPA: 'vuabtsuab', english: 'dirty; filthy', category: 'reading-qualities', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-qias-neeg', hmongRPA: 'qias neeg', english: 'dirty; polluted; contaminated', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'phr-kev-coj-cwj-pwm', hmongRPA: 'kev coj cwj pwm', english: 'behavior; conduct', category: 'reading-qualities', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.', english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.' } },
      { id: 'phr-muaj-txiaj-ntsig', hmongRPA: 'muaj txiaj ntsig', english: 'beneficial; valuable; worthwhile', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog tias tib neeg txoj kev coj ua tuaj yeem hloov tau los ntawm kev kawm thiab kev sib cuam tshuam nrog ib puag ncig, ces lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.', english: 'If human behavior can be changed through learning and interaction with the environment, then the community has a great responsibility to create an environment that nurtures positive thinking and beneficial behavior.' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-nyuaj', hmongRPA: 'nyuaj', english: 'difficult, hard', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tib neeg lub xeev siab yog ib yam uas nyuaj kawg nkaus rau cov kws tshawb fawb los nkag siab kom tiav, vim nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.', english: 'Human psychological state is something that is extremely difficult for researchers to fully understand, because it has many layers and levels that are deeply interconnected.' } },
      { id: 'rw-ncaj', hmongRPA: 'ncaj', english: 'straight; honest, upright', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tab sis Wisconsin Lub Tsev Hais Plaub Siab Tshaj hais tias txoj cai ntawd tsis ncaj qha siv tau rau Ninham, vim Ninham raug txim rau kev tua neeg txhob txwm.', english: 'But the Wisconsin Supreme Court said that rule did not apply directly to Ninham, because Ninham was convicted of intentional homicide.' } },
      { id: 'rw-khov', hmongRPA: 'khov', english: 'hard, firm; frozen, solid', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Zong tus tij laug, Nhee, piav nws tias yog ib tug “neeg ua haujlwm khov kho” uas tau khaws nyiaj tau ib txhiab tsib puas duas las los ntawm nws txoj haujlwm xa ntawv.', english: 'Zong’s older brother, Nhee, described him as a “strong worker” who had saved $1,500 from his paper route.' } },
      { id: 'rw-txawv', hmongRPA: 'txawv', english: 'different; strange, unusual', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsev hais plaub kuj siv nws tus kheej txoj kev txiav txim thiab hais tias lub txim ntawd tsis yog kev rau txim nyaum thiab txawv txav rau rooj plaub no, thiab tsis lees txais qhov kev sib cav tias lub txim hnyav dhau.', english: 'The court also exercised its own independent judgment and determined that the punishment was not cruel and unusual in this context, and it rejected the claim that the sentence was unduly harsh or excessive.' } },
      { id: 'rw-ruam', hmongRPA: 'ruam', english: 'foolish, stupid', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tom qab qhov kev txiav txim kawg, Zong tus tij laug Seng Vang hais tias qhov ntawd zoo li yog ib kauj ruam loj rau tsev neeg los kho lawv txoj kev mob siab uas plam lawv tus kwv.', english: 'After the final ruling, Zong’s older brother Seng Vang said it felt like a large step for the family toward healing the grief of losing their younger brother.' } },
      { id: 'rw-ntse', hmongRPA: 'ntse', english: 'sharp; clever, smart — "txawj ntse", intelligent', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov no tau ua rau cov kws txawj ntse sib cav hnyav tias puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.', english: 'This has led intellectuals to debate intensely whether a person’s thoughts and behavior are things they can choose, or whether they are determined by things beyond their ability to control.' } },
      { id: 'rw-laus', hmongRPA: 'laus', english: 'old (of people); elder', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tom qab Jeffrey thiab Amanda qhia txog qhov xwm txheej, Lub Nroog Green Bay tub ceev xwm thiaj ntes Richard thiab Omer, thiab nkawd raug coj mus hais plaub sib cais ib yam li neeg laus rau kev tua Zong Vang—kev tua neeg txhob txwm thawj theem.', english: 'After Jeffrey and Amanda reported the incident, both Richard and Omer were arrested by the Green Bay police and were both tried separately as adults for the first-degree murder of Zong Vang.' } },
      { id: 'rw-ntsuab', hmongRPA: 'ntsuab', english: 'green; fresh, unripe (of plants)', category: 'reading-qualities', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.', english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.' } },
      { id: 'rw-haum', hmongRPA: 'haum', english: 'to fit, to suit; to agree', category: 'reading-qualities', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.', english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.' } },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-piam-sij', hmongRPA: 'piam sij', english: 'to be ruined, broken', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-vam-meej', hmongRPA: 'vam meej', english: 'prosperous; affluent; successful', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-vuab-tsuab', hmongRPA: 'vuab tsuab', english: 'dirty, filthy', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-chom', hmongRPA: 'chom', english: 'to be sticking out', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-dhos', hmongRPA: 'dhos', english: 'together, fit', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-npub', hmongRPA: 'npub', english: 'to be dull, blunt', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-pluav', hmongRPA: 'pluav', english: 'to be flattened', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-pluam', hmongRPA: 'pluam', english: 'to pop, such as water balloon', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nro', hmongRPA: 'nro', english: 'to be murky', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nruj', hmongRPA: 'nruj', english: 'to be strict; to be tight', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nchav', hmongRPA: 'nchav', english: 'rough, forceful', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-hmlos', hmongRPA: 'hmlos', english: 'to be dented', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-mluav', hmongRPA: 'mluav', english: 'to be dented; (noun) a dent', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nphob', hmongRPA: 'nphob', english: 'to be faded', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntshiab', hmongRPA: 'ntshiab', english: 'to be crystal clear, clean, to be empty', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxhov', hmongRPA: 'ntxhov', english: 'messy, tangled', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxhee', hmongRPA: 'ntxhee', english: 'soft and smooth, flowy', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nkos', hmongRPA: 'nkos', english: 'to be slippery, muddy/wet, gooey', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-thawm', hmongRPA: 'thawm', english: 'to be soaked through; (verb) to soak', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nyog', hmongRPA: 'nyog', english: 'worthy', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-xyeej', hmongRPA: 'xyeej', english: 'to be available; (verb) to not be agreeable to', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nrawm', hmongRPA: 'nrawm', english: 'to be fast; to be quick', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-pluas', hmongRPA: 'pluas', english: 'to be tart, (noun) classifier for meals', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-nthos', hmongRPA: 'nthos', english: 'to walk limply (ceg ntheeb)', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    { id: 'wbs-ncawg', hmongRPA: 'ncawg', english: 'to have a close relationship with, be used to, familiar with', category: 'reading-qualities', tags: ['adjective', 'reviewed'], audioFile: null },
    ],
  },
  {
    // ── READING GROUP. Domain 'reading', and in check-vocabulary's
    // NOT_TOPICAL set: these are reader-support words lifted from story
    // text, not a deck that asks a question, so a multi-sense gloss here is
    // honest and needs no `senses` array.
    id: 'reading-general',
    title: 'General Reading Words',
    description: 'Reader-support vocabulary that has not sorted into a group yet. A waiting room — moving a word OUT is the point.',
    emoji: '🧩',
    words: [
      { id: 'phr-hwj-chim', hmongRPA: 'hwj chim', english: 'power, authority', category: 'reading-general', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-pob-zeb', hmongRPA: 'pob zeb', english: 'stone, rock', category: 'reading-general', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-rooj-zaum', hmongRPA: 'rooj zaum', english: 'a seat, a bench', category: 'reading-general', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-kab-raub-ris', hmongRPA: 'kab raub ris', english: 'a scorpion', category: 'reading-general', tags: ['noun','animal','reading','unreviewed'], audioFile: null },
      { id: 'phr-xwm-txheej', hmongRPA: 'xwm txheej', english: 'an event, an incident, what happened', category: 'reading-general', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-yeeb-tshuaj', hmongRPA: 'yeeb tshuaj', english: 'drugs, narcotics', category: 'reading-general', tags: ['noun','reading','unreviewed'], audioFile: null },
      { id: 'phr-npau-suav', hmongRPA: 'npau suav', english: 'to dream', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-ua-si', hmongRPA: 'ua si', english: 'to play; a game', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-ua-pauj', hmongRPA: 'ua pauj', english: 'to take revenge; a vendetta', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-sawv-tsees', hmongRPA: 'sawv tsees', english: 'to get up, to spring to one’s feet', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-tshawb-nrhiav', hmongRPA: 'tshawb nrhiav', english: 'to investigate, to search out', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-cuam-tshuam', hmongRPA: 'cuam tshuam', english: 'to affect, to have an impact on', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-tso-tseg', hmongRPA: 'tso tseg', english: 'to drop, to dismiss, to abandon', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'phr-raws-li', hmongRPA: 'raws li', english: 'according to; following', category: 'reading-general', tags: ['conjunction','reading','unreviewed'], audioFile: null },
      { id: 'misc-peev-xwm', hmongRPA: 'peev xwm', english: 'ability; can, to be able to', category: 'reading-general', tags: ['phrase', 'reading'], audioFile: null },
      // ⚠️ CORRECTED 2026-09-13 by the author: the headword is 'xov', NOT
      // 'tus xov', and its classifier is LUB — "lub xov". The id still says
      // tus-xov on purpose: ids are the key the notebook and the due-words
      // queue save against, so renaming it would orphan anyone who has already
      // saved this word. Read the id as an address, not a spelling.
      { id: 'misc-tus-xov', hmongRPA: 'xov', english: 'string, thread, cord — classifier lub: "lub xov"', category: 'reading-general', tags: ['noun', 'reading'], audioFile: null },
      { id: 'misc-xav-pom', hmongRPA: 'xav pom', english: 'to want to see', category: 'reading-general', tags: ['phrase', 'reading'], audioFile: null },
      { id: 'misc-lam', hmongRPA: 'lam', english: 'casually, idly, just for the sake of it', category: 'reading-general', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-lwm', hmongRPA: 'lwm', english: 'another; other · else — "lwm tus", anyone else', category: 'reading-general', tags: ['particle', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-nroj', hmongRPA: 'nroj', english: 'weeds; in "nroj tsuag", plants or vegetation', category: 'reading-general', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-ntoo', hmongRPA: 'ntoo', english: 'tree, wood', category: 'reading-general', tags: ['draft', 'unreviewed', 'reading'], audioFile: null },
      { id: 'misc-sim', hmongRPA: 'sim', english: 'try; attempt (verb) · test; examine (verb) · taste; sample (verb)', category: 'reading-general', tags: ['reading', 'reviewed'], audioFile: null },
      { id: 'misc-tim', hmongRPA: 'tim', english: 'at; over at, dialect/construction-sensitive (locative marker) · tim li cas = cause; reason; why, dialect-sensitive (compound interrogative expression)', category: 'reading-general', tags: ['draft', 'unreviewed', 'reading', 'needs-source-review'], audioFile: null },
      // The author's glossary for the cat-and-mouse story, plus `tos` (already
      // glossed by the Speak lessons). Nothing here was translated by me.
      //
      // ⚠️ THE FIRST TWO ARE THE ONES THAT MATTER. They are not vocabulary so
      // much as keys to the story, and both are places where the obvious
      // literal reading is wrong:
      //   • `lub siab` is not "heart" — it is INTENTION. "Tus nas to taub tus
      //     miv lub siab" means the mouse understands what the cat intends.
      //   • `ua ib siab` is to make up one's mind, not "to be sad".
      // A learner who reads those two literally gets the story backwards.
      { id: 'misc-tos', hmongRPA: 'tos', english: 'to wait', category: 'reading-general', tags: ['verb', 'reading'], audioFile: null },
      { id: 'misc-tib-kaug', hmongRPA: 'tib kaug', english: 'suddenly; immediately; in one quick motion', category: 'reading-general', tags: ['phrase', 'reading'], audioFile: null },
      // ══ PHRASES ══════════════════════════════════════════════════════════
      // Multi-word entries. These are why tier 2 of lookupWord exists — a
      // learner tapping "zos" gets "lub zos" — but tier 2 only searches the
      // CURRENT story's glossary, so the same phrase was invisible in every
      // other story until it landed here.
      {
        id: 'misc-teeb-meem',
        hmongRPA: 'teeb meem',
        english: 'problem, trouble',
        category: 'reading-general',
        tags: ['noun', 'phrase'],
        audioFile: 'lessons/politeness/teeb-meem.wav',
      },
      // Ordinary Hmong found missing by auditing every word tap in a real text.
      // See notes/2026-09-14-zong-vang-day-two.md.
      { id: 'misc-quaj', hmongRPA: 'quaj', english: 'to cry, to weep', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-xaiv', hmongRPA: 'xaiv', english: 'to choose, to pick out', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tsoo', hmongRPA: 'tsoo', english: 'to strike, to smash into, to collide with · to bump into; to crash — "tseb tsoo", a car crash; "tsoo qhov rooj", to bump into the door',  /* 2026-09-30 (author): + bump into / crash with examples; the battle sense removed here — it lives only on war-tsoo. Was: '… · to clash, to meet the enemy in battle' */ category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-plam', hmongRPA: 'plam', english: 'to lose, to be deprived of', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-txais', hmongRPA: 'txais', english: 'to receive, to accept', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-pub', hmongRPA: 'pub', english: 'to allow, to let — "txwv tsis pub", would not let', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ceev-faj', hmongRPA: 'ceev faj', english: 'to be careful, to watch out', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-laj-thawj', hmongRPA: 'laj thawj', english: 'a reason, a cause', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-cwj-pwm', hmongRPA: 'cwj pwm', english: 'character; behaviour', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tab-meeg', hmongRPA: 'tab meeg', english: 'openly, in front of everyone', category: 'reading-general', tags: ['adverb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tsim-nyog', hmongRPA: 'tsim nyog', english: 'to deserve; to be fitting', category: 'reading-general', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tshwm-sim', hmongRPA: 'tshwm sim', english: 'to happen, to occur', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tiv-thaiv', hmongRPA: 'tiv thaiv', english: 'to defend; a defence · to parry',  /* 'to parry' added 2026-09-30 (author) */ category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-xeev', hmongRPA: 'xeev', english: 'a state or province — "Xeev Wisconsin"', category: 'reading-general', tags: ['noun', 'place', 'reading'], audioFile: null },
      { id: 'rv-vab', hmongRPA: 'vab', english: 'net; web (noun) · tsheb kauj vab = bicycle (compound noun)', category: 'reading-general', tags: ['reading', 'needs-source-review'], audioFile: null },
      { id: 'rv-tsum', hmongRPA: 'tsum', english: 'must; have to; need to (modal verb) · necessity or obligation marker (modal particle)', category: 'reading-general', tags: ['reading', 'needs-source-review'], audioFile: null },
      {
        id: 'misc-tej-zaum',
        hmongRPA: 'tej zaum',
        english: 'perhaps, maybe, it may be that — the everyday way of marking something uncertain',
        category: 'reading-general',
        tags: ['phrase', 'particle'],
        audioFile: null,
      },
      { id: 'misc-tshaws', hmongRPA: 'tshaws', english: 'to sting', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-cawm', hmongRPA: 'cawm', english: 'to rescue, to save — "pab cawm", to rescue', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-nqus', hmongRPA: 'nqus', english: 'to suck in, to inhale; of a drug, to snort', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tsom', hmongRPA: 'tsom', english: 'to aim at, to focus on', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-txhawb', hmongRPA: 'txhawb', english: 'to encourage, to support, to egg on', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-tseg', hmongRPA: 'tseg', english: 'to stop, to leave off — and to set aside, to keep: "khaws tseg".', category: 'reading-general', tags: ['verb','reading','unreviewed'], audioFile: null },
      { id: 'misc-ntawv', hmongRPA: 'ntawv', english: 'paper · writing; document; letter · book; reading material', category: 'reading-general', tags: ['noun', 'reading', 'reviewed'], audioFile: null },
      { id: 'gen-hom', hmongRPA: 'hom', english: 'type; kind; class; category; variety', category: 'reading-general', tags: ['noun','everyday','unreviewed'], audioFile: null },
      { id: 'gen-cawm', hmongRPA: 'cawm', english: 'to rescue; to save', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-cwj-pwm', hmongRPA: 'cwj pwm', english: 'attitude; behavior', category: 'reading-general', tags: ['noun','everyday','unreviewed'], audioFile: null },
      { id: 'gen-dab-muag', hmongRPA: 'dab muag', english: 'souvenir', category: 'reading-general', tags: ['noun','everyday','unreviewed'], audioFile: null },
      { id: 'gen-daug', hmongRPA: 'daug', english: 'to hatch', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-faj-suab', hmongRPA: 'faj suab', english: 'haze; heat mist', category: 'reading-general', tags: ['noun','nature','unreviewed'], audioFile: null },
      { id: 'gen-haub', hmongRPA: 'haub', english: 'to entice; to lure; to persuade', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haub nws kom kawm.', english: 'I encouraged him/her to study.', source: 'ai' } },
      { id: 'gen-las-mees', hmongRPA: 'las mees', english: 'to ignore; to not respond', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-meem-txom', hmongRPA: 'meem txom', english: 'uncomfortable', category: 'reading-general', tags: ['adjective','everyday','unreviewed'], audioFile: null },
      { id: 'gen-moj-zeej', hmongRPA: 'moj zeej', english: 'scarecrow; statue', category: 'reading-general', tags: ['noun','everyday','unreviewed'], audioFile: null },
      { id: 'gen-nuv', hmongRPA: 'nuv', english: 'to bow; to fish', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv nyiam nuv ntses.', english: 'My father likes fishing.', source: 'ai' } },
      { id: 'gen-nuam-yaj', hmongRPA: 'nuam yaj', english: 'to sightsee', category: 'reading-general', tags: ['verb','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus nuam yaj thaum so.', english: 'We go sightseeing during vacation.', source: 'ai' } },
      { id: 'gen-nog', hmongRPA: 'nog', english: 'to strap onto something', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nog lub hnab rau nws nraub qaum.', english: 'He straps the bag onto his back.', source: 'ai' } },
      { id: 'gen-puab', hmongRPA: 'puab', english: 'to make by molding', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv puab lub lauj kaub av.', english: 'They mold a clay pot.', source: 'ai' } },
      { id: 'gen-qaim-hli', hmongRPA: 'qaim hli', english: 'moonlit', category: 'reading-general', tags: ['adjective','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hmo no qaim hli zoo nkauj heev.', english: 'Tonight is beautifully moonlit.', source: 'ai' } },
      { id: 'gen-qaug-quav', hmongRPA: 'qaug quav', english: 'to be addicted to something', category: 'reading-general', tags: ['verb','health','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws qaug quav rau kev twv txiaj.', english: 'He is addicted to gambling.', source: 'ai' } },
      { id: 'gen-rauv', hmongRPA: 'rauv', english: 'to burn firewood', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv rauv taws ua mov.', english: 'My father burns firewood for cooking.', source: 'ai' } },
      { id: 'gen-rais', hmongRPA: 'rais', english: 'to become', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws xav rais ua kws kho mob.', english: 'She wants to become a doctor.', source: 'ai' } },
      { id: 'gen-samthiaj', hmongRPA: 'samthiaj', english: 'stage', category: 'reading-general', tags: ['noun','places','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg hu nkauj nyob saum samthiaj.', english: 'The singers are on the stage.', source: 'ai' } },
      { id: 'gen-sawblawj', hmongRPA: 'sawblawj', english: 'to take everything', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv sawblawj cov khoom hauv tsev.', english: 'They took everything in the house.', source: 'ai' } },
      { id: 'gen-tabkaum', hmongRPA: 'tabkaum', english: 'to interrupt; to annoy', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob tabkaum kuv thaum kuv kawm.', english: 'Do not bother me while I study.', source: 'ai' } },
      { id: 'gen-xawb', hmongRPA: 'xawb', english: 'to search for; to look through', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv xawb lub hnab nrhiav tus yuam sij.', english: 'I search through the bag for the key.', source: 'ai' } },
      { id: 'gen-zes', hmongRPA: 'zes', english: 'to bother; to ignite a fire', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zes kuv thaum kuv ua haujlwm.', english: 'He bothers me while I work.', source: 'ai' } },
      // ── HARVESTED FROM THE SOCIETY STORIES, 2026-09-24 ──────────────────
      // From the glossaries of story-kev-tswj-ib-puag-ncig and
      // story-kev-hloov-pauv-lub-xeev-siab. Each example sentence is the story's
      // own line, not new Hmong. Names and one-off phrases stayed glossary-only.
      // ⚠️ 'unreviewed' — the glosses are rewritten for general use.
      { id: 'phr-khoom-muaj-nuj-nqis', hmongRPA: 'khoom muaj nuj nqis', english: 'valuable things; resources of value', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.', english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.' } },
      { id: 'phr-tsiaj-txhu', hmongRPA: 'tsiaj txhu', english: 'animals; wildlife; livestock', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.', english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.' } },
      { id: 'phr-tshuaj-lom', hmongRPA: 'tshuaj lom', english: 'poison; toxic chemicals', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'phr-pa-roj-avgas', hmongRPA: 'pa roj avgas', english: 'exhaust fumes; vehicle emissions', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'phr-khoom-pov-tseg', hmongRPA: 'khoom pov tseg', english: 'waste; rubbish; discarded things', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'phr-nag-xob-nag-cua', hmongRPA: 'nag xob nag cua', english: 'a thunderstorm; a severe storm', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev hloov pauv ntawm huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.', english: 'Changes in the weather will make storms grow larger and more severe.' } },
      { id: 'phr-hluav-taws-xob', hmongRPA: 'hluav taws xob', english: 'electricity', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav ua tau li ntawd los ntawm tsis ua khoom pov tseg ntau, cog ntoo ntxiv, thiab siv hluav taws xob los ntawm hnub ci thiab cua.', english: 'We can do this by producing less waste, planting more trees, and using energy from the sun and wind.' } },
      { id: 'phr-hnub-ci', hmongRPA: 'hnub ci', english: 'sunlight; solar', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav ua tau li ntawd los ntawm tsis ua khoom pov tseg ntau, cog ntoo ntxiv, thiab siv hluav taws xob los ntawm hnub ci thiab cua.', english: 'We can do this by producing less waste, planting more trees, and using energy from the sun and wind.' } },
      { id: 'phr-kev-hloov-pauv', hmongRPA: 'kev hloov pauv', english: 'change; transformation', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Qhov uas ua rau qhov no tseem ceeb tshaj yog thaum peb los xam txog seb kev hloov pauv lub xeev siab cuam tshuam li cas rau kev tsim kho lub zej zog.', english: 'What makes this especially important is considering how changes in psychological state affect the development of communities.' } },
      { id: 'phr-kev-cuam-tshuam', hmongRPA: 'kev cuam tshuam', english: 'impact; influence; effect', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kev Hloov Pauv Ntawm Tib Neeg Lub Xeev Siab Thiab Kev Cuam Tshuam Rau Kev Tsim Kho Lub Zej Zog', english: 'Changes in Human Psychological States and Their Impact on Community Development' } },
      { id: 'phr-sib-cuam-tshuam', hmongRPA: 'sib cuam tshuam', english: 'to interact; to affect one another', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tib neeg lub xeev siab yog ib yam uas nyuaj kawg nkaus rau cov kws tshawb fawb los nkag siab kom tiav, vim nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.', english: 'Human psychological state is something that is extremely difficult for researchers to fully understand, because it has many layers and levels that are deeply interconnected.' } },
      { id: 'phr-kev-sib-xyaw', hmongRPA: 'kev sib xyaw', english: 'a mixture; a combination; blending', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog qhov tshwm sim los ntawm kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.', english: 'They are the result of a combination of what a person is born with and what that person encounters and learns during life.' } },
      { id: 'phr-txhawb-nqa', hmongRPA: 'txhawb nqa', english: 'to support; to nurture; to encourage', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog tias tib neeg txoj kev coj ua tuaj yeem hloov tau los ntawm kev kawm thiab kev sib cuam tshuam nrog ib puag ncig, ces lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.', english: 'If human behavior can be changed through learning and interaction with the environment, then the community has a great responsibility to create an environment that nurtures positive thinking and beneficial behavior.' } },
      { id: 'phr-txoj-hau-kev', hmongRPA: 'txoj hau kev', english: 'an approach; a method; a way of doing something', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tiamsis, yog tias feem ntau ntawm tib neeg txoj kev coj ua yog raug txiav txim los ntawm yam nws yug los nrog, ces cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab los ntawm lawv tus kheej lub xeev siab.', english: 'However, if most human behavior is determined by what a person is born with, then community leaders must reconsider their approach to helping people who suffer difficulties because of their own psychological state.' } },
      { id: 'phr-tiav', hmongRPA: 'tiav', english: 'complete; finished; fully — "kom tiav", all the way', category: 'reading-general', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tib neeg lub xeev siab yog ib yam uas nyuaj kawg nkaus rau cov kws tshawb fawb los nkag siab kom tiav, vim nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.', english: 'Human psychological state is something that is extremely difficult for researchers to fully understand, because it has many layers and levels that are deeply interconnected.' } },
      { id: 'phr-tuaj-yeem', hmongRPA: 'tuaj yeem', english: 'can; to be able to; to be possible', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog tias tib neeg txoj kev coj ua tuaj yeem hloov tau los ntawm kev kawm thiab kev sib cuam tshuam nrog ib puag ncig, ces lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.', english: 'If human behavior can be changed through learning and interaction with the environment, then the community has a great responsibility to create an environment that nurtures positive thinking and beneficial behavior.' } },
      // ── STANDALONE WORDS FROM THE STORIES, 2026-09-25 ─────────────────────
      // Each of these only resolved through a longer compound before ("tswj" only
      // via "kev tswj xyuas"). Examples are story lines, verbatim. Glosses: Claude.
      { id: 'rw-khoom', hmongRPA: 'khoom', english: 'thing, object; goods, belongings', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'rw-tshuaj', hmongRPA: 'tshuaj', english: 'medicine; chemical; drug — "tshuaj lom", poison', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'rw-lom', hmongRPA: 'lom', english: 'poisonous; to poison — "tshuaj lom", poison', category: 'reading-general', tags: ['adjective', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'rw-roj', hmongRPA: 'roj', english: 'oil; fuel, gas; fat', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'rw-pa', hmongRPA: 'pa', english: 'breath; steam, vapour, fumes — "ua pa", to breathe', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.', english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.' } },
      { id: 'rw-yeeb', hmongRPA: 'yeeb', english: 'opium; a narcotic — "yeeb tshuaj", drugs · the spirit world — "yeeb ceeb", the world of spirits and the dead, opposite "yaj ceeb", the world of the living · "yeeb koob", reputation, glory, honor · "pob yeeb", the Adam\'s apple · "luam yeeb", tobacco',  /* was 'opium; a narcotic — …' — non-opium senses added 2026-09-30 (author). NOT added: the paste's "yeeb yaj kiab = abode of the dead" — asked the author (modern usage: a movie). */ category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Richard Crapeau thov kom rov hais nws rooj plaub dua, hais tias nws tsis nyob ntawm lub chaw nres tsheb hmo ntawd, tab sis nyob lwm qhov haus yeeb tshuaj.', english: 'Richard Crapeau asked for a new trial, claiming he was not at the parking ramp that night and was instead elsewhere smoking marijuana.' } },
      { id: 'rw-kab', hmongRPA: 'kab', english: 'insect, bug · line, row', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kab raub ris thiab tus qav', english: 'The scorpion and the frog' } },
      { id: 'rw-npoo', hmongRPA: 'npoo', english: 'edge, rim, border', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nkawd yoj Zong mus mus los los hla saum ntug phab ntsa pob zeb, uas siab li plaub caum tsib feet saum npoo av.', english: 'The two of them swung Zong back and forth out over the edge of the concrete wall, about forty-five feet above the ground.' } },
      { id: 'rw-ntsis', hmongRPA: 'ntsis', english: 'tip, end — "me ntsis", a little', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg pab cawm neeg, uas raug xa tuaj thaum yim teev peb feeb tsaus ntuj, pom tias Zong txoj hlab ntsha tseem dhia me ntsis.', english: 'Rescue personnel, dispatched at 8:03 p.m., detected a faint pulse from Zong.' } },
      { id: 'rw-pawg', hmongRPA: 'pawg', english: 'group, crowd; a pile', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub tim nees nkaum plaub, lub Peb Hlis, xyoo ob txhiab, pawg neeg txiav txim tau txiav txim tias Omer Ninham ua txhaum kev tua neeg txhob txwm thawj theem thiab kev ua phem rau menyuam yaus.', english: 'On 24 March 2000, the jury found Omer Ninham guilty of first-degree intentional homicide and physical abuse of a child.' } },
      { id: 'rw-feem', hmongRPA: 'feem', english: 'part, portion, share — "feem ntau", mostly, the majority', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Yog li kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai uas peb yuav tsum coj mus rau yav pem suab.', english: 'Therefore, respecting and caring for the environment is part of our cultural heritage that we must carry forward into the future.' } },
      { id: 'rw-mas', hmongRPA: 'mas', english: '(topic / emphasis particle) as for…; indeed', category: 'reading-general', tags: ['particle', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus nas mam xav tias paub li mas.', english: 'The mouse thinks, "I should have known."' } },
      { id: 'rw-tsam', hmongRPA: 'tsam', english: 'lest, in case — "ntshai tsam", afraid that', category: 'reading-general', tags: ['conjunction', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kab raub ris thov tus qav thauj nws hla tus dej loj. Tus qav ntshai tsam raug tshaws.', english: 'The scorpion asked the frog to carry it across the river. The frog was afraid of being stung.' } },
      { id: 'rw-npau', hmongRPA: 'npau', english: 'to boil, to bubble — "npau taws", to be angry', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nco txog Zong tias yog ib tug tub uas “muab siab rau txhua yam nws ua” thiab tau npau suav xav ua kws kho mob.', english: 'He remembered Zong as a boy who “put so much desire into everything he did,” and who had once dreamed of becoming a doctor.' } },
      { id: 'rw-ris', hmongRPA: 'ris', english: 'trousers, pants — "kab raub ris" (scorpion) is a separate word', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kab raub ris thiab tus qav', english: 'The scorpion and the frog' } },
      // Added 2026-09-26 — the only two words in story-mus-saib-yeeb-yam a tap could not resolve. Examples are the author's lines.
      { id: 'rw-npaj-txhij', hmongRPA: 'npaj txhij', english: 'all ready, fully prepared — "Neb npaj txhij lawm los?", are you two ready?', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Mai teb kuv tias, “Yog, wb npaj txhij lawm.”', english: 'Mai answered me, “Yes, the two of us are ready.”' } },
      { id: 'rw-yeej', hmongRPA: 'yeej', english: 'truly, really, indeed — stresses the verb after it: "yeej nyiam", really like', category: 'reading-general', tags: ['adverb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom tias peb plaub leeg yeej nyiam yeeb yam no.', english: 'I saw that all four of us really liked this movie.' } },
      // Added 2026-09-26 with the tau set — the gift in "Nws tau khoom plig" had no entry.
      { id: 'rw-khoom-plig', hmongRPA: 'khoom plig', english: 'a gift, a present', category: 'reading-general', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws tau khoom plig.', english: 'He received a gift.' } },
      // Added 2026-09-27 — the car in the Describing Words examples had no entry.
      { id: 'rw-tsheb', hmongRPA: 'tsheb', english: 'a car, a vehicle — with lub: lub tsheb', category: 'reading-general', tags: ['noun', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb no tshiab.', english: 'This car is new.' } },
      // ── kos — 2026-09-27, from a model-written paste. ADDED: draw / mark a line (fits
      // the existing 'kos duab' = to draw), kos npe (to sign), tshoob kos (wedding).
      // HELD for the author (not added): "to scratch / scrape"; "thov kos" = the bill;
      // kos = a cooking tripod / a camera tripod; "tom kos" = over there (it clashes with
      // ko, the demonstrative). RESTORE any of them only once a speaker confirms it.
      { id: 'rw-kos', hmongRPA: 'kos', english: 'to draw, to mark a line — kos duab, to draw a picture; kos npe, to sign', category: 'reading-general', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv kos ib txoj kab.', english: 'I draw a line.' } },
      // Added 2026-09-27 from the GPT fact-check (Heimbach: kos = a glancing scrape; tom kos /
      // ntawm kos = over there). Tripod (medium confidence) left out. NOT "bill" — the author,
      // 2026-09-27: a bill is daim nqi or daim ntawv them nyiaj (money set).
      { id: 'rw-kos-scrape', hmongRPA: 'kos', english: 'to scrape, to graze — a glancing scrape', category: 'reading-general', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws ntog thiab kos caj npab.', english: 'He fell and scraped his arm.', source: 'ai' } },
      { id: 'rw-tom-kos', hmongRPA: 'tom kos', english: 'over there, on that side', category: 'reading-general', tags: ['place', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws nyob tom kos.', english: 'He is over there.', source: 'ai' } },
      { id: 'rw-kos-npe', hmongRPA: 'kos npe', english: 'to sign your name (literally "mark the name")', category: 'reading-general', tags: ['verb', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thov kos npe ntawm no.', english: 'Please sign here.' } },
      { id: 'rw-tshoob-kos', hmongRPA: 'tshoob kos', english: 'a wedding, the wedding ceremonies', category: 'reading-general', tags: ['noun', 'unreviewed'], audioFile: null },
      // ── Added 2026-09-30 — from the author's word list (was "Words by Sound").
    { id: 'wbs-laj-muam', hmongRPA: 'laj muam', english: 'to side glance; (adjective) to be cross-eyed', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tab-kaum', hmongRPA: 'tab kaum', english: 'to interrupt; to annoy', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-nkim', hmongRPA: 'nkim', english: 'to waste', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-kheev', hmongRPA: 'kheev', english: 'to allow', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-rhawv', hmongRPA: 'rhawv', english: 'to create, make; a bathtub; large cement or stone pot', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phov', hmongRPA: 'phov', english: 'to make a ruckus, make noise; to torch off hair, fur, etc.', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxuag', hmongRPA: 'ntxuag', english: 'with, along with', category: 'reading-general', tags: ['preposition', 'reviewed'], audioFile: null },
    { id: 'wbs-tsau', hmongRPA: 'tsau', english: 'to soak; (adjective) to be full', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-ntxaum', hmongRPA: 'ntxaum', english: 'to soak through', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-tsaug', hmongRPA: 'tsaug', english: 'to rinse; to thank (adjective) to be numb', category: 'reading-general', tags: ['verb', 'reviewed'], audioFile: null },
    { id: 'wbs-phaub', hmongRPA: 'phaub', english: 'the cover or shell', category: 'reading-general', tags: ['noun', 'reviewed'], audioFile: null },
      { id: 'general-cuab', hmongRPA: 'cuab', english: 'to mimic, to pose — to position oneself or pretend, as in deception: pretending to be something one is not; also to boast, boast falsely, show off, or pretend to be high status', category: 'reading-general', tags: ['verb', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30 — one of four cuab entries (the rau / tom qab pattern)
      // ⚠️ SPLIT 2026-09-30 into the cuab-uses set, one card per sense (author: "separate the cuab entries, like rau is"). Was:
      // { id: 'misc-cuab', hmongRPA: 'cuab', english: 'belongings, equipment, household items — "cov cuab yeej", tools, equipment, instruments, weapons; "cuab yeej tsov rog", weapons specifically · to trap, to snare — setting up a trap, or the trap itself, especially for catching animals: "cuab quav qaib", to set up a bird trap; "cuab ntses", to trap or catch fish · a family line or household (noun) — in a cultural or clan context, a specific household, extended family unit or generational line: "cuab tsav", the head of a household, a family-line leader; "ib cuab tsev", an entire household · to mimic, to pose (verb) — to position oneself or pretend, as in deception, pretending to be something one is not; also to boast, boast falsely, show off, or pretend to be high status', category: 'reading-general', tags: ['noun', 'reading', 'reviewed'], audioFile: null },  // the author, 2026-09-30
    ],
  },
]

// ── SPLITTING BIG SETS — primaries and secondaries, 2026-09-25 ──────────────
//
// The author: "some sets maybe too big, especially for the non fundamental
// ones, we need to separate, like work 1, work 2, etc. Primaries, and
// secondaries." A 61-word deck is a wordlist, not a study session. The path
// already caps a unit at 20 (UNIT_WORD_CAP in path.js); sets now follow the
// same rough size.
//
// HOW IT WORKS — declarative, so a split is a data edit, never a word move:
//   · Each entry names a RAW category and lists its parts, in order.
//   · PART 1 KEEPS THE ORIGINAL ID and is the PRIMARY set: the everyday words
//     a learner needs first. Keeping the id is what keeps saved quiz scores
//     (`vocab-<id>`), path units and lesson `vocab:` links pointing at it.
//   · Parts 2+ get `<id>-2`, `<id>-3` and are SECONDARY.
//   · Each word's `category` is rewritten to its part. Word ids never change,
//     so every learner's word progress (vocabProgress, keyed on word id) and
//     every saved notebook word survive the split.
//   · A word listed in no part falls into the LAST part, so a newly added word
//     is never lost. scripts/check-splits.mjs reports those, and any id listed
//     that does not exist.
//
// ⚠️ FUNDAMENTALS ARE NOT SPLIT (verbs 28, descriptions 27, conjunctions 24).
// They are free, and the path curates them into 20-word units already.
//
// ⚠️ THE `reading-*` GROUPS ARE NOT SPLIT either. They are the reader's
// dictionary, not decks (see check-vocabulary's NOT_TOPICAL), and splitting
// them would mean editing that list too.
//
// Guide: learning/feature-logic/splitting-vocab-sets-guide.md
export const SET_SPLITS = [
  {
    id: 'animals',
    parts: [
      { blurb: 'The animals you meet every day — home, farm and field.', words: [
        'animals-animals', 'animals-dog', 'animals-cat', 'animals-chicken', 'animals-fish',
        'animals-pig', 'animals-duck', 'animals-bird', 'animals-cow', 'animals-horse',
        'animals-ox', 'animal-tshis', 'animals-frog', 'animals-snake', 'animals-tiger',
        'animal-qaib-cog', 'animal-nas-tsaug', 'animals-bees', 'animals-butterfly', 'animal-ntxhw',
      ] },
      { blurb: 'More animals — wild, small and creeping.', words: [
        'animals-sheep', 'animals-rabbits', 'animal-dais', 'animal-lwj', 'animal-liab',
        'animal-tsov-ntxhuav', 'animal-phaw-nyuj', 'animal-aub-puv-pij', 'animal-noog-liaj',
        'animal-ntsuam', 'animal-yoov', 'animal-cua-nab', 'animal-nab-qa', 'animal-nas-ncuav',
        'animal-nas-tsuag', 'animal-ntseeb', 'animal-yaj-yuam',
      ] },
      { blurb: 'Sea creatures, far-off animals, and animal categories.', words: [
        'animal-tsiaj', 'animal-liab-tsab-tws', 'animal-dais-nauv-xaum', 'animal-tsiaj-yug-me-nyuam-noj-mis',
        'animal-ntses-ntxhuav-loj', 'animal-ntses-xab-lam', 'animal-ntses-pas-thus', 'animal-ntses-pas-vas',
        'animal-kheb', 'misc-tus-kas', 'misc-nas',
        'wbs-nplai',  // fish scales — the author's word list, 2026-09-30
      ] },
    ],
  },
  {
    id: 'agriculture-foodstuffs',
    title: 'Fruit & Vegetables',  // short base for the part titles ('Fruit & Vegetables 1')
    parts: [
      { blurb: 'Everyday fruit, vegetables and staples.', words: [
        'ag-txiv-es-pauj', 'ag-txiv-tsawb', 'ag-txiv-kab-ntxwv', 'ag-txiv-hmab-txiv-ntoo', 'ag-zaub',
        'ag-txhuv', 'ag-pob-kws', 'ag-qos-yaj-ywm', 'ag-txiv-lws-suav', 'ag-dos-loj',
        'ag-dos', 'ag-lub-qij', 'ag-kua-txob', 'ag-zaub-qhwv', 'ag-zaub-ntsuab',
        'ag-dib-ntsuab', 'ag-taub', 'ag-dib-liab', 'ag-nkaus-taw', 'ag-piam-thaj',
      ] },
      { blurb: 'More fruit, beans, herbs and seasonings.', words: [
        'ag-noob-taum-lag', 'ag-txiv-npaws-lij', 'ag-txiv-as-ngoos', 'ag-txiv-maj-naus-ntev',
        'ag-txiv-maj-naus-pob-taub', 'ag-dib-txaij', 'ag-nceb', 'ag-txiv-plhaub-tawv', 'ag-taum-pauv',
        'ag-zaub-txhwv', 'ag-tauj-dub', 'ag-kaus-taum', 'ag-duaj', 'ag-moj-phaub', 'ag-pub-luj',
        'ag-lwm-tsib', 'ag-txiv-cuab-thoj', 'ag-tob-ntoos', 'ag-khoom-rau-nqaij', 'ag-kua-txob-loj',
      ] },
      { blurb: 'Farm crops, tropical fruit, fresh herbs — and kitchen verbs and tastes.', words: [
        'ag-vaj-loog', 'ag-quav-nyab', 'ag-quav-ntsuas', 'ag-nplej-ntxhuav-kws', 'ag-taub-taj',
        'ag-nplooj-maj-naus', 'ag-pum-hub', 'ag-zaub-txig-ntses', 'ag-txiv', 'ag-moj-mib',
        'ag-plab-nyug', 'ag-dib-pag-do-hau', 'ag-dib-pag', 'ag-tev', 'ag-chais', 'ag-daus',
        'ag-kaus', 'ag-qab-zib', 'ag-qaub', 'misc-nplej', 'misc-paj-kws',
      ] },
    ],
  },
  {
    id: 'buildings',
    title: 'Buildings',  // short base for the part titles ('Buildings 1')
    parts: [
      { blurb: 'Home, school, shops and the places you go every week.', words: [
        'buildings-tsev-kheej', 'buildings-tsev-asphavmeem', 'bld-tsev-kawm-ntawv', 'bld-tsev-kho-mob',
        'bld-khw', 'bld-khw-muag-khoom', 'bld-tsev-noj-mov', 'bld-tsev-teev-ntuj', 'bld-tsev-cia-nyiaj',
        'bld-tsev-nyeem-ntawv', 'bld-tsev-xa-ntawv', 'bld-tsev-tub-ceev-xwm', 'bld-tuam-tsev',
        'buildings-vaj', 'buildings-qab-vaj', 'buildings-ntsa-lajkab', 'buildings-garage',
        'bld-tsev-noj-haus', 'bld-khw-loj-muag-khoom', 'bld-tsev-tsim-khoom',
      ] },
      { blurb: 'More homes, and buildings for work, sport and study.', words: [
        'buildings-tsev-duplex', 'buildings-tsev-rhuavlawj', 'buildings-tsev-pheebsuab', 'buildings-momkaum',
        'buildings-xab', 'bld-chav-tsev-nyob', 'bld-tuam-tsev-ua-chav-nyob', 'bld-tsev-liaj',
        'bld-khw-muag-ntawv', 'bld-khw-muag-khoom-noj', 'bld-tsev-so', 'bld-chaw-so',
        'bld-tsev-xyaum-ib-ce', 'bld-chaw-ua-hauj-lwm-tua-hluav-taws', 'bld-lub-tsev-ntsia-yeeb-yam', // was 'bld-lub-tsev-yeeb-yaj-duab' (2026-09-26)
        'bld-tshav-ncaws-pob', 'bld-tsev-rau-khoom', 'bld-tsev-qiv-ntawv',
      ] },
      { blurb: 'Places of worship, landmarks and less common buildings.', words: [
        'buildings-xauj', 'buildings-yuav', 'bld-chav-ua-yeeb-yam', 'bld-tsev-haus-dej-haus-cawv',
        'bld-tsev-twv-txiaj', 'bld-tsev-sawv-cev-rau-tsoom-fwv-lwm-lub-teb-chaws', 'bld-tsev-iav',
        'bld-tsev-niam-plig', 'bld-tsev-teev-hawm', 'bld-tsev-huab-tais', 'bld-tsev-tshoom-ntuj',
        'bld-nkauj', 'bld-tsev-hauj-sam', 'bld-tsev-laus', 'bld-lub-pej-thuam',
      ] },
    ],
  },
  {
    id: 'countries',
    parts: [
      // 2026-09-26: teb chaws added first; the six repeats commented out in the set
      // (Teb Chaws Meskas/Nplog, Nplog/Thaib/Suav teb, Pem) removed from this list.
      { blurb: 'Laos and its neighbours, and the countries Hmong families call home.', words: [
        'country-teb-chaws',
        'country-meskas', 'country-nplog', 'country-teb-chaws-thaib', 'country-teb-chaws-suav',
        'country-teb-chaws-nyab-laj', 'country-teb-chaws-qhab-meem', 'country-mias-mas',
        'country-teb-chaws-fabkis', 'country-kas-nas-das', 'country-austalaslias',
        'country-yelemees', 'country-teb-chaws-nyij-pooj', 'country-teb-chaws-kaus-lim',
      ] },
      { blurb: 'Asia and the Pacific, and the Americas.', words: [
        'country-kaus-lim-qaum-teb', 'country-kaus-lim-qab-teb', 'country-lav-xias', 'country-nyu-xis-las',
        'country-is-nrias', 'country-pas-kis-taas', 'country-nplas-des', 'country-nes-npas',
        'country-is-do-nes-xias', 'country-filiv-pees', 'country-mas-lis-xias', 'country-xis-nka-puv',
        'country-mes-kas-kos', 'country-nplas-xis',
      ] },
      { blurb: 'Europe, Africa and South America.', words: [
        'country-aas-xes-tias-nas', 'country-itaus-liv', 'country-xip-pees', 'country-pov-tu-kees',
        'country-hoo-las', 'country-xuv-xis', 'country-xus-vis-dees', 'country-naw-vees',
        'country-fiv-las', 'country-poo-las', 'country-yus-khees', 'country-iyi', 'country-afas-kas-qab-teb',
      ] },
    ],
  },
  // ⚠️ UN-SPLIT 2026-09-26 — the author: "combine the cov txheeb ze sets … that
  // one in particular needs to be unified." Hmong kinship is ONE system: the
  // "finer distinctions" in part 2 (in-laws, whose-side aunts and uncles) are
  // the point of the set, not an advanced extra, and splitting it hid half the
  // family from anyone who stopped at part 1. The set is back to its original
  // single deck, id 'relatives', title "Cov Txheeb Ze — Relatives & Extended
  // Family". RESTORE the split by uncommenting this entry and re-adding
  // 'relatives-2' to the People theme.
  // {
  //   id: 'relatives',
  //   title: 'Relatives',  // short base for the part titles ('Relatives 1')
  //   parts: [
  //     { blurb: 'Grandparents, aunts, uncles and siblings — the relatives you name most.', words: [
  //       'relatives-txheeb-ze', 'relatives-kwvtij', 'relatives-neejtsa', 'relatives-yawg', 'relatives-pog',
  //       'relatives-yawm-txiv', 'relatives-niam-tais', 'relatives-txiv-hlob', 'relatives-txiv-ntxawm',
  //       'relatives-phauj', 'relatives-dablaug', 'relatives-tais', 'relatives-tijlaug', 'relatives-kwv',
  //       'relatives-muam', 'relatives-nus',
  //     ] },
  //     { blurb: 'Great-grandparents, in-laws and the finer kinship distinctions.', words: [
  //       'relatives-yawg-koob', 'relatives-pog-koob', 'relatives-niam-hlob', 'relatives-niam-ntxawm',
  //       'relatives-yawg-laus', 'relatives-niam-dablaug', 'relatives-yawm-yij', 'relatives-kwvlaug',
  //       'relatives-niam-laus', 'relatives-niam-hluas', 'relatives-txiv-laus', 'relatives-niam-tij',
  //       'relatives-tij-nyab', 'relatives-niam-ntxawm-sil', 'relatives-kuv',
  //     ] },
  //   ],
  // },
  {
    id: 'clothing',
    title: 'Clothing',  // short base for the part titles ('Clothing 1')
    parts: [
      { blurb: 'What you put on every day.', words: [
        'clothing-tsho', 'clothing-ris-ntev', 'clothing-ris-luv', 'clothing-khau', 'clothing-kaus-mom',
        'clothing-tsom-iav', 'clothing-siv-tawv', 'clothing-phuam', 'clothing-hnab-nra',
        'clothing-ris-ntaub-tsuj', 'clothing-ris-xoob', 'clothing-khau-ntaub', 'clothing-khau-luj-siab',
        'clothing-hnab-looj-tes', 'clothing-kaus',
        'wbs-thom-khwm', 'wbs-nrhoob',  // sock, leg warmer — the author's word list, 2026-09-30
      ] },
      { blurb: 'Jewellery, pockets, sleeves and the details of clothes.', words: [
        'clothing-khau-hlau', 'clothing-hlua-khau', 'clothing-saw-caj-dab', 'clothing-nplhaib',
        'clothing-saw-npab', 'clothing-ntsej-tsho', 'clothing-tsho-tes-luv', 'clothing-tsho-tes-ntev',
        'clothing-hnab-tsho', 'clothing-hnab-ris', 'clothing-khawm',
      ] },
    ],
  },
]

// Sets that are not split but are still SECONDARY — specialised or niche,
// shown below the primaries on their theme page. Everything else is primary.
export const SECONDARY_SETS = new Set([
  'war-conflict', 'weapons', 'arts-culture', 'ethnicities', 'botany', 'geography',  // weapons added 2026-09-30
  'human-anatomy-internal-organs', 'seasons-time', 'calendar', 'clothing-verbs',
  'family-female-perspective',
])

function applySplits(raw) {
  const out = []
  for (const cat of raw) {
    const split = SET_SPLITS.find((s) => s.id === cat.id)
    if (!split) {
      out.push({ ...cat, tier: SECONDARY_SETS.has(cat.id) ? 'secondary' : 'primary' })
      continue
    }
    const byId = new Map(cat.words.map((w) => [w.id, w]))
    const placed = new Set()
    const parts = split.parts.map((p, i) => {
      const partId = i === 0 ? cat.id : `${cat.id}-${i + 1}`
      const words = p.words.map((id) => byId.get(id)).filter(Boolean)
      words.forEach((w) => placed.add(w.id))
      return {
        ...cat,
        id: partId,
        // `title` on the split entry overrides a long original (2026-09-25).
        title: `${split.title || cat.title} ${i + 1}`,
        description: p.blurb || cat.description,
        tier: i === 0 ? 'primary' : 'secondary',
        splitOf: cat.id,
        part: i + 1,
        words: words.map((w) => ({ ...w, category: partId })),
      }
    })
    // Never lose a word: anything unlisted goes to the last part.
    const last = parts[parts.length - 1]
    for (const w of cat.words) if (!placed.has(w.id)) last.words.push({ ...w, category: last.id })
    out.push(...parts)
  }
  return out
}

export const categories = applySplits(RAW_CATEGORIES)

// ── Category grouping ───────────────────────────────────────────────────────
// 33 categories in one flat grid is a wall. These are THEMES for display only —
// the `categories` array above stays the single source; groups just reference
// ids. Same idea as consonantGroups (notes/43).
//
// Adding a category? Drop its id into a theme below. If you forget, it still
// shows up under "More" — nothing silently disappears.
//
// ⚠️ `general-vocabulary` IS LEFT OUT ON PURPOSE (2026-09-20), the same choice
// `misc` and `misc-phrases` already carry. It arrived as an 85-word grab bag —
// life, death, clean, business, famous — with no theme anyone would browse it
// for. Featuring it would put a catch-all next to decks that ask a real
// question. As its words sort into themes, move them OUT into the category they
// belong to; that is the point of a waiting room.

// ⚠️ REORGANISED 2026-09-25 (author: "reorganize the sites in ways you think
// are best"). What changed, and why:
//   · FUNDAMENTALS FIRST. Every free grammar set now sits in ONE theme at the
//     top (Grammar Essentials): quantifiers came from time-numbers,
//     locations-prepositions from home, conjunctions and discourse-particles
//     from everyday. Free and paid no longer interleave on the hub.
//   · FOOD GOT ITS OWN THEME (new id `food-kitchen`). "Nature & Food" held
//     nine sets, two of them split into parts; animals and pineapples are not
//     one subject. `living-world` keeps its id, as Nature & Animals.
//   · Split parts (SET_SPLITS above) are listed in order, and the theme page
//     shows primaries first, then secondaries (VocabGroup.jsx).
//   · Theme ids were KEPT wherever the meaning held: they are routes
//     (/vocabulary/group/<id>), sentence-builder topic ids and accent keys.
// Was, in order: people · home (+locations-prepositions, directions) ·
// living-world (animals…weather + food, drinks, cooking, agriculture) ·
// clothing · time-numbers (+quantifiers) · describing · grammar-words (no
// conjunctions/quantifiers/locations/particles) · everyday (+discourse-
// particles, conjunctions) · culture-world · reading-support · body.
const CATEGORY_THEMES = [
  {
    id: 'grammar-words',
    title: 'Grammar Essentials',
    emoji: '🔤',
    blurb: 'Free, always. The small words every Hmong sentence is built from.',
    ids: [
      'pronouns', 'yog-to-be', 'names', 'demonstratives', 'possession', 'adjective-grammar', 'classifiers', /* 'classifier-inventory' — Bisang, commented out 2026-09-30 */ 'common-nouns', 'verbs', 'sentence-structure', 'noun-purpose',
      'tense-markers', 'tau-uses', 'tau-examples', 'grammar', 'negation', 'answering', 'question-words', 'conjunctions', 'rau-uses', 'txhais-uses', /* 'cuab-uses' — commented out 2026-09-30 */ 'intensifiers', 'intensifiers-uncommon', 'so-then', 'reciprocals',  // txhais-uses + intensifiers added 2026-09-30
       // tau-uses added 2026-09-26
      'quantifiers', /* 'measure-words' — Bisang, commented out 2026-09-30 */ 'locations-prepositions', 'discourse-particles',
    ],
  },
  {
    id: 'everyday',
    title: 'Greetings & Everyday',
    emoji: '💬',
    blurb: 'Phrases you say out loud — greetings, thanks, introductions, daily life.',
    ids: ['greetings', 'politeness', 'introductions', 'daily-life', 'chores', 'will-permission'],
  },
  {
    id: 'describing',
    title: 'Describing',
    emoji: '🎨',
    blurb: 'Qualities, colors, and the "siab" expressions for character and feeling.',
    ids: ['descriptions', 'colors', 'personality-siab'],
  },
  {
    id: 'people',
    title: 'People & Family',
    emoji: '👪',
    blurb: 'Kinship terms — which change depending on who is speaking.',
    // Was: …'relatives', 'relatives-2', … — relatives un-split 2026-09-26.
    ids: ['family-male-perspective', 'relatives', 'family-female-perspective'],
  },
  {
    id: 'time-numbers',
    title: 'Time, Numbers & Money',
    emoji: '🕐',
    blurb: 'Counting, the calendar, and buying things.',
    ids: [
      'numbers', 'money', 'timeframes', 'timeframes-days', 'clock-time', 'time-context',  // clock-time added 2026-09-26
      'days-of-week', 'months', 'seasons-time', 'calendar',
    ],
  },
  {
    id: 'food-kitchen',
    title: 'Food & Kitchen',
    emoji: '🍲',
    blurb: 'What is on the table, what grows in the garden, and how it is cooked.',
    ids: [
      'food', 'drinks', 'cooking',
      'agriculture-foodstuffs', 'agriculture-foodstuffs-2', 'agriculture-foodstuffs-3',
    ],
  },
  {
    id: 'living-world',
    title: 'Nature & Animals',
    emoji: '🌿',
    blurb: 'Animals, weather, plants and the land.',
    ids: ['animals', 'animals-2', 'animals-3', 'weather', 'nature', 'botany', 'geography'],
  },
  {
    id: 'home',
    title: 'Home & Places',
    emoji: '🏠',
    blurb: 'The house, what is in it, and the places around town.',
    ids: [
      'household-rooms', 'housing', 'tools-household',
      'buildings', 'buildings-2', 'buildings-3', 'places', 'directions',
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing',
    emoji: '👕',
    blurb: 'What you wear — and the verbs Hmong uses for wearing it.',
    ids: ['clothing', 'clothing-2', 'wear-verbs', 'clothing-verbs'],
  },
  {
    id: 'body',
    title: 'The Body',
    emoji: '🫀',
    blurb: 'Head to foot, inside and out — and the compounds Hmong builds them from.',
    ids: [
      'human-anatomy-face', 'human-anatomy-upper-body',
      'human-anatomy-lower-body', 'body-health', 'human-anatomy-internal-organs',
    ],
  },
  {
    id: 'culture-world',
    title: 'Countries & Culture',
    emoji: '🌏',
    blurb: 'Where Hmong people live, the wider world, and art, history and travel.',
    ids: [
      'countries', 'countries-2', 'countries-3', 'ethnicities',
      'vehicles-travel', 'arts-culture', 'war-conflict', 'weapons',  // weapons added 2026-09-30
    ],
  },
  // ⚠️ Theme commented out with its sets, 2026-09-30.
  // {
  //   // Added 2026-09-30 — the author's word list, grouped by starting sound.
  //   id: 'words-by-sound',
  //   title: 'Words by Sound',
  //   emoji: '🔉',
  //   blurb: 'Everyday words, grouped by the consonant they start with.',
  //   ids: [
  //     'words-by-sound-klmn', 'words-by-sound-pqrs', 'words-by-sound-tvxyz', 'words-by-sound-ch-nc-dh', 'words-by-sound-kh-nk-hl-hm-ml', 'words-by-sound-hn-ph-np-pl', 'words-by-sound-qh-nq-rh-nr', 'words-by-sound-th-nt-ts-tx-xy', 'words-by-sound-ny-nch-nkh-hml-nph-npl', 'words-by-sound-ph-nqh-nrh-nth', 'words-by-sound-tsh-nts-txh', 'words-by-sound-ntx-hny-ntsh-ntxh',
  //   ],
  // },
  {
    // ⚠️ THESE ARE THE OLD `misc` PILE, SORTED — 2026-09-20. Unchanged by the
    // 2026-09-25 reorganisation: the reader's dictionary, not decks, and not split.
    id: 'reading-support',
    title: 'Reading Support',
    emoji: '📖',
    blurb: 'Words the stories use, grouped by subject. Not decks — the reader\'s dictionary.',
    ids: [
      'reading-law',
      'reading-body',
      'reading-mind',
      'reading-emotion',
      'reading-speech',
      'reading-motion',
      'reading-people',
      'reading-place',
      'reading-time',
      'reading-quantity',
      'reading-work',
      'reading-qualities',
      'reading-general',
    ],
  },
]

// ⚠️ PATH-ONLY SETS — 2026-09-28 (author: "hide common nouns from regular vocab dataset and make
// it exclusive to path"). A set listed here is left out of categoryGroups, which is what the
// Words tab, the quiz menu and the sentence builder's set list read. Its cards stay in
// `categories`: the dictionary, word taps and the path unit (getCategory) still find them.
export const PATH_ONLY_CATEGORIES = new Set(['common-nouns'])

// Resolve ids → category objects, drop ids that don't exist, and sweep any
// category nobody assigned into a final "More" group so it stays reachable.
const themed = CATEGORY_THEMES.map((t) => ({
  ...t,
  items: t.ids.filter((id) => !PATH_ONLY_CATEGORIES.has(id)).map((id) => categories.find((c) => c.id === id)).filter(Boolean),
})).filter((t) => t.items.length > 0)

const assigned = new Set(themed.flatMap((t) => t.items.map((c) => c.id)))
const leftovers = categories.filter((c) => !assigned.has(c.id) && !PATH_ONLY_CATEGORIES.has(c.id))

export const categoryGroups = leftovers.length
  ? [...themed, { id: 'more', title: 'More', emoji: '🗂️', blurb: '', items: leftovers }]
  : themed

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}

export function getWord(categoryId, wordId) {
  const cat = getCategory(categoryId)
  if (!cat) return null
  return cat.words.find((w) => w.id === wordId) || null
}

// ── WORD FAMILIES — 2026-09-26 ───────────────────────────────────────────────
// The author: "update all tau entries so that they are interchangeable with one
// another, users can move back and forth between them". A family is an ORDERED
// list of entries that belong together across sets. Every member's word page
// shows the whole family (current one highlighted) with ‹ Previous / Next ›
// (WordDetail's FamilyNav).
//
//   groups   the sections the chips are shown in, each an ordered id list —
//            built from the sets at call time, so a new tau card in `tau-uses`
//            or `tau-examples` joins the family with no edit here.
//   aliases  entries that are the same word as a member and should SHOW the
//            family, but not get a chip of their own (a second "tau" chip would
//            read as a bug): time-context-tau is tense-markers-past again.
const WORD_FAMILIES = [
  {
    id: 'tau',
    title: 'Tau',
    groups: () => [
      {
        title: 'Tau and its patterns',
        ids: [
          'tense-markers-past',
          ...(getCategory('tau-uses')?.words || []).map((w) => w.id),
          'neg-tsis-tau',
        ],
      },
      { title: 'Examples', ids: (getCategory('tau-examples')?.words || []).map((w) => w.id) },
    ],
    aliases: { 'time-context-tau': 'tense-markers-past' },
  },
]

/**
 * The family an entry belongs to, or null:
 *   { id, title, groups: [{ title, cards: [{ id, category, hmongRPA }] }],
 *     order: [card…] (every chip, in order), current: id (the chip to highlight) }
 * `category` is the SET the card sits in (a split part id where the set was
 * split), which is what the /vocabulary/<set>/<word> route needs.
 */
export function familyOf(wordId) {
  for (const f of WORD_FAMILIES) {
    const groups = f.groups()
    const current = f.aliases?.[wordId] || wordId
    if (!groups.some((g) => g.ids.includes(current))) continue
    const where = new Map()
    for (const c of categories) for (const w of c.words) if (!where.has(w.id)) where.set(w.id, { id: w.id, category: c.id, hmongRPA: w.hmongRPA })
    const resolved = groups.map((g) => ({ title: g.title, cards: g.ids.map((id) => where.get(id)).filter(Boolean) }))
    return { id: f.id, title: f.title, groups: resolved, order: resolved.flatMap((g) => g.cards), current }
  }
  return null
}

export function getCategoryGroup(id) {
  return categoryGroups.find((g) => g.id === id)
}

/**
 * The theme to go BACK to from a set, or null — 2026-09-26.
 *
 * A set opened from a theme page carries `?fromGroup=<themeId>` (VocabGroup's
 * rows add it). Its breadcrumbs then read Vocabulary › <Theme> › <Set>, so
 * "back" lands on the theme the learner came from, not the whole Vocabulary hub.
 *
 * ⚠️ HONOURED ONLY IF THAT THEME REALLY CONTAINS THE SET — the same "relevant
 * source" guard as pathReturnUnit in the lesson screen. A stale or hand-typed
 * ?fromGroup= can never put a set under a theme it isn't in. Opened any other
 * way (search, a word link, a deep link) → null → the old Vocabulary › Set trail.
 */
export function groupReturn(fromGroup, categoryId) {
  if (!fromGroup) return null
  const g = getCategoryGroup(String(fromGroup))
  return g && g.items.some((c) => c.id === categoryId) ? g : null
}
