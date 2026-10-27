# "Also means" promoted to real entries (2026-10-02)

A sweep of every word rendering an **"Also means"** block, and eleven senses
given dictionary entries of their own.

Second batch of the day — follows
[2026-10-02-multi-entry-dictionary-batch.md](2026-10-02-multi-entry-dictionary-batch.md).

---

## What "Also means" actually is

`WordDetail` renders it from `elsewhere`:

```js
const inDomain  = sensesFor(word, domainOf(word.category))
const elsewhere = allSenses(word).filter((s) => !inDomain.includes(s))
```

— [WordDetail.jsx](../src/components/vocabulary/WordDetail.jsx),
  [senses.js](../src/lib/senses.js)

So it lists the senses in a word's `senses[]` array whose `context` falls
**outside the entry's own domain**. **68 words** render it.

## The problem it hides

A footnote is right for a *shading* of the same word. It is wrong for a word a
learner meets in a different lesson entirely, because then:

- **no card exists** for that meaning — it is a line of text on someone else's
  entry;
- **search cannot reach it**, since search indexes entries;
- the learner who looks the word up lands on an unrelated meaning and has to
  read to the bottom to find theirs.

`siab` was the clearest case: this app has a whole **personality-siab** category
built on it — *zoo siab*, *nyuaj siab*, *chim siab* — and the word those are
built FROM had no entry. It was a footnote on **"tall"**. Someone meeting *kuv
zoo siab* and looking up `siab` got an adjective about height.

## ⚠️ Not all 68 were split — most should not be

The test, set in yesterday's batch: **would a learner meet these senses in
unrelated lessons?** If they are one word seen from two angles, a footnote is
correct and a second card is noise.

Left alone, deliberately:

| | why |
|---|---|
| `koj` you / your, `lawv` they / their, `nkawd` | one pronoun, two grammatical roles |
| `muag` sell / be for sale · `txhua` every / all · `hais` say / state | shadings of one verb |
| `zoo` good / beautiful / properly / okay | one adjective across registers |
| `mus` go / leave / proceed · `saib` watch / examine / care for | serial-verb range, not separate words |
| `tau` (6 senses) | one aspect marker; splitting it would scatter the grammar |
| `leej twg = who`, `tub ceev xwm = police` | **compounds**, not senses of the bare word |
| `mov` rice / food | both are food — same domain, so not even a cross-domain case |
| `ntxov` early / morning-element · `niam` mother / female-element | one meaning plus its compounding use |

## Already covered — no entry needed

Four candidates turned out to have their second entry already. Checked before
adding anything, per the no-duplicate-headwords rule:

| word | the other sense already lives at |
|---|---|
| `txiv` father → **fruit** | `ag-txiv` (agriculture-foodstuffs-3) |
| `teb` answer → **land, country** | `bld-teb` (places) |
| `puas` hundred → **yes/no question marker** | `question-words-yes-no` |
| `Suav`, `Fabkis`, `Thaib`, `Nyab Laj`, `Qhab Meem`, `Nyij Pooj`, `Kaus Lim` | `country-teb-chaws-*` (countries) |

## The eleven promoted

Originals are **unchanged** — their `senses[]` arrays still carry the sense, so
the "Also means" footnote still shows **and** the card now exists. Both routes
reach the meaning, and they cross-link by headword through `headwordOf()`.

| word | new entry | category | was a footnote on |
|---|---|---|---|
| **siab** | the heart; inner self, mind, feelings and intentions | `personality-siab` | `descriptions-tall` (tall) |
| **plaub** | hair; fur — the element in *plaub hau* | `human-anatomy-face` | `numbers-4` (four) |
| **lwj** | to rot, decay; rotten · ruined, corrupt | `reading-general` | `animal-lwj` (deer) |
| **txhais** | to translate; to interpret; to mean | `reading-speech` | `classifiers-txhais` (classifier for a paired body part) |
| **pob** | a ball; a round lump | `reading-general` | `classifiers-pob` (classifier) |
| **txog** | to reach; to arrive at | `verbs` | `conjunctions-about` (about, concerning) |
| **kom** | to tell; to direct someone | `verbs` | `conjunctions-so-that` (so that) |
| **los** | also; even; too — additive particle | `discourse-particles` | `verbs-come` (to come) |
| **theem** | a floor; a storey of a building | `housing` | `classifiers-theem` (step, level, tier) |
| **vaj loog** | a kingdom; a realm | `reading-place` | `ag-vaj-loog` (garden) |
| **Askiv** | the United Kingdom; England | `countries` | `country-askiv` (English, the people) |

`plaub` (four / hair) and `lwj` (deer / rotten) are pure homophones — nothing
links the meanings but the spelling.

Headword groupings after the batch:

```
siab      personality-siab, descriptions, human-anatomy-internal-organs
pob       classifiers, discourse-particles, reading-general
txog      verbs, conjunctions          kom     verbs, conjunctions
los       verbs, discourse-particles   theem   classifiers, housing
plaub     numbers, human-anatomy-face  lwj     animals-2, reading-general
txhais    classifiers, reading-speech  vaj loog agriculture-foodstuffs-3, reading-place
Askiv     countries-3, ethnicities
```

## ⚠️ Three things the check scripts caught

Worth recording, because all three are invisible in the app.

**1. A `·` gloss puts EVERY clause on the flashcard.**
`check-vocabulary.mjs` rejected two new entries: a card would have asked for one
meaning and accepted a list. Fixed by making each a single sense rather than
adding a tagged `senses[]`:

- `siab` — "intention; willingness; emotional state" is not a second meaning,
  it is the same inner-self sense, so it folded into the one gloss.
- `txog` — "until; up to, as far as" is the GRAMMAR sense and
  `conjunctions-about` already lists it. **Dropped rather than tagged**, or the
  same meaning would sit on two cards in two domains.

**2. `SET_SPLITS` is a hand-typed id list, so a new word silently falls into the
LAST part.** `country-askiv-country` landed in part 3 ("Europe, Africa and South
America") instead of part 1 with its siblings. `check-splits.mjs` warns —
*"is in no part — it landed in part 3"* — and the fix is naming the id in the
part it belongs to.

**3. `category` must match the array the entry sits in.** Enforced by
`check-vocabulary.mjs`; it decides both the context tag and which senses render.

**Run `check-vocabulary`, `check-splits` and `check-sense-pins` after any
vocabulary edit.** Two of these three would have shipped silently.

## Verification

```
scripts/check-vocabulary.mjs   68 tagged cards · each shows one answer ✅
scripts/check-splits.mjs       5 sets → 14 parts ✅  (0 warnings)
scripts/check-sense-pins.mjs   all 2 pins valid ✅
eslint                         clean
2,040 entries · 0 duplicate ids · 0 category mismatches
```

**"Also means" still reports 68 words — that is correct and intended.** The
originals keep their `senses[]`, so the footnote remains; the change is that
eleven of those senses now also have a card. Stripping the footnotes would make
the reader's long-press lookup worse, which is the one place a reader wants every
sense at once.

## Open

- [ ] `kab lia` — "dimple" also lists **mealworm**, carrying its own note:
      *"unrelated sense; needs a speaker to confirm"*. **Not promoted** — an
      unconfirmed sense should not become a card. Needs a speaker.
- [ ] `Askiv` has no *Teb Chaws* form, unlike its seven siblings. The headword
      stays bare rather than inventing "Teb Chaws Askiv". Worth confirming.
- [ ] New example sentences are `source: 'ai'` and want a read.
- [ ] The 106 `·`-gloss split candidates from the first batch are still open and
      are a different list from this one.

---

## Correction: `siab` is the LIVER, not the heart (same day)

The promoted entry opened with **"the heart"**. Wrong, and wrong in a way that
teaches the English metaphor instead of the Hmong one.

**Hmong puts the feelings in the LIVER.** `siab` is the organ, and every feeling
compound is built on it — *zoo siab*, *nyuaj siab*, *chim siab*. Two things in
this repo already said so and the entry contradicted both:

- the Adjectives lesson: *"Many feeling words are built with siab (heart,
  literally the liver)"*
- `human-anatomy-internal-organs-liver` — **the same word**, glossed "liver"

Now:

> the liver — and the seat of feeling and intention, where English says heart
> (noun); what the feeling words are built on: zoo siab, nyuaj siab, chim siab

"where English says heart" stays: a learner reading `zoo siab` needs to land on
*happy*, not on anatomy.

### ⚠️ A second, older bug found while checking: a missing classifier

`human-anatomy-internal-organs-liver`'s example read:

```
✗ Kuv siab ua haujlwm zoo.      "My liver is working well."
✓ Kuv lub siab ua haujlwm zoo.
```

**Bare `kuv siab` does not say "my liver" — it reads as the ADJECTIVE**, "I am
tall / high", which is precisely the other `siab` entry. An organ is a thing and
takes `lub`, the same rule as *lub tsev*, *lub taub hau*.

Not introduced by this batch — it predates it. Found only because the three
`siab` entries were being read side by side, which is itself an argument for the
split: the meanings were never visible together before.

⚠️ **`sed` caught the comment too.** The one-line replacement rewrote the OLD
sentence quoted inside the explanatory comment above the entry, turning the
record of the fix into a copy of the fix. Restored by hand. **A blind
find-and-replace will edit the comments that quote the thing being replaced.**

### The three `siab` entries now

| id | category | gloss |
|---|---|---|
| `descriptions-tall` | descriptions | tall; high |
| `human-anatomy-internal-organs-liver` | human-anatomy-internal-organs | liver |
| `personality-siab-noun` | personality-siab | the liver, and the seat of feeling |

The organ entry and the feeling entry are the same noun seen two ways, kept
apart because the categories teach different things — anatomy in one, the
feeling compounds in the other.
