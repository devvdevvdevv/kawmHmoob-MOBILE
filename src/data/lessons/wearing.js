// Standalone lesson: CLOTHES & WEARING — the verb for "wear" depends on the item.
// Written 2026-09-28 for path unit u-wearing (Clothes & Wearing). The five wear verbs are the
// app's wear-verbs set; rau for the feet (shoes, socks, slippers) is the author's ruling, with
// looj taw possible by context (2026-09-27). The pairing idea — the verb follows the item, the
// way a classifier follows the noun — is Claude's framing. Examples are the cards' own, except
// where marked. TODO-VERIFY with the author: hnav for glasses (tsom iav) is left untaught.

export const wearing = {
  placeholder: true,  // 2026-09-28 — Claude's draft, not yet the author's lesson
  id: 'grammar-wearing',
  title: 'Clothes & Wearing | Hnav, Rau, Looj, Coj, Sia',
  summary: 'English says “wear” for everything. Hmong picks the verb by what you are wearing.',
  vocab: 'wear-verbs',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-wearing-intro',
      kind: 'intro',
      title: 'Five ways to say “wear”',
      body: [
        'In English you wear a shirt, shoes, a hat and a ring, all with one verb. Hmong has a different verb for each kind of item, much like a classifier changes with the noun.',
        '## Hnav: clothes on the body',
        'For shirts, pants, dresses and most clothing:',
        '> Nws hnav lub tsho. — He is wearing a shirt.',
        '> Kuv hnav ris ntaub tsuj mus ua haujlwm. — I wear jeans to work.',
        '## Rau: the feet',
        'For shoes, socks and slippers. (Looj taw, covering the feet, can also be heard for socks, by context.)',
        '> Rau khau. — Put on shoes.',
        '> Kuv rau khau hlau thaum los nag. — I wear boots when it rains.',
        '## Looj: covering',
        'For things that cover: hats and gloves.',
        '> Looj lub kaus mom. — Put on a hat.',
        '> Looj hnab looj tes. — Put on gloves.',
        '## Coj: accessories and jewelry',
        'For necklaces, rings, bracelets and watches:',
        '> Coj saw caj dab. — Wear a necklace.',
        '> Nws coj nplhaib. — She wears a ring.',
        '## Sia: belts and straps',
        '> Sia siv tawv. — Put on a belt.',
        '## The classifiers come along',
        'Each item keeps its own classifier: lub tsho (a shirt), lub ris (pants), ib nkawm khau (a pair of shoes), lub kaus mom (a hat), txoj siv (a belt), txoj phuam (a scarf).',
        '## An easy way to remember',
        '> clothes on the body → hnav',
        '> the feet → rau',
        '> something that covers → looj',
        '> jewelry and accessories → coj',
        '> belts and straps → sia',
      ],
    },
    {
      id: 'grammar-wearing-examples',
      kind: 'examples',
      title: 'Which verb?',
      intro: 'Look at the item, then pick the verb.',
      items: [
        { hmong: 'Hnav tsho', english: 'wear a shirt', note: 'clothing → hnav' },
        { hmong: 'Hnav ris ntev', english: 'wear pants', note: 'clothing → hnav' },
        { hmong: 'Rau khau', english: 'put on shoes', note: 'feet → rau' },
        { hmong: 'Looj kaus mom', english: 'put on a hat', note: 'covering → looj' },
        { hmong: 'Looj hnab looj tes', english: 'put on gloves', note: 'covering → looj' },
        { hmong: 'Coj saw caj dab', english: 'wear a necklace', note: 'jewelry → coj' },
        { hmong: 'Coj nplhaib', english: 'wear a ring', note: 'jewelry → coj' },
        { hmong: 'Sia siv tawv', english: 'put on a belt', note: 'belts → sia' },
      ],
    },
    {
      id: 'grammar-wearing-check',
      kind: 'practice',
      title: 'Which verb?',
      prompt: 'Which verb goes with a hat (kaus mom)?',
      options: ['looj', 'hnav', 'rau', 'sia'],
      answer: 'looj',
    },
    {
      id: 'grammar-wearing-check-feet',
      kind: 'practice',
      title: 'Which verb?',
      prompt: 'Which verb goes with shoes (khau)?',
      options: ['rau', 'coj', 'hnav', 'looj'],
      answer: 'rau',
    },
    {
      id: 'grammar-wearing-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
