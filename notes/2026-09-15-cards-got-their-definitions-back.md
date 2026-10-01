# The cards got their definitions back

Continues `notes/2026-09-14-zong-vang-day-two.md`. Split on the date rollover.

## The report

> "look at mother, tub in family, they lost their definitions and design"

`niam` used to read **mother**. After the fluent review it read

```
mother (noun) · female / woman element in kinship, gender, and animal
compounds (compound-noun element)
```

and once senses became a numbered column, that became two stacked lines of
linguistic metalanguage on a card whose entire job is to ask *"what does niam
mean?"*.

⚠️ **The review text was never wrong.** It is a good dictionary line. It was
simply never written to be the front of a flashcard, and I imported it into
both roles without noticing they are different jobs. Earlier in this run I
explicitly decided to keep the review senses verbatim because trimming them
would be "editorialising". That was right about the reader and wrong about the
card.

## Two display-only fixes. No sense deleted.

**1. Strip the bare part-of-speech tail — 43 of them.** `(noun)`,
`(transitive verb)`, `(adjective)` tell a learner nothing on a card that
already states the meaning.

**2. Move grammar notes off lexical decks — 2.** "male-person / role element in
compounds" is not an answer to "what does tub mean?". True, useful, and it
belongs to reading.

```
niam    mother                              ← single sense, unnumbered again
tub     1. son; boy
        2. tub hluas = young man
sawv    1. stand  2. get up; rise  3. wake up  4. arise
```

The reader tap still reaches every sense through the merge — `tub` there is
still *son; boy · male-person / role element in compounds · tub hluas = young
man · tub ceev xwm = police officer*.

⚠️ **NOT applied to classifiers, conjunctions, pronouns or the other
function-word decks.** For those the grammatical description IS the meaning; a
classifier's whole job is grammatical, and stripping that would empty the card
rather than clear it.

## ⚠️ The script blanked a field, twice, and only the second guard caught it

First run wrote **`english: ''`** onto `tub`. Two hand-written entries have their
`senses` array spread over several lines, and the rewriter only ever looked at
`lines[senLine]` — so it matched nothing there, derived an empty list, and
joined it into an empty string. Restored from a byte-verified backup.

Then, with the span fixed, the run **refused to start**:

```
REFUSING: would blank english for the entry at line 985
```

`classifiers-khob` is `'(classifier for cups/glasses of liquid)'` — the whole
gloss is a parenthetical, so the tail pattern consumed all of it.

**Both bugs are the same bug**: a transform that can produce nothing, applied to
a field where nothing is indistinguishable from "not set". The rule that came
out of it:

> **A transform must never empty a field.** If the result is blank, the parse
> was wrong, not the data — stop and say so.

`stripPos()` now returns the original when the strip would leave nothing, and
the writer refuses outright on an empty derivation. The second bug was caught
by the guard written for the first, which is the only reason it cost a message
instead of a silent hole in the dictionary.

## Also

`kaum` was the last cluttered card outside misc — its `(numeral element)` sat
mid-string, so the trailing-tail rule correctly left it alone. Rewritten by
hand; the `nkaum` warning moved to the reading domain so the card shows two
clean lines and the tap still warns.

```
43 POS tails removed · 2 grammar notes moved · 22 entries cleaned · 0 empty glosses
```

Remaining tails are 41 in `misc` and 1 in `misc-phrases` — the reading
catch-alls, left alone deliberately.

---

## Two cards in the female-perspective deck said "undefined"

Found by the author looking at the deck, not by any checker.

```
family-female-perspective
  txiv        father
  undefined   mother      ← family-f-niam
  txiv        husband
  undefined   son         ← family-f-tub
```

⚠️ **My review applier did this.** It meant to comment out a duplicate ENTRY.
It commented out the line containing `hmongRPA:` — which **is** the whole entry
in the newer single-line format, and is **one field of a live object** in the
older multi-line format:

```js
{
  id: 'family-f-niam',
  // superseded by the niam review …
  // hmongRPA: 'niam',
  english: 'mother',        ← still live, now headless
  …
}
```

Two failures at once, and the second is the bad one:

1. The card renders the literal string **"undefined"**.
2. The entry is **invisible to lookup**, so the reader cannot reach it either.

`chim` and `kaw` were commented the same way and are fine — both single-line, so
the line *was* the entry. **The same code was correct on one format and
destructive on the other**, which is why the log said "+1 dupe commented" four
times and looked like a success.

### They were never duplicates

`family-f-niam` is not a copy of `family-m-niam`. The two perspectives teach the
same word from different sides and **both decks need their own card**. The
applier's "first in file order owns identity, suppress the rest" rule does not
apply to perspective-paired categories at all. Duplicate senses were already
handled in the right place — `wordLookup` dedupes on text when it merges.

Both restored. `family-f-tub` is now worded `'son; boy'`, identical to the male
entry: the dedupe is exact-text, so `'son'` next to `'son; boy'` slipped through
and the reader tap ended `"…police officer · son"`.

### The guard

`check-vocabulary.mjs` now fails on any entry missing `id`, `hmongRPA` or
`english`. Negative-tested by commenting out `ntxhais`'s headword the same way
the applier did — it reports the category, the id, and that lookup cannot find
it. Restore verified byte-identical.

⚠️ **Nothing caught this for a day.** Every consumer reads fields off whatever
object it is handed, so a missing field renders as "undefined" rather than
throwing, and the entry simply never appears in a lookup — a hole with no edge
to trip over. That is the third bug in two days whose whole signature was
*silence*.

---

## Reading is open to everyone

> "open reading for everyone, and unlock it, it's basically done now."

Two mechanisms were doing one job, exactly as `notes/TODO.md` had said since
2026-09-09: per-genre Pro gating (`free: true` in `stories.js`) and
`useDailyQuota('reading')` in the reader. Plus a third nobody had listed — the
story quiz's own `useDailyQuota('quiz')`.

### What changed

**Every genre carries `free: true`.** The mechanism is untouched and still
works: a genre without the flag is Pro, one word per shelf. Closing a shelf
again is deleting a word.

That single change already unlocks everything — `locked` in the library and the
genre page, and `quotaApplies` in the reader, are all `!g.free && !isPro`.

**The quota is commented out, not left inert.** This is the part worth keeping.
`free: true` alone would have left the hook running and metering nothing, and
the TODO's warning was exact:

> *A disabled gate that still runs is exactly the thing that comes back on at
> the worst moment.*

One shelf loses its flag in six months and readers silently start hitting a wall
nobody meant to rebuild. Restore hints sit at `const quotaApplies` in the reader
and `const quota` in the quiz, naming every line that has to come back —
including the imports, which are commented out too.

### ⚠️ `NO_QUOTA` is a module constant, and that is not cosmetic

The first version stubbed the quota inline:

```js
const quota = { ready: false, exhausted: false, consume: () => {} }
```

A fresh object every render, sitting in the dependency array of the consume
effect — so the effect re-ran on **every single render**. A dead gate costing
more than the live one did. eslint's `react-hooks/exhaustive-deps` caught it;
hoisting to module scope fixes it because the identity never changes.

### ⚠️ One thing genuinely regressed, and it was never about money

The story quiz's cap had **two** justifications in its own comment. Only the
first was monetisation. The second:

> *five questions with four options each falls to brute force in a few runs*

**That is now unguarded**, and it applies to a paying reader exactly as much as
a free one. If it comes back it wants a limit that is not tied to `isPro`.
Recorded in `notes/TODO.md` rather than quietly dropped.

### The `history` shelf

`stories.js` carried a comment flagging this one as a decision to make
deliberately: the Zong Vang account is a community memorial told with the
family's testimony, and putting it behind $7.99 should never have been inherited
from a default. The decision is made, and it is the same as everything else —
free.

```
verified for a signed-out guest (isPro = false):
  4 shelves    all open
  3 stories    none metered
  both quota hooks   no longer executing
```
