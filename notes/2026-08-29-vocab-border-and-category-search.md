# Vocab: card border out, category search in

**2026-08-29** · `src/components/vocabulary/VocabRow.jsx`,
`src/components/vocabulary/VocabCategoryGrid.jsx`

Companion to [[2026-08-29-card-borders-removed]].

---

## 1. The vocab card border

Vocab has its own card token, separate from the app-wide one:

```js
export const VOCAB_CARD = 'rounded-xl bg-cream-50 border border-cream-300'
```

One string feeding every vocab card, so a single edit covered all of them — the
opposite of the 95-site slog next door. **A design token in one place is worth
the indirection precisely for days like this.**

⚠️ **This reverses a deliberate earlier decision.** The original comment said:

> *"cream-300 borders (2px, per the tailwind borderWidth default) read as an edge
> on a cream card; cream-200 didn't."*

The border was doing real work here — cream-200 had already been tried and
rejected as too faint. It came out anyway, because every other card in the app
lost its hairline the same day and a vocab card alone keeping a 2px edge reads
as an oversight rather than a choice.

That reasoning is preserved in the file rather than deleted with the code, so
this stays a decision that can be reversed rather than one that was forgotten.

### Kept (not cards)

The 64pt quiz chip and row avatar (the border defines the circle), the
save-toggle button, `border-t` dividers in `WordDetail`, and the dashed
empty-state placeholder.

---

## 2. Category search

46 categories behind 9 theme cards is two taps and a guess when you already know
what you want.

Matching runs over **title, description, AND theme name**:

```js
[c.title, c.description, groupOf[c.id]]
  .filter(Boolean)
  .some((field) => field.toLowerCase().includes(q))
```

Including the theme is what makes the useful cases work:

| query | results |
|---|---|
| `food` | 3 — Animals, Food, Nature *(the last two via the “Nature & Food” theme)* |
| `body` | 5 — Head & Face, Human Anatomy… *(via “The Body”)* |
| `anim` | 2 — Animals, Quantifiers |
| `time` | 10 — the whole “Time, Numbers & Money” theme |

⚠️ That last row is the cost: matching a theme name pulls in **every** category
under it. Correct, but broad. If it starts feeling wrong, ranking title matches
above theme matches is the fix — not dropping theme matching, which is what makes
`food` → Nature work.

### Two design decisions

**Search REPLACES the page, it does not filter it.** The progress bar, theme
cards and drills all describe the WHOLE library — leaving them above a result
list would claim "9 themes" while showing three categories.

**Each result names its theme.** Results are pulled OUT of the hierarchy, so
without it a learner cannot tell where a category normally lives, or reach it
again without searching. Results reuse `VocabRow`, so they are the same anatomy
as every other row on the page.

### Known limits

Literal substring matching — no stemming, spelling variants or synonyms.
`"colour"` returns nothing because the app says *Colors*. Fine at 46 categories;
worth revisiting if the library grows or ships outside US spelling.

---

## ⚠️ The CRLF trap, third time today

Both vocab files are **CRLF**. My LF-joined needles matched nothing — exactly
the failure from `src/data/speak.js` earlier
([[2026-08-29-speak-hub-tabs-and-grammar]]).

Then the fix made it worse: patching the edit helper through `node -e` mangled
its own escape sequences into literal newlines and broke the script outright.

**Rewrote it with the Write tool instead of shell-escaping**, which is the same
conclusion this session has now reached three times. The helper is finally
EOL-aware:

```js
const o = {
  eol: raw.indexOf(CRLF) >= 0 ? CRLF : LF,
  s: raw.split(CRLF).join(LF),      // normalise on read
}
o.save = () => fs.writeFileSync(F, o.s.split(LF).join(o.eol))  // restore on write
```

Confirmed after: **100% CRLF, zero bare LF** in both files. Rejoining a CRLF file
with LF would have marked every line as changed.

> **Two rules earned the hard way.** Normalise line endings on read and restore
> them on write — never assume LF. And build edit scripts as FILES, not as
> `node -e` strings: every layer of shell quoting is a place for the script to
> silently become a different script.

---

## Verification

- Parse — both files
- `check-undefined-refs.mjs` — 194 files, clean
- CRLF preserved (100 / 252 lines, 0 bare LF)
- Search filter exercised against the real data — see the table above

Not verified: how borderless vocab cards read on device, and search behaviour
with the keyboard raised.
