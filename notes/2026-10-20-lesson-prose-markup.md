# Lesson prose, marked up: `###` headings and bolded Hmong — 2026-10-20

Three related changes to how a long intro reads. All of them came out of one
session on `pronouns.js` and `noun-classifiers.js`, and the first one is a bug.

## 1. `### ` was printing its own hashes

`IntroBody` knew `## ` (subheading), `> ` (example) and `---` (divider). The
author wrote `### 1. Family and relationship terms` in `noun-classifiers.js` and
the screen showed exactly that, hashes and all: a three-hash line fell through to
the plain-paragraph branch. Six headings in that one lesson were affected.

Fixed in [IntroBody.jsx](../src/components/learn/IntroBody.jsx) with a `### `
branch rendered as bold body text — a label inside a section, not a new section.

**It is checked BEFORE `## `**, and it has to be: `'### x'.startsWith('## ')` is
false only because of the space in the pattern. That is too thin a thread to hang
ordering on, so the explicit check comes first and the ordering stops mattering.

## 2. Hmong inside English prose is bolded and quoted

Author: *"if there is a hmong word/phrase within the english explainations,
please bold it and add a "" to convey distinguishment"*. `rich()`
([richText.jsx](../src/components/learn/richText.jsx)) renders `**...**` as
`font-semibold text-clay-700`, and it is applied to paragraphs, headings, and an
example's english and note.

**The hard part is telling Hmong from English, because the author quotes both.**
`"the,"` `"my,"` `"who"` and `"which"` are English words in quotes sitting in the
same sentences as `"tus"`, `"kuv lub tsev"` and `"haus dej"`. A blind quote → bold
pass marks the English ones too, which teaches the exact opposite of the point.

So the test is **the dictionary**: a quoted span counts as Hmong when every one of
its words is a headword in `vocabulary.js`, plus a short allowlist of classifiers
and function words (`tus lub daim phau txoj rab leej txhais li twg qhov …`) that
carry the grammar without being entries. English words are not headwords, so they
drop out on their own. A handful of spans are ambiguous in both languages — `no`
(Hmong "this"), `me`, `to`, `tau` — and a bare one of those is left alone, because
a wrongly bolded English word teaches a word that does not exist.

Result on `noun-classifiers.js`: 19 lines bolded, and `"my"`, `"my house."`,
`"which"`, `"who"` correctly untouched.

### Two rules the script follows, both learned the hard way

- **Never touch a `> ` example line.** Its left side is Hmong by construction and
  already rendered in clay by `ExampleLine`. Marking it up is redundant, and it
  fragments multiword phrases: an early pass on `pronouns.js` produced
  `> **"Nkawd"** ob **"leeg"** — the two of them` and had to be reverted.
- **Work line by line, not with a whole-file string-literal regex.** The first
  version matched `/'…'/` across the file and changed nothing: an apostrophe in a
  comment (`the author's, re-cut`) pairs with the next real opening quote and
  every boundary after it is off by one. It fails silently, which is the worst way
  for it to fail.

The script is a one-off and lives in the scratchpad, not the repo — it is recorded
here because the *dictionary test* is the reusable part, not the code.

## 3. `## Common classifiers` is now a block per classifier

Author: *"for the common classifiers, use what you did before to highlight space
them — but for the common ones, just focus on Lub (the extremely most common one),
tus"*, with a table of Tus / Lub / Daim / Phau / Txoj and, beside Txoj, *"iterate
and highlight this one in particular"*.

It was one paragraph naming five classifiers in five sentences, so nothing in it
could be found again. Now: `### "Lub"`, `### "Tus"`, a short run for `"Daim"` and
`"Phau"`, and `### "Txoj"` with its own paragraph. Lub and Tus stand in front
because they are what a beginner needs; the others are labelled as what they are.

**Every sentence is the author's, re-cut** — only the order, the headings and the
example lines are new. That is the rule set earlier the same day on the pronouns
intro (*"no no, i want the explaiantions still just space them out"*) after a
first attempt rewrote prose that only needed spacing.

**Why Txoj gets the last word:** it is the classifier an English speaker has no
instinct for. A street in English is just its name, so "Webster Avenue" feels
complete and the learner never notices `txoj kev` is missing. The other
classifiers get dropped by accident; this one gets dropped by reasoning. Its drill
note now carries the street-name case too, and `Lub` was moved ahead of `Tus` in
the examples step to match "the extremely most common one".

## If you are undoing any of this

- The `###` branch: deleting it brings the printed hashes back, so retire the
  headings in the lesson files first.
- The bolding is now plain text in the lesson data — there is no flag to flip.
  Reverting means stripping `**` from `noun-classifiers.js` and `pronouns.js`.
- The classifier blocks: the pre-2026-10-20 paragraph is quoted in full in the
  comment above the section in
  [noun-classifiers.js](../src/data/lessons/noun-classifiers.js).

---

## 4. Fifteen author sentences, and a spelling ruling (same day)

The author pasted fifteen sentences and said *"asdd this, combine the words that
are supposed to be combined, phoojywg, tabtom, xibfwb etc"*. They are now
`foundations-noun-classifiers-sentences`, an `examples` step between the
classifier drill and the quiz.

**The ruling is the important part.** The joined form is the house spelling, and
it settles a split the data has carried for a while — `xibfwb` and `naghmo` are
joined in `vocabulary.js`, while `poj niam`, `txiv neej`, `phooj ywg` and
`tab tom` are spaced, and `tagkis`/`tag kis` each appear twice. Applied to the
import and to the rest of this lesson:

| was | now |
|---|---|
| xib hwb | **xibfwb** |
| poj niam | **pojniam** |
| txiv neej | **txivneej** |
| phooj ywg | **phoojywg** |
| nag hmo | **naghmo** |
| tag kis | **tagkis** |

**Phrases stayed spaced**, deliberately: `kws kho mob`, `tsev noj mov`,
`ncuav mog qab zib`, `chav kawm`, `chav pw`, `qhov rooj`, `qhov rais`,
`thawj coj`, `tub kawm`, `sib ntsib`, `ua ntej`, `tom qab`, `ib sab`,
`xyoo tas los`. The ruling named compounds and their likes; it was not an
instruction to collapse every multiword noun, and the dictionary spaces all of
these. `dev` in sentence 9 is the author's and stays — the app's entry is `aub`,
both are current in the US, and the standing rule is never to "fix" one into the
other.

The repo-wide normalization is **not done** and is not a find-and-replace: see
the entry at the top of `## Content debt` in [TODO.md](TODO.md) for the three
things that break if it is (lookup/tokenizer matching on `hmongRPA`, the search
note at TODO.md:414, and ids/filenames which must not move).

### Why the step lives in the classifier lesson

These run 15–25 words, so `pathSentences.js` was out — the sentence builder's
chip cap is far below that and the import would have produced unbuildable
exercises. They are reading material, and an `examples` step is the one shape
that renders a long pair properly (Hmong first, English under it).

They are also `uas` relative clauses, which this lesson does not teach and no
lesson does yet. They sit here because every sentence is thick with classifiers —
`tus`, `lub`, `ob tug`, `phau`, `chav`, `txoj kev` — which is what the step asks
the learner to look for. **If a `uas` lesson is ever written, this step moves
there whole and keeps its id** (the id is a progress key).

---

## 5. The same pass on `sentence-structure.js`

Author: *"for sentence structure, bold every hmong word within the english
sentence"*. 29 lines bolded, and the compound joins from §4 applied in the same
run (25 lines: `tab tom → tabtom`, `nag hmo → naghmo`, `tag kis → tagkis`,
including the `> ` example lines and the quiz options, where the options and the
`answer` are joined together so matching is unaffected).

The script grew two rules here, both from mistakes it made on this file:

**A single Latin letter is never Hmong.** The dry run bolded `"I,"` in *"Hmong
verbs do not change their form to match "I," "you," or "he or she""* — because
the vowels are dictionary entries in their own right, so `i` passed the headword
test. A quoted letter in English prose is the letter. A missed bold in a vowel
lesson is the cheaper mistake, so single letters are now always skipped.

**The ambiguous list needs a per-file override.** `no` and `tau` are real in both
languages, so the script skips them by default — but in this lesson every single
occurrence is Hmong (`"no"` points to this one; `"Tau"` has its own `###`
section). A `--force=no,tau` flag turns them back on **after** reading each
occurrence in that file. Both were bolded here, correctly.

Left alone, correctly: `"I,"`, `"you,"`, `"he or she"`, and `"-ing."`.

**A separate scan looked for bare, unquoted Hmong** in the English prose, since
"every Hmong word" is not only the quoted ones. It found nothing — the only hits
were three English *"them"* (which is also Hmong for "to pay") and the `hmong:`
fields and quiz options, which are pure Hmong strings and are not prose. The
scan is worth re-running on any lesson that gets this treatment; it is the half
the quote-based pass is blind to.

---

## 6. Cross-references and a conclusion for `sentence-structure.js`

Author: *"for each part about the grammar, from tsis, to tense markers,
reference you will learn more about it in the dedicated lesson for it"* and
*"add a conclusion at the end that basically sums up and dumbs down the logic for
sentence building in a nutshell"*.

### Ten pointers, one per grammar section

Each grammar section now ends with a *"You will learn more about … in the …
lesson"* paragraph. Plain text, not a link — that matches how
`action-verbs.js`, `adjectives.js` and `yog-to-be.js` already point at other
lessons, and `IntroBody` has no link entry type yet (if it ever gets one, these
ten are the first customers).

| section | points at |
|---|---|
| 1. who + what happens | Pronouns |
| 3. noun phrase | Noun Classifiers · Mine & Yours · This & That |
| 4. describing words | Adjectives \| Describing Words |
| 5. classifiers | Noun Classifiers |
| 6. time | Yesterday & Tomorrow · Tense Markers |
| 7. verb markers | Tense Markers · Tau \| Did, Got & Can |
| 8. negative | Tsis \| No, Not & Don’t |
| 9. questions | Question Words · Yes or No \| Puas |
| 10. place | Nyob \| To Be: Where & How |
| 11. longer sentences | Conjunctions |

**⚠️ EVERY TARGET WAS OPENED AND CHECKED, not remembered.** A pointer to a lesson
that does not cover what it promises is worse than no pointer: the learner goes
looking and finds nothing. Two results of that check:

- **The place pointer was narrowed.** It first said *"**"nyob"** and the place
  words"*, but `nyob.js` never mentions `ntawm` — and neither does any other
  lesson. Section 10 teaches `hauv` / `ntawm` / `tom` and is currently the only
  place they are explained, so the pointer now promises `nyob` alone.
- **`tsis tau` is genuinely in `tsis-negation.js`** (one examples item, with a
  note covering all three senses), so naming it in the pointer is honest.

Sections 2 and 12 get no pointer: SVO and the pattern list have no lesson of
their own.

**Lesson titles are left unbolded** even when the title is a Hmong word (*"its
own lesson, Tsis — No, Not & Don’t"*, *"the Nyob lesson"*). A bolded,
quoted `**"Tsis"**` there would read as a word being taught rather than a place
to go, and it would sit inconsistently beside *Noun Classifiers* and *Mine &
Yours*.

### `## 13. In a nutshell`

Section 12, *"An easy way to remember"*, is the author's **pattern list** — the
formulas, for looking up. The new section 13 is the same content in **plain
language**, for understanding: say the words in the order you think them, nothing
changes shape, time in front, `tsis` before the verb, move nothing to ask,
description after the noun, place at the end, and a long sentence is just the
short one with pieces added around it.

**⚠️ EVERY HMONG SENTENCE IN IT IS ALREADY ELSEWHERE IN THE LESSON**, lifted from
the author's own examples (`Kuv noj mov.` §2, `kuv/koj/lawv mus` §1,
`Naghmo kuv mus tom khw.` §6, `Kuv tsis noj mov.` §8, `Koj noj dab tsi?` and
`Koj puas noj mov?` §9, `tsev loj` §4, `ib lub tsev` §5, `Kuv nyob hauv tsev.`
§10, `Naghmo kuv noj mov hauv tsev.` §11). A summary is the last place to
introduce new Hmong — the learner must be able to recognise every line — and the
standing rule is not to invent Hmong for the app.

### Bolding, re-checked after the additions

The §5 pass was re-run over the file and found **0 new lines** — the added prose
was written with `**"…"**` already in place. The bare-Hmong scan reports only
three English *"them"* and the two lesson titles above.

---

## 7. The other half: Hmong that was never quoted at all

§5 bolded Hmong the author had **already put in quotes**. Then the author
rewrote `action-verbs.js` and wrote `verb-noun.js`, both with the Hmong **bare**
in the English — *"The verb noj is still noj"*, *"mov means rice or food"*,
*"Learn ua tsaug as a complete phrase"* — and asked for the same treatment. A
quote-based pass finds nothing there; the words have to be identified first.

Done: **action-verbs.js, 27 lines · verb-noun.js, 29 lines.** Both re-run clean.

### The test is still the dictionary, but the failure mode is worse

When Hmong is quoted, a wrong guess only misses a highlight. When it is bare,
every English word that happens to be a Hmong headword becomes a false positive
**inside running prose** — and `them` (to pay), `mob`, `pub`, `tub`, `kos`,
`cia`, `no`, `me`, `to`, `so` are all real entries. Without a blocklist,
*"going to the market"* becomes *going **"to"** the market*. So the pass prints
every change for review and is only then applied.

Protected on the way through: already-bolded spans, straight-quoted text, and
**curly-quoted English** — “eats.”, “thank you”, “past tense”, “do thanks.”
Those are the author's English asides and must not be marked.

### Three rules it needed

- **Adjacent marks merge into one span.** `hauv tsev`, `ua haujlwm` and
  `mloog nkauj` are each two headwords; marked separately they render as
  **"hauv"** **"tsev"** — two unrelated words with four asterisks mid-phrase.
- **Phrases go into the vault as soon as they are marked.** Otherwise the
  single-word pass walks into the span just created and marks its second word
  again: `ua tsaug` came out as `**"ua **"tsaug"**"**`.
- **Headings are prose too** (`--headings`). `'## The classic example: ua tsaug'`
  is an English heading with a Hmong phrase in it; leaving it bare while the
  paragraph under it is marked reads as an oversight. `IntroBody` runs `rich()`
  over headings, so the bold renders.

### Two things it could not decide, left for the author

- **`action-verbs.js` line 69** reads *"**"Tab tom"** marks an action in
  progress. **Lwm** context aside, **"lawm"** often signals completion…"*. `lwm`
  is a real word (other, next), but in that sentence it reads like a typo for
  "Leaving context aside". Marking it up would make a slip look deliberate, so it
  is the one word in either file left bare.
- **`nkauj` (song, music) has no dictionary entry**, so the headword test could
  not see it in `verb-noun.js`. It had to be named explicitly to get marked. The
  gap is real — see TODO.md.

## 8. `## You will see this everywhere` (verb-noun.js)

Author: *"next iterate you will often see this pattern applied to everyday hmong
writing and conversation."*

The lesson explained the verb + noun pattern thoroughly and never said how much
of the language it accounts for, so a learner could finish it thinking it is a
short list of idioms to memorise. The new closing section says it is a
construction they will meet in almost every conversation and on every page, and
turns that into an instruction: when you meet a new verb, ask which noun usually
follows it. Only Hmong already taught in the lesson is quoted there.
