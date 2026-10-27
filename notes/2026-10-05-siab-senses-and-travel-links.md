# The senses array that deleted the "Other meanings" links (2026-10-05)

Author: *"where is the button to see the other definitions of siab? … dej, rau
have a button that travels, siab had it too, why did you remove it."*

They were right: I removed it, the day before, while trying to improve `siab`.

---

## ⚠️ What I broke, and the mechanism

`WordDetail.jsx` builds the travelling "Other meanings of siab" links by taking
the headword's other cards and **dropping any definition the page already
prints**:

```js
const shown = new Set([...inDomain, ...elsewhere].map((s) => s.toLowerCase()))
const otherCards = (headwordOf(word.hmongRPA)?.definitions || [])
  .filter((d) => !d.ids.includes(word.id) && !shown.has(d.en.toLowerCase()))
```

On 2026-10-04 I wrote a `senses[]` array onto all three `siab` entries listing
every meaning **in the other entries' exact wording**. That put all of them in
`shown`, so every link filtered itself out. Measured before the fix:

```
siab  [personality-siab]  travel buttons: 0   ⚠ NONE
      [descriptions]      travel buttons: 0   ⚠ NONE
      [body/liver]        travel buttons: 0   ⚠ NONE
dej   [food] [drinks] …   travel buttons: 1   ← untouched, still worked
```

The page gained a paragraph and lost the navigation.

## ⚠️ THE RULE THAT FALLS OUT OF IT

**`senses[]` is for a meaning with NO CARD OF ITS OWN.** A meaning that has its
own entry is reached by the link; copying it into the neighbour deletes the link.
Written into the data as a comment so the next pass does not repeat it.

So `siab` now carries exactly one extra sense — **"chest — in `lub hauv siab`"**,
which is attested in the Zong Vang glossary and has no entry anywhere. Its other
meanings travel:

```
siab  [personality-siab]  2 → tall; high / liver
      [descriptions]      3 → the liver — and the seat of feeling… / chest / liver
      [body/liver]        2 → the liver — and the seat of feeling… / tall; high
```

## Two things the checks taught me while fixing it

- **An array must contain its own card's answer.** A chest-only array failed
  `check-vocabulary.mjs` with "english and senses disagree" — the own-domain
  sense repeats `english` verbatim by design.
- **'chest' is tagged `reading`, not `body`.** The check rejected `body`: the
  liver entry IS a body card, so a second body sense made one card ask one thing
  and accept two. Anatomy no deck asks for belongs to the reader.

## Stale content removed with it

The array also still said **'heart; inner self; mind; feelings'** — the wording
from before the 2026-10-02 liver-leads correction, which had only been applied to
`personality-siab-noun`. And it split 'intention; willingness; emotional state'
into a second sense, which `check-vocabulary.mjs` had already rejected that day.
One word was teaching two contradictory things depending on which entry you
tapped.

## The wider finding

A scan of the dictionary at the time: **98 headwords have genuinely different
meanings across entries, and 22 share one meaning across several decks.** Almost
all of the 98 need NO `senses[]` — they already have one card per meaning, so
they need their travel links to work, which they already do. The real work is
only the meanings that have no card anywhere, like `chest`.

Checks after: `check-vocabulary` 70 tagged cards clean, `check-sense-pins` 2/2,
`check-undefined-refs` clean.
