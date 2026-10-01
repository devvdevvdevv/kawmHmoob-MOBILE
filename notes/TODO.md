# TODO — what is still open

⚠️ **This file is deliberately not dated, and it is the only one in `notes/`
that is not.** Every other note records what happened on a day and is then
immutable — that is what makes them trustworthy to read back. A to-do list is
the opposite: it is only useful if it is current. Dating it would produce a
`2026-09-09-todo.md` beside a `2026-10-02-todo.md` with no way to tell which one
is live, and both would be believed.

`build-notes-index.mjs` pins undated files to the top of `notes/README.md` as
thread docs, so this sits above the dated notes rather than being buried by
them.

**Edit this file in place. Do not date it, do not copy it, do not archive it.**

Verified against the code on 2026-09-09 — every count below was read from the
data, not remembered.

⚠️ **The counts were re-verified 2026-09-21 and TWO OF THEM HAD TRIPLED.**
Unreviewed glosses 241 → 687; words with no example sentence 568 → 1,043. A
number in this file is a measurement with a date on it, not a fact. **Re-run the
check scripts before trusting any line below** — `check-notes.mjs` exists
precisely to catch this file drifting, and it had been failing unread.

---

## ▶ START HERE — the action board (organised 2026-09-26)

**This is the working list.** Every open item from the dated notes up to
2026-09-26 is gathered here, **grouped by the kind of work** so you can clear one
kind at a time, most urgent first. Each item links to the note with the detail.
The sections further down are the older, detailed record, kept as they were.
Anything below that is still open also appears here.

Tick a box here when it's done. If an item turns out to be wrong, say so in its
note, not just here.

### 1 · Test on a phone — nothing from 09-24 to 09-26 has been seen on a device
Do these on **a free account and a Pro account**, in **all three themes**. Each
one takes a minute.
- [ ] **Word sheet (path reading + stories):** tap a word, and the sheet stops at
      about 60% of the screen and scrolls. **The Save / Open in dictionary / Close
      buttons are visible**; they were invisible before, because themed classes
      are transparent inside a Modal. ✕, a tap on the reading and Android back
      all close it. Try *dab tsi* in the Questions reading.
      → notes/2026-09-25-GUIDE-path-reading-tap-to-define.md
- [ ] **Story glossary sheet: its Close `<Button>` may be invisible** for the same
      Modal reason. If it is, reuse `SheetButton` from WordSheet.jsx.
- [ ] **Path reading font:** the Hmong lines are Nunito Bold, the same as stories
      and flashcards.
- [ ] **Paths card at the top of Learn,** the **/path header** ("Learning Paths",
      coloured "X of Y done"), and breadcrumbs reading "Paths".
      → notes/2026-09-26-paths-rename-and-learn-button.md
- [ ] **Vocabulary breadcrumbs:** go theme → set → word. Each crumb returns to the
      theme, and a set opened from search shows no theme.
      → notes/2026-09-26-vocab-back-to-theme.md
- [ ] **Sentence builder:** a Pro session is 20 and a free one is 5 followed by
      See Pro; **a path unit is always 5, and ticks its step**. The cream covers
      the whole screen (including the overscroll pull), and a finished drill goes
      "Back to the sentence builder".
      → notes/2026-09-25-sentence-builder-full-sessions.md
- [ ] **Paywall:** the Early access card, the new feature list and the Free
      forever line, as a free user and as a subscriber.
      → notes/2026-09-25-paywall-early-access.md
- [ ] **Free vs Pro walls:** a topic set (Animals) shows the upgrade card; **a
      word's own page opens for everyone**; grammar sets, drills and units 1–13
      are fully free.
      → notes/2026-09-25-pro-vocab-sets-and-path-lesson-return.md
- [ ] **Lesson return:** open a unit → "Read the full lesson" → Finish, and you
      land back on the unit. Opened from Learn, you land on Learn.
- [ ] **Unit complete banner:** a trophy and "Completed", with no XP line.
      → notes/2026-09-25-path-trophy-and-unit-names.md
- [ ] **Admin access:** sign in as an admin and open a far unit, its quiz and its
      sentence builder. The "Admin access" box appears.
      → notes/2026-09-25-admin-path-access.md
- [ ] **Quiz audio:** the prompt plays a word's clip, and on English → Hmong it
      waits until you answer. → notes/2026-09-25-quiz-audio-and-mim-fix.md
- [ ] **Flashcards:** Mark Known stays on the card, and Mark Learning advances.
- [ ] **New content renders:** the Classifiers lesson (four jobs, omission rule,
      leej/txhais), the tsis lesson, the Asking Questions unit, the Measure &
      Group Words set, and the 7 new path units.

### 2 · Native-speaker review — the Hmong nobody fluent has read yet
Highest risk first. The first two are **drilled** (learners reproduce them), so a
mistake there gets practised.
- [ ] **31 AI sentences used as path drills** (top-ups to reach 5): Sentence
      Particles 5, Each Other 5, Questions 5, This & That 4, Where Things Are 4,
      Daily Life 4, Time & Days 2, You & Me 1, Not & Don't 1. **Particles first:**
      all six of its examples are AI. Clearing `source: 'ai'` on a checked
      sentence makes it a normal exercise.
      → notes/2026-09-25-sentence-builder-full-sessions.md,
        notes/2026-09-25-seven-more-path-units.md
- [ ] **The Some, Many, All sentence batch.** The author is getting quantifier
      sentences from another model, to be verified. They go in `moreExamples`
      (the mechanism exists; the Perplexity batch was withdrawn). Add a noun list
      to the prompt so the model can't guess words (e.g. *kua* is not "apple").
      → notes/2026-09-25-seven-more-path-units.md
- [ ] **The will-permission batch** (10 words, model output), and **faj seeb** and
      **ntxim siab** (held).
      → notes/2026-09-26-will-permission-batch.md
- [ ] **Drafted lesson prose:** the tsis lesson's two answer lines; the Asking
      Questions lessons (Yes or No, Which One?, their TODO-VERIFY lines); the
      question-words intro patterns.
      → notes/2026-09-26-negation-path-unit.md,
        notes/2026-09-25-interrogatives-and-grammar-first-path.md
- [ ] **9 drafted path-unit Hmong names** (`DRAFTED BY CLAUDE` in path.js). Cov
      Lej is the least certain; also check Cov Lus Txuas.
      → notes/2026-09-25-path-trophy-and-unit-names.md
- [ ] **New dictionary words:** the 45 standalone story words (check *mas, tsam,
      npoo, haum, hav* and the second senses of *kab* and *yug* first); the 9
      question words; the 3 AI examples in `negation`; *Meskas* (people sense).
      → notes/2026-09-25-story-vocab-scan.md
- [ ] **Stories:** the two Society stories (no recorded author) and the grammar
      fixes applied on 09-25, especially the rewritten environment ¶2; plus 4
      low-confidence flags (*xis noj*, *niam*, *ib nkag*, *ib lub ib puag ncig*).
      → notes/2026-09-25-story-vocab-scan.md
- [ ] **The standing item: 795 unreviewed dictionary glosses.** See "Blocking the
      Play production release" below.

### 3 · Decisions only you can make
- [ ] **Myanmar: Pem or Mias Mas?** Pem is commented out as a repeat. Restore it
      if both are in real use. → notes/2026-09-26-countries-cleanup.md
- [ ] **Should a set's quiz remember the theme** (`?fromGroup=`)? That is exercise
      3 in `learning/concepts/navigation-return-context.md`.
- [ ] **Lub Xeev Siab story level:** advanced (live) or intermediate?
- [ ] **Speak is 7 of 22 lessons.** Is that enough for Pro at $7.99 while
      recording is paused? See "Blocking" below.
- [ ] **The Hmong bobtail dog story's shelf:** `society` or `life`?
      → notes/2026-09-25-planned-stories.md

### 4 · Content to write or record
- [ ] **Rewrite "Mus Saib Yeeb Yam" as natural storytelling, then pin its senses.**
      Drop textbook lines like *"Kuv thiab Fong yog wb ob leeg…"*; let the pronouns show
      through the scenes. Claude drafts the opening first for your OK. Then add `means`
      pins (e.g. `yog` → to be) until `node scripts/check-sense-pins.mjs` shows none left.
      → notes/2026-09-26-dictionary-headwords-and-sense-pins.md
- [ ] **Pin the other five stories** (same checker). Zong Vang is the big one (1,925 taps).
      Also review the two `yuav` future glosses, which weren't folded: "going to" vs "will".
- [ ] **Review the pronoun audit of "Mus Saib Yeeb Yam"** (your story, Everyday Life).
      At your request (2026-09-26), every pronoun was checked against your table.
      About 30 wrong uses were fixed, ¶15 was rewritten around five strangers, and
      three lines were added. Every pronoun is now used 17+ times. Your original
      text is still in `_incoming/story-mus-saib-yeeb-yam/`.
  - **Read the audit list:** notes/2026-09-26-story-pronoun-audit.md. It has
    every changed line, old → new, and why.
  - **¶15 is Claude-written Hmong** (the five strangers): *tham nrov nrov*,
    *hais me me*, *nyob twj ywm*, *kawm ntawv nrog wb*. Check it reads naturally.
  - **"Neb txais tos"** for "you're welcome": the app's reply-to-thanks is
    *tsis ua li cas*. Keep *txais tos* if it's what you mean.
  - **The quiz** (10 questions, English, drafted by Claude). q9 is on *nej* vs
    *neb*, and q10 on *lawv* vs *nkawd*.
  - **Dictionary words from this story:** *npaj txhij, yeej, nyiam, tus lej,
    chav, pem, zaus, nrug, tam sim no, ib nrab, sawv daws, nyob twj ywm*. Check
    their glosses. Movie theater is now your *lub tsev ntsia yeeb yam*.
  → notes/2026-09-26-story-pronoun-audit.md · notes/2026-09-26-story-mus-saib-yeeb-yam.md
- [ ] **Three stories** (two true crime, one about the Hmong bobtail dog), using
      the checklist in notes/2026-09-25-planned-stories.md.
- [ ] **Audio:**
  - **nkawd** (the only pronoun without a clip);
  - **15 of 16** Questions words;
  - Family, Colors and Food & Drinks, which have none;
  - **15 silent Speak lessons** (`check-lesson-audio` shows 15 ❌).
- [ ] **Food & Drinks is 1 example sentence short** of going live (`check-path`).
- [ ] **Data fixes:**
  - empty English on `buildings-xauj`, `buildings-yuav` and `relatives-kuv`;
  - goat and mouse/rat appear twice in animals.
- [ ] **From Bisang (1993), not yet used:** a class-noun lesson (*kws-*, *tub-*,
      *txiv-*) and the qualifying attributes (*me, tuam, niag, qub*).
      → notes/2026-09-26-reference-bisang-1993-classifiers.md
- [ ] **A Learn intro lesson for Some, Many, All:** quantifier vs classifier,
      after Bisang.

### 5 · Code to build or tidy
- [ ] **Notebook quiz:** the build-it-yourself guide is at
      `learning/feature-logic/notebook-quiz-guide.md`.
- [ ] **Pre-existing lint errors (unescaped apostrophes)** in
      `app/learn/[unitId]/[lessonId].jsx` (3), `app/paywall.jsx` (2),
      `app/words/session.jsx` (1) and `src/components/quiz/QuizEngine.jsx` (1),
      plus the unused `Footer` import on Home and the unused `useNotebook` in the
      story reader.
- [ ] **Keep the paywall's four descriptions in step** whenever Pro changes:
      `PRO_FEATURES`, the Free forever line, pageInfo `/paywall` and
      PaywallGate's card.

### 6 · Before every release
- [ ] **Run the checks:** `check-vocabulary`, `check-splits`, `check-path`,
      `check-reading`, `check-undefined-refs`, `check-theme`, `check-notes`. All
      must pass.
- [ ] **Zong Vang:** re-check where the two named men are held, as of the year
      (item "RE-CHECK BEFORE EVERY RELEASE" below).
- [ ] **Play Console:**
  - the Data safety form;
  - the content-rating questionnaire (the true-crime story describes a child's
    killing);
  - the $7.99 base-plan price;
  - for a personal developer account, a **closed test with 12+ testers for 14
    days** before production.

---

> ⚠️ Some lines in the older sections below are stale. For example, "Screens are
> NOT built" under *Landed* (they were built 09-22), and "nine placeholder
> stories" (superseded). The board above is current as of 2026-09-26.

## Landed 2026-09-20 / 21 — tools this file now assumes

Detail lives in the dated notes; these are here because the rest of the file
refers to them.

- [x] **The beginner path exists as data** — `src/data/path.js`, ten ordered
      units, plus `scripts/check-path.mjs`, which validates it and prints how
      many sentences each unit still needs. **Run it after every batch of
      sentence writing.** Screens are NOT built.
      → notes/2026-09-20-path-spine-built.md
- [x] **A tone drill that needs no audio** — `/words/typing`, grading tone off
      the spelling. This is what fills step 3 of a unit while recording is
      paused. → notes/2026-09-20-tone-aware-typing-drill.md
- [x] **A ranked queue for writing example sentences** — the Sentence Workbench
      artifact: all 1,043 words with no sentence, tiered, with a Core tier of
      129 that contains zero unreviewed glosses. Drafts are readable back and
      can be applied to `vocabulary.js` directly.

---

## Blocking the Play production release

- [ ] **1077 dictionary entries were written by Claude and are UNREVIEWED.**
      Re-counted 2026-09-30: 1077 — rog & tsov rog confirmed by the author (−2). Earlier the same day: 1079 (was 1020) — +7 txhais-uses, +23 intensifiers, +19 uncommon intensifiers, +10 words (author batch). Before: 1020 on 2026-09-29 (+1 tau success card). Before: 1019 on 2026-09-28 (was 1007, +12 sentence-structure pattern cards).
      Re-counted 2026-09-28: 1007 (was 1004) — +3 particle cards (thiab at the end, xwb, mas).
      Re-counted 2026-09-28: 1004 (was 1003) — +1 locprep-nram.
      Re-counted 2026-09-28: 1003 (was 1002) — +1 eth-neeg-asias (Asian).
      Re-counted 2026-09-28: 1002 (was 994) — +8 continents (geography).
      Re-counted 2026-09-28: 994 (was 993) — +1 st-yog-li-ntawd.
      Re-counted 2026-09-28: 993 (was 973) — +20 common-nouns cards (Common Nouns).
      Re-counted 2026-09-28: 973 (was 968) — +5 hate words (ntxub, kev ntxub, ntxub ntxaug, kev ntxub ntxaug, nciab).
      Re-counted 2026-09-28: 968 (was 967) — +1 verbs-vam (to hope).
      Re-counted 2026-09-28: 967 (was 966) — +1 yog-los-yog (or).
      Re-counted 2026-09-28: 966 (was 962) — +4 so-then cards (thiaj li, thiaj, yog … ces, txawm; yog li moved in).
      Re-counted 2026-09-28: 962 (was 952) — +10 tense pattern cards (Time Markers).
      Re-counted 2026-09-28: 952 (was 951) — +1 yog-pattern-describe (direct vs through yog).
      Re-counted 2026-09-28: 951 (was 939) — +12 noun-purpose cards (Nouns by Purpose).
      Re-counted 2026-09-27: 939 (was 933) — +4 rau cards (apply, put on, toward, at), +2 bill (daim nqi, daim ntawv them nyiaj).
      Re-counted 2026-09-27: 933 (was 931) — +2 kos senses (scrape, tom kos) from the GPT fact-check.
      Re-counted 2026-09-27: 931 (was 930) — +1 ans-pattern-puas-yog (yog questions).
      Re-counted 2026-09-27: 930 (was 916) — +9 answering cards (Answering & Agreeing), +5 rau-uses cards (Rau).
      Re-counted 2026-09-27: 916 (was 909) — +7 dates cards (Writing Dates).
      Re-counted 2026-09-27: 909 (was 906) — +3: kos, kos npe, tshoob kos.
      Re-counted 2026-09-27: 906 (was 903) — +3: thaum pattern card, yos hav zoov, tua tsiaj.
      Re-counted 2026-09-27: 903 (was 870) — +33: yog/nyob/muaj 9, names (hu ua) 7, describing words 16, tsheb.
      Re-counted 2026-09-27: 870 (was 856) — +14: 5 verb + noun pairs, 1 classifier-pronoun card, 8 possession cards.
      Re-counted 2026-09-27: 856 (was 852) — +4 demonstratives (qhov no, qhov ntawd, 2 pattern cards).
      Re-counted 2026-09-27: 852 (was 845) — +7 clock-time cards (yog pes tsawg teev lawm? + 6 clock PATTERN cards).
      Re-counted 2026-09-26: 845 (was 844) — +1 nrhiav tsis tau (object after tsis tau, from the GPT review).
      Re-counted 2026-09-26: 844 (was 840) — +4 tsis tau: the answer flashcard + tsis tau los, tsis tau mus, nqa tsis tau.
      Re-counted 2026-09-26: 840 (was 836) — +4 tau examples on noj/mov (tau mov noj, tau ib teev lawm, tau noj mov lawm, noj tsis tau).
      Re-counted 2026-09-26: 836 (was 824) — +12: 8 tau PATTERN cards (tau + verb …) + 4 more tau examples.
      Re-counted 2026-09-26: 824 (was 809) — +15: the 14 tau-uses cards (unit u-tau) + khoom plig.
      Re-counted 2026-09-26: 809 (was 808) — +1 nrab (author: middle, as in ib nrab).
      Re-counted 2026-09-26: 808 (was 806) — +2 lej, ntej (single words from the movie story).
      Re-counted 2026-09-26: 806 (was 805) — −1 movie theater now uses the author's "lub tsev ntsia yeeb yam" (not unreviewed), +2 sawv daws, nyob twj ywm from the pronoun audit.
      Re-counted 2026-09-26: 805 (was 797) — +8 (nyiam, tus lej, chav, zaus, nrug, tam sim no, ib nrab, pem — the rest of the movie story's words).
      Re-counted 2026-09-26: 797 (was 795) — +2 (npaj txhij, yeej, from the movie story).
      Re-counted 2026-09-26: 795 (was 785) — +10, the will-permission batch (model output, pending a native speaker).
      Re-counted 2026-09-26: 785 (was 784) — +1 (eth-meskas).
      Re-counted 2026-09-26: 784 (was 787) — country repeats commented out.
      Re-counted 2026-09-26: 787 (was 784) — +3 (mais, kg, da dej).
      Re-counted 2026-09-26: 784 (was 781) — +3 AI-example entries in the new negation set.
      Re-counted 2026-09-25 again: 781 (was 736) after 45 standalone story words (rw-*).
      Re-counted 2026-09-25: 736 (was 687) — 42 from the story vocabulary scan, 9 from the interrogatives module
      (notes/2026-09-25-story-vocab-scan.md), whose examples are story lines
      but whose glosses are Claude's.
      ⚠️ **Re-counted 2026-09-21 — this said 241, and IT HAPPENED AGAIN.** The
      entry below already recorded the number tripling from 54 while nobody
      updated it; it has now tripled a second time, 241 → 687, in a week.
      `scripts/check-notes.mjs` has an assertion whose entire job is to catch
      this ("the unreviewed-gloss count in TODO.md matches the data") and it
      was RED, unread, the whole time. **Run the check scripts.**

      ⚠️ **Two things the bare number hides, found 2026-09-21:**

      · **32 entries carry TWO status tags** — `draft` AND `unreviewed`
        together, all in `misc` (`misc-nas`, `misc-thawv`, `misc-xim`…). The
        tags contradict each other, and the count you get depends on how you
        ask: a grep for `'unreviewed'` says 687, while tooling that reads "the
        first status tag on the entry" says 655. The grep is the honest
        ceiling. Pick one tag per entry when the review reaches them.

      · **535 entries carry NO status tag at all** — neither confirmed nor
        flagged. These are the older hand-written core, which predates the
        review system, so they sit in a third state nobody tracks. That is
        1,351 entries total = 687 unreviewed + 124 reviewed + 30 draft
        + 8 needs-source-review + 535 untracked. **The untracked 535 are not
        automatically trustworthy**; they are merely unexamined by this system.

      ⚠️ **Re-counted from the data 2026-09-14 — this said 54, and had said 54
      while the number tripled.** Of 454 single-line entries, 241 carry
      `'unreviewed'` and 48 still carry `'draft'`.

      ⚠️ **454 is not the size of the dictionary.** It counts only the newer
      single-line entry form; the older multi-line categories (`food`,
      `animals`, `timeframes` …) bring the real total to **914**. The
      unreviewed count greps the tag and is format-blind, so it is accurate —
      but the ratio it implies is not. See the thirty-second pass in
      `notes/2026-09-14-zong-vang-day-two.md`.

      **Tier C — 264 words — is the remaining review queue**, in
      `notes/WORD-REVIEW.md`. Tiers A and B (160 words) are applied.

      ⚠️ **Applying a review chunk writes the gloss onto the FIRST entry in
      file order, because that entry owns the id, audio and example.** When that
      first entry is a topical category, a multi-sense reading gloss lands on a
      family or numbers flashcard — which is how `txiv` came to teach that it
      means *fruit* on a family card, and `plaub` that it means *hair* on a
      numbers card.

      `scripts/check-vocabulary.mjs` now fails on exactly that, and
      `src/lib/senses.js` is the fix: tag each sense with its domain and let
      the card take only its own. **Run `check-vocabulary` after every Tier C
      chunk**, not at the end.

      125 now carry `'reviewed'`, and 8 carry `'needs-source-review'` — a
      fluent speaker read them and could not confirm them against a source,
      so they stay in the queue with a sharper tag than they had.

      ```
      grep -c "'unreviewed'" src/data/vocabulary.js
      ```

      **Where they all are — `src/data/vocabulary.js`, all live, none
      commented out:**

      | category | entries | lines |
      |---|---|---|
      | `misc-phrases` | 65 | the new phrases category |
      | `misc` | 247 | the general holding list |

      ```
      grep -n "'unreviewed'" src/data/vocabulary.js
      ```

      **How it got here:**
      · **~54 on 2026-09-13** — the first batch, so the reader would stop saying
        "no entry for this word yet" on half the words on a page (coverage
        45% → 87%). Some of these are wrong.
      · **~70 on 2026-09-14** — promoted out of `story-zong-vang`'s glossary:
        ordinary verbs, body parts and function words a 600-word dictionary had
        never reached, found by auditing which taps in a real text returned
        nothing.
      · **65 on 2026-09-14** — the new `misc-phrases` category:
        everyday multi-word phrases harvested from the readings.
      · **123 more single words on 2026-09-14**, into `misc`.
      · **12 second SENSES** (tagged `'sense'`) — `ntaus`, `hu`,
        `caij`, `zaum`, `pab`, `ib`, `thov`, `kaw`, `siab`,
        `plaub`, `txim`, `nees`, `caum`…

      ⚠️ **The 12 senses were not tagged `'unreviewed'` until
      2026-09-14** and so did not appear in the grep above. They are the
      highest-leverage entries in the file: a wrong new headword adds a wrong
      word, but **a wrong SENSE changes what an EXISTING headword displays** and
      corrupts a word that was previously right, in every story at once.

            **To review:** fix the english, then DELETE `'draft'` and
      `'unreviewed'` from that entry's tags. The tag going away IS the record.

      Start with the ones most likely wrong:
      · `'draft'` — `kis`, `sis`, `tab`, `si`, `to`, `laim`,
        `maj`, `tsi`, `tsuag`, `dab`. Words that mostly live inside a
        compound; **deleting these may be better than fixing them.**
      · the 12 `'sense'` entries, because they are the highest-leverage
        mistakes available — see notes/2026-09-14-zong-vang-day-two.md.

      ```
      grep "'draft'" src/data/vocabulary.js
      ```

      **To review:** fix the english, then DELETE `'draft'` and `'unreviewed'`
      from that entry's tags. The tag going away IS the record — there is no
      separate checklist to drift.

      Start with the ones already flagged as most likely wrong:
      · `'bound'` — `kis`, `sis`, `tab`, `si`, `to`, `laim`, `maj`, `tsi`,
        `tsuag`, `dab`. Words that mostly live inside a compound; **deleting
        these may be better than fixing them.**
      · `'name'` — `ntxawm`, `nkaub`, `zaub` are character names, not
        vocabulary, and probably do not belong in a dictionary at all.

      To undo the whole thing: delete the block. See
      notes/2026-09-13-draft-glosses-need-review.md.

- [x] **Let the lookup match inside multi-word entries — DONE 2026-09-13.**
      `kis` now finds "tag kis", `tsi` finds "dab tsi?", `tab` finds "tab tom".
      Built as tier 4 with the guards it needed: whole tokens only, never
      substrings; skipped entirely for any word that has its own exact entry (so
      `li` can never be dragged into "li cas?"); and the compound is shown as
      the answer, so the sheet reads "tag kis — morning" rather than claiming
      `kis` means morning alone.
      See notes/2026-09-13-lookup-wrong-sense.md.

- [x] **Superseded 2026-09-25: no placeholder story is live.** The placeholders
      sit inside a `/* */` block (so a plain grep still counts them). The 5 live
      stories are Ntxawm, Tus Miv, Zong Vang and the two Society stories. **What
      is still open:** the two Society stories have no recorded author, and the
      grammar fixes applied 2026-09-25 (notes/2026-09-25-story-vocab-scan.md)
      need a fluent read. Original entry below.
- [ ] ~~**Nine of the ten stories are placeholder Hmong.**~~ `grep "placeholder: true"
      src/data/stories.js` — 9 hits. Only `story-zaj-dab-neeg-thawj` is real
      content. The sentences are short and built from words already in
      `vocabulary.js` so lookup resolves, but *written correctly is not written
      well*, and a language app cannot ship prose nobody fluent has read.
- [x] **`MONETIZATION_ENABLED = true`** in `src/lib/launch.js` — **the switch is
      already thrown.** This entry said `false` until 2026-09-15 and was read
      that way for days; re-checked against the code, not recollection.

      ⚠️ **Which makes the item below release-blocking in a way it was not
      before.** The paywall renders, and reading went free the same day — so
      what Pro now sells is Speak, and **15 of its 21 lessons have no audio**.
      They are correctly hidden (`lessonIsReady` derives from the clips and
      `app/speak/lesson/[lessonId].jsx` blocks unready ones for non-admins), so
      nobody pays for silence — but a subscriber's library is 6 lessons.
- [ ] **FIFTEEN Speak lessons are SILENT — 7 of 22 have audio.** Recounted from
      `node scripts/check-lesson-audio.mjs` on 2026-09-21 (was "6 of 21" on
      2026-09-15, and "eighteen" silent on 2026-09-12 before `cat-price`).
      **Recount from the script, never from this line.**

      ⚠️ **RECORDING WAS PAUSED ON 2026-09-21 — which turns this from a content
      backlog into a BUSINESS-MODEL DECISION, and that decision is not made.**

      The chain: `MONETIZATION_ENABLED = true`, reading went free 2026-09-15, so
      Pro sells Speak. Speak is 7 lessons. With recording paused, Speak cannot
      grow — so **what Pro sells is frozen at 7 lessons for as long as the pause
      lasts.** Nobody is charged for silence (`lessonIsReady` correctly hides
      the other 15), which is why this is not a bug; it is an empty shelf.

      Three honest options, and one has to be picked:
      1. **Pro sells something else** — the beginner path, the drills, unlimited
         practice. Most work, most durable.
      2. **Don't charge yet.** Flip `MONETIZATION_ENABLED = false` until there
         is a paid module worth the name. Cheapest, reversible, honest.
      3. **Unpause recording for Speak only** — ignore the 1,140 vocabulary
         clips, record the 15 lessons. Narrowest path back to the current plan.

      ⚠️ Doing nothing is option 2 with the switch left on, which is the one
      version that charges money for an empty shelf.

      Complete: greetings, farewells, politeness, and all three price lessons.
      Silent: every family, food, everyday, understanding and questions lesson.

      ⚠️ **This is now the main thing Pro sells.** Reading went free on
      2026-09-15, so Speak is the paid module — and it is 29% recorded.

      (Was "seven stubs" — 2026-09-12 replaced every `ph()` shell with real
      structure: 21 lessons, 576 steps, 7 categories. See
      notes/2026-09-12-speak-lesson-skeletons.md.)

      Better and worse at once. Better: each one now carries its real phrases,
      so `node scripts/audio-todo.mjs --write` emits the exact 184-clip
      recording list instead of nothing. Worse: **three free lessons and
      eighteen locked ones that cannot be practised at all** — no clip means no
      model to imitate and nothing to score against, which is the thing a
      subscriber would be paying for.

      **Two gates, both required before charging:**
      · the 184 clips, or at least a category's worth so a Pro lesson works
        end to end;
      · **a native review of all 18** — the Hmong is the author's list verbatim,
        the English is drafted from word annotations, and nobody fluent has read
        any of it. The txuas/txaus mis-take is what this risk looks like when it
        ships.

      Until both: they stay locked, or `MONETIZATION_ENABLED` stays false.
- [ ] **The reader's two sheets have never run on hardware.** Three separate
      `<Modal>` defects were found and fixed *by reading code* — the nav-bar
      inset, `flexShrink: 1`, and themed classes resolving to transparent. That
      the fixes hold is unverified. Open the glossary, scroll it, press Close;
      long-press a word, press Close. If anything is cut off at the bottom, the
      answer is the one `PageInfoModal.jsx` already proves: drop `<Modal>` for
      an absolute-fill overlay.

## Decisions taken 2026-09-09 — implement when convenient

- [ ] **Startup lag: `inlineRequires` + lazy search index — decided
      2026-09-14.** 777 KB of `src/data/*.js` is parsed at startup, and
      `GlobalSearch.jsx:133` builds its whole index at module scope. Neither is
      a network problem, so **an API does not fix it.** Two changes, no
      architecture commitment:

      1. `inlineRequires: true` in the Metro transformer options.
         ⚠️ Can surface latent circular imports — needs a real device pass, not
         just a green check sweep.
      2. Build `INDEX` on first search, not at import.

      Then split story metadata from story body, which is worth doing on its
      own and makes remote delivery trivial later. Do it while the six new
      stories are being written, not after.

- [x] **Supabase schema — BOTH FILES RUN AND VERIFIED 2026-09-15.** Probed the
      live project rather than taking it on trust:

      ```
      stories, story_manifest   200  exist, empty, readable by anon
      admin_users, admin_totals 401  exist — anon revoked, as designed
      admin_user_progress       404  dropped, as intended
      profiles.is_pro           200  column added
      ```

      The first version of the admin views used `security_invoker = true` and
      failed with **permission denied for table users** — an invoker-rights
      view runs as the CALLER, and `authenticated` cannot read `auth.users`.
      Fixed to definer rights. ⚠️ **`create or replace view` does not clear a
      reloption already set**, so the file drops before creating.

      ⚠️ **If the app says "Could not find the table 'public.admin_user_progress'
      in the schema cache", that is a STALE JS BUNDLE, not a database problem.**
      That view is gone and nothing in the repo references it. Reload the app;
      `npx expo start -c` if a plain reload does not take.

- [x] **Admin dashboard is live — DONE 2026-09-15.** Seeded, reloaded, and
      reading real data: **70 profiles** at the time of writing.

      `/admin-users` prints `admin_whoami()`'s answer when it finds you are not
      seeded, including **this session's uid** and a ready `insert`. That
      matters because RLS returns an empty set rather than a permission error —
      "not an admin" and "no users" are otherwise the same blank screen.

      ⚠️ **`ADMIN_EMAILS` (src/lib/admin.js) and `public.admins` are NOT kept in
      sync by anything, and are allowed to differ.** One hides a menu item; the
      other grants read access to every user's email. Removing someone from the
      app list leaves their database access intact until they are deleted from
      the table. Check both when revoking.

- [ ] **The About page says "we" and now also says "built by one person".**
      `app/about.jsx` gained a "Who built this" section on 2026-09-15; the rest
      of the page still reads "Why **we** are careful" and "**we** want to hear
      it". A reader notices. Left deliberately rather than silently rewritten —
      changing a page's voice is an editorial call. Two places to change if it
      should read "I".

- [ ] **Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your shell** before
      running `scripts/publish-story.mjs`. ⚠️ **Never as `EXPO_PUBLIC_*`** —
      anything with that prefix is compiled into the APK and readable by anyone
      who unpacks it. The service role key bypasses RLS entirely.

- [ ] **`profiles.is_pro` is CLIENT-REPORTED — replace it with a RevenueCat
      webhook when it is worth the work.** `SubscriptionContext` writes the
      entitlement so the dashboard can count subscribers; a patched build could
      write `true`. The cost is a wrong number on a dashboard, never a free
      subscription — gating stays with RevenueCat and must never read this
      column. The fix is an Edge Function on RevenueCat's webhook writing it
      server-side, then denying client writes to it.

- [ ] **Admin dashboard — `/admin-users`, built 2026-09-15.** Listed in `/dev`.
      Total users, active 1d/7d/30d, XP, streaks, one row per account.

      ⚠️ **This is the first admin surface that exposes DATA rather than
      screens**, which is the line `src/lib/admin.js` always said would require
      moving the check server-side. It did: enforcement is `public.is_admin()`
      in Postgres and every view calls it. `AdminGate` only hides the menu item
      — `ADMIN_EMAILS` ships inside the APK.

      ⚠️ **Signed-in users only, and the screen says so.** Guest progress lives
      in device storage (`kawmhmoob.progress.guest`) and never reaches Supabase.
      Quoting these numbers as "total users" would be wrong by however many
      people never made an account.

- [ ] **Remote story authoring — Supabase, NOT FastAPI. SCHEMA WRITTEN
      2026-09-15, client not wired.** `supabase/01-stories.sql` has the table,
      the trigger, RLS and the `story_manifest` view, ready to run.

      **Built 2026-09-15:** `scripts/export-stories.mjs` (bodies →
      `supabase/payloads/*.json`) and `scripts/publish-story.mjs` (runs the
      whole sweep and refuses to upload on failure — **no `--force`, and do not
      add one**).

      **Still to build — one thing:** `src/lib/storyStore.js`, the client
      fetch/cache layer. Manifest → skip rows above this build's
      `min_app_version` → download changed payloads → `expo-file-system`.
      Render order: **cached file → bundled copy → never the network**.

      ⚠️ **Until that exists the uploads are inert** — nothing in the app reads
      these rows. That is a safe place to be stopped, but it does mean a
      published story is invisible and nothing will tell you.

      ⚠️ **THE SPEED WIN IS THE SPLIT, NOT THE NETWORK.** Measured
      2026-09-15: all three stories are **94.4 KB of body against 885 B of
      metadata**, and the library screen parses all of it to show none of it.
      Splitting metadata from body is what makes loading faster, and it works
      with or without Supabase. A fetched payload still has to be parsed.

      The app already depends on `@supabase/supabase-js` and
      `expo-file-system`, so this needs no new infrastructure.

      ⚠️ Reading went free on 2026-09-15, so the "RLS gates Pro server-side"
      argument no longer applies — the policy is public read of published rows.
      The stricter tier policy is written out, commented, in the same file.

      ⚠️ **Publishing must run the whole sweep and refuse to upload on
      failure** — `check-reading`, `check-notes`, `check-vocabulary`,
      `check-undefined-refs`. Every quality gate here is repo-side; a server has
      none of it. Without the gate, remote delivery is a way to ship Hmong
      nobody checked.

      ⚠️ Keep this list in step with `scripts/`. It was written naming only two
      checks and was already out of date the same day `check-vocabulary.mjs`
      landed — a publish gate that names a stale subset is a gate with a hole
      in it.

      See `notes/2026-09-14-remote-story-delivery.md`.

- [ ] **Notifications — not started, wanted soon (raised 2026-09-12).**
      `expo-notifications`. Nothing is installed and no permission is requested
      anywhere today.

      **Decide the JOB before the plumbing**, because it changes everything else:
      · *streak rescue* — one reminder, late in the day, only when the streak is
        live and today is unearned. Highest value, lowest annoyance, and it
        needs the streak state that `ProgressContext` already holds.
      · *review due* — "N words are ready" — needs the SRS queue, which now
        means `selectSession`, not `selectDueWords` (see the 572 note).
      · *re-engagement* — day 3 / day 7 after last open. The one most likely to
        get the app muted.

      ⚠️ **Local notifications only to start.** Push needs a server, a token
      table and a send path; local scheduling needs none of it and covers all
      three jobs above, since every trigger is computable on the device.

      ⚠️ **Android 13+ requires POST_NOTIFICATIONS at runtime**, and asking on
      first launch is how you get denied forever. Ask after something good
      happens — a finished lesson, a perfect quiz.

      ⚠️ **A daily allowance and a daily reminder must agree.** Quotas reset on
      `dayKey()` (UTC); a reminder fires in local time. A notification saying
      "your practice is ready" an hour before the quota rolls over would be the
      app lying to somebody it just invited back.

- [ ] **Crash reporting — Sentry, later.** `@sentry/react-native`. Nothing is
      installed today, so once this is on Play a crash is invisible: you find
      out from a one-star review. `ErrorBoundary` catches the render and shows
      something friendly, but nobody tells *you*. Deliberately deferred, not
      missed.

- [x] **Reading is OPEN TO EVERYONE — done 2026-09-15.** The quota is gone and
      so is the Pro gate: every genre in `src/data/stories.js` carries
      `free: true`, so `locked` and `quotaApplies` are false for a signed-out
      guest on every shelf and every story. Verified by evaluating both
      expressions against the real data, not by reading the code.

      The quota was **commented out, not left inert** — `free: true` alone
      already made it meter nothing, and a disabled gate that still runs is the
      thing that comes back on at the worst moment. Restore hints sit at
      `const quotaApplies` in the reader and `const quota` in the story quiz.

      ⚠️ **One thing genuinely regressed, and it was never about money.** The
      story quiz's cap had two justifications; the second was that five
      questions × four options with unlimited retakes means guessing beats
      reading. **That is now unguarded.** If it comes back it wants a limit
      NOT tied to `isPro` — brute force works the same for a paying reader.

      Original decision, 2026-09-09:
      Today there are TWO mechanisms doing one job: `useDailyQuota('reading')`
      in the reader, and per-GENRE gating (`free: true` on `life` in
      `stories.js`). The quota is the worse of the two — it punishes the
      engaged reader and teaches everyone that finishing a story might not be
      possible today.
      **Choose the grain before writing it:**
      · *per genre* (what exists) — one flag per shelf, cheapest, coarse.
      · *per story* — `free: true` on individual stories, so a taster can sit
        inside a Pro shelf. Better for conversion, one more field to keep
        honest, and `check-reading.mjs` should then assert at least one free
        story exists — otherwise the free tier can silently become empty.
      ⚠️ Remove the quota rather than leaving it inert. A disabled gate that
      still runs is exactly the thing that comes back on at the worst moment.
      Comment it out per the repo convention, with a restore hint.

- [ ] **Guest → subscribe → reinstall currently loses everything.**
      Signed-in progress syncs to Supabase; guest progress is local only
      (`kawmhmoob.progress.guest`). RevenueCat restores the *entitlement* on
      reinstall — not the streak, the XP or the schedule.

      **Where it goes:** `ProgressProvider`'s load effect already re-runs when
      `userId` changes. Migrate on the transition where the previous id was
      `guest` and the new one is not.

      **Merge, never overwrite** — the account may already hold progress from
      another device:

      | field | merge |
      |---|---|
      | `completedLessons`, `completedSteps` | union |
      | `quizScores` | concat — they are dated events |
      | `vocabProgress` | per key, later wins |
      | `vocabSchedule` | per word, keep the later `lastReviewedAt` |
      | `streakData` | whichever has the later `lastActiveDate` |
      | `xp` | `Math.max`, **not** sum |

      `xp` is the trap: the steps merge as a *union*, so summing double-counts
      anything done in both places and hands out free XP.

      ⚠️ **The dangerous failure is the network one.** If the remote load fails
      and "no data" is read as "empty account", then merging and saving
      overwrites a paying user's real history with a guest's. Migrate ONLY
      after a successful load; clear the guest blob ONLY after the merged save
      succeeds; make it idempotent so a retry cannot double-apply.

- [ ] **Dynamic type — cap the decorative text, not the readable text.**
      RN `<Text>` scales with the OS font-size slider by default. What breaks
      is fixed-height boxes wrapping scaling text, and there are known ones:
      · `StoryCover` `S.capH` — 34/44/46px fixed around a two-line caption;
        the second line clips around 130%.
      · the jacket itself — `height = width × 1.42` with the title at
        `numberOfLines={3}`; at large scale the title swallows the cover.
      · the reader toolbar and the quiz action bar, both fixed `py-3` rows.
      **Do not disable scaling** — it is the setting this audience actually
      needs, and a language app skews older. Put `maxFontSizeMultiplier={1.3}`
      on the decorative type (jacket lettering, badges, counts) and leave story
      text, prompts and body copy fully scalable. Then walk the app once at
      130% and 200%.

- [ ] **Tests for the two pure functions where a silent bug does real damage:**
      `selectSession` (SRS scheduling), and whatever gating replaces the quota.
      Six data checks already exist and catch content errors; neither of these
      has anything. A scheduler bug quietly feeds someone the wrong words
      forever; a gating bug either gives Pro away or locks out a payer. Both are
      pure functions — no UI, no mocking, cheap to cover.

## Content debt

- [ ] **1,043 of 1,351 vocabulary words have no `exampleSentence`** — and that,
      not the word count, is the bottleneck. Re-measured 2026-09-21.

      ⚠️ **THE TREND DID NOT BREAK, IT ACCELERATED.** Three readings of the
      same number, and the gap widens every time:

      | | words | with a sentence | coverage |
      |---|---|---|---|
      | before 2026-09-16 | 523 | 306 | 59% |
      | 2026-09-16 | 877 | 309 | 35% |
      | **2026-09-21** | **1,351** | **308** | **23%** |

      The vocabulary has grown by 828 words since the first reading while the
      sentence count has gone DOWN by two. The sentence builder draws exercises
      *exclusively* from this field, so 1,043 words are invisible to it.

      ⚠️ **STOP ADDING WORDS.** Every entry added makes this ratio worse and
      adds nothing a learner can use — see the lookup-coverage note below,
      which was already 99.4% at 877 words.

      **Where to write them, 2026-09-21:** the ranked queue is the Sentence
      Workbench artifact (Core tier = 129 words, zero of them unreviewed), and
      `node scripts/check-path.mjs` reports which beginner unit each batch
      unlocks. The path needs **78 sentences** for all ten units.

      ⚠️ **Adding more WORDS does not help anything.** Reader lookup coverage
      across the three live stories is already **99.4%** — 530 distinct words,
      3 undefinable, and one of those (`hau`, half of `taub hau`) is a
      *correct* miss by design. The only two real gaps are `mis` and `hlwb`.

      Every example sentence written against an EXISTING word creates a
      sentence-builder exercise, counts toward the 5 needed to unlock a drill,
      and feeds tiers 1–2 of the reader's long-press lookup.

      Highest value, re-checked 2026-09-21: **Common Descriptions** — the
      adjective source, and the "adjectives follow the noun" grammar hint still
      has ~5 sentences in the whole app that can fire it. It has moved: **12 of
      26 missing**, down from 26 of 26. **Relatives** has not moved at all —
      still **26 of 31 missing**, and still the worst single gap.
      See notes/2026-09-16-vocab-depth-not-breadth-and-grammar-grouped.md.

      ⚠️ **But the beginner path now outranks both.** Since 2026-09-20 there is
      an ordered curriculum (`src/data/path.js`), and a sentence written for a
      word inside it unlocks a whole unit rather than improving a ratio. The
      cheapest wins on 2026-09-21:

      | unit | sentences needed |
      |---|---|
      | Core Verbs | **2** (`los`, `muaj`) |
      | Colors & Describing | 3 |
      | Family | 4 |

      Two sentences take the live path from two units to three. Run
      `node scripts/check-path.mjs` after each batch.

- [ ] **`TSIS COV MUV!` is junk data** — all-caps with a trailing space, sitting
      in `src/data/vocabulary.js` as an `exampleSentence`. It surfaces in the
      Negation drill sample. Either a real sentence badly transcribed or
      something pasted by accident; only a reader can tell which.

- [ ] **The reading library needs at least 10 stories. It has 3.**
      `story-ntxawm-lub-xauv`, `story-tus-miv-tus-nas`, `story-zong-vang` — all
      finished, none flagged `placeholder`, across four genres that are all
      `free: true`.

      ⚠️ **Four genres, three stories.** `Everyday life`, `Horror`,
      `Folk tales` and `True accounts` all render a shelf, so at least one shelf
      is near-empty at any time. Ten would give roughly two or three a shelf,
      which is the minimum for the library to read as a library rather than a
      list — the shelves exist because 25 stories are unbrowsable as a list, and
      at 3 they are doing nothing.

      Each story is one object in `src/data/stories.js` with `paragraphs`
      (sentence-paired Hmong/English), `glossary` and `questions`. Adding one
      touches that file and nothing else — see
      `learning/reading/01-the-library-guide.md`. Every new story also feeds the
      reader's long-press lookup and is a place to source new vocabulary.

- [ ] **Review the 40 placeholder grammar sentences.** ⚠️ **The drills are
      UNLOCKED, but on unreviewed content.** Updated 2026-09-16: all 16 grammar
      drills are now live (was 10), carried by 40 ChatGPT-generated sentences in
      `src/data/grammarSentences.js`. Nobody who speaks Hmong has read them.

      They live in their own file ON PURPOSE, not as `exampleSentence` on
      vocabulary words — that field also renders on the Flashcard, WordDetail,
      and the reader's lookup, so unreviewed Hmong would have published on three
      screens. Here they reach the sentence builder only, and the whole batch is
      one import from gone.

      **Read the rows with a `review` field first** — problems visible from the
      text alone:
      · gs-015 `Kuv mus thiab koj mus` — reads like a translated drill
      · gs-019 `Yog tias nag` — "to rain" is usually `los nag`; verb may be missing
      · gs-032 `Tos kuv maj` — `maj` also means "hurry"
      · gs-040 `thiab` joins NOUNS — counts as "Joining Clauses" without being one
      · gs-018, 030, 034, 038 — the generator mis-tagged their patterns (harmless:
        the matcher ignores the tags and reads the text)

      ⚠️ **The discourse-particle block (gs-026–032) is the least trustworthy** —
      particles carry tone and attitude, which a model cannot hear. Expect to
      replace most of it with a speaker.

      **When one is confirmed:** move it onto the matching vocabulary word as a
      real `exampleSentence` and delete it from `grammarSentences.js`. Do not mark
      it reviewed in place.

      Thinnest drills now, if more are wanted: Yes/No 7, Do Not 7, Joining
      Clauses 8, Question Words 9, Particles 9. At 20 each a 5-sentence session
      stops repeating inside a week.

- [ ] **154 clips to record** — `cat-price` is now COMPLETE (3/3 lessons,
      the first sellable Pro category).

      ⚠️ **PAUSED 2026-09-21, BY DECISION — not dropped, not forgotten.** The
      focus moved to example sentences, then stories. Everything below stays
      accurate and waiting; nothing here was un-learned.

      **What the pause costs, measured rather than assumed:**
      · `audioFile` coverage is 211 of 1,351 vocabulary words (16%).
      · Step 3 of the five-step beginner unit is tone practice, which needs a
        reference clip — so on paper the pause leaves a hole in every unit.
      · ⚠️ **It does not, and this is the part worth remembering.**
        `src/lib/typingDrill.js` teaches tone through SPELLING — writing `zos`
        for `zoo` is named as a Low-vs-Mid tone error — and runs on 917 words
        with no recording at all. **Step 3 is that drill until clips exist.**
        See notes/2026-09-20-tone-aware-typing-drill.md.
      · `path.js` therefore excludes audio from its readiness test
        (`AUDIO_COUNTS_TOWARD_READY = false`). `withAudio`/`needAudio` are still
        measured every run, so un-pausing is one line, not an excavation.

      ⚠️ The pause does NOT resolve itself for Speak — see the Pro decision in
      "Blocking the Play production release" above. Vocabulary audio is
      optional; the Speak module is what somebody is being charged for.

      ⚠️ **RECORD WAV, SHIP MP3 — decided 2026-09-13.** Two different questions
      with two different answers:
      · **Record** a lossless master — mono, 44.1 or 48 kHz, 16-bit — and keep
        it OUTSIDE `assets/`, with the annotation files.
        `scripts/extract-contours.mjs` says why at its head: decoding an mp3
        recovers the DEGRADED signal, and the reference pitch contours the tone
        scorer compares against are built from these.
      · **Ship** mp3 at ~64 kbps mono in `assets/`, which is what the data
        references.

      Re-measured 2026-09-13: **55 .wav = 29.7MB; 315 .mp3 = 9.7MB.** The wavs
      are **15% of the clips and 75% of the audio payload** — ~553KB a clip
      against ~31KB. On a Play listing where audio is most of the download.

      ⚠️ Converting the 55 already in `assets/` is a DATA migration, not a file
      conversion: `src/lib/audioMap.js` needs literal `require()` strings
      (regenerate with `node scripts/generate-audio-map.js`) and the `A` map in
      `src/data/speakLessons.js` needs `.wav` → `.mp3`. Do both in one pass.

      ⚠️ `ffmpeg` is NOT on PATH on this machine — the same gap that left
      `contours.json` empty while the audio shipped and played fine. Install it
      before the conversion pass. See
      notes/2026-09-12-price-category-recorded.md. The three ORIGINAL lessons are at 100% audio
      (24 takes landed 2026-09-11/12 — notes/2026-09-12-lesson-audio-wired.md);
      the 18 skeletons written 2026-09-12 are entirely silent, which is where
      177 of these come from. The remaining 7 are the archived phrase drills in
      `src/data/speak.js`.

      `node scripts/audio-todo.mjs --write` regenerates the list from the lesson
      data every time — it is the running order for a recording session, deduped
      by phrase, with the path each file lands at:
      https://claude.ai/code/artifact/ec86c0e8-a3d4-432b-a8fc-66ee060f0eec
      Markdown copy at `notes/audio-todo.md`; regenerate both sources with
      `node scripts/audio-todo.mjs --write` after editing lesson data.
      `Thov txim` and `Tsis ua li cas` are each needed in two places — one take,
      copied to two paths, which is why 20 files is 18 takes.
- [ ] **Seven phrase drills are commented out of `src/data/speak.js`** for want
      of a clip. (Was ten — `Thov txim`, `Tsis ua li cas` and `Thov` were
      restored 2026-09-12 against the Thanks & Sorry lesson takes.) Nothing is broken, so nothing will ever remind you. Each is a
      finished phrase that returns the moment a recording exists — the cheapest
      content on this list. ⚠️ Uncomment the phrase as well as adding the file.
- [ ] **~25 more Speak lessons**, planned. Do these before the category-card
      redesign below.
- [ ] **⚠️ RE-CHECK BEFORE EVERY RELEASE: `story-zong-vang` states where two
      named living men are imprisoned.** Added in full 2026-09-13 at the author's
      instruction. Paragraph 39 says Richard Crapeau is at Racine Correctional
      Institution having served ~28 years, and Omer Ninham at Fox Lake
      Correctional Institution.

      The Hmong carries an as-of anchor — *"Raws li cov ntaub ntawv txog xyoo
      2026"* — so a stale line reads as dated rather than false. **That is a
      mitigation, not a fix.** Custody placements change, and sentencing law for
      offences committed as a juvenile is still being litigated.

      ⚠️ **This is not a box to tick once.** Verify against Wisconsin DOC's
      offender search and the court record at each release, and update the year
      in the anchor when you do. The author's own writer's note attached to the
      source text asked for exactly this.

- [ ] **100% word-tap coverage on `story-zong-vang` is a SNAPSHOT, not a
      floor.** Every one of its 4,153 word taps resolves as of 2026-09-14.
      Nothing enforces that: the next line added can drop it and no checker will
      say so.

      ⚠️ The measurement lives in a scratchpad script, not in `scripts/`. The
      natural home is `check-reading.mjs`, and the reason it is not there yet
      is real — that file deliberately does not import `wordLookup`, because
      wordLookup pulls `vocabulary.js` through a relative path its
      copy-to-.mjs trick would break. Solving that is the work.

      ⚠️ It would also need the reader's tokenizer, which is now a THIRD copy of
      the same rule (reader, `check-reading.mjs`'s `WORD_SPLIT`, and the
      audit). Two copies already drifted once and reported 97% for three passes
      when the real figure was higher.

- [x] **Eight ordinary words that lived only in one story's glossary are now
      in the dictionary — DONE 2026-09-14.** All eight are live entries in
      `src/data/vocabulary.js`, promoted during the fluent-review passes, so
      every reading can answer them now, not just `story-zong-vang`. Verified
      by grepping each headword rather than by recollection.

      Originally added 2026-09-13 to `story-zong-vang` because they were the
      most frequent unanswered taps in it — measured, not guessed:

      `xyoos` · `lus` · `los sis` · `rov qab` · `thiaj` · `raws li` ·
      `txhaum` · `hla`

      None is specific to that story. They are absent from a 600-word
      dictionary, which means **every** reading has been failing to answer them.
      Moving them to `src/data/vocabulary.js` fixes all of it at once — and
      changes the quiz and the review queue too, which is why it was not done as
      a side effect of shipping a story. See the coverage numbers in
      notes/2026-09-13-zong-vang.md.

- [ ] **Story cover art — 0 of 10.** Scaffolding is done: every line is written
      and commented out in `src/data/storyCovers.js`, so adding one is deleting
      two slashes. Spec (1:1.42, 600×852, `.jpg`, named by story id) is in that
      file's header. `check-reading.mjs` reports the count and rejects a cover
      keyed to a story that does not exist.

## Deferred by decision — not forgotten

- [ ] **Teach the classifier WITH the noun set.** Author, 2026-09-30: *"we will
      prolly have to rework the quizzes to include the relevant classifier in
      them too, like Hmoob Cov Cuab Yeej — Tools & Household Items = tools."*
      A learner who knows `riam` but not `rab riam` cannot actually say it —
      Hmong rarely uses a bare noun, so a set that teaches the noun alone
      teaches half a word.
      **Explicitly deferred by the author ("but later").** Noting the shape of
      the problem while it is fresh:
      - the classifier is per-NOUN, not per-set — a "Tools" set is mostly `rab`
        but not entirely, so a single set-level classifier field would be wrong
        the moment it is convenient;
      - the data for this largely exists (`classifiers`,
        `classifier-inventory`, and the Bisang (1993) inventory) — what is
        missing is the link from each noun to its classifier;
      - `tus` vs `txoj` vs `lub` is exactly the confusion the 2026-09-30
        definition rulings were about, so the quiz has to be *right*, not just
        present. See `2026-09-30-word-definition-rulings.md`.
      - `DECOY_WORDS` (sentence builder) is the existing machinery for offering
        confusable wrong answers, and classifiers are the textbook case for it.

- [ ] **The undifferentiated row.** `h-11 w-11 rounded-full bg-clay-600/12` is
      on Speak categories, Words tiles and Home doors alike. Consistency is
      good; undifferentiated *weight* is not — a 200-lesson course, a 15-word
      notebook and the leaderboard all look equally important, so the eye has
      nothing to prioritise. Reading solved this by giving its main object a
      genuinely different shape.
      **Held until the ~25 Speak lessons land.** The right shape for a category
      card depends on how many categories there end up being, and designing it
      against three is how you get something that breaks at twelve — the exact
      mistake `shelfCoverWidth()` had to be corrected for.
- [ ] **Motion, everywhere that is not the reader.** The reading module has one
      considered animation (a measured-height gloss) and the rest of the app has
      none outside modals. Predicted as the next level of drift once the visual
      system settled — see the closing table in
      `2026-09-09-app-wide-ui-pass.md`.

## Housekeeping

- [ ] **`EXPO_PUBLIC_RC_API_KEY_IOS` is unset** (`SubscriptionContext.jsx:42`).
      Blocks the App Store, not Play. Needs the `appl_` key.
- [ ] **Level-tone normalization.** The scorer cannot separate level tones:
      measured at `-b vs -none: 90`, `-b vs -s: 84`, `-none vs -s: 92`, where
      all three should be low. `points` store raw Hz, so fixing the
      normalization needs **no re-extraction** of contours.
- [ ] **Unverified: "re-record Yog".** Carried in a session summary but nothing
      in the repo corroborates it — no marker in the data or the notes. If real
      it is a bad take rather than a missing one, and only a listener can say.
- [ ] **Undecided: the sentence-builder results screen.** Rebuilt 2026-09-16
      (emblem + three stat tiles + bonus pill + stacked buttons) in response to
      "less basic". It REPLACED the original four centred text lines rather
      than extending them, and no before/after was ever shown. The new version
      is live; reverting to the plain version while keeping the points and
      word-accuracy numbers as text is a small edit if it is not wanted.
- [ ] **Sentence-builder chip size unverified on a device.** `py-2.5` lands near
      the 44px tap-target minimum once a part-of-speech label is on the chip.
      `py-3` is the middle setting if it feels fiddly in the hand. Same pass:
      the hub's segmented rail and the drill header's wrapping stat line both
      want a look at small widths.
- [ ] **Placeholder Writing unit is on disk but unshipped.**
      `src/data/lessons/writing-*.js` (11 files) and `writingUnit` in
      `lessons.js`, commented out of `units`. Built for a misread request — the
      topics were wanted as sentence-builder drills, and now exist as such.
      Kept because the headers hold per-topic research, including which seven
      overlap an existing lesson. Delete them if a writing-specific LESSON is
      never wanted.

## Done — kept briefly so they are not re-opened

- [x] **`Txhob tsis` → `Tsis txhob` on `animals-tiger`** (`vocabulary.js`) —
      the particles were reversed. It is ALWAYS `tsis txhob`, never the other
      way round. ⚠️ This was not cosmetic: the sentence is live in the sentence
      builder, so the drill was handing out chips whose "correct" answer taught
      the reversed order. Everything in `stories.js` was already right.
- [x] **`txhob txwm` is a different word** — "intentional, deliberate", all
      through the Zong Vang story (`kev tua neeg txhob txwm`). The `gp-commands`
      drill matched a bare `txhob` and would have pulled a dozen homicide-trial
      sentences into a "Do Not" drill. Now matches the phrase `tsis txhob` only.
      Same shape as `ib puas` ("one hundred", not the yes/no particle), excluded
      from `gp-yesno` for the same reason. **Both are in the pattern comments —
      do not "simplify" either back to a bare word match.**

- [x] **Privacy policy + Data safety** — done. Play needs a publicly reachable
      URL, not only the in-app `app/privacy.jsx` screen, and the Data safety
      form has to match what is actually collected (Supabase auth + synced
      progress). Account deletion was already covered by `DeleteAccountModal`
      from `ProfilePage`, which is a separate Play requirement.
- [x] `src/data/readings.js`, the unfixed duplicate of `stories.js` — **deleted.**
      It appeared on this list for several days after it was already gone.
- [x] Hardcoded hex across the app → `src/lib/themeColor.js`, guarded by
      `check-theme.mjs`.
- [x] Six eyebrow specs → one `<Eyebrow>`, guarded by `check-theme.mjs`.
- [x] Reading module front doors — Home and the Words tab both pointed at the
      retired `/learn/readings` scaffold.

- [ ] **Weapons homonyms (2026-09-30), confirm with the author:** "kuv = spear" and "hais = to stab" were imported as given. They share spellings with *kuv* (I) and *hais* (to say). Is the spear *kuv* or *hmuv*? Is stab *hais* or *rhais* (cf. riam rhais)? — EVIDENCE 2026-09-30: the author's word list gives **Hmuv = a spear** and **Rhais = to pin, to step; a pin**.
- [ ] **neeg sib taus (2026-09-30):** imported as the author wrote it. Every other entry spells it *sib ntaus* (to fight each other). Is it "neeg sib ntaus"?
- [ ] **"tseb tsoo" = car crash (2026-09-30):** imported as the author wrote it, in misc-tsoo and its glossary copy. Car is usually *tsheb* (tseb = to scatter in the word list). Should it be "tsheb tsoo"?
