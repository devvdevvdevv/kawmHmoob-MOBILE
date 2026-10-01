# Vocabulary page reorganised; big sets split into primary + secondary parts (2026-09-25)

**The author:** "go through the current vocab datasets and reorganize … some sets
maybe too big, especially for the non fundamental ones, we need to separate,
like work 1, work 2, etc. Primaries, and secondaries. Add to notes, guide on how
to as well."

**How-to guide:** `learning/feature-logic/splitting-vocab-sets-guide.md`

## 1. Big sets split — declaratively, no word moved

`src/data/vocabulary.js`:
- The array is now `RAW_CATEGORIES`; the old export line is kept in a `Was:`
  comment.
- `SET_SPLITS` lists each split set's parts as word ids.
- `applySplits()` builds the exported `categories`.

| set | → parts (words) |
|---|---|
| animals (48) | Animals 1 (20) · 2 (17) · 3 (11) |
| agriculture-foodstuffs (61) | Fruit & Vegetables 1 (20) · 2 (20) · 3 (21) |
| buildings (53) | Buildings 1 (20) · 2 (18) · 3 (15) |
| countries (46) | Countries 1 (19) · 2 (14) · 3 (13) |
| relatives (31) | Relatives 1 (16) · 2 (15) |
| clothing (26) | Clothing 1 (15) · 2 (11) |

- **Part 1 keeps the original id and is PRIMARY:** the everyday words, picked
  by hand. Parts 2+ are `<id>-2`, `<id>-3`, and are **secondary**. Countries 1
  deliberately holds the countries Hmong families live in (US, France, Canada,
  Australia, Germany) alongside Laos and its neighbours.
- **Progress is safe.** Word ids never change (vocabProgress, notebook). Part 1
  keeps the set id (quiz scores `vocab-<id>`, lesson `vocab:` links). No path
  unit uses a split set.
- **A split entry may carry `title`** to replace a long original ("Cov Txheeb
  Ze — Relatives & Extended Family" → "Relatives 1").
- **Unlisted words go to the last part**, so none are ever lost.
- **Not split:** the free fundamentals (verbs 28, descriptions 27, conjunctions
  24), because the path curates them. The `reading-*` groups are the reader's
  dictionary.

`SECONDARY_SETS` marks 10 unsplit niche sets as secondary: war-conflict,
arts-culture, ethnicities, botany, geography, internal organs, seasons-time,
calendar, clothing-verbs, and family-female-perspective (the second pass of
kinship).

## 2. The meaning bug a split causes — fixed

A split part has a new category id, but its words' tagged `senses` still name
the **original** set. `check-vocabulary` caught it on *vaj loog*: its flashcard
would have found no in-domain sense. `relatives-2` would also have stopped being
the `family` domain.
- **`src/lib/senses.js`:** new `baseCategory('animals-2') → 'animals'`.
  `domainOf` resolves through it. Flashcard, VocabList and WordDetail all go
  through `domainOf`, so all three are covered.
- **`scripts/check-vocabulary.mjs`** uses the same base rule.
- This relies on **no real category id ending in `-<digits>`**, which the new
  check enforces.

## 3. Themes reorganised — fundamentals first

`CATEGORY_THEMES` has a new order, and the old layout is recorded in a comment
above it:

1. **Grammar Essentials** (`grammar-words`, all free): gained quantifiers (from
   time-numbers), locations-prepositions (from home), and conjunctions and
   discourse-particles (from everyday).
2. Greetings & Everyday
3. Describing
4. People & Family
5. Time, Numbers & Money
6. **Food & Kitchen** (new id `food-kitchen`)
7. Nature & Animals (`living-world`, food removed)
8. Home & Places
9. Clothing
10. The Body
11. **Countries & Culture** (retitled)
12. Reading Support (unchanged)

- **Theme ids were kept** wherever the meaning held. They are routes, sentence
  topic ids and accent keys.
- **`src/lib/vocabAccent.js`:** colours were re-assigned for the new order, and
  `food-kitchen` added. They were checked pairwise, so no two neighbours match.
- **`VocabGroup.jsx`:** the theme page shows **Primary** and **Secondary**
  headings with a one-line blurb each. They only appear when a theme has both.

## 4. New check — `scripts/check-splits.mjs`

It fails on:
- a listed id that isn't in the set
- a word listed twice
- a real id ending in `-<digits>`
- a part in no theme

It warns on an unplaced word or a part over 22. Current result: **clean, 6 sets
→ 16 parts.**

## Side effects to know

- **Sentence builder topics:** the **Everyday** topic drill disappeared. Its
  sentences came from conjunctions and particles, which moved into Grammar
  Essentials, and that drill now has them (64, free). Food & Kitchen has no
  topic drill (fewer than 5 human sentences). Grammar drills are unaffected.
- The vocab page now has **87 categories** (was 77).
- **Data issues seen, not fixed:**
  - `buildings-xauj`, `buildings-yuav` and `relatives-kuv` have **empty English**.
  - `animals` holds goat twice (`animal-tshis`, `misc-tus-kas`) and mouse/rat
    twice.
  - All of these were put in the last part of their set.

## Checks

check-splits, check-vocabulary, path, refs, theme, notes and reading all pass.
Lint is clean on the changed files. **Not opened on a device.** Look at a theme
page with both tiers (Nature & Animals), a split part's flashcards (Relatives 2),
and the hub order.

---

## Update 2026-09-26: Relatives (Cov Txheeb Ze) un-split

**The author:** "combine the cov txheeb ze sets, good job on the idea, but that one
in particular needs to be unified."

- The `relatives` entry in `SET_SPLITS` is **commented out**, with the reason and
  a restore hint. `relatives-2` was removed from the People theme (the old list
  is kept in a `Was:` comment).
- **The result is one deck again:** id `relatives`, title *"Cov Txheeb Ze —
  Relatives & Extended Family"*, all 31 words, primary. No word moved, so there
  was nothing to move back: the split only ever lived in `SET_SPLITS`.
- **Why kinship is the exception:** Hmong kinship is one system. The "finer
  distinctions" (in-laws, whose-side aunts and uncles) are the point of the set,
  not an extra, and splitting it hid half the family from anyone who stopped at
  part 1.
- `check-splits`: clean, now **5 sets → 14 parts**. Vocabulary, path and refs
  checks pass.
- A quiz score saved under `vocab-relatives-2` (a day old at most) is orphaned.
  Scores under `vocab-relatives` are untouched.
