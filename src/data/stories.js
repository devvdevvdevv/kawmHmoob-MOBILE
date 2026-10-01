// READING LIBRARY — the stories, and the genres they sit in.
//
// Moved here from src/lib/readings.js and renamed on 2026-09-04:
//   • src/lib/ is LOGIC (yin.js, toneScore.js, sentenceBuilder.js).
//     src/data/ is DATA. This is data.
//   • `readings` was already taken TWICE — src/data/course.js exports one
//     (GlobalSearch imports it) and lessons.js has a `readings` unit. A third
//     would be three different things answering to one name.
//
// Build guide: learning/reading/01-the-library-guide.md
//
// ⚠️ ADDING A STORY SHOULD TOUCH THIS FILE AND NOTHING ELSE. If a new story
// needs a .jsx edit to appear, the shape is wrong — see Decision 1 in the guide.

// ── Genres ──────────────────────────────────────────────────────────────────
// The ONLY hand-written list here, and only because array order and display
// titles cannot be derived. MEMBERSHIP is derived: a genre's stories are
// whichever stories claim its id, so writing a story is the only thing that
// puts content on a shelf.
//
// ⚠️ Every `story.genre` must match an id below, and a genre with no stories
// should not render a shelf. Both belong in scripts/check-reading.mjs.
// `cover` is the shelf's colour — a NativeWind background class used for every
// story cover in that genre. It is the cheapest way to make 25 stories scannable
// without a single piece of artwork: horror reads dark and cold, everyday life
// warm, and you know which shelf you are on before you read a word.
//
// ⚠️ Keep it a full static class string ('bg-stone-800'), never built by
// interpolation. NativeWind compiles the classes it can SEE in source; a name
// assembled at runtime is invisible to it and silently renders unstyled.
// ⚠️ READING IS OPEN TO EVERYONE — decided 2026-09-15. Every shelf carries
// `free: true`.
//
// The mechanism is unchanged and still works: a genre WITHOUT `free` is Pro,
// one word per shelf rather than a tier field on every story. Removing the flag
// from a shelf closes it again, and nothing else has to move.
//
// The `history` shelf was the reason this came up. It carries the Zong Vang
// account — a community memorial, told with the family's testimony — and that
// sitting behind $7.99 was always a judgement to make deliberately rather than
// inherit from a default. It is made: it is free, along with everything else.
export const GENRES = [
  { id: 'life', title: 'Everyday life', blurb: 'Ordinary moments, ordinary words.', cover: 'bg-clay-600', free: true },
  { id: 'horror', title: 'Horror', blurb: 'Dab neeg txaus ntshai — read with the lights on.', cover: 'bg-stone-800', free: true },
  { id: 'folk', title: 'Folk tales', blurb: 'Dab neeg qub — stories handed down.', cover: 'bg-ocean-700', free: true },
  { id: 'history', title: 'True accounts', blurb: 'Dab neeg tseeb — real people, real events.', cover: 'bg-stone-700', free: true },
  // Was cover: 'bg-black-700' — no `black` scale exists in tailwind.config.js, so
  // it generated no class and the covers rendered colourless (check-theme,
  // 2026-09-25). stone-900 is the darkest step that exists and inverts per theme.
  { id: 'true crime', title: 'Hmong True Crime Stories', blurb: 'True Crime Stories from Hmong People.', cover: 'bg-stone-900', free: true},
  {id : 'society', title: 'Society', blurb: 'Stories about society and culture.', cover: 'bg-emerald-700', free: true},
]





/**
 * The progress key for one story.
 *
 * ⚠️ Keyed on the story ID, never its position — inserting a story renumbers
 * positions and would silently reassign everyone's history to the wrong story.
 * Mirrors speakStepId() in speak.js.
 */
// ⚠️ STORIES ARE PRO, PER STORY — 2026-09-28 (author: "paywall on every story except ntxawm's lock
// and the cat"). The genre `free:` flags above still open the SHELVES; this decides each story.
// A story with a `warning` (Zong Vang) opens to its warning, then walls inside (story screen).
export const FREE_STORY_IDS = new Set(['story-ntxawm-lub-xauv', 'story-tus-miv-tus-nas'])
export function isStoryFree(story) {
  return Boolean(story) && FREE_STORY_IDS.has(story.id)
}

export function storyStepId(storyId) {
  return `reading-${storyId}`
}

// ⚠️ PLACEHOLDER STORIES — SEEDED 2026-09-08, NOT SHIPPABLE CONTENT.
//
// Every story below carrying `placeholder: true` exists so the library, the
// reader and the quiz can be seen working with a real amount of content in
// them. One story on one shelf demonstrates none of the things this module was
// built to do: shelves that scroll, covers that scan, a Pro shelf beside a free
// one, genres that stack.
//
// ⚠️ THE HMONG IN THEM NEEDS A NATIVE REVIEW BEFORE RELEASE. The sentences are
// deliberately short and built from words already in src/data/vocabulary.js, so
// long-press lookup resolves rather than returning "no entry yet" — but written
// correctly is not the same as written well, and a language app cannot ship
// prose nobody fluent has read.
//
// TO FIND THEM: grep for `placeholder: true`. To remove them all, delete the
// objects carrying that flag — nothing else references them, because
// membership is derived (see the genre notes above).
export const stories = [
  // ══════════════════════════════════════════════════════════════════════════
  // NTXAWM LUB XAUV — added 2026-09-12. The first story written FOR this app by
  // the author rather than seeded as a placeholder, and the only one currently
  // shipping: everything below it is commented out.
  //
  // ⚠️ WHAT CAME FROM THE AUTHOR, VERBATIM: every line of Hmong, the nine
  // glossary entries, and the ten comprehension questions (as Hmong prompts).
  //
  // ⚠️ WHAT IS A DRAFT AND NEEDS A FLUENT READER:
  //   • every `english` line — translated here from the author's own glossary,
  //     not supplied with the story. The reader's tap-to-reveal shows these, so
  //     they could not be left blank.
  //   • the English gloss appended to each question prompt, and every option.
  //
  // ⚠️ THE OPTIONS ARE ENGLISH ON PURPOSE. Writing Hmong distractors would mean
  // inventing Hmong that no fluent speaker has checked — exactly the failure the
  // txuas/txaus mis-take was. English options keep the question answerable from
  // the story without putting new Hmong in front of a learner. The prompt keeps
  // the author's Hmong, with a gloss after it so the question is readable at
  // this level.
  //
  // ⚠️ THE TRANSLATION-PRACTICE SECTION FROM THE AUTHOR IS NOT HERE. Five
  // English→Hmong sentences with an answer key: there is no field for it in this
  // schema and no screen that renders it. It belongs with the sentence builder
  // (src/lib/sentenceBuilder.js), which already does exactly that job from
  // vocabulary examples. Kept in notes/2026-09-12-ntxawm-lub-xauv.md so it is
  // not lost.
  {
    id: 'story-ntxawm-lub-xauv',
    title: 'Ntxawm Lub Xauv',
    english: "Ntxawm's Lock",
    genre: 'life',
    level: 'beginner',
    minutes: 3,
    blurb: 'A lock, a lost thread, and a goat in the field.',
    paragraphs: [
      [
        {
          hmong: 'Ntxawm muaj lub xauv xim liab uas nws txiv muab rau nws.',
          english: 'Ntxawm has a red lock that her father gave her.',
        },
        {
          hmong: 'Nws siv lub xauv xauv nws lub thawv me txhua hmo.',
          english: 'She uses the lock to lock her little box every night.',
        },
      ],
      [
        {
          // Joined day word 2026-09-27 (author). Was: hmong: 'Muaj ib tag kis, Ntxawm pom nws pog koob Zaub nyob tom qab vaj.',
          hmong: 'Muaj ib tagkis, Ntxawm pom nws pog koob Zaub nyob tom qab vaj.',
          english: 'One morning, Ntxawm saw her great-grandmother Zaub behind the garden.',
        },
        {
          hmong: 'Pog Zaub tab tom nrhiav nws lub xov uas poob rau hauv cov nroj tsuag.',
          english: 'Grandmother Zaub was looking for her thread, which had fallen into the plants.',
        },
      ],
      [
        {
          hmong: 'Ntxawm hais tias, “Kuv peev xwm pab koj nrhiav tau.”',
          english: 'Ntxawm said, "I can help you find it."',
        },
        {
          hmong: 'Nws thiab Pog Zaub nkawd saib hauv qab pob zeb thiab ntawm ib tsob ntoo paj.',
          english: 'She and Grandmother Zaub looked under a rock and by a flowering tree.',
        },
      ],
      [
        {
          hmong: 'Thaum kawg, lawv pom lub xov nyob ze ib lub paj kws.',
          english: 'At last, they saw the thread near a corn plant.',
        },
        {
          hmong: 'Lub xov ntawd xim daj thiab tseem zoo.',
          english: 'That thread was yellow and still good.',
        },
      ],
      [
        {
          hmong: 'Tom qab ntawd, Ntxawm mus tom teb nrog nws tus kwv Nkaub.',
          english: 'After that, Ntxawm went to the field with her younger brother Nkaub.',
        },
        {
          hmong: 'Nkawd hnov ib lub suab tuaj ntawm ib sab toj.',
          english: 'The two of them heard a sound coming from one side of the hill.',
        },
        {
          hmong: 'Nkaub coj nws xib xub, tiam sis nkawd tsis tua dab tsi.',
          english: 'Nkaub brought his arrow, but they did not shoot anything.',
        },
        {
          hmong: 'Nkawd tsuas pom ib tug kas noj nyom xwb.',
          english: 'They only saw a goat eating grass.',
        },
      ],
      [
        {
          hmong: 'Ntxawm xav pom tus kas kom ze dua, tab sis nws tsis xav ua kom tus kas ntshai.',
          english: 'Ntxawm wanted to see the goat closer, but she did not want to frighten it.',
        },
        {
          hmong: 'Nws txawm mus tsev thiab qhia nws txiv tias nws tau pab Pog Zaub nrhiav lub xov.',
          english: 'So she went home and told her father that she had helped Grandmother Zaub find the thread.',
        },
      ],
      [
        {
          hmong: 'Nws txiv luag thiab hais tias, “Koj ua tau zoo heev. Koj muaj peev xwm pab lwm tus.”',
          english: 'Her father laughed and said, "You did very well. You have the ability to help others."',
        },
      ],
    ],

    // The author's own word list, copied exactly — plus the three NAMES, added
    // 2026-09-13.
    //
    // ⚠️ NAMES BELONG IN A STORY'S GLOSSARY AND NOWHERE ELSE. `ntxawm` and
    // `nkaub` were briefly in src/data/vocabulary.js and had to come out:
    // vocabulary.js feeds the QUIZZES, the flashcard decks and the SRS
    // scheduler, so a character's name in there means a learner can be asked
    // "what does Ntxawm mean?" and have it scheduled for spaced repetition.
    //
    // Here they are harmless and useful. lookupWord tier 1 reads this glossary
    // FIRST and only for this story, so pressing "Ntxawm" on this page answers,
    // and pressing it anywhere else does not — which is exactly right, because a
    // name means something here and nothing in general.
    //
    // ⚠️ `zaub` stayed in the dictionary as "vegetables" — a real word that
    // happens to also be the great-grandmother's name. The entry below is the
    // NAME, and it only resolves inside this story.
    glossary: [
      // ⚠️ SPELLING VARIANTS, added 2026-09-25. The dictionary has 'tiamsis' solid;
      // this text writes both 'tiam sis' and 'tab sis' spaced, so a tap on 'sis' found nothing.
      { hmong: 'tiam sis', english: 'but; however — also spelled "tiamsis"' },
      { hmong: 'tab sis', english: 'but; however — a variant of "tiamsis"' },
      { hmong: 'Ntxawm', english: 'Ntxawm — the girl in this story' },
      { hmong: 'Nkaub', english: "Nkaub — Ntxawm's younger brother" },
      { hmong: 'Zaub', english: 'Zaub — the great-grandmother, "Pog Zaub"' },
      // ⚠️ CONTEXT GLOSS, WRITTEN BY CLAUDE — not the author's, and marked so.
      // A word whose GENERAL sense is misleading HERE belongs in the story's own
      // glossary, because tier 1 outranks the dictionary. That is the mechanism
      // for "in this text it means X" — never a reordering of the dictionary,
      // which has to stay true for every other text.
      //
      // `rau` has three dictionary senses and the one that leads is "to put on
      // footwear", because wear-verbs sits earlier in vocabulary.js than the
      // preposition. In this story it is only ever the preposition — "muab rau
      // nws", gave it TO her; "poob rau hauv", fell INTO.
      { hmong: 'rau', english: 'to, for, into — "muab rau nws", gave it to her' },
      { hmong: 'peev xwm', english: 'ability; can, to be able to' },
      { hmong: 'lub xauv', english: 'lock' },
      // ⚠️ 'xov', not 'tus xov' — corrected by the author 2026-09-13. The
      // classifier this noun takes is LUB, and every line below was changed
      // with it.
      { hmong: 'xov', english: 'string, thread, cord — takes the classifier lub: "lub xov"' },
      { hmong: 'xav pom', english: 'to want to see' },
      { hmong: 'xib xub', english: 'arrow' },
      { hmong: 'pog koob', english: 'great-grandmother' },
      { hmong: 'tus kas', english: 'goat' },
      { hmong: 'paj kws', english: 'corn' },
    ],

    questions: [
      {
        id: 'q-xauv-1',
        prompt: 'Ntxawm muaj lub xauv xim dab tsi? — What colour is Ntxawm’s lock?',
        options: ['Red', 'Yellow', 'Black', 'Green'],
        answer: 'Red',
        because: 'Paragraph 1 — "Ntxawm muaj lub xauv xim liab…"',
      },
      {
        id: 'q-xauv-2',
        prompt: 'Leej twg poob lub xov? — Who lost the thread?',
        options: ['Pog Zaub, her great-grandmother', 'Ntxawm herself', 'Nkaub, her younger brother', 'Her father'],
        answer: 'Pog Zaub, her great-grandmother',
        because: 'Paragraph 2 — "Pog Zaub tab tom nrhiav nws lub xov…"',
      },
      {
        id: 'q-xauv-3',
        prompt: 'Ntxawm hais tias nws muaj peev xwm ua dab tsi? — What does Ntxawm say she is able to do?',
        options: ['Help her look for it', 'Buy her a new one', 'Carry the basket', 'Lock the little box'],
        answer: 'Help her look for it',
        because: 'Paragraph 3 — "Kuv peev xwm pab koj nrhiav tau."',
      },
      {
        id: 'q-xauv-4',
        prompt: 'Nkawd nrhiav lub xov nyob qhov twg? — Where do they look for the thread?',
        options: [
          'Under a rock and by a flowering tree',
          'Inside the little box',
          'On the road to the field',
          'Behind the house',
        ],
        answer: 'Under a rock and by a flowering tree',
        because: 'Paragraph 3 — "…saib hauv qab pob zeb thiab ntawm ib tsob ntoo paj."',
      },
      {
        id: 'q-xauv-5',
        prompt: 'Lub xov xim dab tsi? — What colour is the thread?',
        options: ['Yellow', 'Red', 'White', 'Blue'],
        answer: 'Yellow',
        because: 'Paragraph 4 — "Lub xov ntawd xim daj thiab tseem zoo."',
      },
      {
        id: 'q-xauv-6',
        prompt: 'Ntxawm mus tom teb nrog leej twg? — Who does Ntxawm go to the field with?',
        options: ['Her younger brother Nkaub', 'Her father', 'Pog Zaub', 'She goes alone'],
        answer: 'Her younger brother Nkaub',
        because: 'Paragraph 5 — "…mus tom teb nrog nws tus kwv Nkaub."',
      },
      {
        id: 'q-xauv-7',
        prompt: 'Nkaub coj dab tsi nrog nws? — What does Nkaub bring with him?',
        options: ['His arrow', 'The red lock', 'A basket of corn', 'The thread'],
        answer: 'His arrow',
        because: 'Paragraph 5 — "Nkaub coj nws xib xub…"',
      },
      {
        id: 'q-xauv-8',
        prompt: 'Nkawd pom tsiaj dab tsi tom teb? — What animal do they see in the field?',
        options: ['A goat', 'A bird', 'A dog', 'A tiger'],
        answer: 'A goat',
        because: 'Paragraph 5 — "Nkawd tsuas pom ib tug kas noj nyom xwb."',
      },
      {
        id: 'q-xauv-9',
        prompt: 'Vim li cas Ntxawm tsis mus ze tus kas? — Why does Ntxawm not go closer to the goat?',
        options: [
          'She does not want to frighten it',
          'Her brother tells her not to',
          'It is getting dark',
          'The goat runs away first',
        ],
        answer: 'She does not want to frighten it',
        because: 'Paragraph 6 — "…tab sis nws tsis xav ua kom tus kas ntshai."',
      },
      {
        id: 'q-xauv-10',
        prompt: 'Ntxawm qhia leej twg txog qhov nws tau pab Pog Zaub? — Who does Ntxawm tell about helping Pog Zaub?',
        options: ['Her father', 'Her brother Nkaub', 'Pog Zaub', 'Nobody'],
        answer: 'Her father',
        because: 'Paragraph 6 — "…qhia nws txiv tias nws tau pab Pog Zaub nrhiav lub xov."',
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════════
   * FOUR SOUND DRILLS — CUT FROM THE READING LIBRARY 2026-09-13.
   *
   * Tus Suab · Suab Soob · Tus Noog Pom Tus Kab · Xeev Xwm.
   *
   * ⚠️ NOT BECAUSE THE HMONG IS BAD. They are DRILLS, and the reading module
   * cannot do anything with a drill. Sixteen to twenty-six unrelated sentences
   * have no plot, so:
   *
   *   • there is nothing to comprehend — the quiz can only ask trivia ("which
   *     name appears", "what colour is the insect"), which is a symptom of the
   *     form, not a question that can be written better;
   *   • tap-a-line-to-reveal has no payoff, because no line depends on the one
   *     before it. That gesture is the whole reader.
   *
   * And two of them were carrying uncertainty a paying reader should not meet:
   *
   *   Tus Suab    6 of 13 glossary entries marked uncertain — nearly half the
   *               vocabulary it teaches — plus a line the author judged too
   *               scrambled to translate.
   *   Xeev Xwm    5 hedged lines of 19, and an unframed line about the Chinese
   *               killing Hmong for generations sitting in a library a child
   *               may open.
   *   Tus Noog    4 hedged lines, 2 hedged glosses.
   *   Suab Soob   CLEAN — no hedges at all. Cut anyway: still sixteen
   *               disconnected sentences, and filler next to a real story.
   *
   * ⚠️ THEY ARE GOOD MATERIAL IN THE WRONG ROOM. src/data/wordFamilies.js →
   * /speak/family/[id] already drills sets of near-identical words with
   * recording and tone scoring, and "these words differ by one letter" is
   * exactly the point there. That is where this content belongs — the move is a
   * real feature, not a dump.
   *
   * ⚠️ THE AUTHOR'S ENGLISH AND GLOSSARIES ARE IN HERE and are the expensive
   * part. Forty-one glossary entries and eighty-one translated lines, most of
   * them supplied by the author directly. Do not delete this block to tidy up.
   *
   * TO RESTORE ONE: cut its object out of this comment and paste it back into
   * the array above. Nothing else is wired — shelf membership derives from
   * `story.genre`.
   * ══════════════════════════════════════════════════════════════════════════
  // ══════════════════════════════════════════════════════════════════════════
  // TUS SUAB — added 2026-09-12. An S/T MINIMAL-PAIR DRILL, not a narrative.
  //
  // ⚠️ READ THIS BEFORE TRUSTING A SINGLE ENGLISH LINE BELOW.
  //
  // The author supplied the Hmong and a 14-word list. The word list came with NO
  // glosses, and several sentences are built to contrast sounds rather than to
  // tell a story — "Tuam seev tias Xia tus uas tau xiam kom xam pom Tuam" is
  // doing work at the level of s/x/t, not at the level of plot.
  //
  // So every `english` line here is a LOW-CONFIDENCE DRAFT, and that is a
  // stronger warning than the one on Ntxawm Lub Xauv: there the author's own
  // glossary anchored the translation, and here there is nothing to anchor to.
  // Lines I could not parse are glossed word-by-word with · separators rather
  // than smoothed into an English sentence that claims a meaning I do not have.
  //
  // ✅ THE AUTHOR SUPPLIED THE ENGLISH AND THE WORD LIST — 2026-09-12, a few
  // hours after this went in as a draft. Every `english` line below is now
  // theirs, and the low-confidence word-by-word glosses I had written are gone.
  //
  // ⚠️ THEIR HEDGES ARE KEPT, NOT SMOOTHED AWAY. Five lines and six glosses
  // carry an explicit uncertainty, because the author marked them that way:
  // `xwv`, `seej`, `sav`, `saub`, `sem`, `soj`, and the sentence beginning
  // "Kab soj Tooj…" which they judged too scrambled to translate reliably. A
  // learner is better served by "uncertain — perhaps X" than by a clean
  // definition nobody stands behind.
  //
  // ⚠️ ONE HMONG LINE DISAGREES BETWEEN THE TWO MESSAGES. The original text ends
  // "Koj puas paub tus saub tid?"; the translation pass wrote "tus suab" and
  // glossed it as "the Voice". `saub` is KEPT here — the author's first text is
  // the source, and silently editing their Hmong to match a later gloss is how a
  // typo becomes canon. The gloss is left neutral ("the one over there") until
  // they say which was meant.
  //
  // ⚠️ THE QUESTIONS ARE SURFACE-LEVEL BY NECESSITY. Comprehension questions
  // about a plot I cannot reliably read would compound the guess. These ask
  // about things the text plainly IS — which names appear, which sounds are
  // being contrasted — and they are honest for a drill text. Replace them with
  // real comprehension questions once the English is right.
  //
  // ⚠️ THE TITLE IS BORROWED, NOT INVENTED. "Tus suab" is the author's own
  // entry from the word list; nothing new was coined.
  {
    id: 'story-tus-suab',
    title: 'Tus Suab',
    english: 'The Sound',
    genre: 'life',
    level: 'intermediate',
    minutes: 3,
    blurb: 'A sound drill: s against t, and the words that turn on one letter.',
    paragraphs: [
      [
        {
          hmong: 'Sua Pom tus suab tuaj kim Kos tus kwv teb.',
          english: "Sua heard a voice coming from Kos's younger brother's field.",
        },
        { hmong: 'Kuv xav saib koj.', english: 'I want to see you.' },
        {
          hmong: 'Toog tej pob kws sem pem teb tag.',
          english: "Toog's corn is scattered all over the field.",
        },
        {
          hmong: 'Kuv pom ib pab sai tim toj.',
          english: 'I saw a group of sai on the hill.',
        },
        { hmong: 'Tuam tau poob siab kawg.', english: 'Tuam became very discouraged.' },
        {
          hmong: 'Tuam seev tias Xia tus uas tau xiam kom xam pom Tuam.',
          english: 'Tuam said that Xia — the one who had died — asked someone to remember Tuam. (This line is unclear as written.)',
        },
        {
          hmong: 'Kuv tua tus sai tuag kiag tim ib tog kev.',
          english: 'I killed the sai right beside the road.',
        },
        {
          hmong: 'Peb seev tias tus tub poob peev tas.',
          english: 'We said that the boy had lost all his strength.',
        },
        {
          hmong: 'Koj puas tau swm koj tus Sua?',
          english: 'Have you become accustomed to your Sua?',
        },
        {
          // Joined day word 2026-09-27 (author). Was: hmong: 'Koj puas xav tias wb tuaj tau ob peb tag kis?',
          hmong: 'Koj puas xav tias wb tuaj tau ob peb tagkis?',
          english: 'Do you think the two of us can come for the next few mornings?',
        },
      ],
      [
        {
          hmong: 'Kim tias Kaum tau paab Kim tua tus kab tim teb.',
          english: 'Kim said that Kaum helped Kim kill the insect in the field.',
        },
        {
          hmong: 'Wb tus pog koob xam pom tias sua ua tau xis siab kawg.',
          english: 'Our great-grandmother saw that Sua was very happy.',
        },
        { hmong: 'Koj kam kiag xwb puas tau?', english: 'Can you simply agree right away?' },
        { hmong: 'See xwv tus ab kom pw.', english: 'See told the child to sleep. (Not fully clear.)' },
        {
          hmong: 'Tus twm seej kawg kiag.',
          english: 'The buffalo is completely seej. (Depends on the meaning of seej.)',
        },
        {
          hmong: 'Tub soo tus kab xiav tim toj.',
          english: 'Tub chased the blue insect on the hill.',
        },
        {
          hmong: 'Kab soj Tooj tus kwv kawg Kuam suab soob tau xis siab.',
          english: "Unclear as written — it involves an insect, Tooj's younger brother, Kuam's soft voice, and being content.",
        },
        {
          hmong: 'Wb seem ob peb tus twm.',
          english: 'We have two or three buffalo left.',
        },
        {
          hmong: 'Koj sav ko taw lawm.',
          english: 'You have stepped on — or lifted — your foot already. (`sav` needs confirming.)',
        },
        {
          hmong: 'Koj puas paub tus saub tid?',
          english: 'Do you know the one over there?',
        },
      ],
    ],

    // ⚠️ THE AUTHOR'S WORD LIST WITH THEIR OWN CONFIDENCE LEVELS KEPT IN THE
    // GLOSS. A learner is better served by "uncertain — perhaps X" than by a
    // clean definition nobody stands behind, and the author marked these
    // deliberately: high for `seem` and `tus suab`, low for `xwv`, `seej`,
    // `sav` and `saub`.
    //
    // ⚠️ `saj` IS NOT HERE, AND ITS ABSENCE IS A FINDING. It is on the author's
    // list but appears NOWHERE in this text — scripts/check-reading.mjs rejects
    // a glossary entry whose words are absent, which is the copy-paste catch it
    // was built for. Either a line containing `saj` was dropped from the text,
    // or the word belongs to a different drill. Worth resolving before the next
    // text lands.
    glossary: [
      { hmong: 'tus suab', english: 'the sound; the voice' },
      { hmong: 'seem', english: 'to remain; to be left over' },
      { hmong: 'swm', english: 'to be accustomed to; to become familiar with, to tame' },
      { hmong: 'seev', english: 'to say, to speak, to tell' },
      { hmong: 'soo', english: 'to chase, to pursue, to drive after' },
      { hmong: 'soob', english: 'soft, gentle, quiet — often of a voice' },
      { hmong: 'ib pab sai', english: 'a group or flock of sai — "group" is certain, "sai" is not' },
      { hmong: 'soj', english: 'to inspect, to look after, to watch over (uncertain)' },
      { hmong: 'sem', english: 'to scatter, to spread about (uncertain)' },
      { hmong: 'xwv', english: 'to cause, to direct, to make happen — uncertain as used here' },
      { hmong: 'seej', english: 'unclear without the original word list' },
      { hmong: 'sav', english: 'to step or to lift — uncertain' },
      { hmong: 'saub', english: 'unclear as written; possibly "prophet, wise person"' },
    ],

    questions: [
      {
        id: 'q-suab-1',
        prompt: 'Leej twg tau poob siab? — Who became discouraged?',
        options: ['Tuam', 'Kim', 'Kaum', 'Sua'],
        answer: 'Tuam',
        because: 'Paragraph 1 — "Tuam tau poob siab kawg."',
      },
      {
        id: 'q-suab-2',
        prompt: 'Leej twg pab Kim tua tus kab? — Who helped Kim kill the insect?',
        options: ['Kaum', 'Tooj', 'Kuam', 'Xia'],
        answer: 'Kaum',
        because: 'Paragraph 2 — "Kim tias Kaum tau paab Kim tua tus kab tim teb."',
      },
      {
        id: 'q-suab-3',
        prompt: 'Tus kab xim dab tsi? — What colour is the insect?',
        options: ['Xiav — blue', 'Liab — red', 'Daj — yellow', 'Dawb — white'],
        answer: 'Xiav — blue',
        because: 'Paragraph 2 — "Tub soo tus kab xiav tim toj."',
      },
      {
        id: 'q-suab-4',
        prompt: 'Tus twm — what animal is counted at the end?',
        options: ['Buffalo', 'Goat', 'Chicken', 'Dog'],
        answer: 'Buffalo',
        because: 'Paragraph 2 — "Wb seem ob peb tus twm."',
      },
      {
        id: 'q-suab-5',
        prompt: 'Where is the group seen — "ib pab sai tim toj"?',
        options: ['Tim toj — on the hill', 'Tim teb — in the field', 'Tom tsev — at the house', 'Tom kev — on the road'],
        answer: 'Tim toj — on the hill',
        because: 'Paragraph 1 — "Kuv pom ib pab sai tim toj."',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SUAB SOOB — added 2026-09-12. A sound drill on l, s and x, and the first
  // text where the author supplied the English AND the glossary up front.
  //
  // ⚠️ EVERY \`english\` LINE IS THE AUTHOR'S OWN, VERBATIM — including the
  // hedges. Three lines carry a stated uncertainty rather than a clean gloss:
  //
  //   • "Kuam tus tav loog tas li lawm" — \`loog\` can be tired, weak, numb or
  //     worn out depending on context.
  //   • "Lub paj liab tawg tau xi siab kawg" — \`xi siab\` may be a spelling or
  //     placement issue.
  //   • "Tub Looj … ob tug sai …" — \`sai\` may be vocabulary, a name, or a copy
  //     error.
  //
  // Those hedges are KEPT IN THE TRANSLATION rather than smoothed away. A reader
  // meeting an uncertain word is better served by "tired/exhausted" than by a
  // confident wrong answer, and the author flagged them deliberately.
  //
  // ⚠️ THE QUESTIONS ARE BUILT FROM THE AUTHOR'S ENGLISH, not from my reading of
  // the Hmong — every answer traces to a line they translated themselves. None
  // of them turns on \`loog\`, \`xi siab\` or \`sai\`, because a question whose
  // answer depends on an uncertain word has no correct answer.
  {
    id: 'story-suab-soob',
    title: 'Suab Soob',
    english: 'A Soft Voice',
    genre: 'life',
    level: 'intermediate',
    minutes: 3,
    blurb: 'Sixteen sentences that turn on l, s and x.',
    paragraphs: [
      [
        { hmong: 'Koj lub suab soob kawg.', english: 'Your voice is very soft and quiet.' },
        { hmong: 'Lub lauj kaub tawg tas lawm.', english: 'The pot is completely broken.' },
        { hmong: 'Lwm pom lawv tev pob kws tim teb.', english: 'Lwm saw them husking corn in the field.' },
        { hmong: 'Xab pw lig sawv lig.', english: 'Xab sleeps late and wakes up late.' },
      ],
      [
        { hmong: 'Kuam tus tav loog tas li lawm.', english: "Kuam's sibling is completely tired out already." },
        { hmong: 'Kub lees tias wb tau kom lawv tuaj ua laj siab.', english: 'Kub admitted that the two of us asked them to come and refresh themselves.' },
        { hmong: 'Xov xwm loj tau tu tas lawm.', english: 'The big news has completely ended.' },
        { hmong: 'Lwm tiam koj puas paub kuv lawm?', english: 'Next time, will you recognise me?' },
      ],
      [
        { hmong: 'Lub paj liab tawg tau xi siab kawg.', english: 'The red flower has blossomed very beautifully.' },
        // Apostrophes removed 2026-09-27 (author). TO RESTORE, was:
        // { hmong: 'Peb tus pog laus yuav’ kauv li.', english: 'Our grandmother will wrap it.' },
        { hmong: 'Peb tus pog laus yuav kauv li.', english: 'Our grandmother will wrap it.' },
        { hmong: 'Lawv pom tias peb ua tau li lawv xav lawm.', english: 'They saw that we were able to do what they wanted.' },
        { hmong: 'Neeb lub siab lwj tag.', english: 'Neeb is completely heartbroken.' },
      ],
      [
        { hmong: 'Lwm xav ua ib tug tub tua twm ua si xwb.', english: 'Lwm only wants to play at being a buffalo hunter.' },
        { hmong: 'Tub Looj tau pom ob tug sai tim lub xeev Loj Leeb.', english: 'Tub Looj saw two sai in the province of Loj Leeb.' },
        { hmong: 'Suav tau tua peb los tau ob peb tiam lawm.', english: 'The Chinese have killed us for several generations already.' },
        { hmong: 'Liv xwm tau sau tias kev sib tua tau tus tas lawm.', english: 'Liv Xwm wrote that the fighting had ended.' },
      ],
    ],

    // The author's own word list, copied exactly — hedges included.
    glossary: [
      { hmong: 'suab soob', english: 'soft, quiet voice; a subdued sound' },
      { hmong: 'lauj kaub', english: 'pot; cooking pot' },
      { hmong: 'loog', english: 'tired, weak, numb, worn out — the sense depends on context' },
      { hmong: 'laj', english: 'relaxed, refreshed, at ease; in "laj siab", cheered up' },
      { hmong: 'xov xwm', english: 'news; information; an event' },
      { hmong: 'lwm tiam', english: 'next time; another occasion' },
      { hmong: 'kauv', english: 'to wrap, to roll, to cover' },
      { hmong: 'siab lwj tag', english: 'completely heartbroken; deeply distressed' },
      { hmong: 'lub xeev', english: 'state; province; region' },
      { hmong: 'liv xwm', english: 'most likely a personal name, Liv Xwm' },
    ],

    questions: [
      {
        id: 'q-soob-1',
        prompt: 'Lub lauj kaub ua li cas lawm? — What has happened to the pot?',
        options: ['It is completely broken', 'It is full of corn', 'It has been wrapped up', 'It was sold'],
        answer: 'It is completely broken',
        because: 'Paragraph 1 — "Lub lauj kaub tawg tas lawm."',
      },
      {
        id: 'q-soob-2',
        prompt: 'Xab pw thiab sawv li cas? — How does Xab sleep and wake?',
        options: ['Late, and wakes late', 'Early, and wakes early', 'Late, but wakes early', 'He does not sleep'],
        answer: 'Late, and wakes late',
        because: 'Paragraph 1 — "Xab pw lig sawv lig."',
      },
      {
        id: 'q-soob-3',
        prompt: 'Leej twg sau tias kev sib tua tas lawm? — Who wrote that the fighting had ended?',
        options: ['Liv Xwm', 'Tub Looj', 'Kub', 'Neeb'],
        answer: 'Liv Xwm',
        because: 'Paragraph 4 — "Liv xwm tau sau tias kev sib tua tau tus tas lawm."',
      },
      {
        id: 'q-soob-4',
        prompt: 'Neeb lub siab li cas? — How does Neeb feel?',
        options: ['Completely heartbroken', 'Refreshed and at ease', 'Very tired', 'Delighted'],
        answer: 'Completely heartbroken',
        because: 'Paragraph 3 — "Neeb lub siab lwj tag."',
      },
      {
        id: 'q-soob-5',
        prompt: 'Lwm xav ua dab tsi ua si? — What does Lwm want to play at being?',
        options: ['A buffalo hunter', 'A pot maker', 'A corn farmer', 'A news writer'],
        answer: 'A buffalo hunter',
        because: 'Paragraph 4 — "Lwm xav ua ib tug tub tua twm ua si xwb."',
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // TUS NOOG POM TUS KAB — added 2026-09-12, live once the author's English and
  // word list arrived. Twenty-five sentences: part sound drill, part narrative.
  //
  // ⚠️ EVERY `english` LINE IS THE AUTHOR'S, VERBATIM, HEDGES INCLUDED. Six of
  // them carry a stated uncertainty rather than a clean translation —
  // `ua tus kauv`, `raug kev tu`, `lov suab`, the cracked-ground line, and the
  // two they flagged as scrambled word order. Those are kept as written: a
  // learner meeting an uncertain line is better served by a marked partial than
  // by confident prose nobody stands behind.
  //
  // ⚠️ THE AUTHOR NOTED TWO LIKELY WORD-ORDER SLIPS in their own text —
  // "Tus kab laum lub paj noj" (more standard: "Tus kab laum noj lub paj") and
  // the final comparison clause of the flower line. THE HMONG IS UNCHANGED.
  // Their text is the source; correcting it from a translation note is how a
  // draft silently becomes canon. Flagged here for them to decide.
  //
  // ⚠️ QUESTIONS ARE BUILT FROM THE AUTHOR'S ENGLISH, and every one turns on a
  // line they translated with confidence — none on `tus sai`, `lov suab` or
  // `ua tus kauv`. A question whose answer depends on an uncertain word has no
  // correct answer.
  {
    id: 'story-tus-noog',
    title: 'Tus Noog Pom Tus Kab',
    english: 'The Bird Saw the Insect',
    genre: 'life',
    level: 'intermediate',
    minutes: 4,
    blurb: 'Twenty-five sentences — a bird, a snake, an arrow, and the rain.',
    paragraphs: [
      [
        { hmong: 'Tus noog pom tus kab.', english: 'The bird saw the insect.' },
        { hmong: 'Lub paj xiav tawg tau xis siab.', english: 'The blue flower blossomed very pleasantly.' },
        { hmong: 'Tus liab pom tus sai noj lub paj ua si.', english: 'The monkey saw the sai playing with the flower.' },
        { hmong: 'Nws lam sim koj lub siab saib koj puas xav tau xwb tiag.', english: 'He was only testing your feelings, to see whether you truly wanted it.' },
        { hmong: 'Nws muaj peev xwm tua ua tus kauv tuaj kiag lawm.', english: 'He was able to shoot and make it come right away. (Unclear as written.)' },
      ],
      [
        { hmong: 'Tus nab tom tus nas tim Suav Lwm teb.', english: "The snake bit the rat in Suav Lwm's field." },
        { hmong: 'Nws kaj siab lawm.', english: 'He feels content now.' },
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Tag kis, lawv xav pom lawv tus niam tij tuaj nrog tim Leej lawm los.', english: 'Tomorrow, they want to see whether their older sister-in-law has come with Leej.' },
        { hmong: 'Tagkis, lawv xav pom lawv tus niam tij tuaj nrog tim Leej lawm los.', english: 'Tomorrow, they want to see whether their older sister-in-law has come with Leej.' },
        { hmong: 'Tus kab laum lub paj noj.', english: 'The cockroach eats the flower.' },
        { hmong: 'Koj puas kam wb tus nus raug kev tu?', english: 'Are you willing for our younger brother to suffer hardship? (Uncertain.)' },
      ],
      [
        { hmong: 'Ua lag ua luam los nws kuj tau li siab xav lawm.', english: 'Even after all the work and trading, he has got what he wanted.' },
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Looj xav kom Xwm saib nws lub paj uas Kub xa los tag kis no.', english: 'Looj wants Xwm to look at the flower that Kub will send tomorrow.' },
        { hmong: 'Looj xav kom Xwm saib nws lub paj uas Kub xa los tagkis no.', english: 'Looj wants Xwm to look at the flower that Kub will send tomorrow.' },
        { hmong: 'Sua tua ib xib xub tuaj poob kiag tim Xab lawv teb.', english: "Sua shot an arrow, and it landed right in Xab's field." },
        { hmong: 'Lo lus xwb los kuj tau lawm.', english: 'Words alone are enough.' },
        { hmong: 'Koj sau tau lus xis kuv siab kawg.', english: 'What you wrote pleased me very much.' },
      ],
      [
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Ib tag kis tav no los wb tus kwv lub siab xav pom nws lub me paj liab xwb tiag.', english: 'All this morning, our younger brother has really wanted only to see his little red flower.' },
        { hmong: 'Ib tagkis tav no los wb tus kwv lub siab xav pom nws lub me paj liab xwb tiag.', english: 'All this morning, our younger brother has really wanted only to see his little red flower.' },
        { hmong: 'Kav liam, ua ib siab wb taug kev mus ua teb xwb puas tau?', english: 'Never mind — can the two of us make up our minds and walk to the field to work?' },
        { hmong: 'Nag poob los ua tej av noo tas lawm.', english: 'The rain fell and made all the soil wet.' },
        { hmong: 'Nej tuaj lov suab tim Pov lawv teb pob kws los ua noj.', english: "You all came to break suab at Pov's cornfield to cook. (lov suab is unclear.)" },
        // Apostrophes removed 2026-09-27 (author). TO RESTORE, was:
        // { hmong: 'Los nag tas av tawg ua tej pov toj liab’ tuaj.', english: 'After the rain, the ground cracked and red mounds appeared. (Unclear as written.)' },
        { hmong: 'Los nag tas av tawg ua tej pov toj liab tuaj.', english: 'After the rain, the ground cracked and red mounds appeared. (Unclear as written.)' },
      ],
      [
        { hmong: 'Wb lam seev suab saib puas zoo los mas.', english: "Let's try singing and see whether it sounds good." },
        { hmong: 'Koj lus tag li no xwb los?', english: 'Is that all you have to say?' },
        { hmong: 'Koj xav saib lub paj no puas tawg taus li tej tib neeg pom los.', english: 'You want to see whether this flower can bloom the way people say it can.' },
        { hmong: 'Lwm tiam, wb puas sib pom lawm ne?', english: 'Will we see each other next time?' },
        { hmong: 'Koj sau tias kuv xav pom nws kawg li no nawb.', english: 'You wrote that I want to see her this much.' },
        { hmong: 'Lus tas li no xwb.', english: 'That is all.' },
      ],
    ],

    // The author's word list, with their uncertainty kept in the gloss.
    glossary: [
      { hmong: 'xib xub', english: 'arrow' },
      { hmong: 'niam tij', english: "older sister-in-law; the wife of one's older brother" },
      { hmong: 'kaj siab', english: 'peaceful, content, cheerful, reassured, satisfied' },
      { hmong: 'sim siab', english: "to test someone's heart or feelings; to test their resolve" },
      { hmong: 'laum', english: 'a drill or borer; in "kab laum", a cockroach' },
      { hmong: 'ua luam', english: 'to trade, to do business, to work commercially' },
      { hmong: 'tus sai', english: 'a particular animal — not identified in the source text' },
      { hmong: 'lov suab', english: 'unclear; likely a fixed agricultural phrase' },
    ],

    questions: [
      {
        id: 'q-noog-1',
        prompt: 'Tus noog pom dab tsi? — What did the bird see?',
        options: ['The insect', 'The flower', 'The snake', 'The monkey'],
        answer: 'The insect',
        because: 'Paragraph 1 — "Tus noog pom tus kab."',
      },
      {
        id: 'q-noog-2',
        prompt: 'Tus nab tom dab tsi? — What did the snake bite?',
        options: ['The rat', 'The bird', 'The cockroach', 'The monkey'],
        answer: 'The rat',
        because: 'Paragraph 2 — "Tus nab tom tus nas tim Suav Lwm teb."',
      },
      {
        id: 'q-noog-3',
        prompt: 'Sua tua dab tsi, thiab nws poob qhov twg? — What did Sua shoot, and where did it land?',
        options: [
          "An arrow, in Xab's field",
          "A flower, in Pov's field",
          "An arrow, on the hill",
          "A rat, by the road",
        ],
        answer: "An arrow, in Xab's field",
        because: 'Paragraph 3 — "Sua tua ib xib xub tuaj poob kiag tim Xab lawv teb."',
      },
      {
        id: 'q-noog-4',
        prompt: 'Nag poob los ua li cas? — What did the rain do?',
        options: ['It made all the soil wet', 'It broke the flower', 'It filled the field with corn', 'It washed the arrow away'],
        answer: 'It made all the soil wet',
        because: 'Paragraph 4 — "Nag poob los ua tej av noo tas lawm."',
      },
      {
        id: 'q-noog-5',
        prompt: 'Leej twg xav kom Xwm saib lub paj? — Who wants Xwm to look at the flower?',
        options: ['Looj', 'Kub', 'Pov', 'Sua'],
        answer: 'Looj',
        // Joined day word 2026-09-27 (author). Was: because: 'Paragraph 3 — "Looj xav kom Xwm saib nws lub paj uas Kub xa los tag kis no."',
        because: 'Paragraph 3 — "Looj xav kom Xwm saib nws lub paj uas Kub xa los tagkis no."',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // XEEV XWM — added 2026-09-12, live once the author's English and word list
  // arrived. Nineteen sentences drilling h, x and n.
  //
  // ⚠️ EVERY `english` LINE IS THE AUTHOR'S, HEDGES INCLUDED. Seven carry a
  // stated uncertainty — `xeev xwm`, `hwm` in line 13, `tuav xua`, `haub`,
  // the end of the lightning line, and the jar line — and they read that way in
  // the app.
  //
  // ⚠️ THE AUTHOR'S NOTE ON LINE 7 IS KEPT WITH IT: "Suav tuaj tua peb Hmoob tau
  // ob peb tiam los lawm" is TRANSLATED AS WRITTEN, not endorsed as a historical
  // claim. It is the author's sentence and their English; this file records
  // language, and that distinction belongs in the record rather than being
  // quietly resolved either way.
  //
  // ⚠️ `ua neeb` IS SHAMANIC PRACTICE, not "magic" — the author was explicit
  // about it, and the wrong gloss there is the kind that gives offence rather
  // than merely being inaccurate.
  //
  // ⚠️ SEVERAL LINES ARE CONTROLLED VOCABULARY EXERCISES, NOT NATURAL SPEECH —
  // "Tus nas hwm tus nab kiag lawm" ("the rat respected the snake") reads oddly
  // on purpose. The author flagged it; it is not a translation error to fix.
  {
    id: 'story-xeev-xwm',
    title: 'Xeev Xwm',
    english: 'Clouds Over the Hills',
    genre: 'life',
    level: 'intermediate',
    minutes: 4,
    blurb: 'Nineteen sentences on h, x and n — weather, fields and family.',
    paragraphs: [
      [
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Xwm hais tias Xab pom lawv sib xeem noj pob kws tag kis no.', english: 'Xwm said that Xab saw them competing with each other to eat corn this morning.' },
        { hmong: 'Xwm hais tias Xab pom lawv sib xeem noj pob kws tagkis no.', english: 'Xwm said that Xab saw them competing with each other to eat corn this morning.' },
        { hmong: 'Nws xeev xwm tau tias peb tawg puag tim Naj Xes los.', english: 'He knew that we had scattered from Naj Xes. (xeev xwm is uncertain.)' },
        { hmong: 'Koj lub hauv siab liab tag li.', english: 'Your chest is completely red.' },
        { hmong: 'Neeg heev lub siab xav tua lwm tus xwb.', english: 'That very fierce person only wants to kill other people.' },
        { hmong: 'Tuam nej tej pob kws sem tas li.', english: 'Tuam scattered all of your corn everywhere.' },
      ],
      [
        { hmong: 'Lub paj tawg tau loj heev lawm.', english: 'The flower has bloomed very large.' },
        { hmong: 'Suav tuaj tua peb Hmoob tau ob peb tiam los lawm.', english: 'The Chinese have come to kill us Hmong for several generations already.' },
        { hmong: 'Nws ua neeb hais lus Suav tas li xwb.', english: 'He practises shamanism and speaks Chinese all the time.' },
        { hmong: 'Kuam pom huab tuaj kav tej hau hav tas.', english: 'Kuam saw clouds come and cover all the hilltops and valleys.' },
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Nees hee tau ib tag kis no lawm.', english: 'The horse has been neighing all morning.' },
        { hmong: 'Nees hee tau ib tagkis no lawm.', english: 'The horse has been neighing all morning.' },
      ],
      [
        { hmong: 'Nej tuaj tim Noom Hej tuaj hos peb los tim Huab Hiv los.', english: 'You all came from Noom Hej, while we came from Huab Hiv.' },
        { hmong: 'Xab hais tias nws tus kwv los tim Av Liab los.', english: 'Xab said that his younger brother came from Av Liab.' },
        { hmong: 'Nws hwm ua nej tau poob siab tas.', english: 'He respected you all so much that you became completely discouraged. (Does not parse naturally as written.)' },
        // Joined day word 2026-09-27 (author). Was: { hmong: 'Nag xob poob los tau ob peb tag kis no ua peb lo av tas.', english: 'Thunder and lightning have struck these past few mornings and left our ground — (the ending is incomplete).' },
        { hmong: 'Nag xob poob los tau ob peb tagkis no ua peb lo av tas.', english: 'Thunder and lightning have struck these past few mornings and left our ground — (the ending is incomplete).' },
      ],
      [
        { hmong: 'Lwm lub lim tiam wb tuaj tuav xua ua ke.', english: 'Next week, the two of us will come and do tuav xua together. (Phrase unconfirmed.)' },
        { hmong: 'Nws tuaj haub peb pob kws tag lawm.', english: 'He has already come and haub all our corn. (Farming sense of haub unconfirmed.)' },
        { hmong: 'Tus nas hwm tus nab kiag lawm.', english: 'The rat respected the snake immediately.' },
        { hmong: 'Lub hwj tawg ua ob sab li lub lub kwj ha tiv.', english: 'The jar broke into two pieces like a ravine. (Unclear as written.)' },
        { hmong: 'Nas kauv tuaj noj noob taub tim kuv tus kwv teb.', english: "A nas kauv came to eat squash seeds in my younger brother's field." },
      ],
    ],

    // ⚠️ `hem` (to threaten) IS NOT HERE, and its absence is the same finding as
    // `saj` in Tus Suab: it is on the author's word list but appears nowhere in
    // the text, and check-reading.mjs rejects a glossary entry whose words are
    // absent. Either a line was dropped or the word belongs to another drill.
    glossary: [
      { hmong: 'hwm', english: 'to respect, to honour' },
      { hmong: 'hau hav', english: 'hills and valleys; the landscape of both' },
      { hmong: 'nag xob', english: 'a thunderstorm; thunder and lightning' },
      { hmong: 'hee', english: 'to neigh — the sound a horse makes' },
      { hmong: 'sem', english: 'to scatter; to spread around' },
      { hmong: 'lwm tiam', english: 'next time; another occasion (in "lwm lub lim tiam", next week)' },
      { hmong: 'xeev xwm', english: 'uncertain; possibly related to being able or capable' },
      { hmong: 'xua', english: 'unclear without context; may be part of a fixed phrase' },
      { hmong: 'haub', english: 'unclear; possibly a farming action involving corn' },
    ],

    questions: [
      {
        id: 'q-xeev-1',
        prompt: 'Kuam pom dab tsi tuaj kav hau hav? — What did Kuam see covering the hills and valleys?',
        options: ['Clouds', 'Rain', 'Corn', 'Smoke'],
        answer: 'Clouds',
        because: 'Paragraph 2 — "Kuam pom huab tuaj kav tej hau hav tas."',
      },
      {
        id: 'q-xeev-2',
        // Joined day word 2026-09-27 (author). Was: prompt: 'Nees ua dab tsi tau ib tag kis? — What has the horse been doing all morning?',
        prompt: 'Nees ua dab tsi tau ib tagkis? — What has the horse been doing all morning?',
        options: ['Neighing', 'Eating corn', 'Running to the field', 'Sleeping'],
        answer: 'Neighing',
        // Joined day word 2026-09-27 (author). Was: because: 'Paragraph 2 — "Nees hee tau ib tag kis no lawm."',
        because: 'Paragraph 2 — "Nees hee tau ib tagkis no lawm."',
      },
      {
        id: 'q-xeev-3',
        prompt: 'Nej tuaj qhov twg tuaj? — Where did "you all" come from?',
        options: ['Noom Hej', 'Huab Hiv', 'Av Liab', 'Naj Xes'],
        answer: 'Noom Hej',
        because: 'Paragraph 3 — "Nej tuaj tim Noom Hej tuaj hos peb los tim Huab Hiv los."',
      },
      {
        id: 'q-xeev-4',
        prompt: 'Nas kauv tuaj noj dab tsi? — What did the nas kauv come to eat?',
        options: ['Squash seeds', 'Corn', 'A flower', 'Grass'],
        answer: 'Squash seeds',
        because: 'Paragraph 4 — "Nas kauv tuaj noj noob taub tim kuv tus kwv teb."',
      },
      {
        id: 'q-xeev-5',
        prompt: 'Koj lub hauv siab li cas? — What is described as completely red?',
        options: ['Your chest', 'The flower', 'The ground', 'The jar'],
        answer: 'Your chest',
        because: 'Paragraph 1 — "Koj lub hauv siab liab tag li."',
      },
    ],
  },

   * ══════════════════════════════════════════════════════════════════════════ */

  // ══════════════════════════════════════════════════════════════════════════
  // TUS MIV — added 2026-09-12, and the last of the five texts to go live.
  // A real narrative rather than a sound drill: a cat, a mouse, and a game only
  // one of them is playing.
  //
  // ⚠️ THE PARAGRAPH BREAKS ARE THE AUTHOR'S. My parked version had guessed four
  // paragraphs; their translation arrived in six, so the guess was thrown away.
  // The reader numbers paragraphs and every quiz `because` cites them, so the
  // author's grouping is the one that matters.
  //
  // ⚠️ THREE GLOSSES COME FROM THE AUTHOR'S NOTES, NOT THEIR WORD LIST, and they
  // are the ones that unlock the story:
  //   • `lub siab` is not "heart" here — it is inner intention, desire, resolve.
  //     "Tus nas to taub tus miv lub siab" = the mouse understands what the cat
  //     INTENDS.
  //   • `ua ib siab` is to make up one's mind, to steel oneself — not "to be sad".
  //   • `xis noj` — "tus nas xis noj heev" is "the mouse would be delicious",
  //     NOT "the mouse wants to eat".
  // Each one is a place where the obvious literal reading is wrong, which is
  // exactly what a glossary is for.
  {
    id: 'story-tus-miv-tus-nas',
    title: 'Tus Miv',
    english: 'The Cat',
    genre: 'life',
    level: 'beginner',
    minutes: 4,
    blurb: 'A cat, a mouse, and a game only one of them is playing.',
    paragraphs: [
      [
        { hmong: 'Tus miv haus mis hauv lub tais.', english: 'The cat drinks milk from a bowl.' },
        { hmong: 'Tus miv pom tus nas los.', english: 'The cat sees the mouse coming.' },
      ],
      [
        // ⚠️ FIXED 2026-09-25 — "xav tau" is "want"; "xav tias" is "think", which the English says.
        // Was: { hmong: 'Tus miv xav tau tias tus nas xis noj heev.', english: 'The cat thinks that the mouse would be very tasty to eat.' },
        { hmong: 'Tus miv xav tias tus nas xis noj heev.', english: 'The cat thinks that the mouse would be very tasty to eat.' },
        { hmong: 'Nws mus puag tim tus nas tawm tuaj.', english: 'It goes over toward where the mouse will come out.' },
        { hmong: 'Nws tos tus nas tiam sis tus nas twb paub tag lawm.', english: 'It waits for the mouse, but the mouse already knows everything.' },
      ],
      [
        // ⚠️ FIXED 2026-09-25 — stray apostrophe — RPA uses none.
        // Was: { hmong: 'Tus nas ua lub suab me’ li nws tawm los xwb.', english: 'The mouse makes a small sound as if it is coming out.' },
        { hmong: 'Tus nas ua lub suab me li nws tawm los xwb.', english: 'The mouse makes a small sound as if it is coming out.' },
        { hmong: 'Tus nas twb to taub tus miv lub siab tas.', english: "The mouse already understands the cat's intentions." },
        { hmong: 'Tus nas lam sim tus miv lub siab kom nws muaj siab xwb.', english: "The mouse is only testing the cat's patience, so that the cat stays eager." },
        // ⚠️ FIXED 2026-09-25 — stray apostrophe — RPA uses none.
        // Was: { hmong: 'Tus nas maj mam ua lub suab me’ li nws yuav tawm los tiag.', english: 'The mouse slowly makes a little sound, as if it really is about to come out.' },
        { hmong: 'Tus nas maj mam ua lub suab me li nws yuav tawm los tiag.', english: 'The mouse slowly makes a little sound, as if it really is about to come out.' },
      ],
      [
        { hmong: 'Tus miv xav tias nws mas tau noj kiag tus nas.', english: 'The cat thinks it is about to eat the mouse.' },
        // ⚠️ FIXED 2026-09-25 — stray apostrophes.
        // Was: { hmong: 'Nws tos tus nas tau ob peb teev los tus nas kuj ua suab xuav’ kom tus miv muaj’ siab xwb.', english: 'It waits several hours, but the mouse keeps whistling only to keep the cat interested.' },
        { hmong: 'Nws tos tus nas tau ob peb teev los tus nas kuj ua suab xuav kom tus miv muaj siab xwb.', english: 'It waits several hours, but the mouse keeps whistling only to keep the cat interested.' },
        { hmong: 'Tau peb teev lawm, tus miv mam paub tias tus nas ua si xwb.', english: 'After three hours, the cat finally realises that the mouse was only playing.' },
      ],
      [
        // ⚠️ FIXED 2026-09-25 — stray apostrophe.
        // Was: { hmong: 'Tus miv ua ib siab li nws tu siab mus pw tib tug no’ ib leeg tim nws lub hoob.', english: 'The cat makes up its mind, feels sad, and goes to sleep alone in its room.' },
        { hmong: 'Tus miv ua ib siab li nws tu siab mus pw tib tug no ib leeg tim nws lub hoob.', english: 'The cat makes up its mind, feels sad, and goes to sleep alone in its room.' },
        { hmong: 'Tus nas pom tau tias tus miv mus pw lawm, nws mam tawm los xuav kauv ua si kom luab lim tus miv.', english: 'The mouse sees that the cat has gone to sleep, then comes out, whistling and playing to mock the cat.' },
      ],
      [
        // ⚠️ FIXED 2026-09-25 — stray apostrophes.
        // Was: { hmong: 'Tus nas mas niam mus’ los’, haus miv tais mis, taug kev ua si tom tej ua li nws kaj siab heev.', english: "The mouse goes back and forth, drinks the milk from the cat's bowl, and walks around playing; it feels very peaceful and happy." },
        { hmong: 'Tus nas mas niam mus los, haus miv tais mis, taug kev ua si tom tej ua li nws kaj siab heev.', english: "The mouse goes back and forth, drinks the milk from the cat's bowl, and walks around playing; it feels very peaceful and happy." },
        { hmong: 'Tib sij huam li ib laim muag, tus miv tib kaug ua tus nas poob siab kiag.', english: 'In the blink of an eye, the cat suddenly leaves the mouse terrified.' },
        { hmong: 'Tus nas mam paub tias tus miv los muab nws tom lawm.', english: 'The mouse then realises that the cat has come to bite it.' },
        { hmong: 'Tus nas mam xav tias paub li mas.', english: 'The mouse thinks, "I should have known."' },
      ],
    ],

    glossary: [
      // ⚠️ SPELLING VARIANT, added 2026-09-25. The dictionary has 'tiamsis' solid;
      // this text writes it spaced, so a tap on 'sis' found nothing.
      { hmong: 'tiam sis', english: 'but; however — also spelled "tiamsis"' },
      { hmong: 'luab lim', english: 'to tease, to mock, to make fun of' },
      { hmong: 'xuav kauv', english: 'to whistle; a whistling or hissing sound' },
      { hmong: 'tib sij huam', english: 'in an instant; all at once; suddenly' },
      { hmong: 'tib kaug', english: 'suddenly; immediately; in one quick motion' },
      { hmong: 'paub li mas', english: '"I should have known" — an expression of realisation or regret' },
      // ⚠️ CONTEXT GLOSS, WRITTEN BY CLAUDE — not the author's, and marked so.
      // A word whose GENERAL sense is misleading HERE belongs in the story's own
      // glossary, because tier 1 outranks the dictionary. That is the mechanism
      // for "in this text it means X" — never a reordering of the dictionary,
      // which has to stay true for every other text.
      //
      // The dictionary has `li` as "belonging to", which is a real sense and the
      // wrong one here: every use in this story is comparative — "ua lub suab
      // me li nws tawm los", a small sound AS IF it were coming out.
      { hmong: 'li', english: 'like, as if — "li nws tawm los", as if it were coming out' },
      { hmong: 'lub siab', english: 'inner intention, desire, resolve — literally the heart or liver' },
      { hmong: 'ua ib siab', english: "to make up one's mind; to steel oneself" },
    ],

    questions: [
      {
        id: 'q-miv-1',
        prompt: 'Tus miv haus dab tsi? — What is the cat drinking?',
        options: ['Milk from a bowl', 'Water from the field', 'Nothing at all', 'Tea'],
        answer: 'Milk from a bowl',
        because: 'Paragraph 1 — "Tus miv haus mis hauv lub tais."',
      },
      {
        id: 'q-miv-2',
        prompt: 'Vim li cas tus nas ua lub suab me? — Why does the mouse keep making a small sound?',
        options: [
          'To keep the cat eager and waiting',
          'Because it is frightened',
          'To call other mice',
          'Because it is hungry',
        ],
        answer: 'To keep the cat eager and waiting',
        because: 'Paragraph 3 — "Tus nas lam sim tus miv lub siab kom nws muaj siab xwb."',
      },
      {
        id: 'q-miv-3',
        prompt: 'Tau pes tsawg teev tus miv mam paub tias tus nas ua si? — How long before the cat realises the mouse is only playing?',
        options: ['Three hours', 'One hour', 'All night', 'A few minutes'],
        answer: 'Three hours',
        because: 'Paragraph 4 — "Tau peb teev lawm, tus miv mam paub tias tus nas ua si xwb."',
      },
      {
        id: 'q-miv-4',
        prompt: 'Thaum tus miv mus pw lawm, tus nas ua dab tsi? — Once the cat has gone to sleep, what does the mouse do?',
        options: [
          "It comes out and drinks the cat's milk",
          'It runs away from the house',
          'It goes to sleep as well',
          'It hides in its hole',
        ],
        answer: "It comes out and drinks the cat's milk",
        because: 'Paragraph 6 — "…haus miv tais mis, taug kev ua si tom tej…"',
      },
      {
        id: 'q-miv-5',
        prompt: 'Thaum kawg, tus miv ua dab tsi rau tus nas? — In the end, what does the cat do to the mouse?',
        options: ['It bites it', 'It lets it go', 'It follows it home', 'It shares the milk'],
        answer: 'It bites it',
        because: 'Paragraph 6 — "Tus nas mam paub tias tus miv los muab nws tom lawm."',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NCO TXOG ZONG VANG — added 2026-09-13. The first non-fiction text in the
  // library, and the first about REAL, NAMED, LIVING people.
  //
  // ⚠️ WHAT CAME FROM THE AUTHOR, VERBATIM: every line of Hmong, and the
  // thirteen legal/institutional glossary terms marked below. The author
  // supplied those as an English→Hmong table precisely so the terminology stays
  // consistent — they are the most valuable thing in this file and must not be
  // "improved".
  //
  // ⚠️ WHAT IS A DRAFT: every `english` line, and the content glosses in the
  // second half of the glossary. The Hmong is a translation of an
  // English-language account, so back-translating it is a safer job than
  // translating an original — but no fluent reader has checked these.
  //
  // ⚠️ THIS IS A REAL CASE. Zong Vang, Omer Ninham and Richard Crapeau are real
  // people; the case is State v. Ninham, decided by the Wisconsin Supreme Court
  // in 2011. The author abbreviated the three uncharged minors to first name +
  // initial, and that MUST be preserved — they were thirteen and fourteen, were
  // never charged, and are private individuals. Do not "complete" those names
  // from a news search.
  //
  // ⚠️ THE AUTHOR'S OWN NOTE, which was attached to the text and is explicitly
  // NOT part of it: sentencing law for offences committed as a juvenile has
  // changed and is still being litigated, so the current custody/parole status
  // of either man must be re-checked against court and Wisconsin DOC records
  // before this text makes any claim about where they are now. It does not make
  // one — every sentence here is about what the courts decided at the time, and
  // it needs to stay that way. Kept in notes/2026-09-13-zong-vang.md.
  //
  // ⚠️ CONTENT. This is the detailed killing of a thirteen-year-old, in an app
  // used by children. The warning lives in the `blurb`, because that is the one
  // field the library card renders before a reader opens the story — there is
  // no content-warning field in this schema yet. See the note.
  {
    // ⚠️ THE ID STAYS 'story-zong-vang' THROUGH THE RETITLE. It is the key the
    // bookmark (readingProgress.js) and the completed-step record save against —
    // an address, not a label. Same reasoning as misc-tus-xov in vocabulary.js.
    id: 'story-zong-vang',
    // ⚠️ THIS HMONG TITLE IS MINE, NOT THE AUTHOR'S. Asked for on 2026-09-13 as
    // "The Horrifying Murder of Zong Vang, in Hmong". Built from words already
    // in the text — `kev tua` (the killing of), `uas txaus ntshai` (that is
    // horrifying, the same phrase the Horror shelf uses). Word order and the
    // relative `uas` are the parts to check: a shorter
    // "Kev Tua Zong Vang Txaus Ntshai" also reads, and the author may prefer it.
    title: 'Kev Tua Zong Vang Uas Txaus Ntshai',
    english: 'The Horrifying Murder of Zong Vang',
    genre: 'true crime',
    level: 'advanced',
    minutes: 15,
    // ⚠️ THE WARNING WIDENED WITH THE TEXT — 2026-09-13. When the threats went
    // in verbatim, "the killing of a child" stopped covering what is in here:
    // one of them is a threat of rape against a fourteen-year-old girl. A
    // content warning that describes an earlier draft is worse than none.
    blurb: 'Green Bay, 1998 — a true case, told in full. The killing of a child, and threats of sexual violence. Not for young readers.',
    // Rendered by StoryWarningModal before the story opens; acknowledgement is
    // stored per story in src/lib/storyWarning.js. Any story may carry one —
    // omit the field and no gate appears.
    warning: {
      title: 'This story is for mature audiences',
      body: 'A horrifying true crime story about the murder of a Hmong boy in Green Bay, Wisconsin, in 1998. Every event in it happened, and the people in it are real.',
      includes: [
        'Torture',
        'Bullying and extreme group violence',
        'The murder of a child',
        'Threats of sexual violence',
        'Descriptions of fatal injuries',
      ],
    },
    paragraphs: [
      [
        {
          hmong: 'Qhov xwm txheej ntawm Zong Vang',
          english: 'What happened to Zong Vang',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Hnub tim nees nkaum plaub, lub Cuaj Hlis, xyoo ib txhiab cuaj puas cuaj caum yim, thaum yav tsaus ntuj, nyob hauv Lub Nroog Green Bay, Xeev Wisconsin, Zong Vang—ib tug tub hluas Hmoob muaj kaum peb xyoo—tau tawm hauv nws tsev mus rau lub khw muas zaub mov yuav txiv lws suav rau nws tus tij laug Zou.',
          english: 'On the evening of September 24, 1998, in Green Bay, Wisconsin, thirteen-year-old Zong Vang left his home to go to the grocery store to buy tomatoes for his older brother Zou.',
        },
      ],
      [
        {
          hmong: 'Thaum Zong caij nws lub tsheb kauj vab, nqa ib lub hnab txiv lws suav raws txoj kev Webster Avenue rov qab los tsev, nws mus ntsib tsib tug hluas:',
          english: 'As Zong rode his bicycle home along Webster Avenue carrying a bag of tomatoes, he came upon five young people:',
        },
      ],
      [
        // ⚠️ `muaj` IS NOT OPTIONAL — corrected by the author 2026-09-13. An age
        // in Hmong is `muaj <number> xyoo`, "has N years", even in a list where
        // English would drop the verb. Dropping it is the mistake a fluent
        // English speaker makes, and it is wrong in every one of these.
        { hmong: 'Omer Ninham, muaj kaum plaub xyoo', english: 'Omer Ninham, fourteen years old' },
        { hmong: 'Richard Crapeau, muaj kaum peb xyoo', english: 'Richard Crapeau, thirteen years old' },
        { hmong: 'Jeffrey P., muaj kaum peb xyoo', english: 'Jeffrey P., thirteen years old' },
        { hmong: 'Amanda G., muaj kaum plaub xyoo', english: 'Amanda G., fourteen years old' },
        { hmong: 'Christian J., muaj kaum plaub xyoo', english: 'Christian J., fourteen years old' },
      ],
      [
        {
          hmong: 'Zong tsis paub cov hluas no, thiab lawv kuj tsis paub Zong.',
          english: 'Zong did not know these young people, and they did not know Zong.',
        },
        {
          hmong: 'Raws li cov lus tim khawv thiab cov ntaub ntawv hauv tsev hais plaub, Zong tsis tau hais los sis ua ib yam dab tsi ua rau lawv chim los sis npau taws.',
          english: 'According to the testimony and the court records, Zong had not said or done anything to anger or provoke them.',
        },
      ],
      [
        {
          hmong: 'Richard Crapeau tau piav qhov pib ntawm qhov xwm txheej hauv nws cov lus qhia rau tub ceev xwm:',
          english: 'Richard Crapeau later detailed the start of the encounter in a statement:',
        },
        {
          hmong: '“Thaum peb taug kev nce mus txoj kev Webster (Avenue), kuv pom tus menyuam Esxias no caij tsheb kauj vab tuaj rau peb.',
          english: '“As we walked up Webster (Avenue) I saw this Asian kid riding a bike toward us.',
        },
        {
          hmong: 'Kuv tseem chim rau kuv niam thiab kuv xav sib ntaus los sis xav pom kev sib ntaus, kuv thiaj hais rau Omer tias, ‘Cia peb ua phem rau tus menyuam no.’',
          english: 'I was still upset with my mom and I wanted to fight or see a fight so I told Omer, ‘Let’s mess with this kid.’',
        },
        {
          hmong: 'Kuv tsis paub tus menyuam no yog leej twg thiab tsis tau nco tau nws.”',
          english: 'I didn’t know who this kid was and didn’t recognize him.”',
        },
        {
          hmong: 'Richard Crapeau yog tus pib qhov xwm txheej no.',
          english: 'Richard Crapeau was the instigator.',
        },
      ],
      [
        {
          hmong: 'Omer thiab Richard txav mus ze Zong, thaiv kev nws txoj kev caij tsheb kauj vab, thiab pib thuam nws.',
          english: 'Omer and Richard moved in close to Zong, blocked the way he was riding, and began taunting him.',
        },
        {
          hmong: 'Peb tug hluas uas nrog nkawd nyob ntawd tau txhawb nkawd thiab saib qhov xwm txheej ntawd.',
          english: 'The three others who were there with them egged the two of them on and watched what was happening.',
        },
        {
          hmong: 'Tsis ntev tom qab ntawd, kev thuam hloov mus ua kev sib ntaus.',
          english: 'Not long after, the taunting turned into a beating.',
        },
      ],
      [
        {
          hmong: 'Richard tsoo Zong lub xub pwg, ua rau Zong poob saum lub tsheb kauj vab los.',
          english: 'Richard bumped into Zong’s shoulder, knocking him off the bicycle.',
        },
        {
          hmong: 'Richard rub lub tsheb kauj vab tawm ntawm Zong, txeeb nws lub hnab txiv lws suav, thiab muab pov mus rau sab St. Vincent Hospital, uas nyob tib txoj kev.',
          english: 'Richard pulled the bicycle away from Zong, snatched his bag of tomatoes, and threw it toward St. Vincent Hospital, on the same street.',
        },
        {
          hmong: 'Thaum Zong thov kom muab nws lub tsheb kauj vab rov qab, Omer ntaus nws lub ntsej muag, ua rau Zong ntog rau hauv av.',
          english: 'When Zong asked for his bicycle back, Omer struck him in the face, knocking him to the ground.',
        },
      ],
      [
        {
          hmong: 'Zong thiaj sawv tsees thiab khiav mus rau St. Vincent Hospital lub chaw nres tsheb ntau theem uas nyob ze ntawd.',
          english: 'Zong got up and ran to the multi-level parking ramp at St. Vincent Hospital nearby.',
        },
        {
          hmong: 'Tsib tug hluas caum nws mus.',
          english: 'The five of them chased him.',
        },
        {
          hmong: 'Lawv caum nws mus, ua rau nws khiav nce txhua theem ntawm lub chaw nres tsheb, mus txog theem saum toj kawg—theem thib tsib.',
          english: 'They chased after him, making him run up each level of the parking ramp before reaching the top floor — the fifth.',
        },
        // AUTHORED — why the running stopped.
        {
          hmong: 'Nws raug vij rau saum ntawd, thiab nrhiav tsis tau lwm txoj kev khiav dim lawm.',
          english: 'He was trapped up there, and could not find another way to run.',
        },
      ],
      [
        {
          hmong: 'Thaum lawv caum cuag Zong, pab hluas ntawd vij nws rau ntawm ntug phab ntsa pob zeb saum theem thib tsib thiab txwv tsis pub nws khiav dim.',
          english: 'When they caught up with Zong, the group hemmed him in against the edge of the concrete wall on the fifth level and would not let him get away.',
        },
        {
          hmong: 'Richard rov ntaus Zong lub ntsej muag dua.',
          english: 'Richard struck Zong in the face again.',
        },
        {
          hmong: 'Zong quaj thiab nug tias, “Ua cas nej ho xav ua phem rau kuv?” thiab thov kom lawv tso nws mus.',
          english: 'Zong cried and asked, “Why are you trying to hurt me?” and pleaded with them to leave him alone.',
        },
      ],
      [
        {
          hmong: 'Tiam sis, Omer thiab Richard pib thawb Zong mus mus los los hauv ib txoj kev ua si uas nkawd hu ua “Chicken,” thaum peb tug hluas ntawd txhawb nkawd.',
          english: 'Instead, Omer and Richard began pushing Zong back and forth in a game they would refer to as “Chicken,” while the other three juveniles cheered them on.',
        },
        {
          hmong: 'Omer ntaus Zong lub hauv siab thaum nws thawb nws mus mus los los, ces txawm tuav Zong ob txhais dab teg, nias nws tsuam rau ntawm lub chaw nres tsheb phab ntsa pob zeb, thiab tuav nws nyob ruaj ntawd.',
          english: 'Omer punched Zong in the chest as he pushed him back and forth, before grabbing Zong by his wrists, pinning him against the parking ramp’s concrete wall, and holding him in place.',
        },
        {
          hmong: 'Thaum Zong raug nias tsuam rau ntawm phab ntsa, nkawd tseem ntaus nws ntxiv.',
          english: 'While Zong was pinned against the wall, they went on beating him.',
        },
        {
          hmong: 'Thaum nws sib zog nrhiav kev dim ntawm Omer txhais tes, Richard rov ntaus nws lub ntsej muag hnyav dua.',
          english: 'When he squirmed to get out of Omer’s grasp, Richard punched him in the face harder.',
        },
        {
          hmong: 'Zong quaj, qw, thiab thov kom nkawd “tso nws mus.”',
          english: 'Zong was crying and screaming, and pleading with the two of them to “let him go.”',
        },
        // AUTHORED. Short sentences on purpose — see the note above this edit
        // in the scratchpad and notes/2026-09-13-zong-vang.md.
        {
          hmong: 'Qhov no tsis yog ib pliag xwb. Lawv muaj sij hawm los tseg.',
          english: 'None of this was quick. They had time to stop.',
        },
        {
          hmong: 'Nws muaj kaum peb xyoo. Nws quaj. Nws thov lawv tso nws mus. Lawv tseem ua ntxiv.',
          english: 'He was thirteen. He was crying. He was asking them to let him go. They kept going.',
        },
      ],
      [
        {
          hmong: 'Tab sis nkawd tsis tso nws mus.',
          english: 'But they didn’t let him go.',
        },
        {
          hmong: 'Thaum Omer tseem tuav Zong ob txhais dab teg, Richard txawm tuav Zong ob txhais pob taws.',
          english: 'Instead, while Omer was still holding onto Zong by his wrists, Richard grabbed Zong by his ankles.',
        },
        {
          hmong: 'Nkawd yoj Zong mus mus los los hla saum ntug phab ntsa pob zeb, uas siab li plaub caum tsib feet saum npoo av.',
          english: 'The two of them swung Zong back and forth out over the edge of the concrete wall, about forty-five feet above the ground.',
        },
        {
          hmong: 'Zong quaj thiab thov kom nkawd tsis txhob tso nws.',
          english: 'Zong cried and begged them not to let go of him.',
        },
        {
          hmong: 'Nws paub tias nws yuav poob, thiab nkawd yoj nws ntev txaus kom nws paub.',
          english: 'He knew he was going to fall, and they swung him long enough that he knew it.',
        },
      ],
      [
        {
          hmong: 'Richard luag thiab nug cov hluas uas sawv ntawd tias, “Puas yuav tsis lom zem yog nws poob?”',
          english: 'Richard laughed and asked the others standing there, “Wouldn’t it be funny if he fell?”',
        },
        {
          hmong: 'Nkawd ob leeg yoj Zong tawm hla phab ntsa, ces Richard tso Zong ob txhais pob taws.',
          english: 'They both swung Zong out over the wall, and Richard let go of Zong’s ankles.',
        },
        {
          hmong: 'Ces nws hais kom Omer “muab nws tso.”',
          english: 'He then told Omer to “drop him.”',
        },
        {
          hmong: 'Omer thiaj tso Zong ob txhais dab teg—yam kawg uas tseem tuav Zong cia kom tsis txhob poob.',
          english: 'So Omer let go of Zong’s wrists — the last thing still holding him from falling.',
        },
        {
          hmong: 'Zong qw thaum nws poob saum theem saum toj ntawm lub chaw nres tsheb mus rau saum txoj kev hauv qab.',
          english: 'Zong screamed as he fell from the top floor of the parking ramp onto the pavement on the ground.',
        },
        // AUTHORED — the force of it. The record has the geometry (¶14).
        {
          hmong: 'Plaub caum tsib feet hauv qab, nws lub cev tsoo rau saum cement nrog lub zog loj kawg nkaus.',
          english: 'Forty-five feet below, his body struck the concrete with tremendous force.',
        },
        {
          hmong: 'Raws li Richard tus kheej cov lus, Zong “ya hla phab ntsa mus xwb.”',
          english: 'In Richard’s own words, Zong “just sailed out over the wall.”',
        },
      ],
      [
        {
          hmong: 'Thaum kwv yees li yim teev tsaus ntuj, ib tug txiv neej hu npe Steven Heraly tab tom tsav tsheb tawm hauv St. Vincent Hospital lub chaw nres tsheb.',
          english: 'At about eight in the evening, a man named Steven Heraly was driving out of the St. Vincent Hospital parking ramp.',
        },
        {
          hmong: 'Nws hnov ib lub suab nrov uas nws piav tias zoo li “ib lub hnab cement poob rau hauv txoj kev.”',
          english: 'He heard a loud sound that he described as like “a bag of cement dropping into the road.”',
        },
        // ⚠️ THE LANDING SITS HERE, NOT IN THE FALL PARAGRAPH — the record puts
        // it with the rescue crew, and the fall paragraph ends on Crapeau's
        // "just sailed out over the wall."
        {
          hmong: 'Zong ntog nrog nws nraub qaum rau saum txoj kev tawm ntawm lub chaw nres tsheb, kaum ob feet ntawm lub chaw nres tsheb lub hauv paus.',
          english: 'Zong landed on his back on the parking ramp’s paved exit lane, twelve feet from the base of the ramp.',
        },
        {
          hmong: 'Cov neeg pab cawm neeg, uas raug xa tuaj thaum yim teev peb feeb tsaus ntuj, pom tias Zong txoj hlab ntsha tseem dhia me ntsis.',
          english: 'Rescue personnel, dispatched at 8:03 p.m., detected a faint pulse from Zong.',
        },
        // AUTHORED — what a faint pulse means. He did not die on impact.
        {
          hmong: 'Txhais tau tias Zong tseem ua neej nyob—tseem muaj sia nyob ib nyuag ntu luv—tom qab nws poob.',
          english: 'Which means Zong was still alive — alive a short while longer — after the fall.',
        },
        {
          hmong: 'Zong raug thauj mus rau St. Vincent Hospital, qhov chaw uas cov kws kho mob tsis muaj peev xwm tsa tau nws sawv rov los.',
          english: 'Zong was then transported to St. Vincent Hospital where physicians were unable to revive him.',
        },
      ],
      [
        {
          hmong: 'Kev kuaj tus tuag lub cev qhia tias Zong raug tsoo hnyav rau nws lub taub hau thiab nws lub cev, thiab tuag los ntawm craniocerebral trauma vim nws poob saum qhov siab los.',
          english: 'An autopsy revealed that Zong suffered a blunt impact to his head and trunk and died from craniocerebral trauma due to a fall from height.',
        },
        // AUTHORED — the plain meaning of the term. A reader who does not know
        // it learns nothing from the line above, and the plain meaning is the
        // most brutal sentence in the story.
        {
          hmong: 'Craniocerebral trauma txhais tau tias lub taub hau thiab lub hlwb raug puas tsuaj ua ke—ib tug menyuam muaj kaum peb xyoo lub taub hau, tawg rau ntawm cement.',
          english: 'Craniocerebral trauma means the skull and the brain destroyed together — a thirteen-year-old’s head, broken on concrete.',
        },
      ],
      [
        {
          hmong: 'Omer, Richard, thiab cov hluas uas nrog nkawd nyob ntawd tsis tau mus xyuas seb Zong zoo li cas li.',
          english: 'Omer, Richard, and the others with them never checked on Zong’s condition.',
        },
        {
          hmong: 'Lawv txhua tus khiav tawm ntawm qhov chaw ntawd.',
          english: 'Instead, they all ran from the scene.',
        },
        // AUTHORED — the end of the scene.
        {
          hmong: 'Lawv tso Zong pw nws ib leeg hauv qhov tsaus ntuj, ntawm lub chaw nres tsheb hauv paus.',
          english: 'They left Zong lying alone in the dark, at the base of the parking ramp.',
        },
      ],
      [
        {
          hmong: 'Tom qab qhov xwm txheej',
          english: 'After it happened',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Tom qab ntawd, Richard tau hais tias pab hluas ntawd ntsia nqes hla phab ntsa thiab pom Zong pw hauv qab.',
          english: 'Richard later said that the group looked down over the wall and saw Zong lying below.',
        },
        {
          hmong: 'Nws cov lus hais tias, “Omer xav nqis mus xyuas seb nws puas tseem muaj sia, tab sis yog nws tsis muaj lawm, peb yuav raug ntes.”',
          english: 'His statement said, “Omer wanted to go down and check to see if he was still alive, but if he wasn’t, we’d be busted.”',
        },
        {
          hmong: 'Thaum pab hluas taug kev rov qab, tsis muaj leej twg hais lus li.',
          english: 'As the group walked back, no one said a word.',
        },
        {
          hmong: 'Lawv hnov lub tsheb thauj neeg mob nrov thaum lawv hla txoj kev East Mason Street.',
          english: 'They heard the ambulance as they crossed East Mason Street.',
        },
        {
          hmong: 'Crapeau hais tias, “Peb twb paub lawm tias tsis muaj leej twg yuav hais dab tsi, peb tsis tas tham txog qhov ntawd.”',
          english: 'Crapeau said, “We pretty much knew nobody would say anything, we didn’t have to talk about it.”',
        },
      ],
      [
        {
          hmong: 'Tau ib ntus, tub ceev xwm tseem tsis tau paub tseeb tias leej twg ua rau Zong tuag.',
          english: 'For a time, the police still did not know for certain who had caused Zong’s death.',
        },
        {
          hmong: 'Tom qab Jeffrey P. thiab Amanda G. qhia lawv cov txheeb ze thiab tub ceev xwm txog tej yam lawv paub, Green Bay Tub Ceev Xwm Lub Chaw Haujlwm thiaj tsom tau rau tsib tug hluas ntawd.',
          english: 'After Jeffrey P. and Amanda G. told their relatives and the police what they knew, the Green Bay Police Department was able to focus on the five.',
        },
      ],
      [
        {
          hmong: 'Jeffrey P. hais rau tub ceev xwm tias, tom qab Zong raug muab tso hla phab ntsa lawm, Omer ntsia nqes rau Zong tau ob peb vib nas this.',
          english: 'Jeffrey P. told the police that after Zong had been dropped over the wall, Omer looked down at him for a few seconds.',
        },
        {
          hmong: 'Jeffrey hais tias Omer tig los hais rau nws tias, “Tsis txhob hais ib los lus li—koj yuav tsum tsis txhob hais ib yam dab tsi li.”',
          english: 'Jeffrey said Omer turned and said to him, “Don’t say nothing, better not say shit.”',
        },
      ],
      [
        {
          hmong: 'Lo lus nug uas tseem ua rau ntau tus xav txog rooj plaub no yog: vim li cas ho tshwm sim li no?',
          english: 'The question that still makes many people think about this case is: why did it happen at all?',
        },
        {
          hmong: 'Vim qhov no tsis yog kev ua pauj los sis kev ua phem rov qab rau leej twg, thiab tsis yog ib qho kev tua neeg uas tau npaj tseg.',
          english: 'Because this wasn’t a vendetta or revenge mission against someone, nor was it a planned killing.',
        },
        {
          hmong: 'Cov hluas no xaiv Zong yam tsis muaj laj thawj, ces tua nws.',
          english: 'These kids picked Zong at random, and then killed him.',
        },
        {
          hmong: 'Puas yog kev ua yam tsis saib xyuas, los yog kev txhob txwm?',
          english: 'Was it reckless conduct, or was it intentional?',
        },
        {
          hmong: 'Richard Crapeau hais tias nws xav sib ntaus los sis xav pom kev sib ntaus. Puas yog qhov no tiag tiag yog qhov nws txhais?',
          english: 'Richard Crapeau stated that he wanted to fight or see a fight. Is this really what he meant?',
        },
      ],
      [
        {
          hmong: 'Tom qab Jeffrey thiab Amanda qhia txog qhov xwm txheej, Lub Nroog Green Bay tub ceev xwm thiaj ntes Richard thiab Omer, thiab nkawd raug coj mus hais plaub sib cais ib yam li neeg laus rau kev tua Zong Vang—kev tua neeg txhob txwm thawj theem.',
          english: 'After Jeffrey and Amanda reported the incident, both Richard and Omer were arrested by the Green Bay police and were both tried separately as adults for the first-degree murder of Zong Vang.',
        },
        {
          hmong: 'Nkawd ob leeg raug kaw hauv Brown County Lub Chaw Kaw Menyuam Yaus.',
          english: 'They were both held at the Brown County Juvenile Detention facility.',
        },
        {
          hmong: 'Nkawd hais tias nkawd tsis ua txhaum.',
          english: 'Both of them pleaded not guilty.',
        },
      ],
      [
        {
          hmong: 'Omer Ninham rooj plaub',
          english: 'Omer Ninham’s trial',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Ua ntej Omer Ninham rooj plaub pib, nws tseem raug foob ntxiv: ib qho kev hem tus kws txiav txim, thiab peb qho kev hem cov neeg ua pov thawj.',
          english: 'Before Omer Ninham’s trial began, he faced further charges: one count of threatening a judge, and three counts of intimidating a witness.',
        },
        {
          hmong: 'Cov kev foob no yog los ntawm cov lus uas nws tau hais thaum nws raug kaw hauv Brown County Lub Chaw Kaw Menyuam Yaus.',
          english: 'Those charges came from things he said while he was held at the Brown County Juvenile Detention Center.',
        },
        {
          hmong: 'Thaum nws raug kaw, nws tau hem tus kws txiav txim Richard J. Dietz txoj sia—tus kws txiav txim uas saib xyuas nws rooj plaub.',
          english: 'While he was held there, he threatened the life of Judge Richard J. Dietz — the circuit court judge presiding over his case.',
        },
        {
          hmong: 'Tom qab nws paub txog lwm cov hluas cov lus qhia rau tub ceev xwm, nws tau hem ntxiv:',
          english: 'After learning of the other juveniles’ statements to the police, he made further threats:',
        },
        {
          hmong: 'tias nws yuav tsav tsheb dhau Jeffrey P. lub tsev thiab tua—ib qho “drive-by”;',
          english: 'that he would carry out a “drive-by” at Jeffrey P.’s house;',
        },
        {
          hmong: 'tias nws yuav yuam cev thiab tua Amanda G.;',
          english: 'that he would “rape and kill” Amanda G.;',
        },
        {
          hmong: 'thiab tias nws yuav npaj kom muaj neeg tua Richard Crapeau tus muam.',
          english: 'and that he would arrange for the killing of Richard Crapeau’s sister.',
        },
      ],
      [
        {
          hmong: 'Hauv Omer rooj plaub uas kav plaub hnub, nws txoj kev tiv thaiv tseem ceeb yog tias nws tsis nyob ntawm lub chaw nres tsheb thaum yav tsaus ntuj Cuaj Hlis 24, 1998.',
          english: 'At Omer’s four-day trial, his main defense was that he was not there on the parking ramp on the evening of September 24, 1998.',
        },
        {
          hmong: 'Nws kuj sib cav tias, txawm nws nyob ntawd los, nws tsis muaj lub siab xav ua kom Zong tuag.',
          english: 'He also argued that even if he had been there, he had no intention of causing Zong’s death.',
        },
      ],
      [
        {
          hmong: 'Zong tsev neeg tau qhia txog txoj kev mob siab heev uas lawv ntsib tom qab plam Zong.',
          english: 'Zong’s family spoke about the deep grief they carried after losing him.',
        },
        {
          hmong: 'Nws niam nws txiv hais tias lawv tau khiav tawm hauv Nplog teb thiab Thaib teb, vam tias Tebchaws Meskas yuav yog ib qho chaw nyab xeeb thiab muaj lub neej zoo dua rau lawv cov menyuam.',
          english: 'His mother and father said they had fled Laos and Thailand, believing the United States would be a safer place and a better life for their children.',
        },
        {
          hmong: 'Lawv hais tias lawv khiav ntawm kev phem, tsuas yog los ntsib kev phem dua hauv lwm qhov chaw.',
          english: 'They said they had fled evil only to find it again in another place.',
        },
        {
          hmong: 'Tom qab Zong tuag, lawv hais tias lawv poob siab rau tib neeg txoj kev siab zoo, thiab cov menyuam uas tseem tshuav ntshai tsis kam tawm hauv tsev mus.',
          english: 'After Zong died, they said, they lost their faith in human kindness, and the children who were left were afraid to go out of the house.',
        },
      ],
      [
        {
          hmong: 'Thaum txog lub sij hawm txiav txim rau txim, Zong tus tij laug Seng Say Vang tau hais lus sawv cev rau tsev neeg thiab cov phooj ywg.',
          english: 'When the time came for sentencing, Zong’s older brother Seng Say Vang spoke on behalf of the family and their friends.',
        },
        {
          hmong: 'Nws thov kom tsev hais plaub muab lub txim hnyav tshaj plaws rau Ninham: kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov.',
          english: 'He asked the court to impose on Ninham the maximum sentence of life imprisonment without parole.',
        },
        {
          hmong: 'Nws thov kom muab “tib txoj kev nyaum thiab tsis muaj kev hlub ib yam li tus uas Ninham tau muab rau Zong thaum Cuaj Hlis 24, 1998.”',
          english: 'He asked for “the same brutal and merciless ultimatum as [Ninham] had given to Zong on September 24th, 1998.”',
        },
      ],
      [
        {
          hmong: 'Seng Say kuj qhia txog nws tsev neeg Hmoob txoj kev ntseeg.',
          english: 'Seng Say also spoke about his family’s Hmong beliefs.',
        },
        {
          hmong: 'Nws hais tias, “Nyob rau hauv peb Hmoob kev cai, peb ntseeg tias tus neeg raug tua tus ntsuj plig yuav tsis tau dim mus nyob kaj siab mus txog thaum cov neeg ua txhaum raug coj los raug kev ncaj ncees.',
          english: 'He said, “In our Hmong culture we believe that the spirit of a murdered person cannot be set free to go in peace until the perpetrators be brought to justice.',
        },
        {
          hmong: 'Yog li ntawd, peb thov Tsev Hais Plaub, tus uas tib leeg muaj hwj chim los tso peb tus tub, tus kwv, thiab tus phooj ywg hlub, Zong, tus ntsuj plig mus nyob kaj siab, los ntawm kev coj Omer Ninham thiab nws cov neeg koom tes los raug kev ncaj ncees.”',
          english: 'Therefore, we ask the Court, who is the only one to have the power to set free the spirit of our beloved son, brother, and friend, Zong, to go in peace by bringing Omer Ninham and his accomplices to justice.”',
        },
      ],
      [
        {
          hmong: 'Thaum xaus rooj plaub, Omer tus kws lij choj lees tias Omer nyob ntawm lub chaw nres tsheb nrog Zong, thiab lees txais qhov kev foob ua phem rau menyuam yaus.',
          english: 'In the closing arguments, Omer’s counsel did not deny that he was on the parking ramp with Zong, and actually conceded the charge of physical abuse of a child.',
        },
        {
          hmong: 'Nws hais tias, “Hais txog kev ua phem rau menyuam yaus, kuv yuav tsis sib cav txog qhov ntawd. Kuv xav tias muaj kev thawb mus thawb los, muaj kev ntaus. Kuv xav tias Omer tau koom nrog rau qhov ntawd.”',
          english: 'He said, “In terms of the abuse of a child, I’m not going to argue that. I think obviously there was some pushing back and forth, some punching going on. I think Omer participated in that.”',
        },
        {
          hmong: 'Tab sis tus kws lij choj sib cav tias lub xeev tsis tau muab pov thawj tias Omer, thaum nws muaj kaum plaub xyoo, muaj lub siab txhob txwm tua Zong.',
          english: 'But the lawyer argued that the state had not proved that Omer, at fourteen years old, had the deliberate intention of killing Zong.',
        },
        {
          hmong: 'Nws hais tias, “Kev txiav txim tsis zoo? Ib tug hluas phem? Phem ntau yam? Tab sis kuv tsis xav tias koj muab tau Omer Ninham lub txim tua neeg txhob txwm los ntawm cov pov thawj hauv rooj plaub no.”',
          english: 'He said, “Bad judgment? Bad juvenile? Bad a lot of things. But I don’t think you can saddle Omer Ninham at this point from the facts and evidence on this record with intentional homicide.”',
        },
        {
          hmong: 'Cov kws foob teb tias, txawm nkawd tsis xav tua Zong los, nkawd paub tseeb tias qhov nkawd ua yuav ua rau nws tuag.',
          english: 'The prosecutors answered that even if Omer and Richard did not intend to kill Zong, they knew that their actions were certain to cause death.',
        },
      ],
      [
        {
          hmong: 'Omer kuj hais lus thaum txiav txim rau txim. Nws hais tias nws thov txim rau Zong txoj kev tuag.',
          english: 'Omer also spoke at sentencing. He told the court that he was sorry about Zong’s death.',
        },
        {
          hmong: 'Tab sis nws hais ntxiv tias, “Tsis muaj dab tsi kuv ua tau. Kuv tsis nyob ntawd. Kuv yuav hais li no mus txog hnub kuv tuag. Kuv tsis nyob ntawd, thiab qhov ntawd yog qhov tseeb.”',
          english: 'But he went on, “There wasn’t nothing I could do. I wasn’t there. I’m going to keep saying that until the day I die. I was not there, and that’s the honest truth.”',
        },
      ],
      [
        {
          hmong: 'Hnub tim nees nkaum plaub, lub Peb Hlis, xyoo ob txhiab, pawg neeg txiav txim tau txiav txim tias Omer Ninham ua txhaum kev tua neeg txhob txwm thawj theem thiab kev ua phem rau menyuam yaus.',
          english: 'On 24 March 2000, the jury found Omer Ninham guilty of first-degree intentional homicide and physical abuse of a child.',
        },
      ],
      [
        {
          hmong: 'Tsev hais plaub ua lub rooj txiav txim rau txim rau hnub tim nees nkaum cuaj, lub Rau Hli, xyoo ob txhiab.',
          english: 'The circuit court conducted a sentencing hearing on June 29, 2000.',
        },
        {
          hmong: 'Thaum pib, lub xeev thov muab qhov kev foob hem tus kws txiav txim thiab peb qhov kev foob hem cov neeg ua pov thawj tso tseg—tab sis thov kom nyeem plaub qhov kev foob ntawd rau hauv cov ntaub ntawv.',
          english: 'At the outset, the State moved to dismiss the single count of threat to a judge and three counts of intimidation of a witness, but asked that all four charges be read in.',
        },
        {
          hmong: 'Tsev hais plaub pom zoo. Txhais tau tias tsis muaj kev txiav txim rau plaub qhov ntawd, tab sis tsev hais plaub tseem xav txog lawv thaum txiav txim rau txim.',
          english: 'The circuit court granted the motion — which means there was no conviction on those four, but the court could still weigh them in sentencing.',
        },
      ],
      [
        {
          hmong: 'Daim ntawv tshawb nrhiav ua ntej txiav txim qhia tias Ninham, uas muaj kaum rau xyoo lawm, tseem tsis lees tias nws koom nrog rau Zong txoj kev tuag.',
          english: 'The pre-sentence investigation revealed that Ninham, by then sixteen years old, continued to deny any involvement in Zong’s homicide.',
        },
        {
          hmong: 'Daim ntawv ntawd hais tias, “raws li txhua yam lus qhia, Ninham tuaj ntawm ib tsev neeg uas puas tsuaj heev”—ib tsev neeg uas nws niam nws txiv thiab ob peb tus kwv tij muaj teeb meem yeeb tshuaj hnyav thiab kev sib ntaus sib tua hauv tsev.',
          english: 'It said that “by all accounts, Ninham emanates from an extremely dysfunctional family structure,” in which both of his parents and several of his siblings engage in severe substance abuse and domestic violence.',
        },
        {
          hmong: 'Nws raug piav tias yog ib tug “neeg siv yeeb tshuaj hnyav” uas nqus cocaine txhua lub lim tiam, thiab haus cawv txhua hnub txij thaum nws kawm ntawv theem pib—feem ntau nws ib leeg, thiab feem ntau mus txog thaum nws tsis paub qab hau.',
          english: 'He was described as a “serious substance abuser” who snorted cocaine on a weekly basis and, since grade school, drank alcohol every day, often alone, and usually to the point of unconsciousness.',
        },
        {
          hmong: 'Ninham yog ib tug tswv cuab ntawm Menominee Indian Tribe, thiab nws hais tias nws nyuam qhuav muaj kev txaus siab tshiab rau Native American kev ntseeg.',
          english: 'Ninham, a member of the Menominee Indian Tribe, claimed to have a newfound interest in Native American spirituality.',
        },
      ],
      [
        {
          hmong: 'Thaum txiav txim rau txim, tsev hais plaub xav txog peb yam tseem ceeb: qhov kev ua txhaum hnyav npaum li cas, tus neeg ua txhaum tus cwj pwm, thiab qhov yuav tsum tiv thaiv pej xeem.',
          english: 'In imposing Ninham’s sentence, the circuit court considered three primary factors: the gravity of the offense, the character of the offender, and the need to protect the public.',
        },
        {
          hmong: 'Ib: tsev hais plaub hais tias qhov kev ua txhaum hnyav “dhau qhov piav tau,” thiab “txaus ntshai” yam tsis muaj leej twg sib cav tau, thiab nws cuam tshuam rau Zong tsev neeg, nws cov phooj ywg, thiab lub zej zog hauv Lub Nroog Green Bay yam piav tsis tau.',
          english: 'First, the circuit court regarded the gravity of the offense as “beyond description” and indisputably “horrific,” with an indescribable impact on Zong’s family and friends and on the Green Bay community.',
        },
        {
          hmong: 'Ob: txog tus neeg ua txhaum tus cwj pwm, tsev hais plaub “lees rau kev sib tham tias Omer Ninham yog ib tug menyuam,” tab sis piav nws tias yog “ib tug tub hluas txaus ntshai.”',
          english: 'Second, on the character of the offender, the circuit court “conceded for the sake of discussion that Omer Ninham is a child” but nevertheless described him as “a frightening young man.”',
        },
        {
          hmong: 'Tsev hais plaub lees tias Ninham tuaj ntawm ib tsev neeg uas puas tsuaj, tab sis tsis kam cia qhov ntawd zam txim rau nws: nws yog “ib tug menyuam ntawm txoj kev uas paub qhov nws ua.”',
          english: 'The circuit court acknowledged that Ninham derives from a dysfunctional family but refused to let that excuse his conduct, explaining that he is “a child of the street who knew what he was doing.”',
        },
        {
          hmong: 'Peb: tsev hais plaub hais tias zej zog yuav tsum raug tiv thaiv ntawm Ninham—“Zej tsoom yuav tsum paub, thiab tshwj xeeb tshaj yog zej zog no yuav tsum paub, tias koj xa tau koj tus menyuam mus rau lub khw thiab cia siab tias koj yuav rov pom nws dua.”',
          english: 'Third, the circuit court reasoned that the community needs to be protected from Ninham: “Society needs to know, and especially this community needs to know, that you can send your child to the grocery store and expect to see him again.”',
        },
      ],
      [
        {
          hmong: 'Rau qhov kev foob tua neeg txhob txwm thawj theem, tsev hais plaub txiav txim rau Ninham kom raug kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov.',
          english: 'As to the count of first-degree intentional homicide, the circuit court sentenced Ninham to life imprisonment without the possibility of parole.',
        },
        {
          hmong: 'Rau qhov kev foob ua phem rau menyuam yaus, tsev hais plaub txiav txim rau nws kom raug kaw tsib xyoo ntxiv, ua ntxiv rau lub txim kaw mus tas sim neej.',
          english: 'For the count of physical abuse of a child, the circuit court sentenced him to five years imprisonment, consecutive to the life sentence.',
        },
      ],
      [
        {
          hmong: 'Richard Crapeau raug txiav txim tias ua txhaum ua ib tug koom tes rau kev tua neeg txhob txwm thawj theem thiab ua ib tug koom tes rau kev ua phem rau menyuam yaus.',
          english: 'Richard Crapeau was convicted of being party to first-degree intentional homicide and party to physical abuse of a child.',
        },
        {
          hmong: 'Nws raug kaw mus tas sim neej, tab sis muaj cai thov tawm ntxov tom qab raug kaw tsib caug xyoo.',
          english: 'He was sentenced to life in prison with the possibility of parole after fifty years.',
        },
        {
          hmong: 'Raws li tus kws foob hais, txoj kev ntshai uas tus raug tsim txom thiab nws tsev neeg thiab phooj ywg tau ntsib yog—hais ib lo lus—tsis muaj leej twg xav txog tau.',
          english: 'As the prosecutor put it, the terror experienced by the victim and his family and friends is, in a word, unimaginable.',
        },
        {
          hmong: 'Nws hais tias qhov kev ua phem tsis muaj laj thawj no yuav tsum tsis txhob tshwm sim dua li lawm.',
          english: 'He said this cruel and senseless crime should never, ever happen again.',
        },
      ],
      [
        {
          hmong: 'Jeffrey P., Amanda G., thiab Christian J. tsis raug foob rau Zong txoj kev tuag, vim cov ntaub ntawv tsis qhia tias lawv yog cov ntaus los sis cov tuav Zong thaum nws raug muab tso hla phab ntsa.',
          english: 'Jeffrey P., Amanda G., and Christian J. were not charged in Zong’s death, because the record did not show that they were the ones who struck him or held him when he was dropped over the wall.',
        },
      ],
      [
        {
          hmong: 'Kev thov rov hais plaub dua',
          english: 'The appeal',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Richard Crapeau thov kom rov hais nws rooj plaub dua, hais tias nws tsis nyob ntawm lub chaw nres tsheb hmo ntawd, tab sis nyob lwm qhov haus yeeb tshuaj.',
          english: 'Richard Crapeau asked for a new trial, claiming he was not at the parking ramp that night and was instead elsewhere smoking marijuana.',
        },
        {
          hmong: 'Hnub tim nees nkaum, lub Ib Hlis, xyoo ob txhiab, tus kws txiav txim Richard Dietz tsis kam, vim cov lus ntawd tsis tsim nyog ntseeg.',
          english: 'On 20 January 2000, Judge Richard Dietz denied it, finding the claim lacked credibility.',
        },
        {
          hmong: 'Crapeau thiaj thov mus rau Lub Tsev Hais Plaub Rov Hais Dua, tab sis hnub tim kaum, lub Plaub Hlis, xyoo ob txhiab ib, lub tsev hais plaub ntawd tsis kam thiab tuav nws lub txim cia.',
          english: 'Crapeau then appealed to the Court of Appeals, but on 10 April 2001 that court rejected his arguments and upheld the conviction.',
        },
      ],
      [
        {
          hmong: 'Tom qab kev txiav txim, Omer Ninham tau thov kom rov hais nws lub txim dua.',
          english: 'After the sentence, Omer Ninham asked for his sentence to be heard again.',
        },
        {
          hmong: 'Nws sib cav tias kev muab ib tug hluas muaj kaum plaub xyoo kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov yog kev rau txim hnyav dhau thiab tsis tsim nyog raws li Tebchaws Meskas Txoj Cai Lij Choj thiab Wisconsin Txoj Cai Lij Choj.',
          english: 'He argued that sentencing a fourteen-year-old to life without parole was excessive punishment, and not justified under the law of the United States or the law of Wisconsin.',
        },
      ],
      [
        {
          hmong: 'Nws qhov kev sib cav nce mus txog Wisconsin Lub Tsev Hais Plaub Siab Tshaj, tab sis xyoo ob txhiab kaum ib—yuav luag kaum peb xyoo tom qab qhov kev ua txhaum—lub tsev hais plaub ntawd tau txiav txim kom tuav Ninham lub txim qub cia.',
          english: 'His argument made its way up to the Wisconsin Supreme Court, but in 2011 — nearly thirteen years after the crime — that court maintained the original judgment.',
        },
        {
          hmong: 'Lub tsev hais plaub txiav txim tias, nyob rau hauv ib rooj plaub tua neeg txhob txwm, kev kaw ib tug hluas muaj kaum plaub xyoo mus tas sim neej yam tsis muaj cai thov tawm ntxov tsis yog kev rau txim uas txhaum Tsab Cai Hloov Kho Thib Yim (Eighth Amendment) los sis Wisconsin Txoj Cai Lij Choj Loj (Wisconsin Constitution).',
          english: 'The court held that in a case of intentional homicide, sentencing a fourteen-year-old to life without parole is not a punishment that violates the Eighth Amendment or the Wisconsin Constitution.',
        },
        {
          hmong: 'Lub tsev hais plaub kuj siv nws tus kheej txoj kev txiav txim thiab hais tias lub txim ntawd tsis yog kev rau txim nyaum thiab txawv txav rau rooj plaub no, thiab tsis lees txais qhov kev sib cav tias lub txim hnyav dhau.',
          english: 'The court also exercised its own independent judgment and determined that the punishment was not cruel and unusual in this context, and it rejected the claim that the sentence was unduly harsh or excessive.',
        },
      ],
      [
        {
          hmong: 'Lub tsev hais plaub tau tham txog Graham v. Florida, ib rooj plaub uas txwv tsis pub muab cov menyuam yaus kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov rau tej kev ua txhaum uas tsis yog kev tua neeg.',
          english: 'The court discussed Graham v. Florida, a case that forbids sentencing children to life without parole for offences that are not homicide.',
        },
        {
          hmong: 'Tab sis Wisconsin Lub Tsev Hais Plaub Siab Tshaj hais tias txoj cai ntawd tsis ncaj qha siv tau rau Ninham, vim Ninham raug txim rau kev tua neeg txhob txwm.',
          english: 'But the Wisconsin Supreme Court said that rule did not apply directly to Ninham, because Ninham was convicted of intentional homicide.',
        },
      ],
      [
        {
          hmong: 'Raws li cov ntaub ntawv txog xyoo 2026, Richard Crapeau raug kaw ntawm Racine Correctional Institution hauv Lub Nroog Racine, Xeev Wisconsin.',
          english: 'According to records as of 2026, Richard Crapeau is held at the Racine Correctional Institution in Racine, Wisconsin.',
        },
        {
          hmong: 'Nws twb raug kaw li nees nkaum yim xyoo lawm, thiab nws hnub muaj cai thov tawm ntxov tseem tshuav ntau caum xyoo.',
          english: 'He has served roughly twenty-eight years, and his parole eligibility remains several decades away.',
        },
        {
          hmong: 'Omer Ninham raug kaw ntawm Fox Lake Correctional Institution.',
          english: 'Omer Ninham is incarcerated at the Fox Lake Correctional Institution.',
        },
        {
          hmong: 'Nws raug kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov, ua rau nws yog ib tug ntawm cov tsawg tsawg hauv Xeev Wisconsin keeb kwm uas tau txais lub txim no rau kev ua txhaum thaum muaj kaum plaub xyoo.',
          english: 'He was sentenced to life without the possibility of parole, making him one of the few people in Wisconsin history to receive such a sentence for a crime committed at the age of fourteen.',
        },
      ],
      [
        {
          hmong: 'Nco txog Zong Vang',
          english: 'Remembering Zong Vang',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Tom qab qhov kev txiav txim kawg, Zong tus tij laug Seng Vang hais tias qhov ntawd zoo li yog ib kauj ruam loj rau tsev neeg los kho lawv txoj kev mob siab uas plam lawv tus kwv.',
          english: 'After the final ruling, Zong’s older brother Seng Vang said it felt like a large step for the family toward healing the grief of losing their younger brother.',
        },
        {
          hmong: 'Nws hais tias tag nrho qhov no “ua rau lub siab mob heev,” thiab hais tias, “Kuv niam kuv txiv yuav tsa muag saib Vajtswv thiab thov nws zam txim rau nws tsev neeg thiab rau Richard.”',
          english: 'He said the experience had been “so emotional,” and said, “My parents will look towards God and they will ask him to forgive his family and Richard.”',
        },
        {
          hmong: 'Nws nco txog Zong tias yog ib tug tub uas “muab siab rau txhua yam nws ua” thiab tau npau suav xav ua kws kho mob.',
          english: 'He remembered Zong as a boy who “put so much desire into everything he did,” and who had once dreamed of becoming a doctor.',
        },
      ],
      [
        {
          hmong: 'Zong Vang tsuas yog ib tug tub hluas uas tawm mus yuav txiv lws suav los pab nws tsev neeg xwb.',
          english: 'Zong Vang was a boy who went out to buy tomatoes to help his family, and nothing more than that.',
        },
        {
          hmong: 'Nws tsim nyog tau rov los tsev nyab xeeb.',
          english: 'He deserved to come home safely.',
        },
      ],
      [
        {
          hmong: 'Zong tus tij laug, Nhee, piav nws tias yog ib tug “neeg ua haujlwm khov kho” uas tau khaws nyiaj tau ib txhiab tsib puas duas las los ntawm nws txoj haujlwm xa ntawv.',
          english: 'Zong’s older brother, Nhee, described him as a “strong worker” who had saved $1,500 from his paper route.',
        },
        {
          hmong: 'Zong tau khaws nyiaj tau ib txhiab tsib puas duas las los ntawm nws txoj haujlwm xa ntawv.',
          english: 'Zong had saved fifteen hundred dollars from his paper route.',
        },
        {
          hmong: 'Nws txawj ntaus bass cello, thiab cov neeg uas paub nws piav tias nws yog ib tug neeg txaus luag.',
          english: 'He could play the bass cello, and people who knew him said he was funny.',
        },
      ],
      [
        {
          hmong: 'Zong niam, Mai Chou Yang, piav txog kev plam nws tus tub tias zoo li muaj neeg rub nqaij tawm ntawm nws lub cev.',
          english: 'Zong’s mother, Mai Chou Yang, described losing her son as like having flesh pulled from her body.',
        },
      ],
      [
        {
          hmong: 'Niaj hnub no, Zong tseem raug nco txog hauv Lub Nroog Green Bay.',
          english: 'To this day, Zong is still remembered in Green Bay.',
        },
        {
          hmong: 'Muaj ib qho chaw nco txog nws nyob hauv St. James Park, nrog ib tsob ntoo oak uas cog rau nws lub npe.',
          english: 'There is a memorial to him in St. James Park, with an oak tree planted in his name.',
        },
        {
          hmong: 'Kuj muaj ib lub rooj zaum pob zeb uas raug them ob txhiab tsib puas duas las, sau cov lus “phooj ywg, menyuam yaus, neeg zej zog” ua lus Askiv thiab lus Hmoob.',
          english: 'There is also a $2,500 memorial stone bench, inscribed with the words “friend, child, neighbor” in both English and Hmong.',
        },
      ],
      [
        {
          hmong: 'Txawm rooj plaub no cov kev hais plaub xaus los ntau caum xyoo lawm, nws tseem yog ib tshooj ntawv tu siab hauv Lub Nroog Green Bay keeb kwm—qhov chaw uas ib tug tub “ua haujlwm khov kho” thiab ib tug kwv uas raug hlub tseem raug nco txog.',
          english: 'And although the legal proceedings of this case concluded decades ago, the case remains a somber chapter in Green Bay’s history, marking the spot where a boy who was a “strong worker” and beloved brother is still remembered.',
        },
        {
          hmong: 'Ib txoj haujlwm mus khw thaum yav tsaus ntuj uas xaus rau ib qho kev ua txhaum txaus ntshai tshaj plaws hauv Xeev Wisconsin keeb kwm.',
          english: 'An evening errand to the grocery that ended in one of the most horrifying crimes in Wisconsin history.',
        },
        {
          hmong: 'Thiab txawm peb yuav tsis paub li cas tsib tug hluas ho xav ua phem rau ib tug neeg yam tsis muaj laj thawj, qhov peb kawm tau yog qhov yuav tshwm sim los ntawm kev ua li ntawd.',
          english: 'And although we may never understand why five juveniles wanted to hurt someone for no reason, what we can learn is the consequences of doing so.',
        },
        {
          hmong: 'Tab sis qee zaum, kev phem nkaum nyob rau hauv cov chaw uas peb xav tsis txog li.',
          english: 'But sometimes, evil lurks in the most unsuspecting places.',
        },
      ],
      [
        {
          hmong: 'Tus kab raub ris thiab tus qav',
          english: 'The scorpion and the frog',
          heading: true,
        },
      ],
      [
        {
          hmong: 'Muaj ib zaj lus qub txog tus kab raub ris thiab tus qav.',
          english: 'There is an old story about the scorpion and the frog.',
        },
        {
          hmong: 'Tus kab raub ris thov tus qav thauj nws hla tus dej loj. Tus qav ntshai tsam raug tshaws.',
          english: 'The scorpion asked the frog to carry it across the river. The frog was afraid of being stung.',
        },
        {
          hmong: '“Yog kuv tshaws koj,” tus kab raub ris hais, “wb ob leeg yuav tuag.” Tus qav thiaj ntseeg nws.',
          english: '“If I sting you,” the scorpion said, “we will both drown.” So the frog believed it.',
        },
        {
          hmong: 'Thaum nkawd nyob nruab nrab tus dej loj, tus kab raub ris tshaws tus qav.',
          english: 'Halfway across the river, the scorpion stung the frog.',
        },
        {
          hmong: 'Thaum tus qav nug tias ua cas, tus kab raub ris teb tias, “Vim qhov ntawd yog kuv lub siab. Kuv tsis hloov tau.”',
          english: 'As the frog asked why, the scorpion answered, “Because it is my nature. I cannot change it.”',
        },
        {
          hmong: 'Tus qav tsis muaj zog lawm, ces nkawd ob leeg poob rau hauv dej.',
          english: 'The frog lost its strength, and the two of them went under.',
        },
        {
          hmong: 'Nkawd ob leeg tuag hauv tus dej loj ua ke.',
          english: 'They both drowned in the river.',
        },
        {
          hmong: 'Tus kab raub ris twb paub tias yuav zoo li ntawd. Nws tseem tshaws.',
          english: 'The scorpion already knew that was how it would end. It stung anyway.',
        },
      ],
      [
        {
          hmong: 'Muaj coob tus neeg zoo li tus kab raub ris nyob hauv lub ntiaj teb no. Lawv nyob nrog peb.',
          english: 'There are many people like the scorpion in this world. They live among us.',
        },
        {
          hmong: 'Lawv tsis xav tau ib yam dab tsi ntawm koj. Lawv tsis chim rau koj. Lawv tsis paub koj lub npe.',
          english: 'They want nothing from you. They are not angry with you. They do not know your name.',
        },
        {
          hmong: 'Thiab lawv zoo li koj thiab kuv.',
          english: 'And they look like you and me.',
        },
        {
          hmong: 'Ib txhia muaj lub cim ntawm txoj cai. Ib txhia muaj phom. Ib txhia zaum ntawm koj lub rooj noj mov.',
          english: 'Some of them wear the badge of the law. Some of them carry a gun. Some of them sit at your table.',
        },
        {
          hmong: 'Ib txhia ua phem tab meeg. Ib txhia ua txuj ua koj phooj ywg ua ntej.',
          english: 'Some of them do harm out in the open. Some of them will pretend to be your friend first.',
        },
        {
          hmong: 'Ib txhia yog txiv neej. Ib txhia yog poj niam.',
          english: 'Some of them are men. Some of them are women.',
        },
        {
          hmong: 'Ib txhia tseem yog Hmoob, ib yam li koj.',
          english: 'Some of them are Hmong, the same as you.',
        },
        {
          hmong: 'Lawv ua phem vim qhov ntawd yog lawv lub siab. Tsis muaj laj thawj li.',
          english: 'They do harm because that is their nature. There is no reason to it.',
        },
        {
          hmong: 'Koj yuav tsis pom lawv tuaj. Lawv tseem zoo li ib pab hluas uas taug kev hauv ib txoj kev xwb.',
          english: 'You will not see them coming. They can even look like a group of kids walking down a street.',
        },
        {
          hmong: 'Yog li ntawd: ceev faj rau lwm tus. Tsis txhob tso siab rau cov neeg koj tsis paub, txawm lawv tseem me los.',
          english: 'So: be careful around other people. Do not trust strangers, however young they look.',
        },
        {
          hmong: 'Zong tsis tau ua ib yam dab tsi txhaum. Nws tsuas caij nws lub tsheb kauj vab los tsev xwb. Qhov ntawd twb txaus rau cov neeg phem no muab nws tua tsis muaj laj thawj li lawm.',
          english: 'Zong did nothing wrong. He was riding his bicycle home. That was enough for these bad people to randomly kill him.',
        },
      ],
      [
        {
          hmong: 'Nyob kaj siab, Zong Vang.',
          english: 'Rest in peace, Zong Vang.',
        },
      ],
    ],
    // ⚠️ THE FIRST THIRTEEN ARE THE AUTHOR'S OWN TERMINOLOGY TABLE, supplied
    // with the text as English→Hmong pairs so the legal vocabulary stays
    // consistent across the whole piece. Do not reword them.
    //
    // One term from that table is NOT here: "Lub Tsev Hais Plaub Rov Hais Dua"
    // (Court of Appeals). The phrase never appears in the text, and a glossary
    // entry that cannot be tapped is invisible. It is recorded in
    // notes/2026-09-13-zong-vang.md instead, where the next text about this case
    // will find it.
    glossary: [
      { hmong: 'Lub Nroog Green Bay, Xeev Wisconsin', english: 'the City of Green Bay, State of Wisconsin' },
      { hmong: 'Green Bay Tub Ceev Xwm Lub Chaw Haujlwm', english: 'the Green Bay Police Department' },
      { hmong: 'Brown County Lub Chaw Kaw Menyuam Yaus', english: 'the Brown County Juvenile Detention Center' },
      { hmong: 'kev tua neeg txhob txwm thawj theem', english: 'first-degree intentional homicide' },
      { hmong: 'kev ua phem rau menyuam yaus', english: 'physical abuse of a child' },
      { hmong: 'kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov', english: 'life without parole' },
      { hmong: 'muaj cai thov tawm ntxov tom qab raug kaw tsib caug xyoo', english: 'parole eligible after fifty years' },
      { hmong: 'Wisconsin Lub Tsev Hais Plaub Siab Tshaj', english: 'the Wisconsin Supreme Court' },
      { hmong: 'Tsab Cai Hloov Kho Thib Yim', english: 'the Eighth Amendment' },
      { hmong: 'Wisconsin Txoj Cai Lij Choj Loj', english: 'the Wisconsin Constitution' },
      { hmong: 'pawg neeg txiav txim', english: 'jury' },
      { hmong: 'kev kuaj tus tuag lub cev', english: 'autopsy; examination of the body' },
      { hmong: 'tub ceev xwm', english: 'police; a police officer' },
      // ⚠️ BACK IN — the author's table had this and the first draft dropped it
      // as "never appears in the text". It did not appear because Crapeau's
      // appeal was missing, not because the term was surplus.
      { hmong: 'Lub Tsev Hais Plaub Rov Hais Dua', english: 'the Court of Appeals' },
      { hmong: 'tus kws txiav txim', english: 'judge' },

      // ⚠️ EVERYTHING BELOW IS A DRAFT GLOSS WRITTEN HERE, not supplied. They
      // are in the STORY's glossary rather than src/data/vocabulary.js on
      // purpose: a story glossary is scoped to this text, so a reading that is
      // right here cannot leak a wrong sense into the dictionary, the quiz or
      // the review queue the way `rau` did. See
      // learning/concepts/lookup-ranking-and-fallbacks.md.
      { hmong: 'rooj plaub', english: 'a legal case; a trial' },
      { hmong: 'tsev hais plaub', english: 'court; courthouse' },
      { hmong: 'txiav txim', english: 'to decide, to judge; to sentence' },
      { hmong: 'raug foob', english: 'to be charged; to be sued' },
      { hmong: 'raug ntes', english: 'to be arrested, to be caught' },
      { hmong: 'sib cav', english: 'to argue, to contend' },
      { hmong: 'pov thawj', english: 'proof, evidence — "neeg ua pov thawj", a witness' },
      { hmong: 'tim khawv', english: 'testimony; a witness' },
      { hmong: 'kws lij choj', english: 'lawyer, attorney' },
      { hmong: 'txhob txwm', english: 'deliberate, on purpose, intentional' },
      { hmong: 'tsheb kauj vab', english: 'bicycle' },
      { hmong: 'txiv lws suav', english: 'tomato' },
      { hmong: 'chaw nres tsheb', english: 'a parking place — here, a multi-level parking ramp' },
      { hmong: 'phab ntsa', english: 'wall' },
      { hmong: 'pob zeb', english: 'stone, rock — here, concrete' },
      { hmong: 'ntsej muag', english: 'face' },
      { hmong: 'dab teg', english: 'wrist' },
      { hmong: 'xub pwg', english: 'shoulder' },
      { hmong: 'thuam', english: 'to taunt, to mock, to insult' },
      { hmong: 'thawb', english: 'push; shove (transitive verb) · promote; urge forward (transitive verb)' },
      { hmong: 'txeeb', english: 'to snatch, to grab away' },
      // ⚠️ The number sense was removed on review: the tens element is CAUG,
      // not caum. See the `caug` entry.
      { hmong: 'caum', english: 'to chase, to pursue; to follow after' },
      { hmong: 'vij', english: 'to surround, to hem in' },
      { hmong: 'yoj', english: 'to swing, to sway back and forth' },
      { hmong: 'kws kho mob', english: 'doctor' },
      { hmong: 'mob', english: 'sick; ill — and as a noun, pain, illness or injury: “raug mob”, injured. NOT “doctor”: that is “kws kho mob”.' },
      // ⚠️ TIER-3 BACKFIRE, ALL FROM THIS STORY'S OWN GLOSSED PHRASES. Each of
      // these was answering with a fragment of a longer entry — three of them
      // with a named institution. Tier 1 is the only thing that outranks that.
      { hmong: 'choj', english: 'bridge (noun)' },
      { hmong: 'haujlwm', english: 'work; job; employment (noun) · task; duty; responsibility (noun) · activity; operation; undertaking (noun)' },
      { hmong: 'pov', english: 'throw; toss (transitive verb) · pov thawj = proof; evidence (compound noun) · neeg ua pov thawj = witness (compound noun) — ⚠ proof/evidence is not a standalone core sense of pov' },
      { hmong: 'vab', english: 'net; web (noun) · tsheb kauj vab = bicycle (compound noun)' },
      { hmong: 'ntuj', english: 'sky (noun) · heaven; upper spiritual realm (noun) · hmo ntuj = night (compound noun) · tsaus ntuj = evening; nighttime; darkness (compound time expression)' },
      { hmong: 'phooj', english: 'bound word — not used alone: phooj ywg = friend (compound noun)' },
      { hmong: 'ywg', english: 'bound word — not used alone: phooj ywg = friend (compound noun)' },
      { hmong: 'tua', english: 'kill; slaughter an animal (transitive verb) · shoot; fire something — a gun, a bow, an arrow (transitive verb) · fight — "tua rog", to fight in a war; "sib tua", to fight to the death, to kill each other · turn off; put out, extinguish — a light, a fire: "tua teeb", "tua hluav taws" (transitive verb) · beat; strike an instrument (transitive verb)' },  // completed 2026-09-30 — same text as misc-tua in vocabulary.js
      { hmong: 'phem', english: 'bad; evil; harmful (adjective) · severe; serious (adjective)' },
      { hmong: 'kom', english: 'so that; in order that (purpose complementizer) · tell; direct someone to do something (causative / directive verb) · clause linker for a request, command, desired outcome, or result (complementizer)' },
      { hmong: 'tom', english: 'at; over at; located at (locative marker / preposition) · bite (transitive verb) · tom qab = after; later; behind (compound preposition / temporal expression) · separately (adverb)' },
      { hmong: 'koj', english: 'you, one person (second-person singular pronoun) · your; yours (possessive pronoun)' },
      { hmong: 'rooj', english: 'table (noun) · rooj plaub = legal case; lawsuit; trial (compound noun)' },
      { hmong: 'tub', english: 'son; boy (noun) · male-person / role element in compounds (compound-noun element) · tub hluas = young man (compound noun) · tub ceev xwm = police officer; police (compound noun)' },
      { hmong: 'ntsa', english: 'wall (noun) · cliff; steep wall-like surface (noun) — ⚠ phab ntsa = wall (compound noun)' },
      // Joined day word 2026-09-27 (author). Was: { hmong: 'ntxov', english: 'early (adjective / adverb) · morning or early-day element, as in tag kis ntxov = tomorrow morning (time-expression element)' },
      { hmong: 'ntxov', english: 'early (adjective / adverb) · morning or early-day element, as in tagkis ntxov = tomorrow morning (time-expression element)' },
      { hmong: 'twg', english: 'which; what; where; who, depending on construction (interrogative word) · qhov twg = where; which place (interrogative compound) · thaum twg = when (interrogative compound) · leej twg = who (interrogative compound)' },
      { hmong: 'tsi', english: 'what (interrogative word) · anything; something in indefinite or negative constructions (indefinite interrogative element) · dab tsi = what; anything (compound interrogative phrase) · yam dab tsi = anything; something (compound noun phrase)' },
      { hmong: 'cas', english: 'how; why; what kind of, depending on construction (interrogative word) · vim li cas = why (compound interrogative expression) · kim npaum li cas = how expensive; how much (compound question expression)' },
      { hmong: 'tuaj', english: 'come (motion verb) · arrive (motion verb) · come to be; arise (directional / resultative verb element)' },
      { hmong: 'xwb', english: 'only; just; merely (restrictive particle) · that’s all; no more than that (sentence-final particle)' },
      { hmong: 'teb', english: 'answer; reply (verb) · respond; react (verb) · land; country, as in Teb Chaws Asmeskas (noun / compound-noun element)' },
      { hmong: 'ntsib', english: 'meet; encounter (verb) · face; confront (verb)' },
      { hmong: 'sawv', english: 'stand (intransitive verb) · get up; rise (intransitive verb) · wake up (intransitive verb) · arise; rise, including the sun rising (verb)' },
      { hmong: 'sim', english: 'try; attempt (verb) · test; examine (verb) · taste; sample (verb)' },
      { hmong: 'dab', english: 'spirit; ghost; supernatural being (noun) · dab tsi = what; anything (compound interrogative expression) — ⚠ “what” is not a standalone sense of dab' },
      { hmong: 'txhia', english: 'some; various; different (indefinite determiner) · distributive or variety element in expressions such as txhua txhia (grammatical element)' },
      { hmong: 'txheej', english: 'event; incident; occurrence (noun) · time; occasion; instance (noun) · layer; arrangement; sequence (noun) — ⚠ cross-reference xwm txheej / txheej xwm (compound nouns)' },
      { hmong: 'niam', english: 'mother (noun) · female / woman element in kinship, gender, and animal compounds (compound-noun element)' },
      { hmong: 'zej', english: 'community; neighborhood; village area (noun) · zej zog = community; society; neighborhood (compound noun)' },
      { hmong: 'twb', english: 'already (aspectual adverb) · indeed; in fact; as expected (discourse adverb)' },
      { hmong: 'phab', english: 'side (noun) · wall, especially in phab ntsa (compound-noun element) · party; side; faction (noun)' },
      // People only — author's ruling 2026-09-30, kept in step with
      // classifiers-leej in vocabulary.js. Was 'classifier for people;
      // respectful individual classifier'.
      { hmong: 'leej', english: 'classifier used only for people, never animals or objects (classifier) · leej twg = who (compound interrogative phrase)' },
      { hmong: 'cav', english: 'argue; dispute; contend (verb) · claim; maintain; assert (verb)' },
      { hmong: 'tim', english: 'at; over at, dialect/construction-sensitive (locative marker) · tim li cas = cause; reason; why, dialect-sensitive (compound interrogative expression)' },
      { hmong: 'tsaus', english: 'dark; darkness (adjective / stative verb) · tsaus ntuj = evening; nighttime; darkness (compound time expression)' },
      { hmong: 'pob', english: 'ball; round lump; rounded object (noun) · classifier for small round or lump-like objects (classifier) · right?; is that so? (sentence-final confirmation particle)' },
      { hmong: 'tsum', english: 'must; have to; need to (modal verb) · necessity or obligation marker (modal particle)' },
      { hmong: 'chim', english: 'anger; be angry (noun / stative verb) · inner feeling; disposition in compounds (noun)' },
      { hmong: 'saib', english: 'look at; watch (transitive verb) · examine; inspect (transitive verb) · care for; look after (transitive verb) · consider; regard (mental verb)' },
      { hmong: 'muag', english: 'sell (transitive verb) · be for sale; be sold (verb / predicate)' },
      { hmong: 'tshaj', english: 'to exceed, to be more than — “tshaj plaws”, the most. NOT the name of a court: that is the whole phrase “Wisconsin Lub Tsev Hais Plaub Siab Tshaj”.' },
      { hmong: 'ntsuj plig', english: 'spirit, soul' },
      { hmong: 'mob siab', english: 'grief; to be heartsick' },
      { hmong: 'tij laug', english: 'older brother' },
      { hmong: 'npau suav', english: 'to dream' },
      { hmong: 'nco txog', english: 'to remember, to think of' },
      { hmong: 'zej zog', english: 'community, neighbourhood' },
      { hmong: 'nyab xeeb', english: 'safe; safety' },
      { hmong: 'tsim txom', english: 'to torture; to mistreat cruelly, to persecute' },
      { hmong: 'tsoo', english: 'to strike, to smash into, to collide with · to bump into; to crash — "tseb tsoo", a car crash; "tsoo qhov rooj", to bump into the door' },  // synced with misc-tsoo 2026-09-30 (battle sense removed; it is war-only)
      { hmong: 'zog', english: 'strength, force' },
      { hmong: 'pob taws', english: 'ankle' },
      { hmong: 'nraub qaum', english: 'back (of the body)' },
      { hmong: 'kawg nkaus', english: 'utterly, extremely — the strongest intensifier here' },
      { hmong: 'puas tsuaj', english: 'destroyed, ruined, wrecked' },
      { hmong: 'kab raub ris', english: 'scorpion' },
      { hmong: 'qav', english: 'frog (noun)' },
      { hmong: 'tshaws', english: 'to sting' },
      { hmong: 'ris', english: 'trousers, pants — here only as part of “kab raub ris”, scorpion. It does NOT mean scorpion on its own.' },
      { hmong: 'raub', english: 'bound word here: only in “kab raub ris”, scorpion' },
      { hmong: 'dej', english: 'water; a river' },
      { hmong: 'coob', english: 'many — used of people, where “ntau” is used of things' },
      { hmong: 'ntiaj teb', english: 'the world, the earth' },
      { hmong: 'ib txhia', english: 'some, some of them' },
      { hmong: 'cim', english: 'a mark, a sign, an emblem — “lub cim ntawm txoj cai”, the badge of the law' },
      { hmong: 'phom', english: 'a gun' },
      { hmong: 'tab meeg', english: 'openly, in front of everyone' },
      { hmong: 'ua txuj', english: 'to pretend, to put on an act' },
      { hmong: 'Hmoob', english: 'Hmong — the people and the language' },
      { hmong: 'poj niam', english: 'a woman' },
      { hmong: 'kav', english: 'to last, to run for — “uas kav plaub hnub”, that ran four days' },
      // ── THE PEOPLE ────────────────────────────────────────────────────────
      // Role only. See the note in the scratchpad and the day-two note.
      { hmong: 'Zong', english: 'Zong Vang — the thirteen-year-old boy killed in this case' },
      { hmong: 'Vang', english: 'Vang — Zong’s family name; also his brothers Seng Vang, Seng Say Vang and Nhee' },
      { hmong: 'Omer', english: 'Omer Ninham — fourteen, convicted of first-degree intentional homicide' },
      { hmong: 'Ninham', english: 'Omer Ninham — fourteen at the time; sentenced to life without parole' },
      { hmong: 'Richard', english: 'Richard Crapeau — thirteen, convicted as a party to the killing. Also the first name of Judge Richard J. Dietz.' },
      { hmong: 'Crapeau', english: 'Richard Crapeau — thirteen at the time; sentenced to life, parole possible after fifty years' },
      { hmong: 'Jeffrey', english: 'Jeffrey P. — thirteen, present but never charged; told police what he knew' },
      { hmong: 'Amanda', english: 'Amanda G. — fourteen, present but never charged; told police what she knew' },
      { hmong: 'Christian', english: 'Christian J. — fourteen, present but never charged' },
      { hmong: 'Steven', english: 'Steven Heraly — the bystander who heard Zong fall' },
      { hmong: 'Heraly', english: 'Steven Heraly — the man driving out of the ramp who heard the fall' },
      { hmong: 'Seng', english: 'Seng Say Vang and Seng Vang — Zong’s older brothers, who spoke for the family' },
      { hmong: 'Say', english: 'in “Seng Say Vang” — Zong’s older brother, who spoke at sentencing' },
      { hmong: 'Nhee', english: 'Nhee — Zong’s older brother, who described him as a “strong worker”' },
      { hmong: 'Mai', english: 'Mai Chou Yang — Zong’s mother' },
      { hmong: 'Chou', english: 'in “Mai Chou Yang” — Zong’s mother' },
      { hmong: 'Yang', english: 'in “Mai Chou Yang” — Zong’s mother; also a Hmong family name' },
      { hmong: 'Dietz', english: 'Richard J. Dietz — the circuit court judge in Omer Ninham’s case' },

      // ── PLACES AND TERMS THE NAMES SIT IN ─────────────────────────────────
      { hmong: 'Wisconsin', english: 'Wisconsin — the state where this happened' },
      { hmong: 'Webster', english: 'Webster Avenue — the street Zong was riding home along' },
      { hmong: 'txoj kev', english: 'a road, a street, a way — the classifier a named street takes: “txoj kev Webster Avenue”. Also “a way” in the abstract, as in “txoj kev tuag”, death.' },
      { hmong: 'Lub Nroog', english: 'the City of — the classifier a named city takes: “Lub Nroog Green Bay”, “Lub Nroog Racine”' },

      // ── THE LAST OF THE HMONG ─────────────────────────────────────────────
      // From an audit of every token that returned nothing.
      { hmong: 'kwv yees', english: 'to estimate, to reckon — “kwv yees li yim teev”, about eight o’clock' },
      { hmong: 'tiam sis', english: 'but, however' },
      { hmong: 'npoo av', english: 'ground level — “saum npoo av”, above the ground' },
      { hmong: 'lom zem', english: 'fun, funny, enjoyable' },
      { hmong: 'ya', english: 'to fly — “ya hla phab ntsa”, sailed out over the wall' },
      { hmong: 'cawm', english: 'to rescue, to save — “pab cawm neeg”, to rescue people' },
      { hmong: 'dhia', english: 'to jump; of a pulse, to beat' },
      { hmong: 'me ntsis', english: 'a little, slightly' },
      { hmong: 'ib nyuag ntu', english: 'a short while, a little stretch of time' },
      { hmong: 'tawg', english: 'to break, to crack, to burst' },
      { hmong: 'nqis', english: 'to go down, to descend' },
      { hmong: 'ib ntus', english: 'for a time, for a while' },
      { hmong: 'vib nas this', english: 'a second (of time) — from the English “minute second”' },
      { hmong: 'tig', english: 'to turn, to turn around' },
      { hmong: 'tshawb nrhiav', english: 'to investigate, to search out' },
      { hmong: 'nqus', english: 'to suck in, to inhale — of a drug, to snort' },
      { hmong: 'txij', english: 'from, since — “txij thaum”, ever since' },
      { hmong: 'cuam tshuam', english: 'to affect, to have an impact on' },
      { hmong: 'tshwj xeeb', english: 'special; especially — “tshwj xeeb tshaj yog”, especially' },
      { hmong: 'pab hluas', english: 'a group of young people — “pab”, a group, NOT “pab”, to help. Both senses are in this story: “pab cawm” is to rescue.' },
      { hmong: 'ua si', english: 'to play; a game — “txoj kev ua si”, a game they were playing' },
      { hmong: 'txawv txav', english: 'unusual, out of the ordinary — in law, “cruel and unusual”' },
      { hmong: 'ncaj qha', english: 'directly, straight — “tsis ncaj qha siv tau”, does not apply directly' },
      { hmong: 'txawj', english: 'to know how to, to be able to — “nws txawj ntaus bass cello”' },
      { hmong: 'niaj hnub', english: 'every day; these days — “niaj hnub no”, to this day' },
      { hmong: 'cog', english: 'to plant — “cog rau nws lub npe”, planted in his name' },
      { hmong: 'them', english: 'to pay — “raug them ob txhiab tsib puas duas las”, cost $2,500' },

      // The remaining English in the text, kept as the record writes it.
      { hmong: 'Eighth Amendment', english: 'the Eighth Amendment to the US Constitution — bans cruel and unusual punishment. The author’s Hmong for it is “Tsab Cai Hloov Kho Thib Yim”.' },
      { hmong: 'Constitution', english: 'constitution (English, kept as written) — “Wisconsin Txoj Cai Lij Choj Loj”' },
      { hmong: 'Graham v. Florida', english: 'Graham v. Florida — the 2010 US Supreme Court case barring life without parole for children, for crimes other than homicide' },
      { hmong: 'Florida', english: 'Florida — the state in the case name “Graham v. Florida”' },
      { hmong: 'Fox Lake Correctional Institution', english: 'Fox Lake Correctional Institution — the Wisconsin prison where Ninham is held' },
      { hmong: 'St. James Park', english: 'St. James Park — the Green Bay park where Zong’s memorial stands' },
      { hmong: 'Park', english: 'park (English, kept as written) — Hmong: “chaw ua si”' },
      { hmong: 'oak', english: 'oak (English, kept as written) — the tree planted in Zong’s name' },
      { hmong: 'bass cello', english: 'the double bass (English, kept as written) — the instrument Zong played' },
      { hmong: 'sis', english: 'in “los sis” or; in “tiam sis” but — never alone' },
      // ⚠️ THE INITIALS GET ENTRIES TOO, and they say why they are initials.
      // A reader tapping "P." otherwise gets "no entry for this word yet" and
      // no hint that the abbreviation is deliberate.
      { hmong: 'P.', english: 'the initial of Jeffrey P., who was thirteen and never charged — abbreviated on purpose' },
      { hmong: 'G.', english: 'the initial of Amanda G., who was fourteen and never charged — abbreviated on purpose' },
      { hmong: 'J.', english: 'the initial of Christian J., who was fourteen and never charged — abbreviated on purpose' },

      // ── THE ENGLISH IN THE TEXT ───────────────────────────────────────────
      // ⚠️ These are English words sitting inside Hmong prose — place names the
      // author kept as written, and two loans. A learner tapping one should get
      // an answer rather than "no entry yet", which in a Hmong dictionary reads
      // as "we have not got to this Hmong word", and these are not Hmong words.
      { hmong: 'St. Vincent Hospital', english: 'St. Vincent Hospital — the Green Bay hospital whose parking ramp this happened on' },
      { hmong: 'Hospital', english: 'hospital (English, kept as written) — Hmong: “tsev kho mob”' },
      { hmong: 'Avenue', english: 'avenue (English, kept as written) — part of the street name' },
      { hmong: 'Street', english: 'street (English, kept as written) — part of the street name' },
      { hmong: 'East Mason Street', english: 'East Mason Street — the street they crossed, hearing the ambulance' },
      { hmong: 'Racine', english: 'Racine — the Wisconsin city where Crapeau is held' },
      { hmong: 'Correctional Institution', english: 'a prison (English, kept as written) — “Racine Correctional Institution”' },
      { hmong: 'Chicken', english: '“Chicken” — the English name Omer and Richard gave what they were doing at the wall' },
      { hmong: 'cement', english: 'cement, concrete (English, used as a Hmong loan)' },
      { hmong: 'cocaine', english: 'cocaine (English, kept as written)' },
      { hmong: 'Indian', english: 'in “Menominee Indian Tribe” — kept as the tribe writes its own name' },
      { hmong: 'Tribe', english: 'in “Menominee Indian Tribe” — kept as the tribe writes its own name' },
      { hmong: 'Native American', english: 'Native American — kept as written; the spirituality Ninham said he had taken an interest in' },
      { hmong: 'drive-by', english: 'a drive-by shooting (English) — one of the threats Ninham made' },
      { hmong: 'Menominee', english: 'the Menominee Indian Tribe — Ninham is a member' },
      { hmong: 'Graham', english: 'Graham v. Florida — the case the Supreme Court discussed and set aside here' },
      { hmong: 'Esxias', english: 'Asian — the word in Crapeau’s statement to police' },
      { hmong: 'Askiv', english: 'English — “lus Askiv”, the English language' },
      { hmong: 'Vajtswv', english: 'God' },
      { hmong: 'quaj', english: 'to cry, to weep' },
      { hmong: 'thauj', english: 'to carry, to transport' },
      { hmong: 'tseeb', english: 'true, certain — “paub tseeb”, to know for certain' },
      { hmong: 'plam', english: 'to lose, to be deprived of' },
      { hmong: 'xaus', english: 'to end, to conclude' },
      { hmong: 'txais', english: 'to receive, to accept' },
      { hmong: 'txav', english: 'to move, to shift closer' },
      { hmong: 'rub', english: 'to pull, to take hold of and draw' },
      { hmong: 'ntog', english: 'to fall over, to land' },
      { hmong: 'av', english: 'ground, earth' },
      { hmong: 'nias', english: 'to press down on' },
      { hmong: 'qw', english: 'to shout, to scream' },
      { hmong: 'tsav', english: 'to drive — “tsav tsheb”' },
      { hmong: 'tshaj plaws', english: 'the most, -est — “hnyav tshaj plaws”, the heaviest' },
      { hmong: 'sawv tsees', english: 'to get up, to spring to one’s feet' },
      { hmong: 'cuag', english: 'to reach, to catch up to — “caum cuag”, to catch up with' },
      { hmong: 'feem ntau', english: 'mostly, usually, for the most part' },
      { hmong: 'ib yam li', english: 'the same as, just like' },
      { hmong: 'rooj noj mov', english: 'a dining table — literally the table where food is eaten' },
      // ⚠️ FOOD, not rice. This story's only use is "koj lub rooj noj mov",
      // your table — where the sense is the meal, not the grain. The dictionary
      // entry leads with "cooked rice", so tier 1 overrides it here.
      { hmong: 'mov', english: 'food — “noj mov” is to eat; it also means cooked rice on its own' },
      { hmong: 'zaum', english: 'to sit — the only sense used in this story. (The word also means “a time, an occasion”, and with “tej” in front of it, “perhaps”.)' },
      { hmong: 'rooj zaum', english: 'a seat, a bench' },
      { hmong: 'ua ke', english: 'together, at the same time' },
      { hmong: 'hloov', english: 'to change' },
      { hmong: 'nruab nrab', english: 'the middle; halfway' },
      { hmong: 'ceev faj', english: 'to be careful, to watch out' },
      { hmong: 'tso siab', english: 'to trust; to put one’s heart at ease' },
      { hmong: 'pej xeem', english: 'the public; citizens' },
      { hmong: 'cwj pwm', english: 'character; behaviour, disposition' },
      { hmong: 'zej tsoom', english: 'society; the public at large' },
      { hmong: 'tswv cuab', english: 'a member (of a family or group)' },
      { hmong: 'cawv', english: 'alcohol, liquor' },
      { hmong: 'tso tseg', english: 'to drop, to dismiss, to abandon' },

      // ── WORD-TAP OVERRIDES ───────────────────────────────────────────────
      // Each of these returned a correct-but-wrong answer from the dictionary
      // before this block existed. Tier 1 (this glossary, exact word) beats
      // tier 2 (the dictionary), and nothing outside this story is affected.

      // Numbers. The dates and measurements in this text are built from
      // compounds, and every part of one resolves to something else alone.
      { hmong: 'nees', english: 'in “nees nkaum” — twenty. NOT “horse”, which is what this word means on its own.' },
      { hmong: 'nees nkaum', english: 'twenty — “nees nkaum plaub” is twenty-four, “nees nkaum cuaj” twenty-nine' },
      { hmong: 'caug', english: 'in a number, “-ty” — “tsib caug xyoo” is fifty years' },
      { hmong: 'kaum', english: 'ten (numeral) · teen-number element, as in kaum peb = thirteen (numeral element) — ⚠ distinct from nkaum = hide (verb)' },
      { hmong: 'puas', english: 'hundred — “cuaj puas” is nine hundred. (Also the yes/no question word, “puas yog…?”)' },
      { hmong: 'txhiab', english: 'thousand — “ib txhiab cuaj puas cuaj caum yim” is 1998' },
      { hmong: 'tsib', english: 'five' },
      { hmong: 'hlis', english: 'month (noun) · month-name element (proper-name element) · Peb Hlis = March (proper noun) · Cuaj Hlis = September (proper noun)' },
      { hmong: 'hnub tim', english: 'the date, the day of the month' },

      // Law. This is a courtroom text and these four carry it.
      { hmong: 'plaub', english: 'four — BUT in “rooj plaub” a legal case, and “tsev hais plaub” a court. Not the number in those.' },
      { hmong: 'txim', english: 'in “txiav txim”, to judge or decide; “kws txiav txim”, a judge; “lub txim”, the sentence or punishment' },
      { hmong: 'kaw', english: 'close; shut (transitive verb) · closed; not open (stative verb / adjective) · confine; imprison (transitive verb) · raug kaw = be imprisoned (compound verb construction)' },
      { hmong: 'foob', english: 'to charge, to accuse, to sue — “raug foob”, to be charged' },

      // Compounds where the dictionary answers with a DIFFERENT compound.
      { hmong: 'hluas', english: 'young — “tub hluas” a young man, “pab hluas” a group of young people. Not “niam hluas”.' },
      { hmong: 'tab', english: 'bound word — not used alone: tab sis = but; however (conjunction) · tab tom = currently doing; in the process of doing (progressive aspect construction)' },
      { hmong: 'laj', english: 'in “laj thawj” — a reason, a cause' },
      { hmong: 'thawj', english: 'in “laj thawj” a reason; in “thawj theem”, first degree' },
      { hmong: 'qhov', english: 'a thing, a place, a point — “qhov xwm txheej” the incident, “qhov chaw” the place, “qhov siab” the height' },
      { hmong: 'ntaub', english: 'in “ntaub ntawv” — documents, records, papers' },
      { hmong: 'ntawv', english: 'paper, writing — “ntaub ntawv” records, “xa ntawv” to deliver mail' },
      { hmong: 'tib', english: 'same; one and the same (adjective / determiner) · tib neeg = human being; humanity (compound noun) · tib txoj = the same one; same route/rule depending on the following noun (determiner phrase)' },
      { hmong: 'kheej', english: 'in “tus kheej” — oneself, one’s own' },
      { hmong: 'tsa', english: 'to raise, to lift up — “tsa tau nws sawv rov los”, to revive him' },
      { hmong: 'ntug', english: 'the edge — “ntug phab ntsa”, the edge of the wall' },
      { hmong: 'hnyav', english: 'heavy — and so “severely”: “raug mob hnyav”, badly injured; “ntaus hnyav dua”, hit harder' },
      { hmong: 'txaus', english: 'enough — “ntev txaus” long enough; “txaus ntshai” frightening, enough to fear' },

      // Very common words whose dictionary sense is not the one on the page.
      { hmong: 'siab', english: 'the seat of feeling and intent — “lub hauv siab” the chest, “lub siab” one’s intention or nature, “poob siab” to lose heart' },
      { hmong: 'tom qab', english: 'after; behind' },
      { hmong: 'hauv qab', english: 'below, underneath' },
      // ⚠️ BOTH SENSES ARE IN THIS STORY: "ntaus nws lub ntsej muag" is to
      // strike, and "nws txawj ntaus bass cello" is to play. An entry naming
      // only the first makes the line about the instrument read as violence.
      { hmong: 'ntaus', english: 'to hit, to strike, to punch — AND to play an instrument: “ntaus bass cello”, played the bass cello' },
      { hmong: 'xwm', english: 'xwm txheej = event; incident; situation (compound noun) · peev xwm = ability; capability (compound noun) · tub ceev xwm = police; police officer (compound noun) — ⚠ do not teach police or ability as standalone meanings of xwm' },
      { hmong: 'tsom', english: 'to aim at, to focus on — “tsom tau rau”, narrowed the investigation to. Not “tsom iav”, spectacles.' },
      { hmong: 'npe', english: 'a name' },
      { hmong: 'hu', english: 'to call — “hu ua”, called or named' },
      // Tier-3 backfire: each of these was being answered with a long legal
      // phrase that merely contains it. See the note above the block.
      { hmong: 'neeg', english: 'a person, people — “tib neeg” human beings, “cov neeg pab cawm neeg” the rescue crew' },
      { hmong: 'raug', english: 'to undergo, to be subjected to — “raug ntes” arrested, “raug foob” charged, “raug kaw” imprisoned, “raug mob” injured' },
      { hmong: 'yam', english: 'a thing, a kind of thing — and in “yam tsis muaj…”, without' },
      { hmong: 'txiav', english: 'to cut — and in “txiav txim”, to decide or to judge' },
      { hmong: 'chaw', english: 'a place — “qhov chaw” the spot, “lub chaw nres tsheb” the parking ramp, “lub chaw haujlwm” the department' },
      { hmong: 'menyuam', english: 'child; baby; offspring (noun) · children; young people (collective noun) · menyuam yaus = children; young ones (compound noun)' },
      { hmong: 'yaus', english: 'young; small; immature (adjective) · menyuam yaus = children; young ones (compound noun)' },
      { hmong: 'txhob', english: 'do not; don’t (prohibitive negative particle) · txhob txwm = deliberately; intentionally; on purpose (compound adverb)' },
      { hmong: 'txwm', english: 'bound word — not used alone: txhob txwm = deliberately; intentionally; on purpose (compound adverb)' },
      { hmong: 'cai', english: 'right; entitlement; permission (noun) · law; rule; regulation (noun) · correct; proper; legitimate (adjective / stative predicate) · muaj cai = have the right; be allowed to (verb construction) · txoj cai = law; rule; right (compound noun) · kev cai = custom; tradition (compound noun)' },
      { hmong: 'rov', english: 'back, again — “rov qab” to go back, “rov hais dua” to hear again' },
      { hmong: 'tuag', english: 'to die; dead — “txoj kev tuag”, death' },
      { hmong: 'neej', english: 'life — “ua neej nyob” to be alive, “tas sim neej” for the whole of life' },
      { hmong: 'cev', english: 'body (noun) · physical self; bodily form (noun) · hand over; pass something, as in cev tes (transitive verb)' },
      { hmong: 'kho', english: 'to fix, to treat — “kws kho mob” a doctor. In “Hloov Kho” it is part of “amendment”.' },
      { hmong: 'kws', english: 'a skilled person — “kws kho mob” doctor, “kws lij choj” lawyer, “kws txiav txim” judge' },
      { hmong: 'ceev', english: 'in “tub ceev xwm”, police — the ones who keep order' },
      { hmong: 'sib', english: 'each other; one another (reciprocal marker) · mutual action marker placed before a verb (verbal prefix / grammatical marker) · sib ntaus = fight each other (reciprocal verb) · sib cav = argue with each other (reciprocal verb)' },
      { hmong: 'tsheb', english: 'a vehicle — “tsheb kauj vab” bicycle, “chaw nres tsheb” a parking ramp' },
      // Previously unanswered. Frequency-ordered from an audit of every token.
      { hmong: 'ntxiv', english: 'more, further, in addition' },
      { hmong: 'kam', english: 'to be willing; to agree to' },
      { hmong: 'khw', english: 'a market, a store — “lub khw muas zaub mov”, the grocery store' },
      { hmong: 'dim', english: 'escape; get free (verb) · be safe; survive (resultative verb) · free; released (stative / resultative verb)' },
      { hmong: 'yav', english: 'a period of time — “yav tsaus ntuj”, the evening' },
      { hmong: 'ho', english: '(emphatic in a question) — “ua cas nej ho…”, why on earth did you…' },
      { hmong: 'kauj ruam', english: 'a step — “ib kauj ruam loj”, a big step forward' },
      { hmong: 'tshwm sim', english: 'to happen, to occur, to come about' },
      { hmong: 'tiv thaiv', english: 'to defend; a defence · to parry' },  // synced with misc-tiv-thaiv 2026-09-30
      { hmong: 'ncaj ncees', english: 'justice; righteous, fair' },
      { hmong: 'tsim nyog', english: 'to deserve; to be fitting, to be worthy of' },
      { hmong: 'txhawb', english: 'to encourage, to egg on, to support' },
      { hmong: 'txwv', english: 'to forbid, to prevent' },
      { hmong: 'pub', english: 'to allow, to let — “txwv tsis pub”, would not let' },
      { hmong: 'tsuam', english: 'to press down on, to pin' },
      { hmong: 'xaiv', english: 'to choose, to pick out' },
      { hmong: 'nrov', english: 'loud; to sound' },
      { hmong: 'hauv paus', english: 'the base, the foot of something' },
      { hmong: 'nqes', english: 'to descend, to go down' },
      { hmong: 'lo lus', english: 'a word; a question or remark' },
      { hmong: 'npaj', english: 'to prepare, to plan' },
      { hmong: 'tseem ceeb', english: 'important, principal' },
      { hmong: 'feet', english: 'feet — the English unit, kept as written' },
      { hmong: 'tuav', english: 'hold; grip (transitive verb) · keep; maintain (transitive verb) · support; uphold; hold firmly (transitive verb)' },
      { hmong: 'qho', english: '(classifier for things, places and abstract items) — “ib qho kev foob”, one charge' },
      { hmong: 'xwm txheej', english: 'an event, an incident, what happened' },
      { hmong: 'pib', english: 'to begin, to start' },
      { hmong: 'yuav tsum', english: 'must, have to' },
      { hmong: 'hem', english: 'threaten (transitive verb) · menace; threaten to happen (verb)' },
      { hmong: 'lees', english: 'admit; acknowledge; concede (transitive verb) · accept; receive (transitive verb) · take responsibility for (verb construction) · lees txais = accept; receive (compound verb)' },
      { hmong: 'phooj ywg', english: 'friend, friends' },
      { hmong: 'ntseeg', english: 'believe; trust (verb) · txoj kev ntseeg = faith; religion; belief (compound noun)' },
      { hmong: 'koom', english: 'join; participate (verb) · together; combined; shared (adjective / adverb) · be involved; be a party to (verb) · koom tes = cooperate; work together (compound verb) · koom nrog = join with; participate with (compound verb)' },
      { hmong: 'Nplog teb', english: 'Laos' },
      { hmong: 'Thaib teb', english: 'Thailand' },
      { hmong: 'Tebchaws Meskas', english: 'the United States' },
      { hmong: 'xeev', english: 'a state — “Xeev Wisconsin”; also “lub xeev”, the State as a party in court' },
      { hmong: 'nroog', english: 'a city — “Lub Nroog Green Bay”' },
      { hmong: 'caij', english: 'to ride' },
      { hmong: 'xa', english: 'to send, to dispatch — “xa ntawv”, to deliver mail' },
      { hmong: 'tshuav', english: 'to remain, to be left over' },
      { hmong: 'nyaum', english: 'fierce, brutal, cruel' },
      { hmong: 'khaws', english: 'to keep, to save up, to pick up' },
      { hmong: 'muas', english: 'to buy — “khw muas zaub mov”, a grocery store' },
      { hmong: 'nqa', english: 'to carry' },
      { hmong: 'ruaj', english: 'firm, secure — “tuav nws nyob ruaj”, held him fast' },
      { hmong: 'kawg', english: 'end; last (noun / adjective) · finish; end (verb) · ultimate; topmost (adjective) · very; extremely, as an intensifier following an adjective (intensifier)' },
      { hmong: 'txiv neej', english: 'a man' },
      { hmong: 'lwm', english: 'another, other — “lwm txoj kev”, another way' },
      { hmong: 'nrhiav', english: 'to look for, to search for' },
      { hmong: 'nce', english: 'to go up, to climb' },
      { hmong: 'sij hawm', english: 'time — “muaj sij hawm”, to have time' },
      { hmong: 'tseg', english: 'to stop, to leave off — “tso tseg”, to drop or dismiss' },
      { hmong: 'hu npe', english: 'named, called — “hu npe Steven Heraly”, named Steven Heraly' },
      { hmong: 'txiv', english: 'father — BUT “txiv neej” is a man, and “txiv lws suav” a tomato. All three are in this story.' },
      { hmong: 'hlab ntsha', english: 'blood vessel; pulse' },
      { hmong: 'yuam cev', english: 'to rape; to force oneself on someone' },
      { hmong: 'yeeb tshuaj', english: 'drugs; here, marijuana' },
      { hmong: 'tus muam', english: 'sister' },
      { hmong: 'zam txim', english: 'to forgive; to pardon' },
      { hmong: 'keeb kwm', english: 'history' },
      { hmong: 'ua pauj', english: 'to take revenge; a vendetta' },
      { hmong: 'khov kho', english: 'solid, sturdy, strong' },
      { hmong: 'hwj chim', english: 'power, authority' },
      { hmong: 'sib cais', english: 'separately; apart from each other' },
      { hmong: 'nkaum', english: 'hide; conceal oneself (verb) · be hidden (stative verb) · nees nkaum = twenty (compound numeral) — ⚠ distinct from kaum = ten (numeral)' },
      { hmong: 'Zou', english: 'Zou — Zong’s older brother, who sent him for the tomatoes' },
      { hmong: 'craniocerebral trauma', english: 'craniocerebral trauma — injury to the skull and the brain together; the medical cause of death' },

      // ⚠️ THE SECOND BATCH IS NOT ABOUT THIS STORY. These are ordinary,
      // high-frequency Hmong words that are simply absent from a 600-word
      // dictionary, and they were the most common unanswered taps in this text
      // (measured, not guessed: `sis` 11, `rov` 9, `xyoo` 8, `lus` 8).
      //
      // They belong in src/data/vocabulary.js, where every story would get
      // them. They are here instead because adding them to the dictionary is a
      // change to the quiz, the review queue and every other reading at once —
      // a decision the author should make, not a side effect of shipping a
      // story. Logged in notes/TODO.md; move them up when reviewed.
      { hmong: 'xyoo', english: 'year; years old' },
      { hmong: 'lus', english: 'word, speech, language' },
      { hmong: 'los sis', english: 'or' },
      { hmong: 'rov qab', english: 'back; to return, to go back' },
      { hmong: 'thiaj', english: 'so, therefore, and so' },
      { hmong: 'raws li', english: 'according to; following' },
      { hmong: 'txhaum', english: 'wrong; guilty; to break a rule' },
      { hmong: 'hla', english: 'to cross, to go over' },
    ],
    // ⚠️ THE OPTIONS ARE IN ENGLISH, as in every other story here: writing Hmong
    // distractors means inventing Hmong no fluent speaker has checked. The
    // prompt keeps the author's Hmong with a gloss after it.
    //
    // ⚠️ NO QUESTION ASKS ABOUT THE VIOLENCE FOR ITS OWN SAKE. A comprehension
    // quiz over a real child's death can very easily turn the worst minutes of a
    // family's life into trivia. These ask what the text establishes: who he
    // was, that he was a stranger to them, what the courts decided, and how he
    // is remembered.
    questions: [
      {
        id: 'q-zong-1',
        prompt: 'Zong Vang muaj pes tsawg xyoo? — How old was Zong Vang?',
        options: ['Thirteen', 'Fourteen', 'Eleven', 'Sixteen'],
        answer: 'Thirteen',
        because: 'Paragraph 2 — "Zong Vang—ib tug tub hluas Hmoob muaj kaum peb xyoo…"',
      },
      {
        id: 'q-zong-2',
        prompt: 'Zong tawm hauv tsev mus ua dab tsi? — Why did Zong leave the house?',
        options: [
          'To buy tomatoes, as his older brother had asked',
          'To deliver newspapers on his route',
          'To meet friends at the park',
          'To go to the hospital',
        ],
        answer: 'To buy tomatoes, as his older brother had asked',
        because: 'Paragraph 2 — "…mus rau lub khw muas zaub mov yuav txiv lws suav rau nws tus tij laug Zou."',
      },
      {
        id: 'q-zong-3',
        prompt: 'Zong puas paub cov hluas ntawd? — Did Zong know the group?',
        options: [
          'No — they were strangers to each other',
          'Yes, they went to school together',
          'Yes, they were neighbours',
          'He knew only Omer',
        ],
        answer: 'No — they were strangers to each other',
        because: 'Paragraph 5 — "Zong tsis paub cov hluas no, thiab lawv kuj tsis paub Zong."',
      },
      {
        id: 'q-zong-4',
        prompt: 'Raws li Richard, vim li cas nws xav mus sib ntaus? — By Richard’s own account, why did he want to fight?',
        options: [
          'He was angry with his mother',
          'Zong had insulted him',
          'He had lost a bicycle',
          'The others told him to',
        ],
        answer: 'He was angry with his mother',
        because: 'Paragraph 6 — "Kuv tseem chim rau kuv niam thiab kuv xav sib ntaus los sis xav pom kev sib ntaus…"',
      },
      {
        id: 'q-zong-5',
        prompt: 'Zong khiav mus rau qhov twg? — Where did Zong run to?',
        options: [
          'A hospital parking ramp',
          'A police station',
          'His brother’s house',
          'A school',
        ],
        answer: 'A hospital parking ramp',
        because: 'Paragraph 9 — "…khiav mus rau St. Vincent Hospital lub chaw nres tsheb ntau theem…"',
      },
      {
        id: 'q-zong-6',
        prompt: 'Theem twg ntawm lub chaw nres tsheb? — Which level of the parking ramp?',
        options: ['The fifth, the top level', 'The first', 'The third', 'The hospital roof'],
        answer: 'The fifth, the top level',
        because: 'Paragraph 9 — "…theem saum toj kawg—theem thib tsib…"',
      },
      {
        id: 'q-zong-7',
        prompt: 'Tom qab Zong poob, pab hluas ntawd ua li cas? — What did the group do after Zong fell?',
        options: [
          'They ran from the scene without helping',
          'They went down to help him',
          'They called an ambulance',
          'They went to the police',
        ],
        answer: 'They ran from the scene without helping',
        because: 'Paragraph 16 — "…tsis tau mus xyuas seb Zong zoo li cas li. Lawv txhua tus khiav tawm ntawm qhov chaw ntawd."',
      },
      {
        id: 'q-zong-8',
        prompt: 'Vim li cas tub ceev xwm thiaj tsom tau rau tsib tug hluas? — How did the police come to focus on the five?',
        options: [
          'Two of them told relatives and police what they knew',
          'A camera recorded it',
          'Omer confessed at once',
          'A neighbour recognised them',
        ],
        answer: 'Two of them told relatives and police what they knew',
        because: 'Paragraph 19 — "Tom qab Jeffrey P. thiab Amanda G. qhia lawv cov txheeb ze thiab tub ceev xwm txog tej yam lawv paub…"',
      },
      {
        id: 'q-zong-9',
        prompt: 'Seng Say Vang thov dab tsi ntawm tsev hais plaub? — What did Seng Say Vang ask the court for?',
        options: [
          'The heaviest sentence: life without parole',
          'A shorter sentence, because of their age',
          'Money for the family',
          'A public apology',
        ],
        answer: 'The heaviest sentence: life without parole',
        because: 'Paragraph 27 — "…muab lub txim hnyav tshaj plaws rau Ninham: kaw mus tas sim neej yam tsis muaj cai thov tawm ntxov."',
      },
      {
        id: 'q-zong-10',
        prompt: 'Raws li tsev neeg txoj kev ntseeg, tus ntsuj plig yuav kaj siab thaum twg? — In the family’s belief, when can the spirit be at peace?',
        options: [
          'When those who did the wrong are brought to justice',
          'After one year has passed',
          'When the family moves away',
          'When the story is told publicly',
        ],
        answer: 'When those who did the wrong are brought to justice',
        because: 'Paragraph 28 — "…tus ntsuj plig yuav tsis tau dim mus nyob kaj siab mus txog thaum cov neeg ua txhaum raug coj los raug kev ncaj ncees."',
      },
      {
        id: 'q-zong-11',
        prompt: 'Xyoo ob txhiab kaum ib, Wisconsin Lub Tsev Hais Plaub Siab Tshaj txiav txim li cas? — What did the Wisconsin Supreme Court decide in 2011?',
        options: [
          'Ninham’s original sentence should stand',
          'Ninham should be released',
          'A new trial was ordered',
          'The case went back to the jury',
        ],
        answer: 'Ninham’s original sentence should stand',
        because: 'Paragraph 41 — "…tau txiav txim kom tuav Ninham lub txim qub cia."',
      },
      {
        id: 'q-zong-12',
        prompt: 'Zong npau suav xav ua dab tsi? — What did Zong dream of becoming?',
        options: ['A doctor', 'A lawyer', 'A musician', 'A police officer'],
        answer: 'A doctor',
        because: 'Paragraph 45 — "…tau npau suav xav ua kws kho mob."',
      },
      {
        id: 'q-zong-13',
        prompt: 'Dab tsi nyob hauv St. James Park los nco txog Zong? — What is in St. James Park in Zong’s memory?',
        options: [
          'An oak tree and a stone bench',
          'A statue',
          'A library',
          'A playground',
        ],
        answer: 'An oak tree and a stone bench',
        because: 'Paragraph 49 — "…nrog ib tsob ntoo oak uas cog rau nws lub npe."',
      },
      {
        id: 'q-zong-14',
        prompt: 'Vim li cas pab hluas ntawd thiaj tua Zong? — Why did the group attack and kill him?',
        options: [
          'It was completely random and unprovoked — the wrong place at the wrong time',
          'Zong was in a Hmong gang and threw gang signs to provoke them',
          'Zong was carrying valuables and they wanted to rob him',
          'They recognised Zong from an earlier conflict and hunted him down',
        ],
        answer: 'It was completely random and unprovoked — the wrong place at the wrong time',
        because: 'Paragraph 21 — "Cov hluas no xaiv Zong yam tsis muaj laj thawj, ces tua nws."',
      },
      {
        id: 'q-zong-15',
        prompt: 'Nkawd hu qhov nkawd ua ntawm phab ntsa ua dab tsi? — What did the two of them call what they were doing at the wall?',
        options: ['“Chicken”', '“The swing”', '“The drop”', 'They did not call it anything'],
        answer: '“Chicken”',
        because: 'Paragraph 11 — "…hauv ib txoj kev ua si uas nkawd hu ua “Chicken,” thaum peb tug hluas ntawd txhawb nkawd."',
      },
      {
        id: 'q-zong-16',
        prompt: 'Yam kawg uas tseem tuav Zong yog dab tsi? — What was the last thing holding Zong before he fell?',
        options: [
          'Omer’s grip on his wrists',
          'Richard’s grip on his ankles',
          'The edge of the concrete wall',
          'His own hands on the wall',
        ],
        answer: 'Omer’s grip on his wrists',
        because: 'Paragraph 13 — "Omer thiaj tso Zong ob txhais dab teg—yam kawg uas tseem tuav Zong cia kom tsis txhob poob."',
      },
      {
        id: 'q-zong-17',
        prompt: 'Qhov siab ntawd yog pes tsawg? — How far was the drop?',
        options: ['Forty-five feet', 'Fifteen feet', 'Ninety feet', 'Twelve feet'],
        answer: 'Forty-five feet',
        because: 'Paragraph 12 — "…uas siab li plaub caum tsib feet saum npoo av."',
      },
      {
        id: 'q-zong-18',
        prompt: 'Steven Heraly hnov dab tsi? — What did Steven Heraly hear?',
        options: [
          'A sound like a bag of cement hitting the pavement',
          'Shouting from the top of the ramp',
          'A car alarm',
          'Nothing — he saw it happen',
        ],
        answer: 'A sound like a bag of cement hitting the pavement',
        because: 'Paragraph 14 — "…zoo li “ib lub hnab cement poob rau hauv txoj kev.”"',
      },
      {
        id: 'q-zong-19',
        prompt: 'Cov neeg pab cawm neeg pom dab tsi thaum lawv tuaj txog? — What did rescue personnel find when they reached Zong?',
        options: [
          'A faint pulse — he was still alive',
          'That he had died on impact',
          'That he had already been moved',
          'No sign of injury',
        ],
        answer: 'A faint pulse — he was still alive',
        because: 'Paragraph 14 — "…pom tias Zong txoj hlab ntsha tseem dhia me ntsis."',
      },
      {
        id: 'q-zong-20',
        prompt: 'Kev kuaj tus tuag lub cev hais tias nws tuag los ntawm dab tsi? — What did the autopsy give as the cause of death?',
        options: [
          'Craniocerebral trauma from a fall from height',
          'Blood loss',
          'Injuries from the beating, before the fall',
          'The cause could not be determined',
        ],
        answer: 'Craniocerebral trauma from a fall from height',
        because: 'Paragraph 15 — "…tuag los ntawm craniocerebral trauma vim nws poob saum qhov siab los."',
      },
      {
        id: 'q-zong-21',
        prompt: 'Omer hais li cas rau Jeffrey tom qab ntawd? — What did Omer say to Jeffrey afterwards?',
        options: [
          'To say nothing about it',
          'To call for an ambulance',
          'To go down and check on Zong',
          'To tell the truth if asked',
        ],
        answer: 'To say nothing about it',
        because: 'Paragraph 20 — "Tsis txhob hais ib los lus li—koj yuav tsum tsis txhob hais ib yam dab tsi li."',
      },
      {
        id: 'q-zong-22',
        prompt: 'Omer raug foob ntxiv txog dab tsi ua ntej nws rooj plaub? — What further charges did Omer face before his trial?',
        options: [
          'Threatening a judge, and intimidating witnesses',
          'Threatening a police officer',
          'Escaping from detention',
          'There were no further charges',
        ],
        answer: 'Threatening a judge, and intimidating witnesses',
        because: 'Paragraph 24 — "…ib qho kev hem tus kws txiav txim, thiab peb qho kev hem cov neeg ua pov thawj."',
      },
      {
        id: 'q-zong-23',
        prompt: 'Omer txoj kev tiv thaiv tseem ceeb yog dab tsi? — What was Omer’s main defence at trial?',
        options: [
          'That he had not been at the parking ramp at all',
          'That Richard alone dropped Zong',
          'That it was an accident during a game',
          'That he was too young to be tried',
        ],
        answer: 'That he had not been at the parking ramp at all',
        because: 'Paragraph 25 — "…nws tsis nyob ntawm lub chaw nres tsheb thaum yav tsaus ntuj Cuaj Hlis 24, 1998."',
      },
      {
        id: 'q-zong-26',
        prompt: 'Zong niam nws txiv hais li cas hauv Omer rooj plaub? — What did Zong’s parents testify at Omer Ninham’s trial?',
        options: [
          'That they fled Laos and Thailand for a safer life for their children, and had lost their faith in people’s goodness',
          'That they had been allies of the Pathet Lao in Laos',
          'That they knew the families of the boys who killed Zong',
          'That Zong had been in trouble before that evening',
        ],
        answer: 'That they fled Laos and Thailand for a safer life for their children, and had lost their faith in people’s goodness',
        because: 'Paragraph 26 — "…lawv tau khiav tawm hauv Nplog teb thiab Thaib teb… lawv poob siab rau tib neeg txoj kev siab zoo, thiab cov menyuam uas tseem tshuav ntshai tsis kam tawm hauv tsev mus."',
      },
      {
        id: 'q-zong-24',
        prompt: 'Richard Crapeau raug txim li cas? — What sentence did Richard Crapeau receive?',
        options: [
          'Life, with parole eligibility after fifty years',
          'Life without parole',
          'Fifty years, then release',
          'He was not sentenced — he testified instead',
        ],
        answer: 'Life, with parole eligibility after fifty years',
        because: 'Paragraph 36 — "…muaj cai thov tawm ntxov tom qab raug kaw tsib caug xyoo."',
      },
      {
        id: 'q-zong-25',
        prompt: 'Vim li cas tus kab raub ris ho tshaws tus qav? — In the story, why does the scorpion sting the frog?',
        options: [
          'Because it is its nature, and it cannot change',
          'Because the frog swam too slowly',
          'Because it was afraid of drowning',
          'Because the frog had stung it first',
        ],
        answer: 'Because it is its nature, and it cannot change',
        because: 'Paragraph 52 — "Vim qhov ntawd yog kuv lub siab. Kuv tsis hloov tau."',
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════════
   * EVERY STORY BELOW IS COMMENTED OUT — 2026-09-12.
   *
   * Nine of them carry `placeholder: true` and the tenth ('story-zaj-dab-neeg-thawj')
   * was the original example. None has been read by a fluent speaker, and the
   * TODO has listed them as release-blocking since 2026-09-09. Shipping them
   * beside a story the author actually wrote would put unreviewed Hmong in front
   * of the first paying users.
   *
   * ⚠️ COMMENTED, NOT DELETED. The structure is good and the glossaries are
   * real work; they come back as each one is written properly. Uncomment a
   * single story object to restore it — nothing else references them, because
   * shelf membership is derived from `story.genre`.
   *
   * ⚠️ src/data/storyCovers.js still has commented cover lines keyed to these
   * ids. That is harmless: check-reading.mjs reads only LIVE lines.
   * ══════════════════════════════════════════════════════════════════════════
  {
    // ⚠️ Prefixed and unique across the WHOLE file, not just within a genre.
    // reference.js is the cautionary tale: consonantGroups and vowelGroups both
    // use 'single'/'double', and anything keying on the bare id gets a silently
    // wrong lookup rather than an error.
    id: 'story-zaj-dab-neeg-thawj',
    title: 'Zaj Dab Neeg Thawj',
    english: 'First Story Example',
    genre: 'life',
    level: 'intermediate',
    // ⚠️ A NUMBER, not '5'. The moment you sum read time for a genre,
    // '5' + '5' is '55' — and it does not error, it just displays nonsense.
    minutes: 5,
    blurb: 'A short story introduction',

    // Array of paragraphs; each paragraph is an array of sentence pairs.
    // Sentence-level pairing is where the learning happens — a whole-paragraph
    // translation lets a reader understand the English without ever mapping it
    // onto the Hmong. The outer array keeps it reading as prose rather than a
    // list of lines.
    paragraphs: [
      [
        {
          hmong: 'Ib tug tub hluas mus rau hauv lub zos.',
          english: 'A young man went into the village.',
        },
      ],
      [
        {
          hmong: 'Nws pom ib tug poj niam zoo nkauj.',
          english: 'He saw a beautiful woman.',
        },
      ],
      [
        {
          hmong: 'Nws hais rau nws tias, "Koj puas xav mus nrog kuv mus ncig?"',
          english: 'He said to her, "Do you want to go with me for a walk?"',
        },
      ],
    ],

    glossary: [
      { hmong: 'tug tub hluas', english: 'young man' },
      { hmong: 'lub zos', english: 'village' },
      { hmong: 'poj niam zoo nkauj', english: 'beautiful woman' },
    ],

    questions: [
      {
        // ⚠️ REWRITTEN 2026-09-04. This was "Where did she go?" with the answer
        // "To the river" — a well-formed question about a DIFFERENT story,
        // copied from the guide's placeholder and never rewritten. She never
        // goes anywhere here, and the `because` quoted "nws mus rau tus dej loj",
        // which appears nowhere in the text.
        //
        // Every structural check passed: the answer was in the options, the ids
        // were unique, the file loaded. Only reading the story and the question
        // together catches this one. It is the line between what a script can
        // verify and what only an author can.
        id: 'q-thawj-1',
        prompt: 'Where did the young man go?',
        options: ['Into the village', 'To the river', 'To the market', 'Into the forest'],
        answer: 'Into the village',
        because: 'Paragraph 1 — "Ib tug tub hluas mus rau hauv lub zos."',
      },
      {
        id: 'q-thawj-2',
        prompt: 'What did the young man ask the woman?',
        options: [
          'If she wanted to go for a walk',
          'If she wanted to stay in the village',
          'If she wanted to go to the market',
          'If she wanted to go home',
        ],
        answer: 'If she wanted to go for a walk',
        because: 'Paragraph 3 — "Koj puas xav mus nrog kuv mus ncig?"',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PLACEHOLDERS from here down. See the banner above.
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'story-noj-tshais',
    title: 'Noj Tshais',
    english: 'Breakfast',
    genre: 'life',
    level: 'beginner',
    minutes: 2,
    blurb: 'A morning at home, before anyone has left the house.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Sawv ntxov, kuv sawv.', english: 'Early in the morning, I get up.' },
        { hmong: 'Kuv niam ua mov lawm.', english: 'My mother has already cooked rice.' },
      ],
      [
        { hmong: 'Peb noj mov thiab haus dej.', english: 'We eat rice and drink water.' },
        { hmong: 'Kuv txiv hais tias, "Noj kom tsau."', english: 'My father says, "Eat until you are full."' },
      ],
      [
        { hmong: 'Tom qab noj, kuv mus kawm ntawv.', english: 'After eating, I go to school.' },
      ],
    ],
    glossary: [
      { hmong: 'sawv ntxov', english: 'early in the morning' },
      { hmong: 'ua mov', english: 'to cook rice' },
      { hmong: 'noj kom tsau', english: 'eat until full' },
      { hmong: 'kawm ntawv', english: 'to study; to go to school' },
    ],
    questions: [
      {
        id: 'q-tshais-1',
        prompt: 'What has the mother already done?',
        options: ['Cooked the rice', 'Gone to school', 'Closed the door', 'Bought a shirt'],
        answer: 'Cooked the rice',
        because: 'Paragraph 1 — "Kuv niam ua mov lawm."',
      },
      {
        id: 'q-tshais-2',
        prompt: 'What happens after the meal?',
        options: ['He goes to school', 'He goes back to sleep', 'He cooks rice', 'He walks to the village'],
        answer: 'He goes to school',
        because: 'Paragraph 3 — "Tom qab noj, kuv mus kawm ntawv."',
      },
    ],
  },

  {
    id: 'story-mus-kawm-ntawv',
    title: 'Mus Kawm Ntawv',
    english: 'Going to School',
    genre: 'life',
    level: 'beginner',
    minutes: 3,
    blurb: 'The walk there, and what is waiting on the road.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Kuv tus kwv thiab kuv taug kev mus kawm ntawv.', english: 'My younger brother and I walk to school.' },
        { hmong: 'Txoj kev ntev heev.', english: 'The road is very long.' },
      ],
      [
        { hmong: 'Peb pom ib tus aub nyob ntawm txoj kev.', english: 'We see a dog on the road.' },
        { hmong: 'Nws tsis ntshai peb.', english: 'It is not afraid of us.' },
      ],
      [
        { hmong: 'Thaum peb mus txog, xibfwb hais tias, "Nyob zoo."', english: 'When we arrive, the teacher says, "Hello."' },
      ],
    ],
    glossary: [
      { hmong: 'taug kev', english: 'to walk; to travel on foot' },
      { hmong: 'txoj kev', english: 'the road' },
      { hmong: 'xibfwb', english: 'teacher' },
      { hmong: 'nyob zoo', english: 'hello' },
    ],
    questions: [
      {
        id: 'q-kawm-1',
        prompt: 'Who walks to school with the narrator?',
        options: ['His younger brother', 'His mother', 'His teacher', 'His older sister'],
        answer: 'His younger brother',
        because: 'Paragraph 1 — "Kuv tus kwv thiab kuv taug kev mus kawm ntawv."',
      },
      {
        id: 'q-kawm-2',
        prompt: 'What do they meet on the road?',
        options: ['A dog', 'A tiger', 'A bird', 'A horse'],
        answer: 'A dog',
        because: 'Paragraph 2 — "Peb pom ib tus aub nyob ntawm txoj kev."',
      },
    ],
  },

  {
    id: 'story-kuv-tsev-neeg',
    title: 'Kuv Tsev Neeg',
    english: 'My Family',
    genre: 'life',
    level: 'beginner',
    minutes: 2,
    blurb: 'Five people, one house.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Kuv tsev neeg muaj tsib leeg.', english: 'My family has five people.' },
      ],
      [
        { hmong: 'Kuv niam thiab kuv txiv nyob hauv tsev.', english: 'My mother and my father are at home.' },
        { hmong: 'Kuv muaj ob tug kwv.', english: 'I have two younger brothers.' },
      ],
      [
        { hmong: 'Peb hlub peb tsev neeg heev.', english: 'We love our family very much.' },
      ],
    ],
    glossary: [
      { hmong: 'tsev neeg', english: 'family' },
      { hmong: 'tsib leeg', english: 'five people' },
      { hmong: 'hlub', english: 'to love' },
    ],
    questions: [
      {
        id: 'q-tsevneeg-1',
        prompt: 'How many people are in the family?',
        options: ['Five', 'Two', 'Three', 'Ten'],
        answer: 'Five',
        because: 'Paragraph 1 — "Kuv tsev neeg muaj tsib leeg."',
      },
      {
        id: 'q-tsevneeg-2',
        prompt: 'How many younger brothers does the narrator have?',
        options: ['Two', 'One', 'Three', 'None'],
        answer: 'Two',
        because: 'Paragraph 2 — "Kuv muaj ob tug kwv."',
      },
    ],
  },

  {
    id: 'story-lub-tsev-qub',
    title: 'Lub Tsev Qub',
    english: 'The Old House',
    genre: 'horror',
    level: 'intermediate',
    minutes: 4,
    blurb: 'Nobody has lived there for years. Something is still awake.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Muaj ib lub tsev qub nyob ntawm ntug zos.', english: 'There is an old house at the edge of the village.' },
        { hmong: 'Tsis muaj neeg nyob hauv ntev lawm.', english: 'No one has lived inside for a long time.' },
      ],
      [
        { hmong: 'Ib hmos, kuv pom teeb ci hauv qhov rais.', english: 'One night, I saw a light shining in the window.' },
        { hmong: 'Kuv paub tias tsis muaj neeg nyob hauv.', english: 'I knew that no one lived inside.' },
      ],
      [
        { hmong: 'Kuv khiav mus tsev thiab kaw qhov rooj.', english: 'I ran home and closed the door.' },
      ],
    ],
    glossary: [
      { hmong: 'lub tsev qub', english: 'the old house' },
      { hmong: 'ntug zos', english: 'the edge of the village' },
      { hmong: 'qhov rais', english: 'window' },
      { hmong: 'qhov rooj', english: 'door' },
    ],
    questions: [
      {
        id: 'q-tsevqub-1',
        prompt: 'What did the narrator see at night?',
        options: [
          'A light in the window',
          'A dog on the road',
          'A woman at the door',
          'A bird on the roof',
        ],
        answer: 'A light in the window',
        because: 'Paragraph 2 — "Ib hmos, kuv pom teeb ci hauv qhov rais."',
      },
      {
        id: 'q-tsevqub-2',
        prompt: 'What did the narrator do next?',
        options: [
          'Ran home and closed the door',
          'Went inside the old house',
          'Called out to the light',
          'Waited until morning',
        ],
        answer: 'Ran home and closed the door',
        because: 'Paragraph 3 — "Kuv khiav mus tsev thiab kaw qhov rooj."',
      },
    ],
  },

  {
    id: 'story-qhov-rooj-qhib',
    title: 'Qhov Rooj Qhib',
    english: 'The Open Door',
    genre: 'horror',
    level: 'intermediate',
    minutes: 3,
    blurb: 'She closed it before bed. It is open now.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Thaum kuv sawv, qhov rooj qhib lawm.', english: 'When I woke up, the door was open.' },
        { hmong: 'Kuv nco qab tias kuv kaw nws lawm.', english: 'I remember that I had closed it.' },
      ],
      [
        { hmong: 'Kuv nug kuv tus muam, tiamsis nws tsis teb.', english: 'I asked my sister, but she did not answer.' },
      ],
      [
        { hmong: 'Muaj ib lub suab hais kuv lub npe.', english: 'There was a voice saying my name.' },
      ],
    ],
    glossary: [
      { hmong: 'qhib', english: 'to open' },
      { hmong: 'kaw', english: 'to close' },
      { hmong: 'nco qab', english: 'to remember' },
      { hmong: 'lub suab', english: 'a voice; a sound' },
    ],
    questions: [
      {
        id: 'q-qhovrooj-1',
        prompt: 'What was different when the narrator woke up?',
        options: ['The door was open', 'The window was broken', 'The house was empty', 'The light was on'],
        answer: 'The door was open',
        because: 'Paragraph 1 — "Thaum kuv sawv, qhov rooj qhib lawm."',
      },
      {
        id: 'q-qhovrooj-2',
        prompt: 'Who did the narrator ask?',
        options: ['His sister', 'His mother', 'His teacher', 'His younger brother'],
        answer: 'His sister',
        because: 'Paragraph 2 — "Kuv nug kuv tus muam, tiamsis nws tsis teb."',
      },
    ],
  },

  {
    id: 'story-suab-hauv-hav-zoov',
    title: 'Suab Hauv Hav Zoov',
    english: 'A Sound in the Forest',
    genre: 'horror',
    level: 'advanced',
    minutes: 4,
    blurb: 'They went in at dark. Something walked behind them.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Peb mus rau hauv hav zoov thaum tsaus ntuj.', english: 'We went into the forest at nightfall.' },
      ],
      [
        { hmong: 'Peb hnov ib lub suab tom qab peb.', english: 'We heard a sound behind us.' },
        { hmong: 'Peb tig los saib, tiamsis tsis pom leej twg.', english: 'We turned to look, but saw no one.' },
      ],
      [
        { hmong: 'Peb khiav tawm hauv hav zoov thiab tsis rov qab mus li lawm.', english: 'We ran out of the forest and never went back.' },
      ],
    ],
    glossary: [
      { hmong: 'hav zoov', english: 'forest' },
      { hmong: 'tsaus ntuj', english: 'nightfall; darkness' },
      { hmong: 'tom qab', english: 'behind; after' },
      { hmong: 'khiav', english: 'to run' },
    ],
    questions: [
      {
        id: 'q-havzoov-1',
        prompt: 'When did they go into the forest?',
        options: ['At nightfall', 'Early in the morning', 'At midday', 'After the rain'],
        answer: 'At nightfall',
        because: 'Paragraph 1 — "Peb mus rau hauv hav zoov thaum tsaus ntuj."',
      },
      {
        id: 'q-havzoov-2',
        prompt: 'What did they see when they turned around?',
        options: ['No one', 'A tiger', 'An old man', 'A light'],
        answer: 'No one',
        because: 'Paragraph 2 — "Peb tig los saib, tiamsis tsis pom leej twg."',
      },
    ],
  },

  {
    id: 'story-tus-tsov-thiab-tus-luav',
    title: 'Tus Tsov thiab Tus Luav',
    english: 'The Tiger and the Rabbit',
    genre: 'folk',
    level: 'intermediate',
    minutes: 4,
    blurb: 'The big one is not always the one who wins.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Muaj ib tug tsov thiab ib tug luav nyob hauv hav zoov.', english: 'There were a tiger and a rabbit in the forest.' },
      ],
      [
        { hmong: 'Tus tsov hais tias, "Kuv yuav noj koj."', english: 'The tiger said, "I am going to eat you."' },
        { hmong: 'Tus luav teb tias, "Kuv khiav ceev dua koj."', english: 'The rabbit answered, "I run faster than you."' },
      ],
      [
        { hmong: 'Tus luav khiav mus lawm, thiab tus tsov caum tsis tau nws.', english: 'The rabbit ran away, and the tiger could not catch it.' },
      ],
    ],
    glossary: [
      { hmong: 'tus tsov', english: 'the tiger' },
      { hmong: 'tus luav', english: 'the rabbit' },
      { hmong: 'khiav ceev', english: 'to run fast' },
      { hmong: 'caum', english: 'to chase' },
    ],
    questions: [
      {
        id: 'q-tsovluav-1',
        prompt: 'What did the tiger say to the rabbit?',
        options: [
          'That he was going to eat it',
          'That he was lost',
          'That he was hungry for rice',
          'That he wanted to race to the village',
        ],
        answer: 'That he was going to eat it',
        because: 'Paragraph 2 — "Kuv yuav noj koj."',
      },
      {
        id: 'q-tsovluav-2',
        prompt: 'How does the story end?',
        options: [
          'The tiger could not catch the rabbit',
          'The tiger ate the rabbit',
          'They became friends',
          'They both left the forest',
        ],
        answer: 'The tiger could not catch the rabbit',
        because: 'Paragraph 3 — "tus tsov caum tsis tau nws."',
      },
    ],
  },

  {
    id: 'story-tus-noog-liab',
    title: 'Tus Noog Liab',
    english: 'The Red Bird',
    genre: 'folk',
    level: 'beginner',
    minutes: 3,
    blurb: 'What the grandmother says a bird at the window means.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Ib tug noog liab los rau ntawm kuv lub qhov rais.', english: 'A red bird came to my window.' },
      ],
      [
        { hmong: 'Kuv pog hais tias tus noog coj xov xwm zoo.', english: 'My grandmother said the bird brings good news.' },
      ],
      [
        { hmong: 'Hnub tom qab, kuv txiv rov los tsev lawm.', english: 'The next day, my father came home.' },
      ],
    ],
    glossary: [
      { hmong: 'noog', english: 'bird' },
      { hmong: 'liab', english: 'red' },
      { hmong: 'xov xwm', english: 'news' },
      { hmong: 'pog', english: 'paternal grandmother' },
    ],
    questions: [
      {
        id: 'q-noogliab-1',
        prompt: 'Who says the bird brings good news?',
        options: ['The grandmother', 'The father', 'The teacher', 'The younger brother'],
        answer: 'The grandmother',
        because: 'Paragraph 2 — "Kuv pog hais tias tus noog coj xov xwm zoo."',
      },
      {
        id: 'q-noogliab-2',
        prompt: 'What happened the next day?',
        options: ['The father came home', 'The bird flew away', 'It rained', 'They went to the village'],
        answer: 'The father came home',
        because: 'Paragraph 3 — "Hnub tom qab, kuv txiv rov los tsev lawm."',
      },
    ],
  },

  {
    id: 'story-zaj-dab-neeg-nplej',
    title: 'Zaj Dab Neeg Nplej',
    english: 'The Story of Rice',
    genre: 'folk',
    level: 'intermediate',
    minutes: 4,
    blurb: 'Where the first rice came from, and who carried it down.',
    placeholder: true,
    paragraphs: [
      [
        { hmong: 'Thaum ub, neeg tsis muaj nplej noj.', english: 'Long ago, people had no rice to eat.' },
      ],
      [
        { hmong: 'Ib tug poj niam mus rau saum toj thiab pom ib tsob nplej.', english: 'A woman went up the hill and saw a rice plant.' },
      ],
      [
        { hmong: 'Nws coj cov noob los rau lub zos.', english: 'She brought the seeds back to the village.' },
        { hmong: 'Txij thaum ntawd los, sawv daws muaj mov noj.', english: 'From that time on, everyone had rice to eat.' },
      ],
    ],
    glossary: [
      { hmong: 'thaum ub', english: 'long ago' },
      { hmong: 'nplej', english: 'rice (still on the plant)' },
      { hmong: 'noob', english: 'seed' },
      { hmong: 'lub zos', english: 'the village' },
    ],
    questions: [
      {
        id: 'q-nplej-1',
        prompt: 'What did people lack long ago?',
        options: ['Rice', 'Water', 'Houses', 'Animals'],
        answer: 'Rice',
        because: 'Paragraph 1 — "Thaum ub, neeg tsis muaj nplej noj."',
      },
      {
        id: 'q-nplej-2',
        prompt: 'What did the woman bring back to the village?',
        options: ['Seeds', 'A rice plant', 'A bowl of rice', 'A bird'],
        answer: 'Seeds',
        because: 'Paragraph 3 — "Nws coj cov noob los rau lub zos."',
      },
    ],
  },
   * ══════════════════════════════════════════════════════════════════════════ */




  // New story
    
  // ══════════════════════════════════════════════════════════════════════════
  // MUS SAIB YEEB YAM — added 2026-09-26. A PRONOUN story: every sentence uses
  // at least one of the nine pronouns (kuv · wb · peb · koj · neb · nej · nws ·
  // nkawd · lawv), each many times, in a scene where who-is-with-whom keeps
  // changing (the narrator + Fong = wb; Mai + Nraug = nkawd; all four = peb).
  //
  // ⚠️ WRITTEN BY THE AUTHOR, grammar polished with AI by the author. The original
  // is kept in _incoming/story-mus-saib-yeeb-yam/.
  //
  // PRONOUN AUDIT, 2026-09-26 — at the author's request, against the author's table
  // (wb = we two · peb = we 3+ · neb = you two · nej = you 3+ · nkawd = they two ·
  // lawv = they 3+). The main fixes: the narrator is one of the four, so NARRATION
  // says peb (never nej/lawv) for the group; Yaj talking TO two of the four says
  // "nej plaub leeg"; seats near Mai + Nraug are "ze nkawd"; ¶15 was rewritten
  // around five strangers so lawv is truly "they, 3+". Every pronoun is used
  // 17+ times. Full list: notes/2026-09-26-story-pronoun-audit.md.
  // The author will still revise it — see notes/TODO.md (the action board).
  // Questions are Claude's, English only, quoting the story's Hmong.
  {
    id: 'story-mus-saib-yeeb-yam',
    title: 'Mus Saib Yeeb Yam',
    english: 'Going to the Movies',
    genre: 'life',
    level: 'beginner',
    minutes: 12,
    blurb: 'Four friends, two tickets, one movie — a story for practising every pronoun: wb, neb, nkawd and the rest.',
    paragraphs: [
      [
        { hmong: 'Hnub no, kuv thiab kuv cov phooj ywg yuav mus saib yeeb yam hauv tsev ntsia yeeb yam.', english: 'Today, my friends and I are going to watch a movie at the movie theater.' },
        { hmong: 'Peb pab muaj plaub leeg, yog kuv, Fong, Mai, thiab Nraug.', english: 'Our group has four people: me, Fong, Mai, and Nraug.' },
        { hmong: 'Kuv thiab Fong yog wb ob leeg, hos Mai thiab Nraug yog nkawd ob leeg.', english: 'Fong and I are “wb ob leeg” (the two of us), while Mai and Nraug are “nkawd ob leeg” (the two of them).' },
        { hmong: 'Peb plaub leeg tau npaj mus saib yeeb yam no tau ob peb hnub lawm.', english: 'All four of us have been preparing to watch this movie for several days.', means: { 'tau#1': 'tense-markers-past@1', 'tau#2': 'tense-markers-past@3' } },
      ],
      [
        { hmong: 'Thaum peb tseem nyob hauv tsev, kuv nug Fong tias, “Fong, koj puas npaj koj lub hnab lawm?”', english: 'While we were still at home, I asked Fong, “Fong, have you prepared your bag yet?”' },
        { hmong: 'Fong teb kuv tias, “Yog, kuv npaj kuv lub hnab lawm, ces wb mus tau.”', english: 'Fong answered me, “Yes, I have prepared my bag, so the two of us can go.”' },
        { hmong: 'Kuv nug Mai tias, “Mai, koj puas nqa koj daim pib lawm?”', english: 'I asked Mai, “Mai, have you brought your ticket yet?”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv nqa kuv daim pib lawm.”', english: 'Mai answered me, “Yes, I have brought my ticket.”' },
        { hmong: 'Kuv nug Nraug tias, “Nraug, koj puas muaj koj daim pib thiab?”', english: 'I asked Nraug, “Nraug, do you have your ticket too?”' },
        { hmong: 'Nraug teb kuv tias, “Yog, kuv muaj kuv daim pib.”', english: 'Nraug answered me, “Yes, I have my ticket.”' },
        { hmong: 'Yog li, peb plaub leeg thiaj tawm hauv tsev ua ke.', english: 'So, the four of us left the house together.' },
      ],
      [
        { hmong: 'Thaum peb plaub leeg los txog ntawm tsev ntsia yeeb yam, Mai thiab Nraug mus sawv tos ntawm qhov rooj.', english: 'When the four of us arrived at the movie theater, Mai and Nraug went ahead to wait at the entrance.' },
        { hmong: 'Nkawd twb yuav nkag mus rau hauv, vim nkawd twb muaj nkawd daim pib lawm.', english: 'The two of them were already about to go inside because they already had their tickets.' },
        { hmong: 'Kuv hais rau Mai tias, “Mai, koj thiab Nraug tos wb ntawm no ib pliag.”', english: 'I said to Mai, “Mai, you and Nraug wait here for us for a moment.”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb yuav tos neb ntawm no.”', english: 'Mai answered me, “Yes, we two will wait for you two here.”' },
        { hmong: 'Nraug kuj hais rau wb tias, “Wb yuav tos neb kom peb thiaj nkag mus ua ke.”', english: 'Nraug also said to us, “We two will wait for you two so that all four of us can go inside together.”' },
        { hmong: 'Kuv hais rau Fong tias, “Fong, wb mus nrhiav tus neeg muag daim pib.”', english: 'I said to Fong, “Fong, the two of us will go find the ticket seller.”' },
        { hmong: 'Fong teb kuv tias, “Yog, wb mus tam sim no.”', english: 'Fong answered me, “Yes, the two of us will go now.”' },
      ],
      [
        { hmong: 'Thaum wb mus hauv chav tos, kuv pom ib tug txiv neej zaum tom qab lub rooj muag daim pib.', english: 'When we two went into the waiting area, I saw a man sitting behind the ticket counter.' },
        { hmong: 'Nws yog Yaj, tus neeg muag daim pib.', english: 'He was Yaj, the ticket seller.' },
        { hmong: 'Kuv taug kev mus cuag Yaj, hos Fong taug kev nrog kuv.', english: 'I walked over to Yaj, and Fong walked with me.' },
        { hmong: 'Kuv nug Yaj tias, “Yaj, koj puas muag daim pib yeeb yam?”', english: 'I asked Yaj, “Yaj, do you sell movie tickets?”' },
        { hmong: 'Yaj teb kuv tias, “Yog, kuv muag daim pib.”', english: 'Yaj answered me, “Yes, I sell tickets.”' },
        { hmong: 'Kuv hais rau Yaj tias, “Wb xav yuav ob daim pib rau wb ob leeg.”', english: 'I said to Yaj, “The two of us want to buy two movie tickets.”' },
        { hmong: 'Yaj saib wb, ces nws nug wb tias, “Neb puas tuaj neb ob leeg xwb, los yog neb tuaj nrog lwm tus neeg?”', english: 'Yaj looked at the two of us, and then he asked us two, “Are you two here by yourselves, or did you come with other people?”' },
        { hmong: 'Kuv teb Yaj tias, “Wb tuaj nrog wb ob tug phooj ywg.”', english: 'I answered Yaj, “The two of us came with our two friends.”' },
      ],
      [
        { hmong: 'Yaj saib wb dua, ces nws nug kuv tias, “Koj tuaj nrog leej twg?”', english: 'Yaj looked at the two of us again, and then he asked me, “Who did you come with?”' },
        { hmong: 'Kuv teb nws tias, “Kuv tuaj nrog Fong, Mai, thiab Nraug.”', english: 'I answered him, “I came with Fong, Mai, and Nraug.”' },
        { hmong: 'Kuv qhia nws tias, “Peb plaub leeg los txog ua ke, tiam sis Mai thiab Nraug twb muaj nkawd daim pib lawm.”', english: 'I told him, “The four of us arrived together, but Mai and Nraug already have their tickets.”' },
        { hmong: 'Yaj hais rau wb tias, “Kuv pom nej plaub leeg los txog ua ke.”', english: 'Yaj said to the two of us, “I saw the four of you arrive together.”' },
        { hmong: 'Kuv nug Yaj tias, “Yaj, vim li cas koj ho nug wb txog qhov ntawd?”', english: 'I asked Yaj, “Yaj, why did you ask us that?”' },
        { hmong: 'Nws teb kuv tias, “Kuv nug vim kuv xav paub seb neb puas xav zaum ze nkawd.”', english: 'He answered me, “I asked because I want to know whether you two want to sit near the two of them.”' },
        { hmong: 'Nws ntxiv tias, “Kuv pom nej plaub leeg yog ib pab phooj ywg, ces kuv xav nrhiav ob lub rooj zaum ze nkawd rau neb.”', english: 'He continued, “I saw that the four of you are a group of friends, so I want to find two seats near the two of them for you two.”' },
        { hmong: 'Kuv teb Yaj tias, “Yog, wb xav zaum nrog wb ob tug phooj ywg.”', english: 'I answered Yaj, “Yes, the two of us want to sit with our two friends.”' },
      ],
      [
        { hmong: 'Kuv xav paub tus lej rooj zaum ntawm Mai thiab Nraug, tab sis kuv tsis paub.', english: 'I wanted to know Mai and Nraug’s seat numbers, but I did not know them.' },
        { hmong: 'Kuv tig mus nug Fong tias, “Fong, koj puas paub nkawd zaum ntawm tus lej twg?”', english: 'I turned to Fong and asked Fong, “Fong, do you know which numbers the two of them are sitting in?”' },
        { hmong: 'Fong teb kuv tias, “Kuv tsis paub thiab, wb rov mus nug nkawd.”', english: 'Fong answered me, “I do not know either, so the two of us should go ask them.”' },
        { hmong: 'Kuv hais rau Fong tias, “Yog, wb rov mus nug nkawd tam sim no.”', english: 'I said to Fong, “Yes, the two of us will go ask them right now.”' },
      ],
      [
        { hmong: 'Ces wb ob leeg rov mus cuag Mai thiab Nraug.', english: 'Then the two of us went back to Mai and Nraug.' },
        { hmong: 'Thaum wb mus txog ntawm ntawd, nkawd tseem tos wb.', english: 'When we got there, the two of them were still waiting for us.' },
        { hmong: 'Kuv nug Mai tias, “Mai, koj puas qhia tau wb paub neb tus lej rooj zaum?”', english: 'I asked Mai, “Mai, can you tell the two of us your two seat numbers?”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv qhia tau.”', english: 'Mai answered me, “Yes, I can.”' },
        { hmong: 'Kuv nug Mai ntxiv tias, “Koj thiab Nraug zaum ntawm tus lej twg?”', english: 'I asked Mai, “Which numbers are you and Nraug sitting in?”' },
        { hmong: 'Mai teb kuv tias, “Kuv zaum ntawm rooj 12, hos Nraug zaum ntawm rooj 13.”', english: 'Mai answered me, “I am sitting in seat 12, while Nraug is sitting in seat 13.”' },
        { hmong: 'Kuv nug Mai tias, “Koj puas muaj koj daim pib kom kuv saib?”', english: 'I asked Mai, “Do you have your ticket so I can look at it?”' },
        { hmong: 'Mai teb kuv tias, “Tau, kuv muab kuv daim pib rau koj.”', english: 'Mai answered me, “Sure, I will give my ticket to you.”' },
        { hmong: 'Nws muab daim pib ko rau kuv, thiab kuv saib tus lej ntawm daim pib ko.', english: 'She handed me this ticket, and I looked at the number on this ticket.' },
        { hmong: 'Kuv nug Mai tias, “Daim pib ko puas yog koj daim pib?”', english: 'I asked Mai, “Is this ticket your ticket?”' },
        { hmong: 'Mai teb kuv tias, “Yog, daim pib ko yog kuv daim pib.”', english: 'Mai answered me, “Yes, this ticket is my ticket.”' },
        { hmong: 'Nraug kuj muab nws daim pib rau wb, thiab nws hais rau wb tias, “Daim pib ntawd yog kuv daim pib.”', english: 'Nraug also handed his ticket to us, and he said to us, “That ticket is my ticket.”' },
        { hmong: 'Kuv saib daim pib ntawd, thiab kuv pom tus lej 13 ntawm nws.', english: 'I looked at that ticket, and I saw the number 13 on it.' },
        { hmong: 'Kuv muab ob daim pib rov qab rau nkawd.', english: 'I gave the two tickets back to the two of them.' },
        { hmong: 'Kuv hais rau nkawd tias, “Ua tsaug rau neb, wb paub neb tus lej rooj zaum lawm.”', english: 'I said to the two of them, “Thank you, you two. Now the two of us know your seat numbers.”' },
      ],
      [
        { hmong: 'Kuv tig mus rau Fong, ces kuv hais rau nws tias, “Fong, koj puas nco rooj 12 thiab rooj 13?”', english: 'I turned to Fong, and I said to him, “Fong, do you remember seats 12 and 13?”' },
        { hmong: 'Fong teb kuv tias, “Yog, kuv nco lawm, ces wb rov mus qhia Yaj.”', english: 'Fong answered me, “Yes, I remember, so the two of us should go tell Yaj.”' },
        { hmong: 'Kuv hais rau Mai tias, “Mai, koj thiab Nraug tos wb ntawm no.”', english: 'I said to Mai, “Mai, you and Nraug wait here for us.”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb yuav tos neb.”', english: 'Mai answered me, “Yes, we two will wait for you two.”' },
        { hmong: 'Kuv hais rau Nraug tias, “Nraug, koj nyob ntawm no nrog Mai.”', english: 'I said to Nraug, “Nraug, you stay here with Mai.”' },
        { hmong: 'Nraug teb kuv tias, “Yog, kuv nyob ntawm no.”', english: 'Nraug answered me, “Yes, I will stay here.”' },
      ],
      [
        { hmong: 'Thaum wb rov qab mus cuag Yaj, nws tseem zaum ntawm nws lub rooj muag daim pib.', english: 'When the two of us went back to Yaj, he was still sitting at his ticket counter.' },
        { hmong: 'Kuv hais rau Yaj tias, “Yaj, wb twb paub nkawd tus lej rooj zaum lawm.”', english: 'I said to Yaj, “Yaj, now the two of us know their seat numbers.”' },
        { hmong: 'Nws nug wb tias, “Neb puas paub nkawd lub rooj zaum?”', english: 'He asked us two, “Do you two know their seats?”' },
        { hmong: 'Kuv teb nws tias, “Yog, Mai zaum ntawm rooj 12, thiab Nraug zaum ntawm rooj 13.”', english: 'I answered him, “Yes, Mai is sitting in seat 12, and Nraug is sitting in seat 13.”' },
        { hmong: 'Yaj saib nws daim ntawv, thiab nws nrhiav cov rooj nyob ze ntawm ntawd.', english: 'Yaj looked at his list, and he looked for seats near those numbers.' },
        { hmong: 'Kuv nug Yaj tias, “Koj puas muaj ob lub rooj zaum nyob ze ntawm ntawd rau wb?”', english: 'I asked Yaj, “Do you have two seats near there for the two of us?”' },
        { hmong: 'Yaj teb kuv tias, “Yog, kuv muaj ob lub rooj zaum nyob ze nkawd.”', english: 'Yaj answered me, “Yes, I have two seats near the two of them.”' },
        { hmong: 'Kuv nug nws tias, “Koj puas yuav muag ob daim pib ntawd rau wb?”', english: 'I asked him, “Will you sell those two tickets to us?”' },
        { hmong: 'Yaj teb wb tias, “Yog, kuv muag tau ob daim pib rau neb.”', english: 'Yaj answered us two, “Yes, I can sell two tickets to you two.”' },
        { hmong: 'Yaj muab ob daim pib yeeb yam rau wb, thiab wb muab nyiaj rau nws.', english: 'Yaj gave the two movie tickets to us, and we gave him the money.' },
        { hmong: 'Kuv nqa kuv daim pib, hos Fong nqa nws daim pib.', english: 'I took my ticket, while Fong took his ticket.' },
        { hmong: 'Kuv hais rau Yaj tias, “Ua tsaug rau koj.”', english: 'I said to Yaj, “Thank you.”' },
        { hmong: 'Nws teb wb tias, “Neb txais tos, thiab neb yuav tau zaum ze nkawd.”', english: 'He answered the two of us, “You are welcome, and you two will be able to sit near them.”' },
      ],
      [
        { hmong: 'Yaj hais rau wb tias, “Kuv pom nej plaub leeg los txog ua ke, thiab kuv xav kom nej plaub leeg nyob ze ib leeg.”', english: 'Yaj said to the two of us, “I saw the four of you arrive together, and I want the four of you to stay close to one another.”' },
        { hmong: 'Nws qhia wb tias, “Kuv yuav nrhiav rooj ze nkawd kom nej plaub leeg thiaj pom yeeb yam zoo.”', english: 'He told the two of us, “I will find seats near the two of them so that the four of you can watch the movie comfortably.”' },
        { hmong: 'Thaum wb qhia tus lej rooj rau nws, nws hais tias, “Cov rooj ntawd nyob ze nkawd ob leeg.”', english: 'When the two of us gave him the seat numbers, he said, “Those seats are near the two of them.”' },
        { hmong: 'Yaj muab cov ntaub ntawv rau wb thiab hais tias, “Kuv xav kom nej plaub leeg tsis txhob sib nrug.”', english: 'Yaj gave the two of us the information and said, “I do not want the four of you to be separated.”' },
      ],
      [
        { hmong: 'Wb ob leeg nqa wb daim pib rov mus cuag Mai thiab Nraug.', english: 'The two of us took our tickets back to Mai and Nraug.' },
        { hmong: 'Thaum wb mus txog ntawm qhov rooj, nkawd tseem tos wb.', english: 'When we got to the entrance, the two of them were still waiting for us.' },
        { hmong: 'Mai nug wb tias, “Neb tau daim pib lawm los?”', english: 'Mai asked us two, “Did you two get the tickets?”' },
        { hmong: 'Kuv teb Mai tias, “Yog, wb tau lawm.”', english: 'I answered Mai, “Yes, the two of us got them.”' },
        { hmong: 'Kuv qhia kuv daim pib rau nkawd, thiab Fong kuj qhia nws daim pib rau nkawd.', english: 'I showed my ticket to the two of them, and Fong also showed his ticket to them.' },
        { hmong: 'Nraug saib Fong daim pib, hos Mai saib kuv daim pib.', english: 'Nraug looked at Fong’s ticket, while Mai looked at mine.' },
        { hmong: 'Kuv hais rau nkawd tias, “Tam sim no peb plaub leeg yuav tau zaum ze ua ke.”', english: 'I said to the two of them, “Now all four of us can sit close together.”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv zoo siab tias peb tau zaum ua ke.”', english: 'Mai answered me, “Yes, I am happy that all four of us can sit together.”' },
        { hmong: 'Nraug kuj hais tias, “Kuv kuj zoo siab thiab.”', english: 'Nraug also said, “I am happy too.”' },
        { hmong: 'Kuv hais rau nkawd tias, “Neb ob leeg khaws neb daim pib kom zoo.”', english: 'I said to the two of them, “You two should keep your tickets safe.”' },
      ],
      [
        { hmong: 'Yaj kuj hais rau peb tias, “Nej plaub leeg yuav tau nyob ze ib leeg thaum nej nkag mus.”', english: 'Yaj also said to all four of us, “The four of you will need to stay close to each other when you go inside.”' },
        { hmong: 'Nws nug peb tias, “Nej puas xav kom kuv nrhiav rooj zaum kom nej plaub leeg nyob ze ib leeg?”', english: 'He asked all four of us, “Do you want me to find seats so that the four of you can stay near one another?”' },
        { hmong: 'Yaj piav rau peb tias, “Nej plaub leeg twb tuaj ua ke lawm, ces nej yuav tau zaum ua ke.”', english: 'Yaj explained to all four of us, “All four of you came together, so all four of you should sit together.”' },
        { hmong: 'Thaum peb rov los cuag nws, nws saib peb dua thiab nug tias, “Nej puas tau npaj txhij lawm?”', english: 'When all four of us came back to him, he looked at all four of us again and asked, “Are all four of you ready?”' },
        { hmong: 'Ua ntej peb nkag mus, nws hais rau peb tias, “Nej khaws nej daim pib kom zoo.”', english: 'Before all four of us went inside, he told all four of us, “Keep your tickets safe.”' },
      ],
      [
        { hmong: 'Thaum peb plaub leeg nkag mus rau hauv chav saib yeeb yam, kuv coj Fong mus rau ntawm wb ob lub rooj.', english: 'When all four of us entered the movie room, I led Fong to our two seats.' },
        { hmong: 'Fong mus nrog kuv, hos Mai thiab Nraug mus nrhiav nkawd cov rooj.', english: 'Fong went with me, while Mai and Nraug went to find their two seats.' },
        { hmong: 'Kuv pom nkawd cov rooj nyob ze wb, ces kuv hu nkawd tias, “Mai thiab Nraug, neb cov rooj nyob ntawm ntawd.”', english: 'I saw that their seats were near ours, so I called to the two of them, “Mai and Nraug, your seats are over there.”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb pom lawm.”', english: 'Mai answered me, “Yes, we see them.”' },
        { hmong: 'Nraug hais rau wb tias, “Wb yuav zaum ntawm cov rooj ntawd.”', english: 'Nraug told the two of us (Fong and me), “We two (Mai and I) will sit in those seats.”' },
        { hmong: 'Kuv qhia Fong tias, “Fong, koj zaum ntawm koj lub rooj no.”', english: 'I told Fong, “Fong, you sit in your seat here.”' },
        { hmong: 'Fong teb kuv tias, “Yog, kuv zaum ntawm no.”', english: 'Fong answered me, “Yes, I will sit here.”' },
        { hmong: 'Kuv tig mus rau Mai tias, “Mai, koj zaum ntawm koj lub rooj ntawd.”', english: 'I turned to Mai and said, “Mai, you sit in your seat over there.”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv zaum ntawm ntawd.”', english: 'Mai answered me, “Yes, I will sit there.”' },
        { hmong: 'Nraug kuj zaum ntawm nws lub rooj, thiab nws hais rau wb tias, “Kuv zaum ntawm no.”', english: 'Nraug also sat in his seat, and he said to us, “I am sitting here.”' },
        { hmong: 'Yog li, peb plaub leeg thiaj zaum ua ke.', english: 'So all four of us got to sit together.' },
      ],
      [
        { hmong: 'Yaj tuaj xyuas peb ua ntej yeeb yam pib, thiab nws saib peb plaub leeg.', english: 'Yaj came to check on all four of us before the movie started, and he looked at all four of us.' },
        { hmong: 'Nws hais rau peb tias, “Nej plaub leeg zaum tau zoo lawm.”', english: 'He said to all four of us, “The four of you are sitting well now.”' },
        { hmong: 'Kuv teb Yaj tias, “Yog, peb zaum tau zoo lawm.”', english: 'I answered Yaj, “Yes, all four of us are sitting well.”' },
        { hmong: 'Yaj hais rau peb tias, “Nej khaws nej daim pib kom zoo, thiab nej saib yeeb yam kom lom zem.”', english: 'Yaj told all four of us, “Keep your tickets safe, and enjoy the movie.”' },
        { hmong: 'Peb teb nws tias, “Yog, peb yuav ua li ntawd.”', english: 'We answered him, “Yes, we will do that.”' },
        { hmong: 'Nws hais rau peb tias, “Kuv cia nej saib yeeb yam.”', english: 'He said to all four of us, “I will let you watch the movie.”' },
        { hmong: 'Kuv hais rau Yaj tias, “Ua tsaug rau koj.”', english: 'I said to Yaj, “Thank you.”' },
      ],
      [
        { hmong: 'Thaum yeeb yam tseem tsis tau pib, muaj ib pab neeg tsib leeg los zaum pem hauv ntej peb.', english: 'Before the movie started, a group of five people came and sat in front of us.' },
        { hmong: 'Lawv tsib leeg tham nrov nrov, thiab lawv luag heev.', english: 'The five of them were talking loudly, and they were laughing a lot.' },
        { hmong: 'Kuv hais me me rau Fong tias, “Fong, koj puas paub lawv?”', english: 'I whispered to Fong, “Fong, do you know them?”' },
        { hmong: 'Fong teb kuv tias, “Kuv tsis paub lawv, tiam sis lawv zoo li lom zem.”', english: 'Fong answered me, “I don’t know them, but they seem fun.”' },
        { hmong: 'Nraug hais me me rau wb tias, “Wb paub lawv, lawv kawm ntawv nrog wb.”', english: 'Nraug whispered to the two of us (Fong and me), “We two (Mai and I) know them — they go to school with the two of us.”' },
        { hmong: 'Thaum yeeb yam yuav pib, lawv tsib leeg nyob twj ywm, thiab lawv kuj saib yeeb yam.', english: 'When the movie was about to start, the five of them went quiet, and they watched the movie too.' },
      ],
      [
        { hmong: 'Thaum yeeb yam pib, kuv ntsia pem hauv ntej thiab kuv mloog zaj yeeb yam.', english: 'When the movie started, I looked forward and listened to the movie.' },
        { hmong: 'Fong zaum ntawm kuv ib sab, ces nws kuj saib yeeb yam nrog kuv.', english: 'Fong sat beside me, so he also watched the movie with me.' },
        { hmong: 'Mai thiab Nraug zaum ntawm nkawd ob lub rooj, ces nkawd kuj saib yeeb yam nrog wb.', english: 'Mai and Nraug sat in their two seats, so the two of them also watched the movie with the two of us.' },
        { hmong: 'Kuv nug Fong tias, “Fong, koj puas nyiam yeeb yam no?”', english: 'I asked Fong, “Fong, do you like this movie?”' },
        { hmong: 'Fong teb kuv tias, “Yog, kuv nyiam nws heev.”', english: 'Fong answered me, “Yes, I like it very much.”' },
        { hmong: 'Kuv nug Mai tias, “Mai, koj puas nyiam yeeb yam no?”', english: 'I asked Mai, “Mai, do you like this movie?”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv nyiam nws.”', english: 'Mai answered me, “Yes, I like it.”' },
        { hmong: 'Kuv nug Nraug tias, “Nraug, koj puas nyiam yeeb yam no?”', english: 'I asked Nraug, “Nraug, do you like this movie?”' },
        { hmong: 'Nraug teb kuv tias, “Yog, kuv nyiam nws thiab.”', english: 'Nraug answered me, “Yes, I like it too.”' },
        { hmong: 'Kuv pom tias peb plaub leeg yeej nyiam yeeb yam no.', english: 'I saw that all four of us really liked this movie.' },
      ],
      [
        { hmong: 'Thaum zaj yeeb yam mus txog ib nrab, kuv saib Fong thiab nug nws tias, “Koj puas tseem xav zaum ntawm no?”', english: 'When the movie was about halfway through, I looked at Fong and asked him, “Do you still want to sit here?”' },
        { hmong: 'Fong teb kuv tias, “Yog, kuv zaum tau zoo ntawm no.”', english: 'Fong answered me, “Yes, I can sit comfortably here.”' },
        { hmong: 'Kuv saib Mai thiab nug nws tias, “Mai, koj puas zaum tau zoo ntawm ntawd?”', english: 'I looked at Mai and asked her, “Mai, are you sitting comfortably over there?”' },
        { hmong: 'Mai teb kuv tias, “Yog, kuv zaum tau zoo ntawm ntawd.”', english: 'Mai answered me, “Yes, I am sitting comfortably there.”' },
        { hmong: 'Kuv saib Nraug thiab nug nws tias, “Nraug, koj puas zaum tau zoo thiab?”', english: 'I looked at Nraug and asked him, “Nraug, are you sitting comfortably too?”' },
        { hmong: 'Nraug teb kuv tias, “Yog, kuv zaum tau zoo.”', english: 'Nraug answered me, “Yes, I am sitting comfortably.”' },
        { hmong: 'Kuv pom tias nkawd ob leeg zaum tau zoo, thiab wb ob leeg kuj zaum tau zoo.', english: 'I saw that the two of them were sitting comfortably, and the two of us were also sitting comfortably.' },
      ],
      [
        { hmong: 'Thaum yeeb yam yuav xaus, kuv khaws kuv daim pib rau hauv kuv lub hnab.', english: 'When the movie was about to end, I put my ticket away in my bag.' },
        { hmong: 'Fong kuj khaws nws daim pib rau hauv nws lub hnab, ces wb ob leeg npaj tawm.', english: 'Fong also put his ticket in his bag, so the two of us were getting ready to leave.' },
        { hmong: 'Mai muab nws daim pib khaws cia, thiab Nraug kuj khaws nws daim pib.', english: 'Mai put her ticket away safely, and Nraug also put his ticket away.' },
        { hmong: 'Kuv hais rau nkawd tias, “Neb npaj txhij lawm los?”', english: 'I said to the two of them, “Are you two ready?”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb npaj txhij lawm.”', english: 'Mai answered me, “Yes, the two of us are ready.”' },
        { hmong: 'Nraug hais tias, “Kuv npaj lawm thiab.”', english: 'Nraug said, “I am ready too.”' },
        { hmong: 'Kuv hais rau Fong tias, “Fong, koj puas npaj tawm?”', english: 'I said to Fong, “Fong, are you ready to leave?”' },
        { hmong: 'Fong teb kuv tias, “Yog, wb tawm tau lawm.”', english: 'Fong answered me, “Yes, the two of us can leave now.”' },
      ],
      [
        { hmong: 'Thaum peb tawm hauv chav saib yeeb yam, kuv pom Yaj ntawm qhov rooj.', english: 'When all four of us left the movie room, I saw Yaj at the entrance.' },
        { hmong: 'Nws saib peb thiab hais tias, “Nej puas nyiam yeeb yam?”', english: 'He looked at all four of us and asked, “Did all four of you like the movie?”' },
        { hmong: 'Kuv teb Yaj tias, “Yog, peb nyiam heev.”', english: 'I answered Yaj, “Yes, all four of us liked it a lot.”' },
        { hmong: 'Nws nug peb tias, “Nej puas yuav rov qab tuaj saib dua?”', english: 'He asked all four of us, “Will all four of you come back to watch another movie?”' },
        { hmong: 'Kuv teb nws tias, “Yog, wb xav rov qab tuaj.”', english: 'I answered him, “Yes, the two of us (Fong and I) want to come back.”' },
        { hmong: 'Kuv tig mus rau Mai thiab Nraug, ces kuv nug nkawd tias, “Neb puas xav rov qab tuaj nrog wb lwm zaus?”', english: 'I turned to Mai and Nraug, and I asked the two of them, “Do you two want to come back with the two of us another time?”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb xav rov qab tuaj.”', english: 'Mai answered me, “Yes, the two of us want to come back.”' },
        { hmong: 'Nraug kuj hais tias, “Kuv xav rov qab tuaj thiab.”', english: 'Nraug also said, “I want to come back too.”' },
        { hmong: 'Kuv hais rau sawv daws tias, “Yog li, peb plaub leeg mam rov qab tuaj ua ke lwm zaus.”', english: 'I said to everyone, “Then the four of us can come back together another time.”' },
      ],
      [
        { hmong: 'Thaum peb npaj yuav tawm hauv tsev ntsia yeeb yam, Ntxawm thiab Nplooj pom wb ob leeg ntawm qhov rooj, hos Mai thiab Nraug tseem nyob tom qab.', english: 'When all four of us were getting ready to leave the movie theater, Ntxawm and Nplooj saw the two of us (Fong and me) at the door, while Mai and Nraug were still behind.' },
        { hmong: 'Nkawd tuaj cuag wb thiab nug wb tias, “Neb puas nyiam yeeb yam no?”', english: 'The two of them came over to us and asked us two, “Did you two like this movie?”' },
        { hmong: 'Kuv teb nkawd tias, “Yog, wb nyiam heev.”', english: 'I answered the two of them, “Yes, the two of us liked it very much.”' },
        { hmong: 'Ntxawm tig mus rau Nplooj thiab hais tias, “Kuv pom lawv plaub leeg zaum ua ke.”', english: 'Ntxawm turned to Nplooj and said, “I saw all four of them sitting together.”' },
        { hmong: 'Nplooj teb Ntxawm tias, “Kuv kuj pom lawv plaub leeg.”', english: 'Nplooj answered Ntxawm, “I saw all four of them too.”' },
        { hmong: 'Ntxawm hais tias, “Lawv cov phooj ywg zoo li sib raug zoo heev.”', english: 'Ntxawm said, “Their friends seem to get along very well.”' },
        { hmong: 'Nplooj teb tias, “Yog, lawv plaub leeg zoo siab heev.”', english: 'Nplooj answered, “Yes, all four of them seem very happy.”' },
        { hmong: 'Ntxawm hais tias, “Kuv pom lawv plaub leeg tham nrog Yaj.”', english: 'Ntxawm said, “I saw the four of them talking with Yaj.”' },
        { hmong: 'Ntxawm hais ntxiv tias, “Lawv plaub leeg zaum ua ke tau zoo heev.”', english: 'Ntxawm added, “All four of them sat together very well.”' },
        { hmong: 'Nplooj hais tias, “Lawv plaub leeg zoo li muaj kev zoo siab thaum lawv ua ke.”', english: 'Nplooj said, “All four of them seem happy when they are together.”' },
        { hmong: 'Kuv hais rau nkawd tias, “Wb ua tsaug rau neb.”', english: 'I said to the two of them, “The two of us thank you two.”' },
        { hmong: 'Nkawd teb wb tias, “Neb txais tos.”', english: 'The two of them answered us, “You are welcome.”' },
      ],
      [
        { hmong: 'Kuv tig mus rau Fong thiab hais tias, “Fong, koj puas npaj mus?”', english: 'I turned to Fong and said, “Fong, are you ready to go?”' },
        { hmong: 'Fong teb kuv tias, “Yog, wb npaj lawm.”', english: 'Fong answered me, “Yes, the two of us are ready.”' },
        { hmong: 'Kuv saib Mai thiab Nraug, ces kuv hais rau nkawd tias, “Neb, peb mus lawm.”', english: 'I looked at Mai and Nraug, and I said to the two of them, “You two, we are leaving.”' },
        { hmong: 'Mai teb kuv tias, “Yog, wb mus.”', english: 'Mai answered me, “Yes, we two are going.”' },
        { hmong: 'Nraug hais tias, “Wb rov mus ua ke.”', english: 'Nraug said, “The two of us will go together.”' },
        { hmong: 'Ces peb plaub leeg tawm tsev ntsia yeeb yam ua ke.', english: 'Then all four of us left the movie theater together.' },
      ],
    ],
    glossary: [
      { hmong: 'Fong', english: 'Fong — one of the four friends; with the narrator, "wb ob leeg" (the two of us)' },
      { hmong: 'Mai', english: 'Mai — one of the four friends; with Nraug, "nkawd ob leeg" (the two of them)' },
      { hmong: 'Nraug', english: 'Nraug — one of the four friends' },
      { hmong: 'Yaj', english: 'Yaj — the ticket seller' },
      { hmong: 'Ntxawm', english: 'Ntxawm — a friend who meets them as they leave' },
      { hmong: 'Nplooj', english: 'Nplooj — Ntxawm’s friend' },
      { hmong: 'tsev ntsia yeeb yam', english: 'movie theater, cinema — where the four friends go' },
      { hmong: 'yeeb yam', english: 'a movie' },
      { hmong: 'daim pib yeeb yam', english: 'a movie ticket' },
      { hmong: 'daim pib', english: 'a ticket' },
      { hmong: 'rooj zaum', english: 'a seat — the numbered seats inside the theater' },
      { hmong: 'tus neeg muag daim pib', english: 'the ticket seller — Yaj' },
      { hmong: 'phooj ywg', english: 'friend' },
      { hmong: 'ua ke', english: 'together' },
      { hmong: 'vim li cas', english: 'why' },
      { hmong: 'ntawm no', english: 'here — near the speaker' },
      { hmong: 'ntawm ntawd', english: 'there, over there' },
      { hmong: 'no', english: 'this — close to the speaker: "koj lub rooj no"' },
      { hmong: 'ntawd', english: 'that — farther from the speaker' },
      { hmong: 'ko', english: 'that, near the person spoken to — "daim pib ko", the ticket by Mai' },
      { hmong: 'npaj', english: 'to prepare, to get ready' },
      { hmong: 'los txog', english: 'to arrive' },
      { hmong: 'sib nrug', english: 'to be apart, separated from each other' },
      { hmong: 'tos', english: 'to wait' },
      { hmong: 'nrhiav', english: 'to look for, to find' },
      { hmong: 'cuag', english: 'to go up to, to approach' },
      { hmong: 'muag', english: 'to sell' },
      { hmong: 'yuav', english: 'to buy — also "will" before a verb' },
      { hmong: 'muab', english: 'to give, to hand' },
      { hmong: 'qhia', english: 'to tell, to show' },
      { hmong: 'tus lej', english: 'a number — the seat numbers 12 and 13' },
      { hmong: 'nco', english: 'to remember' },
      { hmong: 'tseem', english: 'still' },
      { hmong: 'twb', english: 'already' },
      { hmong: 'ho', english: 'then; as for — adds contrast: "vim li cas koj ho nug"' },
      { hmong: 'hos', english: 'while, whereas — contrasts two people' },
      { hmong: 'tiam sis', english: 'but, however' },
      { hmong: 'yog li', english: 'so, therefore' },
      { hmong: 'thiaj', english: 'then, so — the result of what came before' },
      { hmong: 'tau', english: 'can, be able to, get to' },
      { hmong: 'nkag mus', english: 'to go inside, to enter' },
      { hmong: 'zaum', english: 'to sit' },
      { hmong: 'nyob ze', english: 'to be near' },
      { hmong: 'ib sab', english: 'beside, next to' },
      { hmong: 'tam sim no', english: 'right now' },
      { hmong: 'ib pliag', english: 'a moment' },
      { hmong: 'rov qab', english: 'to go back, to return' },
      { hmong: 'khaws', english: 'to keep, to put away safely' },
      { hmong: 'lom zem', english: 'fun, enjoyable' },
      { hmong: 'xaus', english: 'to end, to finish' },
      { hmong: 'lwm zaus', english: 'another time, next time' },
      { hmong: 'sawv daws', english: 'everyone — "Kuv hais rau sawv daws", I said to everyone' },
      { hmong: 'hais me me', english: 'to whisper' },
      { hmong: 'tham nrov nrov', english: 'to talk loudly' },
      { hmong: 'nyob twj ywm', english: 'to be quiet, to fall silent' },
      { hmong: 'kawm ntawv', english: 'to study, to go to school' },
      { hmong: 'lawv tsib leeg', english: 'the five of them — lawv because there are more than two' },
      { hmong: 'nej plaub leeg', english: 'the four of you — nej because Yaj is talking to more than two' },
    ],
    questions: [
      { id: 'q-yeeb-yam-1', prompt: 'In “Kuv thiab Fong yog wb ob leeg”, who are “wb”?', options: ['Kuv and Fong', 'Mai and Nraug', 'Yaj and Fong', 'All four friends'], answer: 'Kuv and Fong', because: 'Paragraph 1 — “Kuv thiab Fong yog wb ob leeg.”' },
      { id: 'q-yeeb-yam-2', prompt: 'In “Nkawd twb yuav nkag mus rau hauv”, who are “nkawd”?', options: ['Mai and Nraug', 'Kuv and Fong', 'Yaj and Mai', 'Ntxawm and Nplooj'], answer: 'Mai and Nraug', because: 'Paragraph 3 — Mai and Nraug are waiting at the door with their tickets.' },
      { id: 'q-yeeb-yam-3', prompt: 'Who is Yaj?', options: ['The ticket seller', 'One of the four friends', 'Fong’s brother', 'A friend they meet at the end'], answer: 'The ticket seller', because: 'Paragraph 4 — “Nws yog Yaj, tus neeg muag daim pib.”' },
      { id: 'q-yeeb-yam-4', prompt: 'Mai says “Yog, wb yuav tos neb.” Who is “neb”?', options: ['Kuv and Fong — the two she is talking to', 'Mai and Nraug', 'Yaj', 'All four friends'], answer: 'Kuv and Fong — the two she is talking to', because: 'Paragraph 8 — neb is “you two”: Mai answers the narrator, who is going off with Fong.' },
      { id: 'q-yeeb-yam-5', prompt: 'Which seat is Mai sitting in?', options: ['12', '13', '4', '2'], answer: '12', because: 'Paragraph 7 — “Kuv zaum ntawm rooj 12, hos Nraug zaum ntawm rooj 13.”' },
      { id: 'q-yeeb-yam-6', prompt: 'Which word means all four friends together — “peb plaub leeg”?', options: ['peb', 'wb', 'neb', 'nkawd'], answer: 'peb', because: 'Paragraph 1 — “Peb plaub leeg…”: peb is “we” for three or more.' },
      { id: 'q-yeeb-yam-7', prompt: 'What does Yaj tell them to do with their tickets?', options: ['Keep them safe', 'Give them back', 'Sell them', 'Throw them away'], answer: 'Keep them safe', because: 'Paragraph 12 — “Nej khaws nej daim pib kom zoo.”' },
      { id: 'q-yeeb-yam-8', prompt: 'Who comes over to Fong and the narrator as they leave the theater?', options: ['Ntxawm and Nplooj', 'Mai and Nraug', 'Yaj and Fong', 'Nobody'], answer: 'Ntxawm and Nplooj', because: 'Paragraph 20 — “Ntxawm thiab Nplooj pom wb ob leeg ntawm qhov rooj.”' },
      { id: 'q-yeeb-yam-9', prompt: 'Yaj says “Nej plaub leeg zaum tau zoo lawm.” Why “nej” and not “neb”?', options: ['He is talking to all four — nej is “you” for three or more', 'He is talking to two people — nej is “you two”', 'He is talking about people who are not there', 'He is talking about himself'], answer: 'He is talking to all four — nej is “you” for three or more', because: 'Paragraph 14 — neb is only for two people; for three or more, “you” is nej.' },
      { id: 'q-yeeb-yam-10', prompt: 'In paragraph 15, why are the people in front called “lawv”, not “nkawd”?', options: ['There are five of them — lawv is “they” for three or more', 'There are two of them', 'They are the four friends', 'Lawv means “you all”'], answer: 'There are five of them — lawv is “they” for three or more', because: 'Paragraph 15 — “Lawv tsib leeg…”: nkawd is only for two people.' },
    ],
  },
  {
    id: 'story-kev-tswj-ib-puag-ncig',
    title: 'Kev Tswj Xyuas Ib Puag Ncig Thiab Lub Luag Haujlwm Ntawm Tib Neeg',
    english: 'Environmental Protection and Human Responsibility',
    genre: 'society',
    level: 'intermediate',
    minutes: 5,
    blurb: 'Clean water, forests, animals, and the shared responsibility to protect the world for future generations.',

    paragraphs: [
      [
        {
          hmong: 'Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.',
          english: 'This world has many valuable things such as clean water, good air, green forests, and many species of animals.',
        },
        {
          hmong: 'Txij li thaum tib neeg pib tsim kho vaj tse thiab cog qoob loo ntau zog, ib puag ncig tau raug kev puas tsuaj ntau heev.',
          english: 'Ever since people began building and farming more intensively, the environment has suffered a great deal of damage.',
        },
      ],
      [
        {
          hmong: 'Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.',
          english: 'Chemicals, exhaust fumes, and waste have caused the land and water to become seriously polluted.',
        },
        {
          hmong: 'Cov kws tshawb fawb tau ceeb toom tias yog peb tsis hloov peb txoj kev coj ua sai sai, ntau hom tsiaj txhu yuav ploj ntais mus ib txhis.',
          english: 'Researchers have warned that if we do not change our ways quickly, many species of animals will disappear forever.',
        },
        {
          // ⚠️ FIXED 2026-09-25 — was "natural electricity that controls the weather…" — the English said "disruption of natural forces", which the Hmong never did. ⚠️ Replacement subject written by Claude from words already in this text; needs a fluent read.
          // Was: hmong: 'Hluav taws xob ntuj uas tswj huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.',
          hmong: 'Kev hloov pauv ntawm huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv.',
          // ⚠️ FIXED 2026-09-25 — English re-translated to match the new Hmong.
          // Was: english: 'The disruption of natural forces that regulate the climate will cause larger and more severe storms.',
          english: 'Changes in the weather will make storms grow larger and more severe.',
        },
      ],
      [
        {
          hmong: 'Yog li ntawd, txhua tus neeg muaj lub luag haujlwm los tiv thaiv ib puag ncig rau peb cov tub ki xeeb ntxwv.',
          english: 'Therefore, every person has a responsibility to protect the environment for our future generations and descendants.',
        },
        {
          // ⚠️ FIXED 2026-09-25 — "tsis txhob" is the app's negative (see animals-tiger); "khoom puas" read as "broken things".
          // Was: hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom txhob pov tseg cov khoom puas ib puag ncig.',
          hmong: 'Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.',
          english: 'Governments must also establish laws to regulate businesses so they do not dispose of materials that harm the environment.',
        },
      ],
      [
        {
          hmong: 'Tiamsis, kev hloov pib los ntawm txhua tus neeg ib leeg ib leeg.',
          english: 'However, change begins with each individual person.',
        },
        {
          hmong: 'Peb yuav ua tau li ntawd los ntawm tsis ua khoom pov tseg ntau, cog ntoo ntxiv, thiab siv hluav taws xob los ntawm hnub ci thiab cua.',
          english: 'We can do this by producing less waste, planting more trees, and using energy from the sun and wind.',
        },
      ],
      [
        {
          // ⚠️ FIXED 2026-09-25 — "suav daws" (everyone) moved to follow the subject it counts; it sat after the object.
          // Was: hmong: 'Peb haiv neeg Hmoob tau nyob ze rau ib puag ncig suav daws los ntev lawm.',
          hmong: 'Peb haiv neeg Hmoob suav daws tau nyob ze rau ib puag ncig los ntev lawm.',
          // ⚠️ FIXED 2026-09-25 — English now carries "suav daws", which it had dropped.
          // Was: english: 'Our Hmong people have lived close to nature for a long time.',
          english: 'All of us Hmong people have lived close to nature for a long time.',
        },
        {
          hmong: 'Yog li kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai uas peb yuav tsum coj mus rau yav pem suab.',
          english: 'Therefore, respecting and caring for the environment is part of our cultural heritage that we must carry forward into the future.',
        },
      ],
    ],

    glossary: [
      // ⚠️ SPELLING VARIANT, added 2026-09-25. The dictionary has 'ntiaj teb'
      // spaced; this text writes it solid — this line lets a
      // tap on the story's own spelling resolve. Not a correction of the text.
      { hmong: 'ntiajteb', english: 'the world, the earth — also spelled "ntiaj teb"' },
      {
        hmong: 'ib puag ncig',
        english: 'the environment; surroundings; the natural world around us',
      },
      {
        hmong: 'kev tswj xyuas',
        english: 'management, care, protection, or stewardship',
      },
      {
        hmong: 'lub luag haujlwm',
        english: 'responsibility; duty; obligation',
      },
      {
        hmong: 'khoom muaj nuj nqis',
        english: 'valuable things; resources of value',
      },
      {
        hmong: 'huab cua',
        english: 'air; atmosphere; weather, depending on context',
      },
      {
        hmong: 'hav zoov',
        english: 'forest; woods',
      },
      {
        hmong: 'tsiaj txhu',
        english: 'animals; wildlife; livestock, depending on context',
      },
      {
        hmong: 'tsim kho',
        english: 'to build, develop, construct, or improve',
      },
      {
        hmong: 'cog qoob loo',
        english: 'to farm; to plant crops',
      },
      {
        hmong: 'raug kev puas tsuaj',
        english: 'to suffer damage; to be harmed or destroyed',
      },
      {
        hmong: 'tshuaj lom',
        english: 'poisonous chemicals; toxic substances',
      },
      {
        hmong: 'pa roj avgas',
        english: 'exhaust fumes; vehicle emissions',
      },
      {
        hmong: 'khoom pov tseg',
        english: 'waste; rubbish; discarded materials',
      },
      {
        hmong: 'qias neeg',
        english: 'dirty; polluted; contaminated',
      },
      {
        hmong: 'kws tshawb fawb',
        english: 'researcher; scientist',
      },
      {
        hmong: 'ceeb toom',
        english: 'to warn; warning',
      },
      {
        hmong: 'ploj ntais mus ib txhis',
        english: 'to disappear completely forever; to become extinct',
      },
      {
        hmong: 'nag xob nag cua',
        english: 'a thunderstorm; severe storm with lightning and wind',
      },
      {
        hmong: 'tub ki xeeb ntxwv',
        english: 'children, grandchildren, and future descendants',
      },
      {
        hmong: 'tsoom fwv',
        english: 'government',
      },
      {
        hmong: 'kev cai lij choj',
        english: 'law; legal rules or regulations',
      },
      {
        hmong: 'koom haum lag luam',
        english: 'business organization; company; corporation',
      },
      {
        hmong: 'txhob',
        english: 'do not; should not; so that something does not happen',
      },
      {
        hmong: 'hluav taws xob',
        english: 'electricity; electrical energy',
      },
      {
        hmong: 'hnub ci',
        english: 'sunlight; solar',
      },
      {
        hmong: 'haiv neeg Hmoob',
        english: 'the Hmong people; Hmong ethnic community',
      },
      {
        hmong: 'kab lis kev cai',
        english: 'culture; customs; cultural tradition',
      },
      {
        hmong: 'yav pem suab',
        english: 'the future; the time ahead',
      },
      // ⚠️ DUPLICATES, commented out 2026-09-24. All three are glossed earlier in
      // this list, and tier 1 lookup takes the FIRST match, so these could never
      // show. RESTORE by merging the wording into the earlier entry, not here.
      // {
      //   hmong: 'tsiaj txhu',
      //   english: 'animals; livestock',
      // },
      // {
      //   hmong: 'tub ki xeeb ntxwv',
      //   english: 'future generations; descendants',
      // },
      // {
      //   hmong: 'kab lis kev cai',
      //   english: 'culture; cultural customs',
      // },
      // ⚠️ UNUSED, commented out 2026-09-25 — ¶2 no longer says this (see the
      // FIXED note there). RESTORE if that line goes back to the original.
      // {
      //   hmong: 'hluav taws xob ntuj',
      //   english: 'natural electricity; lightning; natural forces',
      // },
    ],

    questions: [
      {
        id: 'q-puag-ncig-1',
        prompt: 'Lub ntiajteb no muaj yam khoom muaj nuj nqis dab tsi? — What valuable things does the world have?',
        options: [
          'Clean water, good air, forests, and many animals',
          'Only cities and roads',
          'Only factories and machines',
          'Only food and houses',
        ],
        answer: 'Clean water, good air, forests, and many animals',
        because: 'Paragraph 1 — “Lub ntiajteb no muaj ntau yam khoom muaj nuj nqis xws li dej huv, huab cua zoo, hav zoov ntsuab, thiab tsiaj txhu ntau hom.”',
      },
      {
        id: 'q-puag-ncig-2',
        prompt: 'Dab tsi ua rau av thiab dej qias neeg? — What causes the land and water to become polluted?',
        options: [
          'Chemicals, exhaust fumes, and waste',
          'Rain and wind',
          'Trees and animals',
          'Clean water and sunlight',
        ],
        answer: 'Chemicals, exhaust fumes, and waste',
        because: 'Paragraph 2 — “Cov tshuaj lom, pa roj avgas, thiab khoom pov tseg tau ua rau av thiab dej qias neeg kawg.”',
      },
      {
        id: 'q-puag-ncig-3',
        prompt: 'Yog peb tsis hloov peb txoj kev coj ua, yuav muaj dab tsi tshwm sim rau tsiaj txhu? — If we do not change our ways, what may happen to animals?',
        options: [
          'Many species may disappear forever',
          'They will all move into cities',
          'They will become larger',
          'They will stop needing water',
        ],
        answer: 'Many species may disappear forever',
        because: 'Paragraph 2 — “Ntau hom tsiaj txhu yuav ploj ntais mus ib txhis.”',
      },
      {
        id: 'q-puag-ncig-4',
        prompt: 'Leej twg muaj lub luag haujlwm los tiv thaiv ib puag ncig? — Who has a responsibility to protect the environment?',
        options: [
          'Every person',
          'Only scientists',
          'Only the government',
          'Only farmers',
        ],
        answer: 'Every person',
        because: 'Paragraph 3 — “Txhua tus neeg muaj lub luag haujlwm los tiv thaiv ib puag ncig.”',
      },
      {
        id: 'q-puag-ncig-5',
        prompt: 'Tsoom fwv yuav tsum ua dab tsi rau cov koom haum lag luam? — What should governments do regarding businesses?',
        options: [
          'Create laws to stop harmful waste disposal',
          'Give all businesses more waste',
          'Tell businesses to cut down forests',
          'Stop all people from planting trees',
        ],
        answer: 'Create laws to stop harmful waste disposal',
        // ⚠️ FIXED 2026-09-25 — "tsis txhob" is the app's negative (see animals-tiger); "khoom puas" read as "broken things".
        // Was: because: 'Paragraph 3 — “Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom txhob pov tseg cov khoom puas ib puag ncig.”',
        because: 'Paragraph 3 — “Tsoom fwv kuj yuav tsum muab kev cai lij choj los tswj cov koom haum lag luam kom tsis txhob pov tseg cov khoom uas ua rau ib puag ncig puas tsuaj.”',
      },
      {
        id: 'q-puag-ncig-6',
        prompt: 'Kev hloov pib los ntawm leej twg? — Who does change begin with?',
        options: [
          'Each individual person',
          'Only large companies',
          'Only future generations',
          'Only people in government',
        ],
        answer: 'Each individual person',
        because: 'Paragraph 4 — “Kev hloov pib los ntawm txhua tus neeg ib leeg ib leeg.”',
      },
      {
        id: 'q-puag-ncig-7',
        prompt: 'Ib txoj kev pab tiv thaiv ib puag ncig yog dab tsi? — What is one way to help protect the environment?',
        options: [
          'Plant more trees',
          'Produce more waste',
          'Pollute rivers',
          'Use more harmful chemicals',
        ],
        answer: 'Plant more trees',
        because: 'Paragraph 4 — “Cog ntoo ntxiv.”',
      },
      {
        id: 'q-puag-ncig-8',
        prompt: 'Kev hwm thiab tu ib puag ncig yog ib feem ntawm dab tsi? — Respecting and caring for the environment is part of what?',
        options: [
          'Hmong cultural heritage',
          'A business law',
          'A type of storm',
          'A farming machine',
        ],
        answer: 'Hmong cultural heritage',
        because: 'Paragraph 5 — “Kev hwm thiab tu ib puag ncig yog ib feem ntawm peb li kab lis kev cai.”',
      },


      // ⚠️ PASTED INSIDE THE WRONG ARRAY — commented out 2026-09-24. This is a
      // second copy of story-kev-hloov-pauv-lub-xeev-siab sitting inside THIS
      // story's `questions`, so the quiz rendered it as a question with no prompt
      // and no options. The real copy is the next story down and is identical
      // except `level`: this one said 'intermediate', the live one says
      // 'advanced'. RESTORE nothing — change the live copy's level if needed.
//       // Story different
// 
//          {
//         id: 'story-kev-hloov-pauv-lub-xeev-siab',
//         title: 'Kev Hloov Pauv Ntawm Tib Neeg Lub Xeev Siab Thiab Kev Cuam Tshuam Rau Kev Tsim Kho Lub Zej Zog',
//         english: 'Changes in Human Psychological States and Their Impact on Community Development',
//         genre: 'society',
//         level: 'intermediate',
//         minutes: 7,
//         blurb: 'Human thought and behavior arise from both inborn traits and life experience, raising major questions about individual choice and community responsibility.',
// 
//         paragraphs: [
//           [
//             {
//               hmong: 'Tib neeg lub xeev siab yog ib yam uas nyuaj kawg nkaus rau cov kws tshawb fawb los nkag siab kom tiav, vim nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.',
//               english: 'Human psychological state is something that is extremely difficult for researchers to fully understand, because it has many layers and levels that are deeply interconnected.',
//             },
//             {
//               hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.',
//               english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.',
//             },
//           ],
//           [
//             {
//               hmong: 'Nws yog qhov tshwm sim los ntawm kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.',
//               english: 'They are the result of a combination of what a person is born with and what that person encounters and learns during life.',
//             },
//             {
//               hmong: 'Qhov no tau ua rau cov kws txawj ntse sib cav hnyav tias puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.',
//               english: 'This has led intellectuals to debate intensely whether a person’s thoughts and behavior are things they can choose, or whether they are determined by things beyond their ability to control.',
//             },
//           ],
//           [
//             {
//               hmong: 'Qhov uas ua rau qhov no tseem ceeb tshaj yog thaum peb los xam txog seb kev hloov pauv lub xeev siab cuam tshuam li cas rau kev tsim kho lub zej zog.',
//               english: 'What makes this especially important is considering how changes in psychological state affect the development of communities.',
//             },
//             {
//               hmong: 'Yog tias tib neeg txoj kev coj ua tuaj yeem hloov tau los ntawm kev kawm thiab kev sib cuam tshuam nrog ib puag ncig, ces lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.',
//               english: 'If human behavior can be changed through learning and interaction with the environment, then the community has a great responsibility to create an environment that nurtures positive thinking and beneficial behavior.',
//             },
//           ],
//           [
//             {
//               hmong: 'Tiamsis, yog tias feem ntau ntawm tib neeg txoj kev coj ua yog raug txiav txim los ntawm yam nws yug los nrog, ces cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab los ntawm lawv tus kheej lub xeev siab.',
//               english: 'However, if most human behavior is determined by what a person is born with, then community leaders must reconsider their approach to helping people who suffer difficulties because of their own psychological state.',
//             },
//             {
//               hmong: 'Txoj lus nug no tseem nyob qhib rau kev tshawb fawb ntxiv, tiamsis nws twb tau hloov pauv lawm txoj kev uas peb saib thiab nkag siab txog tib neeg lub neej thiab lub zej zog ib nkag.',
//               english: 'This question remains open for further research, but it has already changed the way we view and understand human life and society as a whole.',
//             },
//           ],
//         ],
// 
//         glossary: [
//           {
//             hmong: 'lub xeev siab',
//             english: 'psychological state; mental condition; emotional disposition',
//           },
//           {
//             hmong: 'kev hloov pauv',
//             english: 'change; transformation; shift from one condition to another',
//           },
//           {
//             hmong: 'kev cuam tshuam',
//             english: 'impact; influence; interaction; effect on something else',
//           },
//           {
//             hmong: 'kev tsim kho',
//             english: 'development; building; improvement',
//           },
//           {
//             hmong: 'zej zog',
//             english: 'community; society; local collective',
//           },
//           {
//             hmong: 'txheej ntau theem',
//             english: 'many layers; multiple levels; complex parts',
//           },
//           {
//             hmong: 'sib cuam tshuam',
//             english: 'to interact; to be interconnected; to affect one another',
//           },
//           {
//             hmong: 'kws tshawb fawb',
//             english: 'researcher; scientist',
//           },
//           {
//             hmong: 'lub hlwb',
//             english: 'brain; mind',
//           },
//           {
//             hmong: 'txoj kev xav',
//             english: 'thought; way of thinking; beliefs',
//           },
//           {
//             hmong: 'kev coj cwj pwm',
//             english: 'behavior; manner of acting; conduct',
//           },
//           {
//             hmong: 'kev tawm tswv yim',
//             english: 'independent reasoning; forming and expressing one’s views or opinions',
//           },
//           {
//             hmong: 'kev sib xyaw',
//             english: 'combination; mixture; blending together',
//           },
//           {
//             hmong: 'yam uas yug los nrog',
//             english: 'what one is born with; inborn traits; nature',
//           },
//           {
//             hmong: 'kws txawj ntse',
//             english: 'intellectuals; learned or knowledgeable people',
//           },
//           {
//             hmong: 'sib cav hnyav',
//             english: 'to debate intensely; to argue seriously',
//           },
//           {
//             hmong: 'txiav txim',
//             english: 'to determine; decide; judge; establish an outcome',
//           },
//           {
//             hmong: 'muaj peev xwm',
//             english: 'to have the ability; to be capable; to have power to do something',
//           },
//           {
//             hmong: 'ib puag ncig',
//             english: 'environment; surroundings; conditions around a person',
//           },
//           {
//             hmong: 'txhawb nqa',
//             english: 'to nurture; support; encourage; uplift',
//           },
//           {
//             hmong: 'muaj txiaj ntsig',
//             english: 'beneficial; valuable; useful; worthwhile',
//           },
//           {
//             hmong: 'thawj coj',
//             english: 'leader; person in charge',
//           },
//           {
//             hmong: 'rov xav dua',
//             english: 'to reconsider; to think again; to reassess',
//           },
//           {
//             hmong: 'txoj hau kev',
//             english: 'approach; method; path; way of doing something',
//           },
//           {
//             hmong: 'raug kev nyuaj siab',
//             english: 'to experience hardship, distress, or difficulty',
//           },
//           {
//             hmong: 'tseem nyob qhib',
//             english: 'still open; not yet settled or answered',
//           },
//           {
//             hmong: 'ib nkag',
//             english: 'as a whole; in its entirety',
//           },
//         ],
// 
//         questions: [
//           {
//             id: 'q-xeev-siab-1',
//             prompt: 'Vim li cas tib neeg lub xeev siab thiaj nyuaj rau cov kws tshawb fawb nkag siab? — Why is human psychological state difficult for researchers to understand?',
//             options: [
//               'It has many deeply interconnected layers and levels',
//               'It comes from only one simple source',
//               'It never changes during life',
//               'It only concerns physical strength',
//             ],
//             answer: 'It has many deeply interconnected layers and levels',
//             because: 'Paragraph 1 — “Nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.”',
//           },
//           {
//             id: 'q-xeev-siab-2',
//             prompt: 'Cov kws tshawb fawb tau pib tshawb txog lub hlwb tib neeg thaum twg? — When did researchers begin studying the human brain?',
//             options: [
//               'In the 19th century',
//               'In the 15th century',
//               'In the 21st century',
//               'Only after the year 2000',
//             ],
//             answer: 'In the 19th century',
//             because: 'Paragraph 1 — “Cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19.”',
//           },
//           {
//             id: 'q-xeev-siab-3',
//             prompt: 'Tib neeg txoj kev xav thiab kev coj cwj pwm yog los ntawm dab tsi? — What do human thought and behavior result from?',
//             options: [
//               'A combination of inborn traits and life experiences',
//               'Only what a person is born with',
//               'Only one person’s opinions',
//               'Only the place where someone lives',
//             ],
//             answer: 'A combination of inborn traits and life experiences',
//             because: 'Paragraph 2 — “Kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.”',
//           },
//           {
//             id: 'q-xeev-siab-4',
//             prompt: 'Cov kws txawj ntse sib cav txog dab tsi? — What do intellectuals debate about?',
//             options: [
//               'Whether people choose their behavior or whether it is determined beyond their control',
//               'Whether hospitals should be built in forests',
//               'Whether people should stop learning',
//               'Whether communities should have leaders',
//             ],
//             answer: 'Whether people choose their behavior or whether it is determined beyond their control',
//             because: 'Paragraph 2 — “Puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.”',
//           },
//           {
//             id: 'q-xeev-siab-5',
//             prompt: 'Yog tib neeg txoj kev coj ua hloov tau los ntawm kev kawm, lub zej zog muaj lub luag haujlwm dab tsi? — If behavior can change through learning, what responsibility does the community have?',
//             options: [
//               'To create an environment that supports positive thinking and beneficial behavior',
//               'To stop people from learning',
//               'To ignore people who need help',
//               'To decide every person’s thoughts for them',
//             ],
//             answer: 'To create an environment that supports positive thinking and beneficial behavior',
//             because: 'Paragraph 3 — “Lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.”',
//           },
//           {
//             id: 'q-xeev-siab-6',
//             prompt: 'Yog kev coj cwj pwm feem ntau raug txiav txim los ntawm yam yug los nrog, cov thawj coj yuav tsum ua dab tsi? — If behavior is mostly determined by inborn traits, what should community leaders do?',
//             options: [
//               'Reconsider their approach to helping people who are struggling',
//               'Stop supporting the community',
//               'Prevent people from receiving help',
//               'Ignore psychological difficulties',
//             ],
//             answer: 'Reconsider their approach to helping people who are struggling',
//             because: 'Paragraph 4 — “Cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab.”',
//           },
//           {
//             id: 'q-xeev-siab-7',
//             prompt: 'Txoj lus nug txog kev xaiv thiab yam yug los nrog puas tau muaj lus teb kawg lawm? — Has the question about choice and inborn traits been fully answered?',
//             options: [
//               'No, it remains open for further research',
//               'Yes, it was fully answered in the 19th century',
//               'Yes, only community leaders can answer it',
//               'No, because human behavior does not exist',
//             ],
//             answer: 'No, it remains open for further research',
//             because: 'Paragraph 4 — “Txoj lus nug no tseem nyob qhib rau kev tshawb fawb ntxiv.”',
//           },
//         ],
//       },
    ],
  },


  // New story 2

  {
  id: 'story-kev-hloov-pauv-lub-xeev-siab',
  title: 'Kev Hloov Pauv Ntawm Tib Neeg Lub Xeev Siab Thiab Kev Cuam Tshuam Rau Kev Tsim Kho Lub Zej Zog',
  english: 'Changes in Human Psychological States and Their Impact on Community Development',
  genre: 'society',
  level: 'advanced',
  minutes: 7,
  blurb: 'Human thought and behavior arise from both inborn traits and life experience, raising major questions about individual choice and community responsibility.',

  paragraphs: [
    [
      {
        hmong: 'Tib neeg lub xeev siab yog ib yam uas nyuaj kawg nkaus rau cov kws tshawb fawb los nkag siab kom tiav, vim nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.',
        english: 'Human psychological state is something that is extremely difficult for researchers to fully understand, because it has many layers and levels that are deeply interconnected.',
      },
      {
        hmong: 'Txij li thaum cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19, lawv tau pom tias tib neeg txoj kev xav, kev coj cwj pwm, thiab kev tawm tswv yim tsis yog los ntawm ib qho xwb.',
        english: 'Ever since researchers began studying the human brain in the 19th century, they have observed that human thought, behavior, and independent reasoning do not come from only one source.',
      },
    ],
    [
      {
        hmong: 'Nws yog qhov tshwm sim los ntawm kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.',
        english: 'They are the result of a combination of what a person is born with and what that person encounters and learns during life.',
      },
      {
        hmong: 'Qhov no tau ua rau cov kws txawj ntse sib cav hnyav tias puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.',
        english: 'This has led intellectuals to debate intensely whether a person’s thoughts and behavior are things they can choose, or whether they are determined by things beyond their ability to control.',
      },
    ],
    [
      {
        hmong: 'Qhov uas ua rau qhov no tseem ceeb tshaj yog thaum peb los xam txog seb kev hloov pauv lub xeev siab cuam tshuam li cas rau kev tsim kho lub zej zog.',
        english: 'What makes this especially important is considering how changes in psychological state affect the development of communities.',
      },
      {
        hmong: 'Yog tias tib neeg txoj kev coj ua tuaj yeem hloov tau los ntawm kev kawm thiab kev sib cuam tshuam nrog ib puag ncig, ces lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.',
        english: 'If human behavior can be changed through learning and interaction with the environment, then the community has a great responsibility to create an environment that nurtures positive thinking and beneficial behavior.',
      },
    ],
    [
      {
        hmong: 'Tiamsis, yog tias feem ntau ntawm tib neeg txoj kev coj ua yog raug txiav txim los ntawm yam nws yug los nrog, ces cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab los ntawm lawv tus kheej lub xeev siab.',
        english: 'However, if most human behavior is determined by what a person is born with, then community leaders must reconsider their approach to helping people who suffer difficulties because of their own psychological state.',
      },
      {
        // ⚠️ FIXED 2026-09-25 — "lawm" is clause-final; it sat before the object.
        // Was: hmong: 'Txoj lus nug no tseem nyob qhib rau kev tshawb fawb ntxiv, tiamsis nws twb tau hloov pauv lawm txoj kev uas peb saib thiab nkag siab txog tib neeg lub neej thiab lub zej zog ib nkag.',
        hmong: 'Txoj lus nug no tseem nyob qhib rau kev tshawb fawb ntxiv, tiamsis nws twb tau hloov pauv txoj kev uas peb saib thiab nkag siab txog tib neeg lub neej thiab lub zej zog ib nkag lawm.',
        english: 'This question remains open for further research, but it has already changed the way we view and understand human life and society as a whole.',
      },
    ],
  ],

  glossary: [
    {
      hmong: 'lub xeev siab',
      english: 'psychological state; mental condition; emotional disposition',
    },
    {
      hmong: 'kev hloov pauv',
      english: 'change; transformation; shift from one condition to another',
    },
    {
      hmong: 'kev cuam tshuam',
      english: 'impact; influence; interaction; effect on something else',
    },
    {
      hmong: 'kev tsim kho',
      english: 'development; building; improvement',
    },
    {
      hmong: 'zej zog',
      english: 'community; society; local collective',
    },
    {
      hmong: 'txheej ntau theem',
      english: 'many layers; multiple levels; complex parts',
    },
    {
      hmong: 'sib cuam tshuam',
      english: 'to interact; to be interconnected; to affect one another',
    },
    {
      hmong: 'kws tshawb fawb',
      english: 'researcher; scientist',
    },
    {
      hmong: 'lub hlwb',
      english: 'brain; mind',
    },
    {
      hmong: 'txoj kev xav',
      english: 'thought; way of thinking; beliefs',
    },
    {
      hmong: 'kev coj cwj pwm',
      english: 'behavior; manner of acting; conduct',
    },
    {
      hmong: 'kev tawm tswv yim',
      english: 'independent reasoning; forming and expressing one’s views or opinions',
    },
    {
      hmong: 'kev sib xyaw',
      english: 'combination; mixture; blending together',
    },
    {
      hmong: 'yam uas yug los nrog',
      english: 'what one is born with; inborn traits; nature',
    },
    {
      hmong: 'kws txawj ntse',
      english: 'intellectuals; learned or knowledgeable people',
    },
    {
      hmong: 'sib cav hnyav',
      english: 'to debate intensely; to argue seriously',
    },
    {
      hmong: 'txiav txim',
      english: 'to determine; decide; judge; establish an outcome',
    },
    {
      hmong: 'muaj peev xwm',
      english: 'to have the ability; to be capable; to have power to do something',
    },
    {
      hmong: 'ib puag ncig',
      english: 'environment; surroundings; conditions around a person',
    },
    {
      hmong: 'txhawb nqa',
      english: 'to nurture; support; encourage; uplift',
    },
    {
      hmong: 'muaj txiaj ntsig',
      english: 'beneficial; valuable; useful; worthwhile',
    },
    {
      hmong: 'thawj coj',
      english: 'leader; person in charge',
    },
    {
      hmong: 'rov xav dua',
      english: 'to reconsider; to think again; to reassess',
    },
    {
      hmong: 'txoj hau kev',
      english: 'approach; method; path; way of doing something',
    },
    {
      hmong: 'raug kev nyuaj siab',
      english: 'to experience hardship, distress, or difficulty',
    },
    {
      hmong: 'tseem nyob qhib',
      english: 'still open; not yet settled or answered',
    },
    {
      hmong: 'ib nkag',
      english: 'as a whole; in its entirety',
    },
  ],

  questions: [
    {
      id: 'q-xeev-siab-1',
      prompt: 'Vim li cas tib neeg lub xeev siab thiaj nyuaj rau cov kws tshawb fawb nkag siab? — Why is human psychological state difficult for researchers to understand?',
      options: [
        'It has many deeply interconnected layers and levels',
        'It comes from only one simple source',
        'It never changes during life',
        'It only concerns physical strength',
      ],
      answer: 'It has many deeply interconnected layers and levels',
      because: 'Paragraph 1 — “Nws muaj ntau txheej ntau theem uas sib cuam tshuam loj heev.”',
    },
    {
      id: 'q-xeev-siab-2',
      prompt: 'Cov kws tshawb fawb tau pib tshawb txog lub hlwb tib neeg thaum twg? — When did researchers begin studying the human brain?',
      options: [
        'In the 19th century',
        'In the 15th century',
        'In the 21st century',
        'Only after the year 2000',
      ],
      answer: 'In the 19th century',
      because: 'Paragraph 1 — “Cov kws tshawb fawb pib tshawb txog lub hlwb tib neeg nyob rau xyoo pua 19.”',
    },
    {
      id: 'q-xeev-siab-3',
      prompt: 'Tib neeg txoj kev xav thiab kev coj cwj pwm yog los ntawm dab tsi? — What do human thought and behavior result from?',
      options: [
        'A combination of inborn traits and life experiences',
        'Only what a person is born with',
        'Only one person’s opinions',
        'Only the place where someone lives',
      ],
      answer: 'A combination of inborn traits and life experiences',
      because: 'Paragraph 2 — “Kev sib xyaw ntawm yam uas yug los nrog thiab yam uas ib tus neeg tau ntsib thiab kawm los hauv nws lub neej.”',
    },
    {
      id: 'q-xeev-siab-4',
      prompt: 'Cov kws txawj ntse sib cav txog dab tsi? — What do intellectuals debate about?',
      options: [
        'Whether people choose their behavior or whether it is determined beyond their control',
        'Whether hospitals should be built in forests',
        'Whether people should stop learning',
        'Whether communities should have leaders',
      ],
      answer: 'Whether people choose their behavior or whether it is determined beyond their control',
      because: 'Paragraph 2 — “Puas yog ib tus neeg txoj kev xav thiab nws txoj kev coj ua yog yam uas nws xaiv tau, lossis puas yog nws raug txiav txim los ntawm yam uas nws tsis muaj peev xwm tswj tau.”',
    },
    {
      id: 'q-xeev-siab-5',
      prompt: 'Yog tib neeg txoj kev coj ua hloov tau los ntawm kev kawm, lub zej zog muaj lub luag haujlwm dab tsi? — If behavior can change through learning, what responsibility does the community have?',
      options: [
        'To create an environment that supports positive thinking and beneficial behavior',
        'To stop people from learning',
        'To ignore people who need help',
        'To decide every person’s thoughts for them',
      ],
      answer: 'To create an environment that supports positive thinking and beneficial behavior',
      because: 'Paragraph 3 — “Lub zej zog muaj lub luag haujlwm loj heev los tsim ib lub ib puag ncig uas txhawb nqa txoj kev xav zoo thiab kev coj cwj pwm muaj txiaj ntsig.”',
    },
    {
      id: 'q-xeev-siab-6',
      prompt: 'Yog kev coj cwj pwm feem ntau raug txiav txim los ntawm yam yug los nrog, cov thawj coj yuav tsum ua dab tsi? — If behavior is mostly determined by inborn traits, what should community leaders do?',
      options: [
        'Reconsider their approach to helping people who are struggling',
        'Stop supporting the community',
        'Prevent people from receiving help',
        'Ignore psychological difficulties',
      ],
      answer: 'Reconsider their approach to helping people who are struggling',
      because: 'Paragraph 4 — “Cov thawj coj hauv zej zog yuav tsum rov xav dua txog lawv txoj hau kev los pab cov neeg uas raug kev nyuaj siab.”',
    },
    {
      id: 'q-xeev-siab-7',
      prompt: 'Txoj lus nug txog kev xaiv thiab yam yug los nrog puas tau muaj lus teb kawg lawm? — Has the question about choice and inborn traits been fully answered?',
      options: [
        'No, it remains open for further research',
        'Yes, it was fully answered in the 19th century',
        'Yes, only community leaders can answer it',
        'No, because human behavior does not exist',
      ],
      answer: 'No, it remains open for further research',
      because: 'Paragraph 4 — “Txoj lus nug no tseem nyob qhib rau kev tshawb fawb ntxiv.”',
    },
  ],
},


  









  


]



/**
 * The story to go BACK to from a dictionary word page, or null — 2026-09-26.
 *
 * The reader's "Open in dictionary" (word sheet and glossary rows) adds
 * `?fromStory=<storyId>`. The word page then offers "Back to the story" and a
 * Reading › <Story> trail, instead of sending the learner up to the word's set.
 *
 * ⚠️ HONOURED ONLY IF THE WORD IS REALLY IN THAT STORY — the same "relevant
 * source" guard as groupReturn (vocabulary.js) and pathReturnUnit (the lesson
 * screen). A stale or hand-typed ?fromStory= can never offer a way "back" to a
 * story the word isn't in. "In the story" = in its text or glossary, compared
 * with spaces removed so `tiamsis` still matches the story's "tiam sis".
 * Opened any other way (search, a deck) → null → the normal set trail.
 */
export function storyReturn(fromStory, hmong) {
  if (!fromStory || !hmong) return null
  const story = stories.find((s) => s.id === String(fromStory))
  if (!story) return null
  // Whole words only: the word must equal one token of a line, or a run of
  // consecutive tokens joined (so `tiamsis` matches "tiam sis", and a long
  // headword like "lub tsev ntsia yeeb yam" matches word by word).
  const squash = (t) => String(t).toLowerCase().replace(/[^\p{L}]+/gu, '')
  const needle = squash(hmong)
  if (!needle) return null
  const lines = [
    ...(story.paragraphs || []).flat().map((l) => l.hmong),
    ...(story.glossary || []).map((g) => g.hmong),
  ]
  const found = lines.some((line) => {
    const t = String(line).toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)
    for (let i = 0; i < t.length; i++) {
      let run = ''
      for (let k = i; k < t.length && run.length < needle.length; k++) { run += t[k]; if (run === needle) return true }
    }
    return false
  })
  return found ? story : null
}
