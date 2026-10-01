# Seven more path units — six grammar (free), one speaking (Pro) (2026-09-25)

**The author:** "add some more paths if you can but keep them relevant to core
Hmong grammar, functionality or relevant Hmong speak."

**The rule for picking:** only vocabulary sets where **every word already has
an example sentence**, so each unit went live immediately (`check-path`: all
✅). Sets that failed this, or that were topic lists rather than grammar, were
left out. `directions`, for example, is AI-only and is about travel.

## The units (`src/data/path.js`)

| # | id | title / hmongTitle | set(s) | words | free |
|---|---|---|---|---|---|
| 7 | `u-tense` | Time Markers & Not / *Tau, Yuav, Lawm* | tense-markers + grammar (curated) | 8 | ✅ |
| 8 | `u-this-that` | This & That / *No, Ntawd, Ko* | demonstratives | 5 | ✅ |
| 9 | `u-location` | Where Things Are / *Hauv thiab Nraum* | locations-prepositions | 18 | ✅ |
| 10 | `u-quantity` | Some, Many, All / *Ntau thiab Tsawg* | quantifiers | 11 | ✅ |
| 11 | `u-sib` | Each Other / *Sib* | reciprocals | 6 | ✅ |
| 12 | `u-particles` | Sentence Particles / *Os, Nawb, Ne* | discourse-particles | 6 | ✅ |
| 15 | `u-siab` | Feelings & Character / *Lub Siab* | personality-siab | 15 | Pro |

- **`u-tense`** also teaches *tsis* (not), *heev* (very) and *twb … lawm*, from
  the small `grammar` set. `grammar-still` (tseem) is left out because it
  duplicates `tense-markers-still`.
- **Intro lessons**, all verified to resolve with `?fromUnit=`: tense →
  `foundations-tense-markers`, this & that → `foundations-pronouns-demonstratives`,
  sib → `vocab-sib-reciprocals`. Location, quantity, particles and siab have no
  Learn lesson and start at Flashcards, like Family.
- **Hmong titles** are built only from each unit's own headwords (the
  *Tus, Lub, Daim* pattern) or from titles already in the repo (*Sib*,
  *Lub Siab*). No grammar term was composed.

## Placement

The six grammar units were **appended after Questions (6)**, not woven into
units 1–6. Unlocking is positional, so a unit inserted between two finished
ones sends learners back for it; placed here, nobody's progress through 1–6
changes. The topic units moved down: Numbers 13, Family 14, **Lub Siab 15**,
Colors 16, Time & Days 17, Food 18, Daily Life 19. The old values are in `was`
comments. Lub Siab sits after Family (feelings about people).

## Free vs Pro

Grammar is never Pro (the "fundamentals always free" ruling), so units 7–12 are
`free: true`. `locations-prepositions`, `quantifiers` and `discourse-particles`
were added to `FREE_CATEGORY_IDS` so their flashcards and quizzes are open too.
Lub Siab is a topic, so it is Pro. The `/path` info page and the memory note now
say units 1–12 are free.

## Steps per unit (measured by bundling with esbuild)

| unit | steps | sentence builder |
|---|---|---|
| tense | flashcards, quiz, sentences, reading | 6, all human |
| this & that | all four | 5 (**4 topped up from AI**) |
| location | all four | 5 (**4 topped up**) |
| **quantity** | flashcards, quiz, reading | **none: 2 usable** |
| sib | all four | 5 (**5 topped up**) |
| particles | all four | 5 (**5 topped up**) |
| siab | all four | 6, all human |

⚠️ **Some, Many, All has no Sentences step.** Its 11 examples are
human-written, but they are fragments ("Ib co dej.", "Neeg coob."). They make
2–3 chips, below `MIN_TOKENS`. Top-up only draws on AI examples, and there are
none. The step is skipped, not blocking, so the unit completes on its other
three steps. **To give it a builder,** add five 3–9-word sentences using the
quantifiers. The fragments were left alone because they are good examples.

⚠️ **18 more AI-drafted sentences are now drills:** 4 in This & That, 4 in
Location, 5 in Sib, 5 in Particles. That is on top of the 12 from earlier today.
Sentence Particles is the riskiest: all six examples are AI, and particles are
exactly the words a non-speaker gets wrong. **Review those first.**

## Checks

`check-path` reports 20 units, 19 live, and 19 of 19 Hmong names. Lint, refs,
notes, theme and vocabulary checks pass. **Not opened on a device.**

---

## Update, same day: Some, Many, All has its sentence builder

The author ran a Perplexity prompt I wrote: two 4–9-word sentences per
quantifier, in the import JSON shape, carrying the house rules (classifiers,
tsis txhob, muaj … xyoos, aub). It returned 22 sentences.

**Saved in full:** `_incoming/sentences-batch-10-quantifiers.json`. Held rows
carry `"hold": true` and a `"why"`.

**Checked against the dictionary before use. 7 were held:**

| held | why |
|---|---|
| 4 × "…lub **kua**" = apples | *kua* is liquid/juice (kua hau = soup, kua qaub = vinegar). Apple is **txiv es pauj** in vocabulary.js |
| "Lub **tsev kawm** muaj…" | school is **tsev kawm ntawv** |
| **coob** / **tsawg** before the noun ("coob tus neeg", "tsawg daim nyiaj") | the entries' own human examples put them after ("Neeg coob", "Neeg tsawg"). The human data wins |

One kept sentence got its English corrected: "Tag nrho lub tsev ntxuav lawm"
means "…has been washed", not "…is clean now".

**15 kept, and stored as `moreExamples`, not `exampleSentence`.** Every
quantifier already had a human-written fragment ("Ib co dej."). The importer
never overwrites one, and it shouldn't: the fragment is a good flashcard
example. So:
- **`moreExamples: [...]`** is a new optional field on a vocab entry, added to
  9 of the 11 quantifiers. *coob* and *tsawg* have none, because both of
  their sentences were held. Every row is `source: 'ai'`.
- **`pathUnitExercises` in `lib/sentenceBuilder.js`:** the top-up reads
  `moreExamples` as well as an AI `exampleSentence`. Nothing else reads the
  field: flashcards, the reader and the open drills are unchanged.

**Result:** `u-quantity` now has all four steps. Its sentence builder is 2
human fragments that are long enough ("Qee tus neeg.", "Tag nrho cov neeg.") +
3 from `moreExamples`.

⚠️ **The 15 kept sentences still need a fluent read.** Perplexity got the
basics wrong in 7 of 22, so "looks right" is not enough. To use `moreExamples`
for another word, add the array by hand. `import-sentences.mjs` does not write
this field.

### ⚠️ Then withdrawn, same day

The author: "never mind I will ask another model and then verify with a native
speaker." The Perplexity sentences made 7 basic mistakes in 22, so none of them
ship.

- All 9 `moreExamples` blocks in vocabulary.js are **commented out**, each with
  a `PULLED 2026-09-25` marker and a restore hint. None is live.
- **The mechanism stays:** the `moreExamples` field and the top-up that reads
  it. The next, speaker-verified batch goes in the same place. If a speaker has
  checked a sentence, it can go in without `source: 'ai'`.
- `u-quantity` is back to **flashcards, quiz and reading**, with no Sentences
  step until the new batch lands. The skipped step doesn't block the unit.
- The batch file `_incoming/sentences-batch-10-quantifiers.json` is kept as a
  record of what was tried and why 7 were held.
