# Multi-entry dictionary batch: nplooj, kwv, tshaj, tua, tshuab, kiav — and ntsiab corrected (2026-10-02)

Author ruling. One correction, one removal, one widening, and eight new entries
following the **rau / tom qab / hnub** pattern: the same headword appearing as
separate cards in the categories where each sense is actually met.

Companion: [2026-09-30-word-definition-rulings.md](2026-09-30-word-definition-rulings.md).

---

## How the pattern works, and why it is worth the duplication

`WordDetail` builds `otherCards` from `headwordOf(word.hmongRPA)?.definitions`
([src/components/vocabulary/WordDetail.jsx](../src/components/vocabulary/WordDetail.jsx)),
so **two entries sharing a headword cross-link automatically** — the learner
lands on one meaning and can jump to the other. No registry, no manual linking:
adding the entry is the whole job.

⚠️ **`category` must match the array the entry sits in.** It decides both the
card's context tag and which senses render, and
`scripts/check-vocabulary.mjs` enforces it. Changing the field without moving
the entry fails silently in two places.

---

## 1. ❌ REMOVED: `kuv` = "spear"

`wpn-kuv` (weapons) is gone — the author: **incorrect**. `kuv` is the pronoun
"I". The spear is **`hmuv`** (`wbs-hmuv`), already correct in the same category.

It entered 2026-09-30 from the author's weapons list and was flagged at the top
of that category as a homonym needing confirmation. This is the confirmation,
and the answer was no.

**Commented out in place, not deleted** — so the same word is not re-added from
the same source list later.

⚠️ **Still unconfirmed from that list: `hais` = "to stab"** (also "to say"). Same
flag, same source, no ruling yet.

## 2. ⚠️ CORRECTED AND MOVED: `ntsiab`

**The only entry in this batch that lost its old meaning.** Was
`'to grab or claw at'`, a verb in `reading-motion`. That was simply wrong.

Now in **`reading-mind`**:

> main; central; key, essential (adjective) · the main point; the core, the gist
> (noun) · **lub ntsiab lus** = the meaning, the main idea, the central message,
> the theme · **ntsiab cai** = a fundamental principle, a core rule · kernel;
> core — the inner part of something, in concrete use

Example: *Lub ntsiab lus ntawm lo lus no yog dab tsi?* — "What is the meaning of
this word?"

**Moved, not relabelled** — the entry was cut from the `reading-motion` array and
re-inserted in `reading-mind`, per the category rule above.

**One entry, not several.** The senses all circle a single idea (what is
central). The split pattern is for meanings a learner meets in *unrelated*
lessons; these are one word viewed from several angles. `lub ntsiab lus` is in
the gloss because it is the form actually heard, and bare `ntsiab` alone would
not tell a reader what they had tapped.

## 3. New multi-entries

Each shares a headword with something already in the dictionary. **No original
entry was changed.**

| headword | new entry | category | the existing sibling(s) |
|---|---|---|---|
| **nplooj** | a leaf (plant/tree) · a page (book/paper), singular | `reading-general` | `classifiers-nplooj` — the classifier |
| **kwv** | to carry something on your shoulder | `reading-motion` | younger brother ×2 (`family-male-perspective`, `relatives`) |
| **tshaj** | to spread, broadcast, announce — *tshaj tawm* | `reading-speech` | `misc-tshaj` — pass / exceed / comparative |
| **tua** | to turn off, put out, extinguish — *tua teeb*, *tua hluav taws* | `daily-life` | `misc-tua` (full list), `war-tua` (shoot) |
| **tua** | to beat; to strike an instrument | `arts-culture` | as above |
| **tshuab** | to blow — mouth, fan, wind | `reading-motion` | *(new word — neither sense existed)* |
| **tshuab** | a machine; an engine | `tools-household` | as above |
| **kiav** | to turn; to veer, change direction | `reading-motion` | *(new word — neither sense existed)* |
| **kiav** | a scar | `body-health` | as above |

### ⚠️ `tshuab` and `kiav` did not exist at all

The author gave both as *additions* to known words — "kiav, apart from scar…".
**Neither headword was in the dictionary in any form.** So both senses of each
were created rather than one being appended to an existing entry.

Worth confirming the "known" senses are right, since they were assumed rather
than read: **`kiav` = a scar**, **`tshuab` = a machine/engine**.

### Why `tua` was split rather than extended

`misc-tua` already carried five senses in one `·` list. Nothing was taken out of
it — it is the **reading-glossary** entry, where a tap on an unknown word should
show everything at once. The two new cards serve **browsing**, where "turn off
the light" is the commonest everyday use of `tua` and was reachable only by
reading to the fourth item of a five-sense list.

That is the general shape: **one comprehensive entry for lookup, separate entries
for browsing, cross-linked by headword.**

### Why `tshaj` was split

Someone meeting `tshaj` in *loj tshaj* ("biggest") and someone meeting it in
*tshaj tawm* ("announce") are not looking for the same card. Same spelling,
different word to a learner.

## 4. Widened: `ntsis`

Was `'tip, end — "me ntsis", a little'`. Now **`the tip, the peak, the very end
of something`**, keeping `me ntsis`.

"Peak" and "the very end" are what make it usable for a mountain top or the end
of a branch rather than only an abstract endpoint. `me ntsis` stays because it is
the form a reader meets most often and would be unfindable otherwise.
`unreviewed` → `reviewed`.

---

## 5. The audit: 106 more split candidates

> *"Identify words that have more than one definition within the dictionary."*

A scan for entries whose gloss carries `·`-separated senses returns **106
entries**. The densest:

| senses | word | category |
|---|---|---|
| 6 | `cai` | reading-law |
| 5 | `koom` | reading-work |
| 5 | `yeeb` | reading-general |
| 4 | `txhaum` | reading-law |
| 4 | `ntuj` | reading-body |
| 4 | `to` | reading-mind |
| 4 | `lees`, `twg`, `tsi`, `hlis`, `sib`, `seev` | reading-speech |
| 4 | `dua`, `ntaus` | reading-motion |
| 4 | `kawg`, `tom` | reading-place |
| 3 | `txim`, `pov`, `tuag` | reading-law |

**Deliberately not acted on.** Splitting is a judgement per word — whether two
senses are genuinely different *words to a learner*, and which category each
belongs in — and 106 of those made unilaterally would be 106 chances to put a
card in the wrong place. `ntuj` in `reading-body` is the clearest example of one
worth a human look.

Reproduce the list with:

```bash
node -e "import('./src/data/vocabulary.js').then(v=>{
  const all=v.categories.flatMap(c=>c.words.map(w=>({...w,cat:c.id})));
  all.filter(w=>(w.english||'').includes(' · '))
     .map(w=>({w:w.hmongRPA,n:w.english.split(' · ').length,cat:w.cat}))
     .sort((a,b)=>b.n-a.n).forEach(x=>console.log(x.n,x.w,x.cat));
})"
```

⚠️ **A high sense-count is not automatically a split.** `ntsiab` has five and
stayed one entry, because they are one idea seen from several angles. The test
is whether a learner would meet the senses in **unrelated lessons**.

---

## Verification

```
scripts/check-vocabulary.mjs   68 tagged cards · each shows one answer ✅
scripts/check-splits.mjs       5 sets → 14 parts ✅
scripts/check-sense-pins.mjs   all 2 pins valid ✅
eslint                         clean
2,029 entries · 0 duplicate ids · 0 category mismatches
```

Headword groupings after the batch:

```
tua      4  daily-life, arts-culture, war-conflict, reading-motion
kwv      3  family-male-perspective, relatives, reading-motion
tshuab   2  tools-household, reading-motion
kiav     2  body-health, reading-motion
nplooj   2  classifiers, reading-general
tshaj    2  reading-speech, reading-motion
ntsiab   1  reading-mind
ntsis    1  reading-general
```

## Open

- [ ] Confirm **`hais` = "to stab"** — flagged with `kuv`/spear on 2026-09-30 from
      the same list, still unruled.
- [ ] Confirm the assumed senses **`kiav` = a scar** and **`tshuab` = a
      machine/engine** — created from the author's framing, not from an existing
      entry.
- [ ] The 106 split candidates above, as and when each is worth a ruling.
- [ ] New example sentences are `source: 'ai'` and want a read.
