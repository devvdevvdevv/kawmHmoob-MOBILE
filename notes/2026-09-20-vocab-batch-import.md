# Vocabulary batch import and restructure — 2026-09-20

A supplied dataset of 488 entries merged into `src/data/vocabulary.js`, in two
halves: a chat paste that truncated at 50,000 characters, then the file that
carried the rest (`_incoming/hmong_vocab_dataset.ts`).

**926 → 1,393 words. 48 → 62 categories. `check-vocabulary.mjs` passes — for the
first time.**

> ⚠️ **READ SECTION 2 BEFORE SECTION 3.** Most of this note's first draft was a
> defect report about 142 "hidden multi-sense glosses". That report was wrong,
> the data was fine, and the reason it looked broken is the most useful thing
> here.

---

## 1. What landed

| category | entries | |
|---|---|---|
| `agriculture-foodstuffs` | 62 | |
| `cooking` | 22 | |
| `animals` | 31 | merged into the **existing** category |
| `arts-culture` | 11 | |
| `botany` | 12 | |
| `buildings-places` | 46 | |
| `food-drinks` | 34 | |
| `geography-nature-weather` | 41 | |
| `war-conflict` | 11 | |
| `chores-directions` | 20 | |
| `seasons-time` | 9 | |
| `body-health` | 40 | |
| `vehicles-travel` | 10 | |
| `countries-nationalities` | 54 | |
| `general-vocabulary` | 85 | kept out of the themes on purpose |

488 supplied, 5 commented out (§4), 483 live. The export was named
`vocabularyCategories`; this file exports `categories`, so it was merged into the
existing array rather than added as a second export.

**`animals` collided with a category that has existed since the beginning.**
Every supplied entry already carried `category: 'animals'`, so they merged into
the existing array. A second category with a duplicate id would have rendered
two identical tiles and made `getCategory('animals')` return whichever came
first.

### Merged by diff, not by hand

The second half was merged by a script that loaded the source and
`vocabulary.js` side by side, matched on `id`, and emitted only what was missing.
Two facts fell out of that which a manual merge would not have surfaced:

- the 287 entries transcribed by hand from the paste are **byte-identical** to
  the source — 0 drift across `hmongRPA`, `english`, `tags`, `category`
- the source file has **0 duplicate ids** internally

Re-verified after merging: all 488 present, 0 drifted.

### Themes

`CATEGORY_THEMES` is display-only and an unassigned category falls into "More".
Left alone this batch would have put **14 categories in "More"** — the wall of
cards the grouping exists to prevent.

- **Nature & Food** ← `geography-nature-weather`, `botany`, `food-drinks`,
  `cooking`, `agriculture-foodstuffs`
- **Home & Places** ← `buildings-places`
- **Everyday Speech** ← `chores-directions`
- **Time, Numbers & Money** ← `seasons-time`
- **The Body** ← `body-health`
- **Culture & the Wider World** — new theme ← `arts-culture`, `war-conflict`,
  `countries-nationalities`, `vehicles-travel`

"More" holds 3: `misc`, `misc-phrases`, `general-vocabulary`.

**`general-vocabulary` is a waiting room, not a category.** 85 words — *life,
dead, clean, dirty, famous, business, attitude, to confess* — with no question a
learner would open that deck to answer. That is the same call `misc` and
`misc-phrases` already carry, and the reasoning is written into
`CATEGORY_THEMES` next to the decision. As its words sort into real themes, move
them OUT; that is what a waiting room is for.

---

## 2. ⚠️ The mistake this import actually taught: `;` is not `' · '`

**The rule, which was true all along and written down nowhere:**

```
';'     separates SYNONYMS of one sense.    'loj' → 'big; large'
' · '   separates DISTINCT SENSES.          'plaub' → 'four · hair'
```

`check-vocabulary.mjs` splits on `' · '` to find flashcards teaching a meaning
their deck never asked about. A `;` stack needs no `senses` array because it *is*
one answer, spelled several ways.

**What went wrong.** The batch uses `;` throughout. That was read as 142 entries
smuggling multi-sense glosses past a checker that "could not see them", and
written up as a defect needing 142 rewrites, with three remediation options and a
recommendation. All of it was wrong. Measuring instead of assuming:

```
';'   glosses : 245 total — 103 of them PRE-DATE this import,
                across 21 categories including verbs, pronouns,
                descriptions, classifiers, money, timeframes
' · ' glosses :  92 total — every single one in misc or misc-phrases,
                the two categories the checker already exempts
```

`nws` → `'he; she; it'` has been on a pronouns card since the beginning. It is
not a leak. The batch matched the repo's convention exactly; the convention just
had no home outside the data.

> ⚠️ **The lesson is not "check before writing the defect report", though that
> too.** It is that a rule enforced by a script, obeyed by 103 entries, and
> stated in no comment is indistinguishable from an accident. Two separators that
> look interchangeable and are not will be mixed by the next person, and the
> checker's failure message says nothing about which one to reach for.

**Fixed.** The rule is now in the header of `vocabulary.js` and in
`instructions/adding-vocabulary.md`, with the test to apply: *would a flashcard
in this category accept both halves as the right answer? Yes → `;`. No → `' · '`
plus the `senses` array.*

`general-vocabulary` was deliberately **not** added to the checker's
`NOT_TOPICAL` exemption, though it is a catch-all like `misc`. It is green
without it, and leaving it out keeps the check strict: a future `' · '` gloss
there will be forced to declare its senses rather than being excused.

---

## 3. Fixed in this pass

### The pre-existing failure, now green

`misc-npau-taws` had **no `category` field at all** — the one thing the checker
had been failing on. `category` decides both the card's context tag and which
senses display, so undefined failed silently in two places. Given
`category: 'misc'`, plus the `tags` and `audioFile` the entry was also missing.

### Five headwords that were English words

Commented out **in place, not deleted**, each with a restore hint:

```
nplej barley    barley      liab gorilla    gorilla
noob cereals    cereals     ntses orca      orca
                            ntses salmon    salmon
```

A card for `nplej barley` asks the learner to recall "barley" and rewards them
for answering "barley". Not a wrong translation — a non-translation, and it would
be memorised as a real word. The entries are otherwise complete, so restoring one
means replacing the English token and uncommenting.

### Two typos

- **`bld-nkauj` "stable" → `nkuaj`.** `nkauj` is song / young woman. `nkuaj` is a
  pen — the same word `bld-nkuaj` carries for "jail" two entries down, a pen for
  animals and a pen for people.
- **`bot-tauv-nroj` → `bot-tauj-nroj`.** The id said `tauv`, the headword said
  `tauj`. Safe to realign because the entry was one day old, so no saved progress
  keys off it. An older id could not have been touched.

### Two entries that genuinely did cross domains

The only two `;` stacks in a *topical* category hiding a sense from somewhere
else. These got the `senses` treatment — the mechanism `lib/senses.js` exists for:

```js
'vaj loog'  english: 'garden; enclosed property'   + { en: 'kingdom', context: 'reading' }
'Askiv'     english: 'United Kingdom; England'     + { en: 'English', context: 'reading' }
```

A COUNTRIES card that accepted "English" was answering a different question than
the deck asked. There are now 58 entries carrying tagged senses, all passing.

### Eight cards that had two right answers

Same `english`, twice, in one category — a quiz drawing a distractor from its own
deck could mark a correct answer wrong. Disambiguated **only where the difference
is derivable from a word the vocabulary already holds**, and the gloss now cites
it:

| headword | was | now |
|---|---|---|
| `daim teb` | farm; field | a field — with "daim", the classifier for flat things |
| `pluas tav su` | lunch | lunch — the "tav su" (midday) meal |
| `tsev nyeem ntawv` | library | library — literally the "nyeem" (reading) house |
| `tsev qiv ntawv` | library | library — literally the borrowing house |
| `kua hau` | soup | soup — literally "hau" (boiled) liquid |
| `Teb Chaws Meskas` | United States; America | the United States — "teb chaws" names it explicitly as a country |
| `Teb Chaws Nplog` | Laos | the country of Laos — "teb chaws" names it explicitly as a country |
| `tsov rog` | war | war; warfare — the usual full form |

> ⚠️ **No Hmong was invented here.** Every parenthetical cites a headword already
> in the file — `daim`, `tav su`, `nyeem`, `hau`, `teb chaws`. The pairs where no
> such difference was derivable were left alone and tagged instead (below). This
> repo's own notes warn that authoring Hmong is not engineering, and a confident
> wrong gloss is worse than a duplicated one.

### Formatting

Trailing whitespace stripped file-wide; runs of 3+ blank lines collapsed to one
(the `animals` array was carrying ten whitespace-only lines from hand edits).
Line endings normalised to CRLF, matching the rest of the file — the spliced
batch had arrived LF. `npx eslint src/data/vocabulary.js` is clean.

---

## 4. Left alone on purpose — 9 entries tagged `needs-review`

`needs-review` was already a convention here: `human-anatomy-face` carries two.
Seven were added, so nothing can quietly forget them.

**`qhov ntswg` — and this is the one I got backwards first.** The new
`body-health` entry glosses it "nostril"; `human-anatomy-face` has had it as
"nose" since the beginning. I initially reported the anatomy entry as the likely
error, reasoning that `qhov` is the aperture classifier. It isn't that simple:
the anatomy category ships **three** `qhov-compound` entries and the pattern is
consistent across all of them —

```
qhov muag  = eye      (not eye socket)
qhov ncauj = mouth    (not mouth hole)
qhov ntswg = nose
```

So "nose" is likely right and the *new* entry is the odd one out. Both readings
are attested, both are kept, both are tagged. **The correction matters more than
the answer**: one entry read in isolation suggested a defect in a three-entry
pattern that had been right all along.

| entry | why |
|---|---|
| `body-qhov-ntswg` | "nostril" vs anatomy's "nose" — above |
| `country-pem` | "Myanmar; Burma", identical to `Mias Mas`. `Pem` normally means "over there, yonder" |
| `war-rog` | `rog` is also "overweight" in `descriptions` |
| `ag-daus` / `ag-kaus` | both "to scoop", no derivable difference |
| `food-tshuaj-yej` / `drink-maj` | both "tea", no derivable difference |

---

## 5. Headwords that already existed — 49, and mostly fine

`wordLookup` indexes by `hmongRPA` across every category and, since 2026-09-13,
**keeps every sense** rather than letting array order pick a winner. A duplicate
headword adds a sense to the reader's long-press modal instead of overwriting
one. The genuine homonyms:

```
txiv        classifier for fruits  vs  father / husband          ← see below
mis         milk                   vs  breast
no          cold                   vs  this; these
rog         war                    vs  overweight
teb         farm; field            vs  answer; reply
kaus        to scoop               vs  umbrella
liab        monkey                 vs  red
sia         life                   vs  to fasten belts and straps
suab ncha   famous                 vs  echo
khiav       to run                 vs  operate; flee; escape
qee         to reduce; to save     vs  some, certain
```

> ⚠️ **`txiv` is the case `check-vocabulary.mjs` was written for**, and it just
> gained a fourth sense. The checker's own header names it: `txiv` in `family`
> once read "father · husband · man · fruit", making a FAMILY card test a fruit.
> The new `ag-txiv` entry is correctly scoped — it sits in
> `agriculture-foodstuffs` and glosses only the classifier — so the family cards
> are untouched. That is the right shape for a homonym: one entry per domain,
> each gloss answering only its own deck's question.

`body-health` re-glosses four anatomy words identically (`hauv caug` knee,
`luj tshib` elbow, `puab tsaig` chin, `nplaig` tongue). Harmless, but the reader
sees the same definition twice. A dedupe pass is worth doing; nothing breaks
without it.

`countries-nationalities` introduces **51 capitalised headwords**, which nothing
else in the vocabulary has. Nothing breaks: `normalizeWord` lowercases before
matching, so reader lookup still finds them.

---

## 6. What this import moves, and what it does not

### It moves: 30 new sentence-builder noun chips

`lib/partsOfSpeech.js` keys off **category ids**, not tags, and `animals` is one
of its noun sources. Merging the 31 animal words into the existing category
tagged 30 of them `noun` for free.

```
part-of-speech index: 242 → 272   (+30 noun)
lost or changed: none
```

Worth measuring because that tagger **refuses on ambiguity** — a word claimed by
two tags gets none, so adding a noun that is already an adjective elsewhere
*removes* a chip label. It did not happen: `liab` (monkey / red) survives because
the "red" entry lives in `misc`, not a tagger source. That is the failure mode to
re-check on the next batch, especially if anything lands in `colors`,
`descriptions` or `classifiers`.

None of the 13 *new* categories is a tagger source, so their entries are
untagged. Adding `agriculture-foodstuffs`, `food-drinks` and `buildings-places`
to the `noun` list would tag a few hundred more — and could only be done after
the five English placeholders were gone, since the tagger would have happily
chipped `nplej barley` as a noun.

### It does not move: the two fields the app actually consumes

```
                      start      now
words                    926     1393
with exampleSentence     308      308   ← unchanged
coverage                 33%      22%
with audioFile           211      211   ← unchanged
coverage                 23%      15%
```

**Every one of the 467 new entries has `audioFile: null` and no
`exampleSentence`.** The sentence builder draws its exercises *exclusively* from
`exampleSentence`, so this import produced zero new exercises. Reader lookup
coverage was already 99.4% across the live stories before any of it landed
(measured 2026-09-16).

That is not an argument against the import — a dictionary should have words in
it, and the reader's long-press modal genuinely reaches all 467. It is the reason
to expect the app to feel unchanged.

The count is now **93% of the 1,500-word target** in
`instructions/adding-vocabulary.md`. If that target was ever a proxy for "the app
has enough content", it is about to be met without the content arriving. Worth
retiring the number, or restating it as *words with an example sentence*.

---

## 7. Verification

```
node scripts/check-vocabulary.mjs   → PASSES (58 tagged cards, 0 problems)
npx eslint src/data/vocabulary.js   → clean
all 488 source entries accounted    → 483 live, 5 commented out, 0 drifted
duplicate ids across 1,393          → none
duplicate category ids              → none
categoryGroups                      → more(3), everything else themed
partsOfSpeech index                 → 242 → 272, 0 lost
```

## 8. Still open

- **Audio: 467 entries on the recording backlog.** The only part of the pipeline
  that cannot be done at a keyboard.
- **`exampleSentence` for anything in this batch that will be taught** — and this
  is the item that decides whether the import was worth anything.
- The 9 `needs-review` entries (§4).
- Restoring the 5 commented-out placeholders with real headwords (§3).
- The four `body-health` / anatomy duplicate glosses (§5).
- `_incoming/hmong_vocab_dataset.ts` can be deleted now that it is merged.

Related: [2026-09-16-vocab-depth-not-breadth-and-grammar-grouped],
[2026-09-13-lookup-wrong-sense], [2026-08-18-vocabulary-head-face-category].

---

# 9. Restructure — 62 → 77 categories, and `misc` finally emptied (same day)

The import landed 14 compound categories and left three catch-alls holding a
third of the vocabulary. This pass separates them, and removes the duplicates
that only became visible once things sat next to each other.

**1,393 → 1,357 words** (36 commented out). **62 → 77 categories.** `misc`,
`misc-phrases` and `general-vocabulary` are at **zero live words**.

---

## 9.1 ⚠️ Spacing is not a variant — it is a different word, and `;` was not the only one

The user's report: *"certain words, like `tiam sis`, or `neem kaum` are redundant,
because they already exist as `tiamsis`, or `neemnkaum` — certain words like that
have no spacing in it."*

Six pairs, found by keying every headword on `hmongRPA` with the spaces removed:

| solid, canonical | spaced copy | evidence |
|---|---|---|
| `tiamsis` [conjunctions] | `tiam sis` [misc-phrases] | canonical has recorded audio |
| `lossis` [conjunctions] | `los sis` [misc-phrases] | canonical has recorded audio |
| `neesnkaum` [numbers] | `nees nkaum` [misc-phrases] | canonical has recorded audio |
| `pejxeem` [general-vocabulary] | `pej xeem` [misc-phrases] | — |
| `Fabkis` [countries] | `Fab Kis` [misc] | canonical also carries the nationality |
| `Teb Chaws Meskas` [countries] | `Tebchaws Meskas` [misc] | **runs the other way** — see below |

Three of the six survivors have audio recorded against the solid spelling, which
settles which one the app already treats as real. All six redundant copies sat in
`misc` / `misc-phrases`, which is the expected direction: those are filled from
story text, so a word already taught in a deck arrives there again spelled the
way it appeared on the page.

> ⚠️ **SOLID IS NOT ALWAYS RIGHT, AND `Tebchaws Meskas` IS THE COUNTER-EXAMPLE.**
> There the spacing runs backwards: `teb chaws` ("country") is two words — `teb`
> (land) and `chaws` (place) are each their own entry — so `Teb Chaws Meskas` is
> correct and the solid `Tebchaws` is the variant. The rule is not "prefer solid",
> it is **whether the parts are words on their own**. A dedupe script that just
> stripped spaces and kept the shorter string would have deleted the right entry
> here.

Nothing was lost: `tiam sis`'s extra sense "however" was merged into
`conjunctions-but` (now `'but; however'`), `pej xeem`'s "the public" into
`gen-pejxeem`, and `nees nkaum`'s compound examples onto `numbers-20` as a
comment, respelled solid.

### Then the same question, asked two more ways

**Catch-all copies of words a real deck already teaches — 30 found, 23 commented
out.** `pog koob`, `hnov`, `nyom`, `noob`, `ntsej muag`, `xub pwg`, `pob taws`,
`phom`, `cawv`, `av`, `hnub tim` and more, each duplicating an entry in
`relatives`, `body-health`, `botany`, `war-conflict`, `drinks`… They were not
breaking anything — `wordLookup` merges senses — but they showed the reader the
same definition twice and left the word looking untaught.

> ⚠️ **SEVEN WERE LEFT ALIVE ON PURPOSE.** `taub` (which also means "to
> understand" in `to taub`), `tawm`, `khiav`, `pib`, `dej` ("a river"), `khw`
> (which carries the "lub khw muas zaub mov" grocery-store example) and `qee` all
> have a sense or a usage example their topical twin lacks. Two more — `ua mov`
> ("to cook rice") and `taug kev` ("to travel on foot") — were the *more precise*
> of the pair, so their gloss was merged into the topical entry before the copy
> was dropped. Tidying a list is not worth losing reader-facing meaning.

**Classifier-prefix pairs — 28 found, 7 commented out.** `lub tsheb`/`tsheb`,
`pob zeb`/`zeb`, `tus tsov`/`tsov`, `lub noob`/`noob`, `lub hauv siab`/`hauv
siab`, `tsheb kauj vab`, `tus muam`.

> ⚠️ **A CLASSIFIER IS NOT A SPELLING VARIANT, AND MOST OF THESE 28 ARE NOT
> REDUNDANT.** The classifier is grammatically required in most contexts and this
> app teaches that as a core concept. `lub nroog` / `nroog` and `lub xeev` /
> `xeev` were kept precisely because the bare entries carry the
> `"Lub Nroog Green Bay"` and `"Xeev Wisconsin"` usage examples — the placement
> rule a learner gets wrong. `tsev kawm ntawv` / `kawm ntawv` was kept because a
> building is not the activity inside it. Only a catch-all copy adding no sense
> and no example was dropped.

---

## 9.2 Ethnicities out of countries — and out of the glosses too

`countries-nationalities` (54) → **`countries` (51)** + **`ethnicities` (3)**.
The tags already carried the distinction and the three ethnicity ids were already
prefixed `eth-`, so the split was a fact in the data, not a judgement.

The deeper half of the same problem was inside eight glosses:

```
Fabkis     'France; French'     Suav       'China; Chinese'
Thaib      'Thailand; Thai'     Nyab Laj   'Vietnam; Vietnamese'
Qhab Meem  'Cambodia; …'        Nyij Pooj  'Japan; Japanese'
Kaus Lim   'Korea; Korean'      Askiv      'United Kingdom; England; English'
```

`;` means synonyms of ONE sense (§2) — and a country is not a people. Now that
`ethnicities` exists there is somewhere to tag the second half to, so each became:

```js
english: 'China',
senses: [
  { en: 'China',   context: 'countries' },
  { en: 'Chinese', context: 'ethnicities', note: 'the people and the language' },
]
```

**The shared headword is correct and stays.** Hmong genuinely uses one word for
the place and the people; it was the CARD that had two answers, not the word.
A countries card now answers "China", and the reader's long-press still gets both.

---

## 9.3 The other four compound splits

Split only where the tags or id prefixes already encoded an unambiguous division.
`agriculture-foodstuffs`, `cooking`, `body-health` and `vehicles-travel` were
**left alone** — their tags overlap (`agriculture` sits on 57 of 60 entries), so
any cut would have been invention rather than separation.

| was | became |
|---|---|
| `geography-nature-weather` (41) | `geography` (9) · `nature` (10) · `weather` (22) |
| `chores-directions` (20) | `chores` (12) · `directions` (8) |
| `food-drinks` (34) | merged into `food` (+22) · `drinks` (12) |
| `buildings-places` (46) | merged into `buildings` (+40) · `places` (+6) |

> **`nature` already existed with ZERO words.** Filling it beat creating a
> near-twin beside it — which is also how the one bug in this pass surfaced: the
> append logic looked for a `],` line to insert before, and `nature` carried
> `words: []` on a single line, so all ten entries landed in `relatives`
> instead. Caught by the checker's `strayed` rule, which compares each entry's
> `category` against the array it physically sits in. That rule exists because of
> a 2026 bug with six household-room words; it paid for itself again here.

`food-drinks` and `buildings-places` were **merges, not new categories**, because
`food`, `buildings` and `places` already existed — the import had created
duplicate concepts (`buildings` 13 words beside `buildings-places` 46) and this
removes them.

---

## 9.4 `misc` (300 words) → 13 browsable reading groups

`misc`, `misc-phrases` and `general-vocabulary` held **449 words — a third of the
vocabulary** — in three undifferentiated piles.

**49 moved out to the deck that actually asks about them:** `toj` (hill) and
`hav zoov` (forest) → `geography`; `qhov rais`/`qhov rooj` (window/door) →
`household-rooms`; `xim`/`daj`/`liab` → `colors`; `xov xwm` (news) and `keeb kwm`
(history) → `arts-culture`; `Cuaj Hlis`/`Peb Hlis` → `months`; and so on.

> ⚠️ **THE REGEX THAT PROPOSED THESE ALSO PROPOSED `txhawb` ("to encourage, to
> support, to egg on") FOR *FOOD*** — it matched `egg` — **and `nuv` ("to bow; to
> fish") for *ANIMALS*.** Every row was read before it was accepted, and the verbs
> the classifier wanted to move for their objects — `tawg` (to burst, and of a
> flower to bloom), `cog` (to plant), `caij` (to ride), `nuv`, `txhawb` — were all
> left in reading groups instead. A keyword classifier proposes; it does not
> decide.

`Cuaj Hlis` needed one more thought: `months` already teaches all twelve in the
full `lub cuaj hli ntuj` form, so moving the short form in as another "September"
would have created the two-right-answers bug from §3. Its gloss now reads
*"September, short form of `lub cuaj hli ntuj`"*.

**The remaining 388 were grouped by subject:**

```
reading-general   73    reading-motion    47    reading-body      33
reading-speech    33    reading-law       30    reading-qualities 30
reading-people    28    reading-place     25    reading-time      25
reading-mind      21    reading-quantity  18    reading-emotion   13
reading-work      11
```

### ⚠️ Why they are 13 categories but ONE domain

This is the part that is easy to get wrong later. The split is for **browsing**,
not for decks — so all 13 are registered in three places to keep them behaving
exactly as `misc` did:

1. **`lib/senses.js`** — every one maps to the `'reading'` domain. A sense tagged
   `reading` must show on a long-press from any of them. Give one its own domain
   and its senses stop reaching the others.
2. **`scripts/check-vocabulary.mjs`** — all 13 added to `NOT_TOPICAL`, so a
   multi-sense gloss here still needs no `senses` array. **This is the one
   widening of that set that is not the mistake its own comment warns about**: the
   test is not "it has mixed senses", it is "nothing browses this as a deck".
   `general-vocabulary` was deliberately left OUT of `NOT_TOPICAL` to keep that
   line visible.
3. **`CATEGORY_THEMES`** — a new **Reading Support** theme, so they are findable.
   `misc` itself was deliberately never themed; the entire point of splitting 300
   words by subject is that someone can find one, so these are.

Without step 2, moving 91 multi-sense `' · '` glosses out of the exemption would
have forced 91 `senses` arrays **and** trimmed 91 card glosses to a single sense.
That was the alternative on the table, and it changes what those cards teach.

`reading-general` (73) is still a waiting room — but it is a 73-word one instead
of a 300-word one, and the words in it are the ones no rule could place honestly
rather than the ones nobody sorted.

### The three shells are empty and still present

`misc`, `misc-phrases` and `general-vocabulary` have **0 live words** and remain
in "More". They are kept deliberately: they hold the 52 commented-out entries as
an archive, and `senses.js` and `check-vocabulary.mjs` still name them. They will
render as empty-state cards.

---

## 9.5 What moved in the sentence builder, and the one chip that was lost

`lib/partsOfSpeech.js` keys off **category ids**, so a restructure moves it.

```
part-of-speech index: 272 → 356   (+88 newly tagged)
lost: `liab`  (noun → none)
```

**The loss is the tagger working correctly.** Moving `liab` ("red") into `colors`
put it in an *adjective* source while `liab` ("monkey") sits in `animals`, a
*noun* source — so it is now a homograph across two tags and the tagger refuses
to label it. That refusal is the design: a chip labelled "noun" on a word that
might mean "red" would teach a wrong rule in the one drill where a learner is
actively looking for structure.

This is the exact failure mode flagged in §6 as "the thing to re-check on the
next batch". It was re-checked, it happened, and it was the right outcome.

---

## 9.6 Verification

```
node scripts/check-vocabulary.mjs   → PASSES (65 tagged cards, 0 problems)
npx eslint (3 changed files)        → clean (1 pre-existing warning in the
                                       checker, confirmed against the original)
categories                          → 77, 0 with a `category` that strays from
                                       its array, 0 duplicate ids
catch-alls                          → misc 0, misc-phrases 0, general-vocabulary 0
themes                              → every category themed except those three
partsOfSpeech                       → 272 → 356, 1 loss, correct (§9.5)
```

## 9.7 Still open

- **Audio and `exampleSentence` are untouched by any of this**: still 211 and 308.
  Coverage is now 15% and 23% of 1,357. This remains the only thing that changes
  what the app can teach.
- `reading-general` (73) — drain as words find a group.
- The 9 `needs-review` entries (§4).
- The 5 commented-out English placeholders (§3) and the 36 commented-out
  duplicates from this pass, if any turn out to carry a sense worth restoring.
- `calendar-day` (`hnub` = "day") duplicates `timeframes-day` (`hnub` = "day,
  sun") across two real categories. Left alone — both pre-date the import and
  `calendar` only has 3 words — but it is the same class of redundancy.
- `paj kws` and `pob kws` both mean "corn" with different headwords; `Nplog teb`
  and `Teb Chaws Nplog` both mean Laos. Variant forms, not spacing — a native
  speaker should say which is taught.

---

# 10. `body-health` routed into the four anatomy categories (same day)

`body-health` arrived from the import holding 42 entries, of which **30 were body
PARTS** — and the app already had four categories for exactly those, split by
region. A "Body & Health" deck sitting beside "Head & Face", "Upper Body",
"Lower Body" and "Internal Organs" was a fifth overlapping answer to a question
those four already answered.

**1,357 → 1,351 words.** Category count unchanged at 77.

| category | was | now |
|---|---|---|
| `human-anatomy-face` | 15 | **23** |
| `human-anatomy-upper-body` | 10 | **16** |
| `human-anatomy-lower-body` | 11 | **21** |
| `human-anatomy-internal-organs` | 12 | 12 |
| `body-health` | 42 | **12** |

Routed by region: `ntsiab muag` (pupil), `dim muag` (eyelid), `kauj tsaim` (jaw),
`hniav txab` (wisdom tooth), `pos hniav` (gums), `lub caj pas` (throat) → **face**;
`quav npab` (inner elbow), `dab teg` (wrist), `sab npab nqia` (forearm),
`sab npab ntug` (biceps), `tus txha caj qaum` (spine) → **upper**; `duav` (waist),
`qhov raws` (behind the knee), `ncej qab` (hamstring), `xib taws` (heel),
`qab xib taws` (sole) → **lower**.

`gen-taubteg` (fingerprint) and `gen-kab-lia` (dimple) came out of
`general-vocabulary` in the same pass — they were body parts too.

## What is left in `body-health`, and why it was retitled

The id stays (it is what every remaining entry's `category` field says, and
changing it would mean touching all of them for nothing), but the title no longer
describes parts:

**"Senses, Actions & Health"** — `ua pa` (breathe), `hnoos` (cough), `hnov tau`
(feel), `mloog` (listen), `hnov` (hear), `khawb` (scratch), `tshee` (shiver),
`tsw qab` (smell), `chwv` (touch), `rua lo` (yawn), plus `lub cev` (the body as a
whole) and `hiav` (age spots).

That is a real deck with a real question — *what does the body DO* — rather than a
second list of parts. A ⚠️ comment on the category says not to add parts to it.

---

## 10.1 Six more duplicates, and one of them is a typo

Only visible once the parts sat beside their regional twins:

```
nplaig       tongue   — human-anatomy-face already has `nplaig`
puab tsaig   chin     — human-anatomy-face already has `puab tsaig`
luj tshib    elbow    — human-anatomy-upper-body already has `luj tshib`
hauv caug    knee     — human-anatomy-lower-body already has `hauv caug`
cov ntiv taw toes     — `ntiv taw` (toe) + the plural marker `cov`
plab jlaub   calf     — ⚠️ TYPO
```

> ⚠️ **`plab jlaub` is not a variant spelling of `plab hlaub`.** `j` for `h`. It
> is the same class of slip as the spacing duplicates (§9.1) — a single character
> making one word look like two — and it would have sat in the deck as a second,
> wrong way to say "calf". Commented out with the reasoning, restorable if
> `jlaub` turns out to be real.

That makes **three** mechanical ways a duplicate hid in this dataset, all found
only by comparing normalised forms rather than strings:

1. spacing — `tiam sis` / `tiamsis`
2. a classifier or marker in front — `cov ntiv taw` / `ntiv taw`
3. a one-character typo — `plab jlaub` / `plab hlaub`

## 10.2 ⚠️ Four that look identical and were NOT touched

Same body part, **different headword** — which is a variant to be resolved, not a
copy to be deleted. Deleting either would silently pick a winner:

| new | existing | part |
|---|---|---|
| `puj ntaws` | `ntaws` | navel |
| `dab taw` | `pob taws` | ankle |
| `sab ncej puab` | `ncej puab` | thigh |
| `sab kavhlaub` | `caj hlaub` | shin |

All four are tagged `needs-review` and annotated, and they were moved to sit
**beside** their twin, so the disagreement is visible in one category instead of
split across two. Some may be regional, some whole-vs-part (`sab ncej puab` may
be one side of the thigh); `sab kavhlaub` / `caj hlaub` looks like it could be
another `plab jlaub`, but is far enough apart that guessing would be wrong.

`needs-review` is now at 13 entries.

## 10.3 `kab lia` — `;` used where `' · '` was meant

`gen-kab-lia` was glossed **"dimple; mealworm"**. Those are not synonyms, so per
§2 the separator was wrong in the source — and routing it to `human-anatomy-face`
would have put a card that answers "mealworm" in the face deck. Split properly:

```js
english: 'dimple',
senses: [
  { en: 'dimple',   context: 'body' },
  { en: 'mealworm', context: 'reading', note: 'unrelated sense; needs a speaker to confirm' },
]
```

This is the third entry to need the treatment, after `vaj loog` and `Askiv`, and
it is the first one found by *moving* a word rather than by reading its gloss —
the routing forced the question "what does a card in THIS deck answer?".

## 10.4 Verification

```
node scripts/check-vocabulary.mjs   → PASSES (66 tagged cards, 0 problems)
npx eslint src/data/vocabulary.js   → clean
categories / words                  → 77 / 1,351, 0 strayed, 0 duplicate ids
partsOfSpeech index                 → 356 → 379 (+23), nothing lost
```

> ⚠️ **The four anatomy categories are written with DOUBLE quotes and a 2-space
> indent**, unlike every other category in this file. A single-quote search finds
> none of them and returns -1, which is how the first run of this pass failed. If
> you script against this file, match `['"]`.
