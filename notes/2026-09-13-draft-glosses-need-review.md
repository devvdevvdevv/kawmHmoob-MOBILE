# 64 draft glosses in the dictionary — unreviewed, on purpose (2026-09-13)

The reading module was answering "no entry for this word yet" on more than half
the words a learner could press. It now answers on 87% of them, and **64 of those
answers were written by Claude and have not been checked by anyone fluent.**

```
distinct story tokens : 150
in the dictionary     : 67 (45%)  →  131 (87%)
still missing         : 19
```

## ⚠️ This is the exact thing the rest of the file avoids

Every other gloss in `vocabulary.js` came from the author, from a Speak lesson,
or from the web app's own data. **These did not.** They are my best attempt from
context and general knowledge of White Hmong, added at the author's explicit
request so there is something concrete to correct rather than a blank.

**Some of them are wrong.** That is expected, not a risk being taken quietly.

## How they are marked, and how to review them

```js
tags: ['draft', 'unreviewed', 'reading']
```

```
grep "'draft'" src/data/vocabulary.js
```

**Correct the english, then DELETE `'draft'` and `'unreviewed'` from that entry's
tags.** The tag going away is the record that a person looked at it — there is no
separate checklist to keep in sync, and an entry that still carries the tag has
demonstrably not been reviewed.

### Two extra tags mark the entries most likely to be wrong

- **`'bound'`** — words I believe mostly appear *inside a compound*, so the gloss
  describes the compound rather than the word alone: `kis` (in "tag kis"), `sis`
  (in "tiam sis"), `tab` (in "tab tom"), `si` (in "ua si"), `to` (in "to taub"),
  `laim`, `maj`, `tsi`, `tsuag`, `dab`.
  **These are the best candidates for deleting outright** rather than fixing. A
  standalone entry for a bound morpheme teaches a word that does not stand alone.
- **`'name'`** — `ntxawm`, `nkaub`, `zaub` look like character names in these
  stories, not vocabulary. A dictionary entry for a character's name may not
  belong here at all.

## Ten came straight back out — and not for being mistranslated

The first review pass removed ten of the sixty-four the same day. Worth recording
because the reason was structural, not linguistic.

**Eight were fragments.** Every one of their glosses began by admitting the word
has no meaning alone:

```
kis  — 'in "tag kis", morning or tomorrow'
sis  — 'in "tiam sis" / "tab sis", but'
tsi  — 'in "dab tsi", what'
si   — 'in "ua si", to play'
```

`kis` does not mean morning. **`tag kis` means morning.** An entry like that is
the Hmong equivalent of defining *"kempt"* because "unkempt" exists — and the
damage is not a wrong definition, it is a wrong LESSON. A learner who presses
`si` and gets an answer has been taught that Hmong can be looked up one syllable
at a time, which is the opposite of true in a language built on compounds.

⚠️ **The real fix for these is the tier-3 change below**, not better wording.
Pressing `si` should surface `ua si` — the thing that actually means something.
Restore them only if that never happens AND somebody fluent says a standalone
entry is genuinely useful. Also out: `tab`, `to`, `maj`, `laim`.

**Two were characters.** `ntxawm` and `nkaub` are the girl and her brother in
"Ntxawm Lub Xauv".

⚠️ **A name in `vocabulary.js` is not merely untidy.** That file feeds the
QUIZZES, the flashcard decks and the SRS scheduler — so a learner could be asked
*"what does Ntxawm mean?"* and have it scheduled for spaced repetition.

They now live in that story's own glossary instead, along with `Zaub`. Tier 1
reads a story's glossary first and only for that story, so pressing "Ntxawm" on
that page answers and pressing it anywhere else does not — which is exactly
right, because a name means something there and nothing in general.

⚠️ **A gap analysis will now report `ntxawm` and `nkaub` as "sourceable"**,
because a story glossary is one of the sources it scans. **They must not be
added.** That is the analysis being literal, not a gap.

**Three stayed**, reworded to lead with the sense they carry alone: `dab`
(a spirit), `tsuag` (pale, faint, bland), `zaub` (vegetables — a real word that
also happens to be the great-grandmother's name).

⚠️ **Coverage went 87% → 81% and that is an improvement.** The ten entries were
false coverage: the word resolved, and the answer taught the wrong thing.

## The other 19 are a CODE fix, not a content one

Nineteen words are missing only because `lookupWord` tier 3 matches **one token
against whole entries**, so `kas` never finds `tus kas`, `kws` never finds
`paj kws`, `koob` never finds `pog koob`.

The meaning is already in the dictionary. Nothing needs writing, nothing needs
reviewing, and it would take coverage past 95%.

⚠️ **The risk is false positives** — a naive substring match would have `li`
hitting `li cas?`. The guard is to match whole tokens within a multi-word entry
rather than substrings, and to prefer an exact single-token entry when one
exists. Tier 2 already does this inside a story's own glossary; this extends the
same idea to the dictionary.

## Why do it at all, rather than wait

A reader that shrugs at half the words teaches the learner not to press them. The
gesture is the whole module. A wrong gloss is worse than no gloss **in a shipped
app** — which is why every one of these is tagged, why the tags are greppable,
and why this note exists rather than a quiet commit.

**The honest state: the reading module currently shows unreviewed definitions to
paying users.** That is a deliberate, reversible trade — `grep "'draft'"` and
delete the block to undo it entirely.
