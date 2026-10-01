// Standalone lesson: Hmong noun classifiers (measure words).
// Content filled 2026-07-16 (Slice A pass) — audio still pending, see
// instructions/audio-files.md. Follows the lesson model in ../lessons.js.

export const nounClassifiers = {
  id: 'foundations-noun-classifiers',
  title: 'Noun Classifiers',
  summary: 'The measure words Hmong uses to count and specify nouns.',
  vocab: 'classifiers',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-noun-classifiers-intro',
      kind: 'intro',
      title: 'How noun classifiers work',
      body: [
        'Hmong uses classifiers (measure words) before nouns when counting or pointing something out. The right classifier depends on the kind of thing — people, animals, long objects, flat objects, and so on.',
        // SOURCE (2026-09-26): Bisang 1993, "Classifiers, Quantifiers and Class
        // Nouns in Hmong", Studies in Language 17(1):1–51 — classifiers mark
        // individualization, possession and reference (definiteness), not just
        // counting. See notes/2026-09-26-reference-bisang-1993-classifiers.md.
        // ⚠️ ADDED 2026-09-25 at the author's request — the one thing a learner
        // must not miss. The paragraph above makes classifiers sound occasional
        // ("when counting or pointing"); in correct Hmong they are the norm.
        // IntroBody renders '## ' as a subheading, which is the strongest
        // emphasis it has. This intro also shows on the Classifiers path unit.
        '## Important: most nouns come with a classifier',
        'In grammatically correct Hmong — written or spoken — the majority of nouns have a classifier in front of them that defines the noun. It is not an extra for counting; it is how a noun is normally said. Leaving it out is one of the most common beginner mistakes.',
        '> Tus aub — the dog · Lub tsev — the house · Daim ntawv — the paper',
        'So when you learn a new noun, learn it with its classifier, the way it is really used.',
        // ── ADDED 2026-09-26 from Bisang (1993), "Classifiers, Quantifiers and
        // Class Nouns in Hmong", Studies in Language 17(1): the four jobs (§1.2,
        // §4, §5) and the omission rule (§5, ex. 52). Examples are the paper's own
        // (it cites Mottin 1978 and Bertrais-Charrier 1979), not invented.
        '## The four jobs of a classifier',
        'A classifier is not only for counting. In Hmong it does four things:',
        '> Count — ib tus aub (one dog)',
        '> Own — nws rab riam (his knife): the classifier sits between owner and thing',
        '> Point — tus aub no (this dog)',
        '> "The" — tus aub on its own often means "the dog", a specific one',
        '## When the classifier is left out',
        // Was: '… kuv txiv (my father), kuv niam (my mother), koj npe (your name). Body parts are the
        // exception — they usually keep it: kuv lub siab.' — "koj npe" came from Bisang (1993). The
        // author, 2026-09-28: npe NEEDS its classifier — koj lub npe, as the Hu Ua lesson teaches.
        'With family, the classifier can be dropped: kuv txiv (my father), kuv niam (my mother). Body parts usually keep it (kuv lub siab), and so does a name: always lub npe, as in koj lub npe (your name), never koj npe.',
        'The pattern is number (or possessor) + classifier + noun:',
        '> Ib tus aub. — One [animal-classifier] dog.',
        'Choosing the right classifier takes practice, but "tus" and "lub" cover a large share of everyday nouns, so start there.',
        // The author, 2026-09-27.
        '## Asking which: classifier + twg',
        'To ask which one, add twg (which) to the classifier of the noun you mean. Because the classifier follows the noun, so does the question word:',
        '> Koj tus phooj ywg yog tus twg? — Which one is your friend?',
        '> Nkawd yog leej twg? — Who are those two?',
        '> Cov khoom nyob qhov twg? — Where are the things?',
      ],
    },
    {
      id: 'foundations-noun-classifiers-examples',
      kind: 'examples',
      title: 'Common classifiers',
      intro: 'Read each classifier aloud with the kind of noun it pairs with.',
      items: [
        // ⚠️ TUS AND LUB WIDENED 2026-09-26 from Bisang (1993), Appendix I (citing
        // Mottin 1978). Was: Tus 'for people and animals'; Lub 'for round / 3-D
        // objects' — both true but too narrow: tus also takes long things and long
        // body parts, lub takes vehicles, buildings and many abstract nouns.
        { hmong: 'Tus', audio: 'grammar/classifiers/hmong-classifiers-tus.mp3', english: 'for people, animals — and long things', note: '"Tus aub" = the dog; "tus choj" = the bridge; "tus mem" = the pen; "tus hniav" = a tooth.' },
        { hmong: 'Lub', audio: 'grammar/classifiers/hmong-classifiers-lub.mp3', english: 'for round / 3-D things, vehicles, buildings — and many abstract things', note: '"Lub tsev" = the house; "lub tsheb" = the car; "lub npe" = the name; "lub neej" = life.' },
        // ADDED 2026-09-26 (Bisang 1993, Appendix I): the two classifiers the table
        // never taught. Audio is the same clip the classifiers word set already plays.
        { hmong: 'Leej', audio: 'grammar/classifiers/hmong-classifiers-leej.mp3', english: 'for people — more explicit than tus', note: '"Leej twg?" = who?; "leej txiv" = father, but "tus txiv" = husband.' },
        { hmong: 'Txhais', audio: 'grammar/classifiers/hmong-classifiers-txhais.mp3', english: 'for one of a pair', note: '"Txhais tes" = a hand; "txhais npab" = an arm; "txhais ko taw" = a foot.' },
        { hmong: 'Daim', audio: 'grammar/classifiers/hmong-classifiers-daim.mp3', english: 'for flat objects', note: '"Daim ntawv" = the paper / sheet.' },
        { hmong: 'Txoj', audio: 'grammar/classifiers/hmong-classifiers-txoj.mp3', english: 'for long, winding things', note: '"Txoj kev" = the road — also used for abstract things like "txoj sia" (life).' },
        { hmong: 'Rab', audio: 'grammar/classifiers/hmong-classifiers-rab.mp3', english: 'for tools / weapons', note: '"Rab riam" = the knife.' },
        { hmong: 'Phau', audio: 'grammar/classifiers/hmong-classifiers-phau.mp3', english: 'for books', note: '"Phau ntawv" = the book (a bound stack of paper).' },
      ],
    },
    {
      id: 'foundations-noun-classifiers-quiz',
      kind: 'quiz',
      title: 'Learn the classifiers',
    },
  ],
}
