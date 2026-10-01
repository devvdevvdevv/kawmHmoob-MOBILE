// Standalone lesson: NOUNS BY PURPOSE — noun + a given verb says what the thing is for.
// Written 2026-09-28 for path unit u-noun-purpose — the author: "There are given verbs and
// follow nouns that clarify what a noun is used for … phau ntawv = book, phau ntawv nyeem =
// novel, phau ntawv kawm = text book … Lub rooj noj mov = dining table = this one is special
// because it's a noun with a given verb that is an action verb." And: given verbs are used
// to tell apart nouns that share the same root; they are not always said, and are often
// implied when the context is clear — used mostly when you need to be specific.
// The author's examples: phau ntawv nyeem / kawm, lub rooj noj mov, and the two knives
// (typed "ram riab txim zaum / nqaij" → rab riam txiav zaub / nqaij — txiav confirmed by the author 2026-09-28). The rest — lub rooj
// sau ntawv, chav ua noj, chav da dej, dej haus, lub txaj pw — are Claude's, TODO-VERIFY;
// tsev noj mov / kho mob / kawm ntawv and chav pw were already in the dictionary.

export const nounPurpose = {
  id: 'grammar-noun-purpose',
  title: 'Nouns by Purpose | Phau Ntawv Nyeem',
  summary: 'Book, textbook, novel: a verb after the noun says what it is for.',
  vocab: 'noun-purpose',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-noun-purpose-intro',
      kind: 'intro',
      title: 'A verb that says what it is for',
      body: [
        'Many Hmong nouns share one root. Phau ntawv is a book — any book. To say WHICH book, Hmong puts a verb after the noun that says what the thing is used for:',
        '> phau ntawv — a book',
        '> phau ntawv nyeem — a novel, a book for reading (nyeem = read)',
        '> phau ntawv kawm — a textbook, a book for studying (kawm = study)',
        'Word for word: “book read”, “book study”. The noun comes first and the verb follows it.',
        '## Used to tell things apart',
        'These given verbs are not always said. When the context is clear, the verb is left out and simply understood: at the dinner table, rab riam is just the knife. They are used mostly to tell apart things that share the same root, so the listener knows exactly which one you mean.',
        '> rab riam txiav zaub — a knife for cutting vegetables',
        '> rab riam txiav nqaij — a knife for cutting meat',
        '## The classifier stays with the noun',
        'The classifier belongs to the main noun, so it comes first, just as it would without the verb:',
        '> lub rooj → lub rooj noj mov (a dining table)',
        '> rab riam → rab riam txiav nqaij (a meat knife)',
        '## A noun with a verb + noun pair',
        'Lub rooj noj mov (a dining table) is special. Its given verb is a whole verb + noun pair, noj mov (to eat a meal), so the table is named after the activity it is for. Many everyday places work the same way:',
        '> lub rooj noj mov — a dining table (table + eat a meal)',
        '> lub rooj sau ntawv — a writing desk (table + write)',
        '> tsev noj mov — a restaurant (house + eat a meal)',
        '> tsev kawm ntawv — a school (house + study)',
        '> tsev kho mob — a hospital (house + treat illness)',
        // The author, 2026-09-28: buildings and occupations use this formula the most.
        '## Buildings and jobs use it most',
        'You will meet this pattern most in the names of buildings and places, and in the names of jobs. A job is usually kws (expert) + what the person does, so the same verb can name the place and the person:',
        '> tsev kho mob — a hospital (house + treat illness)',
        '> kws kho mob — a doctor (expert + treat illness)',
        '> tsev kawm ntawv — a school · kws qhia ntawv — a teacher (expert + teach)',
        '> tus kws txiav txim — a judge (expert + decide a case)',
        '> tus tsav tsheb — a driver (person + drive a vehicle)',
        '## Same root, different job',
        '> chav pw — a bedroom (room + sleep)',
        '> chav ua noj — a kitchen (room + cook)',
        '> chav da dej — a bathroom (room + bathe)',
        '> dej haus — drinking water (water + drink)',
        '> lub txaj pw — a bed (bed + sleep)',
        '## An easy way to remember',
        '> classifier + noun + verb → the noun, used for that (phau ntawv kawm)',
        '> leave the verb out when it is obvious; say it when you need to be specific',
      ],
    },
    {
      id: 'grammar-noun-purpose-examples',
      kind: 'examples',
      title: 'Which one?',
      intro: 'Same root, different verb. Read each one aloud.',
      items: [
        { hmong: 'Phau ntawv nyeem', english: 'a novel', note: 'book + read' },
        { hmong: 'Phau ntawv kawm', english: 'a textbook', note: 'book + study' },
        { hmong: 'Rab riam txiav zaub', english: 'a vegetable knife', note: 'knife + cut vegetables' },
        { hmong: 'Rab riam txiav nqaij', english: 'a meat knife', note: 'knife + cut meat' },
        { hmong: 'Lub rooj noj mov', english: 'a dining table', note: 'table + eat a meal' },
        { hmong: 'Lub rooj sau ntawv', english: 'a writing desk', note: 'table + write' },
        { hmong: 'Tsev noj mov', english: 'a restaurant' },
        { hmong: 'Tsev kho mob', english: 'a hospital' },
        { hmong: 'Chav pw', english: 'a bedroom' },
        { hmong: 'Chav ua noj', english: 'a kitchen' },
      ],
    },
    {
      id: 'grammar-noun-purpose-check',
      kind: 'practice',
      title: 'Which book?',
      prompt: 'Which one is a textbook?',
      options: ['Phau ntawv kawm', 'Phau ntawv nyeem', 'Phau ntawv', 'Nyeem ntawv'],
      answer: 'Phau ntawv kawm',
    },
    {
      id: 'grammar-noun-purpose-check-knife',
      kind: 'practice',
      title: 'Which knife?',
      prompt: 'You are cutting meat. Which knife do you ask for?',
      options: ['Rab riam txiav nqaij', 'Rab riam txiav zaub', 'Lub rooj noj mov', 'Txiav nqaij rab riam'],
      answer: 'Rab riam txiav nqaij',
    },
    {
      id: 'grammar-noun-purpose-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
