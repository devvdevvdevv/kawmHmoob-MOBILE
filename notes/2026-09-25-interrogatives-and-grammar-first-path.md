# Interrogatives module + a grammar-first path (2026-09-25)

These are the author's two requests from the same message:

1. A module and dataset for interrogatives: dab tsi, li cas, vim li cas, twg,
   thaum twg, leej twg, "and any else".
2. Classifiers, pronouns, verbs and conjunctions are to be the primary sets the
   path pushes, and the plans should reflect that.

## 1. Interrogatives

**Dataset (`question-words` in vocabulary.js).** The set already held the six
words asked for, plus `qhov twg` and `pes tsawg`, all spaced (*dab tsi*,
*li cas*). The author typed some solid, but the app's spelling was kept. Nine
entries were added:

| headword | meaning |
|---|---|
| twg? | which? (after a classifier or noun) |
| lub twg? | which one — things |
| tus twg? | which one — people, animals |
| hnub twg? | which day? |
| puas | yes/no marker, before the verb |
| los tsis | …or not? |
| ua cas? | why? how come? |
| zoo li cas? | how is it? |
| npaum li cas? | how much? to what degree? |

⚠️ All 9 are `unreviewed` with `source: 'ai'` examples, drafted by Claude.
The sentence builder skips them until a speaker clears the `source`.

**Lesson (`grammar-question-words`).**
- It gained `vocab: 'question-words'`, which gives it the study handoff and the
  generated quiz.
- The intro teaches three patterns: the question word takes the answer's place;
  `puas` goes before the verb; `twg` follows a classifier.
- There are six more example rows and a quiz step.
- New prose is marked TODO-VERIFY. The intro uses only the `## ` and `> `
  prefixes, because IntroBody renders nothing else.

**Path unit `u-questions`**, "Questions / Cov Lus Nug". It has 16 words, all
live. *Lus nug* is attested in a story line.

## 2. Grammar-first path

The order was changed by editing `order` only, with each old value kept in a
comment. The ids are unchanged.

| # | unit | was |
|---|---|---|
| 1 | Greetings | 1 |
| 2 | You & Me (pronouns) | 2 |
| 3 | Core Verbs | 8 |
| 4 | Classifiers | 5 |
| 5 | **Joining Words** (new, `u-conjunctions`) | — |
| 6 | **Questions** (new) | — |
| 7 | Numbers | 3 |
| 8 | Family | 4 |
| 9 | Colors & Describing | 7 |
| 10 | Time & Days | 9 |
| 11 | Food & Drinks | 6 |
| 12 | Daily Life | 10 |

- **Conjunctions had no unit before.** It is now curated to 20 of 24 words; the
  words left out are listed in path.js. It is fully sentence-ready, recorded and
  reviewed. The Hmong title *Cov Lus Txuas* comes from the lesson title and
  inherits its TODO-VERIFY.
- **Greetings stays first.** It is tiny and free, and it is the first exchange.
- **Safe mid-course.** Unlocking is positional and progress keys on `unitId`,
  so nothing finished becomes unfinished.
- `check-path`: 12 units, 11 live. Food & Drinks is still 1 sentence short.

## ⚠️ Open — for the author

- ~~**`free` was not moved.**~~ **Resolved 2026-09-25:** units 1–6 are free (see the Pro-vocab note).
- A fluent read of the 9 new entries, the lesson's new prose, and *Cov Lus Nug*
  / *Cov Lus Txuas*.
- Only 1 of the 16 Questions words has audio.

---

## Update, same day: a dedicated Learn unit — "Asking Questions"

**The author:** "create a dedicated learning module for question words in the
learning page, and redirect it in the question words in the grammar tab".

**New Learn unit `questions`, "Asking Questions"** (`src/data/lessons.js`,
placed right after Grammar):

| # | lesson | id | status |
|---|---|---|---|
| 1 | Question Words | `grammar-question-words` | **moved** from Grammar, same id |
| 2 | Yes or No \| Puas | `questions-yes-no` | new: puas before the verb, answering with the verb, los tsis |
| 3 | Which One? \| Twg | `questions-which` | new: lub twg / tus twg / qhov twg / hnub twg / leej twg |

- **Moving the lesson keeps progress.** Progress keys on lesson and step ids,
  not the unit. Only the URL changed, to `/learn/questions/grammar-question-words`.
- **Grammar's last chapter** kept its id (`asking-and-joining`) and was retitled
  **"Joining Sentences"**. It now holds Conjunctions only. The old title, blurb
  and list are in a `Was:` comment.
- **The redirect: the Reference tab → Grammar → "Question Words" → "Learn this"**
  used to open the **How Much?** lesson in Numbers & Time. That was simply wrong:
  that lesson teaches pes tsawg and prices. It now opens the new unit's first
  lesson.
- **Path unit `u-questions`** now has `learnUnit: 'questions'`, so the Learn hub
  shows it beside its lessons. Its "Read the full lesson" link and the return
  to the path both still resolve (`pathIntro.js` finds a lesson's unit by
  searching).
- The new lessons carry `vocab: 'question-words'`, which gives them the study
  handoff. The quiz stays on lesson 1 only.

**Verified by bundling with esbuild:** plain Node can't load `lessons.js`
because of its extensionless imports. The unit lists 3 lessons, no lesson or
step id collides, the reference target resolves, the path intro href is
`/learn/questions/grammar-question-words?fromUnit=u-questions`, and the Learn
hub finds `u-questions`. Lint and all check scripts pass. **Not opened on a
device.**

⚠️ **Every line of the two new lessons is TODO-VERIFY**, drafted by Claude.
The examples reuse sentences already in `question-words` where possible. The
key claims to check are: "Hmong has no single word for yes: answer with the
verb", and "twg takes the classifier a number would".

The placeholder `writing-yes-no-questions` / `writing-question-words` files
(withdrawn Writing unit) overlap these lessons. `questions-yes-no.js` names the
overlap in its header (the placeholder files were not edited), and
they should be merged here if ever revived.
