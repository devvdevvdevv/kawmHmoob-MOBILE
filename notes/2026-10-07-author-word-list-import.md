# The author's 22-word list: 16 in, 4 skipped, 2 held (2026-10-07)

A pasted table of 22 words with English and an example sentence each. Imported
per the playbook's §4 rules for an outside list: verify against what is here, add
only what is missing, and when it contradicts the author, ask.

Result: **2,040 → 2,056 entries** (1,881 distinct headwords).

---

## Added — 16

| set | words |
|---|---|
| Verbs | `tsuj` step on · `tsuj raug` step on (landing on a target) · `tsawv` grab · `yos noj` hunt for food · `mag` get caught · **`tom` to bite** · **`yeej` to win** |
| Descriptions | `yooj yim` easy · `qeeb` slow · `zoo li` looks like |
| Intensifiers | `tsees` immediately |
| Tools & Household | `lub vas` net |
| Common Nouns | `phiaj` target · `hom phiaj` goal |
| Quantifiers | `kwv yees li` approximately |
| Telling the Time | `txog + time` by/at eight o'clock |

Examples are the list's own, kept verbatim.

## ⚠️ Three were SAME-HEADWORD SPLITS, not new words

`tom`, `yeej` and `txog` already existed with DIFFERENT meanings, so each got its
own entry in its own set rather than an edited gloss — the `rau` / `tom qab`
pattern. Verified both directions afterwards:

```
tom   [verbs] → "at; over at; located at"      [reading-place] → "to bite"
yeej  [verbs] → "truly, really, indeed"        [reading-general] → "to win"
```

⚠️ `txog + time` is a PATTERN headword, like the existing `thaum + time`, so it
does **not** cross-link with the plain `txog` entries. That is the convention in
`clock-time`, not an oversight.

## Skipped — 4 already present with the same meaning

`sawv tsees` (reading-general, "to spring to one's feet"), `tu`, `mas`, `yeem`.
For `sawv tsees` only the bare intensifier `tsees` was missing, which is what
went in.

## ⚠️ HELD — 2, asked not added

Following the `sab sab` / `tsuag tsuag` precedent already in `vocabulary.js`:
when a list disagrees with the dictionary, the author rules. Both are commented
in place at the intensifiers set.

- **`tsaug` = "tired; exhausted"** — the dictionary has `tsaug` as "to rinse; to
  thank; to be numb", and everywhere else in this repo tiredness is `tsaug zog`,
  with `ua tsaug` as thanks. Either the list dropped the `zog`, or bare `tsaug`
  really does carry "tired" in the author's Hmong — a fourth sense deserving its
  own entry. Not a word Claude decides.
- **`lub lim tiam thib…`** — the ellipsis makes it a TEMPLATE, and a flashcard
  cannot ask "Lub lim tiam thib…". It also exposed a gap: **there is no entry for
  `lub lim tiam` (week) at all.** Two different jobs — add "week" as a word and
  let `thib` carry the ordinal, or add it as a calendar pattern like
  `txog + time`.

## Two defaults taken, flagged for correction

- **`zoo li` went into Descriptions** for want of a comparison set. It is not an
  adjective; the nearest relative is `li` in reading-speech ("like; as"). The
  alternative was `reading-general`, which is a holding pile.
- **All 16 are tagged `unreviewed`**, the honest default for an import. If the
  author wrote or verified the list they can be flipped to `reviewed` in one
  pass — 16 off the review queue instead of 16 added to it.

## Conventions confirmed while importing

- **The classifier stays in the headword** where the set already does that —
  `lub vas` sits beside `lub xauv` (lock) and `cov cuab yeej`. 64 of 2,056
  headwords include a classifier.
- **`phiaj` and `hom phiaj` are two entries**, not one with a note: the physical
  target and the abstract goal are different words, and the second is used as a
  set phrase.

Checks: `check-vocabulary`, `check-undefined-refs`, `check-splits` all clean.
