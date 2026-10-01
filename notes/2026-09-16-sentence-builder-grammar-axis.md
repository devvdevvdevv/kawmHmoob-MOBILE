# The sentence builder gets a grammar axis, and a UI pass (2026-09-16)

Three things: a second way to slice the drill pool, a Hmong correction that was
being taught wrong, and a pass over the drill's own layout.

Companion to [2026-09-16-vocab-depth-not-breadth-and-grammar-grouped] and
[2026-09-16-writing-unit-and-challenge-todo].

---

## 1. ⚠️ First, what this replaced — a misread worth recording

"Grammar modules for writing text" was read as **Learn-tab lessons**. Eleven
placeholder lessons and a `writingUnit` were built, then a Grammar tile was
added to the Words hub pointing at `/learn/grammar`.

That was the wrong thing. The request was for **more grammar drills inside the
sentence builder** — the topic list (sentence order, tsis/tsis txhob, yes-no
questions, negation, connectors, discourse particles) was a list of DRILLS, not
a curriculum.

Both the tiles and the unit are commented out. The eleven placeholder files stay
on disk; their headers hold the per-topic research.

> **A list of topics is not a list of screens.** The same eleven words meant
> "eleven lessons" to me and "eleven drills" to the person asking, and nothing
> in the phrasing distinguished them. The tell was available and ignored: the
> sentence builder already had a Grammar & Function group, i.e. the feature
> being asked to grow already existed.

---

## 2. The grammar axis

`GRAMMAR_PATTERNS` in `src/lib/sentenceBuilder.js`, surfaced on the hub.

### The realisation that made it cheap

A grammar drill needs **no new content**. Whether a sentence demonstrates
negation is readable from the sentence ITSELF — it contains `tsis`. So grammar
groups derive from the text exactly as theme groups derive from the category.

This answers the judgement question left open in
[2026-08-29-sentence-builder-groups-and-surface] — *"would a second axis be
better, and what would it cost in data that does not exist yet?"* Measured
answer: **eleven drills, zero new sentences.**

```
117  Pronouns              kuv, koj, nws
 68  Classifiers           tus, lub, cov
 42  Numbers and Counting  ib, ob, peb
 26  Coming and Going      mus, tuaj, los
 15  Family and Whose      niam, txiv, kwv tij
 11  Where Things Are      nyob, hauv, ntawm
 10  When It Happens       hnub no, tag kis
  8  Finished, and Not Yet lawm, tau
  8  Yog — To Be
  8  Wanting and Will      xav, yuav
```

Four more are defined and **hidden below the 5-sentence threshold** — they will
appear on their own as sentences are written, the same contract the theme groups
have. That list is in `TODO.md` as content debt.

### ⚠️ Three traps, all the same shape

A pattern is a word match, and a word match is confidently wrong in ways a
parser would not be:

| trap | what it would have done |
|---|---|
| `txhob txwm` = "intentional, deliberate" | bare `txhob` pulled a dozen homicide-trial sentences from the Zong Vang story into a "Do Not" commands drill |
| `ib puas` = "one hundred" | `puas` taught *"Ib puas tus neeg"* (a hundred people) as a yes/no question |
| `ib` is a NUMERAL, not a classifier | inflated Classifiers by ~23 and mislabelled the word; moved to `gp-numbers`, count 86 → 68 |

All three are recorded in the pattern comments. **Do not "simplify" any of them
back to a bare word match.**

### ⚠️ Ids are prefixed `gp-`, and that is not decoration

The theme groups already contain one called `grammar-words`, so the obvious name
was taken. A bare id colliding across two group KINDS is precisely the
consonantGroups/vowelGroups bug in `reference.js`, where both use
`'single'`/`'double'` and a lookup lands silently in the wrong section.

---

## 3. ⚠️ `Txhob tsis` → `Tsis txhob` — the data was teaching it backwards

`vocabulary.js`, on `animals-tiger`:

```
was:  'Txhob tsis mus ze tus tsov ntawd.'
now:  'Tsis txhob mus ze tus tsov ntawd.'
```

The order is fixed: it is **always `tsis txhob`**, never the reverse.

This was not cosmetic. **The sentence is live in the sentence builder**, so the
drill was handing out scrambled chips whose "correct" answer taught the reversed
order — a learner could only get it right by being wrong. Everything in
`stories.js` was already correct.

Found by showing a drill sample to the person who speaks the language, which is
the only check that catches this class of error. `scripts/check-*` verify
structure; nothing automated knows the particles have an order.

Consequence worth knowing: commands were also split out of `gp-negation` (an
order is not a statement being negated), which dropped plain negation to **4**
— below the threshold, so the Negation drill is currently hidden. One more
`tsis` sentence brings it back.

---

## 4. The UI pass

### The hub: two stacked lists → one switchable

Grammar (11 cards) had been stacked above Topic (9), making a ~23-block scroll.
They are two slices of ONE pool and nobody wants both answers at once. Now
`SegmentedTabs` — the house pattern from the Speak tab, and the one the 08-29
note proposed for exactly this.

Rows went three lines to two: the count moved to the right as a bare number, the
blurb stayed (it is what tells you what `gp-aspect` actually drills). Both axes
render through one `DrillRow` — two card designs for two views of one pool is
how they drift apart.

### The drill: two lines removed, one of them a bug

The prompt card carried an eyebrow `BUILD THIS`, the English, and
`from Animals · teaches "miv"`.

⚠️ **That third line was a hint.** Naming the word the exercise teaches tells
you one of the Hmong chips *before you start* — the answer leaking into the
question. Moved to the feedback panel, where after answering it is context worth
reading. The eyebrow is gone; a sentence above an empty dashed slot does not
need a label saying so.

Also: the tray instruction now shows on sentence 1 only (an instruction followed
four times is furniture), and four bands of header chrome became two — counters,
quota badge and progress bar share a wrapping line. **Nothing was removed** from
the header; the badge still shows mid-drill, which was deliberate.

### Chips: vertical only

`py-4` → `py-2.5`, row gap `2.5` → `2`, tray `min-h` 112 → 88. Roughly 60px back
on a nine-chip sentence, straight to Check sitting higher.

⚠️ **`px-4` and `min-w-[76px]` are unchanged on purpose.** They keep `ib` from
becoming a sliver, and `min-w` is what the part-of-speech LABEL needs —
"Classifier" is wider than every Hmong token in the set. Only the vertical was
excessive: 16px above and below a 24px word is more air than word.

**Not verified on a device.** `py-2.5` lands near the 44px tap-target minimum
with a label; `py-3` is the middle setting if it feels fiddly.

---

## What was deliberately NOT changed

Recorded decisions left alone, so they are not re-litigated by accident:

- **Chips stay big** — "the controls AND the content" (08-29).
- **Clear stays filled and BELOW Check** — a ghost disappeared into the page,
  and beside Check the two read as equals. Only its SIZE changed: full-width
  danger-red for an undo shouted louder than the action it undoes.
- **The bank stays mounted with a measured min-height** — that is what stopped
  Check drifting out from under a finger.
- **Mixed practice stays the hero** — it is the honest test.

Related: [2026-08-29-sentence-builder-barebones],
[2026-08-29-sentence-builder-groups-and-surface],
[2026-09-12-sentence-builder-scoring-and-words-hub].
