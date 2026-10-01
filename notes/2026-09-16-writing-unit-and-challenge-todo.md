# The Writing unit (placeholders), and a TODO for better grammar challenges (2026-09-16)

Two halves. The first is scaffolding that exists now; the second is a plan with
no code behind it yet.

---

## 1. The Writing unit — eleven placeholders, not shipped

`src/data/lessons/writing-*.js` (11 files) + `writingUnit` in
`src/data/lessons.js`. Grammar aimed at **producing** Hmong, where the Grammar
unit explains how the language works.

Every lesson is structure only — no teaching content, each carrying
`placeholder: true`, each header naming what it should cover.

```
The Frame                  sentence order · pronouns
Asking and Denying         tsis/tsis txhob · negation · yes-no questions · question words
People, Actions and Time   possession + family · verb patterns · time and aspect
Joining It Up              connectors · discourse particles
```

⚠️ **It is NOT in `units`** — commented out beside the retired `readings`, the
same convention. A unit of eleven "not written yet" cards is worse than no unit.
Uncomment when the first few are real.

### ⚠️ Seven of the eleven overlap a lesson that already exists

This is the thing to deal with before writing a word. Checked against
`src/data/lessons/`:

| placeholder | already exists | what is actually new |
|---|---|---|
| `writing-pronouns` | `foundations-pronouns` | choosing/dropping a pronoun, `nws` ambiguity |
| `writing-question-words` | `grammar-question-words` | word ORDER, not the word list |
| `writing-possession-family` | `foundations-possessive-pronouns` | family terms as the nouns |
| `writing-verb-patterns` | `foundations-action-verbs` | patterns, not the verb list |
| `writing-time-aspect` | `foundations-tense-markers` **+ `numbers-time` + `time-explained`** | aspect (`lawm`, `tau`) only — if anything |
| `writing-connectors` | `grammar-conjunctions` | paragraph-level, not clause-level |
| `writing-negation` | — (but leans on `writing-tsis-txhob`) | existence/possession/completion |

Per lesson, decide: **narrow it to the writing angle, or delete it and extend
the existing lesson.** Shipping both leaves two lessons teaching one rule, free
to drift apart. `writing-time-aspect` is the weakest of the set — three lessons
already touch it, and it should be deleted rather than become a fourth if it
cannot be narrowed.

**The four with no counterpart are pure gain and the place to start:** sentence
order, `tsis` / `tsis txhob`, yes/no questions, discourse particles.

- Yes/no is a confirmed gap — `puas` appears nowhere in `grammar-question-words`.
- Discourse particles have no lesson *and* no vocabulary category (already noted
  2026-08-29), and carry the highest native-speaker dependency in the unit —
  particles are near-impossible to gloss from a dictionary.

⚠️ `writing-possession-family` is worth doing early for a second reason:
**Relatives is the worst example-sentence gap in the vocabulary** (26 of 31
missing), and writing that lesson is the natural moment to author them. See
[2026-09-16-vocab-depth-not-breadth-and-grammar-grouped].

---

## 2. TODO — better grammar challenges

Requested: English↔Hmong in both directions, block-building, typing, and timed
free writing. Nothing below is built. This is the shape, the order, and what
each one already has to build on.

### What exists today

| surface | what it does | direction |
|---|---|---|
| `components/quiz/QuizEngine.jsx` | multiple choice over `data/quizzes.js` | mostly HM→EN |
| `lib/sentenceBuilder.js` + `/words/sentences` | tap shuffled chips into order | EN prompt → HM output |
| `components/speak/*` + `lib/toneScore.js` | record, DTW tone score | spoken |

So: recognition and speaking are covered. **Production in writing is not** —
which is the gap the whole list below is aimed at.

### The five challenge types, easiest first

**1. HM → EN recognition.** Show a Hmong word/phrase, pick the English.
*Cheapest by far* — `QuizEngine` already does this shape; it mostly needs a
generator that pulls from `vocabulary.js` instead of hand-written `quizzes.js`,
and distractors chosen from the same category so they are not giveaways.

**2. EN → HM recall.** The same, reversed. Harder for the learner and the more
valuable half, because it is production. Same engine.
⚠️ Distractor quality matters far more in this direction — near-misses
(`zoo siab` vs `siab zoo`) are the whole lesson, and random wrong answers make
it trivial.

**3. Sentence block builder — EN → HM.** **This already exists** and is the
strongest piece in the app: `/words/sentences`. What is missing is not the
mechanic but the CONTENT — it draws exclusively from `exampleSentence`, and 568
of 877 words have none. *Do not rebuild this; feed it.*
Possible extension: run it in reverse (Hmong chips → build the English), which
is a different skill and needs no new data.

**4. Typing with selected letters.** Type the answer, but from a constrained
letter set rather than a free keyboard.
⚠️ The reason this is worth it in Hmong specifically: **the tone is the final
consonant**, so a learner typing `zoo` when they meant `zos` has made a tone
error, not a typo — and a constrained set can make that visible instead of
autocorrecting it away. Grading should treat a wrong final consonant as a *tone*
mistake and say so, reusing the tone names in `lib/hmongTone.js`.

**5. Timed free writing.** Write a sentence to a prompt, against a clock.
⚠️ **The hard part is not the timer, it is the grading** — there is no single
right answer, and nothing in the app can currently judge free Hmong text. Three
honest options, in order of cost:
   - self-assessment against a model answer (the Speak module already does this
     where the machine cannot judge — same precedent, same honesty)
   - keyword/structure check: did the sentence use the pattern being drilled?
   - full grading — needs a speaker or a model, and is a project

**Suggested order: 1 → 2 → 3-content → 4 → 5.** The first two share an engine,
the third needs no code at all (just sentences), and the last two are each real
projects.

### Cross-cutting decisions to make first

- **One challenge engine or five screens?** `speakLessons.js` proves the pattern
  worth copying here — a typed-step script rendered by a switch, so a new
  challenge type is one type + one branch rather than a new screen.
- **Where does scoring go?** Sentence builder points are deliberately
  session-local, and the app has two disconnected XP economies
  (`ProgressContext.xp` vs `lib/leveling.js`). Decide before adding a sixth
  scoring surface — see
  [2026-09-12-sentence-builder-scoring-and-words-hub].
- **Quota.** `quotaLimits.js` gates per feature; new challenge types need a
  decision on whether they share one budget or get their own.
- **Content, again.** Types 1–3 are all limited by the same thing: example
  sentences on words that already exist. A new challenge type over the same 309
  sentences is a new way to see the same content.

---

## Status

- 11 placeholder files, parse-checked, ids unique across all 142 in
  `src/data/lessons/`
- `writingUnit` defined, grouped, **commented out of `units`**
- ~~Nothing in section 2 is built~~ — **type 4 (typing with selected letters)
  shipped 2026-09-20** as `/words/typing`, taken out of the suggested order
  because it is the only one of the five that needs no new content. It also
  closes the quota question ("share one budget or get their own?") with: its
  own. Types 1, 2, 3-content and 5 remain. See
  [2026-09-20-tone-aware-typing-drill].

Related: [2026-09-20-tone-aware-typing-drill],
[2026-09-16-vocab-depth-not-breadth-and-grammar-grouped],
[2026-08-29-sentence-builder-barebones],
[2026-09-12-sentence-builder-scoring-and-words-hub].
