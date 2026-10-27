
// Standalone lesson: family — for path unit u-family (Family).
//
// Upgrade: introduces both male and female speaker perspectives.
// Existing lesson, step, and vocabulary IDs are preserved.
// A new examples step has its own ID.
//
// The original reviewed example sentences are retained.
// Additional perspective-specific terms are grounded in White Hmong
// kinship references, but should still be reviewed by a fluent speaker.
//
// TODO-VERIFY before removing placeholder: true:
// - Exact usage of sibling terms across White Hmong-speaking communities.
// - When marital status changes a woman's term for a brother.
// - Preferred classifier patterns with individual kinship terms.
// - Whether the new perspective examples match the app's target dialect.

export const familyLesson = {
  id: 'conversational-family',
  title: 'Family | Tsev Neeg',
  summary: 'Learn family relationships, sibling terms from different speaker perspectives, and how Hmong family words work.',
  vocab: 'family-male-perspective',
  placeholder: true,
  steps: [
    {
      id: 'conversational-family-intro',
      kind: 'intro',
      title: 'Understanding family in Hmong',
      body: [
        // ── ⚠️ REORGANISED 2026-10-22 ─────────────────────────────────────────
        //
        // Author: *"fix the family lesson to be more organized, structure
        // everything better."* Every sentence is theirs; what changed is order,
        // consistency and where things live.
        //
        // WHAT WAS DISORGANISED, and what each fix was:
        //
        // 1. TWO FORMATS FOR ONE KIND OF CONTENT. §2 listed family words as '> '
        //    example lines; §3 listed the sibling words as '- ' bullets, which
        //    IntroBody renders as paragraphs starting with a literal dash. The
        //    same "word — gloss" pair looked like two different things. All of
        //    them are '> ' lines now.
        //
        // 2. A MARKDOWN TABLE. §4's three-column comparison printed its own pipes
        //    — IntroBody has no table renderer. It is one '> ' line per
        //    relationship, carrying both perspectives.
        //
        // 3. THE tus / leej NOTE SAT FIVE SECTIONS AWAY FROM ITS EXAMPLES. Old §7
        //    ("Why the extra words matter") re-printed `Kuv tus kwv`, `Kuv tus
        //    muam` and `Kuv leej txiv` from §2 and §3 to explain the classifier.
        //    It is now a `###` inside §2, where those phrases are introduced, and
        //    the duplicate examples are gone.
        //
        // 4. THE OPENING CHECKLIST PROMISED FIVE THINGS AND DELIVERED FOUR. "In
        //    some relationships, whether the person is married" is never taught —
        //    it is in this file's own TODO-VERIFY ("When marital status changes a
        //    woman's term for a brother"). The checklist now says where each
        //    factor is covered and admits the fifth is not, rather than leaving a
        //    learner hunting for a section that does not exist.
        //
        // 5. EIGHT SECTIONS BECAME SEVEN, and each one now answers one question.
        //    Was: 1 big picture · 2 immediate family · 3 who is speaking ·
        //    4 compare both · 5 siblings together · 6 which side · 7 why the
        //    extra words matter · 8 an easy way to learn.
        //
        // ⚠️ NO NEW HMONG, and no gloss reworded. Hmong inside the English is
        // bolded and quoted, the house style set on 2026-10-20.
        '## 1. Start with the big picture',

        '**"Tsev neeg"** means family or household. Your **"tsev neeg"** can include your parents, children, brothers, sisters, spouse, and the people who belong to your household.',

        'Hmong also has a wider network of relatives. Family words can tell you more than simply whether somebody is a parent, sibling, or grandparent.',

        'When choosing a family word, you may need to think about:',

        '- **Your relationship to the person** — parent, sibling, spouse, grandparent, and so on. (section 2)',

        '- **Older or younger than you** — the word often changes with relative age. (section 3)',

        '- **Whether you are speaking as a man or a woman** — the same relationship can take a different word. (sections 3 and 4)',

        '- **Which side of the family** — the father’s side and the mother’s side are not always the same word. (section 6)',

        '- **Whether the person is married** — this changes the wording in some relationships. Not taught in this lesson yet — ask a fluent speaker from your own community.',

        'You do not need to memorise every family relationship at once. Start with your immediate family and learn the patterns before moving on to cousins, aunts, uncles, and in-laws.',

        '## 2. Your immediate family',

        'Here are some important starting words:',

        '> niam — mother',

        '> txiv — father',

        '> niam txiv — parents (mother and father together)',

        '> menyuam — child / children',

        '> tub — son / boy',

        '> ntxhais — daughter / girl',

        '> tus txiv — husband',

        '> tus poj niam — wife',

        '> tsev neeg — family / household',

        'Notice that **"niam txiv"** means the two parents together. It is not the same as using **"niam"** or **"txiv"** by itself.',

        'You can also describe your relationship to your parents using complete phrases:',

        '> Kuv leej txiv. — My father.',

        '> Kuv leej niam. — My mother.',

        '> Kuv niam txiv. — My parents.',

        'These are useful phrases to learn as complete expressions. Do not assume every family word must use the same extra word or classifier.',

        // Was its own section 7, "Why the extra words matter", after the
        // grandparents — five sections away from the phrases it is about.
        '### Why **"tus"** and **"leej"** appear in these phrases',

        'The examples in this lesson use **"tus"** with several sibling terms and **"leej"** in the parent phrases. These expressions are established patterns to learn, rather than a universal instruction to add a classifier to every family word.',

        'Also remember that the word for a relationship and the way you address the person are not always identical. Age, the exact family relationship, politeness, and local usage can all affect the wording.',

        '## 3. The word changes with who is speaking',

        'Hmong does not always use one word for a relationship regardless of who is talking. Sibling words are a good example.',

        'A man and a woman can be talking about their own brothers and sisters but choose different words because the relationship is viewed from the speaker’s perspective.',

        '### When a man talks about his siblings',

        '> tij laug — older brother',

        '> kwv — younger brother',

        '> muam — sister',

        'A man commonly uses **"tij laug"** for his older brother and **"kwv"** for his younger brother. **"Muam"** is the basic word for his sister.',

        'To make a sister’s relative age clear, forms such as **"muam hlob"** (older sister) and **"muam yau"** (younger sister) are also found in White Hmong references.',

        '> Kuv tus tij laug. — My older brother.',

        '> Kuv tus kwv. — My younger brother.',

        '> Kuv tus muam. — My sister.',

        '### When a woman talks about her siblings',

        '> nus — brother',

        '> niam laus — older sister',

        '> niam hluas — younger sister',

        '> viv ncaus — sisters, collectively',

        'A woman commonly uses **"nus"** for her brother. To distinguish an older from a younger sister, she may use **"niam laus"** or **"niam hluas"**.',

        '> Kuv tus nus. — My brother.',

        '> Kuv tus niam laus. — My older sister.',

        '> Kuv tus niam hluas. — My younger sister.',

        'You may also encounter **"nus hlob"** (older brother) and **"nus yau"** (younger brother) in learning materials. Some White Hmong kinship references describe different forms of address in particular circumstances, including when a brother is married. Learn the basic pattern first, and confirm the more specific forms with a fluent speaker from your own community.',

        '## 4. The two perspectives side by side',

        'The most important point is not that one set is right and the other is wrong. Both are ways of describing family relationships.',

        '> Older brother — a man says **"tij laug"**; a woman says **"nus"**, and **"nus hlob"** may specify an older brother.',

        '> Younger brother — a man says **"kwv"**; a woman says **"nus"**, and **"nus yau"** may specify a younger brother.',

        '> Sister — a man says **"muam"**. **"Nus"** does not mean sister: a woman uses a sister term such as **"niam laus"** or **"niam hluas"** when it is relevant.',

        '> Older sister — a man says **"muam"**, and **"muam hlob"** is also used; a woman says **"niam laus"**.',

        '> Younger sister — a man says **"muam"**, and **"muam yau"** is also used; a woman says **"niam hluas"**.',

        'This is a beginner’s guide, not a rule that every family uses exactly the same way. The terms used in direct address can differ from the terms used when describing someone to another person.',

        '## 5. Talking about siblings as a group',

        'Sometimes you are talking about siblings as a group instead of one brother or sister.',

        '> kwv tij — brothers, especially as a group from a male speaker’s perspective',

        '> viv ncaus — sisters',

        '> nus muag — brothers and sisters / siblings together',

        '> Peb yog kwv tij. — We are brothers.',

        '**"Kwv tij"** is not simply a word for any group of siblings. Notice the perspective and the people included when using it.',

        '## 6. Which side of the family',

        'Hmong distinguishes some relatives on the father’s side from relatives on the mother’s side. English often uses the same word for both sides, but Hmong may use different words.',

        'For grandparents, this lesson uses the following distinction:',

        '> yawg — paternal grandfather (father’s father)',

        '> pog — paternal grandmother (father’s mother)',

        '> yawm txiv — maternal grandfather (mother’s father)',

        '> niam tais — maternal grandmother (mother’s mother)',

        'Learn the words together with the side of the family. That helps you remember whom each word refers to.',

        '## 7. How to learn a family word',

        'When you learn a new family word, ask yourself three questions:',

        '- 1. Who is this person to me?',

        '- 2. Is the person older or younger than me?',

        '- 3. Does the word change depending on whether I am speaking as a man or a woman?',

        'Then learn one complete example phrase for the relationship. That is easier and safer than trying to build every family expression from a single rule.',

        'The main idea: **Hmong family words describe relationships more precisely than a simple English label sometimes can.** Start with the immediate family, pay attention to the speaker’s perspective, and add the wider family network as you learn more.',
      ],
    },
    {
      id: 'conversational-family-perspectives',
      kind: 'examples',
      title: 'Same family, different perspective',
      intro: 'Compare these common White Hmong sibling terms. Some detailed forms of address vary by community and situation.',
      items: [
        {
          hmong: 'Kuv tus tij laug.',
          english: 'My older brother.',
          note: 'Commonly used from a man’s perspective.'
        },
        {
          hmong: 'Kuv tus kwv.',
          english: 'My younger brother.',
          note: 'Commonly used from a man’s perspective.'
        },
        {
          hmong: 'Kuv tus muam.',
          english: 'My sister.',
          note: 'Muam is the basic sister term from a man’s perspective.'
        },
        {
          hmong: 'Kuv tus muam hlob.',
          english: 'My older sister.',
          note: 'A form used to specify an older sister from a man’s perspective.'
        },
        {
          hmong: 'Kuv tus muam yau.',
          english: 'My younger sister.',
          note: 'A form used to specify a younger sister from a man’s perspective.'
        },
        {
          hmong: 'Kuv tus nus.',
          english: 'My brother.',
          note: 'Commonly used from a woman’s perspective.'
        },
        {
          hmong: 'Kuv tus nus hlob.',
          english: 'My older brother.',
          note: 'Found in learning materials; specific address terms can vary by situation.'
        },
        {
          hmong: 'Kuv tus nus yau.',
          english: 'My younger brother.',
          note: 'Found in learning materials; specific address terms can vary by situation.'
        },
        {
          hmong: 'Kuv tus niam laus.',
          english: 'My older sister.',
          note: 'Commonly used from a woman’s perspective.'
        },
        {
          hmong: 'Kuv tus niam hluas.',
          english: 'My younger sister.',
          note: 'Commonly used from a woman’s perspective.'
        },
        {
          hmong: 'Viv ncaus',
          english: 'Sisters.',
          note: 'A collective term for sisters.'
        },
        {
          hmong: 'Nus muag',
          english: 'Brothers and sisters / siblings.',
          note: 'A collective term for siblings.'
        }
      ],
    },
    {
      id: 'conversational-family-examples',
      kind: 'examples',
      title: 'The family words',
      intro: 'Read each phrase and notice the family relationship it describes.',
      items: [
        { hmong: 'Kuv leej txiv.', english: 'My father.' },
        { hmong: 'Kuv leej niam.', english: 'My mother.' },
        { hmong: 'Kuv niam txiv.', english: 'My parents.', note: 'Niam txiv refers to the pair.' },
        { hmong: 'Kuv tus tij laug.', english: 'My older brother.', note: 'A man’s older brother.' },
        { hmong: 'Kuv tus kwv.', english: 'My younger brother.', note: 'A man’s younger brother.' },
        { hmong: 'Kuv tus muam.', english: 'My sister.', note: 'A man’s sister.' },
        { hmong: 'Peb yog kwv tij.', english: 'We are brothers.', note: 'Kwv tij is used for brothers from a male perspective.' },
        { hmong: 'Kuv tus poj niam.', english: 'My wife.' },
      ],
    },
    {
      id: 'conversational-family-quiz',
      kind: 'quiz',
      title: 'Learn the family words',
    },
  ],
};
