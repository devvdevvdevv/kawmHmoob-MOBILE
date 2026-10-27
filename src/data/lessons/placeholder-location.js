// Placeholder lesson: WHERE THINGS ARE — hauv, saum, hauv qab, nraum, ze, deb.
//
// ⚠️ `placeholder: true` shows the orange "Placeholder" badge on the lesson card,
// the unit's lesson preview and the lesson screen. Delete that line when this
// becomes a full lesson.
//
// ⚠️ THE IDS ARE PROGRESS KEYS. `placeholder-location` and its step ids are what
// `completedSteps` and `quizScores` are stored against, and `u-locations` points
// at the lesson id from path.js — so titles and bodies can be rewritten freely,
// but renaming an id silently resets anyone who has worked through this unit.
//
// ⚠️ A BODY IS AN ARRAY OF STRINGS, ONE PER PARAGRAPH — 2026-10-21. The author's
// draft arrived as a single quoted string holding the whole lesson, which a
// single-quoted JS string cannot do: it broke at the first newline with
// "SyntaxError: Invalid or unexpected token". The text below is that draft,
// unchanged in substance, split into entries IntroBody can render:
//
//   '## Heading'   a subheading        '### Heading'  a sub-subheading
//   '> line'       an example line     '---'          a divider
//   anything else  a paragraph
//
// ⚠️ THE MARKDOWN TABLE BECAME EXAMPLE LINES. IntroBody has no table renderer, so
// the eight-row "Quick recap" grid is now one '> ' line per word. The content
// survives; the grid does not.
//
// ⚠️ HMONG IN THE ENGLISH IS BOLDED AND QUOTED — **"nyob"**, not **nyob** — which
// is the house style set across the lessons on 2026-10-20 ("if there is a hmong
// word/phrase within the english explainations, please bold it and add a "" to
// convey distinguishment"). `rich()` renders it.

export const locationPlaceholder = {
  id: 'placeholder-location',
  placeholder: true,
  title: 'Where Things Are | Hauv, Saum, Hauv Qab',
  summary: 'Learn how to say where something is: inside, on top, underneath, outside, near and far.',
  vocab: 'locations-prepositions',
  steps: [
    {
      id: 'placeholder-location-intro',
      kind: 'intro',
      title: 'Saying where something is',
      body: [
        '## The easy rule',

        'To say where someone or something is, use **"nyob"** and a word that tells you the location.',

        'Think of it like this:',

        '- **"nyob"** = is located / is somewhere',

        '- **"hauv"** = inside',

        '- **"saum"** = on top',

        '- **"hauv qab"** = underneath',

        'The location word comes BEFORE the place or thing that follows it.',

        '> Phau ntawv nyob saum lub rooj. — The book is on the table.',

        'Break it down:',

        '- **"phau ntawv"** = book',

        '- **"nyob"** = is located',

        '- **"saum lub rooj"** = on the table',

        '## 1. Inside — **"hauv"**',

        'Use **"hauv"** when something is inside a place.',

        '> Nws nyob hauv tsev. — He or she is inside the house.',

        '> Kuv nyob hauv lub tsev. — I am inside the house.',

        'Remember: **"hauv"** + place means inside that place.',

        '## 2. On top — **"saum"**',

        'Use **"saum"** for something on top of another thing.',

        '> Phau ntawv nyob saum lub rooj. — The book is on the table.',

        '- **"saum"** = on top of',

        '- **"lub rooj"** = the table',

        'Remember: **"saum"** + thing tells you what something is on.',

        '## 3. Underneath — **"hauv qab"**',

        'Use **"hauv qab"** to say something is underneath another thing.',

        '> Lawv nyob hauv qab tsob ntoo. — They are under the tree.',

        '- **"hauv qab"** = underneath',

        '- **"tsob ntoo"** = tree',

        'Remember: **"hauv qab"** + thing tells you what something is under.',

        '## 4. Outside — **"nraum"**',

        'Use **"nraum"** to talk about being outside a place.',

        '> Nws zaum nraum lub tsev. — He or she sits outside the house.',

        '- **"nws"** = he, she, or they (singular)',

        '- **"zaum"** = sit / sits',

        '- **"nraum lub tsev"** = outside the house',

        '## 5. Near and far',

        'These words tell you how close or far away something is.',

        '- **"ze"** = near',

        '- **"deb"** = far',

        '- **"heev"** = very, when used to intensify a description',

        '> Nej nyob ze kuv lub tsev. — You all live near my house.',

        '> Tus aub nyob deb heev. — The dog is very far away.',

        'Remember:',

        '- **"ze kuv lub tsev"** = near my house',

        '- **"deb heev"** = very far away',

        '## 6. Up and down — **"pem"** and **"nram"**',

        'These words can point to an area or direction higher or lower down.',

        '- **"pem"** = up / uphill / above',

        '- **"nram"** = down / downhill / below',

        'The exact meaning depends on the place and context, so learn these with example sentences as you encounter them.',

        '## Quick recap',

        '> hauv — inside',

        '> saum — on top of',

        '> hauv qab — underneath',

        '> nraum — outside',

        '> ze — near',

        '> deb — far',

        '> pem — up / uphill / above',

        '> nram — down / downhill / below',

        '**The big idea:** the location word tells you where to look, and the place after it tells you where something is in relation to.',
      ],
    },
    {
      id: 'placeholder-location-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
