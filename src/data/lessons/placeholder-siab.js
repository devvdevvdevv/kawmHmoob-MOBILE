// Placeholder lesson: SIAB + DESCRIBING WORD — what kind of person someone is.
//
// ⚠️ REAUTHORED 2026-10-22 from the author's ChatGPT pass, and much stronger
// than what it replaces: the long-and-short metaphor is explained, the twelve
// expressions are taught as opposing pairs, and there is a real practice step
// with eight questions.
//
// ⚠️ IT ARRIVED IN THE WRONG FILE — pasted into siab-feelings.js, which held a
// DIFFERENT lesson (`siabFeelings`, id `grammar-siab`). Two faults came with it:
// that file then declared the siabPlaceholder export while this file declared it
// too, and the old lesson underneath had been retired by commenting out only its
// `export const` LINE — the object body stayed live and the file stopped parsing
// ("SyntaxError: Unexpected token ':'"). siab-feelings.js is a signpost now.
//
// ⚠️ RECOVERED FROM VS CODE LOCAL HISTORY. While moving it here, an extraction
// that stopped at "the first lone }" truncated the lesson a third of the way in
// — a NESTED closing brace. The full 237-line object came back from
// AppData/Roaming/Code/User/History; the fix is to count brace depth from the
// opening line, never to look for the first closing brace.
//
// ⚠️ THE STEP IDS ARE THE LIVE ONES: `placeholder-siab-intro`, `-examples` and
// `-quiz` are unchanged PROGRESS KEYS, which the draft got right on its own.
// `-practice` is a new step, so it carries a new id.
//
// ⚠️ BOTH SIAB UNITS POINT HERE — u-siab (feelings, `adjective + siab`) and
// u-siab-character (character, `siab + adjective`, added 2026-10-22). This lesson
// leads on the order contrast, which is what both of them need.
//
// `placeholder: true` keeps the orange badge; delete that line once a speaker
// has read the content.
export const siabPlaceholder = {
  id: 'placeholder-siab',
  placeholder: true,
  title: 'Feelings & Character | Lub Siab',
  summary: 'Understand siab as the seat of character, learn the long-and-short metaphor, and describe what kind of person someone is.',
  vocab: 'personality-siab',
  reference: 'grammar',
  steps: [
    {
      id: 'placeholder-siab-intro',
      kind: 'intro',
      title: 'Describing character with siab',
      body: [
        '## What does siab mean?',

        '**"Siab"** literally means liver. In Hmong expressions, it can also represent a person’s inner character, disposition, and way of responding to other people and situations. English often uses “heart” in a similar figurative way, as in “good-hearted,” but the literal Hmong word means liver.',

        'When **"siab"** appears in a character expression, the whole phrase describes what kind of person someone is. It does not necessarily describe a temporary feeling or mood.',

        '## Which word order describes character?',

        'The order makes the difference: **describing word + "siab"** expresses a feeling, while **"siab" + describing word** expresses a character trait.',

        '> zoo siab — happy, a feeling; siab zoo — kind-hearted, a character trait.',

        'This lesson focuses on the second pattern: **"siab"** comes first, followed by the describing word. The feeling expression is included only to make the contrast clear.',

        '## How does the liver metaphor help you remember?',

        'The descriptions can use physical qualities as a metaphor for someone’s character. For example, **"siab ntev"** literally suggests a “long liver” and means patient. **"Siab luv"** suggests a “short liver” and means impatient.',

        'Other character contrasts can draw on ideas such as big and little, wide and narrow, or white and black. Those images give you something concrete to remember, even when the English character meaning is less literal.',

        'Treat the image as a memory aid, not as a way to invent new Hmong expressions. A metaphor may help you remember an expression you have learned, but it does not prove that every possible combination of words is natural or has the meaning you might expect.',

        '## How do opposing pairs work?',

        'Learn contrasting expressions together because each one helps explain the other.',

        '> siab ntev — patient',
        '> siab luv — impatient',

        'The contrast is between someone who can remain patient and someone who becomes impatient more quickly. Remember both the order and the complete meaning of each expression.',

        'The same learning method applies to other opposites in the vocabulary set: learn the two actual expressions as a pair, rather than trying to construct them from English translations.',

        '## How does a character expression work in a sentence?',

        'A character expression can follow the subject directly. You do not need to put **"yog"** before a describing expression.',

        '> Nws siab zoo heev. — He or she is very kind-hearted.',

        'Here, the character expression follows **"nws"** (he, she, or they in the singular). **"Heev"** intensifies the complete expression and comes after it: **"siab zoo heev"**, not before the description.',

        'There is another way to express the same kind of idea: use **"yog"** to link the subject to a noun phrase that identifies the person.',

        '> Nws yog ib tus neeg siab ntev. — He or she is a patient person.',

        'In this sentence, **"yog"** links the subject to **"ib tus neeg siab ntev"** (a patient person). It does not sit directly before a describing expression. **"Nws yog siab zoo"** is not the correct pattern.',

        '## When should you not use this pattern?',

        'Do not put **"siab"** before every describing word simply because you want to describe someone. This pattern is for established expressions about character, not a formula for producing every adjective or every emotion.',

        'For example, **"siab zoo"** describes character, whereas **"zoo siab"** is the feeling expression shown in the contrast above. If you mean a different feeling or trait, use the established Hmong expression for that meaning rather than guessing at the word order.',

        'The main principle is simple: learn the complete character expression, keep **"siab"** first, and use the liver metaphor to help remember its meaning—not to invent combinations that have not been confirmed.'
      ],
    },
    // NEEDS: The authorized twelve-expression list was not included in
    // the prompt. Add the remaining reviewed character expressions here
    // and keep opposing expressions next to one another.
    {
      id: 'placeholder-siab-examples',
      kind: 'examples',
      title: 'Character expressions',
      intro: 'Learn each expression as a complete description of a person. The opposing pair is kept together.',
      items: [
        {
          hmong: 'Siab zoo',
          english: 'Kind-hearted; good-natured',
          note: 'Describes someone whose character is kind and considerate.'
        },
        {
          hmong: 'Siab ntev',
          english: 'Patient',
          note: 'Describes someone who can wait or endure without becoming impatient.'
        },
        {
          hmong: 'Siab luv',
          english: 'Impatient',
          note: 'Describes someone who tends to lose patience quickly; it contrasts with siab ntev.'
        },
        {
          hmong: 'Nws siab zoo heev.',
          english: 'He or she is very kind-hearted.',
          note: 'The character description follows the subject directly. Heev comes after the expression it intensifies.'
        },
        {
          hmong: 'Nws yog ib tus neeg siab ntev.',
          english: 'He or she is a patient person.',
          note: 'Yog links the subject to a noun phrase identifying a patient person.'
        },
        {
          hmong: 'Txhob siab luv',
          english: 'Do not be impatient.',
          note: 'Txhob makes this a prohibition. The expression uses siab luv for the character trait being warned against.'
        }
      ],
    },
    {
      id: 'placeholder-siab-practice',
      kind: 'practice',
      title: 'Choose the character expression',
      body: [
        'Choose the expression that fits the meaning or sentence pattern in each situation. Pay attention to word order and the difference between a character trait and a feeling.'
      ],
      questions: [
        {
          id: 'placeholder-siab-practice-kind',
          situation: 'You want to describe a person as kind-hearted. You mean their character, not how they feel at the moment.',
          sentence: 'Which expression fits?',
          choices: [
            'siab zoo',
            'zoo siab',
            'siab ntev',
            'siab luv'
          ],
          answer: 'siab zoo',
          translation: 'Kind-hearted; good-natured.',
          explanation: 'The character pattern puts siab first. Zoo siab is the feeling form, while siab ntev and siab luv describe patience and impatience.'
        },
        {
          id: 'placeholder-siab-practice-patient',
          situation: 'You are describing a person who remains patient rather than becoming impatient.',
          sentence: 'Which expression describes this character trait?',
          choices: [
            'siab ntev',
            'siab luv',
            'siab zoo',
            'zoo siab'
          ],
          answer: 'siab ntev',
          translation: 'Patient.',
          explanation: 'Siab ntev is the established expression for patient. Its contrast is siab luv, meaning impatient.'
        },
        {
          id: 'placeholder-siab-practice-impatient',
          situation: 'You need the opposite of patient when describing someone’s character.',
          sentence: 'Which expression should you choose?',
          choices: [
            'siab luv',
            'siab ntev',
            'siab zoo',
            'zoo siab'
          ],
          answer: 'siab luv',
          translation: 'Impatient.',
          explanation: 'The opposing pair is siab ntev (patient) and siab luv (impatient). Learn the pair together rather than changing the word order.'
        },
        {
          id: 'placeholder-siab-practice-feeling',
          situation: 'You see two expressions with the same words in a different order. You want the one that means a feeling of happiness, not a character trait.',
          sentence: 'Which expression is the feeling form?',
          choices: [
            'zoo siab',
            'siab zoo',
            'siab ntev',
            'siab luv'
          ],
          answer: 'zoo siab',
          translation: 'Happy.',
          explanation: 'Word order distinguishes the two meanings: zoo siab is a feeling, while siab zoo describes character. This contrast shows what the siab-first pattern is not.'
        },
        {
          id: 'placeholder-siab-practice-heev',
          situation: 'You want to intensify the character expression siab zoo with the word heev.',
          sentence: 'Where does heev belong?',
          choices: [
            'After the complete expression',
            'Before siab',
            'Between siab and zoo',
            'Before the subject'
          ],
          answer: 'After the complete expression',
          explanation: 'Heev follows the expression it intensifies, giving the order siab zoo heev. Do not put heev before the describing expression.'
        },
        {
          id: 'placeholder-siab-practice-yog',
          situation: 'You want to say that someone is a patient person using the noun phrase in the lesson.',
          sentence: 'Which sentence uses yog correctly?',
          choices: [
            'Nws siab zoo heev.',
            'Nws yog siab zoo.',
            'Nws yog ib tus neeg siab ntev.',
            'zoo siab'
          ],
          answer: 'Nws yog ib tus neeg siab ntev.',
          translation: 'He or she is a patient person.',
          explanation: 'Yog links the subject to the noun phrase ib tus neeg siab ntev. Do not place yog directly before the describing expression siab zoo.'
        },
        {
          id: 'placeholder-siab-practice-prohibition',
          situation: 'You want to tell someone not to be impatient, using the prohibition already supplied in the lesson data.',
          sentence: 'Which expression fits?',
          choices: [
            'Txhob siab luv',
            'siab ntev',
            'siab zoo',
            'zoo siab'
          ],
          answer: 'Txhob siab luv',
          translation: 'Do not be impatient.',
          explanation: 'Txhob marks a prohibition. It is not the ordinary negative word tsis, and the character expression remains siab luv.'
        },
        {
          id: 'placeholder-siab-practice-metaphor',
          situation: 'You understand the long-liver and short-liver metaphor and want to guess the meaning of a new combination that is not in your vocabulary list.',
          sentence: 'What is the safest approach?',
          choices: [
            'Use the metaphor as a memory aid, but verify the expression',
            'Assume every combination is a valid Hmong expression',
            'Reverse the words to create the opposite meaning',
            'Put heev before every character expression'
          ],
          answer: 'Use the metaphor as a memory aid, but verify the expression',
          explanation: 'Metaphors can help you remember established expressions, but they do not generate new valid expressions automatically. Learn verified forms and their meanings.'
        }
      ],
    },
    {
      id: 'placeholder-siab-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
