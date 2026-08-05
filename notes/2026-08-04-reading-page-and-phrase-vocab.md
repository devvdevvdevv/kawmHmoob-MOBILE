# Reading page scaffold + phrase/grammar vocab sections (2026-08-04)

## 1. Advanced Reading & Comprehension page (scaffold)

New `app/reading.jsx` (route `/reading`) — an ADVANCED reading + comprehension
surface, distinct from the Learn "Readings" unit (short beginner passages). Scaffold
only: a "coming soon" state + a non-interactive preview of the envisioned layout
(a passage card + a sample comprehension question). No real data yet.

Wired in:
- `app/words/index.jsx` — a "Reading & comprehension" DrillTile → `/reading`.
- `GlobalTabBar.jsx` — added `/reading` to the Words tab's `match` so the tab stays
  highlighted there.

To make it real later: a passages dataset `{ title, level, hmong, english?,
questions: [{ prompt, options, answer }] }` + a QuizEngine-style scored flow.

## 2. Phrase/grammar words → their own vocab sections (searchable)

Request: dedicated words like adjectives and phrases like "qhov twg" should be
browsable vocab AND appear in search.

Finding: most already ARE vocab categories — pronouns, verbs, tense-markers,
greetings, demonstratives, reciprocals, numbers, classifiers, and **adjectives**
(the `descriptions` category). The genuine gaps were **Question Words**,
**Politeness**, **Introductions**, **Daily Life**.

Added those 4 as vocab categories in `src/data/vocabulary.js` (with the standard
`{ id, hmongRPA, english, category, tags, audioFile }` shape; audio pending):
- `question-words` — dab tsi?, leej twg?, **qhov twg?**, thaum twg?, vim li cas?, li cas?, pes tsawg?
- `politeness` — ua tsaug, thov txim, thov, tsis ua li cas
- `introductions` — koj lub npe hu li cas?, kuv lub npe hu ua…, koj nyob qhov twg?, koj muaj pes tsawg xyoo?
- `daily-life` — koj noj mov tau?, kuv tshaib plab, kuv nqhis dej, kuv tsaug zog

Slotted into the vocab grid themes: `question-words` → "Grammar & Function Words",
the other three → "Everyday Speech".

Now they're browsable in Vocabulary AND (since GlobalSearch indexes vocab
categories) they show up in search — e.g. searching "qhov twg" returns it.

## 3. Search dedupe

`GlobalSearch` used to also index the old `course.js` grammar + everyday lists.
Those now fully overlap the vocab categories, so I removed those two loops (kept
readings) to avoid duplicate hits. Search = alphabet + all vocab (incl. the 4 new
sections) + readings.

## Verify
- Words → "Reading & comprehension" opens the scaffold page; Words tab stays lit.
- Vocabulary grid shows Question Words / Politeness / Introductions / Daily Life.
- Search (drawer or Reference tab) "qhov twg", "ua tsaug", etc. return results,
  each once.
