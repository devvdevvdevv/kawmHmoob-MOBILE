# `xov` takes `lub`, not `tus` — a wrong classifier in 12 places (2026-09-13)

The author's correction, verbatim:

> *"tus xov is incorrect, it should just be `xov` and importantly, `lub xov` when
> used with a classifier."*

Two separate claims in one sentence, and both had to be applied somewhere
different:

1. **The headword is `xov`.** `tus xov` was never a dictionary word — it was a
   classifier stuck to a noun and stored as if it were a lexical item.
2. **The classifier is `lub`.** So every line of prose that used one was using
   the wrong one.

## What changed — 12 places

| file | what |
|---|---|
| `src/data/vocabulary.js` | headword `tus xov` → **`xov`**, english now names the classifier, tags `phrase` → `noun` |
| `src/data/stories.js` glossary | `tus xov` → **`xov`** — *"takes the classifier lub: 'lub xov'"* |
| `src/data/stories.js` prose | 4 story lines, `tus xov` → **`lub xov`** |
| `src/data/stories.js` quiz | 2 question prompts + 3 `because` evidence quotes |

⚠️ **I changed the author's own Hmong prose, which is normally off limits.** The
standing rule in this repo is that every Hmong line came from the author and is
copied verbatim — I do not invent or edit Hmong. This is the exception that
proves it: applying the author's stated correction is not inventing Hmong. The
four lines are 125, 141, 145 and 173 of `stories.js`, and they are called out
here so the change can be vetoed by reading one paragraph rather than a diff.

The `because` fields had to move with the prose. They **quote** the paragraph
they point at — *"Paragraph 4 — 'Lub xov ntawd xim daj…'"* — so leaving them
would have produced evidence that no longer appears in the story. That kind of
error renders perfectly.

## The id deliberately still says `misc-tus-xov`

```js
{ id: 'misc-tus-xov', hmongRPA: 'xov', english: 'string, thread, cord — classifier lub: "lub xov"', … }
```

It looks like a leftover. It is not.

> **A word id is an address, not a spelling.** The notebook and the due-words
> queue save `misc-tus-xov`. Renaming it to `misc-xov` would not migrate those
> rows — it would orphan them, and the learner would watch a saved word vanish.

Same reasoning as `storyStepId()` being keyed on the story id and never its
position. The comment in `vocabulary.js` says so at the site, because the next
person to see it will reasonably want to tidy it.

## The correction made the lookup better, not just righter

Before, `xov` alone was **not in the dictionary at all**. Tapping it fell through
to tier 4, the compound fallback added earlier the same day, which answered
`tus xov` — the right meaning by the wrong route, and displaying a phrase the
learner had not tapped.

Now it is an exact hit at tier 1 inside the story and tier 2 outside it.
Verified by running `lookupWord` against the real data:

```
in Ntxawm Lub Xauv:
  tap "xov"    xov — string, thread, cord — takes the classifier lub…  [glossary]
  tap "lub"    lub — (classifier for round or solid objects…)          [dictionary]
  tap "tus"    tus — (classifier for people, animals…)                 [dictionary]
  tap "kas"    tus kas — goat                                          [compound]
```

`tus` and `lub` both answer as classifiers, which is what they are. **A
one-syllable word is more useful in the dictionary than a two-word phrase that
happens to contain it**, and this entry had been the wrong one of the two since
it was added.

## Two documents rotted and were corrected, not deleted

`tus xov` was the worked example in the write-up of the *"every `tus` meant
`tus xov`"* bug — `learning/concepts/lookup-ranking-and-fallbacks.md` and
`notes/2026-09-12-ntxawm-lub-xauv.md`. Its exercise told you to tap `tus` and
watch the app say *"string, thread, cord"*. It will not any more.

Both now carry a dated correction and a replacement example (`tus kas`, still a
two-word glossary entry containing `tus`). ⚠️ **The bug report itself stays as
written.** It is an account of something that happened; rewriting history to
match today's data makes a record that cannot be trusted. The rule that came out
of it — *exact beats partial* — was never about this word.

`scripts/check-notes.mjs` now asserts `stories.js` contains no `tus xov` outside
a comment. That is the claim most likely to be broken by a future story written
from the old habit.

## Still open: nobody has audited the other classifiers

This was caught because the author read one entry. The same shape is sitting in
the data unchecked:

- `lub xauv` (lock) and `tus kas` (goat) are in the same glossary, stored the
  same way, and are believed correct — `lub` for objects, `tus` for animals.
- **`src/data/vocabulary.js` holds 77 entries tagged `phrase`**, and an unknown
  number of them are classifier + noun rather than a real phrase.

⚠️ Every one of those has the same two problems this did: the headword is not
the word, and the classifier is unverified. A pass over the `phrase` tag,
splitting genuine phrases from classifier-plus-noun, is the follow-up — and it
needs a fluent reader, not a script.
