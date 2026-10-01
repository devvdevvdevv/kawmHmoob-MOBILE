# One answer per card

⚠️ **Written because the author had to ask twice.** The `senses` array was built
on 2026-09-14 for exactly this, and then the migration that filled it threw the
point away.

## What was wrong

The migration defaulted every entry it touched to *"tag all senses with the
entry's own domain"*. 44 of 52 entries took that default, so nothing moved off
its card and the flashcards still stacked:

```
NUMBERS deck
  ob     1. two           2. both; the two — "nkawd ob leeg"
  kaum   1. ten           2. forms the teens: "kaum peb" thirteen…
```

A numbers card asks what the number is. **The answer is 2 and 10.** The
mechanism to say so already existed; the data just never used it.

## The rule, now enforced

> Of the senses tagged to an entry's own domain, **the primary one stays and the
> rest move to `reading`.** Senses already tagged to a different domain are left
> alone — those were deliberate.

The primary is the first sense, because the fluent review consistently led with
the core meaning. One override was needed: `verbs-release` (`tso`) is taught as
*release*, and the review led with "put; place; set down" — the **entry ID** is
what states the question the card asks, so it wins over sense order.

```
48 cards narrowed to one answer · 71 senses moved to reading
```

## The second half: entries parked in the wrong deck

Five entries carried `category: 'misc'` while physically sitting inside the
`verbs` and `numbers` **arrays**, next to the headword they add a sense to. A
deck is built from its array, so they rendered as cards:

```
Numbers deck → ib    → "a, an — Hmong has no separate indefinite article…"
Verbs deck   → zaum  → "perhaps, maybe — only with a word in front of it"
```

⚠️ **The parking was never load-bearing.** The comment above them said they sat
there so `wordLookup` would MERGE them onto the main headword — but the merge is
keyed on `hmongRPA` and iterates every category. Array position had nothing to
do with the merge it was supposedly enabling.

All five moved to `misc`. **Ids untouched**, so no saved progress moved with
them — `vocabProgress` and the SRS schedule key on `word.id`, and renaming one
is what would cost people their streaks.

Verified by diffing the whole dictionary before and after: **909 entries before,
909 after, no ids lost or gained, no content changed, exactly 5 moved.**

## Result

```
NUMBERS   one · two · three · four · five … ten · twenty · thirty
VERBS     zaum → "to sit"
FAMILY    txiv → "father"   niam → "mother"   tub → "son; boy"

reader tap, unchanged:
  zaum  to sit · a time, an occasion, a turn — the classifier for counting…
  ib    one · a, an — Hmong has no separate indefinite article…
```

## The check had gone vacuous

`check-vocabulary.mjs` counted entries whose `english` contained `' · '`. Once
every card was narrowed that count hit **zero**, so the check passed by having
nothing left to look at. Two real invariants replaced it:

- **One answer per card** — no entry may have more than one sense tagged to its
  own domain.
- **`english` must equal the in-domain senses** — they are two statements of the
  same fact and nothing else held them together. Edit one and the card and the
  checker quietly start describing different words.

Both negative-tested: stacking a second `numbers` sense onto `ob` and drifting
`kaum`'s english to "ten-ish" each fail it, and the restore was byte-identical.

`PARKED` is now an empty set with a paragraph explaining why it must stay that
way — an entry whose `category` disagrees with the array it sits in is always a
bug now.

## The lesson

⚠️ **A mechanism is not a fix.** Building `senses` felt like solving the problem,
but the defaulting rule in the migration decided what actually shipped, and that
rule was chosen for convenience. **The default is the design.** Everything that
takes the default is the product.
