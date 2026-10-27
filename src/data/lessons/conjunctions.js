
// Standalone lesson: words and phrases that connect Hmong ideas.
//
// This lesson distinguishes clause connectors from other useful linkers.
// Some examples and distinctions were checked against Hmong for Beginners
// (Jaisser et al.) and published White Hmong teaching materials. A fluent
// White Hmong speaker should still review wording before publication.
// Audio is pending except for the existing audio paths below.
// Existing lesson and step IDs and all supplied audio paths are preserved.

export const conjunctions = {
  id: 'grammar-conjunctions',
  title: 'Conjunctions | Cov Lus Txuas',
  summary: 'Words and phrases that connect ideas, show sequence or contrast, and introduce conditions, reasons, and descriptions.',
  vocab: 'conjunctions',
  steps: [
    {
      id: 'grammar-conjunctions-intro',
      kind: 'intro',
      title: 'Joining two ideas',
      body: [
        '## What connecting words do',
        'Connecting words help show how two ideas fit together: one idea can add to another, contrast with it, explain a reason, or describe what happens next.',
        'Hmong does not always need an explicit connecting word. Sometimes the relationship between two clauses is clear from context or from the order of the clauses. Learn each word through the pattern it appears in, rather than translating every English “and,” “that,” or “then” word for word.',

        '## Start with five useful patterns',
        '### “Thiab” — and, also',
        'Use “thiab” to add another item or idea.',
        '> Yeeb nyiam mus tablaj thiab nws nyiam mus taug kev. — Yeeb likes going to the market, and Yeeb likes walking.',

        '### “Tiamsis” — but',
        'Use “tiamsis” to show a contrast between two ideas. “Tab sis” is another spelling/form you may see; keep the form used by your course consistent.',
        '> Gajneeb nyiam mus tablaj, tiamsis nws tsis nyiam mus taug kev. — Gajneeb likes going to the market, but does not like walking.',

        '### “Vim” / “vim hais tias” — because',
        'These forms introduce a reason. The longer “vim hais tias” is useful to recognize, but the extra words are not always required.',
        '> Vim kuv tsis xis nyob, kuv thiaj tsis mus ua haujlwm. — Because I do not feel well, I do not go to work.',

        '### “Yog hais tias” — if',
        'Use “yog hais tias” to introduce a condition. “Yog” on its own can also introduce an if-clause, but it has other meanings too, so the longer form can make the intended meaning clearer.',
        '> Yog koj ua tus neeg zoo, neeg yeej yuav nyiam koj. — If you are a good person, people will like you.',

        '### “Ces” — then, so then',
        '“Ces” often moves the sentence forward to the next event or step. In an if/then pattern, it can introduce what follows from the condition.',
        '> Koj noj mov tas ces koj mam mus ua teb. — After you finish eating, then you can go work in the fields.',
        '> Yog koj mus ces kuv tuaj. — If you go, then I will come.',

        '## “Ces” is not the same as every kind of “so”',
        '“Ces” often signals what happens next. “Yog li” can mean “so” or “in that case,” while “thiaj (li)” commonly marks a resulting or consequential action. These words overlap in English translation, but they do not always fit in the same sentence.',
        '> Koj tsis kam mus? Yog li ces kuv mus ib leeg. — You do not want to go? In that case, I will go alone.',
        'Learn the whole phrase and sentence pattern rather than assuming “then,” “so,” and “therefore” are always interchangeable.',

        '## “Los yog” and “lossis” — or',
        'Both forms can mean “or.”',
        '> Koj xav haus dej los yog kas fes? — Do you want water or coffee?',

        '## Two different kinds of “that”',
        '“Uas” and “tias” can both be translated as “that” in English, but they do different jobs.',
        '### “Uas” — who, which, that',
        '“Uas” introduces a clause that describes a noun. The describing clause follows the noun.',
        '> Nws nyiam noj cov khoom uas tsis ntsim txob. — She likes to eat foods that are not spicy.',
        'Here, “uas tsis ntsim txob” describes the foods: which foods? The ones that are not spicy.',
        '### “Tias” / “hais tias” — that, introducing what someone says or thinks',
        '“Tias” can introduce the content of what someone knows, thinks, hears, or says. “Hais tias” is common after a verb of saying. In this use, it does not describe a noun the way “uas” does.',
        '> Npis tsis paub tias muaj dais xim dawb. — Npis did not know that white bears existed.',
        '> Tus Tsov hais rau tus Qav tias, “Wb sib tw dhia.” — The Tiger told the Frog, “Let’s have a jumping contest.”',
        'Do not treat “uas,” “tias,” and “hais tias” as interchangeable translations of English “that.”',

        '## “Kom” — to, that, so that, in order to',
        '“Kom” can introduce an action that someone wants, asks for, or intends to bring about. It also has a verb use meaning to tell or order someone to do something, so its role depends on the sentence.',
        '> Tus Tsov tsis xav kom tus Qav rovqab noj dua nws ntxiv lawm. — The Tiger did not want the Frog to eat him again.',
        'In this example, “kom” introduces the action the Tiger does not want.',

        '## “Nrog” and “rau” — useful linkers, not conjunctions',
        'These words connect parts of a sentence, but they do not work like “and,” “but,” or “because.” They are useful to learn alongside conjunctions because they show how people and actions relate.',
        '> Kuv mus nrog nws. — I go with him/her.',
        '> Kuv muab rau koj. — I give (it) to you.',
        '“Nrog” means “with”; “rau” often means “to” or “for” in patterns like these. “Rau” has other meanings in other contexts, which belong in its own lesson.',

        '## “Seb” and “ntshe”',
        '“Seb” can introduce something someone is trying to find out, often translated with “whether” or “to see if.” The exact sentence pattern should be learned from natural examples.',
        // TODO-VERIFY this exact example with a fluent speaker. The parenthetical used to
        // be IN the line the learner reads — removed 2026-10-24 with the other
        // verify-with-a-speaker asides. Was: '… is home. (TODO: verify this exact example
        // with a fluent speaker.)'
        '> Kuv mus seb nws nyob. — I go to see whether he/she is home.',
        '“Ntshe” means “maybe” or “perhaps.” It expresses uncertainty rather than joining two clauses, so it is a useful related word but not a conjunction in the same sense as “thiab” or “tiamsis.”',
        '> Ntshe koj paub. — Maybe you know.',

        '## Paired patterns: “txawm … los” and “tsuas … xwb”',
        'Some expressions use two parts around the idea they modify. “Txawm … los” can express “even though” or “even if.” The exact pattern depends on the sentence, but learn the parts together.',
        '> Txawm koj yuav ua tibzoo ntuas Tooj los nws yeej tsis yuav. — Even if you carefully advise Tooj, he still will not accept it.',
        '“Tsuas … xwb” is a limiting pattern that often means “only.” It is not simply a conjunction, but the two parts are useful to recognize together.',
        '> Kuv tsuas kawm ntawv xwb. — I only study. / I am only studying.',

        '## Remember',
        '> Add an idea: “thiab” — and',
        '> Show contrast: “tiamsis” — but',
        '> Give a reason: “vim” — because',
        '> Introduce a condition: “yog hais tias” — if',
        '> Move to the next event: “ces” — then / so then',
        '> Introduce a result or response: “yog li” — so / in that case',
        '> Describe a noun: “uas” — who / which / that',
        '> Introduce what is said or thought: “tias” / “hais tias” — that',
        '> Introduce a desired action or purpose: “kom” — to / so that',
        'These are useful starting points, not one-to-one translation rules. Listen to the words in full sentences and learn how they work in context.'
      ],
    },
    {
      id: 'grammar-conjunctions-examples',
      kind: 'examples',
      title: 'The most common joiners',
      intro: 'Read each word aloud, then review the example and note to see how it works in a sentence.',
      items: [
        {
          hmong: 'thiab',
          audio: 'grammar/conjunctions/hmong-conjunctions-thiab.mp3',
          english: 'and; also',
          note: 'Adds another item or idea: “Yeeb nyiam mus tablaj thiab nws nyiam mus taug kev.” — Yeeb likes going to the market, and Yeeb likes walking.'
        },
        {
          hmong: 'tiamsis',
          audio: 'grammar/conjunctions/hmong-conjunctions-tiamsis.mp3',
          english: 'but; however',
          note: 'Introduces a contrast. “Tab sis” is another form you may encounter; use your course’s spelling consistently.'
        },
        {
          hmong: 'vim',
          audio: 'grammar/conjunctions/hmong-conjunctions-vim.mp3',
          english: 'because',
          note: 'Introduces a reason. “Vim hais tias” is a longer form; learn both in context.'
        },
        {
          hmong: 'lossis',
          audio: 'grammar/conjunctions/hmong-conjunctions-lossis.mp3',
          english: 'or',
          note: 'Offers an alternative. “Los yog” can also mean “or.”'
        },
        {
          hmong: 'yog hais tias',
          audio: 'grammar/conjunctions/hmong-conjunctions-yog-hais-tias.mp3',
          english: 'if',
          note: 'Introduces a condition. “Yog” alone can also introduce an if-clause, but it has other meanings too.'
        },
        {
          hmong: 'ces',
          audio: 'grammar/conjunctions/hmong-conjunctions-ces.mp3',
          english: 'then; so then',
          note: 'Often moves a sequence forward or introduces what follows: “Yog koj mus ces kuv tuaj.” — If you go, then I will come.'
        },
        {
          hmong: 'nrog',
          audio: 'grammar/conjunctions/hmong-conjunctions-nrog.mp3',
          english: 'with',
          note: 'Connects a companion with an action: “Kuv mus nrog nws.” — I go with him/her. This is not a conjunction like “and” or “but.”'
        },
        {
          hmong: 'rau',
          audio: 'grammar/conjunctions/hmong-conjunctions-rau.mp3',
          english: 'to; for',
          note: 'Often marks who an action is directed to or done for: “Kuv muab rau koj.” — I give (it) to you. “Rau” has other meanings too.'
        },
        {
          hmong: 'uas',
          audio: 'grammar/conjunctions/hmong-conjunctions-uas.mp3',
          english: 'who; which; that (relative marker)',
          note: 'Introduces a clause describing the noun before it: “cov khoom uas tsis ntsim txob” — foods that are not spicy.'
        },
      ],
    },
    {
      id: 'grammar-conjunctions-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
};
