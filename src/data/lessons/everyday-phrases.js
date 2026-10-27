// Everyday phrases: greetings, farewells, and politeness.
//
// ⚠️ REAUTHORED 2026-10-22 from the author's ChatGPT pass, which produced a much
// stronger explanation than the original (one question per section, situational
// notes, and a real practice step). Three things were repaired on the way in:
//
//   1. IT WAS PASTED INTO daily-life.js, overwriting the Daily Life lesson
//      (`dailyLife`, id `conversational-daily-life`). That file is restored from
//      git HEAD; this is where the new lesson belongs.
//
//   2. THE STEP IDS WERE INVENTED. The draft used
//      `vocab-common-phrases-everyday-greetings-*`; its own note said the source
//      file had not been supplied, so the ids were inferred. The live ids —
//      `vocab-greetings-farewells-*` — are PROGRESS KEYS and are restored. The
//      lesson id itself (`vocab-common-phrases-everyday-greetings`) was correct.
//
//   3. THE GRAMMAR STEP WAS DROPPED. The previous lesson's
//      `vocab-greetings-farewells-grammar` step breaks five phrases into their
//      parts, which nothing in the new draft covers. It is kept, in place, before
//      the practice step.
//
// The practice step is new, so `vocab-greetings-farewells-practice` is a new id.

export const everydayPhrases = {
  id: 'vocab-common-phrases-everyday-greetings',
  title: 'Everyday Phrases | Greetings & Farewells',
  summary: 'Learn when to greet someone, ask how they are, say goodbye, thank someone, and apologise.',
  vocab: 'greetings',
  reference: 'grammar',
  steps: [
    {
      id: 'vocab-greetings-farewells-intro',
      kind: 'intro',
      title: 'How do everyday phrases work?',
      body: [
        '## What does “nyob zoo” actually mean?',

        'The phrase **"nyob zoo"** is used as a greeting. Its literal sense is “stay well,” which also explains how it can work as a farewell: it expresses a wish for someone’s well-being. The situation tells you whether you are opening a conversation or parting from someone.',

        '> Nyob zoo — Hello. (when meeting or greeting someone)',
        '> Nyob zoo — Stay well. (when parting, as a wish for the other person)',

        'Do not assume that one English translation always fits every situation. For **"nyob zoo"**, the context helps determine the intended meaning.',

        '## Is greeting someone the same as asking how they are?',

        '**"Nyob zoo"** can greet someone without asking a question. **"Koj puas nyob zoo?"** asks how the person is doing. When you say **"Nyob zoo, koj puas nyob zoo?"**, you greet the person and then ask about their well-being.',

        '> Nyob zoo, koj puas nyob zoo? — Hello, how are you?',
        '> Kuv nyob zoo. — I am well.',

        'The response **"kuv nyob zoo"** answers the question about how you are. Do not treat **"koj puas nyob zoo?"** as only another way to say hello: it is a question, and the other person can answer it.',

        'The phrase **"koj nyob zoo"** is also in the vocabulary set. It can express that someone is well or serve as a greeting-like expression, but it is not the same wording as the explicit question **"koj puas nyob zoo?"**.',

        '## When should you say “mus zoo” or “sib ntsib dua”?',

        'These two farewells express different ideas. **"Mus zoo"** means “go well” and is said to the person who is leaving. **"Sib ntsib dua"** means “see you again” and is useful when parting from someone you expect to meet again.',

        '> Mus zoo — Go well. (said to the person who is leaving)',
        '> Sib ntsib dua — See you again. (when saying goodbye)',

        'Pay attention to who is going. If the other person is leaving and you are staying, **"mus zoo"** is a way to wish them well as they go. If you are the one leaving, **"sib ntsib dua"** lets you say goodbye to the person who remains.',

        'Two other farewells add a slightly different focus. **"Saib xyuas"** means “take care,” and **"pom koj sai sai no"** means “see you soon.” Use them when you want to express care or expect to see the person again soon.',

        '## How do you thank someone and reply to thanks?',

        '**"Ua tsaug"** means “thank you.” Add **"ntau"** to make the thanks stronger: **"ua tsaug ntau"** means “thank you very much.”',

        '> Ua tsaug. — Thank you.',
        '> Ua tsaug ntau. — Thank you very much.',

        'When someone thanks you, **"tsis ua li cas"** can mean “you’re welcome” or “no worries.” **"Tsis muaj teeb meem"** means “no problem” and can reassure someone that something was not a problem.',

        '> Tsis ua li cas. — You’re welcome. / No worries.',
        '> Tsis muaj teeb meem. — No problem.',

        'Do not answer every expression of thanks with another thank-you. Choose a reply that fits the exchange: **"ua tsaug"** thanks the other person, while **"tsis ua li cas"** can acknowledge their thanks reassuringly.',

        '## How do you apologise or excuse yourself?',

        '**"Thov txim"** means “sorry” or “excuse me.” Use it to apologise when you have done something wrong or to excuse yourself in a situation that calls for an apology.',

        '> Thov txim. — Sorry. / Excuse me.',

        'The word **"thov"** is used to make a request; it is not a universal word that can be inserted wherever English uses “please.” The phrase **"Thov pab kuv os."** is a complete request meaning “Please help me.”',

        '> Thov pab kuv os. — Please help me.',

        'Learn **"thov txim"** as an apology or excuse and **"Thov pab kuv os"** as a request. The extra words determine what you are asking or expressing.',

        '## What do you say when meeting someone for the first time?',

        '**"Zoo siab ntsib koj"** means “nice to meet you.” It is appropriate when meeting someone, particularly when you are being introduced or meeting them for the first time.',

        '> Zoo siab ntsib koj. — Nice to meet you.',

        'This phrase is different from a general greeting. **"Nyob zoo"** opens the interaction, while **"zoo siab ntsib koj"** expresses that you are pleased to meet the person.',

        '## How do “take care” and “see you soon” differ?',

        '**"Saib xyuas"** expresses care for the other person as you part. **"Pom koj sai sai no"** focuses on seeing the person again soon. Both can be used when saying goodbye, but they communicate different intentions.',

        '> Saib xyuas. — Take care.',
        '> Pom koj sai sai no. — See you soon.',

        'Choose based on what you want to express. Use **"saib xyuas"** to wish someone well as they go; use **"pom koj sai sai no"** when you expect to see them again soon.',

        '## How does a short exchange fit together?',

        'A conversation often moves through several stages: greet the person, ask how they are, respond, and then part when it is time to go. Not every conversation needs every phrase, and a greeting does not require a full question-and-answer exchange.',

        '> Nyob zoo, koj puas nyob zoo? — Hello, how are you?',
        '> Kuv nyob zoo. — I am well.',
        '> Zoo siab ntsib koj. — Nice to meet you.',
        '> Sib ntsib dua. — See you again.',

        'Thanking and apologising fit into the same everyday conversation, but they have different jobs. **"Ua tsaug"** thanks someone, **"tsis ua li cas"** can reply to thanks, and **"thov txim"** apologises or excuses yourself.',

        'The main rule is to choose a phrase for the situation, not just for its English translation. Who is arriving, who is leaving, and what happened immediately before the phrase all help determine what sounds appropriate.'
      ],
    },
    {
      id: 'vocab-greetings-farewells-examples',
      kind: 'examples',
      title: 'Greetings, farewells, and polite replies',
      intro: 'Notice when each phrase is used and what it does in the conversation.',
      items: [
        {
          hmong: 'Nyob zoo',
          english: 'Hello; stay well.',
          note: 'Use as a greeting when meeting someone. In a parting context, it can express a wish for the other person to stay well.'
        },
        {
          hmong: 'Koj puas nyob zoo?',
          english: 'How are you?',
          note: 'Use when you want to ask about someone’s well-being, often after greeting them.'
        },
        {
          hmong: 'Kuv nyob zoo',
          english: 'I am well.',
          note: 'Use to answer a question about how you are doing.'
        },
        {
          hmong: 'Koj nyob zoo',
          english: 'You are well; hello to you.',
          note: 'This can describe the other person as well or function as a greeting-like expression. It is not the same wording as the explicit question.'
        },
        {
          hmong: 'Zoo siab ntsib koj',
          english: 'Nice to meet you.',
          note: 'Use when meeting someone, particularly when being introduced or meeting for the first time.'
        },
        {
          hmong: 'Mus zoo',
          english: 'Go well.',
          note: 'Say this to the person who is leaving to wish them well as they go.'
        },
        {
          hmong: 'Sib ntsib dua',
          english: 'See you again; goodbye.',
          note: 'Use when parting and expressing that you expect to meet again.'
        },
        {
          hmong: 'Saib xyuas',
          english: 'Take care.',
          note: 'Use at parting when you want to express care for the other person.'
        },
        {
          hmong: 'Pom koj sai sai no',
          english: 'See you soon.',
          note: 'Use when saying goodbye and expecting to see the person again soon.'
        },
        {
          hmong: 'Ua tsaug',
          english: 'Thank you.',
          note: 'Use to express thanks for help, a kindness, or something someone has done.'
        },
        {
          hmong: 'Ua tsaug ntau',
          english: 'Thank you very much.',
          note: 'Use when you want to express stronger or more emphatic thanks.'
        },
        {
          hmong: 'Tsis ua li cas',
          english: 'You’re welcome; no worries.',
          note: 'Use as a reassuring reply when someone thanks you.'
        },
        {
          hmong: 'Tsis muaj teeb meem',
          english: 'No problem.',
          note: 'Use to reassure someone that something is not a problem, including in response to thanks or an apology.'
        },
        {
          hmong: 'Thov txim',
          english: 'Sorry; excuse me.',
          note: 'Use to apologise or excuse yourself when the situation calls for it.'
        },
        {
          hmong: 'Thov pab kuv os.',
          english: 'Please help me.',
          note: 'Use when requesting help. The whole phrase makes the request; do not treat the request word as a universal equivalent of English “please.”'
        }
      ],
    },
    {
      id: 'vocab-greetings-farewells-conversation',
      kind: 'examples',
      title: 'Short conversations',
      intro: 'Read each exchange from beginning to end. The phrases do different jobs at different points in the conversation.',
      items: [
        {
          hmong: 'Nyob zoo, koj puas nyob zoo?\nKuv nyob zoo.\nZoo siab ntsib koj.\nSib ntsib dua.',
          english: 'Hello, how are you?\nI am well.\nNice to meet you.\nSee you again.',
          note: 'A short meeting: greet and ask, answer, acknowledge the meeting, then say goodbye.'
        },
        {
          hmong: 'Ua tsaug ntau.\nTsis ua li cas.',
          english: 'Thank you very much.\nYou’re welcome. / No worries.',
          note: 'A simple two-line exchange: one person expresses thanks, and the other responds.'
        }
      ],
    },
    {
      id: 'vocab-greetings-farewells-grammar',
      kind: 'examples',
      title: 'Grammar and sentence patterns',
      intro:
        'Understanding the parts of a phrase helps you build new sentences instead of memorizing greetings as isolated expressions.',

      items: [
        {
          hmong: 'Kuv nyob zoo.',
          english: 'I am well.',
          note:
            'Pattern: subject + predicate. “Kuv” is the subject, and “nyob zoo” describes the speaker’s well-being in this expression.'
        },

        {
          hmong: 'Koj nyob li cas?',
          english: 'How are you?',
          note:
            'Pattern: person + condition + question about how. “Li cas” asks about manner or condition in this construction.'
        },

        {
          hmong: 'Koj puas nyob zoo?',
          english: 'Are you well?',
          note:
            'Pattern: subject + puas + predicate. “Puas” commonly introduces a yes-or-no question. It is not interchangeable with every question word.'
        },

        {
          hmong: 'Koj ne?',
          english: 'And you?',
          note:
            'A context-dependent follow-up. “Ne” helps turn attention back to the other person or continue the topic; it does not have one fixed English equivalent in all situations.'
        },

        {
          hmong: 'Sib ntsib dua.',
          english: 'See you again.',
          note:
            'This is best learned as a conventional expression. Recognizing the parts can help you understand it, but not every Hmong phrase can be translated accurately by assigning one English word to each component.'
        }
      ],
    },
    {
      id: 'vocab-greetings-farewells-practice',
      kind: 'practice',
      title: 'Which phrase fits?',
      body: [
        'Choose the phrase that fits the situation. Focus on what is happening in the conversation, not just on memorising an English translation.'
      ],
      questions: [
        {
          id: 'phrases-practice-greeting',
          situation: 'You have just arrived and want to greet someone while asking how they are. What do you say?',
          sentence: 'Choose the phrase for this moment.',
          choices: [
            'Nyob zoo, koj puas nyob zoo?',
            'Sib ntsib dua',
            'Mus zoo',
            'Ua tsaug ntau'
          ],
          answer: 'Nyob zoo, koj puas nyob zoo?',
          translation: 'Hello, how are you?',
          explanation: 'A greeting plus a question about well-being fits this situation. **"Nyob zoo"** greets the person, and **"koj puas nyob zoo?"** asks how they are.'
        },
        {
          id: 'phrases-practice-reply',
          situation: 'Someone asks how you are. You are doing well. What is the appropriate reply?',
          sentence: 'Choose the phrase you would say.',
          choices: [
            'Kuv nyob zoo',
            'Koj nyob zoo',
            'Thov txim',
            'Saib xyuas'
          ],
          answer: 'Kuv nyob zoo',
          translation: 'I am well.',
          explanation: '**"Kuv nyob zoo"** answers the question from your own perspective. **"Koj nyob zoo"** refers to the other person, not yourself.'
        },
        {
          id: 'phrases-practice-meeting',
          situation: 'You are meeting someone for the first time and want to express that you are pleased to meet them. What do you say?',
          sentence: 'Choose the phrase for this moment.',
          choices: [
            'Zoo siab ntsib koj',
            'Pom koj sai sai no',
            'Tsis ua li cas',
            'Mus zoo'
          ],
          answer: 'Zoo siab ntsib koj',
          translation: 'Nice to meet you.',
          explanation: '**"Zoo siab ntsib koj"** expresses pleasure at meeting someone. **"Pom koj sai sai no"** is for parting when you expect to see the person soon.'
        },
        {
          id: 'phrases-practice-other-leaving',
          situation: 'The other person is leaving, and you want to wish them well as they go. Which phrase fits that role?',
          sentence: 'Choose what you say to the person who is leaving.',
          choices: [
            'Mus zoo',
            'Sib ntsib dua',
            'Kuv nyob zoo',
            'Ua tsaug'
          ],
          answer: 'Mus zoo',
          translation: 'Go well.',
          explanation: '**"Mus zoo"** is said to the person who is leaving. The important distinction is who is going: this phrase wishes the departing person well.'
        },
        {
          id: 'phrases-practice-you-leaving',
          situation: 'You are the one leaving and want to tell the people staying that you expect to meet them again. What do you say?',
          sentence: 'Choose the phrase for this moment.',
          choices: [
            'Sib ntsib dua',
            'Mus zoo',
            'Thov txim',
            'Koj puas nyob zoo?'
          ],
          answer: 'Sib ntsib dua',
          translation: 'See you again.',
          explanation: '**"Sib ntsib dua"** expresses the idea of meeting again. **"Mus zoo"** is directed to the person who is leaving, so it is not the best fit for this speaker’s role.'
        },
        {
          id: 'phrases-practice-thanks',
          situation: 'Someone has helped you a lot, and you want to thank them very much. What do you say?',
          sentence: 'Choose the phrase that expresses stronger thanks.',
          choices: [
            'Ua tsaug ntau',
            'Tsis ua li cas',
            'Thov txim',
            'Saib xyuas'
          ],
          answer: 'Ua tsaug ntau',
          translation: 'Thank you very much.',
          explanation: '**"Ua tsaug"** means “thank you,” while **"ua tsaug ntau"** makes the thanks stronger by adding **"ntau"** (“much” or “a lot”).'
        },
        {
          id: 'phrases-practice-receiving-thanks',
          situation: 'Someone thanks you, and you want to reassure them that it is nothing to worry about. What do you say?',
          sentence: 'Choose the reassuring reply.',
          choices: [
            'Tsis ua li cas',
            'Ua tsaug ntau',
            'Sib ntsib dua',
            'Thov txim'
          ],
          answer: 'Tsis ua li cas',
          translation: 'You’re welcome. / No worries.',
          explanation: '**"Tsis ua li cas"** can reassure the other person and serve as a reply to thanks. **"Ua tsaug ntau"** would thank them instead.'
        },
        {
          id: 'phrases-practice-apology',
          situation: 'You need to apologise or politely excuse yourself. Which phrase fits?',
          sentence: 'Choose the phrase for an apology or excuse.',
          choices: [
            'Thov txim',
            'Thov pab kuv os.',
            'Pom koj sai sai no',
            'Ua tsaug'
          ],
          answer: 'Thov txim',
          translation: 'Sorry. / Excuse me.',
          explanation: '**"Thov txim"** is the apology or excuse phrase. **"Thov pab kuv os"** makes a request for help instead.'
        }
      ],
    },
    {
      // TODO-VERIFY: Replace this inferred entry with the exact existing quiz
      // object from the live file to preserve its original step ID and title.
      id: 'vocab-greetings-farewells-quiz',
      kind: 'quiz',
      title: 'Learn the phrases',
    },
  ],
};
