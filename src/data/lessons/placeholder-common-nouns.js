// Placeholder lesson, moved out of placeholders.js on 2026-10-21.
//
// Author: *"move the placeholders into the main lessons"* — every other lesson is
// its own file in this directory, and six of them sharing one file meant the
// author could not find them where they expected (the same thing that happened
// with muaj.js the same day).
//
// ⚠️ THE IDS DID NOT CHANGE. `placeholder-common-nouns` and its step ids are
// PROGRESS KEYS — `completedSteps` and `quizScores` are stored against them —
// and they date from 2026-09-28, so renaming them would silently reset anyone
// who has worked through this lesson. Only the file moved.
//
// PLACEHOLDER LESSONS — 2026-09-28 (author: "add placeholder learning for everything else, but if
// it's placeholder indicate it, color code it or something"). One short lesson for each path unit
// that had none, so every unit has something to read. `placeholder: true` shows an orange
// "Placeholder" badge on the lesson card, the unit's lesson preview and the lesson screen.
// 
// Built only from rules the author has settled and sentences already reviewed in this app
// (the path-sentence reviews, the cards, the Describing Words lesson). Replace each with a
// full lesson when it is written, and delete `placeholder: true`.


export const commonNounsPlaceholder = {
  id: 'placeholder-common-nouns',
  placeholder: true,
  title: 'Common Nouns | Neeg, Tsev, Ntawv',
  summary: 'Everyday nouns, and the classifier each one takes.',
  vocab: 'common-nouns',
  steps: [
    {
      id: 'placeholder-common-nouns-intro',
      kind: 'intro',
      title: 'Every noun has its classifier',
      body: [
        'Each noun here was chosen for the classifier it takes. Learn the noun WITH its classifier, the way you would learn a word with its gender in other languages: ib lub tsev, not just tsev.',
        '## People and animals: tus, leej',
        '> ib leej neeg — a person',
        '> ob tus menyuam — two children',
        '> ib tus aub — a dog',
        '## Solid, whole things: lub',
        '> ib lub tsev — a house',
        '> ib lub tsheb — a car',
        '> ib lub rooj — a table',
        '## Paper: the classifier changes what it is',
        '> ib phau ntawv — a book',
        '> ib daim ntawv — a sheet of paper',
        '> ib nplooj ntawv — a page',
        '## Tools, roads, plants, stones',
        '> ib rab riam — a knife',
        '> ib txoj kev — a road',
        '> ib tsob ntoo — a tree',
        '> ib pob zeb — a stone',
        '## Pairs, cups, bags, chunks',
        '> ib txhais tes — one hand',
        '> ib nkawm khau — a pair of shoes',
        '> ib khob dej — a cup of water',
        '> ib hnab nplej — a bag of rice',
        '> ib thooj nqaij — a chunk of meat',
        '## Households and stories',
        '> ib yim neeg — a household',
        '> ib zaj dab neeg — a story',
        'More on classifiers: the Classifiers lesson, just before this unit.',
      ],
    },
    { id: 'placeholder-common-nouns-quiz', kind: 'quiz', title: 'Learn the words' },
  ],
}

// ⚠️ THE MUAJ PLACEHOLDER MOVED OUT 2026-10-21, to src/data/lessons/muaj.js.
// It belongs beside its three siblings (yog-to-be.js, hu-ua.js, nyob.js), each
// of which is its own file, because that is the file the real lesson gets
// written into. It keeps `placeholder: true` until then.
