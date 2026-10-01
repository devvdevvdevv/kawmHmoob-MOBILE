# A path unit for negation — "Not & Don't" (tsis / tsis txhob) (2026-09-26)

**The author:** "ADD ANOTHER path specifically for the tsis, don't."

## What was built

**1. A new word set, `negation` ("Not & Don't", 🚫)** in `src/data/vocabulary.js`,
in the Grammar Essentials theme. It is **free** (`FREE_CATEGORY_IDS`), because
it is grammar.

| word | gloss | example (already in the app) |
|---|---|---|
| tsis | not — right before the verb | *Kuv tsis mus vim hais tias kuv nyuaj siab.* (human) |
| tsis txhob | don't — always tsis txhob, never txhob tsis | *Tsis txhob mus ze tus tsov ntawd.* (human, author-corrected 09-16) |
| thov tsis txhob | please don't | *Thov tsis txhob chwv lub qhov txhab ntawd.* (AI) |
| tsis muaj | don't have; there isn't | *Kuv tsis muaj nyiaj.* (human) |
| tsis yog | is not; no | *Nws tsis yog kuv tus kwv.* (AI) |
| tsis tau | not yet (before a verb); can't (after a verb) | *Kuv xav tiamsis tsis tau.* (human) |
| tsis paub | don't know | *Kuv tsis paub lo lus ntawd.* (AI) |
| tsis nyiam | don't like | *Kuv tsis nyiam tus twm vim…* (human) |

**No new Hmong.** Every example is a sentence already in vocabulary.js, reused.
The three AI ones keep `source: 'ai'` and `unreviewed`.

**2. A new path unit, `u-negation`, "Not & Don't" / *Tsis thiab Tsis Txhob*,** at
**order 8**, right after Time Markers, because *tsis* sits in the same slot
before the verb. It is free, and every later unit moved down one (the old
orders are in `was` comments). There is no intro lesson: the Learn placeholders
`writing-negation` and `writing-tsis-txhob` are unshipped.

**3. Time Markers no longer teaches *tsis*.** `grammar-not` was removed from
`u-tense` (commented out), and the unit was retitled from "Time Markers & Not"
to **"Time Markers"**, so the word isn't taught twice. Removing a word from a
unit can only make it easier to complete, never undo a learner's progress.

## A sentence-builder gap this exposed, fixed

`allSentenceExercises()` removes duplicate sentences, and the **first entry in
data order claims each one**. The negation words reuse sentences that other
entries own (`animals-tiger`, `money-nyiaj`…), so `pathUnitExercises` could not
see them, and the unit had 4 sentences and **no Sentences step**.
`src/lib/sentenceBuilder.js` now adds a unit's own words' human examples
directly when the dedupe hid them, under the same length and AI rules.
**Result:** `u-negation` has **flashcards, quiz, sentences and reading**. Its
sentence drill is 4 human sentences plus 1 AI. This is a general fix; any future
unit that reuses sentences benefits.

## Kept in step

- The free core is now **units 1–13**. The paywall's "Free forever" line says
  "thirteen course units", and the `/path` info comment and the
  fundamentals-always-free memory were updated.
- The TODO unreviewed count was re-counted (+3).
- `check-path`: 21 units, 20 live, and only Some/Many/All is under 5 sentences
  (awaiting the author's verified batch). All check scripts pass. **Not seen on a
  device.**

## Open
- A **Learn lesson** for negation would give the unit an intro. It could be
  merged from the `writing-negation` / `writing-tsis-txhob` placeholders, which
  already hold the research. **Its prose needs a speaker.**
- A fluent read of the three AI examples.

---

## Update, same day: the tsis lesson (Learn → Grammar)

**The author:** "author a tsis lesson … in Hmong, we do not have a direct 'Yes' or
'No' word, instead, tsis is used to indicate not, or don't — so tsis ua would be
like a 'no', tsis xav, tsis yog, etc depending on the context. Whereas, yog may be
used as an indicator for 'yes'."

**`src/data/lessons/tsis-negation.js`, lesson `grammar-tsis-negation`,
"Tsis | No, Not & Don't"**, in the Grammar unit's "Actions and Time" group,
right after Tense Markers (the same slot before the verb).

- **The intro is built on the author's own framing:**
  1. There is no word for "yes" or "no".
  2. **Saying no is tsis + the verb**, chosen by context: *tsis ua*, *tsis xav*,
     *tsis yog*.
  3. **Saying yes is *yog*, or repeating the verb.**
  4. Tsis goes right before the verb.
  5. Don't is *tsis txhob*, never *txhob tsis*.
- **An examples step**, "Ways to say no — and yes": tsis yog, tsis ua, tsis xav,
  tsis muaj, tsis paub, tsis tau, yog, tsis txhob!
- **A quiz step** on the `negation` set (`vocab-negation`, free).
- **Examples:** the human sentences reused from the negation set, plus
  *"Koj puas yog Hmoob?"* (attested, in numbers-puas). **Only the two short
  answer lines ("Yog." / "Tsis yog.") in the question exchange were drafted**, and
  they are marked TODO-VERIFY.

**Wired:**
- **`u-negation`** now has `learnUnit: 'grammar'` and
  `introLesson: 'grammar-tsis-negation'`. The unit screen shows the intro, and
  "Read the full lesson" returns to the unit
  (`/learn/grammar/grammar-tsis-negation?fromUnit=u-negation`). Verified.
- **`questions-yes-no.js`** now carries a ✅ header. Its "answer with the verb"
  claim is **confirmed by the author**, not a draft.
- It supersedes the unshipped placeholders `writing-tsis-txhob` and
  `writing-negation`. Merge them here if they are ever revived.

**Checks:** there are no duplicate lesson or step ids, and path, refs and notes
checks pass. Lint is clean. **Not seen on a device.**
