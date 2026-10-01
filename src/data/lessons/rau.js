// Standalone lesson: RAU — six, to / for, put / apply, toward / at, and putting on footwear.
// Written 2026-09-27 for path unit u-rau — the author: "a lot of people will get confused
// … rau is like the most common Hmong conjunction. Rau is a homonym … it means six,
// to/for, and wear / to wear / wearing foot-related items like shoes, socks, slippers."
// And the structure: verb + rau + noun + verb means "for someone to do something" — the
// second rau is implied, not written or spoken ("Kuv sau ntawv rau koj nyeem").
// EXPANDED 2026-09-27 (the author, same day): rau also means put / place / apply ("Nws rau
// tshuaj" — the author wrote "tsuaj"; medicine is tshuaj), and toward / in / on / at — all
// context-based, and uncommon for going places, where rau is often left out and implied
// ("Lawv mus tsev kawm ntawv"). For location, ntawm or hauv is more usual than rau.
// Was: three meanings (six, to/for, wear), and "rau = put on, but only for the feet".
// Examples: the author's; the pronoun story (muab … rau koj); the Joining Words card. "Kuv
// muaj rau tus aub" and "Kuv rau khau" were Claude's — confirmed by the GPT fact-check.
// "Nws nyob hauv tsev" (the more usual form) is Claude's — TODO-VERIFY.

export const rau = {
  id: 'grammar-rau',
  title: 'Rau | Six, To, Put & Wear',  // was 'Rau | Six, To & Wear'
  summary: 'One word, many meanings — its place in the sentence, and the context, tell you which.',
  vocab: 'rau-uses',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-rau-intro',
      kind: 'intro',
      title: 'One word, many jobs',
      body: [
        'Rau is one of the most common words in Hmong, and it does a lot of different jobs. All of them are context-based: what sits around rau tells you which one you are hearing.',
        '> rau — six',
        '> rau — to, for (a person)',
        '> rau — to put, to place, to apply',
        '> rau — toward, in, on, at (a place)',
        '> rau — to put on, to wear (shoes, socks, slippers)',
        'The good news: each one has its own place in the sentence.',
        '## Six: before a classifier',
        'As a number, rau comes before the classifier and the noun, like any other number:',
        '> Rau hnub — six days',
        '> Kuv muaj rau tus aub. — I have six dogs.',
        '## To, for: after a verb, before a person',
        'This is the rau you will meet most. It comes after the verb and points to who the action goes to, or who it is for:',
        '> Kuv muab kuv daim pib rau koj. — I give my ticket to you.',
        '> Muab rau kuv. — Give it to me.',
        '## For someone to do something: the second rau is left out',
        'When rau is followed by a person and then another verb, it means “for [someone] to [do something]”. English would say “for you to read”; Hmong says it once, and the second rau is understood:',
        '> Kuv sau ntawv rau koj nyeem. — I am writing for you to read.',
        'Word for word that is “I write paper for you read”. Notice there is only one rau.',
        '## Put, place, apply',
        'As a verb, rau can mean to put something on, or to apply it:',
        '> Nws rau tshuaj. — He applies medicine.',
        'With muab, rau puts a thing in a place:',
        '> Muab phau ntawv rau saum rooj. — Put the book on the table.',
        '## Toward, in, on, at: context-based, and often left out',
        'Rau can point to a place: to, toward, in, on, at. This is uncommon when talking about going places, because Hmong has other words for that, and rau is often left out and simply implied:',
        '> Lawv mus rau tsev kawm ntawv. — They go to school.',
        '> Lawv mus tsev kawm ntawv. — They go to school. (rau left out; it still works)',
        '> Taug kev rau hauv nroog. — Walk to the city.',
        'For where something is, rau is possible, but ntawm (at) or hauv (in) is usually the better word:',
        '> Nws nyob rau tsev. — It is at / in the house.',
        '> Nws nyob hauv tsev. — It is in the house. (more usual)',
        '## Wear: rau + something for the feet',
        'When you are getting dressed, rau is the verb for the feet: shoes, socks, slippers.',
        '> Kuv rau khau. — I put on shoes.',
        // The author, 2026-09-27: rau for socks too. Looj can work, depending on context.
        'You may also hear looj for socks. Looj means to cover, wrap or enclose, as in looj taw (cover the feet). It can work depending on context, but rau fits better, because rau is about putting something on your feet.',
        '## An easy way to remember',
        '> rau + classifier + noun → six (rau tus aub)',
        '> verb + rau + person → to, for (muab rau koj)',
        '> verb + rau + person + verb → for someone to do it (sau ntawv rau koj nyeem)',
        '> rau + a thing → put, apply (rau tshuaj)',
        '> verb + rau + place → to, toward, in, on (often left out: mus tsev kawm ntawv)',
        '> rau + shoes, socks → put on (rau khau)',
      ],
    },
    {
      id: 'grammar-rau-examples',
      kind: 'examples',
      title: 'Which rau is it?',
      intro: 'Look at what comes right before and after rau.',
      items: [
        { hmong: 'Rau hnub', english: 'six days', note: 'rau + a noun it counts → six' },
        { hmong: 'Kuv muaj rau tus aub.', english: 'I have six dogs.', note: 'before the classifier → six' },
        { hmong: 'Kuv muab kuv daim pib rau koj.', english: 'I give my ticket to you.', note: 'after the verb → to' },
        { hmong: 'Muab rau kuv.', english: 'Give it to me.', note: 'to' },
        { hmong: 'Kuv sau ntawv rau koj nyeem.', english: 'I am writing for you to read.', note: 'for … to — the second rau is left out' },
        { hmong: 'Nws rau tshuaj.', english: 'He applies medicine.', note: 'rau + a thing → apply' },
        { hmong: 'Muab phau ntawv rau saum rooj.', english: 'Put the book on the table.', note: 'put … on' },
        { hmong: 'Lawv mus rau tsev kawm ntawv.', english: 'They go to school.', note: 'to a place — rau can be left out' },
        { hmong: 'Taug kev rau hauv nroog.', english: 'Walk to the city.', note: 'toward, into' },
        { hmong: 'Nws nyob rau tsev.', english: 'It is at / in the house.', note: 'possible, but ntawm or hauv is more usual' },
        { hmong: 'Kuv rau khau.', english: 'I put on shoes.', note: 'rau + shoes → put on' },
      ],
    },
    {
      id: 'grammar-rau-check',
      kind: 'practice',
      title: 'Which rau?',
      prompt: 'In "Kuv sau ntawv rau koj nyeem", what does rau mean?',
      options: ['for (you to read)', 'six', 'put on', 'and'],
      answer: 'for (you to read)',
    },
    {
      // Added 2026-09-27 with the put / apply meaning.
      id: 'grammar-rau-check-apply',
      kind: 'practice',
      title: 'Which rau?',
      prompt: 'In "Nws rau tshuaj", what does rau mean?',
      options: ['applies', 'six', 'to (a person)', 'at'],
      answer: 'applies',
    },
    {
      id: 'grammar-rau-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
