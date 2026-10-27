# Sib Suab Zauv: the tone-shift key, and a unit right after Muaj (2026-10-25)

*"Mhmm can you write this in for me actually… but basically author that into it first,
athen illprovide the kay also make a path for it too."*
*"trigger shifts need to be early, make it so that users learn this after muaj"*

The author delivered this subject in two parts on the same day. This note records the
ruling, because the key is the author's own grammar and nothing in the code explains where
it came from.

## What the key says

Two trigger tones, and only two:

- **Cim Siab** (-b), the high tone
- **Cim Ntuj** (-j), the high-falling tone

The trigger must come **first**, and the shifting word must follow **directly after** it.
That order is the grammatical relationship between them — break the order and there is no
shift. The trigger keeps its own tone; the word after it is the one that changes.

Three tones never shift: **-b** (Cim Siab), **-g** (Cim Neeg), **-d** (Cim Tod).

### The five patterns

```
-s      → -g      low           → breathy falling     tus  → tug    tais → taig
-m      → -g      low-falling   → breathy falling     daim → daig   zaum → zaug
-j      → -g      high-falling  → breathy falling     leej → leeg   dej  → deg
no tone → -s      mid           → low                 lo   → los    hmo  → hmos
-v      → no tone rising        → mid                 qav  → qa     cev  → ce
```

⚠️ **Four of the ten examples are established expressions, not free patterns**, and the
author flagged each one. They are in the lesson *with* that flag:

| phrase | meaning | why it is not a rule |
| --- | --- | --- |
| `thawj zaug` | the first time | fixed expression, not general counting |
| `poob deg` | to drown | `poob dej` separately means "fall into water" |
| `nab qa` | lizard | fixed compound; does not license `-v → ∅` anywhere |
| `ib ce` | the whole body, all over | fixed expression |

Strip those notes and five documented patterns become five rules a learner over-applies —
they would go and say `haus deg` for "drink water".

### The author's closing caveat, which is the most important line in the lesson

> Tone shifts won't happen in every phrase, and not every -b or -j word will trigger one
> depending on the writer or speaker, usually to help reinforce clarity within words… But
> when these shifts do occur, you now know what causes them and why the word changes.

## Why "numerical"

The author: it is called numerical because the shift *mostly appears in words with
numbers* — number + classifier (`ib tug`, `ob daig`) is where learners meet it. The
pattern itself is broader, which is why the lesson ends on `poob deg` and `thawj zaug`.

⚠️ This got its own `## Why it is called numerical` section after the author pointed out it
was missing. It was not missing — both of their sentences were in the draft, buried inside
other paragraphs. **Presence is not prominence.** If the author asks for something they
already supplied, check whether it has a heading before concluding it is absent.

## The tens prove the rule, and ninety breaks it

A ten is a digit plus `caum`, and whether it stays `caum` or becomes `caug` depends
entirely on the digit in front. Verified against the dictionary's own entries:

```
pebcaug     30   peb  (-b)  → shifts
plaubcaug   40   plaub(-b)  → shifts
tsibcaug    50   tsib (-b)  → shifts
raucaum     60   rau  (—)   → no trigger, no shift
xyacaum     70   xya  (—)   → no trigger, no shift
yimcaum     80   yim  (—)   → no trigger, no shift
neesnkaum   20   nees (-s)  → -s is not a trigger, no shift
cuajcaum    90   cuaj (-j)  → TRIGGER, but NO SHIFT  ⚠️
```

Eight of nine hold. **Ninety is a genuine counter-example**: the rule predicts `cuajcaug`.

⚠️ **It is not a data error, and `numbers-90` must not be "corrected".** `cuajcaum` has a
recording — `vocabulary/numbers/hmong-numbers-cuajcaum.mp3`. A spelling can be a typo; a
clip of the author saying `cuajcaum` cannot be. So ninety is the author's own closing
caveat happening inside the tens, and the lesson **names it** rather than omitting it: a
learner who has just been taught that -j triggers will count to ninety themselves and
conclude the lesson is wrong.

## What was built

| file | change |
| --- | --- |
| `src/data/lessons/tone-shifts-guidelines-numerical.js` | the lesson: 17 headings, 61 example lines, 20 example cards, 6 practice questions |
| `src/data/vocabulary.js` | `grammar-tone-shifts-guidelines-numerical` — 16 cards (10 pattern pairs + 2 trigger cards + the never-shift card + the five-pattern summary) |
| `src/data/path.js` | `u-tone-shifts-numerical` at `order: 10.75` — **after Muaj**, per the author |
| `src/data/lessons.js` | wired into the Foundations/tones group |
| `src/lib/vocabAccess.js` | FREE. Tone shifts are grammar and the tones are already free |
| `notes/TODO.md` | unreviewed count 1077 → 1128 (see below) |

`order: 10.75` rather than renumbering: Muaj is 10.5, This & That is 11. Fractional orders
are the house pattern precisely so a unit can be inserted by the author's instruction
without touching 34 other units' ids.

### Only three of the four shift categories are still missing

The lesson covers **trigger shifts, numerical**. The author's taxonomy has four:

- trigger shifts: **numerical** ← done · **rootword** ← not written
- variation shifts: **final position** ← not written · **expression** ← not written

`placeholder: true` stays on the lesson for that reason. It is the author's own framing and
it is accurate: this is one quarter of the subject, finished.

## Two things found while building it

**`parseExample()` splits on the FIRST ` — ` only.** A quick-reference line written as
`pattern — description — example` renders with the example buried in the English. The fix
is the parenthetical form, which `parseExample` reads as the `note`:

```
'> -s → -g — low becomes breathy falling (tus → tug)'
   hmong: '-s → -g'   english: 'low becomes breathy falling'   note: 'tus → tug'
```

**The TODO.md unreviewed count had been stale and silently failing.** `check-notes.mjs`
asserts the stated number equals a live grep, and it had drifted 1077 → 1128. Only **17**
of those +51 came from this date's work; **34 accrued between 2026-10-02 and 2026-10-25
with nobody re-running the count**. The entry is now a measurement, not an audit trail —
grep for the tag, do not read the trail upward.

⚠️ The four container classifiers (`tais`, `poom`, `rooj`, `tsev`), `verbs-ce` and this
lesson's prose carry **no** `'unreviewed'` tag, on purpose: they are the author's own words
delivered verbatim, and tagging them would queue the author to review the author.

## The deck was rebuilt the same day

*"need to make the flashcards better, archive the current ones, need to focus on the
triggers, the ones that trigger, etc."*

The 16 pattern cards are **commented out in place** at the top of the set's `words` array
with a `RESTORE by uncommenting` hint. 12 phrase cards replaced them.

### Why the first deck was clunky

Every front was an abstract pattern string — `tus → tug`, `daim → daig`, `leej → leeg` —
and **ten of the sixteen glosses began "the -X tone becomes -g"**. Two consequences:

1. A generated quiz put four near-identical options on screen. The learner picks by
   elimination and learns nothing.
2. The pattern was on the **front**. The card showed you the answer and asked you to
   recall a restatement of it.

### What the new deck does

Front is a real phrase from the author's own key sentences; back is its meaning, with the
trigger **named**:

```
ib tug          one — of a person or animal. Ib (-b) shifts tus to tug
ib taig mov     a bowlful of rice. Ib (-b) shifts tais to taig
ob daig ntawv   two sheets of paper. Ob (-b) shifts daim to daig
ob leeg         two people. Ob (-b) shifts leej to leeg
ib los lus      one word. Ib (-b) shifts lo to los
ib ce           the whole body. Ib (-b) shifts cev to ce
cuaj nkawg      nine pairs. Cuaj (-j) shifts nkawm to nkawg
thawj zaug      the first time. Thawj (-j) shifts zaum to zaug
poob deg        to drown. Poob (-b) shifts dej to deg
ib tug nab qa   a lizard — TWO shifts in one phrase
-b thiab -j     the two tones that TRIGGER a shift
-b, -g, -d      the three tones that never shift themselves
```

⚠️ **Every answer is distinct on purpose** — "two people", "nine pairs", "to drown", "the
first time". Keep that property when adding a card, or the elimination problem comes back.

⚠️ **-b appears on both concept cards, deliberately.** Cim Siab triggers a shift and never
shifts itself. The asymmetry is the thing worth knowing, and both glosses say it outright.

⚠️ **No `'unreviewed'` tag on any of the 12.** The Hmong is the author's own, from the key.

### Two phrases left out of the deck on purpose

Both already exist with recordings, and a second copy puts two correct answers in one quiz:

- `ib hmos` — `time-ib-hmos` in `timeframes`, "one night / all night long"
- `nab qa` — `animal-nab-qa` in `animals`, "lizard"

So `hmo → hmos` is **already attested in the dictionary, with audio, independently of this
lesson**. `nab qa` is taught inside `ib tug nab qa`, which carries two shifts and is the
better card anyway. Verified by audit: 0 duplicate ids dictionary-wide, 0 duplicate answers
in the set, 0 fronts colliding with another set.

## Still open

- **`ib tag hmos`** (midnight, `time-ib-tag-hmos`, recorded) looks like it breaks the
  adjacency half of the key: `hmos` is shifted, but it does **not** sit directly after the
  trigger `ib` — `tag` is in between. Either it is a fixed compound that shifted as a
  whole, or the trigger here is something other than `ib`. **Not taught in the lesson, and
  no explanation invented for it** — it needs the author's ruling.

- **`u-classifiers` now resolves to 24 words**, over the playbook's 20 cap, because the
  four container classifiers landed in it. `check-path` is red on this and on
  `u-common-nouns` (22). Needs the author's call: leave it, add a `limit`, or hand-pick a
  `words` list. Hiding four words the author just added is the one option not to take
  silently.
- Seven `u-calendar` word references point outside its categories — pre-existing, unrelated.
