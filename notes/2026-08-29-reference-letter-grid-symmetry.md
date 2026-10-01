# Reference letter grid — fills the row instead of drifting left (2026-08-29)

The consonant/vowel tiles on **Reference** sat off-centre: the block hugged the left
edge with a ragged gutter of dead space on the right, and the gutter was a different
size on every device.

## The cause

`src/components/reference/LetterGrid.jsx` laid out fixed `w-[100px]` tiles in a
`flex-row flex-wrap gap-3`. A wrapping row fits `floor` columns and leaves the
remainder — which is never zero unless the width happens to divide evenly — as
unused space on the trailing edge:

| row width | old: 100px tiles | dead space |
|-----------|------------------|------------|
| 320 (360pt phone) | 2 per row | **108px** |
| 335 (375pt phone) | 3 per row | 11px |
| 372 (412pt phone) | 3 per row | 48px |

Nothing was misaligned in the CSS sense — the row was simply narrower than its
container by a varying amount, which reads as "not centred".

## The fix

The row measures itself and the tiles are sized to fill it exactly.

```js
const cols = rowWidth ? Math.max(1, Math.floor((rowWidth + GAP) / (MIN_TILE + GAP))) : 0
const tileWidth = cols ? Math.floor((rowWidth - GAP * (cols - 1)) / cols) : 100
```

- **`onLayout`, not `useWindowDimensions`.** The grid sits inside `TabScreen`, which
  has its own horizontal padding AND a 672pt max-width column. Screen width would
  have to be corrected by both, and would break the moment either changed.
  Measuring the row itself is immune to whatever the parent does.
- **`MIN_TILE` is a packing threshold, not a rendered width.** It decides the column
  count; the tiles then grow to fill. Tuned to **90**, which puts every common phone
  (360–428pt) on 3 columns of 98–121px — the ~100px the tiles were designed at — and
  the 672pt column on 6. At 100 the 360pt phone dropped to 2 columns of 154px; at 85
  the layout fragmented (4 columns on 428pt, 7 on tablet).
- **`Math.floor` on the tile width** is load-bearing. An exact division can land on
  400.00000000000006, which is wider than the row, which wraps the last tile onto
  its own line. Flooring leaves 0–4px of slack instead — invisible, and never wraps.
- `rowWidth` is 0 before the first layout pass, so the first frame falls back to the
  original 100px rather than collapsing to zero-width tiles.

Setting state from `onLayout` doesn't loop: the second layout reports the same
width, and React bails out on an identical value.

## Square tiles (same pass)

Once the widths were right the tiles still read as portrait — and, worse, as
*ragged*: height was purely content-driven, so a tile whose sound label wrapped to
two lines stood 16px taller than its neighbours in the same row.

| | 360pt | 390pt | 428pt |
|---|---|---|---|
| before (h/w, 1-line / wrapped) | 1.10 / 1.27 | 1.00 / 1.15 | 0.89 / 1.02 |
| after | **1.00** / 1.14 | **1.00** / 1.04 | **1.00** / 1.00 |

Two changes:

- **`minHeight: tileWidth`** — the height is floored at the width, so a tile can
  never be narrower than it is tall. Short labels pad out to an exact square instead
  of sitting in a portrait box. `minHeight` rather than `height` on purpose: a fixed
  height would clip the long labels.
- **Tightened the stack** — `p-3` → `px-2 py-2` and dropped the `mb-1` under the
  audio button, taking natural content height from 108px to 96px. That's what lets
  the square floor actually engage at the narrowest tile (98px): at 108 the content
  was taller than the square and the floor would have done nothing.
- Added `justify-center` so the content sits centred in the padded-out square.

The handful of tiles with long sound labels ("ng-g (uvular)") still grow to 112px on
narrow screens — that's the honest trade against truncating a pronunciation hint.
A strict 1:1 everywhere needs either `numberOfLines={1}` (truncates) or a ~10px
sound label (hard to read); both were rejected.

## Deliberately not touched

Two other copies of this grid exist with the same fixed-width defect:

- `app/alphabet/[tab].jsx` → `Grid` (`w-[100px]`). **Orphaned route** — nothing
  navigates to `/alphabet` any more; only `GlobalTabBar`'s `match` rule still names
  it, to keep the Reference tab lit if you deep-link there.
- `app/learn/[unitId]/[lessonId].jsx` → local `LetterGrid` (`w-[92px]`, cream-100
  tiles). Live, but it's Learn, not Reference.

Three near-copies of one grid is the same reuse smell called out in
[[notebook-logic-explained]] exercise 8. Worth collapsing into the shared
`LetterGrid` if any of them needs changing again.

Related: [2026-07-30-reference-single-tabbed-page].
