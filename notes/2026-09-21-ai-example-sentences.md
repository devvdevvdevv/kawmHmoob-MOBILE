# AI-written example sentences — where it stopped (2026-09-21)

**Example-sentence coverage: 308 → 1,074 of 1,349 words (23% → 80%).**
766 of those are AI-written and tagged `exampleSentence.source === 'ai'`.
Paused here by the author; nothing is half-applied.

## How it works

The pipeline is in `instructions/adding-vocabulary.md` → "Bulk example sentences".
In short: `node scripts/export-sentences-needed.mjs` → paste `_incoming/needed/PROMPT.md`
+ a batch into an LLM → `node scripts/import-sentences.mjs <reply>.json [--write]`.

**AI sentences are kept OUT of the sentence builder** until reviewed —
`INCLUDE_UNREVIEWED_AI = false` in `src/lib/sentenceBuilder.js`. They show on
flashcards and in the reader. Reviewing one = checking it, then deleting its
`source: 'ai'`. Flipping the switch lets all 766 into the builder at once.

## What is left

| | words |
|---|---|
| needed (topical decks) | 37 — one batch |
| optional (reading groups) | 190 — reader long-press only; fine to skip |
| skipped | phrases, bound words, and entries that need review first — `_incoming/needed/SKIPPED.md` |

`_incoming/ALL-REMAINING.json` holds needed + optional in one file.

## What the importer now does on its own

Every rule below came from a real failure in a batch:

- **rejects** non-Latin script (a batch slid into Thai mid-word), a headword
  missing from its own sentence, and English words already seen leaking in:
  church, marinate, Asian, butter, downtown, day names
- **fixes** `tug` → `tus` and `dev` → `aub` (the author's White Hmong and dog
  rulings — the model wrote `tug` in almost every batch)
- **handles** split frames (`txawm ... los`, `tsuas ... xwb`), entries ending in a
  `senses` array, and trailing `// TODO-VERIFY` comments
- **never overwrites** an existing sentence, and **proves the edited file loads**
  before replacing `vocabulary.js`

## ⚠️ What no rule catches — the model's recurring errors

Worth watching when these are reviewed:

- **Kinship with a classifier.** `kuv tus txiv` is my HUSBAND, `tus niam` points
  to a wife, and `txiv laus` is also a kin term. The model swapped these three
  separate times.
- **The app's own word vs. the model's.** It reached for `mov ci` (bread; the app
  says `qhaub cij`), `qab zib` for sugar (`piam thaj`), `txiv qaub` for lime.
- **English that reads plausibly.** "plants" when `nroj` is weeds; "drinks milk"
  on a BREAST card.
- **Spacing.** `hauj lwm` spaced in about a dozen sentences — see open question 1.

## Open questions for the author

1. **`haujlwm` or `hauj lwm`?** Sentences were respelled solid, except where an
   entry's own headword is spaced (e.g. the fire-station compound).
2. **Garlic: `qej` or `qij`?** The model wrote `qej` every time; the entry is
   `lub qij`. Four sentences were respelled to match the entry.
3. **`txuag`** is glossed "to spray" but usually means to save / be thrifty.
4. **`nroj zaub`** (vegetable oil) — probably a typo for `roj zaub`.
5. **`koj vaj tse`** (architecture) — probably a typo for `kos vaj tse`.
6. **`khej dub`, `qhab`, `mev`** — are these neutral terms? Each now has a sentence.
7. **`kas` and `tshis`** — two words for goat in one deck.
8. The **18 classifier-prefixed headwords** outside animals (`lub tsheb`, `daim
   nplooj`…) — strip them like the animal names, or keep them?

17 entries are tagged `needs-review`; they are listed in `SKIPPED.md` with why.

---

## Added by hand, same day

**`descriptions-wet` — `ntub` = wet**, in Common Descriptions (now 27 words).
Word and sentence both from the author:

> Koj cov khaub ncaws ntub tas lawm. — Your clothes are all wet.

- **No `source: 'ai'` tag**, because a person wrote it — so it is live in the
  sentence builder immediately, unlike the 766 AI sentences held behind
  `INCLUDE_UNREVIEWED_AI`. Verified: it appears in `allSentenceExercises()`.
- **`audioFile: null`** — no recording supplied yet.
- Its opposite, **`qhuav` (dry)**, lives in the weather deck, not descriptions.
  Worth moving or duplicating if a "describing things" unit ever pairs them.

This is the shape to follow for any word the author adds directly: human
sentence → no tag → straight into the builder.
