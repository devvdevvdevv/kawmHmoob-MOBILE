# About rewritten, the paywall's early-access card, and three small fixes (2026-10-14)

Four author instructions in one session.

## 1. About: archived, rewritten, and given a UI

*"archive the about page's text. Rewrite it so it does not sound like ai. next,
please implement a better ui for it so its not just text on solid background."*

Archive: `archive/2026-10-14-about-page/` — the screen file (which carried BOTH
the shipping page and `AboutBefore()`, the pre-09-28 version as a dead function)
plus `about-text.md`, every version's wording as prose, including the population
table and its uncited figures.

**The rewrite's main change is voice: it says "I", not "we".** The old page said
"we want to hear it" two inches below "built by one person", and a comment in the
file had flagged that as the author's editorial call. It is settled now.
"We/us/our" survives only where it means Hmong people, not the app. Section
titles went plainer ("Why we are careful" → "Where I would rather say nothing").

⚠️ **TWO THINGS DELIBERATELY NOT TOUCHED:**
- **The dedication sentence**, word for word. It is the author's own line.
- **The bio stays thin.** Nothing was invented about where the author is from or
  who he learned from. A comment marks that card as the place to add it.

⚠️ **AND WHAT THE PAGE MUST NEVER CLAIM:** that every word in the app is
human-written. Two sentences were cut on 2026-09-21 ("nothing ships unread", and
"every lesson, recording, translation and line of code here is one person's
work") because AI-written example sentences ship before a speaker has read them.
Both are still false. A ⚠️ comment in `app/about.jsx` says so.

UI: each section is a cream card with an icon chip; the dedication is the one
feature card; a **row of three derived numbers** (words / units / stories, read
off the data at launch) replaced the wall of prose at the top; the two-names
explanation moved from the hero to a small inset note; Contact and Privacy became
full-width rows with arrows. Version now reads from `expo-constants` instead of a
hardcoded "1.0".

## 2. Paywall: the "built by one developer" card, in the author's words

*"we need to make it so that it has relevant information, and rewritten so it's
less ai ish"* — with a draft supplied.

The heading is the author's verbatim: **"Built by a single developer, and
actively in development"**. Subscribers get his closing thank-you line instead of
the pitch.

**Relevant information = the same derived counts** (41 course units, 2,056 words,
6 stories) under an "In the app today:" label. It does the work for "this is only
the beginning" in both directions: the catalogue is real, and it is small.

Three edits to the draft, with reasons:
- "coming **very soon**" → "coming as development goes on". ⚠️ A date promise on
  a paywall is one users quote back and App Review notices — and the card's own
  comment already carried the rule: no dates, no future counts, no price promise.
- Dropped the four-part parallel ("supports directly, accelerates, propagates,
  helps preserve") to three clauses. That rhythm is the most AI-sounding thing in
  any draft, and "propagates" is not a word anyone says.
- "updated & accurate Hmong content" → "Hmong that keeps getting corrected and
  checked by speakers". Same claim, says how.

## 3. `oi` is not a Hmong vowel

Commented out in both places it appeared in `src/data/reference.js` — the flat
`vowels` array and `doubleVowels`, which is what the Reference grid renders.
Commenting only one would make the grid and the list disagree, so each comment
points at its twin. Follows the `aa` precedent (Green Hmong, cut 2026-09-28).

⚠️ **The data corroborated the author**: zero of 2,056 headwords contain `oi`,
and the entry had carried a `TODO-VERIFY` since it was added, saying *"the
recording existed but the letter was missing from this list entirely"* — someone
had added a vowel to match an mp3. Typing pool unchanged at 1321, which is the
proof no word needed it.

Leftover: `hmong-double-vowels-oi.mp3` is now unreferenced but still bundled
(49 such clips now). Harmless; left on disk as evidence until the re-record.

## 4. Mark Learning no longer advances the daily session

*"for daily flashcards, comment out the logic that makes the flashcards go
forward when mark learning is hit."*

⚠️ **SCOPED WITH A PROP, NOT A DELETION, because the callers disagree on
purpose.** The advance lives in the shared `Flashcard`, used by six screens:

| screen | Mark Learning | Mark Known |
|---|---|---|
| **Daily session** (`/words/session`) | **stays** ← changed | stays |
| Review (`/review`) | advances | advances |
| Path unit deck, category deck, notebook | advances | stays |

Review keeps both marks advancing because the author asked for exactly that on
2026-09-28. `mark()` in `Flashcard.jsx` now records all three requests
(09-25, 09-28, 10-15) and which callers disagree, so nobody "simplifies" it.

Side effect worth having: the hint under the card already read *"Mark the card,
then tap → for the next one"*, which was only half true. It is true now.

## Not verified

None of this has been seen on a device. For About, the stat row at narrow widths
and the 2xl serif dedication are what to look at.
