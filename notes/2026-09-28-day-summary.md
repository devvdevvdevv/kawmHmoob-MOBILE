# Day summary: everything changed on 2026-09-28

A one-page map of a long day.
- **Detail**, section by section, in the order it happened:
  [2026-09-28-verb-noun-and-nouns-by-purpose.md](2026-09-28-verb-noun-and-nouns-by-purpose.md).
- **How to repeat this kind of work:** [2026-09-28-process-playbook.md](2026-09-28-process-playbook.md).
- **The previous day:** [2026-09-27-day-summary.md](2026-09-27-day-summary.md).

The author tested on their phone ("phone looks good") and is preparing to ship.

## Path: 41 units, each with 7 or more sentences
**New units:**
- Verb + Noun
- How a Sentence Is Built (#5)
- Nouns by Purpose
- To Be: Nyob (split from Yog)
- So, Then & Therefore (decoy chips)
- Common Nouns (path-only)
- Body & Health
- Clothes & Wearing

**Order.** Fundamentals come first: Greetings, You & Me, Classifiers, Common Nouns, How a Sentence Is Built (#5),
Core Verbs, Verb + Noun, then Yog, Hu Ua and Nyob.

**Access:**
- **Free: the first 7 units** (`FREE_PATH_UNITS = 7`). Everything after needs Pro.
- **Always open: the first 4** (`ALWAYS_OPEN_UNITS`). The rest unlock in order.
- **Locked and Pro units** open a root-mounted modal (`PathLockModal`).
- **The gate** was verified by simulating a learner finishing units in order.

**Lessons:**
- Every unit has one. Draft lessons are flagged `placeholder: true`, with an orange badge that
  only admins see.
- 241 GPT sentences were reviewed and imported into `pathSentences.js`, plus 13 for the
  sentence unit.

## Monetization (it reverses the 09-25 "fundamentals free" rule)
- **Stories:** only Ntxawm Lub Xauv and Tus Miv are free. Zong Vang opens to its warning, then
  walls.
- **Speak:** only the tones (and the first guided lessons) are free. Phrases and grammar are Pro.
- **Word sets:** only the first 7 units' sets are free.
- **Sentence builder:** no unlimited grammar drills. A free learner gets a taste plus the daily
  limit.
- **Alphabet:** free.
- ⚠️ **iOS can't sell Pro yet:** the iOS RevenueCat key (`EXPO_PUBLIC_RC_API_KEY_IOS`) is unset.

## Grammar settled by the author
- **NO yog before a describing word.** Yog links to a noun: subject + yog + (quantifier) + noun +
  (describing word) + (heev).
- **"If"** = yog hais tias. **Or** = los yog.
- **yog li / yog li ntawd** = a soft "in that case". **thiaj (li)** = therefore. **ces** = then.
  **txawm** = a sudden so.
- **Names:** ask with hu alone, answer with hu ua. A name takes lub npe, never bare npe. Clan
  name = last name.
- **Quantifiers:** they take the number slot, before the classifier (except ib co and tej txhia).
  coob and tsawg after the noun are fine too.
- **Tense by tense** (the Back to the Future nod, now subtle). yuav is the soft future, mam li
  the firm one.
- **Word order:** koj thiab kuv = you and I. **Rau** = to / for, put, apply, and toward.
- **Particles:** the author's preferred list, with **na real** (preferred spellings noted).
- **Spellings:**
  - teb chaws loj is spaced; Tebchaws is joined only as a place name.
  - Exsias = Asian.
  - The joined day words.
  - pebcaug.
- **The alphabet:** "aa" is Green Hmong, so it's commented out.

## Dictionary
- **Added:** vam; the hate words; continents; Exsias; pem / nram / nqes; bills.
- **Bisang's full inventory** is split into **Primary Classifiers** and **Other Classifiers &
  Measures**.

## Sentence builder
- Verbs and nouns split into words; grammar words and calendar names stay whole.
- Punctuation is a hard boundary for chips.
- The Yog unit drills only yog sentences.
- Unreviewed sentences can fill a unit to 10.

## Screens
- **Reference → Grammar:** a "Start here" row of 5 boxes, each linking to its lesson.
- **Word families (alphabet):** redesigned with an interactive letter chooser and a letter card.
- **Onboarding:** shorter, no voice-dataset wording, all six questions kept.
- **About:** rewritten around preserving White Hmong. No Chinese Hmong, and no uncited figures.
- **"How Hmong Words Work":** rewritten (GPT draft, reviewed). It has six sections, an
  eight-tone table using the app's tone names, 10 words to break down and 4 practice questions.

## State at end of day
- All checks pass.
- About 1,019 unreviewed dictionary entries and roughly 254 unreviewed path sentences.
- **Waiting on the author:**
  - examples for the 9 new particles;
  - whether the About line "checked by a Hmong speaker" should soften.
