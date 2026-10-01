# Card borders removed app-wide — and what a className cannot do

**2026-08-29** · 43 files across `app/` and `src/`

> "for each card, remove the border it's too dark, but comment it out."

95 instances of the 1px `border` + `border-cream-200` hairline. Cards now
separate by `shadow-warm` and background contrast alone.

---

## ⚠️ The part that could not be done as asked

**A `className` is a STRING. There is no syntax for commenting out one class
inside it.** `//` and `{/* */}` work between JSX elements, not inside a quoted
attribute value.

So the token was **deleted**, and every touched file carries a banner recording
what went and how to put it back. That is the closest honest equivalent to the
[[comment-out-never-delete]] convention here — the information survives in place,
even though the code does not.

Worth naming, because the instinct is to reach for a trick: there isn't one.
Renaming the class to something inert would leave dead text that reads like a
live style. Deleting plus documenting is the honest version.

---

## Two problems I created and then fixed

### The first pass missed 5 of 95 — including a shared primitive

The regex matched `className="…"` but not `` className={`…`} `` — template
literals. The five stragglers were `SkeletonCard`, `QuizMenu`, and — importantly
— **`Surface.jsx` (×3)**, the shared card primitive.

Leaving `Surface` bordered would have left a visible inconsistency everywhere it
is used, which is a large fraction of the app, while every hand-rolled card next
to it lost its edge. **The shared component is exactly the one a
`className="…"`-shaped regex is most likely to miss**, because a primitive is
where dynamic class composition lives.

### My own banners broke `grep`

The banner text quoted the class as one contiguous string, so all 40 banners
matched `grep "border border-cream-200"`. The audit for stragglers returned ~80
lines of my own comments with 5 real hits buried inside.

Fixed by splitting the quote in the banner (`` `border` + `border-cream-200` ``).

> **A note that quotes the exact token it is retiring makes that token
> un-greppable.** Quote it split, or name it without the literal. This applies to
> every deprecation comment, not just CSS.

---

## What was deliberately kept

| | n | why |
|---|---|---|
| `border-cream-300` | 11 | inputs and ghost buttons — controls, not cards |
| `border-cream-400` | 2 | same |
| `border-2` variants | 3 | dashed placeholders, and the recall card's accent |
| `border-clay-600` | 2 | the dark recall card, where the border IS the design |

A card outline and a control outline look like the same token and are not doing
the same job. Removing every border matching the pattern would have flattened
text inputs into the page.

---

## Verification

- `check-undefined-refs.mjs` — 194 files, clean
- Parse — all shared primitives (`Surface`, `SkeletonCard`, `QuizMenu`)
- `grep` returns exactly one match now: a historical migration comment in
  `ToneRows.jsx`, not a live border

⚠️ **A visual change on ~95 elements across every screen, with only compilation
confirmed.** `SkeletonCard` is the one to eyeball first — with no border AND no
shadow, a loading skeleton may read as nothing at all.
