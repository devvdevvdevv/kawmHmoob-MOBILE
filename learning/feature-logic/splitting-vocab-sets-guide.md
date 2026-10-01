# Splitting a vocabulary set into parts — and primaries vs secondaries

*How the Vocabulary page is organised, and how to cut a big set into "Animals 1,
Animals 2, Animals 3" yourself. Written 2026-09-25, when the first six sets were
split.*

---

## The idea in one picture

Before, **Animals** was one deck of 48 words. That is a wordlist, not something
you study in one sitting.

After:

```
Animals 1   20 words   PRIMARY     dog, cat, chicken, pig, cow, horse…
Animals 2   17 words   secondary   sheep, bear, deer, monkey, ant…
Animals 3   11 words   secondary   whale, shark, dinosaur…
```

- **Primary** = the everyday words a learner needs first.
- **Secondary** = more specialised words, plus parts 2, 3… of a big set.

On a theme page, primaries show first under a **Primary** heading, then the
secondaries under **Secondary**.

---

## The one rule that makes this safe

**You never move a word.** Every word stays exactly where it is in
`src/data/vocabulary.js`. A split is a *list of word ids* in one table,
`SET_SPLITS`, and the app cuts the set up when it loads.

Why that matters:

| Thing | What keys it | What a split does to it |
|---|---|---|
| A learner's word progress (Learning/Known) | the **word id** | nothing: word ids never change |
| Notebook saved words | the **word id** | nothing |
| Quiz best scores | the quiz id `vocab-<setId>` | **part 1 keeps the original set id**, so its scores stay |
| Path units, lesson `vocab:` links | the **set id** | still point at part 1 |

So splitting can't wipe anyone's progress. It is also why part 1 must **always
keep the original id**: `applySplits` does that for you.

---

## How it's wired (read this once)

In `src/data/vocabulary.js`:

1. `RAW_CATEGORIES` is every set exactly as written. **Add words here**, as
   always.
2. `SET_SPLITS` says which sets are cut, and into what.
3. `SECONDARY_SETS` marks sets that are *not* split but are niche (war-conflict,
   botany…).
4. `applySplits(RAW_CATEGORIES)` produces the exported `categories`, which is
   what every screen reads. For each split set it makes one category per part:
   - part 1: id `animals`, title `Animals 1`, `tier: 'primary'`
   - part 2: id `animals-2`, title `Animals 2`, `tier: 'secondary'`
   - …and each word's `category` is rewritten to its part.

In `src/lib/senses.js`, `baseCategory('animals-2')` returns `'animals'`. A
part uses **its original set's** meanings, so a flashcard in "Relatives 2"
still shows the family sense of a word.

In `src/components/vocabulary/VocabGroup.jsx`, the theme page groups rows
under Primary / Secondary. It shows no headings if a theme has only one kind.

---

## Do it yourself: split a set

Say `weather` (22 words) gets too big.

**1. See the words.** Paste this into a scratch file and run it with `node`:

```js
import { categories } from './src/data/vocabulary.js'
const c = categories.find((x) => x.id === 'weather')
console.log(c.words.map((w) => `${w.id} = ${w.english}`).join('\n'))
```

**2. Decide the parts.** Go through the list and ask: *"Would a beginner say this
word this week?"* Yes → part 1. No → a later part. Aim for about **15–20 per
part**; the path caps a unit at 20 for the same reason.

**3. Add an entry to `SET_SPLITS`:**

```js
{
  id: 'weather',
  // title: 'Weather',  ← only if the set's own title is long or awkward
  parts: [
    { blurb: 'Sun, rain, hot and cold — the weather you talk about daily.', words: [
      'weather-sun', 'weather-rain', /* … */
    ] },
    { blurb: 'Storms, seasons and less common weather words.', words: [
      'weather-thunder', /* … */
    ] },
  ],
},
```

**4. Put the new part ids in a theme.** In `CATEGORY_THEMES`, next to
`'weather'`, add `'weather-2'`. Forget this and `check-splits` fails, because
the part would fall into "More".

**5. Run the checks:**

```
node scripts/check-splits.mjs
node scripts/check-vocabulary.mjs
```

`check-splits` tells you if you:
- typed an id that isn't in that set ✗
- listed a word twice ✗
- forgot a word: ⚠ it goes to the last part, so it isn't lost, but place it
  on purpose
- made a part too big ⚠

That's it. No screen needs touching.

---

## Mark a set secondary without splitting it

Add its id to `SECONDARY_SETS`. It moves under the **Secondary** heading on its
theme page. Remove it again to make it primary.

---

## Don't split these

- **The free fundamentals** (verbs, descriptions, conjunctions…). The path
  already curates them into 20-word units, and they are free. Splitting would
  only add clicks.
- **Relatives (Cov Txheeb Ze)**, or any kinship set. The author's ruling
  (2026-09-26): kinship is one system and must stay unified. It was split and
  then merged back.
- **The `reading-*` groups.** They are the story reader's dictionary, not
  decks. They also appear in check-vocabulary's `NOT_TOPICAL` list, which would
  need editing.
- **Any set a path unit uses with `limit`** (food, numbers, timeframes…). This
  is not dangerous, but if you do, add every part to that unit's `categories`
  **in order** (`['food', 'food-2', 'drinks']`). Otherwise the unit's word list
  changes under learners.

---

## Undo a split

Delete (or comment out) its entry in `SET_SPLITS`, and remove the `-2`/`-3` ids
from `CATEGORY_THEMES`. The words fall straight back into one set; nothing was
ever moved.

---

## Exercises

1. `countries` is split so Part 1 holds the countries Hmong families live in.
   Why is that a better "primary" than "the biggest countries"?
2. A new word `animal-nyuj-qus` (buffalo) is added to `animals` but not to
   `SET_SPLITS`. Where does it appear, and what does `check-splits` say?
3. Why would a category id like `numbers-10` break things? (Hint:
   `baseCategory`.)
