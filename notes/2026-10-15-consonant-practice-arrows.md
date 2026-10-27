# Consonant practice: prev / next arrows replace the "next unpractised" button (2026-10-15)

Author: *"replace the 'Next one you haven't practised: h', comment it out, and
replace it with the left / right arrow buttons."*

`app/speak/family/[familyId].jsx` — the screen behind every letter drill
(consonants and vowels, since both are word families).

---

## What it looks like now

```
┌──────────────┬─────────┬──────────────┐
│   ←   n      │ 7 of 17 │     ny   →   │
└──────────────┴─────────┴──────────────┘
          Back to Speak
```

Each arrow names the letter it goes to, so it is a destination rather than a
direction, and tapping it plays that letter — it calls the same `choose()` the
tile grid uses. The counter sits between them because two bare arrows give no
sense of a list behind them.

## Why the old button was worth replacing

It jumped to the next UNPRACTISED letter. Two consequences:

- **its destination moved as you worked** — the same button meant something
  different on every render
- **going BACK to a letter you had already done was only possible from the tile
  grid**

Arrows walk the family in the order it is taught, both directions.

⚠️ **THE ENDS DISABLE RATHER THAN WRAP** — the same rule as the text-size
stepper. Wrapping from the last letter to the first turns "one more tap" into a
silent jump across the whole family, which reads as a bug. The tile grid above is
still how you leap.

## Commented out, not deleted — both halves

The button AND the three lines that fed it (`after`, `before`, `nextOpen`), which
existed only for it and would otherwise compute on every render for nothing. Each
comment points at the other, because restoring one without the other is a
reference error.

## ⚠️ A claim I got wrong, caught by lint

My first version of that comment said `handleDone` still depended on `nextOpen`,
so advancing after a recording would keep working. The unused-variable warning
made me check: **`handleDone` finds its own next-unpractised letter**
(`words.findIndex(...)`), and never used `nextOpen`. Finishing a recording
advances exactly as before, but for a different reason than I wrote down. The
comment was corrected rather than left as a plausible-sounding lie.

## Pre-existing, not introduced here

That file reports **5 `react-hooks/rules-of-hooks` errors**, all from
`if (!SPEAK_ENABLED) return <Redirect href="/speak" />` sitting ABOVE the hooks.
They were there before this change. Worth knowing it is a real bug waiting for
the day `SPEAK_ENABLED` flips — the early return makes every hook below it
conditional.

`check-undefined-refs` clean.
