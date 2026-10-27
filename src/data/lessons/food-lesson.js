
// Standalone lesson: food and drink — for path unit u-food (Food & Drinks).
//
// Upgrade: clearer explanations, more context, and better examples.
// Existing lesson and step IDs are preserved.
// Existing audio paths are preserved.
//
// The lesson distinguishes cooked rice from the broader use of "mov",
// explains "noj" vs "haus", and treats the greeting phrase cautiously.
//
// TODO-VERIFY before removing placeholder: true:
// - Register and social context of "Koj noj mov tau?"
// - Preferred general word for food in the target community.
// - Whether "qhaub cij" should be glossed as sandwich in this vocabulary set.

export const foodLesson = {
  id: 'conversational-food',
  title: 'Food & Drink | Zaub Mov',
  summary: 'Learn **"mov"** (rice and, in context, food), **"noj"** (eat), and **"haus"** (drink), with everyday meal phrases.',
  vocab: 'food',
  placeholder: true,
  steps: [
    {
      id: 'conversational-food-intro',
      kind: 'intro',
      title: 'Eating and drinking',
      body: [
        // ── ⚠️ REORGANISED 2026-10-22 ─────────────────────────────────────────
        //
        // Author: *"fix food lesson"*, right after the same pass on the family
        // lesson. Every sentence is theirs; what changed is order and repetition.
        //
        // WHAT WAS DISORGANISED:
        //
        // 1. "mov CAN MEAN FOOD" WAS TAUGHT FOUR TIMES — §1 in prose, §2 as a
        //    bullet, §4 in the word list, and again in the recap. Sections 1 and 2
        //    were the same subject split in half, so they are now one section with
        //    the comparison as example lines. The word list and the recap keep
        //    their mentions: a list and a recap are meant to restate.
        //
        // 2. SECTION 6 RE-PRINTED FOUR SENTENCES VERBATIM from §1, §3 and §5
        //    (`Koj noj mov tau?`, `Kuv nyiam noj nqaij.`, `Kuv haus dej txhua
        //    hnub.`, `Peb noj pluas hmo ua ke.`). Only `Kuv noj qhaub cij thaum
        //    sawv ntxov.` was new there. The section keeps its real content — the
        //    advice to read the verb first — plus the one new sentence, and points
        //    back at the examples instead of copying them.
        //
        // 3. TWO FORMATS FOR ONE KIND OF CONTENT. §2 and the recap glossed words
        //    with '- ' bullets while §4 and §5 used '> ' example lines. IntroQBody
        //    renders a '- ' line as a paragraph with a literal dash, so identical
        //    pairs looked like two different things. All are '> ' lines now.
        //
        // 4. §3's "simple way to remember" bullets (`- Eating food: noj`) restated
        //    the two sentences directly above them, word for word. Dropped; the
        //    sentences say it.
        //
        // Was: 1 one word more than one meaning · 2 mov and zaub mov · 3 noj/haus ·
        // 4 useful food words · 5 meals · 6 real situations · 7 a place that sells
        // food · Quick recap.
        //
        // ⚠️ NO NEW HMONG and no gloss reworded. The bold-and-quote style was
        // already in place here, so it is left as the author wrote it.
        '## 1. **"Mov"** and **"zaub mov"**',

        'The word **"mov"** usually means cooked rice. But in Hmong, it can also refer more broadly to food or a meal, depending on the phrase and situation.',

        'The phrase **"zaub mov"** means food in general, or food as something prepared and served. You will often see it when people are talking about food as a category rather than one particular ingredient.',

        '> mov — cooked rice; food in context',

        '> zaub mov — food more generally',

        'Do not assume that every use of **"mov"** means exactly the same thing. The surrounding words tell you whether the sentence is about rice, eating a meal, or food in general.',

        'This matters because a sentence containing **"mov"** is not always just about rice:',

        '> Koj noj mov tau? — Have you eaten?',

        // Was prefixed "This phrase is included in the app's reviewed examples" —
        // provenance, not teaching (2026-10-22).
        'In context, it can ask whether someone has eaten, rather than asking specifically whether they ate rice. Its exact social use can vary, so learn it as a conversational expression instead of assuming it is the only way to ask the question.',

        '## 2. **"Noj"** means eat; **"haus"** means drink',

        'Hmong uses different verbs for eating and drinking. Learn the verb together with the kind of thing it goes with.',

        '**"Noj"** means eat. It is used with food and meals.',

        '**"Haus"** means drink. It is used with drinks such as water and coffee.',

        '> Kuv noj mov. — I eat rice / I have a meal.',

        '> Kuv nyiam noj nqaij. — I like to eat meat.',

        '> Kuv haus dej txhua hnub. — I drink water every day.',

        'These verbs are not interchangeable. For example, the phrase **"haus dej"** means drink water, not eat water.',

        '## 3. Useful food words',

        'Start with these words from the food vocabulary set:',

        '> mov — cooked rice; food in context',

        '> zaub mov — food',

        '> nqaij — meat',

        '> dej — water',

        '> qhaub cij — sandwich',

        '> hmoov — flour; powder',

        // TODO-VERIFY: the `qhaub cij` entry should be checked with a speaker from
        // the target community. Was the tail of the learner-facing paragraph below,
        // naming the app (2026-10-22).
        'A small accuracy note: **"hmoov"** can mean flour or powder, so it is often an ingredient rather than a prepared dish. For bread itself, some Hmong references use **"mov ci"** or **"ncuav ci"**, and usage varies.',

        '## 4. Meals and the times of day',

        'Here are three useful meal expressions:',

        '> Pluas tshais — breakfast',

        '> Pluas su — lunch',

        '> Pluas hmo — dinner / evening meal',

        'You can use these expressions to talk about when and what you eat.',

        '> Kuv noj pluas tshais thaum sawv ntxov. — I eat breakfast in the morning.',

        '> Peb noj pluas hmo ua ke. — We eat dinner together.',

        '> Kuv noj qhaub cij thaum sawv ntxov. — I eat a sandwich in the morning.',

        'Notice the pattern **"noj"** + meal. The verb tells us that someone is eating, and the meal phrase tells us which meal.',

        'You may also encounter **"noj tshais"**, **"noj su"**, and **"noj hmo"** when people simply say eat breakfast, eat lunch, or eat dinner.',

        '## 5. How to practise these sentences',

        'Food often comes up when welcoming people, preparing a meal, or asking about what someone wants to eat — which is what the sentences above are for.',

        'When you practise, focus on the verb first. Is the person eating with **"noj"**, or drinking with **"haus"**? Then notice what food or drink follows.',

        '## 6. Talking about a place that sells food',

        'One small change in a verb can change the meaning of a sentence.',

        '> Lub khw muag zaub mov. — The store sells food.',

        'Here, **"muag"** means sell. The sentence says that the store sells food; it does not say that the store buys food.',

        '## Quick recap',

        '> **"Mov"** — usually cooked rice, but can refer more broadly to food or a meal in context.',

        '> **"Zaub mov"** — food in general.',

        '> **"Noj"** — eat.',

        '> **"Haus"** — drink.',

        '> **"Pluas tshais"**, **"pluas su"**, **"pluas hmo"** — breakfast, lunch, and dinner.',

        '> **"Muag"** — sell.',

        'The easiest way to remember the lesson is to learn short phrases, not isolated translations. The meaning of **"mov"** depends on context, but the difference between **"noj"** and **"haus"** gives you a reliable starting point.',
      ],
    },
    {
      id: 'conversational-food-examples',
      kind: 'examples',
      title: 'Food and drink',
      intro: 'Read each word aloud. Notice which words refer to food, drinks, meals, or ingredients.',
      items: [
        {
          hmong: 'Mov',
          english: 'Cooked rice; food in context',
          note: 'The meaning depends on the phrase. It can refer to a meal as well as cooked rice.'
        },
        {
          hmong: 'Zaub mov',
          english: 'Food',
          note: 'A broader expression for food.'
        },
        {
          hmong: 'Nqaij',
          english: 'Meat',
          note: 'A food word commonly used after "noj" in eating phrases.'
        },
        {
          hmong: 'Dej',
          english: 'Water',
          note: 'Use with "haus" in the phrase "haus dej" (drink water).'
        },
        {
          hmong: 'Qhaub cij',
          english: 'Sandwich',
          note: 'Some sources use "mov ci" or "ncuav ci" for bread. Confirm the preferred meaning in the target community.'
        },
        {
          hmong: 'Pluas tshais',
          english: 'Breakfast',
          note: 'A meal expression.'
        },
        {
          hmong: 'Pluas su',
          english: 'Lunch',
          note: 'A meal expression.'
        },
        {
          hmong: 'Pluas hmo',
          english: 'Dinner / evening meal',
          note: 'A meal expression.'
        },
        {
          hmong: 'Hmoov',
          english: 'Flour; powder',
          note: 'Often an ingredient rather than a prepared food.'
        }
      ],
    },
    {
      id: 'conversational-food-sentences',
      kind: 'examples',
      title: 'Eating and drinking in sentences',
      intro: 'Watch which verb each sentence uses.',
      items: [
        {
          hmong: 'Koj noj mov tau?',
          english: 'Have you eaten?',
          note: 'In context, this can ask whether someone has eaten. It does not necessarily ask whether they ate rice specifically.'
        },
        {
          hmong: 'Kuv nyiam noj nqaij.',
          english: 'I like to eat meat.',
          note: '"Noj" means eat.'
        },
        {
          hmong: 'Kuv haus dej txhua hnub.',
          english: 'I drink water every day.',
          note: '"Haus" means drink; "dej" means water.'
        },
        {
          hmong: 'Kuv noj qhaub cij thaum sawv ntxov.',
          english: 'I eat a sandwich in the morning.',
          note: '"Noj" is used for eating.'
        },
        {
          hmong: 'Peb noj pluas hmo ua ke.',
          english: 'We eat dinner together.',
          note: '"Pluas hmo" means dinner or the evening meal.'
        },
        {
          hmong: 'Lub khw muag zaub mov.',
          english: 'The store sells food.',
          note: '"Muag" means sell; "zaub mov" means food.'
        }
      ],
    },
    {
      id: 'conversational-food-quiz',
      kind: 'quiz',
      title: 'Learn the food words',
    },
  ],
};
