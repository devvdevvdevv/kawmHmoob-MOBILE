# Vocab needs depth, not breadth — and Grammar grouped (2026-09-16)

Answering "should I add more vocab words?" with measurements rather than
instinct, then two changes that followed from it.

---

## 1. The answer is no, and the numbers are lopsided

### Reader lookup coverage is already 99.4%

Across the **3 live stories** (block comments stripped — the unfinished stories
live inside one and naive grepping counts them), running the reader's own
tokenizer and `wordLookup`'s three tiers:

```
distinct words in the live stories : 530
not definable by ANY tier          :   3   (0.6%)
```

The entire miss list:

| word | hits | verdict |
|---|---|---|
| `hau` | 4 | **correct** miss — half of `taub hau`; not a word alone, and `wordLookup` says so by design |
| `mis` | 2 | genuinely absent |
| `hlwb` | 1 | genuinely absent (brain) |

Two real gaps. Another hundred words fixes nothing a reader would ever notice.

> ⚠️ **Measure with the consumer's own tokenizer.** My first pass split on
> whitespace and reported 96% coverage with 18 "misses" like `vang—ib` and
> `xyoos—tau` — which I nearly wrote up as an em-dash tokenizer bug. The reader
> already splits on em-dashes (`line.hmong.split(/(\s+|[—–])/)`). The bug was in
> the measurement, and it would have sent someone hunting a defect that does not
> exist. Re-run with the real split: 99.4%, three misses.

### Example sentences are the actual bottleneck

```
                 at ~523 words        now
words                    523          877   (+354)
with exampleSentence     306          309   (+3)
coverage                 59%          35%   ← going backwards
```

**568 of 877 words have no `exampleSentence`.** The sentence builder draws
exercises *exclusively* from that field, so those 568 words are invisible to it.
The vocabulary nearly doubled and the drill gained about 1% more content.

Every example sentence written against an EXISTING word:

- creates a sentence-builder exercise immediately
- counts toward the 5 needed to unlock a theme group on the builder hub
- feeds tier 1/2 of the reader's long-press lookup

Highest-value target is unchanged from the 08-29 note: **Common Descriptions**
(26 words). It is the adjective source, and the "adjectives follow the noun"
grammar hint still has ~5 sentences in the whole app that can trigger it.

> **Breadth was never the constraint.** Adding words is the visible kind of
> progress — the count goes up. Depth is what the two features that consume
> vocabulary actually read.

---

## 2. Grammar unit grouped

`src/data/lessons.js` — `grammarUnit` was a flat array of ten lessons. Ten
unlabelled cards is precisely the "wall of cards" that `groups` was introduced
to fix in Foundations, and grammar had the worse version: the **three pronoun
lessons sat at positions 1, 6 and 7**, with verbs, questions and classifiers
between them.

```
Who You Are Talking About   pronouns · demonstratives · possessives
Actions and Time            action verbs · tense markers
Naming and Describing       classifiers · yog · adjectives · describing people ★
Asking and Joining          question words · conjunctions
```

★ new, see below.

**No UI work was required** — the unit screen already renders `groups` when a
unit declares them, and `withLessons()` still derives the flat `lessons` array,
so routing, progress keys and the Learn hub are untouched. Verified: all ten
original lessons still present, no duplicate ids across the 120 in
`src/data/lessons/`.

⚠️ The order inside **Naming and Describing** is load-bearing. Classifiers first
because both describing lessons use one (`tus poj niam…`); then `yog` and
`adjectives` adjacent, which the old flat list carried an explicit comment
demanding — "no 'to be' before an adjective" is one rule seen from both sides.

---

## 3. New lesson: Describing People

`src/data/lessons/describing-people.js` → `grammar-describing-people`,
`vocab: 'personality-siab'` (15 words).

### The rule it teaches — the user's, given 2026-09-16

> `tus poj niam zoo siab` is the more accurate term when describing something
> directly, rather than `tus poj niam yog ib tus neeg zoo siab`, which is used
> when describing a concept.

Direct description attaches the adjective (classifier → noun → adjective).
Routing it through `yog` wraps the adjective into a noun phrase — *one happy
person* — which sorts the person into a **category** instead of describing them.
English blurs this ("she is happy" / "she is a happy person"), so reaching for
the `yog` form by default is a clear English-speaker tell.

### ⚠️ Both halves were already taught, on opposite sides of the unit

`yog-to-be.js` explains that `yog` equates nouns and carries essence — it even
ships `Tus pojniam yog ib tus neeg zoo.` as an example. `adjectives.js` explains
that an adjective follows its noun with no copula. **Neither puts the two
constructions against each other and says which to reach for.** That gap is the
whole lesson, which is why it sits last in its group rather than replacing
either.

### On authoring it

`zoo siab` was checked in `vocabulary.js` before use, not assumed: it glosses
*"glad, happy (lit. 'good liver')"*. Worth knowing that the `siab` expressions
run in both orders with different senses — `siab phem` (mean), `siab dav`
(generous) versus `zoo siab` (happy) — so they are taught as whole units rather
than assembled from parts.

⚠️ **Every sentence I extrapolated is marked `TODO-VERIFY`**, per the convention
`adjectives.js` already uses. I do not speak Hmong; the rule above is the
user's and the glosses are copied from the vocabulary, but sentences like
`Tus me nyuam siab dav.` are my constructions and need a native speaker. This
lesson teaches a distinction subtle enough that a confident wrong sentence would
be worse than no lesson.

⚠️ **Audio deliberately omitted.** Most `personality-siab` entries carry
`audioFile: null`, and an unresolvable audio path is a silent no-op rather than
an error. Add `audio` per item once recordings exist, so
`scripts/check-lesson-audio.mjs` can assert them.

---

## Still open

- **"Grammar modules for writing text"** was also requested and is NOT done —
  the scope was too open to author blind. See the question put back to the user;
  authoring several lessons of unverifiable Hmong is the failure mode this
  repo's own notes warn about ("writing them is authoring Hmong, not
  engineering").
- The `TODO-VERIFY` lines in the new lesson.
- `mis` and `hlwb` as vocabulary entries — the only two real dictionary gaps.

Related: [2026-08-29-sentence-builder-barebones],
[2026-09-15-nav-guard-and-reading-tile-unlocked],
[2026-09-13-lookup-wrong-sense].
