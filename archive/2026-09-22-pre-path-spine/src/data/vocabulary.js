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

export const categories = [
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
      { id: 'animal-lwj', hmongRPA: 'lwj', english: 'deer', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pom ib tus lwj.', english: 'I see a deer.', source: 'ai' } },
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
      { id: 'animal-nas-tsaug', hmongRPA: 'nas tsaug', english: 'mouse', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas tsaug hauv tsev.', english: 'There is a mouse in the house.', source: 'ai' } },
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
      { id: 'animal-nas-tsuag', hmongRPA: 'nas tsuag', english: 'rat', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas tsuag hauv tsev.', english: 'There is a rat in the house.', source: 'ai' } },
      { id: 'animal-cua-nab', hmongRPA: 'cua nab', english: 'worm; earthworm', category: 'animals', tags: ['noun','animals','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus cua nab nyob hauv av.', english: 'The earthworm lives in the soil.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      // Classifier removed from the headword 2026-09-21 (was `tus kas`) — the author's
      // ruling: animal decks teach the NAME. ⚠️ needs-review: this deck now has two
      // words for goat, `kas` and `tshis` (animal-tshis). One may be regional or wrong.
      { id: 'misc-tus-kas', hmongRPA: 'kas', english: 'goat', category: 'animals', tags: ['noun', 'animals', 'needs-review'], audioFile: null },
      { id: 'misc-nas', hmongRPA: 'nas', english: 'mouse, rat', category: 'animals', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus nas hauv chav ua mov.', english: 'There is a mouse in the kitchen.', source: 'ai' } },
      // ⚠️ REDUNDANT, commented out 2026-09-21. With the classifier removed this is just
      // `luav`, which `animals-rabbits` already teaches. The gloss was a story artifact.
      // { id: 'misc-tus-luav', hmongRPA: 'tus luav', english: 'the rabbit', category: 'animals', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
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
      { id: 'food-nroj-zaub', hmongRPA: 'nroj zaub', english: 'vegetable oil', category: 'food', tags: ['noun','food','unreviewed','needs-review'], audioFile: null },
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
        exampleSentence: { hmong: 'Kuv nus hu kuv nag hmo.', english: 'My brother called me yesterday.', source: 'ai' },
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
    title: 'Classifiers',
    description: 'Hmong Classifiers',
    emoji: '🏷️',
    words: [
      {
        id: 'classifiers-tus',
        hmongRPA: 'tus',
        english: 'classifier for people and animals',
        senses: [{ en: 'classifier for people and animals', context: 'classifiers' }, { en: 'classifier for long, narrow or individually identified objects', context: 'reading' }, { en: 'the one; that individual — used pronominally when the noun is known', context: 'reading' }],
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
        english: 'classifier for people; respectful individual classifier',
        senses: [{ en: 'classifier for people; respectful individual classifier', context: 'classifiers' }, { en: 'leej twg = who', context: 'question-words' }],
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
        exampleSentence: { hmong: 'Kuv hnav khau hlau thaum los nag.', english: 'I wear boots when it rains.', source: 'ai' },
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
        exampleSentence: { hmong: 'Nws hnav saw caj dab zoo nkauj.', english: 'She wears a beautiful necklace.', source: 'ai' },
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
    ],
  },

  // Tools Hmoob Cov Cuabyeej

  {
    id: 'tools-household',
    title: 'Hmoob Cov Cuab Yeej — Tools & Household Items',
    description: 'Everyday Hmong tools, cookware, and household objects, with their characteristic classifiers.',
    emoji: '🧹',
    words: [
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
      { id: 'phr-rooj-noj-mov', hmongRPA: 'rooj noj mov', english: 'a dining table', category: 'tools-household', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb zaum ntawm rooj noj mov.', english: 'We sit at the dining table.', source: 'ai' } },
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
      { id: 'bld-tsev-kho-mob', hmongRPA: 'tsev kho mob', english: 'hospital', category: 'buildings', tags: ['noun','buildings','health','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mus tsev kho mob nag hmo.', english: 'She went to the hospital yesterday.', source: 'ai' } },
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
      { id: 'bld-lub-tsev-yeeb-yaj-duab', hmongRPA: 'lub tsev yeeb yaj duab', english: 'movie theater', category: 'buildings', tags: ['noun','buildings','entertainment','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb mus saib yeeb yaj duab hauv lub tsev yeeb yaj duab.', english: 'We watch a movie at the theater.', source: 'ai' } },
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
        english: 'How much? / How many?',
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
        exampleSentence: { hmong: 'Heev kim.', english: 'Very expensive.' },
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
        hmongRPA: 'nqi',
        english: 'the price; cost; fee',
        category: 'money',
        tags: ['noun', 'shopping'],
        audioFile: null,
        exampleSentence: { hmong: 'Tus nqi yog tsawg?', english: 'What is the price?' },
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
    description: 'Hmong words for parts of the day, telling time, and relative days (past and future).',
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
      },
      {
        id: 'time-hmo-ntuj',
        hmongRPA: 'hmo ntuj',
        english: 'nighttime',
        category: 'timeframes',
        tags: ['noun', 'time', 'time-of-day'],
        audioFile: 'vocabulary/timeframes/hmong-time-hmo-ntuj.mp3',
        exampleSentence: { hmong: 'Hmo ntuj tsaus.', english: 'The night is dark.' },
      },
      {
        id: 'time-tagkis-no',
        hmongRPA: 'tag kis no',
        english: 'this morning',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-tagkis-no.mp3',
        // note: 'tag kis' = morning OR tomorrow; 'no' (this) pins it to "this morning." See 'tag kis' (tomorrow) below — same word, context-dependent. KEY teaching point.
        exampleSentence: { hmong: 'Tag kis no kuv mus ua haujlwm.', english: 'This morning I go to work.', source: 'ai' },
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
      {
        id: 'time-teev',
        hmongRPA: 'teev',
        english: 'hour; o\'clock',
        category: 'timeframes',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-teev.mp3',
        exampleSentence: { hmong: 'Tsib teev.', english: 'Five o\'clock.' },
        // note: 'teev' = hour/o'clock AND "to weigh." Homograph; context disambiguates.
      },
      {
        id: 'time-feeb',
        hmongRPA: 'feeb',
        english: 'minute',
        category: 'timeframes',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-feeb.mp3',
        exampleSentence: { hmong: 'Kaum feeb.', english: 'Ten minutes.' },
      },
      {
        id: 'time-teevsij',
        hmongRPA: 'teev sij',
        english: 'clock; watch',
        category: 'timeframes',
        tags: ['noun', 'time'],
        audioFile: 'vocabulary/timeframes/hmong-time-teev-sij.mp3',
        // note: also in your furniture set ('lub teev sij' = clock). Cross-reference.
        exampleSentence: { hmong: 'Txhua feeb, kuv ntsia lub teev sij ntawd.', english: 'Every minute, I look at that clock.', source: 'ai' },
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
        hmongRPA: 'nag hmos',
        english: 'yesterday',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-nag-hmos.mp3',
        exampleSentence: { hmong: 'Nag hmos kuv mus.', english: 'I went yesterday.' },
        // note: source 'Naghmo'; standard spacing 'nag hmo'. Lit. "last night" but used for "yesterday."
      },
      // ---- Relative days: FUTURE ----
      {
        id: 'time-tagkis',
        hmongRPA: 'tag kis',
        english: 'tomorrow (also: morning)',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-tagkis.mp3',
        exampleSentence: { hmong: 'Tag kis kuv mus.', english: 'I\'ll go tomorrow.' },
        // note: same word as the 'morning' sense in 'tag kis no'. Tomorrow vs morning is context-dependent — the single most important ambiguity in this set.
      },
      {
        id: 'time-nagkis',
        hmongRPA: 'nag kis',
        english: 'the day after tomorrow (two days from now)',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-nagkis.mp3',
        // note: 'nag kis' as "2 days later" — verify; the past/future day-offset series varies and I'm not fully confident here. FLAG.
        exampleSentence: { hmong: 'Nag kis, wb mam li mus tom khw.', english: 'Two days from now, we will go to the store.', source: 'ai' },
      },
      {
        id: 'time-puagnraus',
        hmongRPA: 'puag nraus',
        english: 'three days from now',
        category: 'timeframes',
        tags: ['noun', 'time', 'relative'],
        audioFile: 'vocabulary/timeframes/hmong-time-puag-nraus.mp3',
        // note: 'puag nraus' for "3 days later" — uncertain spelling and offset. FLAG for verification.
        exampleSentence: { hmong: 'Puag nraus kuv mus tom khw.', english: 'Three days from now I will go to the market.', source: 'ai' },
      },
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
        // note: source 'Tasnrho / Tagnrho'; standard is 'tag nrho'. Means "all / the entirety."
      },
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
        english: 'still, currently',
        category: 'grammar',
        tags: ['adverb', 'aspect'],
        audioFile: null,
        exampleSentence: { hmong: 'Kuv tseem nrhiav.', english: 'I am still looking.' },
      },
      {
        id: 'grammar-already',
        hmongRPA: 'twb ... lawm',
        english: '(aspect marker: have already)',
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
        hmongRPA: 'lub cuaj hli ntuj',
        english: 'September',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Cov menyuam pib kawm ntawv lub cuaj hli ntuj.', english: 'The children start school in September.', source: 'ai' },
      },
      {
        id: 'months-october',
        hmongRPA: 'lub kaum hli ntuj',
        english: 'October',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Huab cua txias thaum lub kaum hli ntuj.', english: 'The weather gets cold in October.', source: 'ai' },
      },
      {
        id: 'months-november',
        hmongRPA: 'lub kaum ib hli ntuj',
        english: 'November',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb yuav mus xyuas pog lub kaum ib hli ntuj.', english: 'We will visit Grandma in November.', source: 'ai' },
      },
      {
        id: 'months-december',
        hmongRPA: 'lub kaum ob hli ntuj',
        english: 'December',
        category: 'months',
        tags: ['noun', 'time', 'month'],
        audioFile: null,
        exampleSentence: { hmong: 'Peb tsev neeg sib sau ua ke lub kaum ob hli ntuj.', english: 'Our family gathers together in December.', source: 'ai' },
      },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'phr-cuaj-hlis', hmongRPA: 'Cuaj Hlis', english: 'September, short form of "lub cuaj hli ntuj"', category: 'months', tags: ['time', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv pib kawm ntawv thaum Cuaj Hlis.', english: 'I start school in September.', source: 'ai' } },
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
english: '(confirming in a suggestive tone)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj yuav tuaj, nawb?', english: 'You will come, okay?', source: 'ai' },
},
{
id: 'discourse-yom',
hmongRPA: 'yom',
english: '(turns statements into confirming questions)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj twb noj mov lawm yom?', english: 'You already ate, right?', source: 'ai' },
},
{
id: 'discourse-os',
hmongRPA: 'os',
english: '(softens tone, no meaning change)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj tos kuv os.', english: 'Please wait for me.', source: 'ai' },
},
{
id: 'discourse-lov',
hmongRPA: 'lov',
english: '(turns a statement into a question)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj noj mov lov?', english: 'Are you eating?', source: 'ai' },
},
{
id: 'discourse-ne',
hmongRPA: 'ne',
english: '(asks about the preceding subject)',
category: 'discourse-particles',
tags: ['particle', 'discourse', 'question'],
audioFile: null,
exampleSentence: { hmong: 'Koj niam ne?', english: 'What about your mother?', source: 'ai' },
},
{
id: 'discourse-mog',
hmongRPA: 'mog',
english: '(segment marker in personal relationships)',
category: 'discourse-particles',
tags: ['particle', 'discourse'],
audioFile: null,
exampleSentence: { hmong: 'Koj yog kuv tus phooj ywg mog.', english: 'You are my friend, you know.', source: 'ai' },
},
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
exampleSentence: { hmong: 'Kuv thiab koj.', english: 'You and I.' },
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
english: 'if',
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
english: '(past tense marker: completion)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tau mus.', english: 'I went.' },
},
{
id: 'time-context-tabtom-past',
hmongRPA: 'tab tom',
english: '(past continuous marker: currently)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tab tom hais.', english: 'I was speaking.' },
},
{
id: 'time-context-twb-lawm',
hmongRPA: 'twb ... lawm',
english: '(present perfect marker)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv twb mus lawm.', english: 'I have already gone.' },
},
{
id: 'time-context-tabtom-present',
hmongRPA: 'tab tom',
english: '(present continuous marker)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv tab tom noj mov.', english: 'I am eating rice.' },
},
{
id: 'time-context-tagkis',
hmongRPA: 'tag kis',
english: 'tomorrow',
category: 'time-context',
tags: ['noun', 'time', 'relative'],
audioFile: null,
exampleSentence: { hmong: 'Tag kis kuv mus.', english: 'Tomorrow I will go.' },
},
{
id: 'time-context-yuav',
hmongRPA: 'yuav',
english: '(future tense marker: going to)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv yuav mus.', english: 'I am going to go.' },
},
{
id: 'time-context-mam-li',
hmongRPA: 'mam li',
english: '(future tense marker: will)',
category: 'time-context',
tags: ['particle', 'tense', 'aspect'],
audioFile: null,
exampleSentence: { hmong: 'Kuv mam li mus.', english: 'I will go.' },
},
{
id: 'time-context-tabtom-yuav',
hmongRPA: 'tab tom yuav',
english: '(future progressive marker: about to)',
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
senses: [{ en: 'early', context: 'time' }, { en: 'morning or early-day element, as in tag kis ntxov = tomorrow morning', context: 'reading' }],
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
      { id: 'pronouns-he-she', hmongRPA: 'nws', english: 'he; she; it', category: 'pronouns', tags: ['pronoun', 'singular', 'reviewed'], audioFile: 'grammar/pronouns/hmong-pronouns-nws.mp3', exampleSentence: { hmong: 'Nws hu ua Mim.', english: 'Her name is Mim.' } },
      { id: 'pronouns-we-two', hmongRPA: 'wb', english: 'we two (you and I)', category: 'pronouns', tags: ['pronoun', 'dual'], audioFile: 'grammar/pronouns/hmong-pronouns-wb.mp3', exampleSentence: { hmong: 'Wb mus tom khw ua ke.', english: 'The two of us go to the market together.', source: 'ai' } },
      { id: 'pronouns-you-two', hmongRPA: 'neb', english: 'you two', category: 'pronouns', tags: ['pronoun', 'dual'], audioFile: 'grammar/pronouns/hmong-pronouns-neb.mp3', exampleSentence: { hmong: 'Neb tsev nyob qhov twg?', english: 'Where is the house of you two?', source: 'ai' } },
      { id: 'pronouns-they-two', hmongRPA: 'nkawd', english: 'they two; the two of them', senses: [{ en: 'they two; the two of them', context: 'pronouns' }, { en: 'their two; belonging to the two of them', context: 'reading' }], category: 'pronouns', tags: ['pronoun', 'dual', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Nkawd sib hlub.', english: 'The two of them love each other.' } },
      { id: 'pronouns-we', hmongRPA: 'peb', english: 'we (three or more)', category: 'pronouns', tags: ['pronoun', 'plural'], audioFile: 'grammar/pronouns/hmong-pronouns-peb.mp3', exampleSentence: { hmong: 'Peb mus noj mov ua ke.', english: 'We go eat together.', source: 'ai' } },
      { id: 'pronouns-you-plural', hmongRPA: 'nej', english: 'you (three or more)', category: 'pronouns', tags: ['pronoun', 'plural'], audioFile: 'grammar/pronouns/hmong-pronouns-nej.mp3', exampleSentence: { hmong: 'Nej cov khoom nyob qhov twg?', english: 'Where are your things?', source: 'ai' } },
      { id: 'pronouns-they', hmongRPA: 'lawv', english: 'they; them', senses: [{ en: 'they; them', context: 'pronouns' }, { en: 'their; theirs', context: 'reading' }], category: 'pronouns', tags: ['pronoun', 'plural', 'reviewed'], audioFile: 'grammar/pronouns/hmong-pronouns-lawv.mp3', exampleSentence: { hmong: 'Lawv mus lawm.', english: 'They went.' } },
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
    ],
  },
  {
    id: 'tense-markers',
    title: 'Tense Markers',
    description: 'The small words that place a verb in time — Hmong never conjugates.',
    emoji: '⏳',
    words: [
      { id: 'tense-markers-progressive', hmongRPA: 'tab tom', english: 'currently (-ing)', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tabtom.mp3', exampleSentence: { hmong: 'Kuv tab tom noj.', english: 'I am eating.' } },
      { id: 'tense-markers-future', hmongRPA: 'yuav', english: 'will (future)', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-yuav.mp3', exampleSentence: { hmong: 'Kuv yuav noj.', english: 'I will eat.' } },
      { id: 'tense-markers-past', hmongRPA: 'tau', english: 'already (past completed)', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tau.mp3', exampleSentence: { hmong: 'Kuv tau noj.', english: 'I have eaten.' } },
      { id: 'tense-markers-still', hmongRPA: 'tseem', english: 'still', category: 'tense-markers', tags: ['particle', 'aspect'], audioFile: 'grammar/tense-markers/hmong-tense-markers-tseem.mp3', exampleSentence: { hmong: 'Kuv tseem noj.', english: 'I am still eating.' } },
      { id: 'tense-markers-completed', hmongRPA: 'lawm', english: 'already; now — marks a change or newly relevant state', senses: [{ en: 'already; now — marks a change or newly relevant state', context: 'tense-markers' }, { en: 'finished; completed', context: 'reading' }], category: 'tense-markers', tags: ['particle', 'aspect', 'reviewed'], audioFile: 'grammar/tense-markers/hmong-tense-markers-lawm.mp3', exampleSentence: { hmong: 'Kuv noj lawm.', english: 'I ate already.' } },
    ],
  },
  {
    id: 'demonstratives',
    title: 'Demonstratives',
    description: 'This, that, here, there — the pointing words. They follow the noun.',
    emoji: '👉',
    words: [
      { id: 'demonstratives-this', hmongRPA: 'no', english: 'this; these', senses: [{ en: 'this; these', context: 'demonstratives' }, { en: 'here; now; this point', context: 'reading' }], category: 'demonstratives', tags: ['demonstrative', 'reviewed'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-no.mp3', exampleSentence: { hmong: 'Lub tsev no.', english: 'This house.' } },
      { id: 'demonstratives-that', hmongRPA: 'ntawd', english: 'that; those', senses: [{ en: 'that; those', context: 'demonstratives' }, { en: 'that one; the aforementioned one', context: 'reading' }], category: 'demonstratives', tags: ['demonstrative', 'reviewed'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawd.mp3', exampleSentence: { hmong: 'Tus ntawd yog leej twg?', english: 'Who is that?', source: 'ai' } },
      { id: 'demonstratives-that-near-you', hmongRPA: 'ko', english: 'that (near the listener)', category: 'demonstratives', tags: ['demonstrative'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ko.mp3', exampleSentence: { hmong: 'Koj muab phau ntawv ko rau kuv.', english: 'Give me that book near you.', source: 'ai' } }, // TODO-VERIFY: "ko" vs "ntawd" nuance
      { id: 'demonstratives-here', hmongRPA: 'ntawm no', english: 'here', category: 'demonstratives', tags: ['demonstrative', 'location'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-no.mp3', exampleSentence: { hmong: 'Koj nyob ntawm no puas tau?', english: 'Can you stay here?', source: 'ai' } },
      { id: 'demonstratives-there', hmongRPA: 'ntawm ntawd', english: 'there', category: 'demonstratives', tags: ['demonstrative', 'location'], audioFile: 'grammar/common-demonstratives/hmong-demonstratives-ntawm-ntawd.mp3', exampleSentence: { hmong: 'Nws nyob ntawm ntawd tos peb.', english: 'He is there waiting for us.', source: 'ai' } },
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
      { id: 'reciprocals-meet-again', hmongRPA: 'sib ntsib dua', english: 'to meet again (goodbye)', category: 'reciprocals', tags: ['verb', 'reciprocal', 'greeting'], audioFile: 'grammar/conversations/sib-reciprocals/hmong-sib-reciprocals-sib-ntsib-dua.mp3', exampleSentence: { hmong: 'Peb yuav sib ntsib dua tag kis.', english: 'We will meet again tomorrow.', source: 'ai' } },
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
      { id: 'yog-to-be-is', hmongRPA: 'yog', english: 'to be / equals', category: 'yog-to-be', tags: ['verb', 'copula'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-yog.mp3', exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      // The three conjugated forms the lesson actually teaches. They were only
      // in the lesson's `examples` step, so the word bank drilled a set the
      // learner had never been shown — see notes/56.
      { id: 'yog-to-be-i-am', hmongRPA: 'kuv yog', english: 'I am', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-kuv-yog.mp3', exampleSentence: { hmong: 'Kuv yog Hmoob.', english: 'I am Hmong.' } },
      { id: 'yog-to-be-you-are', hmongRPA: 'koj yog', english: 'you are', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-koj-yog.mp3', exampleSentence: { hmong: 'Koj yog kuv tus phooj ywg.', english: 'You are my friend.', source: 'ai' } },
      { id: 'yog-to-be-he-she-is', hmongRPA: 'nws yog', english: 'he / she is', category: 'yog-to-be', tags: ['verb', 'copula', 'pronoun'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-nws-yog.mp3', exampleSentence: { hmong: 'Nws yog kuv tus muam.', english: 'She is my sister.', source: 'ai' } },
      { id: 'yog-to-be-is-not', hmongRPA: 'tsis yog', english: 'is not / no', category: 'yog-to-be', tags: ['verb', 'copula', 'negation'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-tsis-yog.mp3', exampleSentence: { hmong: 'Nws tsis yog kuv tus kwv.', english: 'He is not my younger brother.', source: 'ai' } },
      { id: 'yog-to-be-question', hmongRPA: 'puas yog?', english: 'is it? / right?', category: 'yog-to-be', tags: ['verb', 'copula', 'question'], audioFile: 'grammar/yog-to-be/hmong-yog-to-be-puas-yog.mp3' },
      { id: 'yog-to-be-located', hmongRPA: 'nyob', english: 'be located; live; stay', senses: [{ en: 'be located; live; stay', context: 'yog-to-be' }, { en: 'remain; continue to be', context: 'reading' }, { en: 'be alive — in "ua neej nyob"', context: 'reading' }], category: 'yog-to-be', tags: ['verb', 'location', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.' } },
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
      { id: 'question-words-how-many', hmongRPA: 'pes tsawg?', english: 'how much / how many?', category: 'question-words', tags: ['question', 'phrase'], audioFile: null, exampleSentence: { hmong: 'Koj muaj menyuam pes tsawg?', english: 'How many children do you have?', source: 'ai' } },
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
      { id: 'war-rog', hmongRPA: 'rog', english: 'war', category: 'war-conflict', tags: ['noun','war','unreviewed','needs-review'], audioFile: null },
      { id: 'war-tawm-tsam', hmongRPA: 'tawm tsam', english: 'to attack; to oppose', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov pejxeem tawm tsam txoj cai tshiab ntawd.', english: 'The people oppose that new law.', source: 'ai' } },
      { id: 'war-sib-tawm-tsam', hmongRPA: 'sib tawm tsam', english: 'to battle each other; battle', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Ob pab tub rog sib tawm tsam ze ntawm lub nroog.', english: 'The two armies battle each other near the city.', source: 'ai' } },
      { id: 'war-npoos', hmongRPA: 'npoos', english: 'bomb', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg khiav mus nkaum thaum lawv hnov npoos tawg.', english: 'People ran for shelter when they heard a bomb explode.', source: 'ai' } },
      { id: 'war-phom', hmongRPA: 'phom', english: 'gun; firearm', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tub ceev xwm nqa phom raws li txoj cai thiab kev cob qhia.', english: 'Police carry firearms according to law and training.', source: 'ai' } },
      { id: 'war-kaus-mom', hmongRPA: 'kaus mom', english: 'helmet', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus caij maus taus hnav kaus mom kom nyab xeeb.', english: 'The motorcycle rider wears a helmet for safety.', source: 'ai' } },
      { id: 'war-tseb-tua-nrog', hmongRPA: 'tseb tua nrog', english: 'invasion', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov pejxeem ntshai tsam muaj kev tseb tua nrog los ntawm lwm lub teb chaws.', english: 'The people fear an invasion from another country.', source: 'ai' } },
      { id: 'war-caws-foob-pob', hmongRPA: 'caws foob pob', english: 'land mine', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Thaj chaw ntawd muaj caws foob pob, ces tsis txhob taug kev mus ntawd.', english: 'That area has land mines, so do not walk there.', source: 'ai' } },
      { id: 'war-kev-thaj-yeeb', hmongRPA: 'kev thaj yeeb', english: 'peace; peacetime', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Txhua tus xav kom muaj kev thaj yeeb hauv lawv lub zej zog.', english: 'Everyone wants peace in their community.', source: 'ai' } },
      { id: 'war-tawm-khiav', hmongRPA: 'tawm khiav', english: 'to retreat; flee', category: 'war-conflict', tags: ['verb','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov neeg nyob hauv zos tau tawm khiav thaum muaj kev sib ntaus.', english: 'The villagers fled when fighting began.', source: 'ai' } },
      { id: 'war-tsov-rog', hmongRPA: 'tsov rog', english: 'war; warfare — the usual full form', category: 'war-conflict', tags: ['noun','war','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tsov rog ua rau ntau tsev neeg tau khiav tawm lawv lub zos.', english: 'War caused many families to flee their villages.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-xib-xub', hmongRPA: 'xib xub', english: 'arrow', category: 'war-conflict', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Tus neeg tua hneev tua ib rab xib xub rau ntawm lub hom phiaj.', english: 'The archer shot an arrow at the target.', source: 'ai' } },
    ],
  },

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
      { id: 'time-zoo-li-cas', hmongRPA: 'zoo li cas', english: 'how is it?; what is it like?; in what way?', category: 'seasons-time', tags: ['phrase','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Koj xav tias zaj yeeb yaj duab ntawd zoo li cas?', english: 'What do you think the movie is like?', source: 'ai' } },
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
    ],
  },
  {
    id: 'vehicles-travel',
    title: 'Vehicles & Travel',
    description: 'Transportation, vehicles, and travel actions.',
    emoji: '🚗',
    words: [
      { id: 'vehicle-lub-maus-taus', hmongRPA: 'lub maus taus', english: 'motorcycle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws caij lub maus taus mus ua haujlwm txhua tag kis.', english: 'They ride a motorcycle to work every morning.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-kauj-vab', hmongRPA: 'lub tsheb kauj vab', english: 'bicycle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus ntxhais caij lub tsheb kauj vab mus kawm ntawv.', english: 'The girl rides a bicycle to school.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb', hmongRPA: 'lub tsheb', english: 'car; vehicle', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb tsav lub tsheb mus tom khw.', english: 'We drive the car to the store.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-nqaj-hlau', hmongRPA: 'lub tsheb nqaj hlau', english: 'train', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub tsheb nqaj hlau tuaj txog ntawm qhov chaw nres tsheb raws sijhawm.', english: 'The train arrived at the station on time.', source: 'ai' } },
      { id: 'vehicle-lub-dav-hlau', hmongRPA: 'lub dav hlau', english: 'airplane; plane', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub dav hlau yuav tsaws rau Lub Nroog Minneapolis yav tav su.', english: 'The airplane will land in Minneapolis in the afternoon.', source: 'ai' } },
      { id: 'vehicle-lub-npav', hmongRPA: 'lub npav', english: 'bus', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv caij lub npav mus hauv nroog thaum sawv ntxov.', english: 'I take the bus into the city in the morning.', source: 'ai' } },
      { id: 'vehicle-lub-tsheb-ntiav', hmongRPA: 'lub tsheb ntiav', english: 'taxi', category: 'vehicles-travel', tags: ['noun','vehicles','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb hu lub tsheb ntiav thaum peb tsis muaj tsheb.', english: 'We call a taxi when we do not have a car.', source: 'ai' } },
      { id: 'vehicle-taug-kev', hmongRPA: 'taug kev', english: 'to walk; to travel on foot', category: 'vehicles-travel', tags: ['verb','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv taug kev mus tom khw vim nws nyob ze kuv tsev.', english: 'I walk to the store because it is close to my house.', source: 'ai' } },
      { id: 'vehicle-khiav', hmongRPA: 'khiav', english: 'to run', category: 'vehicles-travel', tags: ['verb','travel','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws khiav ncig lub pas dej txhua tag kis.', english: 'They run around the lake every morning.', source: 'ai' } },
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
      { id: 'country-meskas', hmongRPA: 'Meskas', english: 'United States; America', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-teb-chaws-meskas', hmongRPA: 'Teb Chaws Meskas', english: 'the United States', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Fabkis' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Fabkis', below.
      { id: 'country-teb-chaws-fabkis', hmongRPA: 'Teb Chaws Fabkis', english: 'France', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-nplog', hmongRPA: 'Nplog', english: 'Laos', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-teb-chaws-nplog', hmongRPA: 'Teb Chaws Nplog', english: 'Laos', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Thaib' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Thaib', below.
      { id: 'country-teb-chaws-thaib', hmongRPA: 'Teb Chaws Thaib', english: 'Thailand', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Suav' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Suav', below.
      { id: 'country-teb-chaws-suav', hmongRPA: 'Teb Chaws Suav', english: 'China', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Nyab Laj' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Nyab Laj', below.
      { id: 'country-teb-chaws-nyab-laj', hmongRPA: 'Teb Chaws Nyab Laj', english: 'Vietnam', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Qhab Meem' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Qhab Meem', below.
      { id: 'country-teb-chaws-qhab-meem', hmongRPA: 'Teb Chaws Qhab Meem', english: 'Cambodia', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      { id: 'country-mias-mas', hmongRPA: 'Mias Mas', english: 'Myanmar; Burma', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // ⚠️ needs-review. Glossed "Myanmar; Burma", identical to `country-mias-mas`
      // above. `Pem` normally means "over there, yonder", so one of the two is doing
      // something else. Kept as supplied until a speaker rules.
      { id: 'country-pem', hmongRPA: 'Pem', english: 'Myanmar; Burma', category: 'countries', tags: ['noun','country','geography','unreviewed','needs-review'], audioFile: null },
      // 'Nyij Pooj' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Nyij Pooj', below.
      { id: 'country-teb-chaws-nyij-pooj', hmongRPA: 'Teb Chaws Nyij Pooj', english: 'Japan', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
      // 'Kaus Lim' MOVED to the `ethnicities` category — it names the PEOPLE.
      // The country is 'Teb Chaws Kaus Lim', below.
      { id: 'country-teb-chaws-kaus-lim', hmongRPA: 'Teb Chaws Kaus Lim', english: 'Korea', category: 'countries', tags: ['noun','country','geography','unreviewed'], audioFile: null },
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
      { id: 'misc-nplog-teb', hmongRPA: 'Nplog teb', english: 'Laos — the short form; cf. "Teb Chaws Nplog"', category: 'countries', tags: ['country', 'place', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv tsev neeg tuaj Nplog teb.', english: 'My family came from Laos.', source: 'ai' } },
      { id: 'misc-thaib-teb', hmongRPA: 'Thaib teb', english: 'Thailand — the short form; cf. "Teb Chaws Thaib"', category: 'countries', tags: ['country', 'place', 'reading'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus ncig Thaib teb.', english: 'I want to travel around Thailand.', source: 'ai' } },
      { id: 'misc-suav-teb', hmongRPA: 'Suav teb', english: 'China — the short form; cf. "Teb Chaws Suav"', category: 'countries', tags: ['country', 'place'], audioFile: null, exampleSentence: { hmong: 'Kuv txiv tau mus Suav teb.', english: 'My father went to China.', source: 'ai' } },
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
      { id: 'eth-khej-dub', hmongRPA: 'khej dub', english: 'African; Black person', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv muaj ib tus phooj ywg khej dub.', english: 'I have a Black friend.', source: 'ai' } },
      { id: 'eth-qhab', hmongRPA: 'qhab', english: 'Native American', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws yog ib tus qhab.', english: 'He is Native American.', source: 'ai' } },
      { id: 'eth-mev', hmongRPA: 'mev', english: 'Mexican; Hispanic; Latino', category: 'ethnicities', tags: ['noun','ethnicity','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tus neeg nyob ze yog mev.', english: 'My neighbor is Mexican.', source: 'ai' } },
    ],
  },
  {
    id: 'geography',
    title: 'Geography',
    description: 'Landforms, water, and features of the map.',
    emoji: '🗺️',
    words: [
      // ── Split out of `geography-nature-weather` on 2026-09-20 ──
      { id: 'geo-cheeb-tsam', hmongRPA: 'cheeb tsam', english: 'bay; region; area; county', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cheeb tsam no muaj neeg coob heev.', english: 'This region has many people.', source: 'ai' } },
      { id: 'geo-ntug-hiav-txwv', hmongRPA: 'ntug hiav txwv', english: 'beach; seashore', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb taug kev ntawm ntug hiav txwv.', english: 'We walked along the beach.', source: 'ai' } },
      { id: 'geo-kwj-deg', hmongRPA: 'kwj deg', english: 'canal; stream', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib kwj deg hla lub zos.', english: 'A stream runs through the village.', source: 'ai' } },
      { id: 'geo-dej-huv', hmongRPA: 'dej huv', english: 'fresh water; clean water', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav tsum haus dej huv.', english: 'We should drink clean water.', source: 'ai' } },
      { id: 'geo-phab-ntug-dej-loj', hmongRPA: 'phab ntug dej loj', english: 'gulf', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub zos nyob ze phab ntug dej loj.', english: 'The village is near the gulf.', source: 'ai' } },
      { id: 'geo-pas-dej', hmongRPA: 'pas dej', english: 'gulf; lake', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam ua si ze pas dej.', english: 'The children play near the lake.', source: 'ai' } },
      { id: 'geo-hiav-txwv', hmongRPA: 'hiav txwv', english: 'ocean; sea', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb pom hiav txwv deb heev.', english: 'We can see the ocean far away.', source: 'ai' } },
      { id: 'geo-tus-dej', hmongRPA: 'tus dej', english: 'river', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus dej nyob ze.', english: 'There is a river nearby.', source: 'ai' } },
      { id: 'geo-chaw-lim-dej', hmongRPA: 'chaw lim dej', english: 'wetland; marsh; swamp', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj noog ntau hauv chaw lim dej.', english: 'Many birds live in the wetland.', source: 'ai' } },
      // ── Moved out of the misc catch-alls on 2026-09-20 ──
      { id: 'misc-toj', hmongRPA: 'toj', english: 'hill', category: 'geography', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Peb nce toj txhua tag kis.', english: 'We climb the hill every morning.', source: 'ai' } },
      { id: 'misc-hav-zoov', hmongRPA: 'hav zoov', english: 'forest', category: 'geography', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj tsiaj ntau hauv hav zoov.', english: 'There are many animals in the forest.', source: 'ai' } },
      { id: 'gen-zoov-nujtxeeg', hmongRPA: 'zoov nujtxeeg', english: 'jungle; forest', category: 'geography', tags: ['noun','nature','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv taug kev hauv zoov nujtxeeg.', english: 'They walked through the jungle.', source: 'ai' } },
      { id: 'gen-suab-puam', hmongRPA: 'suab puam', english: 'desert; barren area', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Suab puam no qhuav heev.', english: 'This desert is very dry.', source: 'ai' } },
      { id: 'gen-qabntug', hmongRPA: 'qabntug', english: 'horizon', category: 'geography', tags: ['noun','geography','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lub hnub poob dhau qabntug.', english: 'The sun sets beyond the horizon.', source: 'ai' } },
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
      { id: 'weather-pog-huab', hmongRPA: 'pog huab', english: 'fog', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tag kis no muaj pog huab heev.', english: 'There is heavy fog this morning.', source: 'ai' } },
      { id: 'weather-lawg', hmongRPA: 'lawg', english: 'hail', category: 'weather', tags: ['noun','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nag hmo muaj lawg poob ntau.', english: 'There was a lot of hail last night.', source: 'ai' } },
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
      { id: 'weather-txias', hmongRPA: 'txias', english: 'cool', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tag kis no huab cua txias.', english: 'The weather is cool this morning.', source: 'ai' } },
      { id: 'weather-kub', hmongRPA: 'kub', english: 'hot', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua kub heev.', english: 'The weather is very hot today.', source: 'ai' } },
      { id: 'weather-vaum', hmongRPA: 'vaum', english: 'humid', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua vaum heev.', english: 'The weather is very humid today.', source: 'ai' } },
      { id: 'weather-nplaum', hmongRPA: 'nplaum', english: 'sticky', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Huab cua kub thiab nplaum heev.', english: 'The hot air feels very sticky.', source: 'ai' } },
      { id: 'weather-sov', hmongRPA: 'sov', english: 'warm', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no huab cua sov heev.', english: 'The weather is very warm today.', source: 'ai' } },
      { id: 'weather-pos-huab', hmongRPA: 'pos huab', english: 'cloudy; foggy', category: 'weather', tags: ['adjective','weather','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tag kis no pos huab heev.', english: 'It is very cloudy this morning.', source: 'ai' } },
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
      { id: 'drink-kas-fes', hmongRPA: 'kas fes', english: 'coffee', category: 'drinks', tags: ['noun','drink','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv haus kas fes txhua tag kis.', english: 'I drink coffee every morning.', source: 'ai' } },
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
      { id: 'phr-tus-kws-txiav-txim', hmongRPA: 'tus kws txiav txim', english: 'a judge', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws txiav txim mloog rooj plaub.', english: 'The judge hears the case.', source: 'ai' } },
      { id: 'phr-kws-lij-choj', hmongRPA: 'kws lij choj', english: 'a lawyer, an attorney', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kws lij choj pab nws hauv tsev hais plaub.', english: 'The lawyer helps him in court.', source: 'ai' } },
      { id: 'phr-rooj-plaub', hmongRPA: 'rooj plaub', english: 'a legal case; a trial', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Rooj plaub yuav pib tag kis.', english: 'The trial will begin tomorrow.', source: 'ai' } },
      { id: 'phr-tsev-hais-plaub', hmongRPA: 'tsev hais plaub', english: 'a court, a courthouse', category: 'reading-law', tags: ['noun','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv mus rau tsev hais plaub.', english: 'They went to the courthouse.', source: 'ai' } },
      { id: 'phr-txiav-txim', hmongRPA: 'txiav txim', english: 'to decide, to judge; to pass sentence', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws txiav txim yuav txiav txim.', english: 'The judge will decide.', source: 'ai' } },
      { id: 'phr-raug-foob', hmongRPA: 'raug foob', english: 'to be charged; to be sued', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws raug foob vim ua txhaum cai.', english: 'He was charged with breaking the law.', source: 'ai' } },
      { id: 'phr-raug-ntes', hmongRPA: 'raug ntes', english: 'to be arrested, to be caught', category: 'reading-law', tags: ['verb','law','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Tus tub sab raug ntes nag hmo.', english: 'The thief was arrested last night.', source: 'ai' } },
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
      { id: 'phr-kws-kho-mob', hmongRPA: 'kws kho mob', english: 'a doctor', category: 'reading-body', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kws kho mob saib kuv hnub no.', english: 'The doctor examined me today.', source: 'ai' } },
      { id: 'phr-hauv-paus', hmongRPA: 'hauv paus', english: 'the base, the foot of something', category: 'reading-body', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws zaum ntawm hauv paus ntoo.', english: 'He sat at the base of the tree.', source: 'ai' } },
      { id: 'phr-mob-siab', hmongRPA: 'mob siab', english: 'grief; to be heartsick', category: 'reading-body', tags: ['noun','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws mob siab tom qab poob nws txiv.', english: 'She grieved after losing her father.', source: 'ai' } },
      { id: 'phr-rov-qab', hmongRPA: 'rov qab', english: 'back; to return, to go back', category: 'reading-body', tags: ['adverb','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Peb yuav rov qab los tag kis.', english: 'We will come back tomorrow.', source: 'ai' } },
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
      { id: 'misc-dab', hmongRPA: 'dab', english: 'spirit; ghost; supernatural being (noun) · dab tsi = what; anything (compound interrogative expression) — ⚠ “what” is not a standalone sense of dab', category: 'reading-body', tags: ['bound', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Lawv hais tias muaj dab hauv tsev.', english: 'They say there is a ghost in the house.', source: 'ai' } },
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
      {id: 'phr-chim', hmongRPA: 'chim', english: 'anger; be angry (noun / stative verb) · inner feeling; disposition in compounds (noun)', category: 'reading-emotion', tags: ['verb', 'reading', 'unreviewed', 'needs-source-review'], audioFile: null, exampleSentence: { hmong: 'Kuv chim thaum hnov cov lus ntawd.', english: 'I got angry when I heard those words.', source: 'ai' } },
      {id: 'phr-chim-siab', hmongRPA: 'chim siab', english: 'to be angry, to be upset; bitter, wrathful, resentful, hateful', category: 'reading-emotion', tags: ['adjective','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws chim siab vim raug thuam.', english: 'She was upset because she was mocked.', source: 'ai' } },
      { id: 'phr-lom-zem', hmongRPA: 'lom zem', english: 'fun, funny, enjoyable', category: 'reading-emotion', tags: ['adjective','reading','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Hnub no peb lom zem heev.', english: 'We had a lot of fun today.', source: 'ai' } },
      // The author's own glossary for the story they wrote, plus the two single
      // words the Speak lessons already gloss. NOT tagged `unreviewed`: that tag
      // means nobody fluent has checked the gloss, and here somebody fluent
      // wrote it.
      { id: 'misc-npau-taws', hmongRPA: 'npau taws', english: 'anger, angry; metaphorical description of "boiling over" like fire or hot liquid, leading to anger or emotional instability · provocation (in certain circumstances)', category: 'reading-emotion', tags: ['reading'], audioFile: null, exampleSentence: { hmong: 'Nws npau taws thaum hnov xov ntawd.', english: 'He became angry when he heard that news.', source: 'ai' } },
      { id: 'misc-kaj', hmongRPA: 'kaj', english: 'bright, light; in "kaj siab", content', category: 'reading-emotion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Lub hnub kaj heev hnub no.', english: 'The sun is very bright today.', source: 'ai' } },
      { id: 'misc-tu', hmongRPA: 'tu', english: 'to care for; to break off, to cease; in "tu siab", sad', category: 'reading-emotion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Nws tu siab tom qab hnov xov ntawd.', english: 'She was sad after hearing that news.', source: 'ai' } },
      { id: 'misc-luab-lim', hmongRPA: 'luab lim', english: 'to tease, to mock, to make fun of', category: 'reading-emotion', tags: ['phrase', 'reading'], audioFile: null, exampleSentence: { hmong: 'Tsis txhob luab lim koj tus phooj ywg.', english: 'Do not make fun of your friend.', source: 'ai' } },
      { id: 'misc-hlub', hmongRPA: 'hlub', english: 'to love', category: 'reading-emotion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv hlub kuv tsev neeg heev.', english: 'I love my family very much.', source: 'ai' } },
      { id: 'misc-khiav', hmongRPA: 'khiav', english: 'run · operate; function — of a machine or process · flee; escape', category: 'reading-emotion', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus menyuam khiav mus tom tsev.', english: 'The child ran home.', source: 'ai' } },
      { id: 'misc-ntshai', hmongRPA: 'ntshai', english: 'fear; be afraid · frightening; scary — in "txaus ntshai"', category: 'reading-emotion', tags: ['verb', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv ntshai thaum tsaus ntuj.', english: 'I am afraid at night.', source: 'ai' } },
      { id: 'gen-dai-siab', hmongRPA: 'dai siab', english: 'to miss dearly', category: 'reading-emotion', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv dai siab kuv niam thaum nws mus lawm.', english: 'I miss my mother dearly when she is away.', source: 'ai' } },
      { id: 'gen-peem', hmongRPA: 'peem', english: 'to endure', category: 'reading-emotion', tags: ['verb','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws peem dhau lub sijhawm nyuaj.', english: 'She endured the difficult period.', source: 'ai' } },
      { id: 'gen-xijpeem', hmongRPA: 'xijpeem', english: 'do not stress about it', category: 'reading-emotion', tags: ['phrase','everyday','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Xijpeem, peb yuav nrhiav kev daws.', english: "Don't stress; we will find a solution.", source: 'ai' } },
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
      { id: 'misc-dua', hmongRPA: 'dua', english: 'again; another time · more; additional · pass; go past · than — comparative marker', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv yuav sim dua tag kis.', english: 'I will try again tomorrow.', source: 'ai' } },
      { id: 'misc-poob', hmongRPA: 'poob', english: 'fall; drop · lose; misplace · fail; be defeated', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv poob kuv tus yuam sij lawm.', english: 'I lost my key.', source: 'ai' } },
      { id: 'misc-puag', hmongRPA: 'puag', english: 'to hug, to hold; also far over, away', category: 'reading-motion', tags: ['draft', 'unreviewed', 'reading'], audioFile: null, exampleSentence: { hmong: 'Niam puag tus menyuam pw.', english: 'Mother holds the sleeping child.', source: 'ai' } },
      { id: 'misc-tawm', hmongRPA: 'tawm', english: 'go out; come out; exit · leave; depart · appear; come out; be released', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Peb tawm hauv tsev thaum sawv ntxov.', english: 'We leave the house in the morning.', source: 'ai' } },
      { id: 'misc-tua', hmongRPA: 'tua', english: 'kill (transitive verb) · shoot; fire a gun (transitive verb) · turn off; extinguish (transitive verb) · beat; strike an instrument (transitive verb)', category: 'reading-motion', tags: ['reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Kuv tua lub teeb ua ntej pw.', english: 'I turn off the light before sleeping.', source: 'ai' } },
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
      { id: 'misc-kawm-ntawv', hmongRPA: 'kawm ntawv', english: 'to study; to go to school', category: 'reading-motion', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
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
      { id: 'misc-nqes', hmongRPA: 'nqes', english: 'to descend, to go down', category: 'reading-motion', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
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
      { id: 'misc-txaus', hmongRPA: 'txaus', english: 'enough; sufficient · reach; arrive at · enough to cause — resultative, as in "txaus ntshai"', category: 'reading-motion', tags: ['adjective', 'reading', 'reviewed'], audioFile: null },
      { id: 'gen-dauv', hmongRPA: 'dauv', english: 'to hang; to dip down; to look down upon; to sham', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-fee', hmongRPA: 'fee', english: 'to turn aside; to look aside; to ignore', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-maub', hmongRPA: 'maub', english: 'to go or act without seeing', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-raus', hmongRPA: 'raus', english: 'to dip into; to participate', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-rawm', hmongRPA: 'rawm', english: 'to be in a rush', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-tauv-pem', hmongRPA: 'tauv pem', english: 'to visit; to hang out with friends and family', category: 'reading-motion', tags: ['verb','social','unreviewed'], audioFile: null },
      { id: 'gen-xabnagkis', hmongRPA: 'xabnagkis', english: 'days ahead; days to come', category: 'reading-motion', tags: ['noun','time','unreviewed'], audioFile: null },
      { id: 'gen-yais', hmongRPA: 'yais', english: 'to distribute; to pass out', category: 'reading-motion', tags: ['verb','everyday','unreviewed'], audioFile: null },
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
      { id: 'misc-neeg', hmongRPA: 'neeg', english: 'person; human being · people — collectively', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj neeg coob hauv lub khw.', english: 'There are many people in the store.', source: 'ai' } },
      { id: 'misc-menyuam', hmongRPA: 'menyuam', english: 'child; baby; offspring (noun) · children; young people (collective noun) · menyuam yaus = children; young ones (compound noun)', category: 'reading-people', tags: ['noun', 'family', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam ua si tom tsev.', english: 'The children are playing at home.', source: 'ai' } },
      { id: 'misc-kws', hmongRPA: 'kws', english: 'expert; skilled person; specialist · professional practitioner — in compounds', category: 'reading-people', tags: ['noun', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Tus kws kho mob pab nws.', english: 'The doctor helped him.', source: 'ai' } },
      { id: 'misc-yaus', hmongRPA: 'yaus', english: 'young; small; immature (adjective) · menyuam yaus = children; young ones (compound noun)', category: 'reading-people', tags: ['bound', 'reading', 'reviewed'], audioFile: null, exampleSentence: { hmong: 'Cov menyuam yaus ua si nraum zoov.', english: 'The young children play outside.', source: 'ai' } },
      { id: 'gen-mab', hmongRPA: 'mab', english: 'non-Hmong person; non-Hmong people', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Muaj ib tus mab nyob ze peb.', english: 'A non-Hmong person lives near us.', source: 'ai' } },
      { id: 'gen-pejxeem', hmongRPA: 'pejxeem', english: 'citizens; the public; people', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Pejxeem tuaj sib tham ntawm no.', english: 'The public came to discuss things here.', source: 'ai' } },
      { id: 'gen-xeebceem', hmongRPA: 'xeebceem', english: 'personality', category: 'reading-people', tags: ['noun','people','unreviewed'], audioFile: null, exampleSentence: { hmong: 'Nws muaj xeebceem zoo heev.', english: 'She has a very good personality.', source: 'ai' } },
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
      { id: 'misc-teb-chaws', hmongRPA: 'teb chaws', english: 'a country, a nation', category: 'reading-place', tags: ['noun', 'place'], audioFile: null, exampleSentence: { hmong: 'Kuv xav mus txawv teb chaws.', english: 'I want to travel abroad.', source: 'ai' } },
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
      { id: 'misc-xyoos', hmongRPA: 'xyoos', english: 'year · years old — after a number, to state age', category: 'reading-time', tags: ['noun', 'time', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-thawj', hmongRPA: 'thawj', english: 'first — before all others in time, sequence or rank · main; principal; chief · reason; cause — ONLY as part of "laj thawj"', category: 'reading-time', tags: ['bound', 'reading', 'reviewed'], audioFile: null },
      { id: 'misc-txij', hmongRPA: 'txij', english: 'from, since — "txij thaum", ever since', category: 'reading-time', tags: ['particle','reading','unreviewed'], audioFile: null },
      { id: 'misc-thiaj', hmongRPA: 'thiaj', english: 'therefore; so; thus · only then; then finally', category: 'reading-time', tags: ['particle', 'reading', 'reviewed'], audioFile: null },
      { id: 'gen-kawj', hmongRPA: 'kawj', english: 'to start', category: 'reading-time', tags: ['verb','everyday','unreviewed'], audioFile: null },
      { id: 'gen-nim-no', hmongRPA: 'nim no', english: 'nowadays', category: 'reading-time', tags: ['noun','time','unreviewed'], audioFile: null },
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
      { id: 'misc-tsoo', hmongRPA: 'tsoo', english: 'to strike, to smash into, to collide with', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-plam', hmongRPA: 'plam', english: 'to lose, to be deprived of', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-txais', hmongRPA: 'txais', english: 'to receive, to accept', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-pub', hmongRPA: 'pub', english: 'to allow, to let — "txwv tsis pub", would not let', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-ceev-faj', hmongRPA: 'ceev faj', english: 'to be careful, to watch out', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-laj-thawj', hmongRPA: 'laj thawj', english: 'a reason, a cause', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-cwj-pwm', hmongRPA: 'cwj pwm', english: 'character; behaviour', category: 'reading-general', tags: ['noun', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tab-meeg', hmongRPA: 'tab meeg', english: 'openly, in front of everyone', category: 'reading-general', tags: ['adverb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tsim-nyog', hmongRPA: 'tsim nyog', english: 'to deserve; to be fitting', category: 'reading-general', tags: ['phrase', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tshwm-sim', hmongRPA: 'tshwm sim', english: 'to happen, to occur', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
      { id: 'misc-tiv-thaiv', hmongRPA: 'tiv thaiv', english: 'to defend; a defence', category: 'reading-general', tags: ['verb', 'reading', 'unreviewed'], audioFile: null },
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
      { id: 'gen-haub', hmongRPA: 'haub', english: 'to entice; to lure; to persuade', category: 'reading-general', tags: ['verb','everyday','unreviewed'], audioFile: null },
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
    ],
  },
]

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

const CATEGORY_THEMES = [
  {
    id: 'people',
    title: 'People & Family',
    emoji: '👪',
    blurb: 'Kinship terms — which change depending on who is speaking.',
    ids: ['family-male-perspective', 'family-female-perspective', 'relatives'],
  },
  {
    id: 'home',
    title: 'Home & Places',
    emoji: '🏠',
    blurb: 'The house, what is in it, and where things are.',
    ids: [
      'household-rooms', 'housing', 'buildings',
      'tools-household', 'places', 'locations-prepositions', 'directions',
    ],
  },
  {
    id: 'living-world',
    title: 'Nature & Food',
    emoji: '🌿',
    blurb: 'Animals, the natural world, and what is on the table.',
    ids: [
      'animals', 'botany', 'nature', 'geography', 'weather',
      'food', 'drinks', 'cooking', 'agriculture-foodstuffs',
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing',
    emoji: '👕',
    blurb: 'What you wear — and the verbs Hmong uses for wearing it.',
    // 'clothing' (the noun list) was unassigned and fell into the "More" bucket
    // with the anatomy categories. It's garments, not body parts — it belongs
    // here, nouns first, then the wearing verbs.
    ids: ['clothing', 'wear-verbs', 'clothing-verbs'],
  },
  {
    id: 'time-numbers',
    title: 'Time, Numbers & Money',
    emoji: '🕐',
    blurb: 'Counting, the calendar, and buying things.',
    ids: [
      'numbers', 'quantifiers', 'timeframes', 'timeframes-days', 'time-context',
      'days-of-week', 'months', 'calendar', 'money', 'seasons-time',
    ],
  },
  {
    id: 'describing',
    title: 'Describing',
    emoji: '🎨',
    blurb: 'Colors, qualities, and the "siab" expressions for character and feeling.',
    ids: ['colors', 'descriptions', 'personality-siab'],
  },
  {
    id: 'grammar-words',
    title: 'Grammar & Function Words',
    emoji: '🔤',
    blurb: 'The small words that hold sentences together. Each has a lesson.',
    ids: [
      'pronouns', 'demonstratives', 'classifiers', 'verbs',
      'tense-markers', 'question-words', 'reciprocals', 'yog-to-be', 'grammar',
    ],
  },
  {
    id: 'everyday',
    title: 'Everyday Speech',
    emoji: '💬',
    blurb: 'Phrases you say out loud — greetings, thanks, introductions.',
    ids: [
      'greetings', 'politeness', 'introductions', 'daily-life',
      'discourse-particles', 'conjunctions', 'chores',
    ],
  },
  {
    id: 'culture-world',
    title: 'Culture & the Wider World',
    emoji: '🌍',
    blurb: 'Art and story, places beyond here, and how you get to them.',
    ids: ['arts-culture', 'war-conflict', 'countries', 'ethnicities', 'vehicles-travel'],
  },
  {
    // ⚠️ THESE ARE THE OLD `misc` PILE, SORTED — 2026-09-20. They are themed
    // deliberately, unlike `misc` itself: the whole reason to split 300 words by
    // subject is so someone can find one. `misc`, `misc-phrases` and
    // `general-vocabulary` stay OUT of the themes and stay in "More".
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
  {
    id: 'body',
    title: 'The Body',
    emoji: '🫀',
    blurb: 'Head to foot, inside and out — and the compounds Hmong builds them from.',
    ids: [
      'human-anatomy-face', 'human-anatomy-upper-body',
      'human-anatomy-lower-body', 'human-anatomy-internal-organs',
      'body-health',
    ],
  },
]

// Resolve ids → category objects, drop ids that don't exist, and sweep any
// category nobody assigned into a final "More" group so it stays reachable.
const themed = CATEGORY_THEMES.map((t) => ({
  ...t,
  items: t.ids.map((id) => categories.find((c) => c.id === id)).filter(Boolean),
})).filter((t) => t.items.length > 0)

const assigned = new Set(themed.flatMap((t) => t.items.map((c) => c.id)))
const leftovers = categories.filter((c) => !assigned.has(c.id))

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

export function getCategoryGroup(id) {
  return categoryGroups.find((g) => g.id === id)
}
