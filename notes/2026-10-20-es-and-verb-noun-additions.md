# `es` in the dictionary, four more verb + noun phrases, and one desync — 2026-10-20

Three content changes from one message, plus a check failure found on the way.

## 1. `es` — ⚠️ SHIPPED AS ONE ENTRY; THE AUTHOR OVERRULED THAT

> **⚠️ SUPERSEDED, AND NOT YET IMPLEMENTED — 2026-10-20.** The author read this
> and corrected it: *"look at the dictionary, certain words with multiple
> meanings have multiple entries within that particular word, rau for example,
> replicate the same with es, please."* So `es` is to be **split the `rau` way**:
> one entry per meaning, each in the category that meaning belongs to.
> `rau` is the worked example — three entries, in `wear-verbs`, `conjunctions`
> and `numbers`, one meaning each and no `senses` array.
>
> A likely shape, from the categories that exist: the plain connective in
> `conjunctions`, and the result sense in `so-then` ("So, Then & Therefore",
> which already holds `thiaj`, `yog li` and `txawm` — exactly this job). The
> sequence sense is the awkward one: the author's own note is that `ces` is the
> word for "and then", and their example for it uses `ces`, not `es`.
>
> **As of this writing the dictionary still has the single entry below.** The
> reasoning kept below is what was shipped, not what was wanted.

Author's table gave four uses, with their own note that **the categories
overlap**:

| use | gloss | example |
|---|---|---|
| connecting ideas | so, and so | `Nws tshaib plab es nws noj mov.` — They are hungry, so they eat. |
| showing a result | so, therefore | `Los nag es peb nyob hauv tsev.` — It rains, so we stay home. |
| moving a story forward | then, and then | `Kuv sawv, ces kuv mus ua haujlwm.` — I get up, then I go to work. |
| related action | so, and so | `Nws tsis tuaj es peb mus lawm.` — They didn't come, so we left. |

Added as `conjunctions-es`, placed **immediately after `ces`**
(`conjunctions-then`) so the pair a learner confuses sits together in the deck.

**⚠️ Why one entry and not four.** The author's own distinction settles it:
*"The grammar reference supports `es` meaning 'so', while `ces` is the common
connector meaning 'and then'."* These are one connective read in four contexts,
not four meanings in four domains — so they belong in `senses` under a single
headword, which is exactly how `ces` beside it is already written. Four entries
would put four near-identical cards in one deck, which is the thing
[the headword rule](2026-09-26-dictionary-headwords-and-sense-pins.md) exists to
prevent. The `rau`-style split is for a word whose meanings live in **different**
domains.

**⚠️ The third example uses `ces`, not `es`** — the author's point made in a
sentence. The sequence sense is recorded with that caveat written into the gloss
("though *ces* is the usual choice for this") rather than offered as an equal
option.

**⚠️ Tagged `unreviewed`, and the reason is on the record:** *"The example
sentences above are learner-oriented examples"* — built to teach the pattern, not
transcribed from speech. Source cited: langsci-press.org. All four sentences are
kept in the comment above the entry so none is lost if the gloss is reworked.

**Still open:** the **So, Then & Therefore** lesson covers *Yog Li, Thiaj, Ces,
Txawm* and does **not** mention `es`. The word is now in the dictionary but has
no lesson that teaches it.

## 2. Four more verb + noun expressions

From the author's table into `foundations-verb-nouns-examples` (16 items now),
literal and natural glosses as written:

| | literal | natural |
|---|---|---|
| `ntxuav tais diav` | wash dishes | Wash the dishes |
| `ntxuav khaub ncaws` | wash clothes | Do the laundry |
| `ua noj` | do cooking | Cook / prepare food |
| `thaij duab` | take a picture | Take a photo |

**⚠️ THEY BELONG IN THIS LESSON, not in a chores set**, and the note in the file
says why: each one is a case where the natural English is **not** the sum of the
parts. "Do the laundry" has no "do" in Hmong terms — `ntxuav` is simply wash —
and `ua noj` is literally "do eat", which a word-for-word reading turns into
nonsense. That is the lesson's entire argument, so they sit beside `ua tsaug`.

`ua si` (play) was already there.

## 3. ⚠️ A desync the check caught: `qhia`

`check-vocabulary.mjs` failed with:

```
❌  qhia [verbs-tell] — english and senses disagree.
      english: to teach; to tell; to inform;
      senses : to tell; to inform
```

The author had added "to teach" to the definition after
[the verb "to" pass](2026-10-20-verb-definitions-to-prefix.md) and the pinned
sense kept the old pair (plus a stray trailing `;`). Both brought back into step.

**This is the rule that keeps biting, so it is worth stating plainly: when you
edit a word's `english`, edit the sense whose `context` equals the word's own
category in the same breath.** `check-vocabulary` asserts they match, and
`WordDetail` hides an already-printed sense by comparing those two strings — so a
drift shows up as the card printing its definition twice (the `siab` bug of
2026-10-05). 70 tagged cards pass again.

## Gaps left on purpose

- `nkauj` (song, music) has no dictionary entry, though `verb-noun.js` teaches
  `mloog nkauj`.
- `es` has no lesson (see §1).
Both are in `## Content debt` in [TODO.md](TODO.md).
