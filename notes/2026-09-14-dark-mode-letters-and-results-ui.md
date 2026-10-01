# Invisible letters in dark mode, and the sentence-builder results screen (2026-09-14)

Three changes: a real dark-mode bug (and a wrong "fix" for it that I shipped
first), the alphabet sound captions hidden, and the sentence builder's results
screen rebuilt.

## 1. ⚠️ The invisible letters — and the comment that caused them

**Symptom:** on the dark and neon themes, the consonant/vowel letters were the
same colour as the tile they sat on. Not dim — gone.

**Cause:** `src/components/reference/LetterGrid.jsx` carried this override:

```js
const letterStyle = theme === 'light' ? undefined
  : { color: tokenColor(theme, '--c-cream-50') }
```

with a comment asserting *"the dark themes' cream-50 is a warm off-white that
matches the rest of their type"*.

**That assertion is false.** From `src/lib/themes.js`:

| token | light | dark | neon |
|---|---|---|---|
| `cream-50` — the TILE background | 251 246 236 (near-white) | **33 29 26** (near-black) | **23 21 38** (near-black) |
| `clay-700` — the letter | 126 63 40 | 178 94 61 | 226 82 58 |

The tile is `bg-cream-50`. Painting the text `cream-50` painted it in exactly
its own background, on precisely the themes the override claimed to fix.

And `text-clay-700` alone was already readable in **all three** themes — the
clay token lightens as the background darkens, because that is what the whole
CSS-variable system is for. From the top of `tailwind.config.js`:

> every brand color resolves through a CSS variable … so `bg-cream-50` /
> `text-stone-900` automatically restyle when the theme flips light → dark →
> neon — **no `dark:` variants in components**.

The override wasn't just wrong, it was *overriding the mechanism that was
already handling it correctly*.

### ⚠️ I made it worse before I made it better

Asked to fix the invisible letters, I found `app/alphabet/[tab].jsx` — which
has its own local `Grid`/`ToneList`, duplicating `LetterGrid` — noticed it
*lacked* the override, and "fixed" it by copying the override in. So the
alphabet screen went from working to broken, and I reported it as fixed.

I never checked what `--c-cream-50` actually evaluates to in the dark theme. The
comment said off-white; I believed the comment. One `grep` of `themes.js` would
have shown `33 29 26`.

> **A comment asserting a fact about data is not the data.** When a component
> hand-picks a colour "because the theme token is wrong", verify the token's
> real value before trusting — or propagating — the reasoning. Here the
> justification was self-refuting: it named the same token as both the
> background and the readable foreground.

### The fix

Override deleted in both files; `text-clay-700` left to do its job. The old
code and the token table are preserved in a comment in `LetterGrid.jsx` so the
"fix" can't get re-added by someone reading the original reasoning.

**The general rule, written into that comment:** if a themed token looks wrong
in dark mode, fix the token in `themes.js`. Do not hand-pick a replacement in a
component.

### Swept for the same shape

`grep` for other components resolving `--c-cream-50` inline: all the remaining
uses are `cardBg` (correct — cream-50 *is* the card surface) or
`primaryText`/`onAccent`/`onDanger` (correct — text on a *filled clay or red*
button, where the background is not cream). The bug only ever existed where
text and its own background were the same token.

### ⚠️ Still duplicated

`app/alphabet/[tab].jsx` still has a private `Grid`/`ToneList` that duplicate
`reference/LetterGrid.jsx` and `reference/ToneRows.jsx`. That duplication is
exactly what let one file be broken while the other wasn't — and what made
"fix it in both places" the shape of this bug. `ToneRows` is also the better
component (it wires real audio; the local `ToneList` passes `audioSrc={null}`).
Consolidating is a separate job, not done here.

## 2. Alphabet sound captions hidden

The plain-English approximation under each letter — "voiceless n" for `hn`, etc.
— is commented out in place in `Grid`, with a restore hint. Data untouched:
`sound` is still on every entry in `src/data/alphabet.js`.

## 3. Sentence builder results screen

Was four stacked sentences of plain text. Now:

- a **trophy / award emblem** — a two-state switch, not a meter, because either
  every sentence landed or it didn't
- **three tinted stat tiles** — Sentences (`3/5`), Word accuracy (`87%`), Points
- the perfect bonus as its own **pill**, rather than a clause tacked onto a
  sentence
- full-width stacked buttons, "Another 5" promoted above "Back to Words"

The two accuracy numbers are deliberately both shown: `score` is pass/fail per
sentence, `wordPct` is per-chip partial credit, and a close-but-scrambled
session can honestly read `1/5` **and** `80%` at the same time.

### ⚠️ A colour class that never existed

The live points counter added on 2026-09-12 used `text-lime-700`. This app's
lime scale defines **only 200 and 900** (`tailwind.config.js`) — lime is not a
full Tailwind palette here, it's two hand-picked steps for the passing-quiz
look. `text-lime-700` generated no utility at all, so that text had been
rendering with no colour applied since the day it shipped.

Fixed to `text-lime-900`. The new stat tiles avoid the whole class of problem by
tinting with **opacity modifiers on tokens that exist** — `bg-ocean-700/12`,
`bg-blush-500/12`, `bg-clay-600/12` — the same idiom the Words hub already uses
for its icon circles (`bg-clay-600/12`), rather than reaching for `-100`/`-300`
steps that may not be defined.

> **A misspelled Tailwind class is silent.** It is not an error, not a warning,
> and not a visible fallback — the utility simply isn't generated. Check the
> config before using a shade the app hasn't used before.

Related: [2026-08-29-sentence-builder-barebones],
[2026-08-29-sentence-builder-groups-and-surface],
[2026-08-06-nativewind-drops-function-style-invisible-buttons].
