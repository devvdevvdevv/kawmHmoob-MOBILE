# Reading Support regrouped, tense patterns split out, Zong Vang quiz fixed (2026-10-19)

Four pieces of data work over 2026-10-18/19. All of it is content shape, not code:
no screen changed, and every check script passes.

---

## 1. Tense Markers split in two (2026-10-18)

`tense-markers` held two different kinds of card and could not be studied as one
deck: five WORDS that mark tense, and ten PATTERNS showing the forms they build.
Half the deck asked "what does this word mean", half asked "how is this tense
built".

| set | holds |
|---|---|
| `tense-markers` (5) | tab tom · yuav · tau · tseem · lawm |
| `tense-patterns` (10, new) | naghmo + sentence · tau + verb · thaum + tab tom + verb · subject + verb · twb + verb + lawm · tab tom + verb · tagkis + sentence · yuav + verb · mam li + verb · tab tom yuav + verb |

Same split as `tau` → `tau-uses` / `tau-examples`, which is why the new set looks
like those: it is the pattern already used in this file for exactly this problem.
The cards moved unchanged apart from their `category` field, and a pointer comment
sits where they used to live.

`tense-markers` is not in `FREE_CATEGORY_IDS`, so the new set is Pro by default —
no `vocabAccess.js` change was needed, and none was made.

### ⚠️ The patterns had to LEAVE the u-tense unit, and that was a real decision

Adding `tense-patterns` to `u-tense.categories` put the unit at FOUR categories,
and `scripts/check-path.mjs` caps a unit at three:

```
✗ u-tense bundles 4 categories — the design caps a unit at 3
```

There is no per-unit exception in the checker. So the options were to raise the
cap or to drop the patterns from the unit, and **the author chose to drop them**.
`u-tense` is back to 3 categories and 9 cards (the marker words), and the patterns
are a standalone set in the Words tab.

⚠️ **Removing the ids alone is not enough, in either direction.** A unit may not
list a word whose category it does not name — that is what the seven `u-calendar`
failures are. So the ten ids are commented out in place *and* the `categories`
entry is gone; restoring the patterns means putting both back, which also puts the
unit back over the cap.

⚠️ **Nothing links to the new set.** `foundations-tense-markers` still has
`vocab: 'tense-markers'`, so Tense Patterns is reachable only by browsing Words.

---

## 2. Reading Support regrouped — 109 words moved (2026-10-19)

The author: "go through the categories within reading support and rearrange the
words so that they're in relevant spots."

| set | before | after |
|---|---|---|
| **reading-general** | 128 | **60** |
| reading-motion | 108 | 124 |
| reading-qualities | 67 | 75 |
| reading-speech | 50 | 55 |
| reading-place | 36 | 48 |
| reading-mind | 41 | 44 |
| reading-time | 35 | 42 |
| reading-law | 34 | 38 |
| reading-emotion | 23 | 28 |
| reading-quantity | 24 | 28 |
| reading-work | 23 | 27 |
| reading-people | 50 | 50 |
| reading-body | 35 | 35 |
| **total** | **654** | **654** |

The clearest fixes were words whose own gloss named another set: `misc-khiav`
(run) was in **Feeling**, `misc-hlis` (month) in **Speaking**, `misc-haujlwm`
(work; job) in **Places**, `misc-thaum-ub` (long ago) in **Qualities**, `misc-kev`
(road; path) in **People**, `misc-ntuj` and `misc-ntiaj-teb` (sky, earth) in
**Body**, `wbs-nthos` (walk limply) in **Qualities**, `rw-nyob-twj-ywm` (fall
silent) in **Moving**.

Grouped by sense rather than by where they happened to land: medicine, poison,
opium and breath into **Body**; weather and sky into **Places**, where `cua`,
`nag` and `hav` already were; permission (`pub`, `kheev`) into **Law**, mirroring
`txwv`, to forbid.

### What was deliberately left alone

- **Multi-sense words whose gloss spans two sets** — `misc-tua` (kill / hunt),
  `misc-txaus` (enough / arrive), `misc-kav` (last / govern), `misc-cog` (plant /
  promise), `misc-luag` (laugh / others). Moving one of these relocates the
  ambiguity instead of resolving it. They need a sense split, not a new category.
- **`misc-kuv-txaus-siab-heev`** ("I am very pleased") belongs in Feeling and is
  still in Amount & Degree. The move script only touches entries that are ONE
  self-contained line, and this one spans several — so it was reported rather
  than guessed at. **Still open.**

### ⚠️ Ids keep their old prefixes, and that is on purpose

The moved cards still read `misc-`, `gen-`, `wbs-`, `phr-`, `rw-`. An id is
identity: renaming one orphans every sense pin, progress key and story pin that
names it. A prefix that no longer matches its category is cosmetic; a renamed id
is data loss. Each receiving set carries a dated comment saying the block was
regrouped, which is where the "why does this id say misc" question gets answered.

### ⚠️ reading-general is still 60 words, and shuffling cannot fix that

What is left is almost entirely **concrete things and nature**, which the theme
has no set for: `pob` (ball), `pob zeb` (stone), `ntoo` (tree), `nroj` (weeds),
`khoom` (thing), `roj` (oil), `ris` (trousers), `kab` (insect), `tsiaj txhu`
(wildlife), `hluav taws xob` (electricity). Two new sets — Things & Materials,
and Nature — would empty most of it. Not done: adding sets was not what was
asked for.

### 10 headwords appear twice inside Reading Support

Four look like genuine duplicates rather than sense splits, and all four are a
pair of the SAME word glossed twice by different imports:

| word | entries | glosses |
|---|---|---|
| `cwj pwm` | `misc-cwj-pwm` · `gen-cwj-pwm` | character; behaviour / attitude; behavior |
| `cawm` | `misc-cawm` · `gen-cawm` | both "to rescue; to save" |
| `kwv yees` | `phr-kwv-yees` · `gen-kwv-yees` | to estimate (both, same set) |
| `lees` | `misc-lees` · `gen-lees` | admit / confess (both in speech) |

The other six (`cuab`, `zaum`, `pab`, `tshaj`, `tuag`, `kos`) are legitimate
one-entry-per-meaning splits — the pattern the dictionary is supposed to use.
**Collapsing the four is still open**, and was not done unasked: which gloss
survives is an author call.

---

## 3. Two sentences corrected, from the author

Both verbatim, with no tidying of the surrounding text:

- `question-words-why` — `Koj tsis tuaj vim li cas?` → **`Vim Licas koj tsis tuaj?`**
- `Zwj Teeb (formal)` — the trailing `yog` → **`lov`**: `Nagkis yog Zwj Teeb lov?.`

⚠️ **Two loose ends on the first one.** The entry still carries `source: 'ai'`,
which marks it as unreviewed machine text and keeps it out of the sentence
builder — now false, since the sentence is the author's. And the headword is
`vim li cas?` (spaced) while the sentence says `Licas` (joined), so the headword
no longer appears in its own sentence: `import-sentences.mjs` would reject that
pairing if it came through again. Neither was changed, because which spelling is
right is not a mechanical question.

---

## 4. Zong Vang: the testimony answer, and a length tell

The author rewrote the correct answer for "What did Zong's parents testify at Omer
Ninham's trial?" to include *"only to find the exact same evil they were fleeing
from in another country"* — matching ¶26, which says they fled evil only to find
it again in another place.

**That created a giveaway.** The correct answer ran ~35 words and the three
distractors were single clauses of 9–11. The question could be answered without
reading a word of Hmong, by picking the long one.

All three distractors were rewritten to 31–36 words — dramatic, plausible, and
each false for a specific reason checked against ¶23–29 first:

| | words | why it is wrong |
|---|---|---|
| ✓ answer | 35 | ¶26 |
| Pathet Lao allies (kept, lengthened) | 36 | the testimony was about grief, not politics — and Hmong families who fled were generally on the other side of that war |
| recognized the boys, warned police | 31 | no warning to police appears anywhere in the story |
| begged Zong not to go out | 34 | nothing about that evening being argued over at home |

> **The rule worth keeping: in a comprehension quiz, option LENGTH is part of the
> answer.** A correct answer that is three times longer than its distractors
> tests nothing. If an author lengthens one option, the others have to follow.

`supabase/payloads/story-zong-vang.json` was regenerated with
`scripts/export-stories.mjs`. ⚠️ **It has NOT been published** — `publish-story.mjs`
is a separate, outward-facing step.

---

## Verification

Every number above was read from the data, not remembered. Passing after all of
it: `check-vocabulary`, `check-reading` (6 stories, 66 questions, 493 glossary
entries), `check-splits`, `check-sense-pins`, `check-undefined-refs`, `eslint`.
`check-path` is down to its 8 pre-existing failures — seven `u-calendar`
day-of-week words outside their categories, and `u-common-nouns` at 22 words over
a 20 cap. Those were red before any of this and are untouched.

The regroup itself was applied by a script that refuses to guess: it moves only
single-line entries, reports anything that spans lines, and skips a word already
in its target set. Word count before and after is identical (654) and there are
no duplicate ids.

Related: [2026-09-28-verb-noun-and-nouns-by-purpose],
[2026-09-20-vocab-batch-import], [2026-09-13-zong-vang],
[2026-09-14-zong-vang-day-two], [TODO].
