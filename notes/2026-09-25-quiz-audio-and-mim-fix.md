# Quizzes play the word's audio; "Nws npe hu ua Mim" (2026-09-25)

## Quiz audio

The quiz already drew a speaker button beside every multiple-choice prompt, but
`QuizEngine.jsx` passed it `audioSrc={null}`, so it was **always disabled**. The
data was there all along. Every dataset adapter in `quizzes.js` passes `audio`:
vocab and path quizzes pass the word's `audioFile`; alphabet and tone quizzes
pass their clips. `buildQuestions` dropped it.

Now `buildQuestions` carries `audio` and an `audioKey` onto each question, and
the prompt's `AudioButton` plays it at size `lg`. A word with no recording shows
the greyed button, as before.

⚠️ **English → Hmong holds the audio until answered.** The clip is always the
Hmong side. When the quiz is flipped (`direction === 'english-hmong'` on a
`reversible` quiz, the same test `orientDataset` uses), the Hmong is the
**answer**, so playing it first would read the answer aloud.
`audioRevealsAnswer` disables the button until the learner has picked.

Coverage measured today: **21 of 81 quizzes** have audio, covering **219 of
1,453 questions**. Matching questions are unchanged; they have no single prompt
to voice.

## "Nws hu ua Mim" → "Nws npe hu ua Mim"

Changed at the author's instruction everywhere the sentence appears:
- `vocabulary.js`: the `pronouns-he-she` (nws) example sentence
- `lessons/reading-mim.js`: the Mim reading
- `course.js`: the same reading's older copy

Each change has a `FIXED 2026-09-25 (author)` comment with the old text.
"Mim" stays capitalised because it is a name.

Note for a fluent check: elsewhere the app writes **`lub npe`** with its
classifier ("koj lub npe hu li cas?", "kuv lub npe hu ua…" in `introductions`).
The author's wording here is `npe` without `lub`.

## Checks
Vocabulary, refs and notes checks pass. `check-lesson-audio` confirms every
referenced clip exists. QuizEngine lint shows only pre-existing issues: one old
apostrophe error on line 302 and two warnings. **Not tried on a device.**
