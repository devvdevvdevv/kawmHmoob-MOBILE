# One word, numbered definitions: how the dictionary switch works

*How a tap on `yog` went from "if · to be / equals" to a numbered list that knows
which meaning the sentence uses, and how you add those markers yourself. Written
2026-09-26.*

---

## The problem, concretely

Open the movie story and tap **yog** in *"Nws yog Yaj, tus neeg muag daim pib"*
("He was Yaj, the ticket seller"). Before the switch, the sheet said:

> **yog** — if · to be / equals

Two things were wrong:

1. **It couldn't tell which meaning this sentence uses.** Here it's "to be", but
   "if" was shown first.
2. **"if" came first by accident.** The Conjunctions set sits earlier in
   `vocabulary.js` than the `yog` set, and the lookup glued meanings together in
   file order.

Search had a cousin of the same bug. `yawg` appeared **three times**, once for
each family deck it's in.

---

## The key idea: cards are shelves, the dictionary is the catalogue

There are two different things that both look like "a word entry":

| | **A card** (vocabulary entry) | **A dictionary headword** |
|---|---|---|
| what it is | one row in `vocabulary.js`, with an `id` | everything the app knows about one spelling |
| lives in | one deck (Conjunctions, Family…) | nowhere; it's built at startup |
| used by | flashcards, quizzes, the notebook, progress | the tap sheet, search, the word page |
| how many for `yog` | 2 (`conjunctions-if-short`, `yog-to-be-is`) | 1 |

**Why not just merge the two cards into one?** Three reasons, each a real bug:

- A **Conjunctions quiz** must never ask "yog = to be?". The deck needs a card
  that only means "if". (This exact leak is why `src/lib/senses.js` exists:
  `txiv` once showed "father · husband · fruit" on a family card.)
- The **notebook** saves card ids. Merge two cards and every learner who saved
  the removed one loses it.
- **Progress** ("known", "learning") is stored per card id too.

So the cards stay exactly as they are. The dictionary **groups** them.

---

## Step 1: build the headword (once, when the app starts)

`src/lib/wordLookup.js` walks every card and files it under its spelling:

```
"yog"  ←  conjunctions-if-short  ("if")
       ←  yog-to-be-is           ("to be / equals")
```

Each meaning becomes a **definition**, and each definition remembers where it
came from:

```js
definitions: [
  { en: 'if',              ids: ['conjunctions-if-short'], at: { 'conjunctions-if-short': 1 } },
  { en: 'to be / equals',  ids: ['yog-to-be-is'],          at: { 'yog-to-be-is': 1 } },
]
```

- `ids`: which card(s) said this. `yawg` has one definition with **three** ids
  (one card per family deck), which is why it now shows once.
- `at`: which sense of that card it is. This matters for cards that hold
  several senses themselves, like `tus` (people/animals · long objects ·
  "the one").

The numbers (1, 2…) are simply positions in this list.

### Folding repeats together

Decks were written separately, so one meaning often arrived twice in different
words. `kuv` was "(pronoun: I, me)" on one card and "I / me" on another.
`sameMeaning()` compares the **core** of two glosses:

1. Take the part before any " — " explanation.
2. Remove a wrapper like `(verb: …)` and a leading "to ".
3. Split into items on `; , / ·`.

`"(pronoun: I, me)"` → {i, me}, and `"I / me"` → {i, me}. The items are the same,
so it's one definition. The fuller wording is kept, and plain wording beats a
wrapper when they tie.

**The safety rule:** one set sitting inside the other also counts, but only if
the smaller set has **2+ items**. Otherwise a bare "one" could swallow a longer,
different definition that happens to contain the word.

---

## Step 2: mark a line with the meaning it uses (a "pin")

A story sentence can carry `means`:

```js
{ hmong: 'Nws yog Yaj, tus neeg muag daim pib.',
  english: 'He was Yaj, the ticket seller.',
  means: { yog: 'yog-to-be-is' } }
```

Read it as: *"in this line, `yog` means the card `yog-to-be-is`."*

| situation | write |
|---|---|
| one meaning | `means: { yog: 'yog-to-be-is' }` |
| same word twice, two meanings | `means: { 'yog#1': 'conjunctions-if-short', 'yog#2': 'yog-to-be-is' }` |
| one sense of a multi-sense card | `means: { tus: 'classifiers-tus@2' }` |
| both meanings at once | `means: { yog: ['conjunctions-if-short', 'yog-to-be-is'] }` |

### Why an id and not "definition 2"?

The numbers follow file order. Add a new `yog` card above the others tomorrow,
and "2" silently points at a different meaning. An id never moves. **Store the
thing that doesn't change, and compute the thing that does.**

---

## Step 3: what happens on a tap

Follow one tap of `yog` through the code:

1. **`TappableLine`** knows the word, its position, and the line's `means`, and
   hands all three to `onDefine`.
2. **`defineToken()` → `pinFor()`** looks for `yog#2` (if it's the 2nd `yog` in
   the line) and then `yog`. It finds `'yog-to-be-is'`.
3. **`lookupWord(word, story, { pin })`**: a pin goes first (tier 0), ahead of
   even the story's glossary. The line itself has said what it means, which is
   more specific than anything else.
4. **`answerFrom(entry, pin)`** marks each definition `pinned: true/false`, and
   swaps the answer's `id` to the pinned card. That's why **Save** saves the
   "to be" card and not the "if" card.
5. **`WordSheet` → `Definitions`** renders:

```
yog
IN THIS SENTENCE
 2. to be / equals
OTHER MEANINGS
 1. if
```

With no pin, it shows the plain numbered list. With one definition, it shows one
line (a lone "1." looks broken).

---

## Glossary answers get the dictionary too

A story's **glossary** is the author's note for that text, so it still answers
first. It has no card id, though, so it couldn't be saved or opened. Now
`withDictionary()` checks whether the dictionary has the **same headword**
(spaced/joined spelling allowed: *tiam sis* = *tiamsis*). If it does, the answer
carries it as `entry.dictionary`, and the sheet shows it under
**"In the dictionary"**. Save and "Open in dictionary" then act on that card.
The Glossary list does the same: a row with a dictionary entry says
"In the dictionary ›" and opens it.

**Why "same headword" only?** Matching the tapped word *inside* a glossed phrase
is the old `tus`/`tus xov` bug (every `tus` meant "thread"). Exact beats partial.

---

## The two tools

```bash
node scripts/show-definitions.mjs yog tus     # each definition + the exact pin to paste
node scripts/check-sense-pins.mjs             # fails on a broken pin; lists unpinned words
node scripts/check-sense-pins.mjs --list      # …with every line number
```

The checker **fails** when a pin's word isn't in the sentence, or its id isn't
one of that word's cards (a typo, or a card you commented out). It only
**reports** unpinned words: those still work, and just show every definition.

---

## Try it yourself

1. Run `show-definitions.mjs rau`. Which pin would you use for *"muab rau kuv"*
   ("give to me")?
2. Open `stories.js`, find *"Nws yog Yaj, tus neeg muag daim pib."* and add
   `means: { yog: 'yog-to-be-is' }`. Run the checker: the pin count goes up and
   the movie story's unpinned count goes down.
3. Misspell the id (`'yog-to-be'`) and run the checker again. What does it say?
   Why is failing better than falling back quietly?
4. `yuav` shows "going to" and "will (future)" as two definitions. Why didn't
   `sameMeaning` fold them? Should it? If yes, the right fix is editing one
   card's gloss, not loosening the rule. Why?
5. Why does a pin beat the story's glossary, while the glossary beats the plain
   dictionary?

---

## Files

- `src/lib/wordLookup.js`: `addDefinitions`, `sameMeaning`, `answerFrom`,
  `withDictionary`, `headwordOf`, the joined-spelling index, and tier 0 in
  `lookupWord`
- `src/lib/defineToken.js`: `means`, `pinFor()`
- `src/components/reading/WordSheet.jsx`: `Definitions`, the "In the dictionary"
  section, and `card` for Save/Open
- `src/components/reading/TappableLine.jsx` and both readers: pass `line.means`
- `src/components/common/GlobalSearch.jsx`: one row per headword
- `src/components/vocabulary/WordDetail.jsx`: "Other meanings of …"
- Engineering note: `notes/2026-09-26-dictionary-headwords-and-sense-pins.md`
