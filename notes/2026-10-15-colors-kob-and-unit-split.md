# Colors: `kob` stripped, and the unit separated from describing (2026-10-15)

Two author instructions, one subject.

## 1. `kob` removed from the colour names

*"For colors, remove the kob, and just leave the color names."*

All 14 colour headwords in the `colors` category lost the prefix: `kob liab` →
`liab`, `kob txiv kab ntxwv` → `txiv kab ntxwv`.

⚠️ **KEEP THE REASON, because `kob` is not a mistake.** The author's ruling,
recorded at the head of the category in `src/data/vocabulary.js`:

> **`kob` and `xim` both mean "colour".** `kob` is the NATIVE Hmong word (also a
> shade, or a group of something); `xim` is a loanword, from Thai/Lao and
> Chinese, and also means colour.

So `liab` is "red" and `kob liab` is "the colour red" — neither word belongs in
front of a colour NAME. `xim` keeps its own entry (`misc-xim`, "colour"). There
is no entry for `kob` yet; if one is wanted it is a word meaning "colour /
shade", not a prefix.

### ⚠️ It created duplicate headwords, so two entries were commented out

A misc import had already put bare `daj` (yellow) and `liab` (red) in this same
category. After the strip the category held each word **twice** — two flashcards
with the same front, and a quiz able to ask "yellow" with two correct answers.
`misc-daj` and `misc-liab` are commented out (restore hint in place); the
`colors-*` ids keep the words, since they carry the real tags and no draft flags.

`misc-daj`'s sentence was moved up to `colors-yellow` on the way out: it was the
same sentence **with the classifier** — `Lub paj no daj`, not `Paj no daj`.
`misc-liab`'s was left behind; choosing between two AI-written sentences is the
author's call, not a side effect of de-duplicating.

### ⚠️ Four colours are now named after the thing, not the colour

This is where `kob` was doing real work, and it is **open for the author**:

| entry | headword | also means |
|---|---|---|
| peach | `nqaij` | meat / flesh (`food-meat`) |
| gold | `kub` | hot (`weather-kub`) |
| silver | `nyiaj` | money (`money-nyiaj`) |
| brown | `kas fes` | coffee |

`kob nqaij` was unambiguously "flesh colour"; bare `nqaij` glossed "peach" sits
next to `nqaij` glossed "meat". The six true adjectives (liab, xiav, dub, dawb,
daj, ntsuab) have no such problem. Options: keep `kob` on those four, gloss them
"peach (colour)", or leave it.

Six example sentences in the category still use `kob` as a noun ("Kob xiav
zoo."). Left alone deliberately: they are correct Hmong and they show the word in
use, which is the opposite of the problem the strip fixed.

Verified: no headword in the vocabulary contained `oi`-style collisions after the
change; `check-vocabulary`, `check-sense-pins` and `check-path` pass; the typing
pool moved 1321 → 1319, which is just the two commented-out duplicates leaving.

## 2. Colors is its own unit now

*"seperate colors, and describing things into two seperate paths, colors it's own
thing, adjectives it's own things. Colors must be distinct."*

⚠️ **The word lists were already separate** — nothing moved:

| # | unit | category | teaches |
|---|---|---|---|
| 20 | Describing Words | `adjective-grammar` | the patterns (`noun + adjective`, `adjective + heev`) |
| 21 | Common Describing Words | `descriptions` | the adjective vocabulary |
| 40 | **Colors** | `colors` | the 15 colour names |

What mixed them was unit 40's **framing**, which had borrowed the adjectives'
whole identity. Changed in `src/data/path.js`:

- title `Colors & Describing` → **`Colors`**
- blurb "Your first adjectives — and where they sit." → "Liab, dub, dawb —
  naming the colors."
- why: "Teaches noun-then-adjective order" → its own argument. ⚠️ That order is
  unit 20's entire subject; it was never unit 40's job, just its borrowed excuse.
- **`introLesson` dropped.** It pointed at `grammar-adjectives` ("Describing
  things"), which units 20 and 21 both legitimately use. No Learn lesson teaches
  colours (nothing has `vocab: 'colors'`), so the unit starts at Flashcards, the
  way Family and Food do.

Position unchanged at 40, before Clothes & Wearing — which is what describes
things with colours (`lub tsho liab`). "Distinct" argues for keeping the
distance.

`check-path`: 41 of 41 units still live, unit 40 reads 15/15.

## Settled later the same day (2026-10-15)

All three of the questions this note left open came back answered in one line:
*"fix … for colors, yes thats correct, nqaij does mean peach, nyiaj is silver etc
youre right"*.

- **Unit 40's Hmong title is `Cov Kob`**, not `Cov Xim`. The native word carries
  the title, since preserving the language is the app's whole argument; `xim`
  keeps its dictionary entry, being a real word in use. ⚠️ Still unattested as a
  phrase — a fluent speaker should confirm it.
- **Unit 20 renamed `Describing Words` → `How Describing Works`.** It was a
  near-twin of unit 21's `Common Describing Words`, for two different things: 20
  teaches the PATTERNS, 21 teaches the WORDS. The new name follows the path's own
  convention for a pattern unit — unit 5 is "How a Sentence Is Built". ⚠️ Unit
  ids unchanged, so no progress moved.
- **The four thing-named colours are CORRECT as they stand.** No `kob` goes back
  on `nqaij` (peach), `nyiaj` (silver), `kub` (gold) or `kas fes` (brown). One
  word with two meanings is the normal case in this dictionary, handled the
  documented way: one entry per meaning, each in its own category, with
  check-vocabulary's domain check keeping the food gloss off a colour flashcard.
  ⚠️ The ruling is written at the head of the `colors` category so nobody
  "fixes" it back.

`check-path` and `check-vocabulary` pass; 41 of 41 units carry a Hmong name.

## Still open

- Nothing from this note. The next adjacent question, if it matters, is whether
  `kob` deserves a dictionary entry of its own ("colour / shade") alongside
  `misc-xim`.
