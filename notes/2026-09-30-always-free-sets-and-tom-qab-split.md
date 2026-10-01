# Eleven sets made always free, and tom qab split in two (2026-09-30)

Two author rulings, plus one deferral. Follows
[2026-09-30-word-definition-rulings.md](2026-09-30-word-definition-rulings.md)
from the same day.

---

## 1. `tom qab` — two entries, not one entry with two senses

**The first attempt was wrong.** The spatial sense was added to the existing
entry as a `senses[]` array, which rendered as:

```
tom qab
after (in time); back, behind (in space)
Also means
 • after — when sequencing events in time
 • back; behind — when describing physical space
```

The author: *"what I mean was like multiple distinct but connected entries, like
how it is for `rau`."*

**`rau` is the established pattern in this codebase.** It is three separate
entries, each in the category where that use is actually taught:

| id | category | gloss |
|---|---|---|
| `wear-verbs-rau` | wear-verbs | (verb: to put on footwear — shoes, socks) |
| `conjunctions-to-for` | conjunctions | to, for |
| `numbers-6` | numbers | six |

No `senses[]`, no "Also means". Three cards, three lessons, one written form.

**`tom qab` now matches:**

| id | category | gloss | example |
|---|---|---|---|
| `time-context-tom-qab` | time-context | `after` | Tom qab kuv mus. — After I go. |
| **`locprep-tom-qab`** *(new)* | locations-prepositions | `back; behind` | Tom qab lub tsev. — Behind the house. |

**Why the distinction is not cosmetic.** A `senses[]` list reads as one word with
a footnote. These are two uses met in two different lessons, and the failure it
prevents is concrete: a learner carrying only the temporal gloss reads
`tom qab lub tsev` as *"after the house"*.

⚠️ **Where each one lives matters.** The spatial entry went into
`locations-prepositions` rather than staying in `time-context`, because
`category` decides both the card's context tag and which sense renders —
`scripts/check-vocabulary.mjs` enforces this. A spatial gloss sitting in a time
category would fail silently in two places at once.

## 2. Eleven sets are now always free

The author named them by the titles that appear on screen. Mapped to ids and
added to `FREE_CATEGORY_IDS` in `src/lib/vocabAccess.js`:

| author's name | category id |
|---|---|
| Conjunctions | `conjunctions` (High-Frequency Conjunctions) |
| Common descriptions | `descriptions` |
| Tsev Neeg | `family-male-perspective` **and** `family-female-perspective` |
| Numbers | `numbers` |
| Days & Frequency | `timeframes-days` |
| Food | `food` |
| Animals 1 | `animals` |
| Clothing 1 | `clothing` |
| Head and Face | `human-anatomy-face` |
| Rooms of the house | `household-rooms` |
| Countries 1 | `countries` |

That takes `FREE_CATEGORY_IDS` from 8 sets to 20. Every id validated against
`categories` — no typos, no dead ids.

### Three judgement calls, stated so they can be reversed

**Tsev Neeg is two sets.** Family is split by SPEAKER PERSPECTIVE, and Hmong
kinship terms genuinely differ between a male and a female speaker. The author
named it once; freeing only one would hand half the learners a locked set for
the relationship words they actually use. **Both are free.**

`relatives` (Cov Txheeb Ze — Relatives & Extended Family) is a different and
much larger set and was not named. **It stays Pro.**

**"Animals 1", "Clothing 1", "Countries 1" are the first part of a split
series.** `scripts/check-splits.mjs` confirms: `animals`/`animals-2`/`animals-3`,
`clothing`/`clothing-2`, `countries`/`countries-2`/`countries-3`. Only part 1 is
free, which is what the "1" in the author's list says.

**"Days & Frequency" is `timeframes-days`, not `days-of-week`.** Exact title
match. `days-of-week` ("Days of the Week") and `timeframes` ("Timeframes & Time
of Day") are separate sets and stay Pro.

### ⚠️ This list is NOT derivable from path order

The 2026-09-28 free list was computed from position — the first seven path units
(`FREE_PATH_UNITS = 7`). **This one is not derived from anything.** It is an
explicit set the author picked by name, and the ids span path units 13 to 41.

Anyone "tidying" `vocabAccess.js` by recomputing it from `order` would silently
re-lock all twelve. The comment in the file says so at the point of danger.

### ⚠️ OPEN: the matching PATH UNITS are still Pro

`FREE_CATEGORY_IDS` gates the word sets, their generated `vocab-<id>` quizzes and
the sentence builder. **Path units are gated separately**, by position
(`path.js`: `u.free = u.order <= FREE_PATH_UNITS`).

So the units that teach this material remain locked:

| order | unit | uses |
|---|---|---|
| 13 | Joining Words | conjunctions |
| 21 | Common Describing Words | descriptions |
| 24 | Nouns by Purpose | household-rooms |
| 28 | Numbers | numbers |
| 30 | Family | family-male-perspective |
| 31 | Food & Drinks | food |
| 32 | Time of Day | timeframes-days |
| 33 | Yesterday & Tomorrow | timeframes-days |
| 38 | Body & Health | human-anatomy-face |
| 41 | Clothes & Wearing | clothing |

**Not changed, because it is a different decision with revenue consequences.**
The author listed *set* titles, and the sets are now free. Freeing these units
too would need an explicit exception list in `path.js` — the position rule
cannot express "units 13, 21, 24, 28, 30–33, 38, 41" — and would leave the paid
path with holes in it. **Awaiting a ruling.**

## 3. Deferred: classifiers in the noun quizzes

Author: *"we will prolly have to rework the quizzes to include the relevant
classifier in them too … but later."*

Recorded under **Deferred by decision** in [TODO.md](TODO.md) with the shape of
the problem while it is fresh — chiefly that the classifier is per-NOUN, not
per-set, so a set-level field ("Tools = `rab`") would be wrong the moment it is
convenient.

---

## Verification

```
scripts/check-vocabulary.mjs   67 tagged cards · each shows one answer ✅
scripts/check-sense-pins.mjs   all 2 pins valid ✅
scripts/check-splits.mjs       5 sets → 14 parts ✅
eslint                         clean
```

⚠️ `check-vocabulary.mjs` caught a real fault mid-change: **`english` and
`senses[0].en` must be the SAME STRING.** The `leej` edit had shortened `english`
while leaving the longer text in `senses`, and the script rejected it —
`category` decides both the context tag and which sense renders, so a mismatch
fails silently in two places. Both now read *"classifier used only for people —
never for animals or objects"*. **Run these three scripts after any vocabulary
edit; the failure they catch is invisible in the app.**
