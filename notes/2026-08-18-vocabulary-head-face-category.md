# Vocabulary: Head & Face category + grouping cleanup (2026-08-18)

First new category of the ~1,021-word push toward 1,500
(see [2026-08-18-content-implementation-plan]).

**Result:** 494 words / 42 categories. No duplicate ids, no dangling theme ids, no
untethered categories.

---

## What was added

`human-anatomy-face` → **"Head & Face"**, 15 words: taub hau, plaub hau, hauv pliaj,
ntsej muag, qhov muag, plaub muag, pob ntseg, qhov ntswg, plhu, qhov ncauj, di ncauj,
nplaig, hniav, puab tsaig, caj dab.

## ⚠️ The example sentences are DRAFTED, NOT SOURCED

All 15 `exampleSentence` values were written by Claude, not taken from a source or a
native speaker. A `NEEDS NATIVE REVIEW` banner sits above the category in
`vocabulary.js`.

The `mob` frames (`Kuv lub taub hau mob.` — "My head hurts") are the safest. **The
classifier choices are the likely error site** — `lub` vs `cov` vs bare, e.g. is it
`cov plaub hau` or `txoj plaub hau`? Verify before this ships. This is exactly what
the content quality pipeline exists to catch.

Two entries carry a `needs-review` tag for a specific reason:
- **`plaub muag`** — covers both eyebrow AND eyelash.
- **`puab tsaig`** — chin vs jaw is unclear.

---

## Decision: do NOT split a word that has one surface form

The first instinct was to split `plaub muag` "eyebrow / eyelash" into two entries,
since a slash gloss breaks quizzing (learner answers "eyelash", gets marked wrong).

**That fix was worse than the problem.** Both senses share the same `hmongRPA`, so
splitting produces two entries with an identical Hmong form — now the quiz has two
right answers for one prompt, which is strictly worse than one ambiguous gloss.

**Rule: when two English senses share one Hmong surface form, keep ONE entry with a
single primary gloss.** Record the secondary sense in a comment + `needs-review` tag.
Only split when the Hmong forms actually differ.

---

## Compound tags — the reason this category is worth more than 15 words

Three of these are `qhov` ("opening") compounds and two are `plaub` ("hair")
compounds:

- `qhov muag` (eye), `qhov ncauj` (mouth), `qhov ntswg` (nose) → tag `qhov-compound`
- `plaub hau` (hair), `plaub muag` (eyebrow) → tag `plaub-compound`
- `ntsej muag` (face) = literally ear + eye → tag `compound`

Teach `qhov` once and three words come free. **This is morphology a learner can use,
not memorize** — which makes it natural material for the Learn ↔ Speak ↔ Writing
recycling the content plan is built around. The tags exist so that lesson can pull
the set with one filter instead of hand-listing ids.

Worth applying the same treatment to other compound families as they're added.

---

## Grouping cleanup (fixed while in `CATEGORY_THEMES`)

- **New `body` theme** ("The Body") holding `human-anatomy-face`. Without it the
  category lands in the "More" fallback group.
- **Removed dangling id `household`** from the Home & Places theme — no such
  category exists. `.filter(Boolean)` was silently dropping it, so the failure was
  invisible.
- **Shelved `time-context`** under Time, Numbers & Money; it had no theme and was
  sitting in "More".

### How the fallback hides mistakes

`categoryGroups` sweeps anything unthemed into "More" so nothing disappears — good.
But that also means **a typo'd id in a theme never errors**; the category just quietly
relocates. Both bugs above had been live and invisible.

Check with:
```
# dangling theme ids + untethered categories
node -e "…"   # see the integrity check in this session, or just grep CATEGORY_THEMES ids
              # against category ids that have a words: [ array
```

---

## Cosmetic

- emoji 💪 → 👤 (it was a bicep on a head-and-face category)
- title "Human Anatomy Head & Face" → **"Head & Face"**, matching the voice of the
  other themes
- description no longer restates the title; it names the `qhov`/`plaub` pattern

---

## Not done, deliberately

- **No new words added** (throat `caj pas`, beard, eyelid were candidates). Sourcing
  new vocabulary is authoring, and should come from real material — not from Claude.
- **187 of 494 words still have no `exampleSentence`** — unchanged. The anatomy set
  simply didn't add to that backlog.
- **291 words still have `audioFile: null`.** Audio is the only pipeline step that
  can't be done at a keyboard; batch the recording sessions.

Backup of the pre-edit file: `/tmp/vocab.bak.js`.

Reference: `instructions/adding-vocabulary.md` (written this session — the RN app had
no copy, only the web app did, so the pointer in `vocabulary.js` line 2 was dead).
