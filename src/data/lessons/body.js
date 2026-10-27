
// Standalone lesson: BODY & HEALTH — body parts, classifiers, and health.
//
// Expanded to introduce the body in general before focusing on pain.
// Existing lesson and step IDs are preserved.
// New step: grammar-body-parts.
//
// TODO-VERIFY: The source phrase uses "nrob qaum".
// White Hmong references also list "nraub qaum" for back.
// Confirm the app's preferred spelling before changing the reviewed phrase.
//
// TODO-VERIFY: Confirm whether "Kuv mob taub hau" or
// "Kuv lub taub hau mob" is more natural in the target community.

export const body = {
  placeholder: true,
  id: 'grammar-body',
  title: 'Body & Health | Lub Cev',
  summary: 'Learn the main parts of the body, how body-part classifiers work, and how to describe pain or seek medical care.',
  vocab: 'human-anatomy-face',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-body-intro',
      kind: 'intro',
      title: 'Understanding the body',
      body: [
        '## What does the body include?',

        'The phrase **"lub cev"** means the body. The body has different parts, and learning them by region makes the vocabulary easier to remember. Start with the head and face, the torso, and the arms, hands, legs, and feet.',

        '> Lub cev — the body',

        'A body part can have its own name, and some names refer to a whole area while others refer to one specific part. For example, **"taub hau"** means head, while **"qhov muag"** means eye.',

        '## What are the main parts of the body?',

        'The head and face include **"taub hau"** (head), **"qhov muag"** (eye), **"plaub hau"** (hair), and **"hniav"** (teeth). These words name different parts of the same general area; do not use one as a general word for the whole face or head.',

        'The torso includes **"plab"** (stomach or abdomen) and the back, written as **"nraub qaum"** in some references. The arms and legs have their own terms: **"caj npab"** refers to the upper arm, **"tes"** means hand, **"ceg"** means leg, and **"ko taw"** means foot.',

        'Learning body words in groups helps you remember where each part belongs, but the group does not determine which classifier the word uses. Learn the classifier along with the individual body-part term.',

        '## Why do body parts use classifiers?',

        'In Hmong, a classifier can appear before a noun when you identify or count something. The classifier depends on the noun and how you are referring to it. There is no single classifier that works for every body part.',

        'For example, **"lub"** occurs with body-part terms such as **"taub hau"** and **"qhov muag"** in the phrases below:',

        '> Kuv lub taub hau mob. — My head hurts.',
        '> Kuv lub qhov muag mob. — My eye hurts.',

        'Here, **"kuv"** means my, and **"lub"** is part of the noun phrase. Do not conclude that every body part must use **"lub"**; other body parts use different patterns.',

        '## When do you use txhais?',

        'The classifier **"txhais"** is used with terms for hands and legs, including when you identify one member of a pair.',

        '> Ib txhais tes — one hand',
        '> Ib txhais ceg — one leg',

        'The word **"ib"** means one. The classifier helps form the expression for one hand or one leg. Do not confuse the classifier with the body-part name itself.',

        '## How do you talk about a group of body parts?',

        'The word **"cov"** can mark a plural group. It appears in expressions such as **"cov plaub hau"** (hair) and **"cov hniav"** (teeth).',

        '> Cov hniav — the teeth',

        'The classifier depends on what is being referred to. Do not automatically put **"cov"** before every body-part word just because a person has two of that part.',

        '## How do you say that something hurts?',

        'The word **"mob"** can mean sick or hurt. In the examples here, it follows the body part to describe where the pain is.',

        '> Kuv lub taub hau mob. — My head hurts.',
        '> Kuv caj npab mob me ntsis. — My arm hurts a little.',
        '> Kuv plab mob tom qab noj ntau. — My stomach hurts after eating a lot.',

        'The phrase **"me ntsis"** means a little. The phrase **"tom qab noj ntau"** means after eating a lot. These extra words tell the listener more about the pain: how much it hurts or when it began.',

        'The important pattern is the body part followed by **"mob"**. The body part tells you where the pain is; **"mob"** tells you that it hurts.',

        '## What words are useful for medical care?',

        'When you talk about health, you may need words for places where people receive care. **"Kws kho mob"** means doctor or medical professional, and **"tsev kho mob"** means hospital.',

        '> Kuv mus tsev kho mob. — I am going to the hospital.',

        'This sentence is about going to a place for medical care. It is different from describing a symptom: the body-part expressions tell you what hurts, while the hospital expression tells you where you are going.',

        '## How do the ideas fit together?',

        'Learn each body part with its name and classifier. Then learn how the same body part appears in a sentence about pain. Finally, learn the words for medical care.',

        'For example, **"taub hau"** names the head, **"lub taub hau"** identifies it in the noun phrase, and **"Kuv lub taub hau mob"** tells someone that your head hurts.',

        'The main idea is to learn more than a list of body-part translations. Understand which part each word names, which classifier it uses, and how to use it when talking about your body.'
      ],
    },
    {
      id: 'grammar-body-parts',
      kind: 'examples',
      title: 'Parts of the body',
      intro: 'Learn the body from head to toe. Notice that each word names a particular part, not the whole body.',
      items: [
        {
          hmong: 'Lub cev',
          english: 'The body',
          note: 'The general term for the body.'
        },
        {
          hmong: 'Lub taub hau',
          english: 'The head',
          note: 'A body-part phrase using lub.'
        },
        {
          hmong: 'Lub qhov muag',
          english: 'The eye',
          note: 'A specific part of the head and face.'
        },
        {
          hmong: 'Plaub hau',
          english: 'Hair',
          note: 'Hair on the head.'
        },
        {
          hmong: 'Cov hniav',
          english: 'The teeth',
          note: 'Cov is used for a group.'
        },
        {
          hmong: 'Caj npab',
          english: 'Upper arm',
          note: 'The arm area above the hand.'
        },
        {
          hmong: 'Tes',
          english: 'Hand',
          note: 'Txhais appears in the counting phrase ib txhais tes.'
        },
        {
          hmong: 'Plab',
          english: 'Stomach; abdomen',
          note: 'The abdomen area.'
        },
        {
          hmong: 'Nraub qaum',
          english: 'Back',
          // TODO-VERIFY: check this spelling against the vocabulary entry.
          // Was a learner-facing note naming the app (2026-10-22).
          note: null
        },
        {
          hmong: 'Ceg',
          english: 'Leg',
          note: 'Txhais appears in the counting phrase ib txhais ceg.'
        },
        {
          hmong: 'Ko taw',
          english: 'Foot',
          note: 'The foot, not the whole leg.'
        }
      ],
    },
    {
      id: 'grammar-body-examples',
      kind: 'examples',
      title: 'It hurts',
      intro: 'These phrases show how to describe pain in a particular part of the body.',
      items: [
        {
          hmong: 'Kuv lub taub hau mob.',
          english: 'My head hurts.',
          note: 'The body part comes before mob.'
        },
        {
          hmong: 'Kuv lub qhov muag mob.',
          english: 'My eye hurts.',
          note: 'Lub is part of the noun phrase for the eye.'
        },
        {
          hmong: 'Kuv caj npab mob me ntsis.',
          english: 'My arm hurts a little.',
          note: 'Me ntsis adds the meaning a little.'
        },
        {
          hmong: 'Kuv nrob qaum mob tom qab zaum ntev.',
          english: 'My back hurts after sitting for a long time.',
          note: 'The source phrase uses nrob qaum; confirm whether the intended spelling is nraub qaum.'
        },
        {
          hmong: 'Kuv ko taw mob thaum taug kev.',
          english: 'My foot hurts when I walk.',
          note: 'The phrase names the foot and describes when it hurts.'
        },
        {
          hmong: 'Kuv plab mob tom qab noj ntau.',
          english: 'My stomach hurts after eating a lot.',
          note: 'Tom qab noj ntau explains when the pain occurs.'
        },
        {
          hmong: 'Ib txhais tes',
          english: 'One hand',
          note: 'Txhais is used when referring to one hand.'
        },
        {
          hmong: 'Cov hniav',
          english: 'The teeth',
          note: 'Cov marks a group.'
        }
      ],
    },
    {
      id: 'grammar-body-check',
      kind: 'practice',
      title: 'Which classifier?',
      prompt: 'One hand is "ib ___ tes".',
      options: ['txhais', 'lub', 'tus', 'daim'],
      answer: 'txhais',
    },
    {
      id: 'grammar-body-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};
