# FUTURE — "fill the blank" drill: use the word you learned, in a sentence (2026-09-25)

**Status: idea only. Nothing is built.** The author asked for it to be written
down as a future implementation, "don't quote me on that". This note records the
idea as given, then what the app already has for it, and the open questions.

## The idea, as the author described it

Put the words a learner studied back into real sentences, and make them choose
the right one.

- **Conjunctions:** show a Hmong sentence with the conjunction blanked out:
  `Kuv mus ____ koj …`. The learner picks from bubbles: the right one (`ces`)
  mixed with wrong ones (`seb`, `txuas`). Or they type it.
- **Pronouns**, which "can get confusing": show *"We (two people) go to the
  store"*; the answer is **`Wb mus tom khw`**. *(Written "kwh" in the request;
  the dictionary has `khw`, store.)* The wrong options would be the other
  pronouns.
- **Scoring:** correct vs incorrect is counted, and **3 strikes** ends the run.
- **The point:** learners get better at the grammar core (pronouns, verbs,
  classifiers, conjunctions), the sets the path now puts first (see
  notes/2026-09-25-interrogatives-and-grammar-first-path.md).

It isn't a bad idea. It is a standard, well-proven exercise type (cloze /
fill-in-the-blank), and it tests something the current steps don't. Flashcards
test *do you know the word*. The sentence builder tests *can you order the
words*. This one tests *can you pick the right word in context*, and that is
exactly where pronouns (wb vs peb vs neb) and classifiers (tus vs lub) go wrong.

## What the app already has

Most of the parts exist. The new part is the screen.

| Need | Already exists |
|---|---|
| Sentences that contain the word | `exampleSentence` on every vocab entry |
| The English meaning to show | `exampleSentence.english` |
| Bubbles/chips UI | the sentence builder's chips (`app/words/sentences/[groupId].jsx`) |
| Type-it-in mode with tone feedback | `src/lib/typingDrill.js` already grades a typed word and names the tone error (`zos` for `zoo`) |
| Wrong options from the same set | the category's other words |
| Free vs Pro limits | `useDailyQuota` + the taste/full pattern from notes/2026-09-25-sentence-builder-full-sessions.md |
| A place in the course | path units have steps; this could be a sixth, or replace one |

### Readiness, measured 2026-09-25

A sentence is usable only if it actually contains its own word, since that is
what gets blanked.

| Set | Sentences containing their word | …of which human-written |
|---|---|---|
| pronouns | 9 / 9 | 5 |
| verbs | 28 / 28 | 23 |
| classifiers | 20 / 20 | 20 |
| conjunctions | 22 / 24 | 15 |
| question-words | 15 / 16 | 0 (all drafted by Claude) |

So the four core sets could run this on day one from existing content. For the
same reason the sentence builder has `INCLUDE_UNREVIEWED_AI`, it should probably
use human-written sentences only. The Questions set would then wait for review.

## ⚠️ The hard part: wrong options that are secretly right

This is the one real design problem. It is easy to get wrong silently.

A random wrong option from the same category is sometimes **also correct**:

- `vim` and `vim hais tias` both mean "because". Blank one and offer the other,
  and a learner who picks it is marked wrong for a right answer.
- `lossis` and `los yog` both mean "or".
- `tus` vs `lub` is usually one right answer, but a few nouns take more than one
  classifier.

So the wrong options can't just be "3 random words from the set". Options:

1. **Hand-picked confusable groups.** For example pronouns by number:
   `kuv/wb/peb`, `koj/neb/nej`, `nws/nkawd/lawv`. For pronouns the confusion
   *is* the lesson, so this is the best version. It is small data to write.
2. **An exclusion list** of known synonyms that must never appear together as
   options (`vim` ↔ `vim hais tias`, `lossis` ↔ `los yog`).
3. **A fluent speaker checks each generated question once** before it goes live.

(1) plus (2) is probably the right start: data, not cleverness.

## Other decisions for later

- **Two modes, or one?** The pronoun example is really *English meaning → pick
  the Hmong word*, with the English on screen. The conjunction example could run
  with or without the English. Showing the English is easier and fairer for
  beginners.
- **Bubbles vs typing.** Bubbles first; typing is harder and could be a later or
  Pro mode. Typing gets the tone-aware grading for free.
- **3 strikes.** Strikes end the run. What does that mean for path completion:
  must they finish without 3 strikes, or does any finished run count? The
  sentence builder counts any finished session; the quiz needs 70%. This
  exercise is closer to a quiz.
- **Blanking multi-word items:** `txawm … los`, `tsuas … xwb` (two blanks), and
  `vim hais tias` (one blank covering three words).
- **Free vs Pro:** reuse the sentence-builder rule, a short taste free and the
  full set for Pro.

## If it gets built

- The question generator belongs in a new `src/lib/clozeDrill.js`, with the
  confusable groups and exclusion list as data beside it.
- Add a check script in the style of `check-path.mjs` that fails if any
  generated question offers two correct answers.
- Start with **pronouns**: 9 words, small, and the author's own example of
  where learners get confused.
