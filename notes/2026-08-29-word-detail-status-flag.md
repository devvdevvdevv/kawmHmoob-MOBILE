# Word detail: status flag + bolder chosen button (2026-08-29)

## Why

On `/vocabulary/<cat>/<word>` you could mark a word Learning or Known, but the page
never showed you what it currently was — except as the raw lowercase word `known`
buried in the Status field. Both buttons looked identical whether you'd tapped one
or not, so the page forgot your answer the moment you looked away from it.

The flashcard had solved this a month ago (notes/2026-07-29-flashcard-status-badge):
a corner pill, and the chosen button filled with color. The fix is to use THAT, not
to invent a third look.

## What changed

**New: `src/components/vocabulary/StatusBadge.jsx`** — `StatusBadge` and the
`STATUS` map lifted out of `Flashcard.jsx` verbatim, so one definition serves both
screens:

| status | pill | text |
|---|---|---|
| `new` | `--c-cream-200` | `--c-stone-700` |
| `learning` | `--c-clay-600` | `--c-cream-50` |
| `known` | `--c-success-700` | `--c-cream-50` |

Also exports `statusLabel(status)` → `New` / `Learning` / `Known`.

- `floating` prop pins it to a card corner (what Flashcard needs); without it the
  pill sits in normal flow at `alignSelf: 'flex-start'` (what WordDetail needs).
- Still fully **inline styles, not className** — unchanged from the original, and
  required on the flashcard's animated faces where NativeWind interop is unreliable.

**`WordDetail.jsx`**

- The flag renders directly under the English translation, so status is visible the
  instant the page opens.
- The chosen button is now **filled + bold + ✓**: `bg-clay-600` / `bg-emerald-700`
  with `font-bold text-cream-50` and the label flips `Mark Learning` → `✓ Learning`.
  The unchosen one keeps its soft `bg-cream-200` / `bg-emerald-100` look.
- Status field shows `statusLabel(status)` ("Known"), not the raw value ("known").

**`Flashcard.jsx`** — imports the shared badge (`<StatusBadge status={status} floating />`)
and its active button got the same `font-bold` + `✓` treatment, so marking a word
looks identical on both screens.

## Watch out

- Class strings stay **static** (`className={cond ? 'a' : 'b'}`), never a style
  FUNCTION — NativeWind drops function styles on native and the button renders
  invisible. See notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.
- `emerald` has no `600` in `tailwind.config.js` (it aliases onto themed `success`
  tokens: 50/100/200/500/700/800/900). Use `emerald-700` for a filled green.
- Re-tapping the active button is harmless: `setVocabStatus` only grants XP on a
  `new/learning → known` transition, so it can't be farmed.

## Verify

- Open a word you've never marked → grey **NEW** pill, both buttons soft.
- Tap Mark Learning → pill turns clay and reads **LEARNING**, that button fills and
  reads "✓ Learning" in bold; Known stays soft.
- Tap Mark Known → pill turns green **KNOWN**, Known fills, Learning goes soft again.
- Back out to the category list and reopen the word — the flag survives (it reads
  `vocabProgress`, which persists).
- Flashcard (Study Mode) shows the same pill and the same bold ✓ button.

## Not done (say the word)

`VocabList.jsx` still has its own `StatusPill` — lowercase text, different colors
(`bg-emerald-100` / `bg-cream-200`) — for the rows in a category. It's now the only
place that doesn't use the shared badge. Swapping it would make the whole vocabulary
section speak one visual language, but it changes the look of every category list,
so it was left alone.
