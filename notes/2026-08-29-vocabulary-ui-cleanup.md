# Vocabulary UI cleanup — using what already existed (2026-08-29)

A quality pass over the pages built in notes/2026-08-29-vocabulary-theme-navigation.
Nothing here adds a feature; it removes the duplication that pass introduced and
puts the shared pieces where they belong.

## What was wrong

Honest list, from an audit of the section:

| Smell | Where |
|---|---|
| Hand-rolled progress bars (track + fill + `style={{width}}`) | 4 copies across the two new pages — while `src/components/progress/ProgressBar.jsx` already existed and was used by exactly one screen |
| `bestByQuiz` reduction written twice | `VocabCategoryGrid` (memoized) and `VocabGroup` (recomputed every render) |
| Pass mark `>= 80` hard-coded | 4 places: `QuizChip`, `VocabList` ×2, and the old grid |
| Two near-identical row components | `CategoryRow` (group page) and `DrillRow` (index) — already drifting in size and spacing |
| Three card recipes in one section | `rounded-xl/cream-300`, `rounded-md/cream-200`, and the elevated variant |
| Three status pills for one fact | `StatusBadge` (flashcard, word page) vs `VocabList`'s own `StatusPill` |
| Ad-hoc type sizes | `text-[11px]`, `text-[10px]` next to the `text-xs`/`text-sm` scale |

## What changed

**New `src/lib/quizProgress.js`** — the one place that knows how to read
`quizScores`:

```js
export const QUIZ_PASS_SCORE = 80
export function bestScoresByQuiz(quizScores)   // quizId → best accuracy
export function isQuizPassed(score)            // null-safe: untaken ≠ failed
```

Used by `VocabCategoryGrid`, `VocabGroup`, `VocabList`, and `QuizChip`. The unlock
rule stays in `access.js` — that one derives from `vocabProgress`, not from scores.

**`ProgressBar` earns its keep.** Extended rather than duplicated: `size`
(`sm` 6px / `md` 8px) and `hint` (right-hand caption, defaults to `value / max`).
Track moved cream-200 → **cream-300**; on a cream-50 card the lighter track was
invisible. Every bar in the section is now this component, and ProfilePage gets the
contrast fix for free.

**New `src/components/vocabulary/VocabRow.jsx`** — one row shell for both list
pages, plus `RowIcon` (the 64pt leading chip) and `ProBadge`. Also exports:

```js
export const VOCAB_CARD = 'rounded-xl bg-cream-50 border border-cream-300'
```

One card recipe, used by the rows, the two progress strips, and the word list on
the category page — which previously used a smaller, flatter card, so tapping from
a group into a category looked like landing in a different app.

**`VocabList` uses the shared `StatusBadge`.** Its local `StatusPill` is commented
out in place with a restore hint. Same word, same flag, on the list, the flashcard,
and the word page.

**Fixed a real bug in a shared primitive.** `SurfaceLink` had
`style={({ pressed }) => …}` — the exact function-style form NativeWind drops on
native, which renders the component invisible (see
notes/2026-08-06-nativewind-drops-function-style-invisible-buttons). Now
`active:opacity-85` via className. Probably why nothing used it.

## Emoji

The 3-emoji strip on the group cards is **commented out** (restore line is in
`GroupCard`). Emoji stays on the category rows, where it identifies one thing.

## Line count

The two pages got smaller even though nothing was removed from them:
`VocabCategoryGrid` 268 → 165 lines, `VocabGroup` 152 → 118. The difference is the
duplication that moved into `ProgressBar`, `VocabRow`, and `quizProgress`.

## Lime: a new token pair for passing scores

The deep `success-700` fill on a score chip read heavy. The palette had no lighter
green to reach for — `success` is an emerald ramp — so a **lime pair was added the
same way the orange scale was**, in `src/lib/themes.js`:

| Theme | `--c-lime-200` (bg) | `--c-lime-900` (text) |
|---|---|---|
| light | `217 249 157` | `54 83 20` |
| dark | `48 66 18` | `205 245 140` |
| neon | `36 62 24` | `198 255 120` |

Dark and neon invert the lightness, the same convention every other pair follows,
so the chip stays legible in all three themes. Registered in `tailwind.config.js`
as `lime: { 200, 900 }` and verified in the compiled CSS.

⚠️ `themes.js` is AUTO-GENERATED from the web palette. The header comment now says
to keep BOTH the orange and lime additions — a regeneration would drop them.

Applied to the passing score chip (`QuizChip`) and the "Best NN%" chip on the
category page. It covers every pass, not just 100 — one green for one meaning. If
a perfect score should look different from an 85, that's a second branch on
`best === 100`, not a repaint.

`StatusBadge`'s "Known" pill is deliberately still `success-700`: that's a word's
study status, a different fact from a quiz score, and it shouldn't share a color.

## Known holdouts (deliberate)

- `QuizMenu.jsx` still hard-codes `>= 80`. It's retired and unmounted, kept frozen
  for debugging — updating it would defeat the point of keeping a snapshot.
- `WordDetail` and `QuizEngine` still use the older `rounded-md/cream-200` card.
  They match the app's other detail screens; restyling them is an app-wide change,
  not a vocabulary one.
- `min-w-[64px]` / `min-w-[200px]` stay arbitrary — Tailwind v3 has no spacing scale
  for `min-width`, so these are legitimate one-offs, not drive-by magic numbers.
