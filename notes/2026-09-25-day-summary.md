# Day summary — everything changed 2026-09-24/25

A one-page map of two days' work. Each line points to the note with the detail.
Nothing here is new; it is an index.

## Content
- **Story vocabulary.** 42 words were added to the dictionary from the stories.
  Every word in the four non-Zong Vang stories now resolves in the reader.
  → [2026-09-25-story-vocab-scan.md](2026-09-25-story-vocab-scan.md)
- **Story fixes.**
  - A duplicate story was pasted inside a quiz; it is now commented out.
  - Three duplicate glossary entries were commented out.
  - The high- and medium-confidence grammar fixes were applied to the
    environment, xeev siab and miv stories.
  - The low-confidence flags are still open.
  → same note
- **Interrogatives.** 9 question words were added (twg, lub/tus/hnub twg, puas,
  los tsis, ua cas, zoo li cas, npaum li cas). The question-words lesson was
  expanded.
  → [2026-09-25-interrogatives-and-grammar-first-path.md](2026-09-25-interrogatives-and-grammar-first-path.md)

## Vocabulary page
- **Reorganised, and big sets split.** Fundamentals come first (one free Grammar
  Essentials theme), and Food & Kitchen is its own theme. Six big Pro sets are
  split into parts (Animals 1/2/3…). Part 1 is primary and the rest secondary,
  and theme pages show Primary / Secondary headings. New `check-splits.mjs`;
  how-to guide in learning/. 2026-09-26: Relatives (Cov Txheeb Ze) merged back into one
  set at the author's request, because kinship is one system.
  → [2026-09-25-vocab-reorganisation-and-splits.md](2026-09-25-vocab-reorganisation-and-splits.md)

- **45 standalone words from the stories.** Words that only resolved through a
  longer phrase now have their own entry (tswj = to govern, khoom, cua, nag,
  nyuaj…). Compound halves were deliberately left out.
  → [2026-09-25-story-vocab-scan.md](2026-09-25-story-vocab-scan.md)

- **Bisang (1993) paper put into the app.** The Classifiers lesson gained the four
  jobs of a classifier, the rule for dropping it, corrected tus/lub rows, and
  leej/txhais. A new free "Measure & Group Words" set has 13 words with the
  paper's own examples.
  → [2026-09-26-reference-bisang-1993-classifiers.md](2026-09-26-reference-bisang-1993-classifiers.md)

- **Vocabulary "back" keeps the theme.** A set or word opened from a theme page now
  has breadcrumbs through that theme (`?fromGroup=`, validated). Concept guide:
  `learning/concepts/navigation-return-context.md`.
  → [2026-09-26-vocab-back-to-theme.md](2026-09-26-vocab-back-to-theme.md)

- **The dictionary is visible to everyone.** A word's own page is free again: free
  accounts saw the upgrade card for ~500 story words (e.g. *tshawb*). Study decks stay
  Pro. Also added *Hmoob*, *mais*, *kg* and *da dej*: only the name *Mim* is now undefined
  anywhere tappable.
  → [2026-09-25-pro-vocab-sets-and-path-lesson-return.md](2026-09-25-pro-vocab-sets-and-path-lesson-return.md)

- **Countries cleaned up.** The names stand alone (the "Teb Chaws" prefix is gone), *teb
  chaws* is its own entry first in the set, and six repeats are commented out; the short
  forms' example sentences were kept on the plain names. **Tebchaws** is joined and
  capitalised (the author's ruling, saved to memory). Ethnicities are capitalised (Khej
  Dub, Qhab, Mev), and **Meskas** was added as a people word (American; white people).
  → [2026-09-26-countries-cleanup.md](2026-09-26-countries-cleanup.md)

- **Batch: "Willing, Permission & Promises".** 10 new words (a Pro set). 9 already existed
  and weren't duplicated. "ntxim siab" was imported as *txiav txim siab*; *faj seeb* is held
  (ceev faj exists). khib's example was fixed to *tsis txhob*, and *yuam*'s disturbing story
  example replaced.
  → [2026-09-26-will-permission-batch.md](2026-09-26-will-permission-batch.md)

## Learn
- **New Learn unit: Asking Questions.** Question Words (moved, same id), plus
  new Yes or No (puas) and Which One? (twg) lessons. The Reference Grammar
  "Question Words → Learn this" link now opens it; it used to open How Much?.
  → [2026-09-25-interrogatives-and-grammar-first-path.md](2026-09-25-interrogatives-and-grammar-first-path.md)

- **Classifiers lesson: an "Important" section.** Most nouns in correct Hmong,
  written or spoken, carry a classifier; learn each noun with its classifier.
  Added to the Noun Classifiers intro, which also shows on the Classifiers path unit.
  → [2026-09-25-flashcard-known-and-classifier-note.md](2026-09-25-flashcard-known-and-classifier-note.md)

## The path
- **Grammar-first order.** Greetings, You & Me, Core Verbs, Classifiers, then
  **Joining Words** (new) and **Questions** (new), then the topic units.
  → interrogatives note above
- **A Hmong name on every unit.** Most are Claude's drafts and need a fluent
  check. The dev "no Hmong name" label is gone.
  → [2026-09-25-path-trophy-and-unit-names.md](2026-09-25-path-trophy-and-unit-names.md)
- **Unit complete.** It now shows a trophy and "Completed". The "+10 XP …"
  line was removed; the XP is still awarded.
  → same note
- **Redesign reverted.** A trail redesign of the Paths UI was built and then
  reverted; the author preferred the original.
  → same note
- **Lessons return to the path.** A lesson opened from its path unit now
  returns to that unit.
  → [2026-09-25-pro-vocab-sets-and-path-lesson-return.md](2026-09-25-pro-vocab-sets-and-path-lesson-return.md)

- **Info (i) page for the path.** A 4-slide help page now covers /path and every
  unit screen (`src/data/pageInfo.js`). Its hand-written facts (steps, 70%,
  free units, 5/20) are listed in a comment beside it, to update with the code.

- **Seven more path units.** Six grammar units, free as units 7–12 (Time Markers & Not,
  This & That, Where Things Are, Some/Many/All, Each Other, Sentence Particles),
  and Lub Siab (Pro, unit 15). Topic units moved down; 19 units are live.
  Some/Many/All later got its sentence builder from a Perplexity batch: 15 kept
  as `moreExamples`, 7 held (kua ≠ apple, word order). **Then withdrawn by the
  author** (commented out): a speaker-verified batch from another model will
  replace it, so Some/Many/All has no Sentences step for now.
  → [2026-09-25-seven-more-path-units.md](2026-09-25-seven-more-path-units.md)

- **Admins open every path unit** (debugging). There is an "Admin access" box on any
  unit a learner couldn't open; path quizzes and path sentence sessions are ungated
  for admins too.
  → [2026-09-25-admin-path-access.md](2026-09-25-admin-path-access.md)

- **New unit 8, "Not & Don't" (tsis / tsis txhob).** Free, with a new `negation` set
  whose examples are all existing sentences. Time Markers drops *tsis*. Also fixed
  the sentence builder hiding shared sentences from a unit. Plus a Learn lesson,
  **"Tsis | No, Not & Don't"**, built on the author's framing (no yes/no word: tsis +
  verb = no, yog = yes). It is the unit's intro.
  → [2026-09-26-negation-path-unit.md](2026-09-26-negation-path-unit.md)

- **"Beginner path" → "Paths" everywhere,** plus a **Paths** card at the top of Learn.
  The /path header is now "Learning Paths", with the "X of Y done" count in colour.
  → [2026-09-26-paths-rename-and-learn-button.md](2026-09-26-paths-rename-and-learn-button.md)

- **Sentence builder:** a finished drill's back button now returns to the sentence-builder
  hub, not Words (path units still return to their unit).
  → [2026-09-25-sentence-builder-full-sessions.md](2026-09-25-sentence-builder-full-sessions.md)

## Paywall
- **Early access card on the paywall.** "Built by one developer, and growing." It
  also fixed claims that had gone stale: reading was sold as Pro but is free, and
  "three-quiz preview" is now 5. The info page and the locked-screen card were
  corrected to match.
  → [2026-09-25-paywall-early-access.md](2026-09-25-paywall-early-access.md)
- **Path sentence sessions are 5.** Finishing 5 completes a unit's Sentences
  step; the 20-sentence session is for the open drills only.
  → [2026-09-25-sentence-builder-full-sessions.md](2026-09-25-sentence-builder-full-sessions.md)
- **⚠️ The fundamentals are always free.** Path units 1–6, the grammar-core
  and greeting word sets, their quizzes, and every grammar drill have no wall,
  no See Pro and no daily cap. This replaced the narrower free list below.
  → [2026-09-25-pro-vocab-sets-and-path-lesson-return.md](2026-09-25-pro-vocab-sets-and-path-lesson-return.md)
- **Free sets.** Only greetings, pronouns, classifiers, verbs and descriptions
  are free. Every other set, its word screens and its quiz are Pro.
  → Pro vocab note above
- **Sentence builder: free sets only.** Free users drill only free-set
  sentences. Groups that can't fill a session are Pro.
  → same note
- **Sentence builder: session length.** Pro, and free path units, get full
  sessions of up to 20 sentences, and only a full session completes a path
  step. Free users get 5, then See Pro.
  → [2026-09-25-sentence-builder-full-sessions.md](2026-09-25-sentence-builder-full-sessions.md)

## Quizzes
- **Quiz audio.** Quizzes now play the prompt word's audio when it has any. On
  English → Hmong, the audio is held until the learner has answered.
  → [2026-09-25-quiz-audio-and-mim-fix.md](2026-09-25-quiz-audio-and-mim-fix.md)

## Fixes
- **Flashcards: Mark Known stays on the card.** The auto-advance after Known
  is commented out (`Flashcard.jsx`, restore hint inline). Mark Learning still
  advances; every flashcard screen has its own Next/Skip. The session hint
  text was updated to match.
  → [2026-09-25-flashcard-known-and-classifier-note.md](2026-09-25-flashcard-known-and-classifier-note.md)
- **Sentence builder minimum.** Every path unit now has at least 5 sentences,
  topped up from its own AI-drafted examples (12 of them, to review first).
  → [2026-09-25-sentence-builder-full-sessions.md](2026-09-25-sentence-builder-full-sessions.md)
- **Sentence builder background.** It is now cream edge to edge on every screen
  (a `background` prop on TabScreen).
  → [2026-09-25-sentence-builder-full-sessions.md](2026-09-25-sentence-builder-full-sessions.md)
- **Mim sentence.** "Nws hu ua Mim" is now "Nws npe hu ua Mim" in all 3 places
  (author's fix).
  → quiz-audio note above
- **Pricing.** $7.99/mo was confirmed as the starting price. There is no code
  change; the price is set in Play Console. The old $12.99 checklist item was
  marked superseded.
- **True Crime covers.** They were colourless (`bg-black-700` doesn't exist)
  and are now `bg-stone-900`.
  → trophy/unit-names note
- **Unreviewed count.** The count in TODO.md was re-counted to 736.
  → [TODO.md](TODO.md)
- **Placeholder item.** TODO.md's stale "nine placeholder stories" item was
  superseded.
  → TODO.md

## Reference and plans
- **Learning guide: notebook quizzes (to build yourself).** A quiz made only from saved
  words. It covers the design choice, six steps, the too-few-words and
  easy-distractor problems, and exercises.
  → `learning/feature-logic/notebook-quiz-guide.md`
- **Planned stories (the author is writing them):** two more true crime and one
  about the Hmong bobtail dog. There is a checklist for adding each one.
  → [2026-09-25-planned-stories.md](2026-09-25-planned-stories.md)
- **Tap-to-define in the path Reading step: BUILT.** Reuses the story
  reader's lookup and sheet via three shared files, and adds a Save button
  (stories get Save too). 1,081 of 1,096 path-reading words resolve.
  2026-09-26: the sheet is capped at 60% and scrolls, has a ✕, and Close is always
  visible. The buttons are redrawn in resolved colours (they were invisible inside the
  Modal) and swapped: Save, then Open in dictionary, then Close. The path reading's Hmong
  lines now use the app's reading font (font-serif / Nunito Bold), matching stories and
  flashcards.
  → [2026-09-25-GUIDE-path-reading-tap-to-define.md](2026-09-25-GUIDE-path-reading-tap-to-define.md)
- **Vocab-set coverage snapshot.** Which sets have examples, audio and review.
  → [2026-09-25-vocab-set-coverage.md](2026-09-25-vocab-set-coverage.md)
- **FUTURE: fill-the-blank drill.** Moved to learning/, not notes.
  → `learning/feature-logic/fill-the-blank-drill-guide.md`

## ⚠️ Still open across all of it
1. **Nothing today was tested on a device.** Each note lists what to try.
2. **A fluent read** of: the drafted unit names, the 9 question words, the
   applied story fixes, and the question-words lesson prose.
3. **Decisions:**
   - "vocab" was read as **verbs**. Should colors, conjunctions or yog-to-be be
     free?
   - Should the free path units move (the wall is now at Core Verbs)?
   - The Lub Xeev Siab story's level.
