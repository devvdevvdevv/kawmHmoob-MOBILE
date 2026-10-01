# Dictionary: one entry per word + sense pins (2026-09-26)

**Why:** the author saw that tapping `yog` in the movie story showed "if" when the
line means "to be", and that the dictionary had "a lot of repetitive entries".
They asked whether a word with several meanings should be one entry with numbered
definitions that a story can point at. The answer was yes, built like this.

## The idea in one picture

The **cards** (flashcards in decks) are shelves. The **dictionary** is the
catalogue. `yog` needs a card on the Conjunctions shelf ("if") and one on the
"to be" shelf, because a Conjunctions quiz must never ask "yog = to be?". But the
catalogue should show one entry:

```
yog
 1. if
 2. to be / equals
```

So **cards were not merged**: decks, the notebook and progress are all keyed on
card ids. Only the dictionary view groups them. Each numbered definition
remembers the card id(s) it came from.

## Pinning a sense in a story line

Add `means` to a sentence. It maps a word to the **card id** it means here:

```js
{ hmong: 'Nws yog Yaj, tus neeg muag daim pib.', english: 'He was Yaj, the ticket seller.',
  means: { yog: 'yog-to-be-is' } }
```

| You want | Write |
|---|---|
| this word = that card | `means: { yog: 'yog-to-be-is' }` |
| the same word twice, two meanings | `means: { 'yog#1': 'conjunctions-if-short', 'yog#2': 'yog-to-be-is' }` |
| one sense of a card that has several | `means: { tus: 'classifiers-tus@2' }` (sense 2 of that card) |
| both meanings at once | `means: { yog: ['conjunctions-if-short', 'yog-to-be-is'] }` |

When a word is tapped in that line:
- The sheet shows **"In this sentence"** with the pinned definition, then
  **"Other meanings"**, smaller. Numbers never change, so "2" is always "to be".
- **Save** and **Open in dictionary** go to the pinned card, not the first card
  with that spelling.
- A pinned word skips the phrase guess (`yog li` etc.): the author has said
  what it means.

**Pin by id, never by number.** Numbers follow category order and can shift
when a card is added. Ids don't move.

**To find ids:** run `node scripts/show-definitions.mjs yog tus` (it prints each
definition with the exact pin to paste), or search `hmongRPA: 'yog'` in vocabulary.js.

## The checker

`node scripts/check-sense-pins.mjs` (add `--list` for every line):
- **Fails** on a pin whose word isn't in the sentence, or whose id isn't one of
  that word's definitions (a typo, or a renamed/commented-out card).
- **Reports** every multi-meaning word with no pin, per story. That's the pinning
  to-do list. An unpinned tap still works; it just shows all the numbered
  definitions.

Starting point (0 pins): movie story 1,121 unpinned taps (tias, rau, thiab, yog,
teb, zaum…), Zong Vang 1,925, and the other four 86–167. Most are classifiers and
conjunctions whose card has several senses.

## Repeats folded together (display only)

Decks were written separately, so one meaning often came in twice:
- `kuv`: "(pronoun: I, me)" + "I / me"
- `pib`: "start; begin" + "begin; start · beginning…"

The dictionary now compares the **core** of each gloss: the part before " — ",
without a "(verb: …)" wrapper or a leading "to ", split on `; , / ·`. Two glosses
with the same items, or one inside the other when the smaller has 2+ items, become
**one** definition with the fuller wording. 16 headwords folded this way: kuv, pib,
tawm, tuag, cawm, dhau, tsis yog, the country/people pairs, and others. The cards
themselves are unchanged.

Not folded (they really are different wording, and need a human): `yuav`
"(future tense marker: going to)" vs "will (future)".

## Other changes
- **Search** shows one row per word ("yawg" once, not three times). Several
  meanings are numbered in the hint.
- **Word page** gets "Other meanings of <word>", which links to the word's other
  cards.
- **Spaced ↔ joined spellings:** "tiam sis" in a story finds the `tiamsis` entry,
  and a joined token finds a spaced headword. Exact spellings still win.

## Files
- `src/lib/wordLookup.js`: `addDefinitions`, `sameMeaning`, `answerFrom`,
  `headwordOf`, the joined index, and tier 0 (pin) in `lookupWord(raw, story, { pin })`
- `src/lib/defineToken.js`: `means` param and `pinFor()` (resolves `word#n`)
- `src/components/reading/WordSheet.jsx`: `Definitions`
- `src/components/reading/TappableLine.jsx`: `means` prop
- The two readers: pass `line.means`
- `src/components/common/GlobalSearch.jsx`: headword rows
- `src/components/vocabulary/WordDetail.jsx`: "Other meanings"
- `scripts/check-sense-pins.mjs`

## Next (on the TODO)
1. Rewrite "Mus Saib Yeeb Yam" naturally, then pin it. `Yog,` as an answer
   ("yes, it is so") pins to `yog-to-be-is`.
2. Pin the other five stories, starting with the words the checker lists most.

**Not tested on a device.**
