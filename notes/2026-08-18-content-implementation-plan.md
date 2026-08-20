# KawmHmoob content implementation plan (2026-08-18)

The content roadmap — what gets built, in what order, and the quality bar for each.
This is the CONTENT plan; engineering notes live in the other files in `notes/`.

KawmHmoob teaches users to **read, write, speak, and comprehend** Hmong, and doubles
as a **library** for looking up Hmong words. Ships as both a web app and a mobile app.

---

## Module map

Four primary modules:

| Module | Owns |
|---|---|
| **Learn** | Hmong grammar concepts |
| **Speak** | Pronunciation + speaking comprehension |
| **Words** | Vocabulary building (Reading + Writing sub-modules) |
| **Reference** | Alphabet and foundational material |

Plus two cross-cutting features:

- **Notebook** — users save any word they're interested in for later review.
- **Dictionary** — near-complete coverage of every Hmong word in the app; each entry
  explains the word, its usage, and pronunciation.

---

## Speak module

Modeled on **Natulang**. Lessons are organized around **real-life scenarios** so users
build everyday comprehension, not isolated vocabulary.

### Principles
- Speak short, real-life phrases and sentences **aloud**.
- Progressive sentence-building.
- Immediate speech-recognition feedback.
- Spaced repetition.
- **Immersion-style acquisition is essential.**

### Targets
- **20+ lessons** for initial release.
- **10–15 minutes** per lesson, max.
- **5–15 new words** per lesson, plus relevant sentences/phrases.
- Course arc runs beginner → intermediate → full conversational comprehension.

### Lesson flow
1. User hears a phrase from a **native speaker**.
2. Phrase is broken down word-by-word, then reassembled as a full sentence.
3. User records themselves replicating the native speaker.
4. Pronunciation is rated via speech recognition.
5. User is prompted to produce phrases/sentences in the target category.
6. New material is **quickly mixed with previously learned material**, or expanded
   into longer/more complex sentences.
7. Correct → advance. Incorrect → correction, repetition, or hint.
8. Each lesson **ends with a short dialogue** reusing the new material — doubles as a
   mini-test and a practice conversation.

### Detailed lesson structure
1. Introduce the phrase (what it encapsulates / situational context).
2. Introduce individual words (English vs. Hmong + definition).
3. User practices saying the word.
4. Introduce more words, same pattern.
5. Combine words into a phrase.
6. Extend the same logic into full sentences.
7. Repeat throughout the lesson.

### ⚠️ Speech recognition is the known risk
Hmong is a **lower-resource language for ASR**. Accuracy will vary, especially on
**tones** and **non-native speech**. Required graceful fallbacks so technical limits
never become user frustration:

- "Try again" retry path
- Phonetic hints
- **Self-assessment** option on harder items
- Skip, or mark for later review

---

## Words module

**Baseline:** the plan states 500+ words currently in the app, grouped by context
(family words, nouns, classifiers, …).
**Goal:** ~**1,500 words** total.

> **Measured 2026-08-18 (corrected):** `src/data/vocabulary.js` holds **479 words**
> across 38 categories, so the 500+ figure was about right. (An earlier count of ~368
> was wrong — it grepped `hmong:`, which is the key inside `exampleSentence`, not the
> word key. The word key is `hmongRPA:`.)
>
> **Remaining to reach 1,500: ~1,021 new words.**

### Reading (sub-module)
- Articles and short stories, followed by **comprehension quizzes**.
- **Any word is tappable** for its definition — vocabulary expansion in context.
- Tapped words can be **saved straight to the Notebook**.
- Initial scope: ~**5 stories**, sourced mostly from **Hmong Times**.

### Writing (sub-module)
Teaches proper Hmong sentence construction. Tightly coupled to **Learn**: every new
grammar concept gets a matching writing exercise.

- **10+ lessons** on grammar topics: sentence structure, adjectives, nouns,
  discourse particles, `yog`.
- Plus generic, unique, **randomized sentence-writing practice** so users articulate
  their own ideas.

### Learn ↔ Speak ↔ Writing integration
Grammar from **Learn** is deliberately **recycled** into Speak lessons and Writing
exercises — building reinforcement loops across conscious study, spoken production,
and written output. This is the design's backbone, not a nice-to-have.

---

## Dictionary

Every new word added to the app gets a full entry:

- Definition
- Explanation of use
- **Example sentence**
- **Audio pronunciation** — accounting for dialect, tone, and user age preference
  where applicable

---

## Dialect & pronunciation policy

Hmong has real dialectal variation (primarily **White Hmong** and **Green/Mong Leng**,
plus tone and pronunciation differences). Policy to be set **early**:

- **DECIDED (2026-08-18): the default dialect is WHITE HMONG (Hmoob Dawb).**
  Primary audio and example sentences all follow it.
  Already consistent with the code: `dialectPreference: 'white'` is the default in
  `AuthContext.jsx`, `RegisterForm.jsx`, and the Supabase `dialect_preference`
  column. Nothing to change in the app — this just makes the CONTENT rule explicit,
  and unblocks bulk native-speaker recording.
- Users can select a preferred dialect where feasible.
- Speech recognition and pronunciation feedback accommodate reasonable variation.

---

## Assessment & progression

- Simple **mastery thresholds** within lessons and modules.
- **Spaced repetition scheduled ACROSS modules**, not just within a lesson.
- Light **placement / check-in quizzes** so the app can recommend what to study next.
- Progress indicators showing beginner → intermediate → conversational.

---

## Content quality pipeline

One consistent process for all new content, so it stays good as it scales:

1. **Native-speaker audio** for every target phrase and dictionary entry.
2. Natural **example sentences**.
3. **Difficulty leveling** of vocabulary and lessons.
4. Structured **review and editing** before release.

To be documented and followed across the whole expansion: ~1,500 words, 20+ Speak
lessons, Reading materials, Writing exercises, Dictionary entries.

---

## Roadmap

### Phase 1 — Core foundation
- [ ] Expand core vocabulary significantly
- [ ] Solid Dictionary coverage for existing + new words
- [ ] First **10 Speak lessons** with full speech-recognition flow **and fallbacks**

### Phase 2 — Comprehension & expansion
- [ ] Launch **Reading** (articles/short stories + comprehension quizzes + tappable
      definitions)
- [ ] Complete remaining Speak lessons → **20 total**

### Phase 3 — Production & depth
- [ ] Launch **Writing** (grammar-linked lessons + randomized sentence practice)
- [ ] Deepen **Learn** grammar; strengthen cross-module recycling of structures

Phasing is deliberate: a strong, usable core before layering on depth.

---

## Open questions

_(Default dialect: RESOLVED 2026-08-18 → White Hmong.)_
_(Word baseline: RESOLVED 2026-08-18 → 479 words. See Words module.)_

- **Speak lesson count** — `src/data/speak.js` currently has 22 `id:` matches; confirm
  how many are real, complete lessons vs. stubs, against the 20-lesson target.
