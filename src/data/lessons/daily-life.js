// Daily Life — for path unit u-daily.
//
// ⚠️ FILLED OUT 2026-10-22 (author: "daily life not full of the data"). It had
// been a four-phrase stub since the /course migration, with its own header
// admitting "Intentionally minimal; refine later" — while `u-daily` resolves to
// SEVENTEEN cards across two categories. The whole `chores` half (12 verbs, every
// one carrying a reviewed example sentence) was never mentioned by the lesson
// that is supposed to introduce it.
//
// ⚠️ NO NEW HMONG. Every Hmong word, phrase and sentence below is already in
// vocabulary.js in the `daily-life` or `chores` category, with the English taken
// from that entry's own gloss or exampleSentence. Nothing was composed here.
//
// ⚠️ THE IDS ARE PROGRESS KEYS and are unchanged: `conversational-daily-life`,
// `-intro`, `-examples`. The two steps added (`-chores`, `-quiz`) are new ids.
//
// ⚠️ `vocab: 'daily-life'` ADDED. The lesson had no `vocab` field at all, which
// meant no study handoff and no working quiz step — QuizStep resolves
// `vocab-${lesson.vocab}` and shows "This lesson doesn't have a word set yet"
// without it. It points at `daily-life` (5 cards) rather than `chores` (12)
// because that is the set the lesson is named for; the chores set is drilled by
// the unit itself.
export const dailyLife = {
  id: 'conversational-daily-life',
  title: 'Daily Life',
  summary: 'How you feel, what you are doing, and the chores that fill a day.',
  vocab: 'daily-life',
  reference: 'grammar',
  steps: [
    {
      id: 'conversational-daily-life-intro',
      kind: 'intro',
      title: 'Everyday phrases',
      body: [
        '## 1. Saying how you feel',

        'The everyday states — hungry, thirsty, tired — are not built with an adjective and a "to be" word. Each one is its own phrase, and it already contains the verb.',

        '> Kuv tshaib plab. — I am hungry.',

        '> Kuv nqhis dej. — I am thirsty.',

        '> Kuv tsaug zog. — I am tired, sleepy.',

        'Notice that nothing in the Hmong corresponds to the English “am”. **"Tshaib plab"** is itself what the sentence says about **"kuv"**, so learn each phrase whole rather than looking for the word that means “am”.',

        '## 2. **"Koj noj mov tau?"** is a greeting',

        // The author's own sentence, kept word for word — this is the line they
        // wrote for this lesson, and it is what settles the phrase's social use
        // (see the TODO-VERIFY in food-lesson.js, which asks the same question).
        '**"Koj noj mov tau?"** (Have you eaten?) is a common Hmong greeting — asking whether someone has eaten is a way of showing you care.',

        'So the answer matters less than the asking. It can open a conversation in the same place where English would ask how someone is doing, and a reply about food is not always expected.',

        '## 3. Chores: the verb comes first',

        'Most of what fills a day is a verb and the thing it is done to. The order is the ordinary one — who, then the action, then what the action is done to.',

        '> Kuv so lub rooj. — I wipe the table.',

        '> Kuv yaug tais diav. — I rinse the dishes.',

        '> Kuv txhuam lub dab da dej. — I scrub the bathtub.',

        'Learn the verb with a thing attached. **"So"** on its own is “to wipe”, but what you will actually say is **"so lub rooj"**.',

        '## 4. Some chores are already a verb plus a noun',

        'Several of these are two words that work as one expression, so the noun is part of the chore rather than something you choose:',

        '> ua mov — to cook (literally “do food”)',

        '> zov menyuam — to babysit (“watch children”)',

        '> them nuj nqis — to pay bills',

        '> ntsaig tais diav — to clear the table',

        '> cheb plua plav — to dust (“sweep dust”)',

        'Compare **"cheb"** (to sweep) with **"cheb plua plav"** (to dust): the same verb, and the noun after it decides which chore you mean.',

        '## 5. Saying when and how often',

        'The time expression goes at the end of these sentences, not the beginning:',

        '> Kuv cheb hauv tsev txhua hnub. — I sweep the house every day.',

        '> Kuv them nuj nqis txhua hli. — I pay the bills every month.',

        '> Kuv kaus daus thaum sawv ntxov. — I shovel snow in the morning.',

        '> Kuv zov menyuam hmo no. — I babysit tonight.',

        '> Kuv ntsaig tais diav tom qab noj mov. — I clear the table after eating.',

        '**"Txhua hnub"** is every day and **"txhua hli"** is every month. **"Thaum"** introduces a time, and **"tom qab"** introduces what something happens after.',

        '## 6. One more everyday verb',

        '> Kuv tua lub teeb ua ntej pw. — I turn off the light before sleeping.',

        '**"Tua"** is to turn off, put out, or extinguish — a light, a fire, an engine. **"Ua ntej"** means before.',

        '## An easy way to remember',

        '> how you feel → **"kuv"** + the state phrase (Kuv tshaib plab.)',

        '> a chore → who + verb + the thing (Kuv so lub rooj.)',

        '> when or how often → at the END (… txhua hnub.)',
      ],
    },
    {
      id: 'conversational-daily-life-examples',
      kind: 'examples',
      title: 'Daily phrases',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Koj noj mov tau?', english: 'Have you eaten?', note: 'A greeting as much as a question — a way of showing you care.' },
        { hmong: 'Kuv tshaib plab', english: "I'm hungry", note: 'The phrase contains its own verb; there is no separate word for “am”.' },
        { hmong: 'Kuv nqhis dej', english: "I'm thirsty", note: 'Literally about water — **"dej"** is part of the expression.' },
        { hmong: 'Kuv tsaug zog', english: "I'm tired / sleepy", note: 'Used for sleepiness rather than for being worn out by work.' },
        { hmong: 'Kuv tua lub teeb ua ntej pw.', english: 'I turn off the light before sleeping.', note: '**"Tua"** — to turn off, put out, extinguish. **"Ua ntej"** — before.' },
      ],
    },
    {
      // New step, 2026-10-22 — the twelve chore verbs the lesson had never shown.
      // Each sentence is the card's own reviewed exampleSentence.
      id: 'conversational-daily-life-chores',
      kind: 'examples',
      title: 'Chores around the house',
      intro:
        'Each verb is shown with the thing it is usually done to. That pairing is the useful unit — the verb alone is rarely what you say.',
      items: [
        { hmong: 'Kuv cheb hauv tsev txhua hnub.', english: 'I sweep the house every day.', note: '**"Cheb"** — to sweep.' },
        { hmong: 'Kuv cheb plua plav txhua hnub.', english: 'I dust every day.', note: '**"Cheb plua plav"** — to dust, literally to sweep dust.' },
        { hmong: 'Kuv so lub rooj.', english: 'I wipe the table.', note: '**"So"** — to wipe.' },
        { hmong: 'Kuv txhuam lub dab da dej.', english: 'I scrub the bathtub.', note: '**"Txhuam"** — to scrub.' },
        { hmong: 'Kuv yaug tais diav.', english: 'I rinse the dishes.', note: '**"Yaug"** — to rinse. **"Tais diav"** is the dishes, bowls and spoons named together.' },
        { hmong: 'Kuv ntsaig tais diav tom qab noj mov.', english: 'I clear the table after eating.', note: '**"Ntsaig tais diav"** — to clear the table.' },
        { hmong: 'Kuv ua mov rau tsev neeg.', english: 'I cook food for the family.', note: '**"Ua mov"** — to cook.' },
        { hmong: 'Kuv txuag tshuaj rau nroj.', english: 'I spray chemicals on the weeds.', note: '**"Txuag"** — to spray.' },
        { hmong: 'Kuv zov menyuam hmo no.', english: 'I babysit tonight.', note: '**"Zov menyuam"** — to babysit, literally to watch children.' },
        { hmong: 'Kuv them nuj nqis txhua hli.', english: 'I pay the bills every month.', note: '**"Them nuj nqis"** — to pay bills. **"Txhua hli"** — every month.' },
        { hmong: 'Kuv kaus daus thaum sawv ntxov.', english: 'I shovel snow in the morning.', note: '**"Kaus daus"** — to shovel snow.' },
        { hmong: 'Kuv kaus nplooj tom vaj.', english: 'I rake leaves in the yard.', note: '**"Kaus nplooj"** — to rake leaves. **"Tom vaj"** — in the yard.' },
      ],
    },
    {
      id: 'conversational-daily-life-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
