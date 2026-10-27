// Placeholder lesson: SENTENCE PARTICLES — os, ne, nawb, and the two that carry
// a meaning of their own (xwb, thiab).
//
// ⚠️ `placeholder: true` shows the orange "Placeholder" badge on the lesson card,
// the unit's lesson preview and the lesson screen. Delete that line when this
// becomes a full lesson.
//
// ⚠️ THE IDS ARE PROGRESS KEYS. `placeholder-particles` and its step ids are what
// `completedSteps` and `quizScores` are stored against, and path.js points at the
// lesson id — so titles and bodies can be rewritten freely, but renaming an id
// silently resets anyone who has worked through this unit.
//
// ⚠️ A BODY IS AN ARRAY OF STRINGS, ONE PER PARAGRAPH — 2026-10-22. The author's
// draft arrived as a single quoted string holding the whole lesson, which a
// single-quoted JS string cannot do: it broke at the first newline with
// "SyntaxError: Invalid or unexpected token". Same as placeholder-location.js the
// day before. The text below is that draft, split into entries IntroBody renders.
//
// ⚠️ ONE TYPO FIXED, AND IT WAS NOT HARMLESS: the draft read "**Thaib** often
// means 'and'". `Thaib` is Thai (the people, the language, Thailand); the word
// meant here is `thiab`, which the section heading, the example sentence and the
// paragraph after it all spell correctly. Left as written it would have taught
// that "Thaib means and".
//
// ⚠️ THE MARKDOWN TABLE BECAME EXAMPLE LINES. IntroBody has no table renderer, so
// the five-row "Compare the two kinds" grid is one '> ' line per word, keeping
// both of its columns.
//
// ⚠️ APOSTROPHES ARE CURLY (’). A straight one would close the JS string.

export const particlesPlaceholder = {
  id: 'placeholder-particles',
  placeholder: true,
  title: 'Sentence Particles | Os, Ne, Nawb',
  summary: 'Learn how small words make Hmong conversation sound natural, and how some add meanings like “only” and “too.”',
  vocab: 'discourse-particles',
  steps: [
    {
      id: 'placeholder-particles-intro',
      kind: 'intro',
      title: 'Small words that shape a sentence',
      body: [
        '## What is a sentence particle?',

        'A particle is a small word that helps show how a sentence should be understood.',

        'In Hmong, you will often hear these words at the END of a sentence. They can make you sound warmer, bring the other person into the conversation, or signal that you are wrapping up what you are saying.',

        '**The easiest thing to remember:** these words do not always have one exact English translation. Pay attention to the situation and how the sentence feels.',

        '## Here are some of the most common sentence particles you will hear in Hmong conversation. Some of them mainly shape the tone, while others carry a meaning of their own.',



        '## 1. **"Os"** — adds warmth',

        '**"Os"** can make something sound gentler, warmer, or more natural in conversation.',

        '> Nyob zoo os. — Hello!',

        '> Ua tsaug rau koj os. — Thank you.',

        'The basic meaning is still “hello” or “thank you.” **"Os"** adds a conversational feeling.',

        '**Think:** the message is the same, but the tone feels warmer.',

        '## 2. **"Ne"** — brings the conversation back to someone',

        '**"Ne"** can be used when asking about someone or bringing the conversation back to them.',

        '> Koj ne? — And you? / What about you?',

        '> Koj nyob li cas ne? — And how are you?',

        'Imagine someone asks how you are. After you answer, you can ask **"Koj ne?"** to turn the question back to them.',

        '**Think:** “What about you?”',

        '**"Ne"** can do other jobs in Hmong too, so do not assume it always means “and you.” Its meaning depends on the sentence and conversation.',

        '## 3. **"Nawb"** — often used when addressing the listener',

        '**"Nawb"** often appears in friendly conversation, including thanks and goodbyes. It can help a statement feel directed toward the listener rather than sounding like a bare statement.',

        '> Ua tsaug ntau kawg nawb. — Thank you so much.',

        'The English translation does not show every feeling that **"nawb"** adds. You learn how it sounds by hearing it used in real conversations.',

        '**Think:** pay attention to the relationship, situation, and tone—not just the English translation.',

        '## 4. Not every small word does the same job',

        'Some small words add a more direct meaning instead of mainly shaping the tone.',

        '### **"Xwb"** — only / just',

        '**"Xwb"** limits what you are talking about. It tells the listener that it is only that thing or action, and not something more.',

        '> Kuv noj mov xwb. — I ate, that’s all.',

        'Here, **"xwb"** gives the idea of “only” or “that’s all.” It does not, by itself, mean that the action happened just a moment ago.',

        '### **"Thiab"** — and / also / too',

        // ⚠️ "Thaib" in the draft — see the typo note at the top of this file.
        '**"Thiab"** often means “and.” When used to add something to what was already said, it can mean “also” or “too.”',

        '> Kuv nyiam koj thiab. — I like you too.',

        'The word **"thiab"** adds the meaning “too.” It is doing a different job from **"os"**, **"ne"**, or **"nawb"**.',

        '## 5. Compare the two kinds',

        '> os — adds warmth or softens the tone. Remember it as: how the sentence feels.',

        '> ne — often brings the conversation back to someone or something. Remember it as: “What about…?”',

        '> nawb — often addresses the listener; common in thanks and goodbyes. Remember it as: listen to the situation.',

        '> xwb — limits the meaning. Remember it as: “only / that’s all”.',

        '> thiab — connects things or adds something. Remember it as: “and / too”.',

        '## The one thing to remember',

        '**"Os"**, **"ne"**, and **"nawb"** often help show how you are speaking to someone.',

        '**"Xwb"** and **"thiab"** can add a clearer meaning, such as “only” or “too.”',

        'Do not try to force every particle into one English word. Learn the Hmong phrase, notice when people use it, and listen to the tone and context.',
      ],
    },
    {
      id: 'placeholder-particles-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
