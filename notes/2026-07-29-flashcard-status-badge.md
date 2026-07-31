# Flashcard status ribbon — the missing piece (2026-07-29)

**Status: IMPLEMENTED** in `src/components/vocabulary/Flashcard.jsx`. Below is the
diff/plan; the "What shipped" section at the bottom records the actual edit.

## Symptom

In vocab, the flashcard looks like an "older version": the **status ribbon
(New / Learning / Known) in the top-left corner is missing.** Everything else
(3D flip, audio, Hmong/English faces, Mark Learning/Known buttons) already
mirrors the web.

## Diff: web (new) vs RN Flashcard

`src/components/vocabulary/Flashcard.jsx` in both. The ONLY meaningful gap is the
`StatusBadge`. The web renders a corner pill on **each face** showing the word's
study state:

```js
const STATUS = {
  new:      { label: 'New',      cls: 'bg-cream-200 text-stone-700' },
  learning: { label: 'Learning', cls: 'bg-clay-600 text-cream-50' },
  known:    { label: 'Known',    cls: 'bg-success-700 text-cream-50' },
}
// pill: absolute top-3 left-3, rounded-full px-2.5 py-1,
//       text-[11px] font-bold uppercase tracking-wider
```

`status = vocabProgress[word.id] || 'new'` (RN already computes this). `new` is the
default so an unstudied card reads "New" rather than showing nothing.

## Plan to add it in RN

1. **Tiny component** — `View` (pill) + `Text` (label), colored by status.
   NativeWind supports `absolute top-3 left-3` in RN, so it's ~1:1:
   ```jsx
   <View className={`absolute top-3 left-3 rounded-full px-2.5 py-1 ${bg}`}>
     <Text className={`text-[11px] font-bold uppercase tracking-wider ${text}`}>{label}</Text>
   </View>
   ```
2. **Render it on BOTH face `Animated.View`s** (front AND back), as the first child
   of each.

## RN gotchas (the traps)

- **Both faces.** `backfaceVisibility: 'hidden'` means only the forward-facing
  face shows; put the badge on one face only and it vanishes after a flip.
- The faces use `alignItems/justifyContent: 'center'`, but the badge is
  `position: absolute`, so it pins to the corner regardless — no conflict.
- **`known` color:** web uses `bg-success-700`; `bg-emerald-700` is identical
  (emerald was aliased → success). Either works.
- Badge sits on the cream face (not the `#000` backdrop), so no contrast issue;
  the pill colors are themed classNames, fine in light/dark/neon.

## Scope

All vocab flashcard entry points — **`VocabList`, `app/words/session.jsx`,
`app/review.jsx`** — render this same `Flashcard` component. There is NO separate
"old" flashcard file; the component just predates the badge. So adding the badge
once fixes the ribbon everywhere.

## Verify (after implementing)

Open a word in vocab: an unstudied card shows a grey **New** pill top-left;
"Mark Learning" → clay **Learning** pill; "Mark Known" → green **Known** pill;
the pill stays put when the card is flipped (present on both faces).

## What shipped

Added a `STATUS` map + `StatusBadge` (`View` pill wrapping a `Text` label — a
`<span>` in web, but RN needs the `View`/`Text` split) at the top of
`Flashcard.jsx`, rendered `<StatusBadge status={status} t={t} />` as the first
child of BOTH face `Animated.View`s (front + back).

### The "not seeing anything" fix — inline styles, not className

First pass used NativeWind classes (`absolute top-3 left-3 bg-cream-200 …`) and the
badge didn't appear. `className` interop is unreliable on the animated card (same
reason the faces set their bg/border inline). Rewrote `StatusBadge` with **fully
inline styles** driven by the theme-token map `t` (passed in from the parent):

- position: `absolute`, `top: 12`, `left: 12`, `zIndex: 10`
- pill: `borderRadius: 999`, `paddingHorizontal: 10`, `paddingVertical: 4`,
  `backgroundColor: rgb(${t[pill]})`
- label: `color: rgb(${t[text]})`, `fontSize: 11`, `fontWeight: '700'`,
  `textTransform: 'uppercase'`, `letterSpacing: 1`

Colors are `--c-*` tokens (so they theme): `new`→`--c-cream-200`/`--c-stone-700`,
`learning`→`--c-clay-600`/`--c-cream-50`, `known`→`--c-success-700`/`--c-cream-50`
(switched from emerald to **success-700**, matching the web exactly — and there's
no `--c-emerald` token, so inline styling required success).

### WHERE it shows (important)

The flip `Flashcard` only renders in a category's **Study Mode** (the List /
Study Mode toggle in `VocabList`, default is List). It is NOT the vocab
word-detail page — that's `WordDetail`, which shows status as a plain "Status"
text field. The List view shows a per-row `StatusPill`. So the ribbon is only
visible on the flip card in Study Mode.
