# Verb definitions read "to …" — 2026-10-20

Author: *"for all verbs, ensure that the definition is 'to (verb definition)'"*,
asked while looking at the Core Verbs unit.

**Landed: 385 of 439 verb-tagged words.** 30 entries rewritten in two passes,
43 strings in all. The remaining 54 are **not** a script job and are tracked at
the top of `## Content debt` in [TODO.md](TODO.md) with the four reasons.

## What changed

| pass | where | entries |
|---|---|---|
| 1 | the whole `verbs` category — the Core Verbs set | 14 |
| 2 | `will-permission` (9), `directions` (4), `money` (2), `nyob` | 16 |

Examples: `mus` "go" → **"to go"**, `ua` "do; make" → **"to do; to make"**,
`hais` "say; speak; tell" → **"to say; to speak; to tell"**, `saib` "look at;
watch" → **"to look at; to watch"**, `nyob` "be located; live; stay" → **"to be
located; to live; to stay"**.

**Each clause gets its own "to".** `kub siab` was "be enthusiastic; determined;
eager" — prefixing only the front gives *"to be enthusiastic; to determined"*, so
it is now "to be enthusiastic; to be determined; to be eager". Same for
`khib`: "to be jealous; to envy".

## ⚠️ `english` and its pinned sense move together

Most of these words carry a `senses` entry whose `en` is an exact copy of
`english`, with `context` set to the word's own category:

```js
{ id: 'verbs-say', hmongRPA: 'hais', english: 'to say; to speak; to tell',
  senses: [{ en: 'to say; to speak; to tell', context: 'verbs' },
           { en: 'state; explain; report', context: 'reading' }], … }
```

`WordDetail` hides a sense it has already printed by **string-comparing** the
two. Change `english` alone and the card prints the same definition twice —
which is exactly the `siab` bug of 2026-10-05, found by the author
("where is the button to see the other definitions of siab?"). So both batches
replace every copy of the old string inside the entry, which is why 30 entries
came to 43 strings.

Senses in OTHER contexts were left alone. They are genuinely different meanings,
and several are not verbs at all: `teb` has a `places` sense ("land; country, as
in Teb Chaws Asmeskas"), `los` has a `grammar` sense ("also; even; too").
Prefixing those would invent *"to also; to even"*.

## ⚠️ Why the rest was held back

A regex pass over the other 54 produced, verbatim: *"to sick; ill"*, *"to corn
silk; to hair-like items"*, *"to determined"*, *"to art; to painting"*. The data
is not uniform enough:

- **`reading-*` entries hold several senses in one string**, split by `·`, mixing
  parts of speech — `mob` = "sick; ill · pain; illness; injury · hurt; be
  painful" is adjective, then noun, then verb.
- **The `(verb: to buy)` convention** already says "to", inside a label that also
  disambiguates `yuav` (buy) from `yuav` (future marker) and `rau` (put on
  footwear) from the other `rau` entries.
- **Copulas and modals** — `yog` "is, am, are", `kuv yog` "I am", `yuav tsum`
  "must; have to". "to is, am, are" is not a definition.
- **Two mis-tagged nouns** carry `tags: ['verb']`: `ntxhuav` ("corn silk;
  hair-like items") and `kos duab` ("art; painting; to draw"). The tag is the
  bug there, not the definition.

## Two scripting traps, both of which bit

**Brace counting does not find an entry's extent in `vocabulary.js`,** and it
fails in the dangerous direction. Half the entries are written one field per
line with `id:` on a line of its own, carrying no brace — so counting from `id:`
reaches depth 0 on the first line and the search window is one line wide. Every
replacement then matches nothing. The first run of the script "succeeded" and
wrote no change until a `throw` on a zero-match made it visible. **Bound an entry
at the next `id:` instead.**

**Apostrophes are backslash-escaped in the source.** Definitions with quoted
asides — `xav ('want')`, `'hot heart'`, `one's mind` — are stored as `\'` inside
a single-quoted string, so searching for the raw text matches nothing. The
replacement has to escape both sides.

## Verified

- `check-vocabulary.mjs` — 69 tagged cards, each still showing exactly one
  answer matching its `english`
- `check-sense-pins.mjs` — all pins valid (pins target **ids**, not gloss text,
  so rewording a definition cannot break one)
- `check-undefined-refs.mjs` — 302 files, clean
- no quiz hardcodes a gloss: `vocabQuizzes` in `quizzes.js` derives every
  question from `categories`, so the options moved with the data

## Also today

Lesson prose markup — `###` headings, bolded Hmong, the classifier blocks, the
15 imported sentences, the cross-references and the "In a nutshell" conclusion —
is in [2026-10-20-lesson-prose-markup.md](2026-10-20-lesson-prose-markup.md).
The joined-compound ruling (`phoojywg`, `tabtom`, `xibfwb`) is §4 of that note.
