
// Standalone lesson: CLOTHES & WEARING — the verb depends on the item.
//
// Expanded to explain the five verb categories, item-based selection,
// the difference between a verb and a classifier, and context.
//
// Existing lesson and step IDs are preserved.
//
// TODO-VERIFY: A published White Hmong grammar uses "ntoo" for hats,
// while this lesson's existing reviewed phrase is "looj lub kaus mom".
// Confirm the preferred usage for this app before removing placeholder.
//
// TODO-VERIFY: Confirm whether "looj taw" is used for socks in the
// target community, and whether glasses belong under "coj" or "hnav".

export const wearing = {
  placeholder: true,
  id: 'grammar-wearing',
  title: 'Clothes & Wearing | Hnav, Rau, Looj, Coj, Sia',
  summary: 'Learn five item-specific wearing verbs, how to choose between them, and how classifiers fit into clothing phrases.',
  vocab: 'wear-verbs',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-wearing-intro',
      kind: 'intro',
      title: 'Why are there five verbs for wearing?',
      body: [
        '## Why does Hmong use different wearing verbs?',

        'English uses “wear” for shirts, pants, shoes, hats, necklaces, and belts. Hmong commonly chooses a verb according to the kind of item being worn. The English translation may be the same, but the Hmong verb changes with the item.',

        'The five verbs in this lesson are **"hnav"**, **"rau"**, **"looj"**, **"coj"**, and **"sia"**. Learn each one together with the kinds of items it is used for. These are established word pairings, not five verbs that can be freely substituted for one another.',

        '## When do you use hnav?',

        '**"Hnav"** is used for ordinary clothing, including shirts and pants. Think of clothes that you put on as garments.',

        '> Nws hnav lub tsho. — He or she is wearing a shirt.',
        '> Kuv hnav ris ntaub tsuj mus ua haujlwm. — I wear jeans to work.',

        'The verb stays **"hnav"** because the item is ordinary clothing. Do not switch to **"coj"** simply because English can use “wear” for both clothes and accessories.',

        '## When do you use rau?',

        'In this lesson, **"rau"** is the verb for footwear, including shoes, socks, and slippers. The useful association is the feet and what you put on them.',

        '> Rau khau. — Put on shoes.',
        '> Kuv rau khau hlau thaum los nag. — I wear boots when it rains.',

        'These examples show why English alone cannot tell you which Hmong verb to use: the same general English idea of wearing footwear is expressed with **"rau"**, not the ordinary clothing verb **"hnav"**.',

        // ⚠️ REWORDED 2026-10-24, same pass as the other verify-with-a-speaker asides.
        // The advice to the LEARNER is kept (learn those expressions one at a time); the
        // instruction to go and verify them was an author task in a learner's sentence.
        // TODO-VERIFY: which foot-covering expressions actually take `looj`.
        // Was: '… Treat those as specific vocabulary to verify, not a reason to replace
        // the established footwear pattern in this lesson.'
        'The word **"looj"** also turns up in some expressions about covering the feet. Learn those as their own vocabulary — they do not replace the footwear pattern in this lesson.',

        '## When do you use looj?',

        '**"Looj"** is used in this lesson for items such as gloves and, in the existing example set, a hat. The covering idea is a useful memory aid because these items cover part of the body.',

        '> Looj lub kaus mom. — Put on a hat.',
        '> Looj hnab looj tes. — Put on gloves.',

        'The memory aid is not a perfect rule for every item that covers something. Hmong has conventional verb-and-item pairings, and hat usage needs verification for this lesson. Do not assume that every object worn on the head must use **"looj"**.',

        '## When do you use coj?',

        '**"Coj"** is used for accessories and jewelry in this lesson, including necklaces and rings. It is not simply a general replacement for **"hnav"**.',

        '> Coj saw caj dab. — Wear a necklace.',
        '> Nws coj nplhaib. — She wears a ring.',

        'The items help you select the verb: a necklace or ring belongs with **"coj"** in these examples. Learn the pairing with the item rather than translating the English word “wear” each time.',

        '## When do you use sia?',

        '**"Sia"** is used for belts and straps. The item is secured around or to something, which can help you remember the association.',

        '> Sia siv tawv. — Put on a belt.',

        'A belt takes **"sia"** in the given example. Do not use **"hnav"** automatically just because a belt is clothing-related in English.',

        '## How do the verbs and classifiers differ?',

        'The verb and the classifier do different jobs. The verb tells you how the item is conventionally worn. The classifier belongs to the noun phrase and helps identify or count the item.',

        'For example, **"lub tsho"** means a shirt, and **"lub kaus mom"** means a hat. Both phrases use **"lub"**, but the lesson pairs the shirt with **"hnav"** and the hat example with **"looj"**.',

        '> Nws hnav lub tsho. — He or she is wearing a shirt.',
        '> Looj lub kaus mom. — Put on a hat.',

        'The classifier does not choose the verb. You need to learn both parts: which classifier goes with the item and which wearing verb goes with it.',

        'Other useful noun phrases from this set include **"ib nkawm khau"** (a pair of shoes), **"lub ris"** (pants), **"txoj siv"** (a belt), and **"txoj phuam"** (a scarf). The classifier depends on the noun; do not assume that every clothing item uses **"lub"**.',

        '## Does the verb mean “put on” or “wear”?',

        'English often distinguishes the action of putting an item on from the state of wearing it. The supplied examples translate some phrases as “put on” and others as “wear.” The situation and full sentence help determine the natural English translation.',

        'Do not assume that **"rau"**, **"looj"**, or **"sia"** must always mean “put on,” or that **"hnav"** must always mean “wearing.” Learn which item each verb goes with first, then learn the phrase in context.',

        '## How do you choose the verb?',

        'Start with the item, then recall its usual pairing:',

        '- Ordinary garments such as shirts and pants: **"hnav"**.',
        '- Footwear such as shoes: **"rau"**.',
        '- Gloves and the hat phrase used in this lesson: **"looj"**.',
        '- Jewelry and accessories such as necklaces and rings: **"coj"**.',
        '- Belts and straps: **"sia"**.',

        'These categories help you remember the examples, but they are not a formula for deciding every possible item. If an item is not in the list, check its established Hmong usage rather than guessing from its shape or where it is worn.',

        'The central rule is simple: **learn the item and its verb together**. The English word “wear” does not tell you which Hmong verb to choose.'
      ],
    },
    {
      id: 'grammar-wearing-examples',
      kind: 'examples',
      title: 'Which verb goes with the item?',
      intro: 'Read the phrase, identify the item, and recall its usual verb.',
      items: [
        {
          hmong: 'Hnav tsho',
          english: 'Wear a shirt.',
          note: 'Hnav goes with ordinary clothing such as shirts.'
        },
        {
          hmong: 'Hnav ris ntev',
          english: 'Wear pants.',
          note: 'Pants are clothing, so this phrase uses hnav.'
        },
        {
          hmong: 'Rau khau',
          english: 'Put on shoes.',
          note: 'Rau is the footwear verb in this lesson.'
        },
        {
          hmong: 'Looj kaus mom',
          english: 'Put on a hat.',
          note: 'This is the existing lesson phrase. Verify the usage: some White Hmong references use ntoo with hats.'
        },
        {
          hmong: 'Looj hnab looj tes',
          english: 'Put on gloves.',
          note: 'Looj is used with gloves in this phrase.'
        },
        {
          hmong: 'Coj saw caj dab',
          english: 'Wear a necklace.',
          note: 'Coj is used with this accessory.'
        },
        {
          hmong: 'Coj nplhaib',
          english: 'Wear a ring.',
          note: 'A ring is an accessory; the phrase uses coj.'
        },
        {
          hmong: 'Sia siv tawv',
          english: 'Put on a belt.',
          note: 'Sia is used with a belt.'
        }
      ],
    },
    {
      id: 'grammar-wearing-check',
      kind: 'practice',
      title: 'Which verb?',
      prompt: 'Which verb goes with a hat (kaus mom) in the lesson’s current examples?',
      options: ['looj', 'hnav', 'rau', 'sia'],
      answer: 'looj',
    },
    {
      id: 'grammar-wearing-check-feet',
      kind: 'practice',
      title: 'Which verb?',
      prompt: 'Which verb goes with shoes (khau) in this lesson?',
      options: ['rau', 'coj', 'hnav', 'looj'],
      answer: 'rau',
    },
    {
      id: 'grammar-wearing-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};
