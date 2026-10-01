# Flashcards: Mark Known stays put · Classifiers lesson: "most nouns take a classifier" (2026-09-25)

These are two small changes the author asked for back to back.

## 1. "Mark Known" no longer moves to the next card

**The ask:** "comment out the logic that makes the flashcards move forward if
pressing mark known".

- **`src/components/vocabulary/Flashcard.jsx`, `mark()`.** It used to call
  `onAdvance` 250 ms after **either** button. The original line is commented
  out with a restore hint, and the live line now skips `'known'`:
  `if (onAdvance && next !== 'known') setTimeout(onAdvance, 250)`
- **Mark Learning still advances.** The request named Known only. To stop
  Learning too, change the same line.
- **Nobody is stranded.** Every caller has its own way on: `app/words/session.jsx`
  (→ arrow), `app/review.jsx` (Skip →) and `app/path/[unitId]/flashcards.jsx`
  (Next). `VocabList` and the notebook have prev/next controls.
- **The session hint** said "Mark the card to advance, or skip it", which is no
  longer true for Known. It now reads "Mark the card, then tap → for the next
  one", with the old text in a `Was:` comment.

## 2. Classifiers: the rule a learner must not miss

**The ask:** add "an important text in learning for classifiers": in
grammatically correct Hmong, written and spoken, the majority of nouns have a
classifier defining them.

- **`src/data/lessons/noun-classifiers.js`**, in the intro step, right after the
  opening paragraph. That paragraph ("…when counting or pointing something out")
  made classifiers sound occasional, and it is kept as is.
- The new text, under a `## Important: most nouns come with a classifier`
  subheading. That is the strongest emphasis `IntroBody` renders.
  - In correct Hmong, most nouns carry a classifier. It is how a noun is
    normally said, not an extra for counting.
  - Leaving it out is a top beginner mistake.
  - Learn each noun *with* its classifier.
- **Examples:** *Tus aub · Lub tsev · Daim ntawv*. All three are already taught
  in the same lesson, so there is no new Hmong to review.
- **Shows in two places.** It appears in the Learn lesson, and on the
  **Classifiers path unit**, whose intro is this lesson's intro step
  (`introLesson: 'foundations-noun-classifiers'`, rendered by `pathIntro.js`).

Related: the new "Which One? | Twg" lesson makes the same point from the
question side. "Which" takes the classifier a number would (see
notes/2026-09-25-interrogatives-and-grammar-first-path.md).

## Checks

Lint is clean on both changed files, apart from one old apostrophe error in
`session.jsx` ("Today's words"), which is not from this change. Refs and notes
checks pass. **Neither change was tried on a device.**
