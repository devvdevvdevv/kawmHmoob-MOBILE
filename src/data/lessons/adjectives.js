/* Standalone lesson: describing words (adjectives) in Hmong. */

export const adjectives = {
  id: 'grammar-adjectives',
  title: 'Adjectives | Describing Words',
  summary: 'Learn how Hmong describes people and things, where adjectives go, and how to say very big, too hot, bigger, and more.',
  vocab: 'adjective-grammar',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-adjectives-intro',
      kind: 'intro',
      title: 'Describing things',
      body: [
        'Adjectives are words that describe people, places, and things: big, small, good, bad, young, old, hot, and cold.',
        'The main difference from English is word order. In a normal descriptive phrase, Hmong puts the noun first and the adjective after it. Adjectives can also work as the main description in a sentence, without a separate word for “is”.',
        '## 1. Noun first, then the adjective',
        'English says “a big house”. Hmong puts the thing first, then tells you what it is like.',
        '> neeg zoo — a good person (literally “person good”)',
        '> tsev loj — a big house (literally “house big”)',
        '> tus neeg hluas — a young person',
        '> tus neeg laus — an old person',
        'When a classifier is used, it comes before the noun. The adjective follows the noun:',
        '> tus aub me — a small dog',
        '> lub tsev loj — a big house',
        '> lub tsheb tshiab — a new car',
        'Learn the order as a phrase instead of translating each English word into the same position.',
        '## 2. Noun + adjective — no “to be”, no **"yog"**',
        'A describing word acts as the main verb of the sentence. There is no “to be” in this pattern at all — no **"yog"**, and nothing standing in for English “is”, “am” or “are”. The adjective itself is what the sentence says about the noun.',
        '> Hnub no kub heev. — It is very hot today.',
        '> Lub tsev no loj. — This house is big.',
        '> Tus aub ntawd me. — That dog is small.',
        'English cannot say “This house big”, so it inserts “is”. Hmong inserts nothing: the noun, then the describing word, and the sentence is complete. Do not reach for **"yog"**, and do not reach for **"nyob"** either — neither belongs in front of a describing word here.',
        '> ✓ Nws zoo heev. — He, she, or it is very good.',
        '> ✗ Nws yog zoo heev. — Avoid this pattern for the intended meaning.',
        '**"Yog"** is still useful when linking a person or thing to a noun or category. For example:',
        '> Koj yog ib tug neeg zoo. — You are a good person.',
        'Here, **"yog"** links “koj” to the noun phrase “ib tug neeg zoo”. The adjective **"zoo"** describes the noun **"neeg"**; it does not follow **"yog"** directly.',
        'For the difference between **"yog"** and other ways of expressing “to be”, see the Yog lesson.',
        '## 3. An adjective before a noun can change the meaning',
        'The normal descriptive order is noun + adjective. Some expressions put the describing word before the noun, but do not assume that reversing the order always means the same thing.',
        '> tus neeg laus — an old person',
        '> tus laus neeg — the elder (a title in the usage taught here)',
        'The second expression is not simply the normal phrase with the words swapped. Learn it as a distinct expression, and check the context when you meet this less common order.',
        // ── ⚠️ SECTION 4 REWRITTEN FROM THE AUTHOR'S TEXT — 2026-10-21 ────────
        //
        // Author: *"add this additional part to adjectives, integrate it"*, with a
        // much fuller treatment of where `no` goes.
        //
        // ⚠️ INTEGRATED, NOT APPENDED. The lesson already had this section with
        // the same two subsections and the same examples, so pasting the new text
        // in would have taught the contrast twice in a row. The author's
        // explanation replaces the old one; what the old version had and theirs
        // did not is folded in:
        //   · `tus aub me ntawd` — the same pattern with `ntawd`, not just `no`
        //   · `Kuv nyeem kuv tsev loj no` as the naming phrase INSIDE a sentence
        //   · the "`no` stands alone" subsection and its `No yog kuv niam`
        //   · the pointer to the Demonstratives lesson
        //
        // ⚠️ THE TWO MARKDOWN TABLES BECAME EXAMPLE PAIRS. IntroBody has no table
        // renderer (it knows '## ', '### ', '> ' and '---'), so each row is a '> '
        // line with the "what are you doing?" column written into the gloss. The
        // side-by-side reading survives; the grid does not.
        //
        // ⚠️ "You do not need to add yog" IS THE AUTHOR'S SETTLED RULE (2026-09-28,
        // and section 2 of this lesson). Kept where their text puts it.
        '## 4. Where **"no"** goes: naming something or describing it',

        'This is one of the most important contrasts in the lesson, and it is easier than it looks. You only need to ask yourself one question:',

        '**Are you naming something, or are you saying something about it?**',

        '### 1. Adjective + **"no"** = naming the thing',

        'When **"no"** comes AFTER the adjective, you are pointing to a thing and telling someone which one you mean. Think of it as putting a label on something: “this big house.”',

        '> lub tsev loj no — this big house (tsev = house, loj = big, no = this)',

        'You are naming a house. You are not saying what the house is like yet.',

        'More examples:',

        '> lub tsev tshiab no — this new house',

        '> tus aub me no — this small dog',

        '> tus aub me ntawd — that small dog (the same pattern with **"ntawd"**, that)',

        '> kuv tsev loj no — this big house of mine',

        '> Kuv nyiam kuv tsev loj no. — I like this big house of mine. (the naming phrase inside a sentence)',

        '**Remember:** adjective first, then **"no"**. You are pointing out *which thing*.',

        '### 2. **"No"** + adjective = describing the thing',

        'When **"no"** comes BEFORE the adjective, you are saying something about the thing. Think of it as pointing at something and then telling someone about it: “This house is big.”',

        '> Kuv tsev no loj. — This house of mine is big. (kuv tsev = my house, no = this, loj = big)',

        'You have already told us which house you mean: “this house of mine”. Now you tell us about it: it is big.',

        'More examples:',

        '> Lub tsev no loj. — This house is big.',

        '> Tus aub no me. — This dog is small.',

        '> Lub tsheb no tshiab. — This car is new.',

        '**Remember:** noun first, then **"no"**, then the adjective. You are saying *what the thing is like*.',

        '### 3. Put them side by side',

        'Look at these two pairs. The only thing that changes is where **"no"** goes.',

        '> kuv tsev loj no — this big house of mine (naming the house)',

        '> Kuv tsev no loj. — This house of mine is big. (describing the house)',

        '> lub tsev loj no — this big house (naming the house)',

        '> Lub tsev no loj. — This house is big. (describing the house)',

        'Say the difference out loud: adjective + **"no"** answers “Which thing?” — this big house. **"No"** + adjective answers “What about it?” — this house is big.',

        '### 4. A simple way to remember',

        'Imagine you are pointing at a house. If you say “this big house,” you are identifying the house, so **"no"** goes at the end:',

        '> lub tsev loj no',

        'If you say “this house is big,” you are making a statement about the house, so **"no"** goes before the adjective:',

        '> Lub tsev no loj.',

        'You do not need to add **"yog"** between **"no"** and the adjective. In this pattern, the adjective itself tells us what the house is like.',

        '### 5. Quick check',

        'Which one means “this small dog”?',

        '> tus aub me no',

        'Which one means “this dog is small”?',

        '> Tus aub no me.',

        'The first names the dog. The second describes the dog.',

        'One final rule to remember:',

        '> Adjective + **"no"** = “this [describing word] thing.”',

        '> **"No"** + adjective = “this thing is [describing word].”',

        '### When **"no"** stands alone',

        '**"No"** can also mean “this” or “this one” by itself. When it introduces a noun as the identification, **"yog"** can appear:',

        '> No yog kuv niam. — This is my mother.',

        'Here, **"no"** stands for “this”, and **"kuv niam"** is the noun phrase that identifies it.',

        'See the Demonstratives lesson for **"no"**, **"ko"**, **"ntawd"**, and **"qhov no"**.',
        '## 5. Possessors go before the noun',
        '**"Kuv"**, **"koj"**, and **"nws"** can identify whose thing you mean. They go before the noun phrase.',
        '> kuv niam no — this mother of mine',
        '> kuv tsev loj no — this big house of mine',
        '> koj tus aub me ntawd — that small dog of yours',
        'Do not confuse possession with the position of no. The possessor comes first; the noun and adjective follow; the pointing word comes at the end of the noun phrase.',
        '## 6. Make an adjective stronger: **"Heev"**, **"Kawg"**, and **"Tiag tiag"**',
        'These expressions come after the adjective. They strengthen the description, but they do not all mean exactly the same thing.',
        '- **"Heev"** — very',
        '- **"Kawg"** — extremely; very much, depending on the expression',
        '- **"Kawg nkaus"** — an especially strong form of “extremely”',
        '- **"Tiag tiag"** — really, truly',
        '> Lub tsev no loj heev. — This house is very big.',
        '> Lub tsev no loj kawg. — This house is extremely big.',
        '> Nws zoo tiag tiag. — He, she, or it is really good.',
        'The basic pattern is adjective + intensifier. Do not put **"heev"** before the adjective in these examples.',
        '## 7. Too much: **"dhau"**',
        '**"Heev"** makes a quality stronger. **"Dhau"** means that the quality goes beyond what is wanted or acceptable: “too”.',
        '> Kas fes kub dhau. — The coffee is too hot.',
        '> Lub hnab no hnyav dhau. — This bag is too heavy.',
        'Compare the meanings:',
        '> kub heev — very hot',
        '> kub dhau — too hot',
        'Something can be very hot without being too hot. **"Dhau"** adds the idea that it is more than is wanted.',
        '## 8. Comparing things: **"dua"** and **"tshaj"**',
        'Use **"dua"** for a comparative meaning such as “bigger” or “longer”. Use **"tshaj"** for a superlative meaning such as “biggest” or “longest” in the patterns below.',
        '> Tus noog no loj dua. — This bird is bigger.',
        '> Tus noog no loj dua tus ntawd. — This bird is bigger than that one.',
        '> Tus noog no loj tshaj. — This bird is the biggest.',
        'The comparison can stand without naming the other thing when the context already makes the comparison clear. Add the comparison target when you need to say what something is bigger or better than.',
        'Do not normally combine **"tshaj"** and **"dua"** in the same superlative expression in this pattern:',
        '> ✗ Tus noog no loj tshaj dua.',
        '> ✓ Tus noog no loj tshaj. — This bird is the biggest.',
        'Learn **"dua"** and **"tshaj"** as different comparison patterns: “more than” versus “the most”.',
        '## 9. Some adjectives can be repeated',
        'Some describing words can be doubled for emphasis. This is not a rule that applies to every adjective, so learn the repeated forms you actually hear.',
        '> Lub paj no liab liab. — This flower is very red.',
        'Here, **"liab"** means “red”. Repeating it strengthens the description.',
        'Do not automatically double every adjective to make it stronger. Use familiar examples and check unfamiliar ones with a fluent speaker.',
        '## 10. Feelings with **"siab"**',
        'Hmong uses **"siab"** in many expressions about feelings and character. The order of the words matters: **"zoo siab"** and **"siab zoo"** do not mean the same thing.',
        '> zoo siab — happy',
        '> nyuaj siab — sad, troubled, or distressed',
        '> chim siab — upset or angry',
        '> siab zoo — kind, good-hearted',
        '> Kuv zoo siab heev. — I am very happy.',
        'In **"zoo siab"**, the phrase describes a feeling. In **"siab zoo"**, the order describes a person’s character. Learn each expression as a phrase rather than moving the words around freely.',
        '## 11. Hot, cold, and physical states',
        'Adjectives such as **"kub"** (hot) and **"txias"** (cold) describe temperature. When talking about how a person physically feels, the lesson’s target pattern uses **"nyob"**.',
        '> Kuv nyob kub. — I am hot.',
        'This is a useful distinction to compare with the general adjective pattern. For more on how **"nyob"** describes a state or condition, see the Yog & Nyob lesson.',
        '## 12. Make a description negative or ask about it',
        '**"Tsis"** makes a description negative. **"Puas"** forms a yes/no question. In these examples, both come before the adjective.',
        '> Lub tsev no tsis loj. — This house is not big.',
        '> Hnub no tsis kub. — It is not hot today.',
        '> Hnub no puas kub? — Is it hot today?',
        'Compare the three sentences:',
        '> Hnub no kub. — It is hot today.',
        '> Hnub no tsis kub. — It is not hot today.',
        '> Hnub no puas kub? — Is it hot today?',
        'The adjective **"kub"** stays in place. **"Tsis"** makes the statement negative; **"puas"** turns it into a question.',
        'For more about **"tsis"** and negative answers, see the Tsis lesson.',
        '## Common mistakes',
        '> ✗ Hnub no yog kub heev.',
        '> ✓ Hnub no kub heev. — It is very hot today.',
        'In this lesson’s adjective pattern, do not put **"yog"** — or anything else standing in for “to be” — directly before the adjective.',
        '> ✗ lub tsev no heev loj',
        '> ✓ lub tsev no loj heev. — This house is very big.',
        '**"Heev"** follows the adjective. In a noun phrase ending with **"no"**, the order is adjective + **"no"**: **"lub tsev loj heev no"**, “this very big house”.',
        '> ✗ Tus noog no loj tshaj dua.',
        '> ✓ Tus noog no loj tshaj. — This bird is the biggest.',
        'Do not add **"dua"** to the superlative pattern taught here.',
        '## Quick reference',
        '> Noun + adjective → neeg zoo — a good person',
        '> Classifier + noun + adjective → tus aub me — a small dog',
        '> Noun + adjective + no → lub tsev loj no — this big house',
        '> Noun + no + adjective → Lub tsev no loj. — This house is big.',
        '> Adjective + heev → loj heev — very big',
        '> Adjective + dhau → kub dhau — too hot',
        '> Adjective + dua → loj dua — bigger',
        '> Adjective + tshaj → loj tshaj — biggest',
        '> Tsis / puas + adjective → tsis loj / puas loj? — not big / is it big?',
        'Start with the basic order, then practise adding no, an intensifier, or **"tsis"**. Once those patterns feel familiar, comparisons and longer descriptions become easier to build.',
      ],
    },
    {
      id: 'grammar-adjectives-examples',
      kind: 'examples',
      title: 'Opposites',
      intro: 'Learn these pairs together. Notice that some English words depend on whether you are describing a person or a thing.',
      items: [
        { hmong: 'Loj · Me', english: 'big · small', note: 'Often also used in age or seniority expressions; context matters.' },
        { hmong: 'Zoo · Phem', english: 'good · bad' },
        { hmong: 'Tshiab · Qub', english: 'new · old (especially things)' },
        { hmong: 'Hluas · Laus', english: 'young · old (people)' },
        { hmong: 'Kub · Txias', english: 'hot · cold or cool, depending on context' },
        { hmong: 'Ntev · Luv', english: 'long · short' },
      ],
    },
    {
      id: 'grammar-adjectives-sentences',
      kind: 'examples',
      title: 'Describing in sentences',
      intro: 'Read each example aloud. Pay attention to the adjective and the words around it.',
      items: [
        {
          hmong: 'Nws yog tus neeg hluas.',
          english: 'He or she is a young person.',
          note: '**"Yog"** links the subject to a noun phrase; **"hluas"** describes **"neeg"**.'
        },
        {
          hmong: 'Lub tsev no loj heev.',
          english: 'This house is very big.',
          note: 'No comes before the predicate adjective; **"heev"** follows **"loj"**.'
        },
        {
          hmong: 'Kuv nyiam lub tsheb tshiab no.',
          english: 'I like this new car.',
          note: 'The noun phrase ends with the pointing word no.'
        },
        {
          hmong: 'Kas fes kub dhau.',
          english: 'The coffee is too hot.',
          note: '**"Dhau"** means “too” in this pattern.'
        },
        {
          hmong: 'Tus noog no loj tshaj.',
          english: 'This bird is the biggest.',
          note: '**"Tshaj"** marks the superlative pattern taught here.'
        },
        {
          hmong: 'Kuv zoo siab heev.',
          english: 'I am very happy.',
          note: '**"Zoo siab"** is a feeling expression; **"heev"** strengthens it.'
        },
        {
          hmong: 'Lub tsev no tsis loj.',
          english: 'This house is not big.',
          note: '**"Tsis"** comes before the adjective.'
        },
        {
          hmong: 'Kuv niamtais yog tus laus neeg.',
          english: 'My grandmother is the elder.',
          // ⚠️ "TODO-VERIFY with a fluent speaker." REMOVED FROM THE NOTE — 2026-10-24
          // (the author: take the verify-with-a-native-speaker parts out of what the
          // learner reads). It is still open, it is just not the learner's problem.
          // TODO-VERIFY with a fluent speaker: the adjective-first-as-title reading.
          note: 'The adjective-first form is treated here as a title, not the ordinary descriptive order.'
        },
        {
          hmong: 'Kuv nyiam kuv tsev loj no.',
          english: 'I like this big house of mine.',
          note: 'No after **"loj"** closes the noun phrase.'
        },
        {
          hmong: 'Kuv tsev no loj.',
          english: 'This house of mine is big.',
          note: 'No before **"loj"**: the adjective describes the house in a sentence.'
        },
        {
          hmong: 'No yog kuv niam.',
          english: 'This is my mother.',
          note: 'No stands alone as “this”; **"yog"** links it to the noun phrase.'
        },
        {
          hmong: 'Hnub no puas kub?',
          english: 'Is it hot today?',
          note: '**"Puas"** comes before the adjective.'
        },
      ],
    },
    {
      id: 'grammar-adjectives-practice',
      kind: 'practice',
      title: 'Phrase or sentence?',
      prompt: 'Which one means “This house is big” rather than “this big house”?',
      options: [
        '**"Lub tsev loj"** no.',
        '**"Lub tsev"** no **"loj"**.',
        '**"Lub tsev loj heev"** no.',
        '**"Lub tsev tshiab"** no.',
      ],
      answer: 'Lub tsev no loj.',
    },
    {
      id: 'grammar-adjectives-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};